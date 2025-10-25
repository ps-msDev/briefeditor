
import React from 'react';
import { FileText } from 'lucide-react';

export default function LetterPreview({ letterData, translations: t }) {
  const hasContent = letterData.senderName || letterData.recipientName || letterData.subject || letterData.body;

  // Format sender as single line with pipe separators
  const getSenderLine = () => {
    const parts = [];
    if (letterData.senderName) parts.push(letterData.senderName);
    if (letterData.senderStreet) parts.push(letterData.senderStreet);
    if (letterData.senderCity) parts.push(letterData.senderCity);
    return parts.join(' | ');
  };

  return (
    <div className="relative w-full">
      {/* Print Styles - DIN 5008 compliant */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            height: 297mm;
          }
          @page {
            size: A4;
            margin: 0;
          }
          .print\\:hidden {
            display: none !important;
            visibility: hidden !important;
          }
        }
        
        /* DIN 5008 Typography */
        .din-text {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 11pt;
          line-height: 1.15;
          color: #000;
        }
        
        .din-9pt {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 9pt;
          line-height: 1.15;
          color: #000;
        }
        
        .din-address-main {
          font-family: Arial, Helvetica, sans-serif;
          font-size: 10pt;
          line-height: 1.15;
          color: #000;
        }
      `}</style>

      {/* A4 Paper Container - Responsive */}
      <div className="bg-white shadow-xl print:shadow-none print-area mx-auto" style={{ 
        width: '100%',
        maxWidth: '210mm',
        aspectRatio: '210 / 297',
        position: 'relative'
      }}>
        {/* Fold Mark 1 - 105mm from top */}
        {letterData.showFoldMarks && (
          <div style={{
            position: 'absolute',
            top: '105mm',
            left: '1mm',
            width: '5mm',
            height: 0,
            borderTop: '0.2pt solid #C7C7C7',
            zIndex: 100
          }} />
        )}

        {/* Fold Mark 2 - 210mm from top */}
        {letterData.showFoldMarks && (
          <div style={{
            position: 'absolute',
            top: '210mm',
            left: '1mm',
            width: '5mm',
            height: 0,
            borderTop: '0.2pt solid #C7C7C7',
            zIndex: 100
          }} />
        )}

        {/* Hole Mark - 148.5mm from top */}
        {letterData.showHoleMark && (
          <div style={{
            position: 'absolute',
            top: '148.5mm',
            left: '1mm',
            width: '8mm',
            height: 0,
            borderTop: '0.2pt solid #C7C7C7',
            zIndex: 100
          }} />
        )}

        {/* DIN 5008 Guides Overlay (screen only) */}
        {letterData.showGuides && (
          <div className="print:hidden" style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10
          }}>
            {/* Page margins */}
            <div style={{
              position: 'absolute',
              top: '45mm',
              left: '25mm',
              right: '20mm',
              bottom: '25mm',
              border: '2px dashed rgb(96, 165, 250)',
              opacity: 0.3
            }} />
            
            {/* Sender block */}
            <div className="absolute border border-dashed border-purple-400 bg-purple-100 opacity-20" style={{
              top: '45mm',
              left: '25mm',
              width: '80mm',
              height: '17.7mm'
            }} />
            <div className="absolute text-[8px] text-purple-600 font-mono" style={{
              top: '44mm',
              left: '25mm'
            }}>Absender</div>
            
            {/* Recipient address window */}
            <div className="absolute border-2 border-dashed border-green-500 bg-green-100 opacity-20" style={{
              top: '62.7mm',
              left: '25mm',
              width: '80mm',
              height: '27.3mm'
            }} />
            <div className="absolute text-[8px] text-green-600 font-mono" style={{
              top: '61.7mm',
              left: '25mm'
            }}>Anschrift</div>
            
            {/* Info box area */}
            <div style={{
              position: 'absolute',
              top: '50mm',
              left: '125mm',
              right: '10mm', /* Adjusted from 20mm to 10mm */
              height: '40mm',
              border: '2px dashed rgb(249, 115, 22)',
              backgroundColor: 'rgb(255, 237, 213)',
              opacity: 0.2
            }} />
            <div style={{
              position: 'absolute',
              top: '49mm',
              left: '125mm',
              fontSize: '8px',
              color: 'rgb(234, 88, 12)',
              fontFamily: 'monospace'
            }}>Info-Block</div>
            
            {/* Footer area */}
            <div style={{
              position: 'absolute',
              bottom: '10mm',
              left: '25mm',
              right: '20mm',
              height: '25mm',
              border: '2px dashed rgb(239, 68, 68)',
              backgroundColor: 'rgb(254, 226, 226)',
              opacity: 0.2
            }} />
            <div style={{
              position: 'absolute',
              bottom: '34mm',
              left: '25mm',
              fontSize: '8px',
              color: 'rgb(220, 38, 38)',
              fontFamily: 'monospace'
            }}>Fußzeile</div>
          </div>
        )}

        {/* Letter Content with exact DIN 5008 measurements */}
        <div className="din-text absolute inset-0" style={{ 
          paddingLeft: 'min(25mm, 8%)',
          paddingRight: 'min(20mm, 6%)',
          paddingTop: 'min(45mm, 15%)',
          paddingBottom: 'min(25mm, 8%)'
        }}>
          {!hasContent ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'rgb(203, 213, 225)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <FileText className="w-20 h-20 mx-auto mb-4 opacity-20" />
                <p style={{ fontSize: '16px' }}>{t.previewEmpty}</p>
                <p style={{ fontSize: '14px', marginTop: '8px' }}>{t.previewStart}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Sender Block (45mm from top, text aligned to bottom at 62.7mm) */}
              {getSenderLine() && (
                <div 
                  className="din-9pt" 
                  style={{ 
                    position: 'absolute',
                    top: '45mm',
                    left: '25mm',
                    width: '85mm',
                    height: '17.7mm',
                    display: 'flex',
                    alignItems: 'flex-end',
                    paddingBottom: '0.5mm'
                  }}
                >
                  {getSenderLine()}
                </div>
              )}

              {/* Information Box (top right): Telefon, E-Mail at top, Date at bottom */}
              <div 
                className="din-9pt" 
                style={{ 
                  position: 'absolute',
                  top: '50mm',
                  left: '125mm',
                  right: '10mm', // Adjusted right margin
                  height: '40mm',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {/* Contact info at top with 12.7mm padding */}
                <div style={{ paddingTop: '12.7mm' }}>
                  {letterData.senderPhone && (
                    <div>Telefon: {letterData.senderPhone}</div>
                  )}
                  {letterData.senderEmail && (
                    <div>E-Mail: {letterData.senderEmail}</div>
                  )}
                </div>

                {/* Date at bottom, right-aligned with 10mm space from info box right edge */}
                {letterData.date && (
                  <div className="din-text" style={{ textAlign: 'right', paddingRight: '10mm' }}>
                    {letterData.date}
                  </div>
                )}
              </div>
              
              {/* Recipient Address Window (starts at 62.7mm from top, max height to 90mm) */}
              <div 
                className="din-address-main" 
                style={{ 
                  position: 'absolute',
                  top: '62.7mm',
                  left: '25mm',
                  width: '85mm',
                  maxHeight: '27.3mm' /* Changed to maxHeight */
                }}
              >
                {letterData.recipientName && <div style={{ fontWeight: 600 }}>{letterData.recipientName}</div>}
                {letterData.recipientStreet && <div>{letterData.recipientStreet}</div>}
                {letterData.recipientCity && <div>{letterData.recipientCity}</div>}
              </div>

              {/* Subject Line (bold, 125mm from top) */}
              {letterData.subject && (
                <div 
                  className="din-text" 
                  style={{ 
                    position: 'absolute',
                    top: '125mm',
                    left: '25mm',
                    right: '20mm',
                    fontWeight: 'bold'
                  }}
                >
                  {letterData.subject}
                </div>
              )}

              {/* Salutation (143mm from top, one blank line after subject) */}
              {letterData.salutation && (
                <div 
                  className="din-text" 
                  style={{ 
                    position: 'absolute',
                    top: '143mm',
                    left: '25mm',
                    right: '20mm'
                  }}
                >
                  {letterData.salutation}
                </div>
              )}

              {/* Body Text (starts around 156mm from top) */}
              {letterData.body && (
                <div 
                  className="din-text" 
                  style={{ 
                    position: 'absolute',
                    top: '156mm',
                    left: '25mm',
                    right: '20mm',
                    textAlign: 'justify',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {letterData.body}
                </div>
              )}

              {/* Closing (positioned dynamically, but leaving space for signature) */}
              {letterData.closing && letterData.body && (
                <div 
                  className="din-text" 
                  style={{ 
                    position: 'absolute',
                    bottom: '45mm',
                    left: '25mm',
                    right: '20mm'
                  }}
                >
                  <div>{letterData.closing}</div>
                  {/* Signature space - 3-4 blank lines */}
                  <div style={{ height: '15mm' }}></div>
                  {letterData.signatureName && <div>{letterData.signatureName}</div>}
                </div>
              )}

              {/* Footer Area (at least 10mm from bottom) */}
              {(letterData.enableFooter || letterData.enableLegalInfo) && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '10mm',
                    left: '25mm',
                    right: '20mm',
                    maxHeight: '25mm',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end'
                  }}
                >
                  {/* Custom Footer Text */}
                  {letterData.enableFooter && letterData.footerText && (
                    <div 
                      className="din-9pt"
                      style={{ 
                        textAlign: letterData.footerAlignment,
                        fontSize: '8pt',
                        whiteSpace: 'pre-wrap',
                        marginBottom: '8px'
                      }}
                    >
                      {letterData.footerText}
                    </div>
                  )}

                  {/* Legal Information */}
                  {letterData.enableLegalInfo && (
                    <div 
                      className="din-9pt"
                      style={{ 
                        fontSize: '8pt',
                        lineHeight: '1.2'
                      }}
                    >
                      <div>
                        {[
                          letterData.companyName,
                          letterData.registeredOffice && `Sitz: ${letterData.registeredOffice}`,
                          letterData.companyPhone && `Tel: ${letterData.companyPhone}`,
                          letterData.companyFax && `Fax: ${letterData.companyFax}`,
                          letterData.companyEmail && `E-Mail: ${letterData.companyEmail}`,
                          letterData.companyWebsite && `Internet: ${letterData.companyWebsite}`,
                          letterData.bankDetails,
                          letterData.vatId && `USt-IdNr.: ${letterData.vatId}`,
                          letterData.managingDirectors && `Geschäftsführung: ${letterData.managingDirectors}`,
                          letterData.supervisoryBoard && `Aufsichtsratsvorsitz: ${letterData.supervisoryBoard}`,
                          letterData.registrationCourt && letterData.hrbNumber && 
                            `Eingetragen beim Amtsgericht ${letterData.registrationCourt}, ${letterData.hrbNumber}`
                        ].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Format indicator */}
      {hasContent && (
        <div className="mt-3 text-center text-xs text-slate-400 print:hidden">
          {t.formatInfo}
        </div>
      )}
    </div>
  );
}
