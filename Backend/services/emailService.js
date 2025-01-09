const nodemailer = require('nodemailer');

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
    // Create a transporter object using SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',  // Use your SMTP service here (e.g., Gmail, SendGrid, etc.)
        auth: {
            user: 'bundichristopher639@gmail.com',  // Your email address
            pass: '1234Topaz639#'    // Your email password
        }
    });

    // Email options
    const mailOptions = {
        from: 'bundichristopher639@gmail.com',
        to,
        subject,
        text,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error('Error sending email:', err);
    }
};

// Function to send an email to all users
const sendEmailToAllUsers = async (users, subject, text, html) => {
    try {
        const emailPromises = users.map(user => {
            return sendEmail(user.email, subject, text, html);
        });

        // Wait for all email promises to resolve
        await Promise.all(emailPromises);
        console.log('Emails sent to all users successfully');
    } catch (err) {
        console.error('Error sending emails to all users:', err);
    }
};

// Function to send an email to a single user
const sendEmailToSingleUser = async (user, subject, text, html) => {
    try {
        await sendEmail(user.email, subject, text, html);
        console.log(`Email sent to ${user.email} successfully`);
    } catch (err) {
        console.error('Error sending email to single user:', err);
    }
};

module.exports = {
    sendEmail,
    sendEmailToAllUsers,
    sendEmailToSingleUser
};
