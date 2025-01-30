import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryLegend, VictoryTooltip, VictoryVoronoiContainer } from 'victory-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

const Page1: React.FC = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [contributionsData, setContributionsData] = useState<{x: number, y: number}[]>([]);
  const [futureValueData, setFutureValueData] = useState<{x: number, y: number}[]>([]);

  const router = useRouter();
  const navigation = useNavigation();

  const calculateCompoundInterest = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100; // Convert percentage to decimal
    const t = parseInt(years);
    const n = 1; // Compound annually

    let contributions = [];
    let futureValue = [];

    let totalContributions = 0;

    for (let i = 0; i <= t; i++) {
      totalContributions += P;
      const A = P * Math.pow(1 + r / n, n * i); // Future value formula
      contributions.push({ x: i, y: totalContributions });
      futureValue.push({ x: i, y: A });
    }

    setContributionsData(contributions);
    setFutureValueData(futureValue);
  };

  const navigateToNextPage = () => {
    router.push('/modulelist/Investing/coin-PowerOfCompounding/Page2');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Compound Interest Simulator</Text>
        
        {/* Input Fields */}
        <TextInput
          placeholder="Initial Principal (P)"
          value={principal}
          onChangeText={setPrincipal}
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Annual Interest Rate (%)"
          value={rate}
          onChangeText={setRate}
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Number of Years (t)"
          value={years}
          onChangeText={setYears}
          keyboardType="numeric"
          style={styles.input}
          placeholderTextColor="#888"
        />

        {/* Calculate Button */}
        <TouchableOpacity style={styles.button} onPress={calculateCompoundInterest}>
          <Text style={styles.buttonText}>Calculate</Text>
        </TouchableOpacity>

        {/* Victory Chart */}
        {futureValueData.length > 0 && (
          <VictoryChart
            theme={VictoryTheme.material}
            
            style={{ parent: { backgroundColor: '#302F69', borderRadius: 10 } }}
          >
            {/* Legend */}
            <VictoryLegend
              x={125}
              y={10}
              orientation="horizontal"
              gutter={20}
              style={{ border: { stroke: "none" }, labels: { fontSize: 12, fill: "#FFF" } }}
              data={[
                { name: "Future Value", symbol: { fill: "#FF6347" } }, // Tomato Red
                { name: "Total Contributions", symbol: { fill: "#4682B4" } }, // Steel Blue
              ]}
            />

            {/* Future Value Line */}
            <VictoryLine
              data={futureValueData}
              style={{
                data: { stroke: "#FF6347", strokeWidth: 3 }, // Tomato Red
              }}
            />

            {/* Total Contributions Line */}
            <VictoryLine
              data={contributionsData}
              style={{
                data: { stroke: "#4682B4", strokeWidth: 3 }, // Steel Blue
              }}
            />
          </VictoryChart>
        )}

        {/* Next Button */}
        {futureValueData.length > 0 && (
          <TouchableOpacity style={styles.nextButton} onPress={navigateToNextPage}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1033', // Darker background
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#1A1033', // Ensure ScrollView background matches container
    flexGrow: 1,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2E2E40',
    width: '100%',
    marginVertical: 10,
    padding: 12,
    borderRadius: 8,
    color: '#FFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%',
    marginVertical: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#FFD700', // Gold color
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '60%',
    marginTop: 20,
  },
  nextButtonText: {
    color: '#1A1033', // Dark text for contrast
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Page1;
