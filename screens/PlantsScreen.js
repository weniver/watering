import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import Colors from "../constants/Colors";
import { useDimensions } from "@react-native-community/hooks";
import { getPlants } from "../store/actions/plants.js";
import { db, auth } from "../config/firebase.js";
import _ from "lodash";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";

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

  const createWateringMoments = (wateringHistory, interval) => {
    let lastWateringMoment = moment(_.last(wateringHistory));
    let nextWateringMoment = moment(lastWateringMoment)
      .add(interval, "days")
      .hour(wateringTime.hour)
      .minute(wateringTime.minute);
    return [lastWateringMoment, nextWateringMoment];
  };

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
    return plantsDocs.map((plantDoc, i) => {
      const plantData = plantDoc.data();
      const plantId = plantDoc.id;
      const [lastWateringMoment, nextWateringMoment] = createWateringMoments(
        plantData.wateringHistory,
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
        <View style={styles.button}>
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
  userID: state.auth.user.uid,
  wateringTime: state.auth.settings.wateringTime,
});

export default connect(mapStateToProps)(PlantsScreen);
