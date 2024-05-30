import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { auth, db } from '../../app/firebase';
import { useFonts, AbrilFatface_400Regular, PlayfairDisplay_400Regular } from '@expo-google-fonts/abril-fatface'; // April Fatface ve Playfair Display fontlarını içe aktar


const { width } = Dimensions.get('window');

const Favorites = () => {
  let [fontsLoaded] = useFonts({
    AbrilFatface_400Regular,
    PlayfairDisplay_400Regular,
    // Diğer fontlar...
  });

  
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

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

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const handleQuotePress = (quote) => {
    navigation.navigate('Quotes', { quote });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleQuotePress(item)}>
      <View style={[styles.quoteContainer, { width: width - 40 }]}>
        <Image source={{ uri: item.photo }} style={styles.photo} />
        <Text style={styles.quote}>{item.quote}</Text>
      </View>
    </TouchableOpacity>
  );

  const Separator = () => {
    return <View style={styles.separator} />;
  };

  return (
    <ImageBackground source={require('../../assets/images/home.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Favoriler</Text>
        <View style={styles.separator} />
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={Separator}
        />
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
  quoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 73,
    height: 73,
    resizeMode: 'cover',
    borderRadius: 15,
  },
  quote: {
    fontSize: 15,
    fontFamily: 'PlayfairDisplay_400Regular',
    marginHorizontal: 10,
    color: 'white',
    textAlign: 'left',
    paddingEnd: 45,
  },
});

export default Favorites;
