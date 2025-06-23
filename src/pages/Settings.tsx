import React, { useState } from 'react';
import { useSettingsContext } from '../context/SettingsContext';
import { 
  Settings as SettingsIcon, User, Bell, Shield, Link, CreditCard, 
  Key, FileText, Database, Save, RefreshCw, Download, Search, 
  MoreHorizontal, Plus, Trash2, Eye, EyeOff, Copy, Check, 
  AlertTriangle, CheckCircle, XCircle, Clock, Globe, Mail, 
  Phone, MapPin, Calendar, DollarSign, Lock, Unlock, Edit,
  Camera, Upload, Smartphone, Laptop, Monitor, Activity,
  Zap, Archive, HardDrive, Cloud, Server, Network, BarChart3
} from 'lucide-react';

const Settings: React.FC = () => {
  const { 
    userProfile,
    notificationPreferences,
    securitySettings,
    integrations,
    billingSettings,
    apiKeys,
    auditLogs,
    backupConfig,
    updateUserProfile,
    updateNotificationPreference,
    updateSecuritySetting,
    updateIntegration,
    updateBillingSettings,
    createAPIKey,
    deleteAPIKey,
    updateBackupConfig
  } = useSettingsContext();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAPIKey, setShowAPIKey] = useState<Record<string, boolean>>({});
  const [newAPIKeyName, setNewAPIKeyName] = useState('');
  const [newAPIKeyPermissions, setNewAPIKeyPermissions] = useState<string[]>([]);
  const [showCreateAPIKey, setShowCreateAPIKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleAPIKeyVisibility = (keyId: string) => {
    setShowAPIKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const handleCreateAPIKey = () => {
    if (newAPIKeyName && newAPIKeyPermissions.length > 0) {
      createAPIKey(newAPIKeyName, newAPIKeyPermissions);
      setNewAPIKeyName('');
      setNewAPIKeyPermissions([]);
      setShowCreateAPIKey(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Connected':
      case 'Active':
      case 'Success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Disconnected':
      case 'Inactive':
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'Configuring':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'Warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'Communication':
        return <Mail className="h-5 w-5" />;
      case 'Monitoring':
        return <Activity className="h-5 w-5" />;
      case 'ITSM':
        return <FileText className="h-5 w-5" />;
      case 'CI/CD':
        return <Zap className="h-5 w-5" />;
      case 'Analytics':
        return <BarChart3 className="h-5 w-5" />;
      case 'Storage':
        return <HardDrive className="h-5 w-5" />;
      default:
        return <Link className="h-5 w-5" />;
    }
  };

  const filteredAuditLogs = auditLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
          <p className="text-sm text-gray-600">Update your personal details and preferences</p>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">{userProfile.firstName} {userProfile.lastName}</h4>
              <p className="text-sm text-gray-600">{userProfile.jobTitle}</p>
              <p className="text-sm text-gray-500">{userProfile.department} • {userProfile.company}</p>
              <button className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={userProfile.firstName}
                onChange={(e) => updateUserProfile({ firstName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={userProfile.lastName}
                onChange={(e) => updateUserProfile({ lastName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={userProfile.email}
                onChange={(e) => updateUserProfile({ email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={userProfile.phone}
                onChange={(e) => updateUserProfile({ phone: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                value={userProfile.jobTitle}
                onChange={(e) => updateUserProfile({ jobTitle: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <input
                type="text"
                id="department"
                value={userProfile.department}
                onChange={(e) => updateUserProfile({ department: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={userProfile.company}
                onChange={(e) => updateUserProfile({ company: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={userProfile.location}
                onChange={(e) => updateUserProfile({ location: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              value={userProfile.bio}
              onChange={(e) => updateUserProfile({ bio: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
          <p className="text-sm text-gray-600">Customize your experience</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700">
                Time Zone
              </label>
              <select
                id="timeZone"
                value={userProfile.timeZone}
                onChange={(e) => updateUserProfile({ timeZone: e.target.value as any })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="GMT">Greenwich Mean Time (GMT)</option>
                <option value="CET">Central European Time (CET)</option>
                <option value="JST">Japan Standard Time (JST)</option>
                <option value="CST">China Standard Time (CST)</option>
              </select>
            </div>
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                Language
              </label>
              <select
                id="language"
                value={userProfile.language}
                onChange={(e) => updateUserProfile({ language: e.target.value as any })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Japanese">Japanese</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>
            <div>
              <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                Date Format
              </label>
              <select
                id="dateFormat"
                value={userProfile.dateFormat}
                onChange={(e) => updateUserProfile({ dateFormat: e.target.value as any })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                id="currency"
                value={userProfile.currency}
                onChange={(e) => updateUserProfile({ currency: e.target.value as any })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CNY">CNY - Chinese Yuan</option>
              </select>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      {notificationPreferences.map((pref) => (
        <div key={pref.id} className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{pref.type}</h3>
              <p className="text-sm text-gray-600">Configure how you receive {pref.type.toLowerCase()}</p>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => updateNotificationPreference(pref.id, { enabled: !pref.enabled })}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  pref.enabled ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    pref.enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
          {pref.enabled && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Notification Channels
                  </label>
                  <div className="space-y-2">
                    {['Email', 'SMS', 'Slack', 'Teams', 'Webhook'].map((channel) => (
                      <div key={channel} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${pref.id}-${channel}`}
                          checked={pref.channels.includes(channel as any)}
                          onChange={(e) => {
                            const channels = e.target.checked
                              ? [...pref.channels, channel as any]
                              : pref.channels.filter(c => c !== channel);
                            updateNotificationPreference(pref.id, { channels });
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`${pref.id}-${channel}`} className="ml-2 block text-sm text-gray-700">
                          {channel}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <label htmlFor={`${pref.id}-severity`} className="block text-sm font-medium text-gray-700">
                      Minimum Severity
                    </label>
                    <select
                      id={`${pref.id}-severity`}
                      value={pref.severity}
                      onChange={(e) => updateNotificationPreference(pref.id, { severity: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="All">All</option>
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`${pref.id}-frequency`} className="block text-sm font-medium text-gray-700">
                      Frequency
                    </label>
                    <select
                      id={`${pref.id}-frequency`}
                      value={pref.frequency}
                      onChange={(e) => updateNotificationPreference(pref.id, { frequency: e.target.value as any })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Immediate">Immediate</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Quiet Hours
                  </label>
                  <button
                    onClick={() => updateNotificationPreference(pref.id, { 
                      quietHours: { ...pref.quietHours, enabled: !pref.quietHours.enabled }
                    })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      pref.quietHours.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        pref.quietHours.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                {pref.quietHours.enabled && (
                  <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`${pref.id}-start`} className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        id={`${pref.id}-start`}
                        value={pref.quietHours.start}
                        onChange={(e) => updateNotificationPreference(pref.id, {
                          quietHours: { ...pref.quietHours, start: e.target.value }
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={`${pref.id}-end`} className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <input
                        type="time"
                        id={`${pref.id}-end`}
                        value={pref.quietHours.end}
                        onChange={(e) => updateNotificationPreference(pref.id, {
                          quietHours: { ...pref.quietHours, end: e.target.value }
                        })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
          <p className="text-sm text-gray-600">Configure security policies and access controls</p>
        </div>
        <div className="divide-y divide-gray-200">
          {securitySettings.map((setting) => (
            <div key={setting.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium text-gray-900">{setting.name}</h4>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      setting.level === 'Basic' ? 'bg-gray-100 text-gray-800' :
                      setting.level === 'Standard' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {setting.level}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{setting.description}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span className="capitalize">{setting.category}</span>
                    <span className="mx-2">•</span>
                    <span>Last modified: {new Date(setting.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => updateSecuritySetting(setting.id, !setting.enabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      setting.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        setting.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Password Policy</h3>
          <p className="text-sm text-gray-600">Configure password requirements</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Minimum password length</h4>
                <p className="text-sm text-gray-600">Require passwords to be at least 8 characters</p>
              </div>
              <input
                type="number"
                min="6"
                max="32"
                defaultValue="8"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Password complexity</h4>
                <p className="text-sm text-gray-600">Require uppercase, lowercase, numbers, and symbols</p>
              </div>
              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-blue-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Password expiration</h4>
                <p className="text-sm text-gray-600">Force password changes every 90 days</p>
              </div>
              <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <span className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Third-Party Integrations</h3>
            <p className="text-sm text-gray-600">Connect external services and tools</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </button>
        </div>
        <div className="divide-y divide-gray-200">
          {integrations.map((integration) => (
            <div key={integration.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    integration.status === 'Connected' ? 'bg-green-100' :
                    integration.status === 'Error' ? 'bg-red-100' :
                    integration.status === 'Configuring' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    {getIntegrationIcon(integration.type)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                    <div className="mt-1 flex items-center">
                      {getStatusIcon(integration.status)}
                      <span className="ml-1 text-xs text-gray-500">{integration.status}</span>
                      {integration.lastSync && (
                        <>
                          <span className="mx-2 text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            Last sync: {new Date(integration.lastSync).toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateIntegration(integration.id, { enabled: !integration.enabled })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      integration.enabled ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        integration.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Billing Information</h3>
          <p className="text-sm text-gray-600">Manage your billing details and payment methods</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Billing Contact</h4>
              <div className="space-y-4">
                <div>
                  <label htmlFor="billingName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="billingName"
                    value={billingSettings.billingContact.name}
                    onChange={(e) => updateBillingSettings({
                      billingContact: { ...billingSettings.billingContact, name: e.target.value }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="billingEmail" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="billingEmail"
                    value={billingSettings.billingContact.email}
                    onChange={(e) => updateBillingSettings({
                      billingContact: { ...billingSettings.billingContact, email: e.target.value }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="billingPhone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="billingPhone"
                    value={billingSettings.billingContact.phone}
                    onChange={(e) => updateBillingSettings({
                      billingContact: { ...billingSettings.billingContact, phone: e.target.value }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Payment Method</h4>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-8 w-8 text-gray-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {billingSettings.paymentMethod.type}
                      </p>
                      {billingSettings.paymentMethod.lastFour && (
                        <p className="text-sm text-gray-600">
                          •••• •••• •••• {billingSettings.paymentMethod.lastFour}
                        </p>
                      )}
                      {billingSettings.paymentMethod.expiryDate && (
                        <p className="text-xs text-gray-500">
                          Expires {billingSettings.paymentMethod.expiryDate}
                        </p>
                      )}
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                id="street"
                value={billingSettings.billingAddress.street}
                onChange={(e) => updateBillingSettings({
                  billingAddress: { ...billingSettings.billingAddress, street: e.target.value }
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                value={billingSettings.billingAddress.city}
                onChange={(e) => updateBillingSettings({
                  billingAddress: { ...billingSettings.billingAddress, city: e.target.value }
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                State/Province
              </label>
              <input
                type="text"
                id="state"
                value={billingSettings.billingAddress.state}
                onChange={(e) => updateBillingSettings({
                  billingAddress: { ...billingSettings.billingAddress, state: e.target.value }
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                id="zipCode"
                value={billingSettings.billingAddress.zipCode}
                onChange={(e) => updateBillingSettings({
                  billingAddress: { ...billingSettings.billingAddress, zipCode: e.target.value }
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="country"
                value={billingSettings.billingAddress.country}
                onChange={(e) => updateBillingSettings({
                  billingAddress: { ...billingSettings.billingAddress, country: e.target.value }
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="Japan">Japan</option>
                <option value="Australia">Australia</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Budget Alerts</h3>
          <p className="text-sm text-gray-600">Get notified when spending exceeds thresholds</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Enable budget alerts
            </label>
            <button
              onClick={() => updateBillingSettings({
                budgetAlerts: { ...billingSettings.budgetAlerts, enabled: !billingSettings.budgetAlerts.enabled }
              })}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                billingSettings.budgetAlerts.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  billingSettings.budgetAlerts.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          {billingSettings.budgetAlerts.enabled && (
            <div className="space-y-4">
              <div>
                <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">
                  Alert Threshold ($)
                </label>
                <input
                  type="number"
                  id="threshold"
                  value={billingSettings.budgetAlerts.threshold}
                  onChange={(e) => updateBillingSettings({
                    budgetAlerts: { ...billingSettings.budgetAlerts, threshold: parseInt(e.target.value) }
                  })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="recipients" className="block text-sm font-medium text-gray-700">
                  Alert Recipients
                </label>
                <textarea
                  id="recipients"
                  rows={3}
                  value={billingSettings.budgetAlerts.recipients.join(', ')}
                  onChange={(e) => updateBillingSettings({
                    budgetAlerts: { 
                      ...billingSettings.budgetAlerts, 
                      recipients: e.target.value.split(',').map(email => email.trim())
                    }
                  })}
                  placeholder="Enter email addresses separated by commas"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAPIKeys = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
            <p className="text-sm text-gray-600">Manage API keys for programmatic access</p>
          </div>
          <button
            onClick={() => setShowCreateAPIKey(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create API Key
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Key className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{key.name}</div>
                        <div className="text-xs text-gray-500">Created {new Date(key.created).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <code className="text-sm font-mono text-gray-900">
                        {showAPIKey[key.id] ? key.key : '••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => toggleAPIKeyVisibility(key.id)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        {showAPIKey[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(key.key, key.id)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        {copiedKey === key.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {key.permissions.slice(0, 2).map((permission) => (
                        <span
                          key={permission}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {permission}
                        </span>
                      ))}
                      {key.permissions.length > 2 && (
                        <span className="text-xs text-gray-500">+{key.permissions.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      key.status === 'Active' ? 'bg-green-100 text-green-800' :
                      key.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800" title="Edit">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteAPIKey(key.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateAPIKey && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create API Key</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="apiKeyName" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    id="apiKeyName"
                    value={newAPIKeyName}
                    onChange={(e) => setNewAPIKeyName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter API key name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {['read:all', 'write:vms', 'write:databases', 'read:metrics', 'write:alerts'].map((permission) => (
                      <div key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          id={permission}
                          checked={newAPIKeyPermissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAPIKeyPermissions([...newAPIKeyPermissions, permission]);
                            } else {
                              setNewAPIKeyPermissions(newAPIKeyPermissions.filter(p => p !== permission));
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={permission} className="ml-2 block text-sm text-gray-700">
                          {permission}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateAPIKey(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAPIKey}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAuditLogs = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Audit Logs</h3>
            <p className="text-sm text-gray-600">Track all user actions and system events</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search logs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <Search size={18} />
              </div>
            </div>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAuditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{log.action}</div>
                      <div className="text-xs text-gray-500">{log.details}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.resource}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      log.status === 'Success' ? 'bg-green-100 text-green-800' :
                      log.status === 'Failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-500">
          Showing {filteredAuditLogs.length} of {auditLogs.length} audit logs
        </div>
      </div>
    </div>
  );

  const renderBackup = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Backup Configuration</h3>
          <p className="text-sm text-gray-600">Configure automated backups for your data</p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Enable Automated Backups</h4>
              <p className="text-sm text-gray-600">Automatically backup your infrastructure configuration and data</p>
            </div>
            <button
              onClick={() => updateBackupConfig({ enabled: !backupConfig.enabled })}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                backupConfig.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  backupConfig.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {backupConfig.enabled && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                    Backup Frequency
                  </label>
                  <select
                    id="frequency"
                    value={backupConfig.frequency}
                    onChange={(e) => updateBackupConfig({ frequency: e.target.value as any })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="retention" className="block text-sm font-medium text-gray-700">
                    Retention Period (days)
                  </label>
                  <input
                    type="number"
                    id="retention"
                    min="1"
                    max="365"
                    value={backupConfig.retention}
                    onChange={(e) => updateBackupConfig({ retention: parseInt(e.target.value) })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Backup Location
                </label>
                <select
                  id="location"
                  value={backupConfig.location}
                  onChange={(e) => updateBackupConfig({ location: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Azure Blob Storage - West US">Azure Blob Storage - West US</option>
                  <option value="Azure Blob Storage - East US">Azure Blob Storage - East US</option>
                  <option value="Azure Blob Storage - Europe">Azure Blob Storage - Europe</option>
                  <option value="AWS S3 - US West">AWS S3 - US West</option>
                  <option value="Google Cloud Storage">Google Cloud Storage</option>
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Encryption</h4>
                    <p className="text-sm text-gray-600">Encrypt backup data at rest</p>
                  </div>
                  <button
                    onClick={() => updateBackupConfig({ encryption: !backupConfig.encryption })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      backupConfig.encryption ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        backupConfig.encryption ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Auto Restore</h4>
                    <p className="text-sm text-gray-600">Automatically restore from backup on failure</p>
                  </div>
                  <button
                    onClick={() => updateBackupConfig({ autoRestore: !backupConfig.autoRestore })}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      backupConfig.autoRestore ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        backupConfig.autoRestore ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Backup Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Last Backup</div>
                    <div className="text-sm font-medium text-gray-900">
                      {backupConfig.lastBackup ? new Date(backupConfig.lastBackup).toLocaleString() : 'Never'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Next Backup</div>
                    <div className="text-sm font-medium text-gray-900">
                      {backupConfig.nextBackup ? new Date(backupConfig.nextBackup).toLocaleString() : 'Not scheduled'}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <Archive className="h-4 w-4 mr-2" />
                    Backup Now
                  </button>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restore
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfile();
      case 'notifications':
        return renderNotifications();
      case 'security':
        return renderSecurity();
      case 'integrations':
        return renderIntegrations();
      case 'billing':
        return renderBilling();
      case 'api':
        return renderAPIKeys();
      case 'audit':
        return renderAuditLogs();
      case 'backup':
        return renderBackup();
      default:
        return renderProfile();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'profile' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <User size={16} className="mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'notifications' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bell size={16} className="mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'security' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield size={16} className="mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'integrations' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Link size={16} className="mr-2" />
              Integrations
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'billing' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <CreditCard size={16} className="mr-2" />
              Billing
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'api' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Key size={16} className="mr-2" />
              API Keys
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'audit' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText size={16} className="mr-2" />
              Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('backup')}
              className={`flex items-center px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'backup' 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Database size={16} className="mr-2" />
              Backup
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;