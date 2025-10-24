import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { Request, Response } from "express";
import { getUserFromRequest as getUser } from "../auth";

export type User = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: "admin" | "user";
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await getUser(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

export async function getUserFromRequest(
  req: Request
): Promise<User | undefined> {
  return await getUser(req);
}
