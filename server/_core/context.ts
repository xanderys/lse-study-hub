import type { Request, Response } from "express";
import { getUserFromRequest as getUser } from "../auth";

export type User = {
  id: number;
  openId: string;
  name: string | null;
  email: string | null;
  role: "admin" | "user";
};

export async function getUserFromRequest(
  req: Request
): Promise<User | undefined> {
  return await getUser(req);
}
