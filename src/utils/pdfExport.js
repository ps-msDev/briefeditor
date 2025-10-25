import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { 
  SENDER_LINE, 
  ADDRESS_WINDOW, 
  INFO_BOX, 
  DATE, 
  SUBJECT, 
  SALUTATION, 
  BODY, 
  CLOSING,
  MARKS,
  TYPOGRAPHY
} from '../lib/din5008B';

/**
 * PDF export using PDF-lib with exact DIN 5008-B positioning
 * Creates a PDF with selectable text directly in the browser
 * @param {Object} letterData - The letter data to export
 * @param {string} filename - Name for the PDF file
 * @returns {Promise<void>}
 */
export async function exportAsPDF(letterData, filename = 'brief.pdf') {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size in points
    
    // Get fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    // Helper function to convert mm to points
    const mmToPoints = (mm) => mm * 2.834645669;
    
    // Helper function to add text with exact positioning
    const addText = (text, x, y, size = 11, isBold = false, maxWidth = null) => {
      if (!text) return;
      page.drawText(text, {
        x: mmToPoints(x),
        y: 841.89 - mmToPoints(y), // Convert mm to points and flip Y
        size,
        font: isBold ? boldFont : font,
        color: rgb(0, 0, 0),
        maxWidth: maxWidth ? mmToPoints(maxWidth) : undefined,
      });
    };
    
    // Helper function to format sender line
    const getSenderLine = () => {
      const parts = [];
      if (letterData.senderName) parts.push(letterData.senderName);
      if (letterData.senderStreet) parts.push(letterData.senderStreet);
      if (letterData.senderCity) parts.push(letterData.senderCity);
      return parts.join(' | ');
    };
    
    // Sender Line (45mm from top, 25mm from left, 85mm width)
    // Bottom-aligned to 62.7mm from top with padding
    const senderText = getSenderLine();
    if (senderText) {
      addText(senderText, SENDER_LINE.LEFT, 62.7 - 2, 9, false, SENDER_LINE.WIDTH); // 1mm padding from bottom
    }
    
    // Information Box (starts below 62.7mm from top, 125mm from left)
    let infoY = 62.7 + 2; // Start below the address window with small offset
    if (letterData.senderPhone) {
      addText(`Telefon: ${letterData.senderPhone}`, INFO_BOX.LEFT, infoY, 9);
      infoY += 4;
    }
    if (letterData.senderEmail) {
      addText(`E-Mail: ${letterData.senderEmail}`, INFO_BOX.LEFT, infoY, 9);
      infoY += 4;
    }
    
    // Date (90mm from top, right aligned with proper margin)
    if (letterData.date) {
      // Calculate right margin: A4 width (210mm) - right margin (20mm) = 190mm from left
      const dateText = letterData.date;
      const dateWidth = font.widthOfTextAtSize(dateText, 11);
      const dateX = 210 - 20 - (dateWidth / 2.834645669); // Right align with 20mm margin
      addText(dateText, dateX, DATE.TOP, 11);
    }
    
    // Recipient Address (62.7mm from top, 25mm from left, 85mm width)
    // Start at the top of the address window (62.7mm) + small offset for text baseline
    let addressY = ADDRESS_WINDOW.TOP + 3;
    if (letterData.recipientName) {
      addText(letterData.recipientName, ADDRESS_WINDOW.LEFT, addressY, 10, true, ADDRESS_WINDOW.WIDTH);
      addressY += 4;
    }
    if (letterData.recipientStreet) {
      addText(letterData.recipientStreet, ADDRESS_WINDOW.LEFT, addressY, 10, false, ADDRESS_WINDOW.WIDTH);
      addressY += 4;
    }
    if (letterData.recipientCity) {
      addText(letterData.recipientCity, ADDRESS_WINDOW.LEFT, addressY, 10, false, ADDRESS_WINDOW.WIDTH);
    }
    
    // Subject Line (125mm from top)
    if (letterData.subject) {
      addText(letterData.subject, SUBJECT.LEFT, SUBJECT.TOP, 11, true, 165);
    }
    
    // Salutation (143mm from top)
    if (letterData.salutation) {
      addText(letterData.salutation, SALUTATION.LEFT, SALUTATION.TOP, 11, false, 165);
    }
    
    // Body Text (156mm from top) - Handle line breaks like preview
    if (letterData.body) {
      const bodyLines = letterData.body.split('\n');
      let bodyY = BODY.TOP;
      const lineHeight = 11 * TYPOGRAPHY.LINE_HEIGHT; // 11pt * 1.15 = 12.65pt
      bodyLines.forEach(line => {
        if (line.trim()) {
          addText(line, BODY.LEFT, bodyY, 11, false, 165);
          bodyY += lineHeight / 2.834645669; // Convert back to mm for positioning
        }
      });
    }
    
    // Closing (45mm from bottom)
    if (letterData.closing) {
      // Calculate from bottom: A4 height (297mm) - bottom margin (45mm) = 252mm from top
      addText(letterData.closing, CLOSING.LEFT, 252, 11, false, 165);
      if (letterData.signatureName) {
        // Signature 15mm below closing
        addText(letterData.signatureName, CLOSING.LEFT, 237, 11, false, 165);
      }
    }
    
    // Fold Marks (105mm and 210mm from top)
    if (letterData.showFoldMarks) {
      // First fold mark at 105mm
      page.drawLine({
        start: { x: mmToPoints(MARKS.LEFT_OFFSET), y: 841.89 - mmToPoints(105) },
        end: { x: mmToPoints(MARKS.LEFT_OFFSET + MARKS.MARK_WIDTH), y: 841.89 - mmToPoints(105) },
        thickness: mmToPoints(MARKS.MARK_THICKNESS),
        color: rgb(0.78, 0.78, 0.78)
      });
      
      // Second fold mark at 210mm
      page.drawLine({
        start: { x: mmToPoints(MARKS.LEFT_OFFSET), y: 841.89 - mmToPoints(210) },
        end: { x: mmToPoints(MARKS.LEFT_OFFSET + MARKS.MARK_WIDTH), y: 841.89 - mmToPoints(210) },
        thickness: mmToPoints(MARKS.MARK_THICKNESS),
        color: rgb(0.78, 0.78, 0.78)
      });
    }
    
    // Hole Mark (148.5mm from top)
    if (letterData.showHoleMark) {
      page.drawLine({
        start: { x: mmToPoints(MARKS.LEFT_OFFSET), y: 841.89 - mmToPoints(MARKS.HOLE) },
        end: { x: mmToPoints(MARKS.LEFT_OFFSET + MARKS.HOLE_WIDTH), y: 841.89 - mmToPoints(MARKS.HOLE) },
        thickness: mmToPoints(MARKS.MARK_THICKNESS),
        color: rgb(0.78, 0.78, 0.78)
      });
    }
    
    // Generate PDF and download
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    // Fallback to print
    window.print();
  }
}