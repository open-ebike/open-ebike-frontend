export default [
  {
    context: ["/api/**"],
    target: "http://localhost:4200/mock/static",
    logLevel: "debug",
    secure: false,
    pathRewrite: { "^.*/api/([^?]*)": "$1.json" },
    onProxyReq: async (proxyReq, req, res) => {
      req.method = "GET";
      proxyReq.method = "GET";
    },
  },
];
