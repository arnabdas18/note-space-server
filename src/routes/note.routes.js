import express from "express";
import {
  getNoteById,
  getNotes,
  createNote,
  deleteNote,
  updateNote,
} from "../controllers/noteController.js";
const noteRouter = express.Router();
import { protect } from "../middleware/auth.js";

noteRouter.route("/").get(protect, getNotes);
noteRouter.route("/create").post(protect, createNote);
noteRouter
  .route("/:id")
  .get(getNoteById)
  .delete(protect, deleteNote)
  .put(protect, updateNote);

export default noteRouter;
