import { resetPassword } from "@/redux/reducers/authSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const ResetPassword = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
  const { loading, resetMessage, error } = useSelector((state:RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    if (!email || !newPassword) {
      Alert.alert("Error", "Please enter both email and new password.");
      return;
    }
  
    try {
      await dispatch(resetPassword({ email, newPassword })).unwrap();
      Alert.alert("Success", "Password reset successfully");
      router.push("/(Auth)/signinAuth");
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Something went wrong");
    }
  };
  

  return (
    <View className="flex-1 justify-center bg-white px-5">
      <Text className="text-2xl font-bold text-center mb-6">Reset Password</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-base"
      />

      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        className="border border-gray-300 rounded-md px-4 py-3 mb-4 text-base"
      />

      <TouchableOpacity
        onPress={handleReset}
        disabled={loading}
        className={`bg-blue-500 rounded-md py-3 items-center ${loading ? "opacity-50" : ""}`}

      >
        <Text className="text-white text-base font-medium">Reset Password</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator className="mt-4" />}
      {resetMessage && <Text className="text-green-600 text-center mt-4">{resetMessage}</Text>}
      {error && <Text className="text-red-500 text-center mt-4">{error}</Text>}
    </View>
  );
};

export default ResetPassword;
