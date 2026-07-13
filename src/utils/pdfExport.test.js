import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { buildLetterPdf } from './pdfExport';
import { A4_WIDTH_PT, A4_HEIGHT_PT } from '../lib/din5008B';

const sampleLetter = {
  senderName: 'Max Mustermann',
  senderStreet: 'Musterstraße 123',
  senderCity: '12345 Musterstadt',
  senderPhone: '+49 123 456789',
  senderEmail: 'max@example.com',
  recipientName: 'Beispiel GmbH',
  recipientAddressSupplement: 'Hinter dem Tor',
  recipientStreet: 'Beispielstraße 456',
  recipientCity: '54321 Beispielstadt',
  date: '12.07.2026',
  subject: 'Betreff: Testbrief',
  salutation: 'Sehr geehrte Damen und Herren,',
  body: 'vielen Dank für Ihr Interesse.\n\nZweiter Absatz mit Umlauten: äöüß und €-Zeichen.',
  closing: 'Mit freundlichen Grüßen',
  signatureName: 'Max Mustermann',
  showFoldMarks: true,
  showHoleMark: true
};

describe('buildLetterPdf', () => {
  it('produces a valid single-page A4 PDF for a full letter', async () => {
    const bytes = await buildLetterPdf(sampleLetter);

    expect(bytes).toBeInstanceOf(Uint8Array);
    // PDF magic bytes: %PDF
    expect(String.fromCharCode(...bytes.slice(0, 4))).toBe('%PDF');

    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
    const { width, height } = doc.getPage(0).getSize();
    expect(width).toBeCloseTo(A4_WIDTH_PT, 1);
    expect(height).toBeCloseTo(A4_HEIGHT_PT, 1);
  });

  it('handles completely empty letter data', async () => {
    const bytes = await buildLetterPdf({});
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
  });

  it('renders German special characters (WinAnsi) without throwing', async () => {
    const bytes = await buildLetterPdf({
      ...sampleLetter,
      body: 'Umlaute: ÄÖÜ äöü ß – Sonderzeichen: € § „Anführung“'
    });
    expect(bytes.length).toBeGreaterThan(0);
  });

  it('rejects characters outside WinAnsi encoding (e.g. emoji)', async () => {
    await expect(buildLetterPdf({ ...sampleLetter, body: 'Emoji 😀' })).rejects.toThrow();
  });

  it('truncates very long body text instead of overflowing the page', async () => {
    const longBody = Array.from({ length: 200 }, (_, i) => `Zeile ${i + 1} mit etwas Text.`).join(
      '\n'
    );
    const bytes = await buildLetterPdf({ ...sampleLetter, body: longBody });
    const doc = await PDFDocument.load(bytes);
    // The export intentionally clips at BODY.MAX_BOTTOM and never adds pages
    expect(doc.getPageCount()).toBe(1);
  });

  it('renders the footer box when enabled', async () => {
    const bytes = await buildLetterPdf({
      ...sampleLetter,
      enableFooter: true,
      footerText: 'Fußzeilentext',
      enableLegalInfo: true,
      companyName: 'Beispiel GmbH',
      vatId: 'DE123456789'
    });
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBe(1);
  });
});
