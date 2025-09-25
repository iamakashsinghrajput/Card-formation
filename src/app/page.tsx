'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const [guestName, setGuestName] = useState('Shri Pritpal Singh Bhatti, DIG');
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (!cardRef.current || isDownloading) return;

    setIsDownloading(true);

    try {
      // Dynamically import html2canvas to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;

      // Temporarily remove the scaling transform for capture
      const cardElement = cardRef.current;
      const originalTransform = cardElement.style.transform;
      const originalClassName = cardElement.className;

      // Remove the invitation-card class temporarily to avoid scaling during capture
      cardElement.className = cardElement.className.replace('invitation-card', '');
      cardElement.style.transform = 'none';

      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: false,
        removeContainer: false,
        width: 525, // Fixed width
        height: 300, // Fixed height
        onclone: (clonedDoc) => {
          // Ensure all images are loaded and properly styled in the cloned document
          const images = clonedDoc.querySelectorAll('img');
          images.forEach(img => {
            img.style.display = 'block';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
          });

          // Remove any scaling transforms from cloned elements
          const scaledElements = clonedDoc.querySelectorAll('.invitation-card');
          scaledElements.forEach(el => {
            el.style.transform = 'none';
          });
        }
      });

      // Restore original transform and class
      cardElement.style.transform = originalTransform;
      cardElement.className = originalClassName;

      // Convert to blob for better mobile support
      canvas.toBlob((blob) => {
        if (!blob) return;

        const fileName = `BSF-Invitation-${guestName.replace(/\s+/g, '-')}.png`;

        // Check if we're on mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        if (isMobile && navigator.share) {
          // Use Web Share API on mobile if available
          const file = new File([blob], fileName, { type: 'image/png' });
          navigator.share({
            title: 'BSF Invitation Card',
            files: [file]
          }).catch(() => {
            // Fallback to traditional download
            fallbackDownload(blob, fileName);
          });
        } else {
          // Traditional download for desktop and fallback
          fallbackDownload(blob, fileName);
        }
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const fallbackDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-20 sm:w-32 h-20 sm:h-32 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-24 sm:w-40 h-24 sm:h-40 bg-purple-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 sm:w-24 h-16 sm:h-24 bg-indigo-200 rounded-full opacity-15 blur-lg"></div>

      {/* Header */}
      <header className="relative z-10 py-6 md:py-8 text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent mb-2">
          BSF Invitation Generator
        </h1>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium">Create beautiful personalized invitation cards</p>
      </header>

      <main className="flex-1 flex items-center justify-center px-2 sm:px-4 pb-6 sm:pb-8 relative z-10">
        <div className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Name Input Section */}
          <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-white/20">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
              <div className="flex-1">
                <label htmlFor="guestName" className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  🎯 Guest Name:
                </label>
                <input
                  id="guestName"
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-700 font-medium shadow-sm text-sm sm:text-base"
                  placeholder="Enter the guest name here..."
                />
              </div>
              <button
                onClick={downloadCard}
                disabled={isDownloading}
                className={`px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg text-sm sm:text-base whitespace-nowrap ${
                  isDownloading
                    ? 'from-gray-400 to-gray-500 cursor-not-allowed'
                    : 'from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isDownloading ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                    Processing...
                  </>
                ) : (
                  <>📥 Download Card</>
                )}
              </button>
            </div>
          </div>

          {/* Styled Invitation Card - Business Card Size (3.5" x 2" ratio) */}
          <div className="flex justify-center overflow-x-auto">
            <div
              ref={cardRef}
              className="invitation-card p-1 rounded-lg shadow-2xl hover:scale-105 transition-transform duration-300 flex-shrink-0"
              style={{
                width: '525px',
                height: '300px',
                backgroundColor: '#ffffff',
                minWidth: '320px'
              }}
            >
              {/* Blue outer border */}
              <div className="p-2 rounded-lg h-full" style={{ backgroundColor: '#001F5B' }}>
                {/* Red inner border */}
                <div className="p-1 rounded-sm h-full" style={{ backgroundColor: '#CB4335' }}>
                  {/* Main card content */}
                  <div className="p-4 relative h-full" style={{ backgroundColor: '#FDFBF5' }}>
                    {/* Watermark background */}
                    <div
                      className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-contain pointer-events-none"
                      style={{ backgroundImage: "url('/img2.png')" }}
                    ></div>
                    {/* Header with logos at corners */}
                    <div className="absolute top-2 left-0 right-0 z-10">
                      {/* BSF Logo - top left corner */}
                      <div className="absolute top-0 left-2 w-18 h-18 flex items-center justify-center overflow-hidden">
                        <img
                          src="/img2.png"
                          alt="BSF Logo"
                          width="60"
                          height="60"
                          style={{
                            width: '70px',
                            height: '70px',
                            objectFit: 'contain',
                            maxWidth: '100%',
                            maxHeight: '100%'
                          }}
                        />
                      </div>

                      {/* Crest Logo - top right corner */}
                      <div className="absolute top-0 right-2 w-16 h-16 flex items-center justify-center overflow-hidden">
                        <img
                          src="/img1.png"
                          alt="Crest Logo"
                          width="60"
                          height="60"
                          style={{
                            width: '60px',
                            height: '60px',
                            objectFit: 'contain',
                            maxWidth: '100%',
                            maxHeight: '100%'
                          }}
                        />
                      </div>
                    </div>

                    {/* Main invitation text */}
                    <div className="text-center space-y-1 relative z-10 px-2" style={{ marginTop: '50px' }}>
                      <p className="text-xs italic leading-tight" style={{ color: '#006A4E' }}>
                        All Officers of
                      </p>
                      <p className="text-xs leading-tight" style={{ color: '#1F2937' }}>
                        IG (HQ), FHQ BSF, New Delhi
                      </p>

                      <div className="py-1">
                        <p className="text-xs leading-tight" style={{ color: '#1F2937' }}>
                          Request the pleasure of the company of
                        </p>
                      </div>

                      <p className="text-sm font-bold underline decoration-1 underline-offset-2 leading-tight break-words" style={{ color: '#A42A28' }}>
                        {guestName}
                      </p>

                      <p className="text-xs leading-tight" style={{ color: '#1F2937' }}>
                        to
                      </p>

                      <p className="text-xs leading-tight" style={{ color: '#1F2937' }}>
                        Dinner at Officers Institute, 95 Bn BSF
                      </p>
                    </div>

                    {/* Footer with date, time, dress code, RSVP */}
                    <div className="absolute bottom-2 left-4 right-4 flex justify-between text-xs z-10" style={{ color: '#1F2937' }}>
                      <div>
                        <p>On: 27 Sept 2025</p>
                        <p>At: 1945 Hrs</p>
                      </div>
                      <div className="text-right">
                        <p>Dress: Open Collar</p>
                        <p>RSVP: 7763827537</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white py-4 sm:py-6 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-xs sm:text-sm font-medium">
              Crafted with ❤️ by{' '}
              <a
                href="https://portfolio-lyart-gamma-39.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-all duration-200 font-semibold hover:underline transform hover:scale-105 inline-block"
              >
                Akash Studios
              </a>
            </p>
            <p className="text-xs text-gray-400">
              © 2025 • BSF Invitation Generator • All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}