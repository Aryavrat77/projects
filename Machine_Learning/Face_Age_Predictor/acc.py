import os
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from torch.utils.data import Dataset, DataLoader
from PIL import Image
from tqdm import tqdm

##############################
# 1) DEVICE & MODEL SETUP
##############################
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

# Rebuild the same ResNet18 architecture you trained
model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, 1)  # single output for age regression

# Load saved weights (no retraining)
model.load_state_dict(torch.load("long_test.pth", map_location=device))
model.to(device)
model.eval()

##############################
# 2) DATASET CLASS (TEST-ONLY)
##############################
class UTKFaceTestDataset(Dataset):
    """
    Dataset that reads images from part3 only and parses the age from the filename.
    """
    def __init__(self, root_dir, transform=None):
        """
        root_dir: folder that contains part3
        transform: transform for test images
        """
        self.root_dir = root_dir
        self.transform = transform
        self.image_paths = []

        # We only read from part3 here
        folder_path = os.path.join(root_dir, "part3")
        if os.path.exists(folder_path):
            for fname in os.listdir(folder_path):
                if fname.lower().endswith(".jpg"):
                    full_path = os.path.join(folder_path, fname)
                    self.image_paths.append(full_path)
        else:
            raise FileNotFoundError(f"part3 folder not found at: {folder_path}")

    def __len__(self):
        return len(self.image_paths)

    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        filename = os.path.basename(img_path)

        # Parse age from the filename (e.g., "25_0_1_20170109150550335.jpg")
        age_str = filename.split("_")[0]
        age = int(age_str)

        image = Image.open(img_path).convert("RGB")
        if self.transform:
            image = self.transform(image)

        return image, torch.tensor(age, dtype=torch.float)

##############################
# 3) TRANSFORMS & DATA LOADER
##############################
test_transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

root_data_path = "."  # The folder containing "part3" and "age_model.pth"

test_dataset = UTKFaceTestDataset(root_dir=root_data_path, transform=test_transform)
test_loader = DataLoader(test_dataset, batch_size=32, shuffle=False, num_workers=0)

print(f"Test dataset size: {len(test_dataset)} images")

##############################
# 4) EVALUATE ON PART3
##############################
mse_loss = 0.0
mae_loss = 0.0
count = 0
within_5years_correct = 0

model.eval()
with torch.no_grad():
    for images, true_ages in tqdm(test_loader, desc="Testing..."):
        images = images.to(device)
        true_ages = true_ages.to(device)

        preds = model(images).squeeze()  # shape: (batch_size,)
        
        # MSE = mean of (pred - true)^2
        sq_diff = (preds - true_ages) ** 2
        mse_loss += sq_diff.sum().item()

        # MAE = mean of |pred - true|
        abs_diff = (preds - true_ages).abs()
        mae_loss += abs_diff.sum().item()

        # "Within 5 years" accuracy
        for diff in abs_diff:
            if diff.item() <= 5:
                within_5years_correct += 1
        
        count += images.size(0)

# Compute final metrics
mse = mse_loss / count
mae = mae_loss / count
within_5years_acc = within_5years_correct / count * 100.0

print(f"Results on part3 ({count} images):")
print(f"  MSE : {mse:.2f}")
print(f"  MAE : {mae:.2f}")
print(f"  Within 5-year Accuracy: {within_5years_acc:.2f}%")
