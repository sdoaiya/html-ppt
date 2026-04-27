declare global {
  interface Window {
    desktopBridge: {
      platform: string;
      version: string;
      pickProjectFiles: () => Promise<string[]>;
      getImageProviderConfig: () => Promise<unknown>;
      setImageProviderConfig: (payload: unknown) => Promise<unknown>;
      exportProjectJson?: (payload: unknown) => Promise<string | null>;
    };
  }
}

export {};
