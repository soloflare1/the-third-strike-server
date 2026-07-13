import Complaint from '../models/Complaint.js';
import Strike from '../models/Strike.js';
import Student from '../models/Student.js';
import { generateAnonymousId } from '../utils/hashRoll.js';

// ===== GENERATE ANONYMOUS COMPLAINT CODE =====
const generateComplaintCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'TTS-';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// ===== SUBMIT COMPLAINT (Student) =====
export const submitComplaint = async (req, res) => {
  try {
    const { category, description } = req.body;
    const studentId = req.user.id;

    // Get student's anonymous ID
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Generate anonymous complaint code
    const complaintCode = generateComplaintCode();

    const complaint = await Complaint.create({
      anonymousId: student.anonymousId,
      category,
      description,
      evidenceURL: req.file ? req.file.path : '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      complaint: {
        complaintCode,
        ...complaint.toObject(),
      },
    });
  } catch (error) {
    console.error('❌ Submit complaint error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== GET ALL COMPLAINTS (Teacher) =====
export const getComplaints = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('❌ Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== VERIFY COMPLAINT (Teacher) =====
export const verifyComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'verify' or 'reject'

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    if (complaint.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Complaint already reviewed'
      });
    }

    if (action === 'verify') {
      complaint.status = 'verified';
      complaint.verifiedBy = req.user.id;
      complaint.verifiedAt = new Date();

      await complaint.save();

      // Update strike count
      await updateStrikeCount();

    } else if (action === 'reject') {
      complaint.status = 'rejected';
      await complaint.save();
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('❌ Verify complaint error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== UPDATE STRIKE COUNT =====
const updateStrikeCount = async () => {
  try {
    // Get captain (Kuddus)
    const captain = await Student.findOne({ isKuddus: true });
    if (!captain) {
      console.log('❌ Captain (Kuddus) not found');
      return;
    }

    // Get or create strike record
    let strike = await Strike.findOne({ captainId: captain._id });
    if (!strike) {
      strike = await Strike.create({
        captainId: captain._id,
        strikeCount: 0,
        status: 'active',
      });
    }

    // Count verified complaints
    const verifiedCount = await Complaint.countDocuments({ status: 'verified' });

    // Update strike count
    strike.strikeCount = verifiedCount;

    // Update warnings
    if (verifiedCount === 1) {
      strike.warnings = ['first_warning'];
    } else if (verifiedCount === 2) {
      strike.warnings = ['first_warning', 'final_warning'];
    } else if (verifiedCount >= 3) {
      strike.status = 'impeached';
      strike.impeachedAt = new Date();
    }

    await strike.save();
    console.log(`✅ Strike count updated: ${verifiedCount}/3`);

  } catch (error) {
    console.error('❌ Update strike count error:', error);
  }
};

// ===== GET STRIKE STATUS =====
export const getStrikeStatus = async (req, res) => {
  try {
    const captain = await Student.findOne({ isKuddus: true });
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: 'Captain (Kuddus) not found'
      });
    }

    let strike = await Strike.findOne({ captainId: captain._id });
    if (!strike) {
      strike = await Strike.create({
        captainId: captain._id,
        strikeCount: 0,
        status: 'active',
      });
    }

    const verifiedCount = await Complaint.countDocuments({ status: 'verified' });
    strike.strikeCount = verifiedCount;

    const statusMap = {
      0: { label: 'Safe', color: 'green', message: 'No strikes yet' },
      1: { label: 'First Warning', color: 'yellow', message: 'First warning issued!' },
      2: { label: 'Final Warning', color: 'orange', message: 'Final warning! One more strike!' },
      3: { label: 'IMPEACHED', color: 'red', message: '🎉 Kuddus has been impeached!' },
    };

    const currentStatus = statusMap[verifiedCount >= 3 ? 3 : verifiedCount];

    res.json({
      success: true,
      strike: {
        strikeCount: verifiedCount,
        maxStrikes: 3,
        status: strike.status,
        warnings: strike.warnings,
        currentStatus,
        isImpeached: verifiedCount >= 3,
      },
    });
  } catch (error) {
    console.error('❌ Get strike status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};