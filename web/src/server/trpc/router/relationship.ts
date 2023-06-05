// import { RelationshipType, RequestStatus } from "@prisma/client";
import { protectedProcedure, router } from "../trpc";

import { getRelationshipCounts } from "~/utils/profiles";
import { z } from "zod";
import {
  RelationshipType,
  RelationshipTypeValues,
  RequestStatus,
} from "~/server/db/schema/enums";
import { and, desc, eq } from "drizzle-orm";
import {
  profileRelationships,
  profiles,
  relationshipRequests,
} from "~/server/db/schema/app";

export const relationshipRouter = router({
  list: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        type: z.enum(RelationshipTypeValues).default(RelationshipType.Follow),
        rel: z.enum(["FOLLOWER", "FOLLOWING"]).default("FOLLOWER"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.rel === "FOLLOWING") {
        return await ctx.db.query.profileRelationships.findMany({
          where: and(
            eq(profileRelationships.followerId, input.id),
            eq(profileRelationships.type, input.type)
          ),
          with: {
            follower: true,
            following: true,
          },
          orderBy: desc(profileRelationships.createdAt),
        });
      } else {
        return await ctx.db.query.profileRelationships.findMany({
          where: and(
            eq(profileRelationships.followingId, input.id),
            eq(profileRelationships.type, input.type)
          ),
          with: {
            follower: true,
            following: true,
          },
          orderBy: desc(profileRelationships.createdAt),
        });
      }
    }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.relationshipRequests.findFirst({
        where: and(
          eq(relationshipRequests.followerId, ctx.session.user.id),
          eq(relationshipRequests.followingId, input.id),
          eq(relationshipRequests.status, RequestStatus.Pending)
        ),
      });
      const relationship = await ctx.db.query.profileRelationships.findFirst({
        where: and(
          eq(profileRelationships.followerId, ctx.session.user.id),
          eq(profileRelationships.followingId, input.id),
          eq(profileRelationships.type, RelationshipType.Follow)
        ),
      });
      return {
        request,
        relationship,
      };
    }),
  removeFollower: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.relationshipRequests.findFirst({
        where: and(
          eq(relationshipRequests.followerId, input.id),
          eq(relationshipRequests.followingId, ctx.session.user.id),
          eq(relationshipRequests.status, RequestStatus.Accepted)
        ),
      });
      const relationship = await ctx.db.query.profileRelationships.findFirst({
        where: and(
          eq(profileRelationships.followerId, input.id),
          eq(profileRelationships.followingId, ctx.session.user.id),
          eq(profileRelationships.type, RelationshipType.Follow)
        ),
      });
      if (request && relationship) {
        await ctx.db
          .delete(profileRelationships)
          .where(eq(profileRelationships.id, relationship.id));
        await ctx.db.update(relationshipRequests).set({
          status: RequestStatus.Forced,
        });
        await ctx.db
          .update(profiles)
          .set({
            ...(await getRelationshipCounts(relationship.followerId)),
          })
          .where(eq(profiles.id, relationship.followerId));
        await ctx.db
          .update(profiles)
          .set({
            ...(await getRelationshipCounts(relationship.followingId)),
          })
          .where(eq(profiles.id, relationship.followingId));
        return relationship;
      }
      return null;
    }),
  unfollow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.relationshipRequests.findFirst({
        where: and(
          eq(relationshipRequests.followerId, ctx.session.user.id),
          eq(relationshipRequests.followingId, input.id),
          eq(relationshipRequests.status, RequestStatus.Accepted)
        ),
      });
      if (request) {
        const relationship = await ctx.db
          .delete(profileRelationships)
          .where(
            and(
              eq(profileRelationships.followerId, ctx.session.user.id),
              eq(profileRelationships.followingId, input.id),
              eq(profileRelationships.type, RelationshipType.Follow)
            )
          )
          .returning()
          .then((prfRels) => prfRels[0]);
        if (!relationship) return null;
        await ctx.db
          .update(relationshipRequests)
          .set({
            status: RequestStatus.Removed,
          })
          .where(eq(relationshipRequests.id, request.id));
        await ctx.db
          .update(profiles)
          .set({
            ...(await getRelationshipCounts(relationship.followerId)),
          })
          .where(eq(profiles.id, relationship.followerId));
        await ctx.db
          .update(profiles)
          .set({
            ...(await getRelationshipCounts(relationship.followingId)),
          })
          .where(eq(profiles.id, relationship.followingId));
        return relationship;
      }
      return null;
    }),
});

// export const relationshipRouterOld = router({
//   list: protectedProcedure
//     .input(
//       z.object({
//         id: z.string(),
//         type: z
//           .enum([RelationshipType.BLOCK, RelationshipType.FOLLOW])
//           .default(RelationshipType.FOLLOW),
//         rel: z.enum(["FOLLOWER", "FOLLOWING"]).default("FOLLOWER"),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       if (input.rel === "FOLLOWING") {
//         return await ctx.prisma.profileRelationship.findMany({
//           where: {
//             followerId: input.id,
//             type: input.type,
//           },
//           include: {
//             follower: true,
//             following: true,
//           },
//           orderBy: {
//             following: {
//               name: "desc",
//             },
//           },
//         });
//       } else {
//         return await ctx.prisma.profileRelationship.findMany({
//           where: {
//             followingId: input.id,
//             type: input.type,
//           },
//           include: {
//             follower: true,
//             following: true,
//           },
//           orderBy: {
//             follower: {
//               name: "desc",
//             },
//           },
//         });
//       }
//     }),
//   getRelationship: protectedProcedure
//     .input(z.string())
//     .mutation(async ({ ctx, input }) => {
//       const request = await ctx.prisma.relationshipRequest.findFirst({
//         where: {
//           followerId: ctx.session.user.id,
//           followingId: input,
//           status: RequestStatus.PENDING,
//         },
//       });
//       const relationship = await ctx.prisma.profileRelationship.findFirst({
//         where: {
//           followerId: ctx.session.user.id,
//           followingId: input,
//           type: RelationshipType.FOLLOW,
//         },
//       });
//       return {
//         request,
//         relationship,
//       };
//     }),
//   removeFollower: protectedProcedure
//     .input(
//       z.object({
//         followerId: z.string(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const request = await ctx.prisma.relationshipRequest.findFirst({
//         where: {
//           followerId: input.followerId,
//           followingId: ctx.session.user.id,
//           status: RequestStatus.ACCEPTED,
//         },
//       });
//       const relationship = await ctx.prisma.profileRelationship.findFirst({
//         where: {
//           followerId: input.followerId,
//           followingId: ctx.session.user.id,
//           type: RelationshipType.FOLLOW,
//         },
//       });
//       if (request && relationship) {
//         await ctx.prisma.profileRelationship.delete({
//           where: {
//             id: relationship.id,
//           },
//         });
//         await ctx.prisma.relationshipRequest.update({
//           where: {
//             id: request.id,
//           },
//           data: {
//             status: RequestStatus.FORCED,
//           },
//         });
//         await ctx.prisma.profile.update({
//           where: { id: relationship.followerId },
//           data: {
//             ...(await getRelationshipCounts(relationship.followerId)),
//           },
//         });
//         await ctx.prisma.profile.update({
//           where: { id: relationship.followingId },
//           data: {
//             ...(await getRelationshipCounts(relationship.followingId)),
//           },
//         });
//         return relationship;
//       }
//       return null;
//     }),
//   unfollow: protectedProcedure
//     .input(
//       z.object({
//         id: z.string(),
//         followingId: z.string(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const request = await ctx.prisma.relationshipRequest.findFirst({
//         where: {
//           followerId: ctx.session.user.id,
//           followingId: input.followingId,
//           status: RequestStatus.ACCEPTED,
//         },
//       });
//       if (request) {
//         const relationship = await ctx.prisma.profileRelationship.delete({
//           where: {
//             id: input.id,
//           },
//         });
//         await ctx.prisma.relationshipRequest.update({
//           where: {
//             id: request.id,
//           },
//           data: {
//             status: RequestStatus.REMOVED,
//           },
//         });
//         await ctx.prisma.profile.update({
//           where: { id: relationship.followerId },
//           data: {
//             ...(await getRelationshipCounts(relationship.followerId)),
//           },
//         });
//         await ctx.prisma.profile.update({
//           where: { id: relationship.followingId },
//           data: {
//             ...(await getRelationshipCounts(relationship.followingId)),
//           },
//         });

//         return relationship;
//       }
//       return null;
//     }),
// });
