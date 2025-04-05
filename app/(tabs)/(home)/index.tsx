import { Text, View, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store"; 
import "../../global.css";
import { logoutUser } from "@/redux/reducers/authSlice";
import Icon from "react-native-vector-icons/MaterialIcons"; 

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);
  const userRole = useSelector((state: RootState) => state.auth.user?.role); // 👈 Get user role

  const handleLogout = () => {
    dispatch(logoutUser());
    router.replace("/(Auth)/signinAuth");
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

      <Text className="text-blue-800 mt-16">Welcome Again.</Text>

      {/* Footer with Icons */}
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

        {/* Conditionally Render Hospital Account Creation Link */}
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
