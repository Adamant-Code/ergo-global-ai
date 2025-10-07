export interface LocalStorageProps {
  clearAuthData: () => void;
  setAuthState: (state: {
    isAuthenticated: boolean;
    userId?: string;
  }) => void;
  getAuthState: () => {
    isAuthenticated: boolean;
    userId?: string;
  };
  getSessionExpiry: () => number;
  setSessionExpiry: (expiryTime: number) => void
}
