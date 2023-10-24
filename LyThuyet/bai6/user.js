const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  albums: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Album',
    },
  ],
});

// Phương thức để mã hóa mật khẩu
userSchema.methods.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// Phương thức để kiểm tra mật khẩu
userSchema.methods.comparePassword = function (password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
