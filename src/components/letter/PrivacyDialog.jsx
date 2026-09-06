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
          text: 'Diese Website dient ausschließlich zur privaten und nicht-kommerziellen Nutzung.\nBriefe werden ausschließlich lokal in Ihrem Browser erstellt; der Briefinhalt wird nicht auf einem eigenen Server gespeichert.\nEs gibt kein Login und keinen Newsletter.\nOptional können Sie über das Feedback-Formular eine Bewertung und einen kurzen Text senden (siehe Abschnitt 5).'
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
          title: '5. Optionales Feedback (FormSubmit)',
          text: 'Über den Feedback-Button können Sie freiwillig Bewertungen (Gesamteindruck und Design, jeweils 1–5) und optional einen kurzen Freitext senden.\nDie Übermittlung erfolgt über den Dienst FormSubmit (formsubmit.co). FormSubmit leitet die Angaben per E-Mail an die oben genannte Kontaktadresse weiter und kann dabei technische Daten (z. B. IP-Adresse) zur Spam-Abwehr verarbeiten.\nEs werden keine Cookies von FormSubmit auf dieser Website gesetzt.\nDie Nutzung des Feedback-Formulars ist freiwillig. Rechtsgrundlage: Art. 6 Abs. 1 a DSGVO (Einwilligung durch absichtliches Absenden).',
          link: {
            text: 'Weitere Informationen: FormSubmit',
            url: 'https://formsubmit.co/'
          }
        },
        {
          title: '6. Rechte der betroffenen Personen',
          text: 'Soweit personenbezogene Daten verarbeitet werden (insbesondere bei Feedback), stehen Ihnen die Rechte aus der DSGVO zu (u. a. Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch).\nFür Fragen zum Datenschutz können Sie sich jederzeit per E-Mail an die oben genannte Adresse wenden.'
        },
        {
          title: '7. Änderungen dieser Erklärung',
          text: 'Diese Datenschutzerklärung kann bei technischen oder rechtlichen Änderungen angepasst werden.\nStand: August 2026'
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
          text: 'This website is exclusively for private and non-commercial use.\nLetters are created only locally in your browser; letter content is not stored on our own server.\nThere is no login and no newsletter.\nOptionally, you can send a rating and a short message via the feedback form (see section 5).'
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
          title: '5. Optional Feedback (FormSubmit)',
          text: 'Via the feedback button you can voluntarily send ratings (overall and design, each 1–5) and optionally a short free-text message.\nDelivery uses the FormSubmit service (formsubmit.co). FormSubmit forwards the information by email to the contact address above and may process technical data (e.g. IP address) for spam protection.\nFormSubmit does not set cookies on this website.\nUsing the feedback form is voluntary. Legal basis: Art. 6 Para. 1 a GDPR (consent by intentionally submitting).',
          link: {
            text: 'More information: FormSubmit',
            url: 'https://formsubmit.co/'
          }
        },
        {
          title: '6. Rights of Data Subjects',
          text: 'Where personal data is processed (especially with feedback), you have the rights under the GDPR (including access, rectification, erasure, restriction, objection).\nIf you have questions about data protection, you can contact us at any time via email at the address provided above.'
        },
        {
          title: '7. Changes to this Declaration',
          text: 'This privacy policy may be updated in case of technical or legal changes.\nLast updated: August 2026'
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
