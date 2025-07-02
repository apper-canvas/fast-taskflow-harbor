import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const BulkActionToolbar = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBulkComplete,
  onBulkDelete,
  onBulkMove,
  categories = []
}) => {
  const [showMoveDropdown, setShowMoveDropdown] = useState(false);

  const isAllSelected = selectedCount === totalCount;

  const handleMoveToCategory = (categoryId) => {
    onBulkMove(categoryId);
    setShowMoveDropdown(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-gray-200 rounded-xl p-4 shadow-lg mb-4"
    >
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="CheckSquare" size={20} className="text-primary-500" />
            <span className="font-medium text-gray-900">
              {selectedCount} task{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSelectAll}
            className="text-primary-600 hover:text-primary-700"
          >
            <ApperIcon name={isAllSelected ? "Square" : "CheckSquare"} size={16} />
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="success"
            size="sm"
            onClick={onBulkComplete}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Check" size={16} />
            Complete
          </Button>

          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowMoveDropdown(!showMoveDropdown)}
              className="flex items-center gap-2"
            >
              <ApperIcon name="FolderOpen" size={16} />
              Move to
              <ApperIcon name="ChevronDown" size={14} />
            </Button>

            {showMoveDropdown && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48"
              >
                <div className="py-2">
                  {categories.map(category => (
                    <button
                      key={category.Id}
                      onClick={() => handleMoveToCategory(category.Id)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          <Button
            variant="danger"
            size="sm"
            onClick={onBulkDelete}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Trash2" size={16} />
            Delete
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-gray-500 hover:text-gray-700"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showMoveDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMoveDropdown(false)}
        />
      )}
    </motion.div>
  );
};

export default BulkActionToolbar;