import { describe, it, expect } from 'vitest';
import {
  PT_PER_MM,
  MM_PER_PT,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  A4_WIDTH_PT,
  A4_HEIGHT_PT,
  CONTENT_MARGINS,
  CONTENT_AREA,
  SENDER_LINE,
  ADDRESS_WINDOW,
  SEPARATOR,
  DATE,
  SUBJECT,
  BODY,
  FOOTER,
  MARKS,
  TYPOGRAPHY,
  LINE_HEIGHT_MM,
  SPACING,
  baselineOffsetMm,
  mmToPercent,
  mmToPercentHeight,
  baselineToTopPercent,
  blankLinesEm
} from './din5008B';

describe('unit conversions', () => {
  it('PT_PER_MM and MM_PER_PT are inverses', () => {
    expect(PT_PER_MM * MM_PER_PT).toBeCloseTo(1, 10);
  });

  it('A4 dimensions in points match the PDF standard', () => {
    expect(A4_WIDTH_PT).toBeCloseTo(595.28, 2);
    expect(A4_HEIGHT_PT).toBeCloseTo(841.89, 2);
  });
});

describe('DIN 5008-B layout constants', () => {
  it('content area is derived consistently from the margins', () => {
    expect(CONTENT_AREA.WIDTH).toBe(A4_WIDTH_MM - CONTENT_MARGINS.LEFT - CONTENT_MARGINS.RIGHT);
    expect(CONTENT_AREA.RIGHT).toBe(A4_WIDTH_MM - CONTENT_MARGINS.RIGHT);
    expect(CONTENT_AREA.WIDTH).toBe(165);
  });

  it('address window follows the sender line block (Form B window envelope)', () => {
    expect(SENDER_LINE.TOP).toBe(45);
    expect(ADDRESS_WINDOW.TOP).toBeCloseTo(SENDER_LINE.TOP + SENDER_LINE.HEIGHT, 5);
    expect(ADDRESS_WINDOW.TOP + ADDRESS_WINDOW.HEIGHT).toBeCloseTo(90, 5);
    expect(SEPARATOR.TOP).toBe(ADDRESS_WINDOW.TOP);
  });

  it('date and subject sit at their DIN 5008-B baselines', () => {
    expect(DATE.TOP).toBe(90);
    expect(SUBJECT.TOP).toBe(125);
  });

  it('body text must end above the footer box', () => {
    expect(BODY.MAX_BOTTOM).toBeLessThanOrEqual(FOOTER.BOX_TOP);
  });

  it('fold and hole marks match DIN 5008 Form B', () => {
    expect(MARKS.FOLD_1).toBe(105);
    expect(MARKS.FOLD_2).toBe(210);
    expect(MARKS.HOLE).toBeCloseTo(A4_HEIGHT_MM / 2, 5);
  });

  it('line height derives from main font size and line-height factor', () => {
    expect(LINE_HEIGHT_MM).toBeCloseTo(
      TYPOGRAPHY.MAIN_SIZE_PT * TYPOGRAPHY.LINE_HEIGHT * MM_PER_PT,
      10
    );
    expect(LINE_HEIGHT_MM).toBeCloseTo(4.46, 2);
  });

  it('section spacing factors are positive', () => {
    for (const factor of Object.values(SPACING)) {
      expect(factor).toBeGreaterThan(0);
    }
  });
});

describe('CSS helper functions', () => {
  it('mmToPercent converts relative to the A4 width', () => {
    expect(mmToPercent(A4_WIDTH_MM)).toBe('100%');
    expect(mmToPercent(105)).toBe('50%');
  });

  it('mmToPercentHeight converts relative to the A4 height', () => {
    expect(mmToPercentHeight(A4_HEIGHT_MM)).toBe('100%');
    expect(mmToPercentHeight(148.5)).toBe('50%');
  });

  it('baselineOffsetMm scales linearly with font size', () => {
    expect(baselineOffsetMm(22)).toBeCloseTo(2 * baselineOffsetMm(11), 10);
    // 11pt at ratio 0.92 -> about 3.57mm ascent offset
    expect(baselineOffsetMm(11)).toBeCloseTo(3.57, 2);
  });

  it('baselineToTopPercent subtracts the ascent from the baseline', () => {
    const topPercent = parseFloat(baselineToTopPercent(90, 11));
    const rawPercent = parseFloat(mmToPercentHeight(90));
    expect(topPercent).toBeLessThan(rawPercent);
    expect(topPercent).toBeCloseTo(((90 - baselineOffsetMm(11)) / A4_HEIGHT_MM) * 100, 6);
  });

  it('blankLinesEm produces em margins matching the line-height factor', () => {
    expect(blankLinesEm(1)).toBe('1.1500em');
    expect(blankLinesEm(3)).toBe('3.4500em');
  });
});
