import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("sidebar order keeps tickets and departments between reminders and inbox",()=>{const text=fs.readFileSync("components/os-shell.tsx","utf8");const reminders=text.indexOf("Recordatorios"),tickets=text.indexOf("Tickets"),departments=text.indexOf("Departamentos"),inbox=text.indexOf("Inbox");assert.ok(reminders<tickets&&tickets<departments&&departments<inbox)});
test("ticket responsible dropdown uses active profiles",()=>{const text=fs.readFileSync("components/tickets-board.tsx","utf8");assert.match(text,/state\.profiles\.filter\(p => p\.active\)/)});
test("closure requires evidence in demo store",()=>{const text=fs.readFileSync("components/demo-store.tsx","utf8");assert.match(text,/requireClosureEvidence/);assert.match(text,/Necesitás evidencia/)});
test("undo defaults to ten seconds",()=>{const text=fs.readFileSync("lib/demo-data.ts","utf8");assert.match(text,/undoSeconds: 10/)});
test("core migration includes tenant-owned work tables",()=>{const sql=fs.readFileSync("supabase/migrations/20261007000100_core.sql","utf8");for(const table of ["organizations","memberships","departments","tickets","subtasks","decisions","evidence","inbox_messages","audit_events"])assert.ok(sql.includes(`public.${table}`),table)});
