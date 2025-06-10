import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  }
}, { 
  timestamps: true
});

// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

const UserEntity = mongoose.model('UserProfile', UserSchema);

export default UserEntity;