import { readFile } from 'node:fs/promises';

const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 120;

export type OcrResult = {
  text: string;
  pages: number;
};

export type OcrConfig = {
  apiUrl: string;
  apiKey: string;
  model: string;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runOcrOnFile(filePath: string, config: OcrConfig): Promise<OcrResult> {
  const authToken = config.apiKey;
  const fileBuffer = await readFile(filePath);
  const fileBlob = new Blob([fileBuffer]);

  const formData = new FormData();
  formData.append('model', config.model);
  formData.append('optionalPayload', JSON.stringify({
    useDocOrientationClassify: false,
    useDocUnwarping: false,
    useChartRecognition: false
  }));
  formData.append('file', fileBlob, filePath.split(/[\\/]/).pop() ?? 'document.pdf');

  const jobResponse = await fetch(config.apiUrl, {
    method: 'POST',
    headers: { Authorization: `bearer ${authToken}` },
    body: formData
  });

  if (!jobResponse.ok) {
    const text = await jobResponse.text();
    throw new Error(`OCR job submission failed: ${jobResponse.status} ${text}`);
  }

  const jobData = await jobResponse.json() as { data: { jobId: string } };
  const jobId = jobData.data.jobId;

  let attempts = 0;
  while (attempts < MAX_POLL_ATTEMPTS) {
    await delay(POLL_INTERVAL_MS);
    attempts++;

    const resultResponse = await fetch(`${config.apiUrl}/${jobId}`, {
      headers: { Authorization: `bearer ${authToken}` }
    });

    if (!resultResponse.ok) {
      throw new Error(`OCR polling failed: ${resultResponse.status}`);
    }

    const resultData = await resultResponse.json() as {
      data: {
        state: 'pending' | 'running' | 'done' | 'failed';
        errorMsg?: string;
        resultUrl?: { jsonUrl: string };
      };
    };

    const state = resultData.data.state;

    if (state === 'done') {
      const jsonUrl = resultData.data.resultUrl?.jsonUrl;
      if (!jsonUrl) throw new Error('OCR completed but no result URL');

      const jsonlResponse = await fetch(jsonUrl);
      if (!jsonlResponse.ok) throw new Error(`OCR result download failed: ${jsonlResponse.status}`);

      const text = await jsonlResponse.text();
      const lines = text.trim().split('\n').filter(Boolean);

      const pageTexts = lines.map((line) => {
        try {
          const parsed = JSON.parse(line);
          const results = parsed.result?.layoutParsingResults ?? [];
          return results.map((r: { markdown?: { text?: string } }) => r.markdown?.text ?? '').join('\n');
        } catch {
          return '';
        }
      });

      return {
        text: pageTexts.join('\n\n'),
        pages: pageTexts.length
      };
    }

    if (state === 'failed') {
      const errorMsg = resultData.data.errorMsg ?? 'Unknown OCR error';
      throw new Error(`OCR job failed: ${errorMsg}`);
    }
  }

  throw new Error(`OCR timed out after ${MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS / 1000}s`);
}
