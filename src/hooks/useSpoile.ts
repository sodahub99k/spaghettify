import Module from "../wasm/spoile.js";
import { useState, useEffect } from "react";

export const useSpoile = () => {
  const [module, setModule] = useState<any>(null);

  useEffect(() => {
    const loadModule = async () => {
      // ES Module版は関数を呼び出して初期化完了を待つ
      const mod = await Module();
      setModule(mod);
    };
    loadModule();
  }, []);

  const spoileStr = (input: string): string => {
    if (!module) throw new Error("WASM module not loaded yet");

    const spoile_c = module.cwrap("spoile_str_c", "number", ["string"]);
    const free = module.cwrap("free_string", "void", ["number"]);

    const ptr = spoile_c(input);
    const result = module.UTF8ToString(ptr);
    free(ptr);

    return result;
  };

  return { module, spoileStr };
};
