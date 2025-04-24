import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { submitReview } from "@/redux/reducers/reviewSlice";

interface ReviewFormProps {
  hospitalId: string;
  onClose: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ hospitalId, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.reviews);
  const { user } = useSelector((state: RootState) => state.auth);

  const [rating, setRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");

  const handleSubmitReview = async () => {
    if (!reviewText || rating === 0 || !user?._id) return;

    try {
      await dispatch(
        submitReview({
          hospitalId,
          rating,
          text: reviewText,
          user: {
            _id: user._id,
            name: user.name,
          },
        })
      ).unwrap();

      setReviewText("");
      setRating(0);
      onClose(); // Optional: close the form on successful submit
    } catch (error) {
      console.error("Review submission failed:", error);
    }
  };

  const renderStars = (selectedRating: number) => (
    <View className="flex-row">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => setRating(star)}
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
    <View>
      <Text className="text-lg font-bold mb-2 text-gray-800">
        Leave a Review
      </Text>

      <Text className="mb-1 text-gray-700">Your Rating:</Text>
      {renderStars(rating)}

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
    </View>
  );
};

export default ReviewForm;
