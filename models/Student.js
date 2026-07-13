import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    //unique: true,
    sparse: true,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    unique: true,
    sparse: true,
  },
  secretCode: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
  },
  height: {
    type: Number,
    default: 170,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'captain'],
    default: 'student',
  },
  isKuddus: {
    type: Boolean,
    default: false,
  },
  needsFront: {
    type: Boolean,
    default: false,
  },
  anonymousId: {
    type: String,
    unique: true,
    sparse: true,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to generate anonymous ID
studentSchema.pre('save', function(next) {
  if (!this.anonymousId) {
    this.anonymousId = `STU-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('Student', studentSchema);