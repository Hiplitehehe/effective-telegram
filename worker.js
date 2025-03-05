export default {
  async fetch(request) {
    const url = new URL(request.url);
    const apiUrl = url.searchParams.get("url"); // Get API URL from query params

    if (!apiUrl) {
      return new Response(JSON.stringify({ error: "No URL provided. Use ?url=YOUR_API_URL" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!isValidUrl(apiUrl)) {
      return new Response(JSON.stringify({ error: "Invalid URL format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      return new Response(JSON.stringify(data, null, 2), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to fetch data from the API" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
}
