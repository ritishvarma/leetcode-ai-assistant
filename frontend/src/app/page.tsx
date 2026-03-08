"use client";

import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Bot, User, Code2, Loader2, Sparkles, Copy, Check } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  similar_problems?: string[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm an expert competitive programming assistant. Provide me with a LeetCode problem or coding question and I'll give you a complete, optimized solution.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedResponseIndex, setCopiedResponseIndex] = useState<number | null>(null);
  const [selectedModel, setSelectedModel] = useState("deepseek-ai/deepseek-coder-33b-instruct");
  
  const models = [
    { id: "deepseek-ai/deepseek-coder-33b-instruct", name: "DeepSeek Coder 33B" },
    { id: "meta-llama/Llama-3.2-1B-Instruct", name: "Llama 3.2 1B (Fast)" },
    { id: "Qwen/Qwen2.5-Coder-32B-Instruct", name: "Qwen 2.5 Coder 32B" },
    { id: "mistralai/Mistral-7B-Instruct-v0.3", name: "Mistral 7B" },
  ];
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCopyResponse = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedResponseIndex(index);
    setTimeout(() => setCopiedResponseIndex(null), 2000);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          question: userMsg,
          model: selectedModel
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch from backend");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          similar_problems: data.similar_problems,
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please make sure the backend is running and the FAISS index is generated."
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600/20 rounded-xl">
            <Code2 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              AlgoMentor AI
            </h1>
            <p className="text-xs text-gray-400">Your coding interview companion</p>
          </div>
        </div>
        
        {/* Model Selector */}
        <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 shadow-sm">
          <label htmlFor="model-select" className="text-xs font-medium text-gray-400 hidden sm:block">Model:</label>
          <select
            id="model-select"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isLoading}
            className="bg-transparent text-sm text-gray-200 outline-none cursor-pointer disabled:opacity-50 appearance-none pr-4 font-medium"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '12px' }}
          >
            {models.map((model) => (
              <option key={model.id} value={model.id} className="bg-gray-800 text-gray-200">
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col ${
              message.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                  message.role === "user"
                    ? "bg-emerald-600/20 text-emerald-400"
                    : "bg-blue-600/20 text-blue-400"
                }`}
              >
                {message.role === "user" ? (
                  <User size={18} />
                ) : (
                  <Bot size={18} />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl relative group ${
                  message.role === "user"
                    ? "bg-emerald-600 text-white rounded-tr-sm"
                    : "bg-gray-800/80 border border-gray-700/50 text-gray-200 rounded-tl-sm shadow-md w-full"
                }`}
              >
                {message.role === "user" ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                ) : (
                  <div className="w-full relative pt-10">
                    {/* Copy Response Button */}
                    <button
                      onClick={() => handleCopyResponse(message.content, index)}
                      className="absolute top-0 right-0 px-2 py-1.5 bg-gray-700/50 hover:bg-gray-600 rounded-md text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium z-10"
                      title="Copy Response"
                    >
                      {copiedResponseIndex === index ? (
                        <>
                          <Check size={14} className="text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Copy Response</span>
                        </>
                      )}
                    </button>
                    <div className="prose prose-invert prose-blue max-w-none prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-p:leading-relaxed">
                      <ReactMarkdown
                        components={{
                          code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            const isBlock = !inline && match;
                            
                            if (isBlock) {
                              return <CodeBlock language={match[1]} value={String(children).replace(/\n$/, "")} />;
                            }
                            return (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Similar Problems Suggestions */}
            {message.similar_problems && message.similar_problems.length > 0 && (
              <div className="mt-3 ml-11 flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1 w-full">
                  <Sparkles size={14} className="text-amber-400" />
                  <span>Related concepts:</span>
                </div>
                {message.similar_problems.map((prob, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-800 border border-gray-700 rounded-full text-blue-300 hover:bg-gray-700 transition-colors cursor-default"
                  >
                    {prob}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="flex gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 text-blue-400">
                <Bot size={18} />
              </div>
              <div className="p-4 rounded-2xl bg-gray-800/80 border border-gray-700/50 rounded-tl-sm flex items-center gap-2 text-gray-400 h-10">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                <span className="text-sm font-medium animate-pulse">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="p-4 bg-gray-900 border-t border-gray-800">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Please wait..." : "Ask for a hint, pattern, or explanation..."}
            className="w-full bg-gray-800 border-2 border-gray-700 focus:border-blue-500 rounded-full pl-5 pr-14 py-4 text-gray-100 placeholder-gray-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-full transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <Send size={20} className={input.trim() && !isLoading ? "ml-0.5" : ""} />
          </button>
        </form>
        <div className="text-center mt-3 text-xs text-gray-500 w-full max-w-4xl mx-auto">
          AlgoMentor AI may produce inaccurate information about complex algorithms. Double check critical concepts.
        </div>
      </div>
    </div>
  );
}

const CodeBlock = ({ language, value }: { language: string; value: string }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(value);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="relative group rounded-md mt-4 mb-4 overflow-hidden bg-gray-900 border border-gray-800">
      <div className="flex items-center justify-between px-4 py-1.5 bg-gray-950 border-b border-gray-800">
        <span className="text-xs font-mono text-gray-400">{language}</span>
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors py-1"
        >
          {copiedCode ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto m-0 bg-transparent rounded-none border-none">
        <code className={`language-${language} text-sm`}>{value}</code>
      </pre>
    </div>
  );
};

