import { FileText } from 'lucide-react';
import {
  A4_WIDTH_MM,
  MM_PER_PT,
  CONTENT_MARGINS,
  CONTENT_AREA,
  SENDER_LINE,
  ADDRESS_WINDOW,
  SEPARATOR,
  INFO_BOX,
  DATE,
  SUBJECT,
  FOOTER,
  MARKS,
  TYPOGRAPHY,
  SPACING,
  mmToPercent,
  mmToPercentHeight,
  baselineToTopPercent,
  blankLinesEm
} from '../../lib/din5008B';
import { getSenderLine, getLegalInfoText } from '../../lib/letterText';

/**
 * Font size in container-query width units (cqw), so the text scales
 * exactly with the A4 paper container - matching the PDF proportions
 * at any viewport size.
 */
const fontSizeCqw = (pt) => `${((pt * MM_PER_PT) / A4_WIDTH_MM * 100).toFixed(4)}cqw`;

export default function LetterPreview({ letterData, translations: t }) {
  const hasContent = letterData.senderName || letterData.recipientName || letterData.subject || letterData.body;
  const senderLine = getSenderLine(letterData);
  const legalInfoText = getLegalInfoText(letterData);

  return (
    <div className="relative w-full max-w-[210mm] mx-auto">
      {/* Print styles + DIN 5008 typography, derived from shared constants */}
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

        .din-text, .din-9pt, .din-8pt, .din-address-main {
          font-family: ${TYPOGRAPHY.FONT_FAMILY};
          line-height: ${TYPOGRAPHY.LINE_HEIGHT};
          color: #000;
        }

        /* Screen: font sizes scale with the paper container (cqw) */
        @media screen {
          .din-text {
            font-size: ${fontSizeCqw(TYPOGRAPHY.MAIN_SIZE_PT)};
          }
          .din-9pt {
            font-size: ${fontSizeCqw(TYPOGRAPHY.SMALL_SIZE_PT)};
          }
          .din-8pt {
            font-size: ${fontSizeCqw(TYPOGRAPHY.FOOTER_SIZE_PT)};
          }
          .din-address-main {
            font-size: ${fontSizeCqw(TYPOGRAPHY.ADDRESS_SIZE_PT)};
          }
        }

        /* Print: fixed physical font sizes */
        @media print {
          .din-text {
            font-size: ${TYPOGRAPHY.MAIN_SIZE_PT}pt;
          }
          .din-9pt {
            font-size: ${TYPOGRAPHY.SMALL_SIZE_PT}pt;
          }
          .din-8pt {
            font-size: ${TYPOGRAPHY.FOOTER_SIZE_PT}pt;
          }
          .din-address-main {
            font-size: ${TYPOGRAPHY.ADDRESS_SIZE_PT}pt;
          }
        }
      `}</style>

      {/* A4 Paper Container - single layout for screen and print */}
      <div
        className="bg-white shadow-xl print:shadow-none print-area w-full relative overflow-hidden"
        style={{
          aspectRatio: '210 / 297',
          containerType: 'inline-size'
        }}
      >
        {/* Fold Marks */}
        {letterData.showFoldMarks && (
          <>
            <div className="absolute" style={{
              top: mmToPercentHeight(MARKS.FOLD_1),
              left: mmToPercent(MARKS.LEFT_OFFSET),
              width: mmToPercent(MARKS.MARK_WIDTH),
              height: '1px',
              backgroundColor: MARKS.COLOR
            }} />
            <div className="absolute" style={{
              top: mmToPercentHeight(MARKS.FOLD_2),
              left: mmToPercent(MARKS.LEFT_OFFSET),
              width: mmToPercent(MARKS.MARK_WIDTH),
              height: '1px',
              backgroundColor: MARKS.COLOR
            }} />
          </>
        )}

        {/* Hole Mark */}
        {letterData.showHoleMark && (
          <div className="absolute" style={{
            top: mmToPercentHeight(MARKS.HOLE),
            left: mmToPercent(MARKS.LEFT_OFFSET),
            width: mmToPercent(MARKS.HOLE_WIDTH),
            height: '1px',
            backgroundColor: MARKS.COLOR
          }} />
        )}

        {/* DIN 5008 Guides Overlay (screen only) */}
        {letterData.showGuides && (
          <div className="print:hidden absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
            {/* Sender block */}
            <div className="absolute border border-dashed border-purple-400 bg-purple-100 opacity-20" style={{
              top: mmToPercentHeight(SENDER_LINE.TOP),
              left: mmToPercent(SENDER_LINE.LEFT),
              width: mmToPercent(SENDER_LINE.WIDTH),
              height: mmToPercentHeight(SENDER_LINE.HEIGHT)
            }} />
            <div className="absolute text-[8px] text-purple-600 font-mono" style={{
              top: mmToPercentHeight(SENDER_LINE.TOP - 2),
              left: mmToPercent(SENDER_LINE.LEFT)
            }}>Absender</div>

            {/* Recipient address window */}
            <div className="absolute border-2 border-dashed border-green-500 bg-green-100 opacity-20" style={{
              top: mmToPercentHeight(ADDRESS_WINDOW.TOP),
              left: mmToPercent(ADDRESS_WINDOW.LEFT),
              width: mmToPercent(ADDRESS_WINDOW.WIDTH),
              height: mmToPercentHeight(ADDRESS_WINDOW.HEIGHT)
            }} />
            <div className="absolute text-[8px] text-green-600 font-mono" style={{
              top: mmToPercentHeight(ADDRESS_WINDOW.TOP - 2),
              left: mmToPercent(ADDRESS_WINDOW.LEFT)
            }}>Anschrift</div>

            {/* Main text field */}
            <div className="absolute border-2 border-dashed border-blue-500 bg-blue-100 opacity-20" style={{
              top: mmToPercentHeight(98.46),
              left: mmToPercent(CONTENT_MARGINS.LEFT),
              right: mmToPercent(CONTENT_MARGINS.RIGHT),
              bottom: mmToPercentHeight(40)
            }} />
            <div className="absolute text-[8px] text-blue-600 font-mono" style={{
              top: mmToPercentHeight(96.46),
              left: mmToPercent(CONTENT_MARGINS.LEFT)
            }}>Textfeld</div>

            {/* Info box area */}
            <div className="absolute border-2 border-dashed border-orange-500 bg-orange-100 opacity-20" style={{
              top: mmToPercentHeight(INFO_BOX.TOP),
              left: mmToPercent(INFO_BOX.LEFT),
              width: mmToPercent(INFO_BOX.WIDTH),
              height: mmToPercentHeight(INFO_BOX.HEIGHT)
            }} />
            <div className="absolute text-[8px] text-orange-600 font-mono" style={{
              top: mmToPercentHeight(INFO_BOX.TOP - 2),
              left: mmToPercent(INFO_BOX.LEFT)
            }}>Info-Block</div>

            {/* Footer area */}
            <div className="absolute border-2 border-dashed border-red-500 bg-red-100 opacity-20" style={{
              bottom: mmToPercentHeight(FOOTER.BOTTOM),
              left: mmToPercent(FOOTER.LEFT),
              right: mmToPercent(FOOTER.RIGHT),
              height: mmToPercentHeight(FOOTER.HEIGHT)
            }} />
            <div className="absolute text-[8px] text-red-600 font-mono" style={{
              bottom: mmToPercentHeight(FOOTER.BOTTOM + FOOTER.HEIGHT - 1),
              left: mmToPercent(FOOTER.LEFT)
            }}>Fußzeile</div>
          </div>
        )}

        {/* Letter Content */}
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
              {/* Sender line - bottom-aligned above the separator */}
              {senderLine && (
                <div className="din-8pt absolute flex items-end" style={{
                  top: mmToPercentHeight(SENDER_LINE.TOP),
                  left: mmToPercent(SENDER_LINE.LEFT),
                  width: mmToPercent(SENDER_LINE.WIDTH),
                  height: mmToPercentHeight(SENDER_LINE.HEIGHT - 1)
                }}>
                  {senderLine}
                </div>
              )}

              {/* Separator line between sender and recipient */}
              <div className="absolute" style={{
                top: mmToPercentHeight(SEPARATOR.TOP),
                left: mmToPercent(SEPARATOR.LEFT),
                width: mmToPercent(SEPARATOR.WIDTH),
                height: '1px',
                backgroundColor: SEPARATOR.COLOR
              }} />

              {/* Info box (phone / e-mail) */}
              {(letterData.senderPhone || letterData.senderEmail) && (
                <div className="din-9pt absolute" style={{
                  top: baselineToTopPercent(INFO_BOX.FIRST_BASELINE, INFO_BOX.FONT_SIZE_PT),
                  left: mmToPercent(INFO_BOX.LEFT),
                  right: mmToPercent(INFO_BOX.RIGHT)
                }}>
                  {letterData.senderPhone && <div>Telefon: {letterData.senderPhone}</div>}
                  {letterData.senderEmail && <div>E-Mail: {letterData.senderEmail}</div>}
                </div>
              )}

              {/* Date - right aligned at the content right edge */}
              {letterData.date && (
                <div className="din-text absolute text-right" style={{
                  top: baselineToTopPercent(DATE.TOP, TYPOGRAPHY.MAIN_SIZE_PT),
                  left: mmToPercent(DATE.LEFT),
                  right: mmToPercent(DATE.RIGHT)
                }}>
                  {letterData.date}
                </div>
              )}

              {/* Recipient address */}
              {letterData.recipientName && (
                <div className="din-address-main absolute" style={{
                  top: baselineToTopPercent(ADDRESS_WINDOW.FIRST_BASELINE, ADDRESS_WINDOW.FONT_SIZE_PT),
                  left: mmToPercent(ADDRESS_WINDOW.LEFT),
                  width: mmToPercent(ADDRESS_WINDOW.WIDTH)
                }}>
                  <div className="font-semibold">{letterData.recipientName}</div>
                  {letterData.recipientAddressSupplement && <div>{letterData.recipientAddressSupplement}</div>}
                  {letterData.recipientStreet && <div>{letterData.recipientStreet}</div>}
                  {letterData.recipientCity && <div>{letterData.recipientCity}</div>}
                </div>
              )}

              {/* Text block: subject, salutation, body, closing, signature.
                  Elements flow in document order with em-based gaps that mirror
                  the PDF's line-height based spacing, so wrapped lines shift
                  subsequent content just like in the PDF. */}
              <div className="din-text absolute" style={{
                top: baselineToTopPercent(SUBJECT.TOP, TYPOGRAPHY.MAIN_SIZE_PT),
                left: mmToPercent(SUBJECT.LEFT),
                right: mmToPercent(SUBJECT.RIGHT)
              }}>
                {letterData.subject && (
                  <div className="font-bold">{letterData.subject}</div>
                )}
                {letterData.salutation && (
                  <div style={{ marginTop: letterData.subject ? blankLinesEm(SPACING.SUBJECT_TO_SALUTATION) : 0 }}>
                    {letterData.salutation}
                  </div>
                )}
                {letterData.body && (
                  <div className="whitespace-pre-wrap" style={{ marginTop: blankLinesEm(SPACING.SALUTATION_TO_BODY) }}>
                    {letterData.body}
                  </div>
                )}
                {letterData.closing && (
                  <div style={{ marginTop: blankLinesEm(SPACING.BODY_TO_CLOSING) }}>
                    {letterData.closing}
                  </div>
                )}
                {letterData.closing && letterData.signatureName && (
                  <div style={{ marginTop: blankLinesEm(SPACING.CLOSING_TO_SIGNATURE) }}>
                    {letterData.signatureName}
                  </div>
                )}
              </div>

              {/* Footer area - bottom-aligned inside the footer box */}
              {(letterData.enableFooter || letterData.enableLegalInfo) && (
                <div className="absolute flex flex-col justify-end" style={{
                  bottom: mmToPercentHeight(FOOTER.BOTTOM),
                  left: mmToPercent(FOOTER.LEFT),
                  right: mmToPercent(FOOTER.RIGHT),
                  maxHeight: mmToPercentHeight(FOOTER.HEIGHT)
                }}>
                  {letterData.enableFooter && letterData.footerText && (
                    <div
                      className="din-8pt whitespace-pre-wrap"
                      style={{
                        textAlign: letterData.footerAlignment,
                        // Percentage margins resolve against the parent width (= content area width)
                        marginBottom: legalInfoText && letterData.enableLegalInfo
                          ? `${(FOOTER.SECTION_GAP / CONTENT_AREA.WIDTH) * 100}%`
                          : 0
                      }}
                    >
                      {letterData.footerText}
                    </div>
                  )}
                  {letterData.enableLegalInfo && legalInfoText && (
                    <div className="din-8pt">
                      {legalInfoText}
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
