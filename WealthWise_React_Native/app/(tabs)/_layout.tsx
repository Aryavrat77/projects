import { Tabs } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Tabs
      screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      tabBarInactiveTintColor: '#A7ACC9',
      tabBarStyle: {
        backgroundColor: '#1f0c28', // Set your desired color and transparency here
        position: 'absolute', // Ensure it is positioned absolutely
          left: 0,
          right: 0,
          elevation: 0, // Remove shadow on Android
          borderTopWidth: 0, // Remove border on top 
      },
      headerShown: false,
      }}>
        <Tabs.Screen
          name="HomePage"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: 'Leaderboard',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'trophy' : 'trophy-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="quests"
          options={{
            title: 'Quests',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'list' : 'list-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="shop"
          options={{
            title: 'Shop',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#150c25', // Ensure the background color matches your desired color
  },

});