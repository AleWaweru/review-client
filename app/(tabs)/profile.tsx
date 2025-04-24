import React, { useEffect } from 'react';
import { View, Text, Button, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useRouter } from 'expo-router';
import { getProfile } from '@/redux/reducers/profileSlice';

const ProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);
  const router = useRouter();

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  return (
    <ScrollView className="bg-white p-4">
      <Text className="text-xl font-bold text-center mb-4">Profile</Text>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text className="text-red-500 text-center mb-2">{error}</Text>}

      {profile ? (
        <View className="items-center">
          {profile.image && (
            <Image
              source={{ uri: profile.image }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: '#ccc',
              }}
            />
          )}
          <Text className="mb-2">Phone: {profile.phone}</Text>
          <Text className="mb-2">Address: {profile.address}</Text>
          <Button
            title="Update Profile"
            onPress={() => router.push('/updateProfile')}
          />
        </View>
      ) : (
        <Button
          title="Create Profile"
          onPress={() => router.push('/updateProfile')}
        />
      )}
    </ScrollView>
  );
};

export default ProfileScreen;
