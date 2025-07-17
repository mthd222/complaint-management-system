const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getMyComplaints, // Import new controller
  updateComplaintStatus,
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');

// User can create a complaint
router.post('/', protect, createComplaint);

// User can view their own complaints
router.get('/my-complaints', protect, getMyComplaints);

// Admin can get all complaints
router.get('/', protect, admin, getAllComplaints);

// Admin can update a complaint
router.put('/:id', protect, admin, updateComplaintStatus);

module.exports = router;