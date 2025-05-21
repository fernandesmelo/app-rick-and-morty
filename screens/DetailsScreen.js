import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetailsScreen = ({ route }) => {
  const { imdbID } = route.params;
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://www.omdbapi.com/?apikey=1993e977&i=${imdbID}`);
        setMovie(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovieDetails();
  }, [imdbID]);

  const addToFavorites = async () => {
    try {
      const existingFavorites = await AsyncStorage.getItem('favorites') || '[]';
      const favorites = JSON.parse(existingFavorites);
      favorites.push(movie);
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      alert('Filme adicionado aos favoritos!');
    } catch (error) {
      console.error(error);
    }
  };

  if (!movie) {
    return <Paragraph>Carregando...</Paragraph>;
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Cover source={{ uri: movie.Poster }} />
        <Card.Content>
          <Title>{movie.Title}</Title>
          <Paragraph>{movie.Plot}</Paragraph>
          <Paragraph>Ano: {movie.Year}</Paragraph>
          <Paragraph>Gênero: {movie.Genre}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button onPress={addToFavorites}>Adicionar aos Favoritos</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default DetailsScreen;
