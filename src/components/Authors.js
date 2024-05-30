import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Pressable, ScrollView, FlatList, ImageBackground } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors.js';
import { db } from '../../app/firebase';
import { useFonts, PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display'; // April Fatface fontunu içe aktar

export default function Authors() {
    const navigation = useNavigation();
    const route = useRoute(); // useRoute kancasını ekledik
    const { author } = route.params;
    const [quotes, setQuotes] = useState([]);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const quotesSnapshot = await db.collection('quotes').where('author', '==', author.author).get();
            const quotesData = quotesSnapshot.docs.map(doc => doc.data());
            setQuotes(quotesData);
        } catch (error) {
            console.error('Error fetching quotes: ', error);
        }
    };

    return (
        <ImageBackground source={require('../../assets/images/home.jpg')} style={styles.background}>
            <View style={styles.container}>
                <Image source={{ uri: author.photo }} style={styles.photo} />
                <Text style={styles.author}>{author.author}</Text>
                <View style={styles.separator} />
                <FlatList
                    data={quotes}
                    renderItem={({ item }) => (
                        <Pressable style={styles.quoteContainer} onPress={() => navigation.navigate('Quotes', { quote: item })}>
                            <Text style={styles.quote}>{item.quote}</Text>
                        </Pressable>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
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
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    photo: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        marginTop: 40,
    },
    author: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    separator: {
        width: '80%',
        height: 1,
        backgroundColor: 'gray',
        marginVertical: 10,
    },
    quoteContainer: {
        width: '100%',
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        marginBottom: 10,
      },
    quote: {
        fontSize: 16,
        color: 'white',
    },
    backButton: {
      position: 'absolute',
      bottom: 80,
      right: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 50,
      padding: 10,
    },
});