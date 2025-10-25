
import React, { forwardRef } from 'react';
import { FileText } from 'lucide-react';
import A4Canvas from './A4Canvas';
import { 
  SENDER_LINE, 
  ADDRESS_WINDOW, 
  INFO_BOX, 
  DATE, 
  SUBJECT, 
  SALUTATION, 
  BODY, 
  CLOSING, 
  FOOTER,
  mmToPx,
  mmToPercent,
  mmToPercentHeight
} from '../../lib/din5008B';

const LetterPreview = forwardRef(({ letterData, translations: t }, ref) => {
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
      <A4Canvas
        ref={ref}
        showGuides={letterData.showGuides}
        showFoldMarks={letterData.showFoldMarks}
        showHoleMark={letterData.showHoleMark}
        className="print:block"
      >
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
            {/* Sender Block - DIN 5008-B positioning (45mm to 62.7mm) */}
            {getSenderLine() && (
              <div 
                className="din-9pt" 
                style={{ 
                  position: 'absolute',
                  top: mmToPercentHeight(SENDER_LINE.TOP),
                  left: mmToPercent(SENDER_LINE.LEFT),
                  width: mmToPercent(SENDER_LINE.WIDTH),
                  height: mmToPercentHeight(SENDER_LINE.HEIGHT),
                  display: 'flex',
                  alignItems: 'flex-end',
                  paddingBottom: mmToPercentHeight(1) // Small padding from bottom edge
                }}
              >
                {getSenderLine()}
              </div>
            )}

            {/* Information Box - DIN 5008-B positioning */}
            <div 
              className="din-9pt" 
              style={{ 
                position: 'absolute',
                top: mmToPercentHeight(INFO_BOX.TOP),
                left: mmToPercent(INFO_BOX.LEFT),
                right: mmToPercent(INFO_BOX.RIGHT),
                height: mmToPercentHeight(INFO_BOX.HEIGHT),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* Contact info at top */}
              <div style={{ paddingTop: mmToPercentHeight(12.7) }}>
                {letterData.senderPhone && (
                  <div>Telefon: {letterData.senderPhone}</div>
                )}
                {letterData.senderEmail && (
                  <div>E-Mail: {letterData.senderEmail}</div>
                )}
              </div>

              {/* Date at bottom, right-aligned */}
              {letterData.date && (
                <div className="din-text" style={{ textAlign: 'right', paddingRight: mmToPercent(10) }}>
                  {letterData.date}
                </div>
              )}
            </div>
            
            {/* Recipient Address Window - DIN 5008-B positioning (62.7mm to 90mm) */}
            <div 
              className="din-address-main" 
              style={{ 
                position: 'absolute',
                top: mmToPercentHeight(ADDRESS_WINDOW.TOP),
                left: mmToPercent(ADDRESS_WINDOW.LEFT),
                width: mmToPercent(ADDRESS_WINDOW.WIDTH),
                height: mmToPercentHeight(ADDRESS_WINDOW.HEIGHT)
              }}
            >
              {letterData.recipientName && <div style={{ fontWeight: 600 }}>{letterData.recipientName}</div>}
              {letterData.recipientStreet && <div>{letterData.recipientStreet}</div>}
              {letterData.recipientCity && <div>{letterData.recipientCity}</div>}
            </div>

            {/* Subject Line - DIN 5008-B positioning */}
            {letterData.subject && (
              <div 
                className="din-text" 
                style={{ 
                  position: 'absolute',
                  top: mmToPercentHeight(SUBJECT.TOP),
                  left: mmToPercent(SUBJECT.LEFT),
                  right: mmToPercent(SUBJECT.RIGHT - SUBJECT.LEFT),
                  fontWeight: 'bold'
                }}
              >
                {letterData.subject}
              </div>
            )}

            {/* Salutation - DIN 5008-B positioning */}
            {letterData.salutation && (
              <div 
                className="din-text" 
                style={{ 
                  position: 'absolute',
                  top: mmToPercentHeight(SALUTATION.TOP),
                  left: mmToPercent(SALUTATION.LEFT),
                  right: mmToPercent(SALUTATION.RIGHT - SALUTATION.LEFT)
                }}
              >
                {letterData.salutation}
              </div>
            )}

            {/* Body Text - DIN 5008-B positioning */}
            {letterData.body && (
              <div 
                className="din-text" 
                style={{ 
                  position: 'absolute',
                  top: mmToPercentHeight(BODY.TOP),
                  left: mmToPercent(BODY.LEFT),
                  right: mmToPercent(BODY.RIGHT - BODY.LEFT),
                  textAlign: 'justify',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {letterData.body}
              </div>
            )}

            {/* Closing - DIN 5008-B positioning */}
            {letterData.closing && letterData.body && (
              <div 
                className="din-text" 
                style={{ 
                  position: 'absolute',
                  bottom: mmToPercentHeight(CLOSING.BOTTOM),
                  left: mmToPercent(CLOSING.LEFT),
                  right: mmToPercent(CLOSING.RIGHT - CLOSING.LEFT)
                }}
              >
                <div>{letterData.closing}</div>
                {/* Signature space */}
                <div style={{ height: mmToPercentHeight(CLOSING.SIGNATURE_SPACE) }}></div>
                {letterData.signatureName && <div>{letterData.signatureName}</div>}
              </div>
            )}

            {/* Footer Area - DIN 5008-B positioning */}
            {(letterData.enableFooter || letterData.enableLegalInfo) && (
              <div 
                style={{
                  position: 'absolute',
                  bottom: mmToPercentHeight(FOOTER.BOTTOM),
                  left: mmToPercent(FOOTER.LEFT),
                  right: mmToPercent(FOOTER.RIGHT - FOOTER.LEFT),
                  maxHeight: mmToPercentHeight(FOOTER.HEIGHT),
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
      </A4Canvas>

      {/* Format indicator */}
      {hasContent && (
        <div className="mt-3 text-center text-xs text-slate-400 print:hidden">
          {t.formatInfo}
        </div>
      )}
    </div>
  );
});

LetterPreview.displayName = 'LetterPreview';

export default LetterPreview;
