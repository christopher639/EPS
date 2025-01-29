const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activity_type: { type: String, required: true },  // Create, Read, Update, Delete
    collection_name: { type: String, required: true },  // Name of the collection being modified
    document_id: { type: mongoose.Schema.Types.ObjectId, required: true },  // ID of the document being modified
    description: { type: String, required: true },  // Detailed description of the action
    timestamp: { type: Date, default: Date.now },  // When the activity took place
    ip_address: { type: String, required: true },  // Optional: Log the user's IP address
    additional_info: { type: Object },  // Optional: For any extra info (like changes made, old values, etc.)
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
