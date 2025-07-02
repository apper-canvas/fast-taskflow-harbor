import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const QuickAddBar = ({ onAddTask, selectedCategory, categories }) => {
  const [taskTitle, setTaskTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  
const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    
    // Ensure we have a valid category ID (integer) or null
    const validCategoryId = selectedCategory && Number.isInteger(selectedCategory) ? selectedCategory : null;
    
    onAddTask({
      title: taskTitle.trim(),
      priority,
      dueDate: dueDate || null,
      categoryId: validCategoryId
    });
    
    setTaskTitle('');
    setDueDate('');
    setPriority('medium');
    setIsExpanded(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setTaskTitle('');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
            icon="Plus"
            className="text-lg py-4 pl-12 pr-16"
          />
          
          <Button
            type="submit"
            variant="primary"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            disabled={!taskTitle.trim()}
          >
            <ApperIcon name="ArrowRight" className="w-4 h-4" />
          </Button>
        </div>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-4 pt-4 border-t border-gray-100"
          >
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-secondary">Priority:</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-secondary">Due:</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              icon="X"
            >
              Cancel
            </Button>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default QuickAddBar;