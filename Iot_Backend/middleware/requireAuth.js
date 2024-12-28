const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
    // Verify authentication
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            code: 401,
            message: "Authorization token required"
        });
    }

    console.log(authorization);
    const token = authorization.split(" ")[1];

    try {
        // Verify JWT
        const {user_id}  = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", user_id);

        const user = await User.findOne({
            where: { user_id },
            attributes: ["user_id"] // Fetch only the user_id field
        });

        if (!user) {
            return res.status(401).json({
                code: 401,
                message: "User not found"
            });
        }

        req.user = user; // Attach user object to request
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({
            code: 401,
            message: "Request not authorized"
        });
    }
};

module.exports = requireAuth;