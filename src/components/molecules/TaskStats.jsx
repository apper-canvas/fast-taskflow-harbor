import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const TaskStats = ({ totalTasks, completedTasks, todayTasks, overdueTasks }) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: 'CheckSquare',
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: 'CheckCircle',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      label: 'Due Today',
      value: todayTasks,
      icon: 'Calendar',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: 'AlertCircle',
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
              <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
          
          {stat.label === 'Completed' && totalTasks > 0 && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                <span>Progress</span>
                <span>{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                />
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TaskStats;