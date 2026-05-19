/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Markdown from 'react-markdown';
import { Copy, Loader2, Sparkles } from 'lucide-react';

export default function App() {
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!transcript.trim()) return;

    setLoading(true);
    setResult('');
    setCopied(false);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();
      if (data.result) {
        setResult(data.result);
      } else {
        setResult('生成失敗，請稍後再試。');
      }
    } catch (error) {
      setResult('發生錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">會議記錄生成大師</h1>
          <p className="mt-2 text-slate-600">AI 驅動的會議記錄總結與翻譯工具</p>
        </header>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="請在此貼上會議逐字稿或重點筆記..."
            className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-slate-700 leading-relaxed"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !transcript.trim()}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-100 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles size={20} />
            )}
            {loading ? '正在分析與生成...' : '生成總結與翻譯'}
          </button>
        </section>

        {result && (
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative">
            <button
              onClick={handleCopy}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-indigo-600 transition-colors"
            >
              {copied ? (
                <span className="text-xs font-semibold text-indigo-600">已複製!</span>
              ) : (
                <Copy size={20} />
              )}
            </button>
            <div className="prose prose-slate max-w-none">
              <Markdown>{result}</Markdown>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
