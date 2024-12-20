const Stream = require("../models/streamModel");
// CREATE - Add a new stream
exports.createStream = async (req, res) => {
  try {
    const stream = new Stream(req.body);
    await stream.save();
    res.status(201).json({
      message: "Stream created successfully",
      stream,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating stream",
      error: error.message,
    });
  }
};

// READ - Get all streams
exports.getAllStreams = async (req, res) => {
  try {
    const streams = await Stream.find();
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching streams",
      error: error.message,
    });
  }
};

// READ - Get a single stream by ID
exports.getStreamById = async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) {
      return res.status(404).json({
        message: "Stream not found",
      });
    }
    res.status(200).json(stream);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching stream",
      error: error.message,
    });
  }
};

// UPDATE - Update a stream's details
exports.updateStream = async (req, res) => {
  try {
    const stream = await Stream.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stream) {
      return res.status(404).json({
        message: "Stream not found",
      });
    }
    res.status(200).json({
      message: "Stream updated successfully",
      stream,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating stream",
      error: error.message,
    });
  }
};

// DELETE - Delete a stream
exports.deleteStream = async (req, res) => {
  try {
    const stream = await Stream.findByIdAndDelete(req.params.id);
    if (!stream) {
      return res.status(404).json({
        message: "Stream not found",
      });
    }
    res.status(200).json({
      message: "Stream deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting stream",
      error: error.message,
    });
  }
};
