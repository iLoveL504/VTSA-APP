import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'
// Get the current directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env from the root directory
const envPath = path.resolve(__dirname, '../.env')
console.log('📁 Loading .env from:', envPath)

dotenv.config({ path: envPath })

console.log('🔍 Testing Email Configuration:')
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'UNDEFINED - Check .env file')
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'NOT SET')
console.log('All environment variables:', process.env)

// Rest of your test code...
const testTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'gundamexiagn00001@gmail.com',
        pass: 'amaa ihgw nyoe txzp'
    }
})

async function testEmail() {
    // if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    //     console.log('❌ CRITICAL: Environment variables not loaded!')
    //     console.log('   Make sure your .env file is in the root directory')
    //     console.log('   And contains EMAIL_USER and EMAIL_PASS variables')
    //     return
    // }
    
    try {
        await testTransporter.verify()
        console.log('✅ SMTP configuration is correct!')
        
        const result = await testTransporter.sendMail({
            from: 'gundamexiagn00001@gmail.com',
            to: 'gundamexiagn00001@gmail.com',
            subject: 'Test Email - Your App',
            text: 'This is a test email!',
        })
        
        console.log('✅ Test email sent successfully!')
        
    } catch (error) {
        console.log('❌ Error:', error.message)
    }
}

testEmail()