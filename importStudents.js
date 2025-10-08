const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const Student = require('./models/Student');

dotenv.config();

async function addManualStudents() {
  try {
    // ✅ Connect DB
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000
    });
    console.log("✅ MongoDB connected");

    // 🔽 Replace with your 10 manual students
    const manualStudents = [
      { matricNumber: "202345895", level: "HND1", nacosId: "0001", email: "oladaposamuel94@gmail.com" },
      // ...add up to 10
    ];

    for (const studentData of manualStudents) {
      try {
        // Generate password
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save student
        const student = new Student({
          matricNumber: studentData.matricNumber,
          level: studentData.level,
          nacosId: studentData.nacosId,
          email: studentData.email,
          password: hashedPassword
        });

        await student.save();

        // 🎉 Log credentials instead of sending email
        console.log(`
===========================
📧 Student Added:
- Email: ${studentData.email}
- Matric Number: ${studentData.matricNumber}
- NACOS ID: ${studentData.nacosId}
- Level: ${studentData.level}
- Password: ${password}
===========================
        `);

      } catch (err) {
        console.error(`❌ Error adding student: ${studentData.email} -> ${err.message}`);
      }
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

addManualStudents();
