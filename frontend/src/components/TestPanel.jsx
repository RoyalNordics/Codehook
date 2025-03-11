import React, { useState } from "react";

const TestPanel = ({ webhookUrl = "https://codehook.onrender.com/api/webhook" }) => {
  const [message, setMessage] = useState("Hey CodeHook, create a simple counter in React");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    console.log("handleSave function triggered!");
    setLoading(true);
    setError("");

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          webhook_url: webhookUrl,
          apiKey: "12345",
          aiProvider: "openai"
        }),
      });

      const data = await res.json();
      setResponse(data);
      console.log("Configuration saved:", data);
    } catch (err) {
      setError("Error saving configuration");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>CodeHook Test Panel</h1>
      <button type="button" onClick={handleSave}>
        {loading ? "Saving..." : "Save Configuration"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {response && <p>Response: {JSON.stringify(response)}</p>}
    </div>
  );
};

export default TestPanel;
