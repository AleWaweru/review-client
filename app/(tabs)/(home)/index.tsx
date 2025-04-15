import { Text, View, TouchableOpacity, TextInput } from "react-native";
import { Link, useRouter, SearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import "../../global.css";
import { logoutUser } from "@/redux/reducers/authSlice";
import Icon from "react-native-vector-icons/MaterialIcons";
import AllHospitals from "@/components/hospital/allHospitals";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "expo-router/build/hooks";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("name") ?? "");
  const [searchLocation, setSearchLocation] = useState(
    params.get("location") ?? ""
  );

  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.replace("/(Auth)/signinAuth");
  };

  const handleSearch = () => {
    router.push(`/?name=${search}&location=${searchLocation}`);
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      {/* Header */}
      <View className="absolute top-0 w-full flex-row justify-between p-4 bg-blue-600">
        <Text className="text-white text-lg font-bold">RateMe</Text>
        {isAuthenticated && (
          <TouchableOpacity onPress={handleLogout}>
            <Text className="text-white">Logout</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View className="flex-row mt-[5rem] mb-2 px-4 w-full max-w-md">
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search hospital by name"
          className="flex-1 border border-gray-300 rounded-l-md p-2"
        />
        <TouchableOpacity
          onPress={handleSearch}
          className="bg-blue-600 p-2 rounded-r-md"
        >
          <Text className="text-white font-bold">Search</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row mb-2 px-4 w-full max-w-md">
        <TextInput
          value={searchLocation}
          onChangeText={setSearchLocation}
          placeholder="Search by city or street"
          className="flex-1 border border-gray-300 rounded-md p-2"
        />
        <TouchableOpacity
          onPress={handleSearch}
          className="bg-blue-600 p-2 rounded-r-md"
        >
          <Text className="text-white font-bold">Search</Text>
        </TouchableOpacity>
      </View>

      {/* Hospital List */}
      <View className="flex-1 text-gray-500 w-full mb-9 items-center justify-center bg-gray-100">
        <View className="w-full max-w-md h-full bg-white py-6">
          <AllHospitals searchName={search} searchLocation={searchLocation} />
        </View>
      </View>

      {/* Footer */}
      <View className="absolute bottom-0 w-full flex-col items-center bg-gray-100 p-4">
        <View className="flex-row justify-around w-full">
          <Link href="/" asChild>
            <TouchableOpacity className="items-center">
              <Icon name="home" size={24} color="blue" />
              <Text className="text-blue-600">Home</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)/profile" asChild>
            <TouchableOpacity className="items-center">
              <Icon name="person" size={24} color="blue" />
              <Text className="text-blue-600">Profile</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)/settings" asChild>
            <TouchableOpacity className="items-center">
              <Icon name="settings" size={24} color="blue" />
              <Text className="text-blue-600">Settings</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {userRole === "admin" && (
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/signupHospital")}
            className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">
              Create Hospital Account
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
