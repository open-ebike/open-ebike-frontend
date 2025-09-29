export const environment = {
  production: false,
  eBikeApiUrl: 'https://cors-anywhere.com/https://api.bosch-ebike.com',
  authConfig: {
    issuer: 'https://p9.authz.bosch.com/auth/realms/obc',
    tokenEndpoint:
      'https://p9.authz.bosch.com/auth/realms/obc/protocol/openid-connect/token',
    authorizationEndpoint:
      'https://p9.authz.bosch.com/auth/realms/obc/protocol/openid-connect/auth',
    redirectUri: 'https://open-ebike.github.io/open-ebike-frontend',
    clientId: 'euda-f6421696-34c8-44c6-9f43-c40e1ae704e4',
    scope: 'euda:read',
    responseType: 'code',
    requireHttps: false,
    strictDiscoveryDocumentValidation: false,
    useSilentRefresh: true,
  },
};
