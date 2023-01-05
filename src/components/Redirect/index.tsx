import React from "react";
import { useRouter } from "next/router";

const Redirect: React.FC<{ href: string }> = ({ href }) => {
  const router = useRouter();
  if (typeof window !== "undefined") router.push(href);
  return <></>;
};

export default Redirect;
