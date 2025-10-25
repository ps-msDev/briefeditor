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
    <div className="relative w-full max-w-[210mm] mx-auto">
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
        
        /* DIN 5008 Typography - Screen uses relative sizing */
        .din-text {
          font-family: Arial, Helvetica, sans-serif;
          line-height: 1.15;
          color: #000;
        }
        
        @media screen {
          .din-text {
            font-size: clamp(8px, 1.5vw, 11pt);
          }
          .din-9pt {
            font-size: clamp(7px, 1.3vw, 9pt);
          }
          .din-address-main {
            font-size: clamp(7.5px, 1.4vw, 10pt);
          }
        }
        
        @media print {
          .din-text {
            font-size: 11pt;
          }
          .din-9pt {
            font-size: 9pt;
          }
          .din-address-main {
            font-size: 10pt;
          }
        }
      `}</style>

      {/* A4 Paper Container - Responsive with proper aspect ratio */}
      <div className="bg-white shadow-xl print:shadow-none print-area w-full relative overflow-hidden" style={{ 
        aspectRatio: '210 / 297'
      }}>
        {/* Fold Marks - Using percentage for screen, mm for print */}
        {letterData.showFoldMarks && (
          <>
            <div className="absolute left-0 w-[2.38%] h-[0.5px] bg-slate-400 print:hidden" style={{ top: '35.35%' }} />
            <div className="absolute left-0 w-[2.38%] h-[0.5px] bg-slate-400 print:hidden" style={{ top: '70.71%' }} />
            <div style={{
              position: 'absolute',
              top: '105mm',
              left: '1mm',
              width: '5mm',
              height: 0,
              borderTop: '0.2pt solid #C7C7C7',
              display: 'none'
            }} className="print:block" />
            <div style={{
              position: 'absolute',
              top: '210mm',
              left: '1mm',
              width: '5mm',
              height: 0,
              borderTop: '0.2pt solid #C7C7C7',
              display: 'none'
            }} className="print:block" />
          </>
        )}

        {/* Hole Mark */}
        {letterData.showHoleMark && (
          <>
            <div className="absolute left-0 w-[3.81%] h-[0.5px] bg-slate-400 print:hidden" style={{ top: '50%' }} />
            <div style={{
              position: 'absolute',
              top: '148.5mm',
              left: '1mm',
              width: '8mm',
              height: 0,
              borderTop: '0.2pt solid #C7C7C7',
              display: 'none'
            }} className="print:block" />
          </>
        )}

        {/* DIN 5008 Guides Overlay (screen only) */}
        {letterData.showGuides && (
          <div className="print:hidden absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
            {/* Page margins - Using percentages */}
            <div className="absolute border-2 border-dashed border-blue-400 opacity-30" style={{
              top: '15.15%',
              left: '11.9%',
              right: '9.52%',
              bottom: '8.42%'
            }} />
            
            {/* Sender block */}
            <div className="absolute border border-dashed border-purple-400 bg-purple-100 opacity-20" style={{
              top: '15.15%',
              left: '11.9%',
              width: '38.1%',
              height: '5.96%'
            }} />
            <div className="absolute text-[8px] text-purple-600 font-mono" style={{
              top: '14.5%',
              left: '11.9%'
            }}>Absender</div>
            
            {/* Recipient address window */}
            <div className="absolute border-2 border-dashed border-green-500 bg-green-100 opacity-20" style={{
              top: '21.11%',
              left: '11.9%',
              width: '38.1%',
              height: '9.19%'
            }} />
            <div className="absolute text-[8px] text-green-600 font-mono" style={{
              top: '20.5%',
              left: '11.9%'
            }}>Anschrift</div>
            
            {/* Info box area */}
            <div className="absolute border-2 border-dashed border-orange-500 bg-orange-100 opacity-20" style={{
              top: '16.84%',
              left: '59.52%',
              right: '9.52%',
              height: '13.47%'
            }} />
            <div className="absolute text-[8px] text-orange-600 font-mono" style={{
              top: '16.2%',
              left: '59.52%'
            }}>Info-Block</div>
            
            {/* Footer area */}
            <div className="absolute border-2 border-dashed border-red-500 bg-red-100 opacity-20" style={{
              bottom: '3.37%',
              left: '11.9%',
              right: '9.52%',
              height: '8.42%'
            }} />
            <div className="absolute text-[8px] text-red-600 font-mono" style={{
              bottom: '11.8%',
              left: '11.9%'
            }}>Fußzeile</div>
          </div>
        )}

        {/* Letter Content - Using percentages for screen, mm for print */}
        <div className="din-text absolute inset-0">
          {!hasContent ? (
            <div className="flex items-center justify-center h-full text-slate-300">
              <div className="text-center">
                <FileText className="w-12 h-12 sm:w-20 sm:h-20 mx-auto mb-4 opacity-20" />
                <p className="text-sm sm:text-base">{t.previewEmpty}</p>
                <p className="text-xs sm:text-sm mt-2">{t.previewStart}</p>
              </div>
            </div>
          ) : (
            <>
              {/* Sender Block - Screen uses %, print uses mm */}
              {getSenderLine() && (
                <>
                  <div className="din-9pt absolute print:hidden flex items-end" style={{ 
                    top: '15.15%',
                    left: '11.9%',
                    width: '40.48%',
                    height: '5.96%',
                    paddingBottom: '0.5%'
                  }}>
                    {getSenderLine()}
                  </div>
                  <div className="din-9pt absolute hidden print:flex items-end" style={{ 
                    top: '45mm',
                    left: '25mm',
                    width: '85mm',
                    height: '17.7mm',
                    paddingBottom: '0.5mm'
                  }}>
                    {getSenderLine()}
                  </div>
                </>
              )}

              {/* Information Box - Screen uses %, print uses mm */}
              <div className="din-9pt absolute print:hidden flex flex-col justify-between" style={{ 
                top: '16.84%',
                left: '59.52%',
                right: '9.52%',
                height: '13.47%'
              }}>
                <div style={{ paddingTop: '4.28%' }}>
                  {letterData.senderPhone && <div>Telefon: {letterData.senderPhone}</div>}
                  {letterData.senderEmail && <div>E-Mail: {letterData.senderEmail}</div>}
                </div>
                {letterData.date && (
                  <div className="din-text text-right" style={{ paddingRight: '4.76%' }}>
                    {letterData.date}
                  </div>
                )}
              </div>
              <div className="din-9pt absolute hidden print:flex flex-col justify-between" style={{ 
                top: '50mm',
                left: '125mm',
                right: '10mm',
                height: '40mm'
              }}>
                <div style={{ paddingTop: '12.7mm' }}>
                  {letterData.senderPhone && <div>Telefon: {letterData.senderPhone}</div>}
                  {letterData.senderEmail && <div>E-Mail: {letterData.senderEmail}</div>}
                </div>
                {letterData.date && (
                  <div className="din-text text-right" style={{ paddingRight: '10mm' }}>
                    {letterData.date}
                  </div>
                )}
              </div>
              
              {/* Recipient Address - Screen uses %, print uses mm */}
              {letterData.recipientName && (
                <>
                  <div className="din-address-main absolute print:hidden" style={{ 
                    top: '21.11%',
                    left: '11.9%',
                    width: '40.48%',
                    maxHeight: '9.19%'
                  }}>
                    <div className="font-semibold">{letterData.recipientName}</div>
                    {letterData.recipientStreet && <div>{letterData.recipientStreet}</div>}
                    {letterData.recipientCity && <div>{letterData.recipientCity}</div>}
                  </div>
                  <div className="din-address-main absolute hidden print:block" style={{ 
                    top: '62.7mm',
                    left: '25mm',
                    width: '85mm',
                    maxHeight: '27.3mm'
                  }}>
                    <div className="font-semibold">{letterData.recipientName}</div>
                    {letterData.recipientStreet && <div>{letterData.recipientStreet}</div>}
                    {letterData.recipientCity && <div>{letterData.recipientCity}</div>}
                  </div>
                </>
              )}

              {/* Subject Line - Screen uses %, print uses mm */}
              {letterData.subject && (
                <>
                  <div className="din-text absolute print:hidden font-bold" style={{ 
                    top: '42.09%',
                    left: '11.9%',
                    right: '9.52%'
                  }}>
                    {letterData.subject}
                  </div>
                  <div className="din-text absolute hidden print:block font-bold" style={{ 
                    top: '125mm',
                    left: '25mm',
                    right: '20mm'
                  }}>
                    {letterData.subject}
                  </div>
                </>
              )}

              {/* Salutation - Screen uses %, print uses mm */}
              {letterData.salutation && (
                <>
                  <div className="din-text absolute print:hidden" style={{ 
                    top: '48.15%',
                    left: '11.9%',
                    right: '9.52%'
                  }}>
                    {letterData.salutation}
                  </div>
                  <div className="din-text absolute hidden print:block" style={{ 
                    top: '143mm',
                    left: '25mm',
                    right: '20mm'
                  }}>
                    {letterData.salutation}
                  </div>
                </>
              )}

              {/* Body Text - Screen uses %, print uses mm */}
              {letterData.body && (
                <>
                  <div className="din-text absolute print:hidden text-justify whitespace-pre-wrap" style={{ 
                    top: '52.53%',
                    left: '11.9%',
                    right: '9.52%',
                    maxHeight: '30%',
                    overflow: 'hidden'
                  }}>
                    {letterData.body}
                  </div>
                  <div className="din-text absolute hidden print:block text-justify whitespace-pre-wrap" style={{ 
                    top: '156mm',
                    left: '25mm',
                    right: '20mm'
                  }}>
                    {letterData.body}
                  </div>
                </>
              )}

              {/* Closing and Signature - Screen uses %, print uses mm */}
              {letterData.closing && letterData.body && (
                <>
                  <div className="din-text absolute print:hidden" style={{ 
                    bottom: '15.15%',
                    left: '11.9%',
                    right: '9.52%'
                  }}>
                    <div>{letterData.closing}</div>
                    <div style={{ height: '5.05%' }}></div>
                    {letterData.signatureName && <div>{letterData.signatureName}</div>}
                  </div>
                  <div className="din-text absolute hidden print:block" style={{ 
                    bottom: '45mm',
                    left: '25mm',
                    right: '20mm'
                  }}>
                    <div>{letterData.closing}</div>
                    <div style={{ height: '15mm' }}></div>
                    {letterData.signatureName && <div>{letterData.signatureName}</div>}
                  </div>
                </>
              )}

              {/* Footer Area - Screen uses %, print uses mm */}
              {(letterData.enableFooter || letterData.enableLegalInfo) && (
                <>
                  <div className="absolute print:hidden flex flex-col justify-end" style={{
                    bottom: '3.37%',
                    left: '11.9%',
                    right: '9.52%',
                    maxHeight: '8.42%'
                  }}>
                    {letterData.enableFooter && letterData.footerText && (
                      <div 
                        className="din-9pt whitespace-pre-wrap mb-2"
                        style={{ 
                          textAlign: letterData.footerAlignment,
                          fontSize: 'clamp(6px, 1.1vw, 8pt)'
                        }}
                      >
                        {letterData.footerText}
                      </div>
                    )}
                    {letterData.enableLegalInfo && (
                      <div className="din-9pt" style={{ fontSize: 'clamp(6px, 1.1vw, 8pt)', lineHeight: '1.2' }}>
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
                  <div className="absolute hidden print:flex flex-col justify-end" style={{
                    bottom: '10mm',
                    left: '25mm',
                    right: '20mm',
                    maxHeight: '25mm'
                  }}>
                    {letterData.enableFooter && letterData.footerText && (
                      <div 
                        className="din-9pt whitespace-pre-wrap"
                        style={{ 
                          textAlign: letterData.footerAlignment,
                          fontSize: '8pt',
                          marginBottom: '8px'
                        }}
                      >
                        {letterData.footerText}
                      </div>
                    )}
                    {letterData.enableLegalInfo && (
                      <div className="din-9pt" style={{ fontSize: '8pt', lineHeight: '1.2' }}>
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
                </>
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