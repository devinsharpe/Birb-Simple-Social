import { PostType, RelationshipType, Visibility } from "@prisma/client";
import { names, uniqueNamesGenerator } from "unique-names-generator";
import { protectedProcedure, publicProcedure, router } from "../../trpc";

import type { Config } from "unique-names-generator";
import { HANDLE_REGEX } from "../../../../utils/profiles";
import type { ILoremIpsumParams } from "lorem-ipsum";
import { examplePosts } from "../../../../utils/posts";
import { loremIpsum } from "lorem-ipsum";
import { z } from "zod";

const nameConfig: Config = {
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
const textConfig: ILoremIpsumParams = {
  count: 30,
  format: "plain",
  units: "words",
};

export const IMAGE_POST_LIMIT = 1;
export const TEXT_POST_LIMIT = 3;

function shuffle(array: typeof examplePosts) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
  return array;
}

export const postsRouter = router({
  archive: protectedProcedure
    .input(
      z.strictObject({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: {
          id: input.id,
          profileId: ctx.session.user.id,
        },
      });
      if (post) {
        const updatedPost = await ctx.prisma.post.update({
          where: {
            id: input.id,
          },
          data: {
            visibility: Visibility.ARCHIVED,
          },
        });
        await ctx.prisma.profile.update({
          where: {
            id: updatedPost.profileId,
          },
          data: {
            postCount: {
              decrement: 1,
            },
          },
        });
        return updatedPost;
      }
      return null;
    }),
  availableCount: protectedProcedure.mutation(async ({ ctx }) => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const imageCount = await ctx.prisma.post.count({
      where: {
        profileId: ctx.session.user.id,
        createdAt: {
          gt: date,
        },
        type: PostType.IMAGE,
        visibility: Visibility.ACTIVE,
      },
    });
    const textCount = await ctx.prisma.post.count({
      where: {
        profileId: ctx.session.user.id,
        createdAt: {
          gt: date,
        },
        type: PostType.TEXT,
        visibility: Visibility.ACTIVE,
      },
    });
    return {
      image: Math.max(IMAGE_POST_LIMIT - imageCount, 0),
      text: Math.max(TEXT_POST_LIMIT - textCount, 0),
    };
  }),
  create: protectedProcedure
    .input(
      z.strictObject({
        text: z.string().max(300),
        location: z.string().max(32).default(""),
        type: z.enum([PostType.IMAGE, PostType.TEXT]).default(PostType.TEXT),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          profileId: ctx.session.user.id,
          updatedAt: new Date(),
        },
      });
      const handles = input.text.match(HANDLE_REGEX);
      if (handles) {
        const profiles = await ctx.prisma.profile.findMany({
          where: {
            handle: {
              in: handles.map((handle) => handle.trim().replace("@", "")),
            },
          },
        });
        for (const profile of profiles) {
          const relationship = await ctx.prisma.profileRelationship.findFirst({
            where: {
              OR: [
                {
                  followerId: ctx.session.user.id,
                  followingId: profile.id,
                },
                {
                  followerId: profile.id,
                  followingId: ctx.session.user.id,
                },
              ],
            },
          });
          if (relationship || ctx.session.user.id === profile.id)
            await ctx.prisma.postMention.create({
              data: {
                postId: post.id,
                profileId: profile.id,
              },
            });
        }
      }
      await ctx.prisma.profile.update({
        data: {
          postCount: {
            increment: 1,
          },
        },
        where: {
          id: ctx.session.user.id,
        },
      });
      const result = await ctx.prisma.post.findFirst({
        where: {
          id: post.id,
        },
        include: {
          mentions: true,
        },
      });
      return result;
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
      await ctx.prisma.profileRelationship.findMany({
        select: {
          followingId: true,
        },
        where: {
          followerId: ctx.session.user.id,
          type: RelationshipType.FOLLOW,
        },
      })
    ).map((profile) => profile.followingId);
    const date = new Date();
    date.setDate(date.getDate() - 7);
    const posts = await ctx.prisma.post.findMany({
      where: {
        createdAt: {
          gt: date,
        },
        profileId: {
          in: [...ids, ctx.session.user.id],
        },
        visibility: Visibility.ACTIVE,
      },
      include: {
        mentions: {
          include: {
            profile: true,
          },
        },
        postedBy: true,
        reactions: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return posts;
  }),
});
