const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    action: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

const complaintSchema = new mongoose.Schema({
  // Link to the user who created the complaint
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // We'll get the user's name via the 'ref', so userName is no longer needed here.
  department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Resolved', 'Closed'], // <-- Add 'Resolved'
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
  },

  assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  
  activityLog: [activitySchema]
});

complaintSchema.index({
  description: 'text',
  department: 'text'
});

module.exports = mongoose.model('Complaint', complaintSchema);