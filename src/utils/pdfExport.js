import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {
  A4_WIDTH_PT,
  A4_HEIGHT_PT,
  PT_PER_MM,
  MM_PER_PT,
  CONTENT_AREA,
  SENDER_LINE,
  ADDRESS_WINDOW,
  SEPARATOR,
  INFO_BOX,
  DATE,
  SUBJECT,
  BODY,
  CLOSING,
  FOOTER,
  MARKS,
  TYPOGRAPHY,
  LINE_HEIGHT_MM,
  SPACING
} from '../lib/din5008B';
import { getSenderLine, getLegalInfoText, hasLegalInfoContent } from '../lib/letterText';

const mmToPoints = (mm) => mm * PT_PER_MM;

const BLACK = rgb(0, 0, 0);
const SEPARATOR_COLOR = rgb(0.82, 0.82, 0.82);
const MARK_COLOR = rgb(0.78, 0.78, 0.78);

/**
 * Greedily wrap text into lines that fit maxWidthPt.
 * Single words wider than the limit are kept on their own line.
 * @returns {string[]} wrapped lines
 */
function wrapText(font, text, sizePt, maxWidthPt) {
  const lines = [];
  let current = '';
  for (const word of text.split(' ')) {
    const testLine = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(testLine, sizePt) <= maxWidthPt || !current) {
      current = testLine;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) {
    lines.push(current);
  }
  return lines;
}

/**
 * Wrap text into at most two lines (greedy fill, remainder on line two).
 * Mirrors the historical field-wrapping behavior of the PDF export.
 * @returns {string[]} one or two lines
 */
function wrapTwoLines(font, text, sizePt, maxWidthPt) {
  if (font.widthOfTextAtSize(text, sizePt) <= maxWidthPt) {
    return [text];
  }
  const words = text.split(' ');
  let line1 = '';
  let line2 = '';
  for (let i = 0; i < words.length; i++) {
    const testLine = line1 ? `${line1} ${words[i]}` : words[i];
    if (font.widthOfTextAtSize(testLine, sizePt) <= maxWidthPt || !line1) {
      line1 = testLine;
    } else {
      line2 = words.slice(i).join(' ');
      break;
    }
  }
  if (!line2) {
    const midPoint = Math.floor(words.length / 2);
    line1 = words.slice(0, midPoint).join(' ');
    line2 = words.slice(midPoint).join(' ');
  }
  return line1 ? [line1, line2] : [line2];
}

/**
 * Build the DIN 5008-B letter PDF.
 * Pure function without DOM access, usable in tests and in the browser.
 * @param {Object} letterData - The letter data
 * @returns {Promise<Uint8Array>} - The PDF file bytes
 */
export async function buildLetterPdf(letterData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4_WIDTH_PT, A4_HEIGHT_PT]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Draw text with x/y given in mm from the top-left corner (y = baseline)
  const addText = (text, x, y, size = TYPOGRAPHY.MAIN_SIZE_PT, isBold = false, maxWidth = null) => {
    if (!text) return;
    page.drawText(text, {
      x: mmToPoints(x),
      y: A4_HEIGHT_PT - mmToPoints(y),
      size,
      font: isBold ? boldFont : font,
      color: BLACK,
      maxWidth: maxWidth ? mmToPoints(maxWidth) : undefined,
    });
  };

  const drawHorizontalLine = (xMm, yMm, widthMm, thicknessMm, color) => {
    page.drawLine({
      start: { x: mmToPoints(xMm), y: A4_HEIGHT_PT - mmToPoints(yMm) },
      end: { x: mmToPoints(xMm + widthMm), y: A4_HEIGHT_PT - mmToPoints(yMm) },
      thickness: mmToPoints(thicknessMm),
      color
    });
  };

  // --- Sender line (bottom-aligned above the separator) ---
  const senderText = getSenderLine(letterData);
  if (senderText) {
    const size = SENDER_LINE.FONT_SIZE_PT;
    const lines = wrapTwoLines(font, senderText, size, mmToPoints(SENDER_LINE.WIDTH));
    // Last line sits at the fixed baseline, previous lines stack upwards
    lines.reverse().forEach((line, indexFromBottom) => {
      addText(line, SENDER_LINE.LEFT, SENDER_LINE.BASELINE - indexFromBottom * SENDER_LINE.LINE_STEP, size);
    });
  }

  // --- Info box (phone / e-mail, top right) ---
  let infoY = INFO_BOX.FIRST_BASELINE;
  if (letterData.senderPhone) {
    addText(`Telefon: ${letterData.senderPhone}`, INFO_BOX.LEFT, infoY, INFO_BOX.FONT_SIZE_PT);
    infoY += INFO_BOX.LINE_STEP;
  }
  if (letterData.senderEmail) {
    addText(`E-Mail: ${letterData.senderEmail}`, INFO_BOX.LEFT, infoY, INFO_BOX.FONT_SIZE_PT);
  }

  // --- Separator line between sender line and address window ---
  drawHorizontalLine(SEPARATOR.LEFT, SEPARATOR.TOP, SEPARATOR.WIDTH, SEPARATOR.THICKNESS, SEPARATOR_COLOR);

  // --- Date (right aligned at the content right edge) ---
  if (letterData.date) {
    const dateWidthMm = font.widthOfTextAtSize(letterData.date, TYPOGRAPHY.MAIN_SIZE_PT) * MM_PER_PT;
    addText(letterData.date, CONTENT_AREA.RIGHT - dateWidthMm, DATE.TOP, TYPOGRAPHY.MAIN_SIZE_PT);
  }

  const mainSize = TYPOGRAPHY.MAIN_SIZE_PT;
  const contentWidthPt = mmToPoints(CONTENT_AREA.WIDTH);

  // Tracks where the previous section ended (baseline of the next free line)
  let lastSectionEndY = ADDRESS_WINDOW.FIRST_BASELINE;

  // --- Recipient address ---
  if (letterData.recipientName || letterData.recipientStreet || letterData.recipientCity) {
    const size = ADDRESS_WINDOW.FONT_SIZE_PT;
    const addressLineHeightMm = size * TYPOGRAPHY.LINE_HEIGHT * MM_PER_PT;
    const maxWidthPt = mmToPoints(ADDRESS_WINDOW.WIDTH);
    let currentY = lastSectionEndY;

    const addAddressField = (text, isBold) => {
      if (!text) return;
      const fieldFont = isBold ? boldFont : font;
      for (const line of wrapTwoLines(fieldFont, text, size, maxWidthPt)) {
        addText(line, ADDRESS_WINDOW.LEFT, currentY, size, isBold);
        currentY += addressLineHeightMm;
      }
    };

    addAddressField(letterData.recipientName, true);
    addAddressField(letterData.recipientAddressSupplement, false);
    addAddressField(letterData.recipientStreet, false);
    addAddressField(letterData.recipientCity, false);

    lastSectionEndY = currentY;
  }

  // --- Subject (fixed position, bold) ---
  if (letterData.subject) {
    let currentY = SUBJECT.TOP;
    for (const line of wrapTwoLines(boldFont, letterData.subject, mainSize, contentWidthPt)) {
      addText(line, SUBJECT.LEFT, currentY, mainSize, true);
      currentY += LINE_HEIGHT_MM;
    }
    lastSectionEndY = currentY;
  }

  // --- Salutation ---
  if (letterData.salutation) {
    let currentY = lastSectionEndY + SPACING.SUBJECT_TO_SALUTATION * LINE_HEIGHT_MM;
    for (const line of wrapTwoLines(font, letterData.salutation, mainSize, contentWidthPt)) {
      addText(line, SUBJECT.LEFT, currentY, mainSize);
      currentY += LINE_HEIGHT_MM;
    }
    lastSectionEndY = currentY;
  }

  // --- Body text ---
  const closingReserveMm =
    (SPACING.BODY_TO_CLOSING + SPACING.CLOSING_TO_SIGNATURE) * LINE_HEIGHT_MM + LINE_HEIGHT_MM;
  const bodyStartY = lastSectionEndY + SPACING.SALUTATION_TO_BODY * LINE_HEIGHT_MM;
  let lastBodyY = bodyStartY;

  if (letterData.body) {
    let bodyY = bodyStartY;
    outer: for (const paragraphLine of letterData.body.split('\n')) {
      if (bodyY + LINE_HEIGHT_MM + closingReserveMm > BODY.MAX_BOTTOM) {
        break; // no more room above the footer box
      }
      if (paragraphLine.trim()) {
        const wrapped = wrapText(font, paragraphLine, mainSize, contentWidthPt);
        for (let i = 0; i < wrapped.length; i++) {
          addText(wrapped[i], BODY.LEFT, bodyY, mainSize);
          if (i < wrapped.length - 1) {
            bodyY += LINE_HEIGHT_MM;
            if (bodyY + LINE_HEIGHT_MM + closingReserveMm > BODY.MAX_BOTTOM) {
              break outer;
            }
          }
        }
      }
      // Advance for both empty and non-empty lines to preserve paragraph spacing
      bodyY += LINE_HEIGHT_MM;
      lastBodyY = bodyY;
    }
  }

  // --- Closing and signature ---
  const closingY = lastBodyY + SPACING.BODY_TO_CLOSING * LINE_HEIGHT_MM;
  let closingEndY = closingY;

  if (letterData.closing) {
    addText(letterData.closing, CLOSING.LEFT, closingY, mainSize, false, CONTENT_AREA.WIDTH);
    closingEndY = closingY + LINE_HEIGHT_MM;
  }

  if (letterData.signatureName) {
    let sigY = closingEndY + SPACING.CLOSING_TO_SIGNATURE * LINE_HEIGHT_MM;
    for (const line of wrapTwoLines(font, letterData.signatureName, mainSize, contentWidthPt)) {
      addText(line, CLOSING.LEFT, sigY, mainSize);
      sigY += LINE_HEIGHT_MM;
    }
  }

  // --- Footer box (footer text + legal info, bottom-aligned) ---
  const hasFooter = letterData.enableFooter && letterData.footerText;
  const hasLegalInfo = letterData.enableLegalInfo && hasLegalInfoContent(letterData);

  if (hasFooter || hasLegalInfo) {
    const size = FOOTER.FONT_SIZE_PT;
    const footerWidthPt = mmToPoints(CONTENT_AREA.WIDTH);
    const footerLines = [];

    if (hasFooter) {
      const alignment = letterData.footerAlignment || 'center';
      for (const line of wrapText(font, letterData.footerText, size, footerWidthPt)) {
        let footerX = FOOTER.LEFT;
        const lineWidthMm = font.widthOfTextAtSize(line, size) * MM_PER_PT;
        if (alignment === 'center') {
          footerX = FOOTER.LEFT + (CONTENT_AREA.WIDTH - lineWidthMm) / 2;
        } else if (alignment === 'right') {
          footerX = FOOTER.LEFT + CONTENT_AREA.WIDTH - lineWidthMm;
        }
        footerLines.push({ text: line, x: footerX, isFooter: true });
      }
    }

    if (hasLegalInfo) {
      const legalText = getLegalInfoText(letterData);
      for (const line of wrapText(font, legalText, size, footerWidthPt)) {
        footerLines.push({ text: line, x: FOOTER.LEFT, isFooter: false });
      }
    }

    // Draw from the bottom of the footer box upwards
    let currentY = FOOTER.BOX_BOTTOM - FOOTER.BOTTOM_MARGIN;
    for (let i = footerLines.length - 1; i >= 0; i--) {
      addText(footerLines[i].text, footerLines[i].x, currentY, size);
      if (i > 0) {
        const extraSpacing = footerLines[i].isFooter !== footerLines[i - 1].isFooter ? FOOTER.SECTION_GAP : 0;
        currentY -= FOOTER.LINE_SPACING + extraSpacing;
      }
    }
  }

  // --- Fold marks ---
  if (letterData.showFoldMarks) {
    drawHorizontalLine(MARKS.LEFT_OFFSET, MARKS.FOLD_1, MARKS.MARK_WIDTH, MARKS.MARK_THICKNESS, MARK_COLOR);
    drawHorizontalLine(MARKS.LEFT_OFFSET, MARKS.FOLD_2, MARKS.MARK_WIDTH, MARKS.MARK_THICKNESS, MARK_COLOR);
  }

  // --- Hole mark ---
  if (letterData.showHoleMark) {
    drawHorizontalLine(MARKS.LEFT_OFFSET, MARKS.HOLE, MARKS.HOLE_WIDTH, MARKS.MARK_THICKNESS, MARK_COLOR);
  }

  return pdfDoc.save();
}

/**
 * Generate the letter PDF and trigger a browser download.
 * @param {Object} letterData - The letter data to export
 * @param {string} filename - Name for the PDF file
 * @returns {Promise<boolean>} - true if the download was triggered
 */
export async function exportAsPDF(letterData, filename = 'brief.pdf') {
  try {
    const pdfBytes = await buildLetterPdf(letterData);
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
}
