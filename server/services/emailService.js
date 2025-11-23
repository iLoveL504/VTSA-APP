import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const sendAccountDetails = async (email, userData) => {
    console.log('user------', process.env.EMAIL_USER)
    console.log('pass------', process.env.EMAIL_PASS)
    console.log()
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Account Details',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Our Platform!</h2>
          <p>Your account has been successfully created. Here are your account details:</p>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #555;">Account Information:</h3>
            <p><strong>Username:</strong> ${userData.username}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Password:</strong>${userData.password}</p>
            <p><strong>Account Created:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>Please keep this information secure. You can login to your account using the credentials above.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              If you did not create this account, please contact our support team immediately.
            </p>
          </div>
        </div>
      `,
        }

        const result = await transporter.sendMail(mailOptions)
        console.log('Email sent successfully: ', result.messageId)
        return {success: true, messageId: result.messageId}
    } catch (error) {
        console.log(error)
        return { success: false, error: error.message };
    }
}

export { sendAccountDetails }
