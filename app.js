const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/api", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

app.post("/api/posts", verifyToken,(req, res) => {
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "Post created",
        authData,
      });
    }
  });
});

app.post("/api/login",  (req, res) => {
  // Mock User
  const user = {
    id: 1,
    username: "brad",
    email: "brad@gmail.com",
  };

  jwt.sign({ user }, "secretkey", {expiresIn: '30s'}, (error, token) => {
    res.json({
      token,
    });
  });
});

// Verify Token
function verifyToken(req, res, next) {
  // Get Auth header value
  const bearerHeader = req.headers["authorization"];

  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at space
    const bearer = bearerHeader.split(' ');
    // Get token from arr
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }


}

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
