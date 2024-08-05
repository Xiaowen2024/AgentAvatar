from sklearn.cluster import DBSCAN
from sentence_transformers import SentenceTransformer
import numpy as np

def extract_representative_repeated_events(events, similarity_threshold=0.7, min_samples=2):
    # Load a pre-trained sentence transformer model
    model = SentenceTransformer('all-MiniLM-L6-v2')

    # Generate embeddings for each event
    embeddings = model.encode(events)

    # Use DBSCAN clustering algorithm to identify groups of similar events
    clustering_model = DBSCAN(eps=1 - similarity_threshold, min_samples=min_samples, metric='cosine')
    clustering_labels = clustering_model.fit_predict(embeddings)

    # Collect repeated events based on cluster labels
    repeated_events = {}
    for idx, label in enumerate(clustering_labels):
        if label == -1:
            continue  # Ignore noise points
        if label not in repeated_events:
            repeated_events[label] = []
        repeated_events[label].append(events[idx])

    # Filter clusters to only include those with more than one event
    repeated_events = [event_list[0] for label, event_list in repeated_events.items() if len(event_list) > 1]

    return repeated_events

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
# Extract representative repeated events
representative_repeated_events = extract_representative_repeated_events(events)

# Print the results
print(representative_repeated_events)