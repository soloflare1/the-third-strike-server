// Calls an LLM API (OpenAI-compatible) to summarize a messy syllabus into clean bullet points.
// LLM_API_KEY must be set in .env — never hardcode it or commit it.

exports.summarize = async (req, res) => {
  try {
    const { syllabusText } = req.body;
    if (!syllabusText || syllabusText.trim().length < 5) {
      return res.status(400).json({ message: 'Please paste the syllabus text.' });
    }

    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'LLM_API_KEY not configured on the server.' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You summarize messy, exaggerated class syllabus announcements into a clean, short bulleted list of ONLY the genuinely examinable topics. Drop filler like "writer biography", "index", "back cover" type non-content. Keep it under 10 bullets.'
          },
          { role: 'user', content: syllabusText }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(500).json({ message: data.error?.message || 'LLM request failed' });
    }

    const summary = data.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
