import React, { useState } from "react";
import { View, Button, StyleSheet, Text, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";
import moment from "moment";

import { TouchableOpacity } from "react-native-gesture-handler";

import { connect } from "react-redux";
import { setWateringTime } from "../store/actions/auth.js";

const TimePickerScreen = (props) => {
  const [date, setDate] = useState(new Date());
  const [showAndroid, setShowAndroid] = useState(false);
  const [selectedTime, setSelectedTime] = useState(moment(date).format("LT"));
  const [modalVisible, setModalVisible] = useState(false);

  const onChange = (event, selectedDate) => {
    setShowAndroid(false);
    if (selectedDate) {
      setDate(selectedDate);
      setSelectedTime(moment(selectedDate).format("LT"))
    }
  };

  return (
    <View style={styles.container}>
      {showAndroid && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="time"
          onChange={onChange}
          display="spinner"
        />
      )}
      <Modal
        isVisible={modalVisible}
        animationIn="fadeIn"
        animationOut="fadeOut"
        backdropColor="white"
        backdropOpacity={0.8}
        onBackdropPress={() => {setModalVisible(false)}}
      >
        <View style={styles.modalView}>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="time"
            onChange={onChange}
          />
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Text style={styles.buttonText}>Selecionar Hora</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Text style={styles.questionText}>
        ¿A qué hora sueles regar tus plantas?
      </Text>
      <TouchableOpacity
        onPress={() => {
          if (Platform.OS === "ios") {
            setModalVisible(!modalVisible);
          } else {
            setShowAndroid(true);
          }
        }}
      >
        <Text style={styles.timeText}>{selectedTime}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          props.setWateringTime(date)
        }}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Regar</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    justifyContent: "space-between",
    padding: 25,
  },
  buttonContainer: {
    marginHorizontal: "5%",
    backgroundColor: "pink",
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 50,
    textAlign: "center",
    fontWeight: "bold",
  },
  questionText: { fontSize: 38, textAlign: "center" },
  buttonText: {
    marginVertical: "5%",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default connect(null, { setWateringTime })(TimePickerScreen);
