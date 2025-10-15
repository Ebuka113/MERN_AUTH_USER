import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, // Brevo uses TLS on port 587, not SSL
    auth: {
        user: process.env.SMTP_USER,   // ✅ Corrected variable name
        pass: process.env.SMTP_PASS,   // ✅ Corrected variable name
    }
});

// Optional debug verification
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ SMTP configuration error:', error);
    } else {
        console.log('✅ SMTP is ready to send emails');
    }
});

export default transporter;
