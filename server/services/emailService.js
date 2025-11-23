import nodemailer from 'nodemailer';

const sendAccountDetails = async (email, userData) => {
    try {
        console.log('🔧 Debug - Environment Variables:');
        console.log('SENDGRID_API_KEY exists:', !!process.env.SENDGRID_API_KEY);
        console.log('SENDGRID_API_KEY starts with SG.:', process.env.SENDGRID_API_KEY?.startsWith('SG.'));
        console.log('EMAIL_USER:', process.env.EMAIL_USER);
        
        // Create transporter with more options
        const transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false, // Use TLS
            auth: {
                user: 'apikey',
                pass: process.env.SENDGRID_API_KEY  
            },
            connectionTimeout: 10000, // 10 seconds
            greetingTimeout: 10000,
            socketTimeout: 10000,
            debug: true, // This will show SMTP communication
            logger: true  // This will log the communication
        });

        console.log('🔄 Attempting to verify SendGrid connection...');
        
        // Verify the connection with more details
        await transporter.verify();
        console.log('✅ SendGrid connection verified successfully');

        console.log('📧 Preparing to send email to:', email);
        
        const mailOptions = {
            from: {
                name: 'Your Platform Name', // Add a sender name
                address: process.env.EMAIL_USER
            },
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

        console.log('🚀 Sending email...');
        const result = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent via SendGrid. Message ID:', result.messageId);
        
        return { success: true, messageId: result.messageId };
        
    } catch (error) {
        console.error('❌ SendGrid error details:');
        console.error('Error name:', error.name);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        
        // Check for specific error types
        if (error.code === 'EAUTH') {
            console.error('🔐 Authentication failed. Possible issues:');
            console.error('- API key is invalid or revoked');
            console.error('- Sender not verified in SendGrid dashboard');
            console.error('- API key permissions insufficient');
        } else if (error.code === 'ECONNECTION') {
            console.error('🌐 Connection failed. Possible issues:');
            console.error('- Railway network restrictions');
            console.error('- SendGrid service outage');
            console.error('- Firewall blocking connection');
        } else if (error.code === 'ETIMEDOUT') {
            console.error('⏰ Connection timeout. Possible issues:');
            console.error('- Network latency');
            console.error('- SendGrid server issues');
        }
        
        return { 
            success: false, 
            error: error.message,
            code: error.code 
        };
    }
}

export { sendAccountDetails }