import natural from 'natural';

const tokenizer = new natural.WordTokenizer();
const sentiment = new natural.SentimentAnalyzer();
const stemmer = natural.PorterStemmer;

export interface NLPAnalysis {
  tokens: string[];
  sentiment: number;
  stems: string[];
  entities: string[];
  summary: string[];
}

// Helper function to split text into sentences
const getSentences = (text: string): string[] => {
  return text.match(/[^.!?]+[.!?]+/g) || [];
};

// Calculate sentence scores based on word frequency
const calculateSentenceScores = (sentences: string[], wordFreq: Map<string, number>): Map<string, number> => {
  const scores = new Map<string, number>();
  
  sentences.forEach(sentence => {
    const words = tokenizer.tokenize(sentence.toLowerCase()) || [];
    let score = 0;
    words.forEach(word => {
      score += wordFreq.get(word) || 0;
    });
    scores.set(sentence, score / words.length);
  });
  
  return scores;
};

export const analyzeText = (text: string): NLPAnalysis => {
  // Tokenization
  const tokens = tokenizer.tokenize(text) || [];
  
  // Sentiment Analysis (normalized to -1 to 1 range)
  const words = tokens.map(token => token.toLowerCase());
  const sentimentScore = sentiment.getSentiment(words);
  
  // Stemming
  const stems = tokens.map(token => stemmer.stem(token));
  
  // Basic Named Entity Recognition (capitalized words)
  const entities = tokens.filter(token => 
    token.length > 1 && 
    token[0] === token[0].toUpperCase() &&
    token[1] === token[1].toLowerCase() // Ensures it's not an acronym
  );

  // Text Summarization
  const sentences = getSentences(text);
  
  // Calculate word frequency
  const wordFreq = new Map<string, number>();
  words.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  });
  
  // Score sentences
  const sentenceScores = calculateSentenceScores(sentences, wordFreq);
  
  // Get top 3 sentences or fewer if text is shorter
  const summary = sentences
    .sort((a, b) => (sentenceScores.get(b) || 0) - (sentenceScores.get(a) || 0))
    .slice(0, Math.min(3, sentences.length));
  
  return {
    tokens,
    sentiment: sentimentScore,
    stems,
    entities,
    summary,
  };
};