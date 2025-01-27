const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { CustomError } = require("../middlewares/errorMiddleware");

const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        throw new CustomError("User not found", 404);
      }

      next();
    } else {
      throw new CustomError("Not authorized, no token provided", 401);
    }
  } catch (error) {
    next(
      error instanceof CustomError
        ? error
        : new CustomError("Not authorized, token failed", 401, error.message)
    );
  }
};

module.exports = protect;
