import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const FloatingChatButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate('/chat')}
      className="fixed bottom-6 right-6 p-4 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50 flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MessageSquare size={20} />
      <span className="text-sm">Chat Room</span>
    </motion.button>
  );
};

export default FloatingChatButton; 