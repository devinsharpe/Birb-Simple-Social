import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";

export const PostReactionsRouter = router({
  create: protectedProcedure
    .input(
      z.strictObject({
        reactionId: z.string(),
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profileReaction = await ctx.prisma.profileReaction.findFirst({
        where: {
          id: input.reactionId,
          profileId: ctx.session.user.id,
        },
      });
      if (profileReaction) {
        const deleteCount = await ctx.prisma.postReaction.deleteMany({
          where: {
            postId: input.postId,
            profileId: ctx.session.user.id,
          },
        });
        const postReaction = await ctx.prisma.postReaction.create({
          data: {
            reaction: profileReaction.reaction,
            image: profileReaction.image,
            postId: input.postId,
            profileId: ctx.session.user.id,
          },
        });
        await ctx.prisma.post.update({
          where: {
            id: input.postId,
          },
          data: {
            reactionCount: {
              increment: 1 - deleteCount.count,
            },
          },
        });
        return postReaction;
      } else return null;
    }),
  clear: protectedProcedure
    .input(
      z.strictObject({
        postId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const reactions = await ctx.prisma.postReaction.deleteMany({
        where: {
          postId: input.postId,
          profileId: ctx.session.user.id,
        },
      });
      return reactions.count;
    }),
});
