import type { ParsedUrlQuery } from "querystring";
import fs from "fs/promises";
import html from "remark-html";
import matter from "gray-matter";
import path from "path";
import { remark } from "remark";

export interface DocsPageProps {
  slug?: string;
  docs: string[];
  data: { createdDate: number; effectiveDate: number };
  content: string;
}

export interface SlugParams extends ParsedUrlQuery {
  slug?: string;
}

export const docsDir = path.join("src", "docs");

export const getDocs = async (folder: string) => {
  const files = (await fs.readdir(path.join(docsDir, folder))) as [
    string,
    ...string[]
  ];
  files.sort();
  return files;
};

export const processMarkdownFile = async (filename: string, folder: string) => {
  const file = await fs.readFile(path.join(docsDir, folder, filename), "utf-8");
  const { content, data } = matter(file);
  const processedContent = await remark().use(html).process(content);
  return {
    content: processedContent.toString(),
    data: {
      createdDate: data.createdDate / 1000,
      effectiveDate: data.effectiveDate / 1000,
    },
  };
};

export const cleanFilename = (filename: string) => filename.replace(".md", "");
