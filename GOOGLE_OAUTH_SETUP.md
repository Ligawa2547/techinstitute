# Google OAuth Setup for Ratego Institute

This guide explains how to enable Google login on the Ratego Institute authentication pages.

## Prerequisites

- Supabase project connected to your Ratego Institute application
- Google Cloud Console access

## Step 1: Create a Google OAuth App

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project named "Ratego Institute"
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Select **Web application**
6. Add authorized redirect URIs:
   - `https://your-supabase-project.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for local development)
7. Copy the **Client ID** and **Client Secret**

## Step 2: Enable Google Provider in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to **Authentication** > **Providers**
3. Find **Google** and click to enable it
4. Paste the **Client ID** and **Client Secret** from Step 1
5. Save the configuration

## Step 3: Test the Integration

1. Visit the login page at `/auth/login`
2. Click the **"Sign in with Google"** button
3. You should be redirected to Google's login flow
4. After authentication, you'll be redirected back to the dashboard

## Features Implemented

- **Login Page (`/auth/login`)**: Added "Sign in with Google" button with OAuth integration
- **Register Page (`/auth/register`)**: Added "Sign up with Google" option for new users
- **OAuth Callback (`/auth/callback`)**: Handles Google OAuth redirects and session establishment
- **Updated Theme**: Teal, gold, navy, and red color palette matching the Ratego logo

## Theme Colors

The authentication pages now use the Ratego Institute color scheme:
- **Primary (Teal)**: `#1a9b8e` - Main brand color
- **Accent (Gold)**: `#f4c430` - Highlights and buttons
- **Secondary (Navy)**: `#0e1b35` - Text and backgrounds
- **Destructive (Red)**: `#e63946` - Errors and alerts

## Troubleshooting

### "Invalid redirect URI" error
- Ensure the redirect URI matches exactly what you configured in Google Cloud Console
- Check that your Supabase project URL is correct

### Users not being created
- Verify Google provider is enabled in Supabase Authentication settings
- Check that the OAuth app credentials are correctly entered

### Redirect to /auth/error
- Check browser console for error messages
- Verify the OAuth code exchange is working in Supabase logs

## Additional Resources

- [Supabase OAuth Documentation](https://supabase.com/docs/guides/auth/social-login)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
