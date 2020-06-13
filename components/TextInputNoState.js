import React, { useReducer, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";
const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
const CLEAR_ERRORS = "CLEAR_ERRORS";

//INPUT_VALIDATION you can use useReduces without redux when you want to manage
//complex states. You could also use severes useStates but that gets complicated really quick.
//You define the Reducer outside your component to prevent this function to define/rerun each rendercicle.
const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        errors: []
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true
      };
    case SET_ERROR_MESSAGE:
      return {
        ...state,
        errors: [...state.errors, action.error]
      };
    default:
      return state;
  }
};

const FormTextInput = props => {
  const showListErrors = errors => {
    return errors.map((error, i) => {
      return (
        <Text key={i} style={styles.errorText}>
          {"\u2022 " + error}
        </Text>
      );
    });
  };
  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={styles.input}
        {...props}
      />
      {props.errors && props.touched && (
        <View style={styles.errorContainer}>
          {showListErrors(props.errors)}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%"
  },
  label: {
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#121212",
    borderBottomWidth: 2
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: "red",
    fontSize: 13
  }
});

export default FormTextInput;
