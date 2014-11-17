// Seed values as a list of x,y pairs: ( ( x, y), (x, y) )
//
// blinker
// var next = cons(cons(num1, num2), cons(cons(num2, num2), cons(cons(num3, num2), nil)))
// toad
// var next = cons(cons(num1, num2), cons(cons(num2, num2), cons(cons(num3, num2), cons(cons(num2, num3), cons(cons(num3, num3), cons(cons(num4, num3), nil))))))
// glider
var next = cons(cons(num3, num1), cons(cons(num4, num2), cons(cons(num2, num3), cons(cons(num3, num3), cons(cons(num4, num3), nil)))))

display(next)

setInterval(function () {
  next = start(next)
  display(next)
}, 1000)

function start (last) {
  return filter(listNeighbors(last), last, nil, nil)
}

function filter (neighbors, last, living, seen) {
  return lif(nul(neighbors), makeConst(living), function (cell) {
    return lif(member(cell, seen), skip, function () {
      return (function (tot) {
        return lif(eq(tot,num3), live, function () {
          return lif(eq(tot,num2), function () {
            return lif(member(cell, last), live, die)()
          }, die)()
        })()
      })(howMany(neighbors, cell, num0))
    })()

    function live () {
      return filter(cdr(neighbors), last, cons(cell, living), cons(cell, seen))
    }

    function die () {
      return filter(cdr(neighbors), last, living, cons(cell, seen))
    }

    function skip () {
      return filter(cdr(neighbors), last, living, seen)
    }

  })(car(neighbors))
}

function member (cell, list) {
  return lif(eq(howMany(list, cell, num0), num0), f, t)
}

function howMany (list, cell, tot) {
  return lif(nul(list), makeConst(tot), function () {
    return howMany(cdr(list), cell, lif(samePoint(car(list), cell), inc(tot), tot))
  })()
}

function samePoint (a, b) {
  return lif(and(eq(car(a), car(b)), eq(cdr(a), cdr(b))), t, f)
}

function listNeighbors (l) {
  return _listNeighbors(l, nil)
}
function _listNeighbors (l, sofar) {
  return lif(nul(l), makeConst(sofar), function (x, y) {
    return _listNeighbors(cdr(l),
      cons(cons(inc(x), y),
        cons(cons(x, inc(y)),
          cons(cons(inc(x), inc(y)),
            cons(cons(inc(x), dec(y)),
              cons(cons(dec(x), inc(y)),
                cons(cons(dec(x), y),
                  cons(cons(x, dec(y)),
                    cons(cons(dec(x), dec(y)),
                      sofar)))))))))
  })(car(car(l)), cdr(car(l)))
}

// lists

function cons (a, b) {
  return function (op) {
    return op(a, b)
  }
}

function car (a) {
  return a(t)
}

function cdr (a) {
  return a(f)
}

function nil () {
  return t
}

function nul (p) {
  return p(makeConst(f))
}

// logic

function t (a, b) {
  return a
}

function f (a, b) {
  return b
}

function lif (a, b, c) {
  return a(b, c)
}

function and (a, b) {
  return a(b, f)
}

// maths

function eq (a, b) {
  return lif(and(isZero(sub(a, b)), isZero(sub(b, a))), t, f)
}

function inc (n) {
  return function (a) {
    return function (b) {
      return a(n(a)(b))
    }
  }
}

function isZero (n) {
  return n(makeConst(f))(t)
}

function dec (n) {
  return car(n(shift)(cons(num0, num0)))
}

function shift (x) {
  return cons(cdr(x), inc(cdr(x)))
}

function sub (a, b) {
  return b(dec)(a)
}

function add (a, b) {
  return b(inc)(a)
}

// util

function id (x) {
  return x
}

function makeConst (x) {
  return function (_) {
    return x
  }
}

// num literals for seed values

function num0 (_) {
  return id
}

function num1 (fn) {
  return function (x) {
    return fn(x)
  }
}

function num2 (fn) {
  return function (x) {
    return fn(fn(x))
  }
}

function num3 (fn) {
  return function (x) {
    return fn(fn(fn(x)))
  }
}

function num4 (fn) {
  return function (x) {
    return fn(fn(fn(fn(x))))
  }
}

// display logic

function display (l) {
  console.log(_display(l, '( '))
}

function _display (l, sofar) {
  return lif(nul(l), function () {
    return sofar + ')'
  }, function () {
    return _display(cdr(l), sofar + '( ' + num(car(car(l))) + ', ' + num(cdr(car(l))) + ' ) ')
  })()
}

function num (n) {
  return n(function (x) { return x + 1 })(0)
}

