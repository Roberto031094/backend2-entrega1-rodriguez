import { userModel } from "./models/user.model.js";

class UserDao {
  async getAll() {
    try {
      const users = await userModel.find();
      return users;
    } catch (error) {
      throw new Error(`Error al obtener todos los usuarios: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const user = await userModel.findById(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      return user;
    } catch (error) {
      throw new Error(`Error al obtener el usuario por ID: ${error.message}`);
    }
  }

  async getByEmail(email, populateCart = true) {
    try {
      const query = userModel.findOne({ email });
      if (populateCart) {
        query.populate("cart");
      }
      const user = await query;
      // En lugar de lanzar un error, devuelve null si no se encuentra el usuario
      return user || null;
    } catch (error) {
      throw new Error(`Error al obtener el usuario por email: ${error.message}`);
    }
  }
  

  async create(data) {
    try {
      if (!data.email || !data.password) {
        throw new Error("El correo electrónico y la contraseña son obligatorios");
      }
      const user = await userModel.create(data);
      return user;
    } catch (error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      const userUpdate = await userModel.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!userUpdate) {
        throw new Error("Usuario no encontrado para actualizar");
      }
      return userUpdate;
    } catch (error) {
      throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
  }

  async deleteOne(id) {
    try {
      const user = await userModel.findById(id);
      if (!user) {
        throw new Error("Usuario no encontrado");
      }
      await userModel.deleteOne({ _id: id });
      return { message: "Usuario eliminado con éxito" };
    } catch (error) {
      throw new Error(`Error al eliminar el usuario: ${error.message}`);
    }
  }
}

export const userDao = new UserDao();
