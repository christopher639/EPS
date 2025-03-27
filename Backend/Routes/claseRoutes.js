const express = require("express");
const router = express.Router();
const claseController = require("../Controllers/claseController");


router.post("/", claseController.createClase);
router.get("/", claseController.getAllClases);
router.get("/:id", claseController.getClaseById);
router.put("/:id",  claseController.updateClase);
router.delete("/:id", claseController.deleteClase);
router.get("/:claseId/students", claseController.getStudentsByClase);

module.exports = router;
