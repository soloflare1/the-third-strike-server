import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// ============================================
// SUMMARIZE SYLLABUS (Mock Mode - No OpenAI)
// ============================================
router.post('/summarize', async (req, res) => {
  try {
    const { syllabus } = req.body;

    if (!syllabus) {
      return res.status(400).json({
        success: false,
        message: 'Please provide syllabus text'
      });
    }

    console.log('📤 Processing syllabus (Mock Mode)...');

    // Mock AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Extract chapter numbers from syllabus text
    const chapterMatches = syllabus.match(/Chapter\s*(\d+)/gi) || [];
    const totalChapters = chapterMatches.length || 10;

    res.json({
      success: true,
      result: {
        summary: `📚 Here's your simplified syllabus (${totalChapters} chapters found)`,
        topics: [
          { name: "Core Concepts", chapters: "1-3", priority: "High", duration: "3 days" },
          { name: "Advanced Topics", chapters: "4-6", priority: "High", duration: "4 days" },
          { name: "Practical Applications", chapters: "7-8", priority: "Medium", duration: "3 days" },
          { name: "Review & Practice", chapters: "9-10", priority: "Medium", duration: "2 days" },
        ],
        studyPlan: [
          { day: "Day 1-3", focus: "Core Concepts", tasks: "Read, make notes, practice" },
          { day: "Day 4-7", focus: "Advanced Topics", tasks: "Solve problems, watch videos" },
          { day: "Day 8-10", focus: "Practical Applications", tasks: "Case studies" },
          { day: "Day 11-13", focus: "Review & Practice", tasks: "Revision, practice MCQs" },
          { day: "Day 14", focus: "Final Revision", tasks: "Quick revision, mock test" },
        ],
        totalChapters: totalChapters || 10,
        estimatedHours: Math.min(totalChapters * 2.5, 30),
        difficulty: totalChapters > 8 ? "Medium-High" : "Medium",
        examReady: true,
      },
    });

  } catch (error) {
    console.error('❌ Syllabus error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;