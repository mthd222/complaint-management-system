const fs = require('fs');
const path = require('path');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

/**
 * @desc    Create a new complaint
 * @route   POST /api/complaints
 */
exports.createComplaint = async (req, res) => {
  try {
    const { department, description } = req.body; // 'department' is an ID

    // 1. Create the complaint data object
    const newComplaintData = {
      user: req.session.userId,
      department,
      description,
      image: req.file ? req.file.path.replace('public', '').replace(/\\/g, '/') : '',
    };
    
    // 2. Create a single Mongoose document instance
    const newComplaint = new Complaint(newComplaintData);

    // 3. Add the initial activity log
    newComplaint.activityLog.push({
      user: req.session.userId,
      action: 'Complaint submitted'
    });

    // 4. Save the document once
    await newComplaint.save();

    // --- Email Sending Logic ---
    const user = await User.findById(req.session.userId);
    const departmentDoc = await require('../models/Department').findById(department); // Fetch department for name
    const emailHtml = `
      <h3>Dear ${user.email},</h3>
      <p>Your complaint has been successfully submitted regarding the <strong>${departmentDoc.name}</strong> department.</p>
      <p><b>Description:</b> ${description}</p>
      <p>You will be notified of any status updates.</p>`;
    
    await sendEmail({
      to: user.email,
      subject: 'Complaint Submitted Successfully',
      html: emailHtml,
    });
    
    // 5. Populate the saved document for the response
    const populatedComplaint = await Complaint.findById(newComplaint._id)
        .populate('user', 'email')
        .populate('department', 'name');

    res.status(201).json(populatedComplaint);
  } catch (error) {
    console.error("Error in createComplaint:", error);
    res.status(500).json({ message: 'Server Error', error });
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

    // Cleaned up logic: Update only if changed
    if (oldStatus !== status) {
      complaint.status = status;
      complaint.activityLog.push({
        user: req.session.userId,
        action: `Status changed from '${oldStatus}' to '${status}'`
      });
    }

    if (resolutionNotes && complaint.resolutionNotes !== resolutionNotes) {
        complaint.resolutionNotes = resolutionNotes;
        complaint.activityLog.push({
          user: req.session.userId,
          action: `Resolution notes added/updated`
        });
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('user', 'email')
      .populate('department', 'name')
      .populate('activityLog.user', 'email');

    // Email sending logic can remain the same
    if (oldStatus !== status) {
      const emailHtml = `
        <h3>Dear ${updatedComplaint.user.email},</h3>
        <p>The status of your complaint has been updated.</p>
        <p><b>Complaint regarding:</b> ${updatedComplaint.department.name} Department</p>
        <p><b>Previous Status:</b> ${oldStatus}</p>
        <p><b>New Status:</b> <strong>${status}</strong></p>
        ${updatedComplaint.resolutionNotes ? `<p><b>Resolution Notes:</b> ${updatedComplaint.resolutionNotes}</p>` : ''}
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
    const { search } = req.query;
    let query = search ? { $text: { $search: search } } : {};

    const complaints = await Complaint.find(query)
      .sort({ submittedAt: -1 })
      .populate('user', 'email')
      .populate('department', 'name') // <-- CRITICAL: Added missing populate
      .populate('assignedTo', 'email')
      .populate('activityLog.user', 'email');
      
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error in getAllComplaints:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Assign a complaint to a staff member
 * @route   PUT /api/complaints/:id/assign
 */
exports.assignComplaint = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const complaint = await Complaint.findById(req.params.id).populate('assignedTo', 'email');
    
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    
    const staffUser = await User.findById(assignedTo);
    if (!staffUser || staffUser.role !== 'staff') {
      return res.status(404).json({ message: 'Staff member not found or user is not staff' });
    }

    const oldAssignee = complaint.assignedTo?.email || 'unassigned';
    complaint.assignedTo = assignedTo;
    complaint.activityLog.push({
      user: req.session.userId,
      action: `Assigned to ${staffUser.email}`
    });
    
    await complaint.save();
    
    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('user', 'email')
      .populate('department', 'name')
      .populate('assignedTo', 'email')
      .populate('activityLog.user', 'email');
      
    // CORRECT: Send the fully populated object back
    res.status(200).json(populatedComplaint);
  } catch (error) {
    console.error("Error in assignComplaint:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Authorization Check: User must be an admin OR the owner of the complaint
    if (req.session.role !== 'admin' && complaint.user.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'User not authorized to delete this complaint' });
    }

    // If there's an image, delete it from the filesystem
    if (complaint.image) {
      // Construct the full path to the image
      const imagePath = path.join(__dirname, '..', 'public', complaint.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          // Log the error but don't block the complaint deletion
          console.error(`Failed to delete image file: ${imagePath}`, err);
        }
      });
    }

    // Delete the complaint from the database
    await Complaint.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error("Error in deleteComplaint:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};
/**
 * @desc    Get complaints for the logged-in user
 * @route   GET /api/complaints/my-complaints
 */
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.session.userId })
      .sort({ submittedAt: -1 })
      .populate('user', 'email') // Populates the main user
      .populate('department', 'name') // <-- THIS LINE IS CRUCIAL
      .populate('activityLog.user', 'email');
    res.status(200).json(complaints);
  } catch (error) {
    console.error("Error in getMyComplaints:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};



exports.getAssignedComplaints = async (req, res) => {
  try {
    // Finds complaints assigned to the currently logged-in user
    const complaints = await Complaint.find({ assignedTo: req.session.userId })
      .populate('user', 'email')
      .populate('department', 'name');
    res.status(200).json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.resolveComplaint = async (req, res) => {
    try {
        const { resolutionNotes } = req.body;
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Authorization: Ensure the logged-in user is the one assigned to this complaint
        if (complaint.assignedTo?.toString() !== req.session.userId) {
            return res.status(403).json({ message: 'You are not assigned to this complaint' });
        }

        complaint.resolutionNotes = resolutionNotes;
        complaint.status = 'Resolved'; // Set the new status
        complaint.activityLog.push({
            user: req.session.userId,
            action: `Marked as Resolved with notes: "${resolutionNotes}"`
        });

        await complaint.save();

        // TODO: Optionally, send an email to admins notifying them of the resolution.

        const populatedComplaint = await Complaint.findById(complaint._id).populate('user department assignedTo activityLog.user', 'name email');
        res.status(200).json(populatedComplaint);

    } catch (error) {
        console.error("Error in resolveComplaint:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};