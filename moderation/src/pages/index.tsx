import type { Probability, Result } from "@prisma/client";
import Head from "next/head";
import { useCallback, useEffect, useState } from "react";

const labels: { [key: string]: string } = {
  indentity_attack: "Identity Attack",
  insult: "Insult",
  obscene: "Obscene",
  severe_toxicity: "Severe Toxicity",
  sexual_explicit: "Sexually Explicit",
  threat: "Threat",
  toxicity: "Toxicity"
};

export default function Home() {
  const [history, setHistory] = useState<
    (Result & {
      probabilities: Probability[];
    })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedHistory = localStorage.getItem("history");
      if (storedHistory) setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleSubmit = useCallback(
    async (text: string) => {
      setLoading(true);
      const res = await fetch("/api/classify/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setHistory([data, ...history].slice(0, 10));
          localStorage.setItem(
            "history",
            JSON.stringify([data, ...history].slice(0, 10))
          );
        }
      }
      setLoading(false);
    },
    [history]
  );

  return (
    <>
      <Head>
        <title>Birb Moderation</title>
        <meta
          name="description"
          content="Moderation tool used by Birb - Simple Social"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex flex-col items-center py-4">
        <form
          className="container max-w-xl w-full"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) handleSubmit(text);
          }}
        >
          <fieldset>
            <label
              htmlFor="post-text"
              className="block font-semibold text-center pb-2"
            >
              Enter text below
            </label>
            <div className="flex">
              <input
                type="text"
                id="post-text"
                onChange={(e) => setText(e.target.value)}
                value={text}
                className="rounded-l-md w-full"
              />
              <button
                type="submit"
                className="flex px-4 items-center bg-violet-700 text-white rounded-r-md justify-center w-24"
                disabled={loading}
              >
                {loading ? (
                  <span className="animate-spin">🌟</span>
                ) : (
                  <span>Classify</span>
                )}
              </button>
            </div>
          </fieldset>
        </form>
        <section className="w-full rounded-md py-4 bg-zinc-100 container max-w-xl mt-4 border border-zinc-300 divide-y divide-zinc-300">
          {history.map((result) => (
            <div className="w-full px-4 py-2">
              <p>
                {result.hasMatch ? "❌" : "✅"}&nbsp;
                <span className="font-semibold">{result.text}</span>
              </p>
              <div className="divide-y divide-zinc-300">
                {result.probabilities.map((prob) => (
                  <div className="px-2 py-1 flex items-center gap-2 text-sm">
                    <p
                      className={`w-full ${prob.match ? "font-semibold" : ""}`}
                    >
                      {labels[prob.label]}
                    </p>
                    <p className="font-semibold">
                      {(Number(prob.confidence) * 100.0).toFixed(2)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
