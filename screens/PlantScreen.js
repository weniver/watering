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
    lastWateringMoment: moment(),
    nextWateringMoment: moment(),
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
    createWateringMoments();
  }, [plant.wateringHistory]);

  const createWateringMoments = () => {
    let lastWateringMoment = moment(_.last(plant.wateringHistory));
    let nextWateringMoment = moment(lastWateringMoment).add(
      plant.interval,
      "days"
    );
    setDates({ lastWateringMoment, nextWateringMoment });
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

  const _handleWatering = async () => {
    try {
      let currentWateringTime = new Date().getTime();
      let updatedWateringHistory = [
        ...plant.wateringHistory,
        currentWateringTime,
      ];
      await plantDocRef.update({ wateringHistory: updatedWateringHistory });
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

  const _createAgeString = () => {
    let timeFromBirthday = moment(plant.birthday).fromNow();
    return <Text>{`you planted me ${timeFromBirthday}`}</Text>;
  };

  const _createLastWaterDateString = () => {
    return (
      <Text>{`you watered me ${dates.lastWateringMoment.fromNow()}`}</Text>
    );
  };

  const _createTimerString = () => {
    let timeFromWateringTimes = dates.nextWateringMoment.from(
      dates.lastWateringMoment
    );
    if (dates.lastWateringMoment.isSameOrBefore(dates.nextWateringMoment)) {
      return <Text>{`you need to water me ${timeFromWateringTimes}`}</Text>;
    } else {
      return <Text>{`I need water since ${timeFromWateringTimes}`}</Text>;
    }
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
            {_createAgeString()}
            {_createLastWaterDateString()}
            {_createTimerString()}
          </View>
          <View>{renderObject(plant)}</View>
          <View style={styles.buttonContainer}>
            <View style={{ ...styles.button, backgroundColor: "blue" }}>
              <RectButton
                onPress={() => {
                  _handleWatering();
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
