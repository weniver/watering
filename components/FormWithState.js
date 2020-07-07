import React, { useReducer, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Card from "./Card.js";

//Reducer Actions
const SHOW_ERRORS = "SHOW_ERRORS";
const UPDATE_INPUT_VALUE = "UPDATE_INPUT_VALUE";
const UPDATE_INPUT_ERRORS = "UPDATE_INPUT_ERRORS";

//Form State Reducer, for managing input errors, values and if input was touched
const formReducer = (state, action) => {
  if (action.type === UPDATE_INPUT_VALUE) {
    const updatedValue = {
      ...state,
      [action.input]: {
        ...state[action.input],
        value: action.value,
      },
    };
    return updatedValue;
  }
  if (action.type === UPDATE_INPUT_ERRORS) {
    const updatedValue = {
      ...state,
      [action.input]: {
        ...state[action.input],
        errors: action.errors,
        valid: action.valid,
      },
    };
    return updatedValue;
  }
  if (action.type === SHOW_ERRORS) {
    const updatedValue = {
      ...state,
      [action.input]: { ...state[action.input], touched: true },
    };
    return updatedValue;
  }
  return state;
};

const Form = (props) => {
  //Initial state helper, create one input state-key per children
  const createInitialState = useCallback(
    (children) => {
      let inputs = {};
      React.Children.map(children, (inputElement) => {
        let key = inputElement.props.id;
        inputs[key] = {
          value: "",
          errors: [],
          type: inputElement.props.type,
          optional: inputElement.props.optional ?? false,
          valid: inputElement.props.optional ?? false,
          touched: false,
          id: key,
        };
        if (inputElement.props.confirmId) {
          inputs[key].confirmId = inputElement.props.confirmId;
        }
      });
      return inputs;
    },
    [props.children]
  );

  //Initialize Form State
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    createInitialState(props.children)
  );

  //Check input value validity and uptades input errors, is uses prop type to know how to validate
  //if your input type is password confimation pass also the prop confirmId to get the value to compare from state
  const validate = (text, inputProps) => {
    if (!!props.skipClientSideValidations) {
      return;
    } else {
      const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const passwordRegexContainsNumber = /.*[0-9].*/;

      let errors = [];
      if (!inputProps.optional && text.trim().length === 0) {
        errors.push("This can't be blank.");
      }
      if (inputProps.type === "email" && !emailRegex.test(text.toLowerCase())) {
        errors.push("Please use a valid email.");
      }
      if (inputProps.type === "password") {
        if (text.trim().length < 8) {
          errors.push(`Must be at least 8 characters long.`);
        }
        if (!passwordRegexContainsNumber.test(text)) {
          errors.push(`Must contain at least one number.`);
        }
      }
      if (
        inputProps.type === "password-confirmation" &&
        text !== formState[inputProps.confirmId].value
      ) {
        errors.push(`The password confirmation does not match`);
      }
      if (inputProps.optional && text.trim().length === 0) {
        errors = [];
      }

      let valid = errors.length === 0;

      dispatchFormState({
        errors: errors,
        type: UPDATE_INPUT_ERRORS,
        valid: valid,
        input: inputProps.id,
      });
    }
  };

  //updates input touched value
  const onBlurHandler = (inputId) => {
    dispatchFormState({ type: SHOW_ERRORS, input: inputId });
  };

  //Use Form props to pass a onSubmitHandler to handle data once is validated.
  const onFormSubmit = () => {
    let formIsValid = isFormValid();
    if (formIsValid) {
      props.onFormSubmit(formState);
    } else {
      props.onFormSubmit(formState);
    }
  };

  //Helper to check all form inputs validities and overall form validity on submit
  const isFormValid = () => {
    let validity = true;
    if (!props.skipClientSideValidations) {
      for (const inputId in formState) {
        validate(formState[inputId].value, formState[inputId]);
        dispatchFormState({ type: SHOW_ERRORS, input: inputId });
        validity = validity && formState[inputId].valid;
      }
    }
    return validity;
  };

  // Updates input value and validity on inputTextChange (you need to pass this handler to all inputs)
  const onChangeText = useCallback(
    (inputValue, inputProps) => {
      validate(inputValue, inputProps);
      dispatchFormState({
        type: UPDATE_INPUT_VALUE,
        value: inputValue,
        input: inputProps.id,
      });
    },
    [formState, dispatchFormState]
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Card>
          {props.serverSideError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{props.serverSideError}</Text>
            </View>
          )}
          {React.Children.map(props.children, (ele, i) => {
            return React.cloneElement(ele, {
              key: i,
              errors: formState[ele.props.id].errors,
              onChangeText: (text) => {
                onChangeText(text, ele.props);
              },
              touched: formState[ele.props.id].touched,
              value: formState[ele.props.id].value,
              onBlur: (e) => {
                onBlurHandler(ele.props.id);
              },
            });
          })}
          <View
            style={{ ...styles.buttonsContainer, ...props.buttonAlignment }}
          >
            <RectButton
              style={{ ...styles.button, ...props.buttonStyle }}
              onPress={onFormSubmit}
            >
              <Text style={{ ...styles.buttonText, ...props.buttonTextStyle }}>
                {props.buttonText ?? "Submit"}
              </Text>
            </RectButton>
          </View>
        </Card>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", justifyContent: "center" },
  buttonsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  button: {
    height: 40,
    minWidth: "50%",
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  buttonText: { fontSize: 20, color: "white", marginHorizontal: 15 },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    fontSize: 13,
  },
});

export default Form;
