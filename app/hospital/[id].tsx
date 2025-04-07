import { fetchHospitalById } from '@/redux/reducers/hospitalSlice';
import { AppDispatch } from '@/redux/store';
import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLocalSearchParams, useRouter } from 'expo-router'; 

const HospitalDetail = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { selectedHospital, loading, error } = useSelector((state: any) => state.hospital);

  useEffect(() => {
    if (id) {
      dispatch(fetchHospitalById(id as string));
    }
  }, [id]);

  if (loading) return <Text className="text-center text-lg mt-4">Loading hospital...</Text>;
  if (error) return <Text className="text-red-500 text-center mt-4">Error: {error}</Text>;
  if (!selectedHospital) return <Text className="text-center mt-4">No data found</Text>;

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
             <TouchableOpacity
        onPress={() => router.push('/')}
        className="mb-4 bg-blue-600 py-2 px-4 rounded-md self-start"
      >
        <Text className="text-white text-sm">← Back to Home</Text>
      </TouchableOpacity>
      <View className="bg-white rounded-xl p-4 shadow">
        <Text className="text-2xl font-bold text-gray-800 mb-2">{selectedHospital.name}</Text>
        <Text className="text-gray-600 mb-2">Email: {selectedHospital.email}</Text>

        {selectedHospital.image ? (
          <Image
            source={{ uri: selectedHospital.image }}
            className="h-40 w-full rounded-lg mb-4"
            resizeMode="cover"
          />
        ) : (
          <Text className="text-gray-400 mb-4">No image available</Text>
        )}

        <Text className="text-gray-700">
          Created At: {new Date(selectedHospital.createdAt).toLocaleDateString()}
        </Text>

        {selectedHospital.qrCode && (
          <View className="mt-6 items-center">
            <Text className="text-lg font-medium mb-2">QR Code</Text>
            <Image
              source={{ uri: selectedHospital.qrCode }}
              className="h-40 w-40"
              resizeMode="contain"
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default HospitalDetail;
