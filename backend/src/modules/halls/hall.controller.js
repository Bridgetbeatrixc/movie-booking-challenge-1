import { Hall } from "./hall.model.js";

export async function listHalls(_req, res, next) {
  try {
    const halls = await Hall.find().sort({ name: 1 });
    res.json(halls);
  } catch (error) {
    next(error);
  }
}

export async function getHallById(req, res, next) {
  try {
    const hall = await Hall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({ message: "Hall not found" });
    }

    res.json(hall);
  } catch (error) {
    next(error);
  }
}

export async function createHall(req, res, next) {
  try {
    const hall = await Hall.create(req.body);
    res.status(201).json(hall);
  } catch (error) {
    next(error);
  }
}

export async function updateHall(req, res, next) {
  try {
    const hall = await Hall.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!hall) {
      return res.status(404).json({ message: "Hall not found" });
    }

    res.json(hall);
  } catch (error) {
    next(error);
  }
}

export async function deleteHall(req, res, next) {
  try {
    const hall = await Hall.findById(req.params.id);

    if (!hall) {
      return res.status(404).json({ message: "Hall not found" });
    }

    await hall.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
