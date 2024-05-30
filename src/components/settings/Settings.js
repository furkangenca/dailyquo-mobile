import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { useFonts, AbrilFatface_400Regular } from '@expo-google-fonts/abril-fatface'; // April Fatface fontunu içe aktar

import Colors from '../../constants/Colors';

const Settings = () => {
  const [fontsLoaded] = useFonts({AbrilFatface_400Regular});

  const navigation = useNavigation();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <ImageBackground source={require('../../../assets/images/home.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Ayarlar</Text>
        <View style={styles.separator} />
        
        <Pressable 
          style={styles.button} 
          onPress={() => navigation.navigate('AccountDetails')}>
          <Text style={styles.buttonText}>Hesap Ayrıntıları</Text>
        </Pressable>
        
        <View style={styles.separator} />
      
        
        <Pressable style={styles.button} onPress={() => navigation.navigate('Help')}>
          <Text style={styles.buttonText}>Yardım ve geri bildirim</Text>
        </Pressable>
        <View style={styles.separator} />
      
        
        <Pressable style={styles.button} onPress={() => navigation.navigate('Privacy')}>
          <Text style={styles.buttonText}>Gizlilik politikası ve kullanım koşulları</Text>
        </Pressable>
        <View style={styles.separator} />
      
        
        <Pressable style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Çıkış Yap</Text>
        </Pressable>

      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    fontSize: 35,
    fontWeight: 'light',
    color: 'white',
    textAlign: 'flex-start',
    marginBottom: 10,
    fontFamily: 'AbrilFatface_400Regular'
  },
  separator: {
    height: 1,
    backgroundColor: 'rgb(169,169,169)',
    marginVertical: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: 'flex-start',
    color: 'white',
    fontSize: 16,
  },
});

export default Settings;
