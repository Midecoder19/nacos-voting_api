const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const xlsx = require('xlsx');
const brevo = require('@getbrevo/brevo');
const dotenv = require('dotenv');
const Student = require('./models/Student');

dotenv.config();

// Brevo setup
const emailApi = new brevo.TransactionalEmailsApi();
emailApi.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

// Read Excel file
const workbook = xlsx.readFile('students.xls');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const students = xlsx.utils.sheet_to_json(sheet);

// 🧪 TEST MODE (true = send to first 2 students only)
const TEST_MODE = false;

async function populateStudents() {
  try {
    // ✅ Connect to DB inside function
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000
    });
    console.log("✅ MongoDB connected");

    // Count students first
    const count = await Student.countDocuments();
    console.log("👀 Total students in DB:", count);

    // 1️⃣ Wipe old students
    await Student.deleteMany({});
    console.log("🗑️ Old students deleted");

    // 2️⃣ Slice if test mode
    const targetStudents = TEST_MODE ? students.slice(0, 2) : students;

    for (const studentData of targetStudents) {
      try {
        // Generate random password
        const password = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save student
        const student = new Student({
          matricNumber: studentData.matricNumber,
          fullName: studentData.fullName,
          level: studentData.level,
          nacosId: studentData.nacosId,
          email: studentData.email,
          password: hashedPassword
        });
        await student.save();

        // ✉️ Build email
        const email = new brevo.SendSmtpEmail();
        email.sender = { email: process.env.SENDER_EMAIL, name: "NACOS Voting System" };
        email.replyTo = { email: process.env.SENDER_EMAIL, name: "NACOS TECH TEAM" };
        email.to = [{ email: studentData.email }];
        email.subject = "NACOS E-Voting Login Details";

        email.textContent = `
Dear ${studentData.fullName},

Your account has been successfully created for the NACOS E-Voting system.

Login Details:
- Matric Number: ${studentData.matricNumber}
- Level: ${studentData.level}
- NACOS ID: ${studentData.nacosId}
- Password: ${password}

How to Log In:
1. Go to https://nacostpi-e-vote.vercel.app/
2. Enter your Matric Number and Level.
3. Enter your NACOS ID and Password.
4. Cast your vote.

Please keep your password safe. For help, email midecoder1@gmail.com or hamzatabdulaleem123@gmail.com.

Best regards,
NACOS E-Voting Team
SOFTWARE TEAM
        `;

        email.htmlContent = `
          <p>Dear <b>${studentData.fullName}</b>,</p>
          <p>Your account has been successfully created for the <b>NACOS E-Voting system</b>.</p>
          <p><b>Login Details:</b></p>
          <ul>
            <li><b>Matric Number:</b> ${studentData.matricNumber}</li>
            <li><b>Level:</b> ${studentData.level}</li>
            <li><b>NACOS ID:</b> ${studentData.nacosId}</li>
            <li><b>Password:</b> ${password}</li>
          </ul>
          <h3>How to Log In:</h3>
          <ol>
            <li>Go to <a href="https://nacostpi-e-vote.vercel.app/">https://nacostpi-e-vote.vercel.app/</a></li>
            <li>Enter your Matric Number and Level.</li>
            <li>Enter your NACOS ID and Password.</li>
            <li>Cast your vote.</li>
          </ol>
          <p><b>Important:</b> Keep your password safe. If you need help, contact 
            <a href="mailto:midecoder1@gmail.com">midecoder1@gmail.com</a> or 
            <a href="mailto:hamzatabdulaleem123@gmail.com">hamzatabdulaleem123@gmail.com</a>.
          </p>
          <p>Thank you for being part of NACOS.<br/>
          Best regards,<br/>
          <b>NACOS E-Voting Team</b><br/>
          SOFTWARE TEAM</p>
        `;

        await emailApi.sendTransacEmail(email);
        console.log(`📧 Email sent to ${studentData.email}`);

      } catch (err) {
        console.error("❌ Error for student:", studentData.matricNumber, err.message);
      }
    }

    console.log(TEST_MODE ? "✅ Test mode finished (2 emails sent)" : "🎉 All students emailed successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error wiping students:", err.message);
  }
}

populateStudents();
