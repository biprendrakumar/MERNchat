import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getInitials } from "../lib/utils.js";

export default function RightSidebar() {
  const { selectedUser, messages, onlineUsers } = useChat();
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!selectedUser) return null;

  const isOnline = onlineUsers.includes(selectedUser._id);

  // Collect all images shared in this conversation
  const sharedImages = messages.filter((m) => m.image).map((m) => m.image);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col w-full bg-slate-800 border-l border-slate-700 overflow-y-auto">
      {/* Profile section */}
      <div className="p-6 border-b border-slate-700 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative mb-3">
          {selectedUser.profilePic ? (
            <img
              src={selectedUser.profilePic}
              alt={selectedUser.fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-600"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white border-2 border-slate-600">
              {getInitials(selectedUser.fullName)}
            </div>
          )}
          {isOnline && (
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800" />
          )}
        </div>

        <h3 className="font-bold text-white text-lg">{selectedUser.fullName}</h3>
        <span className={`text-xs font-medium mt-1 ${isOnline ? "text-green-400" : "text-slate-500"}`}>
          {isOnline ? "● Online" : "● Offline"}
        </span>

        {selectedUser.bio && (
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">{selectedUser.bio}</p>
        )}

        {/* Info rows */}
        <div className="w-full mt-5 space-y-2.5 text-left">
          <div className="flex items-center gap-2.5 text-sm text-slate-400">
            <svg className="w-4 h-4 flex-shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="truncate text-slate-300 text-xs">{selectedUser.email}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-400">
            <svg className="w-4 h-4 flex-shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs text-slate-300">{messages.length} messages</span>
          </div>
        </div>
      </div>

      {/* Media Panel */}
      <div className="p-5 flex-1">
        <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Shared Media
          {sharedImages.length > 0 && (
            <span className="bg-slate-700 text-slate-400 text-xs px-2 py-0.5 rounded-full ml-auto">
              {sharedImages.length}
            </span>
          )}
        </p>

        {sharedImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-500 text-xs">No media shared yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {sharedImages.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => window.open(imgUrl, "_blank")}
                className="aspect-square rounded-xl overflow-hidden hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <img src={imgUrl} alt={`media-${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 transition text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );
}
