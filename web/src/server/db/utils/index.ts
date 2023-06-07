// import { init } from "@paralleldrive/cuid2";

// export const createId = init({ length: 25 });

import { nanoid } from "nanoid";

export const createId = () => nanoid(25);
