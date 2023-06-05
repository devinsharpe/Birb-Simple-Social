import chalk from "chalk";
import type { Logger } from "drizzle-orm";

const logger: Logger = {
  logQuery: function (query, params) {
    console.log(
      `${chalk.bgGreen("        Query             \n")}${query
        .replace(/\s+/g, " ")
        .trim()}`
    );
    if (params.length) {
      const formattedParams = params.map(
        (param, index) =>
          `${index.toString().padStart(3, " ")} | ${param as string}`
      );
      console.log(
        `${chalk.bgGray("        Params            \n")}${formattedParams.join(
          "\n"
        )}`
      );
    }
  },
};

export default logger;
