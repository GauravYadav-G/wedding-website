import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const attendanceEnum = pgEnum("attendance", ["yes", "no", "maybe"]);

export const rsvps = pgTable("rsvps", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  mobile: varchar("mobile", { length: 24 }).notNull(),
  attendance: attendanceEnum("attendance").notNull(),
  guests: integer("guests").notNull().default(1),
  message: text("message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const wishes = pgTable("wishes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
