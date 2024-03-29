import type { ChangeEvent } from "react";
import React, { useCallback, useRef, useState } from "react";
import { Type, X, MapPin, Edit3, Loader, Camera } from "lucide-react";
import type { SimplePost } from "../modals/Post";
import Link from "next/link";
import type { PostBlock } from "../../hooks/postBlocks";
import usePostBlocks from "../../hooks/postBlocks";
import { formatUrl } from "../../pages/@/[handle]";
import useUpload from "../../hooks/upload";
import Image from "next/image";

interface PostFormProps {
  post: SimplePost;
  isLoading: boolean;
  onCancel: () => void;
  onChange: (post: SimplePost) => void;
  onSubmit: (post: SimplePost) => void;
}

export const HANDLE_REGEX_GLOBAL = /(^|[^@\w])@(\w{3,24})\b/g;
export const LINK_REGEX =
  /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/g;

const BlockValue: React.FC<{ block: PostBlock }> = ({ block }) => {
  if (block.overflowIndex !== -1) {
    return (
      <span>
        {block.value.slice(0, block.overflowIndex)}
        <span className="bg-rose-300/50 dark:bg-rose-800">
          {block.value.slice(block.overflowIndex)}
        </span>
      </span>
    );
  } else return <span>{block.value}</span>;
};

export const PostDisplay: React.FC<{ blocks: PostBlock[] }> = ({ blocks }) => {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "TEXT") {
          return <BlockValue block={block} key={index} />;
        } else if (block.type === "HANDLE") {
          return (
            <Link
              href={block.value.replace(" @", "/@/")}
              key={index}
              className="text-violet-700 dark:text-violet-400"
            >
              <BlockValue block={block} />
            </Link>
          );
        } else if (block.type === "LINK") {
          return (
            <a
              href={formatUrl(block.value).toString()}
              key={index}
              target="_blank"
              className="text-violet-700 underline dark:text-violet-400"
              rel="noreferrer"
            >
              <BlockValue block={block} />
            </a>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

export const PostEditor: React.FC<{
  onChange: (text: string) => void;
  placeholder?: string;
  value: string;
}> = ({ onChange, placeholder = "What's on your mind?", value }) => {
  const [height, setHeight] = useState(64);
  const { blocks } = usePostBlocks(value);
  const postDisplay = useRef<HTMLDivElement | null>(null);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height,
      }}
    >
      {value.length === 0 && (
        <p className="pointer-events-none absolute inset-0 z-[1] py-2 px-0 opacity-50">
          {placeholder}
        </p>
      )}
      <div
        className="absolute inset-0 z-[1] h-fit min-h-[64px] w-full whitespace-pre-wrap break-words py-2"
        id="post-editor"
        key="post-editor-field"
        ref={postDisplay}
      >
        <PostDisplay blocks={blocks} />
      </div>
      <textarea
        className="absolute inset-0 z-[2] h-full w-full resize-none overflow-hidden border-none bg-transparent py-2 px-0 text-white/0 caret-violet-700 outline-none dark:caret-violet-200"
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onKeyUp={() => {
          postDisplay.current
            ? setHeight(postDisplay.current.scrollHeight)
            : setHeight(64);
        }}
        onInput={() => {
          postDisplay.current
            ? setHeight(postDisplay.current.scrollHeight)
            : setHeight(64);
        }}
        value={value}
      ></textarea>
    </div>
  );
};

const PostForm: React.FC<PostFormProps> = ({
  post,
  isLoading,
  onCancel,
  onChange,
  onSubmit,
}) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const { handleUpload } = useUpload();

  const handleImageClick = useCallback(() => {
    if (imageRef.current) imageRef.current.click();
  }, [imageRef]);

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setIsImageLoading(true);
        const fileUrl = await handleUpload(e.target.files[0]);
        onChange({ ...post, image: fileUrl });
        setIsImageLoading(false);
      }
    },
    [handleUpload, onChange, post]
  );

  return (
    <form
      className="relative space-y-4 px-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(post);
      }}
    >
      {post.image && (
        <>
          <fieldset
            className={`relative flex items-center pt-2  ${
              post.location.length > 128 ? "text-rose-600" : ""
            }`}
          >
            <Type size={16} className="absolute left-0 opacity-50" />
            <input
              type="text"
              className="w-full rounded border-none bg-transparent pl-8 outline-none placeholder:text-zinc-800/50 focus:ring-0 dark:placeholder:text-white/50"
              placeholder="Image Alt Text"
              onChange={(e) => onChange({ ...post, alt: e.target.value })}
              value={post.alt}
            />
            <span className="right-0 text-sm opacity-50">
              {post.alt.length}/500
            </span>
            <button
              type="button"
              className="flex h-full items-center justify-center px-2 opacity-50"
              onClick={() => onChange({ ...post, alt: "", image: "" })}
            >
              <X size={20} />
            </button>
          </fieldset>
          <div className="mx-w-xl relative mx-auto h-32 w-full overflow-hidden lg:h-48">
            <Image
              src={post.image}
              alt="Current post image 1"
              fill
              className="object-contain"
            />
          </div>
        </>
      )}

      <PostEditor
        onChange={(text) => onChange({ ...post, text })}
        value={post.text}
      />

      <div className="absolute left-0 w-full px-2">
        <hr
          className={`w-auto rounded-full border-y-2 ${
            post.text.length <= 300 ? "border-zinc-600" : "border-rose-600/50"
          }`}
          style={{ width: `${Math.min((post.text.length / 300) * 100, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-4 pt-4 dark:border-zinc-700">
        <p className="text-sm opacity-50">{post.text.length}/300</p>
        <button
          type="button"
          className="rounded-md p-1"
          onClick={() => setShowLocationInput(!showLocationInput)}
        >
          {showLocationInput ? <X size={16} /> : <MapPin size={16} />}
        </button>
      </div>

      {showLocationInput && (
        <fieldset
          className={`relative flex items-center border-t border-zinc-300 pt-2 dark:border-zinc-600 ${
            post.location.length > 32 ? "text-rose-600" : ""
          }`}
        >
          <MapPin size={16} className="absolute left-0 opacity-50" />
          <input
            type="text"
            className="w-full rounded border-none bg-transparent pl-8 outline-none placeholder:text-zinc-800/50 focus:ring-0 dark:placeholder:text-white/50"
            placeholder="Location"
            onChange={(e) => onChange({ ...post, location: e.target.value })}
            value={post.location}
          />
          <span className="right-0 text-sm opacity-50">
            {post.location.length}/32
          </span>
        </fieldset>
      )}

      <div className="flex gap-4">
        <button
          disabled={isLoading}
          type="button"
          className="flex aspect-square shrink-0 items-center justify-center rounded-full bg-zinc-200 px-2 py-1 text-zinc-800 transition-colors duration-100 hover:bg-zinc-300 focus:bg-zinc-700 dark:bg-zinc-600 dark:text-white dark:hover:bg-zinc-700"
          onClick={onCancel}
        >
          <X size={20} />
          <span className="sr-only">Close</span>
        </button>
        <button
          type="submit"
          className={`relative flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 py-1 text-white transition-colors duration-100 hover:bg-violet-700 focus:bg-violet-700 ${
            isLoading ? "text-transparent" : ""
          }`}
          disabled={
            post.text.length > 300 || post.text.length === 0 || isLoading
          }
        >
          <Edit3 size={20} />
          <span>Post</span>
          {isLoading && (
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform ">
              <Loader className="text-white" size={16} />
            </span>
          )}
        </button>
        <button
          disabled={isImageLoading}
          type="button"
          className="flex aspect-square shrink-0 items-center justify-center rounded-full bg-zinc-200 px-2 py-1 text-zinc-800 transition-colors duration-100 hover:bg-zinc-300 focus:bg-zinc-700 dark:bg-zinc-600 dark:text-white dark:hover:bg-zinc-700"
          onClick={handleImageClick}
        >
          {isImageLoading ? (
            <Loader className="animate-spin" size={20} />
          ) : (
            <Camera size={20} />
          )}
          <span className="sr-only">Add Photo</span>
        </button>
      </div>
      <div className="hidden">
        <input
          accept="image/png, image/jpeg, image/jpg"
          id="post-image"
          name="image"
          onChange={handleFileChange}
          ref={imageRef}
          type="file"
        />
      </div>
    </form>
  );
};

export default PostForm;
