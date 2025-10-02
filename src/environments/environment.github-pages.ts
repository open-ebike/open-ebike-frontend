export const environment = {
  production: false,
  eBikeApiUrl: 'https://cors-anywhere.com/https://api.bosch-ebike.com',
  authConfig: {
    issuer: 'https://p9.authz.bosch.com/auth/realms/obc',
    tokenEndpoint:
      'https://p9.authz.bosch.com/auth/realms/obc/protocol/openid-connect/token',
    authorizationEndpoint:
      'https://p9.authz.bosch.com/auth/realms/obc/protocol/openid-connect/auth',
    redirectUri: 'https://open-ebike.github.io/open-ebike-frontend/home',
    clientId: '',
    scope: 'euda:read',
    responseType: 'code',
    requireHttps: false,
    strictDiscoveryDocumentValidation: false,
    useSilentRefresh: true,
  },
};
