const User = require('../models/User');
const mongoose = require('../libs/mongoose');
const users = require('./users');

(async () => {
  await User.remove();
  for (var i = 0; i < users.length;  i++) {
    await User.create(users[i]);
  }

  mongoose.disconnect();

  console.log(`All done, ${users.length} users have been saved in DB`);
})()