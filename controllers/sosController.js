import SOSAlert from '../models/SOSAlert.js';
import { generateAnonymousId } from '../utils/hashRoll.js';

export const createSOS = async (req, res) => {
  try {
    const { location, message } = req.body;

    const sos = await SOSAlert.create({
      studentId: req.user.id,
      studentName: req.user.name,
      anonymousId: req.user.anonymousId || generateAnonymousId(),
      location,
      message: message || 'Emergency! Help needed!',
      status: 'active',
    });

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('sos_alert', {
        id: sos._id,
        location: sos.location,
        message: sos.message,
        studentName: sos.studentName,
        anonymousId: sos.anonymousId,
        createdAt: sos.createdAt,
      });
    }

    res.status(201).json({ success: true, sos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSOSAlerts = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};

    if (status) filter.status = status;

    // Students can only see their own SOS
    if (req.user.role === 'student') {
      filter.studentId = req.user.id;
    }

    const alerts = await SOSAlert.find(filter)
      .sort({ createdAt: -1 })
      .populate('studentId', 'name anonymousId rollNumber')
      .populate('respondedBy', 'name role');

    res.json({ success: true, count: alerts.length, alerts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const respondToSOS = async (req, res) => {
  try {
    const { status, message } = req.body;
    
    const sos = await SOSAlert.findById(req.params.id);
    if (!sos) {
      return res.status(404).json({ success: false, message: 'SOS alert not found' });
    }

    // Only captains and teachers can respond
    if (!['captain', 'teacher'].includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only captains and teachers can respond to SOS' 
      });
    }

    sos.status = status || 'responding';
    sos.respondedBy = req.user.id;
    sos.respondedByName = req.user.name;
    
    if (status === 'resolved') {
      sos.resolvedAt = new Date();
    }

    await sos.save();

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('sos_update', {
        id: sos._id,
        status: sos.status,
        respondedBy: sos.respondedByName,
        updatedAt: new Date(),
      });
    }

    res.json({ success: true, sos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};