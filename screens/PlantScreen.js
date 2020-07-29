import React, { useEffect, useState, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Alert, Image } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { useDimensions } from "@react-native-community/hooks";
import moment from "moment";
import { db } from "../config/firebase.js";
import { useHeaderHeight } from "@react-navigation/stack";
import _ from "lodash";
import { connect } from "react-redux";
import * as plant from "../helpers/plant.js";

const PlantScreen = ({ route, navigation, wateringTime }) => {
  //Local States
  const [plantData, setPlantData] = useState(route.params.initialData);
  const [plantSnapshot, setPlantSnapshot] = useState(route.params.initialData);
  const [dates, setDates] = useState({
    lastWateringMoment: moment(),
    nextWateringMoment: moment(),
  });
  //Props
  const { plantId } = route.params;
  const { width, height } = useDimensions().window;
  const headerHeight = useHeaderHeight();

  useLayoutEffect(() => {
    navigation.setOptions({ title: plantData.name });
  }, [plantData, navigation]);

  useEffect(() => {
    let unsubscribe = db
      .collection("plants")
      .doc(plantId)
      .onSnapshot(
        (docSnapshot) => {
          setPlantSnapshot(docSnapshot);
          setPlantData(docSnapshot.data());
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
    let lastWateringMoment = plant.getLastWateringMoment(
      plantData.wateringHistory
    );
    let nextWateringMoment = plant.getNextWateringMoment(
      lastWateringMoment,
      wateringTime,
      plantData.interval
    );
    setDates({ lastWateringMoment, nextWateringMoment });
  }, [plantData.wateringHistory]);

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
        { text: "Desenterrar", onPress: () => _handleDigUp() },
      ]
    );
  };

  const _handleDigUp = async () => {
    try {
      await plant.digUp(plantSnapshot);
      navigation.navigate("Plants");
    } catch (e) {
      console.log(e);
    }
  };

  const _handleWatering = async () => {
    try {
      await plant.water(plantSnapshot);
    } catch (e) {
      console.log(e);
    }
  };

  const _createAgeString = () => {
    let timeFromBirthday = moment(plantData.birthday).fromNow();
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
          <View>{plant.renderValueKeys(plantData)}</View>
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

const mapStateToProps = (state) => ({
  wateringTime: state.auth.settings.wateringTime,
});

export default connect(mapStateToProps)(PlantScreen);
