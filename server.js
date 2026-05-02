const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const app = express();

// multer config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Only JPG/PNG files allowed"));
    }
  }
});

// AWS config
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-south-1"
});

const s3 = new AWS.S3();

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    console.log(`Handled by PORT ${PORT}`);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 🔥 Resize image before upload
    const resizedBuffer = await sharp(req.file.buffer)
      .resize(300, 300)   // you can change size
      .toBuffer();

    const key = `${Date.now()}-${uuidv4()}-${req.file.originalname}`;

    const params = {
      Bucket: "image-upload-akash863",
      Key: key,
      Body: resizedBuffer,
      ContentType: req.file.mimetype
    };

    // upload to S3
    await s3.upload(params).promise();

    // 🔥 Generate signed URL (valid for 1 minute)
    const signedUrl = s3.getSignedUrl("getObject", {
      Bucket: "image-upload-akash863",
      Key: key,
      Expires: 60
    });

    res.json({
      url: signedUrl,
      handledBy: PORT
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});