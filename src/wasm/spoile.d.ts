declare module "../wasm/spoile.js" {
  export interface SpoileModule extends EmscriptenModule {
    cwrap: (
      ident: string,
      returnType: string | null,
      argTypes: string[]
    ) => (...args: any[]) => any;
  }

  const Module: (
    options?: Partial<EmscriptenModule>
  ) => Promise<SpoileModule>;

  export default Module;
}

export { };