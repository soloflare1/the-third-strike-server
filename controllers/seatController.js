import Student from '../models/Student.js';
import SeatPlan from '../models/SeatPlan.js';
import { generateOptimalSeatingPlan } from '../utils/seatingAlgorithm.js';

// ============================================
// GENERATE SEAT PLAN
// ============================================
export const generateSeatPlan = async (req, res) => {
  try {
    const { rows = 5, columns = 6, className = 'Class 7, Section B' } = req.body;

    // Get all students
    const students = await Student.find({ role: 'student' });

    if (students.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No students found. Please add students first.',
      });
    }

    // Convert to format needed by algorithm
    const formattedStudents = students.map(s => ({
      id: s._id,
      name: s.name,
      height: s.height || 170,
      rollNumber: s.rollNumber,
      isKuddus: s.isKuddus || false,
      needsFront: s.needsFront || false,
      specialNeeds: s.specialNeeds || false,
    }));

    // Run the optimal seating algorithm
    const result = generateOptimalSeatingPlan(formattedStudents, rows, columns);

    // Save to database
    const seatPlan = await SeatPlan.create({
      className,
      rows,
      columns,
      students: result.grid.flat().filter(s => s !== null),
      teacherPosition: result.teacherPosition,
      validation: result.validation,
      statistics: result.statistics,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      seatPlan,
      grid: result.grid,
      validation: result.validation,
      statistics: result.statistics,
    });
  } catch (error) {
    console.error('❌ Generate seat plan error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// GET SEAT PLAN
// ============================================
export const getSeatPlan = async (req, res) => {
  try {
    const seatPlan = await SeatPlan.findOne().sort({ createdAt: -1 });

    if (!seatPlan) {
      return res.status(404).json({
        success: false,
        message: 'No seat plan found',
      });
    }

    res.json({
      success: true,
      seatPlan,
    });
  } catch (error) {
    console.error('❌ Get seat plan error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// UPDATE STUDENT SEAT
// ============================================
export const updateStudentSeat = async (req, res) => {
  try {
    const { studentId, row, column } = req.body;
    
    const seatPlan = await SeatPlan.findOne().sort({ createdAt: -1 });
    if (!seatPlan) {
      return res.status(404).json({
        success: false,
        message: 'No seat plan found'
      });
    }

    // Find and update student position
    const studentIndex = seatPlan.students.findIndex(
      s => s.id.toString() === studentId
    );

    if (studentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Student not found in seat plan'
      });
    }

    seatPlan.students[studentIndex].row = row;
    seatPlan.students[studentIndex].column = column;
    await seatPlan.save();

    res.json({
      success: true,
      message: 'Student seat updated successfully',
      seatPlan,
    });
  } catch (error) {
    console.error('❌ Update student seat error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// VALIDATE SEAT PLAN
// ============================================
export const validateSeatPlan = async (req, res) => {
  try {
    const seatPlan = await SeatPlan.findOne().sort({ createdAt: -1 });

    if (!seatPlan) {
      return res.status(404).json({
        success: false,
        message: 'No seat plan found',
      });
    }

    res.json({
      success: true,
      validation: seatPlan.validation,
      statistics: seatPlan.statistics,
    });
  } catch (error) {
    console.error('❌ Validate seat plan error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};