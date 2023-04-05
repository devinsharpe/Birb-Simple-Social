import * as React from "react";
import {
  Body,
  Row,
  Column,
  Heading,
  Head,
  Img,
  Container,
  Tailwind,
  Preview,
  Html,
  Button,
  Section,
  Text,
  Link
} from "@react-email/components";
import baseUrl from "../lib/baseUrl";

interface BirbMagicLinkProps {
  url: string;
  supportUrl: string;
}

const BirbMagicLink = ({ url, supportUrl }: BirbMagicLinkProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Here's your Birb Magic Link 🪄 Open this email to get started with Birb
        - Simple Social
      </Preview>
      <Tailwind>
        <Body className="bg-white mx-auto pt-16 my-auto font-sans bg-zinc-900 text-zinc-200">
          <Container>
            <Row className="p-4 flex items-center gap-4">
              <Column>
                <Img
                  src={`${baseUrl}/icon@1x.png`}
                  width="36"
                  height="36"
                  alt="Birb's Logo"
                />
              </Column>
              <Column className="pl-4">
                <Heading className="w-full leading-none mb-0 text-violet-400">
                  Birb
                </Heading>
                <Heading className="text-lg mb-0 mt-2 leading-none font-light">
                  Simple Social
                </Heading>
              </Column>
            </Row>
            <Section className="px-4">
              <Heading className="font-semibold">
                Hey! We have some magic for you!
              </Heading>
              <Text className="text-lg">
                Click the button below to log into Birb - Simple Social using 🪄
                magic 🪄 While you're there, don't forget to support your
                friends, love yourself, and focus on the finer things in life
              </Text>
              <Button
                className="rounded-md bg-violet-700 flex items-center justify-center font-semibold w-auto px-8 py-4 my-8 text-white"
                href={url}
                hrefLang="en"
              >
                Login and Get Started
              </Button>
              <Text className="mb-4">
                If the button above isn't cooperating, feel free to use copy and
                paste this link into your browser:&nbsp;
                <Link
                  href={url}
                  hrefLang="en"
                  className="text-violet-400 underline"
                >
                  {url}
                </Link>
              </Text>
              <Text className="mb-4">
                Having trouble with Birb? Let us know -&nbsp;
                <Link
                  href={supportUrl}
                  hrefLang="en"
                  className="text-violet-400 underline"
                >
                  Birb Support
                </Link>
              </Text>
              <Text className="text-zinc-500">
                If you didn't attempt to login, you can safely ignore this
                email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BirbMagicLink;
