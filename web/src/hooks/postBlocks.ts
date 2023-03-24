import { useMemo } from "react";
import { HANDLE_REGEX_GLOBAL, LINK_REGEX } from "../components/forms/Post";

export interface PostBlock {
  type: "TEXT" | "HANDLE" | "LINK";
  overflowIndex: number;
  value: string;
}

const assignIndexes = (array1: string[], array2: string[], value: string) => {
  array1.forEach((val) => {
    let index = value.indexOf(val, 0);
    while (index !== -1) {
      if (!array2[index]) array2[index] = val;
      index = value.indexOf(val, index + val.length);
    }
  });
};

const usePostBlocks = (value: string) => {
  const blocks = useMemo(() => {
    const result: PostBlock[] = [];
    const handles = [...new Set(value.match(HANDLE_REGEX_GLOBAL))];
    const links = [...new Set(value.match(LINK_REGEX))];
    const indexes: string[] = [];

    handles.sort((a, b) => b.length - a.length);
    links.sort((a, b) => b.length - a.length);

    if (handles) assignIndexes(handles, indexes, value);
    if (links) assignIndexes(links, indexes, value);

    if (indexes.length) {
      let index = 0;
      Object.entries(indexes).forEach(([idx, blockValue]) => {
        if (blockValue) {
          const val = value.slice(index, parseInt(idx, 10));
          result.push({
            type: "TEXT",
            overflowIndex: index + val.length > 300 ? 300 - index : -1,
            value: val,
          });
          result.push({
            type: blockValue.match(HANDLE_REGEX_GLOBAL) ? "HANDLE" : "LINK",
            overflowIndex:
              parseInt(idx, 10) + blockValue.length > 300
                ? 300 - parseInt(idx, 10)
                : -1,
            value: blockValue,
          });

          index = parseInt(idx, 10) + blockValue.length;
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
