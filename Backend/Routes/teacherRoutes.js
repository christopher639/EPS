const express = require('express');
const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require('../Controllers/teacherController');

const authenticateUser = require('../middleware/authenticateUser');
const isAdmin = require('../middleware/isAdmin');
const router = express.Router();
router.get('/', getAllTeachers); // GET /api/teachers
router.get('/:id', getTeacherById); // GET /api/teachers/:id
router.post('/',authenticateUser,isAdmin, createTeacher); // POST /api/teachers
router.put('/:id',authenticateUser,isAdmin, updateTeacher); // PUT /api/teachers/:id
router.delete('/:id',authenticateUser,isAdmin, deleteTeacher); // DELETE /api/teachers/:id
module.exports = router;
