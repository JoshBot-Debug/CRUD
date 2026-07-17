import { drizzle } from 'drizzle-orm/node-postgres';
import { prepareRelationships } from './relationships';
import * as schema from "./schema";

prepareRelationships(schema);

const db = drizzle(import.meta.env.VITE_DATABASE_URL, { casing: "camelCase" });

export default db;