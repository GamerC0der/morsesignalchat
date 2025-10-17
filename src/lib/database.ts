import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

async function getConnection() {
  if (!connection) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    connection = await mysql.createConnection(databaseUrl);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS sessions (
        code VARCHAR(4) PRIMARY KEY,
        peer_uuid VARCHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
  }
  return connection;
}

export interface Session {
  code: string;
  peer_uuid: string;
  created_at: string;
  updated_at: string;
}

interface QueryResult {
  affectedRows: number;
}

export async function createOrUpdateSession(code: string, peerUuid: string): Promise<boolean> {
  try {
    const conn = await getConnection();
    await deleteExpiredSessions();
    await conn.execute(
      'INSERT INTO sessions (code, peer_uuid) VALUES (?, ?) ON DUPLICATE KEY UPDATE peer_uuid = VALUES(peer_uuid), updated_at = CURRENT_TIMESTAMP',
      [code, peerUuid]
    );
    return true;
  } catch (_error) {
    return false;
  }
}

export async function getSessionByCode(code: string): Promise<Session | null> {
  try {
    const conn = await getConnection();
    await deleteExpiredSessions();
    const [rows] = await conn.execute(
      'SELECT * FROM sessions WHERE code = ?',
      [code]
    );
    return (rows as Session[])[0] || null;
  } catch (_error) {
    return null;
  }
}

export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const conn = await getConnection();
    const [result] = await conn.execute(
      "DELETE FROM sessions WHERE created_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE)"
    );
    return (result as QueryResult).affectedRows || 0;
  } catch (_error) {
    return 0;
  }
}

async function deleteExpiredSessions(): Promise<void> {
  const conn = await getConnection();
  await conn.execute(
    "DELETE FROM sessions WHERE created_at < DATE_SUB(NOW(), INTERVAL 15 MINUTE)"
  );
}

export async function getAllActiveSessions(): Promise<Session[]> {
  try {
    const conn = await getConnection();
    await deleteExpiredSessions();
    const [rows] = await conn.execute(
      'SELECT * FROM sessions ORDER BY created_at DESC'
    );
    return rows as Session[];
  } catch (_error) {
    return [];
  }
}

