import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  fetchHospitalById,
  verifyHospitalQRToken,
} from "@/redux/reducers/hospitalSlice";
import { AppDispatch } from "@/redux/store";

import ReviewDisplay from "@/components/review/ReviewDisplay";

import { CameraView, useCameraPermissions } from "expo-camera";
import ReviewForm from "@/components/review/reviewForm";


const HospitalDetail = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedHospital, loading, error } = useSelector(
    (state: any) => state.hospital
  );
  const { user } = useSelector((state: any) => state.auth);

  const isOwner = user?.hospitalId === selectedHospital?._id;

  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [showScanner, setShowScanner] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchHospitalById(id as string));
  }, [id]);

  useEffect(() => {
    if (selectedHospital) {
      const images = [
        ...(selectedHospital.image ? [{ uri: selectedHospital.image }] : []),
        ...(Array.isArray(selectedHospital.images)
          ? selectedHospital.images.map((img: string) => ({ uri: img }))
          : []),
      ];

      if (images.length > 0) setSelectedImage(images[0]);
    }
  }, [selectedHospital]);

  const openWebsite = () => {
    if (selectedHospital?.website) {
      const domain = selectedHospital.website.trim();
      const url = domain.startsWith("http") ? domain : `https://www.${domain}`;
      Linking.openURL(url);
    }
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    try {
      console.log("scanned data:", data);
      const hospitalId = data.split("/").pop() as string;
      const result = await dispatch(verifyHospitalQRToken(hospitalId));
      console.log("QR Code Result:", result);
      if (verifyHospitalQRToken.fulfilled.match(result)) {
        setShowScanner(false);
        setShowReviewForm(true);
      } else {
        alert(result.payload || "Invalid or expired QR code.");
        setShowScanner(false);
      }
    } catch {
      alert("Failed to verify QR code. Please try again.");
      setShowScanner(false);
    }
  };

  const hasPermission = permission?.granted;

  if (!hasPermission) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-700 mb-4 text-lg">
          Camera access is required
        </Text>
        <TouchableOpacity
          className="bg-blue-600 px-4 py-2 rounded-full"
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <Text className="text-center mt-4 text-blue-600 font-medium">
        Loading hospital...
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
      <Text className="text-center mt-4 text-gray-500">No data found</Text>
    );
  }

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        className="flex-1 bg-gradient-to-b from-blue-50 to-white p-4"
      >
        {/* Top Buttons */}
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

        {/* Hospital Info Card */}
        <View className="bg-white rounded-2xl p-6 mb-9 shadow-xl">
          <Text className="text-3xl font-extrabold text-blue-800 mb-3">
            {selectedHospital.name}
          </Text>

          {/* Main Image */}
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

          {/* Gallery */}
          {selectedHospital.images?.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {selectedHospital.images.map((img: string, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedImage({ uri: img })}
                  className={`w-20 h-20 rounded-md overflow-hidden mr-3 ${
                    selectedImage?.uri === img ? "border-2 border-blue-500" : ""
                  }`}
                >
                  <Image
                    source={{ uri: img }}
                    resizeMode="cover"
                    className="w-full h-full"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Contact Info */}
          <Text className="text-gray-700 mb-1">
            📞 Phone:{" "}
            <Text className="font-medium">{selectedHospital.phone}</Text>
          </Text>
          <Text className="text-gray-600 text-base mb-3">
            📧 {selectedHospital.email}
          </Text>

          {/* Website */}
          <TouchableOpacity onPress={openWebsite}>
            <Text className="text-gray-700 mb-4">
              🌐 Website:{" "}
              <Text className="underline text-blue-500">
                {selectedHospital.website}
              </Text>
            </Text>
          </TouchableOpacity>

          {/* Address */}
          {selectedHospital.location && (
            <View className="mb-6 px-4 py-3 bg-white rounded-xl shadow-md">
              <Text className="text-blue-700 font-bold text-xl mb-3">
                📍 Location
              </Text>
              <View className="space-y-1">
                <Text className="text-gray-500 text-base">
                  <Text className="font-semibold text-gray-800">Address:</Text>{" "}
                  {selectedHospital.location}
                </Text>
              </View>
            </View>
          )}

          {/* Review Section */}

          {!isOwner &&
            (!showReviewForm ? (
              <TouchableOpacity
                onPress={() => setShowScanner(true)}
                className="bg-blue-600 px-6 py-3 rounded-full mt-6"
              >
                <Text className="text-white font-semibold text-center">
                  Scan QR to Leave a Review
                </Text>
              </TouchableOpacity>
            ) : (
              <ReviewForm
                hospitalId={selectedHospital._id}
                onClose={() => setShowReviewForm(false)}
              />
            ))}

          <View className="mb-6">
            <ReviewDisplay hospitalId={selectedHospital._id} />
          </View>

          {/* QR Code for Owner */}
          {isOwner && selectedHospital.qrCode && (
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
              <TouchableOpacity
                onPress={() => dispatch(fetchHospitalById(id as string))}
                className="mt-4 bg-blue-500 px-5 py-2 mb-5 rounded-full"
              >
                <Text className="text-white font-semibold">
                  🔄 Refresh QR Code
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal for Full Image */}
      <Modal visible={modalVisible} transparent animationType="fade">
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

      {/* Modal for QR Scanner */}
      {showScanner && (
        <Modal visible transparent>
          <View className="flex-1 bg-black/80 items-center justify-center">
            <View className="w-[90%] h-[65%] rounded-2xl overflow-hidden">
              <CameraView
                className="flex-1 relative"
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              >
                {/* Scanning frame overlay */}
                <View className="absolute inset-0 items-center justify-center">
                  <View className="w-56 h-56 border-4 border-green-400 rounded-xl" />
                </View>
              </CameraView>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={() => {
                setShowScanner(false);
                setScanned(false);
              }}
              className="mt-6 px-6 py-2 bg-red-600 rounded-full shadow"
            >
              <Text className="text-white font-bold text-lg">Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </>
  );
};

export default HospitalDetail;
