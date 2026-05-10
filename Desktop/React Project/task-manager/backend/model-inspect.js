const Project = require('./models/Project');
const Task = require('./models/Task');

console.log('Project.find is', typeof Project.find);
const q = Project.find({});
console.log('Project.find returns', q && q.constructor && q.constructor.name);
console.log('Query has populate', typeof q.populate);
const p = Project.findById('project-1');
console.log('Project.findById returns', p && p.constructor && p.constructor.name);
console.log('findById populate', p && typeof p.populate);
const tq = Task.find({});
console.log('Task.find returns', tq && tq.constructor && tq.constructor.name);
console.log('Task.find populate', typeof tq.populate);
const tdoc = Task.findById('task-1');
console.log('Task.findById returns', tdoc && tdoc.constructor && tdoc.constructor.name);
console.log('Task.findById populate', tdoc && typeof tdoc.populate);
