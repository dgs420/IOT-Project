const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");
const requireRole = require("../middleware/requireRole");

router.use(requireAuth);

router.get("/all-user", requireRole(["admin"]), userController.getAllUsers);
router.get(
  "/user-detail/:userId",
  requireRole(["admin"]),
  userController.getUserDetail
);
router.put(
  "/user-update/:userId",
  requireRole(["admin"]),
  userController.updateUser
);
router.delete("/:userId", requireRole(["admin"]), userController.deleteUser);
router.get("/profile", userController.getPersonalDetail);
router.put("/update", userController.updateProfile);
router.get("/balance", userController.getUserBalance);
router.put("/change-password", userController.changePassword);
router.put(
  "/admin-reset-password",
  requireRole(["admin"]),
  userController.changePasswordAsAdmin
);
module.exports = router;
