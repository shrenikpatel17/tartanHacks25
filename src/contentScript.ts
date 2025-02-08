import { translateText } from './services/translationApi';
import { handleAudioChat, startRecording } from './services/audioChat';
import { processImageTranslation } from './services/imageTranslation';

//further actions: create database to save the state for the language selection
// Styles for our floating button and modal
const styles = `
.text-extractor-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10000;
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.text-extractor-modal {
  display: none;
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  max-height: 400px;
  background-color: white;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 10000;
  padding: 15px;
  overflow-y: auto;
}

.text-extractor-modal.show {
  display: block;
}

.text-extractor-close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-weight: bold;
}

.icon-button {
  position: fixed;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #2196F3;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  z-index: 10000;
}

.chat-button {
  bottom: 140px;
}

.menu-button {
  bottom: 80px;
}

.menu-modal {
  display: none;
  position: fixed;
  bottom: 140px;
  right: 20px;
  width: 200px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 9999;
  overflow: hidden;
}

.menu-modal.show {
  display: block;
}

.menu-header {
  background-color: #1976D2;
  color: white;
  padding: 10px;
  text-align: center;
  font-weight: bold;
}

.menu-button-container {
  padding: 10px;
}

.menu-option {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: none;
  background-color: #E3F2FD;
  border-radius: 5px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s;
}

.menu-option:hover {
  background-color: #BBDEFB;
}

.word-bank-modal {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  z-index: 10002;
  overflow: hidden;
}

.word-bank-modal.show {
  display: block;
}

.word-bank-header {
  background-color: #1976D2;
  color: white;
  padding: 20px;
  font-size: 1.5em;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.word-bank-close {
  cursor: pointer;
  font-size: 1.5em;
  color: white;
}

.word-bank-content {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(80vh - 80px);
}

.word-bank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  padding: 10px;
}

.word-pair {
  background: #E3F2FD;
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s;
}

.word-pair:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.original-word {
  color: #666;
  font-size: 0.9em;
  margin-bottom: 5px;
}

.translated-word-display {
  background-color: #4CAF50;
  color: white;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: bold;
  font-size: 1.1em;
}

.no-words-message {
  text-align: center;
  color: #666;
  padding: 40px;
  font-size: 1.1em;
}

.chat-response {
  position: fixed;
  bottom: 200px;
  right: 20px;
  background: white;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  max-width: 350px;
  width: 350px;
  max-height: 500px;
  z-index: 10000;
  display: none;
  overflow-y: auto;
}

.chat-response.show {
  display: block;
}

.chat-message {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 8px;
}

.user-message {
  background: #E3F2FD;
  margin-left: 20px;
  margin-right: 5px;
}

.ai-message {
  background: #F5F5F5;
  margin-right: 20px;
  margin-left: 5px;
}

.message-text {
  margin-bottom: 5px;
}

.response-target-language {
  color: #2196F3;
  margin-bottom: 4px;
  font-weight: bold;
}

.response-english {
  color: #666;
  font-style: italic;
}

.timestamp {
  font-size: 0.8em;
  color: #999;
  margin-top: 4px;
}

.chat-button.recording {
  background-color: #ff4444;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
`;

// Add styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Create and add the button
const button = document.createElement('button');
button.className = 'text-extractor-button';
button.textContent = 'Whaley';
document.body.appendChild(button);

// Create and add the modal
const modal = document.createElement('div');
modal.className = 'text-extractor-modal';
modal.innerHTML = `
  <span class="text-extractor-close">&times;</span>
  <div class="text-extractor-content"></div>
`;
document.body.appendChild(modal);

// Get modal elements
const closeBtn = modal.querySelector('.text-extractor-close');
const modalContent = modal.querySelector('.text-extractor-content');

// Add at the top with other global variables
let points = 0;
const POINTS_PER_WORD = 100;
let pageContext: string = '';

// Add supported languages array at the top with other global variables
const SUPPORTED_LANGUAGES = [
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' }
];

let currentLanguage = SUPPORTED_LANGUAGES[0]; // Default to French

// Add interface for chat messages
interface ChatMessage {
    type: 'user' | 'ai';
    text?: string;
    targetLanguage?: string;
    english?: string;
    timestamp: Date;
}

// Add chat history array
let chatHistory: ChatMessage[] = [];

// Function to format timestamp
function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Function to render chat history
function renderChatHistory() {
    chatResponse.innerHTML = chatHistory.map(message => {
        if (message.type === 'user') {
            return `
                <div class="chat-message user-message">
                    <div class="message-text">${message.text}</div>
                    <div class="timestamp">${formatTime(message.timestamp)}</div>
                </div>
            `;
        } else {
            return `
                <div class="chat-message ai-message">
                    <div class="response-target-language">${message.targetLanguage}</div>
                    <div class="response-english">${message.english}</div>
                    <div class="timestamp">${formatTime(message.timestamp)}</div>
                </div>
            `;
        }
    }).join('');

    // Scroll to bottom
    chatResponse.scrollTop = chatResponse.scrollHeight;
}

function replaceTextWithTranslations(wordMap: Record<string, string>) {
    if (!document.getElementById('translator-style')) {
        const style = document.createElement('style');
        style.id = 'translator-style';
        style.textContent = `
            .translated-word {
                color: black;
                background-color: #E3F2FD; /* very light blue */
                padding: 2px 6px;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                display: inline-block;
                margin: 0 2px;
            }
            .translated-word.click-1 {
                background-color: #90CAF9; /* light blue */
            }
            .translated-word.click-2 {
                background-color: #2196F3; /* medium blue */
                color: white;
            }
            .translated-word.click-3 {
                background-color: #4CAF50; /* green */
                color: white;
            }
            .translated-word:hover::after {
                content: attr(data-original);
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                bottom: 100%;
                background: white;
                color: black;
                padding: 4px 8px;
                border-radius: 15px;
                font-size: 14px;
                white-space: nowrap;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                border: 1px solid #ddd;
                z-index: 10001;
                margin-bottom: 5px;
            }
        `;
        document.head.appendChild(style);
    }

    // Function to handle click events
    function handleClick(event: Event) {
        const element = event.target as HTMLElement;
        if (!element.classList.contains('translated-word')) return;

        const word = element.getAttribute('data-original');
        if (!word) return;

        const allInstances = document.querySelectorAll(`.translated-word[data-original="${word}"]`);
        const currentClicks = parseInt(element.getAttribute('data-clicks') || '0');
        const nextClicks = (currentClicks + 1) % 4;

        console.log('Word clicked:', word, 'Current clicks:', currentClicks, 'Next clicks:', nextClicks); // Debug log

        // Check if word is being mastered (reaching green state)
        const isMastering = nextClicks === 3 && currentClicks === 2;
        console.log('Is mastering:', isMastering); // Debug log

        allInstances.forEach(instance => {
            instance.classList.remove('click-1', 'click-2', 'click-3');
            if (nextClicks > 0) {
                instance.classList.add(`click-${nextClicks}`);
            }
            instance.setAttribute('data-clicks', nextClicks.toString());
        });

        // Add points and trigger water animation if word is mastered
        if (isMastering) {
            console.log('Word mastered! Triggering animation...'); // Debug log
            points += POINTS_PER_WORD;
            updatePoints();
            
            // Get the clicked element's position
            const rect = element.getBoundingClientRect();
            const x = rect.left + (rect.width / 2);
            const y = rect.top;
            
            console.log('Element position:', rect); // Debug log
            
            // Create water animation at the word's position
            createWaterAnimation(x, y);
        }
    }

    // Function to replace text in a node
    function replaceInTextNode(textNode: Text) {
        let text = textNode.textContent || '';
        const tempDiv = document.createElement('div');
        let currentText = text;

        Object.entries(wordMap).forEach(([original, translated]) => {
            const regex = new RegExp(`\\b${original}\\b`, 'gi');
            currentText = currentText.replace(
                regex, 
                `<span class="translated-word" 
                      data-original="${original}" 
                      data-clicks="0">${translated}</span>`
            );
        });

        if (currentText !== text) {
            tempDiv.innerHTML = currentText;
            
            // Add click handlers to all translated words
            tempDiv.querySelectorAll('.translated-word').forEach(el => {
                el.addEventListener('click', handleClick);
            });

            const fragment = document.createDocumentFragment();
            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }
            textNode.parentNode?.replaceChild(fragment, textNode);
        }
    }

    // Walk through all text nodes in the document
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                // Skip script and style elements
                const parent = node.parentNode as HTMLElement;
                if (parent && (
                    parent.tagName === 'SCRIPT' || 
                    parent.tagName === 'STYLE' || 
                    parent.classList.contains('translated-word')
                )) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    let node: Text | null;
    const nodesToProcess: Text[] = [];
    
    // Collect all nodes first to avoid modification during traversal
    while (node = walker.nextNode() as Text) {
        nodesToProcess.push(node);
    }

    // Process all collected nodes
    nodesToProcess.forEach(node => {
        replaceInTextNode(node);
    });
}

// Modify the existing extractTextFromPage function
async function extractTextFromPage() {
    return document.body.innerText;
}

// Add this function to remove existing translations
function clearExistingTranslations() {
    const translatedWords = document.querySelectorAll('.translated-word');
    translatedWords.forEach(element => {
        const original = element.getAttribute('data-original');
        if (original) {
            const textNode = document.createTextNode(original);
            element.parentNode?.replaceChild(textNode, element);
        }
    });
}

// Update the translatePageText function
async function translatePageText() {
    try {
        console.log("Starting translation...");
        // Clear existing translations first
        clearExistingTranslations();
        
        const text = await extractTextFromPage();
        pageContext = text;
        const translations = await translateText(text, currentLanguage.code);
        console.log("Got translations:", translations);
        replaceTextWithTranslations(translations);
        if (modalContent) {
            modalContent.textContent = "Translation complete! Hover over blue text to see original words.";
        }
    } catch (error: unknown) {
        console.error("Translation failed:", error);
        if (modalContent) {
            modalContent.textContent = `Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
    }
}

// Run translation on page load
window.addEventListener('load', translatePageText);

// Update the button click handler to reuse the function
button.addEventListener('click', translatePageText);

closeBtn?.addEventListener('click', () => {
  modal.classList.remove('show');
});

// Still keep the message listener for the popup functionality
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractText") {
    const text = extractTextFromPage();
    sendResponse({ text });
  }
  return true;
});

// Create chat button
const chatButton = document.createElement('button');
chatButton.className = 'icon-button chat-button';
chatButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
`;
document.body.appendChild(chatButton);

// Create menu button
const menuButton = document.createElement('button');
menuButton.className = 'icon-button menu-button';
menuButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
`;
document.body.appendChild(menuButton);

// Create menu modal
const menuModal = document.createElement('div');
menuModal.className = 'menu-modal';
menuModal.innerHTML = `
    <div class="menu-header">
        <select id="language-selector">
            ${SUPPORTED_LANGUAGES.map(lang => 
                `<option value="${lang.code}">${lang.name}</option>`
            ).join('')}
        </select>
        <span>Points: ${points}</span>
    </div>
    <div class="menu-button-container">
        <button class="menu-option" id="word-bank">Word Bank</button>
        <button class="menu-option" id="history">History</button>
    </div>
`;
document.body.appendChild(menuModal);

// Add styles for the language selector
const languageSelectorStyles = `
    #language-selector {
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid #fff;
        background: transparent;
        color: white;
        margin-right: 10px;
        cursor: pointer;
    }

    #language-selector option {
        background: #1976D2;
        color: white;
    }

    .menu-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
`;
styleSheet.textContent += languageSelectorStyles;

// Add language change handler
document.getElementById('language-selector')?.addEventListener('change', (e) => {
    const selectedCode = (e.target as HTMLSelectElement).value;
    currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedCode) || SUPPORTED_LANGUAGES[0];
    translatePageText(); // Retranslate page with new language
});

// Add event listeners
menuButton.addEventListener('click', () => {
    menuModal.classList.toggle('show');
});

// Close menu when clicking outside
document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target as Node) && 
        !menuModal.contains(event.target as Node) && 
        menuModal.classList.contains('show')) {
        menuModal.classList.remove('show');
    }
});

// Add handlers for menu options
document.getElementById('word-bank')?.addEventListener('click', () => {
    console.log('Word Bank clicked');
    // Add your word bank functionality here
});

document.getElementById('history')?.addEventListener('click', () => {
    console.log('History clicked');
    // Add your history functionality here
});

// Create word bank modal
const wordBankModal = document.createElement('div');
wordBankModal.className = 'word-bank-modal';
wordBankModal.innerHTML = `
    <div class="word-bank-header">
        Word Bank
        <span class="word-bank-close">&times;</span>
    </div>
    <div class="word-bank-content">
        <div class="word-bank-grid"></div>
    </div>
`;
document.body.appendChild(wordBankModal);

// Function to get mastered words
function getMasteredWords(): Array<[string, string]> {
    const masteredWords: Array<[string, string]> = [];
    document.querySelectorAll('.translated-word').forEach(el => {
        if (el.classList.contains('click-3')) {
            const original = el.getAttribute('data-original');
            const translated = el.textContent;
            if (original && translated) {
                masteredWords.push([original, translated]);
            }
        }
    });
    return [...new Set(masteredWords.map(pair => JSON.stringify(pair)))].map(str => JSON.parse(str));
}

// Function to update word bank content
function updateWordBank() {
    const grid = wordBankModal.querySelector('.word-bank-grid');
    if (!grid) return;

    const masteredWords = getMasteredWords();
    
    if (masteredWords.length === 0) {
        grid.innerHTML = `
            <div class="no-words-message">
                No mastered words yet! Click on translated words three times to add them to your word bank.
            </div>
        `;
        return;
    }

    grid.innerHTML = masteredWords.map(([original, translated]) => `
        <div class="word-pair">
            <div class="original-word">${original}</div>
            <div class="translated-word-display">${translated}</div>
        </div>
    `).join('');
}

// Update word bank handlers
document.getElementById('word-bank')?.addEventListener('click', () => {
    updateWordBank();
    wordBankModal.classList.add('show');
    menuModal.classList.remove('show'); // Close the menu modal
});

// Close word bank modal
wordBankModal.querySelector('.word-bank-close')?.addEventListener('click', () => {
    wordBankModal.classList.remove('show');
});

// Close word bank modal when clicking outside
document.addEventListener('click', (event) => {
    if (!wordBankModal.contains(event.target as Node) && 
        !document.getElementById('word-bank')?.contains(event.target as Node) &&
        wordBankModal.classList.contains('show')) {
        wordBankModal.classList.remove('show');
    }
});

// Function to update points display
function updatePoints() {
    const pointsDisplay = document.querySelector('.menu-header');
    if (pointsDisplay) {
        pointsDisplay.textContent = `Points: ${points}`;
    }
}

// Update chat button click handler
let isRecording = false;
let mediaRecorder: MediaRecorder | null = null;
const audioChunks: BlobPart[] = [];

chatButton.addEventListener('click', async () => {
    try {
        if (!isRecording) {
            // Clear previous audio chunks before starting new recording
            audioChunks.length = 0;
            
            // Start recording
            mediaRecorder = await startRecording();
            isRecording = true;
            chatButton.classList.add('recording');
            chatResponse.textContent = "Recording... Click again to stop.";
            chatResponse.classList.add('show');

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                chatResponse.innerHTML = "Processing...";
                
                try {
                    const response = await handleAudioChat(audioBlob, currentLanguage.code, pageContext);
                    
                    // Add user message to history
                    chatHistory.push({
                        type: 'user',
                        text: response.userText,
                        timestamp: new Date()
                    });

                    // Add AI response to history
                    chatHistory.push({
                        type: 'ai',
                        targetLanguage: response.targetLanguage,
                        english: response.english,
                        timestamp: new Date()
                    });

                    // Render updated chat history
                    renderChatHistory();
                } catch (error) {
                    chatResponse.textContent = "Failed to process audio. Please try again.";
                    console.error(error);
                }
            };
        } else {
            // Stop recording
            mediaRecorder?.stop();
            isRecording = false;
            chatButton.classList.remove('recording');
        }
    } catch (error) {
        console.error("Error with recording:", error);
        chatResponse.textContent = "Error accessing microphone. Please check permissions.";
        chatResponse.classList.add('show');
    }
});

// Add click outside to close chat response
document.addEventListener('click', (event) => {
    if (!chatButton.contains(event.target as Node) && 
        !chatResponse.contains(event.target as Node) && 
        !isRecording) {
        chatResponse.classList.remove('show');
    }
});

// Create chat response element
const chatResponse = document.createElement('div');
chatResponse.className = 'chat-response';
document.body.appendChild(chatResponse);

// Add a constant for vertical offset at the top of the file
const TEXT_VERTICAL_OFFSET = -20; // Adjust this value to shift text up or down

class ImageTranslator {
    private observer: MutationObserver | null = null;
    private processedImages: Set<HTMLImageElement> = new Set();

    async init() {
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLImageElement) {
                        this.processImage(node);
                    }
                });
            });
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Process existing images
        document.querySelectorAll('img').forEach(img => this.processImage(img as HTMLImageElement));
    }

    async processImage(imgElement: HTMLImageElement) {
        if (this.processedImages.has(imgElement)) return;
        this.processedImages.add(imgElement);

        try {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';
            
            imgElement.parentNode?.insertBefore(wrapper, imgElement);
            wrapper.appendChild(imgElement);

            const result = await processImageTranslation(imgElement.src, currentLanguage.code);
            
            if (result.success && result.translatedData) {
                result.translatedData.forEach(({ translated, vertices }) => {
                    if (!vertices || vertices.length < 4) return;

                    const overlay = document.createElement('div');
                    overlay.textContent = translated;
                    overlay.style.cssText = `
                       position: absolute;
                        left: ${vertices[0].x}px;
                        top: ${vertices[0].y + TEXT_VERTICAL_OFFSET}px;
                        color: white;
                        text-shadow: -1px -1px 0 #48596e, 
                                    1px -1px 0 #48596e, 
                                    -1px 1px 0 #48596e, 
                                    1px 1px 0 #48596e;
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        pointer-events: auto; /* Enable hover detection */
                        z-index: 1000;
                        transition: opacity 0.2s ease-in-out; /* Smooth fade effect */
                    `;

                    overlay.addEventListener("mouseenter", () => {
                        overlay.style.opacity = "0";
                    });
                    overlay.addEventListener("mouseleave", () => {
                        overlay.style.opacity = "1";
                    });
                    imgElement.parentNode?.insertBefore(overlay, imgElement);
                });
            }
        } catch (error) {
            console.error('Error processing image:', error);
        }
    }
}

// Initialize the translator after your existing code
const imageTranslator = new ImageTranslator();
imageTranslator.init();

// Update water animation styles
const waterAnimationStyles = `
    @keyframes waterBounce {
        0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
            visibility: visible;
        }
        50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.7;
        }
        100% {
            transform: translateY(-40px) scale(1);
            opacity: 0;
        }
    }

    .water-animation {
        position: fixed;
        pointer-events: none;
        width: 50px;
        height: 50px;
        z-index: 10001;
        visibility: hidden;
        animation: waterBounce 1s ease-out forwards;
    }
`;

// Update the createWaterAnimation function
function createWaterAnimation(x: number, y: number) {
    console.log('Creating water animation at:', x, y);
    
    const water = document.createElement('img');
    water.src = chrome.runtime.getURL('images/water.png');
    water.className = 'water-animation';
    water.style.left = `${x - 25}px`;
    // Position it at the word's position (not below it)
    water.style.top = `${y}px`;
    
    // Add error handling for image loading
    water.onerror = (e) => {
        console.error('Failed to load water image:', e);
        console.log('Attempted image URL:', water.src);
    };
    
    water.onload = () => {
        console.log('Water image loaded successfully');
    };
    
    document.body.appendChild(water);
    
    // Debug log for animation
    water.addEventListener('animationstart', () => {
        console.log('Water animation started');
    });
    
    water.addEventListener('animationend', () => {
        console.log('Water animation ended');
        water.remove();
    });
} 