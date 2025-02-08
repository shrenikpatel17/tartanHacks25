const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function getRandomWords(text: string, count: number): string[] {
    // Get all words from text
    const words = text.match(/\b[\w']+\b/g) || [];
    const uniqueWords = Array.from(new Set(words)); // Remove duplicates
    
    // Shuffle array and get first 'count' elements
    const shuffled = uniqueWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export async function translateText(text: string, targetLanguage: string): Promise<Record<string, string>> {
    try {
        const response = await chrome.runtime.sendMessage({ action: "getApiKey" });
        const apiKey = response.apiKey;
        
        if (!apiKey) {
            throw new Error('API key not found');
        }

        // Get 5 random words
        const wordsToTranslate = getRandomWords(text, 5);
        console.log("Words to translate:", wordsToTranslate);

        const prompt = `Translate only these 5 words to ${targetLanguage}: ${wordsToTranslate.join(', ')}. 
                       Return ONLY a JSON object with the English words as keys and their ${targetLanguage} translations as values.
                       Example format: {"word1": "translation1", "word2": "translation2"}`;

        const responseFetch = await fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.5,
            })
        });

        const data = await responseFetch.json();
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error("Unexpected API response:", data);
            throw new Error('Invalid API response structure');
        }

        const translatedContent = data.choices[0].message.content;
        console.log("Translation response:", translatedContent);

        try {
            // Parse the JSON response
            const wordMap = JSON.parse(translatedContent);
            console.log("Final translations:", wordMap);
            return wordMap;
        } catch (error) {
            console.error("Error parsing translation response:", error);
            throw new Error('Invalid translation format received');
        }
    } catch (error) {
        console.error("Translation error:", error);
        throw error;
    }
} 