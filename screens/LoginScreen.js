import React, { useEffect, useCallback, useReducer } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button
} from "react-native";

import Card from "../components/Card.js";

import FormTextInput from "../components/FormTextInput.js";

// import { db, auth } from "../config/firebase.js";
// import { handleSignIn } from "../store/actions/auth.js";
// import { connect } from "react-redux";

//Form Reducer:
const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };

    //Checks if form is valid by iterating on all individual input validities
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
      inputValues: updatedValues,
      inputValidities: updatedValidities,
      formIsValid: updatedFormIsValid
    };
  }
  return state;
};

const LoginScreen = props => {
  //You need to add a key to inputValues and to inputValidities per input in the form
  //key must be the same as id prop in the input
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: ""
    },
    inputValidities: {
      email: false,
      password: false
    },
    formIsValid: false
  });

  // const handleLogIn = async (email, password) => {
  //   try {
  //     await props.handleSignIn(email, password);
  //   } catch (e) {
  //     setError(e);
  //   }
  // };

  //Updates form state when any input changes (you need to pass this handler to all inputs)
  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  return (
    <View style={styles.container}>
      <Card>
        <FormTextInput
          type="email"
          id="email"
          label="email:"
          onInputChange={inputChangeHandler}
        />
        <FormTextInput
          type="password"
          id="password"
          label="password:"
          onInputChange={inputChangeHandler}
        />

        <Button
          title="Submit"
          onPress={() => {
            console.log(formState);
          }}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" }
});

export default LoginScreen;

// export default connect(
//   null,
//   { handleSignIn }
// )(LoginScreen);
