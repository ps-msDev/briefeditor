import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function PrivacyDialog({ language }) {
  const content = {
    de: {
      title: 'Datenschutzerklärung',
      sections: [
        {
          title: '1. Verantwortlich',
          text: 'Philipp Schmidt\nE-Mail: pphschmidt-dev@yahoo.com\n\nDiese Website ist ein rein privates, nicht-kommerzielles Projekt ohne Gewinnerzielungsabsicht.'
        },
        {
          title: '2. Allgemeine Hinweise',
          text: 'Diese Website dient ausschließlich zur privaten und nicht-kommerziellen Nutzung.\nEs werden keine personenbezogenen Daten im Sinne der DSGVO aktiv erhoben, gespeichert oder ausgewertet.\nEin Login, Formular oder Newsletter ist nicht vorhanden.'
        },
        {
          title: '3. Hosting',
          text: 'Die Seite wird über Cloudflare Pages gehostet.\nCloudflare verarbeitet technische Daten (z. B. IP-Adressen) zur Bereitstellung und Absicherung des Dienstes.\nDiese Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 f DSGVO (berechtigtes Interesse an einer sicheren und effizienten Bereitstellung des Onlineangebots).',
          link: {
            text: 'Weitere Informationen: Cloudflare Datenschutz',
            url: 'https://www.cloudflare.com/privacypolicy/'
          }
        },
        {
          title: '4. Datenschutz bei Simple Analytics',
          text: 'Zur anonymisierten Erfassung von Seitenaufrufen wird Simple Analytics eingesetzt.\nSimple Analytics speichert keine Cookies, erfasst keine personenbezogenen Daten (wie IP-Adressen oder Browser-Fingerprints)\nund verarbeitet nur anonyme Nutzungsstatistiken (z. B. Seitenaufrufe, Referrer-Domain, Gerätetyp).\nDiese Daten dienen ausschließlich der Verbesserung der Website.',
          link: {
            text: 'Weitere Informationen: Simple Analytics Privacy Policy',
            url: 'https://simpleanalytics.com/privacy-policy'
          },
          extra: 'Rechtsgrundlage: Art. 6 Abs. 1 f DSGVO (berechtigtes Interesse an einer anonymisierten Analyse der Website-Nutzung).'
        },
        {
          title: '5. Rechte der betroffenen Personen',
          text: 'Da keine personenbezogenen Daten verarbeitet oder gespeichert werden, bestehen im Normalfall keine Betroffenenrechte.\nSollten dennoch Fragen zum Datenschutz bestehen, können Sie sich jederzeit per E-Mail an die oben genannte Adresse wenden.'
        },
        {
          title: '6. Änderungen dieser Erklärung',
          text: 'Diese Datenschutzerklärung kann bei technischen oder rechtlichen Änderungen angepasst werden.\nStand: Oktober 2025'
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      sections: [
        {
          title: '1. Responsible Party',
          text: 'Philipp Schmidt\nEmail: pphschmidt-dev@yahoo.com\n\nThis website is a purely private, non-commercial project without profit-making intent.'
        },
        {
          title: '2. General Information',
          text: 'This website is exclusively for private and non-commercial use.\nNo personal data within the meaning of GDPR is actively collected, stored, or evaluated.\nThere is no login, form, or newsletter.'
        },
        {
          title: '3. Hosting',
          text: 'The site is hosted via Cloudflare Pages.\nCloudflare processes technical data (e.g., IP addresses) to provide and secure the service.\nThis processing is based on Art. 6 Para. 1 f GDPR (legitimate interest in secure and efficient provision of the online service).',
          link: {
            text: 'More information: Cloudflare Privacy',
            url: 'https://www.cloudflare.com/privacypolicy/'
          }
        },
        {
          title: '4. Privacy with Simple Analytics',
          text: 'Simple Analytics is used for anonymized collection of page views.\nSimple Analytics does not store cookies, does not collect personal data (such as IP addresses or browser fingerprints),\nand only processes anonymous usage statistics (e.g., page views, referrer domain, device type).\nThis data is used exclusively to improve the website.',
          link: {
            text: 'More information: Simple Analytics Privacy Policy',
            url: 'https://simpleanalytics.com/privacy-policy'
          },
          extra: 'Legal basis: Art. 6 Para. 1 f GDPR (legitimate interest in anonymized analysis of website usage).'
        },
        {
          title: '5. Rights of Data Subjects',
          text: 'Since no personal data is processed or stored, there are normally no data subject rights.\nIf you have any questions about data protection, you can contact us at any time via email at the address provided above.'
        },
        {
          title: '6. Changes to this Declaration',
          text: 'This privacy policy may be updated in case of technical or legal changes.\nLast updated: October 2025'
        }
      ]
    }
  };

  const t = content[language] || content.de;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 text-xs">
          {t.title}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">{t.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm text-slate-700">
          {t.sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-slate-900 mb-2">{section.title}</h3>
              <p className="whitespace-pre-line leading-relaxed">{section.text}</p>
              {section.link && (
                <p className="mt-2">
                  <a href={section.link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {section.link.text}
                  </a>
                </p>
              )}
              {section.extra && (
                <p className="mt-2 whitespace-pre-line leading-relaxed">{section.extra}</p>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}