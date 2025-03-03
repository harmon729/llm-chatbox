import { describe, it, expect } from "vitest";
import {
  isCodeBlock,
  getLanguageFromCodeBlock,
  extractCodeContent,
  splitTextByCodeBlocks,
  containsMarkdown,
  extractTextFromMarkdown,
} from "../../utils/markdownUtils";

describe("markdownUtils", () => {
  describe("isCodeBlock", () => {
    it("应该识别包含代码块的文本", () => {
      const withCodeBlock = "这里有代码：\n```js\nconst x = 1;\n```";
      expect(isCodeBlock(withCodeBlock)).toBe(true);
    });

    it("应该识别出多行代码块", () => {
      const multiLineCodeBlock = "代码块：\n```\nline1\nline2\nline3\n```";
      expect(isCodeBlock(multiLineCodeBlock)).toBe(true);
    });

    it("应该正确处理连续的代码块", () => {
      const consecutiveCodeBlocks =
        "```js\nconst x = 1;\n```\n普通文本\n```python\nprint('hello')\n```";
      expect(isCodeBlock(consecutiveCodeBlocks)).toBe(true);
    });

    it("应该识别出不包含代码块的文本", () => {
      const withoutCodeBlock = "这是普通文本，没有代码块，只有一个 `行内代码`";
      expect(isCodeBlock(withoutCodeBlock)).toBe(false);
    });

    it("应该处理不完整的代码块标记", () => {
      const incompleteCodeBlock = "这是不完整的代码块 ```js\nconst x = 1;";
      expect(isCodeBlock(incompleteCodeBlock)).toBe(false);
    });
  });

  describe("getLanguageFromCodeBlock", () => {
    it("应该从代码块中提取语言", () => {
      const jsCodeBlock = "```javascript\nconst x = 1;\n```";
      const tsCodeBlock = "```typescript\nconst x: number = 1;\n```";
      const pythonCodeBlock = "```python\nprint('hello')\n```";

      expect(getLanguageFromCodeBlock(jsCodeBlock)).toBe("javascript");
      expect(getLanguageFromCodeBlock(tsCodeBlock)).toBe("typescript");
      expect(getLanguageFromCodeBlock(pythonCodeBlock)).toBe("python");
    });

    it("应该处理没有指定语言的代码块", () => {
      const noLanguageCodeBlock = "```\nsome code\n```";
      expect(getLanguageFromCodeBlock(noLanguageCodeBlock)).toBe("");
    });

    it("应该处理语言名称后有空格的情况", () => {
      const langWithSpace = "```javascript \nconst x = 1;\n```";
      expect(getLanguageFromCodeBlock(langWithSpace)).toBe("");
    });

    it("应该确保语言名称转为小写", () => {
      const upperCaseLang = "```JAVASCRIPT\nconst x = 1;\n```";
      expect(getLanguageFromCodeBlock(upperCaseLang)).toBe("javascript");
    });
  });

  describe("extractCodeContent", () => {
    it("应该提取代码块内容，不包含反引号和语言标记", () => {
      const codeBlock = "```javascript\nconst x = 1;\nconsole.log(x);\n```";
      const expectedContent = "const x = 1;\nconsole.log(x);";
      expect(extractCodeContent(codeBlock)).toBe(expectedContent);
    });

    it("应该处理多行代码", () => {
      const multiLineCodeBlock = "```\nline1\nline2\nline3\n```";
      const expectedContent = "line1\nline2\nline3";
      expect(extractCodeContent(multiLineCodeBlock)).toBe(expectedContent);
    });

    it("应该处理没有内容的代码块", () => {
      const emptyCodeBlock = "```js\n```";
      expect(extractCodeContent(emptyCodeBlock)).toBe("");
    });

    it("应该处理只有语言标记没有内容的代码块", () => {
      const languageOnlyCodeBlock = "```javascript\n```";
      expect(extractCodeContent(languageOnlyCodeBlock)).toBe("");
    });
  });

  describe("splitTextByCodeBlocks", () => {
    it("应该将文本分割为代码块和非代码块部分", () => {
      const mixedText = "文本开始\n```javascript\nconst x = 1;\n```\n文本结束";
      const expectedParts = [
        { type: "text", content: "文本开始\n" },
        { type: "code", content: "const x = 1;\n", language: "javascript" },
        { type: "text", content: "\n文本结束" },
      ];
      expect(splitTextByCodeBlocks(mixedText)).toEqual(expectedParts);
    });

    it("应该处理只有文本的情况", () => {
      const textOnly = "这里只有普通文本，没有代码块";
      const expectedParts = [{ type: "text", content: textOnly }];
      expect(splitTextByCodeBlocks(textOnly)).toEqual(expectedParts);
    });

    it("应该处理只有代码块的情况", () => {
      const codeBlockOnly = "```javascript\nconst x = 1;\n```";
      const expectedParts = [
        { type: "code", content: "const x = 1;\n", language: "javascript" },
      ];
      expect(splitTextByCodeBlocks(codeBlockOnly)).toEqual(expectedParts);
    });

    it("应该处理多个连续代码块", () => {
      const multipleCodes =
        "```js\nconst x = 1;\n```\n```python\nprint('hello')\n```";
      const expectedParts = [
        { type: "code", content: "const x = 1;\n", language: "js" },
        { type: "text", content: "\n" },
        { type: "code", content: "print('hello')\n", language: "python" },
      ];
      expect(splitTextByCodeBlocks(multipleCodes)).toEqual(expectedParts);
    });

    it("应该将没有指定语言的代码块设置为plaintext", () => {
      const noLangCode = "```\nsome code\n```";
      const expectedParts = [
        { type: "code", content: "some code\n", language: "plaintext" },
      ];
      expect(splitTextByCodeBlocks(noLangCode)).toEqual(expectedParts);
    });
  });

  describe("containsMarkdown", () => {
    it("应该识别标题语法", () => {
      expect(containsMarkdown("# 一级标题")).toBe(true);
      expect(containsMarkdown("## 二级标题")).toBe(true);
      expect(containsMarkdown("### 三级标题 ###")).toBe(true);
    });

    it("应该识别强调语法（粗体、斜体）", () => {
      expect(containsMarkdown("这是**粗体**文本")).toBe(true);
      expect(containsMarkdown("这是__粗体__文本")).toBe(true);
      expect(containsMarkdown("这是*斜体*文本")).toBe(true);
      expect(containsMarkdown("这是_斜体_文本")).toBe(true);
    });

    it("应该识别代码语法", () => {
      expect(containsMarkdown("这是`行内代码`文本")).toBe(true);
      expect(containsMarkdown("这是代码块：\n```js\nconst x = 1;\n```")).toBe(
        true
      );
    });

    it("应该识别链接和图片", () => {
      expect(containsMarkdown("[链接文本](https://example.com)")).toBe(true);
      expect(containsMarkdown("![图片描述](image.jpg)")).toBe(true);
    });

    it("应该识别列表", () => {
      expect(containsMarkdown("- 无序列表项1")).toBe(true);
      expect(containsMarkdown("* 无序列表项2")).toBe(true);
      expect(containsMarkdown("+ 无序列表项3")).toBe(true);
      expect(containsMarkdown("1. 有序列表项1")).toBe(true);
    });

    it("应该识别引用", () => {
      expect(containsMarkdown("> 这是引用文本")).toBe(true);
      expect(containsMarkdown("> > 这是嵌套引用")).toBe(true);
    });

    it("应该识别表格", () => {
      expect(
        containsMarkdown("| 表头 | 表头 |\n|------|------|\n| 内容 | 内容 |")
      ).toBe(true);
    });

    it("应该识别删除线", () => {
      expect(containsMarkdown("~~删除线文本~~")).toBe(true);
    });

    it("应该识别普通文本", () => {
      expect(containsMarkdown("这是普通文本，没有Markdown语法")).toBe(false);
    });

    it("应该处理空文本", () => {
      expect(containsMarkdown("")).toBe(false);
      expect(containsMarkdown("  ")).toBe(false);
      expect(containsMarkdown(null as any)).toBe(false);
      expect(containsMarkdown(undefined as any)).toBe(false);
    });
  });

  describe("extractTextFromMarkdown", () => {
    it("应该从标题中提取文本", () => {
      expect(extractTextFromMarkdown("# 一级标题")).toBe("一级标题");
      expect(extractTextFromMarkdown("## 二级标题")).toBe("二级标题");
    });

    it("应该从强调语法中提取文本", () => {
      expect(extractTextFromMarkdown("这是**粗体**文本")).toBe("这是粗体文本");
      expect(extractTextFromMarkdown("这是__粗体__文本")).toBe("这是粗体文本");
      expect(extractTextFromMarkdown("这是*斜体*文本")).toBe("这是斜体文本");
      expect(extractTextFromMarkdown("这是_斜体_文本")).toBe("这是斜体文本");
    });

    it("应该从行内代码中提取文本", () => {
      expect(extractTextFromMarkdown("这是`行内代码`文本")).toBe(
        "这是行内代码文本"
      );
    });

    it("应该移除代码块", () => {
      expect(
        extractTextFromMarkdown("文本前\n```js\nconst x = 1;\n```\n文本后")
      ).toBe("文本前 文本后");
    });

    it("应该从链接中提取文本但移除图片", () => {
      expect(extractTextFromMarkdown("[链接文本](https://example.com)")).toBe(
        "链接文本"
      );
      expect(extractTextFromMarkdown("![图片描述](image.jpg)")).toBe("");
    });

    it("应该从列表中提取文本", () => {
      expect(extractTextFromMarkdown("- 无序列表项")).toBe("无序列表项");
      expect(extractTextFromMarkdown("1. 有序列表项")).toBe("有序列表项");
    });

    it("应该从引用中提取文本", () => {
      expect(extractTextFromMarkdown("> 引用文本")).toBe("引用文本");
    });

    it("应该从表格中提取文本", () => {
      expect(
        extractTextFromMarkdown(
          "| 表头 | 表头 |\n|------|------|\n| 内容 | 内容 |"
        )
      ).toBe("表头 表头 ------------ 内容 内容 |");
    });

    it("应该从删除线中提取文本", () => {
      expect(extractTextFromMarkdown("~~删除线文本~~")).toBe("删除线文本");
    });

    it("应该处理复杂的混合Markdown", () => {
      const complexMarkdown = `
# 标题
这是**粗体**和*斜体*文本。
> 这是引用。

\`\`\`js
const x = 1;
console.log(x);
\`\`\`

- 列表项1
- 列表项2

[链接](https://example.com)
![图片](image.jpg)
`;
      const expectedText =
        "标题 这是粗体和斜体文本。 这是引用。 列表项1 列表项2 链接";
      expect(extractTextFromMarkdown(complexMarkdown)).toBe(expectedText);
    });

    it("应该处理空文本", () => {
      expect(extractTextFromMarkdown("")).toBe("");
      expect(extractTextFromMarkdown(null as any)).toBe("");
      expect(extractTextFromMarkdown(undefined as any)).toBe("");
    });
  });
});
