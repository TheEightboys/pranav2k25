import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Download, Calendar, MapPin, Star, ArrowDown, Share2, Instagram, Linkedin, Music, Volume2, VolumeX } from "lucide-react";
import './hero.css'

const Hero = () => {
  const [currentTextMode, setCurrentTextMode] = useState(0);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [shootingStarsDone, setShootingStarsDone] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  // Constellation data remains the same
  const constellations = [
    {
      name: "Aries",
      stars: [
        { x: 20, y: 30, size: 2, brightness: 0.7 }, // Reduced star size for mobile
        { x: 22, y: 32, size: 3, brightness: 1 },   // Reduced star size for mobile
        { x: 25, y: 28, size: 2, brightness: 0.8 }, // Reduced star size for mobile
        { x: 27, y: 33, size: 1.5, brightness: 0.5 } // Reduced star size for mobile
      ],
      connections: [
        [0, 1],
        [1, 2],
        [2, 3]
      ],
      color: "text-yellow-300"
    },
    {
      name: "Orion",
      stars: [
        { x: 50, y: 40, size: 3, brightness: 1 },   // Reduced star size for mobile
        { x: 52, y: 42, size: 4, brightness: 1 },   // Reduced star size for mobile
        { x: 54, y: 38, size: 2.5, brightness: 0.8 }, // Reduced star size for mobile
        { x: 56, y: 43, size: 3, brightness: 0.9 }   // Reduced star size for mobile
      ],
      connections: [
        [0, 1],
        [1, 2],
        [2, 3]
      ],
      color: "text-blue-300"
    }
  ];

  const globalConnections = [
    { from: { constellation: "Aries", starIndex: 3 }, to: { constellation: "Orion", starIndex: 0 } }
  ];

  const textModes = [
    "PRANAV 2K25",
    "π 2K25",
    "Π^2 * K^25",
    "ΜΥΘΟΛΟΓΙΑ",
    "ப்ரணவ் 2025",
    "ΠΡΟΜΗΘΕΑΣ",
  ];

  // Event details with maps URLs
  const eventDetails = {
    date: "April 16, 2025",
    venue: "Meenakshi Sundararajan Engineering College",
    venueMapUrl: "https://maps.google.com/?q=Meenakshi+Sundararajan+Engineering+College,+Chennai",
    description: "Experience the fusion of ancient Greek wisdom and modern technological innovation at our one-day symposium. PRANAV 2K25 brings together mythology and technology in a unique academic celebration that bridges centuries of human knowledge.",
    websiteUrl: "https://msec.edu.in"
  };

  // Social media links
  const socialMediaLinks = [
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/__pranav2k25_", color: "bg-gradient-to-br from-purple-600 to-pink-500" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/company/pranav2k25", color: "bg-blue-600" }
  ];

  // Audio controls - added as requested
  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    // Placeholder for actual audio functionality
  };

  // Add favicon to the document head
  useEffect(() => {
    const favicon = document.createElement('link');
    favicon.rel = 'shortcut icon';
    favicon.href = '/favicon.ico';
    document.head.appendChild(favicon);

    return () => {
      const existingFavicon = document.querySelector("link[rel='shortcut icon']");
      if (existingFavicon) {
        document.head.removeChild(existingFavicon);
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    // Show shooting stars first, then reveal the title
    const shootingStarsTimer = setTimeout(() => {
      setShootingStarsDone(true);
    }, 3000);

    // Show title after shooting stars animation
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 3500);

    // Start cycling through text modes after title appears
    const textModeTimer = setInterval(() => {
      setCurrentTextMode((prev) => (prev + 1) % textModes.length);
    }, 2000);

    // Hide scroll indicator after 10 seconds
    const scrollTimer = setTimeout(() => {
      setShowScrollIndicator(false);
    }, 10000);

    return () => {
      clearTimeout(shootingStarsTimer);
      clearTimeout(titleTimer);
      clearInterval(textModeTimer);
      clearTimeout(scrollTimer);
    };
  }, [textModes.length]);

  // Function to handle sharing the event with improved formatting
  const handleShare = async () => {
    try {
      const shareText = `Join us for PRANAV 2K25: National Level Technical Symposium on ${eventDetails.date} at ${eventDetails.venue}. Learn more at ${eventDetails.websiteUrl}`;

      if (navigator.share) {
        await navigator.share({
          title: 'PRANAV 2K25 Symposium',
          text: shareText,
          url: eventDetails.websiteUrl,
        });
      } else {
        navigator.clipboard.writeText(shareText);
        alert('Event details copied to clipboard! Share with your friends and colleagues.');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const backgroundStars = Array.from({ length: 70 }, (_, i) => ({ // Reduced background star count
    id: `star-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5, // Reduced background star size
    opacity: Math.random() * 0.6 + 0.4 // Slightly more opaque
  }));

  const nebulaElements = Array.from({ length: 3 }, (_, i) => ({ // Reduced nebula count
    id: `nebula-${i}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 20 + 5, // Reduced nebula size
    color: `rgba(${Math.random() * 200 + 55}, ${Math.random() * 200 + 55}, ${Math.random() * 200 + 55}, 0.08)` // Slightly less transparent
  }));

  const currentText = textModes[currentTextMode].split("");

  const findConstellationByName = (name) => {
    if (!name) return null;
    return constellations.find(c =>
      c.name.toLowerCase() === name.toLowerCase()
    ) || null;
  };

  // Shooting stars data - Further adjusted for mobile visibility
  const shootingStars = [
    { id: 'star-1', startX: 5, startY: 5, endX: 55, endY: 35, duration: 1.2, delay: 0, size: 1 }, // Smaller and faster
    { id: 'star-2', startX: 95, startY: 10, endX: 45, endY: 50, duration: 1.5, delay: 0.5, size: 1.3 } // Smaller and faster
  ];

  return (
    <section id='hero' className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0B1026] via-[#0D1C3D] to-[#0B1026]">
      {/* Add meta viewport tag to ensure proper mobile scaling */}
      <motion.div
        className="fixed top-0 left-0 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </motion.div>

      {/* Fixed top bar for navigation controls - IMPROVED RESPONSIVENESS AND SPACING */}
      <motion.div
        className="fixed top-0 left-0 right-0 px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center z-30" // Reduced padding
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        {/* Logo/brand placeholder - left side */}
        <motion.div
          className="rounded-full bg-white/5 backdrop-blur-sm p-2 sm:p-2" // Further reduced padding
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >

        </motion.div>

        {/* Music toggle button - right side - ADDED AS REQUESTED */}
        <motion.button
          onClick={toggleMusic}
          className="flex items-center p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all gap-2" // Reduced padding
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ?
            <Volume2 className="w-4 h-4 text-white" /> :
            <VolumeX className="w-4 h-4 text-white" />
          }

        </motion.button>
      </motion.div>

      {/* Social Media Links - Fixed on the side - IMPROVED RESPONSIVENESS */}
      <motion.div
        className="fixed left-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 z-30 md:flex hidden" // Reduced left margin and spacing, hidden on mobile
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, staggerChildren: 0.1 }}
      >
        {socialMediaLinks.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1.5 rounded-full ${link.color} text-white hover:scale-110 transition-all`} // Reduced padding
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2 + (index * 0.1) }}
          >
            <link.icon className="w-4 h-4" /> {/* Reduced icon size */}
          </motion.a>
        ))}
      </motion.div>

      {/* Mobile Social Media Links - Only visible on small screens - IMPROVED POSITIONING */}
      <motion.div
        className="fixed bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4 z-30 md:hidden" // Reduced bottom margin and spacing
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        {socialMediaLinks.map((link) => (
          <motion.a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full ${link.color} text-white hover:scale-110 transition-all`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <link.icon className="w-5 h-5" />
          </motion.a>
        ))}
      </motion.div>

      {/* Nebula Elements */}
      {nebulaElements.map(nebula => (
        <motion.div
          key={nebula.id}
          className="absolute rounded-full blur-2xl" // Slightly less blur
          style={{
            width: `${nebula.size}px`,
            height: `${nebula.size}px`,
            left: `${nebula.x}%`,
            top: `${nebula.y}%`,
            backgroundColor: nebula.color
          }}
          animate={{
            scale: [1, 1.05, 1] // Reduced scale animation
          }}
          transition={{
            duration: 20, // Faster animation
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}

      {/* Background Mount Olympus */}
      <div className="absolute inset-0 opacity-15"> {/* Reduced opacity */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:"rgba(255,255,255,0.08)"}} /> {/* Reduced opacity */}
              <stop offset="100%" style={{stopColor:"rgba(200,200,255,0.03)"}} /> {/* Reduced opacity */}
            </linearGradient>
          </defs>
          <path
            d="M0 100 L20 40 L40 70 L60 30 L80 60 L100 100 Z"
            fill="url(#mountainGradient)"
          />
        </svg>
      </div>

      {/* Background stars */}
      {backgroundStars.map(star => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.x}%`,
            top: `${star.y}%`,
            opacity: star.opacity
          }}
        />
      ))}

      {/* Shooting Stars Animation - Further adjusted for mobile visibility */}
      {shootingStars.map(star => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full z-10"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          initial={{
            x: `${star.startX}%`,
            y: `${star.startY}%`,
            scale: 0,
            opacity: 0
          }}
          animate={{
            x: `${star.endX}%`,
            y: `${star.endY}%`,
            scale: [0, 1.3, 1], // Reduced max scale
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            ease: "easeOut"
          }}
        >
          {/* Trailing effect - Even more reduced length for mobile */}
          <motion.div
            className="absolute top-0 left-0 w-6 h-0.5 bg-gradient-to-r from-transparent via-white to-blue-300 blur-sm"
            style={{
              transformOrigin: 'right center',
              transform: `translateX(-100%) rotate(${star.startX < star.endX ? '-' : ''}45deg)`
            }}
          />
        </motion.div>
      ))}

      {/* Shooting Star Collision Effect - Only shows at end of shooting star animations */}
      {shootingStarsDone && (
        <motion.div
          className="absolute rounded-full blur-md z-20"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(100,149,237,0.5) 50%, rgba(0,0,255,0) 100%)'
          }}
          initial={{ width: '0px', height: '0px', opacity: 0 }}
          animate={{ width: '100px', height: '100px', opacity: [0, 1, 0] }} // Further reduced size
          transition={{ duration: 1 }} // Slightly faster
        />
      )}

      {/* Constellations */}
      {constellations.map((constellation, constellationIndex) => (
        <motion.div
          key={constellation.name}
          className="absolute w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.5, // Slightly faster
            delay: constellationIndex * 2.5 // Slightly shorter delay
          }}
        >
          {/* Stars */}
          {constellation.stars.map((star, starIndex) => (
            <div
              key={`${constellation.name}-star-${starIndex}`}
              className={`absolute ${constellation.color} flex items-center justify-center`}
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size * 1.5}px`, // Slightly smaller star size
                height: `${star.size * 1.5}px` // Slightly smaller star size
              }}
            >
              <Star
                className="w-full h-full"
                fill={constellation.color.replace('text-', 'currentColor')}
                stroke="none"
                opacity={star.brightness}
              />
            </div>
          ))}

          {/* Connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            {constellation.connections.map((connection, connectionIndex) => {
              const startStar = constellation.stars[connection[0]];
              const endStar = constellation.stars[connection[1]];

              return (
                <motion.line
                  key={`${constellation.name}-connection-${connectionIndex}`}
                  x1={`${startStar.x}%`}
                  y1={`${startStar.y}%`}
                  x2={`${endStar.x}%`}
                  y2={`${endStar.y}%`}
                  stroke={constellation.color.replace('text-', '')}
                  strokeWidth="0.8" // Thinner lines
                  strokeOpacity="0.6" // Slightly less opaque
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.5, // Slightly faster
                    delay: connectionIndex * 0.4 + (constellationIndex * 2.5) // Shorter delay
                  }}
                />
              );
            })}
          </svg>
        </motion.div>
      ))}

      {/* Global Connections */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        {globalConnections.map((connection, index) => {
          const startConstellation = findConstellationByName(connection.from.constellation);
          const endConstellation = findConstellationByName(connection.to.constellation);

          if (!startConstellation || !endConstellation) {
            return null;
          }

          if (!startConstellation.stars[connection.from.starIndex] ||
              !endConstellation.stars[connection.to.starIndex]) {
            return null;
          }

          const startStar = startConstellation.stars[connection.from.starIndex];
          const endStar = endConstellation.stars[connection.to.starIndex];

          return (
            <motion.line
              key={`global-connection-${index}`}
              x1={`${startStar.x}%`}
              y1={`${startStar.y}%`}
              x2={`${endStar.x}%`}
              y2={`${endStar.y}%`}
              stroke="white"
              strokeWidth="0.8" // Thinner line
              strokeOpacity="0.4" // Less opaque
              strokeDasharray="4 4" // Smaller dashes
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2.5, // Faster
                delay: 6 // Earlier
              }}
            />
          );
        })}
      </svg>

      {/* Content section - IMPROVED RESPONSIVENESS AND ADDED SPACE FROM NAVBAR */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 sm:px-8 w-full max-w-4xl mx-auto h-full">
        {/* Main content container with safe area for all device sizes */}
        <div className="flex flex-col items-center justify-center pt-16 sm:pt-20 md:pt-24 pb-20 sm:pb-16"> {/* Reduced top and bottom padding */}
          {/* Title with animated characters - Only shows after shooting stars collision */}
          <div className="relative mb-3 sm:mb-4 flex items-center justify-center w-full"> {/* Reduced margin */}
            {showTitle && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTextMode}
                  className="flex space-x-1 sm:space-x-2 overflow-hidden py-1 sm:py-2" // Reduced spacing and padding
                  initial={{ opacity: 0, y: 30 }} // Reduced initial y
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }} // Reduced exit y
                  transition={{ duration: 0.6 }} // Faster transition
                >
                  {currentText.map((char, index) => (
                    <motion.span
                      key={index}
                      // More responsive text sizing that scales better on all devices
                      className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold inline-block" // Reduced base size
                      style={{
                        textShadow: "0 0 8px rgba(255,255,255,0.4)" // Reduced shadow
                      }}
                      initial={{
                        rotateY: 180,
                        opacity: 0
                      }}
                      animate={{
                        rotateY: 0,
                        opacity: 1,
                        color: index % 2 === 0 ? '#FFD700' : '#FFFFFF'
                      }}
                      transition={{
                        duration: 0.4, // Faster transition
                        delay: index * 0.03, // Shorter delay
                        type: "spring",
                        damping: 10 // Reduced damping
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Subtitle with responsive sizing - Shows slightly after title */}
          {showTitle && (
            <motion.h2
              className="text-xs sm:text-sm md:text-lg lg:text-xl xl:text-2xl font-medium mb-3 sm:mb-4 md:mb-6 max-w-xs sm:max-w-sm md:max-w-lg text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-yellow-300" // Reduced font sizes and margin
              initial={{ opacity: 0, y: 15 }} // Reduced initial y
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }} // Faster and earlier
            >
              A National Level Technical Symposium<br />
              Greek Mythology & Innovation
            </motion.h2>
          )}

          {/* About section - added as requested - IMPROVED RESPONSIVE PADDING */}
          {showTitle && (
            <motion.div
              className="mb-4 px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/5 backdrop-blur-sm max-w-md text-center" // Reduced margin and padding
              initial={{ opacity: 0, y: 15 }} // Reduced initial y
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }} // Faster and earlier
            >
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                {eventDetails.description} Visit us at{' '}
                <a
                  href={eventDetails.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 hover:underline"
                >
                  https://msec.edu.in
                </a>
              </p>
            </motion.div>
          )}

          {/* Register and Share buttons positioned together - FIXED AS REQUESTED */}
          {showTitle && (
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3" // Reduced gap
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }} // Faster and earlier
            >
             <motion.a
  href="#register"
  className="register-button w-full sm:w-auto"
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={(e) => { /* Your existing click logic if any */ }}
  onTouchEnd={(e) => {
    // Prevent default touch behavior that might interfere with scrolling
    e.preventDefault();
    window.location.hash = '#register'; // Force navigation
  }}
>
                <Download className="mr-2 w-4 h-4" /> Register Now
                </motion.a>
              <motion.button
                onClick={handleShare}
                className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/20 transition-all flex items-center justify-center text-sm md:text-base w-full sm:w-auto" // Reduced padding and font size
                whileHover={{ scale: 1.03 }} // Reduced hover scale
                whileTap={{ scale: 0.97 }} // Reduced tap scale
                aria-label="Share event"
              >
                <Share2 className="mr-2 w-4 h-4" /> Share Event
              </motion.button>
            </motion.div>
          )}

          {/* Event details cards - IMPROVED RESPONSIVENESS AND SPACING */}
          {showTitle && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 sm:mt-6 w-full max-w-md mx-auto"> {/* Reduced gap and margin */}
              {/* Date card */}
              <motion.div
                className="flex items-center p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-blue-400 hover:bg-white/20 transition-all duration-300" // Reduced padding
                initial={{ opacity: 0, y: 15 }} // Reduced initial y
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }} // Earlier
              >
                <Calendar className="mr-2 w-4 h-4 flex-shrink-0" /> {/* Reduced icon size */}
                <div>
                  <h3 className="font-bold text-xs">Event Date</h3> {/* Reduced font size */}
                  <p className="text-xs text-white/80 mt-1">{eventDetails.date}</p> {/* Reduced font size */}
                </div>
              </motion.div>

              {/* Venue with Google Maps link */}
              <motion.a
                href={eventDetails.venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-green-500 hover:bg-white/20 transition-all duration-300" // Reduced padding
                initial={{ opacity: 0, y: 15 }} // Reduced initial y
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }} // Earlier
                whileHover={{ scale: 1.02 }} // Reduced hover scale
                whileTap={{ scale: 0.99 }} // Reduced tap scale
              >
                <MapPin className="mr-2 w-4 h-4 flex-shrink-0" /> {/* Reduced icon size */}
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold text-xs">Venue</h3> {/* Reduced font size */}
                  <p className="text-xs text-white/80 mt-1 truncate">{eventDetails.venue}</p> {/* Reduced font size */}
                </div>
              </motion.a>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator - IMPROVED POSITIONING */}
      {showScrollIndicator && showTitle && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20" // Reduced bottom margin
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }} // Reduced y animation
          transition={{
            opacity: { delay: 1.5, duration: 0.8 }, // Earlier and faster
            y: { repeat: Infinity, duration: 1.2 } // Faster y animation
          }}
        >
          <p className="text-xs text-white text-center mb-1 opacity-60">Scroll to discover events</p> {/* Reduced font size and added text-center */}
          <ArrowDown className="text-white w-4 h-4 animate-bounce" /> {/* Reduced icon size */}
        </motion.div>
      )}
    </section>
  );
};

export default Hero;