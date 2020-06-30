import React, { useEffect, useCallback, useReducer } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  ScrollView,
} from "react-native";

import Card from "../components/Card.js";
import Form from "../components/FormWithState.js";
import FormTextInput from "../components/TextInputNoState.js";

const LoginScreen = (props) => {
  return (
    <Form
      onFormSubmit={(data) => {
        console.log(data);
      }}
    >
      <FormTextInput
        type="email"
        id="email"
        label="email:"
        keyboardType="email-address"
      />
      <FormTextInput
        type="email"
        id="email2"
        label="email:"
        optional={true}
        keyboardType="email-address"
      />
      <FormTextInput type="password" id="password" label="password:" />
    </Form>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
});

export default LoginScreen;
