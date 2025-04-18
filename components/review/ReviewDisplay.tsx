import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchReviews } from "@/redux/reducers/reviewSlice";
import { Review } from "@/types/review";

const ReviewDisplay = ({ hospitalId }: { hospitalId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, loading, error } = useSelector(
    (state: RootState) => state.reviews
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const currentLoggedInUser = user?.name;

  useEffect(() => {
    dispatch(fetchReviews(hospitalId));
  }, [dispatch]);

  const renderStars = (selectedRating: number) => (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= selectedRating ? "star" : "star-outline"}
          size={20}
          color={star <= selectedRating ? "#facc15" : "#9ca3af"}
        />
      ))}
    </View>
  );

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const getRatingComment = (avg: number) => {
    if (avg >= 4.5) return "Excellent";
    if (avg >= 3.5) return "Good";
    if (avg >= 2.5) return "Average";
    if (avg > 0) return "Poor";
    return "No ratings yet";
  };

  return (
    <View className="mt-6">
      <Text className="text-lg font-bold text-gray-800 mb-1">
        Hospital Rating
      </Text>
      <View className="flex-row items-center space-x-2 mb-2">
        {renderStars(Math.round(averageRating))}
        <Text className="text-gray-800 font-medium">{averageRating.toFixed(1)} / 5</Text>
        <Text className="text-gray-600">({getRatingComment(averageRating)})</Text>
      </View>

      <Text className="text-lg font-bold text-gray-800 mb-2">Users Review</Text>

      {loading ? (
        <ActivityIndicator color="#2563eb" />
      ) : error ? (
        <Text className="text-red-500">{error}</Text>
      ) : reviews.length === 0 ? (
        <Text className="text-gray-500">No reviews yet.</Text>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item: Review) => item._id || ""}
          renderItem={({ item }) => (
            <View className="border-t border-gray-200 py-3">
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-gray-800 font-medium">{currentLoggedInUser}</Text>
                <Text className="text-gray-500 text-xs">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "Unknown date"}
                </Text>
              </View>
              <View className="flex-row items-center mb-1">
                {renderStars(item.rating)}
              </View>
              <Text className="text-gray-700">{item.text}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ReviewDisplay;
