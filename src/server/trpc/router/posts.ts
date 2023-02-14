import { Config, names, uniqueNamesGenerator } from "unique-names-generator";
import { ILoremIpsumParams, loremIpsum } from "lorem-ipsum";
import { publicProcedure, router } from "../trpc";

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

export const postsRouter = router({
  getDemoPosts: publicProcedure.query(() => {
    return [...new Array(10)].map((_, index) => {
      const name = uniqueNamesGenerator(nameConfig).replaceAll("_", " ");
      return {
        id: index,
        profile: {
          handle: name.replaceAll(" ", "-").toLowerCase(),
          name,
        },
        text: loremIpsum(textConfig),
        commentCount: Math.ceil(Math.random() * 15),
        likedByUser: Boolean(Math.round(Math.random())),
      };
    });
  }),
});
