import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TextStyle, ViewStyle, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For eye icon (install @expo/vector-icons if not done yet)

// FormFieldProps Interface
interface FormFieldProps {
  title: string;
  value: string;
  handleChangeText: (text: string) => void;
  placeholder?: string; // Optional placeholder
  otherStyles?: ViewStyle; // Optional container styles
  titleStyle?: TextStyle; // Optional title styles
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  isPassword?: boolean; // Flag for password fields
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  handleChangeText,
  placeholder = "",
  otherStyles,
  titleStyle,
  keyboardType = "default",
  autoCapitalize = "sentences",
  isPassword = false,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleChangeText}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          secureTextEntry={isPassword && !isPasswordVisible} // Handle password visibility
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"} // Toggle eye icon
              size={20}
              color="#aaa"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 14,
    color: "#000",
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
});

export default FormField;
