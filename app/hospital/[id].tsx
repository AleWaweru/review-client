import { fetchHospitalById } from "@/redux/reducers/hospitalSlice";
import { AppDispatch } from "@/redux/store";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Linking } from "react-native";
import ReviewHospital from "@/components/review/review";

const HospitalDetail = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { selectedHospital, loading, error } = useSelector(
    (state: any) => state.hospital
  );

  const { user } = useSelector((state: any) => state.auth);

  const isOwner = user?.hospitalId === selectedHospital?._id;

  useEffect(() => {
    if (id) {
      dispatch(fetchHospitalById(id as string));
    }
  }, [id]);

  useEffect(() => {
    if (selectedHospital) {
      const imageList = [];

      if (selectedHospital.image) {
        imageList.push({ uri: selectedHospital.image });
      }

      if (Array.isArray(selectedHospital.images)) {
        selectedHospital.images.forEach((img: string) => {
          imageList.push({ uri: img });
        });
      }

      if (imageList.length > 0) {
        setSelectedImage(imageList[0]); // first image shown
      }
    }
  }, [selectedHospital]);

  if (!selectedHospital)
    return (
      <Text className="text-center mt-4 text-gray-500">No data found</Text>
    );

  if (loading)
    return (
      <Text className="text-center text-lg mt-4 text-blue-600 font-medium">
        Loading hospital...
      </Text>
    );

  if (error)
    return (
      <Text className="text-red-500 text-center mt-4 font-semibold">
        Error: {error}
      </Text>
    );

  return (
    <>
      <ScrollView className="flex-1 bg-gradient-to-b from-blue-50 to-white p-4">
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            onPress={() => router.push("/")}
            className="bg-blue-700 py-2 px-5 rounded-full shadow-md"
          >
            <Text className="text-white text-sm font-semibold">
              ← Back to Home
            </Text>
          </TouchableOpacity>

          {isOwner && (
            <TouchableOpacity
              onPress={() => router.push(`/editHospital/${id}`)}
              className="bg-green-600 py-2 px-5 rounded-full shadow-md"
            >
              <Text className="text-white text-sm font-semibold">✏️ Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="bg-white rounded-2xl p-6 h-fit mb-9 shadow-xl">
          <Text className="text-3xl font-extrabold text-blue-800 mb-3">
            {selectedHospital.name}
          </Text>
        

          {selectedImage && (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="h-64 w-full rounded-xl bg-gray-100 items-center justify-center mb-4 overflow-hidden"
            >
              <Image
                source={selectedImage}
                resizeMode="cover"
                className="w-full h-full rounded-xl"
              />
            </TouchableOpacity>
          )}

          {selectedHospital.images?.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {selectedHospital.images.map(
                (img: any, index: React.Key | null | undefined) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedImage({ uri: img })}
                    className={`w-20 h-20 rounded-md overflow-hidden mr-3 ${
                      selectedImage?.uri === img
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                  >
                    <Image
                      source={{ uri: img }}
                      resizeMode="cover"
                      className="w-full h-full"
                    />
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          )}

          <Text className="text-gray-700 mb-1">
            📞 Phone:{" "}
            <Text className="font-medium">{selectedHospital.phone}</Text>
          </Text>
          <Text className="text-gray-600 text-base mb-3">
            📧 {selectedHospital.email}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (selectedHospital.website) {
                const domain = selectedHospital.website.trim();
                const url = domain.startsWith("http")
                  ? domain
                  : `https://www.${domain}`;
                Linking.openURL(url);
              }
            }}
          >
            <Text className="text-gray-700 mb-4">
              🌐 Website:{" "}
              <Text className="underline text-blue-500">
                {selectedHospital.website}
              </Text>
            </Text>
          </TouchableOpacity>

          {selectedHospital.address && (
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold text-lg mb-2">
                📍 Address
              </Text>
              <Text className="text-gray-600">
                Street: {selectedHospital.address.street}
              </Text>
              <Text className="text-gray-600">
                City: {selectedHospital.address.city}
              </Text>
              <Text className="text-gray-600">
                Country: {selectedHospital.address.country}
              </Text>
            </View>
          )}

          <ReviewHospital/>

          {selectedHospital.qrCode && (
            <View className="mt-6 items-center">
              <Text className="text-xl font-semibold text-gray-800 mb-2">
                🧾 QR Code
              </Text>
              <Image
                source={{ uri: selectedHospital.qrCode }}
                className="h-40 w-40 rounded-lg border border-gray-300"
                resizeMode="contain"
              />
              {selectedHospital.qrCodeExpiresAt && (
                <Text className="text-sm text-gray-500 mt-2 italic">
                  Expires on:{" "}
                  {new Date(selectedHospital.qrCodeExpiresAt).toLocaleString()}
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black/90 items-center justify-center"
        >
          <View className="w-[90%] h-[60%]">
            <Image
              source={selectedImage}
              resizeMode="contain"
              className="w-full h-full rounded-xl"
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="absolute top-3 right-3 bg-white rounded-full px-3 py-1"
            >
              <Text className="text-red-500 font-bold text-sm">✕</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default HospitalDetail;
