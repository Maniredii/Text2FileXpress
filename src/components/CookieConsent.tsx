import React, { useState, useEffect } from 'react';
import { X, Cookie, Shield, Settings } from 'lucide-react';

interface CookieConsentProps {
    darkMode?: boolean;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ darkMode = false }) => {
    const [showBanner, setShowBanner] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState({
        necessary: true, // Always true, can't be disabled
        analytics: false,
        advertising: false,
    });

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('text2filexpress_cookie_consent');
        if (!consent) {
            // Show banner after a short delay for better UX
            setTimeout(() => setShowBanner(true), 1000);
        } else {
            // Load saved preferences
            try {
                const savedPrefs = JSON.parse(consent);
                setPreferences(savedPrefs);
            } catch (e) {
                console.error('Error loading cookie preferences:', e);
            }
        }
    }, []);

    const saveConsent = (prefs: typeof preferences) => {
        localStorage.setItem('text2filexpress_cookie_consent', JSON.stringify(prefs));
        setShowBanner(false);
        setShowSettings(false);

        // Here you would initialize analytics/advertising based on preferences
        if (prefs.analytics) {
            // Initialize Google Analytics or other analytics
            console.log('Analytics enabled');
        }
        if (prefs.advertising) {
            // Initialize Google AdSense or other ad services
            console.log('Advertising enabled');
        }
    };

    const acceptAll = () => {
        const allAccepted = {
            necessary: true,
            analytics: true,
            advertising: true,
        };
        setPreferences(allAccepted);
        saveConsent(allAccepted);
    };

    const acceptNecessary = () => {
        const necessaryOnly = {
            necessary: true,
            analytics: false,
            advertising: false,
        };
        setPreferences(necessaryOnly);
        saveConsent(necessaryOnly);
    };

    const savePreferences = () => {
        saveConsent(preferences);
    };

    if (!showBanner) return null;

    return (
        <>
            {/* Cookie Consent Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-slide-up">
                <div className={`max-w-6xl mx-auto rounded-lg shadow-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                    }`}>
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                                <Cookie className={darkMode ? 'text-blue-400' : 'text-blue-600'} size={24} />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                    <Shield size={20} />
                                    We Value Your Privacy
                                </h3>
                                <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                    We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic.
                                    By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or decline non-essential cookies.
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={acceptAll}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Accept All
                                    </button>
                                    <button
                                        onClick={acceptNecessary}
                                        className={`px-6 py-2 font-medium rounded-lg transition-colors ${darkMode
                                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                            }`}
                                    >
                                        Necessary Only
                                    </button>
                                    <button
                                        onClick={() => setShowSettings(true)}
                                        className={`px-6 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${darkMode
                                                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                            }`}
                                    >
                                        <Settings size={16} />
                                        Customize
                                    </button>
                                </div>

                                <p className={`text-xs mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Read our{' '}
                                    <a href="#privacy" className="underline hover:text-blue-500">Privacy Policy</a>
                                    {' '}and{' '}
                                    <a href="#terms" className="underline hover:text-blue-500">Terms of Service</a>
                                    {' '}for more information.
                                </p>
                            </div>

                            <button
                                onClick={acceptNecessary}
                                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                    }`}
                                aria-label="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cookie Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className={`max-w-2xl w-full rounded-lg shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Settings size={24} />
                                    Cookie Preferences
                                </h2>
                                <button
                                    onClick={() => setShowSettings(false)}
                                    className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                        }`}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Necessary Cookies */}
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">Necessary Cookies</h3>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                                            }`}>
                                            Always Active
                                        </div>
                                    </div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        These cookies are essential for the website to function properly. They enable basic features like page navigation and access to secure areas. The website cannot function properly without these cookies.
                                    </p>
                                </div>

                                {/* Analytics Cookies */}
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">Analytics Cookies</h3>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.analytics}
                                                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website.
                                    </p>
                                </div>

                                {/* Advertising Cookies */}
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">Advertising Cookies</h3>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={preferences.advertising}
                                                onChange={(e) => setPreferences({ ...preferences, advertising: e.target.checked })}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing and ensuring that ads are properly displayed.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={savePreferences}
                                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                                >
                                    Save Preferences
                                </button>
                                <button
                                    onClick={acceptAll}
                                    className={`flex-1 px-6 py-3 font-medium rounded-lg transition-colors ${darkMode
                                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                                        }`}
                                >
                                    Accept All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CookieConsent;
