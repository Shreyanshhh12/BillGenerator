const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve frontend and PDFs
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/invoices", express.static(path.join(__dirname, "..", "invoices")));

// Upload logic
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "invoices")),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  console.log("✅ Uploaded:", req.file.originalname);
  res.send("✅ Invoice saved to server.");
});

app.get("/invoices", (req, res) => {
  const dir = path.join(__dirname, "..", "invoices");
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).send("❌ Cannot list invoices.");
    res.json(files.filter(f => f.endsWith(".pdf")));
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
