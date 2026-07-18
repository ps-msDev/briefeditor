import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function TermsDialog({ language }) {
  const content = {
    de: {
      title: 'Nutzungsbedingungen',
      text: 'Diese Website und der zugrunde liegende Code stehen unter der',
      linkText: 'MIT-Lizenz',
      linkUrl: 'https://opensource.org/license/MIT'
    },
    en: {
      title: 'Terms of Use',
      text: 'This website and the underlying code are licensed under the',
      linkText: 'MIT License',
      linkUrl: 'https://opensource.org/license/MIT'
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">{t.title}</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-slate-700">
          <p>
            {t.text}{' '}
            <a href={t.linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {t.linkText}
            </a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}