import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ currentLanguage, onLanguageChange }) {
  const languages = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="lg:fixed lg:bottom-6 lg:right-6 print:hidden lg:z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            size="sm"
            className="w-full lg:w-auto bg-white/90 backdrop-blur-sm hover:bg-white border border-slate-200 shadow-md hover:shadow-lg transition-all gap-2"
          >
            <Globe className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">{currentLang.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[140px]">
          {languages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => onLanguageChange(lang.code)}
              className={`cursor-pointer text-sm ${currentLanguage === lang.code ? 'bg-slate-50 font-medium' : ''}`}
            >
              <span>{lang.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}