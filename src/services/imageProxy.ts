// Function to proxy the image request through the background script
export async function proxyImageRequest(imageUrl: string): Promise<string> {
    try {
        // Send message to background script to fetch the image
        const response = await chrome.runtime.sendMessage({
            action: "proxyImage",
            imageUrl: imageUrl
        });

        if (response.error) {
            throw new Error(response.error);
        }

        return response.dataUrl;
    } catch (error) {
        console.error("Error proxying image:", error);
        throw error;
    }
} 