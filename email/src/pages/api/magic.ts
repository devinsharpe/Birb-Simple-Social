import type { NextApiRequest, NextApiResponse } from "next";
import mailer from "../../lib/mailer";
import { render } from "@react-email/render";
import BirbMagicLink from "../../emails/birb-magic-link";
import { env } from "../../env.mjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  subject: z.string().default("Birb Magic Link"),
  props: z.object({
    url: z.string(),
    supportUrl: z.string()
  })
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") return res.status(405).end();
  const schemaRes = await schema.safeParseAsync(req.body);
  if (!schemaRes.success)
    return res.status(400).send({
      message: "Incorrect body schema"
    });

  const html = render(
    BirbMagicLink({
      ...schemaRes.data.props
    })
  );
  const options = {
    from: `${env.EMAIL_NAME} <${env.EMAIL_USER}>`,
    to: schemaRes.data.email,
    subject: "Birb Magic Link",
    html
  };
  const result = await mailer.sendMail(options);
  console.log(result);
  return res.status(204).end();
};

export default handler;
