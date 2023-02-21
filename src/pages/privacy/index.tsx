import type { GetServerSideProps, NextPage } from "next";
import { cleanFilename, getDocs } from "../../utils/docs";

import React from "react";
import Redirect from "../../components/Redirect";

export interface PrivacyIndexPageProps {
  redirectSlug: string;
}

const PrivacyIndexPage: NextPage<PrivacyIndexPageProps> = ({
  redirectSlug,
}) => {
  return (
    <>
      <Redirect href={`/privacy/${redirectSlug}`} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const files = await getDocs("privacy");
  return {
    props: {
      redirectSlug: cleanFilename(files[0]),
    },
  };
};

export default PrivacyIndexPage;
