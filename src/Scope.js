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
  add: (a, b) => a + b,
  sub: (a, b) => a - b,
  mul: (a, b) => a * b,
  div: (a, b) => a / b,
  mod: (a, b) => a % b,
  list: (...args) => args,
  length: (item) => item.length,
  print: console.log,
  exit: process.exit
}
