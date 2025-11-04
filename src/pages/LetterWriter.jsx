import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import LetterForm from '../components/letter/LetterForm';
import LetterPreview from '../components/letter/LetterPreview';
import ImpressumDialog from '../components/letter/ImpressumDialog';
import PrivacyDialog from '../components/letter/PrivacyDialog';
import TermsDialog from '../components/letter/TermsDialog';
import DIN5008InfoDialog from '../components/letter/DIN5008InfoDialog';
import LanguageSwitcher from '../components/LanguageSwitcher';
import VersionDisplay from '../components/VersionDisplay';
import { translations } from '../components/translations';
import { exportAsPDF, printAsPDF } from '../utils/pdfExport';

export default function LetterWriter() {
  const [language, setLanguage] = useState('de');
  const t = translations[language];
  const canvasRef = useRef(null);
  
  // Generate default filename based on current date
  const defaultFilename = `brief-${new Date().toISOString().split('T')[0]}`;
  const [pdfFilename, setPdfFilename] = useState(defaultFilename + '.pdf');

  const today = new Date().toLocaleDateString(language === 'de' ? 'de-DE' : 'en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const [letterData, setLetterData] = useState({
    senderName: '',
    senderStreet: '',
    senderCity: '',
    senderPhone: '',
    senderEmail: '',
    recipientName: '',
    recipientStreet: '',
    recipientCity: '',
    subject: '',
    date: today,
    body: '',
    salutation: language === 'de' ? 'Sehr geehrte Damen und Herren,' : 'Dear Sir or Madam,',
    closing: language === 'de' ? 'Mit freundlichen Grüßen' : 'Sincerely yours',
    signatureName: '',
    enableFooter: false,
    footerText: '',
    footerAlignment: 'center',
    enableLegalInfo: false,
    companyName: '',
    registeredOffice: '',
    companyPhone: '',
    companyFax: '',
    companyEmail: '',
    companyWebsite: '',
    bankDetails: '',
    vatId: '',
    managingDirectors: '',
    supervisoryBoard: '',
    registrationCourt: '',
    hrbNumber: '',
    showFoldMarks: false,
    showHoleMark: false,
    showGuides: false
  });

  const handleDownloadPDF = () => {
    // Track PDF export event in Simple Analytics
    if (window.sa_event) {
      window.sa_event('pdf_export');
    }
    
    // Use the custom filename if provided, otherwise fallback to default
    const filename = pdfFilename.trim() || defaultFilename + '.pdf';
    // Ensure filename has .pdf extension
    const finalFilename = filename.endsWith('.pdf') ? filename : filename + '.pdf';
    exportAsPDF(letterData, finalFilename);
  };

  const handlePrint = () => {
    printAsPDF(letterData);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setLetterData(prev => ({
      ...prev,
      salutation: prev.salutation === 'Sehr geehrte Damen und Herren,' || prev.salutation === 'Dear Sir or Madam,' 
        ? (newLang === 'de' ? 'Sehr geehrte Damen und Herren,' : 'Dear Sir or Madam,')
        : prev.salutation,
      closing: prev.closing === 'Mit freundlichen Grüßen' || prev.closing === 'Sincerely yours'
        ? (newLang === 'de' ? 'Mit freundlichen Grüßen' : 'Sincerely yours')
        : prev.closing
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header - Responsive */}
      <header className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border-b border-slate-200 print:hidden sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1920px] mx-auto px-3 sm:px-6 py-3 sm:py-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Left: Logo and Feature Badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 min-w-0">
              <a 
                href="https://www.briefeditor.eu" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => {
                  // Track click event in Simple Analytics
                  if (window.sa_event) {
                    window.sa_event('logo_click');
                  }
                }}
                className="flex items-center gap-2 sm:gap-3 min-w-0 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden">
                  <img src="/favicon.svg" alt="Briefeditor Logo" className="w-full h-full" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm sm:text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent truncate">{t.appTitle}</h1>
                    <VersionDisplay />
                  </div>
                  <p className="text-[10px] sm:text-xs text-slate-500 hidden sm:block">{t.appSubtitle}</p>
                </div>
              </a>
              
              {/* Feature Badges - Hidden on mobile */}
              <div className="hidden lg:flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-600">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium whitespace-nowrap">{t.featureFree}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-600">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium whitespace-nowrap">{t.featureNoData}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-600">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium whitespace-nowrap">{t.featureEasy}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-600">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium whitespace-nowrap">{t.featureGDPR}</span>
                </div>
              </div>
            </div>
            
            {/* Right: Action Buttons - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-2">
              <DIN5008InfoDialog language={language} translations={t} />
              <div className="h-6 w-px bg-slate-300"></div>
              <Button 
                onClick={handleDownloadPDF}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-sm"
                disabled={!letterData.body}
                title="Wählen Sie 'Als PDF speichern' im Druckdialog"
              >
                <Download className="w-4 h-4 mr-2" />
                {t.btnDownloadPDF}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1920px] mx-auto p-3 sm:p-6 print:p-0 pt-16 sm:pt-24">
        {/* Feature Badges Box - Mobile Only - At the VERY TOP */}
        <div className="lg:hidden mb-4 mt-3 bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">{t.featureFree}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">{t.featureNoData}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">{t.featureEasy}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="font-medium">{t.featureGDPR}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[480px,1fr] gap-4 sm:gap-6 print:grid-cols-1 print:gap-0">
          {/* Editor Panel - Scrollable */}
          <div className="print:hidden">
            <LetterForm letterData={letterData} setLetterData={setLetterData} translations={t} pdfFilename={pdfFilename} setPdfFilename={setPdfFilename} />
          </div>

          {/* Preview Panel - Sticky on desktop, normal on mobile */}
          <div className="print:block">
            <div className="lg:sticky lg:top-[120px] flex justify-center items-start print:static">
              <LetterPreview letterData={letterData} translations={t} ref={canvasRef} />
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons - Only on mobile */}
        <div className="lg:hidden mt-4 bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <Button 
            onClick={handleDownloadPDF}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-sm"
            disabled={!letterData.body}
            title="Wählen Sie 'Als PDF speichern' im Druckdialog"
          >
            <Download className="w-4 h-4 mr-2" />
            {t.btnDownloadPDF}
          </Button>
        </div>

        {/* DIN 5008 Info Box - Mobile Only */}
        <div className="lg:hidden mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-slate-600">
          <p className="font-medium text-slate-900 mb-1">{t.infoBoxTitle}</p>
          <p className="mb-3">{t.infoBoxText}</p>
          <div className="flex justify-end">
            <DIN5008InfoDialog language={language} translations={t} />
          </div>
        </div>

        {/* Legal Information - Responsive Footer */}
        <div className="mt-8 sm:mt-12 print:hidden">
          <div className="flex flex-col gap-2 text-[10px] sm:text-xs">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <ImpressumDialog language={language} />
              <span className="text-slate-300">·</span>
              <PrivacyDialog language={language} />
              <span className="text-slate-300">·</span>
              <TermsDialog language={language} />
            </div>
            <div className="text-slate-400">
              © 2025 Philipp Schmidt. MIT License
            </div>
          </div>
        </div>

        {/* Language Switcher - At bottom on mobile, static */}
        <div className="lg:hidden mt-4 flex justify-end">
          <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
        </div>
      </div>

      {/* Language Switcher - Desktop only (fixed position) */}
      <div className="hidden lg:block">
        <LanguageSwitcher currentLanguage={language} onLanguageChange={handleLanguageChange} />
      </div>
    </div>
  );
}