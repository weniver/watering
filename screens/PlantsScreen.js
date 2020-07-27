import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback, useReducer } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import Colors from "../constants/Colors";
import { useDimensions } from "@react-native-community/hooks";
import { Feather } from "@expo/vector-icons";
import { getPlants } from "../store/actions/plants.js";
import { db, auth } from "../config/firebase.js";

const PlantsScreen = (props) => {
  const { width, height } = useDimensions().window;
  const [plantsDocs, setPlantsDocs] = useState([]);

  useEffect(() => {
    props.getPlants();
  }, []);

  useEffect(() => {
    let userPlantsQuery = db
      .collection("plants")
      .where("user", "==", `${props.userID}`)
      .where("active", "==", true);

    let unsubscribe = userPlantsQuery.onSnapshot(
      (querySnapshot) => {
        let rawDocs = querySnapshot.docs;
        setPlantsDocs(rawDocs);
      },
      (e) => {
        console.log(e.message);
        props.setError(e);
      }
    );
    return () => {
      unsubscribe();
    };
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
    return plantsDocs.map((plantDoc, i) => {
      const { name, timePeriod, user } = plantDoc.data();
      const plantId = plantDoc.id;
      return (
        <RectButton
          onPress={() => {
            props.navigation.navigate("Plant", {
              plantId,
              initialData: { name, timePeriod, user },
            });
          }}
          key={i}
        >
          <View style={styles.plantContainer}>
            <Feather name="target" size={width / 5} color="black" />
            <Text>{name}</Text>
            <Text>{timePeriod}</Text>
            <Text>{user}</Text>
            <Text>{plantId}</Text>
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
              console.log(plants[0].data());
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
  userID: state.auth.user.uid,
});

export default connect(mapStateToProps, { getPlants })(PlantsScreen);
