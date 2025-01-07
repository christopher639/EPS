// middleware/isAdmin.js
const authenticateUser = require('./authenticateUser');  // assuming authenticateUser is required here too

const isAdmin = (req, res, next) => {
    // Ensure the user is authenticated first
    authenticateUser(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }
        next(); // Proceed if user is admin
    });
};

module.exports = isAdmin;
