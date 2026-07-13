/**
 * Advanced Seat Planning Algorithm
 * Constraint-aware optimization for classroom seating
 */

// ============================================
// STEP 1: Student Classification
// ============================================
export const classifyStudents = (students) => {
  const priorityStudents = []; // Vision/Hearing impaired
  const kuddus = [];
  const normalStudents = [];

  students.forEach(student => {
    if (student.isKuddus) {
      kuddus.push(student);
    } else if (student.needsFront || student.specialNeeds) {
      priorityStudents.push(student);
    } else {
      normalStudents.push(student);
    }
  });

  return { priorityStudents, kuddus, normalStudents };
};

// ============================================
// STEP 2: Seat Score Calculation
// ============================================
export const calculateSeatScore = (seat, grid, kuddus, teacherPosition) => {
  let score = 0;
  const { row, col } = seat;

  // 2.1 Visibility Score (Teacher can see student)
  const visibilityScore = calculateVisibilityScore(row, col, grid, teacherPosition);
  score += visibilityScore;

  // 2.2 Accessibility Score (Front rows for special needs)
  const accessibilityScore = calculateAccessibilityScore(row, col);
  score += accessibilityScore;

  // 2.3 Teacher Distance Score (Closer to teacher is better)
  const distanceScore = calculateTeacherDistanceScore(row, col, teacherPosition);
  score += distanceScore;

  // 2.4 Blocking Penalty (Tall students block view)
  const blockingPenalty = calculateBlockingPenalty(row, col, grid);
  score -= blockingPenalty;

  // 2.5 Kuddus Visibility Bonus (If Kuddus is visible)
  if (kuddus) {
    const kuddusVisibility = checkKuddusVisibility(teacherPosition, { row, col }, grid);
    if (kuddusVisibility) {
      score += 50;
    }
  }

  return score;
};

// ============================================
// STEP 3: Visibility Score
// ============================================
const calculateVisibilityScore = (row, col, grid, teacherPosition) => {
  let score = 0;
  const teacherRow = teacherPosition.row;

  // Students in front rows get higher visibility score
  if (row <= 1) score += 100;
  else if (row <= 2) score += 80;
  else if (row <= 3) score += 60;
  else score += 40;

  // Center columns are more visible
  const centerCol = Math.floor(grid[0].length / 2);
  const distanceFromCenter = Math.abs(col - centerCol);
  score += Math.max(0, 50 - distanceFromCenter * 10);

  return score;
};

// ============================================
// STEP 4: Accessibility Score
// ============================================
const calculateAccessibilityScore = (row, col) => {
  // Front rows are more accessible
  if (row === 0) return 100;
  if (row === 1) return 80;
  if (row === 2) return 60;
  if (row === 3) return 40;
  return 20;
};

// ============================================
// STEP 5: Teacher Distance Score
// ============================================
const calculateTeacherDistanceScore = (row, col, teacherPosition) => {
  const distance = Math.sqrt(
    Math.pow(row - teacherPosition.row, 2) +
    Math.pow(col - teacherPosition.col, 2)
  );
  return Math.max(0, 100 - distance * 10);
};

// ============================================
// STEP 6: Blocking Penalty
// ============================================
const calculateBlockingPenalty = (row, col, grid) => {
  let penalty = 0;

  // Check students in front
  for (let r = 0; r < row; r++) {
    const student = grid[r]?.[col];
    if (student && student.height > 170) {
      penalty += 20;
    }
    if (student && student.height > 180) {
      penalty += 30;
    }
  }

  return penalty;
};

// ============================================
// STEP 7: Kuddus Visibility Check
// ============================================
export const checkKuddusVisibility = (teacherPos, kuddusPos, grid) => {
  const { row: teacherRow } = teacherPos;
  const { row: kuddusRow, col: kuddusCol } = kuddusPos;

  // Check all rows between teacher and Kuddus
  for (let r = teacherRow + 1; r < kuddusRow; r++) {
    const student = grid[r]?.[kuddusCol];
    if (student && student.height && student.height >= 165) {
      return false; // Blocked by tall student
    }
  }

  return true; // Visible
};

// ============================================
// STEP 8: Find Best Kuddus Position
// ============================================
export const findBestKuddusPosition = (grid, kuddus, teacherPosition) => {
  let bestSeat = null;
  let maxScore = -Infinity;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === null) {
        const score = calculateSeatScore(
          { row: r, col: c },
          grid,
          kuddus,
          teacherPosition
        );
        if (score > maxScore) {
          maxScore = score;
          bestSeat = { row: r, col: c };
        }
      }
    }
  }

  return bestSeat;
};

// ============================================
// STEP 9: Place Accessibility Students
// ============================================
export const placeAccessibilityStudents = (grid, priorityStudents) => {
  const placed = [];

  priorityStudents.forEach(student => {
    // Find nearest front seat
    let found = false;
    for (let r = 0; r < 2 && !found; r++) {
      for (let c = 0; c < grid[0].length && !found; c++) {
        if (grid[r][c] === null) {
          grid[r][c] = { ...student, row: r, col: c };
          placed.push({ ...student, row: r, col: c });
          found = true;
        }
      }
    }
  });

  return placed;
};

// ============================================
// STEP 10: Fill Remaining Seats (Height-Based)
// ============================================
export const fillRemainingSeats = (grid, normalStudents) => {
  const sorted = [...normalStudents].sort((a, b) => a.height - b.height);
  const placed = [];
  let index = 0;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === null && index < sorted.length) {
        grid[r][c] = { ...sorted[index], row: r, col: c };
        placed.push({ ...sorted[index], row: r, col: c });
        index++;
      }
    }
  }

  return placed;
};

// ============================================
// STEP 11: Validate Seating Plan
// ============================================
export const validateSeatingPlan = (grid, teacherPosition, kuddus) => {
  const errors = [];

  // Check 1: Is Kuddus visible?
  if (kuddus) {
    const kuddusPos = findStudent(grid, kuddus);
    if (kuddusPos) {
      const visible = checkKuddusVisibility(teacherPosition, kuddusPos, grid);
      if (!visible) {
        errors.push('Kuddus is not visible to the teacher!');
      }
    }
  }

  // Check 2: Are priority students in front?
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const student = grid[r][c];
      if (student && student.needsFront && r > 1) {
        errors.push(`${student.name} needs front seat but is at row ${r}`);
      }
    }
  }

  // Check 3: Any blocked seats?
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === null) {
        // Empty seats are allowed
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ============================================
// HELPER: Find student in grid
// ============================================
const findStudent = (grid, student) => {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      const s = grid[r][c];
      if (s && s.id === student.id) {
        return { row: r, col: c };
      }
    }
  }
  return null;
};

// ============================================
// MAIN ALGORITHM: Generate Optimal Seating Plan
// ============================================
export const generateOptimalSeatingPlan = (students, rows = 5, columns = 6) => {
  // Step 1: Create empty grid
  const grid = Array(rows).fill(null).map(() => Array(columns).fill(null));

  // Step 2: Teacher position (front center)
  const teacherPosition = { row: -1, col: Math.floor(columns / 2) };

  // Step 3: Classify students
  const { priorityStudents, kuddus, normalStudents } = classifyStudents(students);

  // Step 4: Place accessibility students (front rows)
  placeAccessibilityStudents(grid, priorityStudents);

  // Step 5: Find best position for Kuddus
  if (kuddus.length > 0) {
    const bestSeat = findBestKuddusPosition(grid, kuddus[0], teacherPosition);
    if (bestSeat) {
      grid[bestSeat.row][bestSeat.col] = { ...kuddus[0], row: bestSeat.row, col: bestSeat.col };
    }
  }

  // Step 6: Fill remaining seats with normal students (height-based)
  fillRemainingSeats(grid, normalStudents);

  // Step 7: Validate the seating plan
  const validation = validateSeatingPlan(grid, teacherPosition, kuddus[0]);

  // Step 8: Return result
  return {
    grid,
    teacherPosition,
    validation,
    statistics: {
      totalStudents: students.length,
      placedStudents: grid.flat().filter(s => s !== null).length,
      emptySeats: rows * columns - students.length,
      rows,
      columns,
    },
  };
};

// ============================================
// EXPORT ALL FUNCTIONS
// ============================================
export default {
  classifyStudents,
  calculateSeatScore,
  checkKuddusVisibility,
  findBestKuddusPosition,
  placeAccessibilityStudents,
  fillRemainingSeats,
  validateSeatingPlan,
  generateOptimalSeatingPlan,
};