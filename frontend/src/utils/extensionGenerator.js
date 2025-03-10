export const generateExtensionCode = (webhookUrl, provider = "both") => {
  const manifestJson = `{
  "manifest_version": 3,
  "name": "CodeHook AI Chat Listener",
  "version": "1.0",
  "description": "Listens for AI chat messages starting with \\"Hey CodeHook\\" and sends them to the CodeHook webhook",
  "permissions": ["scripting", "activeTab"],
  "host_permissions": [
    "https://*.anthropic.com/*",
    "https://*.openai.com/*",
    "https://*.claude.ai/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "content_scripts": [
    {
      "matches": [
        "https://*.anthropic.com/*", 
        "https://*.openai.com/*",
        "https://*.claude.ai/*"
      ],
      "js": ["content.js"]
    }
  ]
}`;

  const contentJs = `// CodeHook content script - monitors AI chat messages
console.log("CodeHook AI listener initialized");

// Configuration
const WEBHOOK_URL = "${webhookUrl}"; // Configured webhook URL

// Function to send prompts to the webhook
async function sendToWebhook(message) {
  try {
    console.log("Sending to CodeHook webhook:", message);
    
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });
    
    const data = await response.json();
    console.log("Webhook response:", data);
    
    // Display the response in the UI
    displayWebhookResponse(data);
    
    return data;
  } catch (error) {
    console.error("Error sending to CodeHook webhook:", error);
    displayError(error.message);
    return null;
  }
}

// Function to create and display webhook response UI
function displayWebhookResponse(data) {
  // Create a response container
  const responseContainer = document.createElement("div");
  responseContainer.className = "codehook-response";
  responseContainer.style.cssText = \`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    max-height: 500px;
    background-color: #1a2632;
    border: 1px solid #344d65;
    border-radius: 8px;
    padding: 16px;
    color: white;
    font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
    z-index: 10000;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  \`;
  
  // Create header
  const header = document.createElement("div");
  header.style.cssText = \`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    border-bottom: 1px solid #344d65;
    padding-bottom: 8px;
  \`;
  
  const title = document.createElement("h3");
  title.textContent = "CodeHook Result";
  title.style.cssText = \`
    margin: 0;
    font-size: 16px;
    font-weight: 700;
  \`;
  
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.style.cssText = \`
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  \`;
  closeButton.onclick = () => {
    document.body.removeChild(responseContainer);
  };
  
  header.appendChild(title);
  header.appendChild(closeButton);
  responseContainer.appendChild(header);
  
  // Create content area
  const content = document.createElement("div");
  
  // Show generated code if available
  if (data.generatedCode) {
    const codeBlock = document.createElement("pre");
    codeBlock.style.cssText = \`
      background-color: #111a22;
      border-radius: 4px;
      padding: 12px;
      overflow-x: auto;
      font-family: monospace;
      font-size: 14px;
      color: #93adc8;
      margin-top: 12px;
    \`;
    codeBlock.textContent = data.generatedCode;
    content.appendChild(codeBlock);
  } else {
    // Show raw response
    const responseText = document.createElement("pre");
    responseText.style.cssText = \`
      background-color: #111a22;
      border-radius: 4px;
      padding: 12px;
      overflow-x: auto;
      font-family: monospace;
      font-size: 14px;
      color: #93adc8;
      margin-top: 12px;
    \`;
    responseText.textContent = JSON.stringify(data, null, 2);
    content.appendChild(responseText);
  }
  
  responseContainer.appendChild(content);
  document.body.appendChild(responseContainer);
}

// Function to display errors
function displayError(message) {
  const errorContainer = document.createElement("div");
  errorContainer.style.cssText = \`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px;
    background-color: #3a2232;
    border: 1px solid #e33e5a;
    border-radius: 8px;
    padding: 16px;
    color: #e33e5a;
    font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  \`;
  
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.style.cssText = \`
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    color: #e33e5a;
    font-size: 20px;
    cursor: pointer;
  \`;
  closeButton.onclick = () => {
    document.body.removeChild(errorContainer);
  };
  
  const errorTitle = document.createElement("h3");
  errorTitle.textContent = "CodeHook Error";
  errorTitle.style.cssText = \`
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 700;
  \`;
  
  const errorMessage = document.createElement("p");
  errorMessage.textContent = message;
  errorMessage.style.cssText = \`
    margin: 0;
    font-size: 14px;
  \`;
  
  errorContainer.appendChild(closeButton);
  errorContainer.appendChild(errorTitle);
  errorContainer.appendChild(errorMessage);
  document.body.appendChild(errorContainer);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(errorContainer)) {
      document.body.removeChild(errorContainer);
    }
  }, 5000);
}

// Function to monitor DOM changes for AI responses
function setupMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes && mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          // Look for text content that might contain AI responses
          if (node.textContent && typeof node.textContent === "string") {
            const text = node.textContent.trim();
            
            // Check if the message starts with "Hey CodeHook"
            if (text.startsWith("Hey CodeHook")) {
              console.log("CodeHook trigger detected:", text);
              sendToWebhook(text);
            }
          }
        });
      }
    });
  });
  
  // Start observing the document body for changes
  observer.observe(document.body, { 
    childList: true, 
    subtree: true, 
    characterData: true 
  });
  
  console.log("CodeHook mutation observer started");
}

// Initialize the extension
function initialize() {
  console.log("Initializing CodeHook extension");
  
  // Add required fonts
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;700;800";
  document.head.appendChild(fontLink);
  
  // Setup the mutation observer
  setupMutationObserver();
}

// Start the extension
window.addEventListener("load", initialize);`;

  const popupHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CodeHook</title>
  <style>
    body {
      width: 320px;
      font-family: "Plus Jakarta Sans", "Noto Sans", sans-serif;
      margin: 0;
      padding: 0;
      background-color: #111a22;
      color: white;
    }
    
    .container {
      padding: 16px;
    }
    
    header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 12px;
      border-bottom: 1px solid #344d65;
      margin-bottom: 16px;
    }
    
    .logo {
      width: 24px;
      height: 24px;
    }
    
    h1 {
      font-size: 18px;
      font-weight: 700;
      margin: 0;
    }
    
    .status {
      padding: 12px;
      background-color: #1a2632;
      border: 1px solid #344d65;
      border-radius: 8px;
      margin-bottom: 16px;
    }
    
    .status-text {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    
    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #4ade80;
    }
    
    .instructions {
      font-size: 14px;
      line-height: 1.5;
      color: #93adc8;
    }
    
    .instructions code {
      background-color: #1a2632;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    
    footer {
      margin-top: 16px;
      font-size: 12px;
      color: #93adc8;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="logo">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
      <h1>CodeHook</h1>
    </header>
    
    <div class="status">
      <div class="status-text">
        <div class="status-indicator"></div>
        <div>Listening for AI chat messages</div>
      </div>
    </div>
    
    <div class="instructions">
      <p>Start any message with <code>Hey CodeHook</code> in AI chat interfaces to trigger CodeHook.</p>
      <p>Example:</p>
      <p><code>Hey CodeHook, create a React button component with hover effects</code></p>
    </div>
    
    <footer>
      Version 1.0
    </footer>
  </div>
</body>
</html>`;

  // Create a ZIP file structure (simplified - in a real implementation you would use JSZip or similar)
  const extensionFiles = {
    "manifest.json": manifestJson,
    "content.js": contentJs,
    "popup.html": popupHtml,
    // You would also include icon files in a real implementation
  };

  return extensionFiles;
};
