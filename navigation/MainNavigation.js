//React
import React, { useEffect } from "react";
import { Button, View, Alert } from "react-native";
//Redux
import { connect } from "react-redux";
import { handleSignOut, getLocalUser } from "../store/actions/auth.js";
//Expo
import { Feather } from "@expo/vector-icons";
//ReactNavigation
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
//Libraries
import { TouchableOpacity } from "react-native-gesture-handler";
//Screens
import LoginScreen from "../screens/LoginScreen.js";
import SignUpScreen from "../screens/SignUpScreen.js";
import PlantsScreen from "../screens/PlantsScreen.js";
import SettingsScreen from "../screens/SettingsScreen.js";
import PasswordRecoveryScreen from "../screens/PasswordRecoveryScreen.js";
import TimePickerScreen from "../screens/TimePickerScreen.js";
//Components
import HeaderButton from "../components/HeaderButton.js";

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
              name="Plants"
              component={PlantsScreen}
              options={(props) => ({
                headerTransparent: true,
                headerTitle: "",
                headerRight: () => <HeaderButton {...props} />,
              })}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerTransparent: true,
                headerBackTitleVisible: false,
                headerTintColor: "black",
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
