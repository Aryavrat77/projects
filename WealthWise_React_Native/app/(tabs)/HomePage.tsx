import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, StyleSheet, ImageBackground, StatusBar, SafeAreaView} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TokenRow from '@/components/(app)/TokenRow';
import Section from '@/components/(app)/Section';
import Header from '@/components/(app)/Header';



const HomePage: React.FC = () => {
  const handleMenuPress = () => {
    // Handle menu press (e.g., open drawer navigation)
  };

  const handleProfilePress = () => {
    // Handle profile press (e.g., navigate to profile screen)
  };

  const [searchText, setSearchText] = React.useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Header
        onMenuPress={handleMenuPress}
        onProfilePress={handleProfilePress}
        title="WealthWise"
      />
      <TokenRow />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Stylish Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <Section title="Get Started" />
        <Section title="Popular" />
        <Section title="Selected just for you" />
      </ScrollView>
      
      {/* Earn wealth tokens button */}
      {/* <View style={styles.earnButtonContainer}>
        <LinearGradient
          colors={['#FFF5CC', '#FFD700', '#FFEC8B']}
          style={styles.earnButton}
        >
          <TouchableOpacity style={styles.earnButtonInner}>
            <Text style={styles.earnButtonText}>Earn Wealth Tokens</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#150c25',
    flex: 1,

  },
  searchContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 24,
    backgroundColor: '#1E1E2C',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  searchInput: {
    backgroundColor: '#2E2E40',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFF',
    fontSize: 16,
  },
  earnButtonContainer: {
    position: 'absolute',
    bottom: 55,
    left: '55%',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  earnButton: {
    borderRadius: 24,
    width: 180,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnButtonText: {
    color: '#564949',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default HomePage;
