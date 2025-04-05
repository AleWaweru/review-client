import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { createHospital } from "@/redux/reducers/hospitalSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "expo-router";

const CreateHospitalScreen = () => {
    const dispatch = useDispatch<AppDispatch>(); 
     const router = useRouter();

  const navigation = useNavigation();
  const { hospital, loading, error } = useSelector((state:RootState) => state.hospital);
  const { user } = useSelector((state:RootState) => state.auth); 

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user?.role !== "admin") {
      Alert.alert("Access Denied", "Only admins can create hospital accounts.");
      navigation.goBack();
    }
  }, [user]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    dispatch(createHospital(form));
  };

  useEffect(() => {
    if (hospital) {
      Alert.alert("Success", "Hospital account created successfully!"); 
      router.push("/(Auth)/signinAuth"); // Explicitly cast the route name to 'never' if type definitions are strict
    }
  }, [hospital]);

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <Text className="text-2xl font-bold text-center mb-4">Create Hospital Account</Text>
      
      <TextInput
        placeholder="Hospital Name"
        value={form.name}
        onChangeText={(text) => handleChange("name", text)}
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
      />
      
      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
        keyboardType="email-address"
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
      />
      
      <TextInput
        placeholder="Password"
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
      />

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <TouchableOpacity onPress={handleSubmit} className="bg-blue-600 p-3 rounded-lg mt-2">
          <Text className="text-white text-center font-bold">Create Hospital</Text>
        </TouchableOpacity>
      )}

      {error && <Text className="text-red-500 mt-4 text-center">{error}</Text>}
    </View>
  );
};

export default CreateHospitalScreen;