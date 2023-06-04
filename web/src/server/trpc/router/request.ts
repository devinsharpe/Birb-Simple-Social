// import { RelationshipType, RequestStatus } from "@prisma/client";
import { protectedProcedure, router } from "../trpc";

import { getRelationshipCounts } from "../../../utils/profiles";
import { z } from "zod";
import {
  profileRelationships,
  profiles,
  relationshipRequests,
} from "~/server/db/schema/app";
import {
  RequestStatus,
  RequestStatusValues,
  RelationshipType,
} from "~/server/db/schema/enums";
import { and, desc, eq, inArray } from "drizzle-orm";
import { createId } from "~/server/db/utils";

export const requestRouter = router({
  cancel: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(relationshipRequests)
        .set({
          status: RequestStatus.Cancelled,
        })
        .where(
          and(
            eq(relationshipRequests.id, input.id),
            eq(relationshipRequests.followingId, ctx.session.user.id)
          )
        )
        .returning()
        .then((relReqs) => relReqs[0] ?? null);
    }),
  follow: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db.query.profiles.findFirst({
        where: eq(profiles.id, input.id),
      });
      const relationship = await ctx.db.query.profileRelationships.findFirst({
        where: and(
          eq(profileRelationships.followerId, ctx.session.user.id),
          eq(profileRelationships.followingId, input.id)
        ),
      });
      if (profile && !relationship)
        return await ctx.db
          .insert(relationshipRequests)
          .values({
            id: createId(),
            followerId: ctx.session.user.id,
            followingId: input.id,
          })
          .returning()
          .then((relReqs) => relReqs[0] ?? null);

      return null;
    }),
  list: protectedProcedure.mutation(async ({ ctx }) => {
    // TODO: Add pagination
    return await ctx.db.query.relationshipRequests.findMany({
      where: and(
        eq(relationshipRequests.followingId, ctx.session.user.id),
        inArray(relationshipRequests.status, [
          RequestStatus.Accepted,
          RequestStatus.Denied,
          RequestStatus.Pending,
        ])
      ),
      with: {
        follower: true,
      },
      orderBy: desc(relationshipRequests.createdAt),
    });
  }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(RequestStatusValues),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db
        .update(relationshipRequests)
        .set({
          status: input.status,
        })
        .where(
          and(
            eq(relationshipRequests.id, input.id),
            eq(relationshipRequests.followingId, ctx.session.user.id)
          )
        )
        .returning()
        .then((relReqs) => relReqs[0] ?? null);
      if (request) {
        let relationship = await ctx.db.query.profileRelationships.findFirst({
          where: and(
            eq(profileRelationships.followerId, request.followerId),
            eq(profileRelationships.followingId, request.followingId)
          ),
        });
        if (relationship) return null;
        if (input.status === RequestStatus.Accepted) {
          relationship = await ctx.db
            .insert(profileRelationships)
            .values({
              id: createId(),
              followerId: request.followerId,
              followingId: request.followingId,
              type: RelationshipType.Follow,
              requestedAt: request.createdAt,
            })
            .returning()
            .then((prfRels) => prfRels[0]);
          await ctx.db
            .update(profiles)
            .set({
              ...(await getRelationshipCounts(request.followerId)),
            })
            .where(eq(profiles.id, request.followerId));
          const profile = await ctx.db
            .update(profiles)
            .set({
              ...(await getRelationshipCounts(request.followingId)),
            })
            .where(eq(profiles.id, request.followingId))
            .returning()
            .then((prfs) => prfs[0]);
          return {
            request,
            relationship,
            profile,
          };
        }
      }
      return null;
    }),
});

// export const requestRouterOld = router({
//   cancel: protectedProcedure
//     .input(z.string())
//     .mutation(async ({ ctx, input }) => {
//       try {
//         const request = await ctx.prisma.relationshipRequest.update({
//           where: {
//             id: input,
//           },
//           data: {
//             status: RequestStatus.CANCELLED,
//           },
//         });
//         return request;
//       } catch (err) {
//         return null;
//       }
//     }),
//   follow: protectedProcedure
//     .input(z.string())
//     .mutation(async ({ ctx, input }) => {
//       const profile = await ctx.prisma.profile.findFirst({
//         where: {
//           id: input,
//         },
//       });
//       const relatationship = await ctx.prisma.profileRelationship.findFirst({
//         where: {
//           followerId: ctx.session.user.id,
//           followingId: input,
//         },
//       });
//       if (profile && !relatationship) {
//         const request = await ctx.prisma.relationshipRequest.create({
//           data: {
//             followerId: ctx.session.user.id,
//             followingId: input,
//           },
//         });
//         return request;
//       } else return undefined;
//     }),
//   list: protectedProcedure
//     .input(
//       z
//         .strictObject({
//           count: z.number(),
//           page: z.number(),
//         })
//         .default({ count: 10, page: 1 })
//     )
//     .mutation(async ({ ctx, input }) => {
//       return await ctx.prisma.relationshipRequest.findMany({
//         where: {
//           AND: [
//             {
//               followingId: ctx.session.user.id,
//             },
//             {
//               status: {
//                 in: [
//                   RequestStatus.ACCEPTED,
//                   RequestStatus.DENIED,
//                   RequestStatus.PENDING,
//                 ],
//               },
//             },
//           ],
//         },
//         include: {
//           follower: true,
//         },
//         take: input.count,
//         skip: input.count * (input.page - 1),
//       });
//     }),
//   update: protectedProcedure
//     .input(
//       z.strictObject({
//         id: z.string(),
//         status: z.enum([
//           RequestStatus.ACCEPTED,
//           RequestStatus.CANCELLED,
//           RequestStatus.DENIED,
//           RequestStatus.PENDING,
//           RequestStatus.FORCED,
//           RequestStatus.REMOVED,
//         ]),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const request = await ctx.prisma.relationshipRequest.findFirst({
//         where: {
//           id: input.id,
//         },
//       });
//       if (request && request.followingId === ctx.session.user.id) {
//         const relationship = await ctx.prisma.profileRelationship.findFirst({
//           where: {
//             followerId: request.followerId,
//             followingId: request.followingId,
//           },
//         });
//         if (relationship) return null;
//         if (input.status === RequestStatus.ACCEPTED) {
//           await ctx.prisma.profileRelationship.create({
//             data: {
//               followerId: request.followerId,
//               followingId: request.followingId,
//               type: RelationshipType.FOLLOW,
//               requestedAt: request.createdAt,
//             },
//           });
//           await ctx.prisma.profile.update({
//             where: {
//               id: request.followerId,
//             },
//             data: {
//               ...(await getRelationshipCounts(request.followerId)),
//             },
//           });
//           const profile = await ctx.prisma.profile.update({
//             where: {
//               id: request.followingId,
//             },
//             data: {
//               ...(await getRelationshipCounts(request.followingId)),
//             },
//           });
//           await ctx.prisma.relationshipRequest.update({
//             where: { id: input.id },
//             data: { status: input.status },
//           });
//           return profile;
//         }
//       }
//       return null;
//     }),
// });
