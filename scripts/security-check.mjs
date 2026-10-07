import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const forbidden = ["peiidzttvbo" + "migpqsybm", "sod-operativo" + ".vercel.app", "1XkCjtyQ_AO_" + "rdbSXdeaBCwTzCXqypecpcjWiE-TvlUg"];
const sourceExt = new Set([".ts",".tsx",".js",".mjs",".sql",".md",".json",".toml"]);
const skip = new Set(["node_modules",".next",".git",".bootstrap"]);
const hits = [];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){if(skip.has(entry.name))continue;const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(sourceExt.has(path.extname(entry.name))){const text=fs.readFileSync(full,"utf8");for(const needle of forbidden)if(text.includes(needle))hits.push(`${path.relative(root,full)} contains forbidden production reference`);}}}
walk(root);
const rls=fs.readFileSync(path.join(root,"supabase/migrations/20261007000200_rls.sql"),"utf8");
for(const table of ["tickets","subtasks","decisions","evidence","inbox_messages","audit_events"]){if(!rls.includes(`'${table}'`) && !rls.includes(`public.${table}`))hits.push(`RLS missing for ${table}`)}
if(hits.length){console.error(hits.join("\n"));process.exit(1)}
console.log("security-check: ok");
