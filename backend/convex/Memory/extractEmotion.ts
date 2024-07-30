const { AutoTokenizer, AutoModelForSequenceClassification } = require('@xenova/transformers');

// Load the tokenizer and model
async function loadModel() {
    const tokenizer = await AutoTokenizer.from_pretrained('michellejieli/emotion_text_classifier');
    const model = await AutoModelForSequenceClassification.from_pretrained('michellejieli/emotion_text_classifier');
    return { tokenizer, model };
}

// Function to predict emotion from text
async function predictEmotion(text, tokenizer, model) {
    // Tokenize input text
    const inputs = await tokenizer(text, { return_tensors: 'pt' });

    // Get the predictions
    const outputs = await model(inputs);
    const logits = outputs.logits;

    // Apply softmax to get probabilities
    const softmax = (x) => {
        const maxLogit = Math.max(...x);
        const exps = x.map((i) => Math.exp(i - maxLogit));
        const sumExps = exps.reduce((a, b) => a + b);
        return exps.map((i) => i / sumExps);
    };

    const probabilities = softmax(logits.data[0]);

    // Get the predicted emotion
    const predictedClassId = probabilities.indexOf(Math.max(...probabilities));
    const predictedEmotion = model.config.id2label[predictedClassId];

    // Convert to dictionary
    const outputDict = {
        text: text,
        predicted_emotion: predictedEmotion,
        probabilities: model.config.id2label.reduce((obj, label, idx) => {
            obj[label] = probabilities[idx];
            return obj;
        }, {})
    };

    return outputDict;
}

// Example usage
(async () => {
    const { tokenizer, model } = await loadModel();
    const text = 'I am so happy today!';
    const result = await predictEmotion(text, tokenizer, model);
    console.log(result);
})();
