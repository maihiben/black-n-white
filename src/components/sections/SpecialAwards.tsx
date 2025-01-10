import { Trophy, Star, Award, Medal } from 'lucide-react';

const specialAwards = [
  {
    title: "Lifetime Achievement",
    description: "Honoring outstanding contributions and lasting impact in the entertainment industry",
    icon: <Trophy className="w-8 h-8" />,
    gradient: "from-amber-500 to-yellow-500",
    nominees: ["Morgan Freeman", "Robert De Niro", "Meryl Streep"]
  },
  {
    title: "Icon Award",
    description: "Celebrating cultural icons who have shaped and influenced their generation",
    icon: <Star className="w-8 h-8" />,
    gradient: "from-purple-500 to-pink-500",
    nominees: ["Beyoncé", "Madonna", "Paul McCartney"]
  },
  {
    title: "Humanitarian Award",
    description: "Recognizing artists who have made significant charitable and social impact",
    icon: <Award className="w-8 h-8" />,
    gradient: "from-blue-500 to-cyan-500",
    nominees: ["Angelina Jolie", "Oprah Winfrey", "Leonardo DiCaprio"]
  },
  {
    title: "Legacy Award",
    description: "Honoring legendary figures who have left an indelible mark on entertainment",
    icon: <Medal className="w-8 h-8" />,
    gradient: "from-green-500 to-emerald-500",
    nominees: ["Stevie Wonder", "Elton John", "Diana Ross"]
  }
];

export const SpecialAwards = () => {
  return (
    <div className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Special Recognition Awards
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrating extraordinary achievements and enduring legacies in entertainment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {specialAwards.map((award) => (
            <div 
              key={award.title}
              className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${award.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${award.gradient} text-white`}>
                    {award.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{award.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {award.description}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground mb-3">
                    Previous Recipients
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {award.nominees.map((nominee) => (
                      <span 
                        key={nominee}
                        className="px-3 py-1 bg-accent rounded-full text-sm font-medium"
                      >
                        {nominee}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};