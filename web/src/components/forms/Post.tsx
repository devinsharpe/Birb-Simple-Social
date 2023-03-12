import React, { useCallback, useMemo, useRef, useState } from "react";
import FeatherIcon from "feather-icons-react";
import { SimplePost } from "../modals/Post";

export const HANDLE_REGEX_GLOBAL = /(^|[^@\w])@(\w{1,24})\b/g;

const PostEditor: React.FC<{
  onChange: (text: string) => void;
  value: string;
}> = ({ onChange, value }) => {
  const [height, setHeight] = useState(64);
  const [html, setHtml] = useState("");
  const postDisplay = useRef<HTMLDivElement | null>(null);

  const handleInput = useCallback((val: string) => {
    onChange(val);
    const handles = val.match(HANDLE_REGEX_GLOBAL);
    let result = val;
    if (result.length > 300) {
      result =
        result.slice(0, 300) +
        `<span class="bg-rose-300/50 dark:bg-rose-800">${result.slice(
          300
        )}</span>`;
    }
    if (handles) {
      handles.forEach((handle) => {
        result = result.replaceAll(
          handle,
          `<span class="text-violet-700 dark:text-violet-400">${handle}</span>`
        );
      });
    }
    setHtml(`<p>${result}</p>`);
  }, []);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height,
      }}
    >
      {value.length === 0 && (
        <p className="pointer-events-none absolute inset-0 z-[1] py-2 px-0 opacity-50">
          What's on your mind?
        </p>
      )}
      <div
        className="absolute inset-0 z-[1] h-fit min-h-[64px] w-full whitespace-pre-wrap break-words py-2"
        id="post-editor"
        dangerouslySetInnerHTML={{ __html: html }}
        ref={postDisplay}
        key="post-editor-field"
      ></div>
      <textarea
        className="absolute inset-0 z-[2] h-full w-full resize-none overflow-hidden border-none bg-transparent py-2 px-0 text-white/0 caret-violet-700 outline-none dark:caret-violet-200"
        onChange={(e) => handleInput(e.target.value)}
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

interface PostFormProps {
  post: SimplePost;
  onCancel: () => void;
  onChange: (post: SimplePost) => void;
  onSubmit: (post: SimplePost) => void;
}

const PostForm: React.FC<PostFormProps> = ({
  post,
  onCancel,
  onChange,
  onSubmit,
}) => {
  const [showLocationInput, setShowLocationInput] = useState(false);
  return (
    <form
      className="relative space-y-4 px-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(post);
      }}
    >
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
          className="rounded-md p-1"
          onClick={() => setShowLocationInput(!showLocationInput)}
        >
          {showLocationInput ? (
            <FeatherIcon icon="x" size={16} />
          ) : (
            <FeatherIcon icon="map-pin" size={16} />
          )}
        </button>
      </div>

      {showLocationInput && (
        <fieldset
          className={`relative flex items-center border-t border-zinc-300 pt-2 dark:border-zinc-600 ${
            post.location.length > 32 ? "text-rose-600" : ""
          }`}
        >
          <FeatherIcon
            icon="map-pin"
            size={16}
            className="absolute left-0 opacity-50"
          />
          <input
            type="text"
            className="w-full rounded border-none bg-transparent pl-8 outline-none focus:ring-0"
            placeholder="Location"
            onChange={(e) => onChange({ ...post, location: e.target.value })}
            value={post.location}
          />
          <span className="right-0 text-sm opacity-75">
            {post.location.length}/32
          </span>
        </fieldset>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          className="flex aspect-square shrink-0 items-center justify-center rounded-full bg-zinc-200 py-1 px-2 text-zinc-800 transition-colors duration-100 hover:bg-zinc-300 focus:bg-zinc-700 dark:bg-zinc-600 dark:text-white dark:hover:bg-zinc-700"
          onClick={onCancel}
        >
          <FeatherIcon icon="x" size={20} />
          <span className="sr-only">Close</span>
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 py-1 text-white transition-colors duration-100 hover:bg-violet-700 focus:bg-violet-700"
          disabled={post.text.length > 300 || post.text.length === 0}
        >
          <FeatherIcon icon="edit-3" size={20} />
          <span>Post</span>
        </button>
      </div>
    </form>
  );
};

export default PostForm;
