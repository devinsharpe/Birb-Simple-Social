import { names, uniqueNamesGenerator } from "unique-names-generator";
import { protectedProcedure, router } from "../trpc";

import type { Config } from "unique-names-generator";

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

export const profileRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = ctx.prisma.profile.findFirst({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (typeof profile !== "undefined") {
      console.log("Hello world");
      return profile;
    } else {
      const result = await ctx.prisma.profile.create({
        data: {
          id: ctx.session.user.id,
          name: "",
          handle: uniqueNamesGenerator(nameConfig)
            .toLowerCase()
            .replaceAll(" ", "-"),
        },
      });
      return result;
    }
  }),
});
