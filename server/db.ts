import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";
import type { InsertMember, InsertUser, Member, User } from "../shared/types";
import { ENV } from "./_core/env";

let connectionPromise: Promise<typeof mongoose> | null = null;

const userSchema = new Schema(
  {
    openId: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: null },
    email: { type: String, default: null },
    loginMethod: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user", required: true },
    lastSignedIn: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true }
);

const memberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: null },
    bio: { type: String, default: null },
    imageUrl: { type: String, default: null },
    imageKey: { type: String, default: null },
  },
  { timestamps: true }
);

type UserRecord = Omit<User, "id">;
type UserDocument = HydratedDocument<UserRecord>;
type MemberRecord = Omit<Member, "id">;
type MemberDocument = HydratedDocument<MemberRecord>;

const UserModel: Model<UserRecord> =
  (mongoose.models.User as Model<UserRecord>) || mongoose.model<UserRecord>("User", userSchema);

const MemberModel: Model<MemberRecord> =
  (mongoose.models.Member as Model<MemberRecord>) || mongoose.model<MemberRecord>("Member", memberSchema);

function ensureDate(value: unknown): Date {
  return value instanceof Date ? value : new Date(value as string | number | Date);
}

function mapUser(doc: UserDocument | null): User | undefined {
  if (!doc) return undefined;
  const obj = doc.toObject();
  return {
    id: doc._id.toString(),
    openId: obj.openId,
    name: obj.name ?? null,
    email: obj.email ?? null,
    loginMethod: obj.loginMethod ?? null,
    role: obj.role,
    createdAt: ensureDate(obj.createdAt),
    updatedAt: ensureDate(obj.updatedAt),
    lastSignedIn: ensureDate(obj.lastSignedIn),
  };
}

function mapMember(doc: MemberDocument | null): Member | undefined {
  if (!doc) return undefined;
  const obj = doc.toObject();
  return {
    id: doc._id.toString(),
    name: obj.name,
    role: obj.role,
    email: obj.email,
    phone: obj.phone ?? null,
    bio: obj.bio ?? null,
    imageUrl: obj.imageUrl ?? null,
    imageKey: obj.imageKey ?? null,
    createdAt: ensureDate(obj.createdAt),
    updatedAt: ensureDate(obj.updatedAt),
  };
}

// Lazily connect so local tooling can run without a DB.
export async function getDb() {
  const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL;

  if (!mongoUri) {
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUri).catch((error) => {
      connectionPromise = null;
      console.warn("[Database] Failed to connect:", error);
      throw error;
    });
  }

  await connectionPromise;
  return mongoose.connection;
}

async function requireDb() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available. Set MONGODB_URI in your environment.");
  }
  return db;
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

  const update: Partial<InsertUser> = {};
  const nullableFields = ["name", "email", "loginMethod"] as const;

  for (const field of nullableFields) {
    if (user[field] !== undefined) {
      update[field] = user[field] ?? null;
    }
  }

  update.lastSignedIn = user.lastSignedIn ?? new Date();
  update.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : undefined);

  Object.keys(update).forEach((key) => {
    if (update[key as keyof typeof update] === undefined) {
      delete update[key as keyof typeof update];
    }
  });

  await UserModel.updateOne(
    { openId: user.openId },
    {
      $set: update,
      $setOnInsert: { openId: user.openId },
    },
    { upsert: true }
  );
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  return mapUser(await UserModel.findOne({ openId }));
}

export async function createMember(member: InsertMember): Promise<Member> {
  await requireDb();
  const created = await MemberModel.create(member);
  const mapped = mapMember(created);
  if (!mapped) throw new Error("Failed to create member");
  return mapped;
}

export async function getAllMembers(): Promise<Member[]> {
  await requireDb();
  const docs = await MemberModel.find().sort({ createdAt: 1 });
  return docs.map((doc) => mapMember(doc)).filter((member): member is Member => Boolean(member));
}

export async function getMemberById(id: string): Promise<Member | undefined> {
  await requireDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
  return mapMember(await MemberModel.findById(id));
}

export async function updateMember(
  id: string,
  updates: Partial<InsertMember>
): Promise<Member | undefined> {
  await requireDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
  return mapMember(await MemberModel.findByIdAndUpdate(id, updates, { new: true }));
}

export async function deleteMember(id: string): Promise<boolean> {
  await requireDb();
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const result = await MemberModel.findByIdAndDelete(id);
  return Boolean(result);
}

// TODO: add additional feature queries here as your schema grows.
