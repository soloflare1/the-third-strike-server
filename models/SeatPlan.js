import mongoose from 'mongoose';

const seatPlanSchema = new mongoose.Schema({
  className: {
    type: String,
    default: 'Class 7, Section B',
  },
  rows: {
    type: Number,
    default: 5,
  },
  columns: {
    type: Number,
    default: 6,
  },
  students: [{
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    height: Number,
    rollNumber: String,
    isKuddus: Boolean,
    needsFront: Boolean,
    row: Number,
    column: Number,
  }],
  teacherPosition: {
    row: { type: Number, default: -1 },
    col: { type: Number, default: 3 },
  },
  validation: {
    isValid: { type: Boolean, default: true },
    errors: { type: [String], default: [] },
  },
  statistics: {
    totalStudents: { type: Number, default: 0 },
    placedStudents: { type: Number, default: 0 },
    emptySeats: { type: Number, default: 0 },
    rows: { type: Number, default: 5 },
    columns: { type: Number, default: 6 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('SeatPlan', seatPlanSchema);