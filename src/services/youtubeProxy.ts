// Function to proxy YouTube requests through the background script
export async function proxyYoutubeRequest(videoId: string): Promise<any> {
    try {
        // Send message to background script to fetch the transcript
        const response = await chrome.runtime.sendMessage({
            action: "proxyYoutube",
            videoId: videoId
        });

        if (response.error) {
            throw new Error(response.error);
        }

        console.log("response.transcript", response.transcript);
        return response.transcript;
    } catch (error) {
        console.error("Error proxying YouTube request:", error);
        throw error;
    }
} 