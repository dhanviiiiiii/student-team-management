import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createMember, getAllMembers, getMemberById } from "./db";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  members: router({
    add: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "Name is required").max(255),
          role: z.string().min(1, "Role is required").max(255),
          email: z.string().email("Valid email required"),
          phone: z.string().optional(),
          bio: z.string().optional(),
          imageData: z.string().optional(),
          imageName: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        let imageUrl: string | undefined;
        let imageKey: string | undefined;

        if (input.imageData && input.imageName) {
          try {
            const buffer = Buffer.from(input.imageData, "base64");
            const fileName = `members/${Date.now()}-${input.imageName}`;
            
            // Determine MIME type based on file extension
            const ext = input.imageName.toLowerCase().split(".").pop();
            let mimeType = "image/jpeg";
            if (ext === "png") mimeType = "image/png";
            else if (ext === "gif") mimeType = "image/gif";
            else if (ext === "webp") mimeType = "image/webp";
            
            const { url, key } = await storagePut(fileName, buffer, mimeType);
            imageUrl = url;
            imageKey = key;
          } catch (error) {
            console.error("Image upload failed:", error);
            throw new Error("Failed to upload image. Please try again.");
          }
        }

        const member = await createMember({
          name: input.name,
          role: input.role,
          email: input.email,
          phone: input.phone,
          bio: input.bio,
          imageUrl,
          imageKey,
        });

        return member;
      }),

    getAll: publicProcedure.query(async () => {
      return await getAllMembers();
    }),

    getById: publicProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(async ({ input }) => {
        const member = await getMemberById(input.id);
        if (!member) {
          throw new Error("Member not found");
        }
        return member;
      }),
  }),
});

export type AppRouter = typeof appRouter;
