import { type Config, adjectives, colors } from "unique-names-generator";

export const accountHandleRegex = /^@?(\w){1,15}$/;

export const handleConfig: Config = {
  dictionaries: [adjectives, colors],
  separator: "-",
  length: 2,
};
