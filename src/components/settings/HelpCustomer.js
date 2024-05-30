import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts, AbrilFatface_400Regular } from '@expo-google-fonts/abril-fatface'; // April Fatface fontunu içe aktar
import { Entypo } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

const HelpCustomer = () => {
  const [fontsLoaded] = useFonts({ AbrilFatface_400Regular });

  const navigation = useNavigation();

  // Yardım ve geri bildirim için iletişim bilgileri
  const contactEmail = 'furkangenca@hotmail.com';
  const contactText = 'İletişim için ' + contactEmail + ' adresine e-posta gönderebilirsiniz.';

  const handleContact = () => {
    Linking.openURL('mailto:' + contactEmail);
  };

  return (
    <ImageBackground source={require('../../../assets/images/home.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Yardım ve Geri Bildirim</Text>
        <View style={styles.separator} />

        <Text style={styles.content}>
          Uygulamamızla ilgili herhangi bir sorunuz veya geri bildiriminiz mi var? Sorunları çözmek ve
          kullanıcı deneyimini geliştirmek için buradayız.
        </Text>

        <Pressable
          style={styles.button}
          onPress={handleContact}>
          <Text style={styles.buttonText}>İletişim</Text>
        </Pressable>

        <Text style={styles.contactText}>{contactText}</Text>

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
    fontSize: 25,
    fontWeight: 'light',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgb(169,169,169)',
    marginVertical: 10,
  },
  content: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    marginTop: 30,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  contactText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
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

export default HelpCustomer;
