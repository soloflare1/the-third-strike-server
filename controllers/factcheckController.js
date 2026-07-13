import Rule from '../models/Rule.js';

export const checkClaim = async (req, res) => {
  try {
    const { claim } = req.body;

    if (!claim) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a claim to check' 
      });
    }

    // Search for matching rule
    const rules = await Rule.find({ isActive: true });
    
    let matchedRule = null;
    let highestConfidence = 0;

    for (const rule of rules) {
      let confidence = 0;
      
      // Check exact match
      if (claim.toLowerCase().includes(rule.title.toLowerCase())) {
        confidence += 60;
      }
      
      // Check keywords
      for (const keyword of rule.keywords || []) {
        if (claim.toLowerCase().includes(keyword.toLowerCase())) {
          confidence += 20;
        }
      }
      
      // Check content match
      if (rule.content && claim.toLowerCase().includes(rule.content.toLowerCase().slice(0, 30))) {
        confidence += 20;
      }

      if (confidence > highestConfidence) {
        highestConfidence = confidence;
        matchedRule = rule;
      }
    }

    // Determine verdict
    const verdict = highestConfidence >= 50 ? 'true' : 'false';
    const confidence = Math.min(Math.max(highestConfidence, 50), 100);

    res.json({
      success: true,
      result: {
        claim,
        verdict,
        confidence,
        rule: matchedRule ? matchedRule.content : 'No specific rule found. This appears to be a false claim.',
        source: matchedRule ? `${matchedRule.source} - ${matchedRule.section || 'General'}` : 'School Rulebook - General Guidelines',
        explanation: verdict === 'true' 
          ? 'This claim matches official school rules.'
          : 'This claim contradicts official school rules. Kuddus is making up rules to maintain power.',
        recommendedAction: verdict === 'false'
          ? '🚨 Report this to your teacher immediately!'
          : '✅ No action needed. This rule is correct.',
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllRules = async (req, res) => {
  try {
    const rules = await Rule.find({ isActive: true });
    res.json({ success: true, count: rules.length, rules });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRule = async (req, res) => {
  try {
    const { title, content, category, source, section, keywords } = req.body;

    // Only teachers can create rules
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ 
        success: false, 
        message: 'Only teachers can create rules' 
      });
    }

    const rule = await Rule.create({
      title,
      content,
      category: category || 'general',
      source: source || 'School Rulebook',
      section: section || '',
      keywords: keywords || [],
    });

    res.status(201).json({ success: true, rule });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};