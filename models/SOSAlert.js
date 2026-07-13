import mongoose from 'mongoose';

const sosAlertSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  anonymousId: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: 'Emergency! Help needed!',
  },
  status: {
    type: String,
    enum: ['active', 'responding', 'resolved'],
    default: 'active',
  },
  respondedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  respondedByName: {
    type: String,
    default: '',
  },
  resolvedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('SOSAlert', sosAlertSchema);