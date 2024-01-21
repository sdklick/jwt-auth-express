const express = require("express");
const jwt = require("jsonwebtoken");
var bodyParser = require("body-parser");

const app = express();
const PORT = 3000;
const SECRET_KEY = "your-secret-key";

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Sample user data (in a real-world scenario, you would use a database)
const users = [
  { id: 1, username: "user1", password: "sumanta" },
  { id: 2, username: "user2", password: "xuv700" },
];

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
}

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET_KEY
    );
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Protected route (requires valid JWT)
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    user: req.user,
  });
});

// Logout route (not necessary for JWT, as tokens are stateless, but included for completeness)
app.post("/logout", (req, res) => {
  // Perform any necessary logout actions (e.g., invalidate tokens on the server)
  res.json({ message: "Logout successful" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
