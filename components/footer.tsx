import Link from 'next/link'
import Image from 'next/image'
import { Mail, MapPin, Phone, Mail as MailIcon, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react'
import { NewsletterSubscription } from '@/components/newsletter-subscription'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-50 mt-20">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-blue-100">Get notified about new programs, promotions, and exclusive updates.</p>
            </div>
            <NewsletterSubscription />
          </div>
        </div>
      </div>



      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="Ratego Institute of Technology" width={40} height={40} className="rounded-lg" />
              <span className="font-bold text-lg">Ratego</span>
            </div>
            <p className="text-slate-400 text-sm">
              Ratego — Practical skill-based training to help you master in-demand competencies.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-slate-400 hover:text-white transition">Home</Link></li>
              <li><Link href="/dashboard/programs" className="text-slate-400 hover:text-white transition">Courses</Link></li>
              <li><Link href="/dashboard/progress" className="text-slate-400 hover:text-white transition">Track Progress</Link></li>
              <li><Link href="/auth/login" className="text-slate-400 hover:text-white transition">Sign In</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/dashboard/certificates" className="text-slate-400 hover:text-white transition">My Certificates</Link></li>
              <li><Link href="/dashboard/live-lessons" className="text-slate-400 hover:text-white transition">Live Lessons</Link></li>
              <li><Link href="/apply" className="text-slate-400 hover:text-white transition">Apply Now</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-blue-400" />
                <span className="text-slate-400">Kenya</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <a href="tel:+254734086120" className="text-slate-400 hover:text-white transition">+254 734 086 120</a>
              </li>
              <li className="flex items-center gap-2">
                <MailIcon className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <a href="mailto:info@ratego.org" className="text-slate-400 hover:text-white transition">info@ratego.org</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-400 hover:text-white transition"><Facebook className="h-5 w-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition"><Twitter className="h-5 w-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition"><Linkedin className="h-5 w-5" /></a>
            <a href="#" className="text-slate-400 hover:text-white transition"><Instagram className="h-5 w-5" /></a>
          </div>
          <p className="text-slate-500 text-sm">© 2024 Ratego Institute of Technology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
