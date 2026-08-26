import { useState } from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const FEEDBACK_EMAIL = 'pphschmidt-dev@yahoo.com';

export default function FeedbackDialog({ translations: t }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const reset = () => {
    setRating(0);
    setMessage('');
  };

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen) reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;

    const body = [
      `${t.feedbackRatingLabel}: ${rating}/5`,
      '',
      message.trim() || '—'
    ].join('\n');

    const mailto = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(t.feedbackEmailSubject)}&body=${encodeURIComponent(body)}`;

    if (window.sa_event) {
      window.sa_event('feedback_submit');
    }

    window.location.href = mailto;
    setOpen(false);
    reset();
    toast({
      title: t.feedbackThanksTitle,
      description: t.feedbackThanksDescription
    });
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-700">{t.feedbackRatingLabel}</Label>
            <div className="flex gap-2" role="group" aria-label={t.feedbackRatingLabel}>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  aria-pressed={rating === value}
                  className={cn(
                    'h-10 w-10 rounded-full border text-sm font-medium transition-all',
                    rating === value
                      ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
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
              className="resize-none text-sm"
            />
          </div>
          <p className="text-xs text-slate-400">{t.feedbackMailtoHint}</p>
          <Button
            type="submit"
            disabled={!rating}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
          >
            {t.feedbackSubmit}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
