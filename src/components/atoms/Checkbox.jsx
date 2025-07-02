import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  label,
  className = '',
  disabled = false,
  animated = true,
  ...props 
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };
  
  const CheckboxComponent = animated ? motion.div : 'div';
  const motionProps = animated ? {
    whileHover: { scale: disabled ? 1 : 1.1 },
    whileTap: { scale: disabled ? 1 : 0.95 }
  } : {};
  
  return (
    <div className={`flex items-center ${className}`}>
      <CheckboxComponent
        {...motionProps}
        className={`
          relative inline-flex items-center justify-center w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200
          ${checked 
            ? 'bg-emerald-500 border-emerald-500 shadow-emerald-500/25 shadow-lg' 
            : 'bg-white border-gray-300 hover:border-primary-500'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={handleClick}
        {...props}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ApperIcon name="Check" className="w-3 h-3 text-white stroke-[3]" />
          </motion.div>
        )}
      </CheckboxComponent>
      
      {label && (
        <label 
          className={`ml-3 text-sm font-medium cursor-pointer ${disabled ? 'opacity-50' : 'text-text-primary'}`}
          onClick={handleClick}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;