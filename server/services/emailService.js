import sgMail from '@sendgrid/mail';

const sendAccountDetails = async (email, userData) => {
    try {
        console.log('🔧 Using SendGrid API directly');
        console.log('SENDGRID_API_KEY exists:', !!process.env.SENDGRID_API_KEY);
        
        // Set the API key
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            to: email,
            from: process.env.EMAIL_USER,
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

        console.log('🚀 Sending email via SendGrid API...');
        const result = await sgMail.send(msg);
        console.log('✅ Email sent via SendGrid API. Status:', result[0].statusCode);
        
        return { 
            success: true, 
            messageId: result[0].headers['x-message-id'] 
        };
        
    } catch (error) {
        console.error('❌ SendGrid API error:');
        console.error('Error message:', error.message);
        console.error('Error response:', error.response?.body);
        
        return { 
            success: false, 
            error: error.message 
        };
    }
}

export { sendAccountDetails }