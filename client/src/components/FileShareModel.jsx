import { useState, useRef } from "react";
import { useChat } from "../context/ChatContext.jsx";
import { toast } from "react-hot-toast";

export default function FileShareModal({ selectedUser, onClose }) {
  const { sendFileMessage } = useChat();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} is over 20MB and was skipped`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setUploading(true);
    let successCount = 0;

    for (const file of files) {
      try {
        await sendFileMessage(file, selectedUser._id);
        successCount++;
      } catch (error) {
        toast.error(`Failed to send ${file.name}`);
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} file(s) sent successfully`);
      onClose();
    }
    setUploading(false);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    const icons = {
      pdf: "📄", doc: "📝", docx: "📝", txt: "📄",
      zip: "📦", rar: "📦", "7z": "📦", xls: "📊",
      xlsx: "📊", ppt: "🎯", pptx: "🎯", jpg: "🖼️",
      jpeg: "🖼️", png: "🖼️", gif: "🖼️", mp4: "🎬",
      mov: "🎬", avi: "🎬", mp3: "🎵", wav: "🎵", m4a: "🎵",
    };
    return icons[ext] || "📁";
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Share Files</h3>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-lg">Max 20MB per file</span>
        </div>

        <input
          ref={fileRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-2xl group hover:border-blue-500/50 transition-colors">
              <span className="text-2xl">{getFileIcon(file.name)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
              </div>
              <button
                onClick={() => removeFile(idx)}
                className="text-slate-500 hover:text-red-400 p-1 transition"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={() => fileRef.current.click()}
            className="w-full py-6 border-2 border-dashed border-slate-700 rounded-2xl hover:border-blue-500 hover:bg-blue-500/5 transition-all flex flex-col items-center justify-center gap-2 group"
          >
            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-sm text-slate-400">Add {files.length > 0 ? "more files" : "files"}</p>
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              "Send All Files"
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
