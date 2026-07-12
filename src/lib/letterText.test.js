import { describe, it, expect } from 'vitest';
import { getSenderLine, getLegalInfoText, hasLegalInfoContent } from './letterText';

describe('getSenderLine', () => {
  it('joins name, street and city with pipes', () => {
    expect(
      getSenderLine({
        senderName: 'Max Mustermann',
        senderStreet: 'Musterstraße 123',
        senderCity: '12345 Musterstadt'
      })
    ).toBe('Max Mustermann | Musterstraße 123 | 12345 Musterstadt');
  });

  it('skips empty fields without leaving stray separators', () => {
    expect(getSenderLine({ senderName: 'Max', senderStreet: '', senderCity: 'Berlin' })).toBe(
      'Max | Berlin'
    );
    expect(getSenderLine({})).toBe('');
  });
});

describe('getLegalInfoText', () => {
  it('builds a comma-separated line with the expected labels', () => {
    const text = getLegalInfoText({
      companyName: 'Beispiel GmbH',
      registeredOffice: 'Berlin',
      companyPhone: '030 123',
      vatId: 'DE123456789'
    });
    expect(text).toBe('Beispiel GmbH, Sitz: Berlin, Tel: 030 123, USt-IdNr.: DE123456789');
  });

  it('only includes the registration court together with the HRB number', () => {
    expect(getLegalInfoText({ registrationCourt: 'Berlin' })).toBe('');
    expect(getLegalInfoText({ hrbNumber: 'HRB 1234' })).toBe('');
    expect(getLegalInfoText({ registrationCourt: 'Berlin', hrbNumber: 'HRB 1234' })).toBe(
      'Eingetragen beim Amtsgericht Berlin, HRB 1234'
    );
  });

  it('returns an empty string for empty data', () => {
    expect(getLegalInfoText({})).toBe('');
  });
});

describe('hasLegalInfoContent', () => {
  it('is false for empty data and true once any field is filled', () => {
    expect(hasLegalInfoContent({})).toBe(false);
    expect(hasLegalInfoContent({ companyName: 'Beispiel GmbH' })).toBe(true);
    expect(hasLegalInfoContent({ hrbNumber: 'HRB 1234' })).toBe(true);
  });
});
