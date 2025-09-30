const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({ origin: true });

// Define the target API base URL
const targetApiUrl = "https://api.bosch-ebike.com";

exports.proxyApi = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    // Construct the full URL for the external API, including the path and query string
    const fullUrl = `${targetApiUrl}${request.path.replace("/api", "")}${request.url.includes("?") ? "?" + request.url.split("?")[1] : ""}`;

    // Extract the bearer token from the request headers
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return response.status(401).send("Authorization header is missing");
    }

    try {
      // Create a config object for the axios request
      const axiosConfig = {
        method: request.method,
        url: fullUrl,
        headers: {
          Authorization: authHeader,
        },
        // Forward the request body if it exists
        data: request.body,
      };

      // Make the dynamic request to the target API
      const apiResponse = await axios(axiosConfig);

      // Forward the API's response to the client
      response.status(apiResponse.status).send(apiResponse.data);
    } catch (error) {
      console.error("API proxy error:", error);
      // Forward the error response from the API to the client
      if (error.response) {
        response.status(error.response.status).send(error.response.data);
      } else {
        response.status(500).send("Internal Server Error");
      }
    }
  });
});
