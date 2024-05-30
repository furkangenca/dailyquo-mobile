import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, ImageBackground, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { db } from '../../app/firebase.js';
import { useFonts, AbrilFatface_400Regular, PlayfairDisplay_400Regular } from '@expo-google-fonts/abril-fatface';
import Colors from '../constants/Colors.js';

const Search = () => {
  const [fontsLoaded] = useFonts({ AbrilFatface_400Regular, PlayfairDisplay_400Regular });
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [randomQuotes, setRandomQuotes] = useState([]);
  const [hiddenRandomQuotes, setHiddenRandomQuotes] = useState([]); // Store random quotes to be shown again
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRandomQuotes = async () => {
      try {
        const quotesSnapshot = await db.collection('quotes').get();
        const quotesData = quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const shuffledQuotes = quotesData.sort(() => 0.5 - Math.random());
        const randomQuotes = shuffledQuotes.slice(0, 5);
        setRandomQuotes(randomQuotes);
      } catch (error) {
        console.error('Error fetching random quotes: ', error);
      }
    };

    fetchRandomQuotes();
  }, []);

  // Function to handle search
  const handleSearch = async () => {
    try {
      setShowResults(true);
      setResults([]);
      setHiddenRandomQuotes([...randomQuotes]); // Store random quotes before showing search results

      const fields = ['author', 'date', 'source', 'quote'];
      let combinedResults = [];

      for (const field of fields) {
        const snapshot = await db.collection('quotes')
          .where(field, '>=', searchQuery)
          .where(field, '<=', searchQuery + '\uf8ff')
          .get();

        const searchResults = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        combinedResults = [...combinedResults, ...searchResults];
      }

      const uniqueResults = combinedResults.reduce((acc, current) => {
        const x = acc.find(item => item.id === current.id);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      setResults(uniqueResults);
    } catch (error) {
      console.error('Error searching quotes: ', error);
    }
  };

  const handleQuotePress = (quote) => {
    navigation.navigate('Quotes', { quote });
  };

  const handleBackToRandomQuotes = () => {
    setShowResults(false);
    setRandomQuotes([...hiddenRandomQuotes]); // Restore hidden random quotes
  };

  const renderRandomQuote = () => (
    <View style={styles.topQuoteContainer}>
      <FlatList
        horizontal
        data={randomQuotes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const viewSize = event.nativeEvent.layoutMeasurement.width;
          const pageNum = Math.floor(contentOffsetX / viewSize);
          setCurrentPage(pageNum);
        }}
      />
      <View style={styles.pageIndicatorContainer}>
        {randomQuotes.map((_, index) => (
          <View
            key={index}
            style={[styles.pageIndicator, currentPage === index && styles.activePageIndicator]}
          />
        ))}
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.topQuoteItemContainer}
      onPress={() => handleQuotePress(item)}
    >
      <Image
        source={{ uri: item.photo }}
        style={styles.topPhoto}
      />
      <Text style={styles.topQuoteText}>{item.quote}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../../assets/images/home.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Ara</Text>

        <View style={styles.inputContainer}>
          <AntDesign name="search1" size={20} color="gray" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Yazar, alıntı, eser ve benzeri ara"
            placeholderTextColor="gray"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Arama Yap</Text>
        </TouchableOpacity>

        {/* Show search results if available */}
        {showResults && (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => navigation.navigate('Quotes', { quote: item })}
              >
                <Image source={{ uri: item.photo }} style={styles.photo} />
                <Text style={styles.resultText}><Text style={styles.label}>Yazar:</Text> {item.author}</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Alıntı:</Text> {item.quote}</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Kaynak:</Text> {item.source}</Text>
                <Text style={styles.resultText}><Text style={styles.label}>Tarih:</Text> {item.date}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* Back button to return to normal search view */}
        {showResults && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackToRandomQuotes}
          >
            <AntDesign name="arrowleft" size={24} color="white" />
          </TouchableOpacity>
        )}

        {/* Render random quotes only if search results are not shown */}
        {!showResults && (
          <>
            <Text style={styles.header2}>Farklı Yazarların Alıntılarını Keşfet!</Text>
            <View style={styles.separator2} />
            {renderRandomQuote()}
          </>
        )}
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
    marginBottom: 35,
    fontFamily: 'AbrilFatface_400Regular'
  },
  header2: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 16,
    color: 'white',
    textAlign: 'flex-start',
    marginTop: 30,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgb(169,169,169)',
    marginVertical: 10,
  },
  separator2: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 7,
    borderRadius: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1.2,
    padding: 5,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 7,
  },
  searchIcon: {
    marginRight: 10,
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.dark2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  resultItem: {
    padding: 15,
    backgroundColor: Colors.dark2,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 20,
  },
  resultText: {
    color: 'white',
    fontSize: 16,
    marginVertical: 5,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  topQuoteContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
  },
  topQuoteItemContainer: {
    width: 380,
    marginRight: 10,
  },
  topPhoto: {
    width: '100%',
    height: 350,
    borderRadius: 8,
    marginBottom: 10,
  },
  topQuoteText: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    color: 'white',
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_400Regular',
    textAlign: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgb(0,0,0,0.5)'
  },
  pageIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  activePageIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  backButton: {
    position: 'absolute',
    marginTop: 650,
    right: 20,
    backgroundColor: 'rgba(169,169,169, 0.2)',
    borderRadius: 50,
    padding: 10,
  },
});

export default Search;
