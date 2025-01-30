// ModuleListByModule.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import InvestingModule from './Investing/InvestingModule';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

const ModuleListByModule: React.FC = () => {
  const { module } = useLocalSearchParams();
  const navigation = useNavigation();


  useEffect(() => {
    navigation.setOptions({
      headerShown: false, // Ensure the header is not shown
    });
  }, [navigation]);

  const renderModuleContent = () => {
    switch (module) {
      case 'Investing':
        return <InvestingModule />;
      // Add cases for other modules here
      default:
        return (
          <View style={styles.defaultContainer}>
            <Text style={styles.defaultText}>Module: {module}</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {renderModuleContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#302F69',
  },
  defaultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Add more styles as needed
});

export default ModuleListByModule;
