var Qw = Object.defineProperty,
  Yw = Object.defineProperties
var Jw = Object.getOwnPropertyDescriptors
var Jp = Object.getOwnPropertySymbols
var Zw = Object.prototype.hasOwnProperty,
  Xw = Object.prototype.propertyIsEnumerable
var Zp = (t, e, n) =>
    e in t
      ? Qw(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (t[e] = n),
  Ct = (t, e) => {
    for (var n in (e ||= {})) Zw.call(e, n) && Zp(t, n, e[n])
    if (Jp) for (var n of Jp(e)) Xw.call(e, n) && Zp(t, n, e[n])
    return t
  },
  $t = (t, e) => Yw(t, Jw(e))
var A = (t, e, n) =>
  new Promise((r, i) => {
    var s = (u) => {
        try {
          c(n.next(u))
        } catch (d) {
          i(d)
        }
      },
      o = (u) => {
        try {
          c(n.throw(u))
        } catch (d) {
          i(d)
        }
      },
      c = (u) => (u.done ? r(u.value) : Promise.resolve(u.value).then(s, o))
    c((n = n.apply(t, e)).next())
  })
var Xp = null
var Vc = 1,
  em = Symbol('SIGNAL')
function Ae(t) {
  let e = Xp
  return (Xp = t), e
}
var tm = {
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
function eE(t) {
  if (!(Bc(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Vc)) {
    if (!t.producerMustRecompute(t) && !Uc(t)) {
      ;(t.dirty = !1), (t.lastCleanEpoch = Vc)
      return
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = Vc)
  }
}
function nm(t) {
  return t && (t.nextProducerIndex = 0), Ae(t)
}
function rm(t, e) {
  if (
    (Ae(e),
    !(
      !t ||
      t.producerNode === void 0 ||
      t.producerIndexOfThis === void 0 ||
      t.producerLastReadVersion === void 0
    ))
  ) {
    if (Bc(t))
      for (let n = t.nextProducerIndex; n < t.producerNode.length; n++)
        jc(t.producerNode[n], t.producerIndexOfThis[n])
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(),
        t.producerLastReadVersion.pop(),
        t.producerIndexOfThis.pop()
  }
}
function Uc(t) {
  Xs(t)
  for (let e = 0; e < t.producerNode.length; e++) {
    let n = t.producerNode[e],
      r = t.producerLastReadVersion[e]
    if (r !== n.version || (eE(n), r !== n.version)) return !0
  }
  return !1
}
function im(t) {
  if ((Xs(t), Bc(t)))
    for (let e = 0; e < t.producerNode.length; e++)
      jc(t.producerNode[e], t.producerIndexOfThis[e])
  ;(t.producerNode.length =
    t.producerLastReadVersion.length =
    t.producerIndexOfThis.length =
      0),
    t.liveConsumerNode &&
      (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0)
}
function jc(t, e) {
  if ((tE(t), Xs(t), t.liveConsumerNode.length === 1))
    for (let r = 0; r < t.producerNode.length; r++)
      jc(t.producerNode[r], t.producerIndexOfThis[r])
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
    Xs(i), (i.producerIndexOfThis[r] = e)
  }
}
function Bc(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0
}
function Xs(t) {
  ;(t.producerNode ??= []),
    (t.producerIndexOfThis ??= []),
    (t.producerLastReadVersion ??= [])
}
function tE(t) {
  ;(t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= [])
}
function nE() {
  throw new Error()
}
var rE = nE
function sm(t) {
  rE = t
}
function U(t) {
  return typeof t == 'function'
}
function eo(t) {
  let n = t((r) => {
    Error.call(r), (r.stack = new Error().stack)
  })
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  )
}
var to = eo(
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
function Nn(t, e) {
  if (t) {
    let n = t.indexOf(e)
    0 <= n && t.splice(n, 1)
  }
}
var Le = class t {
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
      if (U(r))
        try {
          r()
        } catch (s) {
          e = s instanceof to ? s.errors : [s]
        }
      let { _finalizers: i } = this
      if (i) {
        this._finalizers = null
        for (let s of i)
          try {
            om(s)
          } catch (o) {
            ;(e = e ?? []),
              o instanceof to ? (e = [...e, ...o.errors]) : e.push(o)
          }
      }
      if (e) throw new to(e)
    }
  }
  add(e) {
    var n
    if (e && e !== this)
      if (this.closed) om(e)
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
    n === e ? (this._parentage = null) : Array.isArray(n) && Nn(n, e)
  }
  remove(e) {
    let { _finalizers: n } = this
    n && Nn(n, e), e instanceof t && e._removeParent(this)
  }
}
Le.EMPTY = (() => {
  let t = new Le()
  return (t.closed = !0), t
})()
var $c = Le.EMPTY
function no(t) {
  return (
    t instanceof Le ||
    (t && 'closed' in t && U(t.remove) && U(t.add) && U(t.unsubscribe))
  )
}
function om(t) {
  U(t) ? t() : t.unsubscribe()
}
var gt = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
}
var hr = {
  setTimeout(t, e, ...n) {
    let { delegate: r } = hr
    return r?.setTimeout ? r.setTimeout(t, e, ...n) : setTimeout(t, e, ...n)
  },
  clearTimeout(t) {
    let { delegate: e } = hr
    return (e?.clearTimeout || clearTimeout)(t)
  },
  delegate: void 0,
}
function ro(t) {
  hr.setTimeout(() => {
    let { onUnhandledError: e } = gt
    if (e) e(t)
    else throw t
  })
}
function Hc() {}
var am = qc('C', void 0, void 0)
function cm(t) {
  return qc('E', void 0, t)
}
function um(t) {
  return qc('N', t, void 0)
}
function qc(t, e, n) {
  return { kind: t, value: e, error: n }
}
var Mn = null
function fr(t) {
  if (gt.useDeprecatedSynchronousErrorHandling) {
    let e = !Mn
    if ((e && (Mn = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: n, error: r } = Mn
      if (((Mn = null), n)) throw r
    }
  } else t()
}
function lm(t) {
  gt.useDeprecatedSynchronousErrorHandling &&
    Mn &&
    ((Mn.errorThrown = !0), (Mn.error = t))
}
var Pn = class extends Le {
    constructor(e) {
      super(),
        (this.isStopped = !1),
        e
          ? ((this.destination = e), no(e) && e.add(this))
          : (this.destination = oE)
    }
    static create(e, n, r) {
      return new pr(e, n, r)
    }
    next(e) {
      this.isStopped ? Gc(um(e), this) : this._next(e)
    }
    error(e) {
      this.isStopped ? Gc(cm(e), this) : ((this.isStopped = !0), this._error(e))
    }
    complete() {
      this.isStopped ? Gc(am, this) : ((this.isStopped = !0), this._complete())
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
  iE = Function.prototype.bind
function zc(t, e) {
  return iE.call(t, e)
}
var Wc = class {
    constructor(e) {
      this.partialObserver = e
    }
    next(e) {
      let { partialObserver: n } = this
      if (n.next)
        try {
          n.next(e)
        } catch (r) {
          io(r)
        }
    }
    error(e) {
      let { partialObserver: n } = this
      if (n.error)
        try {
          n.error(e)
        } catch (r) {
          io(r)
        }
      else io(e)
    }
    complete() {
      let { partialObserver: e } = this
      if (e.complete)
        try {
          e.complete()
        } catch (n) {
          io(n)
        }
    }
  },
  pr = class extends Pn {
    constructor(e, n, r) {
      super()
      let i
      if (U(e) || !e)
        i = { next: e ?? void 0, error: n ?? void 0, complete: r ?? void 0 }
      else {
        let s
        this && gt.useDeprecatedNextContext
          ? ((s = Object.create(e)),
            (s.unsubscribe = () => this.unsubscribe()),
            (i = {
              next: e.next && zc(e.next, s),
              error: e.error && zc(e.error, s),
              complete: e.complete && zc(e.complete, s),
            }))
          : (i = e)
      }
      this.destination = new Wc(i)
    }
  }
function io(t) {
  gt.useDeprecatedSynchronousErrorHandling ? lm(t) : ro(t)
}
function sE(t) {
  throw t
}
function Gc(t, e) {
  let { onStoppedNotification: n } = gt
  n && hr.setTimeout(() => n(t, e))
}
var oE = { closed: !0, next: Hc, error: sE, complete: Hc }
var mr = (typeof Symbol == 'function' && Symbol.observable) || '@@observable'
function so(t) {
  return t
}
function dm(t) {
  return t.length === 0
    ? so
    : t.length === 1
      ? t[0]
      : function (n) {
          return t.reduce((r, i) => i(r), n)
        }
}
var ue = (() => {
  class t {
    constructor(n) {
      n && (this._subscribe = n)
    }
    lift(n) {
      let r = new t()
      return (r.source = this), (r.operator = n), r
    }
    subscribe(n, r, i) {
      let s = cE(n) ? n : new pr(n, r, i)
      return (
        fr(() => {
          let { operator: o, source: c } = this
          s.add(
            o ? o.call(s, c) : c ? this._subscribe(s) : this._trySubscribe(s)
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
        (r = hm(r)),
        new r((i, s) => {
          let o = new pr({
            next: (c) => {
              try {
                n(c)
              } catch (u) {
                s(u), o.unsubscribe()
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
    [mr]() {
      return this
    }
    pipe(...n) {
      return dm(n)(this)
    }
    toPromise(n) {
      return (
        (n = hm(n)),
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
function hm(t) {
  var e
  return (e = t ?? gt.Promise) !== null && e !== void 0 ? e : Promise
}
function aE(t) {
  return t && U(t.next) && U(t.error) && U(t.complete)
}
function cE(t) {
  return (t && t instanceof Pn) || (aE(t) && no(t))
}
function uE(t) {
  return U(t?.lift)
}
function Qe(t) {
  return (e) => {
    if (uE(e))
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
function et(t, e, n, r, i) {
  return new Kc(t, e, n, r, i)
}
var Kc = class extends Pn {
  constructor(e, n, r, i, s, o) {
    super(e),
      (this.onFinalize = s),
      (this.shouldUnsubscribe = o),
      (this._next = n
        ? function (c) {
            try {
              n(c)
            } catch (u) {
              e.error(u)
            }
          }
        : super._next),
      (this._error = i
        ? function (c) {
            try {
              i(c)
            } catch (u) {
              e.error(u)
            } finally {
              this.unsubscribe()
            }
          }
        : super._error),
      (this._complete = r
        ? function () {
            try {
              r()
            } catch (c) {
              e.error(c)
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
var fm = eo(
  (t) =>
    function () {
      t(this),
        (this.name = 'ObjectUnsubscribedError'),
        (this.message = 'object unsubscribed')
    }
)
var gr = (() => {
    class t extends ue {
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
        let r = new oo(this, this)
        return (r.operator = n), r
      }
      _throwIfClosed() {
        if (this.closed) throw new fm()
      }
      next(n) {
        fr(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers))
            for (let r of this.currentObservers) r.next(n)
          }
        })
      }
      error(n) {
        fr(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ;(this.hasError = this.isStopped = !0), (this.thrownError = n)
            let { observers: r } = this
            for (; r.length; ) r.shift().error(n)
          }
        })
      }
      complete() {
        fr(() => {
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
          ? $c
          : ((this.currentObservers = null),
            s.push(n),
            new Le(() => {
              ;(this.currentObservers = null), Nn(s, n)
            }))
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: i, isStopped: s } = this
        r ? n.error(i) : s && n.complete()
      }
      asObservable() {
        let n = new ue()
        return (n.source = this), n
      }
    }
    return (t.create = (e, n) => new oo(e, n)), t
  })(),
  oo = class extends gr {
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
        : $c
    }
  }
var bi = class extends gr {
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
var Qc = {
  now() {
    return (Qc.delegate || Date).now()
  },
  delegate: void 0,
}
var ao = class extends Le {
  constructor(e, n) {
    super()
  }
  schedule(e, n = 0) {
    return this
  }
}
var Ci = {
  setInterval(t, e, ...n) {
    let { delegate: r } = Ci
    return r?.setInterval ? r.setInterval(t, e, ...n) : setInterval(t, e, ...n)
  },
  clearInterval(t) {
    let { delegate: e } = Ci
    return (e?.clearInterval || clearInterval)(t)
  },
  delegate: void 0,
}
var yr = class extends ao {
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
    return Ci.setInterval(e.flush.bind(e, this), r)
  }
  recycleAsyncId(e, n, r = 0) {
    if (r != null && this.delay === r && this.pending === !1) return n
    n != null && Ci.clearInterval(n)
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
        Nn(r, this),
        e != null && (this.id = this.recycleAsyncId(n, e, null)),
        (this.delay = null),
        super.unsubscribe()
    }
  }
}
var vr = class t {
  constructor(e, n = t.now) {
    ;(this.schedulerActionCtor = e), (this.now = n)
  }
  schedule(e, n = 0, r) {
    return new this.schedulerActionCtor(this, e).schedule(r, n)
  }
}
vr.now = Qc.now
var _r = class extends vr {
  constructor(e, n = vr.now) {
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
var Yc = new _r(yr)
var co = class extends yr {
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
var uo = class extends _r {}
var Jc = new uo(co)
var pm = new ue((t) => t.complete())
function mm(t) {
  return t && U(t.schedule)
}
function lE(t) {
  return t[t.length - 1]
}
function gm(t) {
  return mm(lE(t)) ? t.pop() : void 0
}
function Zc(t, e) {
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
function vm(t, e, n, r) {
  function i(s) {
    return s instanceof n
      ? s
      : new n(function (o) {
          o(s)
        })
  }
  return new (n || (n = Promise))(function (s, o) {
    function c(f) {
      try {
        d(r.next(f))
      } catch (m) {
        o(m)
      }
    }
    function u(f) {
      try {
        d(r.throw(f))
      } catch (m) {
        o(m)
      }
    }
    function d(f) {
      f.done ? s(f.value) : i(f.value).then(c, u)
    }
    d((r = r.apply(t, e || [])).next())
  })
}
function ym(t) {
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
function On(t) {
  return this instanceof On ? ((this.v = t), this) : new On(t)
}
function _m(t, e, n) {
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
  function o(_) {
    r[_] &&
      (i[_] = function (D) {
        return new Promise(function (S, N) {
          s.push([_, D, S, N]) > 1 || c(_, D)
        })
      })
  }
  function c(_, D) {
    try {
      u(r[_](D))
    } catch (S) {
      m(s[0][3], S)
    }
  }
  function u(_) {
    _.value instanceof On
      ? Promise.resolve(_.value.v).then(d, f)
      : m(s[0][2], _)
  }
  function d(_) {
    c('next', _)
  }
  function f(_) {
    c('throw', _)
  }
  function m(_, D) {
    _(D), s.shift(), s.length && c(s[0][0], s[0][1])
  }
}
function Im(t) {
  if (!Symbol.asyncIterator)
    throw new TypeError('Symbol.asyncIterator is not defined.')
  var e = t[Symbol.asyncIterator],
    n
  return e
    ? e.call(t)
    : ((t = typeof ym == 'function' ? ym(t) : t[Symbol.iterator]()),
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
        return new Promise(function (c, u) {
          ;(o = t[s](o)), i(c, u, o.done, o.value)
        })
      }
  }
  function i(s, o, c, u) {
    Promise.resolve(u).then(function (d) {
      s({ value: d, done: c })
    }, o)
  }
}
var Ir = (t) => t && typeof t.length == 'number' && typeof t != 'function'
function lo(t) {
  return U(t?.then)
}
function ho(t) {
  return U(t[mr])
}
function fo(t) {
  return Symbol.asyncIterator && U(t?.[Symbol.asyncIterator])
}
function po(t) {
  return new TypeError(
    `You provided ${t !== null && typeof t == 'object' ? 'an invalid object' : `'${t}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`
  )
}
function dE() {
  return typeof Symbol != 'function' || !Symbol.iterator
    ? '@@iterator'
    : Symbol.iterator
}
var mo = dE()
function go(t) {
  return U(t?.[mo])
}
function yo(t) {
  return _m(this, arguments, function* () {
    let n = t.getReader()
    try {
      for (;;) {
        let { value: r, done: i } = yield On(n.read())
        if (i) return yield On(void 0)
        yield yield On(r)
      }
    } finally {
      n.releaseLock()
    }
  })
}
function vo(t) {
  return U(t?.getReader)
}
function Ye(t) {
  if (t instanceof ue) return t
  if (t != null) {
    if (ho(t)) return hE(t)
    if (Ir(t)) return fE(t)
    if (lo(t)) return pE(t)
    if (fo(t)) return wm(t)
    if (go(t)) return mE(t)
    if (vo(t)) return gE(t)
  }
  throw po(t)
}
function hE(t) {
  return new ue((e) => {
    let n = t[mr]()
    if (U(n.subscribe)) return n.subscribe(e)
    throw new TypeError(
      'Provided object does not correctly implement Symbol.observable'
    )
  })
}
function fE(t) {
  return new ue((e) => {
    for (let n = 0; n < t.length && !e.closed; n++) e.next(t[n])
    e.complete()
  })
}
function pE(t) {
  return new ue((e) => {
    t.then(
      (n) => {
        e.closed || (e.next(n), e.complete())
      },
      (n) => e.error(n)
    ).then(null, ro)
  })
}
function mE(t) {
  return new ue((e) => {
    for (let n of t) if ((e.next(n), e.closed)) return
    e.complete()
  })
}
function wm(t) {
  return new ue((e) => {
    yE(t, e).catch((n) => e.error(n))
  })
}
function gE(t) {
  return wm(yo(t))
}
function yE(t, e) {
  var n, r, i, s
  return vm(this, void 0, void 0, function* () {
    try {
      for (n = Im(t); (r = yield n.next()), !r.done; ) {
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
function at(t, e, n, r = 0, i = !1) {
  let s = e.schedule(function () {
    n(), i ? t.add(this.schedule(null, r)) : this.unsubscribe()
  }, r)
  if ((t.add(s), !i)) return s
}
function an(t, e = 0) {
  return Qe((n, r) => {
    n.subscribe(
      et(
        r,
        (i) => at(r, t, () => r.next(i), e),
        () => at(r, t, () => r.complete(), e),
        (i) => at(r, t, () => r.error(i), e)
      )
    )
  })
}
function cn(t, e = 0) {
  return Qe((n, r) => {
    r.add(t.schedule(() => n.subscribe(r), e))
  })
}
function Em(t, e) {
  return Ye(t).pipe(cn(e), an(e))
}
function Tm(t, e) {
  return Ye(t).pipe(cn(e), an(e))
}
function Dm(t, e) {
  return new ue((n) => {
    let r = 0
    return e.schedule(function () {
      r === t.length
        ? n.complete()
        : (n.next(t[r++]), n.closed || this.schedule())
    })
  })
}
function bm(t, e) {
  return new ue((n) => {
    let r
    return (
      at(n, e, () => {
        ;(r = t[mo]()),
          at(
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
      () => U(r?.return) && r.return()
    )
  })
}
function _o(t, e) {
  if (!t) throw new Error('Iterable cannot be null')
  return new ue((n) => {
    at(n, e, () => {
      let r = t[Symbol.asyncIterator]()
      at(
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
function Cm(t, e) {
  return _o(yo(t), e)
}
function Am(t, e) {
  if (t != null) {
    if (ho(t)) return Em(t, e)
    if (Ir(t)) return Dm(t, e)
    if (lo(t)) return Tm(t, e)
    if (fo(t)) return _o(t, e)
    if (go(t)) return bm(t, e)
    if (vo(t)) return Cm(t, e)
  }
  throw po(t)
}
function Xc(t, e) {
  return e ? Am(t, e) : Ye(t)
}
function eu(...t) {
  let e = gm(t)
  return Xc(t, e)
}
function ze(t, e) {
  return Qe((n, r) => {
    let i = 0
    n.subscribe(
      et(r, (s) => {
        r.next(t.call(e, s, i++))
      })
    )
  })
}
var { isArray: vE } = Array
function _E(t, e) {
  return vE(e) ? t(...e) : t(e)
}
function Sm(t) {
  return ze((e) => _E(t, e))
}
function Rm(t, e, n, r, i, s, o, c) {
  let u = [],
    d = 0,
    f = 0,
    m = !1,
    _ = () => {
      m && !u.length && !d && e.complete()
    },
    D = (N) => (d < r ? S(N) : u.push(N)),
    S = (N) => {
      s && e.next(N), d++
      let R = !1
      Ye(n(N, f++)).subscribe(
        et(
          e,
          (k) => {
            i?.(k), s ? D(k) : e.next(k)
          },
          () => {
            R = !0
          },
          void 0,
          () => {
            if (R)
              try {
                for (d--; u.length && d < r; ) {
                  let k = u.shift()
                  o ? at(e, o, () => S(k)) : S(k)
                }
                _()
              } catch (k) {
                e.error(k)
              }
          }
        )
      )
    }
  return (
    t.subscribe(
      et(e, D, () => {
        ;(m = !0), _()
      })
    ),
    () => {
      c?.()
    }
  )
}
function tu(t, e, n = 1 / 0) {
  return U(e)
    ? tu((r, i) => ze((s, o) => e(r, s, i, o))(Ye(t(r, i))), n)
    : (typeof e == 'number' && (n = e), Qe((r, i) => Rm(r, i, t, n)))
}
var IE = ['addListener', 'removeListener'],
  wE = ['addEventListener', 'removeEventListener'],
  EE = ['on', 'off']
function Ai(t, e, n, r) {
  if ((U(n) && ((r = n), (n = void 0)), r)) return Ai(t, e, n).pipe(Sm(r))
  let [i, s] = bE(t)
    ? wE.map((o) => (c) => t[o](e, c, n))
    : TE(t)
      ? IE.map(xm(t, e))
      : DE(t)
        ? EE.map(xm(t, e))
        : []
  if (!i && Ir(t)) return tu((o) => Ai(o, e, n))(Ye(t))
  if (!i) throw new TypeError('Invalid event target')
  return new ue((o) => {
    let c = (...u) => o.next(1 < u.length ? u : u[0])
    return i(c), () => s(c)
  })
}
function xm(t, e) {
  return (n) => (r) => t[n](e, r)
}
function TE(t) {
  return U(t.addListener) && U(t.removeListener)
}
function DE(t) {
  return U(t.on) && U(t.off)
}
function bE(t) {
  return U(t.addEventListener) && U(t.removeEventListener)
}
function Io(t) {
  return Qe((e, n) => {
    let r = null,
      i = !1,
      s
    ;(r = e.subscribe(
      et(n, void 0, void 0, (o) => {
        ;(s = Ye(t(o, Io(t)(e)))),
          r ? (r.unsubscribe(), (r = null), s.subscribe(n)) : (i = !0)
      })
    )),
      i && (r.unsubscribe(), (r = null), s.subscribe(n))
  })
}
function nu(t) {
  return t <= 0
    ? () => pm
    : Qe((e, n) => {
        let r = 0
        e.subscribe(
          et(n, (i) => {
            ++r <= t && (n.next(i), t <= r && n.complete())
          })
        )
      })
}
function un(t, e, n) {
  let r = U(t) || e || n ? { next: t, error: e, complete: n } : t
  return r
    ? Qe((i, s) => {
        var o
        ;(o = r.subscribe) === null || o === void 0 || o.call(r)
        let c = !0
        i.subscribe(
          et(
            s,
            (u) => {
              var d
              ;(d = r.next) === null || d === void 0 || d.call(r, u), s.next(u)
            },
            () => {
              var u
              ;(c = !1),
                (u = r.complete) === null || u === void 0 || u.call(r),
                s.complete()
            },
            (u) => {
              var d
              ;(c = !1),
                (d = r.error) === null || d === void 0 || d.call(r, u),
                s.error(u)
            },
            () => {
              var u, d
              c && ((u = r.unsubscribe) === null || u === void 0 || u.call(r)),
                (d = r.finalize) === null || d === void 0 || d.call(r)
            }
          )
        )
      })
    : so
}
var ug = 'https://g.co/ng/security#xss',
  se = class extends Error {
    constructor(e, n) {
      super(rl(e, n)), (this.code = e)
    }
  }
function rl(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ': ' + e : ''}`
}
function de(t) {
  for (let e in t) if (t[e] === de) return e
  throw Error('Could not find renamed property on target object.')
}
function It(t) {
  if (typeof t == 'string') return t
  if (Array.isArray(t)) return '[' + t.map(It).join(', ') + ']'
  if (t == null) return '' + t
  if (t.overriddenName) return `${t.overriddenName}`
  if (t.name) return `${t.name}`
  let e = t.toString()
  if (e == null) return '' + e
  let n = e.indexOf(`
`)
  return n === -1 ? e : e.substring(0, n)
}
function gu(t, e) {
  return t == null || t === ''
    ? e === null
      ? ''
      : e
    : e == null || e === ''
      ? t
      : t + ' ' + e
}
var CE = de({ __forward_ref__: de })
function lg(t) {
  return (
    (t.__forward_ref__ = lg),
    (t.toString = function () {
      return It(this())
    }),
    t
  )
}
function _t(t) {
  return AE(t) ? t() : t
}
function AE(t) {
  return (
    typeof t == 'function' && t.hasOwnProperty(CE) && t.__forward_ref__ === lg
  )
}
function dg(t) {
  return t && !!t.ɵproviders
}
var SE = de({ ɵcmp: de }),
  RE = de({ ɵdir: de }),
  xE = de({ ɵpipe: de })
var Nm = de({ ɵfac: de }),
  Si = de({ __NG_ELEMENT_ID__: de }),
  Mm = de({ __NG_ENV_ID__: de })
function il(t) {
  return typeof t == 'string' ? t : t == null ? '' : String(t)
}
function NE(t) {
  return typeof t == 'function'
    ? t.name || t.toString()
    : typeof t == 'object' && t != null && typeof t.type == 'function'
      ? t.type.name || t.type.toString()
      : il(t)
}
function ME(t, e) {
  let n = e ? `. Dependency path: ${e.join(' > ')} > ${t}` : ''
  throw new se(-200, `Circular dependency in DI detected for ${t}${n}`)
}
function sl(t, e) {
  throw new se(-201, !1)
}
function PE(t, e) {
  t == null && OE(e, t, null, '!=')
}
function OE(t, e, n, r) {
  throw new Error(
    `ASSERTION ERROR: ${t}` +
      (r == null ? '' : ` [Expected=> ${n} ${r} ${e} <=Actual]`)
  )
}
function pe(t) {
  return {
    token: t.token,
    providedIn: t.providedIn || null,
    factory: t.factory,
    value: void 0,
  }
}
function $n(t) {
  return { providers: t.providers || [], imports: t.imports || [] }
}
function ol(t) {
  return Pm(t, hg) || Pm(t, fg)
}
function Pm(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null
}
function kE(t) {
  let e = t && (t[hg] || t[fg])
  return e || null
}
function Om(t) {
  return t && (t.hasOwnProperty(km) || t.hasOwnProperty(FE)) ? t[km] : null
}
var hg = de({ ɵprov: de }),
  km = de({ ɵinj: de }),
  fg = de({ ngInjectableDef: de }),
  FE = de({ ngInjectorDef: de }),
  J = (function (t) {
    return (
      (t[(t.Default = 0)] = 'Default'),
      (t[(t.Host = 1)] = 'Host'),
      (t[(t.Self = 2)] = 'Self'),
      (t[(t.SkipSelf = 4)] = 'SkipSelf'),
      (t[(t.Optional = 8)] = 'Optional'),
      t
    )
  })(J || {}),
  yu
function LE() {
  return yu
}
function ct(t) {
  let e = yu
  return (yu = t), e
}
function pg(t, e, n) {
  let r = ol(t)
  if (r && r.providedIn == 'root')
    return r.value === void 0 ? (r.value = r.factory()) : r.value
  if (n & J.Optional) return null
  if (e !== void 0) return e
  sl(t, 'Injector')
}
var Ri = globalThis
var oe = class {
  constructor(e, n) {
    ;(this._desc = e),
      (this.ngMetadataName = 'InjectionToken'),
      (this.ɵprov = void 0),
      typeof n == 'number'
        ? (this.__NG_ELEMENT_ID__ = n)
        : n !== void 0 &&
          (this.ɵprov = pe({
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
var VE = {},
  Mi = VE,
  vu = '__NG_DI_FLAG__',
  So = 'ngTempTokenPath',
  UE = 'ngTokenPath',
  jE = /\n/gm,
  BE = '\u0275',
  Fm = '__source',
  xi
function wr(t) {
  let e = xi
  return (xi = t), e
}
function $E(t, e = J.Default) {
  if (xi === void 0) throw new se(-203, !1)
  return xi === null
    ? pg(t, void 0, e)
    : xi.get(t, e & J.Optional ? null : void 0, e)
}
function ne(t, e = J.Default) {
  return (LE() || $E)(_t(t), e)
}
function ve(t, e = J.Default) {
  return ne(t, $o(e))
}
function $o(t) {
  return typeof t > 'u' || typeof t == 'number'
    ? t
    : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4)
}
function _u(t) {
  let e = []
  for (let n = 0; n < t.length; n++) {
    let r = _t(t[n])
    if (Array.isArray(r)) {
      if (r.length === 0) throw new se(900, !1)
      let i,
        s = J.Default
      for (let o = 0; o < r.length; o++) {
        let c = r[o],
          u = qE(c)
        typeof u == 'number' ? (u === -1 ? (i = c.token) : (s |= u)) : (i = c)
      }
      e.push(ne(i, s))
    } else e.push(ne(r))
  }
  return e
}
function HE(t, e) {
  return (t[vu] = e), (t.prototype[vu] = e), t
}
function qE(t) {
  return t[vu]
}
function zE(t, e, n, r) {
  let i = t[So]
  throw (
    (e[Fm] && i.unshift(e[Fm]),
    (t.message = GE(
      `
` + t.message,
      i,
      n,
      r
    )),
    (t[UE] = i),
    (t[So] = null),
    t)
  )
}
function GE(t, e, n, r = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == BE
      ? t.slice(2)
      : t
  let i = It(e)
  if (Array.isArray(e)) i = e.map(It).join(' -> ')
  else if (typeof e == 'object') {
    let s = []
    for (let o in e)
      if (e.hasOwnProperty(o)) {
        let c = e[o]
        s.push(o + ':' + (typeof c == 'string' ? JSON.stringify(c) : It(c)))
      }
    i = `{${s.join(', ')}}`
  }
  return `${n}${r ? '(' + r + ')' : ''}[${i}]: ${t.replace(
    jE,
    `
  `
  )}`
}
function Ho(t) {
  return { toString: t }.toString()
}
var mg = (function (t) {
    return (t[(t.OnPush = 0)] = 'OnPush'), (t[(t.Default = 1)] = 'Default'), t
  })(mg || {}),
  Rt = (function (t) {
    return (
      (t[(t.Emulated = 0)] = 'Emulated'),
      (t[(t.None = 2)] = 'None'),
      (t[(t.ShadowDom = 3)] = 'ShadowDom'),
      t
    )
  })(Rt || {}),
  Pi = {},
  tt = [],
  ln = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.SignalBased = 1)] = 'SignalBased'),
      (t[(t.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      t
    )
  })(ln || {})
function gg(t, e, n) {
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
function Iu(t, e, n) {
  let r = 0
  for (; r < n.length; ) {
    let i = n[r]
    if (typeof i == 'number') {
      if (i !== 0) break
      r++
      let s = n[r++],
        o = n[r++],
        c = n[r++]
      t.setAttribute(e, o, c, s)
    } else {
      let s = i,
        o = n[++r]
      KE(s) ? t.setProperty(e, s, o) : t.setAttribute(e, s, o), r++
    }
  }
  return r
}
function WE(t) {
  return t === 3 || t === 4 || t === 6
}
function KE(t) {
  return t.charCodeAt(0) === 64
}
function al(t, e) {
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
              ? Lm(t, n, i, null, e[++r])
              : Lm(t, n, i, null, null))
      }
    }
  return t
}
function Lm(t, e, n, r, i) {
  let s = 0,
    o = t.length
  if (e === -1) o = -1
  else
    for (; s < t.length; ) {
      let c = t[s++]
      if (typeof c == 'number') {
        if (c === e) {
          o = -1
          break
        } else if (c > e) {
          o = s - 1
          break
        }
      }
    }
  for (; s < t.length; ) {
    let c = t[s]
    if (typeof c == 'number') break
    if (c === n) {
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
var yg = 'ng-template'
function QE(t, e, n) {
  let r = 0,
    i = !0
  for (; r < t.length; ) {
    let s = t[r++]
    if (typeof s == 'string' && i) {
      let o = t[r++]
      if (n && s === 'class' && gg(o.toLowerCase(), e, 0) !== -1) return !0
    } else if (s === 1) {
      for (; r < t.length && typeof (s = t[r++]) == 'string'; )
        if (s.toLowerCase() === e) return !0
      return !1
    } else typeof s == 'number' && (i = !1)
  }
  return !1
}
function vg(t) {
  return t.type === 4 && t.value !== yg
}
function YE(t, e, n) {
  let r = t.type === 4 && !n ? yg : t.value
  return e === r
}
function JE(t, e, n) {
  let r = 4,
    i = t.attrs || [],
    s = eT(i),
    o = !1
  for (let c = 0; c < e.length; c++) {
    let u = e[c]
    if (typeof u == 'number') {
      if (!o && !yt(r) && !yt(u)) return !1
      if (o && yt(u)) continue
      ;(o = !1), (r = u | (r & 1))
      continue
    }
    if (!o)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (u !== '' && !YE(t, u, n)) || (u === '' && e.length === 1))
        ) {
          if (yt(r)) return !1
          o = !0
        }
      } else {
        let d = r & 8 ? u : e[++c]
        if (r & 8 && t.attrs !== null) {
          if (!QE(t.attrs, d, n)) {
            if (yt(r)) return !1
            o = !0
          }
          continue
        }
        let f = r & 8 ? 'class' : u,
          m = ZE(f, i, vg(t), n)
        if (m === -1) {
          if (yt(r)) return !1
          o = !0
          continue
        }
        if (d !== '') {
          let _
          m > s ? (_ = '') : (_ = i[m + 1].toLowerCase())
          let D = r & 8 ? _ : null
          if ((D && gg(D, d, 0) !== -1) || (r & 2 && d !== _)) {
            if (yt(r)) return !1
            o = !0
          }
        }
      }
  }
  return yt(r) || o
}
function yt(t) {
  return (t & 1) === 0
}
function ZE(t, e, n, r) {
  if (e === null) return -1
  let i = 0
  if (r || !n) {
    let s = !1
    for (; i < e.length; ) {
      let o = e[i]
      if (o === t) return i
      if (o === 3 || o === 6) s = !0
      else if (o === 1 || o === 2) {
        let c = e[++i]
        for (; typeof c == 'string'; ) c = e[++i]
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
  } else return tT(e, t)
}
function XE(t, e, n = !1) {
  for (let r = 0; r < e.length; r++) if (JE(t, e[r], n)) return !0
  return !1
}
function eT(t) {
  for (let e = 0; e < t.length; e++) {
    let n = t[e]
    if (WE(n)) return e
  }
  return t.length
}
function tT(t, e) {
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
function Vm(t, e) {
  return t ? ':not(' + e.trim() + ')' : e
}
function nT(t) {
  let e = t[0],
    n = 1,
    r = 2,
    i = '',
    s = !1
  for (; n < t.length; ) {
    let o = t[n]
    if (typeof o == 'string')
      if (r & 2) {
        let c = t[++n]
        i += '[' + o + (c.length > 0 ? '="' + c + '"' : '') + ']'
      } else r & 8 ? (i += '.' + o) : r & 4 && (i += ' ' + o)
    else
      i !== '' && !yt(o) && ((e += Vm(s, i)), (i = '')),
        (r = o),
        (s = s || !yt(r))
    n++
  }
  return i !== '' && (e += Vm(s, i)), e
}
function rT(t) {
  return t.map(nT).join(',')
}
function iT(t) {
  let e = [],
    n = [],
    r = 1,
    i = 2
  for (; r < t.length; ) {
    let s = t[r]
    if (typeof s == 'string')
      i === 2 ? s !== '' && e.push(s, t[++r]) : i === 8 && n.push(s)
    else {
      if (!yt(i)) break
      i = s
    }
    r++
  }
  return { attrs: e, classes: n }
}
function Ie(t) {
  return Ho(() => {
    let e = Tg(t),
      n = $t(Ct({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === mg.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || Rt.Emulated,
        styles: t.styles || tt,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: '',
      })
    Dg(n)
    let r = t.dependencies
    return (
      (n.directiveDefs = jm(r, !1)), (n.pipeDefs = jm(r, !0)), (n.id = cT(n)), n
    )
  })
}
function sT(t) {
  return qo(t) || wg(t)
}
function oT(t) {
  return t !== null
}
function Hn(t) {
  return Ho(() => ({
    type: t.type,
    bootstrap: t.bootstrap || tt,
    declarations: t.declarations || tt,
    imports: t.imports || tt,
    exports: t.exports || tt,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }))
}
function Um(t, e) {
  if (t == null) return Pi
  let n = {}
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let i = t[r],
        s,
        o,
        c = ln.None
      Array.isArray(i)
        ? ((c = i[0]), (s = i[1]), (o = i[2] ?? s))
        : ((s = i), (o = i)),
        e ? ((n[s] = c !== ln.None ? [r, c] : r), (e[s] = o)) : (n[s] = r)
    }
  return n
}
function _g(t) {
  return Ho(() => {
    let e = Tg(t)
    return Dg(e), e
  })
}
function Ig(t) {
  return {
    type: t.type,
    name: t.name,
    factory: null,
    pure: t.pure !== !1,
    standalone: t.standalone === !0,
    onDestroy: t.type.prototype.ngOnDestroy || null,
  }
}
function qo(t) {
  return t[SE] || null
}
function wg(t) {
  return t[RE] || null
}
function Eg(t) {
  return t[xE] || null
}
function aT(t) {
  let e = qo(t) || wg(t) || Eg(t)
  return e !== null ? e.standalone : !1
}
function Tg(t) {
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
    inputConfig: t.inputs || Pi,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || tt,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Um(t.inputs, e),
    outputs: Um(t.outputs),
    debugInfo: null,
  }
}
function Dg(t) {
  t.features?.forEach((e) => e(t))
}
function jm(t, e) {
  if (!t) return null
  let n = e ? Eg : sT
  return () => (typeof t == 'function' ? t() : t).map((r) => n(r)).filter(oT)
}
function cT(t) {
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
var Gt = 0,
  Q = 1,
  V = 2,
  rt = 3,
  wt = 4,
  Nt = 5,
  Oi = 6,
  ki = 7,
  Ve = 8,
  Cr = 9,
  xt = 10,
  Ge = 11,
  Fi = 12,
  Bm = 13,
  xr = 14,
  Et = 15,
  zo = 16,
  Er = 17,
  Li = 18,
  Go = 19,
  bg = 20,
  Ni = 21,
  ru = 22,
  Fn = 23,
  it = 25,
  Cg = 1
var Vi = 7,
  uT = 8,
  Ro = 9,
  Je = 10,
  cl = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      t
    )
  })(cl || {})
function kn(t) {
  return Array.isArray(t) && typeof t[Cg] == 'object'
}
function qn(t) {
  return Array.isArray(t) && t[Cg] === !0
}
function Ag(t) {
  return (t.flags & 4) !== 0
}
function Wo(t) {
  return t.componentOffset > -1
}
function ul(t) {
  return (t.flags & 1) === 1
}
function Wi(t) {
  return !!t.template
}
function lT(t) {
  return (t[V] & 512) !== 0
}
function Ar(t, e) {
  let n = t.hasOwnProperty(Nm)
  return n ? t[Nm] : null
}
var wu = class {
  constructor(e, n, r) {
    ;(this.previousValue = e), (this.currentValue = n), (this.firstChange = r)
  }
  isFirstChange() {
    return this.firstChange
  }
}
function Sg(t, e, n, r) {
  e !== null ? e.applyValueToInputSignal(e, r) : (t[n] = r)
}
function Rg() {
  return xg
}
function xg(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = hT), dT
}
Rg.ngInherit = !0
function dT() {
  let t = Mg(this),
    e = t?.current
  if (e) {
    let n = t.previous
    if (n === Pi) t.previous = e
    else for (let r in e) n[r] = e[r]
    ;(t.current = null), this.ngOnChanges(e)
  }
}
function hT(t, e, n, r, i) {
  let s = this.declaredInputs[r],
    o = Mg(t) || fT(t, { previous: Pi, current: null }),
    c = o.current || (o.current = {}),
    u = o.previous,
    d = u[s]
  ;(c[s] = new wu(d && d.currentValue, n, u === Pi)), Sg(t, e, i, n)
}
var Ng = '__ngSimpleChanges__'
function Mg(t) {
  return t[Ng] || null
}
function fT(t, e) {
  return (t[Ng] = e)
}
var $m = null
var At = function (t, e, n) {
    $m?.(t, e, n)
  },
  Pg = 'svg',
  pT = 'math',
  mT = !1
function gT() {
  return mT
}
function Ht(t) {
  for (; Array.isArray(t); ) t = t[Gt]
  return t
}
function Og(t, e) {
  return Ht(e[t])
}
function Mt(t, e) {
  return Ht(e[t.index])
}
function ll(t, e) {
  return t.data[e]
}
function yT(t, e) {
  return t[e]
}
function hn(t, e) {
  let n = e[t]
  return kn(n) ? n : n[Gt]
}
function dl(t) {
  return (t[V] & 128) === 128
}
function xo(t, e) {
  return e == null ? null : t[e]
}
function kg(t) {
  t[Er] = 0
}
function vT(t) {
  t[V] & 1024 || ((t[V] |= 1024), dl(t) && Ui(t))
}
function _T(t, e) {
  for (; t > 0; ) (e = e[xr]), t--
  return e
}
function Fg(t) {
  return t[V] & 9216 || t[Fn]?.dirty
}
function Eu(t) {
  Fg(t)
    ? Ui(t)
    : t[V] & 64 &&
      (gT()
        ? ((t[V] |= 1024), Ui(t))
        : t[xt].changeDetectionScheduler?.notify())
}
function Ui(t) {
  t[xt].changeDetectionScheduler?.notify()
  let e = ji(t)
  for (; e !== null && !(e[V] & 8192 || ((e[V] |= 8192), !dl(e))); ) e = ji(e)
}
function IT(t, e) {
  if ((t[V] & 256) === 256) throw new se(911, !1)
  t[Ni] === null && (t[Ni] = []), t[Ni].push(e)
}
function ji(t) {
  let e = t[rt]
  return qn(e) ? e[rt] : e
}
var G = { lFrame: qg(null), bindingsEnabled: !0, skipHydrationRootTNode: null }
function wT() {
  return G.lFrame.elementDepthCount
}
function ET() {
  G.lFrame.elementDepthCount++
}
function TT() {
  G.lFrame.elementDepthCount--
}
function Lg() {
  return G.bindingsEnabled
}
function DT() {
  return G.skipHydrationRootTNode !== null
}
function bT(t) {
  return G.skipHydrationRootTNode === t
}
function CT() {
  G.skipHydrationRootTNode = null
}
function he() {
  return G.lFrame.lView
}
function Wt() {
  return G.lFrame.tView
}
function ut(t) {
  return (G.lFrame.contextLView = t), t[Ve]
}
function lt(t) {
  return (G.lFrame.contextLView = null), t
}
function Kt() {
  let t = Vg()
  for (; t !== null && t.type === 64; ) t = t.parent
  return t
}
function Vg() {
  return G.lFrame.currentTNode
}
function AT() {
  let t = G.lFrame,
    e = t.currentTNode
  return t.isParent ? e : e.parent
}
function Ki(t, e) {
  let n = G.lFrame
  ;(n.currentTNode = t), (n.isParent = e)
}
function Ug() {
  return G.lFrame.isParent
}
function ST() {
  G.lFrame.isParent = !1
}
function jg() {
  let t = G.lFrame,
    e = t.bindingRootIndex
  return e === -1 && (e = t.bindingRootIndex = t.tView.bindingStartIndex), e
}
function RT(t) {
  return (G.lFrame.bindingIndex = t)
}
function Ko() {
  return G.lFrame.bindingIndex++
}
function xT(t) {
  let e = G.lFrame,
    n = e.bindingIndex
  return (e.bindingIndex = e.bindingIndex + t), n
}
function NT() {
  return G.lFrame.inI18n
}
function MT(t, e) {
  let n = G.lFrame
  ;(n.bindingIndex = n.bindingRootIndex = t), Tu(e)
}
function PT() {
  return G.lFrame.currentDirectiveIndex
}
function Tu(t) {
  G.lFrame.currentDirectiveIndex = t
}
function OT(t) {
  let e = G.lFrame.currentDirectiveIndex
  return e === -1 ? null : t[e]
}
function Bg(t) {
  G.lFrame.currentQueryIndex = t
}
function kT(t) {
  let e = t[Q]
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[Nt] : null
}
function $g(t, e, n) {
  if (n & J.SkipSelf) {
    let i = e,
      s = t
    for (; (i = i.parent), i === null && !(n & J.Host); )
      if (((i = kT(s)), i === null || ((s = s[xr]), i.type & 10))) break
    if (i === null) return !1
    ;(e = i), (t = s)
  }
  let r = (G.lFrame = Hg())
  return (r.currentTNode = e), (r.lView = t), !0
}
function hl(t) {
  let e = Hg(),
    n = t[Q]
  ;(G.lFrame = e),
    (e.currentTNode = n.firstChild),
    (e.lView = t),
    (e.tView = n),
    (e.contextLView = t),
    (e.bindingIndex = n.bindingStartIndex),
    (e.inI18n = !1)
}
function Hg() {
  let t = G.lFrame,
    e = t === null ? null : t.child
  return e === null ? qg(t) : e
}
function qg(t) {
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
function zg() {
  let t = G.lFrame
  return (G.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t
}
var Gg = zg
function fl() {
  let t = zg()
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
function FT(t) {
  return (G.lFrame.contextLView = _T(t, G.lFrame.contextLView))[Ve]
}
function zn() {
  return G.lFrame.selectedIndex
}
function Ln(t) {
  G.lFrame.selectedIndex = t
}
function LT() {
  let t = G.lFrame
  return ll(t.tView, t.selectedIndex)
}
function Qi() {
  G.lFrame.currentNamespace = Pg
}
function pl() {
  VT()
}
function VT() {
  G.lFrame.currentNamespace = null
}
function UT() {
  return G.lFrame.currentNamespace
}
var Wg = !0
function ml() {
  return Wg
}
function gl(t) {
  Wg = t
}
function jT(t, e, n) {
  let { ngOnChanges: r, ngOnInit: i, ngDoCheck: s } = e.type.prototype
  if (r) {
    let o = xg(e)
    ;(n.preOrderHooks ??= []).push(t, o),
      (n.preOrderCheckHooks ??= []).push(t, o)
  }
  i && (n.preOrderHooks ??= []).push(0 - t, i),
    s &&
      ((n.preOrderHooks ??= []).push(t, s),
      (n.preOrderCheckHooks ??= []).push(t, s))
}
function yl(t, e) {
  for (let n = e.directiveStart, r = e.directiveEnd; n < r; n++) {
    let s = t.data[n].type.prototype,
      {
        ngAfterContentInit: o,
        ngAfterContentChecked: c,
        ngAfterViewInit: u,
        ngAfterViewChecked: d,
        ngOnDestroy: f,
      } = s
    o && (t.contentHooks ??= []).push(-n, o),
      c &&
        ((t.contentHooks ??= []).push(n, c),
        (t.contentCheckHooks ??= []).push(n, c)),
      u && (t.viewHooks ??= []).push(-n, u),
      d &&
        ((t.viewHooks ??= []).push(n, d), (t.viewCheckHooks ??= []).push(n, d)),
      f != null && (t.destroyHooks ??= []).push(n, f)
  }
}
function To(t, e, n) {
  Kg(t, e, 3, n)
}
function Do(t, e, n, r) {
  ;(t[V] & 3) === n && Kg(t, e, n, r)
}
function iu(t, e) {
  let n = t[V]
  ;(n & 3) === e && ((n &= 16383), (n += 1), (t[V] = n))
}
function Kg(t, e, n, r) {
  let i = r !== void 0 ? t[Er] & 65535 : 0,
    s = r ?? -1,
    o = e.length - 1,
    c = 0
  for (let u = i; u < o; u++)
    if (typeof e[u + 1] == 'number') {
      if (((c = e[u]), r != null && c >= r)) break
    } else
      e[u] < 0 && (t[Er] += 65536),
        (c < s || s == -1) &&
          (BT(t, n, e, u), (t[Er] = (t[Er] & 4294901760) + u + 2)),
        u++
}
function Hm(t, e) {
  At(4, t, e)
  let n = Ae(null)
  try {
    e.call(t)
  } finally {
    Ae(n), At(5, t, e)
  }
}
function BT(t, e, n, r) {
  let i = n[r] < 0,
    s = n[r + 1],
    o = i ? -n[r] : n[r],
    c = t[o]
  i
    ? t[V] >> 14 < t[Er] >> 16 &&
      (t[V] & 3) === e &&
      ((t[V] += 16384), Hm(c, s))
    : Hm(c, s)
}
var br = -1,
  Bi = class {
    constructor(e, n, r) {
      ;(this.factory = e),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r)
    }
  }
function $T(t) {
  return t instanceof Bi
}
function HT(t) {
  return (t.flags & 8) !== 0
}
function qT(t) {
  return (t.flags & 16) !== 0
}
function zT(t) {
  return t !== br
}
function Du(t) {
  return t & 32767
}
function GT(t) {
  return t >> 16
}
function bu(t, e) {
  let n = GT(t),
    r = e
  for (; n > 0; ) (r = r[xr]), n--
  return r
}
var Cu = !0
function No(t) {
  let e = Cu
  return (Cu = t), e
}
var WT = 256,
  Qg = WT - 1,
  Yg = 5,
  KT = 0,
  St = {}
function QT(t, e, n) {
  let r
  typeof n == 'string'
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Si) && (r = n[Si]),
    r == null && (r = n[Si] = KT++)
  let i = r & Qg,
    s = 1 << i
  e.data[t + (i >> Yg)] |= s
}
function Jg(t, e) {
  let n = Zg(t, e)
  if (n !== -1) return n
  let r = e[Q]
  r.firstCreatePass &&
    ((t.injectorIndex = e.length),
    su(r.data, t),
    su(e, null),
    su(r.blueprint, null))
  let i = Xg(t, e),
    s = t.injectorIndex
  if (zT(i)) {
    let o = Du(i),
      c = bu(i, e),
      u = c[Q].data
    for (let d = 0; d < 8; d++) e[s + d] = c[o + d] | u[o + d]
  }
  return (e[s + 8] = i), s
}
function su(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e)
}
function Zg(t, e) {
  return t.injectorIndex === -1 ||
    (t.parent && t.parent.injectorIndex === t.injectorIndex) ||
    e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex
}
function Xg(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex
  let n = 0,
    r = null,
    i = e
  for (; i !== null; ) {
    if (((r = iy(i)), r === null)) return br
    if ((n++, (i = i[xr]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16)
  }
  return br
}
function YT(t, e, n) {
  QT(t, e, n)
}
function ey(t, e, n) {
  if (n & J.Optional || t !== void 0) return t
  sl(e, 'NodeInjector')
}
function ty(t, e, n, r) {
  if (
    (n & J.Optional && r === void 0 && (r = null), !(n & (J.Self | J.Host)))
  ) {
    let i = t[Cr],
      s = ct(void 0)
    try {
      return i ? i.get(e, r, n & J.Optional) : pg(e, r, n & J.Optional)
    } finally {
      ct(s)
    }
  }
  return ey(r, e, n)
}
function ny(t, e, n, r = J.Default, i) {
  if (t !== null) {
    if (e[V] & 2048 && !(r & J.Self)) {
      let o = tD(t, e, n, r, St)
      if (o !== St) return o
    }
    let s = ry(t, e, n, r, St)
    if (s !== St) return s
  }
  return ty(e, n, r, i)
}
function ry(t, e, n, r, i) {
  let s = XT(n)
  if (typeof s == 'function') {
    if (!$g(e, t, r)) return r & J.Host ? ey(i, n, r) : ty(e, n, r, i)
    try {
      let o
      if (((o = s(r)), o == null && !(r & J.Optional))) sl(n)
      else return o
    } finally {
      Gg()
    }
  } else if (typeof s == 'number') {
    let o = null,
      c = Zg(t, e),
      u = br,
      d = r & J.Host ? e[Et][Nt] : null
    for (
      (c === -1 || r & J.SkipSelf) &&
      ((u = c === -1 ? Xg(t, e) : e[c + 8]),
      u === br || !zm(r, !1)
        ? (c = -1)
        : ((o = e[Q]), (c = Du(u)), (e = bu(u, e))));
      c !== -1;

    ) {
      let f = e[Q]
      if (qm(s, c, f.data)) {
        let m = JT(c, e, n, o, r, d)
        if (m !== St) return m
      }
      ;(u = e[c + 8]),
        u !== br && zm(r, e[Q].data[c + 8] === d) && qm(s, c, e)
          ? ((o = f), (c = Du(u)), (e = bu(u, e)))
          : (c = -1)
    }
  }
  return i
}
function JT(t, e, n, r, i, s) {
  let o = e[Q],
    c = o.data[t + 8],
    u = r == null ? Wo(c) && Cu : r != o && (c.type & 3) !== 0,
    d = i & J.Host && s === c,
    f = ZT(c, o, n, u, d)
  return f !== null ? $i(e, o, f, c) : St
}
function ZT(t, e, n, r, i) {
  let s = t.providerIndexes,
    o = e.data,
    c = s & 1048575,
    u = t.directiveStart,
    d = t.directiveEnd,
    f = s >> 20,
    m = r ? c : c + f,
    _ = i ? c + f : d
  for (let D = m; D < _; D++) {
    let S = o[D]
    if ((D < u && n === S) || (D >= u && S.type === n)) return D
  }
  if (i) {
    let D = o[u]
    if (D && Wi(D) && D.type === n) return u
  }
  return null
}
function $i(t, e, n, r) {
  let i = t[n],
    s = e.data
  if ($T(i)) {
    let o = i
    o.resolving && ME(NE(s[n]))
    let c = No(o.canSeeViewProviders)
    o.resolving = !0
    let u,
      d = o.injectImpl ? ct(o.injectImpl) : null,
      f = $g(t, r, J.Default)
    try {
      ;(i = t[n] = o.factory(void 0, s, t, r)),
        e.firstCreatePass && n >= r.directiveStart && jT(n, s[n], e)
    } finally {
      d !== null && ct(d), No(c), (o.resolving = !1), Gg()
    }
  }
  return i
}
function XT(t) {
  if (typeof t == 'string') return t.charCodeAt(0) || 0
  let e = t.hasOwnProperty(Si) ? t[Si] : void 0
  return typeof e == 'number' ? (e >= 0 ? e & Qg : eD) : e
}
function qm(t, e, n) {
  let r = 1 << t
  return !!(n[e + (t >> Yg)] & r)
}
function zm(t, e) {
  return !(t & J.Self) && !(t & J.Host && e)
}
var Mo = class {
  constructor(e, n) {
    ;(this._tNode = e), (this._lView = n)
  }
  get(e, n, r) {
    return ny(this._tNode, this._lView, e, $o(r), n)
  }
}
function eD() {
  return new Mo(Kt(), he())
}
function tD(t, e, n, r, i) {
  let s = t,
    o = e
  for (; s !== null && o !== null && o[V] & 2048 && !(o[V] & 512); ) {
    let c = ry(s, o, n, r | J.Self, St)
    if (c !== St) return c
    let u = s.parent
    if (!u) {
      let d = o[bg]
      if (d) {
        let f = d.get(n, St, r)
        if (f !== St) return f
      }
      ;(u = iy(o)), (o = o[xr])
    }
    s = u
  }
  return i
}
function iy(t) {
  let e = t[Q],
    n = e.type
  return n === 2 ? e.declTNode : n === 1 ? t[Nt] : null
}
var wo = '__parameters__'
function nD(t) {
  return function (...n) {
    if (t) {
      let r = t(...n)
      for (let i in r) this[i] = r[i]
    }
  }
}
function rD(t, e, n) {
  return Ho(() => {
    let r = nD(e)
    function i(...s) {
      if (this instanceof i) return r.apply(this, s), this
      let o = new i(...s)
      return (c.annotation = o), c
      function c(u, d, f) {
        let m = u.hasOwnProperty(wo)
          ? u[wo]
          : Object.defineProperty(u, wo, { value: [] })[wo]
        for (; m.length <= f; ) m.push(null)
        return (m[f] = m[f] || []).push(o), u
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
function vl(t, e) {
  t.forEach((n) => (Array.isArray(n) ? vl(n, e) : e(n)))
}
function iD(t, e, n) {
  e >= t.length ? t.push(n) : t.splice(e, 0, n)
}
function sy(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0]
}
function sD(t, e, n, r) {
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
function _l(t, e, n) {
  let r = Yi(t, e)
  return r >= 0 ? (t[r | 1] = n) : ((r = ~r), sD(t, r, e, n)), r
}
function ou(t, e) {
  let n = Yi(t, e)
  if (n >= 0) return t[n | 1]
}
function Yi(t, e) {
  return oD(t, e, 1)
}
function oD(t, e, n) {
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
var Qt = HE(rD('Optional'), 8)
var Hi = new oe('ENVIRONMENT_INITIALIZER'),
  oy = new oe('INJECTOR', -1),
  ay = new oe('INJECTOR_DEF_TYPES'),
  Po = class {
    get(e, n = Mi) {
      if (n === Mi) {
        let r = new Error(`NullInjectorError: No provider for ${It(e)}!`)
        throw ((r.name = 'NullInjectorError'), r)
      }
      return n
    }
  }
function cy(t) {
  return { ɵproviders: t }
}
function Qo(...t) {
  return { ɵproviders: uy(!0, t), ɵfromNgModule: !0 }
}
function uy(t, ...e) {
  let n = [],
    r = new Set(),
    i,
    s = (o) => {
      n.push(o)
    }
  return (
    vl(e, (o) => {
      let c = o
      Au(c, s, [], r) && ((i ||= []), i.push(c))
    }),
    i !== void 0 && ly(i, s),
    n
  )
}
function ly(t, e) {
  for (let n = 0; n < t.length; n++) {
    let { ngModule: r, providers: i } = t[n]
    Il(i, (s) => {
      e(s, r)
    })
  }
}
function Au(t, e, n, r) {
  if (((t = _t(t)), !t)) return !1
  let i = null,
    s = Om(t),
    o = !s && qo(t)
  if (!s && !o) {
    let u = t.ngModule
    if (((s = Om(u)), s)) i = u
    else return !1
  } else {
    if (o && !o.standalone) return !1
    i = t
  }
  let c = r.has(i)
  if (o) {
    if (c) return !1
    if ((r.add(i), o.dependencies)) {
      let u =
        typeof o.dependencies == 'function' ? o.dependencies() : o.dependencies
      for (let d of u) Au(d, e, n, r)
    }
  } else if (s) {
    if (s.imports != null && !c) {
      r.add(i)
      let d
      try {
        vl(s.imports, (f) => {
          Au(f, e, n, r) && ((d ||= []), d.push(f))
        })
      } finally {
      }
      d !== void 0 && ly(d, e)
    }
    if (!c) {
      let d = Ar(i) || (() => new i())
      e({ provide: i, useFactory: d, deps: tt }, i),
        e({ provide: ay, useValue: i, multi: !0 }, i),
        e({ provide: Hi, useValue: () => ne(i), multi: !0 }, i)
    }
    let u = s.providers
    if (u != null && !c) {
      let d = t
      Il(u, (f) => {
        e(f, d)
      })
    }
  } else return !1
  return i !== t && t.providers !== void 0
}
function Il(t, e) {
  for (let n of t)
    dg(n) && (n = n.ɵproviders), Array.isArray(n) ? Il(n, e) : e(n)
}
var aD = de({ provide: String, useValue: de })
function dy(t) {
  return t !== null && typeof t == 'object' && aD in t
}
function cD(t) {
  return !!(t && t.useExisting)
}
function uD(t) {
  return !!(t && t.useFactory)
}
function Su(t) {
  return typeof t == 'function'
}
var Yo = new oe('Set Injector scope.'),
  bo = {},
  lD = {},
  au
function wl() {
  return au === void 0 && (au = new Po()), au
}
var Vn = class {},
  Oo = class extends Vn {
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
        xu(e, (o) => this.processProvider(o)),
        this.records.set(oy, Tr(void 0, this)),
        i.has('environment') && this.records.set(Vn, Tr(void 0, this))
      let s = this.records.get(Yo)
      s != null && typeof s.value == 'string' && this.scopes.add(s.value),
        (this.injectorDefTypes = new Set(this.get(ay, tt, J.Self)))
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
      let n = wr(this),
        r = ct(void 0),
        i
      try {
        return e()
      } finally {
        wr(n), ct(r)
      }
    }
    get(e, n = Mi, r = J.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(Mm))) return e[Mm](this)
      r = $o(r)
      let i,
        s = wr(this),
        o = ct(void 0)
      try {
        if (!(r & J.SkipSelf)) {
          let u = this.records.get(e)
          if (u === void 0) {
            let d = gD(e) && ol(e)
            d && this.injectableDefInScope(d)
              ? (u = Tr(Ru(e), bo))
              : (u = null),
              this.records.set(e, u)
          }
          if (u != null) return this.hydrate(e, u)
        }
        let c = r & J.Self ? wl() : this.parent
        return (n = r & J.Optional && n === Mi ? null : n), c.get(e, n)
      } catch (c) {
        if (c.name === 'NullInjectorError') {
          if (((c[So] = c[So] || []).unshift(It(e)), s)) throw c
          return zE(c, e, 'R3InjectorError', this.source)
        } else throw c
      } finally {
        ct(o), wr(s)
      }
    }
    resolveInjectorInitializers() {
      let e = wr(this),
        n = ct(void 0),
        r
      try {
        let i = this.get(Hi, tt, J.Self)
        for (let s of i) s()
      } finally {
        wr(e), ct(n)
      }
    }
    toString() {
      let e = [],
        n = this.records
      for (let r of n.keys()) e.push(It(r))
      return `R3Injector[${e.join(', ')}]`
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new se(205, !1)
    }
    processProvider(e) {
      e = _t(e)
      let n = Su(e) ? e : _t(e && e.provide),
        r = hD(e)
      if (!Su(e) && e.multi === !0) {
        let i = this.records.get(n)
        i ||
          ((i = Tr(void 0, bo, !0)),
          (i.factory = () => _u(i.multi)),
          this.records.set(n, i)),
          (n = e),
          i.multi.push(e)
      }
      this.records.set(n, r)
    }
    hydrate(e, n) {
      return (
        n.value === bo && ((n.value = lD), (n.value = n.factory())),
        typeof n.value == 'object' &&
          n.value &&
          mD(n.value) &&
          this._ngOnDestroyHooks.add(n.value),
        n.value
      )
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1
      let n = _t(e.providedIn)
      return typeof n == 'string'
        ? n === 'any' || this.scopes.has(n)
        : this.injectorDefTypes.has(n)
    }
    removeOnDestroy(e) {
      let n = this._onDestroyHooks.indexOf(e)
      n !== -1 && this._onDestroyHooks.splice(n, 1)
    }
  }
function Ru(t) {
  let e = ol(t),
    n = e !== null ? e.factory : Ar(t)
  if (n !== null) return n
  if (t instanceof oe) throw new se(204, !1)
  if (t instanceof Function) return dD(t)
  throw new se(204, !1)
}
function dD(t) {
  if (t.length > 0) throw new se(204, !1)
  let n = kE(t)
  return n !== null ? () => n.factory(t) : () => new t()
}
function hD(t) {
  if (dy(t)) return Tr(void 0, t.useValue)
  {
    let e = fD(t)
    return Tr(e, bo)
  }
}
function fD(t, e, n) {
  let r
  if (Su(t)) {
    let i = _t(t)
    return Ar(i) || Ru(i)
  } else if (dy(t)) r = () => _t(t.useValue)
  else if (uD(t)) r = () => t.useFactory(..._u(t.deps || []))
  else if (cD(t)) r = () => ne(_t(t.useExisting))
  else {
    let i = _t(t && (t.useClass || t.provide))
    if (pD(t)) r = () => new i(..._u(t.deps))
    else return Ar(i) || Ru(i)
  }
  return r
}
function Tr(t, e, n = !1) {
  return { factory: t, value: e, multi: n ? [] : void 0 }
}
function pD(t) {
  return !!t.deps
}
function mD(t) {
  return (
    t !== null && typeof t == 'object' && typeof t.ngOnDestroy == 'function'
  )
}
function gD(t) {
  return typeof t == 'function' || (typeof t == 'object' && t instanceof oe)
}
function xu(t, e) {
  for (let n of t)
    Array.isArray(n) ? xu(n, e) : n && dg(n) ? xu(n.ɵproviders, e) : e(n)
}
function Gm(t, e = null, n = null, r) {
  let i = yD(t, e, n, r)
  return i.resolveInjectorInitializers(), i
}
function yD(t, e = null, n = null, r, i = new Set()) {
  let s = [n || tt, Qo(t)]
  return (
    (r = r || (typeof t == 'object' ? void 0 : It(t))),
    new Oo(s, e || wl(), r || null, i)
  )
}
var fn = (() => {
  let e = class e {
    static create(r, i) {
      if (Array.isArray(r)) return Gm({ name: '' }, i, r, '')
      {
        let s = r.name ?? ''
        return Gm({ name: s }, r.parent, r.providers, s)
      }
    }
  }
  ;(e.THROW_IF_NOT_FOUND = Mi),
    (e.NULL = new Po()),
    (e.ɵprov = pe({ token: e, providedIn: 'any', factory: () => ne(oy) })),
    (e.__NG_ELEMENT_ID__ = -1)
  let t = e
  return t
})()
var Nu
function hy(t) {
  Nu = t
}
function vD() {
  if (Nu !== void 0) return Nu
  if (typeof document < 'u') return document
  throw new se(210, !1)
}
var El = new oe('AppId', { providedIn: 'root', factory: () => _D }),
  _D = 'ng',
  Tl = new oe('Platform Initializer'),
  pn = new oe('Platform ID', {
    providedIn: 'platform',
    factory: () => 'unknown',
  })
var Dl = new oe('CSP nonce', {
  providedIn: 'root',
  factory: () =>
    vD().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
    null,
})
function fy(t) {
  return (t.flags & 128) === 128
}
var qt = (function (t) {
  return (
    (t[(t.Important = 1)] = 'Important'), (t[(t.DashCase = 2)] = 'DashCase'), t
  )
})(qt || {})
var py = new Map(),
  ID = 0
function wD() {
  return ID++
}
function ED(t) {
  py.set(t[Go], t)
}
function TD(t) {
  py.delete(t[Go])
}
var Wm = '__ngContext__'
function Un(t, e) {
  kn(e) ? ((t[Wm] = e[Go]), ED(e)) : (t[Wm] = e)
}
var DD
function bl(t, e) {
  return DD(t, e)
}
function Dr(t, e, n, r, i) {
  if (r != null) {
    let s,
      o = !1
    qn(r) ? (s = r) : kn(r) && ((o = !0), (r = r[Gt]))
    let c = Ht(r)
    t === 0 && n !== null
      ? i == null
        ? vy(e, n, c)
        : Mu(e, n, c, i || null, !0)
      : t === 1 && n !== null
        ? Mu(e, n, c, i || null, !0)
        : t === 2
          ? jD(e, c, o)
          : t === 3 && e.destroyNode(c),
      s != null && $D(e, t, s, n, i)
  }
}
function bD(t, e) {
  return t.createText(e)
}
function CD(t, e, n) {
  t.setValue(e, n)
}
function my(t, e, n) {
  return t.createElement(e, n)
}
function AD(t, e) {
  gy(t, e), (e[Gt] = null), (e[Nt] = null)
}
function SD(t, e, n, r, i, s) {
  ;(r[Gt] = i), (r[Nt] = e), Jo(t, r, n, 1, i, s)
}
function gy(t, e) {
  e[xt].changeDetectionScheduler?.notify(), Jo(t, e, e[Ge], 2, null, null)
}
function RD(t) {
  let e = t[Fi]
  if (!e) return cu(t[Q], t)
  for (; e; ) {
    let n = null
    if (kn(e)) n = e[Fi]
    else {
      let r = e[Je]
      r && (n = r)
    }
    if (!n) {
      for (; e && !e[wt] && e !== t; ) kn(e) && cu(e[Q], e), (e = e[rt])
      e === null && (e = t), kn(e) && cu(e[Q], e), (n = e && e[wt])
    }
    e = n
  }
}
function xD(t, e, n, r) {
  let i = Je + r,
    s = n.length
  r > 0 && (n[i - 1][wt] = e),
    r < s - Je
      ? ((e[wt] = n[i]), iD(n, Je + r, e))
      : (n.push(e), (e[wt] = null)),
    (e[rt] = n)
  let o = e[zo]
  o !== null && n !== o && ND(o, e)
  let c = e[Li]
  c !== null && c.insertView(t), Eu(e), (e[V] |= 128)
}
function ND(t, e) {
  let n = t[Ro],
    i = e[rt][rt][Et]
  e[Et] !== i && (t[V] |= cl.HasTransplantedViews),
    n === null ? (t[Ro] = [e]) : n.push(e)
}
function yy(t, e) {
  let n = t[Ro],
    r = n.indexOf(e)
  n.splice(r, 1)
}
function Cl(t, e) {
  if (t.length <= Je) return
  let n = Je + e,
    r = t[n]
  if (r) {
    let i = r[zo]
    i !== null && i !== t && yy(i, r), e > 0 && (t[n - 1][wt] = r[wt])
    let s = sy(t, Je + e)
    AD(r[Q], r)
    let o = s[Li]
    o !== null && o.detachView(s[Q]),
      (r[rt] = null),
      (r[wt] = null),
      (r[V] &= -129)
  }
  return r
}
function Al(t, e) {
  if (!(e[V] & 256)) {
    let n = e[Ge]
    n.destroyNode && Jo(t, e, n, 3, null, null), RD(e)
  }
}
function cu(t, e) {
  if (!(e[V] & 256)) {
    ;(e[V] &= -129),
      (e[V] |= 256),
      e[Fn] && im(e[Fn]),
      PD(t, e),
      MD(t, e),
      e[Q].type === 1 && e[Ge].destroy()
    let n = e[zo]
    if (n !== null && qn(e[rt])) {
      n !== e[rt] && yy(n, e)
      let r = e[Li]
      r !== null && r.detachView(t)
    }
    TD(e)
  }
}
function MD(t, e) {
  let n = t.cleanup,
    r = e[ki]
  if (n !== null)
    for (let s = 0; s < n.length - 1; s += 2)
      if (typeof n[s] == 'string') {
        let o = n[s + 3]
        o >= 0 ? r[o]() : r[-o].unsubscribe(), (s += 2)
      } else {
        let o = r[n[s + 1]]
        n[s].call(o)
      }
  r !== null && (e[ki] = null)
  let i = e[Ni]
  if (i !== null) {
    e[Ni] = null
    for (let s = 0; s < i.length; s++) {
      let o = i[s]
      o()
    }
  }
}
function PD(t, e) {
  let n
  if (t != null && (n = t.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let i = e[n[r]]
      if (!(i instanceof Bi)) {
        let s = n[r + 1]
        if (Array.isArray(s))
          for (let o = 0; o < s.length; o += 2) {
            let c = i[s[o]],
              u = s[o + 1]
            At(4, c, u)
            try {
              u.call(c)
            } finally {
              At(5, c, u)
            }
          }
        else {
          At(4, i, s)
          try {
            s.call(i)
          } finally {
            At(5, i, s)
          }
        }
      }
    }
}
function OD(t, e, n) {
  return kD(t, e.parent, n)
}
function kD(t, e, n) {
  let r = e
  for (; r !== null && r.type & 40; ) (e = r), (r = e.parent)
  if (r === null) return n[Gt]
  {
    let { componentOffset: i } = r
    if (i > -1) {
      let { encapsulation: s } = t.data[r.directiveStart + i]
      if (s === Rt.None || s === Rt.Emulated) return null
    }
    return Mt(r, n)
  }
}
function Mu(t, e, n, r, i) {
  t.insertBefore(e, n, r, i)
}
function vy(t, e, n) {
  t.appendChild(e, n)
}
function Km(t, e, n, r, i) {
  r !== null ? Mu(t, e, n, r, i) : vy(t, e, n)
}
function FD(t, e, n, r) {
  t.removeChild(e, n, r)
}
function _y(t, e) {
  return t.parentNode(e)
}
function LD(t, e, n) {
  return UD(t, e, n)
}
function VD(t, e, n) {
  return t.type & 40 ? Mt(t, n) : null
}
var UD = VD,
  Qm
function Sl(t, e, n, r) {
  let i = OD(t, r, e),
    s = e[Ge],
    o = r.parent || e[Nt],
    c = LD(o, r, e)
  if (i != null)
    if (Array.isArray(n))
      for (let u = 0; u < n.length; u++) Km(s, i, n[u], c, !1)
    else Km(s, i, n, c, !1)
  Qm !== void 0 && Qm(s, r, e, n, i)
}
function Co(t, e) {
  if (e !== null) {
    let n = e.type
    if (n & 3) return Mt(e, t)
    if (n & 4) return Pu(-1, t[e.index])
    if (n & 8) {
      let r = e.child
      if (r !== null) return Co(t, r)
      {
        let i = t[e.index]
        return qn(i) ? Pu(-1, i) : Ht(i)
      }
    } else {
      if (n & 32) return bl(e, t)() || Ht(t[e.index])
      {
        let r = Iy(t, e)
        if (r !== null) {
          if (Array.isArray(r)) return r[0]
          let i = ji(t[Et])
          return Co(i, r)
        } else return Co(t, e.next)
      }
    }
  }
  return null
}
function Iy(t, e) {
  if (e !== null) {
    let r = t[Et][Nt],
      i = e.projection
    return r.projection[i]
  }
  return null
}
function Pu(t, e) {
  let n = Je + t + 1
  if (n < e.length) {
    let r = e[n],
      i = r[Q].firstChild
    if (i !== null) return Co(r, i)
  }
  return e[Vi]
}
function jD(t, e, n) {
  let r = _y(t, e)
  r && FD(t, r, e, n)
}
function Rl(t, e, n, r, i, s, o) {
  for (; n != null; ) {
    let c = r[n.index],
      u = n.type
    if (
      (o && e === 0 && (c && Un(Ht(c), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (u & 8) Rl(t, e, n.child, r, i, s, !1), Dr(e, t, i, c, s)
      else if (u & 32) {
        let d = bl(n, r),
          f
        for (; (f = d()); ) Dr(e, t, i, f, s)
        Dr(e, t, i, c, s)
      } else u & 16 ? BD(t, e, r, n, i, s) : Dr(e, t, i, c, s)
    n = o ? n.projectionNext : n.next
  }
}
function Jo(t, e, n, r, i, s) {
  Rl(n, r, t.firstChild, e, i, s, !1)
}
function BD(t, e, n, r, i, s) {
  let o = n[Et],
    u = o[Nt].projection[r.projection]
  if (Array.isArray(u))
    for (let d = 0; d < u.length; d++) {
      let f = u[d]
      Dr(e, t, i, f, s)
    }
  else {
    let d = u,
      f = o[rt]
    fy(r) && (d.flags |= 128), Rl(t, e, d, f, i, s, !0)
  }
}
function $D(t, e, n, r, i) {
  let s = n[Vi],
    o = Ht(n)
  s !== o && Dr(e, t, r, s, i)
  for (let c = Je; c < n.length; c++) {
    let u = n[c]
    Jo(u[Q], u, t, e, r, s)
  }
}
function HD(t, e, n, r, i) {
  if (e) i ? t.addClass(n, r) : t.removeClass(n, r)
  else {
    let s = r.indexOf('-') === -1 ? void 0 : qt.DashCase
    i == null
      ? t.removeStyle(n, r, s)
      : (typeof i == 'string' &&
          i.endsWith('!important') &&
          ((i = i.slice(0, -10)), (s |= qt.Important)),
        t.setStyle(n, r, i, s))
  }
}
function qD(t, e, n) {
  t.setAttribute(e, 'style', n)
}
function wy(t, e, n) {
  n === '' ? t.removeAttribute(e, 'class') : t.setAttribute(e, 'class', n)
}
function Ey(t, e, n) {
  let { mergedAttrs: r, classes: i, styles: s } = n
  r !== null && Iu(t, e, r),
    i !== null && wy(t, e, i),
    s !== null && qD(t, e, s)
}
var ko = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${ug})`
  }
}
function Zo(t) {
  return t instanceof ko ? t.changingThisBreaksApplicationSecurity : t
}
function Ty(t, e) {
  let n = zD(t)
  if (n != null && n !== e) {
    if (n === 'ResourceURL' && e === 'URL') return !0
    throw new Error(`Required a safe ${e}, got a ${n} (see ${ug})`)
  }
  return n === e
}
function zD(t) {
  return (t instanceof ko && t.getTypeName()) || null
}
var GD = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i
function Dy(t) {
  return (t = String(t)), t.match(GD) ? t : 'unsafe:' + t
}
var xl = (function (t) {
  return (
    (t[(t.NONE = 0)] = 'NONE'),
    (t[(t.HTML = 1)] = 'HTML'),
    (t[(t.STYLE = 2)] = 'STYLE'),
    (t[(t.SCRIPT = 3)] = 'SCRIPT'),
    (t[(t.URL = 4)] = 'URL'),
    (t[(t.RESOURCE_URL = 5)] = 'RESOURCE_URL'),
    t
  )
})(xl || {})
function Xo(t) {
  let e = WD()
  return e ? e.sanitize(xl.URL, t) || '' : Ty(t, 'URL') ? Zo(t) : Dy(il(t))
}
function WD() {
  let t = he()
  return t && t[xt].sanitizer
}
var Ou = class {}
var KD = 'h',
  QD = 'b'
var YD = () => null
function Nl(t, e, n = !1) {
  return YD(t, e, n)
}
var ku = class {},
  Fo = class {}
function JD(t) {
  let e = Error(`No component factory found for ${It(t)}.`)
  return (e[ZD] = t), e
}
var ZD = 'ngComponent'
var Fu = class {
    resolveComponentFactory(e) {
      throw JD(e)
    }
  },
  Ml = (() => {
    let e = class e {}
    e.NULL = new Fu()
    let t = e
    return t
  })()
function XD() {
  return by(Kt(), he())
}
function by(t, e) {
  return new ea(Mt(t, e))
}
var ea = (() => {
  let e = class e {
    constructor(r) {
      this.nativeElement = r
    }
  }
  e.__NG_ELEMENT_ID__ = XD
  let t = e
  return t
})()
var qi = class {},
  Pl = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null
      }
    }
    e.__NG_ELEMENT_ID__ = () => e0()
    let t = e
    return t
  })()
function e0() {
  let t = he(),
    e = Kt(),
    n = hn(e.index, t)
  return (kn(n) ? n : t)[Ge]
}
var t0 = (() => {
    let e = class e {}
    e.ɵprov = pe({ token: e, providedIn: 'root', factory: () => null })
    let t = e
    return t
  })(),
  uu = {}
function Ol(t) {
  let e = Ae(null)
  try {
    return t()
  } finally {
    Ae(e)
  }
}
function Lo(t, e, n, r, i = !1) {
  for (; n !== null; ) {
    let s = e[n.index]
    s !== null && r.push(Ht(s)), qn(s) && n0(s, r)
    let o = n.type
    if (o & 8) Lo(t, e, n.child, r)
    else if (o & 32) {
      let c = bl(n, e),
        u
      for (; (u = c()); ) r.push(u)
    } else if (o & 16) {
      let c = Iy(e, n)
      if (Array.isArray(c)) r.push(...c)
      else {
        let u = ji(e[Et])
        Lo(u[Q], u, c, r, !0)
      }
    }
    n = i ? n.projectionNext : n.next
  }
  return r
}
function n0(t, e) {
  for (let n = Je; n < t.length; n++) {
    let r = t[n],
      i = r[Q].firstChild
    i !== null && Lo(r[Q], r, i, e)
  }
  t[Vi] !== t[Gt] && e.push(t[Vi])
}
var Cy = []
function r0(t) {
  return t[Fn] ?? i0(t)
}
function i0(t) {
  let e = Cy.pop() ?? Object.create(o0)
  return (e.lView = t), e
}
function s0(t) {
  t.lView[Fn] !== t && ((t.lView = null), Cy.push(t))
}
var o0 = $t(Ct({}, tm), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (t) => {
    Ui(t.lView)
  },
  consumerOnSignalRead() {
    this.lView[Fn] = this
  },
})
function Ay(t) {
  return Ry(t[Fi])
}
function Sy(t) {
  return Ry(t[wt])
}
function Ry(t) {
  for (; t !== null && !qn(t); ) t = t[wt]
  return t
}
var a0 = 'ngOriginalError'
function lu(t) {
  return t[a0]
}
var zt = class {
    constructor() {
      this._console = console
    }
    handleError(e) {
      let n = this._findOriginalError(e)
      this._console.error('ERROR', e),
        n && this._console.error('ORIGINAL ERROR', n)
    }
    _findOriginalError(e) {
      let n = e && lu(e)
      for (; n && lu(n); ) n = lu(n)
      return n || null
    }
  },
  xy = new oe('', {
    providedIn: 'root',
    factory: () => ve(zt).handleError.bind(void 0),
  })
var Ny = !1,
  c0 = new oe('', { providedIn: 'root', factory: () => Ny })
var mn = {}
function We(t = 1) {
  My(Wt(), he(), zn() + t, !1)
}
function My(t, e, n, r) {
  if (!r)
    if ((e[V] & 3) === 3) {
      let s = t.preOrderCheckHooks
      s !== null && To(e, s, n)
    } else {
      let s = t.preOrderHooks
      s !== null && Do(e, s, 0, n)
    }
  Ln(n)
}
function Nr(t, e = J.Default) {
  let n = he()
  if (n === null) return ne(t, e)
  let r = Kt()
  return ny(r, n, _t(t), e)
}
function Py(t, e, n, r, i, s) {
  let o = Ae(null)
  try {
    let c = null
    i & ln.SignalBased && (c = e[r][em]),
      c !== null && c.transformFn !== void 0 && (s = c.transformFn(s)),
      i & ln.HasDecoratorInputTransform &&
        (s = t.inputTransforms[r].call(e, s)),
      t.setInput !== null ? t.setInput(e, c, s, n, r) : Sg(e, c, r, s)
  } finally {
    Ae(o)
  }
}
function u0(t, e) {
  let n = t.hostBindingOpCodes
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let i = n[r]
        if (i < 0) Ln(~i)
        else {
          let s = i,
            o = n[++r],
            c = n[++r]
          MT(o, s)
          let u = e[s]
          c(2, u)
        }
      }
    } finally {
      Ln(-1)
    }
}
function ta(t, e, n, r, i, s, o, c, u, d, f) {
  let m = e.blueprint.slice()
  return (
    (m[Gt] = i),
    (m[V] = r | 4 | 128 | 8 | 64),
    (d !== null || (t && t[V] & 2048)) && (m[V] |= 2048),
    kg(m),
    (m[rt] = m[xr] = t),
    (m[Ve] = n),
    (m[xt] = o || (t && t[xt])),
    (m[Ge] = c || (t && t[Ge])),
    (m[Cr] = u || (t && t[Cr]) || null),
    (m[Nt] = s),
    (m[Go] = wD()),
    (m[Oi] = f),
    (m[bg] = d),
    (m[Et] = e.type == 2 ? t[Et] : m),
    m
  )
}
function na(t, e, n, r, i) {
  let s = t.data[e]
  if (s === null) (s = l0(t, e, n, r, i)), NT() && (s.flags |= 32)
  else if (s.type & 64) {
    ;(s.type = n), (s.value = r), (s.attrs = i)
    let o = AT()
    s.injectorIndex = o === null ? -1 : o.injectorIndex
  }
  return Ki(s, !0), s
}
function l0(t, e, n, r, i) {
  let s = Vg(),
    o = Ug(),
    c = o ? s : s && s.parent,
    u = (t.data[e] = m0(t, c, n, e, r, i))
  return (
    t.firstChild === null && (t.firstChild = u),
    s !== null &&
      (o
        ? s.child == null && u.parent !== null && (s.child = u)
        : s.next === null && ((s.next = u), (u.prev = s))),
    u
  )
}
function Oy(t, e, n, r) {
  if (n === 0) return -1
  let i = e.length
  for (let s = 0; s < n; s++) e.push(r), t.blueprint.push(r), t.data.push(null)
  return i
}
function ky(t, e, n, r, i) {
  let s = zn(),
    o = r & 2
  try {
    Ln(-1), o && e.length > it && My(t, e, it, !1), At(o ? 2 : 0, i), n(r, i)
  } finally {
    Ln(s), At(o ? 3 : 1, i)
  }
}
function Fy(t, e, n) {
  if (Ag(e)) {
    let r = Ae(null)
    try {
      let i = e.directiveStart,
        s = e.directiveEnd
      for (let o = i; o < s; o++) {
        let c = t.data[o]
        c.contentQueries && c.contentQueries(1, n[o], o)
      }
    } finally {
      Ae(r)
    }
  }
}
function Ly(t, e, n) {
  Lg() && (E0(t, e, n, Mt(n, e)), (n.flags & 64) === 64 && $y(t, e, n))
}
function Vy(t, e, n = Mt) {
  let r = e.localNames
  if (r !== null) {
    let i = e.index + 1
    for (let s = 0; s < r.length; s += 2) {
      let o = r[s + 1],
        c = o === -1 ? n(e, t) : t[o]
      t[i++] = c
    }
  }
}
function Uy(t) {
  let e = t.tView
  return e === null || e.incompleteFirstPass
    ? (t.tView = kl(
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
function kl(t, e, n, r, i, s, o, c, u, d, f) {
  let m = it + r,
    _ = m + i,
    D = d0(m, _),
    S = typeof d == 'function' ? d() : d
  return (D[Q] = {
    type: t,
    blueprint: D,
    template: n,
    queries: null,
    viewQuery: c,
    declTNode: e,
    data: D.slice().fill(null, m),
    bindingStartIndex: m,
    expandoStartIndex: _,
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
    schemas: u,
    consts: S,
    incompleteFirstPass: !1,
    ssrId: f,
  })
}
function d0(t, e) {
  let n = []
  for (let r = 0; r < e; r++) n.push(r < t ? null : mn)
  return n
}
function h0(t, e, n, r) {
  let s = r.get(c0, Ny) || n === Rt.ShadowDom,
    o = t.selectRootElement(e, s)
  return f0(o), o
}
function f0(t) {
  p0(t)
}
var p0 = () => null
function m0(t, e, n, r, i, s) {
  let o = e ? e.injectorIndex : -1,
    c = 0
  return (
    DT() && (c |= 128),
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
      flags: c,
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
function Ym(t, e, n, r, i) {
  for (let s in e) {
    if (!e.hasOwnProperty(s)) continue
    let o = e[s]
    if (o === void 0) continue
    r ??= {}
    let c,
      u = ln.None
    Array.isArray(o) ? ((c = o[0]), (u = o[1])) : (c = o)
    let d = s
    if (i !== null) {
      if (!i.hasOwnProperty(s)) continue
      d = i[s]
    }
    t === 0 ? Jm(r, n, d, c, u) : Jm(r, n, d, c)
  }
  return r
}
function Jm(t, e, n, r, i) {
  let s
  t.hasOwnProperty(n) ? (s = t[n]).push(e, r) : (s = t[n] = [e, r]),
    i !== void 0 && s.push(i)
}
function g0(t, e, n) {
  let r = e.directiveStart,
    i = e.directiveEnd,
    s = t.data,
    o = e.attrs,
    c = [],
    u = null,
    d = null
  for (let f = r; f < i; f++) {
    let m = s[f],
      _ = n ? n.get(m) : null,
      D = _ ? _.inputs : null,
      S = _ ? _.outputs : null
    ;(u = Ym(0, m.inputs, f, u, D)), (d = Ym(1, m.outputs, f, d, S))
    let N = u !== null && o !== null && !vg(e) ? N0(u, f, o) : null
    c.push(N)
  }
  u !== null &&
    (u.hasOwnProperty('class') && (e.flags |= 8),
    u.hasOwnProperty('style') && (e.flags |= 16)),
    (e.initialInputs = c),
    (e.inputs = u),
    (e.outputs = d)
}
function y0(t) {
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
function v0(t, e, n, r, i, s, o, c) {
  let u = Mt(e, n),
    d = e.inputs,
    f
  !c && d != null && (f = d[r])
    ? (Ll(t, n, f, r, i), Wo(e) && _0(n, e.index))
    : e.type & 3
      ? ((r = y0(r)),
        (i = o != null ? o(i, e.value || '', r) : i),
        s.setProperty(u, r, i))
      : e.type & 12
}
function _0(t, e) {
  let n = hn(e, t)
  n[V] & 16 || (n[V] |= 64)
}
function jy(t, e, n, r) {
  if (Lg()) {
    let i = r === null ? null : { '': -1 },
      s = D0(t, n),
      o,
      c
    s === null ? (o = c = null) : ([o, c] = s),
      o !== null && By(t, e, n, o, i, c),
      i && b0(n, r, i)
  }
  n.mergedAttrs = al(n.mergedAttrs, n.attrs)
}
function By(t, e, n, r, i, s) {
  for (let d = 0; d < r.length; d++) YT(Jg(n, e), t, r[d].type)
  A0(n, t.data.length, r.length)
  for (let d = 0; d < r.length; d++) {
    let f = r[d]
    f.providersResolver && f.providersResolver(f)
  }
  let o = !1,
    c = !1,
    u = Oy(t, e, r.length, null)
  for (let d = 0; d < r.length; d++) {
    let f = r[d]
    ;(n.mergedAttrs = al(n.mergedAttrs, f.hostAttrs)),
      S0(t, n, e, u, f),
      C0(u, f, i),
      f.contentQueries !== null && (n.flags |= 4),
      (f.hostBindings !== null || f.hostAttrs !== null || f.hostVars !== 0) &&
        (n.flags |= 64)
    let m = f.type.prototype
    !o &&
      (m.ngOnChanges || m.ngOnInit || m.ngDoCheck) &&
      ((t.preOrderHooks ??= []).push(n.index), (o = !0)),
      !c &&
        (m.ngOnChanges || m.ngDoCheck) &&
        ((t.preOrderCheckHooks ??= []).push(n.index), (c = !0)),
      u++
  }
  g0(t, n, s)
}
function I0(t, e, n, r, i) {
  let s = i.hostBindings
  if (s) {
    let o = t.hostBindingOpCodes
    o === null && (o = t.hostBindingOpCodes = [])
    let c = ~e.index
    w0(o) != c && o.push(c), o.push(n, r, s)
  }
}
function w0(t) {
  let e = t.length
  for (; e > 0; ) {
    let n = t[--e]
    if (typeof n == 'number' && n < 0) return n
  }
  return 0
}
function E0(t, e, n, r) {
  let i = n.directiveStart,
    s = n.directiveEnd
  Wo(n) && R0(e, n, t.data[i + n.componentOffset]),
    t.firstCreatePass || Jg(n, e),
    Un(r, e)
  let o = n.initialInputs
  for (let c = i; c < s; c++) {
    let u = t.data[c],
      d = $i(e, t, c, n)
    if ((Un(d, e), o !== null && x0(e, c - i, d, u, n, o), Wi(u))) {
      let f = hn(n.index, e)
      f[Ve] = $i(e, t, c, n)
    }
  }
}
function $y(t, e, n) {
  let r = n.directiveStart,
    i = n.directiveEnd,
    s = n.index,
    o = PT()
  try {
    Ln(s)
    for (let c = r; c < i; c++) {
      let u = t.data[c],
        d = e[c]
      Tu(c),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          T0(u, d)
    }
  } finally {
    Ln(-1), Tu(o)
  }
}
function T0(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e)
}
function D0(t, e) {
  let n = t.directiveRegistry,
    r = null,
    i = null
  if (n)
    for (let s = 0; s < n.length; s++) {
      let o = n[s]
      if (XE(e, o.selectors, !1))
        if ((r || (r = []), Wi(o)))
          if (o.findHostDirectiveDefs !== null) {
            let c = []
            ;(i = i || new Map()),
              o.findHostDirectiveDefs(o, c, i),
              r.unshift(...c, o)
            let u = c.length
            Lu(t, e, u)
          } else r.unshift(o), Lu(t, e, 0)
        else (i = i || new Map()), o.findHostDirectiveDefs?.(o, r, i), r.push(o)
    }
  return r === null ? null : [r, i]
}
function Lu(t, e, n) {
  ;(e.componentOffset = n), (t.components ??= []).push(e.index)
}
function b0(t, e, n) {
  if (e) {
    let r = (t.localNames = [])
    for (let i = 0; i < e.length; i += 2) {
      let s = n[e[i + 1]]
      if (s == null) throw new se(-301, !1)
      r.push(e[i], s)
    }
  }
}
function C0(t, e, n) {
  if (n) {
    if (e.exportAs)
      for (let r = 0; r < e.exportAs.length; r++) n[e.exportAs[r]] = t
    Wi(e) && (n[''] = t)
  }
}
function A0(t, e, n) {
  ;(t.flags |= 1),
    (t.directiveStart = e),
    (t.directiveEnd = e + n),
    (t.providerIndexes = e)
}
function S0(t, e, n, r, i) {
  t.data[r] = i
  let s = i.factory || (i.factory = Ar(i.type, !0)),
    o = new Bi(s, Wi(i), Nr)
  ;(t.blueprint[r] = o), (n[r] = o), I0(t, e, r, Oy(t, n, i.hostVars, mn), i)
}
function R0(t, e, n) {
  let r = Mt(e, t),
    i = Uy(n),
    s = t[xt].rendererFactory,
    o = 16
  n.signals ? (o = 4096) : n.onPush && (o = 64)
  let c = Fl(
    t,
    ta(t, i, null, o, r, e, null, s.createRenderer(r, n), null, null, null)
  )
  t[e.index] = c
}
function x0(t, e, n, r, i, s) {
  let o = s[e]
  if (o !== null)
    for (let c = 0; c < o.length; ) {
      let u = o[c++],
        d = o[c++],
        f = o[c++],
        m = o[c++]
      Py(r, n, u, d, f, m)
    }
}
function N0(t, e, n) {
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
      for (let c = 0; c < o.length; c += 3)
        if (o[c] === e) {
          r.push(s, o[c + 1], o[c + 2], n[i + 1])
          break
        }
    }
    i += 2
  }
  return r
}
function M0(t, e, n, r) {
  return [t, !0, 0, e, null, r, null, n, null, null]
}
function Hy(t, e) {
  let n = t.contentQueries
  if (n !== null) {
    let r = Ae(null)
    try {
      for (let i = 0; i < n.length; i += 2) {
        let s = n[i],
          o = n[i + 1]
        if (o !== -1) {
          let c = t.data[o]
          Bg(s), c.contentQueries(2, e[o], o)
        }
      }
    } finally {
      Ae(r)
    }
  }
}
function Fl(t, e) {
  return t[Fi] ? (t[Bm][wt] = e) : (t[Fi] = e), (t[Bm] = e), e
}
function Vu(t, e, n) {
  Bg(0)
  let r = Ae(null)
  try {
    e(t, n)
  } finally {
    Ae(r)
  }
}
function P0(t) {
  return t[ki] || (t[ki] = [])
}
function O0(t) {
  return t.cleanup || (t.cleanup = [])
}
function qy(t, e) {
  let n = t[Cr],
    r = n ? n.get(zt, null) : null
  r && r.handleError(e)
}
function Ll(t, e, n, r, i) {
  for (let s = 0; s < n.length; ) {
    let o = n[s++],
      c = n[s++],
      u = n[s++],
      d = e[o],
      f = t.data[o]
    Py(f, d, r, c, u, i)
  }
}
function k0(t, e, n) {
  let r = Og(e, t)
  CD(t[Ge], r, n)
}
var F0 = 100
function L0(t, e = !0) {
  let n = t[xt],
    r = n.rendererFactory,
    i = !1
  i || r.begin?.()
  try {
    V0(t)
  } catch (s) {
    throw (e && qy(t, s), s)
  } finally {
    i || (r.end?.(), n.inlineEffectRunner?.flush())
  }
}
function V0(t) {
  Uu(t, 0)
  let e = 0
  for (; Fg(t); ) {
    if (e === F0) throw new se(103, !1)
    e++, Uu(t, 1)
  }
}
function U0(t, e, n, r) {
  let i = e[V]
  if ((i & 256) === 256) return
  let s = !1
  !s && e[xt].inlineEffectRunner?.flush(), hl(e)
  let o = null,
    c = null
  !s && j0(t) && ((c = r0(e)), (o = nm(c)))
  try {
    kg(e), RT(t.bindingStartIndex), n !== null && ky(t, e, n, 2, r)
    let u = (i & 3) === 3
    if (!s)
      if (u) {
        let m = t.preOrderCheckHooks
        m !== null && To(e, m, null)
      } else {
        let m = t.preOrderHooks
        m !== null && Do(e, m, 0, null), iu(e, 0)
      }
    if ((B0(e), zy(e, 0), t.contentQueries !== null && Hy(t, e), !s))
      if (u) {
        let m = t.contentCheckHooks
        m !== null && To(e, m)
      } else {
        let m = t.contentHooks
        m !== null && Do(e, m, 1), iu(e, 1)
      }
    u0(t, e)
    let d = t.components
    d !== null && Wy(e, d, 0)
    let f = t.viewQuery
    if ((f !== null && Vu(2, f, r), !s))
      if (u) {
        let m = t.viewCheckHooks
        m !== null && To(e, m)
      } else {
        let m = t.viewHooks
        m !== null && Do(e, m, 2), iu(e, 2)
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[ru])) {
      for (let m of e[ru]) m()
      e[ru] = null
    }
    s || (e[V] &= -73)
  } catch (u) {
    throw (Ui(e), u)
  } finally {
    c !== null && (rm(c, o), s0(c)), fl()
  }
}
function j0(t) {
  return t.type !== 2
}
function zy(t, e) {
  for (let n = Ay(t); n !== null; n = Sy(n))
    for (let r = Je; r < n.length; r++) {
      let i = n[r]
      Gy(i, e)
    }
}
function B0(t) {
  for (let e = Ay(t); e !== null; e = Sy(e)) {
    if (!(e[V] & cl.HasTransplantedViews)) continue
    let n = e[Ro]
    for (let r = 0; r < n.length; r++) {
      let i = n[r],
        s = i[rt]
      vT(i)
    }
  }
}
function $0(t, e, n) {
  let r = hn(e, t)
  Gy(r, n)
}
function Gy(t, e) {
  dl(t) && Uu(t, e)
}
function Uu(t, e) {
  let r = t[Q],
    i = t[V],
    s = t[Fn],
    o = !!(e === 0 && i & 16)
  if (
    ((o ||= !!(i & 64 && e === 0)),
    (o ||= !!(i & 1024)),
    (o ||= !!(s?.dirty && Uc(s))),
    s && (s.dirty = !1),
    (t[V] &= -9217),
    o)
  )
    U0(r, t, r.template, t[Ve])
  else if (i & 8192) {
    zy(t, 1)
    let c = r.components
    c !== null && Wy(t, c, 1)
  }
}
function Wy(t, e, n) {
  for (let r = 0; r < e.length; r++) $0(t, e[r], n)
}
function Vl(t) {
  for (t[xt].changeDetectionScheduler?.notify(); t; ) {
    t[V] |= 64
    let e = ji(t)
    if (lT(t) && !e) return t
    t = e
  }
  return null
}
var zi = class {
    get rootNodes() {
      let e = this._lView,
        n = e[Q]
      return Lo(n, e, n.firstChild, [])
    }
    constructor(e, n, r = !0) {
      ;(this._lView = e),
        (this._cdRefInjectingView = n),
        (this.notifyErrorHandler = r),
        (this._appRef = null),
        (this._attachedToViewContainer = !1)
    }
    get context() {
      return this._lView[Ve]
    }
    set context(e) {
      this._lView[Ve] = e
    }
    get destroyed() {
      return (this._lView[V] & 256) === 256
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this)
      else if (this._attachedToViewContainer) {
        let e = this._lView[rt]
        if (qn(e)) {
          let n = e[uT],
            r = n ? n.indexOf(this) : -1
          r > -1 && (Cl(e, r), sy(n, r))
        }
        this._attachedToViewContainer = !1
      }
      Al(this._lView[Q], this._lView)
    }
    onDestroy(e) {
      IT(this._lView, e)
    }
    markForCheck() {
      Vl(this._cdRefInjectingView || this._lView)
    }
    detach() {
      this._lView[V] &= -129
    }
    reattach() {
      Eu(this._lView), (this._lView[V] |= 128)
    }
    detectChanges() {
      ;(this._lView[V] |= 1024), L0(this._lView, this.notifyErrorHandler)
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new se(902, !1)
      this._attachedToViewContainer = !0
    }
    detachFromAppRef() {
      ;(this._appRef = null), gy(this._lView[Q], this._lView)
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new se(902, !1)
      ;(this._appRef = e), Eu(this._lView)
    }
  },
  Ky = (() => {
    let e = class e {}
    e.__NG_ELEMENT_ID__ = H0
    let t = e
    return t
  })()
function H0(t) {
  return q0(Kt(), he(), (t & 16) === 16)
}
function q0(t, e, n) {
  if (Wo(t) && !n) {
    let r = hn(t.index, e)
    return new zi(r, r)
  } else if (t.type & 47) {
    let r = e[Et]
    return new zi(r, e)
  }
  return null
}
var Zm = new Set()
function ra(t) {
  Zm.has(t) ||
    (Zm.add(t),
    performance?.mark?.('mark_feature_usage', { detail: { feature: t } }))
}
var ju = class extends gr {
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
      let u = e
      ;(i = u.next?.bind(u)), (s = u.error?.bind(u)), (o = u.complete?.bind(u))
    }
    this.__isAsync && ((s = du(s)), i && (i = du(i)), o && (o = du(o)))
    let c = super.subscribe({ next: i, error: s, complete: o })
    return e instanceof Le && e.add(c), c
  }
}
function du(t) {
  return (e) => {
    setTimeout(t, void 0, e)
  }
}
var nt = ju
function Xm(...t) {}
function z0() {
  let t = typeof Ri.requestAnimationFrame == 'function',
    e = Ri[t ? 'requestAnimationFrame' : 'setTimeout'],
    n = Ri[t ? 'cancelAnimationFrame' : 'clearTimeout']
  if (typeof Zone < 'u' && e && n) {
    let r = e[Zone.__symbol__('OriginalDelegate')]
    r && (e = r)
    let i = n[Zone.__symbol__('OriginalDelegate')]
    i && (n = i)
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: n }
}
var ge = class t {
    constructor({
      enableLongStackTrace: e = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new nt(!1)),
        (this.onMicrotaskEmpty = new nt(!1)),
        (this.onStable = new nt(!1)),
        (this.onError = new nt(!1)),
        typeof Zone > 'u')
      )
        throw new se(908, !1)
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
        (i.nativeRequestAnimationFrame = z0().nativeRequestAnimationFrame),
        K0(i)
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get('isAngularZone') === !0
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new se(909, !1)
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new se(909, !1)
    }
    run(e, n, r) {
      return this._inner.run(e, n, r)
    }
    runTask(e, n, r, i) {
      let s = this._inner,
        o = s.scheduleEventTask('NgZoneEvent: ' + i, e, G0, Xm, Xm)
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
  G0 = {}
function Ul(t) {
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
function W0(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(
      Ri,
      () => {
        t.fakeTopEventTask ||
          (t.fakeTopEventTask = Zone.root.scheduleEventTask(
            'fakeTopEventTask',
            () => {
              ;(t.lastRequestAnimationFrameId = -1),
                Bu(t),
                (t.isCheckStableRunning = !0),
                Ul(t),
                (t.isCheckStableRunning = !1)
            },
            void 0,
            () => {},
            () => {}
          )),
          t.fakeTopEventTask.invoke()
      }
    )),
    Bu(t))
}
function K0(t) {
  let e = () => {
    W0(t)
  }
  t._inner = t._inner.fork({
    name: 'angular',
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, i, s, o, c) => {
      if (Q0(c)) return n.invokeTask(i, s, o, c)
      try {
        return eg(t), n.invokeTask(i, s, o, c)
      } finally {
        ;((t.shouldCoalesceEventChangeDetection && s.type === 'eventTask') ||
          t.shouldCoalesceRunChangeDetection) &&
          e(),
          tg(t)
      }
    },
    onInvoke: (n, r, i, s, o, c, u) => {
      try {
        return eg(t), n.invoke(i, s, o, c, u)
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), tg(t)
      }
    },
    onHasTask: (n, r, i, s) => {
      n.hasTask(i, s),
        r === i &&
          (s.change == 'microTask'
            ? ((t._hasPendingMicrotasks = s.microTask), Bu(t), Ul(t))
            : s.change == 'macroTask' && (t.hasPendingMacrotasks = s.macroTask))
    },
    onHandleError: (n, r, i, s) => (
      n.handleError(i, s), t.runOutsideAngular(() => t.onError.emit(s)), !1
    ),
  })
}
function Bu(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection ||
    t.shouldCoalesceRunChangeDetection) &&
    t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1)
}
function eg(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null))
}
function tg(t) {
  t._nesting--, Ul(t)
}
function Q0(t) {
  return !Array.isArray(t) || t.length !== 1
    ? !1
    : t[0].data?.__ignore_ng_zone__ === !0
}
var Qy = (() => {
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
  e.ɵprov = pe({ token: e, providedIn: 'root', factory: () => new e() })
  let t = e
  return t
})()
function Y0(t, e) {
  let n = hn(e, t),
    r = n[Q]
  J0(r, n)
  let i = n[Gt]
  i !== null && n[Oi] === null && (n[Oi] = Nl(i, n[Cr])), jl(r, n, n[Ve])
}
function J0(t, e) {
  for (let n = e.length; n < t.blueprint.length; n++) e.push(t.blueprint[n])
}
function jl(t, e, n) {
  hl(e)
  try {
    let r = t.viewQuery
    r !== null && Vu(1, r, n)
    let i = t.template
    i !== null && ky(t, e, i, 1, n),
      t.firstCreatePass && (t.firstCreatePass = !1),
      t.staticContentQueries && Hy(t, e),
      t.staticViewQueries && Vu(2, t.viewQuery, n)
    let s = t.components
    s !== null && Z0(e, s)
  } catch (r) {
    throw (
      (t.firstCreatePass &&
        ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)),
      r)
    )
  } finally {
    ;(e[V] &= -5), fl()
  }
}
function Z0(t, e) {
  for (let n = 0; n < e.length; n++) Y0(t, e[n])
}
function $u(t, e, n) {
  let r = n ? t.styles : null,
    i = n ? t.classes : null,
    s = 0
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let c = e[o]
      if (typeof c == 'number') s = c
      else if (s == 1) i = gu(i, c)
      else if (s == 2) {
        let u = c,
          d = e[++o]
        r = gu(r, u + ': ' + d + ';')
      }
    }
  n ? (t.styles = r) : (t.stylesWithoutHost = r),
    n ? (t.classes = i) : (t.classesWithoutHost = i)
}
var Hu = class extends Ml {
  constructor(e) {
    super(), (this.ngModule = e)
  }
  resolveComponentFactory(e) {
    let n = qo(e)
    return new zu(n, this.ngModule)
  }
}
function ng(t) {
  let e = []
  for (let n in t) {
    if (!t.hasOwnProperty(n)) continue
    let r = t[n]
    r !== void 0 &&
      e.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n })
  }
  return e
}
function X0(t) {
  let e = t.toLowerCase()
  return e === 'svg' ? Pg : e === 'math' ? pT : null
}
var qu = class {
    constructor(e, n) {
      ;(this.injector = e), (this.parentInjector = n)
    }
    get(e, n, r) {
      r = $o(r)
      let i = this.injector.get(e, uu, r)
      return i !== uu || n === uu ? i : this.parentInjector.get(e, n, r)
    }
  },
  zu = class extends Fo {
    get inputs() {
      let e = this.componentDef,
        n = e.inputTransforms,
        r = ng(e.inputs)
      if (n !== null)
        for (let i of r)
          n.hasOwnProperty(i.propName) && (i.transform = n[i.propName])
      return r
    }
    get outputs() {
      return ng(this.componentDef.outputs)
    }
    constructor(e, n) {
      super(),
        (this.componentDef = e),
        (this.ngModule = n),
        (this.componentType = e.type),
        (this.selector = rT(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors
          ? e.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n)
    }
    create(e, n, r, i) {
      i = i || this.ngModule
      let s = i instanceof Vn ? i : i?.injector
      s &&
        this.componentDef.getStandaloneInjector !== null &&
        (s = this.componentDef.getStandaloneInjector(s) || s)
      let o = s ? new qu(e, s) : e,
        c = o.get(qi, null)
      if (c === null) throw new se(407, !1)
      let u = o.get(t0, null),
        d = o.get(Qy, null),
        f = o.get(Ou, null),
        m = {
          rendererFactory: c,
          sanitizer: u,
          inlineEffectRunner: null,
          afterRenderEventManager: d,
          changeDetectionScheduler: f,
        },
        _ = c.createRenderer(null, this.componentDef),
        D = this.componentDef.selectors[0][0] || 'div',
        S = r ? h0(_, r, this.componentDef.encapsulation, o) : my(_, D, X0(D)),
        N = 512
      this.componentDef.signals
        ? (N |= 4096)
        : this.componentDef.onPush || (N |= 16)
      let R = null
      S !== null && (R = Nl(S, o, !0))
      let k = kl(0, null, null, 1, 0, null, null, null, null, null, null),
        B = ta(null, k, null, N, null, null, m, _, o, null, R)
      hl(B)
      let q, K
      try {
        let ce = this.componentDef,
          z,
          w = null
        ce.findHostDirectiveDefs
          ? ((z = []),
            (w = new Map()),
            ce.findHostDirectiveDefs(ce, z, w),
            z.push(ce))
          : (z = [ce])
        let g = eb(B, S),
          y = tb(g, S, ce, z, B, m, _)
        ;(K = ll(k, it)),
          S && ib(_, ce, S, r),
          n !== void 0 && sb(K, this.ngContentSelectors, n),
          (q = rb(y, ce, z, w, B, [ob])),
          jl(k, B, null)
      } finally {
        fl()
      }
      return new Gu(this.componentType, q, by(K, B), B, K)
    }
  },
  Gu = class extends ku {
    constructor(e, n, r, i, s) {
      super(),
        (this.location = r),
        (this._rootLView = i),
        (this._tNode = s),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new zi(i, void 0, !1)),
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
        Ll(s[Q], s, i, e, n), this.previousInputValues.set(e, n)
        let o = hn(this._tNode.index, s)
        Vl(o)
      }
    }
    get injector() {
      return new Mo(this._tNode, this._rootLView)
    }
    destroy() {
      this.hostView.destroy()
    }
    onDestroy(e) {
      this.hostView.onDestroy(e)
    }
  }
function eb(t, e) {
  let n = t[Q],
    r = it
  return (t[r] = e), na(n, r, 2, '#host', null)
}
function tb(t, e, n, r, i, s, o) {
  let c = i[Q]
  nb(r, t, e, o)
  let u = null
  e !== null && (u = Nl(e, i[Cr]))
  let d = s.rendererFactory.createRenderer(e, n),
    f = 16
  n.signals ? (f = 4096) : n.onPush && (f = 64)
  let m = ta(i, Uy(n), null, f, i[t.index], t, s, d, null, null, u)
  return c.firstCreatePass && Lu(c, t, r.length - 1), Fl(i, m), (i[t.index] = m)
}
function nb(t, e, n, r) {
  for (let i of t) e.mergedAttrs = al(e.mergedAttrs, i.hostAttrs)
  e.mergedAttrs !== null &&
    ($u(e, e.mergedAttrs, !0), n !== null && Ey(r, n, e))
}
function rb(t, e, n, r, i, s) {
  let o = Kt(),
    c = i[Q],
    u = Mt(o, i)
  By(c, i, o, n, null, r)
  for (let f = 0; f < n.length; f++) {
    let m = o.directiveStart + f,
      _ = $i(i, c, m, o)
    Un(_, i)
  }
  $y(c, i, o), u && Un(u, i)
  let d = $i(i, c, o.directiveStart + o.componentOffset, o)
  if (((t[Ve] = i[Ve] = d), s !== null)) for (let f of s) f(d, e)
  return Fy(c, o, t), d
}
function ib(t, e, n, r) {
  if (r) Iu(t, n, ['ng-version', '17.1.0'])
  else {
    let { attrs: i, classes: s } = iT(e.selectors[0])
    i && Iu(t, n, i), s && s.length > 0 && wy(t, n, s.join(' '))
  }
}
function sb(t, e, n) {
  let r = (t.projection = [])
  for (let i = 0; i < e.length; i++) {
    let s = n[i]
    r.push(s != null ? Array.from(s) : null)
  }
}
function ob() {
  let t = Kt()
  yl(he()[Q], t)
}
var XO = new RegExp(`^(\\d+)*(${QD}|${KD})*(.*)`)
var ab = () => null
function Bl(t, e) {
  return ab(t, e)
}
function $l(t, e, n, r) {
  let i = e.tView,
    o = t[V] & 4096 ? 4096 : 16,
    c = ta(
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
    u = t[e.index]
  c[zo] = u
  let d = t[Li]
  return d !== null && (c[Li] = d.createEmbeddedView(i)), jl(i, c, n), c
}
function Yy(t, e) {
  let n = Je + e
  if (n < t.length) return t[n]
}
function Hl(t, e) {
  return !e || e.firstChild === null || fy(t)
}
function ql(t, e, n, r = !0) {
  let i = e[Q]
  if ((xD(i, e, t, n), r)) {
    let o = Pu(n, t),
      c = e[Ge],
      u = _y(c, t[Vi])
    u !== null && SD(i, t[Nt], c, e, u, o)
  }
  let s = e[Oi]
  s !== null && s.firstChild !== null && (s.firstChild = null)
}
function Jy(t, e) {
  let n = Cl(t, e)
  return n !== void 0 && Al(n[Q], n), n
}
var cb = () => !1
function ub(t, e, n) {
  return cb(t, e, n)
}
function Zy(t, e, n) {
  return (t[e] = n)
}
function dn(t, e, n) {
  let r = t[e]
  return Object.is(r, n) ? !1 : ((t[e] = n), !0)
}
function lb(t, e, n, r) {
  let i = dn(t, e, n)
  return dn(t, e + 1, r) || i
}
function db(t, e, n, r, i, s, o, c, u) {
  let d = e.consts,
    f = na(e, t, 4, o || null, xo(d, c))
  jy(e, n, f, xo(d, u)), yl(e, f)
  let m = (f.tView = kl(
    2,
    f,
    r,
    i,
    s,
    e.directiveRegistry,
    e.pipeRegistry,
    null,
    e.schemas,
    d,
    null
  ))
  return (
    e.queries !== null &&
      (e.queries.template(e, f), (m.queries = e.queries.embeddedTView(f))),
    f
  )
}
function Ze(t, e, n, r, i, s, o, c) {
  let u = he(),
    d = Wt(),
    f = t + it,
    m = d.firstCreatePass ? db(f, d, u, e, n, r, i, s, o) : d.data[f]
  Ki(m, !1)
  let _ = hb(d, u, m, t)
  ml() && Sl(d, u, _, m), Un(_, u)
  let D = M0(_, u, _, m)
  return (
    (u[f] = D),
    Fl(u, D),
    ub(D, m, u),
    ul(m) && Ly(d, u, m),
    o != null && Vy(u, m, c),
    Ze
  )
}
var hb = fb
function fb(t, e, n, r) {
  return gl(!0), e[Ge].createComment('')
}
function pb(t, e, n, r) {
  return dn(t, Ko(), n) ? e + il(n) + r : mn
}
function Eo(t, e) {
  return (t << 17) | (e << 2)
}
function jn(t) {
  return (t >> 17) & 32767
}
function mb(t) {
  return (t & 2) == 2
}
function gb(t, e) {
  return (t & 131071) | (e << 17)
}
function Wu(t) {
  return t | 2
}
function Sr(t) {
  return (t & 131068) >> 2
}
function hu(t, e) {
  return (t & -131069) | (e << 2)
}
function yb(t) {
  return (t & 1) === 1
}
function Ku(t) {
  return t | 1
}
function vb(t, e, n, r, i, s) {
  let o = s ? e.classBindings : e.styleBindings,
    c = jn(o),
    u = Sr(o)
  t[r] = n
  let d = !1,
    f
  if (Array.isArray(n)) {
    let m = n
    ;(f = m[1]), (f === null || Yi(m, f) > 0) && (d = !0)
  } else f = n
  if (i)
    if (u !== 0) {
      let _ = jn(t[c + 1])
      ;(t[r + 1] = Eo(_, c)),
        _ !== 0 && (t[_ + 1] = hu(t[_ + 1], r)),
        (t[c + 1] = gb(t[c + 1], r))
    } else
      (t[r + 1] = Eo(c, 0)), c !== 0 && (t[c + 1] = hu(t[c + 1], r)), (c = r)
  else
    (t[r + 1] = Eo(u, 0)),
      c === 0 ? (c = r) : (t[u + 1] = hu(t[u + 1], r)),
      (u = r)
  d && (t[r + 1] = Wu(t[r + 1])),
    rg(t, f, r, !0),
    rg(t, f, r, !1),
    _b(e, f, t, r, s),
    (o = Eo(c, u)),
    s ? (e.classBindings = o) : (e.styleBindings = o)
}
function _b(t, e, n, r, i) {
  let s = i ? t.residualClasses : t.residualStyles
  s != null &&
    typeof e == 'string' &&
    Yi(s, e) >= 0 &&
    (n[r + 1] = Ku(n[r + 1]))
}
function rg(t, e, n, r) {
  let i = t[n + 1],
    s = e === null,
    o = r ? jn(i) : Sr(i),
    c = !1
  for (; o !== 0 && (c === !1 || s); ) {
    let u = t[o],
      d = t[o + 1]
    Ib(u, e) && ((c = !0), (t[o + 1] = r ? Ku(d) : Wu(d))),
      (o = r ? jn(d) : Sr(d))
  }
  c && (t[n + 1] = r ? Wu(i) : Ku(i))
}
function Ib(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == 'string'
      ? Yi(t, e) >= 0
      : !1
}
var vt = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 }
function wb(t) {
  return t.substring(vt.key, vt.keyEnd)
}
function Eb(t) {
  return Tb(t), Xy(t, ev(t, 0, vt.textEnd))
}
function Xy(t, e) {
  let n = vt.textEnd
  return n === e ? -1 : ((e = vt.keyEnd = Db(t, (vt.key = e), n)), ev(t, e, n))
}
function Tb(t) {
  ;(vt.key = 0),
    (vt.keyEnd = 0),
    (vt.value = 0),
    (vt.valueEnd = 0),
    (vt.textEnd = t.length)
}
function ev(t, e, n) {
  for (; e < n && t.charCodeAt(e) <= 32; ) e++
  return e
}
function Db(t, e, n) {
  for (; e < n && t.charCodeAt(e) > 32; ) e++
  return e
}
function st(t, e, n) {
  let r = he(),
    i = Ko()
  if (dn(r, i, e)) {
    let s = Wt(),
      o = LT()
    v0(s, o, r, t, e, r[Ge], n, !1)
  }
  return st
}
function Qu(t, e, n, r, i) {
  let s = e.inputs,
    o = i ? 'class' : 'style'
  Ll(t, n, s[o], o, r)
}
function tv(t) {
  Cb(Pb, bb, t, !0)
}
function bb(t, e) {
  for (let n = Eb(e); n >= 0; n = Xy(e, n)) _l(t, wb(e), !0)
}
function Cb(t, e, n, r) {
  let i = Wt(),
    s = xT(2)
  i.firstUpdatePass && Ab(i, null, s, r)
  let o = he()
  if (n !== mn && dn(o, s, n)) {
    let c = i.data[zn()]
    if (rv(c, r) && !nv(i, s)) {
      let u = r ? c.classesWithoutHost : c.stylesWithoutHost
      u !== null && (n = gu(u, n || '')), Qu(i, c, o, n, r)
    } else Ob(i, c, o, o[Ge], o[s + 1], (o[s + 1] = Mb(t, e, n)), r, s)
  }
}
function nv(t, e) {
  return e >= t.expandoStartIndex
}
function Ab(t, e, n, r) {
  let i = t.data
  if (i[n + 1] === null) {
    let s = i[zn()],
      o = nv(t, n)
    rv(s, r) && e === null && !o && (e = !1),
      (e = Sb(i, s, e, r)),
      vb(i, s, e, n, o, r)
  }
}
function Sb(t, e, n, r) {
  let i = OT(t),
    s = r ? e.residualClasses : e.residualStyles
  if (i === null)
    (r ? e.classBindings : e.styleBindings) === 0 &&
      ((n = fu(null, t, e, n, r)), (n = Gi(n, e.attrs, r)), (s = null))
  else {
    let o = e.directiveStylingLast
    if (o === -1 || t[o] !== i)
      if (((n = fu(i, t, e, n, r)), s === null)) {
        let u = Rb(t, e, r)
        u !== void 0 &&
          Array.isArray(u) &&
          ((u = fu(null, t, e, u[1], r)),
          (u = Gi(u, e.attrs, r)),
          xb(t, e, r, u))
      } else s = Nb(t, e, r)
  }
  return (
    s !== void 0 && (r ? (e.residualClasses = s) : (e.residualStyles = s)), n
  )
}
function Rb(t, e, n) {
  let r = n ? e.classBindings : e.styleBindings
  if (Sr(r) !== 0) return t[jn(r)]
}
function xb(t, e, n, r) {
  let i = n ? e.classBindings : e.styleBindings
  t[jn(i)] = r
}
function Nb(t, e, n) {
  let r,
    i = e.directiveEnd
  for (let s = 1 + e.directiveStylingLast; s < i; s++) {
    let o = t[s].hostAttrs
    r = Gi(r, o, n)
  }
  return Gi(r, e.attrs, n)
}
function fu(t, e, n, r, i) {
  let s = null,
    o = n.directiveEnd,
    c = n.directiveStylingLast
  for (
    c === -1 ? (c = n.directiveStart) : c++;
    c < o && ((s = e[c]), (r = Gi(r, s.hostAttrs, i)), s !== t);

  )
    c++
  return t !== null && (n.directiveStylingLast = c), r
}
function Gi(t, e, n) {
  let r = n ? 1 : 2,
    i = -1
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let o = e[s]
      typeof o == 'number'
        ? (i = o)
        : i === r &&
          (Array.isArray(t) || (t = t === void 0 ? [] : ['', t]),
          _l(t, o, n ? !0 : e[++s]))
    }
  return t === void 0 ? null : t
}
function Mb(t, e, n) {
  if (n == null || n === '') return tt
  let r = [],
    i = Zo(n)
  if (Array.isArray(i)) for (let s = 0; s < i.length; s++) t(r, i[s], !0)
  else if (typeof i == 'object')
    for (let s in i) i.hasOwnProperty(s) && t(r, s, i[s])
  else typeof i == 'string' && e(r, i)
  return r
}
function Pb(t, e, n) {
  let r = String(e)
  r !== '' && !r.includes(' ') && _l(t, r, n)
}
function Ob(t, e, n, r, i, s, o, c) {
  i === mn && (i = tt)
  let u = 0,
    d = 0,
    f = 0 < i.length ? i[0] : null,
    m = 0 < s.length ? s[0] : null
  for (; f !== null || m !== null; ) {
    let _ = u < i.length ? i[u + 1] : void 0,
      D = d < s.length ? s[d + 1] : void 0,
      S = null,
      N
    f === m
      ? ((u += 2), (d += 2), _ !== D && ((S = m), (N = D)))
      : m === null || (f !== null && f < m)
        ? ((u += 2), (S = f))
        : ((d += 2), (S = m), (N = D)),
      S !== null && kb(t, e, n, r, S, N, o, c),
      (f = u < i.length ? i[u] : null),
      (m = d < s.length ? s[d] : null)
  }
}
function kb(t, e, n, r, i, s, o, c) {
  if (!(e.type & 3)) return
  let u = t.data,
    d = u[c + 1],
    f = yb(d) ? ig(u, e, n, i, Sr(d), o) : void 0
  if (!Vo(f)) {
    Vo(s) || (mb(d) && (s = ig(u, null, n, i, c, o)))
    let m = Og(zn(), n)
    HD(r, o, m, i, s)
  }
}
function ig(t, e, n, r, i, s) {
  let o = e === null,
    c
  for (; i > 0; ) {
    let u = t[i],
      d = Array.isArray(u),
      f = d ? u[1] : u,
      m = f === null,
      _ = n[i + 1]
    _ === mn && (_ = m ? tt : void 0)
    let D = m ? ou(_, r) : f === r ? _ : void 0
    if ((d && !Vo(D) && (D = ou(u, r)), Vo(D) && ((c = D), o))) return c
    let S = t[i + 1]
    i = o ? jn(S) : Sr(S)
  }
  if (e !== null) {
    let u = s ? e.residualClasses : e.residualStyles
    u != null && (c = ou(u, r))
  }
  return c
}
function Vo(t) {
  return t !== void 0
}
function rv(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0
}
var Yu = class {
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
function pu(t, e, n, r, i) {
  return t === n && Object.is(e, r) ? 1 : Object.is(i(t, e), i(n, r)) ? -1 : 0
}
function Fb(t, e, n) {
  let r,
    i,
    s = 0,
    o = t.length - 1
  if (Array.isArray(e)) {
    let c = e.length - 1
    for (; s <= o && s <= c; ) {
      let u = t.at(s),
        d = e[s],
        f = pu(s, u, s, d, n)
      if (f !== 0) {
        f < 0 && t.updateValue(s, d), s++
        continue
      }
      let m = t.at(o),
        _ = e[c],
        D = pu(o, m, c, _, n)
      if (D !== 0) {
        D < 0 && t.updateValue(o, _), o--, c--
        continue
      }
      let S = n(s, u),
        N = n(o, m),
        R = n(s, d)
      if (Object.is(R, N)) {
        let k = n(c, _)
        Object.is(k, S)
          ? (t.swap(s, o), t.updateValue(o, _), c--, o--)
          : t.move(o, s),
          t.updateValue(s, d),
          s++
        continue
      }
      if (((r ??= new Uo()), (i ??= og(t, s, o, n)), Ju(t, r, s, R)))
        t.updateValue(s, d), s++, o++
      else if (i.has(R)) r.set(S, t.detach(s)), o--
      else {
        let k = t.create(s, e[s])
        t.attach(s, k), s++, o++
      }
    }
    for (; s <= c; ) sg(t, r, n, s, e[s]), s++
  } else if (e != null) {
    let c = e[Symbol.iterator](),
      u = c.next()
    for (; !u.done && s <= o; ) {
      let d = t.at(s),
        f = u.value,
        m = pu(s, d, s, f, n)
      if (m !== 0) m < 0 && t.updateValue(s, f), s++, (u = c.next())
      else {
        ;(r ??= new Uo()), (i ??= og(t, s, o, n))
        let _ = n(s, f)
        if (Ju(t, r, s, _)) t.updateValue(s, f), s++, o++, (u = c.next())
        else if (!i.has(_))
          t.attach(s, t.create(s, f)), s++, o++, (u = c.next())
        else {
          let D = n(s, d)
          r.set(D, t.detach(s)), o--
        }
      }
    }
    for (; !u.done; ) sg(t, r, n, t.length, u.value), (u = c.next())
  }
  for (; s <= o; ) t.destroy(t.detach(o--))
  r?.forEach((c) => {
    t.destroy(c)
  })
}
function Ju(t, e, n, r) {
  return e !== void 0 && e.has(r)
    ? (t.attach(n, e.get(r)), e.delete(r), !0)
    : !1
}
function sg(t, e, n, r, i) {
  if (Ju(t, e, r, n(r, i))) t.updateValue(r, i)
  else {
    let s = t.create(r, i)
    t.attach(r, s)
  }
}
function og(t, e, n, r) {
  let i = new Set()
  for (let s = e; s <= n; s++) i.add(r(s, t.at(s)))
  return i
}
var Uo = class {
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
function Tt(t, e, n) {
  ra('NgControlFlow')
  let r = he(),
    i = Ko(),
    s = tl(r, it + t),
    o = 0
  if (dn(r, i, e)) {
    let c = Ae(null)
    try {
      if ((Jy(s, o), e !== -1)) {
        let u = nl(r[Q], it + e),
          d = Bl(s, u.tView.ssrId),
          f = $l(r, u, n, { dehydratedView: d })
        ql(s, f, o, Hl(u, d))
      }
    } finally {
      Ae(c)
    }
  } else {
    let c = Yy(s, o)
    c !== void 0 && (c[Ve] = n)
  }
}
var Zu = class {
  constructor(e, n, r) {
    ;(this.lContainer = e), (this.$implicit = n), (this.$index = r)
  }
  get $count() {
    return this.lContainer.length - Je
  }
}
function iv(t, e) {
  return e
}
var Xu = class {
  constructor(e, n, r) {
    ;(this.hasEmptyBlock = e), (this.trackByFn = n), (this.liveCollection = r)
  }
}
function ia(t, e, n, r, i, s, o, c, u, d, f, m, _) {
  ra('NgControlFlow')
  let D = u !== void 0,
    S = he(),
    N = c ? o.bind(S[Et][Ve]) : o,
    R = new Xu(D, N)
  ;(S[it + t] = R), Ze(t + 1, e, n, r, i, s), D && Ze(t + 2, u, d, f, m, _)
}
var el = class extends Yu {
  constructor(e, n, r) {
    super(),
      (this.lContainer = e),
      (this.hostLView = n),
      (this.templateTNode = r),
      (this.needsIndexUpdate = !1)
  }
  get length() {
    return this.lContainer.length - Je
  }
  at(e) {
    return this.getLView(e)[Ve].$implicit
  }
  attach(e, n) {
    let r = n[Oi]
    ;(this.needsIndexUpdate ||= e !== this.length),
      ql(this.lContainer, n, e, Hl(this.templateTNode, r))
  }
  detach(e) {
    return (
      (this.needsIndexUpdate ||= e !== this.length - 1), Lb(this.lContainer, e)
    )
  }
  create(e, n) {
    let r = Bl(this.lContainer, this.templateTNode.tView.ssrId)
    return $l(
      this.hostLView,
      this.templateTNode,
      new Zu(this.lContainer, n, e),
      { dehydratedView: r }
    )
  }
  destroy(e) {
    Al(e[Q], e)
  }
  updateValue(e, n) {
    this.getLView(e)[Ve].$implicit = n
  }
  reset() {
    this.needsIndexUpdate = !1
  }
  updateIndexes() {
    if (this.needsIndexUpdate)
      for (let e = 0; e < this.length; e++) this.getLView(e)[Ve].$index = e
  }
  getLView(e) {
    return Vb(this.lContainer, e)
  }
}
function sa(t) {
  let e = Ae(null),
    n = zn()
  try {
    let r = he(),
      i = r[Q],
      s = r[n]
    if (s.liveCollection === void 0) {
      let c = n + 1,
        u = tl(r, c),
        d = nl(i, c)
      s.liveCollection = new el(u, r, d)
    } else s.liveCollection.reset()
    let o = s.liveCollection
    if ((Fb(o, t, s.trackByFn), o.updateIndexes(), s.hasEmptyBlock)) {
      let c = Ko(),
        u = o.length === 0
      if (dn(r, c, u)) {
        let d = n + 2,
          f = tl(r, d)
        if (u) {
          let m = nl(i, d),
            _ = Bl(f, m.tView.ssrId),
            D = $l(r, m, void 0, { dehydratedView: _ })
          ql(f, D, 0, Hl(m, _))
        } else Jy(f, 0)
      }
    }
  } finally {
    Ae(e)
  }
}
function tl(t, e) {
  return t[e]
}
function Lb(t, e) {
  return Cl(t, e)
}
function Vb(t, e) {
  return Yy(t, e)
}
function nl(t, e) {
  return ll(t, e)
}
function Ub(t, e, n, r, i, s) {
  let o = e.consts,
    c = xo(o, i),
    u = na(e, t, 2, r, c)
  return (
    jy(e, n, u, xo(o, s)),
    u.attrs !== null && $u(u, u.attrs, !1),
    u.mergedAttrs !== null && $u(u, u.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, u),
    u
  )
}
function $(t, e, n, r) {
  let i = he(),
    s = Wt(),
    o = it + t,
    c = i[Ge],
    u = s.firstCreatePass ? Ub(o, s, i, e, n, r) : s.data[o],
    d = jb(s, i, u, c, e, t)
  i[o] = d
  let f = ul(u)
  return (
    Ki(u, !0),
    Ey(c, d, u),
    (u.flags & 32) !== 32 && ml() && Sl(s, i, d, u),
    wT() === 0 && Un(d, i),
    ET(),
    f && (Ly(s, i, u), Fy(s, u, i)),
    r !== null && Vy(i, u),
    $
  )
}
function W() {
  let t = Kt()
  Ug() ? ST() : ((t = t.parent), Ki(t, !1))
  let e = t
  bT(e) && CT(), TT()
  let n = Wt()
  return (
    n.firstCreatePass && (yl(n, t), Ag(t) && n.queries.elementEnd(t)),
    e.classesWithoutHost != null &&
      HT(e) &&
      Qu(n, e, he(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null &&
      qT(e) &&
      Qu(n, e, he(), e.stylesWithoutHost, !1),
    W
  )
}
function we(t, e, n, r) {
  return $(t, e, n, r), W(), we
}
var jb = (t, e, n, r, i, s) => (gl(!0), my(r, i, UT()))
function dt() {
  return he()
}
var jo = 'en-US'
var Bb = jo
function $b(t) {
  PE(t, 'Expected localeId to be defined'),
    typeof t == 'string' && (Bb = t.toLowerCase().replace(/_/g, '-'))
}
function oa(t) {
  return !!t && typeof t.then == 'function'
}
function zl(t) {
  return !!t && typeof t.subscribe == 'function'
}
function Ee(t, e, n, r) {
  let i = he(),
    s = Wt(),
    o = Kt()
  return qb(s, i, i[Ge], o, t, e, r), Ee
}
function Hb(t, e, n, r) {
  let i = t.cleanup
  if (i != null)
    for (let s = 0; s < i.length - 1; s += 2) {
      let o = i[s]
      if (o === n && i[s + 1] === r) {
        let c = e[ki],
          u = i[s + 2]
        return c.length > u ? c[u] : null
      }
      typeof o == 'string' && (s += 2)
    }
  return null
}
function qb(t, e, n, r, i, s, o) {
  let c = ul(r),
    d = t.firstCreatePass && O0(t),
    f = e[Ve],
    m = P0(e),
    _ = !0
  if (r.type & 3 || o) {
    let N = Mt(r, e),
      R = o ? o(N) : N,
      k = m.length,
      B = o ? (K) => o(Ht(K[r.index])) : r.index,
      q = null
    if ((!o && c && (q = Hb(t, e, i, r.index)), q !== null)) {
      let K = q.__ngLastListenerFn__ || q
      ;(K.__ngNextListenerFn__ = s), (q.__ngLastListenerFn__ = s), (_ = !1)
    } else {
      s = cg(r, e, f, s, !1)
      let K = n.listen(R, i, s)
      m.push(s, K), d && d.push(i, B, k, k + 1)
    }
  } else s = cg(r, e, f, s, !1)
  let D = r.outputs,
    S
  if (_ && D !== null && (S = D[i])) {
    let N = S.length
    if (N)
      for (let R = 0; R < N; R += 2) {
        let k = S[R],
          B = S[R + 1],
          ce = e[k][B].subscribe(s),
          z = m.length
        m.push(s, ce), d && d.push(i, r.index, z, -(z + 1))
      }
  }
}
function ag(t, e, n, r) {
  try {
    return At(6, e, n), n(r) !== !1
  } catch (i) {
    return qy(t, i), !1
  } finally {
    At(7, e, n)
  }
}
function cg(t, e, n, r, i) {
  return function s(o) {
    if (o === Function) return r
    let c = t.componentOffset > -1 ? hn(t.index, e) : e
    Vl(c)
    let u = ag(e, n, r, o),
      d = s.__ngNextListenerFn__
    for (; d; ) (u = ag(e, n, d, o) && u), (d = d.__ngNextListenerFn__)
    return i && u === !1 && o.preventDefault(), u
  }
}
function Me(t = 1) {
  return FT(t)
}
function zb(t, e, n, r) {
  n >= t.data.length && ((t.data[n] = null), (t.blueprint[n] = null)),
    (e[n] = r)
}
function Ke(t, e = '') {
  let n = he(),
    r = Wt(),
    i = t + it,
    s = r.firstCreatePass ? na(r, i, 1, e, null) : r.data[i],
    o = Gb(r, n, s, e, t)
  ;(n[i] = o), ml() && Sl(r, n, o, s), Ki(s, !1)
}
var Gb = (t, e, n, r, i) => (gl(!0), bD(e[Ge], r))
function Gl(t, e, n) {
  let r = he(),
    i = pb(r, t, e, n)
  return i !== mn && k0(r, zn(), i), Gl
}
var Rr = class {}
var Bo = class extends Rr {
  constructor(e) {
    super(),
      (this.componentFactoryResolver = new Hu(this)),
      (this.instance = null)
    let n = new Oo(
      [
        ...e.providers,
        { provide: Rr, useValue: this },
        { provide: Ml, useValue: this.componentFactoryResolver },
      ],
      e.parent || wl(),
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
function Wb(t, e, n = null) {
  return new Bo({
    providers: t,
    parent: e,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector
}
var Kb = (() => {
  let e = class e {
    constructor(r) {
      ;(this._injector = r), (this.cachedInjectors = new Map())
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null
      if (!this.cachedInjectors.has(r)) {
        let i = uy(!1, r.type),
          s =
            i.length > 0
              ? Wb([i], this._injector, `Standalone[${r.type.name}]`)
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
  e.ɵprov = pe({
    token: e,
    providedIn: 'environment',
    factory: () => new e(ne(Vn)),
  })
  let t = e
  return t
})()
function Te(t) {
  ra('NgStandalone'),
    (t.getStandaloneInjector = (e) =>
      e.get(Kb).getOrCreateStandaloneInjector(t))
}
function sv(t, e, n, r, i) {
  return Yb(he(), jg(), t, e, n, r, i)
}
function ov(t, e) {
  let n = t[e]
  return n === mn ? void 0 : n
}
function Qb(t, e, n, r, i, s) {
  let o = e + n
  return dn(t, o, i) ? Zy(t, o + 1, s ? r.call(s, i) : r(i)) : ov(t, o + 1)
}
function Yb(t, e, n, r, i, s, o) {
  let c = e + n
  return lb(t, c, i, s)
    ? Zy(t, c + 2, o ? r.call(o, i, s) : r(i, s))
    : ov(t, c + 2)
}
function av(t, e) {
  let n = Wt(),
    r,
    i = t + it
  n.firstCreatePass
    ? ((r = Jb(e, n.pipeRegistry)),
      (n.data[i] = r),
      r.onDestroy && (n.destroyHooks ??= []).push(i, r.onDestroy))
    : (r = n.data[i])
  let s = r.factory || (r.factory = Ar(r.type, !0)),
    o,
    c = ct(Nr)
  try {
    let u = No(!1),
      d = s()
    return No(u), zb(n, he(), i, d), d
  } finally {
    ct(c)
  }
}
function Jb(t, e) {
  if (e)
    for (let n = e.length - 1; n >= 0; n--) {
      let r = e[n]
      if (t === r.name) return r
    }
}
function cv(t, e, n) {
  let r = t + it,
    i = he(),
    s = yT(i, r)
  return Zb(i, r) ? Qb(i, jg(), e, s.transform, n, s) : s.transform(n)
}
function Zb(t, e) {
  return t[Q].data[e].pure
}
var Bn = class {
    constructor(e) {
      this.full = e
      let n = e.split('.')
      ;(this.major = n[0]),
        (this.minor = n[1]),
        (this.patch = n.slice(2).join('.'))
    }
  },
  uv = new Bn('17.1.0')
var lv = (() => {
  let e = class e {
    constructor() {
      ;(this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new bi(!1))
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
    (e.ɵprov = pe({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
var dv = new oe('')
var Xb = new oe('Application Initializer'),
  hv = (() => {
    let e = class e {
      constructor() {
        ;(this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, i) => {
            ;(this.resolve = r), (this.reject = i)
          })),
          (this.appInits = ve(Xb, { optional: !0 }) ?? [])
      }
      runInitializers() {
        if (this.initialized) return
        let r = []
        for (let s of this.appInits) {
          let o = s()
          if (oa(o)) r.push(o)
          else if (zl(o)) {
            let c = new Promise((u, d) => {
              o.subscribe({ complete: u, error: d })
            })
            r.push(c)
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
      (e.ɵprov = pe({ token: e, factory: e.ɵfac, providedIn: 'root' }))
    let t = e
    return t
  })(),
  eC = new oe('appBootstrapListener')
function tC() {
  sm(() => {
    throw new se(600, !1)
  })
}
function nC(t) {
  return t.isBoundToModule
}
function rC(t, e, n) {
  try {
    let r = n()
    return oa(r)
      ? r.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i)
        })
      : r
  } catch (r) {
    throw (e.runOutsideAngular(() => t.handleError(r)), r)
  }
}
var Wl = (() => {
  let e = class e {
    constructor() {
      ;(this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = ve(xy)),
        (this.afterRenderEffectManager = ve(Qy)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = ve(lv).hasPendingTasks.pipe(ze((r) => !r))),
        (this._injector = ve(Vn))
    }
    get destroyed() {
      return this._destroyed
    }
    get injector() {
      return this._injector
    }
    bootstrap(r, i) {
      let s = r instanceof Fo
      if (!this._injector.get(hv).done) {
        let D = !s && aT(r),
          S = !1
        throw new se(405, S)
      }
      let c
      s ? (c = r) : (c = this._injector.get(Ml).resolveComponentFactory(r)),
        this.componentTypes.push(c.componentType)
      let u = nC(c) ? void 0 : this._injector.get(Rr),
        d = i || c.selector,
        f = c.create(fn.NULL, [], d, u),
        m = f.location.nativeElement,
        _ = f.injector.get(dv, null)
      return (
        _?.registerApplication(m),
        f.onDestroy(() => {
          this.detachView(f.hostView),
            mu(this.components, f),
            _?.unregisterApplication(m)
        }),
        this._loadComponent(f),
        f
      )
    }
    tick() {
      if (this._runningTick) throw new se(101, !1)
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
      mu(this._views, i), i.detachFromAppRef()
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r)
      let i = this._injector.get(eC, [])
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
      return this._destroyListeners.push(r), () => mu(this._destroyListeners, r)
    }
    destroy() {
      if (this._destroyed) throw new se(406, !1)
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
    (e.ɵprov = pe({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
function mu(t, e) {
  let n = t.indexOf(e)
  n > -1 && t.splice(n, 1)
}
var iC = (() => {
  let e = class e {
    constructor() {
      ;(this.zone = ve(ge)), (this.applicationRef = ve(Wl))
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
    (e.ɵprov = pe({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
function sC(t) {
  return [
    { provide: ge, useFactory: t },
    {
      provide: Hi,
      multi: !0,
      useFactory: () => {
        let e = ve(iC, { optional: !0 })
        return () => e.initialize()
      },
    },
    {
      provide: Hi,
      multi: !0,
      useFactory: () => {
        let e = ve(uC)
        return () => {
          e.initialize()
        }
      },
    },
    { provide: xy, useFactory: oC },
  ]
}
function oC() {
  let t = ve(ge),
    e = ve(zt)
  return (n) => t.runOutsideAngular(() => e.handleError(n))
}
function aC(t) {
  let e = sC(() => new ge(cC(t)))
  return cy([[], e])
}
function cC(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  }
}
var uC = (() => {
  let e = class e {
    constructor() {
      ;(this.subscription = new Le()),
        (this.initialized = !1),
        (this.zone = ve(ge)),
        (this.pendingTasks = ve(lv))
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
              ge.assertNotInAngularZone(),
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
            ge.assertInAngularZone(), (r ??= this.pendingTasks.add())
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
    (e.ɵprov = pe({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
function lC() {
  return (typeof $localize < 'u' && $localize.locale) || jo
}
var Kl = new oe('LocaleId', {
  providedIn: 'root',
  factory: () => ve(Kl, J.Optional | J.SkipSelf) || lC(),
})
var fv = new oe('PlatformDestroyListeners')
var Ao = null
function dC(t = [], e) {
  return fn.create({
    name: e,
    providers: [
      { provide: Yo, useValue: 'platform' },
      { provide: fv, useValue: new Set([() => (Ao = null)]) },
      ...t,
    ],
  })
}
function hC(t = []) {
  if (Ao) return Ao
  let e = dC(t)
  return (Ao = e), tC(), fC(e), e
}
function fC(t) {
  t.get(Tl, null)?.forEach((n) => n())
}
function pv(t) {
  try {
    let { rootComponent: e, appProviders: n, platformProviders: r } = t,
      i = hC(r),
      s = [aC(), ...(n || [])],
      c = new Bo({
        providers: s,
        parent: i,
        debugName: '',
        runEnvironmentInitializers: !1,
      }).injector,
      u = c.get(ge)
    return u.run(() => {
      c.resolveInjectorInitializers()
      let d = c.get(zt, null),
        f
      u.runOutsideAngular(() => {
        f = u.onError.subscribe({
          next: (D) => {
            d.handleError(D)
          },
        })
      })
      let m = () => c.destroy(),
        _ = i.get(fv)
      return (
        _.add(m),
        c.onDestroy(() => {
          f.unsubscribe(), _.delete(m)
        }),
        rC(d, u, () => {
          let D = c.get(hv)
          return (
            D.runInitializers(),
            D.donePromise.then(() => {
              let S = c.get(Kl, jo)
              $b(S || jo)
              let N = c.get(Wl)
              return e !== void 0 && N.bootstrap(e), N
            })
          )
        })
      )
    })
  } catch (e) {
    return Promise.reject(e)
  }
}
var Yl = null
function Xl() {
  return Yl
}
function gv(t) {
  Yl || (Yl = t)
}
var aa = class {},
  gn = new oe('DocumentToken')
function yv(t, e) {
  e = encodeURIComponent(e)
  for (let n of t.split(';')) {
    let r = n.indexOf('='),
      [i, s] = r == -1 ? [n, ''] : [n.slice(0, r), n.slice(r + 1)]
    if (i.trim() === e) return decodeURIComponent(s)
  }
  return null
}
var Ql = /\s+/,
  mv = [],
  vv = (() => {
    let e = class e {
      constructor(r, i) {
        ;(this._ngEl = r),
          (this._renderer = i),
          (this.initialClasses = mv),
          (this.stateMap = new Map())
      }
      set klass(r) {
        this.initialClasses = r != null ? r.trim().split(Ql) : mv
      }
      set ngClass(r) {
        this.rawClass = typeof r == 'string' ? r.trim().split(Ql) : r
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
            r.split(Ql).forEach((s) => {
              i
                ? this._renderer.addClass(this._ngEl.nativeElement, s)
                : this._renderer.removeClass(this._ngEl.nativeElement, s)
            })
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(Nr(ea), Nr(Pl))
    }),
      (e.ɵdir = _g({
        type: e,
        selectors: [['', 'ngClass', '']],
        inputs: { klass: [ln.None, 'class', 'klass'], ngClass: 'ngClass' },
        standalone: !0,
      }))
    let t = e
    return t
  })()
function pC(t, e) {
  return new se(2100, !1)
}
var Jl = class {
    createSubscription(e, n) {
      return Ol(() =>
        e.subscribe({
          next: n,
          error: (r) => {
            throw r
          },
        })
      )
    }
    dispose(e) {
      Ol(() => e.unsubscribe())
    }
  },
  Zl = class {
    createSubscription(e, n) {
      return e.then(n, (r) => {
        throw r
      })
    }
    dispose(e) {}
  },
  mC = new Zl(),
  gC = new Jl(),
  _v = (() => {
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
        if (oa(r)) return mC
        if (zl(r)) return gC
        throw pC(e, r)
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
      return new (i || e)(Nr(Ky, 16))
    }),
      (e.ɵpipe = Ig({ name: 'async', type: e, pure: !1, standalone: !0 }))
    let t = e
    return t
  })()
var Gn = (() => {
    let e = class e {}
    ;(e.ɵfac = function (i) {
      return new (i || e)()
    }),
      (e.ɵmod = Hn({ type: e })),
      (e.ɵinj = $n({}))
    let t = e
    return t
  })(),
  Iv = 'browser',
  yC = 'server'
function ed(t) {
  return t === yC
}
var ca = class {}
var rd = class extends aa {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0)
    }
  },
  id = class t extends rd {
    static makeCurrent() {
      gv(new t())
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
      let n = _C()
      return n == null ? null : IC(n)
    }
    resetBaseElement() {
      Ji = null
    }
    getUserAgent() {
      return window.navigator.userAgent
    }
    getCookie(e) {
      return yv(document.cookie, e)
    }
  },
  Ji = null
function _C() {
  return (
    (Ji = Ji || document.querySelector('base')),
    Ji ? Ji.getAttribute('href') : null
  )
}
function IC(t) {
  return new URL(t, document.baseURI).pathname
}
var wC = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest()
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)()
    }),
      (e.ɵprov = pe({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  sd = new oe('EventManagerPlugins'),
  bv = (() => {
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
          throw new se(5101, !1)
        return this._eventNameToPlugin.set(r, i), i
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(ne(sd), ne(ge))
    }),
      (e.ɵprov = pe({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  ua = class {
    constructor(e) {
      this._doc = e
    }
  },
  td = 'ng-app-id',
  Cv = (() => {
    let e = class e {
      constructor(r, i, s, o = {}) {
        ;(this.doc = r),
          (this.appId = i),
          (this.nonce = s),
          (this.platformId = o),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = ed(o)),
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
        let r = this.doc.head?.querySelectorAll(`style[${td}="${this.appId}"]`)
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
        if (o?.parentNode === r) return s.delete(i), o.removeAttribute(td), o
        {
          let c = this.doc.createElement('style')
          return (
            this.nonce && c.setAttribute('nonce', this.nonce),
            (c.textContent = i),
            this.platformIsServer && c.setAttribute(td, this.appId),
            r.appendChild(c),
            c
          )
        }
      }
      addStyleToHost(r, i) {
        let s = this.getStyleElement(r, i),
          o = this.styleRef,
          c = o.get(i)?.elements
        c ? c.push(s) : o.set(i, { elements: [s], usage: 1 })
      }
      resetHostNodes() {
        let r = this.hostNodes
        r.clear(), r.add(this.doc.head)
      }
    }
    ;(e.ɵfac = function (i) {
      return new (i || e)(ne(gn), ne(El), ne(Dl, 8), ne(pn))
    }),
      (e.ɵprov = pe({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  nd = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/MathML/',
  },
  ad = /%COMP%/g,
  Av = '%COMP%',
  EC = `_nghost-${Av}`,
  TC = `_ngcontent-${Av}`,
  DC = !0,
  bC = new oe('RemoveStylesOnCompDestroy', {
    providedIn: 'root',
    factory: () => DC,
  })
function CC(t) {
  return TC.replace(ad, t)
}
function AC(t) {
  return EC.replace(ad, t)
}
function Sv(t, e) {
  return e.map((n) => n.replace(ad, t))
}
var Ev = (() => {
    let e = class e {
      constructor(r, i, s, o, c, u, d, f = null) {
        ;(this.eventManager = r),
          (this.sharedStylesHost = i),
          (this.appId = s),
          (this.removeStylesOnCompDestroy = o),
          (this.doc = c),
          (this.platformId = u),
          (this.ngZone = d),
          (this.nonce = f),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = ed(u)),
          (this.defaultRenderer = new Zi(r, c, d, this.platformIsServer))
      }
      createRenderer(r, i) {
        if (!r || !i) return this.defaultRenderer
        this.platformIsServer &&
          i.encapsulation === Rt.ShadowDom &&
          (i = $t(Ct({}, i), { encapsulation: Rt.Emulated }))
        let s = this.getOrCreateRenderer(r, i)
        return (
          s instanceof la
            ? s.applyToHost(r)
            : s instanceof Xi && s.applyStyles(),
          s
        )
      }
      getOrCreateRenderer(r, i) {
        let s = this.rendererByCompId,
          o = s.get(i.id)
        if (!o) {
          let c = this.doc,
            u = this.ngZone,
            d = this.eventManager,
            f = this.sharedStylesHost,
            m = this.removeStylesOnCompDestroy,
            _ = this.platformIsServer
          switch (i.encapsulation) {
            case Rt.Emulated:
              o = new la(d, f, i, this.appId, m, c, u, _)
              break
            case Rt.ShadowDom:
              return new od(d, f, r, i, c, u, this.nonce, _)
            default:
              o = new Xi(d, f, i, m, c, u, _)
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
        ne(bv),
        ne(Cv),
        ne(El),
        ne(bC),
        ne(gn),
        ne(pn),
        ne(ge),
        ne(Dl)
      )
    }),
      (e.ɵprov = pe({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  Zi = class {
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
        ? this.doc.createElementNS(nd[n] || n, e)
        : this.doc.createElement(e)
    }
    createComment(e) {
      return this.doc.createComment(e)
    }
    createText(e) {
      return this.doc.createTextNode(e)
    }
    appendChild(e, n) {
      ;(Tv(e) ? e.content : e).appendChild(n)
    }
    insertBefore(e, n, r) {
      e && (Tv(e) ? e.content : e).insertBefore(n, r)
    }
    removeChild(e, n) {
      e && e.removeChild(n)
    }
    selectRootElement(e, n) {
      let r = typeof e == 'string' ? this.doc.querySelector(e) : e
      if (!r) throw new se(-5104, !1)
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
        let s = nd[i]
        s ? e.setAttributeNS(s, n, r) : e.setAttribute(n, r)
      } else e.setAttribute(n, r)
    }
    removeAttribute(e, n, r) {
      if (r) {
        let i = nd[r]
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
      i & (qt.DashCase | qt.Important)
        ? e.style.setProperty(n, r, i & qt.Important ? 'important' : '')
        : (e.style[n] = r)
    }
    removeStyle(e, n, r) {
      r & qt.DashCase ? e.style.removeProperty(n) : (e.style[n] = '')
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
        ((e = Xl().getGlobalEventTarget(this.doc, e)), !e)
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
function Tv(t) {
  return t.tagName === 'TEMPLATE' && t.content !== void 0
}
var od = class extends Zi {
    constructor(e, n, r, i, s, o, c, u) {
      super(e, s, o, u),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot)
      let d = Sv(i.id, i.styles)
      for (let f of d) {
        let m = document.createElement('style')
        c && m.setAttribute('nonce', c),
          (m.textContent = f),
          this.shadowRoot.appendChild(m)
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
  Xi = class extends Zi {
    constructor(e, n, r, i, s, o, c, u) {
      super(e, s, o, c),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = i),
        (this.styles = u ? Sv(u, r.styles) : r.styles)
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles)
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles)
    }
  },
  la = class extends Xi {
    constructor(e, n, r, i, s, o, c, u) {
      let d = i + '-' + r.id
      super(e, n, r, s, o, c, u, d),
        (this.contentAttr = CC(d)),
        (this.hostAttr = AC(d))
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, '')
    }
    createElement(e, n) {
      let r = super.createElement(e, n)
      return super.setAttribute(r, this.contentAttr, ''), r
    }
  },
  SC = (() => {
    let e = class e extends ua {
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
      return new (i || e)(ne(gn))
    }),
      (e.ɵprov = pe({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })(),
  Dv = ['alt', 'control', 'meta', 'shift'],
  RC = {
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
  xC = {
    alt: (t) => t.altKey,
    control: (t) => t.ctrlKey,
    meta: (t) => t.metaKey,
    shift: (t) => t.shiftKey,
  },
  NC = (() => {
    let e = class e extends ua {
      constructor(r) {
        super(r)
      }
      supports(r) {
        return e.parseEventName(r) != null
      }
      addEventListener(r, i, s) {
        let o = e.parseEventName(i),
          c = e.eventCallback(o.fullKey, s, this.manager.getZone())
        return this.manager
          .getZone()
          .runOutsideAngular(() => Xl().onAndCancel(r, o.domEventName, c))
      }
      static parseEventName(r) {
        let i = r.toLowerCase().split('.'),
          s = i.shift()
        if (i.length === 0 || !(s === 'keydown' || s === 'keyup')) return null
        let o = e._normalizeKey(i.pop()),
          c = '',
          u = i.indexOf('code')
        if (
          (u > -1 && (i.splice(u, 1), (c = 'code.')),
          Dv.forEach((f) => {
            let m = i.indexOf(f)
            m > -1 && (i.splice(m, 1), (c += f + '.'))
          }),
          (c += o),
          i.length != 0 || o.length === 0)
        )
          return null
        let d = {}
        return (d.domEventName = s), (d.fullKey = c), d
      }
      static matchEventFullKeyCode(r, i) {
        let s = RC[r.key] || r.key,
          o = ''
        return (
          i.indexOf('code.') > -1 && ((s = r.code), (o = 'code.')),
          s == null || !s
            ? !1
            : ((s = s.toLowerCase()),
              s === ' ' ? (s = 'space') : s === '.' && (s = 'dot'),
              Dv.forEach((c) => {
                if (c !== s) {
                  let u = xC[c]
                  u(r) && (o += c + '.')
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
      return new (i || e)(ne(gn))
    }),
      (e.ɵprov = pe({ token: e, factory: e.ɵfac }))
    let t = e
    return t
  })()
function Rv(t, e) {
  return pv(Ct({ rootComponent: t }, MC(e)))
}
function MC(t) {
  return {
    appProviders: [...LC, ...(t?.providers ?? [])],
    platformProviders: FC,
  }
}
function PC() {
  id.makeCurrent()
}
function OC() {
  return new zt()
}
function kC() {
  return hy(document), document
}
var FC = [
  { provide: pn, useValue: Iv },
  { provide: Tl, useValue: PC, multi: !0 },
  { provide: gn, useFactory: kC, deps: [] },
]
var LC = [
  { provide: Yo, useValue: 'root' },
  { provide: zt, useFactory: OC, deps: [] },
  { provide: sd, useClass: SC, multi: !0, deps: [gn, ge, pn] },
  { provide: sd, useClass: NC, multi: !0, deps: [gn] },
  Ev,
  Cv,
  bv,
  { provide: qi, useExisting: Ev },
  { provide: ca, useClass: wC, deps: [] },
  [],
]
var Nv = function (t) {
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
  VC = function (t) {
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
          c = t[n++],
          u =
            (((i & 7) << 18) | ((s & 63) << 12) | ((o & 63) << 6) | (c & 63)) -
            65536
        ;(e[r++] = String.fromCharCode(55296 + (u >> 10))),
          (e[r++] = String.fromCharCode(56320 + (u & 1023)))
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
  Mv = {
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
          c = o ? t[i + 1] : 0,
          u = i + 2 < t.length,
          d = u ? t[i + 2] : 0,
          f = s >> 2,
          m = ((s & 3) << 4) | (c >> 4),
          _ = ((c & 15) << 2) | (d >> 6),
          D = d & 63
        u || ((D = 64), o || (_ = 64)), r.push(n[f], n[m], n[_], n[D])
      }
      return r.join('')
    },
    encodeString(t, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? btoa(t)
        : this.encodeByteArray(Nv(t), e)
    },
    decodeString(t, e) {
      return this.HAS_NATIVE_SUPPORT && !e
        ? atob(t)
        : VC(this.decodeStringToByteArray(t, e))
    },
    decodeStringToByteArray(t, e) {
      this.init_()
      let n = e ? this.charToByteMapWebSafe_ : this.charToByteMap_,
        r = []
      for (let i = 0; i < t.length; ) {
        let s = n[t.charAt(i++)],
          c = i < t.length ? n[t.charAt(i)] : 0
        ++i
        let d = i < t.length ? n[t.charAt(i)] : 64
        ++i
        let m = i < t.length ? n[t.charAt(i)] : 64
        if ((++i, s == null || c == null || d == null || m == null))
          throw new ud()
        let _ = (s << 2) | (c >> 4)
        if ((r.push(_), d !== 64)) {
          let D = ((c << 4) & 240) | (d >> 2)
          if ((r.push(D), m !== 64)) {
            let S = ((d << 6) & 192) | m
            r.push(S)
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
  ud = class extends Error {
    constructor() {
      super(...arguments), (this.name = 'DecodeBase64StringError')
    }
  },
  UC = function (t) {
    let e = Nv(t)
    return Mv.encodeByteArray(e, !0)
  },
  es = function (t) {
    return UC(t).replace(/\./g, '')
  },
  dd = function (t) {
    try {
      return Mv.decodeString(t, !0)
    } catch (e) {
      console.error('base64Decode failed: ', e)
    }
    return null
  }
function jC() {
  if (typeof self < 'u') return self
  if (typeof window < 'u') return window
  if (typeof global < 'u') return global
  throw new Error('Unable to locate global object.')
}
var BC = () => jC().__FIREBASE_DEFAULTS__,
  $C = () => {
    if (typeof process > 'u' || typeof process.env > 'u') return
    let t = process.env.__FIREBASE_DEFAULTS__
    if (t) return JSON.parse(t)
  },
  HC = () => {
    if (typeof document > 'u') return
    let t
    try {
      t = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)
    } catch {
      return
    }
    let e = t && dd(t[1])
    return e && JSON.parse(e)
  },
  ha = () => {
    try {
      return BC() || $C() || HC()
    } catch (t) {
      console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`)
      return
    }
  },
  Pv = (t) => {
    var e, n
    return (n =
      (e = ha()) === null || e === void 0 ? void 0 : e.emulatorHosts) ===
      null || n === void 0
      ? void 0
      : n[t]
  },
  Ov = (t) => {
    let e = Pv(t)
    if (!e) return
    let n = e.lastIndexOf(':')
    if (n <= 0 || n + 1 === e.length)
      throw new Error(`Invalid host ${e} with no separate hostname and port!`)
    let r = parseInt(e.substring(n + 1), 10)
    return e[0] === '[' ? [e.substring(1, n - 1), r] : [e.substring(0, n), r]
  },
  hd = () => {
    var t
    return (t = ha()) === null || t === void 0 ? void 0 : t.config
  },
  kv = (t) => {
    var e
    return (e = ha()) === null || e === void 0 ? void 0 : e[`_${t}`]
  }
var da = class {
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
function Fv(t, e) {
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
  return [es(JSON.stringify(n)), es(JSON.stringify(o)), ''].join('.')
}
function ot() {
  return typeof navigator < 'u' && typeof navigator.userAgent == 'string'
    ? navigator.userAgent
    : ''
}
function Lv() {
  return (
    typeof window < 'u' &&
    !!(window.cordova || window.phonegap || window.PhoneGap) &&
    /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ot())
  )
}
function qC() {
  var t
  let e = (t = ha()) === null || t === void 0 ? void 0 : t.forceEnvironment
  if (e === 'node') return !0
  if (e === 'browser') return !1
  try {
    return Object.prototype.toString.call(global.process) === '[object process]'
  } catch {
    return !1
  }
}
function Vv() {
  return typeof navigator < 'u' && navigator.userAgent === 'Cloudflare-Workers'
}
function Uv() {
  let t =
    typeof chrome == 'object'
      ? chrome.runtime
      : typeof browser == 'object'
        ? browser.runtime
        : void 0
  return typeof t == 'object' && t.id !== void 0
}
function jv() {
  return typeof navigator == 'object' && navigator.product === 'ReactNative'
}
function Bv() {
  return (
    !qC() &&
    !!navigator.userAgent &&
    navigator.userAgent.includes('Safari') &&
    !navigator.userAgent.includes('Chrome')
  )
}
function fd() {
  try {
    return typeof indexedDB == 'object'
  } catch {
    return !1
  }
}
function $v() {
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
var zC = 'FirebaseError',
  ht = class t extends Error {
    constructor(e, n, r) {
      super(n),
        (this.code = e),
        (this.customData = r),
        (this.name = zC),
        Object.setPrototypeOf(this, t.prototype),
        Error.captureStackTrace &&
          Error.captureStackTrace(this, Yt.prototype.create)
    }
  },
  Yt = class {
    constructor(e, n, r) {
      ;(this.service = e), (this.serviceName = n), (this.errors = r)
    }
    create(e, ...n) {
      let r = n[0] || {},
        i = `${this.service}/${e}`,
        s = this.errors[e],
        o = s ? GC(s, r) : 'Error',
        c = `${this.serviceName}: ${o} (${i}).`
      return new ht(i, c, r)
    }
  }
function GC(t, e) {
  return t.replace(WC, (n, r) => {
    let i = e[r]
    return i != null ? String(i) : `<${r}?>`
  })
}
var WC = /\{\$([^}]+)}/g
function Mr(t, e) {
  if (t === e) return !0
  let n = Object.keys(t),
    r = Object.keys(e)
  for (let i of n) {
    if (!r.includes(i)) return !1
    let s = t[i],
      o = e[i]
    if (xv(s) && xv(o)) {
      if (!Mr(s, o)) return !1
    } else if (s !== o) return !1
  }
  for (let i of r) if (!n.includes(i)) return !1
  return !0
}
function xv(t) {
  return t !== null && typeof t == 'object'
}
function pd(t) {
  let e = []
  for (let [n, r] of Object.entries(t))
    Array.isArray(r)
      ? r.forEach((i) => {
          e.push(encodeURIComponent(n) + '=' + encodeURIComponent(i))
        })
      : e.push(encodeURIComponent(n) + '=' + encodeURIComponent(r))
  return e.length ? '&' + e.join('&') : ''
}
function Hv(t, e) {
  let n = new ld(t, e)
  return n.subscribe.bind(n)
}
var ld = class {
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
    KC(e, ['next', 'error', 'complete'])
      ? (i = e)
      : (i = { next: e, error: n, complete: r }),
      i.next === void 0 && (i.next = cd),
      i.error === void 0 && (i.error = cd),
      i.complete === void 0 && (i.complete = cd)
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
function KC(t, e) {
  if (typeof t != 'object' || t === null) return !1
  for (let n of e) if (n in t && typeof t[n] == 'function') return !0
  return !1
}
function cd() {}
var tF = 4 * 60 * 60 * 1e3
function yn(t) {
  return t && t._delegate ? t._delegate : t
}
var ft = class {
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
var Wn = '[DEFAULT]'
var md = class {
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
      let r = new da()
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
      if (YC(e))
        try {
          this.getOrInitializeService({ instanceIdentifier: Wn })
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
  clearInstance(e = Wn) {
    this.instancesDeferred.delete(e),
      this.instancesOptions.delete(e),
      this.instances.delete(e)
  }
  delete() {
    return A(this, null, function* () {
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
  isInitialized(e = Wn) {
    return this.instances.has(e)
  }
  getOptions(e = Wn) {
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
      let c = this.normalizeInstanceIdentifier(s)
      r === c && o.resolve(i)
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
        instanceIdentifier: QC(e),
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
  normalizeInstanceIdentifier(e = Wn) {
    return this.component ? (this.component.multipleInstances ? e : Wn) : e
  }
  shouldAutoInitialize() {
    return !!this.component && this.component.instantiationMode !== 'EXPLICIT'
  }
}
function QC(t) {
  return t === Wn ? void 0 : t
}
function YC(t) {
  return t.instantiationMode === 'EAGER'
}
var fa = class {
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
    let n = new md(e, this)
    return this.providers.set(e, n), n
  }
  getProviders() {
    return Array.from(this.providers.values())
  }
}
var JC = [],
  Y = (function (t) {
    return (
      (t[(t.DEBUG = 0)] = 'DEBUG'),
      (t[(t.VERBOSE = 1)] = 'VERBOSE'),
      (t[(t.INFO = 2)] = 'INFO'),
      (t[(t.WARN = 3)] = 'WARN'),
      (t[(t.ERROR = 4)] = 'ERROR'),
      (t[(t.SILENT = 5)] = 'SILENT'),
      t
    )
  })(Y || {}),
  ZC = {
    debug: Y.DEBUG,
    verbose: Y.VERBOSE,
    info: Y.INFO,
    warn: Y.WARN,
    error: Y.ERROR,
    silent: Y.SILENT,
  },
  XC = Y.INFO,
  eA = {
    [Y.DEBUG]: 'log',
    [Y.VERBOSE]: 'log',
    [Y.INFO]: 'info',
    [Y.WARN]: 'warn',
    [Y.ERROR]: 'error',
  },
  tA = (t, e, ...n) => {
    if (e < t.logLevel) return
    let r = new Date().toISOString(),
      i = eA[e]
    if (i) console[i](`[${r}]  ${t.name}:`, ...n)
    else
      throw new Error(
        `Attempted to log a message with an invalid logType (value: ${e})`
      )
  },
  vn = class {
    constructor(e) {
      ;(this.name = e),
        (this._logLevel = XC),
        (this._logHandler = tA),
        (this._userLogHandler = null),
        JC.push(this)
    }
    get logLevel() {
      return this._logLevel
    }
    set logLevel(e) {
      if (!(e in Y))
        throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``)
      this._logLevel = e
    }
    setLogLevel(e) {
      this._logLevel = typeof e == 'string' ? ZC[e] : e
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
      this._userLogHandler && this._userLogHandler(this, Y.DEBUG, ...e),
        this._logHandler(this, Y.DEBUG, ...e)
    }
    log(...e) {
      this._userLogHandler && this._userLogHandler(this, Y.VERBOSE, ...e),
        this._logHandler(this, Y.VERBOSE, ...e)
    }
    info(...e) {
      this._userLogHandler && this._userLogHandler(this, Y.INFO, ...e),
        this._logHandler(this, Y.INFO, ...e)
    }
    warn(...e) {
      this._userLogHandler && this._userLogHandler(this, Y.WARN, ...e),
        this._logHandler(this, Y.WARN, ...e)
    }
    error(...e) {
      this._userLogHandler && this._userLogHandler(this, Y.ERROR, ...e),
        this._logHandler(this, Y.ERROR, ...e)
    }
  }
var nA = (t, e) => e.some((n) => t instanceof n),
  qv,
  zv
function rA() {
  return (
    qv ||
    (qv = [IDBDatabase, IDBObjectStore, IDBIndex, IDBCursor, IDBTransaction])
  )
}
function iA() {
  return (
    zv ||
    (zv = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey,
    ])
  )
}
var Gv = new WeakMap(),
  yd = new WeakMap(),
  Wv = new WeakMap(),
  gd = new WeakMap(),
  _d = new WeakMap()
function sA(t) {
  let e = new Promise((n, r) => {
    let i = () => {
        t.removeEventListener('success', s), t.removeEventListener('error', o)
      },
      s = () => {
        n(Pt(t.result)), i()
      },
      o = () => {
        r(t.error), i()
      }
    t.addEventListener('success', s), t.addEventListener('error', o)
  })
  return (
    e
      .then((n) => {
        n instanceof IDBCursor && Gv.set(n, t)
      })
      .catch(() => {}),
    _d.set(e, t),
    e
  )
}
function oA(t) {
  if (yd.has(t)) return
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
  yd.set(t, e)
}
var vd = {
  get(t, e, n) {
    if (t instanceof IDBTransaction) {
      if (e === 'done') return yd.get(t)
      if (e === 'objectStoreNames') return t.objectStoreNames || Wv.get(t)
      if (e === 'store')
        return n.objectStoreNames[1]
          ? void 0
          : n.objectStore(n.objectStoreNames[0])
    }
    return Pt(t[e])
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
function Kv(t) {
  vd = t(vd)
}
function aA(t) {
  return t === IDBDatabase.prototype.transaction &&
    !('objectStoreNames' in IDBTransaction.prototype)
    ? function (e, ...n) {
        let r = t.call(pa(this), e, ...n)
        return Wv.set(r, e.sort ? e.sort() : [e]), Pt(r)
      }
    : iA().includes(t)
      ? function (...e) {
          return t.apply(pa(this), e), Pt(Gv.get(this))
        }
      : function (...e) {
          return Pt(t.apply(pa(this), e))
        }
}
function cA(t) {
  return typeof t == 'function'
    ? aA(t)
    : (t instanceof IDBTransaction && oA(t), nA(t, rA()) ? new Proxy(t, vd) : t)
}
function Pt(t) {
  if (t instanceof IDBRequest) return sA(t)
  if (gd.has(t)) return gd.get(t)
  let e = cA(t)
  return e !== t && (gd.set(t, e), _d.set(e, t)), e
}
var pa = (t) => _d.get(t)
function Yv(t, e, { blocked: n, upgrade: r, blocking: i, terminated: s } = {}) {
  let o = indexedDB.open(t, e),
    c = Pt(o)
  return (
    r &&
      o.addEventListener('upgradeneeded', (u) => {
        r(Pt(o.result), u.oldVersion, u.newVersion, Pt(o.transaction), u)
      }),
    n && o.addEventListener('blocked', (u) => n(u.oldVersion, u.newVersion, u)),
    c
      .then((u) => {
        s && u.addEventListener('close', () => s()),
          i &&
            u.addEventListener('versionchange', (d) =>
              i(d.oldVersion, d.newVersion, d)
            )
      })
      .catch(() => {}),
    c
  )
}
var uA = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
  lA = ['put', 'add', 'delete', 'clear'],
  Id = new Map()
function Qv(t, e) {
  if (!(t instanceof IDBDatabase && !(e in t) && typeof e == 'string')) return
  if (Id.get(e)) return Id.get(e)
  let n = e.replace(/FromIndex$/, ''),
    r = e !== n,
    i = lA.includes(n)
  if (
    !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
    !(i || uA.includes(n))
  )
    return
  let s = function (o, ...c) {
    return A(this, null, function* () {
      let u = this.transaction(o, i ? 'readwrite' : 'readonly'),
        d = u.store
      return (
        r && (d = d.index(c.shift())),
        (yield Promise.all([d[n](...c), i && u.done]))[0]
      )
    })
  }
  return Id.set(e, s), s
}
Kv((t) =>
  $t(Ct({}, t), {
    get: (e, n, r) => Qv(e, n) || t.get(e, n, r),
    has: (e, n) => !!Qv(e, n) || t.has(e, n),
  })
)
var Ed = class {
  constructor(e) {
    this.container = e
  }
  getPlatformInfoString() {
    return this.container
      .getProviders()
      .map((n) => {
        if (dA(n)) {
          let r = n.getImmediate()
          return `${r.library}/${r.version}`
        } else return null
      })
      .filter((n) => n)
      .join(' ')
  }
}
function dA(t) {
  let e = t.getComponent()
  return e?.type === 'VERSION'
}
var Td = '@firebase/app',
  Jv = '0.10.13'
var Jt = new vn('@firebase/app'),
  hA = '@firebase/app-compat',
  fA = '@firebase/analytics-compat',
  pA = '@firebase/analytics',
  mA = '@firebase/app-check-compat',
  gA = '@firebase/app-check',
  yA = '@firebase/auth',
  vA = '@firebase/auth-compat',
  _A = '@firebase/database',
  IA = '@firebase/data-connect',
  wA = '@firebase/database-compat',
  EA = '@firebase/functions',
  TA = '@firebase/functions-compat',
  DA = '@firebase/installations',
  bA = '@firebase/installations-compat',
  CA = '@firebase/messaging',
  AA = '@firebase/messaging-compat',
  SA = '@firebase/performance',
  RA = '@firebase/performance-compat',
  xA = '@firebase/remote-config',
  NA = '@firebase/remote-config-compat',
  MA = '@firebase/storage',
  PA = '@firebase/storage-compat',
  OA = '@firebase/firestore',
  kA = '@firebase/vertexai-preview',
  FA = '@firebase/firestore-compat',
  LA = 'firebase',
  VA = '10.14.1'
var Dd = '[DEFAULT]',
  UA = {
    [Td]: 'fire-core',
    [hA]: 'fire-core-compat',
    [pA]: 'fire-analytics',
    [fA]: 'fire-analytics-compat',
    [gA]: 'fire-app-check',
    [mA]: 'fire-app-check-compat',
    [yA]: 'fire-auth',
    [vA]: 'fire-auth-compat',
    [_A]: 'fire-rtdb',
    [IA]: 'fire-data-connect',
    [wA]: 'fire-rtdb-compat',
    [EA]: 'fire-fn',
    [TA]: 'fire-fn-compat',
    [DA]: 'fire-iid',
    [bA]: 'fire-iid-compat',
    [CA]: 'fire-fcm',
    [AA]: 'fire-fcm-compat',
    [SA]: 'fire-perf',
    [RA]: 'fire-perf-compat',
    [xA]: 'fire-rc',
    [NA]: 'fire-rc-compat',
    [MA]: 'fire-gcs',
    [PA]: 'fire-gcs-compat',
    [OA]: 'fire-fst',
    [FA]: 'fire-fst-compat',
    [kA]: 'fire-vertex',
    'fire-js': 'fire-js',
    [LA]: 'fire-js-all',
  }
var ts = new Map(),
  jA = new Map(),
  bd = new Map()
function Zv(t, e) {
  try {
    t.container.addComponent(e)
  } catch (n) {
    Jt.debug(
      `Component ${e.name} failed to register with FirebaseApp ${t.name}`,
      n
    )
  }
}
function In(t) {
  let e = t.name
  if (bd.has(e))
    return (
      Jt.debug(`There were multiple attempts to register component ${e}.`), !1
    )
  bd.set(e, t)
  for (let n of ts.values()) Zv(n, t)
  for (let n of jA.values()) Zv(n, t)
  return !0
}
function Rd(t, e) {
  let n = t.container.getProvider('heartbeat').getImmediate({ optional: !0 })
  return n && n.triggerHeartbeat(), t.container.getProvider(e)
}
function Pr(t) {
  return t.settings !== void 0
}
var BA = {
    'no-app':
      "No Firebase App '{$appName}' has been created - call initializeApp() first",
    'bad-app-name': "Illegal App name: '{$appName}'",
    'duplicate-app':
      "Firebase App named '{$appName}' already exists with different options or config",
    'app-deleted': "Firebase App named '{$appName}' already deleted",
    'server-app-deleted': 'Firebase Server App has been deleted',
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
    'finalization-registry-not-supported':
      'FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.',
    'invalid-server-app-environment':
      'FirebaseServerApp is not for use in browser environments.',
  },
  _n = new Yt('app', 'Firebase', BA)
var Cd = class {
  constructor(e, n, r) {
    ;(this._isDeleted = !1),
      (this._options = Object.assign({}, e)),
      (this._config = Object.assign({}, n)),
      (this._name = n.name),
      (this._automaticDataCollectionEnabled = n.automaticDataCollectionEnabled),
      (this._container = r),
      this.container.addComponent(new ft('app', () => this, 'PUBLIC'))
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
    if (this.isDeleted) throw _n.create('app-deleted', { appName: this._name })
  }
}
var Or = VA
function xd(t, e = {}) {
  let n = t
  typeof e != 'object' && (e = { name: e })
  let r = Object.assign({ name: Dd, automaticDataCollectionEnabled: !1 }, e),
    i = r.name
  if (typeof i != 'string' || !i)
    throw _n.create('bad-app-name', { appName: String(i) })
  if ((n || (n = hd()), !n)) throw _n.create('no-options')
  let s = ts.get(i)
  if (s) {
    if (Mr(n, s.options) && Mr(r, s.config)) return s
    throw _n.create('duplicate-app', { appName: i })
  }
  let o = new fa(i)
  for (let u of bd.values()) o.addComponent(u)
  let c = new Cd(n, r, o)
  return ts.set(i, c), c
}
function rs(t = Dd) {
  let e = ts.get(t)
  if (!e && t === Dd && hd()) return xd()
  if (!e) throw _n.create('no-app', { appName: t })
  return e
}
function ma() {
  return Array.from(ts.values())
}
function Re(t, e, n) {
  var r
  let i = (r = UA[t]) !== null && r !== void 0 ? r : t
  n && (i += `-${n}`)
  let s = i.match(/\s|\//),
    o = e.match(/\s|\//)
  if (s || o) {
    let c = [`Unable to register library "${i}" with version "${e}":`]
    s &&
      c.push(
        `library name "${i}" contains illegal characters (whitespace or "/")`
      ),
      s && o && c.push('and'),
      o &&
        c.push(
          `version name "${e}" contains illegal characters (whitespace or "/")`
        ),
      Jt.warn(c.join(' '))
    return
  }
  In(new ft(`${i}-version`, () => ({ library: i, version: e }), 'VERSION'))
}
var $A = 'firebase-heartbeat-database',
  HA = 1,
  ns = 'firebase-heartbeat-store',
  wd = null
function n_() {
  return (
    wd ||
      (wd = Yv($A, HA, {
        upgrade: (t, e) => {
          switch (e) {
            case 0:
              try {
                t.createObjectStore(ns)
              } catch (n) {
                console.warn(n)
              }
          }
        },
      }).catch((t) => {
        throw _n.create('idb-open', { originalErrorMessage: t.message })
      })),
    wd
  )
}
function qA(t) {
  return A(this, null, function* () {
    try {
      let n = (yield n_()).transaction(ns),
        r = yield n.objectStore(ns).get(r_(t))
      return yield n.done, r
    } catch (e) {
      if (e instanceof ht) Jt.warn(e.message)
      else {
        let n = _n.create('idb-get', { originalErrorMessage: e?.message })
        Jt.warn(n.message)
      }
    }
  })
}
function Xv(t, e) {
  return A(this, null, function* () {
    try {
      let r = (yield n_()).transaction(ns, 'readwrite')
      yield r.objectStore(ns).put(e, r_(t)), yield r.done
    } catch (n) {
      if (n instanceof ht) Jt.warn(n.message)
      else {
        let r = _n.create('idb-set', { originalErrorMessage: n?.message })
        Jt.warn(r.message)
      }
    }
  })
}
function r_(t) {
  return `${t.name}!${t.options.appId}`
}
var zA = 1024,
  GA = 30 * 24 * 60 * 60 * 1e3,
  Ad = class {
    constructor(e) {
      ;(this.container = e), (this._heartbeatsCache = null)
      let n = this.container.getProvider('app').getImmediate()
      ;(this._storage = new Sd(n)),
        (this._heartbeatsCachePromise = this._storage
          .read()
          .then((r) => ((this._heartbeatsCache = r), r)))
    }
    triggerHeartbeat() {
      return A(this, null, function* () {
        var e, n
        try {
          let i = this.container
              .getProvider('platform-logger')
              .getImmediate()
              .getPlatformInfoString(),
            s = e_()
          return (((e = this._heartbeatsCache) === null || e === void 0
            ? void 0
            : e.heartbeats) == null &&
            ((this._heartbeatsCache = yield this._heartbeatsCachePromise),
            ((n = this._heartbeatsCache) === null || n === void 0
              ? void 0
              : n.heartbeats) == null)) ||
            this._heartbeatsCache.lastSentHeartbeatDate === s ||
            this._heartbeatsCache.heartbeats.some((o) => o.date === s)
            ? void 0
            : (this._heartbeatsCache.heartbeats.push({ date: s, agent: i }),
              (this._heartbeatsCache.heartbeats =
                this._heartbeatsCache.heartbeats.filter((o) => {
                  let c = new Date(o.date).valueOf()
                  return Date.now() - c <= GA
                })),
              this._storage.overwrite(this._heartbeatsCache))
        } catch (r) {
          Jt.warn(r)
        }
      })
    }
    getHeartbeatsHeader() {
      return A(this, null, function* () {
        var e
        try {
          if (
            (this._heartbeatsCache === null &&
              (yield this._heartbeatsCachePromise),
            ((e = this._heartbeatsCache) === null || e === void 0
              ? void 0
              : e.heartbeats) == null ||
              this._heartbeatsCache.heartbeats.length === 0)
          )
            return ''
          let n = e_(),
            { heartbeatsToSend: r, unsentEntries: i } = WA(
              this._heartbeatsCache.heartbeats
            ),
            s = es(JSON.stringify({ version: 2, heartbeats: r }))
          return (
            (this._heartbeatsCache.lastSentHeartbeatDate = n),
            i.length > 0
              ? ((this._heartbeatsCache.heartbeats = i),
                yield this._storage.overwrite(this._heartbeatsCache))
              : ((this._heartbeatsCache.heartbeats = []),
                this._storage.overwrite(this._heartbeatsCache)),
            s
          )
        } catch (n) {
          return Jt.warn(n), ''
        }
      })
    }
  }
function e_() {
  return new Date().toISOString().substring(0, 10)
}
function WA(t, e = zA) {
  let n = [],
    r = t.slice()
  for (let i of t) {
    let s = n.find((o) => o.agent === i.agent)
    if (s) {
      if ((s.dates.push(i.date), t_(n) > e)) {
        s.dates.pop()
        break
      }
    } else if ((n.push({ agent: i.agent, dates: [i.date] }), t_(n) > e)) {
      n.pop()
      break
    }
    r = r.slice(1)
  }
  return { heartbeatsToSend: n, unsentEntries: r }
}
var Sd = class {
  constructor(e) {
    ;(this.app = e),
      (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck())
  }
  runIndexedDBEnvironmentCheck() {
    return A(this, null, function* () {
      return fd()
        ? $v()
            .then(() => !0)
            .catch(() => !1)
        : !1
    })
  }
  read() {
    return A(this, null, function* () {
      if (yield this._canUseIndexedDBPromise) {
        let n = yield qA(this.app)
        return n?.heartbeats ? n : { heartbeats: [] }
      } else return { heartbeats: [] }
    })
  }
  overwrite(e) {
    return A(this, null, function* () {
      var n
      if (yield this._canUseIndexedDBPromise) {
        let i = yield this.read()
        return Xv(this.app, {
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
    return A(this, null, function* () {
      var n
      if (yield this._canUseIndexedDBPromise) {
        let i = yield this.read()
        return Xv(this.app, {
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
function t_(t) {
  return es(JSON.stringify({ version: 2, heartbeats: t })).length
}
function KA(t) {
  In(new ft('platform-logger', (e) => new Ed(e), 'PRIVATE')),
    In(new ft('heartbeat', (e) => new Ad(e), 'PRIVATE')),
    Re(Td, Jv, t),
    Re(Td, Jv, 'esm2017'),
    Re('fire-js', '')
}
KA('')
var QA = 'firebase',
  YA = '10.14.1'
Re(QA, YA, 'app')
var Fr = new Bn('ANGULARFIRE2_VERSION')
function Md(t, e, n) {
  if (e) {
    if (e.length === 1) return e[0]
    let s = e.filter((o) => o.app === n)
    if (s.length === 1) return s[0]
  }
  return n.container.getProvider(t).getImmediate({ optional: !0 })
}
var ss = (t, e) => {
    let n = e ? [e] : ma(),
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
  is = class {
    constructor() {
      return ss(JA)
    }
  },
  JA = 'app-check'
function kr() {}
var ga = class {
    zone
    delegate
    constructor(e, n = Jc) {
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
  Nd = class {
    zone
    task = null
    constructor(e) {
      this.zone = e
    }
    call(e, n) {
      let r = this.unscheduleTask.bind(this)
      return (
        (this.task = this.zone.run(() =>
          Zone.current.scheduleMacroTask('firebaseZoneBlock', kr, {}, kr, kr)
        )),
        n
          .pipe(un({ next: r, complete: r, error: r }))
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
  os = (() => {
    class t {
      ngZone
      outsideAngular
      insideAngular
      constructor(n) {
        ;(this.ngZone = n),
          (this.outsideAngular = n.runOutsideAngular(
            () => new ga(Zone.current)
          )),
          (this.insideAngular = n.run(() => new ga(Zone.current, Yc))),
          (globalThis.ɵAngularFireScheduler ||= this)
      }
      static ɵfac = function (r) {
        return new (r || t)(ne(ge))
      }
      static ɵprov = pe({ token: t, factory: t.ɵfac, providedIn: 'root' })
    }
    return t
  })()
function ya() {
  let t = globalThis.ɵAngularFireScheduler
  if (!t)
    throw new Error(`Either AngularFireModule has not been provided in your AppModule (this can be done manually or implictly using
provideFirebaseApp) or you're calling an AngularFire method outside of an NgModule (which is not supported).`)
  return t
}
function ZA(t) {
  return ya().ngZone.runOutsideAngular(() => t())
}
function Kn(t) {
  return ya().ngZone.run(() => t())
}
function XA(t) {
  return eS(ya())(t)
}
function eS(t) {
  return function (n) {
    return (
      (n = n.lift(new Nd(t.ngZone))),
      n.pipe(cn(t.outsideAngular), an(t.insideAngular))
    )
  }
}
var tS = (t, e) =>
    function () {
      let r = arguments
      return (
        e &&
          setTimeout(() => {
            e.state === 'scheduled' && e.invoke()
          }, 10),
        Kn(() => t.apply(void 0, r))
      )
    },
  Qn = (t, e) =>
    function () {
      let n,
        r = arguments
      for (let s = 0; s < arguments.length; s++)
        typeof r[s] == 'function' &&
          (e &&
            (n ||= Kn(() =>
              Zone.current.scheduleMacroTask(
                'firebaseZoneBlock',
                kr,
                {},
                kr,
                kr
              )
            )),
          (r[s] = tS(r[s], n)))
      let i = ZA(() => t.apply(this, r))
      if (!e)
        if (i instanceof ue) {
          let s = ya()
          return i.pipe(cn(s.outsideAngular), an(s.insideAngular))
        } else return Kn(() => i)
      return i instanceof ue
        ? i.pipe(XA)
        : i instanceof Promise
          ? Kn(
              () =>
                new Promise((s, o) =>
                  i.then(
                    (c) => Kn(() => s(c)),
                    (c) => Kn(() => o(c))
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
            : Kn(() => i)
    }
var Yn = class {
    constructor(e) {
      return e
    }
  },
  as = class {
    constructor() {
      return ma()
    }
  }
function nS(t) {
  return t && t.length === 1 ? t[0] : new Yn(rs())
}
var Pd = new oe('angularfire2._apps'),
  rS = { provide: Yn, useFactory: nS, deps: [[new Qt(), Pd]] },
  iS = { provide: as, deps: [[new Qt(), Pd]] }
function sS(t) {
  return (e, n) => {
    let r = e.runOutsideAngular(() => t(n))
    return new Yn(r)
  }
}
var oS = (() => {
  class t {
    constructor(n) {
      Re('angularfire', Fr.full, 'core'),
        Re('angularfire', Fr.full, 'app'),
        Re('angular', uv.full, n.toString())
    }
    static ɵfac = function (r) {
      return new (r || t)(ne(pn))
    }
    static ɵmod = Hn({ type: t })
    static ɵinj = $n({ providers: [rS, iS] })
  }
  return t
})()
function i_(t, ...e) {
  return {
    ngModule: oS,
    providers: [
      { provide: Pd, useFactory: sS(t), multi: !0, deps: [ge, fn, os, ...e] },
    ],
  }
}
var s_ = Qn(xd, !0)
function f_() {
  return {
    'dependent-sdk-initialized-before-auth':
      'Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.',
  }
}
var p_ = f_,
  m_ = new Yt('auth', 'Firebase', f_())
var wa = new vn('@firebase/auth')
function cS(t, ...e) {
  wa.logLevel <= Y.WARN && wa.warn(`Auth (${Or}): ${t}`, ...e)
}
function _a(t, ...e) {
  wa.logLevel <= Y.ERROR && wa.error(`Auth (${Or}): ${t}`, ...e)
}
function o_(t, ...e) {
  throw zd(t, ...e)
}
function qd(t, ...e) {
  return zd(t, ...e)
}
function g_(t, e, n) {
  let r = Object.assign(Object.assign({}, p_()), { [e]: n })
  return new Yt('auth', 'Firebase', r).create(e, { appName: t.name })
}
function Ia(t) {
  return g_(
    t,
    'operation-not-supported-in-this-environment',
    'Operations that alter the current user are not supported in conjunction with FirebaseServerApp'
  )
}
function zd(t, ...e) {
  if (typeof t != 'string') {
    let n = e[0],
      r = [...e.slice(1)]
    return r[0] && (r[0].appName = t.name), t._errorFactory.create(n, ...r)
  }
  return m_.create(t, ...e)
}
function re(t, e, ...n) {
  if (!t) throw zd(e, ...n)
}
function cs(t) {
  let e = 'INTERNAL ASSERTION FAILED: ' + t
  throw (_a(e), new Error(e))
}
function Ea(t, e) {
  t || cs(e)
}
function uS() {
  return a_() === 'http:' || a_() === 'https:'
}
function a_() {
  var t
  return (
    (typeof self < 'u' &&
      ((t = self.location) === null || t === void 0 ? void 0 : t.protocol)) ||
    null
  )
}
function lS() {
  return typeof navigator < 'u' &&
    navigator &&
    'onLine' in navigator &&
    typeof navigator.onLine == 'boolean' &&
    (uS() || Uv() || 'connection' in navigator)
    ? navigator.onLine
    : !0
}
function dS() {
  if (typeof navigator > 'u') return null
  let t = navigator
  return (t.languages && t.languages[0]) || t.language || null
}
var Zn = class {
  constructor(e, n) {
    ;(this.shortDelay = e),
      (this.longDelay = n),
      Ea(n > e, 'Short delay should be less than long delay!'),
      (this.isMobile = Lv() || jv())
  }
  get() {
    return lS()
      ? this.isMobile
        ? this.longDelay
        : this.shortDelay
      : Math.min(5e3, this.shortDelay)
  }
}
function hS(t, e) {
  Ea(t.emulator, 'Emulator should always be set here')
  let { url: n } = t.emulator
  return e ? `${n}${e.startsWith('/') ? e.slice(1) : e}` : n
}
var Ta = class {
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
    cs(
      'Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    )
  }
  static headers() {
    if (this.headersImpl) return this.headersImpl
    if (typeof self < 'u' && 'Headers' in self) return self.Headers
    if (typeof globalThis < 'u' && globalThis.Headers) return globalThis.Headers
    if (typeof Headers < 'u') return Headers
    cs(
      'Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    )
  }
  static response() {
    if (this.responseImpl) return this.responseImpl
    if (typeof self < 'u' && 'Response' in self) return self.Response
    if (typeof globalThis < 'u' && globalThis.Response)
      return globalThis.Response
    if (typeof Response < 'u') return Response
    cs(
      'Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill'
    )
  }
}
var fS = {
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
var pS = new Zn(3e4, 6e4)
function y_(t, e) {
  return t.tenantId && !e.tenantId
    ? Object.assign(Object.assign({}, e), { tenantId: t.tenantId })
    : e
}
function Aa(s, o, c, u) {
  return A(this, arguments, function* (t, e, n, r, i = {}) {
    return v_(t, i, () =>
      A(this, null, function* () {
        let d = {},
          f = {}
        r && (e === 'GET' ? (f = r) : (d = { body: JSON.stringify(r) }))
        let m = pd(Object.assign({ key: t.config.apiKey }, f)).slice(1),
          _ = yield t._getAdditionalHeaders()
        ;(_['Content-Type'] = 'application/json'),
          t.languageCode && (_['X-Firebase-Locale'] = t.languageCode)
        let D = Object.assign({ method: e, headers: _ }, d)
        return (
          Vv() || (D.referrerPolicy = 'no-referrer'),
          Ta.fetch()(__(t, t.config.apiHost, n, m), D)
        )
      })
    )
  })
}
function v_(t, e, n) {
  return A(this, null, function* () {
    t._canInitEmulator = !1
    let r = Object.assign(Object.assign({}, fS), e)
    try {
      let i = new Fd(t),
        s = yield Promise.race([n(), i.promise])
      i.clearNetworkTimeout()
      let o = yield s.json()
      if ('needConfirmation' in o)
        throw va(t, 'account-exists-with-different-credential', o)
      if (s.ok && !('errorMessage' in o)) return o
      {
        let c = s.ok ? o.errorMessage : o.error.message,
          [u, d] = c.split(' : ')
        if (u === 'FEDERATED_USER_ID_ALREADY_LINKED')
          throw va(t, 'credential-already-in-use', o)
        if (u === 'EMAIL_EXISTS') throw va(t, 'email-already-in-use', o)
        if (u === 'USER_DISABLED') throw va(t, 'user-disabled', o)
        let f = r[u] || u.toLowerCase().replace(/[_\s]+/g, '-')
        if (d) throw g_(t, f, d)
        o_(t, f)
      }
    } catch (i) {
      if (i instanceof ht) throw i
      o_(t, 'network-request-failed', { message: String(i) })
    }
  })
}
function __(t, e, n, r) {
  let i = `${e}${n}?${r}`
  return t.config.emulator ? hS(t.config, i) : `${t.config.apiScheme}://${i}`
}
var Fd = class {
  constructor(e) {
    ;(this.auth = e),
      (this.timer = null),
      (this.promise = new Promise((n, r) => {
        this.timer = setTimeout(
          () => r(qd(this.auth, 'network-request-failed')),
          pS.get()
        )
      }))
  }
  clearNetworkTimeout() {
    clearTimeout(this.timer)
  }
}
function va(t, e, n) {
  let r = { appName: t.name }
  n.email && (r.email = n.email),
    n.phoneNumber && (r.phoneNumber = n.phoneNumber)
  let i = qd(t, e, r)
  return (i.customData._tokenResponse = n), i
}
function mS(t, e) {
  return A(this, null, function* () {
    return Aa(t, 'POST', '/v1/accounts:delete', e)
  })
}
function I_(t, e) {
  return A(this, null, function* () {
    return Aa(t, 'POST', '/v1/accounts:lookup', e)
  })
}
function us(t) {
  if (t)
    try {
      let e = new Date(Number(t))
      if (!isNaN(e.getTime())) return e.toUTCString()
    } catch {}
}
function Gd(t, e = !1) {
  return A(this, null, function* () {
    let n = yn(t),
      r = yield n.getIdToken(e),
      i = w_(r)
    re(i && i.exp && i.auth_time && i.iat, n.auth, 'internal-error')
    let s = typeof i.firebase == 'object' ? i.firebase : void 0,
      o = s?.sign_in_provider
    return {
      claims: i,
      token: r,
      authTime: us(Od(i.auth_time)),
      issuedAtTime: us(Od(i.iat)),
      expirationTime: us(Od(i.exp)),
      signInProvider: o || null,
      signInSecondFactor: s?.sign_in_second_factor || null,
    }
  })
}
function Od(t) {
  return Number(t) * 1e3
}
function w_(t) {
  let [e, n, r] = t.split('.')
  if (e === void 0 || n === void 0 || r === void 0)
    return _a('JWT malformed, contained fewer than 3 sections'), null
  try {
    let i = dd(n)
    return i ? JSON.parse(i) : (_a('Failed to decode base64 JWT payload'), null)
  } catch (i) {
    return _a('Caught error parsing JWT payload as JSON', i?.toString()), null
  }
}
function c_(t) {
  let e = w_(t)
  return (
    re(e, 'internal-error'),
    re(typeof e.exp < 'u', 'internal-error'),
    re(typeof e.iat < 'u', 'internal-error'),
    Number(e.exp) - Number(e.iat)
  )
}
function Ld(t, e, n = !1) {
  return A(this, null, function* () {
    if (n) return e
    try {
      return yield e
    } catch (r) {
      throw (
        (r instanceof ht &&
          gS(r) &&
          t.auth.currentUser === t &&
          (yield t.auth.signOut()),
        r)
      )
    }
  })
}
function gS({ code: t }) {
  return t === 'auth/user-disabled' || t === 'auth/user-token-expired'
}
var Vd = class {
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
        A(this, null, function* () {
          yield this.iteration()
        }),
      n
    )
  }
  iteration() {
    return A(this, null, function* () {
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
var ds = class {
  constructor(e, n) {
    ;(this.createdAt = e), (this.lastLoginAt = n), this._initializeTime()
  }
  _initializeTime() {
    ;(this.lastSignInTime = us(this.lastLoginAt)),
      (this.creationTime = us(this.createdAt))
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
function Da(t) {
  return A(this, null, function* () {
    var e
    let n = t.auth,
      r = yield t.getIdToken(),
      i = yield Ld(t, I_(n, { idToken: r }))
    re(i?.users.length, n, 'internal-error')
    let s = i.users[0]
    t._notifyReloadListener(s)
    let o =
        !((e = s.providerUserInfo) === null || e === void 0) && e.length
          ? E_(s.providerUserInfo)
          : [],
      c = yS(t.providerData, o),
      u = t.isAnonymous,
      d = !(t.email && s.passwordHash) && !c?.length,
      f = u ? d : !1,
      m = {
        uid: s.localId,
        displayName: s.displayName || null,
        photoURL: s.photoUrl || null,
        email: s.email || null,
        emailVerified: s.emailVerified || !1,
        phoneNumber: s.phoneNumber || null,
        tenantId: s.tenantId || null,
        providerData: c,
        metadata: new ds(s.createdAt, s.lastLoginAt),
        isAnonymous: f,
      }
    Object.assign(t, m)
  })
}
function Wd(t) {
  return A(this, null, function* () {
    let e = yn(t)
    yield Da(e),
      yield e.auth._persistUserIfCurrent(e),
      e.auth._notifyListenersIfCurrent(e)
  })
}
function yS(t, e) {
  return [
    ...t.filter((r) => !e.some((i) => i.providerId === r.providerId)),
    ...e,
  ]
}
function E_(t) {
  return t.map((e) => {
    var { providerId: n } = e,
      r = Zc(e, ['providerId'])
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
function vS(t, e) {
  return A(this, null, function* () {
    let n = yield v_(t, {}, () =>
      A(this, null, function* () {
        let r = pd({ grant_type: 'refresh_token', refresh_token: e }).slice(1),
          { tokenApiHost: i, apiKey: s } = t.config,
          o = __(t, i, '/v1/token', `key=${s}`),
          c = yield t._getAdditionalHeaders()
        return (
          (c['Content-Type'] = 'application/x-www-form-urlencoded'),
          Ta.fetch()(o, { method: 'POST', headers: c, body: r })
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
function _S(t, e) {
  return A(this, null, function* () {
    return Aa(t, 'POST', '/v2/accounts:revokeToken', y_(t, e))
  })
}
var ls = class t {
  constructor() {
    ;(this.refreshToken = null),
      (this.accessToken = null),
      (this.expirationTime = null)
  }
  get isExpired() {
    return !this.expirationTime || Date.now() > this.expirationTime - 3e4
  }
  updateFromServerResponse(e) {
    re(e.idToken, 'internal-error'),
      re(typeof e.idToken < 'u', 'internal-error'),
      re(typeof e.refreshToken < 'u', 'internal-error')
    let n =
      'expiresIn' in e && typeof e.expiresIn < 'u'
        ? Number(e.expiresIn)
        : c_(e.idToken)
    this.updateTokensAndExpiration(e.idToken, e.refreshToken, n)
  }
  updateFromIdToken(e) {
    re(e.length !== 0, 'internal-error')
    let n = c_(e)
    this.updateTokensAndExpiration(e, null, n)
  }
  getToken(e, n = !1) {
    return A(this, null, function* () {
      return !n && this.accessToken && !this.isExpired
        ? this.accessToken
        : (re(this.refreshToken, e, 'user-token-expired'),
          this.refreshToken
            ? (yield this.refresh(e, this.refreshToken), this.accessToken)
            : null)
    })
  }
  clearRefreshToken() {
    this.refreshToken = null
  }
  refresh(e, n) {
    return A(this, null, function* () {
      let { accessToken: r, refreshToken: i, expiresIn: s } = yield vS(e, n)
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
        (re(typeof r == 'string', 'internal-error', { appName: e }),
        (o.refreshToken = r)),
      i &&
        (re(typeof i == 'string', 'internal-error', { appName: e }),
        (o.accessToken = i)),
      s &&
        (re(typeof s == 'number', 'internal-error', { appName: e }),
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
    return cs('not implemented')
  }
}
function wn(t, e) {
  re(typeof t == 'string' || typeof t > 'u', 'internal-error', { appName: e })
}
var hs = class t {
  constructor(e) {
    var { uid: n, auth: r, stsTokenManager: i } = e,
      s = Zc(e, ['uid', 'auth', 'stsTokenManager'])
    ;(this.providerId = 'firebase'),
      (this.proactiveRefresh = new Vd(this)),
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
      (this.metadata = new ds(s.createdAt || void 0, s.lastLoginAt || void 0))
  }
  getIdToken(e) {
    return A(this, null, function* () {
      let n = yield Ld(this, this.stsTokenManager.getToken(this.auth, e))
      return (
        re(n, this.auth, 'internal-error'),
        this.accessToken !== n &&
          ((this.accessToken = n),
          yield this.auth._persistUserIfCurrent(this),
          this.auth._notifyListenersIfCurrent(this)),
        n
      )
    })
  }
  getIdTokenResult(e) {
    return Gd(this, e)
  }
  reload() {
    return Wd(this)
  }
  _assign(e) {
    this !== e &&
      (re(this.uid === e.uid, this.auth, 'internal-error'),
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
    re(!this.reloadListener, this.auth, 'internal-error'),
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
    return A(this, null, function* () {
      let r = !1
      e.idToken &&
        e.idToken !== this.stsTokenManager.accessToken &&
        (this.stsTokenManager.updateFromServerResponse(e), (r = !0)),
        n && (yield Da(this)),
        yield this.auth._persistUserIfCurrent(this),
        r && this.auth._notifyListenersIfCurrent(this)
    })
  }
  delete() {
    return A(this, null, function* () {
      if (Pr(this.auth.app)) return Promise.reject(Ia(this.auth))
      let e = yield this.getIdToken()
      return (
        yield Ld(this, mS(this.auth, { idToken: e })),
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
    var r, i, s, o, c, u, d, f
    let m = (r = n.displayName) !== null && r !== void 0 ? r : void 0,
      _ = (i = n.email) !== null && i !== void 0 ? i : void 0,
      D = (s = n.phoneNumber) !== null && s !== void 0 ? s : void 0,
      S = (o = n.photoURL) !== null && o !== void 0 ? o : void 0,
      N = (c = n.tenantId) !== null && c !== void 0 ? c : void 0,
      R = (u = n._redirectEventId) !== null && u !== void 0 ? u : void 0,
      k = (d = n.createdAt) !== null && d !== void 0 ? d : void 0,
      B = (f = n.lastLoginAt) !== null && f !== void 0 ? f : void 0,
      {
        uid: q,
        emailVerified: K,
        isAnonymous: ce,
        providerData: z,
        stsTokenManager: w,
      } = n
    re(q && w, e, 'internal-error')
    let g = ls.fromJSON(this.name, w)
    re(typeof q == 'string', e, 'internal-error'),
      wn(m, e.name),
      wn(_, e.name),
      re(typeof K == 'boolean', e, 'internal-error'),
      re(typeof ce == 'boolean', e, 'internal-error'),
      wn(D, e.name),
      wn(S, e.name),
      wn(N, e.name),
      wn(R, e.name),
      wn(k, e.name),
      wn(B, e.name)
    let y = new t({
      uid: q,
      auth: e,
      email: _,
      emailVerified: K,
      displayName: m,
      isAnonymous: ce,
      photoURL: S,
      phoneNumber: D,
      tenantId: N,
      stsTokenManager: g,
      createdAt: k,
      lastLoginAt: B,
    })
    return (
      z &&
        Array.isArray(z) &&
        (y.providerData = z.map((I) => Object.assign({}, I))),
      R && (y._redirectEventId = R),
      y
    )
  }
  static _fromIdTokenResponse(e, n, r = !1) {
    return A(this, null, function* () {
      let i = new ls()
      i.updateFromServerResponse(n)
      let s = new t({
        uid: n.localId,
        auth: e,
        stsTokenManager: i,
        isAnonymous: r,
      })
      return yield Da(s), s
    })
  }
  static _fromGetAccountInfoResponse(e, n, r) {
    return A(this, null, function* () {
      let i = n.users[0]
      re(i.localId !== void 0, 'internal-error')
      let s = i.providerUserInfo !== void 0 ? E_(i.providerUserInfo) : [],
        o = !(i.email && i.passwordHash) && !s?.length,
        c = new ls()
      c.updateFromIdToken(r)
      let u = new t({
          uid: i.localId,
          auth: e,
          stsTokenManager: c,
          isAnonymous: o,
        }),
        d = {
          uid: i.localId,
          displayName: i.displayName || null,
          photoURL: i.photoUrl || null,
          email: i.email || null,
          emailVerified: i.emailVerified || !1,
          phoneNumber: i.phoneNumber || null,
          tenantId: i.tenantId || null,
          providerData: s,
          metadata: new ds(i.createdAt, i.lastLoginAt),
          isAnonymous: !(i.email && i.passwordHash) && !s?.length,
        }
      return Object.assign(u, d), u
    })
  }
}
var u_ = new Map()
function Jn(t) {
  Ea(t instanceof Function, 'Expected a class definition')
  let e = u_.get(t)
  return e
    ? (Ea(e instanceof t, 'Instance stored in cache mismatched with class'), e)
    : ((e = new t()), u_.set(t, e), e)
}
var IS = (() => {
    class t {
      constructor() {
        ;(this.type = 'NONE'), (this.storage = {})
      }
      _isAvailable() {
        return A(this, null, function* () {
          return !0
        })
      }
      _set(n, r) {
        return A(this, null, function* () {
          this.storage[n] = r
        })
      }
      _get(n) {
        return A(this, null, function* () {
          let r = this.storage[n]
          return r === void 0 ? null : r
        })
      }
      _remove(n) {
        return A(this, null, function* () {
          delete this.storage[n]
        })
      }
      _addListener(n, r) {}
      _removeListener(n, r) {}
    }
    return (t.type = 'NONE'), t
  })(),
  Ud = IS
function kd(t, e, n) {
  return `firebase:${t}:${e}:${n}`
}
var ba = class t {
  constructor(e, n, r) {
    ;(this.persistence = e), (this.auth = n), (this.userKey = r)
    let { config: i, name: s } = this.auth
    ;(this.fullUserKey = kd(this.userKey, i.apiKey, s)),
      (this.fullPersistenceKey = kd('persistence', i.apiKey, s)),
      (this.boundEventHandler = n._onStorageEvent.bind(n)),
      this.persistence._addListener(this.fullUserKey, this.boundEventHandler)
  }
  setCurrentUser(e) {
    return this.persistence._set(this.fullUserKey, e.toJSON())
  }
  getCurrentUser() {
    return A(this, null, function* () {
      let e = yield this.persistence._get(this.fullUserKey)
      return e ? hs._fromJSON(this.auth, e) : null
    })
  }
  removeCurrentUser() {
    return this.persistence._remove(this.fullUserKey)
  }
  savePersistenceForRedirect() {
    return this.persistence._set(this.fullPersistenceKey, this.persistence.type)
  }
  setPersistence(e) {
    return A(this, null, function* () {
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
    return A(this, null, function* () {
      if (!n.length) return new t(Jn(Ud), e, r)
      let i = (yield Promise.all(
          n.map((d) =>
            A(this, null, function* () {
              if (yield d._isAvailable()) return d
            })
          )
        )).filter((d) => d),
        s = i[0] || Jn(Ud),
        o = kd(r, e.config.apiKey, e.name),
        c = null
      for (let d of n)
        try {
          let f = yield d._get(o)
          if (f) {
            let m = hs._fromJSON(e, f)
            d !== s && (c = m), (s = d)
            break
          }
        } catch {}
      let u = i.filter((d) => d._shouldAllowMigration)
      return !s._shouldAllowMigration || !u.length
        ? new t(s, e, r)
        : ((s = u[0]),
          c && (yield s._set(o, c.toJSON())),
          yield Promise.all(
            n.map((d) =>
              A(this, null, function* () {
                if (d !== s)
                  try {
                    yield d._remove(o)
                  } catch {}
              })
            )
          ),
          new t(s, e, r))
    })
  }
}
function l_(t) {
  let e = t.toLowerCase()
  if (e.includes('opera/') || e.includes('opr/') || e.includes('opios/'))
    return 'Opera'
  if (DS(e)) return 'IEMobile'
  if (e.includes('msie') || e.includes('trident/')) return 'IE'
  if (e.includes('edge/')) return 'Edge'
  if (wS(e)) return 'Firefox'
  if (e.includes('silk/')) return 'Silk'
  if (CS(e)) return 'Blackberry'
  if (AS(e)) return 'Webos'
  if (ES(e)) return 'Safari'
  if ((e.includes('chrome/') || TS(e)) && !e.includes('edge/')) return 'Chrome'
  if (bS(e)) return 'Android'
  {
    let n = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,
      r = t.match(n)
    if (r?.length === 2) return r[1]
  }
  return 'Other'
}
function wS(t = ot()) {
  return /firefox\//i.test(t)
}
function ES(t = ot()) {
  let e = t.toLowerCase()
  return (
    e.includes('safari/') &&
    !e.includes('chrome/') &&
    !e.includes('crios/') &&
    !e.includes('android')
  )
}
function TS(t = ot()) {
  return /crios\//i.test(t)
}
function DS(t = ot()) {
  return /iemobile/i.test(t)
}
function bS(t = ot()) {
  return /android/i.test(t)
}
function CS(t = ot()) {
  return /blackberry/i.test(t)
}
function AS(t = ot()) {
  return /webos/i.test(t)
}
function T_(t, e = []) {
  let n
  switch (t) {
    case 'Browser':
      n = l_(ot())
      break
    case 'Worker':
      n = `${l_(ot())}-${t}`
      break
    default:
      n = t
  }
  let r = e.length ? e.join(',') : 'FirebaseCore-web'
  return `${n}/JsCore/${Or}/${r}`
}
var jd = class {
  constructor(e) {
    ;(this.auth = e), (this.queue = [])
  }
  pushCallback(e, n) {
    let r = (s) =>
      new Promise((o, c) => {
        try {
          let u = e(s)
          o(u)
        } catch (u) {
          c(u)
        }
      })
    ;(r.onAbort = n), this.queue.push(r)
    let i = this.queue.length - 1
    return () => {
      this.queue[i] = () => Promise.resolve()
    }
  }
  runMiddleware(e) {
    return A(this, null, function* () {
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
function SS(n) {
  return A(this, arguments, function* (t, e = {}) {
    return Aa(t, 'GET', '/v2/passwordPolicy', y_(t, e))
  })
}
var RS = 6,
  Bd = class {
    constructor(e) {
      var n, r, i, s
      let o = e.customStrengthOptions
      ;(this.customStrengthOptions = {}),
        (this.customStrengthOptions.minPasswordLength =
          (n = o.minPasswordLength) !== null && n !== void 0 ? n : RS),
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
      var n, r, i, s, o, c
      let u = { isValid: !0, passwordPolicy: this }
      return (
        this.validatePasswordLengthOptions(e, u),
        this.validatePasswordCharacterOptions(e, u),
        u.isValid &&
          (u.isValid =
            (n = u.meetsMinPasswordLength) !== null && n !== void 0 ? n : !0),
        u.isValid &&
          (u.isValid =
            (r = u.meetsMaxPasswordLength) !== null && r !== void 0 ? r : !0),
        u.isValid &&
          (u.isValid =
            (i = u.containsLowercaseLetter) !== null && i !== void 0 ? i : !0),
        u.isValid &&
          (u.isValid =
            (s = u.containsUppercaseLetter) !== null && s !== void 0 ? s : !0),
        u.isValid &&
          (u.isValid =
            (o = u.containsNumericCharacter) !== null && o !== void 0 ? o : !0),
        u.isValid &&
          (u.isValid =
            (c = u.containsNonAlphanumericCharacter) !== null && c !== void 0
              ? c
              : !0),
        u
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
var $d = class {
  constructor(e, n, r, i) {
    ;(this.app = e),
      (this.heartbeatServiceProvider = n),
      (this.appCheckServiceProvider = r),
      (this.config = i),
      (this.currentUser = null),
      (this.emulatorConfig = null),
      (this.operations = Promise.resolve()),
      (this.authStateSubscription = new Ca(this)),
      (this.idTokenSubscription = new Ca(this)),
      (this.beforeStateQueue = new jd(this)),
      (this.redirectUser = null),
      (this.isProactiveRefreshEnabled = !1),
      (this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1),
      (this._canInitEmulator = !0),
      (this._isInitialized = !1),
      (this._deleted = !1),
      (this._initializationPromise = null),
      (this._popupRedirectResolver = null),
      (this._errorFactory = m_),
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
      n && (this._popupRedirectResolver = Jn(n)),
      (this._initializationPromise = this.queue(() =>
        A(this, null, function* () {
          var r, i
          if (
            !this._deleted &&
            ((this.persistenceManager = yield ba.create(this, e)),
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
    return A(this, null, function* () {
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
  initializeCurrentUserFromIdToken(e) {
    return A(this, null, function* () {
      try {
        let n = yield I_(this, { idToken: e }),
          r = yield hs._fromGetAccountInfoResponse(this, n, e)
        yield this.directlySetCurrentUser(r)
      } catch (n) {
        console.warn(
          'FirebaseServerApp could not login user with provided authIdToken: ',
          n
        ),
          yield this.directlySetCurrentUser(null)
      }
    })
  }
  initializeCurrentUser(e) {
    return A(this, null, function* () {
      var n
      if (Pr(this.app)) {
        let o = this.app.settings.authIdToken
        return o
          ? new Promise((c) => {
              setTimeout(() =>
                this.initializeCurrentUserFromIdToken(o).then(c, c)
              )
            })
          : this.directlySetCurrentUser(null)
      }
      let r = yield this.assertedPersistence.getCurrentUser(),
        i = r,
        s = !1
      if (e && this.config.authDomain) {
        yield this.getOrInitRedirectPersistenceManager()
        let o =
            (n = this.redirectUser) === null || n === void 0
              ? void 0
              : n._redirectEventId,
          c = i?._redirectEventId,
          u = yield this.tryRedirectSignIn(e)
        ;(!o || o === c) && u?.user && ((i = u.user), (s = !0))
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
        re(this._popupRedirectResolver, this, 'argument-error'),
        yield this.getOrInitRedirectPersistenceManager(),
        this.redirectUser &&
        this.redirectUser._redirectEventId === i._redirectEventId
          ? this.directlySetCurrentUser(i)
          : this.reloadAndSetCurrentUserOrClear(i)
      )
    })
  }
  tryRedirectSignIn(e) {
    return A(this, null, function* () {
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
    return A(this, null, function* () {
      try {
        yield Da(e)
      } catch (n) {
        if (n?.code !== 'auth/network-request-failed')
          return this.directlySetCurrentUser(null)
      }
      return this.directlySetCurrentUser(e)
    })
  }
  useDeviceLanguage() {
    this.languageCode = dS()
  }
  _delete() {
    return A(this, null, function* () {
      this._deleted = !0
    })
  }
  updateCurrentUser(e) {
    return A(this, null, function* () {
      if (Pr(this.app)) return Promise.reject(Ia(this))
      let n = e ? yn(e) : null
      return (
        n &&
          re(
            n.auth.config.apiKey === this.config.apiKey,
            this,
            'invalid-user-token'
          ),
        this._updateCurrentUser(n && n._clone(this))
      )
    })
  }
  _updateCurrentUser(e, n = !1) {
    return A(this, null, function* () {
      if (!this._deleted)
        return (
          e && re(this.tenantId === e.tenantId, this, 'tenant-id-mismatch'),
          n || (yield this.beforeStateQueue.runMiddleware(e)),
          this.queue(() =>
            A(this, null, function* () {
              yield this.directlySetCurrentUser(e), this.notifyAuthListeners()
            })
          )
        )
    })
  }
  signOut() {
    return A(this, null, function* () {
      return Pr(this.app)
        ? Promise.reject(Ia(this))
        : (yield this.beforeStateQueue.runMiddleware(null),
          (this.redirectPersistenceManager || this._popupRedirectResolver) &&
            (yield this._setRedirectUser(null)),
          this._updateCurrentUser(null, !0))
    })
  }
  setPersistence(e) {
    return Pr(this.app)
      ? Promise.reject(Ia(this))
      : this.queue(() =>
          A(this, null, function* () {
            yield this.assertedPersistence.setPersistence(Jn(e))
          })
        )
  }
  _getRecaptchaConfig() {
    return this.tenantId == null
      ? this._agentRecaptchaConfig
      : this._tenantRecaptchaConfigs[this.tenantId]
  }
  validatePassword(e) {
    return A(this, null, function* () {
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
    return A(this, null, function* () {
      let e = yield SS(this),
        n = new Bd(e)
      this.tenantId === null
        ? (this._projectPasswordPolicy = n)
        : (this._tenantPasswordPolicies[this.tenantId] = n)
    })
  }
  _getPersistence() {
    return this.assertedPersistence.persistence.type
  }
  _updateErrorMap(e) {
    this._errorFactory = new Yt('auth', 'Firebase', e())
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
    return A(this, null, function* () {
      if (this.currentUser) {
        let n = yield this.currentUser.getIdToken(),
          r = {
            providerId: 'apple.com',
            tokenType: 'ACCESS_TOKEN',
            token: e,
            idToken: n,
          }
        this.tenantId != null && (r.tenantId = this.tenantId), yield _S(this, r)
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
    return A(this, null, function* () {
      let r = yield this.getOrInitRedirectPersistenceManager(n)
      return e === null ? r.removeCurrentUser() : r.setCurrentUser(e)
    })
  }
  getOrInitRedirectPersistenceManager(e) {
    return A(this, null, function* () {
      if (!this.redirectPersistenceManager) {
        let n = (e && Jn(e)) || this._popupRedirectResolver
        re(n, this, 'argument-error'),
          (this.redirectPersistenceManager = yield ba.create(
            this,
            [Jn(n._redirectPersistence)],
            'redirectUser'
          )),
          (this.redirectUser =
            yield this.redirectPersistenceManager.getCurrentUser())
      }
      return this.redirectPersistenceManager
    })
  }
  _redirectUserForId(e) {
    return A(this, null, function* () {
      var n, r
      return (
        this._isInitialized &&
          (yield this.queue(() => A(this, null, function* () {}))),
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
    return A(this, null, function* () {
      if (e === this.currentUser)
        return this.queue(() =>
          A(this, null, function* () {
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
      c = this._isInitialized ? Promise.resolve() : this._initializationPromise
    if (
      (re(c, this, 'internal-error'),
      c.then(() => {
        o || s(this.currentUser)
      }),
      typeof n == 'function')
    ) {
      let u = e.addObserver(n, r, i)
      return () => {
        ;(o = !0), u()
      }
    } else {
      let u = e.addObserver(n)
      return () => {
        ;(o = !0), u()
      }
    }
  }
  directlySetCurrentUser(e) {
    return A(this, null, function* () {
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
      re(this.persistenceManager, this, 'internal-error'),
      this.persistenceManager
    )
  }
  _logFramework(e) {
    !e ||
      this.frameworks.includes(e) ||
      (this.frameworks.push(e),
      this.frameworks.sort(),
      (this.clientVersion = T_(
        this.config.clientPlatform,
        this._getFrameworks()
      )))
  }
  _getFrameworks() {
    return this.frameworks
  }
  _getAdditionalHeaders() {
    return A(this, null, function* () {
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
    return A(this, null, function* () {
      var e
      let n = yield (e = this.appCheckServiceProvider.getImmediate({
        optional: !0,
      })) === null || e === void 0
        ? void 0
        : e.getToken()
      return (
        n?.error && cS(`Error while retrieving App Check token: ${n.error}`),
        n?.token
      )
    })
  }
}
function xS(t) {
  return yn(t)
}
var Ca = class {
  constructor(e) {
    ;(this.auth = e),
      (this.observer = null),
      (this.addObserver = Hv((n) => (this.observer = n)))
  }
  get next() {
    return (
      re(this.observer, this.auth, 'internal-error'),
      this.observer.next.bind(this.observer)
    )
  }
}
var NS = {
  loadJS() {
    return A(this, null, function* () {
      throw new Error('Unable to load external scripts')
    })
  },
  recaptchaV2Script: '',
  recaptchaEnterpriseScript: '',
  gapiScript: '',
}
function MS(t) {
  NS = t
}
function PS(t) {
  return `__${t}${Math.floor(Math.random() * 1e6)}`
}
function OS(t, e) {
  let n = e?.persistence || [],
    r = (Array.isArray(n) ? n : [n]).map(Jn)
  e?.errorMap && t._updateErrorMap(e.errorMap),
    t._initializeWithPersistence(r, e?.popupRedirectResolver)
}
var JF = PS('rcb'),
  ZF = new Zn(3e4, 6e4)
var XF = new Zn(2e3, 1e4)
var eL = 10 * 60 * 1e3
var tL = new Zn(3e4, 6e4)
var nL = new Zn(5e3, 15e3)
var rL = encodeURIComponent('fac')
var d_ = '@firebase/auth',
  h_ = '1.7.9'
var Hd = class {
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
    return A(this, null, function* () {
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
    re(
      this.auth._initializationPromise,
      'dependent-sdk-initialized-before-auth'
    )
  }
  updateProactiveRefresh() {
    this.internalListeners.size > 0
      ? this.auth._startProactiveRefresh()
      : this.auth._stopProactiveRefresh()
  }
}
function kS(t) {
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
function FS(t) {
  In(
    new ft(
      'auth',
      (e, { options: n }) => {
        let r = e.getProvider('app').getImmediate(),
          i = e.getProvider('heartbeat'),
          s = e.getProvider('app-check-internal'),
          { apiKey: o, authDomain: c } = r.options
        re(o && !o.includes(':'), 'invalid-api-key', { appName: r.name })
        let u = {
            apiKey: o,
            authDomain: c,
            clientPlatform: t,
            apiHost: 'identitytoolkit.googleapis.com',
            tokenApiHost: 'securetoken.googleapis.com',
            apiScheme: 'https',
            sdkClientVersion: T_(t),
          },
          d = new $d(r, i, s, u)
        return OS(d, n), d
      },
      'PUBLIC'
    )
      .setInstantiationMode('EXPLICIT')
      .setInstanceCreatedCallback((e, n, r) => {
        e.getProvider('auth-internal').initialize()
      })
  ),
    In(
      new ft(
        'auth-internal',
        (e) => {
          let n = xS(e.getProvider('auth').getImmediate())
          return ((r) => new Hd(r))(n)
        },
        'PRIVATE'
      ).setInstantiationMode('EXPLICIT')
    ),
    Re(d_, h_, kS(t)),
    Re(d_, h_, 'esm2017')
}
var LS = 5 * 60,
  iL = kv('authIdTokenMaxAge') || LS
function VS() {
  var t, e
  return (e =
    (t = document.getElementsByTagName('head')) === null || t === void 0
      ? void 0
      : t[0]) !== null && e !== void 0
    ? e
    : document
}
MS({
  loadJS(t) {
    return new Promise((e, n) => {
      let r = document.createElement('script')
      r.setAttribute('src', t),
        (r.onload = e),
        (r.onerror = (i) => {
          let s = qd('internal-error')
          ;(s.customData = i), n(s)
        }),
        (r.type = 'text/javascript'),
        (r.charset = 'UTF-8'),
        VS().appendChild(r)
    })
  },
  gapiScript: 'https://apis.google.com/js/api.js',
  recaptchaV2Script: 'https://www.google.com/recaptcha/api.js',
  recaptchaEnterpriseScript:
    'https://www.google.com/recaptcha/enterprise.js?render=',
})
FS('Browser')
var LR = 'auth'
var Sa = class {
  constructor() {
    return ss(LR)
  }
}
var D_ =
    typeof globalThis < 'u'
      ? globalThis
      : typeof window < 'u'
        ? window
        : typeof global < 'u'
          ? global
          : typeof self < 'u'
            ? self
            : {},
  b_ = {}
var En, Kd
;(function () {
  var t
  function e(w, g) {
    function y() {}
    ;(y.prototype = g.prototype),
      (w.D = g.prototype),
      (w.prototype = new y()),
      (w.prototype.constructor = w),
      (w.C = function (I, E, b) {
        for (
          var v = Array(arguments.length - 2), Ut = 2;
          Ut < arguments.length;
          Ut++
        )
          v[Ut - 2] = arguments[Ut]
        return g.prototype[E].apply(I, v)
      })
  }
  function n() {
    this.blockSize = -1
  }
  function r() {
    ;(this.blockSize = -1),
      (this.blockSize = 64),
      (this.g = Array(4)),
      (this.B = Array(this.blockSize)),
      (this.o = this.h = 0),
      this.s()
  }
  e(r, n),
    (r.prototype.s = function () {
      ;(this.g[0] = 1732584193),
        (this.g[1] = 4023233417),
        (this.g[2] = 2562383102),
        (this.g[3] = 271733878),
        (this.o = this.h = 0)
    })
  function i(w, g, y) {
    y || (y = 0)
    var I = Array(16)
    if (typeof g == 'string')
      for (var E = 0; 16 > E; ++E)
        I[E] =
          g.charCodeAt(y++) |
          (g.charCodeAt(y++) << 8) |
          (g.charCodeAt(y++) << 16) |
          (g.charCodeAt(y++) << 24)
    else
      for (E = 0; 16 > E; ++E)
        I[E] = g[y++] | (g[y++] << 8) | (g[y++] << 16) | (g[y++] << 24)
    ;(g = w.g[0]), (y = w.g[1]), (E = w.g[2])
    var b = w.g[3],
      v = (g + (b ^ (y & (E ^ b))) + I[0] + 3614090360) & 4294967295
    ;(g = y + (((v << 7) & 4294967295) | (v >>> 25))),
      (v = (b + (E ^ (g & (y ^ E))) + I[1] + 3905402710) & 4294967295),
      (b = g + (((v << 12) & 4294967295) | (v >>> 20))),
      (v = (E + (y ^ (b & (g ^ y))) + I[2] + 606105819) & 4294967295),
      (E = b + (((v << 17) & 4294967295) | (v >>> 15))),
      (v = (y + (g ^ (E & (b ^ g))) + I[3] + 3250441966) & 4294967295),
      (y = E + (((v << 22) & 4294967295) | (v >>> 10))),
      (v = (g + (b ^ (y & (E ^ b))) + I[4] + 4118548399) & 4294967295),
      (g = y + (((v << 7) & 4294967295) | (v >>> 25))),
      (v = (b + (E ^ (g & (y ^ E))) + I[5] + 1200080426) & 4294967295),
      (b = g + (((v << 12) & 4294967295) | (v >>> 20))),
      (v = (E + (y ^ (b & (g ^ y))) + I[6] + 2821735955) & 4294967295),
      (E = b + (((v << 17) & 4294967295) | (v >>> 15))),
      (v = (y + (g ^ (E & (b ^ g))) + I[7] + 4249261313) & 4294967295),
      (y = E + (((v << 22) & 4294967295) | (v >>> 10))),
      (v = (g + (b ^ (y & (E ^ b))) + I[8] + 1770035416) & 4294967295),
      (g = y + (((v << 7) & 4294967295) | (v >>> 25))),
      (v = (b + (E ^ (g & (y ^ E))) + I[9] + 2336552879) & 4294967295),
      (b = g + (((v << 12) & 4294967295) | (v >>> 20))),
      (v = (E + (y ^ (b & (g ^ y))) + I[10] + 4294925233) & 4294967295),
      (E = b + (((v << 17) & 4294967295) | (v >>> 15))),
      (v = (y + (g ^ (E & (b ^ g))) + I[11] + 2304563134) & 4294967295),
      (y = E + (((v << 22) & 4294967295) | (v >>> 10))),
      (v = (g + (b ^ (y & (E ^ b))) + I[12] + 1804603682) & 4294967295),
      (g = y + (((v << 7) & 4294967295) | (v >>> 25))),
      (v = (b + (E ^ (g & (y ^ E))) + I[13] + 4254626195) & 4294967295),
      (b = g + (((v << 12) & 4294967295) | (v >>> 20))),
      (v = (E + (y ^ (b & (g ^ y))) + I[14] + 2792965006) & 4294967295),
      (E = b + (((v << 17) & 4294967295) | (v >>> 15))),
      (v = (y + (g ^ (E & (b ^ g))) + I[15] + 1236535329) & 4294967295),
      (y = E + (((v << 22) & 4294967295) | (v >>> 10))),
      (v = (g + (E ^ (b & (y ^ E))) + I[1] + 4129170786) & 4294967295),
      (g = y + (((v << 5) & 4294967295) | (v >>> 27))),
      (v = (b + (y ^ (E & (g ^ y))) + I[6] + 3225465664) & 4294967295),
      (b = g + (((v << 9) & 4294967295) | (v >>> 23))),
      (v = (E + (g ^ (y & (b ^ g))) + I[11] + 643717713) & 4294967295),
      (E = b + (((v << 14) & 4294967295) | (v >>> 18))),
      (v = (y + (b ^ (g & (E ^ b))) + I[0] + 3921069994) & 4294967295),
      (y = E + (((v << 20) & 4294967295) | (v >>> 12))),
      (v = (g + (E ^ (b & (y ^ E))) + I[5] + 3593408605) & 4294967295),
      (g = y + (((v << 5) & 4294967295) | (v >>> 27))),
      (v = (b + (y ^ (E & (g ^ y))) + I[10] + 38016083) & 4294967295),
      (b = g + (((v << 9) & 4294967295) | (v >>> 23))),
      (v = (E + (g ^ (y & (b ^ g))) + I[15] + 3634488961) & 4294967295),
      (E = b + (((v << 14) & 4294967295) | (v >>> 18))),
      (v = (y + (b ^ (g & (E ^ b))) + I[4] + 3889429448) & 4294967295),
      (y = E + (((v << 20) & 4294967295) | (v >>> 12))),
      (v = (g + (E ^ (b & (y ^ E))) + I[9] + 568446438) & 4294967295),
      (g = y + (((v << 5) & 4294967295) | (v >>> 27))),
      (v = (b + (y ^ (E & (g ^ y))) + I[14] + 3275163606) & 4294967295),
      (b = g + (((v << 9) & 4294967295) | (v >>> 23))),
      (v = (E + (g ^ (y & (b ^ g))) + I[3] + 4107603335) & 4294967295),
      (E = b + (((v << 14) & 4294967295) | (v >>> 18))),
      (v = (y + (b ^ (g & (E ^ b))) + I[8] + 1163531501) & 4294967295),
      (y = E + (((v << 20) & 4294967295) | (v >>> 12))),
      (v = (g + (E ^ (b & (y ^ E))) + I[13] + 2850285829) & 4294967295),
      (g = y + (((v << 5) & 4294967295) | (v >>> 27))),
      (v = (b + (y ^ (E & (g ^ y))) + I[2] + 4243563512) & 4294967295),
      (b = g + (((v << 9) & 4294967295) | (v >>> 23))),
      (v = (E + (g ^ (y & (b ^ g))) + I[7] + 1735328473) & 4294967295),
      (E = b + (((v << 14) & 4294967295) | (v >>> 18))),
      (v = (y + (b ^ (g & (E ^ b))) + I[12] + 2368359562) & 4294967295),
      (y = E + (((v << 20) & 4294967295) | (v >>> 12))),
      (v = (g + (y ^ E ^ b) + I[5] + 4294588738) & 4294967295),
      (g = y + (((v << 4) & 4294967295) | (v >>> 28))),
      (v = (b + (g ^ y ^ E) + I[8] + 2272392833) & 4294967295),
      (b = g + (((v << 11) & 4294967295) | (v >>> 21))),
      (v = (E + (b ^ g ^ y) + I[11] + 1839030562) & 4294967295),
      (E = b + (((v << 16) & 4294967295) | (v >>> 16))),
      (v = (y + (E ^ b ^ g) + I[14] + 4259657740) & 4294967295),
      (y = E + (((v << 23) & 4294967295) | (v >>> 9))),
      (v = (g + (y ^ E ^ b) + I[1] + 2763975236) & 4294967295),
      (g = y + (((v << 4) & 4294967295) | (v >>> 28))),
      (v = (b + (g ^ y ^ E) + I[4] + 1272893353) & 4294967295),
      (b = g + (((v << 11) & 4294967295) | (v >>> 21))),
      (v = (E + (b ^ g ^ y) + I[7] + 4139469664) & 4294967295),
      (E = b + (((v << 16) & 4294967295) | (v >>> 16))),
      (v = (y + (E ^ b ^ g) + I[10] + 3200236656) & 4294967295),
      (y = E + (((v << 23) & 4294967295) | (v >>> 9))),
      (v = (g + (y ^ E ^ b) + I[13] + 681279174) & 4294967295),
      (g = y + (((v << 4) & 4294967295) | (v >>> 28))),
      (v = (b + (g ^ y ^ E) + I[0] + 3936430074) & 4294967295),
      (b = g + (((v << 11) & 4294967295) | (v >>> 21))),
      (v = (E + (b ^ g ^ y) + I[3] + 3572445317) & 4294967295),
      (E = b + (((v << 16) & 4294967295) | (v >>> 16))),
      (v = (y + (E ^ b ^ g) + I[6] + 76029189) & 4294967295),
      (y = E + (((v << 23) & 4294967295) | (v >>> 9))),
      (v = (g + (y ^ E ^ b) + I[9] + 3654602809) & 4294967295),
      (g = y + (((v << 4) & 4294967295) | (v >>> 28))),
      (v = (b + (g ^ y ^ E) + I[12] + 3873151461) & 4294967295),
      (b = g + (((v << 11) & 4294967295) | (v >>> 21))),
      (v = (E + (b ^ g ^ y) + I[15] + 530742520) & 4294967295),
      (E = b + (((v << 16) & 4294967295) | (v >>> 16))),
      (v = (y + (E ^ b ^ g) + I[2] + 3299628645) & 4294967295),
      (y = E + (((v << 23) & 4294967295) | (v >>> 9))),
      (v = (g + (E ^ (y | ~b)) + I[0] + 4096336452) & 4294967295),
      (g = y + (((v << 6) & 4294967295) | (v >>> 26))),
      (v = (b + (y ^ (g | ~E)) + I[7] + 1126891415) & 4294967295),
      (b = g + (((v << 10) & 4294967295) | (v >>> 22))),
      (v = (E + (g ^ (b | ~y)) + I[14] + 2878612391) & 4294967295),
      (E = b + (((v << 15) & 4294967295) | (v >>> 17))),
      (v = (y + (b ^ (E | ~g)) + I[5] + 4237533241) & 4294967295),
      (y = E + (((v << 21) & 4294967295) | (v >>> 11))),
      (v = (g + (E ^ (y | ~b)) + I[12] + 1700485571) & 4294967295),
      (g = y + (((v << 6) & 4294967295) | (v >>> 26))),
      (v = (b + (y ^ (g | ~E)) + I[3] + 2399980690) & 4294967295),
      (b = g + (((v << 10) & 4294967295) | (v >>> 22))),
      (v = (E + (g ^ (b | ~y)) + I[10] + 4293915773) & 4294967295),
      (E = b + (((v << 15) & 4294967295) | (v >>> 17))),
      (v = (y + (b ^ (E | ~g)) + I[1] + 2240044497) & 4294967295),
      (y = E + (((v << 21) & 4294967295) | (v >>> 11))),
      (v = (g + (E ^ (y | ~b)) + I[8] + 1873313359) & 4294967295),
      (g = y + (((v << 6) & 4294967295) | (v >>> 26))),
      (v = (b + (y ^ (g | ~E)) + I[15] + 4264355552) & 4294967295),
      (b = g + (((v << 10) & 4294967295) | (v >>> 22))),
      (v = (E + (g ^ (b | ~y)) + I[6] + 2734768916) & 4294967295),
      (E = b + (((v << 15) & 4294967295) | (v >>> 17))),
      (v = (y + (b ^ (E | ~g)) + I[13] + 1309151649) & 4294967295),
      (y = E + (((v << 21) & 4294967295) | (v >>> 11))),
      (v = (g + (E ^ (y | ~b)) + I[4] + 4149444226) & 4294967295),
      (g = y + (((v << 6) & 4294967295) | (v >>> 26))),
      (v = (b + (y ^ (g | ~E)) + I[11] + 3174756917) & 4294967295),
      (b = g + (((v << 10) & 4294967295) | (v >>> 22))),
      (v = (E + (g ^ (b | ~y)) + I[2] + 718787259) & 4294967295),
      (E = b + (((v << 15) & 4294967295) | (v >>> 17))),
      (v = (y + (b ^ (E | ~g)) + I[9] + 3951481745) & 4294967295),
      (w.g[0] = (w.g[0] + g) & 4294967295),
      (w.g[1] =
        (w.g[1] + (E + (((v << 21) & 4294967295) | (v >>> 11)))) & 4294967295),
      (w.g[2] = (w.g[2] + E) & 4294967295),
      (w.g[3] = (w.g[3] + b) & 4294967295)
  }
  ;(r.prototype.u = function (w, g) {
    g === void 0 && (g = w.length)
    for (var y = g - this.blockSize, I = this.B, E = this.h, b = 0; b < g; ) {
      if (E == 0) for (; b <= y; ) i(this, w, b), (b += this.blockSize)
      if (typeof w == 'string') {
        for (; b < g; )
          if (((I[E++] = w.charCodeAt(b++)), E == this.blockSize)) {
            i(this, I), (E = 0)
            break
          }
      } else
        for (; b < g; )
          if (((I[E++] = w[b++]), E == this.blockSize)) {
            i(this, I), (E = 0)
            break
          }
    }
    ;(this.h = E), (this.o += g)
  }),
    (r.prototype.v = function () {
      var w = Array(
        (56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h
      )
      w[0] = 128
      for (var g = 1; g < w.length - 8; ++g) w[g] = 0
      var y = 8 * this.o
      for (g = w.length - 8; g < w.length; ++g) (w[g] = y & 255), (y /= 256)
      for (this.u(w), w = Array(16), g = y = 0; 4 > g; ++g)
        for (var I = 0; 32 > I; I += 8) w[y++] = (this.g[g] >>> I) & 255
      return w
    })
  function s(w, g) {
    var y = c
    return Object.prototype.hasOwnProperty.call(y, w) ? y[w] : (y[w] = g(w))
  }
  function o(w, g) {
    this.h = g
    for (var y = [], I = !0, E = w.length - 1; 0 <= E; E--) {
      var b = w[E] | 0
      ;(I && b == g) || ((y[E] = b), (I = !1))
    }
    this.g = y
  }
  var c = {}
  function u(w) {
    return -128 <= w && 128 > w
      ? s(w, function (g) {
          return new o([g | 0], 0 > g ? -1 : 0)
        })
      : new o([w | 0], 0 > w ? -1 : 0)
  }
  function d(w) {
    if (isNaN(w) || !isFinite(w)) return m
    if (0 > w) return R(d(-w))
    for (var g = [], y = 1, I = 0; w >= y; I++)
      (g[I] = (w / y) | 0), (y *= 4294967296)
    return new o(g, 0)
  }
  function f(w, g) {
    if (w.length == 0) throw Error('number format error: empty string')
    if (((g = g || 10), 2 > g || 36 < g))
      throw Error('radix out of range: ' + g)
    if (w.charAt(0) == '-') return R(f(w.substring(1), g))
    if (0 <= w.indexOf('-'))
      throw Error('number format error: interior "-" character')
    for (var y = d(Math.pow(g, 8)), I = m, E = 0; E < w.length; E += 8) {
      var b = Math.min(8, w.length - E),
        v = parseInt(w.substring(E, E + b), g)
      8 > b
        ? ((b = d(Math.pow(g, b))), (I = I.j(b).add(d(v))))
        : ((I = I.j(y)), (I = I.add(d(v))))
    }
    return I
  }
  var m = u(0),
    _ = u(1),
    D = u(16777216)
  ;(t = o.prototype),
    (t.m = function () {
      if (N(this)) return -R(this).m()
      for (var w = 0, g = 1, y = 0; y < this.g.length; y++) {
        var I = this.i(y)
        ;(w += (0 <= I ? I : 4294967296 + I) * g), (g *= 4294967296)
      }
      return w
    }),
    (t.toString = function (w) {
      if (((w = w || 10), 2 > w || 36 < w))
        throw Error('radix out of range: ' + w)
      if (S(this)) return '0'
      if (N(this)) return '-' + R(this).toString(w)
      for (var g = d(Math.pow(w, 6)), y = this, I = ''; ; ) {
        var E = K(y, g).g
        y = k(y, E.j(g))
        var b = ((0 < y.g.length ? y.g[0] : y.h) >>> 0).toString(w)
        if (((y = E), S(y))) return b + I
        for (; 6 > b.length; ) b = '0' + b
        I = b + I
      }
    }),
    (t.i = function (w) {
      return 0 > w ? 0 : w < this.g.length ? this.g[w] : this.h
    })
  function S(w) {
    if (w.h != 0) return !1
    for (var g = 0; g < w.g.length; g++) if (w.g[g] != 0) return !1
    return !0
  }
  function N(w) {
    return w.h == -1
  }
  t.l = function (w) {
    return (w = k(this, w)), N(w) ? -1 : S(w) ? 0 : 1
  }
  function R(w) {
    for (var g = w.g.length, y = [], I = 0; I < g; I++) y[I] = ~w.g[I]
    return new o(y, ~w.h).add(_)
  }
  ;(t.abs = function () {
    return N(this) ? R(this) : this
  }),
    (t.add = function (w) {
      for (
        var g = Math.max(this.g.length, w.g.length), y = [], I = 0, E = 0;
        E <= g;
        E++
      ) {
        var b = I + (this.i(E) & 65535) + (w.i(E) & 65535),
          v = (b >>> 16) + (this.i(E) >>> 16) + (w.i(E) >>> 16)
        ;(I = v >>> 16), (b &= 65535), (v &= 65535), (y[E] = (v << 16) | b)
      }
      return new o(y, y[y.length - 1] & -2147483648 ? -1 : 0)
    })
  function k(w, g) {
    return w.add(R(g))
  }
  t.j = function (w) {
    if (S(this) || S(w)) return m
    if (N(this)) return N(w) ? R(this).j(R(w)) : R(R(this).j(w))
    if (N(w)) return R(this.j(R(w)))
    if (0 > this.l(D) && 0 > w.l(D)) return d(this.m() * w.m())
    for (var g = this.g.length + w.g.length, y = [], I = 0; I < 2 * g; I++)
      y[I] = 0
    for (I = 0; I < this.g.length; I++)
      for (var E = 0; E < w.g.length; E++) {
        var b = this.i(I) >>> 16,
          v = this.i(I) & 65535,
          Ut = w.i(E) >>> 16,
          oi = w.i(E) & 65535
        ;(y[2 * I + 2 * E] += v * oi),
          B(y, 2 * I + 2 * E),
          (y[2 * I + 2 * E + 1] += b * oi),
          B(y, 2 * I + 2 * E + 1),
          (y[2 * I + 2 * E + 1] += v * Ut),
          B(y, 2 * I + 2 * E + 1),
          (y[2 * I + 2 * E + 2] += b * Ut),
          B(y, 2 * I + 2 * E + 2)
      }
    for (I = 0; I < g; I++) y[I] = (y[2 * I + 1] << 16) | y[2 * I]
    for (I = g; I < 2 * g; I++) y[I] = 0
    return new o(y, 0)
  }
  function B(w, g) {
    for (; (w[g] & 65535) != w[g]; )
      (w[g + 1] += w[g] >>> 16), (w[g] &= 65535), g++
  }
  function q(w, g) {
    ;(this.g = w), (this.h = g)
  }
  function K(w, g) {
    if (S(g)) throw Error('division by zero')
    if (S(w)) return new q(m, m)
    if (N(w)) return (g = K(R(w), g)), new q(R(g.g), R(g.h))
    if (N(g)) return (g = K(w, R(g))), new q(R(g.g), g.h)
    if (30 < w.g.length) {
      if (N(w) || N(g))
        throw Error('slowDivide_ only works with positive integers.')
      for (var y = _, I = g; 0 >= I.l(w); ) (y = ce(y)), (I = ce(I))
      var E = z(y, 1),
        b = z(I, 1)
      for (I = z(I, 2), y = z(y, 2); !S(I); ) {
        var v = b.add(I)
        0 >= v.l(w) && ((E = E.add(y)), (b = v)), (I = z(I, 1)), (y = z(y, 1))
      }
      return (g = k(w, E.j(g))), new q(E, g)
    }
    for (E = m; 0 <= w.l(g); ) {
      for (
        y = Math.max(1, Math.floor(w.m() / g.m())),
          I = Math.ceil(Math.log(y) / Math.LN2),
          I = 48 >= I ? 1 : Math.pow(2, I - 48),
          b = d(y),
          v = b.j(g);
        N(v) || 0 < v.l(w);

      )
        (y -= I), (b = d(y)), (v = b.j(g))
      S(b) && (b = _), (E = E.add(b)), (w = k(w, v))
    }
    return new q(E, w)
  }
  ;(t.A = function (w) {
    return K(this, w).h
  }),
    (t.and = function (w) {
      for (
        var g = Math.max(this.g.length, w.g.length), y = [], I = 0;
        I < g;
        I++
      )
        y[I] = this.i(I) & w.i(I)
      return new o(y, this.h & w.h)
    }),
    (t.or = function (w) {
      for (
        var g = Math.max(this.g.length, w.g.length), y = [], I = 0;
        I < g;
        I++
      )
        y[I] = this.i(I) | w.i(I)
      return new o(y, this.h | w.h)
    }),
    (t.xor = function (w) {
      for (
        var g = Math.max(this.g.length, w.g.length), y = [], I = 0;
        I < g;
        I++
      )
        y[I] = this.i(I) ^ w.i(I)
      return new o(y, this.h ^ w.h)
    })
  function ce(w) {
    for (var g = w.g.length + 1, y = [], I = 0; I < g; I++)
      y[I] = (w.i(I) << 1) | (w.i(I - 1) >>> 31)
    return new o(y, w.h)
  }
  function z(w, g) {
    var y = g >> 5
    g %= 32
    for (var I = w.g.length - y, E = [], b = 0; b < I; b++)
      E[b] =
        0 < g ? (w.i(b + y) >>> g) | (w.i(b + y + 1) << (32 - g)) : w.i(b + y)
    return new o(E, w.h)
  }
  ;(r.prototype.digest = r.prototype.v),
    (r.prototype.reset = r.prototype.s),
    (r.prototype.update = r.prototype.u),
    (Kd = b_.Md5 = r),
    (o.prototype.add = o.prototype.add),
    (o.prototype.multiply = o.prototype.j),
    (o.prototype.modulo = o.prototype.A),
    (o.prototype.compare = o.prototype.l),
    (o.prototype.toNumber = o.prototype.m),
    (o.prototype.toString = o.prototype.toString),
    (o.prototype.getBits = o.prototype.i),
    (o.fromNumber = d),
    (o.fromString = f),
    (En = b_.Integer = o)
}).apply(
  typeof D_ < 'u'
    ? D_
    : typeof self < 'u'
      ? self
      : typeof window < 'u'
        ? window
        : {}
)
var Ra =
    typeof globalThis < 'u'
      ? globalThis
      : typeof window < 'u'
        ? window
        : typeof global < 'u'
          ? global
          : typeof self < 'u'
            ? self
            : {},
  Zt = {}
var Qd, VR, Lr, Yd, fs, xa, Jd, Zd, Xd
;(function () {
  var t,
    e =
      typeof Object.defineProperties == 'function'
        ? Object.defineProperty
        : function (a, l, h) {
            return (
              a == Array.prototype || a == Object.prototype || (a[l] = h.value),
              a
            )
          }
  function n(a) {
    a = [
      typeof globalThis == 'object' && globalThis,
      a,
      typeof window == 'object' && window,
      typeof self == 'object' && self,
      typeof Ra == 'object' && Ra,
    ]
    for (var l = 0; l < a.length; ++l) {
      var h = a[l]
      if (h && h.Math == Math) return h
    }
    throw Error('Cannot find global object')
  }
  var r = n(this)
  function i(a, l) {
    if (l)
      e: {
        var h = r
        a = a.split('.')
        for (var p = 0; p < a.length - 1; p++) {
          var T = a[p]
          if (!(T in h)) break e
          h = h[T]
        }
        ;(a = a[a.length - 1]),
          (p = h[a]),
          (l = l(p)),
          l != p &&
            l != null &&
            e(h, a, { configurable: !0, writable: !0, value: l })
      }
  }
  function s(a, l) {
    a instanceof String && (a += '')
    var h = 0,
      p = !1,
      T = {
        next: function () {
          if (!p && h < a.length) {
            var C = h++
            return { value: l(C, a[C]), done: !1 }
          }
          return (p = !0), { done: !0, value: void 0 }
        },
      }
    return (
      (T[Symbol.iterator] = function () {
        return T
      }),
      T
    )
  }
  i('Array.prototype.values', function (a) {
    return (
      a ||
      function () {
        return s(this, function (l, h) {
          return h
        })
      }
    )
  })
  var o = o || {},
    c = this || self
  function u(a) {
    var l = typeof a
    return (
      (l = l != 'object' ? l : a ? (Array.isArray(a) ? 'array' : l) : 'null'),
      l == 'array' || (l == 'object' && typeof a.length == 'number')
    )
  }
  function d(a) {
    var l = typeof a
    return (l == 'object' && a != null) || l == 'function'
  }
  function f(a, l, h) {
    return a.call.apply(a.bind, arguments)
  }
  function m(a, l, h) {
    if (!a) throw Error()
    if (2 < arguments.length) {
      var p = Array.prototype.slice.call(arguments, 2)
      return function () {
        var T = Array.prototype.slice.call(arguments)
        return Array.prototype.unshift.apply(T, p), a.apply(l, T)
      }
    }
    return function () {
      return a.apply(l, arguments)
    }
  }
  function _(a, l, h) {
    return (
      (_ =
        Function.prototype.bind &&
        Function.prototype.bind.toString().indexOf('native code') != -1
          ? f
          : m),
      _.apply(null, arguments)
    )
  }
  function D(a, l) {
    var h = Array.prototype.slice.call(arguments, 1)
    return function () {
      var p = h.slice()
      return p.push.apply(p, arguments), a.apply(this, p)
    }
  }
  function S(a, l) {
    function h() {}
    ;(h.prototype = l.prototype),
      (a.aa = l.prototype),
      (a.prototype = new h()),
      (a.prototype.constructor = a),
      (a.Qb = function (p, T, C) {
        for (
          var M = Array(arguments.length - 2), ae = 2;
          ae < arguments.length;
          ae++
        )
          M[ae - 2] = arguments[ae]
        return l.prototype[T].apply(p, M)
      })
  }
  function N(a) {
    let l = a.length
    if (0 < l) {
      let h = Array(l)
      for (let p = 0; p < l; p++) h[p] = a[p]
      return h
    }
    return []
  }
  function R(a, l) {
    for (let h = 1; h < arguments.length; h++) {
      let p = arguments[h]
      if (u(p)) {
        let T = a.length || 0,
          C = p.length || 0
        a.length = T + C
        for (let M = 0; M < C; M++) a[T + M] = p[M]
      } else a.push(p)
    }
  }
  class k {
    constructor(l, h) {
      ;(this.i = l), (this.j = h), (this.h = 0), (this.g = null)
    }
    get() {
      let l
      return (
        0 < this.h
          ? (this.h--, (l = this.g), (this.g = l.next), (l.next = null))
          : (l = this.i()),
        l
      )
    }
  }
  function B(a) {
    return /^[\s\xa0]*$/.test(a)
  }
  function q() {
    var a = c.navigator
    return a && (a = a.userAgent) ? a : ''
  }
  function K(a) {
    return K[' '](a), a
  }
  K[' '] = function () {}
  var ce =
    q().indexOf('Gecko') != -1 &&
    !(q().toLowerCase().indexOf('webkit') != -1 && q().indexOf('Edge') == -1) &&
    !(q().indexOf('Trident') != -1 || q().indexOf('MSIE') != -1) &&
    q().indexOf('Edge') == -1
  function z(a, l, h) {
    for (let p in a) l.call(h, a[p], p, a)
  }
  function w(a, l) {
    for (let h in a) l.call(void 0, a[h], h, a)
  }
  function g(a) {
    let l = {}
    for (let h in a) l[h] = a[h]
    return l
  }
  let y =
    'constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf'.split(
      ' '
    )
  function I(a, l) {
    let h, p
    for (let T = 1; T < arguments.length; T++) {
      p = arguments[T]
      for (h in p) a[h] = p[h]
      for (let C = 0; C < y.length; C++)
        (h = y[C]), Object.prototype.hasOwnProperty.call(p, h) && (a[h] = p[h])
    }
  }
  function E(a) {
    var l = 1
    a = a.split(':')
    let h = []
    for (; 0 < l && a.length; ) h.push(a.shift()), l--
    return a.length && h.push(a.join(':')), h
  }
  function b(a) {
    c.setTimeout(() => {
      throw a
    }, 0)
  }
  function v() {
    var a = fc
    let l = null
    return (
      a.g &&
        ((l = a.g), (a.g = a.g.next), a.g || (a.h = null), (l.next = null)),
      l
    )
  }
  class Ut {
    constructor() {
      this.h = this.g = null
    }
    add(l, h) {
      let p = oi.get()
      p.set(l, h), this.h ? (this.h.next = p) : (this.g = p), (this.h = p)
    }
  }
  var oi = new k(
    () => new mw(),
    (a) => a.reset()
  )
  class mw {
    constructor() {
      this.next = this.g = this.h = null
    }
    set(l, h) {
      ;(this.h = l), (this.g = h), (this.next = null)
    }
    reset() {
      this.next = this.g = this.h = null
    }
  }
  let ai,
    ci = !1,
    fc = new Ut(),
    Yf = () => {
      let a = c.Promise.resolve(void 0)
      ai = () => {
        a.then(gw)
      }
    }
  var gw = () => {
    for (var a; (a = v()); ) {
      try {
        a.h.call(a.g)
      } catch (h) {
        b(h)
      }
      var l = oi
      l.j(a), 100 > l.h && (l.h++, (a.next = l.g), (l.g = a))
    }
    ci = !1
  }
  function nn() {
    ;(this.s = this.s), (this.C = this.C)
  }
  ;(nn.prototype.s = !1),
    (nn.prototype.ma = function () {
      this.s || ((this.s = !0), this.N())
    }),
    (nn.prototype.N = function () {
      if (this.C) for (; this.C.length; ) this.C.shift()()
    })
  function Pe(a, l) {
    ;(this.type = a), (this.g = this.target = l), (this.defaultPrevented = !1)
  }
  Pe.prototype.h = function () {
    this.defaultPrevented = !0
  }
  var yw = (function () {
    if (!c.addEventListener || !Object.defineProperty) return !1
    var a = !1,
      l = Object.defineProperty({}, 'passive', {
        get: function () {
          a = !0
        },
      })
    try {
      let h = () => {}
      c.addEventListener('test', h, l), c.removeEventListener('test', h, l)
    } catch {}
    return a
  })()
  function ui(a, l) {
    if (
      (Pe.call(this, a ? a.type : ''),
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
      a)
    ) {
      var h = (this.type = a.type),
        p =
          a.changedTouches && a.changedTouches.length
            ? a.changedTouches[0]
            : null
      if (
        ((this.target = a.target || a.srcElement),
        (this.g = l),
        (l = a.relatedTarget))
      ) {
        if (ce) {
          e: {
            try {
              K(l.nodeName)
              var T = !0
              break e
            } catch {}
            T = !1
          }
          T || (l = null)
        }
      } else
        h == 'mouseover'
          ? (l = a.fromElement)
          : h == 'mouseout' && (l = a.toElement)
      ;(this.relatedTarget = l),
        p
          ? ((this.clientX = p.clientX !== void 0 ? p.clientX : p.pageX),
            (this.clientY = p.clientY !== void 0 ? p.clientY : p.pageY),
            (this.screenX = p.screenX || 0),
            (this.screenY = p.screenY || 0))
          : ((this.clientX = a.clientX !== void 0 ? a.clientX : a.pageX),
            (this.clientY = a.clientY !== void 0 ? a.clientY : a.pageY),
            (this.screenX = a.screenX || 0),
            (this.screenY = a.screenY || 0)),
        (this.button = a.button),
        (this.key = a.key || ''),
        (this.ctrlKey = a.ctrlKey),
        (this.altKey = a.altKey),
        (this.shiftKey = a.shiftKey),
        (this.metaKey = a.metaKey),
        (this.pointerId = a.pointerId || 0),
        (this.pointerType =
          typeof a.pointerType == 'string'
            ? a.pointerType
            : vw[a.pointerType] || ''),
        (this.state = a.state),
        (this.i = a),
        a.defaultPrevented && ui.aa.h.call(this)
    }
  }
  S(ui, Pe)
  var vw = { 2: 'touch', 3: 'pen', 4: 'mouse' }
  ui.prototype.h = function () {
    ui.aa.h.call(this)
    var a = this.i
    a.preventDefault ? a.preventDefault() : (a.returnValue = !1)
  }
  var li = 'closure_listenable_' + ((1e6 * Math.random()) | 0),
    _w = 0
  function Iw(a, l, h, p, T) {
    ;(this.listener = a),
      (this.proxy = null),
      (this.src = l),
      (this.type = h),
      (this.capture = !!p),
      (this.ha = T),
      (this.key = ++_w),
      (this.da = this.fa = !1)
  }
  function Fs(a) {
    ;(a.da = !0),
      (a.listener = null),
      (a.proxy = null),
      (a.src = null),
      (a.ha = null)
  }
  function Ls(a) {
    ;(this.src = a), (this.g = {}), (this.h = 0)
  }
  Ls.prototype.add = function (a, l, h, p, T) {
    var C = a.toString()
    ;(a = this.g[C]), a || ((a = this.g[C] = []), this.h++)
    var M = mc(a, l, p, T)
    return (
      -1 < M
        ? ((l = a[M]), h || (l.fa = !1))
        : ((l = new Iw(l, this.src, C, !!p, T)), (l.fa = h), a.push(l)),
      l
    )
  }
  function pc(a, l) {
    var h = l.type
    if (h in a.g) {
      var p = a.g[h],
        T = Array.prototype.indexOf.call(p, l, void 0),
        C
      ;(C = 0 <= T) && Array.prototype.splice.call(p, T, 1),
        C && (Fs(l), a.g[h].length == 0 && (delete a.g[h], a.h--))
    }
  }
  function mc(a, l, h, p) {
    for (var T = 0; T < a.length; ++T) {
      var C = a[T]
      if (!C.da && C.listener == l && C.capture == !!h && C.ha == p) return T
    }
    return -1
  }
  var gc = 'closure_lm_' + ((1e6 * Math.random()) | 0),
    yc = {}
  function Jf(a, l, h, p, T) {
    if (p && p.once) return Xf(a, l, h, p, T)
    if (Array.isArray(l)) {
      for (var C = 0; C < l.length; C++) Jf(a, l[C], h, p, T)
      return null
    }
    return (
      (h = wc(h)),
      a && a[li]
        ? a.K(l, h, d(p) ? !!p.capture : !!p, T)
        : Zf(a, l, h, !1, p, T)
    )
  }
  function Zf(a, l, h, p, T, C) {
    if (!l) throw Error('Invalid event type')
    var M = d(T) ? !!T.capture : !!T,
      ae = _c(a)
    if ((ae || (a[gc] = ae = new Ls(a)), (h = ae.add(l, h, p, M, C)), h.proxy))
      return h
    if (
      ((p = ww()),
      (h.proxy = p),
      (p.src = a),
      (p.listener = h),
      a.addEventListener)
    )
      yw || (T = M),
        T === void 0 && (T = !1),
        a.addEventListener(l.toString(), p, T)
    else if (a.attachEvent) a.attachEvent(tp(l.toString()), p)
    else if (a.addListener && a.removeListener) a.addListener(p)
    else throw Error('addEventListener and attachEvent are unavailable.')
    return h
  }
  function ww() {
    function a(h) {
      return l.call(a.src, a.listener, h)
    }
    let l = Ew
    return a
  }
  function Xf(a, l, h, p, T) {
    if (Array.isArray(l)) {
      for (var C = 0; C < l.length; C++) Xf(a, l[C], h, p, T)
      return null
    }
    return (
      (h = wc(h)),
      a && a[li]
        ? a.L(l, h, d(p) ? !!p.capture : !!p, T)
        : Zf(a, l, h, !0, p, T)
    )
  }
  function ep(a, l, h, p, T) {
    if (Array.isArray(l))
      for (var C = 0; C < l.length; C++) ep(a, l[C], h, p, T)
    else
      (p = d(p) ? !!p.capture : !!p),
        (h = wc(h)),
        a && a[li]
          ? ((a = a.i),
            (l = String(l).toString()),
            l in a.g &&
              ((C = a.g[l]),
              (h = mc(C, h, p, T)),
              -1 < h &&
                (Fs(C[h]),
                Array.prototype.splice.call(C, h, 1),
                C.length == 0 && (delete a.g[l], a.h--))))
          : a &&
            (a = _c(a)) &&
            ((l = a.g[l.toString()]),
            (a = -1),
            l && (a = mc(l, h, p, T)),
            (h = -1 < a ? l[a] : null) && vc(h))
  }
  function vc(a) {
    if (typeof a != 'number' && a && !a.da) {
      var l = a.src
      if (l && l[li]) pc(l.i, a)
      else {
        var h = a.type,
          p = a.proxy
        l.removeEventListener
          ? l.removeEventListener(h, p, a.capture)
          : l.detachEvent
            ? l.detachEvent(tp(h), p)
            : l.addListener && l.removeListener && l.removeListener(p),
          (h = _c(l))
            ? (pc(h, a), h.h == 0 && ((h.src = null), (l[gc] = null)))
            : Fs(a)
      }
    }
  }
  function tp(a) {
    return a in yc ? yc[a] : (yc[a] = 'on' + a)
  }
  function Ew(a, l) {
    if (a.da) a = !0
    else {
      l = new ui(l, this)
      var h = a.listener,
        p = a.ha || a.src
      a.fa && vc(a), (a = h.call(p, l))
    }
    return a
  }
  function _c(a) {
    return (a = a[gc]), a instanceof Ls ? a : null
  }
  var Ic = '__closure_events_fn_' + ((1e9 * Math.random()) >>> 0)
  function wc(a) {
    return typeof a == 'function'
      ? a
      : (a[Ic] ||
          (a[Ic] = function (l) {
            return a.handleEvent(l)
          }),
        a[Ic])
  }
  function Oe() {
    nn.call(this), (this.i = new Ls(this)), (this.M = this), (this.F = null)
  }
  S(Oe, nn),
    (Oe.prototype[li] = !0),
    (Oe.prototype.removeEventListener = function (a, l, h, p) {
      ep(this, a, l, h, p)
    })
  function He(a, l) {
    var h,
      p = a.F
    if (p) for (h = []; p; p = p.F) h.push(p)
    if (((a = a.M), (p = l.type || l), typeof l == 'string')) l = new Pe(l, a)
    else if (l instanceof Pe) l.target = l.target || a
    else {
      var T = l
      ;(l = new Pe(p, a)), I(l, T)
    }
    if (((T = !0), h))
      for (var C = h.length - 1; 0 <= C; C--) {
        var M = (l.g = h[C])
        T = Vs(M, p, !0, l) && T
      }
    if (
      ((M = l.g = a), (T = Vs(M, p, !0, l) && T), (T = Vs(M, p, !1, l) && T), h)
    )
      for (C = 0; C < h.length; C++)
        (M = l.g = h[C]), (T = Vs(M, p, !1, l) && T)
  }
  ;(Oe.prototype.N = function () {
    if ((Oe.aa.N.call(this), this.i)) {
      var a = this.i,
        l
      for (l in a.g) {
        for (var h = a.g[l], p = 0; p < h.length; p++) Fs(h[p])
        delete a.g[l], a.h--
      }
    }
    this.F = null
  }),
    (Oe.prototype.K = function (a, l, h, p) {
      return this.i.add(String(a), l, !1, h, p)
    }),
    (Oe.prototype.L = function (a, l, h, p) {
      return this.i.add(String(a), l, !0, h, p)
    })
  function Vs(a, l, h, p) {
    if (((l = a.i.g[String(l)]), !l)) return !0
    l = l.concat()
    for (var T = !0, C = 0; C < l.length; ++C) {
      var M = l[C]
      if (M && !M.da && M.capture == h) {
        var ae = M.listener,
          Ne = M.ha || M.src
        M.fa && pc(a.i, M), (T = ae.call(Ne, p) !== !1 && T)
      }
    }
    return T && !p.defaultPrevented
  }
  function np(a, l, h) {
    if (typeof a == 'function') h && (a = _(a, h))
    else if (a && typeof a.handleEvent == 'function') a = _(a.handleEvent, a)
    else throw Error('Invalid listener argument')
    return 2147483647 < Number(l) ? -1 : c.setTimeout(a, l || 0)
  }
  function rp(a) {
    a.g = np(() => {
      ;(a.g = null), a.i && ((a.i = !1), rp(a))
    }, a.l)
    let l = a.h
    ;(a.h = null), a.m.apply(null, l)
  }
  class Tw extends nn {
    constructor(l, h) {
      super(),
        (this.m = l),
        (this.l = h),
        (this.h = null),
        (this.i = !1),
        (this.g = null)
    }
    j(l) {
      ;(this.h = arguments), this.g ? (this.i = !0) : rp(this)
    }
    N() {
      super.N(),
        this.g &&
          (c.clearTimeout(this.g),
          (this.g = null),
          (this.i = !1),
          (this.h = null))
    }
  }
  function di(a) {
    nn.call(this), (this.h = a), (this.g = {})
  }
  S(di, nn)
  var ip = []
  function sp(a) {
    z(
      a.g,
      function (l, h) {
        this.g.hasOwnProperty(h) && vc(l)
      },
      a
    ),
      (a.g = {})
  }
  ;(di.prototype.N = function () {
    di.aa.N.call(this), sp(this)
  }),
    (di.prototype.handleEvent = function () {
      throw Error('EventHandler.handleEvent not implemented')
    })
  var Ec = c.JSON.stringify,
    Dw = c.JSON.parse,
    bw = class {
      stringify(a) {
        return c.JSON.stringify(a, void 0)
      }
      parse(a) {
        return c.JSON.parse(a, void 0)
      }
    }
  function Tc() {}
  Tc.prototype.h = null
  function op(a) {
    return a.h || (a.h = a.i())
  }
  function ap() {}
  var hi = { OPEN: 'a', kb: 'b', Ja: 'c', wb: 'd' }
  function Dc() {
    Pe.call(this, 'd')
  }
  S(Dc, Pe)
  function bc() {
    Pe.call(this, 'c')
  }
  S(bc, Pe)
  var An = {},
    cp = null
  function Us() {
    return (cp = cp || new Oe())
  }
  An.La = 'serverreachability'
  function up(a) {
    Pe.call(this, An.La, a)
  }
  S(up, Pe)
  function fi(a) {
    let l = Us()
    He(l, new up(l))
  }
  An.STAT_EVENT = 'statevent'
  function lp(a, l) {
    Pe.call(this, An.STAT_EVENT, a), (this.stat = l)
  }
  S(lp, Pe)
  function qe(a) {
    let l = Us()
    He(l, new lp(l, a))
  }
  An.Ma = 'timingevent'
  function dp(a, l) {
    Pe.call(this, An.Ma, a), (this.size = l)
  }
  S(dp, Pe)
  function pi(a, l) {
    if (typeof a != 'function')
      throw Error('Fn must not be null and must be a function')
    return c.setTimeout(function () {
      a()
    }, l)
  }
  function mi() {
    this.g = !0
  }
  mi.prototype.xa = function () {
    this.g = !1
  }
  function Cw(a, l, h, p, T, C) {
    a.info(function () {
      if (a.g)
        if (C)
          for (var M = '', ae = C.split('&'), Ne = 0; Ne < ae.length; Ne++) {
            var te = ae[Ne].split('=')
            if (1 < te.length) {
              var ke = te[0]
              te = te[1]
              var Fe = ke.split('_')
              M =
                2 <= Fe.length && Fe[1] == 'type'
                  ? M + (ke + '=' + te + '&')
                  : M + (ke + '=redacted&')
            }
          }
        else M = null
      else M = C
      return (
        'XMLHTTP REQ (' +
        p +
        ') [attempt ' +
        T +
        ']: ' +
        l +
        `
` +
        h +
        `
` +
        M
      )
    })
  }
  function Aw(a, l, h, p, T, C, M) {
    a.info(function () {
      return (
        'XMLHTTP RESP (' +
        p +
        ') [ attempt ' +
        T +
        ']: ' +
        l +
        `
` +
        h +
        `
` +
        C +
        ' ' +
        M
      )
    })
  }
  function cr(a, l, h, p) {
    a.info(function () {
      return 'XMLHTTP TEXT (' + l + '): ' + Rw(a, h) + (p ? ' ' + p : '')
    })
  }
  function Sw(a, l) {
    a.info(function () {
      return 'TIMEOUT: ' + l
    })
  }
  mi.prototype.info = function () {}
  function Rw(a, l) {
    if (!a.g) return l
    if (!l) return null
    try {
      var h = JSON.parse(l)
      if (h) {
        for (a = 0; a < h.length; a++)
          if (Array.isArray(h[a])) {
            var p = h[a]
            if (!(2 > p.length)) {
              var T = p[1]
              if (Array.isArray(T) && !(1 > T.length)) {
                var C = T[0]
                if (C != 'noop' && C != 'stop' && C != 'close')
                  for (var M = 1; M < T.length; M++) T[M] = ''
              }
            }
          }
      }
      return Ec(h)
    } catch {
      return l
    }
  }
  var js = {
      NO_ERROR: 0,
      gb: 1,
      tb: 2,
      sb: 3,
      nb: 4,
      rb: 5,
      ub: 6,
      Ia: 7,
      TIMEOUT: 8,
      xb: 9,
    },
    hp = {
      lb: 'complete',
      Hb: 'success',
      Ja: 'error',
      Ia: 'abort',
      zb: 'ready',
      Ab: 'readystatechange',
      TIMEOUT: 'timeout',
      vb: 'incrementaldata',
      yb: 'progress',
      ob: 'downloadprogress',
      Pb: 'uploadprogress',
    },
    Cc
  function Bs() {}
  S(Bs, Tc),
    (Bs.prototype.g = function () {
      return new XMLHttpRequest()
    }),
    (Bs.prototype.i = function () {
      return {}
    }),
    (Cc = new Bs())
  function rn(a, l, h, p) {
    ;(this.j = a),
      (this.i = l),
      (this.l = h),
      (this.R = p || 1),
      (this.U = new di(this)),
      (this.I = 45e3),
      (this.H = null),
      (this.o = !1),
      (this.m = this.A = this.v = this.L = this.F = this.S = this.B = null),
      (this.D = []),
      (this.g = null),
      (this.C = 0),
      (this.s = this.u = null),
      (this.X = -1),
      (this.J = !1),
      (this.O = 0),
      (this.M = null),
      (this.W = this.K = this.T = this.P = !1),
      (this.h = new fp())
  }
  function fp() {
    ;(this.i = null), (this.g = ''), (this.h = !1)
  }
  var pp = {},
    Ac = {}
  function Sc(a, l, h) {
    ;(a.L = 1), (a.v = zs(jt(l))), (a.m = h), (a.P = !0), mp(a, null)
  }
  function mp(a, l) {
    ;(a.F = Date.now()), $s(a), (a.A = jt(a.v))
    var h = a.A,
      p = a.R
    Array.isArray(p) || (p = [String(p)]),
      Rp(h.i, 't', p),
      (a.C = 0),
      (h = a.j.J),
      (a.h = new fp()),
      (a.g = Wp(a.j, h ? l : null, !a.m)),
      0 < a.O && (a.M = new Tw(_(a.Y, a, a.g), a.O)),
      (l = a.U),
      (h = a.g),
      (p = a.ca)
    var T = 'readystatechange'
    Array.isArray(T) || (T && (ip[0] = T.toString()), (T = ip))
    for (var C = 0; C < T.length; C++) {
      var M = Jf(h, T[C], p || l.handleEvent, !1, l.h || l)
      if (!M) break
      l.g[M.key] = M
    }
    ;(l = a.H ? g(a.H) : {}),
      a.m
        ? (a.u || (a.u = 'POST'),
          (l['Content-Type'] = 'application/x-www-form-urlencoded'),
          a.g.ea(a.A, a.u, a.m, l))
        : ((a.u = 'GET'), a.g.ea(a.A, a.u, null, l)),
      fi(),
      Cw(a.i, a.u, a.A, a.l, a.R, a.m)
  }
  ;(rn.prototype.ca = function (a) {
    a = a.target
    let l = this.M
    l && Bt(a) == 3 ? l.j() : this.Y(a)
  }),
    (rn.prototype.Y = function (a) {
      try {
        if (a == this.g)
          e: {
            let Fe = Bt(this.g)
            var l = this.g.Ba()
            let dr = this.g.Z()
            if (
              !(3 > Fe) &&
              (Fe != 3 || (this.g && (this.h.h || this.g.oa() || Fp(this.g))))
            ) {
              this.J ||
                Fe != 4 ||
                l == 7 ||
                (l == 8 || 0 >= dr ? fi(3) : fi(2)),
                Rc(this)
              var h = this.g.Z()
              this.X = h
              t: if (gp(this)) {
                var p = Fp(this.g)
                a = ''
                var T = p.length,
                  C = Bt(this.g) == 4
                if (!this.h.i) {
                  if (typeof TextDecoder > 'u') {
                    Sn(this), gi(this)
                    var M = ''
                    break t
                  }
                  this.h.i = new c.TextDecoder()
                }
                for (l = 0; l < T; l++)
                  (this.h.h = !0),
                    (a += this.h.i.decode(p[l], { stream: !(C && l == T - 1) }))
                ;(p.length = 0), (this.h.g += a), (this.C = 0), (M = this.h.g)
              } else M = this.g.oa()
              if (
                ((this.o = h == 200),
                Aw(this.i, this.u, this.A, this.l, this.R, Fe, h),
                this.o)
              ) {
                if (this.T && !this.K) {
                  t: {
                    if (this.g) {
                      var ae,
                        Ne = this.g
                      if (
                        (ae = Ne.g
                          ? Ne.g.getResponseHeader('X-HTTP-Initial-Response')
                          : null) &&
                        !B(ae)
                      ) {
                        var te = ae
                        break t
                      }
                    }
                    te = null
                  }
                  if ((h = te))
                    cr(
                      this.i,
                      this.l,
                      h,
                      'Initial handshake response via X-HTTP-Initial-Response'
                    ),
                      (this.K = !0),
                      xc(this, h)
                  else {
                    ;(this.o = !1), (this.s = 3), qe(12), Sn(this), gi(this)
                    break e
                  }
                }
                if (this.P) {
                  h = !0
                  let mt
                  for (; !this.J && this.C < M.length; )
                    if (((mt = xw(this, M)), mt == Ac)) {
                      Fe == 4 && ((this.s = 4), qe(14), (h = !1)),
                        cr(this.i, this.l, null, '[Incomplete Response]')
                      break
                    } else if (mt == pp) {
                      ;(this.s = 4),
                        qe(15),
                        cr(this.i, this.l, M, '[Invalid Chunk]'),
                        (h = !1)
                      break
                    } else cr(this.i, this.l, mt, null), xc(this, mt)
                  if (
                    (gp(this) &&
                      this.C != 0 &&
                      ((this.h.g = this.h.g.slice(this.C)), (this.C = 0)),
                    Fe != 4 ||
                      M.length != 0 ||
                      this.h.h ||
                      ((this.s = 1), qe(16), (h = !1)),
                    (this.o = this.o && h),
                    !h)
                  )
                    cr(this.i, this.l, M, '[Invalid Chunked Response]'),
                      Sn(this),
                      gi(this)
                  else if (0 < M.length && !this.W) {
                    this.W = !0
                    var ke = this.j
                    ke.g == this &&
                      ke.ba &&
                      !ke.M &&
                      (ke.j.info(
                        'Great, no buffering proxy detected. Bytes received: ' +
                          M.length
                      ),
                      Fc(ke),
                      (ke.M = !0),
                      qe(11))
                  }
                } else cr(this.i, this.l, M, null), xc(this, M)
                Fe == 4 && Sn(this),
                  this.o &&
                    !this.J &&
                    (Fe == 4 ? Hp(this.j, this) : ((this.o = !1), $s(this)))
              } else
                Ww(this.g),
                  h == 400 && 0 < M.indexOf('Unknown SID')
                    ? ((this.s = 3), qe(12))
                    : ((this.s = 0), qe(13)),
                  Sn(this),
                  gi(this)
            }
          }
      } catch {
      } finally {
      }
    })
  function gp(a) {
    return a.g ? a.u == 'GET' && a.L != 2 && a.j.Ca : !1
  }
  function xw(a, l) {
    var h = a.C,
      p = l.indexOf(
        `
`,
        h
      )
    return p == -1
      ? Ac
      : ((h = Number(l.substring(h, p))),
        isNaN(h)
          ? pp
          : ((p += 1),
            p + h > l.length
              ? Ac
              : ((l = l.slice(p, p + h)), (a.C = p + h), l)))
  }
  rn.prototype.cancel = function () {
    ;(this.J = !0), Sn(this)
  }
  function $s(a) {
    ;(a.S = Date.now() + a.I), yp(a, a.I)
  }
  function yp(a, l) {
    if (a.B != null) throw Error('WatchDog timer not null')
    a.B = pi(_(a.ba, a), l)
  }
  function Rc(a) {
    a.B && (c.clearTimeout(a.B), (a.B = null))
  }
  rn.prototype.ba = function () {
    this.B = null
    let a = Date.now()
    0 <= a - this.S
      ? (Sw(this.i, this.A),
        this.L != 2 && (fi(), qe(17)),
        Sn(this),
        (this.s = 2),
        gi(this))
      : yp(this, this.S - a)
  }
  function gi(a) {
    a.j.G == 0 || a.J || Hp(a.j, a)
  }
  function Sn(a) {
    Rc(a)
    var l = a.M
    l && typeof l.ma == 'function' && l.ma(),
      (a.M = null),
      sp(a.U),
      a.g && ((l = a.g), (a.g = null), l.abort(), l.ma())
  }
  function xc(a, l) {
    try {
      var h = a.j
      if (h.G != 0 && (h.g == a || Nc(h.h, a))) {
        if (!a.K && Nc(h.h, a) && h.G == 3) {
          try {
            var p = h.Da.g.parse(l)
          } catch {
            p = null
          }
          if (Array.isArray(p) && p.length == 3) {
            var T = p
            if (T[0] == 0) {
              e: if (!h.u) {
                if (h.g)
                  if (h.g.F + 3e3 < a.F) Ys(h), Ks(h)
                  else break e
                kc(h), qe(18)
              }
            } else
              (h.za = T[1]),
                0 < h.za - h.T &&
                  37500 > T[2] &&
                  h.F &&
                  h.v == 0 &&
                  !h.C &&
                  (h.C = pi(_(h.Za, h), 6e3))
            if (1 >= Ip(h.h) && h.ca) {
              try {
                h.ca()
              } catch {}
              h.ca = void 0
            }
          } else xn(h, 11)
        } else if (((a.K || h.g == a) && Ys(h), !B(l)))
          for (T = h.Da.g.parse(l), l = 0; l < T.length; l++) {
            let te = T[l]
            if (((h.T = te[0]), (te = te[1]), h.G == 2))
              if (te[0] == 'c') {
                ;(h.K = te[1]), (h.ia = te[2])
                let ke = te[3]
                ke != null && ((h.la = ke), h.j.info('VER=' + h.la))
                let Fe = te[4]
                Fe != null && ((h.Aa = Fe), h.j.info('SVER=' + h.Aa))
                let dr = te[5]
                dr != null &&
                  typeof dr == 'number' &&
                  0 < dr &&
                  ((p = 1.5 * dr),
                  (h.L = p),
                  h.j.info('backChannelRequestTimeoutMs_=' + p)),
                  (p = h)
                let mt = a.g
                if (mt) {
                  let Zs = mt.g
                    ? mt.g.getResponseHeader('X-Client-Wire-Protocol')
                    : null
                  if (Zs) {
                    var C = p.h
                    C.g ||
                      (Zs.indexOf('spdy') == -1 &&
                        Zs.indexOf('quic') == -1 &&
                        Zs.indexOf('h2') == -1) ||
                      ((C.j = C.l),
                      (C.g = new Set()),
                      C.h && (Mc(C, C.h), (C.h = null)))
                  }
                  if (p.D) {
                    let Lc = mt.g
                      ? mt.g.getResponseHeader('X-HTTP-Session-Id')
                      : null
                    Lc && ((p.ya = Lc), le(p.I, p.D, Lc))
                  }
                }
                ;(h.G = 3),
                  h.l && h.l.ua(),
                  h.ba &&
                    ((h.R = Date.now() - a.F),
                    h.j.info('Handshake RTT: ' + h.R + 'ms')),
                  (p = h)
                var M = a
                if (((p.qa = Gp(p, p.J ? p.ia : null, p.W)), M.K)) {
                  wp(p.h, M)
                  var ae = M,
                    Ne = p.L
                  Ne && (ae.I = Ne), ae.B && (Rc(ae), $s(ae)), (p.g = M)
                } else Bp(p)
                0 < h.i.length && Qs(h)
              } else (te[0] != 'stop' && te[0] != 'close') || xn(h, 7)
            else
              h.G == 3 &&
                (te[0] == 'stop' || te[0] == 'close'
                  ? te[0] == 'stop'
                    ? xn(h, 7)
                    : Oc(h)
                  : te[0] != 'noop' && h.l && h.l.ta(te),
                (h.v = 0))
          }
      }
      fi(4)
    } catch {}
  }
  var Nw = class {
    constructor(a, l) {
      ;(this.g = a), (this.map = l)
    }
  }
  function vp(a) {
    ;(this.l = a || 10),
      c.PerformanceNavigationTiming
        ? ((a = c.performance.getEntriesByType('navigation')),
          (a =
            0 < a.length &&
            (a[0].nextHopProtocol == 'hq' || a[0].nextHopProtocol == 'h2')))
        : (a = !!(
            c.chrome &&
            c.chrome.loadTimes &&
            c.chrome.loadTimes() &&
            c.chrome.loadTimes().wasFetchedViaSpdy
          )),
      (this.j = a ? this.l : 1),
      (this.g = null),
      1 < this.j && (this.g = new Set()),
      (this.h = null),
      (this.i = [])
  }
  function _p(a) {
    return a.h ? !0 : a.g ? a.g.size >= a.j : !1
  }
  function Ip(a) {
    return a.h ? 1 : a.g ? a.g.size : 0
  }
  function Nc(a, l) {
    return a.h ? a.h == l : a.g ? a.g.has(l) : !1
  }
  function Mc(a, l) {
    a.g ? a.g.add(l) : (a.h = l)
  }
  function wp(a, l) {
    a.h && a.h == l ? (a.h = null) : a.g && a.g.has(l) && a.g.delete(l)
  }
  vp.prototype.cancel = function () {
    if (((this.i = Ep(this)), this.h)) this.h.cancel(), (this.h = null)
    else if (this.g && this.g.size !== 0) {
      for (let a of this.g.values()) a.cancel()
      this.g.clear()
    }
  }
  function Ep(a) {
    if (a.h != null) return a.i.concat(a.h.D)
    if (a.g != null && a.g.size !== 0) {
      let l = a.i
      for (let h of a.g.values()) l = l.concat(h.D)
      return l
    }
    return N(a.i)
  }
  function Mw(a) {
    if (a.V && typeof a.V == 'function') return a.V()
    if (
      (typeof Map < 'u' && a instanceof Map) ||
      (typeof Set < 'u' && a instanceof Set)
    )
      return Array.from(a.values())
    if (typeof a == 'string') return a.split('')
    if (u(a)) {
      for (var l = [], h = a.length, p = 0; p < h; p++) l.push(a[p])
      return l
    }
    ;(l = []), (h = 0)
    for (p in a) l[h++] = a[p]
    return l
  }
  function Pw(a) {
    if (a.na && typeof a.na == 'function') return a.na()
    if (!a.V || typeof a.V != 'function') {
      if (typeof Map < 'u' && a instanceof Map) return Array.from(a.keys())
      if (!(typeof Set < 'u' && a instanceof Set)) {
        if (u(a) || typeof a == 'string') {
          var l = []
          a = a.length
          for (var h = 0; h < a; h++) l.push(h)
          return l
        }
        ;(l = []), (h = 0)
        for (let p in a) l[h++] = p
        return l
      }
    }
  }
  function Tp(a, l) {
    if (a.forEach && typeof a.forEach == 'function') a.forEach(l, void 0)
    else if (u(a) || typeof a == 'string')
      Array.prototype.forEach.call(a, l, void 0)
    else
      for (var h = Pw(a), p = Mw(a), T = p.length, C = 0; C < T; C++)
        l.call(void 0, p[C], h && h[C], a)
  }
  var Dp = RegExp(
    '^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$'
  )
  function Ow(a, l) {
    if (a) {
      a = a.split('&')
      for (var h = 0; h < a.length; h++) {
        var p = a[h].indexOf('='),
          T = null
        if (0 <= p) {
          var C = a[h].substring(0, p)
          T = a[h].substring(p + 1)
        } else C = a[h]
        l(C, T ? decodeURIComponent(T.replace(/\+/g, ' ')) : '')
      }
    }
  }
  function Rn(a) {
    if (
      ((this.g = this.o = this.j = ''),
      (this.s = null),
      (this.m = this.l = ''),
      (this.h = !1),
      a instanceof Rn)
    ) {
      ;(this.h = a.h),
        Hs(this, a.j),
        (this.o = a.o),
        (this.g = a.g),
        qs(this, a.s),
        (this.l = a.l)
      var l = a.i,
        h = new _i()
      ;(h.i = l.i),
        l.g && ((h.g = new Map(l.g)), (h.h = l.h)),
        bp(this, h),
        (this.m = a.m)
    } else
      a && (l = String(a).match(Dp))
        ? ((this.h = !1),
          Hs(this, l[1] || '', !0),
          (this.o = yi(l[2] || '')),
          (this.g = yi(l[3] || '', !0)),
          qs(this, l[4]),
          (this.l = yi(l[5] || '', !0)),
          bp(this, l[6] || '', !0),
          (this.m = yi(l[7] || '')))
        : ((this.h = !1), (this.i = new _i(null, this.h)))
  }
  Rn.prototype.toString = function () {
    var a = [],
      l = this.j
    l && a.push(vi(l, Cp, !0), ':')
    var h = this.g
    return (
      (h || l == 'file') &&
        (a.push('//'),
        (l = this.o) && a.push(vi(l, Cp, !0), '@'),
        a.push(
          encodeURIComponent(String(h)).replace(/%25([0-9a-fA-F]{2})/g, '%$1')
        ),
        (h = this.s),
        h != null && a.push(':', String(h))),
      (h = this.l) &&
        (this.g && h.charAt(0) != '/' && a.push('/'),
        a.push(vi(h, h.charAt(0) == '/' ? Lw : Fw, !0))),
      (h = this.i.toString()) && a.push('?', h),
      (h = this.m) && a.push('#', vi(h, Uw)),
      a.join('')
    )
  }
  function jt(a) {
    return new Rn(a)
  }
  function Hs(a, l, h) {
    ;(a.j = h ? yi(l, !0) : l), a.j && (a.j = a.j.replace(/:$/, ''))
  }
  function qs(a, l) {
    if (l) {
      if (((l = Number(l)), isNaN(l) || 0 > l))
        throw Error('Bad port number ' + l)
      a.s = l
    } else a.s = null
  }
  function bp(a, l, h) {
    l instanceof _i
      ? ((a.i = l), jw(a.i, a.h))
      : (h || (l = vi(l, Vw)), (a.i = new _i(l, a.h)))
  }
  function le(a, l, h) {
    a.i.set(l, h)
  }
  function zs(a) {
    return (
      le(
        a,
        'zx',
        Math.floor(2147483648 * Math.random()).toString(36) +
          Math.abs(
            Math.floor(2147483648 * Math.random()) ^ Date.now()
          ).toString(36)
      ),
      a
    )
  }
  function yi(a, l) {
    return a
      ? l
        ? decodeURI(a.replace(/%25/g, '%2525'))
        : decodeURIComponent(a)
      : ''
  }
  function vi(a, l, h) {
    return typeof a == 'string'
      ? ((a = encodeURI(a).replace(l, kw)),
        h && (a = a.replace(/%25([0-9a-fA-F]{2})/g, '%$1')),
        a)
      : null
  }
  function kw(a) {
    return (
      (a = a.charCodeAt(0)),
      '%' + ((a >> 4) & 15).toString(16) + (a & 15).toString(16)
    )
  }
  var Cp = /[#\/\?@]/g,
    Fw = /[#\?:]/g,
    Lw = /[#\?]/g,
    Vw = /[#\?@]/g,
    Uw = /#/g
  function _i(a, l) {
    ;(this.h = this.g = null), (this.i = a || null), (this.j = !!l)
  }
  function sn(a) {
    a.g ||
      ((a.g = new Map()),
      (a.h = 0),
      a.i &&
        Ow(a.i, function (l, h) {
          a.add(decodeURIComponent(l.replace(/\+/g, ' ')), h)
        }))
  }
  ;(t = _i.prototype),
    (t.add = function (a, l) {
      sn(this), (this.i = null), (a = ur(this, a))
      var h = this.g.get(a)
      return h || this.g.set(a, (h = [])), h.push(l), (this.h += 1), this
    })
  function Ap(a, l) {
    sn(a),
      (l = ur(a, l)),
      a.g.has(l) && ((a.i = null), (a.h -= a.g.get(l).length), a.g.delete(l))
  }
  function Sp(a, l) {
    return sn(a), (l = ur(a, l)), a.g.has(l)
  }
  ;(t.forEach = function (a, l) {
    sn(this),
      this.g.forEach(function (h, p) {
        h.forEach(function (T) {
          a.call(l, T, p, this)
        }, this)
      }, this)
  }),
    (t.na = function () {
      sn(this)
      let a = Array.from(this.g.values()),
        l = Array.from(this.g.keys()),
        h = []
      for (let p = 0; p < l.length; p++) {
        let T = a[p]
        for (let C = 0; C < T.length; C++) h.push(l[p])
      }
      return h
    }),
    (t.V = function (a) {
      sn(this)
      let l = []
      if (typeof a == 'string')
        Sp(this, a) && (l = l.concat(this.g.get(ur(this, a))))
      else {
        a = Array.from(this.g.values())
        for (let h = 0; h < a.length; h++) l = l.concat(a[h])
      }
      return l
    }),
    (t.set = function (a, l) {
      return (
        sn(this),
        (this.i = null),
        (a = ur(this, a)),
        Sp(this, a) && (this.h -= this.g.get(a).length),
        this.g.set(a, [l]),
        (this.h += 1),
        this
      )
    }),
    (t.get = function (a, l) {
      return a ? ((a = this.V(a)), 0 < a.length ? String(a[0]) : l) : l
    })
  function Rp(a, l, h) {
    Ap(a, l),
      0 < h.length && ((a.i = null), a.g.set(ur(a, l), N(h)), (a.h += h.length))
  }
  t.toString = function () {
    if (this.i) return this.i
    if (!this.g) return ''
    let a = [],
      l = Array.from(this.g.keys())
    for (var h = 0; h < l.length; h++) {
      var p = l[h]
      let C = encodeURIComponent(String(p)),
        M = this.V(p)
      for (p = 0; p < M.length; p++) {
        var T = C
        M[p] !== '' && (T += '=' + encodeURIComponent(String(M[p]))), a.push(T)
      }
    }
    return (this.i = a.join('&'))
  }
  function ur(a, l) {
    return (l = String(l)), a.j && (l = l.toLowerCase()), l
  }
  function jw(a, l) {
    l &&
      !a.j &&
      (sn(a),
      (a.i = null),
      a.g.forEach(function (h, p) {
        var T = p.toLowerCase()
        p != T && (Ap(this, p), Rp(this, T, h))
      }, a)),
      (a.j = l)
  }
  function Bw(a, l) {
    let h = new mi()
    if (c.Image) {
      let p = new Image()
      ;(p.onload = D(on, h, 'TestLoadImage: loaded', !0, l, p)),
        (p.onerror = D(on, h, 'TestLoadImage: error', !1, l, p)),
        (p.onabort = D(on, h, 'TestLoadImage: abort', !1, l, p)),
        (p.ontimeout = D(on, h, 'TestLoadImage: timeout', !1, l, p)),
        c.setTimeout(function () {
          p.ontimeout && p.ontimeout()
        }, 1e4),
        (p.src = a)
    } else l(!1)
  }
  function $w(a, l) {
    let h = new mi(),
      p = new AbortController(),
      T = setTimeout(() => {
        p.abort(), on(h, 'TestPingServer: timeout', !1, l)
      }, 1e4)
    fetch(a, { signal: p.signal })
      .then((C) => {
        clearTimeout(T),
          C.ok
            ? on(h, 'TestPingServer: ok', !0, l)
            : on(h, 'TestPingServer: server error', !1, l)
      })
      .catch(() => {
        clearTimeout(T), on(h, 'TestPingServer: error', !1, l)
      })
  }
  function on(a, l, h, p, T) {
    try {
      T &&
        ((T.onload = null),
        (T.onerror = null),
        (T.onabort = null),
        (T.ontimeout = null)),
        p(h)
    } catch {}
  }
  function Hw() {
    this.g = new bw()
  }
  function qw(a, l, h) {
    let p = h || ''
    try {
      Tp(a, function (T, C) {
        let M = T
        d(T) && (M = Ec(T)), l.push(p + C + '=' + encodeURIComponent(M))
      })
    } catch (T) {
      throw (l.push(p + 'type=' + encodeURIComponent('_badmap')), T)
    }
  }
  function Ii(a) {
    ;(this.l = a.Ub || null), (this.j = a.eb || !1)
  }
  S(Ii, Tc),
    (Ii.prototype.g = function () {
      return new Gs(this.l, this.j)
    }),
    (Ii.prototype.i = (function (a) {
      return function () {
        return a
      }
    })({}))
  function Gs(a, l) {
    Oe.call(this),
      (this.D = a),
      (this.o = l),
      (this.m = void 0),
      (this.status = this.readyState = 0),
      (this.responseType =
        this.responseText =
        this.response =
        this.statusText =
          ''),
      (this.onreadystatechange = null),
      (this.u = new Headers()),
      (this.h = null),
      (this.B = 'GET'),
      (this.A = ''),
      (this.g = !1),
      (this.v = this.j = this.l = null)
  }
  S(Gs, Oe),
    (t = Gs.prototype),
    (t.open = function (a, l) {
      if (this.readyState != 0)
        throw (this.abort(), Error('Error reopening a connection'))
      ;(this.B = a), (this.A = l), (this.readyState = 1), Ei(this)
    }),
    (t.send = function (a) {
      if (this.readyState != 1)
        throw (this.abort(), Error('need to call open() first. '))
      this.g = !0
      let l = {
        headers: this.u,
        method: this.B,
        credentials: this.m,
        cache: void 0,
      }
      a && (l.body = a),
        (this.D || c)
          .fetch(new Request(this.A, l))
          .then(this.Sa.bind(this), this.ga.bind(this))
    }),
    (t.abort = function () {
      ;(this.response = this.responseText = ''),
        (this.u = new Headers()),
        (this.status = 0),
        this.j && this.j.cancel('Request was aborted.').catch(() => {}),
        1 <= this.readyState &&
          this.g &&
          this.readyState != 4 &&
          ((this.g = !1), wi(this)),
        (this.readyState = 0)
    }),
    (t.Sa = function (a) {
      if (
        this.g &&
        ((this.l = a),
        this.h ||
          ((this.status = this.l.status),
          (this.statusText = this.l.statusText),
          (this.h = a.headers),
          (this.readyState = 2),
          Ei(this)),
        this.g && ((this.readyState = 3), Ei(this), this.g))
      )
        if (this.responseType === 'arraybuffer')
          a.arrayBuffer().then(this.Qa.bind(this), this.ga.bind(this))
        else if (typeof c.ReadableStream < 'u' && 'body' in a) {
          if (((this.j = a.body.getReader()), this.o)) {
            if (this.responseType)
              throw Error(
                'responseType must be empty for "streamBinaryChunks" mode responses.'
              )
            this.response = []
          } else
            (this.response = this.responseText = ''),
              (this.v = new TextDecoder())
          xp(this)
        } else a.text().then(this.Ra.bind(this), this.ga.bind(this))
    })
  function xp(a) {
    a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))
  }
  ;(t.Pa = function (a) {
    if (this.g) {
      if (this.o && a.value) this.response.push(a.value)
      else if (!this.o) {
        var l = a.value ? a.value : new Uint8Array(0)
        ;(l = this.v.decode(l, { stream: !a.done })) &&
          (this.response = this.responseText += l)
      }
      a.done ? wi(this) : Ei(this), this.readyState == 3 && xp(this)
    }
  }),
    (t.Ra = function (a) {
      this.g && ((this.response = this.responseText = a), wi(this))
    }),
    (t.Qa = function (a) {
      this.g && ((this.response = a), wi(this))
    }),
    (t.ga = function () {
      this.g && wi(this)
    })
  function wi(a) {
    ;(a.readyState = 4), (a.l = null), (a.j = null), (a.v = null), Ei(a)
  }
  ;(t.setRequestHeader = function (a, l) {
    this.u.append(a, l)
  }),
    (t.getResponseHeader = function (a) {
      return (this.h && this.h.get(a.toLowerCase())) || ''
    }),
    (t.getAllResponseHeaders = function () {
      if (!this.h) return ''
      let a = [],
        l = this.h.entries()
      for (var h = l.next(); !h.done; )
        (h = h.value), a.push(h[0] + ': ' + h[1]), (h = l.next())
      return a.join(`\r
`)
    })
  function Ei(a) {
    a.onreadystatechange && a.onreadystatechange.call(a)
  }
  Object.defineProperty(Gs.prototype, 'withCredentials', {
    get: function () {
      return this.m === 'include'
    },
    set: function (a) {
      this.m = a ? 'include' : 'same-origin'
    },
  })
  function Np(a) {
    let l = ''
    return (
      z(a, function (h, p) {
        ;(l += p),
          (l += ':'),
          (l += h),
          (l += `\r
`)
      }),
      l
    )
  }
  function Pc(a, l, h) {
    e: {
      for (p in h) {
        var p = !1
        break e
      }
      p = !0
    }
    p ||
      ((h = Np(h)),
      typeof a == 'string'
        ? h != null && encodeURIComponent(String(h))
        : le(a, l, h))
  }
  function me(a) {
    Oe.call(this),
      (this.headers = new Map()),
      (this.o = a || null),
      (this.h = !1),
      (this.v = this.g = null),
      (this.D = ''),
      (this.m = 0),
      (this.l = ''),
      (this.j = this.B = this.u = this.A = !1),
      (this.I = null),
      (this.H = ''),
      (this.J = !1)
  }
  S(me, Oe)
  var zw = /^https?$/i,
    Gw = ['POST', 'PUT']
  ;(t = me.prototype),
    (t.Ha = function (a) {
      this.J = a
    }),
    (t.ea = function (a, l, h, p) {
      if (this.g)
        throw Error(
          '[goog.net.XhrIo] Object is active with another request=' +
            this.D +
            '; newUri=' +
            a
        )
      ;(l = l ? l.toUpperCase() : 'GET'),
        (this.D = a),
        (this.l = ''),
        (this.m = 0),
        (this.A = !1),
        (this.h = !0),
        (this.g = this.o ? this.o.g() : Cc.g()),
        (this.v = this.o ? op(this.o) : op(Cc)),
        (this.g.onreadystatechange = _(this.Ea, this))
      try {
        ;(this.B = !0), this.g.open(l, String(a), !0), (this.B = !1)
      } catch (C) {
        Mp(this, C)
        return
      }
      if (((a = h || ''), (h = new Map(this.headers)), p))
        if (Object.getPrototypeOf(p) === Object.prototype)
          for (var T in p) h.set(T, p[T])
        else if (typeof p.keys == 'function' && typeof p.get == 'function')
          for (let C of p.keys()) h.set(C, p.get(C))
        else throw Error('Unknown input type for opt_headers: ' + String(p))
      ;(p = Array.from(h.keys()).find(
        (C) => C.toLowerCase() == 'content-type'
      )),
        (T = c.FormData && a instanceof c.FormData),
        !(0 <= Array.prototype.indexOf.call(Gw, l, void 0)) ||
          p ||
          T ||
          h.set(
            'Content-Type',
            'application/x-www-form-urlencoded;charset=utf-8'
          )
      for (let [C, M] of h) this.g.setRequestHeader(C, M)
      this.H && (this.g.responseType = this.H),
        'withCredentials' in this.g &&
          this.g.withCredentials !== this.J &&
          (this.g.withCredentials = this.J)
      try {
        kp(this), (this.u = !0), this.g.send(a), (this.u = !1)
      } catch (C) {
        Mp(this, C)
      }
    })
  function Mp(a, l) {
    ;(a.h = !1),
      a.g && ((a.j = !0), a.g.abort(), (a.j = !1)),
      (a.l = l),
      (a.m = 5),
      Pp(a),
      Ws(a)
  }
  function Pp(a) {
    a.A || ((a.A = !0), He(a, 'complete'), He(a, 'error'))
  }
  ;(t.abort = function (a) {
    this.g &&
      this.h &&
      ((this.h = !1),
      (this.j = !0),
      this.g.abort(),
      (this.j = !1),
      (this.m = a || 7),
      He(this, 'complete'),
      He(this, 'abort'),
      Ws(this))
  }),
    (t.N = function () {
      this.g &&
        (this.h &&
          ((this.h = !1), (this.j = !0), this.g.abort(), (this.j = !1)),
        Ws(this, !0)),
        me.aa.N.call(this)
    }),
    (t.Ea = function () {
      this.s || (this.B || this.u || this.j ? Op(this) : this.bb())
    }),
    (t.bb = function () {
      Op(this)
    })
  function Op(a) {
    if (a.h && typeof o < 'u' && (!a.v[1] || Bt(a) != 4 || a.Z() != 2)) {
      if (a.u && Bt(a) == 4) np(a.Ea, 0, a)
      else if ((He(a, 'readystatechange'), Bt(a) == 4)) {
        a.h = !1
        try {
          let M = a.Z()
          e: switch (M) {
            case 200:
            case 201:
            case 202:
            case 204:
            case 206:
            case 304:
            case 1223:
              var l = !0
              break e
            default:
              l = !1
          }
          var h
          if (!(h = l)) {
            var p
            if ((p = M === 0)) {
              var T = String(a.D).match(Dp)[1] || null
              !T &&
                c.self &&
                c.self.location &&
                (T = c.self.location.protocol.slice(0, -1)),
                (p = !zw.test(T ? T.toLowerCase() : ''))
            }
            h = p
          }
          if (h) He(a, 'complete'), He(a, 'success')
          else {
            a.m = 6
            try {
              var C = 2 < Bt(a) ? a.g.statusText : ''
            } catch {
              C = ''
            }
            ;(a.l = C + ' [' + a.Z() + ']'), Pp(a)
          }
        } finally {
          Ws(a)
        }
      }
    }
  }
  function Ws(a, l) {
    if (a.g) {
      kp(a)
      let h = a.g,
        p = a.v[0] ? () => {} : null
      ;(a.g = null), (a.v = null), l || He(a, 'ready')
      try {
        h.onreadystatechange = p
      } catch {}
    }
  }
  function kp(a) {
    a.I && (c.clearTimeout(a.I), (a.I = null))
  }
  t.isActive = function () {
    return !!this.g
  }
  function Bt(a) {
    return a.g ? a.g.readyState : 0
  }
  ;(t.Z = function () {
    try {
      return 2 < Bt(this) ? this.g.status : -1
    } catch {
      return -1
    }
  }),
    (t.oa = function () {
      try {
        return this.g ? this.g.responseText : ''
      } catch {
        return ''
      }
    }),
    (t.Oa = function (a) {
      if (this.g) {
        var l = this.g.responseText
        return a && l.indexOf(a) == 0 && (l = l.substring(a.length)), Dw(l)
      }
    })
  function Fp(a) {
    try {
      if (!a.g) return null
      if ('response' in a.g) return a.g.response
      switch (a.H) {
        case '':
        case 'text':
          return a.g.responseText
        case 'arraybuffer':
          if ('mozResponseArrayBuffer' in a.g) return a.g.mozResponseArrayBuffer
      }
      return null
    } catch {
      return null
    }
  }
  function Ww(a) {
    let l = {}
    a = ((a.g && 2 <= Bt(a) && a.g.getAllResponseHeaders()) || '').split(`\r
`)
    for (let p = 0; p < a.length; p++) {
      if (B(a[p])) continue
      var h = E(a[p])
      let T = h[0]
      if (((h = h[1]), typeof h != 'string')) continue
      h = h.trim()
      let C = l[T] || []
      ;(l[T] = C), C.push(h)
    }
    w(l, function (p) {
      return p.join(', ')
    })
  }
  ;(t.Ba = function () {
    return this.m
  }),
    (t.Ka = function () {
      return typeof this.l == 'string' ? this.l : String(this.l)
    })
  function Ti(a, l, h) {
    return (h && h.internalChannelParams && h.internalChannelParams[a]) || l
  }
  function Lp(a) {
    ;(this.Aa = 0),
      (this.i = []),
      (this.j = new mi()),
      (this.ia =
        this.qa =
        this.I =
        this.W =
        this.g =
        this.ya =
        this.D =
        this.H =
        this.m =
        this.S =
        this.o =
          null),
      (this.Ya = this.U = 0),
      (this.Va = Ti('failFast', !1, a)),
      (this.F = this.C = this.u = this.s = this.l = null),
      (this.X = !0),
      (this.za = this.T = -1),
      (this.Y = this.v = this.B = 0),
      (this.Ta = Ti('baseRetryDelayMs', 5e3, a)),
      (this.cb = Ti('retryDelaySeedMs', 1e4, a)),
      (this.Wa = Ti('forwardChannelMaxRetries', 2, a)),
      (this.wa = Ti('forwardChannelRequestTimeoutMs', 2e4, a)),
      (this.pa = (a && a.xmlHttpFactory) || void 0),
      (this.Xa = (a && a.Tb) || void 0),
      (this.Ca = (a && a.useFetchStreams) || !1),
      (this.L = void 0),
      (this.J = (a && a.supportsCrossDomainXhr) || !1),
      (this.K = ''),
      (this.h = new vp(a && a.concurrentRequestLimit)),
      (this.Da = new Hw()),
      (this.P = (a && a.fastHandshake) || !1),
      (this.O = (a && a.encodeInitMessageHeaders) || !1),
      this.P && this.O && (this.O = !1),
      (this.Ua = (a && a.Rb) || !1),
      a && a.xa && this.j.xa(),
      a && a.forceLongPolling && (this.X = !1),
      (this.ba = (!this.P && this.X && a && a.detectBufferingProxy) || !1),
      (this.ja = void 0),
      a &&
        a.longPollingTimeout &&
        0 < a.longPollingTimeout &&
        (this.ja = a.longPollingTimeout),
      (this.ca = void 0),
      (this.R = 0),
      (this.M = !1),
      (this.ka = this.A = null)
  }
  ;(t = Lp.prototype),
    (t.la = 8),
    (t.G = 1),
    (t.connect = function (a, l, h, p) {
      qe(0),
        (this.W = a),
        (this.H = l || {}),
        h && p !== void 0 && ((this.H.OSID = h), (this.H.OAID = p)),
        (this.F = this.X),
        (this.I = Gp(this, null, this.W)),
        Qs(this)
    })
  function Oc(a) {
    if ((Vp(a), a.G == 3)) {
      var l = a.U++,
        h = jt(a.I)
      if (
        (le(h, 'SID', a.K),
        le(h, 'RID', l),
        le(h, 'TYPE', 'terminate'),
        Di(a, h),
        (l = new rn(a, a.j, l)),
        (l.L = 2),
        (l.v = zs(jt(h))),
        (h = !1),
        c.navigator && c.navigator.sendBeacon)
      )
        try {
          h = c.navigator.sendBeacon(l.v.toString(), '')
        } catch {}
      !h && c.Image && ((new Image().src = l.v), (h = !0)),
        h || ((l.g = Wp(l.j, null)), l.g.ea(l.v)),
        (l.F = Date.now()),
        $s(l)
    }
    zp(a)
  }
  function Ks(a) {
    a.g && (Fc(a), a.g.cancel(), (a.g = null))
  }
  function Vp(a) {
    Ks(a),
      a.u && (c.clearTimeout(a.u), (a.u = null)),
      Ys(a),
      a.h.cancel(),
      a.s && (typeof a.s == 'number' && c.clearTimeout(a.s), (a.s = null))
  }
  function Qs(a) {
    if (!_p(a.h) && !a.s) {
      a.s = !0
      var l = a.Ga
      ai || Yf(), ci || (ai(), (ci = !0)), fc.add(l, a), (a.B = 0)
    }
  }
  function Kw(a, l) {
    return Ip(a.h) >= a.h.j - (a.s ? 1 : 0)
      ? !1
      : a.s
        ? ((a.i = l.D.concat(a.i)), !0)
        : a.G == 1 || a.G == 2 || a.B >= (a.Va ? 0 : a.Wa)
          ? !1
          : ((a.s = pi(_(a.Ga, a, l), qp(a, a.B))), a.B++, !0)
  }
  t.Ga = function (a) {
    if (this.s)
      if (((this.s = null), this.G == 1)) {
        if (!a) {
          ;(this.U = Math.floor(1e5 * Math.random())), (a = this.U++)
          let T = new rn(this, this.j, a),
            C = this.o
          if (
            (this.S && (C ? ((C = g(C)), I(C, this.S)) : (C = this.S)),
            this.m !== null || this.O || ((T.H = C), (C = null)),
            this.P)
          )
            e: {
              for (var l = 0, h = 0; h < this.i.length; h++) {
                t: {
                  var p = this.i[h]
                  if (
                    '__data__' in p.map &&
                    ((p = p.map.__data__), typeof p == 'string')
                  ) {
                    p = p.length
                    break t
                  }
                  p = void 0
                }
                if (p === void 0) break
                if (((l += p), 4096 < l)) {
                  l = h
                  break e
                }
                if (l === 4096 || h === this.i.length - 1) {
                  l = h + 1
                  break e
                }
              }
              l = 1e3
            }
          else l = 1e3
          ;(l = jp(this, T, l)),
            (h = jt(this.I)),
            le(h, 'RID', a),
            le(h, 'CVER', 22),
            this.D && le(h, 'X-HTTP-Session-Id', this.D),
            Di(this, h),
            C &&
              (this.O
                ? (l = 'headers=' + encodeURIComponent(String(Np(C))) + '&' + l)
                : this.m && Pc(h, this.m, C)),
            Mc(this.h, T),
            this.Ua && le(h, 'TYPE', 'init'),
            this.P
              ? (le(h, '$req', l),
                le(h, 'SID', 'null'),
                (T.T = !0),
                Sc(T, h, null))
              : Sc(T, h, l),
            (this.G = 2)
        }
      } else
        this.G == 3 &&
          (a ? Up(this, a) : this.i.length == 0 || _p(this.h) || Up(this))
  }
  function Up(a, l) {
    var h
    l ? (h = l.l) : (h = a.U++)
    let p = jt(a.I)
    le(p, 'SID', a.K),
      le(p, 'RID', h),
      le(p, 'AID', a.T),
      Di(a, p),
      a.m && a.o && Pc(p, a.m, a.o),
      (h = new rn(a, a.j, h, a.B + 1)),
      a.m === null && (h.H = a.o),
      l && (a.i = l.D.concat(a.i)),
      (l = jp(a, h, 1e3)),
      (h.I = Math.round(0.5 * a.wa) + Math.round(0.5 * a.wa * Math.random())),
      Mc(a.h, h),
      Sc(h, p, l)
  }
  function Di(a, l) {
    a.H &&
      z(a.H, function (h, p) {
        le(l, p, h)
      }),
      a.l &&
        Tp({}, function (h, p) {
          le(l, p, h)
        })
  }
  function jp(a, l, h) {
    h = Math.min(a.i.length, h)
    var p = a.l ? _(a.l.Na, a.l, a) : null
    e: {
      var T = a.i
      let C = -1
      for (;;) {
        let M = ['count=' + h]
        C == -1
          ? 0 < h
            ? ((C = T[0].g), M.push('ofs=' + C))
            : (C = 0)
          : M.push('ofs=' + C)
        let ae = !0
        for (let Ne = 0; Ne < h; Ne++) {
          let te = T[Ne].g,
            ke = T[Ne].map
          if (((te -= C), 0 > te)) (C = Math.max(0, T[Ne].g - 100)), (ae = !1)
          else
            try {
              qw(ke, M, 'req' + te + '_')
            } catch {
              p && p(ke)
            }
        }
        if (ae) {
          p = M.join('&')
          break e
        }
      }
    }
    return (a = a.i.splice(0, h)), (l.D = a), p
  }
  function Bp(a) {
    if (!a.g && !a.u) {
      a.Y = 1
      var l = a.Fa
      ai || Yf(), ci || (ai(), (ci = !0)), fc.add(l, a), (a.v = 0)
    }
  }
  function kc(a) {
    return a.g || a.u || 3 <= a.v
      ? !1
      : (a.Y++, (a.u = pi(_(a.Fa, a), qp(a, a.v))), a.v++, !0)
  }
  ;(t.Fa = function () {
    if (
      ((this.u = null),
      $p(this),
      this.ba && !(this.M || this.g == null || 0 >= this.R))
    ) {
      var a = 2 * this.R
      this.j.info('BP detection timer enabled: ' + a),
        (this.A = pi(_(this.ab, this), a))
    }
  }),
    (t.ab = function () {
      this.A &&
        ((this.A = null),
        this.j.info('BP detection timeout reached.'),
        this.j.info('Buffering proxy detected and switch to long-polling!'),
        (this.F = !1),
        (this.M = !0),
        qe(10),
        Ks(this),
        $p(this))
    })
  function Fc(a) {
    a.A != null && (c.clearTimeout(a.A), (a.A = null))
  }
  function $p(a) {
    ;(a.g = new rn(a, a.j, 'rpc', a.Y)),
      a.m === null && (a.g.H = a.o),
      (a.g.O = 0)
    var l = jt(a.qa)
    le(l, 'RID', 'rpc'),
      le(l, 'SID', a.K),
      le(l, 'AID', a.T),
      le(l, 'CI', a.F ? '0' : '1'),
      !a.F && a.ja && le(l, 'TO', a.ja),
      le(l, 'TYPE', 'xmlhttp'),
      Di(a, l),
      a.m && a.o && Pc(l, a.m, a.o),
      a.L && (a.g.I = a.L)
    var h = a.g
    ;(a = a.ia),
      (h.L = 1),
      (h.v = zs(jt(l))),
      (h.m = null),
      (h.P = !0),
      mp(h, a)
  }
  t.Za = function () {
    this.C != null && ((this.C = null), Ks(this), kc(this), qe(19))
  }
  function Ys(a) {
    a.C != null && (c.clearTimeout(a.C), (a.C = null))
  }
  function Hp(a, l) {
    var h = null
    if (a.g == l) {
      Ys(a), Fc(a), (a.g = null)
      var p = 2
    } else if (Nc(a.h, l)) (h = l.D), wp(a.h, l), (p = 1)
    else return
    if (a.G != 0) {
      if (l.o)
        if (p == 1) {
          ;(h = l.m ? l.m.length : 0), (l = Date.now() - l.F)
          var T = a.B
          ;(p = Us()), He(p, new dp(p, h)), Qs(a)
        } else Bp(a)
      else if (
        ((T = l.s),
        T == 3 ||
          (T == 0 && 0 < l.X) ||
          !((p == 1 && Kw(a, l)) || (p == 2 && kc(a))))
      )
        switch ((h && 0 < h.length && ((l = a.h), (l.i = l.i.concat(h))), T)) {
          case 1:
            xn(a, 5)
            break
          case 4:
            xn(a, 10)
            break
          case 3:
            xn(a, 6)
            break
          default:
            xn(a, 2)
        }
    }
  }
  function qp(a, l) {
    let h = a.Ta + Math.floor(Math.random() * a.cb)
    return a.isActive() || (h *= 2), h * l
  }
  function xn(a, l) {
    if ((a.j.info('Error code ' + l), l == 2)) {
      var h = _(a.fb, a),
        p = a.Xa
      let T = !p
      ;(p = new Rn(p || '//www.google.com/images/cleardot.gif')),
        (c.location && c.location.protocol == 'http') || Hs(p, 'https'),
        zs(p),
        T ? Bw(p.toString(), h) : $w(p.toString(), h)
    } else qe(2)
    ;(a.G = 0), a.l && a.l.sa(l), zp(a), Vp(a)
  }
  t.fb = function (a) {
    a
      ? (this.j.info('Successfully pinged google.com'), qe(2))
      : (this.j.info('Failed to ping google.com'), qe(1))
  }
  function zp(a) {
    if (((a.G = 0), (a.ka = []), a.l)) {
      let l = Ep(a.h)
      ;(l.length != 0 || a.i.length != 0) &&
        (R(a.ka, l),
        R(a.ka, a.i),
        (a.h.i.length = 0),
        N(a.i),
        (a.i.length = 0)),
        a.l.ra()
    }
  }
  function Gp(a, l, h) {
    var p = h instanceof Rn ? jt(h) : new Rn(h)
    if (p.g != '') l && (p.g = l + '.' + p.g), qs(p, p.s)
    else {
      var T = c.location
      ;(p = T.protocol),
        (l = l ? l + '.' + T.hostname : T.hostname),
        (T = +T.port)
      var C = new Rn(null)
      p && Hs(C, p), l && (C.g = l), T && qs(C, T), h && (C.l = h), (p = C)
    }
    return (
      (h = a.D),
      (l = a.ya),
      h && l && le(p, h, l),
      le(p, 'VER', a.la),
      Di(a, p),
      p
    )
  }
  function Wp(a, l, h) {
    if (l && !a.J)
      throw Error("Can't create secondary domain capable XhrIo object.")
    return (
      (l = a.Ca && !a.pa ? new me(new Ii({ eb: h })) : new me(a.pa)),
      l.Ha(a.J),
      l
    )
  }
  t.isActive = function () {
    return !!this.l && this.l.isActive(this)
  }
  function Kp() {}
  ;(t = Kp.prototype),
    (t.ua = function () {}),
    (t.ta = function () {}),
    (t.sa = function () {}),
    (t.ra = function () {}),
    (t.isActive = function () {
      return !0
    }),
    (t.Na = function () {})
  function Js() {}
  Js.prototype.g = function (a, l) {
    return new Xe(a, l)
  }
  function Xe(a, l) {
    Oe.call(this),
      (this.g = new Lp(l)),
      (this.l = a),
      (this.h = (l && l.messageUrlParams) || null),
      (a = (l && l.messageHeaders) || null),
      l &&
        l.clientProtocolHeaderRequired &&
        (a
          ? (a['X-Client-Protocol'] = 'webchannel')
          : (a = { 'X-Client-Protocol': 'webchannel' })),
      (this.g.o = a),
      (a = (l && l.initMessageHeaders) || null),
      l &&
        l.messageContentType &&
        (a
          ? (a['X-WebChannel-Content-Type'] = l.messageContentType)
          : (a = { 'X-WebChannel-Content-Type': l.messageContentType })),
      l &&
        l.va &&
        (a
          ? (a['X-WebChannel-Client-Profile'] = l.va)
          : (a = { 'X-WebChannel-Client-Profile': l.va })),
      (this.g.S = a),
      (a = l && l.Sb) && !B(a) && (this.g.m = a),
      (this.v = (l && l.supportsCrossDomainXhr) || !1),
      (this.u = (l && l.sendRawJson) || !1),
      (l = l && l.httpSessionIdParam) &&
        !B(l) &&
        ((this.g.D = l),
        (a = this.h),
        a !== null && l in a && ((a = this.h), l in a && delete a[l])),
      (this.j = new lr(this))
  }
  S(Xe, Oe),
    (Xe.prototype.m = function () {
      ;(this.g.l = this.j),
        this.v && (this.g.J = !0),
        this.g.connect(this.l, this.h || void 0)
    }),
    (Xe.prototype.close = function () {
      Oc(this.g)
    }),
    (Xe.prototype.o = function (a) {
      var l = this.g
      if (typeof a == 'string') {
        var h = {}
        ;(h.__data__ = a), (a = h)
      } else this.u && ((h = {}), (h.__data__ = Ec(a)), (a = h))
      l.i.push(new Nw(l.Ya++, a)), l.G == 3 && Qs(l)
    }),
    (Xe.prototype.N = function () {
      ;(this.g.l = null),
        delete this.j,
        Oc(this.g),
        delete this.g,
        Xe.aa.N.call(this)
    })
  function Qp(a) {
    Dc.call(this),
      a.__headers__ &&
        ((this.headers = a.__headers__),
        (this.statusCode = a.__status__),
        delete a.__headers__,
        delete a.__status__)
    var l = a.__sm__
    if (l) {
      e: {
        for (let h in l) {
          a = h
          break e
        }
        a = void 0
      }
      ;(this.i = a) &&
        ((a = this.i), (l = l !== null && a in l ? l[a] : void 0)),
        (this.data = l)
    } else this.data = a
  }
  S(Qp, Dc)
  function Yp() {
    bc.call(this), (this.status = 1)
  }
  S(Yp, bc)
  function lr(a) {
    this.g = a
  }
  S(lr, Kp),
    (lr.prototype.ua = function () {
      He(this.g, 'a')
    }),
    (lr.prototype.ta = function (a) {
      He(this.g, new Qp(a))
    }),
    (lr.prototype.sa = function (a) {
      He(this.g, new Yp())
    }),
    (lr.prototype.ra = function () {
      He(this.g, 'b')
    }),
    (Js.prototype.createWebChannel = Js.prototype.g),
    (Xe.prototype.send = Xe.prototype.o),
    (Xe.prototype.open = Xe.prototype.m),
    (Xe.prototype.close = Xe.prototype.close),
    (Xd = Zt.createWebChannelTransport =
      function () {
        return new Js()
      }),
    (Zd = Zt.getStatEventTarget =
      function () {
        return Us()
      }),
    (Jd = Zt.Event = An),
    (xa = Zt.Stat =
      {
        mb: 0,
        pb: 1,
        qb: 2,
        Jb: 3,
        Ob: 4,
        Lb: 5,
        Mb: 6,
        Kb: 7,
        Ib: 8,
        Nb: 9,
        PROXY: 10,
        NOPROXY: 11,
        Gb: 12,
        Cb: 13,
        Db: 14,
        Bb: 15,
        Eb: 16,
        Fb: 17,
        ib: 18,
        hb: 19,
        jb: 20,
      }),
    (js.NO_ERROR = 0),
    (js.TIMEOUT = 8),
    (js.HTTP_ERROR = 6),
    (fs = Zt.ErrorCode = js),
    (hp.COMPLETE = 'complete'),
    (Yd = Zt.EventType = hp),
    (ap.EventType = hi),
    (hi.OPEN = 'a'),
    (hi.CLOSE = 'b'),
    (hi.ERROR = 'c'),
    (hi.MESSAGE = 'd'),
    (Oe.prototype.listen = Oe.prototype.K),
    (Lr = Zt.WebChannel = ap),
    (VR = Zt.FetchXmlHttpFactory = Ii),
    (me.prototype.listenOnce = me.prototype.L),
    (me.prototype.getLastError = me.prototype.Ka),
    (me.prototype.getLastErrorCode = me.prototype.Ba),
    (me.prototype.getStatus = me.prototype.Z),
    (me.prototype.getResponseJson = me.prototype.Oa),
    (me.prototype.getResponseText = me.prototype.oa),
    (me.prototype.send = me.prototype.ea),
    (me.prototype.setWithCredentials = me.prototype.Ha),
    (Qd = Zt.XhrIo = me)
}).apply(
  typeof Ra < 'u'
    ? Ra
    : typeof self < 'u'
      ? self
      : typeof window < 'u'
        ? window
        : {}
)
var C_ = '@firebase/firestore'
var xe = class {
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
;(xe.UNAUTHENTICATED = new xe(null)),
  (xe.GOOGLE_CREDENTIALS = new xe('google-credentials-uid')),
  (xe.FIRST_PARTY = new xe('first-party-uid')),
  (xe.MOCK_USER = new xe('mock-user'))
var ii = '10.14.0'
var rr = new vn('@firebase/firestore')
function ps() {
  return rr.logLevel
}
function O(t, ...e) {
  if (rr.logLevel <= Y.DEBUG) {
    let n = e.map(Pf)
    rr.debug(`Firestore (${ii}): ${t}`, ...n)
  }
}
function en(t, ...e) {
  if (rr.logLevel <= Y.ERROR) {
    let n = e.map(Pf)
    rr.error(`Firestore (${ii}): ${t}`, ...n)
  }
}
function Gr(t, ...e) {
  if (rr.logLevel <= Y.WARN) {
    let n = e.map(Pf)
    rr.warn(`Firestore (${ii}): ${t}`, ...n)
  }
}
function Pf(t) {
  if (typeof t == 'string') return t
  try {
    return (function (n) {
      return JSON.stringify(n)
    })(t)
  } catch {
    return t
  }
}
function j(t = 'Unexpected state') {
  let e = `FIRESTORE (${ii}) INTERNAL ASSERTION FAILED: ` + t
  throw (en(e), new Error(e))
}
function ye(t, e) {
  t || j()
}
function X(t, e) {
  return t
}
var P = {
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
  F = class extends ht {
    constructor(e, n) {
      super(e, n),
        (this.code = e),
        (this.message = n),
        (this.toString = () =>
          `${this.name}: [code=${this.code}]: ${this.message}`)
    }
  }
var Tn = class {
  constructor() {
    this.promise = new Promise((e, n) => {
      ;(this.resolve = e), (this.reject = n)
    })
  }
}
var ka = class {
    constructor(e, n) {
      ;(this.user = n),
        (this.type = 'OAuth'),
        (this.headers = new Map()),
        this.headers.set('Authorization', `Bearer ${e}`)
    }
  },
  sh = class {
    getToken() {
      return Promise.resolve(null)
    }
    invalidateToken() {}
    start(e, n) {
      e.enqueueRetryable(() => n(xe.UNAUTHENTICATED))
    }
    shutdown() {}
  },
  oh = class {
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
  ah = class {
    constructor(e) {
      ;(this.t = e),
        (this.currentUser = xe.UNAUTHENTICATED),
        (this.i = 0),
        (this.forceRefresh = !1),
        (this.auth = null)
    }
    start(e, n) {
      ye(this.o === void 0)
      let r = this.i,
        i = (u) => (this.i !== r ? ((r = this.i), n(u)) : Promise.resolve()),
        s = new Tn()
      this.o = () => {
        this.i++,
          (this.currentUser = this.u()),
          s.resolve(),
          (s = new Tn()),
          e.enqueueRetryable(() => i(this.currentUser))
      }
      let o = () => {
          let u = s
          e.enqueueRetryable(() =>
            A(this, null, function* () {
              yield u.promise, yield i(this.currentUser)
            })
          )
        },
        c = (u) => {
          O('FirebaseAuthCredentialsProvider', 'Auth detected'),
            (this.auth = u),
            this.o && (this.auth.addAuthTokenListener(this.o), o())
        }
      this.t.onInit((u) => c(u)),
        setTimeout(() => {
          if (!this.auth) {
            let u = this.t.getImmediate({ optional: !0 })
            u
              ? c(u)
              : (O('FirebaseAuthCredentialsProvider', 'Auth not yet detected'),
                s.resolve(),
                (s = new Tn()))
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
                  ? (O(
                      'FirebaseAuthCredentialsProvider',
                      'getToken aborted due to token change.'
                    ),
                    this.getToken())
                  : r
                    ? (ye(typeof r.accessToken == 'string'),
                      new ka(r.accessToken, this.currentUser))
                    : null
              )
          : Promise.resolve(null)
      )
    }
    invalidateToken() {
      this.forceRefresh = !0
    }
    shutdown() {
      this.auth && this.o && this.auth.removeAuthTokenListener(this.o),
        (this.o = void 0)
    }
    u() {
      let e = this.auth && this.auth.getUid()
      return ye(e === null || typeof e == 'string'), new xe(e)
    }
  },
  ch = class {
    constructor(e, n, r) {
      ;(this.l = e),
        (this.h = n),
        (this.P = r),
        (this.type = 'FirstParty'),
        (this.user = xe.FIRST_PARTY),
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
  uh = class {
    constructor(e, n, r) {
      ;(this.l = e), (this.h = n), (this.P = r)
    }
    getToken() {
      return Promise.resolve(new ch(this.l, this.h, this.P))
    }
    start(e, n) {
      e.enqueueRetryable(() => n(xe.FIRST_PARTY))
    }
    shutdown() {}
    invalidateToken() {}
  },
  lh = class {
    constructor(e) {
      ;(this.value = e),
        (this.type = 'AppCheck'),
        (this.headers = new Map()),
        e && e.length > 0 && this.headers.set('x-firebase-appcheck', this.value)
    }
  },
  dh = class {
    constructor(e) {
      ;(this.A = e),
        (this.forceRefresh = !1),
        (this.appCheck = null),
        (this.R = null)
    }
    start(e, n) {
      ye(this.o === void 0)
      let r = (s) => {
        s.error != null &&
          O(
            'FirebaseAppCheckTokenProvider',
            `Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`
          )
        let o = s.token !== this.R
        return (
          (this.R = s.token),
          O(
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
        O('FirebaseAppCheckTokenProvider', 'AppCheck detected'),
          (this.appCheck = s),
          this.o && this.appCheck.addTokenListener(this.o)
      }
      this.A.onInit((s) => i(s)),
        setTimeout(() => {
          if (!this.appCheck) {
            let s = this.A.getImmediate({ optional: !0 })
            s
              ? i(s)
              : O('FirebaseAppCheckTokenProvider', 'AppCheck not yet detected')
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
                  ? (ye(typeof n.token == 'string'),
                    (this.R = n.token),
                    new lh(n.token))
                  : null
              )
          : Promise.resolve(null)
      )
    }
    invalidateToken() {
      this.forceRefresh = !0
    }
    shutdown() {
      this.appCheck && this.o && this.appCheck.removeTokenListener(this.o),
        (this.o = void 0)
    }
  }
function UR(t) {
  let e = typeof self < 'u' && (self.crypto || self.msCrypto),
    n = new Uint8Array(t)
  if (e && typeof e.getRandomValues == 'function') e.getRandomValues(n)
  else for (let r = 0; r < t; r++) n[r] = Math.floor(256 * Math.random())
  return n
}
var hh = class {
  static newId() {
    let e = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      n = Math.floor(256 / e.length) * e.length,
      r = ''
    for (; r.length < 20; ) {
      let i = UR(40)
      for (let s = 0; s < i.length; ++s)
        r.length < 20 && i[s] < n && (r += e.charAt(i[s] % e.length))
    }
    return r
  }
}
function ie(t, e) {
  return t < e ? -1 : t > e ? 1 : 0
}
function Wr(t, e, n) {
  return t.length === e.length && t.every((r, i) => n(r, e[i]))
}
var pt = class t {
  constructor(e, n) {
    if (((this.seconds = e), (this.nanoseconds = n), n < 0))
      throw new F(
        P.INVALID_ARGUMENT,
        'Timestamp nanoseconds out of range: ' + n
      )
    if (n >= 1e9)
      throw new F(
        P.INVALID_ARGUMENT,
        'Timestamp nanoseconds out of range: ' + n
      )
    if (e < -62135596800)
      throw new F(P.INVALID_ARGUMENT, 'Timestamp seconds out of range: ' + e)
    if (e >= 253402300800)
      throw new F(P.INVALID_ARGUMENT, 'Timestamp seconds out of range: ' + e)
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
      ? ie(this.nanoseconds, e.nanoseconds)
      : ie(this.seconds, e.seconds)
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
var H = class t {
  constructor(e) {
    this.timestamp = e
  }
  static fromTimestamp(e) {
    return new t(e)
  }
  static min() {
    return new t(new pt(0, 0))
  }
  static max() {
    return new t(new pt(253402300799, 999999999))
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
var Fa = class t {
    constructor(e, n, r) {
      n === void 0 ? (n = 0) : n > e.length && j(),
        r === void 0 ? (r = e.length - n) : r > e.length - n && j(),
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
  Ce = class t extends Fa {
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
          throw new F(
            P.INVALID_ARGUMENT,
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
  jR = /^[_a-zA-Z][_a-zA-Z0-9]*$/,
  Dt = class t extends Fa {
    construct(e, n, r) {
      return new t(e, n, r)
    }
    static isValidIdentifier(e) {
      return jR.test(e)
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
            throw new F(
              P.INVALID_ARGUMENT,
              `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`
            )
          n.push(r), (r = '')
        },
        o = !1
      for (; i < e.length; ) {
        let c = e[i]
        if (c === '\\') {
          if (i + 1 === e.length)
            throw new F(
              P.INVALID_ARGUMENT,
              'Path has trailing escape character: ' + e
            )
          let u = e[i + 1]
          if (u !== '\\' && u !== '.' && u !== '`')
            throw new F(
              P.INVALID_ARGUMENT,
              'Path has invalid escape sequence: ' + e
            )
          ;(r += u), (i += 2)
        } else
          c === '`'
            ? ((o = !o), i++)
            : c !== '.' || o
              ? ((r += c), i++)
              : (s(), i++)
      }
      if ((s(), o))
        throw new F(P.INVALID_ARGUMENT, 'Unterminated ` in path: ' + e)
      return new t(n)
    }
    static emptyPath() {
      return new t([])
    }
  }
var L = class t {
  constructor(e) {
    this.path = e
  }
  static fromPath(e) {
    return new t(Ce.fromString(e))
  }
  static fromName(e) {
    return new t(Ce.fromString(e).popFirst(5))
  }
  static empty() {
    return new t(Ce.emptyPath())
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
    return e !== null && Ce.comparator(this.path, e.path) === 0
  }
  toString() {
    return this.path.toString()
  }
  static comparator(e, n) {
    return Ce.comparator(e.path, n.path)
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0
  }
  static fromSegments(e) {
    return new t(new Ce(e.slice()))
  }
}
var fh = class {
  constructor(e, n, r, i) {
    ;(this.indexId = e),
      (this.collectionGroup = n),
      (this.fields = r),
      (this.indexState = i)
  }
}
fh.UNKNOWN_ID = -1
function BR(t, e) {
  let n = t.toTimestamp().seconds,
    r = t.toTimestamp().nanoseconds + 1,
    i = H.fromTimestamp(r === 1e9 ? new pt(n + 1, 0) : new pt(n, r))
  return new ir(i, L.empty(), e)
}
function $R(t) {
  return new ir(t.readTime, t.key, -1)
}
var ir = class t {
  constructor(e, n, r) {
    ;(this.readTime = e), (this.documentKey = n), (this.largestBatchId = r)
  }
  static min() {
    return new t(H.min(), L.empty(), -1)
  }
  static max() {
    return new t(H.max(), L.empty(), -1)
  }
}
function HR(t, e) {
  let n = t.readTime.compareTo(e.readTime)
  return n !== 0
    ? n
    : ((n = L.comparator(t.documentKey, e.documentKey)),
      n !== 0 ? n : ie(t.largestBatchId, e.largestBatchId))
}
var qR =
    'The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.',
  ph = class {
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
function Of(t) {
  return A(this, null, function* () {
    if (t.code !== P.FAILED_PRECONDITION || t.message !== qR) throw t
    O('LocalStore', 'Unexpectedly lost primary lease')
  })
}
var x = class t {
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
      this.callbackAttached && j(),
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
      e.forEach((c) => {
        ++i,
          c.next(
            () => {
              ++s, o && s === i && n()
            },
            (u) => r(u)
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
        c = 0
      for (let u = 0; u < s; u++) {
        let d = u
        n(e[d]).next(
          (f) => {
            ;(o[d] = f), ++c, c === s && r(o)
          },
          (f) => i(f)
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
function zR(t) {
  let e = t.match(/Android ([\d.]+)/i),
    n = e ? e[1].split('.').slice(0, 2).join('.') : '-1'
  return Number(n)
}
function Ps(t) {
  return t.name === 'IndexedDbTransactionError'
}
var oI = (() => {
  class t {
    constructor(n, r) {
      ;(this.previousValue = n),
        r &&
          ((r.sequenceNumberHandler = (i) => this.ie(i)),
          (this.se = (i) => r.writeSequenceNumber(i)))
    }
    ie(n) {
      return (
        (this.previousValue = Math.max(n, this.previousValue)),
        this.previousValue
      )
    }
    next() {
      let n = ++this.previousValue
      return this.se && this.se(n), n
    }
  }
  return (t.oe = -1), t
})()
function ac(t) {
  return t == null
}
function La(t) {
  return t === 0 && 1 / t == -1 / 0
}
var GR = [
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
  sV = [...GR, 'documentOverlays'],
  WR = [
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
  KR = WR,
  QR = [...KR, 'indexConfiguration', 'indexState', 'indexEntries']
var oV = [...QR, 'globals']
function A_(t) {
  let e = 0
  for (let n in t) Object.prototype.hasOwnProperty.call(t, n) && e++
  return e
}
function cc(t, e) {
  for (let n in t) Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n])
}
function YR(t) {
  for (let e in t) if (Object.prototype.hasOwnProperty.call(t, e)) return !1
  return !0
}
var _e = class t {
    constructor(e, n) {
      ;(this.comparator = e), (this.root = n || kt.EMPTY)
    }
    insert(e, n) {
      return new t(
        this.comparator,
        this.root
          .insert(e, n, this.comparator)
          .copy(null, null, kt.BLACK, null, null)
      )
    }
    remove(e) {
      return new t(
        this.comparator,
        this.root
          .remove(e, this.comparator)
          .copy(null, null, kt.BLACK, null, null)
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
      return new Br(this.root, null, this.comparator, !1)
    }
    getIteratorFrom(e) {
      return new Br(this.root, e, this.comparator, !1)
    }
    getReverseIterator() {
      return new Br(this.root, null, this.comparator, !0)
    }
    getReverseIteratorFrom(e) {
      return new Br(this.root, e, this.comparator, !0)
    }
  },
  Br = class {
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
  kt = class t {
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
      if ((this.isRed() && this.left.isRed()) || this.right.isRed()) throw j()
      let e = this.left.check()
      if (e !== this.right.check()) throw j()
      return e + (this.isRed() ? 0 : 1)
    }
  }
;(kt.EMPTY = null), (kt.RED = !0), (kt.BLACK = !1)
kt.EMPTY = new (class {
  constructor() {
    this.size = 0
  }
  get key() {
    throw j()
  }
  get value() {
    throw j()
  }
  get color() {
    throw j()
  }
  get left() {
    throw j()
  }
  get right() {
    throw j()
  }
  copy(e, n, r, i, s) {
    return this
  }
  insert(e, n, r) {
    return new kt(e, n)
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
var Be = class t {
    constructor(e) {
      ;(this.comparator = e), (this.data = new _e(this.comparator))
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
      return new Va(this.data.getIterator())
    }
    getIteratorFrom(e) {
      return new Va(this.data.getIteratorFrom(e))
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
  Va = class {
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
var Xn = class t {
  constructor(e) {
    ;(this.fields = e), e.sort(Dt.comparator)
  }
  static empty() {
    return new t([])
  }
  unionWith(e) {
    let n = new Be(Dt.comparator)
    for (let r of this.fields) n = n.add(r)
    for (let r of e) n = n.add(r)
    return new t(n.toArray())
  }
  covers(e) {
    for (let n of this.fields) if (n.isPrefixOf(e)) return !0
    return !1
  }
  isEqual(e) {
    return Wr(this.fields, e.fields, (n, r) => n.isEqual(r))
  }
}
var Ua = class extends Error {
  constructor() {
    super(...arguments), (this.name = 'Base64DecodeError')
  }
}
var $e = class t {
  constructor(e) {
    this.binaryString = e
  }
  static fromBase64String(e) {
    let n = (function (i) {
      try {
        return atob(i)
      } catch (s) {
        throw typeof DOMException < 'u' && s instanceof DOMException
          ? new Ua('Invalid base64 string: ' + s)
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
    return ie(this.binaryString, e.binaryString)
  }
  isEqual(e) {
    return this.binaryString === e.binaryString
  }
}
$e.EMPTY_BYTE_STRING = new $e('')
var JR = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/)
function tn(t) {
  if ((ye(!!t), typeof t == 'string')) {
    let e = 0,
      n = JR.exec(t)
    if ((ye(!!n), n[1])) {
      let i = n[1]
      ;(i = (i + '000000000').substr(0, 9)), (e = Number(i))
    }
    let r = new Date(t)
    return { seconds: Math.floor(r.getTime() / 1e3), nanos: e }
  }
  return { seconds: fe(t.seconds), nanos: fe(t.nanos) }
}
function fe(t) {
  return typeof t == 'number' ? t : typeof t == 'string' ? Number(t) : 0
}
function Dn(t) {
  return typeof t == 'string' ? $e.fromBase64String(t) : $e.fromUint8Array(t)
}
function kf(t) {
  var e, n
  return (
    ((n = (
      ((e = t?.mapValue) === null || e === void 0 ? void 0 : e.fields) || {}
    ).__type__) === null || n === void 0
      ? void 0
      : n.stringValue) === 'server_timestamp'
  )
}
function Ff(t) {
  let e = t.mapValue.fields.__previous_value__
  return kf(e) ? Ff(e) : e
}
function ws(t) {
  let e = tn(t.mapValue.fields.__local_write_time__.timestampValue)
  return new pt(e.seconds, e.nanos)
}
var mh = class {
    constructor(e, n, r, i, s, o, c, u, d) {
      ;(this.databaseId = e),
        (this.appId = n),
        (this.persistenceKey = r),
        (this.host = i),
        (this.ssl = s),
        (this.forceLongPolling = o),
        (this.autoDetectLongPolling = c),
        (this.longPollingOptions = u),
        (this.useFetchStreams = d)
    }
  },
  ja = class t {
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
var Na = { mapValue: { fields: { __type__: { stringValue: '__max__' } } } }
function sr(t) {
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
                      ? kf(t)
                        ? 4
                        : cI(t)
                          ? 9007199254740991
                          : aI(t)
                            ? 10
                            : 11
                      : j()
}
function Lt(t, e) {
  if (t === e) return !0
  let n = sr(t)
  if (n !== sr(e)) return !1
  switch (n) {
    case 0:
    case 9007199254740991:
      return !0
    case 1:
      return t.booleanValue === e.booleanValue
    case 4:
      return ws(t).isEqual(ws(e))
    case 3:
      return (function (i, s) {
        if (
          typeof i.timestampValue == 'string' &&
          typeof s.timestampValue == 'string' &&
          i.timestampValue.length === s.timestampValue.length
        )
          return i.timestampValue === s.timestampValue
        let o = tn(i.timestampValue),
          c = tn(s.timestampValue)
        return o.seconds === c.seconds && o.nanos === c.nanos
      })(t, e)
    case 5:
      return t.stringValue === e.stringValue
    case 6:
      return (function (i, s) {
        return Dn(i.bytesValue).isEqual(Dn(s.bytesValue))
      })(t, e)
    case 7:
      return t.referenceValue === e.referenceValue
    case 8:
      return (function (i, s) {
        return (
          fe(i.geoPointValue.latitude) === fe(s.geoPointValue.latitude) &&
          fe(i.geoPointValue.longitude) === fe(s.geoPointValue.longitude)
        )
      })(t, e)
    case 2:
      return (function (i, s) {
        if ('integerValue' in i && 'integerValue' in s)
          return fe(i.integerValue) === fe(s.integerValue)
        if ('doubleValue' in i && 'doubleValue' in s) {
          let o = fe(i.doubleValue),
            c = fe(s.doubleValue)
          return o === c ? La(o) === La(c) : isNaN(o) && isNaN(c)
        }
        return !1
      })(t, e)
    case 9:
      return Wr(t.arrayValue.values || [], e.arrayValue.values || [], Lt)
    case 10:
    case 11:
      return (function (i, s) {
        let o = i.mapValue.fields || {},
          c = s.mapValue.fields || {}
        if (A_(o) !== A_(c)) return !1
        for (let u in o)
          if (o.hasOwnProperty(u) && (c[u] === void 0 || !Lt(o[u], c[u])))
            return !1
        return !0
      })(t, e)
    default:
      return j()
  }
}
function Es(t, e) {
  return (t.values || []).find((n) => Lt(n, e)) !== void 0
}
function Kr(t, e) {
  if (t === e) return 0
  let n = sr(t),
    r = sr(e)
  if (n !== r) return ie(n, r)
  switch (n) {
    case 0:
    case 9007199254740991:
      return 0
    case 1:
      return ie(t.booleanValue, e.booleanValue)
    case 2:
      return (function (s, o) {
        let c = fe(s.integerValue || s.doubleValue),
          u = fe(o.integerValue || o.doubleValue)
        return c < u
          ? -1
          : c > u
            ? 1
            : c === u
              ? 0
              : isNaN(c)
                ? isNaN(u)
                  ? 0
                  : -1
                : 1
      })(t, e)
    case 3:
      return S_(t.timestampValue, e.timestampValue)
    case 4:
      return S_(ws(t), ws(e))
    case 5:
      return ie(t.stringValue, e.stringValue)
    case 6:
      return (function (s, o) {
        let c = Dn(s),
          u = Dn(o)
        return c.compareTo(u)
      })(t.bytesValue, e.bytesValue)
    case 7:
      return (function (s, o) {
        let c = s.split('/'),
          u = o.split('/')
        for (let d = 0; d < c.length && d < u.length; d++) {
          let f = ie(c[d], u[d])
          if (f !== 0) return f
        }
        return ie(c.length, u.length)
      })(t.referenceValue, e.referenceValue)
    case 8:
      return (function (s, o) {
        let c = ie(fe(s.latitude), fe(o.latitude))
        return c !== 0 ? c : ie(fe(s.longitude), fe(o.longitude))
      })(t.geoPointValue, e.geoPointValue)
    case 9:
      return R_(t.arrayValue, e.arrayValue)
    case 10:
      return (function (s, o) {
        var c, u, d, f
        let m = s.fields || {},
          _ = o.fields || {},
          D = (c = m.value) === null || c === void 0 ? void 0 : c.arrayValue,
          S = (u = _.value) === null || u === void 0 ? void 0 : u.arrayValue,
          N = ie(
            ((d = D?.values) === null || d === void 0 ? void 0 : d.length) || 0,
            ((f = S?.values) === null || f === void 0 ? void 0 : f.length) || 0
          )
        return N !== 0 ? N : R_(D, S)
      })(t.mapValue, e.mapValue)
    case 11:
      return (function (s, o) {
        if (s === Na.mapValue && o === Na.mapValue) return 0
        if (s === Na.mapValue) return 1
        if (o === Na.mapValue) return -1
        let c = s.fields || {},
          u = Object.keys(c),
          d = o.fields || {},
          f = Object.keys(d)
        u.sort(), f.sort()
        for (let m = 0; m < u.length && m < f.length; ++m) {
          let _ = ie(u[m], f[m])
          if (_ !== 0) return _
          let D = Kr(c[u[m]], d[f[m]])
          if (D !== 0) return D
        }
        return ie(u.length, f.length)
      })(t.mapValue, e.mapValue)
    default:
      throw j()
  }
}
function S_(t, e) {
  if (typeof t == 'string' && typeof e == 'string' && t.length === e.length)
    return ie(t, e)
  let n = tn(t),
    r = tn(e),
    i = ie(n.seconds, r.seconds)
  return i !== 0 ? i : ie(n.nanos, r.nanos)
}
function R_(t, e) {
  let n = t.values || [],
    r = e.values || []
  for (let i = 0; i < n.length && i < r.length; ++i) {
    let s = Kr(n[i], r[i])
    if (s) return s
  }
  return ie(n.length, r.length)
}
function Qr(t) {
  return gh(t)
}
function gh(t) {
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
                let r = tn(n)
                return `time(${r.seconds},${r.nanos})`
              })(t.timestampValue)
            : 'stringValue' in t
              ? t.stringValue
              : 'bytesValue' in t
                ? (function (n) {
                    return Dn(n).toBase64()
                  })(t.bytesValue)
                : 'referenceValue' in t
                  ? (function (n) {
                      return L.fromName(n).toString()
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
                            i ? (i = !1) : (r += ','), (r += gh(s))
                          return r + ']'
                        })(t.arrayValue)
                      : 'mapValue' in t
                        ? (function (n) {
                            let r = Object.keys(n.fields || {}).sort(),
                              i = '{',
                              s = !0
                            for (let o of r)
                              s ? (s = !1) : (i += ','),
                                (i += `${o}:${gh(n.fields[o])}`)
                            return i + '}'
                          })(t.mapValue)
                        : j()
}
function yh(t) {
  return !!t && 'integerValue' in t
}
function Lf(t) {
  return !!t && 'arrayValue' in t
}
function x_(t) {
  return !!t && 'nullValue' in t
}
function N_(t) {
  return !!t && 'doubleValue' in t && isNaN(Number(t.doubleValue))
}
function eh(t) {
  return !!t && 'mapValue' in t
}
function aI(t) {
  var e, n
  return (
    ((n = (
      ((e = t?.mapValue) === null || e === void 0 ? void 0 : e.fields) || {}
    ).__type__) === null || n === void 0
      ? void 0
      : n.stringValue) === '__vector__'
  )
}
function gs(t) {
  if (t.geoPointValue)
    return { geoPointValue: Object.assign({}, t.geoPointValue) }
  if (t.timestampValue && typeof t.timestampValue == 'object')
    return { timestampValue: Object.assign({}, t.timestampValue) }
  if (t.mapValue) {
    let e = { mapValue: { fields: {} } }
    return cc(t.mapValue.fields, (n, r) => (e.mapValue.fields[n] = gs(r))), e
  }
  if (t.arrayValue) {
    let e = { arrayValue: { values: [] } }
    for (let n = 0; n < (t.arrayValue.values || []).length; ++n)
      e.arrayValue.values[n] = gs(t.arrayValue.values[n])
    return e
  }
  return Object.assign({}, t)
}
function cI(t) {
  return (
    (((t.mapValue || {}).fields || {}).__type__ || {}).stringValue === '__max__'
  )
}
var Xt = class t {
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
        if (((n = (n.mapValue.fields || {})[e.get(r)]), !eh(n))) return null
      return (n = (n.mapValue.fields || {})[e.lastSegment()]), n || null
    }
  }
  set(e, n) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = gs(n)
  }
  setAll(e) {
    let n = Dt.emptyPath(),
      r = {},
      i = []
    e.forEach((o, c) => {
      if (!n.isImmediateParentOf(c)) {
        let u = this.getFieldsMap(n)
        this.applyChanges(u, r, i), (r = {}), (i = []), (n = c.popLast())
      }
      o ? (r[c.lastSegment()] = gs(o)) : i.push(c.lastSegment())
    })
    let s = this.getFieldsMap(n)
    this.applyChanges(s, r, i)
  }
  delete(e) {
    let n = this.field(e.popLast())
    eh(n) && n.mapValue.fields && delete n.mapValue.fields[e.lastSegment()]
  }
  isEqual(e) {
    return Lt(this.value, e.value)
  }
  getFieldsMap(e) {
    let n = this.value
    n.mapValue.fields || (n.mapValue = { fields: {} })
    for (let r = 0; r < e.length; ++r) {
      let i = n.mapValue.fields[e.get(r)]
      ;(eh(i) && i.mapValue.fields) ||
        ((i = { mapValue: { fields: {} } }), (n.mapValue.fields[e.get(r)] = i)),
        (n = i)
    }
    return n.mapValue.fields
  }
  applyChanges(e, n, r) {
    cc(n, (i, s) => (e[i] = s))
    for (let i of r) delete e[i]
  }
  clone() {
    return new t(gs(this.value))
  }
}
var bt = class t {
  constructor(e, n, r, i, s, o, c) {
    ;(this.key = e),
      (this.documentType = n),
      (this.version = r),
      (this.readTime = i),
      (this.createTime = s),
      (this.data = o),
      (this.documentState = c)
  }
  static newInvalidDocument(e) {
    return new t(e, 0, H.min(), H.min(), H.min(), Xt.empty(), 0)
  }
  static newFoundDocument(e, n, r, i) {
    return new t(e, 1, n, H.min(), r, i, 0)
  }
  static newNoDocument(e, n) {
    return new t(e, 2, n, H.min(), H.min(), Xt.empty(), 0)
  }
  static newUnknownDocument(e, n) {
    return new t(e, 3, n, H.min(), H.min(), Xt.empty(), 2)
  }
  convertToFoundDocument(e, n) {
    return (
      !this.createTime.isEqual(H.min()) ||
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
      (this.data = Xt.empty()),
      (this.documentState = 0),
      this
    )
  }
  convertToUnknownDocument(e) {
    return (
      (this.version = e),
      (this.documentType = 3),
      (this.data = Xt.empty()),
      (this.documentState = 2),
      this
    )
  }
  setHasCommittedMutations() {
    return (this.documentState = 2), this
  }
  setHasLocalMutations() {
    return (this.documentState = 1), (this.version = H.min()), this
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
var Yr = class {
  constructor(e, n) {
    ;(this.position = e), (this.inclusive = n)
  }
}
function M_(t, e, n) {
  let r = 0
  for (let i = 0; i < t.position.length; i++) {
    let s = e[i],
      o = t.position[i]
    if (
      (s.field.isKeyField()
        ? (r = L.comparator(L.fromName(o.referenceValue), n.key))
        : (r = Kr(o, n.data.field(s.field))),
      s.dir === 'desc' && (r *= -1),
      r !== 0)
    )
      break
  }
  return r
}
function P_(t, e) {
  if (t === null) return e === null
  if (
    e === null ||
    t.inclusive !== e.inclusive ||
    t.position.length !== e.position.length
  )
    return !1
  for (let n = 0; n < t.position.length; n++)
    if (!Lt(t.position[n], e.position[n])) return !1
  return !0
}
var Jr = class {
  constructor(e, n = 'asc') {
    ;(this.field = e), (this.dir = n)
  }
}
function ZR(t, e) {
  return t.dir === e.dir && t.field.isEqual(e.field)
}
var Ba = class {},
  Se = class t extends Ba {
    constructor(e, n, r) {
      super(), (this.field = e), (this.op = n), (this.value = r)
    }
    static create(e, n, r) {
      return e.isKeyField()
        ? n === 'in' || n === 'not-in'
          ? this.createKeyFieldInFilter(e, n, r)
          : new _h(e, n, r)
        : n === 'array-contains'
          ? new Eh(e, r)
          : n === 'in'
            ? new Th(e, r)
            : n === 'not-in'
              ? new Dh(e, r)
              : n === 'array-contains-any'
                ? new bh(e, r)
                : new t(e, n, r)
    }
    static createKeyFieldInFilter(e, n, r) {
      return n === 'in' ? new Ih(e, r) : new wh(e, r)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return this.op === '!='
        ? n !== null && this.matchesComparison(Kr(n, this.value))
        : n !== null &&
            sr(this.value) === sr(n) &&
            this.matchesComparison(Kr(n, this.value))
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
          return j()
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
  Vt = class t extends Ba {
    constructor(e, n) {
      super(), (this.filters = e), (this.op = n), (this.ae = null)
    }
    static create(e, n) {
      return new t(e, n)
    }
    matches(e) {
      return uI(this)
        ? this.filters.find((n) => !n.matches(e)) === void 0
        : this.filters.find((n) => n.matches(e)) !== void 0
    }
    getFlattenedFilters() {
      return (
        this.ae !== null ||
          (this.ae = this.filters.reduce(
            (e, n) => e.concat(n.getFlattenedFilters()),
            []
          )),
        this.ae
      )
    }
    getFilters() {
      return Object.assign([], this.filters)
    }
  }
function uI(t) {
  return t.op === 'and'
}
function lI(t) {
  return XR(t) && uI(t)
}
function XR(t) {
  for (let e of t.filters) if (e instanceof Vt) return !1
  return !0
}
function vh(t) {
  if (t instanceof Se)
    return t.field.canonicalString() + t.op.toString() + Qr(t.value)
  if (lI(t)) return t.filters.map((e) => vh(e)).join(',')
  {
    let e = t.filters.map((n) => vh(n)).join(',')
    return `${t.op}(${e})`
  }
}
function dI(t, e) {
  return t instanceof Se
    ? (function (r, i) {
        return (
          i instanceof Se &&
          r.op === i.op &&
          r.field.isEqual(i.field) &&
          Lt(r.value, i.value)
        )
      })(t, e)
    : t instanceof Vt
      ? (function (r, i) {
          return i instanceof Vt &&
            r.op === i.op &&
            r.filters.length === i.filters.length
            ? r.filters.reduce((s, o, c) => s && dI(o, i.filters[c]), !0)
            : !1
        })(t, e)
      : void j()
}
function hI(t) {
  return t instanceof Se
    ? (function (n) {
        return `${n.field.canonicalString()} ${n.op} ${Qr(n.value)}`
      })(t)
    : t instanceof Vt
      ? (function (n) {
          return (
            n.op.toString() + ' {' + n.getFilters().map(hI).join(' ,') + '}'
          )
        })(t)
      : 'Filter'
}
var _h = class extends Se {
    constructor(e, n, r) {
      super(e, n, r), (this.key = L.fromName(r.referenceValue))
    }
    matches(e) {
      let n = L.comparator(e.key, this.key)
      return this.matchesComparison(n)
    }
  },
  Ih = class extends Se {
    constructor(e, n) {
      super(e, 'in', n), (this.keys = fI('in', n))
    }
    matches(e) {
      return this.keys.some((n) => n.isEqual(e.key))
    }
  },
  wh = class extends Se {
    constructor(e, n) {
      super(e, 'not-in', n), (this.keys = fI('not-in', n))
    }
    matches(e) {
      return !this.keys.some((n) => n.isEqual(e.key))
    }
  }
function fI(t, e) {
  var n
  return (
    ((n = e.arrayValue) === null || n === void 0 ? void 0 : n.values) || []
  ).map((r) => L.fromName(r.referenceValue))
}
var Eh = class extends Se {
    constructor(e, n) {
      super(e, 'array-contains', n)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return Lf(n) && Es(n.arrayValue, this.value)
    }
  },
  Th = class extends Se {
    constructor(e, n) {
      super(e, 'in', n)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return n !== null && Es(this.value.arrayValue, n)
    }
  },
  Dh = class extends Se {
    constructor(e, n) {
      super(e, 'not-in', n)
    }
    matches(e) {
      if (Es(this.value.arrayValue, { nullValue: 'NULL_VALUE' })) return !1
      let n = e.data.field(this.field)
      return n !== null && !Es(this.value.arrayValue, n)
    }
  },
  bh = class extends Se {
    constructor(e, n) {
      super(e, 'array-contains-any', n)
    }
    matches(e) {
      let n = e.data.field(this.field)
      return (
        !(!Lf(n) || !n.arrayValue.values) &&
        n.arrayValue.values.some((r) => Es(this.value.arrayValue, r))
      )
    }
  }
var Ch = class {
  constructor(e, n = null, r = [], i = [], s = null, o = null, c = null) {
    ;(this.path = e),
      (this.collectionGroup = n),
      (this.orderBy = r),
      (this.filters = i),
      (this.limit = s),
      (this.startAt = o),
      (this.endAt = c),
      (this.ue = null)
  }
}
function O_(t, e = null, n = [], r = [], i = null, s = null, o = null) {
  return new Ch(t, e, n, r, i, s, o)
}
function Vf(t) {
  let e = X(t)
  if (e.ue === null) {
    let n = e.path.canonicalString()
    e.collectionGroup !== null && (n += '|cg:' + e.collectionGroup),
      (n += '|f:'),
      (n += e.filters.map((r) => vh(r)).join(',')),
      (n += '|ob:'),
      (n += e.orderBy
        .map((r) =>
          (function (s) {
            return s.field.canonicalString() + s.dir
          })(r)
        )
        .join(',')),
      ac(e.limit) || ((n += '|l:'), (n += e.limit)),
      e.startAt &&
        ((n += '|lb:'),
        (n += e.startAt.inclusive ? 'b:' : 'a:'),
        (n += e.startAt.position.map((r) => Qr(r)).join(','))),
      e.endAt &&
        ((n += '|ub:'),
        (n += e.endAt.inclusive ? 'a:' : 'b:'),
        (n += e.endAt.position.map((r) => Qr(r)).join(','))),
      (e.ue = n)
  }
  return e.ue
}
function Uf(t, e) {
  if (t.limit !== e.limit || t.orderBy.length !== e.orderBy.length) return !1
  for (let n = 0; n < t.orderBy.length; n++)
    if (!ZR(t.orderBy[n], e.orderBy[n])) return !1
  if (t.filters.length !== e.filters.length) return !1
  for (let n = 0; n < t.filters.length; n++)
    if (!dI(t.filters[n], e.filters[n])) return !1
  return (
    t.collectionGroup === e.collectionGroup &&
    !!t.path.isEqual(e.path) &&
    !!P_(t.startAt, e.startAt) &&
    P_(t.endAt, e.endAt)
  )
}
function Ah(t) {
  return (
    L.isDocumentKey(t.path) &&
    t.collectionGroup === null &&
    t.filters.length === 0
  )
}
var Zr = class {
  constructor(
    e,
    n = null,
    r = [],
    i = [],
    s = null,
    o = 'F',
    c = null,
    u = null
  ) {
    ;(this.path = e),
      (this.collectionGroup = n),
      (this.explicitOrderBy = r),
      (this.filters = i),
      (this.limit = s),
      (this.limitType = o),
      (this.startAt = c),
      (this.endAt = u),
      (this.ce = null),
      (this.le = null),
      (this.he = null),
      this.startAt,
      this.endAt
  }
}
function ex(t, e, n, r, i, s, o, c) {
  return new Zr(t, e, n, r, i, s, o, c)
}
function jf(t) {
  return new Zr(t)
}
function k_(t) {
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
function tx(t) {
  return t.collectionGroup !== null
}
function ys(t) {
  let e = X(t)
  if (e.ce === null) {
    e.ce = []
    let n = new Set()
    for (let s of e.explicitOrderBy)
      e.ce.push(s), n.add(s.field.canonicalString())
    let r =
      e.explicitOrderBy.length > 0
        ? e.explicitOrderBy[e.explicitOrderBy.length - 1].dir
        : 'asc'
    ;(function (o) {
      let c = new Be(Dt.comparator)
      return (
        o.filters.forEach((u) => {
          u.getFlattenedFilters().forEach((d) => {
            d.isInequality() && (c = c.add(d.field))
          })
        }),
        c
      )
    })(e).forEach((s) => {
      n.has(s.canonicalString()) || s.isKeyField() || e.ce.push(new Jr(s, r))
    }),
      n.has(Dt.keyField().canonicalString()) ||
        e.ce.push(new Jr(Dt.keyField(), r))
  }
  return e.ce
}
function Ft(t) {
  let e = X(t)
  return e.le || (e.le = nx(e, ys(t))), e.le
}
function nx(t, e) {
  if (t.limitType === 'F')
    return O_(
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
      return new Jr(i.field, s)
    })
    let n = t.endAt ? new Yr(t.endAt.position, t.endAt.inclusive) : null,
      r = t.startAt ? new Yr(t.startAt.position, t.startAt.inclusive) : null
    return O_(t.path, t.collectionGroup, e, t.filters, t.limit, n, r)
  }
}
function Sh(t, e, n) {
  return new Zr(
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
function uc(t, e) {
  return Uf(Ft(t), Ft(e)) && t.limitType === e.limitType
}
function pI(t) {
  return `${Vf(Ft(t))}|lt:${t.limitType}`
}
function Vr(t) {
  return `Query(target=${(function (n) {
    let r = n.path.canonicalString()
    return (
      n.collectionGroup !== null &&
        (r += ' collectionGroup=' + n.collectionGroup),
      n.filters.length > 0 &&
        (r += `, filters: [${n.filters.map((i) => hI(i)).join(', ')}]`),
      ac(n.limit) || (r += ', limit: ' + n.limit),
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
        (r += n.startAt.position.map((i) => Qr(i)).join(','))),
      n.endAt &&
        ((r += ', endAt: '),
        (r += n.endAt.inclusive ? 'a:' : 'b:'),
        (r += n.endAt.position.map((i) => Qr(i)).join(','))),
      `Target(${r})`
    )
  })(Ft(t))}; limitType=${t.limitType})`
}
function lc(t, e) {
  return (
    e.isFoundDocument() &&
    (function (r, i) {
      let s = i.key.path
      return r.collectionGroup !== null
        ? i.key.hasCollectionId(r.collectionGroup) && r.path.isPrefixOf(s)
        : L.isDocumentKey(r.path)
          ? r.path.isEqual(s)
          : r.path.isImmediateParentOf(s)
    })(t, e) &&
    (function (r, i) {
      for (let s of ys(r))
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
          !(function (o, c, u) {
            let d = M_(o, c, u)
            return o.inclusive ? d <= 0 : d < 0
          })(r.startAt, ys(r), i)) ||
        (r.endAt &&
          !(function (o, c, u) {
            let d = M_(o, c, u)
            return o.inclusive ? d >= 0 : d > 0
          })(r.endAt, ys(r), i))
      )
    })(t, e)
  )
}
function rx(t) {
  return (
    t.collectionGroup ||
    (t.path.length % 2 == 1
      ? t.path.lastSegment()
      : t.path.get(t.path.length - 2))
  )
}
function mI(t) {
  return (e, n) => {
    let r = !1
    for (let i of ys(t)) {
      let s = ix(i, e, n)
      if (s !== 0) return s
      r = r || i.field.isKeyField()
    }
    return 0
  }
}
function ix(t, e, n) {
  let r = t.field.isKeyField()
    ? L.comparator(e.key, n.key)
    : (function (s, o, c) {
        let u = o.data.field(s),
          d = c.data.field(s)
        return u !== null && d !== null ? Kr(u, d) : j()
      })(t.field, e, n)
  switch (t.dir) {
    case 'asc':
      return r
    case 'desc':
      return -1 * r
    default:
      return j()
  }
}
var bn = class {
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
    cc(this.inner, (n, r) => {
      for (let [i, s] of r) e(i, s)
    })
  }
  isEmpty() {
    return YR(this.inner)
  }
  size() {
    return this.innerSize
  }
}
var sx = new _e(L.comparator)
function Cn() {
  return sx
}
var gI = new _e(L.comparator)
function ms(...t) {
  let e = gI
  for (let n of t) e = e.insert(n.key, n)
  return e
}
function ox(t) {
  let e = gI
  return t.forEach((n, r) => (e = e.insert(n, r.overlayedDocument))), e
}
function er() {
  return vs()
}
function yI() {
  return vs()
}
function vs() {
  return new bn(
    (t) => t.toString(),
    (t, e) => t.isEqual(e)
  )
}
var cV = new _e(L.comparator),
  ax = new Be(L.comparator)
function ee(...t) {
  let e = ax
  for (let n of t) e = e.add(n)
  return e
}
var cx = new Be(ie)
function ux() {
  return cx
}
function lx(t, e) {
  if (t.useProto3Json) {
    if (isNaN(e)) return { doubleValue: 'NaN' }
    if (e === 1 / 0) return { doubleValue: 'Infinity' }
    if (e === -1 / 0) return { doubleValue: '-Infinity' }
  }
  return { doubleValue: La(e) ? '-0' : e }
}
function dx(t) {
  return { integerValue: '' + t }
}
var Xr = class {
  constructor() {
    this._ = void 0
  }
}
function hx(t, e, n) {
  return t instanceof Ts
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
          s && kf(s) && (s = Ff(s)),
          s && (o.fields.__previous_value__ = s),
          { mapValue: o }
        )
      })(n, e)
    : t instanceof ei
      ? vI(t, e)
      : t instanceof ti
        ? _I(t, e)
        : (function (i, s) {
            let o = px(i, s),
              c = F_(o) + F_(i.Pe)
            return yh(o) && yh(i.Pe) ? dx(c) : lx(i.serializer, c)
          })(t, e)
}
function fx(t, e, n) {
  return t instanceof ei ? vI(t, e) : t instanceof ti ? _I(t, e) : n
}
function px(t, e) {
  return t instanceof Ds
    ? (function (r) {
        return (
          yh(r) ||
          (function (s) {
            return !!s && 'doubleValue' in s
          })(r)
        )
      })(e)
      ? e
      : { integerValue: 0 }
    : null
}
var Ts = class extends Xr {},
  ei = class extends Xr {
    constructor(e) {
      super(), (this.elements = e)
    }
  }
function vI(t, e) {
  let n = II(e)
  for (let r of t.elements) n.some((i) => Lt(i, r)) || n.push(r)
  return { arrayValue: { values: n } }
}
var ti = class extends Xr {
  constructor(e) {
    super(), (this.elements = e)
  }
}
function _I(t, e) {
  let n = II(e)
  for (let r of t.elements) n = n.filter((i) => !Lt(i, r))
  return { arrayValue: { values: n } }
}
var Ds = class extends Xr {
  constructor(e, n) {
    super(), (this.serializer = e), (this.Pe = n)
  }
}
function F_(t) {
  return fe(t.integerValue || t.doubleValue)
}
function II(t) {
  return Lf(t) && t.arrayValue.values ? t.arrayValue.values.slice() : []
}
function mx(t, e) {
  return (
    t.field.isEqual(e.field) &&
    (function (r, i) {
      return (r instanceof ei && i instanceof ei) ||
        (r instanceof ti && i instanceof ti)
        ? Wr(r.elements, i.elements, Lt)
        : r instanceof Ds && i instanceof Ds
          ? Lt(r.Pe, i.Pe)
          : r instanceof Ts && i instanceof Ts
    })(t.transform, e.transform)
  )
}
var _s = class t {
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
function Pa(t, e) {
  return t.updateTime !== void 0
    ? e.isFoundDocument() && e.version.isEqual(t.updateTime)
    : t.exists === void 0 || t.exists === e.isFoundDocument()
}
var bs = class {}
function wI(t, e) {
  if (!t.hasLocalMutations || (e && e.fields.length === 0)) return null
  if (e === null)
    return t.isNoDocument()
      ? new Rh(t.key, _s.none())
      : new Cs(t.key, t.data, _s.none())
  {
    let n = t.data,
      r = Xt.empty(),
      i = new Be(Dt.comparator)
    for (let s of e.fields)
      if (!i.has(s)) {
        let o = n.field(s)
        o === null && s.length > 1 && ((s = s.popLast()), (o = n.field(s))),
          o === null ? r.delete(s) : r.set(s, o),
          (i = i.add(s))
      }
    return new ni(t.key, r, new Xn(i.toArray()), _s.none())
  }
}
function gx(t, e, n) {
  t instanceof Cs
    ? (function (i, s, o) {
        let c = i.value.clone(),
          u = V_(i.fieldTransforms, s, o.transformResults)
        c.setAll(u),
          s.convertToFoundDocument(o.version, c).setHasCommittedMutations()
      })(t, e, n)
    : t instanceof ni
      ? (function (i, s, o) {
          if (!Pa(i.precondition, s))
            return void s.convertToUnknownDocument(o.version)
          let c = V_(i.fieldTransforms, s, o.transformResults),
            u = s.data
          u.setAll(EI(i)),
            u.setAll(c),
            s.convertToFoundDocument(o.version, u).setHasCommittedMutations()
        })(t, e, n)
      : (function (i, s, o) {
          s.convertToNoDocument(o.version).setHasCommittedMutations()
        })(0, e, n)
}
function Is(t, e, n, r) {
  return t instanceof Cs
    ? (function (s, o, c, u) {
        if (!Pa(s.precondition, o)) return c
        let d = s.value.clone(),
          f = U_(s.fieldTransforms, u, o)
        return (
          d.setAll(f),
          o.convertToFoundDocument(o.version, d).setHasLocalMutations(),
          null
        )
      })(t, e, n, r)
    : t instanceof ni
      ? (function (s, o, c, u) {
          if (!Pa(s.precondition, o)) return c
          let d = U_(s.fieldTransforms, u, o),
            f = o.data
          return (
            f.setAll(EI(s)),
            f.setAll(d),
            o.convertToFoundDocument(o.version, f).setHasLocalMutations(),
            c === null
              ? null
              : c
                  .unionWith(s.fieldMask.fields)
                  .unionWith(s.fieldTransforms.map((m) => m.field))
          )
        })(t, e, n, r)
      : (function (s, o, c) {
          return Pa(s.precondition, o)
            ? (o.convertToNoDocument(o.version).setHasLocalMutations(), null)
            : c
        })(t, e, n)
}
function L_(t, e) {
  return (
    t.type === e.type &&
    !!t.key.isEqual(e.key) &&
    !!t.precondition.isEqual(e.precondition) &&
    !!(function (r, i) {
      return (
        (r === void 0 && i === void 0) ||
        (!(!r || !i) && Wr(r, i, (s, o) => mx(s, o)))
      )
    })(t.fieldTransforms, e.fieldTransforms) &&
    (t.type === 0
      ? t.value.isEqual(e.value)
      : t.type !== 1 ||
        (t.data.isEqual(e.data) && t.fieldMask.isEqual(e.fieldMask)))
  )
}
var Cs = class extends bs {
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
  ni = class extends bs {
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
function EI(t) {
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
function V_(t, e, n) {
  let r = new Map()
  ye(t.length === n.length)
  for (let i = 0; i < n.length; i++) {
    let s = t[i],
      o = s.transform,
      c = e.data.field(s.field)
    r.set(s.field, fx(o, c, n[i]))
  }
  return r
}
function U_(t, e, n) {
  let r = new Map()
  for (let i of t) {
    let s = i.transform,
      o = n.data.field(i.field)
    r.set(i.field, hx(s, o, e))
  }
  return r
}
var Rh = class extends bs {
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
var xh = class {
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
      s.key.isEqual(e.key) && gx(s, e, r[i])
    }
  }
  applyToLocalView(e, n) {
    for (let r of this.baseMutations)
      r.key.isEqual(e.key) && (n = Is(r, e, n, this.localWriteTime))
    for (let r of this.mutations)
      r.key.isEqual(e.key) && (n = Is(r, e, n, this.localWriteTime))
    return n
  }
  applyToLocalDocumentSet(e, n) {
    let r = yI()
    return (
      this.mutations.forEach((i) => {
        let s = e.get(i.key),
          o = s.overlayedDocument,
          c = this.applyToLocalView(o, s.mutatedFields)
        c = n.has(i.key) ? null : c
        let u = wI(o, c)
        u !== null && r.set(i.key, u),
          o.isValidDocument() || o.convertToNoDocument(H.min())
      }),
      r
    )
  }
  keys() {
    return this.mutations.reduce((e, n) => e.add(n.key), ee())
  }
  isEqual(e) {
    return (
      this.batchId === e.batchId &&
      Wr(this.mutations, e.mutations, (n, r) => L_(n, r)) &&
      Wr(this.baseMutations, e.baseMutations, (n, r) => L_(n, r))
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
var Mh = class {
  constructor(e, n) {
    ;(this.count = e), (this.unchangedNames = n)
  }
}
var De, Z
function TI(t) {
  if (t === void 0) return en('GRPC error has no .code'), P.UNKNOWN
  switch (t) {
    case De.OK:
      return P.OK
    case De.CANCELLED:
      return P.CANCELLED
    case De.UNKNOWN:
      return P.UNKNOWN
    case De.DEADLINE_EXCEEDED:
      return P.DEADLINE_EXCEEDED
    case De.RESOURCE_EXHAUSTED:
      return P.RESOURCE_EXHAUSTED
    case De.INTERNAL:
      return P.INTERNAL
    case De.UNAVAILABLE:
      return P.UNAVAILABLE
    case De.UNAUTHENTICATED:
      return P.UNAUTHENTICATED
    case De.INVALID_ARGUMENT:
      return P.INVALID_ARGUMENT
    case De.NOT_FOUND:
      return P.NOT_FOUND
    case De.ALREADY_EXISTS:
      return P.ALREADY_EXISTS
    case De.PERMISSION_DENIED:
      return P.PERMISSION_DENIED
    case De.FAILED_PRECONDITION:
      return P.FAILED_PRECONDITION
    case De.ABORTED:
      return P.ABORTED
    case De.OUT_OF_RANGE:
      return P.OUT_OF_RANGE
    case De.UNIMPLEMENTED:
      return P.UNIMPLEMENTED
    case De.DATA_LOSS:
      return P.DATA_LOSS
    default:
      return j()
  }
}
;((Z = De || (De = {}))[(Z.OK = 0)] = 'OK'),
  (Z[(Z.CANCELLED = 1)] = 'CANCELLED'),
  (Z[(Z.UNKNOWN = 2)] = 'UNKNOWN'),
  (Z[(Z.INVALID_ARGUMENT = 3)] = 'INVALID_ARGUMENT'),
  (Z[(Z.DEADLINE_EXCEEDED = 4)] = 'DEADLINE_EXCEEDED'),
  (Z[(Z.NOT_FOUND = 5)] = 'NOT_FOUND'),
  (Z[(Z.ALREADY_EXISTS = 6)] = 'ALREADY_EXISTS'),
  (Z[(Z.PERMISSION_DENIED = 7)] = 'PERMISSION_DENIED'),
  (Z[(Z.UNAUTHENTICATED = 16)] = 'UNAUTHENTICATED'),
  (Z[(Z.RESOURCE_EXHAUSTED = 8)] = 'RESOURCE_EXHAUSTED'),
  (Z[(Z.FAILED_PRECONDITION = 9)] = 'FAILED_PRECONDITION'),
  (Z[(Z.ABORTED = 10)] = 'ABORTED'),
  (Z[(Z.OUT_OF_RANGE = 11)] = 'OUT_OF_RANGE'),
  (Z[(Z.UNIMPLEMENTED = 12)] = 'UNIMPLEMENTED'),
  (Z[(Z.INTERNAL = 13)] = 'INTERNAL'),
  (Z[(Z.UNAVAILABLE = 14)] = 'UNAVAILABLE'),
  (Z[(Z.DATA_LOSS = 15)] = 'DATA_LOSS')
var j_ = null
function yx() {
  return new TextEncoder()
}
var vx = new En([4294967295, 4294967295], 0)
function B_(t) {
  let e = yx().encode(t),
    n = new Kd()
  return n.update(e), new Uint8Array(n.digest())
}
function $_(t) {
  let e = new DataView(t.buffer),
    n = e.getUint32(0, !0),
    r = e.getUint32(4, !0),
    i = e.getUint32(8, !0),
    s = e.getUint32(12, !0)
  return [new En([n, r], 0), new En([i, s], 0)]
}
var Ph = class t {
    constructor(e, n, r) {
      if (
        ((this.bitmap = e),
        (this.padding = n),
        (this.hashCount = r),
        n < 0 || n >= 8)
      )
        throw new tr(`Invalid padding: ${n}`)
      if (r < 0) throw new tr(`Invalid hash count: ${r}`)
      if (e.length > 0 && this.hashCount === 0)
        throw new tr(`Invalid hash count: ${r}`)
      if (e.length === 0 && n !== 0)
        throw new tr(`Invalid padding when bitmap length is 0: ${n}`)
      ;(this.Ie = 8 * e.length - n), (this.Te = En.fromNumber(this.Ie))
    }
    Ee(e, n, r) {
      let i = e.add(n.multiply(En.fromNumber(r)))
      return (
        i.compare(vx) === 1 && (i = new En([i.getBits(0), i.getBits(1)], 0)),
        i.modulo(this.Te).toNumber()
      )
    }
    de(e) {
      return (this.bitmap[Math.floor(e / 8)] & (1 << e % 8)) != 0
    }
    mightContain(e) {
      if (this.Ie === 0) return !1
      let n = B_(e),
        [r, i] = $_(n)
      for (let s = 0; s < this.hashCount; s++) {
        let o = this.Ee(r, i, s)
        if (!this.de(o)) return !1
      }
      return !0
    }
    static create(e, n, r) {
      let i = e % 8 == 0 ? 0 : 8 - (e % 8),
        s = new Uint8Array(Math.ceil(e / 8)),
        o = new t(s, i, n)
      return r.forEach((c) => o.insert(c)), o
    }
    insert(e) {
      if (this.Ie === 0) return
      let n = B_(e),
        [r, i] = $_(n)
      for (let s = 0; s < this.hashCount; s++) {
        let o = this.Ee(r, i, s)
        this.Ae(o)
      }
    }
    Ae(e) {
      let n = Math.floor(e / 8),
        r = e % 8
      this.bitmap[n] |= 1 << r
    }
  },
  tr = class extends Error {
    constructor() {
      super(...arguments), (this.name = 'BloomFilterError')
    }
  }
var $a = class t {
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
        i.set(e, As.createSynthesizedTargetChangeForCurrentChange(e, n, r)),
        new t(H.min(), i, new _e(ie), Cn(), ee())
      )
    }
  },
  As = class t {
    constructor(e, n, r, i, s) {
      ;(this.resumeToken = e),
        (this.current = n),
        (this.addedDocuments = r),
        (this.modifiedDocuments = i),
        (this.removedDocuments = s)
    }
    static createSynthesizedTargetChangeForCurrentChange(e, n, r) {
      return new t(r, n, ee(), ee(), ee())
    }
  }
var $r = class {
    constructor(e, n, r, i) {
      ;(this.Re = e), (this.removedTargetIds = n), (this.key = r), (this.Ve = i)
    }
  },
  Ha = class {
    constructor(e, n) {
      ;(this.targetId = e), (this.me = n)
    }
  },
  qa = class {
    constructor(e, n, r = $e.EMPTY_BYTE_STRING, i = null) {
      ;(this.state = e),
        (this.targetIds = n),
        (this.resumeToken = r),
        (this.cause = i)
    }
  },
  za = class {
    constructor() {
      ;(this.fe = 0),
        (this.ge = q_()),
        (this.pe = $e.EMPTY_BYTE_STRING),
        (this.ye = !1),
        (this.we = !0)
    }
    get current() {
      return this.ye
    }
    get resumeToken() {
      return this.pe
    }
    get Se() {
      return this.fe !== 0
    }
    get be() {
      return this.we
    }
    De(e) {
      e.approximateByteSize() > 0 && ((this.we = !0), (this.pe = e))
    }
    ve() {
      let e = ee(),
        n = ee(),
        r = ee()
      return (
        this.ge.forEach((i, s) => {
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
              j()
          }
        }),
        new As(this.pe, this.ye, e, n, r)
      )
    }
    Ce() {
      ;(this.we = !1), (this.ge = q_())
    }
    Fe(e, n) {
      ;(this.we = !0), (this.ge = this.ge.insert(e, n))
    }
    Me(e) {
      ;(this.we = !0), (this.ge = this.ge.remove(e))
    }
    xe() {
      this.fe += 1
    }
    Oe() {
      ;(this.fe -= 1), ye(this.fe >= 0)
    }
    Ne() {
      ;(this.we = !0), (this.ye = !0)
    }
  },
  Oh = class {
    constructor(e) {
      ;(this.Le = e),
        (this.Be = new Map()),
        (this.ke = Cn()),
        (this.qe = H_()),
        (this.Qe = new _e(ie))
    }
    Ke(e) {
      for (let n of e.Re)
        e.Ve && e.Ve.isFoundDocument()
          ? this.$e(n, e.Ve)
          : this.Ue(n, e.key, e.Ve)
      for (let n of e.removedTargetIds) this.Ue(n, e.key, e.Ve)
    }
    We(e) {
      this.forEachTarget(e, (n) => {
        let r = this.Ge(n)
        switch (e.state) {
          case 0:
            this.ze(n) && r.De(e.resumeToken)
            break
          case 1:
            r.Oe(), r.Se || r.Ce(), r.De(e.resumeToken)
            break
          case 2:
            r.Oe(), r.Se || this.removeTarget(n)
            break
          case 3:
            this.ze(n) && (r.Ne(), r.De(e.resumeToken))
            break
          case 4:
            this.ze(n) && (this.je(n), r.De(e.resumeToken))
            break
          default:
            j()
        }
      })
    }
    forEachTarget(e, n) {
      e.targetIds.length > 0
        ? e.targetIds.forEach(n)
        : this.Be.forEach((r, i) => {
            this.ze(i) && n(i)
          })
    }
    He(e) {
      let n = e.targetId,
        r = e.me.count,
        i = this.Je(n)
      if (i) {
        let s = i.target
        if (Ah(s))
          if (r === 0) {
            let o = new L(s.path)
            this.Ue(n, o, bt.newNoDocument(o, H.min()))
          } else ye(r === 1)
        else {
          let o = this.Ye(n)
          if (o !== r) {
            let c = this.Ze(e),
              u = c ? this.Xe(c, e, o) : 1
            if (u !== 0) {
              this.je(n)
              let d =
                u === 2
                  ? 'TargetPurposeExistenceFilterMismatchBloom'
                  : 'TargetPurposeExistenceFilterMismatch'
              this.Qe = this.Qe.insert(n, d)
            }
            j_?.et(
              (function (f, m, _, D, S) {
                var N, R, k, B, q, K
                let ce = {
                    localCacheCount: f,
                    existenceFilterCount: m.count,
                    databaseId: _.database,
                    projectId: _.projectId,
                  },
                  z = m.unchangedNames
                return (
                  z &&
                    (ce.bloomFilter = {
                      applied: S === 0,
                      hashCount:
                        (N = z?.hashCount) !== null && N !== void 0 ? N : 0,
                      bitmapLength:
                        (B =
                          (k =
                            (R = z?.bits) === null || R === void 0
                              ? void 0
                              : R.bitmap) === null || k === void 0
                            ? void 0
                            : k.length) !== null && B !== void 0
                          ? B
                          : 0,
                      padding:
                        (K =
                          (q = z?.bits) === null || q === void 0
                            ? void 0
                            : q.padding) !== null && K !== void 0
                          ? K
                          : 0,
                      mightContain: (w) => {
                        var g
                        return (
                          (g = D?.mightContain(w)) !== null && g !== void 0 && g
                        )
                      },
                    }),
                  ce
                )
              })(o, e.me, this.Le.tt(), c, u)
            )
          }
        }
      }
    }
    Ze(e) {
      let n = e.me.unchangedNames
      if (!n || !n.bits) return null
      let {
          bits: { bitmap: r = '', padding: i = 0 },
          hashCount: s = 0,
        } = n,
        o,
        c
      try {
        o = Dn(r).toUint8Array()
      } catch (u) {
        if (u instanceof Ua)
          return (
            Gr(
              'Decoding the base64 bloom filter in existence filter failed (' +
                u.message +
                '); ignoring the bloom filter and falling back to full re-query.'
            ),
            null
          )
        throw u
      }
      try {
        c = new Ph(o, i, s)
      } catch (u) {
        return (
          Gr(
            u instanceof tr
              ? 'BloomFilter error: '
              : 'Applying bloom filter failed: ',
            u
          ),
          null
        )
      }
      return c.Ie === 0 ? null : c
    }
    Xe(e, n, r) {
      return n.me.count === r - this.nt(e, n.targetId) ? 0 : 2
    }
    nt(e, n) {
      let r = this.Le.getRemoteKeysForTarget(n),
        i = 0
      return (
        r.forEach((s) => {
          let o = this.Le.tt(),
            c = `projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`
          e.mightContain(c) || (this.Ue(n, s, null), i++)
        }),
        i
      )
    }
    rt(e) {
      let n = new Map()
      this.Be.forEach((s, o) => {
        let c = this.Je(o)
        if (c) {
          if (s.current && Ah(c.target)) {
            let u = new L(c.target.path)
            this.ke.get(u) !== null ||
              this.it(o, u) ||
              this.Ue(o, u, bt.newNoDocument(u, e))
          }
          s.be && (n.set(o, s.ve()), s.Ce())
        }
      })
      let r = ee()
      this.qe.forEach((s, o) => {
        let c = !0
        o.forEachWhile((u) => {
          let d = this.Je(u)
          return (
            !d || d.purpose === 'TargetPurposeLimboResolution' || ((c = !1), !1)
          )
        }),
          c && (r = r.add(s))
      }),
        this.ke.forEach((s, o) => o.setReadTime(e))
      let i = new $a(e, n, this.Qe, this.ke, r)
      return (this.ke = Cn()), (this.qe = H_()), (this.Qe = new _e(ie)), i
    }
    $e(e, n) {
      if (!this.ze(e)) return
      let r = this.it(e, n.key) ? 2 : 0
      this.Ge(e).Fe(n.key, r),
        (this.ke = this.ke.insert(n.key, n)),
        (this.qe = this.qe.insert(n.key, this.st(n.key).add(e)))
    }
    Ue(e, n, r) {
      if (!this.ze(e)) return
      let i = this.Ge(e)
      this.it(e, n) ? i.Fe(n, 1) : i.Me(n),
        (this.qe = this.qe.insert(n, this.st(n).delete(e))),
        r && (this.ke = this.ke.insert(n, r))
    }
    removeTarget(e) {
      this.Be.delete(e)
    }
    Ye(e) {
      let n = this.Ge(e).ve()
      return (
        this.Le.getRemoteKeysForTarget(e).size +
        n.addedDocuments.size -
        n.removedDocuments.size
      )
    }
    xe(e) {
      this.Ge(e).xe()
    }
    Ge(e) {
      let n = this.Be.get(e)
      return n || ((n = new za()), this.Be.set(e, n)), n
    }
    st(e) {
      let n = this.qe.get(e)
      return n || ((n = new Be(ie)), (this.qe = this.qe.insert(e, n))), n
    }
    ze(e) {
      let n = this.Je(e) !== null
      return n || O('WatchChangeAggregator', 'Detected inactive target', e), n
    }
    Je(e) {
      let n = this.Be.get(e)
      return n && n.Se ? null : this.Le.ot(e)
    }
    je(e) {
      this.Be.set(e, new za()),
        this.Le.getRemoteKeysForTarget(e).forEach((n) => {
          this.Ue(e, n, null)
        })
    }
    it(e, n) {
      return this.Le.getRemoteKeysForTarget(e).has(n)
    }
  }
function H_() {
  return new _e(L.comparator)
}
function q_() {
  return new _e(L.comparator)
}
var _x = { asc: 'ASCENDING', desc: 'DESCENDING' },
  Ix = {
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
  wx = { and: 'AND', or: 'OR' },
  kh = class {
    constructor(e, n) {
      ;(this.databaseId = e), (this.useProto3Json = n)
    }
  }
function Fh(t, e) {
  return t.useProto3Json || ac(e) ? e : { value: e }
}
function Ex(t, e) {
  return t.useProto3Json
    ? `${new Date(1e3 * e.seconds).toISOString().replace(/\.\d*/, '').replace('Z', '')}.${('000000000' + e.nanoseconds).slice(-9)}Z`
    : { seconds: '' + e.seconds, nanos: e.nanoseconds }
}
function Tx(t, e) {
  return t.useProto3Json ? e.toBase64() : e.toUint8Array()
}
function Hr(t) {
  return (
    ye(!!t),
    H.fromTimestamp(
      (function (n) {
        let r = tn(n)
        return new pt(r.seconds, r.nanos)
      })(t)
    )
  )
}
function Dx(t, e) {
  return Lh(t, e).canonicalString()
}
function Lh(t, e) {
  let n = (function (i) {
    return new Ce(['projects', i.projectId, 'databases', i.database])
  })(t).child('documents')
  return e === void 0 ? n : n.child(e)
}
function DI(t) {
  let e = Ce.fromString(t)
  return ye(RI(e)), e
}
function th(t, e) {
  let n = DI(e)
  if (n.get(1) !== t.databaseId.projectId)
    throw new F(
      P.INVALID_ARGUMENT,
      'Tried to deserialize key from different project: ' +
        n.get(1) +
        ' vs ' +
        t.databaseId.projectId
    )
  if (n.get(3) !== t.databaseId.database)
    throw new F(
      P.INVALID_ARGUMENT,
      'Tried to deserialize key from different database: ' +
        n.get(3) +
        ' vs ' +
        t.databaseId.database
    )
  return new L(CI(n))
}
function bI(t, e) {
  return Dx(t.databaseId, e)
}
function bx(t) {
  let e = DI(t)
  return e.length === 4 ? Ce.emptyPath() : CI(e)
}
function z_(t) {
  return new Ce([
    'projects',
    t.databaseId.projectId,
    'databases',
    t.databaseId.database,
  ]).canonicalString()
}
function CI(t) {
  return ye(t.length > 4 && t.get(4) === 'documents'), t.popFirst(5)
}
function Cx(t, e) {
  let n
  if ('targetChange' in e) {
    e.targetChange
    let r = (function (d) {
        return d === 'NO_CHANGE'
          ? 0
          : d === 'ADD'
            ? 1
            : d === 'REMOVE'
              ? 2
              : d === 'CURRENT'
                ? 3
                : d === 'RESET'
                  ? 4
                  : j()
      })(e.targetChange.targetChangeType || 'NO_CHANGE'),
      i = e.targetChange.targetIds || [],
      s = (function (d, f) {
        return d.useProto3Json
          ? (ye(f === void 0 || typeof f == 'string'),
            $e.fromBase64String(f || ''))
          : (ye(f === void 0 || f instanceof Buffer || f instanceof Uint8Array),
            $e.fromUint8Array(f || new Uint8Array()))
      })(t, e.targetChange.resumeToken),
      o = e.targetChange.cause,
      c =
        o &&
        (function (d) {
          let f = d.code === void 0 ? P.UNKNOWN : TI(d.code)
          return new F(f, d.message || '')
        })(o)
    n = new qa(r, i, s, c || null)
  } else if ('documentChange' in e) {
    e.documentChange
    let r = e.documentChange
    r.document, r.document.name, r.document.updateTime
    let i = th(t, r.document.name),
      s = Hr(r.document.updateTime),
      o = r.document.createTime ? Hr(r.document.createTime) : H.min(),
      c = new Xt({ mapValue: { fields: r.document.fields } }),
      u = bt.newFoundDocument(i, s, o, c),
      d = r.targetIds || [],
      f = r.removedTargetIds || []
    n = new $r(d, f, u.key, u)
  } else if ('documentDelete' in e) {
    e.documentDelete
    let r = e.documentDelete
    r.document
    let i = th(t, r.document),
      s = r.readTime ? Hr(r.readTime) : H.min(),
      o = bt.newNoDocument(i, s),
      c = r.removedTargetIds || []
    n = new $r([], c, o.key, o)
  } else if ('documentRemove' in e) {
    e.documentRemove
    let r = e.documentRemove
    r.document
    let i = th(t, r.document),
      s = r.removedTargetIds || []
    n = new $r([], s, i, null)
  } else {
    if (!('filter' in e)) return j()
    {
      e.filter
      let r = e.filter
      r.targetId
      let { count: i = 0, unchangedNames: s } = r,
        o = new Mh(i, s),
        c = r.targetId
      n = new Ha(c, o)
    }
  }
  return n
}
function Ax(t, e) {
  return { documents: [bI(t, e.path)] }
}
function Sx(t, e) {
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
    (n.parent = bI(t, i))
  let s = (function (d) {
    if (d.length !== 0) return SI(Vt.create(d, 'and'))
  })(e.filters)
  s && (n.structuredQuery.where = s)
  let o = (function (d) {
    if (d.length !== 0)
      return d.map((f) =>
        (function (_) {
          return { field: Ur(_.field), direction: Nx(_.dir) }
        })(f)
      )
  })(e.orderBy)
  o && (n.structuredQuery.orderBy = o)
  let c = Fh(t, e.limit)
  return (
    c !== null && (n.structuredQuery.limit = c),
    e.startAt &&
      (n.structuredQuery.startAt = (function (d) {
        return { before: d.inclusive, values: d.position }
      })(e.startAt)),
    e.endAt &&
      (n.structuredQuery.endAt = (function (d) {
        return { before: !d.inclusive, values: d.position }
      })(e.endAt)),
    { _t: n, parent: i }
  )
}
function Rx(t) {
  let e = bx(t.parent),
    n = t.structuredQuery,
    r = n.from ? n.from.length : 0,
    i = null
  if (r > 0) {
    ye(r === 1)
    let f = n.from[0]
    f.allDescendants ? (i = f.collectionId) : (e = e.child(f.collectionId))
  }
  let s = []
  n.where &&
    (s = (function (m) {
      let _ = AI(m)
      return _ instanceof Vt && lI(_) ? _.getFilters() : [_]
    })(n.where))
  let o = []
  n.orderBy &&
    (o = (function (m) {
      return m.map((_) =>
        (function (S) {
          return new Jr(
            jr(S.field),
            (function (R) {
              switch (R) {
                case 'ASCENDING':
                  return 'asc'
                case 'DESCENDING':
                  return 'desc'
                default:
                  return
              }
            })(S.direction)
          )
        })(_)
      )
    })(n.orderBy))
  let c = null
  n.limit &&
    (c = (function (m) {
      let _
      return (_ = typeof m == 'object' ? m.value : m), ac(_) ? null : _
    })(n.limit))
  let u = null
  n.startAt &&
    (u = (function (m) {
      let _ = !!m.before,
        D = m.values || []
      return new Yr(D, _)
    })(n.startAt))
  let d = null
  return (
    n.endAt &&
      (d = (function (m) {
        let _ = !m.before,
          D = m.values || []
        return new Yr(D, _)
      })(n.endAt)),
    ex(e, i, o, s, c, 'F', u, d)
  )
}
function xx(t, e) {
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
        return j()
    }
  })(e.purpose)
  return n == null ? null : { 'goog-listen-tags': n }
}
function AI(t) {
  return t.unaryFilter !== void 0
    ? (function (n) {
        switch (n.unaryFilter.op) {
          case 'IS_NAN':
            let r = jr(n.unaryFilter.field)
            return Se.create(r, '==', { doubleValue: NaN })
          case 'IS_NULL':
            let i = jr(n.unaryFilter.field)
            return Se.create(i, '==', { nullValue: 'NULL_VALUE' })
          case 'IS_NOT_NAN':
            let s = jr(n.unaryFilter.field)
            return Se.create(s, '!=', { doubleValue: NaN })
          case 'IS_NOT_NULL':
            let o = jr(n.unaryFilter.field)
            return Se.create(o, '!=', { nullValue: 'NULL_VALUE' })
          default:
            return j()
        }
      })(t)
    : t.fieldFilter !== void 0
      ? (function (n) {
          return Se.create(
            jr(n.fieldFilter.field),
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
                  return j()
              }
            })(n.fieldFilter.op),
            n.fieldFilter.value
          )
        })(t)
      : t.compositeFilter !== void 0
        ? (function (n) {
            return Vt.create(
              n.compositeFilter.filters.map((r) => AI(r)),
              (function (i) {
                switch (i) {
                  case 'AND':
                    return 'and'
                  case 'OR':
                    return 'or'
                  default:
                    return j()
                }
              })(n.compositeFilter.op)
            )
          })(t)
        : j()
}
function Nx(t) {
  return _x[t]
}
function Mx(t) {
  return Ix[t]
}
function Px(t) {
  return wx[t]
}
function Ur(t) {
  return { fieldPath: t.canonicalString() }
}
function jr(t) {
  return Dt.fromServerFormat(t.fieldPath)
}
function SI(t) {
  return t instanceof Se
    ? (function (n) {
        if (n.op === '==') {
          if (N_(n.value))
            return { unaryFilter: { field: Ur(n.field), op: 'IS_NAN' } }
          if (x_(n.value))
            return { unaryFilter: { field: Ur(n.field), op: 'IS_NULL' } }
        } else if (n.op === '!=') {
          if (N_(n.value))
            return { unaryFilter: { field: Ur(n.field), op: 'IS_NOT_NAN' } }
          if (x_(n.value))
            return { unaryFilter: { field: Ur(n.field), op: 'IS_NOT_NULL' } }
        }
        return {
          fieldFilter: { field: Ur(n.field), op: Mx(n.op), value: n.value },
        }
      })(t)
    : t instanceof Vt
      ? (function (n) {
          let r = n.getFilters().map((i) => SI(i))
          return r.length === 1
            ? r[0]
            : { compositeFilter: { op: Px(n.op), filters: r } }
        })(t)
      : j()
}
function RI(t) {
  return t.length >= 4 && t.get(0) === 'projects' && t.get(2) === 'databases'
}
var Ss = class t {
  constructor(
    e,
    n,
    r,
    i,
    s = H.min(),
    o = H.min(),
    c = $e.EMPTY_BYTE_STRING,
    u = null
  ) {
    ;(this.target = e),
      (this.targetId = n),
      (this.purpose = r),
      (this.sequenceNumber = i),
      (this.snapshotVersion = s),
      (this.lastLimboFreeSnapshotVersion = o),
      (this.resumeToken = c),
      (this.expectedCount = u)
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
var Vh = class {
  constructor(e) {
    this.ct = e
  }
}
function Ox(t) {
  let e = Rx({ parent: t.parent, structuredQuery: t.structuredQuery })
  return t.limitType === 'LAST' ? Sh(e, e.limit, 'L') : e
}
var Ga = class {
  constructor() {}
  It(e, n) {
    this.Tt(e, n), n.Et()
  }
  Tt(e, n) {
    if ('nullValue' in e) this.dt(n, 5)
    else if ('booleanValue' in e) this.dt(n, 10), n.At(e.booleanValue ? 1 : 0)
    else if ('integerValue' in e) this.dt(n, 15), n.At(fe(e.integerValue))
    else if ('doubleValue' in e) {
      let r = fe(e.doubleValue)
      isNaN(r) ? this.dt(n, 13) : (this.dt(n, 15), La(r) ? n.At(0) : n.At(r))
    } else if ('timestampValue' in e) {
      let r = e.timestampValue
      this.dt(n, 20),
        typeof r == 'string' && (r = tn(r)),
        n.Rt(`${r.seconds || ''}`),
        n.At(r.nanos || 0)
    } else if ('stringValue' in e) this.Vt(e.stringValue, n), this.ft(n)
    else if ('bytesValue' in e)
      this.dt(n, 30), n.gt(Dn(e.bytesValue)), this.ft(n)
    else if ('referenceValue' in e) this.yt(e.referenceValue, n)
    else if ('geoPointValue' in e) {
      let r = e.geoPointValue
      this.dt(n, 45), n.At(r.latitude || 0), n.At(r.longitude || 0)
    } else
      'mapValue' in e
        ? cI(e)
          ? this.dt(n, Number.MAX_SAFE_INTEGER)
          : aI(e)
            ? this.wt(e.mapValue, n)
            : (this.St(e.mapValue, n), this.ft(n))
        : 'arrayValue' in e
          ? (this.bt(e.arrayValue, n), this.ft(n))
          : j()
  }
  Vt(e, n) {
    this.dt(n, 25), this.Dt(e, n)
  }
  Dt(e, n) {
    n.Rt(e)
  }
  St(e, n) {
    let r = e.fields || {}
    this.dt(n, 55)
    for (let i of Object.keys(r)) this.Vt(i, n), this.Tt(r[i], n)
  }
  wt(e, n) {
    var r, i
    let s = e.fields || {}
    this.dt(n, 53)
    let o = 'value',
      c =
        ((i =
          (r = s[o].arrayValue) === null || r === void 0
            ? void 0
            : r.values) === null || i === void 0
          ? void 0
          : i.length) || 0
    this.dt(n, 15), n.At(fe(c)), this.Vt(o, n), this.Tt(s[o], n)
  }
  bt(e, n) {
    let r = e.values || []
    this.dt(n, 50)
    for (let i of r) this.Tt(i, n)
  }
  yt(e, n) {
    this.dt(n, 37),
      L.fromName(e).path.forEach((r) => {
        this.dt(n, 60), this.Dt(r, n)
      })
  }
  dt(e, n) {
    e.At(n)
  }
  ft(e) {
    e.At(2)
  }
}
Ga.vt = new Ga()
var Uh = class {
    constructor() {
      this.un = new jh()
    }
    addToCollectionParentIndex(e, n) {
      return this.un.add(n), x.resolve()
    }
    getCollectionParents(e, n) {
      return x.resolve(this.un.getEntries(n))
    }
    addFieldIndex(e, n) {
      return x.resolve()
    }
    deleteFieldIndex(e, n) {
      return x.resolve()
    }
    deleteAllFieldIndexes(e) {
      return x.resolve()
    }
    createTargetIndexes(e, n) {
      return x.resolve()
    }
    getDocumentsMatchingTarget(e, n) {
      return x.resolve(null)
    }
    getIndexType(e, n) {
      return x.resolve(0)
    }
    getFieldIndexes(e, n) {
      return x.resolve([])
    }
    getNextCollectionGroupToUpdate(e) {
      return x.resolve(null)
    }
    getMinOffset(e, n) {
      return x.resolve(ir.min())
    }
    getMinOffsetFromCollectionGroup(e, n) {
      return x.resolve(ir.min())
    }
    updateCollectionGroup(e, n, r) {
      return x.resolve()
    }
    updateIndexEntries(e, n) {
      return x.resolve()
    }
  },
  jh = class {
    constructor() {
      this.index = {}
    }
    add(e) {
      let n = e.lastSegment(),
        r = e.popLast(),
        i = this.index[n] || new Be(Ce.comparator),
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
      return (this.index[e] || new Be(Ce.comparator)).toArray()
    }
  }
var uV = new Uint8Array(0)
var Ot = class t {
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
;(Ot.DEFAULT_COLLECTION_PERCENTILE = 10),
  (Ot.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3),
  (Ot.DEFAULT = new Ot(
    41943040,
    Ot.DEFAULT_COLLECTION_PERCENTILE,
    Ot.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT
  )),
  (Ot.DISABLED = new Ot(-1, 0, 0))
var Rs = class t {
  constructor(e) {
    this.Ln = e
  }
  next() {
    return (this.Ln += 2), this.Ln
  }
  static Bn() {
    return new t(0)
  }
  static kn() {
    return new t(-1)
  }
}
var Bh = class {
  constructor() {
    ;(this.changes = new bn(
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
      this.changes.set(e, bt.newInvalidDocument(e).setReadTime(n))
  }
  getEntry(e, n) {
    this.assertNotApplied()
    let r = this.changes.get(n)
    return r !== void 0 ? x.resolve(r) : this.getFromCache(e, n)
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
var $h = class {
  constructor(e, n) {
    ;(this.overlayedDocument = e), (this.mutatedFields = n)
  }
}
var Hh = class {
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
      .next((i) => (r !== null && Is(r.mutation, i, Xn.empty(), pt.now()), i))
  }
  getDocuments(e, n) {
    return this.remoteDocumentCache
      .getEntries(e, n)
      .next((r) => this.getLocalViewOfDocuments(e, r, ee()).next(() => r))
  }
  getLocalViewOfDocuments(e, n, r = ee()) {
    let i = er()
    return this.populateOverlays(e, i, n).next(() =>
      this.computeViews(e, n, i, r).next((s) => {
        let o = ms()
        return (
          s.forEach((c, u) => {
            o = o.insert(c, u.overlayedDocument)
          }),
          o
        )
      })
    )
  }
  getOverlayedDocuments(e, n) {
    let r = er()
    return this.populateOverlays(e, r, n).next(() =>
      this.computeViews(e, n, r, ee())
    )
  }
  populateOverlays(e, n, r) {
    let i = []
    return (
      r.forEach((s) => {
        n.has(s) || i.push(s)
      }),
      this.documentOverlayCache.getOverlays(e, i).next((s) => {
        s.forEach((o, c) => {
          n.set(o, c)
        })
      })
    )
  }
  computeViews(e, n, r, i) {
    let s = Cn(),
      o = vs(),
      c = (function () {
        return vs()
      })()
    return (
      n.forEach((u, d) => {
        let f = r.get(d.key)
        i.has(d.key) && (f === void 0 || f.mutation instanceof ni)
          ? (s = s.insert(d.key, d))
          : f !== void 0
            ? (o.set(d.key, f.mutation.getFieldMask()),
              Is(f.mutation, d, f.mutation.getFieldMask(), pt.now()))
            : o.set(d.key, Xn.empty())
      }),
      this.recalculateAndSaveOverlays(e, s).next(
        (u) => (
          u.forEach((d, f) => o.set(d, f)),
          n.forEach((d, f) => {
            var m
            return c.set(
              d,
              new $h(f, (m = o.get(d)) !== null && m !== void 0 ? m : null)
            )
          }),
          c
        )
      )
    )
  }
  recalculateAndSaveOverlays(e, n) {
    let r = vs(),
      i = new _e((o, c) => o - c),
      s = ee()
    return this.mutationQueue
      .getAllMutationBatchesAffectingDocumentKeys(e, n)
      .next((o) => {
        for (let c of o)
          c.keys().forEach((u) => {
            let d = n.get(u)
            if (d === null) return
            let f = r.get(u) || Xn.empty()
            ;(f = c.applyToLocalView(d, f)), r.set(u, f)
            let m = (i.get(c.batchId) || ee()).add(u)
            i = i.insert(c.batchId, m)
          })
      })
      .next(() => {
        let o = [],
          c = i.getReverseIterator()
        for (; c.hasNext(); ) {
          let u = c.getNext(),
            d = u.key,
            f = u.value,
            m = yI()
          f.forEach((_) => {
            if (!s.has(_)) {
              let D = wI(n.get(_), r.get(_))
              D !== null && m.set(_, D), (s = s.add(_))
            }
          }),
            o.push(this.documentOverlayCache.saveOverlays(e, d, m))
        }
        return x.waitFor(o)
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
        L.isDocumentKey(o.path) &&
        o.collectionGroup === null &&
        o.filters.length === 0
      )
    })(n)
      ? this.getDocumentsMatchingDocumentQuery(e, n.path)
      : tx(n)
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
              : x.resolve(er()),
          c = -1,
          u = s
        return o.next((d) =>
          x
            .forEach(
              d,
              (f, m) => (
                c < m.largestBatchId && (c = m.largestBatchId),
                s.get(f)
                  ? x.resolve()
                  : this.remoteDocumentCache.getEntry(e, f).next((_) => {
                      u = u.insert(f, _)
                    })
              )
            )
            .next(() => this.populateOverlays(e, d, s))
            .next(() => this.computeViews(e, u, d, ee()))
            .next((f) => ({ batchId: c, changes: ox(f) }))
        )
      })
  }
  getDocumentsMatchingDocumentQuery(e, n) {
    return this.getDocument(e, new L(n)).next((r) => {
      let i = ms()
      return r.isFoundDocument() && (i = i.insert(r.key, r)), i
    })
  }
  getDocumentsMatchingCollectionGroupQuery(e, n, r, i) {
    let s = n.collectionGroup,
      o = ms()
    return this.indexManager.getCollectionParents(e, s).next((c) =>
      x
        .forEach(c, (u) => {
          let d = (function (m, _) {
            return new Zr(
              _,
              null,
              m.explicitOrderBy.slice(),
              m.filters.slice(),
              m.limit,
              m.limitType,
              m.startAt,
              m.endAt
            )
          })(n, u.child(s))
          return this.getDocumentsMatchingCollectionQuery(e, d, r, i).next(
            (f) => {
              f.forEach((m, _) => {
                o = o.insert(m, _)
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
        s.forEach((u, d) => {
          let f = d.getKey()
          o.get(f) === null && (o = o.insert(f, bt.newInvalidDocument(f)))
        })
        let c = ms()
        return (
          o.forEach((u, d) => {
            let f = s.get(u)
            f !== void 0 && Is(f.mutation, d, Xn.empty(), pt.now()),
              lc(n, d) && (c = c.insert(u, d))
          }),
          c
        )
      })
  }
}
var qh = class {
  constructor(e) {
    ;(this.serializer = e), (this.hr = new Map()), (this.Pr = new Map())
  }
  getBundleMetadata(e, n) {
    return x.resolve(this.hr.get(n))
  }
  saveBundleMetadata(e, n) {
    return (
      this.hr.set(
        n.id,
        (function (i) {
          return { id: i.id, version: i.version, createTime: Hr(i.createTime) }
        })(n)
      ),
      x.resolve()
    )
  }
  getNamedQuery(e, n) {
    return x.resolve(this.Pr.get(n))
  }
  saveNamedQuery(e, n) {
    return (
      this.Pr.set(
        n.name,
        (function (i) {
          return {
            name: i.name,
            query: Ox(i.bundledQuery),
            readTime: Hr(i.readTime),
          }
        })(n)
      ),
      x.resolve()
    )
  }
}
var zh = class {
  constructor() {
    ;(this.overlays = new _e(L.comparator)), (this.Ir = new Map())
  }
  getOverlay(e, n) {
    return x.resolve(this.overlays.get(n))
  }
  getOverlays(e, n) {
    let r = er()
    return x
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
      x.resolve()
    )
  }
  removeOverlaysForBatchId(e, n, r) {
    let i = this.Ir.get(r)
    return (
      i !== void 0 &&
        (i.forEach((s) => (this.overlays = this.overlays.remove(s))),
        this.Ir.delete(r)),
      x.resolve()
    )
  }
  getOverlaysForCollection(e, n, r) {
    let i = er(),
      s = n.length + 1,
      o = new L(n.child('')),
      c = this.overlays.getIteratorFrom(o)
    for (; c.hasNext(); ) {
      let u = c.getNext().value,
        d = u.getKey()
      if (!n.isPrefixOf(d.path)) break
      d.path.length === s && u.largestBatchId > r && i.set(u.getKey(), u)
    }
    return x.resolve(i)
  }
  getOverlaysForCollectionGroup(e, n, r, i) {
    let s = new _e((d, f) => d - f),
      o = this.overlays.getIterator()
    for (; o.hasNext(); ) {
      let d = o.getNext().value
      if (d.getKey().getCollectionGroup() === n && d.largestBatchId > r) {
        let f = s.get(d.largestBatchId)
        f === null && ((f = er()), (s = s.insert(d.largestBatchId, f))),
          f.set(d.getKey(), d)
      }
    }
    let c = er(),
      u = s.getIterator()
    for (
      ;
      u.hasNext() &&
      (u.getNext().value.forEach((d, f) => c.set(d, f)), !(c.size() >= i));

    );
    return x.resolve(c)
  }
  ht(e, n, r) {
    let i = this.overlays.get(r.key)
    if (i !== null) {
      let o = this.Ir.get(i.largestBatchId).delete(r.key)
      this.Ir.set(i.largestBatchId, o)
    }
    this.overlays = this.overlays.insert(r.key, new Nh(n, r))
    let s = this.Ir.get(n)
    s === void 0 && ((s = ee()), this.Ir.set(n, s)),
      this.Ir.set(n, s.add(r.key))
  }
}
var Gh = class {
  constructor() {
    this.sessionToken = $e.EMPTY_BYTE_STRING
  }
  getSessionToken(e) {
    return x.resolve(this.sessionToken)
  }
  setSessionToken(e, n) {
    return (this.sessionToken = n), x.resolve()
  }
}
var xs = class {
    constructor() {
      ;(this.Tr = new Be(be.Er)), (this.dr = new Be(be.Ar))
    }
    isEmpty() {
      return this.Tr.isEmpty()
    }
    addReference(e, n) {
      let r = new be(e, n)
      ;(this.Tr = this.Tr.add(r)), (this.dr = this.dr.add(r))
    }
    Rr(e, n) {
      e.forEach((r) => this.addReference(r, n))
    }
    removeReference(e, n) {
      this.Vr(new be(e, n))
    }
    mr(e, n) {
      e.forEach((r) => this.removeReference(r, n))
    }
    gr(e) {
      let n = new L(new Ce([])),
        r = new be(n, e),
        i = new be(n, e + 1),
        s = []
      return (
        this.dr.forEachInRange([r, i], (o) => {
          this.Vr(o), s.push(o.key)
        }),
        s
      )
    }
    pr() {
      this.Tr.forEach((e) => this.Vr(e))
    }
    Vr(e) {
      ;(this.Tr = this.Tr.delete(e)), (this.dr = this.dr.delete(e))
    }
    yr(e) {
      let n = new L(new Ce([])),
        r = new be(n, e),
        i = new be(n, e + 1),
        s = ee()
      return (
        this.dr.forEachInRange([r, i], (o) => {
          s = s.add(o.key)
        }),
        s
      )
    }
    containsKey(e) {
      let n = new be(e, 0),
        r = this.Tr.firstAfterOrEqual(n)
      return r !== null && e.isEqual(r.key)
    }
  },
  be = class {
    constructor(e, n) {
      ;(this.key = e), (this.wr = n)
    }
    static Er(e, n) {
      return L.comparator(e.key, n.key) || ie(e.wr, n.wr)
    }
    static Ar(e, n) {
      return ie(e.wr, n.wr) || L.comparator(e.key, n.key)
    }
  }
var Wh = class {
  constructor(e, n) {
    ;(this.indexManager = e),
      (this.referenceDelegate = n),
      (this.mutationQueue = []),
      (this.Sr = 1),
      (this.br = new Be(be.Er))
  }
  checkEmpty(e) {
    return x.resolve(this.mutationQueue.length === 0)
  }
  addMutationBatch(e, n, r, i) {
    let s = this.Sr
    this.Sr++,
      this.mutationQueue.length > 0 &&
        this.mutationQueue[this.mutationQueue.length - 1]
    let o = new xh(s, n, r, i)
    this.mutationQueue.push(o)
    for (let c of i)
      (this.br = this.br.add(new be(c.key, s))),
        this.indexManager.addToCollectionParentIndex(e, c.key.path.popLast())
    return x.resolve(o)
  }
  lookupMutationBatch(e, n) {
    return x.resolve(this.Dr(n))
  }
  getNextMutationBatchAfterBatchId(e, n) {
    let r = n + 1,
      i = this.vr(r),
      s = i < 0 ? 0 : i
    return x.resolve(
      this.mutationQueue.length > s ? this.mutationQueue[s] : null
    )
  }
  getHighestUnacknowledgedBatchId() {
    return x.resolve(this.mutationQueue.length === 0 ? -1 : this.Sr - 1)
  }
  getAllMutationBatches(e) {
    return x.resolve(this.mutationQueue.slice())
  }
  getAllMutationBatchesAffectingDocumentKey(e, n) {
    let r = new be(n, 0),
      i = new be(n, Number.POSITIVE_INFINITY),
      s = []
    return (
      this.br.forEachInRange([r, i], (o) => {
        let c = this.Dr(o.wr)
        s.push(c)
      }),
      x.resolve(s)
    )
  }
  getAllMutationBatchesAffectingDocumentKeys(e, n) {
    let r = new Be(ie)
    return (
      n.forEach((i) => {
        let s = new be(i, 0),
          o = new be(i, Number.POSITIVE_INFINITY)
        this.br.forEachInRange([s, o], (c) => {
          r = r.add(c.wr)
        })
      }),
      x.resolve(this.Cr(r))
    )
  }
  getAllMutationBatchesAffectingQuery(e, n) {
    let r = n.path,
      i = r.length + 1,
      s = r
    L.isDocumentKey(s) || (s = s.child(''))
    let o = new be(new L(s), 0),
      c = new Be(ie)
    return (
      this.br.forEachWhile((u) => {
        let d = u.key.path
        return !!r.isPrefixOf(d) && (d.length === i && (c = c.add(u.wr)), !0)
      }, o),
      x.resolve(this.Cr(c))
    )
  }
  Cr(e) {
    let n = []
    return (
      e.forEach((r) => {
        let i = this.Dr(r)
        i !== null && n.push(i)
      }),
      n
    )
  }
  removeMutationBatch(e, n) {
    ye(this.Fr(n.batchId, 'removed') === 0), this.mutationQueue.shift()
    let r = this.br
    return x
      .forEach(n.mutations, (i) => {
        let s = new be(i.key, n.batchId)
        return (
          (r = r.delete(s)),
          this.referenceDelegate.markPotentiallyOrphaned(e, i.key)
        )
      })
      .next(() => {
        this.br = r
      })
  }
  On(e) {}
  containsKey(e, n) {
    let r = new be(n, 0),
      i = this.br.firstAfterOrEqual(r)
    return x.resolve(n.isEqual(i && i.key))
  }
  performConsistencyCheck(e) {
    return this.mutationQueue.length, x.resolve()
  }
  Fr(e, n) {
    return this.vr(e)
  }
  vr(e) {
    return this.mutationQueue.length === 0
      ? 0
      : e - this.mutationQueue[0].batchId
  }
  Dr(e) {
    let n = this.vr(e)
    return n < 0 || n >= this.mutationQueue.length
      ? null
      : this.mutationQueue[n]
  }
}
var Kh = class {
    constructor(e) {
      ;(this.Mr = e),
        (this.docs = (function () {
          return new _e(L.comparator)
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
        o = this.Mr(n)
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
      return x.resolve(r ? r.document.mutableCopy() : bt.newInvalidDocument(n))
    }
    getEntries(e, n) {
      let r = Cn()
      return (
        n.forEach((i) => {
          let s = this.docs.get(i)
          r = r.insert(
            i,
            s ? s.document.mutableCopy() : bt.newInvalidDocument(i)
          )
        }),
        x.resolve(r)
      )
    }
    getDocumentsMatchingQuery(e, n, r, i) {
      let s = Cn(),
        o = n.path,
        c = new L(o.child('')),
        u = this.docs.getIteratorFrom(c)
      for (; u.hasNext(); ) {
        let {
          key: d,
          value: { document: f },
        } = u.getNext()
        if (!o.isPrefixOf(d.path)) break
        d.path.length > o.length + 1 ||
          HR($R(f), r) <= 0 ||
          ((i.has(f.key) || lc(n, f)) && (s = s.insert(f.key, f.mutableCopy())))
      }
      return x.resolve(s)
    }
    getAllFromCollectionGroup(e, n, r, i) {
      j()
    }
    Or(e, n) {
      return x.forEach(this.docs, (r) => n(r))
    }
    newChangeBuffer(e) {
      return new Qh(this)
    }
    getSize(e) {
      return x.resolve(this.size)
    }
  },
  Qh = class extends Bh {
    constructor(e) {
      super(), (this.cr = e)
    }
    applyChanges(e) {
      let n = []
      return (
        this.changes.forEach((r, i) => {
          i.isValidDocument()
            ? n.push(this.cr.addEntry(e, i))
            : this.cr.removeEntry(r)
        }),
        x.waitFor(n)
      )
    }
    getFromCache(e, n) {
      return this.cr.getEntry(e, n)
    }
    getAllFromCache(e, n) {
      return this.cr.getEntries(e, n)
    }
  }
var Yh = class {
  constructor(e) {
    ;(this.persistence = e),
      (this.Nr = new bn((n) => Vf(n), Uf)),
      (this.lastRemoteSnapshotVersion = H.min()),
      (this.highestTargetId = 0),
      (this.Lr = 0),
      (this.Br = new xs()),
      (this.targetCount = 0),
      (this.kr = Rs.Bn())
  }
  forEachTarget(e, n) {
    return this.Nr.forEach((r, i) => n(i)), x.resolve()
  }
  getLastRemoteSnapshotVersion(e) {
    return x.resolve(this.lastRemoteSnapshotVersion)
  }
  getHighestSequenceNumber(e) {
    return x.resolve(this.Lr)
  }
  allocateTargetId(e) {
    return (
      (this.highestTargetId = this.kr.next()), x.resolve(this.highestTargetId)
    )
  }
  setTargetsMetadata(e, n, r) {
    return (
      r && (this.lastRemoteSnapshotVersion = r),
      n > this.Lr && (this.Lr = n),
      x.resolve()
    )
  }
  Kn(e) {
    this.Nr.set(e.target, e)
    let n = e.targetId
    n > this.highestTargetId &&
      ((this.kr = new Rs(n)), (this.highestTargetId = n)),
      e.sequenceNumber > this.Lr && (this.Lr = e.sequenceNumber)
  }
  addTargetData(e, n) {
    return this.Kn(n), (this.targetCount += 1), x.resolve()
  }
  updateTargetData(e, n) {
    return this.Kn(n), x.resolve()
  }
  removeTargetData(e, n) {
    return (
      this.Nr.delete(n.target),
      this.Br.gr(n.targetId),
      (this.targetCount -= 1),
      x.resolve()
    )
  }
  removeTargets(e, n, r) {
    let i = 0,
      s = []
    return (
      this.Nr.forEach((o, c) => {
        c.sequenceNumber <= n &&
          r.get(c.targetId) === null &&
          (this.Nr.delete(o),
          s.push(this.removeMatchingKeysForTargetId(e, c.targetId)),
          i++)
      }),
      x.waitFor(s).next(() => i)
    )
  }
  getTargetCount(e) {
    return x.resolve(this.targetCount)
  }
  getTargetData(e, n) {
    let r = this.Nr.get(n) || null
    return x.resolve(r)
  }
  addMatchingKeys(e, n, r) {
    return this.Br.Rr(n, r), x.resolve()
  }
  removeMatchingKeys(e, n, r) {
    this.Br.mr(n, r)
    let i = this.persistence.referenceDelegate,
      s = []
    return (
      i &&
        n.forEach((o) => {
          s.push(i.markPotentiallyOrphaned(e, o))
        }),
      x.waitFor(s)
    )
  }
  removeMatchingKeysForTargetId(e, n) {
    return this.Br.gr(n), x.resolve()
  }
  getMatchingKeysForTargetId(e, n) {
    let r = this.Br.yr(n)
    return x.resolve(r)
  }
  containsKey(e, n) {
    return x.resolve(this.Br.containsKey(n))
  }
}
var Jh = class {
    constructor(e, n) {
      ;(this.qr = {}),
        (this.overlays = {}),
        (this.Qr = new oI(0)),
        (this.Kr = !1),
        (this.Kr = !0),
        (this.$r = new Gh()),
        (this.referenceDelegate = e(this)),
        (this.Ur = new Yh(this)),
        (this.indexManager = new Uh()),
        (this.remoteDocumentCache = (function (i) {
          return new Kh(i)
        })((r) => this.referenceDelegate.Wr(r))),
        (this.serializer = new Vh(n)),
        (this.Gr = new qh(this.serializer))
    }
    start() {
      return Promise.resolve()
    }
    shutdown() {
      return (this.Kr = !1), Promise.resolve()
    }
    get started() {
      return this.Kr
    }
    setDatabaseDeletedListener() {}
    setNetworkEnabled() {}
    getIndexManager(e) {
      return this.indexManager
    }
    getDocumentOverlayCache(e) {
      let n = this.overlays[e.toKey()]
      return n || ((n = new zh()), (this.overlays[e.toKey()] = n)), n
    }
    getMutationQueue(e, n) {
      let r = this.qr[e.toKey()]
      return (
        r ||
          ((r = new Wh(n, this.referenceDelegate)), (this.qr[e.toKey()] = r)),
        r
      )
    }
    getGlobalsCache() {
      return this.$r
    }
    getTargetCache() {
      return this.Ur
    }
    getRemoteDocumentCache() {
      return this.remoteDocumentCache
    }
    getBundleCache() {
      return this.Gr
    }
    runTransaction(e, n, r) {
      O('MemoryPersistence', 'Starting transaction:', e)
      let i = new Zh(this.Qr.next())
      return (
        this.referenceDelegate.zr(),
        r(i)
          .next((s) => this.referenceDelegate.jr(i).next(() => s))
          .toPromise()
          .then((s) => (i.raiseOnCommittedEvent(), s))
      )
    }
    Hr(e, n) {
      return x.or(Object.values(this.qr).map((r) => () => r.containsKey(e, n)))
    }
  },
  Zh = class extends ph {
    constructor(e) {
      super(), (this.currentSequenceNumber = e)
    }
  },
  Xh = class t {
    constructor(e) {
      ;(this.persistence = e), (this.Jr = new xs()), (this.Yr = null)
    }
    static Zr(e) {
      return new t(e)
    }
    get Xr() {
      if (this.Yr) return this.Yr
      throw j()
    }
    addReference(e, n, r) {
      return (
        this.Jr.addReference(r, n), this.Xr.delete(r.toString()), x.resolve()
      )
    }
    removeReference(e, n, r) {
      return (
        this.Jr.removeReference(r, n), this.Xr.add(r.toString()), x.resolve()
      )
    }
    markPotentiallyOrphaned(e, n) {
      return this.Xr.add(n.toString()), x.resolve()
    }
    removeTarget(e, n) {
      this.Jr.gr(n.targetId).forEach((i) => this.Xr.add(i.toString()))
      let r = this.persistence.getTargetCache()
      return r
        .getMatchingKeysForTargetId(e, n.targetId)
        .next((i) => {
          i.forEach((s) => this.Xr.add(s.toString()))
        })
        .next(() => r.removeTargetData(e, n))
    }
    zr() {
      this.Yr = new Set()
    }
    jr(e) {
      let n = this.persistence.getRemoteDocumentCache().newChangeBuffer()
      return x
        .forEach(this.Xr, (r) => {
          let i = L.fromPath(r)
          return this.ei(e, i).next((s) => {
            s || n.removeEntry(i, H.min())
          })
        })
        .next(() => ((this.Yr = null), n.apply(e)))
    }
    updateLimboDocument(e, n) {
      return this.ei(e, n).next((r) => {
        r ? this.Xr.delete(n.toString()) : this.Xr.add(n.toString())
      })
    }
    Wr(e) {
      return 0
    }
    ei(e, n) {
      return x.or([
        () => x.resolve(this.Jr.containsKey(n)),
        () => this.persistence.getTargetCache().containsKey(e, n),
        () => this.persistence.Hr(e, n),
      ])
    }
  }
var ef = class t {
  constructor(e, n, r, i) {
    ;(this.targetId = e), (this.fromCache = n), (this.$i = r), (this.Ui = i)
  }
  static Wi(e, n) {
    let r = ee(),
      i = ee()
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
var tf = class {
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
var nf = class {
  constructor() {
    ;(this.Gi = !1),
      (this.zi = !1),
      (this.ji = 100),
      (this.Hi = (function () {
        return Bv() ? 8 : zR(ot()) > 0 ? 6 : 4
      })())
  }
  initialize(e, n) {
    ;(this.Ji = e), (this.indexManager = n), (this.Gi = !0)
  }
  getDocumentsMatchingQuery(e, n, r, i) {
    let s = { result: null }
    return this.Yi(e, n)
      .next((o) => {
        s.result = o
      })
      .next(() => {
        if (!s.result)
          return this.Zi(e, n, i, r).next((o) => {
            s.result = o
          })
      })
      .next(() => {
        if (s.result) return
        let o = new tf()
        return this.Xi(e, n, o).next((c) => {
          if (((s.result = c), this.zi)) return this.es(e, n, o, c.size)
        })
      })
      .next(() => s.result)
  }
  es(e, n, r, i) {
    return r.documentReadCount < this.ji
      ? (ps() <= Y.DEBUG &&
          O(
            'QueryEngine',
            'SDK will not create cache indexes for query:',
            Vr(n),
            'since it only creates cache indexes for collection contains',
            'more than or equal to',
            this.ji,
            'documents'
          ),
        x.resolve())
      : (ps() <= Y.DEBUG &&
          O(
            'QueryEngine',
            'Query:',
            Vr(n),
            'scans',
            r.documentReadCount,
            'local documents and returns',
            i,
            'documents as results.'
          ),
        r.documentReadCount > this.Hi * i
          ? (ps() <= Y.DEBUG &&
              O(
                'QueryEngine',
                'The SDK decides to create cache indexes for query:',
                Vr(n),
                'as using cache indexes may help improve performance.'
              ),
            this.indexManager.createTargetIndexes(e, Ft(n)))
          : x.resolve())
  }
  Yi(e, n) {
    if (k_(n)) return x.resolve(null)
    let r = Ft(n)
    return this.indexManager.getIndexType(e, r).next((i) =>
      i === 0
        ? null
        : (n.limit !== null && i === 1 && ((n = Sh(n, null, 'F')), (r = Ft(n))),
          this.indexManager.getDocumentsMatchingTarget(e, r).next((s) => {
            let o = ee(...s)
            return this.Ji.getDocuments(e, o).next((c) =>
              this.indexManager.getMinOffset(e, r).next((u) => {
                let d = this.ts(n, c)
                return this.ns(n, d, o, u.readTime)
                  ? this.Yi(e, Sh(n, null, 'F'))
                  : this.rs(e, d, n, u)
              })
            )
          }))
    )
  }
  Zi(e, n, r, i) {
    return k_(n) || i.isEqual(H.min())
      ? x.resolve(null)
      : this.Ji.getDocuments(e, r).next((s) => {
          let o = this.ts(n, s)
          return this.ns(n, o, r, i)
            ? x.resolve(null)
            : (ps() <= Y.DEBUG &&
                O(
                  'QueryEngine',
                  'Re-using previous result from %s to execute query: %s',
                  i.toString(),
                  Vr(n)
                ),
              this.rs(e, o, n, BR(i, -1)).next((c) => c))
        })
  }
  ts(e, n) {
    let r = new Be(mI(e))
    return (
      n.forEach((i, s) => {
        lc(e, s) && (r = r.add(s))
      }),
      r
    )
  }
  ns(e, n, r, i) {
    if (e.limit === null) return !1
    if (r.size !== n.size) return !0
    let s = e.limitType === 'F' ? n.last() : n.first()
    return !!s && (s.hasPendingWrites || s.version.compareTo(i) > 0)
  }
  Xi(e, n, r) {
    return (
      ps() <= Y.DEBUG &&
        O('QueryEngine', 'Using full collection scan to execute query:', Vr(n)),
      this.Ji.getDocumentsMatchingQuery(e, n, ir.min(), r)
    )
  }
  rs(e, n, r, i) {
    return this.Ji.getDocumentsMatchingQuery(e, r, i).next(
      (s) => (
        n.forEach((o) => {
          s = s.insert(o.key, o)
        }),
        s
      )
    )
  }
}
var rf = class {
  constructor(e, n, r, i) {
    ;(this.persistence = e),
      (this.ss = n),
      (this.serializer = i),
      (this.os = new _e(ie)),
      (this._s = new bn((s) => Vf(s), Uf)),
      (this.us = new Map()),
      (this.cs = e.getRemoteDocumentCache()),
      (this.Ur = e.getTargetCache()),
      (this.Gr = e.getBundleCache()),
      this.ls(r)
  }
  ls(e) {
    ;(this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e)),
      (this.indexManager = this.persistence.getIndexManager(e)),
      (this.mutationQueue = this.persistence.getMutationQueue(
        e,
        this.indexManager
      )),
      (this.localDocuments = new Hh(
        this.cs,
        this.mutationQueue,
        this.documentOverlayCache,
        this.indexManager
      )),
      this.cs.setIndexManager(this.indexManager),
      this.ss.initialize(this.localDocuments, this.indexManager)
  }
  collectGarbage(e) {
    return this.persistence.runTransaction(
      'Collect garbage',
      'readwrite-primary',
      (n) => e.collect(n, this.os)
    )
  }
}
function kx(t, e, n, r) {
  return new rf(t, e, n, r)
}
function xI(t, e) {
  return A(this, null, function* () {
    let n = X(t)
    return yield n.persistence.runTransaction(
      'Handle user change',
      'readonly',
      (r) => {
        let i
        return n.mutationQueue
          .getAllMutationBatches(r)
          .next(
            (s) => ((i = s), n.ls(e), n.mutationQueue.getAllMutationBatches(r))
          )
          .next((s) => {
            let o = [],
              c = [],
              u = ee()
            for (let d of i) {
              o.push(d.batchId)
              for (let f of d.mutations) u = u.add(f.key)
            }
            for (let d of s) {
              c.push(d.batchId)
              for (let f of d.mutations) u = u.add(f.key)
            }
            return n.localDocuments
              .getDocuments(r, u)
              .next((d) => ({ hs: d, removedBatchIds: o, addedBatchIds: c }))
          })
      }
    )
  })
}
function NI(t) {
  let e = X(t)
  return e.persistence.runTransaction(
    'Get last remote snapshot version',
    'readonly',
    (n) => e.Ur.getLastRemoteSnapshotVersion(n)
  )
}
function Fx(t, e) {
  let n = X(t),
    r = e.snapshotVersion,
    i = n.os
  return n.persistence
    .runTransaction('Apply remote event', 'readwrite-primary', (s) => {
      let o = n.cs.newChangeBuffer({ trackRemovals: !0 })
      i = n.os
      let c = []
      e.targetChanges.forEach((f, m) => {
        let _ = i.get(m)
        if (!_) return
        c.push(
          n.Ur.removeMatchingKeys(s, f.removedDocuments, m).next(() =>
            n.Ur.addMatchingKeys(s, f.addedDocuments, m)
          )
        )
        let D = _.withSequenceNumber(s.currentSequenceNumber)
        e.targetMismatches.get(m) !== null
          ? (D = D.withResumeToken(
              $e.EMPTY_BYTE_STRING,
              H.min()
            ).withLastLimboFreeSnapshotVersion(H.min()))
          : f.resumeToken.approximateByteSize() > 0 &&
            (D = D.withResumeToken(f.resumeToken, r)),
          (i = i.insert(m, D)),
          (function (N, R, k) {
            return N.resumeToken.approximateByteSize() === 0 ||
              R.snapshotVersion.toMicroseconds() -
                N.snapshotVersion.toMicroseconds() >=
                3e8
              ? !0
              : k.addedDocuments.size +
                  k.modifiedDocuments.size +
                  k.removedDocuments.size >
                  0
          })(_, D, f) && c.push(n.Ur.updateTargetData(s, D))
      })
      let u = Cn(),
        d = ee()
      if (
        (e.documentUpdates.forEach((f) => {
          e.resolvedLimboDocuments.has(f) &&
            c.push(n.persistence.referenceDelegate.updateLimboDocument(s, f))
        }),
        c.push(
          Lx(s, o, e.documentUpdates).next((f) => {
            ;(u = f.Ps), (d = f.Is)
          })
        ),
        !r.isEqual(H.min()))
      ) {
        let f = n.Ur.getLastRemoteSnapshotVersion(s).next((m) =>
          n.Ur.setTargetsMetadata(s, s.currentSequenceNumber, r)
        )
        c.push(f)
      }
      return x
        .waitFor(c)
        .next(() => o.apply(s))
        .next(() => n.localDocuments.getLocalViewOfDocuments(s, u, d))
        .next(() => u)
    })
    .then((s) => ((n.os = i), s))
}
function Lx(t, e, n) {
  let r = ee(),
    i = ee()
  return (
    n.forEach((s) => (r = r.add(s))),
    e.getEntries(t, r).next((s) => {
      let o = Cn()
      return (
        n.forEach((c, u) => {
          let d = s.get(c)
          u.isFoundDocument() !== d.isFoundDocument() && (i = i.add(c)),
            u.isNoDocument() && u.version.isEqual(H.min())
              ? (e.removeEntry(c, u.readTime), (o = o.insert(c, u)))
              : !d.isValidDocument() ||
                  u.version.compareTo(d.version) > 0 ||
                  (u.version.compareTo(d.version) === 0 && d.hasPendingWrites)
                ? (e.addEntry(u), (o = o.insert(c, u)))
                : O(
                    'LocalStore',
                    'Ignoring outdated watch update for ',
                    c,
                    '. Current version:',
                    d.version,
                    ' Watch version:',
                    u.version
                  )
        }),
        { Ps: o, Is: i }
      )
    })
  )
}
function Vx(t, e) {
  let n = X(t)
  return n.persistence
    .runTransaction('Allocate target', 'readwrite', (r) => {
      let i
      return n.Ur.getTargetData(r, e).next((s) =>
        s
          ? ((i = s), x.resolve(i))
          : n.Ur.allocateTargetId(r).next(
              (o) => (
                (i = new Ss(
                  e,
                  o,
                  'TargetPurposeListen',
                  r.currentSequenceNumber
                )),
                n.Ur.addTargetData(r, i).next(() => i)
              )
            )
      )
    })
    .then((r) => {
      let i = n.os.get(r.targetId)
      return (
        (i === null || r.snapshotVersion.compareTo(i.snapshotVersion) > 0) &&
          ((n.os = n.os.insert(r.targetId, r)), n._s.set(e, r.targetId)),
        r
      )
    })
}
function sf(t, e, n) {
  return A(this, null, function* () {
    let r = X(t),
      i = r.os.get(e),
      s = n ? 'readwrite' : 'readwrite-primary'
    try {
      n ||
        (yield r.persistence.runTransaction('Release target', s, (o) =>
          r.persistence.referenceDelegate.removeTarget(o, i)
        ))
    } catch (o) {
      if (!Ps(o)) throw o
      O('LocalStore', `Failed to update sequence numbers for target ${e}: ${o}`)
    }
    ;(r.os = r.os.remove(e)), r._s.delete(i.target)
  })
}
function G_(t, e, n) {
  let r = X(t),
    i = H.min(),
    s = ee()
  return r.persistence.runTransaction('Execute query', 'readwrite', (o) =>
    (function (u, d, f) {
      let m = X(u),
        _ = m._s.get(f)
      return _ !== void 0 ? x.resolve(m.os.get(_)) : m.Ur.getTargetData(d, f)
    })(r, o, Ft(e))
      .next((c) => {
        if (c)
          return (
            (i = c.lastLimboFreeSnapshotVersion),
            r.Ur.getMatchingKeysForTargetId(o, c.targetId).next((u) => {
              s = u
            })
          )
      })
      .next(() =>
        r.ss.getDocumentsMatchingQuery(o, e, n ? i : H.min(), n ? s : ee())
      )
      .next((c) => (Ux(r, rx(e), c), { documents: c, Ts: s }))
  )
}
function Ux(t, e, n) {
  let r = t.us.get(e) || H.min()
  n.forEach((i, s) => {
    s.readTime.compareTo(r) > 0 && (r = s.readTime)
  }),
    t.us.set(e, r)
}
var Wa = class {
  constructor() {
    this.activeTargetIds = ux()
  }
  fs(e) {
    this.activeTargetIds = this.activeTargetIds.add(e)
  }
  gs(e) {
    this.activeTargetIds = this.activeTargetIds.delete(e)
  }
  Vs() {
    let e = {
      activeTargetIds: this.activeTargetIds.toArray(),
      updateTimeMs: Date.now(),
    }
    return JSON.stringify(e)
  }
}
var of = class {
  constructor() {
    ;(this.so = new Wa()),
      (this.oo = {}),
      (this.onlineStateHandler = null),
      (this.sequenceNumberHandler = null)
  }
  addPendingMutation(e) {}
  updateMutationState(e, n, r) {}
  addLocalQueryTarget(e, n = !0) {
    return n && this.so.fs(e), this.oo[e] || 'not-current'
  }
  updateQueryState(e, n, r) {
    this.oo[e] = n
  }
  removeLocalQueryTarget(e) {
    this.so.gs(e)
  }
  isLocalQueryTarget(e) {
    return this.so.activeTargetIds.has(e)
  }
  clearQueryState(e) {
    delete this.oo[e]
  }
  getAllActiveQueryTargets() {
    return this.so.activeTargetIds
  }
  isActiveQueryTarget(e) {
    return this.so.activeTargetIds.has(e)
  }
  start() {
    return (this.so = new Wa()), Promise.resolve()
  }
  handleUserChange(e, n, r) {}
  setOnlineState(e) {}
  shutdown() {}
  writeSequenceNumber(e) {}
  notifyBundleLoaded(e) {}
}
var af = class {
  _o(e) {}
  shutdown() {}
}
var Ka = class {
  constructor() {
    ;(this.ao = () => this.uo()),
      (this.co = () => this.lo()),
      (this.ho = []),
      this.Po()
  }
  _o(e) {
    this.ho.push(e)
  }
  shutdown() {
    window.removeEventListener('online', this.ao),
      window.removeEventListener('offline', this.co)
  }
  Po() {
    window.addEventListener('online', this.ao),
      window.addEventListener('offline', this.co)
  }
  uo() {
    O('ConnectivityMonitor', 'Network connectivity changed: AVAILABLE')
    for (let e of this.ho) e(0)
  }
  lo() {
    O('ConnectivityMonitor', 'Network connectivity changed: UNAVAILABLE')
    for (let e of this.ho) e(1)
  }
  static D() {
    return (
      typeof window < 'u' &&
      window.addEventListener !== void 0 &&
      window.removeEventListener !== void 0
    )
  }
}
var Ma = null
function nh() {
  return (
    Ma === null
      ? (Ma = (function () {
          return 268435456 + Math.round(2147483648 * Math.random())
        })())
      : Ma++,
    '0x' + Ma.toString(16)
  )
}
var jx = {
  BatchGetDocuments: 'batchGet',
  Commit: 'commit',
  RunQuery: 'runQuery',
  RunAggregationQuery: 'runAggregationQuery',
}
var cf = class {
  constructor(e) {
    ;(this.Io = e.Io), (this.To = e.To)
  }
  Eo(e) {
    this.Ao = e
  }
  Ro(e) {
    this.Vo = e
  }
  mo(e) {
    this.fo = e
  }
  onMessage(e) {
    this.po = e
  }
  close() {
    this.To()
  }
  send(e) {
    this.Io(e)
  }
  yo() {
    this.Ao()
  }
  wo() {
    this.Vo()
  }
  So(e) {
    this.fo(e)
  }
  bo(e) {
    this.po(e)
  }
}
var je = 'WebChannelConnection',
  uf = class extends class {
    constructor(n) {
      ;(this.databaseInfo = n), (this.databaseId = n.databaseId)
      let r = n.ssl ? 'https' : 'http',
        i = encodeURIComponent(this.databaseId.projectId),
        s = encodeURIComponent(this.databaseId.database)
      ;(this.Do = r + '://' + n.host),
        (this.vo = `projects/${i}/databases/${s}`),
        (this.Co =
          this.databaseId.database === '(default)'
            ? `project_id=${i}`
            : `project_id=${i}&database_id=${s}`)
    }
    get Fo() {
      return !1
    }
    Mo(n, r, i, s, o) {
      let c = nh(),
        u = this.xo(n, r.toUriEncodedString())
      O('RestConnection', `Sending RPC '${n}' ${c}:`, u, i)
      let d = {
        'google-cloud-resource-prefix': this.vo,
        'x-goog-request-params': this.Co,
      }
      return (
        this.Oo(d, s, o),
        this.No(n, u, d, i).then(
          (f) => (O('RestConnection', `Received RPC '${n}' ${c}: `, f), f),
          (f) => {
            throw (
              (Gr(
                'RestConnection',
                `RPC '${n}' ${c} failed with error: `,
                f,
                'url: ',
                u,
                'request:',
                i
              ),
              f)
            )
          }
        )
      )
    }
    Lo(n, r, i, s, o, c) {
      return this.Mo(n, r, i, s, o)
    }
    Oo(n, r, i) {
      ;(n['X-Goog-Api-Client'] = (function () {
        return 'gl-js/ fire/' + ii
      })()),
        (n['Content-Type'] = 'text/plain'),
        this.databaseInfo.appId &&
          (n['X-Firebase-GMPID'] = this.databaseInfo.appId),
        r && r.headers.forEach((s, o) => (n[o] = s)),
        i && i.headers.forEach((s, o) => (n[o] = s))
    }
    xo(n, r) {
      let i = jx[n]
      return `${this.Do}/v1/${r}:${i}`
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
    No(e, n, r, i) {
      let s = nh()
      return new Promise((o, c) => {
        let u = new Qd()
        u.setWithCredentials(!0),
          u.listenOnce(Yd.COMPLETE, () => {
            try {
              switch (u.getLastErrorCode()) {
                case fs.NO_ERROR:
                  let f = u.getResponseJson()
                  O(je, `XHR for RPC '${e}' ${s} received:`, JSON.stringify(f)),
                    o(f)
                  break
                case fs.TIMEOUT:
                  O(je, `RPC '${e}' ${s} timed out`),
                    c(new F(P.DEADLINE_EXCEEDED, 'Request time out'))
                  break
                case fs.HTTP_ERROR:
                  let m = u.getStatus()
                  if (
                    (O(
                      je,
                      `RPC '${e}' ${s} failed with status:`,
                      m,
                      'response text:',
                      u.getResponseText()
                    ),
                    m > 0)
                  ) {
                    let _ = u.getResponseJson()
                    Array.isArray(_) && (_ = _[0])
                    let D = _?.error
                    if (D && D.status && D.message) {
                      let S = (function (R) {
                        let k = R.toLowerCase().replace(/_/g, '-')
                        return Object.values(P).indexOf(k) >= 0 ? k : P.UNKNOWN
                      })(D.status)
                      c(new F(S, D.message))
                    } else
                      c(
                        new F(
                          P.UNKNOWN,
                          'Server responded with status ' + u.getStatus()
                        )
                      )
                  } else c(new F(P.UNAVAILABLE, 'Connection failed.'))
                  break
                default:
                  j()
              }
            } finally {
              O(je, `RPC '${e}' ${s} completed.`)
            }
          })
        let d = JSON.stringify(i)
        O(je, `RPC '${e}' ${s} sending request:`, i),
          u.send(n, 'POST', d, r, 15)
      })
    }
    Bo(e, n, r) {
      let i = nh(),
        s = [this.Do, '/', 'google.firestore.v1.Firestore', '/', e, '/channel'],
        o = Xd(),
        c = Zd(),
        u = {
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
        d = this.longPollingOptions.timeoutSeconds
      d !== void 0 && (u.longPollingTimeout = Math.round(1e3 * d)),
        this.useFetchStreams && (u.useFetchStreams = !0),
        this.Oo(u.initMessageHeaders, n, r),
        (u.encodeInitMessageHeaders = !0)
      let f = s.join('')
      O(je, `Creating RPC '${e}' stream ${i}: ${f}`, u)
      let m = o.createWebChannel(f, u),
        _ = !1,
        D = !1,
        S = new cf({
          Io: (R) => {
            D
              ? O(
                  je,
                  `Not sending because RPC '${e}' stream ${i} is closed:`,
                  R
                )
              : (_ ||
                  (O(je, `Opening RPC '${e}' stream ${i} transport.`),
                  m.open(),
                  (_ = !0)),
                O(je, `RPC '${e}' stream ${i} sending:`, R),
                m.send(R))
          },
          To: () => m.close(),
        }),
        N = (R, k, B) => {
          R.listen(k, (q) => {
            try {
              B(q)
            } catch (K) {
              setTimeout(() => {
                throw K
              }, 0)
            }
          })
        }
      return (
        N(m, Lr.EventType.OPEN, () => {
          D || (O(je, `RPC '${e}' stream ${i} transport opened.`), S.yo())
        }),
        N(m, Lr.EventType.CLOSE, () => {
          D ||
            ((D = !0), O(je, `RPC '${e}' stream ${i} transport closed`), S.So())
        }),
        N(m, Lr.EventType.ERROR, (R) => {
          D ||
            ((D = !0),
            Gr(je, `RPC '${e}' stream ${i} transport errored:`, R),
            S.So(new F(P.UNAVAILABLE, 'The operation could not be completed')))
        }),
        N(m, Lr.EventType.MESSAGE, (R) => {
          var k
          if (!D) {
            let B = R.data[0]
            ye(!!B)
            let q = B,
              K =
                q.error ||
                ((k = q[0]) === null || k === void 0 ? void 0 : k.error)
            if (K) {
              O(je, `RPC '${e}' stream ${i} received error:`, K)
              let ce = K.status,
                z = (function (y) {
                  let I = De[y]
                  if (I !== void 0) return TI(I)
                })(ce),
                w = K.message
              z === void 0 &&
                ((z = P.INTERNAL),
                (w =
                  'Unknown error status: ' +
                  ce +
                  ' with message ' +
                  K.message)),
                (D = !0),
                S.So(new F(z, w)),
                m.close()
            } else O(je, `RPC '${e}' stream ${i} received:`, B), S.bo(B)
          }
        }),
        N(c, Jd.STAT_EVENT, (R) => {
          R.stat === xa.PROXY
            ? O(je, `RPC '${e}' stream ${i} detected buffering proxy`)
            : R.stat === xa.NOPROXY &&
              O(je, `RPC '${e}' stream ${i} detected no buffering proxy`)
        }),
        setTimeout(() => {
          S.wo()
        }, 0),
        S
      )
    }
  }
function rh() {
  return typeof document < 'u' ? document : null
}
function MI(t) {
  return new kh(t, !0)
}
var Qa = class {
  constructor(e, n, r = 1e3, i = 1.5, s = 6e4) {
    ;(this.ui = e),
      (this.timerId = n),
      (this.ko = r),
      (this.qo = i),
      (this.Qo = s),
      (this.Ko = 0),
      (this.$o = null),
      (this.Uo = Date.now()),
      this.reset()
  }
  reset() {
    this.Ko = 0
  }
  Wo() {
    this.Ko = this.Qo
  }
  Go(e) {
    this.cancel()
    let n = Math.floor(this.Ko + this.zo()),
      r = Math.max(0, Date.now() - this.Uo),
      i = Math.max(0, n - r)
    i > 0 &&
      O(
        'ExponentialBackoff',
        `Backing off for ${i} ms (base delay: ${this.Ko} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`
      ),
      (this.$o = this.ui.enqueueAfterDelay(
        this.timerId,
        i,
        () => ((this.Uo = Date.now()), e())
      )),
      (this.Ko *= this.qo),
      this.Ko < this.ko && (this.Ko = this.ko),
      this.Ko > this.Qo && (this.Ko = this.Qo)
  }
  jo() {
    this.$o !== null && (this.$o.skipDelay(), (this.$o = null))
  }
  cancel() {
    this.$o !== null && (this.$o.cancel(), (this.$o = null))
  }
  zo() {
    return (Math.random() - 0.5) * this.Ko
  }
}
var lf = class {
    constructor(e, n, r, i, s, o, c, u) {
      ;(this.ui = e),
        (this.Ho = r),
        (this.Jo = i),
        (this.connection = s),
        (this.authCredentialsProvider = o),
        (this.appCheckCredentialsProvider = c),
        (this.listener = u),
        (this.state = 0),
        (this.Yo = 0),
        (this.Zo = null),
        (this.Xo = null),
        (this.stream = null),
        (this.e_ = 0),
        (this.t_ = new Qa(e, n))
    }
    n_() {
      return this.state === 1 || this.state === 5 || this.r_()
    }
    r_() {
      return this.state === 2 || this.state === 3
    }
    start() {
      ;(this.e_ = 0), this.state !== 4 ? this.auth() : this.i_()
    }
    stop() {
      return A(this, null, function* () {
        this.n_() && (yield this.close(0))
      })
    }
    s_() {
      ;(this.state = 0), this.t_.reset()
    }
    o_() {
      this.r_() &&
        this.Zo === null &&
        (this.Zo = this.ui.enqueueAfterDelay(this.Ho, 6e4, () => this.__()))
    }
    a_(e) {
      this.u_(), this.stream.send(e)
    }
    __() {
      return A(this, null, function* () {
        if (this.r_()) return this.close(0)
      })
    }
    u_() {
      this.Zo && (this.Zo.cancel(), (this.Zo = null))
    }
    c_() {
      this.Xo && (this.Xo.cancel(), (this.Xo = null))
    }
    close(e, n) {
      return A(this, null, function* () {
        this.u_(),
          this.c_(),
          this.t_.cancel(),
          this.Yo++,
          e !== 4
            ? this.t_.reset()
            : n && n.code === P.RESOURCE_EXHAUSTED
              ? (en(n.toString()),
                en(
                  'Using maximum backoff delay to prevent overloading the backend.'
                ),
                this.t_.Wo())
              : n &&
                n.code === P.UNAUTHENTICATED &&
                this.state !== 3 &&
                (this.authCredentialsProvider.invalidateToken(),
                this.appCheckCredentialsProvider.invalidateToken()),
          this.stream !== null &&
            (this.l_(), this.stream.close(), (this.stream = null)),
          (this.state = e),
          yield this.listener.mo(n)
      })
    }
    l_() {}
    auth() {
      this.state = 1
      let e = this.h_(this.Yo),
        n = this.Yo
      Promise.all([
        this.authCredentialsProvider.getToken(),
        this.appCheckCredentialsProvider.getToken(),
      ]).then(
        ([r, i]) => {
          this.Yo === n && this.P_(r, i)
        },
        (r) => {
          e(() => {
            let i = new F(P.UNKNOWN, 'Fetching auth token failed: ' + r.message)
            return this.I_(i)
          })
        }
      )
    }
    P_(e, n) {
      let r = this.h_(this.Yo)
      ;(this.stream = this.T_(e, n)),
        this.stream.Eo(() => {
          r(() => this.listener.Eo())
        }),
        this.stream.Ro(() => {
          r(
            () => (
              (this.state = 2),
              (this.Xo = this.ui.enqueueAfterDelay(
                this.Jo,
                1e4,
                () => (this.r_() && (this.state = 3), Promise.resolve())
              )),
              this.listener.Ro()
            )
          )
        }),
        this.stream.mo((i) => {
          r(() => this.I_(i))
        }),
        this.stream.onMessage((i) => {
          r(() => (++this.e_ == 1 ? this.E_(i) : this.onNext(i)))
        })
    }
    i_() {
      ;(this.state = 5),
        this.t_.Go(() =>
          A(this, null, function* () {
            ;(this.state = 0), this.start()
          })
        )
    }
    I_(e) {
      return (
        O('PersistentStream', `close with error: ${e}`),
        (this.stream = null),
        this.close(4, e)
      )
    }
    h_(e) {
      return (n) => {
        this.ui.enqueueAndForget(() =>
          this.Yo === e
            ? n()
            : (O(
                'PersistentStream',
                'stream callback skipped by getCloseGuardedDispatcher.'
              ),
              Promise.resolve())
        )
      }
    }
  },
  df = class extends lf {
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
    T_(e, n) {
      return this.connection.Bo('Listen', e, n)
    }
    E_(e) {
      return this.onNext(e)
    }
    onNext(e) {
      this.t_.reset()
      let n = Cx(this.serializer, e),
        r = (function (s) {
          if (!('targetChange' in s)) return H.min()
          let o = s.targetChange
          return o.targetIds && o.targetIds.length
            ? H.min()
            : o.readTime
              ? Hr(o.readTime)
              : H.min()
        })(e)
      return this.listener.d_(n, r)
    }
    A_(e) {
      let n = {}
      ;(n.database = z_(this.serializer)),
        (n.addTarget = (function (s, o) {
          let c,
            u = o.target
          if (
            ((c = Ah(u) ? { documents: Ax(s, u) } : { query: Sx(s, u)._t }),
            (c.targetId = o.targetId),
            o.resumeToken.approximateByteSize() > 0)
          ) {
            c.resumeToken = Tx(s, o.resumeToken)
            let d = Fh(s, o.expectedCount)
            d !== null && (c.expectedCount = d)
          } else if (o.snapshotVersion.compareTo(H.min()) > 0) {
            c.readTime = Ex(s, o.snapshotVersion.toTimestamp())
            let d = Fh(s, o.expectedCount)
            d !== null && (c.expectedCount = d)
          }
          return c
        })(this.serializer, e))
      let r = xx(this.serializer, e)
      r && (n.labels = r), this.a_(n)
    }
    R_(e) {
      let n = {}
      ;(n.database = z_(this.serializer)), (n.removeTarget = e), this.a_(n)
    }
  }
var hf = class extends class {} {
    constructor(e, n, r, i) {
      super(),
        (this.authCredentials = e),
        (this.appCheckCredentials = n),
        (this.connection = r),
        (this.serializer = i),
        (this.y_ = !1)
    }
    w_() {
      if (this.y_)
        throw new F(
          P.FAILED_PRECONDITION,
          'The client has already been terminated.'
        )
    }
    Mo(e, n, r, i) {
      return (
        this.w_(),
        Promise.all([
          this.authCredentials.getToken(),
          this.appCheckCredentials.getToken(),
        ])
          .then(([s, o]) => this.connection.Mo(e, Lh(n, r), i, s, o))
          .catch((s) => {
            throw s.name === 'FirebaseError'
              ? (s.code === P.UNAUTHENTICATED &&
                  (this.authCredentials.invalidateToken(),
                  this.appCheckCredentials.invalidateToken()),
                s)
              : new F(P.UNKNOWN, s.toString())
          })
      )
    }
    Lo(e, n, r, i, s) {
      return (
        this.w_(),
        Promise.all([
          this.authCredentials.getToken(),
          this.appCheckCredentials.getToken(),
        ])
          .then(([o, c]) => this.connection.Lo(e, Lh(n, r), i, o, c, s))
          .catch((o) => {
            throw o.name === 'FirebaseError'
              ? (o.code === P.UNAUTHENTICATED &&
                  (this.authCredentials.invalidateToken(),
                  this.appCheckCredentials.invalidateToken()),
                o)
              : new F(P.UNKNOWN, o.toString())
          })
      )
    }
    terminate() {
      ;(this.y_ = !0), this.connection.terminate()
    }
  },
  ff = class {
    constructor(e, n) {
      ;(this.asyncQueue = e),
        (this.onlineStateHandler = n),
        (this.state = 'Unknown'),
        (this.S_ = 0),
        (this.b_ = null),
        (this.D_ = !0)
    }
    v_() {
      this.S_ === 0 &&
        (this.C_('Unknown'),
        (this.b_ = this.asyncQueue.enqueueAfterDelay(
          'online_state_timeout',
          1e4,
          () => (
            (this.b_ = null),
            this.F_("Backend didn't respond within 10 seconds."),
            this.C_('Offline'),
            Promise.resolve()
          )
        )))
    }
    M_(e) {
      this.state === 'Online'
        ? this.C_('Unknown')
        : (this.S_++,
          this.S_ >= 1 &&
            (this.x_(),
            this.F_(
              `Connection failed 1 times. Most recent error: ${e.toString()}`
            ),
            this.C_('Offline')))
    }
    set(e) {
      this.x_(), (this.S_ = 0), e === 'Online' && (this.D_ = !1), this.C_(e)
    }
    C_(e) {
      e !== this.state && ((this.state = e), this.onlineStateHandler(e))
    }
    F_(e) {
      let n = `Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`
      this.D_ ? (en(n), (this.D_ = !1)) : O('OnlineStateTracker', n)
    }
    x_() {
      this.b_ !== null && (this.b_.cancel(), (this.b_ = null))
    }
  }
var pf = class {
  constructor(e, n, r, i, s) {
    ;(this.localStore = e),
      (this.datastore = n),
      (this.asyncQueue = r),
      (this.remoteSyncer = {}),
      (this.O_ = []),
      (this.N_ = new Map()),
      (this.L_ = new Set()),
      (this.B_ = []),
      (this.k_ = s),
      this.k_._o((o) => {
        r.enqueueAndForget(() =>
          A(this, null, function* () {
            ks(this) &&
              (O(
                'RemoteStore',
                'Restarting streams for network reachability change.'
              ),
              yield (function (u) {
                return A(this, null, function* () {
                  let d = X(u)
                  d.L_.add(4),
                    yield Os(d),
                    d.q_.set('Unknown'),
                    d.L_.delete(4),
                    yield dc(d)
                })
              })(this))
          })
        )
      }),
      (this.q_ = new ff(r, i))
  }
}
function dc(t) {
  return A(this, null, function* () {
    if (ks(t)) for (let e of t.B_) yield e(!0)
  })
}
function Os(t) {
  return A(this, null, function* () {
    for (let e of t.B_) yield e(!1)
  })
}
function PI(t, e) {
  let n = X(t)
  n.N_.has(e.targetId) ||
    (n.N_.set(e.targetId, e), qf(n) ? Hf(n) : si(n).r_() && $f(n, e))
}
function Bf(t, e) {
  let n = X(t),
    r = si(n)
  n.N_.delete(e),
    r.r_() && OI(n, e),
    n.N_.size === 0 && (r.r_() ? r.o_() : ks(n) && n.q_.set('Unknown'))
}
function $f(t, e) {
  if (
    (t.Q_.xe(e.targetId),
    e.resumeToken.approximateByteSize() > 0 ||
      e.snapshotVersion.compareTo(H.min()) > 0)
  ) {
    let n = t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size
    e = e.withExpectedCount(n)
  }
  si(t).A_(e)
}
function OI(t, e) {
  t.Q_.xe(e), si(t).R_(e)
}
function Hf(t) {
  ;(t.Q_ = new Oh({
    getRemoteKeysForTarget: (e) => t.remoteSyncer.getRemoteKeysForTarget(e),
    ot: (e) => t.N_.get(e) || null,
    tt: () => t.datastore.serializer.databaseId,
  })),
    si(t).start(),
    t.q_.v_()
}
function qf(t) {
  return ks(t) && !si(t).n_() && t.N_.size > 0
}
function ks(t) {
  return X(t).L_.size === 0
}
function kI(t) {
  t.Q_ = void 0
}
function Bx(t) {
  return A(this, null, function* () {
    t.q_.set('Online')
  })
}
function $x(t) {
  return A(this, null, function* () {
    t.N_.forEach((e, n) => {
      $f(t, e)
    })
  })
}
function Hx(t, e) {
  return A(this, null, function* () {
    kI(t), qf(t) ? (t.q_.M_(e), Hf(t)) : t.q_.set('Unknown')
  })
}
function qx(t, e, n) {
  return A(this, null, function* () {
    if ((t.q_.set('Online'), e instanceof qa && e.state === 2 && e.cause))
      try {
        yield (function (i, s) {
          return A(this, null, function* () {
            let o = s.cause
            for (let c of s.targetIds)
              i.N_.has(c) &&
                (yield i.remoteSyncer.rejectListen(c, o),
                i.N_.delete(c),
                i.Q_.removeTarget(c))
          })
        })(t, e)
      } catch (r) {
        O(
          'RemoteStore',
          'Failed to remove targets %s: %s ',
          e.targetIds.join(','),
          r
        ),
          yield W_(t, r)
      }
    else if (
      (e instanceof $r ? t.Q_.Ke(e) : e instanceof Ha ? t.Q_.He(e) : t.Q_.We(e),
      !n.isEqual(H.min()))
    )
      try {
        let r = yield NI(t.localStore)
        n.compareTo(r) >= 0 &&
          (yield (function (s, o) {
            let c = s.Q_.rt(o)
            return (
              c.targetChanges.forEach((u, d) => {
                if (u.resumeToken.approximateByteSize() > 0) {
                  let f = s.N_.get(d)
                  f && s.N_.set(d, f.withResumeToken(u.resumeToken, o))
                }
              }),
              c.targetMismatches.forEach((u, d) => {
                let f = s.N_.get(u)
                if (!f) return
                s.N_.set(
                  u,
                  f.withResumeToken($e.EMPTY_BYTE_STRING, f.snapshotVersion)
                ),
                  OI(s, u)
                let m = new Ss(f.target, u, d, f.sequenceNumber)
                $f(s, m)
              }),
              s.remoteSyncer.applyRemoteEvent(c)
            )
          })(t, n))
      } catch (r) {
        O('RemoteStore', 'Failed to raise snapshot:', r), yield W_(t, r)
      }
  })
}
function W_(t, e, n) {
  return A(this, null, function* () {
    if (!Ps(e)) throw e
    t.L_.add(1),
      yield Os(t),
      t.q_.set('Offline'),
      n || (n = () => NI(t.localStore)),
      t.asyncQueue.enqueueRetryable(() =>
        A(this, null, function* () {
          O('RemoteStore', 'Retrying IndexedDB access'),
            yield n(),
            t.L_.delete(1),
            yield dc(t)
        })
      )
  })
}
function K_(t, e) {
  return A(this, null, function* () {
    let n = X(t)
    n.asyncQueue.verifyOperationInProgress(),
      O('RemoteStore', 'RemoteStore received new credentials')
    let r = ks(n)
    n.L_.add(3),
      yield Os(n),
      r && n.q_.set('Unknown'),
      yield n.remoteSyncer.handleCredentialChange(e),
      n.L_.delete(3),
      yield dc(n)
  })
}
function zx(t, e) {
  return A(this, null, function* () {
    let n = X(t)
    e
      ? (n.L_.delete(2), yield dc(n))
      : e || (n.L_.add(2), yield Os(n), n.q_.set('Unknown'))
  })
}
function si(t) {
  return (
    t.K_ ||
      ((t.K_ = (function (n, r, i) {
        let s = X(n)
        return (
          s.w_(),
          new df(
            r,
            s.connection,
            s.authCredentials,
            s.appCheckCredentials,
            s.serializer,
            i
          )
        )
      })(t.datastore, t.asyncQueue, {
        Eo: Bx.bind(null, t),
        Ro: $x.bind(null, t),
        mo: Hx.bind(null, t),
        d_: qx.bind(null, t),
      })),
      t.B_.push((e) =>
        A(this, null, function* () {
          e
            ? (t.K_.s_(), qf(t) ? Hf(t) : t.q_.set('Unknown'))
            : (yield t.K_.stop(), kI(t))
        })
      )),
    t.K_
  )
}
var mf = class t {
  constructor(e, n, r, i, s) {
    ;(this.asyncQueue = e),
      (this.timerId = n),
      (this.targetTimeMs = r),
      (this.op = i),
      (this.removalCallback = s),
      (this.deferred = new Tn()),
      (this.then = this.deferred.promise.then.bind(this.deferred.promise)),
      this.deferred.promise.catch((o) => {})
  }
  get promise() {
    return this.deferred.promise
  }
  static createAndSchedule(e, n, r, i, s) {
    let o = Date.now() + r,
      c = new t(e, n, o, i, s)
    return c.start(r), c
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
        new F(P.CANCELLED, 'Operation cancelled' + (e ? ': ' + e : ''))
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
function FI(t, e) {
  if ((en('AsyncQueue', `${e}: ${t}`), Ps(t)))
    return new F(P.UNAVAILABLE, `${e}: ${t}`)
  throw t
}
var Ya = class t {
  constructor(e) {
    ;(this.comparator = e
      ? (n, r) => e(n, r) || L.comparator(n.key, r.key)
      : (n, r) => L.comparator(n.key, r.key)),
      (this.keyedMap = ms()),
      (this.sortedSet = new _e(this.comparator))
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
var Ja = class {
    constructor() {
      this.W_ = new _e(L.comparator)
    }
    track(e) {
      let n = e.doc.key,
        r = this.W_.get(n)
      r
        ? e.type !== 0 && r.type === 3
          ? (this.W_ = this.W_.insert(n, e))
          : e.type === 3 && r.type !== 1
            ? (this.W_ = this.W_.insert(n, { type: r.type, doc: e.doc }))
            : e.type === 2 && r.type === 2
              ? (this.W_ = this.W_.insert(n, { type: 2, doc: e.doc }))
              : e.type === 2 && r.type === 0
                ? (this.W_ = this.W_.insert(n, { type: 0, doc: e.doc }))
                : e.type === 1 && r.type === 0
                  ? (this.W_ = this.W_.remove(n))
                  : e.type === 1 && r.type === 2
                    ? (this.W_ = this.W_.insert(n, { type: 1, doc: r.doc }))
                    : e.type === 0 && r.type === 1
                      ? (this.W_ = this.W_.insert(n, { type: 2, doc: e.doc }))
                      : j()
        : (this.W_ = this.W_.insert(n, e))
    }
    G_() {
      let e = []
      return (
        this.W_.inorderTraversal((n, r) => {
          e.push(r)
        }),
        e
      )
    }
  },
  ri = class t {
    constructor(e, n, r, i, s, o, c, u, d) {
      ;(this.query = e),
        (this.docs = n),
        (this.oldDocs = r),
        (this.docChanges = i),
        (this.mutatedKeys = s),
        (this.fromCache = o),
        (this.syncStateChanged = c),
        (this.excludesMetadataChanges = u),
        (this.hasCachedResults = d)
    }
    static fromInitialDocuments(e, n, r, i, s) {
      let o = []
      return (
        n.forEach((c) => {
          o.push({ type: 0, doc: c })
        }),
        new t(e, n, Ya.emptySet(n), o, r, i, !0, !1, s)
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
          uc(this.query, e.query) &&
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
var gf = class {
    constructor() {
      ;(this.z_ = void 0), (this.j_ = [])
    }
    H_() {
      return this.j_.some((e) => e.J_())
    }
  },
  yf = class {
    constructor() {
      ;(this.queries = Q_()),
        (this.onlineState = 'Unknown'),
        (this.Y_ = new Set())
    }
    terminate() {
      ;(function (n, r) {
        let i = X(n),
          s = i.queries
        ;(i.queries = Q_()),
          s.forEach((o, c) => {
            for (let u of c.j_) u.onError(r)
          })
      })(this, new F(P.ABORTED, 'Firestore shutting down'))
    }
  }
function Q_() {
  return new bn((t) => pI(t), uc)
}
function Gx(t, e) {
  return A(this, null, function* () {
    let n = X(t),
      r = 3,
      i = e.query,
      s = n.queries.get(i)
    s ? !s.H_() && e.J_() && (r = 2) : ((s = new gf()), (r = e.J_() ? 0 : 1))
    try {
      switch (r) {
        case 0:
          s.z_ = yield n.onListen(i, !0)
          break
        case 1:
          s.z_ = yield n.onListen(i, !1)
          break
        case 2:
          yield n.onFirstRemoteStoreListen(i)
      }
    } catch (o) {
      let c = FI(o, `Initialization of query '${Vr(e.query)}' failed`)
      return void e.onError(c)
    }
    n.queries.set(i, s),
      s.j_.push(e),
      e.Z_(n.onlineState),
      s.z_ && e.X_(s.z_) && zf(n)
  })
}
function Wx(t, e) {
  return A(this, null, function* () {
    let n = X(t),
      r = e.query,
      i = 3,
      s = n.queries.get(r)
    if (s) {
      let o = s.j_.indexOf(e)
      o >= 0 &&
        (s.j_.splice(o, 1),
        s.j_.length === 0 ? (i = e.J_() ? 0 : 1) : !s.H_() && e.J_() && (i = 2))
    }
    switch (i) {
      case 0:
        return n.queries.delete(r), n.onUnlisten(r, !0)
      case 1:
        return n.queries.delete(r), n.onUnlisten(r, !1)
      case 2:
        return n.onLastRemoteStoreUnlisten(r)
      default:
        return
    }
  })
}
function Kx(t, e) {
  let n = X(t),
    r = !1
  for (let i of e) {
    let s = i.query,
      o = n.queries.get(s)
    if (o) {
      for (let c of o.j_) c.X_(i) && (r = !0)
      o.z_ = i
    }
  }
  r && zf(n)
}
function Qx(t, e, n) {
  let r = X(t),
    i = r.queries.get(e)
  if (i) for (let s of i.j_) s.onError(n)
  r.queries.delete(e)
}
function zf(t) {
  t.Y_.forEach((e) => {
    e.next()
  })
}
var vf, Y_
;((Y_ = vf || (vf = {})).ea = 'default'), (Y_.Cache = 'cache')
var _f = class {
  constructor(e, n, r) {
    ;(this.query = e),
      (this.ta = n),
      (this.na = !1),
      (this.ra = null),
      (this.onlineState = 'Unknown'),
      (this.options = r || {})
  }
  X_(e) {
    if (!this.options.includeMetadataChanges) {
      let r = []
      for (let i of e.docChanges) i.type !== 3 && r.push(i)
      e = new ri(
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
      this.na
        ? this.ia(e) && (this.ta.next(e), (n = !0))
        : this.sa(e, this.onlineState) && (this.oa(e), (n = !0)),
      (this.ra = e),
      n
    )
  }
  onError(e) {
    this.ta.error(e)
  }
  Z_(e) {
    this.onlineState = e
    let n = !1
    return (
      this.ra &&
        !this.na &&
        this.sa(this.ra, e) &&
        (this.oa(this.ra), (n = !0)),
      n
    )
  }
  sa(e, n) {
    if (!e.fromCache || !this.J_()) return !0
    let r = n !== 'Offline'
    return (
      (!this.options._a || !r) &&
      (!e.docs.isEmpty() || e.hasCachedResults || n === 'Offline')
    )
  }
  ia(e) {
    if (e.docChanges.length > 0) return !0
    let n = this.ra && this.ra.hasPendingWrites !== e.hasPendingWrites
    return (
      !(!e.syncStateChanged && !n) && this.options.includeMetadataChanges === !0
    )
  }
  oa(e) {
    ;(e = ri.fromInitialDocuments(
      e.query,
      e.docs,
      e.mutatedKeys,
      e.fromCache,
      e.hasCachedResults
    )),
      (this.na = !0),
      this.ta.next(e)
  }
  J_() {
    return this.options.source !== vf.Cache
  }
}
var Za = class {
    constructor(e) {
      this.key = e
    }
  },
  Xa = class {
    constructor(e) {
      this.key = e
    }
  },
  If = class {
    constructor(e, n) {
      ;(this.query = e),
        (this.Ta = n),
        (this.Ea = null),
        (this.hasCachedResults = !1),
        (this.current = !1),
        (this.da = ee()),
        (this.mutatedKeys = ee()),
        (this.Aa = mI(e)),
        (this.Ra = new Ya(this.Aa))
    }
    get Va() {
      return this.Ta
    }
    ma(e, n) {
      let r = n ? n.fa : new Ja(),
        i = n ? n.Ra : this.Ra,
        s = n ? n.mutatedKeys : this.mutatedKeys,
        o = i,
        c = !1,
        u =
          this.query.limitType === 'F' && i.size === this.query.limit
            ? i.last()
            : null,
        d =
          this.query.limitType === 'L' && i.size === this.query.limit
            ? i.first()
            : null
      if (
        (e.inorderTraversal((f, m) => {
          let _ = i.get(f),
            D = lc(this.query, m) ? m : null,
            S = !!_ && this.mutatedKeys.has(_.key),
            N =
              !!D &&
              (D.hasLocalMutations ||
                (this.mutatedKeys.has(D.key) && D.hasCommittedMutations)),
            R = !1
          _ && D
            ? _.data.isEqual(D.data)
              ? S !== N && (r.track({ type: 3, doc: D }), (R = !0))
              : this.ga(_, D) ||
                (r.track({ type: 2, doc: D }),
                (R = !0),
                ((u && this.Aa(D, u) > 0) || (d && this.Aa(D, d) < 0)) &&
                  (c = !0))
            : !_ && D
              ? (r.track({ type: 0, doc: D }), (R = !0))
              : _ &&
                !D &&
                (r.track({ type: 1, doc: _ }), (R = !0), (u || d) && (c = !0)),
            R &&
              (D
                ? ((o = o.add(D)), (s = N ? s.add(f) : s.delete(f)))
                : ((o = o.delete(f)), (s = s.delete(f))))
        }),
        this.query.limit !== null)
      )
        for (; o.size > this.query.limit; ) {
          let f = this.query.limitType === 'F' ? o.last() : o.first()
          ;(o = o.delete(f.key)),
            (s = s.delete(f.key)),
            r.track({ type: 1, doc: f })
        }
      return { Ra: o, fa: r, ns: c, mutatedKeys: s }
    }
    ga(e, n) {
      return (
        e.hasLocalMutations && n.hasCommittedMutations && !n.hasLocalMutations
      )
    }
    applyChanges(e, n, r, i) {
      let s = this.Ra
      ;(this.Ra = e.Ra), (this.mutatedKeys = e.mutatedKeys)
      let o = e.fa.G_()
      o.sort(
        (f, m) =>
          (function (D, S) {
            let N = (R) => {
              switch (R) {
                case 0:
                  return 1
                case 2:
                case 3:
                  return 2
                case 1:
                  return 0
                default:
                  return j()
              }
            }
            return N(D) - N(S)
          })(f.type, m.type) || this.Aa(f.doc, m.doc)
      ),
        this.pa(r),
        (i = i != null && i)
      let c = n && !i ? this.ya() : [],
        u = this.da.size === 0 && this.current && !i ? 1 : 0,
        d = u !== this.Ea
      return (
        (this.Ea = u),
        o.length !== 0 || d
          ? {
              snapshot: new ri(
                this.query,
                e.Ra,
                s,
                o,
                e.mutatedKeys,
                u === 0,
                d,
                !1,
                !!r && r.resumeToken.approximateByteSize() > 0
              ),
              wa: c,
            }
          : { wa: c }
      )
    }
    Z_(e) {
      return this.current && e === 'Offline'
        ? ((this.current = !1),
          this.applyChanges(
            {
              Ra: this.Ra,
              fa: new Ja(),
              mutatedKeys: this.mutatedKeys,
              ns: !1,
            },
            !1
          ))
        : { wa: [] }
    }
    Sa(e) {
      return (
        !this.Ta.has(e) && !!this.Ra.has(e) && !this.Ra.get(e).hasLocalMutations
      )
    }
    pa(e) {
      e &&
        (e.addedDocuments.forEach((n) => (this.Ta = this.Ta.add(n))),
        e.modifiedDocuments.forEach((n) => {}),
        e.removedDocuments.forEach((n) => (this.Ta = this.Ta.delete(n))),
        (this.current = e.current))
    }
    ya() {
      if (!this.current) return []
      let e = this.da
      ;(this.da = ee()),
        this.Ra.forEach((r) => {
          this.Sa(r.key) && (this.da = this.da.add(r.key))
        })
      let n = []
      return (
        e.forEach((r) => {
          this.da.has(r) || n.push(new Xa(r))
        }),
        this.da.forEach((r) => {
          e.has(r) || n.push(new Za(r))
        }),
        n
      )
    }
    ba(e) {
      ;(this.Ta = e.Ts), (this.da = ee())
      let n = this.ma(e.documents)
      return this.applyChanges(n, !0)
    }
    Da() {
      return ri.fromInitialDocuments(
        this.query,
        this.Ra,
        this.mutatedKeys,
        this.Ea === 0,
        this.hasCachedResults
      )
    }
  },
  wf = class {
    constructor(e, n, r) {
      ;(this.query = e), (this.targetId = n), (this.view = r)
    }
  },
  Ef = class {
    constructor(e) {
      ;(this.key = e), (this.va = !1)
    }
  },
  Tf = class {
    constructor(e, n, r, i, s, o) {
      ;(this.localStore = e),
        (this.remoteStore = n),
        (this.eventManager = r),
        (this.sharedClientState = i),
        (this.currentUser = s),
        (this.maxConcurrentLimboResolutions = o),
        (this.Ca = {}),
        (this.Fa = new bn((c) => pI(c), uc)),
        (this.Ma = new Map()),
        (this.xa = new Set()),
        (this.Oa = new _e(L.comparator)),
        (this.Na = new Map()),
        (this.La = new xs()),
        (this.Ba = {}),
        (this.ka = new Map()),
        (this.qa = Rs.kn()),
        (this.onlineState = 'Unknown'),
        (this.Qa = void 0)
    }
    get isPrimaryClient() {
      return this.Qa === !0
    }
  }
function Yx(t, e, n = !0) {
  return A(this, null, function* () {
    let r = BI(t),
      i,
      s = r.Fa.get(e)
    return (
      s
        ? (r.sharedClientState.addLocalQueryTarget(s.targetId),
          (i = s.view.Da()))
        : (i = yield LI(r, e, n, !0)),
      i
    )
  })
}
function Jx(t, e) {
  return A(this, null, function* () {
    let n = BI(t)
    yield LI(n, e, !0, !1)
  })
}
function LI(t, e, n, r) {
  return A(this, null, function* () {
    let i = yield Vx(t.localStore, Ft(e)),
      s = i.targetId,
      o = t.sharedClientState.addLocalQueryTarget(s, n),
      c
    return (
      r && (c = yield Zx(t, e, s, o === 'current', i.resumeToken)),
      t.isPrimaryClient && n && PI(t.remoteStore, i),
      c
    )
  })
}
function Zx(t, e, n, r, i) {
  return A(this, null, function* () {
    t.Ka = (m, _, D) =>
      (function (N, R, k, B) {
        return A(this, null, function* () {
          let q = R.view.ma(k)
          q.ns &&
            (q = yield G_(N.localStore, R.query, !1).then(({ documents: w }) =>
              R.view.ma(w, q)
            ))
          let K = B && B.targetChanges.get(R.targetId),
            ce = B && B.targetMismatches.get(R.targetId) != null,
            z = R.view.applyChanges(q, N.isPrimaryClient, K, ce)
          return Z_(N, R.targetId, z.wa), z.snapshot
        })
      })(t, m, _, D)
    let s = yield G_(t.localStore, e, !0),
      o = new If(e, s.Ts),
      c = o.ma(s.documents),
      u = As.createSynthesizedTargetChangeForCurrentChange(
        n,
        r && t.onlineState !== 'Offline',
        i
      ),
      d = o.applyChanges(c, t.isPrimaryClient, u)
    Z_(t, n, d.wa)
    let f = new wf(e, n, o)
    return (
      t.Fa.set(e, f),
      t.Ma.has(n) ? t.Ma.get(n).push(e) : t.Ma.set(n, [e]),
      d.snapshot
    )
  })
}
function Xx(t, e, n) {
  return A(this, null, function* () {
    let r = X(t),
      i = r.Fa.get(e),
      s = r.Ma.get(i.targetId)
    if (s.length > 1)
      return (
        r.Ma.set(
          i.targetId,
          s.filter((o) => !uc(o, e))
        ),
        void r.Fa.delete(e)
      )
    r.isPrimaryClient
      ? (r.sharedClientState.removeLocalQueryTarget(i.targetId),
        r.sharedClientState.isActiveQueryTarget(i.targetId) ||
          (yield sf(r.localStore, i.targetId, !1)
            .then(() => {
              r.sharedClientState.clearQueryState(i.targetId),
                n && Bf(r.remoteStore, i.targetId),
                Df(r, i.targetId)
            })
            .catch(Of)))
      : (Df(r, i.targetId), yield sf(r.localStore, i.targetId, !0))
  })
}
function eN(t, e) {
  return A(this, null, function* () {
    let n = X(t),
      r = n.Fa.get(e),
      i = n.Ma.get(r.targetId)
    n.isPrimaryClient &&
      i.length === 1 &&
      (n.sharedClientState.removeLocalQueryTarget(r.targetId),
      Bf(n.remoteStore, r.targetId))
  })
}
function VI(t, e) {
  return A(this, null, function* () {
    let n = X(t)
    try {
      let r = yield Fx(n.localStore, e)
      e.targetChanges.forEach((i, s) => {
        let o = n.Na.get(s)
        o &&
          (ye(
            i.addedDocuments.size +
              i.modifiedDocuments.size +
              i.removedDocuments.size <=
              1
          ),
          i.addedDocuments.size > 0
            ? (o.va = !0)
            : i.modifiedDocuments.size > 0
              ? ye(o.va)
              : i.removedDocuments.size > 0 && (ye(o.va), (o.va = !1)))
      }),
        yield jI(n, r, e)
    } catch (r) {
      yield Of(r)
    }
  })
}
function J_(t, e, n) {
  let r = X(t)
  if ((r.isPrimaryClient && n === 0) || (!r.isPrimaryClient && n === 1)) {
    let i = []
    r.Fa.forEach((s, o) => {
      let c = o.view.Z_(e)
      c.snapshot && i.push(c.snapshot)
    }),
      (function (o, c) {
        let u = X(o)
        u.onlineState = c
        let d = !1
        u.queries.forEach((f, m) => {
          for (let _ of m.j_) _.Z_(c) && (d = !0)
        }),
          d && zf(u)
      })(r.eventManager, e),
      i.length && r.Ca.d_(i),
      (r.onlineState = e),
      r.isPrimaryClient && r.sharedClientState.setOnlineState(e)
  }
}
function tN(t, e, n) {
  return A(this, null, function* () {
    let r = X(t)
    r.sharedClientState.updateQueryState(e, 'rejected', n)
    let i = r.Na.get(e),
      s = i && i.key
    if (s) {
      let o = new _e(L.comparator)
      o = o.insert(s, bt.newNoDocument(s, H.min()))
      let c = ee().add(s),
        u = new $a(H.min(), new Map(), new _e(ie), o, c)
      yield VI(r, u), (r.Oa = r.Oa.remove(s)), r.Na.delete(e), Gf(r)
    } else
      yield sf(r.localStore, e, !1)
        .then(() => Df(r, e, n))
        .catch(Of)
  })
}
function Df(t, e, n = null) {
  t.sharedClientState.removeLocalQueryTarget(e)
  for (let r of t.Ma.get(e)) t.Fa.delete(r), n && t.Ca.$a(r, n)
  t.Ma.delete(e),
    t.isPrimaryClient &&
      t.La.gr(e).forEach((r) => {
        t.La.containsKey(r) || UI(t, r)
      })
}
function UI(t, e) {
  t.xa.delete(e.path.canonicalString())
  let n = t.Oa.get(e)
  n !== null &&
    (Bf(t.remoteStore, n), (t.Oa = t.Oa.remove(e)), t.Na.delete(n), Gf(t))
}
function Z_(t, e, n) {
  for (let r of n)
    r instanceof Za
      ? (t.La.addReference(r.key, e), nN(t, r))
      : r instanceof Xa
        ? (O('SyncEngine', 'Document no longer in limbo: ' + r.key),
          t.La.removeReference(r.key, e),
          t.La.containsKey(r.key) || UI(t, r.key))
        : j()
}
function nN(t, e) {
  let n = e.key,
    r = n.path.canonicalString()
  t.Oa.get(n) ||
    t.xa.has(r) ||
    (O('SyncEngine', 'New document in limbo: ' + n), t.xa.add(r), Gf(t))
}
function Gf(t) {
  for (; t.xa.size > 0 && t.Oa.size < t.maxConcurrentLimboResolutions; ) {
    let e = t.xa.values().next().value
    t.xa.delete(e)
    let n = new L(Ce.fromString(e)),
      r = t.qa.next()
    t.Na.set(r, new Ef(n)),
      (t.Oa = t.Oa.insert(n, r)),
      PI(
        t.remoteStore,
        new Ss(Ft(jf(n.path)), r, 'TargetPurposeLimboResolution', oI.oe)
      )
  }
}
function jI(t, e, n) {
  return A(this, null, function* () {
    let r = X(t),
      i = [],
      s = [],
      o = []
    r.Fa.isEmpty() ||
      (r.Fa.forEach((c, u) => {
        o.push(
          r.Ka(u, e, n).then((d) => {
            var f
            if ((d || n) && r.isPrimaryClient) {
              let m = d
                ? !d.fromCache
                : (f = n?.targetChanges.get(u.targetId)) === null ||
                    f === void 0
                  ? void 0
                  : f.current
              r.sharedClientState.updateQueryState(
                u.targetId,
                m ? 'current' : 'not-current'
              )
            }
            if (d) {
              i.push(d)
              let m = ef.Wi(u.targetId, d)
              s.push(m)
            }
          })
        )
      }),
      yield Promise.all(o),
      r.Ca.d_(i),
      yield (function (u, d) {
        return A(this, null, function* () {
          let f = X(u)
          try {
            yield f.persistence.runTransaction(
              'notifyLocalViewChanges',
              'readwrite',
              (m) =>
                x.forEach(d, (_) =>
                  x
                    .forEach(_.$i, (D) =>
                      f.persistence.referenceDelegate.addReference(
                        m,
                        _.targetId,
                        D
                      )
                    )
                    .next(() =>
                      x.forEach(_.Ui, (D) =>
                        f.persistence.referenceDelegate.removeReference(
                          m,
                          _.targetId,
                          D
                        )
                      )
                    )
                )
            )
          } catch (m) {
            if (!Ps(m)) throw m
            O('LocalStore', 'Failed to update sequence numbers: ' + m)
          }
          for (let m of d) {
            let _ = m.targetId
            if (!m.fromCache) {
              let D = f.os.get(_),
                S = D.snapshotVersion,
                N = D.withLastLimboFreeSnapshotVersion(S)
              f.os = f.os.insert(_, N)
            }
          }
        })
      })(r.localStore, s))
  })
}
function rN(t, e) {
  return A(this, null, function* () {
    let n = X(t)
    if (!n.currentUser.isEqual(e)) {
      O('SyncEngine', 'User change. New user:', e.toKey())
      let r = yield xI(n.localStore, e)
      ;(n.currentUser = e),
        (function (s, o) {
          s.ka.forEach((c) => {
            c.forEach((u) => {
              u.reject(new F(P.CANCELLED, o))
            })
          }),
            s.ka.clear()
        })(
          n,
          "'waitForPendingWrites' promise is rejected due to a user change."
        ),
        n.sharedClientState.handleUserChange(
          e,
          r.removedBatchIds,
          r.addedBatchIds
        ),
        yield jI(n, r.hs)
    }
  })
}
function iN(t, e) {
  let n = X(t),
    r = n.Na.get(e)
  if (r && r.va) return ee().add(r.key)
  {
    let i = ee(),
      s = n.Ma.get(e)
    if (!s) return i
    for (let o of s) {
      let c = n.Fa.get(o)
      i = i.unionWith(c.view.Va)
    }
    return i
  }
}
function BI(t) {
  let e = X(t)
  return (
    (e.remoteStore.remoteSyncer.applyRemoteEvent = VI.bind(null, e)),
    (e.remoteStore.remoteSyncer.getRemoteKeysForTarget = iN.bind(null, e)),
    (e.remoteStore.remoteSyncer.rejectListen = tN.bind(null, e)),
    (e.Ca.d_ = Kx.bind(null, e.eventManager)),
    (e.Ca.$a = Qx.bind(null, e.eventManager)),
    e
  )
}
var X_ = (() => {
  class t {
    constructor() {
      ;(this.kind = 'memory'), (this.synchronizeTabs = !1)
    }
    initialize(n) {
      return A(this, null, function* () {
        ;(this.serializer = MI(n.databaseInfo.databaseId)),
          (this.sharedClientState = this.Wa(n)),
          (this.persistence = this.Ga(n)),
          yield this.persistence.start(),
          (this.localStore = this.za(n)),
          (this.gcScheduler = this.ja(n, this.localStore)),
          (this.indexBackfillerScheduler = this.Ha(n, this.localStore))
      })
    }
    ja(n, r) {
      return null
    }
    Ha(n, r) {
      return null
    }
    za(n) {
      return kx(this.persistence, new nf(), n.initialUser, this.serializer)
    }
    Ga(n) {
      return new Jh(Xh.Zr, this.serializer)
    }
    Wa(n) {
      return new of()
    }
    terminate() {
      return A(this, null, function* () {
        var n, r
        ;(n = this.gcScheduler) === null || n === void 0 || n.stop(),
          (r = this.indexBackfillerScheduler) === null ||
            r === void 0 ||
            r.stop(),
          this.sharedClientState.shutdown(),
          yield this.persistence.shutdown()
      })
    }
  }
  return (t.provider = { build: () => new t() }), t
})()
var sN = (() => {
  class t {
    initialize(n, r) {
      return A(this, null, function* () {
        this.localStore ||
          ((this.localStore = n.localStore),
          (this.sharedClientState = n.sharedClientState),
          (this.datastore = this.createDatastore(r)),
          (this.remoteStore = this.createRemoteStore(r)),
          (this.eventManager = this.createEventManager(r)),
          (this.syncEngine = this.createSyncEngine(r, !n.synchronizeTabs)),
          (this.sharedClientState.onlineStateHandler = (i) =>
            J_(this.syncEngine, i, 1)),
          (this.remoteStore.remoteSyncer.handleCredentialChange = rN.bind(
            null,
            this.syncEngine
          )),
          yield zx(this.remoteStore, this.syncEngine.isPrimaryClient))
      })
    }
    createEventManager(n) {
      return (function () {
        return new yf()
      })()
    }
    createDatastore(n) {
      let r = MI(n.databaseInfo.databaseId),
        i = (function (o) {
          return new uf(o)
        })(n.databaseInfo)
      return (function (o, c, u, d) {
        return new hf(o, c, u, d)
      })(n.authCredentials, n.appCheckCredentials, i, r)
    }
    createRemoteStore(n) {
      return (function (i, s, o, c, u) {
        return new pf(i, s, o, c, u)
      })(
        this.localStore,
        this.datastore,
        n.asyncQueue,
        (r) => J_(this.syncEngine, r, 0),
        (function () {
          return Ka.D() ? new Ka() : new af()
        })()
      )
    }
    createSyncEngine(n, r) {
      return (function (s, o, c, u, d, f, m) {
        let _ = new Tf(s, o, c, u, d, f)
        return m && (_.Qa = !0), _
      })(
        this.localStore,
        this.remoteStore,
        this.eventManager,
        this.sharedClientState,
        n.initialUser,
        n.maxConcurrentLimboResolutions,
        r
      )
    }
    terminate() {
      return A(this, null, function* () {
        var n, r
        yield (function (s) {
          return A(this, null, function* () {
            let o = X(s)
            O('RemoteStore', 'RemoteStore shutting down.'),
              o.L_.add(5),
              yield Os(o),
              o.k_.shutdown(),
              o.q_.set('Unknown')
          })
        })(this.remoteStore),
          (n = this.datastore) === null || n === void 0 || n.terminate(),
          (r = this.eventManager) === null || r === void 0 || r.terminate()
      })
    }
  }
  return (t.provider = { build: () => new t() }), t
})()
var bf = class {
  constructor(e) {
    ;(this.observer = e), (this.muted = !1)
  }
  next(e) {
    this.muted || (this.observer.next && this.Ya(this.observer.next, e))
  }
  error(e) {
    this.muted ||
      (this.observer.error
        ? this.Ya(this.observer.error, e)
        : en('Uncaught Error in snapshot listener:', e.toString()))
  }
  Za() {
    this.muted = !0
  }
  Ya(e, n) {
    setTimeout(() => {
      this.muted || e(n)
    }, 0)
  }
}
var Cf = class {
  constructor(e, n, r, i, s) {
    ;(this.authCredentials = e),
      (this.appCheckCredentials = n),
      (this.asyncQueue = r),
      (this.databaseInfo = i),
      (this.user = xe.UNAUTHENTICATED),
      (this.clientId = hh.newId()),
      (this.authCredentialListener = () => Promise.resolve()),
      (this.appCheckCredentialListener = () => Promise.resolve()),
      (this._uninitializedComponentsProvider = s),
      this.authCredentials.start(r, (o) =>
        A(this, null, function* () {
          O('FirestoreClient', 'Received user=', o.uid),
            yield this.authCredentialListener(o),
            (this.user = o)
        })
      ),
      this.appCheckCredentials.start(
        r,
        (o) => (
          O('FirestoreClient', 'Received new app check token=', o),
          this.appCheckCredentialListener(o, this.user)
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
  terminate() {
    this.asyncQueue.enterRestrictedMode()
    let e = new Tn()
    return (
      this.asyncQueue.enqueueAndForgetEvenWhileRestricted(() =>
        A(this, null, function* () {
          try {
            this._onlineComponents &&
              (yield this._onlineComponents.terminate()),
              this._offlineComponents &&
                (yield this._offlineComponents.terminate()),
              this.authCredentials.shutdown(),
              this.appCheckCredentials.shutdown(),
              e.resolve()
          } catch (n) {
            let r = FI(n, 'Failed to shutdown persistence')
            e.reject(r)
          }
        })
      ),
      e.promise
    )
  }
}
function ih(t, e) {
  return A(this, null, function* () {
    t.asyncQueue.verifyOperationInProgress(),
      O('FirestoreClient', 'Initializing OfflineComponentProvider')
    let n = t.configuration
    yield e.initialize(n)
    let r = n.initialUser
    t.setCredentialChangeListener((i) =>
      A(this, null, function* () {
        r.isEqual(i) || (yield xI(e.localStore, i), (r = i))
      })
    ),
      e.persistence.setDatabaseDeletedListener(() => t.terminate()),
      (t._offlineComponents = e)
  })
}
function eI(t, e) {
  return A(this, null, function* () {
    t.asyncQueue.verifyOperationInProgress()
    let n = yield oN(t)
    O('FirestoreClient', 'Initializing OnlineComponentProvider'),
      yield e.initialize(n, t.configuration),
      t.setCredentialChangeListener((r) => K_(e.remoteStore, r)),
      t.setAppCheckTokenChangeListener((r, i) => K_(e.remoteStore, i)),
      (t._onlineComponents = e)
  })
}
function oN(t) {
  return A(this, null, function* () {
    if (!t._offlineComponents)
      if (t._uninitializedComponentsProvider) {
        O('FirestoreClient', 'Using user provided OfflineComponentProvider')
        try {
          yield ih(t, t._uninitializedComponentsProvider._offline)
        } catch (e) {
          let n = e
          if (
            !(function (i) {
              return i.name === 'FirebaseError'
                ? i.code === P.FAILED_PRECONDITION || i.code === P.UNIMPLEMENTED
                : !(typeof DOMException < 'u' && i instanceof DOMException) ||
                    i.code === 22 ||
                    i.code === 20 ||
                    i.code === 11
            })(n)
          )
            throw n
          Gr(
            'Error using user provided cache. Falling back to memory cache: ' +
              n
          ),
            yield ih(t, new X_())
        }
      } else
        O('FirestoreClient', 'Using default OfflineComponentProvider'),
          yield ih(t, new X_())
    return t._offlineComponents
  })
}
function aN(t) {
  return A(this, null, function* () {
    return (
      t._onlineComponents ||
        (t._uninitializedComponentsProvider
          ? (O(
              'FirestoreClient',
              'Using user provided OnlineComponentProvider'
            ),
            yield eI(t, t._uninitializedComponentsProvider._online))
          : (O('FirestoreClient', 'Using default OnlineComponentProvider'),
            yield eI(t, new sN()))),
      t._onlineComponents
    )
  })
}
function tI(t) {
  return A(this, null, function* () {
    let e = yield aN(t),
      n = e.eventManager
    return (
      (n.onListen = Yx.bind(null, e.syncEngine)),
      (n.onUnlisten = Xx.bind(null, e.syncEngine)),
      (n.onFirstRemoteStoreListen = Jx.bind(null, e.syncEngine)),
      (n.onLastRemoteStoreUnlisten = eN.bind(null, e.syncEngine)),
      n
    )
  })
}
function $I(t) {
  let e = {}
  return t.timeoutSeconds !== void 0 && (e.timeoutSeconds = t.timeoutSeconds), e
}
var nI = new Map()
function cN(t, e, n) {
  if (!n)
    throw new F(
      P.INVALID_ARGUMENT,
      `Function ${t}() cannot be called with an empty ${e}.`
    )
}
function uN(t, e, n, r) {
  if (e === !0 && r === !0)
    throw new F(P.INVALID_ARGUMENT, `${t} and ${n} cannot be used together.`)
}
function rI(t) {
  if (L.isDocumentKey(t))
    throw new F(
      P.INVALID_ARGUMENT,
      `Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`
    )
}
function lN(t) {
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
  return typeof t == 'function' ? 'a function' : j()
}
function Oa(t, e) {
  if (('_delegate' in t && (t = t._delegate), !(t instanceof e))) {
    if (e.name === t.constructor.name)
      throw new F(
        P.INVALID_ARGUMENT,
        'Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?'
      )
    {
      let n = lN(t)
      throw new F(
        P.INVALID_ARGUMENT,
        `Expected type '${e.name}', but it was: ${n}`
      )
    }
  }
  return t
}
var ec = class {
    constructor(e) {
      var n, r
      if (e.host === void 0) {
        if (e.ssl !== void 0)
          throw new F(
            P.INVALID_ARGUMENT,
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
          throw new F(
            P.INVALID_ARGUMENT,
            'cacheSizeBytes must be at least 1048576'
          )
        this.cacheSizeBytes = e.cacheSizeBytes
      }
      uN(
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
        (this.experimentalLongPollingOptions = $I(
          (r = e.experimentalLongPollingOptions) !== null && r !== void 0
            ? r
            : {}
        )),
        (function (s) {
          if (s.timeoutSeconds !== void 0) {
            if (isNaN(s.timeoutSeconds))
              throw new F(
                P.INVALID_ARGUMENT,
                `invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`
              )
            if (s.timeoutSeconds < 5)
              throw new F(
                P.INVALID_ARGUMENT,
                `invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`
              )
            if (s.timeoutSeconds > 30)
              throw new F(
                P.INVALID_ARGUMENT,
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
  Ns = class {
    constructor(e, n, r, i) {
      ;(this._authCredentials = e),
        (this._appCheckCredentials = n),
        (this._databaseId = r),
        (this._app = i),
        (this.type = 'firestore-lite'),
        (this._persistenceKey = '(lite)'),
        (this._settings = new ec({})),
        (this._settingsFrozen = !1),
        (this._terminateTask = 'notTerminated')
    }
    get app() {
      if (!this._app)
        throw new F(
          P.FAILED_PRECONDITION,
          "Firestore was not initialized using the Firebase SDK. 'app' is not available"
        )
      return this._app
    }
    get _initialized() {
      return this._settingsFrozen
    }
    get _terminated() {
      return this._terminateTask !== 'notTerminated'
    }
    _setSettings(e) {
      if (this._settingsFrozen)
        throw new F(
          P.FAILED_PRECONDITION,
          'Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.'
        )
      ;(this._settings = new ec(e)),
        e.credentials !== void 0 &&
          (this._authCredentials = (function (r) {
            if (!r) return new sh()
            switch (r.type) {
              case 'firstParty':
                return new uh(
                  r.sessionIndex || '0',
                  r.iamToken || null,
                  r.authTokenFactory || null
                )
              case 'provider':
                return r.client
              default:
                throw new F(
                  P.INVALID_ARGUMENT,
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
        this._terminateTask === 'notTerminated' &&
          (this._terminateTask = this._terminate()),
        this._terminateTask
      )
    }
    _restart() {
      return A(this, null, function* () {
        this._terminateTask === 'notTerminated'
          ? yield this._terminate()
          : (this._terminateTask = 'notTerminated')
      })
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
          let r = nI.get(n)
          r &&
            (O('ComponentProvider', 'Removing Datastore'),
            nI.delete(n),
            r.terminate())
        })(this),
        Promise.resolve()
      )
    }
  }
function HI(t, e, n, r = {}) {
  var i
  let s = (t = Oa(t, Ns))._getSettings(),
    o = `${e}:${n}`
  if (
    (s.host !== 'firestore.googleapis.com' &&
      s.host !== o &&
      Gr(
        'Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.'
      ),
    t._setSettings(Object.assign(Object.assign({}, s), { host: o, ssl: !1 })),
    r.mockUserToken)
  ) {
    let c, u
    if (typeof r.mockUserToken == 'string')
      (c = r.mockUserToken), (u = xe.MOCK_USER)
    else {
      c = Fv(
        r.mockUserToken,
        (i = t._app) === null || i === void 0 ? void 0 : i.options.projectId
      )
      let d = r.mockUserToken.sub || r.mockUserToken.user_id
      if (!d)
        throw new F(
          P.INVALID_ARGUMENT,
          "mockUserToken must contain 'sub' or 'user_id' field!"
        )
      u = new xe(d)
    }
    t._authCredentials = new oh(new ka(c, u))
  }
}
var tc = class t {
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
  or = class t {
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
      return new qr(this.firestore, this.converter, this._key.path.popLast())
    }
    withConverter(e) {
      return new t(this.firestore, e, this._key)
    }
  },
  qr = class t extends tc {
    constructor(e, n, r) {
      super(e, n, jf(r)), (this._path = r), (this.type = 'collection')
    }
    get id() {
      return this._query.path.lastSegment()
    }
    get path() {
      return this._query.path.canonicalString()
    }
    get parent() {
      let e = this._path.popLast()
      return e.isEmpty() ? null : new or(this.firestore, null, new L(e))
    }
    withConverter(e) {
      return new t(this.firestore, e, this._path)
    }
  }
function qI(t, e, ...n) {
  if (((t = yn(t)), cN('collection', 'path', e), t instanceof Ns)) {
    let r = Ce.fromString(e, ...n)
    return rI(r), new qr(t, null, r)
  }
  {
    if (!(t instanceof or || t instanceof qr))
      throw new F(
        P.INVALID_ARGUMENT,
        'Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore'
      )
    let r = t._path.child(Ce.fromString(e, ...n))
    return rI(r), new qr(t.firestore, null, r)
  }
}
var nc = class {
  constructor(e = Promise.resolve()) {
    ;(this.Pu = []),
      (this.Iu = !1),
      (this.Tu = []),
      (this.Eu = null),
      (this.du = !1),
      (this.Au = !1),
      (this.Ru = []),
      (this.t_ = new Qa(this, 'async_queue_retry')),
      (this.Vu = () => {
        let r = rh()
        r &&
          O('AsyncQueue', 'Visibility state changed to ' + r.visibilityState),
          this.t_.jo()
      }),
      (this.mu = e)
    let n = rh()
    n &&
      typeof n.addEventListener == 'function' &&
      n.addEventListener('visibilitychange', this.Vu)
  }
  get isShuttingDown() {
    return this.Iu
  }
  enqueueAndForget(e) {
    this.enqueue(e)
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    this.fu(), this.gu(e)
  }
  enterRestrictedMode(e) {
    if (!this.Iu) {
      ;(this.Iu = !0), (this.Au = e || !1)
      let n = rh()
      n &&
        typeof n.removeEventListener == 'function' &&
        n.removeEventListener('visibilitychange', this.Vu)
    }
  }
  enqueue(e) {
    if ((this.fu(), this.Iu)) return new Promise(() => {})
    let n = new Tn()
    return this.gu(() =>
      this.Iu && this.Au
        ? Promise.resolve()
        : (e().then(n.resolve, n.reject), n.promise)
    ).then(() => n.promise)
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.Pu.push(e), this.pu()))
  }
  pu() {
    return A(this, null, function* () {
      if (this.Pu.length !== 0) {
        try {
          yield this.Pu[0](), this.Pu.shift(), this.t_.reset()
        } catch (e) {
          if (!Ps(e)) throw e
          O('AsyncQueue', 'Operation failed with retryable error: ' + e)
        }
        this.Pu.length > 0 && this.t_.Go(() => this.pu())
      }
    })
  }
  gu(e) {
    let n = this.mu.then(
      () => (
        (this.du = !0),
        e()
          .catch((r) => {
            ;(this.Eu = r), (this.du = !1)
            let i = (function (o) {
              let c = o.message || ''
              return (
                o.stack &&
                  (c = o.stack.includes(o.message)
                    ? o.stack
                    : o.message +
                      `
` +
                      o.stack),
                c
              )
            })(r)
            throw (en('INTERNAL UNHANDLED ERROR: ', i), r)
          })
          .then((r) => ((this.du = !1), r))
      )
    )
    return (this.mu = n), n
  }
  enqueueAfterDelay(e, n, r) {
    this.fu(), this.Ru.indexOf(e) > -1 && (n = 0)
    let i = mf.createAndSchedule(this, e, n, r, (s) => this.yu(s))
    return this.Tu.push(i), i
  }
  fu() {
    this.Eu && j()
  }
  verifyOperationInProgress() {}
  wu() {
    return A(this, null, function* () {
      let e
      do (e = this.mu), yield e
      while (e !== this.mu)
    })
  }
  Su(e) {
    for (let n of this.Tu) if (n.timerId === e) return !0
    return !1
  }
  bu(e) {
    return this.wu().then(() => {
      this.Tu.sort((n, r) => n.targetTimeMs - r.targetTimeMs)
      for (let n of this.Tu)
        if ((n.skipDelay(), e !== 'all' && n.timerId === e)) break
      return this.wu()
    })
  }
  Du(e) {
    this.Ru.push(e)
  }
  yu(e) {
    let n = this.Tu.indexOf(e)
    this.Tu.splice(n, 1)
  }
}
function iI(t) {
  return (function (n, r) {
    if (typeof n != 'object' || n === null) return !1
    let i = n
    for (let s of r) if (s in i && typeof i[s] == 'function') return !0
    return !1
  })(t, ['next', 'error', 'complete'])
}
var Ms = class extends Ns {
  constructor(e, n, r, i) {
    super(e, n, r, i),
      (this.type = 'firestore'),
      (this._queue = new nc()),
      (this._persistenceKey = i?.name || '[DEFAULT]')
  }
  _terminate() {
    return A(this, null, function* () {
      if (this._firestoreClient) {
        let e = this._firestoreClient.terminate()
        ;(this._queue = new nc(e)), (this._firestoreClient = void 0), yield e
      }
    })
  }
}
function zI(t, e) {
  let n = typeof t == 'object' ? t : rs(),
    r = typeof t == 'string' ? t : e || '(default)',
    i = Rd(n, 'firestore').getImmediate({ identifier: r })
  if (!i._initialized) {
    let s = Ov('firestore')
    s && HI(i, ...s)
  }
  return i
}
function dN(t) {
  if (t._terminated)
    throw new F(
      P.FAILED_PRECONDITION,
      'The client has already been terminated.'
    )
  return t._firestoreClient || hN(t), t._firestoreClient
}
function hN(t) {
  var e, n, r
  let i = t._freezeSettings(),
    s = (function (c, u, d, f) {
      return new mh(
        c,
        u,
        d,
        f.host,
        f.ssl,
        f.experimentalForceLongPolling,
        f.experimentalAutoDetectLongPolling,
        $I(f.experimentalLongPollingOptions),
        f.useFetchStreams
      )
    })(
      t._databaseId,
      ((e = t._app) === null || e === void 0 ? void 0 : e.options.appId) || '',
      t._persistenceKey,
      i
    )
  t._componentsProvider ||
    (!((n = i.localCache) === null || n === void 0) &&
      n._offlineComponentProvider &&
      !((r = i.localCache) === null || r === void 0) &&
      r._onlineComponentProvider &&
      (t._componentsProvider = {
        _offline: i.localCache._offlineComponentProvider,
        _online: i.localCache._onlineComponentProvider,
      })),
    (t._firestoreClient = new Cf(
      t._authCredentials,
      t._appCheckCredentials,
      t._queue,
      s,
      t._componentsProvider &&
        (function (c) {
          let u = c?._online.build()
          return { _offline: c?._offline.build(u), _online: u }
        })(t._componentsProvider)
    ))
}
var Af = class t {
  constructor(e) {
    this._byteString = e
  }
  static fromBase64String(e) {
    try {
      return new t($e.fromBase64String(e))
    } catch (n) {
      throw new F(
        P.INVALID_ARGUMENT,
        'Failed to construct data from Base64 string: ' + n
      )
    }
  }
  static fromUint8Array(e) {
    return new t($e.fromUint8Array(e))
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
var rc = class {
  constructor(...e) {
    for (let n = 0; n < e.length; ++n)
      if (e[n].length === 0)
        throw new F(
          P.INVALID_ARGUMENT,
          'Invalid field name at argument $(i + 1). Field names must not be empty.'
        )
    this._internalPath = new Dt(e)
  }
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath)
  }
}
var Sf = class {
  constructor(e, n) {
    if (!isFinite(e) || e < -90 || e > 90)
      throw new F(
        P.INVALID_ARGUMENT,
        'Latitude must be a number between -90 and 90, but was: ' + e
      )
    if (!isFinite(n) || n < -180 || n > 180)
      throw new F(
        P.INVALID_ARGUMENT,
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
    return ie(this._lat, e._lat) || ie(this._long, e._long)
  }
}
var Rf = class {
  constructor(e) {
    this._values = (e || []).map((n) => n)
  }
  toArray() {
    return this._values.map((e) => e)
  }
  isEqual(e) {
    return (function (r, i) {
      if (r.length !== i.length) return !1
      for (let s = 0; s < r.length; ++s) if (r[s] !== i[s]) return !1
      return !0
    })(this._values, e._values)
  }
}
var fN = new RegExp('[~\\*/\\[\\]]')
function pN(t, e, n) {
  if (e.search(fN) >= 0)
    throw sI(
      `Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,
      t,
      !1,
      void 0,
      n
    )
  try {
    return new rc(...e.split('.'))._internalPath
  } catch {
    throw sI(
      `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
      t,
      !1,
      void 0,
      n
    )
  }
}
function sI(t, e, n, r, i) {
  let s = r && !r.isEmpty(),
    o = i !== void 0,
    c = `Function ${e}() called with invalid data`
  n && (c += ' (via `toFirestore()`)'), (c += '. ')
  let u = ''
  return (
    (s || o) &&
      ((u += ' (found'),
      s && (u += ` in field ${r}`),
      o && (u += ` in document ${i}`),
      (u += ')')),
    new F(P.INVALID_ARGUMENT, c + t + u)
  )
}
var ic = class {
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
      return new or(this._firestore, this._converter, this._key)
    }
    exists() {
      return this._document !== null
    }
    data() {
      if (this._document) {
        if (this._converter) {
          let e = new xf(
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
        let n = this._document.data.field(GI('DocumentSnapshot.get', e))
        if (n !== null) return this._userDataWriter.convertValue(n)
      }
    }
  },
  xf = class extends ic {
    data() {
      return super.data()
    }
  }
function GI(t, e) {
  return typeof e == 'string'
    ? pN(t, e)
    : e instanceof rc
      ? e._internalPath
      : e._delegate._internalPath
}
function mN(t) {
  if (t.limitType === 'L' && t.explicitOrderBy.length === 0)
    throw new F(
      P.UNIMPLEMENTED,
      'limitToLast() queries require specifying at least one orderBy() clause'
    )
}
var Nf = class {
  convertValue(e, n = 'none') {
    switch (sr(e)) {
      case 0:
        return null
      case 1:
        return e.booleanValue
      case 2:
        return fe(e.integerValue || e.doubleValue)
      case 3:
        return this.convertTimestamp(e.timestampValue)
      case 4:
        return this.convertServerTimestamp(e, n)
      case 5:
        return e.stringValue
      case 6:
        return this.convertBytes(Dn(e.bytesValue))
      case 7:
        return this.convertReference(e.referenceValue)
      case 8:
        return this.convertGeoPoint(e.geoPointValue)
      case 9:
        return this.convertArray(e.arrayValue, n)
      case 11:
        return this.convertObject(e.mapValue, n)
      case 10:
        return this.convertVectorValue(e.mapValue)
      default:
        throw j()
    }
  }
  convertObject(e, n) {
    return this.convertObjectMap(e.fields, n)
  }
  convertObjectMap(e, n = 'none') {
    let r = {}
    return (
      cc(e, (i, s) => {
        r[i] = this.convertValue(s, n)
      }),
      r
    )
  }
  convertVectorValue(e) {
    var n, r, i
    let s =
      (i =
        (r =
          (n = e.fields) === null || n === void 0
            ? void 0
            : n.value.arrayValue) === null || r === void 0
          ? void 0
          : r.values) === null || i === void 0
        ? void 0
        : i.map((o) => fe(o.doubleValue))
    return new Rf(s)
  }
  convertGeoPoint(e) {
    return new Sf(fe(e.latitude), fe(e.longitude))
  }
  convertArray(e, n) {
    return (e.values || []).map((r) => this.convertValue(r, n))
  }
  convertServerTimestamp(e, n) {
    switch (n) {
      case 'previous':
        let r = Ff(e)
        return r == null ? null : this.convertValue(r, n)
      case 'estimate':
        return this.convertTimestamp(ws(e))
      default:
        return null
    }
  }
  convertTimestamp(e) {
    let n = tn(e)
    return new pt(n.seconds, n.nanos)
  }
  convertDocumentKey(e, n) {
    let r = Ce.fromString(e)
    ye(RI(r))
    let i = new ja(r.get(1), r.get(3)),
      s = new L(r.popFirst(5))
    return (
      i.isEqual(n) ||
        en(
          `Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`
        ),
      s
    )
  }
}
var nr = class {
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
  sc = class extends ic {
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
          let n = new zr(
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
        let r = this._document.data.field(GI('DocumentSnapshot.get', e))
        if (r !== null)
          return this._userDataWriter.convertValue(r, n.serverTimestamps)
      }
    }
  },
  zr = class extends sc {
    data(e = {}) {
      return super.data(e)
    }
  },
  Mf = class {
    constructor(e, n, r, i) {
      ;(this._firestore = e),
        (this._userDataWriter = n),
        (this._snapshot = i),
        (this.metadata = new nr(i.hasPendingWrites, i.fromCache)),
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
          new zr(
            this._firestore,
            this._userDataWriter,
            r.key,
            r,
            new nr(
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
        throw new F(
          P.INVALID_ARGUMENT,
          'To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().'
        )
      return (
        (this._cachedChanges &&
          this._cachedChangesIncludeMetadataChanges === n) ||
          ((this._cachedChanges = (function (i, s) {
            if (i._snapshot.oldDocs.isEmpty()) {
              let o = 0
              return i._snapshot.docChanges.map((c) => {
                let u = new zr(
                  i._firestore,
                  i._userDataWriter,
                  c.doc.key,
                  c.doc,
                  new nr(
                    i._snapshot.mutatedKeys.has(c.doc.key),
                    i._snapshot.fromCache
                  ),
                  i.query.converter
                )
                return (
                  c.doc, { type: 'added', doc: u, oldIndex: -1, newIndex: o++ }
                )
              })
            }
            {
              let o = i._snapshot.oldDocs
              return i._snapshot.docChanges
                .filter((c) => s || c.type !== 3)
                .map((c) => {
                  let u = new zr(
                      i._firestore,
                      i._userDataWriter,
                      c.doc.key,
                      c.doc,
                      new nr(
                        i._snapshot.mutatedKeys.has(c.doc.key),
                        i._snapshot.fromCache
                      ),
                      i.query.converter
                    ),
                    d = -1,
                    f = -1
                  return (
                    c.type !== 0 &&
                      ((d = o.indexOf(c.doc.key)), (o = o.delete(c.doc.key))),
                    c.type !== 1 &&
                      ((o = o.add(c.doc)), (f = o.indexOf(c.doc.key))),
                    { type: gN(c.type), doc: u, oldIndex: d, newIndex: f }
                  )
                })
            }
          })(this, n)),
          (this._cachedChangesIncludeMetadataChanges = n)),
        this._cachedChanges
      )
    }
  }
function gN(t) {
  switch (t) {
    case 0:
      return 'added'
    case 2:
    case 3:
      return 'modified'
    case 1:
      return 'removed'
    default:
      return j()
  }
}
var oc = class extends Nf {
  constructor(e) {
    super(), (this.firestore = e)
  }
  convertBytes(e) {
    return new Af(e)
  }
  convertReference(e) {
    let n = this.convertDocumentKey(e, this.firestore._databaseId)
    return new or(this.firestore, null, n)
  }
}
function Wf(t, ...e) {
  var n, r, i
  t = yn(t)
  let s = { includeMetadataChanges: !1, source: 'default' },
    o = 0
  typeof e[o] != 'object' || iI(e[o]) || ((s = e[o]), o++)
  let c = { includeMetadataChanges: s.includeMetadataChanges, source: s.source }
  if (iI(e[o])) {
    let m = e[o]
    ;(e[o] = (n = m.next) === null || n === void 0 ? void 0 : n.bind(m)),
      (e[o + 1] = (r = m.error) === null || r === void 0 ? void 0 : r.bind(m)),
      (e[o + 2] =
        (i = m.complete) === null || i === void 0 ? void 0 : i.bind(m))
  }
  let u, d, f
  if (t instanceof or)
    (d = Oa(t.firestore, Ms)),
      (f = jf(t._key.path)),
      (u = {
        next: (m) => {
          e[o] && e[o](yN(d, t, m))
        },
        error: e[o + 1],
        complete: e[o + 2],
      })
  else {
    let m = Oa(t, tc)
    ;(d = Oa(m.firestore, Ms)), (f = m._query)
    let _ = new oc(d)
    ;(u = {
      next: (D) => {
        e[o] && e[o](new Mf(d, _, m, D))
      },
      error: e[o + 1],
      complete: e[o + 2],
    }),
      mN(t._query)
  }
  return (function (_, D, S, N) {
    let R = new bf(N),
      k = new _f(D, R, S)
    return (
      _.asyncQueue.enqueueAndForget(() =>
        A(this, null, function* () {
          return Gx(yield tI(_), k)
        })
      ),
      () => {
        R.Za(),
          _.asyncQueue.enqueueAndForget(() =>
            A(this, null, function* () {
              return Wx(yield tI(_), k)
            })
          )
      }
    )
  })(dN(d), f, c, u)
}
function yN(t, e, n) {
  let r = n.docs.get(e._key),
    i = new oc(t)
  return new sc(
    t,
    i,
    e._key,
    r,
    new nr(n.hasPendingWrites, n.fromCache),
    e.converter
  )
}
;(function (e, n = !0) {
  ;(function (i) {
    ii = i
  })(Or),
    In(
      new ft(
        'firestore',
        (r, { instanceIdentifier: i, options: s }) => {
          let o = r.getProvider('app').getImmediate(),
            c = new Ms(
              new ah(r.getProvider('auth-internal')),
              new dh(r.getProvider('app-check-internal')),
              (function (d, f) {
                if (
                  !Object.prototype.hasOwnProperty.apply(d.options, [
                    'projectId',
                  ])
                )
                  throw new F(
                    P.INVALID_ARGUMENT,
                    '"projectId" not provided in firebase.initializeApp.'
                  )
                return new ja(d.options.projectId, f)
              })(o, i),
              o
            )
          return (
            (s = Object.assign({ useFetchStreams: n }, s)), c._setSettings(s), c
          )
        },
        'PUBLIC'
      ).setMultipleInstances(!0)
    ),
    Re(C_, '4.7.3', e),
    Re(C_, '4.7.3', 'esm2017')
})()
var hc = function () {
  return (
    (hc =
      Object.assign ||
      function (e) {
        for (var n, r = 1, i = arguments.length; r < i; r++) {
          n = arguments[r]
          for (var s in n)
            Object.prototype.hasOwnProperty.call(n, s) && (e[s] = n[s])
        }
        return e
      }),
    hc.apply(this, arguments)
  )
}
var IN = { includeMetadataChanges: !1 }
function WI(t, e) {
  return (
    e === void 0 && (e = IN),
    new ue(function (n) {
      var r = Wf(t, e, {
        next: n.next.bind(n),
        error: n.error.bind(n),
        complete: n.complete.bind(n),
      })
      return { unsubscribe: r }
    })
  )
}
function KI(t, e) {
  var n
  e === void 0 && (e = {})
  var r = t.data(e)
  return !t.exists() || typeof r != 'object' || r === null || !e.idField
    ? r
    : hc(hc({}, r), ((n = {}), (n[e.idField] = t.id), n))
}
function QI(t) {
  return WI(t, { includeMetadataChanges: !0 }).pipe(
    ze(function (e) {
      return e.docs
    })
  )
}
function YI(t, e) {
  return (
    e === void 0 && (e = {}),
    QI(t).pipe(
      ze(function (n) {
        return n.map(function (r) {
          return KI(r, e)
        })
      })
    )
  )
}
var ar = class {
    constructor(e) {
      return e
    }
  },
  JI = 'firestore',
  Kf = class {
    constructor() {
      return ss(JI)
    }
  }
var Qf = new oe('angularfire2.firestore-instances')
function wN(t, e) {
  let n = Md(JI, t, e)
  return n && new ar(n)
}
function EN(t) {
  return (e, n) => {
    let r = e.runOutsideAngular(() => t(n))
    return new ar(r)
  }
}
var TN = { provide: Kf, deps: [[new Qt(), Qf]] },
  DN = { provide: ar, useFactory: wN, deps: [[new Qt(), Qf], Yn] },
  bN = (() => {
    class t {
      constructor() {
        Re('angularfire', Fr.full, 'fst')
      }
      static ɵfac = function (r) {
        return new (r || t)()
      }
      static ɵmod = Hn({ type: t })
      static ɵinj = $n({ providers: [DN, TN] })
    }
    return t
  })()
function ZI(t, ...e) {
  return {
    ngModule: bN,
    providers: [
      {
        provide: Qf,
        useFactory: EN(t),
        multi: !0,
        deps: [ge, fn, os, as, [new Qt(), Sa], [new Qt(), is], ...e],
      },
    ],
  }
}
var XI = Qn(YI, !0)
var ew = Qn(qI, !0)
var tw = Qn(zI, !0)
var nw = {
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
var rw = { providers: [Qo(i_(() => s_(nw.firebase))), Qo(ZI(() => tw()))] }
var iw = (() => {
  let e = class e {
    constructor() {
      this.firestore = ve(ar)
    }
    getCertificates() {
      let r = ew(this.firestore, 'certifications')
      return XI(r, { idField: 'id' }).pipe(
        ze((s) => ({ data: s, loaded: !0 })),
        Io(() => eu({ data: [], loaded: !1 }))
      )
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵprov = pe({ token: e, factory: e.ɵfac, providedIn: 'root' }))
  let t = e
  return t
})()
var sw = (() => {
  let e = class e {}
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = Ie({
      type: e,
      selectors: [['app-footer']],
      standalone: !0,
      features: [Te],
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
          'https://jpineda.dev',
          'target',
          '_blank',
          'rel',
          'noreferrer noopener',
        ],
      ],
      template: function (i, s) {
        i & 1 &&
          ($(0, 'footer', 0)(1, 'p', 1)(2, 'a', 2),
          Ke(3, ' GitHub '),
          W(),
          $(4, 'span', 3),
          Ke(5, '\xB7'),
          W(),
          $(6, 'a', 4),
          Ke(7, ' LinkedIn '),
          W(),
          $(8, 'span', 3),
          Ke(9, '\xB7'),
          W(),
          $(10, 'a', 5),
          Ke(11, ' Portfolio '),
          W()()())
      },
      encapsulation: 2,
      changeDetection: 0,
    }))
  let t = e
  return t
})()
function CN(t, e) {
  if (t & 1) {
    let n = dt()
    $(0, 'div', 1),
      Ke(1, ' Click or tap on image to enlarge '),
      $(2, 'button', 2),
      Ee('click', function () {
        ut(n)
        let i = Me()
        return lt((i.showAlert = !1))
      }),
      W()()
  }
}
var ow = (() => {
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
    (e.ɵcmp = Ie({
      type: e,
      selectors: [['app-instructions']],
      standalone: !0,
      features: [Te],
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
        i & 1 && Ze(0, CN, 3, 0, 'div', 0), i & 2 && Tt(0, s.showAlert ? 0 : -1)
      },
      encapsulation: 2,
    }))
  let t = e
  return t
})()
function AN(t, e) {
  if (t & 1) {
    let n = dt()
    $(0, 'button', 1),
      Ee('click', function () {
        let s = ut(n).$implicit,
          o = Me()
        return lt(o.onSelectCategory(s))
      }),
      Ke(1),
      W()
  }
  if (t & 2) {
    let n = e.$implicit,
      r = Me()
    tv(r.selectedCategory === n ? 'btn-primary' : 'btn-outline-primary'),
      We(),
      Gl(' ', n, ' ')
  }
}
var aw = (() => {
  let e = class e {
    constructor() {
      ;(this.categoryChange = new nt()),
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
    (e.ɵcmp = Ie({
      type: e,
      selectors: [['app-category-selector']],
      inputs: { categories: 'categories' },
      outputs: { categoryChange: 'categoryChange' },
      standalone: !0,
      features: [Te],
      decls: 3,
      vars: 0,
      consts: [
        [1, 'mb-3', 'd-flex', 'flex-wrap'],
        [1, 'btn', 'btn-sm', 'me-2', 'mb-2', 3, 'click'],
        ['class', 'btn btn-sm me-2 mb-2', 3, 'class'],
      ],
      template: function (i, s) {
        i & 1 && ($(0, 'div', 0), ia(1, AN, 2, 3, 'button', 2, iv), W()),
          i & 2 && (We(), sa(s._categories))
      },
      encapsulation: 2,
    }))
  let t = e
  return t
})()
var cw = (() => {
  let e = class e {
    constructor() {
      this.reload = new nt()
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = Ie({
      type: e,
      selectors: [['app-no-certificates']],
      outputs: { reload: 'reload' },
      standalone: !0,
      features: [Te],
      decls: 5,
      vars: 0,
      consts: [
        [1, 'container', 'text-center'],
        [1, 'text-center', 'my-4'],
        ['type', 'button', 1, 'btn', 'btn-primary', 'btn-lg', 3, 'click'],
      ],
      template: function (i, s) {
        i & 1 &&
          ($(0, 'div', 0)(1, 'h2', 1),
          Ke(2, 'No certificates found'),
          W(),
          $(3, 'button', 2),
          Ee('click', function () {
            return s.reload.emit()
          }),
          Ke(4, ' Reload certifications '),
          W()())
      },
      encapsulation: 2,
      changeDetection: 0,
    }))
  let t = e
  return t
})()
var uw = (() => {
  let e = class e {}
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = Ie({
      type: e,
      selectors: [['app-loader']],
      standalone: !0,
      features: [Te],
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
        i & 1 && ($(0, 'div', 0), we(1, 'div', 1), W())
      },
      encapsulation: 2,
      changeDetection: 0,
    }))
  let t = e
  return t
})()
function SN(t, e) {
  if (t & 1) {
    let n = dt()
    $(0, 'button', 1),
      Ee('click', function () {
        ut(n)
        let i = Me()
        return lt(i.previewClosed.emit())
      }),
      we(1, 'img', 2)(2, 'button', 3),
      W()
  }
  if (t & 2) {
    let n = Me()
    We(),
      st('alt', n.certificate.id)('title', n.certificate.id)(
        'src',
        n.certificate.image,
        Xo
      )
  }
}
var lw = (() => {
  let e = class e {
    constructor() {
      this.previewClosed = new nt()
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = Ie({
      type: e,
      selectors: [['app-certificate-previewer']],
      inputs: { certificate: 'certificate' },
      outputs: { previewClosed: 'previewClosed' },
      standalone: !0,
      features: [Te],
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
        i & 1 && Ze(0, SN, 3, 3, 'button', 0),
          i & 2 && Tt(0, s.certificate ? 0 : -1)
      },
      encapsulation: 2,
      changeDetection: 0,
    }))
  let t = e
  return t
})()
var dw = (() => {
  let e = class e {
    constructor() {
      this.certificateSelected = new nt()
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = Ie({
      type: e,
      selectors: [['app-certificate-thumbnail']],
      inputs: { certificate: 'certificate' },
      outputs: { certificateSelected: 'certificateSelected' },
      standalone: !0,
      features: [Te],
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
          ($(0, 'button', 0),
          Ee('click', function () {
            return s.certificateSelected.emit(s.certificate)
          }),
          we(1, 'img', 1),
          W()),
          i & 2 &&
            (We(),
            st('alt', s.certificate.id)('title', s.certificate.id)(
              'src',
              s.certificate.image,
              Xo
            ))
      },
      styles: [
        '[_nghost-%COMP%]{width:100%;height:100%;display:block}img[_ngcontent-%COMP%]{min-height:300px}',
      ],
    }))
  let t = e
  return t
})()
function RN(t, e) {
  if (t & 1) {
    let n = dt()
    $(0, 'button', 1),
      Ee('click', function () {
        ut(n)
        let i = Me()
        return lt(i.scrollToTop())
      }),
      we(1, 'img', 2),
      W()
  }
  t & 2 && st('@inOutAnimation', void 0)
}
var hw = (() => {
  let e = class e {
    constructor() {
      this.show$ = Ai(document, 'scroll').pipe(
        ze(() => window.scrollY / window.screen.height > 0.5)
      )
    }
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  ;(e.ɵfac = function (i) {
    return new (i || e)()
  }),
    (e.ɵcmp = Ie({
      type: e,
      selectors: [['app-to-top']],
      standalone: !0,
      features: [Te],
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
        i & 1 && (Ze(0, RN, 2, 1, 'button', 0), av(1, 'async')),
          i & 2 && Tt(0, cv(1, 1, s.show$) ? 0 : -1)
      },
      dependencies: [Gn, _v],
      styles: [
        'button[_ngcontent-%COMP%]{opacity:.5;transition:opacity .3s}button[_ngcontent-%COMP%]:hover{opacity:.75}',
      ],
    }))
  let t = e
  return t
})()
function xN(t, e) {
  t & 1 && (Qi(), $(0, 'svg', 9), we(1, 'path', 10), W())
}
function NN(t, e) {
  t & 1 && (Qi(), $(0, 'svg', 4), we(1, 'path', 11), W())
}
var MN = (t, e) => ({ 'bg-black': t, 'bg-dark': e }),
  fw = (() => {
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
      (e.ɵcmp = Ie({
        type: e,
        selectors: [['app-nav']],
        standalone: !0,
        features: [Te],
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
            ($(0, 'nav', 0)(1, 'div', 1)(2, 'div', 2)(3, 'a', 3),
            Qi(),
            $(4, 'svg', 4),
            we(5, 'path', 5),
            W()(),
            pl(),
            $(6, 'a', 6),
            Qi(),
            $(7, 'svg', 4),
            we(8, 'path', 7),
            W()()(),
            pl(),
            $(9, 'button', 8),
            Ee('click', function () {
              return s.toggleTheme()
            }),
            Ze(10, xN, 2, 0, ':svg:svg', 9)(11, NN, 2, 0),
            W()()()),
            i & 2 &&
              (st(
                'ngClass',
                sv(2, MN, s.theme === 'dark', s.theme === 'light')
              ),
              We(10),
              Tt(10, s.theme === 'dark' ? 10 : 11))
        },
        dependencies: [Gn, vv],
        encapsulation: 2,
      }))
    let t = e
    return t
  })()
var PN = (t, e) => e.id
function ON(t, e) {
  if (t & 1) {
    let n = dt()
    $(0, 'div', 8)(1, 'app-certificate-thumbnail', 9),
      Ee('certificateSelected', function (i) {
        ut(n)
        let s = Me(3)
        return lt((s.selectedCertificate = i))
      }),
      W()()
  }
  if (t & 2) {
    let n = Me().$implicit
    We(), st('certificate', n)
  }
}
function kN(t, e) {
  if ((t & 1 && Ze(0, ON, 2, 1, 'div', 7), t & 2)) {
    let n = e.$implicit,
      r = Me(2)
    Tt(
      0,
      n.category.split(',').includes(r.selectedCategory) ||
        r.selectedCategory === 'All'
        ? 0
        : -1
    )
  }
}
function FN(t, e) {
  if (t & 1) {
    let n = dt()
    we(0, 'app-instructions'),
      $(1, 'app-category-selector', 5),
      Ee('categoryChange', function (i) {
        ut(n)
        let s = Me()
        return lt((s.selectedCategory = i))
      }),
      W(),
      $(2, 'div', 6),
      ia(3, kN, 1, 1, null, null, PN),
      W()
  }
  if (t & 2) {
    let n = Me()
    We(), st('categories', n.categories), We(2), sa(n.certificates)
  }
}
function LN(t, e) {
  if (t & 1) {
    let n = dt()
    $(0, 'app-no-certificates', 10),
      Ee('reload', function () {
        ut(n)
        let i = Me()
        return lt(i.ngOnInit())
      }),
      W()
  }
}
function VN(t, e) {
  t & 1 && we(0, 'app-loader')
}
var pw = (() => {
  let e = class e {
    constructor() {
      ;(this.appService = ve(iw)),
        (this.certificates = []),
        (this.categories = []),
        (this.selectedCategory = 'All'),
        (this.loaded = !1)
    }
    ngOnInit() {
      this.appService
        .getCertificates()
        .pipe(
          nu(1),
          un(({ data: r }) => {
            this.categories = [
              ...new Set(r.flatMap((i) => i.category.split(','))),
            ].sort()
          }),
          un(({ loaded: r }) => (this.loaded = r)),
          un(
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
    (e.ɵcmp = Ie({
      type: e,
      selectors: [['app-root']],
      standalone: !0,
      features: [Te],
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
          ($(0, 'div', 0),
          we(1, 'app-nav', 1),
          $(2, 'main', 2)(3, 'h1', 3),
          Ke(4, "Jaime Pineda's Certificates"),
          W(),
          Ze(5, FN, 5, 1)(6, LN, 1, 0)(7, VN, 1, 0),
          W(),
          we(8, 'app-footer'),
          W(),
          $(9, 'app-certificate-previewer', 4),
          Ee('previewClosed', function () {
            return (s.selectedCertificate = void 0)
          }),
          W(),
          we(10, 'app-to-top')),
          i & 2 &&
            (We(5),
            Tt(
              5,
              s.loaded && s.certificates.length !== 0
                ? 5
                : s.loaded && s.certificates.length === 0
                  ? 6
                  : 7
            ),
            We(4),
            st('certificate', s.selectedCertificate))
      },
      dependencies: [Gn, sw, ow, aw, cw, uw, dw, lw, hw, fw],
      encapsulation: 2,
    }))
  let t = e
  return t
})()
Rv(pw, rw).catch((t) => console.error(t))
