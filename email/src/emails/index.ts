import { z } from "zod";
import BirbMagicLink from "./birb-magic-link";
import { env } from "../env.mjs";

export enum EmailKeys {
  MagicLink = "MAGIC-LINK"
}

const emails = {
  [EmailKeys.MagicLink]: {
    name: "Magic Link",
    template: BirbMagicLink,
    defaultProps: {
      url: `https://${env.APP_URL}`,
      support: `https://${env.APP_URL}/support`
    },
    props: z.strictObject({
      url: z.string(),
      supportUrl: z.string()
    })
  }
};

export default emails;
