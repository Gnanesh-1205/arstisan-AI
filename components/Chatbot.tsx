
import React, { useState, useRef, useEffect } from 'react';
import { RobotIcon } from './icons/RobotIcon';
import { SendIcon } from './icons/SendIcon';
import { ChatMessage } from '../types';
import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // We don't throw an error here to prevent the whole app from crashing
  // if the API key is missing. The chatbot will just show an error message.
  console.error("API_KEY environment variable is not set for the chatbot.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are "Artisan AI Assistant," a friendly and helpful guide for an e-commerce website that sells products from local artisans. Your goal is to help users navigate the site and understand its features.

You can answer questions about:
- How to browse products.
- How to use the search and filter features.
- What the "Artisan AI" platform is.
- How artisans can sign up and sell their products.
- How customers can buy products.

Keep your answers concise, friendly, and to the point. If a question is outside your scope, politely say that you can only help with questions about the Artisan AI website.`;


export const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', text: 'Hello! I am the Artisan AI Assistant. How can I help you today?' }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!API_KEY) {
            setError("Chatbot is currently unavailable. Please check the API key configuration.");
        }
    }, []);

    useEffect(() => {
        // Scroll to the bottom of the chat on new message
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !API_KEY) return;

        const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userInput }];
        setMessages(newMessages);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const chatHistory = newMessages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }],
            }));
            
            // Remove the last user message from history for the API call
            const historyForApi = chatHistory.slice(0, -1);
            const currentMessage = chatHistory[chatHistory.length - 1].parts[0].text;

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: currentMessage,
                config: {
                    systemInstruction: systemInstruction,
                },
            });
            
            const modelResponse = response.text;

            setMessages(prev => [...prev, { role: 'model', text: modelResponse }]);

        } catch (err) {
            console.error("Chatbot API error:", err);
            const errorMessage = "Sorry, I'm having a little trouble connecting. Please try again in a moment.";
            setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
            setError("Failed to get a response from the AI assistant.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-amber-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-transform transform hover:scale-110 z-30"
                aria-label="Toggle Chatbot"
            >
                <RobotIcon className="w-8 h-8" />
            </button>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-full max-w-sm h-[60vh] bg-white rounded-lg shadow-2xl flex flex-col animate-fade-in z-30 border border-stone-200">
                    {/* Header */}
                    <div className="p-4 bg-stone-100 rounded-t-lg border-b border-stone-200 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-stone-800">Artisan AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-stone-500 hover:text-stone-800">&times;</button>
                    </div>

                    {/* Messages */}
                    <div ref={chatContainerRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-800'}`}>
                                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-4 py-2 rounded-2xl bg-stone-100 text-stone-800">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                                        <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {error && <p className="text-xs text-center text-red-500">{error}</p>}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white rounded-b-lg border-t border-stone-200">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-1 px-4 py-2 border border-stone-300 rounded-full bg-white text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                disabled={isLoading || !API_KEY}
                            />
                            <button
                                type="submit"
                                className="w-10 h-10 flex-shrink-0 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 disabled:bg-stone-400"
                                disabled={isLoading || !userInput.trim() || !API_KEY}
                                aria-label="Send message"
                            >
                                <SendIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};
