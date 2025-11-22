import React, { useEffect } from 'react';
import { Github, Linkedin, Globe, Coffee } from 'lucide-react';

interface FooterProps {
    darkMode?: boolean;
}

const Footer: React.FC<FooterProps> = ({ darkMode = false }) => {
    useEffect(() => {
        // Load Buy Me a Coffee widget script
        const script = document.createElement('script');
        script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js';
        script.setAttribute('data-name', 'BMC-Widget');
        script.setAttribute('data-cfasync', 'false');
        script.setAttribute('data-id', 'Manideep');
        script.setAttribute('data-description', 'Support me on Buy me a coffee!');
        script.setAttribute('data-message', 'Support to keep this website Live');
        script.setAttribute('data-color', '#FF813F');
        script.setAttribute('data-position', 'Right');
        script.setAttribute('data-x_margin', '18');
        script.setAttribute('data-y_margin', '18');

        document.body.appendChild(script);

        return () => {
            // Cleanup script on unmount
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <footer className={`mt-8 py-6 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Creator Info */}
                    <div className={`text-center md:text-left ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p className="text-sm">
                            Created with ❤️ by <span className="font-semibold">Manideep Reddy Eevuri</span>
                        </p>
                        <p className="text-xs mt-1">
                            © {new Date().getFullYear()} Text2FileXpress. All rights reserved.
                        </p>
                    </div>

                    {/* Legal Links */}
                    <div className={`flex flex-wrap items-center justify-center gap-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <a href="/privacy" className="hover:underline transition-colors">
                            Privacy Policy
                        </a>
                        <span>•</span>
                        <a href="/terms" className="hover:underline transition-colors">
                            Terms of Service
                        </a>
                        <span>•</span>
                        <a href="/contact" className="hover:underline transition-colors">
                            Contact
                        </a>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/Maniredii"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode
                                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                }`}
                            title="GitHub"
                        >
                            <Github size={20} />
                            <span className="text-sm hidden sm:inline">GitHub</span>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/manideep-reddy-eevuri-661659268/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode
                                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                }`}
                            title="LinkedIn"
                        >
                            <Linkedin size={20} />
                            <span className="text-sm hidden sm:inline">LinkedIn</span>
                        </a>

                        <a
                            href="https://manideepreddyeevuri.netlify.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode
                                ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                                : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                                }`}
                            title="Portfolio"
                        >
                            <Globe size={20} />
                            <span className="text-sm hidden sm:inline">Portfolio</span>
                        </a>

                        <a
                            href="https://www.buymeacoffee.com/Manideep"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
                            title="Buy Me a Coffee"
                        >
                            <Coffee size={20} />
                            <span className="text-sm font-medium">Support</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
