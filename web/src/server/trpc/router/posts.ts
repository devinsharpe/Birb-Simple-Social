import { names, uniqueNamesGenerator } from "unique-names-generator";
import { protectedProcedure, publicProcedure, router } from "../trpc";

import { z } from "zod";
import type { Config } from "unique-names-generator";
import type { ILoremIpsumParams } from "lorem-ipsum";
import { examplePosts } from "../../../utils/posts";
import { loremIpsum } from "lorem-ipsum";
import { PostType } from "@prisma/client";
import { HANDLE_REGEX } from "../../../utils/profiles";

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

function shuffle(array: typeof examplePosts) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
  return array;
}

export const postsRouter = router({
  create: protectedProcedure
    .input(
      z.strictObject({
        text: z.string().max(300),
        location: z.string().max(32).default(""),
        type: z.enum([PostType.IMAGE, PostType.TEXT]).default("TEXT"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          profileId: ctx.session.user.id,
        },
      });
      const handles = input.text.match(HANDLE_REGEX);
      if (handles) {
        const profiles = await ctx.prisma.profile.findMany({
          where: {
            handle: {
              in: handles.map((handle) => handle.replace("@", "")),
            },
          },
        });
        for (const profile of profiles) {
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
});
