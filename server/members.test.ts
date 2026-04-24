import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return ctx;
}

describe("members router", () => {
  describe("members.add", () => {
    it("should validate required fields", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.members.add({
          name: "",
          role: "Developer",
          email: "test@example.com",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Name is required");
      }
    });

    it("should validate email format", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.members.add({
          name: "John Doe",
          role: "Developer",
          email: "invalid-email",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error.message).toContain("Valid email required");
      }
    });

    it("should accept valid member data", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.members.add({
        name: "John Doe",
        role: "Developer",
        email: "john@example.com",
        phone: "+1234567890",
        bio: "A skilled developer",
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("John Doe");
      expect(result.role).toBe("Developer");
      expect(result.email).toBe("john@example.com");
      expect(result.phone).toBe("+1234567890");
      expect(result.bio).toBe("A skilled developer");
    });

    it("should handle optional fields", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.members.add({
        name: "Jane Smith",
        role: "Designer",
        email: "jane@example.com",
      });

      expect(result).toBeDefined();
      expect(result.name).toBe("Jane Smith");
      expect(result.phone).toBeNull();
      expect(result.bio).toBeNull();
    });
  });

  describe("members.getAll", () => {
    it("should return list of members", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // Add a test member first
      await caller.members.add({
        name: "Test Member",
        role: "Tester",
        email: "test@example.com",
      });

      const result = await caller.members.getAll();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name).toBeDefined();
      expect(result[0].role).toBeDefined();
      expect(result[0].email).toBeDefined();
    });
  });

  describe("members.getById", () => {
    it("should return member by id", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      // Add a test member
      const addedMember = await caller.members.add({
        name: "Specific Member",
        role: "Developer",
        email: "specific@example.com",
      });

      // Retrieve by id
      const result = await caller.members.getById({ id: addedMember.id });

      expect(result).toBeDefined();
      expect(result.name).toBe("Specific Member");
      expect(result.role).toBe("Developer");
      expect(result.email).toBe("specific@example.com");
    });

    it("should throw error for non-existent member", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.members.getById({ id: "000000000000000000000000" });
        expect.fail("Should have thrown error");
      } catch (error: any) {
        expect(error.message).toContain("Member not found");
      }
    });
  });
});
