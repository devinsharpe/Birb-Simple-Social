import { useMemo } from "react";
import { HANDLE_REGEX_GLOBAL } from "../components/forms/Post";

export interface PostBlock {
  type: "TEXT" | "HANDLE" | "LINK";
  overflowIndex: number;
  value: string;
}

const usePostBlocks = (value: string) => {
  const blocks = useMemo(() => {
    const result: PostBlock[] = [];
    const handles = [...new Set(value.match(HANDLE_REGEX_GLOBAL))];
    const handleIndexes: string[] = [];
    handles.sort((a, b) => b.length - a.length);
    if (handles) {
      handles.forEach((handle) => {
        let index = value.indexOf(handle, 0);
        while (index !== -1) {
          if (!handleIndexes[index]) handleIndexes[index] = handle;
          index = value.indexOf(handle, index + handle.length);
        }
      });
    }
    if (handleIndexes.length) {
      let index = 0;
      Object.entries(handleIndexes).forEach(([idx, handle]) => {
        if (handle) {
          const val = value.slice(index, parseInt(idx, 10));
          result.push({
            type: "TEXT",
            overflowIndex: index + val.length > 300 ? 300 - index : -1,
            value: val,
          });
          result.push({
            type: "HANDLE",
            overflowIndex:
              parseInt(idx, 10) + handle.length > 300
                ? 300 - parseInt(idx, 10)
                : -1,
            value: handle,
          });
          index = parseInt(idx, 10) + handle.length;
        }
      });
      const val = value.slice(index);
      result.push({
        type: "TEXT",
        overflowIndex: index + val.length > 300 ? 300 - index - val.length : -1,
        value: val,
      });
    } else {
      result.push({
        type: "TEXT",
        overflowIndex: value.length > 300 ? 300 : -1,
        value,
      });
    }
    return result;
  }, [value]);
  return { blocks };
};

export default usePostBlocks;
