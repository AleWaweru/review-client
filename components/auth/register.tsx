import React from "react";
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
import { registerUser } from "@/redux/reducers/authSlice";
import { useRouter } from "expo-router";
import googleIcon from "../../assets/images/google.png";

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
}

const SignupScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const onSubmit = async (data: SignupFormInputs) => {
    dispatch(registerUser(data))
      .unwrap()
      .then(() => {
        Alert.alert("Success", "User registered successfully");
        router.push("/(Auth)/signinAuth");
      })
      .catch((err) => {
        Alert.alert("Error", err);
      });
  };

  return (
    <View className="flex-1 p-6 justify-center bg-gray-200">
      <Text className="text-2xl font-bold mb-9 text-center text-gray-800">
        Create Account
      </Text>

      {/* Full Name */}
      <Controller
        control={control}
        name="name"
        rules={{ required: "Name is required" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Full Name"
            className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && (
        <Text className="text-red-500 text-sm">{errors.name.message}</Text>
      )}

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
        <Text className="text-red-500 text-sm">{errors.password.message}</Text>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="bg-blue-600 py-3 my-4 rounded-lg items-center"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold">Sign Up</Text>
        )}
      </TouchableOpacity>
      {/* Signup Link */}
      <TouchableOpacity className="flex flex-row items-center justify-center border border-gray-400 py-3 rounded-lg mb-4 bg-white">
        <Image
          source={googleIcon}
          style={{ width: 32, height: 32 }}
          resizeMode="contain"
        />
        <Text className="ml-2 text-gray-800 font-semibold">
          Sign in with Google
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(Auth)/signinAuth")}>
        <Text className="text-blue-600 px-4 my-5 text-center">
          have an account?
          <Text className="text-blue-800 font-bold ml-4">Sign in</Text>
        </Text>
      </TouchableOpacity>
      {/* Google Sign-In */}

      {error && <Text className="text-red-500 mt-4 text-center">{error}</Text>}
    </View>
  );
};

export default SignupScreen;
