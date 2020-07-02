import React, { useEffect, useCallback, useReducer } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

import Card from "../components/Card.js";
import Form from "../components/FormWithState.js";
import FormTextInput from "../components/TextInputNoState.js";
import { TouchableOpacity } from "react-native-gesture-handler";

import { connect } from "react-redux";
import { handleSignUp } from "../store/actions/auth.js";

const SignUpScreen = (props) => {
  const handleSignUp = async (data) => {
    try {
      if (data) {
        await props.handleSignUp(data.email.value, data.password.value);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <Form onFormSubmit={handleSignUp}>
        <FormTextInput
          type="email"
          id="email"
          label="email:"
          keyboardType="email-address"
        />
        <FormTextInput type="password" id="password" label="password:" />
        <FormTextInput
          type="password-confirmation"
          id="password-confirmation"
          confirmId="password"
          label="confirm password:"
        />
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

export default connect(null, { handleSignUp })(SignUpScreen);
