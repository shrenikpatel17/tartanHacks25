const OPENAI_WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";
const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

interface ChatResponse {
    userText: string;
    targetLanguage: string;
    english: string;
}

export async function handleAudioChat(
    audioBlob: Blob, 
    targetLanguage: string,
    pageContext: string
): Promise<ChatResponse> {
    try {
        // First, get the API key
        const response = await chrome.runtime.sendMessage({ action: "getApiKey" });
        const apiKey = response.apiKey;
        
        if (!apiKey) {
            throw new Error('API key not found');
        }

        // Step 1: Convert audio to text using Whisper
        const formData = new FormData();
        formData.append("file", audioBlob, "audio.webm");
        formData.append("model", "whisper-1");
        formData.append("language", "en");

        const transcriptionResponse = await fetch(OPENAI_WHISPER_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
            },
            body: formData,
        });

        const transcriptionData = await transcriptionResponse.json();
        
        if (!transcriptionData.text) {
            throw new Error('Failed to transcribe audio');
        }

        console.log("Transcribed text:", transcriptionData.text);

        // Step 2: Get response from GPT-4 in target language and English
        const chatResponse = await fetch(OPENAI_CHAT_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful language learning assistant. You have access to the following page context:
                        
                        ${pageContext}
                        
                        When the user asks a question, use this context to provide accurate answers. Create your response in both ${targetLanguage} and English. Format your response exactly like this example:
                        [${targetLanguage}] Bonjour! Comment puis-je vous aider aujourd'hui?
                        [English] Hello! How can I help you today?`
                    },
                    {
                        role: "user",
                        content: transcriptionData.text
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            }),
        });

        const chatData = await chatResponse.json();
        
        if (!chatData.choices?.[0]?.message?.content) {
            throw new Error('Failed to get response');
        }

        // Parse the response to separate target language and English
        const content = chatData.choices[0].message.content;
        const [targetResponse, englishResponse] = content.split('\n')
            .map((line: string) => line.trim())
            .map((line: string) => {
                const match = line.match(/\[(.*?)\] (.*)/);
                return match ? match[2] : line;
            });

        return {
            userText: transcriptionData.text,
            targetLanguage: targetResponse,
            english: englishResponse
        };
    } catch (error) {
        console.error("Audio chat error:", error);
        throw error;
    }
}

// Audio recording utilities
export async function startRecording(): Promise<MediaRecorder> {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks: BlobPart[] = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        return mediaRecorder;
    } catch (error) {
        console.error("Error starting recording:", error);
        throw error;
    }
} 