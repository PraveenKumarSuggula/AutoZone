const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;
const userSchema = Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
      },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
  
    password: {
      type: String,
      trim: true,
      required:true,
    },
    phone: {
      type: String,
    },
    image:{
      data: Buffer,
      contentType: String
    },
    major:{
      type:String
    },
    grade:{
      type:String
    }
    
  },
);


userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
if(user){
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');}
  else throw new Error('Unable to login');
  return user;
};

// Hash the plain text password before save
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;