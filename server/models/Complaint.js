const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  // Link to the user who created the complaint
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // We'll get the user's name via the 'ref', so userName is no longer needed here.
  department: {
    type: String,
    required: true,
    enum: ['Hostel', 'Internet', 'Classroom', 'Faculty', 'Other'],
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Closed'],
    default: 'Pending',
  },
 image: {
  type: String,
  default: ''
},
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  resolutionNotes: {
    type: String,
    default: '',
  }
});

complaintSchema.index({
  description: 'text',
  department: 'text'
});

module.exports = mongoose.model('Complaint', complaintSchema);