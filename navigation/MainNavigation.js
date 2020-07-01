import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import LoginScreen from "../screens/LoginScreen.js";
import SignUpScreen from "../screens/SignUpScreen.js";

const Stack = createStackNavigator();

export default MainNavigation = (props) => {
  const auth = false;

  return (
    <NavigationContainer
      ref={props.containerRef}
      initialState={props.initialState}
    >
      <Stack.Navigator>
        {auth ? (
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
              options={{ headerShown: false, animationEnabled:false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false,animationEnabled:false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
