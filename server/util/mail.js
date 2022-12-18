import nodemailer from "nodemailer"

export async function sendMail() {

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
        subject: `<${subject}>`,
        text: `<${text}>`
    })

    /* bliver nødt til at oprette to sendMail functions? ved ikke hvad den her var tænkt til, 
    men den mail vi skal sende fra kontaktform ser sådan her ud: 

    let info = await transporter.sendMail({
        from: `"Book Splendor" <customerService@bookSplendor.dk>`,
        to: `"Book Splendor" <customerService@bookSplendor.dk>`,
        subject: `<${subject}>`,
        text: `<${text}>`
        usermail: `<${mail}>`

    */

    console.log("Message send: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}