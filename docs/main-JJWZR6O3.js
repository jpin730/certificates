var zI = Object.defineProperty,
  GI = Object.defineProperties
var WI = Object.getOwnPropertyDescriptors
var Wf = Object.getOwnPropertySymbols
var KI = Object.prototype.hasOwnProperty,
  QI = Object.prototype.propertyIsEnumerable
var Kf = (t, e, n) =>
    e in t
      ? zI(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (t[e] = n),
  Ye = (t, e) => {
    for (var n in (e ||= {})) KI.call(e, n) && Kf(t, n, e[n])
    if (Wf) for (var n of Wf(e)) QI.call(e, n) && Kf(t, n, e[n])
    return t
  },
  yt = (t, e) => GI(t, WI(e))
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
var Qf = null
var ec = 1,
  Yf = Symbol('SIGNAL')
function oe(t) {
  let e = Qf
  return (Qf = t), e
}
var Jf = {
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
function YI(t) {
  if (!(rc(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === ec)) {
    if (!t.producerMustRecompute(t) && !tc(t)) {
      ;(t.dirty = !1), (t.lastCleanEpoch = ec)
      return
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = ec)
  }
}
function Zf(t) {
  return t && (t.nextProducerIndex = 0), oe(t)
}
function Xf(t, e) {
  if (
    (oe(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (rc(t))
      for (let n = t.nextProducerIndex; n < t.producerNode.length; n++)
        nc(t.producerNode[n], t.producerIndexOfThis[n])
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop()
  }
}
function tc(t) {
  ps(t)
  for (let e = 0; e < t.producerNode.length; e++) {
    let n = t.producerNode[e],
      r = t.producerLastReadVersion[e]
    if (r !== n.version || (YI(n), r !== n.version)) return !0
  }
  return !1
}
function ep(t) {
  if ((ps(t), rc(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      nc(t.producerNode[e], t.producerIndexOfThis[e])
  ;(t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0)
}
function nc(t, e) {
  if ((JI(t), ps(t), t.liveConsumerNode.length === 1))
    for (let r = 0; r < t.producerNode.length; r++)
      nc(t.producerNode[r], t.producerIndexOfThis[r])
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
    ps(i), (i.producerIndexOfThis[r] = e)
  }
}
function rc(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0
}
function ps(t) {
  ;(t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= [])
}
function JI(t) {
  ;(t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= [])
}
function ZI() {
  throw new Error()
}
var XI = ZI
function tp(t) {
  XI = t
}
function ge(t) {
  return typeof t == 'function'
}
function gs(t) {
  let n = t((r) => {
    Error.call(r), (r.stack = new Error().stack)
  })
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  )
}
var ms = gs(
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
function Zt(t, e) {
  if (t) {
    let n = t.indexOf(e)
    0 <= n && t.splice(n, 1)
  }
}
var me = class t {
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
      if (ge(r))
        try {
          r()
        } catch (s) {
          e = s instanceof ms ? s.errors : [s]
        }
      let { _finalizers: i } = this
      if (i) {
        this._finalizers = null
        for (let s of i)
          try {
            np(s)
          } catch (o) {
            ;(e = e ?? []),
              o instanceof ms ? (e = [...e, ...o.errors]) : e.push(o)
          }
      }
      if (e) throw new ms(e)
    }
  }
  add(e) {
    var n
    if (e && e !== this)
      if (this.closed) np(e)
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
    n === e ? (this._parentage = null) : Array.isArray(n) && Zt(n, e)
  }
  remove(e) {
    let { _finalizers: n } = this
    n && Zt(n, e), e instanceof t && e._removeParent(this)
  }
}
me.EMPTY = (() => {
  let t = new me()
  return (t.closed = !0), t
})()
var ic = me.EMPTY
function ys(t) {
  return (
    t instanceof me ||
    (t && 'closed' in t && ge(t.remove) && ge(t.add) && ge(t.unsubscribe))
  )
}
function np(t) {
  ge(t) ? t() : t.unsubscribe()
}
var Ue = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
}
var jn = {
  setTimeout(t, e, ...n) {
    let { delegate: r } = jn
    return r?.setTimeout ? r.setTimeout(t, e, ...n) : setTimeout(t, e, ...n)
  },
  clearTimeout(t) {
    let { delegate: e } = jn
    return (e?.clearTimeout || clearTimeout)(t)
  },
  delegate: void 0,
}
function rp(t) {
  jn.setTimeout(() => {
    let { onUnhandledError: e } = Ue
    if (e) e(t)
    else throw t
  })
}
function sc() {}
var ip = oc('C', void 0, void 0)
function sp(t) {
  return oc('E', void 0, t)
}
function op(t) {
  return oc('N', t, void 0)
}
function oc(t, e, n) {
  return { kind: t, value: e, error: n }
}
var Xt = null
function Bn(t) {
  if (Ue.useDeprecatedSynchronousErrorHandling) {
    let e = !Xt
    if ((e && (Xt = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: n, error: r } = Xt
      if (((Xt = null), n)) throw r
    }
  } else t()
}
function ap(t) {
  Ue.useDeprecatedSynchronousErrorHandling &&
    Xt &&
    ((Xt.errorThrown = !0), (Xt.error = t))
}
var en = class extends me {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), ys(e) && e.add(this))
          : (this.destination = nE)
    }
    static create(e, n, r) {
      return new $n(e, n, r)
    }
    next(e) {
      this.isStopped ? cc(op(e), this) : this._next(e)
    }
    error(e) {
      this.isStopped ? cc(sp(e), this) : ((this.isStopped = !0), this._error(e))
    }
    complete() {
      this.isStopped ? cc(ip, this) : ((this.isStopped = !0), this._complete())
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
function ac(t, e) {
  return eE.call(t, e)
}
var uc = class {
    constructor(e) {
      this.partialObserver = e
    }
    next(e) {
      let { partialObserver: n } = this
      if (n.next)
        try {
          n.next(e)
        } catch (r) {
          vs(r)
        }
    }
    error(e) {
      let { partialObserver: n } = this
      if (n.error)
        try {
          n.error(e)
        } catch (r) {
          vs(r)
        }
      else vs(e)
    }
    complete() {
      let { partialObserver: e } = this
      if (e.complete)
        try {
          e.complete()
        } catch (n) {
          vs(n)
        }
    }
  },
  $n = class extends en {
    constructor(e, n, r) {
      super()
      let i
      if (ge(e) || !e)
        i = { next: e ?? void 0, error: n ?? void 0, complete: r ?? void 0 }
      else {
        let s
        this && Ue.useDeprecatedNextContext
          ? ((s = Object.create(e)),
            (s.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && ac(e.next, s),
              error: e.error && ac(e.error, s),
              complete: e.complete && ac(e.complete, s),
            }))
          : (i = e)
      }
      this.destination = new uc(i)
    }
  }
function vs(t) {
  Ue.useDeprecatedSynchronousErrorHandling ? ap(t) : rp(t)
}
function tE(t) {
  throw t
}
function cc(t, e) {
  let { onStoppedNotification: n } = Ue
  n && jn.setTimeout(() => n(t, e))
}
var nE = { closed: !0, next: sc, error: tE, complete: sc }
var cp = (typeof Symbol == 'function' && Symbol.observable) || '@@observable'
function _s(t) {
  return t
}
function up(t) {
  return t.length === 0
    ? _s
    : t.length === 1
      ? t[0]
      : function (n) {
          return t.reduce((r, i) => i(r), n)
        }
}
var je = (() => {
  class t {
    constructor(n) {
      n && (this._subscribe = n)
    }
    lift(n) {
      let r = new t()
      return (r.source = this), (r.operator = n), r
    }
    subscribe(n, r, i) {
      let s = iE(n) ? n : new $n(n, r, i)
      return (
        Bn(() => {
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
        (r = lp(r)),
        new r((i, s) => {
          let o = new $n({
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
    [cp]() {
      return this
    }
    pipe(...n) {
      return up(n)(this)
    }
    toPromise(n) {
      return (
        (n = lp(n)),
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
function lp(t) {
  var e
  return (e = t ?? Ue.Promise) !== null && e !== void 0 ? e : Promise
}
function rE(t) {
  return t && ge(t.next) && ge(t.error) && ge(t.complete)
}
function iE(t) {
  return (t && t instanceof en) || (rE(t) && ys(t))
}
function sE(t) {
  return ge(t?.lift)
}
function Je(t) {
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
function xt(t, e, n, r, i) {
  return new lc(t, e, n, r, i)
}
var lc = class extends en {
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
var dp = gs(
  (t) =>
    function () {
      t(this),
        (this.name = 'ObjectUnsubscribedError'),
        (this.message = 'object unsubscribed')
    }
)
var Hn = (() => {
    class t extends je {
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
        let r = new Is(this, this)
        return (r.operator = n), r
      }
      _throwIfClosed() {
        if (this.closed) throw new dp()
      }
      next(n) {
        Bn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers))
            for (let r of this.currentObservers) r.next(n)
          }
        })
      }
      error(n) {
        Bn(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ;(this.hasError = this.isStopped = !0), (this.thrownError = n)
            let { observers: r } = this
            for (; r.length; ) r.shift().error(n)
          }
        })
      }
      complete() {
        Bn(() => {
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
          ? ic
          : ((this.currentObservers = null),
            s.push(n),
            new me(() => {
              ;(this.currentObservers = null), Zt(s, n)
            }))
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: s } = this
        r ? n.error(i) : s && n.complete()
      }
      asObservable() {
        let n = new je()
        return (n.source = this), n
      }
    }
    return (t.create = (e, n) => new Is(e, n)), t
  })(),
  Is = class extends Hn {
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
        : ic
    }
  }
var Vr = class extends Hn {
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
var dc = {
  now() {
    return (dc.delegate || Date).now()
  },
  delegate: void 0,
}
var Es = class extends me {
  constructor(e, n) {
    super()
  }
  schedule(e, n = 0) {
    return this
  }
}
var Ur = {
  setInterval(t, e, ...n) {
    let { delegate: r } = Ur
    return r?.setInterval ? r.setInterval(t, e, ...n) : setInterval(t, e, ...n)
  },
  clearInterval(t) {
    let { delegate: e } = Ur
    return (e?.clearInterval || clearInterval)(t)
  },
  delegate: void 0,
}
var qn = class extends Es {
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
    return Ur.setInterval(e.flush.bind(e, this), r)
  }
  recycleAsyncId(e, n, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return n
    n != null && Ur.clearInterval(n)
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
        Zt(r, this),
        e != null && (this.id = this.recycleAsyncId(n, e, null)),
        (this.delay = null),
        super.unsubscribe()
    }
  }
}
var zn = class t {
  constructor(e, n = t.now) {
    ;(this.schedulerActionCtor = e), (this.now = n)
  }
  schedule(e, n = 0, r) {
    return new this.schedulerActionCtor(this, e).schedule(r, n)
  }
}
zn.now = dc.now
var Gn = class extends zn {
  constructor(e, n = zn.now) {
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
var hc = new Gn(qn)
var ws = class extends qn {
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
var Ds = class extends Gn {}
var fc = new Ds(ws)
var hp = new je((t) => t.complete())
function pc(t, e) {
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
function Ts(t, e, n, r = 0, i = !1) {
  let s = e.schedule(function () {
    n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe()
  }, r)
  if ((t.add(s), !i)) return s
}
function Cs(t, e = 0) {
  return Je((n, r) => {
    n.subscribe(
      xt(
        r,
        (i) => Ts(r, t, () => r.next(i), e),
        () => Ts(r, t, () => r.complete(), e),
        (i) => Ts(r, t, () => r.error(i), e)
      )
    )
  })
}
function bs(t, e = 0) {
  return Je((n, r) => {
    r.add(t.schedule(() => n.subscribe(r), e))
  })
}
function Wn(t, e) {
  return Je((n, r) => {
    let i = 0
    n.subscribe(
      xt(r, (s) => {
        r.next(t.call(e, s, i++))
      })
    )
  })
}
function gc(t) {
  return t <= 0
    ? () => hp
    : Je((e, n) => {
        let r = 0
        e.subscribe(
          xt(n, (i) => {
            ++r <= t && (n.next(i), t <= r && n.complete())
          })
        )
      })
}
function Kn(t, e, n) {
  let r = ge(t) || e || n ? { next: t, error: e, complete: n } : t
  return r
    ? Je((i, s) => {
        var o
        ;(o = r.subscribe) === null || o === void 0 || o.call(r)
        let a = !0
        i.subscribe(
          xt(
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
    : _s
}
var oE = 'https://g.co/ng/security#xss',
  U = class extends Error {
    constructor(e, n) {
      super(yu(e, n)), (this.code = e)
    }
  }
function yu(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ': ' + e : ''}`
}
function G(t) {
  for (let e in t) if (t[e] === G) return e
  throw Error('Could not find renamed property on target object.')
}
function Oe(t) {
  if (typeof t == 'string') return t
  if (Array.isArray(t)) return '[' + t.map(Oe).join(', ') + ']'
  if (t == null) return '' + t
  if (t.overriddenName) return `${t.overriddenName}`
  if (t.name) return `${t.name}`
  let e = t.toString()
  if (e == null) return '' + e
  let n = e.indexOf(`
`)
  return n === -1 ? e : e.substring(0, n)
}
function Nc(t, e) {
  return t == null || t === ''
    ? e === null
      ? ''
      : e
    : e == null || e === ''
      ? t
      : t + ' ' + e
}
var aE = G({ __forward_ref__: G })
function zp(t) {
  return (
    (t.__forward_ref__ = zp),
    (t.toString = function () {
      return Oe(this())
    }),
    t
  )
}
function He(t) {
  return cE(t) ? t() : t
}
function cE(t) {
  return (
    typeof t == 'function' && t.hasOwnProperty(aE) && t.__forward_ref__ === zp
  )
}
function Gp(t) {
  return t && !!t.ɵproviders
}
var uE = G({ ɵcmp: G }),
  lE = G({ ɵdir: G }),
  dE = G({ ɵpipe: G })
var fp = G({ ɵfac: G }),
  jr = G({ __NG_ELEMENT_ID__: G }),
  pp = G({ __NG_ENV_ID__: G })
function Wp(t) {
  return typeof t == 'string' ? t : t == null ? '' : String(t)
}
function hE(t) {
  return typeof t == 'function'
    ? t.name || t.toString()
    : typeof t == 'object' && t != null && typeof t.type == 'function'
      ? t.type.name || t.type.toString()
      : Wp(t)
}
function fE(t, e) {
  let n = e ? `. Dependency path: ${e.join(' > ')} > ${t}` : ''
  throw new U(-200, `Circular dependency in DI detected for ${t}${n}`)
}
function vu(t, e) {
  throw new U(-201, !1)
}
function pE(t, e) {
  t == null && gE(e, t, null, '!=')
}
function gE(t, e, n, r) {
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
function dn(t) {
  return { providers: t.providers || [], imports: t.imports || [] }
}
function _u(t) {
  return gp(t, Kp) || gp(t, Qp)
}
function gp(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null
}
function mE(t) {
  let e = t && (t[Kp] || t[Qp])
  return e || null
}
function mp(t) {
  return t && (t.hasOwnProperty(yp) || t.hasOwnProperty(yE)) ? t[yp] : null
}
var Kp = G({ ɵprov: G }),
  yp = G({ ɵinj: G }),
  Qp = G({ ngInjectableDef: G }),
  yE = G({ ngInjectorDef: G }),
  M = (function (t) {
    return (
      (t[(t.Default = 0)] = 'Default'),
      (t[(t.Host = 1)] = 'Host'),
      (t[(t.Self = 2)] = 'Self'),
      (t[(t.SkipSelf = 4)] = 'SkipSelf'),
      (t[(t.Optional = 8)] = 'Optional'),
      t
    )
  })(M || {}),
  Rc
function vE() {
  return Rc
}
function Pe(t) {
  let e = Rc
  return (Rc = t), e
}
function Yp(t, e, n) {
  let r = _u(t)
  if (r && r.providedIn == 'root')
    return r.value === void 0 ? (r.value = r.factory()) : r.value
  if (n & M.Optional) return null
  if (e !== void 0) return e
  vu(t, 'Injector')
}
var Br = globalThis
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
var _E = {},
  qr = _E,
  xc = '__NG_DI_FLAG__',
  Os = 'ngTempTokenPath',
  IE = 'ngTokenPath',
  EE = /\n/gm,
  wE = '\u0275',
  vp = '__source',
  $r
function Qn(t) {
  let e = $r
  return ($r = t), e
}
function DE(t, e = M.Default) {
  if ($r === void 0) throw new U(-203, !1)
  return $r === null
    ? Yp(t, void 0, e)
    : $r.get(t, e & M.Optional ? null : void 0, e)
}
function k(t, e = M.Default) {
  return (vE() || DE)(He(t), e)
}
function ee(t, e = M.Default) {
  return k(t, Ws(e))
}
function Ws(t) {
  return typeof t > 'u' || typeof t == 'number'
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4)
}
function Mc(t) {
  let e = []
  for (let n = 0; n < t.length; n++) {
    let r = He(t[n])
    if (Array.isArray(r)) {
      if (r.length === 0) throw new U(900, !1)
      let i,
        s = M.Default
      for (let o = 0; o < r.length; o++) {
        let a = r[o],
          c = CE(a)
        typeof c == 'number' ? (c === -1 ? (i = a.token) : (s |= c)) : (i = a)
      }
      e.push(k(i, s))
    } else e.push(k(r))
  }
  return e
}
function TE(t, e) {
  return (t[xc] = e), (t.prototype[xc] = e), t
}
function CE(t) {
  return t[xc]
}
function bE(t, e, n, r) {
  let i = t[Os]
  throw (
    (e[vp] && i.unshift(e[vp]),
    (t.message = AE(
      `
` + t.message,
      i,
      n,
      r
    )),
    (t[IE] = i),
    (t[Os] = null),
    t)
  )
}
function AE(t, e, n, r = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == wE
      ? t.slice(2)
      : t
  let i = Oe(e)
  if (Array.isArray(e)) i = e.map(Oe).join(' -> ')
  else if (typeof e == 'object') {
    let s = []
    for (let o in e)
      if (e.hasOwnProperty(o)) {
        let a = e[o]
        s.push(o + ':' + (typeof a == 'string' ? JSON.stringify(a) : Oe(a)))
      }
    i = `{${s.join(', ')}}`
  }
  return `${n}${r ? '(' + r + ')' : ''}[${i}]: ${t.replace(
    EE,
    `
  `
  )}`
}
function Iu(t) {
  return { toString: t }.toString()
}
var Jp = (function (t) {
    return (t[(t.OnPush = 0)] = 'OnPush'), (t[(t.Default = 1)] = 'Default'), t
  })(Jp || {}),
  et = (function (t) {
    return (
      (t[(t.Emulated = 0)] = 'Emulated'),
      (t[(t.None = 2)] = 'None'),
      (t[(t.ShadowDom = 3)] = 'ShadowDom'),
      t
    )
  })(et || {}),
  zr = {},
  Ne = [],
  nn = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.SignalBased = 1)] = 'SignalBased'),
      (t[(t.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      t
    )
  })(nn || {})
function Zp(t, e, n) {
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
function Pc(t, e, n) {
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
      NE(s) ? t.setProperty(e, s, o) : t.setAttribute(e, s, o), r++
    }
  }
  return r
}
function SE(t) {
  return t === 3 || t === 4 || t === 6
}
function NE(t) {
  return t.charCodeAt(0) === 64
}
function Eu(t, e) {
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
              ? _p(t, n, i, null, e[++r])
              : _p(t, n, i, null, null))
      }
    }
  return t
}
function _p(t, e, n, r, i) {
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
var Xp = 'ng-template'
function RE(t, e, n) {
  let r = 0,
    i = !0
  for (; r < t.length; ) {
    let s = t[r++]
    if (typeof s == 'string' && i) {
      let o = t[r++]
      if (n && s === 'class' && Zp(o.toLowerCase(), e, 0) !== -1) return !0
    } else if (s === 1) {
      for (; r < t.length && typeof (s = t[r++]) == 'string'; )
        if (s.toLowerCase() === e) return !0
      return !1
    } else typeof s == 'number' && (i = !1)
  }
  return !1
}
function eg(t) {
  return t.type === 4 && t.value !== Xp
}
function xE(t, e, n) {
  let r = t.type === 4 && !n ? Xp : t.value
  return e === r
}
function ME(t, e, n) {
  let r = 4,
    i = t.attrs || [],
    s = kE(i),
    o = !1
  for (let a = 0; a < e.length; a++) {
    let c = e[a]
    if (typeof c == 'number') {
      if (!o && !Be(r) && !Be(c)) return !1
      if (o && Be(c)) continue
      ;(o = !1), (r = c | (r & 1))
      continue
    }
    if (!o)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (c !== '' && !xE(t, c, n)) || (c === '' && e.length === 1))
        ) {
          if (Be(r)) return !1
          o = !0
        }
      } else {
        let u = r & 8 ? c : e[++a]
        if (r & 8 && t.attrs !== null) {
          if (!RE(t.attrs, u, n)) {
            if (Be(r)) return !1
            o = !0
          }
          continue
        }
        let l = r & 8 ? 'class' : c,
          d = PE(l, i, eg(t), n)
        if (d === -1) {
          if (Be(r)) return !1
          o = !0
          continue
        }
        if (u !== '') {
          let h
          d > s ? (h = '') : (h = i[d + 1].toLowerCase())
          let f = r & 8 ? h : null
          if ((f && Zp(f, u, 0) !== -1) || (r & 2 && u !== h)) {
            if (Be(r)) return !1
            o = !0
          }
        }
      }
  }
  return Be(r) || o
}
function Be(t) {
  return (t & 1) === 0
}
function PE(t, e, n, r) {
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
  } else return FE(e, t)
}
function OE(t, e, n = !1) {
  for (let r = 0; r < e.length; r++) if (ME(t, e[r], n)) return !0
  return !1
}
function kE(t) {
  for (let e = 0; e < t.length; e++) {
    let n = t[e]
    if (SE(n)) return e
  }
  return t.length
}
function FE(t, e) {
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
function Ip(t, e) {
  return t ? ':not(' + e.trim() + ')' : e
}
function LE(t) {
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
      i !== '' && !Be(o) && ((e += Ip(s, i)), (i = '')),
        (r = o),
        (s = s || !Be(r))
    n++
  }
  return i !== '' && (e += Ip(s, i)), e
}
function VE(t) {
  return t.map(LE).join(',')
}
function UE(t) {
  let e = [],
    n = [],
    r = 1,
    i = 2
  for (; r < t.length; ) {
    let s = t[r]
    if (typeof s == 'string')
      i === 2 ? s !== '' && e.push(s, t[++r]) : i === 8 && n.push(s)
    else {
      if (!Be(i)) break
      i = s
    }
    r++
  }
  return { attrs: e, classes: n }
}
function Mt(t) {
  return Iu(() => {
    let e = HE(t),
      n = yt(Ye({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === Jp.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || et.Emulated,
        styles: t.styles || Ne,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: '',
      })
    qE(n)
    let r = t.dependencies
    return (
      (n.directiveDefs = wp(r, !1)), (n.pipeDefs = wp(r, !0)), (n.id = zE(n)), n
    )
  })
}
function jE(t) {
  return Ks(t) || ng(t)
}
function BE(t) {
  return t !== null
}
function hn(t) {
  return Iu(() => ({
    type: t.type,
    bootstrap: t.bootstrap || Ne,
    declarations: t.declarations || Ne,
    imports: t.imports || Ne,
    exports: t.exports || Ne,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }))
}
function Ep(t, e) {
  if (t == null) return zr
  let n = {}
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let i = t[r],
        s,
        o,
        a = nn.None
      Array.isArray(i)
        ? ((a = i[0]), (s = i[1]), (o = i[2] ?? s))
        : ((s = i), (o = i)),
        e ? ((n[s] = a !== nn.None ? [r, a] : r), (e[s] = o)) : (n[s] = r)
    }
  return n
}
function tg(t) {
  return {
    type: t.type,
    name: t.name,
    factory: null,
    pure: t.pure !== !1,
    standalone: t.standalone === !0,
    onDestroy: t.type.prototype.ngOnDestroy || null,
  }
}
function Ks(t) {
  return t[uE] || null
}
function ng(t) {
  return t[lE] || null
}
function rg(t) {
  return t[dE] || null
}
function $E(t) {
  let e = Ks(t) || ng(t) || rg(t)
  return e !== null ? e.standalone : !1
}
function HE(t) {
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
    inputConfig: t.inputs || zr,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || Ne,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Ep(t.inputs, e),
    outputs: Ep(t.outputs),
    debugInfo: null,
  }
}
function qE(t) {
  t.features?.forEach((e) => e(t))
}
function wp(t, e) {
  if (!t) return null
  let n = e ? rg : jE
  return () => (typeof t == 'function' ? t() : t).map((r) => n(r)).filter(BE)
}
function zE(t) {
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
var wt = 0,
  N = 1,
  C = 2,
  Re = 3,
  qe = 4,
  tt = 5,
  Gr = 6,
  Wr = 7,
  ye = 8,
  tr = 9,
  vt = 10,
  Te = 11,
  Kr = 12,
  Dp = 13,
  sr = 14,
  ze = 15,
  Qs = 16,
  Yn = 17,
  Qr = 18,
  Ys = 19,
  ig = 20,
  Hr = 21,
  mc = 22,
  rn = 23,
  xe = 25,
  sg = 1
var Yr = 7,
  GE = 8,
  ks = 9,
  Ae = 10,
  wu = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      t
    )
  })(wu || {})
function Xn(t) {
  return Array.isArray(t) && typeof t[sg] == 'object'
}
function fn(t) {
  return Array.isArray(t) && t[sg] === !0
}
function og(t) {
  return (t.flags & 4) !== 0
}
function Js(t) {
  return t.componentOffset > -1
}
function Du(t) {
  return (t.flags & 1) === 1
}
function si(t) {
  return !!t.template
}
function WE(t) {
  return (t[C] & 512) !== 0
}
function nr(t, e) {
  let n = t.hasOwnProperty(fp)
  return n ? t[fp] : null
}
var Oc = class {
  constructor(e, n, r) {
    ;(this.previousValue = e), (this.currentValue = n), (this.firstChange = r)
  }
  isFirstChange() {
    return this.firstChange
  }
}
function ag(t, e, n, r) {
  e !== null ? e.applyValueToInputSignal(e, r) : (t[n] = r)
}
function cg() {
  return ug
}
function ug(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = QE), KE
}
cg.ngInherit = !0
function KE() {
  let t = dg(this),
    e = t?.current
  if (e) {
    let n = t.previous
    if (n === zr) t.previous = e
    else for (let r in e) n[r] = e[r]
    ;(t.current = null), this.ngOnChanges(e)
  }
}
function QE(t, e, n, r, i) {
  let s = this.declaredInputs[r],
    o = dg(t) || YE(t, { previous: zr, current: null }),
    a = o.current || (o.current = {}),
    c = o.previous,
    u = c[s]
  ;(a[s] = new Oc(u && u.currentValue, n, c === zr)), ag(t, e, i, n)
}
var lg = '__ngSimpleChanges__'
function dg(t) {
  return t[lg] || null
}
function YE(t, e) {
  return (t[lg] = e)
}
var Tp = null
var Ze = function (t, e, n) {
    Tp?.(t, e, n)
  },
  JE = 'svg',
  ZE = 'math',
  XE = !1
function ew() {
  return XE
}
function _t(t) {
  for (; Array.isArray(t); ) t = t[wt]
  return t
}
function hg(t, e) {
  return _t(e[t])
}
function nt(t, e) {
  return _t(e[t.index])
}
function Tu(t, e) {
  return t.data[e]
}
function tw(t, e) {
  return t[e]
}
function pn(t, e) {
  let n = e[t]
  return Xn(n) ? n : n[wt]
}
function Cu(t) {
  return (t[C] & 128) === 128
}
function Fs(t, e) {
  return e == null ? null : t[e]
}
function fg(t) {
  t[Yn] = 0
}
function nw(t) {
  t[C] & 1024 || ((t[C] |= 1024), Cu(t) && Jr(t))
}
function rw(t, e) {
  for (; t > 0; ) (e = e[sr]), t--
  return e
}
function pg(t) {
  return t[C] & 9216 || t[rn]?.dirty
}
function kc(t) {
  pg(t)
    ? Jr(t)
    : t[C] & 64 &&
      (ew()
        ? ((t[C] |= 1024), Jr(t))
        : t[vt].changeDetectionScheduler?.notify())
}
function Jr(t) {
  t[vt].changeDetectionScheduler?.notify()
  let e = Zr(t)
  for (; e !== null && !(e[C] & 8192 || ((e[C] |= 8192), !Cu(e))); ) e = Zr(e)
}
function iw(t, e) {
  if ((t[C] & 256) === 256) throw new U(911, !1)
  t[Hr] === null && (t[Hr] = []), t[Hr].push(e)
}
function Zr(t) {
  let e = t[Re]
  return fn(e) ? e[Re] : e
}
var R = { lFrame: wg(null), bindingsEnabled: !0, skipHydrationRootTNode: null }
function sw() {
  return R.lFrame.elementDepthCount
}
function ow() {
  R.lFrame.elementDepthCount++
}
function aw() {
  R.lFrame.elementDepthCount--
}
function gg() {
  return R.bindingsEnabled
}
function cw() {
  return R.skipHydrationRootTNode !== null
}
function uw(t) {
  return R.skipHydrationRootTNode === t
}
function lw() {
  R.skipHydrationRootTNode = null
}
function Y() {
  return R.lFrame.lView
}
function rt() {
  return R.lFrame.tView
}
function Zs(t) {
  return (R.lFrame.contextLView = t), t[ye]
}
function Xs(t) {
  return (R.lFrame.contextLView = null), t
}
function Pt() {
  let t = mg()
  for (; t !== null && t.type === 64; ) t = t.parent
  return t
}
function mg() {
  return R.lFrame.currentTNode
}
function dw() {
  let t = R.lFrame,
    e = t.currentTNode
  return t.isParent ? e : e.parent
}
function oi(t, e) {
  let n = R.lFrame
  ;(n.currentTNode = t), (n.isParent = e)
}
function yg() {
  return R.lFrame.isParent
}
function hw() {
  R.lFrame.isParent = !1
}
function fw() {
  let t = R.lFrame,
    e = t.bindingRootIndex
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e
}
function pw(t) {
  return (R.lFrame.bindingIndex = t)
}
function eo() {
  return R.lFrame.bindingIndex++
}
function vg(t) {
  let e = R.lFrame,
    n = e.bindingIndex
  return (e.bindingIndex = e.bindingIndex + t), n
}
function gw() {
  return R.lFrame.inI18n
}
function mw(t, e) {
  let n = R.lFrame
  ;(n.bindingIndex = n.bindingRootIndex = t), Fc(e)
}
function yw() {
  return R.lFrame.currentDirectiveIndex
}
function Fc(t) {
  R.lFrame.currentDirectiveIndex = t
}
function vw(t) {
  let e = R.lFrame.currentDirectiveIndex
  return e === -1 ? null : t[e]
}
function _g(t) {
  R.lFrame.currentQueryIndex = t
}
function _w(t) {
  let e = t[N]
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[tt] : null
}
function Ig(t, e, n) {
  if (n & M.SkipSelf) {
    let i = e,
      s = t
    for (; (i = i.parent), i === null && !(n & M.Host); )
      if (((i = _w(s)), i === null || ((s = s[sr]), i.type & 10))) break
    if (i === null) return !1
    ;(e = i), (t = s)
  }
  let r = (R.lFrame = Eg())
  return (r.currentTNode = e), (r.lView = t), !0
}
function bu(t) {
  let e = Eg(),
    n = t[N]
  ;(R.lFrame = e),
    (e.currentTNode = n.firstChild),
    (e.lView = t),
    (e.tView = n),
    (e.contextLView = t),
    (e.bindingIndex = n.bindingStartIndex),
    (e.inI18n = !1)
}
function Eg() {
  let t = R.lFrame,
    e = t === null ? null : t.child
  return e === null ? wg(t) : e
}
function wg(t) {
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
function Dg() {
  let t = R.lFrame
  return (R.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t
}
var Tg = Dg
function Au() {
  let t = Dg()
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
function Iw(t) {
  return (R.lFrame.contextLView = rw(t, R.lFrame.contextLView))[ye]
}
function Ot() {
  return R.lFrame.selectedIndex
}
function sn(t) {
  R.lFrame.selectedIndex = t
}
function Ew() {
  let t = R.lFrame
  return Tu(t.tView, t.selectedIndex)
}
function ww() {
  return R.lFrame.currentNamespace
}
var Cg = !0
function Su() {
  return Cg
}
function Nu(t) {
  Cg = t
}
function Dw(t, e, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: s } = e.type.prototype
  if (r) {
    let o = ug(e)
    ;(n.preOrderHooks ??= []).push(t, o),
      (n.preOrderCheckHooks ??= []).push(t, o)
  }
  i && (n.preOrderHooks ??= []).push(0 - t, i),
    s &&
      ((n.preOrderHooks ??= []).push(t, s),
      (n.preOrderCheckHooks ??= []).push(t, s))
}
function Ru(t, e) {
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
function Ns(t, e, n) {
  bg(t, e, 3, n)
}
function Rs(t, e, n, r) {
  ;(t[C] & 3) === n && bg(t, e, n, r)
}
function yc(t, e) {
  let n = t[C]
  ;(n & 3) === e && ((n &= 16383), (n += 1), (t[C] = n))
}
function bg(t, e, n, r) {
  let i = r !== void 0 ? t[Yn] & 65535 : 0,
    s = r ?? -1,
    o = e.length - 1,
    a = 0
  for (let c = i; c < o; c++)
    if (typeof e[c + 1] == 'number') {
      if (((a = e[c]), r != null && a >= r)) break
    } else
      e[c] < 0 && (t[Yn] += 65536),
        (a < s || s == -1) &&
          (Tw(t, n, e, c), (t[Yn] = (t[Yn] & 4294901760) + c + 2)),
        c++
}
function Cp(t, e) {
  Ze(4, t, e)
  let n = oe(null)
  try {
    e.call(t)
  } finally {
    oe(n), Ze(5, t, e)
  }
}
function Tw(t, e, n, r) {
  let i = n[r] < 0,
    s = n[r + 1],
    o = i ? -n[r] : n[r],
    a = t[o]
  i
    ? t[C] >> 14 < t[Yn] >> 16 &&
      (t[C] & 3) === e &&
      ((t[C] += 16384), Cp(a, s))
    : Cp(a, s)
}
var er = -1,
  Xr = class {
    constructor(e, n, r) {
      ;(this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r)
    }
  }
function Cw(t) {
  return t instanceof Xr
}
function bw(t) {
  return (t.flags & 8) !== 0
}
function Aw(t) {
  return (t.flags & 16) !== 0
}
function Sw(t) {
  return t !== er
}
function Lc(t) {
  return t & 32767
}
function Nw(t) {
  return t >> 16
}
function Vc(t, e) {
  let n = Nw(t),
    r = e
  for (; n > 0; ) (r = r[sr]), n--
  return r
}
var Uc = !0
function Ls(t) {
  let e = Uc
  return (Uc = t), e
}
var Rw = 256,
  Ag = Rw - 1,
  Sg = 5,
  xw = 0,
  Xe = {}
function Mw(t, e, n) {
  let r
  typeof n == 'string'
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(jr) && (r = n[jr]),
    r == null && (r = n[jr] = xw++)
  let i = r & Ag,
    s = 1 << i
  e.data[t + (i >> Sg)] |= s
}
function Ng(t, e) {
  let n = Rg(t, e)
  if (n !== -1) return n
  let r = e[N]
  r.firstCreatePass &&
    ((t.injectorIndex = e.length),
    vc(r.data, t),
    vc(e, null),
    vc(r.blueprint, null))
  let i = xg(t, e),
    s = t.injectorIndex
  if (Sw(i)) {
    let o = Lc(i),
      a = Vc(i, e),
      c = a[N].data
    for (let u = 0; u < 8; u++) e[s + u] = a[o + u] | c[o + u]
  }
  return (e[s + 8] = i), s
}
function vc(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e)
}
function Rg(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex
}
function xg(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex
  let n = 0,
    r = null,
    i = e
  for (; i !== null; ) {
    if (((r = Fg(i)), r === null)) return er
    if ((n++, (i = i[sr]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16)
  }
  return er
}
function Pw(t, e, n) {
  Mw(t, e, n)
}
function Mg(t, e, n) {
  if (n & M.Optional || t !== void 0) return t
  vu(e, 'NodeInjector')
}
function Pg(t, e, n, r) {
  if (
    (n & M.Optional && r === void 0 && (r = null), !(n & (M.Self | M.Host)))
  ) {
    let i = t[tr],
      s = Pe(void 0)
    try {
      return i ? i.get(e, r, n & M.Optional) : Yp(e, r, n & M.Optional)
    } finally {
      Pe(s)
    }
  }
  return Mg(r, e, n)
}
function Og(t, e, n, r = M.Default, i) {
  if (t !== null) {
    if (e[C] & 2048 && !(r & M.Self)) {
      let o = Vw(t, e, n, r, Xe)
      if (o !== Xe) return o
    }
    let s = kg(t, e, n, r, Xe)
    if (s !== Xe) return s
  }
  return Pg(e, n, r, i)
}
function kg(t, e, n, r, i) {
  let s = Fw(n)
  if (typeof s == 'function') {
    if (!Ig(e, t, r)) return r & M.Host ? Mg(i, n, r) : Pg(e, n, r, i)
    try {
      let o
      if (((o = s(r)), o == null && !(r & M.Optional))) vu(n)
      else return o
    } finally {
      Tg()
    }
  } else if (typeof s == 'number') {
    let o = null,
      a = Rg(t, e),
      c = er,
      u = r & M.Host ? e[ze][tt] : null
    for (
      (a === -1 || r & M.SkipSelf) &&
      ((c = a === -1 ? xg(t, e) : e[a + 8]),
      c === er || !Ap(r, !1)
        ? (a = -1)
        : ((o = e[N]), (a = Lc(c)), (e = Vc(c, e))));
      a !== -1;

    ) {
      let l = e[N]
      if (bp(s, a, l.data)) {
        let d = Ow(a, e, n, o, r, u)
        if (d !== Xe) return d
      }
      ;(c = e[a + 8]),
        c !== er && Ap(r, e[N].data[a + 8] === u) && bp(s, a, e)
          ? ((o = l), (a = Lc(c)), (e = Vc(c, e)))
          : (a = -1)
    }
  }
  return i
}
function Ow(t, e, n, r, i, s) {
  let o = e[N],
    a = o.data[t + 8],
    c = r == null ? Js(a) && Uc : r != o && (a.type & 3) !== 0,
    u = i & M.Host && s === a,
    l = kw(a, o, n, c, u)
  return l !== null ? ei(e, o, l, a) : Xe
}
function kw(t, e, n, r, i) {
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
    if (f && si(f) && f.type === n) return c
  }
  return null
}
function ei(t, e, n, r) {
  let i = t[n],
    s = e.data
  if (Cw(i)) {
    let o = i
    o.resolving && fE(hE(s[n]))
    let a = Ls(o.canSeeViewProviders)
    o.resolving = !0
    let c,
      u = o.injectImpl ? Pe(o.injectImpl) : null,
      l = Ig(t, r, M.Default)
    try {
      ;(i = t[n] = o.factory(void 0, s, t, r)),
        e.firstCreatePass && n >= r.directiveStart && Dw(n, s[n], e)
    } finally {
      u !== null && Pe(u), Ls(a), (o.resolving = !1), Tg()
    }
  }
  return i
}
function Fw(t) {
  if (typeof t == 'string') return t.charCodeAt(0) || 0
  let e = t.hasOwnProperty(jr) ? t[jr] : void 0
  return typeof e == 'number' ? (e >= 0 ? e & Ag : Lw) : e
}
function bp(t, e, n) {
  let r = 1 << t
  return !!(n[e + (t >> Sg)] & r)
}
function Ap(t, e) {
  return !(t & M.Self) && !(t & M.Host && e)
}
var Vs = class {
  constructor(e, n) {
    ;(this._tNode = e), (this._lView = n)
  }
  get(e, n, r) {
    return Og(this._tNode, this._lView, e, Ws(r), n)
  }
}
function Lw() {
  return new Vs(Pt(), Y())
}
function Vw(t, e, n, r, i) {
  let s = t,
    o = e
  for (; s !== null && o !== null && o[C] & 2048 && !(o[C] & 512); ) {
    let a = kg(s, o, n, r | M.Self, Xe)
    if (a !== Xe) return a
    let c = s.parent
    if (!c) {
      let u = o[ig]
      if (u) {
        let l = u.get(n, Xe, r)
        if (l !== Xe) return l
      }
      ;(c = Fg(o)), (o = o[sr])
    }
    s = c
  }
  return i
}
function Fg(t) {
  let e = t[N],
    n = e.type
  return n === 2 ? e.declTNode : n === 1 ? t[tt] : null
}
var As = '__parameters__'
function Uw(t) {
  return function (...n) {
    if (t) {
      let r = t(...n)
      for (let i in r) this[i] = r[i]
    }
  }
}
function jw(t, e, n) {
  return Iu(() => {
    let r = Uw(e)
    function i(...s) {
      if (this instanceof i) return r.apply(this, s), this
      let o = new i(...s)
      return (a.annotation = o), a
      function a(c, u, l) {
        let d = c.hasOwnProperty(As)
          ? c[As]
          : Object.defineProperty(c, As, { value: [] })[As]
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
function xu(t, e) {
  t.forEach((n) => (Array.isArray(n) ? xu(n, e) : e(n)))
}
function Bw(t, e, n) {
  e >= t.length ? t.push(n) : t.splice(e, 0, n)
}
function Lg(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0]
}
function $w(t, e, n, r) {
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
function Mu(t, e, n) {
  let r = ai(t, e)
  return r >= 0 ? (t[r | 1] = n) : ((r = ~r), $w(t, r, e, n)), r
}
function _c(t, e) {
  let n = ai(t, e)
  if (n >= 0) return t[n | 1]
}
function ai(t, e) {
  return Hw(t, e, 1)
}
function Hw(t, e, n) {
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
var Dt = TE(jw('Optional'), 8)
var ti = new q('ENVIRONMENT_INITIALIZER'),
  Vg = new q('INJECTOR', -1),
  Ug = new q('INJECTOR_DEF_TYPES'),
  Us = class {
    get(e, n = qr) {
      if (n === qr) {
        let r = new Error(`NullInjectorError: No provider for ${Oe(e)}!`)
        throw ((r.name = 'NullInjectorError'), r)
      }
      return n
    }
  }
function jg(t) {
  return { ɵproviders: t }
}
function to(...t) {
  return { ɵproviders: Bg(!0, t), ɵfromNgModule: !0 }
}
function Bg(t, ...e) {
  let n = [],
    r = new Set(),
    i,
    s = (o) => {
      n.push(o)
    }
  return (
    xu(e, (o) => {
      let a = o
      jc(a, s, [], r) && ((i ||= []), i.push(a))
    }),
    i !== void 0 && $g(i, s),
    n
  )
}
function $g(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { ngModule: r, providers: i } = t[n]
    Pu(i, (s) => {
      e(s, r)
    })
  }
}
function jc(t, e, n, r) {
  if (((t = He(t)), !t)) return !1
  let i = null,
    s = mp(t),
    o = !s && Ks(t)
  if (!s && !o) {
    let c = t.ngModule
    if (((s = mp(c)), s)) i = c
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
      for (let u of c) jc(u, e, n, r)
    }
  } else if (s) {
    if (s.imports != null && !a) {
      r.add(i)
      let u
      try {
        xu(s.imports, (l) => {
          jc(l, e, n, r) && ((u ||= []), u.push(l))
        })
      } finally {
      }
      u !== void 0 && $g(u, e)
    }
    if (!a) {
      let u = nr(i) || (() => new i())
      e({ provide: i, useFactory: u, deps: Ne }, i),
        e({ provide: Ug, useValue: i, multi: !0 }, i),
        e({ provide: ti, useValue: () => k(i), multi: !0 }, i)
    }
    let c = s.providers
    if (c != null && !a) {
      let u = t
      Pu(c, (l) => {
        e(l, u)
      })
    }
  } else return !1
  return i !== t && t.providers !== void 0
}
function Pu(t, e) {
  for (let n of t)
    Gp(n) && (n = n.ɵproviders), Array.isArray(n) ? Pu(n, e) : e(n)
}
var qw = G({ provide: String, useValue: G })
function Hg(t) {
  return t !== null && typeof t == 'object' && qw in t
}
function zw(t) {
  return !!(t && t.useExisting)
}
function Gw(t) {
  return !!(t && t.useFactory)
}
function Bc(t) {
  return typeof t == 'function'
}
var no = new q('Set Injector scope.'),
  xs = {},
  Ww = {},
  Ic
function Ou() {
  return Ic === void 0 && (Ic = new Us()), Ic
}
var on = class {},
  js = class extends on {
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
        Hc(e, (o) => this.processProvider(o)),
        this.records.set(Vg, Jn(void 0, this)),
        i.has('environment') && this.records.set(on, Jn(void 0, this))
      let s = this.records.get(no)
      s != null && typeof s.value == 'string' && this.scopes.add(s.value),
        (this.injectorDefTypes = new Set(this.get(Ug, Ne, M.Self)))
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
      let n = Qn(this),
        r = Pe(void 0),
        i
      try {
        return e()
      } finally {
        Qn(n), Pe(r)
      }
    }
    get(e, n = qr, r = M.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(pp))) return e[pp](this)
      r = Ws(r)
      let i,
        s = Qn(this),
        o = Pe(void 0)
      try {
        if (!(r & M.SkipSelf)) {
          let c = this.records.get(e)
          if (c === void 0) {
            let u = Xw(e) && _u(e)
            u && this.injectableDefInScope(u)
              ? (c = Jn($c(e), xs))
              : (c = null),
              this.records.set(e, c)
          }
          if (c != null) return this.hydrate(e, c)
        }
        let a = r & M.Self ? Ou() : this.parent
        return (n = r & M.Optional && n === qr ? null : n), a.get(e, n)
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[Os] = a[Os] || []).unshift(Oe(e)), s)) throw a
          return bE(a, e, 'R3InjectorError', this.source)
        } else throw a
      } finally {
        Pe(o), Qn(s)
      }
    }
    resolveInjectorInitializers() {
      let e = Qn(this),
        n = Pe(void 0),
        r
      try {
        let i = this.get(ti, Ne, M.Self)
        for (let s of i) s()
      } finally {
        Qn(e), Pe(n)
      }
    }
    toString() {
      let e = [],
        n = this.records
      for (let r of n.keys()) e.push(Oe(r))
      return `R3Injector[${e.join(', ')}]`
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new U(205, !1)
    }
    processProvider(e) {
      e = He(e)
      let n = Bc(e) ? e : He(e && e.provide),
        r = Qw(e)
      if (!Bc(e) && e.multi === !0) {
        let i = this.records.get(n)
        i ||
          ((i = Jn(void 0, xs, !0)),
          (i.factory = () => Mc(i.multi)),
          this.records.set(n, i)),
          (n = e),
          i.multi.push(e)
      }
      this.records.set(n, r)
    }
    hydrate(e, n) {
      return (
        n.value === xs && ((n.value = Ww), (n.value = n.factory())),
        typeof n.value == 'object' &&
          n.value &&
          Zw(n.value) &&
          this._ngOnDestroyHooks.add(n.value),
        n.value
      )
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1
      let n = He(e.providedIn)
      return typeof n == 'string'
        ? n === 'any' || this.scopes.has(n)
        : this.injectorDefTypes.has(n)
    }
    removeOnDestroy(e) {
      let n = this._onDestroyHooks.indexOf(e)
      n !== -1 && this._onDestroyHooks.splice(n, 1)
    }
  }
function $c(t) {
  let e = _u(t),
    n = e !== null ? e.factory : nr(t)
  if (n !== null) return n
  if (t instanceof q) throw new U(204, !1)
  if (t instanceof Function) return Kw(t)
  throw new U(204, !1)
}
function Kw(t) {
  if (t.length > 0) throw new U(204, !1)
  let n = mE(t)
  return n !== null ? () => n.factory(t) : () => new t()
}
function Qw(t) {
  if (Hg(t)) return Jn(void 0, t.useValue)
  {
    let e = Yw(t)
    return Jn(e, xs)
  }
}
function Yw(t, e, n) {
  let r
  if (Bc(t)) {
    let i = He(t)
    return nr(i) || $c(i)
  } else if (Hg(t)) r = () => He(t.useValue)
  else if (Gw(t)) r = () => t.useFactory(...Mc(t.deps || []))
  else if (zw(t)) r = () => k(He(t.useExisting))
  else {
    let i = He(t && (t.useClass || t.provide))
    if (Jw(t)) r = () => new i(...Mc(t.deps))
    else return nr(i) || $c(i)
  }
  return r
}
function Jn(t, e, n = !1) {
  return { factory: t, value: e, multi: n ? [] : void 0 }
}
function Jw(t) {
  return !!t.deps
}
function Zw(t) {
  return (
    t !== null && typeof t == 'object' && typeof t.ngOnDestroy == 'function'
  )
}
function Xw(t) {
  return typeof t == 'function' || (typeof t == 'object' && t instanceof q)
}
function Hc(t, e) {
  for (let n of t)
    Array.isArray(n) ? Hc(n, e) : n && Gp(n) ? Hc(n.ɵproviders, e) : e(n)
}
function Sp(t, e = null, n = null, r) {
  let i = eD(t, e, n, r)
  return i.resolveInjectorInitializers(), i
}
function eD(t, e = null, n = null, r, i = new Set()) {
  let s = [n || Ne, to(t)]
  return (
    (r = r || (typeof t == 'object' ? void 0 : Oe(t))),
    new js(s, e || Ou(), r || null, i)
  )
}
var kt = (() => {
  let e = class e {
    static create(r, i) {
      if (Array.isArray(r)) return Sp({ name: '' }, i, r, '')
      {
        let s = r.name ?? ''
        return Sp({ name: s }, r.parent, r.providers, s)
      }
    }
  }
  ;(e.THROW_IF_NOT_FOUND = qr),
    (e.NULL = new Us()),
    (e.ɵprov = K({ token: e, providedIn: 'any', factory: () => k(Vg) })),
    (e.__NG_ELEMENT_ID__ = -1)
  let t = e
  return t
})()
var qc
function qg(t) {
  qc = t
}
function tD() {
  if (qc !== void 0) return qc
  if (typeof document < 'u') return document
  throw new U(210, !1)
}
var ku = new q('AppId', { providedIn: 'root', factory: () => nD }),
  nD = 'ng',
  Fu = new q('Platform Initializer'),
  Ft = new q('Platform ID', {
    providedIn: 'platform',
    factory: () => 'unknown',
  })
var Lu = new q('CSP nonce', {
  providedIn: 'root',
  factory: () =>
    tD().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
    null,
})
function zg(t) {
  return (t.flags & 128) === 128
}
var It = (function (t) {
  return (
    (t[(t.Important = 1)] = 'Important'), (t[(t.DashCase = 2)] = 'DashCase'), t
  )
})(It || {})
var Gg = new Map(),
  rD = 0
function iD() {
  return rD++
}
function sD(t) {
  Gg.set(t[Ys], t)
}
function oD(t) {
  Gg.delete(t[Ys])
}
var Np = '__ngContext__'
function an(t, e) {
  Xn(e) ? ((t[Np] = e[Ys]), sD(e)) : (t[Np] = e)
}
var aD
function Vu(t, e) {
  return aD(t, e)
}
function Zn(t, e, n, r, i) {
  if (r != null) {
    let s,
      o = !1
    fn(r) ? (s = r) : Xn(r) && ((o = !0), (r = r[wt]))
    let a = _t(r)
    t === 0 && n !== null
      ? i == null
        ? Yg(e, n, a)
        : zc(e, n, a, i || null, !0)
      : t === 1 && n !== null
        ? zc(e, n, a, i || null, !0)
        : t === 2
          ? DD(e, a, o)
          : t === 3 && e.destroyNode(a),
      s != null && CD(e, t, s, n, i)
  }
}
function cD(t, e) {
  return t.createText(e)
}
function uD(t, e, n) {
  t.setValue(e, n)
}
function Wg(t, e, n) {
  return t.createElement(e, n)
}
function lD(t, e) {
  Kg(t, e), (e[wt] = null), (e[tt] = null)
}
function dD(t, e, n, r, i, s) {
  ;(r[wt] = i), (r[tt] = e), ro(t, r, n, 1, i, s)
}
function Kg(t, e) {
  e[vt].changeDetectionScheduler?.notify(), ro(t, e, e[Te], 2, null, null)
}
function hD(t) {
  let e = t[Kr]
  if (!e) return Ec(t[N], t)
  for (; e; ) {
    let n = null
    if (Xn(e)) n = e[Kr]
    else {
      let r = e[Ae]
      r && (n = r)
    }
    if (!n) {
      for (; e && !e[qe] && e !== t; ) Xn(e) && Ec(e[N], e), (e = e[Re])
      e === null && (e = t), Xn(e) && Ec(e[N], e), (n = e && e[qe])
    }
    e = n
  }
}
function fD(t, e, n, r) {
  let i = Ae + r,
    s = n.length
  r > 0 && (n[i - 1][qe] = e),
    r < s - Ae
      ? ((e[qe] = n[i]), Bw(n, Ae + r, e))
      : (n.push(e), (e[qe] = null)),
    (e[Re] = n)
  let o = e[Qs]
  o !== null && n !== o && pD(o, e)
  let a = e[Qr]
  a !== null && a.insertView(t), kc(e), (e[C] |= 128)
}
function pD(t, e) {
  let n = t[ks],
    i = e[Re][Re][ze]
  e[ze] !== i && (t[C] |= wu.HasTransplantedViews),
    n === null ? (t[ks] = [e]) : n.push(e)
}
function Qg(t, e) {
  let n = t[ks],
    r = n.indexOf(e)
  n.splice(r, 1)
}
function Uu(t, e) {
  if (t.length <= Ae) return
  let n = Ae + e,
    r = t[n]
  if (r) {
    let i = r[Qs]
    i !== null && i !== t && Qg(i, r), e > 0 && (t[n - 1][qe] = r[qe])
    let s = Lg(t, Ae + e)
    lD(r[N], r)
    let o = s[Qr]
    o !== null && o.detachView(s[N]),
      (r[Re] = null),
      (r[qe] = null),
      (r[C] &= -129)
  }
  return r
}
function ju(t, e) {
  if (!(e[C] & 256)) {
    let n = e[Te]
    n.destroyNode && ro(t, e, n, 3, null, null), hD(e)
  }
}
function Ec(t, e) {
  if (!(e[C] & 256)) {
    ;(e[C] &= -129),
      (e[C] |= 256),
      e[rn] && ep(e[rn]),
      mD(t, e),
      gD(t, e),
      e[N].type === 1 && e[Te].destroy()
    let n = e[Qs]
    if (n !== null && fn(e[Re])) {
      n !== e[Re] && Qg(n, e)
      let r = e[Qr]
      r !== null && r.detachView(t)
    }
    oD(e)
  }
}
function gD(t, e) {
  let n = t.cleanup,
    r = e[Wr]
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == 'string') {
        let o = n[s + 3]
        o >= 0 ? r[o]() : r[-o].unsubscribe(), (s += 2)
      } else {
        let o = r[n[s + 1]]
        n[s].call(o)
      }
  r !== null && (e[Wr] = null)
  let i = e[Hr]
  if (i !== null) {
    e[Hr] = null
    for (let s = 0; s < i.length; s++) {
      let o = i[s]
      o()
    }
  }
}
function mD(t, e) {
  let n
  if (t != null && (n = t.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = e[n[r]]
      if (!(i instanceof Xr)) {
        let s = n[r + 1]
        if (Array.isArray(s))
          for (let o = 0; o < s.length; o += 2) {
            let a = i[s[o]],
              c = s[o + 1]
            Ze(4, a, c)
            try {
              c.call(a)
            } finally {
              Ze(5, a, c)
            }
          }
        else {
          Ze(4, i, s)
          try {
            s.call(i)
          } finally {
            Ze(5, i, s)
          }
        }
      }
    }
}
function yD(t, e, n) {
  return vD(t, e.parent, n)
}
function vD(t, e, n) {
  let r = e
  for (; r !== null && r.type & 40; ) (e = r), (r = e.parent)
  if (r === null) return n[wt]
  {
    let { componentOffset: i } = r
    if (i > -1) {
      let { encapsulation: s } = t.data[r.directiveStart + i]
      if (s === et.None || s === et.Emulated) return null
    }
    return nt(r, n)
  }
}
function zc(t, e, n, r, i) {
  t.insertBefore(e, n, r, i)
}
function Yg(t, e, n) {
  t.appendChild(e, n)
}
function Rp(t, e, n, r, i) {
  r !== null ? zc(t, e, n, r, i) : Yg(t, e, n)
}
function _D(t, e, n, r) {
  t.removeChild(e, n, r)
}
function Jg(t, e) {
  return t.parentNode(e)
}
function ID(t, e, n) {
  return wD(t, e, n)
}
function ED(t, e, n) {
  return t.type & 40 ? nt(t, n) : null
}
var wD = ED,
  xp
function Bu(t, e, n, r) {
  let i = yD(t, r, e),
    s = e[Te],
    o = r.parent || e[tt],
    a = ID(o, r, e)
  if (i != null)
    if (Array.isArray(n))
      for (let c = 0; c < n.length; c++) Rp(s, i, n[c], a, !1)
    else Rp(s, i, n, a, !1)
  xp !== void 0 && xp(s, r, e, n, i)
}
function Ms(t, e) {
  if (e !== null) {
    let n = e.type
    if (n & 3) return nt(e, t)
    if (n & 4) return Gc(-1, t[e.index])
    if (n & 8) {
      let r = e.child
      if (r !== null) return Ms(t, r)
      {
        let i = t[e.index]
        return fn(i) ? Gc(-1, i) : _t(i)
      }
    } else {
      if (n & 32) return Vu(e, t)() || _t(t[e.index])
      {
        let r = Zg(t, e)
        if (r !== null) {
          if (Array.isArray(r)) return r[0]
          let i = Zr(t[ze])
          return Ms(i, r)
        } else return Ms(t, e.next)
      }
    }
  }
  return null
}
function Zg(t, e) {
  if (e !== null) {
    let r = t[ze][tt],
      i = e.projection
    return r.projection[i]
  }
  return null
}
function Gc(t, e) {
  let n = Ae + t + 1
  if (n < e.length) {
    let r = e[n],
      i = r[N].firstChild
    if (i !== null) return Ms(r, i)
  }
  return e[Yr]
}
function DD(t, e, n) {
  let r = Jg(t, e)
  r && _D(t, r, e, n)
}
function $u(t, e, n, r, i, s, o) {
  for (; n != null; ) {
    let a = r[n.index],
      c = n.type
    if (
      (o && e === 0 && (a && an(_t(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (c & 8) $u(t, e, n.child, r, i, s, !1), Zn(e, t, i, a, s)
      else if (c & 32) {
        let u = Vu(n, r),
          l
        for (; (l = u()); ) Zn(e, t, i, l, s)
        Zn(e, t, i, a, s)
      } else c & 16 ? TD(t, e, r, n, i, s) : Zn(e, t, i, a, s)
    n = o ? n.projectionNext : n.next
  }
}
function ro(t, e, n, r, i, s) {
  $u(n, r, t.firstChild, e, i, s, !1)
}
function TD(t, e, n, r, i, s) {
  let o = n[ze],
    c = o[tt].projection[r.projection]
  if (Array.isArray(c))
    for (let u = 0; u < c.length; u++) {
      let l = c[u]
      Zn(e, t, i, l, s)
    }
  else {
    let u = c,
      l = o[Re]
    zg(r) && (u.flags |= 128), $u(t, e, u, l, i, s, !0)
  }
}
function CD(t, e, n, r, i) {
  let s = n[Yr],
    o = _t(n)
  s !== o && Zn(e, t, r, s, i)
  for (let a = Ae; a < n.length; a++) {
    let c = n[a]
    ro(c[N], c, t, e, r, s)
  }
}
function bD(t, e, n, r, i) {
  if (e) i ? t.addClass(n, r) : t.removeClass(n, r)
  else {
    let s = r.indexOf('-') === -1 ? void 0 : It.DashCase
    i == null
      ? t.removeStyle(n, r, s)
      : (typeof i == 'string' &&
          i.endsWith('!important') &&
          ((i = i.slice(0, -10)), (s |= It.Important)),
        t.setStyle(n, r, i, s))
  }
}
function AD(t, e, n) {
  t.setAttribute(e, 'style', n)
}
function Xg(t, e, n) {
  n === '' ? t.removeAttribute(e, 'class') : t.setAttribute(e, 'class', n)
}
function em(t, e, n) {
  let { mergedAttrs: r, classes: i, styles: s } = n
  r !== null && Pc(t, e, r),
    i !== null && Xg(t, e, i),
    s !== null && AD(t, e, s)
}
var Wc = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${oE})`
  }
}
function io(t) {
  return t instanceof Wc ? t.changingThisBreaksApplicationSecurity : t
}
var Kc = class {}
var SD = 'h',
  ND = 'b'
var RD = () => null
function Hu(t, e, n = !1) {
  return RD(t, e, n)
}
var Qc = class {},
  Bs = class {}
function xD(t) {
  let e = Error(`No component factory found for ${Oe(t)}.`)
  return (e[MD] = t), e
}
var MD = 'ngComponent'
var Yc = class {
    resolveComponentFactory(e) {
      throw xD(e)
    }
  },
  qu = (() => {
    let e = class e {}
    e.NULL = new Yc()
    let t = e
    return t
  })()
function PD() {
  return tm(Pt(), Y())
}
function tm(t, e) {
  return new zu(nt(t, e))
}
var zu = (() => {
  let e = class e {
    constructor(r) {
      this.nativeElement = r
    }
  }
  e.__NG_ELEMENT_ID__ = PD
  let t = e
  return t
})()
var ni = class {}
var OD = (() => {
    let e = class e {}
    e.ɵprov = K({ token: e, providedIn: 'root', factory: () => null })
    let t = e
    return t
  })(),
  wc = {}
function Gu(t) {
  let e = oe(null)
  try {
    return t()
  } finally {
    oe(e)
  }
}
function $s(t, e, n, r, i = !1) {
  for (; n !== null; ) {
    let s = e[n.index]
    s !== null && r.push(_t(s)), fn(s) && kD(s, r)
    let o = n.type
    if (o & 8) $s(t, e, n.child, r)
    else if (o & 32) {
      let a = Vu(n, e),
        c
      for (; (c = a()); ) r.push(c)
    } else if (o & 16) {
      let a = Zg(e, n)
      if (Array.isArray(a)) r.push(...a)
      else {
        let c = Zr(e[ze])
        $s(c[N], c, a, r, !0)
      }
    }
    n = i ? n.projectionNext : n.next
  }
  return r
}
function kD(t, e) {
  for (let n = Ae; n < t.length; n++) {
    let r = t[n],
      i = r[N].firstChild
    i !== null && $s(r[N], r, i, e)
  }
  t[Yr] !== t[wt] && e.push(t[Yr])
}
var nm = []
function FD(t) {
  return t[rn] ?? LD(t)
}
function LD(t) {
  let e = nm.pop() ?? Object.create(UD)
  return (e.lView = t), e
}
function VD(t) {
  t.lView[rn] !== t && ((t.lView = null), nm.push(t))
}
var UD = yt(Ye({}, Jf), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    Jr(t.lView)
  },
  consumerOnSignalRead() {
    this.lView[rn] = this
  },
})
function rm(t) {
  return sm(t[Kr])
}
function im(t) {
  return sm(t[qe])
}
function sm(t) {
  for (; t !== null && !fn(t); ) t = t[qe]
  return t
}
var jD = 'ngOriginalError'
function Dc(t) {
  return t[jD]
}
var Et = class {
    constructor() {
      this._console = console
    }
    handleError(e) {
      let n = this._findOriginalError(e)
      this._console.error('ERROR', e),
        n && this._console.error('ORIGINAL ERROR', n)
    }
    _findOriginalError(e) {
      let n = e && Dc(e)
      for (; n && Dc(n); ) n = Dc(n)
      return n || null
    }
  },
  om = new q('', {
    providedIn: 'root',
    factory: () => ee(Et).handleError.bind(void 0),
  })
var am = !1,
  BD = new q('', { providedIn: 'root', factory: () => am })
var Tt = {}
function it(t = 1) {
  cm(rt(), Y(), Ot() + t, !1)
}
function cm(t, e, n, r) {
  if (!r)
    if ((e[C] & 3) === 3) {
      let s = t.preOrderCheckHooks
      s !== null && Ns(e, s, n)
    } else {
      let s = t.preOrderHooks
      s !== null && Rs(e, s, 0, n)
    }
  sn(n)
}
function so(t, e = M.Default) {
  let n = Y()
  if (n === null) return k(t, e)
  let r = Pt()
  return Og(r, n, He(t), e)
}
function um(t, e, n, r, i, s) {
  let o = oe(null)
  try {
    let a = null
    i & nn.SignalBased && (a = e[r][Yf]),
      a !== null && a.transformFn !== void 0 && (s = a.transformFn(s)),
      i & nn.HasDecoratorInputTransform &&
        (s = t.inputTransforms[r].call(e, s)),
      t.setInput !== null ? t.setInput(e, a, s, n, r) : ag(e, a, r, s)
  } finally {
    oe(o)
  }
}
function $D(t, e) {
  let n = t.hostBindingOpCodes
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r]
        if (i < 0) sn(~i)
        else {
          let s = i,
            o = n[++r],
            a = n[++r]
          mw(o, s)
          let c = e[s]
          a(2, c)
        }
      }
    } finally {
      sn(-1)
    }
}
function oo(t, e, n, r, i, s, o, a, c, u, l) {
  let d = e.blueprint.slice()
  return (
    (d[wt] = i),
    (d[C] = r | 4 | 128 | 8 | 64),
    (u !== null || (t && t[C] & 2048)) && (d[C] |= 2048),
    fg(d),
    (d[Re] = d[sr] = t),
    (d[ye] = n),
    (d[vt] = o || (t && t[vt])),
    (d[Te] = a || (t && t[Te])),
    (d[tr] = c || (t && t[tr]) || null),
    (d[tt] = s),
    (d[Ys] = iD()),
    (d[Gr] = l),
    (d[ig] = u),
    (d[ze] = e.type == 2 ? t[ze] : d),
    d
  )
}
function ao(t, e, n, r, i) {
  let s = t.data[e]
  if (s === null) (s = HD(t, e, n, r, i)), gw() && (s.flags |= 32)
  else if (s.type & 64) {
    ;(s.type = n), (s.value = r), (s.attrs = i)
    let o = dw()
    s.injectorIndex = o === null ? -1 : o.injectorIndex
  }
  return oi(s, !0), s
}
function HD(t, e, n, r, i) {
  let s = mg(),
    o = yg(),
    a = o ? s : s && s.parent,
    c = (t.data[e] = KD(t, a, n, e, r, i))
  return (
    t.firstChild === null && (t.firstChild = c),
    s !== null &&
      (o
        ? s.child == null && c.parent !== null && (s.child = c)
        : s.next === null && ((s.next = c), (c.prev = s))),
    c
  )
}
function lm(t, e, n, r) {
  if (n === 0) return -1
  let i = e.length
  for (let s = 0; s < n; s++) e.push(r), t.blueprint.push(r), t.data.push(null)
  return i
}
function dm(t, e, n, r, i) {
  let s = Ot(),
    o = r & 2
  try {
    sn(-1), o && e.length > xe && cm(t, e, xe, !1), Ze(o ? 2 : 0, i), n(r, i)
  } finally {
    sn(s), Ze(o ? 3 : 1, i)
  }
}
function hm(t, e, n) {
  if (og(e)) {
    let r = oe(null)
    try {
      let i = e.directiveStart,
        s = e.directiveEnd
      for (let o = i; o < s; o++) {
        let a = t.data[o]
        a.contentQueries && a.contentQueries(1, n[o], o)
      }
    } finally {
      oe(r)
    }
  }
}
function fm(t, e, n) {
  gg() && (tT(t, e, n, nt(n, e)), (n.flags & 64) === 64 && vm(t, e, n))
}
function pm(t, e, n = nt) {
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
function gm(t) {
  let e = t.tView
  return e === null || e.incompleteFirstPass
    ? (t.tView = Wu(
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
function Wu(t, e, n, r, i, s, o, a, c, u, l) {
  let d = xe + r,
    h = d + i,
    f = qD(d, h),
    _ = typeof u == 'function' ? u() : u
  return (f[N] = {
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
function qD(t, e) {
  let n = []
  for (let r = 0; r < e; r++) n.push(r < t ? null : Tt)
  return n
}
function zD(t, e, n, r) {
  let s = r.get(BD, am) || n === et.ShadowDom,
    o = t.selectRootElement(e, s)
  return GD(o), o
}
function GD(t) {
  WD(t)
}
var WD = () => null
function KD(t, e, n, r, i, s) {
  let o = e ? e.injectorIndex : -1,
    a = 0
  return (
    cw() && (a |= 128),
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
function Mp(t, e, n, r, i) {
  for (let s in e) {
    if (!e.hasOwnProperty(s)) continue
    let o = e[s]
    if (o === void 0) continue
    r ??= {}
    let a,
      c = nn.None
    Array.isArray(o) ? ((a = o[0]), (c = o[1])) : (a = o)
    let u = s
    if (i !== null) {
      if (!i.hasOwnProperty(s)) continue
      u = i[s]
    }
    t === 0 ? Pp(r, n, u, a, c) : Pp(r, n, u, a)
  }
  return r
}
function Pp(t, e, n, r, i) {
  let s
  t.hasOwnProperty(n) ? (s = t[n]).push(e, r) : (s = t[n] = [e, r]),
    i !== void 0 && s.push(i)
}
function QD(t, e, n) {
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
    ;(c = Mp(0, d.inputs, l, c, f)), (u = Mp(1, d.outputs, l, u, _))
    let E = c !== null && o !== null && !eg(e) ? lT(c, l, o) : null
    a.push(E)
  }
  c !== null &&
    (c.hasOwnProperty('class') && (e.flags |= 8),
    c.hasOwnProperty('style') && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = u)
}
function YD(t) {
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
function JD(t, e, n, r, i, s, o, a) {
  let c = nt(e, n),
    u = e.inputs,
    l
  !a && u != null && (l = u[r])
    ? (Qu(t, n, l, r, i), Js(e) && ZD(n, e.index))
    : e.type & 3
      ? ((r = YD(r)),
        (i = o != null ? o(i, e.value || '', r) : i),
        s.setProperty(c, r, i))
      : e.type & 12
}
function ZD(t, e) {
  let n = pn(e, t)
  n[C] & 16 || (n[C] |= 64)
}
function mm(t, e, n, r) {
  if (gg()) {
    let i = r === null ? null : { '': -1 },
      s = rT(t, n),
      o,
      a
    s === null ? (o = a = null) : ([o, a] = s),
      o !== null && ym(t, e, n, o, i, a),
      i && iT(n, r, i)
  }
  n.mergedAttrs = Eu(n.mergedAttrs, n.attrs)
}
function ym(t, e, n, r, i, s) {
  for (let u = 0; u < r.length; u++) Pw(Ng(n, e), t, r[u].type)
  oT(n, t.data.length, r.length)
  for (let u = 0; u < r.length; u++) {
    let l = r[u]
    l.providersResolver && l.providersResolver(l)
  }
  let o = !1,
    a = !1,
    c = lm(t, e, r.length, null)
  for (let u = 0; u < r.length; u++) {
    let l = r[u]
    ;(n.mergedAttrs = Eu(n.mergedAttrs, l.hostAttrs)),
      aT(t, n, e, c, l),
      sT(c, l, i),
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
  QD(t, n, s)
}
function XD(t, e, n, r, i) {
  let s = i.hostBindings
  if (s) {
    let o = t.hostBindingOpCodes
    o === null && (o = t.hostBindingOpCodes = [])
    let a = ~e.index
    eT(o) != a && o.push(a), o.push(n, r, s)
  }
}
function eT(t) {
  let e = t.length
  for (; e > 0; ) {
    let n = t[--e]
    if (typeof n == 'number' && n < 0) return n
  }
  return 0
}
function tT(t, e, n, r) {
  let i = n.directiveStart,
    s = n.directiveEnd
  Js(n) && cT(e, n, t.data[i + n.componentOffset]),
    t.firstCreatePass || Ng(n, e),
    an(r, e)
  let o = n.initialInputs
  for (let a = i; a < s; a++) {
    let c = t.data[a],
      u = ei(e, t, a, n)
    if ((an(u, e), o !== null && uT(e, a - i, u, c, n, o), si(c))) {
      let l = pn(n.index, e)
      l[ye] = ei(e, t, a, n)
    }
  }
}
function vm(t, e, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    s = n.index,
    o = yw()
  try {
    sn(s)
    for (let a = r; a < i; a++) {
      let c = t.data[a],
        u = e[a]
      Fc(a),
        (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) &&
          nT(c, u)
    }
  } finally {
    sn(-1), Fc(o)
  }
}
function nT(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e)
}
function rT(t, e) {
  let n = t.directiveRegistry,
    r = null,
    i = null
  if (n)
    for (let s = 0; s < n.length; s++) {
      let o = n[s]
      if (OE(e, o.selectors, !1))
        if ((r || (r = []), si(o)))
          if (o.findHostDirectiveDefs !== null) {
            let a = []
            ;(i = i || new Map()),
              o.findHostDirectiveDefs(o, a, i),
              r.unshift(...a, o)
            let c = a.length
            Jc(t, e, c)
          } else r.unshift(o), Jc(t, e, 0)
        else (i = i || new Map()), o.findHostDirectiveDefs?.(o, r, i), r.push(o)
    }
  return r === null ? null : [r, i]
}
function Jc(t, e, n) {
  ;(e.componentOffset = n), (t.components ??= []).push(e.index)
}
function iT(t, e, n) {
  if (e) {
    let r = (t.localNames = [])
    for (let i = 0; i < e.length; i += 2) {
      let s = n[e[i + 1]]
      if (s == null) throw new U(-301, !1)
      r.push(e[i], s)
    }
  }
}
function sT(t, e, n) {
  if (n) {
    if (e.exportAs)
      for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t
    si(e) && (n[''] = t)
  }
}
function oT(t, e, n) {
  ;(t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + n),
    (t.providerIndexes = e)
}
function aT(t, e, n, r, i) {
  t.data[r] = i
  let s = i.factory || (i.factory = nr(i.type, !0)),
    o = new Xr(s, si(i), so)
  ;(t.blueprint[r] = o), (n[r] = o), XD(t, e, r, lm(t, n, i.hostVars, Tt), i)
}
function cT(t, e, n) {
  let r = nt(e, t),
    i = gm(n),
    s = t[vt].rendererFactory,
    o = 16
  n.signals ? (o = 4096) : n.onPush && (o = 64)
  let a = Ku(
    t,
    oo(t, i, null, o, r, e, null, s.createRenderer(r, n), null, null, null)
  )
  t[e.index] = a
}
function uT(t, e, n, r, i, s) {
  let o = s[e]
  if (o !== null)
    for (let a = 0; a < o.length; ) {
      let c = o[a++],
        u = o[a++],
        l = o[a++],
        d = o[a++]
      um(r, n, c, u, l, d)
    }
}
function lT(t, e, n) {
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
function dT(t, e, n, r) {
  return [t, !0, 0, e, null, r, null, n, null, null]
}
function _m(t, e) {
  let n = t.contentQueries
  if (n !== null) {
    let r = oe(null)
    try {
      for (let i = 0; i < n.length; i += 2) {
        let s = n[i],
          o = n[i + 1]
        if (o !== -1) {
          let a = t.data[o]
          _g(s), a.contentQueries(2, e[o], o)
        }
      }
    } finally {
      oe(r)
    }
  }
}
function Ku(t, e) {
  return t[Kr] ? (t[Dp][qe] = e) : (t[Kr] = e), (t[Dp] = e), e
}
function Zc(t, e, n) {
  _g(0)
  let r = oe(null)
  try {
    e(t, n)
  } finally {
    oe(r)
  }
}
function hT(t) {
  return t[Wr] || (t[Wr] = [])
}
function fT(t) {
  return t.cleanup || (t.cleanup = [])
}
function Im(t, e) {
  let n = t[tr],
    r = n ? n.get(Et, null) : null
  r && r.handleError(e)
}
function Qu(t, e, n, r, i) {
  for (let s = 0; s < n.length; ) {
    let o = n[s++],
      a = n[s++],
      c = n[s++],
      u = e[o],
      l = t.data[o]
    um(l, u, r, a, c, i)
  }
}
function pT(t, e, n) {
  let r = hg(e, t)
  uD(t[Te], r, n)
}
var gT = 100
function mT(t, e = !0) {
  let n = t[vt],
    r = n.rendererFactory,
    i = !1
  i || r.begin?.()
  try {
    yT(t)
  } catch (s) {
    throw (e && Im(t, s), s)
  } finally {
    i || (r.end?.(), n.inlineEffectRunner?.flush())
  }
}
function yT(t) {
  Xc(t, 0)
  let e = 0
  for (; pg(t); ) {
    if (e === gT) throw new U(103, !1)
    e++, Xc(t, 1)
  }
}
function vT(t, e, n, r) {
  let i = e[C]
  if ((i & 256) === 256) return
  let s = !1
  !s && e[vt].inlineEffectRunner?.flush(), bu(e)
  let o = null,
    a = null
  !s && _T(t) && ((a = FD(e)), (o = Zf(a)))
  try {
    fg(e), pw(t.bindingStartIndex), n !== null && dm(t, e, n, 2, r)
    let c = (i & 3) === 3
    if (!s)
      if (c) {
        let d = t.preOrderCheckHooks
        d !== null && Ns(e, d, null)
      } else {
        let d = t.preOrderHooks
        d !== null && Rs(e, d, 0, null), yc(e, 0)
      }
    if ((IT(e), Em(e, 0), t.contentQueries !== null && _m(t, e), !s))
      if (c) {
        let d = t.contentCheckHooks
        d !== null && Ns(e, d)
      } else {
        let d = t.contentHooks
        d !== null && Rs(e, d, 1), yc(e, 1)
      }
    $D(t, e)
    let u = t.components
    u !== null && Dm(e, u, 0)
    let l = t.viewQuery
    if ((l !== null && Zc(2, l, r), !s))
      if (c) {
        let d = t.viewCheckHooks
        d !== null && Ns(e, d)
      } else {
        let d = t.viewHooks
        d !== null && Rs(e, d, 2), yc(e, 2)
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[mc])) {
      for (let d of e[mc]) d()
      e[mc] = null
    }
    s || (e[C] &= -73)
  } catch (c) {
    throw (Jr(e), c)
  } finally {
    a !== null && (Xf(a, o), VD(a)), Au()
  }
}
function _T(t) {
  return t.type !== 2
}
function Em(t, e) {
  for (let n = rm(t); n !== null; n = im(n))
    for (let r = Ae; r < n.length; r++) {
      let i = n[r]
      wm(i, e)
    }
}
function IT(t) {
  for (let e = rm(t); e !== null; e = im(e)) {
    if (!(e[C] & wu.HasTransplantedViews)) continue
    let n = e[ks]
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        s = i[Re]
      nw(i)
    }
  }
}
function ET(t, e, n) {
  let r = pn(e, t)
  wm(r, n)
}
function wm(t, e) {
  Cu(t) && Xc(t, e)
}
function Xc(t, e) {
  let r = t[N],
    i = t[C],
    s = t[rn],
    o = !!(e === 0 && i & 16)
  if (
    ((o ||= !!(i & 64 && e === 0)),
    (o ||= !!(i & 1024)),
    (o ||= !!(s?.dirty && tc(s))),
    s && (s.dirty = !1),
    (t[C] &= -9217),
    o)
  )
    vT(r, t, r.template, t[ye])
  else if (i & 8192) {
    Em(t, 1)
    let a = r.components
    a !== null && Dm(t, a, 1)
  }
}
function Dm(t, e, n) {
  for (let r = 0; r < e.length; r++) ET(t, e[r], n)
}
function Yu(t) {
  for (t[vt].changeDetectionScheduler?.notify(); t; ) {
    t[C] |= 64
    let e = Zr(t)
    if (WE(t) && !e) return t
    t = e
  }
  return null
}
var ri = class {
    get rootNodes() {
      let e = this._lView,
        n = e[N]
      return $s(n, e, n.firstChild, [])
    }
    constructor(e, n, r = !0) {
      ;(this._lView = e),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1)
    }
    get context() {
      return this._lView[ye]
    }
    set context(e) {
      this._lView[ye] = e
    }
    get destroyed() {
      return (this._lView[C] & 256) === 256
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this)
      else if (this._attachedToViewContainer) {
        let e = this._lView[Re]
        if (fn(e)) {
          let n = e[GE],
            r = n ? n.indexOf(this) : -1
          r > -1 && (Uu(e, r), Lg(n, r))
        }
        this._attachedToViewContainer = !1
      }
      ju(this._lView[N], this._lView)
    }
    onDestroy(e) {
      iw(this._lView, e)
    }
    markForCheck() {
      Yu(this._cdRefInjectingView || this._lView)
    }
    detach() {
      this._lView[C] &= -129
    }
    reattach() {
      kc(this._lView), (this._lView[C] |= 128)
    }
    detectChanges() {
      ;(this._lView[C] |= 1024), mT(this._lView, this.notifyErrorHandler)
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new U(902, !1)
      this._attachedToViewContainer = !0
    }
    detachFromAppRef() {
      ;(this._appRef = null), Kg(this._lView[N], this._lView)
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new U(902, !1)
      ;(this._appRef = e), kc(this._lView)
    }
  },
  Tm = (() => {
    let e = class e {}
    e.__NG_ELEMENT_ID__ = wT
    let t = e
    return t
  })()
function wT(t) {
  return DT(Pt(), Y(), (t & 16) === 16)
}
function DT(t, e, n) {
  if (Js(t) && !n) {
    let r = pn(t.index, e)
    return new ri(r, r)
  } else if (t.type & 47) {
    let r = e[ze]
    return new ri(r, e)
  }
  return null
}
var Op = new Set()
function co(t) {
  Op.has(t) ||
    (Op.add(t),
    performance?.mark?.('mark_feature_usage', { detail: { feature: t } }))
}
var eu = class extends Hn {
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
    this.__isAsync && ((s = Tc(s)), i && (i = Tc(i)), o && (o = Tc(o)))
    let a = super.subscribe({ next: i, error: s, complete: o })
    return e instanceof me && e.add(a), a
  }
}
function Tc(t) {
  return (e) => {
    setTimeout(t, void 0, e)
  }
}
var tn = eu
function kp(...t) {}
function TT() {
  let t = typeof Br.requestAnimationFrame == 'function',
    e = Br[t ? 'requestAnimationFrame' : 'setTimeout'],
    n = Br[t ? 'cancelAnimationFrame' : 'clearTimeout']
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
        (this.onUnstable = new tn(!1)),
        (this.onMicrotaskEmpty = new tn(!1)),
        (this.onStable = new tn(!1)),
        (this.onError = new tn(!1)),
        typeof Zone > 'u')
      )
        throw new U(908, !1)
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
        (i.nativeRequestAnimationFrame = TT().nativeRequestAnimationFrame),
        AT(i)
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get('isAngularZone') === !0
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new U(909, !1)
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new U(909, !1)
    }
    run(e, n, r) {
      return this._inner.run(e, n, r)
    }
    runTask(e, n, r, i) {
      let s = this._inner,
        o = s.scheduleEventTask('NgZoneEvent: ' + i, e, CT, kp, kp)
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
  CT = {}
function Ju(t) {
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
function bT(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      Br,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            'fakeTopEventTask',
            () => {
              ;(t.lastRequestAnimationFrameId = -1),
                tu(t),
                (t.isCheckStableRunning = !0),
                Ju(t),
                (t.isCheckStableRunning = !1)
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke()
      }
    )),
    tu(t))
}
function AT(t) {
  let e = () => {
    bT(t)
  }
  t._inner = t._inner.fork({
    name: 'angular',
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, s, o, a) => {
      if (ST(a)) return n.invokeTask(i, s, o, a)
      try {
        return Fp(t), n.invokeTask(i, s, o, a)
      } finally {
        ;((t.shouldCoalesceEventChangeDetection && s.type === 'eventTask') ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          Lp(t)
      }
    },
    onInvoke: (n, r, i, s, o, a, c) => {
      try {
        return Fp(t), n.invoke(i, s, o, a, c)
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), Lp(t)
      }
    },
    onHasTask: (n, r, i, s) => {
      n.hasTask(i, s),
        r === i &&
          (s.change == 'microTask'
            ? ((t._hasPendingMicrotasks = s.microTask), tu(t), Ju(t))
            : s.change == 'macroTask' && (t.hasPendingMacrotasks = s.macroTask))
    },
    onHandleError: (n, r, i, s) => (
      n.handleError(i, s), t.runOutsideAngular(() => t.onError.emit(s)), !1
    ),
  })
}
function tu(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1)
}
function Fp(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null))
}
function Lp(t) {
  t._nesting--, Ju(t)
}
function ST(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0
}
var Cm = (() => {
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
function NT(t, e) {
  let n = pn(e, t),
    r = n[N]
  RT(r, n)
  let i = n[wt]
  i !== null && n[Gr] === null && (n[Gr] = Hu(i, n[tr])), Zu(r, n, n[ye])
}
function RT(t, e) {
  for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n])
}
function Zu(t, e, n) {
  bu(e)
  try {
    let r = t.viewQuery
    r !== null && Zc(1, r, n)
    let i = t.template
    i !== null && dm(t, e, i, 1, n),
      t.firstCreatePass && (t.firstCreatePass = !1),
      t.staticContentQueries && _m(t, e),
      t.staticViewQueries && Zc(2, t.viewQuery, n)
    let s = t.components
    s !== null && xT(e, s)
  } catch (r) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      r)
    )
  } finally {
    ;(e[C] &= -5), Au()
  }
}
function xT(t, e) {
  for (let n = 0; n < e.length; n++) NT(t, e[n])
}
function nu(t, e, n) {
  let r = n ? t.styles : null,
    i = n ? t.classes : null,
    s = 0
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let a = e[o]
      if (typeof a == 'number') s = a
      else if (s == 1) i = Nc(i, a)
      else if (s == 2) {
        let c = a,
          u = e[++o]
        r = Nc(r, c + ': ' + u + ';')
      }
    }
  n ? (t.styles = r) : (t.stylesWithoutHost = r),
    n ? (t.classes = i) : (t.classesWithoutHost = i)
}
var ru = class extends qu {
  constructor(e) {
    super(), (this.ngModule = e)
  }
  resolveComponentFactory(e) {
    let n = Ks(e)
    return new su(n, this.ngModule)
  }
}
function Vp(t) {
  let e = []
  for (let n in t) {
    if (!t.hasOwnProperty(n)) continue
    let r = t[n]
    r !== void 0 &&
      e.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n })
  }
  return e
}
function MT(t) {
  let e = t.toLowerCase()
  return e === 'svg' ? JE : e === 'math' ? ZE : null
}
var iu = class {
    constructor(e, n) {
      ;(this.injector = e), (this.parentInjector = n)
    }
    get(e, n, r) {
      r = Ws(r)
      let i = this.injector.get(e, wc, r)
      return i !== wc || n === wc ? i : this.parentInjector.get(e, n, r)
    }
  },
  su = class extends Bs {
    get inputs() {
      let e = this.componentDef,
        n = e.inputTransforms,
        r = Vp(e.inputs)
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName])
      return r
    }
    get outputs() {
      return Vp(this.componentDef.outputs)
    }
    constructor(e, n) {
      super(),
        (this.componentDef = e),
        (this.ngModule = n),
        (this.componentType = e.type),
        (this.selector = VE(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n)
    }
    create(e, n, r, i) {
      i = i || this.ngModule
      let s = i instanceof on ? i : i?.injector
      s &&
        this.componentDef.getStandaloneInjector !== null &&
        (s = this.componentDef.getStandaloneInjector(s) || s)
      let o = s ? new iu(e, s) : e,
        a = o.get(ni, null)
      if (a === null) throw new U(407, !1)
      let c = o.get(OD, null),
        u = o.get(Cm, null),
        l = o.get(Kc, null),
        d = {
          rendererFactory: a,
          sanitizer: c,
          inlineEffectRunner: null,
          afterRenderEventManager: u,
          changeDetectionScheduler: l,
        },
        h = a.createRenderer(null, this.componentDef),
        f = this.componentDef.selectors[0][0] || 'div',
        _ = r ? zD(h, r, this.componentDef.encapsulation, o) : Wg(h, f, MT(f)),
        E = 512
      this.componentDef.signals
        ? (E |= 4096)
        : this.componentDef.onPush || (E |= 16)
      let I = null
      _ !== null && (I = Hu(_, o, !0))
      let S = Wu(0, null, null, 1, 0, null, null, null, null, null, null),
        L = oo(null, S, null, E, null, null, d, h, o, null, I)
      bu(L)
      let z, $
      try {
        let X = this.componentDef,
          H,
          Se = null
        X.findHostDirectiveDefs
          ? ((H = []),
            (Se = new Map()),
            X.findHostDirectiveDefs(X, H, Se),
            H.push(X))
          : (H = [X])
        let Rt = PT(L, _),
          Jt = OT(Rt, _, X, H, L, d, h)
        ;($ = Tu(S, xe)),
          _ && LT(h, X, _, r),
          n !== void 0 && VT($, this.ngContentSelectors, n),
          (z = FT(Jt, X, H, Se, L, [UT])),
          Zu(S, L, null)
      } finally {
        Au()
      }
      return new ou(this.componentType, z, tm($, L), L, $)
    }
  },
  ou = class extends Qc {
    constructor(e, n, r, i, s) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = s),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new ri(i, void 0, !1)),
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
        Qu(s[N], s, i, e, n), this.previousInputValues.set(e, n)
        let o = pn(this._tNode.index, s)
        Yu(o)
      }
    }
    get injector() {
      return new Vs(this._tNode, this._rootLView)
    }
    destroy() {
      this.hostView.destroy()
    }
    onDestroy(e) {
      this.hostView.onDestroy(e)
    }
  }
function PT(t, e) {
  let n = t[N],
    r = xe
  return (t[r] = e), ao(n, r, 2, '#host', null)
}
function OT(t, e, n, r, i, s, o) {
  let a = i[N]
  kT(r, t, e, o)
  let c = null
  e !== null && (c = Hu(e, i[tr]))
  let u = s.rendererFactory.createRenderer(e, n),
    l = 16
  n.signals ? (l = 4096) : n.onPush && (l = 64)
  let d = oo(i, gm(n), null, l, i[t.index], t, s, u, null, null, c)
  return a.firstCreatePass && Jc(a, t, r.length - 1), Ku(i, d), (i[t.index] = d)
}
function kT(t, e, n, r) {
  for (let i of t) e.mergedAttrs = Eu(e.mergedAttrs, i.hostAttrs)
  e.mergedAttrs !== null &&
    (nu(e, e.mergedAttrs, !0), n !== null && em(r, n, e))
}
function FT(t, e, n, r, i, s) {
  let o = Pt(),
    a = i[N],
    c = nt(o, i)
  ym(a, i, o, n, null, r)
  for (let l = 0; l < n.length; l++) {
    let d = o.directiveStart + l,
      h = ei(i, a, d, o)
    an(h, i)
  }
  vm(a, i, o), c && an(c, i)
  let u = ei(i, a, o.directiveStart + o.componentOffset, o)
  if (((t[ye] = i[ye] = u), s !== null)) for (let l of s) l(u, e)
  return hm(a, o, t), u
}
function LT(t, e, n, r) {
  if (r) Pc(t, n, ['ng-version', '17.1.0'])
  else {
    let { attrs: i, classes: s } = UE(e.selectors[0])
    i && Pc(t, n, i), s && s.length > 0 && Xg(t, n, s.join(' '))
  }
}
function VT(t, e, n) {
  let r = (t.projection = [])
  for (let i = 0; i < e.length; i++) {
    let s = n[i]
    r.push(s != null ? Array.from(s) : null)
  }
}
function UT() {
  let t = Pt()
  Ru(Y()[N], t)
}
var wP = new RegExp(`^(\\d+)*(${ND}|${SD})*(.*)`)
var jT = () => null
function Xu(t, e) {
  return jT(t, e)
}
function el(t, e, n, r) {
  let i = e.tView,
    o = t[C] & 4096 ? 4096 : 16,
    a = oo(
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
  a[Qs] = c
  let u = t[Qr]
  return u !== null && (a[Qr] = u.createEmbeddedView(i)), Zu(i, a, n), a
}
function bm(t, e) {
  let n = Ae + e
  if (n < t.length) return t[n]
}
function tl(t, e) {
  return !e || e.firstChild === null || zg(t)
}
function nl(t, e, n, r = !0) {
  let i = e[N]
  if ((fD(i, e, t, n), r)) {
    let o = Gc(n, t),
      a = e[Te],
      c = Jg(a, t[Yr])
    c !== null && dD(i, t[tt], a, e, c, o)
  }
  let s = e[Gr]
  s !== null && s.firstChild !== null && (s.firstChild = null)
}
function Am(t, e) {
  let n = Uu(t, e)
  return n !== void 0 && ju(n[N], n), n
}
var BT = () => !1
function $T(t, e, n) {
  return BT(t, e, n)
}
function HT(t, e, n) {
  return (t[e] = n)
}
function gn(t, e, n) {
  let r = t[e]
  return Object.is(r, n) ? !1 : ((t[e] = n), !0)
}
function qT(t, e, n, r, i, s, o, a, c) {
  let u = e.consts,
    l = ao(e, t, 4, o || null, Fs(u, a))
  mm(e, n, l, Fs(u, c)), Ru(e, l)
  let d = (l.tView = Wu(
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
function cn(t, e, n, r, i, s, o, a) {
  let c = Y(),
    u = rt(),
    l = t + xe,
    d = u.firstCreatePass ? qT(l, u, c, e, n, r, i, s, o) : u.data[l]
  oi(d, !1)
  let h = zT(u, c, d, t)
  Su() && Bu(u, c, h, d), an(h, c)
  let f = dT(h, c, h, d)
  return (
    (c[l] = f),
    Ku(c, f),
    $T(f, d, c),
    Du(d) && fm(u, c, d),
    o != null && pm(c, d, a),
    cn
  )
}
var zT = GT
function GT(t, e, n, r) {
  return Nu(!0), e[Te].createComment('')
}
function WT(t, e, n, r) {
  return gn(t, eo(), n) ? e + Wp(n) + r : Tt
}
function Ss(t, e) {
  return (t << 17) | (e << 2)
}
function un(t) {
  return (t >> 17) & 32767
}
function KT(t) {
  return (t & 2) == 2
}
function QT(t, e) {
  return (t & 131071) | (e << 17)
}
function au(t) {
  return t | 2
}
function rr(t) {
  return (t & 131068) >> 2
}
function Cc(t, e) {
  return (t & -131069) | (e << 2)
}
function YT(t) {
  return (t & 1) === 1
}
function cu(t) {
  return t | 1
}
function JT(t, e, n, r, i, s) {
  let o = s ? e.classBindings : e.styleBindings,
    a = un(o),
    c = rr(o)
  t[r] = n
  let u = !1,
    l
  if (Array.isArray(n)) {
    let d = n
    ;(l = d[1]), (l === null || ai(d, l) > 0) && (u = !0)
  } else l = n
  if (i)
    if (c !== 0) {
      let h = un(t[a + 1])
      ;(t[r + 1] = Ss(h, a)),
        h !== 0 && (t[h + 1] = Cc(t[h + 1], r)),
        (t[a + 1] = QT(t[a + 1], r))
    } else
      (t[r + 1] = Ss(a, 0)), a !== 0 && (t[a + 1] = Cc(t[a + 1], r)), (a = r)
  else
    (t[r + 1] = Ss(c, 0)),
      a === 0 ? (a = r) : (t[c + 1] = Cc(t[c + 1], r)),
      (c = r)
  u && (t[r + 1] = au(t[r + 1])),
    Up(t, l, r, !0),
    Up(t, l, r, !1),
    ZT(e, l, t, r, s),
    (o = Ss(a, c)),
    s ? (e.classBindings = o) : (e.styleBindings = o)
}
function ZT(t, e, n, r, i) {
  let s = i ? t.residualClasses : t.residualStyles
  s != null &&
    typeof e == 'string' &&
    ai(s, e) >= 0 &&
    (n[r + 1] = cu(n[r + 1]))
}
function Up(t, e, n, r) {
  let i = t[n + 1],
    s = e === null,
    o = r ? un(i) : rr(i),
    a = !1
  for (; o !== 0 && (a === !1 || s); ) {
    let c = t[o],
      u = t[o + 1]
    XT(c, e) && ((a = !0), (t[o + 1] = r ? cu(u) : au(u))),
      (o = r ? un(u) : rr(u))
  }
  a && (t[n + 1] = r ? au(i) : cu(i))
}
function XT(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == 'string'
      ? ai(t, e) >= 0
      : !1
}
var $e = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 }
function eC(t) {
  return t.substring($e.key, $e.keyEnd)
}
function tC(t) {
  return nC(t), Sm(t, Nm(t, 0, $e.textEnd))
}
function Sm(t, e) {
  let n = $e.textEnd
  return n === e ? -1 : ((e = $e.keyEnd = rC(t, ($e.key = e), n)), Nm(t, e, n))
}
function nC(t) {
  ;($e.key = 0),
    ($e.keyEnd = 0),
    ($e.value = 0),
    ($e.valueEnd = 0),
    ($e.textEnd = t.length)
}
function Nm(t, e, n) {
  for (; e < n && t.charCodeAt(e) <= 32; ) e++
  return e
}
function rC(t, e, n) {
  for (; e < n && t.charCodeAt(e) > 32; ) e++
  return e
}
function rl(t, e, n) {
  let r = Y(),
    i = eo()
  if (gn(r, i, e)) {
    let s = rt(),
      o = Ew()
    JD(s, o, r, t, e, r[Te], n, !1)
  }
  return rl
}
function uu(t, e, n, r, i) {
  let s = e.inputs,
    o = i ? 'class' : 'style'
  Qu(t, n, s[o], o, r)
}
function uo(t, e, n) {
  return sC(t, e, n, !1), uo
}
function Rm(t) {
  oC(hC, iC, t, !0)
}
function iC(t, e) {
  for (let n = tC(e); n >= 0; n = Sm(e, n)) Mu(t, eC(e), !0)
}
function sC(t, e, n, r) {
  let i = Y(),
    s = rt(),
    o = vg(2)
  if ((s.firstUpdatePass && Mm(s, t, o, r), e !== Tt && gn(i, o, e))) {
    let a = s.data[Ot()]
    Pm(s, a, i, i[Te], t, (i[o + 1] = pC(e, n)), r, o)
  }
}
function oC(t, e, n, r) {
  let i = rt(),
    s = vg(2)
  i.firstUpdatePass && Mm(i, null, s, r)
  let o = Y()
  if (n !== Tt && gn(o, s, n)) {
    let a = i.data[Ot()]
    if (Om(a, r) && !xm(i, s)) {
      let c = r ? a.classesWithoutHost : a.stylesWithoutHost
      c !== null && (n = Nc(c, n || '')), uu(i, a, o, n, r)
    } else fC(i, a, o, o[Te], o[s + 1], (o[s + 1] = dC(t, e, n)), r, s)
  }
}
function xm(t, e) {
  return e >= t.expandoStartIndex
}
function Mm(t, e, n, r) {
  let i = t.data
  if (i[n + 1] === null) {
    let s = i[Ot()],
      o = xm(t, n)
    Om(s, r) && e === null && !o && (e = !1),
      (e = aC(i, s, e, r)),
      JT(i, s, e, n, o, r)
  }
}
function aC(t, e, n, r) {
  let i = vw(t),
    s = r ? e.residualClasses : e.residualStyles
  if (i === null)
    (r ? e.classBindings : e.styleBindings) === 0 &&
      ((n = bc(null, t, e, n, r)), (n = ii(n, e.attrs, r)), (s = null))
  else {
    let o = e.directiveStylingLast
    if (o === -1 || t[o] !== i)
      if (((n = bc(i, t, e, n, r)), s === null)) {
        let c = cC(t, e, r)
        c !== void 0 &&
          Array.isArray(c) &&
          ((c = bc(null, t, e, c[1], r)),
          (c = ii(c, e.attrs, r)),
          uC(t, e, r, c))
      } else s = lC(t, e, r)
  }
  return (
    s !== void 0 && (r ? (e.residualClasses = s) : (e.residualStyles = s)), n
  )
}
function cC(t, e, n) {
  let r = n ? e.classBindings : e.styleBindings
  if (rr(r) !== 0) return t[un(r)]
}
function uC(t, e, n, r) {
  let i = n ? e.classBindings : e.styleBindings
  t[un(i)] = r
}
function lC(t, e, n) {
  let r,
    i = e.directiveEnd
  for (let s = 1 + e.directiveStylingLast; s < i; s++) {
    let o = t[s].hostAttrs
    r = ii(r, o, n)
  }
  return ii(r, e.attrs, n)
}
function bc(t, e, n, r, i) {
  let s = null,
    o = n.directiveEnd,
    a = n.directiveStylingLast
  for (
    a === -1 ? (a = n.directiveStart) : a++;
    a < o && ((s = e[a]), (r = ii(r, s.hostAttrs, i)), s !== t);

  )
    a++
  return t !== null && (n.directiveStylingLast = a), r
}
function ii(t, e, n) {
  let r = n ? 1 : 2,
    i = -1
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let o = e[s]
      typeof o == 'number'
        ? (i = o)
        : i === r &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ['', t]),
          Mu(t, o, n ? !0 : e[++s]))
    }
  return t === void 0 ? null : t
}
function dC(t, e, n) {
  if (n == null || n === '') return Ne
  let r = [],
    i = io(n)
  if (Array.isArray(i)) for (let s = 0; s < i.length; s++) t(r, i[s], !0)
  else if (typeof i == 'object')
    for (let s in i) i.hasOwnProperty(s) && t(r, s, i[s])
  else typeof i == 'string' && e(r, i)
  return r
}
function hC(t, e, n) {
  let r = String(e)
  r !== '' && !r.includes(' ') && Mu(t, r, n)
}
function fC(t, e, n, r, i, s, o, a) {
  i === Tt && (i = Ne)
  let c = 0,
    u = 0,
    l = 0 < i.length ? i[0] : null,
    d = 0 < s.length ? s[0] : null
  for (; l !== null || d !== null; ) {
    let h = c < i.length ? i[c + 1] : void 0,
      f = u < s.length ? s[u + 1] : void 0,
      _ = null,
      E
    l === d
      ? ((c += 2), (u += 2), h !== f && ((_ = d), (E = f)))
      : d === null || (l !== null && l < d)
        ? ((c += 2), (_ = l))
        : ((u += 2), (_ = d), (E = f)),
      _ !== null && Pm(t, e, n, r, _, E, o, a),
      (l = c < i.length ? i[c] : null),
      (d = u < s.length ? s[u] : null)
  }
}
function Pm(t, e, n, r, i, s, o, a) {
  if (!(e.type & 3)) return
  let c = t.data,
    u = c[a + 1],
    l = YT(u) ? jp(c, e, n, i, rr(u), o) : void 0
  if (!Hs(l)) {
    Hs(s) || (KT(u) && (s = jp(c, null, n, i, a, o)))
    let d = hg(Ot(), n)
    bD(r, o, d, i, s)
  }
}
function jp(t, e, n, r, i, s) {
  let o = e === null,
    a
  for (; i > 0; ) {
    let c = t[i],
      u = Array.isArray(c),
      l = u ? c[1] : c,
      d = l === null,
      h = n[i + 1]
    h === Tt && (h = d ? Ne : void 0)
    let f = d ? _c(h, r) : l === r ? h : void 0
    if ((u && !Hs(f) && (f = _c(c, r)), Hs(f) && ((a = f), o))) return a
    let _ = t[i + 1]
    i = o ? un(_) : rr(_)
  }
  if (e !== null) {
    let c = s ? e.residualClasses : e.residualStyles
    c != null && (a = _c(c, r))
  }
  return a
}
function Hs(t) {
  return t !== void 0
}
function pC(t, e) {
  return (
    t == null ||
      t === '' ||
      (typeof e == 'string'
        ? (t = t + e)
        : typeof t == 'object' && (t = Oe(io(t)))),
    t
  )
}
function Om(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0
}
var lu = class {
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
function Ac(t, e, n, r, i) {
  return t === n && Object.is(e, r) ? 1 : Object.is(i(t, e), i(n, r)) ? -1 : 0
}
function gC(t, e, n) {
  let r,
    i,
    s = 0,
    o = t.length - 1
  if (Array.isArray(e)) {
    let a = e.length - 1
    for (; s <= o && s <= a; ) {
      let c = t.at(s),
        u = e[s],
        l = Ac(s, c, s, u, n)
      if (l !== 0) {
        l < 0 && t.updateValue(s, u), s++
        continue
      }
      let d = t.at(o),
        h = e[a],
        f = Ac(o, d, a, h, n)
      if (f !== 0) {
        f < 0 && t.updateValue(o, h), o--, a--
        continue
      }
      let _ = n(s, c),
        E = n(o, d),
        I = n(s, u)
      if (Object.is(I, E)) {
        let S = n(a, h)
        Object.is(S, _)
          ? (t.swap(s, o), t.updateValue(o, h), a--, o--)
          : t.move(o, s),
          t.updateValue(s, u),
          s++
        continue
      }
      if (((r ??= new qs()), (i ??= $p(t, s, o, n)), du(t, r, s, I)))
        t.updateValue(s, u), s++, o++
      else if (i.has(I)) r.set(_, t.detach(s)), o--
      else {
        let S = t.create(s, e[s])
        t.attach(s, S), s++, o++
      }
    }
    for (; s <= a; ) Bp(t, r, n, s, e[s]), s++
  } else if (e != null) {
    let a = e[Symbol.iterator](),
      c = a.next()
    for (; !c.done && s <= o; ) {
      let u = t.at(s),
        l = c.value,
        d = Ac(s, u, s, l, n)
      if (d !== 0) d < 0 && t.updateValue(s, l), s++, (c = a.next())
      else {
        ;(r ??= new qs()), (i ??= $p(t, s, o, n))
        let h = n(s, l)
        if (du(t, r, s, h)) t.updateValue(s, l), s++, o++, (c = a.next())
        else if (!i.has(h))
          t.attach(s, t.create(s, l)), s++, o++, (c = a.next())
        else {
          let f = n(s, u)
          r.set(f, t.detach(s)), o--
        }
      }
    }
    for (; !c.done; ) Bp(t, r, n, t.length, c.value), (c = a.next())
  }
  for (; s <= o; ) t.destroy(t.detach(o--))
  r?.forEach((a) => {
    t.destroy(a)
  })
}
function du(t, e, n, r) {
  return e !== void 0 && e.has(r)
    ? (t.attach(n, e.get(r)), e.delete(r), !0)
    : !1
}
function Bp(t, e, n, r, i) {
  if (du(t, e, r, n(r, i))) t.updateValue(r, i)
  else {
    let s = t.create(r, i)
    t.attach(r, s)
  }
}
function $p(t, e, n, r) {
  let i = new Set()
  for (let s = e; s <= n; s++) i.add(r(s, t.at(s)))
  return i
}
var qs = class {
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
function lo(t, e, n) {
  co('NgControlFlow')
  let r = Y(),
    i = eo(),
    s = gu(r, xe + t),
    o = 0
  if (gn(r, i, e)) {
    let a = oe(null)
    try {
      if ((Am(s, o), e !== -1)) {
        let c = mu(r[N], xe + e),
          u = Xu(s, c.tView.ssrId),
          l = el(r, c, n, { dehydratedView: u })
        nl(s, l, o, tl(c, u))
      }
    } finally {
      oe(a)
    }
  } else {
    let a = bm(s, o)
    a !== void 0 && (a[ye] = n)
  }
}
var hu = class {
  constructor(e, n, r) {
    ;(this.lContainer = e), (this.$implicit = n), (this.$index = r)
  }
  get $count() {
    return this.lContainer.length - Ae
  }
}
function km(t, e) {
  return e
}
var fu = class {
  constructor(e, n, r) {
    ;(this.hasEmptyBlock = e), (this.trackByFn = n), (this.liveCollection = r)
  }
}
function ho(t, e, n, r, i, s, o, a, c, u, l, d, h) {
  co('NgControlFlow')
  let f = c !== void 0,
    _ = Y(),
    E = a ? o.bind(_[ze][ye]) : o,
    I = new fu(f, E)
  ;(_[xe + t] = I), cn(t + 1, e, n, r, i, s), f && cn(t + 2, c, u, l, d, h)
}
var pu = class extends lu {
  constructor(e, n, r) {
    super(),
      (this.lContainer = e),
      (this.hostLView = n),
      (this.templateTNode = r),
      (this.needsIndexUpdate = !1)
  }
  get length() {
    return this.lContainer.length - Ae
  }
  at(e) {
    return this.getLView(e)[ye].$implicit
  }
  attach(e, n) {
    let r = n[Gr]
    ;(this.needsIndexUpdate ||= e !== this.length),
      nl(this.lContainer, n, e, tl(this.templateTNode, r))
  }
  detach(e) {
    return (
      (this.needsIndexUpdate ||= e !== this.length - 1), mC(this.lContainer, e)
    )
  }
  create(e, n) {
    let r = Xu(this.lContainer, this.templateTNode.tView.ssrId)
    return el(
      this.hostLView,
      this.templateTNode,
      new hu(this.lContainer, n, e),
      { dehydratedView: r }
    )
  }
  destroy(e) {
    ju(e[N], e)
  }
  updateValue(e, n) {
    this.getLView(e)[ye].$implicit = n
  }
  reset() {
    this.needsIndexUpdate = !1
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let e = 0; e < this.length; e++) this.getLView(e)[ye].$index = e
  }
  getLView(e) {
    return yC(this.lContainer, e)
  }
}
function fo(t) {
  let e = oe(null),
    n = Ot()
  try {
    let r = Y(),
      i = r[N],
      s = r[n]
    if (s.liveCollection === void 0) {
      let a = n + 1,
        c = gu(r, a),
        u = mu(i, a)
      s.liveCollection = new pu(c, r, u)
    } else s.liveCollection.reset()
    let o = s.liveCollection
    if ((gC(o, t, s.trackByFn), o.updateIndexes(), s.hasEmptyBlock)) {
      let a = eo(),
        c = o.length === 0
      if (gn(r, a, c)) {
        let u = n + 2,
          l = gu(r, u)
        if (c) {
          let d = mu(i, u),
            h = Xu(l, d.tView.ssrId),
            f = el(r, d, void 0, { dehydratedView: h })
          nl(l, f, 0, tl(d, h))
        } else Am(l, 0)
      }
    }
  } finally {
    oe(e)
  }
}
function gu(t, e) {
  return t[e]
}
function mC(t, e) {
  return Uu(t, e)
}
function yC(t, e) {
  return bm(t, e)
}
function mu(t, e) {
  return Tu(t, e)
}
function vC(t, e, n, r, i, s) {
  let o = e.consts,
    a = Fs(o, i),
    c = ao(e, t, 2, r, a)
  return (
    mm(e, n, c, Fs(o, s)),
    c.attrs !== null && nu(c, c.attrs, !1),
    c.mergedAttrs !== null && nu(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  )
}
function he(t, e, n, r) {
  let i = Y(),
    s = rt(),
    o = xe + t,
    a = i[Te],
    c = s.firstCreatePass ? vC(o, s, i, e, n, r) : s.data[o],
    u = _C(s, i, c, a, e, t)
  i[o] = u
  let l = Du(c)
  return (
    oi(c, !0),
    em(a, u, c),
    (c.flags & 32) !== 32 && Su() && Bu(s, i, u, c),
    sw() === 0 && an(u, i),
    ow(),
    l && (fm(s, i, c), hm(s, c, i)),
    r !== null && pm(i, c),
    he
  )
}
function ve() {
  let t = Pt()
  yg() ? hw() : ((t = t.parent), oi(t, !1))
  let e = t
  uw(e) && lw(), aw()
  let n = rt()
  return (
    n.firstCreatePass && (Ru(n, t), og(t) && n.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      bw(e) &&
      uu(n, e, Y(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      Aw(e) &&
      uu(n, e, Y(), e.stylesWithoutHost, !1),
    ve
  )
}
function ci(t, e, n, r) {
  return he(t, e, n, r), ve(), ci
}
var _C = (t, e, n, r, i, s) => (Nu(!0), Wg(r, i, ww()))
function po() {
  return Y()
}
var zs = 'en-US'
var IC = zs
function EC(t) {
  pE(t, 'Expected localeId to be defined'),
    typeof t == 'string' && (IC = t.toLowerCase().replace(/_/g, '-'))
}
function go(t) {
  return !!t && typeof t.then == 'function'
}
function il(t) {
  return !!t && typeof t.subscribe == 'function'
}
function mn(t, e, n, r) {
  let i = Y(),
    s = rt(),
    o = Pt()
  return DC(s, i, i[Te], o, t, e, r), mn
}
function wC(t, e, n, r) {
  let i = t.cleanup
  if (i != null)
    for (let s = 0; s < i.length - 1; s += 2) {
      let o = i[s]
      if (o === n && i[s + 1] === r) {
        let a = e[Wr],
          c = i[s + 2]
        return a.length > c ? a[c] : null
      }
      typeof o == 'string' && (s += 2)
    }
  return null
}
function DC(t, e, n, r, i, s, o) {
  let a = Du(r),
    u = t.firstCreatePass && fT(t),
    l = e[ye],
    d = hT(e),
    h = !0
  if (r.type & 3 || o) {
    let E = nt(r, e),
      I = o ? o(E) : E,
      S = d.length,
      L = o ? ($) => o(_t($[r.index])) : r.index,
      z = null
    if ((!o && a && (z = wC(t, e, i, r.index)), z !== null)) {
      let $ = z.__ngLastListenerFn__ || z
      ;($.__ngNextListenerFn__ = s), (z.__ngLastListenerFn__ = s), (h = !1)
    } else {
      s = qp(r, e, l, s, !1)
      let $ = n.listen(I, i, s)
      d.push(s, $), u && u.push(i, L, S, S + 1)
    }
  } else s = qp(r, e, l, s, !1)
  let f = r.outputs,
    _
  if (h && f !== null && (_ = f[i])) {
    let E = _.length
    if (E)
      for (let I = 0; I < E; I += 2) {
        let S = _[I],
          L = _[I + 1],
          X = e[S][L].subscribe(s),
          H = d.length
        d.push(s, X), u && u.push(i, r.index, H, -(H + 1))
      }
  }
}
function Hp(t, e, n, r) {
  try {
    return Ze(6, e, n), n(r) !== !1
  } catch (i) {
    return Im(t, i), !1
  } finally {
    Ze(7, e, n)
  }
}
function qp(t, e, n, r, i) {
  return function s(o) {
    if (o === Function) return r
    let a = t.componentOffset > -1 ? pn(t.index, e) : e
    Yu(a)
    let c = Hp(e, n, r, o),
      u = s.__ngNextListenerFn__
    for (; u; ) (c = Hp(e, n, u, o) && c), (u = u.__ngNextListenerFn__)
    return i && c === !1 && o.preventDefault(), c
  }
}
function Lt(t = 1) {
  return Iw(t)
}
function TC(t, e, n, r) {
  n >= t.data.length && ((t.data[n] = null), (t.blueprint[n] = null)),
    (e[n] = r)
}
function st(t, e = '') {
  let n = Y(),
    r = rt(),
    i = t + xe,
    s = r.firstCreatePass ? ao(r, i, 1, e, null) : r.data[i],
    o = CC(r, n, s, e, t)
  ;(n[i] = o), Su() && Bu(r, n, o, s), oi(s, !1)
}
var CC = (t, e, n, r, i) => (Nu(!0), cD(e[Te], r))
function sl(t) {
  return mo('', t, ''), sl
}
function mo(t, e, n) {
  let r = Y(),
    i = WT(r, t, e, n)
  return i !== Tt && pT(r, Ot(), i), mo
}
var ir = class {}
var Gs = class extends ir {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new ru(this)),
      (this.instance = null)
    let n = new js(
      [
        ...e.providers,
        { provide: ir, useValue: this },
        { provide: qu, useValue: this.componentFactoryResolver },
      ],
      e.parent || Ou(),
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
function bC(t, e, n = null) {
  return new Gs({
    providers: t,
    parent: e,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector
}
var AC = (() => {
  let e = class e {
    constructor(r) {
      ;(this._injector = r), (this.cachedInjectors = new Map())
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null
      if (!this.cachedInjectors.has(r)) {
        let i = Bg(!1, r.type),
          s =
            i.length > 0
              ? bC([i], this._injector, `Standalone[${r.type.name}]`)
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
    factory: () => new e(k(on)),
  })
  let t = e
  return t
})()
function Vt(t) {
  co('NgStandalone'),
    (t.getStandaloneInjector = (e) =>
      e.get(AC).getOrCreateStandaloneInjector(t))
}
function SC(t, e) {
  let n = t[e]
  return n === Tt ? void 0 : n
}
function NC(t, e, n, r, i, s) {
  let o = e + n
  return gn(t, o, i) ? HT(t, o + 1, s ? r.call(s, i) : r(i)) : SC(t, o + 1)
}
function Fm(t, e) {
  let n = rt(),
    r,
    i = t + xe
  n.firstCreatePass
    ? ((r = RC(e, n.pipeRegistry)),
      (n.data[i] = r),
      r.onDestroy && (n.destroyHooks ??= []).push(i, r.onDestroy))
    : (r = n.data[i])
  let s = r.factory || (r.factory = nr(r.type, !0)),
    o,
    a = Pe(so)
  try {
    let c = Ls(!1),
      u = s()
    return Ls(c), TC(n, Y(), i, u), u
  } finally {
    Pe(a)
  }
}
function RC(t, e) {
  if (e)
    for (let n = e.length - 1; n >= 0; n--) {
      let r = e[n]
      if (t === r.name) return r
    }
}
function Lm(t, e, n) {
  let r = t + xe,
    i = Y(),
    s = tw(i, r)
  return xC(i, r) ? NC(i, fw(), e, s.transform, n, s) : s.transform(n)
}
function xC(t, e) {
  return t[N].data[e].pure
}
var ln = class {
    constructor(e) {
      this.full = e
      let n = e.split('.')
      ;(this.major = n[0]),
        (this.minor = n[1]),
        (this.patch = n.slice(2).join('.'))
    }
  },
  Vm = new ln('17.1.0')
var Um = (() => {
  let e = class e {
    constructor() {
      ;(this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new Vr(!1))
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
var jm = new q('')
var MC = new q('Application Initializer'),
  Bm = (() => {
    let e = class e {
      constructor() {
        ;(this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            ;(this.resolve = r), (this.reject = i)
          })),
          (this.appInits = ee(MC, { optional: !0 }) ?? [])
      }
      runInitializers() {
        if (this.initialized) return
        let r = []
        for (let s of this.appInits) {
          let o = s()
          if (go(o)) r.push(o)
          else if (il(o)) {
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
  PC = new q('appBootstrapListener')
function OC() {
  tp(() => {
    throw new U(600, !1)
  })
}
function kC(t) {
  return t.isBoundToModule
}
function FC(t, e, n) {
  try {
    let r = n()
    return go(r)
      ? r.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i)
        })
      : r
  } catch (r) {
    throw (e.runOutsideAngular(() => t.handleError(r)), r)
  }
}
var ol = (() => {
  let e = class e {
    constructor() {
      ;(this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = ee(om)),
        (this.afterRenderEffectManager = ee(Cm)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = ee(Um).hasPendingTasks.pipe(Wn((r) => !r))),
        (this._injector = ee(on))
    }
    get destroyed() {
      return this._destroyed
    }
    get injector() {
      return this._injector
    }
    bootstrap(r, i) {
      let s = r instanceof Bs
      if (!this._injector.get(Bm).done) {
        let f = !s && $E(r),
          _ = !1
        throw new U(405, _)
      }
      let a
      s ? (a = r) : (a = this._injector.get(qu).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType)
      let c = kC(a) ? void 0 : this._injector.get(ir),
        u = i || a.selector,
        l = a.create(kt.NULL, [], u, c),
        d = l.location.nativeElement,
        h = l.injector.get(jm, null)
      return (
        h?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            Sc(this.components, l),
            h?.unregisterApplication(d)
        }),
        this._loadComponent(l),
        l
      )
    }
    tick() {
      if (this._runningTick) throw new U(101, !1)
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
      Sc(this._views, i), i.detachFromAppRef()
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r)
      let i = this._injector.get(PC, [])
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
      return this._destroyListeners.push(r), () => Sc(this._destroyListeners, r)
    }
    destroy() {
      if (this._destroyed) throw new U(406, !1)
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
function Sc(t, e) {
  let n = t.indexOf(e)
  n > -1 && t.splice(n, 1)
}
var LC = (() => {
  let e = class e {
    constructor() {
      ;(this.zone = ee(Q)), (this.applicationRef = ee(ol))
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
function VC(t) {
  return [
    { provide: Q, useFactory: t },
    {
      provide: ti,
      multi: !0,
      useFactory: () => {
        let e = ee(LC, { optional: !0 })
        return () => e.initialize()
      },
    },
    {
      provide: ti,
      multi: !0,
      useFactory: () => {
        let e = ee($C)
        return () => {
          e.initialize()
        }
      },
    },
    { provide: om, useFactory: UC },
  ]
}
function UC() {
  let t = ee(Q),
    e = ee(Et)
  return (n) => t.runOutsideAngular(() => e.handleError(n))
}
function jC(t) {
  let e = VC(() => new Q(BC(t)))
  return jg([[], e])
}
function BC(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  }
}
var $C = (() => {
  let e = class e {
    constructor() {
      ;(this.subscription = new me()),
        (this.initialized = !1),
        (this.zone = ee(Q)),
        (this.pendingTasks = ee(Um))
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
function HC() {
  return (typeof $localize < 'u' && $localize.locale) || zs
}
var al = new q('LocaleId', {
  providedIn: 'root',
  factory: () => ee(al, M.Optional | M.SkipSelf) || HC(),
})
var $m = new q('PlatformDestroyListeners')
var Ps = null
function qC(t = [], e) {
  return kt.create({
    name: e,
    providers: [
      { provide: no, useValue: 'platform' },
      { provide: $m, useValue: new Set([() => (Ps = null)]) },
      ...t,
    ],
  })
}
function zC(t = []) {
  if (Ps) return Ps
  let e = qC(t)
  return (Ps = e), OC(), GC(e), e
}
function GC(t) {
  t.get(Fu, null)?.forEach((n) => n())
}
function Hm(t) {
  try {
    let { rootComponent: e, appProviders: n, platformProviders: r } = t,
      i = zC(r),
      s = [jC(), ...(n || [])],
      a = new Gs({
        providers: s,
        parent: i,
        debugName: '',
        runEnvironmentInitializers: !1,
      }).injector,
      c = a.get(Q)
    return c.run(() => {
      a.resolveInjectorInitializers()
      let u = a.get(Et, null),
        l
      c.runOutsideAngular(() => {
        l = c.onError.subscribe({
          next: (f) => {
            u.handleError(f)
          },
        })
      })
      let d = () => a.destroy(),
        h = i.get($m)
      return (
        h.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), h.delete(d)
        }),
        FC(u, c, () => {
          let f = a.get(Bm)
          return (
            f.runInitializers(),
            f.donePromise.then(() => {
              let _ = a.get(al, zs)
              EC(_ || zs)
              let E = a.get(ol)
              return e !== void 0 && E.bootstrap(e), E
            })
          )
        })
      )
    })
  } catch (e) {
    return Promise.reject(e)
  }
}
var cl = null
function dl() {
  return cl
}
function qm(t) {
  cl || (cl = t)
}
var yo = class {},
  Ut = new q('DocumentToken')
function zm(t, e) {
  e = encodeURIComponent(e)
  for (let n of t.split(';')) {
    let r = n.indexOf('='),
      [i, s] = r == -1 ? [n, ''] : [n.slice(0, r), n.slice(r + 1)]
    if (i.trim() === e) return decodeURIComponent(s)
  }
  return null
}
function KC(t, e) {
  return new U(2100, !1)
}
var ul = class {
    createSubscription(e, n) {
      return Gu(() =>
        e.subscribe({
          next: n,
          error: (r) => {
            throw r
          },
        })
      )
    }
    dispose(e) {
      Gu(() => e.unsubscribe())
    }
  },
  ll = class {
    createSubscription(e, n) {
      return e.then(n, (r) => {
        throw r
      })
    }
    dispose(e) {}
  },
  QC = new ll(),
  YC = new ul(),
  Gm = (() => {
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
        if (go(r)) return QC
        if (il(r)) return YC
        throw KC(e, r)
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
      return new (i || e)(so(Tm, 16))
    }),
      (e.ɵpipe = tg({ name: 'async', type: e, pure: !1, standalone: !0 }))
    let t = e
    return t
  })()
var hl = (() => {
    let e = class e {}
    ;(e.ɵfac = function (i) {
      return new (i || e)()
    }),
      (e.ɵmod = hn({ type: e })),
      (e.ɵinj = dn({}))
    let t = e
    return t
  })(),
  Wm = 'browser',
  JC = 'server'
function fl(t) {
  return t === JC
}
var vo = class {}
var ml = class extends yo {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0)
    }
  },
  yl = class t extends ml {
    static makeCurrent() {
      qm(new t())
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
      let n = e0()
      return n == null ? null : t0(n)
    }
    resetBaseElement() {
      ui = null
    }
    getUserAgent() {
      return window.navigator.userAgent
    }
    getCookie(e) {
      return zm(document.cookie, e)
    }
  },
  ui = null
function e0() {
  return (
    (ui = ui || document.querySelector('base')),
    ui ? ui.getAttribute('href') : null
  )
}
function t0(t) {
  return new URL(t, document.baseURI).pathname
}
var n0 = (() => {
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
  vl = new q('EventManagerPlugins'),
  Jm = (() => {
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
          throw new U(5101, !1)
        return this._eventNameToPlugin.set(r, i), i
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(k(vl), k(Q))
    }),
      (e.ɵprov = K({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  _o = class {
    constructor(e) {
      this._doc = e
    }
  },
  pl = 'ng-app-id',
  Zm = (() => {
    let e = class e {
      constructor(r, i, s, o = {}) {
        ;(this.doc = r),
          (this.appId = i),
          (this.nonce = s),
          (this.platformId = o),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = fl(o)),
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
        let r = this.doc.head?.querySelectorAll(`style[${pl}="${this.appId}"]`)
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
        if (o?.parentNode === r) return s.delete(i), o.removeAttribute(pl), o
        {
          let a = this.doc.createElement('style')
          return (
            this.nonce && a.setAttribute('nonce', this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(pl, this.appId),
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
      return new (i || e)(k(Ut), k(ku), k(Lu, 8), k(Ft))
    }),
      (e.ɵprov = K({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  gl = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/MathML/',
  },
  Il = /%COMP%/g,
  Xm = '%COMP%',
  r0 = `_nghost-${Xm}`,
  i0 = `_ngcontent-${Xm}`,
  s0 = !0,
  o0 = new q('RemoveStylesOnCompDestroy', {
    providedIn: 'root',
    factory: () => s0,
  })
function a0(t) {
  return i0.replace(Il, t)
}
function c0(t) {
  return r0.replace(Il, t)
}
function ey(t, e) {
  return e.map((n) => n.replace(Il, t))
}
var Km = (() => {
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
          (this.platformIsServer = fl(c)),
          (this.defaultRenderer = new li(r, a, u, this.platformIsServer))
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer
        this.platformIsServer &&
          i.encapsulation === et.ShadowDom &&
          (i = yt(Ye({}, i), { encapsulation: et.Emulated }))
        let s = this.getOrCreateRenderer(r, i)
        return (
          s instanceof Io
            ? s.applyToHost(r)
            : s instanceof di && s.applyStyles(),
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
            case et.Emulated:
              o = new Io(u, l, i, this.appId, d, a, c, h)
              break
            case et.ShadowDom:
              return new _l(u, l, r, i, a, c, this.nonce, h)
            default:
              o = new di(u, l, i, d, a, c, h)
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
      return new (i || e)(k(Jm), k(Zm), k(ku), k(o0), k(Ut), k(Ft), k(Q), k(Lu))
    }),
      (e.ɵprov = K({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  li = class {
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
        ? this.doc.createElementNS(gl[n] || n, e)
        : this.doc.createElement(e)
    }
    createComment(e) {
      return this.doc.createComment(e)
    }
    createText(e) {
      return this.doc.createTextNode(e)
    }
    appendChild(e, n) {
      ;(Qm(e) ? e.content : e).appendChild(n)
    }
    insertBefore(e, n, r) {
      e && (Qm(e) ? e.content : e).insertBefore(n, r)
    }
    removeChild(e, n) {
      e && e.removeChild(n)
    }
    selectRootElement(e, n) {
      let r = typeof e == 'string' ? this.doc.querySelector(e) : e
      if (!r) throw new U(-5104, !1)
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
        let s = gl[i]
        s ? e.setAttributeNS(s, n, r) : e.setAttribute(n, r)
      } else e.setAttribute(n, r)
    }
    removeAttribute(e, n, r) {
      if (r) {
        let i = gl[r]
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
      i & (It.DashCase | It.Important)
        ? e.style.setProperty(n, r, i & It.Important ? 'important' : '')
        : (e.style[n] = r)
    }
    removeStyle(e, n, r) {
      r & It.DashCase ? e.style.removeProperty(n) : (e.style[n] = '')
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
        ((e = dl().getGlobalEventTarget(this.doc, e)), !e)
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
function Qm(t) {
  return t.tagName === 'TEMPLATE' && t.content !== void 0
}
var _l = class extends li {
    constructor(e, n, r, i, s, o, a, c) {
      super(e, s, o, c),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot)
      let u = ey(i.id, i.styles)
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
  di = class extends li {
    constructor(e, n, r, i, s, o, a, c) {
      super(e, s, o, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = c ? ey(c, r.styles) : r.styles)
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles)
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles)
    }
  },
  Io = class extends di {
    constructor(e, n, r, i, s, o, a, c) {
      let u = i + '-' + r.id
      super(e, n, r, s, o, a, c, u),
        (this.contentAttr = a0(u)),
        (this.hostAttr = c0(u))
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, '')
    }
    createElement(e, n) {
      let r = super.createElement(e, n)
      return super.setAttribute(r, this.contentAttr, ''), r
    }
  },
  u0 = (() => {
    let e = class e extends _o {
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
      return new (i || e)(k(Ut))
    }),
      (e.ɵprov = K({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  Ym = ['alt', 'control', 'meta', 'shift'],
  l0 = {
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
  d0 = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  h0 = (() => {
    let e = class e extends _o {
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
          .runOutsideAngular(() => dl().onAndCancel(r, o.domEventName, a))
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
          Ym.forEach((l) => {
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
        let s = l0[r.key] || r.key,
          o = ''
        return (
          i.indexOf('code.') > -1 && ((s = r.code), (o = 'code.')),
          s == null || !s
            ? !1
            : ((s = s.toLowerCase()),
              s === ' ' ? (s = 'space') : s === '.' && (s = 'dot'),
              Ym.forEach((a) => {
                if (a !== s) {
                  let c = d0[a]
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
      return new (i || e)(k(Ut))
    }),
      (e.ɵprov = K({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })()
function ty(t, e) {
  return Hm(Ye({ rootComponent: t }, f0(e)))
}
function f0(t) {
  return {
    appProviders: [...v0, ...(t?.providers ?? [])],
    platformProviders: y0,
  }
}
function p0() {
  yl.makeCurrent()
}
function g0() {
  return new Et()
}
function m0() {
  return qg(document), document
}
var y0 = [
  { provide: Ft, useValue: Wm },
  { provide: Fu, useValue: p0, multi: !0 },
  { provide: Ut, useFactory: m0, deps: [] },
]
var v0 = [
  { provide: no, useValue: 'root' },
  { provide: Et, useFactory: g0, deps: [] },
  { provide: vl, useClass: u0, multi: !0, deps: [Ut, Q, Ft] },
  { provide: vl, useClass: h0, multi: !0, deps: [Ut] },
  Km,
  Zm,
  Jm,
  { provide: ni, useExisting: Km },
  { provide: vo, useClass: n0, deps: [] },
  [],
]
var ry = function (t) {
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
  _0 = function (t) {
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
  iy = {
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
        : this.encodeByteArray(ry(t), e)
    },
    decodeString(t, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? atob(t)
        : _0(this.decodeStringToByteArray(t, e))
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
          throw new wl()
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
  wl = class extends Error {
    constructor() {
      super(...arguments), (this.name = 'DecodeBase64StringError')
    }
  },
  I0 = function (t) {
    let e = ry(t)
    return iy.encodeByteArray(e, !0)
  },
  hi = function (t) {
    return I0(t).replace(/\./g, '')
  },
  Tl = function (t) {
    try {
      return iy.decodeString(t, !0)
    } catch (e) {
      console.error('base64Decode failed: ', e)
    }
    return null
  }
function E0() {
  if (typeof self < 'u') return self
  if (typeof window < 'u') return window
  if (typeof global < 'u') return global
  throw new Error('Unable to locate global object.')
}
var w0 = () => E0().__FIREBASE_DEFAULTS__,
  D0 = () => {
    if (typeof process > 'u' || typeof process.env > 'u') return
    let t = process.env.__FIREBASE_DEFAULTS__
    if (t) return JSON.parse(t)
  },
  T0 = () => {
    if (typeof document > 'u') return
    let t
    try {
      t = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)
    } catch {
      return
    }
    let e = t && Tl(t[1])
    return e && JSON.parse(e)
  },
  wo = () => {
    try {
      return w0() || D0() || T0()
    } catch (t) {
      console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`)
      return
    }
  },
  sy = (t) => {
    var e, n
    return (n =
      (e = wo()) === null || e === void 0 ? void 0 : e.emulatorHosts) ===
      null || n === void 0
      ? void 0
      : n[t]
  },
  oy = (t) => {
    let e = sy(t)
    if (!e) return
    let n = e.lastIndexOf(':')
    if (n <= 0 || n + 1 === e.length)
      throw new Error(`Invalid host ${e} with no separate hostname and port!`)
    let r = parseInt(e.substring(n + 1), 10)
    return e[0] === '[' ? [e.substring(1, n - 1), r] : [e.substring(0, n), r]
  },
  Cl = () => {
    var t
    return (t = wo()) === null || t === void 0 ? void 0 : t.config
  },
  ay = (t) => {
    var e
    return (e = wo()) === null || e === void 0 ? void 0 : e[`_${t}`]
  }
var Eo = class {
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
function cy(t, e) {
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
  return [hi(JSON.stringify(n)), hi(JSON.stringify(o)), ''].join('.')
}
function _e() {
  return typeof navigator < 'u' && typeof navigator.userAgent == 'string'
    ? navigator.userAgent
    : ''
}
function uy() {
  return (
    typeof window < 'u' &&
    !!(window.cordova || window.phonegap || window.PhoneGap) &&
    /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(_e())
  )
}
function C0() {
  var t
  let e = (t = wo()) === null || t === void 0 ? void 0 : t.forceEnvironment
  if (e === 'node') return !0
  if (e === 'browser') return !1
  try {
    return Object.prototype.toString.call(global.process) === '[object process]'
  } catch {
    return !1
  }
}
function ly() {
  let t =
    typeof chrome == 'object'
      ? chrome.runtime
      : typeof browser == 'object'
        ? browser.runtime
        : void 0
  return typeof t == 'object' && t.id !== void 0
}
function dy() {
  return typeof navigator == 'object' && navigator.product === 'ReactNative'
}
function hy() {
  return (
    !C0() &&
    navigator.userAgent.includes('Safari') &&
    !navigator.userAgent.includes('Chrome')
  )
}
function Do() {
  try {
    return typeof indexedDB == 'object'
  } catch {
    return !1
  }
}
function fy() {
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
var b0 = 'FirebaseError',
  ke = class t extends Error {
    constructor(e, n, r) {
      super(n),
        (this.code = e),
        (this.customData = r),
        (this.name = b0),
        Object.setPrototypeOf(this, t.prototype),
        Error.captureStackTrace &&
          Error.captureStackTrace(this, Ct.prototype.create)
    }
  },
  Ct = class {
    constructor(e, n, r) {
      ;(this.service = e), (this.serviceName = n), (this.errors = r)
    }
    create(e, ...n) {
      let r = n[0] || {},
        i = `${this.service}/${e}`,
        s = this.errors[e],
        o = s ? A0(s, r) : 'Error',
        a = `${this.serviceName}: ${o} (${i}).`
      return new ke(i, a, r)
    }
  }
function A0(t, e) {
  return t.replace(S0, (n, r) => {
    let i = e[r]
    return i != null ? String(i) : `<${r}?>`
  })
}
var S0 = /\{\$([^}]+)}/g
function or(t, e) {
  if (t === e) return !0
  let n = Object.keys(t),
    r = Object.keys(e)
  for (let i of n) {
    if (!r.includes(i)) return !1
    let s = t[i],
      o = e[i]
    if (ny(s) && ny(o)) {
      if (!or(s, o)) return !1
    } else if (s !== o) return !1
  }
  for (let i of r) if (!n.includes(i)) return !1
  return !0
}
function ny(t) {
  return t !== null && typeof t == 'object'
}
function bl(t) {
  let e = []
  for (let [n, r] of Object.entries(t))
    Array.isArray(r)
      ? r.forEach((i) => {
          e.push(encodeURIComponent(n) + '=' + encodeURIComponent(i))
        })
      : e.push(encodeURIComponent(n) + '=' + encodeURIComponent(r))
  return e.length ? '&' + e.join('&') : ''
}
function py(t, e) {
  let n = new Dl(t, e)
  return n.subscribe.bind(n)
}
var Dl = class {
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
    N0(e, ['next', 'error', 'complete'])
      ? (i = e)
      : (i = { next: e, error: n, complete: r }),
      i.next === void 0 && (i.next = El),
      i.error === void 0 && (i.error = El),
      i.complete === void 0 && (i.complete = El)
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
function N0(t, e) {
  if (typeof t != 'object' || t === null) return !1
  for (let n of e) if (n in t && typeof t[n] == 'function') return !0
  return !1
}
function El() {}
var AO = 4 * 60 * 60 * 1e3
function jt(t) {
  return t && t._delegate ? t._delegate : t
}
var Fe = class {
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
var yn = '[DEFAULT]'
var Al = class {
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
      let r = new Eo()
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
      if (x0(e))
        try {
          this.getOrInitializeService({ instanceIdentifier: yn })
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
  clearInstance(e = yn) {
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
  isInitialized(e = yn) {
    return this.instances.has(e)
  }
  getOptions(e = yn) {
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
        instanceIdentifier: R0(e),
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
  normalizeInstanceIdentifier(e = yn) {
    return this.component ? (this.component.multipleInstances ? e : yn) : e
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== 'EXPLICIT'
  }
}
function R0(t) {
  return t === yn ? void 0 : t
}
function x0(t) {
  return t.instantiationMode === 'EAGER'
}
var To = class {
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
    let n = new Al(e, this)
    return this.providers.set(e, n), n
  }
  getProviders() {
    return Array.from(this.providers.values())
  }
}
var M0 = [],
  x = (function (t) {
    return (
      (t[(t.DEBUG = 0)] = 'DEBUG'),
      (t[(t.VERBOSE = 1)] = 'VERBOSE'),
      (t[(t.INFO = 2)] = 'INFO'),
      (t[(t.WARN = 3)] = 'WARN'),
      (t[(t.ERROR = 4)] = 'ERROR'),
      (t[(t.SILENT = 5)] = 'SILENT'),
      t
    )
  })(x || {}),
  P0 = {
    debug: x.DEBUG,
    verbose: x.VERBOSE,
    info: x.INFO,
    warn: x.WARN,
    error: x.ERROR,
    silent: x.SILENT,
  },
  O0 = x.INFO,
  k0 = {
    [x.DEBUG]: 'log',
    [x.VERBOSE]: 'log',
    [x.INFO]: 'info',
    [x.WARN]: 'warn',
    [x.ERROR]: 'error',
  },
  F0 = (t, e, ...n) => {
    if (e < t.logLevel) return
    let r = new Date().toISOString(),
      i = k0[e]
    if (i) console[i](`[${r}]  ${t.name}:`, ...n)
    else
      throw new Error(
        `Attempted to log a message with an invalid logType (value: ${e})`
      )
  },
  Bt = class {
    constructor(e) {
      ;(this.name = e),
        (this._logLevel = O0),
        (this._logHandler = F0),
        (this._userLogHandler = null),
        M0.push(this)
    }
    get logLevel() {
      return this._logLevel
    }
    set logLevel(e) {
      if (!(e in x))
        throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``)
      this._logLevel = e
    }
    setLogLevel(e) {
      this._logLevel = typeof e == 'string' ? P0[e] : e
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
      this._userLogHandler && this._userLogHandler(this, x.DEBUG, ...e),
        this._logHandler(this, x.DEBUG, ...e)
    }
    log(...e) {
      this._userLogHandler && this._userLogHandler(this, x.VERBOSE, ...e),
        this._logHandler(this, x.VERBOSE, ...e)
    }
    info(...e) {
      this._userLogHandler && this._userLogHandler(this, x.INFO, ...e),
        this._logHandler(this, x.INFO, ...e)
    }
    warn(...e) {
      this._userLogHandler && this._userLogHandler(this, x.WARN, ...e),
        this._logHandler(this, x.WARN, ...e)
    }
    error(...e) {
      this._userLogHandler && this._userLogHandler(this, x.ERROR, ...e),
        this._logHandler(this, x.ERROR, ...e)
    }
  }
var L0 = (t, e) => e.some((n) => t instanceof n),
  gy,
  my
function V0() {
  return (
    gy ||
    (gy = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
  )
}
function U0() {
  return (
    my ||
    (my = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey,
    ])
  )
}
var yy = new WeakMap(),
  Nl = new WeakMap(),
  vy = new WeakMap(),
  Sl = new WeakMap(),
  xl = new WeakMap()
function j0(t) {
  let e = new Promise((n, r) => {
    let i = () => {
        t.removeEventListener('success', s), t.removeEventListener('error', o)
      },
      s = () => {
        n(at(t.result)), i()
      },
      o = () => {
        r(t.error), i()
      }
    t.addEventListener('success', s), t.addEventListener('error', o)
  })
  return (
    e
      .then((n) => {
        n instanceof IDBCursor && yy.set(n, t)
      })
      .catch(() => {}),
    xl.set(e, t),
    e
  )
}
function B0(t) {
  if (Nl.has(t)) return
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
  Nl.set(t, e)
}
var Rl = {
  get(t, e, n) {
    if (t instanceof IDBTransaction) {
      if (e === 'done') return Nl.get(t)
      if (e === 'objectStoreNames') return t.objectStoreNames || vy.get(t)
      if (e === 'store')
        return n.objectStoreNames[1]
          ? void 0
          : n.objectStore(n.objectStoreNames[0])
    }
    return at(t[e])
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
function _y(t) {
  Rl = t(Rl)
}
function $0(t) {
  return t === IDBDatabase.prototype.transaction &&
    !('objectStoreNames' in IDBTransaction.prototype)
    ? function (e, ...n) {
        let r = t.call(Co(this), e, ...n)
        return vy.set(r, e.sort ? e.sort() : [e]), at(r)
      }
    : U0().includes(t)
      ? function (...e) {
          return t.apply(Co(this), e), at(yy.get(this))
        }
      : function (...e) {
          return at(t.apply(Co(this), e))
        }
}
function H0(t) {
  return typeof t == 'function'
    ? $0(t)
    : (t instanceof IDBTransaction && B0(t), L0(t, V0()) ? new Proxy(t, Rl) : t)
}
function at(t) {
  if (t instanceof IDBRequest) return j0(t)
  if (Sl.has(t)) return Sl.get(t)
  let e = H0(t)
  return e !== t && (Sl.set(t, e), xl.set(e, t)), e
}
var Co = (t) => xl.get(t)
function Ey(t, e, { blocked: n, upgrade: r, blocking: i, terminated: s } = {}) {
  let o = indexedDB.open(t, e),
    a = at(o)
  return (
    r &&
      o.addEventListener('upgradeneeded', (c) => {
        r(at(o.result), c.oldVersion, c.newVersion, at(o.transaction), c)
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
var q0 = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
  z0 = ['put', 'add', 'delete', 'clear'],
  Ml = new Map()
function Iy(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == 'string')) return
  if (Ml.get(e)) return Ml.get(e)
  let n = e.replace(/FromIndex$/, ''),
    r = e !== n,
    i = z0.includes(n)
  if (
    !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
    !(i || q0.includes(n))
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
  return Ml.set(e, s), s
}
_y((t) =>
  yt(Ye({}, t), {
    get: (e, n, r) => Iy(e, n) || t.get(e, n, r),
    has: (e, n) => !!Iy(e, n) || t.has(e, n),
  })
)
var Ol = class {
  constructor(e) {
    this.container = e
  }
  getPlatformInfoString() {
    return this.container
      .getProviders()
      .map((n) => {
        if (G0(n)) {
          let r = n.getImmediate()
          return `${r.library}/${r.version}`
        } else return null
      })
      .filter((n) => n)
      .join(' ')
  }
}
function G0(t) {
  let e = t.getComponent()
  return e?.type === 'VERSION'
}
var kl = '@firebase/app',
  wy = '0.9.26'
var vn = new Bt('@firebase/app'),
  W0 = '@firebase/app-compat',
  K0 = '@firebase/analytics-compat',
  Q0 = '@firebase/analytics',
  Y0 = '@firebase/app-check-compat',
  J0 = '@firebase/app-check',
  Z0 = '@firebase/auth',
  X0 = '@firebase/auth-compat',
  eb = '@firebase/database',
  tb = '@firebase/database-compat',
  nb = '@firebase/functions',
  rb = '@firebase/functions-compat',
  ib = '@firebase/installations',
  sb = '@firebase/installations-compat',
  ob = '@firebase/messaging',
  ab = '@firebase/messaging-compat',
  cb = '@firebase/performance',
  ub = '@firebase/performance-compat',
  lb = '@firebase/remote-config',
  db = '@firebase/remote-config-compat',
  hb = '@firebase/storage',
  fb = '@firebase/storage-compat',
  pb = '@firebase/firestore',
  gb = '@firebase/firestore-compat',
  mb = 'firebase',
  yb = '10.7.2'
var Fl = '[DEFAULT]',
  vb = {
    [kl]: 'fire-core',
    [W0]: 'fire-core-compat',
    [Q0]: 'fire-analytics',
    [K0]: 'fire-analytics-compat',
    [J0]: 'fire-app-check',
    [Y0]: 'fire-app-check-compat',
    [Z0]: 'fire-auth',
    [X0]: 'fire-auth-compat',
    [eb]: 'fire-rtdb',
    [tb]: 'fire-rtdb-compat',
    [nb]: 'fire-fn',
    [rb]: 'fire-fn-compat',
    [ib]: 'fire-iid',
    [sb]: 'fire-iid-compat',
    [ob]: 'fire-fcm',
    [ab]: 'fire-fcm-compat',
    [cb]: 'fire-perf',
    [ub]: 'fire-perf-compat',
    [lb]: 'fire-rc',
    [db]: 'fire-rc-compat',
    [hb]: 'fire-gcs',
    [fb]: 'fire-gcs-compat',
    [pb]: 'fire-fst',
    [gb]: 'fire-fst-compat',
    'fire-js': 'fire-js',
    [mb]: 'fire-js-all',
  }
var fi = new Map(),
  Ll = new Map()
function _b(t, e) {
  try {
    t.container.addComponent(e)
  } catch (n) {
    vn.debug(
      `Component ${e.name} failed to register with FirebaseApp ${t.name}`,
      n
    )
  }
}
function Ht(t) {
  let e = t.name
  if (Ll.has(e))
    return (
      vn.debug(`There were multiple attempts to register component ${e}.`), !1
    )
  Ll.set(e, t)
  for (let n of fi.values()) _b(n, t)
  return !0
}
function Bl(t, e) {
  let n = t.container.getProvider('heartbeat').getImmediate({ optional: !0 })
  return n && n.triggerHeartbeat(), t.container.getProvider(e)
}
var Ib = {
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
  $t = new Ct('app', 'Firebase', Ib)
var Vl = class {
  constructor(e, n, r) {
    ;(this._isDeleted = !1),
      (this._options = Object.assign({}, e)),
      (this._config = Object.assign({}, n)),
      (this._name = n.name),
      (this._automaticDataCollectionEnabled = n.automaticDataCollectionEnabled),
      (this._container = r),
      this.container.addComponent(new Fe('app', () => this, 'PUBLIC'))
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
    if (this.isDeleted) throw $t.create('app-deleted', { appName: this._name })
  }
}
var ar = yb
function $l(t, e = {}) {
  let n = t
  typeof e != 'object' && (e = { name: e })
  let r = Object.assign({ name: Fl, automaticDataCollectionEnabled: !1 }, e),
    i = r.name
  if (typeof i != 'string' || !i)
    throw $t.create('bad-app-name', { appName: String(i) })
  if ((n || (n = Cl()), !n)) throw $t.create('no-options')
  let s = fi.get(i)
  if (s) {
    if (or(n, s.options) && or(r, s.config)) return s
    throw $t.create('duplicate-app', { appName: i })
  }
  let o = new To(i)
  for (let c of Ll.values()) o.addComponent(c)
  let a = new Vl(n, r, o)
  return fi.set(i, a), a
}
function gi(t = Fl) {
  let e = fi.get(t)
  if (!e && t === Fl && Cl()) return $l()
  if (!e) throw $t.create('no-app', { appName: t })
  return e
}
function bo() {
  return Array.from(fi.values())
}
function ce(t, e, n) {
  var r
  let i = (r = vb[t]) !== null && r !== void 0 ? r : t
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
      vn.warn(a.join(' '))
    return
  }
  Ht(new Fe(`${i}-version`, () => ({ library: i, version: e }), 'VERSION'))
}
var Eb = 'firebase-heartbeat-database',
  wb = 1,
  pi = 'firebase-heartbeat-store',
  Pl = null
function by() {
  return (
    Pl ||
      (Pl = Ey(Eb, wb, {
        upgrade: (t, e) => {
          switch (e) {
            case 0:
              try {
                t.createObjectStore(pi)
              } catch (n) {
                console.warn(n)
              }
          }
        },
      }).catch((t) => {
        throw $t.create('idb-open', { originalErrorMessage: t.message })
      })),
    Pl
  )
}
function Db(t) {
  return p(this, null, function* () {
    try {
      return yield (yield by()).transaction(pi).objectStore(pi).get(Ay(t))
    } catch (e) {
      if (e instanceof ke) vn.warn(e.message)
      else {
        let n = $t.create('idb-get', { originalErrorMessage: e?.message })
        vn.warn(n.message)
      }
    }
  })
}
function Dy(t, e) {
  return p(this, null, function* () {
    try {
      let r = (yield by()).transaction(pi, 'readwrite')
      yield r.objectStore(pi).put(e, Ay(t)), yield r.done
    } catch (n) {
      if (n instanceof ke) vn.warn(n.message)
      else {
        let r = $t.create('idb-set', { originalErrorMessage: n?.message })
        vn.warn(r.message)
      }
    }
  })
}
function Ay(t) {
  return `${t.name}!${t.options.appId}`
}
var Tb = 1024,
  Cb = 30 * 24 * 60 * 60 * 1e3,
  Ul = class {
    constructor(e) {
      ;(this.container = e), (this._heartbeatsCache = null)
      let n = this.container.getProvider('app').getImmediate()
      ;(this._storage = new jl(n)),
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
          s = Ty()
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
                return Date.now() - a <= Cb
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
        let n = Ty(),
          { heartbeatsToSend: r, unsentEntries: i } = bb(
            this._heartbeatsCache.heartbeats
          ),
          s = hi(JSON.stringify({ version: 2, heartbeats: r }))
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
function Ty() {
  return new Date().toISOString().substring(0, 10)
}
function bb(t, e = Tb) {
  let n = [],
    r = t.slice()
  for (let i of t) {
    let s = n.find((o) => o.agent === i.agent)
    if (s) {
      if ((s.dates.push(i.date), Cy(n) > e)) {
        s.dates.pop()
        break
      }
    } else if ((n.push({ agent: i.agent, dates: [i.date] }), Cy(n) > e)) {
      n.pop()
      break
    }
    r = r.slice(1)
  }
  return { heartbeatsToSend: n, unsentEntries: r }
}
var jl = class {
  constructor(e) {
    ;(this.app = e),
      (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck())
  }
  runIndexedDBEnvironmentCheck() {
    return p(this, null, function* () {
      return Do()
        ? fy()
            .then(() => !0)
            .catch(() => !1)
        : !1
    })
  }
  read() {
    return p(this, null, function* () {
      if (yield this._canUseIndexedDBPromise) {
        let n = yield Db(this.app)
        return n?.heartbeats ? n : { heartbeats: [] }
      } else return { heartbeats: [] }
    })
  }
  overwrite(e) {
    return p(this, null, function* () {
      var n
      if (yield this._canUseIndexedDBPromise) {
        let i = yield this.read()
        return Dy(this.app, {
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
        return Dy(this.app, {
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
function Cy(t) {
  return hi(JSON.stringify({ version: 2, heartbeats: t })).length
}
function Ab(t) {
  Ht(new Fe('platform-logger', (e) => new Ol(e), 'PRIVATE')),
    Ht(new Fe('heartbeat', (e) => new Ul(e), 'PRIVATE')),
    ce(kl, wy, t),
    ce(kl, wy, 'esm2017'),
    ce('fire-js', '')
}
Ab('')
var Sb = 'firebase',
  Nb = '10.7.2'
ce(Sb, Nb, 'app')
var ur = new ln('ANGULARFIRE2_VERSION')
function ql(t, e, n) {
  if (e) {
    if (e.length === 1) return e[0]
    let s = e.filter((o) => o.app === n)
    if (s.length === 1) return s[0]
  }
  return n.container.getProvider(t).getImmediate({ optional: !0 })
}
var yi = (t, e) => {
    let n = e ? [e] : bo(),
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
  mi = class {
    constructor() {
      return yi(Rb)
    }
  },
  Rb = 'app-check'
function cr() {}
var Ao = class {
    zone
    delegate
    constructor(e, n = fc) {
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
  Hl = class {
    zone
    task = null
    constructor(e) {
      this.zone = e
    }
    call(e, n) {
      let r = this.unscheduleTask.bind(this)
      return (
        (this.task = this.zone.run(() =>
          Zone.current.scheduleMacroTask('firebaseZoneBlock', cr, {}, cr, cr)
        )),
        n
          .pipe(Kn({ next: r, complete: r, error: r }))
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
  vi = (() => {
    class t {
      ngZone
      outsideAngular
      insideAngular
      constructor(n) {
        ;(this.ngZone = n),
          (this.outsideAngular = n.runOutsideAngular(
            () => new Ao(Zone.current)
          )),
          (this.insideAngular = n.run(() => new Ao(Zone.current, hc))),
          (globalThis.ɵAngularFireScheduler ||= this)
      }
      static ɵfac = function (r) {
        return new (r || t)(k(Q))
      }
      static ɵprov = K({ token: t, factory: t.ɵfac, providedIn: 'root' })
    }
    return t
  })()
function So() {
  let t = globalThis.ɵAngularFireScheduler
  if (!t)
    throw new Error(`Either AngularFireModule has not been provided in your AppModule (this can be done manually or implictly using
provideFirebaseApp) or you're calling an AngularFire method outside of an NgModule (which is not supported).`)
  return t
}
function xb(t) {
  return So().ngZone.runOutsideAngular(() => t())
}
function _n(t) {
  return So().ngZone.run(() => t())
}
function Mb(t) {
  return Pb(So())(t)
}
function Pb(t) {
  return function (n) {
    return (
      (n = n.lift(new Hl(t.ngZone))),
      n.pipe(bs(t.outsideAngular), Cs(t.insideAngular))
    )
  }
}
var Ob = (t, e) =>
    function () {
      let r = arguments
      return (
        e &&
          setTimeout(() => {
            e.state === 'scheduled' && e.invoke()
          }, 10),
        _n(() => t.apply(void 0, r))
      )
    },
  In = (t, e) =>
    function () {
      let n,
        r = arguments
      for (let s = 0; s < arguments.length; s++)
        typeof r[s] == 'function' &&
          (e &&
            (n ||= _n(() =>
              Zone.current.scheduleMacroTask(
                'firebaseZoneBlock',
                cr,
                {},
                cr,
                cr
              )
            )),
          (r[s] = Ob(r[s], n)))
      let i = xb(() => t.apply(this, r))
      if (!e)
        if (i instanceof je) {
          let s = So()
          return i.pipe(bs(s.outsideAngular), Cs(s.insideAngular))
        } else return _n(() => i)
      return i instanceof je
        ? i.pipe(Mb)
        : i instanceof Promise
          ? _n(
              () =>
                new Promise((s, o) =>
                  i.then(
                    (a) => _n(() => s(a)),
                    (a) => _n(() => o(a))
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
            : _n(() => i)
    }
var En = class {
    constructor(e) {
      return e
    }
  },
  _i = class {
    constructor() {
      return bo()
    }
  }
function kb(t) {
  return t && t.length === 1 ? t[0] : new En(gi())
}
var zl = new q('angularfire2._apps'),
  Fb = { provide: En, useFactory: kb, deps: [[new Dt(), zl]] },
  Lb = { provide: _i, deps: [[new Dt(), zl]] }
function Vb(t) {
  return (e, n) => {
    let r = e.runOutsideAngular(() => t(n))
    return new En(r)
  }
}
var Ub = (() => {
  class t {
    constructor(n) {
      ce('angularfire', ur.full, 'core'),
        ce('angularfire', ur.full, 'app'),
        ce('angular', Vm.full, n.toString())
    }
    static ɵfac = function (r) {
      return new (r || t)(k(Ft))
    }
    static ɵmod = hn({ type: t })
    static ɵinj = dn({ providers: [Fb, Lb] })
  }
  return t
})()
function Sy(t, ...e) {
  return {
    ngModule: Ub,
    providers: [
      { provide: zl, useFactory: Vb(t), multi: !0, deps: [Q, kt, vi, ...e] },
    ],
  }
}
var Ny = In($l, !0)
function Fy() {
  return {
    'dependent-sdk-initialized-before-auth':
      'Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.',
  }
}
var Ly = Fy,
  Vy = new Ct('auth', 'Firebase', Fy())
var xo = new Bt('@firebase/auth')
function Bb(t, ...e) {
  xo.logLevel <= x.WARN && xo.warn(`Auth (${ar}): ${t}`, ...e)
}
function Ro(t, ...e) {
  xo.logLevel <= x.ERROR && xo.error(`Auth (${ar}): ${t}`, ...e)
}
function Ry(t, ...e) {
  throw nd(t, ...e)
}
function Uy(t, ...e) {
  return nd(t, ...e)
}
function $b(t, e, n) {
  let r = Object.assign(Object.assign({}, Ly()), { [e]: n })
  return new Ct('auth', 'Firebase', r).create(e, { appName: t.name })
}
function nd(t, ...e) {
  if (typeof t != 'string') {
    let n = e[0],
      r = [...e.slice(1)]
    return r[0] && (r[0].appName = t.name), t._errorFactory.create(n, ...r)
  }
  return Vy.create(t, ...e)
}
function j(t, e, ...n) {
  if (!t) throw nd(e, ...n)
}
function Ii(t) {
  let e = 'INTERNAL ASSERTION FAILED: ' + t
  throw (Ro(e), new Error(e))
}
function Mo(t, e) {
  t || Ii(e)
}
function Hb() {
  return xy() === 'http:' || xy() === 'https:'
}
function xy() {
  var t
  return (
    (typeof self < 'u' &&
      ((t = self.location) === null || t === void 0 ? void 0 : t.protocol)) ||
    null
  )
}
function qb() {
  return typeof navigator < 'u' &&
    navigator &&
    'onLine' in navigator &&
    typeof navigator.onLine == 'boolean' &&
    (Hb() || ly() || 'connection' in navigator)
    ? navigator.onLine
    : !0
}
function zb() {
  if (typeof navigator > 'u') return null
  let t = navigator
  return (t.languages && t.languages[0]) || t.language || null
}
var Dn = class {
  constructor(e, n) {
    ;(this.shortDelay = e),
      (this.longDelay = n),
      Mo(n > e, 'Short delay should be less than long delay!'),
      (this.isMobile = uy() || dy())
  }
  get() {
    return qb()
      ? this.isMobile
        ? this.longDelay
        : this.shortDelay
      : Math.min(5e3, this.shortDelay)
  }
}
function Gb(t, e) {
  Mo(t.emulator, 'Emulator should always be set here')
  let { url: n } = t.emulator
  return e ? `${n}${e.startsWith('/') ? e.slice(1) : e}` : n
}
var Po = class {
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
    Ii(
      'Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    )
  }
  static headers() {
    if (this.headersImpl) return this.headersImpl
    if (typeof self < 'u' && 'Headers' in self) return self.Headers
    if (typeof globalThis < 'u' && globalThis.Headers) return globalThis.Headers
    if (typeof Headers < 'u') return Headers
    Ii(
      'Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    )
  }
  static response() {
    if (this.responseImpl) return this.responseImpl
    if (typeof self < 'u' && 'Response' in self) return self.Response
    if (typeof globalThis < 'u' && globalThis.Response)
      return globalThis.Response
    if (typeof Response < 'u') return Response
    Ii(
      'Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    )
  }
}
var Wb = {
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
var Kb = new Dn(3e4, 6e4)
function jy(t, e) {
  return t.tenantId && !e.tenantId
    ? Object.assign(Object.assign({}, e), { tenantId: t.tenantId })
    : e
}
function jo(s, o, a, c) {
  return p(this, arguments, function* (t, e, n, r, i = {}) {
    return By(t, i, () =>
      p(this, null, function* () {
        let u = {},
          l = {}
        r && (e === 'GET' ? (l = r) : (u = { body: JSON.stringify(r) }))
        let d = bl(Object.assign({ key: t.config.apiKey }, l)).slice(1),
          h = yield t._getAdditionalHeaders()
        return (
          (h['Content-Type'] = 'application/json'),
          t.languageCode && (h['X-Firebase-Locale'] = t.languageCode),
          Po.fetch()(
            $y(t, t.config.apiHost, n, d),
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
function By(t, e, n) {
  return p(this, null, function* () {
    t._canInitEmulator = !1
    let r = Object.assign(Object.assign({}, Wb), e)
    try {
      let i = new Kl(t),
        s = yield Promise.race([n(), i.promise])
      i.clearNetworkTimeout()
      let o = yield s.json()
      if ('needConfirmation' in o)
        throw No(t, 'account-exists-with-different-credential', o)
      if (s.ok && !('errorMessage' in o)) return o
      {
        let a = s.ok ? o.errorMessage : o.error.message,
          [c, u] = a.split(' : ')
        if (c === 'FEDERATED_USER_ID_ALREADY_LINKED')
          throw No(t, 'credential-already-in-use', o)
        if (c === 'EMAIL_EXISTS') throw No(t, 'email-already-in-use', o)
        if (c === 'USER_DISABLED') throw No(t, 'user-disabled', o)
        let l = r[c] || c.toLowerCase().replace(/[_\s]+/g, '-')
        if (u) throw $b(t, l, u)
        Ry(t, l)
      }
    } catch (i) {
      if (i instanceof ke) throw i
      Ry(t, 'network-request-failed', { message: String(i) })
    }
  })
}
function $y(t, e, n, r) {
  let i = `${e}${n}?${r}`
  return t.config.emulator ? Gb(t.config, i) : `${t.config.apiScheme}://${i}`
}
var Kl = class {
  constructor(e) {
    ;(this.auth = e),
      (this.timer = null),
      (this.promise = new Promise((n, r) => {
        this.timer = setTimeout(
          () => r(Uy(this.auth, 'network-request-failed')),
          Kb.get()
        )
      }))
  }
  clearNetworkTimeout() {
    clearTimeout(this.timer)
  }
}
function No(t, e, n) {
  let r = { appName: t.name }
  n.email && (r.email = n.email),
    n.phoneNumber && (r.phoneNumber = n.phoneNumber)
  let i = Uy(t, e, r)
  return (i.customData._tokenResponse = n), i
}
function Qb(t, e) {
  return p(this, null, function* () {
    return jo(t, 'POST', '/v1/accounts:delete', e)
  })
}
function Yb(t, e) {
  return p(this, null, function* () {
    return jo(t, 'POST', '/v1/accounts:lookup', e)
  })
}
function Ei(t) {
  if (t)
    try {
      let e = new Date(Number(t))
      if (!isNaN(e.getTime())) return e.toUTCString()
    } catch {}
}
function rd(t, e = !1) {
  return p(this, null, function* () {
    let n = jt(t),
      r = yield n.getIdToken(e),
      i = Hy(r)
    j(i && i.exp && i.auth_time && i.iat, n.auth, 'internal-error')
    let s = typeof i.firebase == 'object' ? i.firebase : void 0,
      o = s?.sign_in_provider
    return {
      claims: i,
      token: r,
      authTime: Ei(Gl(i.auth_time)),
      issuedAtTime: Ei(Gl(i.iat)),
      expirationTime: Ei(Gl(i.exp)),
      signInProvider: o || null,
      signInSecondFactor: s?.sign_in_second_factor || null,
    }
  })
}
function Gl(t) {
  return Number(t) * 1e3
}
function Hy(t) {
  let [e, n, r] = t.split('.')
  if (e === void 0 || n === void 0 || r === void 0)
    return Ro('JWT malformed, contained fewer than 3 sections'), null
  try {
    let i = Tl(n)
    return i ? JSON.parse(i) : (Ro('Failed to decode base64 JWT payload'), null)
  } catch (i) {
    return Ro('Caught error parsing JWT payload as JSON', i?.toString()), null
  }
}
function Jb(t) {
  let e = Hy(t)
  return (
    j(e, 'internal-error'),
    j(typeof e.exp < 'u', 'internal-error'),
    j(typeof e.iat < 'u', 'internal-error'),
    Number(e.exp) - Number(e.iat)
  )
}
function Ql(t, e, n = !1) {
  return p(this, null, function* () {
    if (n) return e
    try {
      return yield e
    } catch (r) {
      throw (
        (r instanceof ke &&
          Zb(r) &&
          t.auth.currentUser === t &&
          (yield t.auth.signOut()),
        r)
      )
    }
  })
}
function Zb({ code: t }) {
  return t === 'auth/user-disabled' || t === 'auth/user-token-expired'
}
var Yl = class {
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
var Oo = class {
  constructor(e, n) {
    ;(this.createdAt = e), (this.lastLoginAt = n), this._initializeTime()
  }
  _initializeTime() {
    ;(this.lastSignInTime = Ei(this.lastLoginAt)),
      (this.creationTime = Ei(this.createdAt))
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
function ko(t) {
  return p(this, null, function* () {
    var e
    let n = t.auth,
      r = yield t.getIdToken(),
      i = yield Ql(t, Yb(n, { idToken: r }))
    j(i?.users.length, n, 'internal-error')
    let s = i.users[0]
    t._notifyReloadListener(s)
    let o =
        !((e = s.providerUserInfo) === null || e === void 0) && e.length
          ? eA(s.providerUserInfo)
          : [],
      a = Xb(t.providerData, o),
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
        metadata: new Oo(s.createdAt, s.lastLoginAt),
        isAnonymous: l,
      }
    Object.assign(t, d)
  })
}
function id(t) {
  return p(this, null, function* () {
    let e = jt(t)
    yield ko(e),
      yield e.auth._persistUserIfCurrent(e),
      e.auth._notifyListenersIfCurrent(e)
  })
}
function Xb(t, e) {
  return [
    ...t.filter((r) => !e.some((i) => i.providerId === r.providerId)),
    ...e,
  ]
}
function eA(t) {
  return t.map((e) => {
    var { providerId: n } = e,
      r = pc(e, ['providerId'])
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
function tA(t, e) {
  return p(this, null, function* () {
    let n = yield By(t, {}, () =>
      p(this, null, function* () {
        let r = bl({ grant_type: 'refresh_token', refresh_token: e }).slice(1),
          { tokenApiHost: i, apiKey: s } = t.config,
          o = $y(t, i, '/v1/token', `key=${s}`),
          a = yield t._getAdditionalHeaders()
        return (
          (a['Content-Type'] = 'application/x-www-form-urlencoded'),
          Po.fetch()(o, { method: 'POST', headers: a, body: r })
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
function nA(t, e) {
  return p(this, null, function* () {
    return jo(t, 'POST', '/v2/accounts:revokeToken', jy(t, e))
  })
}
var Fo = class t {
  constructor() {
    ;(this.refreshToken = null),
      (this.accessToken = null),
      (this.expirationTime = null)
  }
  get isExpired() {
    return !this.expirationTime || Date.now() > this.expirationTime - 3e4
  }
  updateFromServerResponse(e) {
    j(e.idToken, 'internal-error'),
      j(typeof e.idToken < 'u', 'internal-error'),
      j(typeof e.refreshToken < 'u', 'internal-error')
    let n =
      'expiresIn' in e && typeof e.expiresIn < 'u'
        ? Number(e.expiresIn)
        : Jb(e.idToken)
    this.updateTokensAndExpiration(e.idToken, e.refreshToken, n)
  }
  getToken(e, n = !1) {
    return p(this, null, function* () {
      return (
        j(!this.accessToken || this.refreshToken, e, 'user-token-expired'),
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
      let { accessToken: r, refreshToken: i, expiresIn: s } = yield tA(e, n)
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
        (j(typeof r == 'string', 'internal-error', { appName: e }),
        (o.refreshToken = r)),
      i &&
        (j(typeof i == 'string', 'internal-error', { appName: e }),
        (o.accessToken = i)),
      s &&
        (j(typeof s == 'number', 'internal-error', { appName: e }),
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
    return Ii('not implemented')
  }
}
function qt(t, e) {
  j(typeof t == 'string' || typeof t > 'u', 'internal-error', { appName: e })
}
var Lo = class t {
  constructor(e) {
    var { uid: n, auth: r, stsTokenManager: i } = e,
      s = pc(e, ['uid', 'auth', 'stsTokenManager'])
    ;(this.providerId = 'firebase'),
      (this.proactiveRefresh = new Yl(this)),
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
      (this.metadata = new Oo(s.createdAt || void 0, s.lastLoginAt || void 0))
  }
  getIdToken(e) {
    return p(this, null, function* () {
      let n = yield Ql(this, this.stsTokenManager.getToken(this.auth, e))
      return (
        j(n, this.auth, 'internal-error'),
        this.accessToken !== n &&
          ((this.accessToken = n),
          yield this.auth._persistUserIfCurrent(this),
          this.auth._notifyListenersIfCurrent(this)),
        n
      )
    })
  }
  getIdTokenResult(e) {
    return rd(this, e)
  }
  reload() {
    return id(this)
  }
  _assign(e) {
    this !== e &&
      (j(this.uid === e.uid, this.auth, 'internal-error'),
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
    j(!this.reloadListener, this.auth, 'internal-error'),
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
        n && (yield ko(this)),
        yield this.auth._persistUserIfCurrent(this),
        r && this.auth._notifyListenersIfCurrent(this)
    })
  }
  delete() {
    return p(this, null, function* () {
      let e = yield this.getIdToken()
      return (
        yield Ql(this, Qb(this.auth, { idToken: e })),
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
      E = (a = n.tenantId) !== null && a !== void 0 ? a : void 0,
      I = (c = n._redirectEventId) !== null && c !== void 0 ? c : void 0,
      S = (u = n.createdAt) !== null && u !== void 0 ? u : void 0,
      L = (l = n.lastLoginAt) !== null && l !== void 0 ? l : void 0,
      {
        uid: z,
        emailVerified: $,
        isAnonymous: X,
        providerData: H,
        stsTokenManager: Se,
      } = n
    j(z && Se, e, 'internal-error')
    let Rt = Fo.fromJSON(this.name, Se)
    j(typeof z == 'string', e, 'internal-error'),
      qt(d, e.name),
      qt(h, e.name),
      j(typeof $ == 'boolean', e, 'internal-error'),
      j(typeof X == 'boolean', e, 'internal-error'),
      qt(f, e.name),
      qt(_, e.name),
      qt(E, e.name),
      qt(I, e.name),
      qt(S, e.name),
      qt(L, e.name)
    let Jt = new t({
      uid: z,
      auth: e,
      email: h,
      emailVerified: $,
      displayName: d,
      isAnonymous: X,
      photoURL: _,
      phoneNumber: f,
      tenantId: E,
      stsTokenManager: Rt,
      createdAt: S,
      lastLoginAt: L,
    })
    return (
      H &&
        Array.isArray(H) &&
        (Jt.providerData = H.map((fs) => Object.assign({}, fs))),
      I && (Jt._redirectEventId = I),
      Jt
    )
  }
  static _fromIdTokenResponse(e, n, r = !1) {
    return p(this, null, function* () {
      let i = new Fo()
      i.updateFromServerResponse(n)
      let s = new t({
        uid: n.localId,
        auth: e,
        stsTokenManager: i,
        isAnonymous: r,
      })
      return yield ko(s), s
    })
  }
}
var My = new Map()
function wn(t) {
  Mo(t instanceof Function, 'Expected a class definition')
  let e = My.get(t)
  return e
    ? (Mo(e instanceof t, 'Instance stored in cache mismatched with class'), e)
    : ((e = new t()), My.set(t, e), e)
}
var rA = (() => {
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
  Jl = rA
function Wl(t, e, n) {
  return `firebase:${t}:${e}:${n}`
}
var Vo = class t {
  constructor(e, n, r) {
    ;(this.persistence = e), (this.auth = n), (this.userKey = r)
    let { config: i, name: s } = this.auth
    ;(this.fullUserKey = Wl(this.userKey, i.apiKey, s)),
      (this.fullPersistenceKey = Wl('persistence', i.apiKey, s)),
      (this.boundEventHandler = n._onStorageEvent.bind(n)),
      this.persistence._addListener(this.fullUserKey, this.boundEventHandler)
  }
  setCurrentUser(e) {
    return this.persistence._set(this.fullUserKey, e.toJSON())
  }
  getCurrentUser() {
    return p(this, null, function* () {
      let e = yield this.persistence._get(this.fullUserKey)
      return e ? Lo._fromJSON(this.auth, e) : null
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
      if (!n.length) return new t(wn(Jl), e, r)
      let i = (yield Promise.all(
          n.map((u) =>
            p(this, null, function* () {
              if (yield u._isAvailable()) return u
            })
          )
        )).filter((u) => u),
        s = i[0] || wn(Jl),
        o = Wl(r, e.config.apiKey, e.name),
        a = null
      for (let u of n)
        try {
          let l = yield u._get(o)
          if (l) {
            let d = Lo._fromJSON(e, l)
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
function Py(t) {
  let e = t.toLowerCase()
  if (e.includes('opera/') || e.includes('opr/') || e.includes('opios/'))
    return 'Opera'
  if (aA(e)) return 'IEMobile'
  if (e.includes('msie') || e.includes('trident/')) return 'IE'
  if (e.includes('edge/')) return 'Edge'
  if (iA(e)) return 'Firefox'
  if (e.includes('silk/')) return 'Silk'
  if (uA(e)) return 'Blackberry'
  if (lA(e)) return 'Webos'
  if (sA(e)) return 'Safari'
  if ((e.includes('chrome/') || oA(e)) && !e.includes('edge/')) return 'Chrome'
  if (cA(e)) return 'Android'
  {
    let n = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,
      r = t.match(n)
    if (r?.length === 2) return r[1]
  }
  return 'Other'
}
function iA(t = _e()) {
  return /firefox\//i.test(t)
}
function sA(t = _e()) {
  let e = t.toLowerCase()
  return (
    e.includes('safari/') &&
    !e.includes('chrome/') &&
    !e.includes('crios/') &&
    !e.includes('android')
  )
}
function oA(t = _e()) {
  return /crios\//i.test(t)
}
function aA(t = _e()) {
  return /iemobile/i.test(t)
}
function cA(t = _e()) {
  return /android/i.test(t)
}
function uA(t = _e()) {
  return /blackberry/i.test(t)
}
function lA(t = _e()) {
  return /webos/i.test(t)
}
function qy(t, e = []) {
  let n
  switch (t) {
    case 'Browser':
      n = Py(_e())
      break
    case 'Worker':
      n = `${Py(_e())}-${t}`
      break
    default:
      n = t
  }
  let r = e.length ? e.join(',') : 'FirebaseCore-web'
  return `${n}/JsCore/${ar}/${r}`
}
var Zl = class {
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
function dA(n) {
  return p(this, arguments, function* (t, e = {}) {
    return jo(t, 'GET', '/v2/passwordPolicy', jy(t, e))
  })
}
var hA = 6,
  Xl = class {
    constructor(e) {
      var n, r, i, s
      let o = e.customStrengthOptions
      ;(this.customStrengthOptions = {}),
        (this.customStrengthOptions.minPasswordLength =
          (n = o.minPasswordLength) !== null && n !== void 0 ? n : hA),
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
var ed = class {
  constructor(e, n, r, i) {
    ;(this.app = e),
      (this.heartbeatServiceProvider = n),
      (this.appCheckServiceProvider = r),
      (this.config = i),
      (this.currentUser = null),
      (this.emulatorConfig = null),
      (this.operations = Promise.resolve()),
      (this.authStateSubscription = new Uo(this)),
      (this.idTokenSubscription = new Uo(this)),
      (this.beforeStateQueue = new Zl(this)),
      (this.redirectUser = null),
      (this.isProactiveRefreshEnabled = !1),
      (this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1),
      (this._canInitEmulator = !0),
      (this._isInitialized = !1),
      (this._deleted = !1),
      (this._initializationPromise = null),
      (this._popupRedirectResolver = null),
      (this._errorFactory = Vy),
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
      n && (this._popupRedirectResolver = wn(n)),
      (this._initializationPromise = this.queue(() =>
        p(this, null, function* () {
          var r, i
          if (
            !this._deleted &&
            ((this.persistenceManager = yield Vo.create(this, e)),
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
        j(this._popupRedirectResolver, this, 'argument-error'),
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
        yield ko(e)
      } catch (n) {
        if (n?.code !== 'auth/network-request-failed')
          return this.directlySetCurrentUser(null)
      }
      return this.directlySetCurrentUser(e)
    })
  }
  useDeviceLanguage() {
    this.languageCode = zb()
  }
  _delete() {
    return p(this, null, function* () {
      this._deleted = !0
    })
  }
  updateCurrentUser(e) {
    return p(this, null, function* () {
      let n = e ? jt(e) : null
      return (
        n &&
          j(
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
          e && j(this.tenantId === e.tenantId, this, 'tenant-id-mismatch'),
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
        yield this.assertedPersistence.setPersistence(wn(e))
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
      let e = yield dA(this),
        n = new Xl(e)
      this.tenantId === null
        ? (this._projectPasswordPolicy = n)
        : (this._tenantPasswordPolicies[this.tenantId] = n)
    })
  }
  _getPersistence() {
    return this.assertedPersistence.persistence.type
  }
  _updateErrorMap(e) {
    this._errorFactory = new Ct('auth', 'Firebase', e())
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
        this.tenantId != null && (r.tenantId = this.tenantId), yield nA(this, r)
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
        let n = (e && wn(e)) || this._popupRedirectResolver
        j(n, this, 'argument-error'),
          (this.redirectPersistenceManager = yield Vo.create(
            this,
            [wn(n._redirectPersistence)],
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
      (j(a, this, 'internal-error'),
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
      j(this.persistenceManager, this, 'internal-error'),
      this.persistenceManager
    )
  }
  _logFramework(e) {
    !e ||
      this.frameworks.includes(e) ||
      (this.frameworks.push(e),
      this.frameworks.sort(),
      (this.clientVersion = qy(
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
        n?.error && Bb(`Error while retrieving App Check token: ${n.error}`),
        n?.token
      )
    })
  }
}
function fA(t) {
  return jt(t)
}
var Uo = class {
  constructor(e) {
    ;(this.auth = e),
      (this.observer = null),
      (this.addObserver = py((n) => (this.observer = n)))
  }
  get next() {
    return (
      j(this.observer, this.auth, 'internal-error'),
      this.observer.next.bind(this.observer)
    )
  }
}
function pA(t) {
  return `__${t}${Math.floor(Math.random() * 1e6)}`
}
function gA(t, e) {
  let n = e?.persistence || [],
    r = (Array.isArray(n) ? n : [n]).map(wn)
  e?.errorMap && t._updateErrorMap(e.errorMap),
    t._initializeWithPersistence(r, e?.popupRedirectResolver)
}
var Ek = pA('rcb'),
  wk = new Dn(3e4, 6e4)
var Dk = new Dn(2e3, 1e4)
var Tk = 10 * 60 * 1e3
var Ck = new Dn(3e4, 6e4)
var bk = new Dn(5e3, 15e3)
var Ak = encodeURIComponent('fac')
var Oy = '@firebase/auth',
  ky = '1.5.1'
var td = class {
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
    j(this.auth._initializationPromise, 'dependent-sdk-initialized-before-auth')
  }
  updateProactiveRefresh() {
    this.internalListeners.size > 0
      ? this.auth._startProactiveRefresh()
      : this.auth._stopProactiveRefresh()
  }
}
function mA(t) {
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
function yA(t) {
  Ht(
    new Fe(
      'auth',
      (e, { options: n }) => {
        let r = e.getProvider('app').getImmediate(),
          i = e.getProvider('heartbeat'),
          s = e.getProvider('app-check-internal'),
          { apiKey: o, authDomain: a } = r.options
        j(o && !o.includes(':'), 'invalid-api-key', { appName: r.name })
        let c = {
            apiKey: o,
            authDomain: a,
            clientPlatform: t,
            apiHost: 'identitytoolkit.googleapis.com',
            tokenApiHost: 'securetoken.googleapis.com',
            apiScheme: 'https',
            sdkClientVersion: qy(t),
          },
          u = new ed(r, i, s, c)
        return gA(u, n), u
      },
      'PUBLIC'
    )
      .setInstantiationMode('EXPLICIT')
      .setInstanceCreatedCallback((e, n, r) => {
        e.getProvider('auth-internal').initialize()
      })
  ),
    Ht(
      new Fe(
        'auth-internal',
        (e) => {
          let n = fA(e.getProvider('auth').getImmediate())
          return ((r) => new td(r))(n)
        },
        'PRIVATE'
      ).setInstantiationMode('EXPLICIT')
    ),
    ce(Oy, ky, mA(t)),
    ce(Oy, ky, 'esm2017')
}
var vA = 5 * 60,
  Sk = ay('authIdTokenMaxAge') || vA
yA('Browser')
var yS = 'auth'
var Bo = class {
  constructor() {
    return yi(yS)
  }
}
var vS =
    typeof globalThis < 'u'
      ? globalThis
      : typeof window < 'u'
        ? window
        : typeof global < 'u'
          ? global
          : typeof self < 'u'
            ? self
            : {},
  We = {},
  y,
  bd = bd || {},
  T = vS || self
function ta(t) {
  var e = typeof t
  return (
    (e = e != 'object' ? e : t ? (Array.isArray(t) ? 'array' : e) : 'null'),
    e == 'array' || (e == 'object' && typeof t.length == 'number')
  )
}
function ki(t) {
  var e = typeof t
  return (e == 'object' && t != null) || e == 'function'
}
function _S(t) {
  return (
    (Object.prototype.hasOwnProperty.call(t, sd) && t[sd]) || (t[sd] = ++IS)
  )
}
var sd = 'closure_uid_' + ((1e9 * Math.random()) >>> 0),
  IS = 0
function ES(t, e, n) {
  return t.call.apply(t.bind, arguments)
}
function wS(t, e, n) {
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
function Ie(t, e, n) {
  return (
    Function.prototype.bind &&
    Function.prototype.bind.toString().indexOf('native code') != -1
      ? (Ie = ES)
      : (Ie = wS),
    Ie.apply(null, arguments)
  )
}
function $o(t, e) {
  var n = Array.prototype.slice.call(arguments, 1)
  return function () {
    var r = n.slice()
    return r.push.apply(r, arguments), t.apply(this, r)
  }
}
function le(t, e) {
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
function zt() {
  ;(this.s = this.s), (this.o = this.o)
}
var DS = 0
zt.prototype.s = !1
zt.prototype.sa = function () {
  !this.s && ((this.s = !0), this.N(), DS != 0) && _S(this)
}
zt.prototype.N = function () {
  if (this.o) for (; this.o.length; ) this.o.shift()()
}
var rv = Array.prototype.indexOf
  ? function (t, e) {
      return Array.prototype.indexOf.call(t, e, void 0)
    }
  : function (t, e) {
      if (typeof t == 'string')
        return typeof e != 'string' || e.length != 1 ? -1 : t.indexOf(e, 0)
      for (let n = 0; n < t.length; n++) if (n in t && t[n] === e) return n
      return -1
    }
function Ad(t) {
  let e = t.length
  if (0 < e) {
    let n = Array(e)
    for (let r = 0; r < e; r++) n[r] = t[r]
    return n
  }
  return []
}
function zy(t, e) {
  for (let n = 1; n < arguments.length; n++) {
    let r = arguments[n]
    if (ta(r)) {
      let i = t.length || 0,
        s = r.length || 0
      t.length = i + s
      for (let o = 0; o < s; o++) t[i + o] = r[o]
    } else t.push(r)
  }
}
function Ee(t, e) {
  ;(this.type = t), (this.g = this.target = e), (this.defaultPrevented = !1)
}
Ee.prototype.h = function () {
  this.defaultPrevented = !0
}
var TS = (function () {
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
function Ai(t) {
  return /^[\s\xa0]*$/.test(t)
}
function na() {
  var t = T.navigator
  return t && (t = t.userAgent) ? t : ''
}
function ct(t) {
  return na().indexOf(t) != -1
}
function Sd(t) {
  return Sd[' '](t), t
}
Sd[' '] = function () {}
function CS(t, e) {
  var n = fN
  return Object.prototype.hasOwnProperty.call(n, t) ? n[t] : (n[t] = e(t))
}
var bS = ct('Opera'),
  fr = ct('Trident') || ct('MSIE'),
  iv = ct('Edge'),
  ld = iv || fr,
  sv =
    ct('Gecko') &&
    !(na().toLowerCase().indexOf('webkit') != -1 && !ct('Edge')) &&
    !(ct('Trident') || ct('MSIE')) &&
    !ct('Edge'),
  AS = na().toLowerCase().indexOf('webkit') != -1 && !ct('Edge')
function ov() {
  var t = T.document
  return t ? t.documentMode : void 0
}
var dd
e: {
  if (
    ((Ho = ''),
    (qo = (function () {
      var t = na()
      if (sv) return /rv:([^\);]+)(\)|;)/.exec(t)
      if (iv) return /Edge\/([\d\.]+)/.exec(t)
      if (fr) return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(t)
      if (AS) return /WebKit\/(\S+)/.exec(t)
      if (bS) return /(?:Version)[ \/]?(\S+)/.exec(t)
    })()),
    qo && (Ho = qo ? qo[1] : ''),
    fr && ((zo = ov()), zo != null && zo > parseFloat(Ho)))
  ) {
    dd = String(zo)
    break e
  }
  dd = Ho
}
var Ho, qo, zo, hd
T.document && fr
  ? ((od = ov()), (hd = od || parseInt(dd, 10) || void 0))
  : (hd = void 0)
var od,
  SS = hd
function Si(t, e) {
  if (
    (Ee.call(this, t ? t.type : ''),
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
      if (sv) {
        e: {
          try {
            Sd(e.nodeName)
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
          : NS[t.pointerType] || ''),
      (this.state = t.state),
      (this.i = t),
      t.defaultPrevented && Si.$.h.call(this)
  }
}
le(Si, Ee)
var NS = { 2: 'touch', 3: 'pen', 4: 'mouse' }
Si.prototype.h = function () {
  Si.$.h.call(this)
  var t = this.i
  t.preventDefault ? t.preventDefault() : (t.returnValue = !1)
}
var Fi = 'closure_listenable_' + ((1e6 * Math.random()) | 0),
  RS = 0
function xS(t, e, n, r, i) {
  ;(this.listener = t),
    (this.proxy = null),
    (this.src = e),
    (this.type = n),
    (this.capture = !!r),
    (this.la = i),
    (this.key = ++RS),
    (this.fa = this.ia = !1)
}
function ra(t) {
  ;(t.fa = !0),
    (t.listener = null),
    (t.proxy = null),
    (t.src = null),
    (t.la = null)
}
function Nd(t, e, n) {
  for (let r in t) e.call(n, t[r], r, t)
}
function MS(t, e) {
  for (let n in t) e.call(void 0, t[n], n, t)
}
function av(t) {
  let e = {}
  for (let n in t) e[n] = t[n]
  return e
}
var Gy =
  'constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf'.split(
    ' '
  )
function cv(t, e) {
  let n, r
  for (let i = 1; i < arguments.length; i++) {
    r = arguments[i]
    for (n in r) t[n] = r[n]
    for (let s = 0; s < Gy.length; s++)
      (n = Gy[s]), Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
  }
}
function ia(t) {
  ;(this.src = t), (this.g = {}), (this.h = 0)
}
ia.prototype.add = function (t, e, n, r, i) {
  var s = t.toString()
  ;(t = this.g[s]), t || ((t = this.g[s] = []), this.h++)
  var o = pd(t, e, r, i)
  return (
    -1 < o
      ? ((e = t[o]), n || (e.ia = !1))
      : ((e = new xS(e, this.src, s, !!r, i)), (e.ia = n), t.push(e)),
    e
  )
}
function fd(t, e) {
  var n = e.type
  if (n in t.g) {
    var r = t.g[n],
      i = rv(r, e),
      s
    ;(s = 0 <= i) && Array.prototype.splice.call(r, i, 1),
      s && (ra(e), t.g[n].length == 0 && (delete t.g[n], t.h--))
  }
}
function pd(t, e, n, r) {
  for (var i = 0; i < t.length; ++i) {
    var s = t[i]
    if (!s.fa && s.listener == e && s.capture == !!n && s.la == r) return i
  }
  return -1
}
var Rd = 'closure_lm_' + ((1e6 * Math.random()) | 0),
  ad = {}
function uv(t, e, n, r, i) {
  if (r && r.once) return dv(t, e, n, r, i)
  if (Array.isArray(e)) {
    for (var s = 0; s < e.length; s++) uv(t, e[s], n, r, i)
    return null
  }
  return (
    (n = Pd(n)),
    t && t[Fi] ? t.O(e, n, ki(r) ? !!r.capture : !!r, i) : lv(t, e, n, !1, r, i)
  )
}
function lv(t, e, n, r, i, s) {
  if (!e) throw Error('Invalid event type')
  var o = ki(i) ? !!i.capture : !!i,
    a = Md(t)
  if ((a || (t[Rd] = a = new ia(t)), (n = a.add(e, n, r, o, s)), n.proxy))
    return n
  if (
    ((r = PS()),
    (n.proxy = r),
    (r.src = t),
    (r.listener = n),
    t.addEventListener)
  )
    TS || (i = o),
      i === void 0 && (i = !1),
      t.addEventListener(e.toString(), r, i)
  else if (t.attachEvent) t.attachEvent(fv(e.toString()), r)
  else if (t.addListener && t.removeListener) t.addListener(r)
  else throw Error('addEventListener and attachEvent are unavailable.')
  return n
}
function PS() {
  function t(n) {
    return e.call(t.src, t.listener, n)
  }
  let e = OS
  return t
}
function dv(t, e, n, r, i) {
  if (Array.isArray(e)) {
    for (var s = 0; s < e.length; s++) dv(t, e[s], n, r, i)
    return null
  }
  return (
    (n = Pd(n)),
    t && t[Fi] ? t.P(e, n, ki(r) ? !!r.capture : !!r, i) : lv(t, e, n, !0, r, i)
  )
}
function hv(t, e, n, r, i) {
  if (Array.isArray(e)) for (var s = 0; s < e.length; s++) hv(t, e[s], n, r, i)
  else
    (r = ki(r) ? !!r.capture : !!r),
      (n = Pd(n)),
      t && t[Fi]
        ? ((t = t.i),
          (e = String(e).toString()),
          e in t.g &&
            ((s = t.g[e]),
            (n = pd(s, n, r, i)),
            -1 < n &&
              (ra(s[n]),
              Array.prototype.splice.call(s, n, 1),
              s.length == 0 && (delete t.g[e], t.h--))))
        : t &&
          (t = Md(t)) &&
          ((e = t.g[e.toString()]),
          (t = -1),
          e && (t = pd(e, n, r, i)),
          (n = -1 < t ? e[t] : null) && xd(n))
}
function xd(t) {
  if (typeof t != 'number' && t && !t.fa) {
    var e = t.src
    if (e && e[Fi]) fd(e.i, t)
    else {
      var n = t.type,
        r = t.proxy
      e.removeEventListener
        ? e.removeEventListener(n, r, t.capture)
        : e.detachEvent
          ? e.detachEvent(fv(n), r)
          : e.addListener && e.removeListener && e.removeListener(r),
        (n = Md(e))
          ? (fd(n, t), n.h == 0 && ((n.src = null), (e[Rd] = null)))
          : ra(t)
    }
  }
}
function fv(t) {
  return t in ad ? ad[t] : (ad[t] = 'on' + t)
}
function OS(t, e) {
  if (t.fa) t = !0
  else {
    e = new Si(e, this)
    var n = t.listener,
      r = t.la || t.src
    t.ia && xd(t), (t = n.call(r, e))
  }
  return t
}
function Md(t) {
  return (t = t[Rd]), t instanceof ia ? t : null
}
var cd = '__closure_events_fn_' + ((1e9 * Math.random()) >>> 0)
function Pd(t) {
  return typeof t == 'function'
    ? t
    : (t[cd] ||
        (t[cd] = function (e) {
          return t.handleEvent(e)
        }),
      t[cd])
}
function ue() {
  zt.call(this), (this.i = new ia(this)), (this.S = this), (this.J = null)
}
le(ue, zt)
ue.prototype[Fi] = !0
ue.prototype.removeEventListener = function (t, e, n, r) {
  hv(this, t, e, n, r)
}
function pe(t, e) {
  var n,
    r = t.J
  if (r) for (n = []; r; r = r.J) n.push(r)
  if (((t = t.S), (r = e.type || e), typeof e == 'string')) e = new Ee(e, t)
  else if (e instanceof Ee) e.target = e.target || t
  else {
    var i = e
    ;(e = new Ee(r, t)), cv(e, i)
  }
  if (((i = !0), n))
    for (var s = n.length - 1; 0 <= s; s--) {
      var o = (e.g = n[s])
      i = Go(o, r, !0, e) && i
    }
  if (
    ((o = e.g = t), (i = Go(o, r, !0, e) && i), (i = Go(o, r, !1, e) && i), n)
  )
    for (s = 0; s < n.length; s++) (o = e.g = n[s]), (i = Go(o, r, !1, e) && i)
}
ue.prototype.N = function () {
  if ((ue.$.N.call(this), this.i)) {
    var t = this.i,
      e
    for (e in t.g) {
      for (var n = t.g[e], r = 0; r < n.length; r++) ra(n[r])
      delete t.g[e], t.h--
    }
  }
  this.J = null
}
ue.prototype.O = function (t, e, n, r) {
  return this.i.add(String(t), e, !1, n, r)
}
ue.prototype.P = function (t, e, n, r) {
  return this.i.add(String(t), e, !0, n, r)
}
function Go(t, e, n, r) {
  if (((e = t.i.g[String(e)]), !e)) return !0
  e = e.concat()
  for (var i = !0, s = 0; s < e.length; ++s) {
    var o = e[s]
    if (o && !o.fa && o.capture == n) {
      var a = o.listener,
        c = o.la || o.src
      o.ia && fd(t.i, o), (i = a.call(c, r) !== !1 && i)
    }
  }
  return i && !r.defaultPrevented
}
var Od = T.JSON.stringify,
  gd = class {
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
function kS() {
  var t = kd
  let e = null
  return (
    t.g && ((e = t.g), (t.g = t.g.next), t.g || (t.h = null), (e.next = null)),
    e
  )
}
var md = class {
    constructor() {
      this.h = this.g = null
    }
    add(e, n) {
      let r = pv.get()
      r.set(e, n), this.h ? (this.h.next = r) : (this.g = r), (this.h = r)
    }
  },
  pv = new gd(
    () => new yd(),
    (t) => t.reset()
  ),
  yd = class {
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
function FS(t) {
  var e = 1
  t = t.split(':')
  let n = []
  for (; 0 < e && t.length; ) n.push(t.shift()), e--
  return t.length && n.push(t.join(':')), n
}
function LS(t) {
  T.setTimeout(() => {
    throw t
  }, 0)
}
var Ni,
  Ri = !1,
  kd = new md(),
  gv = () => {
    let t = T.Promise.resolve(void 0)
    Ni = () => {
      t.then(VS)
    }
  },
  VS = () => {
    for (var t; (t = kS()); ) {
      try {
        t.h.call(t.g)
      } catch (n) {
        LS(n)
      }
      var e = pv
      e.j(t), 100 > e.h && (e.h++, (t.next = e.g), (e.g = t))
    }
    Ri = !1
  }
function sa(t, e) {
  ue.call(this),
    (this.h = t || 1),
    (this.g = e || T),
    (this.j = Ie(this.qb, this)),
    (this.l = Date.now())
}
le(sa, ue)
y = sa.prototype
y.ga = !1
y.T = null
y.qb = function () {
  if (this.ga) {
    var t = Date.now() - this.l
    0 < t && t < 0.8 * this.h
      ? (this.T = this.g.setTimeout(this.j, this.h - t))
      : (this.T && (this.g.clearTimeout(this.T), (this.T = null)),
        pe(this, 'tick'),
        this.ga && (Fd(this), this.start()))
  }
}
y.start = function () {
  ;(this.ga = !0),
    this.T ||
      ((this.T = this.g.setTimeout(this.j, this.h)), (this.l = Date.now()))
}
function Fd(t) {
  ;(t.ga = !1), t.T && (t.g.clearTimeout(t.T), (t.T = null))
}
y.N = function () {
  sa.$.N.call(this), Fd(this), delete this.g
}
function Ld(t, e, n) {
  if (typeof t == 'function') n && (t = Ie(t, n))
  else if (t && typeof t.handleEvent == 'function') t = Ie(t.handleEvent, t)
  else throw Error('Invalid listener argument')
  return 2147483647 < Number(e) ? -1 : T.setTimeout(t, e || 0)
}
function mv(t) {
  t.g = Ld(() => {
    ;(t.g = null), t.i && ((t.i = !1), mv(t))
  }, t.j)
  let e = t.h
  ;(t.h = null), t.m.apply(null, e)
}
var vd = class extends zt {
  constructor(e, n) {
    super(),
      (this.m = e),
      (this.j = n),
      (this.h = null),
      (this.i = !1),
      (this.g = null)
  }
  l(e) {
    ;(this.h = arguments), this.g ? (this.i = !0) : mv(this)
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
function xi(t) {
  zt.call(this), (this.h = t), (this.g = {})
}
le(xi, zt)
var Wy = []
function yv(t, e, n, r) {
  Array.isArray(n) || (n && (Wy[0] = n.toString()), (n = Wy))
  for (var i = 0; i < n.length; i++) {
    var s = uv(e, n[i], r || t.handleEvent, !1, t.h || t)
    if (!s) break
    t.g[s.key] = s
  }
}
function vv(t) {
  Nd(
    t.g,
    function (e, n) {
      this.g.hasOwnProperty(n) && xd(e)
    },
    t
  ),
    (t.g = {})
}
xi.prototype.N = function () {
  xi.$.N.call(this), vv(this)
}
xi.prototype.handleEvent = function () {
  throw Error('EventHandler.handleEvent not implemented')
}
function oa() {
  this.g = !0
}
oa.prototype.Ea = function () {
  this.g = !1
}
function US(t, e, n, r, i, s) {
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
function jS(t, e, n, r, i, s, o) {
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
function dr(t, e, n, r) {
  t.info(function () {
    return 'XMLHTTP TEXT (' + e + '): ' + $S(t, n) + (r ? ' ' + r : '')
  })
}
function BS(t, e) {
  t.info(function () {
    return 'TIMEOUT: ' + e
  })
}
oa.prototype.info = function () {}
function $S(t, e) {
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
    return Od(n)
  } catch {
    return e
  }
}
var An = {},
  Ky = null
function aa() {
  return (Ky = Ky || new ue())
}
An.Ta = 'serverreachability'
function _v(t) {
  Ee.call(this, An.Ta, t)
}
le(_v, Ee)
function Mi(t) {
  let e = aa()
  pe(e, new _v(e))
}
An.STAT_EVENT = 'statevent'
function Iv(t, e) {
  Ee.call(this, An.STAT_EVENT, t), (this.stat = e)
}
le(Iv, Ee)
function Ce(t) {
  let e = aa()
  pe(e, new Iv(e, t))
}
An.Ua = 'timingevent'
function Ev(t, e) {
  Ee.call(this, An.Ua, t), (this.size = e)
}
le(Ev, Ee)
function Li(t, e) {
  if (typeof t != 'function')
    throw Error('Fn must not be null and must be a function')
  return T.setTimeout(function () {
    t()
  }, e)
}
var ca = {
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
  wv = {
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
function Vd() {}
Vd.prototype.h = null
function Qy(t) {
  return t.h || (t.h = t.i())
}
function Dv() {}
var Vi = { OPEN: 'a', vb: 'b', Ra: 'c', Hb: 'd' }
function Ud() {
  Ee.call(this, 'd')
}
le(Ud, Ee)
function jd() {
  Ee.call(this, 'c')
}
le(jd, Ee)
var _d
function ua() {}
le(ua, Vd)
ua.prototype.g = function () {
  return new XMLHttpRequest()
}
ua.prototype.i = function () {
  return {}
}
_d = new ua()
function Ui(t, e, n, r) {
  ;(this.l = t),
    (this.j = e),
    (this.m = n),
    (this.W = r || 1),
    (this.U = new xi(this)),
    (this.P = HS),
    (t = ld ? 125 : void 0),
    (this.V = new sa(t)),
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
    (this.h = new Tv())
}
function Tv() {
  ;(this.i = null), (this.g = ''), (this.h = !1)
}
var HS = 45e3,
  Cv = {},
  Id = {}
y = Ui.prototype
y.setTimeout = function (t) {
  this.P = t
}
function Ed(t, e, n) {
  ;(t.L = 1), (t.A = da(At(e))), (t.u = n), (t.S = !0), bv(t, null)
}
function bv(t, e) {
  ;(t.G = Date.now()), ji(t), (t.B = At(t.A))
  var n = t.B,
    r = t.W
  Array.isArray(r) || (r = [String(r)]),
    Ov(n.i, 't', r),
    (t.o = 0),
    (n = t.l.J),
    (t.h = new Tv()),
    (t.g = t_(t.l, n ? e : null, !t.u)),
    0 < t.O && (t.M = new vd(Ie(t.Pa, t, t.g), t.O)),
    yv(t.U, t.g, 'readystatechange', t.nb),
    (e = t.I ? av(t.I) : {}),
    t.u
      ? (t.v || (t.v = 'POST'),
        (e['Content-Type'] = 'application/x-www-form-urlencoded'),
        t.g.ha(t.B, t.v, t.u, e))
      : ((t.v = 'GET'), t.g.ha(t.B, t.v, null, e)),
    Mi(),
    US(t.j, t.v, t.B, t.m, t.W, t.u)
}
y.nb = function (t) {
  t = t.target
  let e = this.M
  e && ut(t) == 3 ? e.l() : this.Pa(t)
}
y.Pa = function (t) {
  try {
    if (t == this.g)
      e: {
        let l = ut(this.g)
        var e = this.g.Ia()
        let d = this.g.da()
        if (
          !(3 > l) &&
          (l != 3 || ld || (this.g && (this.h.h || this.g.ja() || Xy(this.g))))
        ) {
          this.J || l != 4 || e == 7 || (e == 8 || 0 >= d ? Mi(3) : Mi(2)),
            la(this)
          var n = this.g.da()
          this.ca = n
          t: if (Av(this)) {
            var r = Xy(this.g)
            t = ''
            var i = r.length,
              s = ut(this.g) == 4
            if (!this.h.i) {
              if (typeof TextDecoder > 'u') {
                Tn(this), bi(this)
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
            jS(this.j, this.v, this.B, this.m, this.W, l, n),
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
                    !Ai(a)
                  ) {
                    var u = a
                    break t
                  }
                }
                u = null
              }
              if ((n = u))
                dr(
                  this.j,
                  this.m,
                  n,
                  'Initial handshake response via X-HTTP-Initial-Response'
                ),
                  (this.K = !0),
                  wd(this, n)
              else {
                ;(this.i = !1), (this.s = 3), Ce(12), Tn(this), bi(this)
                break e
              }
            }
            this.S
              ? (Sv(this, l, o),
                ld &&
                  this.i &&
                  l == 3 &&
                  (yv(this.U, this.V, 'tick', this.mb), this.V.start()))
              : (dr(this.j, this.m, o, null), wd(this, o)),
              l == 4 && Tn(this),
              this.i &&
                !this.J &&
                (l == 4 ? Jv(this.l, this) : ((this.i = !1), ji(this)))
          } else
            lN(this.g),
              n == 400 && 0 < o.indexOf('Unknown SID')
                ? ((this.s = 3), Ce(12))
                : ((this.s = 0), Ce(13)),
              Tn(this),
              bi(this)
        }
      }
  } catch {
  } finally {
  }
}
function Av(t) {
  return t.g ? t.v == 'GET' && t.L != 2 && t.l.Ha : !1
}
function Sv(t, e, n) {
  let r = !0,
    i
  for (; !t.J && t.o < n.length; )
    if (((i = qS(t, n)), i == Id)) {
      e == 4 && ((t.s = 4), Ce(14), (r = !1)),
        dr(t.j, t.m, null, '[Incomplete Response]')
      break
    } else if (i == Cv) {
      ;(t.s = 4), Ce(15), dr(t.j, t.m, n, '[Invalid Chunk]'), (r = !1)
      break
    } else dr(t.j, t.m, i, null), wd(t, i)
  Av(t) && t.o != 0 && ((t.h.g = t.h.g.slice(t.o)), (t.o = 0)),
    e != 4 || n.length != 0 || t.h.h || ((t.s = 1), Ce(16), (r = !1)),
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
          Gd(e),
          (e.M = !0),
          Ce(11)))
      : (dr(t.j, t.m, n, '[Invalid Chunked Response]'), Tn(t), bi(t))
}
y.mb = function () {
  if (this.g) {
    var t = ut(this.g),
      e = this.g.ja()
    this.o < e.length &&
      (la(this), Sv(this, t, e), this.i && t != 4 && ji(this))
  }
}
function qS(t, e) {
  var n = t.o,
    r = e.indexOf(
      `
`,
      n
    )
  return r == -1
    ? Id
    : ((n = Number(e.substring(n, r))),
      isNaN(n)
        ? Cv
        : ((r += 1),
          r + n > e.length ? Id : ((e = e.slice(r, r + n)), (t.o = r + n), e)))
}
y.cancel = function () {
  ;(this.J = !0), Tn(this)
}
function ji(t) {
  ;(t.Y = Date.now() + t.P), Nv(t, t.P)
}
function Nv(t, e) {
  if (t.C != null) throw Error('WatchDog timer not null')
  t.C = Li(Ie(t.lb, t), e)
}
function la(t) {
  t.C && (T.clearTimeout(t.C), (t.C = null))
}
y.lb = function () {
  this.C = null
  let t = Date.now()
  0 <= t - this.Y
    ? (BS(this.j, this.B),
      this.L != 2 && (Mi(), Ce(17)),
      Tn(this),
      (this.s = 2),
      bi(this))
    : Nv(this, this.Y - t)
}
function bi(t) {
  t.l.H == 0 || t.J || Jv(t.l, t)
}
function Tn(t) {
  la(t)
  var e = t.M
  e && typeof e.sa == 'function' && e.sa(),
    (t.M = null),
    Fd(t.V),
    vv(t.U),
    t.g && ((e = t.g), (t.g = null), e.abort(), e.sa())
}
function wd(t, e) {
  try {
    var n = t.l
    if (n.H != 0 && (n.g == t || Dd(n.i, t))) {
      if (!t.K && Dd(n.i, t) && n.H == 3) {
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
                if (n.g.G + 3e3 < t.G) Jo(n), pa(n)
                else break e
              zd(n), Ce(18)
            }
          } else
            (n.Fa = i[1]),
              0 < n.Fa - n.V &&
                37500 > i[2] &&
                n.G &&
                n.A == 0 &&
                !n.v &&
                (n.v = Li(Ie(n.ib, n), 6e3))
          if (1 >= Lv(n.i) && n.oa) {
            try {
              n.oa()
            } catch {}
            n.oa = void 0
          }
        } else Cn(n, 11)
      } else if (((t.K || n.g == t) && Jo(n), !Ai(e)))
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
                    s.h && (Bd(s, s.h), (s.h = null)))
                }
                if (r.F) {
                  let E = f.g
                    ? f.g.getResponseHeader('X-HTTP-Session-Id')
                    : null
                  E && ((r.Da = E), W(r.I, r.F, E))
                }
              }
              ;(n.H = 3),
                n.h && n.h.Ba(),
                n.ca &&
                  ((n.S = Date.now() - t.G),
                  n.l.info('Handshake RTT: ' + n.S + 'ms')),
                (r = n)
              var o = t
              if (((r.wa = e_(r, r.J ? r.pa : null, r.Y)), o.K)) {
                Vv(r.i, o)
                var a = o,
                  c = r.L
                c && a.setTimeout(c), a.C && (la(a), ji(a)), (r.g = o)
              } else Qv(r)
              0 < n.j.length && ga(n)
            } else (u[0] != 'stop' && u[0] != 'close') || Cn(n, 7)
          else
            n.H == 3 &&
              (u[0] == 'stop' || u[0] == 'close'
                ? u[0] == 'stop'
                  ? Cn(n, 7)
                  : qd(n)
                : u[0] != 'noop' && n.h && n.h.Aa(u),
              (n.A = 0))
        }
    }
    Mi(4)
  } catch {}
}
function zS(t) {
  if (t.Z && typeof t.Z == 'function') return t.Z()
  if (
    (typeof Map < 'u' && t instanceof Map) ||
    (typeof Set < 'u' && t instanceof Set)
  )
    return Array.from(t.values())
  if (typeof t == 'string') return t.split('')
  if (ta(t)) {
    for (var e = [], n = t.length, r = 0; r < n; r++) e.push(t[r])
    return e
  }
  ;(e = []), (n = 0)
  for (r in t) e[n++] = t[r]
  return e
}
function GS(t) {
  if (t.ta && typeof t.ta == 'function') return t.ta()
  if (!t.Z || typeof t.Z != 'function') {
    if (typeof Map < 'u' && t instanceof Map) return Array.from(t.keys())
    if (!(typeof Set < 'u' && t instanceof Set)) {
      if (ta(t) || typeof t == 'string') {
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
function Rv(t, e) {
  if (t.forEach && typeof t.forEach == 'function') t.forEach(e, void 0)
  else if (ta(t) || typeof t == 'string')
    Array.prototype.forEach.call(t, e, void 0)
  else
    for (var n = GS(t), r = zS(t), i = r.length, s = 0; s < i; s++)
      e.call(void 0, r[s], n && n[s], t)
}
var xv = RegExp(
  '^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$'
)
function WS(t, e) {
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
function bn(t) {
  if (
    ((this.g = this.s = this.j = ''),
    (this.m = null),
    (this.o = this.l = ''),
    (this.h = !1),
    t instanceof bn)
  ) {
    ;(this.h = t.h),
      Qo(this, t.j),
      (this.s = t.s),
      (this.g = t.g),
      Yo(this, t.m),
      (this.l = t.l)
    var e = t.i,
      n = new Pi()
    ;(n.i = e.i),
      e.g && ((n.g = new Map(e.g)), (n.h = e.h)),
      Yy(this, n),
      (this.o = t.o)
  } else
    t && (e = String(t).match(xv))
      ? ((this.h = !1),
        Qo(this, e[1] || '', !0),
        (this.s = Ti(e[2] || '')),
        (this.g = Ti(e[3] || '', !0)),
        Yo(this, e[4]),
        (this.l = Ti(e[5] || '', !0)),
        Yy(this, e[6] || '', !0),
        (this.o = Ti(e[7] || '')))
      : ((this.h = !1), (this.i = new Pi(null, this.h)))
}
bn.prototype.toString = function () {
  var t = [],
    e = this.j
  e && t.push(Ci(e, Jy, !0), ':')
  var n = this.g
  return (
    (n || e == 'file') &&
      (t.push('//'),
      (e = this.s) && t.push(Ci(e, Jy, !0), '@'),
      t.push(
        encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g, '%$1')
      ),
      (n = this.m),
      n != null && t.push(':', String(n))),
    (n = this.l) &&
      (this.g && n.charAt(0) != '/' && t.push('/'),
      t.push(Ci(n, n.charAt(0) == '/' ? YS : QS, !0))),
    (n = this.i.toString()) && t.push('?', n),
    (n = this.o) && t.push('#', Ci(n, ZS)),
    t.join('')
  )
}
function At(t) {
  return new bn(t)
}
function Qo(t, e, n) {
  ;(t.j = n ? Ti(e, !0) : e), t.j && (t.j = t.j.replace(/:$/, ''))
}
function Yo(t, e) {
  if (e) {
    if (((e = Number(e)), isNaN(e) || 0 > e))
      throw Error('Bad port number ' + e)
    t.m = e
  } else t.m = null
}
function Yy(t, e, n) {
  e instanceof Pi
    ? ((t.i = e), XS(t.i, t.h))
    : (n || (e = Ci(e, JS)), (t.i = new Pi(e, t.h)))
}
function W(t, e, n) {
  t.i.set(e, n)
}
function da(t) {
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
function Ti(t, e) {
  return t
    ? e
      ? decodeURI(t.replace(/%25/g, '%2525'))
      : decodeURIComponent(t)
    : ''
}
function Ci(t, e, n) {
  return typeof t == 'string'
    ? ((t = encodeURI(t).replace(e, KS)),
      n && (t = t.replace(/%25([0-9a-fA-F]{2})/g, '%$1')),
      t)
    : null
}
function KS(t) {
  return (
    (t = t.charCodeAt(0)),
    '%' + ((t >> 4) & 15).toString(16) + (t & 15).toString(16)
  )
}
var Jy = /[#\/\?@]/g,
  QS = /[#\?:]/g,
  YS = /[#\?]/g,
  JS = /[#\?@]/g,
  ZS = /#/g
function Pi(t, e) {
  ;(this.h = this.g = null), (this.i = t || null), (this.j = !!e)
}
function Gt(t) {
  t.g ||
    ((t.g = new Map()),
    (t.h = 0),
    t.i &&
      WS(t.i, function (e, n) {
        t.add(decodeURIComponent(e.replace(/\+/g, ' ')), n)
      }))
}
y = Pi.prototype
y.add = function (t, e) {
  Gt(this), (this.i = null), (t = pr(this, t))
  var n = this.g.get(t)
  return n || this.g.set(t, (n = [])), n.push(e), (this.h += 1), this
}
function Mv(t, e) {
  Gt(t),
    (e = pr(t, e)),
    t.g.has(e) && ((t.i = null), (t.h -= t.g.get(e).length), t.g.delete(e))
}
function Pv(t, e) {
  return Gt(t), (e = pr(t, e)), t.g.has(e)
}
y.forEach = function (t, e) {
  Gt(this),
    this.g.forEach(function (n, r) {
      n.forEach(function (i) {
        t.call(e, i, r, this)
      }, this)
    }, this)
}
y.ta = function () {
  Gt(this)
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
  Gt(this)
  let e = []
  if (typeof t == 'string')
    Pv(this, t) && (e = e.concat(this.g.get(pr(this, t))))
  else {
    t = Array.from(this.g.values())
    for (let n = 0; n < t.length; n++) e = e.concat(t[n])
  }
  return e
}
y.set = function (t, e) {
  return (
    Gt(this),
    (this.i = null),
    (t = pr(this, t)),
    Pv(this, t) && (this.h -= this.g.get(t).length),
    this.g.set(t, [e]),
    (this.h += 1),
    this
  )
}
y.get = function (t, e) {
  return t ? ((t = this.Z(t)), 0 < t.length ? String(t[0]) : e) : e
}
function Ov(t, e, n) {
  Mv(t, e),
    0 < n.length && ((t.i = null), t.g.set(pr(t, e), Ad(n)), (t.h += n.length))
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
function pr(t, e) {
  return (e = String(e)), t.j && (e = e.toLowerCase()), e
}
function XS(t, e) {
  e &&
    !t.j &&
    (Gt(t),
    (t.i = null),
    t.g.forEach(function (n, r) {
      var i = r.toLowerCase()
      r != i && (Mv(this, r), Ov(this, i, n))
    }, t)),
    (t.j = e)
}
var eN = class {
  constructor(t, e) {
    ;(this.g = t), (this.map = e)
  }
}
function kv(t) {
  ;(this.l = t || tN),
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
var tN = 10
function Fv(t) {
  return t.h ? !0 : t.g ? t.g.size >= t.j : !1
}
function Lv(t) {
  return t.h ? 1 : t.g ? t.g.size : 0
}
function Dd(t, e) {
  return t.h ? t.h == e : t.g ? t.g.has(e) : !1
}
function Bd(t, e) {
  t.g ? t.g.add(e) : (t.h = e)
}
function Vv(t, e) {
  t.h && t.h == e ? (t.h = null) : t.g && t.g.has(e) && t.g.delete(e)
}
kv.prototype.cancel = function () {
  if (((this.i = Uv(this)), this.h)) this.h.cancel(), (this.h = null)
  else if (this.g && this.g.size !== 0) {
    for (let t of this.g.values()) t.cancel()
    this.g.clear()
  }
}
function Uv(t) {
  if (t.h != null) return t.i.concat(t.h.F)
  if (t.g != null && t.g.size !== 0) {
    let e = t.i
    for (let n of t.g.values()) e = e.concat(n.F)
    return e
  }
  return Ad(t.i)
}
var nN = class {
  stringify(t) {
    return T.JSON.stringify(t, void 0)
  }
  parse(t) {
    return T.JSON.parse(t, void 0)
  }
}
function rN() {
  this.g = new nN()
}
function iN(t, e, n) {
  let r = n || ''
  try {
    Rv(t, function (i, s) {
      let o = i
      ki(i) && (o = Od(i)), e.push(r + s + '=' + encodeURIComponent(o))
    })
  } catch (i) {
    throw (e.push(r + 'type=' + encodeURIComponent('_badmap')), i)
  }
}
function sN(t, e) {
  let n = new oa()
  if (T.Image) {
    let r = new Image()
    ;(r.onload = $o(Wo, n, r, 'TestLoadImage: loaded', !0, e)),
      (r.onerror = $o(Wo, n, r, 'TestLoadImage: error', !1, e)),
      (r.onabort = $o(Wo, n, r, 'TestLoadImage: abort', !1, e)),
      (r.ontimeout = $o(Wo, n, r, 'TestLoadImage: timeout', !1, e)),
      T.setTimeout(function () {
        r.ontimeout && r.ontimeout()
      }, 1e4),
      (r.src = t)
  } else e(!1)
}
function Wo(t, e, n, r, i) {
  try {
    ;(e.onload = null),
      (e.onerror = null),
      (e.onabort = null),
      (e.ontimeout = null),
      i(r)
  } catch {}
}
function Bi(t) {
  ;(this.l = t.ec || null), (this.j = t.ob || !1)
}
le(Bi, Vd)
Bi.prototype.g = function () {
  return new ha(this.l, this.j)
}
Bi.prototype.i = (function (t) {
  return function () {
    return t
  }
})({})
function ha(t, e) {
  ue.call(this),
    (this.F = t),
    (this.u = e),
    (this.m = void 0),
    (this.readyState = $d),
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
le(ha, ue)
var $d = 0
y = ha.prototype
y.open = function (t, e) {
  if (this.readyState != $d)
    throw (this.abort(), Error('Error reopening a connection'))
  ;(this.C = t), (this.B = e), (this.readyState = 1), Oi(this)
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
      ((this.g = !1), $i(this)),
    (this.readyState = $d)
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
      Oi(this)),
    this.g && ((this.readyState = 3), Oi(this), this.g))
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
      jv(this)
    } else t.text().then(this.Za.bind(this), this.ka.bind(this))
}
function jv(t) {
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
    t.done ? $i(this) : Oi(this), this.readyState == 3 && jv(this)
  }
}
y.Za = function (t) {
  this.g && ((this.response = this.responseText = t), $i(this))
}
y.Ya = function (t) {
  this.g && ((this.response = t), $i(this))
}
y.ka = function () {
  this.g && $i(this)
}
function $i(t) {
  ;(t.readyState = 4), (t.l = null), (t.j = null), (t.A = null), Oi(t)
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
function Oi(t) {
  t.onreadystatechange && t.onreadystatechange.call(t)
}
Object.defineProperty(ha.prototype, 'withCredentials', {
  get: function () {
    return this.m === 'include'
  },
  set: function (t) {
    this.m = t ? 'include' : 'same-origin'
  },
})
var oN = T.JSON.parse
function J(t) {
  ue.call(this),
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
    (this.K = Bv),
    (this.L = this.M = !1)
}
le(J, ue)
var Bv = '',
  aN = /^https?$/i,
  cN = ['POST', 'PUT']
y = J.prototype
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
    (this.g = this.u ? this.u.g() : _d.g()),
    (this.C = this.u ? Qy(this.u) : Qy(_d)),
    (this.g.onreadystatechange = Ie(this.La, this))
  try {
    ;(this.G = !0), this.g.open(e, String(t), !0), (this.G = !1)
  } catch (s) {
    Zy(this, s)
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
    !(0 <= rv(cN, e)) ||
      r ||
      i ||
      n.set('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8')
  for (let [s, o] of n) this.g.setRequestHeader(s, o)
  this.K && (this.g.responseType = this.K),
    'withCredentials' in this.g &&
      this.g.withCredentials !== this.M &&
      (this.g.withCredentials = this.M)
  try {
    qv(this),
      0 < this.B &&
        ((this.L = uN(this.g))
          ? ((this.g.timeout = this.B), (this.g.ontimeout = Ie(this.ua, this)))
          : (this.A = Ld(this.ua, this.B, this))),
      (this.v = !0),
      this.g.send(t),
      (this.v = !1)
  } catch (s) {
    Zy(this, s)
  }
}
function uN(t) {
  return fr && typeof t.timeout == 'number' && t.ontimeout !== void 0
}
y.ua = function () {
  typeof bd < 'u' &&
    this.g &&
    ((this.j = 'Timed out after ' + this.B + 'ms, aborting'),
    (this.m = 8),
    pe(this, 'timeout'),
    this.abort(8))
}
function Zy(t, e) {
  ;(t.h = !1),
    t.g && ((t.l = !0), t.g.abort(), (t.l = !1)),
    (t.j = e),
    (t.m = 5),
    $v(t),
    fa(t)
}
function $v(t) {
  t.F || ((t.F = !0), pe(t, 'complete'), pe(t, 'error'))
}
y.abort = function (t) {
  this.g &&
    this.h &&
    ((this.h = !1),
    (this.l = !0),
    this.g.abort(),
    (this.l = !1),
    (this.m = t || 7),
    pe(this, 'complete'),
    pe(this, 'abort'),
    fa(this))
}
y.N = function () {
  this.g &&
    (this.h && ((this.h = !1), (this.l = !0), this.g.abort(), (this.l = !1)),
    fa(this, !0)),
    J.$.N.call(this)
}
y.La = function () {
  this.s || (this.G || this.v || this.l ? Hv(this) : this.kb())
}
y.kb = function () {
  Hv(this)
}
function Hv(t) {
  if (t.h && typeof bd < 'u' && (!t.C[1] || ut(t) != 4 || t.da() != 2)) {
    if (t.v && ut(t) == 4) Ld(t.La, 0, t)
    else if ((pe(t, 'readystatechange'), ut(t) == 4)) {
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
            var i = String(t.I).match(xv)[1] || null
            !i &&
              T.self &&
              T.self.location &&
              (i = T.self.location.protocol.slice(0, -1)),
              (r = !aN.test(i ? i.toLowerCase() : ''))
          }
          n = r
        }
        if (n) pe(t, 'complete'), pe(t, 'success')
        else {
          t.m = 6
          try {
            var s = 2 < ut(t) ? t.g.statusText : ''
          } catch {
            s = ''
          }
          ;(t.j = s + ' [' + t.da() + ']'), $v(t)
        }
      } finally {
        fa(t)
      }
    }
  }
}
function fa(t, e) {
  if (t.g) {
    qv(t)
    let n = t.g,
      r = t.C[0] ? () => {} : null
    ;(t.g = null), (t.C = null), e || pe(t, 'ready')
    try {
      n.onreadystatechange = r
    } catch {}
  }
}
function qv(t) {
  t.g && t.L && (t.g.ontimeout = null),
    t.A && (T.clearTimeout(t.A), (t.A = null))
}
y.isActive = function () {
  return !!this.g
}
function ut(t) {
  return t.g ? t.g.readyState : 0
}
y.da = function () {
  try {
    return 2 < ut(this) ? this.g.status : -1
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
    return t && e.indexOf(t) == 0 && (e = e.substring(t.length)), oN(e)
  }
}
function Xy(t) {
  try {
    if (!t.g) return null
    if ('response' in t.g) return t.g.response
    switch (t.K) {
      case Bv:
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
function lN(t) {
  let e = {}
  t = ((t.g && 2 <= ut(t) && t.g.getAllResponseHeaders()) || '').split(`\r
`)
  for (let r = 0; r < t.length; r++) {
    if (Ai(t[r])) continue
    var n = FS(t[r])
    let i = n[0]
    if (((n = n[1]), typeof n != 'string')) continue
    n = n.trim()
    let s = e[i] || []
    ;(e[i] = s), s.push(n)
  }
  MS(e, function (r) {
    return r.join(', ')
  })
}
y.Ia = function () {
  return this.m
}
y.Sa = function () {
  return typeof this.j == 'string' ? this.j : String(this.j)
}
function zv(t) {
  let e = ''
  return (
    Nd(t, function (n, r) {
      ;(e += r),
        (e += ':'),
        (e += n),
        (e += `\r
`)
    }),
    e
  )
}
function Hd(t, e, n) {
  e: {
    for (r in n) {
      var r = !1
      break e
    }
    r = !0
  }
  r ||
    ((n = zv(n)),
    typeof t == 'string'
      ? n != null && encodeURIComponent(String(n))
      : W(t, e, n))
}
function wi(t, e, n) {
  return (n && n.internalChannelParams && n.internalChannelParams[t]) || e
}
function Gv(t) {
  ;(this.Ga = 0),
    (this.j = []),
    (this.l = new oa()),
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
    (this.cb = wi('failFast', !1, t)),
    (this.G = this.v = this.u = this.m = this.h = null),
    (this.aa = !0),
    (this.Fa = this.V = -1),
    (this.ba = this.A = this.C = 0),
    (this.ab = wi('baseRetryDelayMs', 5e3, t)),
    (this.hb = wi('retryDelaySeedMs', 1e4, t)),
    (this.eb = wi('forwardChannelMaxRetries', 2, t)),
    (this.xa = wi('forwardChannelRequestTimeoutMs', 2e4, t)),
    (this.va = (t && t.xmlHttpFactory) || void 0),
    (this.Ha = (t && t.useFetchStreams) || !1),
    (this.L = void 0),
    (this.J = (t && t.supportsCrossDomainXhr) || !1),
    (this.K = ''),
    (this.i = new kv(t && t.concurrentRequestLimit)),
    (this.Ja = new rN()),
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
y = Gv.prototype
y.ra = 8
y.H = 1
function qd(t) {
  if ((Wv(t), t.H == 3)) {
    var e = t.W++,
      n = At(t.I)
    if (
      (W(n, 'SID', t.K),
      W(n, 'RID', e),
      W(n, 'TYPE', 'terminate'),
      Hi(t, n),
      (e = new Ui(t, t.l, e)),
      (e.L = 2),
      (e.A = da(At(n))),
      (n = !1),
      T.navigator && T.navigator.sendBeacon)
    )
      try {
        n = T.navigator.sendBeacon(e.A.toString(), '')
      } catch {}
    !n && T.Image && ((new Image().src = e.A), (n = !0)),
      n || ((e.g = t_(e.l, null)), e.g.ha(e.A)),
      (e.G = Date.now()),
      ji(e)
  }
  Xv(t)
}
function pa(t) {
  t.g && (Gd(t), t.g.cancel(), (t.g = null))
}
function Wv(t) {
  pa(t),
    t.u && (T.clearTimeout(t.u), (t.u = null)),
    Jo(t),
    t.i.cancel(),
    t.m && (typeof t.m == 'number' && T.clearTimeout(t.m), (t.m = null))
}
function ga(t) {
  if (!Fv(t.i) && !t.m) {
    t.m = !0
    var e = t.Na
    Ni || gv(), Ri || (Ni(), (Ri = !0)), kd.add(e, t), (t.C = 0)
  }
}
function dN(t, e) {
  return Lv(t.i) >= t.i.j - (t.m ? 1 : 0)
    ? !1
    : t.m
      ? ((t.j = e.F.concat(t.j)), !0)
      : t.H == 1 || t.H == 2 || t.C >= (t.cb ? 0 : t.eb)
        ? !1
        : ((t.m = Li(Ie(t.Na, t, e), Zv(t, t.C))), t.C++, !0)
}
y.Na = function (t) {
  if (this.m)
    if (((this.m = null), this.H == 1)) {
      if (!t) {
        ;(this.W = Math.floor(1e5 * Math.random())), (t = this.W++)
        let i = new Ui(this, this.l, t),
          s = this.s
        if (
          (this.U && (s ? ((s = av(s)), cv(s, this.U)) : (s = this.U)),
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
        ;(e = Kv(this, i, e)),
          (n = At(this.I)),
          W(n, 'RID', t),
          W(n, 'CVER', 22),
          this.F && W(n, 'X-HTTP-Session-Id', this.F),
          Hi(this, n),
          s &&
            (this.O
              ? (e = 'headers=' + encodeURIComponent(String(zv(s))) + '&' + e)
              : this.o && Hd(n, this.o, s)),
          Bd(this.i, i),
          this.bb && W(n, 'TYPE', 'init'),
          this.P
            ? (W(n, '$req', e),
              W(n, 'SID', 'null'),
              (i.aa = !0),
              Ed(i, n, null))
            : Ed(i, n, e),
          (this.H = 2)
      }
    } else
      this.H == 3 &&
        (t ? ev(this, t) : this.j.length == 0 || Fv(this.i) || ev(this))
}
function ev(t, e) {
  var n
  e ? (n = e.m) : (n = t.W++)
  let r = At(t.I)
  W(r, 'SID', t.K),
    W(r, 'RID', n),
    W(r, 'AID', t.V),
    Hi(t, r),
    t.o && t.s && Hd(r, t.o, t.s),
    (n = new Ui(t, t.l, n, t.C + 1)),
    t.o === null && (n.I = t.s),
    e && (t.j = e.F.concat(t.j)),
    (e = Kv(t, n, 1e3)),
    n.setTimeout(
      Math.round(0.5 * t.xa) + Math.round(0.5 * t.xa * Math.random())
    ),
    Bd(t.i, n),
    Ed(n, r, e)
}
function Hi(t, e) {
  t.na &&
    Nd(t.na, function (n, r) {
      W(e, r, n)
    }),
    t.h &&
      Rv({}, function (n, r) {
        W(e, r, n)
      })
}
function Kv(t, e, n) {
  n = Math.min(t.j.length, n)
  var r = t.h ? Ie(t.h.Va, t.h, t) : null
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
            iN(l, o, 'req' + u + '_')
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
function Qv(t) {
  if (!t.g && !t.u) {
    t.ba = 1
    var e = t.Ma
    Ni || gv(), Ri || (Ni(), (Ri = !0)), kd.add(e, t), (t.A = 0)
  }
}
function zd(t) {
  return t.g || t.u || 3 <= t.A
    ? !1
    : (t.ba++, (t.u = Li(Ie(t.Ma, t), Zv(t, t.A))), t.A++, !0)
}
y.Ma = function () {
  if (
    ((this.u = null),
    Yv(this),
    this.ca && !(this.M || this.g == null || 0 >= this.S))
  ) {
    var t = 2 * this.S
    this.l.info('BP detection timer enabled: ' + t),
      (this.B = Li(Ie(this.jb, this), t))
  }
}
y.jb = function () {
  this.B &&
    ((this.B = null),
    this.l.info('BP detection timeout reached.'),
    this.l.info('Buffering proxy detected and switch to long-polling!'),
    (this.G = !1),
    (this.M = !0),
    Ce(10),
    pa(this),
    Yv(this))
}
function Gd(t) {
  t.B != null && (T.clearTimeout(t.B), (t.B = null))
}
function Yv(t) {
  ;(t.g = new Ui(t, t.l, 'rpc', t.ba)),
    t.o === null && (t.g.I = t.s),
    (t.g.O = 0)
  var e = At(t.wa)
  W(e, 'RID', 'rpc'),
    W(e, 'SID', t.K),
    W(e, 'AID', t.V),
    W(e, 'CI', t.G ? '0' : '1'),
    !t.G && t.qa && W(e, 'TO', t.qa),
    W(e, 'TYPE', 'xmlhttp'),
    Hi(t, e),
    t.o && t.s && Hd(e, t.o, t.s),
    t.L && t.g.setTimeout(t.L)
  var n = t.g
  ;(t = t.pa), (n.L = 1), (n.A = da(At(e))), (n.u = null), (n.S = !0), bv(n, t)
}
y.ib = function () {
  this.v != null && ((this.v = null), pa(this), zd(this), Ce(19))
}
function Jo(t) {
  t.v != null && (T.clearTimeout(t.v), (t.v = null))
}
function Jv(t, e) {
  var n = null
  if (t.g == e) {
    Jo(t), Gd(t), (t.g = null)
    var r = 2
  } else if (Dd(t.i, e)) (n = e.F), Vv(t.i, e), (r = 1)
  else return
  if (t.H != 0) {
    if (e.i)
      if (r == 1) {
        ;(n = e.u ? e.u.length : 0), (e = Date.now() - e.G)
        var i = t.C
        ;(r = aa()), pe(r, new Ev(r, n)), ga(t)
      } else Qv(t)
    else if (
      ((i = e.s),
      i == 3 ||
        (i == 0 && 0 < e.ca) ||
        !((r == 1 && dN(t, e)) || (r == 2 && zd(t))))
    )
      switch ((n && 0 < n.length && ((e = t.i), (e.i = e.i.concat(n))), i)) {
        case 1:
          Cn(t, 5)
          break
        case 4:
          Cn(t, 10)
          break
        case 3:
          Cn(t, 6)
          break
        default:
          Cn(t, 2)
      }
  }
}
function Zv(t, e) {
  let n = t.ab + Math.floor(Math.random() * t.hb)
  return t.isActive() || (n *= 2), n * e
}
function Cn(t, e) {
  if ((t.l.info('Error code ' + e), e == 2)) {
    var n = null
    t.h && (n = null)
    var r = Ie(t.pb, t)
    n ||
      ((n = new bn('//www.google.com/images/cleardot.gif')),
      (T.location && T.location.protocol == 'http') || Qo(n, 'https'),
      da(n)),
      sN(n.toString(), r)
  } else Ce(2)
  ;(t.H = 0), t.h && t.h.za(e), Xv(t), Wv(t)
}
y.pb = function (t) {
  t
    ? (this.l.info('Successfully pinged google.com'), Ce(2))
    : (this.l.info('Failed to ping google.com'), Ce(1))
}
function Xv(t) {
  if (((t.H = 0), (t.ma = []), t.h)) {
    let e = Uv(t.i)
    ;(e.length != 0 || t.j.length != 0) &&
      (zy(t.ma, e),
      zy(t.ma, t.j),
      (t.i.i.length = 0),
      Ad(t.j),
      (t.j.length = 0)),
      t.h.ya()
  }
}
function e_(t, e, n) {
  var r = n instanceof bn ? At(n) : new bn(n)
  if (r.g != '') e && (r.g = e + '.' + r.g), Yo(r, r.m)
  else {
    var i = T.location
    ;(r = i.protocol),
      (e = e ? e + '.' + i.hostname : i.hostname),
      (i = +i.port)
    var s = new bn(null)
    r && Qo(s, r), e && (s.g = e), i && Yo(s, i), n && (s.l = n), (r = s)
  }
  return (
    (n = t.F), (e = t.Da), n && e && W(r, n, e), W(r, 'VER', t.ra), Hi(t, r), r
  )
}
function t_(t, e, n) {
  if (e && !t.J)
    throw Error("Can't create secondary domain capable XhrIo object.")
  return (
    (e = t.Ha && !t.va ? new J(new Bi({ ob: n })) : new J(t.va)), e.Oa(t.J), e
  )
}
y.isActive = function () {
  return !!this.h && this.h.isActive(this)
}
function n_() {}
y = n_.prototype
y.Ba = function () {}
y.Aa = function () {}
y.za = function () {}
y.ya = function () {}
y.isActive = function () {
  return !0
}
y.Va = function () {}
function Zo() {
  if (fr && !(10 <= Number(SS)))
    throw Error('Environmental error: no available transport.')
}
Zo.prototype.g = function (t, e) {
  return new Me(t, e)
}
function Me(t, e) {
  ue.call(this),
    (this.g = new Gv(e)),
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
    (t = e && e.cc) && !Ai(t) && (this.g.o = t),
    (this.A = (e && e.supportsCrossDomainXhr) || !1),
    (this.v = (e && e.sendRawJson) || !1),
    (e = e && e.httpSessionIdParam) &&
      !Ai(e) &&
      ((this.g.F = e),
      (t = this.h),
      t !== null && e in t && ((t = this.h), e in t && delete t[e])),
    (this.j = new gr(this))
}
le(Me, ue)
Me.prototype.m = function () {
  ;(this.g.h = this.j), this.A && (this.g.J = !0)
  var t = this.g,
    e = this.l,
    n = this.h || void 0
  Ce(0),
    (t.Y = e),
    (t.na = n || {}),
    (t.G = t.aa),
    (t.I = e_(t, null, t.Y)),
    ga(t)
}
Me.prototype.close = function () {
  qd(this.g)
}
Me.prototype.u = function (t) {
  var e = this.g
  if (typeof t == 'string') {
    var n = {}
    ;(n.__data__ = t), (t = n)
  } else this.v && ((n = {}), (n.__data__ = Od(t)), (t = n))
  e.j.push(new eN(e.fb++, t)), e.H == 3 && ga(e)
}
Me.prototype.N = function () {
  ;(this.g.h = null),
    delete this.j,
    qd(this.g),
    delete this.g,
    Me.$.N.call(this)
}
function r_(t) {
  Ud.call(this),
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
le(r_, Ud)
function i_() {
  jd.call(this), (this.status = 1)
}
le(i_, jd)
function gr(t) {
  this.g = t
}
le(gr, n_)
gr.prototype.Ba = function () {
  pe(this.g, 'a')
}
gr.prototype.Aa = function (t) {
  pe(this.g, new r_(t))
}
gr.prototype.za = function (t) {
  pe(this.g, new i_())
}
gr.prototype.ya = function () {
  pe(this.g, 'b')
}
function hN() {
  this.blockSize = -1
}
function Ge() {
  ;(this.blockSize = -1),
    (this.blockSize = 64),
    (this.g = Array(4)),
    (this.m = Array(this.blockSize)),
    (this.i = this.h = 0),
    this.reset()
}
le(Ge, hN)
Ge.prototype.reset = function () {
  ;(this.g[0] = 1732584193),
    (this.g[1] = 4023233417),
    (this.g[2] = 2562383102),
    (this.g[3] = 271733878),
    (this.i = this.h = 0)
}
function ud(t, e, n) {
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
Ge.prototype.j = function (t, e) {
  e === void 0 && (e = t.length)
  for (var n = e - this.blockSize, r = this.m, i = this.h, s = 0; s < e; ) {
    if (i == 0) for (; s <= n; ) ud(this, t, s), (s += this.blockSize)
    if (typeof t == 'string') {
      for (; s < e; )
        if (((r[i++] = t.charCodeAt(s++)), i == this.blockSize)) {
          ud(this, r), (i = 0)
          break
        }
    } else
      for (; s < e; )
        if (((r[i++] = t[s++]), i == this.blockSize)) {
          ud(this, r), (i = 0)
          break
        }
  }
  ;(this.h = i), (this.i += e)
}
Ge.prototype.l = function () {
  var t = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h)
  t[0] = 128
  for (var e = 1; e < t.length - 8; ++e) t[e] = 0
  var n = 8 * this.i
  for (e = t.length - 8; e < t.length; ++e) (t[e] = n & 255), (n /= 256)
  for (this.j(t), t = Array(16), e = n = 0; 4 > e; ++e)
    for (var r = 0; 32 > r; r += 8) t[n++] = (this.g[e] >>> r) & 255
  return t
}
function B(t, e) {
  this.h = e
  for (var n = [], r = !0, i = t.length - 1; 0 <= i; i--) {
    var s = t[i] | 0
    ;(r && s == e) || ((n[i] = s), (r = !1))
  }
  this.g = n
}
var fN = {}
function Wd(t) {
  return -128 <= t && 128 > t
    ? CS(t, function (e) {
        return new B([e | 0], 0 > e ? -1 : 0)
      })
    : new B([t | 0], 0 > t ? -1 : 0)
}
function lt(t) {
  if (isNaN(t) || !isFinite(t)) return hr
  if (0 > t) return fe(lt(-t))
  for (var e = [], n = 1, r = 0; t >= n; r++) (e[r] = (t / n) | 0), (n *= Td)
  return new B(e, 0)
}
function s_(t, e) {
  if (t.length == 0) throw Error('number format error: empty string')
  if (((e = e || 10), 2 > e || 36 < e)) throw Error('radix out of range: ' + e)
  if (t.charAt(0) == '-') return fe(s_(t.substring(1), e))
  if (0 <= t.indexOf('-'))
    throw Error('number format error: interior "-" character')
  for (var n = lt(Math.pow(e, 8)), r = hr, i = 0; i < t.length; i += 8) {
    var s = Math.min(8, t.length - i),
      o = parseInt(t.substring(i, i + s), e)
    8 > s
      ? ((s = lt(Math.pow(e, s))), (r = r.R(s).add(lt(o))))
      : ((r = r.R(n)), (r = r.add(lt(o))))
  }
  return r
}
var Td = 4294967296,
  hr = Wd(0),
  Cd = Wd(1),
  tv = Wd(16777216)
y = B.prototype
y.ea = function () {
  if (Le(this)) return -fe(this).ea()
  for (var t = 0, e = 1, n = 0; n < this.g.length; n++) {
    var r = this.D(n)
    ;(t += (0 <= r ? r : Td + r) * e), (e *= Td)
  }
  return t
}
y.toString = function (t) {
  if (((t = t || 10), 2 > t || 36 < t)) throw Error('radix out of range: ' + t)
  if (bt(this)) return '0'
  if (Le(this)) return '-' + fe(this).toString(t)
  for (var e = lt(Math.pow(t, 6)), n = this, r = ''; ; ) {
    var i = ea(n, e).g
    n = Xo(n, i.R(e))
    var s = ((0 < n.g.length ? n.g[0] : n.h) >>> 0).toString(t)
    if (((n = i), bt(n))) return s + r
    for (; 6 > s.length; ) s = '0' + s
    r = s + r
  }
}
y.D = function (t) {
  return 0 > t ? 0 : t < this.g.length ? this.g[t] : this.h
}
function bt(t) {
  if (t.h != 0) return !1
  for (var e = 0; e < t.g.length; e++) if (t.g[e] != 0) return !1
  return !0
}
function Le(t) {
  return t.h == -1
}
y.X = function (t) {
  return (t = Xo(this, t)), Le(t) ? -1 : bt(t) ? 0 : 1
}
function fe(t) {
  for (var e = t.g.length, n = [], r = 0; r < e; r++) n[r] = ~t.g[r]
  return new B(n, ~t.h).add(Cd)
}
y.abs = function () {
  return Le(this) ? fe(this) : this
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
  return new B(n, n[n.length - 1] & -2147483648 ? -1 : 0)
}
function Xo(t, e) {
  return t.add(fe(e))
}
y.R = function (t) {
  if (bt(this) || bt(t)) return hr
  if (Le(this)) return Le(t) ? fe(this).R(fe(t)) : fe(fe(this).R(t))
  if (Le(t)) return fe(this.R(fe(t)))
  if (0 > this.X(tv) && 0 > t.X(tv)) return lt(this.ea() * t.ea())
  for (var e = this.g.length + t.g.length, n = [], r = 0; r < 2 * e; r++)
    n[r] = 0
  for (r = 0; r < this.g.length; r++)
    for (var i = 0; i < t.g.length; i++) {
      var s = this.D(r) >>> 16,
        o = this.D(r) & 65535,
        a = t.D(i) >>> 16,
        c = t.D(i) & 65535
      ;(n[2 * r + 2 * i] += o * c),
        Ko(n, 2 * r + 2 * i),
        (n[2 * r + 2 * i + 1] += s * c),
        Ko(n, 2 * r + 2 * i + 1),
        (n[2 * r + 2 * i + 1] += o * a),
        Ko(n, 2 * r + 2 * i + 1),
        (n[2 * r + 2 * i + 2] += s * a),
        Ko(n, 2 * r + 2 * i + 2)
    }
  for (r = 0; r < e; r++) n[r] = (n[2 * r + 1] << 16) | n[2 * r]
  for (r = e; r < 2 * e; r++) n[r] = 0
  return new B(n, 0)
}
function Ko(t, e) {
  for (; (t[e] & 65535) != t[e]; )
    (t[e + 1] += t[e] >>> 16), (t[e] &= 65535), e++
}
function Di(t, e) {
  ;(this.g = t), (this.h = e)
}
function ea(t, e) {
  if (bt(e)) throw Error('division by zero')
  if (bt(t)) return new Di(hr, hr)
  if (Le(t)) return (e = ea(fe(t), e)), new Di(fe(e.g), fe(e.h))
  if (Le(e)) return (e = ea(t, fe(e))), new Di(fe(e.g), e.h)
  if (30 < t.g.length) {
    if (Le(t) || Le(e))
      throw Error('slowDivide_ only works with positive integers.')
    for (var n = Cd, r = e; 0 >= r.X(t); ) (n = nv(n)), (r = nv(r))
    var i = lr(n, 1),
      s = lr(r, 1)
    for (r = lr(r, 2), n = lr(n, 2); !bt(r); ) {
      var o = s.add(r)
      0 >= o.X(t) && ((i = i.add(n)), (s = o)), (r = lr(r, 1)), (n = lr(n, 1))
    }
    return (e = Xo(t, i.R(e))), new Di(i, e)
  }
  for (i = hr; 0 <= t.X(e); ) {
    for (
      n = Math.max(1, Math.floor(t.ea() / e.ea())),
        r = Math.ceil(Math.log(n) / Math.LN2),
        r = 48 >= r ? 1 : Math.pow(2, r - 48),
        s = lt(n),
        o = s.R(e);
      Le(o) || 0 < o.X(t);

    )
      (n -= r), (s = lt(n)), (o = s.R(e))
    bt(s) && (s = Cd), (i = i.add(s)), (t = Xo(t, o))
  }
  return new Di(i, t)
}
y.gb = function (t) {
  return ea(this, t).h
}
y.and = function (t) {
  for (var e = Math.max(this.g.length, t.g.length), n = [], r = 0; r < e; r++)
    n[r] = this.D(r) & t.D(r)
  return new B(n, this.h & t.h)
}
y.or = function (t) {
  for (var e = Math.max(this.g.length, t.g.length), n = [], r = 0; r < e; r++)
    n[r] = this.D(r) | t.D(r)
  return new B(n, this.h | t.h)
}
y.xor = function (t) {
  for (var e = Math.max(this.g.length, t.g.length), n = [], r = 0; r < e; r++)
    n[r] = this.D(r) ^ t.D(r)
  return new B(n, this.h ^ t.h)
}
function nv(t) {
  for (var e = t.g.length + 1, n = [], r = 0; r < e; r++)
    n[r] = (t.D(r) << 1) | (t.D(r - 1) >>> 31)
  return new B(n, t.h)
}
function lr(t, e) {
  var n = e >> 5
  e %= 32
  for (var r = t.g.length - n, i = [], s = 0; s < r; s++)
    i[s] =
      0 < e ? (t.D(s + n) >>> e) | (t.D(s + n + 1) << (32 - e)) : t.D(s + n)
  return new B(i, t.h)
}
Zo.prototype.createWebChannel = Zo.prototype.g
Me.prototype.send = Me.prototype.u
Me.prototype.open = Me.prototype.m
Me.prototype.close = Me.prototype.close
ca.NO_ERROR = 0
ca.TIMEOUT = 8
ca.HTTP_ERROR = 6
wv.COMPLETE = 'complete'
Dv.EventType = Vi
Vi.OPEN = 'a'
Vi.CLOSE = 'b'
Vi.ERROR = 'c'
Vi.MESSAGE = 'd'
ue.prototype.listen = ue.prototype.O
J.prototype.listenOnce = J.prototype.P
J.prototype.getLastError = J.prototype.Sa
J.prototype.getLastErrorCode = J.prototype.Ia
J.prototype.getStatus = J.prototype.da
J.prototype.getResponseJson = J.prototype.Wa
J.prototype.getResponseText = J.prototype.ja
J.prototype.send = J.prototype.ha
J.prototype.setWithCredentials = J.prototype.Oa
Ge.prototype.digest = Ge.prototype.l
Ge.prototype.reset = Ge.prototype.reset
Ge.prototype.update = Ge.prototype.j
B.prototype.add = B.prototype.add
B.prototype.multiply = B.prototype.R
B.prototype.modulo = B.prototype.gb
B.prototype.compare = B.prototype.X
B.prototype.toNumber = B.prototype.ea
B.prototype.toString = B.prototype.toString
B.prototype.getBits = B.prototype.D
B.fromNumber = lt
B.fromString = s_
var o_ = (We.createWebChannelTransport = function () {
    return new Zo()
  }),
  a_ = (We.getStatEventTarget = function () {
    return aa()
  }),
  ma = (We.ErrorCode = ca),
  c_ = (We.EventType = wv),
  u_ = (We.Event = An),
  Kd = (We.Stat = {
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
  v1 = (We.FetchXmlHttpFactory = Bi),
  qi = (We.WebChannel = Dv),
  l_ = (We.XhrIo = J),
  d_ = (We.Md5 = Ge),
  Sn = (We.Integer = B)
var h_ = '@firebase/firestore'
var de = class {
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
;(de.UNAUTHENTICATED = new de(null)),
  (de.GOOGLE_CREDENTIALS = new de('google-credentials-uid')),
  (de.FIRST_PARTY = new de('first-party-uid')),
  (de.MOCK_USER = new de('mock-user'))
var Fr = '10.7.2'
var kn = new Bt('@firebase/firestore')
function zi() {
  return kn.logLevel
}
function v(t, ...e) {
  if (kn.logLevel <= x.DEBUG) {
    let n = e.map(Rf)
    kn.debug(`Firestore (${Fr}): ${t}`, ...n)
  }
}
function pt(t, ...e) {
  if (kn.logLevel <= x.ERROR) {
    let n = e.map(Rf)
    kn.error(`Firestore (${Fr}): ${t}`, ...n)
  }
}
function Tr(t, ...e) {
  if (kn.logLevel <= x.WARN) {
    let n = e.map(Rf)
    kn.warn(`Firestore (${Fr}): ${t}`, ...n)
  }
}
function Rf(t) {
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
  let e = `FIRESTORE (${Fr}) INTERNAL ASSERTION FAILED: ` + t
  throw (pt(e), new Error(e))
}
function se(t, e) {
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
  w = class extends ke {
    constructor(e, n) {
      super(e, n),
        (this.code = e),
        (this.message = n),
        (this.toString = () =>
          `${this.name}: [code=${this.code}]: ${this.message}`)
    }
  }
var Nt = class {
  constructor() {
    this.promise = new Promise((e, n) => {
      ;(this.resolve = e), (this.reject = n)
    })
  }
}
var Ea = class {
    constructor(e, n) {
      ;(this.user = n),
        (this.type = 'OAuth'),
        (this.headers = new Map()),
        this.headers.set('Authorization', `Bearer ${e}`)
    }
  },
  eh = class {
    getToken() {
      return Promise.resolve(null)
    }
    invalidateToken() {}
    start(e, n) {
      e.enqueueRetryable(() => n(de.UNAUTHENTICATED))
    }
    shutdown() {}
  },
  th = class {
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
  nh = class {
    constructor(e) {
      ;(this.t = e),
        (this.currentUser = de.UNAUTHENTICATED),
        (this.i = 0),
        (this.forceRefresh = !1),
        (this.auth = null)
    }
    start(e, n) {
      let r = this.i,
        i = (c) => (this.i !== r ? ((r = this.i), n(c)) : Promise.resolve()),
        s = new Nt()
      this.o = () => {
        this.i++,
          (this.currentUser = this.u()),
          s.resolve(),
          (s = new Nt()),
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
                (s = new Nt()))
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
                    ? (se(typeof r.accessToken == 'string'),
                      new Ea(r.accessToken, this.currentUser))
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
      return se(e === null || typeof e == 'string'), new de(e)
    }
  },
  rh = class {
    constructor(e, n, r) {
      ;(this.l = e),
        (this.h = n),
        (this.P = r),
        (this.type = 'FirstParty'),
        (this.user = de.FIRST_PARTY),
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
  ih = class {
    constructor(e, n, r) {
      ;(this.l = e), (this.h = n), (this.P = r)
    }
    getToken() {
      return Promise.resolve(new rh(this.l, this.h, this.P))
    }
    start(e, n) {
      e.enqueueRetryable(() => n(de.FIRST_PARTY))
    }
    shutdown() {}
    invalidateToken() {}
  },
  sh = class {
    constructor(e) {
      ;(this.value = e),
        (this.type = 'AppCheck'),
        (this.headers = new Map()),
        e && e.length > 0 && this.headers.set('x-firebase-appcheck', this.value)
    }
  },
  oh = class {
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
                  ? (se(typeof n.token == 'string'),
                    (this.R = n.token),
                    new sh(n.token))
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
function pN(t) {
  let e = typeof self < 'u' && (self.crypto || self.msCrypto),
    n = new Uint8Array(t)
  if (e && typeof e.getRandomValues == 'function') e.getRandomValues(n)
  else for (let r = 0; r < t; r++) n[r] = Math.floor(256 * Math.random())
  return n
}
var ah = class {
  static newId() {
    let e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      n = Math.floor(256 / e.length) * e.length,
      r = ''
    for (; r.length < 20; ) {
      let i = pN(40)
      for (let s = 0; s < i.length; ++s)
        r.length < 20 && i[s] < n && (r += e.charAt(i[s] % e.length))
    }
    return r
  }
}
function V(t, e) {
  return t < e ? -1 : t > e ? 1 : 0
}
function Cr(t, e, n) {
  return t.length === e.length && t.every((r, i) => n(r, e[i]))
}
var Ve = class t {
  constructor(e, n) {
    if (((this.seconds = e), (this.nanoseconds = n), n < 0))
      throw new w(
        m.INVALID_ARGUMENT,
        'Timestamp nanoseconds out of range: ' + n
      )
    if (n >= 1e9)
      throw new w(
        m.INVALID_ARGUMENT,
        'Timestamp nanoseconds out of range: ' + n
      )
    if (e < -62135596800)
      throw new w(m.INVALID_ARGUMENT, 'Timestamp seconds out of range: ' + e)
    if (e >= 253402300800)
      throw new w(m.INVALID_ARGUMENT, 'Timestamp seconds out of range: ' + e)
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
    return new t(new Ve(0, 0))
  }
  static max() {
    return new t(new Ve(253402300799, 999999999))
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
var wa = class t {
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
  ie = class t extends wa {
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
          throw new w(
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
  gN = /^[_a-zA-Z][_a-zA-Z0-9]*$/,
  Ke = class t extends wa {
    construct(e, n, r) {
      return new t(e, n, r)
    }
    static isValidIdentifier(e) {
      return gN.test(e)
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
            throw new w(
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
            throw new w(
              m.INVALID_ARGUMENT,
              'Path has trailing escape character: ' + e
            )
          let c = e[i + 1]
          if (c !== '\\' && c !== '.' && c !== '`')
            throw new w(
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
        throw new w(m.INVALID_ARGUMENT, 'Unterminated ` in path: ' + e)
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
    return new t(ie.fromString(e))
  }
  static fromName(e) {
    return new t(ie.fromString(e).popFirst(5))
  }
  static empty() {
    return new t(ie.emptyPath())
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
    return e !== null && ie.comparator(this.path, e.path) === 0
  }
  toString() {
    return this.path.toString()
  }
  static comparator(e, n) {
    return ie.comparator(e.path, n.path)
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0
  }
  static fromSegments(e) {
    return new t(new ie(e.slice()))
  }
}
var ch = class {
  constructor(e, n, r, i) {
    ;(this.indexId = e),
      (this.collectionGroup = n),
      (this.fields = r),
      (this.indexState = i)
  }
}
ch.UNKNOWN_ID = -1
function mN(t, e) {
  let n = t.toTimestamp().seconds,
    r = t.toTimestamp().nanoseconds + 1,
    i = A.fromTimestamp(r === 1e9 ? new Ve(n + 1, 0) : new Ve(n, r))
  return new Fn(i, D.empty(), e)
}
function yN(t) {
  return new Fn(t.readTime, t.key, -1)
}
var Fn = class t {
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
function vN(t, e) {
  let n = t.readTime.compareTo(e.readTime)
  return n !== 0
    ? n
    : ((n = D.comparator(t.documentKey, e.documentKey)),
      n !== 0 ? n : V(t.largestBatchId, e.largestBatchId))
}
var _N =
    'The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.',
  uh = class {
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
function xf(t) {
  return p(this, null, function* () {
    if (t.code !== m.FAILED_PRECONDITION || t.message !== _N) throw t
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
var lh = class t {
    constructor(e, n) {
      ;(this.action = e),
        (this.transaction = n),
        (this.aborted = !1),
        (this.V = new Nt()),
        (this.transaction.oncomplete = () => {
          this.V.resolve()
        }),
        (this.transaction.onabort = () => {
          n.error ? this.V.reject(new On(e, n.error)) : this.V.resolve()
        }),
        (this.transaction.onerror = (r) => {
          let i = Mf(r.target.error)
          this.V.reject(new On(e, i))
        })
    }
    static open(e, n, r, i) {
      try {
        return new t(n, e.transaction(i, r))
      } catch (s) {
        throw new On(n, s)
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
      return new hh(n)
    }
  },
  Da = class t {
    constructor(e, n, r) {
      ;(this.name = e),
        (this.version = n),
        (this.p = r),
        t.S(_e()) === 12.2 &&
          pt(
            'Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.'
          )
    }
    static delete(e) {
      return (
        v('SimpleDb', 'Removing database:', e),
        Nn(window.indexedDB.deleteDatabase(e)).toPromise()
      )
    }
    static D() {
      if (!Do()) return !1
      if (t.C()) return !0
      let e = _e(),
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
                    new On(
                      e,
                      'Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed.'
                    )
                  )
                }),
                (i.onerror = (s) => {
                  let o = s.target.error
                  o.name === 'VersionError'
                    ? r(
                        new w(
                          m.FAILED_PRECONDITION,
                          'A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.'
                        )
                      )
                    : o.name === 'InvalidStateError'
                      ? r(
                          new w(
                            m.FAILED_PRECONDITION,
                            'Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: ' +
                              o
                          )
                        )
                      : r(new On(e, o))
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
            let a = lh.open(this.db, e, s ? 'readonly' : 'readwrite', r),
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
  dh = class {
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
      return Nn(this.k.delete())
    }
  },
  On = class extends w {
    constructor(e, n) {
      super(m.UNAVAILABLE, `IndexedDB transaction '${e}' failed: ${n}`),
        (this.name = 'IndexedDbTransactionError')
    }
  }
function ls(t) {
  return t.name === 'IndexedDbTransactionError'
}
var hh = class {
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
      Nn(r)
    )
  }
  add(e) {
    return v('SimpleDb', 'ADD', this.store.name, e, e), Nn(this.store.add(e))
  }
  get(e) {
    return Nn(this.store.get(e)).next(
      (n) => (
        n === void 0 && (n = null),
        v('SimpleDb', 'GET', this.store.name, e, n),
        n
      )
    )
  }
  delete(e) {
    return v('SimpleDb', 'DELETE', this.store.name, e), Nn(this.store.delete(e))
  }
  count() {
    return v('SimpleDb', 'COUNT', this.store.name), Nn(this.store.count())
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
        let o = Mf(s.target.error)
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
          let c = new dh(a),
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
function Nn(t) {
  return new g((e, n) => {
    ;(t.onsuccess = (r) => {
      let i = r.target.result
      e(i)
    }),
      (t.onerror = (r) => {
        let i = Mf(r.target.error)
        n(i)
      })
  })
}
var f_ = !1
function Mf(t) {
  let e = Da.S(_e())
  if (e >= 12.2 && e < 13) {
    let n = 'An internal error was encountered in the Indexed Database server'
    if (t.message.indexOf(n) >= 0) {
      let r = new w(
        'internal',
        `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${n}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`
      )
      return (
        f_ ||
          ((f_ = !0),
          setTimeout(() => {
            throw r
          }, 0)),
        r
      )
    }
  }
  return t
}
var H_ = (() => {
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
function Ka(t) {
  return t == null
}
function Ta(t) {
  return t === 0 && 1 / t == -1 / 0
}
var IN = [
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
  S1 = [...IN, 'documentOverlays'],
  EN = [
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
  wN = EN,
  N1 = [...wN, 'indexConfiguration', 'indexState', 'indexEntries']
function p_(t) {
  let e = 0
  for (let n in t) Object.prototype.hasOwnProperty.call(t, n) && e++
  return e
}
function Qa(t, e) {
  for (let n in t) Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n])
}
function DN(t) {
  for (let e in t) if (Object.prototype.hasOwnProperty.call(t, e)) return !1
  return !0
}
var te = class t {
    constructor(e, n) {
      ;(this.comparator = e), (this.root = n || ht.EMPTY)
    }
    insert(e, n) {
      return new t(
        this.comparator,
        this.root
          .insert(e, n, this.comparator)
          .copy(null, null, ht.BLACK, null, null)
      )
    }
    remove(e) {
      return new t(
        this.comparator,
        this.root
          .remove(e, this.comparator)
          .copy(null, null, ht.BLACK, null, null)
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
      return new _r(this.root, null, this.comparator, !1)
    }
    getIteratorFrom(e) {
      return new _r(this.root, e, this.comparator, !1)
    }
    getReverseIterator() {
      return new _r(this.root, null, this.comparator, !0)
    }
    getReverseIteratorFrom(e) {
      return new _r(this.root, e, this.comparator, !0)
    }
  },
  _r = class {
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
  ht = class t {
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
;(ht.EMPTY = null), (ht.RED = !0), (ht.BLACK = !1)
ht.EMPTY = new (class {
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
    return new ht(e, n)
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
var De = class t {
    constructor(e) {
      ;(this.comparator = e), (this.data = new te(this.comparator))
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
      return new Ca(this.data.getIterator())
    }
    getIteratorFrom(e) {
      return new Ca(this.data.getIteratorFrom(e))
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
  Ca = class {
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
var Rn = class t {
  constructor(e) {
    ;(this.fields = e), e.sort(Ke.comparator)
  }
  static empty() {
    return new t([])
  }
  unionWith(e) {
    let n = new De(Ke.comparator)
    for (let r of this.fields) n = n.add(r)
    for (let r of e) n = n.add(r)
    return new t(n.toArray())
  }
  covers(e) {
    for (let n of this.fields) if (n.isPrefixOf(e)) return !0
    return !1
  }
  isEqual(e) {
    return Cr(this.fields, e.fields, (n, r) => n.isEqual(r))
  }
}
var ba = class extends Error {
  constructor() {
    super(...arguments), (this.name = 'Base64DecodeError')
  }
}
var be = class t {
  constructor(e) {
    this.binaryString = e
  }
  static fromBase64String(e) {
    let n = (function (i) {
      try {
        return atob(i)
      } catch (s) {
        throw typeof DOMException < 'u' && s instanceof DOMException
          ? new ba('Invalid base64 string: ' + s)
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
be.EMPTY_BYTE_STRING = new be('')
var TN = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/)
function Wt(t) {
  if ((se(!!t), typeof t == 'string')) {
    let e = 0,
      n = TN.exec(t)
    if ((se(!!n), n[1])) {
      let i = n[1]
      ;(i = (i + '000000000').substr(0, 9)), (e = Number(i))
    }
    let r = new Date(t)
    return { seconds: Math.floor(r.getTime() / 1e3), nanos: e }
  }
  return { seconds: Z(t.seconds), nanos: Z(t.nanos) }
}
function Z(t) {
  return typeof t == 'number' ? t : typeof t == 'string' ? Number(t) : 0
}
function Kt(t) {
  return typeof t == 'string' ? be.fromBase64String(t) : be.fromUint8Array(t)
}
function Pf(t) {
  var e, n
  return (
    ((n = (
      ((e = t?.mapValue) === null || e === void 0 ? void 0 : e.fields) || {}
    ).__type__) === null || n === void 0
      ? void 0
      : n.stringValue) === 'server_timestamp'
  )
}
function Of(t) {
  let e = t.mapValue.fields.__previous_value__
  return Pf(e) ? Of(e) : e
}
function Zi(t) {
  let e = Wt(t.mapValue.fields.__local_write_time__.timestampValue)
  return new Ve(e.seconds, e.nanos)
}
var fh = class {
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
  Aa = class t {
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
var ya = { mapValue: { fields: { __type__: { stringValue: '__max__' } } } }
function Ln(t) {
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
                      ? Pf(t)
                        ? 4
                        : q_(t)
                          ? 9007199254740991
                          : 10
                      : b()
}
function gt(t, e) {
  if (t === e) return !0
  let n = Ln(t)
  if (n !== Ln(e)) return !1
  switch (n) {
    case 0:
    case 9007199254740991:
      return !0
    case 1:
      return t.booleanValue === e.booleanValue
    case 4:
      return Zi(t).isEqual(Zi(e))
    case 3:
      return (function (i, s) {
        if (
          typeof i.timestampValue == 'string' &&
          typeof s.timestampValue == 'string' &&
          i.timestampValue.length === s.timestampValue.length
        )
          return i.timestampValue === s.timestampValue
        let o = Wt(i.timestampValue),
          a = Wt(s.timestampValue)
        return o.seconds === a.seconds && o.nanos === a.nanos
      })(t, e)
    case 5:
      return t.stringValue === e.stringValue
    case 6:
      return (function (i, s) {
        return Kt(i.bytesValue).isEqual(Kt(s.bytesValue))
      })(t, e)
    case 7:
      return t.referenceValue === e.referenceValue
    case 8:
      return (function (i, s) {
        return (
          Z(i.geoPointValue.latitude) === Z(s.geoPointValue.latitude) &&
          Z(i.geoPointValue.longitude) === Z(s.geoPointValue.longitude)
        )
      })(t, e)
    case 2:
      return (function (i, s) {
        if ('integerValue' in i && 'integerValue' in s)
          return Z(i.integerValue) === Z(s.integerValue)
        if ('doubleValue' in i && 'doubleValue' in s) {
          let o = Z(i.doubleValue),
            a = Z(s.doubleValue)
          return o === a ? Ta(o) === Ta(a) : isNaN(o) && isNaN(a)
        }
        return !1
      })(t, e)
    case 9:
      return Cr(t.arrayValue.values || [], e.arrayValue.values || [], gt)
    case 10:
      return (function (i, s) {
        let o = i.mapValue.fields || {},
          a = s.mapValue.fields || {}
        if (p_(o) !== p_(a)) return !1
        for (let c in o)
          if (o.hasOwnProperty(c) && (a[c] === void 0 || !gt(o[c], a[c])))
            return !1
        return !0
      })(t, e)
    default:
      return b()
  }
}
function Xi(t, e) {
  return (t.values || []).find((n) => gt(n, e)) !== void 0
}
function br(t, e) {
  if (t === e) return 0
  let n = Ln(t),
    r = Ln(e)
  if (n !== r) return V(n, r)
  switch (n) {
    case 0:
    case 9007199254740991:
      return 0
    case 1:
      return V(t.booleanValue, e.booleanValue)
    case 2:
      return (function (s, o) {
        let a = Z(s.integerValue || s.doubleValue),
          c = Z(o.integerValue || o.doubleValue)
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
      return g_(t.timestampValue, e.timestampValue)
    case 4:
      return g_(Zi(t), Zi(e))
    case 5:
      return V(t.stringValue, e.stringValue)
    case 6:
      return (function (s, o) {
        let a = Kt(s),
          c = Kt(o)
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
        let a = V(Z(s.latitude), Z(o.latitude))
        return a !== 0 ? a : V(Z(s.longitude), Z(o.longitude))
      })(t.geoPointValue, e.geoPointValue)
    case 9:
      return (function (s, o) {
        let a = s.values || [],
          c = o.values || []
        for (let u = 0; u < a.length && u < c.length; ++u) {
          let l = br(a[u], c[u])
          if (l) return l
        }
        return V(a.length, c.length)
      })(t.arrayValue, e.arrayValue)
    case 10:
      return (function (s, o) {
        if (s === ya.mapValue && o === ya.mapValue) return 0
        if (s === ya.mapValue) return 1
        if (o === ya.mapValue) return -1
        let a = s.fields || {},
          c = Object.keys(a),
          u = o.fields || {},
          l = Object.keys(u)
        c.sort(), l.sort()
        for (let d = 0; d < c.length && d < l.length; ++d) {
          let h = V(c[d], l[d])
          if (h !== 0) return h
          let f = br(a[c[d]], u[l[d]])
          if (f !== 0) return f
        }
        return V(c.length, l.length)
      })(t.mapValue, e.mapValue)
    default:
      throw b()
  }
}
function g_(t, e) {
  if (typeof t == 'string' && typeof e == 'string' && t.length === e.length)
    return V(t, e)
  let n = Wt(t),
    r = Wt(e),
    i = V(n.seconds, r.seconds)
  return i !== 0 ? i : V(n.nanos, r.nanos)
}
function Ar(t) {
  return ph(t)
}
function ph(t) {
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
                let r = Wt(n)
                return `time(${r.seconds},${r.nanos})`
              })(t.timestampValue)
            : 'stringValue' in t
              ? t.stringValue
              : 'bytesValue' in t
                ? (function (n) {
                    return Kt(n).toBase64()
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
                            i ? (i = !1) : (r += ','), (r += ph(s))
                          return r + ']'
                        })(t.arrayValue)
                      : 'mapValue' in t
                        ? (function (n) {
                            let r = Object.keys(n.fields || {}).sort(),
                              i = '{',
                              s = !0
                            for (let o of r)
                              s ? (s = !1) : (i += ','),
                                (i += `${o}:${ph(n.fields[o])}`)
                            return i + '}'
                          })(t.mapValue)
                        : b()
}
function gh(t) {
  return !!t && 'integerValue' in t
}
function kf(t) {
  return !!t && 'arrayValue' in t
}
function m_(t) {
  return !!t && 'nullValue' in t
}
function y_(t) {
  return !!t && 'doubleValue' in t && isNaN(Number(t.doubleValue))
}
function Qd(t) {
  return !!t && 'mapValue' in t
}
function Wi(t) {
  if (t.geoPointValue)
    return { geoPointValue: Object.assign({}, t.geoPointValue) }
  if (t.timestampValue && typeof t.timestampValue == 'object')
    return { timestampValue: Object.assign({}, t.timestampValue) }
  if (t.mapValue) {
    let e = { mapValue: { fields: {} } }
    return Qa(t.mapValue.fields, (n, r) => (e.mapValue.fields[n] = Wi(r))), e
  }
  if (t.arrayValue) {
    let e = { arrayValue: { values: [] } }
    for (let n = 0; n < (t.arrayValue.values || []).length; ++n)
      e.arrayValue.values[n] = Wi(t.arrayValue.values[n])
    return e
  }
  return Object.assign({}, t)
}
function q_(t) {
  return (
    (((t.mapValue || {}).fields || {}).__type__ || {}).stringValue === '__max__'
  )
}
var St = class t {
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
        if (((n = (n.mapValue.fields || {})[e.get(r)]), !Qd(n))) return null
      return (n = (n.mapValue.fields || {})[e.lastSegment()]), n || null
    }
  }
  set(e, n) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = Wi(n)
  }
  setAll(e) {
    let n = Ke.emptyPath(),
      r = {},
      i = []
    e.forEach((o, a) => {
      if (!n.isImmediateParentOf(a)) {
        let c = this.getFieldsMap(n)
        this.applyChanges(c, r, i), (r = {}), (i = []), (n = a.popLast())
      }
      o ? (r[a.lastSegment()] = Wi(o)) : i.push(a.lastSegment())
    })
    let s = this.getFieldsMap(n)
    this.applyChanges(s, r, i)
  }
  delete(e) {
    let n = this.field(e.popLast())
    Qd(n) && n.mapValue.fields && delete n.mapValue.fields[e.lastSegment()]
  }
  isEqual(e) {
    return gt(this.value, e.value)
  }
  getFieldsMap(e) {
    let n = this.value
    n.mapValue.fields || (n.mapValue = { fields: {} })
    for (let r = 0; r < e.length; ++r) {
      let i = n.mapValue.fields[e.get(r)]
      ;(Qd(i) && i.mapValue.fields) ||
        ((i = { mapValue: { fields: {} } }), (n.mapValue.fields[e.get(r)] = i)),
        (n = i)
    }
    return n.mapValue.fields
  }
  applyChanges(e, n, r) {
    Qa(n, (i, s) => (e[i] = s))
    for (let i of r) delete e[i]
  }
  clone() {
    return new t(Wi(this.value))
  }
}
var Qe = class t {
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
    return new t(e, 0, A.min(), A.min(), A.min(), St.empty(), 0)
  }
  static newFoundDocument(e, n, r, i) {
    return new t(e, 1, n, A.min(), r, i, 0)
  }
  static newNoDocument(e, n) {
    return new t(e, 2, n, A.min(), A.min(), St.empty(), 0)
  }
  static newUnknownDocument(e, n) {
    return new t(e, 3, n, A.min(), A.min(), St.empty(), 2)
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
      (this.data = St.empty()),
      (this.documentState = 0),
      this
    )
  }
  convertToUnknownDocument(e) {
    return (
      (this.version = e),
      (this.documentType = 3),
      (this.data = St.empty()),
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
var Sr = class {
  constructor(e, n) {
    ;(this.position = e), (this.inclusive = n)
  }
}
function v_(t, e, n) {
  let r = 0
  for (let i = 0; i < t.position.length; i++) {
    let s = e[i],
      o = t.position[i]
    if (
      (s.field.isKeyField()
        ? (r = D.comparator(D.fromName(o.referenceValue), n.key))
        : (r = br(o, n.data.field(s.field))),
      s.dir === 'desc' && (r *= -1),
      r !== 0)
    )
      break
  }
  return r
}
function __(t, e) {
  if (t === null) return e === null
  if (
    e === null ||
    t.inclusive !== e.inclusive ||
    t.position.length !== e.position.length
  )
    return !1
  for (let n = 0; n < t.position.length; n++)
    if (!gt(t.position[n], e.position[n])) return !1
  return !0
}
var Nr = class {
  constructor(e, n = 'asc') {
    ;(this.field = e), (this.dir = n)
  }
}
function CN(t, e) {
  return t.dir === e.dir && t.field.isEqual(e.field)
}
var Sa = class {},
  ae = class t extends Sa {
    constructor(e, n, r) {
      super(), (this.field = e), (this.op = n), (this.value = r)
    }
    static create(e, n, r) {
      return e.isKeyField()
        ? n === 'in' || n === 'not-in'
          ? this.createKeyFieldInFilter(e, n, r)
          : new yh(e, n, r)
        : n === 'array-contains'
          ? new Ih(e, r)
          : n === 'in'
            ? new Eh(e, r)
            : n === 'not-in'
              ? new wh(e, r)
              : n === 'array-contains-any'
                ? new Dh(e, r)
                : new t(e, n, r)
    }
    static createKeyFieldInFilter(e, n, r) {
      return n === 'in' ? new vh(e, r) : new _h(e, r)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return this.op === '!='
        ? n !== null && this.matchesComparison(br(n, this.value))
        : n !== null &&
            Ln(this.value) === Ln(n) &&
            this.matchesComparison(br(n, this.value))
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
  mt = class t extends Sa {
    constructor(e, n) {
      super(), (this.filters = e), (this.op = n), (this.ue = null)
    }
    static create(e, n) {
      return new t(e, n)
    }
    matches(e) {
      return z_(this)
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
function z_(t) {
  return t.op === 'and'
}
function G_(t) {
  return bN(t) && z_(t)
}
function bN(t) {
  for (let e of t.filters) if (e instanceof mt) return !1
  return !0
}
function mh(t) {
  if (t instanceof ae)
    return t.field.canonicalString() + t.op.toString() + Ar(t.value)
  if (G_(t)) return t.filters.map((e) => mh(e)).join(',')
  {
    let e = t.filters.map((n) => mh(n)).join(',')
    return `${t.op}(${e})`
  }
}
function W_(t, e) {
  return t instanceof ae
    ? (function (r, i) {
        return (
          i instanceof ae &&
          r.op === i.op &&
          r.field.isEqual(i.field) &&
          gt(r.value, i.value)
        )
      })(t, e)
    : t instanceof mt
      ? (function (r, i) {
          return i instanceof mt &&
            r.op === i.op &&
            r.filters.length === i.filters.length
            ? r.filters.reduce((s, o, a) => s && W_(o, i.filters[a]), !0)
            : !1
        })(t, e)
      : void b()
}
function K_(t) {
  return t instanceof ae
    ? (function (n) {
        return `${n.field.canonicalString()} ${n.op} ${Ar(n.value)}`
      })(t)
    : t instanceof mt
      ? (function (n) {
          return (
            n.op.toString() + ' {' + n.getFilters().map(K_).join(' ,') + '}'
          )
        })(t)
      : 'Filter'
}
var yh = class extends ae {
    constructor(e, n, r) {
      super(e, n, r), (this.key = D.fromName(r.referenceValue))
    }
    matches(e) {
      let n = D.comparator(e.key, this.key)
      return this.matchesComparison(n)
    }
  },
  vh = class extends ae {
    constructor(e, n) {
      super(e, 'in', n), (this.keys = Q_('in', n))
    }
    matches(e) {
      return this.keys.some((n) => n.isEqual(e.key))
    }
  },
  _h = class extends ae {
    constructor(e, n) {
      super(e, 'not-in', n), (this.keys = Q_('not-in', n))
    }
    matches(e) {
      return !this.keys.some((n) => n.isEqual(e.key))
    }
  }
function Q_(t, e) {
  var n
  return (
    ((n = e.arrayValue) === null || n === void 0 ? void 0 : n.values) || []
  ).map((r) => D.fromName(r.referenceValue))
}
var Ih = class extends ae {
    constructor(e, n) {
      super(e, 'array-contains', n)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return kf(n) && Xi(n.arrayValue, this.value)
    }
  },
  Eh = class extends ae {
    constructor(e, n) {
      super(e, 'in', n)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return n !== null && Xi(this.value.arrayValue, n)
    }
  },
  wh = class extends ae {
    constructor(e, n) {
      super(e, 'not-in', n)
    }
    matches(e) {
      if (Xi(this.value.arrayValue, { nullValue: 'NULL_VALUE' })) return !1
      let n = e.data.field(this.field)
      return n !== null && !Xi(this.value.arrayValue, n)
    }
  },
  Dh = class extends ae {
    constructor(e, n) {
      super(e, 'array-contains-any', n)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return (
        !(!kf(n) || !n.arrayValue.values) &&
        n.arrayValue.values.some((r) => Xi(this.value.arrayValue, r))
      )
    }
  }
var Th = class {
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
function I_(t, e = null, n = [], r = [], i = null, s = null, o = null) {
  return new Th(t, e, n, r, i, s, o)
}
function Ff(t) {
  let e = F(t)
  if (e.ce === null) {
    let n = e.path.canonicalString()
    e.collectionGroup !== null && (n += '|cg:' + e.collectionGroup),
      (n += '|f:'),
      (n += e.filters.map((r) => mh(r)).join(',')),
      (n += '|ob:'),
      (n += e.orderBy
        .map((r) =>
          (function (s) {
            return s.field.canonicalString() + s.dir
          })(r)
        )
        .join(',')),
      Ka(e.limit) || ((n += '|l:'), (n += e.limit)),
      e.startAt &&
        ((n += '|lb:'),
        (n += e.startAt.inclusive ? 'b:' : 'a:'),
        (n += e.startAt.position.map((r) => Ar(r)).join(','))),
      e.endAt &&
        ((n += '|ub:'),
        (n += e.endAt.inclusive ? 'a:' : 'b:'),
        (n += e.endAt.position.map((r) => Ar(r)).join(','))),
      (e.ce = n)
  }
  return e.ce
}
function Lf(t, e) {
  if (t.limit !== e.limit || t.orderBy.length !== e.orderBy.length) return !1
  for (let n = 0; n < t.orderBy.length; n++)
    if (!CN(t.orderBy[n], e.orderBy[n])) return !1
  if (t.filters.length !== e.filters.length) return !1
  for (let n = 0; n < t.filters.length; n++)
    if (!W_(t.filters[n], e.filters[n])) return !1
  return (
    t.collectionGroup === e.collectionGroup &&
    !!t.path.isEqual(e.path) &&
    !!__(t.startAt, e.startAt) &&
    __(t.endAt, e.endAt)
  )
}
function Ch(t) {
  return (
    D.isDocumentKey(t.path) &&
    t.collectionGroup === null &&
    t.filters.length === 0
  )
}
var Rr = class {
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
function AN(t, e, n, r, i, s, o, a) {
  return new Rr(t, e, n, r, i, s, o, a)
}
function Vf(t) {
  return new Rr(t)
}
function E_(t) {
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
function SN(t) {
  return t.collectionGroup !== null
}
function Ki(t) {
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
      let a = new De(Ke.comparator)
      return (
        o.filters.forEach((c) => {
          c.getFlattenedFilters().forEach((u) => {
            u.isInequality() && (a = a.add(u.field))
          })
        }),
        a
      )
    })(e).forEach((s) => {
      n.has(s.canonicalString()) || s.isKeyField() || e.le.push(new Nr(s, r))
    }),
      n.has(Ke.keyField().canonicalString()) ||
        e.le.push(new Nr(Ke.keyField(), r))
  }
  return e.le
}
function ft(t) {
  let e = F(t)
  return e.he || (e.he = NN(e, Ki(t))), e.he
}
function NN(t, e) {
  if (t.limitType === 'F')
    return I_(
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
      return new Nr(i.field, s)
    })
    let n = t.endAt ? new Sr(t.endAt.position, t.endAt.inclusive) : null,
      r = t.startAt ? new Sr(t.startAt.position, t.startAt.inclusive) : null
    return I_(t.path, t.collectionGroup, e, t.filters, t.limit, n, r)
  }
}
function bh(t, e, n) {
  return new Rr(
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
function Ya(t, e) {
  return Lf(ft(t), ft(e)) && t.limitType === e.limitType
}
function Y_(t) {
  return `${Ff(ft(t))}|lt:${t.limitType}`
}
function mr(t) {
  return `Query(target=${(function (n) {
    let r = n.path.canonicalString()
    return (
      n.collectionGroup !== null &&
        (r += ' collectionGroup=' + n.collectionGroup),
      n.filters.length > 0 &&
        (r += `, filters: [${n.filters.map((i) => K_(i)).join(', ')}]`),
      Ka(n.limit) || (r += ', limit: ' + n.limit),
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
        (r += n.startAt.position.map((i) => Ar(i)).join(','))),
      n.endAt &&
        ((r += ', endAt: '),
        (r += n.endAt.inclusive ? 'a:' : 'b:'),
        (r += n.endAt.position.map((i) => Ar(i)).join(','))),
      `Target(${r})`
    )
  })(ft(t))}; limitType=${t.limitType})`
}
function Ja(t, e) {
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
      for (let s of Ki(r))
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
            let u = v_(o, a, c)
            return o.inclusive ? u <= 0 : u < 0
          })(r.startAt, Ki(r), i)) ||
        (r.endAt &&
          !(function (o, a, c) {
            let u = v_(o, a, c)
            return o.inclusive ? u >= 0 : u > 0
          })(r.endAt, Ki(r), i))
      )
    })(t, e)
  )
}
function RN(t) {
  return (
    t.collectionGroup ||
    (t.path.length % 2 == 1
      ? t.path.lastSegment()
      : t.path.get(t.path.length - 2))
  )
}
function J_(t) {
  return (e, n) => {
    let r = !1
    for (let i of Ki(t)) {
      let s = xN(i, e, n)
      if (s !== 0) return s
      r = r || i.field.isKeyField()
    }
    return 0
  }
}
function xN(t, e, n) {
  let r = t.field.isKeyField()
    ? D.comparator(e.key, n.key)
    : (function (s, o, a) {
        let c = o.data.field(s),
          u = a.data.field(s)
        return c !== null && u !== null ? br(c, u) : b()
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
var Qt = class {
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
    Qa(this.inner, (n, r) => {
      for (let [i, s] of r) e(i, s)
    })
  }
  isEmpty() {
    return DN(this.inner)
  }
  size() {
    return this.innerSize
  }
}
var MN = new te(D.comparator)
function Yt() {
  return MN
}
var Z_ = new te(D.comparator)
function Gi(...t) {
  let e = Z_
  for (let n of t) e = e.insert(n.key, n)
  return e
}
function PN(t) {
  let e = Z_
  return t.forEach((n, r) => (e = e.insert(n, r.overlayedDocument))), e
}
function xn() {
  return Qi()
}
function X_() {
  return Qi()
}
function Qi() {
  return new Qt(
    (t) => t.toString(),
    (t, e) => t.isEqual(e)
  )
}
var x1 = new te(D.comparator),
  ON = new De(D.comparator)
function O(...t) {
  let e = ON
  for (let n of t) e = e.add(n)
  return e
}
var kN = new De(V)
function FN() {
  return kN
}
function LN(t, e) {
  if (t.useProto3Json) {
    if (isNaN(e)) return { doubleValue: 'NaN' }
    if (e === 1 / 0) return { doubleValue: 'Infinity' }
    if (e === -1 / 0) return { doubleValue: '-Infinity' }
  }
  return { doubleValue: Ta(e) ? '-0' : e }
}
function VN(t) {
  return { integerValue: '' + t }
}
var xr = class {
  constructor() {
    this._ = void 0
  }
}
function UN(t, e, n) {
  return t instanceof es
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
          s && Pf(s) && (s = Of(s)),
          s && (o.fields.__previous_value__ = s),
          { mapValue: o }
        )
      })(n, e)
    : t instanceof Mr
      ? eI(t, e)
      : t instanceof Pr
        ? tI(t, e)
        : (function (i, s) {
            let o = BN(i, s),
              a = w_(o) + w_(i.Ie)
            return gh(o) && gh(i.Ie) ? VN(a) : LN(i.serializer, a)
          })(t, e)
}
function jN(t, e, n) {
  return t instanceof Mr ? eI(t, e) : t instanceof Pr ? tI(t, e) : n
}
function BN(t, e) {
  return t instanceof ts
    ? (function (r) {
        return (
          gh(r) ||
          (function (s) {
            return !!s && 'doubleValue' in s
          })(r)
        )
      })(e)
      ? e
      : { integerValue: 0 }
    : null
}
var es = class extends xr {},
  Mr = class extends xr {
    constructor(e) {
      super(), (this.elements = e)
    }
  }
function eI(t, e) {
  let n = nI(e)
  for (let r of t.elements) n.some((i) => gt(i, r)) || n.push(r)
  return { arrayValue: { values: n } }
}
var Pr = class extends xr {
  constructor(e) {
    super(), (this.elements = e)
  }
}
function tI(t, e) {
  let n = nI(e)
  for (let r of t.elements) n = n.filter((i) => !gt(i, r))
  return { arrayValue: { values: n } }
}
var ts = class extends xr {
  constructor(e, n) {
    super(), (this.serializer = e), (this.Ie = n)
  }
}
function w_(t) {
  return Z(t.integerValue || t.doubleValue)
}
function nI(t) {
  return kf(t) && t.arrayValue.values ? t.arrayValue.values.slice() : []
}
function $N(t, e) {
  return (
    t.field.isEqual(e.field) &&
    (function (r, i) {
      return (r instanceof Mr && i instanceof Mr) ||
        (r instanceof Pr && i instanceof Pr)
        ? Cr(r.elements, i.elements, gt)
        : r instanceof ts && i instanceof ts
          ? gt(r.Ie, i.Ie)
          : r instanceof es && i instanceof es
    })(t.transform, e.transform)
  )
}
var Yi = class t {
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
function _a(t, e) {
  return t.updateTime !== void 0
    ? e.isFoundDocument() && e.version.isEqual(t.updateTime)
    : t.exists === void 0 || t.exists === e.isFoundDocument()
}
var ns = class {}
function rI(t, e) {
  if (!t.hasLocalMutations || (e && e.fields.length === 0)) return null
  if (e === null)
    return t.isNoDocument()
      ? new Ah(t.key, Yi.none())
      : new rs(t.key, t.data, Yi.none())
  {
    let n = t.data,
      r = St.empty(),
      i = new De(Ke.comparator)
    for (let s of e.fields)
      if (!i.has(s)) {
        let o = n.field(s)
        o === null && s.length > 1 && ((s = s.popLast()), (o = n.field(s))),
          o === null ? r.delete(s) : r.set(s, o),
          (i = i.add(s))
      }
    return new Or(t.key, r, new Rn(i.toArray()), Yi.none())
  }
}
function HN(t, e, n) {
  t instanceof rs
    ? (function (i, s, o) {
        let a = i.value.clone(),
          c = T_(i.fieldTransforms, s, o.transformResults)
        a.setAll(c),
          s.convertToFoundDocument(o.version, a).setHasCommittedMutations()
      })(t, e, n)
    : t instanceof Or
      ? (function (i, s, o) {
          if (!_a(i.precondition, s))
            return void s.convertToUnknownDocument(o.version)
          let a = T_(i.fieldTransforms, s, o.transformResults),
            c = s.data
          c.setAll(iI(i)),
            c.setAll(a),
            s.convertToFoundDocument(o.version, c).setHasCommittedMutations()
        })(t, e, n)
      : (function (i, s, o) {
          s.convertToNoDocument(o.version).setHasCommittedMutations()
        })(0, e, n)
}
function Ji(t, e, n, r) {
  return t instanceof rs
    ? (function (s, o, a, c) {
        if (!_a(s.precondition, o)) return a
        let u = s.value.clone(),
          l = C_(s.fieldTransforms, c, o)
        return (
          u.setAll(l),
          o.convertToFoundDocument(o.version, u).setHasLocalMutations(),
          null
        )
      })(t, e, n, r)
    : t instanceof Or
      ? (function (s, o, a, c) {
          if (!_a(s.precondition, o)) return a
          let u = C_(s.fieldTransforms, c, o),
            l = o.data
          return (
            l.setAll(iI(s)),
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
          return _a(s.precondition, o)
            ? (o.convertToNoDocument(o.version).setHasLocalMutations(), null)
            : a
        })(t, e, n)
}
function D_(t, e) {
  return (
    t.type === e.type &&
    !!t.key.isEqual(e.key) &&
    !!t.precondition.isEqual(e.precondition) &&
    !!(function (r, i) {
      return (
        (r === void 0 && i === void 0) ||
        (!(!r || !i) && Cr(r, i, (s, o) => $N(s, o)))
      )
    })(t.fieldTransforms, e.fieldTransforms) &&
    (t.type === 0
      ? t.value.isEqual(e.value)
      : t.type !== 1 ||
        (t.data.isEqual(e.data) && t.fieldMask.isEqual(e.fieldMask)))
  )
}
var rs = class extends ns {
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
  Or = class extends ns {
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
function iI(t) {
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
function T_(t, e, n) {
  let r = new Map()
  se(t.length === n.length)
  for (let i = 0; i < n.length; i++) {
    let s = t[i],
      o = s.transform,
      a = e.data.field(s.field)
    r.set(s.field, jN(o, a, n[i]))
  }
  return r
}
function C_(t, e, n) {
  let r = new Map()
  for (let i of t) {
    let s = i.transform,
      o = n.data.field(i.field)
    r.set(i.field, UN(s, o, e))
  }
  return r
}
var Ah = class extends ns {
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
var Sh = class {
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
      s.key.isEqual(e.key) && HN(s, e, r[i])
    }
  }
  applyToLocalView(e, n) {
    for (let r of this.baseMutations)
      r.key.isEqual(e.key) && (n = Ji(r, e, n, this.localWriteTime))
    for (let r of this.mutations)
      r.key.isEqual(e.key) && (n = Ji(r, e, n, this.localWriteTime))
    return n
  }
  applyToLocalDocumentSet(e, n) {
    let r = X_()
    return (
      this.mutations.forEach((i) => {
        let s = e.get(i.key),
          o = s.overlayedDocument,
          a = this.applyToLocalView(o, s.mutatedFields)
        a = n.has(i.key) ? null : a
        let c = rI(o, a)
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
      Cr(this.mutations, e.mutations, (n, r) => D_(n, r)) &&
      Cr(this.baseMutations, e.baseMutations, (n, r) => D_(n, r))
    )
  }
}
var Nh = class {
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
var Rh = class {
  constructor(e, n) {
    ;(this.count = e), (this.unchangedNames = n)
  }
}
var ne, P
function sI(t) {
  if (t === void 0) return pt('GRPC error has no .code'), m.UNKNOWN
  switch (t) {
    case ne.OK:
      return m.OK
    case ne.CANCELLED:
      return m.CANCELLED
    case ne.UNKNOWN:
      return m.UNKNOWN
    case ne.DEADLINE_EXCEEDED:
      return m.DEADLINE_EXCEEDED
    case ne.RESOURCE_EXHAUSTED:
      return m.RESOURCE_EXHAUSTED
    case ne.INTERNAL:
      return m.INTERNAL
    case ne.UNAVAILABLE:
      return m.UNAVAILABLE
    case ne.UNAUTHENTICATED:
      return m.UNAUTHENTICATED
    case ne.INVALID_ARGUMENT:
      return m.INVALID_ARGUMENT
    case ne.NOT_FOUND:
      return m.NOT_FOUND
    case ne.ALREADY_EXISTS:
      return m.ALREADY_EXISTS
    case ne.PERMISSION_DENIED:
      return m.PERMISSION_DENIED
    case ne.FAILED_PRECONDITION:
      return m.FAILED_PRECONDITION
    case ne.ABORTED:
      return m.ABORTED
    case ne.OUT_OF_RANGE:
      return m.OUT_OF_RANGE
    case ne.UNIMPLEMENTED:
      return m.UNIMPLEMENTED
    case ne.DATA_LOSS:
      return m.DATA_LOSS
    default:
      return b()
  }
}
;((P = ne || (ne = {}))[(P.OK = 0)] = 'OK'),
  (P[(P.CANCELLED = 1)] = 'CANCELLED'),
  (P[(P.UNKNOWN = 2)] = 'UNKNOWN'),
  (P[(P.INVALID_ARGUMENT = 3)] = 'INVALID_ARGUMENT'),
  (P[(P.DEADLINE_EXCEEDED = 4)] = 'DEADLINE_EXCEEDED'),
  (P[(P.NOT_FOUND = 5)] = 'NOT_FOUND'),
  (P[(P.ALREADY_EXISTS = 6)] = 'ALREADY_EXISTS'),
  (P[(P.PERMISSION_DENIED = 7)] = 'PERMISSION_DENIED'),
  (P[(P.UNAUTHENTICATED = 16)] = 'UNAUTHENTICATED'),
  (P[(P.RESOURCE_EXHAUSTED = 8)] = 'RESOURCE_EXHAUSTED'),
  (P[(P.FAILED_PRECONDITION = 9)] = 'FAILED_PRECONDITION'),
  (P[(P.ABORTED = 10)] = 'ABORTED'),
  (P[(P.OUT_OF_RANGE = 11)] = 'OUT_OF_RANGE'),
  (P[(P.UNIMPLEMENTED = 12)] = 'UNIMPLEMENTED'),
  (P[(P.INTERNAL = 13)] = 'INTERNAL'),
  (P[(P.UNAVAILABLE = 14)] = 'UNAVAILABLE'),
  (P[(P.DATA_LOSS = 15)] = 'DATA_LOSS')
var b_ = null
function qN() {
  return new TextEncoder()
}
var zN = new Sn([4294967295, 4294967295], 0)
function A_(t) {
  let e = qN().encode(t),
    n = new d_()
  return n.update(e), new Uint8Array(n.digest())
}
function S_(t) {
  let e = new DataView(t.buffer),
    n = e.getUint32(0, !0),
    r = e.getUint32(4, !0),
    i = e.getUint32(8, !0),
    s = e.getUint32(12, !0)
  return [new Sn([n, r], 0), new Sn([i, s], 0)]
}
var xh = class t {
    constructor(e, n, r) {
      if (
        ((this.bitmap = e),
        (this.padding = n),
        (this.hashCount = r),
        n < 0 || n >= 8)
      )
        throw new Mn(`Invalid padding: ${n}`)
      if (r < 0) throw new Mn(`Invalid hash count: ${r}`)
      if (e.length > 0 && this.hashCount === 0)
        throw new Mn(`Invalid hash count: ${r}`)
      if (e.length === 0 && n !== 0)
        throw new Mn(`Invalid padding when bitmap length is 0: ${n}`)
      ;(this.Te = 8 * e.length - n), (this.Ee = Sn.fromNumber(this.Te))
    }
    de(e, n, r) {
      let i = e.add(n.multiply(Sn.fromNumber(r)))
      return (
        i.compare(zN) === 1 && (i = new Sn([i.getBits(0), i.getBits(1)], 0)),
        i.modulo(this.Ee).toNumber()
      )
    }
    Ae(e) {
      return (this.bitmap[Math.floor(e / 8)] & (1 << e % 8)) != 0
    }
    mightContain(e) {
      if (this.Te === 0) return !1
      let n = A_(e),
        [r, i] = S_(n)
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
      let n = A_(e),
        [r, i] = S_(n)
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
  Mn = class extends Error {
    constructor() {
      super(...arguments), (this.name = 'BloomFilterError')
    }
  }
var Na = class t {
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
        i.set(e, is.createSynthesizedTargetChangeForCurrentChange(e, n, r)),
        new t(A.min(), i, new te(V), Yt(), O())
      )
    }
  },
  is = class t {
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
var Ir = class {
    constructor(e, n, r, i) {
      ;(this.Ve = e), (this.removedTargetIds = n), (this.key = r), (this.me = i)
    }
  },
  Ra = class {
    constructor(e, n) {
      ;(this.targetId = e), (this.fe = n)
    }
  },
  xa = class {
    constructor(e, n, r = be.EMPTY_BYTE_STRING, i = null) {
      ;(this.state = e),
        (this.targetIds = n),
        (this.resumeToken = r),
        (this.cause = i)
    }
  },
  Ma = class {
    constructor() {
      ;(this.ge = 0),
        (this.pe = R_()),
        (this.ye = be.EMPTY_BYTE_STRING),
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
        new is(this.ye, this.we, e, n, r)
      )
    }
    Fe() {
      ;(this.Se = !1), (this.pe = R_())
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
      ;(this.ge -= 1), se(this.ge >= 0)
    }
    Be() {
      ;(this.Se = !0), (this.we = !0)
    }
  },
  Mh = class {
    constructor(e) {
      ;(this.Le = e),
        (this.ke = new Map()),
        (this.qe = Yt()),
        (this.Qe = N_()),
        (this.Ke = new te(V))
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
        if (Ch(s))
          if (r === 0) {
            let o = new D(s.path)
            this.We(n, o, Qe.newNoDocument(o, A.min()))
          } else se(r === 1)
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
            b_?.tt(
              (function (l, d, h, f, _) {
                var E, I, S, L, z, $
                let X = {
                    localCacheCount: l,
                    existenceFilterCount: d.count,
                    databaseId: h.database,
                    projectId: h.projectId,
                  },
                  H = d.unchangedNames
                return (
                  H &&
                    (X.bloomFilter = {
                      applied: _ === 0,
                      hashCount:
                        (E = H?.hashCount) !== null && E !== void 0 ? E : 0,
                      bitmapLength:
                        (L =
                          (S =
                            (I = H?.bits) === null || I === void 0
                              ? void 0
                              : I.bitmap) === null || S === void 0
                            ? void 0
                            : S.length) !== null && L !== void 0
                          ? L
                          : 0,
                      padding:
                        ($ =
                          (z = H?.bits) === null || z === void 0
                            ? void 0
                            : z.padding) !== null && $ !== void 0
                          ? $
                          : 0,
                      mightContain: (Se) => {
                        var Rt
                        return (
                          (Rt = f?.mightContain(Se)) !== null &&
                          Rt !== void 0 &&
                          Rt
                        )
                      },
                    }),
                  X
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
        o = Kt(r).toUint8Array()
      } catch (c) {
        if (c instanceof ba)
          return (
            Tr(
              'Decoding the base64 bloom filter in existence filter failed (' +
                c.message +
                '); ignoring the bloom filter and falling back to full re-query.'
            ),
            null
          )
        throw c
      }
      try {
        a = new xh(o, i, s)
      } catch (c) {
        return (
          Tr(
            c instanceof Mn
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
          if (s.current && Ch(a.target)) {
            let c = new D(a.target.path)
            this.qe.get(c) !== null ||
              this.st(o, c) ||
              this.We(o, c, Qe.newNoDocument(c, e))
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
      let i = new Na(e, n, this.Ke, this.qe, r)
      return (this.qe = Yt()), (this.Qe = N_()), (this.Ke = new te(V)), i
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
      return n || ((n = new Ma()), this.ke.set(e, n)), n
    }
    ot(e) {
      let n = this.Qe.get(e)
      return n || ((n = new De(V)), (this.Qe = this.Qe.insert(e, n))), n
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
      this.ke.set(e, new Ma()),
        this.Le.getRemoteKeysForTarget(e).forEach((n) => {
          this.We(e, n, null)
        })
    }
    st(e, n) {
      return this.Le.getRemoteKeysForTarget(e).has(n)
    }
  }
function N_() {
  return new te(D.comparator)
}
function R_() {
  return new te(D.comparator)
}
var GN = { asc: 'ASCENDING', desc: 'DESCENDING' },
  WN = {
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
  KN = { and: 'AND', or: 'OR' },
  Ph = class {
    constructor(e, n) {
      ;(this.databaseId = e), (this.useProto3Json = n)
    }
  }
function Oh(t, e) {
  return t.useProto3Json || Ka(e) ? e : { value: e }
}
function QN(t, e) {
  return t.useProto3Json
    ? `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, '').replace('Z', '')}.${('000000000' + e.nanoseconds).slice(-9)}Z`
    : { seconds: '' + e.seconds, nanos: e.nanoseconds }
}
function YN(t, e) {
  return t.useProto3Json ? e.toBase64() : e.toUint8Array()
}
function Er(t) {
  return (
    se(!!t),
    A.fromTimestamp(
      (function (n) {
        let r = Wt(n)
        return new Ve(r.seconds, r.nanos)
      })(t)
    )
  )
}
function JN(t, e) {
  return kh(t, e).canonicalString()
}
function kh(t, e) {
  let n = (function (i) {
    return new ie(['projects', i.projectId, 'databases', i.database])
  })(t).child('documents')
  return e === void 0 ? n : n.child(e)
}
function oI(t) {
  let e = ie.fromString(t)
  return se(dI(e)), e
}
function Yd(t, e) {
  let n = oI(e)
  if (n.get(1) !== t.databaseId.projectId)
    throw new w(
      m.INVALID_ARGUMENT,
      'Tried to deserialize key from different project: ' +
        n.get(1) +
        ' vs ' +
        t.databaseId.projectId
    )
  if (n.get(3) !== t.databaseId.database)
    throw new w(
      m.INVALID_ARGUMENT,
      'Tried to deserialize key from different database: ' +
        n.get(3) +
        ' vs ' +
        t.databaseId.database
    )
  return new D(cI(n))
}
function aI(t, e) {
  return JN(t.databaseId, e)
}
function ZN(t) {
  let e = oI(t)
  return e.length === 4 ? ie.emptyPath() : cI(e)
}
function x_(t) {
  return new ie([
    'projects',
    t.databaseId.projectId,
    'databases',
    t.databaseId.database,
  ]).canonicalString()
}
function cI(t) {
  return se(t.length > 4 && t.get(4) === 'documents'), t.popFirst(5)
}
function XN(t, e) {
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
          ? (se(l === void 0 || typeof l == 'string'),
            be.fromBase64String(l || ''))
          : (se(l === void 0 || l instanceof Uint8Array),
            be.fromUint8Array(l || new Uint8Array()))
      })(t, e.targetChange.resumeToken),
      o = e.targetChange.cause,
      a =
        o &&
        (function (u) {
          let l = u.code === void 0 ? m.UNKNOWN : sI(u.code)
          return new w(l, u.message || '')
        })(o)
    n = new xa(r, i, s, a || null)
  } else if ('documentChange' in e) {
    e.documentChange
    let r = e.documentChange
    r.document, r.document.name, r.document.updateTime
    let i = Yd(t, r.document.name),
      s = Er(r.document.updateTime),
      o = r.document.createTime ? Er(r.document.createTime) : A.min(),
      a = new St({ mapValue: { fields: r.document.fields } }),
      c = Qe.newFoundDocument(i, s, o, a),
      u = r.targetIds || [],
      l = r.removedTargetIds || []
    n = new Ir(u, l, c.key, c)
  } else if ('documentDelete' in e) {
    e.documentDelete
    let r = e.documentDelete
    r.document
    let i = Yd(t, r.document),
      s = r.readTime ? Er(r.readTime) : A.min(),
      o = Qe.newNoDocument(i, s),
      a = r.removedTargetIds || []
    n = new Ir([], a, o.key, o)
  } else if ('documentRemove' in e) {
    e.documentRemove
    let r = e.documentRemove
    r.document
    let i = Yd(t, r.document),
      s = r.removedTargetIds || []
    n = new Ir([], s, i, null)
  } else {
    if (!('filter' in e)) return b()
    {
      e.filter
      let r = e.filter
      r.targetId
      let { count: i = 0, unchangedNames: s } = r,
        o = new Rh(i, s),
        a = r.targetId
      n = new Ra(a, o)
    }
  }
  return n
}
function eR(t, e) {
  return { documents: [aI(t, e.path)] }
}
function tR(t, e) {
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
    (n.parent = aI(t, i))
  let s = (function (u) {
    if (u.length !== 0) return lI(mt.create(u, 'and'))
  })(e.filters)
  s && (n.structuredQuery.where = s)
  let o = (function (u) {
    if (u.length !== 0)
      return u.map((l) =>
        (function (h) {
          return { field: yr(h.field), direction: iR(h.dir) }
        })(l)
      )
  })(e.orderBy)
  o && (n.structuredQuery.orderBy = o)
  let a = Oh(t, e.limit)
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
function nR(t) {
  let e = ZN(t.parent),
    n = t.structuredQuery,
    r = n.from ? n.from.length : 0,
    i = null
  if (r > 0) {
    se(r === 1)
    let l = n.from[0]
    l.allDescendants ? (i = l.collectionId) : (e = e.child(l.collectionId))
  }
  let s = []
  n.where &&
    (s = (function (d) {
      let h = uI(d)
      return h instanceof mt && G_(h) ? h.getFilters() : [h]
    })(n.where))
  let o = []
  n.orderBy &&
    (o = (function (d) {
      return d.map((h) =>
        (function (_) {
          return new Nr(
            vr(_.field),
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
      return (h = typeof d == 'object' ? d.value : d), Ka(h) ? null : h
    })(n.limit))
  let c = null
  n.startAt &&
    (c = (function (d) {
      let h = !!d.before,
        f = d.values || []
      return new Sr(f, h)
    })(n.startAt))
  let u = null
  return (
    n.endAt &&
      (u = (function (d) {
        let h = !d.before,
          f = d.values || []
        return new Sr(f, h)
      })(n.endAt)),
    AN(e, i, o, s, a, 'F', c, u)
  )
}
function rR(t, e) {
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
function uI(t) {
  return t.unaryFilter !== void 0
    ? (function (n) {
        switch (n.unaryFilter.op) {
          case 'IS_NAN':
            let r = vr(n.unaryFilter.field)
            return ae.create(r, '==', { doubleValue: NaN })
          case 'IS_NULL':
            let i = vr(n.unaryFilter.field)
            return ae.create(i, '==', { nullValue: 'NULL_VALUE' })
          case 'IS_NOT_NAN':
            let s = vr(n.unaryFilter.field)
            return ae.create(s, '!=', { doubleValue: NaN })
          case 'IS_NOT_NULL':
            let o = vr(n.unaryFilter.field)
            return ae.create(o, '!=', { nullValue: 'NULL_VALUE' })
          default:
            return b()
        }
      })(t)
    : t.fieldFilter !== void 0
      ? (function (n) {
          return ae.create(
            vr(n.fieldFilter.field),
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
            return mt.create(
              n.compositeFilter.filters.map((r) => uI(r)),
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
function iR(t) {
  return GN[t]
}
function sR(t) {
  return WN[t]
}
function oR(t) {
  return KN[t]
}
function yr(t) {
  return { fieldPath: t.canonicalString() }
}
function vr(t) {
  return Ke.fromServerFormat(t.fieldPath)
}
function lI(t) {
  return t instanceof ae
    ? (function (n) {
        if (n.op === '==') {
          if (y_(n.value))
            return { unaryFilter: { field: yr(n.field), op: 'IS_NAN' } }
          if (m_(n.value))
            return { unaryFilter: { field: yr(n.field), op: 'IS_NULL' } }
        } else if (n.op === '!=') {
          if (y_(n.value))
            return { unaryFilter: { field: yr(n.field), op: 'IS_NOT_NAN' } }
          if (m_(n.value))
            return { unaryFilter: { field: yr(n.field), op: 'IS_NOT_NULL' } }
        }
        return {
          fieldFilter: { field: yr(n.field), op: sR(n.op), value: n.value },
        }
      })(t)
    : t instanceof mt
      ? (function (n) {
          let r = n.getFilters().map((i) => lI(i))
          return r.length === 1
            ? r[0]
            : { compositeFilter: { op: oR(n.op), filters: r } }
        })(t)
      : b()
}
function dI(t) {
  return t.length >= 4 && t.get(0) === 'projects' && t.get(2) === 'databases'
}
var ss = class t {
  constructor(
    e,
    n,
    r,
    i,
    s = A.min(),
    o = A.min(),
    a = be.EMPTY_BYTE_STRING,
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
var Fh = class {
  constructor(e) {
    this.ct = e
  }
}
function aR(t) {
  let e = nR({ parent: t.parent, structuredQuery: t.structuredQuery })
  return t.limitType === 'LAST' ? bh(e, e.limit, 'L') : e
}
var Pa = class {
  constructor() {}
  Pt(e, n) {
    this.It(e, n), n.Tt()
  }
  It(e, n) {
    if ('nullValue' in e) this.Et(n, 5)
    else if ('booleanValue' in e) this.Et(n, 10), n.dt(e.booleanValue ? 1 : 0)
    else if ('integerValue' in e) this.Et(n, 15), n.dt(Z(e.integerValue))
    else if ('doubleValue' in e) {
      let r = Z(e.doubleValue)
      isNaN(r) ? this.Et(n, 13) : (this.Et(n, 15), Ta(r) ? n.dt(0) : n.dt(r))
    } else if ('timestampValue' in e) {
      let r = e.timestampValue
      this.Et(n, 20),
        typeof r == 'string'
          ? n.At(r)
          : (n.At(`${r.seconds || ''}`), n.dt(r.nanos || 0))
    } else if ('stringValue' in e) this.Rt(e.stringValue, n), this.Vt(n)
    else if ('bytesValue' in e)
      this.Et(n, 30), n.ft(Kt(e.bytesValue)), this.Vt(n)
    else if ('referenceValue' in e) this.gt(e.referenceValue, n)
    else if ('geoPointValue' in e) {
      let r = e.geoPointValue
      this.Et(n, 45), n.dt(r.latitude || 0), n.dt(r.longitude || 0)
    } else
      'mapValue' in e
        ? q_(e)
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
Pa.bt = new Pa()
var Lh = class {
    constructor() {
      this._n = new Vh()
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
      return g.resolve(Fn.min())
    }
    getMinOffsetFromCollectionGroup(e, n) {
      return g.resolve(Fn.min())
    }
    updateCollectionGroup(e, n, r) {
      return g.resolve()
    }
    updateIndexEntries(e, n) {
      return g.resolve()
    }
  },
  Vh = class {
    constructor() {
      this.index = {}
    }
    add(e) {
      let n = e.lastSegment(),
        r = e.popLast(),
        i = this.index[n] || new De(ie.comparator),
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
      return (this.index[e] || new De(ie.comparator)).toArray()
    }
  }
var M1 = new Uint8Array(0)
var dt = class t {
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
;(dt.DEFAULT_COLLECTION_PERCENTILE = 10),
  (dt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3),
  (dt.DEFAULT = new dt(
    41943040,
    dt.DEFAULT_COLLECTION_PERCENTILE,
    dt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT
  )),
  (dt.DISABLED = new dt(-1, 0, 0))
var os = class t {
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
var Uh = class {
  constructor() {
    ;(this.changes = new Qt(
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
      this.changes.set(e, Qe.newInvalidDocument(e).setReadTime(n))
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
var jh = class {
  constructor(e, n) {
    ;(this.overlayedDocument = e), (this.mutatedFields = n)
  }
}
var Bh = class {
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
      .next((i) => (r !== null && Ji(r.mutation, i, Rn.empty(), Ve.now()), i))
  }
  getDocuments(e, n) {
    return this.remoteDocumentCache
      .getEntries(e, n)
      .next((r) => this.getLocalViewOfDocuments(e, r, O()).next(() => r))
  }
  getLocalViewOfDocuments(e, n, r = O()) {
    let i = xn()
    return this.populateOverlays(e, i, n).next(() =>
      this.computeViews(e, n, i, r).next((s) => {
        let o = Gi()
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
    let r = xn()
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
    let s = Yt(),
      o = Qi(),
      a = (function () {
        return Qi()
      })()
    return (
      n.forEach((c, u) => {
        let l = r.get(u.key)
        i.has(u.key) && (l === void 0 || l.mutation instanceof Or)
          ? (s = s.insert(u.key, u))
          : l !== void 0
            ? (o.set(u.key, l.mutation.getFieldMask()),
              Ji(l.mutation, u, l.mutation.getFieldMask(), Ve.now()))
            : o.set(u.key, Rn.empty())
      }),
      this.recalculateAndSaveOverlays(e, s).next(
        (c) => (
          c.forEach((u, l) => o.set(u, l)),
          n.forEach((u, l) => {
            var d
            return a.set(
              u,
              new jh(l, (d = o.get(u)) !== null && d !== void 0 ? d : null)
            )
          }),
          a
        )
      )
    )
  }
  recalculateAndSaveOverlays(e, n) {
    let r = Qi(),
      i = new te((o, a) => o - a),
      s = O()
    return this.mutationQueue
      .getAllMutationBatchesAffectingDocumentKeys(e, n)
      .next((o) => {
        for (let a of o)
          a.keys().forEach((c) => {
            let u = n.get(c)
            if (u === null) return
            let l = r.get(c) || Rn.empty()
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
            d = X_()
          l.forEach((h) => {
            if (!s.has(h)) {
              let f = rI(n.get(h), r.get(h))
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
      : SN(n)
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
              : g.resolve(xn()),
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
            .next((l) => ({ batchId: a, changes: PN(l) }))
        )
      })
  }
  getDocumentsMatchingDocumentQuery(e, n) {
    return this.getDocument(e, new D(n)).next((r) => {
      let i = Gi()
      return r.isFoundDocument() && (i = i.insert(r.key, r)), i
    })
  }
  getDocumentsMatchingCollectionGroupQuery(e, n, r, i) {
    let s = n.collectionGroup,
      o = Gi()
    return this.indexManager.getCollectionParents(e, s).next((a) =>
      g
        .forEach(a, (c) => {
          let u = (function (d, h) {
            return new Rr(
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
          o.get(l) === null && (o = o.insert(l, Qe.newInvalidDocument(l)))
        })
        let a = Gi()
        return (
          o.forEach((c, u) => {
            let l = s.get(c)
            l !== void 0 && Ji(l.mutation, u, Rn.empty(), Ve.now()),
              Ja(n, u) && (a = a.insert(c, u))
          }),
          a
        )
      })
  }
}
var $h = class {
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
          return { id: i.id, version: i.version, createTime: Er(i.createTime) }
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
            query: aR(i.bundledQuery),
            readTime: Er(i.readTime),
          }
        })(n)
      ),
      g.resolve()
    )
  }
}
var Hh = class {
  constructor() {
    ;(this.overlays = new te(D.comparator)), (this.hr = new Map())
  }
  getOverlay(e, n) {
    return g.resolve(this.overlays.get(n))
  }
  getOverlays(e, n) {
    let r = xn()
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
    let i = xn(),
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
    let s = new te((u, l) => u - l),
      o = this.overlays.getIterator()
    for (; o.hasNext(); ) {
      let u = o.getNext().value
      if (u.getKey().getCollectionGroup() === n && u.largestBatchId > r) {
        let l = s.get(u.largestBatchId)
        l === null && ((l = xn()), (s = s.insert(u.largestBatchId, l))),
          l.set(u.getKey(), u)
      }
    }
    let a = xn(),
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
    this.overlays = this.overlays.insert(r.key, new Nh(n, r))
    let s = this.hr.get(n)
    s === void 0 && ((s = O()), this.hr.set(n, s)), this.hr.set(n, s.add(r.key))
  }
}
var as = class {
    constructor() {
      ;(this.Pr = new De(re.Ir)), (this.Tr = new De(re.Er))
    }
    isEmpty() {
      return this.Pr.isEmpty()
    }
    addReference(e, n) {
      let r = new re(e, n)
      ;(this.Pr = this.Pr.add(r)), (this.Tr = this.Tr.add(r))
    }
    dr(e, n) {
      e.forEach((r) => this.addReference(r, n))
    }
    removeReference(e, n) {
      this.Ar(new re(e, n))
    }
    Rr(e, n) {
      e.forEach((r) => this.removeReference(r, n))
    }
    Vr(e) {
      let n = new D(new ie([])),
        r = new re(n, e),
        i = new re(n, e + 1),
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
      let n = new D(new ie([])),
        r = new re(n, e),
        i = new re(n, e + 1),
        s = O()
      return (
        this.Tr.forEachInRange([r, i], (o) => {
          s = s.add(o.key)
        }),
        s
      )
    }
    containsKey(e) {
      let n = new re(e, 0),
        r = this.Pr.firstAfterOrEqual(n)
      return r !== null && e.isEqual(r.key)
    }
  },
  re = class {
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
var qh = class {
  constructor(e, n) {
    ;(this.indexManager = e),
      (this.referenceDelegate = n),
      (this.mutationQueue = []),
      (this.yr = 1),
      (this.wr = new De(re.Ir))
  }
  checkEmpty(e) {
    return g.resolve(this.mutationQueue.length === 0)
  }
  addMutationBatch(e, n, r, i) {
    let s = this.yr
    this.yr++,
      this.mutationQueue.length > 0 &&
        this.mutationQueue[this.mutationQueue.length - 1]
    let o = new Sh(s, n, r, i)
    this.mutationQueue.push(o)
    for (let a of i)
      (this.wr = this.wr.add(new re(a.key, s))),
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
    let r = new re(n, 0),
      i = new re(n, Number.POSITIVE_INFINITY),
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
    let r = new De(V)
    return (
      n.forEach((i) => {
        let s = new re(i, 0),
          o = new re(i, Number.POSITIVE_INFINITY)
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
    let o = new re(new D(s), 0),
      a = new De(V)
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
    se(this.Cr(n.batchId, 'removed') === 0), this.mutationQueue.shift()
    let r = this.wr
    return g
      .forEach(n.mutations, (i) => {
        let s = new re(i.key, n.batchId)
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
    let r = new re(n, 0),
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
var zh = class {
    constructor(e) {
      ;(this.vr = e),
        (this.docs = (function () {
          return new te(D.comparator)
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
      return g.resolve(r ? r.document.mutableCopy() : Qe.newInvalidDocument(n))
    }
    getEntries(e, n) {
      let r = Yt()
      return (
        n.forEach((i) => {
          let s = this.docs.get(i)
          r = r.insert(
            i,
            s ? s.document.mutableCopy() : Qe.newInvalidDocument(i)
          )
        }),
        g.resolve(r)
      )
    }
    getDocumentsMatchingQuery(e, n, r, i) {
      let s = Yt(),
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
          vN(yN(l), r) <= 0 ||
          ((i.has(l.key) || Ja(n, l)) && (s = s.insert(l.key, l.mutableCopy())))
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
      return new Gh(this)
    }
    getSize(e) {
      return g.resolve(this.size)
    }
  },
  Gh = class extends Uh {
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
var Wh = class {
  constructor(e) {
    ;(this.persistence = e),
      (this.Mr = new Qt((n) => Ff(n), Lf)),
      (this.lastRemoteSnapshotVersion = A.min()),
      (this.highestTargetId = 0),
      (this.Or = 0),
      (this.Nr = new as()),
      (this.targetCount = 0),
      (this.Br = os.Nn())
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
      ((this.Br = new os(n)), (this.highestTargetId = n)),
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
var Kh = class {
    constructor(e, n) {
      ;(this.Lr = {}),
        (this.overlays = {}),
        (this.kr = new H_(0)),
        (this.qr = !1),
        (this.qr = !0),
        (this.referenceDelegate = e(this)),
        (this.Qr = new Wh(this)),
        (this.indexManager = new Lh()),
        (this.remoteDocumentCache = (function (i) {
          return new zh(i)
        })((r) => this.referenceDelegate.Kr(r))),
        (this.serializer = new Fh(n)),
        (this.$r = new $h(this.serializer))
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
      return n || ((n = new Hh()), (this.overlays[e.toKey()] = n)), n
    }
    getMutationQueue(e, n) {
      let r = this.Lr[e.toKey()]
      return (
        r ||
          ((r = new qh(n, this.referenceDelegate)), (this.Lr[e.toKey()] = r)),
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
      let i = new Qh(this.kr.next())
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
  Qh = class extends uh {
    constructor(e) {
      super(), (this.currentSequenceNumber = e)
    }
  },
  Yh = class t {
    constructor(e) {
      ;(this.persistence = e), (this.zr = new as()), (this.jr = null)
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
var Jh = class t {
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
var Zh = class {
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
var Xh = class {
  constructor() {
    ;(this.$i = !1),
      (this.Ui = !1),
      (this.Wi = 100),
      (this.Gi = (function () {
        return hy() ? 8 : Da.v(_e()) > 0 ? 6 : 4
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
        let o = new Zh()
        return this.Ji(e, n, o).next((a) => {
          if (((s.result = a), this.Ui)) return this.Yi(e, n, o, a.size)
        })
      })
      .next(() => s.result)
  }
  Yi(e, n, r, i) {
    return r.documentReadCount < this.Wi
      ? (zi() <= x.DEBUG &&
          v(
            'QueryEngine',
            'SDK will not create cache indexes for query:',
            mr(n),
            'since it only creates cache indexes for collection contains',
            'more than or equal to',
            this.Wi,
            'documents'
          ),
        g.resolve())
      : (zi() <= x.DEBUG &&
          v(
            'QueryEngine',
            'Query:',
            mr(n),
            'scans',
            r.documentReadCount,
            'local documents and returns',
            i,
            'documents as results.'
          ),
        r.documentReadCount > this.Gi * i
          ? (zi() <= x.DEBUG &&
              v(
                'QueryEngine',
                'The SDK decides to create cache indexes for query:',
                mr(n),
                'as using cache indexes may help improve performance.'
              ),
            this.indexManager.createTargetIndexes(e, ft(n)))
          : g.resolve())
  }
  ji(e, n) {
    if (E_(n)) return g.resolve(null)
    let r = ft(n)
    return this.indexManager.getIndexType(e, r).next((i) =>
      i === 0
        ? null
        : (n.limit !== null && i === 1 && ((n = bh(n, null, 'F')), (r = ft(n))),
          this.indexManager.getDocumentsMatchingTarget(e, r).next((s) => {
            let o = O(...s)
            return this.zi.getDocuments(e, o).next((a) =>
              this.indexManager.getMinOffset(e, r).next((c) => {
                let u = this.Zi(n, a)
                return this.Xi(n, u, o, c.readTime)
                  ? this.ji(e, bh(n, null, 'F'))
                  : this.es(e, u, n, c)
              })
            )
          }))
    )
  }
  Hi(e, n, r, i) {
    return E_(n) || i.isEqual(A.min())
      ? g.resolve(null)
      : this.zi.getDocuments(e, r).next((s) => {
          let o = this.Zi(n, s)
          return this.Xi(n, o, r, i)
            ? g.resolve(null)
            : (zi() <= x.DEBUG &&
                v(
                  'QueryEngine',
                  'Re-using previous result from %s to execute query: %s',
                  i.toString(),
                  mr(n)
                ),
              this.es(e, o, n, mN(i, -1)).next((a) => a))
        })
  }
  Zi(e, n) {
    let r = new De(J_(e))
    return (
      n.forEach((i, s) => {
        Ja(e, s) && (r = r.add(s))
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
      zi() <= x.DEBUG &&
        v('QueryEngine', 'Using full collection scan to execute query:', mr(n)),
      this.zi.getDocumentsMatchingQuery(e, n, Fn.min(), r)
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
var ef = class {
  constructor(e, n, r, i) {
    ;(this.persistence = e),
      (this.ts = n),
      (this.serializer = i),
      (this.ns = new te(V)),
      (this.rs = new Qt((s) => Ff(s), Lf)),
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
      (this.localDocuments = new Bh(
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
function cR(t, e, n, r) {
  return new ef(t, e, n, r)
}
function hI(t, e) {
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
function fI(t) {
  let e = F(t)
  return e.persistence.runTransaction(
    'Get last remote snapshot version',
    'readonly',
    (n) => e.Qr.getLastRemoteSnapshotVersion(n)
  )
}
function uR(t, e) {
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
              .withResumeToken(be.EMPTY_BYTE_STRING, A.min())
              .withLastLimboFreeSnapshotVersion(A.min()))
          : l.resumeToken.approximateByteSize() > 0 &&
            (f = f.withResumeToken(l.resumeToken, r)),
          (i = i.insert(d, f)),
          (function (E, I, S) {
            return E.resumeToken.approximateByteSize() === 0 ||
              I.snapshotVersion.toMicroseconds() -
                E.snapshotVersion.toMicroseconds() >=
                3e8
              ? !0
              : S.addedDocuments.size +
                  S.modifiedDocuments.size +
                  S.removedDocuments.size >
                  0
          })(h, f, l) && a.push(n.Qr.updateTargetData(s, f))
      })
      let c = Yt(),
        u = O()
      if (
        (e.documentUpdates.forEach((l) => {
          e.resolvedLimboDocuments.has(l) &&
            a.push(n.persistence.referenceDelegate.updateLimboDocument(s, l))
        }),
        a.push(
          lR(s, o, e.documentUpdates).next((l) => {
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
function lR(t, e, n) {
  let r = O(),
    i = O()
  return (
    n.forEach((s) => (r = r.add(s))),
    e.getEntries(t, r).next((s) => {
      let o = Yt()
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
function dR(t, e) {
  let n = F(t)
  return n.persistence
    .runTransaction('Allocate target', 'readwrite', (r) => {
      let i
      return n.Qr.getTargetData(r, e).next((s) =>
        s
          ? ((i = s), g.resolve(i))
          : n.Qr.allocateTargetId(r).next(
              (o) => (
                (i = new ss(
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
function tf(t, e, n) {
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
      if (!ls(o)) throw o
      v('LocalStore', `Failed to update sequence numbers for target ${e}: ${o}`)
    }
    ;(r.ns = r.ns.remove(e)), r.rs.delete(i.target)
  })
}
function M_(t, e, n) {
  let r = F(t),
    i = A.min(),
    s = O()
  return r.persistence.runTransaction('Execute query', 'readwrite', (o) =>
    (function (c, u, l) {
      let d = F(c),
        h = d.rs.get(l)
      return h !== void 0 ? g.resolve(d.ns.get(h)) : d.Qr.getTargetData(u, l)
    })(r, o, ft(e))
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
      .next((a) => (hR(r, RN(e), a), { documents: a, hs: s }))
  )
}
function hR(t, e, n) {
  let r = t.ss.get(e) || A.min()
  n.forEach((i, s) => {
    s.readTime.compareTo(r) > 0 && (r = s.readTime)
  }),
    t.ss.set(e, r)
}
var Oa = class {
  constructor() {
    this.activeTargetIds = FN()
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
var nf = class {
  constructor() {
    ;(this.no = new Oa()),
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
    return (this.no = new Oa()), Promise.resolve()
  }
  handleUserChange(e, n, r) {}
  setOnlineState(e) {}
  shutdown() {}
  writeSequenceNumber(e) {}
  notifyBundleLoaded(e) {}
}
var rf = class {
  io(e) {}
  shutdown() {}
}
var ka = class {
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
var va = null
function Jd() {
  return (
    va === null
      ? (va = (function () {
          return 268435456 + Math.round(2147483648 * Math.random())
        })())
      : va++,
    '0x' + va.toString(16)
  )
}
var fR = {
  BatchGetDocuments: 'batchGet',
  Commit: 'commit',
  RunQuery: 'runQuery',
  RunAggregationQuery: 'runAggregationQuery',
}
var sf = class {
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
var we = 'WebChannelConnection',
  of = class extends class {
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
      let a = Jd(),
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
              (Tr(
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
        return 'gl-js/ fire/' + Fr
      })()),
        (n['Content-Type'] = 'text/plain'),
        this.databaseInfo.appId &&
          (n['X-Firebase-GMPID'] = this.databaseInfo.appId),
        r && r.headers.forEach((s, o) => (n[o] = s)),
        i && i.headers.forEach((s, o) => (n[o] = s))
    }
    bo(n, r) {
      let i = fR[n]
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
      let s = Jd()
      return new Promise((o, a) => {
        let c = new l_()
        c.setWithCredentials(!0),
          c.listenOnce(c_.COMPLETE, () => {
            try {
              switch (c.getLastErrorCode()) {
                case ma.NO_ERROR:
                  let l = c.getResponseJson()
                  v(we, `XHR for RPC '${e}' ${s} received:`, JSON.stringify(l)),
                    o(l)
                  break
                case ma.TIMEOUT:
                  v(we, `RPC '${e}' ${s} timed out`),
                    a(new w(m.DEADLINE_EXCEEDED, 'Request time out'))
                  break
                case ma.HTTP_ERROR:
                  let d = c.getStatus()
                  if (
                    (v(
                      we,
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
                        let S = I.toLowerCase().replace(/_/g, '-')
                        return Object.values(m).indexOf(S) >= 0 ? S : m.UNKNOWN
                      })(f.status)
                      a(new w(_, f.message))
                    } else
                      a(
                        new w(
                          m.UNKNOWN,
                          'Server responded with status ' + c.getStatus()
                        )
                      )
                  } else a(new w(m.UNAVAILABLE, 'Connection failed.'))
                  break
                default:
                  b()
              }
            } finally {
              v(we, `RPC '${e}' ${s} completed.`)
            }
          })
        let u = JSON.stringify(i)
        v(we, `RPC '${e}' ${s} sending request:`, i),
          c.send(n, 'POST', u, r, 15)
      })
    }
    Fo(e, n, r) {
      let i = Jd(),
        s = [this.fo, '/', 'google.firestore.v1.Firestore', '/', e, '/channel'],
        o = o_(),
        a = a_(),
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
      v(we, `Creating RPC '${e}' stream ${i}: ${l}`, c)
      let d = o.createWebChannel(l, c),
        h = !1,
        f = !1,
        _ = new sf({
          lo: (I) => {
            f
              ? v(
                  we,
                  `Not sending because RPC '${e}' stream ${i} is closed:`,
                  I
                )
              : (h ||
                  (v(we, `Opening RPC '${e}' stream ${i} transport.`),
                  d.open(),
                  (h = !0)),
                v(we, `RPC '${e}' stream ${i} sending:`, I),
                d.send(I))
          },
          ho: () => d.close(),
        }),
        E = (I, S, L) => {
          I.listen(S, (z) => {
            try {
              L(z)
            } catch ($) {
              setTimeout(() => {
                throw $
              }, 0)
            }
          })
        }
      return (
        E(d, qi.EventType.OPEN, () => {
          f || v(we, `RPC '${e}' stream ${i} transport opened.`)
        }),
        E(d, qi.EventType.CLOSE, () => {
          f ||
            ((f = !0), v(we, `RPC '${e}' stream ${i} transport closed`), _.Vo())
        }),
        E(d, qi.EventType.ERROR, (I) => {
          f ||
            ((f = !0),
            Tr(we, `RPC '${e}' stream ${i} transport errored:`, I),
            _.Vo(new w(m.UNAVAILABLE, 'The operation could not be completed')))
        }),
        E(d, qi.EventType.MESSAGE, (I) => {
          var S
          if (!f) {
            let L = I.data[0]
            se(!!L)
            let z = L,
              $ =
                z.error ||
                ((S = z[0]) === null || S === void 0 ? void 0 : S.error)
            if ($) {
              v(we, `RPC '${e}' stream ${i} received error:`, $)
              let X = $.status,
                H = (function (Jt) {
                  let fs = ne[Jt]
                  if (fs !== void 0) return sI(fs)
                })(X),
                Se = $.message
              H === void 0 &&
                ((H = m.INTERNAL),
                (Se =
                  'Unknown error status: ' + X + ' with message ' + $.message)),
                (f = !0),
                _.Vo(new w(H, Se)),
                d.close()
            } else v(we, `RPC '${e}' stream ${i} received:`, L), _.mo(L)
          }
        }),
        E(a, u_.STAT_EVENT, (I) => {
          I.stat === Kd.PROXY
            ? v(we, `RPC '${e}' stream ${i} detected buffering proxy`)
            : I.stat === Kd.NOPROXY &&
              v(we, `RPC '${e}' stream ${i} detected no buffering proxy`)
        }),
        setTimeout(() => {
          _.Ro()
        }, 0),
        _
      )
    }
  }
function Zd() {
  return typeof document < 'u' ? document : null
}
function pI(t) {
  return new Ph(t, !0)
}
var Fa = class {
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
var af = class {
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
        (this.jo = new Fa(e, n))
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
              ? (pt(n.toString()),
                pt(
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
            let i = new w(m.UNKNOWN, 'Fetching auth token failed: ' + r.message)
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
  cf = class extends af {
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
      let n = XN(this.serializer, e),
        r = (function (s) {
          if (!('targetChange' in s)) return A.min()
          let o = s.targetChange
          return o.targetIds && o.targetIds.length
            ? A.min()
            : o.readTime
              ? Er(o.readTime)
              : A.min()
        })(e)
      return this.listener.u_(n, r)
    }
    c_(e) {
      let n = {}
      ;(n.database = x_(this.serializer)),
        (n.addTarget = (function (s, o) {
          let a,
            c = o.target
          if (
            ((a = Ch(c) ? { documents: eR(s, c) } : { query: tR(s, c).ut }),
            (a.targetId = o.targetId),
            o.resumeToken.approximateByteSize() > 0)
          ) {
            a.resumeToken = YN(s, o.resumeToken)
            let u = Oh(s, o.expectedCount)
            u !== null && (a.expectedCount = u)
          } else if (o.snapshotVersion.compareTo(A.min()) > 0) {
            a.readTime = QN(s, o.snapshotVersion.toTimestamp())
            let u = Oh(s, o.expectedCount)
            u !== null && (a.expectedCount = u)
          }
          return a
        })(this.serializer, e))
      let r = rR(this.serializer, e)
      r && (n.labels = r), this.t_(n)
    }
    l_(e) {
      let n = {}
      ;(n.database = x_(this.serializer)), (n.removeTarget = e), this.t_(n)
    }
  }
var uf = class extends class {} {
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
      throw new w(
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
        .then(([s, o]) => this.connection.So(e, kh(n, r), i, s, o))
        .catch((s) => {
          throw s.name === 'FirebaseError'
            ? (s.code === m.UNAUTHENTICATED &&
                (this.authCredentials.invalidateToken(),
                this.appCheckCredentials.invalidateToken()),
              s)
            : new w(m.UNKNOWN, s.toString())
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
        .then(([o, a]) => this.connection.vo(e, kh(n, r), i, o, a, s))
        .catch((o) => {
          throw o.name === 'FirebaseError'
            ? (o.code === m.UNAUTHENTICATED &&
                (this.authCredentials.invalidateToken(),
                this.appCheckCredentials.invalidateToken()),
              o)
            : new w(m.UNKNOWN, o.toString())
        })
    )
  }
  terminate() {
    ;(this.A_ = !0), this.connection.terminate()
  }
}
var lf = class {
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
    this.g_ ? (pt(n), (this.g_ = !1)) : v('OnlineStateTracker', n)
  }
  b_() {
    this.f_ !== null && (this.f_.cancel(), (this.f_ = null))
  }
}
var df = class {
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
            hs(this) &&
              (v(
                'RemoteStore',
                'Restarting streams for network reachability change.'
              ),
              yield (function (c) {
                return p(this, null, function* () {
                  let u = F(c)
                  u.v_.add(4),
                    yield ds(u),
                    u.x_.set('Unknown'),
                    u.v_.delete(4),
                    yield Za(u)
                })
              })(this))
          })
        )
      }),
      (this.x_ = new lf(r, i))
  }
}
function Za(t) {
  return p(this, null, function* () {
    if (hs(t)) for (let e of t.F_) yield e(!0)
  })
}
function ds(t) {
  return p(this, null, function* () {
    for (let e of t.F_) yield e(!1)
  })
}
function gI(t, e) {
  let n = F(t)
  n.C_.has(e.targetId) ||
    (n.C_.set(e.targetId, e), Bf(n) ? jf(n) : Lr(n).Jo() && Uf(n, e))
}
function mI(t, e) {
  let n = F(t),
    r = Lr(n)
  n.C_.delete(e),
    r.Jo() && yI(n, e),
    n.C_.size === 0 && (r.Jo() ? r.Xo() : hs(n) && n.x_.set('Unknown'))
}
function Uf(t, e) {
  if (
    (t.O_.Oe(e.targetId),
    e.resumeToken.approximateByteSize() > 0 ||
      e.snapshotVersion.compareTo(A.min()) > 0)
  ) {
    let n = t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size
    e = e.withExpectedCount(n)
  }
  Lr(t).c_(e)
}
function yI(t, e) {
  t.O_.Oe(e), Lr(t).l_(e)
}
function jf(t) {
  ;(t.O_ = new Mh({
    getRemoteKeysForTarget: (e) => t.remoteSyncer.getRemoteKeysForTarget(e),
    _t: (e) => t.C_.get(e) || null,
    nt: () => t.datastore.serializer.databaseId,
  })),
    Lr(t).start(),
    t.x_.p_()
}
function Bf(t) {
  return hs(t) && !Lr(t).Ho() && t.C_.size > 0
}
function hs(t) {
  return F(t).v_.size === 0
}
function vI(t) {
  t.O_ = void 0
}
function pR(t) {
  return p(this, null, function* () {
    t.C_.forEach((e, n) => {
      Uf(t, e)
    })
  })
}
function gR(t, e) {
  return p(this, null, function* () {
    vI(t), Bf(t) ? (t.x_.S_(e), jf(t)) : t.x_.set('Unknown')
  })
}
function mR(t, e, n) {
  return p(this, null, function* () {
    if ((t.x_.set('Online'), e instanceof xa && e.state === 2 && e.cause))
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
          yield P_(t, r)
      }
    else if (
      (e instanceof Ir ? t.O_.$e(e) : e instanceof Ra ? t.O_.Je(e) : t.O_.Ge(e),
      !n.isEqual(A.min()))
    )
      try {
        let r = yield fI(t.localStore)
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
                  l.withResumeToken(be.EMPTY_BYTE_STRING, l.snapshotVersion)
                ),
                  yI(s, c)
                let d = new ss(l.target, c, u, l.sequenceNumber)
                Uf(s, d)
              }),
              s.remoteSyncer.applyRemoteEvent(a)
            )
          })(t, n))
      } catch (r) {
        v('RemoteStore', 'Failed to raise snapshot:', r), yield P_(t, r)
      }
  })
}
function P_(t, e, n) {
  return p(this, null, function* () {
    if (!ls(e)) throw e
    t.v_.add(1),
      yield ds(t),
      t.x_.set('Offline'),
      n || (n = () => fI(t.localStore)),
      t.asyncQueue.enqueueRetryable(() =>
        p(this, null, function* () {
          v('RemoteStore', 'Retrying IndexedDB access'),
            yield n(),
            t.v_.delete(1),
            yield Za(t)
        })
      )
  })
}
function O_(t, e) {
  return p(this, null, function* () {
    let n = F(t)
    n.asyncQueue.verifyOperationInProgress(),
      v('RemoteStore', 'RemoteStore received new credentials')
    let r = hs(n)
    n.v_.add(3),
      yield ds(n),
      r && n.x_.set('Unknown'),
      yield n.remoteSyncer.handleCredentialChange(e),
      n.v_.delete(3),
      yield Za(n)
  })
}
function yR(t, e) {
  return p(this, null, function* () {
    let n = F(t)
    e
      ? (n.v_.delete(2), yield Za(n))
      : e || (n.v_.add(2), yield ds(n), n.x_.set('Unknown'))
  })
}
function Lr(t) {
  return (
    t.N_ ||
      ((t.N_ = (function (n, r, i) {
        let s = F(n)
        return (
          s.R_(),
          new cf(
            r,
            s.connection,
            s.authCredentials,
            s.appCheckCredentials,
            s.serializer,
            i
          )
        )
      })(t.datastore, t.asyncQueue, {
        Po: pR.bind(null, t),
        To: gR.bind(null, t),
        u_: mR.bind(null, t),
      })),
      t.F_.push((e) =>
        p(this, null, function* () {
          e
            ? (t.N_.Zo(), Bf(t) ? jf(t) : t.x_.set('Unknown'))
            : (yield t.N_.stop(), vI(t))
        })
      )),
    t.N_
  )
}
var hf = class t {
  constructor(e, n, r, i, s) {
    ;(this.asyncQueue = e),
      (this.timerId = n),
      (this.targetTimeMs = r),
      (this.op = i),
      (this.removalCallback = s),
      (this.deferred = new Nt()),
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
        new w(m.CANCELLED, 'Operation cancelled' + (e ? ': ' + e : ''))
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
function _I(t, e) {
  if ((pt('AsyncQueue', `${e}: ${t}`), ls(t)))
    return new w(m.UNAVAILABLE, `${e}: ${t}`)
  throw t
}
var La = class t {
  constructor(e) {
    ;(this.comparator = e
      ? (n, r) => e(n, r) || D.comparator(n.key, r.key)
      : (n, r) => D.comparator(n.key, r.key)),
      (this.keyedMap = Gi()),
      (this.sortedSet = new te(this.comparator))
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
var Va = class {
    constructor() {
      this.L_ = new te(D.comparator)
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
  kr = class t {
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
        new t(e, n, La.emptySet(n), o, r, i, !0, !1, s)
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
          Ya(this.query, e.query) &&
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
var ff = class {
    constructor() {
      ;(this.q_ = void 0), (this.Q_ = [])
    }
  },
  pf = class {
    constructor() {
      ;(this.queries = new Qt((e) => Y_(e), Ya)),
        (this.onlineState = 'Unknown'),
        (this.K_ = new Set())
    }
  }
function vR(t, e) {
  return p(this, null, function* () {
    let n = F(t),
      r = e.query,
      i = !1,
      s = n.queries.get(r)
    if ((s || ((i = !0), (s = new ff())), i))
      try {
        s.q_ = yield n.onListen(r)
      } catch (o) {
        let a = _I(o, `Initialization of query '${mr(e.query)}' failed`)
        return void e.onError(a)
      }
    n.queries.set(r, s),
      s.Q_.push(e),
      e.U_(n.onlineState),
      s.q_ && e.W_(s.q_) && $f(n)
  })
}
function _R(t, e) {
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
function IR(t, e) {
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
  r && $f(n)
}
function ER(t, e, n) {
  let r = F(t),
    i = r.queries.get(e)
  if (i) for (let s of i.Q_) s.onError(n)
  r.queries.delete(e)
}
function $f(t) {
  t.K_.forEach((e) => {
    e.next()
  })
}
var gf = class {
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
      e = new kr(
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
    ;(e = kr.fromInitialDocuments(
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
var Ua = class {
    constructor(e) {
      this.key = e
    }
  },
  ja = class {
    constructor(e) {
      this.key = e
    }
  },
  mf = class {
    constructor(e, n) {
      ;(this.query = e),
        (this.oa = n),
        (this._a = null),
        (this.hasCachedResults = !1),
        (this.current = !1),
        (this.aa = O()),
        (this.mutatedKeys = O()),
        (this.ua = J_(e)),
        (this.ca = new La(this.ua))
    }
    get la() {
      return this.oa
    }
    ha(e, n) {
      let r = n ? n.Pa : new Va(),
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
            f = Ja(this.query, d) ? d : null,
            _ = !!h && this.mutatedKeys.has(h.key),
            E =
              !!f &&
              (f.hasLocalMutations ||
                (this.mutatedKeys.has(f.key) && f.hasCommittedMutations)),
            I = !1
          h && f
            ? h.data.isEqual(f.data)
              ? _ !== E && (r.track({ type: 3, doc: f }), (I = !0))
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
                ? ((o = o.add(f)), (s = E ? s.add(l) : s.delete(l)))
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
            let E = (I) => {
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
            return E(f) - E(_)
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
              snapshot: new kr(
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
              Pa: new Va(),
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
          this.aa.has(r) || n.push(new ja(r))
        }),
        this.aa.forEach((r) => {
          e.has(r) || n.push(new Ua(r))
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
      return kr.fromInitialDocuments(
        this.query,
        this.ca,
        this.mutatedKeys,
        this._a === 0,
        this.hasCachedResults
      )
    }
  },
  yf = class {
    constructor(e, n, r) {
      ;(this.query = e), (this.targetId = n), (this.view = r)
    }
  },
  vf = class {
    constructor(e) {
      ;(this.key = e), (this.ma = !1)
    }
  },
  _f = class {
    constructor(e, n, r, i, s, o) {
      ;(this.localStore = e),
        (this.remoteStore = n),
        (this.eventManager = r),
        (this.sharedClientState = i),
        (this.currentUser = s),
        (this.maxConcurrentLimboResolutions = o),
        (this.fa = {}),
        (this.ga = new Qt((a) => Y_(a), Ya)),
        (this.pa = new Map()),
        (this.ya = new Set()),
        (this.wa = new te(D.comparator)),
        (this.Sa = new Map()),
        (this.ba = new as()),
        (this.Da = {}),
        (this.Ca = new Map()),
        (this.va = os.Bn()),
        (this.onlineState = 'Unknown'),
        (this.Fa = void 0)
    }
    get isPrimaryClient() {
      return this.Fa === !0
    }
  }
function wR(t, e) {
  return p(this, null, function* () {
    let n = NR(t),
      r,
      i,
      s = n.ga.get(e)
    if (s)
      (r = s.targetId),
        n.sharedClientState.addLocalQueryTarget(r),
        (i = s.view.Va())
    else {
      let o = yield dR(n.localStore, ft(e)),
        a = n.sharedClientState.addLocalQueryTarget(o.targetId)
      ;(r = o.targetId),
        (i = yield DR(n, e, r, a === 'current', o.resumeToken)),
        n.isPrimaryClient && gI(n.remoteStore, o)
    }
    return i
  })
}
function DR(t, e, n, r, i) {
  return p(this, null, function* () {
    t.Ma = (d, h, f) =>
      (function (E, I, S, L) {
        return p(this, null, function* () {
          let z = I.view.ha(S)
          z.Xi &&
            (z = yield M_(E.localStore, I.query, !1).then(({ documents: Se }) =>
              I.view.ha(Se, z)
            ))
          let $ = L && L.targetChanges.get(I.targetId),
            X = L && L.targetMismatches.get(I.targetId) != null,
            H = I.view.applyChanges(z, E.isPrimaryClient, $, X)
          return F_(E, I.targetId, H.da), H.snapshot
        })
      })(t, d, h, f)
    let s = yield M_(t.localStore, e, !0),
      o = new mf(e, s.hs),
      a = o.ha(s.documents),
      c = is.createSynthesizedTargetChangeForCurrentChange(
        n,
        r && t.onlineState !== 'Offline',
        i
      ),
      u = o.applyChanges(a, t.isPrimaryClient, c)
    F_(t, n, u.da)
    let l = new yf(e, n, o)
    return (
      t.ga.set(e, l),
      t.pa.has(n) ? t.pa.get(n).push(e) : t.pa.set(n, [e]),
      u.snapshot
    )
  })
}
function TR(t, e) {
  return p(this, null, function* () {
    let n = F(t),
      r = n.ga.get(e),
      i = n.pa.get(r.targetId)
    if (i.length > 1)
      return (
        n.pa.set(
          r.targetId,
          i.filter((s) => !Ya(s, e))
        ),
        void n.ga.delete(e)
      )
    n.isPrimaryClient
      ? (n.sharedClientState.removeLocalQueryTarget(r.targetId),
        n.sharedClientState.isActiveQueryTarget(r.targetId) ||
          (yield tf(n.localStore, r.targetId, !1)
            .then(() => {
              n.sharedClientState.clearQueryState(r.targetId),
                mI(n.remoteStore, r.targetId),
                If(n, r.targetId)
            })
            .catch(xf)))
      : (If(n, r.targetId), yield tf(n.localStore, r.targetId, !0))
  })
}
function II(t, e) {
  return p(this, null, function* () {
    let n = F(t)
    try {
      let r = yield uR(n.localStore, e)
      e.targetChanges.forEach((i, s) => {
        let o = n.Sa.get(s)
        o &&
          (se(
            i.addedDocuments.size +
              i.modifiedDocuments.size +
              i.removedDocuments.size <=
              1
          ),
          i.addedDocuments.size > 0
            ? (o.ma = !0)
            : i.modifiedDocuments.size > 0
              ? se(o.ma)
              : i.removedDocuments.size > 0 && (se(o.ma), (o.ma = !1)))
      }),
        yield wI(n, r, e)
    } catch (r) {
      yield xf(r)
    }
  })
}
function k_(t, e, n) {
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
          u && $f(c)
      })(r.eventManager, e),
      i.length && r.fa.u_(i),
      (r.onlineState = e),
      r.isPrimaryClient && r.sharedClientState.setOnlineState(e)
  }
}
function CR(t, e, n) {
  return p(this, null, function* () {
    let r = F(t)
    r.sharedClientState.updateQueryState(e, 'rejected', n)
    let i = r.Sa.get(e),
      s = i && i.key
    if (s) {
      let o = new te(D.comparator)
      o = o.insert(s, Qe.newNoDocument(s, A.min()))
      let a = O().add(s),
        c = new Na(A.min(), new Map(), new te(V), o, a)
      yield II(r, c), (r.wa = r.wa.remove(s)), r.Sa.delete(e), Hf(r)
    } else
      yield tf(r.localStore, e, !1)
        .then(() => If(r, e, n))
        .catch(xf)
  })
}
function If(t, e, n = null) {
  t.sharedClientState.removeLocalQueryTarget(e)
  for (let r of t.pa.get(e)) t.ga.delete(r), n && t.fa.xa(r, n)
  t.pa.delete(e),
    t.isPrimaryClient &&
      t.ba.Vr(e).forEach((r) => {
        t.ba.containsKey(r) || EI(t, r)
      })
}
function EI(t, e) {
  t.ya.delete(e.path.canonicalString())
  let n = t.wa.get(e)
  n !== null &&
    (mI(t.remoteStore, n), (t.wa = t.wa.remove(e)), t.Sa.delete(n), Hf(t))
}
function F_(t, e, n) {
  for (let r of n)
    r instanceof Ua
      ? (t.ba.addReference(r.key, e), bR(t, r))
      : r instanceof ja
        ? (v('SyncEngine', 'Document no longer in limbo: ' + r.key),
          t.ba.removeReference(r.key, e),
          t.ba.containsKey(r.key) || EI(t, r.key))
        : b()
}
function bR(t, e) {
  let n = e.key,
    r = n.path.canonicalString()
  t.wa.get(n) ||
    t.ya.has(r) ||
    (v('SyncEngine', 'New document in limbo: ' + n), t.ya.add(r), Hf(t))
}
function Hf(t) {
  for (; t.ya.size > 0 && t.wa.size < t.maxConcurrentLimboResolutions; ) {
    let e = t.ya.values().next().value
    t.ya.delete(e)
    let n = new D(ie.fromString(e)),
      r = t.va.next()
    t.Sa.set(r, new vf(n)),
      (t.wa = t.wa.insert(n, r)),
      gI(
        t.remoteStore,
        new ss(ft(Vf(n.path)), r, 'TargetPurposeLimboResolution', H_._e)
      )
  }
}
function wI(t, e, n) {
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
              let l = Jh.Ki(c.targetId, u)
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
            if (!ls(d)) throw d
            v('LocalStore', 'Failed to update sequence numbers: ' + d)
          }
          for (let d of u) {
            let h = d.targetId
            if (!d.fromCache) {
              let f = l.ns.get(h),
                _ = f.snapshotVersion,
                E = f.withLastLimboFreeSnapshotVersion(_)
              l.ns = l.ns.insert(h, E)
            }
          }
        })
      })(r.localStore, s))
  })
}
function AR(t, e) {
  return p(this, null, function* () {
    let n = F(t)
    if (!n.currentUser.isEqual(e)) {
      v('SyncEngine', 'User change. New user:', e.toKey())
      let r = yield hI(n.localStore, e)
      ;(n.currentUser = e),
        (function (s, o) {
          s.Ca.forEach((a) => {
            a.forEach((c) => {
              c.reject(new w(m.CANCELLED, o))
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
        yield wI(n, r.us)
    }
  })
}
function SR(t, e) {
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
function NR(t) {
  let e = F(t)
  return (
    (e.remoteStore.remoteSyncer.applyRemoteEvent = II.bind(null, e)),
    (e.remoteStore.remoteSyncer.getRemoteKeysForTarget = SR.bind(null, e)),
    (e.remoteStore.remoteSyncer.rejectListen = CR.bind(null, e)),
    (e.fa.u_ = IR.bind(null, e.eventManager)),
    (e.fa.xa = ER.bind(null, e.eventManager)),
    e
  )
}
var Ba = class {
  constructor() {
    this.synchronizeTabs = !1
  }
  initialize(e) {
    return p(this, null, function* () {
      ;(this.serializer = pI(e.databaseInfo.databaseId)),
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
    return cR(this.persistence, new Xh(), e.initialUser, this.serializer)
  }
  createPersistence(e) {
    return new Kh(Yh.Hr, this.serializer)
  }
  createSharedClientState(e) {
    return new nf()
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
var Ef = class {
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
          k_(this.syncEngine, r, 1)),
        (this.remoteStore.remoteSyncer.handleCredentialChange = AR.bind(
          null,
          this.syncEngine
        )),
        yield yR(this.remoteStore, this.syncEngine.isPrimaryClient))
    })
  }
  createEventManager(e) {
    return (function () {
      return new pf()
    })()
  }
  createDatastore(e) {
    let n = pI(e.databaseInfo.databaseId),
      r = (function (s) {
        return new of(s)
      })(e.databaseInfo)
    return (function (s, o, a, c) {
      return new uf(s, o, a, c)
    })(e.authCredentials, e.appCheckCredentials, r, n)
  }
  createRemoteStore(e) {
    return (function (r, i, s, o, a) {
      return new df(r, i, s, o, a)
    })(
      this.localStore,
      this.datastore,
      e.asyncQueue,
      (n) => k_(this.syncEngine, n, 0),
      (function () {
        return ka.D() ? new ka() : new rf()
      })()
    )
  }
  createSyncEngine(e, n) {
    return (function (i, s, o, a, c, u, l) {
      let d = new _f(i, s, o, a, c, u)
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
            yield ds(i),
            i.M_.shutdown(),
            i.x_.set('Unknown')
        })
      })(this.remoteStore),
        (e = this.datastore) === null || e === void 0 || e.terminate()
    })
  }
}
var wf = class {
  constructor(e) {
    ;(this.observer = e), (this.muted = !1)
  }
  next(e) {
    this.observer.next && this.Ba(this.observer.next, e)
  }
  error(e) {
    this.observer.error
      ? this.Ba(this.observer.error, e)
      : pt('Uncaught Error in snapshot listener:', e.toString())
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
var Df = class {
  constructor(e, n, r, i) {
    ;(this.authCredentials = e),
      (this.appCheckCredentials = n),
      (this.asyncQueue = r),
      (this.databaseInfo = i),
      (this.user = de.UNAUTHENTICATED),
      (this.clientId = ah.newId()),
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
      throw new w(
        m.FAILED_PRECONDITION,
        'The client has already been terminated.'
      )
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode()
    let e = new Nt()
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
            let r = _I(n, 'Failed to shutdown persistence')
            e.reject(r)
          }
        })
      ),
      e.promise
    )
  }
}
function Xd(t, e) {
  return p(this, null, function* () {
    t.asyncQueue.verifyOperationInProgress(),
      v('FirestoreClient', 'Initializing OfflineComponentProvider')
    let n = t.configuration
    yield e.initialize(n)
    let r = n.initialUser
    t.setCredentialChangeListener((i) =>
      p(this, null, function* () {
        r.isEqual(i) || (yield hI(e.localStore, i), (r = i))
      })
    ),
      e.persistence.setDatabaseDeletedListener(() => t.terminate()),
      (t._offlineComponents = e)
  })
}
function L_(t, e) {
  return p(this, null, function* () {
    t.asyncQueue.verifyOperationInProgress()
    let n = yield xR(t)
    v('FirestoreClient', 'Initializing OnlineComponentProvider'),
      yield e.initialize(n, t.configuration),
      t.setCredentialChangeListener((r) => O_(e.remoteStore, r)),
      t.setAppCheckTokenChangeListener((r, i) => O_(e.remoteStore, i)),
      (t._onlineComponents = e)
  })
}
function RR(t) {
  return t.name === 'FirebaseError'
    ? t.code === m.FAILED_PRECONDITION || t.code === m.UNIMPLEMENTED
    : !(typeof DOMException < 'u' && t instanceof DOMException) ||
        t.code === 22 ||
        t.code === 20 ||
        t.code === 11
}
function xR(t) {
  return p(this, null, function* () {
    if (!t._offlineComponents)
      if (t._uninitializedComponentsProvider) {
        v('FirestoreClient', 'Using user provided OfflineComponentProvider')
        try {
          yield Xd(t, t._uninitializedComponentsProvider._offline)
        } catch (e) {
          let n = e
          if (!RR(n)) throw n
          Tr(
            'Error using user provided cache. Falling back to memory cache: ' +
              n
          ),
            yield Xd(t, new Ba())
        }
      } else
        v('FirestoreClient', 'Using default OfflineComponentProvider'),
          yield Xd(t, new Ba())
    return t._offlineComponents
  })
}
function MR(t) {
  return p(this, null, function* () {
    return (
      t._onlineComponents ||
        (t._uninitializedComponentsProvider
          ? (v(
              'FirestoreClient',
              'Using user provided OnlineComponentProvider'
            ),
            yield L_(t, t._uninitializedComponentsProvider._online))
          : (v('FirestoreClient', 'Using default OnlineComponentProvider'),
            yield L_(t, new Ef()))),
      t._onlineComponents
    )
  })
}
function V_(t) {
  return p(this, null, function* () {
    let e = yield MR(t),
      n = e.eventManager
    return (
      (n.onListen = wR.bind(null, e.syncEngine)),
      (n.onUnlisten = TR.bind(null, e.syncEngine)),
      n
    )
  })
}
function DI(t) {
  let e = {}
  return t.timeoutSeconds !== void 0 && (e.timeoutSeconds = t.timeoutSeconds), e
}
var U_ = new Map()
function PR(t, e, n) {
  if (!n)
    throw new w(
      m.INVALID_ARGUMENT,
      `Function ${t}() cannot be called with an empty ${e}.`
    )
}
function OR(t, e, n, r) {
  if (e === !0 && r === !0)
    throw new w(m.INVALID_ARGUMENT, `${t} and ${n} cannot be used together.`)
}
function j_(t) {
  if (D.isDocumentKey(t))
    throw new w(
      m.INVALID_ARGUMENT,
      `Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`
    )
}
function kR(t) {
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
function Ia(t, e) {
  if (('_delegate' in t && (t = t._delegate), !(t instanceof e))) {
    if (e.name === t.constructor.name)
      throw new w(
        m.INVALID_ARGUMENT,
        'Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?'
      )
    {
      let n = kR(t)
      throw new w(
        m.INVALID_ARGUMENT,
        `Expected type '${e.name}', but it was: ${n}`
      )
    }
  }
  return t
}
var $a = class {
    constructor(e) {
      var n, r
      if (e.host === void 0) {
        if (e.ssl !== void 0)
          throw new w(
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
          throw new w(
            m.INVALID_ARGUMENT,
            'cacheSizeBytes must be at least 1048576'
          )
        this.cacheSizeBytes = e.cacheSizeBytes
      }
      OR(
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
        (this.experimentalLongPollingOptions = DI(
          (r = e.experimentalLongPollingOptions) !== null && r !== void 0
            ? r
            : {}
        )),
        (function (s) {
          if (s.timeoutSeconds !== void 0) {
            if (isNaN(s.timeoutSeconds))
              throw new w(
                m.INVALID_ARGUMENT,
                `invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`
              )
            if (s.timeoutSeconds < 5)
              throw new w(
                m.INVALID_ARGUMENT,
                `invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`
              )
            if (s.timeoutSeconds > 30)
              throw new w(
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
  cs = class {
    constructor(e, n, r, i) {
      ;(this._authCredentials = e),
        (this._appCheckCredentials = n),
        (this._databaseId = r),
        (this._app = i),
        (this.type = 'firestore-lite'),
        (this._persistenceKey = '(lite)'),
        (this._settings = new $a({})),
        (this._settingsFrozen = !1)
    }
    get app() {
      if (!this._app)
        throw new w(
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
        throw new w(
          m.FAILED_PRECONDITION,
          'Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.'
        )
      ;(this._settings = new $a(e)),
        e.credentials !== void 0 &&
          (this._authCredentials = (function (r) {
            if (!r) return new eh()
            switch (r.type) {
              case 'firstParty':
                return new ih(
                  r.sessionIndex || '0',
                  r.iamToken || null,
                  r.authTokenFactory || null
                )
              case 'provider':
                return r.client
              default:
                throw new w(
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
          let r = U_.get(n)
          r &&
            (v('ComponentProvider', 'Removing Datastore'),
            U_.delete(n),
            r.terminate())
        })(this),
        Promise.resolve()
      )
    }
  }
function TI(t, e, n, r = {}) {
  var i
  let s = (t = Ia(t, cs))._getSettings(),
    o = `${e}:${n}`
  if (
    (s.host !== 'firestore.googleapis.com' &&
      s.host !== o &&
      Tr(
        'Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.'
      ),
    t._setSettings(Object.assign(Object.assign({}, s), { host: o, ssl: !1 })),
    r.mockUserToken)
  ) {
    let a, c
    if (typeof r.mockUserToken == 'string')
      (a = r.mockUserToken), (c = de.MOCK_USER)
    else {
      a = cy(
        r.mockUserToken,
        (i = t._app) === null || i === void 0 ? void 0 : i.options.projectId
      )
      let u = r.mockUserToken.sub || r.mockUserToken.user_id
      if (!u)
        throw new w(
          m.INVALID_ARGUMENT,
          "mockUserToken must contain 'sub' or 'user_id' field!"
        )
      c = new de(u)
    }
    t._authCredentials = new th(new Ea(a, c))
  }
}
var Ha = class t {
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
  Vn = class t {
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
      return new wr(this.firestore, this.converter, this._key.path.popLast())
    }
    withConverter(e) {
      return new t(this.firestore, e, this._key)
    }
  },
  wr = class t extends Ha {
    constructor(e, n, r) {
      super(e, n, Vf(r)), (this._path = r), (this.type = 'collection')
    }
    get id() {
      return this._query.path.lastSegment()
    }
    get path() {
      return this._query.path.canonicalString()
    }
    get parent() {
      let e = this._path.popLast()
      return e.isEmpty() ? null : new Vn(this.firestore, null, new D(e))
    }
    withConverter(e) {
      return new t(this.firestore, e, this._path)
    }
  }
function CI(t, e, ...n) {
  if (((t = jt(t)), PR('collection', 'path', e), t instanceof cs)) {
    let r = ie.fromString(e, ...n)
    return j_(r), new wr(t, null, r)
  }
  {
    if (!(t instanceof Vn || t instanceof wr))
      throw new w(
        m.INVALID_ARGUMENT,
        'Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore'
      )
    let r = t._path.child(ie.fromString(e, ...n))
    return j_(r), new wr(t.firestore, null, r)
  }
}
var Tf = class {
  constructor() {
    ;(this.Xa = Promise.resolve()),
      (this.eu = []),
      (this.tu = !1),
      (this.nu = []),
      (this.ru = null),
      (this.iu = !1),
      (this.su = !1),
      (this.ou = []),
      (this.jo = new Fa(this, 'async_queue_retry')),
      (this._u = () => {
        let n = Zd()
        n &&
          v('AsyncQueue', 'Visibility state changed to ' + n.visibilityState),
          this.jo.Ko()
      })
    let e = Zd()
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
      let n = Zd()
      n &&
        typeof n.removeEventListener == 'function' &&
        n.removeEventListener('visibilitychange', this._u)
    }
  }
  enqueue(e) {
    if ((this.au(), this.tu)) return new Promise(() => {})
    let n = new Nt()
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
          if (!ls(e)) throw e
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
            throw (pt('INTERNAL UNHANDLED ERROR: ', i), r)
          })
          .then((r) => ((this.iu = !1), r))
      )
    )
    return (this.Xa = n), n
  }
  enqueueAfterDelay(e, n, r) {
    this.au(), this.ou.indexOf(e) > -1 && (n = 0)
    let i = hf.createAndSchedule(this, e, n, r, (s) => this.lu(s))
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
function B_(t) {
  return (function (n, r) {
    if (typeof n != 'object' || n === null) return !1
    let i = n
    for (let s of r) if (s in i && typeof i[s] == 'function') return !0
    return !1
  })(t, ['next', 'error', 'complete'])
}
var us = class extends cs {
  constructor(e, n, r, i) {
    super(e, n, r, i),
      (this.type = 'firestore'),
      (this._queue = (function () {
        return new Tf()
      })()),
      (this._persistenceKey = i?.name || '[DEFAULT]')
  }
  _terminate() {
    return this._firestoreClient || AI(this), this._firestoreClient.terminate()
  }
}
function bI(t, e) {
  let n = typeof t == 'object' ? t : gi(),
    r = typeof t == 'string' ? t : e || '(default)',
    i = Bl(n, 'firestore').getImmediate({ identifier: r })
  if (!i._initialized) {
    let s = oy('firestore')
    s && TI(i, ...s)
  }
  return i
}
function FR(t) {
  return (
    t._firestoreClient || AI(t),
    t._firestoreClient.verifyNotTerminated(),
    t._firestoreClient
  )
}
function AI(t) {
  var e, n, r
  let i = t._freezeSettings(),
    s = (function (a, c, u, l) {
      return new fh(
        a,
        c,
        u,
        l.host,
        l.ssl,
        l.experimentalForceLongPolling,
        l.experimentalAutoDetectLongPolling,
        DI(l.experimentalLongPollingOptions),
        l.useFetchStreams
      )
    })(
      t._databaseId,
      ((e = t._app) === null || e === void 0 ? void 0 : e.options.appId) || '',
      t._persistenceKey,
      i
    )
  ;(t._firestoreClient = new Df(
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
var Cf = class t {
  constructor(e) {
    this._byteString = e
  }
  static fromBase64String(e) {
    try {
      return new t(be.fromBase64String(e))
    } catch (n) {
      throw new w(
        m.INVALID_ARGUMENT,
        'Failed to construct data from Base64 string: ' + n
      )
    }
  }
  static fromUint8Array(e) {
    return new t(be.fromUint8Array(e))
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
var qa = class {
  constructor(...e) {
    for (let n = 0; n < e.length; ++n)
      if (e[n].length === 0)
        throw new w(
          m.INVALID_ARGUMENT,
          'Invalid field name at argument $(i + 1). Field names must not be empty.'
        )
    this._internalPath = new Ke(e)
  }
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath)
  }
}
var bf = class {
  constructor(e, n) {
    if (!isFinite(e) || e < -90 || e > 90)
      throw new w(
        m.INVALID_ARGUMENT,
        'Latitude must be a number between -90 and 90, but was: ' + e
      )
    if (!isFinite(n) || n < -180 || n > 180)
      throw new w(
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
var LR = new RegExp('[~\\*/\\[\\]]')
function VR(t, e, n) {
  if (e.search(LR) >= 0)
    throw $_(
      `Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,
      t,
      !1,
      void 0,
      n
    )
  try {
    return new qa(...e.split('.'))._internalPath
  } catch {
    throw $_(
      `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
      t,
      !1,
      void 0,
      n
    )
  }
}
function $_(t, e, n, r, i) {
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
    new w(m.INVALID_ARGUMENT, a + t + c)
  )
}
var za = class {
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
      return new Vn(this._firestore, this._converter, this._key)
    }
    exists() {
      return this._document !== null
    }
    data() {
      if (this._document) {
        if (this._converter) {
          let e = new Af(
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
        let n = this._document.data.field(SI('DocumentSnapshot.get', e))
        if (n !== null) return this._userDataWriter.convertValue(n)
      }
    }
  },
  Af = class extends za {
    data() {
      return super.data()
    }
  }
function SI(t, e) {
  return typeof e == 'string'
    ? VR(t, e)
    : e instanceof qa
      ? e._internalPath
      : e._delegate._internalPath
}
function UR(t) {
  if (t.limitType === 'L' && t.explicitOrderBy.length === 0)
    throw new w(
      m.UNIMPLEMENTED,
      'limitToLast() queries require specifying at least one orderBy() clause'
    )
}
var Sf = class {
  convertValue(e, n = 'none') {
    switch (Ln(e)) {
      case 0:
        return null
      case 1:
        return e.booleanValue
      case 2:
        return Z(e.integerValue || e.doubleValue)
      case 3:
        return this.convertTimestamp(e.timestampValue)
      case 4:
        return this.convertServerTimestamp(e, n)
      case 5:
        return e.stringValue
      case 6:
        return this.convertBytes(Kt(e.bytesValue))
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
      Qa(e, (i, s) => {
        r[i] = this.convertValue(s, n)
      }),
      r
    )
  }
  convertGeoPoint(e) {
    return new bf(Z(e.latitude), Z(e.longitude))
  }
  convertArray(e, n) {
    return (e.values || []).map((r) => this.convertValue(r, n))
  }
  convertServerTimestamp(e, n) {
    switch (n) {
      case 'previous':
        let r = Of(e)
        return r == null ? null : this.convertValue(r, n)
      case 'estimate':
        return this.convertTimestamp(Zi(e))
      default:
        return null
    }
  }
  convertTimestamp(e) {
    let n = Wt(e)
    return new Ve(n.seconds, n.nanos)
  }
  convertDocumentKey(e, n) {
    let r = ie.fromString(e)
    se(dI(r))
    let i = new Aa(r.get(1), r.get(3)),
      s = new D(r.popFirst(5))
    return (
      i.isEqual(n) ||
        pt(
          `Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`
        ),
      s
    )
  }
}
var Pn = class {
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
  Ga = class extends za {
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
          let n = new Dr(
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
        let r = this._document.data.field(SI('DocumentSnapshot.get', e))
        if (r !== null)
          return this._userDataWriter.convertValue(r, n.serverTimestamps)
      }
    }
  },
  Dr = class extends Ga {
    data(e = {}) {
      return super.data(e)
    }
  },
  Nf = class {
    constructor(e, n, r, i) {
      ;(this._firestore = e),
        (this._userDataWriter = n),
        (this._snapshot = i),
        (this.metadata = new Pn(i.hasPendingWrites, i.fromCache)),
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
          new Dr(
            this._firestore,
            this._userDataWriter,
            r.key,
            r,
            new Pn(
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
        throw new w(
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
                let c = new Dr(
                  i._firestore,
                  i._userDataWriter,
                  a.doc.key,
                  a.doc,
                  new Pn(
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
                  let c = new Dr(
                      i._firestore,
                      i._userDataWriter,
                      a.doc.key,
                      a.doc,
                      new Pn(
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
                    { type: jR(a.type), doc: c, oldIndex: u, newIndex: l }
                  )
                })
            }
          })(this, n)),
          (this._cachedChangesIncludeMetadataChanges = n)),
        this._cachedChanges
      )
    }
  }
function jR(t) {
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
var Wa = class extends Sf {
  constructor(e) {
    super(), (this.firestore = e)
  }
  convertBytes(e) {
    return new Cf(e)
  }
  convertReference(e) {
    let n = this.convertDocumentKey(e, this.firestore._databaseId)
    return new Vn(this.firestore, null, n)
  }
}
function qf(t, ...e) {
  var n, r, i
  t = jt(t)
  let s = { includeMetadataChanges: !1 },
    o = 0
  typeof e[o] != 'object' || B_(e[o]) || ((s = e[o]), o++)
  let a = { includeMetadataChanges: s.includeMetadataChanges }
  if (B_(e[o])) {
    let d = e[o]
    ;(e[o] = (n = d.next) === null || n === void 0 ? void 0 : n.bind(d)),
      (e[o + 1] = (r = d.error) === null || r === void 0 ? void 0 : r.bind(d)),
      (e[o + 2] =
        (i = d.complete) === null || i === void 0 ? void 0 : i.bind(d))
  }
  let c, u, l
  if (t instanceof Vn)
    (u = Ia(t.firestore, us)),
      (l = Vf(t._key.path)),
      (c = {
        next: (d) => {
          e[o] && e[o](BR(u, t, d))
        },
        error: e[o + 1],
        complete: e[o + 2],
      })
  else {
    let d = Ia(t, Ha)
    ;(u = Ia(d.firestore, us)), (l = d._query)
    let h = new Wa(u)
    ;(c = {
      next: (f) => {
        e[o] && e[o](new Nf(u, h, d, f))
      },
      error: e[o + 1],
      complete: e[o + 2],
    }),
      UR(t._query)
  }
  return (function (h, f, _, E) {
    let I = new wf(E),
      S = new gf(f, I, _)
    return (
      h.asyncQueue.enqueueAndForget(() =>
        p(this, null, function* () {
          return vR(yield V_(h), S)
        })
      ),
      () => {
        I.La(),
          h.asyncQueue.enqueueAndForget(() =>
            p(this, null, function* () {
              return _R(yield V_(h), S)
            })
          )
      }
    )
  })(FR(u), l, a, c)
}
function BR(t, e, n) {
  let r = n.docs.get(e._key),
    i = new Wa(t)
  return new Ga(
    t,
    i,
    e._key,
    r,
    new Pn(n.hasPendingWrites, n.fromCache),
    e.converter
  )
}
;(function (e, n = !0) {
  ;(function (i) {
    Fr = i
  })(ar),
    Ht(
      new Fe(
        'firestore',
        (r, { instanceIdentifier: i, options: s }) => {
          let o = r.getProvider('app').getImmediate(),
            a = new us(
              new nh(r.getProvider('auth-internal')),
              new oh(r.getProvider('app-check-internal')),
              (function (u, l) {
                if (
                  !Object.prototype.hasOwnProperty.apply(u.options, [
                    'projectId',
                  ])
                )
                  throw new w(
                    m.INVALID_ARGUMENT,
                    '"projectId" not provided in firebase.initializeApp.'
                  )
                return new Aa(u.options.projectId, l)
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
    ce(h_, '4.4.1', e),
    ce(h_, '4.4.1', 'esm2017')
})()
var Xa = function () {
  return (
    (Xa =
      Object.assign ||
      function (e) {
        for (var n, r = 1, i = arguments.length; r < i; r++) {
          n = arguments[r]
          for (var s in n)
            Object.prototype.hasOwnProperty.call(n, s) && (e[s] = n[s])
        }
        return e
      }),
    Xa.apply(this, arguments)
  )
}
var qR = { includeMetadataChanges: !1 }
function NI(t, e) {
  return (
    e === void 0 && (e = qR),
    new je(function (n) {
      var r = qf(t, e, {
        next: n.next.bind(n),
        error: n.error.bind(n),
        complete: n.complete.bind(n),
      })
      return { unsubscribe: r }
    })
  )
}
function RI(t, e) {
  var n
  e === void 0 && (e = {})
  var r = t.data(e)
  return !t.exists() || typeof r != 'object' || r === null || !e.idField
    ? r
    : Xa(Xa({}, r), ((n = {}), (n[e.idField] = t.id), n))
}
function xI(t) {
  return NI(t, { includeMetadataChanges: !0 }).pipe(
    Wn(function (e) {
      return e.docs
    })
  )
}
function MI(t, e) {
  return (
    e === void 0 && (e = {}),
    xI(t).pipe(
      Wn(function (n) {
        return n.map(function (r) {
          return RI(r, e)
        })
      })
    )
  )
}
var Un = class {
    constructor(e) {
      return e
    }
  },
  PI = 'firestore',
  zf = class {
    constructor() {
      return yi(PI)
    }
  }
var Gf = new q('angularfire2.firestore-instances')
function zR(t, e) {
  let n = ql(PI, t, e)
  return n && new Un(n)
}
function GR(t) {
  return (e, n) => {
    let r = e.runOutsideAngular(() => t(n))
    return new Un(r)
  }
}
var WR = { provide: zf, deps: [[new Dt(), Gf]] },
  KR = { provide: Un, useFactory: zR, deps: [[new Dt(), Gf], En] },
  QR = (() => {
    class t {
      constructor() {
        ce('angularfire', ur.full, 'fst')
      }
      static ɵfac = function (r) {
        return new (r || t)()
      }
      static ɵmod = hn({ type: t })
      static ɵinj = dn({ providers: [KR, WR] })
    }
    return t
  })()
function OI(t, ...e) {
  return {
    ngModule: QR,
    providers: [
      {
        provide: Gf,
        useFactory: GR(t),
        multi: !0,
        deps: [Q, kt, vi, _i, [new Dt(), Bo], [new Dt(), mi], ...e],
      },
    ],
  }
}
var kI = In(MI, !0)
var FI = In(CI, !0)
var LI = In(bI, !0)
var VI = {
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
var UI = { providers: [to(Sy(() => Ny(VI.firebase))), to(OI(() => LI()))] }
var jI = (() => {
  let e = class e {
    constructor() {
      this.firestore = ee(Un)
    }
    getCertificates() {
      let r = FI(this.firestore, 'certifications')
      return kI(r, { idField: 'id' })
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵprov = K({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
var BI = (() => {
  let e = class e {}
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = Mt({
      type: e,
      selectors: [['app-footer']],
      standalone: !0,
      features: [Vt],
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
          (he(0, 'footer', 0)(1, 'p', 1)(2, 'small'),
          st(3, ' My Github profile: '),
          he(4, 'a', 2),
          st(5, ' github.com/jpin730 '),
          ve()()()())
      },
      encapsulation: 2,
      changeDetection: 0,
    }))
  let t = e
  return t
})()
function YR(t, e) {
  if (t & 1) {
    let n = po()
    he(0, 'div', 2),
      st(1, ' Click or tap on image to enlarge '),
      he(2, 'button', 3),
      mn('click', function () {
        Zs(n)
        let i = Lt()
        return Xs((i.showAlert = !1))
      }),
      ve()()
  }
}
var $I = (() => {
  let e = class e {
    constructor() {
      this.showAlert = !0
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = Mt({
      type: e,
      selectors: [['app-instructions']],
      standalone: !0,
      features: [Vt],
      decls: 2,
      vars: 1,
      consts: [
        [1, 'mb-4'],
        ['class', 'alert alert-info alert-dismissible text-center'],
        [1, 'alert', 'alert-info', 'alert-dismissible', 'text-center'],
        ['type', 'button', 1, 'btn-close', 3, 'click'],
      ],
      template: function (i, s) {
        i & 1 && (he(0, 'div', 0), cn(1, YR, 3, 0, 'div', 1), ve()),
          i & 2 && (it(), lo(1, s.showAlert ? 1 : -1))
      },
      encapsulation: 2,
      changeDetection: 0,
    }))
  let t = e
  return t
})()
function JR(t, e) {
  if (t & 1) {
    let n = po()
    he(0, 'button', 1),
      mn('click', function () {
        let s = Zs(n).$implicit,
          o = Lt()
        return Xs(o.onSelectCategory(s))
      }),
      st(1),
      ve()
  }
  if (t & 2) {
    let n = e.$implicit,
      r = Lt()
    Rm(r.selectedCategory === n ? 'btn-primary' : 'btn-outline-primary'),
      it(),
      mo(' ', n, ' ')
  }
}
var HI = (() => {
  let e = class e {
    constructor() {
      ;(this.categoryChange = new tn()),
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
    (e.ɵcmp = Mt({
      type: e,
      selectors: [['app-category-selector']],
      inputs: { categories: 'categories' },
      outputs: { categoryChange: 'categoryChange' },
      standalone: !0,
      features: [Vt],
      decls: 3,
      vars: 0,
      consts: [
        [1, 'mb-3', 'd-flex', 'flex-wrap'],
        [1, 'btn', 'btn-sm', 'me-2', 'mb-2', 3, 'click'],
        ['class', 'btn btn-sm me-2 mb-2', 3, 'class'],
      ],
      template: function (i, s) {
        i & 1 && (he(0, 'div', 0), ho(1, JR, 2, 3, 'button', 2, km), ve()),
          i & 2 && (it(), fo(s._categories))
      },
      encapsulation: 2,
    }))
  let t = e
  return t
})()
var ZR = (t, e) => e.id
function XR(t, e) {
  if ((t & 1 && (he(0, 'p'), st(1), ve()), t & 2)) {
    let n = Lt().$implicit
    it(), sl(n.id)
  }
}
function ex(t, e) {
  if ((t & 1 && cn(0, XR, 2, 1, 'p'), t & 2)) {
    let n = e.$implicit,
      r = Lt()
    lo(
      0,
      n.category === r.selectedCategory || r.selectedCategory === 'All' ? 0 : -1
    )
  }
}
var qI = (() => {
  let e = class e {
    constructor() {
      ;(this.appService = ee(jI)),
        (this.categories = []),
        (this.selectedCategory = 'All')
    }
    ngOnInit() {
      this.certificates$ = this.appService.getCertificates().pipe(
        gc(1),
        Kn((r) => {
          this.categories = [...new Set(r.map((i) => i.category).sort())]
        })
      )
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = Mt({
      type: e,
      selectors: [['app-root']],
      standalone: !0,
      features: [Vt],
      decls: 11,
      vars: 5,
      consts: [
        [
          1,
          'bg-light',
          'd-flex',
          'flex-column',
          'justify-content-between',
          'min-vh-100',
        ],
        [1, 'navbar', 'bg-dark'],
        [1, 'flex-grow-1', 'container'],
        [1, 'text-center', 'my-4'],
        [3, 'categories', 'categoryChange'],
      ],
      template: function (i, s) {
        i & 1 &&
          (he(0, 'div', 0),
          ci(1, 'nav', 1),
          he(2, 'main', 2)(3, 'h1', 3),
          st(4, "Jaime Pineda's Certificates"),
          ve(),
          ci(5, 'app-instructions'),
          he(6, 'app-category-selector', 4),
          mn('categoryChange', function (a) {
            return (s.selectedCategory = a)
          }),
          ve(),
          ho(7, ex, 1, 1, null, null, ZR),
          Fm(9, 'async'),
          ve(),
          ci(10, 'app-footer'),
          ve()),
          i & 2 &&
            (it(),
            uo('height', '40px'),
            it(5),
            rl('categories', s.categories),
            it(),
            fo(Lm(9, 3, s.certificates$)))
      },
      dependencies: [hl, Gm, BI, $I, HI],
      encapsulation: 2,
    }))
  let t = e
  return t
})()
ty(qI, UI).catch((t) => console.error(t))
