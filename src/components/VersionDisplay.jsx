import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import packageJson from '../../package.json';

export default function VersionDisplay() {
  const handleVersionClick = () => {
    window.open(packageJson.repository.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="secondary" 
        className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-300 hover:from-slate-200 hover:to-slate-300 transition-all duration-200 font-mono text-xs px-2 py-1 cursor-pointer hover:shadow-sm group"
        onClick={handleVersionClick}
        title="View on GitHub"
      >
        <span>v{packageJson.version}</span>
        <ExternalLink className="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100 transition-opacity" />
      </Badge>
    </div>
  );
}
