import os
import json
from transformers import Trainer, BertTokenizer, BertForSequenceClassification, TrainingArguments
import torch
from tqdm import tqdm

os.environ['CURL_CA_BUNDLE'] = ''
model_save_path = "/Users/xyuan/Documents/GitHub/AgentAvatar/workingcode/PerceptionAnalysis/trained_model"

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

# Example list of events
events = [
    "I attended a graduation ceremony where my cousin received his diploma. The ceremony was held at a grand auditorium, and the atmosphere was filled with excitement and pride.",
    "John went to a wedding this weekend, and the bride and groom looked so happy. The event was held in a beautiful outdoor garden, complete with twinkling fairy lights and elegant decorations.",
    "Sarah had a job interview yesterday, and it went quite well. She was asked a variety of questions about her experience and skills, and she left feeling confident about her performance.",
    "I celebrated my birthday with friends and family at a wonderful party. We had a delicious cake, played games, and shared many laughs throughout the evening.",
    "Emma participated in a marathon race and managed to finish within her target time. The race took place in a scenic route through the city, and she felt a great sense of accomplishment crossing the finish line.",
    "David enjoyed a fantastic music concert featuring his favorite band. The energy of the crowd was electrifying, and the band played all their greatest hits, leaving everyone cheering for more.",
    "Sophia volunteered for community service at the local food bank last Saturday. She spent the day sorting donations and packing food boxes for families in need, finding the experience incredibly rewarding.",
    "I attended a book club meeting where we discussed our latest read. The conversation was engaging, and everyone shared their unique perspectives on the book's themes and characters.",
    "Olivia visited an art exhibition showcasing contemporary artists. She was mesmerized by the innovative artworks and even had the chance to meet one of the artists in person.",
    "James went to a business conference and networked with industry professionals. He attended several insightful sessions and came away with new contacts and ideas for his work.",
    "Isabella attended a family reunion and reconnected with relatives she hadn't seen in years. The gathering was filled with nostalgia, as everyone shared stories and reminisced about old times.",
    "Liam went on a hiking expedition through the scenic trails of the national park. The hike was challenging but rewarding, offering breathtaking views and a sense of peace away from the city.",
    "I took a cooking class and learned how to make authentic Italian pasta. The instructor was excellent, and I now feel confident in preparing a delicious homemade pasta dish.",
    "Benjamin joined a language exchange meetup to practice speaking Spanish. He met people from different backgrounds, and they spent hours conversing and helping each other improve their language skills.",
    "Amelia participated in a tech hackathon and their team developed an innovative app. They worked tirelessly over the weekend, and their hard work paid off when they won first place.",
    "I went to a yoga retreat and found it incredibly relaxing and rejuvenating. The retreat was set in a tranquil location, and the sessions helped me reconnect with my inner self.",
    "Mia joined a political rally to support a cause she believes in. The rally was well-organized, with powerful speeches and a large turnout of passionate supporters.",
    "Ethan enjoyed a holiday festival with various cultural performances and food stalls. The festival was lively and colorful, offering a wonderful blend of music, dance, and delicious food.",
    "Harper attended a charity fundraiser and contributed to a good cause. The event included a silent auction and a dinner, raising substantial funds for the charity's initiatives.",
    "Aiden went to a film screening and participated in a discussion"
]

autobiographical_facts = extract_autobiographical_facts_keywords(events)
print(autobiographical_facts)