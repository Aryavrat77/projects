import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import { Video } from 'expo-av';

const Page2: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
    });
  }, [navigation]);

  const navigateToNextPage = () => {
    router.push(`/modulelist/Investing/coin-PowerOfCompounding/Page3`);
  };

  const navigateToPreviousPage = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={navigateToPreviousPage}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>The Power of Compounding</Text>
      {/* Video Section */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          style={styles.video}
          source={require('../../../../assets/videos/Compound_Interest.mp4')} // Adjust the path as per your folder structure
          useNativeControls
          isLooping
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={navigateToNextPage}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#957DAD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  videoContainer: {
    width: '100%',
    height: 300, // Adjust the height as needed
    marginTop: 40,
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Page2;
