import type { NextPage } from "next";
import { env } from "../env.mjs";

interface HomePageProps {
  notFound: boolean;
}

const Home: NextPage<HomePageProps> = ({ notFound }) => {
  if (notFound) return null;
  return (
    <>
      <main>
        <p>Hello world</p>
      </main>
    </>
  );
};

export const getServerSideProps = () => {
  const notFound = env.NODE_ENV !== "development";
  return {
    props: {
      notFound
    }
  };
};

export default Home;
