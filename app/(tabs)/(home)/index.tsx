import { Text, View, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // Import RootState type
import "../../global.css";
import { logoutUser } from "@/redux/reducers/authSlice";

export default function Index() {
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token); // Check auth status

  const handleLogout = () => {
    dispatch(logoutUser());
    router.replace("/(Auth)/signinAuth");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      {/* Header with Logout */}
      <View className="absolute top-0 w-full flex-row justify-between p-4 bg-blue-600">
        <Text className="text-white text-lg font-bold">RateMe</Text>
        {isAuthenticated && (
          <TouchableOpacity onPress={handleLogout}>
            <Text className="text-white">Logout</Text>
          </TouchableOpacity>
        )}
      </View>

    
      <Text className="text-blue-800 mt-16">Welcome Again.</Text>

      <View className="absolute bottom-0 w-full flex-row justify-around p-4 bg-gray-100">
        <Link href="/">
          <Text className="text-blue-600">Home</Text>
        </Link>
        <Link href="/(tabs)/profile">
          <Text className="text-blue-600">Profile</Text>
        </Link>
        <Link href="/(tabs)/settings">
          <Text className="text-blue-600">Settings</Text>
        </Link>
      </View>
    </View>
  );
}
