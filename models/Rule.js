import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['general', 'academic', 'conduct', 'safety'],
    default: 'general',
  },
  source: {
    type: String,
    default: 'School Rulebook',
  },
  section: {
    type: String,
    default: '',
  },
  keywords: [{
    type: String,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Rule', ruleSchema);