// In-memory storage for demo purposes
let tasks = [
  {
    _id: 'demo-task-1',
    title: 'Complete project setup',
    description: 'Set up the initial project structure and configuration',
    project: 'demo-project-1',
    assignedTo: 'demo-admin',
    createdBy: 'demo-admin',
    status: 'completed',
    priority: 'high',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    completedAt: new Date(),
    comments: [
      {
        _id: 'comment-1',
        user: 'demo-admin',
        text: 'Project setup completed successfully',
        createdAt: new Date()
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo-task-2',
    title: 'Review code changes',
    description: 'Review the latest code changes and provide feedback',
    project: 'demo-project-1',
    assignedTo: 'demo-member',
    createdBy: 'demo-admin',
    status: 'in-progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    completedAt: null,
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo-task-3',
    title: 'Update documentation',
    description: 'Update project documentation with new features',
    project: 'demo-project-2',
    assignedTo: 'demo-admin',
    createdBy: 'demo-admin',
    status: 'pending',
    priority: 'low',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    completedAt: null,
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class Task {
  constructor(data) {
    this._id = data._id || Date.now().toString();
    this.title = data.title;
    this.description = data.description;
    this.project = data.project;
    this.assignedTo = data.assignedTo;
    this.createdBy = data.createdBy;
    this.status = data.status || 'pending';
    this.priority = data.priority || 'medium';
    this.dueDate = data.dueDate;
    this.completedAt = data.completedAt;
    this.comments = data.comments || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async find(query = {}) {
    let result = tasks;

    if (query.project) {
      result = result.filter(task => task.project === query.project);
    }

    if (query.assignedTo) {
      result = result.filter(task => task.assignedTo === query.assignedTo);
    }

    if (query.status) {
      result = result.filter(task => task.status === query.status);
    }

    if (query.priority) {
      result = result.filter(task => task.priority === query.priority);
    }

    // Handle date range queries
    if (query.dueDate && query.dueDate.$lte) {
      result = result.filter(task =>
        task.dueDate && new Date(task.dueDate) <= new Date(query.dueDate.$lte)
      );
    }

    return result;
  }

  static async findById(id) {
    return tasks.find(task => task._id === id) || null;
  }

  static async findByIdAndUpdate(id, updateData) {
    const index = tasks.findIndex(task => task._id === id);
    if (index >= 0) {
      tasks[index] = { ...tasks[index], ...updateData, updatedAt: new Date() };
      return tasks[index];
    }
    return null;
  }

  static async findByIdAndDelete(id) {
    const index = tasks.findIndex(task => task._id === id);
    if (index >= 0) {
      const deleted = tasks.splice(index, 1)[0];
      return deleted;
    }
    return null;
  }

  static async create(data) {
    const newTask = new Task(data);
    tasks.push(newTask);
    return newTask;
  }

  async save() {
    const index = tasks.findIndex(t => t._id === this._id);
    if (index >= 0) {
      tasks[index] = { ...this, updatedAt: new Date() };
    } else {
      tasks.push(this);
    }
    return this;
  }

  toObject() {
    return { ...this };
  }
}

module.exports = Task;
