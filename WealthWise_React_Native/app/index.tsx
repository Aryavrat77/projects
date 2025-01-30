import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, ImageBackground, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '@/components/(app)/CustomButton';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, router } from 'expo-router';

const backgroundImage = require('../assets/images/background-image.png');

export default function HomeScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handlePress = () => {
    console.log('Continue with Email button pressed');
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#150c25" hidden={true}/>
      <View style={styles.imageWrapper}>
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.title}>WealthWise</Text>
          </View>
        </ImageBackground>
      </View>
      <View style={styles.content}>
        <Text style={styles.tagline}>
          Become financially savvy!
        </Text>
        <Text style={styles.quote}>
          "Beware of little expenses; a small leak will sink a great ship."
          {'\n'}~ Benjamin Franklin ~
        </Text>
        <LinearGradient
          colors={['#878FD4', '#A7ACC9']}
          start={[0, 0]}
          end={[0, 0.9]}
          style={styles.gradientButton}
        >
          <CustomButton
            title="Continue with Email"
            handlePress={handlePress}
            containerStyles={styles.customButton}
            textStyles={styles.customButtonText}
            isLoading={false}
          />
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#150c25',
  },
  imageWrapper: {
    width: '100%',
    height: '45%',
    overflow: 'hidden', 
    borderRadius: 20,
    marginBottom: -40,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageStyle: {
    borderRadius: 20,
  },
  title: {
    fontSize: 50,
    color: '#291749',
    fontFamily: 'DosisBold',
    marginLeft: 10,
  },
  logoContainer: {
    alignItems: 'center',
    zIndex: 3, 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tagline: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'VarelaRound',
  },
  quote: {
    color: '#ccc',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'VarelaRound',
    lineHeight: 25, // Adjust this value to control the spacing between lines

  },
  gradientButton: {
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
  customButton: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  customButtonText: {
    color: '#150c25',
    fontSize: 20,
    fontFamily: 'PoppinsSemiBold',
    fontWeight: '900', // Extra bold

  },
});
