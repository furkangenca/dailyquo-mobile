import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Pressable } from 'react-native';
import { auth, db } from '../../../app/firebase';
import { useNavigation } from '@react-navigation/native';
import {  Entypo } from '@expo/vector-icons';

const ChangeEmail = () => {
  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigation = useNavigation();

  const handleChangeEmail = async () => {
    if (newEmail !== confirmEmail) {
      setError('Email adresleri uyuşmuyor');
      return;
    }

    try {
      const user = auth.currentUser;
      await user.updateEmail(newEmail);
      await db.collection('users').doc(user.uid).update({ email: newEmail });
      setSuccess('Email başarıyla değiştirildi!');
      setNewEmail('');
      setConfirmEmail('');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <ImageBackground source={require('../../../assets/images/home.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Email Değiştir</Text>
        <View style={styles.separator} />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="Yeni Email"
            placeholderTextColor="white"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={confirmEmail}
            onChangeText={setConfirmEmail}
            placeholder="Yeni Email (Tekrar)"
            placeholderTextColor="white"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        {success && <Text style={styles.success}>{success}</Text>}
        <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
          <Text style={styles.buttonText}>Emaili Güncelle</Text>
        </TouchableOpacity>
        
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
    marginBottom:140,
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

export default ChangeEmail;
