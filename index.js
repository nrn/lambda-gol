// Seed values as a list of x,y pairs: ( ( x, y), (x, y) )
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
  return lif(nul(neighbors), function () {
    return living
  }, function () {
    return (function (cell) {
      return lif(member(cell, seen), function () {
        return filter(cdr(neighbors), last, living, seen)
      }, function () {
        return (function (tot) {
          return lif(eq(tot,num3), function () {
            return filter(cdr(neighbors), last, cons(cell, living), cons(cell, seen))
          }, function () {
            return lif(eq(tot,num2), function () {
              return lif(member(cell, last), function () {
                return filter(cdr(neighbors), last, cons(cell, living), cons(cell, seen))
              }, function () {
                return filter(cdr(neighbors), last, living, cons(cell, seen))
              })()
            }, function () {
              return filter(cdr(neighbors), last, living, cons(cell, seen))
            })()
          })()
        })(howMany(neighbors, cell, num0))
      })()
    })(car(neighbors))
  })()
}

function member (cell, list) {
  return lif(eq(howMany(list, cell, num0), num0), f, t)
}

function howMany (list, cell, tot) {
  return lif(nul(list), function () {
    return tot
  }, function () {
    return howMany(cdr(list), cell, lif(samePoint(car(list), cell), inc(tot), tot))
  })()
}

function samePoint (a, b) {
  return lif(and(eq(car(a), car(b)), eq(cdr(a), cdr(b))), t, f)
}

function listNeighbors (l) {
  return lif(nul(l), function () {
    return l
  }, function () {
    return (function (cell) {
      return cons(cons(inc(car(cell)), cdr(cell)),
          cons(cons(car(cell), inc(cdr(cell))),
          cons(cons(inc(car(cell)), inc(cdr(cell))),
          cons(cons(inc(car(cell)), dec(cdr(cell))),
          cons(cons(dec(car(cell)), inc(cdr(cell))),
          cons(cons(dec(car(cell)), cdr(cell)),
          cons(cons(car(cell), dec(cdr(cell))),
          cons(cons(dec(car(cell)), dec(cdr(cell))),listNeighbors(cdr(l))))))))))
    })(car(l))
  })()
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
  return function (f) {
    return function (x) {
      return f(n(f)(x))
    }
  }
}

function isZero (n) {
  return n(makeConst(f))(t)
}

function dec (n) {
  return function (f) {
    return function (x) {
      return n(function (g) { return function (h) { return h(g(f)) }}
        )(makeConst(x)
        )(id)
    }
  }
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

function num1 (f) {
  return function (x) {
    return f(x)
  }
}

function num2 (f) {
  return function (x) {
    return f(f(x))
  }
}

function num3 (f) {
  return function (x) {
    return f(f(f(x)))
  }
}

function num4 (f) {
  return function (x) {
    return f(f(f(f(x))))
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

