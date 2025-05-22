import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { createProfile, getProfile, updateProfile } from "@/redux/reducers/profileSlice";
import UploadProfilePhoto from "@/components/hospital/profile/UploadProfilePhoto";
import { Toast } from 'toastify-react-native'
import { useRouter } from "expo-router";


const ProfileForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    image: "",
  });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        phone: profile.phone || "",
        address: profile.address || "",
        image: profile.image || "",
      });
    }
  }, [profile]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!formData.phone || !formData.address) {
      Alert.alert("Validation Error", "Phone and address are required.");
      return;
    }

    if (profile) {
      dispatch(updateProfile(formData));
      Toast.success('Successfully updated profile');
      router.push("/(tabs)/profile");
    } else {
      dispatch(createProfile(formData));
      Toast.success('Successfully created profile');
      router.push("/(tabs)/profile");
    }
  };

  return (
    <View className="m-5 p-5 bg-white rounded-xl shadow">
      <Text className="text-xl font-semibold mb-4 text-gray-800">
        {profile ? "Update Profile" : "Create Profile"}
      </Text>

      {error ? (
        <Text className="text-red-500 mb-3">{error}</Text>
      ) : null}

<UploadProfilePhoto image={formData.image} setImage={(url) => handleChange("image", url)} />
      <TextInput
        className="border border-gray-300 p-3 rounded-lg mb-3"
        placeholder="Phone"
        value={formData.phone}
        onChangeText={(text) => handleChange("phone", text)}
      />
      <TextInput
        className="border border-gray-300 p-3 rounded-lg mb-3"
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => handleChange("address", text)}
      />


      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : (
        <Button
          title={profile ? "Update Profile" : "Create Profile"}
          onPress={handleSubmit}
          color="#2563eb"
        />
      )}
    </View>
  );
};

export default ProfileForm;
