import { neon } from "@neondatabase/serverless"

let _sql: ReturnType<typeof neon> | null = null
function getSql() {
  if (!process.env.DATABASE_URL) return null
  if (_sql) return _sql
  _sql = neon(process.env.DATABASE_URL as string)
  return _sql
}

export async function insertScan(id: string, host: string, result: unknown) {
  const sql = getSql()
  if (!sql) return
  try {
    // table scans(id uuid primary key, host text not null, result jsonb not null, created_at timestamptz default now())
    await sql`insert into scans (id, host, result) values (${id}::uuid, ${host}, ${JSON.stringify(result)}::jsonb)`
  } catch {
    // ignore in preview if table is missing
  }
}

export async function insertNotification(email: string, domain: string) {
  const sql = getSql()
  if (!sql) return
  try {
    // table notifications(id uuid primary key, email text, domain text, created_at timestamptz default now())
    await sql`insert into notifications (id, email, domain) values (${crypto.randomUUID()}::uuid, ${email}, ${domain})`
  } catch {
    // ignore in preview
  }
}
