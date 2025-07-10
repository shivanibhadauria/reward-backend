const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

console.log("About to save admin:", adminSchema);


// adminSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) { 
//     return next();
//   } // If password is already hashed, skip hashing
//   this.password = await bcrypt.hash(this.password, 10); // Hash the password
//   next();
// })

module.exports = mongoose.model('Admin', adminSchema);