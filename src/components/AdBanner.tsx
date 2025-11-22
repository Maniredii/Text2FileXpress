import React, { useEffect } from 'react';

interface AdBannerProps {
    darkMode?: boolean;
    slot?: string; // Google AdSense ad slot ID
    format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
    style?: React.CSSProperties;
    className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({
    darkMode = false,
    slot = 'YOUR_AD_SLOT_ID', // Replace with actual AdSense slot ID
    format = 'auto',
    style = {},
    className = ''
}) => {
    useEffect(() => {
        try {
            // Check if user has consented to advertising cookies
            const consent = localStorage.getItem('text2filexpress_cookie_consent');
            if (consent) {
                const preferences = JSON.parse(consent);
                if (preferences.advertising) {
                    // Initialize AdSense ads
                    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                }
            }
        } catch (error) {
            console.error('Error loading ad:', error);
        }
    }, []);

    // Check if ads are enabled
    const consent = localStorage.getItem('text2filexpress_cookie_consent');
    let adsEnabled = false;

    if (consent) {
        try {
            const preferences = JSON.parse(consent);
            adsEnabled = preferences.advertising;
        } catch (e) {
            console.error('Error parsing consent:', e);
        }
    }

    // Don't render if ads are not enabled
    if (!adsEnabled) {
        return (
            <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'} ${className}`}>
                <p className="text-sm">
                    📢 Support us by enabling advertising cookies in your preferences
                </p>
            </div>
        );
    }

    return (
        <div className={`ad-container ${className}`} style={style}>
            {/* Google AdSense Ad Unit */}
            <ins
                className="adsbygoogle"
                style={{ display: 'block', ...style }}
                data-ad-client="ca-pub-XXXXXXXXXX" // Replace with your AdSense publisher ID
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
            ></ins>
        </div>
    );
};

export default AdBanner;
