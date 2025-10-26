import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, MapPin, FileText, Calendar, Building2, Scale, Play, Trash2 } from 'lucide-react';
import { CHAR_LIMITS } from '@/lib/characterLimits';

export default function LetterForm({ letterData, setLetterData, translations: t, pdfFilename, setPdfFilename }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getFieldLimit = (field) => {
    const limits = {
      senderName: CHAR_LIMITS.senderName,
      recipientName: CHAR_LIMITS.recipientName,
      senderStreet: CHAR_LIMITS.senderStreet,
      recipientStreet: CHAR_LIMITS.recipientStreet,
      senderCity: CHAR_LIMITS.senderCity,
      recipientCity: CHAR_LIMITS.recipientCity,
      senderPhone: CHAR_LIMITS.phone,
      senderEmail: CHAR_LIMITS.email,
      date: CHAR_LIMITS.date,
      subject: CHAR_LIMITS.subject,
      salutation: CHAR_LIMITS.salutation,
      body: CHAR_LIMITS.body,
      closing: CHAR_LIMITS.closing,
      signatureName: CHAR_LIMITS.signature,
      footerText: CHAR_LIMITS.footerText,
      companyName: CHAR_LIMITS.companyName,
      registeredOffice: CHAR_LIMITS.registeredOffice,
      companyPhone: CHAR_LIMITS.phone,
      companyFax: CHAR_LIMITS.phone,
      companyEmail: CHAR_LIMITS.email,
      companyWebsite: CHAR_LIMITS.companyWebsite,
      bankDetails: CHAR_LIMITS.bankDetails,
      vatId: CHAR_LIMITS.vatId,
      managingDirectors: CHAR_LIMITS.managingDirectors,
      supervisoryBoard: CHAR_LIMITS.supervisoryBoard,
      registrationCourt: CHAR_LIMITS.registrationCourt,
      hrbNumber: CHAR_LIMITS.hrbNumber,
      recipientAddressSupplement: CHAR_LIMITS.recipientAddressSupplement,
    };
    return limits[field];
  };

  const handleChange = (field, value) => {
    const maxLength = getFieldLimit(field);
    if (maxLength && value.length > maxLength) {
      value = value.slice(0, maxLength);
    }
    setLetterData(prev => ({ ...prev, [field]: value }));
  };

  const renderCharCounter = (field, value) => {
    const limit = getFieldLimit(field);
    if (!limit) return null;
    const remaining = limit - value.length;
    // Don't show orange warning for date field and sender fields
    const senderFields = ['senderName', 'senderStreet', 'senderCity', 'senderPhone', 'senderEmail'];
    const isNearLimit = remaining < 20 && field !== 'date' && !senderFields.includes(field);
    return (
      <div className={`text-[10px] mt-0.5 text-right ${isNearLimit ? 'text-orange-600' : 'text-slate-400'}`}>
        {value.length} / {limit}
      </div>
    );
  };

  const insertTestText = () => {
    setLetterData(prev => ({
      ...prev,
      senderName: 'Max Mustermann',
      senderStreet: 'Musterstraße 123',
      senderCity: '12345 Musterstadt',
      senderPhone: '+49 123 456789',
      senderEmail: 'max.mustermann@example.com',
      recipientName: 'Beispiel GmbH',
      recipientStreet: 'Beispielstraße 456',
      recipientCity: '54321 Beispielstadt',
      recipientAddressSupplement: 'Hinter dem Tor',
      subject: 'Betreff: Testbrief',
      body: 'vielen Dank für Ihr Interesse an unseren Dienstleistungen.',
      salutation: 'Sehr geehrte Damen und Herren,',
      closing: 'Mit freundlichen Grüßen',
      signatureName: 'Max Mustermann'
    }));
  };

  const clearAllText = () => {
    setLetterData(prev => ({
      ...prev,
      senderName: '',
      senderStreet: '',
      senderCity: '',
      senderPhone: '',
      senderEmail: '',
      recipientName: '',
      recipientStreet: '',
      recipientCity: '',
      recipientAddressSupplement: '',
      subject: '',
      body: '',
      salutation: prev.salutation, // Keep current salutation
      closing: prev.closing, // Keep current closing
      signatureName: '',
      footerText: '',
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
      recipientAddressSupplement: '',
    }));
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Sender Information */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-600" />
            {t.senderTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div>
            <Label htmlFor="senderName" className="text-xs font-medium text-slate-600">{t.labelName}</Label>
            <Input
              id="senderName"
              value={letterData.senderName}
              onChange={(e) => handleChange('senderName', e.target.value)}
              placeholder={t.placeholderName}
              className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
              maxLength={CHAR_LIMITS.senderName}
            />
            {renderCharCounter('senderName', letterData.senderName)}
          </div>
          <div>
            <Label htmlFor="senderStreet" className="text-xs font-medium text-slate-600">{t.labelStreet}</Label>
            <Input
              id="senderStreet"
              value={letterData.senderStreet}
              onChange={(e) => handleChange('senderStreet', e.target.value)}
              placeholder={t.placeholderStreet}
              className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
              maxLength={CHAR_LIMITS.senderStreet}
            />
            {renderCharCounter('senderStreet', letterData.senderStreet)}
          </div>
          <div>
            <Label htmlFor="senderCity" className="text-xs font-medium text-slate-600">{t.labelCity}</Label>
            <Input
              id="senderCity"
              value={letterData.senderCity}
              onChange={(e) => handleChange('senderCity', e.target.value)}
              placeholder={t.placeholderCity}
              className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
              maxLength={CHAR_LIMITS.senderCity}
            />
            {renderCharCounter('senderCity', letterData.senderCity)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="senderPhone" className="text-xs font-medium text-slate-600">{t.labelPhone}</Label>
              <Input
                id="senderPhone"
                value={letterData.senderPhone}
                onChange={(e) => handleChange('senderPhone', e.target.value)}
                placeholder={t.placeholderPhone}
                className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                maxLength={CHAR_LIMITS.phone}
              />
              {renderCharCounter('senderPhone', letterData.senderPhone)}
            </div>
            <div>
              <Label htmlFor="senderEmail" className="text-xs font-medium text-slate-600">{t.labelEmail}</Label>
              <Input
                id="senderEmail"
                value={letterData.senderEmail}
                onChange={(e) => handleChange('senderEmail', e.target.value)}
                placeholder={t.placeholderEmail}
                className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                maxLength={CHAR_LIMITS.email}
              />
              {renderCharCounter('senderEmail', letterData.senderEmail)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipient Information */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-600" />
            {t.recipientTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div>
            <Label htmlFor="recipientName" className="text-xs font-medium text-slate-600">{t.labelRecipientName}</Label>
            <Input
              id="recipientName"
              value={letterData.recipientName}
              onChange={(e) => handleChange('recipientName', e.target.value)}
              placeholder={t.placeholderRecipient}
              className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
              maxLength={CHAR_LIMITS.recipientName}
            />
            {renderCharCounter('recipientName', letterData.recipientName)}
          </div>
          <div>
            <Label htmlFor="recipientAddressSupplement" className="text-xs font-medium text-slate-600">{t.labelRecipientAddressSupplement}</Label>
            <Input
              id="recipientAddressSupplement"
              value={letterData.recipientAddressSupplement || ''}
              onChange={(e) => handleChange('recipientAddressSupplement', e.target.value)}
              placeholder={t.placeholderRecipientAddressSupplement}
              className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
              maxLength={CHAR_LIMITS.recipientAddressSupplement}
            />
            {renderCharCounter('recipientAddressSupplement', letterData.recipientAddressSupplement || '')}
          </div>
          <div>
            <Label htmlFor="recipientStreet" className="text-xs font-medium text-slate-600">{t.labelStreet}</Label>
            <Input
              id="recipientStreet"
              value={letterData.recipientStreet}
              onChange={(e) => handleChange('recipientStreet', e.target.value)}
              placeholder={t.placeholderRecipientStreet}
              className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
              maxLength={CHAR_LIMITS.recipientStreet}
            />
            {renderCharCounter('recipientStreet', letterData.recipientStreet)}
          </div>
          <div>
            <Label htmlFor="recipientCity" className="text-xs font-medium text-slate-600">{t.labelCity}</Label>
            <Input
              id="recipientCity"
              value={letterData.recipientCity}
              onChange={(e) => handleChange('recipientCity', e.target.value)}
              placeholder={t.placeholderRecipientCity}
              className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
              maxLength={CHAR_LIMITS.recipientCity}
            />
            {renderCharCounter('recipientCity', letterData.recipientCity)}
          </div>
        </CardContent>
      </Card>

      {/* Letter Content */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            {t.contentTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div>
            <Label htmlFor="date" className="text-xs font-medium text-slate-600">{t.labelDate}</Label>
            <Input
              id="date"
              value={letterData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
              maxLength={CHAR_LIMITS.date}
            />
            {renderCharCounter('date', letterData.date)}
          </div>
          <div>
            <Label htmlFor="subject" className="text-xs font-medium text-slate-600">{t.labelSubject}</Label>
            <Input
              id="subject"
              value={letterData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder={t.placeholderSubject}
              className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
              maxLength={CHAR_LIMITS.subject}
            />
            {renderCharCounter('subject', letterData.subject)}
          </div>
          <div>
            <Label htmlFor="salutation" className="text-xs font-medium text-slate-600">{t.labelSalutation}</Label>
            <Input
              id="salutation"
              value={letterData.salutation}
              onChange={(e) => handleChange('salutation', e.target.value)}
              placeholder={t.placeholderSalutation}
              className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
              maxLength={CHAR_LIMITS.salutation}
            />
            {renderCharCounter('salutation', letterData.salutation)}
          </div>
          <div>
            <Label htmlFor="body" className="text-xs font-medium text-slate-600">{t.labelBody}</Label>
            <Textarea
              id="body"
              value={letterData.body}
              onChange={(e) => handleChange('body', e.target.value)}
              placeholder={t.placeholderBody}
              className="mt-1 min-h-[120px] sm:min-h-[160px] lg:min-h-[200px] text-sm border-slate-200 font-sans leading-relaxed"
              maxLength={CHAR_LIMITS.body}
            />
            {renderCharCounter('body', letterData.body)}
          </div>
          <div>
            <Label htmlFor="closing" className="text-xs font-medium text-slate-600">{t.labelClosing}</Label>
            <Input
              id="closing"
              value={letterData.closing}
              onChange={(e) => handleChange('closing', e.target.value)}
              placeholder={t.placeholderClosing}
              className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
              maxLength={CHAR_LIMITS.closing}
            />
            {renderCharCounter('closing', letterData.closing)}
          </div>
          <div>
            <Label htmlFor="signatureName" className="text-xs font-medium text-slate-600">{t.labelSignature}</Label>
            <Input
              id="signatureName"
              value={letterData.signatureName}
              onChange={(e) => handleChange('signatureName', e.target.value)}
              placeholder={t.placeholderSignatureName}
              className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
              maxLength={CHAR_LIMITS.signature}
            />
            {renderCharCounter('signatureName', letterData.signatureName)}
          </div>
        </CardContent>
      </Card>

      {/* Footer Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              {t.footerTitle}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="enableFooter" className="text-xs text-slate-600 cursor-pointer">{t.enableFooter}</Label>
              <Switch
                id="enableFooter"
                checked={letterData.enableFooter}
                onCheckedChange={(checked) => handleChange('enableFooter', checked)}
              />
            </div>
          </div>
        </CardHeader>
        {letterData.enableFooter && (
          <CardContent className="space-y-2 sm:space-y-3">
            <div>
              <Label htmlFor="footerAlignment" className="text-xs font-medium text-slate-600">{t.footerAlignment}</Label>
              <Select
                value={letterData.footerAlignment}
                onValueChange={(value) => handleChange('footerAlignment', value)}
              >
                <SelectTrigger className="mt-1 h-8 sm:h-9 text-sm border-slate-200">
                  <SelectValue placeholder={t.footerAlignment} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">{t.footerAlignCenter}</SelectItem>
                  <SelectItem value="left">{t.footerAlignLeft}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="footerText" className="text-xs font-medium text-slate-600">{t.footerTextLabel}</Label>
              <Textarea
                id="footerText"
                value={letterData.footerText}
                onChange={(e) => handleChange('footerText', e.target.value)}
                placeholder={t.footerTextPlaceholder}
                className="mt-1 min-h-[60px] sm:min-h-[70px] lg:min-h-[80px] text-sm border-slate-200"
                maxLength={CHAR_LIMITS.footerText}
              />
              {renderCharCounter('footerText', letterData.footerText)}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Legal Information Section */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-600" />
              {t.legalTitle}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="enableLegalInfo" className="text-xs text-slate-600 cursor-pointer">{t.enableLegal}</Label>
              <Switch
                id="enableLegalInfo"
                checked={letterData.enableLegalInfo}
                onCheckedChange={(checked) => handleChange('enableLegalInfo', checked)}
              />
            </div>
          </div>
        </CardHeader>
        {letterData.enableLegalInfo && (
          <CardContent className="space-y-2 sm:space-y-3">
            <div>
              <Label htmlFor="companyName" className="text-xs font-medium text-slate-600">{t.companyName}</Label>
              <Input
                id="companyName"
                value={letterData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Musterfirma GmbH"
                className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                maxLength={CHAR_LIMITS.companyName}
              />
              {renderCharCounter('companyName', letterData.companyName)}
            </div>
            <div>
              <Label htmlFor="registeredOffice" className="text-xs font-medium text-slate-600">{t.registeredOffice}</Label>
              <Input
                id="registeredOffice"
                value={letterData.registeredOffice}
                onChange={(e) => handleChange('registeredOffice', e.target.value)}
                placeholder="Berlin"
                className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                maxLength={CHAR_LIMITS.registeredOffice}
              />
              {renderCharCounter('registeredOffice', letterData.registeredOffice)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="companyPhone" className="text-xs font-medium text-slate-600">{t.companyPhone}</Label>
                <Input
                  id="companyPhone"
                  value={letterData.companyPhone}
                  onChange={(e) => handleChange('companyPhone', e.target.value)}
                  placeholder="+49 30 123456"
                  className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                  maxLength={CHAR_LIMITS.phone}
                />
                {renderCharCounter('companyPhone', letterData.companyPhone)}
              </div>
              <div>
                <Label htmlFor="companyFax" className="text-xs font-medium text-slate-600">{t.companyFax}</Label>
                <Input
                  id="companyFax"
                  value={letterData.companyFax}
                  onChange={(e) => handleChange('companyFax', e.target.value)}
                  placeholder="+49 30 123457"
                  className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                  maxLength={CHAR_LIMITS.phone}
                />
                {renderCharCounter('companyFax', letterData.companyFax)}
              </div>
            </div>
            <div>
              <Label htmlFor="companyEmail" className="text-xs font-medium text-slate-600">{t.companyEmail}</Label>
              <Input
                id="companyEmail"
                value={letterData.companyEmail}
                onChange={(e) => handleChange('companyEmail', e.target.value)}
                placeholder="info@firma.de"
                className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                maxLength={CHAR_LIMITS.email}
              />
              {renderCharCounter('companyEmail', letterData.companyEmail)}
            </div>
            <div>
              <Label htmlFor="companyWebsite" className="text-xs font-medium text-slate-600">{t.companyWebsite}</Label>
              <Input
                id="companyWebsite"
                value={letterData.companyWebsite}
                onChange={(e) => handleChange('companyWebsite', e.target.value)}
                placeholder="www.firma.de"
                className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                maxLength={CHAR_LIMITS.companyWebsite}
              />
              {renderCharCounter('companyWebsite', letterData.companyWebsite)}
            </div>
            <div>
              <Label htmlFor="bankDetails" className="text-xs font-medium text-slate-600">{t.bankDetails}</Label>
              <Input
                id="bankDetails"
                value={letterData.bankDetails}
                onChange={(e) => handleChange('bankDetails', e.target.value)}
                placeholder="IBAN: DE89 3704 0044 0532 0130 00"
                className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                maxLength={CHAR_LIMITS.bankDetails}
              />
              {renderCharCounter('bankDetails', letterData.bankDetails)}
            </div>
            <div>
              <Label htmlFor="vatId" className="text-xs font-medium text-slate-600">{t.vatId}</Label>
              <Input
                id="vatId"
                value={letterData.vatId}
                onChange={(e) => handleChange('vatId', e.target.value)}
                placeholder="DE123456789"
                className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                maxLength={CHAR_LIMITS.vatId}
              />
              {renderCharCounter('vatId', letterData.vatId)}
            </div>
            <div>
              <Label htmlFor="managingDirectors" className="text-xs font-medium text-slate-600">{t.managingDirectors}</Label>
              <Input
                id="managingDirectors"
                value={letterData.managingDirectors}
                onChange={(e) => handleChange('managingDirectors', e.target.value)}
                placeholder="Max Mustermann, Maria Musterfrau"
                className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                maxLength={CHAR_LIMITS.managingDirectors}
              />
              {renderCharCounter('managingDirectors', letterData.managingDirectors)}
            </div>
            <div>
              <Label htmlFor="supervisoryBoard" className="text-xs font-medium text-slate-600">{t.supervisoryBoard}</Label>
              <Input
                id="supervisoryBoard"
                value={letterData.supervisoryBoard}
                onChange={(e) => handleChange('supervisoryBoard', e.target.value)}
                placeholder="Dr. Hans Müller"
                className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                maxLength={CHAR_LIMITS.supervisoryBoard}
              />
              {renderCharCounter('supervisoryBoard', letterData.supervisoryBoard)}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="registrationCourt" className="text-xs font-medium text-slate-600">{t.registrationCourt}</Label>
                <Input
                  id="registrationCourt"
                  value={letterData.registrationCourt}
                  onChange={(e) => handleChange('registrationCourt', e.target.value)}
                  placeholder="Berlin"
                  className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                  maxLength={CHAR_LIMITS.registrationCourt}
                />
                {renderCharCounter('registrationCourt', letterData.registrationCourt)}
              </div>
              <div>
                <Label htmlFor="hrbNumber" className="text-xs font-medium text-slate-600">{t.hrbNumber}</Label>
                <Input
                  id="hrbNumber"
                  value={letterData.hrbNumber}
                  onChange={(e) => handleChange('hrbNumber', e.target.value)}
                  placeholder="HRB 12345"
                  className="mt-1 h-8 sm:h-9 text-sm border-slate-200"
                  maxLength={CHAR_LIMITS.hrbNumber}
                />
                {renderCharCounter('hrbNumber', letterData.hrbNumber)}
              </div>
            </div>
          </CardContent>
        )}
      </Card>


      {/* Visual Guides */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900">{t.guidesTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="showFoldMarks" className="text-xs font-medium text-slate-600 cursor-pointer">{t.showFoldMarks}</Label>
            <Switch
              id="showFoldMarks"
              checked={letterData.showFoldMarks}
              onCheckedChange={(checked) => handleChange('showFoldMarks', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="showHoleMark" className="text-xs font-medium text-slate-600 cursor-pointer">{t.showHoleMark}</Label>
            <Switch
              id="showHoleMark"
              checked={letterData.showHoleMark}
              onCheckedChange={(checked) => handleChange('showHoleMark', checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="showGuides" className="text-xs font-medium text-slate-600 cursor-pointer">
              <span className="hidden sm:inline">{t.showGuides}</span>
              <span className="sm:hidden">
                Hilfslinien
                <span className="block text-xs text-slate-400 mt-1">(Nur Desktop)</span>
              </span>
            </Label>
            <Switch
              id="showGuides"
              checked={letterData.showGuides}
              onCheckedChange={(checked) => {
                // Only allow changes on desktop
                if (!isMobile) {
                  handleChange('showGuides', checked);
                }
              }}
              disabled={isMobile}
              className={isMobile ? "opacity-50 cursor-not-allowed" : "opacity-100 cursor-pointer"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Text Buttons */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <button
              onClick={insertTestText}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 hover:border-slate-300 transition-colors"
            >
              <Play className="w-4 h-4" />
              Testtext einfügen
            </button>
            <button
              onClick={clearAllText}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 hover:border-slate-300 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Alle Felder leeren
            </button>
          </div>
        </CardContent>
      </Card>

      {/* PDF Filename */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            PDF Export
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3">
          <div>
            <Label htmlFor="pdfFilename" className="text-xs font-medium text-slate-600">{t.labelFilename}</Label>
            <div className="mt-1 flex items-center">
              <Input
                id="pdfFilename"
                value={pdfFilename.replace(/\.pdf$/i, '')}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value.length > CHAR_LIMITS.pdfFilename) {
                    value = value.slice(0, CHAR_LIMITS.pdfFilename);
                  }
                  setPdfFilename(value + '.pdf');
                }}
                placeholder={t.placeholderFilename.replace(/\.pdf$/i, '')}
                className="h-8 sm:h-9 text-sm border-slate-200 rounded-r-none"
                maxLength={CHAR_LIMITS.pdfFilename}
              />
              <div className="h-8 sm:h-9 px-3 flex items-center bg-slate-50 border border-l-0 border-slate-200 rounded-r-md text-sm text-slate-600 font-medium">
                .pdf
              </div>
            </div>
            <div className={`text-[10px] mt-0.5 text-right ${CHAR_LIMITS.pdfFilename - pdfFilename.replace(/\.pdf$/i, '').length < 20 ? 'text-orange-600' : 'text-slate-400'}`}>
              {pdfFilename.replace(/\.pdf$/i, '').length} / {CHAR_LIMITS.pdfFilename}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}