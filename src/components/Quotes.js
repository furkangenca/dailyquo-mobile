import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground, Pressable, ScrollView } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors.js';
import { auth, db } from '../../app/firebase';
import { useFonts, PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display'; // April Fatface fontunu içe aktar

export default function Quotes() {
  const [fontsLoaded] = useFonts({PlayfairDisplay_400Regular});

  const route = useRoute();
  const navigation = useNavigation();
  const { quote } = route.params;

  const [favorites, setFavorites] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    checkIfFavorite();
  }, [favorites]);

  const fetchFavorites = async () => {
    try {
      const user = auth.currentUser;
      const uid = user.uid;
      const userDoc = await db.collection('users').doc(uid).get();
      const userData = userDoc.data();
      const userFavorites = userData?.favorites || [];
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Error fetching favorites: ', error);
    }
  };

  const checkIfFavorite = () => {
    if (favorites.some(fav => fav.id === quote.id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  };

  const toggleFavorite = async () => {
    try {
      const user = auth.currentUser;
      const uid = user.uid;
      const userRef = db.collection('users').doc(uid);

      let updatedFavorites;
      if (favorites.some(fav => fav.id === quote.id)) {
        updatedFavorites = favorites.filter(fav => fav.id !== quote.id);
      } else {
        updatedFavorites = [...favorites, quote];
      }

      await userRef.update({ favorites: updatedFavorites });
      setFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error toggling favorite: ', error);
    }
  };

  if (!route || !route.params || !route.params.quote) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Quote verisi bulunamadı!</Text>
      </View>
    );
  }

  return (
    <ImageBackground source={require('../../assets/images/home.jpg')} style={styles.background}>
      <View style={styles.quoteContainer}>
        <Image source={{ uri: quote.photo }} style={styles.photo} />



        <View style={styles.inputWrapper}>
            <Text style={styles.quote}>{quote.quote}</Text>
            <Pressable style={styles.favoriteButton} onPress={toggleFavorite}>
              <AntDesign name={isFavorite ? "heart" : "hearto"} size={24} color="white" />
            </Pressable>
          </View>

        
        <View style={styles.metaContainer}>


          <Text style={styles.author}>{quote.author}</Text>
          <Text style={styles.source}>{quote.source}</Text>
          <Text style={styles.date}>{quote.date}</Text>
        </View>
        <View style={styles.divider}></View>
        
        <ScrollView>
              <Text style={styles.description}>{quote.description}</Text>
            </ScrollView>

        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Entypo name="chevron-left" size={24} color="white" />
        </Pressable>
      </View>
      
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  quoteContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  quote: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
    flex: 1
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
    width: '100%',
  },
  author: {
    fontSize: 13,
    color: 'white',
    backgroundColor: Colors.darkgri,
    borderRadius: 10,
    padding: 7,
    overflow: 'hidden', 

  },
  source: {
    fontSize: 13,
    color: 'white',
    backgroundColor: Colors.darkgri,
    borderRadius: 8,
    padding: 7,
    marginLeft: 25,
    marginRight: 25,
    overflow: 'hidden', 

  },
  date: {
    fontSize: 13,
    color: 'white',
    padding: 7,
    overflow: 'hidden', 

  },
  description: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 16,
    marginTop: 5,
    color: 'rgb(169,169,169)',
    textAlign: 'flex-start',
  },
  divider: {
    borderBottomColor: 'rgb(169,169,169)',
    borderBottomWidth: 1,
    marginVertical: 16,
    width: '100%',
  },
  favoriteButton: {
    
  },
  backButton: {
    position: 'absolute',
    marginTop: 740,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
