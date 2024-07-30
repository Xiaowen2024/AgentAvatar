import onnx

# Load the ONNX model
model = onnx.load('/Users/xyuan/Documents/GitHub/AgentAvatar/backend/convex/Memory/event_extraction_model.onnx')
# Print the model's graph inputs and outputs
print("Inputs:")
for input in model.graph.input:
    print(input.name, input.type)

print("\nOutputs:")
for output in model.graph.output:
    print(output.name, output.type)
