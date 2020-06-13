import React, { useReducer, useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Card from "./Card.js";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_TOUCHED = "INPUT_TOUCHED";
const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
const CLEAR_ERRORS = "CLEAR_ERRORS";

//INPUT_VALIDATION you can use useReduces without redux when you want to manage
//complex states. You could also use severes useStates but that gets complicated really quick.
//You define the Reducer outside your component to prevent this function to define/rerun each rendercicle.

const UPDATE_INPUT_VALUE = "UPDATE_INPUT_VALUE";

const formReducer = (state, action) => {
  if (action.type === UPDATE_INPUT_VALUE) {
    const updatedValue = {
      ...state,
      [action.input]: { ...state[action.input], value: action.value }
    };
    return updatedValue;
  }
  if (action.type === INPUT_TOUCHED) {
    const updatedValue = {
      ...state,
      [action.input]: { ...state[action.input], touched: true }
    };
    return updatedValue;
  }
  return state;
};

const Form = props => {
  const validate = text => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    let isValid = true;
    let errors = [];
    dispatch({ type: CLEAR_ERRORS });

    if (!props.optional && text.trim().length === 0) {
      isValid = false;
      errors.push("This can't be blank.");
    }
    if (props.type === "email" && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
      errors.push("Please use a valid email.");
    }
    if (props.minLength != null && text.trim().length < props.minLength) {
      isValid = false;
      dispatch({
        type: SET_ERROR_MESSAGE,
        error: `Must be at least ${props.minLength} characters long.`
      });
    }
    if (props.type === "password") {
      if (text.trim().length < 8) {
        isValid = false;
        dispatch({
          type: SET_ERROR_MESSAGE,
          error: `Must be at least 8 characters long.`
        });
      }
      if (!/.*[0-9].*/.test(text)) {
        isValid = false;
        dispatch({
          type: SET_ERROR_MESSAGE,
          error: `Must contain at least one number.`
        });
      }
    }
    if (props.optional && text.trim().length === 0) {
      isValid = true;
      dispatch({ type: CLEAR_ERRORS });
    }
    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const createInitialState = useCallback(
    children => {
      let inputs = {};
      React.Children.map(children, inputElement => {
        let key = inputElement.props.id;
        inputs[key] = {
          value: "",
          errors: [],
          type: inputElement.props.type,
          optional: inputElement.props.optional ?? false,
          valid: inputElement.props.optional ? true : false,
          touched: false
        };
      });
      return inputs;
    },
    [props.children]
  );

  const [formState, dispatchFormState] = useReducer(
    formReducer,
    createInitialState(props.children)
  );

  const onBlurHandler = inputId => {
    dispatchFormState({ type: INPUT_TOUCHED, input: inputId });
    console.log(props.children[0].props)
  };

  const handleLogIn = async (email, password) => {
    try {
      await props.handleSignIn(email, password);
    } catch (e) {
      setError(e);
    }
  };

  // Updates form state when any input changes (you need to pass this handler to all inputs)
  const onChangeText = useCallback(
    (inputValue, inputId) => {
      dispatchFormState({
        type: UPDATE_INPUT_VALUE,
        value: inputValue,
        input: inputId
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
            onChangeText: text => {
              onChangeText(text, ele.props.id);
            },
            value: formState[ele.props.id].value,
            onBlur: e => {
              onBlurHandler(ele.props.id);
            }
          });
        })}
        <View style={{ ...styles.buttonsContainer, ...props.buttonAlignment }}>
          <RectButton
            style={{ ...styles.button, ...props.buttonStyle }}
            onPress={() => {
              console.log(formState);
            }}
          >
            <Text style={{ ...styles.buttonText, ...props.buttonTextStyle }}>
              Console Log State
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
