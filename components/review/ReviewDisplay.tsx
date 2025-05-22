import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchReviews } from "@/redux/reducers/reviewSlice";

const REVIEWS_PER_PAGE = 3;

const ReviewDisplay = ({ hospitalId }: { hospitalId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, loading, error } = useSelector(
    (state: RootState) => state.reviews
  );

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchReviews(hospitalId));
  }, [dispatch, hospitalId]);

  const renderStars = (rating: number) => (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= rating ? "star" : "star-outline"}
          size={20}
          color={star <= rating ? "#facc15" : "#9ca3af"}
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

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const startIndex = (currentPage - 1) * REVIEWS_PER_PAGE;
  const paginatedReviews = reviews.slice(
    startIndex,
    startIndex + REVIEWS_PER_PAGE
  );

  return (
    <View className="mt-6">
      <Text className="text-lg font-bold text-gray-800 mb-1">
        Hospital Rating
      </Text>
      <View className="flex-row items-center space-x-2 mb-2">
        {renderStars(Math.round(averageRating))}
        <Text className="text-gray-800 font-medium">
          {averageRating.toFixed(1)} / 5
        </Text>
        <Text className="text-gray-600">
          ({getRatingComment(averageRating)})
        </Text>
      </View>

      <Text className="text-lg font-bold text-gray-800 mb-2">Users Review</Text>

      {loading ? (
        <ActivityIndicator color="#2563eb" />
      ) : error ? (
        <Text className="text-red-500">{error}</Text>
      ) : reviews.length === 0 ? (
        <Text className="text-gray-500">No reviews yet.</Text>
      ) : (
        <View>
          {paginatedReviews.map((item) => (
            <View key={item._id} className="border-t border-gray-200 py-3">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-800 font-medium">
                  {item.user?.name || "Anonymous"}
                </Text>
                <Text className="text-gray-500 text-xs">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString()
                    : "Unknown date"}
                </Text>
              </View>
              <View className="flex-row mb-1">{renderStars(item.rating)}</View>
              <Text className="text-gray-700">{item.text}</Text>
            </View>
          ))}

          {reviews.length > REVIEWS_PER_PAGE && (
            <View className="flex-row justify-between items-center mt-4">
              <TouchableOpacity
                disabled={currentPage === 1}
                onPress={() => setCurrentPage((prev) => prev - 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 ? "bg-gray-300" : "bg-blue-500"
                }`}
              >
                <Text className="text-white">Previous</Text>
              </TouchableOpacity>

              <Text className="text-gray-700">
                Page {currentPage} of {totalPages}
              </Text>

              <TouchableOpacity
                disabled={currentPage === totalPages}
                onPress={() => setCurrentPage((prev) => prev + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages ? "bg-gray-300" : "bg-blue-500"
                }`}
              >
                <Text className="text-white">Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default ReviewDisplay;
