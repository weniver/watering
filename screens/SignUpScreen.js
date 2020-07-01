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

const SignUpScreen = (props) => {
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
        <FormTextInput type="password-confirmation" id="password-confirmation" confirmId="password" label="confirm password:" />
      </Form>
      <TouchableOpacity
        onPress={() => {
          props.navigation.replace("Login");
        }}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>LogIn</Text>
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

export default SignUpScreen;
