import { isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';

export const filterTasksByCategory = (tasks, categoryId) => {
  if (categoryId === 'all') return tasks;
  
  if (categoryId === 'today') {
    return tasks.filter(task => 
      task.dueDate && isToday(new Date(task.dueDate))
    );
  }
  
  if (categoryId === 'upcoming') {
    return tasks.filter(task => 
      task.dueDate && !isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
    );
  }
  
  if (categoryId === 'completed') {
    return tasks.filter(task => task.completed);
  }
  
  return tasks.filter(task => task.categoryId === categoryId);
};

export const filterTasksBySearch = (tasks, searchTerm) => {
  if (!searchTerm) return tasks;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return tasks.filter(task =>
    task.title.toLowerCase().includes(lowerSearchTerm)
  );
};

export const filterTasksByPriority = (tasks, priority) => {
  if (priority === 'all') return tasks;
  return tasks.filter(task => task.priority === priority);
};

export const filterTasksByDate = (tasks, dateFilter) => {
  if (dateFilter === 'all') return tasks;
  
  return tasks.filter(task => {
    if (!task.dueDate) return dateFilter === 'no-date';
    const taskDate = new Date(task.dueDate);
    
    switch (dateFilter) {
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

export const getTaskCounts = (tasks, categories) => {
  const counts = {
    all: tasks.length,
    today: tasks.filter(task => 
      task.dueDate && isToday(new Date(task.dueDate)) && !task.completed
    ).length,
    upcoming: tasks.filter(task => 
      task.dueDate && !isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed
    ).length,
    completed: tasks.filter(task => task.completed).length
  };
  
  // Add category counts
  categories.forEach(category => {
    counts[category.Id] = tasks.filter(task => 
      task.categoryId === category.Id && !task.completed
    ).length;
  });
  
  return counts;
};