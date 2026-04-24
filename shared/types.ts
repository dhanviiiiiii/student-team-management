/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type UserRole = "user" | "admin";

export type User = {
  id: string;
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  lastSignedIn: Date;
};

export type InsertUser = {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role?: UserRole;
  lastSignedIn?: Date;
};

export type Member = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  imageKey?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertMember = {
  name: string;
  role: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  imageKey?: string | null;
};

export * from "./_core/errors";
