// components/UploadProfilePhoto.tsx
import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';

interface UploadProfilePhotoProps {
  image: string;
  setImage: (image: string) => void;
}

const UploadProfilePhoto: React.FC<UploadProfilePhotoProps> = ({ image, setImage }) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      try {
        const uri = result.assets[0].uri;
        const blob = await uriToBlob(uri);
        const filename = `profile-${Date.now()}.jpg`;
        const storageRef = ref(storage, `profile_images/${filename}`);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        setImage(downloadURL);
      } catch (error) {
        Alert.alert('Upload Failed', 'Something went wrong while uploading the image.');
      }
    }
  };

  const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    return await response.blob();
  };

  return (
    <View className="mb-4 items-center">
      {image ? (
        <Image source={{ uri: image }} className="w-32 h-32 rounded-full mb-2" />
      ) : (
        <View className="w-32 h-32 bg-gray-200 rounded-full mb-2 items-center justify-center">
          <Text>No Image</Text>
        </View>
      )}

      <TouchableOpacity onPress={pickImage} className="bg-blue-500 p-2 px-4 rounded">
        <Text className="text-white font-semibold">Upload Profile Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadProfilePhoto;
