import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  pesquisaContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 20,
  },
  buttonBuscar: {
    width: "100%",
    height: 40,
  },
  button: {
    marginTop: 8, 
    marginRight: 8,
  },
  card: {
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 8,
  },
});

export default styles;
