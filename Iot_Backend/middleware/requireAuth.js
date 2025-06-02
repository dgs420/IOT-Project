const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            code: 401,
            message: "Authorization token required"
        });
    }

    const token = authorization.split(" ")[1];

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            where: { user_id: req.user.user_id },
            attributes: ["user_id","role"]
        });

        if (!user) {
            return res.status(401).json({
                code: 401,
                message: "User not found"
            });
        }

        req.user = user;
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
