import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function ImpressumDialog({ language }) {
  const content = {
    de: {
      title: 'Impressum',
      projectNote: 'Dies ist ein privates Projekt – entstanden aus der Frage, warum man für einen einfachen Brief immer erst Word öffnen und endlos basteln muss.',
      sections: [
        {
          title: 'Angaben gemäß § 5 TMG',
          text: 'Dies ist ein rein privates, nicht-kommerzielles Webprojekt ohne Gewinnerzielungsabsicht.\nDie Inhalte dienen ausschließlich zur privaten Nutzung und Demonstration.'
        },
        {
          title: 'Verantwortlich für den Inhalt:',
          text: 'Philipp Schmidt\nE-Mail: pphschmidt-dev@yahoo.com'
        },
        {
          title: 'Hinweis:',
          text: 'Da dieses Projekt ausschließlich privat betrieben wird, besteht keine Impressumspflicht im Sinne des § 5 TMG.\nDie Angabe der E-Mail-Adresse erfolgt freiwillig für eventuelle Rückfragen.'
        }
      ]
    },
    en: {
      title: 'Legal Notice',
      projectNote: 'This is a private project – born from the question of why you always have to open Word and endlessly tinker around just to write a simple letter.',
      sections: [
        {
          title: 'Information according to § 5 TMG',
          text: 'This is a purely private, non-commercial web project without profit-making intent.\nThe content is exclusively for private use and demonstration purposes.'
        },
        {
          title: 'Responsible for content:',
          text: 'Philipp Schmidt\nEmail: pphschmidt-dev@yahoo.com'
        },
        {
          title: 'Note:',
          text: 'Since this project is operated exclusively privately, there is no legal obligation for a legal notice according to § 5 TMG.\nThe email address is provided voluntarily for any inquiries.'
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
            </div>
          ))}
        </div>

        {/* Animated Project Note at the end */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mt-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-cyan-100/20 animate-slide"></div>
          <p className="text-sm text-slate-700 leading-relaxed relative z-10 animate-fade-in">
            {t.projectNote}
          </p>
        </div>

        <style>{`
          @keyframes slide {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide {
            animation: slide 3s ease-in-out infinite;
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-out;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}