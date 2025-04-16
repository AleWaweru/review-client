import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Review } from "@/types/review";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, submitReview } from "@/redux/reducers/reviewSlice";

const ReviewHospital = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { reviews, loading, error } = useSelector(
    (state: RootState) => state.reviews
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const currentLoggedInUser = user?.name;

  const { selectedHospital } = useSelector((state: any) => state.hospital);

  const hospitalId = selectedHospital?._id;

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    dispatch(fetchReviews(hospitalId));
  }, [dispatch]);

  const handleSubmitReview = () => {
    if (!reviewText || rating === 0) return;

    dispatch(
      submitReview({
        hospitalId,
        rating,
        text: reviewText,
        user: user?._id,
      })
    ).then(() => {
      setReviewText("");
      setRating(0);
    });
  };

  const renderStars = (selectedRating: number, set: boolean = false) => (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => set && setRating(star)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={star <= selectedRating ? "star" : "star-outline"}
            size={28}
            color={star <= selectedRating ? "#facc15" : "#9ca3af"}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View className="bg-white p-4 rounded-xl shadow-md mt-4">
      <Text className="text-lg font-bold mb-2 text-gray-800">
        Leave a Review
      </Text>

      <Text className="mb-1 text-gray-700">Your Rating:</Text>
      {renderStars(rating, true)}

      <TextInput
        placeholder="Write your review here..."
        value={reviewText}
        onChangeText={setReviewText}
        multiline
        className="border border-gray-300 rounded-md p-3 mt-3 mb-3 h-24 text-gray-800"
      />

      <TouchableOpacity
        onPress={handleSubmitReview}
        className="bg-blue-600 py-2 rounded-md items-center"
        disabled={loading}
      >
        <Text className="text-white font-medium text-sm">
          {loading ? "Submitting..." : "Submit Review"}
        </Text>
      </TouchableOpacity>

      <View className="mt-6">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          User Reviews
        </Text>

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
                  <Text className="text-gray-800 font-medium">
                    {currentLoggedInUser}
                  </Text>
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
    </View>
  );
};

export default ReviewHospital;
