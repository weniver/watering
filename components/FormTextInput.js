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
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : "",
    isValid: props.optional ?? false,
    touched: false,
    errors: []
  });

  //You define conts with the props that you need, to prevent passing the whole props
  //which would cause unnecessary re-renders
  const { onInputChange, id } = props;

  //Only run onInputChange(pass current input value to form values) if field is touched
  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  //VALIDATION: valid email, min length, empty, required
  const textChangeHandler = text => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    dispatch({ type: CLEAR_ERRORS });
    // Si no es requerido y esta vacio debe quitar errores y poner valido
    // if (!props.optional && text.trim().length !== 0) {
    //   console.log("0");
    // }
    if (!props.optional && text.trim().length === 0) {
      isValid = false;
      dispatch({ type: SET_ERROR_MESSAGE, error: "This can't be blank." });
    }
    if (props.type === "email" && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
      dispatch({ type: SET_ERROR_MESSAGE, error: "Please use a valid email." });
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

  const lostFocusHandler = e => {
    if (
      !inputState.touched &&
      !props.optional &&
      e.nativeEvent.text.trim().length === 0
    ) {
      dispatch({ type: SET_ERROR_MESSAGE, error: "This can't be blank." });
    }
    dispatch({ type: INPUT_BLUR });
  };

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
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
        secureTextEntry={props.type === "password"}
        {...props}
      />
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          {showListErrors(inputState.errors)}
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
