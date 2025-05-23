import {Client} from "pg";


let _client: Client;

export async function connect(database: string, hostname: string, username: string, password: string, port: string): Promise<void> {
    let conString = 'postgresql://';

    if (username) {
        conString += username;
        if (password) {
            conString += ':';
            conString += password;
        }
        conString += '@';
    }

    if (hostname) {
        conString += hostname;
        if (port) {
            conString += ':';
            conString += port;
        }
        conString += '/';
    }

    conString += database;

    _client = new Client(conString)
    await _client.connect()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query(sql: string, params?: any): Promise<any> {
    if (_client === undefined) {
        throw Error("not connected to the database. did you try connect()?");
    }
    return await _client.query(sql, params);
}

export async function end(): Promise<void> {
    if (_client) {
        return await _client.end();
    }
}