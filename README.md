# BriefEditor

A minimalist web application for creating DIN 5008 compliant business letters. No Word, no formatting headaches – just clean, professional correspondence.

[![Version](https://img.shields.io/github/package-json/v/ps-msDev/briefeditor)](https://github.com/ps-msDev/briefeditor)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/demo-live-orange.svg)](https://www.briefeditor.eu/)

## Overview

BriefEditor solves a simple problem: writing professional letters shouldn't require complex software. Enter your content, see the formatted result instantly, export as PDF.

**Live Demo:** [briefeditor.eu](https://www.briefeditor.eu/)

## Features

- DIN 5008 compliant formatting
- Real-time preview
- PDF export, client/browser side pdf generation
- Mobile responsive
- No data collection
- German/English support

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- PDF-lib
- Radix UI components

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
```

Run the unit tests (Vitest) and linter:

```bash
npm test
npm run lint
```

The DIN 5008-B layout values used by both the HTML preview and the PDF
export live in `src/lib/din5008B.js` (single source of truth).

## License

MIT

---

*This is a private, non-commercial project. Born from the frustration of opening Word just to write a simple letter.*