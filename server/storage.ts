// Storage integration - Supabase Storage
import { ENV } from './_core/env';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Supabase client (only if configured)
let supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!supabase && ENV.supabaseUrl && ENV.supabaseServiceKey) {
    supabase = createClient(ENV.supabaseUrl, ENV.supabaseServiceKey);
  }
  return supabase;
}

// Local storage fallback
const LOCAL_STORAGE_DIR = join(process.cwd(), 'local_storage');

function ensureLocalStorage() {
  if (!existsSync(LOCAL_STORAGE_DIR)) {
    mkdirSync(LOCAL_STORAGE_DIR, { recursive: true });
  }
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");

  // Try Supabase first if configured
  const client = getSupabaseClient();
  if (client) {
    try {
      const buffer = typeof data === 'string' ? Buffer.from(data) : data;
      
      const { data: uploadData, error } = await client.storage
        .from('study-hub-files')
        .upload(key, buffer, {
          contentType,
          upsert: true,
        });

      if (error) throw error;

      const { data: urlData } = client.storage
        .from('study-hub-files')
        .getPublicUrl(key);

      return { key, url: urlData.publicUrl };
    } catch (error) {
      console.warn('[Storage] Supabase upload failed, falling back to local:', error);
    }
  }

  // Fallback to local file storage
  ensureLocalStorage();
  const filePath = join(LOCAL_STORAGE_DIR, key);
  const dirPath = join(LOCAL_STORAGE_DIR, key.split('/').slice(0, -1).join('/'));
  
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }

  const buffer = typeof data === 'string' ? Buffer.from(data) : Buffer.from(data);
  writeFileSync(filePath, buffer);

  // Return local URL
  const url = `/api/files/${key}`;
  return { key, url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");

  // Try Supabase first if configured
  const client = getSupabaseClient();
  if (client) {
    try {
      const { data } = client.storage
        .from('study-hub-files')
        .getPublicUrl(key);

      return { key, url: data.publicUrl };
    } catch (error) {
      console.warn('[Storage] Supabase get failed, falling back to local:', error);
    }
  }

  // Fallback to local
  const url = `/api/files/${key}`;
  return { key, url };
}

// Helper to serve local files
export function getLocalFile(relKey: string): Buffer | null {
  try {
    const filePath = join(LOCAL_STORAGE_DIR, relKey);
    if (existsSync(filePath)) {
      return readFileSync(filePath);
    }
  } catch (error) {
    console.error('[Storage] Failed to read local file:', error);
  }
  return null;
}
