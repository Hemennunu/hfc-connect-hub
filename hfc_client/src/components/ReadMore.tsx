import React, { useState } from 'react';

interface ReadMoreProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const ReadMore: React.FC<ReadMoreProps> = ({ text, maxLength = 150, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text.length <= maxLength) {
    return <span className={className}>{text}</span>;
  }

  const displayText = isExpanded ? text : `${text.substring(0, maxLength)}...`;

  return (
    <div className={className}>
      <span>{displayText}</span>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-sm underline focus:outline-none transition-colors"
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
};

export default ReadMore;
