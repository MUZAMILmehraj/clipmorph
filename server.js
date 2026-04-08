require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Razorpay = require("razorpay");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Static folder for clips
app.use("/clips-files", express.static(path.join(__dirname, "clips")));

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// 2. Route to fetch clips
app.get("/clips/:type", (req, res) => {
    const type = req.params.type;
    const folderPath = path.join(__dirname, "clips", type);

    if (!fs.existsSync(folderPath)) {
        return res.json({ clips: [] });
    }

    const files = fs.readdirSync(folderPath);
    const clips = files
        .filter(file => file.endsWith(".mp4"))
        .map(file => ({
            name: file,
            price: type === "vfx" ? 15 : 19,
            url: `${req.protocol}://${req.get('host')}/clips-files/${type}/${file}`
        }));

    res.json({ clips });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server active on port ${PORT}`));