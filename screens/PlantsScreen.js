import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback, useReducer } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import Colors from "../constants/Colors";
import { useDimensions } from "@react-native-community/hooks";
import { Feather } from "@expo/vector-icons";
import { getPlants } from "../store/actions/plants.js";

const PlantsScreen = (props) => {
  const { width, height } = useDimensions().window;
  const [count, setCount] = useState([]);

  useEffect(() => {
    props.getPlants();
  }, []);

  const styles = StyleSheet.create({
    plantsContainer: {
      flex: 1,
      backgroundColor: "white",
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: width / 2,
    },
    buttonContainer: {
      width: width / 4,
      height: width / 4,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      zIndex: 100,
      bottom: 20,
      left: width / 2 - width / 8,
    },
    button: { width: "100%", height: "100%", backgroundColor: "pink" },
    plantContainer: {
      width: width / 2,
      height: width / 2,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: Colors.warningBackground,
    },
    buttonText: { color: "white", fontSize: 50 },
  });

  const renderPlants = () => {
    return props.plants.map((plant, i) => (
      <RectButton
        onPress={() => {
          props.navigation.navigate("Plant", plant);
        }}
        key={i}
      >
        <View style={styles.plantContainer}>
          <Feather name="target" size={width / 5} color="black" />
          <Text>{plant.name}</Text>
          <Text>{plant.timePeriod}</Text>
          <Text>{plant.user}</Text>
          <Text>{plant.id}</Text>
        </View>
      </RectButton>
    ));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <RectButton
            onPress={() => {
              props.navigation.navigate("Add Plant");
            }}
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.buttonText}>+</Text>
          </RectButton>
        </View>
      </View>
      <ScrollView>
        <View style={styles.plantsContainer}>{renderPlants()}</View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  plants: state.plants,
});

export default connect(mapStateToProps, { getPlants })(PlantsScreen);
