const authService = require("../services/authService");

exports.createUser = async (req, res) => {
  try {
    const result = await authService.createUser(req.body);
    res.status(201).json({ code: 200, message: "User created" });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({ code: 200, message: "Sign up success" });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const info = await authService.login(req.body);
    res.json({ code: 200, message: "Log in success", info });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const info = await authService.loginAdmin(req.body);
    res.json({ code: 200, message: "Log in success", info });
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ code: error.code || 500, message: error.message });
  }
};
