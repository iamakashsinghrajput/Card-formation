'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function HomePage() {
  const [guestName, setGuestName] = useState('Shri Pritpal Singh Bhatti, DIG');
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (!cardRef.current) return;

    // Dynamically import html2canvas to avoid SSR issues
    const html2canvas = (await import('html2canvas')).default;

    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: null, // Don't override background colors
      scale: 3, // Even higher resolution
      useCORS: true,
      allowTaint: true,
      logging: false,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: false, // Better color rendering
      removeContainer: false,
    });

    const link = document.createElement('a');
    link.download = `BSF-Invitation-${guestName.replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Name Input */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 mb-2">
                Guest Name:
              </label>
              <input
                id="guestName"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter guest name..."
              />
            </div>
            <button
              onClick={downloadCard}
              className="px-4 py-2 bg-invite-blue text-white rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-invite-blue focus:ring-opacity-50 transition-colors"
            >
              Download Card
            </button>
          </div>
        </div>

        {/* Styled Invitation Card - Business Card Size (3.5" x 2" ratio) */}
        <div
          ref={cardRef}
          className="p-1 rounded-lg shadow-2xl mx-auto"
          style={{
            width: '525px',
            height: '300px',
            backgroundColor: '#ffffff'
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
                <div className="absolute top-4 left-0 right-0 z-10">
                  {/* BSF Logo - top left corner */}
                  <div className="absolute top-0 left-4 w-20 h-20 flex items-center justify-center">
                    <img
                      src="/img2.png"
                      alt="BSF Logo"
                      width="70"
                      height="70"
                      style={{ maxWidth: '70px', maxHeight: '70px', objectFit: 'contain' }}
                    />
                  </div>

                  {/* Crest Logo - top right corner */}
                  <div className="absolute -top-3 right-4 w-20 h-24 flex items-center justify-center">
                    <img
                      src="/img1.png"
                      alt="Crest Logo"
                      width="70"
                      height="84"
                      style={{ maxWidth: '60px', maxHeight: '60px', objectFit: 'contain' }}
                    />
                  </div>
                </div>

                {/* Main invitation text */}
                <div className="text-center space-y-1 relative z-10" style={{ marginTop: '50px' }}>
                  <p className="text-xs italic" style={{ color: '#006A4E' }}>
                    All Officers of
                  </p>
                  <p className="text-xs" style={{ color: '#1F2937' }}>
                    IG (HQ), FHQ BSF, New Delhi
                  </p>

                  <div className="py-1">
                    <p className="text-xs" style={{ color: '#1F2937' }}>
                      Request the pleasure of the company of
                    </p>
                  </div>

                  <p className="text-sm font-bold underline decoration-1 underline-offset-2" style={{ color: '#A42A28' }}>
                    {guestName}
                  </p>

                  <p className="text-xs" style={{ color: '#1F2937' }}>
                    to
                  </p>

                  <p className="text-xs" style={{ color: '#1F2937' }}>
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
    </main>
  );
}