from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

# Load the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("michellejieli/emotion_text_classifier")
model = AutoModelForSequenceClassification.from_pretrained("michellejieli/emotion_text_classifier")

# Function to predict emotion from text
def predict_emotion(text):
    # Tokenize input text
    inputs = tokenizer(text, return_tensors='pt')
    # Get the predictions
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    # Apply softmax to get probabilities
    probabilities = F.softmax(logits, dim=-1)
    # Get the predicted emotion
    predicted_class_id = probabilities.argmax(axis=-1).item()
    predicted_emotion = model.config.id2label[predicted_class_id]
    # Convert to dictionary
    output_dict = {
        "text": text,
        "predicted_emotion": predicted_emotion,
        "probabilities": {model.config.id2label[i]: prob.item() for i, prob in enumerate(probabilities[0])}
    }
    return output_dict

# Example usage
text = ("Yesterday I worked online most of the day. I discovered an assignment I had done "
        "the previous day was rejected. This assignment provided a considerable reward so I "
        "basically lost about an hour's worth of work. That was frustrating. We need the money "
        "I am making online right now to pay our bills so I was also concerned about making enough "
        "money. However, at the end of the day, I hit my earnings goal so I was satisfied with my progress.")


if __name__ == "__main__":
    import sys
    text = sys.argv[1] if len(sys.argv) > 1 else ""
    if text:
        print(predict_emotion(text))
    else:
        print("No text provided")
