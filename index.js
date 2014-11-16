// ( ( x, y), (x, y) )
var first = cons(cons(1, 1), cons(cons(1, 2), cons(cons(1, 3), nil)))

console.log(display(first))

var next = start(first)

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
      var tot = sum(neighbors, cell, 0)
      if (eq(tot,3)) return filter(cdr(neighbors), last, cons(cell, living), cons(cell, seen))
      if (eq(tot, 2)) {
        return lif(mem(cell, last), function () {
          return filter(cdr(neighbors), last, cons(cell, living), cons(cell, seen))
        }, function () {
          return filter(cdr(neighbors), last, living, cons(cell, seen))
        })()
      }
      return filter(cdr(neighbors), last, living, cons(cell, seen))
    })()
  })()
}

function mem (cell, list) {
  if (sum(list, cell, 0) > 0) {
    return t
  }
  return f
}

function sum (list, cell, tot) {
  return lif(nul(list), function () {
    return tot
  }, function () {
    return sum(cdr(list), cell, lif(same(car(list), cell), inc(tot), tot))
  })()
}

function same (a, b) {
  if (eq(car(a), car(b)) && eq(cdr(a), cdr(b))) return t
  return f
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

function display (l) {
  return lif(nul(l), function () {
    return ''
  }, function () {
    return '( ' + car(car(l)) + ', ' + cdr(car(l)) + ' ), ' + display(cdr(l))
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

function nil () {}

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

function nul (x) {
  if (eq(x,nil)) return t
  return f
}

function eq (a, b) {
  return a === b
}

function inc (a) { return a + 1 }
function dec (a) { return a - 1  }

//function inc (n) {
//  return function (f) {
//    return function (x) {
//      return f(n(f, x))
//    }
//  }
//}