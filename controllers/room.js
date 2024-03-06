import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

export async function createRoom(req, res, next) {
  const hotelId = req.params.hotelId;
  const newRoom = new Room(req.body);

  try {
    const saveRoom = await newRoom.save();
    try {
      const updateHotel = await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: saveRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(saveRoom);
  } catch (err) {
    next(err);
  }
}

export async function updateRoom(req, res, next) {
  try {
    const updateRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateRoom);
  } catch (err) {
    next(err);
  }
}

export async function updateRoomAvailability(req, res, next) {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: { "roomNumbers.$.unavailableDates": req.body.dates },
      }
    );

    res.status(200).json("Room status has been updated");
  } catch (err) {
    next(err);
  }
}

export async function deleteRoom(req, res, next) {
  const hotelId = req.params.hotelId;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room deleted");
  } catch (err) {
    next(err);
  }
}

export async function getRoom(req, res, next) {
  try {
    const getRoom = await Room.findById(req.params.id);
    res.status(200).json(getRoom);
  } catch (err) {
    next(err);
  }
}

export async function getRooms(req, res, next) {
  try {
    const getAllRoom = await Room.find();
    res.status(200).json(getAllRoom);
  } catch (err) {
    next(err);
  }
}
