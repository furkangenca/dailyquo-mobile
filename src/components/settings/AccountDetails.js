import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, Alert } from 'react-native';
import { auth, db } from '../../../app/firebase';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/Colors';

import {  Entypo } from '@expo/vector-icons';


const AccountDetails = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        const userDoc = await db.collection('users').doc(user.uid).get();
        setUserData(userDoc.data());
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Hesabı Sil',
      'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              await db.collection('users').doc(user.uid).delete();
              await user.delete();
              navigation.navigate('Login'); // Assuming there's a SignUp or some other screen to navigate to
            } catch (error) {
              console.error('Error deleting account: ', error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ImageBackground source={require('../../../assets/images/home.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Hesap Ayrıntıları</Text>
        <View style={styles.separator} />
        {userData && (
          <>
            <Text style={styles.label}>İsim</Text>
            <Text style={styles.labeluser}>{userData.name}</Text>
            
            <View style={styles.separatorlabel} /> 

            <Text style={styles.label}>Email</Text>
            <Text style={styles.labeluser}>{userData.email}</Text>
          </>
        )}
        <View style={styles.separator} />
        <Pressable 
          style={styles.button} 
          onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={styles.buttonText}>Şifre Değiştir</Text>
        </Pressable>
        <Pressable 
          style={styles.button} 
          onPress={() => navigation.navigate('ChangeEmail')}>
          <Text style={styles.buttonText}>Email Değiştir</Text>
        </Pressable>

        <Pressable 
          style={[styles.buttondelete]} 
          onPress={handleDeleteAccount}>
          <Text style={styles.buttonTextDelete}>Hesabı Sil</Text>
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
  },
  separatorlabel: {
    height: 0.3,
    backgroundColor: 'white',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  labeluser: {
    fontSize: 15,
    color: 'white',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttondelete: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 25,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
  buttonTextDelete: {
    textAlign: 'center',
    color: Colors.delete,
    fontSize: 18,
    fontWeight: 'bold',
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

export default AccountDetails;
