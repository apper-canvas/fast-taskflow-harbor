import React from 'react';
import { motion } from 'framer-motion';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const CategoryPill = ({ 
  category, 
  isActive, 
  taskCount = 0,
  onClick 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        category-pill flex items-center justify-between w-full
        ${isActive ? 'active' : 'inactive'}
      `}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <span className="font-medium">{category.name}</span>
      </div>
      
      <Badge 
        variant={isActive ? 'default' : 'default'} 
        size="sm"
        className={isActive ? 'bg-white/20 text-white' : ''}
      >
        {taskCount}
      </Badge>
    </motion.div>
  );
};

export default CategoryPill;