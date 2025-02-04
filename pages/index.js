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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white">
      <Head>
        <title>Faaiz - Speaker Detection & Transcription</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-4">
            Faaiz
          </h1>
          <p className="text-xl text-gray-300">AI-powered audio transcription with speaker detection</p>
        </div>

        <div className="flex-grow flex flex-col lg:flex-row gap-8 items-stretch">
          {/* Input Section */}
          <div className="lg:w-1/2 bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleTranscribe} className="space-y-6">
              <div>
                <label className="block text-lg font-medium text-gray-200 mb-2">
                  AssemblyAI API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your AssemblyAI API key"
                    className="block w-full rounded-xl border-2 border-indigo-500/30 bg-black/20 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm p-4 text-white placeholder-gray-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-white transition-colors"
                  >
                    {showApiKey ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-300">
                  Don't have an API key? <a href="https://www.assemblyai.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">Get one here</a>
                </p>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-200 mb-2">
                  Audio URL
                </label>
                <input
                  type="text"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  placeholder="Enter audio URL (MP3, WAV, etc.)"
                  className="block w-full rounded-xl border-2 border-indigo-500/30 bg-black/20 shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 sm:text-sm p-4 text-white placeholder-gray-400"
                  required
                />
                <p className="mt-2 text-sm text-gray-300">
                  Enter a publicly accessible audio file URL
                </p>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-6 border-2 border-transparent rounded-xl text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Transcribing...
                  </span>
                ) : (
                  'Start Transcription'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-900/50 border-2 border-red-500/50 rounded-xl">
                <p className="text-red-200">
                  Error: {error}
                </p>
              </div>
            )}
          </div>

          {/* Result Section */}
          <div className="lg:w-1/2 bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-200">Transcription Result</h2>
                {transcription && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewMode('speakers')}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        viewMode === 'speakers'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-black/20 text-gray-300 hover:bg-indigo-500/20'
                      }`}
                    >
                      Speakers View
                    </button>
                    <button
                      onClick={() => setViewMode('full')}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        viewMode === 'full'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-black/20 text-gray-300 hover:bg-indigo-500/20'
                      }`}
                    >
                      Full Text
                    </button>
                  </div>
                )}
              </div>
              
              {transcription ? (
                <>
                  <div className="flex-grow relative">
                    <div className="absolute inset-0 overflow-auto rounded-xl bg-black/20 p-6 border-2 border-indigo-500/30">
                      {viewMode === 'speakers' ? (
                        <div className="space-y-4">
                          {transcription.utterances.map((utterance, index) => (
                            <div key={index} className="flex flex-col space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-indigo-400 font-semibold">Speaker {utterance.speaker}</span>
                                <span className="text-gray-400 text-sm">
                                  {formatTime(utterance.start)} - {formatTime(utterance.end)}
                                </span>
                              </div>
                              <p className="text-gray-200 pl-4 border-l-2 border-indigo-500/30">
                                {utterance.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-200 whitespace-pre-wrap font-mono">
                          {transcription.fullText}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 border-2 border-indigo-500/30 rounded-xl text-sm font-medium text-white hover:bg-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    {copied ? (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy to Clipboard
                      </span>
                    )}
                  </button>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center text-gray-400 text-lg">
                  Transcription results will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
