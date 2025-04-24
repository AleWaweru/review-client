// screens/UpdateProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { createProfile, updateProfile } from '@/redux/reducers/profileSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { useNavigation } from '@react-navigation/native';
import UploadProfilePhoto from '@/components/hospital/profile/UploadProfilePhoto';

const UpdateProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);
  const navigation = useNavigation();

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    image: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        phone: profile.phone || '',
        address: profile.address || '',
        image: profile.image || '',
      });
    }
  }, [profile]);

  const handleSubmit = async () => {
    try {
      if (profile) {
        await dispatch(updateProfile(formData)).unwrap();
      } else {
        await dispatch(createProfile(formData)).unwrap();
      }
      navigation.goBack();
    } catch (err) {}
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  return (
    <ScrollView className="bg-white p-4">
      <Text className="text-xl font-bold text-center mb-4">
        {profile ? 'Update Profile' : 'Create Profile'}
      </Text>

      {/*Profile image upload */}
      <UploadProfilePhoto
        image={formData.image}
        setImage={(img) => setFormData({ ...formData, image: img })}
      />

      <TextInput
        className="border border-gray-300 rounded p-2 mb-4"
        placeholder="Phone"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
      />
      <TextInput
        className="border border-gray-300 rounded p-2 mb-4"
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
      />

      <Button
        title={loading ? 'Please wait...' : 'Submit'}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
};

export default UpdateProfileScreen;
