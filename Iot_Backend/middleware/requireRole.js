const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        const { user } = req;
        // console.log(user);
        if (!user || !allowedRoles.includes(user.role)) {
            return res.status(403).json({
                code: 401,
                message: 'Access denied: insufficient permissions',
            });
        }

        next(); // User has the required role, proceed to the next middleware or controller
    };
};
module.exports = requireRole;
