export const environment = {
  production: false,
  eBikeApiUrl: '/api',
  authConfig: {
    issuer: 'https://p9.authz.bosch.com/auth/realms/obc',
    tokenEndpoint:
      'https://p9.authz.bosch.com/auth/realms/obc/protocol/openid-connect/token',
    authorizationEndpoint:
      'https://p9.authz.bosch.com/auth/realms/obc/protocol/openid-connect/auth',
    redirectUri: 'https://open-ebike.web.app/home',
    postLogoutRedirectUri: 'https://open-ebike.web.app/home',
    clientId: '',
    scope: 'euda:read',
    responseType: 'code',
    requireHttps: false,
    strictDiscoveryDocumentValidation: false,
    useSilentRefresh: true,
  },
};
