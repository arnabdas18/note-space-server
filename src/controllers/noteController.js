import Note from "../models/noteModel.js";

// @desc    Get logged in user notes
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
};

//@description     Create single Note
//@route           GET /api/notes/create
//@access          Private
const createNote = async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({
      message: "Please fill all the fields",
    });
  }
  const note = new Note({ user: req.user._id, title, content, category });

  const createdNote = await note.save();

  res.status(201).json({
    message: "Note created",
    result: {
      createdNote,
    },
  });
};

//@description     Fetch single Note
//@route           GET /api/notes/:id
//@access          Public
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    res.status(200).json({
      message: "Fetched required note",
      result: {
        note,
      },
    });
  } catch (error) {
    res.status(404).json({ message: "Note not found" });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const note = await Note.findById(req.params.id);

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "You can't perform this action",
      });
    }

    note.title = title;
    note.content = content;
    note.category = category;

    const updatedNote = await note.save();
    res.json({
      message: "Update successful",
      result: {
        updatedNote,
      },
    });
  } catch (error) {
    res.status(404).json({ message: "Note not found" });
  }
};

//@description     Delete single Note
//@route           GET /api/notes/:id
//@access          Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "You can't perform this action",
      });
    }

    await note.deleteOne();
    res.json({ message: "Note Removed" });
  } catch (error) {
    res.status(404).json({ message: "Note not Found", error: error.message });
  }
};

export { getNoteById, getNotes, createNote, deleteNote, updateNote };
