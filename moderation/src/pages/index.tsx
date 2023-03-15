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
      <main className="flex flex-col items-center w-full py-4">
        <form
          className="container w-full max-w-xl"
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading) handleSubmit(text);
          }}
        >
          <fieldset>
            <label
              htmlFor="post-text"
              className="block pb-2 font-semibold text-center"
            >
              Enter text below
            </label>
            <div className="flex">
              <input
                type="text"
                id="post-text"
                onChange={(e) => setText(e.target.value)}
                value={text}
                className="w-full rounded-l-md"
              />
              <button
                type="submit"
                className="flex items-center justify-center w-24 px-4 text-white bg-violet-700 rounded-r-md"
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
        <section className="container w-full max-w-xl py-4 mt-4 border divide-y rounded-md bg-zinc-100 border-zinc-300 divide-zinc-300">
          {history.map((result) => (
            <div className="w-full px-4 py-2" key={result.id}>
              <p>
                {result.hasMatch ? "❌" : "✅"}&nbsp;
                <span className="font-semibold">{result.text}</span>
              </p>
              <div className="divide-y divide-zinc-300">
                {result.probabilities.map((prob) => (
                  <div
                    className="flex items-center gap-2 px-2 py-1 text-sm"
                    key={prob.id}
                  >
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
