import React from 'react';

interface Stat {
  id?: number;
  number: string;
  label: string;
  isActive?: boolean;
  order?: number;
}

interface StatsPreviewProps {
  stats: Stat[];
  title?: string;
}

const StatsPreview: React.FC<StatsPreviewProps> = ({ stats, title = "Live Preview" }) => {
  // Filter active stats, sort by order, and take first 4
  const displayStats = stats
    .filter(stat => stat.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .slice(0, 4);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">
          {displayStats.length}/4 stats displayed
        </span>
      </div>
      
      <div className="bg-gray-50 p-8 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayStats.map((stat, index) => (
              <div key={stat.id || index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm md:text-base font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
            
            {/* Show placeholders for missing stats */}
            {Array.from({ length: 4 - displayStats.length }).map((_, index) => (
              <div key={`placeholder-${index}`} className="text-center opacity-50">
                <div className="text-3xl md:text-4xl font-bold text-gray-300 mb-2">
                  ---
                </div>
                <div className="text-gray-400 text-sm md:text-base font-medium">
                  Add statistic {displayStats.length + index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {displayStats.length < 4 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-amber-600">
            ⚠️ Add {4 - displayStats.length} more active statistic{4 - displayStats.length > 1 ? 's' : ''} to fill all positions
          </p>
        </div>
      )}
    </div>
  );
};

export default StatsPreview;
