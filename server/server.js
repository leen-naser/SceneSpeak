const express = require("express");
const analyzeRouter = require("./routes/analyze");

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("SceneSpeak backend is running!");
});

app.use("/analyze", analyzeRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});