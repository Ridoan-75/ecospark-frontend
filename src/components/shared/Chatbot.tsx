"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Sparkles,
  Lightbulb,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/shared/Logo";
import axiosInstance from "@/lib/axios";

interface Message {
  id: string;
  content: string;
  role: "user" | "bot";
  timestamp: Date;
}

// Simple markdown formatter
const formatMarkdown = (text: string) => {
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
  formatted = formatted.replace(
    /`([^`]+)`/g,
    "<code class='bg-muted px-1 py-0.5 rounded text-sm font-mono'>$1</code>",
  );
  // Markdown links
  formatted = formatted.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    "<a href='$2' class='text-primary hover:underline font-semibold'>$1</a>"
  );

  const lines = formatted.split("\n");
  let inList = false;
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      if (!inList) {
        result.push("<ul class='list-disc pl-5 my-2 space-y-1'>");
        inList = true;
      }
      result.push(`<li>${line.replace(/^[\s]*[-*]\s/, "")}</li>`);
    } else {
      if (inList) {
        result.push("</ul>");
        inList = false;
      }
      if (line.trim()) {
        result.push(`<p class="mb-1.5 last:mb-0 leading-relaxed">${line}</p>`);
      }
    }
  }

  if (inList) result.push("</ul>");
  return result.join("");
};

const SUGGESTIONS = [
  "What is EcoSpark?",
  "Suggest me the best eco ideas",
  "How do I share an idea?",
  "Show trending sustainability topics",
];

import { useRouter } from "next/navigation";

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! 👋 I'm **EcoSpark AI**. Ask me anything about ideas, sustainability, or let me suggest some trending eco-friendly projects!",
      role: "bot",
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Intercept link clicks to use client-side routing
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Find closest anchor tag in case they click inside it
      const aTag = target.closest("a");
      if (aTag && aTag.getAttribute("href")?.startsWith("/")) {
        e.preventDefault();
        router.push(aTag.getAttribute("href")!);
        setIsOpen(false); // Close chatbot when navigating
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener("click", handleLinkClick);
    }
    return () => {
      if (container) container.removeEventListener("click", handleLinkClick);
    };
  }, [messages, router]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        chatWindowRef.current &&
        !chatWindowRef.current.contains(e.target as Node)
      ) {
        // Don't close if clicking the toggle button (it has its own handler)
        const target = e.target as HTMLElement;
        if (!target.closest("[data-chatbot-toggle]")) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSendMessage = async (e?: React.FormEvent, text?: string) => {
    e?.preventDefault();

    const messageText = text || inputValue.trim();
    if (!messageText || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/ai/chat", {
        message: messageText,
      });
      const reply =
        res.data?.data?.reply ||
        res.data?.data ||
        "I'm here to help! Could you elaborate more on what you'd like to know?";

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: typeof reply === "string" ? reply : JSON.stringify(reply),
        role: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (err: any) {
      // Fallback mock response on error (e.g. not logged in)
      const fallbacks = [
        "💡 Please **log in** to get personalized idea suggestions from EcoSpark AI!",
        "It seems you're not logged in. Sign in to access the full AI-powered idea engine!",
      ];
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: fallbacks[Math.floor(Math.random() * fallbacks.length)],
          role: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[400px] rounded-2xl border bg-background shadow-[0_8px_60px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden"
            style={{ height: "560px", maxHeight: "calc(100dvh - 110px)" }}
          >
            {/* ── Header ── */}
            <div className="shrink-0 bg-[#0f0f1a] border-b border-white/10 px-4 py-3.5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex items-center gap-3">
                <Logo variant="compact" className="scale-[0.85] origin-left" />
                <div className="flex items-center gap-2">
                  <span className="text-purple-300/90 font-medium text-[10px] uppercase tracking-wider bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                    AI Assistant
                  </span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
              </div>
            </div>

            {/* ── Messages (scrollable) ── */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "hsl(var(--border)) transparent",
              }}
            >
              {messages.map((message) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-2 max-w-[86%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar className="w-7 h-7 shrink-0 border border-border/40 shadow-sm mt-0.5">
                      {message.role === "user" ? (
                        <>
                          <AvatarImage src="/user-avatar.png" />
                          <AvatarFallback className="bg-primary/15 text-primary text-xs">
                            <User size={13} />
                          </AvatarFallback>
                        </>
                      ) : (
                        <AvatarFallback className="bg-primary/15 text-primary text-xs">
                          <Bot size={13} />
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-sm shadow-sm leading-relaxed ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-muted/60 border border-border/40 text-foreground rounded-tl-sm"
                      }`}
                    >
                      {message.role === "bot" ? (
                        <div
                          className="prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: formatMarkdown(message.content),
                          }}
                        />
                      ) : (
                        <p>{message.content}</p>
                      )}
                      <div
                        className={`text-[10px] mt-1 opacity-55 ${message.role === "user" ? "text-right" : "text-left"}`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-2">
                    <Avatar className="w-7 h-7 shrink-0 border border-border/40 shadow-sm">
                      <AvatarFallback className="bg-primary/15 text-primary text-xs">
                        <Bot size={13} />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted/60 border border-border/40 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 bg-primary/50 rounded-full"
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.55,
                            repeat: Infinity,
                            delay,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Suggestions (shown until 3 messages) ── */}
            {messages.length < 3 && !isLoading && (
              <div className="shrink-0 px-3 pb-2">
                <p className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
                  <Lightbulb size={10} /> Quick suggestions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(undefined, s)}
                      className="text-[11px] bg-muted/70 hover:bg-primary/10 hover:text-primary border border-border/50 rounded-full px-3 py-1.5 transition-colors text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── AI Search Input ── */}
            <div className="shrink-0 p-3 border-t bg-background/95 backdrop-blur-sm">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 bg-muted/40 rounded-xl px-3 py-1.5 border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15 transition-all"
              >
                <Bot size={16} className="text-muted-foreground/60 shrink-0" />
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask AI, search ideas..."
                  disabled={isLoading}
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 disabled:opacity-50 py-1"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="w-7 h-7 shrink-0 rounded-lg bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 hover:bg-primary/90 active:scale-95 transition-all"
                >
                  <Send size={13} />
                </button>
              </form>
              <p className="text-center text-[10px] text-muted-foreground/60 mt-1.5">
                ✨ EcoSpark AI · Powered by Gemini
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle Button ── */}
      <motion.button
        data-chatbot-toggle
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:shadow-xl"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.35,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? "open" : "closed"}
            initial={{ rotate: -80, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 80, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.18 }}
          >
            <MessageCircle
              size={24}
              className={isOpen ? "fill-primary-foreground" : ""}
            />
          </motion.div>
        </AnimatePresence>
        {/* Unread badge pulse when closed */}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-background rounded-full animate-pulse" />
        )}
      </motion.button>
    </>
  );
}
