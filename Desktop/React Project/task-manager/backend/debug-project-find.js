const Project = require('./models/Project');

(async () => {
  try {
    const projects = await Project.find({
      $or: [
        { admin: 'admin-1' },
        { members: 'admin-1' }
      ]
    }).populate(['admin', 'members']);
    console.log('OK', projects.length, projects[0] && projects[0].admin && projects[0].admin.email);
  } catch (err) {
    console.error('ERR', err);
  }
})();
