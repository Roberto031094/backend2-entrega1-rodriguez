import bcrypt from 'bcrypt';

export const createHash = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Error al generar el hash de la contraseña");
  }
};

export const isValidPassword = async (password, userPassword) => {
  try {
    return await bcrypt.compare(password, userPassword);
  } catch (error) {
    throw new Error("Error al comparar la contraseña");
  }
};



