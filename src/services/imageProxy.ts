// Function to proxy the image request through the background script
export async function proxyImageRequest(imageUrl: string): Promise<string> {
    try {
        console.log("Sending proxy request for image:", imageUrl);
        
        // Send message to background script to fetch the image
        const response = await chrome.runtime.sendMessage({
            action: "proxyImage",
            imageUrl: imageUrl
        });

        console.log("Received proxy response:", response);

        // Handle undefined response
        if (!response) {
            throw new Error('No response received from background script');
        }

        // Handle error response
        if (response.error) {
            throw new Error(`Background script error: ${response.error}`);
        }

        // Handle missing dataUrl
        if (!response.dataUrl) {
            throw new Error('No data URL in response');
        }

        return response.dataUrl;
    } catch (error) {
        console.error("Error proxying image:", {
            error,
            errorType: error?.constructor?.name,
            url: imageUrl,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        throw error;
    }
} 