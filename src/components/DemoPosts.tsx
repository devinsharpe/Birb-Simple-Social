import DialogMenu from "./DialogMenu";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import React from "react";
import { trpc } from "../utils/trpc";

const DemoPost: React.FC<{
  post: {
    id: number;
    age: number;
    profile: {
      handle: string;
      name: string;
    };
    photo?: string;
    text: string;
    commentCount: number;
    likedByUser: boolean;
  };
}> = ({ post }) => {
  return (
    <article className="space-y-4 px-6 pt-4 pb-4">
      <div className="flex items-center space-x-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-white">
          <FeatherIcon icon="user" size={24} />
        </div>
        <div className="w-full">
          <h4 className="font-medium" title={post.profile.handle}>
            {post.profile.name}
          </h4>
          <h5 className="text-sm text-zinc-600 dark:text-zinc-400">
            {post.age} hour{post.age > 1 && "s"} ago
          </h5>
        </div>
        <DialogMenu
          className="px-2 py-1 text-zinc-600 dark:text-zinc-400"
          items={[
            [
              {
                icon: "user-minus",
                text: `Unfollow ${post.profile.name}`,
                onClick: console.log,
              },
              {
                icon: "x-octagon",
                text: `Block ${post.profile.name}`,
                onClick: console.log,
              },
              {
                icon: "flag",
                text: "Report Post",
                onClick: console.log,
              },
            ],
          ]}
        >
          <FeatherIcon icon="more-horizontal" size={24} />
        </DialogMenu>
      </div>
      <div className="space-y-4 pl-12">
        {post.photo && (
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-md">
            <Image
              src={post.photo}
              alt="demo post photo"
              width={512}
              height={512}
              className="h-full w-full object-cover object-center"
            />
          </div>
        )}
        <p className="max-w-xl">{post.text}</p>
      </div>
      <div className="flex items-center space-x-6 pl-12">
        <button type="button" className="rounded p-2">
          <FeatherIcon
            icon="thumbs-up"
            size={16}
            className={`${
              post.likedByUser && "fill-zinc-800 dark:fill-zinc-200"
            }`}
          />
        </button>
        <button type="button" className="rounded p-2">
          <FeatherIcon icon="message-square" size={16} />
        </button>
        <button type="button" className="rounded p-2">
          <FeatherIcon icon="share-2" size={16} />
        </button>
        <p className="w-full text-right text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          {post.commentCount} Comment{post.commentCount !== 1 && "s"}
        </p>
      </div>
    </article>
  );
};

const DemoPosts = () => {
  const posts = trpc.posts.getDemoPosts.useQuery(undefined, {
    cacheTime: Infinity,
    refetchInterval: 0,
  });
  if (posts.data)
    return (
      <>
        {posts.data.map((post) => (
          <DemoPost post={post} key={post.id} />
        ))}
      </>
    );
  return <></>;
};

export default DemoPosts;
