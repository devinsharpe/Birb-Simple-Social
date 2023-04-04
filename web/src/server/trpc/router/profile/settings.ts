import { Reaction, Theme } from "@prisma/client";
import { protectedProcedure, router } from "../../trpc";

import { z } from "zod";

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
        reaction: z.enum([
          Reaction.DOWNCAST,
          Reaction.FIRE,
          Reaction.HEART_EYES,
          Reaction.JOY,
          Reaction.PINCHED_FINGERS,
          Reaction.SMILE,
          Reaction.THUMBS_UP,
        ]),
        catMode: z.boolean(),
        theme: z.enum([Theme.AUTO, Theme.LIGHT, Theme.DARK]),
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
