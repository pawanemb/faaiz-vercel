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

  const { transcriptId, apiKey } = req.body;

  if (!transcriptId) {
    return res.status(400).json({ message: 'Transcript ID is required' });
  }

  if (!apiKey) {
    return res.status(400).json({ message: 'AssemblyAI API Key is required' });
  }

  try {
    const client = new AssemblyAI({
      apiKey: apiKey
    });

    const transcript = await client.transcripts.get(transcriptId);

    if (transcript.status === 'error') {
      throw new Error(transcript.error);
    }

    if (transcript.status !== 'completed') {
      return res.status(200).json({
        status: transcript.status
      });
    }

    // If completed, return the full transcription
    const response = {
      status: 'completed',
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
    console.error('Error checking transcript status:', error);
    res.status(500).json({ message: 'Error checking transcript status', error: error.message });
  }
}
