import React from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const FilterBar = ({ 
  searchTerm, 
  onSearchChange, 
  priorityFilter, 
  onPriorityChange,
  dateFilter,
  onDateFilterChange,
  onClearFilters 
}) => {
  const hasActiveFilters = searchTerm || priorityFilter !== 'all' || dateFilter !== 'all';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-4 items-center bg-surface rounded-xl p-4 mb-6"
    >
      <div className="flex-1 min-w-[200px]">
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          icon="Search"
          className="bg-white"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Priority:</label>
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-text-secondary whitespace-nowrap">Due:</label>
        <select
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="all">All</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="this-week">This Week</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          icon="X"
        >
          Clear
        </Button>
      )}
    </motion.div>
  );
};

export default FilterBar;