import React, { useEffect, useCallback, useReducer } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";

import Card from "../components/Card.js";
import Form from "../components/FormWithState.js";
import FormTextInput from "../components/TextInputNoState.js";
import { TouchableOpacity } from "react-native-gesture-handler";

const LoginScreen = (props) => {
  return (
    <View style={styles.container}>
      <Form
        onFormSubmit={(data) => {
          console.log(data);
        }}
      >
        <FormTextInput
          type="email"
          id="email"
          label="email:"
          keyboardType="email-address"
        />
        <FormTextInput type="password" id="password" label="password:" />
      </Form>
      <TouchableOpacity
        onPress={() => {
          props.navigation.replace("SignUp");
        }}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>SignUp</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  buttonContainer: {
    marginHorizontal: "5%",
    backgroundColor: "pink",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    marginVertical: "5%",
  },
});

export default LoginScreen;
