import Strike from '../models/Strike.js';
import Complaint from '../models/Complaint.js';
import Student from '../models/Student.js';

// ============================================
// CREATE STRIKE
// ============================================
export const createStrike = async (req, res) => {
  try {
    const { complaintId, type, reason, notes } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Reason is required'
      });
    }

    // Get captain (Kuddus)
    const captain = await Student.findOne({ isKuddus: true });
    if (!captain) {
      return res.status(404).json({
        success: false,
        message: 'Captain (Kuddus) not found'
      });
    }

    // Create strike
    const strike = await Strike.create({
      captainId: captain._id,
      type: type || 'warning',
      reason,
      notes: notes || '',
      issuedBy: req.user.id,
      issuedByName: req.user.name || 'Teacher',
      complaintId: complaintId || null,
      status: 'active',
    });

    // Update complaint if provided
    if (complaintId) {
      await Complaint.findByIdAndUpdate(complaintId, {
        strikeIssued: true,
        status: 'reviewed',
      });
    }

    // Update strike count
    await updateStrikeCount(captain._id);

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('strike_update', {
        strike,
        count: await Strike.countDocuments({ captainId: captain._id, status: 'active' }),
      });
    }

    res.status(201).json({
      success: true,
      strike,
    });
  } catch (error) {
    console.error('❌ Create strike error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// GET ALL STRIKES
// ============================================
export const getStrikes = async (req, res) => {
  try {
    const strikes = await Strike.find()
      .sort({ createdAt: -1 })
      .populate('issuedBy', 'name');

    res.json({
      success: true,
      count: strikes.length,
      strikes,
    });
  } catch (error) {
    console.error('❌ Get strikes error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// GET STRIKE BY ID
// ============================================
export const getStrikeById = async (req, res) => {
  try {
    const strike = await Strike.findById(req.params.id)
      .populate('issuedBy', 'name')
      .populate('captainId', 'name');

    if (!strike) {
      return res.status(404).json({
        success: false,
        message: 'Strike not found'
      });
    }

    res.json({
      success: true,
      strike,
    });
  } catch (error) {
    console.error('❌ Get strike error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// UPDATE STRIKE STATUS
// ============================================
export const updateStrikeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const strike = await Strike.findById(req.params.id);

    if (!strike) {
      return res.status(404).json({
        success: false,
        message: 'Strike not found'
      });
    }

    strike.status = status || strike.status;
    await strike.save();

    res.json({
      success: true,
      strike,
    });
  } catch (error) {
    console.error('❌ Update strike status error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================
// UPDATE STRIKE COUNT (Helper)
// ============================================
const updateStrikeCount = async (captainId) => {
  try {
    // Count all active strikes
    const strikeCount = await Strike.countDocuments({ 
      captainId,
      status: 'active' 
    });

    // Get or create strike record
    let strike = await Strike.findOne({ captainId });
    if (!strike) {
      strike = await Strike.create({
        captainId,
        strikeCount: 0,
        status: 'active',
      });
    }

    // Update strike count
    strike.strikeCount = strikeCount;

    // Update warnings
    if (strikeCount === 1) {
      strike.warnings = ['first_warning'];
    } else if (strikeCount === 2) {
      strike.warnings = ['first_warning', 'final_warning'];
    } else if (strikeCount >= 3) {
      strike.status = 'impeached';
      strike.impeachedAt = new Date();
    }

    await strike.save();
    console.log(`✅ Strike count updated: ${strikeCount}/3`);

  } catch (error) {
    console.error('❌ Update strike count error:', error);
  }
};