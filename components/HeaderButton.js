
import * as React from 'react';
import { Feather } from "@expo/vector-icons";
//ReactNavigation
//Libraries
import { TouchableOpacity } from "react-native-gesture-handler";import {
  View,
} from "react-native";

export default function HeaderButton(props) {
  return (
    <TouchableOpacity
      onPress={() => {
        props.navigation.navigate("Settings");
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 15,
        }}
      >
        <Feather
          name={props.name || "settings"}
          size={props.size || 30}
          color={props.color || "black"}
        />
      </View>
    </TouchableOpacity>
  );
}
