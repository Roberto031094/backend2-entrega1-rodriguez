import { request, response } from "express";
import { userDao } from "../dao/mongo/user.dao.js";

export const checkEmail = async (req = request, res = response, next) => {
  try {
    const { email } = req.body;

    // Validar email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res
        .status(400)
        .json({ status: "error", msg: "Por favor, proporciona un email válido" });
    }

    // Verificar el usuario
    const user = await userDao.getByEmail(email);
    if (user) {
      return res
        .status(400)
        .json({
          status: "error",
          msg: `El usuario con el email ${email} ya existe`,
        });
    }

    next();
  } catch (error) {
    console.error(error); 
    res.status(500).json({
      status: "error",
      msg: "Error interno del servidor",
      error: error.message,
    });
  }
};
