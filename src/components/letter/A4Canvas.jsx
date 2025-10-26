import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { A4_WIDTH_PX, A4_HEIGHT_PX, PX_PER_MM, getA4CanvasCSS } from '../../lib/din5008B';

/**
 * A4Canvas - Stable A4 canvas with fixed coordinate system
 * 
 * This component provides a stable A4 canvas that maintains exact DIN-5008-B
 * positioning regardless of browser zoom, device pixel ratio, or viewport size.
 * 
 * Scale Strategy:
 * - Screen: Canvas is scaled down to fit viewport using CSS transform: scale()
 * - Print: 1:1 rendering with @page { size: A4; margin: 0; }
 * - All child elements use absolute positioning relative to the canvas
 * - Positions are computed in mm and converted to px using --px-per-mm
 */
const A4Canvas = forwardRef(({ 
  children, 
  showGuides = false, 
  showFoldMarks = false, 
  showHoleMark = false,
  className = '',
  style = {},
  ...props 
}, ref) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [isPrinting, setIsPrinting] = useState(false);

  // Improved scaling that handles both width and height constraints
  const calculateScale = () => {
    if (isPrinting || !wrapperRef.current) return 1;
    
    const container = wrapperRef.current;
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Calculate scale based on both width and height
    const scaleX = containerWidth / A4_WIDTH_PX;
    const scaleY = containerHeight / A4_HEIGHT_PX;
    
    // Use the smaller scale to ensure it fits in both dimensions
    const scale = Math.min(scaleX, scaleY, 1);
    
    // Set reasonable limits based on screen size - balanced for page flow
    let minScale;
    if (window.innerWidth < 360) {
      minScale = 0.3; // Very small screens
    } else if (window.innerWidth < 640) {
      minScale = 0.4; // Mobile
    } else if (window.innerWidth < 768) {
      minScale = 0.5; // Small tablet
    } else {
      minScale = 0.6; // Desktop - good size for page flow
    }
    
    // Force scaling down very aggressively
    const finalScale = Math.max(scale, minScale);
    
    return finalScale;
  };

  // Handle print detection and scaling
  useEffect(() => {
    const updateScale = () => {
      setScale(calculateScale());
    };

    // Initial scale calculation
    updateScale();

    // Update scale on window resize
    const handleResize = () => updateScale();
    window.addEventListener('resize', handleResize);

    // Handle print events
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);
    
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, [isPrinting]);

  // Render fold and hole marks
  const renderMarks = () => {
    if (!showFoldMarks && !showHoleMark) return null;

    return (
      <>
        {/* Fold Mark 1 - 87mm from top */}
        {showFoldMarks && (
          <div
            className="print:block"
            style={{
              position: 'absolute',
              top: `${87 * PX_PER_MM}px`,
              left: `${1 * PX_PER_MM}px`,
              width: `${5 * PX_PER_MM}px`,
              height: 0,
              borderTop: `${0.2 * PX_PER_MM}px solid #C7C7C7`,
              zIndex: 100
            }}
          />
        )}

        {/* Fold Mark 2 - 192mm from top */}
        {showFoldMarks && (
          <div
            className="print:block"
            style={{
              position: 'absolute',
              top: `${192 * PX_PER_MM}px`,
              left: `${1 * PX_PER_MM}px`,
              width: `${5 * PX_PER_MM}px`,
              height: 0,
              borderTop: `${0.2 * PX_PER_MM}px solid #C7C7C7`,
              zIndex: 100
            }}
          />
        )}

        {/* Hole Mark - 148.5mm from top */}
        {showHoleMark && (
          <div
            className="print:block"
            style={{
              position: 'absolute',
              top: `${148.5 * PX_PER_MM}px`,
              left: `${1 * PX_PER_MM}px`,
              width: `${8 * PX_PER_MM}px`,
              height: 0,
              borderTop: `${0.2 * PX_PER_MM}px solid #C7C7C7`,
              zIndex: 100
            }}
          />
        )}
      </>
    );
  };

  // Render DIN 5008-B guides (screen only, hidden on mobile)
  const renderGuides = () => {
    if (!showGuides) return null;
    
    // Hide guides on mobile screens
    if (window.innerWidth < 768) return null;

    return (
      <div 
        className="print:hidden"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 10
        }}
      >
        {/* Page margins */}
        <div style={{
          position: 'absolute',
          top: `${45 * PX_PER_MM}px`,
          left: `${25 * PX_PER_MM}px`,
          right: `${20 * PX_PER_MM}px`,
          bottom: `${25 * PX_PER_MM}px`,
          border: '2px dashed rgb(96, 165, 250)',
          opacity: 0.3
        }} />
        
        {/* Sender block (45mm to 62.7mm) */}
        <div style={{
          position: 'absolute',
          top: `${45 * PX_PER_MM}px`,
          left: `${25 * PX_PER_MM}px`,
          width: `${85 * PX_PER_MM}px`,
          height: `${17.7 * PX_PER_MM}px`,
          border: '1px dashed rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          opacity: 0.2
        }} />
        <div style={{
          position: 'absolute',
          top: `${44 * PX_PER_MM}px`,
          left: `${25 * PX_PER_MM}px`,
          fontSize: '8px',
          color: 'rgb(147, 51, 234)',
          fontFamily: 'monospace'
        }}>Absender (45-62.7mm)</div>
        
        {/* Recipient address window (62.7mm to 90mm) */}
        <div style={{
          position: 'absolute',
          top: `${62.7 * PX_PER_MM}px`,
          left: `${25 * PX_PER_MM}px`,
          width: `${85 * PX_PER_MM}px`,
          height: `${27.3 * PX_PER_MM}px`,
          border: '2px dashed rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          opacity: 0.2
        }} />
        <div style={{
          position: 'absolute',
          top: `${61.7 * PX_PER_MM}px`,
          left: `${25 * PX_PER_MM}px`,
          fontSize: '8px',
          color: 'rgb(34, 197, 94)',
          fontFamily: 'monospace'
        }}>Anschrift (62.7-90mm)</div>
        
        {/* Main text field (Textfeld) - starts 8.46mm below recipient address window, ends 4cm from bottom */}
        <div style={{
          position: 'absolute',
          top: `${98.46 * PX_PER_MM}px`,
          left: `${25 * PX_PER_MM}px`,
          right: `${20 * PX_PER_MM}px`,
          bottom: `${40 * PX_PER_MM}px`,
          border: '2px dashed rgb(96, 165, 250)',
          backgroundColor: 'rgba(96, 165, 250, 0.1)',
          opacity: 0.2
        }} />
        <div style={{
          position: 'absolute',
          top: `${97.46 * PX_PER_MM}px`,
          left: `${25 * PX_PER_MM}px`,
          fontSize: '8px',
          color: 'rgb(96, 165, 250)',
          fontFamily: 'monospace'
        }}>Textfeld</div>
        
        {/* Info box area */}
        <div style={{
          position: 'absolute',
          top: `${50 * PX_PER_MM}px`,
          left: `${125 * PX_PER_MM}px`,
          width: `${75 * PX_PER_MM}px`,
          height: `${40 * PX_PER_MM}px`,
          border: '2px dashed rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          opacity: 0.2
        }} />
        <div style={{
          position: 'absolute',
          top: `${49 * PX_PER_MM}px`,
          left: `${125 * PX_PER_MM}px`,
          fontSize: '8px',
          color: 'rgb(249, 115, 22)',
          fontFamily: 'monospace'
        }}>Info-Block</div>
        
        {/* Footer area */}
        <div style={{
          position: 'absolute',
          bottom: `${10 * PX_PER_MM}px`,
          left: `${25 * PX_PER_MM}px`,
          right: `${20 * PX_PER_MM}px`,
          height: `${25 * PX_PER_MM}px`,
          border: '2px dashed rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          opacity: 0.2
        }} />
        <div style={{
          position: 'absolute',
          bottom: `${34 * PX_PER_MM}px`,
          left: `${25 * PX_PER_MM}px`,
          fontSize: '8px',
          color: 'rgb(239, 68, 68)',
          fontFamily: 'monospace'
        }}>Fußzeile</div>
      </div>
    );
  };

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          .a4-canvas, .a4-canvas * {
            visibility: visible !important;
          }
          
          .a4-canvas {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: ${A4_WIDTH_PX}px !important;
            height: ${A4_HEIGHT_PX}px !important;
            transform: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: white !important;
            overflow: visible !important;
          }
          
          .a4-canvas > * {
            position: absolute !important;
          }
          
          @page {
            size: A4;
            margin: 0;
            padding: 0;
          }
        }
        
        /* DIN 5008 Typography - Optimized for PDF text rendering */
        .din-text {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11pt;
          line-height: 1.15;
          color: #000;
          font-weight: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .din-9pt {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9pt;
          line-height: 1.15;
          color: #000;
          font-weight: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .din-address-main {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10pt;
          line-height: 1.15;
          color: #000;
          font-weight: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Ensure text is selectable and searchable */
        .a4-canvas * {
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }
      `}</style>

      {/* Canvas Wrapper - Handles scaling for screen preview */}
      <div
        ref={wrapperRef}
        className={`w-full flex justify-center items-center ${className}`}
        style={{
          ...style,
          ...getA4CanvasCSS()
        }}
        {...props}
      >
        {/* A4 Canvas - Fixed coordinate system */}
        <div
          ref={(node) => {
            canvasRef.current = node;
            if (ref) {
              if (typeof ref === 'function') {
                ref(node);
              } else {
                ref.current = node;
              }
            }
          }}
          className="a4-canvas bg-white shadow-xl print:shadow-none relative"
          style={{
            ...getA4CanvasCSS(),
            width: `${A4_WIDTH_PX}px`,
            height: `${A4_HEIGHT_PX}px`,
            transform: isPrinting ? 'none' : `scale(${scale})`,
            transformOrigin: 'center',
            // Prevent any layout reflow under zoom
            contain: 'layout style paint',
            // Ensure consistent rendering
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            // Disable text selection during scaling to prevent layout issues
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        >
          {/* Fold and hole marks */}
          {renderMarks()}
          
          {/* DIN 5008-B guides */}
          {renderGuides()}
          
          {/* Letter content - children are positioned absolutely within this canvas */}
          <div className="relative w-full h-full">
            {children}
          </div>
        </div>
      </div>
    </>
  );
});

A4Canvas.displayName = 'A4Canvas';

export default A4Canvas;
