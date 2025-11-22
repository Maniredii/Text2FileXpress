import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
    darkMode?: boolean;
    onBack?: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ darkMode = false, onBack }) => {
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

                <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
                <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            By accessing and using Text2FileXpress ("Service," "we," "our," or "us"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Text2FileXpress is a free web-based text conversion tool that allows users to convert text into various file formats including:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <li>PDF (Portable Document Format)</li>
                            <li>DOCX (Microsoft Word Document)</li>
                            <li>TXT (Plain Text File)</li>
                        </ul>
                        <p className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            All conversions are performed locally in your browser. We do not store or transmit your document content to our servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Use License</h2>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Permission is granted to temporarily use Text2FileXpress for personal and commercial purposes. This license shall automatically terminate if you violate any of these restrictions. Under this license you may not:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <li>Modify or copy the Service's materials</li>
                            <li>Use the materials for any commercial purpose without explicit permission</li>
                            <li>Attempt to reverse engineer any software contained on the Service</li>
                            <li>Remove any copyright or proprietary notations from the materials</li>
                            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. User Responsibilities</h2>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            As a user of Text2FileXpress, you agree to:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <li>Use the Service only for lawful purposes</li>
                            <li>Not upload or convert content that infringes on intellectual property rights</li>
                            <li>Not use the Service to create, distribute, or store illegal, harmful, or offensive content</li>
                            <li>Not attempt to gain unauthorized access to any portion of the Service</li>
                            <li>Not use automated systems (bots, scrapers) to access the Service without permission</li>
                            <li>Comply with all applicable local, state, national, and international laws</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property Rights</h2>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <strong>Your Content:</strong> You retain all rights to the content you create and convert using our Service. We do not claim ownership of your documents or text.
                        </p>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            <strong>Our Service:</strong> The Service itself, including its original content, features, and functionality, is owned by Manideep Reddy Eevuri and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. Privacy and Data Protection</h2>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding the collection and use of your information. By using the Service, you consent to the practices described in the Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Advertising</h2>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            Text2FileXpress may display third-party advertisements to support the free Service. These advertisements are provided by advertising partners such as Google AdSense. We do not control the content of these advertisements and are not responsible for the products or services advertised.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Disclaimer of Warranties</h2>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            The Service is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties of any kind, either express or implied, including but not limited to:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <li>Warranties of merchantability or fitness for a particular purpose</li>
                            <li>Warranties that the Service will be uninterrupted, timely, secure, or error-free</li>
                            <li>Warranties regarding the accuracy, reliability, or quality of any content or information obtained through the Service</li>
                            <li>Warranties that defects will be corrected</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            In no event shall Text2FileXpress, its creator, or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
                        </p>
                        <ul className={`list-disc list-inside space-y-2 ml-4 mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <li>Your access to or use of or inability to access or use the Service</li>
                            <li>Any conduct or content of any third party on the Service</li>
                            <li>Any content obtained from the Service</li>
                            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            If you have any questions about these Terms of Service, please contact us:
                        </p>
                        <div className={`ml-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <p><strong>Email:</strong> deepthedzinr@gmail.com</p>
                            <p><strong>Creator:</strong> Manideep Reddy Eevuri</p>
                            <p><strong>Website:</strong> <a href="https://manideepreddyeevuri.netlify.app/" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Portfolio</a></p>
                        </div>
                    </section>

                    <section className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-yellow-50'}`}>
                        <h3 className="text-lg font-semibold mb-2">⚠️ Important Notice</h3>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                            By using Text2FileXpress, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, you must not use the Service.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
