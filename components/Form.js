import React, { useReducer, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";
const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
const CLEAR_ERRORS = "CLEAR_ERRORS";

//INPUT_VALIDATION you can use useReduces without redux when you want to manage
//complex states. You could also use severes useStates but that gets complicated really quick.
//You define the Reducer outside your component to prevent this function to define/rerun each rendercicle.
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

const Form = props => {
  //You need to add a key to inputValues and to inputValidities per input in the form
  //key must be the same as type prop in the input
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
        {props.childern}
        <Button title="Submit"/>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" }
});

export default Form;
