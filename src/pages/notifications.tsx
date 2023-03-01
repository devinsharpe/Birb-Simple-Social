import type { Profile, RelationshipRequest } from "@prisma/client";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";

const LoginPage: NextPage = () => {
  const [requests, setRequests] = useState<
    (RelationshipRequest & { follower: Profile })[]
  >([]);
  const [page, setPage] = useState(1);
  const listRequests = trpc.profiles.listRequests.useMutation();

  useEffect(() => {
    listRequests
      .mutateAsync({ count: 10, page })
      .then((req) => setRequests(req));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <section className="hide-scrollbar container mx-auto h-screen max-w-2xl overflow-y-scroll py-16 ">
        {requests.map((req) => (
          <p key={req.follower.id}>{req.follower.handle}</p>
        ))}
        <p>hello world</p>
      </section>
      <Navbar />
    </>
  );
};

export default LoginPage;
