// investing/investingmodule.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import CoinButton from '@/components/(app)/CoinButton';
import { useRouter } from 'expo-router';

const InvestingModule: React.FC = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const handlePress = (coin: string) => {
    console.log('Pressed:', coin);
    router.push(`modulelist/Investing/coin-${coin}/Page1`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButtonContainer}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.moduleTitle}>Module 1, Section 1</Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Basics of Investing: Earning with time</Text>
        <ScrollView contentContainerStyle={styles.contentContainer}>
        <CoinButton coinSymbol="$" onPress={() => handlePress('IntroInvesting')} />
        <CoinButton coinSymbol="€" onPress={() => handlePress('PowerOfCompounding')} />
        <CoinButton coinSymbol="₹" onPress={() => handlePress('UnderstandingStockMarket')} />
        <CoinButton coinSymbol="£" onPress={() => handlePress('TypesOfStocks')} />
        {/* Add more coins as needed */}
      </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#302F69',
  },
  header: {
    marginTop: 40,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButtonContainer: {
    padding: 8,
  },
  moduleTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  contentContainer: {
    alignItems: 'center',
    padding: 16,
  },
  title: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  pathContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default InvestingModule;