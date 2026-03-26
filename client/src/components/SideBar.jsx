import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getInitials } from "../lib/utils.js";

export default function Sidebar() {
  const { users, selectedUser, selectUser, onlineUsers, isLoadingUsers } = useChat();
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((u) =>
    u.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full bg-slate-800 border-r border-slate-700">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="font-bold text-white text-lg">ChatApp</span>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 hover:bg-slate-700 rounded-xl p-1.5 transition"
            title="Edit profile"
          >
            {authUser?.profilePic ? (
              <img src={authUser.profilePic} alt="me" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                {getInitials(authUser?.fullName)}
              </div>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Online count */}
        <p className="text-xs text-slate-500 mt-2">
          <span className="text-green-400 font-medium">{onlineUsers.length}</span> online
        </p>
      </div>

      {/* User list */}
      <div className="flex-1 overflow-y-auto py-2">
        {isLoadingUsers ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            {search ? "No users found" : "No contacts yet"}
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;

            return (
              <button
                key={user._id}
                onClick={() => selectUser(user)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition text-left ${
                  isSelected ? "bg-slate-700 border-l-2 border-blue-500" : ""
                }`}
              >
                {/* Avatar with online indicator */}
                <div className="relative flex-shrink-0">
                  {user.profilePic ? (
                    <img src={user.profilePic} alt={user.fullName} className="w-11 h-11 rounded-full object-cover" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                      {getInitials(user.fullName)}
                    </div>
                  )}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800 online-pulse" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white truncate">{user.fullName}</span>
                    {user.unreadCount > 0 && (
                      <span className="ml-2 flex-shrink-0 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {user.unreadCount > 9 ? "9+" : user.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isOnline ? (
                      <span className="text-green-400">Online</span>
                    ) : "Offline"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
