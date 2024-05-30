import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import AppNavigator from '../navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaView style = {styles.container}>
        <StatusBar style="dark" backgroundColor="#FF0000" />

      <AppNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  }
})
