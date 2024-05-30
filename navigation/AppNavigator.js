import React from 'react';
import { View, Image } from 'react-native'; // View bileşenini import et

import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Colors from '../src/constants/Colors';

import LoginScreen from '../src/screens/LoginScreen';
import SignupScreen from '../src/screens/SignupScreen';
import HomeScreen from '../src/screens/HomeScreen';
import FavoritesScreen from '../src/screens/FavoritesScreen';
import ExploreScreen from '../src/screens/ExploreScreen';
import SearchScreen from '../src/screens/SearchScreen';
import SettingsScreen from '../src/screens/SettingsScreen';
import ChangePassword from '../src/components/settings/ChangePassword';
import AccountDetails from '../src/components/settings/AccountDetails';
import ChangeEmail from '../src/components/settings/ChangeEmail';
import Quotes from '../src/components/Quotes';
import Authors from '../src/components/Authors';
import PrivacyPolicy from '../src/components/settings/PrivacyPolicy';
import HelpCustomer from '../src/components/settings/HelpCustomer';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="DailyQuo"
      activeColor= 'white'
      inactiveColor="gray"
      barStyle={{ backgroundColor: Colors.dark2 }}
      >
      <Tab.Screen
        name="DailyQuo"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../assets/icons/dailyquo_logo.png')}
              style={{ width: 40, height: 40 }}
            />
          ),
          tabBarLabel: 'DailyQuo'
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../assets/icons/kesfet.png')}
              style={{ width: 32, height: 32 }}
            />
          ),
          tabBarLabel: 'Keşfet'
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../assets/icons/ara.png')}
              style={{ width: 32, height: 32 }}
            />
          ),
          tabBarLabel: 'Ara'
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../assets/icons/favori.png')}
              style={{ width: 32, height: 32 }}
            />
          ),
          tabBarLabel: 'Favoriler'
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('../assets/icons/setting.png')}
              style={{ width: 32, height: 32 }}
            />
          ),
          tabBarLabel: 'Ayarlar'
        }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false ,gestureEnabled: false }} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
      <Stack.Screen name="AccountDetails" component={AccountDetails} options={{ headerShown: false }} />
      <Stack.Screen name="ChangeEmail" component={ChangeEmail} options={{ headerShown: false }} />
      <Stack.Screen name="Quotes" component={Quotes} options={{ headerShown: false }} />
      <Stack.Screen name="Authors" component={Authors} options={{ headerShown: false }} />
      <Stack.Screen name="Privacy" component={PrivacyPolicy} options={{ headerShown: false }} />
      <Stack.Screen name="Help" component={HelpCustomer} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default AppNavigator;
