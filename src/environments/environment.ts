export const environment = {
  production: false,
  hrefBase: 'http://localhost:4200/',
  eBikeApiUrl: '/api',
  authConfig: {
    issuer: 'https://p9.authz.bosch.com/auth/realms/obc',
    tokenEndpoint:
      'https://p9.authz.bosch.com/auth/realms/obc/protocol/openid-connect/token',
    authorizationEndpoint:
      'https://p9.authz.bosch.com/auth/realms/obc/protocol/openid-connect/auth',
    redirectUri: 'http://localhost:4200/home',
    postLogoutRedirectUri: 'http://localhost:4200/home',
    clientId: '',
    scope: 'euda:read',
    responseType: 'code',
    requireHttps: false,
    strictDiscoveryDocumentValidation: false,
    useSilentRefresh: true,
  },
  mapbox: {
    accessToken: null,
    boundBoxPaddingHorizontal: 0.025,
    boundBoxPaddingVertical: 0.025,
  },
};
