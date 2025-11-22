import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
    darkMode?: boolean;
    onBack?: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ darkMode = false, onBack }) => {
    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {onBack && (
                    <button
                        onClick={onBack}
                        className={`flex items-center gap-2 mb-6 px-4 py-2 rounded-lg transition-colors ${darkMode
                                ? 'hover:bg-gray-800 text-gray-300'
                                : 'hover:bg-gray-200 text-gray-700'
                            }`}
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Converter</span>
                    </button>
                )}

                <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
                <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Welcome to Text2FileXpress ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our text-to-file conversion services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-4">2.1 Information You Provide</h3>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            We collect information that you voluntarily provide to us when you:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <li>Use our text conversion services (text content you input)</li>
                            <li>Contact us via our contact form or email</li>
                            <li>Subscribe to our newsletter (if applicable)</li>
                            <li>Participate in surveys or promotions</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-4">2.2 Automatically Collected Information</h3>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            When you visit our website, we automatically collect certain information about your device, including:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <li>Browser type and version</li>
                            <li>Operating system</li>
                            <li>IP address</li>
                            <li>Pages visited and time spent on pages</li>
                            <li>Referring website addresses</li>
                            <li>Device identifiers</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-4">2.3 Cookies and Tracking Technologies</h3>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            We use the information we collect for the following purposes:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <li>To provide and maintain our text conversion services</li>
                            <li>To improve and optimize our website and services</li>
                            <li>To understand how users interact with our website</li>
                            <li>To communicate with you about updates, support, and promotional offers</li>
                            <li>To detect, prevent, and address technical issues and security threats</li>
                            <li>To comply with legal obligations</li>
                            <li>To display personalized advertisements (via Google AdSense or similar services)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Processing</h2>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            <strong>Important:</strong> Text2FileXpress processes all text conversions locally in your browser. We do not store or transmit your document content to our servers. Your text data remains on your device and is automatically saved to your browser's local storage for convenience. You can clear this data at any time using the "Clear Draft" feature.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Third-Party Services</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-4">5.1 Advertising</h3>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            We use third-party advertising services such as Google AdSense to display advertisements on our website. These services may use cookies and web beacons to collect information about your visits to this and other websites to provide advertisements about goods and services of interest to you.
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-4">5.2 Analytics</h3>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            We may use third-party analytics services (such as Google Analytics) to monitor and analyze website traffic and user behavior. These services help us understand how visitors use our website and improve user experience.
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-4">5.3 Hosting and CDN</h3>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Our website is hosted on Netlify. Please refer to Netlify's privacy policy for information on how they handle data.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Data Sharing and Disclosure</h2>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <li><strong>With service providers:</strong> We may share information with third-party vendors who perform services on our behalf (e.g., hosting, analytics, advertising)</li>
                            <li><strong>For legal purposes:</strong> We may disclose information if required by law or in response to valid legal requests</li>
                            <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Your Rights and Choices</h2>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            You have the following rights regarding your personal information:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                            <li><strong>Opt-out:</strong> Opt-out of marketing communications and personalized advertising</li>
                            <li><strong>Cookie control:</strong> Manage cookie preferences through your browser settings</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Our service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us, and we will delete such information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Data Security</h2>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            We implement appropriate technical and organizational security measures to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country. By using our service, you consent to such transfers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            If you have any questions about this Privacy Policy or our privacy practices, please contact us:
                        </p>
                        <div className={`ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <p><strong>Email:</strong> deepthedzinr@gmail.com</p>
                            <p><strong>Creator:</strong> Manideep Reddy Eevuri</p>
                            <p><strong>Website:</strong> <a href="https://manideepreddyeevuri.netlify.app/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Portfolio</a></p>
                        </div>
                    </section>

                    <section className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                        <h3 className="text-lg font-semibold mb-2">GDPR Compliance (EU Users)</h3>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR), including the right to data portability, the right to object to processing, and the right to lodge a complaint with a supervisory authority.
                        </p>
                    </section>

                    <section className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                        <h3 className="text-lg font-semibold mb-2">CCPA Compliance (California Users)</h3>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect, the right to delete personal information, and the right to opt-out of the sale of personal information (note: we do not sell personal information).
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
