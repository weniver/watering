import React, { useReducer, useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Card from "./Card.js";

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
  const createInitialState = useCallback(
    children => {
      let inputValues = {};
      let inputValidities = {};
      React.Children.map(children, inputElement => {
        let key = inputElement.props.id;
        inputValues[key] = "";
        inputValidities[key] = inputElement.props.optional ?? false;
      });
      return {
        inputValues: inputValues,
        inputValidities: inputValidities,
        formIsValid: false
      };
    },
    [props.children]
  );

  const [formState, dispatchFormState] = useReducer(
    formReducer,
    createInitialState(props.children)
  );

  const handleLogIn = async (email, password) => {
    try {
      await props.handleSignIn(email, password);
    } catch (e) {
      setError(e);
    }
  };

  // Updates form state when any input changes (you need to pass this handler to all inputs)
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
        {React.Children.map(props.children, (ele, i) => {
          return React.cloneElement(ele, {
            key: i,
            onInputChange: inputChangeHandler
          });
        })}
        <View style={{ ...styles.buttonsContainer, ...props.buttonAlignment }}>
          <RectButton
            style={{ ...styles.button, ...props.buttonStyle }}
            onPress={() => {
            }}
          >
            <Text style={{ ...styles.buttonText, ...props.buttonTextStyle }}>
              Submit
            </Text>
          </RectButton>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  buttonsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20
  },
  button: {
    height: 40,
    minWidth: "50%",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4
  },
  buttonText: { fontSize: 20, color: "white", marginHorizontal: 15 }
});

export default Form;
