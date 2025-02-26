import os
import random
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from torch.utils.data import Dataset, DataLoader, random_split
from PIL import Image
from tqdm import tqdm

# Check for GPU
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using device:", device)

##############################
# 1) DATASET DEFINITION
##############################
class UTKFaceAgeDataset(Dataset):
    """
    Custom PyTorch Dataset for UTKFace-like data.
    Expects multiple subfolders with .jpg images named like:
    [age]_[gender]_[race]_[date&time].jpg
    
    E.g., "25_0_1_20170109150550335.jpg.chip.jpg"
    We'll parse the integer age from the filename.
    """
    def __init__(self, root_dir, transform=None):
        """
        root_dir: path to a directory that contains part1, part2, part3
        transform: optional transforms
        """
        self.root_dir = root_dir
        self.transform = transform
        self.image_paths = []
        
        # Gather all images from part1, part2, part3 (or any subfolders)
        subfolders = ["part1", "part2"] # "part3"]
        
        for subfolder in subfolders:
            folder_path = os.path.join(root_dir, subfolder)
            if os.path.exists(folder_path):
                for fname in os.listdir(folder_path):
                    if fname.lower().endswith(".jpg"):
                        full_path = os.path.join(folder_path, fname)
                        self.image_paths.append(full_path)
        
        # Optional: Shuffle if needed (or you can rely on random_split below)
        random.shuffle(self.image_paths)
        
    def __len__(self):
        return len(self.image_paths)
    
    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        filename = os.path.basename(img_path)
        
        # Parse the age from the filename
        # E.g., "25_0_1_20170109150550335.jpg" => age=25
        # We'll split by '_' and take the first element
        age_str = filename.split("_")[0]
        age = int(age_str)  # convert to integer
        
        # Load the image
        image = Image.open(img_path).convert("RGB")
        
        # Apply transforms
        if self.transform:
            image = self.transform(image)
        
        # Return (image, age)
        return image, torch.tensor(age, dtype=torch.float)


def main():

    ##############################
    # 2) TRANSFORMS & DATA SPLIT
    ##############################
    # Example transforms (resize, random flip, convert to tensor).
    # You can add advanced augmentations as needed.
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.ToTensor(),
        # If using a pretrained model (e.g., ResNet), consider normalizing with ImageNet stats:
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                            std=[0.229, 0.224, 0.225])
    ])

    # We'll use the same transform for validation/test, but typically no random flips
    val_test_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406],
                            std=[0.229, 0.224, 0.225])
    ])


    # Path to your dataset root that has part1, part2, part3
    root_data_path = "."  # e.g., "C:/Users/.../UTKFace" or similar

    # Load entire dataset
    full_dataset = UTKFaceAgeDataset(root_data_path, transform=None)

    # We will split into train/val/test
    dataset_size = len(full_dataset)
    train_size = int(0.8 * dataset_size)
    val_size = int(0.1 * dataset_size)
    test_size = dataset_size - train_size - val_size

    # random_split for train/val/test
    train_dataset, val_dataset, test_dataset = random_split(full_dataset, [train_size, val_size, test_size])

    # Assign transforms
    train_dataset.dataset.transform = train_transform
    val_dataset.dataset.transform = val_test_transform
    test_dataset.dataset.transform = val_test_transform

    print("Dataset sizes:")
    print("Train:", len(train_dataset))
    print("Val:", len(val_dataset))
    print("Test:", len(test_dataset))

    ##############################
    # 3) DATA LOADERS
    ##############################
    batch_size = 32

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False, num_workers=2)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False, num_workers=2)


    ##############################
    # 4) MODEL SETUP (ResNet18)
    ##############################
    # We'll do a regression on the final layer (1 output => predicted age)
    model = models.resnet18(weights=models.ResNet18_Weights.IMAGENET1K_V1)
    num_features = model.fc.in_features
    model.fc = nn.Linear(num_features, 1)  # 1 output for age
    model = model.to(device)

    # Loss: MSE for regression
    criterion = nn.MSELoss()

    # Optimizer
    optimizer = torch.optim.Adam(model.parameters(), lr=1e-4)


    ##############################
    # 5) TRAINING LOOP
    ##############################
    def train_one_epoch(model, loader, optimizer, criterion):
        model.train()
        running_loss = 0.0
        
        for images, ages in tqdm(loader, desc="Training Epoch"):
            images, ages = images.to(device), ages.to(device)
            
            optimizer.zero_grad()
            outputs = model(images).squeeze()  # shape: (batch,)
            
            loss = criterion(outputs, ages)
            loss.backward()
            optimizer.step()
            
            running_loss += loss.item() * images.size(0)
        
        epoch_loss = running_loss / len(loader.dataset)
        return epoch_loss

    def validate_one_epoch(model, loader, criterion):
        model.eval()
        running_loss = 0.0
        
        with torch.no_grad():
            for images, ages in loader:
                images, ages = images.to(device), ages.to(device)
                outputs = model(images).squeeze()
                loss = criterion(outputs, ages)
                running_loss += loss.item() * images.size(0)
        
        epoch_loss = running_loss / len(loader.dataset)
        return epoch_loss


    epochs = 10  # Increase as needed (e.g., 20, 30, etc.)

    for epoch in range(epochs):
        train_loss = train_one_epoch(model, train_loader, optimizer, criterion)
        val_loss = validate_one_epoch(model, val_loader, criterion)
        
        print(f"Epoch [{epoch+1}/{epochs}] - Train Loss: {train_loss:.4f}, Val Loss: {val_loss:.4f}")


    ##############################
    # 6) TEST EVALUATION
    ##############################
    model.eval()
    test_loss = 0.0

    with torch.no_grad():
        for images, ages in test_loader:
            images, ages = images.to(device), ages.to(device)
            preds = model(images).squeeze()
            loss = criterion(preds, ages)
            test_loss += loss.item() * images.size(0)

    test_loss /= len(test_loader.dataset)
    print(f"\nTest MSE Loss: {test_loss:.4f}")

    torch.save(model.state_dict(), "age_model.pth")
    print("Model weights saved to age_model.pth")

    

if __name__ == "__main__":
    main()
# Example usage:
# single_img_path = "/path/to/some_face.jpg"
# predicted_age = predict_age(model, single_img_path)
# print("Predicted age:", predicted_age)

