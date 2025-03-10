import React, { useState } from "react";

const TestPanel = ({ webhookUrl = "https://codehook.onrender.com/api/webhook" }) => {
  const [message, setMessage] = useState("Hey CodeHook, create a simple counter in React");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-6 px-6 py-8 rounded-lg border border-[#344d65] bg-[#1a2632] my-8">
      <h2 className="text-white text-xl font-bold">Test CodeHook</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="mb-4">
          <label htmlFor="message" className="block text-[#93adc8] text-sm font-medium mb-2">
            Test Message
          </label>
          <textarea
            id="message"
            rows="4"
            className="w-full px-4 py-3 bg-[#111a22] border border-[#344d65] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#1980e6]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>
        
        <div>
          <button
            type="submit"
            className="flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-[#1980e6] text-white text-base font-bold leading-normal tracking-[0.015em]"
            disabled={loading}
          >
            {loading ? "Processing..." : "Test Webhook"}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="p-4 bg-[#3a2232] border border-[#e33e5a] text-[#e33e5a] rounded-lg">
          {error}
        </div>
      )}
      
      {response && (
        <div className="mt-6">
          <h2 className="text-white text-xl font-semibold mb-4">Webhook Response:</h2>
          <div className="bg-[#111a22] p-6 rounded-lg border border-[#344d65] overflow-auto">
            <pre className="whitespace-pre-wrap text-[#93adc8]">{JSON.stringify(response, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestPanel;
