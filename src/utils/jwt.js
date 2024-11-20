import jwt from "jsonwebtoken";

// Usamos una clave secreta desde una variable de entorno (mejor práctica)
const SECRET_KEY = process.env.JWT_SECRET || "defaultSecret";

// Función que crea el token
export const createToken = (user) => {
  const { id, email, role } = user;
  const token = jwt.sign({ id, email, role }, SECRET_KEY, { expiresIn: "5m" }); 
  return token;
};

// Función que verifica el token
export const verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, SECRET_KEY); 
    return decode;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return { status: "error", msg: "Token expired" };
    }
    console.error("Token verification failed:", error.message);
    return null;
  }
};

