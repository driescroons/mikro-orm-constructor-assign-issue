import { Options } from "@mikro-orm/core";
import * as path from "path";

const config = {
  user: "root",
  password: "root",
  dbName: "mikro-orm-contructor-assign-issue",
  host: "localhost",
  port: 5432,
  type: "postgresql",
} as Options;

export default config;

export const ormConfigFactory = (entities: any[]) => {
  return { ...config, entities } as Options;
};
