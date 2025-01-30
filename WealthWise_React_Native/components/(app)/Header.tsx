import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, GestureResponderEvent, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onMenuPress: (event: GestureResponderEvent) => void;
  onProfilePress: (event: GestureResponderEvent) => void;
  title: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuPress, onProfilePress, title }) => {
  return (
    <View style={styles.header}>
      
      <StatusBar barStyle="light-content" backgroundColor="#fff" hidden={false}/>

      <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
        <Ionicons name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        {/* <Image source={require('@/assets/logo.png')} style={styles.logo} /> */}
        <Text style={styles.title}>{title}</Text>
      </View>

      <TouchableOpacity onPress={onProfilePress} style={styles.iconButton}>
        <Ionicons name="person-circle" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1f0c28',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15, // Increased padding for a larger header
    height: 90, // Explicit height to ensure consistent size
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  iconButton: {
    padding: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  title: {
    fontSize: 35,
    color: '#fff',
    fontFamily: 'DosisBold',
  },
});

export default Header;
