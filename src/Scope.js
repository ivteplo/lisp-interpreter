// Copyright (c) 2021 Ivan Zadvornov

export default class Scope {
  constructor(parentScope = undefined) {
    this.identifiers = {}
    this.parentScope = parentScope
  }

  get(id) {
    if (id in this.identifiers) {
      return this.identifiers[id]
    }

    if (this.parentScope) {
      return this.parentScope.get(id)
    }

    throw new Error(`Identifier ${id} is not found`)
  }
}

Scope.global = new Scope()
Scope.global.identifiers = {
  add: (...args) => args.reduce((prev, next) => prev + next),
  sub: (...args) => args.reduce((prev, next) => prev - next),
  mul: (...args) => args.reduce((prev, next) => prev * next),
  div: (...args) => args.reduce((prev, next) => prev / next),
  mod: (...args) => args.reduce((prev, next) => prev % next),
  list: (...args) => args,
  length: (item) => item.length,
  print: console.log,
  exit: process.exit,

  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  tg: Math.tan,
  random: Math.random,
  sqrt: Math.sqrt,
  pow: Math.pow,
  power: Math.pow,
  round: Math.round,
  ceil: Math.ceil,
  floor: Math.floor,
  pi: Math.PI,
  abs: Math.abs,
  max: Math.max,
  min: Math.min
}
