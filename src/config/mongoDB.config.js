import mongoose from "mongoose";

export const connectMongoDB = async () => {
  try {
      mongoose.connect("mongodb+srv://rodriguezriosroberto:xOBEX1QIXrdxNZNC@cluster0.3ctnd.mongodb.net/")
      console.log("Conectado a MongoDB");
  } catch (error) {
    console.log(`Error: ${error}`);
  }
}