// import { Reaction, Theme } from "@prisma/client";
import { ReactionValues, ThemeValues } from "~/server/db/schema/enums";
import { protectedProcedure, router } from "../../trpc";

import type { ProfileSetting } from "~/server/db/schema/app";
import { eq } from "drizzle-orm";
import { profileSettings } from "~/server/db/schema/app";
import { z } from "zod";

// const REACTION_VALUES = [...Object.values(Reaction)] as unknown as readonly [
//   Reaction,
//   ...Reaction[]
// ];
// const THEME_VALUES = [...Object.values(Theme)] as unknown as readonly [
//   Theme,
//   ...Theme[]
// ];

export const settingsRouter = router({
  get: protectedProcedure.mutation(async ({ ctx }) => {
    let userSetting: ProfileSetting | undefined =
      await ctx.db.query.profileSettings.findFirst({
        where: eq(profileSettings.id, ctx.session.user.id),
      });
    if (!userSetting)
      userSetting = await ctx.db
        .insert(profileSettings)
        .values({
          id: ctx.session.user.id,
        })
        .returning()
        .then((prfSttng) => prfSttng[0]);
    return userSetting ?? null;
  }),
  update: protectedProcedure
    .input(
      z.object({
        reaction: z.enum(ReactionValues),
        catMode: z.boolean(),
        theme: z.enum(ThemeValues),
        relativeTimestamps: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userSettings = await ctx.db
        .update(profileSettings)
        .set({
          reaction: input.reaction,
          catMode: input.catMode,
          theme: input.theme,
          relativeTimestamps: input.relativeTimestamps,
        })
        .where(eq(profileSettings.id, ctx.session.user.id))
        .returning()
        .then((prfSttngs) => prfSttngs[0]);
      return userSettings ?? null;
    }),
});

// export const settingsRouterOld = router({
//   get: protectedProcedure.mutation(async ({ ctx }) => {
//     let profileSettings = await ctx.prisma.profileSettings.findFirst({
//       where: {
//         id: ctx.session.user.id,
//       },
//     });
//     if (profileSettings) return profileSettings;
//     profileSettings = await ctx.prisma.profileSettings.create({
//       data: {
//         id: ctx.session.user.id,
//       },
//     });
//     return profileSettings;
//   }),
//   update: protectedProcedure
//     .input(
//       z.object({
//         reaction: z.enum(REACTION_VALUES),
//         catMode: z.boolean(),
//         theme: z.enum(THEME_VALUES),
//         relativeTimestamps: z.boolean(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const profileSettings = await ctx.prisma.profileSettings.update({
//         where: {
//           id: ctx.session.user.id,
//         },
//         data: input,
//       });
//       return profileSettings;
//     }),
// });
