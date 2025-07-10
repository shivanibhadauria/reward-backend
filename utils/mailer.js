const mailer = require('nodemailer');
require('dotenv').config();

const sendMail = async ({to , subject, html}) => {
const transporter = mailer.createTransport({
service: 'gmail',
auth: {
user: process.env.EMAIL,
pass: process.env.EMAIL_PASSWORD,
}});

const mailOptions = {
from: process.env.EMAIL,
to,
subject,
html
};
console.log(mailOptions)

try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully' + to)
    

} catch (error) {
    console.log('Error sending email:', error);
}
}
module.exports = sendMail;