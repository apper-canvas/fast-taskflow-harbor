import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = 'No tasks yet', 
  message = 'Get started by adding your first task above',
  actionText = 'Add Task',
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-violet-50 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="CheckSquare" className="w-12 h-12 text-primary-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-text-primary mb-2">
        {title}
      </h3>
      
      <p className="text-text-secondary mb-8 max-w-md">
        {message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-violet-500 text-white rounded-lg font-medium cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-200"
          onClick={onAction}
        >
          <div className="flex items-center gap-2">
            <ApperIcon name="Plus" className="w-4 h-4" />
            {actionText}
          </div>
        </motion.div>
        
        <div className="text-sm text-text-secondary space-y-1">
          <p>💡 <strong>Quick tip:</strong> Use natural language like "Call client tomorrow high priority"</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Empty;