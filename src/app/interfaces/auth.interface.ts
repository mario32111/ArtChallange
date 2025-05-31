export interface AuthResponse {
  user: {
    photoURL: string;
    uid: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerData: Array<{
      providerId: string;
      uid: string;
      displayName: string | null;
      email: string;
      phoneNumber: string | null;
      photoURL: string | null;
    }>;
    stsTokenManager: {
      refreshToken: string;
      accessToken: string;
      expirationTime: number;
    };
    createdAt: string;
    lastLoginAt: string;
    apiKey: string;
    appName: string;
  };
  providerId: string | null;
  _tokenResponse: {
    kind: string;
    localId: string;
    email: string;
    displayName: string;
    idToken: string;
    registered: boolean;
    refreshToken: string;
    expiresIn: string;
  };
  operationType: string;
}
