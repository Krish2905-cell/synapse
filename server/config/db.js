const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("[DB] Connecting...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("[DB] MongoDB connected successfully");
  } catch (err) {
    console.error("[DB] MongoDB connection error:", err.message);
  }
};

module.exports = connectDB;