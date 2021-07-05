// Copyright (c) 2021 Ivan Zadvornov

import { describe, it, expect } from "@jest/globals"
import Interpreter from "./Interpreter.js"
import Parser from "./Parser.js"

const parser = new Parser()
const interpreter = new Interpreter()

const parse = (input) => parser.parse(input)
const interpret = (node) => interpreter.eval(node)

const runTest = (input, expectedOutput) => {
  const node = parse(input)
  return expect(interpret(node)).toEqual(expectedOutput)
}

const runTests = (tests) =>
  Object.entries(tests).forEach(([input, output]) => runTest(input, output))

describe("Interpreter", () => {
  it("correctly interprets code", () =>
    runTests({
      "(add 5 10)": [15],
      "(list 5 10 15)": [[5, 10, 15]],
      "(length (list 5 10 15))": [3]
    }))
})
