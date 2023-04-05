import { names, uniqueNamesGenerator } from "unique-names-generator";
import { protectedProcedure, publicProcedure, router } from "../../trpc";

import type { Config } from "unique-names-generator";
import { HANDLE_REGEX_CLEAN } from "../../../../utils/profiles";
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
      const handleProfile = await ctx.prisma.profile.findFirst({
        where: {
          normalizedHandle: input.toLowerCase(),
        },
      });
      return (
        (!!!handleProfile || handleProfile.id === ctx.session.user.id) &&
        HANDLE_REGEX_CLEAN.test(input)
      );
    }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (profile) {
      let settings = await ctx.prisma.profileSettings.findFirst({
        where: {
          id: profile.id,
        },
      });
      if (!settings) {
        settings = await ctx.prisma.profileSettings.create({
          data: {
            id: profile.id,
          },
        });
      }
      return { profile, settings };
    } else {
      const handle = uniqueNamesGenerator(nameConfig).toLowerCase();
      const profile = await ctx.prisma.profile.create({
        data: {
          id: ctx.session.user.id,
          name: "",
          handle,
          normalizedHandle: handle,
        },
      });
      const settings = await ctx.prisma.profileSettings.create({
        data: {
          id: profile.id,
        },
      });
      return { profile, settings };
    }
  }),
  searchProfiles: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.prisma.profile.findMany({
          take: 10,
          where: {
            handle: {
              search: input.trim().replace(/[\s\n\t]/g, ":*&") + ":*",
            },
            name: {
              search: input.trim().replace(/[\s\n\t]/g, ":*&") + ":*",
            },
          },
        });
        return result;
      } catch (err) {
        console.log(err);
        return [];
      }
    }),
  updateProfile: protectedProcedure
    .input(
      z.strictObject({
        name: z.string().max(50),
        handle: z.string().max(24).regex(HANDLE_REGEX_CLEAN),
        biography: z.string().max(300),
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
            handle:
              oldProfile.canChangeHandle && input.handle
                ? input.handle.trim()
                : oldProfile.handle,
            normalizedHandle:
              oldProfile.canChangeHandle && input.handle
                ? input.handle.trim().toLowerCase()
                : oldProfile.normalizedHandle,
          },
        });
        return profile;
      }
      return oldProfile;
    }),
});
