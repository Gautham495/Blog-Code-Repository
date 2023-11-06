import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Platform,
  Dimensions,
} from "react-native";

import FastImage from "react-native-fast-image";
import { useCallback } from "react";
import { searchResourcesFromMelli } from "../API/MellisearchAPI";
import { debounce } from "lodash";

const screenWidth = Dimensions.get("screen").width;

const SearchInterface = () => {
  const [query, setQuery] = useState("");
  const [moviesData, setMoviesData] = useState([]);

  const [searchLoader, setSearchLoader] = useState(false);
  async function searchMelli(e) {
    const melliSearch = {
      search: e,
    };

    const res = await searchResourcesFromMelli(melliSearch);

    setMoviesData(res);

    setSearchLoader(false);
  }

  const debouncedAPICall = useCallback(debounce(searchMelli, 1200), []);

  async function debouncedFullTextSearch(e) {
    setSearchLoader(true);

    setQuery(e);

    debouncedAPICall(e);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.center}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={debouncedFullTextSearch}
            placeholder="Search a movie..."
            placeholderTextColor={"black"}
          />
        </View>

        {searchLoader && (
          <View style={styles.searchLoader}>
            <ActivityIndicator color={"#00A9F1"} size={"large"} />
          </View>
        )}

        {moviesData?.length >= 1 ? (
          moviesData?.map((item) => {
            return (
              <View style={styles.movieItem} key={item?.movieId}>
                <FastImage
                  style={styles.poster}
                  source={{
                    uri: item.posterUrl,
                    priority: FastImage.priority.high,
                  }}
                  resizeMode="cover"
                />
                <View style={styles.movieDetails}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.center}>
            {!searchLoader && (
              <View>
                <FastImage
                  source={require("../Assets/SearchMovies.png")}
                  style={styles.searchMovies}
                  resizeMode="contain"
                />
                <View style={styles.center}>
                  <Text style={styles.searchDescription}>
                    Start typing to search movies!
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#00A9F1",
    borderRadius: 5,
    paddingLeft: 10,
    marginVertical: 10,
    width: 300,
    fontFamily: "Pangram-Regular",
    fontSize: 18,
    padding: 15,
    backgroundColor: "#F9FAFC",
    color: "black",
  },
  movieItem: {
    marginVertical: 10,
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 10,
    padding: 5,
    borderColor: "#00A9F1",
    borderWidth: 1,
  },
  poster: {
    width: Platform.OS === "ios" ? screenWidth * 0.85 : screenWidth * 0.8,
    height: 220,
    resizeMode: "cover",
    marginVertical: 10,
  },
  movieDetails: {
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 5,
    fontFamily: "Pangram-Bold",
    lineHeight: 26,
  },
  description: {
    fontSize: 17,
    fontFamily: "Pangram-Regular",
    lineHeight: 26,
    marginBottom: 10,
  },
  searchDescription: {
    fontSize: 22,
    fontFamily: "Pangram-Regular",
    marginBottom: 10,
  },
  searchLoader: {
    paddingTop: 30,
    marginTop: 20,
    marginBottom: 30,
  },
  searchMovies: {
    width: screenWidth * 0.8,
    height: 300,
  },
});

export default SearchInterface;
