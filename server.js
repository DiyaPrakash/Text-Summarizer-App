import express from 'express';
import cors from 'cors';
import natural from 'natural';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, '.')));

const tokenizer = new natural.SentenceTokenizer();
const wordTokenizer = new natural.WordTokenizer();

function summarizeText(text, ratio = 0.3) {
    // Tokenize the text into sentences
    const sentences = tokenizer.tokenize(text);
    
    // Tokenize words and remove common words
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq = {};
    
    // Calculate word frequency
    words.forEach(word => {
        if (word.length > 3) { // Simple stopword filtering
            wordFreq[word] = (wordFreq[word] || 0) + 1;
        }
    });
    
    // Calculate sentence scores based on word frequency
    const scores = {};
    sentences.forEach(sentence => {
        const sentenceWords = sentence.toLowerCase().split(/\s+/);
        scores[sentence] = sentenceWords.reduce((score, word) => {
            return score + (wordFreq[word] || 0);
        }, 0) / sentenceWords.length;
    });
    
    // Select top sentences
    const numSentences = Math.max(1, Math.floor(sentences.length * ratio));
    const sortedSentences = sentences.sort((a, b) => scores[b] - scores[a]);
    const selectedSentences = sortedSentences.slice(0, numSentences);
    
    // Maintain original order
    const summary = sentences.filter(sentence => selectedSentences.includes(sentence));
    
    return summary.join(' ');
}

app.post('/summarize', (req, res) => {
    try {
        const { text, ratio } = req.body;
        
        if (!text) {
            return res.status(400).json({ error: 'No text provided' });
        }
        
        const summary = summarizeText(text, ratio);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});