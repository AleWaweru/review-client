import React, { useEffect, useState } from "react";
import { View, Text, TextInput, ScrollView, Alert, Button } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  createProfile,
  updateProfile,
  getProfile,
} from "@/redux/reducers/profileSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { useNavigation } from "@react-navigation/native";
import UploadProfilePhoto from "@/components/hospital/profile/UploadProfilePhoto";

const UpdateProfileScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { profile, loading, error } = useSelector(
    (state: RootState) => state.profile
  );
  console.log("profile", profile);
  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    image: "",
  });

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        phone: profile.phone || "",
        address: profile.address || "",
        image: profile.image || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (error) Alert.alert("Error", error);
  }, [error]);

  const handleSubmit = async () => {
    console.log("Submit pressed");
    console.log("Form data:", formData);

    if (!formData.phone.trim() || !formData.address.trim()) {
      Alert.alert("Validation Error", "Phone and Address are required.");
      return;
    }

    try {
      if (profile) {
        const updatedProfile = await dispatch(updateProfile(formData)).unwrap();
        console.log("Updating Profile:", updatedProfile);
      } else {
        await dispatch(createProfile(formData)).unwrap();
      }
      navigation.goBack();
    } catch (err) {
      console.error("Error submitting profile:", err);
      Alert.alert("Submission failed", "Could not save profile");
    }
  };

  return (
    <ScrollView className="bg-white p-4">
      <Text className="text-xl font-bold text-center mb-4">
        {profile ? "Update Profile" : "Create Profile"}
      </Text>

      <UploadProfilePhoto
        image={formData.image}
        setImage={(img) => setFormData({ ...formData, image: img })}
      />

      <TextInput
        placeholder="Phone"
        value={formData.phone}
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
        className="border border-gray-300 rounded p-2 mb-4"
      />
      <TextInput
        placeholder="Address"
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
        className="border border-gray-300 rounded p-2 mb-4"
      />

      <Button
        title={loading ? "Saving..." : profile ? "Update" : "Create"}
        onPress={handleSubmit}
        disabled={loading}
      />
    </ScrollView>
  );
};

export default UpdateProfileScreen;
