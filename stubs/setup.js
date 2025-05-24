// test statuses stored here
var test_statuses = [ ];
var current_test;

// assertion failure
function fail (actual, expected, message, operator, error) {
  test_statuses.push({
    actual:       actual,
    expected:     expected,
    message:      message,
    operator:     operator,
    status:       "fail",
    error:        error,
    current_test: current_test,
    filename:     __filename
  });
}

// assertion ok
function ok (actual, expected, message) {
  test_statuses.push({
    actual:       actual,
    expected:     expected,
    status:       "pass",
    message:      message,
    current_test: current_test,
    filename:     __filename
  });
}

// assert methods
var assert = {
  equal: function (actual, expected, message) {
    if (actual !== expected) {
      fail(actual, expected, message, "==");
    } else {
      ok(actual, expected, message);
    }
  }
};

// initial setup
var tests = [ ];

// harness namespace
harness = {
  log: function ( ) {
    var args = Array.prototype.slice.call(arguments);
    plv8.elog(NOTICE, args.join(' '));
  },
  debug: function ( ) {
    var args = Array.prototype.slice.call(arguments);
    plv8.elog(DEBUG1, args.join(' '));
  },
  info: function ( ) {
    var args = Array.prototype.slice.call(arguments);
    plv8.elog(INFO, args.join(' '));
  },
  warn: function ( ) {
    var args = Array.prototype.slice.call(arguments);
    plv8.elog(WARNING, args.join(' '));
  },
  error: function ( ) {
    var args = Array.prototype.slice.call(arguments);
    plv8.elog(ERROR, args.join(' '));
  }
};

console = {
  log: function ( ) {
    harness.log.call(arguments);
  },
  debug: function ( ) {
    harness.debug.call(arguments);
  },
  info: function ( ) {
    harness.info.call(arguments);
  },
  warn: function ( ) {
    harness.warn.call(arguments);
  },
  error: function ( ) {
    harness.error.call(arguments);
  }
};

// check for setup method
if (typeof test_setup === 'function') {
  test_setup();
}
