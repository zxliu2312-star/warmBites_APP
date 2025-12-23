// components/CollapsibleFilterGroup.tsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleFilterGroupProps {
  title: string;
  items: string[];
  selectedItems: string[];
  onToggleItem: (item: string) => void;
  maxVisible?: number;
}

const CollapsibleFilterGroup: React.FC<CollapsibleFilterGroupProps> = ({
  title,
  items,
  selectedItems,
  onToggleItem,
  maxVisible = 9
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const visibleItems = isExpanded ? items : items.slice(0, maxVisible);
  const hasMoreItems = items.length > maxVisible;
  const remainingCount = items.length - maxVisible;

  return (
    <div className="flex-1 min-w-[200px]">
      <h3 className="font-bold text-warm-textDark mb-3 text-lg">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {visibleItems.map(item => (
          <button
            key={item}
            onClick={() => onToggleItem(item)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${selectedItems.includes(item)
              ? 'bg-warm-primary text-white shadow-md'
              : 'bg-gray-100 text-warm-textLight hover:bg-gray-200'}`}
          >
            {item}
          </button>
        ))}
        
        {hasMoreItems && !isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-warm-textLight hover:bg-gray-200 transition-all duration-200 flex items-center gap-1"
          >
            <span>...</span>
            <span className="text-xs"></span>
            <ChevronDown size={12} />
          </button>
        )}
        
        {isExpanded && hasMoreItems && (
          <button
            onClick={() => setIsExpanded(false)}
            className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-warm-textLight hover:bg-gray-200 transition-all duration-200 flex items-center gap-1"
          >
            <span>收起</span>
            <ChevronUp size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default CollapsibleFilterGroup;