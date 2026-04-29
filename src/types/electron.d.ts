declare global {
  interface Window {
    desktopBridge: {
      platform: string;
      version: string;
      pickProjectFiles: () => Promise<string[]>;
      readProjectFiles: (paths: string[]) => Promise<Array<{ path: string; name: string; ext: string; content?: string; rows?: string[][] }>>;
      getOcrProviderConfig?: () => Promise<unknown>;
      setOcrProviderConfig?: (payload: unknown) => Promise<unknown>;
      getUnderstandingProviderConfig?: () => Promise<unknown>;
      setUnderstandingProviderConfig?: (payload: unknown) => Promise<unknown>;
      getImageProviderConfig: () => Promise<unknown>;
      setImageProviderConfig: (payload: unknown) => Promise<unknown>;
      exportProjectJson?: (payload: unknown) => Promise<string | null>;
    };
  }
}

export {};
