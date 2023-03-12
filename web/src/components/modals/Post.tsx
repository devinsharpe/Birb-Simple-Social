import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import atoms from "../../atoms";
import DialogModal from "../DialogModal";
import PostForm from "../forms/Post";

export const KEY = "post-new";

export interface SimplePost {
  text: string;
  location: string;
}

const PostModal = () => {
  const [post, setPost] = useState<SimplePost>({
    text: "",
    location: "",
  });
  const [modal, setModal] = useAtom(atoms.modal);

  useEffect(() => {
    if (!modal) {
      setPost({
        text: "",
        location: "",
      });
    }
  }, [modal]);

  return (
    <DialogModal isDismissable={false} name={KEY} title="Create Post">
      <PostForm
        post={post}
        onCancel={() => setModal(undefined)}
        onChange={(val) => setPost(val)}
        onSubmit={console.log}
      />
    </DialogModal>
  );
};

export default PostModal;
