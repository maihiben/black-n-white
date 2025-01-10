import { Mic, Film, Laugh, Video, Trophy } from "lucide-react";
import { Link } from 'react-router-dom';

const categories = [
  {
    title: "Music",
    icon: <Mic className="w-6 h-6" />,
    items: [
      "Artist of the Year",
      "Song of the Year",
      "Best New Artist",
      "Best Music Video"
    ],
    gradient: "from-red-500 to-pink-500"
  },
  {
    title: "Movie",
    icon: <Film className="w-6 h-6" />,
    items: [
      "Best Actor",
      "Best Actress",
      "Best Director",
      "Movie of the Year"
    ],
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "Comedy",
    icon: <Laugh className="w-6 h-6" />,
    items: [
      "Comedian of the Year",
      "Best Comedy Show",
      "Best Comedy Series",
      "Breakout Comedian"
    ],
    gradient: "from-amber-500 to-yellow-500"
  },
  {
    title: "Content Creation",
    icon: <Video className="w-6 h-6" />,
    items: [
      "Content Creator of the Year",
      "Best YouTube Channel",
      "Best TikTok Creator",
      "Best Social Media Influencer"
    ],
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Sports",
    icon: <Trophy className="w-6 h-6" />,
    items: [
      "Athlete of the Year",
      "Team of the Year",
      "Best Sports Moment",
      "Breakthrough Athlete"
    ],
    gradient: "from-green-500 to-emerald-500"
  }
];

export const Categories = () => {
  return (
    <div id="categories" className="py-20 px-6 bg-accent">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Award Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div 
              key={category.title} 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />

              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${category.gradient} text-white`}>
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>

                {/* Items */}
                <ul className="space-y-3">
                  {category.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-600 group-hover:text-gray-900 transition-colors">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${category.gradient}`} />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* View Nominees Button */}
                <div className="mt-8">
                  <Link 
                    to={`/category/${category.title.toLowerCase().replace(' ', '-')}`}
                    className={`block w-full text-center py-2.5 px-4 rounded-lg bg-gradient-to-br ${category.gradient} text-white font-medium 
                    opacity-90 hover:opacity-100 transition-opacity text-sm`}
                  >
                    View Nominees
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};