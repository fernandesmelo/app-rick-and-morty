import React, { useState } from "react";
import { View, TextInput, FlatList } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import axios from "axios";
import styles from "./HomeStyles"; 

const HomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [rickandmorty, setRickAndMorty] = useState([]);

  const searchRickAndMorty = async () => {
    try {
      const url = query.trim()
        ? `https://rickandmortyapi.com/api/episode/?name=${query}`
        : `https://rickandmortyapi.com/api/episode`;

      const response = await axios.get(url);
      const episodes = response.data.results || [];

      const episodesWithImage = await Promise.all(
        episodes.map(async (ep) => {
          if (ep.characters && ep.characters.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * ep.characters.length
            );
            const randomCharacterUrl = ep.characters[randomIndex];
            try {
              const charRes = await axios.get(randomCharacterUrl);
              return { ...ep, characterImage: charRes.data.image };
            } catch {
              return { ...ep, characterImage: null };
            }
          }
          return { ...ep, characterImage: null };
        })
      );

      setRickAndMorty(episodesWithImage);
    } catch (error) {
      console.error(error);
      setRickAndMorty([]);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Digite o nome de um episódio..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button mode="contained" onPress={searchRickAndMorty} style={styles.button}>
        Buscar
      </Button>

      <FlatList
        data={rickandmorty}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            {item.characterImage && (
              <Card.Cover source={{ uri: item.characterImage }} />
            )}
            <Card.Title title={item.name}/>
            <Card.Content>
              <Text>Data de exibição: {item.air_date}</Text>
              <Text>Episódio: {item.episode}</Text>
              <Button
                mode="outlined"
                onPress={() =>
                  navigation.navigate("Detalhes", { episode: item })
                }
                style={{ marginTop: 8 }}
              >
                Ver detalhes
              </Button>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

export default HomeScreen;
