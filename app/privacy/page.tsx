'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('introduction')

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'information-we-collect', title: 'Information We Collect' },
    { id: 'how-we-use', title: 'How We Use Your Information' },
    { id: 'legal-basis', title: 'Legal Basis for Processing' },
    { id: 'data-sharing', title: 'Data Sharing and Disclosure' },
    { id: 'data-retention', title: 'Data Retention' },
    { id: 'your-rights', title: 'Your Rights' },
    { id: 'cookies', title: 'Cookies and Tracking' },
    { id: 'security', title: 'Security Measures' },
    { id: 'children', title: "Children's Privacy" },
    { id: 'third-party', title: 'Third-Party Links' },
    { id: 'international', title: 'International Data Transfers' },
    { id: 'changes', title: 'Changes to This Policy' },
    { id: 'contact', title: 'Contact Us' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-lg text-white/90">
            Your privacy is important to us. Learn how Ratego collects, uses, and protects your personal information.
          </p>
          <p className="text-sm text-white/80 mt-4">Last Updated: May 19, 2026</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4">Contents</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`block text-sm py-2 px-3 rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* 1. Introduction */}
            <section id="introduction" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">Introduction</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Welcome to Ratego (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;). Ratego operates the skill-based training platform (the &quot;Service&quot;) and is committed to protecting your privacy. This Privacy Policy explains our practices regarding the collection, use, disclosure, and safeguarding of your information when you visit our website and use our services.
                </p>
                <p>
                  Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our Service. Your continued use of the Service following the posting of revised Privacy Policy means that you accept and agree to the changes.
                </p>
                <p>
                  We are a Kenyan educational institution providing practical, skill-focused training courses. We comply with data protection laws including the Data Protection Act of Kenya and international best practices for data handling.
                </p>
              </div>
            </section>

            {/* 2. Information We Collect */}
            <section id="information-we-collect" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">Information We Collect</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">2.1 Information You Provide Directly</h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Registration Information</h4>
                      <p>When you create an account, we collect your full name, email address, phone number, date of birth, and password. For admission applications, we also collect educational background and course preferences.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Profile Information</h4>
                      <p>You may provide additional profile information including profile picture, bio, professional background, skills, and social media links. This information helps us personalize your learning experience and enable peer connections.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Course and Learning Data</h4>
                      <p>We collect information about courses you enroll in, lessons you complete, quizzes and assessments you take, progress and performance metrics, assignments submitted, discussion posts, and certificates earned.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Payment Information</h4>
                      <p>If you make payments for courses or services, we collect payment details through secure payment processors. We do not store full credit card numbers; payment processing is handled by PCI-DSS compliant third parties.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Communication Data</h4>
                      <p>When you contact us via email, phone, chat, or support forms, we collect the content of your messages, attachments, and any other information you choose to provide for support purposes.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">2.2 Information Collected Automatically</h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Usage Information</h4>
                      <p>We automatically collect information about your interactions with our Service, including pages visited, courses accessed, time spent on each page, features used, search queries, and click patterns. This helps us understand user behavior and improve the platform.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Device Information</h4>
                      <p>We collect information about the device you use to access our Service, including device type, operating system, browser type and version, unique device identifiers, mobile network information, and device settings.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Location Information</h4>
                      <p>We may collect general location information (country, city level) based on IP address to provide localized content, understand our user base geographically, and comply with regional regulations. We do not collect precise GPS location data without explicit consent.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Log Data</h4>
                      <p>Our servers automatically record log information including IP addresses, access times, browser type and language, Internet Service Provider (ISP), and the pages visited. This data helps us diagnose problems and administer the Service.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">2.3 Information from Third Parties</h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Social Media Integration</h4>
                      <p>If you choose to sign up using Google OAuth, we receive your Google profile information including name, email, and profile picture. You control what information is shared through your social media account settings.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Referral Information</h4>
                      <p>If someone refers you to Ratego, we may collect information about you from that referrer to send you invitations or promotional materials.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Payment Processors</h4>
                      <p>Payment processors may provide us with information about successful transactions and payment status to complete enrollment and billing processes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. How We Use Your Information */}
            <section id="how-we-use" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">How We Use Your Information</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We use the information we collect for various purposes:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Service Delivery</h4>
                    <p>Creating and managing your account, delivering courses and educational content, processing enrollments, tracking progress, issuing certificates, and providing technical support.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Personalization</h4>
                    <p>Personalizing your learning experience, recommending relevant courses based on interests, customizing content based on your learning patterns, and adapting difficulty levels.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Communication</h4>
                    <p>Sending educational notifications, course updates, assignment reminders, account security alerts, promotional materials (with your consent), newsletters, and responding to inquiries.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Improvement & Analytics</h4>
                    <p>Analyzing usage patterns to improve service quality, developing new features, conducting research, understanding learning outcomes, identifying technical issues, and optimizing platform performance.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Legal Compliance</h4>
                    <p>Complying with legal obligations, responding to lawful requests from authorities, enforcing terms of service, protecting against fraud and abuse, and safeguarding user safety.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Marketing</h4>
                    <p>Sending marketing communications (opt-in basis), conducting surveys, analyzing market trends, and promoting special offers or new courses relevant to your interests.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Legal Basis for Processing */}
            <section id="legal-basis" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">Legal Basis for Processing</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>Under the Data Protection Act of Kenya and GDPR (where applicable), we process your personal data based on the following legal grounds:</p>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">Consent:</span>
                    <span>We process data with your explicit consent, particularly for marketing communications and optional features.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">Contract:</span>
                    <span>Processing is necessary to fulfill our contract with you (enrollment, course delivery, certification).</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">Legal Obligation:</span>
                    <span>We process data to comply with applicable laws, regulations, and regulatory requirements.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">Legitimate Interests:</span>
                    <span>We process data for legitimate business interests (fraud prevention, platform security, service improvement) where rights are balanced.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-semibold text-primary flex-shrink-0">Vital Interests:</span>
                    <span>We may process data to protect your vital interests or those of another person in emergencies.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 5. Data Sharing and Disclosure */}
            <section id="data-sharing" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">Data Sharing and Disclosure</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">5.1 When We Share Your Information</h3>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Service Providers</h4>
                      <p>We share necessary information with trusted third-party service providers who assist in operating our website, conducting our business, and serving our users (e.g., payment processors, email service providers, hosting providers, analytics services). These providers are contractually bound to maintain confidentiality.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Instructors and Administrators</h4>
                      <p>Course instructors and administrators can access your enrollment status, progress, performance metrics, and submitted assignments to provide education, assess learning outcomes, and manage courses. Communication is limited to educational purposes.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Other Students</h4>
                      <p>In collaborative learning environments (discussion forums, group projects), your name and contributions may be visible to other enrolled students. You can control visibility levels in your privacy settings.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Legal Requirements</h4>
                      <p>We may disclose information when required by law, court order, government request, or other legal process. We will make reasonable efforts to notify you unless legally prohibited from doing so.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Business Transfers</h4>
                      <p>If Ratego is involved in a merger, acquisition, bankruptcy, or asset sale, your information may be transferred as part of that transaction. We will provide notice and relevant choices regarding such transfers.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Aggregated and De-identified Data</h4>
                      <p>We may share aggregated and anonymized data (statistics, trends, insights) for research, marketing, analytics, and public reporting purposes. This data cannot identify individuals.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">5.2 We Do Not Sell Your Data</h3>
                  <p className="text-muted-foreground">
                    We do not sell, trade, or rent your personal information to third parties for marketing purposes. Your privacy is a core value, and we are committed to protecting your data from commercial exploitation.
                  </p>
                </div>
              </div>
            </section>

            {/* 6. Data Retention */}
            <section id="data-retention" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">Data Retention</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We retain your personal information for as long as necessary to provide our services, fulfill legal obligations, and resolve disputes. Specific retention periods include:</p>
                <div className="overflow-x-auto border border-border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="text-left p-3 font-semibold">Data Type</th>
                        <th className="text-left p-3 font-semibold">Retention Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border hover:bg-muted/50">
                        <td className="p-3">Account Information</td>
                        <td className="p-3">Until account deletion + 30 days</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/50">
                        <td className="p-3">Course Progress & Certificates</td>
                        <td className="p-3">Indefinitely (for verification)</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/50">
                        <td className="p-3">Payment Records</td>
                        <td className="p-3">7 years (accounting/legal requirement)</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/50">
                        <td className="p-3">Communication Records</td>
                        <td className="p-3">2 years</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/50">
                        <td className="p-3">Usage & Analytics Data</td>
                        <td className="p-3">12 months (aggregated after 3 months)</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-muted/50">
                        <td className="p-3">Log Files</td>
                        <td className="p-3">30 days</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="p-3">Security & Fraud Data</td>
                        <td className="p-3">Until threat resolved + 12 months</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-4">
                  You can request deletion of your data at any time subject to our legal and contractual obligations. We securely dispose of all data at the end of retention periods using industry-standard methods.
                </p>
              </div>
            </section>

            {/* 7. Your Rights */}
            <section id="your-rights" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">Your Rights</h2>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  You have the following rights regarding your personal data:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Right to Access</h4>
                    <p className="text-sm text-muted-foreground">You can request a copy of all personal information we hold about you in a structured, commonly used format.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Right to Rectification</h4>
                    <p className="text-sm text-muted-foreground">You can request correction of inaccurate or incomplete information. You can update your profile at any time in your account settings.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Right to Erasure</h4>
                    <p className="text-sm text-muted-foreground">You can request deletion of your data under certain conditions, subject to our legal and contractual obligations.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Right to Restrict Processing</h4>
                    <p className="text-sm text-muted-foreground">You can request that we limit how we use your information while we verify or address your concerns.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Right to Data Portability</h4>
                    <p className="text-sm text-muted-foreground">You can request your data in a structured format and transfer it to another service provider.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Right to Object</h4>
                    <p className="text-sm text-muted-foreground">You can object to processing for marketing purposes and certain other uses. You can unsubscribe from communications anytime.</p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-foreground">
                    To exercise any of these rights, contact us at <span className="font-semibold">privacy@ratego.org</span> or submit a request through your account settings. We will respond within 30 days of your request.
                  </p>
                </div>
              </div>
            </section>

            {/* 8. Cookies and Tracking */}
            <section id="cookies" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">Cookies and Tracking</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">8.1 Cookie Usage</h3>
                  <p className="text-muted-foreground mb-4">
                    We use cookies and similar tracking technologies to enhance your experience, remember your preferences, understand usage patterns, and improve our services.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Essential Cookies</h4>
                      <p className="text-sm text-muted-foreground">Required for basic functionality: user authentication, session management, security, and basic platform operations. Cannot be disabled.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Performance Cookies</h4>
                      <p className="text-sm text-muted-foreground">Track page views, error rates, and performance metrics to optimize platform functionality and identify technical issues.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Analytics Cookies</h4>
                      <p className="text-sm text-muted-foreground">Collect usage data to understand how users interact with the platform. Data is aggregated and anonymized.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Preference Cookies</h4>
                      <p className="text-sm text-muted-foreground">Remember your settings, language preferences, theme selection, and other customization choices.</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border border-border">
                      <h4 className="font-semibold text-foreground mb-2">Marketing Cookies</h4>
                      <p className="text-sm text-muted-foreground">Used to deliver targeted advertisements and track campaign effectiveness. Requires your explicit consent.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">8.2 Your Cookie Choices</h3>
                  <p className="text-muted-foreground mb-4">
                    You can control cookie preferences through:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2">
                      <ChevronRight className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Your browser settings (blocking cookies or accepting only certain types)</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Cookie preferences in your account settings</span>
                    </li>
                    <li className="flex gap-2">
                      <ChevronRight className="h-5 w-5 text-primary flex-shrink-0" />
                      <span>Opting out of tracking services via browser tools</span>
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground mt-4">
                    Note: Disabling essential cookies may impact platform functionality and your user experience.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">8.3 Similar Technologies</h3>
                  <p className="text-muted-foreground">
                    We also use web beacons, pixels, and local storage (LocalStorage, IndexedDB) for similar purposes. These technologies function similarly to cookies and are subject to the same protections.
                  </p>
                </div>
              </div>
            </section>

            {/* 9. Security Measures */}
            <section id="security" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">Security Measures</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Protecting your data is our top priority. We implement comprehensive security measures:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Encryption</h4>
                    <p className="text-sm">SSL/TLS encryption for data in transit, AES-256 encryption for sensitive data at rest, secure password hashing using bcrypt.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Access Control</h4>
                    <p className="text-sm">Role-based access controls (RBAC), two-factor authentication (2FA), secure session management, regular security audits.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Infrastructure</h4>
                    <p className="text-sm">Secure hosting on Supabase with ISO 27001 certification, firewalls and DDoS protection, regular backups with encryption, monitoring for suspicious activities.</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4 border border-border">
                    <h4 className="font-semibold text-foreground mb-2">Compliance</h4>
                    <p className="text-sm">Compliance with Data Protection Act of Kenya, GDPR compliance for EU users, PCI-DSS compliance for payment data, regular penetration testing.</p>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Important:</span> While we maintain strong security, no system is completely impenetrable. We encourage you to use strong passwords, enable 2FA, and not share sensitive information. You are responsible for maintaining confidentiality of your login credentials.
                  </p>
                </div>
              </div>
            </section>

            {/* 10. Children's Privacy */}
            <section id="children" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">Children&apos;s Privacy</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Ratego is not intended for children under 13 years old. We do not knowingly collect personal information from children under 13. If we become aware of such collection, we will delete the information and notify the parent or guardian.
                </p>
                <p>
                  For users between 13-18 years old, we provide additional privacy protections. Parents/guardians can contact us to review, update, or delete a minor&apos;s information.
                </p>
                <p>
                  If you believe we have collected information from a child under 13, please contact us immediately at <span className="font-semibold">privacy@ratego.org</span>.
                </p>
              </div>
            </section>

            {/* 11. Third-Party Links */}
            <section id="third-party" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">Third-Party Links</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Our platform may contain links to third-party websites, applications, and services that are not operated by Ratego. This Privacy Policy applies only to information collected through our Service. We are not responsible for the privacy practices of third-party sites.
                </p>
                <p>
                  We encourage you to review the privacy policies of any third-party services before providing your information. Our provision of links does not constitute an endorsement of these external sites or their content.
                </p>
                <p>
                  Google Meet, Google Calendar, and other integrated services have their own privacy policies. Please review them to understand how they handle your data.
                </p>
              </div>
            </section>

            {/* 12. International Data Transfers */}
            <section id="international" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">International Data Transfers</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Ratego is based in Kenya. Your information may be transferred to, stored in, and processed in countries other than your country of residence, including countries with different data protection laws.
                </p>
                <p>
                  When we transfer data internationally, we implement appropriate safeguards:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Standard contractual clauses approved by relevant authorities</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Adequacy decisions confirming sufficient data protection</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Your explicit consent to international transfer</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Use of hosting providers with international data protection certifications</span>
                  </li>
                </ul>
                <p className="mt-4">
                  By using our Service, you consent to the transfer of your information to countries outside your country of residence.
                </p>
              </div>
            </section>

            {/* 13. Changes to Policy */}
            <section id="changes" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">Changes to This Policy</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, and other factors. We will post any changes to this page with an updated &quot;Last Updated&quot; date.
                </p>
                <p>
                  Material changes will be communicated through:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Email notification to your registered email address</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Prominent notice on our homepage</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Request for explicit consent if required by law</span>
                  </li>
                </ul>
                <p className="mt-4">
                  Your continued use of our Service following notification of changes constitutes your acceptance of the updated Privacy Policy.
                </p>
              </div>
            </section>

            {/* 14. Contact Us */}
            <section id="contact" className="scroll-mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-4">Contact Us</h2>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                    <div className="flex gap-3 mb-3">
                      <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Email</h4>
                        <a href="mailto:privacy@ratego.org" className="text-primary hover:underline">
                          privacy@ratego.org
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-6 border border-primary/10">
                    <div className="flex gap-3 mb-3">
                      <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Phone</h4>
                        <a href="tel:+254734086120" className="text-primary hover:underline">
                          +254 734 086 120
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-6 border border-primary/10 md:col-span-2">
                    <div className="flex gap-3">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Mailing Address</h4>
                        <p className="text-muted-foreground">
                          Ratego Institute of Technology<br />
                          Nairobi, Kenya
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-6 border border-border mt-6">
                  <h3 className="font-semibold text-foreground mb-3">Data Protection Officer</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    For data protection inquiries and to exercise your rights:
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Email: <span className="font-semibold">dpo@ratego.org</span>
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    Response time: Within 30 days of receiving your request
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-3">Your Data Protection Rights</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    If you are not satisfied with our response to your data protection request, you have the right to lodge a complaint with:
                  </p>
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Office of the Data Protection Commissioner (Kenya)</span><br />
                    Email: complaint@dpc.go.ke<br />
                    Phone: +254 712 498 898
                  </p>
                </div>
              </div>
            </section>

            {/* Footer CTA */}
            <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/10">
              <h3 className="font-semibold text-foreground mb-2">Questions About Privacy?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                We&apos;re here to help. Contact our privacy team at privacy@ratego.org or call +254 734 086 120 during business hours.
              </p>
              <Link href="/contact" className="text-primary hover:underline font-semibold text-sm inline-flex items-center gap-1">
                Contact Support <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
