declare global {
  interface Window {
    desktopBridge: {
      platform: string;
      version: string;
      getImageProviderConfig: () => Promise<unknown>;
      setImageProviderConfig: (payload: unknown) => Promise<unknown>;
    };
  }
}

export {};
