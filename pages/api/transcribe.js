import { AssemblyAI } from 'assemblyai';

export const config = {
  api: {
    bodyParser: true,
  },
};

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

    // First, submit the audio file for transcription
    const transcript = await client.transcripts.create({
      audio: audioUrl,
      speaker_labels: true
    });

    // Return the transcript ID immediately
    res.status(200).json({
      transcriptId: transcript.id,
      status: 'processing'
    });
  } catch (error) {
    console.error('Transcription error:', error);
    res.status(500).json({ message: 'Error transcribing audio', error: error.message });
  }
}
