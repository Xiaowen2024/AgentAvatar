import * as ort from 'onnxruntime-node';
import { AutoTokenizer } from '@xenova/transformers';

async function runModel() {
  // Initialize the tokenizer
  const tokenizer = await AutoTokenizer.fromPretrained('bert-base-uncased');

  // The input text
  const inputText = "We had friends surprise us with a visit. We haven't seen them in over 2 years. We were all so excited! They are from Hawaii and it is snowing here so we got to play in the snow with them and build a snowman!";

  // Tokenize the input text
  const encoded = await tokenizer.encode(inputText, { addSpecialTokens: true });
  const inputIds = new Int32Array(encoded.input_ids);
  const attentionMask = new Int32Array(encoded.attention_mask);

  // Define shapes (batch_size, sequence_length)
  const batchSize = 1;
  const sequenceLength = inputIds.length;

  // Prepare the tensors
  const inputTensorIds = new ort.Tensor('int32', inputIds, [batchSize, sequenceLength]);
  const attentionMaskTensor = new ort.Tensor('int32', attentionMask, [batchSize, sequenceLength]);

  // Load the ONNX model
  const modelPath = './model.onnx';  // Replace with your ONNX model path
  const session = await ort.InferenceSession.create(modelPath);

  // Create feeds with input names and tensors
  const feeds = {
    input_ids: inputTensorIds,
    attention_mask: attentionMaskTensor
  };

  // Run the model
  const results = await session.run(feeds);

  // Access the output (e.g., logits)
  console.log('Logits:', results.logits.data);
}

runModel().catch(err => console.error('Error:', err));
