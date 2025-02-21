'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Globe, MapPin } from 'lucide-react';

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '+8801791918641',
      href: 'tel:+8801791918641',
      color: 'text-green-500'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'info@khs-aa.org',
      href: 'mailto:info@khs-aa.org',
      color: 'text-blue-500'
    },
    {
      icon: Globe,
      label: 'Website',
      value: 'www.khs-aa.org',
      href: 'https://www.khs-aa.org',
      color: 'text-purple-500'
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Kurchhap High School, Debidware, Bangladesh',
      href: 'https://maps.google.com/?q=Kurchhap High School, Debidware, Bangladesh',
      color: 'text-red-500'
    }
  ];

  return (
    <div className="container-wrapper max-w-6xl py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Get in Touch</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions or want to connect? Here&apos;s how you can reach us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {contactInfo.map((item, index) => (
            <motion.a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:bg-accent transition-all hover:scale-105"
            >
              <div className={`p-4 rounded-full bg-background ${item.color}`}>
                <item.icon className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-medium">{item.label}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.value}</p>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full h-[400px] rounded-lg overflow-hidden"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d29271.389952272606!2d90.985237!3d23.499256!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375466987fac6bc7%3A0x57d476d3c8a76f86!2sKurchap%20High%20School!5e0!3m2!1sen!2sbd!4v1739655206294!5m2!1sen!2sbd"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </motion.div>
    </div>
  );
}