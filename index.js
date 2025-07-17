const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let sessions = {
  "user1@example.com": [
    "2fc9c1f243cb5bdfc75818d5be798fa6f7f4f151c342bd9dc1f1c7c7a64bba24",
    "dbe5e25bdf5bc3010861b5e5ce1eaf218effe68b3859c00205f816e1efb46b8d",
    "3de7e3d7bba75a03d86b13d9493c76e318290da3e4e7a88f4c6633429a204bf0"
  ],
  "user2@example.com": [
    "dbe5e25bdf5bc3010861b5e5ce1eaf218effe68b3859c00205f816e1efb46b8d",
    "4aa6e3a3bba75a03d86b13d9493c76e318290da3e4e7a88f4c6633429a2abcd1"
  ]
};
 // sessionId: { list1: [...], list2: [...], matchCount: N }

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

