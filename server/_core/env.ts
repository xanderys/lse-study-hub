export const ENV = {
  // Database
  databaseUrl: process.env.DATABASE_URL ?? "file:./local.db",
  
  // Supabase
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY ?? "",
  
  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  
  // App Config
  cookieSecret: process.env.JWT_SECRET ?? "dev-secret-change-in-production",
  isProduction: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT ?? "5000"),
  localMode: process.env.LOCAL_MODE === "true",
};
