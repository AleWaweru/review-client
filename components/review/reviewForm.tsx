import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator } from "react-native";
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
      onClose();
    } catch (error) {
      console.error("Review submission failed:", error);
    }
  };

  const renderStars = (selectedRating: number) => (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Ionicons
          key={star}
          name={star <= selectedRating ? "star" : "star-outline"}
          size={28}
          color={star <= selectedRating ? "#facc15" : "#9ca3af"}
          onPress={() => setRating(star)}
        />
      ))}
    </View>
  );

  return (
    <View>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          marginBottom: 8,
          color: "#1f2937",
        }}
      >
        Leave a Review
      </Text>

      <Text style={{ marginBottom: 4, color: "#374151" }}>Your Rating:</Text>
      {renderStars(rating)}

      <TextInput
        placeholder="Write your review here..."
        value={reviewText}
        onChangeText={setReviewText}
        multiline
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 6,
          padding: 12,
          marginTop: 12,
          marginBottom: 12,
          height: 100,
          color: "#1f2937",
        }}
      />

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={{ marginVertical: 10 }}
        />
      ) : (
        <Button
          onPress={handleSubmitReview}
          title="Submit Review"
          color="#2563eb"
        />
      )}
    </View>
  );
};

export default ReviewForm;
