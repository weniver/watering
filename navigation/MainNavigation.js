import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import BottomTabNavigator from "./BottomTabNavigator";
import LoginScreen from "../screens/LoginScreen.js";

const Stack = createStackNavigator();

export default MainNavigation = props => {
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
                backgroundColor: "#000"
              },
              headerTitleAlign: "center",
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontWeight: "bold"
              }
            }}
          />
        ) : (
          <Stack.Screen
            name="Auth"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
