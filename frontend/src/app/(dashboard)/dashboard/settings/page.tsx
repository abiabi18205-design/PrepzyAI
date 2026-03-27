// app/(dashboard)/dashboard/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "@/lib/api";
import { 
  BellIcon, 
  LockClosedIcon, 
  GlobeAltIcon, 
  UserCircleIcon,
  ComputerDesktopIcon,
  LanguageIcon,
  ShieldCheckIcon,
  TrashIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  MoonIcon,
  SunIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  KeyIcon
} from "@heroicons/react/24/outline";

interface Settings {
  // Notification Settings
  emailNotifications: {
    practiceReminders: boolean;
    resultsAvailable: boolean;
    weeklyReport: boolean;
    marketingEmails: boolean;
  };
  
  // Privacy Settings
  privacy: {
    profileVisibility: "public" | "private" | "connections";
    showProgress: boolean;
    shareAnalytics: boolean;
  };
  
  // Display Settings
  display: {
    theme: "light" | "dark" | "system";
    fontSize: "small" | "medium" | "large";
    reducedMotion: boolean;
    highContrast: boolean;
  };
  
  // Interview Settings
  interview: {
    defaultDifficulty: "Easy" | "Medium" | "Hard";
    defaultDuration: number;
    autoFeedback: boolean;
    voiceRecording: boolean;
    showHints: boolean;
  };
  
  // Language & Region
  language: string;
  timezone: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [settings, setSettings] = useState<Settings>({
    emailNotifications: {
      practiceReminders: true,
      resultsAvailable: true,
      weeklyReport: true,
      marketingEmails: false,
    },
    privacy: {
      profileVisibility: "private",
      showProgress: true,
      shareAnalytics: true,
    },
    display: {
      theme: "dark",
      fontSize: "medium",
      reducedMotion: false,
      highContrast: false,
    },
    interview: {
      defaultDifficulty: "Medium",
      defaultDuration: 30,
      autoFeedback: true,
      voiceRecording: true,
      showHints: true,
    },
    language: "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        setSettings(prev => ({ ...prev, ...data.data }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!passwordData.currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required' });
      return;
    }
    if (!passwordData.newPassword) {
      setMessage({ type: 'error', text: 'New password is required' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password. Please check your current password.' });
    }
  };

  const deleteAccount = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      if (data.success) {
        removeToken();
        router.push('/login?deleted=true');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account. Please contact support.' });
      setShowDeleteModal(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      removeToken();
      router.push('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      removeToken();
      router.push('/login');
    }
  };

  const updateSetting = (section: keyof Settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as Record<string, any>),
        [key]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-extrabold text-[#FFF5F2] mb-2">
            Settings
          </h1>
          <p className="text-[#9aabb8] font-body">
            Customize your interview experience and account preferences
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

        {/* Settings Sections */}
        <div className="space-y-6">
          
          {/* Notification Settings */}
          <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
            <div className="flex items-center gap-2 mb-4">
              <BellIcon className="h-6 w-6 text-[#FF6B6B]" />
              <h2 className="font-heading text-xl font-bold text-[#FFF5F2]">Notifications</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#FFF5F2] font-body">Practice Reminders</p>
                  <p className="text-[#9aabb8] text-sm">Get reminders to complete your daily practice</p>
                </div>
                <button
                  onClick={() => updateSetting("emailNotifications", "practiceReminders", !settings.emailNotifications.practiceReminders)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications.practiceReminders ? "bg-[#FF6B6B]" : "bg-[#2a3a4a]"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications.practiceReminders ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#FFF5F2] font-body">Results Available</p>
                  <p className="text-[#9aabb8] text-sm">Get notified when interview results are ready</p>
                </div>
                <button
                  onClick={() => updateSetting("emailNotifications", "resultsAvailable", !settings.emailNotifications.resultsAvailable)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications.resultsAvailable ? "bg-[#FF6B6B]" : "bg-[#2a3a4a]"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications.resultsAvailable ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#FFF5F2] font-body">Weekly Report</p>
                  <p className="text-[#9aabb8] text-sm">Receive weekly performance summary</p>
                </div>
                <button
                  onClick={() => updateSetting("emailNotifications", "weeklyReport", !settings.emailNotifications.weeklyReport)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications.weeklyReport ? "bg-[#FF6B6B]" : "bg-[#2a3a4a]"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications.weeklyReport ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#FFF5F2] font-body">Marketing Emails</p>
                  <p className="text-[#9aabb8] text-sm">Tips, updates, and special offers</p>
                </div>
                <button
                  onClick={() => updateSetting("emailNotifications", "marketingEmails", !settings.emailNotifications.marketingEmails)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications.marketingEmails ? "bg-[#FF6B6B]" : "bg-[#2a3a4a]"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications.marketingEmails ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Interview Preferences */}
          <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
            <div className="flex items-center gap-2 mb-4">
              <ComputerDesktopIcon className="h-6 w-6 text-[#FF6B6B]" />
              <h2 className="font-heading text-xl font-bold text-[#FFF5F2]">Interview Preferences</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[#9aabb8] text-sm mb-2">Default Difficulty</label>
                <select
                  value={settings.interview.defaultDifficulty}
                  onChange={(e) => updateSetting("interview", "defaultDifficulty", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-[#9aabb8] text-sm mb-2">Default Duration (minutes)</label>
                <select
                  value={settings.interview.defaultDuration}
                  onChange={(e) => updateSetting("interview", "defaultDuration", parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none"
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>60 min</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#FFF5F2] font-body">Auto Feedback</p>
                  <p className="text-[#9aabb8] text-sm">Show AI feedback immediately after each answer</p>
                </div>
                <button
                  onClick={() => updateSetting("interview", "autoFeedback", !settings.interview.autoFeedback)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.interview.autoFeedback ? "bg-[#FF6B6B]" : "bg-[#2a3a4a]"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.interview.autoFeedback ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#FFF5F2] font-body">Voice Recording</p>
                  <p className="text-[#9aabb8] text-sm">Enable microphone for spoken answers</p>
                </div>
                <button
                  onClick={() => updateSetting("interview", "voiceRecording", !settings.interview.voiceRecording)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.interview.voiceRecording ? "bg-[#FF6B6B]" : "bg-[#2a3a4a]"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.interview.voiceRecording ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#FFF5F2] font-body">Show Hints</p>
                  <p className="text-[#9aabb8] text-sm">Display helpful hints during practice</p>
                </div>
                <button
                  onClick={() => updateSetting("interview", "showHints", !settings.interview.showHints)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.interview.showHints ? "bg-[#FF6B6B]" : "bg-[#2a3a4a]"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.interview.showHints ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Display Settings */}
          <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
            <div className="flex items-center gap-2 mb-4">
              <GlobeAltIcon className="h-6 w-6 text-[#FF6B6B]" />
              <h2 className="font-heading text-xl font-bold text-[#FFF5F2]">Display & Appearance</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[#9aabb8] text-sm mb-2">Theme</label>
                <div className="flex gap-3">
                  {["light", "dark", "system"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => updateSetting("display", "theme", theme)}
                      className={`flex-1 py-2 rounded-xl border transition-all ${
                        settings.display.theme === theme
                          ? "bg-[#FF6B6B] border-[#FF6B6B] text-[#0D1B2A]"
                          : "border-[#2a3a4a] text-[#9aabb8] hover:border-[#FF6B6B]/40"
                      }`}
                    >
                      {theme === "light" && <SunIcon className="h-4 w-4 inline mr-1" />}
                      {theme === "dark" && <MoonIcon className="h-4 w-4 inline mr-1" />}
                      {theme === "system" && <DevicePhoneMobileIcon className="h-4 w-4 inline mr-1" />}
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[#9aabb8] text-sm mb-2">Font Size</label>
                <select
                  value={settings.display.fontSize}
                  onChange={(e) => updateSetting("display", "fontSize", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#FFF5F2] font-body">Reduced Motion</p>
                  <p className="text-[#9aabb8] text-sm">Minimize animations and transitions</p>
                </div>
                <button
                  onClick={() => updateSetting("display", "reducedMotion", !settings.display.reducedMotion)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.display.reducedMotion ? "bg-[#FF6B6B]" : "bg-[#2a3a4a]"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.display.reducedMotion ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheckIcon className="h-6 w-6 text-[#FF6B6B]" />
              <h2 className="font-heading text-xl font-bold text-[#FFF5F2]">Privacy</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[#9aabb8] text-sm mb-2">Profile Visibility</label>
                <select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => updateSetting("privacy", "profileVisibility", e.target.value as any)}
                  className="w-full px-4 py-2 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none"
                >
                  <option value="public">Public - Anyone can see</option>
                  <option value="connections">Connections Only</option>
                  <option value="private">Private - Only me</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#FFF5F2] font-body">Show Progress on Profile</p>
                  <p className="text-[#9aabb8] text-sm">Display your interview stats publicly</p>
                </div>
                <button
                  onClick={() => updateSetting("privacy", "showProgress", !settings.privacy.showProgress)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.privacy.showProgress ? "bg-[#FF6B6B]" : "bg-[#2a3a4a]"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.privacy.showProgress ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-[#FFF5F2] font-body">Share Analytics</p>
                  <p className="text-[#9aabb8] text-sm">Help us improve by sharing anonymous usage data</p>
                </div>
                <button
                  onClick={() => updateSetting("privacy", "shareAnalytics", !settings.privacy.shareAnalytics)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.privacy.shareAnalytics ? "bg-[#FF6B6B]" : "bg-[#2a3a4a]"
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.privacy.shareAnalytics ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Language & Region */}
          <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
            <div className="flex items-center gap-2 mb-4">
              <LanguageIcon className="h-6 w-6 text-[#FF6B6B]" />
              <h2 className="font-heading text-xl font-bold text-[#FFF5F2]">Language & Region</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[#9aabb8] text-sm mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => updateSetting("language", "", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>
              <div>
                <label className="block text-[#9aabb8] text-sm mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSetting("timezone", "", e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">GMT (London)</option>
                  <option value="Asia/Tokyo">JST (Tokyo)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold hover:bg-[#FFA07A] transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save All Settings"}
            </button>
          </div>

          {/* Account Actions */}
          <div className="border-t border-[#2a3a4a] pt-6 mt-6">
            <h3 className="font-heading text-lg font-bold text-[#FFF5F2] mb-4">Account Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#2a3a4a] text-[#9aabb8] hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all"
              >
                <KeyIcon className="h-4 w-4" />
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-[#2a3a4a] text-[#9aabb8] hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Logout
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
              >
                <TrashIcon className="h-4 w-4" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-md w-full rounded-2xl bg-[#1B2838] border border-[#2a3a4a] shadow-2xl">
            <div className="p-6">
              <h3 className="font-heading text-xl font-bold text-[#FFF5F2] mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#9aabb8] text-sm mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 pr-10 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9aabb8]"
                    >
                      {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-[#9aabb8] text-sm mb-2">New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#9aabb8] text-sm mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a] text-[#FFF5F2] focus:border-[#FF6B6B]/40 outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={changePassword}
                  className="flex-1 py-2 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold hover:bg-[#FFA07A] transition-all"
                >
                  Update Password
                </button>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2 rounded-xl border border-[#2a3a4a] text-[#9aabb8] hover:text-[#FFF5F2] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-md w-full rounded-2xl bg-[#1B2838] border border-red-500/30 shadow-2xl">
            <div className="p-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                  <TrashIcon className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="font-heading text-xl font-bold text-[#FFF5F2] mb-2">Delete Account</h3>
                <p className="text-[#9aabb8] text-sm mb-4">
                  Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={deleteAccount}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white font-heading font-bold hover:bg-red-600 transition-all"
                  >
                    Yes, Delete Account
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2 rounded-xl border border-[#2a3a4a] text-[#9aabb8] hover:text-[#FFF5F2] transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}