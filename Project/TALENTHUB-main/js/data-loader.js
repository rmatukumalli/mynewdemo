// js/data-loader.js

/**
 * Fetches the sample data from the JSON file.
 * @returns {Promise<Object>} A promise that resolves with the parsed JSON data,
 *                            or rejects with an error if fetching fails.
 */
async function fetchSampleData() {
    const dataUrl = './data/sample-data.json'; // Path relative to the HTML file where scripts are run
    try {
        const response = await fetch(dataUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch sample data from ${dataUrl}: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Data Loader: Sample data loaded successfully:", JSON.parse(JSON.stringify(data))); // Deep copy for logging
        return data;
    } catch (error) {
        console.error("Error in fetchSampleData:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

// To make it accessible if not using ES6 modules (e.g., directly in browser scripts)
if (typeof window !== 'undefined') {
    window.fetchSampleData = fetchSampleData;
}

// If using ES6 modules in the future, you might export it like this:
// export { fetchSampleData };
