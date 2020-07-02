import React, { useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import LoginScreen from "../screens/LoginScreen.js";
import SignUpScreen from "../screens/SignUpScreen.js";

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
            }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false, animationEnabled: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false, animationEnabled: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, { handleSignOut, getLocalUser })(
  MainNavigation
);
