import { RelationshipType, RequestStatus } from "@prisma/client";
import { protectedProcedure, publicProcedure, router } from "../trpc";

import { getRelationshipCounts } from "../../../utils/profiles";
import { z } from "zod";

export const requestRouter = router({
  cancel: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const request = await ctx.prisma.relationshipRequest.update({
          where: {
            id: input,
          },
          data: {
            status: RequestStatus.CANCELLED,
          },
        });
        return request;
      } catch (err) {
        return null;
      }
    }),
  follow: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.prisma.profile.findFirst({
        where: {
          id: input,
        },
      });
      const relatationship = await ctx.prisma.profileRelationship.findFirst({
        where: {
          followerId: ctx.session.user.id,
          followingId: input,
        },
      });
      if (profile && !relatationship) {
        const request = await ctx.prisma.relationshipRequest.create({
          data: {
            followerId: ctx.session.user.id,
            followingId: input,
          },
        });
        return request;
      } else return undefined;
    }),
  list: protectedProcedure
    .input(
      z
        .strictObject({
          count: z.number(),
          page: z.number(),
        })
        .default({ count: 10, page: 1 })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.relationshipRequest.findMany({
        where: {
          AND: [
            {
              followingId: ctx.session.user.id,
            },
            {
              status: {
                in: [
                  RequestStatus.ACCEPTED,
                  RequestStatus.DENIED,
                  RequestStatus.PENDING,
                ],
              },
            },
          ],
        },
        include: {
          follower: true,
        },
        take: input.count,
        skip: input.count * (input.page - 1),
      });
    }),
  update: protectedProcedure
    .input(
      z.strictObject({
        id: z.string(),
        status: z.enum([
          RequestStatus.ACCEPTED,
          RequestStatus.CANCELLED,
          RequestStatus.DENIED,
          RequestStatus.PENDING,
          RequestStatus.FORCED,
          RequestStatus.REMOVED,
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.prisma.relationshipRequest.findFirst({
        where: {
          id: input.id,
        },
      });
      if (request && request.followingId === ctx.session.user.id) {
        const relationship = await ctx.prisma.profileRelationship.findFirst({
          where: {
            followerId: request.followerId,
            followingId: request.followingId,
          },
        });
        if (relationship) return null;
        if (input.status === RequestStatus.ACCEPTED) {
          await ctx.prisma.profileRelationship.create({
            data: {
              followerId: request.followerId,
              followingId: request.followingId,
              type: RelationshipType.FOLLOW,
              requestedAt: request.createdAt,
            },
          });
          await ctx.prisma.profile.update({
            where: {
              id: request.followerId,
            },
            data: {
              ...(await getRelationshipCounts(request.followerId)),
            },
          });
          const profile = await ctx.prisma.profile.update({
            where: {
              id: request.followingId,
            },
            data: {
              ...(await getRelationshipCounts(request.followerId)),
            },
          });
          await ctx.prisma.relationshipRequest.update({
            where: { id: input.id },
            data: { status: input.status },
          });
          return profile;
        }
      }
      return null;
    }),
});
