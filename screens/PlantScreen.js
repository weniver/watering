import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Alert, Image } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { useDimensions } from "@react-native-community/hooks";
import moment from "moment";
import { db } from "../config/firebase.js";
import { useHeaderHeight } from "@react-navigation/stack";
import _ from "lodash";

const PlantScreen = (props) => {
  const { width, height } = useDimensions().window;
  const headerHeight = useHeaderHeight();
  const { plantId } = props.route.params;
  const [plant, setPlant] = useState(props.route.params.initialData);
  const [plantDocRef, setPlantDocRef] = useState("");
  const { navigation } = props;
  const [dates, setDates] = useState({
    ageInDays: "",
    lastWatering: "",
    mSecondsToWater: 0,
  });

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

  useEffect(() => {
    handleDates();
  }, [plant.ageInDays, plant.lastWatering]);

  const handleDates = () => {
    let ageInDays = moment().diff(moment(plant.birthday), "days");
    let lastWatering = moment(_.last(plant.wateringHistory));
    let nextWatering = moment(lastWatering).add(plant.interval, "days");
    let mSecondsToWater = nextWatering.diff(lastWatering);
    let mSecondsSinceWatered = lastWatering.diff(moment());
    setDates({ ageInDays, mSecondsSinceWatered, mSecondsToWater });
  };

  const styles = StyleSheet.create({
    infoContainer: {
      height: height,
      backgroundColor: "#fff",
      paddingTop: headerHeight,
      flexDirection: "column",
      justifyContent: "space-between",
      alignContent: "center",
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
    imgContainer: {
      height: width / 3,
      alignItems: "center",
      justifyContent: "center",
      margin: 20,
    },
    plantImg: {
      width: width / 3,
      height: "100%",
      resizeMode: "contain",
      margin: 10,
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
    console.log(moment.duration(dates.mSecondsToWater).humanize())
    // console.log(moment.duration(12205598).humanize());
    // console.log(moment.duration(12205598).minutes());
    // console.log(moment.duration(12205598).asMinutes() / 60);
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

  const createAgeString = () => {
    return dates.ageInDays === 0 ? (
      <Text>you planted me today</Text>
    ) : (
      <Text>{`you planted me ${dates.ageInDays} days ago`}</Text>
    );
  };

  const createLastWaterDateString = () => {
   let duration = moment.duration(dates.mSecondsSinceWatered).humanize()
   return <Text>{`you watered me ${duration} ago`}</Text>
  };

  const createTimerString = () => {
   let duration = moment.duration(dates.mSecondsToWater).humanize()
   return <Text>{`water me in ${duration}`}</Text>
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.infoContainer}>
          <View style={styles.imgContainer}>
            <Image
              style={styles.plantImg}
              source={require("../assets/images/plantPlaceHolder.png")}
            />
            {createAgeString()}
            {createLastWaterDateString()}
            {createTimerString()}
          </View>
          <View>{renderObject(plant)}</View>
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
