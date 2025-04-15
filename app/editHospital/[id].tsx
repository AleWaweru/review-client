import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppDispatch, RootState } from "@/redux/store";
import {
  updateHospitalProfile,
  fetchHospitalById,
} from "@/redux/reducers/hospitalSlice";
import ToastManager from "toastify-react-native/components/ToastManager";
import { Toast } from "toastify-react-native";
import UploadPhotos from "@/components/hospital/Upload";

const UpdateHospitalForm = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { selectedHospital, loading, error } = useSelector(
    (state: RootState) => state.hospital
  );

  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (id) dispatch(fetchHospitalById(id as string));
  }, [id]);

  useEffect(() => {
    if (selectedHospital) {
      setPhone(selectedHospital.phone || "");
      setStreet(selectedHospital.address?.street || "");
      setCity(selectedHospital.address?.city || "");
      setCountry(selectedHospital.address?.country || "");
      setWebsite(selectedHospital.website || "");
      setImages(
        Array.isArray(selectedHospital.images) ? selectedHospital.images : []
      );
    }
  }, [selectedHospital]);

  const handleUpdate = async () => {
    try {
      if (!id) return;

      // Validate required fields
      if (!phone || !street || !city || !country || !website) {
        Alert.alert(
          "Validation Error",
          "All fields except the image are required."
        );
        return;
      }

      await dispatch(
        updateHospitalProfile({
          id: id as string,
          data: {
            phone,
            website,
            images,
            address: {
              street,
              city,
              country,
            },
          },
        })
      ).unwrap();

      Toast.success("Hospital profile updated successfully!");
      router.back();
    } catch (err) {
      console.error(err);
      Toast.error("Failed to update hospital profile");
    }
  };

  if (loading) {
    return (
      <Text className="text-center text-lg mt-4 text-blue-600 font-medium">
        Loading hospital data...
      </Text>
    );
  }

  if (error) {
    return (
      <Text className="text-red-500 text-center mt-4 font-semibold">
        Error: {error}
      </Text>
    );
  }

  if (!selectedHospital) {
    return (
      <Text className="text-center mt-4 text-gray-500">No hospital found</Text>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text className="text-xl font-bold mb-4 text-center">
        Edit Hospital Profile
      </Text>

      <Text className="text-base mb-1">Phone</Text>
      <TextInput
        value={phone}
        onChangeText={setPhone}
        placeholder="Enter phone number"
        className="border p-3 rounded mb-4"
      />

      <Text className="text-base mb-1">Street Address</Text>
      <TextInput
        value={street}
        onChangeText={setStreet}
        placeholder="Enter street"
        className="border p-3 rounded mb-4"
      />

      <Text className="text-base mb-1">City</Text>
      <TextInput
        value={city}
        onChangeText={setCity}
        placeholder="Enter city"
        className="border p-3 rounded mb-4"
      />

      <Text className="text-base mb-1">Country</Text>
      <TextInput
        value={country}
        onChangeText={setCountry}
        placeholder="Enter country"
        className="border p-3 rounded mb-4"
      />

      <Text className="text-base mb-1">Website</Text>
      <TextInput
        value={website}
        onChangeText={setWebsite}
        placeholder="Enter website"
        className="border p-3 rounded mb-4"
      />

      <UploadPhotos images={images} setImages={setImages} />

      {images[0] && (
        <View className="items-center mb-4">
          <Text className="text-base mb-2">Selected Image</Text>
          <Image
            source={{ uri: images[0] }}
            className="w-full h-48 rounded-lg"
            resizeMode="cover"
          />
        </View>
      )}

      <TouchableOpacity
        onPress={handleUpdate}
        className="bg-blue-600 rounded p-3 mt-4"
      >
        <Text className="text-white text-center font-semibold">
          Update Profile
        </Text>
      </TouchableOpacity>

      <ToastManager />
    </ScrollView>
  );
};

export default UpdateHospitalForm;
