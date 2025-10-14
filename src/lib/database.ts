import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'sessions.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    code TEXT PRIMARY KEY,
    peer_uuid TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);
const insertSession = db.prepare(`
  INSERT OR REPLACE INTO sessions (code, peer_uuid, updated_at)
  VALUES (?, ?, CURRENT_TIMESTAMP)
`);

const getSession = db.prepare(`
  SELECT * FROM sessions WHERE code = ?
`);

const deleteExpiredSessions = db.prepare(`
  DELETE FROM sessions
  WHERE created_at < datetime('now', '-15 minutes')
`);

const getAllSessions = db.prepare(`
  SELECT * FROM sessions ORDER BY created_at DESC
`);

export interface Session {
  code: string;
  peer_uuid: string;
  created_at: string;
  updated_at: string;
}

export function createOrUpdateSession(code: string, peerUuid: string): boolean {
  try {
    deleteExpiredSessions.run();
    insertSession.run(code, peerUuid);
    return true;
  } catch (error) {
    console.error('Error creating/updating session:', error);
    return false;
  }
}

export function getSessionByCode(code: string): Session | null {
  try {
    deleteExpiredSessions.run();
    const session = getSession.get(code) as Session | undefined;
    return session || null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export function cleanupExpiredSessions(): number {
  try {
    const result = deleteExpiredSessions.run();
    return result.changes;
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
    return 0;
  }
}

export function getAllActiveSessions(): Session[] {
  try {
    deleteExpiredSessions.run();
    return getAllSessions.all() as Session[];
  } catch (error) {
    console.error('Error getting all sessions:', error);
    return [];
  }
}

process.on('exit', () => {
  db.close();
});

process.on('SIGINT', () => {
  db.close();
  process.exit();
});

process.on('SIGTERM', () => {
  db.close();
  process.exit();
});
