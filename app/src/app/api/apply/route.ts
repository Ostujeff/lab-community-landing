import { NextRequest, NextResponse } from "next/server";
import { applySchema } from "@/lib/validation";
import { insertLead } from "@/lib/db";
import { sendLeadNotification, sendApplicantConfirmation } from "@/lib/telegram";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ ok: false, error: "rate_limit" }, { status: 429 });
    }

    const body = await req.json();
    const parsed = applySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, errors: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    if (data.website) return NextResponse.json({ ok: true });

    insertLead({
      name: data.name,
      contact: data.contact,
      role: data.role,
      ai_level: data.ai_level,
      diploma_idea: data.diploma_idea,
      contributions: JSON.stringify(data.contributions || []),
      desired_tier: data.desired_tier,
      portfolio_url: data.portfolio_url || undefined,
      source: data.source,
    });

    try {
      await sendLeadNotification({
        name: data.name,
        contact: data.contact,
        role: data.role,
        ai_level: data.ai_level,
        diploma_idea: data.diploma_idea,
        contributions: data.contributions,
        desired_tier: data.desired_tier,
      });
    } catch (err) {
      console.error("Telegram admin notification failed:", err);
    }

    try {
      await sendApplicantConfirmation(data.contact, data.name);
    } catch (err) {
      console.error("Telegram applicant confirmation failed:", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Apply API error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
