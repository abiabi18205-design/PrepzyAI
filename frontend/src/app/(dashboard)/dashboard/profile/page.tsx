// app/(dashboard)/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken, deleteOwnAccount } from "@/lib/api";
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  KeyIcon, 
  PencilSquareIcon,
  CheckCircleIcon,
  XCircleIcon,
  CameraIcon,
  ChartBarIcon,
  CalendarIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  avatar?: string;
  stats: {
    totalInterviews: number;
    averageScore: number;
    questionsAnswered: number;
    streak: number;
    bestCategory: string;
    improvementRate: number;
  };
}

interface FormData {
  name: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const token = getToken();
      console.log("🔑 Token:", token ? "Present" : "Missing");
      
      if (!token) {
        console.log("❌ No token found, redirecting to login");
        router.push("/login");
        return;
      }

      console.log("📡 Fetching user profile from:", `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log("📥 Response status:", response.status);
      const data = await response.json();
      console.log("📦 Response data:", data);
      
      if (data.success) {
        const userData = data.data.user;
        console.log("✅ User data loaded:", userData);
        
        // Fetch additional stats from dashboard endpoint
        try {
          const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const statsData = await statsResponse.json();
          console.log("📊 Stats data:", statsData);
          
          setProfile({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            createdAt: userData.createdAt || new Date().toISOString(),
            stats: statsData.success ? statsData.data : {
              totalInterviews: 0,
              averageScore: 0,
              questionsAnswered: 0,
              streak: 0,
              bestCategory: "N/A",
              improvementRate: 0,
            }
          });
        } catch (statsError) {
          console.error("⚠️ Failed to fetch stats:", statsError);
          // Set profile without stats
          setProfile({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            createdAt: userData.createdAt || new Date().toISOString(),
            stats: {
              totalInterviews: 0,
              averageScore: 0,
              questionsAnswered: 0,
              streak: 0,
              bestCategory: "N/A",
              improvementRate: 0,
            }
          });
        }
        
        setFormData(prev => ({ ...prev, name: userData.name }));
      } else {
        console.error("❌ API returned error:", data.message);
        throw new Error(data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      setMessage({ type: 'error', text: 'Failed to load profile data. Please refresh the page.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  // Update profile name
  const updateProfile = async () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name cannot be empty' });
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: formData.name }),
      });
      
      const data = await response.json();
      if (data.success) {
        setProfile(prev => prev ? { ...prev, name: formData.name } : null);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
        // Update cached user data
        if (typeof window !== "undefined") {
          const cachedUser = localStorage.getItem("user");
          if (cachedUser) {
            const user = JSON.parse(cachedUser);
            user.name = formData.name;
            localStorage.setItem("user", JSON.stringify(user));
          }
        }
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const changePassword = async () => {
    // Validation
    if (!formData.currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required' });
      return;
    }
    if (!formData.newPassword) {
      setMessage({ type: 'error', text: 'New password is required' });
      return;
    }
    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setSaving(true);
    try {
      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setShowPasswordForm(false);
      } else {
        throw new Error(data.message || 'Password change failed');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please check your current password.' });
    } finally {
      setSaving(false);
    }
  };

  // ✅ Delete Account Function
  const handleDeleteAccount = async () => {
    const confirmed = confirm(
      "⚠️ WARNING: This action cannot be undone!\n\n" +
      "All your data including:\n" +
      "• Interview sessions\n" +
      "• Progress and results\n" +
      "• Account information\n\n" +
      "will be permanently deleted.\n\n" +
      "Are you absolutely sure you want to delete your account?"
    );
    
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteOwnAccount();
      
      // Clear all local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("onboarding");
      localStorage.removeItem("onboarding_preferences");
      localStorage.removeItem("onboardings_practices");
      
      // Redirect to login page with deleted param
      router.push("/login?deleted=true");
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || "Failed to delete account. Please try again." 
      });
      setDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Retry loading
  const handleRetry = () => {
    setLoading(true);
    setMessage(null);
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B] mx-auto mb-4"></div>
          <p className="text-[#9aabb8] text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
            <XCircleIcon className="h-10 w-10 text-red-400" />
          </div>
          <p className="text-[#9aabb8] mb-2 text-lg">Failed to load profile</p>
          <p className="text-[#9aabb8] text-sm mb-6">
            There was an error loading your profile data. This could be due to a network issue or authentication problem.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] hover:bg-[#FFA07A] transition-all flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Retry
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 rounded-xl border border-[#2a3a4a] text-[#9aabb8] hover:text-[#FFF5F2] transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-[#FFF5F2] mb-2">
            Profile Settings
          </h1>
          <p className="text-[#9aabb8] font-body">
            Manage your account settings and view your progress
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircleIcon className="h-5 w-5" />
              ) : (
                <XCircleIcon className="h-5 w-5" />
              )}
              <span className="text-sm">{message.text}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Avatar Card */}
              <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838] text-center">
                <div className="relative inline-block">
                  <div className="w-28 h-28 mx-auto rounded-2xl bg-gradient-to-br from-[#FF6B6B]/20 to-[#FFA07A]/20 border border-[#FF6B6B]/30 flex items-center justify-center">
                    <span className="text-5xl font-heading font-bold text-[#FF6B6B]">
                      {(profile.name || profile.email || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button 
                    onClick={() => alert("Avatar upload coming soon!")}
                    className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#FF6B6B] text-[#0D1B2A] hover:bg-[#FFA07A] transition-colors"
                  >
                    <CameraIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <h2 className="font-heading text-xl font-bold text-[#FFF5F2] mt-4">
                  {profile.name || profile.email || "User"}
                </h2>
                <p className="text-[#9aabb8] text-sm font-mono mt-1">
                  {profile.email}
                </p>
                
                <div className="mt-4 pt-4 border-t border-[#2a3a4a]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#9aabb8]">Member since</span>
                    <span className="text-[#FFF5F2]">{formatDate(profile.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-[#9aabb8]">Account type</span>
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-mono ${
                      profile.role === 'admin' 
                        ? 'bg-purple-500/10 text-purple-400'
                        : 'bg-[#FF6B6B]/10 text-[#FF6B6B]'
                    }`}>
                      {profile.role === 'admin' ? (
                        <span className="flex items-center gap-1">
                          <ShieldCheckIcon className="h-3 w-3" />
                          Admin
                        </span>
                      ) : 'User'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
                <h3 className="font-heading font-bold text-[#FFF5F2] mb-4 flex items-center gap-2">
                  <TrophyIcon className="h-5 w-5 text-[#FF6B6B]" />
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9aabb8]">Total Interviews</span>
                    <span className="text-[#FFF5F2] font-bold">{profile.stats.totalInterviews}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9aabb8]">Avg. Score</span>
                    <span className="text-[#FFF5F2] font-bold">{profile.stats.averageScore}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9aabb8]">Questions Answered</span>
                    <span className="text-[#FFF5F2] font-bold">{profile.stats.questionsAnswered}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9aabb8]">Current Streak</span>
                    <span className="text-[#FFF5F2] font-bold">{profile.stats.streak} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#9aabb8]">Best Category</span>
                    <span className="text-[#FFF5F2] font-bold">{profile.stats.bestCategory}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information */}
            <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold text-[#FFF5F2] flex items-center gap-2">
                  <UserCircleIcon className="h-6 w-6 text-[#FF6B6B]" />
                  Profile Information
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 py-1.5 rounded-lg text-sm text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-colors flex items-center gap-1"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#9aabb8] font-mono uppercase tracking-wider block mb-1">
                      Full Name
                    </label>
                    <p className="text-[#FFF5F2] font-body">{profile.name || profile.email || "User"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-[#9aabb8] font-mono uppercase tracking-wider block mb-1">
                      Email Address
                    </label>
                    <p className="text-[#FFF5F2] font-body">{profile.email}</p>
                    <p className="text-[#9aabb8] text-xs mt-1">Email cannot be changed</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#9aabb8] font-mono uppercase tracking-wider block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none transition-colors"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={updateProfile}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold text-sm hover:bg-[#FFA07A] transition-all disabled:opacity-50"
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(prev => ({ ...prev, name: profile.name }));
                      }}
                      className="px-4 py-2 rounded-xl border border-[#2a3a4a] text-[#9aabb8] hover:text-[#FFF5F2] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Password Management */}
            <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
              <h3 className="font-heading text-xl font-bold text-[#FFF5F2] mb-4 flex items-center gap-2">
                <KeyIcon className="h-6 w-6 text-[#FF6B6B]" />
                Password Management
              </h3>

              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="px-4 py-2 rounded-xl border border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-colors text-sm"
                >
                  Change Password
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#9aabb8] font-mono uppercase tracking-wider block mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none transition-colors"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#9aabb8] font-mono uppercase tracking-wider block mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none transition-colors"
                      placeholder="Enter new password"
                    />
                    <p className="text-[#9aabb8] text-xs mt-1">Minimum 6 characters</p>
                  </div>
                  <div>
                    <label className="text-xs text-[#9aabb8] font-mono uppercase tracking-wider block mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none transition-colors"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={changePassword}
                      disabled={saving}
                      className="px-4 py-2 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold text-sm hover:bg-[#FFA07A] transition-all disabled:opacity-50"
                    >
                      {saving ? "Changing..." : "Update Password"}
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordForm(false);
                        setFormData(prev => ({
                          ...prev,
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        }));
                      }}
                      className="px-4 py-2 rounded-xl border border-[#2a3a4a] text-[#9aabb8] hover:text-[#FFF5F2] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Performance Progress */}
            <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
              <h3 className="font-heading text-xl font-bold text-[#FFF5F2] mb-4 flex items-center gap-2">
                <ChartBarIcon className="h-6 w-6 text-[#FF6B6B]" />
                Performance Progress
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#9aabb8]">Overall Performance</span>
                    <span className="text-[#FFF5F2]">{profile.stats.averageScore}%</span>
                  </div>
                  <div className="h-2 bg-[#2a3a4a] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] rounded-full transition-all"
                      style={{ width: `${profile.stats.averageScore}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#9aabb8]">Improvement Rate</span>
                    <span className="text-[#FFF5F2]">{profile.stats.improvementRate}%</span>
                  </div>
                  <div className="h-2 bg-[#2a3a4a] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#6EE7B7] to-[#4ADE80] rounded-full transition-all"
                      style={{ width: `${profile.stats.improvementRate}%` }}
                    />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-[#2a3a4a]">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#9aabb8]">Next Milestone</span>
                    <span className="text-[#FF6B6B] font-bold">
                      {profile.stats.totalInterviews < 10 ? `${10 - profile.stats.totalInterviews} more interviews to reach 10` :
                       profile.stats.averageScore < 85 ? `${85 - profile.stats.averageScore}% to reach 85% score` :
                       "You're on fire! Keep going! 🔥"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone - Delete Account */}
            <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
              <div className="flex items-center gap-2 mb-2">
                <TrashIcon className="h-5 w-5 text-red-400" />
                <h3 className="font-heading text-xl font-bold text-red-400">
                  Danger Zone
                </h3>
              </div>
              <p className="text-[#9aabb8] text-sm mb-4">
                Once you delete your account, there is no going back. All your data including interview sessions, progress, and results will be permanently deleted.
              </p>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 rounded-xl border border-red-500 text-red-400 hover:bg-red-500/10 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400" />
                    Deleting Account...
                  </>
                ) : (
                  <>
                    <TrashIcon className="h-4 w-4" />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}