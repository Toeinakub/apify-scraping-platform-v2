'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, FileDown, FileJson } from 'lucide-react';
import { toast } from 'sonner';

interface ExportButtonProps {
  data: any[];
  filename: string;
}

export default function ExportButton({ data, filename }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');

  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    setIsExporting(true);

    try {
      // Get all unique keys from all data items
      const allKeys = new Set<string>();
      data.forEach((item) => {
        Object.keys(item).forEach((key) => allKeys.add(key));
      });

      const headers = Array.from(allKeys);

      // Convert data to CSV format
      const csvRows = [];

      // Add header row
      csvRows.push(headers.map((header) => `"${header}"`).join(','));

      // Add data rows
      data.forEach((item) => {
        const row = headers.map((header) => {
          const value = item[header];

          if (value === null || value === undefined) {
            return '""';
          }

          if (typeof value === 'object') {
            return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          }

          // Escape quotes and wrap in quotes
          return `"${String(value).replace(/"/g, '""')}"`;
        });

        csvRows.push(row.join(','));
      });

      // Create CSV string
      const csvString = csvRows.join('\n');

      // Create blob and download
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success('Export successful', {
        description: `Data exported as ${filename}.csv`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed', {
        description: 'An error occurred while exporting the data. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    if (!data || data.length === 0) return;

    setIsExporting(true);

    try {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.json`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success('Export successful', {
        description: `Data exported as ${filename}.json`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed', {
        description: 'An error occurred while exporting the data. Please try again.',
        duration: 5000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      exportToCSV();
    } else {
      exportToJSON();
    }
  };

  return (
    <div className="flex gap-2">
      <Select value={exportFormat} onValueChange={(v: 'csv' | 'json') => setExportFormat(v)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="csv">
            <div className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              CSV
            </div>
          </SelectItem>
          <SelectItem value="json">
            <div className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              JSON
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      <Button
        onClick={handleExport}
        disabled={isExporting || !data || data.length === 0}
        variant="outline"
        size="sm"
      >
        <Download className="mr-2 h-4 w-4" />
        {isExporting ? 'Exporting...' : 'Export'}
      </Button>
    </div>
  );
}
