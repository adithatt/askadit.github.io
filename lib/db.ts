import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "askadit.db");

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  db = new Database(DB_PATH);
  initSchema(db);
  seedIfEmpty(db);
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      section TEXT NOT NULL,
      title TEXT NOT NULL,
      photo TEXT,
      preview TEXT,
      content TEXT
    );
    CREATE TABLE IF NOT EXISTS quotes (
      id TEXT PRIMARY KEY,
      quote_text TEXT NOT NULL,
      author TEXT NOT NULL,
      reflection TEXT
    );
  `);
}

const DEFAULT_TOPICS: [string, string, string, string, string, string][] = [
  [
    "usa",
    "countries",
    "USA",
    "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop",
    "Where ancient temples meet neon-lit streets, and every meal feels like a ceremony.",
    "Where ancient temples meet neon-lit streets, and every meal feels like a ceremony. The attention to detail in everything—from train schedules to tea ceremonies—taught me that excellence is in the small things.",
  ],
  [
    "iceland",
    "countries",
    "Iceland",
    "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800&h=600&fit=crop",
    "A land of fire and ice where nature reminds you how small you are.",
    "A land of fire and ice where nature reminds you how small you are. The midnight sun in summer and the northern lights in winter—both experiences that reset your sense of time and place.",
  ],
  [
    "getting-lost",
    "outdoors",
    "The Art of Getting Lost",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    "Sometimes the best trails are the ones you never planned to take.",
    "Sometimes the best trails are the ones you never planned to take. Getting lost isn't a failure—it's an opportunity to discover something you didn't know you were looking for.",
  ],
  [
    "rain-hiking",
    "outdoors",
    "Why Rain Makes Everything Better",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&h=600&fit=crop",
    "There's something about hiking in the rain that clears your head.",
    "There's something about hiking in the rain that clears your head. The sound, the smell, the way everything looks more alive. Plus, you get the trails all to yourself.",
  ],
  [
    "packing",
    "guides",
    "How to Pack Like You Actually Know What You're Doing",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    "Lessons learned from one too many overstuffed suitcases.",
    "Lessons learned from one too many overstuffed suitcases. The golden rule: if you think you might need it, you probably don't. But always pack an extra pair of socks.",
  ],
  [
    "multi-day-hike",
    "guides",
    "Your First Multi-Day Hike: A Friendly Reality Check",
    "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop",
    "Everything I wish someone had told me before my first backpacking trip.",
    "Everything I wish someone had told me before my first backpacking trip. Spoiler: it's going to hurt, but it's also going to be amazing. Here's how to prepare.",
  ],
];

const DEFAULT_QUOTES: [string, string, string, string][] = [
  [
    "lao-tzu",
    "The journey of a thousand miles begins with a single step.",
    "Lao Tzu",
    "A reminder that every big adventure starts with a single step. I think about this whenever I'm procrastinating on something that feels too big to tackle. Just start.",
  ],
  [
    "tolkien",
    "Not all those who wander are lost.",
    "J.R.R. Tolkien",
    "This one hits different when you're actually lost on a trail. But more seriously, it's a beautiful reminder that exploration and curiosity are valid life paths, not just detours.",
  ],
  [
    "proust",
    "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.",
    "Marcel Proust",
    "Travel isn't just about going places—it's about learning to see differently. The same principle applies to revisiting familiar places or ideas with fresh perspective.",
  ],
];

function seedIfEmpty(database: Database.Database) {
  const topicCount = database.prepare("SELECT COUNT(*) as c FROM topics").get() as { c: number };
  if (topicCount.c > 0) return;

  const insertTopic = database.prepare(
    "INSERT INTO topics (id, section, title, photo, preview, content) VALUES (?, ?, ?, ?, ?, ?)"
  );
  for (const row of DEFAULT_TOPICS) insertTopic.run(...row);

  const insertQuote = database.prepare(
    "INSERT INTO quotes (id, quote_text, author, reflection) VALUES (?, ?, ?, ?)"
  );
  for (const row of DEFAULT_QUOTES) insertQuote.run(...row);
}

export type Topic = {
  id: string;
  section: string;
  title: string;
  photo: string;
  preview: string;
  content: string;
};

export type Quote = {
  id: string;
  quote_text: string;
  author: string;
  reflection: string;
};

export function getTopics(section: string): Topic[] {
  const database = getDb();
  const stmt = database.prepare(
    "SELECT id, section, title, photo, preview, content FROM topics WHERE section = ?"
  );
  return stmt.all(section) as Topic[];
}

export function getTopic(section: string, id: string): Topic | null {
  const database = getDb();
  const stmt = database.prepare(
    "SELECT id, section, title, photo, preview, content FROM topics WHERE section = ? AND id = ?"
  );
  const row = stmt.get(section, id);
  return (row as Topic) ?? null;
}

export function getQuotes(): Quote[] {
  const database = getDb();
  const stmt = database.prepare("SELECT id, quote_text, author, reflection FROM quotes");
  return stmt.all() as Quote[];
}

export function getQuote(id: string): Quote | null {
  const database = getDb();
  const stmt = database.prepare(
    "SELECT id, quote_text, author, reflection FROM quotes WHERE id = ?"
  );
  const row = stmt.get(id);
  return (row as Quote) ?? null;
}

export function addTopic(topic: {
  id: string;
  section: string;
  title: string;
  photo?: string;
  preview?: string;
  content?: string;
}) {
  const database = getDb();
  database
    .prepare(
      "INSERT INTO topics (id, section, title, photo, preview, content) VALUES (?, ?, ?, ?, ?, ?)"
    )
    .run(
      topic.id,
      topic.section,
      topic.title,
      topic.photo ?? "",
      topic.preview ?? "",
      topic.content ?? ""
    );
}

export function updateTopic(
  section: string,
  id: string,
  data: { title?: string; photo?: string; preview?: string; content?: string }
) {
  const database = getDb();
  database
    .prepare(
      "UPDATE topics SET title = ?, photo = ?, preview = ?, content = ? WHERE section = ? AND id = ?"
    )
    .run(
      data.title ?? "",
      data.photo ?? "",
      data.preview ?? "",
      data.content ?? "",
      section,
      id
    );
}

export function deleteTopic(section: string, id: string) {
  const database = getDb();
  database.prepare("DELETE FROM topics WHERE section = ? AND id = ?").run(section, id);
}

export function addQuote(quote: {
  id: string;
  quote_text: string;
  author: string;
  reflection?: string;
}) {
  const database = getDb();
  database
    .prepare("INSERT INTO quotes (id, quote_text, author, reflection) VALUES (?, ?, ?, ?)")
    .run(quote.id, quote.quote_text, quote.author, quote.reflection ?? "");
}

export function updateQuote(
  id: string,
  data: { quote_text?: string; author?: string; reflection?: string }
) {
  const database = getDb();
  database
    .prepare("UPDATE quotes SET quote_text = ?, author = ?, reflection = ? WHERE id = ?")
    .run(
      data.quote_text ?? "",
      data.author ?? "",
      data.reflection ?? "",
      id
    );
}

export function deleteQuote(id: string) {
  const database = getDb();
  database.prepare("DELETE FROM quotes WHERE id = ?").run(id);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 11);
}
