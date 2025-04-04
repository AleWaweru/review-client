import { View, Text } from "react-native";
import React from "react";
import SignupScreen from "@/components/auth/register";

const userAuth = () => {
  return (
    <View className="flex-1 text-gray-500 items-center justify-center bg-gray-100">
      <View className="w-full  h-full bg-white rounded-2xl shadow-lg ">
        <SignupScreen />
      </View>
    </View>
  );
};

export default userAuth;
