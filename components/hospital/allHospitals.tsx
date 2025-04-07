import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { fetchAllHospitals } from '@/redux/reducers/hospitalSlice';
import { AppDispatch } from '@/redux/store';

interface AllHospitalsProps {
  searchName?: string; // Accept the name as a prop
}

const AllHospitals: React.FC<AllHospitalsProps> = ({ searchName }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { hospitals, loading, error } = useSelector((state: any) => state.hospital);

  useEffect(() => {
    dispatch(fetchAllHospitals());
  }, [dispatch]);

  if (loading) return <Text className="text-center text-lg mt-4">Loading...</Text>;
  if (error) return <Text className="text-red-500 text-center mt-4">Error: {error}</Text>;

  // Sort hospitals alphabetically by name (case insensitive)
  const sortedHospitals = [...hospitals].sort((a, b) =>
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
  );

  // Filter hospitals by search name (if provided)
  const filteredHospitals = searchName
    ? sortedHospitals.filter(hospital =>
        hospital.name.toLowerCase().includes(searchName.toLowerCase())
      )
    : sortedHospitals;

  return (
    <View className="flex-1 p-4 bg-gray-100 w-full">
      {filteredHospitals.length === 0 ? (
        <Text className="text-center text-gray-500">No hospitals found.</Text>
      ) : (
        <FlatList
          data={filteredHospitals}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white p-4 rounded-xl mb-4 shadow-md"
              onPress={() => router.push({ pathname: "/hospital/[id]", params: { id: item._id } })}
            >
              <Text className="text-xl font-semibold text-gray-800">{item.name}</Text>
              <Text className="text-sm text-gray-500">{item.email}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default AllHospitals;
