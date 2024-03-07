var zw = Object.defineProperty,
  Gw = Object.defineProperties
var Ww = Object.getOwnPropertyDescriptors
var vp = Object.getOwnPropertySymbols
var Kw = Object.prototype.hasOwnProperty,
  Qw = Object.prototype.propertyIsEnumerable
var _p = (t, e, n) =>
    e in t
      ? zw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (t[e] = n),
  gt = (t, e) => {
    for (var n in (e ||= {})) Kw.call(e, n) && _p(t, n, e[n])
    if (vp) for (var n of vp(e)) Qw.call(e, n) && _p(t, n, e[n])
    return t
  },
  Pt = (t, e) => Gw(t, Ww(e))
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
var Ip = null
var wc = 1,
  wp = Symbol('SIGNAL')
function pe(t) {
  let e = Ip
  return (Ip = t), e
}
var Ep = {
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
function Yw(t) {
  if (!(Dc(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === wc)) {
    if (!t.producerMustRecompute(t) && !Ec(t)) {
      ;(t.dirty = !1), (t.lastCleanEpoch = wc)
      return
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = wc)
  }
}
function Tp(t) {
  return t && (t.nextProducerIndex = 0), pe(t)
}
function Dp(t, e) {
  if (
    (pe(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (Dc(t))
      for (let n = t.nextProducerIndex; n < t.producerNode.length; n++)
        Tc(t.producerNode[n], t.producerIndexOfThis[n])
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop()
  }
}
function Ec(t) {
  Ns(t)
  for (let e = 0; e < t.producerNode.length; e++) {
    let n = t.producerNode[e],
      r = t.producerLastReadVersion[e]
    if (r !== n.version || (Yw(n), r !== n.version)) return !0
  }
  return !1
}
function Cp(t) {
  if ((Ns(t), Dc(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      Tc(t.producerNode[e], t.producerIndexOfThis[e])
  ;(t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0)
}
function Tc(t, e) {
  if ((Jw(t), Ns(t), t.liveConsumerNode.length === 1))
    for (let r = 0; r < t.producerNode.length; r++)
      Tc(t.producerNode[r], t.producerIndexOfThis[r])
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
    Ns(i), (i.producerIndexOfThis[r] = e)
  }
}
function Dc(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0
}
function Ns(t) {
  ;(t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= [])
}
function Jw(t) {
  ;(t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= [])
}
function Zw() {
  throw new Error()
}
var Xw = Zw
function bp(t) {
  Xw = t
}
function A(t) {
  return typeof t == 'function'
}
function Rs(t) {
  let n = t((r) => {
    Error.call(r), (r.stack = new Error().stack)
  })
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  )
}
var Ms = Rs(
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
function gn(t, e) {
  if (t) {
    let n = t.indexOf(e)
    0 <= n && t.splice(n, 1)
  }
}
var Te = class t {
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
      if (A(r))
        try {
          r()
        } catch (s) {
          e = s instanceof Ms ? s.errors : [s]
        }
      let { _finalizers: i } = this
      if (i) {
        this._finalizers = null
        for (let s of i)
          try {
            Ap(s)
          } catch (o) {
            ;(e = e ?? []),
              o instanceof Ms ? (e = [...e, ...o.errors]) : e.push(o)
          }
      }
      if (e) throw new Ms(e)
    }
  }
  add(e) {
    var n
    if (e && e !== this)
      if (this.closed) Ap(e)
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
    n === e ? (this._parentage = null) : Array.isArray(n) && gn(n, e)
  }
  remove(e) {
    let { _finalizers: n } = this
    n && gn(n, e), e instanceof t && e._removeParent(this)
  }
}
Te.EMPTY = (() => {
  let t = new Te()
  return (t.closed = !0), t
})()
var Cc = Te.EMPTY
function Ps(t) {
  return (
    t instanceof Te ||
    (t && 'closed' in t && A(t.remove) && A(t.add) && A(t.unsubscribe))
  )
}
function Ap(t) {
  A(t) ? t() : t.unsubscribe()
}
var it = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
}
var tr = {
  setTimeout(t, e, ...n) {
    let { delegate: r } = tr
    return r?.setTimeout ? r.setTimeout(t, e, ...n) : setTimeout(t, e, ...n)
  },
  clearTimeout(t) {
    let { delegate: e } = tr
    return (e?.clearTimeout || clearTimeout)(t)
  },
  delegate: void 0,
}
function ks(t) {
  tr.setTimeout(() => {
    let { onUnhandledError: e } = it
    if (e) e(t)
    else throw t
  })
}
function bc() {}
var Sp = Ac('C', void 0, void 0)
function xp(t) {
  return Ac('E', void 0, t)
}
function Np(t) {
  return Ac('N', t, void 0)
}
function Ac(t, e, n) {
  return { kind: t, value: e, error: n }
}
var yn = null
function nr(t) {
  if (it.useDeprecatedSynchronousErrorHandling) {
    let e = !yn
    if ((e && (yn = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: n, error: r } = yn
      if (((yn = null), n)) throw r
    }
  } else t()
}
function Rp(t) {
  it.useDeprecatedSynchronousErrorHandling &&
    yn &&
    ((yn.errorThrown = !0), (yn.error = t))
}
var vn = class extends Te {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), Ps(e) && e.add(this))
          : (this.destination = nE)
    }
    static create(e, n, r) {
      return new rr(e, n, r)
    }
    next(e) {
      this.isStopped ? xc(Np(e), this) : this._next(e)
    }
    error(e) {
      this.isStopped ? xc(xp(e), this) : ((this.isStopped = !0), this._error(e))
    }
    complete() {
      this.isStopped ? xc(Sp, this) : ((this.isStopped = !0), this._complete())
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
  eE = Function.prototype.bind
function Sc(t, e) {
  return eE.call(t, e)
}
var Nc = class {
    constructor(e) {
      this.partialObserver = e
    }
    next(e) {
      let { partialObserver: n } = this
      if (n.next)
        try {
          n.next(e)
        } catch (r) {
          Os(r)
        }
    }
    error(e) {
      let { partialObserver: n } = this
      if (n.error)
        try {
          n.error(e)
        } catch (r) {
          Os(r)
        }
      else Os(e)
    }
    complete() {
      let { partialObserver: e } = this
      if (e.complete)
        try {
          e.complete()
        } catch (n) {
          Os(n)
        }
    }
  },
  rr = class extends vn {
    constructor(e, n, r) {
      super()
      let i
      if (A(e) || !e)
        i = { next: e ?? void 0, error: n ?? void 0, complete: r ?? void 0 }
      else {
        let s
        this && it.useDeprecatedNextContext
          ? ((s = Object.create(e)),
            (s.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && Sc(e.next, s),
              error: e.error && Sc(e.error, s),
              complete: e.complete && Sc(e.complete, s),
            }))
          : (i = e)
      }
      this.destination = new Nc(i)
    }
  }
function Os(t) {
  it.useDeprecatedSynchronousErrorHandling ? Rp(t) : ks(t)
}
function tE(t) {
  throw t
}
function xc(t, e) {
  let { onStoppedNotification: n } = it
  n && tr.setTimeout(() => n(t, e))
}
var nE = { closed: !0, next: bc, error: tE, complete: bc }
var ir = (typeof Symbol == 'function' && Symbol.observable) || '@@observable'
function Fs(t) {
  return t
}
function Mp(t) {
  return t.length === 0
    ? Fs
    : t.length === 1
      ? t[0]
      : function (n) {
          return t.reduce((r, i) => i(r), n)
        }
}
var Q = (() => {
  class t {
    constructor(n) {
      n && (this._subscribe = n)
    }
    lift(n) {
      let r = new t()
      return (r.source = this), (r.operator = n), r
    }
    subscribe(n, r, i) {
      let s = iE(n) ? n : new rr(n, r, i)
      return (
        nr(() => {
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
        (r = Pp(r)),
        new r((i, s) => {
          let o = new rr({
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
    [ir]() {
      return this
    }
    pipe(...n) {
      return Mp(n)(this)
    }
    toPromise(n) {
      return (
        (n = Pp(n)),
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
function Pp(t) {
  var e
  return (e = t ?? it.Promise) !== null && e !== void 0 ? e : Promise
}
function rE(t) {
  return t && A(t.next) && A(t.error) && A(t.complete)
}
function iE(t) {
  return (t && t instanceof vn) || (rE(t) && Ps(t))
}
function sE(t) {
  return A(t?.lift)
}
function Le(t) {
  return (e) => {
    if (sE(e))
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
function $e(t, e, n, r, i) {
  return new Rc(t, e, n, r, i)
}
var Rc = class extends vn {
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
var kp = Rs(
  (t) =>
    function () {
      t(this),
        (this.name = 'ObjectUnsubscribedError'),
        (this.message = 'object unsubscribed')
    }
)
var sr = (() => {
    class t extends Q {
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
        let r = new Ls(this, this)
        return (r.operator = n), r
      }
      _throwIfClosed() {
        if (this.closed) throw new kp()
      }
      next(n) {
        nr(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers))
            for (let r of this.currentObservers) r.next(n)
          }
        })
      }
      error(n) {
        nr(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ;(this.hasError = this.isStopped = !0), (this.thrownError = n)
            let { observers: r } = this
            for (; r.length; ) r.shift().error(n)
          }
        })
      }
      complete() {
        nr(() => {
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
          ? Cc
          : ((this.currentObservers = null),
            s.push(n),
            new Te(() => {
              ;(this.currentObservers = null), gn(s, n)
            }))
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: s } = this
        r ? n.error(i) : s && n.complete()
      }
      asObservable() {
        let n = new Q()
        return (n.source = this), n
      }
    }
    return (t.create = (e, n) => new Ls(e, n)), t
  })(),
  Ls = class extends sr {
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
        : Cc
    }
  }
var Xr = class extends sr {
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
var Mc = {
  now() {
    return (Mc.delegate || Date).now()
  },
  delegate: void 0,
}
var Vs = class extends Te {
  constructor(e, n) {
    super()
  }
  schedule(e, n = 0) {
    return this
  }
}
var ei = {
  setInterval(t, e, ...n) {
    let { delegate: r } = ei
    return r?.setInterval ? r.setInterval(t, e, ...n) : setInterval(t, e, ...n)
  },
  clearInterval(t) {
    let { delegate: e } = ei
    return (e?.clearInterval || clearInterval)(t)
  },
  delegate: void 0,
}
var or = class extends Vs {
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
    return ei.setInterval(e.flush.bind(e, this), r)
  }
  recycleAsyncId(e, n, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return n
    n != null && ei.clearInterval(n)
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
        gn(r, this),
        e != null && (this.id = this.recycleAsyncId(n, e, null)),
        (this.delay = null),
        super.unsubscribe()
    }
  }
}
var ar = class t {
  constructor(e, n = t.now) {
    ;(this.schedulerActionCtor = e), (this.now = n)
  }
  schedule(e, n = 0, r) {
    return new this.schedulerActionCtor(this, e).schedule(r, n)
  }
}
ar.now = Mc.now
var cr = class extends ar {
  constructor(e, n = ar.now) {
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
var Pc = new cr(or)
var Us = class extends or {
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
var js = class extends cr {}
var kc = new js(Us)
var Op = new Q((t) => t.complete())
function Fp(t) {
  return t && A(t.schedule)
}
function oE(t) {
  return t[t.length - 1]
}
function Lp(t) {
  return Fp(oE(t)) ? t.pop() : void 0
}
function Oc(t, e) {
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
function Up(t, e, n, r) {
  function i(s) {
    return s instanceof n
      ? s
      : new n(function (o) {
          o(s)
        })
  }
  return new (n || (n = Promise))(function (s, o) {
    function a(l) {
      try {
        u(r.next(l))
      } catch (d) {
        o(d)
      }
    }
    function c(l) {
      try {
        u(r.throw(l))
      } catch (d) {
        o(d)
      }
    }
    function u(l) {
      l.done ? s(l.value) : i(l.value).then(a, c)
    }
    u((r = r.apply(t, e || [])).next())
  })
}
function Vp(t) {
  var e = typeof Symbol == 'function' && Symbol.iterator,
    n = e && t[e],
    r = 0
  if (n) return n.call(t)
  if (t && typeof t.length == 'number')
    return {
      next: function () {
        return (
          t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t }
        )
      },
    }
  throw new TypeError(
    e ? 'Object is not iterable.' : 'Symbol.iterator is not defined.'
  )
}
function _n(t) {
  return this instanceof _n ? ((this.v = t), this) : new _n(t)
}
function jp(t, e, n) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.')
  var r = n.apply(t, e || []),
    i,
    s = []
  return (
    (i = {}),
    o('next'),
    o('throw'),
    o('return'),
    (i[Symbol.asyncIterator] = function () {
      return this
    }),
    i
  )
  function o(h) {
    r[h] &&
      (i[h] = function (f) {
        return new Promise(function (g, I) {
          s.push([h, f, g, I]) > 1 || a(h, f)
        })
      })
  }
  function a(h, f) {
    try {
      c(r[h](f))
    } catch (g) {
      d(s[0][3], g)
    }
  }
  function c(h) {
    h.value instanceof _n
      ? Promise.resolve(h.value.v).then(u, l)
      : d(s[0][2], h)
  }
  function u(h) {
    a('next', h)
  }
  function l(h) {
    a('throw', h)
  }
  function d(h, f) {
    h(f), s.shift(), s.length && a(s[0][0], s[0][1])
  }
}
function Bp(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.')
  var e = t[Symbol.asyncIterator],
    n
  return e
    ? e.call(t)
    : ((t = typeof Vp == 'function' ? Vp(t) : t[Symbol.iterator]()),
      (n = {}),
      r('next'),
      r('throw'),
      r('return'),
      (n[Symbol.asyncIterator] = function () {
        return this
      }),
      n)
  function r(s) {
    n[s] =
      t[s] &&
      function (o) {
        return new Promise(function (a, c) {
          ;(o = t[s](o)), i(a, c, o.done, o.value)
        })
      }
  }
  function i(s, o, a, c) {
    Promise.resolve(c).then(function (u) {
      s({ value: u, done: a })
    }, o)
  }
}
var ur = (t) => t && typeof t.length == 'number' && typeof t != 'function'
function Bs(t) {
  return A(t?.then)
}
function $s(t) {
  return A(t[ir])
}
function Hs(t) {
  return Symbol.asyncIterator && A(t?.[Symbol.asyncIterator])
}
function qs(t) {
  return new TypeError(
    `You provided ${t !== null && typeof t == 'object' ? 'an invalid object' : `'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  )
}
function aE() {
  return typeof Symbol != 'function' || !Symbol.iterator
    ? '@@iterator'
    : Symbol.iterator
}
var zs = aE()
function Gs(t) {
  return A(t?.[zs])
}
function Ws(t) {
  return jp(this, arguments, function* () {
    let n = t.getReader()
    try {
      for (;;) {
        let { value: r, done: i } = yield _n(n.read())
        if (i) return yield _n(void 0)
        yield yield _n(r)
      }
    } finally {
      n.releaseLock()
    }
  })
}
function Ks(t) {
  return A(t?.getReader)
}
function Ve(t) {
  if (t instanceof Q) return t
  if (t != null) {
    if ($s(t)) return cE(t)
    if (ur(t)) return uE(t)
    if (Bs(t)) return lE(t)
    if (Hs(t)) return $p(t)
    if (Gs(t)) return dE(t)
    if (Ks(t)) return hE(t)
  }
  throw qs(t)
}
function cE(t) {
  return new Q((e) => {
    let n = t[ir]()
    if (A(n.subscribe)) return n.subscribe(e)
    throw new TypeError(
      'Provided object does not correctly implement Symbol.observable'
    )
  })
}
function uE(t) {
  return new Q((e) => {
    for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n])
    e.complete()
  })
}
function lE(t) {
  return new Q((e) => {
    t.then(
      (n) => {
        e.closed || (e.next(n), e.complete())
      },
      (n) => e.error(n)
    ).then(null, ks)
  })
}
function dE(t) {
  return new Q((e) => {
    for (let n of t) if ((e.next(n), e.closed)) return
    e.complete()
  })
}
function $p(t) {
  return new Q((e) => {
    fE(t, e).catch((n) => e.error(n))
  })
}
function hE(t) {
  return $p(Ws(t))
}
function fE(t, e) {
  var n, r, i, s
  return Up(this, void 0, void 0, function* () {
    try {
      for (n = Bp(t); (r = yield n.next()), !r.done; ) {
        let o = r.value
        if ((e.next(o), e.closed)) return
      }
    } catch (o) {
      i = { error: o }
    } finally {
      try {
        r && !r.done && (s = n.return) && (yield s.call(n))
      } finally {
        if (i) throw i.error
      }
    }
    e.complete()
  })
}
function Qe(t, e, n, r = 0, i = !1) {
  let s = e.schedule(function () {
    n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe()
  }, r)
  if ((t.add(s), !i)) return s
}
function Wt(t, e = 0) {
  return Le((n, r) => {
    n.subscribe(
      $e(
        r,
        (i) => Qe(r, t, () => r.next(i), e),
        () => Qe(r, t, () => r.complete(), e),
        (i) => Qe(r, t, () => r.error(i), e)
      )
    )
  })
}
function Kt(t, e = 0) {
  return Le((n, r) => {
    r.add(t.schedule(() => n.subscribe(r), e))
  })
}
function Hp(t, e) {
  return Ve(t).pipe(Kt(e), Wt(e))
}
function qp(t, e) {
  return Ve(t).pipe(Kt(e), Wt(e))
}
function zp(t, e) {
  return new Q((n) => {
    let r = 0
    return e.schedule(function () {
      r === t.length
        ? n.complete()
        : (n.next(t[r++]), n.closed || this.schedule())
    })
  })
}
function Gp(t, e) {
  return new Q((n) => {
    let r
    return (
      Qe(n, e, () => {
        ;(r = t[zs]()),
          Qe(
            n,
            e,
            () => {
              let i, s
              try {
                ;({ value: i, done: s } = r.next())
              } catch (o) {
                n.error(o)
                return
              }
              s ? n.complete() : n.next(i)
            },
            0,
            !0
          )
      }),
      () => A(r?.return) && r.return()
    )
  })
}
function Qs(t, e) {
  if (!t) throw new Error('Iterable cannot be null')
  return new Q((n) => {
    Qe(n, e, () => {
      let r = t[Symbol.asyncIterator]()
      Qe(
        n,
        e,
        () => {
          r.next().then((i) => {
            i.done ? n.complete() : n.next(i.value)
          })
        },
        0,
        !0
      )
    })
  })
}
function Wp(t, e) {
  return Qs(Ws(t), e)
}
function Kp(t, e) {
  if (t != null) {
    if ($s(t)) return Hp(t, e)
    if (ur(t)) return zp(t, e)
    if (Bs(t)) return qp(t, e)
    if (Hs(t)) return Qs(t, e)
    if (Gs(t)) return Gp(t, e)
    if (Ks(t)) return Wp(t, e)
  }
  throw qs(t)
}
function Fc(t, e) {
  return e ? Kp(t, e) : Ve(t)
}
function Lc(...t) {
  let e = Lp(t)
  return Fc(t, e)
}
function Re(t, e) {
  return Le((n, r) => {
    let i = 0
    n.subscribe(
      $e(r, (s) => {
        r.next(t.call(e, s, i++))
      })
    )
  })
}
var { isArray: pE } = Array
function mE(t, e) {
  return pE(e) ? t(...e) : t(e)
}
function Qp(t) {
  return Re((e) => mE(t, e))
}
function Yp(t, e, n, r, i, s, o, a) {
  let c = [],
    u = 0,
    l = 0,
    d = !1,
    h = () => {
      d && !c.length && !u && e.complete()
    },
    f = (I) => (u < r ? g(I) : c.push(I)),
    g = (I) => {
      s && e.next(I), u++
      let w = !1
      Ve(n(I, l++)).subscribe(
        $e(
          e,
          (D) => {
            i?.(D), s ? f(D) : e.next(D)
          },
          () => {
            w = !0
          },
          void 0,
          () => {
            if (w)
              try {
                for (u--; c.length && u < r; ) {
                  let D = c.shift()
                  o ? Qe(e, o, () => g(D)) : g(D)
                }
                h()
              } catch (D) {
                e.error(D)
              }
          }
        )
      )
    }
  return (
    t.subscribe(
      $e(e, f, () => {
        ;(d = !0), h()
      })
    ),
    () => {
      a?.()
    }
  )
}
function Vc(t, e, n = 1 / 0) {
  return A(e)
    ? Vc((r, i) => Re((s, o) => e(r, s, i, o))(Ve(t(r, i))), n)
    : (typeof e == 'number' && (n = e), Le((r, i) => Yp(r, i, t, n)))
}
var gE = ['addListener', 'removeListener'],
  yE = ['addEventListener', 'removeEventListener'],
  vE = ['on', 'off']
function ti(t, e, n, r) {
  if ((A(n) && ((r = n), (n = void 0)), r)) return ti(t, e, n).pipe(Qp(r))
  let [i, s] = wE(t)
    ? yE.map((o) => (a) => t[o](e, a, n))
    : _E(t)
      ? gE.map(Jp(t, e))
      : IE(t)
        ? vE.map(Jp(t, e))
        : []
  if (!i && ur(t)) return Vc((o) => ti(o, e, n))(Ve(t))
  if (!i) throw new TypeError('Invalid event target')
  return new Q((o) => {
    let a = (...c) => o.next(1 < c.length ? c : c[0])
    return i(a), () => s(a)
  })
}
function Jp(t, e) {
  return (n) => (r) => t[n](e, r)
}
function _E(t) {
  return A(t.addListener) && A(t.removeListener)
}
function IE(t) {
  return A(t.on) && A(t.off)
}
function wE(t) {
  return A(t.addEventListener) && A(t.removeEventListener)
}
function Ys(t) {
  return Le((e, n) => {
    let r = null,
      i = !1,
      s
    ;(r = e.subscribe(
      $e(n, void 0, void 0, (o) => {
        ;(s = Ve(t(o, Ys(t)(e)))),
          r ? (r.unsubscribe(), (r = null), s.subscribe(n)) : (i = !0)
      })
    )),
      i && (r.unsubscribe(), (r = null), s.subscribe(n))
  })
}
function Uc(t) {
  return t <= 0
    ? () => Op
    : Le((e, n) => {
        let r = 0
        e.subscribe(
          $e(n, (i) => {
            ++r <= t && (n.next(i), t <= r && n.complete())
          })
        )
      })
}
function Qt(t, e, n) {
  let r = A(t) || e || n ? { next: t, error: e, complete: n } : t
  return r
    ? Le((i, s) => {
        var o
        ;(o = r.subscribe) === null || o === void 0 || o.call(r)
        let a = !0
        i.subscribe(
          $e(
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
    : Fs
}
var Nm = 'https://g.co/ng/security#xss',
  $ = class extends Error {
    constructor(e, n) {
      super(ju(e, n)), (this.code = e)
    }
  }
function ju(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ': ' + e : ''}`
}
function Y(t) {
  for (let e in t) if (t[e] === Y) return e
  throw Error('Could not find renamed property on target object.')
}
function ct(t) {
  if (typeof t == 'string') return t
  if (Array.isArray(t)) return '[' + t.map(ct).join(', ') + ']'
  if (t == null) return '' + t
  if (t.overriddenName) return `${t.overriddenName}`
  if (t.name) return `${t.name}`
  let e = t.toString()
  if (e == null) return '' + e
  let n = e.indexOf(`
`)
  return n === -1 ? e : e.substring(0, n)
}
function Xc(t, e) {
  return t == null || t === ''
    ? e === null
      ? ''
      : e
    : e == null || e === ''
      ? t
      : t + ' ' + e
}
var EE = Y({ __forward_ref__: Y })
function Rm(t) {
  return (
    (t.__forward_ref__ = Rm),
    (t.toString = function () {
      return ct(this())
    }),
    t
  )
}
function at(t) {
  return TE(t) ? t() : t
}
function TE(t) {
  return (
    typeof t == 'function' && t.hasOwnProperty(EE) && t.__forward_ref__ === Rm
  )
}
function Mm(t) {
  return t && !!t.ɵproviders
}
var DE = Y({ ɵcmp: Y }),
  CE = Y({ ɵdir: Y }),
  bE = Y({ ɵpipe: Y })
var Zp = Y({ ɵfac: Y }),
  ni = Y({ __NG_ELEMENT_ID__: Y }),
  Xp = Y({ __NG_ENV_ID__: Y })
function Bu(t) {
  return typeof t == 'string' ? t : t == null ? '' : String(t)
}
function AE(t) {
  return typeof t == 'function'
    ? t.name || t.toString()
    : typeof t == 'object' && t != null && typeof t.type == 'function'
      ? t.type.name || t.type.toString()
      : Bu(t)
}
function SE(t, e) {
  let n = e ? `. Dependency path: ${e.join(' > ')} > ${t}` : ''
  throw new $(-200, `Circular dependency in DI detected for ${t}${n}`)
}
function $u(t, e) {
  throw new $(-201, !1)
}
function xE(t, e) {
  t == null && NE(e, t, null, '!=')
}
function NE(t, e, n, r) {
  throw new Error(
    `ASSERTION ERROR: ${t}` +
      (r == null ? '' : ` [Expected=> ${n} ${r} ${e} <=Actual]`)
  )
}
function X(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  }
}
function An(t) {
  return { providers: t.providers || [], imports: t.imports || [] }
}
function Hu(t) {
  return em(t, Pm) || em(t, km)
}
function em(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null
}
function RE(t) {
  let e = t && (t[Pm] || t[km])
  return e || null
}
function tm(t) {
  return t && (t.hasOwnProperty(nm) || t.hasOwnProperty(ME)) ? t[nm] : null
}
var Pm = Y({ ɵprov: Y }),
  nm = Y({ ɵinj: Y }),
  km = Y({ ngInjectableDef: Y }),
  ME = Y({ ngInjectorDef: Y }),
  O = (function (t) {
    return (
      (t[(t.Default = 0)] = 'Default'),
      (t[(t.Host = 1)] = 'Host'),
      (t[(t.Self = 2)] = 'Self'),
      (t[(t.SkipSelf = 4)] = 'SkipSelf'),
      (t[(t.Optional = 8)] = 'Optional'),
      t
    )
  })(O || {}),
  eu
function PE() {
  return eu
}
function Ye(t) {
  let e = eu
  return (eu = t), e
}
function Om(t, e, n) {
  let r = Hu(t)
  if (r && r.providedIn == 'root')
    return r.value === void 0 ? (r.value = r.factory()) : r.value
  if (n & O.Optional) return null
  if (e !== void 0) return e
  $u(t, 'Injector')
}
var ri = globalThis
var W = class {
  constructor(e, n) {
    ;(this._desc = e),
      (this.ngMetadataName = 'InjectionToken'),
      (this.ɵprov = void 0),
      typeof n == 'number'
        ? (this.__NG_ELEMENT_ID__ = n)
        : n !== void 0 &&
          (this.ɵprov = X({
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
var kE = {},
  oi = kE,
  tu = '__NG_DI_FLAG__',
  io = 'ngTempTokenPath',
  OE = 'ngTokenPath',
  FE = /\n/gm,
  LE = '\u0275',
  rm = '__source',
  ii
function lr(t) {
  let e = ii
  return (ii = t), e
}
function VE(t, e = O.Default) {
  if (ii === void 0) throw new $(-203, !1)
  return ii === null
    ? Om(t, void 0, e)
    : ii.get(t, e & O.Optional ? null : void 0, e)
}
function V(t, e = O.Default) {
  return (PE() || VE)(at(t), e)
}
function ie(t, e = O.Default) {
  return V(t, _o(e))
}
function _o(t) {
  return typeof t > 'u' || typeof t == 'number'
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4)
}
function nu(t) {
  let e = []
  for (let n = 0; n < t.length; n++) {
    let r = at(t[n])
    if (Array.isArray(r)) {
      if (r.length === 0) throw new $(900, !1)
      let i,
        s = O.Default
      for (let o = 0; o < r.length; o++) {
        let a = r[o],
          c = jE(a)
        typeof c == 'number' ? (c === -1 ? (i = a.token) : (s |= c)) : (i = a)
      }
      e.push(V(i, s))
    } else e.push(V(r))
  }
  return e
}
function UE(t, e) {
  return (t[tu] = e), (t.prototype[tu] = e), t
}
function jE(t) {
  return t[tu]
}
function BE(t, e, n, r) {
  let i = t[io]
  throw (
    (e[rm] && i.unshift(e[rm]),
    (t.message = $E(
      `
` + t.message,
      i,
      n,
      r
    )),
    (t[OE] = i),
    (t[io] = null),
    t)
  )
}
function $E(t, e, n, r = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == LE
      ? t.slice(2)
      : t
  let i = ct(e)
  if (Array.isArray(e)) i = e.map(ct).join(' -> ')
  else if (typeof e == 'object') {
    let s = []
    for (let o in e)
      if (e.hasOwnProperty(o)) {
        let a = e[o]
        s.push(o + ':' + (typeof a == 'string' ? JSON.stringify(a) : ct(a)))
      }
    i = `{${s.join(', ')}}`
  }
  return `${n}${r ? '(' + r + ')' : ''}[${i}]: ${t.replace(
    FE,
    `
  `
  )}`
}
function Io(t) {
  return { toString: t }.toString()
}
var Fm = (function (t) {
    return (t[(t.OnPush = 0)] = 'OnPush'), (t[(t.Default = 1)] = 'Default'), t
  })(Fm || {}),
  _t = (function (t) {
    return (
      (t[(t.Emulated = 0)] = 'Emulated'),
      (t[(t.None = 2)] = 'None'),
      (t[(t.ShadowDom = 3)] = 'ShadowDom'),
      t
    )
  })(_t || {}),
  ai = {},
  He = [],
  Yt = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.SignalBased = 1)] = 'SignalBased'),
      (t[(t.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      t
    )
  })(Yt || {})
function Lm(t, e, n) {
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
function ru(t, e, n) {
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
      qE(s) ? t.setProperty(e, s, o) : t.setAttribute(e, s, o), r++
    }
  }
  return r
}
function HE(t) {
  return t === 3 || t === 4 || t === 6
}
function qE(t) {
  return t.charCodeAt(0) === 64
}
function qu(t, e) {
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
              ? im(t, n, i, null, e[++r])
              : im(t, n, i, null, null))
      }
    }
  return t
}
function im(t, e, n, r, i) {
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
var Vm = 'ng-template'
function zE(t, e, n) {
  let r = 0,
    i = !0
  for (; r < t.length; ) {
    let s = t[r++]
    if (typeof s == 'string' && i) {
      let o = t[r++]
      if (n && s === 'class' && Lm(o.toLowerCase(), e, 0) !== -1) return !0
    } else if (s === 1) {
      for (; r < t.length && typeof (s = t[r++]) == 'string'; )
        if (s.toLowerCase() === e) return !0
      return !1
    } else typeof s == 'number' && (i = !1)
  }
  return !1
}
function Um(t) {
  return t.type === 4 && t.value !== Vm
}
function GE(t, e, n) {
  let r = t.type === 4 && !n ? Vm : t.value
  return e === r
}
function WE(t, e, n) {
  let r = 4,
    i = t.attrs || [],
    s = YE(i),
    o = !1
  for (let a = 0; a < e.length; a++) {
    let c = e[a]
    if (typeof c == 'number') {
      if (!o && !st(r) && !st(c)) return !1
      if (o && st(c)) continue
      ;(o = !1), (r = c | (r & 1))
      continue
    }
    if (!o)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== '' && !GE(t, c, n)) || (c === '' && e.length === 1))
        ) {
          if (st(r)) return !1
          o = !0
        }
      } else {
        let u = r & 8 ? c : e[++a]
        if (r & 8 && t.attrs !== null) {
          if (!zE(t.attrs, u, n)) {
            if (st(r)) return !1
            o = !0
          }
          continue
        }
        let l = r & 8 ? 'class' : c,
          d = KE(l, i, Um(t), n)
        if (d === -1) {
          if (st(r)) return !1
          o = !0
          continue
        }
        if (u !== '') {
          let h
          d > s ? (h = '') : (h = i[d + 1].toLowerCase())
          let f = r & 8 ? h : null
          if ((f && Lm(f, u, 0) !== -1) || (r & 2 && u !== h)) {
            if (st(r)) return !1
            o = !0
          }
        }
      }
  }
  return st(r) || o
}
function st(t) {
  return (t & 1) === 0
}
function KE(t, e, n, r) {
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
  } else return JE(e, t)
}
function QE(t, e, n = !1) {
  for (let r = 0; r < e.length; r++) if (WE(t, e[r], n)) return !0
  return !1
}
function YE(t) {
  for (let e = 0; e < t.length; e++) {
    let n = t[e]
    if (HE(n)) return e
  }
  return t.length
}
function JE(t, e) {
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
function sm(t, e) {
  return t ? ':not(' + e.trim() + ')' : e
}
function ZE(t) {
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
      i !== '' && !st(o) && ((e += sm(s, i)), (i = '')),
        (r = o),
        (s = s || !st(r))
    n++
  }
  return i !== '' && (e += sm(s, i)), e
}
function XE(t) {
  return t.map(ZE).join(',')
}
function eT(t) {
  let e = [],
    n = [],
    r = 1,
    i = 2
  for (; r < t.length; ) {
    let s = t[r]
    if (typeof s == 'string')
      i === 2 ? s !== '' && e.push(s, t[++r]) : i === 8 && n.push(s)
    else {
      if (!st(i)) break
      i = s
    }
    r++
  }
  return { attrs: e, classes: n }
}
function oe(t) {
  return Io(() => {
    let e = qm(t),
      n = Pt(gt({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Fm.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || _t.Emulated,
        styles: t.styles || He,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: '',
      })
    zm(n)
    let r = t.dependencies
    return (
      (n.directiveDefs = am(r, !1)), (n.pipeDefs = am(r, !0)), (n.id = iT(n)), n
    )
  })
}
function tT(t) {
  return wo(t) || $m(t)
}
function nT(t) {
  return t !== null
}
function Sn(t) {
  return Io(() => ({
    type: t.type,
    bootstrap: t.bootstrap || He,
    declarations: t.declarations || He,
    imports: t.imports || He,
    exports: t.exports || He,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }))
}
function om(t, e) {
  if (t == null) return ai
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
function jm(t) {
  return Io(() => {
    let e = qm(t)
    return zm(e), e
  })
}
function Bm(t) {
  return {
    type: t.type,
    name: t.name,
    factory: null,
    pure: t.pure !== !1,
    standalone: t.standalone === !0,
    onDestroy: t.type.prototype.ngOnDestroy || null,
  }
}
function wo(t) {
  return t[DE] || null
}
function $m(t) {
  return t[CE] || null
}
function Hm(t) {
  return t[bE] || null
}
function rT(t) {
  let e = wo(t) || $m(t) || Hm(t)
  return e !== null ? e.standalone : !1
}
function qm(t) {
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
    inputConfig: t.inputs || ai,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || He,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: om(t.inputs, e),
    outputs: om(t.outputs),
    debugInfo: null,
  }
}
function zm(t) {
  t.features?.forEach((e) => e(t))
}
function am(t, e) {
  if (!t) return null
  let n = e ? Hm : tT
  return () => (typeof t == 'function' ? t() : t).map((r) => n(r)).filter(nT)
}
function iT(t) {
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
var Lt = 0,
  P = 1,
  b = 2,
  ze = 3,
  ut = 4,
  wt = 5,
  ci = 6,
  ui = 7,
  De = 8,
  mr = 9,
  It = 10,
  Me = 11,
  li = 12,
  cm = 13,
  _r = 14,
  lt = 15,
  Eo = 16,
  dr = 17,
  di = 18,
  To = 19,
  Gm = 20,
  si = 21,
  jc = 22,
  wn = 23,
  Ge = 25,
  Wm = 1
var hi = 7,
  sT = 8,
  so = 9,
  Ue = 10,
  zu = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      t
    )
  })(zu || {})
function In(t) {
  return Array.isArray(t) && typeof t[Wm] == 'object'
}
function xn(t) {
  return Array.isArray(t) && t[Wm] === !0
}
function Km(t) {
  return (t.flags & 4) !== 0
}
function Do(t) {
  return t.componentOffset > -1
}
function Gu(t) {
  return (t.flags & 1) === 1
}
function wi(t) {
  return !!t.template
}
function oT(t) {
  return (t[b] & 512) !== 0
}
function gr(t, e) {
  let n = t.hasOwnProperty(Zp)
  return n ? t[Zp] : null
}
var iu = class {
  constructor(e, n, r) {
    ;(this.previousValue = e), (this.currentValue = n), (this.firstChange = r)
  }
  isFirstChange() {
    return this.firstChange
  }
}
function Qm(t, e, n, r) {
  e !== null ? e.applyValueToInputSignal(e, r) : (t[n] = r)
}
function Ym() {
  return Jm
}
function Jm(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = cT), aT
}
Ym.ngInherit = !0
function aT() {
  let t = Xm(this),
    e = t?.current
  if (e) {
    let n = t.previous
    if (n === ai) t.previous = e
    else for (let r in e) n[r] = e[r]
    ;(t.current = null), this.ngOnChanges(e)
  }
}
function cT(t, e, n, r, i) {
  let s = this.declaredInputs[r],
    o = Xm(t) || uT(t, { previous: ai, current: null }),
    a = o.current || (o.current = {}),
    c = o.previous,
    u = c[s]
  ;(a[s] = new iu(u && u.currentValue, n, c === ai)), Qm(t, e, i, n)
}
var Zm = '__ngSimpleChanges__'
function Xm(t) {
  return t[Zm] || null
}
function uT(t, e) {
  return (t[Zm] = e)
}
var um = null
var yt = function (t, e, n) {
    um?.(t, e, n)
  },
  eg = 'svg',
  lT = 'math',
  dT = !1
function hT() {
  return dT
}
function kt(t) {
  for (; Array.isArray(t); ) t = t[Lt]
  return t
}
function tg(t, e) {
  return kt(e[t])
}
function Et(t, e) {
  return kt(e[t.index])
}
function Wu(t, e) {
  return t.data[e]
}
function fT(t, e) {
  return t[e]
}
function Zt(t, e) {
  let n = e[t]
  return In(n) ? n : n[Lt]
}
function Ku(t) {
  return (t[b] & 128) === 128
}
function oo(t, e) {
  return e == null ? null : t[e]
}
function ng(t) {
  t[dr] = 0
}
function pT(t) {
  t[b] & 1024 || ((t[b] |= 1024), Ku(t) && fi(t))
}
function mT(t, e) {
  for (; t > 0; ) (e = e[_r]), t--
  return e
}
function rg(t) {
  return t[b] & 9216 || t[wn]?.dirty
}
function su(t) {
  rg(t)
    ? fi(t)
    : t[b] & 64 &&
      (hT()
        ? ((t[b] |= 1024), fi(t))
        : t[It].changeDetectionScheduler?.notify())
}
function fi(t) {
  t[It].changeDetectionScheduler?.notify()
  let e = pi(t)
  for (; e !== null && !(e[b] & 8192 || ((e[b] |= 8192), !Ku(e))); ) e = pi(e)
}
function gT(t, e) {
  if ((t[b] & 256) === 256) throw new $(911, !1)
  t[si] === null && (t[si] = []), t[si].push(e)
}
function pi(t) {
  let e = t[ze]
  return xn(e) ? e[ze] : e
}
var R = { lFrame: dg(null), bindingsEnabled: !0, skipHydrationRootTNode: null }
function yT() {
  return R.lFrame.elementDepthCount
}
function vT() {
  R.lFrame.elementDepthCount++
}
function _T() {
  R.lFrame.elementDepthCount--
}
function ig() {
  return R.bindingsEnabled
}
function IT() {
  return R.skipHydrationRootTNode !== null
}
function wT(t) {
  return R.skipHydrationRootTNode === t
}
function ET() {
  R.skipHydrationRootTNode = null
}
function Z() {
  return R.lFrame.lView
}
function Vt() {
  return R.lFrame.tView
}
function Je(t) {
  return (R.lFrame.contextLView = t), t[De]
}
function Ze(t) {
  return (R.lFrame.contextLView = null), t
}
function Ut() {
  let t = sg()
  for (; t !== null && t.type === 64; ) t = t.parent
  return t
}
function sg() {
  return R.lFrame.currentTNode
}
function TT() {
  let t = R.lFrame,
    e = t.currentTNode
  return t.isParent ? e : e.parent
}
function Ei(t, e) {
  let n = R.lFrame
  ;(n.currentTNode = t), (n.isParent = e)
}
function og() {
  return R.lFrame.isParent
}
function DT() {
  R.lFrame.isParent = !1
}
function ag() {
  let t = R.lFrame,
    e = t.bindingRootIndex
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e
}
function CT(t) {
  return (R.lFrame.bindingIndex = t)
}
function Co() {
  return R.lFrame.bindingIndex++
}
function bT(t) {
  let e = R.lFrame,
    n = e.bindingIndex
  return (e.bindingIndex = e.bindingIndex + t), n
}
function AT() {
  return R.lFrame.inI18n
}
function ST(t, e) {
  let n = R.lFrame
  ;(n.bindingIndex = n.bindingRootIndex = t), ou(e)
}
function xT() {
  return R.lFrame.currentDirectiveIndex
}
function ou(t) {
  R.lFrame.currentDirectiveIndex = t
}
function NT(t) {
  let e = R.lFrame.currentDirectiveIndex
  return e === -1 ? null : t[e]
}
function cg(t) {
  R.lFrame.currentQueryIndex = t
}
function RT(t) {
  let e = t[P]
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[wt] : null
}
function ug(t, e, n) {
  if (n & O.SkipSelf) {
    let i = e,
      s = t
    for (; (i = i.parent), i === null && !(n & O.Host); )
      if (((i = RT(s)), i === null || ((s = s[_r]), i.type & 10))) break
    if (i === null) return !1
    ;(e = i), (t = s)
  }
  let r = (R.lFrame = lg())
  return (r.currentTNode = e), (r.lView = t), !0
}
function Qu(t) {
  let e = lg(),
    n = t[P]
  ;(R.lFrame = e),
    (e.currentTNode = n.firstChild),
    (e.lView = t),
    (e.tView = n),
    (e.contextLView = t),
    (e.bindingIndex = n.bindingStartIndex),
    (e.inI18n = !1)
}
function lg() {
  let t = R.lFrame,
    e = t === null ? null : t.child
  return e === null ? dg(t) : e
}
function dg(t) {
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
function hg() {
  let t = R.lFrame
  return (R.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t
}
var fg = hg
function Yu() {
  let t = hg()
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
function MT(t) {
  return (R.lFrame.contextLView = mT(t, R.lFrame.contextLView))[De]
}
function Nn() {
  return R.lFrame.selectedIndex
}
function En(t) {
  R.lFrame.selectedIndex = t
}
function PT() {
  let t = R.lFrame
  return Wu(t.tView, t.selectedIndex)
}
function Ti() {
  R.lFrame.currentNamespace = eg
}
function Ju() {
  kT()
}
function kT() {
  R.lFrame.currentNamespace = null
}
function OT() {
  return R.lFrame.currentNamespace
}
var pg = !0
function Zu() {
  return pg
}
function Xu(t) {
  pg = t
}
function FT(t, e, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: s } = e.type.prototype
  if (r) {
    let o = Jm(e)
    ;(n.preOrderHooks ??= []).push(t, o),
      (n.preOrderCheckHooks ??= []).push(t, o)
  }
  i && (n.preOrderHooks ??= []).push(0 - t, i),
    s &&
      ((n.preOrderHooks ??= []).push(t, s),
      (n.preOrderCheckHooks ??= []).push(t, s))
}
function el(t, e) {
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
function Xs(t, e, n) {
  mg(t, e, 3, n)
}
function eo(t, e, n, r) {
  ;(t[b] & 3) === n && mg(t, e, n, r)
}
function Bc(t, e) {
  let n = t[b]
  ;(n & 3) === e && ((n &= 16383), (n += 1), (t[b] = n))
}
function mg(t, e, n, r) {
  let i = r !== void 0 ? t[dr] & 65535 : 0,
    s = r ?? -1,
    o = e.length - 1,
    a = 0
  for (let c = i; c < o; c++)
    if (typeof e[c + 1] == 'number') {
      if (((a = e[c]), r != null && a >= r)) break
    } else
      e[c] < 0 && (t[dr] += 65536),
        (a < s || s == -1) &&
          (LT(t, n, e, c), (t[dr] = (t[dr] & 4294901760) + c + 2)),
        c++
}
function lm(t, e) {
  yt(4, t, e)
  let n = pe(null)
  try {
    e.call(t)
  } finally {
    pe(n), yt(5, t, e)
  }
}
function LT(t, e, n, r) {
  let i = n[r] < 0,
    s = n[r + 1],
    o = i ? -n[r] : n[r],
    a = t[o]
  i
    ? t[b] >> 14 < t[dr] >> 16 &&
      (t[b] & 3) === e &&
      ((t[b] += 16384), lm(a, s))
    : lm(a, s)
}
var pr = -1,
  mi = class {
    constructor(e, n, r) {
      ;(this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r)
    }
  }
function VT(t) {
  return t instanceof mi
}
function UT(t) {
  return (t.flags & 8) !== 0
}
function jT(t) {
  return (t.flags & 16) !== 0
}
function BT(t) {
  return t !== pr
}
function au(t) {
  return t & 32767
}
function $T(t) {
  return t >> 16
}
function cu(t, e) {
  let n = $T(t),
    r = e
  for (; n > 0; ) (r = r[_r]), n--
  return r
}
var uu = !0
function ao(t) {
  let e = uu
  return (uu = t), e
}
var HT = 256,
  gg = HT - 1,
  yg = 5,
  qT = 0,
  vt = {}
function zT(t, e, n) {
  let r
  typeof n == 'string'
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(ni) && (r = n[ni]),
    r == null && (r = n[ni] = qT++)
  let i = r & gg,
    s = 1 << i
  e.data[t + (i >> yg)] |= s
}
function vg(t, e) {
  let n = _g(t, e)
  if (n !== -1) return n
  let r = e[P]
  r.firstCreatePass &&
    ((t.injectorIndex = e.length),
    $c(r.data, t),
    $c(e, null),
    $c(r.blueprint, null))
  let i = Ig(t, e),
    s = t.injectorIndex
  if (BT(i)) {
    let o = au(i),
      a = cu(i, e),
      c = a[P].data
    for (let u = 0; u < 8; u++) e[s + u] = a[o + u] | c[o + u]
  }
  return (e[s + 8] = i), s
}
function $c(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e)
}
function _g(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex
}
function Ig(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex
  let n = 0,
    r = null,
    i = e
  for (; i !== null; ) {
    if (((r = Cg(i)), r === null)) return pr
    if ((n++, (i = i[_r]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16)
  }
  return pr
}
function GT(t, e, n) {
  zT(t, e, n)
}
function wg(t, e, n) {
  if (n & O.Optional || t !== void 0) return t
  $u(e, 'NodeInjector')
}
function Eg(t, e, n, r) {
  if (
    (n & O.Optional && r === void 0 && (r = null), !(n & (O.Self | O.Host)))
  ) {
    let i = t[mr],
      s = Ye(void 0)
    try {
      return i ? i.get(e, r, n & O.Optional) : Om(e, r, n & O.Optional)
    } finally {
      Ye(s)
    }
  }
  return wg(r, e, n)
}
function Tg(t, e, n, r = O.Default, i) {
  if (t !== null) {
    if (e[b] & 2048 && !(r & O.Self)) {
      let o = JT(t, e, n, r, vt)
      if (o !== vt) return o
    }
    let s = Dg(t, e, n, r, vt)
    if (s !== vt) return s
  }
  return Eg(e, n, r, i)
}
function Dg(t, e, n, r, i) {
  let s = QT(n)
  if (typeof s == 'function') {
    if (!ug(e, t, r)) return r & O.Host ? wg(i, n, r) : Eg(e, n, r, i)
    try {
      let o
      if (((o = s(r)), o == null && !(r & O.Optional))) $u(n)
      else return o
    } finally {
      fg()
    }
  } else if (typeof s == 'number') {
    let o = null,
      a = _g(t, e),
      c = pr,
      u = r & O.Host ? e[lt][wt] : null
    for (
      (a === -1 || r & O.SkipSelf) &&
      ((c = a === -1 ? Ig(t, e) : e[a + 8]),
      c === pr || !hm(r, !1)
        ? (a = -1)
        : ((o = e[P]), (a = au(c)), (e = cu(c, e))));
      a !== -1;

    ) {
      let l = e[P]
      if (dm(s, a, l.data)) {
        let d = WT(a, e, n, o, r, u)
        if (d !== vt) return d
      }
      ;(c = e[a + 8]),
        c !== pr && hm(r, e[P].data[a + 8] === u) && dm(s, a, e)
          ? ((o = l), (a = au(c)), (e = cu(c, e)))
          : (a = -1)
    }
  }
  return i
}
function WT(t, e, n, r, i, s) {
  let o = e[P],
    a = o.data[t + 8],
    c = r == null ? Do(a) && uu : r != o && (a.type & 3) !== 0,
    u = i & O.Host && s === a,
    l = KT(a, o, n, c, u)
  return l !== null ? gi(e, o, l, a) : vt
}
function KT(t, e, n, r, i) {
  let s = t.providerIndexes,
    o = e.data,
    a = s & 1048575,
    c = t.directiveStart,
    u = t.directiveEnd,
    l = s >> 20,
    d = r ? a : a + l,
    h = i ? a + l : u
  for (let f = d; f < h; f++) {
    let g = o[f]
    if ((f < c && n === g) || (f >= c && g.type === n)) return f
  }
  if (i) {
    let f = o[c]
    if (f && wi(f) && f.type === n) return c
  }
  return null
}
function gi(t, e, n, r) {
  let i = t[n],
    s = e.data
  if (VT(i)) {
    let o = i
    o.resolving && SE(AE(s[n]))
    let a = ao(o.canSeeViewProviders)
    o.resolving = !0
    let c,
      u = o.injectImpl ? Ye(o.injectImpl) : null,
      l = ug(t, r, O.Default)
    try {
      ;(i = t[n] = o.factory(void 0, s, t, r)),
        e.firstCreatePass && n >= r.directiveStart && FT(n, s[n], e)
    } finally {
      u !== null && Ye(u), ao(a), (o.resolving = !1), fg()
    }
  }
  return i
}
function QT(t) {
  if (typeof t == 'string') return t.charCodeAt(0) || 0
  let e = t.hasOwnProperty(ni) ? t[ni] : void 0
  return typeof e == 'number' ? (e >= 0 ? e & gg : YT) : e
}
function dm(t, e, n) {
  let r = 1 << t
  return !!(n[e + (t >> yg)] & r)
}
function hm(t, e) {
  return !(t & O.Self) && !(t & O.Host && e)
}
var co = class {
  constructor(e, n) {
    ;(this._tNode = e), (this._lView = n)
  }
  get(e, n, r) {
    return Tg(this._tNode, this._lView, e, _o(r), n)
  }
}
function YT() {
  return new co(Ut(), Z())
}
function JT(t, e, n, r, i) {
  let s = t,
    o = e
  for (; s !== null && o !== null && o[b] & 2048 && !(o[b] & 512); ) {
    let a = Dg(s, o, n, r | O.Self, vt)
    if (a !== vt) return a
    let c = s.parent
    if (!c) {
      let u = o[Gm]
      if (u) {
        let l = u.get(n, vt, r)
        if (l !== vt) return l
      }
      ;(c = Cg(o)), (o = o[_r])
    }
    s = c
  }
  return i
}
function Cg(t) {
  let e = t[P],
    n = e.type
  return n === 2 ? e.declTNode : n === 1 ? t[wt] : null
}
var Js = '__parameters__'
function ZT(t) {
  return function (...n) {
    if (t) {
      let r = t(...n)
      for (let i in r) this[i] = r[i]
    }
  }
}
function XT(t, e, n) {
  return Io(() => {
    let r = ZT(e)
    function i(...s) {
      if (this instanceof i) return r.apply(this, s), this
      let o = new i(...s)
      return (a.annotation = o), a
      function a(c, u, l) {
        let d = c.hasOwnProperty(Js)
          ? c[Js]
          : Object.defineProperty(c, Js, { value: [] })[Js]
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
function tl(t, e) {
  t.forEach((n) => (Array.isArray(n) ? tl(n, e) : e(n)))
}
function eD(t, e, n) {
  e >= t.length ? t.push(n) : t.splice(e, 0, n)
}
function bg(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0]
}
function tD(t, e, n, r) {
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
function nl(t, e, n) {
  let r = Di(t, e)
  return r >= 0 ? (t[r | 1] = n) : ((r = ~r), tD(t, r, e, n)), r
}
function Hc(t, e) {
  let n = Di(t, e)
  if (n >= 0) return t[n | 1]
}
function Di(t, e) {
  return nD(t, e, 1)
}
function nD(t, e, n) {
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
var jt = UE(XT('Optional'), 8)
var yi = new W('ENVIRONMENT_INITIALIZER'),
  Ag = new W('INJECTOR', -1),
  Sg = new W('INJECTOR_DEF_TYPES'),
  uo = class {
    get(e, n = oi) {
      if (n === oi) {
        let r = new Error(`NullInjectorError: No provider for ${ct(e)}!`)
        throw ((r.name = 'NullInjectorError'), r)
      }
      return n
    }
  }
function xg(t) {
  return { ɵproviders: t }
}
function bo(...t) {
  return { ɵproviders: Ng(!0, t), ɵfromNgModule: !0 }
}
function Ng(t, ...e) {
  let n = [],
    r = new Set(),
    i,
    s = (o) => {
      n.push(o)
    }
  return (
    tl(e, (o) => {
      let a = o
      lu(a, s, [], r) && ((i ||= []), i.push(a))
    }),
    i !== void 0 && Rg(i, s),
    n
  )
}
function Rg(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { ngModule: r, providers: i } = t[n]
    rl(i, (s) => {
      e(s, r)
    })
  }
}
function lu(t, e, n, r) {
  if (((t = at(t)), !t)) return !1
  let i = null,
    s = tm(t),
    o = !s && wo(t)
  if (!s && !o) {
    let c = t.ngModule
    if (((s = tm(c)), s)) i = c
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
      for (let u of c) lu(u, e, n, r)
    }
  } else if (s) {
    if (s.imports != null && !a) {
      r.add(i)
      let u
      try {
        tl(s.imports, (l) => {
          lu(l, e, n, r) && ((u ||= []), u.push(l))
        })
      } finally {
      }
      u !== void 0 && Rg(u, e)
    }
    if (!a) {
      let u = gr(i) || (() => new i())
      e({ provide: i, useFactory: u, deps: He }, i),
        e({ provide: Sg, useValue: i, multi: !0 }, i),
        e({ provide: yi, useValue: () => V(i), multi: !0 }, i)
    }
    let c = s.providers
    if (c != null && !a) {
      let u = t
      rl(c, (l) => {
        e(l, u)
      })
    }
  } else return !1
  return i !== t && t.providers !== void 0
}
function rl(t, e) {
  for (let n of t)
    Mm(n) && (n = n.ɵproviders), Array.isArray(n) ? rl(n, e) : e(n)
}
var rD = Y({ provide: String, useValue: Y })
function Mg(t) {
  return t !== null && typeof t == 'object' && rD in t
}
function iD(t) {
  return !!(t && t.useExisting)
}
function sD(t) {
  return !!(t && t.useFactory)
}
function du(t) {
  return typeof t == 'function'
}
var Ao = new W('Set Injector scope.'),
  to = {},
  oD = {},
  qc
function il() {
  return qc === void 0 && (qc = new uo()), qc
}
var Tn = class {},
  lo = class extends Tn {
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
        fu(e, (o) => this.processProvider(o)),
        this.records.set(Ag, hr(void 0, this)),
        i.has('environment') && this.records.set(Tn, hr(void 0, this))
      let s = this.records.get(Ao)
      s != null && typeof s.value == 'string' && this.scopes.add(s.value),
        (this.injectorDefTypes = new Set(this.get(Sg, He, O.Self)))
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
      let n = lr(this),
        r = Ye(void 0),
        i
      try {
        return e()
      } finally {
        lr(n), Ye(r)
      }
    }
    get(e, n = oi, r = O.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(Xp))) return e[Xp](this)
      r = _o(r)
      let i,
        s = lr(this),
        o = Ye(void 0)
      try {
        if (!(r & O.SkipSelf)) {
          let c = this.records.get(e)
          if (c === void 0) {
            let u = hD(e) && Hu(e)
            u && this.injectableDefInScope(u)
              ? (c = hr(hu(e), to))
              : (c = null),
              this.records.set(e, c)
          }
          if (c != null) return this.hydrate(e, c)
        }
        let a = r & O.Self ? il() : this.parent
        return (n = r & O.Optional && n === oi ? null : n), a.get(e, n)
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[io] = a[io] || []).unshift(ct(e)), s)) throw a
          return BE(a, e, 'R3InjectorError', this.source)
        } else throw a
      } finally {
        Ye(o), lr(s)
      }
    }
    resolveInjectorInitializers() {
      let e = lr(this),
        n = Ye(void 0),
        r
      try {
        let i = this.get(yi, He, O.Self)
        for (let s of i) s()
      } finally {
        lr(e), Ye(n)
      }
    }
    toString() {
      let e = [],
        n = this.records
      for (let r of n.keys()) e.push(ct(r))
      return `R3Injector[${e.join(', ')}]`
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new $(205, !1)
    }
    processProvider(e) {
      e = at(e)
      let n = du(e) ? e : at(e && e.provide),
        r = cD(e)
      if (!du(e) && e.multi === !0) {
        let i = this.records.get(n)
        i ||
          ((i = hr(void 0, to, !0)),
          (i.factory = () => nu(i.multi)),
          this.records.set(n, i)),
          (n = e),
          i.multi.push(e)
      }
      this.records.set(n, r)
    }
    hydrate(e, n) {
      return (
        n.value === to && ((n.value = oD), (n.value = n.factory())),
        typeof n.value == 'object' &&
          n.value &&
          dD(n.value) &&
          this._ngOnDestroyHooks.add(n.value),
        n.value
      )
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1
      let n = at(e.providedIn)
      return typeof n == 'string'
        ? n === 'any' || this.scopes.has(n)
        : this.injectorDefTypes.has(n)
    }
    removeOnDestroy(e) {
      let n = this._onDestroyHooks.indexOf(e)
      n !== -1 && this._onDestroyHooks.splice(n, 1)
    }
  }
function hu(t) {
  let e = Hu(t),
    n = e !== null ? e.factory : gr(t)
  if (n !== null) return n
  if (t instanceof W) throw new $(204, !1)
  if (t instanceof Function) return aD(t)
  throw new $(204, !1)
}
function aD(t) {
  if (t.length > 0) throw new $(204, !1)
  let n = RE(t)
  return n !== null ? () => n.factory(t) : () => new t()
}
function cD(t) {
  if (Mg(t)) return hr(void 0, t.useValue)
  {
    let e = uD(t)
    return hr(e, to)
  }
}
function uD(t, e, n) {
  let r
  if (du(t)) {
    let i = at(t)
    return gr(i) || hu(i)
  } else if (Mg(t)) r = () => at(t.useValue)
  else if (sD(t)) r = () => t.useFactory(...nu(t.deps || []))
  else if (iD(t)) r = () => V(at(t.useExisting))
  else {
    let i = at(t && (t.useClass || t.provide))
    if (lD(t)) r = () => new i(...nu(t.deps))
    else return gr(i) || hu(i)
  }
  return r
}
function hr(t, e, n = !1) {
  return { factory: t, value: e, multi: n ? [] : void 0 }
}
function lD(t) {
  return !!t.deps
}
function dD(t) {
  return (
    t !== null && typeof t == 'object' && typeof t.ngOnDestroy == 'function'
  )
}
function hD(t) {
  return typeof t == 'function' || (typeof t == 'object' && t instanceof W)
}
function fu(t, e) {
  for (let n of t)
    Array.isArray(n) ? fu(n, e) : n && Mm(n) ? fu(n.ɵproviders, e) : e(n)
}
function fm(t, e = null, n = null, r) {
  let i = fD(t, e, n, r)
  return i.resolveInjectorInitializers(), i
}
function fD(t, e = null, n = null, r, i = new Set()) {
  let s = [n || He, bo(t)]
  return (
    (r = r || (typeof t == 'object' ? void 0 : ct(t))),
    new lo(s, e || il(), r || null, i)
  )
}
var Xt = (() => {
  let e = class e {
    static create(r, i) {
      if (Array.isArray(r)) return fm({ name: '' }, i, r, '')
      {
        let s = r.name ?? ''
        return fm({ name: s }, r.parent, r.providers, s)
      }
    }
  }
  ;(e.THROW_IF_NOT_FOUND = oi),
    (e.NULL = new uo()),
    (e.ɵprov = X({ token: e, providedIn: 'any', factory: () => V(Ag) })),
    (e.__NG_ELEMENT_ID__ = -1)
  let t = e
  return t
})()
var pu
function Pg(t) {
  pu = t
}
function pD() {
  if (pu !== void 0) return pu
  if (typeof document < 'u') return document
  throw new $(210, !1)
}
var sl = new W('AppId', { providedIn: 'root', factory: () => mD }),
  mD = 'ng',
  ol = new W('Platform Initializer'),
  en = new W('Platform ID', {
    providedIn: 'platform',
    factory: () => 'unknown',
  })
var al = new W('CSP nonce', {
  providedIn: 'root',
  factory: () =>
    pD().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
    null,
})
function kg(t) {
  return (t.flags & 128) === 128
}
var Ot = (function (t) {
  return (
    (t[(t.Important = 1)] = 'Important'), (t[(t.DashCase = 2)] = 'DashCase'), t
  )
})(Ot || {})
var Og = new Map(),
  gD = 0
function yD() {
  return gD++
}
function vD(t) {
  Og.set(t[To], t)
}
function _D(t) {
  Og.delete(t[To])
}
var pm = '__ngContext__'
function Dn(t, e) {
  In(e) ? ((t[pm] = e[To]), vD(e)) : (t[pm] = e)
}
var ID
function cl(t, e) {
  return ID(t, e)
}
function fr(t, e, n, r, i) {
  if (r != null) {
    let s,
      o = !1
    xn(r) ? (s = r) : In(r) && ((o = !0), (r = r[Lt]))
    let a = kt(r)
    t === 0 && n !== null
      ? i == null
        ? Ug(e, n, a)
        : mu(e, n, a, i || null, !0)
      : t === 1 && n !== null
        ? mu(e, n, a, i || null, !0)
        : t === 2
          ? FD(e, a, o)
          : t === 3 && e.destroyNode(a),
      s != null && VD(e, t, s, n, i)
  }
}
function wD(t, e) {
  return t.createText(e)
}
function ED(t, e, n) {
  t.setValue(e, n)
}
function Fg(t, e, n) {
  return t.createElement(e, n)
}
function TD(t, e) {
  Lg(t, e), (e[Lt] = null), (e[wt] = null)
}
function DD(t, e, n, r, i, s) {
  ;(r[Lt] = i), (r[wt] = e), So(t, r, n, 1, i, s)
}
function Lg(t, e) {
  e[It].changeDetectionScheduler?.notify(), So(t, e, e[Me], 2, null, null)
}
function CD(t) {
  let e = t[li]
  if (!e) return zc(t[P], t)
  for (; e; ) {
    let n = null
    if (In(e)) n = e[li]
    else {
      let r = e[Ue]
      r && (n = r)
    }
    if (!n) {
      for (; e && !e[ut] && e !== t; ) In(e) && zc(e[P], e), (e = e[ze])
      e === null && (e = t), In(e) && zc(e[P], e), (n = e && e[ut])
    }
    e = n
  }
}
function bD(t, e, n, r) {
  let i = Ue + r,
    s = n.length
  r > 0 && (n[i - 1][ut] = e),
    r < s - Ue
      ? ((e[ut] = n[i]), eD(n, Ue + r, e))
      : (n.push(e), (e[ut] = null)),
    (e[ze] = n)
  let o = e[Eo]
  o !== null && n !== o && AD(o, e)
  let a = e[di]
  a !== null && a.insertView(t), su(e), (e[b] |= 128)
}
function AD(t, e) {
  let n = t[so],
    i = e[ze][ze][lt]
  e[lt] !== i && (t[b] |= zu.HasTransplantedViews),
    n === null ? (t[so] = [e]) : n.push(e)
}
function Vg(t, e) {
  let n = t[so],
    r = n.indexOf(e)
  n.splice(r, 1)
}
function ul(t, e) {
  if (t.length <= Ue) return
  let n = Ue + e,
    r = t[n]
  if (r) {
    let i = r[Eo]
    i !== null && i !== t && Vg(i, r), e > 0 && (t[n - 1][ut] = r[ut])
    let s = bg(t, Ue + e)
    TD(r[P], r)
    let o = s[di]
    o !== null && o.detachView(s[P]),
      (r[ze] = null),
      (r[ut] = null),
      (r[b] &= -129)
  }
  return r
}
function ll(t, e) {
  if (!(e[b] & 256)) {
    let n = e[Me]
    n.destroyNode && So(t, e, n, 3, null, null), CD(e)
  }
}
function zc(t, e) {
  if (!(e[b] & 256)) {
    ;(e[b] &= -129),
      (e[b] |= 256),
      e[wn] && Cp(e[wn]),
      xD(t, e),
      SD(t, e),
      e[P].type === 1 && e[Me].destroy()
    let n = e[Eo]
    if (n !== null && xn(e[ze])) {
      n !== e[ze] && Vg(n, e)
      let r = e[di]
      r !== null && r.detachView(t)
    }
    _D(e)
  }
}
function SD(t, e) {
  let n = t.cleanup,
    r = e[ui]
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == 'string') {
        let o = n[s + 3]
        o >= 0 ? r[o]() : r[-o].unsubscribe(), (s += 2)
      } else {
        let o = r[n[s + 1]]
        n[s].call(o)
      }
  r !== null && (e[ui] = null)
  let i = e[si]
  if (i !== null) {
    e[si] = null
    for (let s = 0; s < i.length; s++) {
      let o = i[s]
      o()
    }
  }
}
function xD(t, e) {
  let n
  if (t != null && (n = t.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = e[n[r]]
      if (!(i instanceof mi)) {
        let s = n[r + 1]
        if (Array.isArray(s))
          for (let o = 0; o < s.length; o += 2) {
            let a = i[s[o]],
              c = s[o + 1]
            yt(4, a, c)
            try {
              c.call(a)
            } finally {
              yt(5, a, c)
            }
          }
        else {
          yt(4, i, s)
          try {
            s.call(i)
          } finally {
            yt(5, i, s)
          }
        }
      }
    }
}
function ND(t, e, n) {
  return RD(t, e.parent, n)
}
function RD(t, e, n) {
  let r = e
  for (; r !== null && r.type & 40; ) (e = r), (r = e.parent)
  if (r === null) return n[Lt]
  {
    let { componentOffset: i } = r
    if (i > -1) {
      let { encapsulation: s } = t.data[r.directiveStart + i]
      if (s === _t.None || s === _t.Emulated) return null
    }
    return Et(r, n)
  }
}
function mu(t, e, n, r, i) {
  t.insertBefore(e, n, r, i)
}
function Ug(t, e, n) {
  t.appendChild(e, n)
}
function mm(t, e, n, r, i) {
  r !== null ? mu(t, e, n, r, i) : Ug(t, e, n)
}
function MD(t, e, n, r) {
  t.removeChild(e, n, r)
}
function jg(t, e) {
  return t.parentNode(e)
}
function PD(t, e, n) {
  return OD(t, e, n)
}
function kD(t, e, n) {
  return t.type & 40 ? Et(t, n) : null
}
var OD = kD,
  gm
function dl(t, e, n, r) {
  let i = ND(t, r, e),
    s = e[Me],
    o = r.parent || e[wt],
    a = PD(o, r, e)
  if (i != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) mm(s, i, n[c], a, !1)
    else mm(s, i, n, a, !1)
  gm !== void 0 && gm(s, r, e, n, i)
}
function no(t, e) {
  if (e !== null) {
    let n = e.type
    if (n & 3) return Et(e, t)
    if (n & 4) return gu(-1, t[e.index])
    if (n & 8) {
      let r = e.child
      if (r !== null) return no(t, r)
      {
        let i = t[e.index]
        return xn(i) ? gu(-1, i) : kt(i)
      }
    } else {
      if (n & 32) return cl(e, t)() || kt(t[e.index])
      {
        let r = Bg(t, e)
        if (r !== null) {
          if (Array.isArray(r)) return r[0]
          let i = pi(t[lt])
          return no(i, r)
        } else return no(t, e.next)
      }
    }
  }
  return null
}
function Bg(t, e) {
  if (e !== null) {
    let r = t[lt][wt],
      i = e.projection
    return r.projection[i]
  }
  return null
}
function gu(t, e) {
  let n = Ue + t + 1
  if (n < e.length) {
    let r = e[n],
      i = r[P].firstChild
    if (i !== null) return no(r, i)
  }
  return e[hi]
}
function FD(t, e, n) {
  let r = jg(t, e)
  r && MD(t, r, e, n)
}
function hl(t, e, n, r, i, s, o) {
  for (; n != null; ) {
    let a = r[n.index],
      c = n.type
    if (
      (o && e === 0 && (a && Dn(kt(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) hl(t, e, n.child, r, i, s, !1), fr(e, t, i, a, s)
      else if (c & 32) {
        let u = cl(n, r),
          l
        for (; (l = u()); ) fr(e, t, i, l, s)
        fr(e, t, i, a, s)
      } else c & 16 ? LD(t, e, r, n, i, s) : fr(e, t, i, a, s)
    n = o ? n.projectionNext : n.next
  }
}
function So(t, e, n, r, i, s) {
  hl(n, r, t.firstChild, e, i, s, !1)
}
function LD(t, e, n, r, i, s) {
  let o = n[lt],
    c = o[wt].projection[r.projection]
  if (Array.isArray(c))
    for (let u = 0; u < c.length; u++) {
      let l = c[u]
      fr(e, t, i, l, s)
    }
  else {
    let u = c,
      l = o[ze]
    kg(r) && (u.flags |= 128), hl(t, e, u, l, i, s, !0)
  }
}
function VD(t, e, n, r, i) {
  let s = n[hi],
    o = kt(n)
  s !== o && fr(e, t, r, s, i)
  for (let a = Ue; a < n.length; a++) {
    let c = n[a]
    So(c[P], c, t, e, r, s)
  }
}
function UD(t, e, n, r, i) {
  if (e) i ? t.addClass(n, r) : t.removeClass(n, r)
  else {
    let s = r.indexOf('-') === -1 ? void 0 : Ot.DashCase
    i == null
      ? t.removeStyle(n, r, s)
      : (typeof i == 'string' &&
          i.endsWith('!important') &&
          ((i = i.slice(0, -10)), (s |= Ot.Important)),
        t.setStyle(n, r, i, s))
  }
}
function jD(t, e, n) {
  t.setAttribute(e, 'style', n)
}
function $g(t, e, n) {
  n === '' ? t.removeAttribute(e, 'class') : t.setAttribute(e, 'class', n)
}
function Hg(t, e, n) {
  let { mergedAttrs: r, classes: i, styles: s } = n
  r !== null && ru(t, e, r),
    i !== null && $g(t, e, i),
    s !== null && jD(t, e, s)
}
var ho = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Nm})`
  }
}
function xo(t) {
  return t instanceof ho ? t.changingThisBreaksApplicationSecurity : t
}
function qg(t, e) {
  let n = BD(t)
  if (n != null && n !== e) {
    if (n === 'ResourceURL' && e === 'URL') return !0
    throw new Error(`Required a safe ${e}, got a ${n} (see ${Nm})`)
  }
  return n === e
}
function BD(t) {
  return (t instanceof ho && t.getTypeName()) || null
}
var $D = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i
function zg(t) {
  return (t = String(t)), t.match($D) ? t : 'unsafe:' + t
}
var fl = (function (t) {
  return (
    (t[(t.NONE = 0)] = 'NONE'),
    (t[(t.HTML = 1)] = 'HTML'),
    (t[(t.STYLE = 2)] = 'STYLE'),
    (t[(t.SCRIPT = 3)] = 'SCRIPT'),
    (t[(t.URL = 4)] = 'URL'),
    (t[(t.RESOURCE_URL = 5)] = 'RESOURCE_URL'),
    t
  )
})(fl || {})
function No(t) {
  let e = HD()
  return e ? e.sanitize(fl.URL, t) || '' : qg(t, 'URL') ? xo(t) : zg(Bu(t))
}
function HD() {
  let t = Z()
  return t && t[It].sanitizer
}
var yu = class {}
var qD = 'h',
  zD = 'b'
var GD = () => null
function pl(t, e, n = !1) {
  return GD(t, e, n)
}
var vu = class {},
  fo = class {}
function WD(t) {
  let e = Error(`No component factory found for ${ct(t)}.`)
  return (e[KD] = t), e
}
var KD = 'ngComponent'
var _u = class {
    resolveComponentFactory(e) {
      throw WD(e)
    }
  },
  ml = (() => {
    let e = class e {}
    e.NULL = new _u()
    let t = e
    return t
  })()
function QD() {
  return Gg(Ut(), Z())
}
function Gg(t, e) {
  return new Ro(Et(t, e))
}
var Ro = (() => {
  let e = class e {
    constructor(r) {
      this.nativeElement = r
    }
  }
  e.__NG_ELEMENT_ID__ = QD
  let t = e
  return t
})()
var vi = class {},
  gl = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null
      }
    }
    e.__NG_ELEMENT_ID__ = () => YD()
    let t = e
    return t
  })()
function YD() {
  let t = Z(),
    e = Ut(),
    n = Zt(e.index, t)
  return (In(n) ? n : t)[Me]
}
var JD = (() => {
    let e = class e {}
    e.ɵprov = X({ token: e, providedIn: 'root', factory: () => null })
    let t = e
    return t
  })(),
  Gc = {}
function yl(t) {
  let e = pe(null)
  try {
    return t()
  } finally {
    pe(e)
  }
}
function po(t, e, n, r, i = !1) {
  for (; n !== null; ) {
    let s = e[n.index]
    s !== null && r.push(kt(s)), xn(s) && ZD(s, r)
    let o = n.type
    if (o & 8) po(t, e, n.child, r)
    else if (o & 32) {
      let a = cl(n, e),
        c
      for (; (c = a()); ) r.push(c)
    } else if (o & 16) {
      let a = Bg(e, n)
      if (Array.isArray(a)) r.push(...a)
      else {
        let c = pi(e[lt])
        po(c[P], c, a, r, !0)
      }
    }
    n = i ? n.projectionNext : n.next
  }
  return r
}
function ZD(t, e) {
  for (let n = Ue; n < t.length; n++) {
    let r = t[n],
      i = r[P].firstChild
    i !== null && po(r[P], r, i, e)
  }
  t[hi] !== t[Lt] && e.push(t[hi])
}
var Wg = []
function XD(t) {
  return t[wn] ?? e0(t)
}
function e0(t) {
  let e = Wg.pop() ?? Object.create(n0)
  return (e.lView = t), e
}
function t0(t) {
  t.lView[wn] !== t && ((t.lView = null), Wg.push(t))
}
var n0 = Pt(gt({}, Ep), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    fi(t.lView)
  },
  consumerOnSignalRead() {
    this.lView[wn] = this
  },
})
function Kg(t) {
  return Yg(t[li])
}
function Qg(t) {
  return Yg(t[ut])
}
function Yg(t) {
  for (; t !== null && !xn(t); ) t = t[ut]
  return t
}
var r0 = 'ngOriginalError'
function Wc(t) {
  return t[r0]
}
var Ft = class {
    constructor() {
      this._console = console
    }
    handleError(e) {
      let n = this._findOriginalError(e)
      this._console.error('ERROR', e),
        n && this._console.error('ORIGINAL ERROR', n)
    }
    _findOriginalError(e) {
      let n = e && Wc(e)
      for (; n && Wc(n); ) n = Wc(n)
      return n || null
    }
  },
  Jg = new W('', {
    providedIn: 'root',
    factory: () => ie(Ft).handleError.bind(void 0),
  })
var Zg = !1,
  i0 = new W('', { providedIn: 'root', factory: () => Zg })
var tn = {}
function Pe(t = 1) {
  Xg(Vt(), Z(), Nn() + t, !1)
}
function Xg(t, e, n, r) {
  if (!r)
    if ((e[b] & 3) === 3) {
      let s = t.preOrderCheckHooks
      s !== null && Xs(e, s, n)
    } else {
      let s = t.preOrderHooks
      s !== null && eo(e, s, 0, n)
    }
  En(n)
}
function Ir(t, e = O.Default) {
  let n = Z()
  if (n === null) return V(t, e)
  let r = Ut()
  return Tg(r, n, at(t), e)
}
function ey(t, e, n, r, i, s) {
  let o = pe(null)
  try {
    let a = null
    i & Yt.SignalBased && (a = e[r][wp]),
      a !== null && a.transformFn !== void 0 && (s = a.transformFn(s)),
      i & Yt.HasDecoratorInputTransform &&
        (s = t.inputTransforms[r].call(e, s)),
      t.setInput !== null ? t.setInput(e, a, s, n, r) : Qm(e, a, r, s)
  } finally {
    pe(o)
  }
}
function s0(t, e) {
  let n = t.hostBindingOpCodes
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r]
        if (i < 0) En(~i)
        else {
          let s = i,
            o = n[++r],
            a = n[++r]
          ST(o, s)
          let c = e[s]
          a(2, c)
        }
      }
    } finally {
      En(-1)
    }
}
function Mo(t, e, n, r, i, s, o, a, c, u, l) {
  let d = e.blueprint.slice()
  return (
    (d[Lt] = i),
    (d[b] = r | 4 | 128 | 8 | 64),
    (u !== null || (t && t[b] & 2048)) && (d[b] |= 2048),
    ng(d),
    (d[ze] = d[_r] = t),
    (d[De] = n),
    (d[It] = o || (t && t[It])),
    (d[Me] = a || (t && t[Me])),
    (d[mr] = c || (t && t[mr]) || null),
    (d[wt] = s),
    (d[To] = yD()),
    (d[ci] = l),
    (d[Gm] = u),
    (d[lt] = e.type == 2 ? t[lt] : d),
    d
  )
}
function Po(t, e, n, r, i) {
  let s = t.data[e]
  if (s === null) (s = o0(t, e, n, r, i)), AT() && (s.flags |= 32)
  else if (s.type & 64) {
    ;(s.type = n), (s.value = r), (s.attrs = i)
    let o = TT()
    s.injectorIndex = o === null ? -1 : o.injectorIndex
  }
  return Ei(s, !0), s
}
function o0(t, e, n, r, i) {
  let s = sg(),
    o = og(),
    a = o ? s : s && s.parent,
    c = (t.data[e] = d0(t, a, n, e, r, i))
  return (
    t.firstChild === null && (t.firstChild = c),
    s !== null &&
      (o
        ? s.child == null && c.parent !== null && (s.child = c)
        : s.next === null && ((s.next = c), (c.prev = s))),
    c
  )
}
function ty(t, e, n, r) {
  if (n === 0) return -1
  let i = e.length
  for (let s = 0; s < n; s++) e.push(r), t.blueprint.push(r), t.data.push(null)
  return i
}
function ny(t, e, n, r, i) {
  let s = Nn(),
    o = r & 2
  try {
    En(-1), o && e.length > Ge && Xg(t, e, Ge, !1), yt(o ? 2 : 0, i), n(r, i)
  } finally {
    En(s), yt(o ? 3 : 1, i)
  }
}
function ry(t, e, n) {
  if (Km(e)) {
    let r = pe(null)
    try {
      let i = e.directiveStart,
        s = e.directiveEnd
      for (let o = i; o < s; o++) {
        let a = t.data[o]
        a.contentQueries && a.contentQueries(1, n[o], o)
      }
    } finally {
      pe(r)
    }
  }
}
function iy(t, e, n) {
  ig() && (v0(t, e, n, Et(n, e)), (n.flags & 64) === 64 && uy(t, e, n))
}
function sy(t, e, n = Et) {
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
function oy(t) {
  let e = t.tView
  return e === null || e.incompleteFirstPass
    ? (t.tView = vl(
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
function vl(t, e, n, r, i, s, o, a, c, u, l) {
  let d = Ge + r,
    h = d + i,
    f = a0(d, h),
    g = typeof u == 'function' ? u() : u
  return (f[P] = {
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
    consts: g,
    incompleteFirstPass: !1,
    ssrId: l,
  })
}
function a0(t, e) {
  let n = []
  for (let r = 0; r < e; r++) n.push(r < t ? null : tn)
  return n
}
function c0(t, e, n, r) {
  let s = r.get(i0, Zg) || n === _t.ShadowDom,
    o = t.selectRootElement(e, s)
  return u0(o), o
}
function u0(t) {
  l0(t)
}
var l0 = () => null
function d0(t, e, n, r, i, s) {
  let o = e ? e.injectorIndex : -1,
    a = 0
  return (
    IT() && (a |= 128),
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
function ym(t, e, n, r, i) {
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
    t === 0 ? vm(r, n, u, a, c) : vm(r, n, u, a)
  }
  return r
}
function vm(t, e, n, r, i) {
  let s
  t.hasOwnProperty(n) ? (s = t[n]).push(e, r) : (s = t[n] = [e, r]),
    i !== void 0 && s.push(i)
}
function h0(t, e, n) {
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
      g = h ? h.outputs : null
    ;(c = ym(0, d.inputs, l, c, f)), (u = ym(1, d.outputs, l, u, g))
    let I = c !== null && o !== null && !Um(e) ? A0(c, l, o) : null
    a.push(I)
  }
  c !== null &&
    (c.hasOwnProperty('class') && (e.flags |= 8),
    c.hasOwnProperty('style') && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = u)
}
function f0(t) {
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
function p0(t, e, n, r, i, s, o, a) {
  let c = Et(e, n),
    u = e.inputs,
    l
  !a && u != null && (l = u[r])
    ? (Il(t, n, l, r, i), Do(e) && m0(n, e.index))
    : e.type & 3
      ? ((r = f0(r)),
        (i = o != null ? o(i, e.value || '', r) : i),
        s.setProperty(c, r, i))
      : e.type & 12
}
function m0(t, e) {
  let n = Zt(e, t)
  n[b] & 16 || (n[b] |= 64)
}
function ay(t, e, n, r) {
  if (ig()) {
    let i = r === null ? null : { '': -1 },
      s = I0(t, n),
      o,
      a
    s === null ? (o = a = null) : ([o, a] = s),
      o !== null && cy(t, e, n, o, i, a),
      i && w0(n, r, i)
  }
  n.mergedAttrs = qu(n.mergedAttrs, n.attrs)
}
function cy(t, e, n, r, i, s) {
  for (let u = 0; u < r.length; u++) GT(vg(n, e), t, r[u].type)
  T0(n, t.data.length, r.length)
  for (let u = 0; u < r.length; u++) {
    let l = r[u]
    l.providersResolver && l.providersResolver(l)
  }
  let o = !1,
    a = !1,
    c = ty(t, e, r.length, null)
  for (let u = 0; u < r.length; u++) {
    let l = r[u]
    ;(n.mergedAttrs = qu(n.mergedAttrs, l.hostAttrs)),
      D0(t, n, e, c, l),
      E0(c, l, i),
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
  h0(t, n, s)
}
function g0(t, e, n, r, i) {
  let s = i.hostBindings
  if (s) {
    let o = t.hostBindingOpCodes
    o === null && (o = t.hostBindingOpCodes = [])
    let a = ~e.index
    y0(o) != a && o.push(a), o.push(n, r, s)
  }
}
function y0(t) {
  let e = t.length
  for (; e > 0; ) {
    let n = t[--e]
    if (typeof n == 'number' && n < 0) return n
  }
  return 0
}
function v0(t, e, n, r) {
  let i = n.directiveStart,
    s = n.directiveEnd
  Do(n) && C0(e, n, t.data[i + n.componentOffset]),
    t.firstCreatePass || vg(n, e),
    Dn(r, e)
  let o = n.initialInputs
  for (let a = i; a < s; a++) {
    let c = t.data[a],
      u = gi(e, t, a, n)
    if ((Dn(u, e), o !== null && b0(e, a - i, u, c, n, o), wi(c))) {
      let l = Zt(n.index, e)
      l[De] = gi(e, t, a, n)
    }
  }
}
function uy(t, e, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    s = n.index,
    o = xT()
  try {
    En(s)
    for (let a = r; a < i; a++) {
      let c = t.data[a],
        u = e[a]
      ou(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          _0(c, u)
    }
  } finally {
    En(-1), ou(o)
  }
}
function _0(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e)
}
function I0(t, e) {
  let n = t.directiveRegistry,
    r = null,
    i = null
  if (n)
    for (let s = 0; s < n.length; s++) {
      let o = n[s]
      if (QE(e, o.selectors, !1))
        if ((r || (r = []), wi(o)))
          if (o.findHostDirectiveDefs !== null) {
            let a = []
            ;(i = i || new Map()),
              o.findHostDirectiveDefs(o, a, i),
              r.unshift(...a, o)
            let c = a.length
            Iu(t, e, c)
          } else r.unshift(o), Iu(t, e, 0)
        else (i = i || new Map()), o.findHostDirectiveDefs?.(o, r, i), r.push(o)
    }
  return r === null ? null : [r, i]
}
function Iu(t, e, n) {
  ;(e.componentOffset = n), (t.components ??= []).push(e.index)
}
function w0(t, e, n) {
  if (e) {
    let r = (t.localNames = [])
    for (let i = 0; i < e.length; i += 2) {
      let s = n[e[i + 1]]
      if (s == null) throw new $(-301, !1)
      r.push(e[i], s)
    }
  }
}
function E0(t, e, n) {
  if (n) {
    if (e.exportAs)
      for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t
    wi(e) && (n[''] = t)
  }
}
function T0(t, e, n) {
  ;(t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + n),
    (t.providerIndexes = e)
}
function D0(t, e, n, r, i) {
  t.data[r] = i
  let s = i.factory || (i.factory = gr(i.type, !0)),
    o = new mi(s, wi(i), Ir)
  ;(t.blueprint[r] = o), (n[r] = o), g0(t, e, r, ty(t, n, i.hostVars, tn), i)
}
function C0(t, e, n) {
  let r = Et(e, t),
    i = oy(n),
    s = t[It].rendererFactory,
    o = 16
  n.signals ? (o = 4096) : n.onPush && (o = 64)
  let a = _l(
    t,
    Mo(t, i, null, o, r, e, null, s.createRenderer(r, n), null, null, null)
  )
  t[e.index] = a
}
function b0(t, e, n, r, i, s) {
  let o = s[e]
  if (o !== null)
    for (let a = 0; a < o.length; ) {
      let c = o[a++],
        u = o[a++],
        l = o[a++],
        d = o[a++]
      ey(r, n, c, u, l, d)
    }
}
function A0(t, e, n) {
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
function S0(t, e, n, r) {
  return [t, !0, 0, e, null, r, null, n, null, null]
}
function ly(t, e) {
  let n = t.contentQueries
  if (n !== null) {
    let r = pe(null)
    try {
      for (let i = 0; i < n.length; i += 2) {
        let s = n[i],
          o = n[i + 1]
        if (o !== -1) {
          let a = t.data[o]
          cg(s), a.contentQueries(2, e[o], o)
        }
      }
    } finally {
      pe(r)
    }
  }
}
function _l(t, e) {
  return t[li] ? (t[cm][ut] = e) : (t[li] = e), (t[cm] = e), e
}
function wu(t, e, n) {
  cg(0)
  let r = pe(null)
  try {
    e(t, n)
  } finally {
    pe(r)
  }
}
function x0(t) {
  return t[ui] || (t[ui] = [])
}
function N0(t) {
  return t.cleanup || (t.cleanup = [])
}
function dy(t, e) {
  let n = t[mr],
    r = n ? n.get(Ft, null) : null
  r && r.handleError(e)
}
function Il(t, e, n, r, i) {
  for (let s = 0; s < n.length; ) {
    let o = n[s++],
      a = n[s++],
      c = n[s++],
      u = e[o],
      l = t.data[o]
    ey(l, u, r, a, c, i)
  }
}
function R0(t, e, n) {
  let r = tg(e, t)
  ED(t[Me], r, n)
}
var M0 = 100
function P0(t, e = !0) {
  let n = t[It],
    r = n.rendererFactory,
    i = !1
  i || r.begin?.()
  try {
    k0(t)
  } catch (s) {
    throw (e && dy(t, s), s)
  } finally {
    i || (r.end?.(), n.inlineEffectRunner?.flush())
  }
}
function k0(t) {
  Eu(t, 0)
  let e = 0
  for (; rg(t); ) {
    if (e === M0) throw new $(103, !1)
    e++, Eu(t, 1)
  }
}
function O0(t, e, n, r) {
  let i = e[b]
  if ((i & 256) === 256) return
  let s = !1
  !s && e[It].inlineEffectRunner?.flush(), Qu(e)
  let o = null,
    a = null
  !s && F0(t) && ((a = XD(e)), (o = Tp(a)))
  try {
    ng(e), CT(t.bindingStartIndex), n !== null && ny(t, e, n, 2, r)
    let c = (i & 3) === 3
    if (!s)
      if (c) {
        let d = t.preOrderCheckHooks
        d !== null && Xs(e, d, null)
      } else {
        let d = t.preOrderHooks
        d !== null && eo(e, d, 0, null), Bc(e, 0)
      }
    if ((L0(e), hy(e, 0), t.contentQueries !== null && ly(t, e), !s))
      if (c) {
        let d = t.contentCheckHooks
        d !== null && Xs(e, d)
      } else {
        let d = t.contentHooks
        d !== null && eo(e, d, 1), Bc(e, 1)
      }
    s0(t, e)
    let u = t.components
    u !== null && py(e, u, 0)
    let l = t.viewQuery
    if ((l !== null && wu(2, l, r), !s))
      if (c) {
        let d = t.viewCheckHooks
        d !== null && Xs(e, d)
      } else {
        let d = t.viewHooks
        d !== null && eo(e, d, 2), Bc(e, 2)
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[jc])) {
      for (let d of e[jc]) d()
      e[jc] = null
    }
    s || (e[b] &= -73)
  } catch (c) {
    throw (fi(e), c)
  } finally {
    a !== null && (Dp(a, o), t0(a)), Yu()
  }
}
function F0(t) {
  return t.type !== 2
}
function hy(t, e) {
  for (let n = Kg(t); n !== null; n = Qg(n))
    for (let r = Ue; r < n.length; r++) {
      let i = n[r]
      fy(i, e)
    }
}
function L0(t) {
  for (let e = Kg(t); e !== null; e = Qg(e)) {
    if (!(e[b] & zu.HasTransplantedViews)) continue
    let n = e[so]
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        s = i[ze]
      pT(i)
    }
  }
}
function V0(t, e, n) {
  let r = Zt(e, t)
  fy(r, n)
}
function fy(t, e) {
  Ku(t) && Eu(t, e)
}
function Eu(t, e) {
  let r = t[P],
    i = t[b],
    s = t[wn],
    o = !!(e === 0 && i & 16)
  if (
    ((o ||= !!(i & 64 && e === 0)),
    (o ||= !!(i & 1024)),
    (o ||= !!(s?.dirty && Ec(s))),
    s && (s.dirty = !1),
    (t[b] &= -9217),
    o)
  )
    O0(r, t, r.template, t[De])
  else if (i & 8192) {
    hy(t, 1)
    let a = r.components
    a !== null && py(t, a, 1)
  }
}
function py(t, e, n) {
  for (let r = 0; r < e.length; r++) V0(t, e[r], n)
}
function wl(t) {
  for (t[It].changeDetectionScheduler?.notify(); t; ) {
    t[b] |= 64
    let e = pi(t)
    if (oT(t) && !e) return t
    t = e
  }
  return null
}
var _i = class {
    get rootNodes() {
      let e = this._lView,
        n = e[P]
      return po(n, e, n.firstChild, [])
    }
    constructor(e, n, r = !0) {
      ;(this._lView = e),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1)
    }
    get context() {
      return this._lView[De]
    }
    set context(e) {
      this._lView[De] = e
    }
    get destroyed() {
      return (this._lView[b] & 256) === 256
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this)
      else if (this._attachedToViewContainer) {
        let e = this._lView[ze]
        if (xn(e)) {
          let n = e[sT],
            r = n ? n.indexOf(this) : -1
          r > -1 && (ul(e, r), bg(n, r))
        }
        this._attachedToViewContainer = !1
      }
      ll(this._lView[P], this._lView)
    }
    onDestroy(e) {
      gT(this._lView, e)
    }
    markForCheck() {
      wl(this._cdRefInjectingView || this._lView)
    }
    detach() {
      this._lView[b] &= -129
    }
    reattach() {
      su(this._lView), (this._lView[b] |= 128)
    }
    detectChanges() {
      ;(this._lView[b] |= 1024), P0(this._lView, this.notifyErrorHandler)
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new $(902, !1)
      this._attachedToViewContainer = !0
    }
    detachFromAppRef() {
      ;(this._appRef = null), Lg(this._lView[P], this._lView)
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new $(902, !1)
      ;(this._appRef = e), su(this._lView)
    }
  },
  my = (() => {
    let e = class e {}
    e.__NG_ELEMENT_ID__ = U0
    let t = e
    return t
  })()
function U0(t) {
  return j0(Ut(), Z(), (t & 16) === 16)
}
function j0(t, e, n) {
  if (Do(t) && !n) {
    let r = Zt(t.index, e)
    return new _i(r, r)
  } else if (t.type & 47) {
    let r = e[lt]
    return new _i(r, e)
  }
  return null
}
var _m = new Set()
function ko(t) {
  _m.has(t) ||
    (_m.add(t),
    performance?.mark?.('mark_feature_usage', { detail: { feature: t } }))
}
var Tu = class extends sr {
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
    this.__isAsync && ((s = Kc(s)), i && (i = Kc(i)), o && (o = Kc(o)))
    let a = super.subscribe({ next: i, error: s, complete: o })
    return e instanceof Te && e.add(a), a
  }
}
function Kc(t) {
  return (e) => {
    setTimeout(t, void 0, e)
  }
}
var qe = Tu
function Im(...t) {}
function B0() {
  let t = typeof ri.requestAnimationFrame == 'function',
    e = ri[t ? 'requestAnimationFrame' : 'setTimeout'],
    n = ri[t ? 'cancelAnimationFrame' : 'clearTimeout']
  if (typeof Zone < 'u' && e && n) {
    let r = e[Zone.__symbol__('OriginalDelegate')]
    r && (e = r)
    let i = n[Zone.__symbol__('OriginalDelegate')]
    i && (n = i)
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n }
}
var ee = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new qe(!1)),
        (this.onMicrotaskEmpty = new qe(!1)),
        (this.onStable = new qe(!1)),
        (this.onError = new qe(!1)),
        typeof Zone > 'u')
      )
        throw new $(908, !1)
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
        (i.nativeRequestAnimationFrame = B0().nativeRequestAnimationFrame),
        q0(i)
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get('isAngularZone') === !0
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new $(909, !1)
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new $(909, !1)
    }
    run(e, n, r) {
      return this._inner.run(e, n, r)
    }
    runTask(e, n, r, i) {
      let s = this._inner,
        o = s.scheduleEventTask('NgZoneEvent: ' + i, e, $0, Im, Im)
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
  $0 = {}
function El(t) {
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
function H0(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      ri,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            'fakeTopEventTask',
            () => {
              ;(t.lastRequestAnimationFrameId = -1),
                Du(t),
                (t.isCheckStableRunning = !0),
                El(t),
                (t.isCheckStableRunning = !1)
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke()
      }
    )),
    Du(t))
}
function q0(t) {
  let e = () => {
    H0(t)
  }
  t._inner = t._inner.fork({
    name: 'angular',
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, s, o, a) => {
      if (z0(a)) return n.invokeTask(i, s, o, a)
      try {
        return wm(t), n.invokeTask(i, s, o, a)
      } finally {
        ;((t.shouldCoalesceEventChangeDetection && s.type === 'eventTask') ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          Em(t)
      }
    },
    onInvoke: (n, r, i, s, o, a, c) => {
      try {
        return wm(t), n.invoke(i, s, o, a, c)
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), Em(t)
      }
    },
    onHasTask: (n, r, i, s) => {
      n.hasTask(i, s),
        r === i &&
          (s.change == 'microTask'
            ? ((t._hasPendingMicrotasks = s.microTask), Du(t), El(t))
            : s.change == 'macroTask' && (t.hasPendingMacrotasks = s.macroTask))
    },
    onHandleError: (n, r, i, s) => (
      n.handleError(i, s), t.runOutsideAngular(() => t.onError.emit(s)), !1
    ),
  })
}
function Du(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1)
}
function wm(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null))
}
function Em(t) {
  t._nesting--, El(t)
}
function z0(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0
}
var gy = (() => {
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
  e.ɵprov = X({ token: e, providedIn: 'root', factory: () => new e() })
  let t = e
  return t
})()
function G0(t, e) {
  let n = Zt(e, t),
    r = n[P]
  W0(r, n)
  let i = n[Lt]
  i !== null && n[ci] === null && (n[ci] = pl(i, n[mr])), Tl(r, n, n[De])
}
function W0(t, e) {
  for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n])
}
function Tl(t, e, n) {
  Qu(e)
  try {
    let r = t.viewQuery
    r !== null && wu(1, r, n)
    let i = t.template
    i !== null && ny(t, e, i, 1, n),
      t.firstCreatePass && (t.firstCreatePass = !1),
      t.staticContentQueries && ly(t, e),
      t.staticViewQueries && wu(2, t.viewQuery, n)
    let s = t.components
    s !== null && K0(e, s)
  } catch (r) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      r)
    )
  } finally {
    ;(e[b] &= -5), Yu()
  }
}
function K0(t, e) {
  for (let n = 0; n < e.length; n++) G0(t, e[n])
}
function Cu(t, e, n) {
  let r = n ? t.styles : null,
    i = n ? t.classes : null,
    s = 0
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let a = e[o]
      if (typeof a == 'number') s = a
      else if (s == 1) i = Xc(i, a)
      else if (s == 2) {
        let c = a,
          u = e[++o]
        r = Xc(r, c + ': ' + u + ';')
      }
    }
  n ? (t.styles = r) : (t.stylesWithoutHost = r),
    n ? (t.classes = i) : (t.classesWithoutHost = i)
}
var bu = class extends ml {
  constructor(e) {
    super(), (this.ngModule = e)
  }
  resolveComponentFactory(e) {
    let n = wo(e)
    return new Su(n, this.ngModule)
  }
}
function Tm(t) {
  let e = []
  for (let n in t) {
    if (!t.hasOwnProperty(n)) continue
    let r = t[n]
    r !== void 0 &&
      e.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n })
  }
  return e
}
function Q0(t) {
  let e = t.toLowerCase()
  return e === 'svg' ? eg : e === 'math' ? lT : null
}
var Au = class {
    constructor(e, n) {
      ;(this.injector = e), (this.parentInjector = n)
    }
    get(e, n, r) {
      r = _o(r)
      let i = this.injector.get(e, Gc, r)
      return i !== Gc || n === Gc ? i : this.parentInjector.get(e, n, r)
    }
  },
  Su = class extends fo {
    get inputs() {
      let e = this.componentDef,
        n = e.inputTransforms,
        r = Tm(e.inputs)
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName])
      return r
    }
    get outputs() {
      return Tm(this.componentDef.outputs)
    }
    constructor(e, n) {
      super(),
        (this.componentDef = e),
        (this.ngModule = n),
        (this.componentType = e.type),
        (this.selector = XE(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n)
    }
    create(e, n, r, i) {
      i = i || this.ngModule
      let s = i instanceof Tn ? i : i?.injector
      s &&
        this.componentDef.getStandaloneInjector !== null &&
        (s = this.componentDef.getStandaloneInjector(s) || s)
      let o = s ? new Au(e, s) : e,
        a = o.get(vi, null)
      if (a === null) throw new $(407, !1)
      let c = o.get(JD, null),
        u = o.get(gy, null),
        l = o.get(yu, null),
        d = {
          rendererFactory: a,
          sanitizer: c,
          inlineEffectRunner: null,
          afterRenderEventManager: u,
          changeDetectionScheduler: l,
        },
        h = a.createRenderer(null, this.componentDef),
        f = this.componentDef.selectors[0][0] || 'div',
        g = r ? c0(h, r, this.componentDef.encapsulation, o) : Fg(h, f, Q0(f)),
        I = 512
      this.componentDef.signals
        ? (I |= 4096)
        : this.componentDef.onPush || (I |= 16)
      let w = null
      g !== null && (w = pl(g, o, !0))
      let D = vl(0, null, null, 1, 0, null, null, null, null, null, null),
        j = Mo(null, D, null, I, null, null, d, h, o, null, w)
      Qu(j)
      let K, z
      try {
        let re = this.componentDef,
          G,
          Be = null
        re.findHostDirectiveDefs
          ? ((G = []),
            (Be = new Map()),
            re.findHostDirectiveDefs(re, G, Be),
            G.push(re))
          : (G = [re])
        let Gt = Y0(j, g),
          mn = J0(Gt, g, re, G, j, d, h)
        ;(z = Wu(D, Ge)),
          g && eC(h, re, g, r),
          n !== void 0 && tC(z, this.ngContentSelectors, n),
          (K = X0(mn, re, G, Be, j, [nC])),
          Tl(D, j, null)
      } finally {
        Yu()
      }
      return new xu(this.componentType, K, Gg(z, j), j, z)
    }
  },
  xu = class extends vu {
    constructor(e, n, r, i, s) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = s),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new _i(i, void 0, !1)),
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
        Il(s[P], s, i, e, n), this.previousInputValues.set(e, n)
        let o = Zt(this._tNode.index, s)
        wl(o)
      }
    }
    get injector() {
      return new co(this._tNode, this._rootLView)
    }
    destroy() {
      this.hostView.destroy()
    }
    onDestroy(e) {
      this.hostView.onDestroy(e)
    }
  }
function Y0(t, e) {
  let n = t[P],
    r = Ge
  return (t[r] = e), Po(n, r, 2, '#host', null)
}
function J0(t, e, n, r, i, s, o) {
  let a = i[P]
  Z0(r, t, e, o)
  let c = null
  e !== null && (c = pl(e, i[mr]))
  let u = s.rendererFactory.createRenderer(e, n),
    l = 16
  n.signals ? (l = 4096) : n.onPush && (l = 64)
  let d = Mo(i, oy(n), null, l, i[t.index], t, s, u, null, null, c)
  return a.firstCreatePass && Iu(a, t, r.length - 1), _l(i, d), (i[t.index] = d)
}
function Z0(t, e, n, r) {
  for (let i of t) e.mergedAttrs = qu(e.mergedAttrs, i.hostAttrs)
  e.mergedAttrs !== null &&
    (Cu(e, e.mergedAttrs, !0), n !== null && Hg(r, n, e))
}
function X0(t, e, n, r, i, s) {
  let o = Ut(),
    a = i[P],
    c = Et(o, i)
  cy(a, i, o, n, null, r)
  for (let l = 0; l < n.length; l++) {
    let d = o.directiveStart + l,
      h = gi(i, a, d, o)
    Dn(h, i)
  }
  uy(a, i, o), c && Dn(c, i)
  let u = gi(i, a, o.directiveStart + o.componentOffset, o)
  if (((t[De] = i[De] = u), s !== null)) for (let l of s) l(u, e)
  return ry(a, o, t), u
}
function eC(t, e, n, r) {
  if (r) ru(t, n, ['ng-version', '17.1.0'])
  else {
    let { attrs: i, classes: s } = eT(e.selectors[0])
    i && ru(t, n, i), s && s.length > 0 && $g(t, n, s.join(' '))
  }
}
function tC(t, e, n) {
  let r = (t.projection = [])
  for (let i = 0; i < e.length; i++) {
    let s = n[i]
    r.push(s != null ? Array.from(s) : null)
  }
}
function nC() {
  let t = Ut()
  el(Z()[P], t)
}
var BO = new RegExp(`^(\\d+)*(${zD}|${qD})*(.*)`)
var rC = () => null
function Dl(t, e) {
  return rC(t, e)
}
function Cl(t, e, n, r) {
  let i = e.tView,
    o = t[b] & 4096 ? 4096 : 16,
    a = Mo(
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
  a[Eo] = c
  let u = t[di]
  return u !== null && (a[di] = u.createEmbeddedView(i)), Tl(i, a, n), a
}
function yy(t, e) {
  let n = Ue + e
  if (n < t.length) return t[n]
}
function bl(t, e) {
  return !e || e.firstChild === null || kg(t)
}
function Al(t, e, n, r = !0) {
  let i = e[P]
  if ((bD(i, e, t, n), r)) {
    let o = gu(n, t),
      a = e[Me],
      c = jg(a, t[hi])
    c !== null && DD(i, t[wt], a, e, c, o)
  }
  let s = e[ci]
  s !== null && s.firstChild !== null && (s.firstChild = null)
}
function vy(t, e) {
  let n = ul(t, e)
  return n !== void 0 && ll(n[P], n), n
}
var iC = () => !1
function sC(t, e, n) {
  return iC(t, e, n)
}
function _y(t, e, n) {
  return (t[e] = n)
}
function Jt(t, e, n) {
  let r = t[e]
  return Object.is(r, n) ? !1 : ((t[e] = n), !0)
}
function oC(t, e, n, r) {
  let i = Jt(t, e, n)
  return Jt(t, e + 1, r) || i
}
function aC(t, e, n, r, i, s, o, a, c) {
  let u = e.consts,
    l = Po(e, t, 4, o || null, oo(u, a))
  ay(e, n, l, oo(u, c)), el(e, l)
  let d = (l.tView = vl(
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
function je(t, e, n, r, i, s, o, a) {
  let c = Z(),
    u = Vt(),
    l = t + Ge,
    d = u.firstCreatePass ? aC(l, u, c, e, n, r, i, s, o) : u.data[l]
  Ei(d, !1)
  let h = cC(u, c, d, t)
  Zu() && dl(u, c, h, d), Dn(h, c)
  let f = S0(h, c, h, d)
  return (
    (c[l] = f),
    _l(c, f),
    sC(f, d, c),
    Gu(d) && iy(u, c, d),
    o != null && sy(c, d, a),
    je
  )
}
var cC = uC
function uC(t, e, n, r) {
  return Xu(!0), e[Me].createComment('')
}
function lC(t, e, n, r) {
  return Jt(t, Co(), n) ? e + Bu(n) + r : tn
}
function Zs(t, e) {
  return (t << 17) | (e << 2)
}
function Cn(t) {
  return (t >> 17) & 32767
}
function dC(t) {
  return (t & 2) == 2
}
function hC(t, e) {
  return (t & 131071) | (e << 17)
}
function Nu(t) {
  return t | 2
}
function yr(t) {
  return (t & 131068) >> 2
}
function Qc(t, e) {
  return (t & -131069) | (e << 2)
}
function fC(t) {
  return (t & 1) === 1
}
function Ru(t) {
  return t | 1
}
function pC(t, e, n, r, i, s) {
  let o = s ? e.classBindings : e.styleBindings,
    a = Cn(o),
    c = yr(o)
  t[r] = n
  let u = !1,
    l
  if (Array.isArray(n)) {
    let d = n
    ;(l = d[1]), (l === null || Di(d, l) > 0) && (u = !0)
  } else l = n
  if (i)
    if (c !== 0) {
      let h = Cn(t[a + 1])
      ;(t[r + 1] = Zs(h, a)),
        h !== 0 && (t[h + 1] = Qc(t[h + 1], r)),
        (t[a + 1] = hC(t[a + 1], r))
    } else
      (t[r + 1] = Zs(a, 0)), a !== 0 && (t[a + 1] = Qc(t[a + 1], r)), (a = r)
  else
    (t[r + 1] = Zs(c, 0)),
      a === 0 ? (a = r) : (t[c + 1] = Qc(t[c + 1], r)),
      (c = r)
  u && (t[r + 1] = Nu(t[r + 1])),
    Dm(t, l, r, !0),
    Dm(t, l, r, !1),
    mC(e, l, t, r, s),
    (o = Zs(a, c)),
    s ? (e.classBindings = o) : (e.styleBindings = o)
}
function mC(t, e, n, r, i) {
  let s = i ? t.residualClasses : t.residualStyles
  s != null &&
    typeof e == 'string' &&
    Di(s, e) >= 0 &&
    (n[r + 1] = Ru(n[r + 1]))
}
function Dm(t, e, n, r) {
  let i = t[n + 1],
    s = e === null,
    o = r ? Cn(i) : yr(i),
    a = !1
  for (; o !== 0 && (a === !1 || s); ) {
    let c = t[o],
      u = t[o + 1]
    gC(c, e) && ((a = !0), (t[o + 1] = r ? Ru(u) : Nu(u))),
      (o = r ? Cn(u) : yr(u))
  }
  a && (t[n + 1] = r ? Nu(i) : Ru(i))
}
function gC(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == 'string'
      ? Di(t, e) >= 0
      : !1
}
var ot = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 }
function yC(t) {
  return t.substring(ot.key, ot.keyEnd)
}
function vC(t) {
  return _C(t), Iy(t, wy(t, 0, ot.textEnd))
}
function Iy(t, e) {
  let n = ot.textEnd
  return n === e ? -1 : ((e = ot.keyEnd = IC(t, (ot.key = e), n)), wy(t, e, n))
}
function _C(t) {
  ;(ot.key = 0),
    (ot.keyEnd = 0),
    (ot.value = 0),
    (ot.valueEnd = 0),
    (ot.textEnd = t.length)
}
function wy(t, e, n) {
  for (; e < n && t.charCodeAt(e) <= 32; ) e++
  return e
}
function IC(t, e, n) {
  for (; e < n && t.charCodeAt(e) > 32; ) e++
  return e
}
function We(t, e, n) {
  let r = Z(),
    i = Co()
  if (Jt(r, i, e)) {
    let s = Vt(),
      o = PT()
    p0(s, o, r, t, e, r[Me], n, !1)
  }
  return We
}
function Mu(t, e, n, r, i) {
  let s = e.inputs,
    o = i ? 'class' : 'style'
  Il(t, n, s[o], o, r)
}
function Ey(t) {
  EC(xC, wC, t, !0)
}
function wC(t, e) {
  for (let n = vC(e); n >= 0; n = Iy(e, n)) nl(t, yC(e), !0)
}
function EC(t, e, n, r) {
  let i = Vt(),
    s = bT(2)
  i.firstUpdatePass && TC(i, null, s, r)
  let o = Z()
  if (n !== tn && Jt(o, s, n)) {
    let a = i.data[Nn()]
    if (Dy(a, r) && !Ty(i, s)) {
      let c = r ? a.classesWithoutHost : a.stylesWithoutHost
      c !== null && (n = Xc(c, n || '')), Mu(i, a, o, n, r)
    } else NC(i, a, o, o[Me], o[s + 1], (o[s + 1] = SC(t, e, n)), r, s)
  }
}
function Ty(t, e) {
  return e >= t.expandoStartIndex
}
function TC(t, e, n, r) {
  let i = t.data
  if (i[n + 1] === null) {
    let s = i[Nn()],
      o = Ty(t, n)
    Dy(s, r) && e === null && !o && (e = !1),
      (e = DC(i, s, e, r)),
      pC(i, s, e, n, o, r)
  }
}
function DC(t, e, n, r) {
  let i = NT(t),
    s = r ? e.residualClasses : e.residualStyles
  if (i === null)
    (r ? e.classBindings : e.styleBindings) === 0 &&
      ((n = Yc(null, t, e, n, r)), (n = Ii(n, e.attrs, r)), (s = null))
  else {
    let o = e.directiveStylingLast
    if (o === -1 || t[o] !== i)
      if (((n = Yc(i, t, e, n, r)), s === null)) {
        let c = CC(t, e, r)
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = Yc(null, t, e, c[1], r)),
          (c = Ii(c, e.attrs, r)),
          bC(t, e, r, c))
      } else s = AC(t, e, r)
  }
  return (
    s !== void 0 && (r ? (e.residualClasses = s) : (e.residualStyles = s)), n
  )
}
function CC(t, e, n) {
  let r = n ? e.classBindings : e.styleBindings
  if (yr(r) !== 0) return t[Cn(r)]
}
function bC(t, e, n, r) {
  let i = n ? e.classBindings : e.styleBindings
  t[Cn(i)] = r
}
function AC(t, e, n) {
  let r,
    i = e.directiveEnd
  for (let s = 1 + e.directiveStylingLast; s < i; s++) {
    let o = t[s].hostAttrs
    r = Ii(r, o, n)
  }
  return Ii(r, e.attrs, n)
}
function Yc(t, e, n, r, i) {
  let s = null,
    o = n.directiveEnd,
    a = n.directiveStylingLast
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < o && ((s = e[a]), (r = Ii(r, s.hostAttrs, i)), s !== t);

  )
    a++
  return t !== null && (n.directiveStylingLast = a), r
}
function Ii(t, e, n) {
  let r = n ? 1 : 2,
    i = -1
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let o = e[s]
      typeof o == 'number'
        ? (i = o)
        : i === r &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ['', t]),
          nl(t, o, n ? !0 : e[++s]))
    }
  return t === void 0 ? null : t
}
function SC(t, e, n) {
  if (n == null || n === '') return He
  let r = [],
    i = xo(n)
  if (Array.isArray(i)) for (let s = 0; s < i.length; s++) t(r, i[s], !0)
  else if (typeof i == 'object')
    for (let s in i) i.hasOwnProperty(s) && t(r, s, i[s])
  else typeof i == 'string' && e(r, i)
  return r
}
function xC(t, e, n) {
  let r = String(e)
  r !== '' && !r.includes(' ') && nl(t, r, n)
}
function NC(t, e, n, r, i, s, o, a) {
  i === tn && (i = He)
  let c = 0,
    u = 0,
    l = 0 < i.length ? i[0] : null,
    d = 0 < s.length ? s[0] : null
  for (; l !== null || d !== null; ) {
    let h = c < i.length ? i[c + 1] : void 0,
      f = u < s.length ? s[u + 1] : void 0,
      g = null,
      I
    l === d
      ? ((c += 2), (u += 2), h !== f && ((g = d), (I = f)))
      : d === null || (l !== null && l < d)
        ? ((c += 2), (g = l))
        : ((u += 2), (g = d), (I = f)),
      g !== null && RC(t, e, n, r, g, I, o, a),
      (l = c < i.length ? i[c] : null),
      (d = u < s.length ? s[u] : null)
  }
}
function RC(t, e, n, r, i, s, o, a) {
  if (!(e.type & 3)) return
  let c = t.data,
    u = c[a + 1],
    l = fC(u) ? Cm(c, e, n, i, yr(u), o) : void 0
  if (!mo(l)) {
    mo(s) || (dC(u) && (s = Cm(c, null, n, i, a, o)))
    let d = tg(Nn(), n)
    UD(r, o, d, i, s)
  }
}
function Cm(t, e, n, r, i, s) {
  let o = e === null,
    a
  for (; i > 0; ) {
    let c = t[i],
      u = Array.isArray(c),
      l = u ? c[1] : c,
      d = l === null,
      h = n[i + 1]
    h === tn && (h = d ? He : void 0)
    let f = d ? Hc(h, r) : l === r ? h : void 0
    if ((u && !mo(f) && (f = Hc(c, r)), mo(f) && ((a = f), o))) return a
    let g = t[i + 1]
    i = o ? Cn(g) : yr(g)
  }
  if (e !== null) {
    let c = s ? e.residualClasses : e.residualStyles
    c != null && (a = Hc(c, r))
  }
  return a
}
function mo(t) {
  return t !== void 0
}
function Dy(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0
}
var Pu = class {
  destroy(e) {}
  updateValue(e, n) {}
  swap(e, n) {
    let r = Math.min(e, n),
      i = Math.max(e, n),
      s = this.detach(i)
    if (i - r > 1) {
      let o = this.detach(r)
      this.attach(r, s), this.attach(i, o)
    } else this.attach(r, s)
  }
  move(e, n) {
    this.attach(n, this.detach(e))
  }
}
function Jc(t, e, n, r, i) {
  return t === n && Object.is(e, r) ? 1 : Object.is(i(t, e), i(n, r)) ? -1 : 0
}
function MC(t, e, n) {
  let r,
    i,
    s = 0,
    o = t.length - 1
  if (Array.isArray(e)) {
    let a = e.length - 1
    for (; s <= o && s <= a; ) {
      let c = t.at(s),
        u = e[s],
        l = Jc(s, c, s, u, n)
      if (l !== 0) {
        l < 0 && t.updateValue(s, u), s++
        continue
      }
      let d = t.at(o),
        h = e[a],
        f = Jc(o, d, a, h, n)
      if (f !== 0) {
        f < 0 && t.updateValue(o, h), o--, a--
        continue
      }
      let g = n(s, c),
        I = n(o, d),
        w = n(s, u)
      if (Object.is(w, I)) {
        let D = n(a, h)
        Object.is(D, g)
          ? (t.swap(s, o), t.updateValue(o, h), a--, o--)
          : t.move(o, s),
          t.updateValue(s, u),
          s++
        continue
      }
      if (((r ??= new go()), (i ??= Am(t, s, o, n)), ku(t, r, s, w)))
        t.updateValue(s, u), s++, o++
      else if (i.has(w)) r.set(g, t.detach(s)), o--
      else {
        let D = t.create(s, e[s])
        t.attach(s, D), s++, o++
      }
    }
    for (; s <= a; ) bm(t, r, n, s, e[s]), s++
  } else if (e != null) {
    let a = e[Symbol.iterator](),
      c = a.next()
    for (; !c.done && s <= o; ) {
      let u = t.at(s),
        l = c.value,
        d = Jc(s, u, s, l, n)
      if (d !== 0) d < 0 && t.updateValue(s, l), s++, (c = a.next())
      else {
        ;(r ??= new go()), (i ??= Am(t, s, o, n))
        let h = n(s, l)
        if (ku(t, r, s, h)) t.updateValue(s, l), s++, o++, (c = a.next())
        else if (!i.has(h))
          t.attach(s, t.create(s, l)), s++, o++, (c = a.next())
        else {
          let f = n(s, u)
          r.set(f, t.detach(s)), o--
        }
      }
    }
    for (; !c.done; ) bm(t, r, n, t.length, c.value), (c = a.next())
  }
  for (; s <= o; ) t.destroy(t.detach(o--))
  r?.forEach((a) => {
    t.destroy(a)
  })
}
function ku(t, e, n, r) {
  return e !== void 0 && e.has(r)
    ? (t.attach(n, e.get(r)), e.delete(r), !0)
    : !1
}
function bm(t, e, n, r, i) {
  if (ku(t, e, r, n(r, i))) t.updateValue(r, i)
  else {
    let s = t.create(r, i)
    t.attach(r, s)
  }
}
function Am(t, e, n, r) {
  let i = new Set()
  for (let s = e; s <= n; s++) i.add(r(s, t.at(s)))
  return i
}
var go = class {
  constructor() {
    ;(this.kvMap = new Map()), (this._vMap = void 0)
  }
  has(e) {
    return this.kvMap.has(e)
  }
  delete(e) {
    if (!this.has(e)) return !1
    let n = this.kvMap.get(e)
    return (
      this._vMap !== void 0 && this._vMap.has(n)
        ? (this.kvMap.set(e, this._vMap.get(n)), this._vMap.delete(n))
        : this.kvMap.delete(e),
      !0
    )
  }
  get(e) {
    return this.kvMap.get(e)
  }
  set(e, n) {
    if (this.kvMap.has(e)) {
      let r = this.kvMap.get(e)
      this._vMap === void 0 && (this._vMap = new Map())
      let i = this._vMap
      for (; i.has(r); ) r = i.get(r)
      i.set(r, n)
    } else this.kvMap.set(e, n)
  }
  forEach(e) {
    for (let [n, r] of this.kvMap)
      if ((e(r, n), this._vMap !== void 0)) {
        let i = this._vMap
        for (; i.has(r); ) (r = i.get(r)), e(r, n)
      }
  }
}
function dt(t, e, n) {
  ko('NgControlFlow')
  let r = Z(),
    i = Co(),
    s = Vu(r, Ge + t),
    o = 0
  if (Jt(r, i, e)) {
    let a = pe(null)
    try {
      if ((vy(s, o), e !== -1)) {
        let c = Uu(r[P], Ge + e),
          u = Dl(s, c.tView.ssrId),
          l = Cl(r, c, n, { dehydratedView: u })
        Al(s, l, o, bl(c, u))
      }
    } finally {
      pe(a)
    }
  } else {
    let a = yy(s, o)
    a !== void 0 && (a[De] = n)
  }
}
var Ou = class {
  constructor(e, n, r) {
    ;(this.lContainer = e), (this.$implicit = n), (this.$index = r)
  }
  get $count() {
    return this.lContainer.length - Ue
  }
}
function Cy(t, e) {
  return e
}
var Fu = class {
  constructor(e, n, r) {
    ;(this.hasEmptyBlock = e), (this.trackByFn = n), (this.liveCollection = r)
  }
}
function Oo(t, e, n, r, i, s, o, a, c, u, l, d, h) {
  ko('NgControlFlow')
  let f = c !== void 0,
    g = Z(),
    I = a ? o.bind(g[lt][De]) : o,
    w = new Fu(f, I)
  ;(g[Ge + t] = w), je(t + 1, e, n, r, i, s), f && je(t + 2, c, u, l, d, h)
}
var Lu = class extends Pu {
  constructor(e, n, r) {
    super(),
      (this.lContainer = e),
      (this.hostLView = n),
      (this.templateTNode = r),
      (this.needsIndexUpdate = !1)
  }
  get length() {
    return this.lContainer.length - Ue
  }
  at(e) {
    return this.getLView(e)[De].$implicit
  }
  attach(e, n) {
    let r = n[ci]
    ;(this.needsIndexUpdate ||= e !== this.length),
      Al(this.lContainer, n, e, bl(this.templateTNode, r))
  }
  detach(e) {
    return (
      (this.needsIndexUpdate ||= e !== this.length - 1), PC(this.lContainer, e)
    )
  }
  create(e, n) {
    let r = Dl(this.lContainer, this.templateTNode.tView.ssrId)
    return Cl(
      this.hostLView,
      this.templateTNode,
      new Ou(this.lContainer, n, e),
      { dehydratedView: r }
    )
  }
  destroy(e) {
    ll(e[P], e)
  }
  updateValue(e, n) {
    this.getLView(e)[De].$implicit = n
  }
  reset() {
    this.needsIndexUpdate = !1
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let e = 0; e < this.length; e++) this.getLView(e)[De].$index = e
  }
  getLView(e) {
    return kC(this.lContainer, e)
  }
}
function Fo(t) {
  let e = pe(null),
    n = Nn()
  try {
    let r = Z(),
      i = r[P],
      s = r[n]
    if (s.liveCollection === void 0) {
      let a = n + 1,
        c = Vu(r, a),
        u = Uu(i, a)
      s.liveCollection = new Lu(c, r, u)
    } else s.liveCollection.reset()
    let o = s.liveCollection
    if ((MC(o, t, s.trackByFn), o.updateIndexes(), s.hasEmptyBlock)) {
      let a = Co(),
        c = o.length === 0
      if (Jt(r, a, c)) {
        let u = n + 2,
          l = Vu(r, u)
        if (c) {
          let d = Uu(i, u),
            h = Dl(l, d.tView.ssrId),
            f = Cl(r, d, void 0, { dehydratedView: h })
          Al(l, f, 0, bl(d, h))
        } else vy(l, 0)
      }
    }
  } finally {
    pe(e)
  }
}
function Vu(t, e) {
  return t[e]
}
function PC(t, e) {
  return ul(t, e)
}
function kC(t, e) {
  return yy(t, e)
}
function Uu(t, e) {
  return Wu(t, e)
}
function OC(t, e, n, r, i, s) {
  let o = e.consts,
    a = oo(o, i),
    c = Po(e, t, 2, r, a)
  return (
    ay(e, n, c, oo(o, s)),
    c.attrs !== null && Cu(c, c.attrs, !1),
    c.mergedAttrs !== null && Cu(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  )
}
function x(t, e, n, r) {
  let i = Z(),
    s = Vt(),
    o = Ge + t,
    a = i[Me],
    c = s.firstCreatePass ? OC(o, s, i, e, n, r) : s.data[o],
    u = FC(s, i, c, a, e, t)
  i[o] = u
  let l = Gu(c)
  return (
    Ei(c, !0),
    Hg(a, u, c),
    (c.flags & 32) !== 32 && Zu() && dl(s, i, u, c),
    yT() === 0 && Dn(u, i),
    vT(),
    l && (iy(s, i, c), ry(s, c, i)),
    r !== null && sy(i, c),
    x
  )
}
function M() {
  let t = Ut()
  og() ? DT() : ((t = t.parent), Ei(t, !1))
  let e = t
  wT(e) && ET(), _T()
  let n = Vt()
  return (
    n.firstCreatePass && (el(n, t), Km(t) && n.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      UT(e) &&
      Mu(n, e, Z(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      jT(e) &&
      Mu(n, e, Z(), e.stylesWithoutHost, !1),
    M
  )
}
function ae(t, e, n, r) {
  return x(t, e, n, r), M(), ae
}
var FC = (t, e, n, r, i, s) => (Xu(!0), Fg(r, i, OT()))
function Xe() {
  return Z()
}
var yo = 'en-US'
var LC = yo
function VC(t) {
  xE(t, 'Expected localeId to be defined'),
    typeof t == 'string' && (LC = t.toLowerCase().replace(/_/g, '-'))
}
function Lo(t) {
  return !!t && typeof t.then == 'function'
}
function Sl(t) {
  return !!t && typeof t.subscribe == 'function'
}
function ce(t, e, n, r) {
  let i = Z(),
    s = Vt(),
    o = Ut()
  return jC(s, i, i[Me], o, t, e, r), ce
}
function UC(t, e, n, r) {
  let i = t.cleanup
  if (i != null)
    for (let s = 0; s < i.length - 1; s += 2) {
      let o = i[s]
      if (o === n && i[s + 1] === r) {
        let a = e[ui],
          c = i[s + 2]
        return a.length > c ? a[c] : null
      }
      typeof o == 'string' && (s += 2)
    }
  return null
}
function jC(t, e, n, r, i, s, o) {
  let a = Gu(r),
    u = t.firstCreatePass && N0(t),
    l = e[De],
    d = x0(e),
    h = !0
  if (r.type & 3 || o) {
    let I = Et(r, e),
      w = o ? o(I) : I,
      D = d.length,
      j = o ? (z) => o(kt(z[r.index])) : r.index,
      K = null
    if ((!o && a && (K = UC(t, e, i, r.index)), K !== null)) {
      let z = K.__ngLastListenerFn__ || K
      ;(z.__ngNextListenerFn__ = s), (K.__ngLastListenerFn__ = s), (h = !1)
    } else {
      s = xm(r, e, l, s, !1)
      let z = n.listen(w, i, s)
      d.push(s, z), u && u.push(i, j, D, D + 1)
    }
  } else s = xm(r, e, l, s, !1)
  let f = r.outputs,
    g
  if (h && f !== null && (g = f[i])) {
    let I = g.length
    if (I)
      for (let w = 0; w < I; w += 2) {
        let D = g[w],
          j = g[w + 1],
          re = e[D][j].subscribe(s),
          G = d.length
        d.push(s, re), u && u.push(i, r.index, G, -(G + 1))
      }
  }
}
function Sm(t, e, n, r) {
  try {
    return yt(6, e, n), n(r) !== !1
  } catch (i) {
    return dy(t, i), !1
  } finally {
    yt(7, e, n)
  }
}
function xm(t, e, n, r, i) {
  return function s(o) {
    if (o === Function) return r
    let a = t.componentOffset > -1 ? Zt(t.index, e) : e
    wl(a)
    let c = Sm(e, n, r, o),
      u = s.__ngNextListenerFn__
    for (; u; ) (c = Sm(e, n, u, o) && c), (u = u.__ngNextListenerFn__)
    return i && c === !1 && o.preventDefault(), c
  }
}
function Ie(t = 1) {
  return MT(t)
}
function BC(t, e, n, r) {
  n >= t.data.length && ((t.data[n] = null), (t.blueprint[n] = null)),
    (e[n] = r)
}
function ke(t, e = '') {
  let n = Z(),
    r = Vt(),
    i = t + Ge,
    s = r.firstCreatePass ? Po(r, i, 1, e, null) : r.data[i],
    o = $C(r, n, s, e, t)
  ;(n[i] = o), Zu() && dl(r, n, o, s), Ei(s, !1)
}
var $C = (t, e, n, r, i) => (Xu(!0), wD(e[Me], r))
function xl(t, e, n) {
  let r = Z(),
    i = lC(r, t, e, n)
  return i !== tn && R0(r, Nn(), i), xl
}
var vr = class {}
var vo = class extends vr {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new bu(this)),
      (this.instance = null)
    let n = new lo(
      [
        ...e.providers,
        { provide: vr, useValue: this },
        { provide: ml, useValue: this.componentFactoryResolver },
      ],
      e.parent || il(),
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
function HC(t, e, n = null) {
  return new vo({
    providers: t,
    parent: e,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector
}
var qC = (() => {
  let e = class e {
    constructor(r) {
      ;(this._injector = r), (this.cachedInjectors = new Map())
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null
      if (!this.cachedInjectors.has(r)) {
        let i = Ng(!1, r.type),
          s =
            i.length > 0
              ? HC([i], this._injector, `Standalone[${r.type.name}]`)
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
  e.ɵprov = X({
    token: e,
    providedIn: 'environment',
    factory: () => new e(V(Tn)),
  })
  let t = e
  return t
})()
function ue(t) {
  ko('NgStandalone'),
    (t.getStandaloneInjector = (e) =>
      e.get(qC).getOrCreateStandaloneInjector(t))
}
function by(t, e, n, r, i) {
  return GC(Z(), ag(), t, e, n, r, i)
}
function Ay(t, e) {
  let n = t[e]
  return n === tn ? void 0 : n
}
function zC(t, e, n, r, i, s) {
  let o = e + n
  return Jt(t, o, i) ? _y(t, o + 1, s ? r.call(s, i) : r(i)) : Ay(t, o + 1)
}
function GC(t, e, n, r, i, s, o) {
  let a = e + n
  return oC(t, a, i, s)
    ? _y(t, a + 2, o ? r.call(o, i, s) : r(i, s))
    : Ay(t, a + 2)
}
function Sy(t, e) {
  let n = Vt(),
    r,
    i = t + Ge
  n.firstCreatePass
    ? ((r = WC(e, n.pipeRegistry)),
      (n.data[i] = r),
      r.onDestroy && (n.destroyHooks ??= []).push(i, r.onDestroy))
    : (r = n.data[i])
  let s = r.factory || (r.factory = gr(r.type, !0)),
    o,
    a = Ye(Ir)
  try {
    let c = ao(!1),
      u = s()
    return ao(c), BC(n, Z(), i, u), u
  } finally {
    Ye(a)
  }
}
function WC(t, e) {
  if (e)
    for (let n = e.length - 1; n >= 0; n--) {
      let r = e[n]
      if (t === r.name) return r
    }
}
function xy(t, e, n) {
  let r = t + Ge,
    i = Z(),
    s = fT(i, r)
  return KC(i, r) ? zC(i, ag(), e, s.transform, n, s) : s.transform(n)
}
function KC(t, e) {
  return t[P].data[e].pure
}
var bn = class {
    constructor(e) {
      this.full = e
      let n = e.split('.')
      ;(this.major = n[0]),
        (this.minor = n[1]),
        (this.patch = n.slice(2).join('.'))
    }
  },
  Ny = new bn('17.1.0')
var Ry = (() => {
  let e = class e {
    constructor() {
      ;(this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new Xr(!1))
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
    (e.ɵprov = X({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
var My = new W('')
var QC = new W('Application Initializer'),
  Py = (() => {
    let e = class e {
      constructor() {
        ;(this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            ;(this.resolve = r), (this.reject = i)
          })),
          (this.appInits = ie(QC, { optional: !0 }) ?? [])
      }
      runInitializers() {
        if (this.initialized) return
        let r = []
        for (let s of this.appInits) {
          let o = s()
          if (Lo(o)) r.push(o)
          else if (Sl(o)) {
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
      (e.ɵprov = X({ token: e, factory: e.ɵfac, providedIn: 'root' }))
    let t = e
    return t
  })(),
  YC = new W('appBootstrapListener')
function JC() {
  bp(() => {
    throw new $(600, !1)
  })
}
function ZC(t) {
  return t.isBoundToModule
}
function XC(t, e, n) {
  try {
    let r = n()
    return Lo(r)
      ? r.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i)
        })
      : r
  } catch (r) {
    throw (e.runOutsideAngular(() => t.handleError(r)), r)
  }
}
var Nl = (() => {
  let e = class e {
    constructor() {
      ;(this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = ie(Jg)),
        (this.afterRenderEffectManager = ie(gy)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = ie(Ry).hasPendingTasks.pipe(Re((r) => !r))),
        (this._injector = ie(Tn))
    }
    get destroyed() {
      return this._destroyed
    }
    get injector() {
      return this._injector
    }
    bootstrap(r, i) {
      let s = r instanceof fo
      if (!this._injector.get(Py).done) {
        let f = !s && rT(r),
          g = !1
        throw new $(405, g)
      }
      let a
      s ? (a = r) : (a = this._injector.get(ml).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType)
      let c = ZC(a) ? void 0 : this._injector.get(vr),
        u = i || a.selector,
        l = a.create(Xt.NULL, [], u, c),
        d = l.location.nativeElement,
        h = l.injector.get(My, null)
      return (
        h?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            Zc(this.components, l),
            h?.unregisterApplication(d)
        }),
        this._loadComponent(l),
        l
      )
    }
    tick() {
      if (this._runningTick) throw new $(101, !1)
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
      Zc(this._views, i), i.detachFromAppRef()
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r)
      let i = this._injector.get(YC, [])
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
      return this._destroyListeners.push(r), () => Zc(this._destroyListeners, r)
    }
    destroy() {
      if (this._destroyed) throw new $(406, !1)
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
    (e.ɵprov = X({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
function Zc(t, e) {
  let n = t.indexOf(e)
  n > -1 && t.splice(n, 1)
}
var eb = (() => {
  let e = class e {
    constructor() {
      ;(this.zone = ie(ee)), (this.applicationRef = ie(Nl))
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
    (e.ɵprov = X({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
function tb(t) {
  return [
    { provide: ee, useFactory: t },
    {
      provide: yi,
      multi: !0,
      useFactory: () => {
        let e = ie(eb, { optional: !0 })
        return () => e.initialize()
      },
    },
    {
      provide: yi,
      multi: !0,
      useFactory: () => {
        let e = ie(sb)
        return () => {
          e.initialize()
        }
      },
    },
    { provide: Jg, useFactory: nb },
  ]
}
function nb() {
  let t = ie(ee),
    e = ie(Ft)
  return (n) => t.runOutsideAngular(() => e.handleError(n))
}
function rb(t) {
  let e = tb(() => new ee(ib(t)))
  return xg([[], e])
}
function ib(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  }
}
var sb = (() => {
  let e = class e {
    constructor() {
      ;(this.subscription = new Te()),
        (this.initialized = !1),
        (this.zone = ie(ee)),
        (this.pendingTasks = ie(Ry))
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
              ee.assertNotInAngularZone(),
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
            ee.assertInAngularZone(), (r ??= this.pendingTasks.add())
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
    (e.ɵprov = X({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
function ob() {
  return (typeof $localize < 'u' && $localize.locale) || yo
}
var Rl = new W('LocaleId', {
  providedIn: 'root',
  factory: () => ie(Rl, O.Optional | O.SkipSelf) || ob(),
})
var ky = new W('PlatformDestroyListeners')
var ro = null
function ab(t = [], e) {
  return Xt.create({
    name: e,
    providers: [
      { provide: Ao, useValue: 'platform' },
      { provide: ky, useValue: new Set([() => (ro = null)]) },
      ...t,
    ],
  })
}
function cb(t = []) {
  if (ro) return ro
  let e = ab(t)
  return (ro = e), JC(), ub(e), e
}
function ub(t) {
  t.get(ol, null)?.forEach((n) => n())
}
function Oy(t) {
  try {
    let { rootComponent: e, appProviders: n, platformProviders: r } = t,
      i = cb(r),
      s = [rb(), ...(n || [])],
      a = new vo({
        providers: s,
        parent: i,
        debugName: '',
        runEnvironmentInitializers: !1,
      }).injector,
      c = a.get(ee)
    return c.run(() => {
      a.resolveInjectorInitializers()
      let u = a.get(Ft, null),
        l
      c.runOutsideAngular(() => {
        l = c.onError.subscribe({
          next: (f) => {
            u.handleError(f)
          },
        })
      })
      let d = () => a.destroy(),
        h = i.get(ky)
      return (
        h.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), h.delete(d)
        }),
        XC(u, c, () => {
          let f = a.get(Py)
          return (
            f.runInitializers(),
            f.donePromise.then(() => {
              let g = a.get(Rl, yo)
              VC(g || yo)
              let I = a.get(Nl)
              return e !== void 0 && I.bootstrap(e), I
            })
          )
        })
      )
    })
  } catch (e) {
    return Promise.reject(e)
  }
}
var Pl = null
function Fl() {
  return Pl
}
function Ly(t) {
  Pl || (Pl = t)
}
var Vo = class {},
  nn = new W('DocumentToken')
function Vy(t, e) {
  e = encodeURIComponent(e)
  for (let n of t.split(';')) {
    let r = n.indexOf('='),
      [i, s] = r == -1 ? [n, ''] : [n.slice(0, r), n.slice(r + 1)]
    if (i.trim() === e) return decodeURIComponent(s)
  }
  return null
}
var Ml = /\s+/,
  Fy = [],
  Uy = (() => {
    let e = class e {
      constructor(r, i) {
        ;(this._ngEl = r),
          (this._renderer = i),
          (this.initialClasses = Fy),
          (this.stateMap = new Map())
      }
      set klass(r) {
        this.initialClasses = r != null ? r.trim().split(Ml) : Fy
      }
      set ngClass(r) {
        this.rawClass = typeof r == 'string' ? r.trim().split(Ml) : r
      }
      ngDoCheck() {
        for (let i of this.initialClasses) this._updateState(i, !0)
        let r = this.rawClass
        if (Array.isArray(r) || r instanceof Set)
          for (let i of r) this._updateState(i, !0)
        else if (r != null)
          for (let i of Object.keys(r)) this._updateState(i, !!r[i])
        this._applyStateDiff()
      }
      _updateState(r, i) {
        let s = this.stateMap.get(r)
        s !== void 0
          ? (s.enabled !== i && ((s.changed = !0), (s.enabled = i)),
            (s.touched = !0))
          : this.stateMap.set(r, { enabled: i, changed: !0, touched: !0 })
      }
      _applyStateDiff() {
        for (let r of this.stateMap) {
          let i = r[0],
            s = r[1]
          s.changed
            ? (this._toggleClass(i, s.enabled), (s.changed = !1))
            : s.touched ||
              (s.enabled && this._toggleClass(i, !1), this.stateMap.delete(i)),
            (s.touched = !1)
        }
      }
      _toggleClass(r, i) {
        ;(r = r.trim()),
          r.length > 0 &&
            r.split(Ml).forEach((s) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, s)
                : this._renderer.removeClass(this._ngEl.nativeElement, s)
            })
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(Ir(Ro), Ir(gl))
    }),
      (e.ɵdir = jm({
        type: e,
        selectors: [['', 'ngClass', '']],
        inputs: { klass: [Yt.None, 'class', 'klass'], ngClass: 'ngClass' },
        standalone: !0,
      }))
    let t = e
    return t
  })()
function lb(t, e) {
  return new $(2100, !1)
}
var kl = class {
    createSubscription(e, n) {
      return yl(() =>
        e.subscribe({
          next: n,
          error: (r) => {
            throw r
          },
        })
      )
    }
    dispose(e) {
      yl(() => e.unsubscribe())
    }
  },
  Ol = class {
    createSubscription(e, n) {
      return e.then(n, (r) => {
        throw r
      })
    }
    dispose(e) {}
  },
  db = new Ol(),
  hb = new kl(),
  jy = (() => {
    let e = class e {
      constructor(r) {
        ;(this._latestValue = null),
          (this._subscription = null),
          (this._obj = null),
          (this._strategy = null),
          (this._ref = r)
      }
      ngOnDestroy() {
        this._subscription && this._dispose(), (this._ref = null)
      }
      transform(r) {
        return this._obj
          ? r !== this._obj
            ? (this._dispose(), this.transform(r))
            : this._latestValue
          : (r && this._subscribe(r), this._latestValue)
      }
      _subscribe(r) {
        ;(this._obj = r),
          (this._strategy = this._selectStrategy(r)),
          (this._subscription = this._strategy.createSubscription(r, (i) =>
            this._updateLatestValue(r, i)
          ))
      }
      _selectStrategy(r) {
        if (Lo(r)) return db
        if (Sl(r)) return hb
        throw lb(e, r)
      }
      _dispose() {
        this._strategy.dispose(this._subscription),
          (this._latestValue = null),
          (this._subscription = null),
          (this._obj = null)
      }
      _updateLatestValue(r, i) {
        r === this._obj && ((this._latestValue = i), this._ref.markForCheck())
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(Ir(my, 16))
    }),
      (e.ɵpipe = Bm({ name: 'async', type: e, pure: !1, standalone: !0 }))
    let t = e
    return t
  })()
var Rn = (() => {
    let e = class e {}
    ;(e.ɵfac = function (i) {
      return new (i || e)()
    }),
      (e.ɵmod = Sn({ type: e })),
      (e.ɵinj = An({}))
    let t = e
    return t
  })(),
  By = 'browser',
  fb = 'server'
function Ll(t) {
  return t === fb
}
var Uo = class {}
var jl = class extends Vo {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0)
    }
  },
  Bl = class t extends jl {
    static makeCurrent() {
      Ly(new t())
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
      let n = mb()
      return n == null ? null : gb(n)
    }
    resetBaseElement() {
      Ci = null
    }
    getUserAgent() {
      return window.navigator.userAgent
    }
    getCookie(e) {
      return Vy(document.cookie, e)
    }
  },
  Ci = null
function mb() {
  return (
    (Ci = Ci || document.querySelector('base')),
    Ci ? Ci.getAttribute('href') : null
  )
}
function gb(t) {
  return new URL(t, document.baseURI).pathname
}
var yb = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest()
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)()
    }),
      (e.ɵprov = X({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  $l = new W('EventManagerPlugins'),
  Gy = (() => {
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
          throw new $(5101, !1)
        return this._eventNameToPlugin.set(r, i), i
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(V($l), V(ee))
    }),
      (e.ɵprov = X({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  jo = class {
    constructor(e) {
      this._doc = e
    }
  },
  Vl = 'ng-app-id',
  Wy = (() => {
    let e = class e {
      constructor(r, i, s, o = {}) {
        ;(this.doc = r),
          (this.appId = i),
          (this.nonce = s),
          (this.platformId = o),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = Ll(o)),
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
        let r = this.doc.head?.querySelectorAll(`style[${Vl}="${this.appId}"]`)
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
        if (o?.parentNode === r) return s.delete(i), o.removeAttribute(Vl), o
        {
          let a = this.doc.createElement('style')
          return (
            this.nonce && a.setAttribute('nonce', this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(Vl, this.appId),
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
      return new (i || e)(V(nn), V(sl), V(al, 8), V(en))
    }),
      (e.ɵprov = X({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  Ul = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/MathML/',
  },
  ql = /%COMP%/g,
  Ky = '%COMP%',
  vb = `_nghost-${Ky}`,
  _b = `_ngcontent-${Ky}`,
  Ib = !0,
  wb = new W('RemoveStylesOnCompDestroy', {
    providedIn: 'root',
    factory: () => Ib,
  })
function Eb(t) {
  return _b.replace(ql, t)
}
function Tb(t) {
  return vb.replace(ql, t)
}
function Qy(t, e) {
  return e.map((n) => n.replace(ql, t))
}
var Hy = (() => {
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
          (this.platformIsServer = Ll(c)),
          (this.defaultRenderer = new bi(r, a, u, this.platformIsServer))
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer
        this.platformIsServer &&
          i.encapsulation === _t.ShadowDom &&
          (i = Pt(gt({}, i), { encapsulation: _t.Emulated }))
        let s = this.getOrCreateRenderer(r, i)
        return (
          s instanceof Bo
            ? s.applyToHost(r)
            : s instanceof Ai && s.applyStyles(),
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
            case _t.Emulated:
              o = new Bo(u, l, i, this.appId, d, a, c, h)
              break
            case _t.ShadowDom:
              return new Hl(u, l, r, i, a, c, this.nonce, h)
            default:
              o = new Ai(u, l, i, d, a, c, h)
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
      return new (i || e)(
        V(Gy),
        V(Wy),
        V(sl),
        V(wb),
        V(nn),
        V(en),
        V(ee),
        V(al)
      )
    }),
      (e.ɵprov = X({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  bi = class {
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
        ? this.doc.createElementNS(Ul[n] || n, e)
        : this.doc.createElement(e)
    }
    createComment(e) {
      return this.doc.createComment(e)
    }
    createText(e) {
      return this.doc.createTextNode(e)
    }
    appendChild(e, n) {
      ;(qy(e) ? e.content : e).appendChild(n)
    }
    insertBefore(e, n, r) {
      e && (qy(e) ? e.content : e).insertBefore(n, r)
    }
    removeChild(e, n) {
      e && e.removeChild(n)
    }
    selectRootElement(e, n) {
      let r = typeof e == 'string' ? this.doc.querySelector(e) : e
      if (!r) throw new $(-5104, !1)
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
        let s = Ul[i]
        s ? e.setAttributeNS(s, n, r) : e.setAttribute(n, r)
      } else e.setAttribute(n, r)
    }
    removeAttribute(e, n, r) {
      if (r) {
        let i = Ul[r]
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
      i & (Ot.DashCase | Ot.Important)
        ? e.style.setProperty(n, r, i & Ot.Important ? 'important' : '')
        : (e.style[n] = r)
    }
    removeStyle(e, n, r) {
      r & Ot.DashCase ? e.style.removeProperty(n) : (e.style[n] = '')
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
        ((e = Fl().getGlobalEventTarget(this.doc, e)), !e)
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
function qy(t) {
  return t.tagName === 'TEMPLATE' && t.content !== void 0
}
var Hl = class extends bi {
    constructor(e, n, r, i, s, o, a, c) {
      super(e, s, o, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot)
      let u = Qy(i.id, i.styles)
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
  Ai = class extends bi {
    constructor(e, n, r, i, s, o, a, c) {
      super(e, s, o, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? Qy(c, r.styles) : r.styles)
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles)
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles)
    }
  },
  Bo = class extends Ai {
    constructor(e, n, r, i, s, o, a, c) {
      let u = i + '-' + r.id
      super(e, n, r, s, o, a, c, u),
        (this.contentAttr = Eb(u)),
        (this.hostAttr = Tb(u))
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, '')
    }
    createElement(e, n) {
      let r = super.createElement(e, n)
      return super.setAttribute(r, this.contentAttr, ''), r
    }
  },
  Db = (() => {
    let e = class e extends jo {
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
      return new (i || e)(V(nn))
    }),
      (e.ɵprov = X({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  zy = ['alt', 'control', 'meta', 'shift'],
  Cb = {
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
  bb = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  Ab = (() => {
    let e = class e extends jo {
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
          .runOutsideAngular(() => Fl().onAndCancel(r, o.domEventName, a))
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
          zy.forEach((l) => {
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
        let s = Cb[r.key] || r.key,
          o = ''
        return (
          i.indexOf('code.') > -1 && ((s = r.code), (o = 'code.')),
          s == null || !s
            ? !1
            : ((s = s.toLowerCase()),
              s === ' ' ? (s = 'space') : s === '.' && (s = 'dot'),
              zy.forEach((a) => {
                if (a !== s) {
                  let c = bb[a]
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
      return new (i || e)(V(nn))
    }),
      (e.ɵprov = X({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })()
function Yy(t, e) {
  return Oy(gt({ rootComponent: t }, Sb(e)))
}
function Sb(t) {
  return {
    appProviders: [...Pb, ...(t?.providers ?? [])],
    platformProviders: Mb,
  }
}
function xb() {
  Bl.makeCurrent()
}
function Nb() {
  return new Ft()
}
function Rb() {
  return Pg(document), document
}
var Mb = [
  { provide: en, useValue: By },
  { provide: ol, useValue: xb, multi: !0 },
  { provide: nn, useFactory: Rb, deps: [] },
]
var Pb = [
  { provide: Ao, useValue: 'root' },
  { provide: Ft, useFactory: Nb, deps: [] },
  { provide: $l, useClass: Db, multi: !0, deps: [nn, ee, en] },
  { provide: $l, useClass: Ab, multi: !0, deps: [nn] },
  Hy,
  Wy,
  Gy,
  { provide: vi, useExisting: Hy },
  { provide: Uo, useClass: yb, deps: [] },
  [],
]
var Zy = function (t) {
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
  kb = function (t) {
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
  Xy = {
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
        : this.encodeByteArray(Zy(t), e)
    },
    decodeString(t, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? atob(t)
        : kb(this.decodeStringToByteArray(t, e))
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
          throw new Gl()
        let h = (s << 2) | (a >> 4)
        if ((r.push(h), u !== 64)) {
          let f = ((a << 4) & 240) | (u >> 2)
          if ((r.push(f), d !== 64)) {
            let g = ((u << 6) & 192) | d
            r.push(g)
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
  Gl = class extends Error {
    constructor() {
      super(...arguments), (this.name = 'DecodeBase64StringError')
    }
  },
  Ob = function (t) {
    let e = Zy(t)
    return Xy.encodeByteArray(e, !0)
  },
  Si = function (t) {
    return Ob(t).replace(/\./g, '')
  },
  Kl = function (t) {
    try {
      return Xy.decodeString(t, !0)
    } catch (e) {
      console.error('base64Decode failed: ', e)
    }
    return null
  }
function Fb() {
  if (typeof self < 'u') return self
  if (typeof window < 'u') return window
  if (typeof global < 'u') return global
  throw new Error('Unable to locate global object.')
}
var Lb = () => Fb().__FIREBASE_DEFAULTS__,
  Vb = () => {
    if (typeof process > 'u' || typeof process.env > 'u') return
    let t = process.env.__FIREBASE_DEFAULTS__
    if (t) return JSON.parse(t)
  },
  Ub = () => {
    if (typeof document > 'u') return
    let t
    try {
      t = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)
    } catch {
      return
    }
    let e = t && Kl(t[1])
    return e && JSON.parse(e)
  },
  Ho = () => {
    try {
      return Lb() || Vb() || Ub()
    } catch (t) {
      console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`)
      return
    }
  },
  ev = (t) => {
    var e, n
    return (n =
      (e = Ho()) === null || e === void 0 ? void 0 : e.emulatorHosts) ===
      null || n === void 0
      ? void 0
      : n[t]
  },
  tv = (t) => {
    let e = ev(t)
    if (!e) return
    let n = e.lastIndexOf(':')
    if (n <= 0 || n + 1 === e.length)
      throw new Error(`Invalid host ${e} with no separate hostname and port!`)
    let r = parseInt(e.substring(n + 1), 10)
    return e[0] === '[' ? [e.substring(1, n - 1), r] : [e.substring(0, n), r]
  },
  Ql = () => {
    var t
    return (t = Ho()) === null || t === void 0 ? void 0 : t.config
  },
  nv = (t) => {
    var e
    return (e = Ho()) === null || e === void 0 ? void 0 : e[`_${t}`]
  }
var $o = class {
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
function rv(t, e) {
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
  return [Si(JSON.stringify(n)), Si(JSON.stringify(o)), ''].join('.')
}
function be() {
  return typeof navigator < 'u' && typeof navigator.userAgent == 'string'
    ? navigator.userAgent
    : ''
}
function iv() {
  return (
    typeof window < 'u' &&
    !!(window.cordova || window.phonegap || window.PhoneGap) &&
    /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(be())
  )
}
function jb() {
  var t
  let e = (t = Ho()) === null || t === void 0 ? void 0 : t.forceEnvironment
  if (e === 'node') return !0
  if (e === 'browser') return !1
  try {
    return Object.prototype.toString.call(global.process) === '[object process]'
  } catch {
    return !1
  }
}
function sv() {
  let t =
    typeof chrome == 'object'
      ? chrome.runtime
      : typeof browser == 'object'
        ? browser.runtime
        : void 0
  return typeof t == 'object' && t.id !== void 0
}
function ov() {
  return typeof navigator == 'object' && navigator.product === 'ReactNative'
}
function av() {
  return (
    !jb() &&
    !!navigator.userAgent &&
    navigator.userAgent.includes('Safari') &&
    !navigator.userAgent.includes('Chrome')
  )
}
function qo() {
  try {
    return typeof indexedDB == 'object'
  } catch {
    return !1
  }
}
function cv() {
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
var Bb = 'FirebaseError',
  et = class t extends Error {
    constructor(e, n, r) {
      super(n),
        (this.code = e),
        (this.customData = r),
        (this.name = Bb),
        Object.setPrototypeOf(this, t.prototype),
        Error.captureStackTrace &&
          Error.captureStackTrace(this, Bt.prototype.create)
    }
  },
  Bt = class {
    constructor(e, n, r) {
      ;(this.service = e), (this.serviceName = n), (this.errors = r)
    }
    create(e, ...n) {
      let r = n[0] || {},
        i = `${this.service}/${e}`,
        s = this.errors[e],
        o = s ? $b(s, r) : 'Error',
        a = `${this.serviceName}: ${o} (${i}).`
      return new et(i, a, r)
    }
  }
function $b(t, e) {
  return t.replace(Hb, (n, r) => {
    let i = e[r]
    return i != null ? String(i) : `<${r}?>`
  })
}
var Hb = /\{\$([^}]+)}/g
function wr(t, e) {
  if (t === e) return !0
  let n = Object.keys(t),
    r = Object.keys(e)
  for (let i of n) {
    if (!r.includes(i)) return !1
    let s = t[i],
      o = e[i]
    if (Jy(s) && Jy(o)) {
      if (!wr(s, o)) return !1
    } else if (s !== o) return !1
  }
  for (let i of r) if (!n.includes(i)) return !1
  return !0
}
function Jy(t) {
  return t !== null && typeof t == 'object'
}
function Yl(t) {
  let e = []
  for (let [n, r] of Object.entries(t))
    Array.isArray(r)
      ? r.forEach((i) => {
          e.push(encodeURIComponent(n) + '=' + encodeURIComponent(i))
        })
      : e.push(encodeURIComponent(n) + '=' + encodeURIComponent(r))
  return e.length ? '&' + e.join('&') : ''
}
function uv(t, e) {
  let n = new Wl(t, e)
  return n.subscribe.bind(n)
}
var Wl = class {
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
    qb(e, ['next', 'error', 'complete'])
      ? (i = e)
      : (i = { next: e, error: n, complete: r }),
      i.next === void 0 && (i.next = zl),
      i.error === void 0 && (i.error = zl),
      i.complete === void 0 && (i.complete = zl)
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
function qb(t, e) {
  if (typeof t != 'object' || t === null) return !1
  for (let n of e) if (n in t && typeof t[n] == 'function') return !0
  return !1
}
function zl() {}
var HF = 4 * 60 * 60 * 1e3
function rn(t) {
  return t && t._delegate ? t._delegate : t
}
var tt = class {
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
var Mn = '[DEFAULT]'
var Jl = class {
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
      let r = new $o()
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
      if (Gb(e))
        try {
          this.getOrInitializeService({ instanceIdentifier: Mn })
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
  clearInstance(e = Mn) {
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
  isInitialized(e = Mn) {
    return this.instances.has(e)
  }
  getOptions(e = Mn) {
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
        instanceIdentifier: zb(e),
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
  normalizeInstanceIdentifier(e = Mn) {
    return this.component ? (this.component.multipleInstances ? e : Mn) : e
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== 'EXPLICIT'
  }
}
function zb(t) {
  return t === Mn ? void 0 : t
}
function Gb(t) {
  return t.instantiationMode === 'EAGER'
}
var zo = class {
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
    let n = new Jl(e, this)
    return this.providers.set(e, n), n
  }
  getProviders() {
    return Array.from(this.providers.values())
  }
}
var Wb = [],
  k = (function (t) {
    return (
      (t[(t.DEBUG = 0)] = 'DEBUG'),
      (t[(t.VERBOSE = 1)] = 'VERBOSE'),
      (t[(t.INFO = 2)] = 'INFO'),
      (t[(t.WARN = 3)] = 'WARN'),
      (t[(t.ERROR = 4)] = 'ERROR'),
      (t[(t.SILENT = 5)] = 'SILENT'),
      t
    )
  })(k || {}),
  Kb = {
    debug: k.DEBUG,
    verbose: k.VERBOSE,
    info: k.INFO,
    warn: k.WARN,
    error: k.ERROR,
    silent: k.SILENT,
  },
  Qb = k.INFO,
  Yb = {
    [k.DEBUG]: 'log',
    [k.VERBOSE]: 'log',
    [k.INFO]: 'info',
    [k.WARN]: 'warn',
    [k.ERROR]: 'error',
  },
  Jb = (t, e, ...n) => {
    if (e < t.logLevel) return
    let r = new Date().toISOString(),
      i = Yb[e]
    if (i) console[i](`[${r}]  ${t.name}:`, ...n)
    else
      throw new Error(
        `Attempted to log a message with an invalid logType (value: ${e})`
      )
  },
  sn = class {
    constructor(e) {
      ;(this.name = e),
        (this._logLevel = Qb),
        (this._logHandler = Jb),
        (this._userLogHandler = null),
        Wb.push(this)
    }
    get logLevel() {
      return this._logLevel
    }
    set logLevel(e) {
      if (!(e in k))
        throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``)
      this._logLevel = e
    }
    setLogLevel(e) {
      this._logLevel = typeof e == 'string' ? Kb[e] : e
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
      this._userLogHandler && this._userLogHandler(this, k.DEBUG, ...e),
        this._logHandler(this, k.DEBUG, ...e)
    }
    log(...e) {
      this._userLogHandler && this._userLogHandler(this, k.VERBOSE, ...e),
        this._logHandler(this, k.VERBOSE, ...e)
    }
    info(...e) {
      this._userLogHandler && this._userLogHandler(this, k.INFO, ...e),
        this._logHandler(this, k.INFO, ...e)
    }
    warn(...e) {
      this._userLogHandler && this._userLogHandler(this, k.WARN, ...e),
        this._logHandler(this, k.WARN, ...e)
    }
    error(...e) {
      this._userLogHandler && this._userLogHandler(this, k.ERROR, ...e),
        this._logHandler(this, k.ERROR, ...e)
    }
  }
var Zb = (t, e) => e.some((n) => t instanceof n),
  lv,
  dv
function Xb() {
  return (
    lv ||
    (lv = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
  )
}
function eA() {
  return (
    dv ||
    (dv = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey,
    ])
  )
}
var hv = new WeakMap(),
  Xl = new WeakMap(),
  fv = new WeakMap(),
  Zl = new WeakMap(),
  td = new WeakMap()
function tA(t) {
  let e = new Promise((n, r) => {
    let i = () => {
        t.removeEventListener('success', s), t.removeEventListener('error', o)
      },
      s = () => {
        n(Tt(t.result)), i()
      },
      o = () => {
        r(t.error), i()
      }
    t.addEventListener('success', s), t.addEventListener('error', o)
  })
  return (
    e
      .then((n) => {
        n instanceof IDBCursor && hv.set(n, t)
      })
      .catch(() => {}),
    td.set(e, t),
    e
  )
}
function nA(t) {
  if (Xl.has(t)) return
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
  Xl.set(t, e)
}
var ed = {
  get(t, e, n) {
    if (t instanceof IDBTransaction) {
      if (e === 'done') return Xl.get(t)
      if (e === 'objectStoreNames') return t.objectStoreNames || fv.get(t)
      if (e === 'store')
        return n.objectStoreNames[1]
          ? void 0
          : n.objectStore(n.objectStoreNames[0])
    }
    return Tt(t[e])
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
function pv(t) {
  ed = t(ed)
}
function rA(t) {
  return t === IDBDatabase.prototype.transaction &&
    !('objectStoreNames' in IDBTransaction.prototype)
    ? function (e, ...n) {
        let r = t.call(Go(this), e, ...n)
        return fv.set(r, e.sort ? e.sort() : [e]), Tt(r)
      }
    : eA().includes(t)
      ? function (...e) {
          return t.apply(Go(this), e), Tt(hv.get(this))
        }
      : function (...e) {
          return Tt(t.apply(Go(this), e))
        }
}
function iA(t) {
  return typeof t == 'function'
    ? rA(t)
    : (t instanceof IDBTransaction && nA(t), Zb(t, Xb()) ? new Proxy(t, ed) : t)
}
function Tt(t) {
  if (t instanceof IDBRequest) return tA(t)
  if (Zl.has(t)) return Zl.get(t)
  let e = iA(t)
  return e !== t && (Zl.set(t, e), td.set(e, t)), e
}
var Go = (t) => td.get(t)
function gv(t, e, { blocked: n, upgrade: r, blocking: i, terminated: s } = {}) {
  let o = indexedDB.open(t, e),
    a = Tt(o)
  return (
    r &&
      o.addEventListener('upgradeneeded', (c) => {
        r(Tt(o.result), c.oldVersion, c.newVersion, Tt(o.transaction), c)
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
var sA = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
  oA = ['put', 'add', 'delete', 'clear'],
  nd = new Map()
function mv(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == 'string')) return
  if (nd.get(e)) return nd.get(e)
  let n = e.replace(/FromIndex$/, ''),
    r = e !== n,
    i = oA.includes(n)
  if (
    !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
    !(i || sA.includes(n))
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
  return nd.set(e, s), s
}
pv((t) =>
  Pt(gt({}, t), {
    get: (e, n, r) => mv(e, n) || t.get(e, n, r),
    has: (e, n) => !!mv(e, n) || t.has(e, n),
  })
)
var id = class {
  constructor(e) {
    this.container = e
  }
  getPlatformInfoString() {
    return this.container
      .getProviders()
      .map((n) => {
        if (aA(n)) {
          let r = n.getImmediate()
          return `${r.library}/${r.version}`
        } else return null
      })
      .filter((n) => n)
      .join(' ')
  }
}
function aA(t) {
  let e = t.getComponent()
  return e?.type === 'VERSION'
}
var sd = '@firebase/app',
  yv = '0.9.28'
var Pn = new sn('@firebase/app'),
  cA = '@firebase/app-compat',
  uA = '@firebase/analytics-compat',
  lA = '@firebase/analytics',
  dA = '@firebase/app-check-compat',
  hA = '@firebase/app-check',
  fA = '@firebase/auth',
  pA = '@firebase/auth-compat',
  mA = '@firebase/database',
  gA = '@firebase/database-compat',
  yA = '@firebase/functions',
  vA = '@firebase/functions-compat',
  _A = '@firebase/installations',
  IA = '@firebase/installations-compat',
  wA = '@firebase/messaging',
  EA = '@firebase/messaging-compat',
  TA = '@firebase/performance',
  DA = '@firebase/performance-compat',
  CA = '@firebase/remote-config',
  bA = '@firebase/remote-config-compat',
  AA = '@firebase/storage',
  SA = '@firebase/storage-compat',
  xA = '@firebase/firestore',
  NA = '@firebase/firestore-compat',
  RA = 'firebase',
  MA = '10.8.1'
var od = '[DEFAULT]',
  PA = {
    [sd]: 'fire-core',
    [cA]: 'fire-core-compat',
    [lA]: 'fire-analytics',
    [uA]: 'fire-analytics-compat',
    [hA]: 'fire-app-check',
    [dA]: 'fire-app-check-compat',
    [fA]: 'fire-auth',
    [pA]: 'fire-auth-compat',
    [mA]: 'fire-rtdb',
    [gA]: 'fire-rtdb-compat',
    [yA]: 'fire-fn',
    [vA]: 'fire-fn-compat',
    [_A]: 'fire-iid',
    [IA]: 'fire-iid-compat',
    [wA]: 'fire-fcm',
    [EA]: 'fire-fcm-compat',
    [TA]: 'fire-perf',
    [DA]: 'fire-perf-compat',
    [CA]: 'fire-rc',
    [bA]: 'fire-rc-compat',
    [AA]: 'fire-gcs',
    [SA]: 'fire-gcs-compat',
    [xA]: 'fire-fst',
    [NA]: 'fire-fst-compat',
    'fire-js': 'fire-js',
    [RA]: 'fire-js-all',
  }
var xi = new Map(),
  ad = new Map()
function kA(t, e) {
  try {
    t.container.addComponent(e)
  } catch (n) {
    Pn.debug(
      `Component ${e.name} failed to register with FirebaseApp ${t.name}`,
      n
    )
  }
}
function an(t) {
  let e = t.name
  if (ad.has(e))
    return (
      Pn.debug(`There were multiple attempts to register component ${e}.`), !1
    )
  ad.set(e, t)
  for (let n of xi.values()) kA(n, t)
  return !0
}
function dd(t, e) {
  let n = t.container.getProvider('heartbeat').getImmediate({ optional: !0 })
  return n && n.triggerHeartbeat(), t.container.getProvider(e)
}
var OA = {
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
  on = new Bt('app', 'Firebase', OA)
var cd = class {
  constructor(e, n, r) {
    ;(this._isDeleted = !1),
      (this._options = Object.assign({}, e)),
      (this._config = Object.assign({}, n)),
      (this._name = n.name),
      (this._automaticDataCollectionEnabled = n.automaticDataCollectionEnabled),
      (this._container = r),
      this.container.addComponent(new tt('app', () => this, 'PUBLIC'))
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
    if (this.isDeleted) throw on.create('app-deleted', { appName: this._name })
  }
}
var Er = MA
function hd(t, e = {}) {
  let n = t
  typeof e != 'object' && (e = { name: e })
  let r = Object.assign({ name: od, automaticDataCollectionEnabled: !1 }, e),
    i = r.name
  if (typeof i != 'string' || !i)
    throw on.create('bad-app-name', { appName: String(i) })
  if ((n || (n = Ql()), !n)) throw on.create('no-options')
  let s = xi.get(i)
  if (s) {
    if (wr(n, s.options) && wr(r, s.config)) return s
    throw on.create('duplicate-app', { appName: i })
  }
  let o = new zo(i)
  for (let c of ad.values()) o.addComponent(c)
  let a = new cd(n, r, o)
  return xi.set(i, a), a
}
function Ri(t = od) {
  let e = xi.get(t)
  if (!e && t === od && Ql()) return hd()
  if (!e) throw on.create('no-app', { appName: t })
  return e
}
function Wo() {
  return Array.from(xi.values())
}
function ge(t, e, n) {
  var r
  let i = (r = PA[t]) !== null && r !== void 0 ? r : t
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
      Pn.warn(a.join(' '))
    return
  }
  an(new tt(`${i}-version`, () => ({ library: i, version: e }), 'VERSION'))
}
var FA = 'firebase-heartbeat-database',
  LA = 1,
  Ni = 'firebase-heartbeat-store',
  rd = null
function wv() {
  return (
    rd ||
      (rd = gv(FA, LA, {
        upgrade: (t, e) => {
          switch (e) {
            case 0:
              try {
                t.createObjectStore(Ni)
              } catch (n) {
                console.warn(n)
              }
          }
        },
      }).catch((t) => {
        throw on.create('idb-open', { originalErrorMessage: t.message })
      })),
    rd
  )
}
function VA(t) {
  return p(this, null, function* () {
    try {
      let n = (yield wv()).transaction(Ni),
        r = yield n.objectStore(Ni).get(Ev(t))
      return yield n.done, r
    } catch (e) {
      if (e instanceof et) Pn.warn(e.message)
      else {
        let n = on.create('idb-get', { originalErrorMessage: e?.message })
        Pn.warn(n.message)
      }
    }
  })
}
function vv(t, e) {
  return p(this, null, function* () {
    try {
      let r = (yield wv()).transaction(Ni, 'readwrite')
      yield r.objectStore(Ni).put(e, Ev(t)), yield r.done
    } catch (n) {
      if (n instanceof et) Pn.warn(n.message)
      else {
        let r = on.create('idb-set', { originalErrorMessage: n?.message })
        Pn.warn(r.message)
      }
    }
  })
}
function Ev(t) {
  return `${t.name}!${t.options.appId}`
}
var UA = 1024,
  jA = 30 * 24 * 60 * 60 * 1e3,
  ud = class {
    constructor(e) {
      ;(this.container = e), (this._heartbeatsCache = null)
      let n = this.container.getProvider('app').getImmediate()
      ;(this._storage = new ld(n)),
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
          s = _v()
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
                return Date.now() - a <= jA
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
        let n = _v(),
          { heartbeatsToSend: r, unsentEntries: i } = BA(
            this._heartbeatsCache.heartbeats
          ),
          s = Si(JSON.stringify({ version: 2, heartbeats: r }))
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
function _v() {
  return new Date().toISOString().substring(0, 10)
}
function BA(t, e = UA) {
  let n = [],
    r = t.slice()
  for (let i of t) {
    let s = n.find((o) => o.agent === i.agent)
    if (s) {
      if ((s.dates.push(i.date), Iv(n) > e)) {
        s.dates.pop()
        break
      }
    } else if ((n.push({ agent: i.agent, dates: [i.date] }), Iv(n) > e)) {
      n.pop()
      break
    }
    r = r.slice(1)
  }
  return { heartbeatsToSend: n, unsentEntries: r }
}
var ld = class {
  constructor(e) {
    ;(this.app = e),
      (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck())
  }
  runIndexedDBEnvironmentCheck() {
    return p(this, null, function* () {
      return qo()
        ? cv()
            .then(() => !0)
            .catch(() => !1)
        : !1
    })
  }
  read() {
    return p(this, null, function* () {
      if (yield this._canUseIndexedDBPromise) {
        let n = yield VA(this.app)
        return n?.heartbeats ? n : { heartbeats: [] }
      } else return { heartbeats: [] }
    })
  }
  overwrite(e) {
    return p(this, null, function* () {
      var n
      if (yield this._canUseIndexedDBPromise) {
        let i = yield this.read()
        return vv(this.app, {
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
        return vv(this.app, {
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
function Iv(t) {
  return Si(JSON.stringify({ version: 2, heartbeats: t })).length
}
function $A(t) {
  an(new tt('platform-logger', (e) => new id(e), 'PRIVATE')),
    an(new tt('heartbeat', (e) => new ud(e), 'PRIVATE')),
    ge(sd, yv, t),
    ge(sd, yv, 'esm2017'),
    ge('fire-js', '')
}
$A('')
var HA = 'firebase',
  qA = '10.8.1'
ge(HA, qA, 'app')
var Dr = new bn('ANGULARFIRE2_VERSION')
function pd(t, e, n) {
  if (e) {
    if (e.length === 1) return e[0]
    let s = e.filter((o) => o.app === n)
    if (s.length === 1) return s[0]
  }
  return n.container.getProvider(t).getImmediate({ optional: !0 })
}
var Pi = (t, e) => {
    let n = e ? [e] : Wo(),
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
  Mi = class {
    constructor() {
      return Pi(zA)
    }
  },
  zA = 'app-check'
function Tr() {}
var Ko = class {
    zone
    delegate
    constructor(e, n = kc) {
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
  fd = class {
    zone
    task = null
    constructor(e) {
      this.zone = e
    }
    call(e, n) {
      let r = this.unscheduleTask.bind(this)
      return (
        (this.task = this.zone.run(() =>
          Zone.current.scheduleMacroTask('firebaseZoneBlock', Tr, {}, Tr, Tr)
        )),
        n
          .pipe(Qt({ next: r, complete: r, error: r }))
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
  ki = (() => {
    class t {
      ngZone
      outsideAngular
      insideAngular
      constructor(n) {
        ;(this.ngZone = n),
          (this.outsideAngular = n.runOutsideAngular(
            () => new Ko(Zone.current)
          )),
          (this.insideAngular = n.run(() => new Ko(Zone.current, Pc))),
          (globalThis.ɵAngularFireScheduler ||= this)
      }
      static ɵfac = function (r) {
        return new (r || t)(V(ee))
      }
      static ɵprov = X({ token: t, factory: t.ɵfac, providedIn: 'root' })
    }
    return t
  })()
function Qo() {
  let t = globalThis.ɵAngularFireScheduler
  if (!t)
    throw new Error(`Either AngularFireModule has not been provided in your AppModule (this can be done manually or implictly using
provideFirebaseApp) or you're calling an AngularFire method outside of an NgModule (which is not supported).`)
  return t
}
function GA(t) {
  return Qo().ngZone.runOutsideAngular(() => t())
}
function kn(t) {
  return Qo().ngZone.run(() => t())
}
function WA(t) {
  return KA(Qo())(t)
}
function KA(t) {
  return function (n) {
    return (
      (n = n.lift(new fd(t.ngZone))),
      n.pipe(Kt(t.outsideAngular), Wt(t.insideAngular))
    )
  }
}
var QA = (t, e) =>
    function () {
      let r = arguments
      return (
        e &&
          setTimeout(() => {
            e.state === 'scheduled' && e.invoke()
          }, 10),
        kn(() => t.apply(void 0, r))
      )
    },
  On = (t, e) =>
    function () {
      let n,
        r = arguments
      for (let s = 0; s < arguments.length; s++)
        typeof r[s] == 'function' &&
          (e &&
            (n ||= kn(() =>
              Zone.current.scheduleMacroTask(
                'firebaseZoneBlock',
                Tr,
                {},
                Tr,
                Tr
              )
            )),
          (r[s] = QA(r[s], n)))
      let i = GA(() => t.apply(this, r))
      if (!e)
        if (i instanceof Q) {
          let s = Qo()
          return i.pipe(Kt(s.outsideAngular), Wt(s.insideAngular))
        } else return kn(() => i)
      return i instanceof Q
        ? i.pipe(WA)
        : i instanceof Promise
          ? kn(
              () =>
                new Promise((s, o) =>
                  i.then(
                    (a) => kn(() => s(a)),
                    (a) => kn(() => o(a))
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
            : kn(() => i)
    }
var Fn = class {
    constructor(e) {
      return e
    }
  },
  Oi = class {
    constructor() {
      return Wo()
    }
  }
function YA(t) {
  return t && t.length === 1 ? t[0] : new Fn(Ri())
}
var md = new W('angularfire2._apps'),
  JA = { provide: Fn, useFactory: YA, deps: [[new jt(), md]] },
  ZA = { provide: Oi, deps: [[new jt(), md]] }
function XA(t) {
  return (e, n) => {
    let r = e.runOutsideAngular(() => t(n))
    return new Fn(r)
  }
}
var eS = (() => {
  class t {
    constructor(n) {
      ge('angularfire', Dr.full, 'core'),
        ge('angularfire', Dr.full, 'app'),
        ge('angular', Ny.full, n.toString())
    }
    static ɵfac = function (r) {
      return new (r || t)(V(en))
    }
    static ɵmod = Sn({ type: t })
    static ɵinj = An({ providers: [JA, ZA] })
  }
  return t
})()
function Tv(t, ...e) {
  return {
    ngModule: eS,
    providers: [
      { provide: md, useFactory: XA(t), multi: !0, deps: [ee, Xt, ki, ...e] },
    ],
  }
}
var Dv = On(hd, !0)
function Rv() {
  return {
    'dependent-sdk-initialized-before-auth':
      'Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.',
  }
}
var Mv = Rv,
  Pv = new Bt('auth', 'Firebase', Rv())
var Zo = new sn('@firebase/auth')
function nS(t, ...e) {
  Zo.logLevel <= k.WARN && Zo.warn(`Auth (${Er}): ${t}`, ...e)
}
function Jo(t, ...e) {
  Zo.logLevel <= k.ERROR && Zo.error(`Auth (${Er}): ${t}`, ...e)
}
function Cv(t, ...e) {
  throw Ad(t, ...e)
}
function bd(t, ...e) {
  return Ad(t, ...e)
}
function rS(t, e, n) {
  let r = Object.assign(Object.assign({}, Mv()), { [e]: n })
  return new Bt('auth', 'Firebase', r).create(e, { appName: t.name })
}
function Ad(t, ...e) {
  if (typeof t != 'string') {
    let n = e[0],
      r = [...e.slice(1)]
    return r[0] && (r[0].appName = t.name), t._errorFactory.create(n, ...r)
  }
  return Pv.create(t, ...e)
}
function H(t, e, ...n) {
  if (!t) throw Ad(e, ...n)
}
function Fi(t) {
  let e = 'INTERNAL ASSERTION FAILED: ' + t
  throw (Jo(e), new Error(e))
}
function Xo(t, e) {
  t || Fi(e)
}
function iS() {
  return bv() === 'http:' || bv() === 'https:'
}
function bv() {
  var t
  return (
    (typeof self < 'u' &&
      ((t = self.location) === null || t === void 0 ? void 0 : t.protocol)) ||
    null
  )
}
function sS() {
  return typeof navigator < 'u' &&
    navigator &&
    'onLine' in navigator &&
    typeof navigator.onLine == 'boolean' &&
    (iS() || sv() || 'connection' in navigator)
    ? navigator.onLine
    : !0
}
function oS() {
  if (typeof navigator > 'u') return null
  let t = navigator
  return (t.languages && t.languages[0]) || t.language || null
}
var Vn = class {
  constructor(e, n) {
    ;(this.shortDelay = e),
      (this.longDelay = n),
      Xo(n > e, 'Short delay should be less than long delay!'),
      (this.isMobile = iv() || ov())
  }
  get() {
    return sS()
      ? this.isMobile
        ? this.longDelay
        : this.shortDelay
      : Math.min(5e3, this.shortDelay)
  }
}
function aS(t, e) {
  Xo(t.emulator, 'Emulator should always be set here')
  let { url: n } = t.emulator
  return e ? `${n}${e.startsWith('/') ? e.slice(1) : e}` : n
}
var ea = class {
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
    Fi(
      'Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    )
  }
  static headers() {
    if (this.headersImpl) return this.headersImpl
    if (typeof self < 'u' && 'Headers' in self) return self.Headers
    if (typeof globalThis < 'u' && globalThis.Headers) return globalThis.Headers
    if (typeof Headers < 'u') return Headers
    Fi(
      'Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    )
  }
  static response() {
    if (this.responseImpl) return this.responseImpl
    if (typeof self < 'u' && 'Response' in self) return self.Response
    if (typeof globalThis < 'u' && globalThis.Response)
      return globalThis.Response
    if (typeof Response < 'u') return Response
    Fi(
      'Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    )
  }
}
var cS = {
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
var uS = new Vn(3e4, 6e4)
function kv(t, e) {
  return t.tenantId && !e.tenantId
    ? Object.assign(Object.assign({}, e), { tenantId: t.tenantId })
    : e
}
function aa(s, o, a, c) {
  return p(this, arguments, function* (t, e, n, r, i = {}) {
    return Ov(t, i, () =>
      p(this, null, function* () {
        let u = {},
          l = {}
        r && (e === 'GET' ? (l = r) : (u = { body: JSON.stringify(r) }))
        let d = Yl(Object.assign({ key: t.config.apiKey }, l)).slice(1),
          h = yield t._getAdditionalHeaders()
        return (
          (h['Content-Type'] = 'application/json'),
          t.languageCode && (h['X-Firebase-Locale'] = t.languageCode),
          ea.fetch()(
            Fv(t, t.config.apiHost, n, d),
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
function Ov(t, e, n) {
  return p(this, null, function* () {
    t._canInitEmulator = !1
    let r = Object.assign(Object.assign({}, cS), e)
    try {
      let i = new vd(t),
        s = yield Promise.race([n(), i.promise])
      i.clearNetworkTimeout()
      let o = yield s.json()
      if ('needConfirmation' in o)
        throw Yo(t, 'account-exists-with-different-credential', o)
      if (s.ok && !('errorMessage' in o)) return o
      {
        let a = s.ok ? o.errorMessage : o.error.message,
          [c, u] = a.split(' : ')
        if (c === 'FEDERATED_USER_ID_ALREADY_LINKED')
          throw Yo(t, 'credential-already-in-use', o)
        if (c === 'EMAIL_EXISTS') throw Yo(t, 'email-already-in-use', o)
        if (c === 'USER_DISABLED') throw Yo(t, 'user-disabled', o)
        let l = r[c] || c.toLowerCase().replace(/[_\s]+/g, '-')
        if (u) throw rS(t, l, u)
        Cv(t, l)
      }
    } catch (i) {
      if (i instanceof et) throw i
      Cv(t, 'network-request-failed', { message: String(i) })
    }
  })
}
function Fv(t, e, n, r) {
  let i = `${e}${n}?${r}`
  return t.config.emulator ? aS(t.config, i) : `${t.config.apiScheme}://${i}`
}
var vd = class {
  constructor(e) {
    ;(this.auth = e),
      (this.timer = null),
      (this.promise = new Promise((n, r) => {
        this.timer = setTimeout(
          () => r(bd(this.auth, 'network-request-failed')),
          uS.get()
        )
      }))
  }
  clearNetworkTimeout() {
    clearTimeout(this.timer)
  }
}
function Yo(t, e, n) {
  let r = { appName: t.name }
  n.email && (r.email = n.email),
    n.phoneNumber && (r.phoneNumber = n.phoneNumber)
  let i = bd(t, e, r)
  return (i.customData._tokenResponse = n), i
}
function lS(t, e) {
  return p(this, null, function* () {
    return aa(t, 'POST', '/v1/accounts:delete', e)
  })
}
function dS(t, e) {
  return p(this, null, function* () {
    return aa(t, 'POST', '/v1/accounts:lookup', e)
  })
}
function Li(t) {
  if (t)
    try {
      let e = new Date(Number(t))
      if (!isNaN(e.getTime())) return e.toUTCString()
    } catch {}
}
function Sd(t, e = !1) {
  return p(this, null, function* () {
    let n = rn(t),
      r = yield n.getIdToken(e),
      i = Lv(r)
    H(i && i.exp && i.auth_time && i.iat, n.auth, 'internal-error')
    let s = typeof i.firebase == 'object' ? i.firebase : void 0,
      o = s?.sign_in_provider
    return {
      claims: i,
      token: r,
      authTime: Li(gd(i.auth_time)),
      issuedAtTime: Li(gd(i.iat)),
      expirationTime: Li(gd(i.exp)),
      signInProvider: o || null,
      signInSecondFactor: s?.sign_in_second_factor || null,
    }
  })
}
function gd(t) {
  return Number(t) * 1e3
}
function Lv(t) {
  let [e, n, r] = t.split('.')
  if (e === void 0 || n === void 0 || r === void 0)
    return Jo('JWT malformed, contained fewer than 3 sections'), null
  try {
    let i = Kl(n)
    return i ? JSON.parse(i) : (Jo('Failed to decode base64 JWT payload'), null)
  } catch (i) {
    return Jo('Caught error parsing JWT payload as JSON', i?.toString()), null
  }
}
function hS(t) {
  let e = Lv(t)
  return (
    H(e, 'internal-error'),
    H(typeof e.exp < 'u', 'internal-error'),
    H(typeof e.iat < 'u', 'internal-error'),
    Number(e.exp) - Number(e.iat)
  )
}
function _d(t, e, n = !1) {
  return p(this, null, function* () {
    if (n) return e
    try {
      return yield e
    } catch (r) {
      throw (
        (r instanceof et &&
          fS(r) &&
          t.auth.currentUser === t &&
          (yield t.auth.signOut()),
        r)
      )
    }
  })
}
function fS({ code: t }) {
  return t === 'auth/user-disabled' || t === 'auth/user-token-expired'
}
var Id = class {
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
var ta = class {
  constructor(e, n) {
    ;(this.createdAt = e), (this.lastLoginAt = n), this._initializeTime()
  }
  _initializeTime() {
    ;(this.lastSignInTime = Li(this.lastLoginAt)),
      (this.creationTime = Li(this.createdAt))
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
function na(t) {
  return p(this, null, function* () {
    var e
    let n = t.auth,
      r = yield t.getIdToken(),
      i = yield _d(t, dS(n, { idToken: r }))
    H(i?.users.length, n, 'internal-error')
    let s = i.users[0]
    t._notifyReloadListener(s)
    let o =
        !((e = s.providerUserInfo) === null || e === void 0) && e.length
          ? mS(s.providerUserInfo)
          : [],
      a = pS(t.providerData, o),
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
        metadata: new ta(s.createdAt, s.lastLoginAt),
        isAnonymous: l,
      }
    Object.assign(t, d)
  })
}
function xd(t) {
  return p(this, null, function* () {
    let e = rn(t)
    yield na(e),
      yield e.auth._persistUserIfCurrent(e),
      e.auth._notifyListenersIfCurrent(e)
  })
}
function pS(t, e) {
  return [
    ...t.filter((r) => !e.some((i) => i.providerId === r.providerId)),
    ...e,
  ]
}
function mS(t) {
  return t.map((e) => {
    var { providerId: n } = e,
      r = Oc(e, ['providerId'])
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
function gS(t, e) {
  return p(this, null, function* () {
    let n = yield Ov(t, {}, () =>
      p(this, null, function* () {
        let r = Yl({ grant_type: 'refresh_token', refresh_token: e }).slice(1),
          { tokenApiHost: i, apiKey: s } = t.config,
          o = Fv(t, i, '/v1/token', `key=${s}`),
          a = yield t._getAdditionalHeaders()
        return (
          (a['Content-Type'] = 'application/x-www-form-urlencoded'),
          ea.fetch()(o, { method: 'POST', headers: a, body: r })
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
function yS(t, e) {
  return p(this, null, function* () {
    return aa(t, 'POST', '/v2/accounts:revokeToken', kv(t, e))
  })
}
var ra = class t {
  constructor() {
    ;(this.refreshToken = null),
      (this.accessToken = null),
      (this.expirationTime = null)
  }
  get isExpired() {
    return !this.expirationTime || Date.now() > this.expirationTime - 3e4
  }
  updateFromServerResponse(e) {
    H(e.idToken, 'internal-error'),
      H(typeof e.idToken < 'u', 'internal-error'),
      H(typeof e.refreshToken < 'u', 'internal-error')
    let n =
      'expiresIn' in e && typeof e.expiresIn < 'u'
        ? Number(e.expiresIn)
        : hS(e.idToken)
    this.updateTokensAndExpiration(e.idToken, e.refreshToken, n)
  }
  getToken(e, n = !1) {
    return p(this, null, function* () {
      return (
        H(!this.accessToken || this.refreshToken, e, 'user-token-expired'),
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
      let { accessToken: r, refreshToken: i, expiresIn: s } = yield gS(e, n)
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
        (H(typeof r == 'string', 'internal-error', { appName: e }),
        (o.refreshToken = r)),
      i &&
        (H(typeof i == 'string', 'internal-error', { appName: e }),
        (o.accessToken = i)),
      s &&
        (H(typeof s == 'number', 'internal-error', { appName: e }),
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
    return Fi('not implemented')
  }
}
function cn(t, e) {
  H(typeof t == 'string' || typeof t > 'u', 'internal-error', { appName: e })
}
var ia = class t {
  constructor(e) {
    var { uid: n, auth: r, stsTokenManager: i } = e,
      s = Oc(e, ['uid', 'auth', 'stsTokenManager'])
    ;(this.providerId = 'firebase'),
      (this.proactiveRefresh = new Id(this)),
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
      (this.metadata = new ta(s.createdAt || void 0, s.lastLoginAt || void 0))
  }
  getIdToken(e) {
    return p(this, null, function* () {
      let n = yield _d(this, this.stsTokenManager.getToken(this.auth, e))
      return (
        H(n, this.auth, 'internal-error'),
        this.accessToken !== n &&
          ((this.accessToken = n),
          yield this.auth._persistUserIfCurrent(this),
          this.auth._notifyListenersIfCurrent(this)),
        n
      )
    })
  }
  getIdTokenResult(e) {
    return Sd(this, e)
  }
  reload() {
    return xd(this)
  }
  _assign(e) {
    this !== e &&
      (H(this.uid === e.uid, this.auth, 'internal-error'),
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
    H(!this.reloadListener, this.auth, 'internal-error'),
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
        n && (yield na(this)),
        yield this.auth._persistUserIfCurrent(this),
        r && this.auth._notifyListenersIfCurrent(this)
    })
  }
  delete() {
    return p(this, null, function* () {
      let e = yield this.getIdToken()
      return (
        yield _d(this, lS(this.auth, { idToken: e })),
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
      g = (o = n.photoURL) !== null && o !== void 0 ? o : void 0,
      I = (a = n.tenantId) !== null && a !== void 0 ? a : void 0,
      w = (c = n._redirectEventId) !== null && c !== void 0 ? c : void 0,
      D = (u = n.createdAt) !== null && u !== void 0 ? u : void 0,
      j = (l = n.lastLoginAt) !== null && l !== void 0 ? l : void 0,
      {
        uid: K,
        emailVerified: z,
        isAnonymous: re,
        providerData: G,
        stsTokenManager: Be,
      } = n
    H(K && Be, e, 'internal-error')
    let Gt = ra.fromJSON(this.name, Be)
    H(typeof K == 'string', e, 'internal-error'),
      cn(d, e.name),
      cn(h, e.name),
      H(typeof z == 'boolean', e, 'internal-error'),
      H(typeof re == 'boolean', e, 'internal-error'),
      cn(f, e.name),
      cn(g, e.name),
      cn(I, e.name),
      cn(w, e.name),
      cn(D, e.name),
      cn(j, e.name)
    let mn = new t({
      uid: K,
      auth: e,
      email: h,
      emailVerified: z,
      displayName: d,
      isAnonymous: re,
      photoURL: g,
      phoneNumber: f,
      tenantId: I,
      stsTokenManager: Gt,
      createdAt: D,
      lastLoginAt: j,
    })
    return (
      G &&
        Array.isArray(G) &&
        (mn.providerData = G.map((xs) => Object.assign({}, xs))),
      w && (mn._redirectEventId = w),
      mn
    )
  }
  static _fromIdTokenResponse(e, n, r = !1) {
    return p(this, null, function* () {
      let i = new ra()
      i.updateFromServerResponse(n)
      let s = new t({
        uid: n.localId,
        auth: e,
        stsTokenManager: i,
        isAnonymous: r,
      })
      return yield na(s), s
    })
  }
}
var Av = new Map()
function Ln(t) {
  Xo(t instanceof Function, 'Expected a class definition')
  let e = Av.get(t)
  return e
    ? (Xo(e instanceof t, 'Instance stored in cache mismatched with class'), e)
    : ((e = new t()), Av.set(t, e), e)
}
var vS = (() => {
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
  wd = vS
function yd(t, e, n) {
  return `firebase:${t}:${e}:${n}`
}
var sa = class t {
  constructor(e, n, r) {
    ;(this.persistence = e), (this.auth = n), (this.userKey = r)
    let { config: i, name: s } = this.auth
    ;(this.fullUserKey = yd(this.userKey, i.apiKey, s)),
      (this.fullPersistenceKey = yd('persistence', i.apiKey, s)),
      (this.boundEventHandler = n._onStorageEvent.bind(n)),
      this.persistence._addListener(this.fullUserKey, this.boundEventHandler)
  }
  setCurrentUser(e) {
    return this.persistence._set(this.fullUserKey, e.toJSON())
  }
  getCurrentUser() {
    return p(this, null, function* () {
      let e = yield this.persistence._get(this.fullUserKey)
      return e ? ia._fromJSON(this.auth, e) : null
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
      if (!n.length) return new t(Ln(wd), e, r)
      let i = (yield Promise.all(
          n.map((u) =>
            p(this, null, function* () {
              if (yield u._isAvailable()) return u
            })
          )
        )).filter((u) => u),
        s = i[0] || Ln(wd),
        o = yd(r, e.config.apiKey, e.name),
        a = null
      for (let u of n)
        try {
          let l = yield u._get(o)
          if (l) {
            let d = ia._fromJSON(e, l)
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
function Sv(t) {
  let e = t.toLowerCase()
  if (e.includes('opera/') || e.includes('opr/') || e.includes('opios/'))
    return 'Opera'
  if (ES(e)) return 'IEMobile'
  if (e.includes('msie') || e.includes('trident/')) return 'IE'
  if (e.includes('edge/')) return 'Edge'
  if (_S(e)) return 'Firefox'
  if (e.includes('silk/')) return 'Silk'
  if (DS(e)) return 'Blackberry'
  if (CS(e)) return 'Webos'
  if (IS(e)) return 'Safari'
  if ((e.includes('chrome/') || wS(e)) && !e.includes('edge/')) return 'Chrome'
  if (TS(e)) return 'Android'
  {
    let n = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,
      r = t.match(n)
    if (r?.length === 2) return r[1]
  }
  return 'Other'
}
function _S(t = be()) {
  return /firefox\//i.test(t)
}
function IS(t = be()) {
  let e = t.toLowerCase()
  return (
    e.includes('safari/') &&
    !e.includes('chrome/') &&
    !e.includes('crios/') &&
    !e.includes('android')
  )
}
function wS(t = be()) {
  return /crios\//i.test(t)
}
function ES(t = be()) {
  return /iemobile/i.test(t)
}
function TS(t = be()) {
  return /android/i.test(t)
}
function DS(t = be()) {
  return /blackberry/i.test(t)
}
function CS(t = be()) {
  return /webos/i.test(t)
}
function Vv(t, e = []) {
  let n
  switch (t) {
    case 'Browser':
      n = Sv(be())
      break
    case 'Worker':
      n = `${Sv(be())}-${t}`
      break
    default:
      n = t
  }
  let r = e.length ? e.join(',') : 'FirebaseCore-web'
  return `${n}/JsCore/${Er}/${r}`
}
var Ed = class {
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
function bS(n) {
  return p(this, arguments, function* (t, e = {}) {
    return aa(t, 'GET', '/v2/passwordPolicy', kv(t, e))
  })
}
var AS = 6,
  Td = class {
    constructor(e) {
      var n, r, i, s
      let o = e.customStrengthOptions
      ;(this.customStrengthOptions = {}),
        (this.customStrengthOptions.minPasswordLength =
          (n = o.minPasswordLength) !== null && n !== void 0 ? n : AS),
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
var Dd = class {
  constructor(e, n, r, i) {
    ;(this.app = e),
      (this.heartbeatServiceProvider = n),
      (this.appCheckServiceProvider = r),
      (this.config = i),
      (this.currentUser = null),
      (this.emulatorConfig = null),
      (this.operations = Promise.resolve()),
      (this.authStateSubscription = new oa(this)),
      (this.idTokenSubscription = new oa(this)),
      (this.beforeStateQueue = new Ed(this)),
      (this.redirectUser = null),
      (this.isProactiveRefreshEnabled = !1),
      (this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1),
      (this._canInitEmulator = !0),
      (this._isInitialized = !1),
      (this._deleted = !1),
      (this._initializationPromise = null),
      (this._popupRedirectResolver = null),
      (this._errorFactory = Pv),
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
      n && (this._popupRedirectResolver = Ln(n)),
      (this._initializationPromise = this.queue(() =>
        p(this, null, function* () {
          var r, i
          if (
            !this._deleted &&
            ((this.persistenceManager = yield sa.create(this, e)),
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
        H(this._popupRedirectResolver, this, 'argument-error'),
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
        yield na(e)
      } catch (n) {
        if (n?.code !== 'auth/network-request-failed')
          return this.directlySetCurrentUser(null)
      }
      return this.directlySetCurrentUser(e)
    })
  }
  useDeviceLanguage() {
    this.languageCode = oS()
  }
  _delete() {
    return p(this, null, function* () {
      this._deleted = !0
    })
  }
  updateCurrentUser(e) {
    return p(this, null, function* () {
      let n = e ? rn(e) : null
      return (
        n &&
          H(
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
          e && H(this.tenantId === e.tenantId, this, 'tenant-id-mismatch'),
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
        yield this.assertedPersistence.setPersistence(Ln(e))
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
      let e = yield bS(this),
        n = new Td(e)
      this.tenantId === null
        ? (this._projectPasswordPolicy = n)
        : (this._tenantPasswordPolicies[this.tenantId] = n)
    })
  }
  _getPersistence() {
    return this.assertedPersistence.persistence.type
  }
  _updateErrorMap(e) {
    this._errorFactory = new Bt('auth', 'Firebase', e())
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
        this.tenantId != null && (r.tenantId = this.tenantId), yield yS(this, r)
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
        let n = (e && Ln(e)) || this._popupRedirectResolver
        H(n, this, 'argument-error'),
          (this.redirectPersistenceManager = yield sa.create(
            this,
            [Ln(n._redirectPersistence)],
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
      (H(a, this, 'internal-error'),
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
      H(this.persistenceManager, this, 'internal-error'),
      this.persistenceManager
    )
  }
  _logFramework(e) {
    !e ||
      this.frameworks.includes(e) ||
      (this.frameworks.push(e),
      this.frameworks.sort(),
      (this.clientVersion = Vv(
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
        n?.error && nS(`Error while retrieving App Check token: ${n.error}`),
        n?.token
      )
    })
  }
}
function SS(t) {
  return rn(t)
}
var oa = class {
  constructor(e) {
    ;(this.auth = e),
      (this.observer = null),
      (this.addObserver = uv((n) => (this.observer = n)))
  }
  get next() {
    return (
      H(this.observer, this.auth, 'internal-error'),
      this.observer.next.bind(this.observer)
    )
  }
}
var xS = {
  loadJS() {
    return p(this, null, function* () {
      throw new Error('Unable to load external scripts')
    })
  },
  recaptchaV2Script: '',
  recaptchaEnterpriseScript: '',
  gapiScript: '',
}
function NS(t) {
  xS = t
}
function RS(t) {
  return `__${t}${Math.floor(Math.random() * 1e6)}`
}
function MS(t, e) {
  let n = e?.persistence || [],
    r = (Array.isArray(n) ? n : [n]).map(Ln)
  e?.errorMap && t._updateErrorMap(e.errorMap),
    t._initializeWithPersistence(r, e?.popupRedirectResolver)
}
var LL = RS('rcb'),
  VL = new Vn(3e4, 6e4)
var UL = new Vn(2e3, 1e4)
var jL = 10 * 60 * 1e3
var BL = new Vn(3e4, 6e4)
var $L = new Vn(5e3, 15e3)
var HL = encodeURIComponent('fac')
var xv = '@firebase/auth',
  Nv = '1.6.1'
var Cd = class {
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
    H(this.auth._initializationPromise, 'dependent-sdk-initialized-before-auth')
  }
  updateProactiveRefresh() {
    this.internalListeners.size > 0
      ? this.auth._startProactiveRefresh()
      : this.auth._stopProactiveRefresh()
  }
}
function PS(t) {
  switch (t) {
    case 'Node':
      return 'node'
    case 'ReactNative':
      return 'rn'
    case 'Worker':
      return 'webworker'
    case 'Cordova':
      return 'cordova'
    case 'WebExtension':
      return 'web-extension'
    default:
      return
  }
}
function kS(t) {
  an(
    new tt(
      'auth',
      (e, { options: n }) => {
        let r = e.getProvider('app').getImmediate(),
          i = e.getProvider('heartbeat'),
          s = e.getProvider('app-check-internal'),
          { apiKey: o, authDomain: a } = r.options
        H(o && !o.includes(':'), 'invalid-api-key', { appName: r.name })
        let c = {
            apiKey: o,
            authDomain: a,
            clientPlatform: t,
            apiHost: 'identitytoolkit.googleapis.com',
            tokenApiHost: 'securetoken.googleapis.com',
            apiScheme: 'https',
            sdkClientVersion: Vv(t),
          },
          u = new Dd(r, i, s, c)
        return MS(u, n), u
      },
      'PUBLIC'
    )
      .setInstantiationMode('EXPLICIT')
      .setInstanceCreatedCallback((e, n, r) => {
        e.getProvider('auth-internal').initialize()
      })
  ),
    an(
      new tt(
        'auth-internal',
        (e) => {
          let n = SS(e.getProvider('auth').getImmediate())
          return ((r) => new Cd(r))(n)
        },
        'PRIVATE'
      ).setInstantiationMode('EXPLICIT')
    ),
    ge(xv, Nv, PS(t)),
    ge(xv, Nv, 'esm2017')
}
var OS = 5 * 60,
  qL = nv('authIdTokenMaxAge') || OS
function FS() {
  var t, e
  return (e =
    (t = document.getElementsByTagName('head')) === null || t === void 0
      ? void 0
      : t[0]) !== null && e !== void 0
    ? e
    : document
}
NS({
  loadJS(t) {
    return new Promise((e, n) => {
      let r = document.createElement('script')
      r.setAttribute('src', t),
        (r.onload = e),
        (r.onerror = (i) => {
          let s = bd('internal-error')
          ;(s.customData = i), n(s)
        }),
        (r.type = 'text/javascript'),
        (r.charset = 'UTF-8'),
        FS().appendChild(r)
    })
  },
  gapiScript: 'https://apis.google.com/js/api.js',
  recaptchaV2Script: 'https://www.google.com/recaptcha/api.js',
  recaptchaEnterpriseScript:
    'https://www.google.com/recaptcha/enterprise.js?render=',
})
kS('Browser')
var Ox = 'auth'
var ca = class {
  constructor() {
    return Pi(Ox)
  }
}
var Fx =
    typeof globalThis < 'u'
      ? globalThis
      : typeof window < 'u'
        ? window
        : typeof global < 'u'
          ? global
          : typeof self < 'u'
            ? self
            : {},
  ft = {},
  v,
  Jd = Jd || {},
  C = Fx || self
function Ea(t) {
  var e = typeof t
  return (
    (e = e != 'object' ? e : t ? (Array.isArray(t) ? 'array' : e) : 'null'),
    e == 'array' || (e == 'object' && typeof t.length == 'number')
  )
}
function Ji(t) {
  var e = typeof t
  return (e == 'object' && t != null) || e == 'function'
}
function Lx(t) {
  return (
    (Object.prototype.hasOwnProperty.call(t, Nd) && t[Nd]) || (t[Nd] = ++Vx)
  )
}
var Nd = 'closure_uid_' + ((1e9 * Math.random()) >>> 0),
  Vx = 0
function Ux(t, e, n) {
  return t.call.apply(t.bind, arguments)
}
function jx(t, e, n) {
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
function Ae(t, e, n) {
  return (
    Function.prototype.bind &&
    Function.prototype.bind.toString().indexOf('native code') != -1
      ? (Ae = Ux)
      : (Ae = jx),
    Ae.apply(null, arguments)
  )
}
function ua(t, e) {
  var n = Array.prototype.slice.call(arguments, 1)
  return function () {
    var r = n.slice()
    return r.push.apply(r, arguments), t.apply(this, r)
  }
}
function ve(t, e) {
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
function un() {
  ;(this.s = this.s), (this.o = this.o)
}
var Bx = 0
un.prototype.s = !1
un.prototype.sa = function () {
  !this.s && ((this.s = !0), this.N(), Bx != 0) && Lx(this)
}
un.prototype.N = function () {
  if (this.o) for (; this.o.length; ) this.o.shift()()
}
var Jv = Array.prototype.indexOf
  ? function (t, e) {
      return Array.prototype.indexOf.call(t, e, void 0)
    }
  : function (t, e) {
      if (typeof t == 'string')
        return typeof e != 'string' || e.length != 1 ? -1 : t.indexOf(e, 0)
      for (let n = 0; n < t.length; n++) if (n in t && t[n] === e) return n
      return -1
    }
function Zd(t) {
  let e = t.length
  if (0 < e) {
    let n = Array(e)
    for (let r = 0; r < e; r++) n[r] = t[r]
    return n
  }
  return []
}
function Uv(t, e) {
  for (let n = 1; n < arguments.length; n++) {
    let r = arguments[n]
    if (Ea(r)) {
      let i = t.length || 0,
        s = r.length || 0
      t.length = i + s
      for (let o = 0; o < s; o++) t[i + o] = r[o]
    } else t.push(r)
  }
}
function Se(t, e) {
  ;(this.type = t), (this.g = this.target = e), (this.defaultPrevented = !1)
}
Se.prototype.h = function () {
  this.defaultPrevented = !0
}
var $x = (function () {
  if (!C.addEventListener || !Object.defineProperty) return !1
  var t = !1,
    e = Object.defineProperty({}, 'passive', {
      get: function () {
        t = !0
      },
    })
  try {
    let n = () => {}
    C.addEventListener('test', n, e), C.removeEventListener('test', n, e)
  } catch {}
  return t
})()
function Hi(t) {
  return /^[\s\xa0]*$/.test(t)
}
function Ta() {
  var t = C.navigator
  return t && (t = t.userAgent) ? t : ''
}
function Dt(t) {
  return Ta().indexOf(t) != -1
}
function Xd(t) {
  return Xd[' '](t), t
}
Xd[' '] = function () {}
function Hx(t, e) {
  var n = RN
  return Object.prototype.hasOwnProperty.call(n, t) ? n[t] : (n[t] = e(t))
}
var qx = Dt('Opera'),
  Sr = Dt('Trident') || Dt('MSIE'),
  Zv = Dt('Edge'),
  Od = Zv || Sr,
  Xv =
    Dt('Gecko') &&
    !(Ta().toLowerCase().indexOf('webkit') != -1 && !Dt('Edge')) &&
    !(Dt('Trident') || Dt('MSIE')) &&
    !Dt('Edge'),
  zx = Ta().toLowerCase().indexOf('webkit') != -1 && !Dt('Edge')
function e_() {
  var t = C.document
  return t ? t.documentMode : void 0
}
var Fd
e: {
  if (
    ((la = ''),
    (da = (function () {
      var t = Ta()
      if (Xv) return /rv:([^\);]+)(\)|;)/.exec(t)
      if (Zv) return /Edge\/([\d\.]+)/.exec(t)
      if (Sr) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(t)
      if (zx) return /WebKit\/(\S+)/.exec(t)
      if (qx) return /(?:Version)[ \/]?(\S+)/.exec(t)
    })()),
    da && (la = da ? da[1] : ''),
    Sr && ((ha = e_()), ha != null && ha > parseFloat(la)))
  ) {
    Fd = String(ha)
    break e
  }
  Fd = la
}
var la, da, ha, Ld
C.document && Sr
  ? ((Rd = e_()), (Ld = Rd || parseInt(Fd, 10) || void 0))
  : (Ld = void 0)
var Rd,
  Gx = Ld
function qi(t, e) {
  if (
    (Se.call(this, t ? t.type : ''),
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
      if (Xv) {
        e: {
          try {
            Xd(e.nodeName)
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
          : Wx[t.pointerType] || ''),
      (this.state = t.state),
      (this.i = t),
      t.defaultPrevented && qi.$.h.call(this)
  }
}
ve(qi, Se)
var Wx = { 2: 'touch', 3: 'pen', 4: 'mouse' }
qi.prototype.h = function () {
  qi.$.h.call(this)
  var t = this.i
  t.preventDefault ? t.preventDefault() : (t.returnValue = !1)
}
var Zi = 'closure_listenable_' + ((1e6 * Math.random()) | 0),
  Kx = 0
function Qx(t, e, n, r, i) {
  ;(this.listener = t),
    (this.proxy = null),
    (this.src = e),
    (this.type = n),
    (this.capture = !!r),
    (this.la = i),
    (this.key = ++Kx),
    (this.fa = this.ia = !1)
}
function Da(t) {
  ;(t.fa = !0),
    (t.listener = null),
    (t.proxy = null),
    (t.src = null),
    (t.la = null)
}
function eh(t, e, n) {
  for (let r in t) e.call(n, t[r], r, t)
}
function Yx(t, e) {
  for (let n in t) e.call(void 0, t[n], n, t)
}
function t_(t) {
  let e = {}
  for (let n in t) e[n] = t[n]
  return e
}
var jv =
  'constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf'.split(
    ' '
  )
function n_(t, e) {
  let n, r
  for (let i = 1; i < arguments.length; i++) {
    r = arguments[i]
    for (n in r) t[n] = r[n]
    for (let s = 0; s < jv.length; s++)
      (n = jv[s]), Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
  }
}
function Ca(t) {
  ;(this.src = t), (this.g = {}), (this.h = 0)
}
Ca.prototype.add = function (t, e, n, r, i) {
  var s = t.toString()
  ;(t = this.g[s]), t || ((t = this.g[s] = []), this.h++)
  var o = Ud(t, e, r, i)
  return (
    -1 < o
      ? ((e = t[o]), n || (e.ia = !1))
      : ((e = new Qx(e, this.src, s, !!r, i)), (e.ia = n), t.push(e)),
    e
  )
}
function Vd(t, e) {
  var n = e.type
  if (n in t.g) {
    var r = t.g[n],
      i = Jv(r, e),
      s
    ;(s = 0 <= i) && Array.prototype.splice.call(r, i, 1),
      s && (Da(e), t.g[n].length == 0 && (delete t.g[n], t.h--))
  }
}
function Ud(t, e, n, r) {
  for (var i = 0; i < t.length; ++i) {
    var s = t[i]
    if (!s.fa && s.listener == e && s.capture == !!n && s.la == r) return i
  }
  return -1
}
var th = 'closure_lm_' + ((1e6 * Math.random()) | 0),
  Md = {}
function r_(t, e, n, r, i) {
  if (r && r.once) return s_(t, e, n, r, i)
  if (Array.isArray(e)) {
    for (var s = 0; s < e.length; s++) r_(t, e[s], n, r, i)
    return null
  }
  return (
    (n = ih(n)),
    t && t[Zi] ? t.O(e, n, Ji(r) ? !!r.capture : !!r, i) : i_(t, e, n, !1, r, i)
  )
}
function i_(t, e, n, r, i, s) {
  if (!e) throw Error('Invalid event type')
  var o = Ji(i) ? !!i.capture : !!i,
    a = rh(t)
  if ((a || (t[th] = a = new Ca(t)), (n = a.add(e, n, r, o, s)), n.proxy))
    return n
  if (
    ((r = Jx()),
    (n.proxy = r),
    (r.src = t),
    (r.listener = n),
    t.addEventListener)
  )
    $x || (i = o),
      i === void 0 && (i = !1),
      t.addEventListener(e.toString(), r, i)
  else if (t.attachEvent) t.attachEvent(a_(e.toString()), r)
  else if (t.addListener && t.removeListener) t.addListener(r)
  else throw Error('addEventListener and attachEvent are unavailable.')
  return n
}
function Jx() {
  function t(n) {
    return e.call(t.src, t.listener, n)
  }
  let e = Zx
  return t
}
function s_(t, e, n, r, i) {
  if (Array.isArray(e)) {
    for (var s = 0; s < e.length; s++) s_(t, e[s], n, r, i)
    return null
  }
  return (
    (n = ih(n)),
    t && t[Zi] ? t.P(e, n, Ji(r) ? !!r.capture : !!r, i) : i_(t, e, n, !0, r, i)
  )
}
function o_(t, e, n, r, i) {
  if (Array.isArray(e)) for (var s = 0; s < e.length; s++) o_(t, e[s], n, r, i)
  else
    (r = Ji(r) ? !!r.capture : !!r),
      (n = ih(n)),
      t && t[Zi]
        ? ((t = t.i),
          (e = String(e).toString()),
          e in t.g &&
            ((s = t.g[e]),
            (n = Ud(s, n, r, i)),
            -1 < n &&
              (Da(s[n]),
              Array.prototype.splice.call(s, n, 1),
              s.length == 0 && (delete t.g[e], t.h--))))
        : t &&
          (t = rh(t)) &&
          ((e = t.g[e.toString()]),
          (t = -1),
          e && (t = Ud(e, n, r, i)),
          (n = -1 < t ? e[t] : null) && nh(n))
}
function nh(t) {
  if (typeof t != 'number' && t && !t.fa) {
    var e = t.src
    if (e && e[Zi]) Vd(e.i, t)
    else {
      var n = t.type,
        r = t.proxy
      e.removeEventListener
        ? e.removeEventListener(n, r, t.capture)
        : e.detachEvent
          ? e.detachEvent(a_(n), r)
          : e.addListener && e.removeListener && e.removeListener(r),
        (n = rh(e))
          ? (Vd(n, t), n.h == 0 && ((n.src = null), (e[th] = null)))
          : Da(t)
    }
  }
}
function a_(t) {
  return t in Md ? Md[t] : (Md[t] = 'on' + t)
}
function Zx(t, e) {
  if (t.fa) t = !0
  else {
    e = new qi(e, this)
    var n = t.listener,
      r = t.la || t.src
    t.ia && nh(t), (t = n.call(r, e))
  }
  return t
}
function rh(t) {
  return (t = t[th]), t instanceof Ca ? t : null
}
var Pd = '__closure_events_fn_' + ((1e9 * Math.random()) >>> 0)
function ih(t) {
  return typeof t == 'function'
    ? t
    : (t[Pd] ||
        (t[Pd] = function (e) {
          return t.handleEvent(e)
        }),
      t[Pd])
}
function ye() {
  un.call(this), (this.i = new Ca(this)), (this.S = this), (this.J = null)
}
ve(ye, un)
ye.prototype[Zi] = !0
ye.prototype.removeEventListener = function (t, e, n, r) {
  o_(this, t, e, n, r)
}
function Ee(t, e) {
  var n,
    r = t.J
  if (r) for (n = []; r; r = r.J) n.push(r)
  if (((t = t.S), (r = e.type || e), typeof e == 'string')) e = new Se(e, t)
  else if (e instanceof Se) e.target = e.target || t
  else {
    var i = e
    ;(e = new Se(r, t)), n_(e, i)
  }
  if (((i = !0), n))
    for (var s = n.length - 1; 0 <= s; s--) {
      var o = (e.g = n[s])
      i = fa(o, r, !0, e) && i
    }
  if (
    ((o = e.g = t), (i = fa(o, r, !0, e) && i), (i = fa(o, r, !1, e) && i), n)
  )
    for (s = 0; s < n.length; s++) (o = e.g = n[s]), (i = fa(o, r, !1, e) && i)
}
ye.prototype.N = function () {
  if ((ye.$.N.call(this), this.i)) {
    var t = this.i,
      e
    for (e in t.g) {
      for (var n = t.g[e], r = 0; r < n.length; r++) Da(n[r])
      delete t.g[e], t.h--
    }
  }
  this.J = null
}
ye.prototype.O = function (t, e, n, r) {
  return this.i.add(String(t), e, !1, n, r)
}
ye.prototype.P = function (t, e, n, r) {
  return this.i.add(String(t), e, !0, n, r)
}
function fa(t, e, n, r) {
  if (((e = t.i.g[String(e)]), !e)) return !0
  e = e.concat()
  for (var i = !0, s = 0; s < e.length; ++s) {
    var o = e[s]
    if (o && !o.fa && o.capture == n) {
      var a = o.listener,
        c = o.la || o.src
      o.ia && Vd(t.i, o), (i = a.call(c, r) !== !1 && i)
    }
  }
  return i && !r.defaultPrevented
}
var sh = C.JSON.stringify,
  jd = class {
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
function Xx() {
  var t = oh
  let e = null
  return (
    t.g && ((e = t.g), (t.g = t.g.next), t.g || (t.h = null), (e.next = null)),
    e
  )
}
var Bd = class {
    constructor() {
      this.h = this.g = null
    }
    add(e, n) {
      let r = c_.get()
      r.set(e, n), this.h ? (this.h.next = r) : (this.g = r), (this.h = r)
    }
  },
  c_ = new jd(
    () => new $d(),
    (t) => t.reset()
  ),
  $d = class {
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
function eN(t) {
  var e = 1
  t = t.split(':')
  let n = []
  for (; 0 < e && t.length; ) n.push(t.shift()), e--
  return t.length && n.push(t.join(':')), n
}
function tN(t) {
  C.setTimeout(() => {
    throw t
  }, 0)
}
var zi,
  Gi = !1,
  oh = new Bd(),
  u_ = () => {
    let t = C.Promise.resolve(void 0)
    zi = () => {
      t.then(nN)
    }
  },
  nN = () => {
    for (var t; (t = Xx()); ) {
      try {
        t.h.call(t.g)
      } catch (n) {
        tN(n)
      }
      var e = c_
      e.j(t), 100 > e.h && (e.h++, (t.next = e.g), (e.g = t))
    }
    Gi = !1
  }
function ba(t, e) {
  ye.call(this),
    (this.h = t || 1),
    (this.g = e || C),
    (this.j = Ae(this.qb, this)),
    (this.l = Date.now())
}
ve(ba, ye)
v = ba.prototype
v.ga = !1
v.T = null
v.qb = function () {
  if (this.ga) {
    var t = Date.now() - this.l
    0 < t && t < 0.8 * this.h
      ? (this.T = this.g.setTimeout(this.j, this.h - t))
      : (this.T && (this.g.clearTimeout(this.T), (this.T = null)),
        Ee(this, 'tick'),
        this.ga && (ah(this), this.start()))
  }
}
v.start = function () {
  ;(this.ga = !0),
    this.T ||
      ((this.T = this.g.setTimeout(this.j, this.h)), (this.l = Date.now()))
}
function ah(t) {
  ;(t.ga = !1), t.T && (t.g.clearTimeout(t.T), (t.T = null))
}
v.N = function () {
  ba.$.N.call(this), ah(this), delete this.g
}
function ch(t, e, n) {
  if (typeof t == 'function') n && (t = Ae(t, n))
  else if (t && typeof t.handleEvent == 'function') t = Ae(t.handleEvent, t)
  else throw Error('Invalid listener argument')
  return 2147483647 < Number(e) ? -1 : C.setTimeout(t, e || 0)
}
function l_(t) {
  t.g = ch(() => {
    ;(t.g = null), t.i && ((t.i = !1), l_(t))
  }, t.j)
  let e = t.h
  ;(t.h = null), t.m.apply(null, e)
}
var Hd = class extends un {
  constructor(e, n) {
    super(),
      (this.m = e),
      (this.j = n),
      (this.h = null),
      (this.i = !1),
      (this.g = null)
  }
  l(e) {
    ;(this.h = arguments), this.g ? (this.i = !0) : l_(this)
  }
  N() {
    super.N(),
      this.g &&
        (C.clearTimeout(this.g),
        (this.g = null),
        (this.i = !1),
        (this.h = null))
  }
}
function Wi(t) {
  un.call(this), (this.h = t), (this.g = {})
}
ve(Wi, un)
var Bv = []
function d_(t, e, n, r) {
  Array.isArray(n) || (n && (Bv[0] = n.toString()), (n = Bv))
  for (var i = 0; i < n.length; i++) {
    var s = r_(e, n[i], r || t.handleEvent, !1, t.h || t)
    if (!s) break
    t.g[s.key] = s
  }
}
function h_(t) {
  eh(
    t.g,
    function (e, n) {
      this.g.hasOwnProperty(n) && nh(e)
    },
    t
  ),
    (t.g = {})
}
Wi.prototype.N = function () {
  Wi.$.N.call(this), h_(this)
}
Wi.prototype.handleEvent = function () {
  throw Error('EventHandler.handleEvent not implemented')
}
function Aa() {
  this.g = !0
}
Aa.prototype.Ea = function () {
  this.g = !1
}
function rN(t, e, n, r, i, s) {
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
function iN(t, e, n, r, i, s, o) {
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
function br(t, e, n, r) {
  t.info(function () {
    return 'XMLHTTP TEXT (' + e + '): ' + oN(t, n) + (r ? ' ' + r : '')
  })
}
function sN(t, e) {
  t.info(function () {
    return 'TIMEOUT: ' + e
  })
}
Aa.prototype.info = function () {}
function oN(t, e) {
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
    return sh(n)
  } catch {
    return e
  }
}
var $n = {},
  $v = null
function Sa() {
  return ($v = $v || new ye())
}
$n.Ta = 'serverreachability'
function f_(t) {
  Se.call(this, $n.Ta, t)
}
ve(f_, Se)
function Ki(t) {
  let e = Sa()
  Ee(e, new f_(e))
}
$n.STAT_EVENT = 'statevent'
function p_(t, e) {
  Se.call(this, $n.STAT_EVENT, t), (this.stat = e)
}
ve(p_, Se)
function Oe(t) {
  let e = Sa()
  Ee(e, new p_(e, t))
}
$n.Ua = 'timingevent'
function m_(t, e) {
  Se.call(this, $n.Ua, t), (this.size = e)
}
ve(m_, Se)
function Xi(t, e) {
  if (typeof t != 'function')
    throw Error('Fn must not be null and must be a function')
  return C.setTimeout(function () {
    t()
  }, e)
}
var xa = {
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
  g_ = {
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
function uh() {}
uh.prototype.h = null
function Hv(t) {
  return t.h || (t.h = t.i())
}
function y_() {}
var es = { OPEN: 'a', vb: 'b', Ra: 'c', Hb: 'd' }
function lh() {
  Se.call(this, 'd')
}
ve(lh, Se)
function dh() {
  Se.call(this, 'c')
}
ve(dh, Se)
var qd
function Na() {}
ve(Na, uh)
Na.prototype.g = function () {
  return new XMLHttpRequest()
}
Na.prototype.i = function () {
  return {}
}
qd = new Na()
function ts(t, e, n, r) {
  ;(this.l = t),
    (this.j = e),
    (this.m = n),
    (this.W = r || 1),
    (this.U = new Wi(this)),
    (this.P = aN),
    (t = Od ? 125 : void 0),
    (this.V = new ba(t)),
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
    (this.h = new v_())
}
function v_() {
  ;(this.i = null), (this.g = ''), (this.h = !1)
}
var aN = 45e3,
  __ = {},
  zd = {}
v = ts.prototype
v.setTimeout = function (t) {
  this.P = t
}
function Gd(t, e, n) {
  ;(t.L = 1), (t.A = Ma(Ht(e))), (t.u = n), (t.S = !0), I_(t, null)
}
function I_(t, e) {
  ;(t.G = Date.now()), ns(t), (t.B = Ht(t.A))
  var n = t.B,
    r = t.W
  Array.isArray(r) || (r = [String(r)]),
    S_(n.i, 't', r),
    (t.o = 0),
    (n = t.l.J),
    (t.h = new v_()),
    (t.g = Q_(t.l, n ? e : null, !t.u)),
    0 < t.O && (t.M = new Hd(Ae(t.Pa, t, t.g), t.O)),
    d_(t.U, t.g, 'readystatechange', t.nb),
    (e = t.I ? t_(t.I) : {}),
    t.u
      ? (t.v || (t.v = 'POST'),
        (e['Content-Type'] = 'application/x-www-form-urlencoded'),
        t.g.ha(t.B, t.v, t.u, e))
      : ((t.v = 'GET'), t.g.ha(t.B, t.v, null, e)),
    Ki(),
    rN(t.j, t.v, t.B, t.m, t.W, t.u)
}
v.nb = function (t) {
  t = t.target
  let e = this.M
  e && Ct(t) == 3 ? e.l() : this.Pa(t)
}
v.Pa = function (t) {
  try {
    if (t == this.g)
      e: {
        let l = Ct(this.g)
        var e = this.g.Ia()
        let d = this.g.da()
        if (
          !(3 > l) &&
          (l != 3 || Od || (this.g && (this.h.h || this.g.ja() || Wv(this.g))))
        ) {
          this.J || l != 4 || e == 7 || (e == 8 || 0 >= d ? Ki(3) : Ki(2)),
            Ra(this)
          var n = this.g.da()
          this.ca = n
          t: if (w_(this)) {
            var r = Wv(this.g)
            t = ''
            var i = r.length,
              s = Ct(this.g) == 4
            if (!this.h.i) {
              if (typeof TextDecoder > 'u') {
                Un(this), $i(this)
                var o = ''
                break t
              }
              this.h.i = new C.TextDecoder()
            }
            for (e = 0; e < i; e++)
              (this.h.h = !0),
                (t += this.h.i.decode(r[e], { stream: s && e == i - 1 }))
            ;(r.length = 0), (this.h.g += t), (this.o = 0), (o = this.h.g)
          } else o = this.g.ja()
          if (
            ((this.i = n == 200),
            iN(this.j, this.v, this.B, this.m, this.W, l, n),
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
                    !Hi(a)
                  ) {
                    var u = a
                    break t
                  }
                }
                u = null
              }
              if ((n = u))
                br(
                  this.j,
                  this.m,
                  n,
                  'Initial handshake response via X-HTTP-Initial-Response'
                ),
                  (this.K = !0),
                  Wd(this, n)
              else {
                ;(this.i = !1), (this.s = 3), Oe(12), Un(this), $i(this)
                break e
              }
            }
            this.S
              ? (E_(this, l, o),
                Od &&
                  this.i &&
                  l == 3 &&
                  (d_(this.U, this.V, 'tick', this.mb), this.V.start()))
              : (br(this.j, this.m, o, null), Wd(this, o)),
              l == 4 && Un(this),
              this.i &&
                !this.J &&
                (l == 4 ? z_(this.l, this) : ((this.i = !1), ns(this)))
          } else
            SN(this.g),
              n == 400 && 0 < o.indexOf('Unknown SID')
                ? ((this.s = 3), Oe(12))
                : ((this.s = 0), Oe(13)),
              Un(this),
              $i(this)
        }
      }
  } catch {
  } finally {
  }
}
function w_(t) {
  return t.g ? t.v == 'GET' && t.L != 2 && t.l.Ha : !1
}
function E_(t, e, n) {
  let r = !0,
    i
  for (; !t.J && t.o < n.length; )
    if (((i = cN(t, n)), i == zd)) {
      e == 4 && ((t.s = 4), Oe(14), (r = !1)),
        br(t.j, t.m, null, '[Incomplete Response]')
      break
    } else if (i == __) {
      ;(t.s = 4), Oe(15), br(t.j, t.m, n, '[Invalid Chunk]'), (r = !1)
      break
    } else br(t.j, t.m, i, null), Wd(t, i)
  w_(t) && t.o != 0 && ((t.h.g = t.h.g.slice(t.o)), (t.o = 0)),
    e != 4 || n.length != 0 || t.h.h || ((t.s = 1), Oe(16), (r = !1)),
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
          yh(e),
          (e.M = !0),
          Oe(11)))
      : (br(t.j, t.m, n, '[Invalid Chunked Response]'), Un(t), $i(t))
}
v.mb = function () {
  if (this.g) {
    var t = Ct(this.g),
      e = this.g.ja()
    this.o < e.length &&
      (Ra(this), E_(this, t, e), this.i && t != 4 && ns(this))
  }
}
function cN(t, e) {
  var n = t.o,
    r = e.indexOf(
      `
`,
      n
    )
  return r == -1
    ? zd
    : ((n = Number(e.substring(n, r))),
      isNaN(n)
        ? __
        : ((r += 1),
          r + n > e.length ? zd : ((e = e.slice(r, r + n)), (t.o = r + n), e)))
}
v.cancel = function () {
  ;(this.J = !0), Un(this)
}
function ns(t) {
  ;(t.Y = Date.now() + t.P), T_(t, t.P)
}
function T_(t, e) {
  if (t.C != null) throw Error('WatchDog timer not null')
  t.C = Xi(Ae(t.lb, t), e)
}
function Ra(t) {
  t.C && (C.clearTimeout(t.C), (t.C = null))
}
v.lb = function () {
  this.C = null
  let t = Date.now()
  0 <= t - this.Y
    ? (sN(this.j, this.B),
      this.L != 2 && (Ki(), Oe(17)),
      Un(this),
      (this.s = 2),
      $i(this))
    : T_(this, this.Y - t)
}
function $i(t) {
  t.l.H == 0 || t.J || z_(t.l, t)
}
function Un(t) {
  Ra(t)
  var e = t.M
  e && typeof e.sa == 'function' && e.sa(),
    (t.M = null),
    ah(t.V),
    h_(t.U),
    t.g && ((e = t.g), (t.g = null), e.abort(), e.sa())
}
function Wd(t, e) {
  try {
    var n = t.l
    if (n.H != 0 && (n.g == t || Kd(n.i, t))) {
      if (!t.K && Kd(n.i, t) && n.H == 3) {
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
                if (n.g.G + 3e3 < t.G) va(n), Oa(n)
                else break e
              gh(n), Oe(18)
            }
          } else
            (n.Fa = i[1]),
              0 < n.Fa - n.V &&
                37500 > i[2] &&
                n.G &&
                n.A == 0 &&
                !n.v &&
                (n.v = Xi(Ae(n.ib, n), 6e3))
          if (1 >= R_(n.i) && n.oa) {
            try {
              n.oa()
            } catch {}
            n.oa = void 0
          }
        } else jn(n, 11)
      } else if (((t.K || n.g == t) && va(n), !Hi(e)))
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
                let g = f.g
                  ? f.g.getResponseHeader('X-Client-Wire-Protocol')
                  : null
                if (g) {
                  var s = r.i
                  s.g ||
                    (g.indexOf('spdy') == -1 &&
                      g.indexOf('quic') == -1 &&
                      g.indexOf('h2') == -1) ||
                    ((s.j = s.l),
                    (s.g = new Set()),
                    s.h && (hh(s, s.h), (s.h = null)))
                }
                if (r.F) {
                  let I = f.g
                    ? f.g.getResponseHeader('X-HTTP-Session-Id')
                    : null
                  I && ((r.Da = I), J(r.I, r.F, I))
                }
              }
              ;(n.H = 3),
                n.h && n.h.Ba(),
                n.ca &&
                  ((n.S = Date.now() - t.G),
                  n.l.info('Handshake RTT: ' + n.S + 'ms')),
                (r = n)
              var o = t
              if (((r.wa = K_(r, r.J ? r.pa : null, r.Y)), o.K)) {
                M_(r.i, o)
                var a = o,
                  c = r.L
                c && a.setTimeout(c), a.C && (Ra(a), ns(a)), (r.g = o)
              } else H_(r)
              0 < n.j.length && Fa(n)
            } else (u[0] != 'stop' && u[0] != 'close') || jn(n, 7)
          else
            n.H == 3 &&
              (u[0] == 'stop' || u[0] == 'close'
                ? u[0] == 'stop'
                  ? jn(n, 7)
                  : mh(n)
                : u[0] != 'noop' && n.h && n.h.Aa(u),
              (n.A = 0))
        }
    }
    Ki(4)
  } catch {}
}
function uN(t) {
  if (t.Z && typeof t.Z == 'function') return t.Z()
  if (
    (typeof Map < 'u' && t instanceof Map) ||
    (typeof Set < 'u' && t instanceof Set)
  )
    return Array.from(t.values())
  if (typeof t == 'string') return t.split('')
  if (Ea(t)) {
    for (var e = [], n = t.length, r = 0; r < n; r++) e.push(t[r])
    return e
  }
  ;(e = []), (n = 0)
  for (r in t) e[n++] = t[r]
  return e
}
function lN(t) {
  if (t.ta && typeof t.ta == 'function') return t.ta()
  if (!t.Z || typeof t.Z != 'function') {
    if (typeof Map < 'u' && t instanceof Map) return Array.from(t.keys())
    if (!(typeof Set < 'u' && t instanceof Set)) {
      if (Ea(t) || typeof t == 'string') {
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
function D_(t, e) {
  if (t.forEach && typeof t.forEach == 'function') t.forEach(e, void 0)
  else if (Ea(t) || typeof t == 'string')
    Array.prototype.forEach.call(t, e, void 0)
  else
    for (var n = lN(t), r = uN(t), i = r.length, s = 0; s < i; s++)
      e.call(void 0, r[s], n && n[s], t)
}
var C_ = RegExp(
  '^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$'
)
function dN(t, e) {
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
function Bn(t) {
  if (
    ((this.g = this.s = this.j = ''),
    (this.m = null),
    (this.o = this.l = ''),
    (this.h = !1),
    t instanceof Bn)
  ) {
    ;(this.h = t.h),
      ga(this, t.j),
      (this.s = t.s),
      (this.g = t.g),
      ya(this, t.m),
      (this.l = t.l)
    var e = t.i,
      n = new Qi()
    ;(n.i = e.i),
      e.g && ((n.g = new Map(e.g)), (n.h = e.h)),
      qv(this, n),
      (this.o = t.o)
  } else
    t && (e = String(t).match(C_))
      ? ((this.h = !1),
        ga(this, e[1] || '', !0),
        (this.s = ji(e[2] || '')),
        (this.g = ji(e[3] || '', !0)),
        ya(this, e[4]),
        (this.l = ji(e[5] || '', !0)),
        qv(this, e[6] || '', !0),
        (this.o = ji(e[7] || '')))
      : ((this.h = !1), (this.i = new Qi(null, this.h)))
}
Bn.prototype.toString = function () {
  var t = [],
    e = this.j
  e && t.push(Bi(e, zv, !0), ':')
  var n = this.g
  return (
    (n || e == 'file') &&
      (t.push('//'),
      (e = this.s) && t.push(Bi(e, zv, !0), '@'),
      t.push(
        encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g, '%$1')
      ),
      (n = this.m),
      n != null && t.push(':', String(n))),
    (n = this.l) &&
      (this.g && n.charAt(0) != '/' && t.push('/'),
      t.push(Bi(n, n.charAt(0) == '/' ? pN : fN, !0))),
    (n = this.i.toString()) && t.push('?', n),
    (n = this.o) && t.push('#', Bi(n, gN)),
    t.join('')
  )
}
function Ht(t) {
  return new Bn(t)
}
function ga(t, e, n) {
  ;(t.j = n ? ji(e, !0) : e), t.j && (t.j = t.j.replace(/:$/, ''))
}
function ya(t, e) {
  if (e) {
    if (((e = Number(e)), isNaN(e) || 0 > e))
      throw Error('Bad port number ' + e)
    t.m = e
  } else t.m = null
}
function qv(t, e, n) {
  e instanceof Qi
    ? ((t.i = e), yN(t.i, t.h))
    : (n || (e = Bi(e, mN)), (t.i = new Qi(e, t.h)))
}
function J(t, e, n) {
  t.i.set(e, n)
}
function Ma(t) {
  return (
    J(
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
function ji(t, e) {
  return t
    ? e
      ? decodeURI(t.replace(/%25/g, '%2525'))
      : decodeURIComponent(t)
    : ''
}
function Bi(t, e, n) {
  return typeof t == 'string'
    ? ((t = encodeURI(t).replace(e, hN)),
      n && (t = t.replace(/%25([0-9a-fA-F]{2})/g, '%$1')),
      t)
    : null
}
function hN(t) {
  return (
    (t = t.charCodeAt(0)),
    '%' + ((t >> 4) & 15).toString(16) + (t & 15).toString(16)
  )
}
var zv = /[#\/\?@]/g,
  fN = /[#\?:]/g,
  pN = /[#\?]/g,
  mN = /[#\?@]/g,
  gN = /#/g
function Qi(t, e) {
  ;(this.h = this.g = null), (this.i = t || null), (this.j = !!e)
}
function ln(t) {
  t.g ||
    ((t.g = new Map()),
    (t.h = 0),
    t.i &&
      dN(t.i, function (e, n) {
        t.add(decodeURIComponent(e.replace(/\+/g, ' ')), n)
      }))
}
v = Qi.prototype
v.add = function (t, e) {
  ln(this), (this.i = null), (t = xr(this, t))
  var n = this.g.get(t)
  return n || this.g.set(t, (n = [])), n.push(e), (this.h += 1), this
}
function b_(t, e) {
  ln(t),
    (e = xr(t, e)),
    t.g.has(e) && ((t.i = null), (t.h -= t.g.get(e).length), t.g.delete(e))
}
function A_(t, e) {
  return ln(t), (e = xr(t, e)), t.g.has(e)
}
v.forEach = function (t, e) {
  ln(this),
    this.g.forEach(function (n, r) {
      n.forEach(function (i) {
        t.call(e, i, r, this)
      }, this)
    }, this)
}
v.ta = function () {
  ln(this)
  let t = Array.from(this.g.values()),
    e = Array.from(this.g.keys()),
    n = []
  for (let r = 0; r < e.length; r++) {
    let i = t[r]
    for (let s = 0; s < i.length; s++) n.push(e[r])
  }
  return n
}
v.Z = function (t) {
  ln(this)
  let e = []
  if (typeof t == 'string')
    A_(this, t) && (e = e.concat(this.g.get(xr(this, t))))
  else {
    t = Array.from(this.g.values())
    for (let n = 0; n < t.length; n++) e = e.concat(t[n])
  }
  return e
}
v.set = function (t, e) {
  return (
    ln(this),
    (this.i = null),
    (t = xr(this, t)),
    A_(this, t) && (this.h -= this.g.get(t).length),
    this.g.set(t, [e]),
    (this.h += 1),
    this
  )
}
v.get = function (t, e) {
  return t ? ((t = this.Z(t)), 0 < t.length ? String(t[0]) : e) : e
}
function S_(t, e, n) {
  b_(t, e),
    0 < n.length && ((t.i = null), t.g.set(xr(t, e), Zd(n)), (t.h += n.length))
}
v.toString = function () {
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
function xr(t, e) {
  return (e = String(e)), t.j && (e = e.toLowerCase()), e
}
function yN(t, e) {
  e &&
    !t.j &&
    (ln(t),
    (t.i = null),
    t.g.forEach(function (n, r) {
      var i = r.toLowerCase()
      r != i && (b_(this, r), S_(this, i, n))
    }, t)),
    (t.j = e)
}
var vN = class {
  constructor(t, e) {
    ;(this.g = t), (this.map = e)
  }
}
function x_(t) {
  ;(this.l = t || _N),
    C.PerformanceNavigationTiming
      ? ((t = C.performance.getEntriesByType('navigation')),
        (t =
          0 < t.length &&
          (t[0].nextHopProtocol == 'hq' || t[0].nextHopProtocol == 'h2')))
      : (t = !!(C.g && C.g.Ka && C.g.Ka() && C.g.Ka().dc)),
    (this.j = t ? this.l : 1),
    (this.g = null),
    1 < this.j && (this.g = new Set()),
    (this.h = null),
    (this.i = [])
}
var _N = 10
function N_(t) {
  return t.h ? !0 : t.g ? t.g.size >= t.j : !1
}
function R_(t) {
  return t.h ? 1 : t.g ? t.g.size : 0
}
function Kd(t, e) {
  return t.h ? t.h == e : t.g ? t.g.has(e) : !1
}
function hh(t, e) {
  t.g ? t.g.add(e) : (t.h = e)
}
function M_(t, e) {
  t.h && t.h == e ? (t.h = null) : t.g && t.g.has(e) && t.g.delete(e)
}
x_.prototype.cancel = function () {
  if (((this.i = P_(this)), this.h)) this.h.cancel(), (this.h = null)
  else if (this.g && this.g.size !== 0) {
    for (let t of this.g.values()) t.cancel()
    this.g.clear()
  }
}
function P_(t) {
  if (t.h != null) return t.i.concat(t.h.F)
  if (t.g != null && t.g.size !== 0) {
    let e = t.i
    for (let n of t.g.values()) e = e.concat(n.F)
    return e
  }
  return Zd(t.i)
}
var IN = class {
  stringify(t) {
    return C.JSON.stringify(t, void 0)
  }
  parse(t) {
    return C.JSON.parse(t, void 0)
  }
}
function wN() {
  this.g = new IN()
}
function EN(t, e, n) {
  let r = n || ''
  try {
    D_(t, function (i, s) {
      let o = i
      Ji(i) && (o = sh(i)), e.push(r + s + '=' + encodeURIComponent(o))
    })
  } catch (i) {
    throw (e.push(r + 'type=' + encodeURIComponent('_badmap')), i)
  }
}
function TN(t, e) {
  let n = new Aa()
  if (C.Image) {
    let r = new Image()
    ;(r.onload = ua(pa, n, r, 'TestLoadImage: loaded', !0, e)),
      (r.onerror = ua(pa, n, r, 'TestLoadImage: error', !1, e)),
      (r.onabort = ua(pa, n, r, 'TestLoadImage: abort', !1, e)),
      (r.ontimeout = ua(pa, n, r, 'TestLoadImage: timeout', !1, e)),
      C.setTimeout(function () {
        r.ontimeout && r.ontimeout()
      }, 1e4),
      (r.src = t)
  } else e(!1)
}
function pa(t, e, n, r, i) {
  try {
    ;(e.onload = null),
      (e.onerror = null),
      (e.onabort = null),
      (e.ontimeout = null),
      i(r)
  } catch {}
}
function rs(t) {
  ;(this.l = t.ec || null), (this.j = t.ob || !1)
}
ve(rs, uh)
rs.prototype.g = function () {
  return new Pa(this.l, this.j)
}
rs.prototype.i = (function (t) {
  return function () {
    return t
  }
})({})
function Pa(t, e) {
  ye.call(this),
    (this.F = t),
    (this.u = e),
    (this.m = void 0),
    (this.readyState = fh),
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
ve(Pa, ye)
var fh = 0
v = Pa.prototype
v.open = function (t, e) {
  if (this.readyState != fh)
    throw (this.abort(), Error('Error reopening a connection'))
  ;(this.C = t), (this.B = e), (this.readyState = 1), Yi(this)
}
v.send = function (t) {
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
    (this.F || C)
      .fetch(new Request(this.B, e))
      .then(this.$a.bind(this), this.ka.bind(this))
}
v.abort = function () {
  ;(this.response = this.responseText = ''),
    (this.v = new Headers()),
    (this.status = 0),
    this.j && this.j.cancel('Request was aborted.').catch(() => {}),
    1 <= this.readyState &&
      this.g &&
      this.readyState != 4 &&
      ((this.g = !1), is(this)),
    (this.readyState = fh)
}
v.$a = function (t) {
  if (
    this.g &&
    ((this.l = t),
    this.h ||
      ((this.status = this.l.status),
      (this.statusText = this.l.statusText),
      (this.h = t.headers),
      (this.readyState = 2),
      Yi(this)),
    this.g && ((this.readyState = 3), Yi(this), this.g))
  )
    if (this.responseType === 'arraybuffer')
      t.arrayBuffer().then(this.Ya.bind(this), this.ka.bind(this))
    else if (typeof C.ReadableStream < 'u' && 'body' in t) {
      if (((this.j = t.body.getReader()), this.u)) {
        if (this.responseType)
          throw Error(
            'responseType must be empty for "streamBinaryChunks" mode responses.'
          )
        this.response = []
      } else
        (this.response = this.responseText = ''), (this.A = new TextDecoder())
      k_(this)
    } else t.text().then(this.Za.bind(this), this.ka.bind(this))
}
function k_(t) {
  t.j.read().then(t.Xa.bind(t)).catch(t.ka.bind(t))
}
v.Xa = function (t) {
  if (this.g) {
    if (this.u && t.value) this.response.push(t.value)
    else if (!this.u) {
      var e = t.value ? t.value : new Uint8Array(0)
      ;(e = this.A.decode(e, { stream: !t.done })) &&
        (this.response = this.responseText += e)
    }
    t.done ? is(this) : Yi(this), this.readyState == 3 && k_(this)
  }
}
v.Za = function (t) {
  this.g && ((this.response = this.responseText = t), is(this))
}
v.Ya = function (t) {
  this.g && ((this.response = t), is(this))
}
v.ka = function () {
  this.g && is(this)
}
function is(t) {
  ;(t.readyState = 4), (t.l = null), (t.j = null), (t.A = null), Yi(t)
}
v.setRequestHeader = function (t, e) {
  this.v.append(t, e)
}
v.getResponseHeader = function (t) {
  return (this.h && this.h.get(t.toLowerCase())) || ''
}
v.getAllResponseHeaders = function () {
  if (!this.h) return ''
  let t = [],
    e = this.h.entries()
  for (var n = e.next(); !n.done; )
    (n = n.value), t.push(n[0] + ': ' + n[1]), (n = e.next())
  return t.join(`\r
`)
}
function Yi(t) {
  t.onreadystatechange && t.onreadystatechange.call(t)
}
Object.defineProperty(Pa.prototype, 'withCredentials', {
  get: function () {
    return this.m === 'include'
  },
  set: function (t) {
    this.m = t ? 'include' : 'same-origin'
  },
})
var DN = C.JSON.parse
function te(t) {
  ye.call(this),
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
    (this.K = O_),
    (this.L = this.M = !1)
}
ve(te, ye)
var O_ = '',
  CN = /^https?$/i,
  bN = ['POST', 'PUT']
v = te.prototype
v.Oa = function (t) {
  this.M = t
}
v.ha = function (t, e, n, r) {
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
    (this.g = this.u ? this.u.g() : qd.g()),
    (this.C = this.u ? Hv(this.u) : Hv(qd)),
    (this.g.onreadystatechange = Ae(this.La, this))
  try {
    ;(this.G = !0), this.g.open(e, String(t), !0), (this.G = !1)
  } catch (s) {
    Gv(this, s)
    return
  }
  if (((t = n || ''), (n = new Map(this.headers)), r))
    if (Object.getPrototypeOf(r) === Object.prototype)
      for (var i in r) n.set(i, r[i])
    else if (typeof r.keys == 'function' && typeof r.get == 'function')
      for (let s of r.keys()) n.set(s, r.get(s))
    else throw Error('Unknown input type for opt_headers: ' + String(r))
  ;(r = Array.from(n.keys()).find((s) => s.toLowerCase() == 'content-type')),
    (i = C.FormData && t instanceof C.FormData),
    !(0 <= Jv(bN, e)) ||
      r ||
      i ||
      n.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
  for (let [s, o] of n) this.g.setRequestHeader(s, o)
  this.K && (this.g.responseType = this.K),
    'withCredentials' in this.g &&
      this.g.withCredentials !== this.M &&
      (this.g.withCredentials = this.M)
  try {
    V_(this),
      0 < this.B &&
        ((this.L = AN(this.g))
          ? ((this.g.timeout = this.B), (this.g.ontimeout = Ae(this.ua, this)))
          : (this.A = ch(this.ua, this.B, this))),
      (this.v = !0),
      this.g.send(t),
      (this.v = !1)
  } catch (s) {
    Gv(this, s)
  }
}
function AN(t) {
  return Sr && typeof t.timeout == 'number' && t.ontimeout !== void 0
}
v.ua = function () {
  typeof Jd < 'u' &&
    this.g &&
    ((this.j = 'Timed out after ' + this.B + 'ms, aborting'),
    (this.m = 8),
    Ee(this, 'timeout'),
    this.abort(8))
}
function Gv(t, e) {
  ;(t.h = !1),
    t.g && ((t.l = !0), t.g.abort(), (t.l = !1)),
    (t.j = e),
    (t.m = 5),
    F_(t),
    ka(t)
}
function F_(t) {
  t.F || ((t.F = !0), Ee(t, 'complete'), Ee(t, 'error'))
}
v.abort = function (t) {
  this.g &&
    this.h &&
    ((this.h = !1),
    (this.l = !0),
    this.g.abort(),
    (this.l = !1),
    (this.m = t || 7),
    Ee(this, 'complete'),
    Ee(this, 'abort'),
    ka(this))
}
v.N = function () {
  this.g &&
    (this.h && ((this.h = !1), (this.l = !0), this.g.abort(), (this.l = !1)),
    ka(this, !0)),
    te.$.N.call(this)
}
v.La = function () {
  this.s || (this.G || this.v || this.l ? L_(this) : this.kb())
}
v.kb = function () {
  L_(this)
}
function L_(t) {
  if (t.h && typeof Jd < 'u' && (!t.C[1] || Ct(t) != 4 || t.da() != 2)) {
    if (t.v && Ct(t) == 4) ch(t.La, 0, t)
    else if ((Ee(t, 'readystatechange'), Ct(t) == 4)) {
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
            var i = String(t.I).match(C_)[1] || null
            !i &&
              C.self &&
              C.self.location &&
              (i = C.self.location.protocol.slice(0, -1)),
              (r = !CN.test(i ? i.toLowerCase() : ''))
          }
          n = r
        }
        if (n) Ee(t, 'complete'), Ee(t, 'success')
        else {
          t.m = 6
          try {
            var s = 2 < Ct(t) ? t.g.statusText : ''
          } catch {
            s = ''
          }
          ;(t.j = s + ' [' + t.da() + ']'), F_(t)
        }
      } finally {
        ka(t)
      }
    }
  }
}
function ka(t, e) {
  if (t.g) {
    V_(t)
    let n = t.g,
      r = t.C[0] ? () => {} : null
    ;(t.g = null), (t.C = null), e || Ee(t, 'ready')
    try {
      n.onreadystatechange = r
    } catch {}
  }
}
function V_(t) {
  t.g && t.L && (t.g.ontimeout = null),
    t.A && (C.clearTimeout(t.A), (t.A = null))
}
v.isActive = function () {
  return !!this.g
}
function Ct(t) {
  return t.g ? t.g.readyState : 0
}
v.da = function () {
  try {
    return 2 < Ct(this) ? this.g.status : -1
  } catch {
    return -1
  }
}
v.ja = function () {
  try {
    return this.g ? this.g.responseText : ''
  } catch {
    return ''
  }
}
v.Wa = function (t) {
  if (this.g) {
    var e = this.g.responseText
    return t && e.indexOf(t) == 0 && (e = e.substring(t.length)), DN(e)
  }
}
function Wv(t) {
  try {
    if (!t.g) return null
    if ('response' in t.g) return t.g.response
    switch (t.K) {
      case O_:
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
function SN(t) {
  let e = {}
  t = ((t.g && 2 <= Ct(t) && t.g.getAllResponseHeaders()) || '').split(`\r
`)
  for (let r = 0; r < t.length; r++) {
    if (Hi(t[r])) continue
    var n = eN(t[r])
    let i = n[0]
    if (((n = n[1]), typeof n != 'string')) continue
    n = n.trim()
    let s = e[i] || []
    ;(e[i] = s), s.push(n)
  }
  Yx(e, function (r) {
    return r.join(', ')
  })
}
v.Ia = function () {
  return this.m
}
v.Sa = function () {
  return typeof this.j == 'string' ? this.j : String(this.j)
}
function U_(t) {
  let e = ''
  return (
    eh(t, function (n, r) {
      ;(e += r),
        (e += ':'),
        (e += n),
        (e += `\r
`)
    }),
    e
  )
}
function ph(t, e, n) {
  e: {
    for (r in n) {
      var r = !1
      break e
    }
    r = !0
  }
  r ||
    ((n = U_(n)),
    typeof t == 'string'
      ? n != null && encodeURIComponent(String(n))
      : J(t, e, n))
}
function Vi(t, e, n) {
  return (n && n.internalChannelParams && n.internalChannelParams[t]) || e
}
function j_(t) {
  ;(this.Ga = 0),
    (this.j = []),
    (this.l = new Aa()),
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
    (this.cb = Vi('failFast', !1, t)),
    (this.G = this.v = this.u = this.m = this.h = null),
    (this.aa = !0),
    (this.Fa = this.V = -1),
    (this.ba = this.A = this.C = 0),
    (this.ab = Vi('baseRetryDelayMs', 5e3, t)),
    (this.hb = Vi('retryDelaySeedMs', 1e4, t)),
    (this.eb = Vi('forwardChannelMaxRetries', 2, t)),
    (this.xa = Vi('forwardChannelRequestTimeoutMs', 2e4, t)),
    (this.va = (t && t.xmlHttpFactory) || void 0),
    (this.Ha = (t && t.useFetchStreams) || !1),
    (this.L = void 0),
    (this.J = (t && t.supportsCrossDomainXhr) || !1),
    (this.K = ''),
    (this.i = new x_(t && t.concurrentRequestLimit)),
    (this.Ja = new wN()),
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
v = j_.prototype
v.ra = 8
v.H = 1
function mh(t) {
  if ((B_(t), t.H == 3)) {
    var e = t.W++,
      n = Ht(t.I)
    if (
      (J(n, 'SID', t.K),
      J(n, 'RID', e),
      J(n, 'TYPE', 'terminate'),
      ss(t, n),
      (e = new ts(t, t.l, e)),
      (e.L = 2),
      (e.A = Ma(Ht(n))),
      (n = !1),
      C.navigator && C.navigator.sendBeacon)
    )
      try {
        n = C.navigator.sendBeacon(e.A.toString(), '')
      } catch {}
    !n && C.Image && ((new Image().src = e.A), (n = !0)),
      n || ((e.g = Q_(e.l, null)), e.g.ha(e.A)),
      (e.G = Date.now()),
      ns(e)
  }
  W_(t)
}
function Oa(t) {
  t.g && (yh(t), t.g.cancel(), (t.g = null))
}
function B_(t) {
  Oa(t),
    t.u && (C.clearTimeout(t.u), (t.u = null)),
    va(t),
    t.i.cancel(),
    t.m && (typeof t.m == 'number' && C.clearTimeout(t.m), (t.m = null))
}
function Fa(t) {
  if (!N_(t.i) && !t.m) {
    t.m = !0
    var e = t.Na
    zi || u_(), Gi || (zi(), (Gi = !0)), oh.add(e, t), (t.C = 0)
  }
}
function xN(t, e) {
  return R_(t.i) >= t.i.j - (t.m ? 1 : 0)
    ? !1
    : t.m
      ? ((t.j = e.F.concat(t.j)), !0)
      : t.H == 1 || t.H == 2 || t.C >= (t.cb ? 0 : t.eb)
        ? !1
        : ((t.m = Xi(Ae(t.Na, t, e), G_(t, t.C))), t.C++, !0)
}
v.Na = function (t) {
  if (this.m)
    if (((this.m = null), this.H == 1)) {
      if (!t) {
        ;(this.W = Math.floor(1e5 * Math.random())), (t = this.W++)
        let i = new ts(this, this.l, t),
          s = this.s
        if (
          (this.U && (s ? ((s = t_(s)), n_(s, this.U)) : (s = this.U)),
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
        ;(e = $_(this, i, e)),
          (n = Ht(this.I)),
          J(n, 'RID', t),
          J(n, 'CVER', 22),
          this.F && J(n, 'X-HTTP-Session-Id', this.F),
          ss(this, n),
          s &&
            (this.O
              ? (e = 'headers=' + encodeURIComponent(String(U_(s))) + '&' + e)
              : this.o && ph(n, this.o, s)),
          hh(this.i, i),
          this.bb && J(n, 'TYPE', 'init'),
          this.P
            ? (J(n, '$req', e),
              J(n, 'SID', 'null'),
              (i.aa = !0),
              Gd(i, n, null))
            : Gd(i, n, e),
          (this.H = 2)
      }
    } else
      this.H == 3 &&
        (t ? Kv(this, t) : this.j.length == 0 || N_(this.i) || Kv(this))
}
function Kv(t, e) {
  var n
  e ? (n = e.m) : (n = t.W++)
  let r = Ht(t.I)
  J(r, 'SID', t.K),
    J(r, 'RID', n),
    J(r, 'AID', t.V),
    ss(t, r),
    t.o && t.s && ph(r, t.o, t.s),
    (n = new ts(t, t.l, n, t.C + 1)),
    t.o === null && (n.I = t.s),
    e && (t.j = e.F.concat(t.j)),
    (e = $_(t, n, 1e3)),
    n.setTimeout(
      Math.round(0.5 * t.xa) + Math.round(0.5 * t.xa * Math.random())
    ),
    hh(t.i, n),
    Gd(n, r, e)
}
function ss(t, e) {
  t.na &&
    eh(t.na, function (n, r) {
      J(e, r, n)
    }),
    t.h &&
      D_({}, function (n, r) {
        J(e, r, n)
      })
}
function $_(t, e, n) {
  n = Math.min(t.j.length, n)
  var r = t.h ? Ae(t.h.Va, t.h, t) : null
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
            EN(l, o, 'req' + u + '_')
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
function H_(t) {
  if (!t.g && !t.u) {
    t.ba = 1
    var e = t.Ma
    zi || u_(), Gi || (zi(), (Gi = !0)), oh.add(e, t), (t.A = 0)
  }
}
function gh(t) {
  return t.g || t.u || 3 <= t.A
    ? !1
    : (t.ba++, (t.u = Xi(Ae(t.Ma, t), G_(t, t.A))), t.A++, !0)
}
v.Ma = function () {
  if (
    ((this.u = null),
    q_(this),
    this.ca && !(this.M || this.g == null || 0 >= this.S))
  ) {
    var t = 2 * this.S
    this.l.info('BP detection timer enabled: ' + t),
      (this.B = Xi(Ae(this.jb, this), t))
  }
}
v.jb = function () {
  this.B &&
    ((this.B = null),
    this.l.info('BP detection timeout reached.'),
    this.l.info('Buffering proxy detected and switch to long-polling!'),
    (this.G = !1),
    (this.M = !0),
    Oe(10),
    Oa(this),
    q_(this))
}
function yh(t) {
  t.B != null && (C.clearTimeout(t.B), (t.B = null))
}
function q_(t) {
  ;(t.g = new ts(t, t.l, 'rpc', t.ba)),
    t.o === null && (t.g.I = t.s),
    (t.g.O = 0)
  var e = Ht(t.wa)
  J(e, 'RID', 'rpc'),
    J(e, 'SID', t.K),
    J(e, 'AID', t.V),
    J(e, 'CI', t.G ? '0' : '1'),
    !t.G && t.qa && J(e, 'TO', t.qa),
    J(e, 'TYPE', 'xmlhttp'),
    ss(t, e),
    t.o && t.s && ph(e, t.o, t.s),
    t.L && t.g.setTimeout(t.L)
  var n = t.g
  ;(t = t.pa), (n.L = 1), (n.A = Ma(Ht(e))), (n.u = null), (n.S = !0), I_(n, t)
}
v.ib = function () {
  this.v != null && ((this.v = null), Oa(this), gh(this), Oe(19))
}
function va(t) {
  t.v != null && (C.clearTimeout(t.v), (t.v = null))
}
function z_(t, e) {
  var n = null
  if (t.g == e) {
    va(t), yh(t), (t.g = null)
    var r = 2
  } else if (Kd(t.i, e)) (n = e.F), M_(t.i, e), (r = 1)
  else return
  if (t.H != 0) {
    if (e.i)
      if (r == 1) {
        ;(n = e.u ? e.u.length : 0), (e = Date.now() - e.G)
        var i = t.C
        ;(r = Sa()), Ee(r, new m_(r, n)), Fa(t)
      } else H_(t)
    else if (
      ((i = e.s),
      i == 3 ||
        (i == 0 && 0 < e.ca) ||
        !((r == 1 && xN(t, e)) || (r == 2 && gh(t))))
    )
      switch ((n && 0 < n.length && ((e = t.i), (e.i = e.i.concat(n))), i)) {
        case 1:
          jn(t, 5)
          break
        case 4:
          jn(t, 10)
          break
        case 3:
          jn(t, 6)
          break
        default:
          jn(t, 2)
      }
  }
}
function G_(t, e) {
  let n = t.ab + Math.floor(Math.random() * t.hb)
  return t.isActive() || (n *= 2), n * e
}
function jn(t, e) {
  if ((t.l.info('Error code ' + e), e == 2)) {
    var n = null
    t.h && (n = null)
    var r = Ae(t.pb, t)
    n ||
      ((n = new Bn('//www.google.com/images/cleardot.gif')),
      (C.location && C.location.protocol == 'http') || ga(n, 'https'),
      Ma(n)),
      TN(n.toString(), r)
  } else Oe(2)
  ;(t.H = 0), t.h && t.h.za(e), W_(t), B_(t)
}
v.pb = function (t) {
  t
    ? (this.l.info('Successfully pinged google.com'), Oe(2))
    : (this.l.info('Failed to ping google.com'), Oe(1))
}
function W_(t) {
  if (((t.H = 0), (t.ma = []), t.h)) {
    let e = P_(t.i)
    ;(e.length != 0 || t.j.length != 0) &&
      (Uv(t.ma, e),
      Uv(t.ma, t.j),
      (t.i.i.length = 0),
      Zd(t.j),
      (t.j.length = 0)),
      t.h.ya()
  }
}
function K_(t, e, n) {
  var r = n instanceof Bn ? Ht(n) : new Bn(n)
  if (r.g != '') e && (r.g = e + '.' + r.g), ya(r, r.m)
  else {
    var i = C.location
    ;(r = i.protocol),
      (e = e ? e + '.' + i.hostname : i.hostname),
      (i = +i.port)
    var s = new Bn(null)
    r && ga(s, r), e && (s.g = e), i && ya(s, i), n && (s.l = n), (r = s)
  }
  return (
    (n = t.F), (e = t.Da), n && e && J(r, n, e), J(r, 'VER', t.ra), ss(t, r), r
  )
}
function Q_(t, e, n) {
  if (e && !t.J)
    throw Error("Can't create secondary domain capable XhrIo object.")
  return (
    (e = t.Ha && !t.va ? new te(new rs({ ob: n })) : new te(t.va)), e.Oa(t.J), e
  )
}
v.isActive = function () {
  return !!this.h && this.h.isActive(this)
}
function Y_() {}
v = Y_.prototype
v.Ba = function () {}
v.Aa = function () {}
v.za = function () {}
v.ya = function () {}
v.isActive = function () {
  return !0
}
v.Va = function () {}
function _a() {
  if (Sr && !(10 <= Number(Gx)))
    throw Error('Environmental error: no available transport.')
}
_a.prototype.g = function (t, e) {
  return new Ke(t, e)
}
function Ke(t, e) {
  ye.call(this),
    (this.g = new j_(e)),
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
    (t = e && e.cc) && !Hi(t) && (this.g.o = t),
    (this.A = (e && e.supportsCrossDomainXhr) || !1),
    (this.v = (e && e.sendRawJson) || !1),
    (e = e && e.httpSessionIdParam) &&
      !Hi(e) &&
      ((this.g.F = e),
      (t = this.h),
      t !== null && e in t && ((t = this.h), e in t && delete t[e])),
    (this.j = new Nr(this))
}
ve(Ke, ye)
Ke.prototype.m = function () {
  ;(this.g.h = this.j), this.A && (this.g.J = !0)
  var t = this.g,
    e = this.l,
    n = this.h || void 0
  Oe(0),
    (t.Y = e),
    (t.na = n || {}),
    (t.G = t.aa),
    (t.I = K_(t, null, t.Y)),
    Fa(t)
}
Ke.prototype.close = function () {
  mh(this.g)
}
Ke.prototype.u = function (t) {
  var e = this.g
  if (typeof t == 'string') {
    var n = {}
    ;(n.__data__ = t), (t = n)
  } else this.v && ((n = {}), (n.__data__ = sh(t)), (t = n))
  e.j.push(new vN(e.fb++, t)), e.H == 3 && Fa(e)
}
Ke.prototype.N = function () {
  ;(this.g.h = null),
    delete this.j,
    mh(this.g),
    delete this.g,
    Ke.$.N.call(this)
}
function J_(t) {
  lh.call(this),
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
ve(J_, lh)
function Z_() {
  dh.call(this), (this.status = 1)
}
ve(Z_, dh)
function Nr(t) {
  this.g = t
}
ve(Nr, Y_)
Nr.prototype.Ba = function () {
  Ee(this.g, 'a')
}
Nr.prototype.Aa = function (t) {
  Ee(this.g, new J_(t))
}
Nr.prototype.za = function (t) {
  Ee(this.g, new Z_())
}
Nr.prototype.ya = function () {
  Ee(this.g, 'b')
}
function NN() {
  this.blockSize = -1
}
function ht() {
  ;(this.blockSize = -1),
    (this.blockSize = 64),
    (this.g = Array(4)),
    (this.m = Array(this.blockSize)),
    (this.i = this.h = 0),
    this.reset()
}
ve(ht, NN)
ht.prototype.reset = function () {
  ;(this.g[0] = 1732584193),
    (this.g[1] = 4023233417),
    (this.g[2] = 2562383102),
    (this.g[3] = 271733878),
    (this.i = this.h = 0)
}
function kd(t, e, n) {
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
ht.prototype.j = function (t, e) {
  e === void 0 && (e = t.length)
  for (var n = e - this.blockSize, r = this.m, i = this.h, s = 0; s < e; ) {
    if (i == 0) for (; s <= n; ) kd(this, t, s), (s += this.blockSize)
    if (typeof t == 'string') {
      for (; s < e; )
        if (((r[i++] = t.charCodeAt(s++)), i == this.blockSize)) {
          kd(this, r), (i = 0)
          break
        }
    } else
      for (; s < e; )
        if (((r[i++] = t[s++]), i == this.blockSize)) {
          kd(this, r), (i = 0)
          break
        }
  }
  ;(this.h = i), (this.i += e)
}
ht.prototype.l = function () {
  var t = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h)
  t[0] = 128
  for (var e = 1; e < t.length - 8; ++e) t[e] = 0
  var n = 8 * this.i
  for (e = t.length - 8; e < t.length; ++e) (t[e] = n & 255), (n /= 256)
  for (this.j(t), t = Array(16), e = n = 0; 4 > e; ++e)
    for (var r = 0; 32 > r; r += 8) t[n++] = (this.g[e] >>> r) & 255
  return t
}
function q(t, e) {
  this.h = e
  for (var n = [], r = !0, i = t.length - 1; 0 <= i; i--) {
    var s = t[i] | 0
    ;(r && s == e) || ((n[i] = s), (r = !1))
  }
  this.g = n
}
var RN = {}
function vh(t) {
  return -128 <= t && 128 > t
    ? Hx(t, function (e) {
        return new q([e | 0], 0 > e ? -1 : 0)
      })
    : new q([t | 0], 0 > t ? -1 : 0)
}
function bt(t) {
  if (isNaN(t) || !isFinite(t)) return Ar
  if (0 > t) return we(bt(-t))
  for (var e = [], n = 1, r = 0; t >= n; r++) (e[r] = (t / n) | 0), (n *= Qd)
  return new q(e, 0)
}
function X_(t, e) {
  if (t.length == 0) throw Error('number format error: empty string')
  if (((e = e || 10), 2 > e || 36 < e)) throw Error('radix out of range: ' + e)
  if (t.charAt(0) == '-') return we(X_(t.substring(1), e))
  if (0 <= t.indexOf('-'))
    throw Error('number format error: interior "-" character')
  for (var n = bt(Math.pow(e, 8)), r = Ar, i = 0; i < t.length; i += 8) {
    var s = Math.min(8, t.length - i),
      o = parseInt(t.substring(i, i + s), e)
    8 > s
      ? ((s = bt(Math.pow(e, s))), (r = r.R(s).add(bt(o))))
      : ((r = r.R(n)), (r = r.add(bt(o))))
  }
  return r
}
var Qd = 4294967296,
  Ar = vh(0),
  Yd = vh(1),
  Qv = vh(16777216)
v = q.prototype
v.ea = function () {
  if (nt(this)) return -we(this).ea()
  for (var t = 0, e = 1, n = 0; n < this.g.length; n++) {
    var r = this.D(n)
    ;(t += (0 <= r ? r : Qd + r) * e), (e *= Qd)
  }
  return t
}
v.toString = function (t) {
  if (((t = t || 10), 2 > t || 36 < t)) throw Error('radix out of range: ' + t)
  if ($t(this)) return '0'
  if (nt(this)) return '-' + we(this).toString(t)
  for (var e = bt(Math.pow(t, 6)), n = this, r = ''; ; ) {
    var i = wa(n, e).g
    n = Ia(n, i.R(e))
    var s = ((0 < n.g.length ? n.g[0] : n.h) >>> 0).toString(t)
    if (((n = i), $t(n))) return s + r
    for (; 6 > s.length; ) s = '0' + s
    r = s + r
  }
}
v.D = function (t) {
  return 0 > t ? 0 : t < this.g.length ? this.g[t] : this.h
}
function $t(t) {
  if (t.h != 0) return !1
  for (var e = 0; e < t.g.length; e++) if (t.g[e] != 0) return !1
  return !0
}
function nt(t) {
  return t.h == -1
}
v.X = function (t) {
  return (t = Ia(this, t)), nt(t) ? -1 : $t(t) ? 0 : 1
}
function we(t) {
  for (var e = t.g.length, n = [], r = 0; r < e; r++) n[r] = ~t.g[r]
  return new q(n, ~t.h).add(Yd)
}
v.abs = function () {
  return nt(this) ? we(this) : this
}
v.add = function (t) {
  for (
    var e = Math.max(this.g.length, t.g.length), n = [], r = 0, i = 0;
    i <= e;
    i++
  ) {
    var s = r + (this.D(i) & 65535) + (t.D(i) & 65535),
      o = (s >>> 16) + (this.D(i) >>> 16) + (t.D(i) >>> 16)
    ;(r = o >>> 16), (s &= 65535), (o &= 65535), (n[i] = (o << 16) | s)
  }
  return new q(n, n[n.length - 1] & -2147483648 ? -1 : 0)
}
function Ia(t, e) {
  return t.add(we(e))
}
v.R = function (t) {
  if ($t(this) || $t(t)) return Ar
  if (nt(this)) return nt(t) ? we(this).R(we(t)) : we(we(this).R(t))
  if (nt(t)) return we(this.R(we(t)))
  if (0 > this.X(Qv) && 0 > t.X(Qv)) return bt(this.ea() * t.ea())
  for (var e = this.g.length + t.g.length, n = [], r = 0; r < 2 * e; r++)
    n[r] = 0
  for (r = 0; r < this.g.length; r++)
    for (var i = 0; i < t.g.length; i++) {
      var s = this.D(r) >>> 16,
        o = this.D(r) & 65535,
        a = t.D(i) >>> 16,
        c = t.D(i) & 65535
      ;(n[2 * r + 2 * i] += o * c),
        ma(n, 2 * r + 2 * i),
        (n[2 * r + 2 * i + 1] += s * c),
        ma(n, 2 * r + 2 * i + 1),
        (n[2 * r + 2 * i + 1] += o * a),
        ma(n, 2 * r + 2 * i + 1),
        (n[2 * r + 2 * i + 2] += s * a),
        ma(n, 2 * r + 2 * i + 2)
    }
  for (r = 0; r < e; r++) n[r] = (n[2 * r + 1] << 16) | n[2 * r]
  for (r = e; r < 2 * e; r++) n[r] = 0
  return new q(n, 0)
}
function ma(t, e) {
  for (; (t[e] & 65535) != t[e]; )
    (t[e + 1] += t[e] >>> 16), (t[e] &= 65535), e++
}
function Ui(t, e) {
  ;(this.g = t), (this.h = e)
}
function wa(t, e) {
  if ($t(e)) throw Error('division by zero')
  if ($t(t)) return new Ui(Ar, Ar)
  if (nt(t)) return (e = wa(we(t), e)), new Ui(we(e.g), we(e.h))
  if (nt(e)) return (e = wa(t, we(e))), new Ui(we(e.g), e.h)
  if (30 < t.g.length) {
    if (nt(t) || nt(e))
      throw Error('slowDivide_ only works with positive integers.')
    for (var n = Yd, r = e; 0 >= r.X(t); ) (n = Yv(n)), (r = Yv(r))
    var i = Cr(n, 1),
      s = Cr(r, 1)
    for (r = Cr(r, 2), n = Cr(n, 2); !$t(r); ) {
      var o = s.add(r)
      0 >= o.X(t) && ((i = i.add(n)), (s = o)), (r = Cr(r, 1)), (n = Cr(n, 1))
    }
    return (e = Ia(t, i.R(e))), new Ui(i, e)
  }
  for (i = Ar; 0 <= t.X(e); ) {
    for (
      n = Math.max(1, Math.floor(t.ea() / e.ea())),
        r = Math.ceil(Math.log(n) / Math.LN2),
        r = 48 >= r ? 1 : Math.pow(2, r - 48),
        s = bt(n),
        o = s.R(e);
      nt(o) || 0 < o.X(t);

    )
      (n -= r), (s = bt(n)), (o = s.R(e))
    $t(s) && (s = Yd), (i = i.add(s)), (t = Ia(t, o))
  }
  return new Ui(i, t)
}
v.gb = function (t) {
  return wa(this, t).h
}
v.and = function (t) {
  for (var e = Math.max(this.g.length, t.g.length), n = [], r = 0; r < e; r++)
    n[r] = this.D(r) & t.D(r)
  return new q(n, this.h & t.h)
}
v.or = function (t) {
  for (var e = Math.max(this.g.length, t.g.length), n = [], r = 0; r < e; r++)
    n[r] = this.D(r) | t.D(r)
  return new q(n, this.h | t.h)
}
v.xor = function (t) {
  for (var e = Math.max(this.g.length, t.g.length), n = [], r = 0; r < e; r++)
    n[r] = this.D(r) ^ t.D(r)
  return new q(n, this.h ^ t.h)
}
function Yv(t) {
  for (var e = t.g.length + 1, n = [], r = 0; r < e; r++)
    n[r] = (t.D(r) << 1) | (t.D(r - 1) >>> 31)
  return new q(n, t.h)
}
function Cr(t, e) {
  var n = e >> 5
  e %= 32
  for (var r = t.g.length - n, i = [], s = 0; s < r; s++)
    i[s] =
      0 < e ? (t.D(s + n) >>> e) | (t.D(s + n + 1) << (32 - e)) : t.D(s + n)
  return new q(i, t.h)
}
_a.prototype.createWebChannel = _a.prototype.g
Ke.prototype.send = Ke.prototype.u
Ke.prototype.open = Ke.prototype.m
Ke.prototype.close = Ke.prototype.close
xa.NO_ERROR = 0
xa.TIMEOUT = 8
xa.HTTP_ERROR = 6
g_.COMPLETE = 'complete'
y_.EventType = es
es.OPEN = 'a'
es.CLOSE = 'b'
es.ERROR = 'c'
es.MESSAGE = 'd'
ye.prototype.listen = ye.prototype.O
te.prototype.listenOnce = te.prototype.P
te.prototype.getLastError = te.prototype.Sa
te.prototype.getLastErrorCode = te.prototype.Ia
te.prototype.getStatus = te.prototype.da
te.prototype.getResponseJson = te.prototype.Wa
te.prototype.getResponseText = te.prototype.ja
te.prototype.send = te.prototype.ha
te.prototype.setWithCredentials = te.prototype.Oa
ht.prototype.digest = ht.prototype.l
ht.prototype.reset = ht.prototype.reset
ht.prototype.update = ht.prototype.j
q.prototype.add = q.prototype.add
q.prototype.multiply = q.prototype.R
q.prototype.modulo = q.prototype.gb
q.prototype.compare = q.prototype.X
q.prototype.toNumber = q.prototype.ea
q.prototype.toString = q.prototype.toString
q.prototype.getBits = q.prototype.D
q.fromNumber = bt
q.fromString = X_
var eI = (ft.createWebChannelTransport = function () {
    return new _a()
  }),
  tI = (ft.getStatEventTarget = function () {
    return Sa()
  }),
  La = (ft.ErrorCode = xa),
  nI = (ft.EventType = g_),
  rI = (ft.Event = $n),
  _h = (ft.Stat = {
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
  kV = (ft.FetchXmlHttpFactory = rs),
  os = (ft.WebChannel = y_),
  iI = (ft.XhrIo = te),
  sI = (ft.Md5 = ht),
  Hn = (ft.Integer = q)
var oI = '@firebase/firestore'
var _e = class {
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
;(_e.UNAUTHENTICATED = new _e(null)),
  (_e.GOOGLE_CREDENTIALS = new _e('google-credentials-uid')),
  (_e.FIRST_PARTY = new _e('first-party-uid')),
  (_e.MOCK_USER = new _e('mock-user'))
var Jr = '10.8.1'
var Yn = new sn('@firebase/firestore')
function as() {
  return Yn.logLevel
}
function _(t, ...e) {
  if (Yn.logLevel <= k.DEBUG) {
    let n = e.map(tp)
    Yn.debug(`Firestore (${Jr}): ${t}`, ...n)
  }
}
function Nt(t, ...e) {
  if (Yn.logLevel <= k.ERROR) {
    let n = e.map(tp)
    Yn.error(`Firestore (${Jr}): ${t}`, ...n)
  }
}
function Ur(t, ...e) {
  if (Yn.logLevel <= k.WARN) {
    let n = e.map(tp)
    Yn.warn(`Firestore (${Jr}): ${t}`, ...n)
  }
}
function tp(t) {
  if (typeof t == 'string') return t
  try {
    return (function (n) {
      return JSON.stringify(n)
    })(t)
  } catch {
    return t
  }
}
function S(t = 'Unexpected state') {
  let e = `FIRESTORE (${Jr}) INTERNAL ASSERTION FAILED: ` + t
  throw (Nt(e), new Error(e))
}
function fe(t, e) {
  t || S()
}
function U(t, e) {
  return t
}
var y = {
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
  E = class extends et {
    constructor(e, n) {
      super(e, n),
        (this.code = e),
        (this.message = n),
        (this.toString = () =>
          `${this.name}: [code=${this.code}]: ${this.message}`)
    }
  }
var zt = class {
  constructor() {
    this.promise = new Promise((e, n) => {
      ;(this.resolve = e), (this.reject = n)
    })
  }
}
var $a = class {
    constructor(e, n) {
      ;(this.user = n),
        (this.type = 'OAuth'),
        (this.headers = new Map()),
        this.headers.set('Authorization', `Bearer ${e}`)
    }
  },
  Ch = class {
    getToken() {
      return Promise.resolve(null)
    }
    invalidateToken() {}
    start(e, n) {
      e.enqueueRetryable(() => n(_e.UNAUTHENTICATED))
    }
    shutdown() {}
  },
  bh = class {
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
  Ah = class {
    constructor(e) {
      ;(this.t = e),
        (this.currentUser = _e.UNAUTHENTICATED),
        (this.i = 0),
        (this.forceRefresh = !1),
        (this.auth = null)
    }
    start(e, n) {
      let r = this.i,
        i = (c) => (this.i !== r ? ((r = this.i), n(c)) : Promise.resolve()),
        s = new zt()
      this.o = () => {
        this.i++,
          (this.currentUser = this.u()),
          s.resolve(),
          (s = new zt()),
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
          _('FirebaseAuthCredentialsProvider', 'Auth detected'),
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
              : (_('FirebaseAuthCredentialsProvider', 'Auth not yet detected'),
                s.resolve(),
                (s = new zt()))
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
                  ? (_(
                      'FirebaseAuthCredentialsProvider',
                      'getToken aborted due to token change.'
                    ),
                    this.getToken())
                  : r
                    ? (fe(typeof r.accessToken == 'string'),
                      new $a(r.accessToken, this.currentUser))
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
      return fe(e === null || typeof e == 'string'), new _e(e)
    }
  },
  Sh = class {
    constructor(e, n, r) {
      ;(this.l = e),
        (this.h = n),
        (this.P = r),
        (this.type = 'FirstParty'),
        (this.user = _e.FIRST_PARTY),
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
  xh = class {
    constructor(e, n, r) {
      ;(this.l = e), (this.h = n), (this.P = r)
    }
    getToken() {
      return Promise.resolve(new Sh(this.l, this.h, this.P))
    }
    start(e, n) {
      e.enqueueRetryable(() => n(_e.FIRST_PARTY))
    }
    shutdown() {}
    invalidateToken() {}
  },
  Nh = class {
    constructor(e) {
      ;(this.value = e),
        (this.type = 'AppCheck'),
        (this.headers = new Map()),
        e && e.length > 0 && this.headers.set('x-firebase-appcheck', this.value)
    }
  },
  Rh = class {
    constructor(e) {
      ;(this.A = e),
        (this.forceRefresh = !1),
        (this.appCheck = null),
        (this.R = null)
    }
    start(e, n) {
      let r = (s) => {
        s.error != null &&
          _(
            'FirebaseAppCheckTokenProvider',
            `Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`
          )
        let o = s.token !== this.R
        return (
          (this.R = s.token),
          _(
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
        _('FirebaseAppCheckTokenProvider', 'AppCheck detected'),
          (this.appCheck = s),
          this.appCheck.addTokenListener(this.o)
      }
      this.A.onInit((s) => i(s)),
        setTimeout(() => {
          if (!this.appCheck) {
            let s = this.A.getImmediate({ optional: !0 })
            s
              ? i(s)
              : _('FirebaseAppCheckTokenProvider', 'AppCheck not yet detected')
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
                  ? (fe(typeof n.token == 'string'),
                    (this.R = n.token),
                    new Nh(n.token))
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
function MN(t) {
  let e = typeof self < 'u' && (self.crypto || self.msCrypto),
    n = new Uint8Array(t)
  if (e && typeof e.getRandomValues == 'function') e.getRandomValues(n)
  else for (let r = 0; r < t; r++) n[r] = Math.floor(256 * Math.random())
  return n
}
var Mh = class {
  static newId() {
    let e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      n = Math.floor(256 / e.length) * e.length,
      r = ''
    for (; r.length < 20; ) {
      let i = MN(40)
      for (let s = 0; s < i.length; ++s)
        r.length < 20 && i[s] < n && (r += e.charAt(i[s] % e.length))
    }
    return r
  }
}
function B(t, e) {
  return t < e ? -1 : t > e ? 1 : 0
}
function jr(t, e, n) {
  return t.length === e.length && t.every((r, i) => n(r, e[i]))
}
var rt = class t {
  constructor(e, n) {
    if (((this.seconds = e), (this.nanoseconds = n), n < 0))
      throw new E(
        y.INVALID_ARGUMENT,
        'Timestamp nanoseconds out of range: ' + n
      )
    if (n >= 1e9)
      throw new E(
        y.INVALID_ARGUMENT,
        'Timestamp nanoseconds out of range: ' + n
      )
    if (e < -62135596800)
      throw new E(y.INVALID_ARGUMENT, 'Timestamp seconds out of range: ' + e)
    if (e >= 253402300800)
      throw new E(y.INVALID_ARGUMENT, 'Timestamp seconds out of range: ' + e)
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
      ? B(this.nanoseconds, e.nanoseconds)
      : B(this.seconds, e.seconds)
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
var N = class t {
  constructor(e) {
    this.timestamp = e
  }
  static fromTimestamp(e) {
    return new t(e)
  }
  static min() {
    return new t(new rt(0, 0))
  }
  static max() {
    return new t(new rt(253402300799, 999999999))
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
var Ha = class t {
    constructor(e, n, r) {
      n === void 0 ? (n = 0) : n > e.length && S(),
        r === void 0 ? (r = e.length - n) : r > e.length - n && S(),
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
  he = class t extends Ha {
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
            y.INVALID_ARGUMENT,
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
  PN = /^[_a-zA-Z][_a-zA-Z0-9]*$/,
  pt = class t extends Ha {
    construct(e, n, r) {
      return new t(e, n, r)
    }
    static isValidIdentifier(e) {
      return PN.test(e)
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
              y.INVALID_ARGUMENT,
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
              y.INVALID_ARGUMENT,
              'Path has trailing escape character: ' + e
            )
          let c = e[i + 1]
          if (c !== '\\' && c !== '.' && c !== '`')
            throw new E(
              y.INVALID_ARGUMENT,
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
        throw new E(y.INVALID_ARGUMENT, 'Unterminated ` in path: ' + e)
      return new t(n)
    }
    static emptyPath() {
      return new t([])
    }
  }
var T = class t {
  constructor(e) {
    this.path = e
  }
  static fromPath(e) {
    return new t(he.fromString(e))
  }
  static fromName(e) {
    return new t(he.fromString(e).popFirst(5))
  }
  static empty() {
    return new t(he.emptyPath())
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
    return e !== null && he.comparator(this.path, e.path) === 0
  }
  toString() {
    return this.path.toString()
  }
  static comparator(e, n) {
    return he.comparator(e.path, n.path)
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0
  }
  static fromSegments(e) {
    return new t(new he(e.slice()))
  }
}
var Ph = class {
  constructor(e, n, r, i) {
    ;(this.indexId = e),
      (this.collectionGroup = n),
      (this.fields = r),
      (this.indexState = i)
  }
}
Ph.UNKNOWN_ID = -1
function kN(t, e) {
  let n = t.toTimestamp().seconds,
    r = t.toTimestamp().nanoseconds + 1,
    i = N.fromTimestamp(r === 1e9 ? new rt(n + 1, 0) : new rt(n, r))
  return new Jn(i, T.empty(), e)
}
function ON(t) {
  return new Jn(t.readTime, t.key, -1)
}
var Jn = class t {
  constructor(e, n, r) {
    ;(this.readTime = e), (this.documentKey = n), (this.largestBatchId = r)
  }
  static min() {
    return new t(N.min(), T.empty(), -1)
  }
  static max() {
    return new t(N.max(), T.empty(), -1)
  }
}
function FN(t, e) {
  let n = t.readTime.compareTo(e.readTime)
  return n !== 0
    ? n
    : ((n = T.comparator(t.documentKey, e.documentKey)),
      n !== 0 ? n : B(t.largestBatchId, e.largestBatchId))
}
var LN =
    'The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.',
  kh = class {
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
function np(t) {
  return p(this, null, function* () {
    if (t.code !== y.FAILED_PRECONDITION || t.message !== LN) throw t
    _('LocalStore', 'Unexpectedly lost primary lease')
  })
}
var m = class t {
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
      this.callbackAttached && S(),
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
var Oh = class t {
    constructor(e, n) {
      ;(this.action = e),
        (this.transaction = n),
        (this.aborted = !1),
        (this.V = new zt()),
        (this.transaction.oncomplete = () => {
          this.V.resolve()
        }),
        (this.transaction.onabort = () => {
          n.error ? this.V.reject(new Qn(e, n.error)) : this.V.resolve()
        }),
        (this.transaction.onerror = (r) => {
          let i = rp(r.target.error)
          this.V.reject(new Qn(e, i))
        })
    }
    static open(e, n, r, i) {
      try {
        return new t(n, e.transaction(i, r))
      } catch (s) {
        throw new Qn(n, s)
      }
    }
    get m() {
      return this.V.promise
    }
    abort(e) {
      e && this.V.reject(e),
        this.aborted ||
          (_(
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
      return new Lh(n)
    }
  },
  qa = class t {
    constructor(e, n, r) {
      ;(this.name = e),
        (this.version = n),
        (this.p = r),
        t.S(be()) === 12.2 &&
          Nt(
            'Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.'
          )
    }
    static delete(e) {
      return (
        _('SimpleDb', 'Removing database:', e),
        qn(window.indexedDB.deleteDatabase(e)).toPromise()
      )
    }
    static D() {
      if (!qo()) return !1
      if (t.C()) return !0
      let e = be(),
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
            (_('SimpleDb', 'Opening database:', this.name),
            (this.db = yield new Promise((n, r) => {
              let i = indexedDB.open(this.name, this.version)
              ;(i.onsuccess = (s) => {
                let o = s.target.result
                n(o)
              }),
                (i.onblocked = () => {
                  r(
                    new Qn(
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
                          y.FAILED_PRECONDITION,
                          'A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.'
                        )
                      )
                    : o.name === 'InvalidStateError'
                      ? r(
                          new E(
                            y.FAILED_PRECONDITION,
                            'Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: ' +
                              o
                          )
                        )
                      : r(new Qn(e, o))
                }),
                (i.onupgradeneeded = (s) => {
                  _(
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
                      _(
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
            let a = Oh.open(this.db, e, s ? 'readonly' : 'readwrite', r),
              c = i(a)
                .next((u) => (a.g(), u))
                .catch((u) => (a.abort(u), m.reject(u)))
                .toPromise()
            return c.catch(() => {}), yield a.m, c
          } catch (a) {
            let c = a,
              u = c.name !== 'FirebaseError' && o < 3
            if (
              (_(
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
  Fh = class {
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
      return qn(this.k.delete())
    }
  },
  Qn = class extends E {
    constructor(e, n) {
      super(y.UNAVAILABLE, `IndexedDB transaction '${e}' failed: ${n}`),
        (this.name = 'IndexedDbTransactionError')
    }
  }
function bs(t) {
  return t.name === 'IndexedDbTransactionError'
}
var Lh = class {
  constructor(e) {
    this.store = e
  }
  put(e, n) {
    let r
    return (
      n !== void 0
        ? (_('SimpleDb', 'PUT', this.store.name, e, n),
          (r = this.store.put(n, e)))
        : (_('SimpleDb', 'PUT', this.store.name, '<auto-key>', e),
          (r = this.store.put(e))),
      qn(r)
    )
  }
  add(e) {
    return _('SimpleDb', 'ADD', this.store.name, e, e), qn(this.store.add(e))
  }
  get(e) {
    return qn(this.store.get(e)).next(
      (n) => (
        n === void 0 && (n = null),
        _('SimpleDb', 'GET', this.store.name, e, n),
        n
      )
    )
  }
  delete(e) {
    return _('SimpleDb', 'DELETE', this.store.name, e), qn(this.store.delete(e))
  }
  count() {
    return _('SimpleDb', 'COUNT', this.store.name), qn(this.store.count())
  }
  W(e, n) {
    let r = this.options(e, n),
      i = r.index ? this.store.index(r.index) : this.store
    if (typeof i.getAll == 'function') {
      let s = i.getAll(r.range)
      return new m((o, a) => {
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
    return new m((i, s) => {
      ;(r.onerror = (o) => {
        s(o.target.error)
      }),
        (r.onsuccess = (o) => {
          i(o.target.result)
        })
    })
  }
  H(e, n) {
    _('SimpleDb', 'DELETE ALL', this.store.name)
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
    return new m((r, i) => {
      ;(n.onerror = (s) => {
        let o = rp(s.target.error)
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
    return new m((i, s) => {
      ;(e.onerror = (o) => {
        s(o.target.error)
      }),
        (e.onsuccess = (o) => {
          let a = o.target.result
          if (!a) return void i()
          let c = new Fh(a),
            u = n(a.primaryKey, a.value, c)
          if (u instanceof m) {
            let l = u.catch((d) => (c.done(), m.reject(d)))
            r.push(l)
          }
          c.isDone ? i() : c.$ === null ? a.continue() : a.continue(c.$)
        })
    }).next(() => m.waitFor(r))
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
function qn(t) {
  return new m((e, n) => {
    ;(t.onsuccess = (r) => {
      let i = r.target.result
      e(i)
    }),
      (t.onerror = (r) => {
        let i = rp(r.target.error)
        n(i)
      })
  })
}
var aI = !1
function rp(t) {
  let e = qa.S(be())
  if (e >= 12.2 && e < 13) {
    let n = 'An internal error was encountered in the Indexed Database server'
    if (t.message.indexOf(n) >= 0) {
      let r = new E(
        'internal',
        `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${n}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`
      )
      return (
        aI ||
          ((aI = !0),
          setTimeout(() => {
            throw r
          }, 0)),
        r
      )
    }
  }
  return t
}
var LI = (() => {
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
function mc(t) {
  return t == null
}
function za(t) {
  return t === 0 && 1 / t == -1 / 0
}
var VN = [
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
  qV = [...VN, 'documentOverlays'],
  UN = [
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
  jN = UN,
  zV = [...jN, 'indexConfiguration', 'indexState', 'indexEntries']
function cI(t) {
  let e = 0
  for (let n in t) Object.prototype.hasOwnProperty.call(t, n) && e++
  return e
}
function gc(t, e) {
  for (let n in t) Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n])
}
function BN(t) {
  for (let e in t) if (Object.prototype.hasOwnProperty.call(t, e)) return !1
  return !0
}
var se = class t {
    constructor(e, n) {
      ;(this.comparator = e), (this.root = n || St.EMPTY)
    }
    insert(e, n) {
      return new t(
        this.comparator,
        this.root
          .insert(e, n, this.comparator)
          .copy(null, null, St.BLACK, null, null)
      )
    }
    remove(e) {
      return new t(
        this.comparator,
        this.root
          .remove(e, this.comparator)
          .copy(null, null, St.BLACK, null, null)
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
      return new kr(this.root, null, this.comparator, !1)
    }
    getIteratorFrom(e) {
      return new kr(this.root, e, this.comparator, !1)
    }
    getReverseIterator() {
      return new kr(this.root, null, this.comparator, !0)
    }
    getReverseIteratorFrom(e) {
      return new kr(this.root, e, this.comparator, !0)
    }
  },
  kr = class {
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
  St = class t {
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
      if ((this.isRed() && this.left.isRed()) || this.right.isRed()) throw S()
      let e = this.left.check()
      if (e !== this.right.check()) throw S()
      return e + (this.isRed() ? 0 : 1)
    }
  }
;(St.EMPTY = null), (St.RED = !0), (St.BLACK = !1)
St.EMPTY = new (class {
  constructor() {
    this.size = 0
  }
  get key() {
    throw S()
  }
  get value() {
    throw S()
  }
  get color() {
    throw S()
  }
  get left() {
    throw S()
  }
  get right() {
    throw S()
  }
  copy(e, n, r, i, s) {
    return this
  }
  insert(e, n, r) {
    return new St(e, n)
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
var Ne = class t {
    constructor(e) {
      ;(this.comparator = e), (this.data = new se(this.comparator))
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
      return new Ga(this.data.getIterator())
    }
    getIteratorFrom(e) {
      return new Ga(this.data.getIteratorFrom(e))
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
  Ga = class {
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
var zn = class t {
  constructor(e) {
    ;(this.fields = e), e.sort(pt.comparator)
  }
  static empty() {
    return new t([])
  }
  unionWith(e) {
    let n = new Ne(pt.comparator)
    for (let r of this.fields) n = n.add(r)
    for (let r of e) n = n.add(r)
    return new t(n.toArray())
  }
  covers(e) {
    for (let n of this.fields) if (n.isPrefixOf(e)) return !0
    return !1
  }
  isEqual(e) {
    return jr(this.fields, e.fields, (n, r) => n.isEqual(r))
  }
}
var Wa = class extends Error {
  constructor() {
    super(...arguments), (this.name = 'Base64DecodeError')
  }
}
var Fe = class t {
  constructor(e) {
    this.binaryString = e
  }
  static fromBase64String(e) {
    let n = (function (i) {
      try {
        return atob(i)
      } catch (s) {
        throw typeof DOMException < 'u' && s instanceof DOMException
          ? new Wa('Invalid base64 string: ' + s)
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
    return B(this.binaryString, e.binaryString)
  }
  isEqual(e) {
    return this.binaryString === e.binaryString
  }
}
Fe.EMPTY_BYTE_STRING = new Fe('')
var $N = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/)
function dn(t) {
  if ((fe(!!t), typeof t == 'string')) {
    let e = 0,
      n = $N.exec(t)
    if ((fe(!!n), n[1])) {
      let i = n[1]
      ;(i = (i + '000000000').substr(0, 9)), (e = Number(i))
    }
    let r = new Date(t)
    return { seconds: Math.floor(r.getTime() / 1e3), nanos: e }
  }
  return { seconds: ne(t.seconds), nanos: ne(t.nanos) }
}
function ne(t) {
  return typeof t == 'number' ? t : typeof t == 'string' ? Number(t) : 0
}
function hn(t) {
  return typeof t == 'string' ? Fe.fromBase64String(t) : Fe.fromUint8Array(t)
}
function ip(t) {
  var e, n
  return (
    ((n = (
      ((e = t?.mapValue) === null || e === void 0 ? void 0 : e.fields) || {}
    ).__type__) === null || n === void 0
      ? void 0
      : n.stringValue) === 'server_timestamp'
  )
}
function sp(t) {
  let e = t.mapValue.fields.__previous_value__
  return ip(e) ? sp(e) : e
}
function ps(t) {
  let e = dn(t.mapValue.fields.__local_write_time__.timestampValue)
  return new rt(e.seconds, e.nanos)
}
var Vh = class {
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
  Ka = class t {
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
var Va = { mapValue: { fields: { __type__: { stringValue: '__max__' } } } }
function Zn(t) {
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
                      ? ip(t)
                        ? 4
                        : VI(t)
                          ? 9007199254740991
                          : 10
                      : S()
}
function Rt(t, e) {
  if (t === e) return !0
  let n = Zn(t)
  if (n !== Zn(e)) return !1
  switch (n) {
    case 0:
    case 9007199254740991:
      return !0
    case 1:
      return t.booleanValue === e.booleanValue
    case 4:
      return ps(t).isEqual(ps(e))
    case 3:
      return (function (i, s) {
        if (
          typeof i.timestampValue == 'string' &&
          typeof s.timestampValue == 'string' &&
          i.timestampValue.length === s.timestampValue.length
        )
          return i.timestampValue === s.timestampValue
        let o = dn(i.timestampValue),
          a = dn(s.timestampValue)
        return o.seconds === a.seconds && o.nanos === a.nanos
      })(t, e)
    case 5:
      return t.stringValue === e.stringValue
    case 6:
      return (function (i, s) {
        return hn(i.bytesValue).isEqual(hn(s.bytesValue))
      })(t, e)
    case 7:
      return t.referenceValue === e.referenceValue
    case 8:
      return (function (i, s) {
        return (
          ne(i.geoPointValue.latitude) === ne(s.geoPointValue.latitude) &&
          ne(i.geoPointValue.longitude) === ne(s.geoPointValue.longitude)
        )
      })(t, e)
    case 2:
      return (function (i, s) {
        if ('integerValue' in i && 'integerValue' in s)
          return ne(i.integerValue) === ne(s.integerValue)
        if ('doubleValue' in i && 'doubleValue' in s) {
          let o = ne(i.doubleValue),
            a = ne(s.doubleValue)
          return o === a ? za(o) === za(a) : isNaN(o) && isNaN(a)
        }
        return !1
      })(t, e)
    case 9:
      return jr(t.arrayValue.values || [], e.arrayValue.values || [], Rt)
    case 10:
      return (function (i, s) {
        let o = i.mapValue.fields || {},
          a = s.mapValue.fields || {}
        if (cI(o) !== cI(a)) return !1
        for (let c in o)
          if (o.hasOwnProperty(c) && (a[c] === void 0 || !Rt(o[c], a[c])))
            return !1
        return !0
      })(t, e)
    default:
      return S()
  }
}
function ms(t, e) {
  return (t.values || []).find((n) => Rt(n, e)) !== void 0
}
function Br(t, e) {
  if (t === e) return 0
  let n = Zn(t),
    r = Zn(e)
  if (n !== r) return B(n, r)
  switch (n) {
    case 0:
    case 9007199254740991:
      return 0
    case 1:
      return B(t.booleanValue, e.booleanValue)
    case 2:
      return (function (s, o) {
        let a = ne(s.integerValue || s.doubleValue),
          c = ne(o.integerValue || o.doubleValue)
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
      return uI(t.timestampValue, e.timestampValue)
    case 4:
      return uI(ps(t), ps(e))
    case 5:
      return B(t.stringValue, e.stringValue)
    case 6:
      return (function (s, o) {
        let a = hn(s),
          c = hn(o)
        return a.compareTo(c)
      })(t.bytesValue, e.bytesValue)
    case 7:
      return (function (s, o) {
        let a = s.split('/'),
          c = o.split('/')
        for (let u = 0; u < a.length && u < c.length; u++) {
          let l = B(a[u], c[u])
          if (l !== 0) return l
        }
        return B(a.length, c.length)
      })(t.referenceValue, e.referenceValue)
    case 8:
      return (function (s, o) {
        let a = B(ne(s.latitude), ne(o.latitude))
        return a !== 0 ? a : B(ne(s.longitude), ne(o.longitude))
      })(t.geoPointValue, e.geoPointValue)
    case 9:
      return (function (s, o) {
        let a = s.values || [],
          c = o.values || []
        for (let u = 0; u < a.length && u < c.length; ++u) {
          let l = Br(a[u], c[u])
          if (l) return l
        }
        return B(a.length, c.length)
      })(t.arrayValue, e.arrayValue)
    case 10:
      return (function (s, o) {
        if (s === Va.mapValue && o === Va.mapValue) return 0
        if (s === Va.mapValue) return 1
        if (o === Va.mapValue) return -1
        let a = s.fields || {},
          c = Object.keys(a),
          u = o.fields || {},
          l = Object.keys(u)
        c.sort(), l.sort()
        for (let d = 0; d < c.length && d < l.length; ++d) {
          let h = B(c[d], l[d])
          if (h !== 0) return h
          let f = Br(a[c[d]], u[l[d]])
          if (f !== 0) return f
        }
        return B(c.length, l.length)
      })(t.mapValue, e.mapValue)
    default:
      throw S()
  }
}
function uI(t, e) {
  if (typeof t == 'string' && typeof e == 'string' && t.length === e.length)
    return B(t, e)
  let n = dn(t),
    r = dn(e),
    i = B(n.seconds, r.seconds)
  return i !== 0 ? i : B(n.nanos, r.nanos)
}
function $r(t) {
  return Uh(t)
}
function Uh(t) {
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
                let r = dn(n)
                return `time(${r.seconds},${r.nanos})`
              })(t.timestampValue)
            : 'stringValue' in t
              ? t.stringValue
              : 'bytesValue' in t
                ? (function (n) {
                    return hn(n).toBase64()
                  })(t.bytesValue)
                : 'referenceValue' in t
                  ? (function (n) {
                      return T.fromName(n).toString()
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
                            i ? (i = !1) : (r += ','), (r += Uh(s))
                          return r + ']'
                        })(t.arrayValue)
                      : 'mapValue' in t
                        ? (function (n) {
                            let r = Object.keys(n.fields || {}).sort(),
                              i = '{',
                              s = !0
                            for (let o of r)
                              s ? (s = !1) : (i += ','),
                                (i += `${o}:${Uh(n.fields[o])}`)
                            return i + '}'
                          })(t.mapValue)
                        : S()
}
function jh(t) {
  return !!t && 'integerValue' in t
}
function op(t) {
  return !!t && 'arrayValue' in t
}
function lI(t) {
  return !!t && 'nullValue' in t
}
function dI(t) {
  return !!t && 'doubleValue' in t && isNaN(Number(t.doubleValue))
}
function Ih(t) {
  return !!t && 'mapValue' in t
}
function us(t) {
  if (t.geoPointValue)
    return { geoPointValue: Object.assign({}, t.geoPointValue) }
  if (t.timestampValue && typeof t.timestampValue == 'object')
    return { timestampValue: Object.assign({}, t.timestampValue) }
  if (t.mapValue) {
    let e = { mapValue: { fields: {} } }
    return gc(t.mapValue.fields, (n, r) => (e.mapValue.fields[n] = us(r))), e
  }
  if (t.arrayValue) {
    let e = { arrayValue: { values: [] } }
    for (let n = 0; n < (t.arrayValue.values || []).length; ++n)
      e.arrayValue.values[n] = us(t.arrayValue.values[n])
    return e
  }
  return Object.assign({}, t)
}
function VI(t) {
  return (
    (((t.mapValue || {}).fields || {}).__type__ || {}).stringValue === '__max__'
  )
}
var qt = class t {
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
        if (((n = (n.mapValue.fields || {})[e.get(r)]), !Ih(n))) return null
      return (n = (n.mapValue.fields || {})[e.lastSegment()]), n || null
    }
  }
  set(e, n) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = us(n)
  }
  setAll(e) {
    let n = pt.emptyPath(),
      r = {},
      i = []
    e.forEach((o, a) => {
      if (!n.isImmediateParentOf(a)) {
        let c = this.getFieldsMap(n)
        this.applyChanges(c, r, i), (r = {}), (i = []), (n = a.popLast())
      }
      o ? (r[a.lastSegment()] = us(o)) : i.push(a.lastSegment())
    })
    let s = this.getFieldsMap(n)
    this.applyChanges(s, r, i)
  }
  delete(e) {
    let n = this.field(e.popLast())
    Ih(n) && n.mapValue.fields && delete n.mapValue.fields[e.lastSegment()]
  }
  isEqual(e) {
    return Rt(this.value, e.value)
  }
  getFieldsMap(e) {
    let n = this.value
    n.mapValue.fields || (n.mapValue = { fields: {} })
    for (let r = 0; r < e.length; ++r) {
      let i = n.mapValue.fields[e.get(r)]
      ;(Ih(i) && i.mapValue.fields) ||
        ((i = { mapValue: { fields: {} } }), (n.mapValue.fields[e.get(r)] = i)),
        (n = i)
    }
    return n.mapValue.fields
  }
  applyChanges(e, n, r) {
    gc(n, (i, s) => (e[i] = s))
    for (let i of r) delete e[i]
  }
  clone() {
    return new t(us(this.value))
  }
}
var mt = class t {
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
    return new t(e, 0, N.min(), N.min(), N.min(), qt.empty(), 0)
  }
  static newFoundDocument(e, n, r, i) {
    return new t(e, 1, n, N.min(), r, i, 0)
  }
  static newNoDocument(e, n) {
    return new t(e, 2, n, N.min(), N.min(), qt.empty(), 0)
  }
  static newUnknownDocument(e, n) {
    return new t(e, 3, n, N.min(), N.min(), qt.empty(), 2)
  }
  convertToFoundDocument(e, n) {
    return (
      !this.createTime.isEqual(N.min()) ||
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
      (this.data = qt.empty()),
      (this.documentState = 0),
      this
    )
  }
  convertToUnknownDocument(e) {
    return (
      (this.version = e),
      (this.documentType = 3),
      (this.data = qt.empty()),
      (this.documentState = 2),
      this
    )
  }
  setHasCommittedMutations() {
    return (this.documentState = 2), this
  }
  setHasLocalMutations() {
    return (this.documentState = 1), (this.version = N.min()), this
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
var Hr = class {
  constructor(e, n) {
    ;(this.position = e), (this.inclusive = n)
  }
}
function hI(t, e, n) {
  let r = 0
  for (let i = 0; i < t.position.length; i++) {
    let s = e[i],
      o = t.position[i]
    if (
      (s.field.isKeyField()
        ? (r = T.comparator(T.fromName(o.referenceValue), n.key))
        : (r = Br(o, n.data.field(s.field))),
      s.dir === 'desc' && (r *= -1),
      r !== 0)
    )
      break
  }
  return r
}
function fI(t, e) {
  if (t === null) return e === null
  if (
    e === null ||
    t.inclusive !== e.inclusive ||
    t.position.length !== e.position.length
  )
    return !1
  for (let n = 0; n < t.position.length; n++)
    if (!Rt(t.position[n], e.position[n])) return !1
  return !0
}
var qr = class {
  constructor(e, n = 'asc') {
    ;(this.field = e), (this.dir = n)
  }
}
function HN(t, e) {
  return t.dir === e.dir && t.field.isEqual(e.field)
}
var Qa = class {},
  me = class t extends Qa {
    constructor(e, n, r) {
      super(), (this.field = e), (this.op = n), (this.value = r)
    }
    static create(e, n, r) {
      return e.isKeyField()
        ? n === 'in' || n === 'not-in'
          ? this.createKeyFieldInFilter(e, n, r)
          : new $h(e, n, r)
        : n === 'array-contains'
          ? new zh(e, r)
          : n === 'in'
            ? new Gh(e, r)
            : n === 'not-in'
              ? new Wh(e, r)
              : n === 'array-contains-any'
                ? new Kh(e, r)
                : new t(e, n, r)
    }
    static createKeyFieldInFilter(e, n, r) {
      return n === 'in' ? new Hh(e, r) : new qh(e, r)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return this.op === '!='
        ? n !== null && this.matchesComparison(Br(n, this.value))
        : n !== null &&
            Zn(this.value) === Zn(n) &&
            this.matchesComparison(Br(n, this.value))
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
          return S()
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
  Mt = class t extends Qa {
    constructor(e, n) {
      super(), (this.filters = e), (this.op = n), (this.ue = null)
    }
    static create(e, n) {
      return new t(e, n)
    }
    matches(e) {
      return UI(this)
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
function UI(t) {
  return t.op === 'and'
}
function jI(t) {
  return qN(t) && UI(t)
}
function qN(t) {
  for (let e of t.filters) if (e instanceof Mt) return !1
  return !0
}
function Bh(t) {
  if (t instanceof me)
    return t.field.canonicalString() + t.op.toString() + $r(t.value)
  if (jI(t)) return t.filters.map((e) => Bh(e)).join(',')
  {
    let e = t.filters.map((n) => Bh(n)).join(',')
    return `${t.op}(${e})`
  }
}
function BI(t, e) {
  return t instanceof me
    ? (function (r, i) {
        return (
          i instanceof me &&
          r.op === i.op &&
          r.field.isEqual(i.field) &&
          Rt(r.value, i.value)
        )
      })(t, e)
    : t instanceof Mt
      ? (function (r, i) {
          return i instanceof Mt &&
            r.op === i.op &&
            r.filters.length === i.filters.length
            ? r.filters.reduce((s, o, a) => s && BI(o, i.filters[a]), !0)
            : !1
        })(t, e)
      : void S()
}
function $I(t) {
  return t instanceof me
    ? (function (n) {
        return `${n.field.canonicalString()} ${n.op} ${$r(n.value)}`
      })(t)
    : t instanceof Mt
      ? (function (n) {
          return (
            n.op.toString() + ' {' + n.getFilters().map($I).join(' ,') + '}'
          )
        })(t)
      : 'Filter'
}
var $h = class extends me {
    constructor(e, n, r) {
      super(e, n, r), (this.key = T.fromName(r.referenceValue))
    }
    matches(e) {
      let n = T.comparator(e.key, this.key)
      return this.matchesComparison(n)
    }
  },
  Hh = class extends me {
    constructor(e, n) {
      super(e, 'in', n), (this.keys = HI('in', n))
    }
    matches(e) {
      return this.keys.some((n) => n.isEqual(e.key))
    }
  },
  qh = class extends me {
    constructor(e, n) {
      super(e, 'not-in', n), (this.keys = HI('not-in', n))
    }
    matches(e) {
      return !this.keys.some((n) => n.isEqual(e.key))
    }
  }
function HI(t, e) {
  var n
  return (
    ((n = e.arrayValue) === null || n === void 0 ? void 0 : n.values) || []
  ).map((r) => T.fromName(r.referenceValue))
}
var zh = class extends me {
    constructor(e, n) {
      super(e, 'array-contains', n)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return op(n) && ms(n.arrayValue, this.value)
    }
  },
  Gh = class extends me {
    constructor(e, n) {
      super(e, 'in', n)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return n !== null && ms(this.value.arrayValue, n)
    }
  },
  Wh = class extends me {
    constructor(e, n) {
      super(e, 'not-in', n)
    }
    matches(e) {
      if (ms(this.value.arrayValue, { nullValue: 'NULL_VALUE' })) return !1
      let n = e.data.field(this.field)
      return n !== null && !ms(this.value.arrayValue, n)
    }
  },
  Kh = class extends me {
    constructor(e, n) {
      super(e, 'array-contains-any', n)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return (
        !(!op(n) || !n.arrayValue.values) &&
        n.arrayValue.values.some((r) => ms(this.value.arrayValue, r))
      )
    }
  }
var Qh = class {
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
function pI(t, e = null, n = [], r = [], i = null, s = null, o = null) {
  return new Qh(t, e, n, r, i, s, o)
}
function ap(t) {
  let e = U(t)
  if (e.ce === null) {
    let n = e.path.canonicalString()
    e.collectionGroup !== null && (n += '|cg:' + e.collectionGroup),
      (n += '|f:'),
      (n += e.filters.map((r) => Bh(r)).join(',')),
      (n += '|ob:'),
      (n += e.orderBy
        .map((r) =>
          (function (s) {
            return s.field.canonicalString() + s.dir
          })(r)
        )
        .join(',')),
      mc(e.limit) || ((n += '|l:'), (n += e.limit)),
      e.startAt &&
        ((n += '|lb:'),
        (n += e.startAt.inclusive ? 'b:' : 'a:'),
        (n += e.startAt.position.map((r) => $r(r)).join(','))),
      e.endAt &&
        ((n += '|ub:'),
        (n += e.endAt.inclusive ? 'a:' : 'b:'),
        (n += e.endAt.position.map((r) => $r(r)).join(','))),
      (e.ce = n)
  }
  return e.ce
}
function cp(t, e) {
  if (t.limit !== e.limit || t.orderBy.length !== e.orderBy.length) return !1
  for (let n = 0; n < t.orderBy.length; n++)
    if (!HN(t.orderBy[n], e.orderBy[n])) return !1
  if (t.filters.length !== e.filters.length) return !1
  for (let n = 0; n < t.filters.length; n++)
    if (!BI(t.filters[n], e.filters[n])) return !1
  return (
    t.collectionGroup === e.collectionGroup &&
    !!t.path.isEqual(e.path) &&
    !!fI(t.startAt, e.startAt) &&
    fI(t.endAt, e.endAt)
  )
}
function Yh(t) {
  return (
    T.isDocumentKey(t.path) &&
    t.collectionGroup === null &&
    t.filters.length === 0
  )
}
var zr = class {
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
function zN(t, e, n, r, i, s, o, a) {
  return new zr(t, e, n, r, i, s, o, a)
}
function up(t) {
  return new zr(t)
}
function mI(t) {
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
function GN(t) {
  return t.collectionGroup !== null
}
function ls(t) {
  let e = U(t)
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
      let a = new Ne(pt.comparator)
      return (
        o.filters.forEach((c) => {
          c.getFlattenedFilters().forEach((u) => {
            u.isInequality() && (a = a.add(u.field))
          })
        }),
        a
      )
    })(e).forEach((s) => {
      n.has(s.canonicalString()) || s.isKeyField() || e.le.push(new qr(s, r))
    }),
      n.has(pt.keyField().canonicalString()) ||
        e.le.push(new qr(pt.keyField(), r))
  }
  return e.le
}
function xt(t) {
  let e = U(t)
  return e.he || (e.he = WN(e, ls(t))), e.he
}
function WN(t, e) {
  if (t.limitType === 'F')
    return pI(
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
      return new qr(i.field, s)
    })
    let n = t.endAt ? new Hr(t.endAt.position, t.endAt.inclusive) : null,
      r = t.startAt ? new Hr(t.startAt.position, t.startAt.inclusive) : null
    return pI(t.path, t.collectionGroup, e, t.filters, t.limit, n, r)
  }
}
function Jh(t, e, n) {
  return new zr(
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
function yc(t, e) {
  return cp(xt(t), xt(e)) && t.limitType === e.limitType
}
function qI(t) {
  return `${ap(xt(t))}|lt:${t.limitType}`
}
function Rr(t) {
  return `Query(target=${(function (n) {
    let r = n.path.canonicalString()
    return (
      n.collectionGroup !== null &&
        (r += ' collectionGroup=' + n.collectionGroup),
      n.filters.length > 0 &&
        (r += `, filters: [${n.filters.map((i) => $I(i)).join(', ')}]`),
      mc(n.limit) || (r += ', limit: ' + n.limit),
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
        (r += n.startAt.position.map((i) => $r(i)).join(','))),
      n.endAt &&
        ((r += ', endAt: '),
        (r += n.endAt.inclusive ? 'a:' : 'b:'),
        (r += n.endAt.position.map((i) => $r(i)).join(','))),
      `Target(${r})`
    )
  })(xt(t))}; limitType=${t.limitType})`
}
function vc(t, e) {
  return (
    e.isFoundDocument() &&
    (function (r, i) {
      let s = i.key.path
      return r.collectionGroup !== null
        ? i.key.hasCollectionId(r.collectionGroup) && r.path.isPrefixOf(s)
        : T.isDocumentKey(r.path)
          ? r.path.isEqual(s)
          : r.path.isImmediateParentOf(s)
    })(t, e) &&
    (function (r, i) {
      for (let s of ls(r))
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
            let u = hI(o, a, c)
            return o.inclusive ? u <= 0 : u < 0
          })(r.startAt, ls(r), i)) ||
        (r.endAt &&
          !(function (o, a, c) {
            let u = hI(o, a, c)
            return o.inclusive ? u >= 0 : u > 0
          })(r.endAt, ls(r), i))
      )
    })(t, e)
  )
}
function KN(t) {
  return (
    t.collectionGroup ||
    (t.path.length % 2 == 1
      ? t.path.lastSegment()
      : t.path.get(t.path.length - 2))
  )
}
function zI(t) {
  return (e, n) => {
    let r = !1
    for (let i of ls(t)) {
      let s = QN(i, e, n)
      if (s !== 0) return s
      r = r || i.field.isKeyField()
    }
    return 0
  }
}
function QN(t, e, n) {
  let r = t.field.isKeyField()
    ? T.comparator(e.key, n.key)
    : (function (s, o, a) {
        let c = o.data.field(s),
          u = a.data.field(s)
        return c !== null && u !== null ? Br(c, u) : S()
      })(t.field, e, n)
  switch (t.dir) {
    case 'asc':
      return r
    case 'desc':
      return -1 * r
    default:
      return S()
  }
}
var fn = class {
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
    gc(this.inner, (n, r) => {
      for (let [i, s] of r) e(i, s)
    })
  }
  isEmpty() {
    return BN(this.inner)
  }
  size() {
    return this.innerSize
  }
}
var YN = new se(T.comparator)
function pn() {
  return YN
}
var GI = new se(T.comparator)
function cs(...t) {
  let e = GI
  for (let n of t) e = e.insert(n.key, n)
  return e
}
function JN(t) {
  let e = GI
  return t.forEach((n, r) => (e = e.insert(n, r.overlayedDocument))), e
}
function Gn() {
  return ds()
}
function WI() {
  return ds()
}
function ds() {
  return new fn(
    (t) => t.toString(),
    (t, e) => t.isEqual(e)
  )
}
var WV = new se(T.comparator),
  ZN = new Ne(T.comparator)
function L(...t) {
  let e = ZN
  for (let n of t) e = e.add(n)
  return e
}
var XN = new Ne(B)
function eR() {
  return XN
}
function tR(t, e) {
  if (t.useProto3Json) {
    if (isNaN(e)) return { doubleValue: 'NaN' }
    if (e === 1 / 0) return { doubleValue: 'Infinity' }
    if (e === -1 / 0) return { doubleValue: '-Infinity' }
  }
  return { doubleValue: za(e) ? '-0' : e }
}
function nR(t) {
  return { integerValue: '' + t }
}
var Gr = class {
  constructor() {
    this._ = void 0
  }
}
function rR(t, e, n) {
  return t instanceof gs
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
          s && ip(s) && (s = sp(s)),
          s && (o.fields.__previous_value__ = s),
          { mapValue: o }
        )
      })(n, e)
    : t instanceof Wr
      ? KI(t, e)
      : t instanceof Kr
        ? QI(t, e)
        : (function (i, s) {
            let o = sR(i, s),
              a = gI(o) + gI(i.Ie)
            return jh(o) && jh(i.Ie) ? nR(a) : tR(i.serializer, a)
          })(t, e)
}
function iR(t, e, n) {
  return t instanceof Wr ? KI(t, e) : t instanceof Kr ? QI(t, e) : n
}
function sR(t, e) {
  return t instanceof ys
    ? (function (r) {
        return (
          jh(r) ||
          (function (s) {
            return !!s && 'doubleValue' in s
          })(r)
        )
      })(e)
      ? e
      : { integerValue: 0 }
    : null
}
var gs = class extends Gr {},
  Wr = class extends Gr {
    constructor(e) {
      super(), (this.elements = e)
    }
  }
function KI(t, e) {
  let n = YI(e)
  for (let r of t.elements) n.some((i) => Rt(i, r)) || n.push(r)
  return { arrayValue: { values: n } }
}
var Kr = class extends Gr {
  constructor(e) {
    super(), (this.elements = e)
  }
}
function QI(t, e) {
  let n = YI(e)
  for (let r of t.elements) n = n.filter((i) => !Rt(i, r))
  return { arrayValue: { values: n } }
}
var ys = class extends Gr {
  constructor(e, n) {
    super(), (this.serializer = e), (this.Ie = n)
  }
}
function gI(t) {
  return ne(t.integerValue || t.doubleValue)
}
function YI(t) {
  return op(t) && t.arrayValue.values ? t.arrayValue.values.slice() : []
}
function oR(t, e) {
  return (
    t.field.isEqual(e.field) &&
    (function (r, i) {
      return (r instanceof Wr && i instanceof Wr) ||
        (r instanceof Kr && i instanceof Kr)
        ? jr(r.elements, i.elements, Rt)
        : r instanceof ys && i instanceof ys
          ? Rt(r.Ie, i.Ie)
          : r instanceof gs && i instanceof gs
    })(t.transform, e.transform)
  )
}
var hs = class t {
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
function ja(t, e) {
  return t.updateTime !== void 0
    ? e.isFoundDocument() && e.version.isEqual(t.updateTime)
    : t.exists === void 0 || t.exists === e.isFoundDocument()
}
var vs = class {}
function JI(t, e) {
  if (!t.hasLocalMutations || (e && e.fields.length === 0)) return null
  if (e === null)
    return t.isNoDocument()
      ? new Zh(t.key, hs.none())
      : new _s(t.key, t.data, hs.none())
  {
    let n = t.data,
      r = qt.empty(),
      i = new Ne(pt.comparator)
    for (let s of e.fields)
      if (!i.has(s)) {
        let o = n.field(s)
        o === null && s.length > 1 && ((s = s.popLast()), (o = n.field(s))),
          o === null ? r.delete(s) : r.set(s, o),
          (i = i.add(s))
      }
    return new Qr(t.key, r, new zn(i.toArray()), hs.none())
  }
}
function aR(t, e, n) {
  t instanceof _s
    ? (function (i, s, o) {
        let a = i.value.clone(),
          c = vI(i.fieldTransforms, s, o.transformResults)
        a.setAll(c),
          s.convertToFoundDocument(o.version, a).setHasCommittedMutations()
      })(t, e, n)
    : t instanceof Qr
      ? (function (i, s, o) {
          if (!ja(i.precondition, s))
            return void s.convertToUnknownDocument(o.version)
          let a = vI(i.fieldTransforms, s, o.transformResults),
            c = s.data
          c.setAll(ZI(i)),
            c.setAll(a),
            s.convertToFoundDocument(o.version, c).setHasCommittedMutations()
        })(t, e, n)
      : (function (i, s, o) {
          s.convertToNoDocument(o.version).setHasCommittedMutations()
        })(0, e, n)
}
function fs(t, e, n, r) {
  return t instanceof _s
    ? (function (s, o, a, c) {
        if (!ja(s.precondition, o)) return a
        let u = s.value.clone(),
          l = _I(s.fieldTransforms, c, o)
        return (
          u.setAll(l),
          o.convertToFoundDocument(o.version, u).setHasLocalMutations(),
          null
        )
      })(t, e, n, r)
    : t instanceof Qr
      ? (function (s, o, a, c) {
          if (!ja(s.precondition, o)) return a
          let u = _I(s.fieldTransforms, c, o),
            l = o.data
          return (
            l.setAll(ZI(s)),
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
          return ja(s.precondition, o)
            ? (o.convertToNoDocument(o.version).setHasLocalMutations(), null)
            : a
        })(t, e, n)
}
function yI(t, e) {
  return (
    t.type === e.type &&
    !!t.key.isEqual(e.key) &&
    !!t.precondition.isEqual(e.precondition) &&
    !!(function (r, i) {
      return (
        (r === void 0 && i === void 0) ||
        (!(!r || !i) && jr(r, i, (s, o) => oR(s, o)))
      )
    })(t.fieldTransforms, e.fieldTransforms) &&
    (t.type === 0
      ? t.value.isEqual(e.value)
      : t.type !== 1 ||
        (t.data.isEqual(e.data) && t.fieldMask.isEqual(e.fieldMask)))
  )
}
var _s = class extends vs {
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
  Qr = class extends vs {
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
function ZI(t) {
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
function vI(t, e, n) {
  let r = new Map()
  fe(t.length === n.length)
  for (let i = 0; i < n.length; i++) {
    let s = t[i],
      o = s.transform,
      a = e.data.field(s.field)
    r.set(s.field, iR(o, a, n[i]))
  }
  return r
}
function _I(t, e, n) {
  let r = new Map()
  for (let i of t) {
    let s = i.transform,
      o = n.data.field(i.field)
    r.set(i.field, rR(s, o, e))
  }
  return r
}
var Zh = class extends vs {
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
var Xh = class {
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
      s.key.isEqual(e.key) && aR(s, e, r[i])
    }
  }
  applyToLocalView(e, n) {
    for (let r of this.baseMutations)
      r.key.isEqual(e.key) && (n = fs(r, e, n, this.localWriteTime))
    for (let r of this.mutations)
      r.key.isEqual(e.key) && (n = fs(r, e, n, this.localWriteTime))
    return n
  }
  applyToLocalDocumentSet(e, n) {
    let r = WI()
    return (
      this.mutations.forEach((i) => {
        let s = e.get(i.key),
          o = s.overlayedDocument,
          a = this.applyToLocalView(o, s.mutatedFields)
        a = n.has(i.key) ? null : a
        let c = JI(o, a)
        c !== null && r.set(i.key, c),
          o.isValidDocument() || o.convertToNoDocument(N.min())
      }),
      r
    )
  }
  keys() {
    return this.mutations.reduce((e, n) => e.add(n.key), L())
  }
  isEqual(e) {
    return (
      this.batchId === e.batchId &&
      jr(this.mutations, e.mutations, (n, r) => yI(n, r)) &&
      jr(this.baseMutations, e.baseMutations, (n, r) => yI(n, r))
    )
  }
}
var ef = class {
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
var tf = class {
  constructor(e, n) {
    ;(this.count = e), (this.unchangedNames = n)
  }
}
var le, F
function XI(t) {
  if (t === void 0) return Nt('GRPC error has no .code'), y.UNKNOWN
  switch (t) {
    case le.OK:
      return y.OK
    case le.CANCELLED:
      return y.CANCELLED
    case le.UNKNOWN:
      return y.UNKNOWN
    case le.DEADLINE_EXCEEDED:
      return y.DEADLINE_EXCEEDED
    case le.RESOURCE_EXHAUSTED:
      return y.RESOURCE_EXHAUSTED
    case le.INTERNAL:
      return y.INTERNAL
    case le.UNAVAILABLE:
      return y.UNAVAILABLE
    case le.UNAUTHENTICATED:
      return y.UNAUTHENTICATED
    case le.INVALID_ARGUMENT:
      return y.INVALID_ARGUMENT
    case le.NOT_FOUND:
      return y.NOT_FOUND
    case le.ALREADY_EXISTS:
      return y.ALREADY_EXISTS
    case le.PERMISSION_DENIED:
      return y.PERMISSION_DENIED
    case le.FAILED_PRECONDITION:
      return y.FAILED_PRECONDITION
    case le.ABORTED:
      return y.ABORTED
    case le.OUT_OF_RANGE:
      return y.OUT_OF_RANGE
    case le.UNIMPLEMENTED:
      return y.UNIMPLEMENTED
    case le.DATA_LOSS:
      return y.DATA_LOSS
    default:
      return S()
  }
}
;((F = le || (le = {}))[(F.OK = 0)] = 'OK'),
  (F[(F.CANCELLED = 1)] = 'CANCELLED'),
  (F[(F.UNKNOWN = 2)] = 'UNKNOWN'),
  (F[(F.INVALID_ARGUMENT = 3)] = 'INVALID_ARGUMENT'),
  (F[(F.DEADLINE_EXCEEDED = 4)] = 'DEADLINE_EXCEEDED'),
  (F[(F.NOT_FOUND = 5)] = 'NOT_FOUND'),
  (F[(F.ALREADY_EXISTS = 6)] = 'ALREADY_EXISTS'),
  (F[(F.PERMISSION_DENIED = 7)] = 'PERMISSION_DENIED'),
  (F[(F.UNAUTHENTICATED = 16)] = 'UNAUTHENTICATED'),
  (F[(F.RESOURCE_EXHAUSTED = 8)] = 'RESOURCE_EXHAUSTED'),
  (F[(F.FAILED_PRECONDITION = 9)] = 'FAILED_PRECONDITION'),
  (F[(F.ABORTED = 10)] = 'ABORTED'),
  (F[(F.OUT_OF_RANGE = 11)] = 'OUT_OF_RANGE'),
  (F[(F.UNIMPLEMENTED = 12)] = 'UNIMPLEMENTED'),
  (F[(F.INTERNAL = 13)] = 'INTERNAL'),
  (F[(F.UNAVAILABLE = 14)] = 'UNAVAILABLE'),
  (F[(F.DATA_LOSS = 15)] = 'DATA_LOSS')
var II = null
function cR() {
  return new TextEncoder()
}
var uR = new Hn([4294967295, 4294967295], 0)
function wI(t) {
  let e = cR().encode(t),
    n = new sI()
  return n.update(e), new Uint8Array(n.digest())
}
function EI(t) {
  let e = new DataView(t.buffer),
    n = e.getUint32(0, !0),
    r = e.getUint32(4, !0),
    i = e.getUint32(8, !0),
    s = e.getUint32(12, !0)
  return [new Hn([n, r], 0), new Hn([i, s], 0)]
}
var nf = class t {
    constructor(e, n, r) {
      if (
        ((this.bitmap = e),
        (this.padding = n),
        (this.hashCount = r),
        n < 0 || n >= 8)
      )
        throw new Wn(`Invalid padding: ${n}`)
      if (r < 0) throw new Wn(`Invalid hash count: ${r}`)
      if (e.length > 0 && this.hashCount === 0)
        throw new Wn(`Invalid hash count: ${r}`)
      if (e.length === 0 && n !== 0)
        throw new Wn(`Invalid padding when bitmap length is 0: ${n}`)
      ;(this.Te = 8 * e.length - n), (this.Ee = Hn.fromNumber(this.Te))
    }
    de(e, n, r) {
      let i = e.add(n.multiply(Hn.fromNumber(r)))
      return (
        i.compare(uR) === 1 && (i = new Hn([i.getBits(0), i.getBits(1)], 0)),
        i.modulo(this.Ee).toNumber()
      )
    }
    Ae(e) {
      return (this.bitmap[Math.floor(e / 8)] & (1 << e % 8)) != 0
    }
    mightContain(e) {
      if (this.Te === 0) return !1
      let n = wI(e),
        [r, i] = EI(n)
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
      let n = wI(e),
        [r, i] = EI(n)
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
  Wn = class extends Error {
    constructor() {
      super(...arguments), (this.name = 'BloomFilterError')
    }
  }
var Ya = class t {
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
        i.set(e, Is.createSynthesizedTargetChangeForCurrentChange(e, n, r)),
        new t(N.min(), i, new se(B), pn(), L())
      )
    }
  },
  Is = class t {
    constructor(e, n, r, i, s) {
      ;(this.resumeToken = e),
        (this.current = n),
        (this.addedDocuments = r),
        (this.modifiedDocuments = i),
        (this.removedDocuments = s)
    }
    static createSynthesizedTargetChangeForCurrentChange(e, n, r) {
      return new t(r, n, L(), L(), L())
    }
  }
var Or = class {
    constructor(e, n, r, i) {
      ;(this.Ve = e), (this.removedTargetIds = n), (this.key = r), (this.me = i)
    }
  },
  Ja = class {
    constructor(e, n) {
      ;(this.targetId = e), (this.fe = n)
    }
  },
  Za = class {
    constructor(e, n, r = Fe.EMPTY_BYTE_STRING, i = null) {
      ;(this.state = e),
        (this.targetIds = n),
        (this.resumeToken = r),
        (this.cause = i)
    }
  },
  Xa = class {
    constructor() {
      ;(this.ge = 0),
        (this.pe = DI()),
        (this.ye = Fe.EMPTY_BYTE_STRING),
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
      let e = L(),
        n = L(),
        r = L()
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
              S()
          }
        }),
        new Is(this.ye, this.we, e, n, r)
      )
    }
    Fe() {
      ;(this.Se = !1), (this.pe = DI())
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
      ;(this.ge -= 1), fe(this.ge >= 0)
    }
    Be() {
      ;(this.Se = !0), (this.we = !0)
    }
  },
  rf = class {
    constructor(e) {
      ;(this.Le = e),
        (this.ke = new Map()),
        (this.qe = pn()),
        (this.Qe = TI()),
        (this.Ke = new se(B))
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
            S()
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
        if (Yh(s))
          if (r === 0) {
            let o = new T(s.path)
            this.We(n, o, mt.newNoDocument(o, N.min()))
          } else fe(r === 1)
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
            II?.tt(
              (function (l, d, h, f, g) {
                var I, w, D, j, K, z
                let re = {
                    localCacheCount: l,
                    existenceFilterCount: d.count,
                    databaseId: h.database,
                    projectId: h.projectId,
                  },
                  G = d.unchangedNames
                return (
                  G &&
                    (re.bloomFilter = {
                      applied: g === 0,
                      hashCount:
                        (I = G?.hashCount) !== null && I !== void 0 ? I : 0,
                      bitmapLength:
                        (j =
                          (D =
                            (w = G?.bits) === null || w === void 0
                              ? void 0
                              : w.bitmap) === null || D === void 0
                            ? void 0
                            : D.length) !== null && j !== void 0
                          ? j
                          : 0,
                      padding:
                        (z =
                          (K = G?.bits) === null || K === void 0
                            ? void 0
                            : K.padding) !== null && z !== void 0
                          ? z
                          : 0,
                      mightContain: (Be) => {
                        var Gt
                        return (
                          (Gt = f?.mightContain(Be)) !== null &&
                          Gt !== void 0 &&
                          Gt
                        )
                      },
                    }),
                  re
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
        o = hn(r).toUint8Array()
      } catch (c) {
        if (c instanceof Wa)
          return (
            Ur(
              'Decoding the base64 bloom filter in existence filter failed (' +
                c.message +
                '); ignoring the bloom filter and falling back to full re-query.'
            ),
            null
          )
        throw c
      }
      try {
        a = new nf(o, i, s)
      } catch (c) {
        return (
          Ur(
            c instanceof Wn
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
          if (s.current && Yh(a.target)) {
            let c = new T(a.target.path)
            this.qe.get(c) !== null ||
              this.st(o, c) ||
              this.We(o, c, mt.newNoDocument(c, e))
          }
          s.De && (n.set(o, s.ve()), s.Fe())
        }
      })
      let r = L()
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
      let i = new Ya(e, n, this.Ke, this.qe, r)
      return (this.qe = pn()), (this.Qe = TI()), (this.Ke = new se(B)), i
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
      return n || ((n = new Xa()), this.ke.set(e, n)), n
    }
    ot(e) {
      let n = this.Qe.get(e)
      return n || ((n = new Ne(B)), (this.Qe = this.Qe.insert(e, n))), n
    }
    je(e) {
      let n = this.Ye(e) !== null
      return n || _('WatchChangeAggregator', 'Detected inactive target', e), n
    }
    Ye(e) {
      let n = this.ke.get(e)
      return n && n.be ? null : this.Le._t(e)
    }
    He(e) {
      this.ke.set(e, new Xa()),
        this.Le.getRemoteKeysForTarget(e).forEach((n) => {
          this.We(e, n, null)
        })
    }
    st(e, n) {
      return this.Le.getRemoteKeysForTarget(e).has(n)
    }
  }
function TI() {
  return new se(T.comparator)
}
function DI() {
  return new se(T.comparator)
}
var lR = { asc: 'ASCENDING', desc: 'DESCENDING' },
  dR = {
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
  hR = { and: 'AND', or: 'OR' },
  sf = class {
    constructor(e, n) {
      ;(this.databaseId = e), (this.useProto3Json = n)
    }
  }
function of(t, e) {
  return t.useProto3Json || mc(e) ? e : { value: e }
}
function fR(t, e) {
  return t.useProto3Json
    ? `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, '').replace('Z', '')}.${('000000000' + e.nanoseconds).slice(-9)}Z`
    : { seconds: '' + e.seconds, nanos: e.nanoseconds }
}
function pR(t, e) {
  return t.useProto3Json ? e.toBase64() : e.toUint8Array()
}
function Fr(t) {
  return (
    fe(!!t),
    N.fromTimestamp(
      (function (n) {
        let r = dn(n)
        return new rt(r.seconds, r.nanos)
      })(t)
    )
  )
}
function mR(t, e) {
  return af(t, e).canonicalString()
}
function af(t, e) {
  let n = (function (i) {
    return new he(['projects', i.projectId, 'databases', i.database])
  })(t).child('documents')
  return e === void 0 ? n : n.child(e)
}
function ew(t) {
  let e = he.fromString(t)
  return fe(sw(e)), e
}
function wh(t, e) {
  let n = ew(e)
  if (n.get(1) !== t.databaseId.projectId)
    throw new E(
      y.INVALID_ARGUMENT,
      'Tried to deserialize key from different project: ' +
        n.get(1) +
        ' vs ' +
        t.databaseId.projectId
    )
  if (n.get(3) !== t.databaseId.database)
    throw new E(
      y.INVALID_ARGUMENT,
      'Tried to deserialize key from different database: ' +
        n.get(3) +
        ' vs ' +
        t.databaseId.database
    )
  return new T(nw(n))
}
function tw(t, e) {
  return mR(t.databaseId, e)
}
function gR(t) {
  let e = ew(t)
  return e.length === 4 ? he.emptyPath() : nw(e)
}
function CI(t) {
  return new he([
    'projects',
    t.databaseId.projectId,
    'databases',
    t.databaseId.database,
  ]).canonicalString()
}
function nw(t) {
  return fe(t.length > 4 && t.get(4) === 'documents'), t.popFirst(5)
}
function yR(t, e) {
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
                  : S()
      })(e.targetChange.targetChangeType || 'NO_CHANGE'),
      i = e.targetChange.targetIds || [],
      s = (function (u, l) {
        return u.useProto3Json
          ? (fe(l === void 0 || typeof l == 'string'),
            Fe.fromBase64String(l || ''))
          : (fe(l === void 0 || l instanceof Uint8Array),
            Fe.fromUint8Array(l || new Uint8Array()))
      })(t, e.targetChange.resumeToken),
      o = e.targetChange.cause,
      a =
        o &&
        (function (u) {
          let l = u.code === void 0 ? y.UNKNOWN : XI(u.code)
          return new E(l, u.message || '')
        })(o)
    n = new Za(r, i, s, a || null)
  } else if ('documentChange' in e) {
    e.documentChange
    let r = e.documentChange
    r.document, r.document.name, r.document.updateTime
    let i = wh(t, r.document.name),
      s = Fr(r.document.updateTime),
      o = r.document.createTime ? Fr(r.document.createTime) : N.min(),
      a = new qt({ mapValue: { fields: r.document.fields } }),
      c = mt.newFoundDocument(i, s, o, a),
      u = r.targetIds || [],
      l = r.removedTargetIds || []
    n = new Or(u, l, c.key, c)
  } else if ('documentDelete' in e) {
    e.documentDelete
    let r = e.documentDelete
    r.document
    let i = wh(t, r.document),
      s = r.readTime ? Fr(r.readTime) : N.min(),
      o = mt.newNoDocument(i, s),
      a = r.removedTargetIds || []
    n = new Or([], a, o.key, o)
  } else if ('documentRemove' in e) {
    e.documentRemove
    let r = e.documentRemove
    r.document
    let i = wh(t, r.document),
      s = r.removedTargetIds || []
    n = new Or([], s, i, null)
  } else {
    if (!('filter' in e)) return S()
    {
      e.filter
      let r = e.filter
      r.targetId
      let { count: i = 0, unchangedNames: s } = r,
        o = new tf(i, s),
        a = r.targetId
      n = new Ja(a, o)
    }
  }
  return n
}
function vR(t, e) {
  return { documents: [tw(t, e.path)] }
}
function _R(t, e) {
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
    (n.parent = tw(t, i))
  let s = (function (u) {
    if (u.length !== 0) return iw(Mt.create(u, 'and'))
  })(e.filters)
  s && (n.structuredQuery.where = s)
  let o = (function (u) {
    if (u.length !== 0)
      return u.map((l) =>
        (function (h) {
          return { field: Mr(h.field), direction: ER(h.dir) }
        })(l)
      )
  })(e.orderBy)
  o && (n.structuredQuery.orderBy = o)
  let a = of(t, e.limit)
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
function IR(t) {
  let e = gR(t.parent),
    n = t.structuredQuery,
    r = n.from ? n.from.length : 0,
    i = null
  if (r > 0) {
    fe(r === 1)
    let l = n.from[0]
    l.allDescendants ? (i = l.collectionId) : (e = e.child(l.collectionId))
  }
  let s = []
  n.where &&
    (s = (function (d) {
      let h = rw(d)
      return h instanceof Mt && jI(h) ? h.getFilters() : [h]
    })(n.where))
  let o = []
  n.orderBy &&
    (o = (function (d) {
      return d.map((h) =>
        (function (g) {
          return new qr(
            Pr(g.field),
            (function (w) {
              switch (w) {
                case 'ASCENDING':
                  return 'asc'
                case 'DESCENDING':
                  return 'desc'
                default:
                  return
              }
            })(g.direction)
          )
        })(h)
      )
    })(n.orderBy))
  let a = null
  n.limit &&
    (a = (function (d) {
      let h
      return (h = typeof d == 'object' ? d.value : d), mc(h) ? null : h
    })(n.limit))
  let c = null
  n.startAt &&
    (c = (function (d) {
      let h = !!d.before,
        f = d.values || []
      return new Hr(f, h)
    })(n.startAt))
  let u = null
  return (
    n.endAt &&
      (u = (function (d) {
        let h = !d.before,
          f = d.values || []
        return new Hr(f, h)
      })(n.endAt)),
    zN(e, i, o, s, a, 'F', c, u)
  )
}
function wR(t, e) {
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
        return S()
    }
  })(e.purpose)
  return n == null ? null : { 'goog-listen-tags': n }
}
function rw(t) {
  return t.unaryFilter !== void 0
    ? (function (n) {
        switch (n.unaryFilter.op) {
          case 'IS_NAN':
            let r = Pr(n.unaryFilter.field)
            return me.create(r, '==', { doubleValue: NaN })
          case 'IS_NULL':
            let i = Pr(n.unaryFilter.field)
            return me.create(i, '==', { nullValue: 'NULL_VALUE' })
          case 'IS_NOT_NAN':
            let s = Pr(n.unaryFilter.field)
            return me.create(s, '!=', { doubleValue: NaN })
          case 'IS_NOT_NULL':
            let o = Pr(n.unaryFilter.field)
            return me.create(o, '!=', { nullValue: 'NULL_VALUE' })
          default:
            return S()
        }
      })(t)
    : t.fieldFilter !== void 0
      ? (function (n) {
          return me.create(
            Pr(n.fieldFilter.field),
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
                  return S()
              }
            })(n.fieldFilter.op),
            n.fieldFilter.value
          )
        })(t)
      : t.compositeFilter !== void 0
        ? (function (n) {
            return Mt.create(
              n.compositeFilter.filters.map((r) => rw(r)),
              (function (i) {
                switch (i) {
                  case 'AND':
                    return 'and'
                  case 'OR':
                    return 'or'
                  default:
                    return S()
                }
              })(n.compositeFilter.op)
            )
          })(t)
        : S()
}
function ER(t) {
  return lR[t]
}
function TR(t) {
  return dR[t]
}
function DR(t) {
  return hR[t]
}
function Mr(t) {
  return { fieldPath: t.canonicalString() }
}
function Pr(t) {
  return pt.fromServerFormat(t.fieldPath)
}
function iw(t) {
  return t instanceof me
    ? (function (n) {
        if (n.op === '==') {
          if (dI(n.value))
            return { unaryFilter: { field: Mr(n.field), op: 'IS_NAN' } }
          if (lI(n.value))
            return { unaryFilter: { field: Mr(n.field), op: 'IS_NULL' } }
        } else if (n.op === '!=') {
          if (dI(n.value))
            return { unaryFilter: { field: Mr(n.field), op: 'IS_NOT_NAN' } }
          if (lI(n.value))
            return { unaryFilter: { field: Mr(n.field), op: 'IS_NOT_NULL' } }
        }
        return {
          fieldFilter: { field: Mr(n.field), op: TR(n.op), value: n.value },
        }
      })(t)
    : t instanceof Mt
      ? (function (n) {
          let r = n.getFilters().map((i) => iw(i))
          return r.length === 1
            ? r[0]
            : { compositeFilter: { op: DR(n.op), filters: r } }
        })(t)
      : S()
}
function sw(t) {
  return t.length >= 4 && t.get(0) === 'projects' && t.get(2) === 'databases'
}
var ws = class t {
  constructor(
    e,
    n,
    r,
    i,
    s = N.min(),
    o = N.min(),
    a = Fe.EMPTY_BYTE_STRING,
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
var cf = class {
  constructor(e) {
    this.ct = e
  }
}
function CR(t) {
  let e = IR({ parent: t.parent, structuredQuery: t.structuredQuery })
  return t.limitType === 'LAST' ? Jh(e, e.limit, 'L') : e
}
var ec = class {
  constructor() {}
  Pt(e, n) {
    this.It(e, n), n.Tt()
  }
  It(e, n) {
    if ('nullValue' in e) this.Et(n, 5)
    else if ('booleanValue' in e) this.Et(n, 10), n.dt(e.booleanValue ? 1 : 0)
    else if ('integerValue' in e) this.Et(n, 15), n.dt(ne(e.integerValue))
    else if ('doubleValue' in e) {
      let r = ne(e.doubleValue)
      isNaN(r) ? this.Et(n, 13) : (this.Et(n, 15), za(r) ? n.dt(0) : n.dt(r))
    } else if ('timestampValue' in e) {
      let r = e.timestampValue
      this.Et(n, 20),
        typeof r == 'string'
          ? n.At(r)
          : (n.At(`${r.seconds || ''}`), n.dt(r.nanos || 0))
    } else if ('stringValue' in e) this.Rt(e.stringValue, n), this.Vt(n)
    else if ('bytesValue' in e)
      this.Et(n, 30), n.ft(hn(e.bytesValue)), this.Vt(n)
    else if ('referenceValue' in e) this.gt(e.referenceValue, n)
    else if ('geoPointValue' in e) {
      let r = e.geoPointValue
      this.Et(n, 45), n.dt(r.latitude || 0), n.dt(r.longitude || 0)
    } else
      'mapValue' in e
        ? VI(e)
          ? this.Et(n, Number.MAX_SAFE_INTEGER)
          : (this.yt(e.mapValue, n), this.Vt(n))
        : 'arrayValue' in e
          ? (this.wt(e.arrayValue, n), this.Vt(n))
          : S()
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
      T.fromName(e).path.forEach((r) => {
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
ec.bt = new ec()
var uf = class {
    constructor() {
      this._n = new lf()
    }
    addToCollectionParentIndex(e, n) {
      return this._n.add(n), m.resolve()
    }
    getCollectionParents(e, n) {
      return m.resolve(this._n.getEntries(n))
    }
    addFieldIndex(e, n) {
      return m.resolve()
    }
    deleteFieldIndex(e, n) {
      return m.resolve()
    }
    deleteAllFieldIndexes(e) {
      return m.resolve()
    }
    createTargetIndexes(e, n) {
      return m.resolve()
    }
    getDocumentsMatchingTarget(e, n) {
      return m.resolve(null)
    }
    getIndexType(e, n) {
      return m.resolve(0)
    }
    getFieldIndexes(e, n) {
      return m.resolve([])
    }
    getNextCollectionGroupToUpdate(e) {
      return m.resolve(null)
    }
    getMinOffset(e, n) {
      return m.resolve(Jn.min())
    }
    getMinOffsetFromCollectionGroup(e, n) {
      return m.resolve(Jn.min())
    }
    updateCollectionGroup(e, n, r) {
      return m.resolve()
    }
    updateIndexEntries(e, n) {
      return m.resolve()
    }
  },
  lf = class {
    constructor() {
      this.index = {}
    }
    add(e) {
      let n = e.lastSegment(),
        r = e.popLast(),
        i = this.index[n] || new Ne(he.comparator),
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
      return (this.index[e] || new Ne(he.comparator)).toArray()
    }
  }
var KV = new Uint8Array(0)
var At = class t {
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
;(At.DEFAULT_COLLECTION_PERCENTILE = 10),
  (At.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3),
  (At.DEFAULT = new At(
    41943040,
    At.DEFAULT_COLLECTION_PERCENTILE,
    At.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT
  )),
  (At.DISABLED = new At(-1, 0, 0))
var Es = class t {
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
var df = class {
  constructor() {
    ;(this.changes = new fn(
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
      this.changes.set(e, mt.newInvalidDocument(e).setReadTime(n))
  }
  getEntry(e, n) {
    this.assertNotApplied()
    let r = this.changes.get(n)
    return r !== void 0 ? m.resolve(r) : this.getFromCache(e, n)
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
var hf = class {
  constructor(e, n) {
    ;(this.overlayedDocument = e), (this.mutatedFields = n)
  }
}
var ff = class {
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
      .next((i) => (r !== null && fs(r.mutation, i, zn.empty(), rt.now()), i))
  }
  getDocuments(e, n) {
    return this.remoteDocumentCache
      .getEntries(e, n)
      .next((r) => this.getLocalViewOfDocuments(e, r, L()).next(() => r))
  }
  getLocalViewOfDocuments(e, n, r = L()) {
    let i = Gn()
    return this.populateOverlays(e, i, n).next(() =>
      this.computeViews(e, n, i, r).next((s) => {
        let o = cs()
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
    let r = Gn()
    return this.populateOverlays(e, r, n).next(() =>
      this.computeViews(e, n, r, L())
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
    let s = pn(),
      o = ds(),
      a = (function () {
        return ds()
      })()
    return (
      n.forEach((c, u) => {
        let l = r.get(u.key)
        i.has(u.key) && (l === void 0 || l.mutation instanceof Qr)
          ? (s = s.insert(u.key, u))
          : l !== void 0
            ? (o.set(u.key, l.mutation.getFieldMask()),
              fs(l.mutation, u, l.mutation.getFieldMask(), rt.now()))
            : o.set(u.key, zn.empty())
      }),
      this.recalculateAndSaveOverlays(e, s).next(
        (c) => (
          c.forEach((u, l) => o.set(u, l)),
          n.forEach((u, l) => {
            var d
            return a.set(
              u,
              new hf(l, (d = o.get(u)) !== null && d !== void 0 ? d : null)
            )
          }),
          a
        )
      )
    )
  }
  recalculateAndSaveOverlays(e, n) {
    let r = ds(),
      i = new se((o, a) => o - a),
      s = L()
    return this.mutationQueue
      .getAllMutationBatchesAffectingDocumentKeys(e, n)
      .next((o) => {
        for (let a of o)
          a.keys().forEach((c) => {
            let u = n.get(c)
            if (u === null) return
            let l = r.get(c) || zn.empty()
            ;(l = a.applyToLocalView(u, l)), r.set(c, l)
            let d = (i.get(a.batchId) || L()).add(c)
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
            d = WI()
          l.forEach((h) => {
            if (!s.has(h)) {
              let f = JI(n.get(h), r.get(h))
              f !== null && d.set(h, f), (s = s.add(h))
            }
          }),
            o.push(this.documentOverlayCache.saveOverlays(e, u, d))
        }
        return m.waitFor(o)
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
        T.isDocumentKey(o.path) &&
        o.collectionGroup === null &&
        o.filters.length === 0
      )
    })(n)
      ? this.getDocumentsMatchingDocumentQuery(e, n.path)
      : GN(n)
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
              : m.resolve(Gn()),
          a = -1,
          c = s
        return o.next((u) =>
          m
            .forEach(
              u,
              (l, d) => (
                a < d.largestBatchId && (a = d.largestBatchId),
                s.get(l)
                  ? m.resolve()
                  : this.remoteDocumentCache.getEntry(e, l).next((h) => {
                      c = c.insert(l, h)
                    })
              )
            )
            .next(() => this.populateOverlays(e, u, s))
            .next(() => this.computeViews(e, c, u, L()))
            .next((l) => ({ batchId: a, changes: JN(l) }))
        )
      })
  }
  getDocumentsMatchingDocumentQuery(e, n) {
    return this.getDocument(e, new T(n)).next((r) => {
      let i = cs()
      return r.isFoundDocument() && (i = i.insert(r.key, r)), i
    })
  }
  getDocumentsMatchingCollectionGroupQuery(e, n, r, i) {
    let s = n.collectionGroup,
      o = cs()
    return this.indexManager.getCollectionParents(e, s).next((a) =>
      m
        .forEach(a, (c) => {
          let u = (function (d, h) {
            return new zr(
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
          o.get(l) === null && (o = o.insert(l, mt.newInvalidDocument(l)))
        })
        let a = cs()
        return (
          o.forEach((c, u) => {
            let l = s.get(c)
            l !== void 0 && fs(l.mutation, u, zn.empty(), rt.now()),
              vc(n, u) && (a = a.insert(c, u))
          }),
          a
        )
      })
  }
}
var pf = class {
  constructor(e) {
    ;(this.serializer = e), (this.cr = new Map()), (this.lr = new Map())
  }
  getBundleMetadata(e, n) {
    return m.resolve(this.cr.get(n))
  }
  saveBundleMetadata(e, n) {
    return (
      this.cr.set(
        n.id,
        (function (i) {
          return { id: i.id, version: i.version, createTime: Fr(i.createTime) }
        })(n)
      ),
      m.resolve()
    )
  }
  getNamedQuery(e, n) {
    return m.resolve(this.lr.get(n))
  }
  saveNamedQuery(e, n) {
    return (
      this.lr.set(
        n.name,
        (function (i) {
          return {
            name: i.name,
            query: CR(i.bundledQuery),
            readTime: Fr(i.readTime),
          }
        })(n)
      ),
      m.resolve()
    )
  }
}
var mf = class {
  constructor() {
    ;(this.overlays = new se(T.comparator)), (this.hr = new Map())
  }
  getOverlay(e, n) {
    return m.resolve(this.overlays.get(n))
  }
  getOverlays(e, n) {
    let r = Gn()
    return m
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
      m.resolve()
    )
  }
  removeOverlaysForBatchId(e, n, r) {
    let i = this.hr.get(r)
    return (
      i !== void 0 &&
        (i.forEach((s) => (this.overlays = this.overlays.remove(s))),
        this.hr.delete(r)),
      m.resolve()
    )
  }
  getOverlaysForCollection(e, n, r) {
    let i = Gn(),
      s = n.length + 1,
      o = new T(n.child('')),
      a = this.overlays.getIteratorFrom(o)
    for (; a.hasNext(); ) {
      let c = a.getNext().value,
        u = c.getKey()
      if (!n.isPrefixOf(u.path)) break
      u.path.length === s && c.largestBatchId > r && i.set(c.getKey(), c)
    }
    return m.resolve(i)
  }
  getOverlaysForCollectionGroup(e, n, r, i) {
    let s = new se((u, l) => u - l),
      o = this.overlays.getIterator()
    for (; o.hasNext(); ) {
      let u = o.getNext().value
      if (u.getKey().getCollectionGroup() === n && u.largestBatchId > r) {
        let l = s.get(u.largestBatchId)
        l === null && ((l = Gn()), (s = s.insert(u.largestBatchId, l))),
          l.set(u.getKey(), u)
      }
    }
    let a = Gn(),
      c = s.getIterator()
    for (
      ;
      c.hasNext() &&
      (c.getNext().value.forEach((u, l) => a.set(u, l)), !(a.size() >= i));

    );
    return m.resolve(a)
  }
  ht(e, n, r) {
    let i = this.overlays.get(r.key)
    if (i !== null) {
      let o = this.hr.get(i.largestBatchId).delete(r.key)
      this.hr.set(i.largestBatchId, o)
    }
    this.overlays = this.overlays.insert(r.key, new ef(n, r))
    let s = this.hr.get(n)
    s === void 0 && ((s = L()), this.hr.set(n, s)), this.hr.set(n, s.add(r.key))
  }
}
var Ts = class {
    constructor() {
      ;(this.Pr = new Ne(de.Ir)), (this.Tr = new Ne(de.Er))
    }
    isEmpty() {
      return this.Pr.isEmpty()
    }
    addReference(e, n) {
      let r = new de(e, n)
      ;(this.Pr = this.Pr.add(r)), (this.Tr = this.Tr.add(r))
    }
    dr(e, n) {
      e.forEach((r) => this.addReference(r, n))
    }
    removeReference(e, n) {
      this.Ar(new de(e, n))
    }
    Rr(e, n) {
      e.forEach((r) => this.removeReference(r, n))
    }
    Vr(e) {
      let n = new T(new he([])),
        r = new de(n, e),
        i = new de(n, e + 1),
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
      let n = new T(new he([])),
        r = new de(n, e),
        i = new de(n, e + 1),
        s = L()
      return (
        this.Tr.forEachInRange([r, i], (o) => {
          s = s.add(o.key)
        }),
        s
      )
    }
    containsKey(e) {
      let n = new de(e, 0),
        r = this.Pr.firstAfterOrEqual(n)
      return r !== null && e.isEqual(r.key)
    }
  },
  de = class {
    constructor(e, n) {
      ;(this.key = e), (this.pr = n)
    }
    static Ir(e, n) {
      return T.comparator(e.key, n.key) || B(e.pr, n.pr)
    }
    static Er(e, n) {
      return B(e.pr, n.pr) || T.comparator(e.key, n.key)
    }
  }
var gf = class {
  constructor(e, n) {
    ;(this.indexManager = e),
      (this.referenceDelegate = n),
      (this.mutationQueue = []),
      (this.yr = 1),
      (this.wr = new Ne(de.Ir))
  }
  checkEmpty(e) {
    return m.resolve(this.mutationQueue.length === 0)
  }
  addMutationBatch(e, n, r, i) {
    let s = this.yr
    this.yr++,
      this.mutationQueue.length > 0 &&
        this.mutationQueue[this.mutationQueue.length - 1]
    let o = new Xh(s, n, r, i)
    this.mutationQueue.push(o)
    for (let a of i)
      (this.wr = this.wr.add(new de(a.key, s))),
        this.indexManager.addToCollectionParentIndex(e, a.key.path.popLast())
    return m.resolve(o)
  }
  lookupMutationBatch(e, n) {
    return m.resolve(this.Sr(n))
  }
  getNextMutationBatchAfterBatchId(e, n) {
    let r = n + 1,
      i = this.br(r),
      s = i < 0 ? 0 : i
    return m.resolve(
      this.mutationQueue.length > s ? this.mutationQueue[s] : null
    )
  }
  getHighestUnacknowledgedBatchId() {
    return m.resolve(this.mutationQueue.length === 0 ? -1 : this.yr - 1)
  }
  getAllMutationBatches(e) {
    return m.resolve(this.mutationQueue.slice())
  }
  getAllMutationBatchesAffectingDocumentKey(e, n) {
    let r = new de(n, 0),
      i = new de(n, Number.POSITIVE_INFINITY),
      s = []
    return (
      this.wr.forEachInRange([r, i], (o) => {
        let a = this.Sr(o.pr)
        s.push(a)
      }),
      m.resolve(s)
    )
  }
  getAllMutationBatchesAffectingDocumentKeys(e, n) {
    let r = new Ne(B)
    return (
      n.forEach((i) => {
        let s = new de(i, 0),
          o = new de(i, Number.POSITIVE_INFINITY)
        this.wr.forEachInRange([s, o], (a) => {
          r = r.add(a.pr)
        })
      }),
      m.resolve(this.Dr(r))
    )
  }
  getAllMutationBatchesAffectingQuery(e, n) {
    let r = n.path,
      i = r.length + 1,
      s = r
    T.isDocumentKey(s) || (s = s.child(''))
    let o = new de(new T(s), 0),
      a = new Ne(B)
    return (
      this.wr.forEachWhile((c) => {
        let u = c.key.path
        return !!r.isPrefixOf(u) && (u.length === i && (a = a.add(c.pr)), !0)
      }, o),
      m.resolve(this.Dr(a))
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
    fe(this.Cr(n.batchId, 'removed') === 0), this.mutationQueue.shift()
    let r = this.wr
    return m
      .forEach(n.mutations, (i) => {
        let s = new de(i.key, n.batchId)
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
    let r = new de(n, 0),
      i = this.wr.firstAfterOrEqual(r)
    return m.resolve(n.isEqual(i && i.key))
  }
  performConsistencyCheck(e) {
    return this.mutationQueue.length, m.resolve()
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
var yf = class {
    constructor(e) {
      ;(this.vr = e),
        (this.docs = (function () {
          return new se(T.comparator)
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
      return m.resolve(r ? r.document.mutableCopy() : mt.newInvalidDocument(n))
    }
    getEntries(e, n) {
      let r = pn()
      return (
        n.forEach((i) => {
          let s = this.docs.get(i)
          r = r.insert(
            i,
            s ? s.document.mutableCopy() : mt.newInvalidDocument(i)
          )
        }),
        m.resolve(r)
      )
    }
    getDocumentsMatchingQuery(e, n, r, i) {
      let s = pn(),
        o = n.path,
        a = new T(o.child('')),
        c = this.docs.getIteratorFrom(a)
      for (; c.hasNext(); ) {
        let {
          key: u,
          value: { document: l },
        } = c.getNext()
        if (!o.isPrefixOf(u.path)) break
        u.path.length > o.length + 1 ||
          FN(ON(l), r) <= 0 ||
          ((i.has(l.key) || vc(n, l)) && (s = s.insert(l.key, l.mutableCopy())))
      }
      return m.resolve(s)
    }
    getAllFromCollectionGroup(e, n, r, i) {
      S()
    }
    Fr(e, n) {
      return m.forEach(this.docs, (r) => n(r))
    }
    newChangeBuffer(e) {
      return new vf(this)
    }
    getSize(e) {
      return m.resolve(this.size)
    }
  },
  vf = class extends df {
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
        m.waitFor(n)
      )
    }
    getFromCache(e, n) {
      return this.ar.getEntry(e, n)
    }
    getAllFromCache(e, n) {
      return this.ar.getEntries(e, n)
    }
  }
var _f = class {
  constructor(e) {
    ;(this.persistence = e),
      (this.Mr = new fn((n) => ap(n), cp)),
      (this.lastRemoteSnapshotVersion = N.min()),
      (this.highestTargetId = 0),
      (this.Or = 0),
      (this.Nr = new Ts()),
      (this.targetCount = 0),
      (this.Br = Es.Nn())
  }
  forEachTarget(e, n) {
    return this.Mr.forEach((r, i) => n(i)), m.resolve()
  }
  getLastRemoteSnapshotVersion(e) {
    return m.resolve(this.lastRemoteSnapshotVersion)
  }
  getHighestSequenceNumber(e) {
    return m.resolve(this.Or)
  }
  allocateTargetId(e) {
    return (
      (this.highestTargetId = this.Br.next()), m.resolve(this.highestTargetId)
    )
  }
  setTargetsMetadata(e, n, r) {
    return (
      r && (this.lastRemoteSnapshotVersion = r),
      n > this.Or && (this.Or = n),
      m.resolve()
    )
  }
  qn(e) {
    this.Mr.set(e.target, e)
    let n = e.targetId
    n > this.highestTargetId &&
      ((this.Br = new Es(n)), (this.highestTargetId = n)),
      e.sequenceNumber > this.Or && (this.Or = e.sequenceNumber)
  }
  addTargetData(e, n) {
    return this.qn(n), (this.targetCount += 1), m.resolve()
  }
  updateTargetData(e, n) {
    return this.qn(n), m.resolve()
  }
  removeTargetData(e, n) {
    return (
      this.Mr.delete(n.target),
      this.Nr.Vr(n.targetId),
      (this.targetCount -= 1),
      m.resolve()
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
      m.waitFor(s).next(() => i)
    )
  }
  getTargetCount(e) {
    return m.resolve(this.targetCount)
  }
  getTargetData(e, n) {
    let r = this.Mr.get(n) || null
    return m.resolve(r)
  }
  addMatchingKeys(e, n, r) {
    return this.Nr.dr(n, r), m.resolve()
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
      m.waitFor(s)
    )
  }
  removeMatchingKeysForTargetId(e, n) {
    return this.Nr.Vr(n), m.resolve()
  }
  getMatchingKeysForTargetId(e, n) {
    let r = this.Nr.gr(n)
    return m.resolve(r)
  }
  containsKey(e, n) {
    return m.resolve(this.Nr.containsKey(n))
  }
}
var If = class {
    constructor(e, n) {
      ;(this.Lr = {}),
        (this.overlays = {}),
        (this.kr = new LI(0)),
        (this.qr = !1),
        (this.qr = !0),
        (this.referenceDelegate = e(this)),
        (this.Qr = new _f(this)),
        (this.indexManager = new uf()),
        (this.remoteDocumentCache = (function (i) {
          return new yf(i)
        })((r) => this.referenceDelegate.Kr(r))),
        (this.serializer = new cf(n)),
        (this.$r = new pf(this.serializer))
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
      return n || ((n = new mf()), (this.overlays[e.toKey()] = n)), n
    }
    getMutationQueue(e, n) {
      let r = this.Lr[e.toKey()]
      return (
        r ||
          ((r = new gf(n, this.referenceDelegate)), (this.Lr[e.toKey()] = r)),
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
      _('MemoryPersistence', 'Starting transaction:', e)
      let i = new wf(this.kr.next())
      return (
        this.referenceDelegate.Ur(),
        r(i)
          .next((s) => this.referenceDelegate.Wr(i).next(() => s))
          .toPromise()
          .then((s) => (i.raiseOnCommittedEvent(), s))
      )
    }
    Gr(e, n) {
      return m.or(Object.values(this.Lr).map((r) => () => r.containsKey(e, n)))
    }
  },
  wf = class extends kh {
    constructor(e) {
      super(), (this.currentSequenceNumber = e)
    }
  },
  Ef = class t {
    constructor(e) {
      ;(this.persistence = e), (this.zr = new Ts()), (this.jr = null)
    }
    static Hr(e) {
      return new t(e)
    }
    get Jr() {
      if (this.jr) return this.jr
      throw S()
    }
    addReference(e, n, r) {
      return (
        this.zr.addReference(r, n), this.Jr.delete(r.toString()), m.resolve()
      )
    }
    removeReference(e, n, r) {
      return (
        this.zr.removeReference(r, n), this.Jr.add(r.toString()), m.resolve()
      )
    }
    markPotentiallyOrphaned(e, n) {
      return this.Jr.add(n.toString()), m.resolve()
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
      return m
        .forEach(this.Jr, (r) => {
          let i = T.fromPath(r)
          return this.Yr(e, i).next((s) => {
            s || n.removeEntry(i, N.min())
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
      return m.or([
        () => m.resolve(this.zr.containsKey(n)),
        () => this.persistence.getTargetCache().containsKey(e, n),
        () => this.persistence.Gr(e, n),
      ])
    }
  }
var Tf = class t {
  constructor(e, n, r, i) {
    ;(this.targetId = e), (this.fromCache = n), (this.qi = r), (this.Qi = i)
  }
  static Ki(e, n) {
    let r = L(),
      i = L()
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
var Df = class {
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
var Cf = class {
  constructor() {
    ;(this.$i = !1),
      (this.Ui = !1),
      (this.Wi = 100),
      (this.Gi = (function () {
        return av() ? 8 : qa.v(be()) > 0 ? 6 : 4
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
        let o = new Df()
        return this.Ji(e, n, o).next((a) => {
          if (((s.result = a), this.Ui)) return this.Yi(e, n, o, a.size)
        })
      })
      .next(() => s.result)
  }
  Yi(e, n, r, i) {
    return r.documentReadCount < this.Wi
      ? (as() <= k.DEBUG &&
          _(
            'QueryEngine',
            'SDK will not create cache indexes for query:',
            Rr(n),
            'since it only creates cache indexes for collection contains',
            'more than or equal to',
            this.Wi,
            'documents'
          ),
        m.resolve())
      : (as() <= k.DEBUG &&
          _(
            'QueryEngine',
            'Query:',
            Rr(n),
            'scans',
            r.documentReadCount,
            'local documents and returns',
            i,
            'documents as results.'
          ),
        r.documentReadCount > this.Gi * i
          ? (as() <= k.DEBUG &&
              _(
                'QueryEngine',
                'The SDK decides to create cache indexes for query:',
                Rr(n),
                'as using cache indexes may help improve performance.'
              ),
            this.indexManager.createTargetIndexes(e, xt(n)))
          : m.resolve())
  }
  ji(e, n) {
    if (mI(n)) return m.resolve(null)
    let r = xt(n)
    return this.indexManager.getIndexType(e, r).next((i) =>
      i === 0
        ? null
        : (n.limit !== null && i === 1 && ((n = Jh(n, null, 'F')), (r = xt(n))),
          this.indexManager.getDocumentsMatchingTarget(e, r).next((s) => {
            let o = L(...s)
            return this.zi.getDocuments(e, o).next((a) =>
              this.indexManager.getMinOffset(e, r).next((c) => {
                let u = this.Zi(n, a)
                return this.Xi(n, u, o, c.readTime)
                  ? this.ji(e, Jh(n, null, 'F'))
                  : this.es(e, u, n, c)
              })
            )
          }))
    )
  }
  Hi(e, n, r, i) {
    return mI(n) || i.isEqual(N.min())
      ? m.resolve(null)
      : this.zi.getDocuments(e, r).next((s) => {
          let o = this.Zi(n, s)
          return this.Xi(n, o, r, i)
            ? m.resolve(null)
            : (as() <= k.DEBUG &&
                _(
                  'QueryEngine',
                  'Re-using previous result from %s to execute query: %s',
                  i.toString(),
                  Rr(n)
                ),
              this.es(e, o, n, kN(i, -1)).next((a) => a))
        })
  }
  Zi(e, n) {
    let r = new Ne(zI(e))
    return (
      n.forEach((i, s) => {
        vc(e, s) && (r = r.add(s))
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
      as() <= k.DEBUG &&
        _('QueryEngine', 'Using full collection scan to execute query:', Rr(n)),
      this.zi.getDocumentsMatchingQuery(e, n, Jn.min(), r)
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
var bf = class {
  constructor(e, n, r, i) {
    ;(this.persistence = e),
      (this.ts = n),
      (this.serializer = i),
      (this.ns = new se(B)),
      (this.rs = new fn((s) => ap(s), cp)),
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
      (this.localDocuments = new ff(
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
function bR(t, e, n, r) {
  return new bf(t, e, n, r)
}
function ow(t, e) {
  return p(this, null, function* () {
    let n = U(t)
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
              c = L()
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
function aw(t) {
  let e = U(t)
  return e.persistence.runTransaction(
    'Get last remote snapshot version',
    'readonly',
    (n) => e.Qr.getLastRemoteSnapshotVersion(n)
  )
}
function AR(t, e) {
  let n = U(t),
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
              .withResumeToken(Fe.EMPTY_BYTE_STRING, N.min())
              .withLastLimboFreeSnapshotVersion(N.min()))
          : l.resumeToken.approximateByteSize() > 0 &&
            (f = f.withResumeToken(l.resumeToken, r)),
          (i = i.insert(d, f)),
          (function (I, w, D) {
            return I.resumeToken.approximateByteSize() === 0 ||
              w.snapshotVersion.toMicroseconds() -
                I.snapshotVersion.toMicroseconds() >=
                3e8
              ? !0
              : D.addedDocuments.size +
                  D.modifiedDocuments.size +
                  D.removedDocuments.size >
                  0
          })(h, f, l) && a.push(n.Qr.updateTargetData(s, f))
      })
      let c = pn(),
        u = L()
      if (
        (e.documentUpdates.forEach((l) => {
          e.resolvedLimboDocuments.has(l) &&
            a.push(n.persistence.referenceDelegate.updateLimboDocument(s, l))
        }),
        a.push(
          SR(s, o, e.documentUpdates).next((l) => {
            ;(c = l.cs), (u = l.ls)
          })
        ),
        !r.isEqual(N.min()))
      ) {
        let l = n.Qr.getLastRemoteSnapshotVersion(s).next((d) =>
          n.Qr.setTargetsMetadata(s, s.currentSequenceNumber, r)
        )
        a.push(l)
      }
      return m
        .waitFor(a)
        .next(() => o.apply(s))
        .next(() => n.localDocuments.getLocalViewOfDocuments(s, c, u))
        .next(() => c)
    })
    .then((s) => ((n.ns = i), s))
}
function SR(t, e, n) {
  let r = L(),
    i = L()
  return (
    n.forEach((s) => (r = r.add(s))),
    e.getEntries(t, r).next((s) => {
      let o = pn()
      return (
        n.forEach((a, c) => {
          let u = s.get(a)
          c.isFoundDocument() !== u.isFoundDocument() && (i = i.add(a)),
            c.isNoDocument() && c.version.isEqual(N.min())
              ? (e.removeEntry(a, c.readTime), (o = o.insert(a, c)))
              : !u.isValidDocument() ||
                  c.version.compareTo(u.version) > 0 ||
                  (c.version.compareTo(u.version) === 0 && u.hasPendingWrites)
                ? (e.addEntry(c), (o = o.insert(a, c)))
                : _(
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
function xR(t, e) {
  let n = U(t)
  return n.persistence
    .runTransaction('Allocate target', 'readwrite', (r) => {
      let i
      return n.Qr.getTargetData(r, e).next((s) =>
        s
          ? ((i = s), m.resolve(i))
          : n.Qr.allocateTargetId(r).next(
              (o) => (
                (i = new ws(
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
function Af(t, e, n) {
  return p(this, null, function* () {
    let r = U(t),
      i = r.ns.get(e),
      s = n ? 'readwrite' : 'readwrite-primary'
    try {
      n ||
        (yield r.persistence.runTransaction('Release target', s, (o) =>
          r.persistence.referenceDelegate.removeTarget(o, i)
        ))
    } catch (o) {
      if (!bs(o)) throw o
      _('LocalStore', `Failed to update sequence numbers for target ${e}: ${o}`)
    }
    ;(r.ns = r.ns.remove(e)), r.rs.delete(i.target)
  })
}
function bI(t, e, n) {
  let r = U(t),
    i = N.min(),
    s = L()
  return r.persistence.runTransaction('Execute query', 'readwrite', (o) =>
    (function (c, u, l) {
      let d = U(c),
        h = d.rs.get(l)
      return h !== void 0 ? m.resolve(d.ns.get(h)) : d.Qr.getTargetData(u, l)
    })(r, o, xt(e))
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
        r.ts.getDocumentsMatchingQuery(o, e, n ? i : N.min(), n ? s : L())
      )
      .next((a) => (NR(r, KN(e), a), { documents: a, hs: s }))
  )
}
function NR(t, e, n) {
  let r = t.ss.get(e) || N.min()
  n.forEach((i, s) => {
    s.readTime.compareTo(r) > 0 && (r = s.readTime)
  }),
    t.ss.set(e, r)
}
var tc = class {
  constructor() {
    this.activeTargetIds = eR()
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
var Sf = class {
  constructor() {
    ;(this.no = new tc()),
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
    return (this.no = new tc()), Promise.resolve()
  }
  handleUserChange(e, n, r) {}
  setOnlineState(e) {}
  shutdown() {}
  writeSequenceNumber(e) {}
  notifyBundleLoaded(e) {}
}
var xf = class {
  io(e) {}
  shutdown() {}
}
var nc = class {
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
    _('ConnectivityMonitor', 'Network connectivity changed: AVAILABLE')
    for (let e of this.uo) e(0)
  }
  ao() {
    _('ConnectivityMonitor', 'Network connectivity changed: UNAVAILABLE')
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
var Ua = null
function Eh() {
  return (
    Ua === null
      ? (Ua = (function () {
          return 268435456 + Math.round(2147483648 * Math.random())
        })())
      : Ua++,
    '0x' + Ua.toString(16)
  )
}
var RR = {
  BatchGetDocuments: 'batchGet',
  Commit: 'commit',
  RunQuery: 'runQuery',
  RunAggregationQuery: 'runAggregationQuery',
}
var Nf = class {
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
var xe = 'WebChannelConnection',
  Rf = class extends class {
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
      let a = Eh(),
        c = this.bo(n, r.toUriEncodedString())
      _('RestConnection', `Sending RPC '${n}' ${a}:`, c, i)
      let u = {
        'google-cloud-resource-prefix': this.po,
        'x-goog-request-params': this.yo,
      }
      return (
        this.Do(u, s, o),
        this.Co(n, c, u, i).then(
          (l) => (_('RestConnection', `Received RPC '${n}' ${a}: `, l), l),
          (l) => {
            throw (
              (Ur(
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
        return 'gl-js/ fire/' + Jr
      })()),
        (n['Content-Type'] = 'text/plain'),
        this.databaseInfo.appId &&
          (n['X-Firebase-GMPID'] = this.databaseInfo.appId),
        r && r.headers.forEach((s, o) => (n[o] = s)),
        i && i.headers.forEach((s, o) => (n[o] = s))
    }
    bo(n, r) {
      let i = RR[n]
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
      let s = Eh()
      return new Promise((o, a) => {
        let c = new iI()
        c.setWithCredentials(!0),
          c.listenOnce(nI.COMPLETE, () => {
            try {
              switch (c.getLastErrorCode()) {
                case La.NO_ERROR:
                  let l = c.getResponseJson()
                  _(xe, `XHR for RPC '${e}' ${s} received:`, JSON.stringify(l)),
                    o(l)
                  break
                case La.TIMEOUT:
                  _(xe, `RPC '${e}' ${s} timed out`),
                    a(new E(y.DEADLINE_EXCEEDED, 'Request time out'))
                  break
                case La.HTTP_ERROR:
                  let d = c.getStatus()
                  if (
                    (_(
                      xe,
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
                      let g = (function (w) {
                        let D = w.toLowerCase().replace(/_/g, '-')
                        return Object.values(y).indexOf(D) >= 0 ? D : y.UNKNOWN
                      })(f.status)
                      a(new E(g, f.message))
                    } else
                      a(
                        new E(
                          y.UNKNOWN,
                          'Server responded with status ' + c.getStatus()
                        )
                      )
                  } else a(new E(y.UNAVAILABLE, 'Connection failed.'))
                  break
                default:
                  S()
              }
            } finally {
              _(xe, `RPC '${e}' ${s} completed.`)
            }
          })
        let u = JSON.stringify(i)
        _(xe, `RPC '${e}' ${s} sending request:`, i),
          c.send(n, 'POST', u, r, 15)
      })
    }
    Fo(e, n, r) {
      let i = Eh(),
        s = [this.fo, '/', 'google.firestore.v1.Firestore', '/', e, '/channel'],
        o = eI(),
        a = tI(),
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
      _(xe, `Creating RPC '${e}' stream ${i}: ${l}`, c)
      let d = o.createWebChannel(l, c),
        h = !1,
        f = !1,
        g = new Nf({
          lo: (w) => {
            f
              ? _(
                  xe,
                  `Not sending because RPC '${e}' stream ${i} is closed:`,
                  w
                )
              : (h ||
                  (_(xe, `Opening RPC '${e}' stream ${i} transport.`),
                  d.open(),
                  (h = !0)),
                _(xe, `RPC '${e}' stream ${i} sending:`, w),
                d.send(w))
          },
          ho: () => d.close(),
        }),
        I = (w, D, j) => {
          w.listen(D, (K) => {
            try {
              j(K)
            } catch (z) {
              setTimeout(() => {
                throw z
              }, 0)
            }
          })
        }
      return (
        I(d, os.EventType.OPEN, () => {
          f || _(xe, `RPC '${e}' stream ${i} transport opened.`)
        }),
        I(d, os.EventType.CLOSE, () => {
          f ||
            ((f = !0), _(xe, `RPC '${e}' stream ${i} transport closed`), g.Vo())
        }),
        I(d, os.EventType.ERROR, (w) => {
          f ||
            ((f = !0),
            Ur(xe, `RPC '${e}' stream ${i} transport errored:`, w),
            g.Vo(new E(y.UNAVAILABLE, 'The operation could not be completed')))
        }),
        I(d, os.EventType.MESSAGE, (w) => {
          var D
          if (!f) {
            let j = w.data[0]
            fe(!!j)
            let K = j,
              z =
                K.error ||
                ((D = K[0]) === null || D === void 0 ? void 0 : D.error)
            if (z) {
              _(xe, `RPC '${e}' stream ${i} received error:`, z)
              let re = z.status,
                G = (function (mn) {
                  let xs = le[mn]
                  if (xs !== void 0) return XI(xs)
                })(re),
                Be = z.message
              G === void 0 &&
                ((G = y.INTERNAL),
                (Be =
                  'Unknown error status: ' +
                  re +
                  ' with message ' +
                  z.message)),
                (f = !0),
                g.Vo(new E(G, Be)),
                d.close()
            } else _(xe, `RPC '${e}' stream ${i} received:`, j), g.mo(j)
          }
        }),
        I(a, rI.STAT_EVENT, (w) => {
          w.stat === _h.PROXY
            ? _(xe, `RPC '${e}' stream ${i} detected buffering proxy`)
            : w.stat === _h.NOPROXY &&
              _(xe, `RPC '${e}' stream ${i} detected no buffering proxy`)
        }),
        setTimeout(() => {
          g.Ro()
        }, 0),
        g
      )
    }
  }
function Th() {
  return typeof document < 'u' ? document : null
}
function cw(t) {
  return new sf(t, !0)
}
var rc = class {
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
      _(
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
var Mf = class {
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
        (this.jo = new rc(e, n))
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
            : n && n.code === y.RESOURCE_EXHAUSTED
              ? (Nt(n.toString()),
                Nt(
                  'Using maximum backoff delay to prevent overloading the backend.'
                ),
                this.jo.ko())
              : n &&
                n.code === y.UNAUTHENTICATED &&
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
            let i = new E(y.UNKNOWN, 'Fetching auth token failed: ' + r.message)
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
        _('PersistentStream', `close with error: ${e}`),
        (this.stream = null),
        this.close(4, e)
      )
    }
    s_(e) {
      return (n) => {
        this.oi.enqueueAndForget(() =>
          this.Wo === e
            ? n()
            : (_(
                'PersistentStream',
                'stream callback skipped by getCloseGuardedDispatcher.'
              ),
              Promise.resolve())
        )
      }
    }
  },
  Pf = class extends Mf {
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
      let n = yR(this.serializer, e),
        r = (function (s) {
          if (!('targetChange' in s)) return N.min()
          let o = s.targetChange
          return o.targetIds && o.targetIds.length
            ? N.min()
            : o.readTime
              ? Fr(o.readTime)
              : N.min()
        })(e)
      return this.listener.u_(n, r)
    }
    c_(e) {
      let n = {}
      ;(n.database = CI(this.serializer)),
        (n.addTarget = (function (s, o) {
          let a,
            c = o.target
          if (
            ((a = Yh(c) ? { documents: vR(s, c) } : { query: _R(s, c).ut }),
            (a.targetId = o.targetId),
            o.resumeToken.approximateByteSize() > 0)
          ) {
            a.resumeToken = pR(s, o.resumeToken)
            let u = of(s, o.expectedCount)
            u !== null && (a.expectedCount = u)
          } else if (o.snapshotVersion.compareTo(N.min()) > 0) {
            a.readTime = fR(s, o.snapshotVersion.toTimestamp())
            let u = of(s, o.expectedCount)
            u !== null && (a.expectedCount = u)
          }
          return a
        })(this.serializer, e))
      let r = wR(this.serializer, e)
      r && (n.labels = r), this.t_(n)
    }
    l_(e) {
      let n = {}
      ;(n.database = CI(this.serializer)), (n.removeTarget = e), this.t_(n)
    }
  }
var kf = class extends class {} {
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
        y.FAILED_PRECONDITION,
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
        .then(([s, o]) => this.connection.So(e, af(n, r), i, s, o))
        .catch((s) => {
          throw s.name === 'FirebaseError'
            ? (s.code === y.UNAUTHENTICATED &&
                (this.authCredentials.invalidateToken(),
                this.appCheckCredentials.invalidateToken()),
              s)
            : new E(y.UNKNOWN, s.toString())
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
        .then(([o, a]) => this.connection.vo(e, af(n, r), i, o, a, s))
        .catch((o) => {
          throw o.name === 'FirebaseError'
            ? (o.code === y.UNAUTHENTICATED &&
                (this.authCredentials.invalidateToken(),
                this.appCheckCredentials.invalidateToken()),
              o)
            : new E(y.UNKNOWN, o.toString())
        })
    )
  }
  terminate() {
    ;(this.A_ = !0), this.connection.terminate()
  }
}
var Of = class {
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
    this.g_ ? (Nt(n), (this.g_ = !1)) : _('OnlineStateTracker', n)
  }
  b_() {
    this.f_ !== null && (this.f_.cancel(), (this.f_ = null))
  }
}
var Ff = class {
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
            Ss(this) &&
              (_(
                'RemoteStore',
                'Restarting streams for network reachability change.'
              ),
              yield (function (c) {
                return p(this, null, function* () {
                  let u = U(c)
                  u.v_.add(4),
                    yield As(u),
                    u.x_.set('Unknown'),
                    u.v_.delete(4),
                    yield _c(u)
                })
              })(this))
          })
        )
      }),
      (this.x_ = new Of(r, i))
  }
}
function _c(t) {
  return p(this, null, function* () {
    if (Ss(t)) for (let e of t.F_) yield e(!0)
  })
}
function As(t) {
  return p(this, null, function* () {
    for (let e of t.F_) yield e(!1)
  })
}
function uw(t, e) {
  let n = U(t)
  n.C_.has(e.targetId) ||
    (n.C_.set(e.targetId, e), hp(n) ? dp(n) : Zr(n).Jo() && lp(n, e))
}
function lw(t, e) {
  let n = U(t),
    r = Zr(n)
  n.C_.delete(e),
    r.Jo() && dw(n, e),
    n.C_.size === 0 && (r.Jo() ? r.Xo() : Ss(n) && n.x_.set('Unknown'))
}
function lp(t, e) {
  if (
    (t.O_.Oe(e.targetId),
    e.resumeToken.approximateByteSize() > 0 ||
      e.snapshotVersion.compareTo(N.min()) > 0)
  ) {
    let n = t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size
    e = e.withExpectedCount(n)
  }
  Zr(t).c_(e)
}
function dw(t, e) {
  t.O_.Oe(e), Zr(t).l_(e)
}
function dp(t) {
  ;(t.O_ = new rf({
    getRemoteKeysForTarget: (e) => t.remoteSyncer.getRemoteKeysForTarget(e),
    _t: (e) => t.C_.get(e) || null,
    nt: () => t.datastore.serializer.databaseId,
  })),
    Zr(t).start(),
    t.x_.p_()
}
function hp(t) {
  return Ss(t) && !Zr(t).Ho() && t.C_.size > 0
}
function Ss(t) {
  return U(t).v_.size === 0
}
function hw(t) {
  t.O_ = void 0
}
function MR(t) {
  return p(this, null, function* () {
    t.C_.forEach((e, n) => {
      lp(t, e)
    })
  })
}
function PR(t, e) {
  return p(this, null, function* () {
    hw(t), hp(t) ? (t.x_.S_(e), dp(t)) : t.x_.set('Unknown')
  })
}
function kR(t, e, n) {
  return p(this, null, function* () {
    if ((t.x_.set('Online'), e instanceof Za && e.state === 2 && e.cause))
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
        _(
          'RemoteStore',
          'Failed to remove targets %s: %s ',
          e.targetIds.join(','),
          r
        ),
          yield AI(t, r)
      }
    else if (
      (e instanceof Or ? t.O_.$e(e) : e instanceof Ja ? t.O_.Je(e) : t.O_.Ge(e),
      !n.isEqual(N.min()))
    )
      try {
        let r = yield aw(t.localStore)
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
                  l.withResumeToken(Fe.EMPTY_BYTE_STRING, l.snapshotVersion)
                ),
                  dw(s, c)
                let d = new ws(l.target, c, u, l.sequenceNumber)
                lp(s, d)
              }),
              s.remoteSyncer.applyRemoteEvent(a)
            )
          })(t, n))
      } catch (r) {
        _('RemoteStore', 'Failed to raise snapshot:', r), yield AI(t, r)
      }
  })
}
function AI(t, e, n) {
  return p(this, null, function* () {
    if (!bs(e)) throw e
    t.v_.add(1),
      yield As(t),
      t.x_.set('Offline'),
      n || (n = () => aw(t.localStore)),
      t.asyncQueue.enqueueRetryable(() =>
        p(this, null, function* () {
          _('RemoteStore', 'Retrying IndexedDB access'),
            yield n(),
            t.v_.delete(1),
            yield _c(t)
        })
      )
  })
}
function SI(t, e) {
  return p(this, null, function* () {
    let n = U(t)
    n.asyncQueue.verifyOperationInProgress(),
      _('RemoteStore', 'RemoteStore received new credentials')
    let r = Ss(n)
    n.v_.add(3),
      yield As(n),
      r && n.x_.set('Unknown'),
      yield n.remoteSyncer.handleCredentialChange(e),
      n.v_.delete(3),
      yield _c(n)
  })
}
function OR(t, e) {
  return p(this, null, function* () {
    let n = U(t)
    e
      ? (n.v_.delete(2), yield _c(n))
      : e || (n.v_.add(2), yield As(n), n.x_.set('Unknown'))
  })
}
function Zr(t) {
  return (
    t.N_ ||
      ((t.N_ = (function (n, r, i) {
        let s = U(n)
        return (
          s.R_(),
          new Pf(
            r,
            s.connection,
            s.authCredentials,
            s.appCheckCredentials,
            s.serializer,
            i
          )
        )
      })(t.datastore, t.asyncQueue, {
        Po: MR.bind(null, t),
        To: PR.bind(null, t),
        u_: kR.bind(null, t),
      })),
      t.F_.push((e) =>
        p(this, null, function* () {
          e
            ? (t.N_.Zo(), hp(t) ? dp(t) : t.x_.set('Unknown'))
            : (yield t.N_.stop(), hw(t))
        })
      )),
    t.N_
  )
}
var Lf = class t {
  constructor(e, n, r, i, s) {
    ;(this.asyncQueue = e),
      (this.timerId = n),
      (this.targetTimeMs = r),
      (this.op = i),
      (this.removalCallback = s),
      (this.deferred = new zt()),
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
        new E(y.CANCELLED, 'Operation cancelled' + (e ? ': ' + e : ''))
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
function fw(t, e) {
  if ((Nt('AsyncQueue', `${e}: ${t}`), bs(t)))
    return new E(y.UNAVAILABLE, `${e}: ${t}`)
  throw t
}
var ic = class t {
  constructor(e) {
    ;(this.comparator = e
      ? (n, r) => e(n, r) || T.comparator(n.key, r.key)
      : (n, r) => T.comparator(n.key, r.key)),
      (this.keyedMap = cs()),
      (this.sortedSet = new se(this.comparator))
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
var sc = class {
    constructor() {
      this.L_ = new se(T.comparator)
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
                      : S()
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
  Yr = class t {
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
        new t(e, n, ic.emptySet(n), o, r, i, !0, !1, s)
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
          yc(this.query, e.query) &&
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
var Vf = class {
    constructor() {
      ;(this.q_ = void 0), (this.Q_ = [])
    }
  },
  Uf = class {
    constructor() {
      ;(this.queries = new fn((e) => qI(e), yc)),
        (this.onlineState = 'Unknown'),
        (this.K_ = new Set())
    }
  }
function FR(t, e) {
  return p(this, null, function* () {
    let n = U(t),
      r = e.query,
      i = !1,
      s = n.queries.get(r)
    if ((s || ((i = !0), (s = new Vf())), i))
      try {
        s.q_ = yield n.onListen(r)
      } catch (o) {
        let a = fw(o, `Initialization of query '${Rr(e.query)}' failed`)
        return void e.onError(a)
      }
    n.queries.set(r, s),
      s.Q_.push(e),
      e.U_(n.onlineState),
      s.q_ && e.W_(s.q_) && fp(n)
  })
}
function LR(t, e) {
  return p(this, null, function* () {
    let n = U(t),
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
function VR(t, e) {
  let n = U(t),
    r = !1
  for (let i of e) {
    let s = i.query,
      o = n.queries.get(s)
    if (o) {
      for (let a of o.Q_) a.W_(i) && (r = !0)
      o.q_ = i
    }
  }
  r && fp(n)
}
function UR(t, e, n) {
  let r = U(t),
    i = r.queries.get(e)
  if (i) for (let s of i.Q_) s.onError(n)
  r.queries.delete(e)
}
function fp(t) {
  t.K_.forEach((e) => {
    e.next()
  })
}
var jf = class {
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
      e = new Yr(
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
    ;(e = Yr.fromInitialDocuments(
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
var oc = class {
    constructor(e) {
      this.key = e
    }
  },
  ac = class {
    constructor(e) {
      this.key = e
    }
  },
  Bf = class {
    constructor(e, n) {
      ;(this.query = e),
        (this.oa = n),
        (this._a = null),
        (this.hasCachedResults = !1),
        (this.current = !1),
        (this.aa = L()),
        (this.mutatedKeys = L()),
        (this.ua = zI(e)),
        (this.ca = new ic(this.ua))
    }
    get la() {
      return this.oa
    }
    ha(e, n) {
      let r = n ? n.Pa : new sc(),
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
            f = vc(this.query, d) ? d : null,
            g = !!h && this.mutatedKeys.has(h.key),
            I =
              !!f &&
              (f.hasLocalMutations ||
                (this.mutatedKeys.has(f.key) && f.hasCommittedMutations)),
            w = !1
          h && f
            ? h.data.isEqual(f.data)
              ? g !== I && (r.track({ type: 3, doc: f }), (w = !0))
              : this.Ia(h, f) ||
                (r.track({ type: 2, doc: f }),
                (w = !0),
                ((c && this.ua(f, c) > 0) || (u && this.ua(f, u) < 0)) &&
                  (a = !0))
            : !h && f
              ? (r.track({ type: 0, doc: f }), (w = !0))
              : h &&
                !f &&
                (r.track({ type: 1, doc: h }), (w = !0), (c || u) && (a = !0)),
            w &&
              (f
                ? ((o = o.add(f)), (s = I ? s.add(l) : s.delete(l)))
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
          (function (f, g) {
            let I = (w) => {
              switch (w) {
                case 0:
                  return 1
                case 2:
                case 3:
                  return 2
                case 1:
                  return 0
                default:
                  return S()
              }
            }
            return I(f) - I(g)
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
              snapshot: new Yr(
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
              Pa: new sc(),
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
      ;(this.aa = L()),
        this.ca.forEach((r) => {
          this.Aa(r.key) && (this.aa = this.aa.add(r.key))
        })
      let n = []
      return (
        e.forEach((r) => {
          this.aa.has(r) || n.push(new ac(r))
        }),
        this.aa.forEach((r) => {
          e.has(r) || n.push(new oc(r))
        }),
        n
      )
    }
    Ra(e) {
      ;(this.oa = e.hs), (this.aa = L())
      let n = this.ha(e.documents)
      return this.applyChanges(n, !0)
    }
    Va() {
      return Yr.fromInitialDocuments(
        this.query,
        this.ca,
        this.mutatedKeys,
        this._a === 0,
        this.hasCachedResults
      )
    }
  },
  $f = class {
    constructor(e, n, r) {
      ;(this.query = e), (this.targetId = n), (this.view = r)
    }
  },
  Hf = class {
    constructor(e) {
      ;(this.key = e), (this.ma = !1)
    }
  },
  qf = class {
    constructor(e, n, r, i, s, o) {
      ;(this.localStore = e),
        (this.remoteStore = n),
        (this.eventManager = r),
        (this.sharedClientState = i),
        (this.currentUser = s),
        (this.maxConcurrentLimboResolutions = o),
        (this.fa = {}),
        (this.ga = new fn((a) => qI(a), yc)),
        (this.pa = new Map()),
        (this.ya = new Set()),
        (this.wa = new se(T.comparator)),
        (this.Sa = new Map()),
        (this.ba = new Ts()),
        (this.Da = {}),
        (this.Ca = new Map()),
        (this.va = Es.Bn()),
        (this.onlineState = 'Unknown'),
        (this.Fa = void 0)
    }
    get isPrimaryClient() {
      return this.Fa === !0
    }
  }
function jR(t, e) {
  return p(this, null, function* () {
    let n = WR(t),
      r,
      i,
      s = n.ga.get(e)
    if (s)
      (r = s.targetId),
        n.sharedClientState.addLocalQueryTarget(r),
        (i = s.view.Va())
    else {
      let o = yield xR(n.localStore, xt(e)),
        a = n.sharedClientState.addLocalQueryTarget(o.targetId)
      ;(r = o.targetId),
        (i = yield BR(n, e, r, a === 'current', o.resumeToken)),
        n.isPrimaryClient && uw(n.remoteStore, o)
    }
    return i
  })
}
function BR(t, e, n, r, i) {
  return p(this, null, function* () {
    t.Ma = (d, h, f) =>
      (function (I, w, D, j) {
        return p(this, null, function* () {
          let K = w.view.ha(D)
          K.Xi &&
            (K = yield bI(I.localStore, w.query, !1).then(({ documents: Be }) =>
              w.view.ha(Be, K)
            ))
          let z = j && j.targetChanges.get(w.targetId),
            re = j && j.targetMismatches.get(w.targetId) != null,
            G = w.view.applyChanges(K, I.isPrimaryClient, z, re)
          return NI(I, w.targetId, G.da), G.snapshot
        })
      })(t, d, h, f)
    let s = yield bI(t.localStore, e, !0),
      o = new Bf(e, s.hs),
      a = o.ha(s.documents),
      c = Is.createSynthesizedTargetChangeForCurrentChange(
        n,
        r && t.onlineState !== 'Offline',
        i
      ),
      u = o.applyChanges(a, t.isPrimaryClient, c)
    NI(t, n, u.da)
    let l = new $f(e, n, o)
    return (
      t.ga.set(e, l),
      t.pa.has(n) ? t.pa.get(n).push(e) : t.pa.set(n, [e]),
      u.snapshot
    )
  })
}
function $R(t, e) {
  return p(this, null, function* () {
    let n = U(t),
      r = n.ga.get(e),
      i = n.pa.get(r.targetId)
    if (i.length > 1)
      return (
        n.pa.set(
          r.targetId,
          i.filter((s) => !yc(s, e))
        ),
        void n.ga.delete(e)
      )
    n.isPrimaryClient
      ? (n.sharedClientState.removeLocalQueryTarget(r.targetId),
        n.sharedClientState.isActiveQueryTarget(r.targetId) ||
          (yield Af(n.localStore, r.targetId, !1)
            .then(() => {
              n.sharedClientState.clearQueryState(r.targetId),
                lw(n.remoteStore, r.targetId),
                zf(n, r.targetId)
            })
            .catch(np)))
      : (zf(n, r.targetId), yield Af(n.localStore, r.targetId, !0))
  })
}
function pw(t, e) {
  return p(this, null, function* () {
    let n = U(t)
    try {
      let r = yield AR(n.localStore, e)
      e.targetChanges.forEach((i, s) => {
        let o = n.Sa.get(s)
        o &&
          (fe(
            i.addedDocuments.size +
              i.modifiedDocuments.size +
              i.removedDocuments.size <=
              1
          ),
          i.addedDocuments.size > 0
            ? (o.ma = !0)
            : i.modifiedDocuments.size > 0
              ? fe(o.ma)
              : i.removedDocuments.size > 0 && (fe(o.ma), (o.ma = !1)))
      }),
        yield gw(n, r, e)
    } catch (r) {
      yield np(r)
    }
  })
}
function xI(t, e, n) {
  let r = U(t)
  if ((r.isPrimaryClient && n === 0) || (!r.isPrimaryClient && n === 1)) {
    let i = []
    r.ga.forEach((s, o) => {
      let a = o.view.U_(e)
      a.snapshot && i.push(a.snapshot)
    }),
      (function (o, a) {
        let c = U(o)
        c.onlineState = a
        let u = !1
        c.queries.forEach((l, d) => {
          for (let h of d.Q_) h.U_(a) && (u = !0)
        }),
          u && fp(c)
      })(r.eventManager, e),
      i.length && r.fa.u_(i),
      (r.onlineState = e),
      r.isPrimaryClient && r.sharedClientState.setOnlineState(e)
  }
}
function HR(t, e, n) {
  return p(this, null, function* () {
    let r = U(t)
    r.sharedClientState.updateQueryState(e, 'rejected', n)
    let i = r.Sa.get(e),
      s = i && i.key
    if (s) {
      let o = new se(T.comparator)
      o = o.insert(s, mt.newNoDocument(s, N.min()))
      let a = L().add(s),
        c = new Ya(N.min(), new Map(), new se(B), o, a)
      yield pw(r, c), (r.wa = r.wa.remove(s)), r.Sa.delete(e), pp(r)
    } else
      yield Af(r.localStore, e, !1)
        .then(() => zf(r, e, n))
        .catch(np)
  })
}
function zf(t, e, n = null) {
  t.sharedClientState.removeLocalQueryTarget(e)
  for (let r of t.pa.get(e)) t.ga.delete(r), n && t.fa.xa(r, n)
  t.pa.delete(e),
    t.isPrimaryClient &&
      t.ba.Vr(e).forEach((r) => {
        t.ba.containsKey(r) || mw(t, r)
      })
}
function mw(t, e) {
  t.ya.delete(e.path.canonicalString())
  let n = t.wa.get(e)
  n !== null &&
    (lw(t.remoteStore, n), (t.wa = t.wa.remove(e)), t.Sa.delete(n), pp(t))
}
function NI(t, e, n) {
  for (let r of n)
    r instanceof oc
      ? (t.ba.addReference(r.key, e), qR(t, r))
      : r instanceof ac
        ? (_('SyncEngine', 'Document no longer in limbo: ' + r.key),
          t.ba.removeReference(r.key, e),
          t.ba.containsKey(r.key) || mw(t, r.key))
        : S()
}
function qR(t, e) {
  let n = e.key,
    r = n.path.canonicalString()
  t.wa.get(n) ||
    t.ya.has(r) ||
    (_('SyncEngine', 'New document in limbo: ' + n), t.ya.add(r), pp(t))
}
function pp(t) {
  for (; t.ya.size > 0 && t.wa.size < t.maxConcurrentLimboResolutions; ) {
    let e = t.ya.values().next().value
    t.ya.delete(e)
    let n = new T(he.fromString(e)),
      r = t.va.next()
    t.Sa.set(r, new Hf(n)),
      (t.wa = t.wa.insert(n, r)),
      uw(
        t.remoteStore,
        new ws(xt(up(n.path)), r, 'TargetPurposeLimboResolution', LI._e)
      )
  }
}
function gw(t, e, n) {
  return p(this, null, function* () {
    let r = U(t),
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
              let l = Tf.Ki(c.targetId, u)
              s.push(l)
            }
          })
        )
      }),
      yield Promise.all(o),
      r.fa.u_(i),
      yield (function (c, u) {
        return p(this, null, function* () {
          let l = U(c)
          try {
            yield l.persistence.runTransaction(
              'notifyLocalViewChanges',
              'readwrite',
              (d) =>
                m.forEach(u, (h) =>
                  m
                    .forEach(h.qi, (f) =>
                      l.persistence.referenceDelegate.addReference(
                        d,
                        h.targetId,
                        f
                      )
                    )
                    .next(() =>
                      m.forEach(h.Qi, (f) =>
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
            if (!bs(d)) throw d
            _('LocalStore', 'Failed to update sequence numbers: ' + d)
          }
          for (let d of u) {
            let h = d.targetId
            if (!d.fromCache) {
              let f = l.ns.get(h),
                g = f.snapshotVersion,
                I = f.withLastLimboFreeSnapshotVersion(g)
              l.ns = l.ns.insert(h, I)
            }
          }
        })
      })(r.localStore, s))
  })
}
function zR(t, e) {
  return p(this, null, function* () {
    let n = U(t)
    if (!n.currentUser.isEqual(e)) {
      _('SyncEngine', 'User change. New user:', e.toKey())
      let r = yield ow(n.localStore, e)
      ;(n.currentUser = e),
        (function (s, o) {
          s.Ca.forEach((a) => {
            a.forEach((c) => {
              c.reject(new E(y.CANCELLED, o))
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
        yield gw(n, r.us)
    }
  })
}
function GR(t, e) {
  let n = U(t),
    r = n.Sa.get(e)
  if (r && r.ma) return L().add(r.key)
  {
    let i = L(),
      s = n.pa.get(e)
    if (!s) return i
    for (let o of s) {
      let a = n.ga.get(o)
      i = i.unionWith(a.view.la)
    }
    return i
  }
}
function WR(t) {
  let e = U(t)
  return (
    (e.remoteStore.remoteSyncer.applyRemoteEvent = pw.bind(null, e)),
    (e.remoteStore.remoteSyncer.getRemoteKeysForTarget = GR.bind(null, e)),
    (e.remoteStore.remoteSyncer.rejectListen = HR.bind(null, e)),
    (e.fa.u_ = VR.bind(null, e.eventManager)),
    (e.fa.xa = UR.bind(null, e.eventManager)),
    e
  )
}
var cc = class {
  constructor() {
    this.synchronizeTabs = !1
  }
  initialize(e) {
    return p(this, null, function* () {
      ;(this.serializer = cw(e.databaseInfo.databaseId)),
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
    return bR(this.persistence, new Cf(), e.initialUser, this.serializer)
  }
  createPersistence(e) {
    return new If(Ef.Hr, this.serializer)
  }
  createSharedClientState(e) {
    return new Sf()
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
var Gf = class {
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
          xI(this.syncEngine, r, 1)),
        (this.remoteStore.remoteSyncer.handleCredentialChange = zR.bind(
          null,
          this.syncEngine
        )),
        yield OR(this.remoteStore, this.syncEngine.isPrimaryClient))
    })
  }
  createEventManager(e) {
    return (function () {
      return new Uf()
    })()
  }
  createDatastore(e) {
    let n = cw(e.databaseInfo.databaseId),
      r = (function (s) {
        return new Rf(s)
      })(e.databaseInfo)
    return (function (s, o, a, c) {
      return new kf(s, o, a, c)
    })(e.authCredentials, e.appCheckCredentials, r, n)
  }
  createRemoteStore(e) {
    return (function (r, i, s, o, a) {
      return new Ff(r, i, s, o, a)
    })(
      this.localStore,
      this.datastore,
      e.asyncQueue,
      (n) => xI(this.syncEngine, n, 0),
      (function () {
        return nc.D() ? new nc() : new xf()
      })()
    )
  }
  createSyncEngine(e, n) {
    return (function (i, s, o, a, c, u, l) {
      let d = new qf(i, s, o, a, c, u)
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
          let i = U(r)
          _('RemoteStore', 'RemoteStore shutting down.'),
            i.v_.add(5),
            yield As(i),
            i.M_.shutdown(),
            i.x_.set('Unknown')
        })
      })(this.remoteStore),
        (e = this.datastore) === null || e === void 0 || e.terminate()
    })
  }
}
var Wf = class {
  constructor(e) {
    ;(this.observer = e), (this.muted = !1)
  }
  next(e) {
    this.observer.next && this.Ba(this.observer.next, e)
  }
  error(e) {
    this.observer.error
      ? this.Ba(this.observer.error, e)
      : Nt('Uncaught Error in snapshot listener:', e.toString())
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
var Kf = class {
  constructor(e, n, r, i) {
    ;(this.authCredentials = e),
      (this.appCheckCredentials = n),
      (this.asyncQueue = r),
      (this.databaseInfo = i),
      (this.user = _e.UNAUTHENTICATED),
      (this.clientId = Mh.newId()),
      (this.authCredentialListener = () => Promise.resolve()),
      (this.appCheckCredentialListener = () => Promise.resolve()),
      this.authCredentials.start(r, (s) =>
        p(this, null, function* () {
          _('FirestoreClient', 'Received user=', s.uid),
            yield this.authCredentialListener(s),
            (this.user = s)
        })
      ),
      this.appCheckCredentials.start(
        r,
        (s) => (
          _('FirestoreClient', 'Received new app check token=', s),
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
        y.FAILED_PRECONDITION,
        'The client has already been terminated.'
      )
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode()
    let e = new zt()
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
            let r = fw(n, 'Failed to shutdown persistence')
            e.reject(r)
          }
        })
      ),
      e.promise
    )
  }
}
function Dh(t, e) {
  return p(this, null, function* () {
    t.asyncQueue.verifyOperationInProgress(),
      _('FirestoreClient', 'Initializing OfflineComponentProvider')
    let n = t.configuration
    yield e.initialize(n)
    let r = n.initialUser
    t.setCredentialChangeListener((i) =>
      p(this, null, function* () {
        r.isEqual(i) || (yield ow(e.localStore, i), (r = i))
      })
    ),
      e.persistence.setDatabaseDeletedListener(() => t.terminate()),
      (t._offlineComponents = e)
  })
}
function RI(t, e) {
  return p(this, null, function* () {
    t.asyncQueue.verifyOperationInProgress()
    let n = yield QR(t)
    _('FirestoreClient', 'Initializing OnlineComponentProvider'),
      yield e.initialize(n, t.configuration),
      t.setCredentialChangeListener((r) => SI(e.remoteStore, r)),
      t.setAppCheckTokenChangeListener((r, i) => SI(e.remoteStore, i)),
      (t._onlineComponents = e)
  })
}
function KR(t) {
  return t.name === 'FirebaseError'
    ? t.code === y.FAILED_PRECONDITION || t.code === y.UNIMPLEMENTED
    : !(typeof DOMException < 'u' && t instanceof DOMException) ||
        t.code === 22 ||
        t.code === 20 ||
        t.code === 11
}
function QR(t) {
  return p(this, null, function* () {
    if (!t._offlineComponents)
      if (t._uninitializedComponentsProvider) {
        _('FirestoreClient', 'Using user provided OfflineComponentProvider')
        try {
          yield Dh(t, t._uninitializedComponentsProvider._offline)
        } catch (e) {
          let n = e
          if (!KR(n)) throw n
          Ur(
            'Error using user provided cache. Falling back to memory cache: ' +
              n
          ),
            yield Dh(t, new cc())
        }
      } else
        _('FirestoreClient', 'Using default OfflineComponentProvider'),
          yield Dh(t, new cc())
    return t._offlineComponents
  })
}
function YR(t) {
  return p(this, null, function* () {
    return (
      t._onlineComponents ||
        (t._uninitializedComponentsProvider
          ? (_(
              'FirestoreClient',
              'Using user provided OnlineComponentProvider'
            ),
            yield RI(t, t._uninitializedComponentsProvider._online))
          : (_('FirestoreClient', 'Using default OnlineComponentProvider'),
            yield RI(t, new Gf()))),
      t._onlineComponents
    )
  })
}
function MI(t) {
  return p(this, null, function* () {
    let e = yield YR(t),
      n = e.eventManager
    return (
      (n.onListen = jR.bind(null, e.syncEngine)),
      (n.onUnlisten = $R.bind(null, e.syncEngine)),
      n
    )
  })
}
function yw(t) {
  let e = {}
  return t.timeoutSeconds !== void 0 && (e.timeoutSeconds = t.timeoutSeconds), e
}
var PI = new Map()
function JR(t, e, n) {
  if (!n)
    throw new E(
      y.INVALID_ARGUMENT,
      `Function ${t}() cannot be called with an empty ${e}.`
    )
}
function ZR(t, e, n, r) {
  if (e === !0 && r === !0)
    throw new E(y.INVALID_ARGUMENT, `${t} and ${n} cannot be used together.`)
}
function kI(t) {
  if (T.isDocumentKey(t))
    throw new E(
      y.INVALID_ARGUMENT,
      `Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`
    )
}
function XR(t) {
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
  return typeof t == 'function' ? 'a function' : S()
}
function Ba(t, e) {
  if (('_delegate' in t && (t = t._delegate), !(t instanceof e))) {
    if (e.name === t.constructor.name)
      throw new E(
        y.INVALID_ARGUMENT,
        'Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?'
      )
    {
      let n = XR(t)
      throw new E(
        y.INVALID_ARGUMENT,
        `Expected type '${e.name}', but it was: ${n}`
      )
    }
  }
  return t
}
var uc = class {
    constructor(e) {
      var n, r
      if (e.host === void 0) {
        if (e.ssl !== void 0)
          throw new E(
            y.INVALID_ARGUMENT,
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
            y.INVALID_ARGUMENT,
            'cacheSizeBytes must be at least 1048576'
          )
        this.cacheSizeBytes = e.cacheSizeBytes
      }
      ZR(
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
        (this.experimentalLongPollingOptions = yw(
          (r = e.experimentalLongPollingOptions) !== null && r !== void 0
            ? r
            : {}
        )),
        (function (s) {
          if (s.timeoutSeconds !== void 0) {
            if (isNaN(s.timeoutSeconds))
              throw new E(
                y.INVALID_ARGUMENT,
                `invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`
              )
            if (s.timeoutSeconds < 5)
              throw new E(
                y.INVALID_ARGUMENT,
                `invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`
              )
            if (s.timeoutSeconds > 30)
              throw new E(
                y.INVALID_ARGUMENT,
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
  Ds = class {
    constructor(e, n, r, i) {
      ;(this._authCredentials = e),
        (this._appCheckCredentials = n),
        (this._databaseId = r),
        (this._app = i),
        (this.type = 'firestore-lite'),
        (this._persistenceKey = '(lite)'),
        (this._settings = new uc({})),
        (this._settingsFrozen = !1)
    }
    get app() {
      if (!this._app)
        throw new E(
          y.FAILED_PRECONDITION,
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
          y.FAILED_PRECONDITION,
          'Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.'
        )
      ;(this._settings = new uc(e)),
        e.credentials !== void 0 &&
          (this._authCredentials = (function (r) {
            if (!r) return new Ch()
            switch (r.type) {
              case 'firstParty':
                return new xh(
                  r.sessionIndex || '0',
                  r.iamToken || null,
                  r.authTokenFactory || null
                )
              case 'provider':
                return r.client
              default:
                throw new E(
                  y.INVALID_ARGUMENT,
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
          let r = PI.get(n)
          r &&
            (_('ComponentProvider', 'Removing Datastore'),
            PI.delete(n),
            r.terminate())
        })(this),
        Promise.resolve()
      )
    }
  }
function vw(t, e, n, r = {}) {
  var i
  let s = (t = Ba(t, Ds))._getSettings(),
    o = `${e}:${n}`
  if (
    (s.host !== 'firestore.googleapis.com' &&
      s.host !== o &&
      Ur(
        'Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.'
      ),
    t._setSettings(Object.assign(Object.assign({}, s), { host: o, ssl: !1 })),
    r.mockUserToken)
  ) {
    let a, c
    if (typeof r.mockUserToken == 'string')
      (a = r.mockUserToken), (c = _e.MOCK_USER)
    else {
      a = rv(
        r.mockUserToken,
        (i = t._app) === null || i === void 0 ? void 0 : i.options.projectId
      )
      let u = r.mockUserToken.sub || r.mockUserToken.user_id
      if (!u)
        throw new E(
          y.INVALID_ARGUMENT,
          "mockUserToken must contain 'sub' or 'user_id' field!"
        )
      c = new _e(u)
    }
    t._authCredentials = new bh(new $a(a, c))
  }
}
var lc = class t {
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
  Xn = class t {
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
      return new Lr(this.firestore, this.converter, this._key.path.popLast())
    }
    withConverter(e) {
      return new t(this.firestore, e, this._key)
    }
  },
  Lr = class t extends lc {
    constructor(e, n, r) {
      super(e, n, up(r)), (this._path = r), (this.type = 'collection')
    }
    get id() {
      return this._query.path.lastSegment()
    }
    get path() {
      return this._query.path.canonicalString()
    }
    get parent() {
      let e = this._path.popLast()
      return e.isEmpty() ? null : new Xn(this.firestore, null, new T(e))
    }
    withConverter(e) {
      return new t(this.firestore, e, this._path)
    }
  }
function _w(t, e, ...n) {
  if (((t = rn(t)), JR('collection', 'path', e), t instanceof Ds)) {
    let r = he.fromString(e, ...n)
    return kI(r), new Lr(t, null, r)
  }
  {
    if (!(t instanceof Xn || t instanceof Lr))
      throw new E(
        y.INVALID_ARGUMENT,
        'Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore'
      )
    let r = t._path.child(he.fromString(e, ...n))
    return kI(r), new Lr(t.firestore, null, r)
  }
}
var Qf = class {
  constructor() {
    ;(this.Xa = Promise.resolve()),
      (this.eu = []),
      (this.tu = !1),
      (this.nu = []),
      (this.ru = null),
      (this.iu = !1),
      (this.su = !1),
      (this.ou = []),
      (this.jo = new rc(this, 'async_queue_retry')),
      (this._u = () => {
        let n = Th()
        n &&
          _('AsyncQueue', 'Visibility state changed to ' + n.visibilityState),
          this.jo.Ko()
      })
    let e = Th()
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
      let n = Th()
      n &&
        typeof n.removeEventListener == 'function' &&
        n.removeEventListener('visibilitychange', this._u)
    }
  }
  enqueue(e) {
    if ((this.au(), this.tu)) return new Promise(() => {})
    let n = new zt()
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
          if (!bs(e)) throw e
          _('AsyncQueue', 'Operation failed with retryable error: ' + e)
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
            throw (Nt('INTERNAL UNHANDLED ERROR: ', i), r)
          })
          .then((r) => ((this.iu = !1), r))
      )
    )
    return (this.Xa = n), n
  }
  enqueueAfterDelay(e, n, r) {
    this.au(), this.ou.indexOf(e) > -1 && (n = 0)
    let i = Lf.createAndSchedule(this, e, n, r, (s) => this.lu(s))
    return this.nu.push(i), i
  }
  au() {
    this.ru && S()
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
function OI(t) {
  return (function (n, r) {
    if (typeof n != 'object' || n === null) return !1
    let i = n
    for (let s of r) if (s in i && typeof i[s] == 'function') return !0
    return !1
  })(t, ['next', 'error', 'complete'])
}
var Cs = class extends Ds {
  constructor(e, n, r, i) {
    super(e, n, r, i),
      (this.type = 'firestore'),
      (this._queue = (function () {
        return new Qf()
      })()),
      (this._persistenceKey = i?.name || '[DEFAULT]')
  }
  _terminate() {
    return this._firestoreClient || ww(this), this._firestoreClient.terminate()
  }
}
function Iw(t, e) {
  let n = typeof t == 'object' ? t : Ri(),
    r = typeof t == 'string' ? t : e || '(default)',
    i = dd(n, 'firestore').getImmediate({ identifier: r })
  if (!i._initialized) {
    let s = tv('firestore')
    s && vw(i, ...s)
  }
  return i
}
function eM(t) {
  return (
    t._firestoreClient || ww(t),
    t._firestoreClient.verifyNotTerminated(),
    t._firestoreClient
  )
}
function ww(t) {
  var e, n, r
  let i = t._freezeSettings(),
    s = (function (a, c, u, l) {
      return new Vh(
        a,
        c,
        u,
        l.host,
        l.ssl,
        l.experimentalForceLongPolling,
        l.experimentalAutoDetectLongPolling,
        yw(l.experimentalLongPollingOptions),
        l.useFetchStreams
      )
    })(
      t._databaseId,
      ((e = t._app) === null || e === void 0 ? void 0 : e.options.appId) || '',
      t._persistenceKey,
      i
    )
  ;(t._firestoreClient = new Kf(
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
var Yf = class t {
  constructor(e) {
    this._byteString = e
  }
  static fromBase64String(e) {
    try {
      return new t(Fe.fromBase64String(e))
    } catch (n) {
      throw new E(
        y.INVALID_ARGUMENT,
        'Failed to construct data from Base64 string: ' + n
      )
    }
  }
  static fromUint8Array(e) {
    return new t(Fe.fromUint8Array(e))
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
var dc = class {
  constructor(...e) {
    for (let n = 0; n < e.length; ++n)
      if (e[n].length === 0)
        throw new E(
          y.INVALID_ARGUMENT,
          'Invalid field name at argument $(i + 1). Field names must not be empty.'
        )
    this._internalPath = new pt(e)
  }
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath)
  }
}
var Jf = class {
  constructor(e, n) {
    if (!isFinite(e) || e < -90 || e > 90)
      throw new E(
        y.INVALID_ARGUMENT,
        'Latitude must be a number between -90 and 90, but was: ' + e
      )
    if (!isFinite(n) || n < -180 || n > 180)
      throw new E(
        y.INVALID_ARGUMENT,
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
    return B(this._lat, e._lat) || B(this._long, e._long)
  }
}
var tM = new RegExp('[~\\*/\\[\\]]')
function nM(t, e, n) {
  if (e.search(tM) >= 0)
    throw FI(
      `Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,
      t,
      !1,
      void 0,
      n
    )
  try {
    return new dc(...e.split('.'))._internalPath
  } catch {
    throw FI(
      `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
      t,
      !1,
      void 0,
      n
    )
  }
}
function FI(t, e, n, r, i) {
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
    new E(y.INVALID_ARGUMENT, a + t + c)
  )
}
var hc = class {
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
      return new Xn(this._firestore, this._converter, this._key)
    }
    exists() {
      return this._document !== null
    }
    data() {
      if (this._document) {
        if (this._converter) {
          let e = new Zf(
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
        let n = this._document.data.field(Ew('DocumentSnapshot.get', e))
        if (n !== null) return this._userDataWriter.convertValue(n)
      }
    }
  },
  Zf = class extends hc {
    data() {
      return super.data()
    }
  }
function Ew(t, e) {
  return typeof e == 'string'
    ? nM(t, e)
    : e instanceof dc
      ? e._internalPath
      : e._delegate._internalPath
}
function rM(t) {
  if (t.limitType === 'L' && t.explicitOrderBy.length === 0)
    throw new E(
      y.UNIMPLEMENTED,
      'limitToLast() queries require specifying at least one orderBy() clause'
    )
}
var Xf = class {
  convertValue(e, n = 'none') {
    switch (Zn(e)) {
      case 0:
        return null
      case 1:
        return e.booleanValue
      case 2:
        return ne(e.integerValue || e.doubleValue)
      case 3:
        return this.convertTimestamp(e.timestampValue)
      case 4:
        return this.convertServerTimestamp(e, n)
      case 5:
        return e.stringValue
      case 6:
        return this.convertBytes(hn(e.bytesValue))
      case 7:
        return this.convertReference(e.referenceValue)
      case 8:
        return this.convertGeoPoint(e.geoPointValue)
      case 9:
        return this.convertArray(e.arrayValue, n)
      case 10:
        return this.convertObject(e.mapValue, n)
      default:
        throw S()
    }
  }
  convertObject(e, n) {
    return this.convertObjectMap(e.fields, n)
  }
  convertObjectMap(e, n = 'none') {
    let r = {}
    return (
      gc(e, (i, s) => {
        r[i] = this.convertValue(s, n)
      }),
      r
    )
  }
  convertGeoPoint(e) {
    return new Jf(ne(e.latitude), ne(e.longitude))
  }
  convertArray(e, n) {
    return (e.values || []).map((r) => this.convertValue(r, n))
  }
  convertServerTimestamp(e, n) {
    switch (n) {
      case 'previous':
        let r = sp(e)
        return r == null ? null : this.convertValue(r, n)
      case 'estimate':
        return this.convertTimestamp(ps(e))
      default:
        return null
    }
  }
  convertTimestamp(e) {
    let n = dn(e)
    return new rt(n.seconds, n.nanos)
  }
  convertDocumentKey(e, n) {
    let r = he.fromString(e)
    fe(sw(r))
    let i = new Ka(r.get(1), r.get(3)),
      s = new T(r.popFirst(5))
    return (
      i.isEqual(n) ||
        Nt(
          `Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`
        ),
      s
    )
  }
}
var Kn = class {
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
  fc = class extends hc {
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
          let n = new Vr(
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
        let r = this._document.data.field(Ew('DocumentSnapshot.get', e))
        if (r !== null)
          return this._userDataWriter.convertValue(r, n.serverTimestamps)
      }
    }
  },
  Vr = class extends fc {
    data(e = {}) {
      return super.data(e)
    }
  },
  ep = class {
    constructor(e, n, r, i) {
      ;(this._firestore = e),
        (this._userDataWriter = n),
        (this._snapshot = i),
        (this.metadata = new Kn(i.hasPendingWrites, i.fromCache)),
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
          new Vr(
            this._firestore,
            this._userDataWriter,
            r.key,
            r,
            new Kn(
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
          y.INVALID_ARGUMENT,
          'To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().'
        )
      return (
        (this._cachedChanges &&
          this._cachedChangesIncludeMetadataChanges === n) ||
          ((this._cachedChanges = (function (i, s) {
            if (i._snapshot.oldDocs.isEmpty()) {
              let o = 0
              return i._snapshot.docChanges.map((a) => {
                let c = new Vr(
                  i._firestore,
                  i._userDataWriter,
                  a.doc.key,
                  a.doc,
                  new Kn(
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
                  let c = new Vr(
                      i._firestore,
                      i._userDataWriter,
                      a.doc.key,
                      a.doc,
                      new Kn(
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
                    { type: iM(a.type), doc: c, oldIndex: u, newIndex: l }
                  )
                })
            }
          })(this, n)),
          (this._cachedChangesIncludeMetadataChanges = n)),
        this._cachedChanges
      )
    }
  }
function iM(t) {
  switch (t) {
    case 0:
      return 'added'
    case 2:
    case 3:
      return 'modified'
    case 1:
      return 'removed'
    default:
      return S()
  }
}
var pc = class extends Xf {
  constructor(e) {
    super(), (this.firestore = e)
  }
  convertBytes(e) {
    return new Yf(e)
  }
  convertReference(e) {
    let n = this.convertDocumentKey(e, this.firestore._databaseId)
    return new Xn(this.firestore, null, n)
  }
}
function mp(t, ...e) {
  var n, r, i
  t = rn(t)
  let s = { includeMetadataChanges: !1 },
    o = 0
  typeof e[o] != 'object' || OI(e[o]) || ((s = e[o]), o++)
  let a = { includeMetadataChanges: s.includeMetadataChanges }
  if (OI(e[o])) {
    let d = e[o]
    ;(e[o] = (n = d.next) === null || n === void 0 ? void 0 : n.bind(d)),
      (e[o + 1] = (r = d.error) === null || r === void 0 ? void 0 : r.bind(d)),
      (e[o + 2] =
        (i = d.complete) === null || i === void 0 ? void 0 : i.bind(d))
  }
  let c, u, l
  if (t instanceof Xn)
    (u = Ba(t.firestore, Cs)),
      (l = up(t._key.path)),
      (c = {
        next: (d) => {
          e[o] && e[o](sM(u, t, d))
        },
        error: e[o + 1],
        complete: e[o + 2],
      })
  else {
    let d = Ba(t, lc)
    ;(u = Ba(d.firestore, Cs)), (l = d._query)
    let h = new pc(u)
    ;(c = {
      next: (f) => {
        e[o] && e[o](new ep(u, h, d, f))
      },
      error: e[o + 1],
      complete: e[o + 2],
    }),
      rM(t._query)
  }
  return (function (h, f, g, I) {
    let w = new Wf(I),
      D = new jf(f, w, g)
    return (
      h.asyncQueue.enqueueAndForget(() =>
        p(this, null, function* () {
          return FR(yield MI(h), D)
        })
      ),
      () => {
        w.La(),
          h.asyncQueue.enqueueAndForget(() =>
            p(this, null, function* () {
              return LR(yield MI(h), D)
            })
          )
      }
    )
  })(eM(u), l, a, c)
}
function sM(t, e, n) {
  let r = n.docs.get(e._key),
    i = new pc(t)
  return new fc(
    t,
    i,
    e._key,
    r,
    new Kn(n.hasPendingWrites, n.fromCache),
    e.converter
  )
}
;(function (e, n = !0) {
  ;(function (i) {
    Jr = i
  })(Er),
    an(
      new tt(
        'firestore',
        (r, { instanceIdentifier: i, options: s }) => {
          let o = r.getProvider('app').getImmediate(),
            a = new Cs(
              new Ah(r.getProvider('auth-internal')),
              new Rh(r.getProvider('app-check-internal')),
              (function (u, l) {
                if (
                  !Object.prototype.hasOwnProperty.apply(u.options, [
                    'projectId',
                  ])
                )
                  throw new E(
                    y.INVALID_ARGUMENT,
                    '"projectId" not provided in firebase.initializeApp.'
                  )
                return new Ka(u.options.projectId, l)
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
    ge(oI, '4.4.3', e),
    ge(oI, '4.4.3', 'esm2017')
})()
var Ic = function () {
  return (
    (Ic =
      Object.assign ||
      function (e) {
        for (var n, r = 1, i = arguments.length; r < i; r++) {
          n = arguments[r]
          for (var s in n)
            Object.prototype.hasOwnProperty.call(n, s) && (e[s] = n[s])
        }
        return e
      }),
    Ic.apply(this, arguments)
  )
}
var cM = { includeMetadataChanges: !1 }
function Tw(t, e) {
  return (
    e === void 0 && (e = cM),
    new Q(function (n) {
      var r = mp(t, e, {
        next: n.next.bind(n),
        error: n.error.bind(n),
        complete: n.complete.bind(n),
      })
      return { unsubscribe: r }
    })
  )
}
function Dw(t, e) {
  var n
  e === void 0 && (e = {})
  var r = t.data(e)
  return !t.exists() || typeof r != 'object' || r === null || !e.idField
    ? r
    : Ic(Ic({}, r), ((n = {}), (n[e.idField] = t.id), n))
}
function Cw(t) {
  return Tw(t, { includeMetadataChanges: !0 }).pipe(
    Re(function (e) {
      return e.docs
    })
  )
}
function bw(t, e) {
  return (
    e === void 0 && (e = {}),
    Cw(t).pipe(
      Re(function (n) {
        return n.map(function (r) {
          return Dw(r, e)
        })
      })
    )
  )
}
var er = class {
    constructor(e) {
      return e
    }
  },
  Aw = 'firestore',
  gp = class {
    constructor() {
      return Pi(Aw)
    }
  }
var yp = new W('angularfire2.firestore-instances')
function uM(t, e) {
  let n = pd(Aw, t, e)
  return n && new er(n)
}
function lM(t) {
  return (e, n) => {
    let r = e.runOutsideAngular(() => t(n))
    return new er(r)
  }
}
var dM = { provide: gp, deps: [[new jt(), yp]] },
  hM = { provide: er, useFactory: uM, deps: [[new jt(), yp], Fn] },
  fM = (() => {
    class t {
      constructor() {
        ge('angularfire', Dr.full, 'fst')
      }
      static ɵfac = function (r) {
        return new (r || t)()
      }
      static ɵmod = Sn({ type: t })
      static ɵinj = An({ providers: [hM, dM] })
    }
    return t
  })()
function Sw(t, ...e) {
  return {
    ngModule: fM,
    providers: [
      {
        provide: yp,
        useFactory: lM(t),
        multi: !0,
        deps: [ee, Xt, ki, Oi, [new jt(), ca], [new jt(), Mi], ...e],
      },
    ],
  }
}
var xw = On(bw, !0)
var Nw = On(_w, !0)
var Rw = On(Iw, !0)
var Mw = {
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
var Pw = { providers: [bo(Tv(() => Dv(Mw.firebase))), bo(Sw(() => Rw()))] }
var kw = (() => {
  let e = class e {
    constructor() {
      this.firestore = ie(er)
    }
    getCertificates() {
      let r = Nw(this.firestore, 'certifications')
      return xw(r, { idField: 'id' }).pipe(
        Re((s) => ({ data: s, loaded: !0 })),
        Ys(() => Lc({ data: [], loaded: !1 }))
      )
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵprov = X({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
var Ow = (() => {
  let e = class e {}
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [['app-footer']],
      standalone: !0,
      features: [ue],
      decls: 12,
      vars: 0,
      consts: [
        [1, 'bg-dark-subtle'],
        [1, 'container', 'my-0', 'py-3', 'text-center'],
        [
          'className',
          'text-decoration-none',
          'href',
          'https://github.com/jpin730',
          'target',
          '_blank',
          'rel',
          'noreferrer noopener',
        ],
        ['className', 'mx-2'],
        [
          'className',
          'text-decoration-none',
          'href',
          'https://linkedin.com/in/jpin730',
          'target',
          '_blank',
          'rel',
          'noreferrer noopener',
        ],
        [
          'className',
          'text-decoration-none',
          'href',
          'https://jpin730.github.io',
          'target',
          '_blank',
          'rel',
          'noreferrer noopener',
        ],
      ],
      template: function (i, s) {
        i & 1 &&
          (x(0, 'footer', 0)(1, 'p', 1)(2, 'a', 2),
          ke(3, ' GitHub '),
          M(),
          x(4, 'span', 3),
          ke(5, '\xB7'),
          M(),
          x(6, 'a', 4),
          ke(7, ' LinkedIn '),
          M(),
          x(8, 'span', 3),
          ke(9, '\xB7'),
          M(),
          x(10, 'a', 5),
          ke(11, ' Portfolio '),
          M()()())
      },
      encapsulation: 2,
      changeDetection: 0,
    }))
  let t = e
  return t
})()
function pM(t, e) {
  if (t & 1) {
    let n = Xe()
    x(0, 'div', 1),
      ke(1, ' Click or tap on image to enlarge '),
      x(2, 'button', 2),
      ce('click', function () {
        Je(n)
        let i = Ie()
        return Ze((i.showAlert = !1))
      }),
      M()()
  }
}
var Fw = (() => {
  let e = class e {
    constructor() {
      this.showAlert = !0
    }
    ngOnInit() {
      setTimeout(() => {
        this.showAlert = !1
      }, 4e3)
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [['app-instructions']],
      standalone: !0,
      features: [ue],
      decls: 1,
      vars: 1,
      consts: [
        [
          'class',
          'alert alert-info alert-dismissible position-fixed bottom-0 start-50 translate-middle',
        ],
        [
          1,
          'alert',
          'alert-info',
          'alert-dismissible',
          'position-fixed',
          'bottom-0',
          'start-50',
          'translate-middle',
        ],
        ['type', 'button', 1, 'btn-close', 3, 'click'],
      ],
      template: function (i, s) {
        i & 1 && je(0, pM, 3, 0, 'div', 0), i & 2 && dt(0, s.showAlert ? 0 : -1)
      },
      encapsulation: 2,
    }))
  let t = e
  return t
})()
function mM(t, e) {
  if (t & 1) {
    let n = Xe()
    x(0, 'button', 1),
      ce('click', function () {
        let s = Je(n).$implicit,
          o = Ie()
        return Ze(o.onSelectCategory(s))
      }),
      ke(1),
      M()
  }
  if (t & 2) {
    let n = e.$implicit,
      r = Ie()
    Ey(r.selectedCategory === n ? 'btn-primary' : 'btn-outline-primary'),
      Pe(),
      xl(' ', n, ' ')
  }
}
var Lw = (() => {
  let e = class e {
    constructor() {
      ;(this.categoryChange = new qe()),
        (this.defaultCategory = 'All'),
        (this._categories = []),
        (this.selectedCategory = this.defaultCategory)
    }
    set categories(r) {
      this._categories = [this.defaultCategory, ...r]
    }
    onSelectCategory(r) {
      ;(this.selectedCategory = r), this.categoryChange.emit(r)
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [['app-category-selector']],
      inputs: { categories: 'categories' },
      outputs: { categoryChange: 'categoryChange' },
      standalone: !0,
      features: [ue],
      decls: 3,
      vars: 0,
      consts: [
        [1, 'mb-3', 'd-flex', 'flex-wrap'],
        [1, 'btn', 'btn-sm', 'me-2', 'mb-2', 3, 'click'],
        ['class', 'btn btn-sm me-2 mb-2', 3, 'class'],
      ],
      template: function (i, s) {
        i & 1 && (x(0, 'div', 0), Oo(1, mM, 2, 3, 'button', 2, Cy), M()),
          i & 2 && (Pe(), Fo(s._categories))
      },
      encapsulation: 2,
    }))
  let t = e
  return t
})()
var Vw = (() => {
  let e = class e {
    constructor() {
      this.reload = new qe()
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [['app-no-certificates']],
      outputs: { reload: 'reload' },
      standalone: !0,
      features: [ue],
      decls: 5,
      vars: 0,
      consts: [
        [1, 'container', 'text-center'],
        [1, 'text-center', 'my-4'],
        ['type', 'button', 1, 'btn', 'btn-primary', 'btn-lg', 3, 'click'],
      ],
      template: function (i, s) {
        i & 1 &&
          (x(0, 'div', 0)(1, 'h2', 1),
          ke(2, 'No certificates found'),
          M(),
          x(3, 'button', 2),
          ce('click', function () {
            return s.reload.emit()
          }),
          ke(4, ' Reload certifications '),
          M()())
      },
      encapsulation: 2,
      changeDetection: 0,
    }))
  let t = e
  return t
})()
var Uw = (() => {
  let e = class e {}
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [['app-loader']],
      standalone: !0,
      features: [ue],
      decls: 2,
      vars: 0,
      consts: [
        [1, 'progress', 'mb-4'],
        [
          1,
          'progress-bar',
          'progress-bar-striped',
          'progress-bar-animated',
          'w-100',
        ],
      ],
      template: function (i, s) {
        i & 1 && (x(0, 'div', 0), ae(1, 'div', 1), M())
      },
      encapsulation: 2,
      changeDetection: 0,
    }))
  let t = e
  return t
})()
function gM(t, e) {
  if (t & 1) {
    let n = Xe()
    x(0, 'button', 1),
      ce('click', function () {
        Je(n)
        let i = Ie()
        return Ze(i.previewClosed.emit())
      }),
      ae(1, 'img', 2)(2, 'button', 3),
      M()
  }
  if (t & 2) {
    let n = Ie()
    Pe(),
      We('alt', n.certificate.id)('title', n.certificate.id)(
        'src',
        n.certificate.image,
        No
      )
  }
}
var jw = (() => {
  let e = class e {
    constructor() {
      this.previewClosed = new qe()
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [['app-certificate-previewer']],
      inputs: { certificate: 'certificate' },
      outputs: { previewClosed: 'previewClosed' },
      standalone: !0,
      features: [ue],
      decls: 1,
      vars: 1,
      consts: [
        [
          'class',
          'd-flex vh-100 vw-100 position-fixed top-0 start-0 bg-dark bg-opacity-75 px-md-5 z-3 p-0 m-0 border-0',
        ],
        [
          1,
          'd-flex',
          'vh-100',
          'vw-100',
          'position-fixed',
          'top-0',
          'start-0',
          'bg-dark',
          'bg-opacity-75',
          'px-md-5',
          'z-3',
          'p-0',
          'm-0',
          'border-0',
          3,
          'click',
        ],
        [
          1,
          'm-auto',
          'w-100',
          'h-100',
          'object-fit-contain',
          3,
          'alt',
          'title',
          'src',
        ],
        [
          'type',
          'button',
          1,
          'btn',
          'btn-close',
          'btn-close-white',
          'position-fixed',
          'top-0',
          'end-0',
          'm-3',
        ],
      ],
      template: function (i, s) {
        i & 1 && je(0, gM, 3, 3, 'button', 0),
          i & 2 && dt(0, s.certificate ? 0 : -1)
      },
      encapsulation: 2,
      changeDetection: 0,
    }))
  let t = e
  return t
})()
var Bw = (() => {
  let e = class e {
    constructor() {
      this.certificateSelected = new qe()
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [['app-certificate-thumbnail']],
      inputs: { certificate: 'certificate' },
      outputs: { certificateSelected: 'certificateSelected' },
      standalone: !0,
      features: [ue],
      decls: 2,
      vars: 3,
      consts: [
        [
          'type',
          'button',
          1,
          'btn',
          'bg-white',
          'overflow-hidden',
          'border',
          'h-100',
          'w-100',
          'shadow-sm',
          3,
          'click',
        ],
        [
          'loading',
          'lazy',
          1,
          'object-fit-contain',
          'w-100',
          3,
          'alt',
          'title',
          'src',
        ],
      ],
      template: function (i, s) {
        i & 1 &&
          (x(0, 'button', 0),
          ce('click', function () {
            return s.certificateSelected.emit(s.certificate)
          }),
          ae(1, 'img', 1),
          M()),
          i & 2 &&
            (Pe(),
            We('alt', s.certificate.id)('title', s.certificate.id)(
              'src',
              s.certificate.image,
              No
            ))
      },
      styles: [
        '[_nghost-%COMP%]{width:100%;height:100%;display:block}img[_ngcontent-%COMP%]{min-height:300px}',
      ],
    }))
  let t = e
  return t
})()
function yM(t, e) {
  if (t & 1) {
    let n = Xe()
    x(0, 'button', 1),
      ce('click', function () {
        Je(n)
        let i = Ie()
        return Ze(i.scrollToTop())
      }),
      ae(1, 'img', 2),
      M()
  }
  t & 2 && We('@inOutAnimation', void 0)
}
var $w = (() => {
  let e = class e {
    constructor() {
      this.show$ = ti(document, 'scroll').pipe(
        Re(() => window.scrollY / window.screen.height > 0.5)
      )
    }
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [['app-to-top']],
      standalone: !0,
      features: [ue],
      decls: 2,
      vars: 3,
      consts: [
        [
          'title',
          'Go to top',
          'class',
          'btn btn-primary position-fixed bottom-0 end-0 p-3 m-3 m-lg-5 rounded',
        ],
        [
          'title',
          'Go to top',
          1,
          'btn',
          'btn-primary',
          'position-fixed',
          'bottom-0',
          'end-0',
          'p-3',
          'm-3',
          'm-lg-5',
          'rounded',
          3,
          'click',
        ],
        [
          'loading',
          'eager',
          'src',
          'assets/top-arrow.svg',
          'width',
          '24',
          'height',
          '24',
          'alt',
          'top arrow icon',
        ],
      ],
      template: function (i, s) {
        i & 1 && (je(0, yM, 2, 1, 'button', 0), Sy(1, 'async')),
          i & 2 && dt(0, xy(1, 1, s.show$) ? 0 : -1)
      },
      dependencies: [Rn, jy],
      styles: [
        'button[_ngcontent-%COMP%]{opacity:.5;transition:opacity .3s}button[_ngcontent-%COMP%]:hover{opacity:.75}',
      ],
    }))
  let t = e
  return t
})()
function vM(t, e) {
  t & 1 && (Ti(), x(0, 'svg', 9), ae(1, 'path', 10), M())
}
function _M(t, e) {
  t & 1 && (Ti(), x(0, 'svg', 4), ae(1, 'path', 11), M())
}
var IM = (t, e) => ({ 'bg-black': t, 'bg-dark': e }),
  Hw = (() => {
    let e = class e {
      constructor() {
        this.theme = 'dark'
        let r = localStorage.getItem('theme')
        if (r && (r === 'dark' || r === 'light')) {
          this.configureTheme(r)
          return
        }
        let i = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        this.configureTheme(i)
      }
      configureTheme(r) {
        ;(this.theme = r),
          document.documentElement.setAttribute('data-bs-theme', r),
          localStorage.setItem('theme', r)
      }
      toggleTheme() {
        let r = this.theme === 'dark' ? 'light' : 'dark'
        this.configureTheme(r)
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)()
    }),
      (e.ɵcmp = oe({
        type: e,
        selectors: [['app-nav']],
        standalone: !0,
        features: [ue],
        decls: 12,
        vars: 5,
        consts: [
          [1, 'navbar', 'z-1', 3, 'ngClass'],
          [1, 'container'],
          [1, 'd-flex', 'gap-3'],
          [
            'target',
            '_blank',
            'rel',
            'noreferrer',
            'href',
            'https://github.com/jpin730',
            1,
            'text-light',
          ],
          [
            'width',
            '20',
            'height',
            '20',
            'fill',
            'currentColor',
            'viewBox',
            '0 0 16 16',
          ],
          [
            'd',
            'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8',
          ],
          [
            'target',
            '_blank',
            'rel',
            'noreferrer',
            'href',
            'https://linkedin.com/in/jpin730',
            1,
            'text-light',
          ],
          [
            'd',
            'M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z',
          ],
          [1, 'btn', 'btn-transparent', 'btn-large', 'text-light', 3, 'click'],
          [
            'width',
            '20',
            'height',
            '20',
            'viewBox',
            '0 0 16 16',
            'fill',
            'currentcolor',
          ],
          [
            'd',
            'M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278',
          ],
          [
            'd',
            'M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708',
          ],
        ],
        template: function (i, s) {
          i & 1 &&
            (x(0, 'nav', 0)(1, 'div', 1)(2, 'div', 2)(3, 'a', 3),
            Ti(),
            x(4, 'svg', 4),
            ae(5, 'path', 5),
            M()(),
            Ju(),
            x(6, 'a', 6),
            Ti(),
            x(7, 'svg', 4),
            ae(8, 'path', 7),
            M()()(),
            Ju(),
            x(9, 'button', 8),
            ce('click', function () {
              return s.toggleTheme()
            }),
            je(10, vM, 2, 0, ':svg:svg', 9)(11, _M, 2, 0),
            M()()()),
            i & 2 &&
              (We(
                'ngClass',
                by(2, IM, s.theme === 'dark', s.theme === 'light')
              ),
              Pe(10),
              dt(10, s.theme === 'dark' ? 10 : 11))
        },
        dependencies: [Rn, Uy],
        encapsulation: 2,
      }))
    let t = e
    return t
  })()
var wM = (t, e) => e.id
function EM(t, e) {
  if (t & 1) {
    let n = Xe()
    x(0, 'div', 8)(1, 'app-certificate-thumbnail', 9),
      ce('certificateSelected', function (i) {
        Je(n)
        let s = Ie(3)
        return Ze((s.selectedCertificate = i))
      }),
      M()()
  }
  if (t & 2) {
    let n = Ie().$implicit
    Pe(), We('certificate', n)
  }
}
function TM(t, e) {
  if ((t & 1 && je(0, EM, 2, 1, 'div', 7), t & 2)) {
    let n = e.$implicit,
      r = Ie(2)
    dt(
      0,
      n.category.split(',').includes(r.selectedCategory) ||
        r.selectedCategory === 'All'
        ? 0
        : -1
    )
  }
}
function DM(t, e) {
  if (t & 1) {
    let n = Xe()
    ae(0, 'app-instructions'),
      x(1, 'app-category-selector', 5),
      ce('categoryChange', function (i) {
        Je(n)
        let s = Ie()
        return Ze((s.selectedCategory = i))
      }),
      M(),
      x(2, 'div', 6),
      Oo(3, TM, 1, 1, null, null, wM),
      M()
  }
  if (t & 2) {
    let n = Ie()
    Pe(), We('categories', n.categories), Pe(2), Fo(n.certificates)
  }
}
function CM(t, e) {
  if (t & 1) {
    let n = Xe()
    x(0, 'app-no-certificates', 10),
      ce('reload', function () {
        Je(n)
        let i = Ie()
        return Ze(i.ngOnInit())
      }),
      M()
  }
}
function bM(t, e) {
  t & 1 && ae(0, 'app-loader')
}
var qw = (() => {
  let e = class e {
    constructor() {
      ;(this.appService = ie(kw)),
        (this.certificates = []),
        (this.categories = []),
        (this.selectedCategory = 'All'),
        (this.loaded = !1)
    }
    ngOnInit() {
      this.appService
        .getCertificates()
        .pipe(
          Uc(1),
          Qt(({ data: r }) => {
            this.categories = [
              ...new Set(r.flatMap((i) => i.category.split(','))),
            ].sort()
          }),
          Qt(({ loaded: r }) => (this.loaded = r)),
          Qt(
            ({ data: r }) =>
              (this.certificates = r.sort((i, s) =>
                s.date.localeCompare(i.date)
              ))
          )
        )
        .subscribe()
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = oe({
      type: e,
      selectors: [['app-root']],
      standalone: !0,
      features: [ue],
      decls: 11,
      vars: 2,
      consts: [
        [1, 'd-flex', 'flex-column', 'justify-content-between', 'min-vh-100'],
        [1, 'position-sticky', 'top-0'],
        [1, 'flex-grow-1', 'container'],
        [1, 'text-center', 'my-4'],
        [3, 'certificate', 'previewClosed'],
        [3, 'categories', 'categoryChange'],
        [
          1,
          'row',
          'row-cols-1',
          'row-cols-lg-2',
          'row-cols-xl-3',
          'g-3',
          'mb-5',
        ],
        ['class', 'col'],
        [1, 'col'],
        [3, 'certificate', 'certificateSelected'],
        [3, 'reload'],
      ],
      template: function (i, s) {
        i & 1 &&
          (x(0, 'div', 0),
          ae(1, 'app-nav', 1),
          x(2, 'main', 2)(3, 'h1', 3),
          ke(4, "Jaime Pineda's Certificates"),
          M(),
          je(5, DM, 5, 1)(6, CM, 1, 0)(7, bM, 1, 0),
          M(),
          ae(8, 'app-footer'),
          M(),
          x(9, 'app-certificate-previewer', 4),
          ce('previewClosed', function () {
            return (s.selectedCertificate = void 0)
          }),
          M(),
          ae(10, 'app-to-top')),
          i & 2 &&
            (Pe(5),
            dt(
              5,
              s.loaded && s.certificates.length !== 0
                ? 5
                : s.loaded && s.certificates.length === 0
                  ? 6
                  : 7
            ),
            Pe(4),
            We('certificate', s.selectedCertificate))
      },
      dependencies: [Rn, Ow, Fw, Lw, Vw, Uw, Bw, jw, $w, Hw],
      encapsulation: 2,
    }))
  let t = e
  return t
})()
Yy(qw, Pw).catch((t) => console.error(t))
