import User from "../models/User.js";
import bcrypt from "bcrypt";
import createError from "../utils/error.js";
import jwt from "jsonwebtoken";

//Register
export async function register(req, res, next) {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).json("userCreated");
  } catch (err) {
    next(err);
  }
}

//Login
export async function login(req, res, next) {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return next(createError(404, "user not found"));
    }
    const isPasswordCrt = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCrt) {
      return next(createError(400, "wrong password or username"));
    }
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...others } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({ details: { ...others }, isAdmin });
  } catch (err) {
    next(err);
  }
}
