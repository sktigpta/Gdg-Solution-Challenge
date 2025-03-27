const mongoose = require("mongoose");

const connectDB = async () => {
    try {
      const conn=  await mongoose.connect(`${process.env.MONGO_URI}/gdg`);

        console.log("MongoDB Connected Successfully",conn.connection.host);
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1); 
    }
};

module.exports = connectDB;
