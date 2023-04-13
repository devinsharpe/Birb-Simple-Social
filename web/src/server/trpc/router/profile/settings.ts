import type { Theme } from "@prisma/client";
import { Reaction, Visibility } from "@prisma/client";
import { protectedProcedure, router } from "../../trpc";

import { z } from "zod";

const REACTION_VALUES = [...Object.values(Reaction)] as unknown as readonly [
  Reaction,
  ...Reaction[]
];
const THEME_VALUES = [...Object.values(Visibility)] as unknown as readonly [
  Theme,
  ...Theme[]
];

export const settingsRouter = router({
  get: protectedProcedure.mutation(async ({ ctx }) => {
    let profileSettings = await ctx.prisma.profileSettings.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });
    if (profileSettings) return profileSettings;
    profileSettings = await ctx.prisma.profileSettings.create({
      data: {
        id: ctx.session.user.id,
      },
    });
    return profileSettings;
  }),
  update: protectedProcedure
    .input(
      z.strictObject({
        reaction: z.enum(REACTION_VALUES),
        catMode: z.boolean(),
        theme: z.enum(THEME_VALUES),
        relativeTimestamps: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profileSettings = await ctx.prisma.profileSettings.update({
        where: {
          id: ctx.session.user.id,
        },
        data: input,
      });
      return profileSettings;
    }),
});
