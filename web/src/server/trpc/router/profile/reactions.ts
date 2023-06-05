import {
  ReactionValues,
  Visibility,
  VisibilityValues,
} from "~/server/db/schema/enums";
// import { Reaction, Visibility } from "@prisma/client";
import { and, eq, not } from "drizzle-orm";
import { protectedProcedure, router } from "../../trpc";

import { createId } from "~/server/db/utils";
import { profileReactions } from "~/server/db/schema/app";
import { z } from "zod";

// const REACTION_VALUES = [...Object.values(Reaction)] as unknown as readonly [
//   Reaction,
//   ...Reaction[]
// ];
// const VISIBILITY_VALUES = [
//   ...Object.values(Visibility),
// ] as unknown as readonly [Visibility, ...Visibility[]];

export const profileReactionsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        image: z.string(),
        reaction: z.enum(ReactionValues),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(profileReactions)
        .set({
          status: Visibility.Archived,
        })
        .where(
          and(
            eq(profileReactions.profileId, ctx.session.user.id),
            eq(profileReactions.reaction, input.reaction)
          )
        );
      const profileReaction = await ctx.db
        .insert(profileReactions)
        .values({
          ...input,
          id: createId(),
          profileId: ctx.session.user.id,
        })
        .returning()
        .then((prfRcts) => prfRcts[0] ?? null);
      return profileReaction;
    }),
  list: protectedProcedure
    .input(
      z
        .object({
          status: z.enum(VisibilityValues),
        })
        .default({
          status: Visibility.Active,
        })
    )
    .query(async ({ ctx, input }) => {
      const reactions = await ctx.db.query.profileReactions.findMany({
        where: and(
          eq(profileReactions.profileId, ctx.session.user.id),
          eq(profileReactions.status, input.status)
        ),
      });
      return reactions;
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(VisibilityValues),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profileReaction = await ctx.db
        .update(profileReactions)
        .set({
          status: input.status,
        })
        .where(
          and(
            eq(profileReactions.id, input.id),
            eq(profileReactions.profileId, ctx.session.user.id)
          )
        )
        .returning()
        .then((prfRcts) => prfRcts[0] ?? null);
      if (input.status === Visibility.Active && profileReaction)
        await ctx.db
          .update(profileReactions)
          .set({
            status: Visibility.Archived,
          })
          .where(
            and(
              eq(profileReactions.profileId, ctx.session.user.id),
              eq(profileReactions.reaction, profileReaction.reaction),
              not(eq(profileReactions.id, profileReaction.id))
            )
          );
      return profileReaction;
    }),
});

// export const profileReactionsRouterOld = router({
//   create: protectedProcedure
//     .input(
//       z.strictObject({
//         image: z.string(),
//         reaction: z.enum(REACTION_VALUES),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const profileReaction = await ctx.prisma.profileReaction.create({
//         data: {
//           ...input,
//           profileId: ctx.session.user.id,
//         },
//       });
//       await ctx.prisma.profileReaction.updateMany({
//         where: {
//           id: {
//             not: profileReaction.id,
//           },
//           reaction: profileReaction.reaction,
//           profileId: ctx.session.user.id,
//         },
//         data: {
//           status: Visibility.ARCHIVED,
//         },
//       });
//       return profileReaction;
//     }),
//   list: protectedProcedure
//     .input(
//       z
//         .strictObject({
//           status: z.enum(VISIBILITY_VALUES),
//         })
//         .default({
//           status: Visibility.ACTIVE,
//         })
//     )
//     .query(async ({ ctx, input }) => {
//       console.log(input);
//       console.log(ctx.session.user.id);
//       const profileReactions = await ctx.prisma.profileReaction.findMany({
//         where: {
//           profileId: ctx.session.user.id,
//           ...input,
//         },
//       });
//       console.log(profileReactions);
//       return profileReactions;
//     }),
//   update: protectedProcedure
//     .input(
//       z.strictObject({
//         id: z.string(),
//         status: z.enum(VISIBILITY_VALUES),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const profileReaction = await ctx.prisma.profileReaction.update({
//         where: {
//           id: input.id,
//         },
//         data: {
//           status: input.status,
//         },
//       });
//       if (profileReaction.status === Visibility.ACTIVE) {
//         await ctx.prisma.profileReaction.updateMany({
//           where: {
//             profileId: ctx.session.user.id,
//             reaction: profileReaction.reaction,
//           },
//           data: {
//             status: Visibility.ARCHIVED,
//           },
//         });
//       }
//       return profileReaction;
//     }),
// });
