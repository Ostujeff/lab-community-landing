import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath =
  process.env.DATABASE_PATH || path.join(process.cwd(), "data", "leads.db");

let db: Database.Database | null = null;

function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export function getDb(): Database.Database {
  if (!db) {
    ensureDir(dbPath);
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id            INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at    TEXT NOT NULL DEFAULT (datetime('now')),
        name          TEXT NOT NULL,
        contact       TEXT NOT NULL,
        role          TEXT,
        ai_level      TEXT,
        diploma_idea  TEXT,
        contributions TEXT,
        desired_tier  TEXT,
        portfolio_url TEXT,
        source        TEXT,
        utm           TEXT,
        status        TEXT NOT NULL DEFAULT 'new',
        notes         TEXT
      );
    `);
  }
  return db;
}

export interface LeadRow {
  name: string;
  contact: string;
  role?: string;
  ai_level?: string;
  diploma_idea?: string;
  contributions?: string;
  desired_tier?: string;
  portfolio_url?: string;
  source?: string;
  utm?: string;
}

export function insertLead(lead: LeadRow): number {
  const stmt = getDb().prepare(`
    INSERT INTO leads (name, contact, role, ai_level, diploma_idea, contributions, desired_tier, portfolio_url, source, utm)
    VALUES (@name, @contact, @role, @ai_level, @diploma_idea, @contributions, @desired_tier, @portfolio_url, @source, @utm)
  `);
  const result = stmt.run({ ...lead, utm: lead.utm ?? null });
  return Number(result.lastInsertRowid);
}
