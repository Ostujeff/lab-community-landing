import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import ApplyForm from "@/components/ApplyForm";
import Footer from "@/components/Footer";
import { apply } from "@/lib/copy";

export default function ApplyPage() {
  return (
    <main className="landing min-h-screen">
      <SiteHeader />
      <section className="section-pad max-w-2xl mx-auto">
        <Link href="/" className="text-sm text-text-muted hover:text-text-primary no-underline">← На главную</Link>
        <h1 className="text-3xl font-semibold mt-6">{apply.title}</h1>
        <div className="mt-8 p-6 rounded-lg border border-line bg-bg-panel">
          <h2 className="font-semibold">{apply.intro.title}</h2>
          <ul className="mt-4 space-y-2 text-sm text-text-secondary">
            {apply.intro.items.map((item) => (
              <li key={item} className="check-item">{item}</li>
            ))}
          </ul>
        </div>
        <div className="mt-10"><ApplyForm /></div>
      </section>
      <Footer />
    </main>
  );
}
