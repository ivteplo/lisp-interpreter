// Copyright (c) 2021 Ivan Zadvornov

import Tokenizer from "./Tokenizer.js"
import unescape from "unescape-js"

export default class Parser {
  constructor() {
    this.tokenizer = new Tokenizer({
      ignoreComments: true,
      ignoreWhitespace: true,
      saveSourceLocation: true,
      saveSourceIndex: true,
      throwOnUnknownCharacter: true
    })

    this.tokenBuffer = undefined
  }

  /**
   * Function to parse input string
   * @param {string} string
   */
  parse(string) {
    this.tokenStream = this.tokenizer.tokenizeString(string)
    return this.parseModule()
  }

  parseModule() {
    const body = []

    while (this.currentToken() !== undefined) {
      body.push(this.parseCallExpression())
    }

    return {
      type: "Module",
      body
    }
  }

  parseExpression() {
    if (this.peek("(")) {
      return this.parseCallExpression()
    } else if (this.peek("id")) {
      return this.parseIdentifier()
    } else if (this.peek("number")) {
      return this.parseNumber()
    } else if (this.peek("string")) {
      return this.parseString()
    } else {
      const token = this.currentToken()

      if (!token) {
        throw new SyntaxError("Expected expression, but got end of file")
      }

      throw new SyntaxError(
        `Expected expression, but got ${token.type} at position ${token.row}:${token.column}`
      )
    }
  }

  parseCallExpression() {
    this.consume("(")

    const callee = this.parseExpression()
    const args = []

    while (!this.peek(")")) {
      args.push(this.parseExpression())
    }

    this.consume(")")

    return {
      type: "CallExpression",
      callee,
      arguments: args
    }
  }

  parseIdentifier() {
    const id = this.consume("id")
    return {
      type: "Identifier",
      value: id.value
    }
  }

  parseNumber() {
    const number = this.consume("number")
    return {
      type: "Number",
      value: +number.value
    }
  }

  parseString() {
    const string = this.consume("string")
    return {
      type: "String",
      value: unescape(string.value.slice(1, -1))
    }
  }

  peek(type) {
    return this.currentToken()?.type === type ?? false
  }

  consume(type, value) {
    const token = this.popToken()

    if (!token) {
      throw new SyntaxError(`Unexpected end of file`)
    }

    if (token.type !== type) {
      throw new SyntaxError(
        `Expected ${type}, but got ${token.type} at position ${token.row}:${token.column}`
      )
    }

    if (value && token.value !== value) {
      throw new SyntaxError(
        `Expected ${JSON.stringify(value)}, but got ${JSON.stringify(
          token.value
        )}`
      )
    }

    return token
  }

  popToken() {
    const result = this.tokenBuffer || this.nextToken()
    this.tokenBuffer = undefined

    return result
  }

  currentToken() {
    if (!this.tokenBuffer) {
      this.tokenBuffer = this.nextToken()
    }

    return this.tokenBuffer
  }

  nextToken() {
    const item = this.tokenStream.next()

    if (item.done && !item.value) {
      return
    }

    return item.value
  }
}
