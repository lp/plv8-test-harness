#!/usr/bin/env -S npx bun

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {glob} from 'glob';

import { query, connect, end } from "../lib/database";
import { loader, runner } from "../lib/runtime";
import { report }  from "../lib/report";

const argv = await yargs()
  .scriptName("harness")
  .usage('$0 <cmd> [args]')
  .option('f', {
    alias: 'files',
    describe: 'Files to load and execute',
    array: true,
    demandOption: true,
  })
  .help()
  .parse(hideBin(process.argv))

const host = process.env.PGHOST || "127.0.0.1";
const port = process.env.PGPORT || "5432";
const user = process.env.PGUSER || "postgres";
const password = process.env.PGPASSWORD || "postgres";
const database = process.env.PGDATABASE || "postgres";

await connect(database, host, user, password, port);
await query('CREATE SCHEMA IF NOT EXISTS harness');

const files = argv.files as string[];
const results = { };
for (const file of files) {
    const globPath = `${process.cwd()}/${file}`;
    const filePaths = await glob(globPath);
    for (const filePath of filePaths) {
        await loader(filePath);
        const result = await runner(filePath);
        results[filePath] = result;
    }
}

await query("DROP SCHEMA harness CASCADE");
await end();

report(results);