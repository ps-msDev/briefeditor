# A4 Canvas Implementation - DIN 5008-B Stable Positioning

## Overview

This implementation provides a stable A4 canvas system that maintains exact DIN-5008-B positioning regardless of browser zoom, device pixel ratio, or viewport size. The system uses a fixed coordinate system with millimeter-accurate positioning.

## Architecture

### 1. A4Canvas Component (`src/components/letter/A4Canvas.jsx`)

The core component that provides:
- **Fixed coordinate system**: 210mm × 297mm A4 dimensions
- **Scale-wrapper pattern**: Canvas is scaled down for screen preview using CSS `transform: scale()`
- **Print optimization**: 1:1 rendering with `@page { size: A4; margin: 0; }`
- **Zoom stability**: All positions computed from canvas coordinate system, never viewport units

### 2. DIN 5008-B Constants (`src/lib/din5008B.js`)

Centralized constants for all measurements:
- **PX_PER_MM**: 3.7795275591 (96 DPI conversion factor)
- **Position constants**: All DIN-5008-B positions in millimeters
- **Utility functions**: `mmToPx()`, `getA4CanvasCSS()`, scaling helpers

### 3. LetterPreview Component (`src/components/letter/LetterPreview.jsx`)

Refactored to use:
- **A4Canvas wrapper**: All content positioned within the stable canvas
- **mm-based positioning**: All elements use `mmToPx()` for exact positioning
- **Absolute positioning**: Elements positioned relative to canvas, not viewport

## Key Features

### Millimeter-Accurate Positioning

All letter elements use exact millimeter measurements converted to pixels:

```javascript
// Example: Sender line positioning
style={{
  position: 'absolute',
  top: mmToPx(SENDER_LINE.TOP),      // 45mm
  left: mmToPx(SENDER_LINE.LEFT),    // 25mm
  width: mmToPx(SENDER_LINE.WIDTH),  // 85mm
  height: mmToPx(SENDER_LINE.HEIGHT) // 17.7mm
}}
```

### Scale Strategy

**Screen Preview:**
- Canvas: Fixed 210mm × 297mm (793.7px × 1122.5px at 96 DPI)
- Wrapper: Scales canvas to fit viewport using `transform: scale()`
- Origin: `transform-origin: top left` prevents layout reflow

**Print:**
- Canvas: 1:1 rendering at exact A4 size
- No scaling applied during print
- `@page { size: A4; margin: 0; }` ensures correct page size

### Zoom Stability

The system prevents vertical drift by:
1. **Fixed coordinate system**: All positions computed from canvas dimensions
2. **No viewport units**: Avoids `vh`, `vw`, `%` for positioned elements
3. **Fixed font sizes**: Uses `pt` units instead of `rem`/`em`
4. **Layout containment**: `contain: layout style paint` prevents reflow

### Mobile Behavior

- **No reflow**: Letter content never reflows on mobile
- **Scaled preview**: Canvas is scaled down to fit small screens
- **Pan and zoom**: Users can pan/zoom the scaled canvas
- **Responsive scaling**: Different scale factors for mobile/tablet/desktop

## DIN 5008-B Positioning

### Content Areas

- **Page margins**: Left 25mm, Right 20mm, Top 45mm, Bottom 25mm
- **Content area**: 165mm × 227mm (210-25-20 × 297-45-25)

### Letter Elements

- **Sender line**: Top 45mm, max width 85mm, max 2 lines
- **Address window**: Top 50mm, left 25mm, width 85mm, height 40mm
- **Info box**: Top 50-90mm, left 125mm, right 10mm
- **Date**: Right-aligned at top 90mm
- **Subject**: Top 125mm, bold
- **Salutation**: Top 143mm
- **Body**: Starts at top 156mm
- **Closing**: Bottom 45mm with 15mm signature space

### Fold and Hole Marks

- **Fold mark 1**: 87mm from top
- **Fold mark 2**: 192mm from top
- **Hole mark**: 148.5mm from top
- **Mark thickness**: 0.2mm
- **Mark width**: 5mm (fold), 8mm (hole)

## CSS Custom Properties

The system uses CSS custom properties for consistent mm-to-px conversion:

```css
:root {
  --px-per-mm: 3.7795275591;
  --a4-width-mm: 210;
  --a4-height-mm: 297;
  --a4-width-px: 793.7;
  --a4-height-px: 1122.5;
}
```

## Testing

### Zoom Stability Test

Test at browser zoom levels: 80%, 100%, 125%, 150%
- Elements must maintain exact positions
- No vertical drift should occur
- Fold/hole marks must remain visible

### Mobile Test

Test on mobile devices or browser dev tools:
- Letter should scale down, not reflow
- Pan/zoom should work smoothly
- No responsive layout changes

### Print Test

Test print preview and PDF export:
- Positions must match DIN 5008-B specifications
- Fold/hole marks must be visible
- No scaling artifacts

## Usage

### Adding New Elements

To add new letter elements with exact positioning:

```javascript
// 1. Define position in din5008B.js
export const NEW_ELEMENT = {
  TOP: 200,
  LEFT: 25,
  WIDTH: 165,
  HEIGHT: 20
};

// 2. Use in component
<div 
  style={{
    position: 'absolute',
    top: mmToPx(NEW_ELEMENT.TOP),
    left: mmToPx(NEW_ELEMENT.LEFT),
    width: mmToPx(NEW_ELEMENT.WIDTH),
    height: mmToPx(NEW_ELEMENT.HEIGHT)
  }}
>
  Content
</div>
```

### Modifying Positions

All positions are centralized in `din5008B.js`. To modify:
1. Update the constant in `din5008B.js`
2. The change automatically applies to all components using that constant

## Browser Compatibility

- **Modern browsers**: Full support with CSS custom properties
- **Print**: Works with all browsers that support `@page` rules
- **Mobile**: Responsive scaling works on all mobile browsers
- **Zoom**: Stable positioning works at all zoom levels

## Performance

- **Layout containment**: Prevents unnecessary reflows
- **Hardware acceleration**: Uses `transform` for scaling
- **Minimal repaints**: Fixed positioning reduces layout calculations
- **Efficient scaling**: CSS transforms are GPU-accelerated

## Troubleshooting

### Elements Drifting

- Check that all positions use `mmToPx()` function
- Ensure no viewport units (`vh`, `vw`, `%`) in positioned elements
- Verify parent containers don't have dynamic padding/margins

### Print Issues

- Ensure `@page` rules are properly applied
- Check that print styles override screen styles
- Verify fold/hole marks have `print:block` class

### Mobile Problems

- Check responsive scaling logic in `A4Canvas`
- Ensure no responsive breakpoints affect letter content
- Verify pan/zoom works correctly

## Future Enhancements

- **Dynamic scaling**: Automatic scale adjustment based on content
- **Print optimization**: Better print-specific styling
- **Accessibility**: Screen reader support for letter structure
- **Performance**: Virtual scrolling for very long letters
