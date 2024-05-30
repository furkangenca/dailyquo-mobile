import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts, AbrilFatface_400Regular, PlayfairDisplay_400Regular } from '@expo-google-fonts/abril-fatface';
import { db } from '../../app/firebase';

const Explore = () => {
  const [fontsLoaded] = useFonts({ AbrilFatface_400Regular, PlayfairDisplay_400Regular });
  const [popularQuotes, setPopularQuotes] = useState([]);
  const [popularAuthors, setPopularAuthors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const navigation = useNavigation();
  // Yazar ekranına yönlendirme fonksiyonu
  const handleAuthorPress = (author) => {
    navigation.navigate('Authors', { author });
  };

  useEffect(() => {
    const fetchPopularQuotes = async () => {
      try {
        const quotesSnapshot = await db.collection('quotes').get();
        const quotesData = quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const usersSnapshot = await db.collection('users').get();
        const usersData = usersSnapshot.docs.map(doc => doc.data());

        const favoriteCount = {};
        usersData.forEach(user => {
          user.favorites.forEach(fav => {
            if (favoriteCount[fav.id]) {
              favoriteCount[fav.id] += 1;
            } else {
              favoriteCount[fav.id] = 1;
            }
          });
        });

        const sortedQuotes = quotesData
          .map(quote => ({
            ...quote,
            favoriteCount: favoriteCount[quote.id] || 0
          }))
          .sort((a, b) => b.favoriteCount - a.favoriteCount)
          .slice(0, 4); // Display top 4 popular quotes

        setPopularQuotes(sortedQuotes);
      } catch (error) {
        console.error('Error fetching popular quotes: ', error);
      }
    };

    const fetchPopularAuthors = async () => {
      try {
        const quotesSnapshot = await db.collection('quotes').get();
        const quotesData = quotesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const usersSnapshot = await db.collection('users').get();
        const usersData = usersSnapshot.docs.map(doc => doc.data());

        const authorFavoriteCount = {};
        quotesData.forEach(quote => {
          authorFavoriteCount[quote.author] = {
            count: 0,
            photo: quote.photo
          };
        });

        usersData.forEach(user => {
          user.favorites.forEach(fav => {
            const favoriteQuote = quotesData.find(quote => quote.id === fav.id);
            if (favoriteQuote) {
              if (authorFavoriteCount[favoriteQuote.author]) {
                authorFavoriteCount[favoriteQuote.author].count += 1;
              } else {
                authorFavoriteCount[favoriteQuote.author] = {
                  count: 1,
                  photo: favoriteQuote.photo
                };
              }
            }
          });
        });

        const sortedAuthors = Object.entries(authorFavoriteCount)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 5) // Display top 5 popular authors
          .map(([author, data]) => ({ author, photo: data.photo, count: data.count }));

        setPopularAuthors(sortedAuthors);
      } catch (error) {
        console.error('Error fetching popular authors: ', error);
      }
    };

    fetchPopularQuotes();
    fetchPopularAuthors();
  }, []);

  const handleQuotePress = (quote) => {
    navigation.navigate('Quotes', { quote });
  };

  const renderTopQuote = () => (
    <View style={styles.topQuoteContainer}>
      <FlatList
        horizontal
        data={popularQuotes}
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
        {popularQuotes.map((_, index) => (
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

  const renderAuthorItem = ({ item }) => (
    <TouchableOpacity
      style={styles.authorItemContainer}
      onPress = {() => handleAuthorPress(item)}
    >
      <ImageBackground source={{ uri: item.photo }} style={styles.authorPhoto}>
        <View style={styles.authorOverlay}>
          <Text style={styles.authorName}>{item.author}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );


  const renderPopularAuthors = () => {
    if (popularAuthors.length === 0) {
      // Eğer yazarlar henüz yüklenmediyse veya boş ise yükleme göstergesi göster
      return <ActivityIndicator size="large" color="white" />;
    } else {
      // Eğer yazarlar yüklendiyse ve dolu ise listeyi göster
      return (
        <>
          <Text style={styles.header2}>Popüler Yazarlar</Text>
          <View style={styles.separator2} />
          <FlatList
            horizontal
            data={popularAuthors}
            renderItem={renderAuthorItem}
            keyExtractor={(item) => item.author}
            showsHorizontalScrollIndicator={false}
          />
        </>
      );
    }
  };
  
  
  const renderADQuotes = () => {
    const modernQuotes = popularQuotes.filter(quote => {
      const year = parseInt(quote.date, 10); // Specify radix (base 10) for parsing
      return !isNaN(year) && year >= 1900 && year <= 2024;
    });
    
  
    return (
      <>
        <Text style={styles.header2}>Modern Zamanın Yazarlarından Alıntılar</Text>
        <View style={styles.separator2} />
        <FlatList
          horizontal
          data={modernQuotes}
          renderItem={renderAuthorItem}
          keyExtractor={(item) => item.author}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
  };
  const renderAntiqueQuotes = () => {
    const antiqueQuotes = popularQuotes.filter(quote => {
      return quote.date.includes("MÖ");
    });
    
    return (
      <>
        <Text style={styles.header2}>Antik Zamanın Yazarlarından Alıntılar</Text>
        <View style={styles.separator2} />
        <FlatList
          horizontal
          data={antiqueQuotes}
          renderItem={renderAuthorItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </>
    );
};

  return (
    <ImageBackground source={require('../../assets/images/home.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Text style={styles.header}>Keşfet</Text>
          <Text style={styles.header2}>Öne Çıkanlar</Text>
          {renderTopQuote()}
        </View>

        {renderPopularAuthors()}
        {renderADQuotes()}
        {renderAntiqueQuotes()}

      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 15,
    fontSize: 35,
    fontWeight: 'light',
    color: 'white',
    textAlign: 'flex-start',
    marginBottom: 10,
    fontFamily: 'AbrilFatface_400Regular',
  },
  header2: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 15,
    color: 'white',
    textAlign: 'flex-start',
    marginTop: 30,
    marginBottom: 7,
    paddingHorizontal: 15,
  },
  separator2: {
    paddingHorizontal: 15,
    height: 1,
    backgroundColor: 'gray',
    marginBottom: 20,
  },
  topQuoteContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    padding: 10,
  },
  topQuoteItemContainer: {
    width: 400, // Adjust this to the width you want for each item
    marginRight: 15, // Add some spacing between items
  },
  topPhoto: {
    width: '100%',
    height: 400,
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
    marginBottom: 14,
  },
  activePageIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  authorItemContainer: {
    width: 150, // Adjust the width of each author item
    marginRight: 20, // Add some spacing between items
    alignItems: 'center',
  },
  authorPhoto: {
    width: '100%',
    height: 170,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  authorOverlay: {
    padding: 5,
  },
  authorName: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'PlayfairDisplay_400Regular',
    textAlign: 'flex-start',
  },
});

export default Explore;
