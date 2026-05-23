"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";

type Message = {
  id: string;
  user_name: string;
  message: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  created_at: string;
};

function ChatContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user") || "user1";

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(200);
    setMessages(data || []);
    setTimeout(scrollToBottom, 100);
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("chat")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          setTimeout(scrollToBottom, 100);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;
    setSending(true);
    await supabase.from("chat_messages").insert({
      user_name: user,
      message: text.trim(),
      file_url: null,
      file_name: null,
      file_type: null,
    });
    setText("");
    setSending(false);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("chat-files")
      .upload(fileName, file);

    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("chat-files")
      .getPublicUrl(fileName);

    await supabase.from("chat_messages").insert({
      user_name: user,
      message: null,
      file_url: urlData.publicUrl,
      file_name: file.name,
      file_type: file.type,
    });

    setUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const isImage = (type: string | null) => type?.startsWith("image/");
  const isPdf = (type: string | null) => type === "application/pdf";

 const displayName = (u: string) => u === "user1" ? "Harshit" : "Khushi ✨";

  // Group messages by date
  const groupedMessages: { date: string; msgs: Message[] }[] = [];
  messages.forEach((msg) => {
    const date = format(new Date(msg.created_at), "dd MMMM yyyy");
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === date) {
      last.msgs.push(msg);
    } else {
      groupedMessages.push({ date, msgs: [msg] });
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userName={user} />

      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-4 py-6" style={{ minHeight: 0 }}>
        <div className="mb-6">
          <p className="text-muted text-sm font-mono uppercase tracking-widest">Study Chat</p>
          <h1 className="font-display font-bold text-3xl mt-0.5">
            Chat<span style={{ color: "var(--accent)" }}>.</span>
          </h1>
        </div>

        {/* Messages area */}
        <div
          className="flex-1 rounded-xl p-4 overflow-y-auto mb-4"
          style={{
            background: "var(--surface)",
            border: "1.5px solid var(--border)",
            minHeight: 400,
            maxHeight: "calc(100vh - 320px)",
          }}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-muted text-sm">No messages yet. Say something!</p>
              </div>
            </div>
          ) : (
            groupedMessages.map((group) => (
              <div key={group.date}>
                {/* Date divider */}
                <div className="flex items-center gap-3 my-4">
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  <span className="text-xs font-mono text-muted">{group.date}</span>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                </div>

                {group.msgs.map((msg) => {
                  const isMe = msg.user_name === user;
                  return (
                    <div
                      key={msg.id}
                      className="flex mb-3"
                      style={{ justifyContent: isMe ? "flex-end" : "flex-start" }}
                    >
                      <div style={{ maxWidth: "70%" }}>
                        {/* Name */}
                        <p
                          className="text-xs mb-1 font-display font-semibold"
                          style={{
                            textAlign: isMe ? "right" : "left",
                            color: isMe ? "var(--accent)" : "var(--gold)",
                          }}
                        >
                          {displayName(msg.user_name)}
                        </p>

                        {/* Bubble */}
                        <div
                          style={{
                            background: isMe ? "var(--ink)" : "white",
                            color: isMe ? "var(--paper)" : "var(--ink)",
                            borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            padding: "10px 14px",
                            border: isMe ? "none" : "1.5px solid var(--border)",
                            wordBreak: "break-word",
                          }}
                        >
                          {msg.message && (
                            <p style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>{msg.message}</p>
                          )}

                          {msg.file_url && isImage(msg.file_type) && (
                            <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={msg.file_url}
                                alt={msg.file_name || "image"}
                                style={{
                                  maxWidth: 240,
                                  maxHeight: 240,
                                  borderRadius: 8,
                                  display: "block",
                                  objectFit: "cover",
                                }}
                              />
                            </a>
                          )}

                          {msg.file_url && !isImage(msg.file_type) && (
                            <a
                              href={msg.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                textDecoration: "none",
                                color: isMe ? "var(--paper)" : "var(--ink)",
                              }}
                            >
                              <span style={{ fontSize: "1.4rem" }}>
                                {isPdf(msg.file_type) ? "📄" : "📎"}
                              </span>
                              <span style={{ fontSize: "0.82rem", textDecoration: "underline" }}>
                                {msg.file_name}
                              </span>
                            </a>
                          )}
                        </div>

                        {/* Time */}
                        <p
                          className="text-xs mt-1"
                          style={{
                            color: "var(--muted)",
                            textAlign: isMe ? "right" : "left",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}
                        >
                          {format(new Date(msg.created_at), "HH:mm")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div
          className="rounded-xl p-3 flex gap-3 items-center"
          style={{ background: "var(--surface)", border: "1.5px solid var(--border)" }}
        >
          {/* File upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title="Attach file or image"
            style={{
              background: "none",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              padding: "8px 10px",
              cursor: "pointer",
              fontSize: "1.1rem",
              color: uploading ? "var(--muted)" : "var(--ink)",
              flexShrink: 0,
            }}
          >
            {uploading ? "⏳" : "📎"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf,.doc,.docx,.txt,.zip"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <input
            className="field-input flex-1"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            className="btn-primary"
            onClick={sendMessage}
            disabled={sending || !text.trim()}
            style={{ flexShrink: 0 }}
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}