import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { fetchAllHospitals } from "@/redux/reducers/hospitalSlice";
import { AppDispatch, RootState } from "@/redux/store";

interface AllHospitalsProps {
  searchName?: string;
  searchLocation?: string;
}

const AllHospitals: React.FC<AllHospitalsProps> = ({
  searchName,
  searchLocation,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { hospitals, loading, error } = useSelector(
    (state: RootState) => state.hospital
  );

  useEffect(() => {
    dispatch(fetchAllHospitals());
  }, [dispatch]);

  if (loading)
    return <Text className="text-center text-lg mt-4">Loading...</Text>;

  if (error)
    return (
      <Text className="text-red-500 text-center mt-4">Error: {error}</Text>
    );

  const sortedHospitals = [...hospitals].sort((a, b) =>
    a.name.localeCompare(b.name, "en", { sensitivity: "base" })
  );

  const filteredHospitals = sortedHospitals.filter((hospital) => {
    const nameMatch = searchName
      ? hospital.name.toLowerCase().includes(searchName.toLowerCase())
      : true;

    const locationMatch = searchLocation
      ? hospital.location?.toLowerCase().includes(searchLocation.toLowerCase())
      : true;

    return nameMatch && locationMatch;
  });

  return (
    <View className="flex-1 p-4 bg-gray-100 mb-[6rem] w-full">
      {filteredHospitals.length === 0 ? (
        <Text className="text-center text-gray-500">No hospitals found.</Text>
      ) : (
        <FlatList
          data={filteredHospitals}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="bg-white p-4 rounded-xl mb-2 shadow-md"
              onPress={() =>
                router.push({
                  pathname: "/hospital/[id]",
                  params: { id: item._id },
                })
              }
            >
              <Text className="text-xl font-semibold text-gray-800">
                {item.name}
              </Text>
              <Text className="text-sm text-gray-600">
                {item.location || "Location not available"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default AllHospitals;
