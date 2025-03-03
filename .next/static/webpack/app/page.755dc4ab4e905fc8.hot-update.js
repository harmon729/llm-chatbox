"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./src/components/StandaloneChatBox.tsx":
/*!**********************************************!*\
  !*** ./src/components/StandaloneChatBox.tsx ***!
  \**********************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _hooks_useChatMessages__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/hooks/useChatMessages */ \"(app-pages-browser)/./src/hooks/useChatMessages.ts\");\n/* harmony import */ var _ChatInput__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ChatInput */ \"(app-pages-browser)/./src/components/ChatInput.tsx\");\n/* harmony import */ var _components_Message__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/components/Message */ \"(app-pages-browser)/./src/components/Message.tsx\");\n/**\r\n * StandaloneChatBox.tsx\r\n * 独立聊天框组件 - 提供全页面聊天界面\r\n * \r\n * 作用：\r\n * - 提供全屏聊天体验\r\n * - 管理与LLM的对话状态和流式响应\r\n * - 展示消息历史记录\r\n * - 提供消息输入和发送功能\r\n * - 支持多种媒体格式\r\n * \r\n * 使用场景：\r\n * - 作为主要交互界面，而非辅助功能\r\n * - 需要专注于对话的场景\r\n * - 需要更大空间展示复杂内容的场景\r\n */ /* __next_internal_client_entry_do_not_use__ default auto */ \nvar _s = $RefreshSig$();\n\n\n\n\n/**\r\n * 独立聊天框组件\r\n * 提供全页面聊天界面\r\n * \r\n * @returns {JSX.Element} 渲染的组件\r\n */ const StandaloneChatBox = ()=>{\n    _s();\n    // 使用自定义钩子管理聊天消息状态和操作\n    const { messages, isLoading, sendMessage, clearMessages } = (0,_hooks_useChatMessages__WEBPACK_IMPORTED_MODULE_2__.useChatMessages)();\n    // 创建消息列表底部的引用，用于自动滚动功能\n    const messagesEndRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);\n    /**\r\n   * 滚动到消息列表底部\r\n   * 用于每次新消息到达时保持视图在最新消息上\r\n   */ const scrollToBottom = ()=>{\n        var _messagesEndRef_current;\n        (_messagesEndRef_current = messagesEndRef.current) === null || _messagesEndRef_current === void 0 ? void 0 : _messagesEndRef_current.scrollIntoView({\n            behavior: \"smooth\"\n        });\n    };\n    /**\r\n   * 监听消息列表变化，自动滚动到底部\r\n   * \r\n   * useEffect钩子用于处理副作用，这里用于在消息更新后滚动到底部\r\n   * 依赖数组[messages]表示只有当messages变化时才执行此效果\r\n   */ (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        scrollToBottom();\n    }, [\n        messages\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"flex flex-col h-screen bg-gray-50\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"header\", {\n                className: \"bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h1\", {\n                        className: \"text-xl font-semibold text-gray-800\",\n                        children: \"AI 助手对话\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                        lineNumber: 61,\n                        columnNumber: 9\n                    }, undefined),\n                    messages.length > 0 && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                        onClick: clearMessages,\n                        className: \"text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md hover:bg-gray-100\",\n                        \"aria-label\": \"清空对话\",\n                        tabIndex: 0,\n                        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                            className: \"flex items-center\",\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"svg\", {\n                                    xmlns: \"http://www.w3.org/2000/svg\",\n                                    className: \"h-5 w-5 mr-1\",\n                                    fill: \"none\",\n                                    viewBox: \"0 0 24 24\",\n                                    stroke: \"currentColor\",\n                                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"path\", {\n                                        strokeLinecap: \"round\",\n                                        strokeLinejoin: \"round\",\n                                        strokeWidth: 2,\n                                        d: \"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16\"\n                                    }, void 0, false, {\n                                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                        lineNumber: 79,\n                                        columnNumber: 17\n                                    }, undefined)\n                                }, void 0, false, {\n                                    fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                    lineNumber: 72,\n                                    columnNumber: 15\n                                }, undefined),\n                                \"清空对话\"\n                            ]\n                        }, void 0, true, {\n                            fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                            lineNumber: 71,\n                            columnNumber: 13\n                        }, undefined)\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                        lineNumber: 65,\n                        columnNumber: 11\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                lineNumber: 60,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"main\", {\n                className: \"flex-1 overflow-y-auto p-4 md:p-6 pb-24\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"max-w-3xl mx-auto\",\n                    children: messages.length === 0 ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"bg-white rounded-lg shadow-sm p-6 text-center\",\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h2\", {\n                                className: \"text-2xl font-semibold mb-4\",\n                                children: \"欢迎使用AI助手\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                lineNumber: 98,\n                                columnNumber: 15\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                                className: \"text-gray-600 mb-6\",\n                                children: \"您可以开始向AI提问，支持发送文本、图片和PDF文件。\"\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                lineNumber: 99,\n                                columnNumber: 15\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                className: \"grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto text-left\",\n                                children: [\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"bg-gray-50 p-3 rounded-md\",\n                                        children: [\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                                                className: \"font-medium mb-1\",\n                                                children: \"示例问题\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                                lineNumber: 104,\n                                                columnNumber: 19\n                                            }, undefined),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                                                className: \"text-sm text-gray-600 space-y-1\",\n                                                children: [\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                                        children: \"• 解释量子计算的基本原理\"\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                                        lineNumber: 106,\n                                                        columnNumber: 21\n                                                    }, undefined),\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                                        children: \"• 帮我写一个简单的React组件\"\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                                        lineNumber: 107,\n                                                        columnNumber: 21\n                                                    }, undefined),\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                                        children: \"• 如何制作意大利面？\"\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                                        lineNumber: 108,\n                                                        columnNumber: 21\n                                                    }, undefined)\n                                                ]\n                                            }, void 0, true, {\n                                                fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                                lineNumber: 105,\n                                                columnNumber: 19\n                                            }, undefined)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                        lineNumber: 103,\n                                        columnNumber: 17\n                                    }, undefined),\n                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                        className: \"bg-gray-50 p-3 rounded-md\",\n                                        children: [\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                                                className: \"font-medium mb-1\",\n                                                children: \"功能介绍\"\n                                            }, void 0, false, {\n                                                fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                                lineNumber: 112,\n                                                columnNumber: 19\n                                            }, undefined),\n                                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"ul\", {\n                                                className: \"text-sm text-gray-600 space-y-1\",\n                                                children: [\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                                        children: \"• 支持Markdown格式\"\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                                        lineNumber: 114,\n                                                        columnNumber: 21\n                                                    }, undefined),\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                                        children: \"• 可上传图片和PDF文件\"\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                                        lineNumber: 115,\n                                                        columnNumber: 21\n                                                    }, undefined),\n                                                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"li\", {\n                                                        children: \"• 代码高亮显示\"\n                                                    }, void 0, false, {\n                                                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                                        lineNumber: 116,\n                                                        columnNumber: 21\n                                                    }, undefined)\n                                                ]\n                                            }, void 0, true, {\n                                                fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                                lineNumber: 113,\n                                                columnNumber: 19\n                                            }, undefined)\n                                        ]\n                                    }, void 0, true, {\n                                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                        lineNumber: 111,\n                                        columnNumber: 17\n                                    }, undefined)\n                                ]\n                            }, void 0, true, {\n                                fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                lineNumber: 102,\n                                columnNumber: 15\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                        lineNumber: 97,\n                        columnNumber: 13\n                    }, undefined) : // 消息列表\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"space-y-4\",\n                        children: [\n                            messages.map((msg)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_Message__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n                                    message: msg\n                                }, msg.id, false, {\n                                    fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                    lineNumber: 125,\n                                    columnNumber: 17\n                                }, undefined)),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                                ref: messagesEndRef\n                            }, void 0, false, {\n                                fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                                lineNumber: 127,\n                                columnNumber: 15\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                        lineNumber: 123,\n                        columnNumber: 13\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                    lineNumber: 94,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                lineNumber: 93,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"footer\", {\n                className: \"fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    className: \"max-w-3xl mx-auto\",\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_ChatInput__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n                        isLoading: isLoading,\n                        onSendMessage: sendMessage,\n                        initialFocus: true,\n                        placeholder: \"输入您的问题...\"\n                    }, void 0, false, {\n                        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                        lineNumber: 136,\n                        columnNumber: 11\n                    }, undefined)\n                }, void 0, false, {\n                    fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                    lineNumber: 135,\n                    columnNumber: 9\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n                lineNumber: 134,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true, {\n        fileName: \"C:\\\\Users\\\\plenty_seafood\\\\Desktop\\\\LLM_chatbox\\\\src\\\\components\\\\StandaloneChatBox.tsx\",\n        lineNumber: 58,\n        columnNumber: 5\n    }, undefined);\n};\n_s(StandaloneChatBox, \"Fr9/Imyk9DhRBBsXQX4pwLAyjDA=\", false, function() {\n    return [\n        _hooks_useChatMessages__WEBPACK_IMPORTED_MODULE_2__.useChatMessages\n    ];\n});\n_c = StandaloneChatBox;\n/* harmony default export */ __webpack_exports__[\"default\"] = (StandaloneChatBox);\nvar _c;\n$RefreshReg$(_c, \"StandaloneChatBox\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL3NyYy9jb21wb25lbnRzL1N0YW5kYWxvbmVDaGF0Qm94LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztDQWVDOztBQUl5QztBQUVnQjtBQUN0QjtBQUNPO0FBRTNDOzs7OztDQUtDLEdBQ0QsTUFBTUssb0JBQThCOztJQUNsQyxxQkFBcUI7SUFDckIsTUFBTSxFQUFFQyxRQUFRLEVBQUVDLFNBQVMsRUFBRUMsV0FBVyxFQUFFQyxhQUFhLEVBQUUsR0FBR1AsdUVBQWVBO0lBRTNFLHVCQUF1QjtJQUN2QixNQUFNUSxpQkFBaUJWLDZDQUFNQSxDQUFpQjtJQUU5Qzs7O0dBR0MsR0FDRCxNQUFNVyxpQkFBaUI7WUFDckJEO1NBQUFBLDBCQUFBQSxlQUFlRSxPQUFPLGNBQXRCRiw4Q0FBQUEsd0JBQXdCRyxjQUFjLENBQUM7WUFBRUMsVUFBVTtRQUFTO0lBQzlEO0lBRUE7Ozs7O0dBS0MsR0FDRGIsZ0RBQVNBLENBQUM7UUFDUlU7SUFDRixHQUFHO1FBQUNMO0tBQVM7SUFFYixxQkFDRSw4REFBQ1M7UUFBSUMsV0FBVTs7MEJBRWIsOERBQUNDO2dCQUFPRCxXQUFVOztrQ0FDaEIsOERBQUNFO3dCQUFHRixXQUFVO2tDQUFzQzs7Ozs7O29CQUduRFYsU0FBU2EsTUFBTSxHQUFHLG1CQUNqQiw4REFBQ0M7d0JBQ0NDLFNBQVNaO3dCQUNUTyxXQUFVO3dCQUNWTSxjQUFXO3dCQUNYQyxVQUFVO2tDQUVWLDRFQUFDUjs0QkFBSUMsV0FBVTs7OENBQ2IsOERBQUNRO29DQUNDQyxPQUFNO29DQUNOVCxXQUFVO29DQUNWVSxNQUFLO29DQUNMQyxTQUFRO29DQUNSQyxRQUFPOzhDQUVQLDRFQUFDQzt3Q0FDQ0MsZUFBYzt3Q0FDZEMsZ0JBQWU7d0NBQ2ZDLGFBQWE7d0NBQ2JDLEdBQUU7Ozs7Ozs7Ozs7O2dDQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBUWQsOERBQUNDO2dCQUFLbEIsV0FBVTswQkFDZCw0RUFBQ0Q7b0JBQUlDLFdBQVU7OEJBRVpWLFNBQVNhLE1BQU0sS0FBSyxrQkFDbkIsOERBQUNKO3dCQUFJQyxXQUFVOzswQ0FDYiw4REFBQ21CO2dDQUFHbkIsV0FBVTswQ0FBOEI7Ozs7OzswQ0FDNUMsOERBQUNvQjtnQ0FBRXBCLFdBQVU7MENBQXFCOzs7Ozs7MENBR2xDLDhEQUFDRDtnQ0FBSUMsV0FBVTs7a0RBQ2IsOERBQUNEO3dDQUFJQyxXQUFVOzswREFDYiw4REFBQ3FCO2dEQUFHckIsV0FBVTswREFBbUI7Ozs7OzswREFDakMsOERBQUNzQjtnREFBR3RCLFdBQVU7O2tFQUNaLDhEQUFDdUI7a0VBQUc7Ozs7OztrRUFDSiw4REFBQ0E7a0VBQUc7Ozs7OztrRUFDSiw4REFBQ0E7a0VBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7OztrREFHUiw4REFBQ3hCO3dDQUFJQyxXQUFVOzswREFDYiw4REFBQ3FCO2dEQUFHckIsV0FBVTswREFBbUI7Ozs7OzswREFDakMsOERBQUNzQjtnREFBR3RCLFdBQVU7O2tFQUNaLDhEQUFDdUI7a0VBQUc7Ozs7OztrRUFDSiw4REFBQ0E7a0VBQUc7Ozs7OztrRUFDSiw4REFBQ0E7a0VBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29DQU1aLE9BQU87a0NBQ1AsOERBQUN4Qjt3QkFBSUMsV0FBVTs7NEJBQ1pWLFNBQVNrQyxHQUFHLENBQUMsQ0FBQ0Msb0JBQ2IsOERBQUNyQywyREFBT0E7b0NBQWNzQyxTQUFTRDttQ0FBakJBLElBQUlFLEVBQUU7Ozs7OzBDQUV0Qiw4REFBQzVCO2dDQUFJNkIsS0FBS2xDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBCQU9sQiw4REFBQ21DO2dCQUFPN0IsV0FBVTswQkFDaEIsNEVBQUNEO29CQUFJQyxXQUFVOzhCQUNiLDRFQUFDYixrREFBU0E7d0JBQ1JJLFdBQVdBO3dCQUNYdUMsZUFBZXRDO3dCQUNmdUMsY0FBYzt3QkFDZEMsYUFBWTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU14QjtHQWxITTNDOztRQUV3REgsbUVBQWVBOzs7S0FGdkVHO0FBb0hOLCtEQUFlQSxpQkFBaUJBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vc3JjL2NvbXBvbmVudHMvU3RhbmRhbG9uZUNoYXRCb3gudHN4P2EzNDQiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIFN0YW5kYWxvbmVDaGF0Qm94LnRzeFxyXG4gKiDni6znq4vogYrlpKnmoYbnu4Tku7YgLSDmj5DkvpvlhajpobXpnaLogYrlpKnnlYzpnaJcclxuICogXHJcbiAqIOS9nOeUqO+8mlxyXG4gKiAtIOaPkOS+m+WFqOWxj+iBiuWkqeS9k+mqjFxyXG4gKiAtIOeuoeeQhuS4jkxMTeeahOWvueivneeKtuaAgeWSjOa1geW8j+WTjeW6lFxyXG4gKiAtIOWxleekuua2iOaBr+WOhuWPsuiusOW9lVxyXG4gKiAtIOaPkOS+m+a2iOaBr+i+k+WFpeWSjOWPkemAgeWKn+iDvVxyXG4gKiAtIOaUr+aMgeWkmuenjeWqkuS9k+agvOW8j1xyXG4gKiBcclxuICog5L2/55So5Zy65pmv77yaXHJcbiAqIC0g5L2c5Li65Li76KaB5Lqk5LqS55WM6Z2i77yM6ICM6Z2e6L6F5Yqp5Yqf6IO9XHJcbiAqIC0g6ZyA6KaB5LiT5rOo5LqO5a+56K+d55qE5Zy65pmvXHJcbiAqIC0g6ZyA6KaB5pu05aSn56m66Ze05bGV56S65aSN5p2C5YaF5a6555qE5Zy65pmvXHJcbiAqL1xyXG5cclxuXCJ1c2UgY2xpZW50XCI7XHJcblxyXG5pbXBvcnQgeyB1c2VSZWYsIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgeyBNZXNzYWdlIGFzIE1lc3NhZ2VUeXBlLCBNZWRpYUNvbnRlbnQgfSBmcm9tIFwiQC90eXBlcy9jaGF0XCI7XHJcbmltcG9ydCB7IHVzZUNoYXRNZXNzYWdlcyB9IGZyb20gXCJAL2hvb2tzL3VzZUNoYXRNZXNzYWdlc1wiO1xyXG5pbXBvcnQgQ2hhdElucHV0IGZyb20gXCIuL0NoYXRJbnB1dFwiO1xyXG5pbXBvcnQgTWVzc2FnZSBmcm9tIFwiQC9jb21wb25lbnRzL01lc3NhZ2VcIjtcclxuXHJcbi8qKlxyXG4gKiDni6znq4vogYrlpKnmoYbnu4Tku7ZcclxuICog5o+Q5L6b5YWo6aG16Z2i6IGK5aSp55WM6Z2iXHJcbiAqIFxyXG4gKiBAcmV0dXJucyB7SlNYLkVsZW1lbnR9IOa4suafk+eahOe7hOS7tlxyXG4gKi9cclxuY29uc3QgU3RhbmRhbG9uZUNoYXRCb3g6IFJlYWN0LkZDID0gKCkgPT4ge1xyXG4gIC8vIOS9v+eUqOiHquWumuS5iemSqeWtkOeuoeeQhuiBiuWkqea2iOaBr+eKtuaAgeWSjOaTjeS9nFxyXG4gIGNvbnN0IHsgbWVzc2FnZXMsIGlzTG9hZGluZywgc2VuZE1lc3NhZ2UsIGNsZWFyTWVzc2FnZXMgfSA9IHVzZUNoYXRNZXNzYWdlcygpO1xyXG5cclxuICAvLyDliJvlu7rmtojmga/liJfooajlupXpg6jnmoTlvJXnlKjvvIznlKjkuo7oh6rliqjmu5rliqjlip/og71cclxuICBjb25zdCBtZXNzYWdlc0VuZFJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIOa7muWKqOWIsOa2iOaBr+WIl+ihqOW6lemDqFxyXG4gICAqIOeUqOS6juavj+asoeaWsOa2iOaBr+WIsOi+vuaXtuS/neaMgeinhuWbvuWcqOacgOaWsOa2iOaBr+S4ilxyXG4gICAqL1xyXG4gIGNvbnN0IHNjcm9sbFRvQm90dG9tID0gKCkgPT4ge1xyXG4gICAgbWVzc2FnZXNFbmRSZWYuY3VycmVudD8uc2Nyb2xsSW50b1ZpZXcoeyBiZWhhdmlvcjogXCJzbW9vdGhcIiB9KTtcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiDnm5HlkKzmtojmga/liJfooajlj5jljJbvvIzoh6rliqjmu5rliqjliLDlupXpg6hcclxuICAgKiBcclxuICAgKiB1c2VFZmZlY3TpkqnlrZDnlKjkuo7lpITnkIblia/kvZznlKjvvIzov5nph4znlKjkuo7lnKjmtojmga/mm7TmlrDlkI7mu5rliqjliLDlupXpg6hcclxuICAgKiDkvp3otZbmlbDnu4RbbWVzc2FnZXNd6KGo56S65Y+q5pyJ5b2TbWVzc2FnZXPlj5jljJbml7bmiY3miafooYzmraTmlYjmnpxcclxuICAgKi9cclxuICB1c2VFZmZlY3QoKCkgPT4ge1xyXG4gICAgc2Nyb2xsVG9Cb3R0b20oKTtcclxuICB9LCBbbWVzc2FnZXNdKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBmbGV4LWNvbCBoLXNjcmVlbiBiZy1ncmF5LTUwXCI+XHJcbiAgICAgIHsvKiDpobbpg6jlr7zoiKrmoI8gKi99XHJcbiAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiYmctd2hpdGUgYm9yZGVyLWIgYm9yZGVyLWdyYXktMjAwIHB4LTQgcHktMyBmbGV4IGp1c3RpZnktYmV0d2VlbiBpdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICA8aDEgY2xhc3NOYW1lPVwidGV4dC14bCBmb250LXNlbWlib2xkIHRleHQtZ3JheS04MDBcIj5BSSDliqnmiYvlr7nor508L2gxPlxyXG5cclxuICAgICAgICB7Lyog5riF56m65a+56K+d5oyJ6ZKuICovfVxyXG4gICAgICAgIHttZXNzYWdlcy5sZW5ndGggPiAwICYmIChcclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgb25DbGljaz17Y2xlYXJNZXNzYWdlc31cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTUwMCBob3Zlcjp0ZXh0LWdyYXktNzAwIHB4LTMgcHktMSByb3VuZGVkLW1kIGhvdmVyOmJnLWdyYXktMTAwXCJcclxuICAgICAgICAgICAgYXJpYS1sYWJlbD1cIua4heepuuWvueivnVwiXHJcbiAgICAgICAgICAgIHRhYkluZGV4PXswfVxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgPHN2Z1xyXG4gICAgICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJoLTUgdy01IG1yLTFcIlxyXG4gICAgICAgICAgICAgICAgZmlsbD1cIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXHJcbiAgICAgICAgICAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxwYXRoXHJcbiAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXHJcbiAgICAgICAgICAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxyXG4gICAgICAgICAgICAgICAgICBzdHJva2VXaWR0aD17Mn1cclxuICAgICAgICAgICAgICAgICAgZD1cIk0xOSA3bC0uODY3IDEyLjE0MkEyIDIgMCAwMTE2LjEzOCAyMUg3Ljg2MmEyIDIgMCAwMS0xLjk5NS0xLjg1OEw1IDdtNSA0djZtNC02djZtMS0xMFY0YTEgMSAwIDAwLTEtMWgtNGExIDEgMCAwMC0xIDF2M000IDdoMTZcIlxyXG4gICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgICDmuIXnqbrlr7nor51cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICApfVxyXG4gICAgICA8L2hlYWRlcj5cclxuXHJcbiAgICAgIHsvKiDkuLvkvZPlhoXlrrkgKi99XHJcbiAgICAgIDxtYWluIGNsYXNzTmFtZT1cImZsZXgtMSBvdmVyZmxvdy15LWF1dG8gcC00IG1kOnAtNiBwYi0yNFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWF4LXctM3hsIG14LWF1dG9cIj5cclxuICAgICAgICAgIHsvKiDmrKLov47mtojmga8gKi99XHJcbiAgICAgICAgICB7bWVzc2FnZXMubGVuZ3RoID09PSAwID8gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJnLXdoaXRlIHJvdW5kZWQtbGcgc2hhZG93LXNtIHAtNiB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgIDxoMiBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBmb250LXNlbWlib2xkIG1iLTRcIj7mrKLov47kvb/nlKhBSeWKqeaJizwvaDI+XHJcbiAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTYwMCBtYi02XCI+XHJcbiAgICAgICAgICAgICAgICDmgqjlj6/ku6XlvIDlp4vlkJFBSeaPkOmXru+8jOaUr+aMgeWPkemAgeaWh+acrOOAgeWbvueJh+WSjFBERuaWh+S7tuOAglxyXG4gICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgZ3JpZC1jb2xzLTEgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTQgbWF4LXctbWQgbXgtYXV0byB0ZXh0LWxlZnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmctZ3JheS01MCBwLTMgcm91bmRlZC1tZFwiPlxyXG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiZm9udC1tZWRpdW0gbWItMVwiPuekuuS+i+mXrumimDwvaDM+XHJcbiAgICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJ0ZXh0LXNtIHRleHQtZ3JheS02MDAgc3BhY2UteS0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPuKAoiDop6Pph4rph4/lrZDorqHnrpfnmoTln7rmnKzljp/nkIY8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT7igKIg5biu5oiR5YaZ5LiA5Liq566A5Y2V55qEUmVhY3Tnu4Tku7Y8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT7igKIg5aaC5L2V5Yi25L2c5oSP5aSn5Yip6Z2i77yfPC9saT5cclxuICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZy1ncmF5LTUwIHAtMyByb3VuZGVkLW1kXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmb250LW1lZGl1bSBtYi0xXCI+5Yqf6IO95LuL57uNPC9oMz5cclxuICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTYwMCBzcGFjZS15LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+4oCiIOaUr+aMgU1hcmtkb3du5qC85byPPC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+4oCiIOWPr+S4iuS8oOWbvueJh+WSjFBERuaWh+S7tjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPuKAoiDku6PnoIHpq5jkuq7mmL7npLo8L2xpPlxyXG4gICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgLy8g5raI5oGv5YiX6KGoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic3BhY2UteS00XCI+XHJcbiAgICAgICAgICAgICAge21lc3NhZ2VzLm1hcCgobXNnOiBNZXNzYWdlVHlwZSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgPE1lc3NhZ2Uga2V5PXttc2cuaWR9IG1lc3NhZ2U9e21zZ30gLz5cclxuICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICA8ZGl2IHJlZj17bWVzc2FnZXNFbmRSZWZ9IC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgKX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9tYWluPlxyXG5cclxuICAgICAgey8qIOW6lemDqOi+k+WFpeahhiAqL31cclxuICAgICAgPGZvb3RlciBjbGFzc05hbWU9XCJmaXhlZCBib3R0b20tMCBsZWZ0LTAgcmlnaHQtMCBiZy13aGl0ZSBib3JkZXItdCBib3JkZXItZ3JheS0yMDAgcC00XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy0zeGwgbXgtYXV0b1wiPlxyXG4gICAgICAgICAgPENoYXRJbnB1dFxyXG4gICAgICAgICAgICBpc0xvYWRpbmc9e2lzTG9hZGluZ31cclxuICAgICAgICAgICAgb25TZW5kTWVzc2FnZT17c2VuZE1lc3NhZ2V9XHJcbiAgICAgICAgICAgIGluaXRpYWxGb2N1cz17dHJ1ZX1cclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLovpPlhaXmgqjnmoTpl67popguLi5cIlxyXG4gICAgICAgICAgLz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9mb290ZXI+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3RhbmRhbG9uZUNoYXRCb3g7XHJcbiJdLCJuYW1lcyI6WyJ1c2VSZWYiLCJ1c2VFZmZlY3QiLCJ1c2VDaGF0TWVzc2FnZXMiLCJDaGF0SW5wdXQiLCJNZXNzYWdlIiwiU3RhbmRhbG9uZUNoYXRCb3giLCJtZXNzYWdlcyIsImlzTG9hZGluZyIsInNlbmRNZXNzYWdlIiwiY2xlYXJNZXNzYWdlcyIsIm1lc3NhZ2VzRW5kUmVmIiwic2Nyb2xsVG9Cb3R0b20iLCJjdXJyZW50Iiwic2Nyb2xsSW50b1ZpZXciLCJiZWhhdmlvciIsImRpdiIsImNsYXNzTmFtZSIsImhlYWRlciIsImgxIiwibGVuZ3RoIiwiYnV0dG9uIiwib25DbGljayIsImFyaWEtbGFiZWwiLCJ0YWJJbmRleCIsInN2ZyIsInhtbG5zIiwiZmlsbCIsInZpZXdCb3giLCJzdHJva2UiLCJwYXRoIiwic3Ryb2tlTGluZWNhcCIsInN0cm9rZUxpbmVqb2luIiwic3Ryb2tlV2lkdGgiLCJkIiwibWFpbiIsImgyIiwicCIsImgzIiwidWwiLCJsaSIsIm1hcCIsIm1zZyIsIm1lc3NhZ2UiLCJpZCIsInJlZiIsImZvb3RlciIsIm9uU2VuZE1lc3NhZ2UiLCJpbml0aWFsRm9jdXMiLCJwbGFjZWhvbGRlciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(app-pages-browser)/./src/components/StandaloneChatBox.tsx\n"));

/***/ })

});