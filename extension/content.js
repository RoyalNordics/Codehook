// CodeHook content script - monitors AI chat messages
console.log("CodeHook AI listener initialized");

// Configuration
const WEBHOOK_URL = "https://codehook.onrender.com/api/webhook"; // Replace with your actual webhook URL

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
  responseContainer.style.cssText = `
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
  `;
  
  // Create header
  const header = document.createElement("div");
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    border-bottom: 1px solid #344d65;
    padding-bottom: 8px;
  `;
  
  const title = document.createElement("h3");
  title.textContent = "CodeHook Result";
  title.style.cssText = `
    margin: 0;
    font-size: 16px;
    font-weight: 700;
  `;
  
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
  `;
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
    codeBlock.style.cssText = `
      background-color: #111a22;
      border-radius: 4px;
      padding: 12px;
      overflow-x: auto;
      font-family: monospace;
      font-size: 14px;
      color: #93adc8;
      margin-top: 12px;
    `;
    codeBlock.textContent = data.generatedCode;
    content.appendChild(codeBlock);
  } else {
    // Show raw response
    const responseText = document.createElement("pre");
    responseText.style.cssText = `
      background-color: #111a22;
      border-radius: 4px;
      padding: 12px;
      overflow-x: auto;
      font-family: monospace;
      font-size: 14px;
      color: #93adc8;
      margin-top: 12px;
    `;
    responseText.textContent = JSON.stringify(data, null, 2);
    content.appendChild(responseText);
  }
  
  responseContainer.appendChild(content);
  document.body.appendChild(responseContainer);
}

// Function to display errors
function displayError(message) {
  const errorContainer = document.createElement("div");
  errorContainer.style.cssText = `
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
  `;
  
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  closeButton.style.cssText = `
    position: absolute;
    top: 8px;
    right: 8px;
    background: none;
    border: none;
    color: #e33e5a;
    font-size: 20px;
    cursor: pointer;
  `;
  closeButton.onclick = () => {
    document.body.removeChild(errorContainer);
  };
  
  const errorTitle = document.createElement("h3");
  errorTitle.textContent = "CodeHook Error";
  errorTitle.style.cssText = `
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 700;
  `;
  
  const errorMessage = document.createElement("p");
  errorMessage.textContent = message;
  errorMessage.style.cssText = `
    margin: 0;
    font-size: 14px;
  `;
  
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
window.addEventListener("load", initialize);
