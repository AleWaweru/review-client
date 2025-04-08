import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateHospitalProfile, fetchHospitalById } from '@/redux/reducers/hospitalSlice';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ToastManager from 'toastify-react-native/components/ToastManager';
import { Toast } from 'toastify-react-native';

const UpdateHospitalForm = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { selectedHospital, loading, error } = useSelector((state: RootState) => state.hospital);

  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchHospitalById(id as string));
    }
   
  }, [id]);

  useEffect(() => {
    if (selectedHospital) {
      setPhone(selectedHospital.phone || '');
      setStreet(selectedHospital.address?.street || '');
      setCity(selectedHospital.address?.city || '');
      setCountry(selectedHospital.address?.country || '');
      setWebsite(selectedHospital.website || '');
      setImage(selectedHospital.image || '');
    }
  }, [selectedHospital]);

  const handleUpdate = async () => {
    if (!id) {
      Alert.alert("Error", "Invalid hospital ID");
      return;
    }

    try {
      await dispatch(updateHospitalProfile({
        id: id as string,
        data: {
          phone,
          website,
          image,
          address: {
            street,
            city,
            country,
          },
        },
      })).unwrap();

      Toast.success( "Profile updated successfully");
      router.push(`/hospital/${id}`);
    } catch (error: any) {
      Toast.error("Error", error?.message || "Something went wrong");
    }
  };

  if (loading) return <Text className="text-center text-lg mt-4 text-blue-600 font-medium">Loading hospital data...</Text>;
  if (error) return <Text className="text-red-500 text-center mt-4 font-semibold">Error: {error}</Text>;
  if (!selectedHospital) return <Text className="text-center mt-4 text-gray-500">No hospital found</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text className="text-xl font-bold mb-4 text-center">Edit Hospital Profile</Text>

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

      <Text className="text-base mb-1">Image URL</Text>
      <TextInput
        value={image}
        onChangeText={setImage}
        placeholder="Enter image URL"
        className="border p-3 rounded mb-4"
      />

      <TouchableOpacity
        onPress={handleUpdate}
        className="bg-blue-600 rounded p-3 mt-4"
      >
        <Text className="text-white text-center font-semibold">Update Profile</Text>
      </TouchableOpacity>
      <ToastManager />
    </ScrollView>
  );
};

export default UpdateHospitalForm;
