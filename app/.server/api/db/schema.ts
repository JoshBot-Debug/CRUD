import { sql } from "drizzle-orm";
import * as d from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: d.timestamp().defaultNow().notNull(),
  updatedAt: d.timestamp().defaultNow().notNull(),
  deletedAt: d.timestamp(),
}

export const users = d.pgTable('users', {
  id: d.uuid().default(sql`gen_random_uuid()`).primaryKey(),
  firstName: d.varchar({ length: 100 }).notNull(),
  middleName: d.varchar({ length: 100 }).notNull(),
  lastName: d.varchar({ length: 100 }).notNull(),
  email: d.varchar({ length: 100 }).unique().notNull(),
  phone: d.varchar({ length: 10 }).unique().notNull(),
  country: d.varchar({ length: 50 }).notNull(),
  password: d.varchar({ length: 255 }).notNull(),
  ...timestamps
});

export const roles = d.pgTable('roles', {
  id: d.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: d.varchar("name", { length: 100 }).notNull(),
  description: d.varchar("description", { length: 255 }),
  createdById: d.uuid("createdById").references(() => users.id, { onDelete: "cascade" }),
  ...timestamps
}, (table) => [
  d.uniqueIndex("roles_name_unique_not_deleted")
    .on(table.name)
    .where(sql`${table.deletedAt} IS NULL`)
]);

export const permissions = d.pgTable('permissions', {
  id: d.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: d.varchar("name", { length: 100 }).notNull(),
  description: d.varchar("description", { length: 255 }),
  createdById: d.uuid("createdById").references(() => users.id, { onDelete: "cascade" }),
  ...timestamps
}, (table) => [
  d.uniqueIndex("permissions_name_unique_not_deleted")
    .on(table.name)
    .where(sql`${table.deletedAt} IS NULL`)
]);

export const rolesPermissions = d.pgTable('rolesPermissions', {
  id: d.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  rolesId: d.integer("rolesId").notNull().references(() => roles.id, { onDelete: "cascade" }),
  permissionsId: d.integer("permissionsId").notNull().references(() => permissions.id, { onDelete: "cascade" }),
  createdById: d.uuid("createdById").references(() => users.id, { onDelete: "cascade" }),
  ...timestamps
}, (table) => [
  d.uniqueIndex("roles_permissions_unique_not_deleted")
    .on(table.rolesId, table.permissionsId)
    .where(sql`${table.deletedAt} IS NULL`)
]);

export const usersRoles = d.pgTable('usersRoles', {
  id: d.integer("id").primaryKey().generatedAlwaysAsIdentity(),
  usersId: d.uuid("usersId").notNull().references(() => users.id, { onDelete: "cascade" }),
  rolesId: d.integer("rolesId").notNull().references(() => roles.id, { onDelete: "cascade" }),
  createdById: d.uuid("createdById").references(() => users.id, { onDelete: "cascade" }),
  ...timestamps
}, (table) => [
  d.uniqueIndex("users_roles_unique_not_deleted")
    .on(table.usersId, table.rolesId)
    .where(sql`${table.deletedAt} IS NULL`)
]);