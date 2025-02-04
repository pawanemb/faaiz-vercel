import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [audioUrl, setAudioUrl] = useState('');
  const [apiKey, setApiKey] = useState('21d2c9586fa34cd5bf72f1ca6f410da3');
  const [transcription, setTranscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('speakers'); // 'speakers' or 'full'

  const handleTranscribe = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTranscription(null);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioUrl, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error transcribing audio');
      }

      setTranscription(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      const textToCopy = viewMode === 'speakers' 
        ? transcription.utterances.map(u => `Speaker ${u.speaker}: ${u.text}`).join('\n')
        : transcription.fullText;
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Faaiz - AI Audio Transcription</title>
        <meta name="description" content="AI-powered audio transcription with speaker detection" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Faaiz</h1>
        <p className="text-lg text-gray-600 mb-8">AI-powered audio transcription with speaker detection</p>

        <form onSubmit={handleTranscribe} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AssemblyAI API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your API key"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? "Hide" : "Show"}
              </button>
            </div>
            <a
              href="https://www.assemblyai.com/dashboard/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 text-sm text-blue-600 hover:text-blue-800"
            >
              Don't have an API key? Get one here
            </a>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audio URL
            </label>
            <input
              type="text"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              placeholder="Enter audio URL (Only MP3)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Enter a publicly accessible audio file URL
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Transcribing..." : "Start Transcription"}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {transcription && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Transcription Result</h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => setViewMode(viewMode === 'speakers' ? 'full' : 'speakers')}
                  className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  {viewMode === 'speakers' ? 'View Full Text' : 'View By Speaker'}
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              {viewMode === 'speakers' ? (
                <div className="space-y-4">
                  {transcription.utterances.map((utterance, index) => (
                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                      <p className="font-medium text-blue-600 mb-1">Speaker {utterance.speaker}</p>
                      <p className="text-gray-700">{utterance.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 whitespace-pre-wrap">{transcription.fullText}</p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
