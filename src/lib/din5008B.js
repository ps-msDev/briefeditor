/**
 * DIN 5008-B Constants and Utilities
 *
 * Single source of truth for all DIN 5008-B letter measurements.
 * Both the HTML/CSS preview (LetterPreview.jsx) and the PDF export
 * (pdfExport.js) derive their positions from these values, so the two
 * rendering paths cannot drift apart.
 *
 * All base measurements are in millimeters.
 */

// Unit conversions
export const PT_PER_MM = 72 / 25.4; // 2.834645669...
export const MM_PER_PT = 25.4 / 72; // 0.352777...

// A4 Page dimensions in mm
export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;

// A4 Page dimensions in PDF points
export const A4_WIDTH_PT = A4_WIDTH_MM * PT_PER_MM; // 595.28
export const A4_HEIGHT_PT = A4_HEIGHT_MM * PT_PER_MM; // 841.89

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
  MAX_LINES: 2,
  FONT_SIZE_PT: 8,
  // Baseline of the (last) sender line in the PDF export: 2mm above the separator
  BASELINE: 60.7,
  LINE_STEP: 3.25 // vertical distance between the two sender lines (mm)
};

// Address window positioning (mm) - 62.7mm to 90mm from top
export const ADDRESS_WINDOW = {
  TOP: 62.7,
  LEFT: CONTENT_MARGINS.LEFT,
  WIDTH: 85,
  HEIGHT: 27.3, // 90 - 62.7 = 27.3mm
  FONT_SIZE_PT: 10,
  // Baseline of the first address line in the PDF export
  FIRST_BASELINE: 62.7 + 4
};

// Separator line between sender line and address window (mm)
export const SEPARATOR = {
  TOP: ADDRESS_WINDOW.TOP,
  LEFT: 20,
  WIDTH: 90, // extends from 20mm to 110mm
  THICKNESS: 0.25,
  COLOR: '#d1d5db'
};

// Info box positioning (mm) - top right area
export const INFO_BOX = {
  TOP: 50,
  LEFT: 125,
  RIGHT: 10,
  HEIGHT: 40,
  WIDTH: A4_WIDTH_MM - 125 - 10,
  FONT_SIZE_PT: 9,
  // Baseline of the first info line (phone) in the PDF export
  FIRST_BASELINE: ADDRESS_WINDOW.TOP + 0.5,
  LINE_STEP: 4 // vertical distance between info lines
};

// Date positioning (mm) - right aligned at the content right edge
export const DATE = {
  TOP: 90, // baseline
  LEFT: CONTENT_MARGINS.LEFT,
  RIGHT: CONTENT_MARGINS.RIGHT,
  ALIGN: 'right'
};

// Subject line positioning (mm) - first baseline of the text block
export const SUBJECT = {
  TOP: 125,
  LEFT: CONTENT_MARGINS.LEFT,
  RIGHT: CONTENT_MARGINS.RIGHT,
  WIDTH: CONTENT_AREA.WIDTH
};

// Salutation positioning (mm) - kept for reference; actual position is
// derived from SUBJECT.TOP plus SPACING (see below)
export const SALUTATION = {
  TOP: 143,
  LEFT: CONTENT_MARGINS.LEFT,
  RIGHT: CONTENT_MARGINS.RIGHT
};

// Body text positioning (mm) - kept for reference; actual position is
// derived from the salutation plus SPACING (see below)
export const BODY = {
  TOP: 156,
  LEFT: CONTENT_MARGINS.LEFT,
  RIGHT: CONTENT_MARGINS.RIGHT,
  WIDTH: CONTENT_AREA.WIDTH,
  // The body text must stop above the footer box
  MAX_BOTTOM: 262
};

// Closing and signature positioning (mm)
export const CLOSING = {
  BOTTOM: 45,
  LEFT: CONTENT_MARGINS.LEFT,
  RIGHT: CONTENT_MARGINS.RIGHT,
  WIDTH: CONTENT_AREA.WIDTH,
  SIGNATURE_SPACE: 15
};

// Footer area positioning (mm)
export const FOOTER = {
  BOTTOM: 10,
  LEFT: CONTENT_MARGINS.LEFT,
  RIGHT: CONTENT_MARGINS.RIGHT,
  HEIGHT: 25,
  FONT_SIZE_PT: 8,
  LINE_SPACING: 3, // vertical distance between footer lines (mm)
  BOTTOM_MARGIN: 3, // padding above the bottom edge of the footer box (mm)
  SECTION_GAP: 2, // extra gap between footer text and legal info (mm)
  BOX_TOP: A4_HEIGHT_MM - 10 - 25, // 262mm from top
  BOX_BOTTOM: A4_HEIGHT_MM - 10 // 287mm from top
};

// Fold and hole marks positioning (mm) - DIN 5008 Form B
export const MARKS = {
  FOLD_1: 105, // First fold mark (Form B)
  FOLD_2: 210, // Second fold mark (Form B)
  HOLE: 148.5, // Hole mark (center of page)
  MARK_WIDTH: 5,
  HOLE_WIDTH: 8,
  MARK_THICKNESS: 0.2,
  LEFT_OFFSET: 1,
  COLOR: '#C7C7C7'
};

// Typography settings
export const TYPOGRAPHY = {
  FONT_FAMILY: 'Arial, Helvetica, sans-serif',
  MAIN_SIZE_PT: 11,
  ADDRESS_SIZE_PT: 10,
  SMALL_SIZE_PT: 9,
  FOOTER_SIZE_PT: 8,
  LINE_HEIGHT: 1.15
};

// Height of one 11pt line (font size * line height) in mm - ≈4.46mm
export const LINE_HEIGHT_MM = TYPOGRAPHY.MAIN_SIZE_PT * TYPOGRAPHY.LINE_HEIGHT * MM_PER_PT;

/**
 * Vertical spacing between letter sections, expressed in multiples of
 * LINE_HEIGHT_MM. The same factors drive the PDF export (in mm) and the
 * preview (as em-based margins), keeping both paths in sync.
 *
 * The values reflect the historically used "visually improved" spacing
 * (1.5x / 3x line height) rather than strict single/double blank lines.
 */
export const SPACING = {
  SUBJECT_TO_SALUTATION: 3, // gap between subject and salutation
  SALUTATION_TO_BODY: 1.5, // gap between salutation and body
  BODY_TO_CLOSING: 1, // gap between body and closing
  CLOSING_TO_SIGNATURE: 3 // gap between closing and signature name
};

/**
 * Approximate distance from the top of a CSS line box to the text baseline
 * for Arial/Helvetica at line-height 1.15 (half-leading + ascent ≈ 0.92em).
 * Used to convert PDF baseline positions into CSS `top` positions so the
 * preview matches the PDF output.
 */
export const BASELINE_RATIO = 0.92;

/**
 * Distance from the top of a CSS line box to the text baseline in mm.
 * @param {number} fontSizePt - Font size in points
 * @returns {number} - Offset in millimeters
 */
export function baselineOffsetMm(fontSizePt) {
  return fontSizePt * BASELINE_RATIO * MM_PER_PT;
}

/**
 * Convert millimeters to a percentage of the A4 width (for CSS left/right/width).
 * @param {number} mm - Millimeters
 * @returns {string} - CSS percentage value
 */
export function mmToPercent(mm) {
  return `${(mm / A4_WIDTH_MM) * 100}%`;
}

/**
 * Convert millimeters to a percentage of the A4 height (for CSS top/bottom/height).
 * @param {number} mm - Millimeters
 * @returns {string} - CSS percentage value
 */
export function mmToPercentHeight(mm) {
  return `${(mm / A4_HEIGHT_MM) * 100}%`;
}

/**
 * Convert a PDF text baseline position (mm from top) into a CSS `top`
 * percentage for the preview, compensating for the font ascent.
 * @param {number} baselineMm - Baseline position in mm from the top of the page
 * @param {number} fontSizePt - Font size in points
 * @returns {string} - CSS percentage value for `top`
 */
export function baselineToTopPercent(baselineMm, fontSizePt) {
  return mmToPercentHeight(baselineMm - baselineOffsetMm(fontSizePt));
}

/**
 * CSS margin (in em) that produces a gap of `lineFactor` line heights
 * between two text blocks, matching the PDF's mm-based spacing.
 * @param {number} lineFactor - Gap in multiples of the line height
 * @returns {string} - CSS em value
 */
export function blankLinesEm(lineFactor) {
  return `${(lineFactor * TYPOGRAPHY.LINE_HEIGHT).toFixed(4)}em`;
}
