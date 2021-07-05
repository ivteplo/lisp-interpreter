// Copyright (c) 2021 Ivan Zadvornov

import { describe, it, expect } from "@jest/globals"
import Parser from "./Parser.js"

const parser = new Parser()

const parse = (input) => parser.parse(input)

const runTest = (input, expectedOutput) =>
  expect(parse(input)).toEqual(expectedOutput)

const runTests = (tests) =>
  Object.entries(tests).forEach(([input, output]) => runTest(input, output))

describe("Parser", () => {
  it("parses expressions correctly", () =>
    runTests({
      "(print 10)": {
        type: "Module",
        body: [
          {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              value: "print"
            },
            arguments: [
              {
                type: "Number",
                value: "10"
              }
            ]
          }
        ]
      },
      "(print 'hello world!')": {
        type: "Module",
        body: [
          {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              value: "print"
            },
            arguments: [
              {
                type: "String",
                value: "'hello world!'"
              }
            ]
          }
        ]
      },
      "(print (concat 'hello' 'world'))": {
        type: "Module",
        body: [
          {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              value: "print"
            },
            arguments: [
              {
                type: "CallExpression",
                callee: {
                  type: "Identifier",
                  value: "concat"
                },
                arguments: [
                  {
                    type: "String",
                    value: "'hello'"
                  },
                  {
                    type: "String",
                    value: "'world'"
                  }
                ]
              }
            ]
          }
        ]
      }
    }))
})
