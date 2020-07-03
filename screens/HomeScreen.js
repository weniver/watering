import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { RectButton } from "react-native-gesture-handler";

import { connect } from "react-redux";
import { handleSignOut } from "../store/actions/auth.js";

const HomeScreen = (props) => {
  return (
    <View style={styles.container}>
      <RectButton
        style={styles.button}
        onPress={() => {
          props.handleSignOut()
        }}
      >
        <Text>Sign Out</Text>
      </RectButton>
    </View>
  );
}

export default connect(null, { handleSignOut })(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "pink",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
