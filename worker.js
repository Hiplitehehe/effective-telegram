
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const apiUrl = url.searchParams.get("url"); // Get API URL from query params

    if (!apiUrl) {
      return new Response(JSON.stringify({ error: "No URL provided. Use ?url=YOUR_API_URL" }), {
        status: 400,
        headers: corsHeaders(),
      });
    }

    if (!isValidUrl(apiUrl)) {
      return new Response(JSON.stringify({ error: "Invalid URL format" }), {
        status: 400,
        headers: corsHeaders(),
      });
    }

    // Handle CORS preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }

    try {
      const fetchOptions = {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" && request.method !== "HEAD" ? request.body : null,
      };

      const response = await fetch(apiUrl, fetchOptions);

      const responseBody = await response.text();
      return new Response(responseBody, {
        status: response.status,
        headers: {
          ...corsHeaders(),
          "Content-Type": response.headers.get("Content-Type") || "application/json",
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch data from the API" }), {
        status: 500,
        headers: corsHeaders(),
      });
    }
  },
};

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*", // Change this if you want to restrict access
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
