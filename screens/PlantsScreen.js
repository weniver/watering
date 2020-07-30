//Base
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
//Redux
import { connect } from "react-redux";
//React Native/Expo Libraries
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useDimensions } from "@react-native-community/hooks";
//Libraries
import _ from "lodash";
import moment from "moment";
//Watering
import Colors from "../constants/Colors";
import { db, auth } from "../config/firebase.js";
import * as plant from "../helpers/plant.js";

const PlantsScreen = ({ navigation, userID, wateringTime }) => {
  const { width, height } = useDimensions().window;
  const [plantsDocs, setPlantsDocs] = useState([]);

  useEffect(() => {
    let userPlantsQuery = db
      .collection("plants")
      .where("user", "==", userID)
      .where("active", "==", true);

    let unsubscribe = userPlantsQuery.onSnapshot(
      (querySnapshot) => {
        setPlantsDocs(querySnapshot.docs);
      },
      (e) => {
        console.log(e.message);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [db, userID]);

  const _createTimerString = (lastWateringMoment, nextWateringMoment) => {
    let timeFromWateringTimes = nextWateringMoment.from(lastWateringMoment);
    if (lastWateringMoment.isSameOrBefore(nextWateringMoment)) {
      return (
        <Text>
          <Ionicons name="ios-water" size={16} color="black" />
          {` me ${timeFromWateringTimes}`}
        </Text>
      );
    } else {
      return (
        <Text>
          {`I need `} <Ionicons name="ios-water" size={16} color="black" />
          {` since ${timeFromWateringTimes}`}
        </Text>
      );
    }
  };

  const styles = StyleSheet.create({
    plantsContainer: {
      flex: 1,
      backgroundColor: "white",
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: width / 2,
    },
    buttonContainer: {
      width: width,
      height: width / 4,
      alignItems: "center",
      justifyContent: "space-around",
      position: "absolute",
      zIndex: 100,
      bottom: 20,
      left: 0,
      flexDirection: "row",
    },
    button: { width: "25%", height: width / 4, backgroundColor: "pink" },
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
    return plantsDocs.map((plantDoc, i) => {
      const plantData = plantDoc.data();
      const plantId = plantDoc.id;
      const lastWateringMoment = plant.getLastWateringMoment(
        plantData.wateringHistory
      );
      const nextWateringMoment = plant.getNextWateringMoment(
        lastWateringMoment,
        wateringTime,
        plantData.interval
      );

      return (
        <RectButton
          onPress={() => {
            navigation.navigate("Plant", {
              plantId,
              initialData: plantData,
            });
          }}
          key={i}
        >
          <View style={styles.plantContainer}>
            <Ionicons name="ios-leaf" size={width / 5} color="black" />
            <Text>{plantData.name}</Text>
            {_createTimerString(lastWateringMoment, nextWateringMoment)}
          </View>
        </RectButton>
      );
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.buttonContainer}>
        <View style={{ ...styles.button, backgroundColor: "green" }}>
          <RectButton
            onPress={() => {
              navigation.navigate("NewPlant");
            }}
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.buttonText}>
              <FontAwesome5 name="seedling" size={50} color="white" />
            </Text>
          </RectButton>
        </View>
        <View style={{ ...styles.button, backgroundColor: "blue" }}>
          <RectButton
            onPress={() => {
              plant.waterAll(plantsDocs, wateringTime);
            }}
            style={{
              width: "100%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.buttonText}>
              <Ionicons name="ios-water" size={50} color="white" />
            </Text>
          </RectButton>
        </View>
      </View>
      <ScrollView>
        <View style={styles.plantsContainer}>{renderPlants()}</View>
      </ScrollView>
    </View>
  );
};

// <TouchableOpacity
//   style={{
//     borderWidth: 1,
//     borderColor: "rgba(0,0,0,0.2)",
//     alignItems: "center",
//     justifyContent: "center",
//     width: 100,
//     height: 100,
//     backgroundColor: "#fff",
//     borderRadius: 50,
//   }}
// >
//   <Ionicons name="ios-water" size={50} color="white" />
// </TouchableOpacity>

const mapStateToProps = (state) => ({
  userID: state.auth.user.uid,
  wateringTime: state.auth.settings.wateringTime,
});

export default connect(mapStateToProps)(PlantsScreen);
