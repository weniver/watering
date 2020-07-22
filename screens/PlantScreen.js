import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import Colors from "../constants/Colors";
import { useDimensions } from "@react-native-community/hooks";
import { Feather } from "@expo/vector-icons";
import { deactivatePlant} from "../store/actions/plants.js";

const PlantScreen = (props) => {
  const { width, height } = useDimensions().window;
  const [count, setCount] = useState([]);
  const plant = props.route.params;

  useEffect(() => {
    props.navigation.setOptions({ title: plant.name });
  }, []);

  const styles = StyleSheet.create({
    infoContainer: {
      height: height,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      height: 50,
      width: "75%",
      backgroundColor: "red",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontWeight: "bold",
      color: "white",
      backgroundColor: "red",
      alignItems: "center",
      justifyContent: "center",
      textTransform: "uppercase",
    },
    deleteButtonContainer: {
      height: 150,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const digUpAlert = () => {
    Alert.alert(
      "Desenterrar Planta",
      "¿Estas seguro qué quieres desenterrar la planta?",
      [
        {
          text: "No",
          style: "cancel",
        },
        { text: "Desenterrar", onPress: () => handleDigUp() },
      ]
    );
  };

  const handleDigUp = async () => {
    try {
      console.log(plant.id)
      await props.deactivatePlant(plant.id);
      props.navigation.navigate("Plants")
    } catch (e) {
      console.log(e)
    }
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.infoContainer}>
          <Text>{plant.name}</Text>
          <Text>{plant.timePeriod}</Text>
          <Text>{plant.user}</Text>
          <Text>{plant.id}</Text>
        </View>
        <View style={styles.deleteButtonContainer}>
          <View style={styles.button}>
            <RectButton
              onPress={() => {
                digUpAlert();
              }}
              style={{
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.buttonText}>desplantar</Text>
            </RectButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default connect(null, { deactivatePlant })(PlantScreen);
