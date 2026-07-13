import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Rule from '../models/Rule.js';
import Student from '../models/Student.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Rule.deleteMany({});
    await Student.deleteMany({});

    console.log('🗑️ Existing data cleared');

    // Seed Rules
    const rules = [
      {
        title: 'Homework Policy',
        content: 'All students must complete homework regardless of position.',
        category: 'academic',
        source: 'School Rulebook',
        section: 'Section 3.2',
        keywords: ['homework', 'captain', 'assignment'],
      },
      {
        title: 'Washroom Access',
        content: 'Washroom access is free for all students at all times.',
        category: 'general',
        source: 'School Rulebook',
        section: 'Section 7.1',
        keywords: ['washroom', 'bribe', 'toll'],
      },
      {
        title: 'Captain Authority',
        content: 'Only teachers can assign homework. Captains have no authority.',
        category: 'academic',
        source: 'School Rulebook',
        section: 'Section 4.3',
        keywords: ['captain', 'authority', 'homework'],
      },
      {
        title: 'School Timing',
        content: 'School starts at 9:00 AM. Students must be present by 8:45 AM.',
        category: 'general',
        source: 'School Rulebook',
        section: 'Section 1.1',
        keywords: ['time', 'start', 'morning'],
      },
      {
        title: 'Seating Policy',
        content: 'Students cannot be forced to sit in specific rows.',
        category: 'conduct',
        source: 'School Rulebook',
        section: 'Section 5.2',
        keywords: ['seat', 'row', 'height'],
      },
      {
        title: 'Tiffin Policy',
        content: 'Tiffin theft is strictly prohibited.',
        category: 'safety',
        source: 'School Rulebook',
        section: 'Section 6.3',
        keywords: ['tiffin', 'food', 'steal'],
      },
    ];

    for (const rule of rules) {
      await Rule.create(rule);
    }

    console.log('✅ Rules seeded: ' + rules.length);

    // Seed Users
    const salt = await bcrypt.genSalt(10);
    
    const users = [
      // Students
      {
        name: 'Rahim',
        email: null,
        password: await bcrypt.hash('ABC123', salt),
        role: 'student',
        rollNumber: '101',
        secretCode: 'ABC123',
        height: 175,
      },
      {
        name: 'Karim',
        email: null,
        password: await bcrypt.hash('XYZ789', salt),
        role: 'student',
        rollNumber: '102',
        secretCode: 'XYZ789',
        height: 182,
      },
      {
        name: 'Salma',
        email: null,
        password: await bcrypt.hash('DEF456', salt),
        role: 'student',
        rollNumber: '103',
        secretCode: 'DEF456',
        height: 165,
      },
      {
        name: 'Kodu Kuddus',
        email: 'kuddus@school.com',
        password: await bcrypt.hash('kuddus123', salt),
        role: 'student',
        rollNumber: '01',
        secretCode: 'KUDDUS123',
        height: 165,
        isKuddus: true,
      },
      // Teacher
      {
        name: 'Rashid Sir',
        email: 'teacher@school.com',
        password: await bcrypt.hash('teacher123', salt),
        role: 'teacher',
        rollNumber: 'T001',
      },
      // Captains
      {
        name: 'Biltu',
        email: 'biltu@demo.com',
        password: await bcrypt.hash('biltu123', salt),
        role: 'captain',
        rollNumber: 'C001',
        height: 160,
        needsFront: true,
      },
      {
        name: 'Miltu',
        email: 'miltu@demo.com',
        password: await bcrypt.hash('miltu123', salt),
        role: 'captain',
        rollNumber: 'C002',
        height: 158,
        needsFront: true,
      },
    ];

    for (const user of users) {
      await Student.create(user);
    }

    console.log('✅ Users seeded: ' + users.length);
    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('  Student 1: Roll: 101 | Secret: ABC123');
    console.log('  Student 2: Roll: 102 | Secret: XYZ789');
    console.log('  Student 3: Roll: 103 | Secret: DEF456');
    console.log('  Teacher: teacher@school.com | password: teacher123');
    console.log('  Captain: biltu@demo.com | password: biltu123');
    console.log('  Captain: miltu@demo.com | password: miltu123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();