/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import RegistrosScreen from './screens/RegistrosScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { NavigationContainer } from '@react-navigation/native';


const Stack = createNativeStackNavigator();

function RootStack(){
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Registros" component={RegistrosScreen} />
    </Stack.Navigator>
  );
}

function App() {

  return (
    <SafeAreaProvider style={styles.container}>
      <Toaster
        position="top-center"
      />
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: 'none',
  },
});

export default App;
