const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    profilePicture: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'moderator'],
        default: 'user',
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active',
    },
    address: {
        type: String,
        required: false,
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    lastLogin: {
        type: Date,
        required: false,
    },
    preferences: {
        type: Object,
        required: false,
    },
    rolesPermissions: {
        type: [String],
        default: [],
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
