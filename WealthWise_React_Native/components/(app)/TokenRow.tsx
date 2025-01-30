import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Import images
const goldCoin = require('../../assets/images/gold-coin.png');
const diamond = require('../../assets/images/diamond.png');
const flame = require('../../assets/images/flame.png');
const heart = require('../../assets/images/heart.png');

const TokenRow: React.FC = () => {
  const tokens = [
    { uri: goldCoin, id: 1, label: '1.4K' },
    { uri: diamond, id: 2, label: '400' },
    { uri: flame, id: 3, label: '32' },
    { uri: heart, id: 4, label: '5' },
  ];

  const handleTokenPress = (id: number) => {
    console.log(`Token ${id} pressed`);
    // Handle token press action here
  };

  return (
    <View style={styles.container}>
      {tokens.map((token) => (
        <TouchableOpacity key={token.id} onPress={() => handleTokenPress(token.id)} style={styles.button}>
          <LinearGradient
            colors={['#FFF', '#878FD4']}
            start={[0, 0]}
            end={[0, 0.4]}
            style={styles.gradient}
          >
            <Image source={token.uri} style={styles.token} />
            <Text style={styles.label}>{token.label}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const { width } = Dimensions.get('window'); // Get screen width

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align tokens side by side
    marginVertical: 20,
    marginHorizontal: 10,
  },
  button: {
    alignItems: 'center',
    flex: 1, // Ensure each button takes equal space
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: (width - 40) / 4, // Divide screen width by 4 for 4 tokens with some spacing
    height: 50,
    borderRadius: 8,
    marginHorizontal: 5,
    paddingHorizontal: 10,
  },
  token: {
    height: 30,
    width: 30,
    marginRight: 8,
  },
  label: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default TokenRow;
