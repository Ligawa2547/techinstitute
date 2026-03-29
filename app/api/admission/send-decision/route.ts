import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, name, programTitle, status } = await req.json()

    if (!email || !name || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const isApproved = status === 'approved'

    await resend.emails.send({
      from: 'noreply@ratego.org',
      to: email,
      subject: isApproved ? `Welcome to ${programTitle}!` : `Application Status Update`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1a9b8e 0%, #f4c430 100%); padding: 20px; border-radius: 8px; color: white; }
              .content { margin: 20px 0; line-height: 1.6; }
              .footer { border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #666; }
              .button { display: inline-block; padding: 12px 24px; background-color: #1a9b8e; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
              .success { color: #22c55e; }
              .rejected { color: #ef4444; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; ${isApproved ? 'color: #22c55e;' : ''}">
                  ${isApproved ? '✓ Application Approved!' : 'Application Status Update'}
                </h1>
              </div>
              
              <div class="content">
                <p>Dear ${name},</p>
                
                ${isApproved ? `
                  <p class="success"><strong>Great news! Your application to ${programTitle} has been approved.</strong></p>
                  
                  <p>Congratulations! We're excited to have you join our learning community at Ratego Institute of Technology.</p>
                  
                  <h3>Next Steps:</h3>
                  <ol>
                    <li>Visit our website and create your student account</li>
                    <li>Complete your profile information</li>
                    <li>Enroll in ${programTitle}</li>
                    <li>Access course materials and start learning</li>
                  </ol>
                  
                  <p>
                    <a href="https://ratego.org/auth/register" class="button">Create Your Account</a>
                  </p>
                  
                  <p>If you have any questions, please contact us at:</p>
                ` : `
                  <p class="rejected"><strong>Thank you for your interest in Ratego Institute of Technology.</strong></p>
                  
                  <p>After careful review of your application for ${programTitle}, we regret to inform you that we are unable to approve your application at this time.</p>
                  
                  <p>We encourage you to explore our other available courses or apply again in the future. Your interest in skill development is valued, and we hope to welcome you to Ratego in the future.</p>
                  
                  <p>If you have questions about this decision or would like feedback, please contact us at:</p>
                `}
                
                <ul>
                  <li><strong>Email:</strong> info@ratego.org</li>
                  <li><strong>Phone:</strong> +254 734 086 120</li>
                </ul>
                
                <p>Best regards,<br>
                The Ratego Admissions Team</p>
              </div>
              
              <div class="footer">
                <p>© 2024 Ratego Institute of Technology. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending decision email:', error)
    return NextResponse.json(
      { error: 'Failed to send decision email' },
      { status: 500 }
    )
  }
}
