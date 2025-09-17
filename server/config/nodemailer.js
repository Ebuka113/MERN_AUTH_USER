
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', //brevo smpt server generated smtp on brevo smpt website
    port: 587, //brevo smpt code on brevo smpt website
    auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASSWORD,
    }
})


export default transporter;