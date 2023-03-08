import DialogModal from "../DialogModal";
import PostForm from "../forms/Post";

export const KEY = "post-new";

const PostModal = () => {
  return (
    <DialogModal isDismissable name={KEY} title="Create Post">
      <PostForm
        post={{
          text: "",
          location: "",
        }}
        onChange={console.log}
        onSubmit={console.log}
      />
    </DialogModal>
  );
};

export default PostModal;
