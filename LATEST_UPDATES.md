# Latest Updates to Ratego School Platform

## 1. Updated Zoho SalesIQ Widget
- Updated the Zoho SalesIQ chat widget with the new widget code: `siq87cd60ebb7c6a6b874552fdc2baa12c7a46e7a162b36cc0933ca13341c685f77`
- Widget loads asynchronously with proper initialization

## 2. Footer Updates
- **Phone Number**: Updated to `+254 734 086 120` with proper tel: link
- **Mobile App Section**: Removed the APK download section entirely
- **Resources Links**: Replaced mobile app link with "Apply Now" link pointing to `/apply`

## 3. Public Admission Application System

### Database Table
- Created `admission_applications` table with:
  - Student info (first_name, last_name, email, phone)
  - Program selection
  - Status tracking (pending/approved/rejected)
  - Admin review fields (reviewed_at, reviewed_by, notes)
  - Performance indexes for fast queries

### Public Application Page (`/apply`)
- Completely public page - no login required
- Shows all active courses with descriptions
- Form validation and duplicate application prevention
- Confirmation email sent upon submission
- Success confirmation page with next steps

### Admin Admissions Dashboard (`/admin/admissions`)
- View all applications with status filters
- Click to view detailed application information
- Approve/Reject buttons with one-click actions
- Automatic email notifications to applicants
- Status badges showing pending/approved/rejected

### Email Notifications
- **Confirmation Email**: Sent when applicant submits
- **Approval Email**: Custom welcome email when approved
- **Rejection Email**: Professional rejection with encouragement to reapply
- All emails include contact information: `info@ratego.org` and phone number

## 4. Navigation Updates
- Added "Admissions" section to admin sidebar with FileText icon
- Added "Apply Now" link in footer

## How to Use

### For Students/Public
1. Visit `https://yourdomain.com/apply`
2. Fill in personal information
3. Select desired course
4. Submit application
5. Receive confirmation email
6. Wait for admin review (3-5 business days)

### For Admin
1. Go to `/admin/admissions`
2. View pending applications
3. Click on any application to see full details
4. Click Approve or Reject button
5. Applicant automatically receives decision email

## Next Steps: Google Calendar Integration

To integrate Google Calendar:

1. **Enable Google Calendar API**
   - Go to Google Cloud Console
   - Create/select your project
   - Enable Calendar API
   - Create OAuth 2.0 credentials

2. **Add Environment Variables**
   ```
   GOOGLE_CALENDAR_CLIENT_ID=your_client_id
   GOOGLE_CALENDAR_CLIENT_SECRET=your_client_secret
   GOOGLE_CALENDAR_CALENDAR_ID=your_calendar_id
   ```

3. **Features to Implement**
   - Show all calendar events (classes, deadlines, holidays) per term/session
   - Admin can create events directly from lesson scheduler
   - Automatic event creation when scheduling live lessons
   - Student calendar showing their enrolled course events
   - Term/Session filtering

## File Changes Summary
- `app/layout.tsx` - Updated Zoho widget
- `components/footer.tsx` - Updated phone, removed app section
- `app/apply/page.tsx` - NEW public admission form
- `app/admin/admissions/page.tsx` - NEW admin review interface
- `app/api/admission/send-confirmation/route.ts` - NEW confirmation email
- `app/api/admission/send-decision/route.ts` - NEW decision email
- `app/admin/layout.tsx` - Added Admissions to nav
- Database migration created for `admission_applications` table
