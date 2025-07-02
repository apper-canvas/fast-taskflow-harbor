import React from 'react';
import { useDroppable } from '@dnd-kit/core';

const CategoryDropZone = ({ category, children }) => {
  const {
    isOver,
    setNodeRef,
  } = useDroppable({
    id: `category-${category.Id}`,
    data: {
      type: 'category',
      category: category,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        relative transition-all duration-200 ease-in-out
        ${isOver 
          ? 'bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg p-1' 
          : 'border-2 border-transparent'
        }
      `}
    >
      {children}
      {isOver && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-50 rounded-lg pointer-events-none flex items-center justify-center">
          <span className="text-blue-600 text-sm font-medium">
            Drop task here
          </span>
        </div>
      )}
    </div>
  );
};

export default CategoryDropZone;