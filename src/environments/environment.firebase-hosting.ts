export const environment = {
  production: false,
  eBikeApiUrl: '/api',
  authConfig: {
    issuer: 'https://p9.authz.bosch.com/auth/realms/obc',
    tokenEndpoint:
      'https://p9.authz.bosch.com/auth/realms/obc/protocol/openid-connect/token',
    authorizationEndpoint:
      'https://p9.authz.bosch.com/auth/realms/obc/protocol/openid-connect/auth',
    redirectUri: 'https://open-ebike.web.app',
    clientId: 'euda-2677687f-bed4-4083-982c-8e4a410b62ad',
    scope: 'euda:read',
    responseType: 'code',
    requireHttps: false,
    strictDiscoveryDocumentValidation: false,
    useSilentRefresh: true,
  },
};
