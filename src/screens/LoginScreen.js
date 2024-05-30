import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { auth } from '../../app/firebase';
import Colors from '../constants/Colors';
import { useFonts, AbrilFatface_400Regular } from '@expo-google-fonts/abril-fatface';
import { MaterialIcons } from '@expo/vector-icons'; // MaterialIcons kütüphanesinden ikonu içe aktar

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync(); // SplashScreen'i gizlememek için

export default function LoginScreen({ navigation }) {
  const [fontsLoaded] = useFonts({ AbrilFatface_400Regular });
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // Fontlar yüklendiğinde SplashScreen'i gizle
    }
  }, [fontsLoaded]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  if (!fontsLoaded) {
    return null; // Fontlar yüklenene kadar herhangi bir şey render etme
  }

  const handleSignIn = () => {
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Giriş başarılı:', email);
        navigation.navigate('HomeTabs'); // Giriş başarılıysa home ekranına yönlendir
      })
      .catch((error) => {
        setError(error.message); // Hata durumunda hatayı ayarla
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../assets/images/home.jpg')} style={styles.imageBackground}>
        <View style={styles.dailyquoContainer}>
          <Text style={styles.dailyquoText}>DailyQuo</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgb(169,169,169)"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <MaterialIcons name="email" size={21} color='white' style={styles.searchIcon} />
          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              placeholderTextColor="rgb(169,169,169)"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <MaterialIcons name="lock" size={21} color="white" style={styles.searchIcon} />

          </View>
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
        <Text style={styles.forgotPasswordText}>Şifrenizi mi Unuttunuz?</Text>

        <Pressable onPress={handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </Pressable>

        <View style={styles.signupContainer}>
          <Text style={styles.signText}>Hesabınız yok mu?</Text>
          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupText}> Hesap oluşturun.</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    right: 0,
    marginRight: 10,
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  dailyquoContainer: {
    top: 115,
    alignItems: 'center',
  },
  dailyquoText: {
    fontSize: 55,
    color: 'white',
    fontFamily: 'AbrilFatface_400Regular',
    bottom: 40,
    marginBottom: 60,
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    marginTop: 30,
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 250,
    padding: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginBottom: 12,
    width: 310,

  },
  input: {
    flex: 1,
    height: 45,
    padding: 5,
    color: 'white',
  },
  forgotPasswordText: {
    color: 'gray',
    marginBottom: 40,
    textAlign: 'right',
    marginEnd: 60,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: 'white',
    marginLeft: 120,
    marginRight: 120,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },
  signText: {
    color: 'white',
    fontSize: 14,
  },
  signupText: {
    color: 'gray',
    fontSize: 15,
    fontWeight: 'bold',
  },
  error: {
    fontSize: 10,
    color: 'red',
  },
});
