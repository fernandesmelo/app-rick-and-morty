import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);

  const searchMovies = async () => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?apikey=1993e977&s=${query}`);
      setMovies(response.data.Search || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Digite o nome do filme..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button mode="contained" onPress={searchMovies} style={styles.button}>
        Buscar
      </Button>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Cover source={{ uri: item.Poster }} />
            <Card.Content>
              <Title>{item.Title}</Title>
              <Paragraph>{item.Year}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => navigation.navigate('Details', { imdbID: item.imdbID })}>
                Ver Detalhes
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
  },
});

export default HomeScreen;
