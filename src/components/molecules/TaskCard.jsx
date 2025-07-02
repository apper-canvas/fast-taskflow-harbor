import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, isPast, isToday, isTomorrow } from "date-fns";
import { formatDueDate } from "@/utils/dateUtils";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  
  const handleEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onEdit(task.Id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };
  
  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isPast(date)) return `Overdue (${format(date, 'MMM d')})`;
    return format(date, 'MMM d');
  };
  
  const getDueDateVariant = (dueDate) => {
    if (!dueDate) return 'default';
    const date = new Date(dueDate);
    
    if (isPast(date) && !isToday(date)) return 'danger';
    if (isToday(date)) return 'warning';
    return 'info';
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.01 }}
      className={`
        bg-white rounded-xl border border-gray-100 p-4 transition-all duration-200
        hover:shadow-lg hover:border-gray-200 group
        ${task.completed ? 'opacity-60' : ''}
      `}
    >
<div className="flex items-start gap-3">
        <div className="flex-shrink-0 pt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={() => onToggleComplete(task.Id)}
            animated
          />
</div>
        
        <div className="flex-shrink-0 pt-0.5">
          <ApperIcon name="GripVertical" className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              {isEditing ? (
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={handleEdit}
                  onKeyDown={handleKeyDown}
                  className="w-full text-base font-medium bg-transparent border-none outline-none focus:ring-0 p-0"
                  autoFocus
                />
              ) : (
                <h3
                  className={`text-base font-medium cursor-pointer transition-colors duration-200 ${
                    task.completed ? 'line-through text-text-secondary' : 'text-text-primary hover:text-primary-600'
                  }`}
                  onClick={() => setIsEditing(true)}
                >
                  {task.title}
                </h3>
              )}
              
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={getPriorityColor(task.priority)} size="sm">
                  <div className={`priority-dot ${task.priority}`}></div>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
                
                {task.dueDate && (
                  <Badge variant={getDueDateVariant(task.dueDate)} size="sm">
                    <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
                    {formatDueDate(task.dueDate)}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                icon="Edit2"
                className="p-1.5"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.Id)}
                icon="Trash2"
                className="p-1.5 text-red-500 hover:text-red-600 hover:bg-red-50"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;