import React, { useState } from "react";
import { View, TextInput, FlatList } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import axios from "axios";
import styles from "./HomeStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const addToFavorites = async (episode) => {
    try {
      const existingFavorites =
        (await AsyncStorage.getItem("favorites")) || "[]";
      const favorites = JSON.parse(existingFavorites);
      if (!favorites.some((fav) => fav.id === episode.id)) {
        favorites.push(episode);
        await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
        alert("Episódio adicionado aos favoritos!");
      } else {
        alert("Episódio já está nos favoritos!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pesquisaContainer}>
        <TextInput
          placeholder="Digite o nome de um episódio..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={searchRickAndMorty}
          style={styles.buttonBuscar}
        >
          Buscar
        </Button>
      </View>
      <FlatList
        data={rickandmorty}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            {item.characterImage && (
              <Card.Cover source={{ uri: item.characterImage }} />
            )}
            <Card.Title title={item.name} />
            <Card.Content>
              <Text>Data de exibição: {item.air_date}</Text>
              <Text>Episódio: {item.episode}</Text>
              <View style={styles.buttonRow}>
                <Button
                  mode="outlined"
                  onPress={() =>
                    navigation.navigate("Details", { episode: item })
                  }
                  style={styles.button}
                >
                  Ver detalhes
                </Button>
                <Button
                  mode="contained"
                  onPress={() => addToFavorites(item)}
                  style={styles.button}
                >
                  Adicionar aos favoritos
                </Button>
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
};

export default HomeScreen;
