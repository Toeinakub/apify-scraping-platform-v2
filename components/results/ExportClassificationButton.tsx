'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileJson } from 'lucide-react';
import { toast } from 'sonner';

interface ExportClassificationButtonProps {
  classificationResults: any;
  sessionId: string;
}

export default function ExportClassificationButton({
  classificationResults,
  sessionId
}: ExportClassificationButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToJSON = () => {
    if (!classificationResults) return;

    setIsExporting(true);

    try {
      const jsonString = JSON.stringify(classificationResults, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `classification-${sessionId}.json`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success('Export successful', {
        description: `Classification results exported as classification-${sessionId}.json`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed', {
        description: 'An error occurred while exporting classification results. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={exportToJSON}
      disabled={isExporting || !classificationResults}
      variant="outline"
      size="sm"
    >
      <FileJson className="mr-2 h-4 w-4" />
      {isExporting ? 'Exporting...' : 'Export JSON'}
    </Button>
  );
}
