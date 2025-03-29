const ActivityLog = require('../models/ActivityLogg');

const logActivity = async ({
  userId,
  action,
  collectionName,
  documentId = null,
  description,
  details = {},
  ipAddress
}) => {
  try {
    // Validate required fields
    if (!userId || !action || !collectionName || !description || !ipAddress) {
      throw new Error('Missing required fields for activity log');
    }

    const log = new ActivityLog({
      user_id: userId,
      action,
      collection_name: collectionName,
      document_id: documentId,
      description,
      details,
      ip_address: ipAddress
    });

    const savedLog = await log.save();
    console.log('Activity logged successfully:', savedLog);
    return savedLog;
  } catch (error) {
    console.error('Failed to log activity:', error);
    throw error; // Re-throw to handle in controller
  }
};

module.exports = logActivity;