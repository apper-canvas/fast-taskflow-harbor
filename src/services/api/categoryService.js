import mockCategories from '@/services/mockData/categories.json';

class CategoryService {
  constructor() {
    this.categories = [...mockCategories];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.categories].sort((a, b) => a.position - b.position);
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const category = this.categories.find(cat => cat.Id === parseInt(id));
    if (!category) {
      throw new Error('Category not found');
    }
    return { ...category };
  }

  async create(categoryData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const newCategory = {
      Id: Math.max(...this.categories.map(c => c.Id), 0) + 1,
      ...categoryData,
      position: categoryData.position ?? this.categories.length
    };
    
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    this.categories[index] = { ...this.categories[index], ...updates };
    return { ...this.categories[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    const index = this.categories.findIndex(cat => cat.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Category not found');
    }
    
    this.categories.splice(index, 1);
    return true;
  }
}

export default new CategoryService();