// Copyright (c) 2021 Ivan Zadvornov

export default class Tokenizer {
  static defaultConfig = {
    ignoreComments: true,
    ignoreWhitespace: true,
    saveSourceLocation: true,
    saveSourceIndex: true,
    throwOnUnknownCharacter: true
  }

  /**
   * @param {{
   *  ignoreComments?: boolean,
   *  ignoreWhitespace?: boolean,
   *  saveSourceLocation?: boolean,
   *  saveSourceIndex?: boolean,
   *  throwOnUnknownCharacter?: boolean
   * }} options tokenizer options
   */
  constructor(options) {
    this.options = Object.assign(Tokenizer.defaultConfig, options || {})
  }

  /**
   * Generator function to tokenize input string
   * @param {string} source
   */
  *tokenizeString(source) {
    const rules = {
      "(": /\(/m,
      ")": /\)/m,
      id: /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/,
      string: /("([^"\\]|\\.)*")|('([^'\\]|\\.)*')/m,
      number: /[0-9]+(\.[0-9]+)?/,
      comment: /#([^\r\n])*/,
      whitespace: /\s+/m
    }

    if (!this.options.throwOnUnknownCharacter) {
      rules.unknown = /./
    }

    let row = 1
    let column = 1
    let index = 0

    // While we haven't reached the end of file
    while (index < source.length) {
      let foundMatch = false

      // Iterate over the rules
      for (let [rule, regExp] of Object.entries(rules)) {
        // Check if there are matches
        const match = regExp.exec(source.substring(index))

        // If there is a match
        if (match && match.index === 0) {
          foundMatch = true

          const token = {
            type: rule,
            value: match[0]
          }

          if (this.options.saveSourceLocation) {
            token.row = row
            token.column = column
          }

          if (this.options.saveSourceIndex) {
            token.index = index
          }

          if (
            !(
              (rule === "comment" && this.options.ignoreComments) ||
              (rule === "whitespace" && this.options.ignoreWhitespace)
            )
          ) {
            yield token
          }

          // If there are no newlines in the match
          if (match[0].indexOf("\n") !== -1) {
            // Row += count of newlines in the match
            row += match[0].matchAll(/\r?\n/gm)?.length
            // Column = length of match minus index of the last newline
            column = match[0].length - match[0].lastIndexOf(/\r?\n/gm)
          } else {
            // Else just add the length of the match
            column += match[0].length
          }

          index += match[0].length
          break
        }
      }

      if (!foundMatch) {
        throw new SyntaxError(
          `Unknown character ${JSON.stringify(
            source[index]
          )} at position ${row}:${column}`
        )
      }
    }
  }
}
