const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const multer = require("multer");
const path = require("path");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

app.post("/separate", upload.single("audioFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No audio file uploaded" });
  }

  const inputFile = path.join(__dirname, req.file.path);
  const outputDir = path.join(__dirname, "separated");

  const pythonProcess = spawn("python3", [
    path.join(__dirname, "demucs_wrapper.py"),
    inputFile,
    outputDir,
  ]);

  let data = "";
  let error = "";

  pythonProcess.stdout.on("data", (chunk) => {
    data += chunk.toString();
  });

  pythonProcess.stderr.on("data", (chunk) => {
    error += chunk.toString();
  });


  pythonProcess.on("close", (code) => {
    if (code === 0) {
        let json_data = JSON.parse(data);
        console.log("demucs finished");
      res.json(json_data);
    } else {
        console.log("demucs error");
       res.status(500).json({ error: "Demucs script failed", details: error });
    }
  });
});


app.listen(port, () => console.log(`Server running on port ${port}`));