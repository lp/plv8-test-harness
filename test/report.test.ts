import { allFailed, allPassed } from "../lib/report";

const failing = [ { actual: 1,
    expected: 1,
    status: 'pass',
    message: 'length should be 1',
    current_test: 'should equal 1' },
  { actual: 2,
    expected: 1,
    message: 'num should equal 1',
    operator: '==',
    status: 'fail',
    current_test: 'should equal 1' } ];

const passing = [ { actual: 1,
    expected: 1,
    status: 'pass',
    message: 'length should be 1',
    current_test: 'should equal 1' },
  { actual: 1,
    expected: 1,
    message: 'num should equal 1',
    operator: '==',
    status: 'pass',
    current_test: 'should equal 1' } ];

test('all_passed() passes when correct', function (done) {
  const status = allPassed(passing, 'should equal 1');
  expect(status).toBe(true);
  done();
});

test('all_passed() fails when not correct', function (done) {
  const status = allPassed(failing, 'should equal 1');
  expect(status).toBe(false);
  done();
});

test('all_failed() returns the correct failed entries', function (done) {
  const failed = allFailed(failing);
  expect(failed.length).toBe(1);
  done();
});