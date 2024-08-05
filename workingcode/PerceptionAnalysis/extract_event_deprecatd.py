from transformers import pipeline

pipe = pipeline("text2text-generation", model="hadifar/eventextraction")

def extract_event(text):
    result = pipe(text)
    print(result[0]['generated_text'])
    return result[0]['generated_text']
text = "Alex Parker, a software engineer from Seattle, spends his weekdays immersed in coding and problem-solving at a tech startup. Passionate about innovation, he often attends industry conferences and workshops to stay updated on the latest advancements. On weekends, Alex enjoys hiking in the picturesque trails of the Pacific Northwest, capturing the beauty of nature with his camera. In his free time, he volunteers at a local animal shelter, helping to care for and find homes for abandoned pets. Alex's love for travel has taken him to diverse destinations, from the bustling streets of Tokyo to the serene beaches of Bali, where he indulges in local cuisines and cultures."

if __name__ == "__main__":
    # import sys
    # text = sys.argv[1] if len(sys.argv) > 1 else ""
    # if text:
    #     print(extract_event(text))
    # else:
    #     print("No text provided")
    extract_event(text)