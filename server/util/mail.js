import nodemailer from "nodemailer"

export async function sendMail(name, email, subject, message) {

    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    })

    let info = await transporter.sendMail({
        from: `"Book Splendor" <customerService@bookSplendor.dk>`,
        to: `${name} <${email}>`,
        subject: subject,
        text: message
    })


    console.log("Message send: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}