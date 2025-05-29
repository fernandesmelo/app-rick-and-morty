import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./FavoritesStyles";

const FavoriteItem = ({ item, removeFavorite, navigateToDetails }) => {
  return (
    <Card style={styles.card}>
      {item.characterImage && (
        <Card.Cover source={{ uri: item.characterImage }} />
      )}
      <Card.Content>
        <Card.Title title={item.name} />
        <Card.Content style={styles.content}>
          <Text>Data de exibição: {item.air_date}</Text>
          <Text>Episódio: {item.episode}</Text>
        </Card.Content>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => navigateToDetails(item)}>Ver Detalhes</Button>
        <Button onPress={() => removeFavorite(item.id)}>
          Remover dos Favoritos
        </Button>
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
          const storedFavorites = await AsyncStorage.getItem("favorites");
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

  const removeFavorite = async (id) => {
    try {
      const updatedFavorites = favorites.filter((ep) => ep.id !== id);
      setFavorites(updatedFavorites);
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      alert("Episódio removido dos favoritos!");
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToDetails = (episode) => {
    navigation.navigate("Details", { episode });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FavoriteItem
            item={item}
            removeFavorite={removeFavorite}
            navigateToDetails={navigateToDetails}
          />
        )}
        initialNumToRender={5}
        getItemLayout={(data, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        windowSize={10}
        maxToRenderPerBatch={5}
      />
    </View>
  );
};

export default FavoritesScreen;