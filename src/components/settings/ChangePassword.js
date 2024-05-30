import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ImageBackground } from 'react-native';
import { auth } from '../../../app/firebase';
import { useNavigation } from '@react-navigation/native';
import firebase from 'firebase/app';
import {  Entypo } from '@expo/vector-icons';


const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigation = useNavigation();

  const reauthenticate = (currentPassword) => {
    const user = auth.currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Şifreler uyuşmuyor');
      return;
    }

    try {
      await reauthenticate(currentPassword);
      const user = auth.currentUser;
      await user.updatePassword(newPassword);
      setSuccess('Şifre başarıyla değiştirildi!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ImageBackground source={require('../../../assets/images/home.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Şifre Değiştir</Text>
        <View style={styles.separator} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Mevcut Şifre"
            placeholderTextColor="white"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Yeni Şifre"
            placeholderTextColor="white"
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Yeni Şifre (Tekrar)"
            placeholderTextColor="white"
            secureTextEntry
          />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        {success && <Text style={styles.success}>{success}</Text>}
        <Pressable style={styles.button} onPress={handleChangePassword}>
          <Text style={styles.buttonText}>Şifreyi Güncelle</Text>
        </Pressable>
        
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={24} color="white" />
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
    fontSize: 27,
    fontWeight: '300', // 'light' yerine '300' kullanılmalı
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 10,
    marginBottom: 170,
  },
  inputContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 300,
    marginBottom: 12,
    padding: 8,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    color: 'white',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 40,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  success: {
    color: 'green',
    marginBottom: 12,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    marginTop: 740,
    right: 20,
    backgroundColor: 'rgba(169,169,169, 0.2)',
    borderRadius: 50,
    padding: 10,
  },
});

export default ChangePassword;
