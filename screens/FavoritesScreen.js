import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const FavoriteItem = ({ item, removeFavorite, navigateToDetails }) => {
  return (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.Poster }} />
      <Card.Content>
        <Title>{item.Title}</Title>
        <Paragraph>{item.Year}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigateToDetails(item.imdbID)}>Ver Detalhes</Button>
        <Button onPress={() => removeFavorite(item.imdbID)}>Remover dos Favoritos</Button>
      </Card.Actions>
    </Card>
  );
};

const FavoritesScreen = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const storedFavorites = await AsyncStorage.getItem('favorites');
          if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
          }
        } catch (error) {
          console.error(error);
        }
      };
      loadFavorites();
    }, [])
  );

  const removeFavorite = async (imdbID) => {
    try {
      const updatedFavorites = favorites.filter((movie) => movie.imdbID !== imdbID);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      alert('Filme removido dos favoritos!');
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToDetails = (imdbID) => {
    navigation.navigate('Details', { imdbID });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <FavoriteItem
            item={item}
            removeFavorite={removeFavorite}
            navigateToDetails={navigateToDetails}
          />
        )}
        initialNumToRender={5}
        getItemLayout={(data, index) => (
          {length: 100, offset: 100 * index, index}
        )}
        windowSize={10}
        maxToRenderPerBatch={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
});

export default FavoritesScreen;
