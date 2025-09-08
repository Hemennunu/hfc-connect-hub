import React from 'react';

interface StatItem {
  _id: string;
  number: string;
  label: string;
  isActive: boolean;
  order: number;
}

interface HorizontalStatsProps {
  stats: StatItem[];
  loading?: boolean;
}

const HorizontalStats: React.FC<HorizontalStatsProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-muted/50 via-background to-muted/30 py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure we show exactly 4 stats, sorted by order
  const displayStats = stats
    .filter(stat => stat.isActive)
    .sort((a, b) => a.order - b.order)
    .slice(0, 4);

  return (
    <div className="bg-gradient-to-br from-muted/50 via-background to-muted/30 py-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {displayStats.map((stat, index) => (
              <div key={stat._id} className="group text-center p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-medium hover:shadow-strong transition-all duration-500 transform hover:-translate-y-2 border border-white/50">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4 group-hover:scale-110 transition-transform duration-300" style={{ textShadow: '0 2px 10px rgba(59, 130, 246, 0.15)' }}>
                  {stat.number}
                </div>
                <div className="text-foreground text-base md:text-lg lg:text-xl font-semibold leading-tight group-hover:text-primary transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalStats;
