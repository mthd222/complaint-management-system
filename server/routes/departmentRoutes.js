const express = require('express');
const router = express.Router();
const { createDepartment, getAllDepartments, getAllStaff } = require('../controllers/departmentController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are admin-protected
router.post('/', protect, admin, createDepartment);
router.get('/', protect,  getAllDepartments);
router.get('/staff', protect, admin, getAllStaff); // Route to get staff members

module.exports = router;