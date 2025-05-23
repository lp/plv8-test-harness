import { makeFuncname } from "../lib/runtime";

test('makeFuncname() creates the correct function names', function (done) {
  const funcname = makeFuncname('foo.js');
  expect(funcname).toBe('foo_js');

  const funcname2 = makeFuncname('foo/bar.js');
  expect(funcname2).toBe('foo_bar_js');
  done();
});