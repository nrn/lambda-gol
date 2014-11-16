// Seed values as a list of x,y pairs: ( ( x, y), (x, y) )
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
  return lif(eq(sum(list, cell, num0), num0), f, t)
}

function sum (list, cell, tot) {
  return lif(nul(list), function () {
    return tot
  }, function () {
    return sum(cdr(list), cell, lif(same(car(list), cell), inc(tot), tot))
  })()
}

function same (a, b) {
  return lif(and(eq(car(a), car(b)), eq(cdr(a), cdr(b))), t, f)
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

function nul (p) {
  return p(makeConst(f))
}

function and (a, b) {
  return a(b, f)
}

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
