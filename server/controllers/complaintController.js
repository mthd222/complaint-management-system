const Complaint = require('../models/Complaint');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

/**
 * @desc    Create a new complaint
 * @route   POST /api/complaints
 */
exports.createComplaint = async (req, res) => {
  try {
    const { department, description } = req.body;
    const newComplaint = new Complaint({
        user: req.session.userId,
        department, 
        description 
    });

    if (req.file) {
      // The path will be something like 'public\uploads\image-167...jpg'
      // We serve from /public, so the accessible URL is '/uploads/image-...'
      newComplaint.image = req.file.path.replace('public', '');
    }
 const newComplaint1 = new Complaint(newComplaint);
    await newComplaint1.save();
    
    const user = await User.findById(req.session.userId);
    const emailHtml = `
      <h3>Dear ${user.email},</h3>
      <p>Your complaint has been successfully submitted and is now <strong>Pending</strong>.</p>
      <p><b>Department:</b> ${department}</p>
      <p><b>Description:</b> ${description}</p>
      <p>We will review it shortly. You will receive another email when its status is updated.</p>
      <p>Thank you,<br/>Complaint Management System</p>
    `;

    await sendEmail({
      to: user.email,
      subject: 'Complaint Submitted Successfully',
      html: emailHtml,
    });
    
    res.status(201).json(newComplaint1);
  } catch (error) {
    console.error("Error in createComplaint:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Update a complaint's status (for Admin)
 * @route   PUT /api/complaints/:id
 */
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    const oldStatus = complaint.status;
    
    complaint.status = status;
    if (resolutionNotes) {
      complaint.resolutionNotes = resolutionNotes;
    }
    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id).populate('user', 'email');

    // --- Send Email on Status Update ---
    if (oldStatus !== status) { // Only send if status actually changed
      const emailHtml = `
        <h3>Dear ${updatedComplaint.user.email},</h3>
        <p>The status of your complaint has been updated.</p>
        <p><b>Complaint ID:</b> ${updatedComplaint._id}</p>
        <p><b>Department:</b> ${updatedComplaint.department}</p>
        <p><b>Previous Status:</b> ${oldStatus}</p>
        <p><b>New Status:</b> <strong>${status}</strong></p>
        ${resolutionNotes ? `<p><b>Resolution Notes:</b> ${resolutionNotes}</p>` : ''}
        <p>Thank you,<br/>Complaint Management System</p>
      `;
      
      await sendEmail({
        to: updatedComplaint.user.email,
        subject: `Your Complaint Status is now: ${status}`,
        html: emailHtml,
      });
    }

    res.status(200).json(updatedComplaint);
  } catch (error) {
    console.error("Error in updateComplaintStatus:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get all complaints (for Admin)
 * @route   GET /api/complaints
 */
exports.getAllComplaints = async (req, res) => {
  try {
    const { search } = req.query; // Get search term from query params
    
    let query = {};
    if (search) {
      // If there's a search term, use the $text operator
      query = { $text: { $search: search } };
    }

    const complaints = await Complaint.find(query).populate('user', 'email').sort({ submittedAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error in getAllComplaints:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get complaints for the logged-in user
 * @route   GET /api/complaints/my-complaints
 */
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.session.userId }).sort({ submittedAt: -1 });
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error in getMyComplaints:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
