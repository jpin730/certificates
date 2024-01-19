var mI = Object.defineProperty,
  yI = Object.defineProperties
var vI = Object.getOwnPropertyDescriptors
var If = Object.getOwnPropertySymbols
var _I = Object.prototype.hasOwnProperty,
  II = Object.prototype.propertyIsEnumerable
var Ef = (t, e, n) =>
    e in t
      ? mI(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (t[e] = n),
  We = (t, e) => {
    for (var n in (e ||= {})) _I.call(e, n) && Ef(t, n, e[n])
    if (If) for (var n of If(e)) II.call(e, n) && Ef(t, n, e[n])
    return t
  },
  lt = (t, e) => yI(t, vI(e))
var p = (t, e, n) =>
  new Promise((r, i) => {
    var s = (c) => {
        try {
          a(n.next(c))
        } catch (u) {
          i(u)
        }
      },
      o = (c) => {
        try {
          a(n.throw(c))
        } catch (u) {
          i(u)
        }
      },
      a = (c) => (c.done ? r(c.value) : Promise.resolve(c.value).then(s, o))
    a((n = n.apply(t, e)).next())
  })
var wf = null
var $a = 1,
  Df = Symbol('SIGNAL')
function Ce(t) {
  let e = wf
  return (wf = t), e
}
var Tf = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
}
function EI(t) {
  if (!(za(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === $a)) {
    if (!t.producerMustRecompute(t) && !Ha(t)) {
      ;(t.dirty = !1), (t.lastCleanEpoch = $a)
      return
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = $a)
  }
}
function Cf(t) {
  return t && (t.nextProducerIndex = 0), Ce(t)
}
function bf(t, e) {
  if (
    (Ce(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (za(t))
      for (let n = t.nextProducerIndex; n < t.producerNode.length; n++)
        qa(t.producerNode[n], t.producerIndexOfThis[n])
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop()
  }
}
function Ha(t) {
  is(t)
  for (let e = 0; e < t.producerNode.length; e++) {
    let n = t.producerNode[e],
      r = t.producerLastReadVersion[e]
    if (r !== n.version || (EI(n), r !== n.version)) return !0
  }
  return !1
}
function Af(t) {
  if ((is(t), za(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      qa(t.producerNode[e], t.producerIndexOfThis[e])
  ;(t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0)
}
function qa(t, e) {
  if ((wI(t), is(t), t.liveConsumerNode.length === 1))
    for (let r = 0; r < t.producerNode.length; r++)
      qa(t.producerNode[r], t.producerIndexOfThis[r])
  let n = t.liveConsumerNode.length - 1
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[n]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[n]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let r = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e]
    is(i), (i.producerIndexOfThis[r] = e)
  }
}
function za(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0
}
function is(t) {
  ;(t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= [])
}
function wI(t) {
  ;(t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= [])
}
function DI() {
  throw new Error()
}
var TI = DI
function Sf(t) {
  TI = t
}
function he(t) {
  return typeof t == 'function'
}
function ss(t) {
  let n = t((r) => {
    Error.call(r), (r.stack = new Error().stack)
  })
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  )
}
var os = ss(
  (t) =>
    function (n) {
      t(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, i) => `${i + 1}) ${r.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = n)
    }
)
function Gt(t, e) {
  if (t) {
    let n = t.indexOf(e)
    0 <= n && t.splice(n, 1)
  }
}
var fe = class t {
  constructor(e) {
    ;(this.initialTeardown = e),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null)
  }
  unsubscribe() {
    let e
    if (!this.closed) {
      this.closed = !0
      let { _parentage: n } = this
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let s of n) s.remove(this)
        else n.remove(this)
      let { initialTeardown: r } = this
      if (he(r))
        try {
          r()
        } catch (s) {
          e = s instanceof os ? s.errors : [s]
        }
      let { _finalizers: i } = this
      if (i) {
        this._finalizers = null
        for (let s of i)
          try {
            Nf(s)
          } catch (o) {
            ;(e = e ?? []),
              o instanceof os ? (e = [...e, ...o.errors]) : e.push(o)
          }
      }
      if (e) throw new os(e)
    }
  }
  add(e) {
    var n
    if (e && e !== this)
      if (this.closed) Nf(e)
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return
          e._addParent(this)
        }
        ;(this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(e)
      }
  }
  _hasParent(e) {
    let { _parentage: n } = this
    return n === e || (Array.isArray(n) && n.includes(e))
  }
  _addParent(e) {
    let { _parentage: n } = this
    this._parentage = Array.isArray(n) ? (n.push(e), n) : n ? [n, e] : e
  }
  _removeParent(e) {
    let { _parentage: n } = this
    n === e ? (this._parentage = null) : Array.isArray(n) && Gt(n, e)
  }
  remove(e) {
    let { _finalizers: n } = this
    n && Gt(n, e), e instanceof t && e._removeParent(this)
  }
}
fe.EMPTY = (() => {
  let t = new fe()
  return (t.closed = !0), t
})()
var Ga = fe.EMPTY
function as(t) {
  return (
    t instanceof fe ||
    (t && 'closed' in t && he(t.remove) && he(t.add) && he(t.unsubscribe))
  )
}
function Nf(t) {
  he(t) ? t() : t.unsubscribe()
}
var Pe = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
}
var Nn = {
  setTimeout(t, e, ...n) {
    let { delegate: r } = Nn
    return r?.setTimeout ? r.setTimeout(t, e, ...n) : setTimeout(t, e, ...n)
  },
  clearTimeout(t) {
    let { delegate: e } = Nn
    return (e?.clearTimeout || clearTimeout)(t)
  },
  delegate: void 0,
}
function Rf(t) {
  Nn.setTimeout(() => {
    let { onUnhandledError: e } = Pe
    if (e) e(t)
    else throw t
  })
}
function Wa() {}
var xf = Ka('C', void 0, void 0)
function Mf(t) {
  return Ka('E', void 0, t)
}
function Pf(t) {
  return Ka('N', t, void 0)
}
function Ka(t, e, n) {
  return { kind: t, value: e, error: n }
}
var Wt = null
function Rn(t) {
  if (Pe.useDeprecatedSynchronousErrorHandling) {
    let e = !Wt
    if ((e && (Wt = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: n, error: r } = Wt
      if (((Wt = null), n)) throw r
    }
  } else t()
}
function Of(t) {
  Pe.useDeprecatedSynchronousErrorHandling &&
    Wt &&
    ((Wt.errorThrown = !0), (Wt.error = t))
}
var Kt = class extends fe {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), as(e) && e.add(this))
          : (this.destination = AI)
    }
    static create(e, n, r) {
      return new xn(e, n, r)
    }
    next(e) {
      this.isStopped ? Ya(Pf(e), this) : this._next(e)
    }
    error(e) {
      this.isStopped ? Ya(Mf(e), this) : ((this.isStopped = !0), this._error(e))
    }
    complete() {
      this.isStopped ? Ya(xf, this) : ((this.isStopped = !0), this._complete())
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null))
    }
    _next(e) {
      this.destination.next(e)
    }
    _error(e) {
      try {
        this.destination.error(e)
      } finally {
        this.unsubscribe()
      }
    }
    _complete() {
      try {
        this.destination.complete()
      } finally {
        this.unsubscribe()
      }
    }
  },
  CI = Function.prototype.bind
function Qa(t, e) {
  return CI.call(t, e)
}
var Ja = class {
    constructor(e) {
      this.partialObserver = e
    }
    next(e) {
      let { partialObserver: n } = this
      if (n.next)
        try {
          n.next(e)
        } catch (r) {
          cs(r)
        }
    }
    error(e) {
      let { partialObserver: n } = this
      if (n.error)
        try {
          n.error(e)
        } catch (r) {
          cs(r)
        }
      else cs(e)
    }
    complete() {
      let { partialObserver: e } = this
      if (e.complete)
        try {
          e.complete()
        } catch (n) {
          cs(n)
        }
    }
  },
  xn = class extends Kt {
    constructor(e, n, r) {
      super()
      let i
      if (he(e) || !e)
        i = { next: e ?? void 0, error: n ?? void 0, complete: r ?? void 0 }
      else {
        let s
        this && Pe.useDeprecatedNextContext
          ? ((s = Object.create(e)),
            (s.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && Qa(e.next, s),
              error: e.error && Qa(e.error, s),
              complete: e.complete && Qa(e.complete, s),
            }))
          : (i = e)
      }
      this.destination = new Ja(i)
    }
  }
function cs(t) {
  Pe.useDeprecatedSynchronousErrorHandling ? Of(t) : Rf(t)
}
function bI(t) {
  throw t
}
function Ya(t, e) {
  let { onStoppedNotification: n } = Pe
  n && Nn.setTimeout(() => n(t, e))
}
var AI = { closed: !0, next: Wa, error: bI, complete: Wa }
var kf = (typeof Symbol == 'function' && Symbol.observable) || '@@observable'
function us(t) {
  return t
}
function Ff(t) {
  return t.length === 0
    ? us
    : t.length === 1
      ? t[0]
      : function (n) {
          return t.reduce((r, i) => i(r), n)
        }
}
var Oe = (() => {
  class t {
    constructor(n) {
      n && (this._subscribe = n)
    }
    lift(n) {
      let r = new t()
      return (r.source = this), (r.operator = n), r
    }
    subscribe(n, r, i) {
      let s = NI(n) ? n : new xn(n, r, i)
      return (
        Rn(() => {
          let { operator: o, source: a } = this
          s.add(
            o ? o.call(s, a) : a ? this._subscribe(s) : this._trySubscribe(s)
          )
        }),
        s
      )
    }
    _trySubscribe(n) {
      try {
        return this._subscribe(n)
      } catch (r) {
        n.error(r)
      }
    }
    forEach(n, r) {
      return (
        (r = Lf(r)),
        new r((i, s) => {
          let o = new xn({
            next: (a) => {
              try {
                n(a)
              } catch (c) {
                s(c), o.unsubscribe()
              }
            },
            error: s,
            complete: i,
          })
          this.subscribe(o)
        })
      )
    }
    _subscribe(n) {
      var r
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n)
    }
    [kf]() {
      return this
    }
    pipe(...n) {
      return Ff(n)(this)
    }
    toPromise(n) {
      return (
        (n = Lf(n)),
        new n((r, i) => {
          let s
          this.subscribe(
            (o) => (s = o),
            (o) => i(o),
            () => r(s)
          )
        })
      )
    }
  }
  return (t.create = (e) => new t(e)), t
})()
function Lf(t) {
  var e
  return (e = t ?? Pe.Promise) !== null && e !== void 0 ? e : Promise
}
function SI(t) {
  return t && he(t.next) && he(t.error) && he(t.complete)
}
function NI(t) {
  return (t && t instanceof Kt) || (SI(t) && as(t))
}
function RI(t) {
  return he(t?.lift)
}
function Ke(t) {
  return (e) => {
    if (RI(e))
      return e.lift(function (n) {
        try {
          return t(n, this)
        } catch (r) {
          this.error(r)
        }
      })
    throw new TypeError('Unable to lift unknown Observable type')
  }
}
function bt(t, e, n, r, i) {
  return new Za(t, e, n, r, i)
}
var Za = class extends Kt {
  constructor(e, n, r, i, s, o) {
    super(e),
      (this.onFinalize = s),
      (this.shouldUnsubscribe = o),
      (this._next = n
        ? function (a) {
            try {
              n(a)
            } catch (c) {
              e.error(c)
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a)
            } catch (c) {
              e.error(c)
            } finally {
              this.unsubscribe()
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r()
            } catch (a) {
              e.error(a)
            } finally {
              this.unsubscribe()
            }
          }
        : super._complete)
  }
  unsubscribe() {
    var e
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this
      super.unsubscribe(),
        !n && ((e = this.onFinalize) === null || e === void 0 || e.call(this))
    }
  }
}
var Vf = ss(
  (t) =>
    function () {
      t(this),
        (this.name = 'ObjectUnsubscribedError'),
        (this.message = 'object unsubscribed')
    }
)
var Mn = (() => {
    class t extends Oe {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null)
      }
      lift(n) {
        let r = new ls(this, this)
        return (r.operator = n), r
      }
      _throwIfClosed() {
        if (this.closed) throw new Vf()
      }
      next(n) {
        Rn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers))
            for (let r of this.currentObservers) r.next(n)
          }
        })
      }
      error(n) {
        Rn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ;(this.hasError = this.isStopped = !0), (this.thrownError = n)
            let { observers: r } = this
            for (; r.length; ) r.shift().error(n)
          }
        })
      }
      complete() {
        Rn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0
            let { observers: n } = this
            for (; n.length; ) n.shift().complete()
          }
        })
      }
      unsubscribe() {
        ;(this.isStopped = this.closed = !0),
          (this.observers = this.currentObservers = null)
      }
      get observed() {
        var n
        return (
          ((n = this.observers) === null || n === void 0 ? void 0 : n.length) >
          0
        )
      }
      _trySubscribe(n) {
        return this._throwIfClosed(), super._trySubscribe(n)
      }
      _subscribe(n) {
        return (
          this._throwIfClosed(),
          this._checkFinalizedStatuses(n),
          this._innerSubscribe(n)
        )
      }
      _innerSubscribe(n) {
        let { hasError: r, isStopped: i, observers: s } = this
        return r || i
          ? Ga
          : ((this.currentObservers = null),
            s.push(n),
            new fe(() => {
              ;(this.currentObservers = null), Gt(s, n)
            }))
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: s } = this
        r ? n.error(i) : s && n.complete()
      }
      asObservable() {
        let n = new Oe()
        return (n.source = this), n
      }
    }
    return (t.create = (e, n) => new ls(e, n)), t
  })(),
  ls = class extends Mn {
    constructor(e, n) {
      super(), (this.destination = e), (this.source = n)
    }
    next(e) {
      var n, r
      ;(r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, e)
    }
    error(e) {
      var n, r
      ;(r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, e)
    }
    complete() {
      var e, n
      ;(n =
        (e = this.destination) === null || e === void 0
          ? void 0
          : e.complete) === null ||
        n === void 0 ||
        n.call(e)
    }
    _subscribe(e) {
      var n, r
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(e)) !== null && r !== void 0
        ? r
        : Ga
    }
  }
var Sr = class extends Mn {
  constructor(e) {
    super(), (this._value = e)
  }
  get value() {
    return this.getValue()
  }
  _subscribe(e) {
    let n = super._subscribe(e)
    return !n.closed && e.next(this._value), n
  }
  getValue() {
    let { hasError: e, thrownError: n, _value: r } = this
    if (e) throw n
    return this._throwIfClosed(), r
  }
  next(e) {
    super.next((this._value = e))
  }
}
var Xa = {
  now() {
    return (Xa.delegate || Date).now()
  },
  delegate: void 0,
}
var ds = class extends fe {
  constructor(e, n) {
    super()
  }
  schedule(e, n = 0) {
    return this
  }
}
var Nr = {
  setInterval(t, e, ...n) {
    let { delegate: r } = Nr
    return r?.setInterval ? r.setInterval(t, e, ...n) : setInterval(t, e, ...n)
  },
  clearInterval(t) {
    let { delegate: e } = Nr
    return (e?.clearInterval || clearInterval)(t)
  },
  delegate: void 0,
}
var Pn = class extends ds {
  constructor(e, n) {
    super(e, n), (this.scheduler = e), (this.work = n), (this.pending = !1)
  }
  schedule(e, n = 0) {
    var r
    if (this.closed) return this
    this.state = e
    let i = this.id,
      s = this.scheduler
    return (
      i != null && (this.id = this.recycleAsyncId(s, i, n)),
      (this.pending = !0),
      (this.delay = n),
      (this.id =
        (r = this.id) !== null && r !== void 0
          ? r
          : this.requestAsyncId(s, this.id, n)),
      this
    )
  }
  requestAsyncId(e, n, r = 0) {
    return Nr.setInterval(e.flush.bind(e, this), r)
  }
  recycleAsyncId(e, n, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return n
    n != null && Nr.clearInterval(n)
  }
  execute(e, n) {
    if (this.closed) return new Error('executing a cancelled action')
    this.pending = !1
    let r = this._execute(e, n)
    if (r) return r
    this.pending === !1 &&
      this.id != null &&
      (this.id = this.recycleAsyncId(this.scheduler, this.id, null))
  }
  _execute(e, n) {
    let r = !1,
      i
    try {
      this.work(e)
    } catch (s) {
      ;(r = !0), (i = s || new Error('Scheduled action threw falsy error'))
    }
    if (r) return this.unsubscribe(), i
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: e, scheduler: n } = this,
        { actions: r } = n
      ;(this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        Gt(r, this),
        e != null && (this.id = this.recycleAsyncId(n, e, null)),
        (this.delay = null),
        super.unsubscribe()
    }
  }
}
var On = class t {
  constructor(e, n = t.now) {
    ;(this.schedulerActionCtor = e), (this.now = n)
  }
  schedule(e, n = 0, r) {
    return new this.schedulerActionCtor(this, e).schedule(r, n)
  }
}
On.now = Xa.now
var kn = class extends On {
  constructor(e, n = On.now) {
    super(e, n), (this.actions = []), (this._active = !1)
  }
  flush(e) {
    let { actions: n } = this
    if (this._active) {
      n.push(e)
      return
    }
    let r
    this._active = !0
    do if ((r = e.execute(e.state, e.delay))) break
    while ((e = n.shift()))
    if (((this._active = !1), r)) {
      for (; (e = n.shift()); ) e.unsubscribe()
      throw r
    }
  }
}
var ec = new kn(Pn)
var hs = class extends Pn {
  constructor(e, n) {
    super(e, n), (this.scheduler = e), (this.work = n)
  }
  schedule(e, n = 0) {
    return n > 0
      ? super.schedule(e, n)
      : ((this.delay = n), (this.state = e), this.scheduler.flush(this), this)
  }
  execute(e, n) {
    return n > 0 || this.closed ? super.execute(e, n) : this._execute(e, n)
  }
  requestAsyncId(e, n, r = 0) {
    return (r != null && r > 0) || (r == null && this.delay > 0)
      ? super.requestAsyncId(e, n, r)
      : (e.flush(this), 0)
  }
}
var fs = class extends kn {}
var tc = new fs(hs)
var Uf = new Oe((t) => t.complete())
function nc(t, e) {
  var n = {}
  for (var r in t)
    Object.prototype.hasOwnProperty.call(t, r) &&
      e.indexOf(r) < 0 &&
      (n[r] = t[r])
  if (t != null && typeof Object.getOwnPropertySymbols == 'function')
    for (var i = 0, r = Object.getOwnPropertySymbols(t); i < r.length; i++)
      e.indexOf(r[i]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(t, r[i]) &&
        (n[r[i]] = t[r[i]])
  return n
}
function ps(t, e, n, r = 0, i = !1) {
  let s = e.schedule(function () {
    n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe()
  }, r)
  if ((t.add(s), !i)) return s
}
function gs(t, e = 0) {
  return Ke((n, r) => {
    n.subscribe(
      bt(
        r,
        (i) => ps(r, t, () => r.next(i), e),
        () => ps(r, t, () => r.complete(), e),
        (i) => ps(r, t, () => r.error(i), e)
      )
    )
  })
}
function ms(t, e = 0) {
  return Ke((n, r) => {
    r.add(t.schedule(() => n.subscribe(r), e))
  })
}
function Fn(t, e) {
  return Ke((n, r) => {
    let i = 0
    n.subscribe(
      bt(r, (s) => {
        r.next(t.call(e, s, i++))
      })
    )
  })
}
function rc(t) {
  return t <= 0
    ? () => Uf
    : Ke((e, n) => {
        let r = 0
        e.subscribe(
          bt(n, (i) => {
            ++r <= t && (n.next(i), t <= r && n.complete())
          })
        )
      })
}
function ic(t, e, n) {
  let r = he(t) || e || n ? { next: t, error: e, complete: n } : t
  return r
    ? Ke((i, s) => {
        var o
        ;(o = r.subscribe) === null || o === void 0 || o.call(r)
        let a = !0
        i.subscribe(
          bt(
            s,
            (c) => {
              var u
              ;(u = r.next) === null || u === void 0 || u.call(r, c), s.next(c)
            },
            () => {
              var c
              ;(a = !1),
                (c = r.complete) === null || c === void 0 || c.call(r),
                s.complete()
            },
            (c) => {
              var u
              ;(a = !1),
                (u = r.error) === null || u === void 0 || u.call(r, c),
                s.error(c)
            },
            () => {
              var c, u
              a && ((c = r.unsubscribe) === null || c === void 0 || c.call(r)),
                (u = r.finalize) === null || u === void 0 || u.call(r)
            }
          )
        )
      })
    : us
}
var xI = 'https://g.co/ng/security#xss',
  H = class extends Error {
    constructor(e, n) {
      super(Kc(e, n)), (this.code = e)
    }
  }
function Kc(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ': ' + e : ''}`
}
function G(t) {
  for (let e in t) if (t[e] === G) return e
  throw Error('Could not find renamed property on target object.')
}
function be(t) {
  if (typeof t == 'string') return t
  if (Array.isArray(t)) return '[' + t.map(be).join(', ') + ']'
  if (t == null) return '' + t
  if (t.overriddenName) return `${t.overriddenName}`
  if (t.name) return `${t.name}`
  let e = t.toString()
  if (e == null) return '' + e
  let n = e.indexOf(`
`)
  return n === -1 ? e : e.substring(0, n)
}
function jf(t, e) {
  return t == null || t === ''
    ? e === null
      ? ''
      : e
    : e == null || e === ''
      ? t
      : t + ' ' + e
}
var MI = G({ __forward_ref__: G })
function wp(t) {
  return (
    (t.__forward_ref__ = wp),
    (t.toString = function () {
      return be(this())
    }),
    t
  )
}
function Fe(t) {
  return PI(t) ? t() : t
}
function PI(t) {
  return (
    typeof t == 'function' && t.hasOwnProperty(MI) && t.__forward_ref__ === wp
  )
}
function Dp(t) {
  return t && !!t.ɵproviders
}
var OI = G({ ɵcmp: G }),
  kI = G({ ɵdir: G }),
  FI = G({ ɵpipe: G })
var Bf = G({ ɵfac: G }),
  xr = G({ __NG_ELEMENT_ID__: G }),
  $f = G({ __NG_ENV_ID__: G })
function LI(t) {
  return typeof t == 'string' ? t : t == null ? '' : String(t)
}
function VI(t) {
  return typeof t == 'function'
    ? t.name || t.toString()
    : typeof t == 'object' && t != null && typeof t.type == 'function'
      ? t.type.name || t.type.toString()
      : LI(t)
}
function UI(t, e) {
  let n = e ? `. Dependency path: ${e.join(' > ')} > ${t}` : ''
  throw new H(-200, `Circular dependency in DI detected for ${t}${n}`)
}
function Qc(t, e) {
  throw new H(-201, !1)
}
function jI(t, e) {
  t == null && BI(e, t, null, '!=')
}
function BI(t, e, n, r) {
  throw new Error(
    `ASSERTION ERROR: ${t}` +
      (r == null ? '' : ` [Expected=> ${n} ${r} ${e} <=Actual]`)
  )
}
function K(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  }
}
function rn(t) {
  return { providers: t.providers || [], imports: t.imports || [] }
}
function Yc(t) {
  return Hf(t, Tp) || Hf(t, Cp)
}
function Hf(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null
}
function $I(t) {
  let e = t && (t[Tp] || t[Cp])
  return e || null
}
function qf(t) {
  return t && (t.hasOwnProperty(zf) || t.hasOwnProperty(HI)) ? t[zf] : null
}
var Tp = G({ ɵprov: G }),
  zf = G({ ɵinj: G }),
  Cp = G({ ngInjectableDef: G }),
  HI = G({ ngInjectorDef: G }),
  R = (function (t) {
    return (
      (t[(t.Default = 0)] = 'Default'),
      (t[(t.Host = 1)] = 'Host'),
      (t[(t.Self = 2)] = 'Self'),
      (t[(t.SkipSelf = 4)] = 'SkipSelf'),
      (t[(t.Optional = 8)] = 'Optional'),
      t
    )
  })(R || {}),
  vc
function qI() {
  return vc
}
function Qe(t) {
  let e = vc
  return (vc = t), e
}
function bp(t, e, n) {
  let r = Yc(t)
  if (r && r.providedIn == 'root')
    return r.value === void 0 ? (r.value = r.factory()) : r.value
  if (n & R.Optional) return null
  if (e !== void 0) return e
  Qc(t, 'Injector')
}
var Mr = globalThis
var q = class {
  constructor(e, n) {
    ;(this._desc = e),
      (this.ngMetadataName = 'InjectionToken'),
      (this.ɵprov = void 0),
      typeof n == 'number'
        ? (this.__NG_ELEMENT_ID__ = n)
        : n !== void 0 &&
          (this.ɵprov = K({
            token: this,
            providedIn: n.providedIn || 'root',
            factory: n.factory,
          }))
  }
  get multi() {
    return this
  }
  toString() {
    return `InjectionToken ${this._desc}`
  }
}
var zI = {},
  kr = zI,
  _c = '__NG_DI_FLAG__',
  Ts = 'ngTempTokenPath',
  GI = 'ngTokenPath',
  WI = /\n/gm,
  KI = '\u0275',
  Gf = '__source',
  Pr
function Ln(t) {
  let e = Pr
  return (Pr = t), e
}
function QI(t, e = R.Default) {
  if (Pr === void 0) throw new H(-203, !1)
  return Pr === null
    ? bp(t, void 0, e)
    : Pr.get(t, e & R.Optional ? null : void 0, e)
}
function k(t, e = R.Default) {
  return (qI() || QI)(Fe(t), e)
}
function X(t, e = R.Default) {
  return k(t, Bs(e))
}
function Bs(t) {
  return typeof t > 'u' || typeof t == 'number'
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4)
}
function Ic(t) {
  let e = []
  for (let n = 0; n < t.length; n++) {
    let r = Fe(t[n])
    if (Array.isArray(r)) {
      if (r.length === 0) throw new H(900, !1)
      let i,
        s = R.Default
      for (let o = 0; o < r.length; o++) {
        let a = r[o],
          c = JI(a)
        typeof c == 'number' ? (c === -1 ? (i = a.token) : (s |= c)) : (i = a)
      }
      e.push(k(i, s))
    } else e.push(k(r))
  }
  return e
}
function YI(t, e) {
  return (t[_c] = e), (t.prototype[_c] = e), t
}
function JI(t) {
  return t[_c]
}
function ZI(t, e, n, r) {
  let i = t[Ts]
  throw (
    (e[Gf] && i.unshift(e[Gf]),
    (t.message = XI(
      `
` + t.message,
      i,
      n,
      r
    )),
    (t[GI] = i),
    (t[Ts] = null),
    t)
  )
}
function XI(t, e, n, r = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == KI
      ? t.slice(2)
      : t
  let i = be(e)
  if (Array.isArray(e)) i = e.map(be).join(' -> ')
  else if (typeof e == 'object') {
    let s = []
    for (let o in e)
      if (e.hasOwnProperty(o)) {
        let a = e[o]
        s.push(o + ':' + (typeof a == 'string' ? JSON.stringify(a) : be(a)))
      }
    i = `{${s.join(', ')}}`
  }
  return `${n}${r ? '(' + r + ')' : ''}[${i}]: ${t.replace(
    WI,
    `
  `
  )}`
}
function $s(t) {
  return { toString: t }.toString()
}
var Ap = (function (t) {
    return (t[(t.OnPush = 0)] = 'OnPush'), (t[(t.Default = 1)] = 'Default'), t
  })(Ap || {}),
  Ze = (function (t) {
    return (
      (t[(t.Emulated = 0)] = 'Emulated'),
      (t[(t.None = 2)] = 'None'),
      (t[(t.ShadowDom = 3)] = 'ShadowDom'),
      t
    )
  })(Ze || {}),
  Fr = {},
  Le = [],
  Yt = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.SignalBased = 1)] = 'SignalBased'),
      (t[(t.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      t
    )
  })(Yt || {})
function Sp(t, e, n) {
  let r = t.length
  for (;;) {
    let i = t.indexOf(e, n)
    if (i === -1) return i
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let s = e.length
      if (i + s === r || t.charCodeAt(i + s) <= 32) return i
    }
    n = i + 1
  }
}
function Ec(t, e, n) {
  let r = 0
  for (; r < n.length; ) {
    let i = n[r]
    if (typeof i == 'number') {
      if (i !== 0) break
      r++
      let s = n[r++],
        o = n[r++],
        a = n[r++]
      t.setAttribute(e, o, a, s)
    } else {
      let s = i,
        o = n[++r]
      tE(s) ? t.setProperty(e, s, o) : t.setAttribute(e, s, o), r++
    }
  }
  return r
}
function eE(t) {
  return t === 3 || t === 4 || t === 6
}
function tE(t) {
  return t.charCodeAt(0) === 64
}
function Jc(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice()
    else {
      let n = -1
      for (let r = 0; r < e.length; r++) {
        let i = e[r]
        typeof i == 'number'
          ? (n = i)
          : n === 0 ||
            (n === -1 || n === 2
              ? Wf(t, n, i, null, e[++r])
              : Wf(t, n, i, null, null))
      }
    }
  return t
}
function Wf(t, e, n, r, i) {
  let s = 0,
    o = t.length
  if (e === -1) o = -1
  else
    for (; s < t.length; ) {
      let a = t[s++]
      if (typeof a == 'number') {
        if (a === e) {
          o = -1
          break
        } else if (a > e) {
          o = s - 1
          break
        }
      }
    }
  for (; s < t.length; ) {
    let a = t[s]
    if (typeof a == 'number') break
    if (a === n) {
      if (r === null) {
        i !== null && (t[s + 1] = i)
        return
      } else if (r === t[s + 1]) {
        t[s + 2] = i
        return
      }
    }
    s++, r !== null && s++, i !== null && s++
  }
  o !== -1 && (t.splice(o, 0, e), (s = o + 1)),
    t.splice(s++, 0, n),
    r !== null && t.splice(s++, 0, r),
    i !== null && t.splice(s++, 0, i)
}
var Np = 'ng-template'
function nE(t, e, n) {
  let r = 0,
    i = !0
  for (; r < t.length; ) {
    let s = t[r++]
    if (typeof s == 'string' && i) {
      let o = t[r++]
      if (n && s === 'class' && Sp(o.toLowerCase(), e, 0) !== -1) return !0
    } else if (s === 1) {
      for (; r < t.length && typeof (s = t[r++]) == 'string'; )
        if (s.toLowerCase() === e) return !0
      return !1
    } else typeof s == 'number' && (i = !1)
  }
  return !1
}
function Rp(t) {
  return t.type === 4 && t.value !== Np
}
function rE(t, e, n) {
  let r = t.type === 4 && !n ? Np : t.value
  return e === r
}
function iE(t, e, n) {
  let r = 4,
    i = t.attrs || [],
    s = aE(i),
    o = !1
  for (let a = 0; a < e.length; a++) {
    let c = e[a]
    if (typeof c == 'number') {
      if (!o && !ke(r) && !ke(c)) return !1
      if (o && ke(c)) continue
      ;(o = !1), (r = c | (r & 1))
      continue
    }
    if (!o)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== '' && !rE(t, c, n)) || (c === '' && e.length === 1))
        ) {
          if (ke(r)) return !1
          o = !0
        }
      } else {
        let u = r & 8 ? c : e[++a]
        if (r & 8 && t.attrs !== null) {
          if (!nE(t.attrs, u, n)) {
            if (ke(r)) return !1
            o = !0
          }
          continue
        }
        let l = r & 8 ? 'class' : c,
          d = sE(l, i, Rp(t), n)
        if (d === -1) {
          if (ke(r)) return !1
          o = !0
          continue
        }
        if (u !== '') {
          let h
          d > s ? (h = '') : (h = i[d + 1].toLowerCase())
          let f = r & 8 ? h : null
          if ((f && Sp(f, u, 0) !== -1) || (r & 2 && u !== h)) {
            if (ke(r)) return !1
            o = !0
          }
        }
      }
  }
  return ke(r) || o
}
function ke(t) {
  return (t & 1) === 0
}
function sE(t, e, n, r) {
  if (e === null) return -1
  let i = 0
  if (r || !n) {
    let s = !1
    for (; i < e.length; ) {
      let o = e[i]
      if (o === t) return i
      if (o === 3 || o === 6) s = !0
      else if (o === 1 || o === 2) {
        let a = e[++i]
        for (; typeof a == 'string'; ) a = e[++i]
        continue
      } else {
        if (o === 4) break
        if (o === 0) {
          i += 4
          continue
        }
      }
      i += s ? 1 : 2
    }
    return -1
  } else return cE(e, t)
}
function oE(t, e, n = !1) {
  for (let r = 0; r < e.length; r++) if (iE(t, e[r], n)) return !0
  return !1
}
function aE(t) {
  for (let e = 0; e < t.length; e++) {
    let n = t[e]
    if (eE(n)) return e
  }
  return t.length
}
function cE(t, e) {
  let n = t.indexOf(4)
  if (n > -1)
    for (n++; n < t.length; ) {
      let r = t[n]
      if (typeof r == 'number') return -1
      if (r === e) return n
      n++
    }
  return -1
}
function Kf(t, e) {
  return t ? ':not(' + e.trim() + ')' : e
}
function uE(t) {
  let e = t[0],
    n = 1,
    r = 2,
    i = '',
    s = !1
  for (; n < t.length; ) {
    let o = t[n]
    if (typeof o == 'string')
      if (r & 2) {
        let a = t[++n]
        i += '[' + o + (a.length > 0 ? '="' + a + '"' : '') + ']'
      } else r & 8 ? (i += '.' + o) : r & 4 && (i += ' ' + o)
    else
      i !== '' && !ke(o) && ((e += Kf(s, i)), (i = '')),
        (r = o),
        (s = s || !ke(r))
    n++
  }
  return i !== '' && (e += Kf(s, i)), e
}
function lE(t) {
  return t.map(uE).join(',')
}
function dE(t) {
  let e = [],
    n = [],
    r = 1,
    i = 2
  for (; r < t.length; ) {
    let s = t[r]
    if (typeof s == 'string')
      i === 2 ? s !== '' && e.push(s, t[++r]) : i === 8 && n.push(s)
    else {
      if (!ke(i)) break
      i = s
    }
    r++
  }
  return { attrs: e, classes: n }
}
function Hs(t) {
  return $s(() => {
    let e = Op(t),
      n = lt(We({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Ap.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || Ze.Emulated,
        styles: t.styles || Le,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: '',
      })
    kp(n)
    let r = t.dependencies
    return (
      (n.directiveDefs = Yf(r, !1)), (n.pipeDefs = Yf(r, !0)), (n.id = gE(n)), n
    )
  })
}
function hE(t) {
  return Hn(t) || Mp(t)
}
function fE(t) {
  return t !== null
}
function sn(t) {
  return $s(() => ({
    type: t.type,
    bootstrap: t.bootstrap || Le,
    declarations: t.declarations || Le,
    imports: t.imports || Le,
    exports: t.exports || Le,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }))
}
function Qf(t, e) {
  if (t == null) return Fr
  let n = {}
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let i = t[r],
        s,
        o,
        a = Yt.None
      Array.isArray(i)
        ? ((a = i[0]), (s = i[1]), (o = i[2] ?? s))
        : ((s = i), (o = i)),
        e ? ((n[s] = a !== Yt.None ? [r, a] : r), (e[s] = o)) : (n[s] = r)
    }
  return n
}
function xp(t) {
  return $s(() => {
    let e = Op(t)
    return kp(e), e
  })
}
function Hn(t) {
  return t[OI] || null
}
function Mp(t) {
  return t[kI] || null
}
function Pp(t) {
  return t[FI] || null
}
function pE(t) {
  let e = Hn(t) || Mp(t) || Pp(t)
  return e !== null ? e.standalone : !1
}
function Op(t) {
  let e = {}
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || Fr,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || Le,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Qf(t.inputs, e),
    outputs: Qf(t.outputs),
    debugInfo: null,
  }
}
function kp(t) {
  t.features?.forEach((e) => e(t))
}
function Yf(t, e) {
  if (!t) return null
  let n = e ? Pp : hE
  return () => (typeof t == 'function' ? t() : t).map((r) => n(r)).filter(fE)
}
function gE(t) {
  let e = 0,
    n = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join('|')
  for (let i of n) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0
  return (e += 2147483648), 'c' + e
}
var gt = 0,
  x = 1,
  C = 2,
  pe = 3,
  Ve = 4,
  je = 5,
  Cs = 6,
  Lr = 7,
  Ue = 8,
  qn = 9,
  dt = 10,
  De = 11,
  Vr = 12,
  Jf = 13,
  Wn = 14,
  ht = 15,
  qs = 16,
  Vn = 17,
  Ur = 18,
  zs = 19,
  Fp = 20,
  Or = 21,
  sc = 22,
  Jt = 23,
  At = 25,
  Lp = 1
var Zt = 7,
  bs = 8,
  As = 9,
  Se = 10,
  Zc = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      t
    )
  })(Zc || {})
function Bn(t) {
  return Array.isArray(t) && typeof t[Lp] == 'object'
}
function mt(t) {
  return Array.isArray(t) && t[Lp] === !0
}
function Vp(t) {
  return (t.flags & 4) !== 0
}
function Xc(t) {
  return t.componentOffset > -1
}
function eu(t) {
  return (t.flags & 1) === 1
}
function Qr(t) {
  return !!t.template
}
function mE(t) {
  return (t[C] & 512) !== 0
}
function jr(t, e) {
  let n = t.hasOwnProperty(Bf)
  return n ? t[Bf] : null
}
var wc = class {
  constructor(e, n, r) {
    ;(this.previousValue = e), (this.currentValue = n), (this.firstChange = r)
  }
  isFirstChange() {
    return this.firstChange
  }
}
function Up(t, e, n, r) {
  e !== null ? e.applyValueToInputSignal(e, r) : (t[n] = r)
}
function jp() {
  return Bp
}
function Bp(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = vE), yE
}
jp.ngInherit = !0
function yE() {
  let t = Hp(this),
    e = t?.current
  if (e) {
    let n = t.previous
    if (n === Fr) t.previous = e
    else for (let r in e) n[r] = e[r]
    ;(t.current = null), this.ngOnChanges(e)
  }
}
function vE(t, e, n, r, i) {
  let s = this.declaredInputs[r],
    o = Hp(t) || _E(t, { previous: Fr, current: null }),
    a = o.current || (o.current = {}),
    c = o.previous,
    u = c[s]
  ;(a[s] = new wc(u && u.currentValue, n, c === Fr)), Up(t, e, i, n)
}
var $p = '__ngSimpleChanges__'
function Hp(t) {
  return t[$p] || null
}
function _E(t, e) {
  return (t[$p] = e)
}
var Zf = null
var Ye = function (t, e, n) {
    Zf?.(t, e, n)
  },
  IE = 'svg',
  EE = 'math',
  wE = !1
function DE() {
  return wE
}
function Xe(t) {
  for (; Array.isArray(t); ) t = t[gt]
  return t
}
function TE(t, e) {
  return Xe(e[t])
}
function Be(t, e) {
  return Xe(e[t.index])
}
function qp(t, e) {
  return t.data[e]
}
function Kn(t, e) {
  let n = e[t]
  return Bn(n) ? n : n[gt]
}
function tu(t) {
  return (t[C] & 128) === 128
}
function CE(t) {
  return mt(t[pe])
}
function Ss(t, e) {
  return e == null ? null : t[e]
}
function zp(t) {
  t[Vn] = 0
}
function bE(t) {
  t[C] & 1024 || ((t[C] |= 1024), tu(t) && Br(t))
}
function AE(t, e) {
  for (; t > 0; ) (e = e[Wn]), t--
  return e
}
function Gp(t) {
  return t[C] & 9216 || t[Jt]?.dirty
}
function Dc(t) {
  Gp(t)
    ? Br(t)
    : t[C] & 64 &&
      (DE()
        ? ((t[C] |= 1024), Br(t))
        : t[dt].changeDetectionScheduler?.notify())
}
function Br(t) {
  t[dt].changeDetectionScheduler?.notify()
  let e = $r(t)
  for (; e !== null && !(e[C] & 8192 || ((e[C] |= 8192), !tu(e))); ) e = $r(e)
}
function SE(t, e) {
  if ((t[C] & 256) === 256) throw new H(911, !1)
  t[Or] === null && (t[Or] = []), t[Or].push(e)
}
function $r(t) {
  let e = t[pe]
  return mt(e) ? e[pe] : e
}
var S = { lFrame: tg(null), bindingsEnabled: !0, skipHydrationRootTNode: null }
function NE() {
  return S.lFrame.elementDepthCount
}
function RE() {
  S.lFrame.elementDepthCount++
}
function xE() {
  S.lFrame.elementDepthCount--
}
function Wp() {
  return S.bindingsEnabled
}
function ME() {
  return S.skipHydrationRootTNode !== null
}
function PE(t) {
  return S.skipHydrationRootTNode === t
}
function OE() {
  S.skipHydrationRootTNode = null
}
function ge() {
  return S.lFrame.lView
}
function Nt() {
  return S.lFrame.tView
}
function Kp(t) {
  return (S.lFrame.contextLView = t), t[Ue]
}
function Qp(t) {
  return (S.lFrame.contextLView = null), t
}
function yt() {
  let t = Yp()
  for (; t !== null && t.type === 64; ) t = t.parent
  return t
}
function Yp() {
  return S.lFrame.currentTNode
}
function kE() {
  let t = S.lFrame,
    e = t.currentTNode
  return t.isParent ? e : e.parent
}
function Yr(t, e) {
  let n = S.lFrame
  ;(n.currentTNode = t), (n.isParent = e)
}
function Jp() {
  return S.lFrame.isParent
}
function FE() {
  S.lFrame.isParent = !1
}
function LE(t) {
  return (S.lFrame.bindingIndex = t)
}
function VE() {
  return S.lFrame.bindingIndex++
}
function UE(t) {
  let e = S.lFrame,
    n = e.bindingIndex
  return (e.bindingIndex = e.bindingIndex + t), n
}
function jE() {
  return S.lFrame.inI18n
}
function BE(t, e) {
  let n = S.lFrame
  ;(n.bindingIndex = n.bindingRootIndex = t), Tc(e)
}
function $E() {
  return S.lFrame.currentDirectiveIndex
}
function Tc(t) {
  S.lFrame.currentDirectiveIndex = t
}
function HE(t) {
  let e = S.lFrame.currentDirectiveIndex
  return e === -1 ? null : t[e]
}
function Zp(t) {
  S.lFrame.currentQueryIndex = t
}
function qE(t) {
  let e = t[x]
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[je] : null
}
function Xp(t, e, n) {
  if (n & R.SkipSelf) {
    let i = e,
      s = t
    for (; (i = i.parent), i === null && !(n & R.Host); )
      if (((i = qE(s)), i === null || ((s = s[Wn]), i.type & 10))) break
    if (i === null) return !1
    ;(e = i), (t = s)
  }
  let r = (S.lFrame = eg())
  return (r.currentTNode = e), (r.lView = t), !0
}
function nu(t) {
  let e = eg(),
    n = t[x]
  ;(S.lFrame = e),
    (e.currentTNode = n.firstChild),
    (e.lView = t),
    (e.tView = n),
    (e.contextLView = t),
    (e.bindingIndex = n.bindingStartIndex),
    (e.inI18n = !1)
}
function eg() {
  let t = S.lFrame,
    e = t === null ? null : t.child
  return e === null ? tg(t) : e
}
function tg(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  }
  return t !== null && (t.child = e), e
}
function ng() {
  let t = S.lFrame
  return (S.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t
}
var rg = ng
function ru() {
  let t = ng()
  ;(t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0)
}
function zE(t) {
  return (S.lFrame.contextLView = AE(t, S.lFrame.contextLView))[Ue]
}
function Jr() {
  return S.lFrame.selectedIndex
}
function Xt(t) {
  S.lFrame.selectedIndex = t
}
function GE() {
  let t = S.lFrame
  return qp(t.tView, t.selectedIndex)
}
function WE() {
  return S.lFrame.currentNamespace
}
var ig = !0
function iu() {
  return ig
}
function su(t) {
  ig = t
}
function KE(t, e, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: s } = e.type.prototype
  if (r) {
    let o = Bp(e)
    ;(n.preOrderHooks ??= []).push(t, o),
      (n.preOrderCheckHooks ??= []).push(t, o)
  }
  i && (n.preOrderHooks ??= []).push(0 - t, i),
    s &&
      ((n.preOrderHooks ??= []).push(t, s),
      (n.preOrderCheckHooks ??= []).push(t, s))
}
function ou(t, e) {
  for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
    let s = t.data[n].type.prototype,
      {
        ngAfterContentInit: o,
        ngAfterContentChecked: a,
        ngAfterViewInit: c,
        ngAfterViewChecked: u,
        ngOnDestroy: l,
      } = s
    o && (t.contentHooks ??= []).push(-n, o),
      a &&
        ((t.contentHooks ??= []).push(n, a),
        (t.contentCheckHooks ??= []).push(n, a)),
      c && (t.viewHooks ??= []).push(-n, c),
      u &&
        ((t.viewHooks ??= []).push(n, u), (t.viewCheckHooks ??= []).push(n, u)),
      l != null && (t.destroyHooks ??= []).push(n, l)
  }
}
function _s(t, e, n) {
  sg(t, e, 3, n)
}
function Is(t, e, n, r) {
  ;(t[C] & 3) === n && sg(t, e, n, r)
}
function oc(t, e) {
  let n = t[C]
  ;(n & 3) === e && ((n &= 16383), (n += 1), (t[C] = n))
}
function sg(t, e, n, r) {
  let i = r !== void 0 ? t[Vn] & 65535 : 0,
    s = r ?? -1,
    o = e.length - 1,
    a = 0
  for (let c = i; c < o; c++)
    if (typeof e[c + 1] == 'number') {
      if (((a = e[c]), r != null && a >= r)) break
    } else
      e[c] < 0 && (t[Vn] += 65536),
        (a < s || s == -1) &&
          (QE(t, n, e, c), (t[Vn] = (t[Vn] & 4294901760) + c + 2)),
        c++
}
function Xf(t, e) {
  Ye(4, t, e)
  let n = Ce(null)
  try {
    e.call(t)
  } finally {
    Ce(n), Ye(5, t, e)
  }
}
function QE(t, e, n, r) {
  let i = n[r] < 0,
    s = n[r + 1],
    o = i ? -n[r] : n[r],
    a = t[o]
  i
    ? t[C] >> 14 < t[Vn] >> 16 &&
      (t[C] & 3) === e &&
      ((t[C] += 16384), Xf(a, s))
    : Xf(a, s)
}
var $n = -1,
  Hr = class {
    constructor(e, n, r) {
      ;(this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r)
    }
  }
function YE(t) {
  return t instanceof Hr
}
function JE(t) {
  return (t.flags & 8) !== 0
}
function ZE(t) {
  return (t.flags & 16) !== 0
}
function og(t) {
  return t !== $n
}
function Ns(t) {
  return t & 32767
}
function XE(t) {
  return t >> 16
}
function Rs(t, e) {
  let n = XE(t),
    r = e
  for (; n > 0; ) (r = r[Wn]), n--
  return r
}
var Cc = !0
function ep(t) {
  let e = Cc
  return (Cc = t), e
}
var ew = 256,
  ag = ew - 1,
  cg = 5,
  tw = 0,
  Je = {}
function nw(t, e, n) {
  let r
  typeof n == 'string'
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(xr) && (r = n[xr]),
    r == null && (r = n[xr] = tw++)
  let i = r & ag,
    s = 1 << i
  e.data[t + (i >> cg)] |= s
}
function ug(t, e) {
  let n = lg(t, e)
  if (n !== -1) return n
  let r = e[x]
  r.firstCreatePass &&
    ((t.injectorIndex = e.length),
    ac(r.data, t),
    ac(e, null),
    ac(r.blueprint, null))
  let i = au(t, e),
    s = t.injectorIndex
  if (og(i)) {
    let o = Ns(i),
      a = Rs(i, e),
      c = a[x].data
    for (let u = 0; u < 8; u++) e[s + u] = a[o + u] | c[o + u]
  }
  return (e[s + 8] = i), s
}
function ac(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e)
}
function lg(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex
}
function au(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex
  let n = 0,
    r = null,
    i = e
  for (; i !== null; ) {
    if (((r = gg(i)), r === null)) return $n
    if ((n++, (i = i[Wn]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16)
  }
  return $n
}
function rw(t, e, n) {
  nw(t, e, n)
}
function dg(t, e, n) {
  if (n & R.Optional || t !== void 0) return t
  Qc(e, 'NodeInjector')
}
function hg(t, e, n, r) {
  if (
    (n & R.Optional && r === void 0 && (r = null), !(n & (R.Self | R.Host)))
  ) {
    let i = t[qn],
      s = Qe(void 0)
    try {
      return i ? i.get(e, r, n & R.Optional) : bp(e, r, n & R.Optional)
    } finally {
      Qe(s)
    }
  }
  return dg(r, e, n)
}
function fg(t, e, n, r = R.Default, i) {
  if (t !== null) {
    if (e[C] & 2048 && !(r & R.Self)) {
      let o = cw(t, e, n, r, Je)
      if (o !== Je) return o
    }
    let s = pg(t, e, n, r, Je)
    if (s !== Je) return s
  }
  return hg(e, n, r, i)
}
function pg(t, e, n, r, i) {
  let s = ow(n)
  if (typeof s == 'function') {
    if (!Xp(e, t, r)) return r & R.Host ? dg(i, n, r) : hg(e, n, r, i)
    try {
      let o
      if (((o = s(r)), o == null && !(r & R.Optional))) Qc(n)
      else return o
    } finally {
      rg()
    }
  } else if (typeof s == 'number') {
    let o = null,
      a = lg(t, e),
      c = $n,
      u = r & R.Host ? e[ht][je] : null
    for (
      (a === -1 || r & R.SkipSelf) &&
      ((c = a === -1 ? au(t, e) : e[a + 8]),
      c === $n || !np(r, !1)
        ? (a = -1)
        : ((o = e[x]), (a = Ns(c)), (e = Rs(c, e))));
      a !== -1;

    ) {
      let l = e[x]
      if (tp(s, a, l.data)) {
        let d = iw(a, e, n, o, r, u)
        if (d !== Je) return d
      }
      ;(c = e[a + 8]),
        c !== $n && np(r, e[x].data[a + 8] === u) && tp(s, a, e)
          ? ((o = l), (a = Ns(c)), (e = Rs(c, e)))
          : (a = -1)
    }
  }
  return i
}
function iw(t, e, n, r, i, s) {
  let o = e[x],
    a = o.data[t + 8],
    c = r == null ? Xc(a) && Cc : r != o && (a.type & 3) !== 0,
    u = i & R.Host && s === a,
    l = sw(a, o, n, c, u)
  return l !== null ? qr(e, o, l, a) : Je
}
function sw(t, e, n, r, i) {
  let s = t.providerIndexes,
    o = e.data,
    a = s & 1048575,
    c = t.directiveStart,
    u = t.directiveEnd,
    l = s >> 20,
    d = r ? a : a + l,
    h = i ? a + l : u
  for (let f = d; f < h; f++) {
    let _ = o[f]
    if ((f < c && n === _) || (f >= c && _.type === n)) return f
  }
  if (i) {
    let f = o[c]
    if (f && Qr(f) && f.type === n) return c
  }
  return null
}
function qr(t, e, n, r) {
  let i = t[n],
    s = e.data
  if (YE(i)) {
    let o = i
    o.resolving && UI(VI(s[n]))
    let a = ep(o.canSeeViewProviders)
    o.resolving = !0
    let c,
      u = o.injectImpl ? Qe(o.injectImpl) : null,
      l = Xp(t, r, R.Default)
    try {
      ;(i = t[n] = o.factory(void 0, s, t, r)),
        e.firstCreatePass && n >= r.directiveStart && KE(n, s[n], e)
    } finally {
      u !== null && Qe(u), ep(a), (o.resolving = !1), rg()
    }
  }
  return i
}
function ow(t) {
  if (typeof t == 'string') return t.charCodeAt(0) || 0
  let e = t.hasOwnProperty(xr) ? t[xr] : void 0
  return typeof e == 'number' ? (e >= 0 ? e & ag : aw) : e
}
function tp(t, e, n) {
  let r = 1 << t
  return !!(n[e + (t >> cg)] & r)
}
function np(t, e) {
  return !(t & R.Self) && !(t & R.Host && e)
}
var Qt = class {
  constructor(e, n) {
    ;(this._tNode = e), (this._lView = n)
  }
  get(e, n, r) {
    return fg(this._tNode, this._lView, e, Bs(r), n)
  }
}
function aw() {
  return new Qt(yt(), ge())
}
function cw(t, e, n, r, i) {
  let s = t,
    o = e
  for (; s !== null && o !== null && o[C] & 2048 && !(o[C] & 512); ) {
    let a = pg(s, o, n, r | R.Self, Je)
    if (a !== Je) return a
    let c = s.parent
    if (!c) {
      let u = o[Fp]
      if (u) {
        let l = u.get(n, Je, r)
        if (l !== Je) return l
      }
      ;(c = gg(o)), (o = o[Wn])
    }
    s = c
  }
  return i
}
function gg(t) {
  let e = t[x],
    n = e.type
  return n === 2 ? e.declTNode : n === 1 ? t[je] : null
}
var ys = '__parameters__'
function uw(t) {
  return function (...n) {
    if (t) {
      let r = t(...n)
      for (let i in r) this[i] = r[i]
    }
  }
}
function lw(t, e, n) {
  return $s(() => {
    let r = uw(e)
    function i(...s) {
      if (this instanceof i) return r.apply(this, s), this
      let o = new i(...s)
      return (a.annotation = o), a
      function a(c, u, l) {
        let d = c.hasOwnProperty(ys)
          ? c[ys]
          : Object.defineProperty(c, ys, { value: [] })[ys]
        for (; d.length <= l; ) d.push(null)
        return (d[l] = d[l] || []).push(o), c
      }
    }
    return (
      n && (i.prototype = Object.create(n.prototype)),
      (i.prototype.ngMetadataName = t),
      (i.annotationCls = i),
      i
    )
  })
}
function dw(t) {
  return typeof t == 'function'
}
function cu(t, e) {
  t.forEach((n) => (Array.isArray(n) ? cu(n, e) : e(n)))
}
function mg(t, e, n) {
  e >= t.length ? t.push(n) : t.splice(e, 0, n)
}
function xs(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0]
}
function hw(t, e, n, r) {
  let i = t.length
  if (i == e) t.push(n, r)
  else if (i === 1) t.push(r, t[0]), (t[0] = n)
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let s = i - 2
      ;(t[i] = t[s]), i--
    }
    ;(t[e] = n), (t[e + 1] = r)
  }
}
function fw(t, e, n) {
  let r = Zr(t, e)
  return r >= 0 ? (t[r | 1] = n) : ((r = ~r), hw(t, r, e, n)), r
}
function cc(t, e) {
  let n = Zr(t, e)
  if (n >= 0) return t[n | 1]
}
function Zr(t, e) {
  return pw(t, e, 1)
}
function pw(t, e, n) {
  let r = 0,
    i = t.length >> n
  for (; i !== r; ) {
    let s = r + ((i - r) >> 1),
      o = t[s << n]
    if (e === o) return s << n
    o > e ? (i = s) : (r = s + 1)
  }
  return ~(i << n)
}
var vt = YI(lw('Optional'), 8)
var zr = new q('ENVIRONMENT_INITIALIZER'),
  yg = new q('INJECTOR', -1),
  vg = new q('INJECTOR_DEF_TYPES'),
  Ms = class {
    get(e, n = kr) {
      if (n === kr) {
        let r = new Error(`NullInjectorError: No provider for ${be(e)}!`)
        throw ((r.name = 'NullInjectorError'), r)
      }
      return n
    }
  }
function _g(t) {
  return { ɵproviders: t }
}
function Gs(...t) {
  return { ɵproviders: Ig(!0, t), ɵfromNgModule: !0 }
}
function Ig(t, ...e) {
  let n = [],
    r = new Set(),
    i,
    s = (o) => {
      n.push(o)
    }
  return (
    cu(e, (o) => {
      let a = o
      bc(a, s, [], r) && ((i ||= []), i.push(a))
    }),
    i !== void 0 && Eg(i, s),
    n
  )
}
function Eg(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { ngModule: r, providers: i } = t[n]
    uu(i, (s) => {
      e(s, r)
    })
  }
}
function bc(t, e, n, r) {
  if (((t = Fe(t)), !t)) return !1
  let i = null,
    s = qf(t),
    o = !s && Hn(t)
  if (!s && !o) {
    let c = t.ngModule
    if (((s = qf(c)), s)) i = c
    else return !1
  } else {
    if (o && !o.standalone) return !1
    i = t
  }
  let a = r.has(i)
  if (o) {
    if (a) return !1
    if ((r.add(i), o.dependencies)) {
      let c =
        typeof o.dependencies == 'function' ? o.dependencies() : o.dependencies
      for (let u of c) bc(u, e, n, r)
    }
  } else if (s) {
    if (s.imports != null && !a) {
      r.add(i)
      let u
      try {
        cu(s.imports, (l) => {
          bc(l, e, n, r) && ((u ||= []), u.push(l))
        })
      } finally {
      }
      u !== void 0 && Eg(u, e)
    }
    if (!a) {
      let u = jr(i) || (() => new i())
      e({ provide: i, useFactory: u, deps: Le }, i),
        e({ provide: vg, useValue: i, multi: !0 }, i),
        e({ provide: zr, useValue: () => k(i), multi: !0 }, i)
    }
    let c = s.providers
    if (c != null && !a) {
      let u = t
      uu(c, (l) => {
        e(l, u)
      })
    }
  } else return !1
  return i !== t && t.providers !== void 0
}
function uu(t, e) {
  for (let n of t)
    Dp(n) && (n = n.ɵproviders), Array.isArray(n) ? uu(n, e) : e(n)
}
var gw = G({ provide: String, useValue: G })
function wg(t) {
  return t !== null && typeof t == 'object' && gw in t
}
function mw(t) {
  return !!(t && t.useExisting)
}
function yw(t) {
  return !!(t && t.useFactory)
}
function Ac(t) {
  return typeof t == 'function'
}
var Ws = new q('Set Injector scope.'),
  Es = {},
  vw = {},
  uc
function lu() {
  return uc === void 0 && (uc = new Ms()), uc
}
var St = class {},
  Ps = class extends St {
    get destroyed() {
      return this._destroyed
    }
    constructor(e, n, r, i) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        Nc(e, (o) => this.processProvider(o)),
        this.records.set(yg, Un(void 0, this)),
        i.has('environment') && this.records.set(St, Un(void 0, this))
      let s = this.records.get(Ws)
      s != null && typeof s.value == 'string' && this.scopes.add(s.value),
        (this.injectorDefTypes = new Set(this.get(vg, Le, R.Self)))
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0)
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy()
        let e = this._onDestroyHooks
        this._onDestroyHooks = []
        for (let n of e) n()
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear()
      }
    }
    onDestroy(e) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(e),
        () => this.removeOnDestroy(e)
      )
    }
    runInContext(e) {
      this.assertNotDestroyed()
      let n = Ln(this),
        r = Qe(void 0),
        i
      try {
        return e()
      } finally {
        Ln(n), Qe(r)
      }
    }
    get(e, n = kr, r = R.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty($f))) return e[$f](this)
      r = Bs(r)
      let i,
        s = Ln(this),
        o = Qe(void 0)
      try {
        if (!(r & R.SkipSelf)) {
          let c = this.records.get(e)
          if (c === void 0) {
            let u = Tw(e) && Yc(e)
            u && this.injectableDefInScope(u)
              ? (c = Un(Sc(e), Es))
              : (c = null),
              this.records.set(e, c)
          }
          if (c != null) return this.hydrate(e, c)
        }
        let a = r & R.Self ? lu() : this.parent
        return (n = r & R.Optional && n === kr ? null : n), a.get(e, n)
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[Ts] = a[Ts] || []).unshift(be(e)), s)) throw a
          return ZI(a, e, 'R3InjectorError', this.source)
        } else throw a
      } finally {
        Qe(o), Ln(s)
      }
    }
    resolveInjectorInitializers() {
      let e = Ln(this),
        n = Qe(void 0),
        r
      try {
        let i = this.get(zr, Le, R.Self)
        for (let s of i) s()
      } finally {
        Ln(e), Qe(n)
      }
    }
    toString() {
      let e = [],
        n = this.records
      for (let r of n.keys()) e.push(be(r))
      return `R3Injector[${e.join(', ')}]`
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new H(205, !1)
    }
    processProvider(e) {
      e = Fe(e)
      let n = Ac(e) ? e : Fe(e && e.provide),
        r = Iw(e)
      if (!Ac(e) && e.multi === !0) {
        let i = this.records.get(n)
        i ||
          ((i = Un(void 0, Es, !0)),
          (i.factory = () => Ic(i.multi)),
          this.records.set(n, i)),
          (n = e),
          i.multi.push(e)
      }
      this.records.set(n, r)
    }
    hydrate(e, n) {
      return (
        n.value === Es && ((n.value = vw), (n.value = n.factory())),
        typeof n.value == 'object' &&
          n.value &&
          Dw(n.value) &&
          this._ngOnDestroyHooks.add(n.value),
        n.value
      )
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1
      let n = Fe(e.providedIn)
      return typeof n == 'string'
        ? n === 'any' || this.scopes.has(n)
        : this.injectorDefTypes.has(n)
    }
    removeOnDestroy(e) {
      let n = this._onDestroyHooks.indexOf(e)
      n !== -1 && this._onDestroyHooks.splice(n, 1)
    }
  }
function Sc(t) {
  let e = Yc(t),
    n = e !== null ? e.factory : jr(t)
  if (n !== null) return n
  if (t instanceof q) throw new H(204, !1)
  if (t instanceof Function) return _w(t)
  throw new H(204, !1)
}
function _w(t) {
  if (t.length > 0) throw new H(204, !1)
  let n = $I(t)
  return n !== null ? () => n.factory(t) : () => new t()
}
function Iw(t) {
  if (wg(t)) return Un(void 0, t.useValue)
  {
    let e = Ew(t)
    return Un(e, Es)
  }
}
function Ew(t, e, n) {
  let r
  if (Ac(t)) {
    let i = Fe(t)
    return jr(i) || Sc(i)
  } else if (wg(t)) r = () => Fe(t.useValue)
  else if (yw(t)) r = () => t.useFactory(...Ic(t.deps || []))
  else if (mw(t)) r = () => k(Fe(t.useExisting))
  else {
    let i = Fe(t && (t.useClass || t.provide))
    if (ww(t)) r = () => new i(...Ic(t.deps))
    else return jr(i) || Sc(i)
  }
  return r
}
function Un(t, e, n = !1) {
  return { factory: t, value: e, multi: n ? [] : void 0 }
}
function ww(t) {
  return !!t.deps
}
function Dw(t) {
  return (
    t !== null && typeof t == 'object' && typeof t.ngOnDestroy == 'function'
  )
}
function Tw(t) {
  return typeof t == 'function' || (typeof t == 'object' && t instanceof q)
}
function Nc(t, e) {
  for (let n of t)
    Array.isArray(n) ? Nc(n, e) : n && Dp(n) ? Nc(n.ɵproviders, e) : e(n)
}
function rp(t, e = null, n = null, r) {
  let i = Cw(t, e, n, r)
  return i.resolveInjectorInitializers(), i
}
function Cw(t, e = null, n = null, r, i = new Set()) {
  let s = [n || Le, Gs(t)]
  return (
    (r = r || (typeof t == 'object' ? void 0 : be(t))),
    new Ps(s, e || lu(), r || null, i)
  )
}
var Rt = (() => {
  let e = class e {
    static create(r, i) {
      if (Array.isArray(r)) return rp({ name: '' }, i, r, '')
      {
        let s = r.name ?? ''
        return rp({ name: s }, r.parent, r.providers, s)
      }
    }
  }
  ;(e.THROW_IF_NOT_FOUND = kr),
    (e.NULL = new Ms()),
    (e.ɵprov = K({ token: e, providedIn: 'any', factory: () => k(yg) })),
    (e.__NG_ELEMENT_ID__ = -1)
  let t = e
  return t
})()
var Rc
function Dg(t) {
  Rc = t
}
function bw() {
  if (Rc !== void 0) return Rc
  if (typeof document < 'u') return document
  throw new H(210, !1)
}
var du = new q('AppId', { providedIn: 'root', factory: () => Aw }),
  Aw = 'ng',
  hu = new q('Platform Initializer'),
  xt = new q('Platform ID', {
    providedIn: 'platform',
    factory: () => 'unknown',
  })
var fu = new q('CSP nonce', {
  providedIn: 'root',
  factory: () =>
    bw().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
    null,
})
function Tg(t) {
  return (t.flags & 128) === 128
}
var ft = (function (t) {
  return (
    (t[(t.Important = 1)] = 'Important'), (t[(t.DashCase = 2)] = 'DashCase'), t
  )
})(ft || {})
var Cg = new Map(),
  Sw = 0
function Nw() {
  return Sw++
}
function Rw(t) {
  Cg.set(t[zs], t)
}
function xw(t) {
  Cg.delete(t[zs])
}
var ip = '__ngContext__'
function en(t, e) {
  Bn(e) ? ((t[ip] = e[zs]), Rw(e)) : (t[ip] = e)
}
var Mw
function pu(t, e) {
  return Mw(t, e)
}
function jn(t, e, n, r, i) {
  if (r != null) {
    let s,
      o = !1
    mt(r) ? (s = r) : Bn(r) && ((o = !0), (r = r[gt]))
    let a = Xe(r)
    t === 0 && n !== null
      ? i == null
        ? Rg(e, n, a)
        : Os(e, n, a, i || null, !0)
      : t === 1 && n !== null
        ? Os(e, n, a, i || null, !0)
        : t === 2
          ? Kw(e, a, o)
          : t === 3 && e.destroyNode(a),
      s != null && Yw(e, t, s, n, i)
  }
}
function Pw(t, e) {
  return t.createText(e)
}
function bg(t, e, n) {
  return t.createElement(e, n)
}
function Ow(t, e) {
  Ag(t, e), (e[gt] = null), (e[je] = null)
}
function kw(t, e, n, r, i, s) {
  ;(r[gt] = i), (r[je] = e), Ks(t, r, n, 1, i, s)
}
function Ag(t, e) {
  e[dt].changeDetectionScheduler?.notify(), Ks(t, e, e[De], 2, null, null)
}
function Fw(t) {
  let e = t[Vr]
  if (!e) return lc(t[x], t)
  for (; e; ) {
    let n = null
    if (Bn(e)) n = e[Vr]
    else {
      let r = e[Se]
      r && (n = r)
    }
    if (!n) {
      for (; e && !e[Ve] && e !== t; ) Bn(e) && lc(e[x], e), (e = e[pe])
      e === null && (e = t), Bn(e) && lc(e[x], e), (n = e && e[Ve])
    }
    e = n
  }
}
function Lw(t, e, n, r) {
  let i = Se + r,
    s = n.length
  r > 0 && (n[i - 1][Ve] = e),
    r < s - Se
      ? ((e[Ve] = n[i]), mg(n, Se + r, e))
      : (n.push(e), (e[Ve] = null)),
    (e[pe] = n)
  let o = e[qs]
  o !== null && n !== o && Vw(o, e)
  let a = e[Ur]
  a !== null && a.insertView(t), Dc(e), (e[C] |= 128)
}
function Vw(t, e) {
  let n = t[As],
    i = e[pe][pe][ht]
  e[ht] !== i && (t[C] |= Zc.HasTransplantedViews),
    n === null ? (t[As] = [e]) : n.push(e)
}
function Sg(t, e) {
  let n = t[As],
    r = n.indexOf(e)
  n.splice(r, 1)
}
function xc(t, e) {
  if (t.length <= Se) return
  let n = Se + e,
    r = t[n]
  if (r) {
    let i = r[qs]
    i !== null && i !== t && Sg(i, r), e > 0 && (t[n - 1][Ve] = r[Ve])
    let s = xs(t, Se + e)
    Ow(r[x], r)
    let o = s[Ur]
    o !== null && o.detachView(s[x]),
      (r[pe] = null),
      (r[Ve] = null),
      (r[C] &= -129)
  }
  return r
}
function Ng(t, e) {
  if (!(e[C] & 256)) {
    let n = e[De]
    n.destroyNode && Ks(t, e, n, 3, null, null), Fw(e)
  }
}
function lc(t, e) {
  if (!(e[C] & 256)) {
    ;(e[C] &= -129),
      (e[C] |= 256),
      e[Jt] && Af(e[Jt]),
      jw(t, e),
      Uw(t, e),
      e[x].type === 1 && e[De].destroy()
    let n = e[qs]
    if (n !== null && mt(e[pe])) {
      n !== e[pe] && Sg(n, e)
      let r = e[Ur]
      r !== null && r.detachView(t)
    }
    xw(e)
  }
}
function Uw(t, e) {
  let n = t.cleanup,
    r = e[Lr]
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == 'string') {
        let o = n[s + 3]
        o >= 0 ? r[o]() : r[-o].unsubscribe(), (s += 2)
      } else {
        let o = r[n[s + 1]]
        n[s].call(o)
      }
  r !== null && (e[Lr] = null)
  let i = e[Or]
  if (i !== null) {
    e[Or] = null
    for (let s = 0; s < i.length; s++) {
      let o = i[s]
      o()
    }
  }
}
function jw(t, e) {
  let n
  if (t != null && (n = t.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = e[n[r]]
      if (!(i instanceof Hr)) {
        let s = n[r + 1]
        if (Array.isArray(s))
          for (let o = 0; o < s.length; o += 2) {
            let a = i[s[o]],
              c = s[o + 1]
            Ye(4, a, c)
            try {
              c.call(a)
            } finally {
              Ye(5, a, c)
            }
          }
        else {
          Ye(4, i, s)
          try {
            s.call(i)
          } finally {
            Ye(5, i, s)
          }
        }
      }
    }
}
function Bw(t, e, n) {
  return $w(t, e.parent, n)
}
function $w(t, e, n) {
  let r = e
  for (; r !== null && r.type & 40; ) (e = r), (r = e.parent)
  if (r === null) return n[gt]
  {
    let { componentOffset: i } = r
    if (i > -1) {
      let { encapsulation: s } = t.data[r.directiveStart + i]
      if (s === Ze.None || s === Ze.Emulated) return null
    }
    return Be(r, n)
  }
}
function Os(t, e, n, r, i) {
  t.insertBefore(e, n, r, i)
}
function Rg(t, e, n) {
  t.appendChild(e, n)
}
function sp(t, e, n, r, i) {
  r !== null ? Os(t, e, n, r, i) : Rg(t, e, n)
}
function Hw(t, e, n, r) {
  t.removeChild(e, n, r)
}
function gu(t, e) {
  return t.parentNode(e)
}
function qw(t, e) {
  return t.nextSibling(e)
}
function zw(t, e, n) {
  return Ww(t, e, n)
}
function Gw(t, e, n) {
  return t.type & 40 ? Be(t, n) : null
}
var Ww = Gw,
  op
function mu(t, e, n, r) {
  let i = Bw(t, r, e),
    s = e[De],
    o = r.parent || e[je],
    a = zw(o, r, e)
  if (i != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) sp(s, i, n[c], a, !1)
    else sp(s, i, n, a, !1)
  op !== void 0 && op(s, r, e, n, i)
}
function ws(t, e) {
  if (e !== null) {
    let n = e.type
    if (n & 3) return Be(e, t)
    if (n & 4) return Mc(-1, t[e.index])
    if (n & 8) {
      let r = e.child
      if (r !== null) return ws(t, r)
      {
        let i = t[e.index]
        return mt(i) ? Mc(-1, i) : Xe(i)
      }
    } else {
      if (n & 32) return pu(e, t)() || Xe(t[e.index])
      {
        let r = xg(t, e)
        if (r !== null) {
          if (Array.isArray(r)) return r[0]
          let i = $r(t[ht])
          return ws(i, r)
        } else return ws(t, e.next)
      }
    }
  }
  return null
}
function xg(t, e) {
  if (e !== null) {
    let r = t[ht][je],
      i = e.projection
    return r.projection[i]
  }
  return null
}
function Mc(t, e) {
  let n = Se + t + 1
  if (n < e.length) {
    let r = e[n],
      i = r[x].firstChild
    if (i !== null) return ws(r, i)
  }
  return e[Zt]
}
function Kw(t, e, n) {
  let r = gu(t, e)
  r && Hw(t, r, e, n)
}
function yu(t, e, n, r, i, s, o) {
  for (; n != null; ) {
    let a = r[n.index],
      c = n.type
    if (
      (o && e === 0 && (a && en(Xe(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) yu(t, e, n.child, r, i, s, !1), jn(e, t, i, a, s)
      else if (c & 32) {
        let u = pu(n, r),
          l
        for (; (l = u()); ) jn(e, t, i, l, s)
        jn(e, t, i, a, s)
      } else c & 16 ? Qw(t, e, r, n, i, s) : jn(e, t, i, a, s)
    n = o ? n.projectionNext : n.next
  }
}
function Ks(t, e, n, r, i, s) {
  yu(n, r, t.firstChild, e, i, s, !1)
}
function Qw(t, e, n, r, i, s) {
  let o = n[ht],
    c = o[je].projection[r.projection]
  if (Array.isArray(c))
    for (let u = 0; u < c.length; u++) {
      let l = c[u]
      jn(e, t, i, l, s)
    }
  else {
    let u = c,
      l = o[pe]
    Tg(r) && (u.flags |= 128), yu(t, e, u, l, i, s, !0)
  }
}
function Yw(t, e, n, r, i) {
  let s = n[Zt],
    o = Xe(n)
  s !== o && jn(e, t, r, s, i)
  for (let a = Se; a < n.length; a++) {
    let c = n[a]
    Ks(c[x], c, t, e, r, s)
  }
}
function Jw(t, e, n, r, i) {
  if (e) i ? t.addClass(n, r) : t.removeClass(n, r)
  else {
    let s = r.indexOf('-') === -1 ? void 0 : ft.DashCase
    i == null
      ? t.removeStyle(n, r, s)
      : (typeof i == 'string' &&
          i.endsWith('!important') &&
          ((i = i.slice(0, -10)), (s |= ft.Important)),
        t.setStyle(n, r, i, s))
  }
}
function Zw(t, e, n) {
  t.setAttribute(e, 'style', n)
}
function Mg(t, e, n) {
  n === '' ? t.removeAttribute(e, 'class') : t.setAttribute(e, 'class', n)
}
function Pg(t, e, n) {
  let { mergedAttrs: r, classes: i, styles: s } = n
  r !== null && Ec(t, e, r),
    i !== null && Mg(t, e, i),
    s !== null && Zw(t, e, s)
}
var Pc = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${xI})`
  }
}
function vu(t) {
  return t instanceof Pc ? t.changingThisBreaksApplicationSecurity : t
}
var Oc = class {}
var Xw = 'h',
  eD = 'b'
var tD = () => null
function _u(t, e, n = !1) {
  return tD(t, e, n)
}
var kc = class {},
  ks = class {}
function nD(t) {
  let e = Error(`No component factory found for ${be(t)}.`)
  return (e[rD] = t), e
}
var rD = 'ngComponent'
var Fc = class {
    resolveComponentFactory(e) {
      throw nD(e)
    }
  },
  Iu = (() => {
    let e = class e {}
    e.NULL = new Fc()
    let t = e
    return t
  })()
function iD() {
  return Qs(yt(), ge())
}
function Qs(t, e) {
  return new Eu(Be(t, e))
}
var Eu = (() => {
  let e = class e {
    constructor(r) {
      this.nativeElement = r
    }
  }
  e.__NG_ELEMENT_ID__ = iD
  let t = e
  return t
})()
var Gr = class {}
var sD = (() => {
    let e = class e {}
    e.ɵprov = K({ token: e, providedIn: 'root', factory: () => null })
    let t = e
    return t
  })(),
  dc = {}
function Fs(t, e, n, r, i = !1) {
  for (; n !== null; ) {
    let s = e[n.index]
    s !== null && r.push(Xe(s)), mt(s) && oD(s, r)
    let o = n.type
    if (o & 8) Fs(t, e, n.child, r)
    else if (o & 32) {
      let a = pu(n, e),
        c
      for (; (c = a()); ) r.push(c)
    } else if (o & 16) {
      let a = xg(e, n)
      if (Array.isArray(a)) r.push(...a)
      else {
        let c = $r(e[ht])
        Fs(c[x], c, a, r, !0)
      }
    }
    n = i ? n.projectionNext : n.next
  }
  return r
}
function oD(t, e) {
  for (let n = Se; n < t.length; n++) {
    let r = t[n],
      i = r[x].firstChild
    i !== null && Fs(r[x], r, i, e)
  }
  t[Zt] !== t[gt] && e.push(t[Zt])
}
var Og = []
function aD(t) {
  return t[Jt] ?? cD(t)
}
function cD(t) {
  let e = Og.pop() ?? Object.create(lD)
  return (e.lView = t), e
}
function uD(t) {
  t.lView[Jt] !== t && ((t.lView = null), Og.push(t))
}
var lD = lt(We({}, Tf), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    Br(t.lView)
  },
  consumerOnSignalRead() {
    this.lView[Jt] = this
  },
})
function kg(t) {
  return Lg(t[Vr])
}
function Fg(t) {
  return Lg(t[Ve])
}
function Lg(t) {
  for (; t !== null && !mt(t); ) t = t[Ve]
  return t
}
var dD = 'ngOriginalError'
function hc(t) {
  return t[dD]
}
var pt = class {
    constructor() {
      this._console = console
    }
    handleError(e) {
      let n = this._findOriginalError(e)
      this._console.error('ERROR', e),
        n && this._console.error('ORIGINAL ERROR', n)
    }
    _findOriginalError(e) {
      let n = e && hc(e)
      for (; n && hc(n); ) n = hc(n)
      return n || null
    }
  },
  Vg = new q('', {
    providedIn: 'root',
    factory: () => X(pt).handleError.bind(void 0),
  })
var Ug = !1,
  hD = new q('', { providedIn: 'root', factory: () => Ug })
var Ys = {}
function wu(t = 1) {
  jg(Nt(), ge(), Jr() + t, !1)
}
function jg(t, e, n, r) {
  if (!r)
    if ((e[C] & 3) === 3) {
      let s = t.preOrderCheckHooks
      s !== null && _s(e, s, n)
    } else {
      let s = t.preOrderHooks
      s !== null && Is(e, s, 0, n)
    }
  Xt(n)
}
function Js(t, e = R.Default) {
  let n = ge()
  if (n === null) return k(t, e)
  let r = yt()
  return fg(r, n, Fe(t), e)
}
function Bg(t, e, n, r, i, s) {
  let o = Ce(null)
  try {
    let a = null
    i & Yt.SignalBased && (a = e[r][Df]),
      a !== null && a.transformFn !== void 0 && (s = a.transformFn(s)),
      i & Yt.HasDecoratorInputTransform &&
        (s = t.inputTransforms[r].call(e, s)),
      t.setInput !== null ? t.setInput(e, a, s, n, r) : Up(e, a, r, s)
  } finally {
    Ce(o)
  }
}
function fD(t, e) {
  let n = t.hostBindingOpCodes
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r]
        if (i < 0) Xt(~i)
        else {
          let s = i,
            o = n[++r],
            a = n[++r]
          BE(o, s)
          let c = e[s]
          a(2, c)
        }
      }
    } finally {
      Xt(-1)
    }
}
function Zs(t, e, n, r, i, s, o, a, c, u, l) {
  let d = e.blueprint.slice()
  return (
    (d[gt] = i),
    (d[C] = r | 4 | 128 | 8 | 64),
    (u !== null || (t && t[C] & 2048)) && (d[C] |= 2048),
    zp(d),
    (d[pe] = d[Wn] = t),
    (d[Ue] = n),
    (d[dt] = o || (t && t[dt])),
    (d[De] = a || (t && t[De])),
    (d[qn] = c || (t && t[qn]) || null),
    (d[je] = s),
    (d[zs] = Nw()),
    (d[Cs] = l),
    (d[Fp] = u),
    (d[ht] = e.type == 2 ? t[ht] : d),
    d
  )
}
function Xs(t, e, n, r, i) {
  let s = t.data[e]
  if (s === null) (s = pD(t, e, n, r, i)), jE() && (s.flags |= 32)
  else if (s.type & 64) {
    ;(s.type = n), (s.value = r), (s.attrs = i)
    let o = kE()
    s.injectorIndex = o === null ? -1 : o.injectorIndex
  }
  return Yr(s, !0), s
}
function pD(t, e, n, r, i) {
  let s = Yp(),
    o = Jp(),
    a = o ? s : s && s.parent,
    c = (t.data[e] = _D(t, a, n, e, r, i))
  return (
    t.firstChild === null && (t.firstChild = c),
    s !== null &&
      (o
        ? s.child == null && c.parent !== null && (s.child = c)
        : s.next === null && ((s.next = c), (c.prev = s))),
    c
  )
}
function $g(t, e, n, r) {
  if (n === 0) return -1
  let i = e.length
  for (let s = 0; s < n; s++) e.push(r), t.blueprint.push(r), t.data.push(null)
  return i
}
function Hg(t, e, n, r, i) {
  let s = Jr(),
    o = r & 2
  try {
    Xt(-1), o && e.length > At && jg(t, e, At, !1), Ye(o ? 2 : 0, i), n(r, i)
  } finally {
    Xt(s), Ye(o ? 3 : 1, i)
  }
}
function qg(t, e, n) {
  if (Vp(e)) {
    let r = Ce(null)
    try {
      let i = e.directiveStart,
        s = e.directiveEnd
      for (let o = i; o < s; o++) {
        let a = t.data[o]
        a.contentQueries && a.contentQueries(1, n[o], o)
      }
    } finally {
      Ce(r)
    }
  }
}
function zg(t, e, n) {
  Wp() && (bD(t, e, n, Be(n, e)), (n.flags & 64) === 64 && Yg(t, e, n))
}
function Gg(t, e, n = Be) {
  let r = e.localNames
  if (r !== null) {
    let i = e.index + 1
    for (let s = 0; s < r.length; s += 2) {
      let o = r[s + 1],
        a = o === -1 ? n(e, t) : t[o]
      t[i++] = a
    }
  }
}
function Wg(t) {
  let e = t.tView
  return e === null || e.incompleteFirstPass
    ? (t.tView = Du(
        1,
        null,
        t.template,
        t.decls,
        t.vars,
        t.directiveDefs,
        t.pipeDefs,
        t.viewQuery,
        t.schemas,
        t.consts,
        t.id
      ))
    : e
}
function Du(t, e, n, r, i, s, o, a, c, u, l) {
  let d = At + r,
    h = d + i,
    f = gD(d, h),
    _ = typeof u == 'function' ? u() : u
  return (f[x] = {
    type: t,
    blueprint: f,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: f.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: h,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof s == 'function' ? s() : s,
    pipeRegistry: typeof o == 'function' ? o() : o,
    firstChild: null,
    schemas: c,
    consts: _,
    incompleteFirstPass: !1,
    ssrId: l,
  })
}
function gD(t, e) {
  let n = []
  for (let r = 0; r < e; r++) n.push(r < t ? null : Ys)
  return n
}
function mD(t, e, n, r) {
  let s = r.get(hD, Ug) || n === Ze.ShadowDom,
    o = t.selectRootElement(e, s)
  return yD(o), o
}
function yD(t) {
  vD(t)
}
var vD = () => null
function _D(t, e, n, r, i, s) {
  let o = e ? e.injectorIndex : -1,
    a = 0
  return (
    ME() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: o,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: s,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  )
}
function ap(t, e, n, r, i) {
  for (let s in e) {
    if (!e.hasOwnProperty(s)) continue
    let o = e[s]
    if (o === void 0) continue
    r ??= {}
    let a,
      c = Yt.None
    Array.isArray(o) ? ((a = o[0]), (c = o[1])) : (a = o)
    let u = s
    if (i !== null) {
      if (!i.hasOwnProperty(s)) continue
      u = i[s]
    }
    t === 0 ? cp(r, n, u, a, c) : cp(r, n, u, a)
  }
  return r
}
function cp(t, e, n, r, i) {
  let s
  t.hasOwnProperty(n) ? (s = t[n]).push(e, r) : (s = t[n] = [e, r]),
    i !== void 0 && s.push(i)
}
function ID(t, e, n) {
  let r = e.directiveStart,
    i = e.directiveEnd,
    s = t.data,
    o = e.attrs,
    a = [],
    c = null,
    u = null
  for (let l = r; l < i; l++) {
    let d = s[l],
      h = n ? n.get(d) : null,
      f = h ? h.inputs : null,
      _ = h ? h.outputs : null
    ;(c = ap(0, d.inputs, l, c, f)), (u = ap(1, d.outputs, l, u, _))
    let w = c !== null && o !== null && !Rp(e) ? kD(c, l, o) : null
    a.push(w)
  }
  c !== null &&
    (c.hasOwnProperty('class') && (e.flags |= 8),
    c.hasOwnProperty('style') && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = u)
}
function ED(t) {
  return t === 'class'
    ? 'className'
    : t === 'for'
      ? 'htmlFor'
      : t === 'formaction'
        ? 'formAction'
        : t === 'innerHtml'
          ? 'innerHTML'
          : t === 'readonly'
            ? 'readOnly'
            : t === 'tabindex'
              ? 'tabIndex'
              : t
}
function wD(t, e, n, r, i, s, o, a) {
  let c = Be(e, n),
    u = e.inputs,
    l
  !a && u != null && (l = u[r])
    ? (Tu(t, n, l, r, i), Xc(e) && DD(n, e.index))
    : e.type & 3
      ? ((r = ED(r)),
        (i = o != null ? o(i, e.value || '', r) : i),
        s.setProperty(c, r, i))
      : e.type & 12
}
function DD(t, e) {
  let n = Kn(e, t)
  n[C] & 16 || (n[C] |= 64)
}
function Kg(t, e, n, r) {
  if (Wp()) {
    let i = r === null ? null : { '': -1 },
      s = SD(t, n),
      o,
      a
    s === null ? (o = a = null) : ([o, a] = s),
      o !== null && Qg(t, e, n, o, i, a),
      i && ND(n, r, i)
  }
  n.mergedAttrs = Jc(n.mergedAttrs, n.attrs)
}
function Qg(t, e, n, r, i, s) {
  for (let u = 0; u < r.length; u++) rw(ug(n, e), t, r[u].type)
  xD(n, t.data.length, r.length)
  for (let u = 0; u < r.length; u++) {
    let l = r[u]
    l.providersResolver && l.providersResolver(l)
  }
  let o = !1,
    a = !1,
    c = $g(t, e, r.length, null)
  for (let u = 0; u < r.length; u++) {
    let l = r[u]
    ;(n.mergedAttrs = Jc(n.mergedAttrs, l.hostAttrs)),
      MD(t, n, e, c, l),
      RD(c, l, i),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64)
    let d = l.type.prototype
    !o &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(n.index), (o = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      c++
  }
  ID(t, n, s)
}
function TD(t, e, n, r, i) {
  let s = i.hostBindings
  if (s) {
    let o = t.hostBindingOpCodes
    o === null && (o = t.hostBindingOpCodes = [])
    let a = ~e.index
    CD(o) != a && o.push(a), o.push(n, r, s)
  }
}
function CD(t) {
  let e = t.length
  for (; e > 0; ) {
    let n = t[--e]
    if (typeof n == 'number' && n < 0) return n
  }
  return 0
}
function bD(t, e, n, r) {
  let i = n.directiveStart,
    s = n.directiveEnd
  Xc(n) && PD(e, n, t.data[i + n.componentOffset]),
    t.firstCreatePass || ug(n, e),
    en(r, e)
  let o = n.initialInputs
  for (let a = i; a < s; a++) {
    let c = t.data[a],
      u = qr(e, t, a, n)
    if ((en(u, e), o !== null && OD(e, a - i, u, c, n, o), Qr(c))) {
      let l = Kn(n.index, e)
      l[Ue] = qr(e, t, a, n)
    }
  }
}
function Yg(t, e, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    s = n.index,
    o = $E()
  try {
    Xt(s)
    for (let a = r; a < i; a++) {
      let c = t.data[a],
        u = e[a]
      Tc(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          AD(c, u)
    }
  } finally {
    Xt(-1), Tc(o)
  }
}
function AD(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e)
}
function SD(t, e) {
  let n = t.directiveRegistry,
    r = null,
    i = null
  if (n)
    for (let s = 0; s < n.length; s++) {
      let o = n[s]
      if (oE(e, o.selectors, !1))
        if ((r || (r = []), Qr(o)))
          if (o.findHostDirectiveDefs !== null) {
            let a = []
            ;(i = i || new Map()),
              o.findHostDirectiveDefs(o, a, i),
              r.unshift(...a, o)
            let c = a.length
            Lc(t, e, c)
          } else r.unshift(o), Lc(t, e, 0)
        else (i = i || new Map()), o.findHostDirectiveDefs?.(o, r, i), r.push(o)
    }
  return r === null ? null : [r, i]
}
function Lc(t, e, n) {
  ;(e.componentOffset = n), (t.components ??= []).push(e.index)
}
function ND(t, e, n) {
  if (e) {
    let r = (t.localNames = [])
    for (let i = 0; i < e.length; i += 2) {
      let s = n[e[i + 1]]
      if (s == null) throw new H(-301, !1)
      r.push(e[i], s)
    }
  }
}
function RD(t, e, n) {
  if (n) {
    if (e.exportAs)
      for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t
    Qr(e) && (n[''] = t)
  }
}
function xD(t, e, n) {
  ;(t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + n),
    (t.providerIndexes = e)
}
function MD(t, e, n, r, i) {
  t.data[r] = i
  let s = i.factory || (i.factory = jr(i.type, !0)),
    o = new Hr(s, Qr(i), Js)
  ;(t.blueprint[r] = o), (n[r] = o), TD(t, e, r, $g(t, n, i.hostVars, Ys), i)
}
function PD(t, e, n) {
  let r = Be(e, t),
    i = Wg(n),
    s = t[dt].rendererFactory,
    o = 16
  n.signals ? (o = 4096) : n.onPush && (o = 64)
  let a = eo(
    t,
    Zs(t, i, null, o, r, e, null, s.createRenderer(r, n), null, null, null)
  )
  t[e.index] = a
}
function OD(t, e, n, r, i, s) {
  let o = s[e]
  if (o !== null)
    for (let a = 0; a < o.length; ) {
      let c = o[a++],
        u = o[a++],
        l = o[a++],
        d = o[a++]
      Bg(r, n, c, u, l, d)
    }
}
function kD(t, e, n) {
  let r = null,
    i = 0
  for (; i < n.length; ) {
    let s = n[i]
    if (s === 0) {
      i += 4
      continue
    } else if (s === 5) {
      i += 2
      continue
    }
    if (typeof s == 'number') break
    if (t.hasOwnProperty(s)) {
      r === null && (r = [])
      let o = t[s]
      for (let a = 0; a < o.length; a += 3)
        if (o[a] === e) {
          r.push(s, o[a + 1], o[a + 2], n[i + 1])
          break
        }
    }
    i += 2
  }
  return r
}
function Jg(t, e, n, r) {
  return [t, !0, 0, e, null, r, null, n, null, null]
}
function Zg(t, e) {
  let n = t.contentQueries
  if (n !== null) {
    let r = Ce(null)
    try {
      for (let i = 0; i < n.length; i += 2) {
        let s = n[i],
          o = n[i + 1]
        if (o !== -1) {
          let a = t.data[o]
          Zp(s), a.contentQueries(2, e[o], o)
        }
      }
    } finally {
      Ce(r)
    }
  }
}
function eo(t, e) {
  return t[Vr] ? (t[Jf][Ve] = e) : (t[Vr] = e), (t[Jf] = e), e
}
function Vc(t, e, n) {
  Zp(0)
  let r = Ce(null)
  try {
    e(t, n)
  } finally {
    Ce(r)
  }
}
function FD(t) {
  return t[Lr] || (t[Lr] = [])
}
function LD(t) {
  return t.cleanup || (t.cleanup = [])
}
function Xg(t, e) {
  let n = t[qn],
    r = n ? n.get(pt, null) : null
  r && r.handleError(e)
}
function Tu(t, e, n, r, i) {
  for (let s = 0; s < n.length; ) {
    let o = n[s++],
      a = n[s++],
      c = n[s++],
      u = e[o],
      l = t.data[o]
    Bg(l, u, r, a, c, i)
  }
}
var VD = 100
function UD(t, e = !0) {
  let n = t[dt],
    r = n.rendererFactory,
    i = !1
  i || r.begin?.()
  try {
    jD(t)
  } catch (s) {
    throw (e && Xg(t, s), s)
  } finally {
    i || (r.end?.(), n.inlineEffectRunner?.flush())
  }
}
function jD(t) {
  Uc(t, 0)
  let e = 0
  for (; Gp(t); ) {
    if (e === VD) throw new H(103, !1)
    e++, Uc(t, 1)
  }
}
function BD(t, e, n, r) {
  let i = e[C]
  if ((i & 256) === 256) return
  let s = !1
  !s && e[dt].inlineEffectRunner?.flush(), nu(e)
  let o = null,
    a = null
  !s && $D(t) && ((a = aD(e)), (o = Cf(a)))
  try {
    zp(e), LE(t.bindingStartIndex), n !== null && Hg(t, e, n, 2, r)
    let c = (i & 3) === 3
    if (!s)
      if (c) {
        let d = t.preOrderCheckHooks
        d !== null && _s(e, d, null)
      } else {
        let d = t.preOrderHooks
        d !== null && Is(e, d, 0, null), oc(e, 0)
      }
    if ((HD(e), em(e, 0), t.contentQueries !== null && Zg(t, e), !s))
      if (c) {
        let d = t.contentCheckHooks
        d !== null && _s(e, d)
      } else {
        let d = t.contentHooks
        d !== null && Is(e, d, 1), oc(e, 1)
      }
    fD(t, e)
    let u = t.components
    u !== null && nm(e, u, 0)
    let l = t.viewQuery
    if ((l !== null && Vc(2, l, r), !s))
      if (c) {
        let d = t.viewCheckHooks
        d !== null && _s(e, d)
      } else {
        let d = t.viewHooks
        d !== null && Is(e, d, 2), oc(e, 2)
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[sc])) {
      for (let d of e[sc]) d()
      e[sc] = null
    }
    s || (e[C] &= -73)
  } catch (c) {
    throw (Br(e), c)
  } finally {
    a !== null && (bf(a, o), uD(a)), ru()
  }
}
function $D(t) {
  return t.type !== 2
}
function em(t, e) {
  for (let n = kg(t); n !== null; n = Fg(n))
    for (let r = Se; r < n.length; r++) {
      let i = n[r]
      tm(i, e)
    }
}
function HD(t) {
  for (let e = kg(t); e !== null; e = Fg(e)) {
    if (!(e[C] & Zc.HasTransplantedViews)) continue
    let n = e[As]
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        s = i[pe]
      bE(i)
    }
  }
}
function qD(t, e, n) {
  let r = Kn(e, t)
  tm(r, n)
}
function tm(t, e) {
  tu(t) && Uc(t, e)
}
function Uc(t, e) {
  let r = t[x],
    i = t[C],
    s = t[Jt],
    o = !!(e === 0 && i & 16)
  if (
    ((o ||= !!(i & 64 && e === 0)),
    (o ||= !!(i & 1024)),
    (o ||= !!(s?.dirty && Ha(s))),
    s && (s.dirty = !1),
    (t[C] &= -9217),
    o)
  )
    BD(r, t, r.template, t[Ue])
  else if (i & 8192) {
    em(t, 1)
    let a = r.components
    a !== null && nm(t, a, 1)
  }
}
function nm(t, e, n) {
  for (let r = 0; r < e.length; r++) qD(t, e[r], n)
}
function Cu(t) {
  for (t[dt].changeDetectionScheduler?.notify(); t; ) {
    t[C] |= 64
    let e = $r(t)
    if (mE(t) && !e) return t
    t = e
  }
  return null
}
var Wr = class {
  get rootNodes() {
    let e = this._lView,
      n = e[x]
    return Fs(n, e, n.firstChild, [])
  }
  constructor(e, n, r = !0) {
    ;(this._lView = e),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r),
      (this._appRef = null),
      (this._attachedToViewContainer = !1)
  }
  get context() {
    return this._lView[Ue]
  }
  set context(e) {
    this._lView[Ue] = e
  }
  get destroyed() {
    return (this._lView[C] & 256) === 256
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this)
    else if (this._attachedToViewContainer) {
      let e = this._lView[pe]
      if (mt(e)) {
        let n = e[bs],
          r = n ? n.indexOf(this) : -1
        r > -1 && (xc(e, r), xs(n, r))
      }
      this._attachedToViewContainer = !1
    }
    Ng(this._lView[x], this._lView)
  }
  onDestroy(e) {
    SE(this._lView, e)
  }
  markForCheck() {
    Cu(this._cdRefInjectingView || this._lView)
  }
  detach() {
    this._lView[C] &= -129
  }
  reattach() {
    Dc(this._lView), (this._lView[C] |= 128)
  }
  detectChanges() {
    ;(this._lView[C] |= 1024), UD(this._lView, this.notifyErrorHandler)
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new H(902, !1)
    this._attachedToViewContainer = !0
  }
  detachFromAppRef() {
    ;(this._appRef = null), Ag(this._lView[x], this._lView)
  }
  attachToAppRef(e) {
    if (this._attachedToViewContainer) throw new H(902, !1)
    ;(this._appRef = e), Dc(this._lView)
  }
}
var up = new Set()
function rm(t) {
  up.has(t) ||
    (up.add(t),
    performance?.mark?.('mark_feature_usage', { detail: { feature: t } }))
}
var jc = class extends Mn {
  constructor(e = !1) {
    super(), (this.__isAsync = e)
  }
  emit(e) {
    super.next(e)
  }
  subscribe(e, n, r) {
    let i = e,
      s = n || (() => null),
      o = r
    if (e && typeof e == 'object') {
      let c = e
      ;(i = c.next?.bind(c)), (s = c.error?.bind(c)), (o = c.complete?.bind(c))
    }
    this.__isAsync && ((s = fc(s)), i && (i = fc(i)), o && (o = fc(o)))
    let a = super.subscribe({ next: i, error: s, complete: o })
    return e instanceof fe && e.add(a), a
  }
}
function fc(t) {
  return (e) => {
    setTimeout(t, void 0, e)
  }
}
var Rr = jc
function lp(...t) {}
function zD() {
  let t = typeof Mr.requestAnimationFrame == 'function',
    e = Mr[t ? 'requestAnimationFrame' : 'setTimeout'],
    n = Mr[t ? 'cancelAnimationFrame' : 'clearTimeout']
  if (typeof Zone < 'u' && e && n) {
    let r = e[Zone.__symbol__('OriginalDelegate')]
    r && (e = r)
    let i = n[Zone.__symbol__('OriginalDelegate')]
    i && (n = i)
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n }
}
var Q = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new Rr(!1)),
        (this.onMicrotaskEmpty = new Rr(!1)),
        (this.onStable = new Rr(!1)),
        (this.onError = new Rr(!1)),
        typeof Zone > 'u')
      )
        throw new H(908, !1)
      Zone.assertZonePatched()
      let i = this
      ;(i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e &&
          Zone.longStackTraceZoneSpec &&
          (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !r && n),
        (i.shouldCoalesceRunChangeDetection = r),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = zD().nativeRequestAnimationFrame),
        KD(i)
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get('isAngularZone') === !0
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new H(909, !1)
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new H(909, !1)
    }
    run(e, n, r) {
      return this._inner.run(e, n, r)
    }
    runTask(e, n, r, i) {
      let s = this._inner,
        o = s.scheduleEventTask('NgZoneEvent: ' + i, e, GD, lp, lp)
      try {
        return s.runTask(o, n, r)
      } finally {
        s.cancelTask(o)
      }
    }
    runGuarded(e, n, r) {
      return this._inner.runGuarded(e, n, r)
    }
    runOutsideAngular(e) {
      return this._outer.run(e)
    }
  },
  GD = {}
function bu(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null)
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null))
        } finally {
          t.isStable = !0
        }
    }
}
function WD(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      Mr,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            'fakeTopEventTask',
            () => {
              ;(t.lastRequestAnimationFrameId = -1),
                Bc(t),
                (t.isCheckStableRunning = !0),
                bu(t),
                (t.isCheckStableRunning = !1)
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke()
      }
    )),
    Bc(t))
}
function KD(t) {
  let e = () => {
    WD(t)
  }
  t._inner = t._inner.fork({
    name: 'angular',
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, s, o, a) => {
      if (QD(a)) return n.invokeTask(i, s, o, a)
      try {
        return dp(t), n.invokeTask(i, s, o, a)
      } finally {
        ;((t.shouldCoalesceEventChangeDetection && s.type === 'eventTask') ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          hp(t)
      }
    },
    onInvoke: (n, r, i, s, o, a, c) => {
      try {
        return dp(t), n.invoke(i, s, o, a, c)
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), hp(t)
      }
    },
    onHasTask: (n, r, i, s) => {
      n.hasTask(i, s),
        r === i &&
          (s.change == 'microTask'
            ? ((t._hasPendingMicrotasks = s.microTask), Bc(t), bu(t))
            : s.change == 'macroTask' && (t.hasPendingMacrotasks = s.macroTask))
    },
    onHandleError: (n, r, i, s) => (
      n.handleError(i, s), t.runOutsideAngular(() => t.onError.emit(s)), !1
    ),
  })
}
function Bc(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1)
}
function dp(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null))
}
function hp(t) {
  t._nesting--, bu(t)
}
function QD(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0
}
var im = (() => {
  let e = class e {
    constructor() {
      ;(this.handler = null), (this.internalCallbacks = [])
    }
    execute() {
      let r = [...this.internalCallbacks]
      this.internalCallbacks.length = 0
      for (let s of r) s()
      return !!this.handler?.execute() || r.length > 0
    }
    ngOnDestroy() {
      this.handler?.destroy(),
        (this.handler = null),
        (this.internalCallbacks.length = 0)
    }
  }
  e.ɵprov = K({ token: e, providedIn: 'root', factory: () => new e() })
  let t = e
  return t
})()
function YD(t, e) {
  let n = Kn(e, t),
    r = n[x]
  JD(r, n)
  let i = n[gt]
  i !== null && n[Cs] === null && (n[Cs] = _u(i, n[qn])), Au(r, n, n[Ue])
}
function JD(t, e) {
  for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n])
}
function Au(t, e, n) {
  nu(e)
  try {
    let r = t.viewQuery
    r !== null && Vc(1, r, n)
    let i = t.template
    i !== null && Hg(t, e, i, 1, n),
      t.firstCreatePass && (t.firstCreatePass = !1),
      t.staticContentQueries && Zg(t, e),
      t.staticViewQueries && Vc(2, t.viewQuery, n)
    let s = t.components
    s !== null && ZD(e, s)
  } catch (r) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      r)
    )
  } finally {
    ;(e[C] &= -5), ru()
  }
}
function ZD(t, e) {
  for (let n = 0; n < e.length; n++) YD(t, e[n])
}
function $c(t, e, n) {
  let r = n ? t.styles : null,
    i = n ? t.classes : null,
    s = 0
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let a = e[o]
      if (typeof a == 'number') s = a
      else if (s == 1) i = jf(i, a)
      else if (s == 2) {
        let c = a,
          u = e[++o]
        r = jf(r, c + ': ' + u + ';')
      }
    }
  n ? (t.styles = r) : (t.stylesWithoutHost = r),
    n ? (t.classes = i) : (t.classesWithoutHost = i)
}
var Hc = class extends Iu {
  constructor(e) {
    super(), (this.ngModule = e)
  }
  resolveComponentFactory(e) {
    let n = Hn(e)
    return new Ls(n, this.ngModule)
  }
}
function fp(t) {
  let e = []
  for (let n in t) {
    if (!t.hasOwnProperty(n)) continue
    let r = t[n]
    r !== void 0 &&
      e.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n })
  }
  return e
}
function XD(t) {
  let e = t.toLowerCase()
  return e === 'svg' ? IE : e === 'math' ? EE : null
}
var qc = class {
    constructor(e, n) {
      ;(this.injector = e), (this.parentInjector = n)
    }
    get(e, n, r) {
      r = Bs(r)
      let i = this.injector.get(e, dc, r)
      return i !== dc || n === dc ? i : this.parentInjector.get(e, n, r)
    }
  },
  Ls = class extends ks {
    get inputs() {
      let e = this.componentDef,
        n = e.inputTransforms,
        r = fp(e.inputs)
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName])
      return r
    }
    get outputs() {
      return fp(this.componentDef.outputs)
    }
    constructor(e, n) {
      super(),
        (this.componentDef = e),
        (this.ngModule = n),
        (this.componentType = e.type),
        (this.selector = lE(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n)
    }
    create(e, n, r, i) {
      i = i || this.ngModule
      let s = i instanceof St ? i : i?.injector
      s &&
        this.componentDef.getStandaloneInjector !== null &&
        (s = this.componentDef.getStandaloneInjector(s) || s)
      let o = s ? new qc(e, s) : e,
        a = o.get(Gr, null)
      if (a === null) throw new H(407, !1)
      let c = o.get(sD, null),
        u = o.get(im, null),
        l = o.get(Oc, null),
        d = {
          rendererFactory: a,
          sanitizer: c,
          inlineEffectRunner: null,
          afterRenderEventManager: u,
          changeDetectionScheduler: l,
        },
        h = a.createRenderer(null, this.componentDef),
        f = this.componentDef.selectors[0][0] || 'div',
        _ = r ? mD(h, r, this.componentDef.encapsulation, o) : bg(h, f, XD(f)),
        w = 512
      this.componentDef.signals
        ? (w |= 4096)
        : this.componentDef.onPush || (w |= 16)
      let I = null
      _ !== null && (I = _u(_, o, !0))
      let P = Du(0, null, null, 1, 0, null, null, null, null, null, null),
        L = Zs(null, P, null, w, null, null, d, h, o, null, I)
      nu(L)
      let z, B
      try {
        let Z = this.componentDef,
          $,
          Te = null
        Z.findHostDirectiveDefs
          ? (($ = []),
            (Te = new Map()),
            Z.findHostDirectiveDefs(Z, $, Te),
            $.push(Z))
          : ($ = [Z])
        let Ct = eT(L, _),
          zt = tT(Ct, _, Z, $, L, d, h)
        ;(B = qp(P, At)),
          _ && iT(h, Z, _, r),
          n !== void 0 && sT(B, this.ngContentSelectors, n),
          (z = rT(zt, Z, $, Te, L, [oT])),
          Au(P, L, null)
      } finally {
        ru()
      }
      return new zc(this.componentType, z, Qs(B, L), L, B)
    }
  },
  zc = class extends kc {
    constructor(e, n, r, i, s) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = s),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new Wr(i, void 0, !1)),
        (this.componentType = e)
    }
    setInput(e, n) {
      let r = this._tNode.inputs,
        i
      if (r !== null && (i = r[e])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(e) &&
            Object.is(this.previousInputValues.get(e), n))
        )
          return
        let s = this._rootLView
        Tu(s[x], s, i, e, n), this.previousInputValues.set(e, n)
        let o = Kn(this._tNode.index, s)
        Cu(o)
      }
    }
    get injector() {
      return new Qt(this._tNode, this._rootLView)
    }
    destroy() {
      this.hostView.destroy()
    }
    onDestroy(e) {
      this.hostView.onDestroy(e)
    }
  }
function eT(t, e) {
  let n = t[x],
    r = At
  return (t[r] = e), Xs(n, r, 2, '#host', null)
}
function tT(t, e, n, r, i, s, o) {
  let a = i[x]
  nT(r, t, e, o)
  let c = null
  e !== null && (c = _u(e, i[qn]))
  let u = s.rendererFactory.createRenderer(e, n),
    l = 16
  n.signals ? (l = 4096) : n.onPush && (l = 64)
  let d = Zs(i, Wg(n), null, l, i[t.index], t, s, u, null, null, c)
  return a.firstCreatePass && Lc(a, t, r.length - 1), eo(i, d), (i[t.index] = d)
}
function nT(t, e, n, r) {
  for (let i of t) e.mergedAttrs = Jc(e.mergedAttrs, i.hostAttrs)
  e.mergedAttrs !== null &&
    ($c(e, e.mergedAttrs, !0), n !== null && Pg(r, n, e))
}
function rT(t, e, n, r, i, s) {
  let o = yt(),
    a = i[x],
    c = Be(o, i)
  Qg(a, i, o, n, null, r)
  for (let l = 0; l < n.length; l++) {
    let d = o.directiveStart + l,
      h = qr(i, a, d, o)
    en(h, i)
  }
  Yg(a, i, o), c && en(c, i)
  let u = qr(i, a, o.directiveStart + o.componentOffset, o)
  if (((t[Ue] = i[Ue] = u), s !== null)) for (let l of s) l(u, e)
  return qg(a, o, t), u
}
function iT(t, e, n, r) {
  if (r) Ec(t, n, ['ng-version', '17.1.0'])
  else {
    let { attrs: i, classes: s } = dE(e.selectors[0])
    i && Ec(t, n, i), s && s.length > 0 && Mg(t, n, s.join(' '))
  }
}
function sT(t, e, n) {
  let r = (t.projection = [])
  for (let i = 0; i < e.length; i++) {
    let s = n[i]
    r.push(s != null ? Array.from(s) : null)
  }
}
function oT() {
  let t = yt()
  ou(ge()[x], t)
}
var MM = new RegExp(`^(\\d+)*(${eD}|${Xw})*(.*)`)
var aT = () => null
function pp(t, e) {
  return aT(t, e)
}
function cT(t, e, n, r) {
  let i = e.tView,
    o = t[C] & 4096 ? 4096 : 16,
    a = Zs(
      t,
      i,
      n,
      o,
      null,
      e,
      null,
      null,
      null,
      r?.injector ?? null,
      r?.dehydratedView ?? null
    ),
    c = t[e.index]
  a[qs] = c
  let u = t[Ur]
  return u !== null && (a[Ur] = u.createEmbeddedView(i)), Au(i, a, n), a
}
function gp(t, e) {
  return !e || e.firstChild === null || Tg(t)
}
function uT(t, e, n, r = !0) {
  let i = e[x]
  if ((Lw(i, e, t, n), r)) {
    let o = Mc(n, t),
      a = e[De],
      c = gu(a, t[Zt])
    c !== null && kw(i, t[je], a, e, c, o)
  }
  let s = e[Cs]
  s !== null && s.firstChild !== null && (s.firstChild = null)
}
var Su = (() => {
  let e = class e {}
  e.__NG_ELEMENT_ID__ = lT
  let t = e
  return t
})()
function lT() {
  let t = yt()
  return hT(t, ge())
}
var dT = Su,
  sm = class extends dT {
    constructor(e, n, r) {
      super(),
        (this._lContainer = e),
        (this._hostTNode = n),
        (this._hostLView = r)
    }
    get element() {
      return Qs(this._hostTNode, this._hostLView)
    }
    get injector() {
      return new Qt(this._hostTNode, this._hostLView)
    }
    get parentInjector() {
      let e = au(this._hostTNode, this._hostLView)
      if (og(e)) {
        let n = Rs(e, this._hostLView),
          r = Ns(e),
          i = n[x].data[r + 8]
        return new Qt(i, n)
      } else return new Qt(null, this._hostLView)
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1)
    }
    get(e) {
      let n = mp(this._lContainer)
      return (n !== null && n[e]) || null
    }
    get length() {
      return this._lContainer.length - Se
    }
    createEmbeddedView(e, n, r) {
      let i, s
      typeof r == 'number'
        ? (i = r)
        : r != null && ((i = r.index), (s = r.injector))
      let o = pp(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(n || {}, s, o)
      return this.insertImpl(a, i, gp(this._hostTNode, o)), a
    }
    createComponent(e, n, r, i, s) {
      let o = e && !dw(e),
        a
      if (o) a = n
      else {
        let _ = n || {}
        ;(a = _.index),
          (r = _.injector),
          (i = _.projectableNodes),
          (s = _.environmentInjector || _.ngModuleRef)
      }
      let c = o ? e : new Ls(Hn(e)),
        u = r || this.parentInjector
      if (!s && c.ngModule == null) {
        let w = (o ? u : this.parentInjector).get(St, null)
        w && (s = w)
      }
      let l = Hn(c.componentType ?? {}),
        d = pp(this._lContainer, l?.id ?? null),
        h = d?.firstChild ?? null,
        f = c.create(u, i, h, s)
      return this.insertImpl(f.hostView, a, gp(this._hostTNode, d)), f
    }
    insert(e, n) {
      return this.insertImpl(e, n, !0)
    }
    insertImpl(e, n, r) {
      let i = e._lView
      if (CE(i)) {
        let a = this.indexOf(e)
        if (a !== -1) this.detach(a)
        else {
          let c = i[pe],
            u = new sm(c, c[je], c[pe])
          u.detach(u.indexOf(e))
        }
      }
      let s = this._adjustIndex(n),
        o = this._lContainer
      return uT(o, i, s, r), e.attachToViewContainerRef(), mg(pc(o), s, e), e
    }
    move(e, n) {
      return this.insert(e, n)
    }
    indexOf(e) {
      let n = mp(this._lContainer)
      return n !== null ? n.indexOf(e) : -1
    }
    remove(e) {
      let n = this._adjustIndex(e, -1),
        r = xc(this._lContainer, n)
      r && (xs(pc(this._lContainer), n), Ng(r[x], r))
    }
    detach(e) {
      let n = this._adjustIndex(e, -1),
        r = xc(this._lContainer, n)
      return r && xs(pc(this._lContainer), n) != null ? new Wr(r) : null
    }
    _adjustIndex(e, n = 0) {
      return e ?? this.length + n
    }
  }
function mp(t) {
  return t[bs]
}
function pc(t) {
  return t[bs] || (t[bs] = [])
}
function hT(t, e) {
  let n,
    r = e[t.index]
  return (
    mt(r) ? (n = r) : ((n = Jg(r, e, null, t)), (e[t.index] = n), eo(e, n)),
    pT(n, e, t, r),
    new sm(n, t, e)
  )
}
function fT(t, e) {
  let n = t[De],
    r = n.createComment(''),
    i = Be(e, t),
    s = gu(n, i)
  return Os(n, s, r, qw(n, i), !1), r
}
var pT = yT,
  gT = () => !1
function mT(t, e, n) {
  return gT(t, e, n)
}
function yT(t, e, n, r) {
  if (t[Zt]) return
  let i
  n.type & 8 ? (i = Xe(r)) : (i = fT(e, n)), (t[Zt] = i)
}
function om(t, e, n) {
  let r = t[e]
  return Object.is(r, n) ? !1 : ((t[e] = n), !0)
}
function vT(t, e, n, r, i, s, o, a, c) {
  let u = e.consts,
    l = Xs(e, t, 4, o || null, Ss(u, a))
  Kg(e, n, l, Ss(u, c)), ou(e, l)
  let d = (l.tView = Du(
    2,
    l,
    r,
    i,
    s,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    u,
    null
  ))
  return (
    e.queries !== null &&
      (e.queries.template(e, l), (d.queries = e.queries.embeddedTView(l))),
    l
  )
}
function Nu(t, e, n, r, i, s, o, a) {
  let c = ge(),
    u = Nt(),
    l = t + At,
    d = u.firstCreatePass ? vT(l, u, c, e, n, r, i, s, o) : u.data[l]
  Yr(d, !1)
  let h = _T(u, c, d, t)
  iu() && mu(u, c, h, d), en(h, c)
  let f = Jg(h, c, h, d)
  return (
    (c[l] = f),
    eo(c, f),
    mT(f, d, c),
    eu(d) && zg(u, c, d),
    o != null && Gg(c, d, a),
    Nu
  )
}
var _T = IT
function IT(t, e, n, r) {
  return su(!0), e[De].createComment('')
}
function vs(t, e) {
  return (t << 17) | (e << 2)
}
function tn(t) {
  return (t >> 17) & 32767
}
function ET(t) {
  return (t & 2) == 2
}
function wT(t, e) {
  return (t & 131071) | (e << 17)
}
function Gc(t) {
  return t | 2
}
function zn(t) {
  return (t & 131068) >> 2
}
function gc(t, e) {
  return (t & -131069) | (e << 2)
}
function DT(t) {
  return (t & 1) === 1
}
function Wc(t) {
  return t | 1
}
function TT(t, e, n, r, i, s) {
  let o = s ? e.classBindings : e.styleBindings,
    a = tn(o),
    c = zn(o)
  t[r] = n
  let u = !1,
    l
  if (Array.isArray(n)) {
    let d = n
    ;(l = d[1]), (l === null || Zr(d, l) > 0) && (u = !0)
  } else l = n
  if (i)
    if (c !== 0) {
      let h = tn(t[a + 1])
      ;(t[r + 1] = vs(h, a)),
        h !== 0 && (t[h + 1] = gc(t[h + 1], r)),
        (t[a + 1] = wT(t[a + 1], r))
    } else
      (t[r + 1] = vs(a, 0)), a !== 0 && (t[a + 1] = gc(t[a + 1], r)), (a = r)
  else
    (t[r + 1] = vs(c, 0)),
      a === 0 ? (a = r) : (t[c + 1] = gc(t[c + 1], r)),
      (c = r)
  u && (t[r + 1] = Gc(t[r + 1])),
    yp(t, l, r, !0),
    yp(t, l, r, !1),
    CT(e, l, t, r, s),
    (o = vs(a, c)),
    s ? (e.classBindings = o) : (e.styleBindings = o)
}
function CT(t, e, n, r, i) {
  let s = i ? t.residualClasses : t.residualStyles
  s != null &&
    typeof e == 'string' &&
    Zr(s, e) >= 0 &&
    (n[r + 1] = Wc(n[r + 1]))
}
function yp(t, e, n, r) {
  let i = t[n + 1],
    s = e === null,
    o = r ? tn(i) : zn(i),
    a = !1
  for (; o !== 0 && (a === !1 || s); ) {
    let c = t[o],
      u = t[o + 1]
    bT(c, e) && ((a = !0), (t[o + 1] = r ? Wc(u) : Gc(u))),
      (o = r ? tn(u) : zn(u))
  }
  a && (t[n + 1] = r ? Gc(i) : Wc(i))
}
function bT(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == 'string'
      ? Zr(t, e) >= 0
      : !1
}
function Ru(t, e, n) {
  let r = ge(),
    i = VE()
  if (om(r, i, e)) {
    let s = Nt(),
      o = GE()
    wD(s, o, r, t, e, r[De], n, !1)
  }
  return Ru
}
function vp(t, e, n, r, i) {
  let s = e.inputs,
    o = i ? 'class' : 'style'
  Tu(t, n, s[o], o, r)
}
function to(t, e, n) {
  return AT(t, e, n, !1), to
}
function AT(t, e, n, r) {
  let i = ge(),
    s = Nt(),
    o = UE(2)
  if ((s.firstUpdatePass && NT(s, t, o, r), e !== Ys && om(i, o, e))) {
    let a = s.data[Jr()]
    OT(s, a, i, i[De], t, (i[o + 1] = kT(e, n)), r, o)
  }
}
function ST(t, e) {
  return e >= t.expandoStartIndex
}
function NT(t, e, n, r) {
  let i = t.data
  if (i[n + 1] === null) {
    let s = i[Jr()],
      o = ST(t, n)
    FT(s, r) && e === null && !o && (e = !1),
      (e = RT(i, s, e, r)),
      TT(i, s, e, n, o, r)
  }
}
function RT(t, e, n, r) {
  let i = HE(t),
    s = r ? e.residualClasses : e.residualStyles
  if (i === null)
    (r ? e.classBindings : e.styleBindings) === 0 &&
      ((n = mc(null, t, e, n, r)), (n = Kr(n, e.attrs, r)), (s = null))
  else {
    let o = e.directiveStylingLast
    if (o === -1 || t[o] !== i)
      if (((n = mc(i, t, e, n, r)), s === null)) {
        let c = xT(t, e, r)
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = mc(null, t, e, c[1], r)),
          (c = Kr(c, e.attrs, r)),
          MT(t, e, r, c))
      } else s = PT(t, e, r)
  }
  return (
    s !== void 0 && (r ? (e.residualClasses = s) : (e.residualStyles = s)), n
  )
}
function xT(t, e, n) {
  let r = n ? e.classBindings : e.styleBindings
  if (zn(r) !== 0) return t[tn(r)]
}
function MT(t, e, n, r) {
  let i = n ? e.classBindings : e.styleBindings
  t[tn(i)] = r
}
function PT(t, e, n) {
  let r,
    i = e.directiveEnd
  for (let s = 1 + e.directiveStylingLast; s < i; s++) {
    let o = t[s].hostAttrs
    r = Kr(r, o, n)
  }
  return Kr(r, e.attrs, n)
}
function mc(t, e, n, r, i) {
  let s = null,
    o = n.directiveEnd,
    a = n.directiveStylingLast
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < o && ((s = e[a]), (r = Kr(r, s.hostAttrs, i)), s !== t);

  )
    a++
  return t !== null && (n.directiveStylingLast = a), r
}
function Kr(t, e, n) {
  let r = n ? 1 : 2,
    i = -1
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let o = e[s]
      typeof o == 'number'
        ? (i = o)
        : i === r &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ['', t]),
          fw(t, o, n ? !0 : e[++s]))
    }
  return t === void 0 ? null : t
}
function OT(t, e, n, r, i, s, o, a) {
  if (!(e.type & 3)) return
  let c = t.data,
    u = c[a + 1],
    l = DT(u) ? _p(c, e, n, i, zn(u), o) : void 0
  if (!Vs(l)) {
    Vs(s) || (ET(u) && (s = _p(c, null, n, i, a, o)))
    let d = TE(Jr(), n)
    Jw(r, o, d, i, s)
  }
}
function _p(t, e, n, r, i, s) {
  let o = e === null,
    a
  for (; i > 0; ) {
    let c = t[i],
      u = Array.isArray(c),
      l = u ? c[1] : c,
      d = l === null,
      h = n[i + 1]
    h === Ys && (h = d ? Le : void 0)
    let f = d ? cc(h, r) : l === r ? h : void 0
    if ((u && !Vs(f) && (f = cc(c, r)), Vs(f) && ((a = f), o))) return a
    let _ = t[i + 1]
    i = o ? tn(_) : zn(_)
  }
  if (e !== null) {
    let c = s ? e.residualClasses : e.residualStyles
    c != null && (a = cc(c, r))
  }
  return a
}
function Vs(t) {
  return t !== void 0
}
function kT(t, e) {
  return (
    t == null ||
      t === '' ||
      (typeof e == 'string'
        ? (t = t + e)
        : typeof t == 'object' && (t = be(vu(t)))),
    t
  )
}
function FT(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0
}
function LT(t, e, n, r, i, s) {
  let o = e.consts,
    a = Ss(o, i),
    c = Xs(e, t, 2, r, a)
  return (
    Kg(e, n, c, Ss(o, s)),
    c.attrs !== null && $c(c, c.attrs, !1),
    c.mergedAttrs !== null && $c(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  )
}
function $e(t, e, n, r) {
  let i = ge(),
    s = Nt(),
    o = At + t,
    a = i[De],
    c = s.firstCreatePass ? LT(o, s, i, e, n, r) : s.data[o],
    u = VT(s, i, c, a, e, t)
  i[o] = u
  let l = eu(c)
  return (
    Yr(c, !0),
    Pg(a, u, c),
    (c.flags & 32) !== 32 && iu() && mu(s, i, u, c),
    NE() === 0 && en(u, i),
    RE(),
    l && (zg(s, i, c), qg(s, c, i)),
    r !== null && Gg(i, c),
    $e
  )
}
function _t() {
  let t = yt()
  Jp() ? FE() : ((t = t.parent), Yr(t, !1))
  let e = t
  PE(e) && OE(), xE()
  let n = Nt()
  return (
    n.firstCreatePass && (ou(n, t), Vp(t) && n.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      JE(e) &&
      vp(n, e, ge(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      ZE(e) &&
      vp(n, e, ge(), e.stylesWithoutHost, !1),
    _t
  )
}
function no(t, e, n, r) {
  return $e(t, e, n, r), _t(), no
}
var VT = (t, e, n, r, i, s) => (su(!0), bg(r, i, WE()))
function am() {
  return ge()
}
var Us = 'en-US'
var UT = Us
function jT(t) {
  jI(t, 'Expected localeId to be defined'),
    typeof t == 'string' && (UT = t.toLowerCase().replace(/_/g, '-'))
}
function xu(t) {
  return !!t && typeof t.then == 'function'
}
function cm(t) {
  return !!t && typeof t.subscribe == 'function'
}
function Mu(t, e, n, r) {
  let i = ge(),
    s = Nt(),
    o = yt()
  return $T(s, i, i[De], o, t, e, r), Mu
}
function BT(t, e, n, r) {
  let i = t.cleanup
  if (i != null)
    for (let s = 0; s < i.length - 1; s += 2) {
      let o = i[s]
      if (o === n && i[s + 1] === r) {
        let a = e[Lr],
          c = i[s + 2]
        return a.length > c ? a[c] : null
      }
      typeof o == 'string' && (s += 2)
    }
  return null
}
function $T(t, e, n, r, i, s, o) {
  let a = eu(r),
    u = t.firstCreatePass && LD(t),
    l = e[Ue],
    d = FD(e),
    h = !0
  if (r.type & 3 || o) {
    let w = Be(r, e),
      I = o ? o(w) : w,
      P = d.length,
      L = o ? (B) => o(Xe(B[r.index])) : r.index,
      z = null
    if ((!o && a && (z = BT(t, e, i, r.index)), z !== null)) {
      let B = z.__ngLastListenerFn__ || z
      ;(B.__ngNextListenerFn__ = s), (z.__ngLastListenerFn__ = s), (h = !1)
    } else {
      s = Ep(r, e, l, s, !1)
      let B = n.listen(I, i, s)
      d.push(s, B), u && u.push(i, L, P, P + 1)
    }
  } else s = Ep(r, e, l, s, !1)
  let f = r.outputs,
    _
  if (h && f !== null && (_ = f[i])) {
    let w = _.length
    if (w)
      for (let I = 0; I < w; I += 2) {
        let P = _[I],
          L = _[I + 1],
          Z = e[P][L].subscribe(s),
          $ = d.length
        d.push(s, Z), u && u.push(i, r.index, $, -($ + 1))
      }
  }
}
function Ip(t, e, n, r) {
  try {
    return Ye(6, e, n), n(r) !== !1
  } catch (i) {
    return Xg(t, i), !1
  } finally {
    Ye(7, e, n)
  }
}
function Ep(t, e, n, r, i) {
  return function s(o) {
    if (o === Function) return r
    let a = t.componentOffset > -1 ? Kn(t.index, e) : e
    Cu(a)
    let c = Ip(e, n, r, o),
      u = s.__ngNextListenerFn__
    for (; u; ) (c = Ip(e, n, u, o) && c), (u = u.__ngNextListenerFn__)
    return i && c === !1 && o.preventDefault(), c
  }
}
function um(t = 1) {
  return zE(t)
}
var Pu = (() => {
    let e = class e {}
    e.__NG_ELEMENT_ID__ = zT
    let t = e
    return t
  })(),
  HT = Pu,
  qT = class extends HT {
    constructor(e, n, r) {
      super(),
        (this._declarationLView = e),
        (this._declarationTContainer = n),
        (this.elementRef = r)
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null
    }
    createEmbeddedView(e, n) {
      return this.createEmbeddedViewImpl(e, n)
    }
    createEmbeddedViewImpl(e, n, r) {
      let i = cT(this._declarationLView, this._declarationTContainer, e, {
        injector: n,
        dehydratedView: r,
      })
      return new Wr(i)
    }
  }
function zT() {
  return GT(yt(), ge())
}
function GT(t, e) {
  return t.type & 4 ? new qT(e, t, Qs(t, e)) : null
}
function Qn(t, e = '') {
  let n = ge(),
    r = Nt(),
    i = t + At,
    s = r.firstCreatePass ? Xs(r, i, 1, e, null) : r.data[i],
    o = WT(r, n, s, e, t)
  ;(n[i] = o), iu() && mu(r, n, o, s), Yr(s, !1)
}
var WT = (t, e, n, r, i) => (su(!0), Pw(e[De], r))
var Gn = class {}
var js = class extends Gn {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new Hc(this)),
      (this.instance = null)
    let n = new Ps(
      [
        ...e.providers,
        { provide: Gn, useValue: this },
        { provide: Iu, useValue: this.componentFactoryResolver },
      ],
      e.parent || lu(),
      e.debugName,
      new Set(['environment'])
    )
    ;(this.injector = n),
      e.runEnvironmentInitializers && n.resolveInjectorInitializers()
  }
  destroy() {
    this.injector.destroy()
  }
  onDestroy(e) {
    this.injector.onDestroy(e)
  }
}
function KT(t, e, n = null) {
  return new js({
    providers: t,
    parent: e,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector
}
var QT = (() => {
  let e = class e {
    constructor(r) {
      ;(this._injector = r), (this.cachedInjectors = new Map())
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null
      if (!this.cachedInjectors.has(r)) {
        let i = Ig(!1, r.type),
          s =
            i.length > 0
              ? KT([i], this._injector, `Standalone[${r.type.name}]`)
              : null
        this.cachedInjectors.set(r, s)
      }
      return this.cachedInjectors.get(r)
    }
    ngOnDestroy() {
      try {
        for (let r of this.cachedInjectors.values()) r !== null && r.destroy()
      } finally {
        this.cachedInjectors.clear()
      }
    }
  }
  e.ɵprov = K({
    token: e,
    providedIn: 'environment',
    factory: () => new e(k(St)),
  })
  let t = e
  return t
})()
function ro(t) {
  rm('NgStandalone'),
    (t.getStandaloneInjector = (e) =>
      e.get(QT).getOrCreateStandaloneInjector(t))
}
var nn = class {
    constructor(e) {
      this.full = e
      let n = e.split('.')
      ;(this.major = n[0]),
        (this.minor = n[1]),
        (this.patch = n.slice(2).join('.'))
    }
  },
  lm = new nn('17.1.0')
var dm = (() => {
  let e = class e {
    constructor() {
      ;(this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new Sr(!1))
    }
    get _hasPendingTasks() {
      return this.hasPendingTasks.value
    }
    add() {
      this._hasPendingTasks || this.hasPendingTasks.next(!0)
      let r = this.taskId++
      return this.pendingTasks.add(r), r
    }
    remove(r) {
      this.pendingTasks.delete(r),
        this.pendingTasks.size === 0 &&
          this._hasPendingTasks &&
          this.hasPendingTasks.next(!1)
    }
    ngOnDestroy() {
      this.pendingTasks.clear(),
        this._hasPendingTasks && this.hasPendingTasks.next(!1)
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵprov = K({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
var hm = new q('')
var YT = new q('Application Initializer'),
  fm = (() => {
    let e = class e {
      constructor() {
        ;(this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            ;(this.resolve = r), (this.reject = i)
          })),
          (this.appInits = X(YT, { optional: !0 }) ?? [])
      }
      runInitializers() {
        if (this.initialized) return
        let r = []
        for (let s of this.appInits) {
          let o = s()
          if (xu(o)) r.push(o)
          else if (cm(o)) {
            let a = new Promise((c, u) => {
              o.subscribe({ complete: c, error: u })
            })
            r.push(a)
          }
        }
        let i = () => {
          ;(this.done = !0), this.resolve()
        }
        Promise.all(r)
          .then(() => {
            i()
          })
          .catch((s) => {
            this.reject(s)
          }),
          r.length === 0 && i(),
          (this.initialized = !0)
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)()
    }),
      (e.ɵprov = K({ token: e, factory: e.ɵfac, providedIn: 'root' }))
    let t = e
    return t
  })(),
  JT = new q('appBootstrapListener')
function ZT() {
  Sf(() => {
    throw new H(600, !1)
  })
}
function XT(t) {
  return t.isBoundToModule
}
function eC(t, e, n) {
  try {
    let r = n()
    return xu(r)
      ? r.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i)
        })
      : r
  } catch (r) {
    throw (e.runOutsideAngular(() => t.handleError(r)), r)
  }
}
var Ou = (() => {
  let e = class e {
    constructor() {
      ;(this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = X(Vg)),
        (this.afterRenderEffectManager = X(im)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = X(dm).hasPendingTasks.pipe(Fn((r) => !r))),
        (this._injector = X(St))
    }
    get destroyed() {
      return this._destroyed
    }
    get injector() {
      return this._injector
    }
    bootstrap(r, i) {
      let s = r instanceof ks
      if (!this._injector.get(fm).done) {
        let f = !s && pE(r),
          _ = !1
        throw new H(405, _)
      }
      let a
      s ? (a = r) : (a = this._injector.get(Iu).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType)
      let c = XT(a) ? void 0 : this._injector.get(Gn),
        u = i || a.selector,
        l = a.create(Rt.NULL, [], u, c),
        d = l.location.nativeElement,
        h = l.injector.get(hm, null)
      return (
        h?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            yc(this.components, l),
            h?.unregisterApplication(d)
        }),
        this._loadComponent(l),
        l
      )
    }
    tick() {
      if (this._runningTick) throw new H(101, !1)
      try {
        this._runningTick = !0
        for (let r of this._views) r.detectChanges()
      } catch (r) {
        this.internalErrorHandler(r)
      } finally {
        try {
          let r = this.afterRenderEffectManager.execute()
        } catch (r) {
          this.internalErrorHandler(r)
        }
        this._runningTick = !1
      }
    }
    attachView(r) {
      let i = r
      this._views.push(i), i.attachToAppRef(this)
    }
    detachView(r) {
      let i = r
      yc(this._views, i), i.detachFromAppRef()
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r)
      let i = this._injector.get(JT, [])
      ;[...this._bootstrapListeners, ...i].forEach((s) => s(r))
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((r) => r()),
            this._views.slice().forEach((r) => r.destroy())
        } finally {
          ;(this._destroyed = !0),
            (this._views = []),
            (this._bootstrapListeners = []),
            (this._destroyListeners = [])
        }
    }
    onDestroy(r) {
      return this._destroyListeners.push(r), () => yc(this._destroyListeners, r)
    }
    destroy() {
      if (this._destroyed) throw new H(406, !1)
      let r = this._injector
      r.destroy && !r.destroyed && r.destroy()
    }
    get viewCount() {
      return this._views.length
    }
    warnIfDestroyed() {}
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵprov = K({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
function yc(t, e) {
  let n = t.indexOf(e)
  n > -1 && t.splice(n, 1)
}
var tC = (() => {
  let e = class e {
    constructor() {
      ;(this.zone = X(Q)), (this.applicationRef = X(Ou))
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription =
          this.zone.onMicrotaskEmpty.subscribe({
            next: () => {
              this.zone.run(() => {
                this.applicationRef.tick()
              })
            },
          }))
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe()
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵprov = K({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
function nC(t) {
  return [
    { provide: Q, useFactory: t },
    {
      provide: zr,
      multi: !0,
      useFactory: () => {
        let e = X(tC, { optional: !0 })
        return () => e.initialize()
      },
    },
    {
      provide: zr,
      multi: !0,
      useFactory: () => {
        let e = X(oC)
        return () => {
          e.initialize()
        }
      },
    },
    { provide: Vg, useFactory: rC },
  ]
}
function rC() {
  let t = X(Q),
    e = X(pt)
  return (n) => t.runOutsideAngular(() => e.handleError(n))
}
function iC(t) {
  let e = nC(() => new Q(sC(t)))
  return _g([[], e])
}
function sC(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  }
}
var oC = (() => {
  let e = class e {
    constructor() {
      ;(this.subscription = new fe()),
        (this.initialized = !1),
        (this.zone = X(Q)),
        (this.pendingTasks = X(dm))
    }
    initialize() {
      if (this.initialized) return
      this.initialized = !0
      let r = null
      !this.zone.isStable &&
        !this.zone.hasPendingMacrotasks &&
        !this.zone.hasPendingMicrotasks &&
        (r = this.pendingTasks.add()),
        this.zone.runOutsideAngular(() => {
          this.subscription.add(
            this.zone.onStable.subscribe(() => {
              Q.assertNotInAngularZone(),
                queueMicrotask(() => {
                  r !== null &&
                    !this.zone.hasPendingMacrotasks &&
                    !this.zone.hasPendingMicrotasks &&
                    (this.pendingTasks.remove(r), (r = null))
                })
            })
          )
        }),
        this.subscription.add(
          this.zone.onUnstable.subscribe(() => {
            Q.assertInAngularZone(), (r ??= this.pendingTasks.add())
          })
        )
    }
    ngOnDestroy() {
      this.subscription.unsubscribe()
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵprov = K({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
function aC() {
  return (typeof $localize < 'u' && $localize.locale) || Us
}
var ku = new q('LocaleId', {
  providedIn: 'root',
  factory: () => X(ku, R.Optional | R.SkipSelf) || aC(),
})
var pm = new q('PlatformDestroyListeners')
var Ds = null
function cC(t = [], e) {
  return Rt.create({
    name: e,
    providers: [
      { provide: Ws, useValue: 'platform' },
      { provide: pm, useValue: new Set([() => (Ds = null)]) },
      ...t,
    ],
  })
}
function uC(t = []) {
  if (Ds) return Ds
  let e = cC(t)
  return (Ds = e), ZT(), lC(e), e
}
function lC(t) {
  t.get(hu, null)?.forEach((n) => n())
}
function gm(t) {
  try {
    let { rootComponent: e, appProviders: n, platformProviders: r } = t,
      i = uC(r),
      s = [iC(), ...(n || [])],
      a = new js({
        providers: s,
        parent: i,
        debugName: '',
        runEnvironmentInitializers: !1,
      }).injector,
      c = a.get(Q)
    return c.run(() => {
      a.resolveInjectorInitializers()
      let u = a.get(pt, null),
        l
      c.runOutsideAngular(() => {
        l = c.onError.subscribe({
          next: (f) => {
            u.handleError(f)
          },
        })
      })
      let d = () => a.destroy(),
        h = i.get(pm)
      return (
        h.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), h.delete(d)
        }),
        eC(u, c, () => {
          let f = a.get(fm)
          return (
            f.runInitializers(),
            f.donePromise.then(() => {
              let _ = a.get(ku, Us)
              jT(_ || Us)
              let w = a.get(Ou)
              return e !== void 0 && w.bootstrap(e), w
            })
          )
        })
      )
    })
  } catch (e) {
    return Promise.reject(e)
  }
}
var Fu = null
function Vu() {
  return Fu
}
function ym(t) {
  Fu || (Fu = t)
}
var io = class {},
  Pt = new q('DocumentToken')
function vm(t, e) {
  e = encodeURIComponent(e)
  for (let n of t.split(';')) {
    let r = n.indexOf('='),
      [i, s] = r == -1 ? [n, ''] : [n.slice(0, r), n.slice(r + 1)]
    if (i.trim() === e) return decodeURIComponent(s)
  }
  return null
}
var _m = (() => {
    let e = class e {
      constructor(r, i) {
        ;(this._viewContainer = r),
          (this._context = new Lu()),
          (this._thenTemplateRef = null),
          (this._elseTemplateRef = null),
          (this._thenViewRef = null),
          (this._elseViewRef = null),
          (this._thenTemplateRef = i)
      }
      set ngIf(r) {
        ;(this._context.$implicit = this._context.ngIf = r), this._updateView()
      }
      set ngIfThen(r) {
        mm('ngIfThen', r),
          (this._thenTemplateRef = r),
          (this._thenViewRef = null),
          this._updateView()
      }
      set ngIfElse(r) {
        mm('ngIfElse', r),
          (this._elseTemplateRef = r),
          (this._elseViewRef = null),
          this._updateView()
      }
      _updateView() {
        this._context.$implicit
          ? this._thenViewRef ||
            (this._viewContainer.clear(),
            (this._elseViewRef = null),
            this._thenTemplateRef &&
              (this._thenViewRef = this._viewContainer.createEmbeddedView(
                this._thenTemplateRef,
                this._context
              )))
          : this._elseViewRef ||
            (this._viewContainer.clear(),
            (this._thenViewRef = null),
            this._elseTemplateRef &&
              (this._elseViewRef = this._viewContainer.createEmbeddedView(
                this._elseTemplateRef,
                this._context
              )))
      }
      static ngTemplateContextGuard(r, i) {
        return !0
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(Js(Su), Js(Pu))
    }),
      (e.ɵdir = xp({
        type: e,
        selectors: [['', 'ngIf', '']],
        inputs: { ngIf: 'ngIf', ngIfThen: 'ngIfThen', ngIfElse: 'ngIfElse' },
        standalone: !0,
      }))
    let t = e
    return t
  })(),
  Lu = class {
    constructor() {
      ;(this.$implicit = null), (this.ngIf = null)
    }
  }
function mm(t, e) {
  if (!!!(!e || e.createEmbeddedView))
    throw new Error(`${t} must be a TemplateRef, but received '${be(e)}'.`)
}
var Uu = (() => {
    let e = class e {}
    ;(e.ɵfac = function (i) {
      return new (i || e)()
    }),
      (e.ɵmod = sn({ type: e })),
      (e.ɵinj = rn({}))
    let t = e
    return t
  })(),
  Im = 'browser',
  hC = 'server'
function ju(t) {
  return t === hC
}
var so = class {}
var Hu = class extends io {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0)
    }
  },
  qu = class t extends Hu {
    static makeCurrent() {
      ym(new t())
    }
    onAndCancel(e, n, r) {
      return (
        e.addEventListener(n, r),
        () => {
          e.removeEventListener(n, r)
        }
      )
    }
    dispatchEvent(e, n) {
      e.dispatchEvent(n)
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e)
    }
    createElement(e, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(e)
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle')
    }
    getDefaultDocument() {
      return document
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment
    }
    getGlobalEventTarget(e, n) {
      return n === 'window'
        ? window
        : n === 'document'
          ? e
          : n === 'body'
            ? e.body
            : null
    }
    getBaseHref(e) {
      let n = gC()
      return n == null ? null : mC(n)
    }
    resetBaseElement() {
      Xr = null
    }
    getUserAgent() {
      return window.navigator.userAgent
    }
    getCookie(e) {
      return vm(document.cookie, e)
    }
  },
  Xr = null
function gC() {
  return (
    (Xr = Xr || document.querySelector('base')),
    Xr ? Xr.getAttribute('href') : null
  )
}
function mC(t) {
  return new URL(t, document.baseURI).pathname
}
var yC = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest()
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)()
    }),
      (e.ɵprov = K({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  zu = new q('EventManagerPlugins'),
  Tm = (() => {
    let e = class e {
      constructor(r, i) {
        ;(this._zone = i),
          (this._eventNameToPlugin = new Map()),
          r.forEach((s) => {
            s.manager = this
          }),
          (this._plugins = r.slice().reverse())
      }
      addEventListener(r, i, s) {
        return this._findPluginFor(i).addEventListener(r, i, s)
      }
      getZone() {
        return this._zone
      }
      _findPluginFor(r) {
        let i = this._eventNameToPlugin.get(r)
        if (i) return i
        if (((i = this._plugins.find((o) => o.supports(r))), !i))
          throw new H(5101, !1)
        return this._eventNameToPlugin.set(r, i), i
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(k(zu), k(Q))
    }),
      (e.ɵprov = K({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  oo = class {
    constructor(e) {
      this._doc = e
    }
  },
  Bu = 'ng-app-id',
  Cm = (() => {
    let e = class e {
      constructor(r, i, s, o = {}) {
        ;(this.doc = r),
          (this.appId = i),
          (this.nonce = s),
          (this.platformId = o),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = ju(o)),
          this.resetHostNodes()
      }
      addStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i)
      }
      removeStyles(r) {
        for (let i of r)
          this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i)
      }
      ngOnDestroy() {
        let r = this.styleNodesInDOM
        r && (r.forEach((i) => i.remove()), r.clear())
        for (let i of this.getAllStyles()) this.onStyleRemoved(i)
        this.resetHostNodes()
      }
      addHost(r) {
        this.hostNodes.add(r)
        for (let i of this.getAllStyles()) this.addStyleToHost(r, i)
      }
      removeHost(r) {
        this.hostNodes.delete(r)
      }
      getAllStyles() {
        return this.styleRef.keys()
      }
      onStyleAdded(r) {
        for (let i of this.hostNodes) this.addStyleToHost(i, r)
      }
      onStyleRemoved(r) {
        let i = this.styleRef
        i.get(r)?.elements?.forEach((s) => s.remove()), i.delete(r)
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${Bu}="${this.appId}"]`)
        if (r?.length) {
          let i = new Map()
          return (
            r.forEach((s) => {
              s.textContent != null && i.set(s.textContent, s)
            }),
            i
          )
        }
        return null
      }
      changeUsageCount(r, i) {
        let s = this.styleRef
        if (s.has(r)) {
          let o = s.get(r)
          return (o.usage += i), o.usage
        }
        return s.set(r, { usage: i, elements: [] }), i
      }
      getStyleElement(r, i) {
        let s = this.styleNodesInDOM,
          o = s?.get(i)
        if (o?.parentNode === r) return s.delete(i), o.removeAttribute(Bu), o
        {
          let a = this.doc.createElement('style')
          return (
            this.nonce && a.setAttribute('nonce', this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Bu, this.appId),
            r.appendChild(a),
            a
          )
        }
      }
      addStyleToHost(r, i) {
        let s = this.getStyleElement(r, i),
          o = this.styleRef,
          a = o.get(i)?.elements
        a ? a.push(s) : o.set(i, { elements: [s], usage: 1 })
      }
      resetHostNodes() {
        let r = this.hostNodes
        r.clear(), r.add(this.doc.head)
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(k(Pt), k(du), k(fu, 8), k(xt))
    }),
      (e.ɵprov = K({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  $u = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/MathML/',
  },
  Wu = /%COMP%/g,
  bm = '%COMP%',
  vC = `_nghost-${bm}`,
  _C = `_ngcontent-${bm}`,
  IC = !0,
  EC = new q('RemoveStylesOnCompDestroy', {
    providedIn: 'root',
    factory: () => IC,
  })
function wC(t) {
  return _C.replace(Wu, t)
}
function DC(t) {
  return vC.replace(Wu, t)
}
function Am(t, e) {
  return e.map((n) => n.replace(Wu, t))
}
var Em = (() => {
    let e = class e {
      constructor(r, i, s, o, a, c, u, l = null) {
        ;(this.eventManager = r),
          (this.sharedStylesHost = i),
          (this.appId = s),
          (this.removeStylesOnCompDestroy = o),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = u),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = ju(c)),
          (this.defaultRenderer = new ei(r, a, u, this.platformIsServer))
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer
        this.platformIsServer &&
          i.encapsulation === Ze.ShadowDom &&
          (i = lt(We({}, i), { encapsulation: Ze.Emulated }))
        let s = this.getOrCreateRenderer(r, i)
        return (
          s instanceof ao
            ? s.applyToHost(r)
            : s instanceof ti && s.applyStyles(),
          s
        )
      }
      getOrCreateRenderer(r, i) {
        let s = this.rendererByCompId,
          o = s.get(i.id)
        if (!o) {
          let a = this.doc,
            c = this.ngZone,
            u = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            h = this.platformIsServer
          switch (i.encapsulation) {
            case Ze.Emulated:
              o = new ao(u, l, i, this.appId, d, a, c, h)
              break
            case Ze.ShadowDom:
              return new Gu(u, l, r, i, a, c, this.nonce, h)
            default:
              o = new ti(u, l, i, d, a, c, h)
              break
          }
          s.set(i.id, o)
        }
        return o
      }
      ngOnDestroy() {
        this.rendererByCompId.clear()
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(k(Tm), k(Cm), k(du), k(EC), k(Pt), k(xt), k(Q), k(fu))
    }),
      (e.ɵprov = K({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  ei = class {
    constructor(e, n, r, i) {
      ;(this.eventManager = e),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null)
    }
    destroy() {}
    createElement(e, n) {
      return n
        ? this.doc.createElementNS($u[n] || n, e)
        : this.doc.createElement(e)
    }
    createComment(e) {
      return this.doc.createComment(e)
    }
    createText(e) {
      return this.doc.createTextNode(e)
    }
    appendChild(e, n) {
      ;(wm(e) ? e.content : e).appendChild(n)
    }
    insertBefore(e, n, r) {
      e && (wm(e) ? e.content : e).insertBefore(n, r)
    }
    removeChild(e, n) {
      e && e.removeChild(n)
    }
    selectRootElement(e, n) {
      let r = typeof e == 'string' ? this.doc.querySelector(e) : e
      if (!r) throw new H(-5104, !1)
      return n || (r.textContent = ''), r
    }
    parentNode(e) {
      return e.parentNode
    }
    nextSibling(e) {
      return e.nextSibling
    }
    setAttribute(e, n, r, i) {
      if (i) {
        n = i + ':' + n
        let s = $u[i]
        s ? e.setAttributeNS(s, n, r) : e.setAttribute(n, r)
      } else e.setAttribute(n, r)
    }
    removeAttribute(e, n, r) {
      if (r) {
        let i = $u[r]
        i ? e.removeAttributeNS(i, n) : e.removeAttribute(`${r}:${n}`)
      } else e.removeAttribute(n)
    }
    addClass(e, n) {
      e.classList.add(n)
    }
    removeClass(e, n) {
      e.classList.remove(n)
    }
    setStyle(e, n, r, i) {
      i & (ft.DashCase | ft.Important)
        ? e.style.setProperty(n, r, i & ft.Important ? 'important' : '')
        : (e.style[n] = r)
    }
    removeStyle(e, n, r) {
      r & ft.DashCase ? e.style.removeProperty(n) : (e.style[n] = '')
    }
    setProperty(e, n, r) {
      e != null && (e[n] = r)
    }
    setValue(e, n) {
      e.nodeValue = n
    }
    listen(e, n, r) {
      if (
        typeof e == 'string' &&
        ((e = Vu().getGlobalEventTarget(this.doc, e)), !e)
      )
        throw new Error(`Unsupported event target ${e} for event ${n}`)
      return this.eventManager.addEventListener(
        e,
        n,
        this.decoratePreventDefault(r)
      )
    }
    decoratePreventDefault(e) {
      return (n) => {
        if (n === '__ngUnwrap__') return e
        ;(this.platformIsServer ? this.ngZone.runGuarded(() => e(n)) : e(n)) ===
          !1 && n.preventDefault()
      }
    }
  }
function wm(t) {
  return t.tagName === 'TEMPLATE' && t.content !== void 0
}
var Gu = class extends ei {
    constructor(e, n, r, i, s, o, a, c) {
      super(e, s, o, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot)
      let u = Am(i.id, i.styles)
      for (let l of u) {
        let d = document.createElement('style')
        a && d.setAttribute('nonce', a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d)
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e
    }
    appendChild(e, n) {
      return super.appendChild(this.nodeOrShadowRoot(e), n)
    }
    insertBefore(e, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(e), n, r)
    }
    removeChild(e, n) {
      return super.removeChild(this.nodeOrShadowRoot(e), n)
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)))
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot)
    }
  },
  ti = class extends ei {
    constructor(e, n, r, i, s, o, a, c) {
      super(e, s, o, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? Am(c, r.styles) : r.styles)
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles)
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles)
    }
  },
  ao = class extends ti {
    constructor(e, n, r, i, s, o, a, c) {
      let u = i + '-' + r.id
      super(e, n, r, s, o, a, c, u),
        (this.contentAttr = wC(u)),
        (this.hostAttr = DC(u))
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, '')
    }
    createElement(e, n) {
      let r = super.createElement(e, n)
      return super.setAttribute(r, this.contentAttr, ''), r
    }
  },
  TC = (() => {
    let e = class e extends oo {
      constructor(r) {
        super(r)
      }
      supports(r) {
        return !0
      }
      addEventListener(r, i, s) {
        return (
          r.addEventListener(i, s, !1), () => this.removeEventListener(r, i, s)
        )
      }
      removeEventListener(r, i, s) {
        return r.removeEventListener(i, s)
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(k(Pt))
    }),
      (e.ɵprov = K({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  Dm = ['alt', 'control', 'meta', 'shift'],
  CC = {
    '\b': 'Backspace',
    '	': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    Del: 'Delete',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Menu: 'ContextMenu',
    Scroll: 'ScrollLock',
    Win: 'OS',
  },
  bC = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  AC = (() => {
    let e = class e extends oo {
      constructor(r) {
        super(r)
      }
      supports(r) {
        return e.parseEventName(r) != null
      }
      addEventListener(r, i, s) {
        let o = e.parseEventName(i),
          a = e.eventCallback(o.fullKey, s, this.manager.getZone())
        return this.manager
          .getZone()
          .runOutsideAngular(() => Vu().onAndCancel(r, o.domEventName, a))
      }
      static parseEventName(r) {
        let i = r.toLowerCase().split('.'),
          s = i.shift()
        if (i.length === 0 || !(s === 'keydown' || s === 'keyup')) return null
        let o = e._normalizeKey(i.pop()),
          a = '',
          c = i.indexOf('code')
        if (
          (c > -1 && (i.splice(c, 1), (a = 'code.')),
          Dm.forEach((l) => {
            let d = i.indexOf(l)
            d > -1 && (i.splice(d, 1), (a += l + '.'))
          }),
          (a += o),
          i.length != 0 || o.length === 0)
        )
          return null
        let u = {}
        return (u.domEventName = s), (u.fullKey = a), u
      }
      static matchEventFullKeyCode(r, i) {
        let s = CC[r.key] || r.key,
          o = ''
        return (
          i.indexOf('code.') > -1 && ((s = r.code), (o = 'code.')),
          s == null || !s
            ? !1
            : ((s = s.toLowerCase()),
              s === ' ' ? (s = 'space') : s === '.' && (s = 'dot'),
              Dm.forEach((a) => {
                if (a !== s) {
                  let c = bC[a]
                  c(r) && (o += a + '.')
                }
              }),
              (o += s),
              o === i)
        )
      }
      static eventCallback(r, i, s) {
        return (o) => {
          e.matchEventFullKeyCode(o, r) && s.runGuarded(() => i(o))
        }
      }
      static _normalizeKey(r) {
        return r === 'esc' ? 'escape' : r
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(k(Pt))
    }),
      (e.ɵprov = K({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })()
function Sm(t, e) {
  return gm(We({ rootComponent: t }, SC(e)))
}
function SC(t) {
  return {
    appProviders: [...PC, ...(t?.providers ?? [])],
    platformProviders: MC,
  }
}
function NC() {
  qu.makeCurrent()
}
function RC() {
  return new pt()
}
function xC() {
  return Dg(document), document
}
var MC = [
  { provide: xt, useValue: Im },
  { provide: hu, useValue: NC, multi: !0 },
  { provide: Pt, useFactory: xC, deps: [] },
]
var PC = [
  { provide: Ws, useValue: 'root' },
  { provide: pt, useFactory: RC, deps: [] },
  { provide: zu, useClass: TC, multi: !0, deps: [Pt, Q, xt] },
  { provide: zu, useClass: AC, multi: !0, deps: [Pt] },
  Em,
  Cm,
  Tm,
  { provide: Gr, useExisting: Em },
  { provide: so, useClass: yC, deps: [] },
  [],
]
var Rm = function (t) {
    let e = [],
      n = 0
    for (let r = 0; r < t.length; r++) {
      let i = t.charCodeAt(r)
      i < 128
        ? (e[n++] = i)
        : i < 2048
          ? ((e[n++] = (i >> 6) | 192), (e[n++] = (i & 63) | 128))
          : (i & 64512) === 55296 &&
              r + 1 < t.length &&
              (t.charCodeAt(r + 1) & 64512) === 56320
            ? ((i = 65536 + ((i & 1023) << 10) + (t.charCodeAt(++r) & 1023)),
              (e[n++] = (i >> 18) | 240),
              (e[n++] = ((i >> 12) & 63) | 128),
              (e[n++] = ((i >> 6) & 63) | 128),
              (e[n++] = (i & 63) | 128))
            : ((e[n++] = (i >> 12) | 224),
              (e[n++] = ((i >> 6) & 63) | 128),
              (e[n++] = (i & 63) | 128))
    }
    return e
  },
  OC = function (t) {
    let e = [],
      n = 0,
      r = 0
    for (; n < t.length; ) {
      let i = t[n++]
      if (i < 128) e[r++] = String.fromCharCode(i)
      else if (i > 191 && i < 224) {
        let s = t[n++]
        e[r++] = String.fromCharCode(((i & 31) << 6) | (s & 63))
      } else if (i > 239 && i < 365) {
        let s = t[n++],
          o = t[n++],
          a = t[n++],
          c =
            (((i & 7) << 18) | ((s & 63) << 12) | ((o & 63) << 6) | (a & 63)) -
            65536
        ;(e[r++] = String.fromCharCode(55296 + (c >> 10))),
          (e[r++] = String.fromCharCode(56320 + (c & 1023)))
      } else {
        let s = t[n++],
          o = t[n++]
        e[r++] = String.fromCharCode(
          ((i & 15) << 12) | ((s & 63) << 6) | (o & 63)
        )
      }
    }
    return e.join('')
  },
  xm = {
    byteToCharMap_: null,
    charToByteMap_: null,
    byteToCharMapWebSafe_: null,
    charToByteMapWebSafe_: null,
    ENCODED_VALS_BASE:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    get ENCODED_VALS() {
      return this.ENCODED_VALS_BASE + '+/='
    },
    get ENCODED_VALS_WEBSAFE() {
      return this.ENCODED_VALS_BASE + '-_.'
    },
    HAS_NATIVE_SUPPORT: typeof atob == 'function',
    encodeByteArray(t, e) {
      if (!Array.isArray(t))
        throw Error('encodeByteArray takes an array as a parameter')
      this.init_()
      let n = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
        r = []
      for (let i = 0; i < t.length; i += 3) {
        let s = t[i],
          o = i + 1 < t.length,
          a = o ? t[i + 1] : 0,
          c = i + 2 < t.length,
          u = c ? t[i + 2] : 0,
          l = s >> 2,
          d = ((s & 3) << 4) | (a >> 4),
          h = ((a & 15) << 2) | (u >> 6),
          f = u & 63
        c || ((f = 64), o || (h = 64)), r.push(n[l], n[d], n[h], n[f])
      }
      return r.join('')
    },
    encodeString(t, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? btoa(t)
        : this.encodeByteArray(Rm(t), e)
    },
    decodeString(t, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? atob(t)
        : OC(this.decodeStringToByteArray(t, e))
    },
    decodeStringToByteArray(t, e) {
      this.init_()
      let n = e ? this.charToByteMapWebSafe_ : this.charToByteMap_,
        r = []
      for (let i = 0; i < t.length; ) {
        let s = n[t.charAt(i++)],
          a = i < t.length ? n[t.charAt(i)] : 0
        ++i
        let u = i < t.length ? n[t.charAt(i)] : 64
        ++i
        let d = i < t.length ? n[t.charAt(i)] : 64
        if ((++i, s == null || a == null || u == null || d == null))
          throw new Qu()
        let h = (s << 2) | (a >> 4)
        if ((r.push(h), u !== 64)) {
          let f = ((a << 4) & 240) | (u >> 2)
          if ((r.push(f), d !== 64)) {
            let _ = ((u << 6) & 192) | d
            r.push(_)
          }
        }
      }
      return r
    },
    init_() {
      if (!this.byteToCharMap_) {
        ;(this.byteToCharMap_ = {}),
          (this.charToByteMap_ = {}),
          (this.byteToCharMapWebSafe_ = {}),
          (this.charToByteMapWebSafe_ = {})
        for (let t = 0; t < this.ENCODED_VALS.length; t++)
          (this.byteToCharMap_[t] = this.ENCODED_VALS.charAt(t)),
            (this.charToByteMap_[this.byteToCharMap_[t]] = t),
            (this.byteToCharMapWebSafe_[t] =
              this.ENCODED_VALS_WEBSAFE.charAt(t)),
            (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]] = t),
            t >= this.ENCODED_VALS_BASE.length &&
              ((this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)] = t),
              (this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)] = t))
      }
    },
  },
  Qu = class extends Error {
    constructor() {
      super(...arguments), (this.name = 'DecodeBase64StringError')
    }
  },
  kC = function (t) {
    let e = Rm(t)
    return xm.encodeByteArray(e, !0)
  },
  ni = function (t) {
    return kC(t).replace(/\./g, '')
  },
  Ju = function (t) {
    try {
      return xm.decodeString(t, !0)
    } catch (e) {
      console.error('base64Decode failed: ', e)
    }
    return null
  }
function FC() {
  if (typeof self < 'u') return self
  if (typeof window < 'u') return window
  if (typeof global < 'u') return global
  throw new Error('Unable to locate global object.')
}
var LC = () => FC().__FIREBASE_DEFAULTS__,
  VC = () => {
    if (typeof process > 'u' || typeof process.env > 'u') return
    let t = process.env.__FIREBASE_DEFAULTS__
    if (t) return JSON.parse(t)
  },
  UC = () => {
    if (typeof document > 'u') return
    let t
    try {
      t = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)
    } catch {
      return
    }
    let e = t && Ju(t[1])
    return e && JSON.parse(e)
  },
  uo = () => {
    try {
      return LC() || VC() || UC()
    } catch (t) {
      console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`)
      return
    }
  },
  Mm = (t) => {
    var e, n
    return (n =
      (e = uo()) === null || e === void 0 ? void 0 : e.emulatorHosts) ===
      null || n === void 0
      ? void 0
      : n[t]
  },
  Pm = (t) => {
    let e = Mm(t)
    if (!e) return
    let n = e.lastIndexOf(':')
    if (n <= 0 || n + 1 === e.length)
      throw new Error(`Invalid host ${e} with no separate hostname and port!`)
    let r = parseInt(e.substring(n + 1), 10)
    return e[0] === '[' ? [e.substring(1, n - 1), r] : [e.substring(0, n), r]
  },
  Zu = () => {
    var t
    return (t = uo()) === null || t === void 0 ? void 0 : t.config
  },
  Om = (t) => {
    var e
    return (e = uo()) === null || e === void 0 ? void 0 : e[`_${t}`]
  }
var co = class {
  constructor() {
    ;(this.reject = () => {}),
      (this.resolve = () => {}),
      (this.promise = new Promise((e, n) => {
        ;(this.resolve = e), (this.reject = n)
      }))
  }
  wrapCallback(e) {
    return (n, r) => {
      n ? this.reject(n) : this.resolve(r),
        typeof e == 'function' &&
          (this.promise.catch(() => {}), e.length === 1 ? e(n) : e(n, r))
    }
  }
}
function km(t, e) {
  if (t.uid)
    throw new Error(
      'The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.'
    )
  let n = { alg: 'none', type: 'JWT' },
    r = e || 'demo-project',
    i = t.iat || 0,
    s = t.sub || t.user_id
  if (!s)
    throw new Error("mockUserToken must contain 'sub' or 'user_id' field!")
  let o = Object.assign(
    {
      iss: `https://securetoken.google.com/${r}`,
      aud: r,
      iat: i,
      exp: i + 3600,
      auth_time: i,
      sub: s,
      user_id: s,
      firebase: { sign_in_provider: 'custom', identities: {} },
    },
    t
  )
  return [ni(JSON.stringify(n)), ni(JSON.stringify(o)), ''].join('.')
}
function me() {
  return typeof navigator < 'u' && typeof navigator.userAgent == 'string'
    ? navigator.userAgent
    : ''
}
function Fm() {
  return (
    typeof window < 'u' &&
    !!(window.cordova || window.phonegap || window.PhoneGap) &&
    /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(me())
  )
}
function jC() {
  var t
  let e = (t = uo()) === null || t === void 0 ? void 0 : t.forceEnvironment
  if (e === 'node') return !0
  if (e === 'browser') return !1
  try {
    return Object.prototype.toString.call(global.process) === '[object process]'
  } catch {
    return !1
  }
}
function Lm() {
  let t =
    typeof chrome == 'object'
      ? chrome.runtime
      : typeof browser == 'object'
        ? browser.runtime
        : void 0
  return typeof t == 'object' && t.id !== void 0
}
function Vm() {
  return typeof navigator == 'object' && navigator.product === 'ReactNative'
}
function Um() {
  return (
    !jC() &&
    navigator.userAgent.includes('Safari') &&
    !navigator.userAgent.includes('Chrome')
  )
}
function lo() {
  try {
    return typeof indexedDB == 'object'
  } catch {
    return !1
  }
}
function jm() {
  return new Promise((t, e) => {
    try {
      let n = !0,
        r = 'validate-browser-context-for-indexeddb-analytics-module',
        i = self.indexedDB.open(r)
      ;(i.onsuccess = () => {
        i.result.close(), n || self.indexedDB.deleteDatabase(r), t(!0)
      }),
        (i.onupgradeneeded = () => {
          n = !1
        }),
        (i.onerror = () => {
          var s
          e(((s = i.error) === null || s === void 0 ? void 0 : s.message) || '')
        })
    } catch (n) {
      e(n)
    }
  })
}
var BC = 'FirebaseError',
  Ne = class t extends Error {
    constructor(e, n, r) {
      super(n),
        (this.code = e),
        (this.customData = r),
        (this.name = BC),
        Object.setPrototypeOf(this, t.prototype),
        Error.captureStackTrace &&
          Error.captureStackTrace(this, It.prototype.create)
    }
  },
  It = class {
    constructor(e, n, r) {
      ;(this.service = e), (this.serviceName = n), (this.errors = r)
    }
    create(e, ...n) {
      let r = n[0] || {},
        i = `${this.service}/${e}`,
        s = this.errors[e],
        o = s ? $C(s, r) : 'Error',
        a = `${this.serviceName}: ${o} (${i}).`
      return new Ne(i, a, r)
    }
  }
function $C(t, e) {
  return t.replace(HC, (n, r) => {
    let i = e[r]
    return i != null ? String(i) : `<${r}?>`
  })
}
var HC = /\{\$([^}]+)}/g
function Yn(t, e) {
  if (t === e) return !0
  let n = Object.keys(t),
    r = Object.keys(e)
  for (let i of n) {
    if (!r.includes(i)) return !1
    let s = t[i],
      o = e[i]
    if (Nm(s) && Nm(o)) {
      if (!Yn(s, o)) return !1
    } else if (s !== o) return !1
  }
  for (let i of r) if (!n.includes(i)) return !1
  return !0
}
function Nm(t) {
  return t !== null && typeof t == 'object'
}
function Xu(t) {
  let e = []
  for (let [n, r] of Object.entries(t))
    Array.isArray(r)
      ? r.forEach((i) => {
          e.push(encodeURIComponent(n) + '=' + encodeURIComponent(i))
        })
      : e.push(encodeURIComponent(n) + '=' + encodeURIComponent(r))
  return e.length ? '&' + e.join('&') : ''
}
function Bm(t, e) {
  let n = new Yu(t, e)
  return n.subscribe.bind(n)
}
var Yu = class {
  constructor(e, n) {
    ;(this.observers = []),
      (this.unsubscribes = []),
      (this.observerCount = 0),
      (this.task = Promise.resolve()),
      (this.finalized = !1),
      (this.onNoObservers = n),
      this.task
        .then(() => {
          e(this)
        })
        .catch((r) => {
          this.error(r)
        })
  }
  next(e) {
    this.forEachObserver((n) => {
      n.next(e)
    })
  }
  error(e) {
    this.forEachObserver((n) => {
      n.error(e)
    }),
      this.close(e)
  }
  complete() {
    this.forEachObserver((e) => {
      e.complete()
    }),
      this.close()
  }
  subscribe(e, n, r) {
    let i
    if (e === void 0 && n === void 0 && r === void 0)
      throw new Error('Missing Observer.')
    qC(e, ['next', 'error', 'complete'])
      ? (i = e)
      : (i = { next: e, error: n, complete: r }),
      i.next === void 0 && (i.next = Ku),
      i.error === void 0 && (i.error = Ku),
      i.complete === void 0 && (i.complete = Ku)
    let s = this.unsubscribeOne.bind(this, this.observers.length)
    return (
      this.finalized &&
        this.task.then(() => {
          try {
            this.finalError ? i.error(this.finalError) : i.complete()
          } catch {}
        }),
      this.observers.push(i),
      s
    )
  }
  unsubscribeOne(e) {
    this.observers === void 0 ||
      this.observers[e] === void 0 ||
      (delete this.observers[e],
      (this.observerCount -= 1),
      this.observerCount === 0 &&
        this.onNoObservers !== void 0 &&
        this.onNoObservers(this))
  }
  forEachObserver(e) {
    if (!this.finalized)
      for (let n = 0; n < this.observers.length; n++) this.sendOne(n, e)
  }
  sendOne(e, n) {
    this.task.then(() => {
      if (this.observers !== void 0 && this.observers[e] !== void 0)
        try {
          n(this.observers[e])
        } catch (r) {
          typeof console < 'u' && console.error && console.error(r)
        }
    })
  }
  close(e) {
    this.finalized ||
      ((this.finalized = !0),
      e !== void 0 && (this.finalError = e),
      this.task.then(() => {
        ;(this.observers = void 0), (this.onNoObservers = void 0)
      }))
  }
}
function qC(t, e) {
  if (typeof t != 'object' || t === null) return !1
  for (let n of e) if (n in t && typeof t[n] == 'function') return !0
  return !1
}
function Ku() {}
var UP = 4 * 60 * 60 * 1e3
function Ot(t) {
  return t && t._delegate ? t._delegate : t
}
var Re = class {
  constructor(e, n, r) {
    ;(this.name = e),
      (this.instanceFactory = n),
      (this.type = r),
      (this.multipleInstances = !1),
      (this.serviceProps = {}),
      (this.instantiationMode = 'LAZY'),
      (this.onInstanceCreated = null)
  }
  setInstantiationMode(e) {
    return (this.instantiationMode = e), this
  }
  setMultipleInstances(e) {
    return (this.multipleInstances = e), this
  }
  setServiceProps(e) {
    return (this.serviceProps = e), this
  }
  setInstanceCreatedCallback(e) {
    return (this.onInstanceCreated = e), this
  }
}
var on = '[DEFAULT]'
var el = class {
  constructor(e, n) {
    ;(this.name = e),
      (this.container = n),
      (this.component = null),
      (this.instances = new Map()),
      (this.instancesDeferred = new Map()),
      (this.instancesOptions = new Map()),
      (this.onInitCallbacks = new Map())
  }
  get(e) {
    let n = this.normalizeInstanceIdentifier(e)
    if (!this.instancesDeferred.has(n)) {
      let r = new co()
      if (
        (this.instancesDeferred.set(n, r),
        this.isInitialized(n) || this.shouldAutoInitialize())
      )
        try {
          let i = this.getOrInitializeService({ instanceIdentifier: n })
          i && r.resolve(i)
        } catch {}
    }
    return this.instancesDeferred.get(n).promise
  }
  getImmediate(e) {
    var n
    let r = this.normalizeInstanceIdentifier(e?.identifier),
      i = (n = e?.optional) !== null && n !== void 0 ? n : !1
    if (this.isInitialized(r) || this.shouldAutoInitialize())
      try {
        return this.getOrInitializeService({ instanceIdentifier: r })
      } catch (s) {
        if (i) return null
        throw s
      }
    else {
      if (i) return null
      throw Error(`Service ${this.name} is not available`)
    }
  }
  getComponent() {
    return this.component
  }
  setComponent(e) {
    if (e.name !== this.name)
      throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`)
    if (this.component)
      throw Error(`Component for ${this.name} has already been provided`)
    if (((this.component = e), !!this.shouldAutoInitialize())) {
      if (GC(e))
        try {
          this.getOrInitializeService({ instanceIdentifier: on })
        } catch {}
      for (let [n, r] of this.instancesDeferred.entries()) {
        let i = this.normalizeInstanceIdentifier(n)
        try {
          let s = this.getOrInitializeService({ instanceIdentifier: i })
          r.resolve(s)
        } catch {}
      }
    }
  }
  clearInstance(e = on) {
    this.instancesDeferred.delete(e),
      this.instancesOptions.delete(e),
      this.instances.delete(e)
  }
  delete() {
    return p(this, null, function* () {
      let e = Array.from(this.instances.values())
      yield Promise.all([
        ...e.filter((n) => 'INTERNAL' in n).map((n) => n.INTERNAL.delete()),
        ...e.filter((n) => '_delete' in n).map((n) => n._delete()),
      ])
    })
  }
  isComponentSet() {
    return this.component != null
  }
  isInitialized(e = on) {
    return this.instances.has(e)
  }
  getOptions(e = on) {
    return this.instancesOptions.get(e) || {}
  }
  initialize(e = {}) {
    let { options: n = {} } = e,
      r = this.normalizeInstanceIdentifier(e.instanceIdentifier)
    if (this.isInitialized(r))
      throw Error(`${this.name}(${r}) has already been initialized`)
    if (!this.isComponentSet())
      throw Error(`Component ${this.name} has not been registered yet`)
    let i = this.getOrInitializeService({ instanceIdentifier: r, options: n })
    for (let [s, o] of this.instancesDeferred.entries()) {
      let a = this.normalizeInstanceIdentifier(s)
      r === a && o.resolve(i)
    }
    return i
  }
  onInit(e, n) {
    var r
    let i = this.normalizeInstanceIdentifier(n),
      s =
        (r = this.onInitCallbacks.get(i)) !== null && r !== void 0
          ? r
          : new Set()
    s.add(e), this.onInitCallbacks.set(i, s)
    let o = this.instances.get(i)
    return (
      o && e(o, i),
      () => {
        s.delete(e)
      }
    )
  }
  invokeOnInitCallbacks(e, n) {
    let r = this.onInitCallbacks.get(n)
    if (r)
      for (let i of r)
        try {
          i(e, n)
        } catch {}
  }
  getOrInitializeService({ instanceIdentifier: e, options: n = {} }) {
    let r = this.instances.get(e)
    if (
      !r &&
      this.component &&
      ((r = this.component.instanceFactory(this.container, {
        instanceIdentifier: zC(e),
        options: n,
      })),
      this.instances.set(e, r),
      this.instancesOptions.set(e, n),
      this.invokeOnInitCallbacks(r, e),
      this.component.onInstanceCreated)
    )
      try {
        this.component.onInstanceCreated(this.container, e, r)
      } catch {}
    return r || null
  }
  normalizeInstanceIdentifier(e = on) {
    return this.component ? (this.component.multipleInstances ? e : on) : e
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== 'EXPLICIT'
  }
}
function zC(t) {
  return t === on ? void 0 : t
}
function GC(t) {
  return t.instantiationMode === 'EAGER'
}
var ho = class {
  constructor(e) {
    ;(this.name = e), (this.providers = new Map())
  }
  addComponent(e) {
    let n = this.getProvider(e.name)
    if (n.isComponentSet())
      throw new Error(
        `Component ${e.name} has already been registered with ${this.name}`
      )
    n.setComponent(e)
  }
  addOrOverwriteComponent(e) {
    this.getProvider(e.name).isComponentSet() && this.providers.delete(e.name),
      this.addComponent(e)
  }
  getProvider(e) {
    if (this.providers.has(e)) return this.providers.get(e)
    let n = new el(e, this)
    return this.providers.set(e, n), n
  }
  getProviders() {
    return Array.from(this.providers.values())
  }
}
var WC = [],
  N = (function (t) {
    return (
      (t[(t.DEBUG = 0)] = 'DEBUG'),
      (t[(t.VERBOSE = 1)] = 'VERBOSE'),
      (t[(t.INFO = 2)] = 'INFO'),
      (t[(t.WARN = 3)] = 'WARN'),
      (t[(t.ERROR = 4)] = 'ERROR'),
      (t[(t.SILENT = 5)] = 'SILENT'),
      t
    )
  })(N || {}),
  KC = {
    debug: N.DEBUG,
    verbose: N.VERBOSE,
    info: N.INFO,
    warn: N.WARN,
    error: N.ERROR,
    silent: N.SILENT,
  },
  QC = N.INFO,
  YC = {
    [N.DEBUG]: 'log',
    [N.VERBOSE]: 'log',
    [N.INFO]: 'info',
    [N.WARN]: 'warn',
    [N.ERROR]: 'error',
  },
  JC = (t, e, ...n) => {
    if (e < t.logLevel) return
    let r = new Date().toISOString(),
      i = YC[e]
    if (i) console[i](`[${r}]  ${t.name}:`, ...n)
    else
      throw new Error(
        `Attempted to log a message with an invalid logType (value: ${e})`
      )
  },
  kt = class {
    constructor(e) {
      ;(this.name = e),
        (this._logLevel = QC),
        (this._logHandler = JC),
        (this._userLogHandler = null),
        WC.push(this)
    }
    get logLevel() {
      return this._logLevel
    }
    set logLevel(e) {
      if (!(e in N))
        throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``)
      this._logLevel = e
    }
    setLogLevel(e) {
      this._logLevel = typeof e == 'string' ? KC[e] : e
    }
    get logHandler() {
      return this._logHandler
    }
    set logHandler(e) {
      if (typeof e != 'function')
        throw new TypeError('Value assigned to `logHandler` must be a function')
      this._logHandler = e
    }
    get userLogHandler() {
      return this._userLogHandler
    }
    set userLogHandler(e) {
      this._userLogHandler = e
    }
    debug(...e) {
      this._userLogHandler && this._userLogHandler(this, N.DEBUG, ...e),
        this._logHandler(this, N.DEBUG, ...e)
    }
    log(...e) {
      this._userLogHandler && this._userLogHandler(this, N.VERBOSE, ...e),
        this._logHandler(this, N.VERBOSE, ...e)
    }
    info(...e) {
      this._userLogHandler && this._userLogHandler(this, N.INFO, ...e),
        this._logHandler(this, N.INFO, ...e)
    }
    warn(...e) {
      this._userLogHandler && this._userLogHandler(this, N.WARN, ...e),
        this._logHandler(this, N.WARN, ...e)
    }
    error(...e) {
      this._userLogHandler && this._userLogHandler(this, N.ERROR, ...e),
        this._logHandler(this, N.ERROR, ...e)
    }
  }
var ZC = (t, e) => e.some((n) => t instanceof n),
  $m,
  Hm
function XC() {
  return (
    $m ||
    ($m = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
  )
}
function e0() {
  return (
    Hm ||
    (Hm = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey,
    ])
  )
}
var qm = new WeakMap(),
  nl = new WeakMap(),
  zm = new WeakMap(),
  tl = new WeakMap(),
  il = new WeakMap()
function t0(t) {
  let e = new Promise((n, r) => {
    let i = () => {
        t.removeEventListener('success', s), t.removeEventListener('error', o)
      },
      s = () => {
        n(et(t.result)), i()
      },
      o = () => {
        r(t.error), i()
      }
    t.addEventListener('success', s), t.addEventListener('error', o)
  })
  return (
    e
      .then((n) => {
        n instanceof IDBCursor && qm.set(n, t)
      })
      .catch(() => {}),
    il.set(e, t),
    e
  )
}
function n0(t) {
  if (nl.has(t)) return
  let e = new Promise((n, r) => {
    let i = () => {
        t.removeEventListener('complete', s),
          t.removeEventListener('error', o),
          t.removeEventListener('abort', o)
      },
      s = () => {
        n(), i()
      },
      o = () => {
        r(t.error || new DOMException('AbortError', 'AbortError')), i()
      }
    t.addEventListener('complete', s),
      t.addEventListener('error', o),
      t.addEventListener('abort', o)
  })
  nl.set(t, e)
}
var rl = {
  get(t, e, n) {
    if (t instanceof IDBTransaction) {
      if (e === 'done') return nl.get(t)
      if (e === 'objectStoreNames') return t.objectStoreNames || zm.get(t)
      if (e === 'store')
        return n.objectStoreNames[1]
          ? void 0
          : n.objectStore(n.objectStoreNames[0])
    }
    return et(t[e])
  },
  set(t, e, n) {
    return (t[e] = n), !0
  },
  has(t, e) {
    return t instanceof IDBTransaction && (e === 'done' || e === 'store')
      ? !0
      : e in t
  },
}
function Gm(t) {
  rl = t(rl)
}
function r0(t) {
  return t === IDBDatabase.prototype.transaction &&
    !('objectStoreNames' in IDBTransaction.prototype)
    ? function (e, ...n) {
        let r = t.call(fo(this), e, ...n)
        return zm.set(r, e.sort ? e.sort() : [e]), et(r)
      }
    : e0().includes(t)
      ? function (...e) {
          return t.apply(fo(this), e), et(qm.get(this))
        }
      : function (...e) {
          return et(t.apply(fo(this), e))
        }
}
function i0(t) {
  return typeof t == 'function'
    ? r0(t)
    : (t instanceof IDBTransaction && n0(t), ZC(t, XC()) ? new Proxy(t, rl) : t)
}
function et(t) {
  if (t instanceof IDBRequest) return t0(t)
  if (tl.has(t)) return tl.get(t)
  let e = i0(t)
  return e !== t && (tl.set(t, e), il.set(e, t)), e
}
var fo = (t) => il.get(t)
function Km(t, e, { blocked: n, upgrade: r, blocking: i, terminated: s } = {}) {
  let o = indexedDB.open(t, e),
    a = et(o)
  return (
    r &&
      o.addEventListener('upgradeneeded', (c) => {
        r(et(o.result), c.oldVersion, c.newVersion, et(o.transaction), c)
      }),
    n && o.addEventListener('blocked', (c) => n(c.oldVersion, c.newVersion, c)),
    a
      .then((c) => {
        s && c.addEventListener('close', () => s()),
          i &&
            c.addEventListener('versionchange', (u) =>
              i(u.oldVersion, u.newVersion, u)
            )
      })
      .catch(() => {}),
    a
  )
}
var s0 = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
  o0 = ['put', 'add', 'delete', 'clear'],
  sl = new Map()
function Wm(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == 'string')) return
  if (sl.get(e)) return sl.get(e)
  let n = e.replace(/FromIndex$/, ''),
    r = e !== n,
    i = o0.includes(n)
  if (
    !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
    !(i || s0.includes(n))
  )
    return
  let s = function (o, ...a) {
    return p(this, null, function* () {
      let c = this.transaction(o, i ? 'readwrite' : 'readonly'),
        u = c.store
      return (
        r && (u = u.index(a.shift())),
        (yield Promise.all([u[n](...a), i && c.done]))[0]
      )
    })
  }
  return sl.set(e, s), s
}
Gm((t) =>
  lt(We({}, t), {
    get: (e, n, r) => Wm(e, n) || t.get(e, n, r),
    has: (e, n) => !!Wm(e, n) || t.has(e, n),
  })
)
var al = class {
  constructor(e) {
    this.container = e
  }
  getPlatformInfoString() {
    return this.container
      .getProviders()
      .map((n) => {
        if (a0(n)) {
          let r = n.getImmediate()
          return `${r.library}/${r.version}`
        } else return null
      })
      .filter((n) => n)
      .join(' ')
  }
}
function a0(t) {
  let e = t.getComponent()
  return e?.type === 'VERSION'
}
var cl = '@firebase/app',
  Qm = '0.9.26'
var an = new kt('@firebase/app'),
  c0 = '@firebase/app-compat',
  u0 = '@firebase/analytics-compat',
  l0 = '@firebase/analytics',
  d0 = '@firebase/app-check-compat',
  h0 = '@firebase/app-check',
  f0 = '@firebase/auth',
  p0 = '@firebase/auth-compat',
  g0 = '@firebase/database',
  m0 = '@firebase/database-compat',
  y0 = '@firebase/functions',
  v0 = '@firebase/functions-compat',
  _0 = '@firebase/installations',
  I0 = '@firebase/installations-compat',
  E0 = '@firebase/messaging',
  w0 = '@firebase/messaging-compat',
  D0 = '@firebase/performance',
  T0 = '@firebase/performance-compat',
  C0 = '@firebase/remote-config',
  b0 = '@firebase/remote-config-compat',
  A0 = '@firebase/storage',
  S0 = '@firebase/storage-compat',
  N0 = '@firebase/firestore',
  R0 = '@firebase/firestore-compat',
  x0 = 'firebase',
  M0 = '10.7.2'
var ul = '[DEFAULT]',
  P0 = {
    [cl]: 'fire-core',
    [c0]: 'fire-core-compat',
    [l0]: 'fire-analytics',
    [u0]: 'fire-analytics-compat',
    [h0]: 'fire-app-check',
    [d0]: 'fire-app-check-compat',
    [f0]: 'fire-auth',
    [p0]: 'fire-auth-compat',
    [g0]: 'fire-rtdb',
    [m0]: 'fire-rtdb-compat',
    [y0]: 'fire-fn',
    [v0]: 'fire-fn-compat',
    [_0]: 'fire-iid',
    [I0]: 'fire-iid-compat',
    [E0]: 'fire-fcm',
    [w0]: 'fire-fcm-compat',
    [D0]: 'fire-perf',
    [T0]: 'fire-perf-compat',
    [C0]: 'fire-rc',
    [b0]: 'fire-rc-compat',
    [A0]: 'fire-gcs',
    [S0]: 'fire-gcs-compat',
    [N0]: 'fire-fst',
    [R0]: 'fire-fst-compat',
    'fire-js': 'fire-js',
    [x0]: 'fire-js-all',
  }
var ri = new Map(),
  ll = new Map()
function O0(t, e) {
  try {
    t.container.addComponent(e)
  } catch (n) {
    an.debug(
      `Component ${e.name} failed to register with FirebaseApp ${t.name}`,
      n
    )
  }
}
function Lt(t) {
  let e = t.name
  if (ll.has(e))
    return (
      an.debug(`There were multiple attempts to register component ${e}.`), !1
    )
  ll.set(e, t)
  for (let n of ri.values()) O0(n, t)
  return !0
}
function pl(t, e) {
  let n = t.container.getProvider('heartbeat').getImmediate({ optional: !0 })
  return n && n.triggerHeartbeat(), t.container.getProvider(e)
}
var k0 = {
    'no-app':
      "No Firebase App '{$appName}' has been created - call initializeApp() first",
    'bad-app-name': "Illegal App name: '{$appName}",
    'duplicate-app':
      "Firebase App named '{$appName}' already exists with different options or config",
    'app-deleted': "Firebase App named '{$appName}' already deleted",
    'no-options':
      'Need to provide options, when not being deployed to hosting via source.',
    'invalid-app-argument':
      'firebase.{$appName}() takes either no argument or a Firebase App instance.',
    'invalid-log-argument':
      'First argument to `onLog` must be null or a function.',
    'idb-open':
      'Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.',
    'idb-get':
      'Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.',
    'idb-set':
      'Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.',
    'idb-delete':
      'Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.',
  },
  Ft = new It('app', 'Firebase', k0)
var dl = class {
  constructor(e, n, r) {
    ;(this._isDeleted = !1),
      (this._options = Object.assign({}, e)),
      (this._config = Object.assign({}, n)),
      (this._name = n.name),
      (this._automaticDataCollectionEnabled = n.automaticDataCollectionEnabled),
      (this._container = r),
      this.container.addComponent(new Re('app', () => this, 'PUBLIC'))
  }
  get automaticDataCollectionEnabled() {
    return this.checkDestroyed(), this._automaticDataCollectionEnabled
  }
  set automaticDataCollectionEnabled(e) {
    this.checkDestroyed(), (this._automaticDataCollectionEnabled = e)
  }
  get name() {
    return this.checkDestroyed(), this._name
  }
  get options() {
    return this.checkDestroyed(), this._options
  }
  get config() {
    return this.checkDestroyed(), this._config
  }
  get container() {
    return this._container
  }
  get isDeleted() {
    return this._isDeleted
  }
  set isDeleted(e) {
    this._isDeleted = e
  }
  checkDestroyed() {
    if (this.isDeleted) throw Ft.create('app-deleted', { appName: this._name })
  }
}
var Jn = M0
function gl(t, e = {}) {
  let n = t
  typeof e != 'object' && (e = { name: e })
  let r = Object.assign({ name: ul, automaticDataCollectionEnabled: !1 }, e),
    i = r.name
  if (typeof i != 'string' || !i)
    throw Ft.create('bad-app-name', { appName: String(i) })
  if ((n || (n = Zu()), !n)) throw Ft.create('no-options')
  let s = ri.get(i)
  if (s) {
    if (Yn(n, s.options) && Yn(r, s.config)) return s
    throw Ft.create('duplicate-app', { appName: i })
  }
  let o = new ho(i)
  for (let c of ll.values()) o.addComponent(c)
  let a = new dl(n, r, o)
  return ri.set(i, a), a
}
function si(t = ul) {
  let e = ri.get(t)
  if (!e && t === ul && Zu()) return gl()
  if (!e) throw Ft.create('no-app', { appName: t })
  return e
}
function po() {
  return Array.from(ri.values())
}
function oe(t, e, n) {
  var r
  let i = (r = P0[t]) !== null && r !== void 0 ? r : t
  n && (i += `-${n}`)
  let s = i.match(/\s|\//),
    o = e.match(/\s|\//)
  if (s || o) {
    let a = [`Unable to register library "${i}" with version "${e}":`]
    s &&
      a.push(
        `library name "${i}" contains illegal characters (whitespace or "/")`
      ),
      s && o && a.push('and'),
      o &&
        a.push(
          `version name "${e}" contains illegal characters (whitespace or "/")`
        ),
      an.warn(a.join(' '))
    return
  }
  Lt(new Re(`${i}-version`, () => ({ library: i, version: e }), 'VERSION'))
}
var F0 = 'firebase-heartbeat-database',
  L0 = 1,
  ii = 'firebase-heartbeat-store',
  ol = null
function Xm() {
  return (
    ol ||
      (ol = Km(F0, L0, {
        upgrade: (t, e) => {
          switch (e) {
            case 0:
              try {
                t.createObjectStore(ii)
              } catch (n) {
                console.warn(n)
              }
          }
        },
      }).catch((t) => {
        throw Ft.create('idb-open', { originalErrorMessage: t.message })
      })),
    ol
  )
}
function V0(t) {
  return p(this, null, function* () {
    try {
      return yield (yield Xm()).transaction(ii).objectStore(ii).get(ey(t))
    } catch (e) {
      if (e instanceof Ne) an.warn(e.message)
      else {
        let n = Ft.create('idb-get', { originalErrorMessage: e?.message })
        an.warn(n.message)
      }
    }
  })
}
function Ym(t, e) {
  return p(this, null, function* () {
    try {
      let r = (yield Xm()).transaction(ii, 'readwrite')
      yield r.objectStore(ii).put(e, ey(t)), yield r.done
    } catch (n) {
      if (n instanceof Ne) an.warn(n.message)
      else {
        let r = Ft.create('idb-set', { originalErrorMessage: n?.message })
        an.warn(r.message)
      }
    }
  })
}
function ey(t) {
  return `${t.name}!${t.options.appId}`
}
var U0 = 1024,
  j0 = 30 * 24 * 60 * 60 * 1e3,
  hl = class {
    constructor(e) {
      ;(this.container = e), (this._heartbeatsCache = null)
      let n = this.container.getProvider('app').getImmediate()
      ;(this._storage = new fl(n)),
        (this._heartbeatsCachePromise = this._storage
          .read()
          .then((r) => ((this._heartbeatsCache = r), r)))
    }
    triggerHeartbeat() {
      return p(this, null, function* () {
        var e, n
        let i = this.container
            .getProvider('platform-logger')
            .getImmediate()
            .getPlatformInfoString(),
          s = Jm()
        if (
          !(
            ((e = this._heartbeatsCache) === null || e === void 0
              ? void 0
              : e.heartbeats) == null &&
            ((this._heartbeatsCache = yield this._heartbeatsCachePromise),
            ((n = this._heartbeatsCache) === null || n === void 0
              ? void 0
              : n.heartbeats) == null)
          ) &&
          !(
            this._heartbeatsCache.lastSentHeartbeatDate === s ||
            this._heartbeatsCache.heartbeats.some((o) => o.date === s)
          )
        )
          return (
            this._heartbeatsCache.heartbeats.push({ date: s, agent: i }),
            (this._heartbeatsCache.heartbeats =
              this._heartbeatsCache.heartbeats.filter((o) => {
                let a = new Date(o.date).valueOf()
                return Date.now() - a <= j0
              })),
            this._storage.overwrite(this._heartbeatsCache)
          )
      })
    }
    getHeartbeatsHeader() {
      return p(this, null, function* () {
        var e
        if (
          (this._heartbeatsCache === null &&
            (yield this._heartbeatsCachePromise),
          ((e = this._heartbeatsCache) === null || e === void 0
            ? void 0
            : e.heartbeats) == null ||
            this._heartbeatsCache.heartbeats.length === 0)
        )
          return ''
        let n = Jm(),
          { heartbeatsToSend: r, unsentEntries: i } = B0(
            this._heartbeatsCache.heartbeats
          ),
          s = ni(JSON.stringify({ version: 2, heartbeats: r }))
        return (
          (this._heartbeatsCache.lastSentHeartbeatDate = n),
          i.length > 0
            ? ((this._heartbeatsCache.heartbeats = i),
              yield this._storage.overwrite(this._heartbeatsCache))
            : ((this._heartbeatsCache.heartbeats = []),
              this._storage.overwrite(this._heartbeatsCache)),
          s
        )
      })
    }
  }
function Jm() {
  return new Date().toISOString().substring(0, 10)
}
function B0(t, e = U0) {
  let n = [],
    r = t.slice()
  for (let i of t) {
    let s = n.find((o) => o.agent === i.agent)
    if (s) {
      if ((s.dates.push(i.date), Zm(n) > e)) {
        s.dates.pop()
        break
      }
    } else if ((n.push({ agent: i.agent, dates: [i.date] }), Zm(n) > e)) {
      n.pop()
      break
    }
    r = r.slice(1)
  }
  return { heartbeatsToSend: n, unsentEntries: r }
}
var fl = class {
  constructor(e) {
    ;(this.app = e),
      (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck())
  }
  runIndexedDBEnvironmentCheck() {
    return p(this, null, function* () {
      return lo()
        ? jm()
            .then(() => !0)
            .catch(() => !1)
        : !1
    })
  }
  read() {
    return p(this, null, function* () {
      if (yield this._canUseIndexedDBPromise) {
        let n = yield V0(this.app)
        return n?.heartbeats ? n : { heartbeats: [] }
      } else return { heartbeats: [] }
    })
  }
  overwrite(e) {
    return p(this, null, function* () {
      var n
      if (yield this._canUseIndexedDBPromise) {
        let i = yield this.read()
        return Ym(this.app, {
          lastSentHeartbeatDate:
            (n = e.lastSentHeartbeatDate) !== null && n !== void 0
              ? n
              : i.lastSentHeartbeatDate,
          heartbeats: e.heartbeats,
        })
      } else return
    })
  }
  add(e) {
    return p(this, null, function* () {
      var n
      if (yield this._canUseIndexedDBPromise) {
        let i = yield this.read()
        return Ym(this.app, {
          lastSentHeartbeatDate:
            (n = e.lastSentHeartbeatDate) !== null && n !== void 0
              ? n
              : i.lastSentHeartbeatDate,
          heartbeats: [...i.heartbeats, ...e.heartbeats],
        })
      } else return
    })
  }
}
function Zm(t) {
  return ni(JSON.stringify({ version: 2, heartbeats: t })).length
}
function $0(t) {
  Lt(new Re('platform-logger', (e) => new al(e), 'PRIVATE')),
    Lt(new Re('heartbeat', (e) => new hl(e), 'PRIVATE')),
    oe(cl, Qm, t),
    oe(cl, Qm, 'esm2017'),
    oe('fire-js', '')
}
$0('')
var H0 = 'firebase',
  q0 = '10.7.2'
oe(H0, q0, 'app')
var Xn = new nn('ANGULARFIRE2_VERSION')
function yl(t, e, n) {
  if (e) {
    if (e.length === 1) return e[0]
    let s = e.filter((o) => o.app === n)
    if (s.length === 1) return s[0]
  }
  return n.container.getProvider(t).getImmediate({ optional: !0 })
}
var ai = (t, e) => {
    let n = e ? [e] : po(),
      r = []
    return (
      n.forEach((i) => {
        i.container.getProvider(t).instances.forEach((o) => {
          r.includes(o) || r.push(o)
        })
      }),
      r
    )
  },
  oi = class {
    constructor() {
      return ai(z0)
    }
  },
  z0 = 'app-check'
function Zn() {}
var go = class {
    zone
    delegate
    constructor(e, n = tc) {
      ;(this.zone = e), (this.delegate = n)
    }
    now() {
      return this.delegate.now()
    }
    schedule(e, n, r) {
      let i = this.zone,
        s = function (o) {
          i.runGuarded(() => {
            e.apply(this, [o])
          })
        }
      return this.delegate.schedule(s, n, r)
    }
  },
  ml = class {
    zone
    task = null
    constructor(e) {
      this.zone = e
    }
    call(e, n) {
      let r = this.unscheduleTask.bind(this)
      return (
        (this.task = this.zone.run(() =>
          Zone.current.scheduleMacroTask('firebaseZoneBlock', Zn, {}, Zn, Zn)
        )),
        n
          .pipe(ic({ next: r, complete: r, error: r }))
          .subscribe(e)
          .add(r)
      )
    }
    unscheduleTask() {
      setTimeout(() => {
        this.task != null &&
          this.task.state === 'scheduled' &&
          (this.task.invoke(), (this.task = null))
      }, 10)
    }
  },
  ci = (() => {
    class t {
      ngZone
      outsideAngular
      insideAngular
      constructor(n) {
        ;(this.ngZone = n),
          (this.outsideAngular = n.runOutsideAngular(
            () => new go(Zone.current)
          )),
          (this.insideAngular = n.run(() => new go(Zone.current, ec))),
          (globalThis.ɵAngularFireScheduler ||= this)
      }
      static ɵfac = function (r) {
        return new (r || t)(k(Q))
      }
      static ɵprov = K({ token: t, factory: t.ɵfac, providedIn: 'root' })
    }
    return t
  })()
function mo() {
  let t = globalThis.ɵAngularFireScheduler
  if (!t)
    throw new Error(`Either AngularFireModule has not been provided in your AppModule (this can be done manually or implictly using
provideFirebaseApp) or you're calling an AngularFire method outside of an NgModule (which is not supported).`)
  return t
}
function G0(t) {
  return mo().ngZone.runOutsideAngular(() => t())
}
function cn(t) {
  return mo().ngZone.run(() => t())
}
function W0(t) {
  return K0(mo())(t)
}
function K0(t) {
  return function (n) {
    return (
      (n = n.lift(new ml(t.ngZone))),
      n.pipe(ms(t.outsideAngular), gs(t.insideAngular))
    )
  }
}
var Q0 = (t, e) =>
    function () {
      let r = arguments
      return (
        e &&
          setTimeout(() => {
            e.state === 'scheduled' && e.invoke()
          }, 10),
        cn(() => t.apply(void 0, r))
      )
    },
  un = (t, e) =>
    function () {
      let n,
        r = arguments
      for (let s = 0; s < arguments.length; s++)
        typeof r[s] == 'function' &&
          (e &&
            (n ||= cn(() =>
              Zone.current.scheduleMacroTask(
                'firebaseZoneBlock',
                Zn,
                {},
                Zn,
                Zn
              )
            )),
          (r[s] = Q0(r[s], n)))
      let i = G0(() => t.apply(this, r))
      if (!e)
        if (i instanceof Oe) {
          let s = mo()
          return i.pipe(ms(s.outsideAngular), gs(s.insideAngular))
        } else return cn(() => i)
      return i instanceof Oe
        ? i.pipe(W0)
        : i instanceof Promise
          ? cn(
              () =>
                new Promise((s, o) =>
                  i.then(
                    (a) => cn(() => s(a)),
                    (a) => cn(() => o(a))
                  )
                )
            )
          : typeof i == 'function' && n
            ? function () {
                return (
                  setTimeout(() => {
                    n && n.state === 'scheduled' && n.invoke()
                  }, 10),
                  i.apply(this, arguments)
                )
              }
            : cn(() => i)
    }
var ln = class {
    constructor(e) {
      return e
    }
  },
  ui = class {
    constructor() {
      return po()
    }
  }
function Y0(t) {
  return t && t.length === 1 ? t[0] : new ln(si())
}
var vl = new q('angularfire2._apps'),
  J0 = { provide: ln, useFactory: Y0, deps: [[new vt(), vl]] },
  Z0 = { provide: ui, deps: [[new vt(), vl]] }
function X0(t) {
  return (e, n) => {
    let r = e.runOutsideAngular(() => t(n))
    return new ln(r)
  }
}
var eb = (() => {
  class t {
    constructor(n) {
      oe('angularfire', Xn.full, 'core'),
        oe('angularfire', Xn.full, 'app'),
        oe('angular', lm.full, n.toString())
    }
    static ɵfac = function (r) {
      return new (r || t)(k(xt))
    }
    static ɵmod = sn({ type: t })
    static ɵinj = rn({ providers: [J0, Z0] })
  }
  return t
})()
function ty(t, ...e) {
  return {
    ngModule: eb,
    providers: [
      { provide: vl, useFactory: X0(t), multi: !0, deps: [Q, Rt, ci, ...e] },
    ],
  }
}
var ny = un(gl, !0)
function uy() {
  return {
    'dependent-sdk-initialized-before-auth':
      'Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.',
  }
}
var ly = uy,
  dy = new It('auth', 'Firebase', uy())
var _o = new kt('@firebase/auth')
function nb(t, ...e) {
  _o.logLevel <= N.WARN && _o.warn(`Auth (${Jn}): ${t}`, ...e)
}
function vo(t, ...e) {
  _o.logLevel <= N.ERROR && _o.error(`Auth (${Jn}): ${t}`, ...e)
}
function ry(t, ...e) {
  throw Nl(t, ...e)
}
function hy(t, ...e) {
  return Nl(t, ...e)
}
function rb(t, e, n) {
  let r = Object.assign(Object.assign({}, ly()), { [e]: n })
  return new It('auth', 'Firebase', r).create(e, { appName: t.name })
}
function Nl(t, ...e) {
  if (typeof t != 'string') {
    let n = e[0],
      r = [...e.slice(1)]
    return r[0] && (r[0].appName = t.name), t._errorFactory.create(n, ...r)
  }
  return dy.create(t, ...e)
}
function U(t, e, ...n) {
  if (!t) throw Nl(e, ...n)
}
function li(t) {
  let e = 'INTERNAL ASSERTION FAILED: ' + t
  throw (vo(e), new Error(e))
}
function Io(t, e) {
  t || li(e)
}
function ib() {
  return iy() === 'http:' || iy() === 'https:'
}
function iy() {
  var t
  return (
    (typeof self < 'u' &&
      ((t = self.location) === null || t === void 0 ? void 0 : t.protocol)) ||
    null
  )
}
function sb() {
  return typeof navigator < 'u' &&
    navigator &&
    'onLine' in navigator &&
    typeof navigator.onLine == 'boolean' &&
    (ib() || Lm() || 'connection' in navigator)
    ? navigator.onLine
    : !0
}
function ob() {
  if (typeof navigator > 'u') return null
  let t = navigator
  return (t.languages && t.languages[0]) || t.language || null
}
var hn = class {
  constructor(e, n) {
    ;(this.shortDelay = e),
      (this.longDelay = n),
      Io(n > e, 'Short delay should be less than long delay!'),
      (this.isMobile = Fm() || Vm())
  }
  get() {
    return sb()
      ? this.isMobile
        ? this.longDelay
        : this.shortDelay
      : Math.min(5e3, this.shortDelay)
  }
}
function ab(t, e) {
  Io(t.emulator, 'Emulator should always be set here')
  let { url: n } = t.emulator
  return e ? `${n}${e.startsWith('/') ? e.slice(1) : e}` : n
}
var Eo = class {
  static initialize(e, n, r) {
    ;(this.fetchImpl = e),
      n && (this.headersImpl = n),
      r && (this.responseImpl = r)
  }
  static fetch() {
    if (this.fetchImpl) return this.fetchImpl
    if (typeof self < 'u' && 'fetch' in self) return self.fetch
    if (typeof globalThis < 'u' && globalThis.fetch) return globalThis.fetch
    if (typeof fetch < 'u') return fetch
    li(
      'Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    )
  }
  static headers() {
    if (this.headersImpl) return this.headersImpl
    if (typeof self < 'u' && 'Headers' in self) return self.Headers
    if (typeof globalThis < 'u' && globalThis.Headers) return globalThis.Headers
    if (typeof Headers < 'u') return Headers
    li(
      'Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    )
  }
  static response() {
    if (this.responseImpl) return this.responseImpl
    if (typeof self < 'u' && 'Response' in self) return self.Response
    if (typeof globalThis < 'u' && globalThis.Response)
      return globalThis.Response
    if (typeof Response < 'u') return Response
    li(
      'Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    )
  }
}
var cb = {
  CREDENTIAL_MISMATCH: 'custom-token-mismatch',
  MISSING_CUSTOM_TOKEN: 'internal-error',
  INVALID_IDENTIFIER: 'invalid-email',
  MISSING_CONTINUE_URI: 'internal-error',
  INVALID_PASSWORD: 'wrong-password',
  MISSING_PASSWORD: 'missing-password',
  INVALID_LOGIN_CREDENTIALS: 'invalid-credential',
  EMAIL_EXISTS: 'email-already-in-use',
  PASSWORD_LOGIN_DISABLED: 'operation-not-allowed',
  INVALID_IDP_RESPONSE: 'invalid-credential',
  INVALID_PENDING_TOKEN: 'invalid-credential',
  FEDERATED_USER_ID_ALREADY_LINKED: 'credential-already-in-use',
  MISSING_REQ_TYPE: 'internal-error',
  EMAIL_NOT_FOUND: 'user-not-found',
  RESET_PASSWORD_EXCEED_LIMIT: 'too-many-requests',
  EXPIRED_OOB_CODE: 'expired-action-code',
  INVALID_OOB_CODE: 'invalid-action-code',
  MISSING_OOB_CODE: 'internal-error',
  CREDENTIAL_TOO_OLD_LOGIN_AGAIN: 'requires-recent-login',
  INVALID_ID_TOKEN: 'invalid-user-token',
  TOKEN_EXPIRED: 'user-token-expired',
  USER_NOT_FOUND: 'user-token-expired',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'too-many-requests',
  PASSWORD_DOES_NOT_MEET_REQUIREMENTS: 'password-does-not-meet-requirements',
  INVALID_CODE: 'invalid-verification-code',
  INVALID_SESSION_INFO: 'invalid-verification-id',
  INVALID_TEMPORARY_PROOF: 'invalid-credential',
  MISSING_SESSION_INFO: 'missing-verification-id',
  SESSION_EXPIRED: 'code-expired',
  MISSING_ANDROID_PACKAGE_NAME: 'missing-android-pkg-name',
  UNAUTHORIZED_DOMAIN: 'unauthorized-continue-uri',
  INVALID_OAUTH_CLIENT_ID: 'invalid-oauth-client-id',
  ADMIN_ONLY_OPERATION: 'admin-restricted-operation',
  INVALID_MFA_PENDING_CREDENTIAL: 'invalid-multi-factor-session',
  MFA_ENROLLMENT_NOT_FOUND: 'multi-factor-info-not-found',
  MISSING_MFA_ENROLLMENT_ID: 'missing-multi-factor-info',
  MISSING_MFA_PENDING_CREDENTIAL: 'missing-multi-factor-session',
  SECOND_FACTOR_EXISTS: 'second-factor-already-in-use',
  SECOND_FACTOR_LIMIT_EXCEEDED: 'maximum-second-factor-count-exceeded',
  BLOCKING_FUNCTION_ERROR_RESPONSE: 'internal-error',
  RECAPTCHA_NOT_ENABLED: 'recaptcha-not-enabled',
  MISSING_RECAPTCHA_TOKEN: 'missing-recaptcha-token',
  INVALID_RECAPTCHA_TOKEN: 'invalid-recaptcha-token',
  INVALID_RECAPTCHA_ACTION: 'invalid-recaptcha-action',
  MISSING_CLIENT_TYPE: 'missing-client-type',
  MISSING_RECAPTCHA_VERSION: 'missing-recaptcha-version',
  INVALID_RECAPTCHA_VERSION: 'invalid-recaptcha-version',
  INVALID_REQ_TYPE: 'invalid-req-type',
}
var ub = new hn(3e4, 6e4)
function fy(t, e) {
  return t.tenantId && !e.tenantId
    ? Object.assign(Object.assign({}, e), { tenantId: t.tenantId })
    : e
}
function So(s, o, a, c) {
  return p(this, arguments, function* (t, e, n, r, i = {}) {
    return py(t, i, () =>
      p(this, null, function* () {
        let u = {},
          l = {}
        r && (e === 'GET' ? (l = r) : (u = { body: JSON.stringify(r) }))
        let d = Xu(Object.assign({ key: t.config.apiKey }, l)).slice(1),
          h = yield t._getAdditionalHeaders()
        return (
          (h['Content-Type'] = 'application/json'),
          t.languageCode && (h['X-Firebase-Locale'] = t.languageCode),
          Eo.fetch()(
            gy(t, t.config.apiHost, n, d),
            Object.assign(
              { method: e, headers: h, referrerPolicy: 'no-referrer' },
              u
            )
          )
        )
      })
    )
  })
}
function py(t, e, n) {
  return p(this, null, function* () {
    t._canInitEmulator = !1
    let r = Object.assign(Object.assign({}, cb), e)
    try {
      let i = new El(t),
        s = yield Promise.race([n(), i.promise])
      i.clearNetworkTimeout()
      let o = yield s.json()
      if ('needConfirmation' in o)
        throw yo(t, 'account-exists-with-different-credential', o)
      if (s.ok && !('errorMessage' in o)) return o
      {
        let a = s.ok ? o.errorMessage : o.error.message,
          [c, u] = a.split(' : ')
        if (c === 'FEDERATED_USER_ID_ALREADY_LINKED')
          throw yo(t, 'credential-already-in-use', o)
        if (c === 'EMAIL_EXISTS') throw yo(t, 'email-already-in-use', o)
        if (c === 'USER_DISABLED') throw yo(t, 'user-disabled', o)
        let l = r[c] || c.toLowerCase().replace(/[_\s]+/g, '-')
        if (u) throw rb(t, l, u)
        ry(t, l)
      }
    } catch (i) {
      if (i instanceof Ne) throw i
      ry(t, 'network-request-failed', { message: String(i) })
    }
  })
}
function gy(t, e, n, r) {
  let i = `${e}${n}?${r}`
  return t.config.emulator ? ab(t.config, i) : `${t.config.apiScheme}://${i}`
}
var El = class {
  constructor(e) {
    ;(this.auth = e),
      (this.timer = null),
      (this.promise = new Promise((n, r) => {
        this.timer = setTimeout(
          () => r(hy(this.auth, 'network-request-failed')),
          ub.get()
        )
      }))
  }
  clearNetworkTimeout() {
    clearTimeout(this.timer)
  }
}
function yo(t, e, n) {
  let r = { appName: t.name }
  n.email && (r.email = n.email),
    n.phoneNumber && (r.phoneNumber = n.phoneNumber)
  let i = hy(t, e, r)
  return (i.customData._tokenResponse = n), i
}
function lb(t, e) {
  return p(this, null, function* () {
    return So(t, 'POST', '/v1/accounts:delete', e)
  })
}
function db(t, e) {
  return p(this, null, function* () {
    return So(t, 'POST', '/v1/accounts:lookup', e)
  })
}
function di(t) {
  if (t)
    try {
      let e = new Date(Number(t))
      if (!isNaN(e.getTime())) return e.toUTCString()
    } catch {}
}
function Rl(t, e = !1) {
  return p(this, null, function* () {
    let n = Ot(t),
      r = yield n.getIdToken(e),
      i = my(r)
    U(i && i.exp && i.auth_time && i.iat, n.auth, 'internal-error')
    let s = typeof i.firebase == 'object' ? i.firebase : void 0,
      o = s?.sign_in_provider
    return {
      claims: i,
      token: r,
      authTime: di(_l(i.auth_time)),
      issuedAtTime: di(_l(i.iat)),
      expirationTime: di(_l(i.exp)),
      signInProvider: o || null,
      signInSecondFactor: s?.sign_in_second_factor || null,
    }
  })
}
function _l(t) {
  return Number(t) * 1e3
}
function my(t) {
  let [e, n, r] = t.split('.')
  if (e === void 0 || n === void 0 || r === void 0)
    return vo('JWT malformed, contained fewer than 3 sections'), null
  try {
    let i = Ju(n)
    return i ? JSON.parse(i) : (vo('Failed to decode base64 JWT payload'), null)
  } catch (i) {
    return vo('Caught error parsing JWT payload as JSON', i?.toString()), null
  }
}
function hb(t) {
  let e = my(t)
  return (
    U(e, 'internal-error'),
    U(typeof e.exp < 'u', 'internal-error'),
    U(typeof e.iat < 'u', 'internal-error'),
    Number(e.exp) - Number(e.iat)
  )
}
function wl(t, e, n = !1) {
  return p(this, null, function* () {
    if (n) return e
    try {
      return yield e
    } catch (r) {
      throw (
        (r instanceof Ne &&
          fb(r) &&
          t.auth.currentUser === t &&
          (yield t.auth.signOut()),
        r)
      )
    }
  })
}
function fb({ code: t }) {
  return t === 'auth/user-disabled' || t === 'auth/user-token-expired'
}
var Dl = class {
  constructor(e) {
    ;(this.user = e),
      (this.isRunning = !1),
      (this.timerId = null),
      (this.errorBackoff = 3e4)
  }
  _start() {
    this.isRunning || ((this.isRunning = !0), this.schedule())
  }
  _stop() {
    this.isRunning &&
      ((this.isRunning = !1),
      this.timerId !== null && clearTimeout(this.timerId))
  }
  getInterval(e) {
    var n
    if (e) {
      let r = this.errorBackoff
      return (this.errorBackoff = Math.min(this.errorBackoff * 2, 96e4)), r
    } else {
      this.errorBackoff = 3e4
      let i =
        ((n = this.user.stsTokenManager.expirationTime) !== null && n !== void 0
          ? n
          : 0) -
        Date.now() -
        3e5
      return Math.max(0, i)
    }
  }
  schedule(e = !1) {
    if (!this.isRunning) return
    let n = this.getInterval(e)
    this.timerId = setTimeout(
      () =>
        p(this, null, function* () {
          yield this.iteration()
        }),
      n
    )
  }
  iteration() {
    return p(this, null, function* () {
      try {
        yield this.user.getIdToken(!0)
      } catch (e) {
        e?.code === 'auth/network-request-failed' && this.schedule(!0)
        return
      }
      this.schedule()
    })
  }
}
var wo = class {
  constructor(e, n) {
    ;(this.createdAt = e), (this.lastLoginAt = n), this._initializeTime()
  }
  _initializeTime() {
    ;(this.lastSignInTime = di(this.lastLoginAt)),
      (this.creationTime = di(this.createdAt))
  }
  _copy(e) {
    ;(this.createdAt = e.createdAt),
      (this.lastLoginAt = e.lastLoginAt),
      this._initializeTime()
  }
  toJSON() {
    return { createdAt: this.createdAt, lastLoginAt: this.lastLoginAt }
  }
}
function Do(t) {
  return p(this, null, function* () {
    var e
    let n = t.auth,
      r = yield t.getIdToken(),
      i = yield wl(t, db(n, { idToken: r }))
    U(i?.users.length, n, 'internal-error')
    let s = i.users[0]
    t._notifyReloadListener(s)
    let o =
        !((e = s.providerUserInfo) === null || e === void 0) && e.length
          ? gb(s.providerUserInfo)
          : [],
      a = pb(t.providerData, o),
      c = t.isAnonymous,
      u = !(t.email && s.passwordHash) && !a?.length,
      l = c ? u : !1,
      d = {
        uid: s.localId,
        displayName: s.displayName || null,
        photoURL: s.photoUrl || null,
        email: s.email || null,
        emailVerified: s.emailVerified || !1,
        phoneNumber: s.phoneNumber || null,
        tenantId: s.tenantId || null,
        providerData: a,
        metadata: new wo(s.createdAt, s.lastLoginAt),
        isAnonymous: l,
      }
    Object.assign(t, d)
  })
}
function xl(t) {
  return p(this, null, function* () {
    let e = Ot(t)
    yield Do(e),
      yield e.auth._persistUserIfCurrent(e),
      e.auth._notifyListenersIfCurrent(e)
  })
}
function pb(t, e) {
  return [
    ...t.filter((r) => !e.some((i) => i.providerId === r.providerId)),
    ...e,
  ]
}
function gb(t) {
  return t.map((e) => {
    var { providerId: n } = e,
      r = nc(e, ['providerId'])
    return {
      providerId: n,
      uid: r.rawId || '',
      displayName: r.displayName || null,
      email: r.email || null,
      phoneNumber: r.phoneNumber || null,
      photoURL: r.photoUrl || null,
    }
  })
}
function mb(t, e) {
  return p(this, null, function* () {
    let n = yield py(t, {}, () =>
      p(this, null, function* () {
        let r = Xu({ grant_type: 'refresh_token', refresh_token: e }).slice(1),
          { tokenApiHost: i, apiKey: s } = t.config,
          o = gy(t, i, '/v1/token', `key=${s}`),
          a = yield t._getAdditionalHeaders()
        return (
          (a['Content-Type'] = 'application/x-www-form-urlencoded'),
          Eo.fetch()(o, { method: 'POST', headers: a, body: r })
        )
      })
    )
    return {
      accessToken: n.access_token,
      expiresIn: n.expires_in,
      refreshToken: n.refresh_token,
    }
  })
}
function yb(t, e) {
  return p(this, null, function* () {
    return So(t, 'POST', '/v2/accounts:revokeToken', fy(t, e))
  })
}
var To = class t {
  constructor() {
    ;(this.refreshToken = null),
      (this.accessToken = null),
      (this.expirationTime = null)
  }
  get isExpired() {
    return !this.expirationTime || Date.now() > this.expirationTime - 3e4
  }
  updateFromServerResponse(e) {
    U(e.idToken, 'internal-error'),
      U(typeof e.idToken < 'u', 'internal-error'),
      U(typeof e.refreshToken < 'u', 'internal-error')
    let n =
      'expiresIn' in e && typeof e.expiresIn < 'u'
        ? Number(e.expiresIn)
        : hb(e.idToken)
    this.updateTokensAndExpiration(e.idToken, e.refreshToken, n)
  }
  getToken(e, n = !1) {
    return p(this, null, function* () {
      return (
        U(!this.accessToken || this.refreshToken, e, 'user-token-expired'),
        !n && this.accessToken && !this.isExpired
          ? this.accessToken
          : this.refreshToken
            ? (yield this.refresh(e, this.refreshToken), this.accessToken)
            : null
      )
    })
  }
  clearRefreshToken() {
    this.refreshToken = null
  }
  refresh(e, n) {
    return p(this, null, function* () {
      let { accessToken: r, refreshToken: i, expiresIn: s } = yield mb(e, n)
      this.updateTokensAndExpiration(r, i, Number(s))
    })
  }
  updateTokensAndExpiration(e, n, r) {
    ;(this.refreshToken = n || null),
      (this.accessToken = e || null),
      (this.expirationTime = Date.now() + r * 1e3)
  }
  static fromJSON(e, n) {
    let { refreshToken: r, accessToken: i, expirationTime: s } = n,
      o = new t()
    return (
      r &&
        (U(typeof r == 'string', 'internal-error', { appName: e }),
        (o.refreshToken = r)),
      i &&
        (U(typeof i == 'string', 'internal-error', { appName: e }),
        (o.accessToken = i)),
      s &&
        (U(typeof s == 'number', 'internal-error', { appName: e }),
        (o.expirationTime = s)),
      o
    )
  }
  toJSON() {
    return {
      refreshToken: this.refreshToken,
      accessToken: this.accessToken,
      expirationTime: this.expirationTime,
    }
  }
  _assign(e) {
    ;(this.accessToken = e.accessToken),
      (this.refreshToken = e.refreshToken),
      (this.expirationTime = e.expirationTime)
  }
  _clone() {
    return Object.assign(new t(), this.toJSON())
  }
  _performRefresh() {
    return li('not implemented')
  }
}
function Vt(t, e) {
  U(typeof t == 'string' || typeof t > 'u', 'internal-error', { appName: e })
}
var Co = class t {
  constructor(e) {
    var { uid: n, auth: r, stsTokenManager: i } = e,
      s = nc(e, ['uid', 'auth', 'stsTokenManager'])
    ;(this.providerId = 'firebase'),
      (this.proactiveRefresh = new Dl(this)),
      (this.reloadUserInfo = null),
      (this.reloadListener = null),
      (this.uid = n),
      (this.auth = r),
      (this.stsTokenManager = i),
      (this.accessToken = i.accessToken),
      (this.displayName = s.displayName || null),
      (this.email = s.email || null),
      (this.emailVerified = s.emailVerified || !1),
      (this.phoneNumber = s.phoneNumber || null),
      (this.photoURL = s.photoURL || null),
      (this.isAnonymous = s.isAnonymous || !1),
      (this.tenantId = s.tenantId || null),
      (this.providerData = s.providerData ? [...s.providerData] : []),
      (this.metadata = new wo(s.createdAt || void 0, s.lastLoginAt || void 0))
  }
  getIdToken(e) {
    return p(this, null, function* () {
      let n = yield wl(this, this.stsTokenManager.getToken(this.auth, e))
      return (
        U(n, this.auth, 'internal-error'),
        this.accessToken !== n &&
          ((this.accessToken = n),
          yield this.auth._persistUserIfCurrent(this),
          this.auth._notifyListenersIfCurrent(this)),
        n
      )
    })
  }
  getIdTokenResult(e) {
    return Rl(this, e)
  }
  reload() {
    return xl(this)
  }
  _assign(e) {
    this !== e &&
      (U(this.uid === e.uid, this.auth, 'internal-error'),
      (this.displayName = e.displayName),
      (this.photoURL = e.photoURL),
      (this.email = e.email),
      (this.emailVerified = e.emailVerified),
      (this.phoneNumber = e.phoneNumber),
      (this.isAnonymous = e.isAnonymous),
      (this.tenantId = e.tenantId),
      (this.providerData = e.providerData.map((n) => Object.assign({}, n))),
      this.metadata._copy(e.metadata),
      this.stsTokenManager._assign(e.stsTokenManager))
  }
  _clone(e) {
    let n = new t(
      Object.assign(Object.assign({}, this), {
        auth: e,
        stsTokenManager: this.stsTokenManager._clone(),
      })
    )
    return n.metadata._copy(this.metadata), n
  }
  _onReload(e) {
    U(!this.reloadListener, this.auth, 'internal-error'),
      (this.reloadListener = e),
      this.reloadUserInfo &&
        (this._notifyReloadListener(this.reloadUserInfo),
        (this.reloadUserInfo = null))
  }
  _notifyReloadListener(e) {
    this.reloadListener ? this.reloadListener(e) : (this.reloadUserInfo = e)
  }
  _startProactiveRefresh() {
    this.proactiveRefresh._start()
  }
  _stopProactiveRefresh() {
    this.proactiveRefresh._stop()
  }
  _updateTokensIfNecessary(e, n = !1) {
    return p(this, null, function* () {
      let r = !1
      e.idToken &&
        e.idToken !== this.stsTokenManager.accessToken &&
        (this.stsTokenManager.updateFromServerResponse(e), (r = !0)),
        n && (yield Do(this)),
        yield this.auth._persistUserIfCurrent(this),
        r && this.auth._notifyListenersIfCurrent(this)
    })
  }
  delete() {
    return p(this, null, function* () {
      let e = yield this.getIdToken()
      return (
        yield wl(this, lb(this.auth, { idToken: e })),
        this.stsTokenManager.clearRefreshToken(),
        this.auth.signOut()
      )
    })
  }
  toJSON() {
    return Object.assign(
      Object.assign(
        {
          uid: this.uid,
          email: this.email || void 0,
          emailVerified: this.emailVerified,
          displayName: this.displayName || void 0,
          isAnonymous: this.isAnonymous,
          photoURL: this.photoURL || void 0,
          phoneNumber: this.phoneNumber || void 0,
          tenantId: this.tenantId || void 0,
          providerData: this.providerData.map((e) => Object.assign({}, e)),
          stsTokenManager: this.stsTokenManager.toJSON(),
          _redirectEventId: this._redirectEventId,
        },
        this.metadata.toJSON()
      ),
      { apiKey: this.auth.config.apiKey, appName: this.auth.name }
    )
  }
  get refreshToken() {
    return this.stsTokenManager.refreshToken || ''
  }
  static _fromJSON(e, n) {
    var r, i, s, o, a, c, u, l
    let d = (r = n.displayName) !== null && r !== void 0 ? r : void 0,
      h = (i = n.email) !== null && i !== void 0 ? i : void 0,
      f = (s = n.phoneNumber) !== null && s !== void 0 ? s : void 0,
      _ = (o = n.photoURL) !== null && o !== void 0 ? o : void 0,
      w = (a = n.tenantId) !== null && a !== void 0 ? a : void 0,
      I = (c = n._redirectEventId) !== null && c !== void 0 ? c : void 0,
      P = (u = n.createdAt) !== null && u !== void 0 ? u : void 0,
      L = (l = n.lastLoginAt) !== null && l !== void 0 ? l : void 0,
      {
        uid: z,
        emailVerified: B,
        isAnonymous: Z,
        providerData: $,
        stsTokenManager: Te,
      } = n
    U(z && Te, e, 'internal-error')
    let Ct = To.fromJSON(this.name, Te)
    U(typeof z == 'string', e, 'internal-error'),
      Vt(d, e.name),
      Vt(h, e.name),
      U(typeof B == 'boolean', e, 'internal-error'),
      U(typeof Z == 'boolean', e, 'internal-error'),
      Vt(f, e.name),
      Vt(_, e.name),
      Vt(w, e.name),
      Vt(I, e.name),
      Vt(P, e.name),
      Vt(L, e.name)
    let zt = new t({
      uid: z,
      auth: e,
      email: h,
      emailVerified: B,
      displayName: d,
      isAnonymous: Z,
      photoURL: _,
      phoneNumber: f,
      tenantId: w,
      stsTokenManager: Ct,
      createdAt: P,
      lastLoginAt: L,
    })
    return (
      $ &&
        Array.isArray($) &&
        (zt.providerData = $.map((rs) => Object.assign({}, rs))),
      I && (zt._redirectEventId = I),
      zt
    )
  }
  static _fromIdTokenResponse(e, n, r = !1) {
    return p(this, null, function* () {
      let i = new To()
      i.updateFromServerResponse(n)
      let s = new t({
        uid: n.localId,
        auth: e,
        stsTokenManager: i,
        isAnonymous: r,
      })
      return yield Do(s), s
    })
  }
}
var sy = new Map()
function dn(t) {
  Io(t instanceof Function, 'Expected a class definition')
  let e = sy.get(t)
  return e
    ? (Io(e instanceof t, 'Instance stored in cache mismatched with class'), e)
    : ((e = new t()), sy.set(t, e), e)
}
var vb = (() => {
    class t {
      constructor() {
        ;(this.type = 'NONE'), (this.storage = {})
      }
      _isAvailable() {
        return p(this, null, function* () {
          return !0
        })
      }
      _set(n, r) {
        return p(this, null, function* () {
          this.storage[n] = r
        })
      }
      _get(n) {
        return p(this, null, function* () {
          let r = this.storage[n]
          return r === void 0 ? null : r
        })
      }
      _remove(n) {
        return p(this, null, function* () {
          delete this.storage[n]
        })
      }
      _addListener(n, r) {}
      _removeListener(n, r) {}
    }
    return (t.type = 'NONE'), t
  })(),
  Tl = vb
function Il(t, e, n) {
  return `firebase:${t}:${e}:${n}`
}
var bo = class t {
  constructor(e, n, r) {
    ;(this.persistence = e), (this.auth = n), (this.userKey = r)
    let { config: i, name: s } = this.auth
    ;(this.fullUserKey = Il(this.userKey, i.apiKey, s)),
      (this.fullPersistenceKey = Il('persistence', i.apiKey, s)),
      (this.boundEventHandler = n._onStorageEvent.bind(n)),
      this.persistence._addListener(this.fullUserKey, this.boundEventHandler)
  }
  setCurrentUser(e) {
    return this.persistence._set(this.fullUserKey, e.toJSON())
  }
  getCurrentUser() {
    return p(this, null, function* () {
      let e = yield this.persistence._get(this.fullUserKey)
      return e ? Co._fromJSON(this.auth, e) : null
    })
  }
  removeCurrentUser() {
    return this.persistence._remove(this.fullUserKey)
  }
  savePersistenceForRedirect() {
    return this.persistence._set(this.fullPersistenceKey, this.persistence.type)
  }
  setPersistence(e) {
    return p(this, null, function* () {
      if (this.persistence === e) return
      let n = yield this.getCurrentUser()
      if ((yield this.removeCurrentUser(), (this.persistence = e), n))
        return this.setCurrentUser(n)
    })
  }
  delete() {
    this.persistence._removeListener(this.fullUserKey, this.boundEventHandler)
  }
  static create(e, n, r = 'authUser') {
    return p(this, null, function* () {
      if (!n.length) return new t(dn(Tl), e, r)
      let i = (yield Promise.all(
          n.map((u) =>
            p(this, null, function* () {
              if (yield u._isAvailable()) return u
            })
          )
        )).filter((u) => u),
        s = i[0] || dn(Tl),
        o = Il(r, e.config.apiKey, e.name),
        a = null
      for (let u of n)
        try {
          let l = yield u._get(o)
          if (l) {
            let d = Co._fromJSON(e, l)
            u !== s && (a = d), (s = u)
            break
          }
        } catch {}
      let c = i.filter((u) => u._shouldAllowMigration)
      return !s._shouldAllowMigration || !c.length
        ? new t(s, e, r)
        : ((s = c[0]),
          a && (yield s._set(o, a.toJSON())),
          yield Promise.all(
            n.map((u) =>
              p(this, null, function* () {
                if (u !== s)
                  try {
                    yield u._remove(o)
                  } catch {}
              })
            )
          ),
          new t(s, e, r))
    })
  }
}
function oy(t) {
  let e = t.toLowerCase()
  if (e.includes('opera/') || e.includes('opr/') || e.includes('opios/'))
    return 'Opera'
  if (wb(e)) return 'IEMobile'
  if (e.includes('msie') || e.includes('trident/')) return 'IE'
  if (e.includes('edge/')) return 'Edge'
  if (_b(e)) return 'Firefox'
  if (e.includes('silk/')) return 'Silk'
  if (Tb(e)) return 'Blackberry'
  if (Cb(e)) return 'Webos'
  if (Ib(e)) return 'Safari'
  if ((e.includes('chrome/') || Eb(e)) && !e.includes('edge/')) return 'Chrome'
  if (Db(e)) return 'Android'
  {
    let n = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,
      r = t.match(n)
    if (r?.length === 2) return r[1]
  }
  return 'Other'
}
function _b(t = me()) {
  return /firefox\//i.test(t)
}
function Ib(t = me()) {
  let e = t.toLowerCase()
  return (
    e.includes('safari/') &&
    !e.includes('chrome/') &&
    !e.includes('crios/') &&
    !e.includes('android')
  )
}
function Eb(t = me()) {
  return /crios\//i.test(t)
}
function wb(t = me()) {
  return /iemobile/i.test(t)
}
function Db(t = me()) {
  return /android/i.test(t)
}
function Tb(t = me()) {
  return /blackberry/i.test(t)
}
function Cb(t = me()) {
  return /webos/i.test(t)
}
function yy(t, e = []) {
  let n
  switch (t) {
    case 'Browser':
      n = oy(me())
      break
    case 'Worker':
      n = `${oy(me())}-${t}`
      break
    default:
      n = t
  }
  let r = e.length ? e.join(',') : 'FirebaseCore-web'
  return `${n}/JsCore/${Jn}/${r}`
}
var Cl = class {
  constructor(e) {
    ;(this.auth = e), (this.queue = [])
  }
  pushCallback(e, n) {
    let r = (s) =>
      new Promise((o, a) => {
        try {
          let c = e(s)
          o(c)
        } catch (c) {
          a(c)
        }
      })
    ;(r.onAbort = n), this.queue.push(r)
    let i = this.queue.length - 1
    return () => {
      this.queue[i] = () => Promise.resolve()
    }
  }
  runMiddleware(e) {
    return p(this, null, function* () {
      if (this.auth.currentUser === e) return
      let n = []
      try {
        for (let r of this.queue) yield r(e), r.onAbort && n.push(r.onAbort)
      } catch (r) {
        n.reverse()
        for (let i of n)
          try {
            i()
          } catch {}
        throw this.auth._errorFactory.create('login-blocked', {
          originalMessage: r?.message,
        })
      }
    })
  }
}
function bb(n) {
  return p(this, arguments, function* (t, e = {}) {
    return So(t, 'GET', '/v2/passwordPolicy', fy(t, e))
  })
}
var Ab = 6,
  bl = class {
    constructor(e) {
      var n, r, i, s
      let o = e.customStrengthOptions
      ;(this.customStrengthOptions = {}),
        (this.customStrengthOptions.minPasswordLength =
          (n = o.minPasswordLength) !== null && n !== void 0 ? n : Ab),
        o.maxPasswordLength &&
          (this.customStrengthOptions.maxPasswordLength = o.maxPasswordLength),
        o.containsLowercaseCharacter !== void 0 &&
          (this.customStrengthOptions.containsLowercaseLetter =
            o.containsLowercaseCharacter),
        o.containsUppercaseCharacter !== void 0 &&
          (this.customStrengthOptions.containsUppercaseLetter =
            o.containsUppercaseCharacter),
        o.containsNumericCharacter !== void 0 &&
          (this.customStrengthOptions.containsNumericCharacter =
            o.containsNumericCharacter),
        o.containsNonAlphanumericCharacter !== void 0 &&
          (this.customStrengthOptions.containsNonAlphanumericCharacter =
            o.containsNonAlphanumericCharacter),
        (this.enforcementState = e.enforcementState),
        this.enforcementState === 'ENFORCEMENT_STATE_UNSPECIFIED' &&
          (this.enforcementState = 'OFF'),
        (this.allowedNonAlphanumericCharacters =
          (i =
            (r = e.allowedNonAlphanumericCharacters) === null || r === void 0
              ? void 0
              : r.join('')) !== null && i !== void 0
            ? i
            : ''),
        (this.forceUpgradeOnSignin =
          (s = e.forceUpgradeOnSignin) !== null && s !== void 0 ? s : !1),
        (this.schemaVersion = e.schemaVersion)
    }
    validatePassword(e) {
      var n, r, i, s, o, a
      let c = { isValid: !0, passwordPolicy: this }
      return (
        this.validatePasswordLengthOptions(e, c),
        this.validatePasswordCharacterOptions(e, c),
        c.isValid &&
          (c.isValid =
            (n = c.meetsMinPasswordLength) !== null && n !== void 0 ? n : !0),
        c.isValid &&
          (c.isValid =
            (r = c.meetsMaxPasswordLength) !== null && r !== void 0 ? r : !0),
        c.isValid &&
          (c.isValid =
            (i = c.containsLowercaseLetter) !== null && i !== void 0 ? i : !0),
        c.isValid &&
          (c.isValid =
            (s = c.containsUppercaseLetter) !== null && s !== void 0 ? s : !0),
        c.isValid &&
          (c.isValid =
            (o = c.containsNumericCharacter) !== null && o !== void 0 ? o : !0),
        c.isValid &&
          (c.isValid =
            (a = c.containsNonAlphanumericCharacter) !== null && a !== void 0
              ? a
              : !0),
        c
      )
    }
    validatePasswordLengthOptions(e, n) {
      let r = this.customStrengthOptions.minPasswordLength,
        i = this.customStrengthOptions.maxPasswordLength
      r && (n.meetsMinPasswordLength = e.length >= r),
        i && (n.meetsMaxPasswordLength = e.length <= i)
    }
    validatePasswordCharacterOptions(e, n) {
      this.updatePasswordCharacterOptionsStatuses(n, !1, !1, !1, !1)
      let r
      for (let i = 0; i < e.length; i++)
        (r = e.charAt(i)),
          this.updatePasswordCharacterOptionsStatuses(
            n,
            r >= 'a' && r <= 'z',
            r >= 'A' && r <= 'Z',
            r >= '0' && r <= '9',
            this.allowedNonAlphanumericCharacters.includes(r)
          )
    }
    updatePasswordCharacterOptionsStatuses(e, n, r, i, s) {
      this.customStrengthOptions.containsLowercaseLetter &&
        (e.containsLowercaseLetter || (e.containsLowercaseLetter = n)),
        this.customStrengthOptions.containsUppercaseLetter &&
          (e.containsUppercaseLetter || (e.containsUppercaseLetter = r)),
        this.customStrengthOptions.containsNumericCharacter &&
          (e.containsNumericCharacter || (e.containsNumericCharacter = i)),
        this.customStrengthOptions.containsNonAlphanumericCharacter &&
          (e.containsNonAlphanumericCharacter ||
            (e.containsNonAlphanumericCharacter = s))
    }
  }
var Al = class {
  constructor(e, n, r, i) {
    ;(this.app = e),
      (this.heartbeatServiceProvider = n),
      (this.appCheckServiceProvider = r),
      (this.config = i),
      (this.currentUser = null),
      (this.emulatorConfig = null),
      (this.operations = Promise.resolve()),
      (this.authStateSubscription = new Ao(this)),
      (this.idTokenSubscription = new Ao(this)),
      (this.beforeStateQueue = new Cl(this)),
      (this.redirectUser = null),
      (this.isProactiveRefreshEnabled = !1),
      (this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1),
      (this._canInitEmulator = !0),
      (this._isInitialized = !1),
      (this._deleted = !1),
      (this._initializationPromise = null),
      (this._popupRedirectResolver = null),
      (this._errorFactory = dy),
      (this._agentRecaptchaConfig = null),
      (this._tenantRecaptchaConfigs = {}),
      (this._projectPasswordPolicy = null),
      (this._tenantPasswordPolicies = {}),
      (this.lastNotifiedUid = void 0),
      (this.languageCode = null),
      (this.tenantId = null),
      (this.settings = { appVerificationDisabledForTesting: !1 }),
      (this.frameworks = []),
      (this.name = e.name),
      (this.clientVersion = i.sdkClientVersion)
  }
  _initializeWithPersistence(e, n) {
    return (
      n && (this._popupRedirectResolver = dn(n)),
      (this._initializationPromise = this.queue(() =>
        p(this, null, function* () {
          var r, i
          if (
            !this._deleted &&
            ((this.persistenceManager = yield bo.create(this, e)),
            !this._deleted)
          ) {
            if (
              !((r = this._popupRedirectResolver) === null || r === void 0) &&
              r._shouldInitProactively
            )
              try {
                yield this._popupRedirectResolver._initialize(this)
              } catch {}
            yield this.initializeCurrentUser(n),
              (this.lastNotifiedUid =
                ((i = this.currentUser) === null || i === void 0
                  ? void 0
                  : i.uid) || null),
              !this._deleted && (this._isInitialized = !0)
          }
        })
      )),
      this._initializationPromise
    )
  }
  _onStorageEvent() {
    return p(this, null, function* () {
      if (this._deleted) return
      let e = yield this.assertedPersistence.getCurrentUser()
      if (!(!this.currentUser && !e)) {
        if (this.currentUser && e && this.currentUser.uid === e.uid) {
          this._currentUser._assign(e), yield this.currentUser.getIdToken()
          return
        }
        yield this._updateCurrentUser(e, !0)
      }
    })
  }
  initializeCurrentUser(e) {
    return p(this, null, function* () {
      var n
      let r = yield this.assertedPersistence.getCurrentUser(),
        i = r,
        s = !1
      if (e && this.config.authDomain) {
        yield this.getOrInitRedirectPersistenceManager()
        let o =
            (n = this.redirectUser) === null || n === void 0
              ? void 0
              : n._redirectEventId,
          a = i?._redirectEventId,
          c = yield this.tryRedirectSignIn(e)
        ;(!o || o === a) && c?.user && ((i = c.user), (s = !0))
      }
      if (!i) return this.directlySetCurrentUser(null)
      if (!i._redirectEventId) {
        if (s)
          try {
            yield this.beforeStateQueue.runMiddleware(i)
          } catch (o) {
            ;(i = r),
              this._popupRedirectResolver._overrideRedirectResult(this, () =>
                Promise.reject(o)
              )
          }
        return i
          ? this.reloadAndSetCurrentUserOrClear(i)
          : this.directlySetCurrentUser(null)
      }
      return (
        U(this._popupRedirectResolver, this, 'argument-error'),
        yield this.getOrInitRedirectPersistenceManager(),
        this.redirectUser &&
        this.redirectUser._redirectEventId === i._redirectEventId
          ? this.directlySetCurrentUser(i)
          : this.reloadAndSetCurrentUserOrClear(i)
      )
    })
  }
  tryRedirectSignIn(e) {
    return p(this, null, function* () {
      let n = null
      try {
        n = yield this._popupRedirectResolver._completeRedirectFn(this, e, !0)
      } catch {
        yield this._setRedirectUser(null)
      }
      return n
    })
  }
  reloadAndSetCurrentUserOrClear(e) {
    return p(this, null, function* () {
      try {
        yield Do(e)
      } catch (n) {
        if (n?.code !== 'auth/network-request-failed')
          return this.directlySetCurrentUser(null)
      }
      return this.directlySetCurrentUser(e)
    })
  }
  useDeviceLanguage() {
    this.languageCode = ob()
  }
  _delete() {
    return p(this, null, function* () {
      this._deleted = !0
    })
  }
  updateCurrentUser(e) {
    return p(this, null, function* () {
      let n = e ? Ot(e) : null
      return (
        n &&
          U(
            n.auth.config.apiKey === this.config.apiKey,
            this,
            'invalid-user-token'
          ),
        this._updateCurrentUser(n && n._clone(this))
      )
    })
  }
  _updateCurrentUser(e, n = !1) {
    return p(this, null, function* () {
      if (!this._deleted)
        return (
          e && U(this.tenantId === e.tenantId, this, 'tenant-id-mismatch'),
          n || (yield this.beforeStateQueue.runMiddleware(e)),
          this.queue(() =>
            p(this, null, function* () {
              yield this.directlySetCurrentUser(e), this.notifyAuthListeners()
            })
          )
        )
    })
  }
  signOut() {
    return p(this, null, function* () {
      return (
        yield this.beforeStateQueue.runMiddleware(null),
        (this.redirectPersistenceManager || this._popupRedirectResolver) &&
          (yield this._setRedirectUser(null)),
        this._updateCurrentUser(null, !0)
      )
    })
  }
  setPersistence(e) {
    return this.queue(() =>
      p(this, null, function* () {
        yield this.assertedPersistence.setPersistence(dn(e))
      })
    )
  }
  _getRecaptchaConfig() {
    return this.tenantId == null
      ? this._agentRecaptchaConfig
      : this._tenantRecaptchaConfigs[this.tenantId]
  }
  validatePassword(e) {
    return p(this, null, function* () {
      this._getPasswordPolicyInternal() || (yield this._updatePasswordPolicy())
      let n = this._getPasswordPolicyInternal()
      return n.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION
        ? Promise.reject(
            this._errorFactory.create(
              'unsupported-password-policy-schema-version',
              {}
            )
          )
        : n.validatePassword(e)
    })
  }
  _getPasswordPolicyInternal() {
    return this.tenantId === null
      ? this._projectPasswordPolicy
      : this._tenantPasswordPolicies[this.tenantId]
  }
  _updatePasswordPolicy() {
    return p(this, null, function* () {
      let e = yield bb(this),
        n = new bl(e)
      this.tenantId === null
        ? (this._projectPasswordPolicy = n)
        : (this._tenantPasswordPolicies[this.tenantId] = n)
    })
  }
  _getPersistence() {
    return this.assertedPersistence.persistence.type
  }
  _updateErrorMap(e) {
    this._errorFactory = new It('auth', 'Firebase', e())
  }
  onAuthStateChanged(e, n, r) {
    return this.registerStateListener(this.authStateSubscription, e, n, r)
  }
  beforeAuthStateChanged(e, n) {
    return this.beforeStateQueue.pushCallback(e, n)
  }
  onIdTokenChanged(e, n, r) {
    return this.registerStateListener(this.idTokenSubscription, e, n, r)
  }
  authStateReady() {
    return new Promise((e, n) => {
      if (this.currentUser) e()
      else {
        let r = this.onAuthStateChanged(() => {
          r(), e()
        }, n)
      }
    })
  }
  revokeAccessToken(e) {
    return p(this, null, function* () {
      if (this.currentUser) {
        let n = yield this.currentUser.getIdToken(),
          r = {
            providerId: 'apple.com',
            tokenType: 'ACCESS_TOKEN',
            token: e,
            idToken: n,
          }
        this.tenantId != null && (r.tenantId = this.tenantId), yield yb(this, r)
      }
    })
  }
  toJSON() {
    var e
    return {
      apiKey: this.config.apiKey,
      authDomain: this.config.authDomain,
      appName: this.name,
      currentUser:
        (e = this._currentUser) === null || e === void 0 ? void 0 : e.toJSON(),
    }
  }
  _setRedirectUser(e, n) {
    return p(this, null, function* () {
      let r = yield this.getOrInitRedirectPersistenceManager(n)
      return e === null ? r.removeCurrentUser() : r.setCurrentUser(e)
    })
  }
  getOrInitRedirectPersistenceManager(e) {
    return p(this, null, function* () {
      if (!this.redirectPersistenceManager) {
        let n = (e && dn(e)) || this._popupRedirectResolver
        U(n, this, 'argument-error'),
          (this.redirectPersistenceManager = yield bo.create(
            this,
            [dn(n._redirectPersistence)],
            'redirectUser'
          )),
          (this.redirectUser =
            yield this.redirectPersistenceManager.getCurrentUser())
      }
      return this.redirectPersistenceManager
    })
  }
  _redirectUserForId(e) {
    return p(this, null, function* () {
      var n, r
      return (
        this._isInitialized &&
          (yield this.queue(() => p(this, null, function* () {}))),
        ((n = this._currentUser) === null || n === void 0
          ? void 0
          : n._redirectEventId) === e
          ? this._currentUser
          : ((r = this.redirectUser) === null || r === void 0
                ? void 0
                : r._redirectEventId) === e
            ? this.redirectUser
            : null
      )
    })
  }
  _persistUserIfCurrent(e) {
    return p(this, null, function* () {
      if (e === this.currentUser)
        return this.queue(() =>
          p(this, null, function* () {
            return this.directlySetCurrentUser(e)
          })
        )
    })
  }
  _notifyListenersIfCurrent(e) {
    e === this.currentUser && this.notifyAuthListeners()
  }
  _key() {
    return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`
  }
  _startProactiveRefresh() {
    ;(this.isProactiveRefreshEnabled = !0),
      this.currentUser && this._currentUser._startProactiveRefresh()
  }
  _stopProactiveRefresh() {
    ;(this.isProactiveRefreshEnabled = !1),
      this.currentUser && this._currentUser._stopProactiveRefresh()
  }
  get _currentUser() {
    return this.currentUser
  }
  notifyAuthListeners() {
    var e, n
    if (!this._isInitialized) return
    this.idTokenSubscription.next(this.currentUser)
    let r =
      (n = (e = this.currentUser) === null || e === void 0 ? void 0 : e.uid) !==
        null && n !== void 0
        ? n
        : null
    this.lastNotifiedUid !== r &&
      ((this.lastNotifiedUid = r),
      this.authStateSubscription.next(this.currentUser))
  }
  registerStateListener(e, n, r, i) {
    if (this._deleted) return () => {}
    let s = typeof n == 'function' ? n : n.next.bind(n),
      o = !1,
      a = this._isInitialized ? Promise.resolve() : this._initializationPromise
    if (
      (U(a, this, 'internal-error'),
      a.then(() => {
        o || s(this.currentUser)
      }),
      typeof n == 'function')
    ) {
      let c = e.addObserver(n, r, i)
      return () => {
        ;(o = !0), c()
      }
    } else {
      let c = e.addObserver(n)
      return () => {
        ;(o = !0), c()
      }
    }
  }
  directlySetCurrentUser(e) {
    return p(this, null, function* () {
      this.currentUser &&
        this.currentUser !== e &&
        this._currentUser._stopProactiveRefresh(),
        e && this.isProactiveRefreshEnabled && e._startProactiveRefresh(),
        (this.currentUser = e),
        e
          ? yield this.assertedPersistence.setCurrentUser(e)
          : yield this.assertedPersistence.removeCurrentUser()
    })
  }
  queue(e) {
    return (this.operations = this.operations.then(e, e)), this.operations
  }
  get assertedPersistence() {
    return (
      U(this.persistenceManager, this, 'internal-error'),
      this.persistenceManager
    )
  }
  _logFramework(e) {
    !e ||
      this.frameworks.includes(e) ||
      (this.frameworks.push(e),
      this.frameworks.sort(),
      (this.clientVersion = yy(
        this.config.clientPlatform,
        this._getFrameworks()
      )))
  }
  _getFrameworks() {
    return this.frameworks
  }
  _getAdditionalHeaders() {
    return p(this, null, function* () {
      var e
      let n = { 'X-Client-Version': this.clientVersion }
      this.app.options.appId && (n['X-Firebase-gmpid'] = this.app.options.appId)
      let r = yield (e = this.heartbeatServiceProvider.getImmediate({
        optional: !0,
      })) === null || e === void 0
        ? void 0
        : e.getHeartbeatsHeader()
      r && (n['X-Firebase-Client'] = r)
      let i = yield this._getAppCheckToken()
      return i && (n['X-Firebase-AppCheck'] = i), n
    })
  }
  _getAppCheckToken() {
    return p(this, null, function* () {
      var e
      let n = yield (e = this.appCheckServiceProvider.getImmediate({
        optional: !0,
      })) === null || e === void 0
        ? void 0
        : e.getToken()
      return (
        n?.error && nb(`Error while retrieving App Check token: ${n.error}`),
        n?.token
      )
    })
  }
}
function Sb(t) {
  return Ot(t)
}
var Ao = class {
  constructor(e) {
    ;(this.auth = e),
      (this.observer = null),
      (this.addObserver = Bm((n) => (this.observer = n)))
  }
  get next() {
    return (
      U(this.observer, this.auth, 'internal-error'),
      this.observer.next.bind(this.observer)
    )
  }
}
function Nb(t) {
  return `__${t}${Math.floor(Math.random() * 1e6)}`
}
function Rb(t, e) {
  let n = e?.persistence || [],
    r = (Array.isArray(n) ? n : [n]).map(dn)
  e?.errorMap && t._updateErrorMap(e.errorMap),
    t._initializeWithPersistence(r, e?.popupRedirectResolver)
}
var PO = Nb('rcb'),
  OO = new hn(3e4, 6e4)
var kO = new hn(2e3, 1e4)
var FO = 10 * 60 * 1e3
var LO = new hn(3e4, 6e4)
var VO = new hn(5e3, 15e3)
var UO = encodeURIComponent('fac')
var ay = '@firebase/auth',
  cy = '1.5.1'
var Sl = class {
  constructor(e) {
    ;(this.auth = e), (this.internalListeners = new Map())
  }
  getUid() {
    var e
    return (
      this.assertAuthConfigured(),
      ((e = this.auth.currentUser) === null || e === void 0 ? void 0 : e.uid) ||
        null
    )
  }
  getToken(e) {
    return p(this, null, function* () {
      return (
        this.assertAuthConfigured(),
        yield this.auth._initializationPromise,
        this.auth.currentUser
          ? { accessToken: yield this.auth.currentUser.getIdToken(e) }
          : null
      )
    })
  }
  addAuthTokenListener(e) {
    if ((this.assertAuthConfigured(), this.internalListeners.has(e))) return
    let n = this.auth.onIdTokenChanged((r) => {
      e(r?.stsTokenManager.accessToken || null)
    })
    this.internalListeners.set(e, n), this.updateProactiveRefresh()
  }
  removeAuthTokenListener(e) {
    this.assertAuthConfigured()
    let n = this.internalListeners.get(e)
    n && (this.internalListeners.delete(e), n(), this.updateProactiveRefresh())
  }
  assertAuthConfigured() {
    U(this.auth._initializationPromise, 'dependent-sdk-initialized-before-auth')
  }
  updateProactiveRefresh() {
    this.internalListeners.size > 0
      ? this.auth._startProactiveRefresh()
      : this.auth._stopProactiveRefresh()
  }
}
function xb(t) {
  switch (t) {
    case 'Node':
      return 'node'
    case 'ReactNative':
      return 'rn'
    case 'Worker':
      return 'webworker'
    case 'Cordova':
      return 'cordova'
    default:
      return
  }
}
function Mb(t) {
  Lt(
    new Re(
      'auth',
      (e, { options: n }) => {
        let r = e.getProvider('app').getImmediate(),
          i = e.getProvider('heartbeat'),
          s = e.getProvider('app-check-internal'),
          { apiKey: o, authDomain: a } = r.options
        U(o && !o.includes(':'), 'invalid-api-key', { appName: r.name })
        let c = {
            apiKey: o,
            authDomain: a,
            clientPlatform: t,
            apiHost: 'identitytoolkit.googleapis.com',
            tokenApiHost: 'securetoken.googleapis.com',
            apiScheme: 'https',
            sdkClientVersion: yy(t),
          },
          u = new Al(r, i, s, c)
        return Rb(u, n), u
      },
      'PUBLIC'
    )
      .setInstantiationMode('EXPLICIT')
      .setInstanceCreatedCallback((e, n, r) => {
        e.getProvider('auth-internal').initialize()
      })
  ),
    Lt(
      new Re(
        'auth-internal',
        (e) => {
          let n = Sb(e.getProvider('auth').getImmediate())
          return ((r) => new Sl(r))(n)
        },
        'PRIVATE'
      ).setInstantiationMode('EXPLICIT')
    ),
    oe(ay, cy, xb(t)),
    oe(ay, cy, 'esm2017')
}
var Pb = 5 * 60,
  jO = Om('authIdTokenMaxAge') || Pb
Mb('Browser')
var MA = 'auth'
var No = class {
  constructor() {
    return ai(MA)
  }
}
var PA =
    typeof globalThis < 'u'
      ? globalThis
      : typeof window < 'u'
        ? window
        : typeof global < 'u'
          ? global
          : typeof self < 'u'
            ? self
            : {},
  qe = {},
  y,
  Xl = Xl || {},
  T = PA || self
function Ho(t) {
  var e = typeof t
  return (
    (e = e != 'object' ? e : t ? (Array.isArray(t) ? 'array' : e) : 'null'),
    e == 'array' || (e == 'object' && typeof t.length == 'number')
  )
}
function Ci(t) {
  var e = typeof t
  return (e == 'object' && t != null) || e == 'function'
}
function OA(t) {
  return (
    (Object.prototype.hasOwnProperty.call(t, Ml) && t[Ml]) || (t[Ml] = ++kA)
  )
}
var Ml = 'closure_uid_' + ((1e9 * Math.random()) >>> 0),
  kA = 0
function FA(t, e, n) {
  return t.call.apply(t.bind, arguments)
}
function LA(t, e, n) {
  if (!t) throw Error()
  if (2 < arguments.length) {
    var r = Array.prototype.slice.call(arguments, 2)
    return function () {
      var i = Array.prototype.slice.call(arguments)
      return Array.prototype.unshift.apply(i, r), t.apply(e, i)
    }
  }
  return function () {
    return t.apply(e, arguments)
  }
}
function ye(t, e, n) {
  return (
    Function.prototype.bind &&
    Function.prototype.bind.toString().indexOf('native code') != -1
      ? (ye = FA)
      : (ye = LA),
    ye.apply(null, arguments)
  )
}
function Ro(t, e) {
  var n = Array.prototype.slice.call(arguments, 1)
  return function () {
    var r = n.slice()
    return r.push.apply(r, arguments), t.apply(this, r)
  }
}
function ce(t, e) {
  function n() {}
  ;(n.prototype = e.prototype),
    (t.$ = e.prototype),
    (t.prototype = new n()),
    (t.prototype.constructor = t),
    (t.ac = function (r, i, s) {
      for (
        var o = Array(arguments.length - 2), a = 2;
        a < arguments.length;
        a++
      )
        o[a - 2] = arguments[a]
      return e.prototype[i].apply(r, o)
    })
}
function Ut() {
  ;(this.s = this.s), (this.o = this.o)
}
var VA = 0
Ut.prototype.s = !1
Ut.prototype.sa = function () {
  !this.s && ((this.s = !0), this.N(), VA != 0) && OA(this)
}
Ut.prototype.N = function () {
  if (this.o) for (; this.o.length; ) this.o.shift()()
}
var Ry = Array.prototype.indexOf
  ? function (t, e) {
      return Array.prototype.indexOf.call(t, e, void 0)
    }
  : function (t, e) {
      if (typeof t == 'string')
        return typeof e != 'string' || e.length != 1 ? -1 : t.indexOf(e, 0)
      for (let n = 0; n < t.length; n++) if (n in t && t[n] === e) return n
      return -1
    }
function ed(t) {
  let e = t.length
  if (0 < e) {
    let n = Array(e)
    for (let r = 0; r < e; r++) n[r] = t[r]
    return n
  }
  return []
}
function vy(t, e) {
  for (let n = 1; n < arguments.length; n++) {
    let r = arguments[n]
    if (Ho(r)) {
      let i = t.length || 0,
        s = r.length || 0
      t.length = i + s
      for (let o = 0; o < s; o++) t[i + o] = r[o]
    } else t.push(r)
  }
}
function ve(t, e) {
  ;(this.type = t), (this.g = this.target = e), (this.defaultPrevented = !1)
}
ve.prototype.h = function () {
  this.defaultPrevented = !0
}
var UA = (function () {
  if (!T.addEventListener || !Object.defineProperty) return !1
  var t = !1,
    e = Object.defineProperty({}, 'passive', {
      get: function () {
        t = !0
      },
    })
  try {
    let n = () => {}
    T.addEventListener('test', n, e), T.removeEventListener('test', n, e)
  } catch {}
  return t
})()
function yi(t) {
  return /^[\s\xa0]*$/.test(t)
}
function qo() {
  var t = T.navigator
  return t && (t = t.userAgent) ? t : ''
}
function tt(t) {
  return qo().indexOf(t) != -1
}
function td(t) {
  return td[' '](t), t
}
td[' '] = function () {}
function jA(t, e) {
  var n = SS
  return Object.prototype.hasOwnProperty.call(n, t) ? n[t] : (n[t] = e(t))
}
var BA = tt('Opera'),
  rr = tt('Trident') || tt('MSIE'),
  xy = tt('Edge'),
  Ll = xy || rr,
  My =
    tt('Gecko') &&
    !(qo().toLowerCase().indexOf('webkit') != -1 && !tt('Edge')) &&
    !(tt('Trident') || tt('MSIE')) &&
    !tt('Edge'),
  $A = qo().toLowerCase().indexOf('webkit') != -1 && !tt('Edge')
function Py() {
  var t = T.document
  return t ? t.documentMode : void 0
}
var Vl
e: {
  if (
    ((xo = ''),
    (Mo = (function () {
      var t = qo()
      if (My) return /rv:([^\);]+)(\)|;)/.exec(t)
      if (xy) return /Edge\/([\d\.]+)/.exec(t)
      if (rr) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(t)
      if ($A) return /WebKit\/(\S+)/.exec(t)
      if (BA) return /(?:Version)[ \/]?(\S+)/.exec(t)
    })()),
    Mo && (xo = Mo ? Mo[1] : ''),
    rr && ((Po = Py()), Po != null && Po > parseFloat(xo)))
  ) {
    Vl = String(Po)
    break e
  }
  Vl = xo
}
var xo, Mo, Po, Ul
T.document && rr
  ? ((Pl = Py()), (Ul = Pl || parseInt(Vl, 10) || void 0))
  : (Ul = void 0)
var Pl,
  HA = Ul
function vi(t, e) {
  if (
    (ve.call(this, t ? t.type : ''),
    (this.relatedTarget = this.g = this.target = null),
    (this.button =
      this.screenY =
      this.screenX =
      this.clientY =
      this.clientX =
        0),
    (this.key = ''),
    (this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1),
    (this.state = null),
    (this.pointerId = 0),
    (this.pointerType = ''),
    (this.i = null),
    t)
  ) {
    var n = (this.type = t.type),
      r =
        t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : null
    if (
      ((this.target = t.target || t.srcElement),
      (this.g = e),
      (e = t.relatedTarget))
    ) {
      if (My) {
        e: {
          try {
            td(e.nodeName)
            var i = !0
            break e
          } catch {}
          i = !1
        }
        i || (e = null)
      }
    } else
      n == 'mouseover'
        ? (e = t.fromElement)
        : n == 'mouseout' && (e = t.toElement)
    ;(this.relatedTarget = e),
      r
        ? ((this.clientX = r.clientX !== void 0 ? r.clientX : r.pageX),
          (this.clientY = r.clientY !== void 0 ? r.clientY : r.pageY),
          (this.screenX = r.screenX || 0),
          (this.screenY = r.screenY || 0))
        : ((this.clientX = t.clientX !== void 0 ? t.clientX : t.pageX),
          (this.clientY = t.clientY !== void 0 ? t.clientY : t.pageY),
          (this.screenX = t.screenX || 0),
          (this.screenY = t.screenY || 0)),
      (this.button = t.button),
      (this.key = t.key || ''),
      (this.ctrlKey = t.ctrlKey),
      (this.altKey = t.altKey),
      (this.shiftKey = t.shiftKey),
      (this.metaKey = t.metaKey),
      (this.pointerId = t.pointerId || 0),
      (this.pointerType =
        typeof t.pointerType == 'string'
          ? t.pointerType
          : qA[t.pointerType] || ''),
      (this.state = t.state),
      (this.i = t),
      t.defaultPrevented && vi.$.h.call(this)
  }
}
ce(vi, ve)
var qA = { 2: 'touch', 3: 'pen', 4: 'mouse' }
vi.prototype.h = function () {
  vi.$.h.call(this)
  var t = this.i
  t.preventDefault ? t.preventDefault() : (t.returnValue = !1)
}
var bi = 'closure_listenable_' + ((1e6 * Math.random()) | 0),
  zA = 0
function GA(t, e, n, r, i) {
  ;(this.listener = t),
    (this.proxy = null),
    (this.src = e),
    (this.type = n),
    (this.capture = !!r),
    (this.la = i),
    (this.key = ++zA),
    (this.fa = this.ia = !1)
}
function zo(t) {
  ;(t.fa = !0),
    (t.listener = null),
    (t.proxy = null),
    (t.src = null),
    (t.la = null)
}
function nd(t, e, n) {
  for (let r in t) e.call(n, t[r], r, t)
}
function WA(t, e) {
  for (let n in t) e.call(void 0, t[n], n, t)
}
function Oy(t) {
  let e = {}
  for (let n in t) e[n] = t[n]
  return e
}
var _y =
  'constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf'.split(
    ' '
  )
function ky(t, e) {
  let n, r
  for (let i = 1; i < arguments.length; i++) {
    r = arguments[i]
    for (n in r) t[n] = r[n]
    for (let s = 0; s < _y.length; s++)
      (n = _y[s]), Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
  }
}
function Go(t) {
  ;(this.src = t), (this.g = {}), (this.h = 0)
}
Go.prototype.add = function (t, e, n, r, i) {
  var s = t.toString()
  ;(t = this.g[s]), t || ((t = this.g[s] = []), this.h++)
  var o = Bl(t, e, r, i)
  return (
    -1 < o
      ? ((e = t[o]), n || (e.ia = !1))
      : ((e = new GA(e, this.src, s, !!r, i)), (e.ia = n), t.push(e)),
    e
  )
}
function jl(t, e) {
  var n = e.type
  if (n in t.g) {
    var r = t.g[n],
      i = Ry(r, e),
      s
    ;(s = 0 <= i) && Array.prototype.splice.call(r, i, 1),
      s && (zo(e), t.g[n].length == 0 && (delete t.g[n], t.h--))
  }
}
function Bl(t, e, n, r) {
  for (var i = 0; i < t.length; ++i) {
    var s = t[i]
    if (!s.fa && s.listener == e && s.capture == !!n && s.la == r) return i
  }
  return -1
}
var rd = 'closure_lm_' + ((1e6 * Math.random()) | 0),
  Ol = {}
function Fy(t, e, n, r, i) {
  if (r && r.once) return Vy(t, e, n, r, i)
  if (Array.isArray(e)) {
    for (var s = 0; s < e.length; s++) Fy(t, e[s], n, r, i)
    return null
  }
  return (
    (n = od(n)),
    t && t[bi] ? t.O(e, n, Ci(r) ? !!r.capture : !!r, i) : Ly(t, e, n, !1, r, i)
  )
}
function Ly(t, e, n, r, i, s) {
  if (!e) throw Error('Invalid event type')
  var o = Ci(i) ? !!i.capture : !!i,
    a = sd(t)
  if ((a || (t[rd] = a = new Go(t)), (n = a.add(e, n, r, o, s)), n.proxy))
    return n
  if (
    ((r = KA()),
    (n.proxy = r),
    (r.src = t),
    (r.listener = n),
    t.addEventListener)
  )
    UA || (i = o),
      i === void 0 && (i = !1),
      t.addEventListener(e.toString(), r, i)
  else if (t.attachEvent) t.attachEvent(jy(e.toString()), r)
  else if (t.addListener && t.removeListener) t.addListener(r)
  else throw Error('addEventListener and attachEvent are unavailable.')
  return n
}
function KA() {
  function t(n) {
    return e.call(t.src, t.listener, n)
  }
  let e = QA
  return t
}
function Vy(t, e, n, r, i) {
  if (Array.isArray(e)) {
    for (var s = 0; s < e.length; s++) Vy(t, e[s], n, r, i)
    return null
  }
  return (
    (n = od(n)),
    t && t[bi] ? t.P(e, n, Ci(r) ? !!r.capture : !!r, i) : Ly(t, e, n, !0, r, i)
  )
}
function Uy(t, e, n, r, i) {
  if (Array.isArray(e)) for (var s = 0; s < e.length; s++) Uy(t, e[s], n, r, i)
  else
    (r = Ci(r) ? !!r.capture : !!r),
      (n = od(n)),
      t && t[bi]
        ? ((t = t.i),
          (e = String(e).toString()),
          e in t.g &&
            ((s = t.g[e]),
            (n = Bl(s, n, r, i)),
            -1 < n &&
              (zo(s[n]),
              Array.prototype.splice.call(s, n, 1),
              s.length == 0 && (delete t.g[e], t.h--))))
        : t &&
          (t = sd(t)) &&
          ((e = t.g[e.toString()]),
          (t = -1),
          e && (t = Bl(e, n, r, i)),
          (n = -1 < t ? e[t] : null) && id(n))
}
function id(t) {
  if (typeof t != 'number' && t && !t.fa) {
    var e = t.src
    if (e && e[bi]) jl(e.i, t)
    else {
      var n = t.type,
        r = t.proxy
      e.removeEventListener
        ? e.removeEventListener(n, r, t.capture)
        : e.detachEvent
          ? e.detachEvent(jy(n), r)
          : e.addListener && e.removeListener && e.removeListener(r),
        (n = sd(e))
          ? (jl(n, t), n.h == 0 && ((n.src = null), (e[rd] = null)))
          : zo(t)
    }
  }
}
function jy(t) {
  return t in Ol ? Ol[t] : (Ol[t] = 'on' + t)
}
function QA(t, e) {
  if (t.fa) t = !0
  else {
    e = new vi(e, this)
    var n = t.listener,
      r = t.la || t.src
    t.ia && id(t), (t = n.call(r, e))
  }
  return t
}
function sd(t) {
  return (t = t[rd]), t instanceof Go ? t : null
}
var kl = '__closure_events_fn_' + ((1e9 * Math.random()) >>> 0)
function od(t) {
  return typeof t == 'function'
    ? t
    : (t[kl] ||
        (t[kl] = function (e) {
          return t.handleEvent(e)
        }),
      t[kl])
}
function ae() {
  Ut.call(this), (this.i = new Go(this)), (this.S = this), (this.J = null)
}
ce(ae, Ut)
ae.prototype[bi] = !0
ae.prototype.removeEventListener = function (t, e, n, r) {
  Uy(this, t, e, n, r)
}
function de(t, e) {
  var n,
    r = t.J
  if (r) for (n = []; r; r = r.J) n.push(r)
  if (((t = t.S), (r = e.type || e), typeof e == 'string')) e = new ve(e, t)
  else if (e instanceof ve) e.target = e.target || t
  else {
    var i = e
    ;(e = new ve(r, t)), ky(e, i)
  }
  if (((i = !0), n))
    for (var s = n.length - 1; 0 <= s; s--) {
      var o = (e.g = n[s])
      i = Oo(o, r, !0, e) && i
    }
  if (
    ((o = e.g = t), (i = Oo(o, r, !0, e) && i), (i = Oo(o, r, !1, e) && i), n)
  )
    for (s = 0; s < n.length; s++) (o = e.g = n[s]), (i = Oo(o, r, !1, e) && i)
}
ae.prototype.N = function () {
  if ((ae.$.N.call(this), this.i)) {
    var t = this.i,
      e
    for (e in t.g) {
      for (var n = t.g[e], r = 0; r < n.length; r++) zo(n[r])
      delete t.g[e], t.h--
    }
  }
  this.J = null
}
ae.prototype.O = function (t, e, n, r) {
  return this.i.add(String(t), e, !1, n, r)
}
ae.prototype.P = function (t, e, n, r) {
  return this.i.add(String(t), e, !0, n, r)
}
function Oo(t, e, n, r) {
  if (((e = t.i.g[String(e)]), !e)) return !0
  e = e.concat()
  for (var i = !0, s = 0; s < e.length; ++s) {
    var o = e[s]
    if (o && !o.fa && o.capture == n) {
      var a = o.listener,
        c = o.la || o.src
      o.ia && jl(t.i, o), (i = a.call(c, r) !== !1 && i)
    }
  }
  return i && !r.defaultPrevented
}
var ad = T.JSON.stringify,
  $l = class {
    constructor(e, n) {
      ;(this.i = e), (this.j = n), (this.h = 0), (this.g = null)
    }
    get() {
      let e
      return (
        0 < this.h
          ? (this.h--, (e = this.g), (this.g = e.next), (e.next = null))
          : (e = this.i()),
        e
      )
    }
  }
function YA() {
  var t = cd
  let e = null
  return (
    t.g && ((e = t.g), (t.g = t.g.next), t.g || (t.h = null), (e.next = null)),
    e
  )
}
var Hl = class {
    constructor() {
      this.h = this.g = null
    }
    add(e, n) {
      let r = By.get()
      r.set(e, n), this.h ? (this.h.next = r) : (this.g = r), (this.h = r)
    }
  },
  By = new $l(
    () => new ql(),
    (t) => t.reset()
  ),
  ql = class {
    constructor() {
      this.next = this.g = this.h = null
    }
    set(e, n) {
      ;(this.h = e), (this.g = n), (this.next = null)
    }
    reset() {
      this.next = this.g = this.h = null
    }
  }
function JA(t) {
  var e = 1
  t = t.split(':')
  let n = []
  for (; 0 < e && t.length; ) n.push(t.shift()), e--
  return t.length && n.push(t.join(':')), n
}
function ZA(t) {
  T.setTimeout(() => {
    throw t
  }, 0)
}
var _i,
  Ii = !1,
  cd = new Hl(),
  $y = () => {
    let t = T.Promise.resolve(void 0)
    _i = () => {
      t.then(XA)
    }
  },
  XA = () => {
    for (var t; (t = YA()); ) {
      try {
        t.h.call(t.g)
      } catch (n) {
        ZA(n)
      }
      var e = By
      e.j(t), 100 > e.h && (e.h++, (t.next = e.g), (e.g = t))
    }
    Ii = !1
  }
function Wo(t, e) {
  ae.call(this),
    (this.h = t || 1),
    (this.g = e || T),
    (this.j = ye(this.qb, this)),
    (this.l = Date.now())
}
ce(Wo, ae)
y = Wo.prototype
y.ga = !1
y.T = null
y.qb = function () {
  if (this.ga) {
    var t = Date.now() - this.l
    0 < t && t < 0.8 * this.h
      ? (this.T = this.g.setTimeout(this.j, this.h - t))
      : (this.T && (this.g.clearTimeout(this.T), (this.T = null)),
        de(this, 'tick'),
        this.ga && (ud(this), this.start()))
  }
}
y.start = function () {
  ;(this.ga = !0),
    this.T ||
      ((this.T = this.g.setTimeout(this.j, this.h)), (this.l = Date.now()))
}
function ud(t) {
  ;(t.ga = !1), t.T && (t.g.clearTimeout(t.T), (t.T = null))
}
y.N = function () {
  Wo.$.N.call(this), ud(this), delete this.g
}
function ld(t, e, n) {
  if (typeof t == 'function') n && (t = ye(t, n))
  else if (t && typeof t.handleEvent == 'function') t = ye(t.handleEvent, t)
  else throw Error('Invalid listener argument')
  return 2147483647 < Number(e) ? -1 : T.setTimeout(t, e || 0)
}
function Hy(t) {
  t.g = ld(() => {
    ;(t.g = null), t.i && ((t.i = !1), Hy(t))
  }, t.j)
  let e = t.h
  ;(t.h = null), t.m.apply(null, e)
}
var zl = class extends Ut {
  constructor(e, n) {
    super(),
      (this.m = e),
      (this.j = n),
      (this.h = null),
      (this.i = !1),
      (this.g = null)
  }
  l(e) {
    ;(this.h = arguments), this.g ? (this.i = !0) : Hy(this)
  }
  N() {
    super.N(),
      this.g &&
        (T.clearTimeout(this.g),
        (this.g = null),
        (this.i = !1),
        (this.h = null))
  }
}
function Ei(t) {
  Ut.call(this), (this.h = t), (this.g = {})
}
ce(Ei, Ut)
var Iy = []
function qy(t, e, n, r) {
  Array.isArray(n) || (n && (Iy[0] = n.toString()), (n = Iy))
  for (var i = 0; i < n.length; i++) {
    var s = Fy(e, n[i], r || t.handleEvent, !1, t.h || t)
    if (!s) break
    t.g[s.key] = s
  }
}
function zy(t) {
  nd(
    t.g,
    function (e, n) {
      this.g.hasOwnProperty(n) && id(e)
    },
    t
  ),
    (t.g = {})
}
Ei.prototype.N = function () {
  Ei.$.N.call(this), zy(this)
}
Ei.prototype.handleEvent = function () {
  throw Error('EventHandler.handleEvent not implemented')
}
function Ko() {
  this.g = !0
}
Ko.prototype.Ea = function () {
  this.g = !1
}
function eS(t, e, n, r, i, s) {
  t.info(function () {
    if (t.g)
      if (s)
        for (var o = '', a = s.split('&'), c = 0; c < a.length; c++) {
          var u = a[c].split('=')
          if (1 < u.length) {
            var l = u[0]
            u = u[1]
            var d = l.split('_')
            o =
              2 <= d.length && d[1] == 'type'
                ? o + (l + '=' + u + '&')
                : o + (l + '=redacted&')
          }
        }
      else o = null
    else o = s
    return (
      'XMLHTTP REQ (' +
      r +
      ') [attempt ' +
      i +
      ']: ' +
      e +
      `
` +
      n +
      `
` +
      o
    )
  })
}
function tS(t, e, n, r, i, s, o) {
  t.info(function () {
    return (
      'XMLHTTP RESP (' +
      r +
      ') [ attempt ' +
      i +
      ']: ' +
      e +
      `
` +
      n +
      `
` +
      s +
      ' ' +
      o
    )
  })
}
function tr(t, e, n, r) {
  t.info(function () {
    return 'XMLHTTP TEXT (' + e + '): ' + rS(t, n) + (r ? ' ' + r : '')
  })
}
function nS(t, e) {
  t.info(function () {
    return 'TIMEOUT: ' + e
  })
}
Ko.prototype.info = function () {}
function rS(t, e) {
  if (!t.g) return e
  if (!e) return null
  try {
    var n = JSON.parse(e)
    if (n) {
      for (t = 0; t < n.length; t++)
        if (Array.isArray(n[t])) {
          var r = n[t]
          if (!(2 > r.length)) {
            var i = r[1]
            if (Array.isArray(i) && !(1 > i.length)) {
              var s = i[0]
              if (s != 'noop' && s != 'stop' && s != 'close')
                for (var o = 1; o < i.length; o++) i[o] = ''
            }
          }
        }
    }
    return ad(n)
  } catch {
    return e
  }
}
var mn = {},
  Ey = null
function Qo() {
  return (Ey = Ey || new ae())
}
mn.Ta = 'serverreachability'
function Gy(t) {
  ve.call(this, mn.Ta, t)
}
ce(Gy, ve)
function wi(t) {
  let e = Qo()
  de(e, new Gy(e))
}
mn.STAT_EVENT = 'statevent'
function Wy(t, e) {
  ve.call(this, mn.STAT_EVENT, t), (this.stat = e)
}
ce(Wy, ve)
function Ee(t) {
  let e = Qo()
  de(e, new Wy(e, t))
}
mn.Ua = 'timingevent'
function Ky(t, e) {
  ve.call(this, mn.Ua, t), (this.size = e)
}
ce(Ky, ve)
function Ai(t, e) {
  if (typeof t != 'function')
    throw Error('Fn must not be null and must be a function')
  return T.setTimeout(function () {
    t()
  }, e)
}
var Yo = {
    NO_ERROR: 0,
    rb: 1,
    Eb: 2,
    Db: 3,
    yb: 4,
    Cb: 5,
    Fb: 6,
    Qa: 7,
    TIMEOUT: 8,
    Ib: 9,
  },
  Qy = {
    wb: 'complete',
    Sb: 'success',
    Ra: 'error',
    Qa: 'abort',
    Kb: 'ready',
    Lb: 'readystatechange',
    TIMEOUT: 'timeout',
    Gb: 'incrementaldata',
    Jb: 'progress',
    zb: 'downloadprogress',
    $b: 'uploadprogress',
  }
function dd() {}
dd.prototype.h = null
function wy(t) {
  return t.h || (t.h = t.i())
}
function Yy() {}
var Si = { OPEN: 'a', vb: 'b', Ra: 'c', Hb: 'd' }
function hd() {
  ve.call(this, 'd')
}
ce(hd, ve)
function fd() {
  ve.call(this, 'c')
}
ce(fd, ve)
var Gl
function Jo() {}
ce(Jo, dd)
Jo.prototype.g = function () {
  return new XMLHttpRequest()
}
Jo.prototype.i = function () {
  return {}
}
Gl = new Jo()
function Ni(t, e, n, r) {
  ;(this.l = t),
    (this.j = e),
    (this.m = n),
    (this.W = r || 1),
    (this.U = new Ei(this)),
    (this.P = iS),
    (t = Ll ? 125 : void 0),
    (this.V = new Wo(t)),
    (this.I = null),
    (this.i = !1),
    (this.u = this.B = this.A = this.L = this.G = this.Y = this.C = null),
    (this.F = []),
    (this.g = null),
    (this.o = 0),
    (this.s = this.v = null),
    (this.ca = -1),
    (this.J = !1),
    (this.O = 0),
    (this.M = null),
    (this.ba = this.K = this.aa = this.S = !1),
    (this.h = new Jy())
}
function Jy() {
  ;(this.i = null), (this.g = ''), (this.h = !1)
}
var iS = 45e3,
  Zy = {},
  Wl = {}
y = Ni.prototype
y.setTimeout = function (t) {
  this.P = t
}
function Kl(t, e, n) {
  ;(t.L = 1), (t.A = Xo(wt(e))), (t.u = n), (t.S = !0), Xy(t, null)
}
function Xy(t, e) {
  ;(t.G = Date.now()), Ri(t), (t.B = wt(t.A))
  var n = t.B,
    r = t.W
  Array.isArray(r) || (r = [String(r)]),
    av(n.i, 't', r),
    (t.o = 0),
    (n = t.l.J),
    (t.h = new Jy()),
    (t.g = Sv(t.l, n ? e : null, !t.u)),
    0 < t.O && (t.M = new zl(ye(t.Pa, t, t.g), t.O)),
    qy(t.U, t.g, 'readystatechange', t.nb),
    (e = t.I ? Oy(t.I) : {}),
    t.u
      ? (t.v || (t.v = 'POST'),
        (e['Content-Type'] = 'application/x-www-form-urlencoded'),
        t.g.ha(t.B, t.v, t.u, e))
      : ((t.v = 'GET'), t.g.ha(t.B, t.v, null, e)),
    wi(),
    eS(t.j, t.v, t.B, t.m, t.W, t.u)
}
y.nb = function (t) {
  t = t.target
  let e = this.M
  e && nt(t) == 3 ? e.l() : this.Pa(t)
}
y.Pa = function (t) {
  try {
    if (t == this.g)
      e: {
        let l = nt(this.g)
        var e = this.g.Ia()
        let d = this.g.da()
        if (
          !(3 > l) &&
          (l != 3 || Ll || (this.g && (this.h.h || this.g.ja() || by(this.g))))
        ) {
          this.J || l != 4 || e == 7 || (e == 8 || 0 >= d ? wi(3) : wi(2)),
            Zo(this)
          var n = this.g.da()
          this.ca = n
          t: if (ev(this)) {
            var r = by(this.g)
            t = ''
            var i = r.length,
              s = nt(this.g) == 4
            if (!this.h.i) {
              if (typeof TextDecoder > 'u') {
                fn(this), mi(this)
                var o = ''
                break t
              }
              this.h.i = new T.TextDecoder()
            }
            for (e = 0; e < i; e++)
              (this.h.h = !0),
                (t += this.h.i.decode(r[e], { stream: s && e == i - 1 }))
            ;(r.length = 0), (this.h.g += t), (this.o = 0), (o = this.h.g)
          } else o = this.g.ja()
          if (
            ((this.i = n == 200),
            tS(this.j, this.v, this.B, this.m, this.W, l, n),
            this.i)
          ) {
            if (this.aa && !this.K) {
              t: {
                if (this.g) {
                  var a,
                    c = this.g
                  if (
                    (a = c.g
                      ? c.g.getResponseHeader('X-HTTP-Initial-Response')
                      : null) &&
                    !yi(a)
                  ) {
                    var u = a
                    break t
                  }
                }
                u = null
              }
              if ((n = u))
                tr(
                  this.j,
                  this.m,
                  n,
                  'Initial handshake response via X-HTTP-Initial-Response'
                ),
                  (this.K = !0),
                  Ql(this, n)
              else {
                ;(this.i = !1), (this.s = 3), Ee(12), fn(this), mi(this)
                break e
              }
            }
            this.S
              ? (tv(this, l, o),
                Ll &&
                  this.i &&
                  l == 3 &&
                  (qy(this.U, this.V, 'tick', this.mb), this.V.start()))
              : (tr(this.j, this.m, o, null), Ql(this, o)),
              l == 4 && fn(this),
              this.i &&
                !this.J &&
                (l == 4 ? Tv(this.l, this) : ((this.i = !1), Ri(this)))
          } else
            CS(this.g),
              n == 400 && 0 < o.indexOf('Unknown SID')
                ? ((this.s = 3), Ee(12))
                : ((this.s = 0), Ee(13)),
              fn(this),
              mi(this)
        }
      }
  } catch {
  } finally {
  }
}
function ev(t) {
  return t.g ? t.v == 'GET' && t.L != 2 && t.l.Ha : !1
}
function tv(t, e, n) {
  let r = !0,
    i
  for (; !t.J && t.o < n.length; )
    if (((i = sS(t, n)), i == Wl)) {
      e == 4 && ((t.s = 4), Ee(14), (r = !1)),
        tr(t.j, t.m, null, '[Incomplete Response]')
      break
    } else if (i == Zy) {
      ;(t.s = 4), Ee(15), tr(t.j, t.m, n, '[Invalid Chunk]'), (r = !1)
      break
    } else tr(t.j, t.m, i, null), Ql(t, i)
  ev(t) && t.o != 0 && ((t.h.g = t.h.g.slice(t.o)), (t.o = 0)),
    e != 4 || n.length != 0 || t.h.h || ((t.s = 1), Ee(16), (r = !1)),
    (t.i = t.i && r),
    r
      ? 0 < n.length &&
        !t.ba &&
        ((t.ba = !0),
        (e = t.l),
        e.g == t &&
          e.ca &&
          !e.M &&
          (e.l.info(
            'Great, no buffering proxy detected. Bytes received: ' + n.length
          ),
          _d(e),
          (e.M = !0),
          Ee(11)))
      : (tr(t.j, t.m, n, '[Invalid Chunked Response]'), fn(t), mi(t))
}
y.mb = function () {
  if (this.g) {
    var t = nt(this.g),
      e = this.g.ja()
    this.o < e.length &&
      (Zo(this), tv(this, t, e), this.i && t != 4 && Ri(this))
  }
}
function sS(t, e) {
  var n = t.o,
    r = e.indexOf(
      `
`,
      n
    )
  return r == -1
    ? Wl
    : ((n = Number(e.substring(n, r))),
      isNaN(n)
        ? Zy
        : ((r += 1),
          r + n > e.length ? Wl : ((e = e.slice(r, r + n)), (t.o = r + n), e)))
}
y.cancel = function () {
  ;(this.J = !0), fn(this)
}
function Ri(t) {
  ;(t.Y = Date.now() + t.P), nv(t, t.P)
}
function nv(t, e) {
  if (t.C != null) throw Error('WatchDog timer not null')
  t.C = Ai(ye(t.lb, t), e)
}
function Zo(t) {
  t.C && (T.clearTimeout(t.C), (t.C = null))
}
y.lb = function () {
  this.C = null
  let t = Date.now()
  0 <= t - this.Y
    ? (nS(this.j, this.B),
      this.L != 2 && (wi(), Ee(17)),
      fn(this),
      (this.s = 2),
      mi(this))
    : nv(this, this.Y - t)
}
function mi(t) {
  t.l.H == 0 || t.J || Tv(t.l, t)
}
function fn(t) {
  Zo(t)
  var e = t.M
  e && typeof e.sa == 'function' && e.sa(),
    (t.M = null),
    ud(t.V),
    zy(t.U),
    t.g && ((e = t.g), (t.g = null), e.abort(), e.sa())
}
function Ql(t, e) {
  try {
    var n = t.l
    if (n.H != 0 && (n.g == t || Yl(n.i, t))) {
      if (!t.K && Yl(n.i, t) && n.H == 3) {
        try {
          var r = n.Ja.g.parse(e)
        } catch {
          r = null
        }
        if (Array.isArray(r) && r.length == 3) {
          var i = r
          if (i[0] == 0) {
            e: if (!n.u) {
              if (n.g)
                if (n.g.G + 3e3 < t.G) Uo(n), na(n)
                else break e
              vd(n), Ee(18)
            }
          } else
            (n.Fa = i[1]),
              0 < n.Fa - n.V &&
                37500 > i[2] &&
                n.G &&
                n.A == 0 &&
                !n.v &&
                (n.v = Ai(ye(n.ib, n), 6e3))
          if (1 >= lv(n.i) && n.oa) {
            try {
              n.oa()
            } catch {}
            n.oa = void 0
          }
        } else pn(n, 11)
      } else if (((t.K || n.g == t) && Uo(n), !yi(e)))
        for (i = n.Ja.g.parse(e), e = 0; e < i.length; e++) {
          let u = i[e]
          if (((n.V = u[0]), (u = u[1]), n.H == 2))
            if (u[0] == 'c') {
              ;(n.K = u[1]), (n.pa = u[2])
              let l = u[3]
              l != null && ((n.ra = l), n.l.info('VER=' + n.ra))
              let d = u[4]
              d != null && ((n.Ga = d), n.l.info('SVER=' + n.Ga))
              let h = u[5]
              h != null &&
                typeof h == 'number' &&
                0 < h &&
                ((r = 1.5 * h),
                (n.L = r),
                n.l.info('backChannelRequestTimeoutMs_=' + r)),
                (r = n)
              let f = t.g
              if (f) {
                let _ = f.g
                  ? f.g.getResponseHeader('X-Client-Wire-Protocol')
                  : null
                if (_) {
                  var s = r.i
                  s.g ||
                    (_.indexOf('spdy') == -1 &&
                      _.indexOf('quic') == -1 &&
                      _.indexOf('h2') == -1) ||
                    ((s.j = s.l),
                    (s.g = new Set()),
                    s.h && (pd(s, s.h), (s.h = null)))
                }
                if (r.F) {
                  let w = f.g
                    ? f.g.getResponseHeader('X-HTTP-Session-Id')
                    : null
                  w && ((r.Da = w), W(r.I, r.F, w))
                }
              }
              ;(n.H = 3),
                n.h && n.h.Ba(),
                n.ca &&
                  ((n.S = Date.now() - t.G),
                  n.l.info('Handshake RTT: ' + n.S + 'ms')),
                (r = n)
              var o = t
              if (((r.wa = Av(r, r.J ? r.pa : null, r.Y)), o.K)) {
                dv(r.i, o)
                var a = o,
                  c = r.L
                c && a.setTimeout(c), a.C && (Zo(a), Ri(a)), (r.g = o)
              } else wv(r)
              0 < n.j.length && ra(n)
            } else (u[0] != 'stop' && u[0] != 'close') || pn(n, 7)
          else
            n.H == 3 &&
              (u[0] == 'stop' || u[0] == 'close'
                ? u[0] == 'stop'
                  ? pn(n, 7)
                  : yd(n)
                : u[0] != 'noop' && n.h && n.h.Aa(u),
              (n.A = 0))
        }
    }
    wi(4)
  } catch {}
}
function oS(t) {
  if (t.Z && typeof t.Z == 'function') return t.Z()
  if (
    (typeof Map < 'u' && t instanceof Map) ||
    (typeof Set < 'u' && t instanceof Set)
  )
    return Array.from(t.values())
  if (typeof t == 'string') return t.split('')
  if (Ho(t)) {
    for (var e = [], n = t.length, r = 0; r < n; r++) e.push(t[r])
    return e
  }
  ;(e = []), (n = 0)
  for (r in t) e[n++] = t[r]
  return e
}
function aS(t) {
  if (t.ta && typeof t.ta == 'function') return t.ta()
  if (!t.Z || typeof t.Z != 'function') {
    if (typeof Map < 'u' && t instanceof Map) return Array.from(t.keys())
    if (!(typeof Set < 'u' && t instanceof Set)) {
      if (Ho(t) || typeof t == 'string') {
        var e = []
        t = t.length
        for (var n = 0; n < t; n++) e.push(n)
        return e
      }
      ;(e = []), (n = 0)
      for (let r in t) e[n++] = r
      return e
    }
  }
}
function rv(t, e) {
  if (t.forEach && typeof t.forEach == 'function') t.forEach(e, void 0)
  else if (Ho(t) || typeof t == 'string')
    Array.prototype.forEach.call(t, e, void 0)
  else
    for (var n = aS(t), r = oS(t), i = r.length, s = 0; s < i; s++)
      e.call(void 0, r[s], n && n[s], t)
}
var iv = RegExp(
  '^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$'
)
function cS(t, e) {
  if (t) {
    t = t.split('&')
    for (var n = 0; n < t.length; n++) {
      var r = t[n].indexOf('='),
        i = null
      if (0 <= r) {
        var s = t[n].substring(0, r)
        i = t[n].substring(r + 1)
      } else s = t[n]
      e(s, i ? decodeURIComponent(i.replace(/\+/g, ' ')) : '')
    }
  }
}
function gn(t) {
  if (
    ((this.g = this.s = this.j = ''),
    (this.m = null),
    (this.o = this.l = ''),
    (this.h = !1),
    t instanceof gn)
  ) {
    ;(this.h = t.h),
      Lo(this, t.j),
      (this.s = t.s),
      (this.g = t.g),
      Vo(this, t.m),
      (this.l = t.l)
    var e = t.i,
      n = new Di()
    ;(n.i = e.i),
      e.g && ((n.g = new Map(e.g)), (n.h = e.h)),
      Dy(this, n),
      (this.o = t.o)
  } else
    t && (e = String(t).match(iv))
      ? ((this.h = !1),
        Lo(this, e[1] || '', !0),
        (this.s = pi(e[2] || '')),
        (this.g = pi(e[3] || '', !0)),
        Vo(this, e[4]),
        (this.l = pi(e[5] || '', !0)),
        Dy(this, e[6] || '', !0),
        (this.o = pi(e[7] || '')))
      : ((this.h = !1), (this.i = new Di(null, this.h)))
}
gn.prototype.toString = function () {
  var t = [],
    e = this.j
  e && t.push(gi(e, Ty, !0), ':')
  var n = this.g
  return (
    (n || e == 'file') &&
      (t.push('//'),
      (e = this.s) && t.push(gi(e, Ty, !0), '@'),
      t.push(
        encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g, '%$1')
      ),
      (n = this.m),
      n != null && t.push(':', String(n))),
    (n = this.l) &&
      (this.g && n.charAt(0) != '/' && t.push('/'),
      t.push(gi(n, n.charAt(0) == '/' ? dS : lS, !0))),
    (n = this.i.toString()) && t.push('?', n),
    (n = this.o) && t.push('#', gi(n, fS)),
    t.join('')
  )
}
function wt(t) {
  return new gn(t)
}
function Lo(t, e, n) {
  ;(t.j = n ? pi(e, !0) : e), t.j && (t.j = t.j.replace(/:$/, ''))
}
function Vo(t, e) {
  if (e) {
    if (((e = Number(e)), isNaN(e) || 0 > e))
      throw Error('Bad port number ' + e)
    t.m = e
  } else t.m = null
}
function Dy(t, e, n) {
  e instanceof Di
    ? ((t.i = e), pS(t.i, t.h))
    : (n || (e = gi(e, hS)), (t.i = new Di(e, t.h)))
}
function W(t, e, n) {
  t.i.set(e, n)
}
function Xo(t) {
  return (
    W(
      t,
      'zx',
      Math.floor(2147483648 * Math.random()).toString(36) +
        Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(
          36
        )
    ),
    t
  )
}
function pi(t, e) {
  return t
    ? e
      ? decodeURI(t.replace(/%25/g, '%2525'))
      : decodeURIComponent(t)
    : ''
}
function gi(t, e, n) {
  return typeof t == 'string'
    ? ((t = encodeURI(t).replace(e, uS)),
      n && (t = t.replace(/%25([0-9a-fA-F]{2})/g, '%$1')),
      t)
    : null
}
function uS(t) {
  return (
    (t = t.charCodeAt(0)),
    '%' + ((t >> 4) & 15).toString(16) + (t & 15).toString(16)
  )
}
var Ty = /[#\/\?@]/g,
  lS = /[#\?:]/g,
  dS = /[#\?]/g,
  hS = /[#\?@]/g,
  fS = /#/g
function Di(t, e) {
  ;(this.h = this.g = null), (this.i = t || null), (this.j = !!e)
}
function jt(t) {
  t.g ||
    ((t.g = new Map()),
    (t.h = 0),
    t.i &&
      cS(t.i, function (e, n) {
        t.add(decodeURIComponent(e.replace(/\+/g, ' ')), n)
      }))
}
y = Di.prototype
y.add = function (t, e) {
  jt(this), (this.i = null), (t = ir(this, t))
  var n = this.g.get(t)
  return n || this.g.set(t, (n = [])), n.push(e), (this.h += 1), this
}
function sv(t, e) {
  jt(t),
    (e = ir(t, e)),
    t.g.has(e) && ((t.i = null), (t.h -= t.g.get(e).length), t.g.delete(e))
}
function ov(t, e) {
  return jt(t), (e = ir(t, e)), t.g.has(e)
}
y.forEach = function (t, e) {
  jt(this),
    this.g.forEach(function (n, r) {
      n.forEach(function (i) {
        t.call(e, i, r, this)
      }, this)
    }, this)
}
y.ta = function () {
  jt(this)
  let t = Array.from(this.g.values()),
    e = Array.from(this.g.keys()),
    n = []
  for (let r = 0; r < e.length; r++) {
    let i = t[r]
    for (let s = 0; s < i.length; s++) n.push(e[r])
  }
  return n
}
y.Z = function (t) {
  jt(this)
  let e = []
  if (typeof t == 'string')
    ov(this, t) && (e = e.concat(this.g.get(ir(this, t))))
  else {
    t = Array.from(this.g.values())
    for (let n = 0; n < t.length; n++) e = e.concat(t[n])
  }
  return e
}
y.set = function (t, e) {
  return (
    jt(this),
    (this.i = null),
    (t = ir(this, t)),
    ov(this, t) && (this.h -= this.g.get(t).length),
    this.g.set(t, [e]),
    (this.h += 1),
    this
  )
}
y.get = function (t, e) {
  return t ? ((t = this.Z(t)), 0 < t.length ? String(t[0]) : e) : e
}
function av(t, e, n) {
  sv(t, e),
    0 < n.length && ((t.i = null), t.g.set(ir(t, e), ed(n)), (t.h += n.length))
}
y.toString = function () {
  if (this.i) return this.i
  if (!this.g) return ''
  let t = [],
    e = Array.from(this.g.keys())
  for (var n = 0; n < e.length; n++) {
    var r = e[n]
    let s = encodeURIComponent(String(r)),
      o = this.Z(r)
    for (r = 0; r < o.length; r++) {
      var i = s
      o[r] !== '' && (i += '=' + encodeURIComponent(String(o[r]))), t.push(i)
    }
  }
  return (this.i = t.join('&'))
}
function ir(t, e) {
  return (e = String(e)), t.j && (e = e.toLowerCase()), e
}
function pS(t, e) {
  e &&
    !t.j &&
    (jt(t),
    (t.i = null),
    t.g.forEach(function (n, r) {
      var i = r.toLowerCase()
      r != i && (sv(this, r), av(this, i, n))
    }, t)),
    (t.j = e)
}
var gS = class {
  constructor(t, e) {
    ;(this.g = t), (this.map = e)
  }
}
function cv(t) {
  ;(this.l = t || mS),
    T.PerformanceNavigationTiming
      ? ((t = T.performance.getEntriesByType('navigation')),
        (t =
          0 < t.length &&
          (t[0].nextHopProtocol == 'hq' || t[0].nextHopProtocol == 'h2')))
      : (t = !!(T.g && T.g.Ka && T.g.Ka() && T.g.Ka().dc)),
    (this.j = t ? this.l : 1),
    (this.g = null),
    1 < this.j && (this.g = new Set()),
    (this.h = null),
    (this.i = [])
}
var mS = 10
function uv(t) {
  return t.h ? !0 : t.g ? t.g.size >= t.j : !1
}
function lv(t) {
  return t.h ? 1 : t.g ? t.g.size : 0
}
function Yl(t, e) {
  return t.h ? t.h == e : t.g ? t.g.has(e) : !1
}
function pd(t, e) {
  t.g ? t.g.add(e) : (t.h = e)
}
function dv(t, e) {
  t.h && t.h == e ? (t.h = null) : t.g && t.g.has(e) && t.g.delete(e)
}
cv.prototype.cancel = function () {
  if (((this.i = hv(this)), this.h)) this.h.cancel(), (this.h = null)
  else if (this.g && this.g.size !== 0) {
    for (let t of this.g.values()) t.cancel()
    this.g.clear()
  }
}
function hv(t) {
  if (t.h != null) return t.i.concat(t.h.F)
  if (t.g != null && t.g.size !== 0) {
    let e = t.i
    for (let n of t.g.values()) e = e.concat(n.F)
    return e
  }
  return ed(t.i)
}
var yS = class {
  stringify(t) {
    return T.JSON.stringify(t, void 0)
  }
  parse(t) {
    return T.JSON.parse(t, void 0)
  }
}
function vS() {
  this.g = new yS()
}
function _S(t, e, n) {
  let r = n || ''
  try {
    rv(t, function (i, s) {
      let o = i
      Ci(i) && (o = ad(i)), e.push(r + s + '=' + encodeURIComponent(o))
    })
  } catch (i) {
    throw (e.push(r + 'type=' + encodeURIComponent('_badmap')), i)
  }
}
function IS(t, e) {
  let n = new Ko()
  if (T.Image) {
    let r = new Image()
    ;(r.onload = Ro(ko, n, r, 'TestLoadImage: loaded', !0, e)),
      (r.onerror = Ro(ko, n, r, 'TestLoadImage: error', !1, e)),
      (r.onabort = Ro(ko, n, r, 'TestLoadImage: abort', !1, e)),
      (r.ontimeout = Ro(ko, n, r, 'TestLoadImage: timeout', !1, e)),
      T.setTimeout(function () {
        r.ontimeout && r.ontimeout()
      }, 1e4),
      (r.src = t)
  } else e(!1)
}
function ko(t, e, n, r, i) {
  try {
    ;(e.onload = null),
      (e.onerror = null),
      (e.onabort = null),
      (e.ontimeout = null),
      i(r)
  } catch {}
}
function xi(t) {
  ;(this.l = t.ec || null), (this.j = t.ob || !1)
}
ce(xi, dd)
xi.prototype.g = function () {
  return new ea(this.l, this.j)
}
xi.prototype.i = (function (t) {
  return function () {
    return t
  }
})({})
function ea(t, e) {
  ae.call(this),
    (this.F = t),
    (this.u = e),
    (this.m = void 0),
    (this.readyState = gd),
    (this.status = 0),
    (this.responseType =
      this.responseText =
      this.response =
      this.statusText =
        ''),
    (this.onreadystatechange = null),
    (this.v = new Headers()),
    (this.h = null),
    (this.C = 'GET'),
    (this.B = ''),
    (this.g = !1),
    (this.A = this.j = this.l = null)
}
ce(ea, ae)
var gd = 0
y = ea.prototype
y.open = function (t, e) {
  if (this.readyState != gd)
    throw (this.abort(), Error('Error reopening a connection'))
  ;(this.C = t), (this.B = e), (this.readyState = 1), Ti(this)
}
y.send = function (t) {
  if (this.readyState != 1)
    throw (this.abort(), Error('need to call open() first. '))
  this.g = !0
  let e = {
    headers: this.v,
    method: this.C,
    credentials: this.m,
    cache: void 0,
  }
  t && (e.body = t),
    (this.F || T)
      .fetch(new Request(this.B, e))
      .then(this.$a.bind(this), this.ka.bind(this))
}
y.abort = function () {
  ;(this.response = this.responseText = ''),
    (this.v = new Headers()),
    (this.status = 0),
    this.j && this.j.cancel('Request was aborted.').catch(() => {}),
    1 <= this.readyState &&
      this.g &&
      this.readyState != 4 &&
      ((this.g = !1), Mi(this)),
    (this.readyState = gd)
}
y.$a = function (t) {
  if (
    this.g &&
    ((this.l = t),
    this.h ||
      ((this.status = this.l.status),
      (this.statusText = this.l.statusText),
      (this.h = t.headers),
      (this.readyState = 2),
      Ti(this)),
    this.g && ((this.readyState = 3), Ti(this), this.g))
  )
    if (this.responseType === 'arraybuffer')
      t.arrayBuffer().then(this.Ya.bind(this), this.ka.bind(this))
    else if (typeof T.ReadableStream < 'u' && 'body' in t) {
      if (((this.j = t.body.getReader()), this.u)) {
        if (this.responseType)
          throw Error(
            'responseType must be empty for "streamBinaryChunks" mode responses.'
          )
        this.response = []
      } else
        (this.response = this.responseText = ''), (this.A = new TextDecoder())
      fv(this)
    } else t.text().then(this.Za.bind(this), this.ka.bind(this))
}
function fv(t) {
  t.j.read().then(t.Xa.bind(t)).catch(t.ka.bind(t))
}
y.Xa = function (t) {
  if (this.g) {
    if (this.u && t.value) this.response.push(t.value)
    else if (!this.u) {
      var e = t.value ? t.value : new Uint8Array(0)
      ;(e = this.A.decode(e, { stream: !t.done })) &&
        (this.response = this.responseText += e)
    }
    t.done ? Mi(this) : Ti(this), this.readyState == 3 && fv(this)
  }
}
y.Za = function (t) {
  this.g && ((this.response = this.responseText = t), Mi(this))
}
y.Ya = function (t) {
  this.g && ((this.response = t), Mi(this))
}
y.ka = function () {
  this.g && Mi(this)
}
function Mi(t) {
  ;(t.readyState = 4), (t.l = null), (t.j = null), (t.A = null), Ti(t)
}
y.setRequestHeader = function (t, e) {
  this.v.append(t, e)
}
y.getResponseHeader = function (t) {
  return (this.h && this.h.get(t.toLowerCase())) || ''
}
y.getAllResponseHeaders = function () {
  if (!this.h) return ''
  let t = [],
    e = this.h.entries()
  for (var n = e.next(); !n.done; )
    (n = n.value), t.push(n[0] + ': ' + n[1]), (n = e.next())
  return t.join(`\r
`)
}
function Ti(t) {
  t.onreadystatechange && t.onreadystatechange.call(t)
}
Object.defineProperty(ea.prototype, 'withCredentials', {
  get: function () {
    return this.m === 'include'
  },
  set: function (t) {
    this.m = t ? 'include' : 'same-origin'
  },
})
var ES = T.JSON.parse
function Y(t) {
  ae.call(this),
    (this.headers = new Map()),
    (this.u = t || null),
    (this.h = !1),
    (this.C = this.g = null),
    (this.I = ''),
    (this.m = 0),
    (this.j = ''),
    (this.l = this.G = this.v = this.F = !1),
    (this.B = 0),
    (this.A = null),
    (this.K = pv),
    (this.L = this.M = !1)
}
ce(Y, ae)
var pv = '',
  wS = /^https?$/i,
  DS = ['POST', 'PUT']
y = Y.prototype
y.Oa = function (t) {
  this.M = t
}
y.ha = function (t, e, n, r) {
  if (this.g)
    throw Error(
      '[goog.net.XhrIo] Object is active with another request=' +
        this.I +
        '; newUri=' +
        t
    )
  ;(e = e ? e.toUpperCase() : 'GET'),
    (this.I = t),
    (this.j = ''),
    (this.m = 0),
    (this.F = !1),
    (this.h = !0),
    (this.g = this.u ? this.u.g() : Gl.g()),
    (this.C = this.u ? wy(this.u) : wy(Gl)),
    (this.g.onreadystatechange = ye(this.La, this))
  try {
    ;(this.G = !0), this.g.open(e, String(t), !0), (this.G = !1)
  } catch (s) {
    Cy(this, s)
    return
  }
  if (((t = n || ''), (n = new Map(this.headers)), r))
    if (Object.getPrototypeOf(r) === Object.prototype)
      for (var i in r) n.set(i, r[i])
    else if (typeof r.keys == 'function' && typeof r.get == 'function')
      for (let s of r.keys()) n.set(s, r.get(s))
    else throw Error('Unknown input type for opt_headers: ' + String(r))
  ;(r = Array.from(n.keys()).find((s) => s.toLowerCase() == 'content-type')),
    (i = T.FormData && t instanceof T.FormData),
    !(0 <= Ry(DS, e)) ||
      r ||
      i ||
      n.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
  for (let [s, o] of n) this.g.setRequestHeader(s, o)
  this.K && (this.g.responseType = this.K),
    'withCredentials' in this.g &&
      this.g.withCredentials !== this.M &&
      (this.g.withCredentials = this.M)
  try {
    yv(this),
      0 < this.B &&
        ((this.L = TS(this.g))
          ? ((this.g.timeout = this.B), (this.g.ontimeout = ye(this.ua, this)))
          : (this.A = ld(this.ua, this.B, this))),
      (this.v = !0),
      this.g.send(t),
      (this.v = !1)
  } catch (s) {
    Cy(this, s)
  }
}
function TS(t) {
  return rr && typeof t.timeout == 'number' && t.ontimeout !== void 0
}
y.ua = function () {
  typeof Xl < 'u' &&
    this.g &&
    ((this.j = 'Timed out after ' + this.B + 'ms, aborting'),
    (this.m = 8),
    de(this, 'timeout'),
    this.abort(8))
}
function Cy(t, e) {
  ;(t.h = !1),
    t.g && ((t.l = !0), t.g.abort(), (t.l = !1)),
    (t.j = e),
    (t.m = 5),
    gv(t),
    ta(t)
}
function gv(t) {
  t.F || ((t.F = !0), de(t, 'complete'), de(t, 'error'))
}
y.abort = function (t) {
  this.g &&
    this.h &&
    ((this.h = !1),
    (this.l = !0),
    this.g.abort(),
    (this.l = !1),
    (this.m = t || 7),
    de(this, 'complete'),
    de(this, 'abort'),
    ta(this))
}
y.N = function () {
  this.g &&
    (this.h && ((this.h = !1), (this.l = !0), this.g.abort(), (this.l = !1)),
    ta(this, !0)),
    Y.$.N.call(this)
}
y.La = function () {
  this.s || (this.G || this.v || this.l ? mv(this) : this.kb())
}
y.kb = function () {
  mv(this)
}
function mv(t) {
  if (t.h && typeof Xl < 'u' && (!t.C[1] || nt(t) != 4 || t.da() != 2)) {
    if (t.v && nt(t) == 4) ld(t.La, 0, t)
    else if ((de(t, 'readystatechange'), nt(t) == 4)) {
      t.h = !1
      try {
        let o = t.da()
        e: switch (o) {
          case 200:
          case 201:
          case 202:
          case 204:
          case 206:
          case 304:
          case 1223:
            var e = !0
            break e
          default:
            e = !1
        }
        var n
        if (!(n = e)) {
          var r
          if ((r = o === 0)) {
            var i = String(t.I).match(iv)[1] || null
            !i &&
              T.self &&
              T.self.location &&
              (i = T.self.location.protocol.slice(0, -1)),
              (r = !wS.test(i ? i.toLowerCase() : ''))
          }
          n = r
        }
        if (n) de(t, 'complete'), de(t, 'success')
        else {
          t.m = 6
          try {
            var s = 2 < nt(t) ? t.g.statusText : ''
          } catch {
            s = ''
          }
          ;(t.j = s + ' [' + t.da() + ']'), gv(t)
        }
      } finally {
        ta(t)
      }
    }
  }
}
function ta(t, e) {
  if (t.g) {
    yv(t)
    let n = t.g,
      r = t.C[0] ? () => {} : null
    ;(t.g = null), (t.C = null), e || de(t, 'ready')
    try {
      n.onreadystatechange = r
    } catch {}
  }
}
function yv(t) {
  t.g && t.L && (t.g.ontimeout = null),
    t.A && (T.clearTimeout(t.A), (t.A = null))
}
y.isActive = function () {
  return !!this.g
}
function nt(t) {
  return t.g ? t.g.readyState : 0
}
y.da = function () {
  try {
    return 2 < nt(this) ? this.g.status : -1
  } catch {
    return -1
  }
}
y.ja = function () {
  try {
    return this.g ? this.g.responseText : ''
  } catch {
    return ''
  }
}
y.Wa = function (t) {
  if (this.g) {
    var e = this.g.responseText
    return t && e.indexOf(t) == 0 && (e = e.substring(t.length)), ES(e)
  }
}
function by(t) {
  try {
    if (!t.g) return null
    if ('response' in t.g) return t.g.response
    switch (t.K) {
      case pv:
      case 'text':
        return t.g.responseText
      case 'arraybuffer':
        if ('mozResponseArrayBuffer' in t.g) return t.g.mozResponseArrayBuffer
    }
    return null
  } catch {
    return null
  }
}
function CS(t) {
  let e = {}
  t = ((t.g && 2 <= nt(t) && t.g.getAllResponseHeaders()) || '').split(`\r
`)
  for (let r = 0; r < t.length; r++) {
    if (yi(t[r])) continue
    var n = JA(t[r])
    let i = n[0]
    if (((n = n[1]), typeof n != 'string')) continue
    n = n.trim()
    let s = e[i] || []
    ;(e[i] = s), s.push(n)
  }
  WA(e, function (r) {
    return r.join(', ')
  })
}
y.Ia = function () {
  return this.m
}
y.Sa = function () {
  return typeof this.j == 'string' ? this.j : String(this.j)
}
function vv(t) {
  let e = ''
  return (
    nd(t, function (n, r) {
      ;(e += r),
        (e += ':'),
        (e += n),
        (e += `\r
`)
    }),
    e
  )
}
function md(t, e, n) {
  e: {
    for (r in n) {
      var r = !1
      break e
    }
    r = !0
  }
  r ||
    ((n = vv(n)),
    typeof t == 'string'
      ? n != null && encodeURIComponent(String(n))
      : W(t, e, n))
}
function hi(t, e, n) {
  return (n && n.internalChannelParams && n.internalChannelParams[t]) || e
}
function _v(t) {
  ;(this.Ga = 0),
    (this.j = []),
    (this.l = new Ko()),
    (this.pa =
      this.wa =
      this.I =
      this.Y =
      this.g =
      this.Da =
      this.F =
      this.na =
      this.o =
      this.U =
      this.s =
        null),
    (this.fb = this.W = 0),
    (this.cb = hi('failFast', !1, t)),
    (this.G = this.v = this.u = this.m = this.h = null),
    (this.aa = !0),
    (this.Fa = this.V = -1),
    (this.ba = this.A = this.C = 0),
    (this.ab = hi('baseRetryDelayMs', 5e3, t)),
    (this.hb = hi('retryDelaySeedMs', 1e4, t)),
    (this.eb = hi('forwardChannelMaxRetries', 2, t)),
    (this.xa = hi('forwardChannelRequestTimeoutMs', 2e4, t)),
    (this.va = (t && t.xmlHttpFactory) || void 0),
    (this.Ha = (t && t.useFetchStreams) || !1),
    (this.L = void 0),
    (this.J = (t && t.supportsCrossDomainXhr) || !1),
    (this.K = ''),
    (this.i = new cv(t && t.concurrentRequestLimit)),
    (this.Ja = new vS()),
    (this.P = (t && t.fastHandshake) || !1),
    (this.O = (t && t.encodeInitMessageHeaders) || !1),
    this.P && this.O && (this.O = !1),
    (this.bb = (t && t.bc) || !1),
    t && t.Ea && this.l.Ea(),
    t && t.forceLongPolling && (this.aa = !1),
    (this.ca = (!this.P && this.aa && t && t.detectBufferingProxy) || !1),
    (this.qa = void 0),
    t &&
      t.longPollingTimeout &&
      0 < t.longPollingTimeout &&
      (this.qa = t.longPollingTimeout),
    (this.oa = void 0),
    (this.S = 0),
    (this.M = !1),
    (this.ma = this.B = null)
}
y = _v.prototype
y.ra = 8
y.H = 1
function yd(t) {
  if ((Iv(t), t.H == 3)) {
    var e = t.W++,
      n = wt(t.I)
    if (
      (W(n, 'SID', t.K),
      W(n, 'RID', e),
      W(n, 'TYPE', 'terminate'),
      Pi(t, n),
      (e = new Ni(t, t.l, e)),
      (e.L = 2),
      (e.A = Xo(wt(n))),
      (n = !1),
      T.navigator && T.navigator.sendBeacon)
    )
      try {
        n = T.navigator.sendBeacon(e.A.toString(), '')
      } catch {}
    !n && T.Image && ((new Image().src = e.A), (n = !0)),
      n || ((e.g = Sv(e.l, null)), e.g.ha(e.A)),
      (e.G = Date.now()),
      Ri(e)
  }
  bv(t)
}
function na(t) {
  t.g && (_d(t), t.g.cancel(), (t.g = null))
}
function Iv(t) {
  na(t),
    t.u && (T.clearTimeout(t.u), (t.u = null)),
    Uo(t),
    t.i.cancel(),
    t.m && (typeof t.m == 'number' && T.clearTimeout(t.m), (t.m = null))
}
function ra(t) {
  if (!uv(t.i) && !t.m) {
    t.m = !0
    var e = t.Na
    _i || $y(), Ii || (_i(), (Ii = !0)), cd.add(e, t), (t.C = 0)
  }
}
function bS(t, e) {
  return lv(t.i) >= t.i.j - (t.m ? 1 : 0)
    ? !1
    : t.m
      ? ((t.j = e.F.concat(t.j)), !0)
      : t.H == 1 || t.H == 2 || t.C >= (t.cb ? 0 : t.eb)
        ? !1
        : ((t.m = Ai(ye(t.Na, t, e), Cv(t, t.C))), t.C++, !0)
}
y.Na = function (t) {
  if (this.m)
    if (((this.m = null), this.H == 1)) {
      if (!t) {
        ;(this.W = Math.floor(1e5 * Math.random())), (t = this.W++)
        let i = new Ni(this, this.l, t),
          s = this.s
        if (
          (this.U && (s ? ((s = Oy(s)), ky(s, this.U)) : (s = this.U)),
          this.o !== null || this.O || ((i.I = s), (s = null)),
          this.P)
        )
          e: {
            for (var e = 0, n = 0; n < this.j.length; n++) {
              t: {
                var r = this.j[n]
                if (
                  '__data__' in r.map &&
                  ((r = r.map.__data__), typeof r == 'string')
                ) {
                  r = r.length
                  break t
                }
                r = void 0
              }
              if (r === void 0) break
              if (((e += r), 4096 < e)) {
                e = n
                break e
              }
              if (e === 4096 || n === this.j.length - 1) {
                e = n + 1
                break e
              }
            }
            e = 1e3
          }
        else e = 1e3
        ;(e = Ev(this, i, e)),
          (n = wt(this.I)),
          W(n, 'RID', t),
          W(n, 'CVER', 22),
          this.F && W(n, 'X-HTTP-Session-Id', this.F),
          Pi(this, n),
          s &&
            (this.O
              ? (e = 'headers=' + encodeURIComponent(String(vv(s))) + '&' + e)
              : this.o && md(n, this.o, s)),
          pd(this.i, i),
          this.bb && W(n, 'TYPE', 'init'),
          this.P
            ? (W(n, '$req', e),
              W(n, 'SID', 'null'),
              (i.aa = !0),
              Kl(i, n, null))
            : Kl(i, n, e),
          (this.H = 2)
      }
    } else
      this.H == 3 &&
        (t ? Ay(this, t) : this.j.length == 0 || uv(this.i) || Ay(this))
}
function Ay(t, e) {
  var n
  e ? (n = e.m) : (n = t.W++)
  let r = wt(t.I)
  W(r, 'SID', t.K),
    W(r, 'RID', n),
    W(r, 'AID', t.V),
    Pi(t, r),
    t.o && t.s && md(r, t.o, t.s),
    (n = new Ni(t, t.l, n, t.C + 1)),
    t.o === null && (n.I = t.s),
    e && (t.j = e.F.concat(t.j)),
    (e = Ev(t, n, 1e3)),
    n.setTimeout(
      Math.round(0.5 * t.xa) + Math.round(0.5 * t.xa * Math.random())
    ),
    pd(t.i, n),
    Kl(n, r, e)
}
function Pi(t, e) {
  t.na &&
    nd(t.na, function (n, r) {
      W(e, r, n)
    }),
    t.h &&
      rv({}, function (n, r) {
        W(e, r, n)
      })
}
function Ev(t, e, n) {
  n = Math.min(t.j.length, n)
  var r = t.h ? ye(t.h.Va, t.h, t) : null
  e: {
    var i = t.j
    let s = -1
    for (;;) {
      let o = ['count=' + n]
      s == -1
        ? 0 < n
          ? ((s = i[0].g), o.push('ofs=' + s))
          : (s = 0)
        : o.push('ofs=' + s)
      let a = !0
      for (let c = 0; c < n; c++) {
        let u = i[c].g,
          l = i[c].map
        if (((u -= s), 0 > u)) (s = Math.max(0, i[c].g - 100)), (a = !1)
        else
          try {
            _S(l, o, 'req' + u + '_')
          } catch {
            r && r(l)
          }
      }
      if (a) {
        r = o.join('&')
        break e
      }
    }
  }
  return (t = t.j.splice(0, n)), (e.F = t), r
}
function wv(t) {
  if (!t.g && !t.u) {
    t.ba = 1
    var e = t.Ma
    _i || $y(), Ii || (_i(), (Ii = !0)), cd.add(e, t), (t.A = 0)
  }
}
function vd(t) {
  return t.g || t.u || 3 <= t.A
    ? !1
    : (t.ba++, (t.u = Ai(ye(t.Ma, t), Cv(t, t.A))), t.A++, !0)
}
y.Ma = function () {
  if (
    ((this.u = null),
    Dv(this),
    this.ca && !(this.M || this.g == null || 0 >= this.S))
  ) {
    var t = 2 * this.S
    this.l.info('BP detection timer enabled: ' + t),
      (this.B = Ai(ye(this.jb, this), t))
  }
}
y.jb = function () {
  this.B &&
    ((this.B = null),
    this.l.info('BP detection timeout reached.'),
    this.l.info('Buffering proxy detected and switch to long-polling!'),
    (this.G = !1),
    (this.M = !0),
    Ee(10),
    na(this),
    Dv(this))
}
function _d(t) {
  t.B != null && (T.clearTimeout(t.B), (t.B = null))
}
function Dv(t) {
  ;(t.g = new Ni(t, t.l, 'rpc', t.ba)),
    t.o === null && (t.g.I = t.s),
    (t.g.O = 0)
  var e = wt(t.wa)
  W(e, 'RID', 'rpc'),
    W(e, 'SID', t.K),
    W(e, 'AID', t.V),
    W(e, 'CI', t.G ? '0' : '1'),
    !t.G && t.qa && W(e, 'TO', t.qa),
    W(e, 'TYPE', 'xmlhttp'),
    Pi(t, e),
    t.o && t.s && md(e, t.o, t.s),
    t.L && t.g.setTimeout(t.L)
  var n = t.g
  ;(t = t.pa), (n.L = 1), (n.A = Xo(wt(e))), (n.u = null), (n.S = !0), Xy(n, t)
}
y.ib = function () {
  this.v != null && ((this.v = null), na(this), vd(this), Ee(19))
}
function Uo(t) {
  t.v != null && (T.clearTimeout(t.v), (t.v = null))
}
function Tv(t, e) {
  var n = null
  if (t.g == e) {
    Uo(t), _d(t), (t.g = null)
    var r = 2
  } else if (Yl(t.i, e)) (n = e.F), dv(t.i, e), (r = 1)
  else return
  if (t.H != 0) {
    if (e.i)
      if (r == 1) {
        ;(n = e.u ? e.u.length : 0), (e = Date.now() - e.G)
        var i = t.C
        ;(r = Qo()), de(r, new Ky(r, n)), ra(t)
      } else wv(t)
    else if (
      ((i = e.s),
      i == 3 ||
        (i == 0 && 0 < e.ca) ||
        !((r == 1 && bS(t, e)) || (r == 2 && vd(t))))
    )
      switch ((n && 0 < n.length && ((e = t.i), (e.i = e.i.concat(n))), i)) {
        case 1:
          pn(t, 5)
          break
        case 4:
          pn(t, 10)
          break
        case 3:
          pn(t, 6)
          break
        default:
          pn(t, 2)
      }
  }
}
function Cv(t, e) {
  let n = t.ab + Math.floor(Math.random() * t.hb)
  return t.isActive() || (n *= 2), n * e
}
function pn(t, e) {
  if ((t.l.info('Error code ' + e), e == 2)) {
    var n = null
    t.h && (n = null)
    var r = ye(t.pb, t)
    n ||
      ((n = new gn('//www.google.com/images/cleardot.gif')),
      (T.location && T.location.protocol == 'http') || Lo(n, 'https'),
      Xo(n)),
      IS(n.toString(), r)
  } else Ee(2)
  ;(t.H = 0), t.h && t.h.za(e), bv(t), Iv(t)
}
y.pb = function (t) {
  t
    ? (this.l.info('Successfully pinged google.com'), Ee(2))
    : (this.l.info('Failed to ping google.com'), Ee(1))
}
function bv(t) {
  if (((t.H = 0), (t.ma = []), t.h)) {
    let e = hv(t.i)
    ;(e.length != 0 || t.j.length != 0) &&
      (vy(t.ma, e),
      vy(t.ma, t.j),
      (t.i.i.length = 0),
      ed(t.j),
      (t.j.length = 0)),
      t.h.ya()
  }
}
function Av(t, e, n) {
  var r = n instanceof gn ? wt(n) : new gn(n)
  if (r.g != '') e && (r.g = e + '.' + r.g), Vo(r, r.m)
  else {
    var i = T.location
    ;(r = i.protocol),
      (e = e ? e + '.' + i.hostname : i.hostname),
      (i = +i.port)
    var s = new gn(null)
    r && Lo(s, r), e && (s.g = e), i && Vo(s, i), n && (s.l = n), (r = s)
  }
  return (
    (n = t.F), (e = t.Da), n && e && W(r, n, e), W(r, 'VER', t.ra), Pi(t, r), r
  )
}
function Sv(t, e, n) {
  if (e && !t.J)
    throw Error("Can't create secondary domain capable XhrIo object.")
  return (
    (e = t.Ha && !t.va ? new Y(new xi({ ob: n })) : new Y(t.va)), e.Oa(t.J), e
  )
}
y.isActive = function () {
  return !!this.h && this.h.isActive(this)
}
function Nv() {}
y = Nv.prototype
y.Ba = function () {}
y.Aa = function () {}
y.za = function () {}
y.ya = function () {}
y.isActive = function () {
  return !0
}
y.Va = function () {}
function jo() {
  if (rr && !(10 <= Number(HA)))
    throw Error('Environmental error: no available transport.')
}
jo.prototype.g = function (t, e) {
  return new Ae(t, e)
}
function Ae(t, e) {
  ae.call(this),
    (this.g = new _v(e)),
    (this.l = t),
    (this.h = (e && e.messageUrlParams) || null),
    (t = (e && e.messageHeaders) || null),
    e &&
      e.clientProtocolHeaderRequired &&
      (t
        ? (t['X-Client-Protocol'] = 'webchannel')
        : (t = { 'X-Client-Protocol': 'webchannel' })),
    (this.g.s = t),
    (t = (e && e.initMessageHeaders) || null),
    e &&
      e.messageContentType &&
      (t
        ? (t['X-WebChannel-Content-Type'] = e.messageContentType)
        : (t = { 'X-WebChannel-Content-Type': e.messageContentType })),
    e &&
      e.Ca &&
      (t
        ? (t['X-WebChannel-Client-Profile'] = e.Ca)
        : (t = { 'X-WebChannel-Client-Profile': e.Ca })),
    (this.g.U = t),
    (t = e && e.cc) && !yi(t) && (this.g.o = t),
    (this.A = (e && e.supportsCrossDomainXhr) || !1),
    (this.v = (e && e.sendRawJson) || !1),
    (e = e && e.httpSessionIdParam) &&
      !yi(e) &&
      ((this.g.F = e),
      (t = this.h),
      t !== null && e in t && ((t = this.h), e in t && delete t[e])),
    (this.j = new sr(this))
}
ce(Ae, ae)
Ae.prototype.m = function () {
  ;(this.g.h = this.j), this.A && (this.g.J = !0)
  var t = this.g,
    e = this.l,
    n = this.h || void 0
  Ee(0),
    (t.Y = e),
    (t.na = n || {}),
    (t.G = t.aa),
    (t.I = Av(t, null, t.Y)),
    ra(t)
}
Ae.prototype.close = function () {
  yd(this.g)
}
Ae.prototype.u = function (t) {
  var e = this.g
  if (typeof t == 'string') {
    var n = {}
    ;(n.__data__ = t), (t = n)
  } else this.v && ((n = {}), (n.__data__ = ad(t)), (t = n))
  e.j.push(new gS(e.fb++, t)), e.H == 3 && ra(e)
}
Ae.prototype.N = function () {
  ;(this.g.h = null),
    delete this.j,
    yd(this.g),
    delete this.g,
    Ae.$.N.call(this)
}
function Rv(t) {
  hd.call(this),
    t.__headers__ &&
      ((this.headers = t.__headers__),
      (this.statusCode = t.__status__),
      delete t.__headers__,
      delete t.__status__)
  var e = t.__sm__
  if (e) {
    e: {
      for (let n in e) {
        t = n
        break e
      }
      t = void 0
    }
    ;(this.i = t) && ((t = this.i), (e = e !== null && t in e ? e[t] : void 0)),
      (this.data = e)
  } else this.data = t
}
ce(Rv, hd)
function xv() {
  fd.call(this), (this.status = 1)
}
ce(xv, fd)
function sr(t) {
  this.g = t
}
ce(sr, Nv)
sr.prototype.Ba = function () {
  de(this.g, 'a')
}
sr.prototype.Aa = function (t) {
  de(this.g, new Rv(t))
}
sr.prototype.za = function (t) {
  de(this.g, new xv())
}
sr.prototype.ya = function () {
  de(this.g, 'b')
}
function AS() {
  this.blockSize = -1
}
function He() {
  ;(this.blockSize = -1),
    (this.blockSize = 64),
    (this.g = Array(4)),
    (this.m = Array(this.blockSize)),
    (this.i = this.h = 0),
    this.reset()
}
ce(He, AS)
He.prototype.reset = function () {
  ;(this.g[0] = 1732584193),
    (this.g[1] = 4023233417),
    (this.g[2] = 2562383102),
    (this.g[3] = 271733878),
    (this.i = this.h = 0)
}
function Fl(t, e, n) {
  n || (n = 0)
  var r = Array(16)
  if (typeof e == 'string')
    for (var i = 0; 16 > i; ++i)
      r[i] =
        e.charCodeAt(n++) |
        (e.charCodeAt(n++) << 8) |
        (e.charCodeAt(n++) << 16) |
        (e.charCodeAt(n++) << 24)
  else
    for (i = 0; 16 > i; ++i)
      r[i] = e[n++] | (e[n++] << 8) | (e[n++] << 16) | (e[n++] << 24)
  ;(e = t.g[0]), (n = t.g[1]), (i = t.g[2])
  var s = t.g[3],
    o = (e + (s ^ (n & (i ^ s))) + r[0] + 3614090360) & 4294967295
  ;(e = n + (((o << 7) & 4294967295) | (o >>> 25))),
    (o = (s + (i ^ (e & (n ^ i))) + r[1] + 3905402710) & 4294967295),
    (s = e + (((o << 12) & 4294967295) | (o >>> 20))),
    (o = (i + (n ^ (s & (e ^ n))) + r[2] + 606105819) & 4294967295),
    (i = s + (((o << 17) & 4294967295) | (o >>> 15))),
    (o = (n + (e ^ (i & (s ^ e))) + r[3] + 3250441966) & 4294967295),
    (n = i + (((o << 22) & 4294967295) | (o >>> 10))),
    (o = (e + (s ^ (n & (i ^ s))) + r[4] + 4118548399) & 4294967295),
    (e = n + (((o << 7) & 4294967295) | (o >>> 25))),
    (o = (s + (i ^ (e & (n ^ i))) + r[5] + 1200080426) & 4294967295),
    (s = e + (((o << 12) & 4294967295) | (o >>> 20))),
    (o = (i + (n ^ (s & (e ^ n))) + r[6] + 2821735955) & 4294967295),
    (i = s + (((o << 17) & 4294967295) | (o >>> 15))),
    (o = (n + (e ^ (i & (s ^ e))) + r[7] + 4249261313) & 4294967295),
    (n = i + (((o << 22) & 4294967295) | (o >>> 10))),
    (o = (e + (s ^ (n & (i ^ s))) + r[8] + 1770035416) & 4294967295),
    (e = n + (((o << 7) & 4294967295) | (o >>> 25))),
    (o = (s + (i ^ (e & (n ^ i))) + r[9] + 2336552879) & 4294967295),
    (s = e + (((o << 12) & 4294967295) | (o >>> 20))),
    (o = (i + (n ^ (s & (e ^ n))) + r[10] + 4294925233) & 4294967295),
    (i = s + (((o << 17) & 4294967295) | (o >>> 15))),
    (o = (n + (e ^ (i & (s ^ e))) + r[11] + 2304563134) & 4294967295),
    (n = i + (((o << 22) & 4294967295) | (o >>> 10))),
    (o = (e + (s ^ (n & (i ^ s))) + r[12] + 1804603682) & 4294967295),
    (e = n + (((o << 7) & 4294967295) | (o >>> 25))),
    (o = (s + (i ^ (e & (n ^ i))) + r[13] + 4254626195) & 4294967295),
    (s = e + (((o << 12) & 4294967295) | (o >>> 20))),
    (o = (i + (n ^ (s & (e ^ n))) + r[14] + 2792965006) & 4294967295),
    (i = s + (((o << 17) & 4294967295) | (o >>> 15))),
    (o = (n + (e ^ (i & (s ^ e))) + r[15] + 1236535329) & 4294967295),
    (n = i + (((o << 22) & 4294967295) | (o >>> 10))),
    (o = (e + (i ^ (s & (n ^ i))) + r[1] + 4129170786) & 4294967295),
    (e = n + (((o << 5) & 4294967295) | (o >>> 27))),
    (o = (s + (n ^ (i & (e ^ n))) + r[6] + 3225465664) & 4294967295),
    (s = e + (((o << 9) & 4294967295) | (o >>> 23))),
    (o = (i + (e ^ (n & (s ^ e))) + r[11] + 643717713) & 4294967295),
    (i = s + (((o << 14) & 4294967295) | (o >>> 18))),
    (o = (n + (s ^ (e & (i ^ s))) + r[0] + 3921069994) & 4294967295),
    (n = i + (((o << 20) & 4294967295) | (o >>> 12))),
    (o = (e + (i ^ (s & (n ^ i))) + r[5] + 3593408605) & 4294967295),
    (e = n + (((o << 5) & 4294967295) | (o >>> 27))),
    (o = (s + (n ^ (i & (e ^ n))) + r[10] + 38016083) & 4294967295),
    (s = e + (((o << 9) & 4294967295) | (o >>> 23))),
    (o = (i + (e ^ (n & (s ^ e))) + r[15] + 3634488961) & 4294967295),
    (i = s + (((o << 14) & 4294967295) | (o >>> 18))),
    (o = (n + (s ^ (e & (i ^ s))) + r[4] + 3889429448) & 4294967295),
    (n = i + (((o << 20) & 4294967295) | (o >>> 12))),
    (o = (e + (i ^ (s & (n ^ i))) + r[9] + 568446438) & 4294967295),
    (e = n + (((o << 5) & 4294967295) | (o >>> 27))),
    (o = (s + (n ^ (i & (e ^ n))) + r[14] + 3275163606) & 4294967295),
    (s = e + (((o << 9) & 4294967295) | (o >>> 23))),
    (o = (i + (e ^ (n & (s ^ e))) + r[3] + 4107603335) & 4294967295),
    (i = s + (((o << 14) & 4294967295) | (o >>> 18))),
    (o = (n + (s ^ (e & (i ^ s))) + r[8] + 1163531501) & 4294967295),
    (n = i + (((o << 20) & 4294967295) | (o >>> 12))),
    (o = (e + (i ^ (s & (n ^ i))) + r[13] + 2850285829) & 4294967295),
    (e = n + (((o << 5) & 4294967295) | (o >>> 27))),
    (o = (s + (n ^ (i & (e ^ n))) + r[2] + 4243563512) & 4294967295),
    (s = e + (((o << 9) & 4294967295) | (o >>> 23))),
    (o = (i + (e ^ (n & (s ^ e))) + r[7] + 1735328473) & 4294967295),
    (i = s + (((o << 14) & 4294967295) | (o >>> 18))),
    (o = (n + (s ^ (e & (i ^ s))) + r[12] + 2368359562) & 4294967295),
    (n = i + (((o << 20) & 4294967295) | (o >>> 12))),
    (o = (e + (n ^ i ^ s) + r[5] + 4294588738) & 4294967295),
    (e = n + (((o << 4) & 4294967295) | (o >>> 28))),
    (o = (s + (e ^ n ^ i) + r[8] + 2272392833) & 4294967295),
    (s = e + (((o << 11) & 4294967295) | (o >>> 21))),
    (o = (i + (s ^ e ^ n) + r[11] + 1839030562) & 4294967295),
    (i = s + (((o << 16) & 4294967295) | (o >>> 16))),
    (o = (n + (i ^ s ^ e) + r[14] + 4259657740) & 4294967295),
    (n = i + (((o << 23) & 4294967295) | (o >>> 9))),
    (o = (e + (n ^ i ^ s) + r[1] + 2763975236) & 4294967295),
    (e = n + (((o << 4) & 4294967295) | (o >>> 28))),
    (o = (s + (e ^ n ^ i) + r[4] + 1272893353) & 4294967295),
    (s = e + (((o << 11) & 4294967295) | (o >>> 21))),
    (o = (i + (s ^ e ^ n) + r[7] + 4139469664) & 4294967295),
    (i = s + (((o << 16) & 4294967295) | (o >>> 16))),
    (o = (n + (i ^ s ^ e) + r[10] + 3200236656) & 4294967295),
    (n = i + (((o << 23) & 4294967295) | (o >>> 9))),
    (o = (e + (n ^ i ^ s) + r[13] + 681279174) & 4294967295),
    (e = n + (((o << 4) & 4294967295) | (o >>> 28))),
    (o = (s + (e ^ n ^ i) + r[0] + 3936430074) & 4294967295),
    (s = e + (((o << 11) & 4294967295) | (o >>> 21))),
    (o = (i + (s ^ e ^ n) + r[3] + 3572445317) & 4294967295),
    (i = s + (((o << 16) & 4294967295) | (o >>> 16))),
    (o = (n + (i ^ s ^ e) + r[6] + 76029189) & 4294967295),
    (n = i + (((o << 23) & 4294967295) | (o >>> 9))),
    (o = (e + (n ^ i ^ s) + r[9] + 3654602809) & 4294967295),
    (e = n + (((o << 4) & 4294967295) | (o >>> 28))),
    (o = (s + (e ^ n ^ i) + r[12] + 3873151461) & 4294967295),
    (s = e + (((o << 11) & 4294967295) | (o >>> 21))),
    (o = (i + (s ^ e ^ n) + r[15] + 530742520) & 4294967295),
    (i = s + (((o << 16) & 4294967295) | (o >>> 16))),
    (o = (n + (i ^ s ^ e) + r[2] + 3299628645) & 4294967295),
    (n = i + (((o << 23) & 4294967295) | (o >>> 9))),
    (o = (e + (i ^ (n | ~s)) + r[0] + 4096336452) & 4294967295),
    (e = n + (((o << 6) & 4294967295) | (o >>> 26))),
    (o = (s + (n ^ (e | ~i)) + r[7] + 1126891415) & 4294967295),
    (s = e + (((o << 10) & 4294967295) | (o >>> 22))),
    (o = (i + (e ^ (s | ~n)) + r[14] + 2878612391) & 4294967295),
    (i = s + (((o << 15) & 4294967295) | (o >>> 17))),
    (o = (n + (s ^ (i | ~e)) + r[5] + 4237533241) & 4294967295),
    (n = i + (((o << 21) & 4294967295) | (o >>> 11))),
    (o = (e + (i ^ (n | ~s)) + r[12] + 1700485571) & 4294967295),
    (e = n + (((o << 6) & 4294967295) | (o >>> 26))),
    (o = (s + (n ^ (e | ~i)) + r[3] + 2399980690) & 4294967295),
    (s = e + (((o << 10) & 4294967295) | (o >>> 22))),
    (o = (i + (e ^ (s | ~n)) + r[10] + 4293915773) & 4294967295),
    (i = s + (((o << 15) & 4294967295) | (o >>> 17))),
    (o = (n + (s ^ (i | ~e)) + r[1] + 2240044497) & 4294967295),
    (n = i + (((o << 21) & 4294967295) | (o >>> 11))),
    (o = (e + (i ^ (n | ~s)) + r[8] + 1873313359) & 4294967295),
    (e = n + (((o << 6) & 4294967295) | (o >>> 26))),
    (o = (s + (n ^ (e | ~i)) + r[15] + 4264355552) & 4294967295),
    (s = e + (((o << 10) & 4294967295) | (o >>> 22))),
    (o = (i + (e ^ (s | ~n)) + r[6] + 2734768916) & 4294967295),
    (i = s + (((o << 15) & 4294967295) | (o >>> 17))),
    (o = (n + (s ^ (i | ~e)) + r[13] + 1309151649) & 4294967295),
    (n = i + (((o << 21) & 4294967295) | (o >>> 11))),
    (o = (e + (i ^ (n | ~s)) + r[4] + 4149444226) & 4294967295),
    (e = n + (((o << 6) & 4294967295) | (o >>> 26))),
    (o = (s + (n ^ (e | ~i)) + r[11] + 3174756917) & 4294967295),
    (s = e + (((o << 10) & 4294967295) | (o >>> 22))),
    (o = (i + (e ^ (s | ~n)) + r[2] + 718787259) & 4294967295),
    (i = s + (((o << 15) & 4294967295) | (o >>> 17))),
    (o = (n + (s ^ (i | ~e)) + r[9] + 3951481745) & 4294967295),
    (t.g[0] = (t.g[0] + e) & 4294967295),
    (t.g[1] =
      (t.g[1] + (i + (((o << 21) & 4294967295) | (o >>> 11)))) & 4294967295),
    (t.g[2] = (t.g[2] + i) & 4294967295),
    (t.g[3] = (t.g[3] + s) & 4294967295)
}
He.prototype.j = function (t, e) {
  e === void 0 && (e = t.length)
  for (var n = e - this.blockSize, r = this.m, i = this.h, s = 0; s < e; ) {
    if (i == 0) for (; s <= n; ) Fl(this, t, s), (s += this.blockSize)
    if (typeof t == 'string') {
      for (; s < e; )
        if (((r[i++] = t.charCodeAt(s++)), i == this.blockSize)) {
          Fl(this, r), (i = 0)
          break
        }
    } else
      for (; s < e; )
        if (((r[i++] = t[s++]), i == this.blockSize)) {
          Fl(this, r), (i = 0)
          break
        }
  }
  ;(this.h = i), (this.i += e)
}
He.prototype.l = function () {
  var t = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h)
  t[0] = 128
  for (var e = 1; e < t.length - 8; ++e) t[e] = 0
  var n = 8 * this.i
  for (e = t.length - 8; e < t.length; ++e) (t[e] = n & 255), (n /= 256)
  for (this.j(t), t = Array(16), e = n = 0; 4 > e; ++e)
    for (var r = 0; 32 > r; r += 8) t[n++] = (this.g[e] >>> r) & 255
  return t
}
function j(t, e) {
  this.h = e
  for (var n = [], r = !0, i = t.length - 1; 0 <= i; i--) {
    var s = t[i] | 0
    ;(r && s == e) || ((n[i] = s), (r = !1))
  }
  this.g = n
}
var SS = {}
function Id(t) {
  return -128 <= t && 128 > t
    ? jA(t, function (e) {
        return new j([e | 0], 0 > e ? -1 : 0)
      })
    : new j([t | 0], 0 > t ? -1 : 0)
}
function rt(t) {
  if (isNaN(t) || !isFinite(t)) return nr
  if (0 > t) return le(rt(-t))
  for (var e = [], n = 1, r = 0; t >= n; r++) (e[r] = (t / n) | 0), (n *= Jl)
  return new j(e, 0)
}
function Mv(t, e) {
  if (t.length == 0) throw Error('number format error: empty string')
  if (((e = e || 10), 2 > e || 36 < e)) throw Error('radix out of range: ' + e)
  if (t.charAt(0) == '-') return le(Mv(t.substring(1), e))
  if (0 <= t.indexOf('-'))
    throw Error('number format error: interior "-" character')
  for (var n = rt(Math.pow(e, 8)), r = nr, i = 0; i < t.length; i += 8) {
    var s = Math.min(8, t.length - i),
      o = parseInt(t.substring(i, i + s), e)
    8 > s
      ? ((s = rt(Math.pow(e, s))), (r = r.R(s).add(rt(o))))
      : ((r = r.R(n)), (r = r.add(rt(o))))
  }
  return r
}
var Jl = 4294967296,
  nr = Id(0),
  Zl = Id(1),
  Sy = Id(16777216)
y = j.prototype
y.ea = function () {
  if (xe(this)) return -le(this).ea()
  for (var t = 0, e = 1, n = 0; n < this.g.length; n++) {
    var r = this.D(n)
    ;(t += (0 <= r ? r : Jl + r) * e), (e *= Jl)
  }
  return t
}
y.toString = function (t) {
  if (((t = t || 10), 2 > t || 36 < t)) throw Error('radix out of range: ' + t)
  if (Et(this)) return '0'
  if (xe(this)) return '-' + le(this).toString(t)
  for (var e = rt(Math.pow(t, 6)), n = this, r = ''; ; ) {
    var i = $o(n, e).g
    n = Bo(n, i.R(e))
    var s = ((0 < n.g.length ? n.g[0] : n.h) >>> 0).toString(t)
    if (((n = i), Et(n))) return s + r
    for (; 6 > s.length; ) s = '0' + s
    r = s + r
  }
}
y.D = function (t) {
  return 0 > t ? 0 : t < this.g.length ? this.g[t] : this.h
}
function Et(t) {
  if (t.h != 0) return !1
  for (var e = 0; e < t.g.length; e++) if (t.g[e] != 0) return !1
  return !0
}
function xe(t) {
  return t.h == -1
}
y.X = function (t) {
  return (t = Bo(this, t)), xe(t) ? -1 : Et(t) ? 0 : 1
}
function le(t) {
  for (var e = t.g.length, n = [], r = 0; r < e; r++) n[r] = ~t.g[r]
  return new j(n, ~t.h).add(Zl)
}
y.abs = function () {
  return xe(this) ? le(this) : this
}
y.add = function (t) {
  for (
    var e = Math.max(this.g.length, t.g.length), n = [], r = 0, i = 0;
    i <= e;
    i++
  ) {
    var s = r + (this.D(i) & 65535) + (t.D(i) & 65535),
      o = (s >>> 16) + (this.D(i) >>> 16) + (t.D(i) >>> 16)
    ;(r = o >>> 16), (s &= 65535), (o &= 65535), (n[i] = (o << 16) | s)
  }
  return new j(n, n[n.length - 1] & -2147483648 ? -1 : 0)
}
function Bo(t, e) {
  return t.add(le(e))
}
y.R = function (t) {
  if (Et(this) || Et(t)) return nr
  if (xe(this)) return xe(t) ? le(this).R(le(t)) : le(le(this).R(t))
  if (xe(t)) return le(this.R(le(t)))
  if (0 > this.X(Sy) && 0 > t.X(Sy)) return rt(this.ea() * t.ea())
  for (var e = this.g.length + t.g.length, n = [], r = 0; r < 2 * e; r++)
    n[r] = 0
  for (r = 0; r < this.g.length; r++)
    for (var i = 0; i < t.g.length; i++) {
      var s = this.D(r) >>> 16,
        o = this.D(r) & 65535,
        a = t.D(i) >>> 16,
        c = t.D(i) & 65535
      ;(n[2 * r + 2 * i] += o * c),
        Fo(n, 2 * r + 2 * i),
        (n[2 * r + 2 * i + 1] += s * c),
        Fo(n, 2 * r + 2 * i + 1),
        (n[2 * r + 2 * i + 1] += o * a),
        Fo(n, 2 * r + 2 * i + 1),
        (n[2 * r + 2 * i + 2] += s * a),
        Fo(n, 2 * r + 2 * i + 2)
    }
  for (r = 0; r < e; r++) n[r] = (n[2 * r + 1] << 16) | n[2 * r]
  for (r = e; r < 2 * e; r++) n[r] = 0
  return new j(n, 0)
}
function Fo(t, e) {
  for (; (t[e] & 65535) != t[e]; )
    (t[e + 1] += t[e] >>> 16), (t[e] &= 65535), e++
}
function fi(t, e) {
  ;(this.g = t), (this.h = e)
}
function $o(t, e) {
  if (Et(e)) throw Error('division by zero')
  if (Et(t)) return new fi(nr, nr)
  if (xe(t)) return (e = $o(le(t), e)), new fi(le(e.g), le(e.h))
  if (xe(e)) return (e = $o(t, le(e))), new fi(le(e.g), e.h)
  if (30 < t.g.length) {
    if (xe(t) || xe(e))
      throw Error('slowDivide_ only works with positive integers.')
    for (var n = Zl, r = e; 0 >= r.X(t); ) (n = Ny(n)), (r = Ny(r))
    var i = er(n, 1),
      s = er(r, 1)
    for (r = er(r, 2), n = er(n, 2); !Et(r); ) {
      var o = s.add(r)
      0 >= o.X(t) && ((i = i.add(n)), (s = o)), (r = er(r, 1)), (n = er(n, 1))
    }
    return (e = Bo(t, i.R(e))), new fi(i, e)
  }
  for (i = nr; 0 <= t.X(e); ) {
    for (
      n = Math.max(1, Math.floor(t.ea() / e.ea())),
        r = Math.ceil(Math.log(n) / Math.LN2),
        r = 48 >= r ? 1 : Math.pow(2, r - 48),
        s = rt(n),
        o = s.R(e);
      xe(o) || 0 < o.X(t);

    )
      (n -= r), (s = rt(n)), (o = s.R(e))
    Et(s) && (s = Zl), (i = i.add(s)), (t = Bo(t, o))
  }
  return new fi(i, t)
}
y.gb = function (t) {
  return $o(this, t).h
}
y.and = function (t) {
  for (var e = Math.max(this.g.length, t.g.length), n = [], r = 0; r < e; r++)
    n[r] = this.D(r) & t.D(r)
  return new j(n, this.h & t.h)
}
y.or = function (t) {
  for (var e = Math.max(this.g.length, t.g.length), n = [], r = 0; r < e; r++)
    n[r] = this.D(r) | t.D(r)
  return new j(n, this.h | t.h)
}
y.xor = function (t) {
  for (var e = Math.max(this.g.length, t.g.length), n = [], r = 0; r < e; r++)
    n[r] = this.D(r) ^ t.D(r)
  return new j(n, this.h ^ t.h)
}
function Ny(t) {
  for (var e = t.g.length + 1, n = [], r = 0; r < e; r++)
    n[r] = (t.D(r) << 1) | (t.D(r - 1) >>> 31)
  return new j(n, t.h)
}
function er(t, e) {
  var n = e >> 5
  e %= 32
  for (var r = t.g.length - n, i = [], s = 0; s < r; s++)
    i[s] =
      0 < e ? (t.D(s + n) >>> e) | (t.D(s + n + 1) << (32 - e)) : t.D(s + n)
  return new j(i, t.h)
}
jo.prototype.createWebChannel = jo.prototype.g
Ae.prototype.send = Ae.prototype.u
Ae.prototype.open = Ae.prototype.m
Ae.prototype.close = Ae.prototype.close
Yo.NO_ERROR = 0
Yo.TIMEOUT = 8
Yo.HTTP_ERROR = 6
Qy.COMPLETE = 'complete'
Yy.EventType = Si
Si.OPEN = 'a'
Si.CLOSE = 'b'
Si.ERROR = 'c'
Si.MESSAGE = 'd'
ae.prototype.listen = ae.prototype.O
Y.prototype.listenOnce = Y.prototype.P
Y.prototype.getLastError = Y.prototype.Sa
Y.prototype.getLastErrorCode = Y.prototype.Ia
Y.prototype.getStatus = Y.prototype.da
Y.prototype.getResponseJson = Y.prototype.Wa
Y.prototype.getResponseText = Y.prototype.ja
Y.prototype.send = Y.prototype.ha
Y.prototype.setWithCredentials = Y.prototype.Oa
He.prototype.digest = He.prototype.l
He.prototype.reset = He.prototype.reset
He.prototype.update = He.prototype.j
j.prototype.add = j.prototype.add
j.prototype.multiply = j.prototype.R
j.prototype.modulo = j.prototype.gb
j.prototype.compare = j.prototype.X
j.prototype.toNumber = j.prototype.ea
j.prototype.toString = j.prototype.toString
j.prototype.getBits = j.prototype.D
j.fromNumber = rt
j.fromString = Mv
var Pv = (qe.createWebChannelTransport = function () {
    return new jo()
  }),
  Ov = (qe.getStatEventTarget = function () {
    return Qo()
  }),
  ia = (qe.ErrorCode = Yo),
  kv = (qe.EventType = Qy),
  Fv = (qe.Event = mn),
  Ed = (qe.Stat = {
    xb: 0,
    Ab: 1,
    Bb: 2,
    Ub: 3,
    Zb: 4,
    Wb: 5,
    Xb: 6,
    Vb: 7,
    Tb: 8,
    Yb: 9,
    PROXY: 10,
    NOPROXY: 11,
    Rb: 12,
    Nb: 13,
    Ob: 14,
    Mb: 15,
    Pb: 16,
    Qb: 17,
    tb: 18,
    sb: 19,
    ub: 20,
  }),
  Rk = (qe.FetchXmlHttpFactory = xi),
  Oi = (qe.WebChannel = Yy),
  Lv = (qe.XhrIo = Y),
  Vv = (qe.Md5 = He),
  yn = (qe.Integer = j)
var Uv = '@firebase/firestore'
var ue = class {
  constructor(e) {
    this.uid = e
  }
  isAuthenticated() {
    return this.uid != null
  }
  toKey() {
    return this.isAuthenticated() ? 'uid:' + this.uid : 'anonymous-user'
  }
  isEqual(e) {
    return e.uid === this.uid
  }
}
;(ue.UNAUTHENTICATED = new ue(null)),
  (ue.GOOGLE_CREDENTIALS = new ue('google-credentials-uid')),
  (ue.FIRST_PARTY = new ue('first-party-uid')),
  (ue.MOCK_USER = new ue('mock-user'))
var br = '10.7.2'
var Tn = new kt('@firebase/firestore')
function ki() {
  return Tn.logLevel
}
function v(t, ...e) {
  if (Tn.logLevel <= N.DEBUG) {
    let n = e.map(nf)
    Tn.debug(`Firestore (${br}): ${t}`, ...n)
  }
}
function at(t, ...e) {
  if (Tn.logLevel <= N.ERROR) {
    let n = e.map(nf)
    Tn.error(`Firestore (${br}): ${t}`, ...n)
  }
}
function pr(t, ...e) {
  if (Tn.logLevel <= N.WARN) {
    let n = e.map(nf)
    Tn.warn(`Firestore (${br}): ${t}`, ...n)
  }
}
function nf(t) {
  if (typeof t == 'string') return t
  try {
    return (function (n) {
      return JSON.stringify(n)
    })(t)
  } catch {
    return t
  }
}
function b(t = 'Unexpected state') {
  let e = `FIRESTORE (${br}) INTERNAL ASSERTION FAILED: ` + t
  throw (at(e), new Error(e))
}
function ie(t, e) {
  t || b()
}
function F(t, e) {
  return t
}
var m = {
    OK: 'ok',
    CANCELLED: 'cancelled',
    UNKNOWN: 'unknown',
    INVALID_ARGUMENT: 'invalid-argument',
    DEADLINE_EXCEEDED: 'deadline-exceeded',
    NOT_FOUND: 'not-found',
    ALREADY_EXISTS: 'already-exists',
    PERMISSION_DENIED: 'permission-denied',
    UNAUTHENTICATED: 'unauthenticated',
    RESOURCE_EXHAUSTED: 'resource-exhausted',
    FAILED_PRECONDITION: 'failed-precondition',
    ABORTED: 'aborted',
    OUT_OF_RANGE: 'out-of-range',
    UNIMPLEMENTED: 'unimplemented',
    INTERNAL: 'internal',
    UNAVAILABLE: 'unavailable',
    DATA_LOSS: 'data-loss',
  },
  E = class extends Ne {
    constructor(e, n) {
      super(e, n),
        (this.code = e),
        (this.message = n),
        (this.toString = () =>
          `${this.name}: [code=${this.code}]: ${this.message}`)
    }
  }
var Tt = class {
  constructor() {
    this.promise = new Promise((e, n) => {
      ;(this.resolve = e), (this.reject = n)
    })
  }
}
var ua = class {
    constructor(e, n) {
      ;(this.user = n),
        (this.type = 'OAuth'),
        (this.headers = new Map()),
        this.headers.set('Authorization', `Bearer ${e}`)
    }
  },
  Ad = class {
    getToken() {
      return Promise.resolve(null)
    }
    invalidateToken() {}
    start(e, n) {
      e.enqueueRetryable(() => n(ue.UNAUTHENTICATED))
    }
    shutdown() {}
  },
  Sd = class {
    constructor(e) {
      ;(this.token = e), (this.changeListener = null)
    }
    getToken() {
      return Promise.resolve(this.token)
    }
    invalidateToken() {}
    start(e, n) {
      ;(this.changeListener = n), e.enqueueRetryable(() => n(this.token.user))
    }
    shutdown() {
      this.changeListener = null
    }
  },
  Nd = class {
    constructor(e) {
      ;(this.t = e),
        (this.currentUser = ue.UNAUTHENTICATED),
        (this.i = 0),
        (this.forceRefresh = !1),
        (this.auth = null)
    }
    start(e, n) {
      let r = this.i,
        i = (c) => (this.i !== r ? ((r = this.i), n(c)) : Promise.resolve()),
        s = new Tt()
      this.o = () => {
        this.i++,
          (this.currentUser = this.u()),
          s.resolve(),
          (s = new Tt()),
          e.enqueueRetryable(() => i(this.currentUser))
      }
      let o = () => {
          let c = s
          e.enqueueRetryable(() =>
            p(this, null, function* () {
              yield c.promise, yield i(this.currentUser)
            })
          )
        },
        a = (c) => {
          v('FirebaseAuthCredentialsProvider', 'Auth detected'),
            (this.auth = c),
            this.auth.addAuthTokenListener(this.o),
            o()
        }
      this.t.onInit((c) => a(c)),
        setTimeout(() => {
          if (!this.auth) {
            let c = this.t.getImmediate({ optional: !0 })
            c
              ? a(c)
              : (v('FirebaseAuthCredentialsProvider', 'Auth not yet detected'),
                s.resolve(),
                (s = new Tt()))
          }
        }, 0),
        o()
    }
    getToken() {
      let e = this.i,
        n = this.forceRefresh
      return (
        (this.forceRefresh = !1),
        this.auth
          ? this.auth
              .getToken(n)
              .then((r) =>
                this.i !== e
                  ? (v(
                      'FirebaseAuthCredentialsProvider',
                      'getToken aborted due to token change.'
                    ),
                    this.getToken())
                  : r
                    ? (ie(typeof r.accessToken == 'string'),
                      new ua(r.accessToken, this.currentUser))
                    : null
              )
          : Promise.resolve(null)
      )
    }
    invalidateToken() {
      this.forceRefresh = !0
    }
    shutdown() {
      this.auth && this.auth.removeAuthTokenListener(this.o)
    }
    u() {
      let e = this.auth && this.auth.getUid()
      return ie(e === null || typeof e == 'string'), new ue(e)
    }
  },
  Rd = class {
    constructor(e, n, r) {
      ;(this.l = e),
        (this.h = n),
        (this.P = r),
        (this.type = 'FirstParty'),
        (this.user = ue.FIRST_PARTY),
        (this.I = new Map())
    }
    T() {
      return this.P ? this.P() : null
    }
    get headers() {
      this.I.set('X-Goog-AuthUser', this.l)
      let e = this.T()
      return (
        e && this.I.set('Authorization', e),
        this.h && this.I.set('X-Goog-Iam-Authorization-Token', this.h),
        this.I
      )
    }
  },
  xd = class {
    constructor(e, n, r) {
      ;(this.l = e), (this.h = n), (this.P = r)
    }
    getToken() {
      return Promise.resolve(new Rd(this.l, this.h, this.P))
    }
    start(e, n) {
      e.enqueueRetryable(() => n(ue.FIRST_PARTY))
    }
    shutdown() {}
    invalidateToken() {}
  },
  Md = class {
    constructor(e) {
      ;(this.value = e),
        (this.type = 'AppCheck'),
        (this.headers = new Map()),
        e && e.length > 0 && this.headers.set('x-firebase-appcheck', this.value)
    }
  },
  Pd = class {
    constructor(e) {
      ;(this.A = e),
        (this.forceRefresh = !1),
        (this.appCheck = null),
        (this.R = null)
    }
    start(e, n) {
      let r = (s) => {
        s.error != null &&
          v(
            'FirebaseAppCheckTokenProvider',
            `Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`
          )
        let o = s.token !== this.R
        return (
          (this.R = s.token),
          v(
            'FirebaseAppCheckTokenProvider',
            `Received ${o ? 'new' : 'existing'} token.`
          ),
          o ? n(s.token) : Promise.resolve()
        )
      }
      this.o = (s) => {
        e.enqueueRetryable(() => r(s))
      }
      let i = (s) => {
        v('FirebaseAppCheckTokenProvider', 'AppCheck detected'),
          (this.appCheck = s),
          this.appCheck.addTokenListener(this.o)
      }
      this.A.onInit((s) => i(s)),
        setTimeout(() => {
          if (!this.appCheck) {
            let s = this.A.getImmediate({ optional: !0 })
            s
              ? i(s)
              : v('FirebaseAppCheckTokenProvider', 'AppCheck not yet detected')
          }
        }, 0)
    }
    getToken() {
      let e = this.forceRefresh
      return (
        (this.forceRefresh = !1),
        this.appCheck
          ? this.appCheck
              .getToken(e)
              .then((n) =>
                n
                  ? (ie(typeof n.token == 'string'),
                    (this.R = n.token),
                    new Md(n.token))
                  : null
              )
          : Promise.resolve(null)
      )
    }
    invalidateToken() {
      this.forceRefresh = !0
    }
    shutdown() {
      this.appCheck && this.appCheck.removeTokenListener(this.o)
    }
  }
function NS(t) {
  let e = typeof self < 'u' && (self.crypto || self.msCrypto),
    n = new Uint8Array(t)
  if (e && typeof e.getRandomValues == 'function') e.getRandomValues(n)
  else for (let r = 0; r < t; r++) n[r] = Math.floor(256 * Math.random())
  return n
}
var Od = class {
  static newId() {
    let e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      n = Math.floor(256 / e.length) * e.length,
      r = ''
    for (; r.length < 20; ) {
      let i = NS(40)
      for (let s = 0; s < i.length; ++s)
        r.length < 20 && i[s] < n && (r += e.charAt(i[s] % e.length))
    }
    return r
  }
}
function V(t, e) {
  return t < e ? -1 : t > e ? 1 : 0
}
function gr(t, e, n) {
  return t.length === e.length && t.every((r, i) => n(r, e[i]))
}
var Me = class t {
  constructor(e, n) {
    if (((this.seconds = e), (this.nanoseconds = n), n < 0))
      throw new E(
        m.INVALID_ARGUMENT,
        'Timestamp nanoseconds out of range: ' + n
      )
    if (n >= 1e9)
      throw new E(
        m.INVALID_ARGUMENT,
        'Timestamp nanoseconds out of range: ' + n
      )
    if (e < -62135596800)
      throw new E(m.INVALID_ARGUMENT, 'Timestamp seconds out of range: ' + e)
    if (e >= 253402300800)
      throw new E(m.INVALID_ARGUMENT, 'Timestamp seconds out of range: ' + e)
  }
  static now() {
    return t.fromMillis(Date.now())
  }
  static fromDate(e) {
    return t.fromMillis(e.getTime())
  }
  static fromMillis(e) {
    let n = Math.floor(e / 1e3),
      r = Math.floor(1e6 * (e - 1e3 * n))
    return new t(n, r)
  }
  toDate() {
    return new Date(this.toMillis())
  }
  toMillis() {
    return 1e3 * this.seconds + this.nanoseconds / 1e6
  }
  _compareTo(e) {
    return this.seconds === e.seconds
      ? V(this.nanoseconds, e.nanoseconds)
      : V(this.seconds, e.seconds)
  }
  isEqual(e) {
    return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds
  }
  toString() {
    return (
      'Timestamp(seconds=' +
      this.seconds +
      ', nanoseconds=' +
      this.nanoseconds +
      ')'
    )
  }
  toJSON() {
    return { seconds: this.seconds, nanoseconds: this.nanoseconds }
  }
  valueOf() {
    let e = this.seconds - -62135596800
    return (
      String(e).padStart(12, '0') +
      '.' +
      String(this.nanoseconds).padStart(9, '0')
    )
  }
}
var A = class t {
  constructor(e) {
    this.timestamp = e
  }
  static fromTimestamp(e) {
    return new t(e)
  }
  static min() {
    return new t(new Me(0, 0))
  }
  static max() {
    return new t(new Me(253402300799, 999999999))
  }
  compareTo(e) {
    return this.timestamp._compareTo(e.timestamp)
  }
  isEqual(e) {
    return this.timestamp.isEqual(e.timestamp)
  }
  toMicroseconds() {
    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3
  }
  toString() {
    return 'SnapshotVersion(' + this.timestamp.toString() + ')'
  }
  toTimestamp() {
    return this.timestamp
  }
}
var la = class t {
    constructor(e, n, r) {
      n === void 0 ? (n = 0) : n > e.length && b(),
        r === void 0 ? (r = e.length - n) : r > e.length - n && b(),
        (this.segments = e),
        (this.offset = n),
        (this.len = r)
    }
    get length() {
      return this.len
    }
    isEqual(e) {
      return t.comparator(this, e) === 0
    }
    child(e) {
      let n = this.segments.slice(this.offset, this.limit())
      return (
        e instanceof t
          ? e.forEach((r) => {
              n.push(r)
            })
          : n.push(e),
        this.construct(n)
      )
    }
    limit() {
      return this.offset + this.length
    }
    popFirst(e) {
      return (
        (e = e === void 0 ? 1 : e),
        this.construct(this.segments, this.offset + e, this.length - e)
      )
    }
    popLast() {
      return this.construct(this.segments, this.offset, this.length - 1)
    }
    firstSegment() {
      return this.segments[this.offset]
    }
    lastSegment() {
      return this.get(this.length - 1)
    }
    get(e) {
      return this.segments[this.offset + e]
    }
    isEmpty() {
      return this.length === 0
    }
    isPrefixOf(e) {
      if (e.length < this.length) return !1
      for (let n = 0; n < this.length; n++)
        if (this.get(n) !== e.get(n)) return !1
      return !0
    }
    isImmediateParentOf(e) {
      if (this.length + 1 !== e.length) return !1
      for (let n = 0; n < this.length; n++)
        if (this.get(n) !== e.get(n)) return !1
      return !0
    }
    forEach(e) {
      for (let n = this.offset, r = this.limit(); n < r; n++)
        e(this.segments[n])
    }
    toArray() {
      return this.segments.slice(this.offset, this.limit())
    }
    static comparator(e, n) {
      let r = Math.min(e.length, n.length)
      for (let i = 0; i < r; i++) {
        let s = e.get(i),
          o = n.get(i)
        if (s < o) return -1
        if (s > o) return 1
      }
      return e.length < n.length ? -1 : e.length > n.length ? 1 : 0
    }
  },
  re = class t extends la {
    construct(e, n, r) {
      return new t(e, n, r)
    }
    canonicalString() {
      return this.toArray().join('/')
    }
    toString() {
      return this.canonicalString()
    }
    toUriEncodedString() {
      return this.toArray().map(encodeURIComponent).join('/')
    }
    static fromString(...e) {
      let n = []
      for (let r of e) {
        if (r.indexOf('//') >= 0)
          throw new E(
            m.INVALID_ARGUMENT,
            `Invalid segment (${r}). Paths must not contain // in them.`
          )
        n.push(...r.split('/').filter((i) => i.length > 0))
      }
      return new t(n)
    }
    static emptyPath() {
      return new t([])
    }
  },
  RS = /^[_a-zA-Z][_a-zA-Z0-9]*$/,
  ze = class t extends la {
    construct(e, n, r) {
      return new t(e, n, r)
    }
    static isValidIdentifier(e) {
      return RS.test(e)
    }
    canonicalString() {
      return this.toArray()
        .map(
          (e) => (
            (e = e.replace(/\\/g, '\\\\').replace(/`/g, '\\`')),
            t.isValidIdentifier(e) || (e = '`' + e + '`'),
            e
          )
        )
        .join('.')
    }
    toString() {
      return this.canonicalString()
    }
    isKeyField() {
      return this.length === 1 && this.get(0) === '__name__'
    }
    static keyField() {
      return new t(['__name__'])
    }
    static fromServerFormat(e) {
      let n = [],
        r = '',
        i = 0,
        s = () => {
          if (r.length === 0)
            throw new E(
              m.INVALID_ARGUMENT,
              `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`
            )
          n.push(r), (r = '')
        },
        o = !1
      for (; i < e.length; ) {
        let a = e[i]
        if (a === '\\') {
          if (i + 1 === e.length)
            throw new E(
              m.INVALID_ARGUMENT,
              'Path has trailing escape character: ' + e
            )
          let c = e[i + 1]
          if (c !== '\\' && c !== '.' && c !== '`')
            throw new E(
              m.INVALID_ARGUMENT,
              'Path has invalid escape sequence: ' + e
            )
          ;(r += c), (i += 2)
        } else
          a === '`'
            ? ((o = !o), i++)
            : a !== '.' || o
              ? ((r += a), i++)
              : (s(), i++)
      }
      if ((s(), o))
        throw new E(m.INVALID_ARGUMENT, 'Unterminated ` in path: ' + e)
      return new t(n)
    }
    static emptyPath() {
      return new t([])
    }
  }
var D = class t {
  constructor(e) {
    this.path = e
  }
  static fromPath(e) {
    return new t(re.fromString(e))
  }
  static fromName(e) {
    return new t(re.fromString(e).popFirst(5))
  }
  static empty() {
    return new t(re.emptyPath())
  }
  get collectionGroup() {
    return this.path.popLast().lastSegment()
  }
  hasCollectionId(e) {
    return this.path.length >= 2 && this.path.get(this.path.length - 2) === e
  }
  getCollectionGroup() {
    return this.path.get(this.path.length - 2)
  }
  getCollectionPath() {
    return this.path.popLast()
  }
  isEqual(e) {
    return e !== null && re.comparator(this.path, e.path) === 0
  }
  toString() {
    return this.path.toString()
  }
  static comparator(e, n) {
    return re.comparator(e.path, n.path)
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0
  }
  static fromSegments(e) {
    return new t(new re(e.slice()))
  }
}
var kd = class {
  constructor(e, n, r, i) {
    ;(this.indexId = e),
      (this.collectionGroup = n),
      (this.fields = r),
      (this.indexState = i)
  }
}
kd.UNKNOWN_ID = -1
function xS(t, e) {
  let n = t.toTimestamp().seconds,
    r = t.toTimestamp().nanoseconds + 1,
    i = A.fromTimestamp(r === 1e9 ? new Me(n + 1, 0) : new Me(n, r))
  return new Cn(i, D.empty(), e)
}
function MS(t) {
  return new Cn(t.readTime, t.key, -1)
}
var Cn = class t {
  constructor(e, n, r) {
    ;(this.readTime = e), (this.documentKey = n), (this.largestBatchId = r)
  }
  static min() {
    return new t(A.min(), D.empty(), -1)
  }
  static max() {
    return new t(A.max(), D.empty(), -1)
  }
}
function PS(t, e) {
  let n = t.readTime.compareTo(e.readTime)
  return n !== 0
    ? n
    : ((n = D.comparator(t.documentKey, e.documentKey)),
      n !== 0 ? n : V(t.largestBatchId, e.largestBatchId))
}
var OS =
    'The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.',
  Fd = class {
    constructor() {
      this.onCommittedListeners = []
    }
    addOnCommittedListener(e) {
      this.onCommittedListeners.push(e)
    }
    raiseOnCommittedEvent() {
      this.onCommittedListeners.forEach((e) => e())
    }
  }
function rf(t) {
  return p(this, null, function* () {
    if (t.code !== m.FAILED_PRECONDITION || t.message !== OS) throw t
    v('LocalStore', 'Unexpectedly lost primary lease')
  })
}
var g = class t {
  constructor(e) {
    ;(this.nextCallback = null),
      (this.catchCallback = null),
      (this.result = void 0),
      (this.error = void 0),
      (this.isDone = !1),
      (this.callbackAttached = !1),
      e(
        (n) => {
          ;(this.isDone = !0),
            (this.result = n),
            this.nextCallback && this.nextCallback(n)
        },
        (n) => {
          ;(this.isDone = !0),
            (this.error = n),
            this.catchCallback && this.catchCallback(n)
        }
      )
  }
  catch(e) {
    return this.next(void 0, e)
  }
  next(e, n) {
    return (
      this.callbackAttached && b(),
      (this.callbackAttached = !0),
      this.isDone
        ? this.error
          ? this.wrapFailure(n, this.error)
          : this.wrapSuccess(e, this.result)
        : new t((r, i) => {
            ;(this.nextCallback = (s) => {
              this.wrapSuccess(e, s).next(r, i)
            }),
              (this.catchCallback = (s) => {
                this.wrapFailure(n, s).next(r, i)
              })
          })
    )
  }
  toPromise() {
    return new Promise((e, n) => {
      this.next(e, n)
    })
  }
  wrapUserFunction(e) {
    try {
      let n = e()
      return n instanceof t ? n : t.resolve(n)
    } catch (n) {
      return t.reject(n)
    }
  }
  wrapSuccess(e, n) {
    return e ? this.wrapUserFunction(() => e(n)) : t.resolve(n)
  }
  wrapFailure(e, n) {
    return e ? this.wrapUserFunction(() => e(n)) : t.reject(n)
  }
  static resolve(e) {
    return new t((n, r) => {
      n(e)
    })
  }
  static reject(e) {
    return new t((n, r) => {
      r(e)
    })
  }
  static waitFor(e) {
    return new t((n, r) => {
      let i = 0,
        s = 0,
        o = !1
      e.forEach((a) => {
        ++i,
          a.next(
            () => {
              ++s, o && s === i && n()
            },
            (c) => r(c)
          )
      }),
        (o = !0),
        s === i && n()
    })
  }
  static or(e) {
    let n = t.resolve(!1)
    for (let r of e) n = n.next((i) => (i ? t.resolve(i) : r()))
    return n
  }
  static forEach(e, n) {
    let r = []
    return (
      e.forEach((i, s) => {
        r.push(n.call(this, i, s))
      }),
      this.waitFor(r)
    )
  }
  static mapArray(e, n) {
    return new t((r, i) => {
      let s = e.length,
        o = new Array(s),
        a = 0
      for (let c = 0; c < s; c++) {
        let u = c
        n(e[u]).next(
          (l) => {
            ;(o[u] = l), ++a, a === s && r(o)
          },
          (l) => i(l)
        )
      }
    })
  }
  static doWhile(e, n) {
    return new t((r, i) => {
      let s = () => {
        e() === !0
          ? n().next(() => {
              s()
            }, i)
          : r()
      }
      s()
    })
  }
}
var Ld = class t {
    constructor(e, n) {
      ;(this.action = e),
        (this.transaction = n),
        (this.aborted = !1),
        (this.V = new Tt()),
        (this.transaction.oncomplete = () => {
          this.V.resolve()
        }),
        (this.transaction.onabort = () => {
          n.error ? this.V.reject(new Dn(e, n.error)) : this.V.resolve()
        }),
        (this.transaction.onerror = (r) => {
          let i = sf(r.target.error)
          this.V.reject(new Dn(e, i))
        })
    }
    static open(e, n, r, i) {
      try {
        return new t(n, e.transaction(i, r))
      } catch (s) {
        throw new Dn(n, s)
      }
    }
    get m() {
      return this.V.promise
    }
    abort(e) {
      e && this.V.reject(e),
        this.aborted ||
          (v(
            'SimpleDb',
            'Aborting transaction:',
            e ? e.message : 'Client-initiated abort'
          ),
          (this.aborted = !0),
          this.transaction.abort())
    }
    g() {
      let e = this.transaction
      this.aborted || typeof e.commit != 'function' || e.commit()
    }
    store(e) {
      let n = this.transaction.objectStore(e)
      return new Ud(n)
    }
  },
  da = class t {
    constructor(e, n, r) {
      ;(this.name = e),
        (this.version = n),
        (this.p = r),
        t.S(me()) === 12.2 &&
          at(
            'Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.'
          )
    }
    static delete(e) {
      return (
        v('SimpleDb', 'Removing database:', e),
        vn(window.indexedDB.deleteDatabase(e)).toPromise()
      )
    }
    static D() {
      if (!lo()) return !1
      if (t.C()) return !0
      let e = me(),
        n = t.S(e),
        r = 0 < n && n < 10,
        i = t.v(e),
        s = 0 < i && i < 4.5
      return !(
        e.indexOf('MSIE ') > 0 ||
        e.indexOf('Trident/') > 0 ||
        e.indexOf('Edge/') > 0 ||
        r ||
        s
      )
    }
    static C() {
      var e
      return (
        typeof process < 'u' &&
        ((e = process.__PRIVATE_env) === null || e === void 0
          ? void 0
          : e.F) === 'YES'
      )
    }
    static M(e, n) {
      return e.store(n)
    }
    static S(e) {
      let n = e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),
        r = n ? n[1].split('_').slice(0, 2).join('.') : '-1'
      return Number(r)
    }
    static v(e) {
      let n = e.match(/Android ([\d.]+)/i),
        r = n ? n[1].split('.').slice(0, 2).join('.') : '-1'
      return Number(r)
    }
    O(e) {
      return p(this, null, function* () {
        return (
          this.db ||
            (v('SimpleDb', 'Opening database:', this.name),
            (this.db = yield new Promise((n, r) => {
              let i = indexedDB.open(this.name, this.version)
              ;(i.onsuccess = (s) => {
                let o = s.target.result
                n(o)
              }),
                (i.onblocked = () => {
                  r(
                    new Dn(
                      e,
                      'Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed.'
                    )
                  )
                }),
                (i.onerror = (s) => {
                  let o = s.target.error
                  o.name === 'VersionError'
                    ? r(
                        new E(
                          m.FAILED_PRECONDITION,
                          'A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.'
                        )
                      )
                    : o.name === 'InvalidStateError'
                      ? r(
                          new E(
                            m.FAILED_PRECONDITION,
                            'Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: ' +
                              o
                          )
                        )
                      : r(new Dn(e, o))
                }),
                (i.onupgradeneeded = (s) => {
                  v(
                    'SimpleDb',
                    'Database "' +
                      this.name +
                      '" requires upgrade from version:',
                    s.oldVersion
                  )
                  let o = s.target.result
                  this.p
                    .N(o, i.transaction, s.oldVersion, this.version)
                    .next(() => {
                      v(
                        'SimpleDb',
                        'Database upgrade to version ' +
                          this.version +
                          ' complete'
                      )
                    })
                })
            }))),
          this.B && (this.db.onversionchange = (n) => this.B(n)),
          this.db
        )
      })
    }
    L(e) {
      ;(this.B = e), this.db && (this.db.onversionchange = (n) => e(n))
    }
    runTransaction(e, n, r, i) {
      return p(this, null, function* () {
        let s = n === 'readonly',
          o = 0
        for (;;) {
          ++o
          try {
            this.db = yield this.O(e)
            let a = Ld.open(this.db, e, s ? 'readonly' : 'readwrite', r),
              c = i(a)
                .next((u) => (a.g(), u))
                .catch((u) => (a.abort(u), g.reject(u)))
                .toPromise()
            return c.catch(() => {}), yield a.m, c
          } catch (a) {
            let c = a,
              u = c.name !== 'FirebaseError' && o < 3
            if (
              (v(
                'SimpleDb',
                'Transaction failed with error:',
                c.message,
                'Retrying:',
                u
              ),
              this.close(),
              !u)
            )
              return Promise.reject(c)
          }
        }
      })
    }
    close() {
      this.db && this.db.close(), (this.db = void 0)
    }
  },
  Vd = class {
    constructor(e) {
      ;(this.k = e), (this.q = !1), (this.K = null)
    }
    get isDone() {
      return this.q
    }
    get $() {
      return this.K
    }
    set cursor(e) {
      this.k = e
    }
    done() {
      this.q = !0
    }
    U(e) {
      this.K = e
    }
    delete() {
      return vn(this.k.delete())
    }
  },
  Dn = class extends E {
    constructor(e, n) {
      super(m.UNAVAILABLE, `IndexedDB transaction '${e}' failed: ${n}`),
        (this.name = 'IndexedDbTransactionError')
    }
  }
function es(t) {
  return t.name === 'IndexedDbTransactionError'
}
var Ud = class {
  constructor(e) {
    this.store = e
  }
  put(e, n) {
    let r
    return (
      n !== void 0
        ? (v('SimpleDb', 'PUT', this.store.name, e, n),
          (r = this.store.put(n, e)))
        : (v('SimpleDb', 'PUT', this.store.name, '<auto-key>', e),
          (r = this.store.put(e))),
      vn(r)
    )
  }
  add(e) {
    return v('SimpleDb', 'ADD', this.store.name, e, e), vn(this.store.add(e))
  }
  get(e) {
    return vn(this.store.get(e)).next(
      (n) => (
        n === void 0 && (n = null),
        v('SimpleDb', 'GET', this.store.name, e, n),
        n
      )
    )
  }
  delete(e) {
    return v('SimpleDb', 'DELETE', this.store.name, e), vn(this.store.delete(e))
  }
  count() {
    return v('SimpleDb', 'COUNT', this.store.name), vn(this.store.count())
  }
  W(e, n) {
    let r = this.options(e, n),
      i = r.index ? this.store.index(r.index) : this.store
    if (typeof i.getAll == 'function') {
      let s = i.getAll(r.range)
      return new g((o, a) => {
        ;(s.onerror = (c) => {
          a(c.target.error)
        }),
          (s.onsuccess = (c) => {
            o(c.target.result)
          })
      })
    }
    {
      let s = this.cursor(r),
        o = []
      return this.G(s, (a, c) => {
        o.push(c)
      }).next(() => o)
    }
  }
  j(e, n) {
    let r = this.store.getAll(e, n === null ? void 0 : n)
    return new g((i, s) => {
      ;(r.onerror = (o) => {
        s(o.target.error)
      }),
        (r.onsuccess = (o) => {
          i(o.target.result)
        })
    })
  }
  H(e, n) {
    v('SimpleDb', 'DELETE ALL', this.store.name)
    let r = this.options(e, n)
    r.J = !1
    let i = this.cursor(r)
    return this.G(i, (s, o, a) => a.delete())
  }
  Y(e, n) {
    let r
    n ? (r = e) : ((r = {}), (n = e))
    let i = this.cursor(r)
    return this.G(i, n)
  }
  Z(e) {
    let n = this.cursor({})
    return new g((r, i) => {
      ;(n.onerror = (s) => {
        let o = sf(s.target.error)
        i(o)
      }),
        (n.onsuccess = (s) => {
          let o = s.target.result
          o
            ? e(o.primaryKey, o.value).next((a) => {
                a ? o.continue() : r()
              })
            : r()
        })
    })
  }
  G(e, n) {
    let r = []
    return new g((i, s) => {
      ;(e.onerror = (o) => {
        s(o.target.error)
      }),
        (e.onsuccess = (o) => {
          let a = o.target.result
          if (!a) return void i()
          let c = new Vd(a),
            u = n(a.primaryKey, a.value, c)
          if (u instanceof g) {
            let l = u.catch((d) => (c.done(), g.reject(d)))
            r.push(l)
          }
          c.isDone ? i() : c.$ === null ? a.continue() : a.continue(c.$)
        })
    }).next(() => g.waitFor(r))
  }
  options(e, n) {
    let r
    return (
      e !== void 0 && (typeof e == 'string' ? (r = e) : (n = e)),
      { index: r, range: n }
    )
  }
  cursor(e) {
    let n = 'next'
    if ((e.reverse && (n = 'prev'), e.index)) {
      let r = this.store.index(e.index)
      return e.J ? r.openKeyCursor(e.range, n) : r.openCursor(e.range, n)
    }
    return this.store.openCursor(e.range, n)
  }
}
function vn(t) {
  return new g((e, n) => {
    ;(t.onsuccess = (r) => {
      let i = r.target.result
      e(i)
    }),
      (t.onerror = (r) => {
        let i = sf(r.target.error)
        n(i)
      })
  })
}
var jv = !1
function sf(t) {
  let e = da.S(me())
  if (e >= 12.2 && e < 13) {
    let n = 'An internal error was encountered in the Indexed Database server'
    if (t.message.indexOf(n) >= 0) {
      let r = new E(
        'internal',
        `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${n}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`
      )
      return (
        jv ||
          ((jv = !0),
          setTimeout(() => {
            throw r
          }, 0)),
        r
      )
    }
  }
  return t
}
var m_ = (() => {
  class t {
    constructor(n, r) {
      ;(this.previousValue = n),
        r &&
          ((r.sequenceNumberHandler = (i) => this.se(i)),
          (this.oe = (i) => r.writeSequenceNumber(i)))
    }
    se(n) {
      return (
        (this.previousValue = Math.max(n, this.previousValue)),
        this.previousValue
      )
    }
    next() {
      let n = ++this.previousValue
      return this.oe && this.oe(n), n
    }
  }
  return (t._e = -1), t
})()
function Fa(t) {
  return t == null
}
function ha(t) {
  return t === 0 && 1 / t == -1 / 0
}
var kS = [
    'mutationQueues',
    'mutations',
    'documentMutations',
    'remoteDocuments',
    'targets',
    'owner',
    'targetGlobal',
    'targetDocuments',
    'clientMetadata',
    'remoteDocumentGlobal',
    'collectionParents',
    'bundles',
    'namedQueries',
  ],
  jk = [...kS, 'documentOverlays'],
  FS = [
    'mutationQueues',
    'mutations',
    'documentMutations',
    'remoteDocumentsV14',
    'targets',
    'owner',
    'targetGlobal',
    'targetDocuments',
    'clientMetadata',
    'remoteDocumentGlobal',
    'collectionParents',
    'bundles',
    'namedQueries',
    'documentOverlays',
  ],
  LS = FS,
  Bk = [...LS, 'indexConfiguration', 'indexState', 'indexEntries']
function Bv(t) {
  let e = 0
  for (let n in t) Object.prototype.hasOwnProperty.call(t, n) && e++
  return e
}
function La(t, e) {
  for (let n in t) Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n])
}
function VS(t) {
  for (let e in t) if (Object.prototype.hasOwnProperty.call(t, e)) return !1
  return !0
}
var ee = class t {
    constructor(e, n) {
      ;(this.comparator = e), (this.root = n || st.EMPTY)
    }
    insert(e, n) {
      return new t(
        this.comparator,
        this.root
          .insert(e, n, this.comparator)
          .copy(null, null, st.BLACK, null, null)
      )
    }
    remove(e) {
      return new t(
        this.comparator,
        this.root
          .remove(e, this.comparator)
          .copy(null, null, st.BLACK, null, null)
      )
    }
    get(e) {
      let n = this.root
      for (; !n.isEmpty(); ) {
        let r = this.comparator(e, n.key)
        if (r === 0) return n.value
        r < 0 ? (n = n.left) : r > 0 && (n = n.right)
      }
      return null
    }
    indexOf(e) {
      let n = 0,
        r = this.root
      for (; !r.isEmpty(); ) {
        let i = this.comparator(e, r.key)
        if (i === 0) return n + r.left.size
        i < 0 ? (r = r.left) : ((n += r.left.size + 1), (r = r.right))
      }
      return -1
    }
    isEmpty() {
      return this.root.isEmpty()
    }
    get size() {
      return this.root.size
    }
    minKey() {
      return this.root.minKey()
    }
    maxKey() {
      return this.root.maxKey()
    }
    inorderTraversal(e) {
      return this.root.inorderTraversal(e)
    }
    forEach(e) {
      this.inorderTraversal((n, r) => (e(n, r), !1))
    }
    toString() {
      let e = []
      return (
        this.inorderTraversal((n, r) => (e.push(`${n}:${r}`), !1)),
        `{${e.join(', ')}}`
      )
    }
    reverseTraversal(e) {
      return this.root.reverseTraversal(e)
    }
    getIterator() {
      return new ur(this.root, null, this.comparator, !1)
    }
    getIteratorFrom(e) {
      return new ur(this.root, e, this.comparator, !1)
    }
    getReverseIterator() {
      return new ur(this.root, null, this.comparator, !0)
    }
    getReverseIteratorFrom(e) {
      return new ur(this.root, e, this.comparator, !0)
    }
  },
  ur = class {
    constructor(e, n, r, i) {
      ;(this.isReverse = i), (this.nodeStack = [])
      let s = 1
      for (; !e.isEmpty(); )
        if (((s = n ? r(e.key, n) : 1), n && i && (s *= -1), s < 0))
          e = this.isReverse ? e.left : e.right
        else {
          if (s === 0) {
            this.nodeStack.push(e)
            break
          }
          this.nodeStack.push(e), (e = this.isReverse ? e.right : e.left)
        }
    }
    getNext() {
      let e = this.nodeStack.pop(),
        n = { key: e.key, value: e.value }
      if (this.isReverse)
        for (e = e.left; !e.isEmpty(); ) this.nodeStack.push(e), (e = e.right)
      else
        for (e = e.right; !e.isEmpty(); ) this.nodeStack.push(e), (e = e.left)
      return n
    }
    hasNext() {
      return this.nodeStack.length > 0
    }
    peek() {
      if (this.nodeStack.length === 0) return null
      let e = this.nodeStack[this.nodeStack.length - 1]
      return { key: e.key, value: e.value }
    }
  },
  st = class t {
    constructor(e, n, r, i, s) {
      ;(this.key = e),
        (this.value = n),
        (this.color = r ?? t.RED),
        (this.left = i ?? t.EMPTY),
        (this.right = s ?? t.EMPTY),
        (this.size = this.left.size + 1 + this.right.size)
    }
    copy(e, n, r, i, s) {
      return new t(
        e ?? this.key,
        n ?? this.value,
        r ?? this.color,
        i ?? this.left,
        s ?? this.right
      )
    }
    isEmpty() {
      return !1
    }
    inorderTraversal(e) {
      return (
        this.left.inorderTraversal(e) ||
        e(this.key, this.value) ||
        this.right.inorderTraversal(e)
      )
    }
    reverseTraversal(e) {
      return (
        this.right.reverseTraversal(e) ||
        e(this.key, this.value) ||
        this.left.reverseTraversal(e)
      )
    }
    min() {
      return this.left.isEmpty() ? this : this.left.min()
    }
    minKey() {
      return this.min().key
    }
    maxKey() {
      return this.right.isEmpty() ? this.key : this.right.maxKey()
    }
    insert(e, n, r) {
      let i = this,
        s = r(e, i.key)
      return (
        (i =
          s < 0
            ? i.copy(null, null, null, i.left.insert(e, n, r), null)
            : s === 0
              ? i.copy(null, n, null, null, null)
              : i.copy(null, null, null, null, i.right.insert(e, n, r))),
        i.fixUp()
      )
    }
    removeMin() {
      if (this.left.isEmpty()) return t.EMPTY
      let e = this
      return (
        e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()),
        (e = e.copy(null, null, null, e.left.removeMin(), null)),
        e.fixUp()
      )
    }
    remove(e, n) {
      let r,
        i = this
      if (n(e, i.key) < 0)
        i.left.isEmpty() ||
          i.left.isRed() ||
          i.left.left.isRed() ||
          (i = i.moveRedLeft()),
          (i = i.copy(null, null, null, i.left.remove(e, n), null))
      else {
        if (
          (i.left.isRed() && (i = i.rotateRight()),
          i.right.isEmpty() ||
            i.right.isRed() ||
            i.right.left.isRed() ||
            (i = i.moveRedRight()),
          n(e, i.key) === 0)
        ) {
          if (i.right.isEmpty()) return t.EMPTY
          ;(r = i.right.min()),
            (i = i.copy(r.key, r.value, null, null, i.right.removeMin()))
        }
        i = i.copy(null, null, null, null, i.right.remove(e, n))
      }
      return i.fixUp()
    }
    isRed() {
      return this.color
    }
    fixUp() {
      let e = this
      return (
        e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()),
        e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()),
        e.left.isRed() && e.right.isRed() && (e = e.colorFlip()),
        e
      )
    }
    moveRedLeft() {
      let e = this.colorFlip()
      return (
        e.right.left.isRed() &&
          ((e = e.copy(null, null, null, null, e.right.rotateRight())),
          (e = e.rotateLeft()),
          (e = e.colorFlip())),
        e
      )
    }
    moveRedRight() {
      let e = this.colorFlip()
      return (
        e.left.left.isRed() && ((e = e.rotateRight()), (e = e.colorFlip())), e
      )
    }
    rotateLeft() {
      let e = this.copy(null, null, t.RED, null, this.right.left)
      return this.right.copy(null, null, this.color, e, null)
    }
    rotateRight() {
      let e = this.copy(null, null, t.RED, this.left.right, null)
      return this.left.copy(null, null, this.color, null, e)
    }
    colorFlip() {
      let e = this.left.copy(null, null, !this.left.color, null, null),
        n = this.right.copy(null, null, !this.right.color, null, null)
      return this.copy(null, null, !this.color, e, n)
    }
    checkMaxDepth() {
      let e = this.check()
      return Math.pow(2, e) <= this.size + 1
    }
    check() {
      if ((this.isRed() && this.left.isRed()) || this.right.isRed()) throw b()
      let e = this.left.check()
      if (e !== this.right.check()) throw b()
      return e + (this.isRed() ? 0 : 1)
    }
  }
;(st.EMPTY = null), (st.RED = !0), (st.BLACK = !1)
st.EMPTY = new (class {
  constructor() {
    this.size = 0
  }
  get key() {
    throw b()
  }
  get value() {
    throw b()
  }
  get color() {
    throw b()
  }
  get left() {
    throw b()
  }
  get right() {
    throw b()
  }
  copy(e, n, r, i, s) {
    return this
  }
  insert(e, n, r) {
    return new st(e, n)
  }
  remove(e, n) {
    return this
  }
  isEmpty() {
    return !0
  }
  inorderTraversal(e) {
    return !1
  }
  reverseTraversal(e) {
    return !1
  }
  minKey() {
    return null
  }
  maxKey() {
    return null
  }
  isRed() {
    return !1
  }
  checkMaxDepth() {
    return !0
  }
  check() {
    return 0
  }
})()
var Ie = class t {
    constructor(e) {
      ;(this.comparator = e), (this.data = new ee(this.comparator))
    }
    has(e) {
      return this.data.get(e) !== null
    }
    first() {
      return this.data.minKey()
    }
    last() {
      return this.data.maxKey()
    }
    get size() {
      return this.data.size
    }
    indexOf(e) {
      return this.data.indexOf(e)
    }
    forEach(e) {
      this.data.inorderTraversal((n, r) => (e(n), !1))
    }
    forEachInRange(e, n) {
      let r = this.data.getIteratorFrom(e[0])
      for (; r.hasNext(); ) {
        let i = r.getNext()
        if (this.comparator(i.key, e[1]) >= 0) return
        n(i.key)
      }
    }
    forEachWhile(e, n) {
      let r
      for (
        r =
          n !== void 0 ? this.data.getIteratorFrom(n) : this.data.getIterator();
        r.hasNext();

      )
        if (!e(r.getNext().key)) return
    }
    firstAfterOrEqual(e) {
      let n = this.data.getIteratorFrom(e)
      return n.hasNext() ? n.getNext().key : null
    }
    getIterator() {
      return new fa(this.data.getIterator())
    }
    getIteratorFrom(e) {
      return new fa(this.data.getIteratorFrom(e))
    }
    add(e) {
      return this.copy(this.data.remove(e).insert(e, !0))
    }
    delete(e) {
      return this.has(e) ? this.copy(this.data.remove(e)) : this
    }
    isEmpty() {
      return this.data.isEmpty()
    }
    unionWith(e) {
      let n = this
      return (
        n.size < e.size && ((n = e), (e = this)),
        e.forEach((r) => {
          n = n.add(r)
        }),
        n
      )
    }
    isEqual(e) {
      if (!(e instanceof t) || this.size !== e.size) return !1
      let n = this.data.getIterator(),
        r = e.data.getIterator()
      for (; n.hasNext(); ) {
        let i = n.getNext().key,
          s = r.getNext().key
        if (this.comparator(i, s) !== 0) return !1
      }
      return !0
    }
    toArray() {
      let e = []
      return (
        this.forEach((n) => {
          e.push(n)
        }),
        e
      )
    }
    toString() {
      let e = []
      return this.forEach((n) => e.push(n)), 'SortedSet(' + e.toString() + ')'
    }
    copy(e) {
      let n = new t(this.comparator)
      return (n.data = e), n
    }
  },
  fa = class {
    constructor(e) {
      this.iter = e
    }
    getNext() {
      return this.iter.getNext().key
    }
    hasNext() {
      return this.iter.hasNext()
    }
  }
var _n = class t {
  constructor(e) {
    ;(this.fields = e), e.sort(ze.comparator)
  }
  static empty() {
    return new t([])
  }
  unionWith(e) {
    let n = new Ie(ze.comparator)
    for (let r of this.fields) n = n.add(r)
    for (let r of e) n = n.add(r)
    return new t(n.toArray())
  }
  covers(e) {
    for (let n of this.fields) if (n.isPrefixOf(e)) return !0
    return !1
  }
  isEqual(e) {
    return gr(this.fields, e.fields, (n, r) => n.isEqual(r))
  }
}
var pa = class extends Error {
  constructor() {
    super(...arguments), (this.name = 'Base64DecodeError')
  }
}
var we = class t {
  constructor(e) {
    this.binaryString = e
  }
  static fromBase64String(e) {
    let n = (function (i) {
      try {
        return atob(i)
      } catch (s) {
        throw typeof DOMException < 'u' && s instanceof DOMException
          ? new pa('Invalid base64 string: ' + s)
          : s
      }
    })(e)
    return new t(n)
  }
  static fromUint8Array(e) {
    let n = (function (i) {
      let s = ''
      for (let o = 0; o < i.length; ++o) s += String.fromCharCode(i[o])
      return s
    })(e)
    return new t(n)
  }
  [Symbol.iterator]() {
    let e = 0
    return {
      next: () =>
        e < this.binaryString.length
          ? { value: this.binaryString.charCodeAt(e++), done: !1 }
          : { value: void 0, done: !0 },
    }
  }
  toBase64() {
    return (function (n) {
      return btoa(n)
    })(this.binaryString)
  }
  toUint8Array() {
    return (function (n) {
      let r = new Uint8Array(n.length)
      for (let i = 0; i < n.length; i++) r[i] = n.charCodeAt(i)
      return r
    })(this.binaryString)
  }
  approximateByteSize() {
    return 2 * this.binaryString.length
  }
  compareTo(e) {
    return V(this.binaryString, e.binaryString)
  }
  isEqual(e) {
    return this.binaryString === e.binaryString
  }
}
we.EMPTY_BYTE_STRING = new we('')
var US = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/)
function Bt(t) {
  if ((ie(!!t), typeof t == 'string')) {
    let e = 0,
      n = US.exec(t)
    if ((ie(!!n), n[1])) {
      let i = n[1]
      ;(i = (i + '000000000').substr(0, 9)), (e = Number(i))
    }
    let r = new Date(t)
    return { seconds: Math.floor(r.getTime() / 1e3), nanos: e }
  }
  return { seconds: J(t.seconds), nanos: J(t.nanos) }
}
function J(t) {
  return typeof t == 'number' ? t : typeof t == 'string' ? Number(t) : 0
}
function $t(t) {
  return typeof t == 'string' ? we.fromBase64String(t) : we.fromUint8Array(t)
}
function of(t) {
  var e, n
  return (
    ((n = (
      ((e = t?.mapValue) === null || e === void 0 ? void 0 : e.fields) || {}
    ).__type__) === null || n === void 0
      ? void 0
      : n.stringValue) === 'server_timestamp'
  )
}
function af(t) {
  let e = t.mapValue.fields.__previous_value__
  return of(e) ? af(e) : e
}
function $i(t) {
  let e = Bt(t.mapValue.fields.__local_write_time__.timestampValue)
  return new Me(e.seconds, e.nanos)
}
var jd = class {
    constructor(e, n, r, i, s, o, a, c, u) {
      ;(this.databaseId = e),
        (this.appId = n),
        (this.persistenceKey = r),
        (this.host = i),
        (this.ssl = s),
        (this.forceLongPolling = o),
        (this.autoDetectLongPolling = a),
        (this.longPollingOptions = c),
        (this.useFetchStreams = u)
    }
  },
  ga = class t {
    constructor(e, n) {
      ;(this.projectId = e), (this.database = n || '(default)')
    }
    static empty() {
      return new t('', '')
    }
    get isDefaultDatabase() {
      return this.database === '(default)'
    }
    isEqual(e) {
      return (
        e instanceof t &&
        e.projectId === this.projectId &&
        e.database === this.database
      )
    }
  }
var sa = { mapValue: { fields: { __type__: { stringValue: '__max__' } } } }
function bn(t) {
  return 'nullValue' in t
    ? 0
    : 'booleanValue' in t
      ? 1
      : 'integerValue' in t || 'doubleValue' in t
        ? 2
        : 'timestampValue' in t
          ? 3
          : 'stringValue' in t
            ? 5
            : 'bytesValue' in t
              ? 6
              : 'referenceValue' in t
                ? 7
                : 'geoPointValue' in t
                  ? 8
                  : 'arrayValue' in t
                    ? 9
                    : 'mapValue' in t
                      ? of(t)
                        ? 4
                        : y_(t)
                          ? 9007199254740991
                          : 10
                      : b()
}
function ct(t, e) {
  if (t === e) return !0
  let n = bn(t)
  if (n !== bn(e)) return !1
  switch (n) {
    case 0:
    case 9007199254740991:
      return !0
    case 1:
      return t.booleanValue === e.booleanValue
    case 4:
      return $i(t).isEqual($i(e))
    case 3:
      return (function (i, s) {
        if (
          typeof i.timestampValue == 'string' &&
          typeof s.timestampValue == 'string' &&
          i.timestampValue.length === s.timestampValue.length
        )
          return i.timestampValue === s.timestampValue
        let o = Bt(i.timestampValue),
          a = Bt(s.timestampValue)
        return o.seconds === a.seconds && o.nanos === a.nanos
      })(t, e)
    case 5:
      return t.stringValue === e.stringValue
    case 6:
      return (function (i, s) {
        return $t(i.bytesValue).isEqual($t(s.bytesValue))
      })(t, e)
    case 7:
      return t.referenceValue === e.referenceValue
    case 8:
      return (function (i, s) {
        return (
          J(i.geoPointValue.latitude) === J(s.geoPointValue.latitude) &&
          J(i.geoPointValue.longitude) === J(s.geoPointValue.longitude)
        )
      })(t, e)
    case 2:
      return (function (i, s) {
        if ('integerValue' in i && 'integerValue' in s)
          return J(i.integerValue) === J(s.integerValue)
        if ('doubleValue' in i && 'doubleValue' in s) {
          let o = J(i.doubleValue),
            a = J(s.doubleValue)
          return o === a ? ha(o) === ha(a) : isNaN(o) && isNaN(a)
        }
        return !1
      })(t, e)
    case 9:
      return gr(t.arrayValue.values || [], e.arrayValue.values || [], ct)
    case 10:
      return (function (i, s) {
        let o = i.mapValue.fields || {},
          a = s.mapValue.fields || {}
        if (Bv(o) !== Bv(a)) return !1
        for (let c in o)
          if (o.hasOwnProperty(c) && (a[c] === void 0 || !ct(o[c], a[c])))
            return !1
        return !0
      })(t, e)
    default:
      return b()
  }
}
function Hi(t, e) {
  return (t.values || []).find((n) => ct(n, e)) !== void 0
}
function mr(t, e) {
  if (t === e) return 0
  let n = bn(t),
    r = bn(e)
  if (n !== r) return V(n, r)
  switch (n) {
    case 0:
    case 9007199254740991:
      return 0
    case 1:
      return V(t.booleanValue, e.booleanValue)
    case 2:
      return (function (s, o) {
        let a = J(s.integerValue || s.doubleValue),
          c = J(o.integerValue || o.doubleValue)
        return a < c
          ? -1
          : a > c
            ? 1
            : a === c
              ? 0
              : isNaN(a)
                ? isNaN(c)
                  ? 0
                  : -1
                : 1
      })(t, e)
    case 3:
      return $v(t.timestampValue, e.timestampValue)
    case 4:
      return $v($i(t), $i(e))
    case 5:
      return V(t.stringValue, e.stringValue)
    case 6:
      return (function (s, o) {
        let a = $t(s),
          c = $t(o)
        return a.compareTo(c)
      })(t.bytesValue, e.bytesValue)
    case 7:
      return (function (s, o) {
        let a = s.split('/'),
          c = o.split('/')
        for (let u = 0; u < a.length && u < c.length; u++) {
          let l = V(a[u], c[u])
          if (l !== 0) return l
        }
        return V(a.length, c.length)
      })(t.referenceValue, e.referenceValue)
    case 8:
      return (function (s, o) {
        let a = V(J(s.latitude), J(o.latitude))
        return a !== 0 ? a : V(J(s.longitude), J(o.longitude))
      })(t.geoPointValue, e.geoPointValue)
    case 9:
      return (function (s, o) {
        let a = s.values || [],
          c = o.values || []
        for (let u = 0; u < a.length && u < c.length; ++u) {
          let l = mr(a[u], c[u])
          if (l) return l
        }
        return V(a.length, c.length)
      })(t.arrayValue, e.arrayValue)
    case 10:
      return (function (s, o) {
        if (s === sa.mapValue && o === sa.mapValue) return 0
        if (s === sa.mapValue) return 1
        if (o === sa.mapValue) return -1
        let a = s.fields || {},
          c = Object.keys(a),
          u = o.fields || {},
          l = Object.keys(u)
        c.sort(), l.sort()
        for (let d = 0; d < c.length && d < l.length; ++d) {
          let h = V(c[d], l[d])
          if (h !== 0) return h
          let f = mr(a[c[d]], u[l[d]])
          if (f !== 0) return f
        }
        return V(c.length, l.length)
      })(t.mapValue, e.mapValue)
    default:
      throw b()
  }
}
function $v(t, e) {
  if (typeof t == 'string' && typeof e == 'string' && t.length === e.length)
    return V(t, e)
  let n = Bt(t),
    r = Bt(e),
    i = V(n.seconds, r.seconds)
  return i !== 0 ? i : V(n.nanos, r.nanos)
}
function yr(t) {
  return Bd(t)
}
function Bd(t) {
  return 'nullValue' in t
    ? 'null'
    : 'booleanValue' in t
      ? '' + t.booleanValue
      : 'integerValue' in t
        ? '' + t.integerValue
        : 'doubleValue' in t
          ? '' + t.doubleValue
          : 'timestampValue' in t
            ? (function (n) {
                let r = Bt(n)
                return `time(${r.seconds},${r.nanos})`
              })(t.timestampValue)
            : 'stringValue' in t
              ? t.stringValue
              : 'bytesValue' in t
                ? (function (n) {
                    return $t(n).toBase64()
                  })(t.bytesValue)
                : 'referenceValue' in t
                  ? (function (n) {
                      return D.fromName(n).toString()
                    })(t.referenceValue)
                  : 'geoPointValue' in t
                    ? (function (n) {
                        return `geo(${n.latitude},${n.longitude})`
                      })(t.geoPointValue)
                    : 'arrayValue' in t
                      ? (function (n) {
                          let r = '[',
                            i = !0
                          for (let s of n.values || [])
                            i ? (i = !1) : (r += ','), (r += Bd(s))
                          return r + ']'
                        })(t.arrayValue)
                      : 'mapValue' in t
                        ? (function (n) {
                            let r = Object.keys(n.fields || {}).sort(),
                              i = '{',
                              s = !0
                            for (let o of r)
                              s ? (s = !1) : (i += ','),
                                (i += `${o}:${Bd(n.fields[o])}`)
                            return i + '}'
                          })(t.mapValue)
                        : b()
}
function $d(t) {
  return !!t && 'integerValue' in t
}
function cf(t) {
  return !!t && 'arrayValue' in t
}
function Hv(t) {
  return !!t && 'nullValue' in t
}
function qv(t) {
  return !!t && 'doubleValue' in t && isNaN(Number(t.doubleValue))
}
function wd(t) {
  return !!t && 'mapValue' in t
}
function Li(t) {
  if (t.geoPointValue)
    return { geoPointValue: Object.assign({}, t.geoPointValue) }
  if (t.timestampValue && typeof t.timestampValue == 'object')
    return { timestampValue: Object.assign({}, t.timestampValue) }
  if (t.mapValue) {
    let e = { mapValue: { fields: {} } }
    return La(t.mapValue.fields, (n, r) => (e.mapValue.fields[n] = Li(r))), e
  }
  if (t.arrayValue) {
    let e = { arrayValue: { values: [] } }
    for (let n = 0; n < (t.arrayValue.values || []).length; ++n)
      e.arrayValue.values[n] = Li(t.arrayValue.values[n])
    return e
  }
  return Object.assign({}, t)
}
function y_(t) {
  return (
    (((t.mapValue || {}).fields || {}).__type__ || {}).stringValue === '__max__'
  )
}
var Dt = class t {
  constructor(e) {
    this.value = e
  }
  static empty() {
    return new t({ mapValue: {} })
  }
  field(e) {
    if (e.isEmpty()) return this.value
    {
      let n = this.value
      for (let r = 0; r < e.length - 1; ++r)
        if (((n = (n.mapValue.fields || {})[e.get(r)]), !wd(n))) return null
      return (n = (n.mapValue.fields || {})[e.lastSegment()]), n || null
    }
  }
  set(e, n) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = Li(n)
  }
  setAll(e) {
    let n = ze.emptyPath(),
      r = {},
      i = []
    e.forEach((o, a) => {
      if (!n.isImmediateParentOf(a)) {
        let c = this.getFieldsMap(n)
        this.applyChanges(c, r, i), (r = {}), (i = []), (n = a.popLast())
      }
      o ? (r[a.lastSegment()] = Li(o)) : i.push(a.lastSegment())
    })
    let s = this.getFieldsMap(n)
    this.applyChanges(s, r, i)
  }
  delete(e) {
    let n = this.field(e.popLast())
    wd(n) && n.mapValue.fields && delete n.mapValue.fields[e.lastSegment()]
  }
  isEqual(e) {
    return ct(this.value, e.value)
  }
  getFieldsMap(e) {
    let n = this.value
    n.mapValue.fields || (n.mapValue = { fields: {} })
    for (let r = 0; r < e.length; ++r) {
      let i = n.mapValue.fields[e.get(r)]
      ;(wd(i) && i.mapValue.fields) ||
        ((i = { mapValue: { fields: {} } }), (n.mapValue.fields[e.get(r)] = i)),
        (n = i)
    }
    return n.mapValue.fields
  }
  applyChanges(e, n, r) {
    La(n, (i, s) => (e[i] = s))
    for (let i of r) delete e[i]
  }
  clone() {
    return new t(Li(this.value))
  }
}
var Ge = class t {
  constructor(e, n, r, i, s, o, a) {
    ;(this.key = e),
      (this.documentType = n),
      (this.version = r),
      (this.readTime = i),
      (this.createTime = s),
      (this.data = o),
      (this.documentState = a)
  }
  static newInvalidDocument(e) {
    return new t(e, 0, A.min(), A.min(), A.min(), Dt.empty(), 0)
  }
  static newFoundDocument(e, n, r, i) {
    return new t(e, 1, n, A.min(), r, i, 0)
  }
  static newNoDocument(e, n) {
    return new t(e, 2, n, A.min(), A.min(), Dt.empty(), 0)
  }
  static newUnknownDocument(e, n) {
    return new t(e, 3, n, A.min(), A.min(), Dt.empty(), 2)
  }
  convertToFoundDocument(e, n) {
    return (
      !this.createTime.isEqual(A.min()) ||
        (this.documentType !== 2 && this.documentType !== 0) ||
        (this.createTime = e),
      (this.version = e),
      (this.documentType = 1),
      (this.data = n),
      (this.documentState = 0),
      this
    )
  }
  convertToNoDocument(e) {
    return (
      (this.version = e),
      (this.documentType = 2),
      (this.data = Dt.empty()),
      (this.documentState = 0),
      this
    )
  }
  convertToUnknownDocument(e) {
    return (
      (this.version = e),
      (this.documentType = 3),
      (this.data = Dt.empty()),
      (this.documentState = 2),
      this
    )
  }
  setHasCommittedMutations() {
    return (this.documentState = 2), this
  }
  setHasLocalMutations() {
    return (this.documentState = 1), (this.version = A.min()), this
  }
  setReadTime(e) {
    return (this.readTime = e), this
  }
  get hasLocalMutations() {
    return this.documentState === 1
  }
  get hasCommittedMutations() {
    return this.documentState === 2
  }
  get hasPendingWrites() {
    return this.hasLocalMutations || this.hasCommittedMutations
  }
  isValidDocument() {
    return this.documentType !== 0
  }
  isFoundDocument() {
    return this.documentType === 1
  }
  isNoDocument() {
    return this.documentType === 2
  }
  isUnknownDocument() {
    return this.documentType === 3
  }
  isEqual(e) {
    return (
      e instanceof t &&
      this.key.isEqual(e.key) &&
      this.version.isEqual(e.version) &&
      this.documentType === e.documentType &&
      this.documentState === e.documentState &&
      this.data.isEqual(e.data)
    )
  }
  mutableCopy() {
    return new t(
      this.key,
      this.documentType,
      this.version,
      this.readTime,
      this.createTime,
      this.data.clone(),
      this.documentState
    )
  }
  toString() {
    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`
  }
}
var vr = class {
  constructor(e, n) {
    ;(this.position = e), (this.inclusive = n)
  }
}
function zv(t, e, n) {
  let r = 0
  for (let i = 0; i < t.position.length; i++) {
    let s = e[i],
      o = t.position[i]
    if (
      (s.field.isKeyField()
        ? (r = D.comparator(D.fromName(o.referenceValue), n.key))
        : (r = mr(o, n.data.field(s.field))),
      s.dir === 'desc' && (r *= -1),
      r !== 0)
    )
      break
  }
  return r
}
function Gv(t, e) {
  if (t === null) return e === null
  if (
    e === null ||
    t.inclusive !== e.inclusive ||
    t.position.length !== e.position.length
  )
    return !1
  for (let n = 0; n < t.position.length; n++)
    if (!ct(t.position[n], e.position[n])) return !1
  return !0
}
var _r = class {
  constructor(e, n = 'asc') {
    ;(this.field = e), (this.dir = n)
  }
}
function jS(t, e) {
  return t.dir === e.dir && t.field.isEqual(e.field)
}
var ma = class {},
  se = class t extends ma {
    constructor(e, n, r) {
      super(), (this.field = e), (this.op = n), (this.value = r)
    }
    static create(e, n, r) {
      return e.isKeyField()
        ? n === 'in' || n === 'not-in'
          ? this.createKeyFieldInFilter(e, n, r)
          : new qd(e, n, r)
        : n === 'array-contains'
          ? new Wd(e, r)
          : n === 'in'
            ? new Kd(e, r)
            : n === 'not-in'
              ? new Qd(e, r)
              : n === 'array-contains-any'
                ? new Yd(e, r)
                : new t(e, n, r)
    }
    static createKeyFieldInFilter(e, n, r) {
      return n === 'in' ? new zd(e, r) : new Gd(e, r)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return this.op === '!='
        ? n !== null && this.matchesComparison(mr(n, this.value))
        : n !== null &&
            bn(this.value) === bn(n) &&
            this.matchesComparison(mr(n, this.value))
    }
    matchesComparison(e) {
      switch (this.op) {
        case '<':
          return e < 0
        case '<=':
          return e <= 0
        case '==':
          return e === 0
        case '!=':
          return e !== 0
        case '>':
          return e > 0
        case '>=':
          return e >= 0
        default:
          return b()
      }
    }
    isInequality() {
      return ['<', '<=', '>', '>=', '!=', 'not-in'].indexOf(this.op) >= 0
    }
    getFlattenedFilters() {
      return [this]
    }
    getFilters() {
      return [this]
    }
  },
  ut = class t extends ma {
    constructor(e, n) {
      super(), (this.filters = e), (this.op = n), (this.ue = null)
    }
    static create(e, n) {
      return new t(e, n)
    }
    matches(e) {
      return v_(this)
        ? this.filters.find((n) => !n.matches(e)) === void 0
        : this.filters.find((n) => n.matches(e)) !== void 0
    }
    getFlattenedFilters() {
      return (
        this.ue !== null ||
          (this.ue = this.filters.reduce(
            (e, n) => e.concat(n.getFlattenedFilters()),
            []
          )),
        this.ue
      )
    }
    getFilters() {
      return Object.assign([], this.filters)
    }
  }
function v_(t) {
  return t.op === 'and'
}
function __(t) {
  return BS(t) && v_(t)
}
function BS(t) {
  for (let e of t.filters) if (e instanceof ut) return !1
  return !0
}
function Hd(t) {
  if (t instanceof se)
    return t.field.canonicalString() + t.op.toString() + yr(t.value)
  if (__(t)) return t.filters.map((e) => Hd(e)).join(',')
  {
    let e = t.filters.map((n) => Hd(n)).join(',')
    return `${t.op}(${e})`
  }
}
function I_(t, e) {
  return t instanceof se
    ? (function (r, i) {
        return (
          i instanceof se &&
          r.op === i.op &&
          r.field.isEqual(i.field) &&
          ct(r.value, i.value)
        )
      })(t, e)
    : t instanceof ut
      ? (function (r, i) {
          return i instanceof ut &&
            r.op === i.op &&
            r.filters.length === i.filters.length
            ? r.filters.reduce((s, o, a) => s && I_(o, i.filters[a]), !0)
            : !1
        })(t, e)
      : void b()
}
function E_(t) {
  return t instanceof se
    ? (function (n) {
        return `${n.field.canonicalString()} ${n.op} ${yr(n.value)}`
      })(t)
    : t instanceof ut
      ? (function (n) {
          return (
            n.op.toString() + ' {' + n.getFilters().map(E_).join(' ,') + '}'
          )
        })(t)
      : 'Filter'
}
var qd = class extends se {
    constructor(e, n, r) {
      super(e, n, r), (this.key = D.fromName(r.referenceValue))
    }
    matches(e) {
      let n = D.comparator(e.key, this.key)
      return this.matchesComparison(n)
    }
  },
  zd = class extends se {
    constructor(e, n) {
      super(e, 'in', n), (this.keys = w_('in', n))
    }
    matches(e) {
      return this.keys.some((n) => n.isEqual(e.key))
    }
  },
  Gd = class extends se {
    constructor(e, n) {
      super(e, 'not-in', n), (this.keys = w_('not-in', n))
    }
    matches(e) {
      return !this.keys.some((n) => n.isEqual(e.key))
    }
  }
function w_(t, e) {
  var n
  return (
    ((n = e.arrayValue) === null || n === void 0 ? void 0 : n.values) || []
  ).map((r) => D.fromName(r.referenceValue))
}
var Wd = class extends se {
    constructor(e, n) {
      super(e, 'array-contains', n)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return cf(n) && Hi(n.arrayValue, this.value)
    }
  },
  Kd = class extends se {
    constructor(e, n) {
      super(e, 'in', n)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return n !== null && Hi(this.value.arrayValue, n)
    }
  },
  Qd = class extends se {
    constructor(e, n) {
      super(e, 'not-in', n)
    }
    matches(e) {
      if (Hi(this.value.arrayValue, { nullValue: 'NULL_VALUE' })) return !1
      let n = e.data.field(this.field)
      return n !== null && !Hi(this.value.arrayValue, n)
    }
  },
  Yd = class extends se {
    constructor(e, n) {
      super(e, 'array-contains-any', n)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return (
        !(!cf(n) || !n.arrayValue.values) &&
        n.arrayValue.values.some((r) => Hi(this.value.arrayValue, r))
      )
    }
  }
var Jd = class {
  constructor(e, n = null, r = [], i = [], s = null, o = null, a = null) {
    ;(this.path = e),
      (this.collectionGroup = n),
      (this.orderBy = r),
      (this.filters = i),
      (this.limit = s),
      (this.startAt = o),
      (this.endAt = a),
      (this.ce = null)
  }
}
function Wv(t, e = null, n = [], r = [], i = null, s = null, o = null) {
  return new Jd(t, e, n, r, i, s, o)
}
function uf(t) {
  let e = F(t)
  if (e.ce === null) {
    let n = e.path.canonicalString()
    e.collectionGroup !== null && (n += '|cg:' + e.collectionGroup),
      (n += '|f:'),
      (n += e.filters.map((r) => Hd(r)).join(',')),
      (n += '|ob:'),
      (n += e.orderBy
        .map((r) =>
          (function (s) {
            return s.field.canonicalString() + s.dir
          })(r)
        )
        .join(',')),
      Fa(e.limit) || ((n += '|l:'), (n += e.limit)),
      e.startAt &&
        ((n += '|lb:'),
        (n += e.startAt.inclusive ? 'b:' : 'a:'),
        (n += e.startAt.position.map((r) => yr(r)).join(','))),
      e.endAt &&
        ((n += '|ub:'),
        (n += e.endAt.inclusive ? 'a:' : 'b:'),
        (n += e.endAt.position.map((r) => yr(r)).join(','))),
      (e.ce = n)
  }
  return e.ce
}
function lf(t, e) {
  if (t.limit !== e.limit || t.orderBy.length !== e.orderBy.length) return !1
  for (let n = 0; n < t.orderBy.length; n++)
    if (!jS(t.orderBy[n], e.orderBy[n])) return !1
  if (t.filters.length !== e.filters.length) return !1
  for (let n = 0; n < t.filters.length; n++)
    if (!I_(t.filters[n], e.filters[n])) return !1
  return (
    t.collectionGroup === e.collectionGroup &&
    !!t.path.isEqual(e.path) &&
    !!Gv(t.startAt, e.startAt) &&
    Gv(t.endAt, e.endAt)
  )
}
function Zd(t) {
  return (
    D.isDocumentKey(t.path) &&
    t.collectionGroup === null &&
    t.filters.length === 0
  )
}
var Ir = class {
  constructor(
    e,
    n = null,
    r = [],
    i = [],
    s = null,
    o = 'F',
    a = null,
    c = null
  ) {
    ;(this.path = e),
      (this.collectionGroup = n),
      (this.explicitOrderBy = r),
      (this.filters = i),
      (this.limit = s),
      (this.limitType = o),
      (this.startAt = a),
      (this.endAt = c),
      (this.le = null),
      (this.he = null),
      (this.Pe = null),
      this.startAt,
      this.endAt
  }
}
function $S(t, e, n, r, i, s, o, a) {
  return new Ir(t, e, n, r, i, s, o, a)
}
function df(t) {
  return new Ir(t)
}
function Kv(t) {
  return (
    t.filters.length === 0 &&
    t.limit === null &&
    t.startAt == null &&
    t.endAt == null &&
    (t.explicitOrderBy.length === 0 ||
      (t.explicitOrderBy.length === 1 &&
        t.explicitOrderBy[0].field.isKeyField()))
  )
}
function HS(t) {
  return t.collectionGroup !== null
}
function Vi(t) {
  let e = F(t)
  if (e.le === null) {
    e.le = []
    let n = new Set()
    for (let s of e.explicitOrderBy)
      e.le.push(s), n.add(s.field.canonicalString())
    let r =
      e.explicitOrderBy.length > 0
        ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir
        : 'asc'
    ;(function (o) {
      let a = new Ie(ze.comparator)
      return (
        o.filters.forEach((c) => {
          c.getFlattenedFilters().forEach((u) => {
            u.isInequality() && (a = a.add(u.field))
          })
        }),
        a
      )
    })(e).forEach((s) => {
      n.has(s.canonicalString()) || s.isKeyField() || e.le.push(new _r(s, r))
    }),
      n.has(ze.keyField().canonicalString()) ||
        e.le.push(new _r(ze.keyField(), r))
  }
  return e.le
}
function ot(t) {
  let e = F(t)
  return e.he || (e.he = qS(e, Vi(t))), e.he
}
function qS(t, e) {
  if (t.limitType === 'F')
    return Wv(
      t.path,
      t.collectionGroup,
      e,
      t.filters,
      t.limit,
      t.startAt,
      t.endAt
    )
  {
    e = e.map((i) => {
      let s = i.dir === 'desc' ? 'asc' : 'desc'
      return new _r(i.field, s)
    })
    let n = t.endAt ? new vr(t.endAt.position, t.endAt.inclusive) : null,
      r = t.startAt ? new vr(t.startAt.position, t.startAt.inclusive) : null
    return Wv(t.path, t.collectionGroup, e, t.filters, t.limit, n, r)
  }
}
function Xd(t, e, n) {
  return new Ir(
    t.path,
    t.collectionGroup,
    t.explicitOrderBy.slice(),
    t.filters.slice(),
    e,
    n,
    t.startAt,
    t.endAt
  )
}
function Va(t, e) {
  return lf(ot(t), ot(e)) && t.limitType === e.limitType
}
function D_(t) {
  return `${uf(ot(t))}|lt:${t.limitType}`
}
function or(t) {
  return `Query(target=${(function (n) {
    let r = n.path.canonicalString()
    return (
      n.collectionGroup !== null &&
        (r += ' collectionGroup=' + n.collectionGroup),
      n.filters.length > 0 &&
        (r += `, filters: [${n.filters.map((i) => E_(i)).join(', ')}]`),
      Fa(n.limit) || (r += ', limit: ' + n.limit),
      n.orderBy.length > 0 &&
        (r += `, orderBy: [${n.orderBy
          .map((i) =>
            (function (o) {
              return `${o.field.canonicalString()} (${o.dir})`
            })(i)
          )
          .join(', ')}]`),
      n.startAt &&
        ((r += ', startAt: '),
        (r += n.startAt.inclusive ? 'b:' : 'a:'),
        (r += n.startAt.position.map((i) => yr(i)).join(','))),
      n.endAt &&
        ((r += ', endAt: '),
        (r += n.endAt.inclusive ? 'a:' : 'b:'),
        (r += n.endAt.position.map((i) => yr(i)).join(','))),
      `Target(${r})`
    )
  })(ot(t))}; limitType=${t.limitType})`
}
function Ua(t, e) {
  return (
    e.isFoundDocument() &&
    (function (r, i) {
      let s = i.key.path
      return r.collectionGroup !== null
        ? i.key.hasCollectionId(r.collectionGroup) && r.path.isPrefixOf(s)
        : D.isDocumentKey(r.path)
          ? r.path.isEqual(s)
          : r.path.isImmediateParentOf(s)
    })(t, e) &&
    (function (r, i) {
      for (let s of Vi(r))
        if (!s.field.isKeyField() && i.data.field(s.field) === null) return !1
      return !0
    })(t, e) &&
    (function (r, i) {
      for (let s of r.filters) if (!s.matches(i)) return !1
      return !0
    })(t, e) &&
    (function (r, i) {
      return !(
        (r.startAt &&
          !(function (o, a, c) {
            let u = zv(o, a, c)
            return o.inclusive ? u <= 0 : u < 0
          })(r.startAt, Vi(r), i)) ||
        (r.endAt &&
          !(function (o, a, c) {
            let u = zv(o, a, c)
            return o.inclusive ? u >= 0 : u > 0
          })(r.endAt, Vi(r), i))
      )
    })(t, e)
  )
}
function zS(t) {
  return (
    t.collectionGroup ||
    (t.path.length % 2 == 1
      ? t.path.lastSegment()
      : t.path.get(t.path.length - 2))
  )
}
function T_(t) {
  return (e, n) => {
    let r = !1
    for (let i of Vi(t)) {
      let s = GS(i, e, n)
      if (s !== 0) return s
      r = r || i.field.isKeyField()
    }
    return 0
  }
}
function GS(t, e, n) {
  let r = t.field.isKeyField()
    ? D.comparator(e.key, n.key)
    : (function (s, o, a) {
        let c = o.data.field(s),
          u = a.data.field(s)
        return c !== null && u !== null ? mr(c, u) : b()
      })(t.field, e, n)
  switch (t.dir) {
    case 'asc':
      return r
    case 'desc':
      return -1 * r
    default:
      return b()
  }
}
var Ht = class {
  constructor(e, n) {
    ;(this.mapKeyFn = e),
      (this.equalsFn = n),
      (this.inner = {}),
      (this.innerSize = 0)
  }
  get(e) {
    let n = this.mapKeyFn(e),
      r = this.inner[n]
    if (r !== void 0) {
      for (let [i, s] of r) if (this.equalsFn(i, e)) return s
    }
  }
  has(e) {
    return this.get(e) !== void 0
  }
  set(e, n) {
    let r = this.mapKeyFn(e),
      i = this.inner[r]
    if (i === void 0) return (this.inner[r] = [[e, n]]), void this.innerSize++
    for (let s = 0; s < i.length; s++)
      if (this.equalsFn(i[s][0], e)) return void (i[s] = [e, n])
    i.push([e, n]), this.innerSize++
  }
  delete(e) {
    let n = this.mapKeyFn(e),
      r = this.inner[n]
    if (r === void 0) return !1
    for (let i = 0; i < r.length; i++)
      if (this.equalsFn(r[i][0], e))
        return (
          r.length === 1 ? delete this.inner[n] : r.splice(i, 1),
          this.innerSize--,
          !0
        )
    return !1
  }
  forEach(e) {
    La(this.inner, (n, r) => {
      for (let [i, s] of r) e(i, s)
    })
  }
  isEmpty() {
    return VS(this.inner)
  }
  size() {
    return this.innerSize
  }
}
var WS = new ee(D.comparator)
function qt() {
  return WS
}
var C_ = new ee(D.comparator)
function Fi(...t) {
  let e = C_
  for (let n of t) e = e.insert(n.key, n)
  return e
}
function KS(t) {
  let e = C_
  return t.forEach((n, r) => (e = e.insert(n, r.overlayedDocument))), e
}
function In() {
  return Ui()
}
function b_() {
  return Ui()
}
function Ui() {
  return new Ht(
    (t) => t.toString(),
    (t, e) => t.isEqual(e)
  )
}
var Hk = new ee(D.comparator),
  QS = new Ie(D.comparator)
function O(...t) {
  let e = QS
  for (let n of t) e = e.add(n)
  return e
}
var YS = new Ie(V)
function JS() {
  return YS
}
function ZS(t, e) {
  if (t.useProto3Json) {
    if (isNaN(e)) return { doubleValue: 'NaN' }
    if (e === 1 / 0) return { doubleValue: 'Infinity' }
    if (e === -1 / 0) return { doubleValue: '-Infinity' }
  }
  return { doubleValue: ha(e) ? '-0' : e }
}
function XS(t) {
  return { integerValue: '' + t }
}
var Er = class {
  constructor() {
    this._ = void 0
  }
}
function eN(t, e, n) {
  return t instanceof qi
    ? (function (i, s) {
        let o = {
          fields: {
            __type__: { stringValue: 'server_timestamp' },
            __local_write_time__: {
              timestampValue: { seconds: i.seconds, nanos: i.nanoseconds },
            },
          },
        }
        return (
          s && of(s) && (s = af(s)),
          s && (o.fields.__previous_value__ = s),
          { mapValue: o }
        )
      })(n, e)
    : t instanceof wr
      ? A_(t, e)
      : t instanceof Dr
        ? S_(t, e)
        : (function (i, s) {
            let o = nN(i, s),
              a = Qv(o) + Qv(i.Ie)
            return $d(o) && $d(i.Ie) ? XS(a) : ZS(i.serializer, a)
          })(t, e)
}
function tN(t, e, n) {
  return t instanceof wr ? A_(t, e) : t instanceof Dr ? S_(t, e) : n
}
function nN(t, e) {
  return t instanceof zi
    ? (function (r) {
        return (
          $d(r) ||
          (function (s) {
            return !!s && 'doubleValue' in s
          })(r)
        )
      })(e)
      ? e
      : { integerValue: 0 }
    : null
}
var qi = class extends Er {},
  wr = class extends Er {
    constructor(e) {
      super(), (this.elements = e)
    }
  }
function A_(t, e) {
  let n = N_(e)
  for (let r of t.elements) n.some((i) => ct(i, r)) || n.push(r)
  return { arrayValue: { values: n } }
}
var Dr = class extends Er {
  constructor(e) {
    super(), (this.elements = e)
  }
}
function S_(t, e) {
  let n = N_(e)
  for (let r of t.elements) n = n.filter((i) => !ct(i, r))
  return { arrayValue: { values: n } }
}
var zi = class extends Er {
  constructor(e, n) {
    super(), (this.serializer = e), (this.Ie = n)
  }
}
function Qv(t) {
  return J(t.integerValue || t.doubleValue)
}
function N_(t) {
  return cf(t) && t.arrayValue.values ? t.arrayValue.values.slice() : []
}
function rN(t, e) {
  return (
    t.field.isEqual(e.field) &&
    (function (r, i) {
      return (r instanceof wr && i instanceof wr) ||
        (r instanceof Dr && i instanceof Dr)
        ? gr(r.elements, i.elements, ct)
        : r instanceof zi && i instanceof zi
          ? ct(r.Ie, i.Ie)
          : r instanceof qi && i instanceof qi
    })(t.transform, e.transform)
  )
}
var ji = class t {
  constructor(e, n) {
    ;(this.updateTime = e), (this.exists = n)
  }
  static none() {
    return new t()
  }
  static exists(e) {
    return new t(void 0, e)
  }
  static updateTime(e) {
    return new t(e)
  }
  get isNone() {
    return this.updateTime === void 0 && this.exists === void 0
  }
  isEqual(e) {
    return (
      this.exists === e.exists &&
      (this.updateTime
        ? !!e.updateTime && this.updateTime.isEqual(e.updateTime)
        : !e.updateTime)
    )
  }
}
function aa(t, e) {
  return t.updateTime !== void 0
    ? e.isFoundDocument() && e.version.isEqual(t.updateTime)
    : t.exists === void 0 || t.exists === e.isFoundDocument()
}
var Gi = class {}
function R_(t, e) {
  if (!t.hasLocalMutations || (e && e.fields.length === 0)) return null
  if (e === null)
    return t.isNoDocument()
      ? new eh(t.key, ji.none())
      : new Wi(t.key, t.data, ji.none())
  {
    let n = t.data,
      r = Dt.empty(),
      i = new Ie(ze.comparator)
    for (let s of e.fields)
      if (!i.has(s)) {
        let o = n.field(s)
        o === null && s.length > 1 && ((s = s.popLast()), (o = n.field(s))),
          o === null ? r.delete(s) : r.set(s, o),
          (i = i.add(s))
      }
    return new Tr(t.key, r, new _n(i.toArray()), ji.none())
  }
}
function iN(t, e, n) {
  t instanceof Wi
    ? (function (i, s, o) {
        let a = i.value.clone(),
          c = Jv(i.fieldTransforms, s, o.transformResults)
        a.setAll(c),
          s.convertToFoundDocument(o.version, a).setHasCommittedMutations()
      })(t, e, n)
    : t instanceof Tr
      ? (function (i, s, o) {
          if (!aa(i.precondition, s))
            return void s.convertToUnknownDocument(o.version)
          let a = Jv(i.fieldTransforms, s, o.transformResults),
            c = s.data
          c.setAll(x_(i)),
            c.setAll(a),
            s.convertToFoundDocument(o.version, c).setHasCommittedMutations()
        })(t, e, n)
      : (function (i, s, o) {
          s.convertToNoDocument(o.version).setHasCommittedMutations()
        })(0, e, n)
}
function Bi(t, e, n, r) {
  return t instanceof Wi
    ? (function (s, o, a, c) {
        if (!aa(s.precondition, o)) return a
        let u = s.value.clone(),
          l = Zv(s.fieldTransforms, c, o)
        return (
          u.setAll(l),
          o.convertToFoundDocument(o.version, u).setHasLocalMutations(),
          null
        )
      })(t, e, n, r)
    : t instanceof Tr
      ? (function (s, o, a, c) {
          if (!aa(s.precondition, o)) return a
          let u = Zv(s.fieldTransforms, c, o),
            l = o.data
          return (
            l.setAll(x_(s)),
            l.setAll(u),
            o.convertToFoundDocument(o.version, l).setHasLocalMutations(),
            a === null
              ? null
              : a
                  .unionWith(s.fieldMask.fields)
                  .unionWith(s.fieldTransforms.map((d) => d.field))
          )
        })(t, e, n, r)
      : (function (s, o, a) {
          return aa(s.precondition, o)
            ? (o.convertToNoDocument(o.version).setHasLocalMutations(), null)
            : a
        })(t, e, n)
}
function Yv(t, e) {
  return (
    t.type === e.type &&
    !!t.key.isEqual(e.key) &&
    !!t.precondition.isEqual(e.precondition) &&
    !!(function (r, i) {
      return (
        (r === void 0 && i === void 0) ||
        (!(!r || !i) && gr(r, i, (s, o) => rN(s, o)))
      )
    })(t.fieldTransforms, e.fieldTransforms) &&
    (t.type === 0
      ? t.value.isEqual(e.value)
      : t.type !== 1 ||
        (t.data.isEqual(e.data) && t.fieldMask.isEqual(e.fieldMask)))
  )
}
var Wi = class extends Gi {
    constructor(e, n, r, i = []) {
      super(),
        (this.key = e),
        (this.value = n),
        (this.precondition = r),
        (this.fieldTransforms = i),
        (this.type = 0)
    }
    getFieldMask() {
      return null
    }
  },
  Tr = class extends Gi {
    constructor(e, n, r, i, s = []) {
      super(),
        (this.key = e),
        (this.data = n),
        (this.fieldMask = r),
        (this.precondition = i),
        (this.fieldTransforms = s),
        (this.type = 1)
    }
    getFieldMask() {
      return this.fieldMask
    }
  }
function x_(t) {
  let e = new Map()
  return (
    t.fieldMask.fields.forEach((n) => {
      if (!n.isEmpty()) {
        let r = t.data.field(n)
        e.set(n, r)
      }
    }),
    e
  )
}
function Jv(t, e, n) {
  let r = new Map()
  ie(t.length === n.length)
  for (let i = 0; i < n.length; i++) {
    let s = t[i],
      o = s.transform,
      a = e.data.field(s.field)
    r.set(s.field, tN(o, a, n[i]))
  }
  return r
}
function Zv(t, e, n) {
  let r = new Map()
  for (let i of t) {
    let s = i.transform,
      o = n.data.field(i.field)
    r.set(i.field, eN(s, o, e))
  }
  return r
}
var eh = class extends Gi {
  constructor(e, n) {
    super(),
      (this.key = e),
      (this.precondition = n),
      (this.type = 2),
      (this.fieldTransforms = [])
  }
  getFieldMask() {
    return null
  }
}
var th = class {
  constructor(e, n, r, i) {
    ;(this.batchId = e),
      (this.localWriteTime = n),
      (this.baseMutations = r),
      (this.mutations = i)
  }
  applyToRemoteDocument(e, n) {
    let r = n.mutationResults
    for (let i = 0; i < this.mutations.length; i++) {
      let s = this.mutations[i]
      s.key.isEqual(e.key) && iN(s, e, r[i])
    }
  }
  applyToLocalView(e, n) {
    for (let r of this.baseMutations)
      r.key.isEqual(e.key) && (n = Bi(r, e, n, this.localWriteTime))
    for (let r of this.mutations)
      r.key.isEqual(e.key) && (n = Bi(r, e, n, this.localWriteTime))
    return n
  }
  applyToLocalDocumentSet(e, n) {
    let r = b_()
    return (
      this.mutations.forEach((i) => {
        let s = e.get(i.key),
          o = s.overlayedDocument,
          a = this.applyToLocalView(o, s.mutatedFields)
        a = n.has(i.key) ? null : a
        let c = R_(o, a)
        c !== null && r.set(i.key, c),
          o.isValidDocument() || o.convertToNoDocument(A.min())
      }),
      r
    )
  }
  keys() {
    return this.mutations.reduce((e, n) => e.add(n.key), O())
  }
  isEqual(e) {
    return (
      this.batchId === e.batchId &&
      gr(this.mutations, e.mutations, (n, r) => Yv(n, r)) &&
      gr(this.baseMutations, e.baseMutations, (n, r) => Yv(n, r))
    )
  }
}
var nh = class {
  constructor(e, n) {
    ;(this.largestBatchId = e), (this.mutation = n)
  }
  getKey() {
    return this.mutation.key
  }
  isEqual(e) {
    return e !== null && this.mutation === e.mutation
  }
  toString() {
    return `Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`
  }
}
var rh = class {
  constructor(e, n) {
    ;(this.count = e), (this.unchangedNames = n)
  }
}
var te, M
function M_(t) {
  if (t === void 0) return at('GRPC error has no .code'), m.UNKNOWN
  switch (t) {
    case te.OK:
      return m.OK
    case te.CANCELLED:
      return m.CANCELLED
    case te.UNKNOWN:
      return m.UNKNOWN
    case te.DEADLINE_EXCEEDED:
      return m.DEADLINE_EXCEEDED
    case te.RESOURCE_EXHAUSTED:
      return m.RESOURCE_EXHAUSTED
    case te.INTERNAL:
      return m.INTERNAL
    case te.UNAVAILABLE:
      return m.UNAVAILABLE
    case te.UNAUTHENTICATED:
      return m.UNAUTHENTICATED
    case te.INVALID_ARGUMENT:
      return m.INVALID_ARGUMENT
    case te.NOT_FOUND:
      return m.NOT_FOUND
    case te.ALREADY_EXISTS:
      return m.ALREADY_EXISTS
    case te.PERMISSION_DENIED:
      return m.PERMISSION_DENIED
    case te.FAILED_PRECONDITION:
      return m.FAILED_PRECONDITION
    case te.ABORTED:
      return m.ABORTED
    case te.OUT_OF_RANGE:
      return m.OUT_OF_RANGE
    case te.UNIMPLEMENTED:
      return m.UNIMPLEMENTED
    case te.DATA_LOSS:
      return m.DATA_LOSS
    default:
      return b()
  }
}
;((M = te || (te = {}))[(M.OK = 0)] = 'OK'),
  (M[(M.CANCELLED = 1)] = 'CANCELLED'),
  (M[(M.UNKNOWN = 2)] = 'UNKNOWN'),
  (M[(M.INVALID_ARGUMENT = 3)] = 'INVALID_ARGUMENT'),
  (M[(M.DEADLINE_EXCEEDED = 4)] = 'DEADLINE_EXCEEDED'),
  (M[(M.NOT_FOUND = 5)] = 'NOT_FOUND'),
  (M[(M.ALREADY_EXISTS = 6)] = 'ALREADY_EXISTS'),
  (M[(M.PERMISSION_DENIED = 7)] = 'PERMISSION_DENIED'),
  (M[(M.UNAUTHENTICATED = 16)] = 'UNAUTHENTICATED'),
  (M[(M.RESOURCE_EXHAUSTED = 8)] = 'RESOURCE_EXHAUSTED'),
  (M[(M.FAILED_PRECONDITION = 9)] = 'FAILED_PRECONDITION'),
  (M[(M.ABORTED = 10)] = 'ABORTED'),
  (M[(M.OUT_OF_RANGE = 11)] = 'OUT_OF_RANGE'),
  (M[(M.UNIMPLEMENTED = 12)] = 'UNIMPLEMENTED'),
  (M[(M.INTERNAL = 13)] = 'INTERNAL'),
  (M[(M.UNAVAILABLE = 14)] = 'UNAVAILABLE'),
  (M[(M.DATA_LOSS = 15)] = 'DATA_LOSS')
var Xv = null
function sN() {
  return new TextEncoder()
}
var oN = new yn([4294967295, 4294967295], 0)
function e_(t) {
  let e = sN().encode(t),
    n = new Vv()
  return n.update(e), new Uint8Array(n.digest())
}
function t_(t) {
  let e = new DataView(t.buffer),
    n = e.getUint32(0, !0),
    r = e.getUint32(4, !0),
    i = e.getUint32(8, !0),
    s = e.getUint32(12, !0)
  return [new yn([n, r], 0), new yn([i, s], 0)]
}
var ih = class t {
    constructor(e, n, r) {
      if (
        ((this.bitmap = e),
        (this.padding = n),
        (this.hashCount = r),
        n < 0 || n >= 8)
      )
        throw new En(`Invalid padding: ${n}`)
      if (r < 0) throw new En(`Invalid hash count: ${r}`)
      if (e.length > 0 && this.hashCount === 0)
        throw new En(`Invalid hash count: ${r}`)
      if (e.length === 0 && n !== 0)
        throw new En(`Invalid padding when bitmap length is 0: ${n}`)
      ;(this.Te = 8 * e.length - n), (this.Ee = yn.fromNumber(this.Te))
    }
    de(e, n, r) {
      let i = e.add(n.multiply(yn.fromNumber(r)))
      return (
        i.compare(oN) === 1 && (i = new yn([i.getBits(0), i.getBits(1)], 0)),
        i.modulo(this.Ee).toNumber()
      )
    }
    Ae(e) {
      return (this.bitmap[Math.floor(e / 8)] & (1 << e % 8)) != 0
    }
    mightContain(e) {
      if (this.Te === 0) return !1
      let n = e_(e),
        [r, i] = t_(n)
      for (let s = 0; s < this.hashCount; s++) {
        let o = this.de(r, i, s)
        if (!this.Ae(o)) return !1
      }
      return !0
    }
    static create(e, n, r) {
      let i = e % 8 == 0 ? 0 : 8 - (e % 8),
        s = new Uint8Array(Math.ceil(e / 8)),
        o = new t(s, i, n)
      return r.forEach((a) => o.insert(a)), o
    }
    insert(e) {
      if (this.Te === 0) return
      let n = e_(e),
        [r, i] = t_(n)
      for (let s = 0; s < this.hashCount; s++) {
        let o = this.de(r, i, s)
        this.Re(o)
      }
    }
    Re(e) {
      let n = Math.floor(e / 8),
        r = e % 8
      this.bitmap[n] |= 1 << r
    }
  },
  En = class extends Error {
    constructor() {
      super(...arguments), (this.name = 'BloomFilterError')
    }
  }
var ya = class t {
    constructor(e, n, r, i, s) {
      ;(this.snapshotVersion = e),
        (this.targetChanges = n),
        (this.targetMismatches = r),
        (this.documentUpdates = i),
        (this.resolvedLimboDocuments = s)
    }
    static createSynthesizedRemoteEventForCurrentChange(e, n, r) {
      let i = new Map()
      return (
        i.set(e, Ki.createSynthesizedTargetChangeForCurrentChange(e, n, r)),
        new t(A.min(), i, new ee(V), qt(), O())
      )
    }
  },
  Ki = class t {
    constructor(e, n, r, i, s) {
      ;(this.resumeToken = e),
        (this.current = n),
        (this.addedDocuments = r),
        (this.modifiedDocuments = i),
        (this.removedDocuments = s)
    }
    static createSynthesizedTargetChangeForCurrentChange(e, n, r) {
      return new t(r, n, O(), O(), O())
    }
  }
var lr = class {
    constructor(e, n, r, i) {
      ;(this.Ve = e), (this.removedTargetIds = n), (this.key = r), (this.me = i)
    }
  },
  va = class {
    constructor(e, n) {
      ;(this.targetId = e), (this.fe = n)
    }
  },
  _a = class {
    constructor(e, n, r = we.EMPTY_BYTE_STRING, i = null) {
      ;(this.state = e),
        (this.targetIds = n),
        (this.resumeToken = r),
        (this.cause = i)
    }
  },
  Ia = class {
    constructor() {
      ;(this.ge = 0),
        (this.pe = r_()),
        (this.ye = we.EMPTY_BYTE_STRING),
        (this.we = !1),
        (this.Se = !0)
    }
    get current() {
      return this.we
    }
    get resumeToken() {
      return this.ye
    }
    get be() {
      return this.ge !== 0
    }
    get De() {
      return this.Se
    }
    Ce(e) {
      e.approximateByteSize() > 0 && ((this.Se = !0), (this.ye = e))
    }
    ve() {
      let e = O(),
        n = O(),
        r = O()
      return (
        this.pe.forEach((i, s) => {
          switch (s) {
            case 0:
              e = e.add(i)
              break
            case 2:
              n = n.add(i)
              break
            case 1:
              r = r.add(i)
              break
            default:
              b()
          }
        }),
        new Ki(this.ye, this.we, e, n, r)
      )
    }
    Fe() {
      ;(this.Se = !1), (this.pe = r_())
    }
    Me(e, n) {
      ;(this.Se = !0), (this.pe = this.pe.insert(e, n))
    }
    xe(e) {
      ;(this.Se = !0), (this.pe = this.pe.remove(e))
    }
    Oe() {
      this.ge += 1
    }
    Ne() {
      ;(this.ge -= 1), ie(this.ge >= 0)
    }
    Be() {
      ;(this.Se = !0), (this.we = !0)
    }
  },
  sh = class {
    constructor(e) {
      ;(this.Le = e),
        (this.ke = new Map()),
        (this.qe = qt()),
        (this.Qe = n_()),
        (this.Ke = new ee(V))
    }
    $e(e) {
      for (let n of e.Ve)
        e.me && e.me.isFoundDocument()
          ? this.Ue(n, e.me)
          : this.We(n, e.key, e.me)
      for (let n of e.removedTargetIds) this.We(n, e.key, e.me)
    }
    Ge(e) {
      this.forEachTarget(e, (n) => {
        let r = this.ze(n)
        switch (e.state) {
          case 0:
            this.je(n) && r.Ce(e.resumeToken)
            break
          case 1:
            r.Ne(), r.be || r.Fe(), r.Ce(e.resumeToken)
            break
          case 2:
            r.Ne(), r.be || this.removeTarget(n)
            break
          case 3:
            this.je(n) && (r.Be(), r.Ce(e.resumeToken))
            break
          case 4:
            this.je(n) && (this.He(n), r.Ce(e.resumeToken))
            break
          default:
            b()
        }
      })
    }
    forEachTarget(e, n) {
      e.targetIds.length > 0
        ? e.targetIds.forEach(n)
        : this.ke.forEach((r, i) => {
            this.je(i) && n(i)
          })
    }
    Je(e) {
      let n = e.targetId,
        r = e.fe.count,
        i = this.Ye(n)
      if (i) {
        let s = i.target
        if (Zd(s))
          if (r === 0) {
            let o = new D(s.path)
            this.We(n, o, Ge.newNoDocument(o, A.min()))
          } else ie(r === 1)
        else {
          let o = this.Ze(n)
          if (o !== r) {
            let a = this.Xe(e),
              c = a ? this.et(a, e, o) : 1
            if (c !== 0) {
              this.He(n)
              let u =
                c === 2
                  ? 'TargetPurposeExistenceFilterMismatchBloom'
                  : 'TargetPurposeExistenceFilterMismatch'
              this.Ke = this.Ke.insert(n, u)
            }
            Xv?.tt(
              (function (l, d, h, f, _) {
                var w, I, P, L, z, B
                let Z = {
                    localCacheCount: l,
                    existenceFilterCount: d.count,
                    databaseId: h.database,
                    projectId: h.projectId,
                  },
                  $ = d.unchangedNames
                return (
                  $ &&
                    (Z.bloomFilter = {
                      applied: _ === 0,
                      hashCount:
                        (w = $?.hashCount) !== null && w !== void 0 ? w : 0,
                      bitmapLength:
                        (L =
                          (P =
                            (I = $?.bits) === null || I === void 0
                              ? void 0
                              : I.bitmap) === null || P === void 0
                            ? void 0
                            : P.length) !== null && L !== void 0
                          ? L
                          : 0,
                      padding:
                        (B =
                          (z = $?.bits) === null || z === void 0
                            ? void 0
                            : z.padding) !== null && B !== void 0
                          ? B
                          : 0,
                      mightContain: (Te) => {
                        var Ct
                        return (
                          (Ct = f?.mightContain(Te)) !== null &&
                          Ct !== void 0 &&
                          Ct
                        )
                      },
                    }),
                  Z
                )
              })(o, e.fe, this.Le.nt(), a, c)
            )
          }
        }
      }
    }
    Xe(e) {
      let n = e.fe.unchangedNames
      if (!n || !n.bits) return null
      let {
          bits: { bitmap: r = '', padding: i = 0 },
          hashCount: s = 0,
        } = n,
        o,
        a
      try {
        o = $t(r).toUint8Array()
      } catch (c) {
        if (c instanceof pa)
          return (
            pr(
              'Decoding the base64 bloom filter in existence filter failed (' +
                c.message +
                '); ignoring the bloom filter and falling back to full re-query.'
            ),
            null
          )
        throw c
      }
      try {
        a = new ih(o, i, s)
      } catch (c) {
        return (
          pr(
            c instanceof En
              ? 'BloomFilter error: '
              : 'Applying bloom filter failed: ',
            c
          ),
          null
        )
      }
      return a.Te === 0 ? null : a
    }
    et(e, n, r) {
      return n.fe.count === r - this.rt(e, n.targetId) ? 0 : 2
    }
    rt(e, n) {
      let r = this.Le.getRemoteKeysForTarget(n),
        i = 0
      return (
        r.forEach((s) => {
          let o = this.Le.nt(),
            a = `projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`
          e.mightContain(a) || (this.We(n, s, null), i++)
        }),
        i
      )
    }
    it(e) {
      let n = new Map()
      this.ke.forEach((s, o) => {
        let a = this.Ye(o)
        if (a) {
          if (s.current && Zd(a.target)) {
            let c = new D(a.target.path)
            this.qe.get(c) !== null ||
              this.st(o, c) ||
              this.We(o, c, Ge.newNoDocument(c, e))
          }
          s.De && (n.set(o, s.ve()), s.Fe())
        }
      })
      let r = O()
      this.Qe.forEach((s, o) => {
        let a = !0
        o.forEachWhile((c) => {
          let u = this.Ye(c)
          return (
            !u || u.purpose === 'TargetPurposeLimboResolution' || ((a = !1), !1)
          )
        }),
          a && (r = r.add(s))
      }),
        this.qe.forEach((s, o) => o.setReadTime(e))
      let i = new ya(e, n, this.Ke, this.qe, r)
      return (this.qe = qt()), (this.Qe = n_()), (this.Ke = new ee(V)), i
    }
    Ue(e, n) {
      if (!this.je(e)) return
      let r = this.st(e, n.key) ? 2 : 0
      this.ze(e).Me(n.key, r),
        (this.qe = this.qe.insert(n.key, n)),
        (this.Qe = this.Qe.insert(n.key, this.ot(n.key).add(e)))
    }
    We(e, n, r) {
      if (!this.je(e)) return
      let i = this.ze(e)
      this.st(e, n) ? i.Me(n, 1) : i.xe(n),
        (this.Qe = this.Qe.insert(n, this.ot(n).delete(e))),
        r && (this.qe = this.qe.insert(n, r))
    }
    removeTarget(e) {
      this.ke.delete(e)
    }
    Ze(e) {
      let n = this.ze(e).ve()
      return (
        this.Le.getRemoteKeysForTarget(e).size +
        n.addedDocuments.size -
        n.removedDocuments.size
      )
    }
    Oe(e) {
      this.ze(e).Oe()
    }
    ze(e) {
      let n = this.ke.get(e)
      return n || ((n = new Ia()), this.ke.set(e, n)), n
    }
    ot(e) {
      let n = this.Qe.get(e)
      return n || ((n = new Ie(V)), (this.Qe = this.Qe.insert(e, n))), n
    }
    je(e) {
      let n = this.Ye(e) !== null
      return n || v('WatchChangeAggregator', 'Detected inactive target', e), n
    }
    Ye(e) {
      let n = this.ke.get(e)
      return n && n.be ? null : this.Le._t(e)
    }
    He(e) {
      this.ke.set(e, new Ia()),
        this.Le.getRemoteKeysForTarget(e).forEach((n) => {
          this.We(e, n, null)
        })
    }
    st(e, n) {
      return this.Le.getRemoteKeysForTarget(e).has(n)
    }
  }
function n_() {
  return new ee(D.comparator)
}
function r_() {
  return new ee(D.comparator)
}
var aN = { asc: 'ASCENDING', desc: 'DESCENDING' },
  cN = {
    '<': 'LESS_THAN',
    '<=': 'LESS_THAN_OR_EQUAL',
    '>': 'GREATER_THAN',
    '>=': 'GREATER_THAN_OR_EQUAL',
    '==': 'EQUAL',
    '!=': 'NOT_EQUAL',
    'array-contains': 'ARRAY_CONTAINS',
    in: 'IN',
    'not-in': 'NOT_IN',
    'array-contains-any': 'ARRAY_CONTAINS_ANY',
  },
  uN = { and: 'AND', or: 'OR' },
  oh = class {
    constructor(e, n) {
      ;(this.databaseId = e), (this.useProto3Json = n)
    }
  }
function ah(t, e) {
  return t.useProto3Json || Fa(e) ? e : { value: e }
}
function lN(t, e) {
  return t.useProto3Json
    ? `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, '').replace('Z', '')}.${('000000000' + e.nanoseconds).slice(-9)}Z`
    : { seconds: '' + e.seconds, nanos: e.nanoseconds }
}
function dN(t, e) {
  return t.useProto3Json ? e.toBase64() : e.toUint8Array()
}
function dr(t) {
  return (
    ie(!!t),
    A.fromTimestamp(
      (function (n) {
        let r = Bt(n)
        return new Me(r.seconds, r.nanos)
      })(t)
    )
  )
}
function hN(t, e) {
  return ch(t, e).canonicalString()
}
function ch(t, e) {
  let n = (function (i) {
    return new re(['projects', i.projectId, 'databases', i.database])
  })(t).child('documents')
  return e === void 0 ? n : n.child(e)
}
function P_(t) {
  let e = re.fromString(t)
  return ie(V_(e)), e
}
function Dd(t, e) {
  let n = P_(e)
  if (n.get(1) !== t.databaseId.projectId)
    throw new E(
      m.INVALID_ARGUMENT,
      'Tried to deserialize key from different project: ' +
        n.get(1) +
        ' vs ' +
        t.databaseId.projectId
    )
  if (n.get(3) !== t.databaseId.database)
    throw new E(
      m.INVALID_ARGUMENT,
      'Tried to deserialize key from different database: ' +
        n.get(3) +
        ' vs ' +
        t.databaseId.database
    )
  return new D(k_(n))
}
function O_(t, e) {
  return hN(t.databaseId, e)
}
function fN(t) {
  let e = P_(t)
  return e.length === 4 ? re.emptyPath() : k_(e)
}
function i_(t) {
  return new re([
    'projects',
    t.databaseId.projectId,
    'databases',
    t.databaseId.database,
  ]).canonicalString()
}
function k_(t) {
  return ie(t.length > 4 && t.get(4) === 'documents'), t.popFirst(5)
}
function pN(t, e) {
  let n
  if ('targetChange' in e) {
    e.targetChange
    let r = (function (u) {
        return u === 'NO_CHANGE'
          ? 0
          : u === 'ADD'
            ? 1
            : u === 'REMOVE'
              ? 2
              : u === 'CURRENT'
                ? 3
                : u === 'RESET'
                  ? 4
                  : b()
      })(e.targetChange.targetChangeType || 'NO_CHANGE'),
      i = e.targetChange.targetIds || [],
      s = (function (u, l) {
        return u.useProto3Json
          ? (ie(l === void 0 || typeof l == 'string'),
            we.fromBase64String(l || ''))
          : (ie(l === void 0 || l instanceof Uint8Array),
            we.fromUint8Array(l || new Uint8Array()))
      })(t, e.targetChange.resumeToken),
      o = e.targetChange.cause,
      a =
        o &&
        (function (u) {
          let l = u.code === void 0 ? m.UNKNOWN : M_(u.code)
          return new E(l, u.message || '')
        })(o)
    n = new _a(r, i, s, a || null)
  } else if ('documentChange' in e) {
    e.documentChange
    let r = e.documentChange
    r.document, r.document.name, r.document.updateTime
    let i = Dd(t, r.document.name),
      s = dr(r.document.updateTime),
      o = r.document.createTime ? dr(r.document.createTime) : A.min(),
      a = new Dt({ mapValue: { fields: r.document.fields } }),
      c = Ge.newFoundDocument(i, s, o, a),
      u = r.targetIds || [],
      l = r.removedTargetIds || []
    n = new lr(u, l, c.key, c)
  } else if ('documentDelete' in e) {
    e.documentDelete
    let r = e.documentDelete
    r.document
    let i = Dd(t, r.document),
      s = r.readTime ? dr(r.readTime) : A.min(),
      o = Ge.newNoDocument(i, s),
      a = r.removedTargetIds || []
    n = new lr([], a, o.key, o)
  } else if ('documentRemove' in e) {
    e.documentRemove
    let r = e.documentRemove
    r.document
    let i = Dd(t, r.document),
      s = r.removedTargetIds || []
    n = new lr([], s, i, null)
  } else {
    if (!('filter' in e)) return b()
    {
      e.filter
      let r = e.filter
      r.targetId
      let { count: i = 0, unchangedNames: s } = r,
        o = new rh(i, s),
        a = r.targetId
      n = new va(a, o)
    }
  }
  return n
}
function gN(t, e) {
  return { documents: [O_(t, e.path)] }
}
function mN(t, e) {
  let n = { structuredQuery: {} },
    r = e.path,
    i
  e.collectionGroup !== null
    ? ((i = r),
      (n.structuredQuery.from = [
        { collectionId: e.collectionGroup, allDescendants: !0 },
      ]))
    : ((i = r.popLast()),
      (n.structuredQuery.from = [{ collectionId: r.lastSegment() }])),
    (n.parent = O_(t, i))
  let s = (function (u) {
    if (u.length !== 0) return L_(ut.create(u, 'and'))
  })(e.filters)
  s && (n.structuredQuery.where = s)
  let o = (function (u) {
    if (u.length !== 0)
      return u.map((l) =>
        (function (h) {
          return { field: ar(h.field), direction: _N(h.dir) }
        })(l)
      )
  })(e.orderBy)
  o && (n.structuredQuery.orderBy = o)
  let a = ah(t, e.limit)
  return (
    a !== null && (n.structuredQuery.limit = a),
    e.startAt &&
      (n.structuredQuery.startAt = (function (u) {
        return { before: u.inclusive, values: u.position }
      })(e.startAt)),
    e.endAt &&
      (n.structuredQuery.endAt = (function (u) {
        return { before: !u.inclusive, values: u.position }
      })(e.endAt)),
    { ut: n, parent: i }
  )
}
function yN(t) {
  let e = fN(t.parent),
    n = t.structuredQuery,
    r = n.from ? n.from.length : 0,
    i = null
  if (r > 0) {
    ie(r === 1)
    let l = n.from[0]
    l.allDescendants ? (i = l.collectionId) : (e = e.child(l.collectionId))
  }
  let s = []
  n.where &&
    (s = (function (d) {
      let h = F_(d)
      return h instanceof ut && __(h) ? h.getFilters() : [h]
    })(n.where))
  let o = []
  n.orderBy &&
    (o = (function (d) {
      return d.map((h) =>
        (function (_) {
          return new _r(
            cr(_.field),
            (function (I) {
              switch (I) {
                case 'ASCENDING':
                  return 'asc'
                case 'DESCENDING':
                  return 'desc'
                default:
                  return
              }
            })(_.direction)
          )
        })(h)
      )
    })(n.orderBy))
  let a = null
  n.limit &&
    (a = (function (d) {
      let h
      return (h = typeof d == 'object' ? d.value : d), Fa(h) ? null : h
    })(n.limit))
  let c = null
  n.startAt &&
    (c = (function (d) {
      let h = !!d.before,
        f = d.values || []
      return new vr(f, h)
    })(n.startAt))
  let u = null
  return (
    n.endAt &&
      (u = (function (d) {
        let h = !d.before,
          f = d.values || []
        return new vr(f, h)
      })(n.endAt)),
    $S(e, i, o, s, a, 'F', c, u)
  )
}
function vN(t, e) {
  let n = (function (i) {
    switch (i) {
      case 'TargetPurposeListen':
        return null
      case 'TargetPurposeExistenceFilterMismatch':
        return 'existence-filter-mismatch'
      case 'TargetPurposeExistenceFilterMismatchBloom':
        return 'existence-filter-mismatch-bloom'
      case 'TargetPurposeLimboResolution':
        return 'limbo-document'
      default:
        return b()
    }
  })(e.purpose)
  return n == null ? null : { 'goog-listen-tags': n }
}
function F_(t) {
  return t.unaryFilter !== void 0
    ? (function (n) {
        switch (n.unaryFilter.op) {
          case 'IS_NAN':
            let r = cr(n.unaryFilter.field)
            return se.create(r, '==', { doubleValue: NaN })
          case 'IS_NULL':
            let i = cr(n.unaryFilter.field)
            return se.create(i, '==', { nullValue: 'NULL_VALUE' })
          case 'IS_NOT_NAN':
            let s = cr(n.unaryFilter.field)
            return se.create(s, '!=', { doubleValue: NaN })
          case 'IS_NOT_NULL':
            let o = cr(n.unaryFilter.field)
            return se.create(o, '!=', { nullValue: 'NULL_VALUE' })
          default:
            return b()
        }
      })(t)
    : t.fieldFilter !== void 0
      ? (function (n) {
          return se.create(
            cr(n.fieldFilter.field),
            (function (i) {
              switch (i) {
                case 'EQUAL':
                  return '=='
                case 'NOT_EQUAL':
                  return '!='
                case 'GREATER_THAN':
                  return '>'
                case 'GREATER_THAN_OR_EQUAL':
                  return '>='
                case 'LESS_THAN':
                  return '<'
                case 'LESS_THAN_OR_EQUAL':
                  return '<='
                case 'ARRAY_CONTAINS':
                  return 'array-contains'
                case 'IN':
                  return 'in'
                case 'NOT_IN':
                  return 'not-in'
                case 'ARRAY_CONTAINS_ANY':
                  return 'array-contains-any'
                default:
                  return b()
              }
            })(n.fieldFilter.op),
            n.fieldFilter.value
          )
        })(t)
      : t.compositeFilter !== void 0
        ? (function (n) {
            return ut.create(
              n.compositeFilter.filters.map((r) => F_(r)),
              (function (i) {
                switch (i) {
                  case 'AND':
                    return 'and'
                  case 'OR':
                    return 'or'
                  default:
                    return b()
                }
              })(n.compositeFilter.op)
            )
          })(t)
        : b()
}
function _N(t) {
  return aN[t]
}
function IN(t) {
  return cN[t]
}
function EN(t) {
  return uN[t]
}
function ar(t) {
  return { fieldPath: t.canonicalString() }
}
function cr(t) {
  return ze.fromServerFormat(t.fieldPath)
}
function L_(t) {
  return t instanceof se
    ? (function (n) {
        if (n.op === '==') {
          if (qv(n.value))
            return { unaryFilter: { field: ar(n.field), op: 'IS_NAN' } }
          if (Hv(n.value))
            return { unaryFilter: { field: ar(n.field), op: 'IS_NULL' } }
        } else if (n.op === '!=') {
          if (qv(n.value))
            return { unaryFilter: { field: ar(n.field), op: 'IS_NOT_NAN' } }
          if (Hv(n.value))
            return { unaryFilter: { field: ar(n.field), op: 'IS_NOT_NULL' } }
        }
        return {
          fieldFilter: { field: ar(n.field), op: IN(n.op), value: n.value },
        }
      })(t)
    : t instanceof ut
      ? (function (n) {
          let r = n.getFilters().map((i) => L_(i))
          return r.length === 1
            ? r[0]
            : { compositeFilter: { op: EN(n.op), filters: r } }
        })(t)
      : b()
}
function V_(t) {
  return t.length >= 4 && t.get(0) === 'projects' && t.get(2) === 'databases'
}
var Qi = class t {
  constructor(
    e,
    n,
    r,
    i,
    s = A.min(),
    o = A.min(),
    a = we.EMPTY_BYTE_STRING,
    c = null
  ) {
    ;(this.target = e),
      (this.targetId = n),
      (this.purpose = r),
      (this.sequenceNumber = i),
      (this.snapshotVersion = s),
      (this.lastLimboFreeSnapshotVersion = o),
      (this.resumeToken = a),
      (this.expectedCount = c)
  }
  withSequenceNumber(e) {
    return new t(
      this.target,
      this.targetId,
      this.purpose,
      e,
      this.snapshotVersion,
      this.lastLimboFreeSnapshotVersion,
      this.resumeToken,
      this.expectedCount
    )
  }
  withResumeToken(e, n) {
    return new t(
      this.target,
      this.targetId,
      this.purpose,
      this.sequenceNumber,
      n,
      this.lastLimboFreeSnapshotVersion,
      e,
      null
    )
  }
  withExpectedCount(e) {
    return new t(
      this.target,
      this.targetId,
      this.purpose,
      this.sequenceNumber,
      this.snapshotVersion,
      this.lastLimboFreeSnapshotVersion,
      this.resumeToken,
      e
    )
  }
  withLastLimboFreeSnapshotVersion(e) {
    return new t(
      this.target,
      this.targetId,
      this.purpose,
      this.sequenceNumber,
      this.snapshotVersion,
      e,
      this.resumeToken,
      this.expectedCount
    )
  }
}
var uh = class {
  constructor(e) {
    this.ct = e
  }
}
function wN(t) {
  let e = yN({ parent: t.parent, structuredQuery: t.structuredQuery })
  return t.limitType === 'LAST' ? Xd(e, e.limit, 'L') : e
}
var Ea = class {
  constructor() {}
  Pt(e, n) {
    this.It(e, n), n.Tt()
  }
  It(e, n) {
    if ('nullValue' in e) this.Et(n, 5)
    else if ('booleanValue' in e) this.Et(n, 10), n.dt(e.booleanValue ? 1 : 0)
    else if ('integerValue' in e) this.Et(n, 15), n.dt(J(e.integerValue))
    else if ('doubleValue' in e) {
      let r = J(e.doubleValue)
      isNaN(r) ? this.Et(n, 13) : (this.Et(n, 15), ha(r) ? n.dt(0) : n.dt(r))
    } else if ('timestampValue' in e) {
      let r = e.timestampValue
      this.Et(n, 20),
        typeof r == 'string'
          ? n.At(r)
          : (n.At(`${r.seconds || ''}`), n.dt(r.nanos || 0))
    } else if ('stringValue' in e) this.Rt(e.stringValue, n), this.Vt(n)
    else if ('bytesValue' in e)
      this.Et(n, 30), n.ft($t(e.bytesValue)), this.Vt(n)
    else if ('referenceValue' in e) this.gt(e.referenceValue, n)
    else if ('geoPointValue' in e) {
      let r = e.geoPointValue
      this.Et(n, 45), n.dt(r.latitude || 0), n.dt(r.longitude || 0)
    } else
      'mapValue' in e
        ? y_(e)
          ? this.Et(n, Number.MAX_SAFE_INTEGER)
          : (this.yt(e.mapValue, n), this.Vt(n))
        : 'arrayValue' in e
          ? (this.wt(e.arrayValue, n), this.Vt(n))
          : b()
  }
  Rt(e, n) {
    this.Et(n, 25), this.St(e, n)
  }
  St(e, n) {
    n.At(e)
  }
  yt(e, n) {
    let r = e.fields || {}
    this.Et(n, 55)
    for (let i of Object.keys(r)) this.Rt(i, n), this.It(r[i], n)
  }
  wt(e, n) {
    let r = e.values || []
    this.Et(n, 50)
    for (let i of r) this.It(i, n)
  }
  gt(e, n) {
    this.Et(n, 37),
      D.fromName(e).path.forEach((r) => {
        this.Et(n, 60), this.St(r, n)
      })
  }
  Et(e, n) {
    e.dt(n)
  }
  Vt(e) {
    e.dt(2)
  }
}
Ea.bt = new Ea()
var lh = class {
    constructor() {
      this._n = new dh()
    }
    addToCollectionParentIndex(e, n) {
      return this._n.add(n), g.resolve()
    }
    getCollectionParents(e, n) {
      return g.resolve(this._n.getEntries(n))
    }
    addFieldIndex(e, n) {
      return g.resolve()
    }
    deleteFieldIndex(e, n) {
      return g.resolve()
    }
    deleteAllFieldIndexes(e) {
      return g.resolve()
    }
    createTargetIndexes(e, n) {
      return g.resolve()
    }
    getDocumentsMatchingTarget(e, n) {
      return g.resolve(null)
    }
    getIndexType(e, n) {
      return g.resolve(0)
    }
    getFieldIndexes(e, n) {
      return g.resolve([])
    }
    getNextCollectionGroupToUpdate(e) {
      return g.resolve(null)
    }
    getMinOffset(e, n) {
      return g.resolve(Cn.min())
    }
    getMinOffsetFromCollectionGroup(e, n) {
      return g.resolve(Cn.min())
    }
    updateCollectionGroup(e, n, r) {
      return g.resolve()
    }
    updateIndexEntries(e, n) {
      return g.resolve()
    }
  },
  dh = class {
    constructor() {
      this.index = {}
    }
    add(e) {
      let n = e.lastSegment(),
        r = e.popLast(),
        i = this.index[n] || new Ie(re.comparator),
        s = !i.has(r)
      return (this.index[n] = i.add(r)), s
    }
    has(e) {
      let n = e.lastSegment(),
        r = e.popLast(),
        i = this.index[n]
      return i && i.has(r)
    }
    getEntries(e) {
      return (this.index[e] || new Ie(re.comparator)).toArray()
    }
  }
var qk = new Uint8Array(0)
var it = class t {
  constructor(e, n, r) {
    ;(this.cacheSizeCollectionThreshold = e),
      (this.percentileToCollect = n),
      (this.maximumSequenceNumbersToCollect = r)
  }
  static withCacheSize(e) {
    return new t(
      e,
      t.DEFAULT_COLLECTION_PERCENTILE,
      t.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT
    )
  }
}
;(it.DEFAULT_COLLECTION_PERCENTILE = 10),
  (it.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3),
  (it.DEFAULT = new it(
    41943040,
    it.DEFAULT_COLLECTION_PERCENTILE,
    it.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT
  )),
  (it.DISABLED = new it(-1, 0, 0))
var Yi = class t {
  constructor(e) {
    this.On = e
  }
  next() {
    return (this.On += 2), this.On
  }
  static Nn() {
    return new t(0)
  }
  static Bn() {
    return new t(-1)
  }
}
var hh = class {
  constructor() {
    ;(this.changes = new Ht(
      (e) => e.toString(),
      (e, n) => e.isEqual(n)
    )),
      (this.changesApplied = !1)
  }
  addEntry(e) {
    this.assertNotApplied(), this.changes.set(e.key, e)
  }
  removeEntry(e, n) {
    this.assertNotApplied(),
      this.changes.set(e, Ge.newInvalidDocument(e).setReadTime(n))
  }
  getEntry(e, n) {
    this.assertNotApplied()
    let r = this.changes.get(n)
    return r !== void 0 ? g.resolve(r) : this.getFromCache(e, n)
  }
  getEntries(e, n) {
    return this.getAllFromCache(e, n)
  }
  apply(e) {
    return (
      this.assertNotApplied(), (this.changesApplied = !0), this.applyChanges(e)
    )
  }
  assertNotApplied() {}
}
var fh = class {
  constructor(e, n) {
    ;(this.overlayedDocument = e), (this.mutatedFields = n)
  }
}
var ph = class {
  constructor(e, n, r, i) {
    ;(this.remoteDocumentCache = e),
      (this.mutationQueue = n),
      (this.documentOverlayCache = r),
      (this.indexManager = i)
  }
  getDocument(e, n) {
    let r = null
    return this.documentOverlayCache
      .getOverlay(e, n)
      .next((i) => ((r = i), this.remoteDocumentCache.getEntry(e, n)))
      .next((i) => (r !== null && Bi(r.mutation, i, _n.empty(), Me.now()), i))
  }
  getDocuments(e, n) {
    return this.remoteDocumentCache
      .getEntries(e, n)
      .next((r) => this.getLocalViewOfDocuments(e, r, O()).next(() => r))
  }
  getLocalViewOfDocuments(e, n, r = O()) {
    let i = In()
    return this.populateOverlays(e, i, n).next(() =>
      this.computeViews(e, n, i, r).next((s) => {
        let o = Fi()
        return (
          s.forEach((a, c) => {
            o = o.insert(a, c.overlayedDocument)
          }),
          o
        )
      })
    )
  }
  getOverlayedDocuments(e, n) {
    let r = In()
    return this.populateOverlays(e, r, n).next(() =>
      this.computeViews(e, n, r, O())
    )
  }
  populateOverlays(e, n, r) {
    let i = []
    return (
      r.forEach((s) => {
        n.has(s) || i.push(s)
      }),
      this.documentOverlayCache.getOverlays(e, i).next((s) => {
        s.forEach((o, a) => {
          n.set(o, a)
        })
      })
    )
  }
  computeViews(e, n, r, i) {
    let s = qt(),
      o = Ui(),
      a = (function () {
        return Ui()
      })()
    return (
      n.forEach((c, u) => {
        let l = r.get(u.key)
        i.has(u.key) && (l === void 0 || l.mutation instanceof Tr)
          ? (s = s.insert(u.key, u))
          : l !== void 0
            ? (o.set(u.key, l.mutation.getFieldMask()),
              Bi(l.mutation, u, l.mutation.getFieldMask(), Me.now()))
            : o.set(u.key, _n.empty())
      }),
      this.recalculateAndSaveOverlays(e, s).next(
        (c) => (
          c.forEach((u, l) => o.set(u, l)),
          n.forEach((u, l) => {
            var d
            return a.set(
              u,
              new fh(l, (d = o.get(u)) !== null && d !== void 0 ? d : null)
            )
          }),
          a
        )
      )
    )
  }
  recalculateAndSaveOverlays(e, n) {
    let r = Ui(),
      i = new ee((o, a) => o - a),
      s = O()
    return this.mutationQueue
      .getAllMutationBatchesAffectingDocumentKeys(e, n)
      .next((o) => {
        for (let a of o)
          a.keys().forEach((c) => {
            let u = n.get(c)
            if (u === null) return
            let l = r.get(c) || _n.empty()
            ;(l = a.applyToLocalView(u, l)), r.set(c, l)
            let d = (i.get(a.batchId) || O()).add(c)
            i = i.insert(a.batchId, d)
          })
      })
      .next(() => {
        let o = [],
          a = i.getReverseIterator()
        for (; a.hasNext(); ) {
          let c = a.getNext(),
            u = c.key,
            l = c.value,
            d = b_()
          l.forEach((h) => {
            if (!s.has(h)) {
              let f = R_(n.get(h), r.get(h))
              f !== null && d.set(h, f), (s = s.add(h))
            }
          }),
            o.push(this.documentOverlayCache.saveOverlays(e, u, d))
        }
        return g.waitFor(o)
      })
      .next(() => r)
  }
  recalculateAndSaveOverlaysForDocumentKeys(e, n) {
    return this.remoteDocumentCache
      .getEntries(e, n)
      .next((r) => this.recalculateAndSaveOverlays(e, r))
  }
  getDocumentsMatchingQuery(e, n, r, i) {
    return (function (o) {
      return (
        D.isDocumentKey(o.path) &&
        o.collectionGroup === null &&
        o.filters.length === 0
      )
    })(n)
      ? this.getDocumentsMatchingDocumentQuery(e, n.path)
      : HS(n)
        ? this.getDocumentsMatchingCollectionGroupQuery(e, n, r, i)
        : this.getDocumentsMatchingCollectionQuery(e, n, r, i)
  }
  getNextDocuments(e, n, r, i) {
    return this.remoteDocumentCache
      .getAllFromCollectionGroup(e, n, r, i)
      .next((s) => {
        let o =
            i - s.size > 0
              ? this.documentOverlayCache.getOverlaysForCollectionGroup(
                  e,
                  n,
                  r.largestBatchId,
                  i - s.size
                )
              : g.resolve(In()),
          a = -1,
          c = s
        return o.next((u) =>
          g
            .forEach(
              u,
              (l, d) => (
                a < d.largestBatchId && (a = d.largestBatchId),
                s.get(l)
                  ? g.resolve()
                  : this.remoteDocumentCache.getEntry(e, l).next((h) => {
                      c = c.insert(l, h)
                    })
              )
            )
            .next(() => this.populateOverlays(e, u, s))
            .next(() => this.computeViews(e, c, u, O()))
            .next((l) => ({ batchId: a, changes: KS(l) }))
        )
      })
  }
  getDocumentsMatchingDocumentQuery(e, n) {
    return this.getDocument(e, new D(n)).next((r) => {
      let i = Fi()
      return r.isFoundDocument() && (i = i.insert(r.key, r)), i
    })
  }
  getDocumentsMatchingCollectionGroupQuery(e, n, r, i) {
    let s = n.collectionGroup,
      o = Fi()
    return this.indexManager.getCollectionParents(e, s).next((a) =>
      g
        .forEach(a, (c) => {
          let u = (function (d, h) {
            return new Ir(
              h,
              null,
              d.explicitOrderBy.slice(),
              d.filters.slice(),
              d.limit,
              d.limitType,
              d.startAt,
              d.endAt
            )
          })(n, c.child(s))
          return this.getDocumentsMatchingCollectionQuery(e, u, r, i).next(
            (l) => {
              l.forEach((d, h) => {
                o = o.insert(d, h)
              })
            }
          )
        })
        .next(() => o)
    )
  }
  getDocumentsMatchingCollectionQuery(e, n, r, i) {
    let s
    return this.documentOverlayCache
      .getOverlaysForCollection(e, n.path, r.largestBatchId)
      .next(
        (o) => (
          (s = o),
          this.remoteDocumentCache.getDocumentsMatchingQuery(e, n, r, s, i)
        )
      )
      .next((o) => {
        s.forEach((c, u) => {
          let l = u.getKey()
          o.get(l) === null && (o = o.insert(l, Ge.newInvalidDocument(l)))
        })
        let a = Fi()
        return (
          o.forEach((c, u) => {
            let l = s.get(c)
            l !== void 0 && Bi(l.mutation, u, _n.empty(), Me.now()),
              Ua(n, u) && (a = a.insert(c, u))
          }),
          a
        )
      })
  }
}
var gh = class {
  constructor(e) {
    ;(this.serializer = e), (this.cr = new Map()), (this.lr = new Map())
  }
  getBundleMetadata(e, n) {
    return g.resolve(this.cr.get(n))
  }
  saveBundleMetadata(e, n) {
    return (
      this.cr.set(
        n.id,
        (function (i) {
          return { id: i.id, version: i.version, createTime: dr(i.createTime) }
        })(n)
      ),
      g.resolve()
    )
  }
  getNamedQuery(e, n) {
    return g.resolve(this.lr.get(n))
  }
  saveNamedQuery(e, n) {
    return (
      this.lr.set(
        n.name,
        (function (i) {
          return {
            name: i.name,
            query: wN(i.bundledQuery),
            readTime: dr(i.readTime),
          }
        })(n)
      ),
      g.resolve()
    )
  }
}
var mh = class {
  constructor() {
    ;(this.overlays = new ee(D.comparator)), (this.hr = new Map())
  }
  getOverlay(e, n) {
    return g.resolve(this.overlays.get(n))
  }
  getOverlays(e, n) {
    let r = In()
    return g
      .forEach(n, (i) =>
        this.getOverlay(e, i).next((s) => {
          s !== null && r.set(i, s)
        })
      )
      .next(() => r)
  }
  saveOverlays(e, n, r) {
    return (
      r.forEach((i, s) => {
        this.ht(e, n, s)
      }),
      g.resolve()
    )
  }
  removeOverlaysForBatchId(e, n, r) {
    let i = this.hr.get(r)
    return (
      i !== void 0 &&
        (i.forEach((s) => (this.overlays = this.overlays.remove(s))),
        this.hr.delete(r)),
      g.resolve()
    )
  }
  getOverlaysForCollection(e, n, r) {
    let i = In(),
      s = n.length + 1,
      o = new D(n.child('')),
      a = this.overlays.getIteratorFrom(o)
    for (; a.hasNext(); ) {
      let c = a.getNext().value,
        u = c.getKey()
      if (!n.isPrefixOf(u.path)) break
      u.path.length === s && c.largestBatchId > r && i.set(c.getKey(), c)
    }
    return g.resolve(i)
  }
  getOverlaysForCollectionGroup(e, n, r, i) {
    let s = new ee((u, l) => u - l),
      o = this.overlays.getIterator()
    for (; o.hasNext(); ) {
      let u = o.getNext().value
      if (u.getKey().getCollectionGroup() === n && u.largestBatchId > r) {
        let l = s.get(u.largestBatchId)
        l === null && ((l = In()), (s = s.insert(u.largestBatchId, l))),
          l.set(u.getKey(), u)
      }
    }
    let a = In(),
      c = s.getIterator()
    for (
      ;
      c.hasNext() &&
      (c.getNext().value.forEach((u, l) => a.set(u, l)), !(a.size() >= i));

    );
    return g.resolve(a)
  }
  ht(e, n, r) {
    let i = this.overlays.get(r.key)
    if (i !== null) {
      let o = this.hr.get(i.largestBatchId).delete(r.key)
      this.hr.set(i.largestBatchId, o)
    }
    this.overlays = this.overlays.insert(r.key, new nh(n, r))
    let s = this.hr.get(n)
    s === void 0 && ((s = O()), this.hr.set(n, s)), this.hr.set(n, s.add(r.key))
  }
}
var Ji = class {
    constructor() {
      ;(this.Pr = new Ie(ne.Ir)), (this.Tr = new Ie(ne.Er))
    }
    isEmpty() {
      return this.Pr.isEmpty()
    }
    addReference(e, n) {
      let r = new ne(e, n)
      ;(this.Pr = this.Pr.add(r)), (this.Tr = this.Tr.add(r))
    }
    dr(e, n) {
      e.forEach((r) => this.addReference(r, n))
    }
    removeReference(e, n) {
      this.Ar(new ne(e, n))
    }
    Rr(e, n) {
      e.forEach((r) => this.removeReference(r, n))
    }
    Vr(e) {
      let n = new D(new re([])),
        r = new ne(n, e),
        i = new ne(n, e + 1),
        s = []
      return (
        this.Tr.forEachInRange([r, i], (o) => {
          this.Ar(o), s.push(o.key)
        }),
        s
      )
    }
    mr() {
      this.Pr.forEach((e) => this.Ar(e))
    }
    Ar(e) {
      ;(this.Pr = this.Pr.delete(e)), (this.Tr = this.Tr.delete(e))
    }
    gr(e) {
      let n = new D(new re([])),
        r = new ne(n, e),
        i = new ne(n, e + 1),
        s = O()
      return (
        this.Tr.forEachInRange([r, i], (o) => {
          s = s.add(o.key)
        }),
        s
      )
    }
    containsKey(e) {
      let n = new ne(e, 0),
        r = this.Pr.firstAfterOrEqual(n)
      return r !== null && e.isEqual(r.key)
    }
  },
  ne = class {
    constructor(e, n) {
      ;(this.key = e), (this.pr = n)
    }
    static Ir(e, n) {
      return D.comparator(e.key, n.key) || V(e.pr, n.pr)
    }
    static Er(e, n) {
      return V(e.pr, n.pr) || D.comparator(e.key, n.key)
    }
  }
var yh = class {
  constructor(e, n) {
    ;(this.indexManager = e),
      (this.referenceDelegate = n),
      (this.mutationQueue = []),
      (this.yr = 1),
      (this.wr = new Ie(ne.Ir))
  }
  checkEmpty(e) {
    return g.resolve(this.mutationQueue.length === 0)
  }
  addMutationBatch(e, n, r, i) {
    let s = this.yr
    this.yr++,
      this.mutationQueue.length > 0 &&
        this.mutationQueue[this.mutationQueue.length - 1]
    let o = new th(s, n, r, i)
    this.mutationQueue.push(o)
    for (let a of i)
      (this.wr = this.wr.add(new ne(a.key, s))),
        this.indexManager.addToCollectionParentIndex(e, a.key.path.popLast())
    return g.resolve(o)
  }
  lookupMutationBatch(e, n) {
    return g.resolve(this.Sr(n))
  }
  getNextMutationBatchAfterBatchId(e, n) {
    let r = n + 1,
      i = this.br(r),
      s = i < 0 ? 0 : i
    return g.resolve(
      this.mutationQueue.length > s ? this.mutationQueue[s] : null
    )
  }
  getHighestUnacknowledgedBatchId() {
    return g.resolve(this.mutationQueue.length === 0 ? -1 : this.yr - 1)
  }
  getAllMutationBatches(e) {
    return g.resolve(this.mutationQueue.slice())
  }
  getAllMutationBatchesAffectingDocumentKey(e, n) {
    let r = new ne(n, 0),
      i = new ne(n, Number.POSITIVE_INFINITY),
      s = []
    return (
      this.wr.forEachInRange([r, i], (o) => {
        let a = this.Sr(o.pr)
        s.push(a)
      }),
      g.resolve(s)
    )
  }
  getAllMutationBatchesAffectingDocumentKeys(e, n) {
    let r = new Ie(V)
    return (
      n.forEach((i) => {
        let s = new ne(i, 0),
          o = new ne(i, Number.POSITIVE_INFINITY)
        this.wr.forEachInRange([s, o], (a) => {
          r = r.add(a.pr)
        })
      }),
      g.resolve(this.Dr(r))
    )
  }
  getAllMutationBatchesAffectingQuery(e, n) {
    let r = n.path,
      i = r.length + 1,
      s = r
    D.isDocumentKey(s) || (s = s.child(''))
    let o = new ne(new D(s), 0),
      a = new Ie(V)
    return (
      this.wr.forEachWhile((c) => {
        let u = c.key.path
        return !!r.isPrefixOf(u) && (u.length === i && (a = a.add(c.pr)), !0)
      }, o),
      g.resolve(this.Dr(a))
    )
  }
  Dr(e) {
    let n = []
    return (
      e.forEach((r) => {
        let i = this.Sr(r)
        i !== null && n.push(i)
      }),
      n
    )
  }
  removeMutationBatch(e, n) {
    ie(this.Cr(n.batchId, 'removed') === 0), this.mutationQueue.shift()
    let r = this.wr
    return g
      .forEach(n.mutations, (i) => {
        let s = new ne(i.key, n.batchId)
        return (
          (r = r.delete(s)),
          this.referenceDelegate.markPotentiallyOrphaned(e, i.key)
        )
      })
      .next(() => {
        this.wr = r
      })
  }
  Mn(e) {}
  containsKey(e, n) {
    let r = new ne(n, 0),
      i = this.wr.firstAfterOrEqual(r)
    return g.resolve(n.isEqual(i && i.key))
  }
  performConsistencyCheck(e) {
    return this.mutationQueue.length, g.resolve()
  }
  Cr(e, n) {
    return this.br(e)
  }
  br(e) {
    return this.mutationQueue.length === 0
      ? 0
      : e - this.mutationQueue[0].batchId
  }
  Sr(e) {
    let n = this.br(e)
    return n < 0 || n >= this.mutationQueue.length
      ? null
      : this.mutationQueue[n]
  }
}
var vh = class {
    constructor(e) {
      ;(this.vr = e),
        (this.docs = (function () {
          return new ee(D.comparator)
        })()),
        (this.size = 0)
    }
    setIndexManager(e) {
      this.indexManager = e
    }
    addEntry(e, n) {
      let r = n.key,
        i = this.docs.get(r),
        s = i ? i.size : 0,
        o = this.vr(n)
      return (
        (this.docs = this.docs.insert(r, {
          document: n.mutableCopy(),
          size: o,
        })),
        (this.size += o - s),
        this.indexManager.addToCollectionParentIndex(e, r.path.popLast())
      )
    }
    removeEntry(e) {
      let n = this.docs.get(e)
      n && ((this.docs = this.docs.remove(e)), (this.size -= n.size))
    }
    getEntry(e, n) {
      let r = this.docs.get(n)
      return g.resolve(r ? r.document.mutableCopy() : Ge.newInvalidDocument(n))
    }
    getEntries(e, n) {
      let r = qt()
      return (
        n.forEach((i) => {
          let s = this.docs.get(i)
          r = r.insert(
            i,
            s ? s.document.mutableCopy() : Ge.newInvalidDocument(i)
          )
        }),
        g.resolve(r)
      )
    }
    getDocumentsMatchingQuery(e, n, r, i) {
      let s = qt(),
        o = n.path,
        a = new D(o.child('')),
        c = this.docs.getIteratorFrom(a)
      for (; c.hasNext(); ) {
        let {
          key: u,
          value: { document: l },
        } = c.getNext()
        if (!o.isPrefixOf(u.path)) break
        u.path.length > o.length + 1 ||
          PS(MS(l), r) <= 0 ||
          ((i.has(l.key) || Ua(n, l)) && (s = s.insert(l.key, l.mutableCopy())))
      }
      return g.resolve(s)
    }
    getAllFromCollectionGroup(e, n, r, i) {
      b()
    }
    Fr(e, n) {
      return g.forEach(this.docs, (r) => n(r))
    }
    newChangeBuffer(e) {
      return new _h(this)
    }
    getSize(e) {
      return g.resolve(this.size)
    }
  },
  _h = class extends hh {
    constructor(e) {
      super(), (this.ar = e)
    }
    applyChanges(e) {
      let n = []
      return (
        this.changes.forEach((r, i) => {
          i.isValidDocument()
            ? n.push(this.ar.addEntry(e, i))
            : this.ar.removeEntry(r)
        }),
        g.waitFor(n)
      )
    }
    getFromCache(e, n) {
      return this.ar.getEntry(e, n)
    }
    getAllFromCache(e, n) {
      return this.ar.getEntries(e, n)
    }
  }
var Ih = class {
  constructor(e) {
    ;(this.persistence = e),
      (this.Mr = new Ht((n) => uf(n), lf)),
      (this.lastRemoteSnapshotVersion = A.min()),
      (this.highestTargetId = 0),
      (this.Or = 0),
      (this.Nr = new Ji()),
      (this.targetCount = 0),
      (this.Br = Yi.Nn())
  }
  forEachTarget(e, n) {
    return this.Mr.forEach((r, i) => n(i)), g.resolve()
  }
  getLastRemoteSnapshotVersion(e) {
    return g.resolve(this.lastRemoteSnapshotVersion)
  }
  getHighestSequenceNumber(e) {
    return g.resolve(this.Or)
  }
  allocateTargetId(e) {
    return (
      (this.highestTargetId = this.Br.next()), g.resolve(this.highestTargetId)
    )
  }
  setTargetsMetadata(e, n, r) {
    return (
      r && (this.lastRemoteSnapshotVersion = r),
      n > this.Or && (this.Or = n),
      g.resolve()
    )
  }
  qn(e) {
    this.Mr.set(e.target, e)
    let n = e.targetId
    n > this.highestTargetId &&
      ((this.Br = new Yi(n)), (this.highestTargetId = n)),
      e.sequenceNumber > this.Or && (this.Or = e.sequenceNumber)
  }
  addTargetData(e, n) {
    return this.qn(n), (this.targetCount += 1), g.resolve()
  }
  updateTargetData(e, n) {
    return this.qn(n), g.resolve()
  }
  removeTargetData(e, n) {
    return (
      this.Mr.delete(n.target),
      this.Nr.Vr(n.targetId),
      (this.targetCount -= 1),
      g.resolve()
    )
  }
  removeTargets(e, n, r) {
    let i = 0,
      s = []
    return (
      this.Mr.forEach((o, a) => {
        a.sequenceNumber <= n &&
          r.get(a.targetId) === null &&
          (this.Mr.delete(o),
          s.push(this.removeMatchingKeysForTargetId(e, a.targetId)),
          i++)
      }),
      g.waitFor(s).next(() => i)
    )
  }
  getTargetCount(e) {
    return g.resolve(this.targetCount)
  }
  getTargetData(e, n) {
    let r = this.Mr.get(n) || null
    return g.resolve(r)
  }
  addMatchingKeys(e, n, r) {
    return this.Nr.dr(n, r), g.resolve()
  }
  removeMatchingKeys(e, n, r) {
    this.Nr.Rr(n, r)
    let i = this.persistence.referenceDelegate,
      s = []
    return (
      i &&
        n.forEach((o) => {
          s.push(i.markPotentiallyOrphaned(e, o))
        }),
      g.waitFor(s)
    )
  }
  removeMatchingKeysForTargetId(e, n) {
    return this.Nr.Vr(n), g.resolve()
  }
  getMatchingKeysForTargetId(e, n) {
    let r = this.Nr.gr(n)
    return g.resolve(r)
  }
  containsKey(e, n) {
    return g.resolve(this.Nr.containsKey(n))
  }
}
var Eh = class {
    constructor(e, n) {
      ;(this.Lr = {}),
        (this.overlays = {}),
        (this.kr = new m_(0)),
        (this.qr = !1),
        (this.qr = !0),
        (this.referenceDelegate = e(this)),
        (this.Qr = new Ih(this)),
        (this.indexManager = new lh()),
        (this.remoteDocumentCache = (function (i) {
          return new vh(i)
        })((r) => this.referenceDelegate.Kr(r))),
        (this.serializer = new uh(n)),
        (this.$r = new gh(this.serializer))
    }
    start() {
      return Promise.resolve()
    }
    shutdown() {
      return (this.qr = !1), Promise.resolve()
    }
    get started() {
      return this.qr
    }
    setDatabaseDeletedListener() {}
    setNetworkEnabled() {}
    getIndexManager(e) {
      return this.indexManager
    }
    getDocumentOverlayCache(e) {
      let n = this.overlays[e.toKey()]
      return n || ((n = new mh()), (this.overlays[e.toKey()] = n)), n
    }
    getMutationQueue(e, n) {
      let r = this.Lr[e.toKey()]
      return (
        r ||
          ((r = new yh(n, this.referenceDelegate)), (this.Lr[e.toKey()] = r)),
        r
      )
    }
    getTargetCache() {
      return this.Qr
    }
    getRemoteDocumentCache() {
      return this.remoteDocumentCache
    }
    getBundleCache() {
      return this.$r
    }
    runTransaction(e, n, r) {
      v('MemoryPersistence', 'Starting transaction:', e)
      let i = new wh(this.kr.next())
      return (
        this.referenceDelegate.Ur(),
        r(i)
          .next((s) => this.referenceDelegate.Wr(i).next(() => s))
          .toPromise()
          .then((s) => (i.raiseOnCommittedEvent(), s))
      )
    }
    Gr(e, n) {
      return g.or(Object.values(this.Lr).map((r) => () => r.containsKey(e, n)))
    }
  },
  wh = class extends Fd {
    constructor(e) {
      super(), (this.currentSequenceNumber = e)
    }
  },
  Dh = class t {
    constructor(e) {
      ;(this.persistence = e), (this.zr = new Ji()), (this.jr = null)
    }
    static Hr(e) {
      return new t(e)
    }
    get Jr() {
      if (this.jr) return this.jr
      throw b()
    }
    addReference(e, n, r) {
      return (
        this.zr.addReference(r, n), this.Jr.delete(r.toString()), g.resolve()
      )
    }
    removeReference(e, n, r) {
      return (
        this.zr.removeReference(r, n), this.Jr.add(r.toString()), g.resolve()
      )
    }
    markPotentiallyOrphaned(e, n) {
      return this.Jr.add(n.toString()), g.resolve()
    }
    removeTarget(e, n) {
      this.zr.Vr(n.targetId).forEach((i) => this.Jr.add(i.toString()))
      let r = this.persistence.getTargetCache()
      return r
        .getMatchingKeysForTargetId(e, n.targetId)
        .next((i) => {
          i.forEach((s) => this.Jr.add(s.toString()))
        })
        .next(() => r.removeTargetData(e, n))
    }
    Ur() {
      this.jr = new Set()
    }
    Wr(e) {
      let n = this.persistence.getRemoteDocumentCache().newChangeBuffer()
      return g
        .forEach(this.Jr, (r) => {
          let i = D.fromPath(r)
          return this.Yr(e, i).next((s) => {
            s || n.removeEntry(i, A.min())
          })
        })
        .next(() => ((this.jr = null), n.apply(e)))
    }
    updateLimboDocument(e, n) {
      return this.Yr(e, n).next((r) => {
        r ? this.Jr.delete(n.toString()) : this.Jr.add(n.toString())
      })
    }
    Kr(e) {
      return 0
    }
    Yr(e, n) {
      return g.or([
        () => g.resolve(this.zr.containsKey(n)),
        () => this.persistence.getTargetCache().containsKey(e, n),
        () => this.persistence.Gr(e, n),
      ])
    }
  }
var Th = class t {
  constructor(e, n, r, i) {
    ;(this.targetId = e), (this.fromCache = n), (this.qi = r), (this.Qi = i)
  }
  static Ki(e, n) {
    let r = O(),
      i = O()
    for (let s of n.docChanges)
      switch (s.type) {
        case 0:
          r = r.add(s.doc.key)
          break
        case 1:
          i = i.add(s.doc.key)
      }
    return new t(e, n.fromCache, r, i)
  }
}
var Ch = class {
  constructor() {
    this._documentReadCount = 0
  }
  get documentReadCount() {
    return this._documentReadCount
  }
  incrementDocumentReadCount(e) {
    this._documentReadCount += e
  }
}
var bh = class {
  constructor() {
    ;(this.$i = !1),
      (this.Ui = !1),
      (this.Wi = 100),
      (this.Gi = (function () {
        return Um() ? 8 : da.v(me()) > 0 ? 6 : 4
      })())
  }
  initialize(e, n) {
    ;(this.zi = e), (this.indexManager = n), (this.$i = !0)
  }
  getDocumentsMatchingQuery(e, n, r, i) {
    let s = { result: null }
    return this.ji(e, n)
      .next((o) => {
        s.result = o
      })
      .next(() => {
        if (!s.result)
          return this.Hi(e, n, i, r).next((o) => {
            s.result = o
          })
      })
      .next(() => {
        if (s.result) return
        let o = new Ch()
        return this.Ji(e, n, o).next((a) => {
          if (((s.result = a), this.Ui)) return this.Yi(e, n, o, a.size)
        })
      })
      .next(() => s.result)
  }
  Yi(e, n, r, i) {
    return r.documentReadCount < this.Wi
      ? (ki() <= N.DEBUG &&
          v(
            'QueryEngine',
            'SDK will not create cache indexes for query:',
            or(n),
            'since it only creates cache indexes for collection contains',
            'more than or equal to',
            this.Wi,
            'documents'
          ),
        g.resolve())
      : (ki() <= N.DEBUG &&
          v(
            'QueryEngine',
            'Query:',
            or(n),
            'scans',
            r.documentReadCount,
            'local documents and returns',
            i,
            'documents as results.'
          ),
        r.documentReadCount > this.Gi * i
          ? (ki() <= N.DEBUG &&
              v(
                'QueryEngine',
                'The SDK decides to create cache indexes for query:',
                or(n),
                'as using cache indexes may help improve performance.'
              ),
            this.indexManager.createTargetIndexes(e, ot(n)))
          : g.resolve())
  }
  ji(e, n) {
    if (Kv(n)) return g.resolve(null)
    let r = ot(n)
    return this.indexManager.getIndexType(e, r).next((i) =>
      i === 0
        ? null
        : (n.limit !== null && i === 1 && ((n = Xd(n, null, 'F')), (r = ot(n))),
          this.indexManager.getDocumentsMatchingTarget(e, r).next((s) => {
            let o = O(...s)
            return this.zi.getDocuments(e, o).next((a) =>
              this.indexManager.getMinOffset(e, r).next((c) => {
                let u = this.Zi(n, a)
                return this.Xi(n, u, o, c.readTime)
                  ? this.ji(e, Xd(n, null, 'F'))
                  : this.es(e, u, n, c)
              })
            )
          }))
    )
  }
  Hi(e, n, r, i) {
    return Kv(n) || i.isEqual(A.min())
      ? g.resolve(null)
      : this.zi.getDocuments(e, r).next((s) => {
          let o = this.Zi(n, s)
          return this.Xi(n, o, r, i)
            ? g.resolve(null)
            : (ki() <= N.DEBUG &&
                v(
                  'QueryEngine',
                  'Re-using previous result from %s to execute query: %s',
                  i.toString(),
                  or(n)
                ),
              this.es(e, o, n, xS(i, -1)).next((a) => a))
        })
  }
  Zi(e, n) {
    let r = new Ie(T_(e))
    return (
      n.forEach((i, s) => {
        Ua(e, s) && (r = r.add(s))
      }),
      r
    )
  }
  Xi(e, n, r, i) {
    if (e.limit === null) return !1
    if (r.size !== n.size) return !0
    let s = e.limitType === 'F' ? n.last() : n.first()
    return !!s && (s.hasPendingWrites || s.version.compareTo(i) > 0)
  }
  Ji(e, n, r) {
    return (
      ki() <= N.DEBUG &&
        v('QueryEngine', 'Using full collection scan to execute query:', or(n)),
      this.zi.getDocumentsMatchingQuery(e, n, Cn.min(), r)
    )
  }
  es(e, n, r, i) {
    return this.zi.getDocumentsMatchingQuery(e, r, i).next(
      (s) => (
        n.forEach((o) => {
          s = s.insert(o.key, o)
        }),
        s
      )
    )
  }
}
var Ah = class {
  constructor(e, n, r, i) {
    ;(this.persistence = e),
      (this.ts = n),
      (this.serializer = i),
      (this.ns = new ee(V)),
      (this.rs = new Ht((s) => uf(s), lf)),
      (this.ss = new Map()),
      (this.os = e.getRemoteDocumentCache()),
      (this.Qr = e.getTargetCache()),
      (this.$r = e.getBundleCache()),
      this._s(r)
  }
  _s(e) {
    ;(this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e)),
      (this.indexManager = this.persistence.getIndexManager(e)),
      (this.mutationQueue = this.persistence.getMutationQueue(
        e,
        this.indexManager
      )),
      (this.localDocuments = new ph(
        this.os,
        this.mutationQueue,
        this.documentOverlayCache,
        this.indexManager
      )),
      this.os.setIndexManager(this.indexManager),
      this.ts.initialize(this.localDocuments, this.indexManager)
  }
  collectGarbage(e) {
    return this.persistence.runTransaction(
      'Collect garbage',
      'readwrite-primary',
      (n) => e.collect(n, this.ns)
    )
  }
}
function DN(t, e, n, r) {
  return new Ah(t, e, n, r)
}
function U_(t, e) {
  return p(this, null, function* () {
    let n = F(t)
    return yield n.persistence.runTransaction(
      'Handle user change',
      'readonly',
      (r) => {
        let i
        return n.mutationQueue
          .getAllMutationBatches(r)
          .next(
            (s) => ((i = s), n._s(e), n.mutationQueue.getAllMutationBatches(r))
          )
          .next((s) => {
            let o = [],
              a = [],
              c = O()
            for (let u of i) {
              o.push(u.batchId)
              for (let l of u.mutations) c = c.add(l.key)
            }
            for (let u of s) {
              a.push(u.batchId)
              for (let l of u.mutations) c = c.add(l.key)
            }
            return n.localDocuments
              .getDocuments(r, c)
              .next((u) => ({ us: u, removedBatchIds: o, addedBatchIds: a }))
          })
      }
    )
  })
}
function j_(t) {
  let e = F(t)
  return e.persistence.runTransaction(
    'Get last remote snapshot version',
    'readonly',
    (n) => e.Qr.getLastRemoteSnapshotVersion(n)
  )
}
function TN(t, e) {
  let n = F(t),
    r = e.snapshotVersion,
    i = n.ns
  return n.persistence
    .runTransaction('Apply remote event', 'readwrite-primary', (s) => {
      let o = n.os.newChangeBuffer({ trackRemovals: !0 })
      i = n.ns
      let a = []
      e.targetChanges.forEach((l, d) => {
        let h = i.get(d)
        if (!h) return
        a.push(
          n.Qr.removeMatchingKeys(s, l.removedDocuments, d).next(() =>
            n.Qr.addMatchingKeys(s, l.addedDocuments, d)
          )
        )
        let f = h.withSequenceNumber(s.currentSequenceNumber)
        e.targetMismatches.get(d) !== null
          ? (f = f
              .withResumeToken(we.EMPTY_BYTE_STRING, A.min())
              .withLastLimboFreeSnapshotVersion(A.min()))
          : l.resumeToken.approximateByteSize() > 0 &&
            (f = f.withResumeToken(l.resumeToken, r)),
          (i = i.insert(d, f)),
          (function (w, I, P) {
            return w.resumeToken.approximateByteSize() === 0 ||
              I.snapshotVersion.toMicroseconds() -
                w.snapshotVersion.toMicroseconds() >=
                3e8
              ? !0
              : P.addedDocuments.size +
                  P.modifiedDocuments.size +
                  P.removedDocuments.size >
                  0
          })(h, f, l) && a.push(n.Qr.updateTargetData(s, f))
      })
      let c = qt(),
        u = O()
      if (
        (e.documentUpdates.forEach((l) => {
          e.resolvedLimboDocuments.has(l) &&
            a.push(n.persistence.referenceDelegate.updateLimboDocument(s, l))
        }),
        a.push(
          CN(s, o, e.documentUpdates).next((l) => {
            ;(c = l.cs), (u = l.ls)
          })
        ),
        !r.isEqual(A.min()))
      ) {
        let l = n.Qr.getLastRemoteSnapshotVersion(s).next((d) =>
          n.Qr.setTargetsMetadata(s, s.currentSequenceNumber, r)
        )
        a.push(l)
      }
      return g
        .waitFor(a)
        .next(() => o.apply(s))
        .next(() => n.localDocuments.getLocalViewOfDocuments(s, c, u))
        .next(() => c)
    })
    .then((s) => ((n.ns = i), s))
}
function CN(t, e, n) {
  let r = O(),
    i = O()
  return (
    n.forEach((s) => (r = r.add(s))),
    e.getEntries(t, r).next((s) => {
      let o = qt()
      return (
        n.forEach((a, c) => {
          let u = s.get(a)
          c.isFoundDocument() !== u.isFoundDocument() && (i = i.add(a)),
            c.isNoDocument() && c.version.isEqual(A.min())
              ? (e.removeEntry(a, c.readTime), (o = o.insert(a, c)))
              : !u.isValidDocument() ||
                  c.version.compareTo(u.version) > 0 ||
                  (c.version.compareTo(u.version) === 0 && u.hasPendingWrites)
                ? (e.addEntry(c), (o = o.insert(a, c)))
                : v(
                    'LocalStore',
                    'Ignoring outdated watch update for ',
                    a,
                    '. Current version:',
                    u.version,
                    ' Watch version:',
                    c.version
                  )
        }),
        { cs: o, ls: i }
      )
    })
  )
}
function bN(t, e) {
  let n = F(t)
  return n.persistence
    .runTransaction('Allocate target', 'readwrite', (r) => {
      let i
      return n.Qr.getTargetData(r, e).next((s) =>
        s
          ? ((i = s), g.resolve(i))
          : n.Qr.allocateTargetId(r).next(
              (o) => (
                (i = new Qi(
                  e,
                  o,
                  'TargetPurposeListen',
                  r.currentSequenceNumber
                )),
                n.Qr.addTargetData(r, i).next(() => i)
              )
            )
      )
    })
    .then((r) => {
      let i = n.ns.get(r.targetId)
      return (
        (i === null || r.snapshotVersion.compareTo(i.snapshotVersion) > 0) &&
          ((n.ns = n.ns.insert(r.targetId, r)), n.rs.set(e, r.targetId)),
        r
      )
    })
}
function Sh(t, e, n) {
  return p(this, null, function* () {
    let r = F(t),
      i = r.ns.get(e),
      s = n ? 'readwrite' : 'readwrite-primary'
    try {
      n ||
        (yield r.persistence.runTransaction('Release target', s, (o) =>
          r.persistence.referenceDelegate.removeTarget(o, i)
        ))
    } catch (o) {
      if (!es(o)) throw o
      v('LocalStore', `Failed to update sequence numbers for target ${e}: ${o}`)
    }
    ;(r.ns = r.ns.remove(e)), r.rs.delete(i.target)
  })
}
function s_(t, e, n) {
  let r = F(t),
    i = A.min(),
    s = O()
  return r.persistence.runTransaction('Execute query', 'readwrite', (o) =>
    (function (c, u, l) {
      let d = F(c),
        h = d.rs.get(l)
      return h !== void 0 ? g.resolve(d.ns.get(h)) : d.Qr.getTargetData(u, l)
    })(r, o, ot(e))
      .next((a) => {
        if (a)
          return (
            (i = a.lastLimboFreeSnapshotVersion),
            r.Qr.getMatchingKeysForTargetId(o, a.targetId).next((c) => {
              s = c
            })
          )
      })
      .next(() =>
        r.ts.getDocumentsMatchingQuery(o, e, n ? i : A.min(), n ? s : O())
      )
      .next((a) => (AN(r, zS(e), a), { documents: a, hs: s }))
  )
}
function AN(t, e, n) {
  let r = t.ss.get(e) || A.min()
  n.forEach((i, s) => {
    s.readTime.compareTo(r) > 0 && (r = s.readTime)
  }),
    t.ss.set(e, r)
}
var wa = class {
  constructor() {
    this.activeTargetIds = JS()
  }
  As(e) {
    this.activeTargetIds = this.activeTargetIds.add(e)
  }
  Rs(e) {
    this.activeTargetIds = this.activeTargetIds.delete(e)
  }
  ds() {
    let e = {
      activeTargetIds: this.activeTargetIds.toArray(),
      updateTimeMs: Date.now(),
    }
    return JSON.stringify(e)
  }
}
var Nh = class {
  constructor() {
    ;(this.no = new wa()),
      (this.ro = {}),
      (this.onlineStateHandler = null),
      (this.sequenceNumberHandler = null)
  }
  addPendingMutation(e) {}
  updateMutationState(e, n, r) {}
  addLocalQueryTarget(e) {
    return this.no.As(e), this.ro[e] || 'not-current'
  }
  updateQueryState(e, n, r) {
    this.ro[e] = n
  }
  removeLocalQueryTarget(e) {
    this.no.Rs(e)
  }
  isLocalQueryTarget(e) {
    return this.no.activeTargetIds.has(e)
  }
  clearQueryState(e) {
    delete this.ro[e]
  }
  getAllActiveQueryTargets() {
    return this.no.activeTargetIds
  }
  isActiveQueryTarget(e) {
    return this.no.activeTargetIds.has(e)
  }
  start() {
    return (this.no = new wa()), Promise.resolve()
  }
  handleUserChange(e, n, r) {}
  setOnlineState(e) {}
  shutdown() {}
  writeSequenceNumber(e) {}
  notifyBundleLoaded(e) {}
}
var Rh = class {
  io(e) {}
  shutdown() {}
}
var Da = class {
  constructor() {
    ;(this.so = () => this.oo()),
      (this._o = () => this.ao()),
      (this.uo = []),
      this.co()
  }
  io(e) {
    this.uo.push(e)
  }
  shutdown() {
    window.removeEventListener('online', this.so),
      window.removeEventListener('offline', this._o)
  }
  co() {
    window.addEventListener('online', this.so),
      window.addEventListener('offline', this._o)
  }
  oo() {
    v('ConnectivityMonitor', 'Network connectivity changed: AVAILABLE')
    for (let e of this.uo) e(0)
  }
  ao() {
    v('ConnectivityMonitor', 'Network connectivity changed: UNAVAILABLE')
    for (let e of this.uo) e(1)
  }
  static D() {
    return (
      typeof window < 'u' &&
      window.addEventListener !== void 0 &&
      window.removeEventListener !== void 0
    )
  }
}
var oa = null
function Td() {
  return (
    oa === null
      ? (oa = (function () {
          return 268435456 + Math.round(2147483648 * Math.random())
        })())
      : oa++,
    '0x' + oa.toString(16)
  )
}
var SN = {
  BatchGetDocuments: 'batchGet',
  Commit: 'commit',
  RunQuery: 'runQuery',
  RunAggregationQuery: 'runAggregationQuery',
}
var xh = class {
  constructor(e) {
    ;(this.lo = e.lo), (this.ho = e.ho)
  }
  Po(e) {
    this.Io = e
  }
  To(e) {
    this.Eo = e
  }
  onMessage(e) {
    this.Ao = e
  }
  close() {
    this.ho()
  }
  send(e) {
    this.lo(e)
  }
  Ro() {
    this.Io()
  }
  Vo(e) {
    this.Eo(e)
  }
  mo(e) {
    this.Ao(e)
  }
}
var _e = 'WebChannelConnection',
  Mh = class extends class {
    constructor(n) {
      ;(this.databaseInfo = n), (this.databaseId = n.databaseId)
      let r = n.ssl ? 'https' : 'http',
        i = encodeURIComponent(this.databaseId.projectId),
        s = encodeURIComponent(this.databaseId.database)
      ;(this.fo = r + '://' + n.host),
        (this.po = `projects/${i}/databases/${s}`),
        (this.yo =
          this.databaseId.database === '(default)'
            ? `project_id=${i}`
            : `project_id=${i}&database_id=${s}`)
    }
    get wo() {
      return !1
    }
    So(n, r, i, s, o) {
      let a = Td(),
        c = this.bo(n, r.toUriEncodedString())
      v('RestConnection', `Sending RPC '${n}' ${a}:`, c, i)
      let u = {
        'google-cloud-resource-prefix': this.po,
        'x-goog-request-params': this.yo,
      }
      return (
        this.Do(u, s, o),
        this.Co(n, c, u, i).then(
          (l) => (v('RestConnection', `Received RPC '${n}' ${a}: `, l), l),
          (l) => {
            throw (
              (pr(
                'RestConnection',
                `RPC '${n}' ${a} failed with error: `,
                l,
                'url: ',
                c,
                'request:',
                i
              ),
              l)
            )
          }
        )
      )
    }
    vo(n, r, i, s, o, a) {
      return this.So(n, r, i, s, o)
    }
    Do(n, r, i) {
      ;(n['X-Goog-Api-Client'] = (function () {
        return 'gl-js/ fire/' + br
      })()),
        (n['Content-Type'] = 'text/plain'),
        this.databaseInfo.appId &&
          (n['X-Firebase-GMPID'] = this.databaseInfo.appId),
        r && r.headers.forEach((s, o) => (n[o] = s)),
        i && i.headers.forEach((s, o) => (n[o] = s))
    }
    bo(n, r) {
      let i = SN[n]
      return `${this.fo}/v1/${r}:${i}`
    }
    terminate() {}
  } {
    constructor(e) {
      super(e),
        (this.forceLongPolling = e.forceLongPolling),
        (this.autoDetectLongPolling = e.autoDetectLongPolling),
        (this.useFetchStreams = e.useFetchStreams),
        (this.longPollingOptions = e.longPollingOptions)
    }
    Co(e, n, r, i) {
      let s = Td()
      return new Promise((o, a) => {
        let c = new Lv()
        c.setWithCredentials(!0),
          c.listenOnce(kv.COMPLETE, () => {
            try {
              switch (c.getLastErrorCode()) {
                case ia.NO_ERROR:
                  let l = c.getResponseJson()
                  v(_e, `XHR for RPC '${e}' ${s} received:`, JSON.stringify(l)),
                    o(l)
                  break
                case ia.TIMEOUT:
                  v(_e, `RPC '${e}' ${s} timed out`),
                    a(new E(m.DEADLINE_EXCEEDED, 'Request time out'))
                  break
                case ia.HTTP_ERROR:
                  let d = c.getStatus()
                  if (
                    (v(
                      _e,
                      `RPC '${e}' ${s} failed with status:`,
                      d,
                      'response text:',
                      c.getResponseText()
                    ),
                    d > 0)
                  ) {
                    let h = c.getResponseJson()
                    Array.isArray(h) && (h = h[0])
                    let f = h?.error
                    if (f && f.status && f.message) {
                      let _ = (function (I) {
                        let P = I.toLowerCase().replace(/_/g, '-')
                        return Object.values(m).indexOf(P) >= 0 ? P : m.UNKNOWN
                      })(f.status)
                      a(new E(_, f.message))
                    } else
                      a(
                        new E(
                          m.UNKNOWN,
                          'Server responded with status ' + c.getStatus()
                        )
                      )
                  } else a(new E(m.UNAVAILABLE, 'Connection failed.'))
                  break
                default:
                  b()
              }
            } finally {
              v(_e, `RPC '${e}' ${s} completed.`)
            }
          })
        let u = JSON.stringify(i)
        v(_e, `RPC '${e}' ${s} sending request:`, i),
          c.send(n, 'POST', u, r, 15)
      })
    }
    Fo(e, n, r) {
      let i = Td(),
        s = [this.fo, '/', 'google.firestore.v1.Firestore', '/', e, '/channel'],
        o = Pv(),
        a = Ov(),
        c = {
          httpSessionIdParam: 'gsessionid',
          initMessageHeaders: {},
          messageUrlParams: {
            database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`,
          },
          sendRawJson: !0,
          supportsCrossDomainXhr: !0,
          internalChannelParams: { forwardChannelRequestTimeoutMs: 6e5 },
          forceLongPolling: this.forceLongPolling,
          detectBufferingProxy: this.autoDetectLongPolling,
        },
        u = this.longPollingOptions.timeoutSeconds
      u !== void 0 && (c.longPollingTimeout = Math.round(1e3 * u)),
        this.useFetchStreams && (c.useFetchStreams = !0),
        this.Do(c.initMessageHeaders, n, r),
        (c.encodeInitMessageHeaders = !0)
      let l = s.join('')
      v(_e, `Creating RPC '${e}' stream ${i}: ${l}`, c)
      let d = o.createWebChannel(l, c),
        h = !1,
        f = !1,
        _ = new xh({
          lo: (I) => {
            f
              ? v(
                  _e,
                  `Not sending because RPC '${e}' stream ${i} is closed:`,
                  I
                )
              : (h ||
                  (v(_e, `Opening RPC '${e}' stream ${i} transport.`),
                  d.open(),
                  (h = !0)),
                v(_e, `RPC '${e}' stream ${i} sending:`, I),
                d.send(I))
          },
          ho: () => d.close(),
        }),
        w = (I, P, L) => {
          I.listen(P, (z) => {
            try {
              L(z)
            } catch (B) {
              setTimeout(() => {
                throw B
              }, 0)
            }
          })
        }
      return (
        w(d, Oi.EventType.OPEN, () => {
          f || v(_e, `RPC '${e}' stream ${i} transport opened.`)
        }),
        w(d, Oi.EventType.CLOSE, () => {
          f ||
            ((f = !0), v(_e, `RPC '${e}' stream ${i} transport closed`), _.Vo())
        }),
        w(d, Oi.EventType.ERROR, (I) => {
          f ||
            ((f = !0),
            pr(_e, `RPC '${e}' stream ${i} transport errored:`, I),
            _.Vo(new E(m.UNAVAILABLE, 'The operation could not be completed')))
        }),
        w(d, Oi.EventType.MESSAGE, (I) => {
          var P
          if (!f) {
            let L = I.data[0]
            ie(!!L)
            let z = L,
              B =
                z.error ||
                ((P = z[0]) === null || P === void 0 ? void 0 : P.error)
            if (B) {
              v(_e, `RPC '${e}' stream ${i} received error:`, B)
              let Z = B.status,
                $ = (function (zt) {
                  let rs = te[zt]
                  if (rs !== void 0) return M_(rs)
                })(Z),
                Te = B.message
              $ === void 0 &&
                (($ = m.INTERNAL),
                (Te =
                  'Unknown error status: ' + Z + ' with message ' + B.message)),
                (f = !0),
                _.Vo(new E($, Te)),
                d.close()
            } else v(_e, `RPC '${e}' stream ${i} received:`, L), _.mo(L)
          }
        }),
        w(a, Fv.STAT_EVENT, (I) => {
          I.stat === Ed.PROXY
            ? v(_e, `RPC '${e}' stream ${i} detected buffering proxy`)
            : I.stat === Ed.NOPROXY &&
              v(_e, `RPC '${e}' stream ${i} detected no buffering proxy`)
        }),
        setTimeout(() => {
          _.Ro()
        }, 0),
        _
      )
    }
  }
function Cd() {
  return typeof document < 'u' ? document : null
}
function B_(t) {
  return new oh(t, !0)
}
var Ta = class {
  constructor(e, n, r = 1e3, i = 1.5, s = 6e4) {
    ;(this.oi = e),
      (this.timerId = n),
      (this.Mo = r),
      (this.xo = i),
      (this.Oo = s),
      (this.No = 0),
      (this.Bo = null),
      (this.Lo = Date.now()),
      this.reset()
  }
  reset() {
    this.No = 0
  }
  ko() {
    this.No = this.Oo
  }
  qo(e) {
    this.cancel()
    let n = Math.floor(this.No + this.Qo()),
      r = Math.max(0, Date.now() - this.Lo),
      i = Math.max(0, n - r)
    i > 0 &&
      v(
        'ExponentialBackoff',
        `Backing off for ${i} ms (base delay: ${this.No} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`
      ),
      (this.Bo = this.oi.enqueueAfterDelay(
        this.timerId,
        i,
        () => ((this.Lo = Date.now()), e())
      )),
      (this.No *= this.xo),
      this.No < this.Mo && (this.No = this.Mo),
      this.No > this.Oo && (this.No = this.Oo)
  }
  Ko() {
    this.Bo !== null && (this.Bo.skipDelay(), (this.Bo = null))
  }
  cancel() {
    this.Bo !== null && (this.Bo.cancel(), (this.Bo = null))
  }
  Qo() {
    return (Math.random() - 0.5) * this.No
  }
}
var Ph = class {
    constructor(e, n, r, i, s, o, a, c) {
      ;(this.oi = e),
        (this.$o = r),
        (this.Uo = i),
        (this.connection = s),
        (this.authCredentialsProvider = o),
        (this.appCheckCredentialsProvider = a),
        (this.listener = c),
        (this.state = 0),
        (this.Wo = 0),
        (this.Go = null),
        (this.zo = null),
        (this.stream = null),
        (this.jo = new Ta(e, n))
    }
    Ho() {
      return this.state === 1 || this.state === 5 || this.Jo()
    }
    Jo() {
      return this.state === 2 || this.state === 3
    }
    start() {
      this.state !== 4 ? this.auth() : this.Yo()
    }
    stop() {
      return p(this, null, function* () {
        this.Ho() && (yield this.close(0))
      })
    }
    Zo() {
      ;(this.state = 0), this.jo.reset()
    }
    Xo() {
      this.Jo() &&
        this.Go === null &&
        (this.Go = this.oi.enqueueAfterDelay(this.$o, 6e4, () => this.e_()))
    }
    t_(e) {
      this.n_(), this.stream.send(e)
    }
    e_() {
      return p(this, null, function* () {
        if (this.Jo()) return this.close(0)
      })
    }
    n_() {
      this.Go && (this.Go.cancel(), (this.Go = null))
    }
    r_() {
      this.zo && (this.zo.cancel(), (this.zo = null))
    }
    close(e, n) {
      return p(this, null, function* () {
        this.n_(),
          this.r_(),
          this.jo.cancel(),
          this.Wo++,
          e !== 4
            ? this.jo.reset()
            : n && n.code === m.RESOURCE_EXHAUSTED
              ? (at(n.toString()),
                at(
                  'Using maximum backoff delay to prevent overloading the backend.'
                ),
                this.jo.ko())
              : n &&
                n.code === m.UNAUTHENTICATED &&
                this.state !== 3 &&
                (this.authCredentialsProvider.invalidateToken(),
                this.appCheckCredentialsProvider.invalidateToken()),
          this.stream !== null &&
            (this.i_(), this.stream.close(), (this.stream = null)),
          (this.state = e),
          yield this.listener.To(n)
      })
    }
    i_() {}
    auth() {
      this.state = 1
      let e = this.s_(this.Wo),
        n = this.Wo
      Promise.all([
        this.authCredentialsProvider.getToken(),
        this.appCheckCredentialsProvider.getToken(),
      ]).then(
        ([r, i]) => {
          this.Wo === n && this.o_(r, i)
        },
        (r) => {
          e(() => {
            let i = new E(m.UNKNOWN, 'Fetching auth token failed: ' + r.message)
            return this.__(i)
          })
        }
      )
    }
    o_(e, n) {
      let r = this.s_(this.Wo)
      ;(this.stream = this.a_(e, n)),
        this.stream.Po(() => {
          r(
            () => (
              (this.state = 2),
              (this.zo = this.oi.enqueueAfterDelay(
                this.Uo,
                1e4,
                () => (this.Jo() && (this.state = 3), Promise.resolve())
              )),
              this.listener.Po()
            )
          )
        }),
        this.stream.To((i) => {
          r(() => this.__(i))
        }),
        this.stream.onMessage((i) => {
          r(() => this.onMessage(i))
        })
    }
    Yo() {
      ;(this.state = 5),
        this.jo.qo(() =>
          p(this, null, function* () {
            ;(this.state = 0), this.start()
          })
        )
    }
    __(e) {
      return (
        v('PersistentStream', `close with error: ${e}`),
        (this.stream = null),
        this.close(4, e)
      )
    }
    s_(e) {
      return (n) => {
        this.oi.enqueueAndForget(() =>
          this.Wo === e
            ? n()
            : (v(
                'PersistentStream',
                'stream callback skipped by getCloseGuardedDispatcher.'
              ),
              Promise.resolve())
        )
      }
    }
  },
  Oh = class extends Ph {
    constructor(e, n, r, i, s, o) {
      super(
        e,
        'listen_stream_connection_backoff',
        'listen_stream_idle',
        'health_check_timeout',
        n,
        r,
        i,
        o
      ),
        (this.serializer = s)
    }
    a_(e, n) {
      return this.connection.Fo('Listen', e, n)
    }
    onMessage(e) {
      this.jo.reset()
      let n = pN(this.serializer, e),
        r = (function (s) {
          if (!('targetChange' in s)) return A.min()
          let o = s.targetChange
          return o.targetIds && o.targetIds.length
            ? A.min()
            : o.readTime
              ? dr(o.readTime)
              : A.min()
        })(e)
      return this.listener.u_(n, r)
    }
    c_(e) {
      let n = {}
      ;(n.database = i_(this.serializer)),
        (n.addTarget = (function (s, o) {
          let a,
            c = o.target
          if (
            ((a = Zd(c) ? { documents: gN(s, c) } : { query: mN(s, c).ut }),
            (a.targetId = o.targetId),
            o.resumeToken.approximateByteSize() > 0)
          ) {
            a.resumeToken = dN(s, o.resumeToken)
            let u = ah(s, o.expectedCount)
            u !== null && (a.expectedCount = u)
          } else if (o.snapshotVersion.compareTo(A.min()) > 0) {
            a.readTime = lN(s, o.snapshotVersion.toTimestamp())
            let u = ah(s, o.expectedCount)
            u !== null && (a.expectedCount = u)
          }
          return a
        })(this.serializer, e))
      let r = vN(this.serializer, e)
      r && (n.labels = r), this.t_(n)
    }
    l_(e) {
      let n = {}
      ;(n.database = i_(this.serializer)), (n.removeTarget = e), this.t_(n)
    }
  }
var kh = class extends class {} {
  constructor(e, n, r, i) {
    super(),
      (this.authCredentials = e),
      (this.appCheckCredentials = n),
      (this.connection = r),
      (this.serializer = i),
      (this.A_ = !1)
  }
  R_() {
    if (this.A_)
      throw new E(
        m.FAILED_PRECONDITION,
        'The client has already been terminated.'
      )
  }
  So(e, n, r, i) {
    return (
      this.R_(),
      Promise.all([
        this.authCredentials.getToken(),
        this.appCheckCredentials.getToken(),
      ])
        .then(([s, o]) => this.connection.So(e, ch(n, r), i, s, o))
        .catch((s) => {
          throw s.name === 'FirebaseError'
            ? (s.code === m.UNAUTHENTICATED &&
                (this.authCredentials.invalidateToken(),
                this.appCheckCredentials.invalidateToken()),
              s)
            : new E(m.UNKNOWN, s.toString())
        })
    )
  }
  vo(e, n, r, i, s) {
    return (
      this.R_(),
      Promise.all([
        this.authCredentials.getToken(),
        this.appCheckCredentials.getToken(),
      ])
        .then(([o, a]) => this.connection.vo(e, ch(n, r), i, o, a, s))
        .catch((o) => {
          throw o.name === 'FirebaseError'
            ? (o.code === m.UNAUTHENTICATED &&
                (this.authCredentials.invalidateToken(),
                this.appCheckCredentials.invalidateToken()),
              o)
            : new E(m.UNKNOWN, o.toString())
        })
    )
  }
  terminate() {
    ;(this.A_ = !0), this.connection.terminate()
  }
}
var Fh = class {
  constructor(e, n) {
    ;(this.asyncQueue = e),
      (this.onlineStateHandler = n),
      (this.state = 'Unknown'),
      (this.m_ = 0),
      (this.f_ = null),
      (this.g_ = !0)
  }
  p_() {
    this.m_ === 0 &&
      (this.y_('Unknown'),
      (this.f_ = this.asyncQueue.enqueueAfterDelay(
        'online_state_timeout',
        1e4,
        () => (
          (this.f_ = null),
          this.w_("Backend didn't respond within 10 seconds."),
          this.y_('Offline'),
          Promise.resolve()
        )
      )))
  }
  S_(e) {
    this.state === 'Online'
      ? this.y_('Unknown')
      : (this.m_++,
        this.m_ >= 1 &&
          (this.b_(),
          this.w_(
            `Connection failed 1 times. Most recent error: ${e.toString()}`
          ),
          this.y_('Offline')))
  }
  set(e) {
    this.b_(), (this.m_ = 0), e === 'Online' && (this.g_ = !1), this.y_(e)
  }
  y_(e) {
    e !== this.state && ((this.state = e), this.onlineStateHandler(e))
  }
  w_(e) {
    let n = `Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`
    this.g_ ? (at(n), (this.g_ = !1)) : v('OnlineStateTracker', n)
  }
  b_() {
    this.f_ !== null && (this.f_.cancel(), (this.f_ = null))
  }
}
var Lh = class {
  constructor(e, n, r, i, s) {
    ;(this.localStore = e),
      (this.datastore = n),
      (this.asyncQueue = r),
      (this.remoteSyncer = {}),
      (this.D_ = []),
      (this.C_ = new Map()),
      (this.v_ = new Set()),
      (this.F_ = []),
      (this.M_ = s),
      this.M_.io((o) => {
        r.enqueueAndForget(() =>
          p(this, null, function* () {
            ns(this) &&
              (v(
                'RemoteStore',
                'Restarting streams for network reachability change.'
              ),
              yield (function (c) {
                return p(this, null, function* () {
                  let u = F(c)
                  u.v_.add(4),
                    yield ts(u),
                    u.x_.set('Unknown'),
                    u.v_.delete(4),
                    yield ja(u)
                })
              })(this))
          })
        )
      }),
      (this.x_ = new Fh(r, i))
  }
}
function ja(t) {
  return p(this, null, function* () {
    if (ns(t)) for (let e of t.F_) yield e(!0)
  })
}
function ts(t) {
  return p(this, null, function* () {
    for (let e of t.F_) yield e(!1)
  })
}
function $_(t, e) {
  let n = F(t)
  n.C_.has(e.targetId) ||
    (n.C_.set(e.targetId, e), pf(n) ? ff(n) : Ar(n).Jo() && hf(n, e))
}
function H_(t, e) {
  let n = F(t),
    r = Ar(n)
  n.C_.delete(e),
    r.Jo() && q_(n, e),
    n.C_.size === 0 && (r.Jo() ? r.Xo() : ns(n) && n.x_.set('Unknown'))
}
function hf(t, e) {
  if (
    (t.O_.Oe(e.targetId),
    e.resumeToken.approximateByteSize() > 0 ||
      e.snapshotVersion.compareTo(A.min()) > 0)
  ) {
    let n = t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size
    e = e.withExpectedCount(n)
  }
  Ar(t).c_(e)
}
function q_(t, e) {
  t.O_.Oe(e), Ar(t).l_(e)
}
function ff(t) {
  ;(t.O_ = new sh({
    getRemoteKeysForTarget: (e) => t.remoteSyncer.getRemoteKeysForTarget(e),
    _t: (e) => t.C_.get(e) || null,
    nt: () => t.datastore.serializer.databaseId,
  })),
    Ar(t).start(),
    t.x_.p_()
}
function pf(t) {
  return ns(t) && !Ar(t).Ho() && t.C_.size > 0
}
function ns(t) {
  return F(t).v_.size === 0
}
function z_(t) {
  t.O_ = void 0
}
function NN(t) {
  return p(this, null, function* () {
    t.C_.forEach((e, n) => {
      hf(t, e)
    })
  })
}
function RN(t, e) {
  return p(this, null, function* () {
    z_(t), pf(t) ? (t.x_.S_(e), ff(t)) : t.x_.set('Unknown')
  })
}
function xN(t, e, n) {
  return p(this, null, function* () {
    if ((t.x_.set('Online'), e instanceof _a && e.state === 2 && e.cause))
      try {
        yield (function (i, s) {
          return p(this, null, function* () {
            let o = s.cause
            for (let a of s.targetIds)
              i.C_.has(a) &&
                (yield i.remoteSyncer.rejectListen(a, o),
                i.C_.delete(a),
                i.O_.removeTarget(a))
          })
        })(t, e)
      } catch (r) {
        v(
          'RemoteStore',
          'Failed to remove targets %s: %s ',
          e.targetIds.join(','),
          r
        ),
          yield o_(t, r)
      }
    else if (
      (e instanceof lr ? t.O_.$e(e) : e instanceof va ? t.O_.Je(e) : t.O_.Ge(e),
      !n.isEqual(A.min()))
    )
      try {
        let r = yield j_(t.localStore)
        n.compareTo(r) >= 0 &&
          (yield (function (s, o) {
            let a = s.O_.it(o)
            return (
              a.targetChanges.forEach((c, u) => {
                if (c.resumeToken.approximateByteSize() > 0) {
                  let l = s.C_.get(u)
                  l && s.C_.set(u, l.withResumeToken(c.resumeToken, o))
                }
              }),
              a.targetMismatches.forEach((c, u) => {
                let l = s.C_.get(c)
                if (!l) return
                s.C_.set(
                  c,
                  l.withResumeToken(we.EMPTY_BYTE_STRING, l.snapshotVersion)
                ),
                  q_(s, c)
                let d = new Qi(l.target, c, u, l.sequenceNumber)
                hf(s, d)
              }),
              s.remoteSyncer.applyRemoteEvent(a)
            )
          })(t, n))
      } catch (r) {
        v('RemoteStore', 'Failed to raise snapshot:', r), yield o_(t, r)
      }
  })
}
function o_(t, e, n) {
  return p(this, null, function* () {
    if (!es(e)) throw e
    t.v_.add(1),
      yield ts(t),
      t.x_.set('Offline'),
      n || (n = () => j_(t.localStore)),
      t.asyncQueue.enqueueRetryable(() =>
        p(this, null, function* () {
          v('RemoteStore', 'Retrying IndexedDB access'),
            yield n(),
            t.v_.delete(1),
            yield ja(t)
        })
      )
  })
}
function a_(t, e) {
  return p(this, null, function* () {
    let n = F(t)
    n.asyncQueue.verifyOperationInProgress(),
      v('RemoteStore', 'RemoteStore received new credentials')
    let r = ns(n)
    n.v_.add(3),
      yield ts(n),
      r && n.x_.set('Unknown'),
      yield n.remoteSyncer.handleCredentialChange(e),
      n.v_.delete(3),
      yield ja(n)
  })
}
function MN(t, e) {
  return p(this, null, function* () {
    let n = F(t)
    e
      ? (n.v_.delete(2), yield ja(n))
      : e || (n.v_.add(2), yield ts(n), n.x_.set('Unknown'))
  })
}
function Ar(t) {
  return (
    t.N_ ||
      ((t.N_ = (function (n, r, i) {
        let s = F(n)
        return (
          s.R_(),
          new Oh(
            r,
            s.connection,
            s.authCredentials,
            s.appCheckCredentials,
            s.serializer,
            i
          )
        )
      })(t.datastore, t.asyncQueue, {
        Po: NN.bind(null, t),
        To: RN.bind(null, t),
        u_: xN.bind(null, t),
      })),
      t.F_.push((e) =>
        p(this, null, function* () {
          e
            ? (t.N_.Zo(), pf(t) ? ff(t) : t.x_.set('Unknown'))
            : (yield t.N_.stop(), z_(t))
        })
      )),
    t.N_
  )
}
var Vh = class t {
  constructor(e, n, r, i, s) {
    ;(this.asyncQueue = e),
      (this.timerId = n),
      (this.targetTimeMs = r),
      (this.op = i),
      (this.removalCallback = s),
      (this.deferred = new Tt()),
      (this.then = this.deferred.promise.then.bind(this.deferred.promise)),
      this.deferred.promise.catch((o) => {})
  }
  get promise() {
    return this.deferred.promise
  }
  static createAndSchedule(e, n, r, i, s) {
    let o = Date.now() + r,
      a = new t(e, n, o, i, s)
    return a.start(r), a
  }
  start(e) {
    this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e)
  }
  skipDelay() {
    return this.handleDelayElapsed()
  }
  cancel(e) {
    this.timerHandle !== null &&
      (this.clearTimeout(),
      this.deferred.reject(
        new E(m.CANCELLED, 'Operation cancelled' + (e ? ': ' + e : ''))
      ))
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget(() =>
      this.timerHandle !== null
        ? (this.clearTimeout(), this.op().then((e) => this.deferred.resolve(e)))
        : Promise.resolve()
    )
  }
  clearTimeout() {
    this.timerHandle !== null &&
      (this.removalCallback(this),
      clearTimeout(this.timerHandle),
      (this.timerHandle = null))
  }
}
function G_(t, e) {
  if ((at('AsyncQueue', `${e}: ${t}`), es(t)))
    return new E(m.UNAVAILABLE, `${e}: ${t}`)
  throw t
}
var Ca = class t {
  constructor(e) {
    ;(this.comparator = e
      ? (n, r) => e(n, r) || D.comparator(n.key, r.key)
      : (n, r) => D.comparator(n.key, r.key)),
      (this.keyedMap = Fi()),
      (this.sortedSet = new ee(this.comparator))
  }
  static emptySet(e) {
    return new t(e.comparator)
  }
  has(e) {
    return this.keyedMap.get(e) != null
  }
  get(e) {
    return this.keyedMap.get(e)
  }
  first() {
    return this.sortedSet.minKey()
  }
  last() {
    return this.sortedSet.maxKey()
  }
  isEmpty() {
    return this.sortedSet.isEmpty()
  }
  indexOf(e) {
    let n = this.keyedMap.get(e)
    return n ? this.sortedSet.indexOf(n) : -1
  }
  get size() {
    return this.sortedSet.size
  }
  forEach(e) {
    this.sortedSet.inorderTraversal((n, r) => (e(n), !1))
  }
  add(e) {
    let n = this.delete(e.key)
    return n.copy(n.keyedMap.insert(e.key, e), n.sortedSet.insert(e, null))
  }
  delete(e) {
    let n = this.get(e)
    return n
      ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(n))
      : this
  }
  isEqual(e) {
    if (!(e instanceof t) || this.size !== e.size) return !1
    let n = this.sortedSet.getIterator(),
      r = e.sortedSet.getIterator()
    for (; n.hasNext(); ) {
      let i = n.getNext().key,
        s = r.getNext().key
      if (!i.isEqual(s)) return !1
    }
    return !0
  }
  toString() {
    let e = []
    return (
      this.forEach((n) => {
        e.push(n.toString())
      }),
      e.length === 0
        ? 'DocumentSet ()'
        : `DocumentSet (
  ` +
          e.join(`  
`) +
          `
)`
    )
  }
  copy(e, n) {
    let r = new t()
    return (
      (r.comparator = this.comparator), (r.keyedMap = e), (r.sortedSet = n), r
    )
  }
}
var ba = class {
    constructor() {
      this.L_ = new ee(D.comparator)
    }
    track(e) {
      let n = e.doc.key,
        r = this.L_.get(n)
      r
        ? e.type !== 0 && r.type === 3
          ? (this.L_ = this.L_.insert(n, e))
          : e.type === 3 && r.type !== 1
            ? (this.L_ = this.L_.insert(n, { type: r.type, doc: e.doc }))
            : e.type === 2 && r.type === 2
              ? (this.L_ = this.L_.insert(n, { type: 2, doc: e.doc }))
              : e.type === 2 && r.type === 0
                ? (this.L_ = this.L_.insert(n, { type: 0, doc: e.doc }))
                : e.type === 1 && r.type === 0
                  ? (this.L_ = this.L_.remove(n))
                  : e.type === 1 && r.type === 2
                    ? (this.L_ = this.L_.insert(n, { type: 1, doc: r.doc }))
                    : e.type === 0 && r.type === 1
                      ? (this.L_ = this.L_.insert(n, { type: 2, doc: e.doc }))
                      : b()
        : (this.L_ = this.L_.insert(n, e))
    }
    k_() {
      let e = []
      return (
        this.L_.inorderTraversal((n, r) => {
          e.push(r)
        }),
        e
      )
    }
  },
  Cr = class t {
    constructor(e, n, r, i, s, o, a, c, u) {
      ;(this.query = e),
        (this.docs = n),
        (this.oldDocs = r),
        (this.docChanges = i),
        (this.mutatedKeys = s),
        (this.fromCache = o),
        (this.syncStateChanged = a),
        (this.excludesMetadataChanges = c),
        (this.hasCachedResults = u)
    }
    static fromInitialDocuments(e, n, r, i, s) {
      let o = []
      return (
        n.forEach((a) => {
          o.push({ type: 0, doc: a })
        }),
        new t(e, n, Ca.emptySet(n), o, r, i, !0, !1, s)
      )
    }
    get hasPendingWrites() {
      return !this.mutatedKeys.isEmpty()
    }
    isEqual(e) {
      if (
        !(
          this.fromCache === e.fromCache &&
          this.hasCachedResults === e.hasCachedResults &&
          this.syncStateChanged === e.syncStateChanged &&
          this.mutatedKeys.isEqual(e.mutatedKeys) &&
          Va(this.query, e.query) &&
          this.docs.isEqual(e.docs) &&
          this.oldDocs.isEqual(e.oldDocs)
        )
      )
        return !1
      let n = this.docChanges,
        r = e.docChanges
      if (n.length !== r.length) return !1
      for (let i = 0; i < n.length; i++)
        if (n[i].type !== r[i].type || !n[i].doc.isEqual(r[i].doc)) return !1
      return !0
    }
  }
var Uh = class {
    constructor() {
      ;(this.q_ = void 0), (this.Q_ = [])
    }
  },
  jh = class {
    constructor() {
      ;(this.queries = new Ht((e) => D_(e), Va)),
        (this.onlineState = 'Unknown'),
        (this.K_ = new Set())
    }
  }
function PN(t, e) {
  return p(this, null, function* () {
    let n = F(t),
      r = e.query,
      i = !1,
      s = n.queries.get(r)
    if ((s || ((i = !0), (s = new Uh())), i))
      try {
        s.q_ = yield n.onListen(r)
      } catch (o) {
        let a = G_(o, `Initialization of query '${or(e.query)}' failed`)
        return void e.onError(a)
      }
    n.queries.set(r, s),
      s.Q_.push(e),
      e.U_(n.onlineState),
      s.q_ && e.W_(s.q_) && gf(n)
  })
}
function ON(t, e) {
  return p(this, null, function* () {
    let n = F(t),
      r = e.query,
      i = !1,
      s = n.queries.get(r)
    if (s) {
      let o = s.Q_.indexOf(e)
      o >= 0 && (s.Q_.splice(o, 1), (i = s.Q_.length === 0))
    }
    if (i) return n.queries.delete(r), n.onUnlisten(r)
  })
}
function kN(t, e) {
  let n = F(t),
    r = !1
  for (let i of e) {
    let s = i.query,
      o = n.queries.get(s)
    if (o) {
      for (let a of o.Q_) a.W_(i) && (r = !0)
      o.q_ = i
    }
  }
  r && gf(n)
}
function FN(t, e, n) {
  let r = F(t),
    i = r.queries.get(e)
  if (i) for (let s of i.Q_) s.onError(n)
  r.queries.delete(e)
}
function gf(t) {
  t.K_.forEach((e) => {
    e.next()
  })
}
var Bh = class {
  constructor(e, n, r) {
    ;(this.query = e),
      (this.G_ = n),
      (this.z_ = !1),
      (this.j_ = null),
      (this.onlineState = 'Unknown'),
      (this.options = r || {})
  }
  W_(e) {
    if (!this.options.includeMetadataChanges) {
      let r = []
      for (let i of e.docChanges) i.type !== 3 && r.push(i)
      e = new Cr(
        e.query,
        e.docs,
        e.oldDocs,
        r,
        e.mutatedKeys,
        e.fromCache,
        e.syncStateChanged,
        !0,
        e.hasCachedResults
      )
    }
    let n = !1
    return (
      this.z_
        ? this.H_(e) && (this.G_.next(e), (n = !0))
        : this.J_(e, this.onlineState) && (this.Y_(e), (n = !0)),
      (this.j_ = e),
      n
    )
  }
  onError(e) {
    this.G_.error(e)
  }
  U_(e) {
    this.onlineState = e
    let n = !1
    return (
      this.j_ &&
        !this.z_ &&
        this.J_(this.j_, e) &&
        (this.Y_(this.j_), (n = !0)),
      n
    )
  }
  J_(e, n) {
    if (!e.fromCache) return !0
    let r = n !== 'Offline'
    return (
      (!this.options.Z_ || !r) &&
      (!e.docs.isEmpty() || e.hasCachedResults || n === 'Offline')
    )
  }
  H_(e) {
    if (e.docChanges.length > 0) return !0
    let n = this.j_ && this.j_.hasPendingWrites !== e.hasPendingWrites
    return (
      !(!e.syncStateChanged && !n) && this.options.includeMetadataChanges === !0
    )
  }
  Y_(e) {
    ;(e = Cr.fromInitialDocuments(
      e.query,
      e.docs,
      e.mutatedKeys,
      e.fromCache,
      e.hasCachedResults
    )),
      (this.z_ = !0),
      this.G_.next(e)
  }
}
var Aa = class {
    constructor(e) {
      this.key = e
    }
  },
  Sa = class {
    constructor(e) {
      this.key = e
    }
  },
  $h = class {
    constructor(e, n) {
      ;(this.query = e),
        (this.oa = n),
        (this._a = null),
        (this.hasCachedResults = !1),
        (this.current = !1),
        (this.aa = O()),
        (this.mutatedKeys = O()),
        (this.ua = T_(e)),
        (this.ca = new Ca(this.ua))
    }
    get la() {
      return this.oa
    }
    ha(e, n) {
      let r = n ? n.Pa : new ba(),
        i = n ? n.ca : this.ca,
        s = n ? n.mutatedKeys : this.mutatedKeys,
        o = i,
        a = !1,
        c =
          this.query.limitType === 'F' && i.size === this.query.limit
            ? i.last()
            : null,
        u =
          this.query.limitType === 'L' && i.size === this.query.limit
            ? i.first()
            : null
      if (
        (e.inorderTraversal((l, d) => {
          let h = i.get(l),
            f = Ua(this.query, d) ? d : null,
            _ = !!h && this.mutatedKeys.has(h.key),
            w =
              !!f &&
              (f.hasLocalMutations ||
                (this.mutatedKeys.has(f.key) && f.hasCommittedMutations)),
            I = !1
          h && f
            ? h.data.isEqual(f.data)
              ? _ !== w && (r.track({ type: 3, doc: f }), (I = !0))
              : this.Ia(h, f) ||
                (r.track({ type: 2, doc: f }),
                (I = !0),
                ((c && this.ua(f, c) > 0) || (u && this.ua(f, u) < 0)) &&
                  (a = !0))
            : !h && f
              ? (r.track({ type: 0, doc: f }), (I = !0))
              : h &&
                !f &&
                (r.track({ type: 1, doc: h }), (I = !0), (c || u) && (a = !0)),
            I &&
              (f
                ? ((o = o.add(f)), (s = w ? s.add(l) : s.delete(l)))
                : ((o = o.delete(l)), (s = s.delete(l))))
        }),
        this.query.limit !== null)
      )
        for (; o.size > this.query.limit; ) {
          let l = this.query.limitType === 'F' ? o.last() : o.first()
          ;(o = o.delete(l.key)),
            (s = s.delete(l.key)),
            r.track({ type: 1, doc: l })
        }
      return { ca: o, Pa: r, Xi: a, mutatedKeys: s }
    }
    Ia(e, n) {
      return (
        e.hasLocalMutations && n.hasCommittedMutations && !n.hasLocalMutations
      )
    }
    applyChanges(e, n, r, i) {
      let s = this.ca
      ;(this.ca = e.ca), (this.mutatedKeys = e.mutatedKeys)
      let o = e.Pa.k_()
      o.sort(
        (l, d) =>
          (function (f, _) {
            let w = (I) => {
              switch (I) {
                case 0:
                  return 1
                case 2:
                case 3:
                  return 2
                case 1:
                  return 0
                default:
                  return b()
              }
            }
            return w(f) - w(_)
          })(l.type, d.type) || this.ua(l.doc, d.doc)
      ),
        this.Ta(r),
        (i = i != null && i)
      let a = n && !i ? this.Ea() : [],
        c = this.aa.size === 0 && this.current && !i ? 1 : 0,
        u = c !== this._a
      return (
        (this._a = c),
        o.length !== 0 || u
          ? {
              snapshot: new Cr(
                this.query,
                e.ca,
                s,
                o,
                e.mutatedKeys,
                c === 0,
                u,
                !1,
                !!r && r.resumeToken.approximateByteSize() > 0
              ),
              da: a,
            }
          : { da: a }
      )
    }
    U_(e) {
      return this.current && e === 'Offline'
        ? ((this.current = !1),
          this.applyChanges(
            {
              ca: this.ca,
              Pa: new ba(),
              mutatedKeys: this.mutatedKeys,
              Xi: !1,
            },
            !1
          ))
        : { da: [] }
    }
    Aa(e) {
      return (
        !this.oa.has(e) && !!this.ca.has(e) && !this.ca.get(e).hasLocalMutations
      )
    }
    Ta(e) {
      e &&
        (e.addedDocuments.forEach((n) => (this.oa = this.oa.add(n))),
        e.modifiedDocuments.forEach((n) => {}),
        e.removedDocuments.forEach((n) => (this.oa = this.oa.delete(n))),
        (this.current = e.current))
    }
    Ea() {
      if (!this.current) return []
      let e = this.aa
      ;(this.aa = O()),
        this.ca.forEach((r) => {
          this.Aa(r.key) && (this.aa = this.aa.add(r.key))
        })
      let n = []
      return (
        e.forEach((r) => {
          this.aa.has(r) || n.push(new Sa(r))
        }),
        this.aa.forEach((r) => {
          e.has(r) || n.push(new Aa(r))
        }),
        n
      )
    }
    Ra(e) {
      ;(this.oa = e.hs), (this.aa = O())
      let n = this.ha(e.documents)
      return this.applyChanges(n, !0)
    }
    Va() {
      return Cr.fromInitialDocuments(
        this.query,
        this.ca,
        this.mutatedKeys,
        this._a === 0,
        this.hasCachedResults
      )
    }
  },
  Hh = class {
    constructor(e, n, r) {
      ;(this.query = e), (this.targetId = n), (this.view = r)
    }
  },
  qh = class {
    constructor(e) {
      ;(this.key = e), (this.ma = !1)
    }
  },
  zh = class {
    constructor(e, n, r, i, s, o) {
      ;(this.localStore = e),
        (this.remoteStore = n),
        (this.eventManager = r),
        (this.sharedClientState = i),
        (this.currentUser = s),
        (this.maxConcurrentLimboResolutions = o),
        (this.fa = {}),
        (this.ga = new Ht((a) => D_(a), Va)),
        (this.pa = new Map()),
        (this.ya = new Set()),
        (this.wa = new ee(D.comparator)),
        (this.Sa = new Map()),
        (this.ba = new Ji()),
        (this.Da = {}),
        (this.Ca = new Map()),
        (this.va = Yi.Bn()),
        (this.onlineState = 'Unknown'),
        (this.Fa = void 0)
    }
    get isPrimaryClient() {
      return this.Fa === !0
    }
  }
function LN(t, e) {
  return p(this, null, function* () {
    let n = qN(t),
      r,
      i,
      s = n.ga.get(e)
    if (s)
      (r = s.targetId),
        n.sharedClientState.addLocalQueryTarget(r),
        (i = s.view.Va())
    else {
      let o = yield bN(n.localStore, ot(e)),
        a = n.sharedClientState.addLocalQueryTarget(o.targetId)
      ;(r = o.targetId),
        (i = yield VN(n, e, r, a === 'current', o.resumeToken)),
        n.isPrimaryClient && $_(n.remoteStore, o)
    }
    return i
  })
}
function VN(t, e, n, r, i) {
  return p(this, null, function* () {
    t.Ma = (d, h, f) =>
      (function (w, I, P, L) {
        return p(this, null, function* () {
          let z = I.view.ha(P)
          z.Xi &&
            (z = yield s_(w.localStore, I.query, !1).then(({ documents: Te }) =>
              I.view.ha(Te, z)
            ))
          let B = L && L.targetChanges.get(I.targetId),
            Z = L && L.targetMismatches.get(I.targetId) != null,
            $ = I.view.applyChanges(z, w.isPrimaryClient, B, Z)
          return u_(w, I.targetId, $.da), $.snapshot
        })
      })(t, d, h, f)
    let s = yield s_(t.localStore, e, !0),
      o = new $h(e, s.hs),
      a = o.ha(s.documents),
      c = Ki.createSynthesizedTargetChangeForCurrentChange(
        n,
        r && t.onlineState !== 'Offline',
        i
      ),
      u = o.applyChanges(a, t.isPrimaryClient, c)
    u_(t, n, u.da)
    let l = new Hh(e, n, o)
    return (
      t.ga.set(e, l),
      t.pa.has(n) ? t.pa.get(n).push(e) : t.pa.set(n, [e]),
      u.snapshot
    )
  })
}
function UN(t, e) {
  return p(this, null, function* () {
    let n = F(t),
      r = n.ga.get(e),
      i = n.pa.get(r.targetId)
    if (i.length > 1)
      return (
        n.pa.set(
          r.targetId,
          i.filter((s) => !Va(s, e))
        ),
        void n.ga.delete(e)
      )
    n.isPrimaryClient
      ? (n.sharedClientState.removeLocalQueryTarget(r.targetId),
        n.sharedClientState.isActiveQueryTarget(r.targetId) ||
          (yield Sh(n.localStore, r.targetId, !1)
            .then(() => {
              n.sharedClientState.clearQueryState(r.targetId),
                H_(n.remoteStore, r.targetId),
                Gh(n, r.targetId)
            })
            .catch(rf)))
      : (Gh(n, r.targetId), yield Sh(n.localStore, r.targetId, !0))
  })
}
function W_(t, e) {
  return p(this, null, function* () {
    let n = F(t)
    try {
      let r = yield TN(n.localStore, e)
      e.targetChanges.forEach((i, s) => {
        let o = n.Sa.get(s)
        o &&
          (ie(
            i.addedDocuments.size +
              i.modifiedDocuments.size +
              i.removedDocuments.size <=
              1
          ),
          i.addedDocuments.size > 0
            ? (o.ma = !0)
            : i.modifiedDocuments.size > 0
              ? ie(o.ma)
              : i.removedDocuments.size > 0 && (ie(o.ma), (o.ma = !1)))
      }),
        yield Q_(n, r, e)
    } catch (r) {
      yield rf(r)
    }
  })
}
function c_(t, e, n) {
  let r = F(t)
  if ((r.isPrimaryClient && n === 0) || (!r.isPrimaryClient && n === 1)) {
    let i = []
    r.ga.forEach((s, o) => {
      let a = o.view.U_(e)
      a.snapshot && i.push(a.snapshot)
    }),
      (function (o, a) {
        let c = F(o)
        c.onlineState = a
        let u = !1
        c.queries.forEach((l, d) => {
          for (let h of d.Q_) h.U_(a) && (u = !0)
        }),
          u && gf(c)
      })(r.eventManager, e),
      i.length && r.fa.u_(i),
      (r.onlineState = e),
      r.isPrimaryClient && r.sharedClientState.setOnlineState(e)
  }
}
function jN(t, e, n) {
  return p(this, null, function* () {
    let r = F(t)
    r.sharedClientState.updateQueryState(e, 'rejected', n)
    let i = r.Sa.get(e),
      s = i && i.key
    if (s) {
      let o = new ee(D.comparator)
      o = o.insert(s, Ge.newNoDocument(s, A.min()))
      let a = O().add(s),
        c = new ya(A.min(), new Map(), new ee(V), o, a)
      yield W_(r, c), (r.wa = r.wa.remove(s)), r.Sa.delete(e), mf(r)
    } else
      yield Sh(r.localStore, e, !1)
        .then(() => Gh(r, e, n))
        .catch(rf)
  })
}
function Gh(t, e, n = null) {
  t.sharedClientState.removeLocalQueryTarget(e)
  for (let r of t.pa.get(e)) t.ga.delete(r), n && t.fa.xa(r, n)
  t.pa.delete(e),
    t.isPrimaryClient &&
      t.ba.Vr(e).forEach((r) => {
        t.ba.containsKey(r) || K_(t, r)
      })
}
function K_(t, e) {
  t.ya.delete(e.path.canonicalString())
  let n = t.wa.get(e)
  n !== null &&
    (H_(t.remoteStore, n), (t.wa = t.wa.remove(e)), t.Sa.delete(n), mf(t))
}
function u_(t, e, n) {
  for (let r of n)
    r instanceof Aa
      ? (t.ba.addReference(r.key, e), BN(t, r))
      : r instanceof Sa
        ? (v('SyncEngine', 'Document no longer in limbo: ' + r.key),
          t.ba.removeReference(r.key, e),
          t.ba.containsKey(r.key) || K_(t, r.key))
        : b()
}
function BN(t, e) {
  let n = e.key,
    r = n.path.canonicalString()
  t.wa.get(n) ||
    t.ya.has(r) ||
    (v('SyncEngine', 'New document in limbo: ' + n), t.ya.add(r), mf(t))
}
function mf(t) {
  for (; t.ya.size > 0 && t.wa.size < t.maxConcurrentLimboResolutions; ) {
    let e = t.ya.values().next().value
    t.ya.delete(e)
    let n = new D(re.fromString(e)),
      r = t.va.next()
    t.Sa.set(r, new qh(n)),
      (t.wa = t.wa.insert(n, r)),
      $_(
        t.remoteStore,
        new Qi(ot(df(n.path)), r, 'TargetPurposeLimboResolution', m_._e)
      )
  }
}
function Q_(t, e, n) {
  return p(this, null, function* () {
    let r = F(t),
      i = [],
      s = [],
      o = []
    r.ga.isEmpty() ||
      (r.ga.forEach((a, c) => {
        o.push(
          r.Ma(c, e, n).then((u) => {
            if (
              ((u || n) &&
                r.isPrimaryClient &&
                r.sharedClientState.updateQueryState(
                  c.targetId,
                  u?.fromCache ? 'not-current' : 'current'
                ),
              u)
            ) {
              i.push(u)
              let l = Th.Ki(c.targetId, u)
              s.push(l)
            }
          })
        )
      }),
      yield Promise.all(o),
      r.fa.u_(i),
      yield (function (c, u) {
        return p(this, null, function* () {
          let l = F(c)
          try {
            yield l.persistence.runTransaction(
              'notifyLocalViewChanges',
              'readwrite',
              (d) =>
                g.forEach(u, (h) =>
                  g
                    .forEach(h.qi, (f) =>
                      l.persistence.referenceDelegate.addReference(
                        d,
                        h.targetId,
                        f
                      )
                    )
                    .next(() =>
                      g.forEach(h.Qi, (f) =>
                        l.persistence.referenceDelegate.removeReference(
                          d,
                          h.targetId,
                          f
                        )
                      )
                    )
                )
            )
          } catch (d) {
            if (!es(d)) throw d
            v('LocalStore', 'Failed to update sequence numbers: ' + d)
          }
          for (let d of u) {
            let h = d.targetId
            if (!d.fromCache) {
              let f = l.ns.get(h),
                _ = f.snapshotVersion,
                w = f.withLastLimboFreeSnapshotVersion(_)
              l.ns = l.ns.insert(h, w)
            }
          }
        })
      })(r.localStore, s))
  })
}
function $N(t, e) {
  return p(this, null, function* () {
    let n = F(t)
    if (!n.currentUser.isEqual(e)) {
      v('SyncEngine', 'User change. New user:', e.toKey())
      let r = yield U_(n.localStore, e)
      ;(n.currentUser = e),
        (function (s, o) {
          s.Ca.forEach((a) => {
            a.forEach((c) => {
              c.reject(new E(m.CANCELLED, o))
            })
          }),
            s.Ca.clear()
        })(
          n,
          "'waitForPendingWrites' promise is rejected due to a user change."
        ),
        n.sharedClientState.handleUserChange(
          e,
          r.removedBatchIds,
          r.addedBatchIds
        ),
        yield Q_(n, r.us)
    }
  })
}
function HN(t, e) {
  let n = F(t),
    r = n.Sa.get(e)
  if (r && r.ma) return O().add(r.key)
  {
    let i = O(),
      s = n.pa.get(e)
    if (!s) return i
    for (let o of s) {
      let a = n.ga.get(o)
      i = i.unionWith(a.view.la)
    }
    return i
  }
}
function qN(t) {
  let e = F(t)
  return (
    (e.remoteStore.remoteSyncer.applyRemoteEvent = W_.bind(null, e)),
    (e.remoteStore.remoteSyncer.getRemoteKeysForTarget = HN.bind(null, e)),
    (e.remoteStore.remoteSyncer.rejectListen = jN.bind(null, e)),
    (e.fa.u_ = kN.bind(null, e.eventManager)),
    (e.fa.xa = FN.bind(null, e.eventManager)),
    e
  )
}
var Na = class {
  constructor() {
    this.synchronizeTabs = !1
  }
  initialize(e) {
    return p(this, null, function* () {
      ;(this.serializer = B_(e.databaseInfo.databaseId)),
        (this.sharedClientState = this.createSharedClientState(e)),
        (this.persistence = this.createPersistence(e)),
        yield this.persistence.start(),
        (this.localStore = this.createLocalStore(e)),
        (this.gcScheduler = this.createGarbageCollectionScheduler(
          e,
          this.localStore
        )),
        (this.indexBackfillerScheduler = this.createIndexBackfillerScheduler(
          e,
          this.localStore
        ))
    })
  }
  createGarbageCollectionScheduler(e, n) {
    return null
  }
  createIndexBackfillerScheduler(e, n) {
    return null
  }
  createLocalStore(e) {
    return DN(this.persistence, new bh(), e.initialUser, this.serializer)
  }
  createPersistence(e) {
    return new Eh(Dh.Hr, this.serializer)
  }
  createSharedClientState(e) {
    return new Nh()
  }
  terminate() {
    return p(this, null, function* () {
      var e, n
      ;(e = this.gcScheduler) === null || e === void 0 || e.stop(),
        (n = this.indexBackfillerScheduler) === null ||
          n === void 0 ||
          n.stop(),
        this.sharedClientState.shutdown(),
        yield this.persistence.shutdown()
    })
  }
}
var Wh = class {
  initialize(e, n) {
    return p(this, null, function* () {
      this.localStore ||
        ((this.localStore = e.localStore),
        (this.sharedClientState = e.sharedClientState),
        (this.datastore = this.createDatastore(n)),
        (this.remoteStore = this.createRemoteStore(n)),
        (this.eventManager = this.createEventManager(n)),
        (this.syncEngine = this.createSyncEngine(n, !e.synchronizeTabs)),
        (this.sharedClientState.onlineStateHandler = (r) =>
          c_(this.syncEngine, r, 1)),
        (this.remoteStore.remoteSyncer.handleCredentialChange = $N.bind(
          null,
          this.syncEngine
        )),
        yield MN(this.remoteStore, this.syncEngine.isPrimaryClient))
    })
  }
  createEventManager(e) {
    return (function () {
      return new jh()
    })()
  }
  createDatastore(e) {
    let n = B_(e.databaseInfo.databaseId),
      r = (function (s) {
        return new Mh(s)
      })(e.databaseInfo)
    return (function (s, o, a, c) {
      return new kh(s, o, a, c)
    })(e.authCredentials, e.appCheckCredentials, r, n)
  }
  createRemoteStore(e) {
    return (function (r, i, s, o, a) {
      return new Lh(r, i, s, o, a)
    })(
      this.localStore,
      this.datastore,
      e.asyncQueue,
      (n) => c_(this.syncEngine, n, 0),
      (function () {
        return Da.D() ? new Da() : new Rh()
      })()
    )
  }
  createSyncEngine(e, n) {
    return (function (i, s, o, a, c, u, l) {
      let d = new zh(i, s, o, a, c, u)
      return l && (d.Fa = !0), d
    })(
      this.localStore,
      this.remoteStore,
      this.eventManager,
      this.sharedClientState,
      e.initialUser,
      e.maxConcurrentLimboResolutions,
      n
    )
  }
  terminate() {
    return p(this, null, function* () {
      var e
      yield (function (r) {
        return p(this, null, function* () {
          let i = F(r)
          v('RemoteStore', 'RemoteStore shutting down.'),
            i.v_.add(5),
            yield ts(i),
            i.M_.shutdown(),
            i.x_.set('Unknown')
        })
      })(this.remoteStore),
        (e = this.datastore) === null || e === void 0 || e.terminate()
    })
  }
}
var Kh = class {
  constructor(e) {
    ;(this.observer = e), (this.muted = !1)
  }
  next(e) {
    this.observer.next && this.Ba(this.observer.next, e)
  }
  error(e) {
    this.observer.error
      ? this.Ba(this.observer.error, e)
      : at('Uncaught Error in snapshot listener:', e.toString())
  }
  La() {
    this.muted = !0
  }
  Ba(e, n) {
    this.muted ||
      setTimeout(() => {
        this.muted || e(n)
      }, 0)
  }
}
var Qh = class {
  constructor(e, n, r, i) {
    ;(this.authCredentials = e),
      (this.appCheckCredentials = n),
      (this.asyncQueue = r),
      (this.databaseInfo = i),
      (this.user = ue.UNAUTHENTICATED),
      (this.clientId = Od.newId()),
      (this.authCredentialListener = () => Promise.resolve()),
      (this.appCheckCredentialListener = () => Promise.resolve()),
      this.authCredentials.start(r, (s) =>
        p(this, null, function* () {
          v('FirestoreClient', 'Received user=', s.uid),
            yield this.authCredentialListener(s),
            (this.user = s)
        })
      ),
      this.appCheckCredentials.start(
        r,
        (s) => (
          v('FirestoreClient', 'Received new app check token=', s),
          this.appCheckCredentialListener(s, this.user)
        )
      )
  }
  get configuration() {
    return {
      asyncQueue: this.asyncQueue,
      databaseInfo: this.databaseInfo,
      clientId: this.clientId,
      authCredentials: this.authCredentials,
      appCheckCredentials: this.appCheckCredentials,
      initialUser: this.user,
      maxConcurrentLimboResolutions: 100,
    }
  }
  setCredentialChangeListener(e) {
    this.authCredentialListener = e
  }
  setAppCheckTokenChangeListener(e) {
    this.appCheckCredentialListener = e
  }
  verifyNotTerminated() {
    if (this.asyncQueue.isShuttingDown)
      throw new E(
        m.FAILED_PRECONDITION,
        'The client has already been terminated.'
      )
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode()
    let e = new Tt()
    return (
      this.asyncQueue.enqueueAndForgetEvenWhileRestricted(() =>
        p(this, null, function* () {
          try {
            this._onlineComponents &&
              (yield this._onlineComponents.terminate()),
              this._offlineComponents &&
                (yield this._offlineComponents.terminate()),
              this.authCredentials.shutdown(),
              this.appCheckCredentials.shutdown(),
              e.resolve()
          } catch (n) {
            let r = G_(n, 'Failed to shutdown persistence')
            e.reject(r)
          }
        })
      ),
      e.promise
    )
  }
}
function bd(t, e) {
  return p(this, null, function* () {
    t.asyncQueue.verifyOperationInProgress(),
      v('FirestoreClient', 'Initializing OfflineComponentProvider')
    let n = t.configuration
    yield e.initialize(n)
    let r = n.initialUser
    t.setCredentialChangeListener((i) =>
      p(this, null, function* () {
        r.isEqual(i) || (yield U_(e.localStore, i), (r = i))
      })
    ),
      e.persistence.setDatabaseDeletedListener(() => t.terminate()),
      (t._offlineComponents = e)
  })
}
function l_(t, e) {
  return p(this, null, function* () {
    t.asyncQueue.verifyOperationInProgress()
    let n = yield GN(t)
    v('FirestoreClient', 'Initializing OnlineComponentProvider'),
      yield e.initialize(n, t.configuration),
      t.setCredentialChangeListener((r) => a_(e.remoteStore, r)),
      t.setAppCheckTokenChangeListener((r, i) => a_(e.remoteStore, i)),
      (t._onlineComponents = e)
  })
}
function zN(t) {
  return t.name === 'FirebaseError'
    ? t.code === m.FAILED_PRECONDITION || t.code === m.UNIMPLEMENTED
    : !(typeof DOMException < 'u' && t instanceof DOMException) ||
        t.code === 22 ||
        t.code === 20 ||
        t.code === 11
}
function GN(t) {
  return p(this, null, function* () {
    if (!t._offlineComponents)
      if (t._uninitializedComponentsProvider) {
        v('FirestoreClient', 'Using user provided OfflineComponentProvider')
        try {
          yield bd(t, t._uninitializedComponentsProvider._offline)
        } catch (e) {
          let n = e
          if (!zN(n)) throw n
          pr(
            'Error using user provided cache. Falling back to memory cache: ' +
              n
          ),
            yield bd(t, new Na())
        }
      } else
        v('FirestoreClient', 'Using default OfflineComponentProvider'),
          yield bd(t, new Na())
    return t._offlineComponents
  })
}
function WN(t) {
  return p(this, null, function* () {
    return (
      t._onlineComponents ||
        (t._uninitializedComponentsProvider
          ? (v(
              'FirestoreClient',
              'Using user provided OnlineComponentProvider'
            ),
            yield l_(t, t._uninitializedComponentsProvider._online))
          : (v('FirestoreClient', 'Using default OnlineComponentProvider'),
            yield l_(t, new Wh()))),
      t._onlineComponents
    )
  })
}
function d_(t) {
  return p(this, null, function* () {
    let e = yield WN(t),
      n = e.eventManager
    return (
      (n.onListen = LN.bind(null, e.syncEngine)),
      (n.onUnlisten = UN.bind(null, e.syncEngine)),
      n
    )
  })
}
function Y_(t) {
  let e = {}
  return t.timeoutSeconds !== void 0 && (e.timeoutSeconds = t.timeoutSeconds), e
}
var h_ = new Map()
function KN(t, e, n) {
  if (!n)
    throw new E(
      m.INVALID_ARGUMENT,
      `Function ${t}() cannot be called with an empty ${e}.`
    )
}
function QN(t, e, n, r) {
  if (e === !0 && r === !0)
    throw new E(m.INVALID_ARGUMENT, `${t} and ${n} cannot be used together.`)
}
function f_(t) {
  if (D.isDocumentKey(t))
    throw new E(
      m.INVALID_ARGUMENT,
      `Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`
    )
}
function YN(t) {
  if (t === void 0) return 'undefined'
  if (t === null) return 'null'
  if (typeof t == 'string')
    return t.length > 20 && (t = `${t.substring(0, 20)}...`), JSON.stringify(t)
  if (typeof t == 'number' || typeof t == 'boolean') return '' + t
  if (typeof t == 'object') {
    if (t instanceof Array) return 'an array'
    {
      let e = (function (r) {
        return r.constructor ? r.constructor.name : null
      })(t)
      return e ? `a custom ${e} object` : 'an object'
    }
  }
  return typeof t == 'function' ? 'a function' : b()
}
function ca(t, e) {
  if (('_delegate' in t && (t = t._delegate), !(t instanceof e))) {
    if (e.name === t.constructor.name)
      throw new E(
        m.INVALID_ARGUMENT,
        'Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?'
      )
    {
      let n = YN(t)
      throw new E(
        m.INVALID_ARGUMENT,
        `Expected type '${e.name}', but it was: ${n}`
      )
    }
  }
  return t
}
var Ra = class {
    constructor(e) {
      var n, r
      if (e.host === void 0) {
        if (e.ssl !== void 0)
          throw new E(
            m.INVALID_ARGUMENT,
            "Can't provide ssl option if host option is not set"
          )
        ;(this.host = 'firestore.googleapis.com'), (this.ssl = !0)
      } else
        (this.host = e.host),
          (this.ssl = (n = e.ssl) === null || n === void 0 || n)
      if (
        ((this.credentials = e.credentials),
        (this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties),
        (this.localCache = e.localCache),
        e.cacheSizeBytes === void 0)
      )
        this.cacheSizeBytes = 41943040
      else {
        if (e.cacheSizeBytes !== -1 && e.cacheSizeBytes < 1048576)
          throw new E(
            m.INVALID_ARGUMENT,
            'cacheSizeBytes must be at least 1048576'
          )
        this.cacheSizeBytes = e.cacheSizeBytes
      }
      QN(
        'experimentalForceLongPolling',
        e.experimentalForceLongPolling,
        'experimentalAutoDetectLongPolling',
        e.experimentalAutoDetectLongPolling
      ),
        (this.experimentalForceLongPolling = !!e.experimentalForceLongPolling),
        this.experimentalForceLongPolling
          ? (this.experimentalAutoDetectLongPolling = !1)
          : e.experimentalAutoDetectLongPolling === void 0
            ? (this.experimentalAutoDetectLongPolling = !0)
            : (this.experimentalAutoDetectLongPolling =
                !!e.experimentalAutoDetectLongPolling),
        (this.experimentalLongPollingOptions = Y_(
          (r = e.experimentalLongPollingOptions) !== null && r !== void 0
            ? r
            : {}
        )),
        (function (s) {
          if (s.timeoutSeconds !== void 0) {
            if (isNaN(s.timeoutSeconds))
              throw new E(
                m.INVALID_ARGUMENT,
                `invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`
              )
            if (s.timeoutSeconds < 5)
              throw new E(
                m.INVALID_ARGUMENT,
                `invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`
              )
            if (s.timeoutSeconds > 30)
              throw new E(
                m.INVALID_ARGUMENT,
                `invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`
              )
          }
        })(this.experimentalLongPollingOptions),
        (this.useFetchStreams = !!e.useFetchStreams)
    }
    isEqual(e) {
      return (
        this.host === e.host &&
        this.ssl === e.ssl &&
        this.credentials === e.credentials &&
        this.cacheSizeBytes === e.cacheSizeBytes &&
        this.experimentalForceLongPolling === e.experimentalForceLongPolling &&
        this.experimentalAutoDetectLongPolling ===
          e.experimentalAutoDetectLongPolling &&
        (function (r, i) {
          return r.timeoutSeconds === i.timeoutSeconds
        })(
          this.experimentalLongPollingOptions,
          e.experimentalLongPollingOptions
        ) &&
        this.ignoreUndefinedProperties === e.ignoreUndefinedProperties &&
        this.useFetchStreams === e.useFetchStreams
      )
    }
  },
  Zi = class {
    constructor(e, n, r, i) {
      ;(this._authCredentials = e),
        (this._appCheckCredentials = n),
        (this._databaseId = r),
        (this._app = i),
        (this.type = 'firestore-lite'),
        (this._persistenceKey = '(lite)'),
        (this._settings = new Ra({})),
        (this._settingsFrozen = !1)
    }
    get app() {
      if (!this._app)
        throw new E(
          m.FAILED_PRECONDITION,
          "Firestore was not initialized using the Firebase SDK. 'app' is not available"
        )
      return this._app
    }
    get _initialized() {
      return this._settingsFrozen
    }
    get _terminated() {
      return this._terminateTask !== void 0
    }
    _setSettings(e) {
      if (this._settingsFrozen)
        throw new E(
          m.FAILED_PRECONDITION,
          'Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.'
        )
      ;(this._settings = new Ra(e)),
        e.credentials !== void 0 &&
          (this._authCredentials = (function (r) {
            if (!r) return new Ad()
            switch (r.type) {
              case 'firstParty':
                return new xd(
                  r.sessionIndex || '0',
                  r.iamToken || null,
                  r.authTokenFactory || null
                )
              case 'provider':
                return r.client
              default:
                throw new E(
                  m.INVALID_ARGUMENT,
                  'makeAuthCredentialsProvider failed due to invalid credential type'
                )
            }
          })(e.credentials))
    }
    _getSettings() {
      return this._settings
    }
    _freezeSettings() {
      return (this._settingsFrozen = !0), this._settings
    }
    _delete() {
      return (
        this._terminateTask || (this._terminateTask = this._terminate()),
        this._terminateTask
      )
    }
    toJSON() {
      return {
        app: this._app,
        databaseId: this._databaseId,
        settings: this._settings,
      }
    }
    _terminate() {
      return (
        (function (n) {
          let r = h_.get(n)
          r &&
            (v('ComponentProvider', 'Removing Datastore'),
            h_.delete(n),
            r.terminate())
        })(this),
        Promise.resolve()
      )
    }
  }
function J_(t, e, n, r = {}) {
  var i
  let s = (t = ca(t, Zi))._getSettings(),
    o = `${e}:${n}`
  if (
    (s.host !== 'firestore.googleapis.com' &&
      s.host !== o &&
      pr(
        'Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.'
      ),
    t._setSettings(Object.assign(Object.assign({}, s), { host: o, ssl: !1 })),
    r.mockUserToken)
  ) {
    let a, c
    if (typeof r.mockUserToken == 'string')
      (a = r.mockUserToken), (c = ue.MOCK_USER)
    else {
      a = km(
        r.mockUserToken,
        (i = t._app) === null || i === void 0 ? void 0 : i.options.projectId
      )
      let u = r.mockUserToken.sub || r.mockUserToken.user_id
      if (!u)
        throw new E(
          m.INVALID_ARGUMENT,
          "mockUserToken must contain 'sub' or 'user_id' field!"
        )
      c = new ue(u)
    }
    t._authCredentials = new Sd(new ua(a, c))
  }
}
var xa = class t {
    constructor(e, n, r) {
      ;(this.converter = n),
        (this._query = r),
        (this.type = 'query'),
        (this.firestore = e)
    }
    withConverter(e) {
      return new t(this.firestore, e, this._query)
    }
  },
  An = class t {
    constructor(e, n, r) {
      ;(this.converter = n),
        (this._key = r),
        (this.type = 'document'),
        (this.firestore = e)
    }
    get _path() {
      return this._key.path
    }
    get id() {
      return this._key.path.lastSegment()
    }
    get path() {
      return this._key.path.canonicalString()
    }
    get parent() {
      return new hr(this.firestore, this.converter, this._key.path.popLast())
    }
    withConverter(e) {
      return new t(this.firestore, e, this._key)
    }
  },
  hr = class t extends xa {
    constructor(e, n, r) {
      super(e, n, df(r)), (this._path = r), (this.type = 'collection')
    }
    get id() {
      return this._query.path.lastSegment()
    }
    get path() {
      return this._query.path.canonicalString()
    }
    get parent() {
      let e = this._path.popLast()
      return e.isEmpty() ? null : new An(this.firestore, null, new D(e))
    }
    withConverter(e) {
      return new t(this.firestore, e, this._path)
    }
  }
function Z_(t, e, ...n) {
  if (((t = Ot(t)), KN('collection', 'path', e), t instanceof Zi)) {
    let r = re.fromString(e, ...n)
    return f_(r), new hr(t, null, r)
  }
  {
    if (!(t instanceof An || t instanceof hr))
      throw new E(
        m.INVALID_ARGUMENT,
        'Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore'
      )
    let r = t._path.child(re.fromString(e, ...n))
    return f_(r), new hr(t.firestore, null, r)
  }
}
var Yh = class {
  constructor() {
    ;(this.Xa = Promise.resolve()),
      (this.eu = []),
      (this.tu = !1),
      (this.nu = []),
      (this.ru = null),
      (this.iu = !1),
      (this.su = !1),
      (this.ou = []),
      (this.jo = new Ta(this, 'async_queue_retry')),
      (this._u = () => {
        let n = Cd()
        n &&
          v('AsyncQueue', 'Visibility state changed to ' + n.visibilityState),
          this.jo.Ko()
      })
    let e = Cd()
    e &&
      typeof e.addEventListener == 'function' &&
      e.addEventListener('visibilitychange', this._u)
  }
  get isShuttingDown() {
    return this.tu
  }
  enqueueAndForget(e) {
    this.enqueue(e)
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    this.au(), this.uu(e)
  }
  enterRestrictedMode(e) {
    if (!this.tu) {
      ;(this.tu = !0), (this.su = e || !1)
      let n = Cd()
      n &&
        typeof n.removeEventListener == 'function' &&
        n.removeEventListener('visibilitychange', this._u)
    }
  }
  enqueue(e) {
    if ((this.au(), this.tu)) return new Promise(() => {})
    let n = new Tt()
    return this.uu(() =>
      this.tu && this.su
        ? Promise.resolve()
        : (e().then(n.resolve, n.reject), n.promise)
    ).then(() => n.promise)
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.eu.push(e), this.cu()))
  }
  cu() {
    return p(this, null, function* () {
      if (this.eu.length !== 0) {
        try {
          yield this.eu[0](), this.eu.shift(), this.jo.reset()
        } catch (e) {
          if (!es(e)) throw e
          v('AsyncQueue', 'Operation failed with retryable error: ' + e)
        }
        this.eu.length > 0 && this.jo.qo(() => this.cu())
      }
    })
  }
  uu(e) {
    let n = this.Xa.then(
      () => (
        (this.iu = !0),
        e()
          .catch((r) => {
            ;(this.ru = r), (this.iu = !1)
            let i = (function (o) {
              let a = o.message || ''
              return (
                o.stack &&
                  (a = o.stack.includes(o.message)
                    ? o.stack
                    : o.message +
                      `
` +
                      o.stack),
                a
              )
            })(r)
            throw (at('INTERNAL UNHANDLED ERROR: ', i), r)
          })
          .then((r) => ((this.iu = !1), r))
      )
    )
    return (this.Xa = n), n
  }
  enqueueAfterDelay(e, n, r) {
    this.au(), this.ou.indexOf(e) > -1 && (n = 0)
    let i = Vh.createAndSchedule(this, e, n, r, (s) => this.lu(s))
    return this.nu.push(i), i
  }
  au() {
    this.ru && b()
  }
  verifyOperationInProgress() {}
  hu() {
    return p(this, null, function* () {
      let e
      do (e = this.Xa), yield e
      while (e !== this.Xa)
    })
  }
  Pu(e) {
    for (let n of this.nu) if (n.timerId === e) return !0
    return !1
  }
  Iu(e) {
    return this.hu().then(() => {
      this.nu.sort((n, r) => n.targetTimeMs - r.targetTimeMs)
      for (let n of this.nu)
        if ((n.skipDelay(), e !== 'all' && n.timerId === e)) break
      return this.hu()
    })
  }
  Tu(e) {
    this.ou.push(e)
  }
  lu(e) {
    let n = this.nu.indexOf(e)
    this.nu.splice(n, 1)
  }
}
function p_(t) {
  return (function (n, r) {
    if (typeof n != 'object' || n === null) return !1
    let i = n
    for (let s of r) if (s in i && typeof i[s] == 'function') return !0
    return !1
  })(t, ['next', 'error', 'complete'])
}
var Xi = class extends Zi {
  constructor(e, n, r, i) {
    super(e, n, r, i),
      (this.type = 'firestore'),
      (this._queue = (function () {
        return new Yh()
      })()),
      (this._persistenceKey = i?.name || '[DEFAULT]')
  }
  _terminate() {
    return this._firestoreClient || eI(this), this._firestoreClient.terminate()
  }
}
function X_(t, e) {
  let n = typeof t == 'object' ? t : si(),
    r = typeof t == 'string' ? t : e || '(default)',
    i = pl(n, 'firestore').getImmediate({ identifier: r })
  if (!i._initialized) {
    let s = Pm('firestore')
    s && J_(i, ...s)
  }
  return i
}
function JN(t) {
  return (
    t._firestoreClient || eI(t),
    t._firestoreClient.verifyNotTerminated(),
    t._firestoreClient
  )
}
function eI(t) {
  var e, n, r
  let i = t._freezeSettings(),
    s = (function (a, c, u, l) {
      return new jd(
        a,
        c,
        u,
        l.host,
        l.ssl,
        l.experimentalForceLongPolling,
        l.experimentalAutoDetectLongPolling,
        Y_(l.experimentalLongPollingOptions),
        l.useFetchStreams
      )
    })(
      t._databaseId,
      ((e = t._app) === null || e === void 0 ? void 0 : e.options.appId) || '',
      t._persistenceKey,
      i
    )
  ;(t._firestoreClient = new Qh(
    t._authCredentials,
    t._appCheckCredentials,
    t._queue,
    s
  )),
    !((n = i.localCache) === null || n === void 0) &&
      n._offlineComponentProvider &&
      !((r = i.localCache) === null || r === void 0) &&
      r._onlineComponentProvider &&
      (t._firestoreClient._uninitializedComponentsProvider = {
        _offlineKind: i.localCache.kind,
        _offline: i.localCache._offlineComponentProvider,
        _online: i.localCache._onlineComponentProvider,
      })
}
var Jh = class t {
  constructor(e) {
    this._byteString = e
  }
  static fromBase64String(e) {
    try {
      return new t(we.fromBase64String(e))
    } catch (n) {
      throw new E(
        m.INVALID_ARGUMENT,
        'Failed to construct data from Base64 string: ' + n
      )
    }
  }
  static fromUint8Array(e) {
    return new t(we.fromUint8Array(e))
  }
  toBase64() {
    return this._byteString.toBase64()
  }
  toUint8Array() {
    return this._byteString.toUint8Array()
  }
  toString() {
    return 'Bytes(base64: ' + this.toBase64() + ')'
  }
  isEqual(e) {
    return this._byteString.isEqual(e._byteString)
  }
}
var Ma = class {
  constructor(...e) {
    for (let n = 0; n < e.length; ++n)
      if (e[n].length === 0)
        throw new E(
          m.INVALID_ARGUMENT,
          'Invalid field name at argument $(i + 1). Field names must not be empty.'
        )
    this._internalPath = new ze(e)
  }
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath)
  }
}
var Zh = class {
  constructor(e, n) {
    if (!isFinite(e) || e < -90 || e > 90)
      throw new E(
        m.INVALID_ARGUMENT,
        'Latitude must be a number between -90 and 90, but was: ' + e
      )
    if (!isFinite(n) || n < -180 || n > 180)
      throw new E(
        m.INVALID_ARGUMENT,
        'Longitude must be a number between -180 and 180, but was: ' + n
      )
    ;(this._lat = e), (this._long = n)
  }
  get latitude() {
    return this._lat
  }
  get longitude() {
    return this._long
  }
  isEqual(e) {
    return this._lat === e._lat && this._long === e._long
  }
  toJSON() {
    return { latitude: this._lat, longitude: this._long }
  }
  _compareTo(e) {
    return V(this._lat, e._lat) || V(this._long, e._long)
  }
}
var ZN = new RegExp('[~\\*/\\[\\]]')
function XN(t, e, n) {
  if (e.search(ZN) >= 0)
    throw g_(
      `Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,
      t,
      !1,
      void 0,
      n
    )
  try {
    return new Ma(...e.split('.'))._internalPath
  } catch {
    throw g_(
      `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
      t,
      !1,
      void 0,
      n
    )
  }
}
function g_(t, e, n, r, i) {
  let s = r && !r.isEmpty(),
    o = i !== void 0,
    a = `Function ${e}() called with invalid data`
  n && (a += ' (via `toFirestore()`)'), (a += '. ')
  let c = ''
  return (
    (s || o) &&
      ((c += ' (found'),
      s && (c += ` in field ${r}`),
      o && (c += ` in document ${i}`),
      (c += ')')),
    new E(m.INVALID_ARGUMENT, a + t + c)
  )
}
var Pa = class {
    constructor(e, n, r, i, s) {
      ;(this._firestore = e),
        (this._userDataWriter = n),
        (this._key = r),
        (this._document = i),
        (this._converter = s)
    }
    get id() {
      return this._key.path.lastSegment()
    }
    get ref() {
      return new An(this._firestore, this._converter, this._key)
    }
    exists() {
      return this._document !== null
    }
    data() {
      if (this._document) {
        if (this._converter) {
          let e = new Xh(
            this._firestore,
            this._userDataWriter,
            this._key,
            this._document,
            null
          )
          return this._converter.fromFirestore(e)
        }
        return this._userDataWriter.convertValue(this._document.data.value)
      }
    }
    get(e) {
      if (this._document) {
        let n = this._document.data.field(tI('DocumentSnapshot.get', e))
        if (n !== null) return this._userDataWriter.convertValue(n)
      }
    }
  },
  Xh = class extends Pa {
    data() {
      return super.data()
    }
  }
function tI(t, e) {
  return typeof e == 'string'
    ? XN(t, e)
    : e instanceof Ma
      ? e._internalPath
      : e._delegate._internalPath
}
function eR(t) {
  if (t.limitType === 'L' && t.explicitOrderBy.length === 0)
    throw new E(
      m.UNIMPLEMENTED,
      'limitToLast() queries require specifying at least one orderBy() clause'
    )
}
var ef = class {
  convertValue(e, n = 'none') {
    switch (bn(e)) {
      case 0:
        return null
      case 1:
        return e.booleanValue
      case 2:
        return J(e.integerValue || e.doubleValue)
      case 3:
        return this.convertTimestamp(e.timestampValue)
      case 4:
        return this.convertServerTimestamp(e, n)
      case 5:
        return e.stringValue
      case 6:
        return this.convertBytes($t(e.bytesValue))
      case 7:
        return this.convertReference(e.referenceValue)
      case 8:
        return this.convertGeoPoint(e.geoPointValue)
      case 9:
        return this.convertArray(e.arrayValue, n)
      case 10:
        return this.convertObject(e.mapValue, n)
      default:
        throw b()
    }
  }
  convertObject(e, n) {
    return this.convertObjectMap(e.fields, n)
  }
  convertObjectMap(e, n = 'none') {
    let r = {}
    return (
      La(e, (i, s) => {
        r[i] = this.convertValue(s, n)
      }),
      r
    )
  }
  convertGeoPoint(e) {
    return new Zh(J(e.latitude), J(e.longitude))
  }
  convertArray(e, n) {
    return (e.values || []).map((r) => this.convertValue(r, n))
  }
  convertServerTimestamp(e, n) {
    switch (n) {
      case 'previous':
        let r = af(e)
        return r == null ? null : this.convertValue(r, n)
      case 'estimate':
        return this.convertTimestamp($i(e))
      default:
        return null
    }
  }
  convertTimestamp(e) {
    let n = Bt(e)
    return new Me(n.seconds, n.nanos)
  }
  convertDocumentKey(e, n) {
    let r = re.fromString(e)
    ie(V_(r))
    let i = new ga(r.get(1), r.get(3)),
      s = new D(r.popFirst(5))
    return (
      i.isEqual(n) ||
        at(
          `Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`
        ),
      s
    )
  }
}
var wn = class {
    constructor(e, n) {
      ;(this.hasPendingWrites = e), (this.fromCache = n)
    }
    isEqual(e) {
      return (
        this.hasPendingWrites === e.hasPendingWrites &&
        this.fromCache === e.fromCache
      )
    }
  },
  Oa = class extends Pa {
    constructor(e, n, r, i, s, o) {
      super(e, n, r, i, o),
        (this._firestore = e),
        (this._firestoreImpl = e),
        (this.metadata = s)
    }
    exists() {
      return super.exists()
    }
    data(e = {}) {
      if (this._document) {
        if (this._converter) {
          let n = new fr(
            this._firestore,
            this._userDataWriter,
            this._key,
            this._document,
            this.metadata,
            null
          )
          return this._converter.fromFirestore(n, e)
        }
        return this._userDataWriter.convertValue(
          this._document.data.value,
          e.serverTimestamps
        )
      }
    }
    get(e, n = {}) {
      if (this._document) {
        let r = this._document.data.field(tI('DocumentSnapshot.get', e))
        if (r !== null)
          return this._userDataWriter.convertValue(r, n.serverTimestamps)
      }
    }
  },
  fr = class extends Oa {
    data(e = {}) {
      return super.data(e)
    }
  },
  tf = class {
    constructor(e, n, r, i) {
      ;(this._firestore = e),
        (this._userDataWriter = n),
        (this._snapshot = i),
        (this.metadata = new wn(i.hasPendingWrites, i.fromCache)),
        (this.query = r)
    }
    get docs() {
      let e = []
      return this.forEach((n) => e.push(n)), e
    }
    get size() {
      return this._snapshot.docs.size
    }
    get empty() {
      return this.size === 0
    }
    forEach(e, n) {
      this._snapshot.docs.forEach((r) => {
        e.call(
          n,
          new fr(
            this._firestore,
            this._userDataWriter,
            r.key,
            r,
            new wn(
              this._snapshot.mutatedKeys.has(r.key),
              this._snapshot.fromCache
            ),
            this.query.converter
          )
        )
      })
    }
    docChanges(e = {}) {
      let n = !!e.includeMetadataChanges
      if (n && this._snapshot.excludesMetadataChanges)
        throw new E(
          m.INVALID_ARGUMENT,
          'To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().'
        )
      return (
        (this._cachedChanges &&
          this._cachedChangesIncludeMetadataChanges === n) ||
          ((this._cachedChanges = (function (i, s) {
            if (i._snapshot.oldDocs.isEmpty()) {
              let o = 0
              return i._snapshot.docChanges.map((a) => {
                let c = new fr(
                  i._firestore,
                  i._userDataWriter,
                  a.doc.key,
                  a.doc,
                  new wn(
                    i._snapshot.mutatedKeys.has(a.doc.key),
                    i._snapshot.fromCache
                  ),
                  i.query.converter
                )
                return (
                  a.doc, { type: 'added', doc: c, oldIndex: -1, newIndex: o++ }
                )
              })
            }
            {
              let o = i._snapshot.oldDocs
              return i._snapshot.docChanges
                .filter((a) => s || a.type !== 3)
                .map((a) => {
                  let c = new fr(
                      i._firestore,
                      i._userDataWriter,
                      a.doc.key,
                      a.doc,
                      new wn(
                        i._snapshot.mutatedKeys.has(a.doc.key),
                        i._snapshot.fromCache
                      ),
                      i.query.converter
                    ),
                    u = -1,
                    l = -1
                  return (
                    a.type !== 0 &&
                      ((u = o.indexOf(a.doc.key)), (o = o.delete(a.doc.key))),
                    a.type !== 1 &&
                      ((o = o.add(a.doc)), (l = o.indexOf(a.doc.key))),
                    { type: tR(a.type), doc: c, oldIndex: u, newIndex: l }
                  )
                })
            }
          })(this, n)),
          (this._cachedChangesIncludeMetadataChanges = n)),
        this._cachedChanges
      )
    }
  }
function tR(t) {
  switch (t) {
    case 0:
      return 'added'
    case 2:
    case 3:
      return 'modified'
    case 1:
      return 'removed'
    default:
      return b()
  }
}
var ka = class extends ef {
  constructor(e) {
    super(), (this.firestore = e)
  }
  convertBytes(e) {
    return new Jh(e)
  }
  convertReference(e) {
    let n = this.convertDocumentKey(e, this.firestore._databaseId)
    return new An(this.firestore, null, n)
  }
}
function yf(t, ...e) {
  var n, r, i
  t = Ot(t)
  let s = { includeMetadataChanges: !1 },
    o = 0
  typeof e[o] != 'object' || p_(e[o]) || ((s = e[o]), o++)
  let a = { includeMetadataChanges: s.includeMetadataChanges }
  if (p_(e[o])) {
    let d = e[o]
    ;(e[o] = (n = d.next) === null || n === void 0 ? void 0 : n.bind(d)),
      (e[o + 1] = (r = d.error) === null || r === void 0 ? void 0 : r.bind(d)),
      (e[o + 2] =
        (i = d.complete) === null || i === void 0 ? void 0 : i.bind(d))
  }
  let c, u, l
  if (t instanceof An)
    (u = ca(t.firestore, Xi)),
      (l = df(t._key.path)),
      (c = {
        next: (d) => {
          e[o] && e[o](nR(u, t, d))
        },
        error: e[o + 1],
        complete: e[o + 2],
      })
  else {
    let d = ca(t, xa)
    ;(u = ca(d.firestore, Xi)), (l = d._query)
    let h = new ka(u)
    ;(c = {
      next: (f) => {
        e[o] && e[o](new tf(u, h, d, f))
      },
      error: e[o + 1],
      complete: e[o + 2],
    }),
      eR(t._query)
  }
  return (function (h, f, _, w) {
    let I = new Kh(w),
      P = new Bh(f, I, _)
    return (
      h.asyncQueue.enqueueAndForget(() =>
        p(this, null, function* () {
          return PN(yield d_(h), P)
        })
      ),
      () => {
        I.La(),
          h.asyncQueue.enqueueAndForget(() =>
            p(this, null, function* () {
              return ON(yield d_(h), P)
            })
          )
      }
    )
  })(JN(u), l, a, c)
}
function nR(t, e, n) {
  let r = n.docs.get(e._key),
    i = new ka(t)
  return new Oa(
    t,
    i,
    e._key,
    r,
    new wn(n.hasPendingWrites, n.fromCache),
    e.converter
  )
}
;(function (e, n = !0) {
  ;(function (i) {
    br = i
  })(Jn),
    Lt(
      new Re(
        'firestore',
        (r, { instanceIdentifier: i, options: s }) => {
          let o = r.getProvider('app').getImmediate(),
            a = new Xi(
              new Nd(r.getProvider('auth-internal')),
              new Pd(r.getProvider('app-check-internal')),
              (function (u, l) {
                if (
                  !Object.prototype.hasOwnProperty.apply(u.options, [
                    'projectId',
                  ])
                )
                  throw new E(
                    m.INVALID_ARGUMENT,
                    '"projectId" not provided in firebase.initializeApp.'
                  )
                return new ga(u.options.projectId, l)
              })(o, i),
              o
            )
          return (
            (s = Object.assign({ useFetchStreams: n }, s)), a._setSettings(s), a
          )
        },
        'PUBLIC'
      ).setMultipleInstances(!0)
    ),
    oe(Uv, '4.4.1', e),
    oe(Uv, '4.4.1', 'esm2017')
})()
var Ba = function () {
  return (
    (Ba =
      Object.assign ||
      function (e) {
        for (var n, r = 1, i = arguments.length; r < i; r++) {
          n = arguments[r]
          for (var s in n)
            Object.prototype.hasOwnProperty.call(n, s) && (e[s] = n[s])
        }
        return e
      }),
    Ba.apply(this, arguments)
  )
}
var sR = { includeMetadataChanges: !1 }
function nI(t, e) {
  return (
    e === void 0 && (e = sR),
    new Oe(function (n) {
      var r = yf(t, e, {
        next: n.next.bind(n),
        error: n.error.bind(n),
        complete: n.complete.bind(n),
      })
      return { unsubscribe: r }
    })
  )
}
function rI(t, e) {
  var n
  e === void 0 && (e = {})
  var r = t.data(e)
  return !t.exists() || typeof r != 'object' || r === null || !e.idField
    ? r
    : Ba(Ba({}, r), ((n = {}), (n[e.idField] = t.id), n))
}
function iI(t) {
  return nI(t, { includeMetadataChanges: !0 }).pipe(
    Fn(function (e) {
      return e.docs
    })
  )
}
function sI(t, e) {
  return (
    e === void 0 && (e = {}),
    iI(t).pipe(
      Fn(function (n) {
        return n.map(function (r) {
          return rI(r, e)
        })
      })
    )
  )
}
var Sn = class {
    constructor(e) {
      return e
    }
  },
  oI = 'firestore',
  vf = class {
    constructor() {
      return ai(oI)
    }
  }
var _f = new q('angularfire2.firestore-instances')
function oR(t, e) {
  let n = yl(oI, t, e)
  return n && new Sn(n)
}
function aR(t) {
  return (e, n) => {
    let r = e.runOutsideAngular(() => t(n))
    return new Sn(r)
  }
}
var cR = { provide: vf, deps: [[new vt(), _f]] },
  uR = { provide: Sn, useFactory: oR, deps: [[new vt(), _f], ln] },
  lR = (() => {
    class t {
      constructor() {
        oe('angularfire', Xn.full, 'fst')
      }
      static ɵfac = function (r) {
        return new (r || t)()
      }
      static ɵmod = sn({ type: t })
      static ɵinj = rn({ providers: [uR, cR] })
    }
    return t
  })()
function aI(t, ...e) {
  return {
    ngModule: lR,
    providers: [
      {
        provide: _f,
        useFactory: aR(t),
        multi: !0,
        deps: [Q, Rt, ci, ui, [new vt(), No], [new vt(), oi], ...e],
      },
    ],
  }
}
var cI = un(sI, !0)
var uI = un(Z_, !0)
var lI = un(X_, !0)
var dI = {
  production: !0,
  firebase: {
    projectId: 'portfolio-jpin730',
    appId: '1:733714402019:web:a1301af4562abe9ecc53d6',
    storageBucket: 'portfolio-jpin730.appspot.com',
    apiKey: 'AIzaSyCUOML6rLU4b0uImZsqoGSpcIdponc0qA8',
    authDomain: 'portfolio-jpin730.firebaseapp.com',
    messagingSenderId: '733714402019',
  },
}
var hI = { providers: [Gs(ty(() => ny(dI.firebase))), Gs(aI(() => lI()))] }
var fI = (() => {
  let e = class e {
    constructor() {
      this.firestore = X(Sn)
    }
    getCertificates() {
      let r = uI(this.firestore, 'certifications')
      return cI(r, { idField: 'id' })
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵprov = K({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
var pI = (() => {
  let e = class e {}
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = Hs({
      type: e,
      selectors: [['app-footer']],
      standalone: !0,
      features: [ro],
      decls: 6,
      vars: 0,
      consts: [
        [1, 'bg-dark-subtle'],
        [1, 'container', 'my-0', 'py-3', 'text-center'],
        [
          'target',
          '_blank',
          'rel',
          'noopener noreferrer',
          'href',
          'https://github.com/jpin730',
          1,
          'text-decoration-none',
        ],
      ],
      template: function (i, s) {
        i & 1 &&
          ($e(0, 'footer', 0)(1, 'p', 1)(2, 'small'),
          Qn(3, ' My Github profile: '),
          $e(4, 'a', 2),
          Qn(5, ' github.com/jpin730 '),
          _t()()()())
      },
      encapsulation: 2,
      changeDetection: 0,
    }))
  let t = e
  return t
})()
function dR(t, e) {
  if (t & 1) {
    let n = am()
    $e(0, 'div', 6),
      Qn(1, ' Click or tap on image to enlarge '),
      $e(2, 'button', 7),
      Mu('click', function () {
        Kp(n)
        let i = um()
        return Qp((i.showAlert = !1))
      }),
      _t()()
  }
}
var gI = (() => {
  let e = class e {
    constructor() {
      ;(this.appService = X(fI)), (this.showAlert = !0)
    }
    ngOnInit() {
      this.certificates$ = this.appService.getCertificates().pipe(rc(1))
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = Hs({
      type: e,
      selectors: [['app-root']],
      standalone: !0,
      features: [ro],
      decls: 8,
      vars: 3,
      consts: [
        [
          1,
          'bg-light',
          'd-flex',
          'flex-column',
          'justify-content-between',
          'min-vh-100',
        ],
        [1, 'navbar', 'bg-dark', 'mb-5'],
        [1, 'flex-grow-1'],
        [1, 'text-center', 'mb-5'],
        [1, 'container', 'mb-4'],
        ['class', 'alert alert-info alert-dismissible text-center', 4, 'ngIf'],
        [1, 'alert', 'alert-info', 'alert-dismissible', 'text-center'],
        ['type', 'button', 1, 'btn-close', 3, 'click'],
      ],
      template: function (i, s) {
        i & 1 &&
          ($e(0, 'div', 0),
          no(1, 'nav', 1),
          $e(2, 'main', 2)(3, 'h1', 3),
          Qn(4, "Jaime Pineda's Certificates"),
          _t(),
          $e(5, 'div', 4),
          Nu(6, dR, 3, 0, 'div', 5),
          _t()(),
          no(7, 'app-footer'),
          _t()),
          i & 2 && (wu(), to('height', '40px'), wu(5), Ru('ngIf', s.showAlert))
      },
      dependencies: [Uu, _m, pI],
      encapsulation: 2,
    }))
  let t = e
  return t
})()
Sm(gI, hI).catch((t) => console.error(t))
