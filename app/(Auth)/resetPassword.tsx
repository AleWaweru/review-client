import { View, Text } from 'react-native';
import React from 'react';
import ResetPassword from '@/components/auth/resetPassword';

const resetPassword = () => {
  return (
      <View className="flex-1 text-gray-500 items-center justify-center bg-gray-100 ">
      <View className="w-full max-w-md h-full bg-white rounded-2xl shadow-lg py-6">
      <ResetPassword />
      </View>
    </View>
  );
};

export default resetPassword;
