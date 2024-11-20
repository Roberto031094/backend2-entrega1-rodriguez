import { Router } from "express";
import { userDao } from "../dao/mongo/user.dao.js";
import { checkEmail } from "../middlewares/checkEmail.middleware.js";
import passport from "passport";
import { createToken } from "../utils/jwt.js";
import { passportCall } from "../middlewares/passport.middleware.js";
import { authorization } from "../middlewares/authorization.middleware.js";

const router = Router();

router.post("/register", checkEmail, passportCall("register"), async (req, res) => {
  try {
    res.status(201).json({ status: "success", msg: "Usuario registrado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.post("/login", passportCall("login"), async (req, res) => {
  try {
    const token = createToken(req.user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "strict",
    });

    res.status(200).json({
      status: "success",
      msg: "Usuario autenticado con éxito",
      payload: req.user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.get("/logout", passportCall("jwt"), async (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie("token");
    res.status(200).json({ status: "success", msg: "Sesión cerrada con éxito" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});

router.get("/current", passportCall("jwt"), authorization("user"), async (req, res) => {
  try {
    const user = await userDao.getById(req.user.id);
    res.status(200).json({ status: "success", payload: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", msg: "Error interno del servidor" });
  }
});


export default router;

