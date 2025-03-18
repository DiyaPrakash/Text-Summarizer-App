import React, { useState } from 'react';
import { Brain, MessageSquare, BarChart, Hash } from 'lucide-react';
import { analyzeText } from './nlp';

function App() {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = () => {
    if (!text.trim()) return;
    const result = analyzeText(text);
    setAnalysis(result);
  };

  const getSentimentEmoji = (score: number) => {
    if (score > 0.2) return '😊';
    if (score < -0.2) return '😔';
    return '😐';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Text Analysis Tool</h1>
          <p className="text-gray-600 mt-2">Analyze sentiment, extract keywords, and get text insights</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Input Text</h2>
          </div>
          <textarea
            className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Enter your text here for analysis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center"
          >
            <BarChart className="w-4 h-4 mr-2" />
            Analyze Text
          </button>
        </div>

        {/* Results Section */}
        {analysis && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sentiment Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Hash className="w-5 h-5 text-blue-600 mr-2" />
                Sentiment Analysis
              </h3>
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {getSentimentEmoji(analysis.sentiment)}
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {(analysis.sentiment * 100).toFixed(1)}%
                </div>
                <div className="text-gray-600 mt-2">
                  {analysis.sentiment > 0 ? 'Positive' : analysis.sentiment < 0 ? 'Negative' : 'Neutral'} Sentiment
                </div>
              </div>
            </div>

            {/* Text Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart className="w-5 h-5 text-blue-600 mr-2" />
                Text Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Word Count:</p>
                  <p className="text-xl font-semibold">{analysis.tokens.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Named Entities:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {analysis.entities.map((entity, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                      >
                        {entity}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Key Terms:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {analysis.tokens.slice(0, 5).map((token, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;