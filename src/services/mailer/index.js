const { createTransport } = require('nodemailer');
const HttpError = require('../../helpers/error');

const transport = createTransport({
    service: "gmail",
    auth: {
        user: "jpryshcheporg@gmail.com",
        pass: "fvhdgbkpknqgsqqb"
    }
});

const url = process.env.URL;

async function sendMail(email, token) {
    console.log(`${url}/regConfirm/${token}`);
    await transport.sendMail({
        from: "Usof System",
        to: email,
        subject: "System registration confirm",
        html: 
        `
        <h1>Link to confirm your registration</h1>
        <a href="${url}regConfirm/${token}"><button>LINK</button></a>
        <p> Or copy it manually: ${url}regConfirm/${token} </p>
        `
    }, (error, info) => {
        if (error) {
            console.log(error);
            throw new HttpError('Something went wrong on mail sending', 500);
        }

        console.log('Email sent: ', info.envelope, info.response);
    })
}

module.exports = sendMail;