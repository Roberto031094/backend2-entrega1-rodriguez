import { request, response } from "express";

export const authorization = (roles = ["user"]) => {
  return async (req = request, res = response, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          msg: "Unauthorized: No user found in the request. Ensure you are logged in.",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          status: "error",
          msg: `No permission: User role '${req.user.role}' is not authorized to access this route.`,
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        status: "error",
        msg: "Internal Server Error",
        error: error.message,
      });
    }
  };
};
