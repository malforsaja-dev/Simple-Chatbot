"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    setResponse("");
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (input.trim().length < 20) {
      setError("Please enter at least 20 characters.");
      return;
    }

    setError("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await res.json();
    setResponse(data.response);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow-xl rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        ✨ Summarize with AI
      </h1>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label className="block text-gray-700 font-semibold mb-1">
            Your Text:
          </label>
          <textarea
            required
            rows={6}
            value={input}
            placeholder="Paste or write a paragraph you want to summarize..."
            className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-3 rounded-md text-gray-800"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition cursor-pointer disabled:opacity-50"
        >
          {loading ? "Processing..." : "Generate Summary"}
        </button>
      </form>

      {response && (
        <div className="mt-8 bg-gray-50 border border-gray-200 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            AI Summary:
          </h2>
          <p className="text-gray-700 whitespace-pre-line">{response}</p>
        </div>
      )}
    </div>
  );
}
