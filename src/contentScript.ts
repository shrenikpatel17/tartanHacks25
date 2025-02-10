import { translateText } from './services/translationApi';
import { handleAudioChat, startRecording } from './services/audioChat';
import { processImageTranslation } from './services/imageTranslation';
import { YoutubeTranscript } from 'youtube-transcript';
import { proxyYoutubeRequest } from './services/youtubeProxy';

// Add at the top of the file with other constants
const WORDS_FOR_GOLDEN = 5;  // Number of words needed for golden progress
const PROGRESS_COLORS = {
    normal: '#2196F3',
    golden: '#FFD700'
};

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

// Styles for our floating button and modal
const styles = `
.whale-button {
    position: fixed;
    right: 13px;
    bottom: 25px;
    width: 90px;
    height: 90px;
    border: none;
    background: transparent;
    cursor: pointer;
    z-index: 1000;
    transition: transform 0.2s;
    padding: 0;  // Remove padding
}

.whale-button:hover {
    transform: scale(1.1);
}

.whale-img {
    width: 100%;  // Make image fill the button
    height: 100%;
    object-fit: contain;
    display: block;  // Remove any extra space
}
    
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
    z-index: 1000;
    border: none;
    background: none;
    cursor: pointer;
    transition: transform 0.2s;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-button:hover {
    transform: scale(1.1);
}

/* 聊天按钮定位 */
.chat-button {
    right: 77px;
    bottom: 85px;
}

/* 菜单按钮定位 */
.menu-button {
    right: 40px;
    bottom: 85px;
    z-index: 1001;
}

/* 模态框样式 */
.menu-modal {
    position: fixed;
    top: 64%;
    left: 84%;
    transform: translate(-50%, -50%);
    width: 300px;
    background:rgb(243, 248, 255);
    border-radius: 12px;  /* Rounded corners for modal */
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    padding: 0;  /* Remove default padding */
    z-index: 1001;
    display: none;
    overflow: hidden;  /* Ensure content doesn't overflow rounded corners */
}

.menu-header {
    margin-top: 4px;  /* Reduce space below progress bar */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;  /* Add horizontal padding */
    height: 40px;  /* Reduce header height */
}

.menu-modal.show {
    display: block; /* 显示时切换为block */
}

.points-badge {
    background: rgba(255,255,255,0.9);
    padding: 8px 16px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
}

.menu-button-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.menu-option {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #eee;
    background:rgb(216, 228, 255);
    display: flex;
    align-items: center;
    gap: 5px;
    width: 90%;
    text-align: center;
    transition: background 0.2s;
}

.menu-option:hover {
    background: #fff;
    cursor: pointer;
}

.option-icon {
    flex-shrink: 0;
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
    background: rgba(255, 0, 0, 0.2);  /* Subtle red background */
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
    }
}

.progress-container {
    width: 100%;
    height: 4px;
    background-color: #E0E0E0;
    position: relative;  /* Change from absolute to relative */
    overflow: hidden;
    border-radius: 4px 4px 0 0;
}

.progress-bar {
    height: 100%;
    width: 0%;
    background-color: ${PROGRESS_COLORS.normal};
    transition: width 0.3s ease, background-color 0.3s ease;
}

.menu-container {
    padding: 0;  /* Remove container padding */
}

.points-display {
    font-weight: bold;
    font-size: 16px;
}

#language-selector {
    padding: 4px 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
}
`;

// Add styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Create and add the button
// const button = document.createElement('button');
// button.className = 'text-extractor-button';
// button.textContent = 'Whaley';
// document.body.appendChild(button);
const button = document.createElement('button');
button.className = 'whale-button';
const img = document.createElement('img');
img.src = chrome.runtime.getURL('whale.png');
img.className = 'whale-img';
img.alt = 'Whale';  // Add alt text
console.log('Whale image URL:', img.src); // Debug image path
button.appendChild(img);
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

        // Add points and update progress if word is mastered
        if (isMastering) {
            console.log('Word mastered! Triggering animation...'); // Debug log
            points += POINTS_PER_WORD;
            updatePoints();
            updateProgress();
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

// Create function to handle translation
async function translatePageText() {
    try {
        console.log("Starting translation...");
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

// Update the processYoutubeVideos function
async function processYoutubeVideos() {
    const iframes = document.querySelectorAll('iframe');
    
    for (const iframe of iframes) {
        const src = iframe.src;
        const videoIdMatch = src.match(/youtube\.com\/embed\/([^?]+)/);
        if (videoIdMatch) {
            const videoId = videoIdMatch[1];
            try {
                const transcript = await proxyYoutubeRequest(videoId);
                console.log(`Transcript for video ${videoId}:`, transcript);
            } catch (error) {
                console.error(`Error fetching transcript for video ${videoId}:`, error);
            }
        }
    }

    const links = document.querySelectorAll('a');
    for (const link of links) {
        const href = link.href;
        const videoIdMatch = href.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
        if (videoIdMatch) {
            const videoId = videoIdMatch[1];
            try {
                const transcript = await proxyYoutubeRequest(videoId);
                console.log(`Transcript for video ${videoId}:`, transcript);
            } catch (error) {
                console.error(`Error fetching transcript for video ${videoId}:`, error);
            }
        }
    }
}

// Add this to your existing window.addEventListener('load', ...) handler
window.addEventListener('load', async () => {
    await translatePageText();
    await processYoutubeVideos();
});

// Also observe DOM changes to catch dynamically added videos
const youtubeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            processYoutubeVideos();
        }
    });
});

youtubeObserver.observe(document.body, {
    childList: true,
    subtree: true
});

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
// const chatButton = document.createElement('button');
// chatButton.className = 'icon-button chat-button';
// chatButton.innerHTML = `
//     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//         <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
//     </svg>
// `;
// document.body.appendChild(chatButton);

// // Create menu button
// const menuButton = document.createElement('button');
// menuButton.className = 'icon-button menu-button';
// menuButton.innerHTML = `
//     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//         <line x1="3" y1="12" x2="21" y2="12"></line>
//         <line x1="3" y1="6" x2="21" y2="6"></line>
//         <line x1="3" y1="18" x2="21" y2="18"></line>
//     </svg>
// `;
// document.body.appendChild(menuButton);

const chatButton = document.createElement('button');
chatButton.className = 'icon-button chat-button';
chatButton.innerHTML = `
  <img src="${chrome.runtime.getURL('chat.png')}" 
       class="custom-icon" 
       alt="Chat"
       width="40"
       height="40">
`;
document.body.appendChild(chatButton);

// First, create the menu modal
const menuModal = document.createElement('div');
menuModal.className = 'menu-modal';
menuModal.innerHTML = `
    <div class="menu-container">
        <div class="progress-container">
            <div class="progress-bar"></div>
        </div>
        <div class="menu-header">
            <div class="points-display">Points: ${points}</div>
            <select id="language-selector">
                ${SUPPORTED_LANGUAGES.map(lang => 
                    `<option value="${lang.code}">${lang.name}</option>`
                ).join('')}
            </select>
        </div>
        <div class="menu-options">
            <div id="word-bank" class="menu-option">
                <span class="option-icon">📚</span>
                Word Bank
            </div>
            <div id="history" class="menu-option">
                <span class="option-icon">📖</span>
                History
            </div>
        </div>
    </div>
`;
document.body.appendChild(menuModal);

// Add language change handler
document.getElementById('language-selector')?.addEventListener('change', (e) => {
    const selectedCode = (e.target as HTMLSelectElement).value;
    currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedCode) || SUPPORTED_LANGUAGES[0];
    translatePageText(); // Retranslate page with new language
});

// Then create the menu button and add its click handler
const menuButton = document.createElement('button');
menuButton.className = 'icon-button menu-button';
menuButton.innerHTML = `
    <img src="${chrome.runtime.getURL('menu.png')}" 
         class="custom-icon" 
         alt="Menu"
         width="40"
         height="40">
`;
document.body.appendChild(menuButton);

// Single click handler for menu button
menuButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent document click from immediately closing
    menuModal.classList.toggle('show');
    updateProgress();
    updatePoints();
});

// Single click outside handler
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
    const pointsDisplay = document.querySelector('.points-display');
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
                    // wrapper.appendChild(overlay);
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

// Add function to update progress bar
function updateProgress() {
    const masteredWords = getMasteredWords();
    const progressBar = document.querySelector('.progress-bar') as HTMLElement;
    if (!progressBar) return;

    const progress = Math.min((masteredWords.length / WORDS_FOR_GOLDEN) * 100, 100);
    progressBar.style.width = `${progress}%`;
    
    // Change color when reaching the goal
    if (masteredWords.length >= WORDS_FOR_GOLDEN) {
        progressBar.style.backgroundColor = PROGRESS_COLORS.golden;
    } else {
        progressBar.style.backgroundColor = PROGRESS_COLORS.normal;
    }
} 