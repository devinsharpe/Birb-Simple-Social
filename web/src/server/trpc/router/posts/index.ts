import {
  PostType,
  PostTypeValues,
  RelationshipType,
  Visibility,
} from "~/server/db/schema/enums";
import { and, desc, eq, gt, inArray, or, sql } from "drizzle-orm";
import { examplePosts, nameConfig, shuffle, textConfig } from "~/utils/demo";
import {
  postMentions,
  posts,
  profileRelationships,
  profiles,
} from "~/server/db/schema/app";
import { protectedProcedure, publicProcedure, router } from "../../trpc";

import { HANDLE_REGEX } from "~/utils/profiles";
import { createId } from "~/server/db/utils";
import { loremIpsum } from "lorem-ipsum";
import { uniqueNamesGenerator } from "unique-names-generator";
import { z } from "zod";
import { env } from "../../../../env/server.mjs";

export const IMAGE_POST_LIMIT = 1;
export const TEXT_POST_LIMIT = 3;

export const postsRouter = router({
  archive: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let post = await ctx.db.query.posts.findFirst({
        where: and(
          eq(posts.id, input.id),
          eq(posts.profileId, ctx.session.user.id)
        ),
      });
      if (post) {
        post = await ctx.db
          .update(posts)
          .set({
            visibility: Visibility.Archived,
          })
          .where(eq(posts.id, post.id))
          .returning()
          .then((psts) => psts[0]);
        await ctx.db
          .update(profiles)
          .set({
            postCount: sql`${profiles.postCount.name} - 1`,
          })
          .where(eq(profiles.id, ctx.session.user.id));
        return post;
      }
      return null;
    }),
  availableCount: protectedProcedure.mutation(async ({ ctx }) => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const params = [
      eq(posts.profileId, ctx.session.user.id),
      eq(posts.visibility, Visibility.Active),
      gt(posts.createdAt, date.toISOString()),
    ];
    const imagePosts = await ctx.db
      .select()
      .from(posts)
      .where(and(...params, eq(posts.type, PostType.Image)));
    const textPosts = await ctx.db
      .select()
      .from(posts)
      .where(and(...params, eq(posts.type, PostType.Text)));
    return {
      image: Math.max(IMAGE_POST_LIMIT - imagePosts.length, 0),
      text: Math.max(TEXT_POST_LIMIT - textPosts.length, 0),
    };
  }),
  create: protectedProcedure
    .input(
      z.object({
        text: z.string().max(300),
        location: z.string().max(32).default(""),
        type: z.enum(PostTypeValues).default(PostType.Text),
        image: z.string().default(""),
        alt: z.string().max(500).default(""),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db
        .insert(posts)
        .values({
          ...input,
          id: createId(),
          profileId: ctx.session.user.id,
        })
        .returning()
        .then((psts) => psts[0] ?? null);
      const handles = input.text.match(HANDLE_REGEX);
      if (handles && post) {
        const handleProfiles = await ctx.db.query.posts.findMany({
          where: inArray(
            profiles.handle,
            handles.map((handle) =>
              handle.trim().replace("@", "").toLowerCase()
            )
          ),
        });
        for (const profile of handleProfiles.filter(
          (handleProfile) => handleProfile.id !== ctx.session.user.id
        )) {
          const relationship =
            await ctx.db.query.profileRelationships.findFirst({
              where: or(
                and(
                  eq(profileRelationships.followerId, ctx.session.user.id),
                  eq(profileRelationships.followingId, profile.id)
                ),
                and(
                  eq(profileRelationships.followerId, profile.id),
                  eq(profileRelationships.followingId, ctx.session.user.id)
                )
              ),
            });
          if (relationship)
            await ctx.db.insert(postMentions).values({
              id: createId(),
              postId: post.id,
              profileId: profile.id,
            });
        }
        await ctx.db
          .update(profiles)
          .set({
            postCount: sql`${profiles.postCount.name} + 1`,
          })
          .where(eq(profiles.id, ctx.session.user.id));
        const result = await ctx.db.query.posts.findFirst({
          where: eq(posts.id, post.id),
          with: {
            mentions: true,
          },
        });
        return result ?? null;
      }
    }),
  getDemoPosts: publicProcedure.query(() => {
    const posts = shuffle([...examplePosts]);
    return [...new Array(10)].map((_, index) => {
      const name = uniqueNamesGenerator(nameConfig).replaceAll("_", " ");
      return {
        id: index,
        profile: {
          handle: name.replaceAll(" ", "-").toLowerCase(),
          name,
        },
        age: Math.ceil(Math.random() * 23),
        text: posts[index]?.text || loremIpsum(textConfig),
        photo: posts[index]?.photo,
        commentCount: Math.ceil(Math.random() * 15),
        likedByUser: Boolean(Math.round(Math.random())),
      };
    });
  }),
  getTimeline: protectedProcedure.mutation(async ({ ctx }) => {
    const ids = (
      await ctx.db.query.profileRelationships.findMany({
        columns: {
          followingId: true,
        },
        where: and(
          eq(profileRelationships.followerId, ctx.session.user.id),
          eq(profileRelationships.type, RelationshipType.Follow)
        ),
      })
    ).map((relationship) => relationship.followingId);
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const timelinePosts = await ctx.db.query.posts.findMany({
      where: and(
        gt(posts.createdAt, date.toISOString()),
        inArray(posts.profileId, [...ids, ctx.session.user.id]),
        eq(posts.visibility, Visibility.Active)
      ),
      with: {
        mentions: {
          with: {
            profile: true,
          },
        },
        postedBy: true,
        reactions: {
          with: {
            postedBy: true,
          },
        },
      },
      orderBy: desc(posts.createdAt),
    });
    return timelinePosts;
  }),
});

// export const postsRouterOld = router({
//   archive: protectedProcedure
//     .input(
//       z.strictObject({
//         id: z.string(),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const post = await ctx.prisma.post.findFirst({
//         where: {
//           id: input.id,
//           profileId: ctx.session.user.id,
//         },
//       });
//       if (post) {
//         const updatedPost = await ctx.prisma.post.update({
//           where: {
//             id: input.id,
//           },
//           data: {
//             visibility: Visibility.ARCHIVED,
//           },
//         });
//         await ctx.prisma.profile.update({
//           where: {
//             id: updatedPost.profileId,
//           },
//           data: {
//             postCount: {
//               decrement: 1,
//             },
//           },
//         });
//         return updatedPost;
//       }
//       return null;
//     }),
//   availableCount: protectedProcedure.mutation(async ({ ctx }) => {
//     const date = new Date();
//     date.setDate(date.getDate() - 1);
//     const imageCount = await ctx.prisma.post.count({
//       where: {
//         profileId: ctx.session.user.id,
//         createdAt: {
//           gt: date,
//         },
//         type: PostType.IMAGE,
//         visibility: Visibility.ACTIVE,
//       },
//     });
//     const textCount = await ctx.prisma.post.count({
//       where: {
//         profileId: ctx.session.user.id,
//         createdAt: {
//           gt: date,
//         },
//         type: PostType.TEXT,
//         visibility: Visibility.ACTIVE,
//       },
//     });
//     return {
//       image: Math.max(IMAGE_POST_LIMIT - imageCount, 0),
//       text: Math.max(TEXT_POST_LIMIT - textCount, 0),
//     };
//   }),
//   create: protectedProcedure
//     .input(
//       z.strictObject({
//         text: z.string().max(300),
//         location: z.string().max(32).default(""),
//         type: z.enum([PostType.IMAGE, PostType.TEXT]).default(PostType.TEXT),
//         image: z.string().default(""),
//         alt: z.string().max(500).default(""),
//       })
//     )
//     .mutation(async ({ ctx, input }) => {
//       const post = await ctx.prisma.post.create({
//         data: {
//           ...input,
//           profileId: ctx.session.user.id,
//           updatedAt: new Date(),
//         },
//       });
//       const handles = input.text.match(HANDLE_REGEX);
//       if (handles) {
//         const profiles = await ctx.prisma.profile.findMany({
//           where: {
//             handle: {
//               in: handles.map((handle) => handle.trim().replace("@", "")),
//             },
//           },
//         });
//         for (const profile of profiles) {
//           const relationship = await ctx.prisma.profileRelationship.findFirst({
//             where: {
//               OR: [
//                 {
//                   followerId: ctx.session.user.id,
//                   followingId: profile.id,
//                 },
//                 {
//                   followerId: profile.id,
//                   followingId: ctx.session.user.id,
//                 },
//               ],
//             },
//           });
//           if (relationship || ctx.session.user.id === profile.id)
//             await ctx.prisma.postMention.create({
//               data: {
//                 postId: post.id,
//                 profileId: profile.id,
//               },
//             });
//         }
//       }
//       await ctx.prisma.profile.update({
//         data: {
//           postCount: {
//             increment: 1,
//           },
//         },
//         where: {
//           id: ctx.session.user.id,
//         },
//       });
//       const result = await ctx.prisma.post.findFirst({
//         where: {
//           id: post.id,
//         },
//         include: {
//           mentions: true,
//         },
//       });
//       fetch(`${env.MODERATION_URL}api/queue/add`, {
//         keepalive: false,
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify([
//           {
//             id: post.id,
//             text: post.text,
//             type: "POST",
//           },
//         ]),
//       });
//       return result;
//     }),
//   getDemoPosts: publicProcedure.query(() => {
//     const posts = shuffle([...examplePosts]);
//     return [...new Array(10)].map((_, index) => {
//       const name = uniqueNamesGenerator(nameConfig).replaceAll("_", " ");
//       return {
//         id: index,
//         profile: {
//           handle: name.replaceAll(" ", "-").toLowerCase(),
//           name,
//         },
//         age: Math.ceil(Math.random() * 23),
//         text: posts[index]?.text || loremIpsum(textConfig),
//         photo: posts[index]?.photo,
//         commentCount: Math.ceil(Math.random() * 15),
//         likedByUser: Boolean(Math.round(Math.random())),
//       };
//     });
//   }),
//   getTimeline: protectedProcedure.mutation(async ({ ctx }) => {
//     const ids = (
//       await ctx.prisma.profileRelationship.findMany({
//         select: {
//           followingId: true,
//         },
//         where: {
//           followerId: ctx.session.user.id,
//           type: RelationshipType.FOLLOW,
//         },
//       })
//     ).map((profile) => profile.followingId);
//     const date = new Date();
//     date.setDate(date.getDate() - 7);
//     const posts = await ctx.prisma.post.findMany({
//       where: {
//         createdAt: {
//           gt: date,
//         },
//         profileId: {
//           in: [...ids, ctx.session.user.id],
//         },
//         visibility: Visibility.ACTIVE,
//       },
//       include: {
//         mentions: {
//           include: {
//             profile: true,
//           },
//         },
//         postedBy: true,
//         reactions: {
//           include: {
//             profile: true,
//           },
//         },
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     return posts;
//   }),
// });
