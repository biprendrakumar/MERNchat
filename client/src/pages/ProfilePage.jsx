import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { getInitials } from "../lib/utils.js";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const { authUser, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
  });
  const [previewUrl, setPreviewUrl] = useState(authUser?.profilePic || "");
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onloadend = () => setImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating profile...");
    try {
      const payload = { fullName: form.fullName, bio: form.bio };
      if (imageBase64) payload.profilePic = imageBase64;
      await updateProfile(payload);
      toast.success("Profile updated successfully!", { id: toastId });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Update failed.";
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-start justify-center p-4 pt-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/")}
            className="text-slate-400 hover:text-white transition p-2 rounded-xl hover:bg-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">Edit Profile</h1>
        </div>

        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="relative cursor-pointer group"
              onClick={() => fileRef.current.click()}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-600 group-hover:border-blue-500 transition"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold text-white border-4 border-slate-600 group-hover:border-blue-500 transition">
                  {getInitials(authUser?.fullName)}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <p className="text-slate-500 text-xs mt-2">Click to change photo</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email</label>
              <input
                type="email"
                value={authUser?.email || ""}
                disabled
                className="w-full bg-slate-700/40 border border-slate-700 rounded-xl px-4 py-3 text-slate-500 text-sm cursor-not-allowed"
              />
              <p className="text-xs text-slate-600 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                maxLength={150}
                placeholder="Tell others about yourself..."
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition resize-none"
              />
              <p className="text-right text-xs text-slate-500 mt-1">{form.bio.length}/150</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => { logout(); }}
                className="flex-1 bg-slate-700 hover:bg-red-500/20 hover:text-red-400 text-slate-300 font-semibold py-3 rounded-xl transition text-sm border border-slate-600 hover:border-red-500/40"
              >
                Log Out
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
