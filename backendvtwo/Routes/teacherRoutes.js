const express = require('express');
const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require('../Controllers/teacherController');
const router = express.Router();
router.get('/', getAllTeachers); // GET /api/teachers
router.get('/:id', getTeacherById); // GET /api/teachers/:id
router.post('/', createTeacher); // POST /api/teachers
router.put('/:id', updateTeacher); // PUT /api/teachers/:id
router.delete('/:id', deleteTeacher); // DELETE /api/teachers/:id
module.exports = router;
