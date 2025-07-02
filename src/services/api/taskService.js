import mockTasks from '@/services/mockData/tasks.json';

class TaskService {
  constructor() {
    this.tasks = [...mockTasks];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.tasks];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const task = this.tasks.find(task => task.Id === parseInt(id));
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  }

  async create(taskData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const newTask = {
      Id: Math.max(...this.tasks.map(t => t.Id), 0) + 1,
      ...taskData,
      createdAt: new Date().toISOString(),
      completedAt: null
    };
    
    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks[index] = { ...this.tasks[index], ...updates };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks.splice(index, 1);
    return true;
  }

  async getByCategory(categoryId) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.tasks.filter(task => task.categoryId === categoryId);
  }

  async getByPriority(priority) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.tasks.filter(task => task.priority === priority);
  }

async search(query) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const lowercaseQuery = query.toLowerCase();
    return this.tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) ||
      (task.description && task.description.toLowerCase().includes(lowercaseQuery))
    );
  }

  async bulkComplete(taskIds) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const completedCount = taskIds.length;
    const now = new Date().toISOString();
    
    taskIds.forEach(id => {
      const index = this.tasks.findIndex(task => task.Id === parseInt(id));
      if (index !== -1) {
        this.tasks[index] = {
          ...this.tasks[index],
          completed: true,
          completedAt: now
        };
      }
    });
    
    return completedCount;
  }

  async bulkDelete(taskIds) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const deletedCount = taskIds.length;
    
    taskIds.forEach(id => {
      const index = this.tasks.findIndex(task => task.Id === parseInt(id));
      if (index !== -1) {
        this.tasks.splice(index, 1);
      }
    });
    
    return deletedCount;
  }

  async bulkUpdateCategory(taskIds, categoryId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updatedCount = taskIds.length;
    
    taskIds.forEach(id => {
      const index = this.tasks.findIndex(task => task.Id === parseInt(id));
      if (index !== -1) {
        this.tasks[index] = {
          ...this.tasks[index],
          categoryId: categoryId
        };
      }
    });
    
    return updatedCount;
  }

  async updatePosition(id, newPosition) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const taskIndex = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }

    // Remove the task from its current position
    const [movedTask] = this.tasks.splice(taskIndex, 1);
    
    // Insert it at the new position
    this.tasks.splice(newPosition, 0, movedTask);
    
    return { ...movedTask };
  }

  async updateCategory(id, categoryId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const index = this.tasks.findIndex(task => task.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Task not found');
    }

    this.tasks[index] = { ...this.tasks[index], categoryId };
    return { ...this.tasks[index] };
  }
}

export default new TaskService();