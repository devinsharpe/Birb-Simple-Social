import { RelationshipType, RequestStatus } from "@prisma/client";
import { protectedProcedure, router } from "../trpc";

import { getRelationshipCounts } from "../../../utils/profiles";
import { z } from "zod";

export const relationshipRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z
          .enum([RelationshipType.BLOCK, RelationshipType.FOLLOW])
          .default(RelationshipType.FOLLOW),
        rel: z.enum(["FOLLOWER", "FOLLOWING"]).default("FOLLOWER"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.rel === "FOLLOWING") {
        return await ctx.prisma.profileRelationship.findMany({
          where: {
            followerId: input.id,
            type: input.type,
          },
          include: {
            follower: true,
            following: true,
          },
          orderBy: {
            following: {
              name: "desc",
            },
          },
        });
      } else {
        return await ctx.prisma.profileRelationship.findMany({
          where: {
            followingId: input.id,
            type: input.type,
          },
          include: {
            follower: true,
            following: true,
          },
          orderBy: {
            follower: {
              name: "desc",
            },
          },
        });
      }
    }),
  getRelationship: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.relationshipRequest.findFirst({
        where: {
          followerId: ctx.session.user.id,
          followingId: input,
          status: RequestStatus.PENDING,
        },
      });
      const relationship = await ctx.prisma.profileRelationship.findFirst({
        where: {
          followerId: ctx.session.user.id,
          followingId: input,
          type: RelationshipType.FOLLOW,
        },
      });
      return {
        request,
        relationship,
      };
    }),
  removeFollower: protectedProcedure
    .input(
      z.object({
        followerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.relationshipRequest.findFirst({
        where: {
          followerId: input.followerId,
          followingId: ctx.session.user.id,
          status: RequestStatus.ACCEPTED,
        },
      });
      const relationship = await ctx.prisma.profileRelationship.findFirst({
        where: {
          followerId: input.followerId,
          followingId: ctx.session.user.id,
          type: RelationshipType.FOLLOW,
        },
      });
      if (request && relationship) {
        await ctx.prisma.profileRelationship.delete({
          where: {
            id: relationship.id,
          },
        });
        await ctx.prisma.relationshipRequest.update({
          where: {
            id: request.id,
          },
          data: {
            status: RequestStatus.FORCED,
          },
        });
        await ctx.prisma.profile.update({
          where: { id: relationship.followerId },
          data: {
            ...(await getRelationshipCounts(relationship.followerId)),
          },
        });
        await ctx.prisma.profile.update({
          where: { id: relationship.followingId },
          data: {
            ...(await getRelationshipCounts(relationship.followingId)),
          },
        });
        return relationship;
      }
      return null;
    }),
  unfollow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        followingId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.relationshipRequest.findFirst({
        where: {
          followerId: ctx.session.user.id,
          followingId: input.followingId,
          status: RequestStatus.ACCEPTED,
        },
      });
      if (request) {
        const relationship = await ctx.prisma.profileRelationship.delete({
          where: {
            id: input.id,
          },
        });
        await ctx.prisma.relationshipRequest.update({
          where: {
            id: request.id,
          },
          data: {
            status: RequestStatus.REMOVED,
          },
        });
        await ctx.prisma.profile.update({
          where: { id: relationship.followerId },
          data: {
            ...(await getRelationshipCounts(relationship.followerId)),
          },
        });
        await ctx.prisma.profile.update({
          where: { id: relationship.followingId },
          data: {
            ...(await getRelationshipCounts(relationship.followingId)),
          },
        });

        return relationship;
      }
      return null;
    }),
});
