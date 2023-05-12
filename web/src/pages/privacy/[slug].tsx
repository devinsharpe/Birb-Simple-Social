import type { DocsPageProps, SlugParams } from "../../utils/docs";
import type { GetStaticProps, NextPage } from "next";
import { cleanFilename, getDocs, processMarkdownFile } from "../../utils/docs";

import DocsNav from "../../components/docs/nav";
import React from "react";
import { useRouter } from "next/router";

const PrivacyPage: NextPage<DocsPageProps> = ({
  content,
  data,
  docs,
  slug,
}) => {
  const router = useRouter();
  return (
    <>
      <DocsNav
        current={slug}
        docs={docs}
        onDocSelect={(doc) => router.push(`/privacy/${doc}`)}
      />
      <div className="px-8 py-16">
        <h1 className="text-3xl font-bold tracking-wide">
          Birb Social Privacy Policy
        </h1>
      </div>
      <div className="mx-8 border-y border-zinc-300 py-4 dark:border-zinc-800">
        <p>
          Effective: {new Date(data.effectiveDate * 1000).toLocaleDateString()}
        </p>
        <p>Posted: {new Date(data.createdDate * 1000).toLocaleDateString()}</p>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        className="prose prose-zinc p-8 dark:prose-invert lg:max-w-4xl lg:prose-lg xl:prose-xl"
      />
    </>
  );
};

export const getStaticProps: GetStaticProps<
  DocsPageProps,
  SlugParams
> = async ({ params }) => {
  const files = await getDocs("privacy");
  let filename: string;
  if (params?.slug && files.includes(params.slug + ".md"))
    filename = params.slug + ".md";
  else filename = files[0];
  return {
    props: {
      ...(await processMarkdownFile(filename, "privacy")),
      docs: files.map((f) => cleanFilename(f)),
      slug: params?.slug,
    },
  };
};

export const getStaticPaths = async () => {
  const files = await getDocs("privacy");
  return {
    paths: files.map((file) => ({
      params: {
        slug: cleanFilename(file),
      },
    })),
    fallback: false,
  };
};

export default PrivacyPage;
