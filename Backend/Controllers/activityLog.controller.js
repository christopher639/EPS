const ActivityLog = require('../models/activityLog.model');

// Function to create a log for any activity
async function createActivityLog(userId, activityType, collectionName, documentId, description, ipAddress, additionalInfo) {
    try {
        const activityLog = new ActivityLog({
            user_id: userId,
            activity_type: activityType,
            collection_name: collectionName,
            document_id: documentId,
            description: description,
            ip_address: ipAddress,
            additional_info: additionalInfo,
        });

        await activityLog.save();
    } catch (error) {
        console.error('Error logging activity:', error);
    }
}

module.exports = { createActivityLog };
