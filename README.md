# Text-Summarizer-App
# Text Summarization API

## Overview
This project provides a Flask-based REST API for text summarization using Natural Language Processing (NLP) techniques. The API accepts a text input and returns a summarized version of the text based on word frequency.

## Features
- Tokenizes text into sentences and words
- Removes stopwords and punctuation
- Computes word frequency distribution
- Scores sentences based on word importance
- Returns a summary based on the most significant sentences
- Supports Cross-Origin Resource Sharing (CORS)

## Technologies Used
- Flask (for building the API)
- Flask-CORS (for handling cross-origin requests)
- NLTK (for text processing and summarization)

## Installation
### Prerequisites
Ensure you have Python installed (Python 3 recommended).

### Steps
1. Clone this repository:
   ```sh
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Create a virtual environment (optional but recommended):
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```
3. Install the dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Download required NLTK datasets:
   ```sh
   python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
   ```

## Usage
### Running the API
Start the Flask server by running:
```sh
python app.py
```
The API will run on `http://127.0.0.1:5000/`

### API Endpoint
#### `POST /summarize`
**Description:** Accepts text input and returns a summarized version.

**Request Body (JSON):**
```json
{
  "text": "Your text goes here...",
  "ratio": 0.3  # Optional, default is 0.3 (percentage of original text to keep)
}
```

**Response (JSON):**
```json
{
  "summary": "Summarized text output."
}
```

### Example Usage with cURL
```sh
curl -X POST "http://127.0.0.1:5000/summarize" \
     -H "Content-Type: application/json" \
     -d '{"text": "This is a sample text for summarization.", "ratio": 0.3}'
```

## License
This project is open-source and available under the MIT License.

## Acknowledgments
- [Flask Documentation](https://flask.palletsprojects.com/)
- [NLTK Documentation](https://www.nltk.org/)

