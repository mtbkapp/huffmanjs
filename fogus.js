//Copied from https://github.com/funjs/book-source


// Chapter 1
function splat(fun) {
  return function(array) {
    return fun.apply(null, array);
  };
}

var addArrayElements = splat(function(x, y) { return x + y });

addArrayElements([1, 2]);
//=> 3

function unsplat(fun) {
  return function() {
    return fun.call(null, _.toArray(arguments));
  };
}

var joinElements = unsplat(function(array) { return array.join(' ') });

function parseAge(age) {
  if (!_.isString(age)) throw new Error("Expecting a string");
  var a;

  console.log("Attempting to parse an age");

  a = parseInt(age, 10);

  if (_.isNaN(a)) {
    console.log(["Could not parse age:", age].join(' '));
    a = 0;
  }

  return a;
}

function fail(thing) {
  throw new Error(thing);
}

function warn(thing) {
  console.log(["WARNING:", thing].join(' '));
}

function note(thing) {
  console.log(["NOTE:", thing].join(' '));
}

function parseAge(age) {
  if (!_.isString(age)) fail("Expecting a string");
  var a;

  note("Attempting to parse an age");
  a = parseInt(age, 10);

  if (_.isNaN(a)) {
    warn(["Could not parse age:", age].join(' '));
    a = 0;
  }

  return a;
}

function naiveNth(a, index) {
  return a[index];
}

function isIndexed(data) {
  return _.isArray(data) || _.isString(data);
}

function nth(a, index) {
  if (!_.isNumber(index)) fail("Expected a number as the index");
  if (!isIndexed(a)) fail("Not supported on non-indexed type");
  if ((index < 0) || (index > a.length - 1))
    fail("Index value is out of bounds");

  return a[index];
}

function second(a) {
  return nth(a, 1);
}

function compareLessThanOrEqual(x, y) {
  if (x < y) return -1;
  if (y < x) return  1;
  return 0;
}

function lessOrEqual(x, y) {
  return x <= y;
}

function comparator(pred) {
  return function(x, y) {
    if (truthy(pred(x, y)))
      return -1;
    else if (truthy(pred(y, x)))
      return 1;
    else
      return 0;
  };
};

function lameCSV(str) {
  return _.reduce(str.split("\n"), function(table, row) {
    table.push(_.map(row.split(","), function(c) { return c.trim()}));
    return table;
  }, []);
};

function selectNames(table) {
  return _.rest(_.map(table, _.first));
}

function selectAges(table) {
  return _.rest(_.map(table, second));
}

function selectHairColor(table) {
  return _.rest(_.map(table, function(row) {
    return nth(row, 2);
  }));
}

var mergeResults = _.zip;

function existy(x) { return x != null };

function truthy(x) { return (x !== false) && existy(x) };

function doWhen(cond, action) {
  if(truthy(cond))
    return action();
  else
    return undefined;
}

function executeIfHasField(target, name) {
  return doWhen(existy(target[name]), function() {
    var result = _.result(target, name);
    console.log(['The result is', result].join(' '));
    return result;
  });
}


// Chapter 2

function lyricSegment(n) {
  return _.chain([])
    .push(n + " bottles of beer on the wall")
    .push(n + " bottles of beer")
    .push("Take one down, pass it around")
    .tap(function(lyrics) {
           if (n > 1)
             lyrics.push((n - 1) + " bottles of beer on the wall.");
           else
             lyrics.push("No more bottles of beer on the wall!");
         })
    .value();
}

function song(start, end, lyricGen) {
  return _.reduce(_.range(start,end,-1),
    function(acc,n) {
      return acc.concat(lyricGen(n));
    }, []);
}

function doubleAll(array) {
  return _.map(array, function(n) { return n*2 });
}

function average(array) {
  var sum = _.reduce(array, function(a, b) { return a+b });
  return sum / _.size(array);
}

/* grab only even numbers in nums */
function onlyEven(array) {
  return _.filter(array, function(n) {
    return (n%2) === 0;
  });
}

function allOf(/* funs */) {
  return _.reduceRight(arguments, function(truth, f) {
    return truth && f();
  }, true);
}

function anyOf(/* funs */) {
  return _.reduceRight(arguments, function(truth, f) {
    return truth || f();
  }, false);
}

function complement(pred) {
  return function() {
    return !pred.apply(null, _.toArray(arguments));
  };
}

function cat() {
  var head = _.first(arguments);
  if (existy(head))
    return head.concat.apply(head, _.rest(arguments));
  else
    return [];
}

function construct(head, tail) {
  return cat([head], _.toArray(tail));
}

function mapcat(fun, coll) {
  return cat.apply(null, _.map(coll, fun));
}

function butLast(coll) {
  return _.toArray(coll).slice(0, -1);
}

function interpose (inter, coll) {
  return butLast(mapcat(function(e) {
    return construct(e, [inter]);
  },
  coll));
}

function project(table, keys) {
  return _.map(table, function(obj) {
    return _.pick.apply(null, construct(obj, keys));
  });
};

function rename(obj, newNames) {
  return _.reduce(newNames, function(o, nu, old) {
    if (_.has(obj, old)) {
      o[nu] = obj[old];
      return o;
    }
    else
      return o;
  },
  _.omit.apply(null, construct(obj, _.keys(newNames))));
};

function as(table, newNames) {
  return _.map(table, function(obj) {
    return rename(obj, newNames);
  });
};

function restrict(table, pred) {
  return _.reduce(table, function(newTable, obj) {
    if (truthy(pred(obj)))
      return newTable;
    else
      return _.without(newTable, obj);
  }, table);
};

// Chapter 3
function makeEmptyObject() {
  return new Object();
}

function strangeIdentity(n) {
  // intentionally strange
  for(var i=0; i<n; i++);
  return i;
}

function strangeIdentity(n) {
  var i;
  for(i=0; i<n; i++);
  return i;
}

function strangerIdentity(n) {
  // intentionally stranger still
  for(this['i'] = 0; this['i']<n; this['i']++);
  return this['i'];
}

function createScaleFunction(FACTOR) {
  return function(v) {
    return _.map(v, function(n) {
      return (n * FACTOR);
    });
  };
}

var scale10 = createScaleFunction(10);

function createWeirdScaleFunction(FACTOR) {
  return function(v) {
    this['FACTOR'] = FACTOR;
    var captures = this;

    return _.map(v, _.bind(function(n) {
      return (n * this['FACTOR']);
    }, captures));
  };
}

var scale10 = createWeirdScaleFunction(10);

function makeAdder(CAPTURED) {
  return function(free) {
    return free + CAPTURED;
  };
}

var add10 = makeAdder(10);

function averageDamp(FUN) {
  return function(n) {
    return average([n, FUN(n)]);
  }
}

var averageSq = averageDamp(function(n) { return n * n });

function complement(PRED) {
  return function() {
    return !PRED.apply(null, _.toArray(arguments));
  };
}

function isEven(n) { return (n%2) === 0 }

var isOdd = complement(isEven);

function plucker(FIELD) {
  return function(obj) {
    return (obj && obj[FIELD]);
  };
}

// Chapter 4
function finder(valueFun, bestFun, coll) {
  return _.reduce(coll, function(best, current) {
    var bestValue = valueFun(best);
    var currentValue = valueFun(current);

    return (bestValue === bestFun(bestValue, currentValue)) ? best : current;
  });
}

function best(fun, coll) {
  return _.reduce(coll, function(x, y) {
    return fun(x, y) ? x : y;
  });
}

function repeat(times, VALUE) {
  return _.map(_.range(times), function() { return VALUE; });
}

function repeatedly(times, fun) {
  return _.map(_.range(times), fun);
}

function iterateUntil(fun, check, init) {
  var ret = [];
  var result = fun(init);

  while (check(result)) {
    ret.push(result);
    result = fun(result);
  }

  return ret;
};

function always(VALUE) {
  return function() {
    return VALUE;
  };
};

function invoker (NAME, METHOD) {
  return function(target /* args ... */) {
    if (!existy(target)) fail("Must provide a target");

    var targetMethod = target[NAME];
    var args = _.rest(arguments);

    return doWhen((existy(targetMethod) && METHOD === targetMethod), function() {
      return targetMethod.apply(target, args);
    });
  };
};

var rev = invoker('reverse', Array.prototype.reverse);

function uniqueString(len) {
  return Math.random().toString(36).substr(2, len);
};

function uniqueString(prefix) {
  return [prefix, new Date().getTime()].join('');
};

function makeUniqueStringFunction(start) {
  var COUNTER = start;

  return function(prefix) {
    return [prefix, COUNTER++].join('');
  }
};

var uniqueString = makeUniqueStringFunction(0);

var generator = {
  count: 0,
  uniqueString: function(prefix) {
    return [prefix, this.count++].join('');
  }
};

var omgenerator = (function(init) {
  var COUNTER = init;

  return {
    uniqueString: function(prefix) {
      return [prefix, COUNTER++].join('');
    }
  };
})(0);

var nums = [1,2,3,null,5];

function fnull(fun /*, defaults */) {
  var defaults = _.rest(arguments);

  return function(/* args */) {
    var args = _.map(arguments, function(e, i) {
      return existy(e) ? e : defaults[i];
    });

    return fun.apply(null, args);
  };
};

var safeMult = fnull(function(total, n) { return total * n }, 1, 1);


function defaults(d) {
  return function(o, k) {
    var val = fnull(_.identity, d[k]);
    return o && val(o[k]);
  };
}

function doSomething(config) {
  var lookup = defaults({critical: 108});

  return lookup(config, 'critical');
}

function checker(/* validators */) {
  var validators = _.toArray(arguments);

  return function(obj) {
    return _.reduce(validators, function(errs, check) {
      if (check(obj))
        return errs;
      else
        return _.chain(errs).push(check.message).value();
    }, []);
  };
}

function validator(message, fun) {
  var f = function(/* args */) {
    return fun.apply(fun, arguments);
  };

  f['message'] = message;
  return f;
}

function aMap(obj) {
  return _.isObject(obj);
}

var checkCommand = checker(validator("must be a map", aMap));

function hasKeys() {
  var KEYS = _.toArray(arguments);

  var fun = function(obj) {
    return _.every(KEYS, function(k) {
      return _.has(obj, k);
    });
  };

  fun.message = cat(["Must have values for keys:"], KEYS).join(" ");
  return fun;
}

var checkCommand = checker(validator("must be a map", aMap), hasKeys('msg', 'type'));

// Chapter 5

function dispatch(/* funs */) {
  var funs = _.toArray(arguments);
  var size = funs.length;

  return function(target /*, args */) {
    var ret = undefined;
    var args = _.rest(arguments);

    for (var funIndex = 0; funIndex < size; funIndex++) {
      var fun = funs[funIndex];
      ret = fun.apply(fun, construct(target, args));

      if (existy(ret)) return ret;
    }

    return ret;
  };
}

var str = dispatch(invoker('toString', Array.prototype.toString), invoker('toString', String.prototype.toString));

function stringReverse(s) {
  if (!_.isString(s)) return undefined;
  return s.split('').reverse().join("");
}

var rev = dispatch(invoker('reverse', Array.prototype.reverse), stringReverse);

function performCommandHardcoded(command) {
  var result;

  switch (command.type) 
  {
  case 'notify':
    result = notify(command.message);
    break;
  case 'join':
    result = changeView(command.target);
    break;
  default:
    alert(command.type);
  }

  return result;
}

function isa(type, action) {
  return function(obj) {
    if (type === obj.type)
      return action(obj);
  }
}

var performCommand = dispatch(
  isa('notify', function(obj) { return notify(obj.message) }),
  isa('join',   function(obj) { return changeView(obj.target) }),
  function(obj) { alert(obj.type) });

var performAdminCommand = dispatch(
  isa('kill', function(obj) { return shutdown(obj.hostname) }),
  performCommand);

var performTrialUserCommand = dispatch(
  isa('join', function(obj) { alert("Cannot join until approved") }),
  performCommand);

function rightAwayInvoker() {
  var args = _.toArray(arguments);
  var method = args.shift();
  var target = args.shift();

  return method.apply(target, args);
}

function leftCurryDiv(n) {
  return function(d) {
    return n/d;
  };
}

function rightCurryDiv(d) {
  return function(n) {
    return n/d;
  };
}

function curry(fun) {
  return function(arg) {
    return fun(arg);
  };
}

function curry2(fun) {
  return function(secondArg) {
    return function(firstArg) {
        return fun(firstArg, secondArg);
    };
  };
}

function div(n, d) { return n / d }

var div10 = curry2(div)(10);

var parseBinaryString = curry2(parseInt)(2);

function songToString(song) {
  return [song.artist, song.track].join(" - ");
}

function curry3(fun) {
  return function(last) {
    return function(middle) {
      return function(first) {
        return fun(first, middle, last);
      };
    };
  };
};

function toHex(n) {
  var hex = n.toString(16);
  return (hex.length < 2) ? [0, hex].join(''): hex;
}

function rgbToHexString(r, g, b) {
  return ["#", toHex(r), toHex(g), toHex(b)].join('');
}

var blueGreenish = curry3(rgbToHexString)(255)(200);

var greaterThan = curry2(function (lhs, rhs) { return lhs > rhs });
var lessThan    = curry2(function (lhs, rhs) { return lhs < rhs });

var withinRange = checker(
  validator("arg must be greater than 10", greaterThan(10)),
  validator("arg must be less than 20", lessThan(20)));

function divPart(n) {
  return function(d) {
    return n / d;
  };
}

var over10Part = divPart(10);

function partial1(fun, arg1) {
  return function(/* args */) {
    var args = construct(arg1, arguments);
    return fun.apply(fun, args);
  };
}

function partial2(fun, arg1, arg2) {
  return function(/* args */) {
    var args = cat([arg1, arg2], arguments);
    return fun.apply(fun, args);
  };
}

var div10By2 = partial2(div, 10, 2)

function partial(fun /*, pargs */) {
  var pargs = _.rest(arguments);

  return function(/* arguments */) {
    var args = cat(pargs, _.toArray(arguments));
    return fun.apply(fun, args);
  };
}

var zero = validator("cannot be zero", function(n) { return 0 === n });
var number = validator("arg must be a number", _.isNumber);

function sqr(n) {
  if (!number(n)) throw new Error(number.message);
  if (zero(n))    throw new Error(zero.message);

  return n * n;
}

function condition1(/* validators */) {
  var validators = _.toArray(arguments);

  return function(fun, arg) {
    var errors = mapcat(function(isValid) {
      return isValid(arg) ? [] : [isValid.message];
    }, validators);

    if (!_.isEmpty(errors))
      throw new Error(errors.join(", "));

    return fun(arg);
  };
}

var sqrPre = condition1(
  validator("arg must not be zero", complement(zero)),
  validator("arg must be a number", _.isNumber));

function uncheckedSqr(n) { return n * n };

var checkedSqr = partial1(sqrPre, uncheckedSqr);

var sillySquare = partial1(
  condition1(validator("should be even", isEven)),
  checkedSqr);

var validateCommand = condition1(
  validator("arg must be a map", _.isObject),
  validator("arg must have the correct keys", hasKeys('msg', 'type')));

var createCommand = partial(validateCommand, _.identity);

var createLaunchCommand = partial1(
  condition1(
    validator("arg must have the count down", hasKeys('countDown'))),
  createCommand);

var isntString = _.compose(function(x) { return !x }, _.isString);

function not(x) { return !x }

var composedMapcat = _.compose(splat(cat), _.map);

composedMapcat([[1,2],[3,4],[5]], _.identity);
//=> [1, 2, 3, 4, 5]

var sqrPost = condition1(
  validator("result should be a number", _.isNumber),
  validator("result should not be zero", complement(zero)),
  validator("result should be positive", greaterThan(0)));

var megaCheckedSqr = _.compose(partial(sqrPost, _.identity), checkedSqr);

