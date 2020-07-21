import React, { useState } from "react";
import { StyleSheet, View, Slider, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

import Colors from "../constants/Colors.js";

const WaterSlider = (props) => {
  const [value, setValue] = useState(0);
  const iconHelper = (days) => {
    let imageSrc;
    if (days >= 1 && days < 10) {
      imageSrc = "cloud-rain";
    } else if (days >= 10 && days < 20) {
      imageSrc = "cloud-drizzle";
    } else {
      imageSrc = "cloud";
    }
    return <View style={{marginTop: 20}}><Feather name={`${imageSrc}`} size={80} color="black" /></View>;
  };

  return (
    <View style={{ ...styles.container, ...props.container }}>
      {props.label && <Text>{props.label}</Text>}
      {props.hideValue ||
        (props.customValueComponent ? (
          props.customValueComponent(value || props.value)
        ) : (
          <Text>{value || props.value}</Text>
        ))}
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={1}
        maximumValue={30}
        step={1}
        id="slider"
        thumbTintColor="blue"
        minimumTrackTintColor="blue"
        onValueChange={(v) => {
          setValue(v);
        }}
        {...props}
      />
      {iconHelper(value || props.value)}
    </View>
  );
};

const styles = StyleSheet.create({ container: { alignItems: "center" } });

export default WaterSlider;
