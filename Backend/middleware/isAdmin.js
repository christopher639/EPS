const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next(); // Continue to the next middleware or route handler
    }
    return res.status(403).json({ message: "Access denied. Admins only." });
};

module.exports = isAdmin;
