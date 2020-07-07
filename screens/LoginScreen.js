import React, { useEffect, useState, useCallback, useReducer } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

import Card from "../components/Card.js";
import Form from "../components/FormWithState.js";
import FormTextInput from "../components/TextInputNoState.js";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { handleSignIn } from "../store/actions/auth.js";
import {errorMessage} from "../helpers/firebaseHelpers.js"

const LoginScreen = (props) => {
const [serverSideError, setServerSideError] = useState(false);

  const handleSignIn = async (data) => {
    try {
      if (data) {
        await props.handleSignIn(data.email.value, data.password.value);
      }
    } catch (e) {
          setServerSideError(errorMessage(e))
    }
  };

  return (
    <View style={styles.container}>
      <Form
        onFormSubmit={handleSignIn}
        skipClientSideValidations={true}
        serverSideError={serverSideError}
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

export default connect(null, { handleSignIn })(LoginScreen);
