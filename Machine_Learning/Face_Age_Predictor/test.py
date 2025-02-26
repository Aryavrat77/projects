import torch
import torch.nn as nn
import torchvision.models as models
from torchvision import transforms
from PIL import Image

# 1) Same device choice
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 2) Re-create the same ResNet18 architecture
model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, 1)  # regression layer for age

# 3) Load the saved weights
model.load_state_dict(torch.load("age_model.pth", map_location=device))
model.to(device)
model.eval()

# 4) Inference function
def predict_age(model, img_path):
    # Must match transforms used in training or test
    transform_for_inference = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                             std=[0.229, 0.224, 0.225])
    ])

    image = Image.open(img_path).convert('RGB')
    image = transform_for_inference(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(image).item()

    return round(output)

# 5) Example usage
if __name__ == "__main__":
    for i in range(1, 15):
        sample_img = f"./Picture{i}.png"
        age_prediction = predict_age(model, sample_img)
        print(f"Predicted age for Picture{i}.png:", age_prediction)

