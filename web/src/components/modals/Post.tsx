import { useCallback, useEffect, useState } from "react";

import DialogModal from "../DialogModal";
import FeatherIcon from "feather-icons-react";
import PostForm from "../forms/Post";
import { PostType } from "@prisma/client";
import atoms from "../../atoms";
import { trpc } from "../../utils/trpc";
import { useAtom } from "jotai";

export const KEY = "post-new";

export interface SimplePost {
  text: string;
  location: string;
}

interface AvailablePostIndicatorProps {
  style: "violet" | "zinc";
  type: PostType;
  value: number;
}

const AvailablePostIndicator: React.FC<AvailablePostIndicatorProps> = ({
  style,
  type,
  value,
}) => {
  return (
    <>
      {[...Array(value).keys()].map((index) => (
        <div
          key={`avail-post-${type}-${style}-${index}`}
          className={`flex h-8 w-8 items-center justify-center rounded-full border ${
            style === "violet"
              ? "border-violet-300 bg-violet-100 text-violet-700 dark:border-violet-600 dark:bg-violet-700 dark:text-violet-200"
              : "border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-zinc-600 dark:bg-zinc-700"
          }`}
        >
          {type === PostType.TEXT ? (
            <FeatherIcon size={20} icon="align-left" />
          ) : (
            <FeatherIcon size={16} icon="image" />
          )}
        </div>
      ))}
    </>
  );
};

const PostModal = () => {
  const [available, setAvailable] = useState({
    image: 0,
    text: 0,
  });
  const [post, setPost] = useState<SimplePost>({
    text: "",
    location: "",
  });
  const [modal, setModal] = useAtom(atoms.modal);
  const createPost = trpc.posts.create.useMutation();
  const getAvaiable = trpc.posts.availableCount.useMutation();

  useEffect(() => {
    if (!modal) {
      getAvaiable.mutateAsync().then((avail) => setAvailable(avail));
      setPost({
        text: "",
        location: "",
      });
    }
  }, [modal]);

  const handleSubmit = useCallback(async () => {
    if (post.text) {
      const newPost = await createPost.mutateAsync({
        ...post,
        type: PostType.TEXT,
      });
      setModal(undefined);
      return newPost;
    }
    return null;
  }, [post.text, post.location]);

  return (
    <DialogModal isDismissable={false} name={KEY} title="Create Post">
      <>
        <div
          className="absolute top-4 right-4 z-[3] flex cursor-pointer items-center justify-end -space-x-4"
          title={`${available.text} text posts avaible, ${available.image} image posts avaible`}
        >
          <AvailablePostIndicator
            style="zinc"
            type={PostType.TEXT}
            value={3 - available.text}
          />
          <AvailablePostIndicator
            style="violet"
            type={PostType.TEXT}
            value={available.text}
          />
          <AvailablePostIndicator
            style="zinc"
            type={PostType.IMAGE}
            value={1 - available.image}
          />
          <AvailablePostIndicator
            style="violet"
            type={PostType.IMAGE}
            value={available.image}
          />
        </div>
        <PostForm
          post={post}
          isLoading={createPost.isLoading}
          onCancel={() => setModal(undefined)}
          onChange={(val) => setPost(val)}
          onSubmit={handleSubmit}
        />
      </>
    </DialogModal>
  );
};

export default PostModal;
