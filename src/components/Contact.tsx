import React, { useState } from 'react';
import { ArrowLeft, Mail, Github, Linkedin, Globe, Send } from 'lucide-react';

interface ContactProps {
    darkMode?: boolean;
    onBack?: () => void;
}

const Contact: React.FC<ContactProps> = ({ darkMode = false, onBack }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Create mailto link with form data
        const mailtoLink = `mailto:deepthedzinr@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`)}`;
        window.location.href = mailtoLink;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

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

                <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Have questions, feedback, or need support? We'd love to hear from you!
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                        <h2 className="text-2xl font-semibold mb-4">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    className={`w-full px-4 py-2 rounded-lg border ${darkMode
                                            ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                                    placeholder="Tell us more about your inquiry..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                            >
                                <Send size={20} />
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className={`mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} size={20} />
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <a href="mailto:deepthedzinr@gmail.com" className={`${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} transition-colors`}>
                                            deepthedzinr@gmail.com
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
                            <h2 className="text-2xl font-semibold mb-4">Connect with the Creator</h2>
                            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <strong>Manideep Reddy Eevuri</strong>
                            </p>
                            <div className="space-y-3">
                                <a
                                    href="https://github.com/Maniredii"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${darkMode
                                            ? 'hover:bg-gray-700 text-gray-300'
                                            : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <Github size={20} />
                                    <span>GitHub</span>
                                </a>

                                <a
                                    href="https://www.linkedin.com/in/manideep-reddy-eevuri-661659268/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${darkMode
                                            ? 'hover:bg-gray-700 text-gray-300'
                                            : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <Linkedin size={20} />
                                    <span>LinkedIn</span>
                                </a>

                                <a
                                    href="https://manideepreddyeevuri.netlify.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${darkMode
                                            ? 'hover:bg-gray-700 text-gray-300'
                                            : 'hover:bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    <Globe size={20} />
                                    <span>Portfolio Website</span>
                                </a>
                            </div>
                        </div>

                        <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
                            <h3 className="text-lg font-semibold mb-2">💡 Quick Tips</h3>
                            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                <li>• For bug reports, please include browser and OS details</li>
                                <li>• Feature requests are always welcome!</li>
                                <li>• Check our FAQ section for common questions</li>
                                <li>• Response time: Usually within 24-48 hours</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
