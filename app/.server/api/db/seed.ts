import dotenv from "dotenv";
import { Command } from "commander";

import { seed } from "drizzle-seed";
import { users, usersRoles } from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";
import * as o from 'drizzle-orm';
import hash from "../hash";
import { getFields } from "~/.server/select";
import { prepareRelationships } from "./relationships";
import * as schema from "./schema";

const env = process.env as any;

dotenv.config({ path: `.env.${env.NODE_ENV || "development"}` });

prepareRelationships(schema);

const db = drizzle(env.VITE_DATABASE_URL!, { casing: "camelCase" });

const modes = {
  fake: async () => {
    await seed(db, { users }, { count: 100 });
  },
  init: async () => {
    const administrator = await db.select().from(users).where(o.eq(users.email, env.ADMINISTRATOR_EMAIL));
    if (administrator.length) return;
    await db
      .insert(users)
      .values({
        firstName: env.ADMINISTRATOR_FIRST_NAME,
        middleName: env.ADMINISTRATOR_MIDDLE_NAME,
        lastName: env.ADMINISTRATOR_LAST_NAME,
        country: env.ADMINISTRATOR_COUNTRY,
        phone: env.ADMINISTRATOR_PHONE_NUMBER,
        email: env.ADMINISTRATOR_EMAIL,
        password: await hash.hash(env.ADMINISTRATOR_PASSWORD),
      })
  }
}

async function runTest() {
  const { fields, joins } = getFields(usersRoles, { usersId: {}, rolesId: {} })

  const query = db.select(fields).from(usersRoles)

  for (const join of joins)
    query.leftJoin(join.table, join.condition)

  const result = await query;

  console.log(result[0])
}

const program = new Command();

program
  .command("seed")
  .description("Server seed")
  .option("-m, --mode <mode>", `Seed mode to execute: ${Object.keys(modes).join(", ")}`)
  .action(async options => {
    if (!options.mode) return;
    (modes as any)[options.mode]()
  });

program
  .command("test")
  .description("Run development test code")
  .action(async () => {
    await runTest();
  });


program.parse();