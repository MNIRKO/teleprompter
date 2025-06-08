import { useCallback } from 'react';
import { readFileAsText } from '../../../utils/fileOperations';

interface UseFileOperationsProps {
  content: string;
  onContentChange: (content: string) => void;
}

export const useFileOperations = ({ content, onContentChange }: UseFileOperationsProps) => {
  const handleSave = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teleprompter-text-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.json,.csv,.pdf';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await readFileAsText(file);
        try {
          const data = JSON.parse(text);
          onContentChange(typeof data.content === 'string' ? data.content : text);
        } catch {
          onContentChange(text);
        }
      }
    };
    input.click();
  }, [onContentChange]);

  const handleExport = useCallback(() => {
    handleSave();
  }, [handleSave]);

  return {
    handleSave,
    handleImport,
    handleExport
  };
};