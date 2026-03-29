import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { email, name, programId } = await req.json()

    if (!email || !name || !programId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get program details
    const supabase = await createClient()
    const { data: program } = await supabase
      .from('programs')
      .select('title')
      .eq('id', programId)
      .single()

    // Send confirmation email
    await resend.emails.send({
      from: 'noreply@ratego.org',
      to: email,
      subject: `Application Received - ${program?.title || 'Ratego Course'}`,
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
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Application Received</h1>
              </div>
              
              <div class="content">
                <p>Dear ${name},</p>
                
                <p>Thank you for applying to <strong>${program?.title || 'Ratego'}</strong> at Ratego Institute of Technology!</p>
                
                <p>We have received your application and it is now under review. Our admissions team will carefully evaluate your information and will contact you within 3-5 business days with a decision.</p>
                
                <h3>Application Details:</h3>
                <ul>
                  <li><strong>Course:</strong> ${program?.title || 'N/A'}</li>
                  <li><strong>Submitted:</strong> ${new Date().toLocaleDateString()}</li>
                </ul>
                
                <p>If you have any questions in the meantime, please don't hesitate to reach out to us at:</p>
                <ul>
                  <li><strong>Email:</strong> info@ratego.org</li>
                  <li><strong>Phone:</strong> +254 734 086 120</li>
                </ul>
                
                <p>We look forward to helping you advance your skills with Ratego!</p>
                
                <p>Best regards,<br>
                The Ratego Team</p>
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
    console.error('Error sending confirmation email:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    )
  }
}
