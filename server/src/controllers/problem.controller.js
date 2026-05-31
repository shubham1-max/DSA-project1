const Problem = require("../models/problem.model");
const { streamSolution } = require("../services/ai.service");
const { updateStreak } = require("../services/streak.service");
const { sanitizeQuestion } = require("../services/prompt.builder"); 
// POST /problem/solve
const solveProblem = async (req, res) => {
  const { question, language = "C++" } = req.body;


  const sanitized = sanitizeQuestion(question);

 if (!sanitized.ok) {
    return res.status(400).json({
      error: sanitized.reason,
    });
  }
  const ALLOWED_LANGUAGES = [
    "C++",
    "Java",
    "Python",
    "JavaScript",
    "C",
  ];

  if (!ALLOWED_LANGUAGES.includes(language)) {
    return res.status(400).json({
      error: "Unsupported language",
    });
  }

  let problemDoc;

  // Save problem before AI call
  try {
    problemDoc = await Problem.create({
      userId: req.user.id,
      question: question.trim(),
      language,
      status: "pending",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: "Failed to create problem record",
    });
  }

  let parsed;

try {
    // Call AI service
    parsed = await streamSolution(
      question,
      language,
      res
    );
  } catch (err) {
    console.error("[solveProblem] Error during streaming:", err);

  
    await Problem.findByIdAndUpdate(
      problemDoc._id,
      {
        status: "error",
      }
    );

    
    if (res.headersSent) {
   
        if (!res.writableEnded) {
            res.end();
        }
    } else {
      
        return res.status(500).json({
            error: "AI service failed",
        });
    }
  }




  if (parsed) {
    await Problem.findByIdAndUpdate(
      problemDoc._id,
      {
        aiResponse: parsed,
        status: "complete",
        solvedAt: new Date(),
      }
    );

  const tzOffset = parseInt(req.headers['x-tz-offset']) || 0;
await updateStreak(req.user.id, tzOffset);

  } 
  
  else {
    await Problem.findByIdAndUpdate(
      problemDoc._id,
      {
        status: "error",
      }
    );
  }
};

// GET /problem/history
const getHistory = async (req, res, next) => {
  try {
    const page = Math.max(
      1,
      parseInt(req.query.page) || 1
    );

    const limit = Math.min(
      50,
      Math.max(
        1,
        parseInt(req.query.limit) || 20
      )
    );

    const problems = await Problem.find({
      userId: req.user.id,
      status: "complete",
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-aiResponse");

    const total = await Problem.countDocuments({
      userId: req.user.id,
      status: "complete",
    });

    return res.status(200).json({
      problems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /problem/:id/hint
const updateHint = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    if (problem.hintsUsed >= 3) {
      return res.status(400).json({
        error: "All hints already revealed",
      });
    }

    problem.hintsUsed += 1;

    await problem.save();

    return res.status(200).json({
      hintsUsed: problem.hintsUsed,
    });
  } catch (err) {
    next(err);
  }
};

// PATCH /problem/:id/bookmark
const toggleBookmark = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!problem) {
      return res.status(404).json({
        error: "Problem not found",
      });
    }

    problem.bookmarked = !problem.bookmarked;

    await problem.save();

    return res.status(200).json({
      bookmarked: problem.bookmarked,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  solveProblem,
  getHistory,
  updateHint,
  toggleBookmark,
};