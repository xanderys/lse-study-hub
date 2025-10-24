// Simple authentication system
import { ENV } from './_core/env';
import { createClient } from '@supabase/supabase-js';
import type { Request, Response } from 'express';

let supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabase && ENV.supabaseUrl && ENV.supabaseAnonKey) {
    supabase = createClient(ENV.supabaseUrl, ENV.supabaseAnonKey);
  }
  return supabase;
}

export type User = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: 'user' | 'admin';
};

// Local mode: create a default user
const LOCAL_USER: User = {
  id: 1,
  openId: 'local-user',
  name: 'Local User',
  email: 'local@example.com',
  role: 'admin',
};

export async function getUserFromRequest(req: Request): Promise<User | undefined> {
  // Local mode - no auth required
  if (ENV.localMode) {
    return LOCAL_USER;
  }

  // Check for Supabase session
  const client = getSupabaseClient();
  if (client) {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data, error } = await client.auth.getUser(token);
      
      if (!error && data.user) {
        return {
          id: 1, // Will be looked up from our database
          openId: data.user.id,
          name: data.user.user_metadata?.name || data.user.email || 'User',
          email: data.user.email || null,
          role: 'user',
        };
      }
    }
  }

  // Check for session cookie (simple JWT fallback)
  const sessionCookie = req.cookies?.session;
  if (sessionCookie) {
    try {
      // Simple base64 decode for local development
      const decoded = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());
      return decoded as User;
    } catch (error) {
      console.error('[Auth] Failed to decode session:', error);
    }
  }

  return undefined;
}

export function setUserSession(res: Response, user: User) {
  // Simple base64 encoding for local development
  const encoded = Buffer.from(JSON.stringify(user)).toString('base64');
  res.cookie('session', encoded, {
    httpOnly: true,
    secure: ENV.isProduction,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: 'lax',
  });
}

export function clearUserSession(res: Response) {
  res.clearCookie('session');
}

