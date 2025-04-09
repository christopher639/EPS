const express = require('express');
const router = express.Router();
const {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require('../Controllers/teacherController');

const isAdmin = require('../middleware/isAdmin');


// GET /api/teachers - Get all teachers (accessible to authenticated users)
router.get('/',  getAllTeachers);

// GET /api/teachers/:id - Get single teacher (accessible to authenticated users)
router.get('/:id', getTeacherById);

// POST /api/teachers - Create new teacher (admin only)
router.post(
  '/',
  

  createTeacher
);

// PUT /api/teachers/:id - Update teacher (admin only)
router.put(
  '/:id',

  

  updateTeacher
);

// DELETE /api/teachers/:id - Delete teacher (admin only)
router.delete(
  '/:id',
  
  deleteTeacher
);

module.exports = router;