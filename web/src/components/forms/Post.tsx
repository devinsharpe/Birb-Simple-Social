import React, { useCallback, useState } from "react";
import FeatherIcon from "feather-icons-react";
import Text from "../inputs/Text";

const PostEditor: React.FC = () => {
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");

  const formatHTML = useCallback((val: string) => {
    const handles = val
      .split(/[\s\n\t]/)
      .filter((sub) => sub.split("")[0] === " @");
    const result = val;
    handles.forEach((handle) => {
      result.replace(
        handle,
        `<span class="text-violet-700 dark:text-violet-300">${handle.trim()}</span>`
      );
    });
    return result;
  }, []);

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setHtml(formatHTML(target.innerHTML));
    setText(target.innerText);

    const selection = window.getSelection();
    const fn = function (this: {
      el: HTMLDivElement;
      sel: Selection | null;
      prevText: string;
    }) {
      console.log(this);
      console.log(this.prevText, text);
      if (!this.sel) return;
      const selRange = this.sel.getRangeAt(0);
      const newRange = selRange.cloneRange();
      newRange.setStart(
        this.el,
        selRange.startOffset + (this.prevText.length - text.length)
      );
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(newRange);
    };

    const next = fn.bind({ el: target, sel: selection, prevText: text });
    requestAnimationFrame(next);
  }, []);

  return (
    <div className="relative h-32">
      <p className="pointer-events-none absolute inset-0 z-[1] hidden p-2 opacity-50">
        What's on your mind?
      </p>
      <div
        className="absolute inset-0 z-[2]"
        id="post-editor"
        dangerouslySetInnerHTML={{ __html: html }}
        onInput={handleInput}
        contentEditable
        key="post-editor-field"
      ></div>
    </div>
  );
};

interface SimplePost {
  text: string;
  location: string;
}

interface PostFormProps {
  post: SimplePost;
  onChange: (post: SimplePost) => void;
  onSubmit: (post: SimplePost) => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onChange, onSubmit }) => {
  const [showLocationInput, setShowLocationInput] = useState(false);
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(post);
      }}
    >
      <PostEditor />

      <div className="flex items-center gap-4 border-t border-zinc-200 pt-4 dark:border-zinc-700">
        {showLocationInput ? (
          <>
            <Text
              fieldsetClassName="w-full"
              icon="map-pin"
              id="post-location"
              label="Location"
              maxLength={32}
              name="location"
              onChange={(val) => onChange({ ...post, location: val })}
              value={post.text}
            />
            <button
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-600"
            >
              <FeatherIcon icon="x" size={16} />
            </button>
          </>
        ) : (
          <button
            className="rounded-md p-1"
            onClick={() => setShowLocationInput(true)}
          >
            <FeatherIcon icon="map-pin" size={16} />
          </button>
        )}
      </div>
    </form>
  );
};

export default PostForm;
