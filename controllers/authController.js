import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ============================================
// GENERATE SECRET CODE
// ============================================
const generateSecretCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// ============================================
// REGISTER
// ============================================
export const register = async (req, res) => {
  try {
    console.log("📥 Register request body:", req.body);

    const { name, email, password, role, rollNumber, height } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name is required' 
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Student validation
    if (role === 'student') {
      if (!rollNumber) {
        return res.status(400).json({ 
          success: false, 
          message: 'Roll number is required for students' 
        });
      }

      const existingRoll = await Student.findOne({ rollNumber });
      if (existingRoll) {
        return res.status(400).json({ 
          success: false, 
          message: 'Roll number already exists' 
        });
      }
    }

    // Teacher/Captain validation
    if (role !== 'student') {
      if (!email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email is required for teachers and captains' 
        });
      }

      const existingEmail = await Student.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already exists' 
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    let studentData = {
      name,
      role: role || 'student',
      height: height || 170,
    };

    // For students: generate secret code
    if (role === 'student') {
      const secretCode = generateSecretCode();
      studentData = {
        ...studentData,
        rollNumber,
        secretCode,
        password: await bcrypt.hash(secretCode, salt),
      };
      console.log("🔑 Generated secret code for student:", secretCode);
    } else {
      studentData = {
        ...studentData,
        email,
        rollNumber: rollNumber || '',
        password: await bcrypt.hash(password, salt),
      };
    }

    const student = await Student.create(studentData);

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email || '',
        role: student.role,
        rollNumber: student.rollNumber || '',
        secretCode: student.secretCode || '',
        height: student.height,
        anonymousId: student.anonymousId,
        isKuddus: student.isKuddus || false,
        displayName: student.name,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email or Roll Number already exists'
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// LOGIN
// ============================================
export const login = async (req, res) => {
  try {
    console.log("🔐 Login attempt:", req.body);

    const { email, password, rollNumber, secretCode, role } = req.body;

    let student;

    // ===== STUDENT LOGIN =====
    if (role === 'student') {
      if (!rollNumber || !secretCode) {
        return res.status(400).json({ 
          success: false, 
          message: 'Roll Number and Secret Code are required' 
        });
      }

      student = await Student.findOne({ rollNumber });
      
      if (!student) {
        console.log("❌ Student not found with rollNumber:", rollNumber);
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid Roll Number or Secret Code' 
        });
      }

      const isMatch = await bcrypt.compare(secretCode, student.password);
      if (!isMatch) {
        console.log("❌ Secret Code mismatch for rollNumber:", rollNumber);
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid Roll Number or Secret Code' 
        });
      }
    }

    // ===== TEACHER/CAPTAIN LOGIN =====
    else {
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email and Password are required' 
        });
      }

      student = await Student.findOne({ email });
      console.log("👤 User found:", student?.name || 'Not found');
      
      if (!student) {
        console.log("❌ User not found with email:", email);
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }

      const isMatch = await bcrypt.compare(password, student.password);
      console.log("🔑 Password match:", isMatch);
      
      if (!isMatch) {
        console.log("❌ Password mismatch for:", email);
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid credentials' 
        });
      }
    }

    // ===== ROLE MATCH CHECK =====
    if (student.role !== role) {
      console.log("❌ Role mismatch: DB:", student.role, "Requested:", role);
      return res.status(400).json({ 
        success: false, 
        message: `Invalid role. You are registered as ${student.role}` 
      });
    }

    console.log("✅ Login successful for:", student.name);

    // ===== GENERATE TOKEN =====
    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email || '',
        role: student.role,
        rollNumber: student.rollNumber || '',
        secretCode: student.secretCode || '',
        height: student.height,
        anonymousId: student.anonymousId,
        isKuddus: student.isKuddus || false,
        displayName: student.name,
      },
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// GET CURRENT USER
// ============================================
export const getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select('-password');
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: {
        id: student._id,
        name: student.name,
        email: student.email || '',
        role: student.role,
        rollNumber: student.rollNumber || '',
        secretCode: student.secretCode || '',
        height: student.height,
        anonymousId: student.anonymousId,
        isKuddus: student.isKuddus || false,
        displayName: student.name,
      },
    });
  } catch (error) {
    console.error("❌ GetMe error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============================================
// UPDATE PROFILE
// ============================================
export const updateProfile = async (req, res) => {
  try {
    const { height, needsFront } = req.body;
    const student = await Student.findById(req.user.id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (height) student.height = height;
    if (needsFront !== undefined) student.needsFront = needsFront;
    
    await student.save();

    res.json({
      success: true,
      user: {
        id: student._id,
        name: student.name,
        email: student.email || '',
        role: student.role,
        rollNumber: student.rollNumber || '',
        secretCode: student.secretCode || '',
        height: student.height,
        needsFront: student.needsFront,
        anonymousId: student.anonymousId,
        isKuddus: student.isKuddus || false,
        displayName: student.name,
      },
    });
  } catch (error) {
    console.error("❌ UpdateProfile error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};