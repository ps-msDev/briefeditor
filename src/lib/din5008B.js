/**
 * DIN 5008-B Constants and Utilities
 * 
 * This file contains all the standardized measurements and positions for DIN 5008-B
 * letter formatting. All measurements are in millimeters and converted to pixels
 * using the standard 96 DPI conversion factor.
 * 
 * Scale Strategy:
 * - Screen preview: A4Canvas is scaled down to fit viewport using CSS transform: scale()
 * - Print: 1:1 rendering with @page { size: A4; margin: 0; }
 * - All positions are computed from the canvas coordinate system, never viewport units
 */

// CSS variable for mm to px conversion at 96 DPI
export const PX_PER_MM = 3.7795275591;

// A4 Page dimensions in mm
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

// A4 Page dimensions in pixels
export const A4_WIDTH_PX = A4_WIDTH_MM * PX_PER_MM;
export const A4_HEIGHT_PX = A4_HEIGHT_MM * PX_PER_MM;

// DIN 5008-B Content area margins (mm)
export const CONTENT_MARGINS = {
  LEFT: 25,
  RIGHT: 20,
  TOP: 45,
  BOTTOM: 25
};

// DIN 5008-B Content area dimensions (mm)
export const CONTENT_AREA = {
  LEFT: CONTENT_MARGINS.LEFT,
  RIGHT: A4_WIDTH_MM - CONTENT_MARGINS.RIGHT,
  TOP: CONTENT_MARGINS.TOP,
  BOTTOM: A4_HEIGHT_MM - CONTENT_MARGINS.BOTTOM,
  WIDTH: A4_WIDTH_MM - CONTENT_MARGINS.LEFT - CONTENT_MARGINS.RIGHT,
  HEIGHT: A4_HEIGHT_MM - CONTENT_MARGINS.TOP - CONTENT_MARGINS.BOTTOM
};

// Sender line positioning (mm) - 45mm to 62.7mm from top
export const SENDER_LINE = {
  TOP: 45,
  LEFT: CONTENT_MARGINS.LEFT,
  WIDTH: 85,
  HEIGHT: 17.7, // 62.7 - 45 = 17.7mm
  MAX_LINES: 2
};

// Address window positioning (mm) - 62.7mm to 90mm from top
export const ADDRESS_WINDOW = {
  TOP: 62.7,
  LEFT: CONTENT_MARGINS.LEFT,
  WIDTH: 85,
  HEIGHT: 27.3 // 90 - 62.7 = 27.3mm
};

// Info box positioning (mm) - top right corner
export const INFO_BOX = {
  TOP: 50,
  LEFT: 125,
  RIGHT: 10,
  HEIGHT: 40,
  WIDTH: A4_WIDTH_MM - 125 - 10
};

// Date positioning (mm)
export const DATE = {
  TOP: 90,
  RIGHT: CONTENT_MARGINS.RIGHT,
  ALIGN: 'right'
};

// Subject line positioning (mm)
export const SUBJECT = {
  TOP: 125,
  LEFT: CONTENT_MARGINS.LEFT,
  RIGHT: CONTENT_MARGINS.RIGHT
};

// Salutation positioning (mm)
export const SALUTATION = {
  TOP: 143,
  LEFT: CONTENT_MARGINS.LEFT,
  RIGHT: CONTENT_MARGINS.RIGHT
};

// Body text positioning (mm)
export const BODY = {
  TOP: 156,
  LEFT: CONTENT_MARGINS.LEFT,
  RIGHT: CONTENT_MARGINS.RIGHT
};

// Closing and signature positioning (mm)
export const CLOSING = {
  BOTTOM: 45, // 45mm from bottom
  LEFT: CONTENT_MARGINS.LEFT,
  RIGHT: CONTENT_MARGINS.RIGHT,
  SIGNATURE_SPACE: 15 // 15mm space for signature
};

// Footer area positioning (mm)
export const FOOTER = {
  BOTTOM: 10,
  LEFT: CONTENT_MARGINS.LEFT,
  RIGHT: CONTENT_MARGINS.RIGHT,
  HEIGHT: 25
};

// Fold and hole marks positioning (mm)
export const MARKS = {
  FOLD_1: 87,    // First fold mark
  FOLD_2: 192,   // Second fold mark
  HOLE: 148.5,   // Hole mark
  MARK_WIDTH: 5,  // Width of fold marks
  HOLE_WIDTH: 8,  // Width of hole mark
  MARK_THICKNESS: 0.2, // Thickness of marks in mm
  LEFT_OFFSET: 1  // Distance from left edge
};

// Typography settings
export const TYPOGRAPHY = {
  FONT_FAMILY: 'Arial, Helvetica, sans-serif',
  MAIN_SIZE: '11pt',
  ADDRESS_SIZE: '10pt',
  SMALL_SIZE: '9pt',
  FOOTER_SIZE: '8pt',
  LINE_HEIGHT: 1.15
};

/**
 * Convert millimeters to pixels using the standard conversion factor
 * @param {number} mm - Value in millimeters
 * @returns {string} - CSS calc() expression for pixels
 */
export function mmToPx(mm) {
  return `${mm * PX_PER_MM}px`;
}

/**
 * Convert millimeters to percentage of A4 width for responsive scaling
 * @param {number} mm - Millimeters
 * @returns {string} - CSS percentage value
 */
export function mmToPercent(mm) {
  return `${(mm / A4_WIDTH_MM) * 100}%`;
}

/**
 * Convert millimeters to percentage of A4 height for responsive scaling
 * @param {number} mm - Millimeters
 * @returns {string} - CSS percentage value
 */
export function mmToPercentHeight(mm) {
  return `${(mm / A4_HEIGHT_MM) * 100}%`;
}

/**
 * Get CSS custom properties for the A4 canvas
 * @returns {object} - CSS custom properties object
 */
export function getA4CanvasCSS() {
  return {
    '--px-per-mm': PX_PER_MM.toString(),
    '--a4-width-mm': A4_WIDTH_MM.toString(),
    '--a4-height-mm': A4_HEIGHT_MM.toString(),
    '--a4-width-px': A4_WIDTH_PX.toString(),
    '--a4-height-px': A4_HEIGHT_PX.toString()
  };
}

/**
 * Get the scale factor for fitting A4 canvas in viewport
 * @param {number} containerWidth - Available container width in pixels
 * @param {number} containerHeight - Available container height in pixels
 * @param {number} padding - Padding around the canvas in pixels
 * @returns {number} - Scale factor (0-1)
 */
export function getScaleFactor(containerWidth, containerHeight, padding = 20) {
  const availableWidth = containerWidth - (padding * 2);
  const availableHeight = containerHeight - (padding * 2);
  
  const scaleX = availableWidth / A4_WIDTH_PX;
  const scaleY = availableHeight / A4_HEIGHT_PX;
  
  // Use the smaller scale to ensure the canvas fits in both dimensions
  return Math.min(scaleX, scaleY, 1);
}

/**
 * Get responsive scale factor based on screen size
 * @param {number} screenWidth - Screen width in pixels
 * @returns {number} - Scale factor for mobile/desktop
 * @deprecated - Using simple scaling calculation instead
 */
export function getResponsiveScale(screenWidth) {
  // This function is kept for backward compatibility but not used
  return 1;
}
