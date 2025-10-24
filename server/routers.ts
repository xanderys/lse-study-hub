import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { storagePut } from "./storage";
import { randomBytes } from "crypto";


export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(({ ctx }) => {
      // Return the user or a default local user
      if (ctx.user) {
        return ctx.user;
      }
      // Default local user for LOCAL_MODE
      return {
        id: 1,
        openId: 'local-user',
        name: 'Local User',
        email: 'local@example.com',
        role: 'user' as const,
      };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      return {
        success: true,
      } as const;
    }),
  }),

  modules: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserModules(ctx.user.id);
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        code: z.string().optional(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createModule({
          userId: ctx.user.id,
          ...input,
        });
        return { id };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteModule(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  slides: router({
    listByModule: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getModuleSlides(input.moduleId, ctx.user.id);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const slide = await db.getSlideById(input.id);
        if (!slide || slide.userId !== ctx.user.id) {
          throw new Error("Slide not found or unauthorized");
        }
        return slide;
      }),

    upload: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        title: z.string().min(1),
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        mimeType: z.string(),
        fileSize: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Generate random suffix for security
        const randomSuffix = randomBytes(8).toString('hex');
        const fileKey = `${ctx.user.id}/slides/${input.moduleId}/${randomSuffix}-${input.fileName}`;
        
        // Decode base64 and upload to S3
        const fileBuffer = Buffer.from(input.fileData, 'base64');
        const { url: fileUrl } = await storagePut(fileKey, fileBuffer, input.mimeType);

        // Extract text from PDF for RAG
        let extractedText = null;
        try {
          const pdfParse = require('pdf-parse');
          const pdfData = await pdfParse(fileBuffer);
          extractedText = pdfData.text;
        } catch (error) {
          console.error('Failed to extract PDF text:', error);
        }

        // Save to database
        const id = await db.createLectureSlide({
          moduleId: input.moduleId,
          userId: ctx.user.id,
          title: input.title,
          fileKey,
          fileUrl,
          fileName: input.fileName,
          fileSize: input.fileSize,
          mimeType: input.mimeType,
          extractedText,
        });

        return { id, fileUrl };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteSlide(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  annotations: router({
    list: protectedProcedure
      .input(z.object({ slideId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getSlideAnnotations(input.slideId, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        slideId: z.number(),
        type: z.enum(["highlight", "pen"]),
        pageNumber: z.number(),
        data: z.string(), // JSON string
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createAnnotation({
          userId: ctx.user.id,
          ...input,
        });
        return { id };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteAnnotation(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  questions: router({
    list: protectedProcedure
      .input(z.object({ slideId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getSlideQuestions(input.slideId, ctx.user.id);
      }),

    create: protectedProcedure
      .input(z.object({
        slideId: z.number(),
        content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createQuestion({
          userId: ctx.user.id,
          ...input,
        });
        return { id };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteQuestion(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  chat: router({
    getOrCreateSession: protectedProcedure
      .input(z.object({ slideId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        let session = await db.getChatSession(input.slideId, ctx.user.id);
        if (!session) {
          const id = await db.createChatSession({
            slideId: input.slideId,
            userId: ctx.user.id,
            systemPrompt: "You are a helpful study assistant. Help the student understand their lecture materials.",
          });
          session = await db.getChatSession(input.slideId, ctx.user.id);
        }
        return session;
      }),

    getMessages: protectedProcedure
      .input(z.object({ sessionId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getSessionMessages(input.sessionId);
      }),

    updateSystemPrompt: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        systemPrompt: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateChatSessionPrompt(input.sessionId, input.systemPrompt);
        return { success: true };
      }),

    sendMessage: protectedProcedure
      .input(z.object({
        sessionId: z.number(),
        message: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await db.createChatMessage({
          sessionId: input.sessionId,
          role: "user",
          content: input.message,
        });

        // Get session and messages for context
        const messages = await db.getSessionMessages(input.sessionId);
        
        // Get session to find slide ID
        const sessions = await (await db.getDb())?.select().from(require('../drizzle/schema').chatSessions).where(require('drizzle-orm').eq(require('../drizzle/schema').chatSessions.id, input.sessionId));
        const session = sessions?.[0];
        
        // Get slide with extracted text for RAG
        let pdfContext = "";
        if (session?.slideId) {
          const slide = await db.getSlideById(session.slideId);
          if (slide?.extractedText) {
            // Truncate to avoid token limits (keep first 10000 chars)
            pdfContext = slide.extractedText.substring(0, 10000);
          }
        }
        
        const { invokeLLM } = await import("./_core/llm");
        
        // Build messages with PDF context
        const systemMessage = session?.systemPrompt || "You are a helpful study assistant. Help the student understand their lecture materials.";
        const contextualSystemMessage = pdfContext 
          ? `${systemMessage}\n\nContext from lecture slides:\n${pdfContext}`
          : systemMessage;
        
        const llmMessages = [
          { role: "system" as const, content: contextualSystemMessage },
          ...messages.slice(-10).map(m => ({
            role: m.role as "user" | "assistant" | "system",
            content: m.content,
          }))
        ];
        
        const response = await invokeLLM({
          messages: llmMessages,
        });

        const assistantMessage = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : "I'm sorry, I couldn't generate a response.";

        // Save assistant response
        await db.createChatMessage({
          sessionId: input.sessionId,
          role: "assistant",
          content: assistantMessage,
        });

        return { message: assistantMessage };
      }),
  }),
});

export type AppRouter = typeof appRouter;
