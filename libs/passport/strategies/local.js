const LocalStrategy = require('passport-local');
const User = require('../../../models/User');


module.exports = new LocalStrategy(
 {
  usernameField: 'email',
  passwordField: 'password'
 },
  // Три возможных итога функции
  // done(null, user[, info]) ->
  //   strategy.success(user, info)
  // done(null, false[, info]) ->
  //   strategy.fail(info)
  // done(err) ->
  //   strategy.error(err)
 function(email, password, done) {
  User.findOne({ email }, (err, user) => {
    if (err) {
      return done(err);
    }
    if(!user || !user.checkPassword(password)) {
      return done(null, false, { message: 'Нет такого пользователя или пароль неверен'})
    }
    return done(null, user, {message: 'You are welcome!'})
  });
 }
);