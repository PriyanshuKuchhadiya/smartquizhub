"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-bold mb-6 text-purple-700">Contact Us</h1>
      <p className="text-lg text-center max-w-2xl mb-6">
        We&apos;d love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out to us.
      </p>
      <form className="bg-gray-100 text-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1 text-purple-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1 text-purple-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your email"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium mb-1 text-purple-700">
            Message
          </label>
          <textarea
            id="message"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="4"
            placeholder="Your message"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 shadow-md"
        >
          Send Message
        </button>
      </form>

      {/* Home Button */}
      <Link href="/" passHref>
        <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 transition">
          Back to Home
        </button>
      </Link>
    </div>
  );
}
