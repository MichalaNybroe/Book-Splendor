import nodemailer from "nodemailer"

//lav den så den importerer fra contact form? 
//name, to, subject, text, 

export async function sendMail(name, to, subject, text) {

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
        to: `<${to}>`,
        subject: subject,
        text: text
    })

    console.log("Message send: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}