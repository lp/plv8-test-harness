import color from "ansi-color";

let out = '';
let failures: any[] = [];

export function transform(results) {
  const testResults = { };

  const keys = Object.keys(results);

  for (const key of keys) {
    if (testResults[key] === undefined) {
      testResults[key] = { };
    }


    for (const result of results[key]) {
      if (testResults[key][result.current_test] === undefined) {
        testResults[key][result.current_test] = [ ];
      }

      testResults[key][result.current_test].push(result);
    }
  }

  return testResults;
}

export function allPassed(results, current_test) {
  const filtered = results.filter((item) => item.current_test === current_test);
  const actual = filtered.filter((item) => item.status === 'pass');
  
  return actual.length === filtered.length;
}

export function allFailed(results) {
  return results.filter((item) => item.status != 'pass');
}

function dotReporter(results: any, testname: string) {
    const passed = allPassed(results, testname);

    if (passed) {
        out += color.set('.', "green");
    } else {
        out += color.set('✗', "red");
    }
}

function fail(results: any) {
    const failed = allFailed(results);
    failures = failures.concat(failed);
}

function failureReporter( ) {
    for (let i = 0; i < failures.length; i++) {
        let line = '\n' + failures[i].filename + ' : ' + failures[i].current_test + "\n";

        line += ("    " + failures[i].message + "\n    expected " +
            failures[i].expected + ", got " + failures[i].actual +
            " (" + failures[i].operator + ")\n");

        console.log(color.set(line, 'red'));
    }
}

export function report(results: any) {
    const testResults = transform(results);

    const keys = Object.keys(testResults);

    for (let i = 0; i < keys.length; i++) {
        const innerKeys = Object.keys(testResults[keys[i]]);

        for (let j = 0; j < innerKeys.length; j++) {
            dotReporter(testResults[keys[i]][innerKeys[j]], innerKeys[j]);
            fail(testResults[keys[i]][innerKeys[j]]);
        }
    }

    console.log(out);

    failureReporter( );
}