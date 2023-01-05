import type { GetStaticProps, NextPage } from "next";
import { cleanFilename, getDocs, processMarkdownFile } from "../../utils/docs";

import Image from "next/image";
import Link from "next/link";
import type { ParsedUrlQuery } from "querystring";
import React from "react";
import { useRouter } from "next/router";

export interface TermsPageProps {
  slug?: string;
  docs: string[];
  data: { createdDate: number; effectiveDate: number };
  content: string;
}

const TermsPage: NextPage<TermsPageProps> = (props) => {
  const router = useRouter();
  const { formattedEffectiveDate, formattedCreatedDate } = React.useMemo(() => {
    const created = new Date(props.data.createdDate * 1000);
    const effective = new Date(props.data.effectiveDate * 1000);
    return {
      formattedCreatedDate: created.toLocaleDateString(),
      formattedEffectiveDate: effective.toLocaleDateString(),
    };
  }, [props.data]);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 bg-zinc-200/50 px-8 py-4 backdrop-blur-md dark:bg-zinc-800/50">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image
              src="/icons/icon.svg"
              width={48}
              height={48}
              alt="Birb Logo"
            />
          </Link>
          <select
            name="terms-archive-select"
            id="terms-archive-select"
            onChange={(e) => router.push(`/terms/${e.target.value}`)}
            value={props.slug}
            className="w-48 rounded-md text-sm dark:border-zinc-600 dark:bg-zinc-700"
          >
            {props.docs.map((doc) => (
              <option value={doc} key={doc}>
                {new Date(doc + "T00:00:00").toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
      </nav>
      <div className="mt-16 px-8 py-16">
        <h1 className="text-3xl font-bold tracking-wide">
          Birb Social Terms & Conditions
        </h1>
      </div>
      <div className="mx-8 rounded-md bg-zinc-200 p-4 dark:bg-zinc-800">
        <p>Effective: {formattedEffectiveDate}</p>
        <p>Posted: {formattedCreatedDate}</p>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: props.content }}
        className="prose prose-zinc p-8 dark:prose-invert lg:max-w-4xl lg:prose-lg xl:prose-xl"
      />
    </>
  );
};

export interface QParams extends ParsedUrlQuery {
  slug?: string;
}
export const getStaticProps: GetStaticProps<TermsPageProps, QParams> = async ({
  params,
}) => {
  const files = await getDocs("terms");
  let filename: string;
  if (params?.slug && files.includes(params.slug + ".md"))
    filename = params.slug + ".md";
  else filename = files[0];
  return {
    props: {
      ...(await processMarkdownFile(filename, "terms")),
      docs: files.map((f) => cleanFilename(f)),
      slug: params?.slug,
    },
  };
};

export const getStaticPaths = async () => {
  const files = await getDocs("terms");
  return {
    paths: files.map((file) => ({
      params: {
        slug: cleanFilename(file),
      },
    })),
    fallback: false,
  };
};

export default TermsPage;
