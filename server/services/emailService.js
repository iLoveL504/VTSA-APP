import nodemailer from 'nodemailer';

const sendAccountDetails = async (email, userData) => {
    try {
        // Debug: Check if environment variables are loaded
        console.log('🔧 Debug - Environment Variables:');
        console.log('SENDGRID_API_KEY exists:', !!process.env.SENDGRID_API_KEY);
        console.log('SENDGRID_API_KEY length:', process.env.SENDGRID_API_KEY?.length);
        console.log('SENDGRID_API_KEY starts with SG.:', process.env.SENDGRID_API_KEY?.startsWith('SG.'));
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: {
                user: 'apikey',  // ← Literally the word 'apikey'
                pass: process.env.SENDGRID_API_KEY  
            }
        });

        // Verify the connection
        await transporter.verify();
        console.log('✅ SendGrid connection verified');

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
                    <p><strong>Password:</strong> ${userData.password}</p>
                    <p><strong>Account Created:</strong> ${new Date().toLocaleDateString()}</p>
                  </div>
                  
                  <p>Please keep this information secure.</p>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent via SendGrid: ', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('❌ SendGrid error:', error);
        return { success: false, error: error.message };
    }
}

export { sendAccountDetails }