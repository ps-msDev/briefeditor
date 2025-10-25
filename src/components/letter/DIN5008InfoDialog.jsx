
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, CheckCircle2, ExternalLink } from 'lucide-react';

export default function DIN5008InfoDialog({ language }) {
  const content = {
    de: {
      title: 'Was ist DIN 5008?',
      intro: 'Die DIN 5008 ist die deutsche Norm für Schreib- und Gestaltungsregeln für die Text- und Informationsverarbeitung. Sie legt fest, wie Geschäftsbriefe, E-Mails und andere Dokumente professionell gestaltet werden sollten.',
      elementsTitle: 'Wichtige Elemente eines DIN 5008 Briefes',
      elements: [
        {
          title: 'Absenderangabe',
          desc: 'Kompakte Absenderzeile oberhalb der Empfängeradresse (45-62,7mm von oben)'
        },
        {
          title: 'Empfängeradresse',
          desc: 'Anschriftfeld für Fensterumschläge (62,7-90mm von oben, 25mm von links)'
        },
        {
          title: 'Informationsblock',
          desc: 'Rechts oben für Telefon, E-Mail und Datum'
        },
        {
          title: 'Betreffzeile',
          desc: 'Fettgedruckt bei 125mm von oben, beschreibt den Briefinhalt'
        },
        {
          title: 'Anrede',
          desc: 'Nach zwei Leerzeilen unter dem Betreff (143mm von oben)'
        },
        {
          title: 'Brieftext',
          desc: 'Beginnt nach einer Leerzeile unter der Anrede, Blocksatz empfohlen'
        },
        {
          title: 'Grußformel und Unterschrift',
          desc: 'Nach einer Leerzeile, gefolgt von 3-4 Zeilen Platz für die handschriftliche Unterschrift'
        }
      ],
      foldsTitle: 'Falzmarken und Lochmarke',
      folds: [
        { label: 'Erste Falzmarke (105mm):', text: 'Für die untere Faltung bei C6/5 oder DL-Umschlägen' },
        { label: 'Zweite Falzmarke (210mm):', text: 'Für die obere Faltung' },
        { label: 'Lochmarke (148,5mm):', text: 'Zur korrekten Ablage in Ordnern' }
      ],
      envelopesTitle: 'Fensterumschläge',
      envelopesText: 'DIN 5008 Briefe sind perfekt für Standard-Fensterumschläge (DIN lang/C6/5) geeignet. Das Adressfeld ist so positioniert, dass es bei korrekter Faltung genau im Sichtfenster erscheint.',
      tipTitle: '💡 Tipp',
      tipText: 'Verwenden Sie die Hilfslinien-Funktion während der Bearbeitung, um die exakten DIN 5008 Bereiche zu sehen. Vor dem Drucken können Sie diese wieder ausblenden.',
      linksTitle: 'Weitere Informationen',
      links: [
        { text: 'DIN 5008 Wikipedia', url: 'https://de.wikipedia.org/wiki/DIN_5008' },
        { text: 'DIN 5008 Offizielle Seite', url: 'https://www.din.de/de/mitwirken/normenausschuesse/nia/veroeffentlichungen/wdc-beuth:din21:318422674' }
      ]
    },
    en: {
      title: 'What is DIN 5008?',
      intro: 'DIN 5008 is the German standard for writing and formatting rules for text and information processing. It defines how business letters, emails, and other documents should be professionally designed.',
      elementsTitle: 'Key Elements of a DIN 5008 Letter',
      elements: [
        {
          title: 'Sender Information',
          desc: 'Compact sender line above the recipient address (45-62.7mm from top)'
        },
        {
          title: 'Recipient Address',
          desc: 'Address field for window envelopes (62.7-90mm from top, 25mm from left)'
        },
        {
          title: 'Information Block',
          desc: 'Top right for phone, email, and date'
        },
        {
          title: 'Subject Line',
          desc: 'Bold at 125mm from top, describes the letter content'
        },
        {
          title: 'Salutation',
          desc: 'After two blank lines below the subject (143mm from top)'
        },
        {
          title: 'Body Text',
          desc: 'Starts after one blank line below salutation, justified text recommended'
        },
        {
          title: 'Closing and Signature',
          desc: 'After one blank line, followed by 3-4 lines of space for handwritten signature'
        }
      ],
      foldsTitle: 'Fold Marks and Hole Mark',
      folds: [
        { label: 'First fold mark (105mm):', text: 'For the lower fold for C6/5 or DL envelopes' },
        { label: 'Second fold mark (210mm):', text: 'For the upper fold' },
        { label: 'Hole mark (148.5mm):', text: 'For correct filing in folders' }
      ],
      envelopesTitle: 'Window Envelopes',
      envelopesText: 'DIN 5008 letters are perfectly suited for standard window envelopes (DIN long/C6/5). The address field is positioned so that it appears exactly in the viewing window when folded correctly.',
      tipTitle: '💡 Tip',
      tipText: 'Use the guideline function during editing to see the exact DIN 5008 areas. You can hide them again before printing.',
      linksTitle: 'Further Information',
      links: [
        { text: 'DIN 5008 Wikipedia', url: 'https://en.wikipedia.org/wiki/DIN_5008' },
        { text: 'DIN 5008 Official Page', url: 'https://www.din.de/en/getting-involved/standards-committees/nia/publications/wdc-beuth:din21:318422674' }
      ]
    }
  };

  const t = content[language] || content.de;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 text-xs sm:text-sm px-2 sm:px-3">
          <Info className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
          <span className="hidden sm:inline">DIN 5008 Info</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">{t.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-sm text-slate-700">
          <div>
            <p className="leading-relaxed">{t.intro}</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">{t.elementsTitle}</h3>
            <div className="space-y-3">
              {t.elements.map((element, index) => (
                <div key={index} className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">{element.title}</p>
                    <p className="text-xs text-slate-600">{element.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">{t.foldsTitle}</h3>
            <div className="space-y-2 text-xs">
              {t.folds.map((fold, index) => (
                <p key={index}>
                  <span className="font-medium">{fold.label}</span> {fold.text}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">{t.envelopesTitle}</h3>
            <p className="text-xs leading-relaxed">{t.envelopesText}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">{t.tipTitle}</h3>
            <p className="text-xs text-blue-800 leading-relaxed">{t.tipText}</p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">{t.linksTitle}</h3>
            <div className="flex flex-col gap-2">
              {t.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  {link.text}
                </a>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
