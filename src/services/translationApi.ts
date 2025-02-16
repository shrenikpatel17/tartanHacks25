import { promises as fs } from 'fs';
import path from 'path';

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

function getRandomWords(text: string, count: number): string[] {
    // Get all words from text
    const words = text.match(/\b[\w']+\b/g) || [];
    const uniqueWords = Array.from(new Set(words)); // Remove duplicates
    
    // Shuffle array and get first 'count' elements
    const shuffled = uniqueWords.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function loadSystemPrompt(promptPath: string): Promise<string> {
    try {
        return await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
        console.error('Error loading system prompt:', error);
        throw new Error('Failed to load system prompt');
    }
}

export async function translateText(text: string, targetLanguage: string): Promise<Record<string, string>> {
    try {
        const response = await chrome.runtime.sendMessage({ action: "getApiKey" });
        const apiKey = response.apiKey;
        
        if (!apiKey) {
            throw new Error('API key not found');
        }

        // Get words to translate
        const wordsToTranslate = getRandomWords(text, 10);
        console.log("Words to translate:", wordsToTranslate);

        // Load and prepare system prompt
        const promptTemplate = await loadSystemPrompt(path.join(__dirname, '../prompts/translation.md'));
        const prompt = promptTemplate
            .replace('{{targetLanguage}}', targetLanguage)
            .replace('{{words}}', wordsToTranslate.join(', '));

        const responseFetch = await fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: prompt },
                    { role: "user", content: "Please proceed with the translation." }
                ],
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