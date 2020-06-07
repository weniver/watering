import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { MonoText } from "../components/StyledText";
import Colors from "../constants/Colors";

import { increaseCount, decreaseCount } from "../store/actions/counter.js";

const ReduxScreen = props => {
  return (
    <View style={styles.container}>
      <View style={styles.counterContainer}>
        <MonoText style={{ ...styles.counterText, ...setCountFontSize(props.count) }}>
          {props.count}</MonoText>
      </View>
      <View style={styles.buttonsContainer}>
        <CounterButton
          text="-"
          height="100%"
          width="50%"
          backgroundColor={Colors.red}
          color={Colors.darkGray}
          onPress={() => {
            props.decreaseCount();
          }}
        />
        <CounterButton
          text="+"
          height="100%"
          width="50%"
          backgroundColor={Colors.green}
          color={Colors.darkGray}
          onPress={() => {
            props.increaseCount();
          }}
        />
      </View>
    </View>
  );
};

const setCountFontSize = (count, round = 1, fontSize = 200) => {
  if (count.toString().length === round) {
    return { fontSize: fontSize };
  } else {
    round++;
    fontSize *= 0.84;
    return setCountFontSize(count, round, fontSize);
  }
};

const CounterButton = ({
  text,
  height,
  width,
  backgroundColor,
  color,
  onPress
}) => {
  return (
    <RectButton
      style={{
        ...styles.button,
        width: width,
        height: height,
        backgroundColor: backgroundColor
      }}
      onPress={onPress}
    >
      <MonoText style={{ ...styles.buttonText, color: color }}>{text}</MonoText>
    </RectButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkGray
  },
  counterContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "80%"
  },
  counterText: { fontSize: 200, color: Colors.tintColor },
  buttonsContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "20%"
  },
  button: { alignItems: "center", justifyContent: "center" },
  buttonText: { fontSize: 60, textAlign: "center" }
});

const mapStateToProps = state => ({
  count: state.counter.count
});

export default connect(
  mapStateToProps,
  { increaseCount, decreaseCount }
)(ReduxScreen);
