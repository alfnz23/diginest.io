// Safe browser API access utilities
export const isBrowser = typeof window !== "undefined";
export const isServer = !isBrowser;

// Safe window access
export const safeWindow = {
  get location() {
    return isBrowser ? window.location : null;
  },

  get navigator() {
    return isBrowser ? window.navigator : null;
  },

  get document() {
    return isBrowser ? window.document : null;
  },

  get localStorage() {
    return isBrowser ? window.localStorage : null;
  },

  get sessionStorage() {
    return isBrowser ? window.sessionStorage : null;
  },

  addEventListener: (event: string, handler: EventListener) => {
    if (isBrowser) {
      window.addEventListener(event, handler);
    }
  },

  removeEventListener: (event: string, handler: EventListener) => {
    if (isBrowser) {
      window.removeEventListener(event, handler);
    }
  },

  setTimeout: (callback: () => void, delay: number) => {
    if (isBrowser) {
      return setTimeout(callback, delay);
    }
    return null;
  },

  clearTimeout: (id: number | null) => {
    if (isBrowser && id) {
      clearTimeout(id);
    }
  },
};

// Safe localStorage operations
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return isBrowser ? localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    try {
      if (isBrowser) {
        localStorage.setItem(key, value);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    try {
      if (isBrowser) {
        localStorage.removeItem(key);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
};

// Safe navigation
export const safeNavigate = {
  redirect: (url: string) => {
    if (isBrowser && safeWindow.location) {
      safeWindow.location.href = url;
    }
  },

  reload: () => {
    if (isBrowser && safeWindow.location) {
      safeWindow.location.reload();
    }
  },

  getOrigin: (): string => {
    return isBrowser && safeWindow.location ? safeWindow.location.origin : "";
  },
};

// Mobile detection utility
export const isMobile = (): boolean => {
  if (!isBrowser || !safeWindow.navigator) return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    safeWindow.navigator.userAgent,
  );
};

// Mouse position utility
export const useMousePosition = () => {
  if (!isBrowser) return { x: 0, y: 0 };

  const getMousePosition = (e: MouseEvent) => ({
    x: e.clientX,
    y: e.clientY,
  });

  return { getMousePosition };
};

// Screen size utilities
export const getScreenSize = () => {
  if (!isBrowser) return { width: 0, height: 0 };

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};
