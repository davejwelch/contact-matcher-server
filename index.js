const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let sessions = {}; // sessionId: { list1: [...], list2: [...], matchCount: N }

app.post("/session", (req, res) => {
  const { hashes } = req.body;
  if (!Array.isArray(hashes))
    return res.status(400).json({ error: "Invalid hashes" });

  const sessionId = uuidv4().slice(0, 8);
  sessions[sessionId] = { list1: hashes, list2: [], matchCount: 0 };
  res.json({ sessionId });
});

app.post("/session/:id", (req, res) => {
  const { hashes } = req.body;
  const session = sessions[req.params.id];
  if (!session) return res.status(404).json({ error: "Session not found" });

  session.list2 = hashes;
  const set1 = new Set(session.list1);
  const common = hashes.filter((h) => set1.has(h));
  session.matchCount = common.length;
  res.json({ matchCount: session.matchCount });
});

app.get("/session/:id", (req, res) => {
  const session = sessions[req.params.id];
  if (!session) return res.status(404).json({ error: "Session not found" });

  res.json({ matchCount: session.matchCount || 0 });
  delete sessions[req.params.id];
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get('/', (req, res) => {
  res.send('Server is working!');
});

