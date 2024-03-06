import User from "../models/User.js";

export async function updateUser(req, res, next) {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User deleted");
  } catch (err) {
    next(err);
  }
}

export async function getUser(req, res, next) {
  try {
    const getUser = await User.findById(req.params.id);
    res.status(200).json(getUser);
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const getAllUser = await User.find();
    res.status(200).json(getAllUser);
  } catch (err) {
    next(err);
  }
}
