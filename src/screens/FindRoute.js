import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Dimensions,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import { DB } from "../firebase";
import { theme } from "../theme";
import { Button } from "../components";

export default function FindRoute({ navigation }) {
  const [choosenSrcLabel, setChoosenSrcLabel] = useState("조형예술관");
  const [choosenSrcIndex, setChoosenSrcIndex] = useState("0");
  const [choosenDestLabel, setChoosenDestLabel] = useState("조형예술관");
  const [choosenDestIndex, setChoosenDestIndex] = useState("0");

  // 건물들 불러오기
  const [srcBuilding, setSrcBuilding] = useState([]);
  //building collection에서 모든 문서 읽어와서 marks 배열에 저장
  useEffect(() => {
    const q = query(collection(DB, "route"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({
          title: doc.data().title,
        });
      });
      setSrcBuilding(list);
    });
    return () => unsubscribe();
  }, []);

  const [destBuilding, setDestBuilding] = useState([]);
  //building collection에서 모든 문서 읽어와서 building 배열에 저장
  useEffect(() => {
    const q = query(collection(DB, "route"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({
          title: doc.data().title,
        });
      });
      setDestBuilding(list);
    });
    return () => unsubscribe();
  }, []);

  const [param1, setParam1] = useState(0);
  const [param2, setParam2] = useState(0);
  useEffect(() => {
    if (choosenSrcIndex > choosenDestIndex) {
      setParam1(choosenDestIndex);
      setParam2(choosenSrcIndex);
    } else {
      setParam1(choosenSrcIndex);
      setParam2(choosenDestIndex);
    }
  });

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
      <View style={styles.container}>
        {/* 출발지 선택 */}
        <Text style={styles.pickerText}>출발지 선택</Text>
        <Picker
          selectedValue={choosenSrcLabel}
          onValueChange={(itemValue, itemIndex) => {
            setChoosenSrcLabel(itemValue);
            setChoosenSrcIndex(itemIndex);
          }}
          style={{
            height: 140,
            marginBottom: 25,
            marginHorizontal: 20,
          }}
          itemStyle={{
            height: 140,
          }}
        >
          {/* route 배열에서 하나씩 꺼내서 picker 찍기 */}
          {srcBuilding.map((item, index) => {
            return (
              <Picker.Item key={index} label={item.title} value={item.title} />
            );
          })}
        </Picker>
        {/* 도착지 선택 */}
        <Text style={styles.pickerText}>도착지 선택</Text>
        <Picker
          selectedValue={choosenDestLabel}
          onValueChange={(itemValue, itemIndex) => {
            setChoosenDestLabel(itemValue);
            setChoosenDestIndex(itemIndex);
          }}
          style={{
            height: 140,
            marginHorizontal: 20,
            marginBottom: 25,
          }}
          itemStyle={{
            height: 140,
          }}
        >
          {/* route 배열에서 하나씩 꺼내서 picker 찍기 */}
          {destBuilding.map((item, index) => {
            return (
              <Picker.Item key={index} label={item.title} value={item.title} />
            );
          })}
        </Picker>
        <View style={styles.textBox}>
          <Text style={styles.text}> 출발지 ▶︎ {choosenSrcLabel}</Text>
          <Text style={styles.text}> 도착지 ▶︎ {choosenDestLabel}</Text>
        </View>
      </View>

      <View
        style={{
          width: "90%",
          alignSelf: "center",
        }}
      >
        <Button
          title="경로 설정 완료"
          onPress={(params) => {
            if (param1 == param2) {
              Alert.alert(
                "경로 설정 오류",
                "출발지와 도착지를 다르게 설정해주세요."
              );
            } else {
              console.log(param1, param2);
              navigation.navigate("FastRoute", {
                pathIndex1: param1,
                pathIndex2: param2,
              });
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    alignContent: "center",
    width: Dimensions.get("window").width,
  },
  textBox: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: "auto",
    alignSelf: "center",
    marginVertical: 10,
  },
  text: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: "bold",
    color: theme.greenText,
  },
  pickerText: {
    fontSize: 20,
    alignSelf: "flex-start",
    fontWeight: "bold",
    marginLeft: 25,
  },
});
