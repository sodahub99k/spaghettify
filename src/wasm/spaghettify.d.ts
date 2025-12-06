declare module "../wasm/spaghettify.js" {
  export interface SpaghettifyModule extends EmscriptenModule {
    cwrap: (
      ident: string,
      returnType: string | null,
      argTypes: string[]
    ) => (...args: any[]) => any;
  }

  const Module: (
    options?: Partial<EmscriptenModule>
  ) => Promise<SpaghettifyModule>;

  export default Module;
}

export { };