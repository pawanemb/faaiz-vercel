import { AssemblyAI } from 'assemblyai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { audioUrl, apiKey } = req.body;

  if (!audioUrl) {
    return res.status(400).json({ message: 'Audio URL is required' });
  }

  if (!apiKey) {
    return res.status(400).json({ message: 'AssemblyAI API Key is required' });
  }

  try {
    const client = new AssemblyAI({
      apiKey: apiKey
    });

    const transcript = await client.transcripts.transcribe({
      audio: audioUrl,
      speaker_labels: true
    });

    if (transcript.status === 'error') {
      throw new Error(transcript.error);
    }

    // Format the response with both full text and speaker-separated utterances
    const response = {
      fullText: transcript.text,
      utterances: transcript.utterances.map(utterance => ({
        speaker: utterance.speaker,
        text: utterance.text,
        start: utterance.start,
        end: utterance.end
      }))
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ message: 'Error transcribing audio', error: error.message });
  }
}
