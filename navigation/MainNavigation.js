import React, { useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import LoginScreen from "../screens/LoginScreen.js";
import SignUpScreen from "../screens/SignUpScreen.js";
import PasswordRecoveryScreen from "../screens/PasswordRecoveryScreen.js";
import TimePickerScreen from "../screens/TimePickerScreen.js";
import { Button } from "react-native";

import { connect } from "react-redux";
import { handleSignOut, getLocalUser } from "../store/actions/auth.js";

const Stack = createStackNavigator();

const MainNavigation = (props) => {
  useEffect(() => {
    props.getLocalUser();
  }, []);

  return (
    <NavigationContainer
      ref={props.containerRef}
      initialState={props.initialState}
    >
      <Stack.Navigator>
        {props.user ? (
          <>
            {props.settings.firstLogin && (
              <Stack.Screen
                name="SignUpTimePicker"
                component={TimePickerScreen}
                options={{ headerShown: false, animationEnabled: false }}
              />
            )}
            <Stack.Screen
              name="Root"
              component={BottomTabNavigator}
              options={{
                title: "Template Info",
                headerStyle: {
                  backgroundColor: "#000",
                },
                headerTitleAlign: "center",
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
                headerRight: () => (
                  <Button
                    onPress={() => console.log(props.settings)}
                    title="Info"
                    color="#fff"
                  />
                ),
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false, animationEnabled: false }}
            />
            <Stack.Screen
              name="PasswordRecovery"
              component={PasswordRecoveryScreen}
              options={{ title: "Reset your password" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  settings: state.auth.settings,
});

export default connect(mapStateToProps, { handleSignOut, getLocalUser })(
  MainNavigation
);
