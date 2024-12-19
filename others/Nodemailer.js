require("dotenv").config()


const gmail = process.env.Gmail
const GmailPassword = process.env.GmailPassword
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: gmail,
        pass: GmailPassword,
    },
});




async function sendMail(from, to, subject, text = "", html = "") {

    const info = await transporter.sendMail({
        from: from, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
module.exports = sendMail