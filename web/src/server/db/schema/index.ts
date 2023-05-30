import authSchema from "./auth";
import appSchema from "./app";

const schema = { ...authSchema, ...appSchema };

export default schema;
