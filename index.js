// ( ( x, y), (x, y) )
var next = cons(cons(num1, num2), cons(cons(num2, num2), cons(cons(num3, num2), nil)))

console.log(display(next))

setInterval(function () {
  next = start(next)
  console.log(display(next))
}, 1000)

function start (last) {
  var neighbors = listNeighbors(last)
  return filter(neighbors, last, nil, nil)
}

function filter (neighbors, last, living, seen) {
  return lif(nul(neighbors), function () {
    return living
  }, function () {
    var cell = car(neighbors)
    return lif(mem(cell, seen), function () {
      return filter(cdr(neighbors), last, living, seen)
    }, function () {
      var tot = sum(neighbors, cell, num0)
      return lif(eq(tot,num3), function () {
        return filter(cdr(neighbors), last, cons(cell, living), cons(cell, seen))
      }, function () {
        return lif(eq(tot,num2), function () {
          return lif(mem(cell, last), function () {
            return filter(cdr(neighbors), last, cons(cell, living), cons(cell, seen))
          }, function () {
            return filter(cdr(neighbors), last, living, cons(cell, seen))
          })()
        }, function () {
          return filter(cdr(neighbors), last, living, cons(cell, seen))
        })()
      })()
    })()
  })()
}

function mem (cell, list) {
  return lif(eq(sum(list, cell, num0), num0), function () {
    return f
  }, function () {
    return t
  })()
}

function sum (list, cell, tot) {
  return lif(nul(list), function () {
    return tot
  }, function () {
    return sum(cdr(list), cell, lif(same(car(list), cell), function () { return  inc(tot) }, function () { return tot })())
  })()
}

function same (a, b) {
  return lif(and(eq(car(a), car(b)), eq(cdr(a), cdr(b))), function () {
    return t
  }, function () {
    return f
  })()
}

function listNeighbors (l) {
  return lif(nul(l), function () {
    return l
  }, function () {
    var cell = car(l)
    return cons(cons(inc(car(cell)), cdr(cell)),
        cons(cons(car(cell), inc(cdr(cell))),
        cons(cons(inc(car(cell)), inc(cdr(cell))),
        cons(cons(inc(car(cell)), dec(cdr(cell))),
        cons(cons(dec(car(cell)), inc(cdr(cell))),
        cons(cons(dec(car(cell)), cdr(cell)),
        cons(cons(car(cell), dec(cdr(cell))),
        cons(cons(dec(car(cell)), dec(cdr(cell))),listNeighbors(cdr(l))))))))))
  })()
}

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

function t (a, b) {
  return a
}

function f (a, b) {
  return b
}

function lif (a, b, c) {
  return a(b, c)
}

function nil () {
  return t
}

function num0 (f) {
  return function (x) {
    return x
  }
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

function nul (x) {
  if (x === nil) return t
  return f
}

function and (a, b) {
  return a(b, f)
}

function eq (a, b) {
  return lif(and(isZero(sub(a, b)), isZero(sub(b, a))), function () {
    return t
  }, function () {
    return f
  })()
}

function inc (n) {
  return function (f) {
    return function (x) {
      return f(n(f)(x))
    }
  }
}

function isZero (n) {
  return n(function (x) { return f})(t)
}


function dec (n) {
  return function (f) {
    return function (x) {
      return n(function (g) { return function (h) { return h(g(f)) }}
        )(function (u) { return x }
        )(function (u) { return u})
    }
  }
}

function sub (a, b) {
  return b(dec)(a)
}

function id (x) {
  return x
}

function makeConst (x) {
  return function (_) {
    return x
  }
}

function display (l) {
  return lif(nul(l), function () {
    return ''
  }, function () {
    return '( ' + num(car(car(l))) + ', ' + num(cdr(car(l))) + ' ), ' + display(cdr(l))
  })()
}

function num (n) {
  return displayNum(n, 0)
}

function displayNum (n, total) {
  return lif(isZero(n), function () {
    return total
  }, function () {
    return displayNum(dec(n), total+1)
  })()
}
