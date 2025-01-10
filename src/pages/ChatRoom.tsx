import { useEffect, useState } from 'react';
import { ChevronLeft, Users, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import LiveChat from '@/components/LiveChat';
import { allUsers, getRandomActiveUsers } from '@/data/chatData';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatUser } from '@/types/chat';

const ChatRoom = () => {
  const [showParticipants, setShowParticipants] = useState(false);
  const [activeUsers, setActiveUsers] = useState<ChatUser[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Initial active users
    setActiveUsers(getRandomActiveUsers());

    // Update active users every 10-20 seconds
    const interval = setInterval(() => {
      setActiveUsers(getRandomActiveUsers());
    }, Math.random() * 10000 + 10000); // Random interval between 10-20 seconds

    return () => clearInterval(interval);
  }, []);

  const categories = {
    all: 'All Participants',
    fan: 'Fans',
    critic: 'Critics',
    celebrity: 'Celebrities',
    media: 'Media',
    expert: 'Industry Experts'
  };

  const filteredUsers = selectedCategory === 'all' 
    ? activeUsers 
    : activeUsers.filter(user => user.category === selectedCategory);

  const ActiveParticipantsList = () => (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === key
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label} {key === selectedCategory && `(${filteredUsers.length})`}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filteredUsers.map((user) => (
          <div 
            key={user.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900 dark:text-white">
                  {user.name}
                </p>
                {user.isVerified && (
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {categories[user.category as keyof typeof categories].slice(0, -1)}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-green-500">Online</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#F5F5F5] dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link 
              to="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-semibold">Chat Room</h1>
            <button
              onClick={() => setShowParticipants(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <Users size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Participants Sidebar */}
      <AnimatePresence>
        {showParticipants && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 bg-white dark:bg-gray-800 z-50 lg:hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold dark:text-white">Active Participants</h2>
                <button
                  onClick={() => setShowParticipants(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-100px)]">
                <ActiveParticipantsList />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-full">
        <div className="h-full lg:grid lg:grid-cols-[320px,1fr]">
          {/* Desktop Sidebar */}
          <div className="hidden lg:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center justify-between mb-4">
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-bold">Black & White</h1>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-4 py-2">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Live Discussion</span>
                </div>
              </div>
            </div>

            {/* Desktop Active Users List - Make it scrollable */}
            <div className="flex-1 min-h-0">
              <div className="h-full overflow-y-auto">
                <div className="p-4">
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">
                    Active Participants ({activeUsers.length})
                  </h2>
                  <ActiveParticipantsList />
                </div>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="h-[calc(100vh-48px)] lg:h-screen flex flex-col bg-white dark:bg-gray-800 lg:border-l border-gray-200 dark:border-gray-700">
            <LiveChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom; 