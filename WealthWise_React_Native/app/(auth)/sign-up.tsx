import React, { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "@/components/(app)/CustomButton";
import FormField from "@/components/(app)/FormField";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "@/configs/FirebaseConfig";

const SignUp = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {
      await createUserWithEmailAndPassword(FIREBASE_AUTH, form.email, form.password);
      Alert.alert("Success", "User signed up successfully");
      router.replace("/sign-in");
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>
          Sign Up to WealthWise
        </Text>

        <FormField
          title="Username"
          value={form.username}
          handleChangeText={(e) => setForm({ ...form, username: e })}
          otherStyles={styles.formField}
          placeholder="e.g., memeLord999"
          titleStyle={styles.formFieldTitle}

        />

        <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e) => setForm({ ...form, email: e })}
          otherStyles={styles.formField}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="e.g., taylorSwiftFan@gmail.com"
          titleStyle={styles.formFieldTitle}

        />

        <FormField
          title="Password"
          value={form.password}
          handleChangeText={(e) => setForm({ ...form, password: e })}
          otherStyles={styles.formField}
          autoCapitalize="none"
          placeholder="********"
          titleStyle={styles.formFieldTitle}
          isPassword={true} // Indicate that this is a password field
        />

        <LinearGradient
          colors={['#878FD4', '#A7ACC9']}
          start={[0, 0]}
          end={[0, 0.9]}
          style={styles.gradientButton}
        >
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles={styles.customButton}
            textStyles={styles.customButtonText}
            isLoading={isSubmitting}
          />
        </LinearGradient>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Have an account already?
          </Text>
          <TouchableOpacity onPress={() => router.replace("/sign-in")}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    backgroundColor: "#150c25",

  },
  innerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 30,
    textAlign: "center",
    fontFamily: "DosisBold",
  },
  formField: {
    marginTop: 20,
  },
  formFieldTitle: {
    color: "#FFFFFF",
    fontFamily: "VarelaRound",
    fontSize: 20,
  },
  customButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  customButtonText: {
    color: '#150c25',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  gradientButton: {
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
  footer: {
    justifyContent: "center",
    paddingTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "VarelaRound",
  },
  link: {
    fontSize: 16,
    fontWeight: "600",
    color: "#A7ACC9",
    fontFamily: "VarelaRound",
    marginLeft: 5,
  },
});

export default SignUp;
