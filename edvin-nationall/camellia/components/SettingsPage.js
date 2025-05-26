import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaCog, 
  FaUser, 
  FaBell, 
  FaPalette, 
  FaKey, 
  FaGlobe, 
  FaCheck,
  FaChevronDown
} from 'react-icons/fa';

const SettingsItem = ({ title, description, children }) => {
  return (
    <div className="space-y-1.5 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <label htmlFor={title} className="text-sm font-medium leading-none text-gray-800 dark:text-gray-200 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {title}
        </label>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{description}</p>
      {children}
    </div>
  );
};

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [accentColor, setAccentColor] = useState('blue');
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    language: "en",
    bio: "Software Engineer",
    location: "Kigali, Rwanda"
  });
  const [password, setPassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saveStatus, setSaveStatus] = useState('idle');

  // Load settings from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedAccentColor = localStorage.getItem('accentColor') || 'blue';
    const savedNotifications = localStorage.getItem('notificationsEnabled') === 'true';
    const savedEmailNotifications = localStorage.getItem('emailNotifications') === 'true';

    setDarkMode(savedDarkMode);
    setAccentColor(savedAccentColor);
    setNotificationsEnabled(savedNotifications);
    setEmailNotifications(savedEmailNotifications);
    
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.style.setProperty('--accent-color', `var(--${savedAccentColor}-500)`);
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
    localStorage.setItem('accentColor', accentColor);
    localStorage.setItem('notificationsEnabled', String(notificationsEnabled));
    localStorage.setItem('emailNotifications', String(emailNotifications));
  }, [darkMode, accentColor, notificationsEnabled, emailNotifications]);

  const handleProfileChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLanguageChange = (e) => {
    setProfile(prev => ({ ...prev, language: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPassword(prev => ({...prev, [e.target.name]: e.target.value}));
  }

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error("Failed to save settings", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleAccentColorChange = (color) => {
    setAccentColor(color);
    document.documentElement.style.setProperty('--accent-color', `var(--${color}-500)`);
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      <span className={`absolute inset-0 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                  <FaCog className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
                    Settings Dashboard
                  </span>
                </h1>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile and Security */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Profile Card */}
                  <div className="border-0 shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                          <FaUser className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-white text-2xl font-bold">Profile Information</h2>
                          <p className="text-blue-100 dark:text-blue-200">
                            Manage your personal details
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingsItem title="First Name" description="Your first name">
                          <input
                            type="text"
                            name="firstName"
                            value={profile.firstName}
                            onChange={handleProfileChange}
                            placeholder="First Name"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          />
                        </SettingsItem>
                        <SettingsItem title="Last Name" description="Your last name">
                          <input
                            type="text"
                            name="lastName"
                            value={profile.lastName}
                            onChange={handleProfileChange}
                            placeholder="Last Name"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          />
                        </SettingsItem>
                      </div>

                      <SettingsItem title="Email" description="Your email address">
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleProfileChange}
                          placeholder="Email"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 cursor-not-allowed"
                          disabled
                        />
                      </SettingsItem>

                      <SettingsItem title="Bio" description="Tell us about yourself">
                        <textarea
                          name="bio"
                          value={profile.bio}
                          onChange={handleProfileChange}
                          placeholder="Write something about yourself..."
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white min-h-[100px] transition-all duration-200"
                        />
                      </SettingsItem>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingsItem title="Location" description="Your current location">
                          <input
                            type="text"
                            name="location"
                            value={profile.location}
                            onChange={handleProfileChange}
                            placeholder="City, Country"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          />
                        </SettingsItem>
                        <SettingsItem title="Language" description="Preferred language">
                          <div className="relative">
                            <select
                              name="language"
                              value={profile.language}
                              onChange={handleLanguageChange}
                              className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 appearance-none"
                            >
                              <option value="en">English</option>
                              <option value="fr">Français</option>
                              <option value="rw">Kinyarwanda</option>
                            </select>
                            <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                          </div>
                        </SettingsItem>
                      </div>
                    </div>
                  </div>

                  {/* Security Card */}
                  <div className="border-0 shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                          <FaKey className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-white text-2xl font-bold">Security Settings</h2>
                          <p className="text-red-100 dark:text-red-200">
                            Change password and security options
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <SettingsItem title="Current Password" description="Enter your current password">
                        <input
                          type="password"
                          name="currentPassword"
                          value={password.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="••••••••"
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                        />
                      </SettingsItem>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SettingsItem title="New Password" description="Create a new password">
                          <input
                            type="password"
                            name="newPassword"
                            value={password.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          />
                        </SettingsItem>
                        <SettingsItem title="Confirm Password" description="Re-enter your new password">
                          <input
                            type="password"
                            name="confirmPassword"
                            value={password.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                          />
                        </SettingsItem>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 rounded-r-lg">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FaExclamationTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              Make sure your password is strong and unique. We recommend using a mix of letters, numbers, and special characters.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Preferences */}
                <div className="space-y-8">
                  {/* Notifications Card */}
                  <div className="border-0 shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                          <FaBell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-white text-2xl font-bold">Notifications</h2>
                          <p className="text-purple-100 dark:text-purple-200">
                            Configure how you receive notifications
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <SettingsItem
                        title="Enable Notifications"
                        description="Receive system updates and alerts"
                      >
                        <div className="flex items-center justify-between">
                          <ToggleSwitch
                            checked={notificationsEnabled}
                            onChange={setNotificationsEnabled}
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {notificationsEnabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </SettingsItem>

                      <SettingsItem
                        title="Email Notifications"
                        description="Receive notifications via email"
                      >
                        <div className="flex items-center justify-between">
                          <ToggleSwitch
                            checked={emailNotifications}
                            onChange={setEmailNotifications}
                            disabled={!notificationsEnabled}
                          />
                          <span className={`text-sm font-medium ${!notificationsEnabled ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                            {emailNotifications ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </SettingsItem>

                      <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700 dark:text-gray-300">Notification Types</h4>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">System Updates</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Important platform updates</p>
                          </div>
                          <ToggleSwitch checked={true} onChange={() => {}} />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-200">Security Alerts</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Critical security notifications</p>
                          </div>
                          <ToggleSwitch checked={true} onChange={() => {}} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appearance Card */}
                  <div className="border-0 shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                          <FaPalette className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-white text-2xl font-bold">Appearance</h2>
                          <p className="text-indigo-100 dark:text-indigo-200">
                            Customize the look and feel
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <SettingsItem
                        title="Dark Mode"
                        description="Toggle between light and dark themes"
                      >
                        <div className="flex items-center justify-between">
                          <ToggleSwitch
                            checked={darkMode}
                            onChange={setDarkMode}
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {darkMode ? 'Dark' : 'Light'}
                          </span>
                        </div>
                      </SettingsItem>

                      <SettingsItem title="Accent Color" description="Choose your preferred accent color">
                        <div className="flex flex-wrap gap-3">
                          {['blue', 'purple', 'red', 'green', 'yellow', 'indigo', 'pink', 'teal'].map((color) => (
                            <button
                              key={color}
                              onClick={() => handleAccentColorChange(color)}
                              className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110 bg-${color}-500 ${accentColor === color ? `border-${color}-600 ring-2 ring-${color}-500` : 'border-gray-300 dark:border-gray-600'}`}
                              title={color.charAt(0).toUpperCase() + color.slice(1)}
                            >
                              {accentColor === color && (
                                <FaCheck className="w-4 h-4 text-white" />
                              )}
                            </button>
                          ))}
                        </div>
                      </SettingsItem>

                      <SettingsItem title="Theme Preview" description="See how your settings look">
                        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-8 h-8 rounded-full bg-${accentColor}-500 flex items-center justify-center`}>
                              <FaUser className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>John Doe</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Software Engineer</p>
                            </div>
                          </div>
                          <div className={`text-sm p-3 rounded ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                            This is a preview of how your theme will look with the current settings.
                          </div>
                          <div className="mt-3 flex justify-end">
                            <button className={`px-3 py-1.5 text-sm rounded-md bg-${accentColor}-500 text-white font-medium`}>
                              Example Button
                            </button>
                          </div>
                        </div>
                      </SettingsItem>
                    </div>
                  </div>

                  {/* Regional Settings Card */}
                  <div className="border-0 shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl">
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 dark:from-teal-600 dark:to-teal-700 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                          <FaGlobe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-white text-2xl font-bold">Regional Settings</h2>
                          <p className="text-teal-100 dark:text-teal-200">
                            Set your location preferences
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <SettingsItem title="Timezone" description="Select your local timezone">
                        <div className="relative">
                          <select
                            name="timezone"
                            className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 appearance-none"
                          >
                            <option value="Africa/Kigali">Africa/Kigali (GMT+2)</option>
                            <option value="UTC">UTC (GMT+0)</option>
                            <option value="America/New_York">America/New York (GMT-5)</option>
                            <option value="Europe/London">Europe/London (GMT+1)</option>
                            <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                          </select>
                          <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                        </div>
                      </SettingsItem>

                      <SettingsItem title="Date Format" description="Choose your preferred date format">
                        <div className="relative">
                          <select
                            name="dateformat"
                            className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 appearance-none"
                          >
                            <option value="dd/mm/yyyy">DD/MM/YYYY (e.g. 25/12/2023)</option>
                            <option value="mm/dd/yyyy">MM/DD/YYYY (e.g. 12/25/2023)</option>
                            <option value="yyyy-mm-dd">YYYY-MM-DD (e.g. 2023-12-25)</option>
                            <option value="month-day-year">Month Day, Year (e.g. December 25, 2023)</option>
                          </select>
                          <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 dark:text-gray-500 pointer-events-none" />
                        </div>
                      </SettingsItem>

                      <SettingsItem title="Temperature Unit" description="Celsius or Fahrenheit">
                        <div className="flex space-x-4">
                          <button className={`px-4 py-2 rounded-md ${profile.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                            °C Celsius
                          </button>
                          <button className={`px-4 py-2 rounded-md ${profile.language !== 'en' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                            °F Fahrenheit
                          </button>
                        </div>
                      </SettingsItem>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-10 flex justify-end sticky bottom-6 z-10">
                <button
                  onClick={handleSaveSettings}
                  disabled={saveStatus === 'saving'}
                  className={`
                    px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${saveStatus === 'idle' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500' : ''}
                    ${saveStatus === 'saving' ? 'bg-blue-400 cursor-not-allowed' : ''}
                    ${saveStatus === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600 focus:ring-green-500 flex items-center space-x-2' : ''}
                    ${saveStatus === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600 focus:ring-red-500 flex items-center space-x-2' : ''}
                  `}
                >
                  {saveStatus === 'idle' && "Save All Changes"}
                  {saveStatus === 'saving' && (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  )}
                  {saveStatus === 'success' && (
                    <>
                      <FaCheckCircle className="w-5 h-5" />
                      <span>Changes Saved!</span>
                    </>
                  )}
                  {saveStatus === 'error' && (
                    <>
                      <FaExclamationTriangle className="w-5 h-5" />
                      <span>Error Saving</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;