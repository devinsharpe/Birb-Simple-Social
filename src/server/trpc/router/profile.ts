import { RelationshipType, RequestStatus } from "@prisma/client";
import { names, uniqueNamesGenerator } from "unique-names-generator";
import { protectedProcedure, publicProcedure, router } from "../trpc";

import type { Config } from "unique-names-generator";
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
      const userProfile = await ctx.prisma.profile.findFirst({
        where: {
          id: ctx.session.user.id,
        },
      });
      const handleProfile = await ctx.prisma.profile.findFirst({
        where: {
          handle: input.toLowerCase(),
        },
      });
      if (handleProfile && userProfile && handleProfile.id === userProfile.id)
        return true;
      else return !handleProfile;
    }),
  cancelFollow: protectedProcedure
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
  requestFollow: protectedProcedure
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
  listRequests: protectedProcedure
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
          followingId: ctx.session.user.id,
          status: RequestStatus.PENDING,
        },
        include: {
          follower: true,
        },
        take: input.count,
        skip: input.count * (input.page - 1),
      });
    }),
  updateRequest: protectedProcedure
    .input(
      z.strictObject({
        id: z.string(),
        status: z.enum([
          RequestStatus.ACCEPTED,
          RequestStatus.CANCELLED,
          RequestStatus.DENIED,
          RequestStatus.PENDING,
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
              followerId: ctx.session.user.id,
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
              followingCount: {
                increment: 1,
              },
            },
          });
          const profile = await ctx.prisma.profile.update({
            where: {
              id: request.followingId,
            },
            data: {
              followerCount: {
                increment: 1,
              },
            },
          });
          return profile;
        }
      }
      return null;
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
  getFollowerRequests: protectedProcedure
    .input(z.enum(["PENDING", "ACCEPTED", "CANCELLED", "DENIED"]))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.relationshipRequest.findMany({
        where: {
          followingId: ctx.session.user.id,
          status: input,
        },
      });
    }),
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.prisma.profile.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (profile) {
      return profile;
    } else {
      const result = await ctx.prisma.profile.create({
        data: {
          id: ctx.session.user.id,
          name: "",
          handle: uniqueNamesGenerator(nameConfig)
            .toLowerCase()
            .replaceAll("_", "-"),
        },
      });
      return result;
    }
  }),
  searchProfiles: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.profile.findMany({
        take: 10,
        where: {
          handle: {
            search: input,
          },
          name: {
            search: input,
          },
        },
      });
      return result;
    }),
  updateProfile: protectedProcedure
    .input(
      z.strictObject({
        name: z.string().max(50),
        handle: z.string().max(24),
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
          },
        });
        return profile;
      }
      return oldProfile;
    }),
});
