import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, FlatList, StyleSheet, Pressable, Dimensions, ImageBackground, ScrollView } from 'react-native';
import { db, auth } from '../../app/firebase.js';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../constants/Colors.js';
import { useRoute } from '@react-navigation/native';
import { useFonts, PlayfairDisplay_400Regular, Montserrat } from '@expo-google-fonts/playfair-display'; 

const { width } = Dimensions.get('window');

export default function Home() {
  const [fontsLoaded] = useFonts({ PlayfairDisplay_400Regular });

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const route = useRoute();
  const flatListRef = useRef(null);
  const { quoteId } = route.params || {};

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const snapshot = await db.collection('quotes').orderBy('id', 'desc').get(); // descending order
        const quotesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQuotes(quotesList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quotes: ', error);
        setLoading(false);
      }
    };

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

    const unsubscribe = db.collection('users').doc(auth.currentUser.uid).onSnapshot((snapshot) => {
      const userData = snapshot.data();
      const userFavorites = userData?.favorites || [];
      setFavorites(userFavorites);
    });

    fetchQuotes();
    fetchFavorites();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (quoteId && quotes.length) {
      const sortedQuotes = quotes.slice().sort((a, b) => b.id - a.id); // Sort by descending id
      const index = sortedQuotes.findIndex(quote => quote.id === quoteId);
      if (index !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({ animated: true, index, viewPosition: 1 });
      }
    }
  }, [quotes, quoteId]);
  

  const toggleFavorite = async (quote) => {
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

  const renderItem = ({ item }) => {
    const isFavorite = favorites.some(fav => fav.id === item.id);
    return (
      <View style={styles.quoteWrapper}>
        <ImageBackground source={require('../../assets/images/home.jpg')} style={styles.background}>
          <View style={[styles.quoteContainer, { width }]}>
            <Image source={{ uri: item.photo }} style={styles.photo} />

            <View style={styles.inputWrapper}>
              <Text style={styles.quote}>{item.quote}</Text>
              <Pressable style={styles.favoriteButton} onPress={() => toggleFavorite(item)}>
                <AntDesign name={isFavorite ? "heart" : "hearto"} size={24} color="white" />
              </Pressable>
            </View>

            <View style={styles.metaContainer}>
              <Text style={styles.author}>{item.author}</Text>
              <Text style={styles.source}>{item.source}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
            <View style={styles.divider}></View>

            <ScrollView>
              <Text style={styles.description}>{item.description}</Text>
            </ScrollView>

          </View>
        </ImageBackground>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!quotes.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No Quotes Found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={quotes}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      ref={flatListRef}
    />
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  quoteWrapper: {
    flex: 1,
    width: width,
  },
  inputWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 7,
  },
  quoteContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: '100%', 
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  quote: {
    fontSize: 18,
    fontFamily: 'PlayfairDisplay_400Regular',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
    flex: 1,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
    width: '100%',
  },
  author: {
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: 'white',
    backgroundColor: Colors.darkgri,
    borderRadius: 8,
    padding: 7,
    overflow: 'hidden',
  },
  source: {
    fontFamily: 'Montserrat',
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
    fontFamily: 'Montserrat',
    fontSize: 13,
    color: 'white',
    borderRadius: 10,
    padding: 7,
    overflow: 'hidden',
  },
  description: {
    fontFamily: 'Montserrat',
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
  favoriteButton: {},
});

