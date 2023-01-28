import { protectedProcedure, publicProcedure, router } from "../trpc";

import { ProfileModel } from "../../../../prisma/zod";
import { handleConfig } from "../../../utils/profile";
import { uniqueNamesGenerator } from "unique-names-generator";
import { z } from "zod";

const lockedFields: Record<string, boolean> = {
  accountId: true,
  canChangeHandle: true,
  handle: true,
  id: true,
  userId: true,
  relationshipCount: true,
  postCount: true,
  mediaCount: true,
  createdAt: true,
  updatedAt: true,
};

export const profileRouter = router({
  byId: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.prisma.profile.findFirst({
      where: { id: input },
    });
  }),
  create: protectedProcedure
    .input(ProfileModel.partial().omit(lockedFields))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: { userId: ctx.session.user.id },
      });
      const account = await ctx.prisma.account.findFirst({
        where: { userId: ctx.session.user.id },
      });
      if (profile || !account) return profile;
      return await ctx.prisma.profile.create({
        data: {
          firstName: "",
          lastName: "",
          ...input,
          handle: uniqueNamesGenerator(handleConfig),
          accountId: account.id,
          userId: ctx.session.user.id,
        },
      });
    }),
  generateHandle: publicProcedure.query(() =>
    uniqueNamesGenerator(handleConfig)
  ),
  update: protectedProcedure
    .input(ProfileModel.partial().omit(lockedFields))
    .query(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        select: {
          id: true,
        },
        where: {
          userId: ctx.session.user.id,
        },
      });
      if (profile) {
        return await ctx.prisma.profile.update({
          where: { id: profile.id },
          data: input,
        });
      }
      return null;
    }),
  user: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.profile.findFirst({
      where: { userId: ctx.session.user.id },
    });
  }),
});
