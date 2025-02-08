import React, { useState } from 'react';
import './App.css';

function App() {
  const [extractedText, setExtractedText] = useState<string>('');

  const handleExtractText = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab?.id) {
        chrome.tabs.sendMessage(
          currentTab.id,
          { action: "extractText" },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(chrome.runtime.lastError);
              setExtractedText('Error: Could not connect to the page. Please refresh the page and try again.');
              return;
            }
            if (response?.text) {
              setExtractedText(response.text);
            }
          }
        );
      }
    });
  };

  return (
    <div className="App">
      <h1>Text Extractorrr</h1>
      <button onClick={handleExtractText}>Extract Text</button>
      {extractedText && (
        <div>
          <h3>Extracted Text:</h3>
          <pre>{extractedText}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
