const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  res.json({ message: "User registered successfully" });
};

exports.login = (req, res) => {
  const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });

  res.json({ token });
};

exports.me = (req, res) => {
  res.json({
    id: req.user.id,
    name: "Demo User",
    email: "demo@email.com"
  });
};
