import { and, eq, sql } from "drizzle-orm";
import { postReactions, posts, profileReactions } from "~/server/db/schema/app";
import { protectedProcedure, router } from "../../trpc";

import { createId } from "~/server/db/utils";
import { z } from "zod";

export const PostReactionsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        reactionId: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profileReaction = await ctx.db.query.profileReactions.findFirst({
        where: and(
          eq(profileReactions.id, input.reactionId),
          eq(profileReactions.profileId, ctx.session.user.id)
        ),
      });
      const post = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.postId),
      });
      if (profileReaction && post) {
        const deletedRows = await ctx.db
          .delete(postReactions)
          .where(
            and(
              eq(postReactions.profileId, ctx.session.user.id),
              eq(postReactions.postId, post.id)
            )
          )
          .returning();
        const postReaction = await ctx.db.insert(postReactions).values({
          id: createId(),
          profileId: ctx.session.user.id,
          postId: input.postId,
          reaction: profileReaction.reaction,
          image: profileReaction.image,
        });
        await ctx.db.update(posts).set({
          reactionCount: sql`${posts.reactionCount} - ${deletedRows.length} + 1`,
        });
        return postReaction;
      }
      return null;
    }),
  clear: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deletedRows = await ctx.db
        .delete(postReactions)
        .where(
          and(
            eq(postReactions.postId, input.postId),
            eq(postReactions.profileId, ctx.session.user.id)
          )
        )
        .returning();
      if (deletedRows.length)
        await ctx.db.update(posts).set({
          reactionCount: sql`${posts.reactionCount.name} - ${deletedRows.length}`,
        });
      return deletedRows;
    }),
});

// export const PostReactionsRouterOld = router({
//   create: protectedProcedure
//     .input(
//       z.strictObject({
//         reactionId: z.string(),
//         postId: z.string(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const profileReaction = await ctx.prisma.profileReaction.findFirst({
//         where: {
//           id: input.reactionId,
//           profileId: ctx.session.user.id,
//         },
//       });
//       if (profileReaction) {
//         const deleteCount = await ctx.prisma.postReaction.deleteMany({
//           where: {
//             postId: input.postId,
//             profileId: ctx.session.user.id,
//           },
//         });
//         const postReaction = await ctx.prisma.postReaction.create({
//           data: {
//             reaction: profileReaction.reaction,
//             image: profileReaction.image,
//             postId: input.postId,
//             profileId: ctx.session.user.id,
//           },
//         });
//         await ctx.prisma.post.update({
//           where: {
//             id: input.postId,
//           },
//           data: {
//             reactionCount: {
//               increment: 1 - deleteCount.count,
//             },
//           },
//         });
//         return postReaction;
//       } else return null;
//     }),
//   clear: protectedProcedure
//     .input(
//       z.strictObject({
//         postId: z.string(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const reactions = await ctx.prisma.postReaction.deleteMany({
//         where: {
//           postId: input.postId,
//           profileId: ctx.session.user.id,
//         },
//       });
//       return reactions.count;
//     }),
// });
