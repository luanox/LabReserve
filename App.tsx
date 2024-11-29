import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import LabSelection from './src/screens/LabSelection';
import MyReservations from './src/screens/MyReservations';
import { initDatabase } from './src/database/Database';
import CreateUser from './src/screens/CreateUser';

const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Certifique-se de que todos os filhos são Stack.Screen */}
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={Home} options={{ title: 'LabReserve' }} />
        <Stack.Screen name="LabSelection" component={LabSelection} options={{ title: 'Escolha de Laboratório' }} />
        <Stack.Screen name="MyReservations" component={MyReservations} options={{ title: 'Todas as Reservas' }} />
        <Stack.Screen name="CreateUser" component={CreateUser} options={{ title: 'Criar Usuário' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
