import { request, response } from "express";
import passport from "passport";

export const passportCall = (strategy) => {
  return async (req = request, res = response, next) => {
    try {
      passport.authenticate(strategy, (err, user, info) => {
        if (err) {
          console.error("Error en passport:", err);
          return res.status(500).json({
            status: "error",
            msg: "Error en la autenticación",
            details: err.message,
          });
        }
        if (!user) {
          console.error("Error de autenticación:", info);
          const errorMessage = info?.message || "Unauthorized access";
          return res.status(401).json({
            status: "error",
            msg: errorMessage,
            details: info,
          });
        }
      
        req.user = user;
        next();
      })(req, res, next);
      
    } catch (error) {
      return res.status(500).json({
        status: "error",
        msg: "Unexpected error during authentication",
        details: error.message,
      });
    }
  };
};

