# plv8-test-harness

Running `plv8` tests within PostgreSQL.

## Configuration

Create a `.env` file in the root of the project with the database connection context (replacing the values with your own):

```
PGHOST=127.0.0.1
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=postgres
```

## Usage

```
npx harness -f plv8-test-examples/*.js
```

### Credits
This project is based on the [equinox](https://github.com/JerrySievert/equinox) project by [Jerry Sievert](https://github.com/JerrySievert).
Some portions of the original code in `equinox`, mainly the runner _stubs_, were reused under the MIT license.