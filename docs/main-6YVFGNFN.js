var _s = Object.defineProperty,
  Ss = Object.defineProperties
var xs = Object.getOwnPropertyDescriptors
var hr = Object.getOwnPropertySymbols
var Ns = Object.prototype.hasOwnProperty,
  As = Object.prototype.propertyIsEnumerable
var gr = (e, t, n) =>
    t in e
      ? _s(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
      : (e[t] = n),
  U = (e, t) => {
    for (var n in (t ||= {})) Ns.call(t, n) && gr(e, n, t[n])
    if (hr) for (var n of hr(t)) As.call(t, n) && gr(e, n, t[n])
    return e
  },
  K = (e, t) => Ss(e, xs(t))
var mr = null
var At = 1,
  Dr = Symbol('SIGNAL')
function S(e) {
  let t = mr
  return (mr = e), t
}
var yr = {
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
function Os(e) {
  if (!(Ft(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === At)) {
    if (!e.producerMustRecompute(e) && !Ot(e)) {
      ;(e.dirty = !1), (e.lastCleanEpoch = At)
      return
    }
    e.producerRecomputeValue(e), (e.dirty = !1), (e.lastCleanEpoch = At)
  }
}
function vr(e) {
  return e && (e.nextProducerIndex = 0), S(e)
}
function Er(e, t) {
  if (
    (S(t),
    !(
      !e ||
      e.producerNode === void 0 ||
      e.producerIndexOfThis === void 0 ||
      e.producerLastReadVersion === void 0
    ))
  ) {
    if (Ft(e))
      for (let n = e.nextProducerIndex; n < e.producerNode.length; n++)
        Rt(e.producerNode[n], e.producerIndexOfThis[n])
    for (; e.producerNode.length > e.nextProducerIndex; )
      e.producerNode.pop(),
        e.producerLastReadVersion.pop(),
        e.producerIndexOfThis.pop()
  }
}
function Ot(e) {
  Qe(e)
  for (let t = 0; t < e.producerNode.length; t++) {
    let n = e.producerNode[t],
      r = e.producerLastReadVersion[t]
    if (r !== n.version || (Os(n), r !== n.version)) return !0
  }
  return !1
}
function Ir(e) {
  if ((Qe(e), Ft(e)))
    for (let t = 0; t < e.producerNode.length; t++)
      Rt(e.producerNode[t], e.producerIndexOfThis[t])
  ;(e.producerNode.length =
    e.producerLastReadVersion.length =
    e.producerIndexOfThis.length =
      0),
    e.liveConsumerNode &&
      (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0)
}
function Rt(e, t) {
  if ((Rs(e), Qe(e), e.liveConsumerNode.length === 1))
    for (let r = 0; r < e.producerNode.length; r++)
      Rt(e.producerNode[r], e.producerIndexOfThis[r])
  let n = e.liveConsumerNode.length - 1
  if (
    ((e.liveConsumerNode[t] = e.liveConsumerNode[n]),
    (e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n]),
    e.liveConsumerNode.length--,
    e.liveConsumerIndexOfThis.length--,
    t < e.liveConsumerNode.length)
  ) {
    let r = e.liveConsumerIndexOfThis[t],
      o = e.liveConsumerNode[t]
    Qe(o), (o.producerIndexOfThis[r] = t)
  }
}
function Ft(e) {
  return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0
}
function Qe(e) {
  ;(e.producerNode ??= []),
    (e.producerIndexOfThis ??= []),
    (e.producerLastReadVersion ??= [])
}
function Rs(e) {
  ;(e.liveConsumerNode ??= []), (e.liveConsumerIndexOfThis ??= [])
}
function Fs() {
  throw new Error()
}
var Ps = Fs
function wr(e) {
  Ps = e
}
function T(e) {
  return typeof e == 'function'
}
function Ke(e) {
  let n = e((r) => {
    Error.call(r), (r.stack = new Error().stack)
  })
  return (
    (n.prototype = Object.create(Error.prototype)),
    (n.prototype.constructor = n),
    n
  )
}
var Je = Ke(
  (e) =>
    function (n) {
      e(this),
        (this.message = n
          ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = n)
    }
)
function Se(e, t) {
  if (e) {
    let n = e.indexOf(t)
    0 <= n && e.splice(n, 1)
  }
}
var _ = class e {
  constructor(t) {
    ;(this.initialTeardown = t),
      (this.closed = !1),
      (this._parentage = null),
      (this._finalizers = null)
  }
  unsubscribe() {
    let t
    if (!this.closed) {
      this.closed = !0
      let { _parentage: n } = this
      if (n)
        if (((this._parentage = null), Array.isArray(n)))
          for (let i of n) i.remove(this)
        else n.remove(this)
      let { initialTeardown: r } = this
      if (T(r))
        try {
          r()
        } catch (i) {
          t = i instanceof Je ? i.errors : [i]
        }
      let { _finalizers: o } = this
      if (o) {
        this._finalizers = null
        for (let i of o)
          try {
            Cr(i)
          } catch (s) {
            ;(t = t ?? []),
              s instanceof Je ? (t = [...t, ...s.errors]) : t.push(s)
          }
      }
      if (t) throw new Je(t)
    }
  }
  add(t) {
    var n
    if (t && t !== this)
      if (this.closed) Cr(t)
      else {
        if (t instanceof e) {
          if (t.closed || t._hasParent(this)) return
          t._addParent(this)
        }
        ;(this._finalizers =
          (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t)
      }
  }
  _hasParent(t) {
    let { _parentage: n } = this
    return n === t || (Array.isArray(n) && n.includes(t))
  }
  _addParent(t) {
    let { _parentage: n } = this
    this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t
  }
  _removeParent(t) {
    let { _parentage: n } = this
    n === t ? (this._parentage = null) : Array.isArray(n) && Se(n, t)
  }
  remove(t) {
    let { _finalizers: n } = this
    n && Se(n, t), t instanceof e && t._removeParent(this)
  }
}
_.EMPTY = (() => {
  let e = new _()
  return (e.closed = !0), e
})()
var Pt = _.EMPTY
function Xe(e) {
  return (
    e instanceof _ ||
    (e && 'closed' in e && T(e.remove) && T(e.add) && T(e.unsubscribe))
  )
}
function Cr(e) {
  T(e) ? e() : e.unsubscribe()
}
var x = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
}
var ue = {
  setTimeout(e, t, ...n) {
    let { delegate: r } = ue
    return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n)
  },
  clearTimeout(e) {
    let { delegate: t } = ue
    return (t?.clearTimeout || clearTimeout)(e)
  },
  delegate: void 0,
}
function Mr(e) {
  ue.setTimeout(() => {
    let { onUnhandledError: t } = x
    if (t) t(e)
    else throw e
  })
}
function kt() {}
var br = Lt('C', void 0, void 0)
function Tr(e) {
  return Lt('E', void 0, e)
}
function _r(e) {
  return Lt('N', e, void 0)
}
function Lt(e, t, n) {
  return { kind: e, value: t, error: n }
}
var J = null
function ce(e) {
  if (x.useDeprecatedSynchronousErrorHandling) {
    let t = !J
    if ((t && (J = { errorThrown: !1, error: null }), e(), t)) {
      let { errorThrown: n, error: r } = J
      if (((J = null), n)) throw r
    }
  } else e()
}
function Sr(e) {
  x.useDeprecatedSynchronousErrorHandling &&
    J &&
    ((J.errorThrown = !0), (J.error = e))
}
var X = class extends _ {
    constructor(t) {
      super(),
        (this.isStopped = !1),
        t
          ? ((this.destination = t), Xe(t) && t.add(this))
          : (this.destination = js)
    }
    static create(t, n, r) {
      return new le(t, n, r)
    }
    next(t) {
      this.isStopped ? Vt(_r(t), this) : this._next(t)
    }
    error(t) {
      this.isStopped ? Vt(Tr(t), this) : ((this.isStopped = !0), this._error(t))
    }
    complete() {
      this.isStopped ? Vt(br, this) : ((this.isStopped = !0), this._complete())
    }
    unsubscribe() {
      this.closed ||
        ((this.isStopped = !0), super.unsubscribe(), (this.destination = null))
    }
    _next(t) {
      this.destination.next(t)
    }
    _error(t) {
      try {
        this.destination.error(t)
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
  ks = Function.prototype.bind
function jt(e, t) {
  return ks.call(e, t)
}
var Bt = class {
    constructor(t) {
      this.partialObserver = t
    }
    next(t) {
      let { partialObserver: n } = this
      if (n.next)
        try {
          n.next(t)
        } catch (r) {
          et(r)
        }
    }
    error(t) {
      let { partialObserver: n } = this
      if (n.error)
        try {
          n.error(t)
        } catch (r) {
          et(r)
        }
      else et(t)
    }
    complete() {
      let { partialObserver: t } = this
      if (t.complete)
        try {
          t.complete()
        } catch (n) {
          et(n)
        }
    }
  },
  le = class extends X {
    constructor(t, n, r) {
      super()
      let o
      if (T(t) || !t)
        o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 }
      else {
        let i
        this && x.useDeprecatedNextContext
          ? ((i = Object.create(t)),
            (i.unsubscribe = () => this.unsubscribe()),
            (o = {
              next: t.next && jt(t.next, i),
              error: t.error && jt(t.error, i),
              complete: t.complete && jt(t.complete, i),
            }))
          : (o = t)
      }
      this.destination = new Bt(o)
    }
  }
function et(e) {
  x.useDeprecatedSynchronousErrorHandling ? Sr(e) : Mr(e)
}
function Ls(e) {
  throw e
}
function Vt(e, t) {
  let { onStoppedNotification: n } = x
  n && ue.setTimeout(() => n(e, t))
}
var js = { closed: !0, next: kt, error: Ls, complete: kt }
var xr = (typeof Symbol == 'function' && Symbol.observable) || '@@observable'
function Nr(e) {
  return e
}
function Ar(e) {
  return e.length === 0
    ? Nr
    : e.length === 1
      ? e[0]
      : function (n) {
          return e.reduce((r, o) => o(r), n)
        }
}
var Ht = (() => {
  class e {
    constructor(n) {
      n && (this._subscribe = n)
    }
    lift(n) {
      let r = new e()
      return (r.source = this), (r.operator = n), r
    }
    subscribe(n, r, o) {
      let i = Bs(n) ? n : new le(n, r, o)
      return (
        ce(() => {
          let { operator: s, source: a } = this
          i.add(
            s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i)
          )
        }),
        i
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
        (r = Or(r)),
        new r((o, i) => {
          let s = new le({
            next: (a) => {
              try {
                n(a)
              } catch (u) {
                i(u), s.unsubscribe()
              }
            },
            error: i,
            complete: o,
          })
          this.subscribe(s)
        })
      )
    }
    _subscribe(n) {
      var r
      return (r = this.source) === null || r === void 0
        ? void 0
        : r.subscribe(n)
    }
    [xr]() {
      return this
    }
    pipe(...n) {
      return Ar(n)(this)
    }
    toPromise(n) {
      return (
        (n = Or(n)),
        new n((r, o) => {
          let i
          this.subscribe(
            (s) => (i = s),
            (s) => o(s),
            () => r(i)
          )
        })
      )
    }
  }
  return (e.create = (t) => new e(t)), e
})()
function Or(e) {
  var t
  return (t = e ?? x.Promise) !== null && t !== void 0 ? t : Promise
}
function Vs(e) {
  return e && T(e.next) && T(e.error) && T(e.complete)
}
function Bs(e) {
  return (e && e instanceof X) || (Vs(e) && Xe(e))
}
function Hs(e) {
  return T(e?.lift)
}
function Rr(e) {
  return (t) => {
    if (Hs(t))
      return t.lift(function (n) {
        try {
          return e(n, this)
        } catch (r) {
          this.error(r)
        }
      })
    throw new TypeError('Unable to lift unknown Observable type')
  }
}
function Fr(e, t, n, r, o) {
  return new $t(e, t, n, r, o)
}
var $t = class extends X {
  constructor(t, n, r, o, i, s) {
    super(t),
      (this.onFinalize = i),
      (this.shouldUnsubscribe = s),
      (this._next = n
        ? function (a) {
            try {
              n(a)
            } catch (u) {
              t.error(u)
            }
          }
        : super._next),
      (this._error = o
        ? function (a) {
            try {
              o(a)
            } catch (u) {
              t.error(u)
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
              t.error(a)
            } finally {
              this.unsubscribe()
            }
          }
        : super._complete)
  }
  unsubscribe() {
    var t
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: n } = this
      super.unsubscribe(),
        !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this))
    }
  }
}
var Pr = Ke(
  (e) =>
    function () {
      e(this),
        (this.name = 'ObjectUnsubscribedError'),
        (this.message = 'object unsubscribed')
    }
)
var de = (() => {
    class e extends Ht {
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
        let r = new tt(this, this)
        return (r.operator = n), r
      }
      _throwIfClosed() {
        if (this.closed) throw new Pr()
      }
      next(n) {
        ce(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers ||
              (this.currentObservers = Array.from(this.observers))
            for (let r of this.currentObservers) r.next(n)
          }
        })
      }
      error(n) {
        ce(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            ;(this.hasError = this.isStopped = !0), (this.thrownError = n)
            let { observers: r } = this
            for (; r.length; ) r.shift().error(n)
          }
        })
      }
      complete() {
        ce(() => {
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
        let { hasError: r, isStopped: o, observers: i } = this
        return r || o
          ? Pt
          : ((this.currentObservers = null),
            i.push(n),
            new _(() => {
              ;(this.currentObservers = null), Se(i, n)
            }))
      }
      _checkFinalizedStatuses(n) {
        let { hasError: r, thrownError: o, isStopped: i } = this
        r ? n.error(o) : i && n.complete()
      }
      asObservable() {
        let n = new Ht()
        return (n.source = this), n
      }
    }
    return (e.create = (t, n) => new tt(t, n)), e
  })(),
  tt = class extends de {
    constructor(t, n) {
      super(), (this.destination = t), (this.source = n)
    }
    next(t) {
      var n, r
      ;(r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.next) ===
        null ||
        r === void 0 ||
        r.call(n, t)
    }
    error(t) {
      var n, r
      ;(r =
        (n = this.destination) === null || n === void 0 ? void 0 : n.error) ===
        null ||
        r === void 0 ||
        r.call(n, t)
    }
    complete() {
      var t, n
      ;(n =
        (t = this.destination) === null || t === void 0
          ? void 0
          : t.complete) === null ||
        n === void 0 ||
        n.call(t)
    }
    _subscribe(t) {
      var n, r
      return (r =
        (n = this.source) === null || n === void 0
          ? void 0
          : n.subscribe(t)) !== null && r !== void 0
        ? r
        : Pt
    }
  }
var xe = class extends de {
  constructor(t) {
    super(), (this._value = t)
  }
  get value() {
    return this.getValue()
  }
  _subscribe(t) {
    let n = super._subscribe(t)
    return !n.closed && t.next(this._value), n
  }
  getValue() {
    let { hasError: t, thrownError: n, _value: r } = this
    if (t) throw n
    return this._throwIfClosed(), r
  }
  next(t) {
    super.next((this._value = t))
  }
}
function Ut(e, t) {
  return Rr((n, r) => {
    let o = 0
    n.subscribe(
      Fr(r, (i) => {
        r.next(e.call(t, i, o++))
      })
    )
  })
}
var y = class extends Error {
  constructor(t, n) {
    super(Nn(t, n)), (this.code = t)
  }
}
function Nn(e, t) {
  return `${`NG0${Math.abs(e)}`}${t ? ': ' + t : ''}`
}
function E(e) {
  for (let t in e) if (e[t] === E) return t
  throw Error('Could not find renamed property on target object.')
}
function O(e) {
  if (typeof e == 'string') return e
  if (Array.isArray(e)) return '[' + e.map(O).join(', ') + ']'
  if (e == null) return '' + e
  if (e.overriddenName) return `${e.overriddenName}`
  if (e.name) return `${e.name}`
  let t = e.toString()
  if (t == null) return '' + t
  let n = t.indexOf(`
`)
  return n === -1 ? t : t.substring(0, n)
}
function kr(e, t) {
  return e == null || e === ''
    ? t === null
      ? ''
      : t
    : t == null || t === ''
      ? e
      : e + ' ' + t
}
var $s = E({ __forward_ref__: E })
function go(e) {
  return (
    (e.__forward_ref__ = go),
    (e.toString = function () {
      return O(this())
    }),
    e
  )
}
function A(e) {
  return Us(e) ? e() : e
}
function Us(e) {
  return (
    typeof e == 'function' && e.hasOwnProperty($s) && e.__forward_ref__ === go
  )
}
function mo(e) {
  return e && !!e.ɵproviders
}
var zs = E({ ɵcmp: E }),
  Gs = E({ ɵdir: E }),
  Ws = E({ ɵpipe: E })
var Lr = E({ ɵfac: E }),
  Ae = E({ __NG_ELEMENT_ID__: E }),
  jr = E({ __NG_ENV_ID__: E })
function Do(e) {
  return typeof e == 'string' ? e : e == null ? '' : String(e)
}
function qs(e) {
  return typeof e == 'function'
    ? e.name || e.toString()
    : typeof e == 'object' && e != null && typeof e.type == 'function'
      ? e.type.name || e.type.toString()
      : Do(e)
}
function Zs(e, t) {
  let n = t ? `. Dependency path: ${t.join(' > ')} > ${e}` : ''
  throw new y(-200, `Circular dependency in DI detected for ${e}${n}`)
}
function An(e, t) {
  throw new y(-201, !1)
}
function Ys(e, t) {
  e == null && Qs(t, e, null, '!=')
}
function Qs(e, t, n, r) {
  throw new Error(
    `ASSERTION ERROR: ${e}` +
      (r == null ? '' : ` [Expected=> ${n} ${r} ${t} <=Actual]`)
  )
}
function w(e) {
  return {
    token: e.token,
    providedIn: e.providedIn || null,
    factory: e.factory,
    value: void 0,
  }
}
function On(e) {
  return Vr(e, yo) || Vr(e, vo)
}
function Vr(e, t) {
  return e.hasOwnProperty(t) ? e[t] : null
}
function Ks(e) {
  let t = e && (e[yo] || e[vo])
  return t || null
}
function Br(e) {
  return e && (e.hasOwnProperty(Hr) || e.hasOwnProperty(Js)) ? e[Hr] : null
}
var yo = E({ ɵprov: E }),
  Hr = E({ ɵinj: E }),
  vo = E({ ngInjectableDef: E }),
  Js = E({ ngInjectorDef: E }),
  p = (function (e) {
    return (
      (e[(e.Default = 0)] = 'Default'),
      (e[(e.Host = 1)] = 'Host'),
      (e[(e.Self = 2)] = 'Self'),
      (e[(e.SkipSelf = 4)] = 'SkipSelf'),
      (e[(e.Optional = 8)] = 'Optional'),
      e
    )
  })(p || {}),
  Xt
function Xs() {
  return Xt
}
function R(e) {
  let t = Xt
  return (Xt = e), t
}
function Eo(e, t, n) {
  let r = On(e)
  if (r && r.providedIn == 'root')
    return r.value === void 0 ? (r.value = r.factory()) : r.value
  if (n & p.Optional) return null
  if (t !== void 0) return t
  An(e, 'Injector')
}
var Oe = globalThis
var I = class {
  constructor(t, n) {
    ;(this._desc = t),
      (this.ngMetadataName = 'InjectionToken'),
      (this.ɵprov = void 0),
      typeof n == 'number'
        ? (this.__NG_ELEMENT_ID__ = n)
        : n !== void 0 &&
          (this.ɵprov = w({
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
var ea = {},
  Pe = ea,
  ta = '__NG_DI_FLAG__',
  st = 'ngTempTokenPath',
  na = 'ngTokenPath',
  ra = /\n/gm,
  oa = '\u0275',
  $r = '__source',
  Re
function fe(e) {
  let t = Re
  return (Re = e), t
}
function ia(e, t = p.Default) {
  if (Re === void 0) throw new y(-203, !1)
  return Re === null
    ? Eo(e, void 0, t)
    : Re.get(e, t & p.Optional ? null : void 0, t)
}
function v(e, t = p.Default) {
  return (Xs() || ia)(A(e), t)
}
function M(e, t = p.Default) {
  return v(e, gt(t))
}
function gt(e) {
  return typeof e > 'u' || typeof e == 'number'
    ? e
    : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4)
}
function en(e) {
  let t = []
  for (let n = 0; n < e.length; n++) {
    let r = A(e[n])
    if (Array.isArray(r)) {
      if (r.length === 0) throw new y(900, !1)
      let o,
        i = p.Default
      for (let s = 0; s < r.length; s++) {
        let a = r[s],
          u = sa(a)
        typeof u == 'number' ? (u === -1 ? (o = a.token) : (i |= u)) : (o = a)
      }
      t.push(v(o, i))
    } else t.push(v(r))
  }
  return t
}
function sa(e) {
  return e[ta]
}
function aa(e, t, n, r) {
  let o = e[st]
  throw (
    (t[$r] && o.unshift(t[$r]),
    (e.message = ua(
      `
` + e.message,
      o,
      n,
      r
    )),
    (e[na] = o),
    (e[st] = null),
    e)
  )
}
function ua(e, t, n, r = null) {
  e =
    e &&
    e.charAt(0) ===
      `
` &&
    e.charAt(1) == oa
      ? e.slice(2)
      : e
  let o = O(t)
  if (Array.isArray(t)) o = t.map(O).join(' -> ')
  else if (typeof t == 'object') {
    let i = []
    for (let s in t)
      if (t.hasOwnProperty(s)) {
        let a = t[s]
        i.push(s + ':' + (typeof a == 'string' ? JSON.stringify(a) : O(a)))
      }
    o = `{${i.join(', ')}}`
  }
  return `${n}${r ? '(' + r + ')' : ''}[${o}]: ${e.replace(
    ra,
    `
  `
  )}`
}
function ca(e) {
  return { toString: e }.toString()
}
var Io = (function (e) {
    return (e[(e.OnPush = 0)] = 'OnPush'), (e[(e.Default = 1)] = 'Default'), e
  })(Io || {}),
  P = (function (e) {
    return (
      (e[(e.Emulated = 0)] = 'Emulated'),
      (e[(e.None = 2)] = 'None'),
      (e[(e.ShadowDom = 3)] = 'ShadowDom'),
      e
    )
  })(P || {}),
  ke = {},
  ye = [],
  ve = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'),
      (e[(e.SignalBased = 1)] = 'SignalBased'),
      (e[(e.HasDecoratorInputTransform = 2)] = 'HasDecoratorInputTransform'),
      e
    )
  })(ve || {})
function wo(e, t, n) {
  let r = e.length
  for (;;) {
    let o = e.indexOf(t, n)
    if (o === -1) return o
    if (o === 0 || e.charCodeAt(o - 1) <= 32) {
      let i = t.length
      if (o + i === r || e.charCodeAt(o + i) <= 32) return o
    }
    n = o + 1
  }
}
function tn(e, t, n) {
  let r = 0
  for (; r < n.length; ) {
    let o = n[r]
    if (typeof o == 'number') {
      if (o !== 0) break
      r++
      let i = n[r++],
        s = n[r++],
        a = n[r++]
      e.setAttribute(t, s, a, i)
    } else {
      let i = o,
        s = n[++r]
      da(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++
    }
  }
  return r
}
function la(e) {
  return e === 3 || e === 4 || e === 6
}
function da(e) {
  return e.charCodeAt(0) === 64
}
function Rn(e, t) {
  if (!(t === null || t.length === 0))
    if (e === null || e.length === 0) e = t.slice()
    else {
      let n = -1
      for (let r = 0; r < t.length; r++) {
        let o = t[r]
        typeof o == 'number'
          ? (n = o)
          : n === 0 ||
            (n === -1 || n === 2
              ? Ur(e, n, o, null, t[++r])
              : Ur(e, n, o, null, null))
      }
    }
  return e
}
function Ur(e, t, n, r, o) {
  let i = 0,
    s = e.length
  if (t === -1) s = -1
  else
    for (; i < e.length; ) {
      let a = e[i++]
      if (typeof a == 'number') {
        if (a === t) {
          s = -1
          break
        } else if (a > t) {
          s = i - 1
          break
        }
      }
    }
  for (; i < e.length; ) {
    let a = e[i]
    if (typeof a == 'number') break
    if (a === n) {
      if (r === null) {
        o !== null && (e[i + 1] = o)
        return
      } else if (r === e[i + 1]) {
        e[i + 2] = o
        return
      }
    }
    i++, r !== null && i++, o !== null && i++
  }
  s !== -1 && (e.splice(s, 0, t), (i = s + 1)),
    e.splice(i++, 0, n),
    r !== null && e.splice(i++, 0, r),
    o !== null && e.splice(i++, 0, o)
}
var Co = 'ng-template'
function fa(e, t, n) {
  let r = 0,
    o = !0
  for (; r < e.length; ) {
    let i = e[r++]
    if (typeof i == 'string' && o) {
      let s = e[r++]
      if (n && i === 'class' && wo(s.toLowerCase(), t, 0) !== -1) return !0
    } else if (i === 1) {
      for (; r < e.length && typeof (i = e[r++]) == 'string'; )
        if (i.toLowerCase() === t) return !0
      return !1
    } else typeof i == 'number' && (o = !1)
  }
  return !1
}
function Mo(e) {
  return e.type === 4 && e.value !== Co
}
function pa(e, t, n) {
  let r = e.type === 4 && !n ? Co : e.value
  return t === r
}
function ha(e, t, n) {
  let r = 4,
    o = e.attrs || [],
    i = Da(o),
    s = !1
  for (let a = 0; a < t.length; a++) {
    let u = t[a]
    if (typeof u == 'number') {
      if (!s && !N(r) && !N(u)) return !1
      if (s && N(u)) continue
      ;(s = !1), (r = u | (r & 1))
      continue
    }
    if (!s)
      if (r & 4) {
        if (
          ((r = 2 | (r & 1)),
          (u !== '' && !pa(e, u, n)) || (u === '' && t.length === 1))
        ) {
          if (N(r)) return !1
          s = !0
        }
      } else {
        let c = r & 8 ? u : t[++a]
        if (r & 8 && e.attrs !== null) {
          if (!fa(e.attrs, c, n)) {
            if (N(r)) return !1
            s = !0
          }
          continue
        }
        let l = r & 8 ? 'class' : u,
          d = ga(l, o, Mo(e), n)
        if (d === -1) {
          if (N(r)) return !1
          s = !0
          continue
        }
        if (c !== '') {
          let h
          d > i ? (h = '') : (h = o[d + 1].toLowerCase())
          let g = r & 8 ? h : null
          if ((g && wo(g, c, 0) !== -1) || (r & 2 && c !== h)) {
            if (N(r)) return !1
            s = !0
          }
        }
      }
  }
  return N(r) || s
}
function N(e) {
  return (e & 1) === 0
}
function ga(e, t, n, r) {
  if (t === null) return -1
  let o = 0
  if (r || !n) {
    let i = !1
    for (; o < t.length; ) {
      let s = t[o]
      if (s === e) return o
      if (s === 3 || s === 6) i = !0
      else if (s === 1 || s === 2) {
        let a = t[++o]
        for (; typeof a == 'string'; ) a = t[++o]
        continue
      } else {
        if (s === 4) break
        if (s === 0) {
          o += 4
          continue
        }
      }
      o += i ? 1 : 2
    }
    return -1
  } else return ya(t, e)
}
function ma(e, t, n = !1) {
  for (let r = 0; r < t.length; r++) if (ha(e, t[r], n)) return !0
  return !1
}
function Da(e) {
  for (let t = 0; t < e.length; t++) {
    let n = e[t]
    if (la(n)) return t
  }
  return e.length
}
function ya(e, t) {
  let n = e.indexOf(4)
  if (n > -1)
    for (n++; n < e.length; ) {
      let r = e[n]
      if (typeof r == 'number') return -1
      if (r === t) return n
      n++
    }
  return -1
}
function zr(e, t) {
  return e ? ':not(' + t.trim() + ')' : t
}
function va(e) {
  let t = e[0],
    n = 1,
    r = 2,
    o = '',
    i = !1
  for (; n < e.length; ) {
    let s = e[n]
    if (typeof s == 'string')
      if (r & 2) {
        let a = e[++n]
        o += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']'
      } else r & 8 ? (o += '.' + s) : r & 4 && (o += ' ' + s)
    else
      o !== '' && !N(s) && ((t += zr(i, o)), (o = '')),
        (r = s),
        (i = i || !N(r))
    n++
  }
  return o !== '' && (t += zr(i, o)), t
}
function Ea(e) {
  return e.map(va).join(',')
}
function Ia(e) {
  let t = [],
    n = [],
    r = 1,
    o = 2
  for (; r < e.length; ) {
    let i = e[r]
    if (typeof i == 'string')
      o === 2 ? i !== '' && t.push(i, e[++r]) : o === 8 && n.push(i)
    else {
      if (!N(o)) break
      o = i
    }
    r++
  }
  return { attrs: t, classes: n }
}
function bo(e) {
  return ca(() => {
    let t = ba(e),
      n = K(U({}, t), {
        decls: e.decls,
        vars: e.vars,
        template: e.template,
        consts: e.consts || null,
        ngContentSelectors: e.ngContentSelectors,
        onPush: e.changeDetection === Io.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (t.standalone && e.dependencies) || null,
        getStandaloneInjector: null,
        signals: e.signals ?? !1,
        data: e.data || {},
        encapsulation: e.encapsulation || P.Emulated,
        styles: e.styles || ye,
        _: null,
        schemas: e.schemas || null,
        tView: null,
        id: '',
      })
    Ta(n)
    let r = e.dependencies
    return (
      (n.directiveDefs = Wr(r, !1)), (n.pipeDefs = Wr(r, !0)), (n.id = _a(n)), n
    )
  })
}
function wa(e) {
  return mt(e) || To(e)
}
function Ca(e) {
  return e !== null
}
function Gr(e, t) {
  if (e == null) return ke
  let n = {}
  for (let r in e)
    if (e.hasOwnProperty(r)) {
      let o = e[r],
        i,
        s,
        a = ve.None
      Array.isArray(o)
        ? ((a = o[0]), (i = o[1]), (s = o[2] ?? i))
        : ((i = o), (s = o)),
        t ? ((n[i] = a !== ve.None ? [r, a] : r), (t[i] = s)) : (n[i] = r)
    }
  return n
}
function mt(e) {
  return e[zs] || null
}
function To(e) {
  return e[Gs] || null
}
function _o(e) {
  return e[Ws] || null
}
function Ma(e) {
  let t = mt(e) || To(e) || _o(e)
  return t !== null ? t.standalone : !1
}
function ba(e) {
  let t = {}
  return {
    type: e.type,
    providersResolver: null,
    factory: null,
    hostBindings: e.hostBindings || null,
    hostVars: e.hostVars || 0,
    hostAttrs: e.hostAttrs || null,
    contentQueries: e.contentQueries || null,
    declaredInputs: t,
    inputTransforms: null,
    inputConfig: e.inputs || ke,
    exportAs: e.exportAs || null,
    standalone: e.standalone === !0,
    signals: e.signals === !0,
    selectors: e.selectors || ye,
    viewQuery: e.viewQuery || null,
    features: e.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Gr(e.inputs, t),
    outputs: Gr(e.outputs),
    debugInfo: null,
  }
}
function Ta(e) {
  e.features?.forEach((t) => t(e))
}
function Wr(e, t) {
  if (!e) return null
  let n = t ? _o : wa
  return () => (typeof e == 'function' ? e() : e).map((r) => n(r)).filter(Ca)
}
function _a(e) {
  let t = 0,
    n = [
      e.selectors,
      e.ngContentSelectors,
      e.hostVars,
      e.hostAttrs,
      e.consts,
      e.vars,
      e.decls,
      e.encapsulation,
      e.standalone,
      e.signals,
      e.exportAs,
      JSON.stringify(e.inputs),
      JSON.stringify(e.outputs),
      Object.getOwnPropertyNames(e.type.prototype),
      !!e.contentQueries,
      !!e.viewQuery,
    ].join('|')
  for (let o of n) t = (Math.imul(31, t) + o.charCodeAt(0)) << 0
  return (t += 2147483648), 'c' + t
}
var q = 0,
  m = 1,
  f = 2,
  k = 3,
  G = 4,
  Z = 5,
  nn = 6,
  qr = 7,
  W = 8,
  Ee = 9,
  V = 10,
  B = 11,
  Le = 12,
  Zr = 13,
  ze = 14,
  Ie = 15,
  So = 16,
  pe = 17,
  xo = 18,
  Dt = 19,
  No = 20,
  Fe = 21,
  zt = 22,
  te = 23,
  ne = 25,
  Ao = 1
var rn = 7,
  Sa = 8,
  Oo = 9,
  ee = 10,
  Ro = (function (e) {
    return (
      (e[(e.None = 0)] = 'None'),
      (e[(e.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      e
    )
  })(Ro || {})
function me(e) {
  return Array.isArray(e) && typeof e[Ao] == 'object'
}
function Me(e) {
  return Array.isArray(e) && e[Ao] === !0
}
function Fo(e) {
  return (e.flags & 4) !== 0
}
function Po(e) {
  return e.componentOffset > -1
}
function xa(e) {
  return (e.flags & 1) === 1
}
function Ge(e) {
  return !!e.template
}
function Na(e) {
  return (e[f] & 512) !== 0
}
function je(e, t) {
  let n = e.hasOwnProperty(Lr)
  return n ? e[Lr] : null
}
var on = class {
  constructor(t, n, r) {
    ;(this.previousValue = t), (this.currentValue = n), (this.firstChange = r)
  }
  isFirstChange() {
    return this.firstChange
  }
}
function ko(e, t, n, r) {
  t !== null ? t.applyValueToInputSignal(t, r) : (e[n] = r)
}
function Aa() {
  return Lo
}
function Lo(e) {
  return e.type.prototype.ngOnChanges && (e.setInput = Ra), Oa
}
Aa.ngInherit = !0
function Oa() {
  let e = Vo(this),
    t = e?.current
  if (t) {
    let n = e.previous
    if (n === ke) e.previous = t
    else for (let r in t) n[r] = t[r]
    ;(e.current = null), this.ngOnChanges(t)
  }
}
function Ra(e, t, n, r, o) {
  let i = this.declaredInputs[r],
    s = Vo(e) || Fa(e, { previous: ke, current: null }),
    a = s.current || (s.current = {}),
    u = s.previous,
    c = u[i]
  ;(a[i] = new on(c && c.currentValue, n, u === ke)), ko(e, t, o, n)
}
var jo = '__ngSimpleChanges__'
function Vo(e) {
  return e[jo] || null
}
function Fa(e, t) {
  return (e[jo] = t)
}
var Yr = null
var z = function (e, t, n) {
    Yr?.(e, t, n)
  },
  Pa = 'svg',
  ka = 'math',
  La = !1
function ja() {
  return La
}
function be(e) {
  for (; Array.isArray(e); ) e = e[q]
  return e
}
function Va(e, t) {
  return be(t[e])
}
function ie(e, t) {
  return be(t[e.index])
}
function Ba(e, t) {
  return e.data[t]
}
function yt(e, t) {
  let n = t[e]
  return me(n) ? n : n[q]
}
function Fn(e) {
  return (e[f] & 128) === 128
}
function Qr(e, t) {
  return t == null ? null : e[t]
}
function Bo(e) {
  e[pe] = 0
}
function Ha(e) {
  e[f] & 1024 || ((e[f] |= 1024), Fn(e) && Ve(e))
}
function Ho(e) {
  return e[f] & 9216 || e[te]?.dirty
}
function Kr(e) {
  Ho(e)
    ? Ve(e)
    : e[f] & 64 &&
      (ja() ? ((e[f] |= 1024), Ve(e)) : e[V].changeDetectionScheduler?.notify())
}
function Ve(e) {
  e[V].changeDetectionScheduler?.notify()
  let t = at(e)
  for (; t !== null && !(t[f] & 8192 || ((t[f] |= 8192), !Fn(t))); ) t = at(t)
}
function $a(e, t) {
  if ((e[f] & 256) === 256) throw new y(911, !1)
  e[Fe] === null && (e[Fe] = []), e[Fe].push(t)
}
function at(e) {
  let t = e[k]
  return Me(t) ? t[k] : t
}
var D = { lFrame: Zo(null), bindingsEnabled: !0, skipHydrationRootTNode: null }
function Ua() {
  return D.lFrame.elementDepthCount
}
function za() {
  D.lFrame.elementDepthCount++
}
function Ga() {
  D.lFrame.elementDepthCount--
}
function $o() {
  return D.bindingsEnabled
}
function Wa() {
  return D.skipHydrationRootTNode !== null
}
function qa(e) {
  return D.skipHydrationRootTNode === e
}
function Za() {
  D.skipHydrationRootTNode = null
}
function L() {
  return D.lFrame.lView
}
function vt() {
  return D.lFrame.tView
}
function Te() {
  let e = Uo()
  for (; e !== null && e.type === 64; ) e = e.parent
  return e
}
function Uo() {
  return D.lFrame.currentTNode
}
function Ya() {
  let e = D.lFrame,
    t = e.currentTNode
  return e.isParent ? t : t.parent
}
function Et(e, t) {
  let n = D.lFrame
  ;(n.currentTNode = e), (n.isParent = t)
}
function zo() {
  return D.lFrame.isParent
}
function Qa() {
  D.lFrame.isParent = !1
}
function Ka(e) {
  return (D.lFrame.bindingIndex = e)
}
function Ja() {
  return D.lFrame.bindingIndex++
}
function Xa() {
  return D.lFrame.inI18n
}
function eu(e, t) {
  let n = D.lFrame
  ;(n.bindingIndex = n.bindingRootIndex = e), sn(t)
}
function tu() {
  return D.lFrame.currentDirectiveIndex
}
function sn(e) {
  D.lFrame.currentDirectiveIndex = e
}
function Go(e) {
  D.lFrame.currentQueryIndex = e
}
function nu(e) {
  let t = e[m]
  return t.type === 2 ? t.declTNode : t.type === 1 ? e[Z] : null
}
function Wo(e, t, n) {
  if (n & p.SkipSelf) {
    let o = t,
      i = e
    for (; (o = o.parent), o === null && !(n & p.Host); )
      if (((o = nu(i)), o === null || ((i = i[ze]), o.type & 10))) break
    if (o === null) return !1
    ;(t = o), (e = i)
  }
  let r = (D.lFrame = qo())
  return (r.currentTNode = t), (r.lView = e), !0
}
function Pn(e) {
  let t = qo(),
    n = e[m]
  ;(D.lFrame = t),
    (t.currentTNode = n.firstChild),
    (t.lView = e),
    (t.tView = n),
    (t.contextLView = e),
    (t.bindingIndex = n.bindingStartIndex),
    (t.inI18n = !1)
}
function qo() {
  let e = D.lFrame,
    t = e === null ? null : e.child
  return t === null ? Zo(e) : t
}
function Zo(e) {
  let t = {
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
    parent: e,
    child: null,
    inI18n: !1,
  }
  return e !== null && (e.child = t), t
}
function Yo() {
  let e = D.lFrame
  return (D.lFrame = e.parent), (e.currentTNode = null), (e.lView = null), e
}
var Qo = Yo
function kn() {
  let e = Yo()
  ;(e.isParent = !0),
    (e.tView = null),
    (e.selectedIndex = -1),
    (e.contextLView = null),
    (e.elementDepthCount = 0),
    (e.currentDirectiveIndex = -1),
    (e.currentNamespace = null),
    (e.bindingRootIndex = -1),
    (e.bindingIndex = -1),
    (e.currentQueryIndex = 0)
}
function Ln() {
  return D.lFrame.selectedIndex
}
function re(e) {
  D.lFrame.selectedIndex = e
}
function ru() {
  return D.lFrame.currentNamespace
}
var Ko = !0
function Jo() {
  return Ko
}
function Xo(e) {
  Ko = e
}
function ou(e, t, n) {
  let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype
  if (r) {
    let s = Lo(t)
    ;(n.preOrderHooks ??= []).push(e, s),
      (n.preOrderCheckHooks ??= []).push(e, s)
  }
  o && (n.preOrderHooks ??= []).push(0 - e, o),
    i &&
      ((n.preOrderHooks ??= []).push(e, i),
      (n.preOrderCheckHooks ??= []).push(e, i))
}
function ei(e, t) {
  for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
    let i = e.data[n].type.prototype,
      {
        ngAfterContentInit: s,
        ngAfterContentChecked: a,
        ngAfterViewInit: u,
        ngAfterViewChecked: c,
        ngOnDestroy: l,
      } = i
    s && (e.contentHooks ??= []).push(-n, s),
      a &&
        ((e.contentHooks ??= []).push(n, a),
        (e.contentCheckHooks ??= []).push(n, a)),
      u && (e.viewHooks ??= []).push(-n, u),
      c &&
        ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)),
      l != null && (e.destroyHooks ??= []).push(n, l)
  }
}
function nt(e, t, n) {
  ti(e, t, 3, n)
}
function rt(e, t, n, r) {
  ;(e[f] & 3) === n && ti(e, t, n, r)
}
function Gt(e, t) {
  let n = e[f]
  ;(n & 3) === t && ((n &= 16383), (n += 1), (e[f] = n))
}
function ti(e, t, n, r) {
  let o = r !== void 0 ? e[pe] & 65535 : 0,
    i = r ?? -1,
    s = t.length - 1,
    a = 0
  for (let u = o; u < s; u++)
    if (typeof t[u + 1] == 'number') {
      if (((a = t[u]), r != null && a >= r)) break
    } else
      t[u] < 0 && (e[pe] += 65536),
        (a < i || i == -1) &&
          (iu(e, n, t, u), (e[pe] = (e[pe] & 4294901760) + u + 2)),
        u++
}
function Jr(e, t) {
  z(4, e, t)
  let n = S(null)
  try {
    t.call(e)
  } finally {
    S(n), z(5, e, t)
  }
}
function iu(e, t, n, r) {
  let o = n[r] < 0,
    i = n[r + 1],
    s = o ? -n[r] : n[r],
    a = e[s]
  o
    ? e[f] >> 14 < e[pe] >> 16 &&
      (e[f] & 3) === t &&
      ((e[f] += 16384), Jr(a, i))
    : Jr(a, i)
}
var De = -1,
  Be = class {
    constructor(t, n, r) {
      ;(this.factory = t),
        (this.resolving = !1),
        (this.canSeeViewProviders = n),
        (this.injectImpl = r)
    }
  }
function su(e) {
  return e instanceof Be
}
function au(e) {
  return (e.flags & 8) !== 0
}
function uu(e) {
  return (e.flags & 16) !== 0
}
function cu(e) {
  return e !== De
}
function an(e) {
  return e & 32767
}
function lu(e) {
  return e >> 16
}
function un(e, t) {
  let n = lu(e),
    r = t
  for (; n > 0; ) (r = r[ze]), n--
  return r
}
var cn = !0
function Xr(e) {
  let t = cn
  return (cn = e), t
}
var du = 256,
  ni = du - 1,
  ri = 5,
  fu = 0,
  F = {}
function pu(e, t, n) {
  let r
  typeof n == 'string'
    ? (r = n.charCodeAt(0) || 0)
    : n.hasOwnProperty(Ae) && (r = n[Ae]),
    r == null && (r = n[Ae] = fu++)
  let o = r & ni,
    i = 1 << o
  t.data[e + (o >> ri)] |= i
}
function oi(e, t) {
  let n = ii(e, t)
  if (n !== -1) return n
  let r = t[m]
  r.firstCreatePass &&
    ((e.injectorIndex = t.length),
    Wt(r.data, e),
    Wt(t, null),
    Wt(r.blueprint, null))
  let o = si(e, t),
    i = e.injectorIndex
  if (cu(o)) {
    let s = an(o),
      a = un(o, t),
      u = a[m].data
    for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | u[s + c]
  }
  return (t[i + 8] = o), i
}
function Wt(e, t) {
  e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
}
function ii(e, t) {
  return e.injectorIndex === -1 ||
    (e.parent && e.parent.injectorIndex === e.injectorIndex) ||
    t[e.injectorIndex + 8] === null
    ? -1
    : e.injectorIndex
}
function si(e, t) {
  if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex
  let n = 0,
    r = null,
    o = t
  for (; o !== null; ) {
    if (((r = di(o)), r === null)) return De
    if ((n++, (o = o[ze]), r.injectorIndex !== -1))
      return r.injectorIndex | (n << 16)
  }
  return De
}
function hu(e, t, n) {
  pu(e, t, n)
}
function ai(e, t, n) {
  if (n & p.Optional || e !== void 0) return e
  An(t, 'NodeInjector')
}
function ui(e, t, n, r) {
  if (
    (n & p.Optional && r === void 0 && (r = null), !(n & (p.Self | p.Host)))
  ) {
    let o = e[Ee],
      i = R(void 0)
    try {
      return o ? o.get(t, r, n & p.Optional) : Eo(t, r, n & p.Optional)
    } finally {
      R(i)
    }
  }
  return ai(r, t, n)
}
function ci(e, t, n, r = p.Default, o) {
  if (e !== null) {
    if (t[f] & 2048 && !(r & p.Self)) {
      let s = vu(e, t, n, r, F)
      if (s !== F) return s
    }
    let i = li(e, t, n, r, F)
    if (i !== F) return i
  }
  return ui(t, n, r, o)
}
function li(e, t, n, r, o) {
  let i = Du(n)
  if (typeof i == 'function') {
    if (!Wo(t, e, r)) return r & p.Host ? ai(o, n, r) : ui(t, n, r, o)
    try {
      let s
      if (((s = i(r)), s == null && !(r & p.Optional))) An(n)
      else return s
    } finally {
      Qo()
    }
  } else if (typeof i == 'number') {
    let s = null,
      a = ii(e, t),
      u = De,
      c = r & p.Host ? t[Ie][Z] : null
    for (
      (a === -1 || r & p.SkipSelf) &&
      ((u = a === -1 ? si(e, t) : t[a + 8]),
      u === De || !to(r, !1)
        ? (a = -1)
        : ((s = t[m]), (a = an(u)), (t = un(u, t))));
      a !== -1;

    ) {
      let l = t[m]
      if (eo(i, a, l.data)) {
        let d = gu(a, t, n, s, r, c)
        if (d !== F) return d
      }
      ;(u = t[a + 8]),
        u !== De && to(r, t[m].data[a + 8] === c) && eo(i, a, t)
          ? ((s = l), (a = an(u)), (t = un(u, t)))
          : (a = -1)
    }
  }
  return o
}
function gu(e, t, n, r, o, i) {
  let s = t[m],
    a = s.data[e + 8],
    u = r == null ? Po(a) && cn : r != s && (a.type & 3) !== 0,
    c = o & p.Host && i === a,
    l = mu(a, s, n, u, c)
  return l !== null ? He(t, s, l, a) : F
}
function mu(e, t, n, r, o) {
  let i = e.providerIndexes,
    s = t.data,
    a = i & 1048575,
    u = e.directiveStart,
    c = e.directiveEnd,
    l = i >> 20,
    d = r ? a : a + l,
    h = o ? a + l : c
  for (let g = d; g < h; g++) {
    let C = s[g]
    if ((g < u && n === C) || (g >= u && C.type === n)) return g
  }
  if (o) {
    let g = s[u]
    if (g && Ge(g) && g.type === n) return u
  }
  return null
}
function He(e, t, n, r) {
  let o = e[n],
    i = t.data
  if (su(o)) {
    let s = o
    s.resolving && Zs(qs(i[n]))
    let a = Xr(s.canSeeViewProviders)
    s.resolving = !0
    let u,
      c = s.injectImpl ? R(s.injectImpl) : null,
      l = Wo(e, r, p.Default)
    try {
      ;(o = e[n] = s.factory(void 0, i, e, r)),
        t.firstCreatePass && n >= r.directiveStart && ou(n, i[n], t)
    } finally {
      c !== null && R(c), Xr(a), (s.resolving = !1), Qo()
    }
  }
  return o
}
function Du(e) {
  if (typeof e == 'string') return e.charCodeAt(0) || 0
  let t = e.hasOwnProperty(Ae) ? e[Ae] : void 0
  return typeof t == 'number' ? (t >= 0 ? t & ni : yu) : t
}
function eo(e, t, n) {
  let r = 1 << e
  return !!(n[t + (e >> ri)] & r)
}
function to(e, t) {
  return !(e & p.Self) && !(e & p.Host && t)
}
var ut = class {
  constructor(t, n) {
    ;(this._tNode = t), (this._lView = n)
  }
  get(t, n, r) {
    return ci(this._tNode, this._lView, t, gt(r), n)
  }
}
function yu() {
  return new ut(Te(), L())
}
function vu(e, t, n, r, o) {
  let i = e,
    s = t
  for (; i !== null && s !== null && s[f] & 2048 && !(s[f] & 512); ) {
    let a = li(i, s, n, r | p.Self, F)
    if (a !== F) return a
    let u = i.parent
    if (!u) {
      let c = s[No]
      if (c) {
        let l = c.get(n, F, r)
        if (l !== F) return l
      }
      ;(u = di(s)), (s = s[ze])
    }
    i = u
  }
  return o
}
function di(e) {
  let t = e[m],
    n = t.type
  return n === 2 ? t.declTNode : n === 1 ? e[Z] : null
}
function jn(e, t) {
  e.forEach((n) => (Array.isArray(n) ? jn(n, t) : t(n)))
}
function fi(e, t) {
  return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
}
var $e = new I('ENVIRONMENT_INITIALIZER'),
  pi = new I('INJECTOR', -1),
  hi = new I('INJECTOR_DEF_TYPES'),
  ct = class {
    get(t, n = Pe) {
      if (n === Pe) {
        let r = new Error(`NullInjectorError: No provider for ${O(t)}!`)
        throw ((r.name = 'NullInjectorError'), r)
      }
      return n
    }
  }
function gi(e) {
  return { ɵproviders: e }
}
function Eu(...e) {
  return { ɵproviders: mi(!0, e), ɵfromNgModule: !0 }
}
function mi(e, ...t) {
  let n = [],
    r = new Set(),
    o,
    i = (s) => {
      n.push(s)
    }
  return (
    jn(t, (s) => {
      let a = s
      ln(a, i, [], r) && ((o ||= []), o.push(a))
    }),
    o !== void 0 && Di(o, i),
    n
  )
}
function Di(e, t) {
  for (let n = 0; n < e.length; n++) {
    let { ngModule: r, providers: o } = e[n]
    Vn(o, (i) => {
      t(i, r)
    })
  }
}
function ln(e, t, n, r) {
  if (((e = A(e)), !e)) return !1
  let o = null,
    i = Br(e),
    s = !i && mt(e)
  if (!i && !s) {
    let u = e.ngModule
    if (((i = Br(u)), i)) o = u
    else return !1
  } else {
    if (s && !s.standalone) return !1
    o = e
  }
  let a = r.has(o)
  if (s) {
    if (a) return !1
    if ((r.add(o), s.dependencies)) {
      let u =
        typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies
      for (let c of u) ln(c, t, n, r)
    }
  } else if (i) {
    if (i.imports != null && !a) {
      r.add(o)
      let c
      try {
        jn(i.imports, (l) => {
          ln(l, t, n, r) && ((c ||= []), c.push(l))
        })
      } finally {
      }
      c !== void 0 && Di(c, t)
    }
    if (!a) {
      let c = je(o) || (() => new o())
      t({ provide: o, useFactory: c, deps: ye }, o),
        t({ provide: hi, useValue: o, multi: !0 }, o),
        t({ provide: $e, useValue: () => v(o), multi: !0 }, o)
    }
    let u = i.providers
    if (u != null && !a) {
      let c = e
      Vn(u, (l) => {
        t(l, c)
      })
    }
  } else return !1
  return o !== e && e.providers !== void 0
}
function Vn(e, t) {
  for (let n of e)
    mo(n) && (n = n.ɵproviders), Array.isArray(n) ? Vn(n, t) : t(n)
}
var Iu = E({ provide: String, useValue: E })
function yi(e) {
  return e !== null && typeof e == 'object' && Iu in e
}
function wu(e) {
  return !!(e && e.useExisting)
}
function Cu(e) {
  return !!(e && e.useFactory)
}
function dn(e) {
  return typeof e == 'function'
}
var It = new I('Set Injector scope.'),
  ot = {},
  Mu = {},
  qt
function Bn() {
  return qt === void 0 && (qt = new ct()), qt
}
var oe = class {},
  lt = class extends oe {
    get destroyed() {
      return this._destroyed
    }
    constructor(t, n, r, o) {
      super(),
        (this.parent = n),
        (this.source = r),
        (this.scopes = o),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        pn(t, (s) => this.processProvider(s)),
        this.records.set(pi, he(void 0, this)),
        o.has('environment') && this.records.set(oe, he(void 0, this))
      let i = this.records.get(It)
      i != null && typeof i.value == 'string' && this.scopes.add(i.value),
        (this.injectorDefTypes = new Set(this.get(hi, ye, p.Self)))
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0)
      try {
        for (let n of this._ngOnDestroyHooks) n.ngOnDestroy()
        let t = this._onDestroyHooks
        this._onDestroyHooks = []
        for (let n of t) n()
      } finally {
        this.records.clear(),
          this._ngOnDestroyHooks.clear(),
          this.injectorDefTypes.clear()
      }
    }
    onDestroy(t) {
      return (
        this.assertNotDestroyed(),
        this._onDestroyHooks.push(t),
        () => this.removeOnDestroy(t)
      )
    }
    runInContext(t) {
      this.assertNotDestroyed()
      let n = fe(this),
        r = R(void 0),
        o
      try {
        return t()
      } finally {
        fe(n), R(r)
      }
    }
    get(t, n = Pe, r = p.Default) {
      if ((this.assertNotDestroyed(), t.hasOwnProperty(jr))) return t[jr](this)
      r = gt(r)
      let o,
        i = fe(this),
        s = R(void 0)
      try {
        if (!(r & p.SkipSelf)) {
          let u = this.records.get(t)
          if (u === void 0) {
            let c = Nu(t) && On(t)
            c && this.injectableDefInScope(c)
              ? (u = he(fn(t), ot))
              : (u = null),
              this.records.set(t, u)
          }
          if (u != null) return this.hydrate(t, u)
        }
        let a = r & p.Self ? Bn() : this.parent
        return (n = r & p.Optional && n === Pe ? null : n), a.get(t, n)
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[st] = a[st] || []).unshift(O(t)), i)) throw a
          return aa(a, t, 'R3InjectorError', this.source)
        } else throw a
      } finally {
        R(s), fe(i)
      }
    }
    resolveInjectorInitializers() {
      let t = fe(this),
        n = R(void 0),
        r
      try {
        let o = this.get($e, ye, p.Self)
        for (let i of o) i()
      } finally {
        fe(t), R(n)
      }
    }
    toString() {
      let t = [],
        n = this.records
      for (let r of n.keys()) t.push(O(r))
      return `R3Injector[${t.join(', ')}]`
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new y(205, !1)
    }
    processProvider(t) {
      t = A(t)
      let n = dn(t) ? t : A(t && t.provide),
        r = Tu(t)
      if (!dn(t) && t.multi === !0) {
        let o = this.records.get(n)
        o ||
          ((o = he(void 0, ot, !0)),
          (o.factory = () => en(o.multi)),
          this.records.set(n, o)),
          (n = t),
          o.multi.push(t)
      }
      this.records.set(n, r)
    }
    hydrate(t, n) {
      return (
        n.value === ot && ((n.value = Mu), (n.value = n.factory())),
        typeof n.value == 'object' &&
          n.value &&
          xu(n.value) &&
          this._ngOnDestroyHooks.add(n.value),
        n.value
      )
    }
    injectableDefInScope(t) {
      if (!t.providedIn) return !1
      let n = A(t.providedIn)
      return typeof n == 'string'
        ? n === 'any' || this.scopes.has(n)
        : this.injectorDefTypes.has(n)
    }
    removeOnDestroy(t) {
      let n = this._onDestroyHooks.indexOf(t)
      n !== -1 && this._onDestroyHooks.splice(n, 1)
    }
  }
function fn(e) {
  let t = On(e),
    n = t !== null ? t.factory : je(e)
  if (n !== null) return n
  if (e instanceof I) throw new y(204, !1)
  if (e instanceof Function) return bu(e)
  throw new y(204, !1)
}
function bu(e) {
  if (e.length > 0) throw new y(204, !1)
  let n = Ks(e)
  return n !== null ? () => n.factory(e) : () => new e()
}
function Tu(e) {
  if (yi(e)) return he(void 0, e.useValue)
  {
    let t = _u(e)
    return he(t, ot)
  }
}
function _u(e, t, n) {
  let r
  if (dn(e)) {
    let o = A(e)
    return je(o) || fn(o)
  } else if (yi(e)) r = () => A(e.useValue)
  else if (Cu(e)) r = () => e.useFactory(...en(e.deps || []))
  else if (wu(e)) r = () => v(A(e.useExisting))
  else {
    let o = A(e && (e.useClass || e.provide))
    if (Su(e)) r = () => new o(...en(e.deps))
    else return je(o) || fn(o)
  }
  return r
}
function he(e, t, n = !1) {
  return { factory: e, value: t, multi: n ? [] : void 0 }
}
function Su(e) {
  return !!e.deps
}
function xu(e) {
  return (
    e !== null && typeof e == 'object' && typeof e.ngOnDestroy == 'function'
  )
}
function Nu(e) {
  return typeof e == 'function' || (typeof e == 'object' && e instanceof I)
}
function pn(e, t) {
  for (let n of e)
    Array.isArray(n) ? pn(n, t) : n && mo(n) ? pn(n.ɵproviders, t) : t(n)
}
function no(e, t = null, n = null, r) {
  let o = Au(e, t, n, r)
  return o.resolveInjectorInitializers(), o
}
function Au(e, t = null, n = null, r, o = new Set()) {
  let i = [n || ye, Eu(e)]
  return (
    (r = r || (typeof e == 'object' ? void 0 : O(e))),
    new lt(i, t || Bn(), r || null, o)
  )
}
var wt = (() => {
  let t = class t {
    static create(r, o) {
      if (Array.isArray(r)) return no({ name: '' }, o, r, '')
      {
        let i = r.name ?? ''
        return no({ name: i }, r.parent, r.providers, i)
      }
    }
  }
  ;(t.THROW_IF_NOT_FOUND = Pe),
    (t.NULL = new ct()),
    (t.ɵprov = w({ token: t, providedIn: 'any', factory: () => v(pi) })),
    (t.__NG_ELEMENT_ID__ = -1)
  let e = t
  return e
})()
var hn
function vi(e) {
  hn = e
}
function Ou() {
  if (hn !== void 0) return hn
  if (typeof document < 'u') return document
  throw new y(210, !1)
}
var Hn = new I('AppId', { providedIn: 'root', factory: () => Ru }),
  Ru = 'ng',
  $n = new I('Platform Initializer'),
  _e = new I('Platform ID', {
    providedIn: 'platform',
    factory: () => 'unknown',
  })
var Un = new I('CSP nonce', {
  providedIn: 'root',
  factory: () =>
    Ou().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') ||
    null,
})
function Fu(e) {
  return (e.flags & 128) === 128
}
var se = (function (e) {
  return (
    (e[(e.Important = 1)] = 'Important'), (e[(e.DashCase = 2)] = 'DashCase'), e
  )
})(se || {})
var Ei = new Map(),
  Pu = 0
function ku() {
  return Pu++
}
function Lu(e) {
  Ei.set(e[Dt], e)
}
function ju(e) {
  Ei.delete(e[Dt])
}
var ro = '__ngContext__'
function we(e, t) {
  me(t) ? ((e[ro] = t[Dt]), Lu(t)) : (e[ro] = t)
}
var Vu
function Ii(e, t) {
  return Vu(e, t)
}
function ge(e, t, n, r, o) {
  if (r != null) {
    let i,
      s = !1
    Me(r) ? (i = r) : me(r) && ((s = !0), (r = r[q]))
    let a = be(r)
    e === 0 && n !== null
      ? o == null
        ? bi(t, n, a)
        : gn(t, n, a, o || null, !0)
      : e === 1 && n !== null
        ? gn(t, n, a, o || null, !0)
        : e === 2
          ? nc(t, a, s)
          : e === 3 && t.destroyNode(a),
      i != null && oc(t, e, i, n, o)
  }
}
function Bu(e, t) {
  return e.createText(t)
}
function Hu(e, t, n) {
  e.setValue(t, n)
}
function wi(e, t, n) {
  return e.createElement(t, n)
}
function $u(e, t) {
  Ci(e, t), (t[q] = null), (t[Z] = null)
}
function Ci(e, t) {
  t[V].changeDetectionScheduler?.notify(), Gn(e, t, t[B], 2, null, null)
}
function Uu(e) {
  let t = e[Le]
  if (!t) return Zt(e[m], e)
  for (; t; ) {
    let n = null
    if (me(t)) n = t[Le]
    else {
      let r = t[ee]
      r && (n = r)
    }
    if (!n) {
      for (; t && !t[G] && t !== e; ) me(t) && Zt(t[m], t), (t = t[k])
      t === null && (t = e), me(t) && Zt(t[m], t), (n = t && t[G])
    }
    t = n
  }
}
function Mi(e, t) {
  let n = e[Oo],
    r = n.indexOf(t)
  n.splice(r, 1)
}
function zu(e, t) {
  if (e.length <= ee) return
  let n = ee + t,
    r = e[n]
  if (r) {
    let o = r[So]
    o !== null && o !== e && Mi(o, r), t > 0 && (e[n - 1][G] = r[G])
    let i = fi(e, ee + t)
    $u(r[m], r)
    let s = i[xo]
    s !== null && s.detachView(i[m]),
      (r[k] = null),
      (r[G] = null),
      (r[f] &= -129)
  }
  return r
}
function Gu(e, t) {
  if (!(t[f] & 256)) {
    let n = t[B]
    n.destroyNode && Gn(e, t, n, 3, null, null), Uu(t)
  }
}
function Zt(e, t) {
  if (!(t[f] & 256)) {
    ;(t[f] &= -129),
      (t[f] |= 256),
      t[te] && Ir(t[te]),
      qu(e, t),
      Wu(e, t),
      t[m].type === 1 && t[B].destroy()
    let n = t[So]
    if (n !== null && Me(t[k])) {
      n !== t[k] && Mi(n, t)
      let r = t[xo]
      r !== null && r.detachView(e)
    }
    ju(t)
  }
}
function Wu(e, t) {
  let n = e.cleanup,
    r = t[qr]
  if (n !== null)
    for (let i = 0; i < n.length - 1; i += 2)
      if (typeof n[i] == 'string') {
        let s = n[i + 3]
        s >= 0 ? r[s]() : r[-s].unsubscribe(), (i += 2)
      } else {
        let s = r[n[i + 1]]
        n[i].call(s)
      }
  r !== null && (t[qr] = null)
  let o = t[Fe]
  if (o !== null) {
    t[Fe] = null
    for (let i = 0; i < o.length; i++) {
      let s = o[i]
      s()
    }
  }
}
function qu(e, t) {
  let n
  if (e != null && (n = e.destroyHooks) != null)
    for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]]
      if (!(o instanceof Be)) {
        let i = n[r + 1]
        if (Array.isArray(i))
          for (let s = 0; s < i.length; s += 2) {
            let a = o[i[s]],
              u = i[s + 1]
            z(4, a, u)
            try {
              u.call(a)
            } finally {
              z(5, a, u)
            }
          }
        else {
          z(4, o, i)
          try {
            i.call(o)
          } finally {
            z(5, o, i)
          }
        }
      }
    }
}
function Zu(e, t, n) {
  return Yu(e, t.parent, n)
}
function Yu(e, t, n) {
  let r = t
  for (; r !== null && r.type & 40; ) (t = r), (r = t.parent)
  if (r === null) return n[q]
  {
    let { componentOffset: o } = r
    if (o > -1) {
      let { encapsulation: i } = e.data[r.directiveStart + o]
      if (i === P.None || i === P.Emulated) return null
    }
    return ie(r, n)
  }
}
function gn(e, t, n, r, o) {
  e.insertBefore(t, n, r, o)
}
function bi(e, t, n) {
  e.appendChild(t, n)
}
function oo(e, t, n, r, o) {
  r !== null ? gn(e, t, n, r, o) : bi(e, t, n)
}
function Qu(e, t, n, r) {
  e.removeChild(t, n, r)
}
function Ku(e, t) {
  return e.parentNode(t)
}
function Ju(e, t, n) {
  return ec(e, t, n)
}
function Xu(e, t, n) {
  return e.type & 40 ? ie(e, n) : null
}
var ec = Xu,
  io
function Ti(e, t, n, r) {
  let o = Zu(e, r, t),
    i = t[B],
    s = r.parent || t[Z],
    a = Ju(s, r, t)
  if (o != null)
    if (Array.isArray(n))
      for (let u = 0; u < n.length; u++) oo(i, o, n[u], a, !1)
    else oo(i, o, n, a, !1)
  io !== void 0 && io(i, r, t, n, o)
}
function tc(e, t) {
  if (t !== null) {
    let r = e[Ie][Z],
      o = t.projection
    return r.projection[o]
  }
  return null
}
function nc(e, t, n) {
  let r = Ku(e, t)
  r && Qu(e, r, t, n)
}
function zn(e, t, n, r, o, i, s) {
  for (; n != null; ) {
    let a = r[n.index],
      u = n.type
    if (
      (s && t === 0 && (a && we(be(a), r), (n.flags |= 2)),
      (n.flags & 32) !== 32)
    )
      if (u & 8) zn(e, t, n.child, r, o, i, !1), ge(t, e, o, a, i)
      else if (u & 32) {
        let c = Ii(n, r),
          l
        for (; (l = c()); ) ge(t, e, o, l, i)
        ge(t, e, o, a, i)
      } else u & 16 ? rc(e, t, r, n, o, i) : ge(t, e, o, a, i)
    n = s ? n.projectionNext : n.next
  }
}
function Gn(e, t, n, r, o, i) {
  zn(n, r, e.firstChild, t, o, i, !1)
}
function rc(e, t, n, r, o, i) {
  let s = n[Ie],
    u = s[Z].projection[r.projection]
  if (Array.isArray(u))
    for (let c = 0; c < u.length; c++) {
      let l = u[c]
      ge(t, e, o, l, i)
    }
  else {
    let c = u,
      l = s[k]
    Fu(r) && (c.flags |= 128), zn(e, t, c, l, o, i, !0)
  }
}
function oc(e, t, n, r, o) {
  let i = n[rn],
    s = be(n)
  i !== s && ge(t, e, r, i, o)
  for (let a = ee; a < n.length; a++) {
    let u = n[a]
    Gn(u[m], u, e, t, r, i)
  }
}
function ic(e, t, n) {
  e.setAttribute(t, 'style', n)
}
function _i(e, t, n) {
  n === '' ? e.removeAttribute(t, 'class') : e.setAttribute(t, 'class', n)
}
function Si(e, t, n) {
  let { mergedAttrs: r, classes: o, styles: i } = n
  r !== null && tn(e, t, r),
    o !== null && _i(e, t, o),
    i !== null && ic(e, t, i)
}
var mn = class {}
var sc = 'h',
  ac = 'b'
var uc = () => null
function Wn(e, t, n = !1) {
  return uc(e, t, n)
}
var Dn = class {},
  dt = class {}
function cc(e) {
  let t = Error(`No component factory found for ${O(e)}.`)
  return (t[lc] = e), t
}
var lc = 'ngComponent'
var yn = class {
    resolveComponentFactory(t) {
      throw cc(t)
    }
  },
  qn = (() => {
    let t = class t {}
    t.NULL = new yn()
    let e = t
    return e
  })()
function dc() {
  return xi(Te(), L())
}
function xi(e, t) {
  return new Ni(ie(e, t))
}
var Ni = (() => {
  let t = class t {
    constructor(r) {
      this.nativeElement = r
    }
  }
  t.__NG_ELEMENT_ID__ = dc
  let e = t
  return e
})()
var Ue = class {}
var fc = (() => {
    let t = class t {}
    t.ɵprov = w({ token: t, providedIn: 'root', factory: () => null })
    let e = t
    return e
  })(),
  Yt = {}
function ft(e, t, n, r, o = !1) {
  for (; n !== null; ) {
    let i = t[n.index]
    i !== null && r.push(be(i)), Me(i) && pc(i, r)
    let s = n.type
    if (s & 8) ft(e, t, n.child, r)
    else if (s & 32) {
      let a = Ii(n, t),
        u
      for (; (u = a()); ) r.push(u)
    } else if (s & 16) {
      let a = tc(t, n)
      if (Array.isArray(a)) r.push(...a)
      else {
        let u = at(t[Ie])
        ft(u[m], u, a, r, !0)
      }
    }
    n = o ? n.projectionNext : n.next
  }
  return r
}
function pc(e, t) {
  for (let n = ee; n < e.length; n++) {
    let r = e[n],
      o = r[m].firstChild
    o !== null && ft(r[m], r, o, t)
  }
  e[rn] !== e[q] && t.push(e[rn])
}
var Ai = []
function hc(e) {
  return e[te] ?? gc(e)
}
function gc(e) {
  let t = Ai.pop() ?? Object.create(Dc)
  return (t.lView = e), t
}
function mc(e) {
  e.lView[te] !== e && ((e.lView = null), Ai.push(e))
}
var Dc = K(U({}, yr), {
  consumerIsAlwaysLive: !0,
  consumerMarkedDirty: (e) => {
    Ve(e.lView)
  },
  consumerOnSignalRead() {
    this.lView[te] = this
  },
})
function Oi(e) {
  return Fi(e[Le])
}
function Ri(e) {
  return Fi(e[G])
}
function Fi(e) {
  for (; e !== null && !Me(e); ) e = e[G]
  return e
}
var yc = 'ngOriginalError'
function Qt(e) {
  return e[yc]
}
var H = class {
    constructor() {
      this._console = console
    }
    handleError(t) {
      let n = this._findOriginalError(t)
      this._console.error('ERROR', t),
        n && this._console.error('ORIGINAL ERROR', n)
    }
    _findOriginalError(t) {
      let n = t && Qt(t)
      for (; n && Qt(n); ) n = Qt(n)
      return n || null
    }
  },
  Pi = new I('', {
    providedIn: 'root',
    factory: () => M(H).handleError.bind(void 0),
  })
var ki = !1,
  vc = new I('', { providedIn: 'root', factory: () => ki })
var Ct = {}
function Li(e = 1) {
  ji(vt(), L(), Ln() + e, !1)
}
function ji(e, t, n, r) {
  if (!r)
    if ((t[f] & 3) === 3) {
      let i = e.preOrderCheckHooks
      i !== null && nt(t, i, n)
    } else {
      let i = e.preOrderHooks
      i !== null && rt(t, i, 0, n)
    }
  re(n)
}
function Ec(e, t = p.Default) {
  let n = L()
  if (n === null) return v(e, t)
  let r = Te()
  return ci(r, n, A(e), t)
}
function Vi(e, t, n, r, o, i) {
  let s = S(null)
  try {
    let a = null
    o & ve.SignalBased && (a = t[r][Dr]),
      a !== null && a.transformFn !== void 0 && (i = a.transformFn(i)),
      o & ve.HasDecoratorInputTransform &&
        (i = e.inputTransforms[r].call(t, i)),
      e.setInput !== null ? e.setInput(t, a, i, n, r) : ko(t, a, r, i)
  } finally {
    S(s)
  }
}
function Ic(e, t) {
  let n = e.hostBindingOpCodes
  if (n !== null)
    try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r]
        if (o < 0) re(~o)
        else {
          let i = o,
            s = n[++r],
            a = n[++r]
          eu(s, i)
          let u = t[i]
          a(2, u)
        }
      }
    } finally {
      re(-1)
    }
}
function Zn(e, t, n, r, o, i, s, a, u, c, l) {
  let d = t.blueprint.slice()
  return (
    (d[q] = o),
    (d[f] = r | 4 | 128 | 8 | 64),
    (c !== null || (e && e[f] & 2048)) && (d[f] |= 2048),
    Bo(d),
    (d[k] = d[ze] = e),
    (d[W] = n),
    (d[V] = s || (e && e[V])),
    (d[B] = a || (e && e[B])),
    (d[Ee] = u || (e && e[Ee]) || null),
    (d[Z] = i),
    (d[Dt] = ku()),
    (d[nn] = l),
    (d[No] = c),
    (d[Ie] = t.type == 2 ? e[Ie] : d),
    d
  )
}
function Yn(e, t, n, r, o) {
  let i = e.data[t]
  if (i === null) (i = wc(e, t, n, r, o)), Xa() && (i.flags |= 32)
  else if (i.type & 64) {
    ;(i.type = n), (i.value = r), (i.attrs = o)
    let s = Ya()
    i.injectorIndex = s === null ? -1 : s.injectorIndex
  }
  return Et(i, !0), i
}
function wc(e, t, n, r, o) {
  let i = Uo(),
    s = zo(),
    a = s ? i : i && i.parent,
    u = (e.data[t] = xc(e, a, n, t, r, o))
  return (
    e.firstChild === null && (e.firstChild = u),
    i !== null &&
      (s
        ? i.child == null && u.parent !== null && (i.child = u)
        : i.next === null && ((i.next = u), (u.prev = i))),
    u
  )
}
function Bi(e, t, n, r) {
  if (n === 0) return -1
  let o = t.length
  for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null)
  return o
}
function Hi(e, t, n, r, o) {
  let i = Ln(),
    s = r & 2
  try {
    re(-1), s && t.length > ne && ji(e, t, ne, !1), z(s ? 2 : 0, o), n(r, o)
  } finally {
    re(i), z(s ? 3 : 1, o)
  }
}
function $i(e, t, n) {
  if (Fo(t)) {
    let r = S(null)
    try {
      let o = t.directiveStart,
        i = t.directiveEnd
      for (let s = o; s < i; s++) {
        let a = e.data[s]
        a.contentQueries && a.contentQueries(1, n[s], s)
      }
    } finally {
      S(r)
    }
  }
}
function Cc(e, t, n) {
  $o() && (Fc(e, t, n, ie(n, t)), (n.flags & 64) === 64 && Wi(e, t, n))
}
function Mc(e, t, n = ie) {
  let r = t.localNames
  if (r !== null) {
    let o = t.index + 1
    for (let i = 0; i < r.length; i += 2) {
      let s = r[i + 1],
        a = s === -1 ? n(t, e) : e[s]
      e[o++] = a
    }
  }
}
function Ui(e) {
  let t = e.tView
  return t === null || t.incompleteFirstPass
    ? (e.tView = zi(
        1,
        null,
        e.template,
        e.decls,
        e.vars,
        e.directiveDefs,
        e.pipeDefs,
        e.viewQuery,
        e.schemas,
        e.consts,
        e.id
      ))
    : t
}
function zi(e, t, n, r, o, i, s, a, u, c, l) {
  let d = ne + r,
    h = d + o,
    g = bc(d, h),
    C = typeof c == 'function' ? c() : c
  return (g[m] = {
    type: e,
    blueprint: g,
    template: n,
    queries: null,
    viewQuery: a,
    declTNode: t,
    data: g.slice().fill(null, d),
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
    directiveRegistry: typeof i == 'function' ? i() : i,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: u,
    consts: C,
    incompleteFirstPass: !1,
    ssrId: l,
  })
}
function bc(e, t) {
  let n = []
  for (let r = 0; r < t; r++) n.push(r < e ? null : Ct)
  return n
}
function Tc(e, t, n, r) {
  let i = r.get(vc, ki) || n === P.ShadowDom,
    s = e.selectRootElement(t, i)
  return _c(s), s
}
function _c(e) {
  Sc(e)
}
var Sc = () => null
function xc(e, t, n, r, o, i) {
  let s = t ? t.injectorIndex : -1,
    a = 0
  return (
    Wa() && (a |= 128),
    {
      type: n,
      index: r,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: o,
      attrs: i,
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
      parent: t,
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
function so(e, t, n, r, o) {
  for (let i in t) {
    if (!t.hasOwnProperty(i)) continue
    let s = t[i]
    if (s === void 0) continue
    r ??= {}
    let a,
      u = ve.None
    Array.isArray(s) ? ((a = s[0]), (u = s[1])) : (a = s)
    let c = i
    if (o !== null) {
      if (!o.hasOwnProperty(i)) continue
      c = o[i]
    }
    e === 0 ? ao(r, n, c, a, u) : ao(r, n, c, a)
  }
  return r
}
function ao(e, t, n, r, o) {
  let i
  e.hasOwnProperty(n) ? (i = e[n]).push(t, r) : (i = e[n] = [t, r]),
    o !== void 0 && i.push(o)
}
function Nc(e, t, n) {
  let r = t.directiveStart,
    o = t.directiveEnd,
    i = e.data,
    s = t.attrs,
    a = [],
    u = null,
    c = null
  for (let l = r; l < o; l++) {
    let d = i[l],
      h = n ? n.get(d) : null,
      g = h ? h.inputs : null,
      C = h ? h.outputs : null
    ;(u = so(0, d.inputs, l, u, g)), (c = so(1, d.outputs, l, c, C))
    let j = u !== null && s !== null && !Mo(t) ? Uc(u, l, s) : null
    a.push(j)
  }
  u !== null &&
    (u.hasOwnProperty('class') && (t.flags |= 8),
    u.hasOwnProperty('style') && (t.flags |= 16)),
    (t.initialInputs = a),
    (t.inputs = u),
    (t.outputs = c)
}
function Ac(e, t, n, r) {
  if ($o()) {
    let o = r === null ? null : { '': -1 },
      i = kc(e, n),
      s,
      a
    i === null ? (s = a = null) : ([s, a] = i),
      s !== null && Gi(e, t, n, s, o, a),
      o && Lc(n, r, o)
  }
  n.mergedAttrs = Rn(n.mergedAttrs, n.attrs)
}
function Gi(e, t, n, r, o, i) {
  for (let c = 0; c < r.length; c++) hu(oi(n, t), e, r[c].type)
  Vc(n, e.data.length, r.length)
  for (let c = 0; c < r.length; c++) {
    let l = r[c]
    l.providersResolver && l.providersResolver(l)
  }
  let s = !1,
    a = !1,
    u = Bi(e, t, r.length, null)
  for (let c = 0; c < r.length; c++) {
    let l = r[c]
    ;(n.mergedAttrs = Rn(n.mergedAttrs, l.hostAttrs)),
      Bc(e, n, t, u, l),
      jc(u, l, o),
      l.contentQueries !== null && (n.flags |= 4),
      (l.hostBindings !== null || l.hostAttrs !== null || l.hostVars !== 0) &&
        (n.flags |= 64)
    let d = l.type.prototype
    !s &&
      (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) &&
      ((e.preOrderHooks ??= []).push(n.index), (s = !0)),
      !a &&
        (d.ngOnChanges || d.ngDoCheck) &&
        ((e.preOrderCheckHooks ??= []).push(n.index), (a = !0)),
      u++
  }
  Nc(e, n, i)
}
function Oc(e, t, n, r, o) {
  let i = o.hostBindings
  if (i) {
    let s = e.hostBindingOpCodes
    s === null && (s = e.hostBindingOpCodes = [])
    let a = ~t.index
    Rc(s) != a && s.push(a), s.push(n, r, i)
  }
}
function Rc(e) {
  let t = e.length
  for (; t > 0; ) {
    let n = e[--t]
    if (typeof n == 'number' && n < 0) return n
  }
  return 0
}
function Fc(e, t, n, r) {
  let o = n.directiveStart,
    i = n.directiveEnd
  Po(n) && Hc(t, n, e.data[o + n.componentOffset]),
    e.firstCreatePass || oi(n, t),
    we(r, t)
  let s = n.initialInputs
  for (let a = o; a < i; a++) {
    let u = e.data[a],
      c = He(t, e, a, n)
    if ((we(c, t), s !== null && $c(t, a - o, c, u, n, s), Ge(u))) {
      let l = yt(n.index, t)
      l[W] = He(t, e, a, n)
    }
  }
}
function Wi(e, t, n) {
  let r = n.directiveStart,
    o = n.directiveEnd,
    i = n.index,
    s = tu()
  try {
    re(i)
    for (let a = r; a < o; a++) {
      let u = e.data[a],
        c = t[a]
      sn(a),
        (u.hostBindings !== null || u.hostVars !== 0 || u.hostAttrs !== null) &&
          Pc(u, c)
    }
  } finally {
    re(-1), sn(s)
  }
}
function Pc(e, t) {
  e.hostBindings !== null && e.hostBindings(1, t)
}
function kc(e, t) {
  let n = e.directiveRegistry,
    r = null,
    o = null
  if (n)
    for (let i = 0; i < n.length; i++) {
      let s = n[i]
      if (ma(t, s.selectors, !1))
        if ((r || (r = []), Ge(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = []
            ;(o = o || new Map()),
              s.findHostDirectiveDefs(s, a, o),
              r.unshift(...a, s)
            let u = a.length
            vn(e, t, u)
          } else r.unshift(s), vn(e, t, 0)
        else (o = o || new Map()), s.findHostDirectiveDefs?.(s, r, o), r.push(s)
    }
  return r === null ? null : [r, o]
}
function vn(e, t, n) {
  ;(t.componentOffset = n), (e.components ??= []).push(t.index)
}
function Lc(e, t, n) {
  if (t) {
    let r = (e.localNames = [])
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]]
      if (i == null) throw new y(-301, !1)
      r.push(t[o], i)
    }
  }
}
function jc(e, t, n) {
  if (n) {
    if (t.exportAs)
      for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e
    Ge(t) && (n[''] = e)
  }
}
function Vc(e, t, n) {
  ;(e.flags |= 1),
    (e.directiveStart = t),
    (e.directiveEnd = t + n),
    (e.providerIndexes = t)
}
function Bc(e, t, n, r, o) {
  e.data[r] = o
  let i = o.factory || (o.factory = je(o.type, !0)),
    s = new Be(i, Ge(o), Ec)
  ;(e.blueprint[r] = s), (n[r] = s), Oc(e, t, r, Bi(e, n, o.hostVars, Ct), o)
}
function Hc(e, t, n) {
  let r = ie(t, e),
    o = Ui(n),
    i = e[V].rendererFactory,
    s = 16
  n.signals ? (s = 4096) : n.onPush && (s = 64)
  let a = Zi(
    e,
    Zn(e, o, null, s, r, t, null, i.createRenderer(r, n), null, null, null)
  )
  e[t.index] = a
}
function $c(e, t, n, r, o, i) {
  let s = i[t]
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let u = s[a++],
        c = s[a++],
        l = s[a++],
        d = s[a++]
      Vi(r, n, u, c, l, d)
    }
}
function Uc(e, t, n) {
  let r = null,
    o = 0
  for (; o < n.length; ) {
    let i = n[o]
    if (i === 0) {
      o += 4
      continue
    } else if (i === 5) {
      o += 2
      continue
    }
    if (typeof i == 'number') break
    if (e.hasOwnProperty(i)) {
      r === null && (r = [])
      let s = e[i]
      for (let a = 0; a < s.length; a += 3)
        if (s[a] === t) {
          r.push(i, s[a + 1], s[a + 2], n[o + 1])
          break
        }
    }
    o += 2
  }
  return r
}
function qi(e, t) {
  let n = e.contentQueries
  if (n !== null) {
    let r = S(null)
    try {
      for (let o = 0; o < n.length; o += 2) {
        let i = n[o],
          s = n[o + 1]
        if (s !== -1) {
          let a = e.data[s]
          Go(i), a.contentQueries(2, t[s], s)
        }
      }
    } finally {
      S(r)
    }
  }
}
function Zi(e, t) {
  return e[Le] ? (e[Zr][G] = t) : (e[Le] = t), (e[Zr] = t), t
}
function En(e, t, n) {
  Go(0)
  let r = S(null)
  try {
    t(e, n)
  } finally {
    S(r)
  }
}
function zc(e, t) {
  let n = e[Ee],
    r = n ? n.get(H, null) : null
  r && r.handleError(t)
}
function Yi(e, t, n, r, o) {
  for (let i = 0; i < n.length; ) {
    let s = n[i++],
      a = n[i++],
      u = n[i++],
      c = t[s],
      l = e.data[s]
    Vi(l, c, r, a, u, o)
  }
}
function Gc(e, t, n) {
  let r = Va(t, e)
  Hu(e[B], r, n)
}
var Wc = 100
function qc(e, t = !0) {
  let n = e[V],
    r = n.rendererFactory,
    o = !1
  o || r.begin?.()
  try {
    Zc(e)
  } catch (i) {
    throw (t && zc(e, i), i)
  } finally {
    o || (r.end?.(), n.inlineEffectRunner?.flush())
  }
}
function Zc(e) {
  In(e, 0)
  let t = 0
  for (; Ho(e); ) {
    if (t === Wc) throw new y(103, !1)
    t++, In(e, 1)
  }
}
function Yc(e, t, n, r) {
  let o = t[f]
  if ((o & 256) === 256) return
  let i = !1
  !i && t[V].inlineEffectRunner?.flush(), Pn(t)
  let s = null,
    a = null
  !i && Qc(e) && ((a = hc(t)), (s = vr(a)))
  try {
    Bo(t), Ka(e.bindingStartIndex), n !== null && Hi(e, t, n, 2, r)
    let u = (o & 3) === 3
    if (!i)
      if (u) {
        let d = e.preOrderCheckHooks
        d !== null && nt(t, d, null)
      } else {
        let d = e.preOrderHooks
        d !== null && rt(t, d, 0, null), Gt(t, 0)
      }
    if ((Kc(t), Qi(t, 0), e.contentQueries !== null && qi(e, t), !i))
      if (u) {
        let d = e.contentCheckHooks
        d !== null && nt(t, d)
      } else {
        let d = e.contentHooks
        d !== null && rt(t, d, 1), Gt(t, 1)
      }
    Ic(e, t)
    let c = e.components
    c !== null && Ji(t, c, 0)
    let l = e.viewQuery
    if ((l !== null && En(2, l, r), !i))
      if (u) {
        let d = e.viewCheckHooks
        d !== null && nt(t, d)
      } else {
        let d = e.viewHooks
        d !== null && rt(t, d, 2), Gt(t, 2)
      }
    if ((e.firstUpdatePass === !0 && (e.firstUpdatePass = !1), t[zt])) {
      for (let d of t[zt]) d()
      t[zt] = null
    }
    i || (t[f] &= -73)
  } catch (u) {
    throw (Ve(t), u)
  } finally {
    a !== null && (Er(a, s), mc(a)), kn()
  }
}
function Qc(e) {
  return e.type !== 2
}
function Qi(e, t) {
  for (let n = Oi(e); n !== null; n = Ri(n))
    for (let r = ee; r < n.length; r++) {
      let o = n[r]
      Ki(o, t)
    }
}
function Kc(e) {
  for (let t = Oi(e); t !== null; t = Ri(t)) {
    if (!(t[f] & Ro.HasTransplantedViews)) continue
    let n = t[Oo]
    for (let r = 0; r < n.length; r++) {
      let o = n[r],
        i = o[k]
      Ha(o)
    }
  }
}
function Jc(e, t, n) {
  let r = yt(t, e)
  Ki(r, n)
}
function Ki(e, t) {
  Fn(e) && In(e, t)
}
function In(e, t) {
  let r = e[m],
    o = e[f],
    i = e[te],
    s = !!(t === 0 && o & 16)
  if (
    ((s ||= !!(o & 64 && t === 0)),
    (s ||= !!(o & 1024)),
    (s ||= !!(i?.dirty && Ot(i))),
    i && (i.dirty = !1),
    (e[f] &= -9217),
    s)
  )
    Yc(r, e, r.template, e[W])
  else if (o & 8192) {
    Qi(e, 1)
    let a = r.components
    a !== null && Ji(e, a, 1)
  }
}
function Ji(e, t, n) {
  for (let r = 0; r < t.length; r++) Jc(e, t[r], n)
}
function Xi(e) {
  for (e[V].changeDetectionScheduler?.notify(); e; ) {
    e[f] |= 64
    let t = at(e)
    if (Na(e) && !t) return e
    e = t
  }
  return null
}
var wn = class {
  get rootNodes() {
    let t = this._lView,
      n = t[m]
    return ft(n, t, n.firstChild, [])
  }
  constructor(t, n, r = !0) {
    ;(this._lView = t),
      (this._cdRefInjectingView = n),
      (this.notifyErrorHandler = r),
      (this._appRef = null),
      (this._attachedToViewContainer = !1)
  }
  get context() {
    return this._lView[W]
  }
  set context(t) {
    this._lView[W] = t
  }
  get destroyed() {
    return (this._lView[f] & 256) === 256
  }
  destroy() {
    if (this._appRef) this._appRef.detachView(this)
    else if (this._attachedToViewContainer) {
      let t = this._lView[k]
      if (Me(t)) {
        let n = t[Sa],
          r = n ? n.indexOf(this) : -1
        r > -1 && (zu(t, r), fi(n, r))
      }
      this._attachedToViewContainer = !1
    }
    Gu(this._lView[m], this._lView)
  }
  onDestroy(t) {
    $a(this._lView, t)
  }
  markForCheck() {
    Xi(this._cdRefInjectingView || this._lView)
  }
  detach() {
    this._lView[f] &= -129
  }
  reattach() {
    Kr(this._lView), (this._lView[f] |= 128)
  }
  detectChanges() {
    ;(this._lView[f] |= 1024), qc(this._lView, this.notifyErrorHandler)
  }
  checkNoChanges() {}
  attachToViewContainerRef() {
    if (this._appRef) throw new y(902, !1)
    this._attachedToViewContainer = !0
  }
  detachFromAppRef() {
    ;(this._appRef = null), Ci(this._lView[m], this._lView)
  }
  attachToAppRef(t) {
    if (this._attachedToViewContainer) throw new y(902, !1)
    ;(this._appRef = t), Kr(this._lView)
  }
}
var uo = new Set()
function es(e) {
  uo.has(e) ||
    (uo.add(e),
    performance?.mark?.('mark_feature_usage', { detail: { feature: e } }))
}
var Cn = class extends de {
  constructor(t = !1) {
    super(), (this.__isAsync = t)
  }
  emit(t) {
    super.next(t)
  }
  subscribe(t, n, r) {
    let o = t,
      i = n || (() => null),
      s = r
    if (t && typeof t == 'object') {
      let u = t
      ;(o = u.next?.bind(u)), (i = u.error?.bind(u)), (s = u.complete?.bind(u))
    }
    this.__isAsync && ((i = Kt(i)), o && (o = Kt(o)), s && (s = Kt(s)))
    let a = super.subscribe({ next: o, error: i, complete: s })
    return t instanceof _ && t.add(a), a
  }
}
function Kt(e) {
  return (t) => {
    setTimeout(e, void 0, t)
  }
}
var Ne = Cn
function co(...e) {}
function Xc() {
  let e = typeof Oe.requestAnimationFrame == 'function',
    t = Oe[e ? 'requestAnimationFrame' : 'setTimeout'],
    n = Oe[e ? 'cancelAnimationFrame' : 'clearTimeout']
  if (typeof Zone < 'u' && t && n) {
    let r = t[Zone.__symbol__('OriginalDelegate')]
    r && (t = r)
    let o = n[Zone.__symbol__('OriginalDelegate')]
    o && (n = o)
  }
  return { nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: n }
}
var b = class e {
    constructor({
      enableLongStackTrace: t = !1,
      shouldCoalesceEventChangeDetection: n = !1,
      shouldCoalesceRunChangeDetection: r = !1,
    }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new Ne(!1)),
        (this.onMicrotaskEmpty = new Ne(!1)),
        (this.onStable = new Ne(!1)),
        (this.onError = new Ne(!1)),
        typeof Zone > 'u')
      )
        throw new y(908, !1)
      Zone.assertZonePatched()
      let o = this
      ;(o._nesting = 0),
        (o._outer = o._inner = Zone.current),
        Zone.TaskTrackingZoneSpec &&
          (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec())),
        t &&
          Zone.longStackTraceZoneSpec &&
          (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)),
        (o.shouldCoalesceEventChangeDetection = !r && n),
        (o.shouldCoalesceRunChangeDetection = r),
        (o.lastRequestAnimationFrameId = -1),
        (o.nativeRequestAnimationFrame = Xc().nativeRequestAnimationFrame),
        nl(o)
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get('isAngularZone') === !0
    }
    static assertInAngularZone() {
      if (!e.isInAngularZone()) throw new y(909, !1)
    }
    static assertNotInAngularZone() {
      if (e.isInAngularZone()) throw new y(909, !1)
    }
    run(t, n, r) {
      return this._inner.run(t, n, r)
    }
    runTask(t, n, r, o) {
      let i = this._inner,
        s = i.scheduleEventTask('NgZoneEvent: ' + o, t, el, co, co)
      try {
        return i.runTask(s, n, r)
      } finally {
        i.cancelTask(s)
      }
    }
    runGuarded(t, n, r) {
      return this._inner.runGuarded(t, n, r)
    }
    runOutsideAngular(t) {
      return this._outer.run(t)
    }
  },
  el = {}
function Qn(e) {
  if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable)
    try {
      e._nesting++, e.onMicrotaskEmpty.emit(null)
    } finally {
      if ((e._nesting--, !e.hasPendingMicrotasks))
        try {
          e.runOutsideAngular(() => e.onStable.emit(null))
        } finally {
          e.isStable = !0
        }
    }
}
function tl(e) {
  e.isCheckStableRunning ||
    e.lastRequestAnimationFrameId !== -1 ||
    ((e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(
      Oe,
      () => {
        e.fakeTopEventTask ||
          (e.fakeTopEventTask = Zone.root.scheduleEventTask(
            'fakeTopEventTask',
            () => {
              ;(e.lastRequestAnimationFrameId = -1),
                Mn(e),
                (e.isCheckStableRunning = !0),
                Qn(e),
                (e.isCheckStableRunning = !1)
            },
            void 0,
            () => {},
            () => {}
          )),
          e.fakeTopEventTask.invoke()
      }
    )),
    Mn(e))
}
function nl(e) {
  let t = () => {
    tl(e)
  }
  e._inner = e._inner.fork({
    name: 'angular',
    properties: { isAngularZone: !0 },
    onInvokeTask: (n, r, o, i, s, a) => {
      if (rl(a)) return n.invokeTask(o, i, s, a)
      try {
        return lo(e), n.invokeTask(o, i, s, a)
      } finally {
        ;((e.shouldCoalesceEventChangeDetection && i.type === 'eventTask') ||
          e.shouldCoalesceRunChangeDetection) &&
          t(),
          fo(e)
      }
    },
    onInvoke: (n, r, o, i, s, a, u) => {
      try {
        return lo(e), n.invoke(o, i, s, a, u)
      } finally {
        e.shouldCoalesceRunChangeDetection && t(), fo(e)
      }
    },
    onHasTask: (n, r, o, i) => {
      n.hasTask(o, i),
        r === o &&
          (i.change == 'microTask'
            ? ((e._hasPendingMicrotasks = i.microTask), Mn(e), Qn(e))
            : i.change == 'macroTask' && (e.hasPendingMacrotasks = i.macroTask))
    },
    onHandleError: (n, r, o, i) => (
      n.handleError(o, i), e.runOutsideAngular(() => e.onError.emit(i)), !1
    ),
  })
}
function Mn(e) {
  e._hasPendingMicrotasks ||
  ((e.shouldCoalesceEventChangeDetection ||
    e.shouldCoalesceRunChangeDetection) &&
    e.lastRequestAnimationFrameId !== -1)
    ? (e.hasPendingMicrotasks = !0)
    : (e.hasPendingMicrotasks = !1)
}
function lo(e) {
  e._nesting++, e.isStable && ((e.isStable = !1), e.onUnstable.emit(null))
}
function fo(e) {
  e._nesting--, Qn(e)
}
function rl(e) {
  return !Array.isArray(e) || e.length !== 1
    ? !1
    : e[0].data?.__ignore_ng_zone__ === !0
}
var ts = (() => {
  let t = class t {
    constructor() {
      ;(this.handler = null), (this.internalCallbacks = [])
    }
    execute() {
      let r = [...this.internalCallbacks]
      this.internalCallbacks.length = 0
      for (let i of r) i()
      return !!this.handler?.execute() || r.length > 0
    }
    ngOnDestroy() {
      this.handler?.destroy(),
        (this.handler = null),
        (this.internalCallbacks.length = 0)
    }
  }
  t.ɵprov = w({ token: t, providedIn: 'root', factory: () => new t() })
  let e = t
  return e
})()
function ol(e, t) {
  let n = yt(t, e),
    r = n[m]
  il(r, n)
  let o = n[q]
  o !== null && n[nn] === null && (n[nn] = Wn(o, n[Ee])), ns(r, n, n[W])
}
function il(e, t) {
  for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n])
}
function ns(e, t, n) {
  Pn(t)
  try {
    let r = e.viewQuery
    r !== null && En(1, r, n)
    let o = e.template
    o !== null && Hi(e, t, o, 1, n),
      e.firstCreatePass && (e.firstCreatePass = !1),
      e.staticContentQueries && qi(e, t),
      e.staticViewQueries && En(2, e.viewQuery, n)
    let i = e.components
    i !== null && sl(t, i)
  } catch (r) {
    throw (
      (e.firstCreatePass &&
        ((e.incompleteFirstPass = !0), (e.firstCreatePass = !1)),
      r)
    )
  } finally {
    ;(t[f] &= -5), kn()
  }
}
function sl(e, t) {
  for (let n = 0; n < t.length; n++) ol(e, t[n])
}
function bn(e, t, n) {
  let r = n ? e.styles : null,
    o = n ? e.classes : null,
    i = 0
  if (t !== null)
    for (let s = 0; s < t.length; s++) {
      let a = t[s]
      if (typeof a == 'number') i = a
      else if (i == 1) o = kr(o, a)
      else if (i == 2) {
        let u = a,
          c = t[++s]
        r = kr(r, u + ': ' + c + ';')
      }
    }
  n ? (e.styles = r) : (e.stylesWithoutHost = r),
    n ? (e.classes = o) : (e.classesWithoutHost = o)
}
var Tn = class extends qn {
  constructor(t) {
    super(), (this.ngModule = t)
  }
  resolveComponentFactory(t) {
    let n = mt(t)
    return new Sn(n, this.ngModule)
  }
}
function po(e) {
  let t = []
  for (let n in e) {
    if (!e.hasOwnProperty(n)) continue
    let r = e[n]
    r !== void 0 &&
      t.push({ propName: Array.isArray(r) ? r[0] : r, templateName: n })
  }
  return t
}
function al(e) {
  let t = e.toLowerCase()
  return t === 'svg' ? Pa : t === 'math' ? ka : null
}
var _n = class {
    constructor(t, n) {
      ;(this.injector = t), (this.parentInjector = n)
    }
    get(t, n, r) {
      r = gt(r)
      let o = this.injector.get(t, Yt, r)
      return o !== Yt || n === Yt ? o : this.parentInjector.get(t, n, r)
    }
  },
  Sn = class extends dt {
    get inputs() {
      let t = this.componentDef,
        n = t.inputTransforms,
        r = po(t.inputs)
      if (n !== null)
        for (let o of r)
          n.hasOwnProperty(o.propName) && (o.transform = n[o.propName])
      return r
    }
    get outputs() {
      return po(this.componentDef.outputs)
    }
    constructor(t, n) {
      super(),
        (this.componentDef = t),
        (this.ngModule = n),
        (this.componentType = t.type),
        (this.selector = Ea(t.selectors)),
        (this.ngContentSelectors = t.ngContentSelectors
          ? t.ngContentSelectors
          : []),
        (this.isBoundToModule = !!n)
    }
    create(t, n, r, o) {
      o = o || this.ngModule
      let i = o instanceof oe ? o : o?.injector
      i &&
        this.componentDef.getStandaloneInjector !== null &&
        (i = this.componentDef.getStandaloneInjector(i) || i)
      let s = i ? new _n(t, i) : t,
        a = s.get(Ue, null)
      if (a === null) throw new y(407, !1)
      let u = s.get(fc, null),
        c = s.get(ts, null),
        l = s.get(mn, null),
        d = {
          rendererFactory: a,
          sanitizer: u,
          inlineEffectRunner: null,
          afterRenderEventManager: c,
          changeDetectionScheduler: l,
        },
        h = a.createRenderer(null, this.componentDef),
        g = this.componentDef.selectors[0][0] || 'div',
        C = r ? Tc(h, r, this.componentDef.encapsulation, s) : wi(h, g, al(g)),
        j = 512
      this.componentDef.signals
        ? (j |= 4096)
        : this.componentDef.onPush || (j |= 16)
      let St = null
      C !== null && (St = Wn(C, s, !0))
      let xt = zi(0, null, null, 1, 0, null, null, null, null, null, null),
        Q = Zn(null, xt, null, j, null, null, d, h, s, null, St)
      Pn(Q)
      let pr, Ye
      try {
        let $ = this.componentDef,
          ae,
          Nt = null
        $.findHostDirectiveDefs
          ? ((ae = []),
            (Nt = new Map()),
            $.findHostDirectiveDefs($, ae, Nt),
            ae.push($))
          : (ae = [$])
        let bs = ul(Q, C),
          Ts = cl(bs, C, $, ae, Q, d, h)
        ;(Ye = Ba(xt, ne)),
          C && fl(h, $, C, r),
          n !== void 0 && pl(Ye, this.ngContentSelectors, n),
          (pr = dl(Ts, $, ae, Nt, Q, [hl])),
          ns(xt, Q, null)
      } finally {
        kn()
      }
      return new xn(this.componentType, pr, xi(Ye, Q), Q, Ye)
    }
  },
  xn = class extends Dn {
    constructor(t, n, r, o, i) {
      super(),
        (this.location = r),
        (this._rootLView = o),
        (this._tNode = i),
        (this.previousInputValues = null),
        (this.instance = n),
        (this.hostView = this.changeDetectorRef = new wn(o, void 0, !1)),
        (this.componentType = t)
    }
    setInput(t, n) {
      let r = this._tNode.inputs,
        o
      if (r !== null && (o = r[t])) {
        if (
          ((this.previousInputValues ??= new Map()),
          this.previousInputValues.has(t) &&
            Object.is(this.previousInputValues.get(t), n))
        )
          return
        let i = this._rootLView
        Yi(i[m], i, o, t, n), this.previousInputValues.set(t, n)
        let s = yt(this._tNode.index, i)
        Xi(s)
      }
    }
    get injector() {
      return new ut(this._tNode, this._rootLView)
    }
    destroy() {
      this.hostView.destroy()
    }
    onDestroy(t) {
      this.hostView.onDestroy(t)
    }
  }
function ul(e, t) {
  let n = e[m],
    r = ne
  return (e[r] = t), Yn(n, r, 2, '#host', null)
}
function cl(e, t, n, r, o, i, s) {
  let a = o[m]
  ll(r, e, t, s)
  let u = null
  t !== null && (u = Wn(t, o[Ee]))
  let c = i.rendererFactory.createRenderer(t, n),
    l = 16
  n.signals ? (l = 4096) : n.onPush && (l = 64)
  let d = Zn(o, Ui(n), null, l, o[e.index], e, i, c, null, null, u)
  return a.firstCreatePass && vn(a, e, r.length - 1), Zi(o, d), (o[e.index] = d)
}
function ll(e, t, n, r) {
  for (let o of e) t.mergedAttrs = Rn(t.mergedAttrs, o.hostAttrs)
  t.mergedAttrs !== null &&
    (bn(t, t.mergedAttrs, !0), n !== null && Si(r, n, t))
}
function dl(e, t, n, r, o, i) {
  let s = Te(),
    a = o[m],
    u = ie(s, o)
  Gi(a, o, s, n, null, r)
  for (let l = 0; l < n.length; l++) {
    let d = s.directiveStart + l,
      h = He(o, a, d, s)
    we(h, o)
  }
  Wi(a, o, s), u && we(u, o)
  let c = He(o, a, s.directiveStart + s.componentOffset, s)
  if (((e[W] = o[W] = c), i !== null)) for (let l of i) l(c, t)
  return $i(a, s, e), c
}
function fl(e, t, n, r) {
  if (r) tn(e, n, ['ng-version', '17.1.0'])
  else {
    let { attrs: o, classes: i } = Ia(t.selectors[0])
    o && tn(e, n, o), i && i.length > 0 && _i(e, n, i.join(' '))
  }
}
function pl(e, t, n) {
  let r = (e.projection = [])
  for (let o = 0; o < t.length; o++) {
    let i = n[o]
    r.push(i != null ? Array.from(i) : null)
  }
}
function hl() {
  let e = Te()
  ei(L()[m], e)
}
var Rf = new RegExp(`^(\\d+)*(${ac}|${sc})*(.*)`)
function gl(e, t, n) {
  let r = e[t]
  return Object.is(r, n) ? !1 : ((e[t] = n), !0)
}
function ml(e, t, n, r) {
  return gl(e, Ja(), n) ? t + Do(n) + r : Ct
}
function ho(e, t, n, r, o) {
  let i = t.inputs,
    s = o ? 'class' : 'style'
  Yi(e, n, i[s], s, r)
}
function Dl(e, t, n, r, o, i) {
  let s = t.consts,
    a = Qr(s, o),
    u = Yn(t, e, 2, r, a)
  return (
    Ac(t, n, u, Qr(s, i)),
    u.attrs !== null && bn(u, u.attrs, !1),
    u.mergedAttrs !== null && bn(u, u.mergedAttrs, !0),
    t.queries !== null && t.queries.elementStart(t, u),
    u
  )
}
function Kn(e, t, n, r) {
  let o = L(),
    i = vt(),
    s = ne + e,
    a = o[B],
    u = i.firstCreatePass ? Dl(s, i, o, t, n, r) : i.data[s],
    c = yl(i, o, u, a, t, e)
  o[s] = c
  let l = xa(u)
  return (
    Et(u, !0),
    Si(a, c, u),
    (u.flags & 32) !== 32 && Jo() && Ti(i, o, c, u),
    Ua() === 0 && we(c, o),
    za(),
    l && (Cc(i, o, u), $i(i, u, o)),
    r !== null && Mc(o, u),
    Kn
  )
}
function Jn() {
  let e = Te()
  zo() ? Qa() : ((e = e.parent), Et(e, !1))
  let t = e
  qa(t) && Za(), Ga()
  let n = vt()
  return (
    n.firstCreatePass && (ei(n, e), Fo(e) && n.queries.elementEnd(e)),
    t.classesWithoutHost != null &&
      au(t) &&
      ho(n, t, L(), t.classesWithoutHost, !0),
    t.stylesWithoutHost != null &&
      uu(t) &&
      ho(n, t, L(), t.stylesWithoutHost, !1),
    Jn
  )
}
var yl = (e, t, n, r, o, i) => (Xo(!0), wi(r, o, ru()))
var pt = 'en-US'
var vl = pt
function El(e) {
  Ys(e, 'Expected localeId to be defined'),
    typeof e == 'string' && (vl = e.toLowerCase().replace(/_/g, '-'))
}
function Xn(e) {
  return !!e && typeof e.then == 'function'
}
function rs(e) {
  return !!e && typeof e.subscribe == 'function'
}
function os(e, t = '') {
  let n = L(),
    r = vt(),
    o = e + ne,
    i = r.firstCreatePass ? Yn(r, o, 1, t, null) : r.data[o],
    s = Il(r, n, i, t, e)
  ;(n[o] = s), Jo() && Ti(r, n, s, i), Et(i, !1)
}
var Il = (e, t, n, r, o) => (Xo(!0), Bu(t[B], r))
function er(e, t, n) {
  let r = L(),
    o = ml(r, e, t, n)
  return o !== Ct && Gc(r, Ln(), o), er
}
var Ce = class {}
var ht = class extends Ce {
  constructor(t) {
    super(),
      (this.componentFactoryResolver = new Tn(this)),
      (this.instance = null)
    let n = new lt(
      [
        ...t.providers,
        { provide: Ce, useValue: this },
        { provide: qn, useValue: this.componentFactoryResolver },
      ],
      t.parent || Bn(),
      t.debugName,
      new Set(['environment'])
    )
    ;(this.injector = n),
      t.runEnvironmentInitializers && n.resolveInjectorInitializers()
  }
  destroy() {
    this.injector.destroy()
  }
  onDestroy(t) {
    this.injector.onDestroy(t)
  }
}
function wl(e, t, n = null) {
  return new ht({
    providers: e,
    parent: t,
    debugName: n,
    runEnvironmentInitializers: !0,
  }).injector
}
var Cl = (() => {
  let t = class t {
    constructor(r) {
      ;(this._injector = r), (this.cachedInjectors = new Map())
    }
    getOrCreateStandaloneInjector(r) {
      if (!r.standalone) return null
      if (!this.cachedInjectors.has(r)) {
        let o = mi(!1, r.type),
          i =
            o.length > 0
              ? wl([o], this._injector, `Standalone[${r.type.name}]`)
              : null
        this.cachedInjectors.set(r, i)
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
  t.ɵprov = w({
    token: t,
    providedIn: 'environment',
    factory: () => new t(v(oe)),
  })
  let e = t
  return e
})()
function is(e) {
  es('NgStandalone'),
    (e.getStandaloneInjector = (t) =>
      t.get(Cl).getOrCreateStandaloneInjector(e))
}
var ss = (() => {
  let t = class t {
    constructor() {
      ;(this.taskId = 0),
        (this.pendingTasks = new Set()),
        (this.hasPendingTasks = new xe(!1))
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
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
var as = new I('')
var Ml = new I('Application Initializer'),
  us = (() => {
    let t = class t {
      constructor() {
        ;(this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((r, o) => {
            ;(this.resolve = r), (this.reject = o)
          })),
          (this.appInits = M(Ml, { optional: !0 }) ?? [])
      }
      runInitializers() {
        if (this.initialized) return
        let r = []
        for (let i of this.appInits) {
          let s = i()
          if (Xn(s)) r.push(s)
          else if (rs(s)) {
            let a = new Promise((u, c) => {
              s.subscribe({ complete: u, error: c })
            })
            r.push(a)
          }
        }
        let o = () => {
          ;(this.done = !0), this.resolve()
        }
        Promise.all(r)
          .then(() => {
            o()
          })
          .catch((i) => {
            this.reject(i)
          }),
          r.length === 0 && o(),
          (this.initialized = !0)
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: 'root' }))
    let e = t
    return e
  })(),
  bl = new I('appBootstrapListener')
function Tl() {
  wr(() => {
    throw new y(600, !1)
  })
}
function _l(e) {
  return e.isBoundToModule
}
function Sl(e, t, n) {
  try {
    let r = n()
    return Xn(r)
      ? r.catch((o) => {
          throw (t.runOutsideAngular(() => e.handleError(o)), o)
        })
      : r
  } catch (r) {
    throw (t.runOutsideAngular(() => e.handleError(r)), r)
  }
}
var tr = (() => {
  let t = class t {
    constructor() {
      ;(this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = M(Pi)),
        (this.afterRenderEffectManager = M(ts)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = M(ss).hasPendingTasks.pipe(Ut((r) => !r))),
        (this._injector = M(oe))
    }
    get destroyed() {
      return this._destroyed
    }
    get injector() {
      return this._injector
    }
    bootstrap(r, o) {
      let i = r instanceof dt
      if (!this._injector.get(us).done) {
        let g = !i && Ma(r),
          C = !1
        throw new y(405, C)
      }
      let a
      i ? (a = r) : (a = this._injector.get(qn).resolveComponentFactory(r)),
        this.componentTypes.push(a.componentType)
      let u = _l(a) ? void 0 : this._injector.get(Ce),
        c = o || a.selector,
        l = a.create(wt.NULL, [], c, u),
        d = l.location.nativeElement,
        h = l.injector.get(as, null)
      return (
        h?.registerApplication(d),
        l.onDestroy(() => {
          this.detachView(l.hostView),
            Jt(this.components, l),
            h?.unregisterApplication(d)
        }),
        this._loadComponent(l),
        l
      )
    }
    tick() {
      if (this._runningTick) throw new y(101, !1)
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
      let o = r
      this._views.push(o), o.attachToAppRef(this)
    }
    detachView(r) {
      let o = r
      Jt(this._views, o), o.detachFromAppRef()
    }
    _loadComponent(r) {
      this.attachView(r.hostView), this.tick(), this.components.push(r)
      let o = this._injector.get(bl, [])
      ;[...this._bootstrapListeners, ...o].forEach((i) => i(r))
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
      return this._destroyListeners.push(r), () => Jt(this._destroyListeners, r)
    }
    destroy() {
      if (this._destroyed) throw new y(406, !1)
      let r = this._injector
      r.destroy && !r.destroyed && r.destroy()
    }
    get viewCount() {
      return this._views.length
    }
    warnIfDestroyed() {}
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function Jt(e, t) {
  let n = e.indexOf(t)
  n > -1 && e.splice(n, 1)
}
var xl = (() => {
  let t = class t {
    constructor() {
      ;(this.zone = M(b)), (this.applicationRef = M(tr))
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
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function Nl(e) {
  return [
    { provide: b, useFactory: e },
    {
      provide: $e,
      multi: !0,
      useFactory: () => {
        let t = M(xl, { optional: !0 })
        return () => t.initialize()
      },
    },
    {
      provide: $e,
      multi: !0,
      useFactory: () => {
        let t = M(Fl)
        return () => {
          t.initialize()
        }
      },
    },
    { provide: Pi, useFactory: Al },
  ]
}
function Al() {
  let e = M(b),
    t = M(H)
  return (n) => e.runOutsideAngular(() => t.handleError(n))
}
function Ol(e) {
  let t = Nl(() => new b(Rl(e)))
  return gi([[], t])
}
function Rl(e) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1,
  }
}
var Fl = (() => {
  let t = class t {
    constructor() {
      ;(this.subscription = new _()),
        (this.initialized = !1),
        (this.zone = M(b)),
        (this.pendingTasks = M(ss))
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
              b.assertNotInAngularZone(),
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
            b.assertInAngularZone(), (r ??= this.pendingTasks.add())
          })
        )
    }
    ngOnDestroy() {
      this.subscription.unsubscribe()
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵprov = w({ token: t, factory: t.ɵfac, providedIn: 'root' }))
  let e = t
  return e
})()
function Pl() {
  return (typeof $localize < 'u' && $localize.locale) || pt
}
var nr = new I('LocaleId', {
  providedIn: 'root',
  factory: () => M(nr, p.Optional | p.SkipSelf) || Pl(),
})
var cs = new I('PlatformDestroyListeners')
var it = null
function kl(e = [], t) {
  return wt.create({
    name: t,
    providers: [
      { provide: It, useValue: 'platform' },
      { provide: cs, useValue: new Set([() => (it = null)]) },
      ...e,
    ],
  })
}
function Ll(e = []) {
  if (it) return it
  let t = kl(e)
  return (it = t), Tl(), jl(t), t
}
function jl(e) {
  e.get($n, null)?.forEach((n) => n())
}
function ls(e) {
  try {
    let { rootComponent: t, appProviders: n, platformProviders: r } = e,
      o = Ll(r),
      i = [Ol(), ...(n || [])],
      a = new ht({
        providers: i,
        parent: o,
        debugName: '',
        runEnvironmentInitializers: !1,
      }).injector,
      u = a.get(b)
    return u.run(() => {
      a.resolveInjectorInitializers()
      let c = a.get(H, null),
        l
      u.runOutsideAngular(() => {
        l = u.onError.subscribe({
          next: (g) => {
            c.handleError(g)
          },
        })
      })
      let d = () => a.destroy(),
        h = o.get(cs)
      return (
        h.add(d),
        a.onDestroy(() => {
          l.unsubscribe(), h.delete(d)
        }),
        Sl(c, u, () => {
          let g = a.get(us)
          return (
            g.runInitializers(),
            g.donePromise.then(() => {
              let C = a.get(nr, pt)
              El(C || pt)
              let j = a.get(tr)
              return t !== void 0 && j.bootstrap(t), j
            })
          )
        })
      )
    })
  } catch (t) {
    return Promise.reject(t)
  }
}
var rr = null
function or() {
  return rr
}
function fs(e) {
  rr || (rr = e)
}
var Mt = class {},
  Y = new I('DocumentToken')
function ps(e, t) {
  t = encodeURIComponent(t)
  for (let n of e.split(';')) {
    let r = n.indexOf('='),
      [o, i] = r == -1 ? [n, ''] : [n.slice(0, r), n.slice(r + 1)]
    if (o.trim() === t) return decodeURIComponent(i)
  }
  return null
}
var hs = 'browser',
  Hl = 'server'
function ir(e) {
  return e === Hl
}
var bt = class {}
var ur = class extends Mt {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0)
    }
  },
  cr = class e extends ur {
    static makeCurrent() {
      fs(new e())
    }
    onAndCancel(t, n, r) {
      return (
        t.addEventListener(n, r),
        () => {
          t.removeEventListener(n, r)
        }
      )
    }
    dispatchEvent(t, n) {
      t.dispatchEvent(n)
    }
    remove(t) {
      t.parentNode && t.parentNode.removeChild(t)
    }
    createElement(t, n) {
      return (n = n || this.getDefaultDocument()), n.createElement(t)
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle')
    }
    getDefaultDocument() {
      return document
    }
    isElementNode(t) {
      return t.nodeType === Node.ELEMENT_NODE
    }
    isShadowRoot(t) {
      return t instanceof DocumentFragment
    }
    getGlobalEventTarget(t, n) {
      return n === 'window'
        ? window
        : n === 'document'
          ? t
          : n === 'body'
            ? t.body
            : null
    }
    getBaseHref(t) {
      let n = Ul()
      return n == null ? null : zl(n)
    }
    resetBaseElement() {
      We = null
    }
    getUserAgent() {
      return window.navigator.userAgent
    }
    getCookie(t) {
      return ps(document.cookie, t)
    }
  },
  We = null
function Ul() {
  return (
    (We = We || document.querySelector('base')),
    We ? We.getAttribute('href') : null
  )
}
function zl(e) {
  return new URL(e, document.baseURI).pathname
}
var Gl = (() => {
    let t = class t {
      build() {
        return new XMLHttpRequest()
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)()
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  lr = new I('EventManagerPlugins'),
  ys = (() => {
    let t = class t {
      constructor(r, o) {
        ;(this._zone = o),
          (this._eventNameToPlugin = new Map()),
          r.forEach((i) => {
            i.manager = this
          }),
          (this._plugins = r.slice().reverse())
      }
      addEventListener(r, o, i) {
        return this._findPluginFor(o).addEventListener(r, o, i)
      }
      getZone() {
        return this._zone
      }
      _findPluginFor(r) {
        let o = this._eventNameToPlugin.get(r)
        if (o) return o
        if (((o = this._plugins.find((s) => s.supports(r))), !o))
          throw new y(5101, !1)
        return this._eventNameToPlugin.set(r, o), o
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(v(lr), v(b))
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  Tt = class {
    constructor(t) {
      this._doc = t
    }
  },
  sr = 'ng-app-id',
  vs = (() => {
    let t = class t {
      constructor(r, o, i, s = {}) {
        ;(this.doc = r),
          (this.appId = o),
          (this.nonce = i),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = ir(s)),
          this.resetHostNodes()
      }
      addStyles(r) {
        for (let o of r)
          this.changeUsageCount(o, 1) === 1 && this.onStyleAdded(o)
      }
      removeStyles(r) {
        for (let o of r)
          this.changeUsageCount(o, -1) <= 0 && this.onStyleRemoved(o)
      }
      ngOnDestroy() {
        let r = this.styleNodesInDOM
        r && (r.forEach((o) => o.remove()), r.clear())
        for (let o of this.getAllStyles()) this.onStyleRemoved(o)
        this.resetHostNodes()
      }
      addHost(r) {
        this.hostNodes.add(r)
        for (let o of this.getAllStyles()) this.addStyleToHost(r, o)
      }
      removeHost(r) {
        this.hostNodes.delete(r)
      }
      getAllStyles() {
        return this.styleRef.keys()
      }
      onStyleAdded(r) {
        for (let o of this.hostNodes) this.addStyleToHost(o, r)
      }
      onStyleRemoved(r) {
        let o = this.styleRef
        o.get(r)?.elements?.forEach((i) => i.remove()), o.delete(r)
      }
      collectServerRenderedStyles() {
        let r = this.doc.head?.querySelectorAll(`style[${sr}="${this.appId}"]`)
        if (r?.length) {
          let o = new Map()
          return (
            r.forEach((i) => {
              i.textContent != null && o.set(i.textContent, i)
            }),
            o
          )
        }
        return null
      }
      changeUsageCount(r, o) {
        let i = this.styleRef
        if (i.has(r)) {
          let s = i.get(r)
          return (s.usage += o), s.usage
        }
        return i.set(r, { usage: o, elements: [] }), o
      }
      getStyleElement(r, o) {
        let i = this.styleNodesInDOM,
          s = i?.get(o)
        if (s?.parentNode === r) return i.delete(o), s.removeAttribute(sr), s
        {
          let a = this.doc.createElement('style')
          return (
            this.nonce && a.setAttribute('nonce', this.nonce),
            (a.textContent = o),
            this.platformIsServer && a.setAttribute(sr, this.appId),
            r.appendChild(a),
            a
          )
        }
      }
      addStyleToHost(r, o) {
        let i = this.getStyleElement(r, o),
          s = this.styleRef,
          a = s.get(o)?.elements
        a ? a.push(i) : s.set(o, { elements: [i], usage: 1 })
      }
      resetHostNodes() {
        let r = this.hostNodes
        r.clear(), r.add(this.doc.head)
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(v(Y), v(Hn), v(Un, 8), v(_e))
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  ar = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/MathML/',
  },
  fr = /%COMP%/g,
  Es = '%COMP%',
  Wl = `_nghost-${Es}`,
  ql = `_ngcontent-${Es}`,
  Zl = !0,
  Yl = new I('RemoveStylesOnCompDestroy', {
    providedIn: 'root',
    factory: () => Zl,
  })
function Ql(e) {
  return ql.replace(fr, e)
}
function Kl(e) {
  return Wl.replace(fr, e)
}
function Is(e, t) {
  return t.map((n) => n.replace(fr, e))
}
var gs = (() => {
    let t = class t {
      constructor(r, o, i, s, a, u, c, l = null) {
        ;(this.eventManager = r),
          (this.sharedStylesHost = o),
          (this.appId = i),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = u),
          (this.ngZone = c),
          (this.nonce = l),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = ir(u)),
          (this.defaultRenderer = new qe(r, a, c, this.platformIsServer))
      }
      createRenderer(r, o) {
        if (!r || !o) return this.defaultRenderer
        this.platformIsServer &&
          o.encapsulation === P.ShadowDom &&
          (o = K(U({}, o), { encapsulation: P.Emulated }))
        let i = this.getOrCreateRenderer(r, o)
        return (
          i instanceof _t
            ? i.applyToHost(r)
            : i instanceof Ze && i.applyStyles(),
          i
        )
      }
      getOrCreateRenderer(r, o) {
        let i = this.rendererByCompId,
          s = i.get(o.id)
        if (!s) {
          let a = this.doc,
            u = this.ngZone,
            c = this.eventManager,
            l = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            h = this.platformIsServer
          switch (o.encapsulation) {
            case P.Emulated:
              s = new _t(c, l, o, this.appId, d, a, u, h)
              break
            case P.ShadowDom:
              return new dr(c, l, r, o, a, u, this.nonce, h)
            default:
              s = new Ze(c, l, o, d, a, u, h)
              break
          }
          i.set(o.id, s)
        }
        return s
      }
      ngOnDestroy() {
        this.rendererByCompId.clear()
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(v(ys), v(vs), v(Hn), v(Yl), v(Y), v(_e), v(b), v(Un))
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  qe = class {
    constructor(t, n, r, o) {
      ;(this.eventManager = t),
        (this.doc = n),
        (this.ngZone = r),
        (this.platformIsServer = o),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null)
    }
    destroy() {}
    createElement(t, n) {
      return n
        ? this.doc.createElementNS(ar[n] || n, t)
        : this.doc.createElement(t)
    }
    createComment(t) {
      return this.doc.createComment(t)
    }
    createText(t) {
      return this.doc.createTextNode(t)
    }
    appendChild(t, n) {
      ;(ms(t) ? t.content : t).appendChild(n)
    }
    insertBefore(t, n, r) {
      t && (ms(t) ? t.content : t).insertBefore(n, r)
    }
    removeChild(t, n) {
      t && t.removeChild(n)
    }
    selectRootElement(t, n) {
      let r = typeof t == 'string' ? this.doc.querySelector(t) : t
      if (!r) throw new y(-5104, !1)
      return n || (r.textContent = ''), r
    }
    parentNode(t) {
      return t.parentNode
    }
    nextSibling(t) {
      return t.nextSibling
    }
    setAttribute(t, n, r, o) {
      if (o) {
        n = o + ':' + n
        let i = ar[o]
        i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r)
      } else t.setAttribute(n, r)
    }
    removeAttribute(t, n, r) {
      if (r) {
        let o = ar[r]
        o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`)
      } else t.removeAttribute(n)
    }
    addClass(t, n) {
      t.classList.add(n)
    }
    removeClass(t, n) {
      t.classList.remove(n)
    }
    setStyle(t, n, r, o) {
      o & (se.DashCase | se.Important)
        ? t.style.setProperty(n, r, o & se.Important ? 'important' : '')
        : (t.style[n] = r)
    }
    removeStyle(t, n, r) {
      r & se.DashCase ? t.style.removeProperty(n) : (t.style[n] = '')
    }
    setProperty(t, n, r) {
      t != null && (t[n] = r)
    }
    setValue(t, n) {
      t.nodeValue = n
    }
    listen(t, n, r) {
      if (
        typeof t == 'string' &&
        ((t = or().getGlobalEventTarget(this.doc, t)), !t)
      )
        throw new Error(`Unsupported event target ${t} for event ${n}`)
      return this.eventManager.addEventListener(
        t,
        n,
        this.decoratePreventDefault(r)
      )
    }
    decoratePreventDefault(t) {
      return (n) => {
        if (n === '__ngUnwrap__') return t
        ;(this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) ===
          !1 && n.preventDefault()
      }
    }
  }
function ms(e) {
  return e.tagName === 'TEMPLATE' && e.content !== void 0
}
var dr = class extends qe {
    constructor(t, n, r, o, i, s, a, u) {
      super(t, i, s, u),
        (this.sharedStylesHost = n),
        (this.hostEl = r),
        (this.shadowRoot = r.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot)
      let c = Is(o.id, o.styles)
      for (let l of c) {
        let d = document.createElement('style')
        a && d.setAttribute('nonce', a),
          (d.textContent = l),
          this.shadowRoot.appendChild(d)
      }
    }
    nodeOrShadowRoot(t) {
      return t === this.hostEl ? this.shadowRoot : t
    }
    appendChild(t, n) {
      return super.appendChild(this.nodeOrShadowRoot(t), n)
    }
    insertBefore(t, n, r) {
      return super.insertBefore(this.nodeOrShadowRoot(t), n, r)
    }
    removeChild(t, n) {
      return super.removeChild(this.nodeOrShadowRoot(t), n)
    }
    parentNode(t) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)))
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot)
    }
  },
  Ze = class extends qe {
    constructor(t, n, r, o, i, s, a, u) {
      super(t, i, s, a),
        (this.sharedStylesHost = n),
        (this.removeStylesOnCompDestroy = o),
        (this.styles = u ? Is(u, r.styles) : r.styles)
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles)
    }
    destroy() {
      this.removeStylesOnCompDestroy &&
        this.sharedStylesHost.removeStyles(this.styles)
    }
  },
  _t = class extends Ze {
    constructor(t, n, r, o, i, s, a, u) {
      let c = o + '-' + r.id
      super(t, n, r, i, s, a, u, c),
        (this.contentAttr = Ql(c)),
        (this.hostAttr = Kl(c))
    }
    applyToHost(t) {
      this.applyStyles(), this.setAttribute(t, this.hostAttr, '')
    }
    createElement(t, n) {
      let r = super.createElement(t, n)
      return super.setAttribute(r, this.contentAttr, ''), r
    }
  },
  Jl = (() => {
    let t = class t extends Tt {
      constructor(r) {
        super(r)
      }
      supports(r) {
        return !0
      }
      addEventListener(r, o, i) {
        return (
          r.addEventListener(o, i, !1), () => this.removeEventListener(r, o, i)
        )
      }
      removeEventListener(r, o, i) {
        return r.removeEventListener(o, i)
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(v(Y))
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })(),
  Ds = ['alt', 'control', 'meta', 'shift'],
  Xl = {
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
  ed = {
    alt: (e) => e.altKey,
    control: (e) => e.ctrlKey,
    meta: (e) => e.metaKey,
    shift: (e) => e.shiftKey,
  },
  td = (() => {
    let t = class t extends Tt {
      constructor(r) {
        super(r)
      }
      supports(r) {
        return t.parseEventName(r) != null
      }
      addEventListener(r, o, i) {
        let s = t.parseEventName(o),
          a = t.eventCallback(s.fullKey, i, this.manager.getZone())
        return this.manager
          .getZone()
          .runOutsideAngular(() => or().onAndCancel(r, s.domEventName, a))
      }
      static parseEventName(r) {
        let o = r.toLowerCase().split('.'),
          i = o.shift()
        if (o.length === 0 || !(i === 'keydown' || i === 'keyup')) return null
        let s = t._normalizeKey(o.pop()),
          a = '',
          u = o.indexOf('code')
        if (
          (u > -1 && (o.splice(u, 1), (a = 'code.')),
          Ds.forEach((l) => {
            let d = o.indexOf(l)
            d > -1 && (o.splice(d, 1), (a += l + '.'))
          }),
          (a += s),
          o.length != 0 || s.length === 0)
        )
          return null
        let c = {}
        return (c.domEventName = i), (c.fullKey = a), c
      }
      static matchEventFullKeyCode(r, o) {
        let i = Xl[r.key] || r.key,
          s = ''
        return (
          o.indexOf('code.') > -1 && ((i = r.code), (s = 'code.')),
          i == null || !i
            ? !1
            : ((i = i.toLowerCase()),
              i === ' ' ? (i = 'space') : i === '.' && (i = 'dot'),
              Ds.forEach((a) => {
                if (a !== i) {
                  let u = ed[a]
                  u(r) && (s += a + '.')
                }
              }),
              (s += i),
              s === o)
        )
      }
      static eventCallback(r, o, i) {
        return (s) => {
          t.matchEventFullKeyCode(s, r) && i.runGuarded(() => o(s))
        }
      }
      static _normalizeKey(r) {
        return r === 'esc' ? 'escape' : r
      }
    }
    ;(t.ɵfac = function (o) {
      return new (o || t)(v(Y))
    }),
      (t.ɵprov = w({ token: t, factory: t.ɵfac }))
    let e = t
    return e
  })()
function ws(e, t) {
  return ls(U({ rootComponent: e }, nd(t)))
}
function nd(e) {
  return {
    appProviders: [...ad, ...(e?.providers ?? [])],
    platformProviders: sd,
  }
}
function rd() {
  cr.makeCurrent()
}
function od() {
  return new H()
}
function id() {
  return vi(document), document
}
var sd = [
  { provide: _e, useValue: hs },
  { provide: $n, useValue: rd, multi: !0 },
  { provide: Y, useFactory: id, deps: [] },
]
var ad = [
  { provide: It, useValue: 'root' },
  { provide: H, useFactory: od, deps: [] },
  { provide: lr, useClass: Jl, multi: !0, deps: [Y, b, _e] },
  { provide: lr, useClass: td, multi: !0, deps: [Y] },
  gs,
  vs,
  ys,
  { provide: Ue, useExisting: gs },
  { provide: bt, useClass: Gl, deps: [] },
  [],
]
var Cs = { providers: [] }
var Ms = (() => {
  let t = class t {
    constructor() {
      this.title = 'certificates'
    }
  }
  ;(t.ɵfac = function (o) {
    return new (o || t)()
  }),
    (t.ɵcmp = bo({
      type: t,
      selectors: [['app-root']],
      standalone: !0,
      features: [is],
      decls: 2,
      vars: 1,
      template: function (o, i) {
        o & 1 && (Kn(0, 'h1'), os(1), Jn()),
          o & 2 && (Li(), er('Welcome to ', i.title, '!'))
      },
      encapsulation: 2,
    }))
  let e = t
  return e
})()
ws(Ms, Cs).catch((e) => console.error(e))
