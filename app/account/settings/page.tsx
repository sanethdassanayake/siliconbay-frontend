"use client"

import React from 'react'
import { User, Lock, Bell, Globe, Shield, CreditCard, Mail, Eye, EyeOff, Save } from 'lucide-react'

const Settings = () => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
        <div className="flex-1 space-y-6">
            {/* Page Header */}
            <div className="bg-white border p-4">
                <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your account preferences and security settings</p>
            </div>

            {/* Profile Information */}
            <div className="bg-white border">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="bg-amber-50 p-2">
                        <User className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Profile Information</h2>
                        <p className="text-sm text-gray-600">Update your personal details</p>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                defaultValue="John"
                                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                defaultValue="Doe"
                                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                defaultValue="john.doe@example.com"
                                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input
                                type="tel"
                                defaultValue="+1 (555) 123-4567"
                                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                            <input
                                type="date"
                                defaultValue="1990-01-15"
                                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className="px-6 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white border">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="bg-amber-50 p-2">
                        <Lock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Security</h2>
                        <p className="text-sm text-gray-600">Manage your password and security preferences</p>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter current password"
                                    className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                                />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div></div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-amber-500 border-gray-300" />
                            <span className="text-sm text-gray-700">Enable two-factor authentication (2FA)</span>
                        </label>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className="px-6 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Update Password
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-white border">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="bg-amber-50 p-2">
                        <Bell className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Notifications</h2>
                        <p className="text-sm text-gray-600">Control how you receive notifications</p>
                    </div>
                </div>
                <div className="p-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border">
                            <div>
                                <p className="font-medium text-gray-900">Order Updates</p>
                                <p className="text-sm text-gray-600">Receive notifications about your order status</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 border">
                            <div>
                                <p className="font-medium text-gray-900">Promotional Emails</p>
                                <p className="text-sm text-gray-600">Receive special offers and deals</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 border">
                            <div>
                                <p className="font-medium text-gray-900">Newsletter</p>
                                <p className="text-sm text-gray-600">Weekly newsletter with tips and updates</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 border">
                            <div>
                                <p className="font-medium text-gray-900">SMS Notifications</p>
                                <p className="text-sm text-gray-600">Get text messages for important updates</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className="px-6 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Preferences
                        </button>
                    </div>
                </div>
            </div>

            {/* Language & Region */}
            <div className="bg-white border">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="bg-amber-50 p-2">
                        <Globe className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Language & Region</h2>
                        <p className="text-sm text-gray-600">Set your language and regional preferences</p>
                    </div>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                            <select className="w-full px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option>English</option>
                                <option>Spanish</option>
                                <option>French</option>
                                <option>German</option>
                                <option>Chinese</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                            <select className="w-full px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option>GMT-5 (Eastern Time)</option>
                                <option>GMT-6 (Central Time)</option>
                                <option>GMT-7 (Mountain Time)</option>
                                <option>GMT-8 (Pacific Time)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                            <select className="w-full px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                                <option>JPY (¥)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                            <select className="w-full px-4 py-2 border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option>MM/DD/YYYY</option>
                                <option>DD/MM/YYYY</option>
                                <option>YYYY-MM-DD</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className="px-6 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white border">
                <div className="p-4 border-b flex items-center gap-3">
                    <div className="bg-amber-50 p-2">
                        <Shield className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Privacy & Data</h2>
                        <p className="text-sm text-gray-600">Control your privacy and data sharing preferences</p>
                    </div>
                </div>
                <div className="p-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border">
                            <div>
                                <p className="font-medium text-gray-900">Profile Visibility</p>
                                <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 border">
                            <div>
                                <p className="font-medium text-gray-900">Activity Tracking</p>
                                <p className="text-sm text-gray-600">Allow us to track your activity for personalized recommendations</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 border">
                            <div>
                                <p className="font-medium text-gray-900">Data Sharing</p>
                                <p className="text-sm text-gray-600">Share your data with third-party partners</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                        <button className="px-6 py-2 border hover:bg-gray-50">
                            Download My Data
                        </button>
                        <button className="px-6 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save Settings
                        </button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white border border-red-200">
                <div className="p-4 border-b border-red-200 bg-red-50">
                    <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
                    <p className="text-sm text-red-700">Irreversible actions that affect your account</p>
                </div>
                <div className="p-4">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-red-200">
                            <div>
                                <p className="font-medium text-gray-900">Deactivate Account</p>
                                <p className="text-sm text-gray-600">Temporarily disable your account</p>
                            </div>
                            <button className="px-4 py-2 border border-red-500 text-red-600 hover:bg-red-50">
                                Deactivate
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 border border-red-200">
                            <div>
                                <p className="font-medium text-gray-900">Delete Account</p>
                                <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
                            </div>
                            <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-700">
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings