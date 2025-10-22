// database.js
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const mgclient = new MongoClient(process.env.MONGO_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
  if (db) return db; // reuse existing connection

  try {
    await mgclient.connect();
    db = mgclient.db("helloprojectdb"); // choose your database name
    console.log("✅ Connected to MongoDB!");
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    throw err;
  }
}

module.exports = connectDB;
