import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Successful connection to DB");
  } catch (error) {
    console.log("Unsuccessful connection to DB");
    console.log(error.message);
  }
};

export default dbConnect;
