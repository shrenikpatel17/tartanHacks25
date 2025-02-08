(()=>{"use strict";const n=document.createElement("style");n.textContent="\n.text-extractor-button {\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  z-index: 10000;\n  padding: 10px 20px;\n  background-color: #2196F3;\n  color: white;\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n  box-shadow: 0 2px 5px rgba(0,0,0,0.2);\n}\n\n.text-extractor-modal {\n  display: none;\n  position: fixed;\n  bottom: 80px;\n  right: 20px;\n  width: 300px;\n  max-height: 400px;\n  background-color: white;\n  border-radius: 5px;\n  box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n  z-index: 10000;\n  padding: 15px;\n  overflow-y: auto;\n}\n\n.text-extractor-modal.show {\n  display: block;\n}\n\n.text-extractor-close {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  cursor: pointer;\n  font-weight: bold;\n}\n\n.icon-button {\n  position: fixed;\n  right: 20px;\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background-color: #2196F3;\n  color: white;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 2px 5px rgba(0,0,0,0.2);\n  z-index: 10000;\n}\n\n.chat-button {\n  bottom: 140px;\n}\n\n.menu-button {\n  bottom: 80px;\n}\n\n.menu-modal {\n  display: none;\n  position: fixed;\n  bottom: 140px;\n  right: 20px;\n  width: 200px;\n  background-color: white;\n  border-radius: 10px;\n  box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n  z-index: 9999;\n  overflow: hidden;\n}\n\n.menu-modal.show {\n  display: block;\n}\n\n.menu-header {\n  background-color: #1976D2;\n  color: white;\n  padding: 10px;\n  text-align: center;\n  font-weight: bold;\n}\n\n.menu-button-container {\n  padding: 10px;\n}\n\n.menu-option {\n  width: 100%;\n  padding: 10px;\n  margin: 5px 0;\n  border: none;\n  background-color: #E3F2FD;\n  border-radius: 5px;\n  cursor: pointer;\n  text-align: left;\n  transition: background-color 0.2s;\n}\n\n.menu-option:hover {\n  background-color: #BBDEFB;\n}\n\n.word-bank-modal {\n  display: none;\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 80%;\n  max-width: 600px;\n  max-height: 80vh;\n  background-color: white;\n  border-radius: 15px;\n  box-shadow: 0 4px 20px rgba(0,0,0,0.15);\n  z-index: 10002;\n  overflow: hidden;\n}\n\n.word-bank-modal.show {\n  display: block;\n}\n\n.word-bank-header {\n  background-color: #1976D2;\n  color: white;\n  padding: 20px;\n  font-size: 1.5em;\n  font-weight: bold;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.word-bank-close {\n  cursor: pointer;\n  font-size: 1.5em;\n  color: white;\n}\n\n.word-bank-content {\n  padding: 20px;\n  overflow-y: auto;\n  max-height: calc(80vh - 80px);\n}\n\n.word-bank-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));\n  gap: 15px;\n  padding: 10px;\n}\n\n.word-pair {\n  background: #E3F2FD;\n  border-radius: 10px;\n  padding: 15px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  transition: transform 0.2s;\n}\n\n.word-pair:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 8px rgba(0,0,0,0.1);\n}\n\n.original-word {\n  color: #666;\n  font-size: 0.9em;\n  margin-bottom: 5px;\n}\n\n.translated-word-display {\n  background-color: #4CAF50;\n  color: white;\n  padding: 2px 6px;\n  border-radius: 12px;\n  font-weight: bold;\n  font-size: 1.1em;\n}\n\n.no-words-message {\n  text-align: center;\n  color: #666;\n  padding: 40px;\n  font-size: 1.1em;\n}\n\n.chat-response {\n  position: fixed;\n  bottom: 200px;\n  right: 20px;\n  background: white;\n  padding: 15px;\n  border-radius: 10px;\n  box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n  max-width: 350px;\n  width: 350px;\n  max-height: 500px;\n  z-index: 10000;\n  display: none;\n  overflow-y: auto;\n}\n\n.chat-response.show {\n  display: block;\n}\n\n.chat-message {\n  margin-bottom: 15px;\n  padding: 10px;\n  border-radius: 8px;\n}\n\n.user-message {\n  background: #E3F2FD;\n  margin-left: 20px;\n  margin-right: 5px;\n}\n\n.ai-message {\n  background: #F5F5F5;\n  margin-right: 20px;\n  margin-left: 5px;\n}\n\n.message-text {\n  margin-bottom: 5px;\n}\n\n.response-target-language {\n  color: #2196F3;\n  margin-bottom: 4px;\n  font-weight: bold;\n}\n\n.response-english {\n  color: #666;\n  font-style: italic;\n}\n\n.timestamp {\n  font-size: 0.8em;\n  color: #999;\n  margin-top: 4px;\n}\n\n.chat-button.recording {\n  background-color: #ff4444;\n  animation: pulse 1.5s infinite;\n}\n\n@keyframes pulse {\n  0% { transform: scale(1); }\n  50% { transform: scale(1.1); }\n  100% { transform: scale(1); }\n}\n",document.head.appendChild(n);const e=document.createElement("button");e.className="text-extractor-button",e.textContent="Whaley",document.body.appendChild(e);const t=document.createElement("div");t.className="text-extractor-modal",t.innerHTML='\n  <span class="text-extractor-close">&times;</span>\n  <div class="text-extractor-content"></div>\n',document.body.appendChild(t);const o=t.querySelector(".text-extractor-close"),a=t.querySelector(".text-extractor-content");let r=0,s="",i=[];function c(n){return n.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}async function d(){return document.body.innerText}async function l(){try{console.log("Starting translation...");const n=await d();s=n;const e=await async function(n,e){try{const t=(await chrome.runtime.sendMessage({action:"getApiKey"})).apiKey;if(!t)throw new Error("API key not found");const o=function(n){const e=n.match(/\b[\w']+\b/g)||[];return Array.from(new Set(e)).sort((()=>.5-Math.random())).slice(0,5)}(n);console.log("Words to translate:",o);const a=`Translate only these 5 words to ${e}: ${o.join(", ")}. \n                       Return ONLY a JSON object with the English words as keys and their ${e} translations as values.\n                       Example format: {"word1": "translation1", "word2": "translation2"}`,r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${t}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4",messages:[{role:"user",content:a}],temperature:.5})}),s=await r.json();if(!s.choices||!s.choices[0]||!s.choices[0].message)throw console.error("Unexpected API response:",s),new Error("Invalid API response structure");const i=s.choices[0].message.content;console.log("Translation response:",i);try{const n=JSON.parse(i);return console.log("Final translations:",n),n}catch(n){throw console.error("Error parsing translation response:",n),new Error("Invalid translation format received")}}catch(n){throw console.error("Translation error:",n),n}}(n,"French");console.log("Got translations:",e),function(n){if(!document.getElementById("translator-style")){const n=document.createElement("style");n.id="translator-style",n.textContent="\n            .translated-word {\n                color: black;\n                background-color: #E3F2FD; /* very light blue */\n                padding: 2px 6px;\n                border-radius: 12px;\n                cursor: pointer;\n                transition: all 0.3s ease;\n                position: relative;\n                display: inline-block;\n                margin: 0 2px;\n            }\n            .translated-word.click-1 {\n                background-color: #90CAF9; /* light blue */\n            }\n            .translated-word.click-2 {\n                background-color: #2196F3; /* medium blue */\n                color: white;\n            }\n            .translated-word.click-3 {\n                background-color: #4CAF50; /* green */\n                color: white;\n            }\n            .translated-word:hover::after {\n                content: attr(data-original);\n                position: absolute;\n                left: 50%;\n                transform: translateX(-50%);\n                bottom: 100%;\n                background: white;\n                color: black;\n                padding: 4px 8px;\n                border-radius: 15px;\n                font-size: 14px;\n                white-space: nowrap;\n                box-shadow: 0 2px 4px rgba(0,0,0,0.2);\n                border: 1px solid #ddd;\n                z-index: 10001;\n                margin-bottom: 5px;\n            }\n        ",document.head.appendChild(n)}function e(n){const e=n.target;if(!e.classList.contains("translated-word"))return;const t=e.getAttribute("data-original");if(!t)return;const o=document.querySelectorAll(`.translated-word[data-original="${t}"]`),a=parseInt(e.getAttribute("data-clicks")||"0"),s=(a+1)%4,i=3===s&&2===a;o.forEach((n=>{n.classList.remove("click-1","click-2","click-3"),s>0&&n.classList.add(`click-${s}`),n.setAttribute("data-clicks",s.toString())})),i&&(r+=100,function(){const n=document.querySelector(".menu-header");n&&(n.textContent=`Points: ${r}`)}())}const t=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const e=n.parentNode;return e&&("SCRIPT"===e.tagName||"STYLE"===e.tagName||e.classList.contains("translated-word"))?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}});let o;const a=[];for(;o=t.nextNode();)a.push(o);a.forEach((t=>{!function(t){let o=t.textContent||"";const a=document.createElement("div");let r=o;if(Object.entries(n).forEach((([n,e])=>{const t=new RegExp(`\\b${n}\\b`,"gi");r=r.replace(t,`<span class="translated-word" \n                      data-original="${n}" \n                      data-clicks="0">${e}</span>`)})),r!==o){a.innerHTML=r,a.querySelectorAll(".translated-word").forEach((n=>{n.addEventListener("click",e)}));const n=document.createDocumentFragment();for(;a.firstChild;)n.appendChild(a.firstChild);t.parentNode?.replaceChild(n,t)}}(t)}))}(e),a&&(a.textContent="Translation complete! Hover over blue text to see original words.")}catch(n){console.error("Translation failed:",n),a&&(a.textContent=`Translation failed: ${n instanceof Error?n.message:"Unknown error"}`)}}window.addEventListener("load",l),e.addEventListener("click",l),o?.addEventListener("click",(()=>{t.classList.remove("show")})),chrome.runtime.onMessage.addListener(((n,e,t)=>("extractText"===n.action&&t({text:d()}),!0)));const p=document.createElement("button");p.className="icon-button chat-button",p.innerHTML='\n    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>\n    </svg>\n',document.body.appendChild(p);const m=document.createElement("button");m.className="icon-button menu-button",m.innerHTML='\n    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n        <line x1="3" y1="12" x2="21" y2="12"></line>\n        <line x1="3" y1="6" x2="21" y2="6"></line>\n        <line x1="3" y1="18" x2="21" y2="18"></line>\n    </svg>\n',document.body.appendChild(m);const u=document.createElement("div");u.className="menu-modal",u.innerHTML=`\n    <div class="menu-header">\n        Points: ${r}\n    </div>\n    <div class="menu-button-container">\n        <button class="menu-option" id="word-bank">Word Bank</button>\n        <button class="menu-option" id="history">History</button>\n    </div>\n`,document.body.appendChild(u),m.addEventListener("click",(()=>{u.classList.toggle("show")})),document.addEventListener("click",(n=>{m.contains(n.target)||u.contains(n.target)||!u.classList.contains("show")||u.classList.remove("show")})),document.getElementById("word-bank")?.addEventListener("click",(()=>{console.log("Word Bank clicked")})),document.getElementById("history")?.addEventListener("click",(()=>{console.log("History clicked")}));const g=document.createElement("div");g.className="word-bank-modal",g.innerHTML='\n    <div class="word-bank-header">\n        Word Bank\n        <span class="word-bank-close">&times;</span>\n    </div>\n    <div class="word-bank-content">\n        <div class="word-bank-grid"></div>\n    </div>\n',document.body.appendChild(g),document.getElementById("word-bank")?.addEventListener("click",(()=>{(function(){const n=g.querySelector(".word-bank-grid");if(!n)return;const e=function(){const n=[];return document.querySelectorAll(".translated-word").forEach((e=>{if(e.classList.contains("click-3")){const t=e.getAttribute("data-original"),o=e.textContent;t&&o&&n.push([t,o])}})),[...new Set(n.map((n=>JSON.stringify(n))))].map((n=>JSON.parse(n)))}();0!==e.length?n.innerHTML=e.map((([n,e])=>`\n        <div class="word-pair">\n            <div class="original-word">${n}</div>\n            <div class="translated-word-display">${e}</div>\n        </div>\n    `)).join(""):n.innerHTML='\n            <div class="no-words-message">\n                No mastered words yet! Click on translated words three times to add them to your word bank.\n            </div>\n        '})(),g.classList.add("show"),u.classList.remove("show")})),g.querySelector(".word-bank-close")?.addEventListener("click",(()=>{g.classList.remove("show")})),document.addEventListener("click",(n=>{g.contains(n.target)||document.getElementById("word-bank")?.contains(n.target)||!g.classList.contains("show")||g.classList.remove("show")}));let h=!1,x=null;const w=[];p.addEventListener("click",(async()=>{try{h?(x?.stop(),h=!1,p.classList.remove("recording")):(w.length=0,x=await async function(){try{const n=await navigator.mediaDevices.getUserMedia({audio:!0}),e=new MediaRecorder(n),t=[];return e.ondataavailable=n=>{t.push(n.data)},e.onstop=async()=>{new Blob(t,{type:"audio/webm"}),n.getTracks().forEach((n=>n.stop()))},e.start(),e}catch(n){throw console.error("Error starting recording:",n),n}}(),h=!0,p.classList.add("recording"),b.textContent="Recording... Click again to stop.",b.classList.add("show"),x.ondataavailable=n=>{w.push(n.data)},x.onstop=async()=>{const n=new Blob(w,{type:"audio/webm"});b.innerHTML="Processing...";try{const e=await async function(n,e,t){try{const o=(await chrome.runtime.sendMessage({action:"getApiKey"})).apiKey;if(!o)throw new Error("API key not found");const a=new FormData;a.append("file",n,"audio.webm"),a.append("model","whisper-1"),a.append("language","en");const r=await fetch("https://api.openai.com/v1/audio/transcriptions",{method:"POST",headers:{Authorization:`Bearer ${o}`},body:a}),s=await r.json();if(!s.text)throw new Error("Failed to transcribe audio");console.log("Transcribed text:",s.text);const i=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${o}`,"Content-Type":"application/json"},body:JSON.stringify({model:"gpt-4",messages:[{role:"system",content:`You are a helpful language learning assistant. You have access to the following page context:\n                        \n                        ${t}\n                        \n                        When the user asks a question, use this context to provide accurate answers. Create your response in both ${e} and English. Format your response exactly like this example:\n                        [${e}] Bonjour! Comment puis-je vous aider aujourd'hui?\n                        [English] Hello! How can I help you today?`},{role:"user",content:s.text}],temperature:.7,max_tokens:500})}),c=await i.json();if(!c.choices?.[0]?.message?.content)throw new Error("Failed to get response");const d=c.choices[0].message.content,[l,p]=d.split("\n").map((n=>n.trim())).map((n=>{const e=n.match(/\[(.*?)\] (.*)/);return e?e[2]:n}));return{userText:s.text,targetLanguage:l,english:p}}catch(n){throw console.error("Audio chat error:",n),n}}(n,"French",s);i.push({type:"user",text:e.userText,timestamp:new Date}),i.push({type:"ai",targetLanguage:e.targetLanguage,english:e.english,timestamp:new Date}),b.innerHTML=i.map((n=>"user"===n.type?`\n                <div class="chat-message user-message">\n                    <div class="message-text">${n.text}</div>\n                    <div class="timestamp">${c(n.timestamp)}</div>\n                </div>\n            `:`\n                <div class="chat-message ai-message">\n                    <div class="response-target-language">${n.targetLanguage}</div>\n                    <div class="response-english">${n.english}</div>\n                    <div class="timestamp">${c(n.timestamp)}</div>\n                </div>\n            `)).join(""),b.scrollTop=b.scrollHeight}catch(n){b.textContent="Failed to process audio. Please try again.",console.error(n)}})}catch(n){console.error("Error with recording:",n),b.textContent="Error accessing microphone. Please check permissions.",b.classList.add("show")}})),document.addEventListener("click",(n=>{p.contains(n.target)||b.contains(n.target)||h||b.classList.remove("show")}));const b=document.createElement("div");b.className="chat-response",document.body.appendChild(b)})();