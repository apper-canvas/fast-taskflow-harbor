import { format, isToday, isTomorrow, isPast, isThisWeek, startOfDay, endOfDay } from 'date-fns';

export const formatDueDate = (dueDate) => {
  if (!dueDate) return null;
  
  const date = new Date(dueDate);
  
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isPast(date)) return `Overdue (${format(date, 'MMM d')})`;
  return format(date, 'MMM d');
};

export const getDueDateStatus = (dueDate) => {
  if (!dueDate) return 'none';
  
  const date = new Date(dueDate);
  
  if (isPast(date) && !isToday(date)) return 'overdue';
  if (isToday(date)) return 'today';
  if (isTomorrow(date)) return 'tomorrow';
  if (isThisWeek(date)) return 'this-week';
  return 'future';
};

export const sortTasksByPriority = (tasks) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  
  return tasks.sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Sort by priority
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Sort by due date
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    
    return 0;
  });
};

export const getTasksForDateFilter = (tasks, filter) => {
  const today = startOfDay(new Date());
  
  return tasks.filter(task => {
    if (!task.dueDate) return filter === 'no-date';
    const taskDate = new Date(task.dueDate);
    
    switch (filter) {
      case 'today':
        return isToday(taskDate);
      case 'tomorrow':
        return isTomorrow(taskDate);
      case 'this-week':
        return isThisWeek(taskDate);
      case 'overdue':
        return isPast(taskDate) && !isToday(taskDate);
      default:
        return true;
    }
  });
};

export const parseNaturalLanguage = (input) => {
  const result = {
    title: input,
    priority: 'medium',
    dueDate: null
  };
  
  // Extract priority
  const highPriorityWords = ['urgent', 'important', 'high', 'asap', 'critical'];
  const lowPriorityWords = ['low', 'later', 'sometime', 'maybe'];
  
  const lowerInput = input.toLowerCase();
  
  if (highPriorityWords.some(word => lowerInput.includes(word))) {
    result.priority = 'high';
  } else if (lowPriorityWords.some(word => lowerInput.includes(word))) {
    result.priority = 'low';
  }
  
  // Extract dates
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (lowerInput.includes('today')) {
    result.dueDate = format(today, 'yyyy-MM-dd');
  } else if (lowerInput.includes('tomorrow')) {
    result.dueDate = format(tomorrow, 'yyyy-MM-dd');
  }
  
  // Clean up title
  result.title = input
    .replace(/\b(urgent|important|high|asap|critical|low|later|sometime|maybe|today|tomorrow)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  return result;
};