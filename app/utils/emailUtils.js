var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
const config = require('../../config.json');
const constants = require('./constants');

const service = process.env.EMAIL_SERVICE_NAME || config.EMAIL_SERVICE_NAME
const host = process.env.EMAIL_HOST_NAME || config.EMAIL_HOST_NAME
const user = process.env.EMAIL_USER || config.EMAIL_USER
const pass = process.env.EMAIL_PASSWORD || config.EMAIL_PASSWORD

// var transporter = nodemailer.createTransport(smtpTransport({
//     service: service,
//     host: host,
//     auth: {
//         user: user,
//         pass: pass
//     }
// }));

async function sendEmail(to, subject, text) {


    let transporter = nodemailer.createTransport({
        host: 'smtpout.secureserver.net',
        port: 465,
        secure: true,
        auth: {
            user: 'info@mdxblocks.com',
            pass: 'Esteem@123'
        }
    });

    console.log('Calling sendEmail --1');


    let mailOptions = {
        from: '"Info" <info@mdxblocks.com>', // sender address 
        cc: '<info@mdxblocks.com>',        
        to: to, // list of receivers
        subject:subject, // Subject line
        html: text, // acccept html tags
       
    };

    console.log('Calling sendEmail --2');

    // transporter.sendMail(mailOptions, (error, info) => {
    //     console.log('Message 4');

    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log('Message %s sent: %s', info.messageId, info.response);
    //         res.render('index');
    // });
    
    // const sendMail = await transporter.sendMail(mailOptions).catch(err=> err)
    // console.log("Senddddd" , sendMail)
    // return sendMail
    // // console.log(service, host, user, pass)

    // const mailOptions = {
    //     from: user, // sender address
    //     to: to, // list of receivers
    //     subject: subject, // Subject line
    //     text: text// plain text body
    // };
    // console.log("Inside sendEmail");

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              //  console.log(error);
              console.log('Calling sendEmail --3 error--s',error);
                resolve(false);
            } else {
               // console.log('Email sent: ' + info.response);
               console.log('Calling sendEmail --4 --s',info.response);
                resolve(true);
            }
        });
    })
}

module.exports = {
    sendEmail
};