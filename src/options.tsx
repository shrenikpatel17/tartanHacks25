import React, { useState, useEffect } from 'react';

function Options() {
  const [apiKey, setApiKey] = useState('');

  const saveApiKey = () => {
    chrome.storage.local.set({ openaiApiKey: apiKey });
  };

  return (
    <div>
      <h1>Extension Settings</h1>
      <input 
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Enter your OpenAI API key"
      />
      <button onClick={saveApiKey}>Save</button>
    </div>
  );
}

export default Options; 