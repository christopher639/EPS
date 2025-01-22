const isAdmin = (req, res, next) => {
    // Check if the user is authenticated (ensure req.user is set)
    if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    // Check if the user has an 'admin' role
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Permission denied' }); // Forbidden if not admin
    }
    next(); // If the user is an admin, allow them to proceed
};

module.exports = isAdmin;
