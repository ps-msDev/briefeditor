import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw, Smartphone, Monitor } from 'lucide-react';

/**
 * ZoomTestHelper - Component to test zoom stability and mobile behavior
 * 
 * This component provides controls to test the A4Canvas at different zoom levels
 * and simulate mobile viewport sizes to ensure stable positioning.
 */
export default function ZoomTestHelper({ onZoomChange, onViewportChange }) {
  const [browserZoom, setBrowserZoom] = useState(100);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [isMobile, setIsMobile] = useState(false);

  // Detect browser zoom level
  useEffect(() => {
    const detectZoom = () => {
      const zoom = Math.round(window.devicePixelRatio * 100);
      setBrowserZoom(zoom);
    };

    detectZoom();
    window.addEventListener('resize', detectZoom);
    return () => window.removeEventListener('resize', detectZoom);
  }, []);

  // Monitor viewport changes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setIsMobile(width < 768);
      if (onViewportChange) onViewportChange({ width, isMobile: width < 768 });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onViewportChange]);

  const zoomLevels = [50, 75, 80, 90, 100, 110, 125, 150, 175, 200];
  const viewportPresets = [
    { name: 'Mobile', width: 375, icon: Smartphone },
    { name: 'Tablet', width: 768, icon: Monitor },
    { name: 'Desktop', width: 1200, icon: Monitor },
    { name: 'Large', width: 1920, icon: Monitor }
  ];

  const handleZoomTest = (zoom) => {
    // Note: Browser zoom can't be controlled programmatically for security reasons
    // This is just for display purposes
    console.log(`Testing at ${zoom}% browser zoom`);
    if (onZoomChange) onZoomChange(zoom);
  };

  const handleViewportTest = (width) => {
    // Simulate viewport change by adjusting container width
    const container = document.querySelector('.a4-canvas-wrapper');
    if (container) {
      container.style.maxWidth = `${width}px`;
    }
    console.log(`Testing viewport width: ${width}px`);
  };

  return (
    <div className="print:hidden bg-white border border-slate-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-3">Zoom & Viewport Test Helper</h3>
      
      {/* Current Status */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div className="bg-slate-50 p-2 rounded">
          <div className="font-medium text-slate-700">Browser Zoom</div>
          <div className="text-slate-600">{browserZoom}%</div>
        </div>
        <div className="bg-slate-50 p-2 rounded">
          <div className="font-medium text-slate-700">Viewport</div>
          <div className="text-slate-600">{viewportWidth}px {isMobile ? '(Mobile)' : '(Desktop)'}</div>
        </div>
      </div>

      {/* Zoom Test Buttons */}
      <div className="mb-4">
        <div className="text-xs font-medium text-slate-700 mb-2">Test Browser Zoom Levels</div>
        <div className="flex flex-wrap gap-1">
          {zoomLevels.map(zoom => (
            <Button
              key={zoom}
              variant={browserZoom === zoom ? "default" : "outline"}
              size="sm"
              className="text-xs h-6 px-2"
              onClick={() => handleZoomTest(zoom)}
            >
              {zoom}%
            </Button>
          ))}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          Note: Browser zoom must be set manually. Use Ctrl/Cmd + Plus/Minus or browser zoom controls.
        </div>
      </div>

      {/* Viewport Test Buttons */}
      <div className="mb-4">
        <div className="text-xs font-medium text-slate-700 mb-2">Test Viewport Sizes</div>
        <div className="flex flex-wrap gap-1">
          {viewportPresets.map(preset => {
            const Icon = preset.icon;
            return (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                className="text-xs h-6 px-2"
                onClick={() => handleViewportTest(preset.width)}
              >
                <Icon className="w-3 h-3 mr-1" />
                {preset.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-slate-600 bg-blue-50 p-2 rounded">
        <div className="font-medium mb-1">Testing Instructions:</div>
        <ul className="list-disc list-inside space-y-1">
          <li>Use browser zoom controls (Ctrl/Cmd + Plus/Minus) to test zoom stability</li>
          <li>Check that letter elements maintain exact positions at all zoom levels</li>
          <li>Test on mobile devices or use browser dev tools device emulation</li>
          <li>Verify fold/hole marks appear correctly in both preview and print</li>
          <li>Ensure no vertical drift occurs when zooming</li>
        </ul>
      </div>
    </div>
  );
}
