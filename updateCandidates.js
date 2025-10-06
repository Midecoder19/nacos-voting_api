const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Candidate = require('./models/Candidate');
const cloudinary = require('cloudinary').v2;

// 🔹 Cloudinary Config
cloudinary.config({
  cloud_name: 'dskcozshj',
  api_key: '646348539818218',
  api_secret: 'HPexqFGocdIpUwxHm2u0gKIISPY'
});

// 🔹 Load new candidates from JSON
const candidatesData = JSON.parse(fs.readFileSync('./newCandidates.json', 'utf-8'));

const updateCandidates = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect('mongodb+srv://midecoder:midecoder555@voting.bgf6z9h.mongodb.net/voting?retryWrites=true&w=majority');

    // 2. Delete old candidates
    await Candidate.deleteMany({});
    console.log('🗑️ Old candidates deleted');

    // 3. Insert new candidates-/5
    for (const cand of candidatesData) {
      const filePath = path.resolve(cand.photo);

      // Check file exists before upload
      if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        continue;
      }

      // Upload to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        folder: 'candidates'
      });

      await Candidate.create({
        name: cand.name,
        position: cand.position,
        photoUrl: uploadResult.secure_url,
        votes: 0
      });

      console.log(`✅ Added ${cand.name} (${cand.position})`);
    }

    // 4. Disconnect
    await mongoose.disconnect();
    console.log('🎉 Candidates updated successfully!');
  } catch (error) {
    console.error('❌ Error updating candidates:', error.message);
  }
};

updateCandidates();
