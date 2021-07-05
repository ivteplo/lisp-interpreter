// Copyright (c) 2021 Ivan Zadvornov

import { describe, it, expect } from "@jest/globals"
import Tokenizer from "./Tokenizer.js"

const tokenizer = new Tokenizer({
  ignoreComments: false
})

const tokenize = (string) => [...tokenizer.tokenizeString(string)]

const runTest = (input, expectedOutput) =>
  expect(tokenize(input)).toEqual(expectedOutput)

const runTests = (tests) =>
  Object.entries(tests).forEach(([input, output]) => runTest(input, output))

describe("Tokenizer", () => {
  it("is tokenizing identifiers correctly", () =>
    runTests({
      print: [
        {
          type: "id",
          value: "print",
          row: 1,
          column: 1,
          index: 0
        }
      ]
    }))

  it("is tokenizing strings correctly", () =>
    runTests({
      '"hello world!"': [
        {
          type: "string",
          value: '"hello world!"',
          row: 1,
          column: 1,
          index: 0
        }
      ],
      '"hello\nworld!"': [
        {
          type: "string",
          value: '"hello\nworld!"',
          row: 1,
          column: 1,
          index: 0
        }
      ]
    }))

  it("is tokenizing numbers correctly", () =>
    runTests({
      3: [
        {
          type: "number",
          value: "3",
          row: 1,
          column: 1,
          index: 0
        }
      ],
      3.14: [
        {
          type: "number",
          value: "3.14",
          row: 1,
          column: 1,
          index: 0
        }
      ]
    }))

  it("is tokenizing expressions correctly", () =>
    runTests({
      "(print 10)": [
        {
          type: "(",
          value: "(",
          row: 1,
          column: 1,
          index: 0
        },
        {
          type: "id",
          value: "print",
          row: 1,
          column: 2,
          index: 1
        },
        {
          type: "number",
          value: "10",
          row: 1,
          column: 8,
          index: 7
        },
        {
          type: ")",
          value: ")",
          row: 1,
          column: 10,
          index: 9
        }
      ]
    }))

  it("is tokenizing comments correctly", () =>
    runTests({
      "#!/usr/bin/env lisp": [
        {
          type: "comment",
          value: "#!/usr/bin/env lisp",
          row: 1,
          column: 1,
          index: 0
        }
      ],

      "(print 10) # prints 10\n": [
        {
          type: "(",
          value: "(",
          row: 1,
          column: 1,
          index: 0
        },
        {
          type: "id",
          value: "print",
          row: 1,
          column: 2,
          index: 1
        },
        {
          type: "number",
          value: "10",
          row: 1,
          column: 8,
          index: 7
        },
        {
          type: ")",
          value: ")",
          row: 1,
          column: 10,
          index: 9
        },
        {
          type: "comment",
          value: "# prints 10",
          row: 1,
          column: 12,
          index: 11
        }
      ]
    }))
})
