const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory storage for demo purposes
let users = [
  {
    _id: 'demo-admin',
    name: 'Demo Admin',
    email: 'admin@demo.com',
    phone: '1234567890',
    password: '$2a$10$hashedpassword', // This will be set properly
    role: 'admin',
    age: 30,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: 'demo-member',
    name: 'Demo Member',
    email: 'member@demo.com',
    phone: '0987654321',
    password: '$2a$10$hashedpassword', // This will be set properly
    role: 'member',
    age: 25,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Initialize demo passwords
const initializeDemoUsers = async () => {
  for (let user of users) {
    if (user.password === '$2a$10$hashedpassword') {
      const password = user.role === 'admin' ? 'admin123' : 'member123';
      user.password = await bcrypt.hash(password, 10);
    }
  }
};

initializeDemoUsers();

class User {
  constructor(data) {
    this._id = data._id || Date.now().toString();
    this.name = data.name;
    this.email = data.email;
    this.phone = data.phone;
    this.password = data.password;
    this.role = data.role || 'member';
    this.age = data.age;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  static async findOne(query) {
    return users.find(user =>
      (query.email && user.email === query.email) ||
      (query._id && user._id === query._id)
    ) || null;
  }

  static async find(query = {}) {
    let result = users;

    if (query.role) {
      result = result.filter(user => user.role === query.role);
    }

    return result;
  }

  static async findById(id) {
    return users.find(user => user._id === id) || null;
  }

  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = new User({
      ...data,
      password: hashedPassword,
      _id: Date.now().toString()
    });
    users.push(newUser);
    return newUser;
  }

  async save() {
    const index = users.findIndex(u => u._id === this._id);
    if (index >= 0) {
      users[index] = { ...this, updatedAt: new Date() };
    } else {
      users.push(this);
    }
    return this;
  }

  async matchPassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  }

  getSignedJwtToken() {
    return jwt.sign(
      { id: this._id, role: this.role },
      process.env.JWT_SECRET || 'demo_secret_key',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  }

  toObject() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
