import { useState, useRef, useEffect } from "react";
import { useChat } from "../context/ChatContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatTime, formatDate, getInitials } from "../lib/utils.js";

export default function ChatContainer() {
  const { selectedUser, messages, sendMessage, isLoadingMessages, onlineUsers } = useChat();
  const { authUser } = useAuth();
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef();
  const fileRef = useRef();
  const textRef = useRef();

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be under 5MB.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    fileRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;
    setSending(true);

    try {
      let base64Image = null;
      if (imageFile) {
        base64Image = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(imageFile);
        });
      }
      await sendMessage({ text: text.trim(), image: base64Image });
      setText("");
      setImageFile(null);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = "";
      textRef.current?.focus();
    } catch {
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-900 text-center p-8">
        <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Select a conversation</h2>
        <p className="text-slate-500 text-sm">Choose a contact from the sidebar to start chatting</p>
      </div>
    );
  }

  const isOnline = onlineUsers.includes(selectedUser._id);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.createdAt);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="flex-1 flex flex-col bg-slate-900 min-w-0">
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-800 border-b border-slate-700 flex-shrink-0">
        <div className="relative">
          {selectedUser.profilePic ? (
            <img src={selectedUser.profilePic} alt={selectedUser.fullName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
              {getInitials(selectedUser.fullName)}
            </div>
          )}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-800" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{selectedUser.fullName}</p>
          <p className={`text-xs ${isOnline ? "text-green-400" : "text-slate-500"}`}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            No messages yet. Say hello! 👋
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              {/* Date separator */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-700" />
                <span className="text-xs text-slate-500 flex-shrink-0">{date}</span>
                <div className="flex-1 h-px bg-slate-700" />
              </div>

              {msgs.map((msg) => {
                const isMine = msg.senderId === authUser._id;
                return (
                  <div key={msg._id} className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1.5 message-bubble`}>
                    {/* Avatar for received messages */}
                    {!isMine && (
                      <div className="flex-shrink-0 mr-2 self-end">
                        {selectedUser.profilePic ? (
                          <img src={selectedUser.profilePic} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                            {getInitials(selectedUser.fullName)}
                          </div>
                        )}
                      </div>
                    )}

                    <div className={`max-w-xs lg:max-w-sm xl:max-w-md ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                      {/* Image */}
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="shared"
                          className={`rounded-2xl max-w-full mb-1 cursor-pointer hover:opacity-90 transition ${isMine ? "rounded-br-sm" : "rounded-bl-sm"}`}
                          style={{ maxHeight: "280px", objectFit: "cover" }}
                          onClick={() => window.open(msg.image, "_blank")}
                        />
                      )}
                      {/* Text */}
                      {msg.text && (
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${
                          isMine
                            ? "bg-blue-600 text-white rounded-br-sm"
                            : "bg-slate-700 text-slate-100 rounded-bl-sm"
                        }`}>
                          {msg.text}
                        </div>
                      )}
                      <span className="text-xs text-slate-600 mt-1 px-1">{formatTime(msg.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 flex items-center gap-3">
          <img src={imagePreview} alt="preview" className="h-16 w-16 rounded-xl object-cover" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-slate-300 truncate">{imageFile?.name}</p>
            <p className="text-xs text-slate-500">{(imageFile?.size / 1024).toFixed(1)} KB</p>
          </div>
          <button onClick={handleRemoveImage} className="text-slate-500 hover:text-red-400 transition p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSend} className="px-4 py-3 bg-slate-800 border-t border-slate-700 flex items-end gap-2">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <button
          type="button"
          onClick={() => fileRef.current.click()}
          className="flex-shrink-0 p-2.5 rounded-xl text-slate-400 hover:text-blue-400 hover:bg-slate-700 transition"
          title="Attach image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <textarea
          ref={textRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          rows={1}
          className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition resize-none max-h-32 overflow-y-auto"
        />

        <button
          type="submit"
          disabled={(!text.trim() && !imageFile) || sending}
          className="flex-shrink-0 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition"
        >
          {sending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
