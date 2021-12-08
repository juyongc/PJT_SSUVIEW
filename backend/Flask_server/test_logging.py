import torch
from torchvision import transforms
import torchvision.transforms.functional as TF
from torchvision.datasets import ImageFolder
from models import *
import argparse
import torch.optim as optim
import numpy as np
import pandas as pd
from torch.utils.data import Dataset, DataLoader
import torch.optim as optim
import matplotlib.pyplot as plt
from torchsummary import summary
import logging
from PIL import Image
import os

#class_labels = ['happy', 'suprise', 'angry','anxious', 'hurt', 'sad', 'neutral']
class_labels = ['기쁨', '당황', '분노', '불안', '상처', '슬픔', '중립']
class_labels_dict = {'기쁨': 0, '당황': 1, '분노': 2,
                     '불안': 3, '상처': 4, '슬픔': 5, '중립': 6}

print("something")
def get_device(args):
    # if args.gpu and torch.cuda.is_available():
    if args.get('gpu') and torch.cuda.is_available():
        return torch.device('cuda')
    else:
        return torch.device('cpu')

class ImageFolderWithPaths(ImageFolder):
    # override the __getitem__ method. this is the method that dataloader calls
    def __getitem__(self, index):
        # this is what ImageFolder normally returns 
        original_tuple = super(ImageFolderWithPaths, self).__getitem__(index)
        # the image file path
        path = self.imgs[index][0]
        # make a new tuple that includes original and the path
        # tuple_with_path = (original_tuple + (path,))
        tuple_with_path = (original_tuple)
        return tuple_with_path

def log(filename, message):
    formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    stream_hander = logging.StreamHandler()
    stream_hander.setFormatter(formatter)

    file_handler = logging.FileHandler(filename, encoding='utf-8')
    
    logger = logging.getLogger(filename)
    logger.addHandler(stream_hander)
    logger.addHandler(file_handler)
    logger.debug(message)


def loggingIndividualResult(prediction, groundtruth, path):
    LOG_FILE = "testset_result.log"

    for i, _ in enumerate(prediction):
        message = path[i] + "\t" + str(prediction[i][0]) + "\t" + str(groundtruth[i]) 
        print(message)
        log(LOG_FILE, message)


def evaluation(args, filenames):
    # batch_size = args.batch_size
    # image_size = (args.image_size, args.image_size)
    batch_size = args.get('batch_size')
    image_size = (args.get('image_size'), args.get('image_size'))

    transform_test = transforms.Compose([
        # transforms.Grayscale(num_output_channels=args.image_channel),
        transforms.Grayscale(num_output_channels = args.get('image_channel')),
        transforms.Resize(image_size),
        transforms.ToTensor(),
    ])

    '''
    valid_dataset = ImageFolder(args.data_path + '/val', transform_test)
    publictest_dataloader = torch.utils.data.DataLoader(valid_dataset, batch_size=batch_size,
                                                        num_workers=4)
    '''
    IMAGE_DIR = "./images/crop/"
    # test_dataset = ImageFolderWithPaths(args.data_path, transform_test)
    test_dataset = ImageFolderWithPaths(args.get('data_path'), transform_test)

    img_transform = []
    print('test_loggin.py filenames : ', filenames)
    for filename in filenames:
        image = Image.open(os.path.join(IMAGE_DIR, filename))
        print('test_logging image : ', image)
        print('개별 이미지 transform: ', transform_test(image).to('cpu'))
        img_transform.append(transform_test(image).to('cpu'))
    print('완료 후 img_transform', img_transform)
    #============================================================================================
    # img_transform = transform_test(image).to('cpu').unsqueeze(0)

    private_dataloader = torch.utils.data.DataLoader(img_transform, batch_size=batch_size,
                                                     num_workers=0)
    print('private_dataloader: ', private_dataloader)
    device = get_device(args)
    
    # checkpoint = torch.load(args.model_path, map_location=device)
    checkpoint = torch.load(args.get('model_path'), map_location=device)

    # model = getModel(args.model)
    model = getModel(args.get('model'))
    model.load_state_dict(checkpoint['model'])

    
    best_trained_model = model.to(device)

    #summary(model, (args.image_channel, args.image_size, args.image_size))

    best_trained_model.eval()

    predictions = []
    # groundtruth = []
    resultList = []
    # path = []
    print('여기까진오겠지?')
    with torch.no_grad():
        # for data, target, path in private_dataloader:
        for data in private_dataloader:
            
            print("load data")
            
            # print(paths)
            # images, labels = data, target
            images = data
            images = images.float()
            # images, labels = images.to(device), labels.to(device)
            images = images.to(device)

            outputs = best_trained_model(images)
            # print(outputs.tolist()[0])
            resultList.append(outputs.tolist()[0])
            # print(labels.cpu().numpy)
            predictions.append(outputs.max(1, keepdim=True)[1])
            # groundtruth.append(labels)
            # path.append(paths)

    

    print('결과 배열', resultList)
    for idx, prediction in enumerate(predictions):
        predictions[idx] = prediction.cpu().numpy()
        # groundtruth[idx] = groundtruth[idx].cpu().numpy()

        # 개별 이미지의 인식 결과를 파일에 저장
        # loggingIndividualResult(predictions[idx], groundtruth[idx], path[idx])
        
    
    predictions = np.concatenate(predictions)
    # groundtruth = np.concatenate(groundtruth)
    
    # groundtruth = pd.Series(groundtruth, name='Groundtruth')
    predictions = pd.Series(predictions.reshape(
        predictions.shape[0]), name='Predicted')
    # df_confusion = pd.crosstab(groundtruth, predictions)
    
    # print("Accuracy:", np.sum(df_confusion.values.diagonal()) /
    #       len(private_dataloader.dataset.samples)*100)

    print("Confusion Matrix:")      
    # print(df_confusion)
    # result = {"list" : resultList, "predicted" : predictions.tolist()[0], "accuracy" : np.sum(df_confusion.values.diagonal()) /
        #   len(private_dataloader.dataset.samples)*100}
    result = {"score" : resultList, "predicted" : predictions.tolist()}
    return result


def plot_confusion_matrix(df_confusion, cmap=plt.cm.Blues):
    plt.matshow(df_confusion, cmap=cmap)  # imshow
    plt.colorbar()
    tick_marks = np.arange(len(df_confusion.columns))
    plt.xticks(tick_marks, df_confusion.columns, rotation=45)
    plt.yticks(tick_marks, df_confusion.index)
    # plt.tight_layout()
    plt.ylabel(df_confusion.index.name)
    plt.xlabel(df_confusion.columns.name)

    #import seaborn as sn
    # sn.set(font_scale=0.5) # for label size
    # sn.heatmap(df_confusion, annot=True, annot_kws={"size": 10}) # font size
    plt.savefig("df_confusion")
    


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    # evaluation에 사용할 모델 파일
    parser.add_argument("--model_path", default="model.pth",
                        help="trained state_dict file path to open")
    parser.add_argument('--model', action='store',
                        default='emotionnet', help='network architecture')
    parser.add_argument("--data_path", default="images",
                        help="path to the data folder")
    
    # cnn, resnet, resmotionnet, vgg19, vgg22: 48 | vgg24: 96 | efficientnet: 224, any
    parser.add_argument('--image_size', action='store', type=int,
                        default=48, help='input image size of the network')

    # 3 for efficientnet, 1 for the rest
    parser.add_argument('--image_channel', action='store', type=int,
                        default=1, help='input image layers')

    parser.add_argument('--gpu', action='store_true',
                        default=True, help='set a switch to use GPU')
    parser.add_argument("--num_workers", default=4,
                        type=int, help="number of workers")
    parser.add_argument('--batch_size', default=128,
                        action='store', type=int, help='size of batch')
    args = parser.parse_args()
    print("Input Arguments -", args)

    evaluation(args)
