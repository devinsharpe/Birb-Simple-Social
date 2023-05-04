import type { Profile, RelationshipRequest } from "@prisma/client";
import { RequestStatus } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

import DialogMenu from "../components/DialogMenu";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import type { NextPage } from "next";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import Redirect from "../components/Redirect";

const RequestNotification: React.FC<{
  loading: boolean;
  onClick: (id: string, status: RequestStatus) => void;
  request: RelationshipRequest & { follower: Profile };
}> = ({ loading, onClick, request }) => {
  return (
    <div className="flex w-full items-center gap-4 py-2 px-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full">
        <Image
          src={
            request.follower.avatarUrl ??
            "https://source.unsplash.com/random/600×600/?cat"
          }
          className="h-full w-full object-cover object-center"
          alt={`${request.follower.name}'s avatar image`}
          width={128}
          height={128}
        />
      </div>
      <Link href={`/@/${request.follower.handle}`} className="group w-full">
        <div className="w-full">
          <h5>
            <span className="font-semibold group-hover:underline">
              {request.follower.name}
            </span>
            &nbsp;would like to follow you.
          </h5>
          <p className="text-xs opacity-75">
            {request.createdAt.toLocaleDateString()}
          </p>
        </div>
      </Link>
      {request.status === RequestStatus.PENDING && (
        <DialogMenu
          items={[
            [
              {
                icon: "check",
                text: "Approve",
                onClick: () => onClick(request.id, RequestStatus.ACCEPTED),
                disabled: loading,
              },
              {
                icon: "x",
                text: "Deny",
                onClick: () => onClick(request.id, RequestStatus.DENIED),
                disabled: loading,
              },
            ],
          ]}
        >
          {loading ? (
            <FeatherIcon icon="loader" className="animate-spin" />
          ) : (
            <FeatherIcon icon="more-vertical" size={20} />
          )}
        </DialogMenu>
      )}
      {request.status === RequestStatus.ACCEPTED && (
        <div className="rounded-md bg-violet-700 p-2 text-white dark:bg-violet-400 dark:text-black">
          <FeatherIcon icon="check-circle" size={20} />
        </div>
      )}
      {request.status === RequestStatus.DENIED && (
        <div className="rounded-md bg-zinc-700 p-2 text-white dark:bg-zinc-400 dark:text-black">
          <FeatherIcon icon="x-circle" size={20} />
        </div>
      )}
    </div>
  );
};

const NotificationsPage: NextPage = () => {
  const [requests, setRequests] = useState<
    (RelationshipRequest & { follower: Profile })[]
  >([]);
  const router = useRouter();
  const session = useSession();
  const [page] = useState(1);
  const listRequests = trpc.requests.list.useMutation();
  const updateRequest = trpc.requests.update.useMutation();

  const handleRequestClick = useCallback(
    async (id: string, status: RequestStatus) => {
      const newRequest = await updateRequest.mutateAsync({ id, status });
      if (newRequest) setRequests(await listRequests.mutateAsync());
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (session.status === "authenticated")
      listRequests
        .mutateAsync({ count: 10, page })
        .then((req) => setRequests(req));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (session.status === "authenticated")
    return (
      <>
        {requests.map((req) => (
          <RequestNotification
            key={req.id}
            onClick={handleRequestClick}
            request={req}
            loading={updateRequest.isLoading}
          />
        ))}

        <Navbar
          brandEl={
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1"
                onClick={() => router.back()}
              >
                <FeatherIcon icon="arrow-left" size={24} />
              </button>
              <h4 className="text-xl font-bold tracking-wide">Notifications</h4>
            </div>
          }
        />
      </>
    );
  else return <Redirect href="/" />;
};

export default NotificationsPage;
