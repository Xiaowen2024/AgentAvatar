const { AutoTokenizer, AutoModelForSeq2SeqLM } = require('@xenova/transformers');

async function runEventExtraction() {
  try {
    // Load the tokenizer and model
    const tokenizer = await AutoTokenizer.from_pretrained('hadifar/eventextraction');
    const model = await AutoModelForSeq2SeqLM.from_pretrained('hadifar/eventextraction');

    // Example input text
    const inputText = "We had friends surprise us with a visit. We haven't seen them over 2 years. We were all so excited! They are from Hawaii and it is snowing here so we got to play in the snow with them and build a snowman!";

    // Tokenize the input text
    const inputs = await tokenizer(inputText, { return_tensors: 'pt' });

    // Generate the output (event extraction)
    const outputs = await model.generate(inputs.input_ids, inputs.attention_mask);

    // Decode the output to get the extracted event
    const extractedEvent = await tokenizer.decode(outputs[0], { skip_special_tokens: true });
    console.log('Extracted Event:', extractedEvent);
  } catch (error) {
    console.error('Error:', error);
  }
}

runEventExtraction();
