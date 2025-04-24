import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase'; // adjust path as needed

interface UploadPhotosProps {
  images: string[]; // Download URLs
  setImages: (images: string[]) => void;
}

const UploadPhotos: React.FC<UploadPhotosProps> = ({ images, setImages }) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ["images", "videos"],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      for (const asset of result.assets) {
        const uri = asset.uri;
        const blob = await uriToBlob(uri);
        const filename = `${Date.now()}-${asset.fileName || 'upload'}`;
        const storageRef = ref(storage, `uploads/${filename}`);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        setImages([...images, downloadURL]);
      }
    }
  };

  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <View className="mb-4">
      <TouchableOpacity onPress={pickImage} className="bg-blue-500 p-3 rounded mb-2">
        <Text className="text-white text-center font-semibold">Upload Images</Text>
      </TouchableOpacity>

      <ScrollView horizontal>
        {images.map((uri, idx) => (
          <View key={idx} className="relative mr-3">
            <Image source={{ uri }} className="w-24 h-24 rounded-lg" />
            <TouchableOpacity
              onPress={() => removeImage(idx)}
              className="absolute -top-2 -right-2 bg-red-600 w-5 h-5 rounded-full items-center justify-center"
            >
              <Text className="text-white text-xs font-bold">×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default UploadPhotos;
