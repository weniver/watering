import { Ionicons } from "@expo/vector-icons";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import Colors from "../constants/Colors";

const PlantsScreen = (props) => {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",alignItems: 'center',justifyContent: 'center'
  },
});

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {})(PlantsScreen);
