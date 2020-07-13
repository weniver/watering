import React, { useEffect, useState, useCallback, useReducer } from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";

import Card from "../components/Card.js";
import Form from "../components/FormWithState.js";
import FormTextInput from "../components/TextInputNoState.js";
import { TouchableOpacity } from "react-native-gesture-handler";
import { errorMessage } from "../helpers/firebaseHelpers.js";
import { auth } from "../config/firebase.js";
import Colors from "../constants/Colors.js"

const PasswordRecoveryScreen = (props) => {
  const [serverSideError, setServerSideError] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePasswordReset = async (data) => {
    try {
      let response = await auth.sendPasswordResetEmail(data.email.value);
      setSuccess(true);
    } catch (e) {
      setServerSideError(errorMessage(e));
    }
  };

  return (
    <View style={styles.container}>
      {success ? (
        <View style={styles.successMessageContainer}>
          <Text style={styles.successMessage}>
            Te enviamos un correo con instrucciones para resetear tu contraseña.
          </Text>
        </View>
      ) : (
        <Form
          onFormSubmit={handlePasswordReset}
          serverSideError={serverSideError}
          skipClientSideValidations
        >
          <FormTextInput
            type="email"
            id="email"
            label="email:"
            keyboardType="email-address"
          />
        </Form>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  successMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginHorizontal: "5%",
    backgroundColor: "pink",
    justifyContent: "center",
    alignItems: "center",
  },
  successMessage: {
    fontSize: 15,
    fontWeight: "bold", color: Colors.green
  },
  buttonText: {
    marginVertical: "5%",
  },
});

export default PasswordRecoveryScreen;
