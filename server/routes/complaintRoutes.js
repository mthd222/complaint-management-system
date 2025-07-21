const upload = require('../middleware/multer');
const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getMyComplaints, // Import new controller
  updateComplaintStatus,
  deleteComplaint,
  assignComplaint,
  getAssignedComplaints,
   resolveComplaint,
} = require('../controllers/complaintController');
const { protect, admin, /* you might want a 'isStaff' middleware or check in controller */ } = require('../middleware/authMiddleware');

// User can create a complaint
// router.post('/', protect, createComplaint);
router.post('/', protect, upload.single('image'), createComplaint);

// User can view their own complaints
router.get('/my-complaints', protect, getMyComplaints);

// Admin can get all complaints
router.get('/', protect, admin, getAllComplaints);

// Admin can update a complaint
router.put('/:id', protect, admin, updateComplaintStatus);

router.delete('/:id', protect, deleteComplaint);
router.get('/assigned', protect, getAssignedComplaints);
router.put('/:id/assign', protect, admin, assignComplaint);
router.put('/:id/resolve', protect, resolveComplaint);

module.exports = router;