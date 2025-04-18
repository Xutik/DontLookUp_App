export const apiUrl = "http://localhost:4000";

export async function fetchData(url, options = {}) {
  try {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...(options.headers || {}),
    });

    // Configure request options
    const config = {
      method: "GET",
      ...options,
      headers,
      body: options.body ? JSON.stringify(options.body) : null,
    };

    const response = await fetch(url, config);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
}
