import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./src/util/dbConnect.js";
import userRouter from "./src/routes/user.routes.js";

const app = express();

dotenv.config();

app.use(cors());

app.use(express.json());

app.use("/api/users", userRouter);

(async () => {
  try {
    await dbConnect();

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port: ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
