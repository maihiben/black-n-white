import { formatNumber } from '@/lib/utils';

interface NomineeCardProps {
  nominee: {
    id: string;
    name: string;
    imageUrl: string;
    votes: number;
    category: string;
  };
  onVoteClick: (e: React.MouseEvent) => void;
}

export const NomineeCard = ({ nominee, onVoteClick }: NomineeCardProps) => {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={nominee.imageUrl}
          alt={nominee.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Vote Count Badge */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="text-white font-medium text-sm">
            {formatNumber(nominee.votes)} votes
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
            {nominee.name}
          </h3>
          <p className="text-sm text-muted-foreground capitalize">
            {nominee.category.replace('-', ' ')}
          </p>
        </div>

        <button
          onClick={onVoteClick}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 
          transition-colors font-medium text-sm flex items-center justify-center gap-2"
        >
          Vote Now
        </button>
      </div>
    </div>
  );
}; 