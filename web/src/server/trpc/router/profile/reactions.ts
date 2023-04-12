import { Reaction, Visibility } from "@prisma/client";
import { protectedProcedure, router } from "../../trpc";
import { z } from "zod";

const REACTION_VALUES = [...Object.values(Reaction)] as unknown as readonly [
  Reaction,
  ...Reaction[]
];
const VISIBILITY_VALUES = [
  ...Object.values(Visibility),
] as unknown as readonly [Visibility, ...Visibility[]];

export const profileReactionsRouter = router({
  create: protectedProcedure
    .input(
      z.strictObject({
        image: z.string(),
        reaction: z.enum(REACTION_VALUES),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profileReaction = await ctx.prisma.profileReaction.create({
        data: {
          ...input,
          profileId: ctx.session.user.id,
        },
      });
      await ctx.prisma.profileReaction.updateMany({
        where: {
          id: {
            not: profileReaction.id,
          },
          reaction: profileReaction.reaction,
          profileId: ctx.session.user.id,
        },
        data: {
          status: Visibility.ARCHIVED,
        },
      });
      return profileReaction;
    }),
  list: protectedProcedure
    .input(
      z
        .strictObject({
          status: z.enum(VISIBILITY_VALUES),
        })
        .default({
          status: Visibility.ACTIVE,
        })
    )
    .query(async ({ ctx, input }) => {
      console.log(input);
      console.log(ctx.session.user.id);
      const profileReactions = await ctx.prisma.profileReaction.findMany({
        where: {
          profileId: ctx.session.user.id,
          ...input,
        },
      });
      console.log(profileReactions);
      return profileReactions;
    }),
  update: protectedProcedure
    .input(
      z.strictObject({
        id: z.string(),
        status: z.enum(VISIBILITY_VALUES),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profileReaction = await ctx.prisma.profileReaction.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
      if (profileReaction.status === Visibility.ACTIVE) {
        await ctx.prisma.profileReaction.updateMany({
          where: {
            profileId: ctx.session.user.id,
            reaction: profileReaction.reaction,
          },
          data: {
            status: Visibility.ARCHIVED,
          },
        });
      }
      return profileReaction;
    }),
});
