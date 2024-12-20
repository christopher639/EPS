const express = require("express");
const router = express.Router();
const streamController = require("../Controllers/streamControllers");
// CREATE - Add a new stream
router.post("/", streamController.createStream);
// READ - Get all streams
router.get("/", streamController.getAllStreams);
// READ - Get a single stream by ID
router.get("/:id", streamController.getStreamById);
// UPDATE - Update a stream
router.put("/:id", streamController.updateStream);
// DELETE - Delete a stream
router.delete("/:id", streamController.deleteStream);
module.exports = router;
