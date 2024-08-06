import os
import json
from transformers import Trainer, BertTokenizer, BertForSequenceClassification, TrainingArguments
import torch
from tqdm import tqdm

model_save_path = "path/trained_model"

# Load the tokenizer
tokenizer = BertTokenizer.from_pretrained(model_save_path)

# Load the model
model = BertForSequenceClassification.from_pretrained(model_save_path)

# Load the training arguments
with open(os.path.join(model_save_path, 'training_args.json'), 'r') as f:
    training_args_dict = json.load(f)
training_args = TrainingArguments(**training_args_dict)

# Ensure the model is on the correct device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)
model.eval()

def classify_sentences(paragraph, model, tokenizer, device):
    sentences = paragraph.split('.')  # Split the paragraph into sentences
    results = []

    for sentence in tqdm(sentences, desc="Classifying sentences"):
        sentence = sentence.strip()
        if sentence:  # Ensure the sentence is not empty
            inputs = tokenizer(sentence, return_tensors='pt', padding=True, truncation=True, max_length=128)
            inputs = {k: v.to(device) for k, v in inputs.items()}
            with torch.no_grad():
                outputs = model(**inputs)
                predictions = torch.argmax(outputs.logits, dim=1)
                category = predictions.item()
            if category == 1:
                results.append(sentence)

    return results

# Example paragraph
paragraph = "We had friends surprise us with a visit. We haven't seen them over 2 years. We were all so excited! They are from Hawaii and it is snowing here so we got to play in the snow with them and build a snowman!"

# Classify sentences in the paragraph
sentences_category_1 = classify_sentences(paragraph, model, tokenizer, device)


def extract_autobiographical_facts_keywords(events):
    # List of first-person pronouns
    first_person_pronouns = {"i", "me", "my", "mine", "myself", 
                             "we", "us", "our", "ours", "ourselves"}

    autobiographical_facts = []

    for event in events:
        # Convert the sentence to lowercase and split into words
        words = event.lower().split()
        
        # Check if any first-person pronoun is in the sentence
        if any(pronoun in words for pronoun in first_person_pronouns):
            autobiographical_facts.append(event)

    return autobiographical_facts

# autobiographical_facts = extract_autobiographical_facts_keywords(events)