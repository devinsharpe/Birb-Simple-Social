import { useCallback, useEffect, useState } from "react";
import type { Profile, RelationshipRequest } from "~/server/db/schema/app";
import { RequestStatus } from "~/server/db/schema/enums";

import {
  ArrowLeft,
  Check,
  CheckCircle,
  Loader,
  MoreVertical,
  X,
  XCircle,
} from "lucide-react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { DEFAULT_AVATAR_URL } from "~/server/db/schema/constants";
import DialogMenu from "../components/DialogMenu";
import Navbar from "../components/Navbar";
import Redirect from "../components/Redirect";
import { trpc } from "../utils/trpc";

const RequestNotification: React.FC<{
  loading: boolean;
  onClick: (id: string, status: RequestStatus) => void;
  request: RelationshipRequest & { follower: Profile };
}> = ({ loading, onClick, request }) => {
  return (
    <div className="flex w-full items-center gap-4 py-2 px-4">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full">
        <Image
          src={request.follower.avatarUrl ?? DEFAULT_AVATAR_URL}
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
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
      </Link>
      {request.status === RequestStatus.Pending && (
        <DialogMenu
          items={[
            [
              {
                icon: Check,
                text: "Approve",
                onClick: () => onClick(request.id, RequestStatus.Accepted),
                disabled: loading,
              },
              {
                icon: X,
                text: "Deny",
                onClick: () => onClick(request.id, RequestStatus.Denied),
                disabled: loading,
              },
            ],
          ]}
        >
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            <MoreVertical size={20} />
          )}
        </DialogMenu>
      )}
      {request.status === RequestStatus.Accepted && (
        <div className="rounded-md bg-violet-700 p-2 text-white dark:bg-violet-400 dark:text-black">
          <CheckCircle size={20} />
        </div>
      )}
      {request.status === RequestStatus.Denied && (
        <div className="rounded-md bg-zinc-700 p-2 text-white dark:bg-zinc-400 dark:text-black">
          <XCircle size={20} />
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
      listRequests.mutateAsync().then((req) => setRequests(req));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (session.status === "authenticated")
    return (
      <>
        {requests.length ? (
          <>
            {requests.map((req) => (
              <RequestNotification
                key={req.id}
                onClick={handleRequestClick}
                request={req}
                loading={updateRequest.isLoading}
              />
            ))}
          </>
        ) : (
          <>
            <div className="flex h-64 w-full flex-col items-center justify-center gap-4 px-6">
              <h4 className="text-center text-2xl font-bold text-black dark:text-white md:text-4xl">
                Ahhh... Peace and quiet
              </h4>
              <h5 className="text-center text-xl font-medium text-zinc-700 dark:text-zinc-400 md:text-2xl">
                Follow requests appear here as people find your profile
              </h5>
            </div>
          </>
        )}

        <Navbar
          brandEl={
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1"
                onClick={() => router.back()}
              >
                <ArrowLeft size={24} />
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
