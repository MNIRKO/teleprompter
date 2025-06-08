import type { getDocument as GetDocumentType } from 'pdfjs-dist';

export async function exportText(content: string, filename: string) {
  try {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error('שגיאה בייצוא הקובץ');
  }
}

export async function importText(): Promise<string> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.json,.csv,.pdf';

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await readFileAsText(file);
        try {
          const data = JSON.parse(text);
          resolve(typeof data.content === 'string' ? data.content : text);
        } catch {
          resolve(text);
        }
      } catch (error) {
        reject(new Error('שגיאה בייבוא הקובץ'));
      }
    };

    input.click();
  });
}

export const readFileAsText = async (file: File): Promise<string> => {
  if (
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf')
  ) {
    const pdfjs: { getDocument: typeof GetDocumentType; GlobalWorkerOptions: any } =
      await import('pdfjs-dist/legacy/build/pdf');
    const workerSrc = new URL(
      'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => (item as any).str).join(' ') + '\n';
    }
    return text.trim();
  }

  return file.text();
};
