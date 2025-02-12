const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const verifyEmail = ({ origin, verificationToken, email, userName }) => {
  const url = `${origin}/auth/verify-email?verificationToken=${verificationToken}&email=${email}`
  const msg = {
    to: email,
    from: 'khomyntaras1997@gmail.com',
    subject: 'Please verify your email',
    html: `<p><h1>Hi ${userName}!</h1>Please confirm your email by clicking on the following link : 
        <a href="${url}">Verify Email</a> </p>`,
  }

  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

module.exports = verifyEmail
