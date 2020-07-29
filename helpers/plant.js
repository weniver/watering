import React from "react";
import { Text, View } from "react-native";
import moment from "moment";
import _ from "lodash";

export const water = async (docSnapshot) => {
  try {
    let docRef = docSnapshot.ref;
    let wateringHistory = docSnapshot.get("wateringHistory");
    let currentWateringTime = new Date().getTime();
    let updatedWateringHistory = [...wateringHistory, currentWateringTime];
    await docRef.update({ wateringHistory: updatedWateringHistory });
  } catch (e) {
    throw e;
  }
};

export const waterAll = async (queryDocSnapshot) => {
  try {
    queryDocSnapshot.forEach((docSnapshot) => {
      water(docSnapshot);
    });
  } catch (e) {
    throw e;
  }
};

export const digUp = async (docSnapshot) => {
  try {
    let docRef = docSnapshot.ref;
    await docRef.update({ active: false });
  } catch (e) {
    throw e;
  }
};

export const getLastWateringMoment = (wateringHistory) => {
  return moment(_.last(wateringHistory));
};

export const getNextWateringMoment = (
  lastWateringMoment,
  preferedWateringTime,
  interval
) => {
  return moment(lastWateringMoment)
    .add(interval, "days")
    .hour(preferedWateringTime.hour)
    .minute(preferedWateringTime.minute);
};

export const renderValueKeys = (object) => {
  let info = [];
  let counter = 1;
  for (const property in object) {
    info = [
      ...info,
      <View key={counter} style={{ flexDirection: "row", marginLeft: 20 }}>
        <Text style={{ fontWeight: "bold" }}>{`${property}:`}</Text>
        <Text>{` ${JSON.stringify(object[property])}`}</Text>
      </View>,
    ];
    counter++;
  }
  return info.map((a) => {
    return a;
  });
};
