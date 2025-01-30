import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '@/app/(auth)/sign-in';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
