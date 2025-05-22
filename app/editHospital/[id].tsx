import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppDispatch, RootState } from "@/redux/store";
import {
  updateHospitalProfile,
  fetchHospitalById,
} from "@/redux/reducers/hospitalSlice";
import UploadPhotos from "@/components/hospital/Upload";
import ToastManager, { Toast } from "toastify-react-native";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const UpdateHospitalForm = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { selectedHospital, loading, error } = useSelector(
    (state: RootState) => state.hospital
  );

  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const locationRef = useRef<any>(null);

  useEffect(() => {
    if (id) dispatch(fetchHospitalById(id as string));
  }, [id]);

  useEffect(() => {
    if (selectedHospital) {
      setPhone(selectedHospital.phone || "");
      setWebsite(selectedHospital.website || "");
      setImages(
        Array.isArray(selectedHospital.images) ? selectedHospital.images : []
      );
      setLocation(selectedHospital.location || "");
    }
  }, [selectedHospital]);

  const handleUpdate = async () => {
    if (!id) return;

    try {
      await dispatch(
        updateHospitalProfile({
          id: id as string,
          data: { phone, website, images, location },
        })
      ).unwrap();

      Toast.success("Hospital profile updated successfully!");
      router.back();
    } catch (err) {
      console.error("Update error:", err);
      Toast.error("Failed to update hospital profile");
    }
  };

  if (loading) return <Text className="text-center mt-4">Loading...</Text>;
  if (error) return <Text className="text-red-500 mt-4">{error}</Text>;
  if (!selectedHospital)
    return <Text className="text-center mt-4">No hospital found</Text>;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={100}
      style={{ flex: 1, backgroundColor: "#f9f9f9" }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-xl font-bold mb-4 text-center">
          Edit Hospital Profile
        </Text>

        <Text className="text-base mb-1">Phone</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          className="border p-3 rounded mb-4"
        />

        <Text className="text-base mb-1">Selected Location: {location}</Text>
        <GooglePlacesAutocomplete
          ref={locationRef}
          placeholder="Enter Location"
          fetchDetails={true}
          onPress={(data, details = null) => {
            const selectedAddress =
              details?.formatted_address || data.description;
            setLocation(selectedAddress);
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY!,
            language: "en",
            components: "country:ke",
          }}
          styles={{
            container: {
              flex: 0,
              zIndex: 1000,
              marginBottom: 10,
            },
            textInputContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 0,
    paddingHorizontal: 0,
    alignItems: "center", // optional for vertical alignment
  },
  textInput: {
    height: 42,
    color: "#333",
    fontSize: 16,
    marginBottom: 8,
    maxWidth: "100%",
 
  },
            listView: {
              backgroundColor: "#fff",
              borderColor: "#ccc",
              borderWidth: 1,
              borderRadius: 8,
              elevation: 5,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              position: "relative",
              shadowOpacity: 0.1,
              shadowRadius: 4,
              marginTop: 2,
              zIndex: 1000,
            },
            row: {
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              borderBottomColor: "#eee",
              borderBottomWidth: 1,
            },
            separator: {
              height: 1,
              backgroundColor: "#eee",
            },
            description: {
              fontSize: 14,
              color: "#333",
            },
            predefinedPlacesDescription: {
              color: "#1faadb",
            },
          }}
          textInputProps={{
            placeholderTextColor: "#999",
          }}
        />

        <Text className="text-base mb-1 mt-4">Website</Text>
        <TextInput
          value={website}
          onChangeText={setWebsite}
          placeholder="Enter website"
          keyboardType="url"
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
    </KeyboardAvoidingView>
  );
};

export default UpdateHospitalForm;
