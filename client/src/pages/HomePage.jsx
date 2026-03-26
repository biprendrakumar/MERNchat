import Sidebar from "../components/Sidebar.jsx";
import ChatContainer from "../components/ChatContainer.jsx";
import RightSidebar from "../components/RightSidebar.jsx";
import { useChat } from "../context/ChatContext.jsx";

export default function HomePage() {
  const { selectedUser } = useChat();

  return (
    <div className="h-screen bg-slate-900 flex overflow-hidden">
      {/* Left - Sidebar (always visible) */}
      <div className={`${selectedUser ? "hidden md:flex" : "flex"} w-full md:w-80 flex-shrink-0`}>
        <Sidebar />
      </div>

      {/* Middle - Chat */}
      <div className={`${!selectedUser ? "hidden md:flex" : "flex"} flex-1 min-w-0`}>
        <ChatContainer />
      </div>

      {/* Right - Profile panel (only on large screens when user selected) */}
      {selectedUser && (
        <div className="hidden lg:flex w-80 flex-shrink-0">
          <RightSidebar />
        </div>
      )}
    </div>
  );
}
