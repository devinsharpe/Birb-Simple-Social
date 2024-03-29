import type { GetStaticProps, NextPage } from "next";
import { cleanFilename, getDocs } from "../../utils/docs";

import React from "react";
import Redirect from "../../components/Redirect";

export interface TermsIndexPageProps {
  redirectSlug: string;
}

const TermsIndexPage: NextPage<TermsIndexPageProps> = ({ redirectSlug }) => {
  return (
    <>
      <Redirect href={`/terms/${redirectSlug}`} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const files = await getDocs("terms");
  return {
    props: {
      redirectSlug: cleanFilename(files[0]),
    },
  };
};

export default TermsIndexPage;
