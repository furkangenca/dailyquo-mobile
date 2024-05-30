import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { auth, db } from '../../app/firebase';
import { Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons'; // Gerekli ikonları içe aktar

const background = require('../../assets/images/home.jpg');

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignup = () => {
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;
        db.collection('users').doc(uid).set({
          uid: uid,
          name: name,
          email: email,
        });
        console.log('Kullanıcı kaydedildi:', email);
        navigation.navigate('Login');
      })
      .catch((error) => {
        setError(error.message);
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={background} style={styles.imageBackground}>

        <View style={styles.dailyquoContainer}>
          <Text style={styles.dailyquoText}>Hesap Oluşturun</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="İsim"
              placeholderTextColor="rgb(169,169,169)"
            />
            <MaterialIcons name="person" size={20} color="white" style={styles.icon} />

          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="rgb(169,169,169)"
            />
            <MaterialIcons name="email" size={20} color="white" style={styles.icon} />

          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Şifre"
              placeholderTextColor="rgb(169,169,169)"
              secureTextEntry
            />
            <MaterialIcons name="lock" size={20} color="white" style={styles.icon} />

          </View>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Şifreyi Tekrar Girin"
              placeholderTextColor="rgb(169,169,169)"
              secureTextEntry
            />
            <MaterialIcons name="lock" size={20} color="white" style={styles.icon} />

          </View>
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.buttonContainer}>
            <Pressable style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>Hesap Oluştur</Text>
            </Pressable>
          </View>

          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Entypo name="chevron-left" size={24} color="white" />
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
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  dailyquoContainer: {
    top: 115,
    alignItems: 'center',
  },
  dailyquoText: {
    fontSize: 43,
    color: 'white',
    fontFamily: 'AbrilFatface_400Regular',
    bottom: 30,
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
    marginTop: 270,
    marginBottom: 20,
    padding: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginBottom: 14,
    width: 300,
  },
  input: {
    flex: 1,
    height: 40,
    padding: 8,
    color: 'white',
  },
  icon: {
    marginRight: 10,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  button: {
    marginTop: 23,
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
  backButton: {
    position: 'absolute',
    top: 330,
    right: 20,
    backgroundColor: 'rgba(169,169,169, 0.2)',
    borderRadius: 50,
    padding: 10,
  },
});
