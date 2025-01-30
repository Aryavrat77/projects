import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

type CoinButtonProps = {
  coinSymbol: string;
  onPress: () => void;
};

const CoinButton: React.FC<CoinButtonProps> = ({ coinSymbol, onPress }) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        style={styles.coinButton}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Text style={styles.coinText}>{coinSymbol}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  coinButton: {
    backgroundColor: '#FFD700',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
  },
  coinText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CoinButton;
