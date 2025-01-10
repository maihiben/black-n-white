import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChatMessage, ChatUser } from '@/types/chat';
import { Nominee } from '@/types/nominee';
import { allUsers, messageTemplates, getRandomActiveUsers } from '@/data/chatData';
import { Send, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const LiveChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [activeUsers, setActiveUsers] = useState<ChatUser[]>([]);

  // Set active users first
  useEffect(() => {
    setActiveUsers(getRandomActiveUsers());
  }, []);

  // Generate initial messages only after we have active users
  useEffect(() => {
    if (!isLoading && activeUsers.length > 0) {
      const initialMessages = generateInitialMessages();
      setMessages(initialMessages);
      // Initial load should scroll to bottom
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 100);
    }
  }, [isLoading, activeUsers]);

  // Function to check if scrolled to bottom
  const isAtBottom = () => {
    if (!messagesContainerRef.current) return true;
    const { scrollHeight, scrollTop, clientHeight } = messagesContainerRef.current;
    return Math.abs(scrollHeight - scrollTop - clientHeight) < 100;
  };

  // Handle scroll event
  const handleScroll = () => {
    const atBottom = isAtBottom();
    setShowScrollButton(!atBottom);
    if (atBottom) {
      setNewMessageCount(0);
    }
  };

  // Manual scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setNewMessageCount(0);
    setShowScrollButton(false);
  };

  // Add scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Add new messages effect
  useEffect(() => {
    if (!isLoading && activeUsers.length > 0) {
      const interval = setInterval(() => {
        setMessages(prev => {
          const newMessage = generateNewMessage();
          setNewMessageCount(prev => prev + 1);
          return [...prev, newMessage];
        });
      }, Math.random() * 7000 + 3000);

      return () => clearInterval(interval);
    }
  }, [isLoading, activeUsers]);

  const generateMessage = (template: MessageTemplate): string => {
    let text = template.text;
    
    if (template.requiresNominee) {
      // Get a random nominee
      const nominee = nominees[Math.floor(Math.random() * nominees.length)];
      
      if (template.requiresCategory) {
        // Use the nominee's actual category
        const category = nominee.category.charAt(0).toUpperCase() + nominee.category.slice(1);
        text = text.replace('{nominee}', nominee.name).replace('{category}', category);
      } else {
        text = text.replace('{nominee}', nominee.name);
      }
    } else if (template.requiresCategory) {
      // If only category is needed (without nominee), use any valid category
      const categories = ['Music', 'Movie', 'Comedy', 'Content Creation', 'Sports'];
      const category = categories[Math.floor(Math.random() * categories.length)];
      text = text.replace('{category}', category);
    }

    return text;
  };

  const generateNewMessage = (): ChatMessage => {
    const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
    const user = activeUsers[Math.floor(Math.random() * activeUsers.length)];
    
    return {
      id: Date.now().toString(),
      userId: user.id,
      text: generateMessage(template),
      timestamp: new Date(),
      likes: Math.floor(Math.random() * 50),
    };
  };

  const generateInitialMessages = (): ChatMessage[] => {
    const messages: ChatMessage[] = [];
    const count = Math.floor(Math.random() * 51) + 50; // 50-100 messages

    for (let i = 0; i < count; i++) {
      const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
      const user = activeUsers[Math.floor(Math.random() * activeUsers.length)];
      const timestamp = new Date(Date.now() - (count - i) * 60000);

      messages.push({
        id: i.toString(),
        userId: user.id,
        text: generateMessage(template),
        timestamp,
        likes: Math.floor(Math.random() * 50),
      });
    }

    return messages;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    toast({
      title: "Premium Feature",
      description: "Only premium users can send messages in the chat room",
      variant: "destructive",
      className: "bg-white text-black",
    });
    setNewMessage('');
  };

  // Fetch nominees from Firebase
  useEffect(() => {
    const fetchNominees = async () => {
      const querySnapshot = await getDocs(collection(db, 'nominees'));
      const nominees = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Nominee[];
      setNominees(nominees);
      setIsLoading(false);
    };

    fetchNominees();
  }, []);

  if (isLoading || activeUsers.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="hidden lg:block border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold dark:text-white">Live Discussion</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeUsers.length} participants • Black and White Entertainment
            </p>
          </div>
        </div>
      </div>

      {/* Messages - Scrollable */}
      <div className="flex-1 min-h-0 relative">
        <div 
          ref={messagesContainerRef}
          className="h-full overflow-y-auto scroll-smooth"
        >
          <div className="p-4 space-y-4">
            {messages.map((message) => {
              const user = activeUsers.find(u => u.id === message.userId);
              if (!user) return null; // Skip messages with no user
              
              return (
                <div 
                  key={message.id} 
                  className="group flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded-xl transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    {user.isVerified && (
                      <div className="absolute -right-1 -bottom-1 bg-blue-500 rounded-full p-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200 break-words">{message.text}</p>
                    {message.likes > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                          ❤️ {message.likes}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* New Messages Indicator */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={scrollToBottom}
              className="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
              <ArrowDown size={16} />
              {newMessageCount > 0 && (
                <span className="text-sm">
                  {newMessageCount} new message{newMessageCount !== 1 ? 's' : ''}
                </span>
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button
            type="submit"
            className="p-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          💬 Join the conversation - Upgrade to Premium to send messages
        </p>
      </div>
    </div>
  );
};

export default LiveChat; 