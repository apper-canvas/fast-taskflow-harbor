import React from 'react';
import { motion } from 'framer-motion';
import CategoryPill from '@/components/molecules/CategoryPill';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CategorySidebar = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  taskCounts,
  onAddCategory 
}) => {
  const allTasksCount = Object.values(taskCounts).reduce((sum, count) => sum + count, 0);
  
  const quickFilters = [
    { id: 'all', name: 'All Tasks', icon: 'List', count: allTasksCount },
    { id: 'today', name: 'Due Today', icon: 'Calendar', count: taskCounts.today || 0 },
    { id: 'upcoming', name: 'Upcoming', icon: 'Clock', count: taskCounts.upcoming || 0 },
    { id: 'completed', name: 'Completed', icon: 'CheckCircle', count: taskCounts.completed || 0 }
  ];
  
  return (
    <div className="bg-white h-full">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 border-r border-gray-100 p-6 h-full">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-violet-500 rounded-xl flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          <p className="text-sm text-text-secondary">Organize your tasks effortlessly</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Quick Filters
            </h2>
            <div className="space-y-2">
              {quickFilters.map((filter) => (
                <motion.div
                  key={filter.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
                    ${selectedCategory === filter.id
                      ? 'bg-gradient-to-r from-primary-500 to-violet-500 text-white shadow-lg'
                      : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                    }
                  `}
                  onClick={() => onSelectCategory(filter.id)}
                >
                  <div className="flex items-center gap-3">
                    <ApperIcon name={filter.icon} className="w-4 h-4" />
                    <span className="font-medium">{filter.name}</span>
                  </div>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${selectedCategory === filter.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-text-secondary'
                    }
                  `}>
                    {filter.count}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                Categories
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onAddCategory}
                icon="Plus"
                className="p-1.5"
              />
            </div>
            <div className="space-y-2">
              {categories.map((category) => (
                <CategoryPill
                  key={category.Id}
                  category={category}
                  isActive={selectedCategory === category.Id}
                  taskCount={taskCounts[category.Id] || 0}
                  onClick={() => onSelectCategory(category.Id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      <div className="lg:hidden">
        {/* This would be implemented as an overlay/drawer on mobile */}
      </div>
    </div>
  );
};

export default CategorySidebar;