import { useCallback, useEffect, useState } from "react";

import { useAtom } from "jotai";
import { AlignLeft, ImageIcon, Smile } from "lucide-react";
import { PostType } from "~/server/db/schema/enums";
import atoms from "../../atoms";
import useToasts from "../../hooks/toasts";
import { trpc } from "../../utils/trpc";
import DialogModal from "../DialogModal";
import PostForm from "../forms/Post";

export const KEY = "post-new";

export interface SimplePost {
  text: string;
  location: string;
  alt: string;
  image: string;
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
          {type === PostType.Text ? (
            <AlignLeft size={20} />
          ) : (
            <ImageIcon size={16} />
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
    alt: "",
    image: "",
  });
  const [modal, setModal] = useAtom(atoms.modal);
  const { addToast } = useToasts();
  const createPost = trpc.posts.create.useMutation();
  const getAvaiable = trpc.posts.availableCount.useMutation();

  useEffect(() => {
    if (!modal) {
      getAvaiable.mutateAsync().then((avail) => setAvailable(avail));
      setPost({
        text: "",
        location: "",
        alt: "",
        image: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  const handleSubmit = useCallback(async () => {
    if (post.text) {
      const newPost = await createPost.mutateAsync({
        ...post,
        type: post.image.length ? PostType.Image : PostType.Text,
      });
      setModal(undefined);
      addToast({
        id: "post-new",
        content: "Thanks for sharing!",
        icon: Smile,
      });
      return newPost;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            type={PostType.Text}
            value={3 - available.text}
          />
          <AvailablePostIndicator
            style="violet"
            type={PostType.Text}
            value={available.text}
          />
          <AvailablePostIndicator
            style="zinc"
            type={PostType.Image}
            value={1 - available.image}
          />
          <AvailablePostIndicator
            style="violet"
            type={PostType.Image}
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
