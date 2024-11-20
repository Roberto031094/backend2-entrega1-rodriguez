import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import dotenv from "dotenv";

dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET); 

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET no está definido. Verifica tu archivo .env");
}


export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.token; 
  }
  return token;
};

const secretKey = process.env.JWT_SECRET;

if (!secretKey) {
  throw new Error("JWT_SECRET no está definido. Verifica tu archivo .env");
}

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: secretKey,
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

