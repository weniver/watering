import React, { useReducer, useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";

const FormTextInput = (props) => {
  const textInputRef = useRef();

  const focusInput = () => {
    textInputRef.current.focus();
  };

  const showListErrors = (errors) => {
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
      <TouchableWithoutFeedback onPress={focusInput}>
        <Text style={styles.label}>{props.label}</Text>
      </TouchableWithoutFeedback>
      <TextInput
        ref={textInputRef}
        style={styles.input}
        autoCapitalize={props.autoCapitalize ?? "none"}
        keyboardType={
          props.keyboardType ?? props.type === "email"
            ? "email-address"
            : "default"
        }
        secureTextEntry={
          props.secureTextEntry ??
          (props.type === "password" || props.type === "password-confirmation")
            ? true
            : false
        }
        {...props}
      />
      {props.errors.length !== 0 && props.touched && (
        <View style={styles.errorContainer}>
          {showListErrors(props.errors)}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
    marginVertical: 10,
  },
  label: {
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#121212",
    borderBottomWidth: 2,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: "red",
    fontSize: 13,
  },
});

export default FormTextInput;
