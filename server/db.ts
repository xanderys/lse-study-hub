import { and, desc, eq } from "drizzle-orm";
import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import Database from 'better-sqlite3';
import { 
  InsertUser, 
  users,
  modules,
  lectureSlides,
  annotations,
  questions,
  chatSessions,
  chatMessages,
  InsertModule,
  InsertLectureSlide,
  InsertAnnotation,
  InsertQuestion,
  InsertChatSession,
  InsertChatMessage,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzleMysql> | ReturnType<typeof drizzleSqlite> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && ENV.databaseUrl) {
    try {
      // Use SQLite for local development (file:./local.db)
      if (ENV.databaseUrl.startsWith('file:')) {
        const dbPath = ENV.databaseUrl.replace('file:', '');
        const sqlite = new Database(dbPath);
        _db = drizzleSqlite(sqlite) as any;
        console.log('[Database] Connected to SQLite:', dbPath);
      } else {
        // Use MySQL for production
        _db = drizzleMysql(ENV.databaseUrl);
        console.log('[Database] Connected to MySQL');
      }
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Modules ============

export async function createModule(module: InsertModule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(modules).values(module);
  return result[0].insertId;
}

export async function getUserModules(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(modules).where(eq(modules.userId, userId)).orderBy(desc(modules.createdAt));
}

export async function getModuleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(modules).where(eq(modules.id, id)).limit(1);
  return result[0];
}

export async function deleteModule(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(modules).where(and(eq(modules.id, id), eq(modules.userId, userId)));
}

// ============ Lecture Slides ============

export async function createLectureSlide(slide: InsertLectureSlide) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(lectureSlides).values(slide);
  return result[0].insertId;
}

export async function getModuleSlides(moduleId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lectureSlides)
    .where(and(eq(lectureSlides.moduleId, moduleId), eq(lectureSlides.userId, userId)))
    .orderBy(desc(lectureSlides.createdAt));
}

export async function getSlideById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(lectureSlides).where(eq(lectureSlides.id, id)).limit(1);
  return result[0];
}

export async function deleteSlide(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(lectureSlides).where(and(eq(lectureSlides.id, id), eq(lectureSlides.userId, userId)));
}

// ============ Annotations ============

export async function createAnnotation(annotation: InsertAnnotation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(annotations).values(annotation);
  return result[0].insertId;
}

export async function getSlideAnnotations(slideId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(annotations)
    .where(and(eq(annotations.slideId, slideId), eq(annotations.userId, userId)))
    .orderBy(annotations.pageNumber);
}

export async function deleteAnnotation(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(annotations).where(and(eq(annotations.id, id), eq(annotations.userId, userId)));
}

// ============ Questions ============

export async function createQuestion(question: InsertQuestion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(questions).values(question);
  return result[0].insertId;
}

export async function getSlideQuestions(slideId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(questions)
    .where(and(eq(questions.slideId, slideId), eq(questions.userId, userId)))
    .orderBy(desc(questions.createdAt));
}

export async function deleteQuestion(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(questions).where(and(eq(questions.id, id), eq(questions.userId, userId)));
}

// ============ Chat Sessions ============

export async function createChatSession(session: InsertChatSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(chatSessions).values(session);
  return result[0].insertId;
}

export async function getChatSession(slideId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(chatSessions)
    .where(and(eq(chatSessions.slideId, slideId), eq(chatSessions.userId, userId)))
    .limit(1);
  return result[0];
}

export async function updateChatSessionPrompt(sessionId: number, systemPrompt: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(chatSessions)
    .set({ systemPrompt })
    .where(eq(chatSessions.id, sessionId));
}

// ============ Chat Messages ============

export async function createChatMessage(message: InsertChatMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(chatMessages).values(message);
  return result[0].insertId;
}

export async function getSessionMessages(sessionId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatMessages)
    .where(eq(chatMessages.sessionId, sessionId))
    .orderBy(chatMessages.createdAt);
}
