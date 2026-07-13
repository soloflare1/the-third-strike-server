import mongoose from 'mongoose';

const ledgerEntrySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['money', 'tiffin'],
    required: true,
  },
  category: {
    type: String,
    enum: ['washroom_toll', 'quality_tax', 'stolen_food', 'other_bribe'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  tiffinItem: {
    type: String,
    default: '',
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  anonymousId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'verified'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('LedgerEntry', ledgerEntrySchema);