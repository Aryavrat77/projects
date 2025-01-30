import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';

const Page3: React.FC = () => {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Hide the header
    });
  }, [navigation]);

  const navigateToPreviousPage = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={navigateToPreviousPage}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Real-life cenarios</Text>

        {/* Real-life Scenario 1 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Real Estate Investment</Text>
          <Text style={styles.paragraph}>
            Imagine you invest $100,000 in real estate, and it appreciates at a rate of 7% annually. The value of your investment will grow significantly over time due to compounding. After 10 years, the value of your investment would grow to:
          </Text>
          <Text style={styles.boldText}>~ $196,715</Text>
          <Text style={styles.paragraph}>
            But after 30 years, the compounding effect becomes even more powerful, and your investment could grow to:
          </Text>
          <Text style={styles.boldText}>~ $761,225</Text>
          <Text style={styles.paragraph}>
            Time plays a crucial role in compounding, and with longer holding periods, the returns grow exponentially.
          </Text>
        </View>

        {/* Real-life Scenario 2 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Stock Market Investment</Text>
          <Text style={styles.paragraph}>
            If you invest $10,000 in the stock market with an average annual return of 8%, your investment would double in about 9 years. Here's how it compounds over time:
          </Text>
          <Text style={styles.boldText}>After 10 years: ~$21,589</Text>
          <Text style={styles.boldText}>After 20 years: ~$46,610</Text>
          <Text style={styles.boldText}>After 30 years: ~$100,627</Text>
          <Text style={styles.paragraph}>
            The longer you leave your money invested, the greater the impact of compounding, allowing you to achieve significant growth over time.
          </Text>
        </View>

        {/* Real-life Scenario 3 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Retirement Savings</Text>
          <Text style={styles.paragraph}>
            Starting early is key to maximizing compounding for retirement savings. Consider the difference between starting to save at age 25 versus age 35. If you save $500 monthly with a 6% return, here’s how much you’ll have by age 65:
          </Text>
          <Text style={styles.boldText}>Starting at 25: ~$766,752</Text>
          <Text style={styles.boldText}>Starting at 35: ~$390,216</Text>
          <Text style={styles.paragraph}>
            By starting early, your savings have more time to grow, resulting in significantly higher returns at retirement.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            The examples above show how powerful compounding can be over long periods. Starting early, being consistent, and letting your investments grow over time are the keys to building wealth.
          </Text>
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={() => router.replace(`/modulelist/Investing/InvestingModule`)}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2E1B4B', // Dark purple background to match the theme
  },
  scrollContainer: {
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 18,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  section: {
    backgroundColor: '#4B3065', // Light purple background for sections
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F3E5AB',
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
  },
  boldText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700', // Golden color for key figures
    textAlign: 'center',
  },
  footer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#382657',
    borderRadius: 10,
  },
  footerText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#FF8C00', // Orange color for the Next button
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Page3;
