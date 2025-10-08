const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const Student = require('./models/Student');

dotenv.config();

async function addManualStudents() {
  try {
    // ✅ Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000
    });

    console.log("✅ MongoDB connected");

    // 🔽 Add your manual students here (up to 10 or more)
    const manualStudents = [
      { matricNumber: "4444", level: "HND1", nacosId: "3331", email: "wale@gmail.com" },
      
      // ...add more
    ];

    for (const studentData of manualStudents) {
      try {
        // 🔒 Check if student already exists
        const existing = await Student.findOne({ nacosId: studentData.nacosId, level: studentData.level });
        if (existing) {
          console.log(`⚠️  Skipped: Student with NACOS ID ${studentData.nacosId} already exists.`);
          continue;
        }

        // 🔐 Generate random password and hash
        const rawPassword = Math.random().toString(36).slice(-8); // e.g. 'k92jd1qf'
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        // 🧑 Create and save student
        const student = new Student({
          ...studentData,
          password: hashedPassword
        });

        await student.save();

        // ✅ Log result
        console.log(`
===========================
✅ Student Added:
- Email: ${student.email}
- Matric Number: ${student.matricNumber}
- NACOS ID: ${student.nacosId}
- Level: ${student.level}
- Password: ${rawPassword}
===========================
        `);
      } catch (err) {
        console.error(`❌ Error adding ${studentData.email}: ${err.message}`);
      }
    }

    // 🔒 Close connection
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");

  } catch (err) {
    console.error("❌ Connection Error:", err.message);
  }
}

addManualStudents();
