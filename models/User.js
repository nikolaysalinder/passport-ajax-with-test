const mongoose = require('../libs/mongoose');
const crypto = require('crypto');
const _ = require('lodash');
const config = require('config');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: 'E-mail пользователя не должен быть пустым.',
    validate: [
      {
        validator(value) {
          return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
        },
        message: 'Некорректный email.'
      }
    ],
    unique: 'Такой email уже существует'
  },
  displayName: {
    type: String,
    required: 'У пользователя должно быть имя',
    unique: 'Такое имя уже существует'
  },
  passwordHash: {
    type: String,
    required: true
  },
  salt: {
    required: true,
    type: String
  }
}, {
  timestamps: true,
});
// user.password = '1312312'
userSchema.virtual('password')
  .set(function(password) {

    if (password !== undefined) {
      if (password.length < 4) {
        this.invalidate('password', 'Пароль должен быть минимум 4 символа.');
      }
    }
    // '123123' + 'ijfasdiofja849' => 'asdf8a7sdf897asd8f7asdf'
    this.salt = crypto.randomBytes(config.get('crypto.hash.length')).toString('base64');
    this.passwordHash = crypto.pbkdf2Sync(
      password,
      this.salt,
      config.get('crypto.hash.iterations'),
      config.get('crypto.hash.length'),
      'sha512'
    ).toString('base64');
  });

userSchema.methods.checkPassword = function(password) {
  if (!password) return false;

  const hash = crypto.pbkdf2Sync(
    password,
    this.salt,
    config.get('crypto.hash.iterations'),
    config.get('crypto.hash.length'),
    'sha512'
  ).toString('base64');
  // https://www.npmjs.com/package/bcrypt
  return hash === this.passwordHash;
};

module.exports = mongoose.model('User', userSchema);
