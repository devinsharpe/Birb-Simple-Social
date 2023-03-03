import "@tensorflow/tfjs";
import * as toxicity from "@tensorflow-models/toxicity";
import { env } from "../env/server.mjs";

const txjs = async () => {
  const model = await toxicity.load(env.TOXICITY_THRESHOLD * 0.1, [
    "insult",
    "obscene",
    "severe_toxicity",
    "sexual_explicit",
    "threat",
    "toxicity"
  ]);
  return model;
};

export default txjs();
