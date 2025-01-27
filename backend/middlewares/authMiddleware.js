const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { CustomError } = require("../middlewares/errorMiddleware");

const verifyToken = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1] || req.cookies?.token;

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (Date.now() >= decoded.exp * 1000) {
        throw new CustomError("Token expired", 401);
      }

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

const verifyRole = (requiredRoles) => {
  return (req, res, next) => {
    try {
      const roles = Array.isArray(requiredRoles)
        ? requiredRoles
        : [requiredRoles];

      if (!roles.includes(req.user.role)) {
        throw new CustomError(
          `Access denied: Requires one of the following roles - ${roles.join(
            ", "
          )}`,
          403
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = { verifyToken, verifyRole };
