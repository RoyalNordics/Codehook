import React, { useState, useEffect } from "react";
import "./index.css";

const CodeHookUI = () => {
  // Configuration state
  const [webhookUrl, setWebhookUrl] = useState("https://codehook.onrender.com/api/webhook");
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState("openai"); // openai, anthropic, etc.
  const [isConfigured, setIsConfigured] = useState(false);
  
  // Example logs/history
  const [logs, setLogs] = useState([]);
  
  useEffect(() => {
    // Load saved configuration if available
    const savedConfig = localStorage.getItem("codehookConfig");
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setWebhookUrl(config.webhookUrl || "");
      setApiKey(config.apiKey || "");
      setProvider(config.provider || "openai");
      setIsConfigured(true);
    }
    
    // Load mock logs for demonstration
    const mockLogs = [
      {
        id: "log1",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        prompt: "Hey CodeHook, create a React button component with primary and secondary variants",
        status: "completed",
      },
      {
        id: "log2",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        prompt: "Hey CodeHook, write a function to calculate Fibonacci numbers",
        status: "completed",
      }
    ];
    setLogs(mockLogs);
  }, []);
  
  const saveConfiguration = () => {
    const config = {
      webhookUrl,
      apiKey,
      provider
    };
    localStorage.setItem("codehookConfig", JSON.stringify(config));
    setIsConfigured(true);
    
    // In a real implementation, you might also want to test the connection
    // or register the webhook with a server
  };
  
  const generateExtensionCode = () => {
    // This would generate the extension code with the configured webhook URL
    // For now, we just show it has been clicked
    alert("Extension code generated! In a real implementation, this would create a downloadable extension with your webhook URL configured.");
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#111a22] dark group/design-root overflow-x-hidden"
      style={{fontFamily: "\"Plus Jakarta Sans\", \"Noto Sans\", sans-serif"}}
    >
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#243647] px-10 py-3">
          <div className="flex items-center gap-4 text-white">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_6_535)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                    fill="currentColor"
                  ></path>
                </g>
                <defs>
                  <clipPath id="clip0_6_535"><rect width="48" height="48" fill="white"></rect></clipPath>
                </defs>
              </svg>
            </div>
            <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">CodeHook</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-white text-sm font-medium leading-normal" href="#">Dashboard</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">Documentation</a>
              <a className="text-white text-sm font-medium leading-normal" href="#">Settings</a>
            </div>
          </div>
        </header>
        
        <div className="px-4 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 gap-8">
            {/* Hero Section */}
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[280px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-start justify-end px-4 pb-10 @[480px]:px-10"
                  style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url(\"https://cdn.usegalileo.ai/sdxl10/2e12c76b-aa52-4c15-b351-bf41202e37eb.png\")"}}
                >
                  <div className="flex flex-col gap-2 text-left">
                    <h1
                      className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                    >
                      CodeHook Configuration
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      Set up your CodeHook to connect with AI chats and generate code instantly
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Configuration Section */}
            <div className="flex flex-col gap-8 px-6 py-8 rounded-lg border border-[#344d65] bg-[#1a2632]">
              <h2 className="text-white text-xl font-bold">Configure Your CodeHook</h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="webhook" className="text-[#93adc8] text-sm font-medium">
                    Webhook URL
                  </label>
                  <input
                    type="text"
                    id="webhook"
                    className="px-4 py-3 bg-[#111a22] border border-[#344d65] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1980e6] w-full"
                    placeholder="https://your-webhook-url.com/api/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <p className="text-[#93adc8] text-xs">
                    This is where CodeHook will send AI chat prompts. Your server should be running at this URL.
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="apiKey" className="text-[#93adc8] text-sm font-medium">
                    API Key (Optional)
                  </label>
                  <input
                    type="password"
                    id="apiKey"
                    className="px-4 py-3 bg-[#111a22] border border-[#344d65] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1980e6] w-full"
                    placeholder="Your API key"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <p className="text-[#93adc8] text-xs">
                    If your webhook requires authentication, provide your API key here.
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <label htmlFor="provider" className="text-[#93adc8] text-sm font-medium">
                    AI Provider
                  </label>
                  <select
                    id="provider"
                    className="px-4 py-3 bg-[#111a22] border border-[#344d65] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1980e6] w-full"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                  >
                    <option value="openai">OpenAI (ChatGPT)</option>
                    <option value="anthropic">Anthropic (Claude)</option>
                    <option value="both">Both Providers</option>
                  </select>
                  <p className="text-[#93adc8] text-xs">
                    Select which AI chat platforms you want to use with CodeHook.
                  </p>
                </div>
                
                <div className="flex gap-4 mt-4">
                  <button
                    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#1980e6] text-white text-base font-bold leading-normal tracking-[0.015em]"
                    onClick={saveConfiguration}
                  >
                    Save Configuration
                  </button>
                  
                  <button
                    className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#243647] text-white text-base font-bold leading-normal tracking-[0.015em]"
                    onClick={generateExtensionCode}
                  >
                    Generate Extension
                  </button>
                </div>
              </div>
            </div>
            
            {/* How to Use Section */}
            <div className="flex flex-col gap-6 px-6 py-8 rounded-lg border border-[#344d65] bg-[#1a2632]">
              <h2 className="text-white text-xl font-bold">How to Use CodeHook</h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-base font-bold">1. Configure Your Settings</h3>
                  <p className="text-[#93adc8] text-sm">
                    Enter your webhook URL and optionally your API key.
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-base font-bold">2. Generate and Install Extension</h3>
                  <p className="text-[#93adc8] text-sm">
                    Click the "Generate Extension" button to create a browser extension with your configuration.
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <h3 className="text-white text-base font-bold">3. Use with AI Chats</h3>
                  <p className="text-[#93adc8] text-sm">
                    Start any message with "Hey CodeHook" in your AI chat, and the extension will automatically
                    send it to your webhook.
                  </p>
                  <div className="bg-[#111a22] p-4 rounded-lg border border-[#344d65] text-white">
                    <code>Hey CodeHook, create a React button component with hover effects</code>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity Section */}
            <div className="flex flex-col gap-6 px-6 py-8 rounded-lg border border-[#344d65] bg-[#1a2632]">
              <h2 className="text-white text-xl font-bold">Recent Activity</h2>
              
              {logs.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {logs.map((log) => (
                    <div key={log.id} className="flex flex-col gap-2 p-4 bg-[#111a22] rounded-lg border border-[#344d65]">
                      <div className="flex justify-between items-center">
                        <span className="text-[#93adc8] text-xs">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          log.status === "completed" ? "bg-[#0d3320] text-[#4ade80]" : "bg-[#3a2232] text-[#e33e5a]"
                        }`}>
                          {log.status}
                        </span>
                      </div>
                      <p className="text-white text-sm font-medium">{log.prompt}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#93adc8] text-sm">No recent activity.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeHookUI;
