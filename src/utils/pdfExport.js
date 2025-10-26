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
        addText(letterData.signatureName, CLOSING.LEFT, 267, 11, false, 165);
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

/**
 * Print using PDF-lib with exact DIN 5008-B positioning
 * Creates a PDF and opens it in a new window for printing
 * @param {Object} letterData - The letter data to print
 * @returns {Promise<void>}
 */
export async function printAsPDF(letterData) {
  try {
    // Generate PDF using the same logic as exportAsPDF
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
    }
    
    // Address Window (45mm from top, 25mm from left, 85mm width, 45mm height)
    if (letterData.recipientName || letterData.recipientStreet || letterData.recipientCity) {
      // Draw address window border
      page.drawRectangle({
        x: mmToPoints(ADDRESS_WINDOW.LEFT),
        y: 841.89 - mmToPoints(ADDRESS_WINDOW.TOP + ADDRESS_WINDOW.HEIGHT),
        width: mmToPoints(ADDRESS_WINDOW.WIDTH),
        height: mmToPoints(ADDRESS_WINDOW.HEIGHT),
        borderColor: rgb(0, 0, 0),
        borderWidth: mmToPoints(0.25)
      });
      
      // Add recipient address
      let addressY = ADDRESS_WINDOW.TOP + 5;
      if (letterData.recipientName) {
        addText(letterData.recipientName, ADDRESS_WINDOW.LEFT + 2, addressY, 11, true, ADDRESS_WINDOW.WIDTH - 4);
        addressY += 4;
      }
      if (letterData.recipientStreet) {
        addText(letterData.recipientStreet, ADDRESS_WINDOW.LEFT + 2, addressY, 11, false, ADDRESS_WINDOW.WIDTH - 4);
        addressY += 4;
      }
      if (letterData.recipientCity) {
        addText(letterData.recipientCity, ADDRESS_WINDOW.LEFT + 2, addressY, 11, false, ADDRESS_WINDOW.WIDTH - 4);
      }
    }
    
    // Date (105mm from top, 25mm from left)
    if (letterData.date) {
      const dateStr = new Date(letterData.date).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      addText(dateStr, DATE.LEFT, DATE.TOP, 11, false);
    }
    
    // Subject (120mm from top, 25mm from left, 170mm width)
    if (letterData.subject) {
      addText(letterData.subject, SUBJECT.LEFT, SUBJECT.TOP, 11, true, SUBJECT.WIDTH);
    }
    
    // Salutation (140mm from top, 25mm from left, 170mm width)
    if (letterData.salutation) {
      addText(letterData.salutation, SALUTATION.LEFT, SALUTATION.TOP, 11, false, SALUTATION.WIDTH);
    }
    
    // Body (160mm from top, 25mm from left, 170mm width)
    if (letterData.body) {
      const lines = letterData.body.split('\n');
      let currentY = BODY.TOP;
      const lineHeight = 4; // 4mm line height
      
      for (const line of lines) {
        if (line.trim()) {
          addText(line, BODY.LEFT, currentY, 11, false, BODY.WIDTH);
        }
        currentY += lineHeight;
      }
    }
    
    // Closing (positioned after body)
    if (letterData.closing) {
      const bodyLines = letterData.body ? letterData.body.split('\n').length : 0;
      const closingY = BODY.TOP + (bodyLines * 4) + 8; // 8mm spacing after body
      addText(letterData.closing, CLOSING.LEFT, closingY, 11, false, CLOSING.WIDTH);
    }
    
    // Signature Name (positioned after closing)
    if (letterData.signatureName) {
      const bodyLines = letterData.body ? letterData.body.split('\n').length : 0;
      const signatureY = BODY.TOP + (bodyLines * 4) + 16; // 16mm spacing after body
      addText(letterData.signatureName, CLOSING.LEFT, signatureY, 11, false, CLOSING.WIDTH);
    }
    
    // Footer (if enabled)
    if (letterData.enableFooter && letterData.footerText) {
      const footerY = 280; // 280mm from top
      const alignment = letterData.footerAlignment || 'center';
      let footerX = 25; // Default left alignment
      
      if (alignment === 'center') {
        footerX = 25 + (170 - letterData.footerText.length * 2) / 2; // Rough centering
      } else if (alignment === 'right') {
        footerX = 25 + 170 - letterData.footerText.length * 2; // Rough right alignment
      }
      
      addText(letterData.footerText, footerX, footerY, 9, false, 170);
    }
    
    // Legal Information (if enabled)
    if (letterData.enableLegalInfo) {
      let legalY = 290; // Start below footer
      const legalInfo = [];
      
      if (letterData.companyName) legalInfo.push(letterData.companyName);
      if (letterData.registeredOffice) legalInfo.push(letterData.registeredOffice);
      if (letterData.managingDirectors) legalInfo.push(letterData.managingDirectors);
      if (letterData.supervisoryBoard) legalInfo.push(letterData.supervisoryBoard);
      if (letterData.registrationCourt) legalInfo.push(letterData.registrationCourt);
      if (letterData.hrbNumber) legalInfo.push(letterData.hrbNumber);
      if (letterData.vatId) legalInfo.push(letterData.vatId);
      if (letterData.bankDetails) legalInfo.push(letterData.bankDetails);
      if (letterData.companyPhone) legalInfo.push(letterData.companyPhone);
      if (letterData.companyFax) legalInfo.push(letterData.companyFax);
      if (letterData.companyEmail) legalInfo.push(letterData.companyEmail);
      if (letterData.companyWebsite) legalInfo.push(letterData.companyWebsite);
      
      for (const info of legalInfo) {
        if (info) {
          addText(info, 25, legalY, 8, false, 170);
          legalY += 3;
        }
      }
    }
    
    // Fold Marks (105mm and 210mm from top)
    if (letterData.showFoldMarks) {
      page.drawLine({
        start: { x: mmToPoints(MARKS.LEFT_OFFSET), y: 841.89 - mmToPoints(MARKS.FOLD_1) },
        end: { x: mmToPoints(MARKS.LEFT_OFFSET + MARKS.MARK_WIDTH), y: 841.89 - mmToPoints(MARKS.FOLD_1) },
        thickness: mmToPoints(MARKS.MARK_THICKNESS),
        color: rgb(0.78, 0.78, 0.78)
      });
      
      page.drawLine({
        start: { x: mmToPoints(MARKS.LEFT_OFFSET), y: 841.89 - mmToPoints(MARKS.FOLD_2) },
        end: { x: mmToPoints(MARKS.LEFT_OFFSET + MARKS.MARK_WIDTH), y: 841.89 - mmToPoints(MARKS.FOLD_2) },
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
    
    // Generate PDF and open in new window for printing
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Try to open PDF in new window and trigger print
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        // Clean up URL after printing
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      };
    } else {
      // If popup is blocked, fall back to PDF download
      console.warn('Popup blocked, falling back to PDF download');
      URL.revokeObjectURL(url);
      exportAsPDF(letterData, `brief-${new Date().toISOString().split('T')[0]}.pdf`);
    }
    
  } catch (error) {
    console.error('PDF print generation failed:', error);
    // Fallback to PDF download
    exportAsPDF(letterData, `brief-${new Date().toISOString().split('T')[0]}.pdf`);
  }
}