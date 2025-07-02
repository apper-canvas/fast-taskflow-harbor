import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { isPast, isThisWeek, isToday, isTomorrow, startOfDay } from "date-fns";
import CategorySidebar from "@/components/organisms/CategorySidebar";
import TaskList from "@/components/organisms/TaskList";
import QuickAddBar from "@/components/molecules/QuickAddBar";
import TaskStats from "@/components/molecules/TaskStats";
import FilterBar from "@/components/molecules/FilterBar";
import taskService from "@/services/api/taskService";
import categoryService from "@/services/api/categoryService";

const TaskManager = () => {
  const { categoryId, filter } = useParams();
  const navigate = useNavigate();
  
// State management
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Selection state
  const [selectedTasks, setSelectedTasks] = useState([]);
  
  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Update selected category from URL
  useEffect(() => {
    if (categoryId) {
      setSelectedCategory(categoryId);
    } else if (filter) {
      setSelectedCategory(filter);
    }
  }, [categoryId, filter]);
  
  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      
      setTasks(tasksData);
      setCategories(categoriesData);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Filtered tasks based on current filters
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];
    
    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      if (selectedCategory === 'today') {
        filtered = filtered.filter(task => 
          task.dueDate && isToday(new Date(task.dueDate))
        );
      } else if (selectedCategory === 'upcoming') {
        filtered = filtered.filter(task => 
          task.dueDate && !isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
        );
      } else if (selectedCategory === 'completed') {
        filtered = filtered.filter(task => task.completed);
      } else {
        filtered = filtered.filter(task => task.categoryId === selectedCategory);
      }
    }
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }
    
    // Date filter
    if (dateFilter !== 'all') {
      const today = startOfDay(new Date());
      filtered = filtered.filter(task => {
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
    }
    
    // Sort by priority and due date
    return filtered.sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Sort by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 };
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
  }, [tasks, selectedCategory, searchTerm, priorityFilter, dateFilter]);
  
  // Task counts for sidebar
  const taskCounts = useMemo(() => {
    const counts = {
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
  }, [tasks, categories]);
  
  // Stats for dashboard
  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const todayTasks = tasks.filter(task => 
      task.dueDate && isToday(new Date(task.dueDate)) && !task.completed
    ).length;
    const overdueTasks = tasks.filter(task => 
      task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) && !task.completed
    ).length;
    
    return { totalTasks, completedTasks, todayTasks, overdueTasks };
  }, [tasks]);
  
  // Task operations
  const handleAddTask = async (taskData) => {
    try {
      const newTask = await taskService.create({
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
      });
      
      setTasks(prev => [newTask, ...prev]);
      toast.success('Task added successfully!');
    } catch (err) {
      toast.error('Failed to add task. Please try again.');
      console.error('Error adding task:', err);
    }
  };
  
  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const updatedTask = await taskService.update(taskId, {
        completed: !task.completed,
        completedAt: !task.completed ? new Date().toISOString() : null
      });
      
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(updatedTask.completed ? 'Task completed!' : 'Task reopened!');
    } catch (err) {
      toast.error('Failed to update task. Please try again.');
      console.error('Error toggling task:', err);
    }
  };
  
  const handleEditTask = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      toast.success('Task updated successfully!');
    } catch (err) {
      toast.error('Failed to update task. Please try again.');
      console.error('Error editing task:', err);
    }
  };
  
  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      toast.success('Task deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete task. Please try again.');
      console.error('Error deleting task:', err);
    }
  };
  
  const handleSelectCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      navigate('/');
    } else if (['today', 'upcoming', 'completed'].includes(categoryId)) {
      navigate(`/filter/${categoryId}`);
    } else {
      navigate(`/category/${categoryId}`);
    }
  };
  
  const handleAddCategory = async () => {
    const name = prompt('Enter category name:');
    if (!name?.trim()) return;
    
    try {
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
      const newCategory = await categoryService.create({
        name: name.trim(),
        color: colors[Math.floor(Math.random() * colors.length)],
        position: categories.length
      });
      
      setCategories(prev => [...prev, newCategory]);
      toast.success('Category added successfully!');
    } catch (err) {
      toast.error('Failed to add category. Please try again.');
      console.error('Error adding category:', err);
    }
  };
const handleClearFilters = () => {
    setSearchTerm('');
    setPriorityFilter('all');
    setDateFilter('all');
  };

  // Selection handlers
  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(task => task.Id));
    }
  };

  const handleClearSelection = () => {
    setSelectedTasks([]);
  };

  // Bulk operations
  const handleBulkComplete = async () => {
    if (selectedTasks.length === 0) return;
    
    try {
      await taskService.bulkComplete(selectedTasks);
      const updatedTasks = await taskService.getAll();
      setTasks(updatedTasks);
      setSelectedTasks([]);
      toast.success(`${selectedTasks.length} tasks marked as completed!`);
    } catch (err) {
      toast.error('Failed to update tasks. Please try again.');
      console.error('Error in bulk complete:', err);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) return;
    
    try {
      await taskService.bulkDelete(selectedTasks);
      const updatedTasks = await taskService.getAll();
      setTasks(updatedTasks);
      setSelectedTasks([]);
      toast.success(`${selectedTasks.length} tasks deleted successfully!`);
    } catch (err) {
      toast.error('Failed to delete tasks. Please try again.');
      console.error('Error in bulk delete:', err);
    }
  };

  const handleBulkMove = async (categoryId) => {
    if (selectedTasks.length === 0) return;
    
    try {
      await taskService.bulkUpdateCategory(selectedTasks, categoryId);
      const updatedTasks = await taskService.getAll();
      setTasks(updatedTasks);
      setSelectedTasks([]);
      
      const categoryName = categories.find(cat => cat.Id === categoryId)?.name || 'Unknown';
      toast.success(`${selectedTasks.length} tasks moved to ${categoryName}!`);
    } catch (err) {
      toast.error('Failed to move tasks. Please try again.');
      console.error('Error in bulk move:', err);
    }
};

return (
    <div className="h-screen flex bg-gray-50">
      <CategorySidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        taskCounts={taskCounts}
        onAddCategory={handleAddCategory}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
<div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <QuickAddBar
              onAddTask={handleAddTask}
              selectedCategory={
                selectedCategory === 'all' || ['today', 'upcoming', 'completed'].includes(selectedCategory)
                  ? null
                  : selectedCategory
              }
              categories={categories}
            />
            
            <TaskStats
              totalTasks={stats.totalTasks}
              completedTasks={stats.completedTasks}
              todayTasks={stats.todayTasks}
              overdueTasks={stats.overdueTasks}
            />
            
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              priorityFilter={priorityFilter}
              onPriorityChange={setPriorityFilter}
              dateFilter={dateFilter}
              onDateFilterChange={setDateFilter}
              onClearFilters={handleClearFilters}
            />
<TaskList
              tasks={filteredTasks}
              loading={loading}
              error={error}
              onToggleComplete={handleToggleComplete}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onRetry={loadData}
              selectedTasks={selectedTasks}
              onSelectTask={handleSelectTask}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              onBulkComplete={handleBulkComplete}
              onBulkDelete={handleBulkDelete}
              onBulkMove={handleBulkMove}
              categories={categories}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;