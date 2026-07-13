/**
 * Shared text-building helpers used by both the HTML preview and the
 * PDF export, so the rendered content is guaranteed to be identical.
 */

/**
 * Compact one-line sender ("Name | Street | City") shown above the
 * recipient address window.
 * @param {Object} letterData
 * @returns {string}
 */
export function getSenderLine(letterData) {
  return [letterData.senderName, letterData.senderStreet, letterData.senderCity]
    .filter(Boolean)
    .join(' | ');
}

/**
 * Combined legal information line for the footer area.
 * @param {Object} letterData
 * @returns {string}
 */
export function getLegalInfoText(letterData) {
  return [
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
  ].filter(Boolean).join(', ');
}

/**
 * Whether any legal info field is filled (drives footer rendering).
 * @param {Object} letterData
 * @returns {boolean}
 */
export function hasLegalInfoContent(letterData) {
  return Boolean(
    letterData.companyName || letterData.registeredOffice || letterData.companyPhone ||
    letterData.companyFax || letterData.companyEmail || letterData.companyWebsite ||
    letterData.bankDetails || letterData.vatId || letterData.managingDirectors ||
    letterData.supervisoryBoard || letterData.registrationCourt || letterData.hrbNumber
  );
}
