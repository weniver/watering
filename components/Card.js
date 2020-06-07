import React from "react";
import {
  StyleSheet,
  View,
} from "react-native";

import Colors from "../constants/Colors.js";

const Card = props => {
  return <View style={{...styles.card,...props.cardStyles}}>{props.children}</View>;
};

const styles = StyleSheet.create({
  card: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: "5%",
    paddingRight: "5%",
    paddingTop: "5%",
    paddingBottom: "5%",
    minHeight: "15%",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 12
    },
    shadowOpacity: 0.2,
    shadowRadius: 12.0,

    elevation: 24
  }
});

export default Card
