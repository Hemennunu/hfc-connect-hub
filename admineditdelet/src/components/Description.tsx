import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface DescriptionProps {
  text: string | undefined | null;
  maxLength?: number;
}

const Description: React.FC<DescriptionProps> = ({ text, maxLength = 150 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.length <= maxLength) {
    return <p className="text-muted-foreground mb-2 break-words">{text || 'No description available.'}</p>;
  }

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="text-left">
      <p className="text-muted-foreground mb-2 break-words">
        {isExpanded ? text : `${text.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={toggleExpansion}
        className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center"
      >
        {isExpanded ? 'Read Less' : 'Read More'}
        {isExpanded ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
      </button>
    </div>
  );
};

export default Description;
