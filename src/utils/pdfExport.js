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
    // Bottom-aligned to 62.7mm from top with proper spacing
    const senderText = getSenderLine();
    if (senderText) {
      // Calculate if text needs wrapping and handle line spacing
      const lineHeight = 9 * 1.15; // Font size * line height = 10.35pt ≈ 3.65mm
      const maxHeight = SENDER_LINE.HEIGHT; // 17.7mm available
      const paddingBottom = 0.5; // 0.5mm padding from bottom
      
      // Check if text fits in one line
      const textWidth = font.widthOfTextAtSize(senderText, 9);
      const maxWidthPoints = mmToPoints(SENDER_LINE.WIDTH);
      
      if (textWidth <= maxWidthPoints) {
        // Single line: position at bottom with padding
        const yPos = 62.7 - paddingBottom;
        addText(senderText, SENDER_LINE.LEFT, yPos, 9, false);
      } else {
        // Two lines: wrap text and position from bottom up
        const words = senderText.split(' ');
        let line1 = '';
        let line2 = '';
        
        // Try to fit first part in line 1
        for (let i = 0; i < words.length; i++) {
          const testLine = line1 ? `${line1} ${words[i]}` : words[i];
          const testWidth = font.widthOfTextAtSize(testLine, 9);
          
          if (testWidth <= maxWidthPoints || !line1) {
            line1 = testLine;
          } else {
            // Rest goes to line 2
            line2 = words.slice(i).join(' ');
            break;
          }
        }
        
        // If all fits in line 1, split in middle
        if (!line2) {
          const midPoint = Math.floor(words.length / 2);
          line1 = words.slice(0, midPoint).join(' ');
          line2 = words.slice(midPoint).join(' ');
        }
        
        // Position lines from bottom up
        const lineHeightMm = 3.65; // Approximate line height in mm
        
        // Line 2: closest to bottom
        const line2Y = 62.7 - paddingBottom;
        addText(line2, SENDER_LINE.LEFT, line2Y, 9, false);
        
        // Line 1: above line 2
        const line1Y = line2Y - lineHeightMm;
        addText(line1, SENDER_LINE.LEFT, line1Y, 9, false);
      }
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
    
    // Define spacing constants (DIN 5008 compliant with better visual spacing)
    const lineHeight11pt = 11 * 1.15; // 11pt font line height
    const lineHeightMm = lineHeight11pt / 2.834645669; // ≈ 4.46mm per blank line
    const blankLines1 = lineHeightMm * 1.5; // 1.5x for better visual spacing (≈6.7mm)
    const blankLines2 = lineHeightMm * 3; // 3x for better visual spacing (≈13.4mm)
    
    // Track end position of each section for proper spacing
    let lastSectionEndY = ADDRESS_WINDOW.TOP + 4; // Start position
    let currentY;
    
    // Recipient Address - Handle wrapping manually for proper spacing
    if (letterData.recipientName || letterData.recipientStreet || letterData.recipientCity) {
      currentY = lastSectionEndY;
      const lineHeight = 10 * 1.15; // 10pt * 1.15 = 11.5pt
      const lineHeightMm = lineHeight / 2.834645669; // Convert to mm (≈ 4.06mm)
      const maxWidthPoints = mmToPoints(ADDRESS_WINDOW.WIDTH);
      
      // Helper to add a field with proper wrapping
      const addAddressField = (text, isBold) => {
        if (!text) return;
        
        // Check if text fits in one line
        const textWidth = (isBold ? boldFont : font).widthOfTextAtSize(text, 10);
        
        if (textWidth <= maxWidthPoints) {
          // Single line
          addText(text, ADDRESS_WINDOW.LEFT, currentY, 10, isBold);
          currentY += lineHeightMm;
        } else {
          // Split into two lines
          const words = text.split(' ');
          let line1 = '';
          let line2 = '';
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line1 ? `${line1} ${words[i]}` : words[i];
            const testWidth = (isBold ? boldFont : font).widthOfTextAtSize(testLine, 10);
            
            if (testWidth <= maxWidthPoints || !line1) {
              line1 = testLine;
            } else {
              line2 = words.slice(i).join(' ');
              break;
            }
          }
          
          // If all fits in line 1, split in middle
          if (!line2) {
            const midPoint = Math.floor(words.length / 2);
            line1 = words.slice(0, midPoint).join(' ');
            line2 = words.slice(midPoint).join(' ');
          }
          
          // Render both lines
          addText(line1, ADDRESS_WINDOW.LEFT, currentY, 10, isBold);
          currentY += lineHeightMm;
          addText(line2, ADDRESS_WINDOW.LEFT, currentY, 10, isBold);
          currentY += lineHeightMm;
        }
      };
      
      if (letterData.recipientName) {
        addAddressField(letterData.recipientName, true);
      }
      if (letterData.recipientAddressSupplement) {
        addAddressField(letterData.recipientAddressSupplement, false);
      }
      if (letterData.recipientStreet) {
        addAddressField(letterData.recipientStreet, false);
      }
      if (letterData.recipientCity) {
        addAddressField(letterData.recipientCity, false);
      }
      
      lastSectionEndY = currentY;
    }
    
    // Subject Line - Use fixed position (original behavior)
    if (letterData.subject) {
      const subjectLineHeightMm = lineHeightMm;
      const maxWidthPoints = mmToPoints(165);
      // Start at fixed SUBJECT.TOP position
      currentY = SUBJECT.TOP;
      
      // Check if text fits in one line
      const textWidth = boldFont.widthOfTextAtSize(letterData.subject, 11);
      
      if (textWidth <= maxWidthPoints) {
        // Single line
        addText(letterData.subject, SUBJECT.LEFT, currentY, 11, true);
        currentY += subjectLineHeightMm;
      } else {
        // Split into two lines
        const words = letterData.subject.split(' ');
        let line1 = '';
        let line2 = '';
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line1 ? `${line1} ${words[i]}` : words[i];
          const testWidth = boldFont.widthOfTextAtSize(testLine, 11);
          
          if (testWidth <= maxWidthPoints || !line1) {
            line1 = testLine;
          } else {
            line2 = words.slice(i).join(' ');
            break;
          }
        }
        
        // If all fits in line 1, split in middle
        if (!line2) {
          const midPoint = Math.floor(words.length / 2);
          line1 = words.slice(0, midPoint).join(' ');
          line2 = words.slice(midPoint).join(' ');
        }
        
        // Render both lines
        addText(line1, SUBJECT.LEFT, currentY, 11, true);
        currentY += subjectLineHeightMm;
        addText(line2, SUBJECT.LEFT, currentY, 11, true);
        currentY += subjectLineHeightMm;
      }
      
      lastSectionEndY = currentY;
    }
    
    // Salutation - Position after subject with 2 blank lines (DIN 5008: 2 blank lines between subject and salutation)
    if (letterData.salutation) {
      const salutationLineHeightMm = lineHeightMm;
      const maxWidthPoints = mmToPoints(165);
      // Start 2 blank lines after subject (or after address if no subject)
      currentY = lastSectionEndY + blankLines2;
      
      // Check if text fits in one line
      const textWidth = font.widthOfTextAtSize(letterData.salutation, 11);
      
      if (textWidth <= maxWidthPoints) {
        // Single line
        addText(letterData.salutation, SALUTATION.LEFT, currentY, 11, false);
        currentY += salutationLineHeightMm;
      } else {
        // Split into two lines
        const words = letterData.salutation.split(' ');
        let line1 = '';
        let line2 = '';
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line1 ? `${line1} ${words[i]}` : words[i];
          const testWidth = font.widthOfTextAtSize(testLine, 11);
          
          if (testWidth <= maxWidthPoints || !line1) {
            line1 = testLine;
          } else {
            line2 = words.slice(i).join(' ');
            break;
          }
        }
        
        // If all fits in line 1, split in middle
        if (!line2) {
          const midPoint = Math.floor(words.length / 2);
          line1 = words.slice(0, midPoint).join(' ');
          line2 = words.slice(midPoint).join(' ');
        }
        
        // Render both lines
        addText(line1, SALUTATION.LEFT, currentY, 11, false);
        currentY += salutationLineHeightMm;
        addText(line2, SALUTATION.LEFT, currentY, 11, false);
        currentY += salutationLineHeightMm;
      }
      
      lastSectionEndY = currentY;
    }
    
    // Body Text - Start after salutation with 1 blank line (DIN 5008: 1 blank line between salutation and body)
    // Follow official guidelines: 1 blank line after body, then 2 blank lines for signature
    const footerBoxStart = 262; // Footer box starts at 262mm
    
    // Start body 1 blank line after salutation (or after address if no salutation)
    if (!lastSectionEndY) {
      lastSectionEndY = ADDRESS_WINDOW.TOP + 4;
    }
    const bodyStartY = lastSectionEndY + blankLines1; // 1 blank line after salutation
    let lastBodyY = bodyStartY;
    
    if (letterData.body) {
      const bodyLines = letterData.body.split('\n');
      let bodyY = bodyStartY;
      const lineHeight = 11 * TYPOGRAPHY.LINE_HEIGHT; // 11pt * 1.15 = 12.65pt
      const lineHeightMm = lineHeight / 2.834645669; // Convert back to mm for positioning
      
      bodyLines.forEach(line => {
        // Check if adding this line would exceed footer start (account for closing and signature spacing)
        if (bodyY + lineHeightMm + blankLines1 + blankLines2 <= footerBoxStart) {
          if (line.trim()) {
            // Non-empty line - render the text with word wrapping
            // Split long lines into multiple lines if needed
            const words = line.split(' ');
            let currentLine = '';
            
            for (const word of words) {
              const testLine = currentLine ? `${currentLine} ${word}` : word;
              const testWidth = font.widthOfTextAtSize(testLine, 11);
              const maxWidthPoints = mmToPoints(165);
              
              if (testWidth <= maxWidthPoints || !currentLine) {
                currentLine = testLine;
              } else {
                // Current line is too long, render it and start new line
                addText(currentLine, BODY.LEFT, bodyY, 11, false);
                bodyY += lineHeightMm;
                currentLine = word;
                
                // Check if we still have space
                if (bodyY + lineHeightMm + blankLines1 + blankLines2 > footerBoxStart) {
                  return; // Stop rendering
                }
              }
            }
            
            // Render the last line
            if (currentLine) {
              addText(currentLine, BODY.LEFT, bodyY, 11, false);
            }
          }
          // Always advance Y position for both empty and non-empty lines to preserve paragraph spacing
          bodyY += lineHeightMm;
          lastBodyY = bodyY;
        }
        // Stop rendering if we would exceed the limit
      });
    }
    
    // Closing and Signature - Positioned after body text with proper spacing (DIN 5008 compliant)
    // Closing: 1 blank line after body text
    // Signature: 2 blank lines below closing phrase
    const bodyLineHeight11pt = 11 * TYPOGRAPHY.LINE_HEIGHT; // 11pt * 1.15 = 12.65pt
    const bodyLineHeightMm = bodyLineHeight11pt / 2.834645669; // Convert to mm
    
    // Add 1 blank line after body (lastBodyY is at end of last body line, we add 1 line height for spacing)
    const closingY = lastBodyY + bodyLineHeightMm;
    let closingEndY = closingY;
    
    if (letterData.closing) {
      addText(letterData.closing, CLOSING.LEFT, closingY, 11, false, 165);
      closingEndY = closingY + bodyLineHeightMm; // Account for closing text taking up space
    }
    
    // Signature: 2 blank lines after closing ends
    const signatureY = closingEndY + blankLines2;
    
    // Signature Name - Handle wrapping manually
    if (letterData.signatureName) {
      const sigLineHeight = 11 * 1.15; // 11pt * 1.15 = 12.65pt
      const sigLineHeightMm = sigLineHeight / 2.834645669; // Convert to mm
      const maxWidthPoints = mmToPoints(165); // 165mm width
      let sigY = signatureY;
      
      // Check if text fits in one line
      const textWidth = font.widthOfTextAtSize(letterData.signatureName, 11);
      
      if (textWidth <= maxWidthPoints) {
        // Single line
        addText(letterData.signatureName, CLOSING.LEFT, sigY, 11, false);
      } else {
        // Split into two lines
        const words = letterData.signatureName.split(' ');
        let line1 = '';
        let line2 = '';
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line1 ? `${line1} ${words[i]}` : words[i];
          const testWidth = font.widthOfTextAtSize(testLine, 11);
          
          if (testWidth <= maxWidthPoints || !line1) {
            line1 = testLine;
          } else {
            line2 = words.slice(i).join(' ');
            break;
          }
        }
        
        // If all fits in line 1, split in middle
        if (!line2) {
          const midPoint = Math.floor(words.length / 2);
          line1 = words.slice(0, midPoint).join(' ');
          line2 = words.slice(midPoint).join(' ');
        }
        
        // Render both lines
        addText(line1, CLOSING.LEFT, sigY, 11, false);
        sigY += sigLineHeightMm;
        addText(line2, CLOSING.LEFT, sigY, 11, false);
      }
    }
    
    // Footer Box (1cm from bottom, 2.5cm height)
    const footerBoxTop = 297 - 10 - 25; // 297mm (A4 height) - 10mm (1cm from bottom) - 25mm (2.5cm height) = 262mm from top
    const footerBoxBottom = 297 - 10; // 287mm from top
    
    // Check if we have any footer content
    const hasFooter = letterData.enableFooter && letterData.footerText;
    const hasLegalInfo = letterData.enableLegalInfo && (
      letterData.companyName || letterData.registeredOffice || letterData.companyPhone || 
      letterData.companyFax || letterData.companyEmail || letterData.companyWebsite || 
      letterData.bankDetails || letterData.vatId || letterData.managingDirectors || 
      letterData.supervisoryBoard || letterData.registrationCourt || letterData.hrbNumber
    );
    
    if (hasFooter || hasLegalInfo) {
      const lineSpacing = 3; // 3mm between all lines
      const bottomMargin = 3; // 3mm from bottom of footer box
      
      // Collect all footer lines
      const footerLines = [];
      
      // Add footer text lines with proper wrapping (size 8 like legal info)
      if (hasFooter) {
        const text = letterData.footerText;
        const alignment = letterData.footerAlignment || 'center';
        
        // Manually wrap text exactly like legal info
        const words = text.split(' ');
        let line = '';
        const wrappedLines = [];
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line ? `${line} ${words[i]}` : words[i];
          const width = font.widthOfTextAtSize(testLine, 8);
          
          if (width <= mmToPoints(170) || !line) {
            line = testLine;
          } else {
            wrappedLines.push(line);
            line = words[i];
          }
        }
        
        // Add the last line
        if (line) {
          wrappedLines.push(line);
        }
        
        // Calculate x position based on alignment for each line
        wrappedLines.forEach(wrappedLine => {
          let footerX = 25; // Default left alignment
          
          if (alignment === 'center') {
            // Calculate text width in points and center it
            const textWidth = font.widthOfTextAtSize(wrappedLine, 8);
            const textWidthMm = textWidth / 2.834645669;
            footerX = 25 + (170 - textWidthMm) / 2;
          } else if (alignment === 'right') {
            // Calculate text width and align right
            const textWidth = font.widthOfTextAtSize(wrappedLine, 8);
            const textWidthMm = textWidth / 2.834645669;
            footerX = 25 + 170 - textWidthMm;
          }
          
          footerLines.push({ text: wrappedLine, x: footerX, size: 8, isFooter: true });
        });
      }
      
      // Add legal information lines (wrapped)
      if (hasLegalInfo) {
        const legalInfo = [];
        
        if (letterData.companyName) legalInfo.push(letterData.companyName);
        if (letterData.registeredOffice) legalInfo.push(`Sitz: ${letterData.registeredOffice}`);
        if (letterData.companyPhone) legalInfo.push(`Tel: ${letterData.companyPhone}`);
        if (letterData.companyFax) legalInfo.push(`Fax: ${letterData.companyFax}`);
        if (letterData.companyEmail) legalInfo.push(`E-Mail: ${letterData.companyEmail}`);
        if (letterData.companyWebsite) legalInfo.push(`Internet: ${letterData.companyWebsite}`);
        if (letterData.bankDetails) legalInfo.push(letterData.bankDetails);
        if (letterData.vatId) legalInfo.push(`USt-IdNr.: ${letterData.vatId}`);
        if (letterData.managingDirectors) legalInfo.push(`Geschäftsführung: ${letterData.managingDirectors}`);
        if (letterData.supervisoryBoard) legalInfo.push(`Aufsichtsratsvorsitz: ${letterData.supervisoryBoard}`);
        if (letterData.registrationCourt && letterData.hrbNumber) {
          legalInfo.push(`Eingetragen beim Amtsgericht ${letterData.registrationCourt}, ${letterData.hrbNumber}`);
        }
        
        const legalText = legalInfo.filter(Boolean).join(', ');
        if (legalText) {
          // Manually wrap text
          const words = legalText.split(' ');
          let line = '';
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line ? `${line} ${words[i]}` : words[i];
            const width = font.widthOfTextAtSize(testLine, 8);
            
            if (width <= mmToPoints(170) || !line) {
              line = testLine;
            } else {
              footerLines.push({ text: line, x: 25, size: 8 });
              line = words[i];
            }
          }
          
          // Add the last line
          if (line) {
            footerLines.push({ text: line, x: 25, size: 8 });
          }
        }
      }
      
      // Draw all lines from bottom up with consistent spacing
      const totalLines = footerLines.length;
      const totalHeight = totalLines * lineSpacing + bottomMargin;
      let currentY = footerBoxBottom - bottomMargin;
      
      for (let i = totalLines - 1; i >= 0; i--) {
        addText(footerLines[i].text, footerLines[i].x, currentY, footerLines[i].size, false);
        if (i > 0) {
          // Add spacing between footer text and legal information (2mm only between different sections)
          const extraSpacing = (footerLines[i].isFooter !== footerLines[i-1].isFooter) ? 2 : 0;
          currentY -= (lineSpacing + extraSpacing);
        }
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
    // Bottom-aligned to 62.7mm from top with proper spacing
    const senderText = getSenderLine();
    if (senderText) {
      // Calculate if text needs wrapping and handle line spacing
      const lineHeight = 9 * 1.15; // Font size * line height = 10.35pt ≈ 3.65mm
      const maxHeight = SENDER_LINE.HEIGHT; // 17.7mm available
      const paddingBottom = 0.5; // 0.5mm padding from bottom
      
      // Check if text fits in one line
      const textWidth = font.widthOfTextAtSize(senderText, 9);
      const maxWidthPoints = mmToPoints(SENDER_LINE.WIDTH);
      
      if (textWidth <= maxWidthPoints) {
        // Single line: position at bottom with padding
        const yPos = 62.7 - paddingBottom;
        addText(senderText, SENDER_LINE.LEFT, yPos, 9, false);
      } else {
        // Two lines: wrap text and position from bottom up
        const words = senderText.split(' ');
        let line1 = '';
        let line2 = '';
        
        // Try to fit first part in line 1
        for (let i = 0; i < words.length; i++) {
          const testLine = line1 ? `${line1} ${words[i]}` : words[i];
          const testWidth = font.widthOfTextAtSize(testLine, 9);
          
          if (testWidth <= maxWidthPoints || !line1) {
            line1 = testLine;
          } else {
            // Rest goes to line 2
            line2 = words.slice(i).join(' ');
            break;
          }
        }
        
        // If all fits in line 1, split in middle
        if (!line2) {
          const midPoint = Math.floor(words.length / 2);
          line1 = words.slice(0, midPoint).join(' ');
          line2 = words.slice(midPoint).join(' ');
        }
        
        // Position lines from bottom up
        const lineHeightMm = 3.65; // Approximate line height in mm
        
        // Line 2: closest to bottom
        const line2Y = 62.7 - paddingBottom;
        addText(line2, SENDER_LINE.LEFT, line2Y, 9, false);
        
        // Line 1: above line 2
        const line1Y = line2Y - lineHeightMm;
        addText(line1, SENDER_LINE.LEFT, line1Y, 9, false);
      }
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
      
      // Add recipient address with proper wrapping
      let addressY = ADDRESS_WINDOW.TOP + 4;
      const lineHeight = 10 * 1.15; // 10pt * 1.15 = 11.5pt
      const lineHeightMm = lineHeight / 2.834645669; // Convert to mm (≈ 4.06mm)
      const maxWidthPoints = mmToPoints(ADDRESS_WINDOW.WIDTH - 4);
      
      // Helper to add a field with proper wrapping
      const addAddressField = (text, isBold) => {
        if (!text) return;
        
        // Check if text fits in one line
        const textWidth = (isBold ? boldFont : font).widthOfTextAtSize(text, 10);
        
        if (textWidth <= maxWidthPoints) {
          // Single line
          addText(text, ADDRESS_WINDOW.LEFT + 2, addressY, 10, isBold);
          addressY += lineHeightMm;
        } else {
          // Split into two lines
          const words = text.split(' ');
          let line1 = '';
          let line2 = '';
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line1 ? `${line1} ${words[i]}` : words[i];
            const testWidth = (isBold ? boldFont : font).widthOfTextAtSize(testLine, 10);
            
            if (testWidth <= maxWidthPoints || !line1) {
              line1 = testLine;
            } else {
              line2 = words.slice(i).join(' ');
              break;
            }
          }
          
          // If all fits in line 1, split in middle
          if (!line2) {
            const midPoint = Math.floor(words.length / 2);
            line1 = words.slice(0, midPoint).join(' ');
            line2 = words.slice(midPoint).join(' ');
          }
          
          // Render both lines
          addText(line1, ADDRESS_WINDOW.LEFT + 2, addressY, 10, isBold);
          addressY += lineHeightMm;
          addText(line2, ADDRESS_WINDOW.LEFT + 2, addressY, 10, isBold);
          addressY += lineHeightMm;
        }
      };
      
      if (letterData.recipientName) {
        addAddressField(letterData.recipientName, true);
      }
      if (letterData.recipientAddressSupplement) {
        addAddressField(letterData.recipientAddressSupplement, false);
      }
      if (letterData.recipientStreet) {
        addAddressField(letterData.recipientStreet, false);
      }
      if (letterData.recipientCity) {
        addAddressField(letterData.recipientCity, false);
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
    
    // Subject (120mm from top, 25mm from left, 170mm width) - Handle wrapping manually
    if (letterData.subject) {
      const subjectLineHeight = 11 * 1.15; // 11pt * 1.15 = 12.65pt
      const subjectLineHeightMm = subjectLineHeight / 2.834645669; // Convert to mm
      const maxWidthPoints = mmToPoints(SUBJECT.WIDTH);
      let subjectY = SUBJECT.TOP;
      
      // Check if text fits in one line
      const textWidth = boldFont.widthOfTextAtSize(letterData.subject, 11);
      
      if (textWidth <= maxWidthPoints) {
        // Single line
        addText(letterData.subject, SUBJECT.LEFT, subjectY, 11, true);
      } else {
        // Split into two lines
        const words = letterData.subject.split(' ');
        let line1 = '';
        let line2 = '';
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line1 ? `${line1} ${words[i]}` : words[i];
          const testWidth = boldFont.widthOfTextAtSize(testLine, 11);
          
          if (testWidth <= maxWidthPoints || !line1) {
            line1 = testLine;
          } else {
            line2 = words.slice(i).join(' ');
            break;
          }
        }
        
        // If all fits in line 1, split in middle
        if (!line2) {
          const midPoint = Math.floor(words.length / 2);
          line1 = words.slice(0, midPoint).join(' ');
          line2 = words.slice(midPoint).join(' ');
        }
        
        // Render both lines
        addText(line1, SUBJECT.LEFT, subjectY, 11, true);
        subjectY += subjectLineHeightMm;
        addText(line2, SUBJECT.LEFT, subjectY, 11, true);
      }
    }
    
    // Salutation (140mm from top, 25mm from left, 170mm width) - Handle wrapping manually
    if (letterData.salutation) {
      const salutationLineHeight = 11 * 1.15; // 11pt * 1.15 = 12.65pt
      const salutationLineHeightMm = salutationLineHeight / 2.834645669; // Convert to mm
      const maxWidthPoints = mmToPoints(SUBJECT.WIDTH); // Same width as subject
      let salutationY = SALUTATION.TOP;
      
      // Check if text fits in one line
      const textWidth = font.widthOfTextAtSize(letterData.salutation, 11);
      
      if (textWidth <= maxWidthPoints) {
        // Single line
        addText(letterData.salutation, SALUTATION.LEFT, salutationY, 11, false);
      } else {
        // Split into two lines
        const words = letterData.salutation.split(' ');
        let line1 = '';
        let line2 = '';
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line1 ? `${line1} ${words[i]}` : words[i];
          const testWidth = font.widthOfTextAtSize(testLine, 11);
          
          if (testWidth <= maxWidthPoints || !line1) {
            line1 = testLine;
          } else {
            line2 = words.slice(i).join(' ');
            break;
          }
        }
        
        // If all fits in line 1, split in middle
        if (!line2) {
          const midPoint = Math.floor(words.length / 2);
          line1 = words.slice(0, midPoint).join(' ');
          line2 = words.slice(midPoint).join(' ');
        }
        
        // Render both lines
        addText(line1, SALUTATION.LEFT, salutationY, 11, false);
        salutationY += salutationLineHeightMm;
        addText(line2, SALUTATION.LEFT, salutationY, 11, false);
      }
    }
    
    // Body (160mm from top, 25mm from left, 170mm width) - Handle line breaks exactly like preview
    if (letterData.body) {
      const lines = letterData.body.split('\n');
      let currentY = BODY.TOP;
      const lineHeight = 4; // 4mm line height
      
      for (const line of lines) {
        if (line.trim()) {
          // Non-empty line - render the text with word wrapping
          // Split long lines into multiple lines if needed
          const words = line.split(' ');
          let currentLine = '';
          
          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = font.widthOfTextAtSize(testLine, 11);
            const maxWidthPoints = mmToPoints(BODY.WIDTH);
            
            if (testWidth <= maxWidthPoints || !currentLine) {
              currentLine = testLine;
            } else {
              // Current line is too long, render it and start new line
              addText(currentLine, BODY.LEFT, currentY, 11, false);
              currentY += lineHeight;
              currentLine = word;
            }
          }
          
          // Render the last line
          if (currentLine) {
            addText(currentLine, BODY.LEFT, currentY, 11, false);
          }
        }
        // Always advance Y position for both empty and non-empty lines to preserve paragraph spacing
        currentY += lineHeight;
      }
    }
    
    // Closing (positioned after body)
    if (letterData.closing) {
      const bodyLines = letterData.body ? letterData.body.split('\n').length : 0;
      const closingY = BODY.TOP + (bodyLines * 4) + 8; // 8mm spacing after body
      addText(letterData.closing, CLOSING.LEFT, closingY, 11, false, CLOSING.WIDTH);
    }
    
    // Signature Name (positioned after closing) - Handle wrapping manually
    if (letterData.signatureName) {
      const bodyLines = letterData.body ? letterData.body.split('\n').length : 0;
      const signatureY = BODY.TOP + (bodyLines * 4) + 16; // 16mm spacing after body
      
      const sigLineHeight = 11 * 1.15; // 11pt * 1.15 = 12.65pt
      const sigLineHeightMm = sigLineHeight / 2.834645669; // Convert to mm
      const maxWidthPoints = mmToPoints(CLOSING.WIDTH);
      let sigY = signatureY;
      
      // Check if text fits in one line
      const textWidth = font.widthOfTextAtSize(letterData.signatureName, 11);
      
      if (textWidth <= maxWidthPoints) {
        // Single line
        addText(letterData.signatureName, CLOSING.LEFT, sigY, 11, false);
      } else {
        // Split into two lines
        const words = letterData.signatureName.split(' ');
        let line1 = '';
        let line2 = '';
        
        for (let i = 0; i < words.length; i++) {
          const testLine = line1 ? `${line1} ${words[i]}` : words[i];
          const testWidth = font.widthOfTextAtSize(testLine, 11);
          
          if (testWidth <= maxWidthPoints || !line1) {
            line1 = testLine;
          } else {
            line2 = words.slice(i).join(' ');
            break;
          }
        }
        
        // If all fits in line 1, split in middle
        if (!line2) {
          const midPoint = Math.floor(words.length / 2);
          line1 = words.slice(0, midPoint).join(' ');
          line2 = words.slice(midPoint).join(' ');
        }
        
        // Render both lines
        addText(line1, CLOSING.LEFT, sigY, 11, false);
        sigY += sigLineHeightMm;
        addText(line2, CLOSING.LEFT, sigY, 11, false);
      }
    }
    
    // Footer (if enabled) - Handle wrapping with size 8 and respect alignment
    if (letterData.enableFooter && letterData.footerText) {
      const footerY = 280; // 280mm from top
      const lineSpacing = 3; // Same as legal info
      const text = letterData.footerText;
      const alignment = letterData.footerAlignment || 'center';
      
      // Manually wrap text
      const words = text.split(' ');
      let line = '';
      let currentY = footerY;
      
      for (let i = 0; i < words.length; i++) {
        const testLine = line ? `${line} ${words[i]}` : words[i];
        const width = font.widthOfTextAtSize(testLine, 8);
        
        if (width <= mmToPoints(170) || !line) {
          line = testLine;
        } else {
          // Calculate x position based on alignment
          let footerX = 25; // Default left
          if (alignment === 'center') {
            const textWidth = font.widthOfTextAtSize(line, 8);
            const textWidthMm = textWidth / 2.834645669;
            footerX = 25 + (170 - textWidthMm) / 2;
          } else if (alignment === 'right') {
            const textWidth = font.widthOfTextAtSize(line, 8);
            const textWidthMm = textWidth / 2.834645669;
            footerX = 25 + 170 - textWidthMm;
          }
          
          addText(line, footerX, currentY, 8, false);
          currentY -= lineSpacing;
          line = words[i];
        }
      }
      
      // Add the last line
      if (line) {
        let footerX = 25; // Default left
        if (alignment === 'center') {
          const textWidth = font.widthOfTextAtSize(line, 8);
          const textWidthMm = textWidth / 2.834645669;
          footerX = 25 + (170 - textWidthMm) / 2;
        } else if (alignment === 'right') {
          const textWidth = font.widthOfTextAtSize(line, 8);
          const textWidthMm = textWidth / 2.834645669;
          footerX = 25 + 170 - textWidthMm;
        }
        addText(line, footerX, currentY, 8, false);
      }
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