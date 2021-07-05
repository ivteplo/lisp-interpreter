// Copyright (c) 2021 Ivan Zadvornov

import Scope from "./Scope.js"

export default class Interpreter {
  eval(node, scope = Scope.global) {
    if (node.type === "Module") {
      const moduleScope = new Scope(scope)
      return node.body.map((node) => this.eval(node, moduleScope))
    }

    if (node.type === "CallExpression") {
      return this.evalCallExpression(node, scope)
    }

    if (node.type === "Identifier") {
      return scope.get(node.value)
    }

    return node.value
  }

  evalCallExpression(node, scope) {
    const callee = this.eval(node.callee, scope)
    return callee(...node.arguments.map((arg) => this.eval(arg, scope)))
  }
}
