import { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const FEEDBACK_EMAIL = 'pphschmidt-dev@yahoo.com';
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${FEEDBACK_EMAIL}`;

const MOODS = [
  { value: 1, emoji: '😠', key: 'feedbackMood1' },
  { value: 2, emoji: '😕', key: 'feedbackMood2' },
  { value: 3, emoji: '😐', key: 'feedbackMood3' },
  { value: 4, emoji: '🙂', key: 'feedbackMood4' },
  { value: 5, emoji: '🤩', key: 'feedbackMood5' }
];

function MoodPicker({ label, value, onChange, disabled, translations: t, name }) {
  const selected = MOODS.find((mood) => mood.value === value);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-slate-700">{label}</Label>
        <span className="text-xs text-slate-400 min-h-[1rem] transition-opacity">
          {selected ? t[selected.key] : t.feedbackMoodHint}
        </span>
      </div>
      <div className="flex justify-between gap-1" role="group" aria-label={label}>
        {MOODS.map((mood) => {
          const isSelected = value === mood.value;
          return (
            <button
              key={mood.value}
              type="button"
              onClick={() => onChange(mood.value)}
              aria-pressed={isSelected}
              aria-label={`${mood.value}/5 - ${t[mood.key]}`}
              disabled={disabled}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-2xl text-2xl transition-all duration-200',
                'hover:scale-110 sm:hover:scale-125 sm:hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                isSelected
                  ? 'scale-110 sm:scale-125 sm:-translate-y-1 bg-blue-50 shadow-sm ring-2 ring-blue-500/30'
                  : 'opacity-55 hover:opacity-100 grayscale-[30%] hover:grayscale-0'
              )}
            >
              <span className={cn(isSelected && 'animate-[bounce_0.45s_ease]')}>{mood.emoji}</span>
            </button>
          );
        })}
      </div>
      <input type="hidden" name={name} value={value || ''} readOnly />
    </div>
  );
}

export default function FeedbackDialog({ translations: t }) {
  const [open, setOpen] = useState(false);
  const [overall, setOverall] = useState(0);
  const [design, setDesign] = useState(0);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const canSubmit = overall > 0 && design > 0;

  const reset = () => {
    setOverall(0);
    setDesign(0);
    setMessage('');
  };

  const handleOpenChange = (nextOpen) => {
    if (sending) return;
    setOpen(nextOpen);
    if (!nextOpen) reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || sending) return;

    setSending(true);
    try {
      const response = await fetch(FORMSUBMIT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          _subject: t.feedbackEmailSubject,
          overall: `${overall}/5`,
          design: `${design}/5`,
          message: message.trim() || '-',
          source: 'briefeditor',
          _captcha: false,
          _template: 'table'
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === 'false' || data.success === false) {
        throw new Error(data.message || 'submit_failed');
      }

      if (window.sa_event) {
        window.sa_event('feedback_submit');
      }

      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      setOpen(false);
      reset();
      toast({
        title: t.feedbackThanksTitle,
        description: t.feedbackThanksDescription,
        duration: 10000
      });
    } catch {
      toast({
        variant: 'destructive',
        title: t.feedbackErrorTitle,
        description: t.feedbackErrorDescription
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm hover:bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all gap-2"
        >
          <MessageSquarePlus className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">{t.feedbackButton}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">{t.feedbackTitle}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-600 -mt-1">{t.feedbackSubtitle}</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <MoodPicker
            label={t.feedbackOverallLabel}
            value={overall}
            onChange={setOverall}
            disabled={sending}
            translations={t}
            name="overall"
          />
          <MoodPicker
            label={t.feedbackDesignLabel}
            value={design}
            onChange={setDesign}
            disabled={sending}
            translations={t}
            name="design"
          />
          <div className="space-y-2">
            <Label htmlFor="feedback-message" className="text-slate-700">
              {t.feedbackMessageLabel}
            </Label>
            <Textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.feedbackMessagePlaceholder}
              rows={3}
              maxLength={500}
              disabled={sending}
              className="resize-none text-base"
            />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.feedbackServiceHintBefore}
            <a
              href="https://formsubmit.co/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-slate-600"
            >
              {t.feedbackServiceName}
            </a>
            {t.feedbackServiceHintAfter}
          </p>
          <Button
            type="submit"
            disabled={!canSubmit || sending}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            {sending ? t.feedbackSending : t.feedbackSubmit}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
