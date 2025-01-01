import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiX, FiSend } from 'react-icons/fi';
import axios from 'axios';
import TypingIndicator from '../typingIndicator/TypingIndicator';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setLoading(true);

    try {
      const response = await axios.post('https://kind-sea-0ddf06010.4.azurestaticapps.net/api/chat', {
        userInput,
      });
      const botReply = response.data.reply || "Sorry, I didn't understand that.";
      setMessages([...newMessages, { sender: 'bot', text: botReply }]);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: 'Sorry, there was an error processing your request.',
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            onClick={toggleChat}
            className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg text-white z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <FiMessageSquare className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-y-1 right-0 w-1/4 sm:w-96 bg-white shadow-2xl z-50 flex flex-col rounded-3xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-3xl">
              <h2 className="text-xl font-bold">Chatbot</h2>
              <button
                onClick={toggleChat}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  } mb-4`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-800 shadow'
                    }`}
                  >
                  <p className={msg.sender === 'user' ? 'text-white' : 'text-gray-800'}>
                    {msg.text}
                  </p>
                </div>

                </motion.div>
              ))}
              {loading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200 rounded-b-3xl">
              <div className="flex items-center">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-grow p-2 mr-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={loading}
                  className="p-2 bg-indigo-600 text-white rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiSend className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

