import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, MapPin, FileText, Calendar, Building2, Scale } from 'lucide-react';

export default function LetterForm({ letterData, setLetterData, translations: t }) {
  const handleChange = (field, value) => {
    setLetterData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Sender Information */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-600" />
            {t.senderTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="senderName" className="text-xs font-medium text-slate-600">{t.labelName}</Label>
            <Input
              id="senderName"
              value={letterData.senderName}
              onChange={(e) => handleChange('senderName', e.target.value)}
              placeholder={t.placeholderName}
              className="mt-1 h-9 text-sm border-slate-200"
            />
          </div>
          <div>
            <Label htmlFor="senderStreet" className="text-xs font-medium text-slate-600">{t.labelStreet}</Label>
            <Input
              id="senderStreet"
              value={letterData.senderStreet}
              onChange={(e) => handleChange('senderStreet', e.target.value)}
              placeholder={t.placeholderStreet}
              className="mt-1 h-9 text-sm border-slate-200"
            />
          </div>
          <div>
            <Label htmlFor="senderCity" className="text-xs font-medium text-slate-600">{t.labelCity}</Label>
            <Input
              id="senderCity"
              value={letterData.senderCity}
              onChange={(e) => handleChange('senderCity', e.target.value)}
              placeholder={t.placeholderCity}
              className="mt-1 h-9 text-sm border-slate-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="senderPhone" className="text-xs font-medium text-slate-600">{t.labelPhone}</Label>
              <Input
                id="senderPhone"
                value={letterData.senderPhone}
                onChange={(e) => handleChange('senderPhone', e.target.value)}
                placeholder={t.placeholderPhone}
                className="mt-1 h-9 text-sm border-slate-200"
              />
            </div>
            <div>
              <Label htmlFor="senderEmail" className="text-xs font-medium text-slate-600">{t.labelEmail}</Label>
              <Input
                id="senderEmail"
                value={letterData.senderEmail}
                onChange={(e) => handleChange('senderEmail', e.target.value)}
                placeholder={t.placeholderEmail}
                className="mt-1 h-9 text-sm border-slate-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipient Information */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-600" />
            {t.recipientTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="recipientName" className="text-xs font-medium text-slate-600">{t.labelRecipientName}</Label>
            <Input
              id="recipientName"
              value={letterData.recipientName}
              onChange={(e) => handleChange('recipientName', e.target.value)}
              placeholder={t.placeholderRecipient}
              className="mt-1 h-9 text-sm border-slate-200"
            />
          </div>
          <div>
            <Label htmlFor="recipientStreet" className="text-xs font-medium text-slate-600">{t.labelStreet}</Label>
            <Input
              id="recipientStreet"
              value={letterData.recipientStreet}
              onChange={(e) => handleChange('recipientStreet', e.target.value)}
              placeholder={t.placeholderRecipientStreet}
              className="mt-1 h-9 text-sm border-slate-200"
            />
          </div>
          <div>
            <Label htmlFor="recipientCity" className="text-xs font-medium text-slate-600">{t.labelCity}</Label>
            <Input
              id="recipientCity"
              value={letterData.recipientCity}
              onChange={(e) => handleChange('recipientCity', e.target.value)}
              placeholder={t.placeholderRecipientCity}
              className="mt-1 h-9 text-sm border-slate-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* Letter Content */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-600" />
            {t.contentTitle}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label htmlFor="date" className="text-xs font-medium text-slate-600">{t.labelDate}</Label>
            <Input
              id="date"
              value={letterData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="mt-1 h-9 text-sm border-slate-200"
            />
          </div>
          <div>
            <Label htmlFor="subject" className="text-xs font-medium text-slate-600">{t.labelSubject}</Label>
            <Input
              id="subject"
              value={letterData.subject}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder={t.placeholderSubject}
              className="mt-1 h-9 text-sm border-slate-200"
            />
          </div>
          <div>
            <Label htmlFor="salutation" className="text-xs font-medium text-slate-600">{t.labelSalutation}</Label>
            <Input
              id="salutation"
              value={letterData.salutation}
              onChange={(e) => handleChange('salutation', e.target.value)}
              placeholder={t.placeholderSalutation}
              className="mt-1 h-9 text-sm border-slate-200"
            />
          </div>
          <div>
            <Label htmlFor="body" className="text-xs font-medium text-slate-600">{t.labelBody}</Label>
            <Textarea
              id="body"
              value={letterData.body}
              onChange={(e) => handleChange('body', e.target.value)}
              placeholder={t.placeholderBody}
              className="mt-1 min-h-[200px] text-sm border-slate-200 font-sans leading-relaxed"
            />
          </div>
          <div>
            <Label htmlFor="closing" className="text-xs font-medium text-slate-600">{t.labelClosing}</Label>
            <Input
              id="closing"
              value={letterData.closing}
              onChange={(e) => handleChange('closing', e.target.value)}
              placeholder={t.placeholderClosing}
              className="mt-1 h-9 text-sm border-slate-200"
            />
          </div>
          <div>
            <Label htmlFor="signatureName" className="text-xs font-medium text-slate-600">{t.labelSignature}</Label>
            <Input
              id="signatureName"
              value={letterData.signatureName}
              onChange={(e) => handleChange('signatureName', e.target.value)}
              placeholder={t.placeholderSignatureName}
              className="mt-1 h-9 text-sm border-slate-200"
            />
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
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="footerAlignment" className="text-xs font-medium text-slate-600">{t.footerAlignment}</Label>
              <Select
                value={letterData.footerAlignment}
                onValueChange={(value) => handleChange('footerAlignment', value)}
              >
                <SelectTrigger className="mt-1 h-9 text-sm border-slate-200">
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
                className="mt-1 min-h-[80px] text-sm border-slate-200"
              />
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
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="companyName" className="text-xs font-medium text-slate-600">{t.companyName}</Label>
              <Input
                id="companyName"
                value={letterData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Musterfirma GmbH"
                className="mt-1 h-9 text-sm border-slate-200"
              />
            </div>
            <div>
              <Label htmlFor="registeredOffice" className="text-xs font-medium text-slate-600">{t.registeredOffice}</Label>
              <Input
                id="registeredOffice"
                value={letterData.registeredOffice}
                onChange={(e) => handleChange('registeredOffice', e.target.value)}
                placeholder="Berlin"
                className="mt-1 h-9 text-sm border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="companyPhone" className="text-xs font-medium text-slate-600">{t.companyPhone}</Label>
                <Input
                  id="companyPhone"
                  value={letterData.companyPhone}
                  onChange={(e) => handleChange('companyPhone', e.target.value)}
                  placeholder="+49 30 123456"
                  className="mt-1 h-9 text-sm border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="companyFax" className="text-xs font-medium text-slate-600">{t.companyFax}</Label>
                <Input
                  id="companyFax"
                  value={letterData.companyFax}
                  onChange={(e) => handleChange('companyFax', e.target.value)}
                  placeholder="+49 30 123457"
                  className="mt-1 h-9 text-sm border-slate-200"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="companyEmail" className="text-xs font-medium text-slate-600">{t.companyEmail}</Label>
              <Input
                id="companyEmail"
                value={letterData.companyEmail}
                onChange={(e) => handleChange('companyEmail', e.target.value)}
                placeholder="info@firma.de"
                className="mt-1 h-9 text-sm border-slate-200"
              />
            </div>
            <div>
              <Label htmlFor="companyWebsite" className="text-xs font-medium text-slate-600">{t.companyWebsite}</Label>
              <Input
                id="companyWebsite"
                value={letterData.companyWebsite}
                onChange={(e) => handleChange('companyWebsite', e.target.value)}
                placeholder="www.firma.de"
                className="mt-1 h-9 text-sm border-slate-200"
              />
            </div>
            <div>
              <Label htmlFor="bankDetails" className="text-xs font-medium text-slate-600">{t.bankDetails}</Label>
              <Input
                id="bankDetails"
                value={letterData.bankDetails}
                onChange={(e) => handleChange('bankDetails', e.target.value)}
                placeholder="IBAN: DE89 3704 0044 0532 0130 00"
                className="mt-1 h-9 text-sm border-slate-200"
              />
            </div>
            <div>
              <Label htmlFor="vatId" className="text-xs font-medium text-slate-600">{t.vatId}</Label>
              <Input
                id="vatId"
                value={letterData.vatId}
                onChange={(e) => handleChange('vatId', e.target.value)}
                placeholder="DE123456789"
                className="mt-1 h-9 text-sm border-slate-200"
              />
            </div>
            <div>
              <Label htmlFor="managingDirectors" className="text-xs font-medium text-slate-600">{t.managingDirectors}</Label>
              <Input
                id="managingDirectors"
                value={letterData.managingDirectors}
                onChange={(e) => handleChange('managingDirectors', e.target.value)}
                placeholder="Max Mustermann, Maria Musterfrau"
                className="mt-1 h-9 text-sm border-slate-200"
              />
            </div>
            <div>
              <Label htmlFor="supervisoryBoard" className="text-xs font-medium text-slate-600">{t.supervisoryBoard}</Label>
              <Input
                id="supervisoryBoard"
                value={letterData.supervisoryBoard}
                onChange={(e) => handleChange('supervisoryBoard', e.target.value)}
                placeholder="Dr. Hans Müller"
                className="mt-1 h-9 text-sm border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="registrationCourt" className="text-xs font-medium text-slate-600">{t.registrationCourt}</Label>
                <Input
                  id="registrationCourt"
                  value={letterData.registrationCourt}
                  onChange={(e) => handleChange('registrationCourt', e.target.value)}
                  placeholder="Berlin"
                  className="mt-1 h-9 text-sm border-slate-200"
                />
              </div>
              <div>
                <Label htmlFor="hrbNumber" className="text-xs font-medium text-slate-600">{t.hrbNumber}</Label>
                <Input
                  id="hrbNumber"
                  value={letterData.hrbNumber}
                  onChange={(e) => handleChange('hrbNumber', e.target.value)}
                  placeholder="HRB 12345"
                  className="mt-1 h-9 text-sm border-slate-200"
                />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-slate-600">
        <p className="font-medium text-slate-900 mb-1">{t.infoBoxTitle}</p>
        <p>{t.infoBoxText}</p>
      </div>

      {/* Visual Guides */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-slate-900">{t.guidesTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
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
            <Label htmlFor="showGuides" className="text-xs font-medium text-slate-600 cursor-pointer">{t.showGuides}</Label>
            <Switch
              id="showGuides"
              checked={letterData.showGuides}
              onCheckedChange={(checked) => handleChange('showGuides', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}