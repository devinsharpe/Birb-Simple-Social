import { names, uniqueNamesGenerator } from "unique-names-generator";
import { protectedProcedure, router } from "../trpc";

import type { Config } from "unique-names-generator";
import { z } from "zod";

export const nameConfig: Config = {
  dictionaries: [
    [
      "Affectionate",
      "Agreeable",
      "Amiable",
      "Bright",
      "Charming",
      "Creative",
      "Determined",
      "Diligent",
      "Diplomatic",
      "Dynamic",
      "Energetic",
      "Friendly",
      "Funny",
      "Generous",
      "Giving",
      "Gregarious",
      "Hardworking",
      "Helpful",
      "Kind",
      "Likable",
      "Loyal",
      "Patient",
      "Polite",
      "Sincere",
      "Amazing",
      "Awesome",
      "Blithesome",
      "Excellent",
      "Fabulous",
      "Favorable",
      "Fortuitous",
      "Gorgeous",
      "Incredible",
      "Unique",
      "Mirthful",
      "Outstanding",
      "Perfect",
      "Philosophical",
      "Propitious",
      "Remarkable",
      "Rousing",
      "Spectacular",
      "Splendid",
      "Stellar",
      "Super",
      "Upbeat",
      "Stunning",
      "Wondrous",
    ],
    names,
  ],
  length: 2,
};

export const profileRouter = router({
  checkProfileHandle: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userProfile = await ctx.prisma.profile.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });
      const handleProfile = await ctx.prisma.profile.findFirst({
        where: {
          handle: input.toLowerCase(),
        },
      });
      if (handleProfile && userProfile && handleProfile.id === userProfile.id)
        return true;
      else return !handleProfile;
    }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (profile) {
      return profile;
    } else {
      const result = await ctx.prisma.profile.create({
        data: {
          id: ctx.session.user.id,
          name: "",
          handle: uniqueNamesGenerator(nameConfig)
            .toLowerCase()
            .replaceAll("_", "-"),
        },
      });
      return result;
    }
  }),
  searchProfiles: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.profile.findMany({
        take: 10,
        where: {
          handle: {
            search: input,
          },
          name: {
            search: input,
          },
        },
      });
      return result;
    }),
  updateProfile: protectedProcedure
    .input(
      z.strictObject({
        name: z.string().max(50),
        handle: z.string().max(24),
        biography: z.string().max(150),
        birthdate: z.string().max(10),
        location: z.string().max(50),
        website: z.string(),
        avatarUrl: z.string(),
        headerUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const oldProfile = await ctx.prisma.profile.findFirst({
        where: { id: ctx.session.user.id },
      });
      if (oldProfile) {
        const profile = await ctx.prisma.profile.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            ...input,
            canChangeHandle:
              input.handle === oldProfile.handle && oldProfile.canChangeHandle,
          },
        });
        return profile;
      }
      return oldProfile;
    }),
});
