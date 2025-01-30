import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';

const Page1: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
    });
  }, [navigation]);

  const navigateToNextPage = () => {
    router.push(`/modulelist/Investing/coin-IntroInvesting/Page2`);
  };

  const navigateToPreviousPage = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={navigateToPreviousPage}>
        {/* <Image source={require('@/assets/images/back-button-icon.png')} style={styles.backIcon} /> */}
        <Text>Back</Text>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Investing is when you use your money to buy things that can make more money for you. </Text>
      </View>
      <View style={styles.imageContainer}>
        {/* <Image source={require('@/assets/images/investing-image.png')} style={styles.image} /> */}
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
    backgroundColor: '#795695',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  textContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 30,
    marginTop: 80,
    marginBottom: 10,
    marginHorizontal: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 18,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 30, // Adjust this value to move the button up

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

export default Page1;
