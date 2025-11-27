import { useState, useEffect } from 'react';

export default function About() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const smartCityImages = [
    {
      url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
      alt: 'Smart City Infrastructure',
      caption: 'Modern smart city infrastructure with IoT sensors'
    },
    {
      url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=800&h=600&fit=crop',
      alt: 'Urban Waste Management',
      caption: 'Efficient waste collection in urban areas'
    },
    {
      url: 'https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800&h=600&fit=crop',
      alt: 'Smart Bins Technology',
      caption: 'Automated smart bins with fill-level sensors'
    },
    {
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      alt: 'Electric Waste Collection Vehicles',
      caption: 'Eco-friendly electric vehicles for waste collection'
    },
    {
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
      alt: 'Smart City Control Center',
      caption: 'Central monitoring and control systems'
    },
    {
      url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
      alt: 'Solar Powered Infrastructure',
      caption: 'Renewable energy integration in waste management'
    },
    {
      url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
      alt: 'Digital City Management',
      caption: 'AI-powered city management systems'
    },
    {
      url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
      alt: 'Sustainable Urban Development',
      caption: 'Green initiatives for sustainable cities'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === smartCityImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [smartCityImages.length]);

  const goToPrevious = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? smartCityImages.length - 1 : currentImageIndex - 1);
  };

  const goToNext = () => {
    setCurrentImageIndex(currentImageIndex === smartCityImages.length - 1 ? 0 : currentImageIndex + 1);
  };

  const goToSlide = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About Smart Waste Management</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">Revolutionizing urban cleanliness through intelligent technology</p>
      </div>

      {/* Image Carousel */}
      <div className="relative mb-12 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
        <div className="relative h-96 md:h-[500px]">
          {smartCityImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <p className="text-white text-lg font-semibold">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {smartCityImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentImageIndex
                  ? 'bg-white'
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300">
            To create cleaner, more sustainable cities by leveraging cutting-edge technology for efficient waste management.
            We combine IoT sensors, AI-powered routing, and real-time monitoring to optimize waste collection processes.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Our Vision</h2>
          <p className="text-gray-600 dark:text-gray-300">
            A world where waste management is proactive, efficient, and environmentally friendly.
            We envision smart cities where technology works seamlessly to maintain cleanliness and sustainability.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">What We Do</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Smart Monitoring</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Real-time bin level monitoring with IoT sensors</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">AI Routing</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Optimized collection routes using machine learning</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Real-time Tracking</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Live vehicle tracking and collection updates</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">Join Us in Making Cities Cleaner</h2>
        <p className="mb-4">
          Whether you're a citizen reporting an issue, an employee collecting waste, or an administrator managing operations,
          our platform empowers everyone to contribute to a cleaner environment.
        </p>
        <div className="flex flex-wrap gap-4">
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Citizens</span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Employees</span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Supervisors</span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Administrators</span>
        </div>
      </div>
    </div>
  )
}
