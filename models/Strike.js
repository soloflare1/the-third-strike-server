import mongoose from 'mongoose';

const strikeSchema = new mongoose.Schema({
  captainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  type: {
    type: String,
    enum: ['warning', 'final_warning', 'impeachment'],
    default: 'warning',
  },
  reason: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  issuedByName: {
    type: String,
    required: true,
  },
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
  },
  status: {
    type: String,
    enum: ['active', 'resolved'],
    default: 'active',
  },
  strikeCount: {
    type: Number,
    default: 0,
  },
  warnings: [{
    type: String,
    enum: ['first_warning', 'final_warning'],
  }],
  impeachedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Strike', strikeSchema);