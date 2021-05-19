import { Options } from "@mikro-orm/core";
import * as path from "path";

export default {
  migrations: {
    path: path.join(__dirname, "migrations"),
    tableName: "migrations",
    transactional: true,
    pattern: /^[\w-]+\d+\.(ts|js)$/,
    disableForeignKeys: false,
    emit: "js",
  },
  user: "root",
  password: "root",
  dbName: "mikro-orm-contructor-assign-issue",
  host: "localhost",
  port: 5432,
  entities: [path.join(__dirname, "**", "*.entity.js")],
  entitiesTs: [path.join(__dirname, "**", "*.entity.ts")],
  type: "postgresql",
} as Options;
