export const environment = {
  production: false,
  appTitle: 'Open eBike',
  hrefBase: 'https://open-ebike.web.app/',
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
  mapbox: {
    accessToken:
      'pk.eyJ1Ijoib3BlbmViaWtlIiwiYSI6ImNtZnpiejU0ZjAwOWsya3F3bWx3bDRobHEifQ.mWyg2Y55CEJZ7TDvRKZM-g',
    boundBoxPaddingHorizontal: 0.025,
    boundBoxPaddingVertical: 0.025,
  },
};
