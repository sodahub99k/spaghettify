import React, { useState, useRef } from "react";
import Editor, { loader } from "@monaco-editor/react";
import { useSpaghettify } from "./hooks/useSpaghettify";

const DEFAULT_CODE = String.raw`#define MAXLEN 60

#include <stdio.h>
#include <ctype.h>

void main(void)
{
    int c;
    int i = 0, j = 0;
    int sum = 0;
    int count, cnt;
    int num[MAXLEN];
    char letter[MAXLEN];

    while ((c = getchar()) != '+')
    {
        if (isalpha(c))
        {
            letter[i++] = c;
        }
        else if (isdigit(c))
        {
            num[j++] = c - '0';
        }
    }

    printf("Characters are ");
    for (count = 0; count < i; ++count)
    {
        printf("%c", letter[count]);
    }

    printf("\nSum of Digits is ");
    for (cnt = 0; cnt < j; ++cnt)
    {
        sum += num[cnt];
    }

    printf("%d\n", sum);
}
`;

const theme = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "keyword", foreground: "f92672" },
    { token: "identifier", foreground: "66d9ef" },
    { token: "number", foreground: "ae81ff" },
    { token: "string", foreground: "e6db74" },
    { token: "comment", foreground: "75715e" },
  ],
  colors: {
    "editor.background": "#272822",
    "editor.foreground": "#f8f8f2",
    "editorLineNumber.foreground": "#75715e",
    "editorCursor.foreground": "#f8f8f0",
    "editor.selectionBackground": "#49483e",
    "editor.inactiveSelectionBackground": "#3e3d32",
  },
};


loader.init().then((monaco) => {
  monaco.editor.defineTheme("oneMonokai", theme as any);
});
const App: React.FC = () => {
  const { spaghettifyStr, module } = useSpaghettify();
  const [input, setInput] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState("");

  const leftEditorRef = useRef<any>(null);
  const rightEditorRef = useRef<any>(null);
  const syncingRef = useRef(false);
  const [toastVisible, setToastVisible] = useState(false);

  const convertAndCopy = () => {
    if (!module) return;
    let out = "";
    try {
      out = spaghettifyStr(input);
    } catch {
      out = "";
    }
    setOutput(out);
    navigator.clipboard.writeText(out);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-[#0e0e0e] via-[#121212] to-[#101820] text-white font-sans p-6 flex flex-col gap-2">

      {/* ---- Header ---- */}
      <header className="max-w-4xl w-full mx-auto text-center mb-4">
        <h1 className="flex justify-center items-center gap-6 text-3xl font-bold tracking-wide mb-2 drop-shadow-md">
          逆フォーマッター "Spaghettify" 🍝
          <span className="text-base font-medium text-gray-300 flex items-baseline gap-1">
            <span className="text-sm">by</span>
            <a
              href="https://sodahub99k.github.io"
              className="text-sm text-emerald-400 hover:text-emerald-300 transition"
            >
              soda
            </a>
          </span>
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed">
          フォーマッターの逆で，C言語を実行可能なまま読みにくくするツール <a href="https://github.com/sodahub99k/spaghettify" className=" text-emerald-400 hover:text-emerald-300 transition">spaghettify</a>のWASM版を試せるデモサイト．
          <br />
          c++/flexでコードをトークンに分割し，bisonで文法に影響のない部分にランダムな空白or改行を挿入しつつコードに再変換する．
        </p>
      </header>


      {/* ---- Main Panel ---- */}
      <main className="flex-1 flex flex-col md:flex-row w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl bg-[#1c1c1c]/70 backdrop-blur-md border border-white/10">

        {/* Input Panel */}
        <section className="w-full md:w-1/2 flex flex-col border-b md:border-b-0 md:border-r border-white/10">
          <div className="px-4 py-3 bg-[#232323]/70 backdrop-blur-sm border-b border-white/10 font-semibold text-emerald-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>Input
          </div>
          <Editor
            height="100%"
            defaultLanguage="c"
            value={input}
            onChange={(val) => setInput(val || "")}
            theme="oneMonokai"
            options={{
              // readOnly: true,
              fontSize: 14,
              minimap: { enabled: false },
              scrollbar: { vertical: "hidden", horizontal: "hidden" },
              renderLineHighlight: "all",
            }}
            onMount={(editor) => {
              leftEditorRef.current = editor;
              editor.onDidScrollChange(() => {
                if (syncingRef.current) return;
                const right = rightEditorRef.current;
                if (right) {
                  syncingRef.current = true;
                  right.setScrollTop(editor.getScrollTop());
                  setTimeout(() => (syncingRef.current = false), 0);
                }
              });
            }}
          />
        </section>

        {/* Output Panel */}
        <section className="w-full md:w-1/2 flex flex-col relative">
          <div className="px-4 py-3 bg-[#232323]/70 backdrop-blur-sm border-b border-white/10 font-semibold text-emerald-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>Output
          </div>
          <Editor
            height="100%"
            defaultLanguage="c"
            value={output}
            theme="oneMonokai"
            options={{
              // readOnly: true,
              fontSize: 14,
              minimap: { enabled: false },
              scrollbar: { vertical: "hidden", horizontal: "hidden" },
              wordWrap: "on",
              renderLineHighlight: "all",
            }}
            onMount={(editor) => {
              rightEditorRef.current = editor;
              editor.onDidScrollChange(() => {
                if (syncingRef.current) return;
                const left = leftEditorRef.current;
                if (left) {
                  syncingRef.current = true;
                  left.setScrollTop(editor.getScrollTop());
                  setTimeout(() => (syncingRef.current = false), 0);
                }
              });
            }}
          />
        </section>

        {/* Action Button */}
        <button
          onClick={convertAndCopy}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
            px-8 py-3 rounded-xl shadow-lg font-semibold text-lg
            bg-emerald-600/80 backdrop-blur hover:bg-emerald-500/90
            transition active:scale-95 border border-white/10">
          変換 & コピー
        </button>

        {/* Toast */}
        <div
          className={`absolute left-1/2 bottom-6 -translate-x-1/2 px-4 py-2 rounded-lg bg-black/70 backdrop-blur shadow-lg text-sm transition-all duration-300
            ${toastVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          ✅ コピーしました
        </div>

      </main>
    </div>
  );
};

export default App;