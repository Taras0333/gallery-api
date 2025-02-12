const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const forgotPasswordEmail = ({ email, userName, newPassword }) => {
  const msg = {
    to: email,
    from: 'khomyntaras1997@gmail.com',
    subject: 'Updated Password',
    html: `<p><h1>Hi ${userName}!</h1>Here is your new password : 
        <span>${newPassword}</span></p>`,
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

module.exports = forgotPasswordEmail
