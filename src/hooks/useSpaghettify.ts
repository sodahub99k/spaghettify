import Module from "../wasm/spaghettify.js";
import { useState, useEffect } from "react";

export const useSpaghettify = () => {
  const [module, setModule] = useState<any>(null);

  useEffect(() => {
    const loadModule = async () => {
      // ES Module版は関数を呼び出して初期化完了を待つ
      const mod = await Module();
      setModule(mod);
    };
    loadModule();
  }, []);

  const spaghettifyStr = (input: string): string => {
    if (!module) throw new Error("WASM module not loaded yet");

    const spaghettify_c = module.cwrap("spaghettify_str_c", "number", ["string"]);
    const free = module.cwrap("free_string", "void", ["number"]);

    const ptr = spaghettify_c(input);
    const result = module.UTF8ToString(ptr);
    free(ptr);

    return result;
  };

  return { module, spaghettifyStr };
};
