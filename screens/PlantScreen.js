import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Alert } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { useDimensions } from "@react-native-community/hooks";
import moment from "moment";
import { db } from "../config/firebase.js";

const PlantScreen = (props) => {
  const { width, height } = useDimensions().window;
  const { plantId } = props.route.params;
  const [plant, setPlant] = useState(props.route.params.initialData);
  const [plantDocRef, setPlantDocRef] = useState("");
  const { navigation } = props;

  useLayoutEffect(() => {
    navigation.setOptions({ title: plant.name });
  }, [plant, navigation]);

  useEffect(() => {
    let plantDocRef = db.collection("plants").doc(plantId);
    setPlantDocRef(plantDocRef);

    let unsubscribe = plantDocRef.onSnapshot(
      (docSnapshot) => {
        let data = docSnapshot.data();
        setPlant(data);
      },
      (e) => {
        console.log(e.message);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [plantId, db]);

  const styles = StyleSheet.create({
    infoContainer: {
      height: height,
      backgroundColor: "#fff",
      justifyContent: "center",
      flexDirection: "column",
      paddingLeft: 20,
    },
    button: {
      height: 50,
      width: "75%",
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontWeight: "bold",
      color: "white",
      alignItems: "center",
      justifyContent: "center",
      textTransform: "uppercase",
    },
    buttonContainer: {
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
      await plantDocRef.update({ active: false });
      navigation.navigate("Plants");
    } catch (e) {
      console.log(e);
    }
  };

  const handleWatering = async () => {
    try {
      await plantDocRef.update({ name: "HOLA" });
    } catch (e) {
      console.log(e);
    }
  };

  const renderObject = (plant) => {
    let info = [];
    let counter = 1;
    for (const property in plant) {
      info = [
        ...info,
        <View key={counter} style={{ flexDirection: "row" }}>
          <Text style={{ fontWeight: "bold" }}>{`${property}:`}</Text>
          <Text>{` ${JSON.stringify(plant[property])}`}</Text>
        </View>,
      ];
      counter++;
    }
    return info.map((a) => {
      return a;
    });
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.infoContainer}>
          {renderObject(plant)}
          <View style={styles.buttonContainer}>
            <View style={{ ...styles.button, backgroundColor: "blue" }}>
              <RectButton
                onPress={() => {
                  handleWatering();
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.buttonText}>regar</Text>
              </RectButton>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={{ ...styles.button, backgroundColor: "red" }}>
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

export default PlantScreen;
