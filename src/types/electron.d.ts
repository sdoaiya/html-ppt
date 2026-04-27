declare global {
  interface Window {
    desktopBridge: {
      platform: string;
      version: string;
    };
  }
}

export {};
