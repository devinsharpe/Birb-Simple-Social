import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface DocsNavProps {
  current?: string;
  docs: string[];
  onDocSelect: (doc: string) => void;
}

const DocsNav: React.FC<DocsNavProps> = ({ current, docs, onDocSelect }) => {
  return (
    <nav className="fixed inset-x-0 top-0 bg-zinc-200/50 px-8 py-4 backdrop-blur-md dark:bg-zinc-800/50">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Image src="/icons/icon.svg" width={48} height={48} alt="Birb Logo" />
        </Link>
        <select
          name="terms-archive-select"
          id="terms-archive-select"
          onChange={(e) => onDocSelect(e.target.value)}
          value={current}
          className="w-48 rounded-md text-sm dark:border-zinc-600 dark:bg-zinc-700"
        >
          {docs.map((doc) => (
            <option value={doc} key={doc}>
              {new Date(doc + "T00:00:00").toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
};

export default DocsNav;
