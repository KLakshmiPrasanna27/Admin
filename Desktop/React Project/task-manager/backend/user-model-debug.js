const User = require('./models/User');

(async () => {
  const user = await User.create({
    name: 'DirectTest',
    email: 'directtest@example.com',
    phone: '000',
    password: 'mypassword',
    age: 28
  });

  console.log('created', user.email, user.password ? 'hashed' : 'nohash');

  const found = await User.findOne({ email: 'directtest@example.com' });
  console.log('found', found ? found.email : 'not found');

  if (found) {
    console.log('match', await found.matchPassword('mypassword'));
    console.log('wrong', await found.matchPassword('wrong'));
  }
})();
