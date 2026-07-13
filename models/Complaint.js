import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  anonymousId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['tiffin_theft', 'bribe', 'syllabus_bloat', 'misuse_of_power', 'other'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  evidenceURL: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  verifiedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Complaint', complaintSchema);