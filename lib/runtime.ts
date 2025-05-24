import {readFile} from 'fs/promises';
import {readFileSync} from 'fs';

import { query } from './database';

const setup = readFileSync(__dirname + '/../stubs/setup.js', 'utf8');
const run = readFileSync(__dirname + '/../stubs/run.js', 'utf8');
const teardown = readFileSync(__dirname + '/../stubs/teardown.js', 'utf8');

export function makeFuncname (filename) {
  let funcname = filename.replace(/\//g, "_");
  funcname = funcname.replace(/\./g, "_");
  funcname = funcname.replace(/\\/g, "_");

  return funcname;
}

async function makePLV8Function(filePath: string, content: string): Promise<void> {
    const filename = filePath.split('/').pop()!;
    const funcname = makeFuncname(filename);
    let sql = `CREATE OR REPLACE FUNCTION harness.${funcname}( ) RETURNS JSON AS $$\n`;

    sql += setup;
    sql += content;
    sql += "\n";
    sql += "var __filename = \"" + filename + "\";\n";
    sql += run;
    sql += teardown;

    sql += "\n$$ LANGUAGE plv8";

    return await query(sql);
}


async function readTestFile(filename: string): Promise<string> {
    try {
        const sql = await readFile(filename, 'utf8'); 
        return sql;
    } catch (error) {
        console.error("Un able to read file: ", error);
        throw Error("Unable to read file " + filename);
    }
}

export async function loader(filePath: string): Promise<void> {
    console.log("Loading test file: ", filePath);
    const sql = await readTestFile(filePath);
    await makePLV8Function(filePath, sql);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runner(filePath: string): Promise<any> {
    console.log("Running test file: ", filePath);
    const filename = filePath.split('/').pop()!;
    const funcname = makeFuncname(filename);

    await query("BEGIN");
    const sql = `SELECT harness.${funcname}() AS result`;
    const data = await query(sql);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;
    if (data.rowCount === 1) {
        result = data.rows[0].result;
    } else {
        result = { "error": "Expected one row returned, got " + data.rowsCount };
    }

    await query("ROLLBACK");
    return result;
}