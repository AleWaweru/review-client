import { View, Text } from "react-native";
import React from "react";
import LoginScreen from "@/components/auth/login";

const userSignIn = () => {
  return (
    <View className="flex-1 text-gray-500 items-center justify-center bg-gray-100 ">
      <View className="w-full max-w-md h-full bg-white rounded-2xl shadow-lg py-6">
        <LoginScreen />
      </View>
    </View>
  );
};

export default userSignIn;
