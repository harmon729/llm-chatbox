"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/micromark-util-character";
exports.ids = ["vendor-chunks/micromark-util-character"];
exports.modules = {

/***/ "(ssr)/./node_modules/micromark-util-character/dev/index.js":
/*!************************************************************!*\
  !*** ./node_modules/micromark-util-character/dev/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   asciiAlpha: () => (/* binding */ asciiAlpha),\n/* harmony export */   asciiAlphanumeric: () => (/* binding */ asciiAlphanumeric),\n/* harmony export */   asciiAtext: () => (/* binding */ asciiAtext),\n/* harmony export */   asciiControl: () => (/* binding */ asciiControl),\n/* harmony export */   asciiDigit: () => (/* binding */ asciiDigit),\n/* harmony export */   asciiHexDigit: () => (/* binding */ asciiHexDigit),\n/* harmony export */   asciiPunctuation: () => (/* binding */ asciiPunctuation),\n/* harmony export */   markdownLineEnding: () => (/* binding */ markdownLineEnding),\n/* harmony export */   markdownLineEndingOrSpace: () => (/* binding */ markdownLineEndingOrSpace),\n/* harmony export */   markdownSpace: () => (/* binding */ markdownSpace),\n/* harmony export */   unicodePunctuation: () => (/* binding */ unicodePunctuation),\n/* harmony export */   unicodeWhitespace: () => (/* binding */ unicodeWhitespace)\n/* harmony export */ });\n/* harmony import */ var micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! micromark-util-symbol */ \"(ssr)/./node_modules/micromark-util-symbol/lib/codes.js\");\n/**\n * @import {Code} from 'micromark-util-types'\n */\n\n\n\n/**\n * Check whether the character code represents an ASCII alpha (`a` through `z`,\n * case insensitive).\n *\n * An **ASCII alpha** is an ASCII upper alpha or ASCII lower alpha.\n *\n * An **ASCII upper alpha** is a character in the inclusive range U+0041 (`A`)\n * to U+005A (`Z`).\n *\n * An **ASCII lower alpha** is a character in the inclusive range U+0061 (`a`)\n * to U+007A (`z`).\n *\n * @param code\n *   Code.\n * @returns {boolean}\n *   Whether it matches.\n */\nconst asciiAlpha = regexCheck(/[A-Za-z]/)\n\n/**\n * Check whether the character code represents an ASCII alphanumeric (`a`\n * through `z`, case insensitive, or `0` through `9`).\n *\n * An **ASCII alphanumeric** is an ASCII digit (see `asciiDigit`) or ASCII alpha\n * (see `asciiAlpha`).\n *\n * @param code\n *   Code.\n * @returns {boolean}\n *   Whether it matches.\n */\nconst asciiAlphanumeric = regexCheck(/[\\dA-Za-z]/)\n\n/**\n * Check whether the character code represents an ASCII atext.\n *\n * atext is an ASCII alphanumeric (see `asciiAlphanumeric`), or a character in\n * the inclusive ranges U+0023 NUMBER SIGN (`#`) to U+0027 APOSTROPHE (`'`),\n * U+002A ASTERISK (`*`), U+002B PLUS SIGN (`+`), U+002D DASH (`-`), U+002F\n * SLASH (`/`), U+003D EQUALS TO (`=`), U+003F QUESTION MARK (`?`), U+005E\n * CARET (`^`) to U+0060 GRAVE ACCENT (`` ` ``), or U+007B LEFT CURLY BRACE\n * (`{`) to U+007E TILDE (`~`).\n *\n * See:\n * **\\[RFC5322]**:\n * [Internet Message Format](https://tools.ietf.org/html/rfc5322).\n * P. Resnick.\n * IETF.\n *\n * @param code\n *   Code.\n * @returns {boolean}\n *   Whether it matches.\n */\nconst asciiAtext = regexCheck(/[#-'*+\\--9=?A-Z^-~]/)\n\n/**\n * Check whether a character code is an ASCII control character.\n *\n * An **ASCII control** is a character in the inclusive range U+0000 NULL (NUL)\n * to U+001F (US), or U+007F (DEL).\n *\n * @param {Code} code\n *   Code.\n * @returns {boolean}\n *   Whether it matches.\n */\nfunction asciiControl(code) {\n  return (\n    // Special whitespace codes (which have negative values), C0 and Control\n    // character DEL\n    code !== null && (code < micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.space || code === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.del)\n  )\n}\n\n/**\n * Check whether the character code represents an ASCII digit (`0` through `9`).\n *\n * An **ASCII digit** is a character in the inclusive range U+0030 (`0`) to\n * U+0039 (`9`).\n *\n * @param code\n *   Code.\n * @returns {boolean}\n *   Whether it matches.\n */\nconst asciiDigit = regexCheck(/\\d/)\n\n/**\n * Check whether the character code represents an ASCII hex digit (`a` through\n * `f`, case insensitive, or `0` through `9`).\n *\n * An **ASCII hex digit** is an ASCII digit (see `asciiDigit`), ASCII upper hex\n * digit, or an ASCII lower hex digit.\n *\n * An **ASCII upper hex digit** is a character in the inclusive range U+0041\n * (`A`) to U+0046 (`F`).\n *\n * An **ASCII lower hex digit** is a character in the inclusive range U+0061\n * (`a`) to U+0066 (`f`).\n *\n * @param code\n *   Code.\n * @returns {boolean}\n *   Whether it matches.\n */\nconst asciiHexDigit = regexCheck(/[\\dA-Fa-f]/)\n\n/**\n * Check whether the character code represents ASCII punctuation.\n *\n * An **ASCII punctuation** is a character in the inclusive ranges U+0021\n * EXCLAMATION MARK (`!`) to U+002F SLASH (`/`), U+003A COLON (`:`) to U+0040 AT\n * SIGN (`@`), U+005B LEFT SQUARE BRACKET (`[`) to U+0060 GRAVE ACCENT\n * (`` ` ``), or U+007B LEFT CURLY BRACE (`{`) to U+007E TILDE (`~`).\n *\n * @param code\n *   Code.\n * @returns {boolean}\n *   Whether it matches.\n */\nconst asciiPunctuation = regexCheck(/[!-/:-@[-`{-~]/)\n\n/**\n * Check whether a character code is a markdown line ending.\n *\n * A **markdown line ending** is the virtual characters M-0003 CARRIAGE RETURN\n * LINE FEED (CRLF), M-0004 LINE FEED (LF) and M-0005 CARRIAGE RETURN (CR).\n *\n * In micromark, the actual character U+000A LINE FEED (LF) and U+000D CARRIAGE\n * RETURN (CR) are replaced by these virtual characters depending on whether\n * they occurred together.\n *\n * @param {Code} code\n *   Code.\n * @returns {boolean}\n *   Whether it matches.\n */\nfunction markdownLineEnding(code) {\n  return code !== null && code < micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.horizontalTab\n}\n\n/**\n * Check whether a character code is a markdown line ending (see\n * `markdownLineEnding`) or markdown space (see `markdownSpace`).\n *\n * @param {Code} code\n *   Code.\n * @returns {boolean}\n *   Whether it matches.\n */\nfunction markdownLineEndingOrSpace(code) {\n  return code !== null && (code < micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.nul || code === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.space)\n}\n\n/**\n * Check whether a character code is a markdown space.\n *\n * A **markdown space** is the concrete character U+0020 SPACE (SP) and the\n * virtual characters M-0001 VIRTUAL SPACE (VS) and M-0002 HORIZONTAL TAB (HT).\n *\n * In micromark, the actual character U+0009 CHARACTER TABULATION (HT) is\n * replaced by one M-0002 HORIZONTAL TAB (HT) and between 0 and 3 M-0001 VIRTUAL\n * SPACE (VS) characters, depending on the column at which the tab occurred.\n *\n * @param {Code} code\n *   Code.\n * @returns {boolean}\n *   Whether it matches.\n */\nfunction markdownSpace(code) {\n  return (\n    code === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.horizontalTab ||\n    code === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.virtualSpace ||\n    code === micromark_util_symbol__WEBPACK_IMPORTED_MODULE_0__.codes.space\n  )\n}\n\n// Size note: removing ASCII from the regex and using `asciiPunctuation` here\n// In fact adds to the bundle size.\n/**\n * Check whether the character code represents Unicode punctuation.\n *\n * A **Unicode punctuation** is a character in the Unicode `Pc` (Punctuation,\n * Connector), `Pd` (Punctuation, Dash), `Pe` (Punctuation, Close), `Pf`\n * (Punctuation, Final quote), `Pi` (Punctuation, Initial quote), `Po`\n * (Punctuation, Other), or `Ps` (Punctuation, Open) categories, or an ASCII\n * punctuation (see `asciiPunctuation`).\n *\n * See:\n * **\\[UNICODE]**:\n * [The Unicode Standard](https://www.unicode.org/versions/).\n * Unicode Consortium.\n *\n * @param code\n *   Code.\n * @returns\n *   Whether it matches.\n */\nconst unicodePunctuation = regexCheck(/\\p{P}|\\p{S}/u)\n\n/**\n * Check whether the character code represents Unicode whitespace.\n *\n * Note that this does handle micromark specific markdown whitespace characters.\n * See `markdownLineEndingOrSpace` to check that.\n *\n * A **Unicode whitespace** is a character in the Unicode `Zs` (Separator,\n * Space) category, or U+0009 CHARACTER TABULATION (HT), U+000A LINE FEED (LF),\n * U+000C (FF), or U+000D CARRIAGE RETURN (CR) (**\\[UNICODE]**).\n *\n * See:\n * **\\[UNICODE]**:\n * [The Unicode Standard](https://www.unicode.org/versions/).\n * Unicode Consortium.\n *\n * @param code\n *   Code.\n * @returns\n *   Whether it matches.\n */\nconst unicodeWhitespace = regexCheck(/\\s/)\n\n/**\n * Create a code check from a regex.\n *\n * @param {RegExp} regex\n *   Expression.\n * @returns {(code: Code) => boolean}\n *   Check.\n */\nfunction regexCheck(regex) {\n  return check\n\n  /**\n   * Check whether a code matches the bound regex.\n   *\n   * @param {Code} code\n   *   Character code.\n   * @returns {boolean}\n   *   Whether the character code matches the bound regex.\n   */\n  function check(code) {\n    return code !== null && code > -1 && regex.test(String.fromCharCode(code))\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvbWljcm9tYXJrLXV0aWwtY2hhcmFjdGVyL2Rldi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQSxZQUFZLE1BQU07QUFDbEI7O0FBRTJDOztBQUUzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHdEQUFLLG1CQUFtQix3REFBSztBQUMxRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNENBQTRDO0FBQzVDO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ08sZ0RBQWdEOztBQUV2RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087QUFDUCxpQ0FBaUMsd0RBQUs7QUFDdEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE1BQU07QUFDakI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNPO0FBQ1Asa0NBQWtDLHdEQUFLLGlCQUFpQix3REFBSztBQUM3RDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsTUFBTTtBQUNqQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087QUFDUDtBQUNBLGFBQWEsd0RBQUs7QUFDbEIsYUFBYSx3REFBSztBQUNsQixhQUFhLHdEQUFLO0FBQ2xCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ08sMENBQTBDLEVBQUUsSUFBSSxFQUFFOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087O0FBRVA7QUFDQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsTUFBTTtBQUNuQjtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9sbG0tY2hhdGJveC8uL25vZGVfbW9kdWxlcy9taWNyb21hcmstdXRpbC1jaGFyYWN0ZXIvZGV2L2luZGV4LmpzPzlhNDQiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAaW1wb3J0IHtDb2RlfSBmcm9tICdtaWNyb21hcmstdXRpbC10eXBlcydcbiAqL1xuXG5pbXBvcnQge2NvZGVzfSBmcm9tICdtaWNyb21hcmstdXRpbC1zeW1ib2wnXG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgY2hhcmFjdGVyIGNvZGUgcmVwcmVzZW50cyBhbiBBU0NJSSBhbHBoYSAoYGFgIHRocm91Z2ggYHpgLFxuICogY2FzZSBpbnNlbnNpdGl2ZSkuXG4gKlxuICogQW4gKipBU0NJSSBhbHBoYSoqIGlzIGFuIEFTQ0lJIHVwcGVyIGFscGhhIG9yIEFTQ0lJIGxvd2VyIGFscGhhLlxuICpcbiAqIEFuICoqQVNDSUkgdXBwZXIgYWxwaGEqKiBpcyBhIGNoYXJhY3RlciBpbiB0aGUgaW5jbHVzaXZlIHJhbmdlIFUrMDA0MSAoYEFgKVxuICogdG8gVSswMDVBIChgWmApLlxuICpcbiAqIEFuICoqQVNDSUkgbG93ZXIgYWxwaGEqKiBpcyBhIGNoYXJhY3RlciBpbiB0aGUgaW5jbHVzaXZlIHJhbmdlIFUrMDA2MSAoYGFgKVxuICogdG8gVSswMDdBIChgemApLlxuICpcbiAqIEBwYXJhbSBjb2RlXG4gKiAgIENvZGUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqICAgV2hldGhlciBpdCBtYXRjaGVzLlxuICovXG5leHBvcnQgY29uc3QgYXNjaWlBbHBoYSA9IHJlZ2V4Q2hlY2soL1tBLVphLXpdLylcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBjaGFyYWN0ZXIgY29kZSByZXByZXNlbnRzIGFuIEFTQ0lJIGFscGhhbnVtZXJpYyAoYGFgXG4gKiB0aHJvdWdoIGB6YCwgY2FzZSBpbnNlbnNpdGl2ZSwgb3IgYDBgIHRocm91Z2ggYDlgKS5cbiAqXG4gKiBBbiAqKkFTQ0lJIGFscGhhbnVtZXJpYyoqIGlzIGFuIEFTQ0lJIGRpZ2l0IChzZWUgYGFzY2lpRGlnaXRgKSBvciBBU0NJSSBhbHBoYVxuICogKHNlZSBgYXNjaWlBbHBoYWApLlxuICpcbiAqIEBwYXJhbSBjb2RlXG4gKiAgIENvZGUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqICAgV2hldGhlciBpdCBtYXRjaGVzLlxuICovXG5leHBvcnQgY29uc3QgYXNjaWlBbHBoYW51bWVyaWMgPSByZWdleENoZWNrKC9bXFxkQS1aYS16XS8pXG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgY2hhcmFjdGVyIGNvZGUgcmVwcmVzZW50cyBhbiBBU0NJSSBhdGV4dC5cbiAqXG4gKiBhdGV4dCBpcyBhbiBBU0NJSSBhbHBoYW51bWVyaWMgKHNlZSBgYXNjaWlBbHBoYW51bWVyaWNgKSwgb3IgYSBjaGFyYWN0ZXIgaW5cbiAqIHRoZSBpbmNsdXNpdmUgcmFuZ2VzIFUrMDAyMyBOVU1CRVIgU0lHTiAoYCNgKSB0byBVKzAwMjcgQVBPU1RST1BIRSAoYCdgKSxcbiAqIFUrMDAyQSBBU1RFUklTSyAoYCpgKSwgVSswMDJCIFBMVVMgU0lHTiAoYCtgKSwgVSswMDJEIERBU0ggKGAtYCksIFUrMDAyRlxuICogU0xBU0ggKGAvYCksIFUrMDAzRCBFUVVBTFMgVE8gKGA9YCksIFUrMDAzRiBRVUVTVElPTiBNQVJLIChgP2ApLCBVKzAwNUVcbiAqIENBUkVUIChgXmApIHRvIFUrMDA2MCBHUkFWRSBBQ0NFTlQgKGBgIGAgYGApLCBvciBVKzAwN0IgTEVGVCBDVVJMWSBCUkFDRVxuICogKGB7YCkgdG8gVSswMDdFIFRJTERFIChgfmApLlxuICpcbiAqIFNlZTpcbiAqICoqXFxbUkZDNTMyMl0qKjpcbiAqIFtJbnRlcm5ldCBNZXNzYWdlIEZvcm1hdF0oaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzUzMjIpLlxuICogUC4gUmVzbmljay5cbiAqIElFVEYuXG4gKlxuICogQHBhcmFtIGNvZGVcbiAqICAgQ29kZS5cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICogICBXaGV0aGVyIGl0IG1hdGNoZXMuXG4gKi9cbmV4cG9ydCBjb25zdCBhc2NpaUF0ZXh0ID0gcmVnZXhDaGVjaygvWyMtJyorXFwtLTk9P0EtWl4tfl0vKVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYSBjaGFyYWN0ZXIgY29kZSBpcyBhbiBBU0NJSSBjb250cm9sIGNoYXJhY3Rlci5cbiAqXG4gKiBBbiAqKkFTQ0lJIGNvbnRyb2wqKiBpcyBhIGNoYXJhY3RlciBpbiB0aGUgaW5jbHVzaXZlIHJhbmdlIFUrMDAwMCBOVUxMIChOVUwpXG4gKiB0byBVKzAwMUYgKFVTKSwgb3IgVSswMDdGIChERUwpLlxuICpcbiAqIEBwYXJhbSB7Q29kZX0gY29kZVxuICogICBDb2RlLlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiAgIFdoZXRoZXIgaXQgbWF0Y2hlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzY2lpQ29udHJvbChjb2RlKSB7XG4gIHJldHVybiAoXG4gICAgLy8gU3BlY2lhbCB3aGl0ZXNwYWNlIGNvZGVzICh3aGljaCBoYXZlIG5lZ2F0aXZlIHZhbHVlcyksIEMwIGFuZCBDb250cm9sXG4gICAgLy8gY2hhcmFjdGVyIERFTFxuICAgIGNvZGUgIT09IG51bGwgJiYgKGNvZGUgPCBjb2Rlcy5zcGFjZSB8fCBjb2RlID09PSBjb2Rlcy5kZWwpXG4gIClcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBjaGFyYWN0ZXIgY29kZSByZXByZXNlbnRzIGFuIEFTQ0lJIGRpZ2l0IChgMGAgdGhyb3VnaCBgOWApLlxuICpcbiAqIEFuICoqQVNDSUkgZGlnaXQqKiBpcyBhIGNoYXJhY3RlciBpbiB0aGUgaW5jbHVzaXZlIHJhbmdlIFUrMDAzMCAoYDBgKSB0b1xuICogVSswMDM5IChgOWApLlxuICpcbiAqIEBwYXJhbSBjb2RlXG4gKiAgIENvZGUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqICAgV2hldGhlciBpdCBtYXRjaGVzLlxuICovXG5leHBvcnQgY29uc3QgYXNjaWlEaWdpdCA9IHJlZ2V4Q2hlY2soL1xcZC8pXG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgY2hhcmFjdGVyIGNvZGUgcmVwcmVzZW50cyBhbiBBU0NJSSBoZXggZGlnaXQgKGBhYCB0aHJvdWdoXG4gKiBgZmAsIGNhc2UgaW5zZW5zaXRpdmUsIG9yIGAwYCB0aHJvdWdoIGA5YCkuXG4gKlxuICogQW4gKipBU0NJSSBoZXggZGlnaXQqKiBpcyBhbiBBU0NJSSBkaWdpdCAoc2VlIGBhc2NpaURpZ2l0YCksIEFTQ0lJIHVwcGVyIGhleFxuICogZGlnaXQsIG9yIGFuIEFTQ0lJIGxvd2VyIGhleCBkaWdpdC5cbiAqXG4gKiBBbiAqKkFTQ0lJIHVwcGVyIGhleCBkaWdpdCoqIGlzIGEgY2hhcmFjdGVyIGluIHRoZSBpbmNsdXNpdmUgcmFuZ2UgVSswMDQxXG4gKiAoYEFgKSB0byBVKzAwNDYgKGBGYCkuXG4gKlxuICogQW4gKipBU0NJSSBsb3dlciBoZXggZGlnaXQqKiBpcyBhIGNoYXJhY3RlciBpbiB0aGUgaW5jbHVzaXZlIHJhbmdlIFUrMDA2MVxuICogKGBhYCkgdG8gVSswMDY2IChgZmApLlxuICpcbiAqIEBwYXJhbSBjb2RlXG4gKiAgIENvZGUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqICAgV2hldGhlciBpdCBtYXRjaGVzLlxuICovXG5leHBvcnQgY29uc3QgYXNjaWlIZXhEaWdpdCA9IHJlZ2V4Q2hlY2soL1tcXGRBLUZhLWZdLylcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBjaGFyYWN0ZXIgY29kZSByZXByZXNlbnRzIEFTQ0lJIHB1bmN0dWF0aW9uLlxuICpcbiAqIEFuICoqQVNDSUkgcHVuY3R1YXRpb24qKiBpcyBhIGNoYXJhY3RlciBpbiB0aGUgaW5jbHVzaXZlIHJhbmdlcyBVKzAwMjFcbiAqIEVYQ0xBTUFUSU9OIE1BUksgKGAhYCkgdG8gVSswMDJGIFNMQVNIIChgL2ApLCBVKzAwM0EgQ09MT04gKGA6YCkgdG8gVSswMDQwIEFUXG4gKiBTSUdOIChgQGApLCBVKzAwNUIgTEVGVCBTUVVBUkUgQlJBQ0tFVCAoYFtgKSB0byBVKzAwNjAgR1JBVkUgQUNDRU5UXG4gKiAoYGAgYCBgYCksIG9yIFUrMDA3QiBMRUZUIENVUkxZIEJSQUNFIChge2ApIHRvIFUrMDA3RSBUSUxERSAoYH5gKS5cbiAqXG4gKiBAcGFyYW0gY29kZVxuICogICBDb2RlLlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiAgIFdoZXRoZXIgaXQgbWF0Y2hlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IGFzY2lpUHVuY3R1YXRpb24gPSByZWdleENoZWNrKC9bIS0vOi1AWy1gey1+XS8pXG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhIGNoYXJhY3RlciBjb2RlIGlzIGEgbWFya2Rvd24gbGluZSBlbmRpbmcuXG4gKlxuICogQSAqKm1hcmtkb3duIGxpbmUgZW5kaW5nKiogaXMgdGhlIHZpcnR1YWwgY2hhcmFjdGVycyBNLTAwMDMgQ0FSUklBR0UgUkVUVVJOXG4gKiBMSU5FIEZFRUQgKENSTEYpLCBNLTAwMDQgTElORSBGRUVEIChMRikgYW5kIE0tMDAwNSBDQVJSSUFHRSBSRVRVUk4gKENSKS5cbiAqXG4gKiBJbiBtaWNyb21hcmssIHRoZSBhY3R1YWwgY2hhcmFjdGVyIFUrMDAwQSBMSU5FIEZFRUQgKExGKSBhbmQgVSswMDBEIENBUlJJQUdFXG4gKiBSRVRVUk4gKENSKSBhcmUgcmVwbGFjZWQgYnkgdGhlc2UgdmlydHVhbCBjaGFyYWN0ZXJzIGRlcGVuZGluZyBvbiB3aGV0aGVyXG4gKiB0aGV5IG9jY3VycmVkIHRvZ2V0aGVyLlxuICpcbiAqIEBwYXJhbSB7Q29kZX0gY29kZVxuICogICBDb2RlLlxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKiAgIFdoZXRoZXIgaXQgbWF0Y2hlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hcmtkb3duTGluZUVuZGluZyhjb2RlKSB7XG4gIHJldHVybiBjb2RlICE9PSBudWxsICYmIGNvZGUgPCBjb2Rlcy5ob3Jpem9udGFsVGFiXG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhIGNoYXJhY3RlciBjb2RlIGlzIGEgbWFya2Rvd24gbGluZSBlbmRpbmcgKHNlZVxuICogYG1hcmtkb3duTGluZUVuZGluZ2ApIG9yIG1hcmtkb3duIHNwYWNlIChzZWUgYG1hcmtkb3duU3BhY2VgKS5cbiAqXG4gKiBAcGFyYW0ge0NvZGV9IGNvZGVcbiAqICAgQ29kZS5cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICogICBXaGV0aGVyIGl0IG1hdGNoZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXJrZG93bkxpbmVFbmRpbmdPclNwYWNlKGNvZGUpIHtcbiAgcmV0dXJuIGNvZGUgIT09IG51bGwgJiYgKGNvZGUgPCBjb2Rlcy5udWwgfHwgY29kZSA9PT0gY29kZXMuc3BhY2UpXG59XG5cbi8qKlxuICogQ2hlY2sgd2hldGhlciBhIGNoYXJhY3RlciBjb2RlIGlzIGEgbWFya2Rvd24gc3BhY2UuXG4gKlxuICogQSAqKm1hcmtkb3duIHNwYWNlKiogaXMgdGhlIGNvbmNyZXRlIGNoYXJhY3RlciBVKzAwMjAgU1BBQ0UgKFNQKSBhbmQgdGhlXG4gKiB2aXJ0dWFsIGNoYXJhY3RlcnMgTS0wMDAxIFZJUlRVQUwgU1BBQ0UgKFZTKSBhbmQgTS0wMDAyIEhPUklaT05UQUwgVEFCIChIVCkuXG4gKlxuICogSW4gbWljcm9tYXJrLCB0aGUgYWN0dWFsIGNoYXJhY3RlciBVKzAwMDkgQ0hBUkFDVEVSIFRBQlVMQVRJT04gKEhUKSBpc1xuICogcmVwbGFjZWQgYnkgb25lIE0tMDAwMiBIT1JJWk9OVEFMIFRBQiAoSFQpIGFuZCBiZXR3ZWVuIDAgYW5kIDMgTS0wMDAxIFZJUlRVQUxcbiAqIFNQQUNFIChWUykgY2hhcmFjdGVycywgZGVwZW5kaW5nIG9uIHRoZSBjb2x1bW4gYXQgd2hpY2ggdGhlIHRhYiBvY2N1cnJlZC5cbiAqXG4gKiBAcGFyYW0ge0NvZGV9IGNvZGVcbiAqICAgQ29kZS5cbiAqIEByZXR1cm5zIHtib29sZWFufVxuICogICBXaGV0aGVyIGl0IG1hdGNoZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXJrZG93blNwYWNlKGNvZGUpIHtcbiAgcmV0dXJuIChcbiAgICBjb2RlID09PSBjb2Rlcy5ob3Jpem9udGFsVGFiIHx8XG4gICAgY29kZSA9PT0gY29kZXMudmlydHVhbFNwYWNlIHx8XG4gICAgY29kZSA9PT0gY29kZXMuc3BhY2VcbiAgKVxufVxuXG4vLyBTaXplIG5vdGU6IHJlbW92aW5nIEFTQ0lJIGZyb20gdGhlIHJlZ2V4IGFuZCB1c2luZyBgYXNjaWlQdW5jdHVhdGlvbmAgaGVyZVxuLy8gSW4gZmFjdCBhZGRzIHRvIHRoZSBidW5kbGUgc2l6ZS5cbi8qKlxuICogQ2hlY2sgd2hldGhlciB0aGUgY2hhcmFjdGVyIGNvZGUgcmVwcmVzZW50cyBVbmljb2RlIHB1bmN0dWF0aW9uLlxuICpcbiAqIEEgKipVbmljb2RlIHB1bmN0dWF0aW9uKiogaXMgYSBjaGFyYWN0ZXIgaW4gdGhlIFVuaWNvZGUgYFBjYCAoUHVuY3R1YXRpb24sXG4gKiBDb25uZWN0b3IpLCBgUGRgIChQdW5jdHVhdGlvbiwgRGFzaCksIGBQZWAgKFB1bmN0dWF0aW9uLCBDbG9zZSksIGBQZmBcbiAqIChQdW5jdHVhdGlvbiwgRmluYWwgcXVvdGUpLCBgUGlgIChQdW5jdHVhdGlvbiwgSW5pdGlhbCBxdW90ZSksIGBQb2BcbiAqIChQdW5jdHVhdGlvbiwgT3RoZXIpLCBvciBgUHNgIChQdW5jdHVhdGlvbiwgT3BlbikgY2F0ZWdvcmllcywgb3IgYW4gQVNDSUlcbiAqIHB1bmN0dWF0aW9uIChzZWUgYGFzY2lpUHVuY3R1YXRpb25gKS5cbiAqXG4gKiBTZWU6XG4gKiAqKlxcW1VOSUNPREVdKio6XG4gKiBbVGhlIFVuaWNvZGUgU3RhbmRhcmRdKGh0dHBzOi8vd3d3LnVuaWNvZGUub3JnL3ZlcnNpb25zLykuXG4gKiBVbmljb2RlIENvbnNvcnRpdW0uXG4gKlxuICogQHBhcmFtIGNvZGVcbiAqICAgQ29kZS5cbiAqIEByZXR1cm5zXG4gKiAgIFdoZXRoZXIgaXQgbWF0Y2hlcy5cbiAqL1xuZXhwb3J0IGNvbnN0IHVuaWNvZGVQdW5jdHVhdGlvbiA9IHJlZ2V4Q2hlY2soL1xccHtQfXxcXHB7U30vdSlcblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIHRoZSBjaGFyYWN0ZXIgY29kZSByZXByZXNlbnRzIFVuaWNvZGUgd2hpdGVzcGFjZS5cbiAqXG4gKiBOb3RlIHRoYXQgdGhpcyBkb2VzIGhhbmRsZSBtaWNyb21hcmsgc3BlY2lmaWMgbWFya2Rvd24gd2hpdGVzcGFjZSBjaGFyYWN0ZXJzLlxuICogU2VlIGBtYXJrZG93bkxpbmVFbmRpbmdPclNwYWNlYCB0byBjaGVjayB0aGF0LlxuICpcbiAqIEEgKipVbmljb2RlIHdoaXRlc3BhY2UqKiBpcyBhIGNoYXJhY3RlciBpbiB0aGUgVW5pY29kZSBgWnNgIChTZXBhcmF0b3IsXG4gKiBTcGFjZSkgY2F0ZWdvcnksIG9yIFUrMDAwOSBDSEFSQUNURVIgVEFCVUxBVElPTiAoSFQpLCBVKzAwMEEgTElORSBGRUVEIChMRiksXG4gKiBVKzAwMEMgKEZGKSwgb3IgVSswMDBEIENBUlJJQUdFIFJFVFVSTiAoQ1IpICgqKlxcW1VOSUNPREVdKiopLlxuICpcbiAqIFNlZTpcbiAqICoqXFxbVU5JQ09ERV0qKjpcbiAqIFtUaGUgVW5pY29kZSBTdGFuZGFyZF0oaHR0cHM6Ly93d3cudW5pY29kZS5vcmcvdmVyc2lvbnMvKS5cbiAqIFVuaWNvZGUgQ29uc29ydGl1bS5cbiAqXG4gKiBAcGFyYW0gY29kZVxuICogICBDb2RlLlxuICogQHJldHVybnNcbiAqICAgV2hldGhlciBpdCBtYXRjaGVzLlxuICovXG5leHBvcnQgY29uc3QgdW5pY29kZVdoaXRlc3BhY2UgPSByZWdleENoZWNrKC9cXHMvKVxuXG4vKipcbiAqIENyZWF0ZSBhIGNvZGUgY2hlY2sgZnJvbSBhIHJlZ2V4LlxuICpcbiAqIEBwYXJhbSB7UmVnRXhwfSByZWdleFxuICogICBFeHByZXNzaW9uLlxuICogQHJldHVybnMgeyhjb2RlOiBDb2RlKSA9PiBib29sZWFufVxuICogICBDaGVjay5cbiAqL1xuZnVuY3Rpb24gcmVnZXhDaGVjayhyZWdleCkge1xuICByZXR1cm4gY2hlY2tcblxuICAvKipcbiAgICogQ2hlY2sgd2hldGhlciBhIGNvZGUgbWF0Y2hlcyB0aGUgYm91bmQgcmVnZXguXG4gICAqXG4gICAqIEBwYXJhbSB7Q29kZX0gY29kZVxuICAgKiAgIENoYXJhY3RlciBjb2RlLlxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAgICogICBXaGV0aGVyIHRoZSBjaGFyYWN0ZXIgY29kZSBtYXRjaGVzIHRoZSBib3VuZCByZWdleC5cbiAgICovXG4gIGZ1bmN0aW9uIGNoZWNrKGNvZGUpIHtcbiAgICByZXR1cm4gY29kZSAhPT0gbnVsbCAmJiBjb2RlID4gLTEgJiYgcmVnZXgudGVzdChTdHJpbmcuZnJvbUNoYXJDb2RlKGNvZGUpKVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/micromark-util-character/dev/index.js\n");

/***/ })

};
;