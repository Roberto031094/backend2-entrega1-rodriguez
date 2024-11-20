import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import dotenv from "dotenv";
import { userDao } from "../dao/mongo/user.dao.js";
import { createHash, isValidPassword } from "../utils/hashPassword.js";
import { cookieExtractor } from "../utils/cookieExtractor.js";
import { cartDao } from "../dao/mongo/cart.dao.js";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

dotenv.config();

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

export const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, age, role } = req.body;
  
          const user = await userDao.getByEmail(username);
          if (user) return done(null, false, { message: "El usuario ya existe" });
  
          const cart = await cartDao.create();
  
          const hashedPassword = await createHash(password); 
  
          const newUser = {
            first_name,
            last_name,
            age,
            email: username,
            password: hashedPassword, 
            role: role || "user",
            cart: cart._id,
          };
  
          const userRegister = await userDao.create(newUser);
  
          console.log("Usuario registrado con éxito:", userRegister);
          return done(null, userRegister);
        } catch (error) {
          console.error("Error en la estrategia 'register':", error);
          return done(error);
        }
      }
    )
  );
  
  
  

  passport.use(
    "login",
    new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
      try {
        const user = await userDao.getByEmail(username);
        if (!user || !isValidPassword(password, user.password)) {
          return done(null, false, { message: "Email o contraseña no válido" });
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userDao.getById(id);
      if (!user) {
        return done(null, false, { message: "Usuario no encontrado" });
      }
      done(null, user);
    } catch (error) {
      done(null, false, { message: "Error al deserializar usuario" });
    }
  });


  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET, 
      },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
  
};
