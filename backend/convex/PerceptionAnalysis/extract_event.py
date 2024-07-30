from transformers import pipeline

pipe = pipeline("text2text-generation", model="hadifar/eventextraction")

def extract_event(text):
    result = pipe(text)
    return result[0]['generated_text']
text = "We had friends surprise us with a visit. We haven't seen them in over 2 years. We were all so excited! They are from Hawaii and it is snowing here so we got to play in the snow with them and build a snowman"

if __name__ == "__main__":
    import sys
    text = sys.argv[1] if len(sys.argv) > 1 else ""
    if text:
        print(extract_event(text))
    else:
        print("No text provided")