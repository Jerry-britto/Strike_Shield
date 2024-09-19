import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-12">
        <div className="flex flex-col md:flex-row items-center mb-8">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
            <p className="text-lg text-gray-600 mb-4">
              Welcome to <span className="font-semibold text-orange-600">StrikeShield</span>—your ultimate destination for premium boxing gloves and accessories. We pride ourselves on delivering top-quality products that help athletes of all levels perform at their best.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              At StrikeShield, we believe in rewarding our customers. As a token of appreciation, new users receive 10,000 tokens upon registration. If your order exceeds your current token balance, you can easily receive an additional 5,000 tokens by providing your email and password. Please note, once you exhaust your tokens, additional tokens cannot be granted.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Enjoy exclusive discounts with our promotional offers! Orders with 10 or more items automatically receive a 10% discount. Please be aware that a 3% GST will be applied to every order. If your order total is less than 50 rupees, a delivery charge of 500 rupees will be added.
            </p>
          </div>
          <div className="md:w-1/2 mt-6 md:mt-0">
            <img
              src="https://cdn.pixabay.com/photo/2024/07/10/07/34/boxing-8885123_640.png" 
              alt="Boxing Gloves"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
        
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img
              src="https://example.com/images/quality.jpg" // Replace with your image URL
              alt="Quality"
              className="w-full rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">High Quality</h3>
            <p className="text-gray-600">
              Our boxing gloves are crafted for maximum comfort and durability, ensuring that you get the best performance and protection.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <img
              src="https://example.com/images/style.jpg" // Replace with your image URL
              alt="Variety"
              className="w-full rounded-lg mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Wide Range</h3>
            <p className="text-gray-600">
              We offer a diverse range of styles and sizes to fit all your boxing needs, from training to professional matches.
            </p>
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-4">
          Our team is passionate about boxing and is committed to providing you with the best products and services. We are here to support your journey, whether you’re a professional athlete or just starting out.
        </p>
        <p className="text-lg text-gray-600">
          Thank you for choosing StrikeShield. We look forward to serving you and helping you achieve your boxing goals.
        </p>
      </div>
    </div>
  );
}
