import { request, response } from "express";
import { productDao } from "../dao/mongo/product.dao.js";

export const checkProductData = async (req = request, res = response, next) => {
  try {
    const { title, description, price, code, stock, category } = req.body;

    const newProduct = { title, description, price, code, stock, category };

    // Campos obligatorios
    const checkData = Object.values(newProduct).some(
      (field) => field === undefined || field === null || field.toString().trim() === ""
    );
    if (checkData) {
      return res.status(400).json({ status: "error", msg: "Todos los datos son obligatorios" });
    }

    // Código del producto
    const productExists = await productDao.getByCode(code);
    if (productExists) {
      return res
        .status(400)
        .json({ status: "error", msg: `El producto con el código ${code} ya existe` });
    }

    next();
  } catch (error) {
    console.error(error); 
    res.status(500).json({ status: "error", msg: "Error interno del servidor", error: error.message });
  }
};

