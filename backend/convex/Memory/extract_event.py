from transformers import pipeline

pipe = pipeline("text2text-generation", model="hadifar/eventextraction")

def extract_event(text):
    result = pipe(text)
    return result[0]['generated_text']

if __name__ == "__main__":
    import sys
    text = sys.argv[1] if len(sys.argv) > 1 else ""
    if text:
        print(extract_event(text))
    else:
        print("No text provided")