declare global {
  interface Window {
    desktopBridge: {
      platform: string;
      version: string;
      pickProjectFiles: () => Promise<string[]>;
      readProjectFiles: (paths: string[]) => Promise<Array<{ path: string; name: string; ext: string; content?: string; rows?: string[][] }>>;
      getImageProviderConfig: () => Promise<unknown>;
      setImageProviderConfig: (payload: unknown) => Promise<unknown>;
      exportProjectJson?: (payload: unknown) => Promise<string | null>;
    };
  }
}

export {};
