const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE']
  },
  collection_name: {
    type: String,
    required: true
  },
  document_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  description: {
    type: String,
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip_address: {
    type: String,
    required: true
  }
}, { collection: 'activitylogs' }); // Explicit collection name

module.exports = mongoose.models.ActivityLog || 
                 mongoose.model('ActivityLog', activityLogSchema);