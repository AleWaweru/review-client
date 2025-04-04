import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "expo-router";
import googleIcon from "../../assets/images/google.png";
import { loginUser } from "@/redux/reducers/authSlice";

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState<"user" | "hospital" | null>(
    null
  );

  const onSubmit = async (data: LoginFormInputs) => {
    if (!selectedRole) {
      Alert.alert("Role Selection", "Please select a role first.");
      return;
    }

    try {
      // Dispatch the login action
      await dispatch(loginUser(data)).unwrap(); // unwrap() allows you to access the resolved or rejected value directly
      Alert.alert("Success", "User logged in successfully");
      // Redirect to home page after successful login
      router.push("/");
    } catch (error) {
      // Handle the error if login fails
      console.error("Login failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      Alert.alert("Login Error", errorMessage);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      "Google Login",
      "Google authentication will be implemented here."
    );
  };

  return (
    <View className="flex-1 p-6 justify-center bg-gray-200">
      {/* Role Selection */}
      {selectedRole === null ? (
        <View>
          <TouchableOpacity
            onPress={() => setSelectedRole("user")}
            className="bg-blue-500 py-3 rounded-lg items-center mb-4"
          >
            <Text className="text-white font-bold">User Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedRole("hospital")}
            className="bg-green-500 py-3 rounded-lg items-center"
          >
            <Text className="text-white font-bold">Hospital Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(Auth)/signupAuth")}>
            <Text className="text-red-400 font-bold ml-4 mt-6 text-center">
              ← Go Back to Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text className="text-center text-lg text-2xl font-semibold mb-4">
            Login {selectedRole === "user" ? "User" : "Hospital Account"}
          </Text>

          {/* Email */}
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Email"
                keyboardType="email-address"
                className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500 text-sm">{errors.email.message}</Text>
          )}

          {/* Password */}
          <Controller
            control={control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: { value: 6, message: "At least 6 characters" },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Password"
                secureTextEntry
                className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500 text-sm">
              {errors.password.message}
            </Text>
          )}

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="bg-blue-600 py-3 rounded-lg items-center mb-4"
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Google Sign-In (only for user login) */}
          {selectedRole === "user" && (
            <TouchableOpacity
              onPress={handleGoogleLogin}
              className="flex flex-row items-center justify-center border border-gray-400 py-3 rounded-lg mb-4 bg-white"
            >
              <Image
                source={googleIcon}
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
              />
              <Text className="ml-2 text-gray-800 font-semibold">
                Sign in with Google
              </Text>
            </TouchableOpacity>
          )}

          {/* Back to Role Selection */}
          <TouchableOpacity
            onPress={() => setSelectedRole(null)}
            className="mt-4"
          >
            <Text className="text-center text-red-500">← Go Back</Text>
          </TouchableOpacity>
        </>
      )}

      {error && <Text className="text-red-500 mt-4 text-center">{error}</Text>}
    </View>
  );
};

export default LoginScreen;
