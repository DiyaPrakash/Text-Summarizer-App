from flask import Flask, request, jsonify
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from string import punctuation
from heapq import nlargest
from flask_cors import CORS

# Download required NLTK data
nltk.download('punkt')
nltk.download('stopwords')

app = Flask(__name__)
CORS(app)

def summarize_text(text, ratio=0.3):
    # Tokenize the text into sentences
    sentences = sent_tokenize(text)
    
    # Tokenize words and remove stopwords and punctuation
    stop_words = set(stopwords.words('english') + list(punctuation))
    words = word_tokenize(text.lower())
    word_tokens = [word for word in words if word not in stop_words]
    
    # Calculate word frequency
    freq = FreqDist(word_tokens)
    
    # Calculate sentence scores based on word frequency
    scores = {}
    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word in freq:
                if sentence not in scores:
                    scores[sentence] = freq[word]
                else:
                    scores[sentence] += freq[word]
    
    # Normalize sentence scores by length
    for sentence in scores:
        scores[sentence] = scores[sentence] / len(word_tokenize(sentence))
    
    # Select top sentences
    num_sentences = max(1, int(len(sentences) * ratio))
    summary_sentences = nlargest(num_sentences, scores, key=scores.get)
    
    # Maintain original order of sentences
    summary = [sentence for sentence in sentences if sentence in summary_sentences]
    
    return ' '.join(summary)

@app.route('/summarize', methods=['POST'])
def summarize():
    try:
        data = request.get_json()
        text = data.get('text', '')
        ratio = data.get('ratio', 0.3)
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        summary = summarize_text(text, ratio)
        return jsonify({'summary': summary})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)