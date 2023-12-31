import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../util/generateToken.js";

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await User.findOne({ email });
    if (userFound) {
      try {
        const authStatus = await bcrypt.compare(password, userFound.password);

        if (authStatus) {
          const token = generateToken(userFound._id);

          return res.status(200).json({
            message: "Logged In",
            result: {
              _id: userFound._id,
              name: userFound.name,
              email: userFound.email,
              isAdmin: userFound.isAdmin,
              pic: userFound.pic,
              token,
            },
          });
        } else {
          return res.status(403).json({
            message: "Invalid Email or Password",
          });
        }
      } catch (error) {
        res.status(500).json({
          message: "Password comparing error",
          error,
        });
      }
    } else {
      return res.status(401).json({
        message: "User not registered",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error,
    });
  }
};

//@description     Register new user
//@route           POST /api/users/
//@access          Public
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(403).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await new User({
      ...req.body,
      password: hashedPassword,
    }).save();

    res.status(201).json({
      message: "User register successful",
      result: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        pic: newUser.pic,
        token: generateToken(newUser._id),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "User register unsuccessful",
      error: error.message,
    });
  }
};

// @desc    GET user profile
// @route   GET /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.pic = req.body.pic || user.pic;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      return res.json({
        message: "User updated",
        result: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          pic: updatedUser.pic,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser._id),
        },
      });
    } else {
      return res.status(404).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { authUser, registerUser, updateUserProfile };
