import * as dotenv from "dotenv";
import { cleanEnv, port, str } from "envalid";

dotenv.config();

const env = cleanEnv(process.env, {
  ENV: str({ choices: ["local", "production"], default: "local" }),
  PORT: port({ default: 8000 }),
  USER_JWT_SECRET_KEY: str({
    default:
      "eyJhbGciOiJIUzI1NiJ9.ghuJSb2xlI6f7dfb8uiwuu7fguoPQW4iLCJlbWFpbCI6ImFkbWluQGsdfghjkGYgUG.xCyQt3wQXRj8NojG-m2GktX90VBxU15BoxLuTS8",
  }),
  ADMIN_JWT_SECRET_KEY: str({
    default:
      "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQioPQW4iLChfvdfvdflbWFpbCI6ImFkbWluQGVtYyuYUGYgUG.xCyQt3wQXRj8NojG-m26LS9GktX90VBxU15BoxLuTS8",
  }),
  JWT_EXPIRES: str({ default: "7 days" }),
  ADMIN_EMAIL: str({ default: "admin@ecommerce.com" }),
  ADMIN_PASSWORD: str({ default: "admin" }),
});

export default env;
