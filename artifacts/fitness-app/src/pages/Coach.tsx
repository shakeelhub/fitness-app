import { useState, useRef, useEffect } from "react";
import { Mic, Send, Square, Activity, Trash2 } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useSpeech } from "@/hooks/use-speech";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const STORAGE_KEY = "nexus_chat_history";
const GROQ_API_KEY = "GROQ_API_KEY_HERE";
const SYSTEM_PROMPT = `You are NEXUS, an elite AI personal fitness coach. You are intense, motivating, and highly knowledgeable about fitness, nutrition, and training. You give specific, actionable advice. Keep responses concise and powerful. Use fitness terminology. Address the user like an athlete.`;

export default function Coach() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isListening, transcript, startListening, stopListening, clearTranscript } = useSpeech();

  // Save to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamedResponse]);

  // Voice transcript -> input
  useEffect(() => {
    if (transcript) setInputText(transcript);
  }, [transcript]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: content.trim(),
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText("");
    clearTranscript();
    setIsTyping(true);
    setStreamedResponse("");

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: 1024,
          stream: true,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...updatedMessages.map(m => ({ role: m.role, content: m.content }))
          ]
        })
      });

      if (!response.ok) throw new Error("API error");
      if (!response.body) throw new Error("No stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content || "";
              if (delta) {
                fullResponse += delta;
                setStreamedResponse(fullResponse);
              }
            } catch {
              // skip incomplete chunks
            }
          }
        }
      }

      // Save assistant message
      const assistantMessage: Message = {
        role: "assistant",
        content: fullResponse,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setStreamedResponse("");

    } catch (err) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Neural link disrupted. Check your connection and try again.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
      setStreamedResponse("");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    if (isListening) stopListening();
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
      if (inputText) handleSend();
    } else {
      startListening();
    }
  };

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="flex flex-col h-screen max-h-[100dvh] bg-black">
      {/* Header */}
      <header className="flex-none p-4 md:p-6 border-b border-white/10 bg-black/50 backdrop-blur-md z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/50 bg-primary/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            {isTyping && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary border-2 border-black"></span>
              </span>
            )}
          </div>
          <div>
            <h1 className="font-display font-bold text-lg tracking-widest text-white">NEXUS AI</h1>
            <p className="text-xs text-primary font-mono flex items-center gap-1">
              <Activity className="w-3 h-3" /> NEURAL LINK ACTIVE
            </p>
          </div>
        </div>

        {/* Clear history button */}
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-400/30 transition-all text-xs font-mono"
          >
            <Trash2 className="w-4 h-4" /> CLEAR
          </button>
        )}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6" ref={scrollRef}>
        {messages.length === 0 && !isTyping && (
          <div className="h-full flex flex-col items-center justify-center opacity-50 gap-4">
            <div className="w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center animate-pulse">
              <Activity className="w-12 h-12 text-primary" />
            </div>
            <p className="font-display text-lg tracking-widest text-center">AWAITING DIRECTIVES</p>
            <p className="font-mono text-xs text-muted-foreground text-center">Ask me for a workout, nutrition advice, or form tips</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
          >
            {/* Timestamp */}
            <span className="text-xs text-muted-foreground font-mono mb-1 px-2">
              {msg.role === "user" ? "YOU" : "NEXUS"} · {formatTime(msg.timestamp)}
            </span>

            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl ${
              msg.role === "user"
                ? "bg-primary text-black rounded-tr-sm"
                : "bg-card border border-white/10 rounded-tl-sm text-foreground"
            }`}>
              <p className="whitespace-pre-wrap font-sans">{msg.content}</p>
            </div>
          </motion.div>
        ))}

        {/* Streaming response */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-start"
          >
            <span className="text-xs text-muted-foreground font-mono mb-1 px-2">NEXUS · now</span>
            <div className="max-w-[85%] md:max-w-[70%] p-4 rounded-2xl bg-card border border-primary/30 shadow-[0_0_15px_rgba(0,255,255,0.1)] rounded-tl-sm">
              {streamedResponse ? (
                <p className="whitespace-pre-wrap font-sans text-white/90">{streamedResponse}</p>
              ) : (
                <div className="flex gap-1 items-center h-6">
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
              <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex-none p-4 md:p-6 bg-gradient-to-t from-black via-black to-transparent">
        <GlassCard className="flex items-end gap-2 p-2 border-white/20">
          <button
            onClick={toggleVoice}
            className={`p-4 rounded-xl transition-all ${
              isListening
                ? "bg-red-500/20 text-red-500 border border-red-500 animate-pulse"
                : "bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            {isListening ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-6 h-6" />}
          </button>

          <div className="flex-1 bg-black/50 rounded-xl border border-white/10 focus-within:border-primary/50 transition-colors">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask for a workout, check form, get nutrition advice..."
              className="w-full bg-transparent p-4 outline-none resize-none min-h-[56px] max-h-[120px] font-sans text-white placeholder:text-white/30"
              rows={1}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="p-4 rounded-xl bg-primary text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
          >
            <Send className="w-6 h-6" />
          </button>
        </GlassCard>
      </div>
    </div>
  );
}