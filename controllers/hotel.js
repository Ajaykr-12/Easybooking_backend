import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export async function createHotel(req, res, next) {
  const newHotel = new Hotel(req.body);
  try {
    const createHotel = await newHotel.save();
    res.status(200).json(createHotel);
  } catch (err) {
    next(err);
  }
}

export async function updateHotel(req, res, next) {
  try {
    const updateHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateHotel);
  } catch (err) {
    next(err);
  }
}

export async function deleteHotel(req, res, next) {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("hotel deleted");
  } catch (err) {
    next(err);
  }
}

export async function getHotel(req, res, next) {
  try {
    const getHotle = await Hotel.findById(req.params.id);
    res.status(200).json(getHotle);
  } catch (err) {
    next(err);
  }
}

export async function getHotels(req, res, next) {
  const { min, max, limit, ...others } = req.query;
  try {
    const getAllHotel = await Hotel.find({
      ...others,
      cheapestPrice: { $gte: min || 1, $lte: max || 99999999 },
    }).limit(limit);
    res.status(200).json(getAllHotel);
  } catch (err) {
    next(err);
  }
}

export async function countByCity(req, res, next) {
  const cities = req.query.cities.split(",");
  try {
    const cityCount = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(cityCount);
  } catch (err) {
    next(err);
  }
}

export async function countByType(req, res, next) {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const aparmentCount = await Hotel.countDocuments({ type: "aparment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "aparment", count: aparmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
    ]);
  } catch (err) {
    next(err);
  }
}

export async function getHotelRooms(req, res, next) {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
}
