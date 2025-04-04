import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View className='flex-1 items-center justify-center'>
      <Text>Details of user {id} </Text>
    </View>
  );
}
