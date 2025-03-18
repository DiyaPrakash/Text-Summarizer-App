document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('input-text');
    const summaryLength = document.getElementById('summary-length');
    const lengthValue = document.getElementById('length-value');
    const summarizeBtn = document.getElementById('summarize-btn');
    const summaryOutput = document.getElementById('summary-output');

    // Update length value display
    summaryLength.addEventListener('input', (e) => {
        lengthValue.textContent = `${e.target.value} sentences`;
    });

    function summarizeText(text, numSentences) {
        // Split text into sentences (basic split on .!?)
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        
        if (sentences.length === 0) return text;
        
        // Simple scoring: longer sentences tend to be more important
        const scores = sentences.map(sentence => ({
            text: sentence,
            score: sentence.split(' ').length
        }));
        
        // Sort by score and get top N sentences
        const topSentences = scores
            .sort((a, b) => b.score - a.score)
            .slice(0, numSentences)
            .map(item => item.text);
        
        // Return sentences in original order
        return sentences
            .filter(sentence => topSentences.includes(sentence))
            .join(' ');
    }

    summarizeBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        
        if (text.length < 50) {
            alert('Please enter at least 50 characters of text.');
            return;
        }

        const numSentences = parseInt(summaryLength.value);
        const summary = summarizeText(text, numSentences);
        summaryOutput.textContent = summary;
    });
});