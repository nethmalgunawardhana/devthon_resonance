'use client';
import React from 'react';
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success'); 
  const formRef = useRef<HTMLFormElement>(null);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formRef.current) {
      setNotificationMessage('Form not found. Please try again.');
      setNotificationType('error');
      setShowNotification(true);
      setIsSubmitting(false);
      return;
    }

    emailjs.sendForm(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!, 
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!, 
      formRef.current, 
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    )
      .then((result) => {
        console.log('SUCCESS!', result.text);
        setNotificationMessage('Your message has been sent successfully!');
        setNotificationType('success');
        setShowNotification(true);
        formRef.current?.reset();
      })
      .catch((error) => {
        console.log('FAILED...', error.text);
        setNotificationMessage('Failed to send message. Please try again.');
        setNotificationType('error');
        setShowNotification(true);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTimeout(() => {
          setShowNotification(false);
        }, 5000);
      });
  };

  return (
    <div className="bg-white">
      <Navbar />
      <div className="pt-18">
        {/* Hero Section */}
        <section className="bg-[#770C0C] py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold text-white">Contact Us</h1>
            <p className="mt-4 text-lg text-white">
              Have questions or need assistance? We're here to help.
            </p>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="container mx-auto md:w-1/2 px-6 py-16">
          <div className="bg-white rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            <form ref={formRef} onSubmit={sendEmail}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="user_name"
                  className="mt-1 block w-full px-4 py-2 placeholder-gray-400 text-gray-800 border border-gray-300 rounded-lg focus:ring-[#770C0C] focus:border-[#770C0C]"
                  placeholder="Your Name"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="user_email"
                  className="mt-1 block w-full px-4 py-2 placeholder-gray-400 text-gray-800 border border-gray-300 rounded-lg focus:ring-[#770C0C] focus:border-[#770C0C]"
                  placeholder="Your Email"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="mt-1 block w-full px-4 py-2 placeholder-gray-400 text-gray-800 border border-gray-300 rounded-lg focus:ring-[#770C0C] focus:border-[#770C0C]"
                  placeholder="Your Message"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-[#770C0C] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#5d0a0a] transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>

        {/* Notification Popup */}
        {showNotification && (
          <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-md ${
            notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white transition-all duration-300`}>
            <div className="flex items-center">
              {notificationType === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
              <p>{notificationMessage}</p>
              <button 
                onClick={() => setShowNotification(false)}
                className="ml-4 text-white hover:text-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}