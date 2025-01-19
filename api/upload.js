const express = require("express");
const multer = require("multer");
const { fromBuffer } = require("file-type");
const fetch = require("node-fetch");
const FormData = require("form-data");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

let uploadedUrls = [];

// Fungsi untuk mengunggah foto ke Catbox
async function catbox(buffer) {
  try {
    const { ext } = await fromBuffer(buffer);
    const form = new FormData();
    form.append("fileToUpload", buffer, { filename: "file." + ext });
    form.append("reqtype", "fileupload");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: form,
    });

    const data = await res.text();
    return data;
  } catch (error) {
    console.error("Error uploading to Catbox:", error.message);
    throw error;
  }
}

// Endpoint untuk menangani unggahan gambar
router.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const photoUrl = await catbox(req.file.buffer);
    uploadedUrls.push(photoUrl);
    res.status(200).json({ success: true, url: photoUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// Endpoint untuk melihat semua URL foto
router.get("/stalking", (req, res) => {
  res.status(200).json({ photos: uploadedUrls });
});

module.exports = router;