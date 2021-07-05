#!/usr/bin/env node
// Copyright (c) 2021 Ivan Zadvornov

import { Parser, Interpreter } from "../src/index.js"
import fs from "fs-extra"

const argv = process.argv.slice(2)

if (argv.length === 0) {
  console.error("No input file specified")
  process.exit(1)
}

if (argv.length > 1) {
  console.error("Too many arguments passed")
  console.error("Usage: lisp <input-file>")
  process.exit(1)
}

interpretFile(argv[0])

async function interpretFile(file) {
  const input = String(await fs.readFile(file))
  const node = new Parser().parse(input)
  new Interpreter().eval(node)
}
