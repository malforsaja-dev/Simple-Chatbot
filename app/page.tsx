"use client";

import { useState } from "react";
import { Button, Textarea } from "@/components";

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setError("");
    setResponse("");
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
    setResponse("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setResponse(data.response);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <Textarea
            required
            rows={6}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Write or paste your paragraph (Shift+Enter for newline)..."
          />
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Generate Summary"}
        </Button>
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
