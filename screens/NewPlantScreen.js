import React, { useEffect, useState, useCallback, useReducer } from "react";
import { StyleSheet, Text, View, Slider } from "react-native";
import { useDimensions } from "@react-native-community/hooks";
import Form from "../components/FormWithStateNoCard.js";
import InputText from "../components/TextInputNoState.js";
import WaterSlider from "../components/WaterSlider.js";
import { useHeaderHeight } from "@react-navigation/stack";
import { createPlant } from "../store/actions/plants.js";
import { connect } from "react-redux";

const NewPlantScreen = (props) => {
  const [value, setValue] = useState(0);
  const { width, height } = useDimensions().window;
  const [serverSideError, setServerSideError] = useState(false);
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

  const handleCreatePlant = async (data) => {
    try {
      await props.createPlant(data.slider.value, data.name.value);
      props.navigation.navigate("Plants")
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  return (
    <View style={styles.container}>
      <Form
        skipClientSideValidations={true}
        onFormSubmit={handleCreatePlant}
        serverSideError={serverSideError}
      >
        <WaterSlider
          initialValue={1}
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
        <InputText type="name" id="name" label="nombre:" />
      </Form>
    </View>
  );
};

export default connect(null, { createPlant })(NewPlantScreen);
