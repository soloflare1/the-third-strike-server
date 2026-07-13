import LedgerEntry from '../models/LedgerEntry.js';
import { generateAnonymousId } from '../utils/hashRoll.js';

export const createEntry = async (req, res) => {
  try {
    const { type, category, description, amount, tiffinItem, date } = req.body;

    const entry = await LedgerEntry.create({
      type,
      category,
      description,
      amount: type === 'money' ? amount : 0,
      tiffinItem: type === 'tiffin' ? tiffinItem : '',
      reportedBy: req.user.id,
      anonymousId: req.user.anonymousId || generateAnonymousId(),
      date: date || new Date(),
      status: 'pending',
    });

    res.status(201).json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEntries = async (req, res) => {
  try {
    const { type, status, startDate, endDate } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const entries = await LedgerEntry.find(filter)
      .sort({ createdAt: -1 })
      .populate('reportedBy', 'name anonymousId');

    // Calculate totals
    const totals = {
      totalMoney: entries
        .filter(e => e.type === 'money' && e.status === 'verified')
        .reduce((sum, e) => sum + e.amount, 0),
      totalTiffins: entries
        .filter(e => e.type === 'tiffin' && e.status === 'verified')
        .length,
      pendingMoney: entries
        .filter(e => e.type === 'money' && e.status === 'pending')
        .reduce((sum, e) => sum + e.amount, 0),
      pendingTiffins: entries
        .filter(e => e.type === 'tiffin' && e.status === 'pending')
        .length,
    };

    res.json({ success: true, count: entries.length, entries, totals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEntry = async (req, res) => {
  try {
    const entry = await LedgerEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    // Only teachers can verify
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only teachers can verify entries' 
      });
    }

    entry.status = 'verified';
    await entry.save();

    res.json({ success: true, entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteEntry = async (req, res) => {
  try {
    const entry = await LedgerEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    await entry.deleteOne();
    res.json({ success: true, message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};