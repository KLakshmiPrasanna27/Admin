// In-memory storage for demo purposes
let projects = [
  {
    _id: 'demo-project-1',
    name: 'Sample Project 1',
    description: 'This is a demo project for testing',
    admin: 'demo-admin',
    members: ['demo-admin', 'demo-member'],
    status: 'active',
    startDate: new Date(),
    endDate: null,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo-project-2',
    name: 'Sample Project 2',
    description: 'Another demo project',
    admin: 'demo-admin',
    members: ['demo-admin'],
    status: 'active',
    startDate: new Date(),
    endDate: null,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

class Project {
  constructor(data) {
    this._id = data._id || Date.now().toString();
    this.name = data.name;
    this.description = data.description;
    this.admin = data.admin;
    this.members = data.members || [];
    this.status = data.status || 'active';
    this.startDate = data.startDate || new Date();
    this.endDate = data.endDate;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async find(query = {}) {
    let result = projects;

    if (query.admin) {
      result = result.filter(project => project.admin === query.admin);
    }

    if (query.members) {
      result = result.filter(project =>
        project.members.includes(query.members) || project.admin === query.members
      );
    }

    if (query.status) {
      result = result.filter(project => project.status === query.status);
    }

    return result;
  }

  static async findById(id) {
    return projects.find(project => project._id === id) || null;
  }

  static async findByIdAndUpdate(id, updateData) {
    const index = projects.findIndex(project => project._id === id);
    if (index >= 0) {
      projects[index] = { ...projects[index], ...updateData, updatedAt: new Date() };
      return projects[index];
    }
    return null;
  }

  static async findByIdAndDelete(id) {
    const index = projects.findIndex(project => project._id === id);
    if (index >= 0) {
      const deleted = projects.splice(index, 1)[0];
      return deleted;
    }
    return null;
  }

  static async create(data) {
    const newProject = new Project(data);
    projects.push(newProject);
    return newProject;
  }

  async save() {
    const index = projects.findIndex(p => p._id === this._id);
    if (index >= 0) {
      projects[index] = { ...this, updatedAt: new Date() };
    } else {
      projects.push(this);
    }
    return this;
  }

  toObject() {
    return { ...this };
  }
}

module.exports = Project;
