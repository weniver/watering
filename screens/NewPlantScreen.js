import React, { useEffect, useState, useCallback, useReducer } from "react";
import { StyleSheet, Text, View, Slider } from "react-native";
import { useDimensions } from "@react-native-community/hooks";
import Form from "../components/FormWithStateNoCard.js";
import InputText from "../components/TextInputNoState.js";
import WaterSlider from "../components/WaterSlider.js";
import { useHeaderHeight } from "@react-navigation/stack";

const NewPlantScreen = (props) => {
  const [value, setValue] = useState(0);
  const { width, height } = useDimensions().window;
  const headerHeight = useHeaderHeight();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 30,
      marginTop: headerHeight,
    },
    plantImage: {
      width: width / 2.6,
      height: width / 2.6,
      borderWidth: 4,
      borderRadius: width / 5.2,
    },
    daysText: { fontSize: 40, fontWeight: "bold", marginVertical: 10 },
  });

  return (
    <View style={styles.container}>
      <Form skipClientSideValidations={true}>
        <WaterSlider
          initialValue={10}
          id="slider"
          customValueComponent={(value) => {
            return (
              <Text style={styles.daysText}>
                {value === 1 ? "todos los días" : `cada ${value} días`}
              </Text>
            );
          }}
          label="¿CADA CUÁNTOS DÍAS NECESITAS REGARLA?"
        />
        <InputText type="name" id="name" label="¿QUIERES PONERLE NOMBRE A TU PLANTA" />
      </Form>
    </View>
  );
};

export default NewPlantScreen;
