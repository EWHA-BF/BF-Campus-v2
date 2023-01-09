import React, { useState, useEffect, useContext } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  query,
  onSnapshot,
  GeoPoint,
} from "firebase/firestore";
import { DB } from "../firebase";
import { BottomSheet } from "react-native-btr";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import { ThemeContext } from "styled-components";

export default function Map({ navigation }) {
  const theme = useContext(ThemeContext);

  // BottomSheet
  const [visible, setVisible] = useState(false);
  // Modal
  const [showModal, setShowModal] = useState(false);
  
  // 장애물 목록
  const [marks, setMarks] = useState([]);
  // 장애물 정보
  const [marker, setMarker] = useState({});

  // 건물 목록
  const [boards, setBoards] = useState([]);
  // 건물 정보
  const [building, setBuilding] = useState({});


  // markers collection 모든 문서 불러오기
  useEffect(() => {
    const q = query(collection(DB, "markers"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({
          title: doc.data().title,
          content: doc.data().content,
          image: doc.data().image,
          markerId: doc.data().markerId,
          postId: doc.data().postId,
          loc: new GeoPoint(doc.data().loc.latitude, doc.data().loc.longitude),
        });
      });
      setMarks(list);
    });
    return () => unsubscribe();
  }, []);

  // board collection 모든 문서 불러오기
  useEffect(() => {
    const q = query(collection(DB, "boards"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list=[];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      //boards 변수 업데이트
      setBoards(list); 
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.561025,
          longitude: 126.94654,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01 * (Dimensions.get("window").width / Dimensions.get("window").height), 
        }}
        provider={PROVIDER_GOOGLE}
        maxZoomLevel={30}
      >
        {/* marks 배열에서 하나씩 꺼내서 marker 찍기 */}
        {marks.map((item, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: item.loc.latitude,
                longitude: item.loc.longitude,
              }}
              title={`${index + 1}` + "번 장애물"}
              onPress={() => {
                setShowModal(!showModal);
                // marker 값 설정
                setMarker(item);
              }}
            >
              <AntDesign name="warning" size={24} color="#D30000" />
            </Marker>
          );
        })}

        {/* boards 배열에서 하나씩 꺼내서 marker 찍기 */}
        {boards.map((item, index) => {
          return (
            <Marker
              key={index}
              coordinate={{
                latitude: item.loc.latitude,
                longitude: item.loc.longitude,
              }}
              title={item.title}
              onPress={() => {
                setVisible(!visible);
                setBuilding(item);
              }}
            >
              <FontAwesome5 name="building" size={24} color="#AAAAAA" />
            </Marker>
          );
        })}
      </MapView>

      {/* 장애물 제보 버튼 */}
      <TouchableOpacity
        onPress={() => navigation.navigate("CreatePost")}
        style={{
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.errText,
          width: 110,
          padding: 10,
          borderRadius: 20,
          position: "absolute",
          bottom: "7%",
          right: 20,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: "white",
            fontWeight: "bold",
          }}
        >
          장애물 제보
        </Text>
      </TouchableOpacity>

      {/* 장애물 정보 이동 modal */}
      <Modal
        animationType={"slide"}
        transparent={false}
        visible={showModal}
        onRequestClose={() => {
        }}
      >
        <View style={styles.modal}>
          <Text style={styles.modalText}>
            해당 장애물에 대해{"\n"} 더 알아보시겠습니까?{"\n"}
          </Text>
          {/* 장애물 게시글 확인 버튼 */}
          <TouchableOpacity
            onPress={() => {
              setShowModal(!showModal);
              // 장애물 게시글 화면으로 이동
              navigation.navigate("MarkerPost", {
              title: marker.title,
              content: marker.content,
              image: marker.image,
              });
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.d_btnBgColor,
              width: 220,
              padding: 15,
              marginTop: 30,
              borderRadius: 10,
              marginBottom: 150,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "white",
                fontWeight: "600",
              }}
            >
              장애물 게시글 확인하기
            </Text>
          </TouchableOpacity>

          {/* 지도로 돌아가기 버튼 */}
          <TouchableOpacity
            onPress={() => {
              setShowModal(!showModal);
            }}
            style={{
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "white",
              width: 200,
              marginTop: 50,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: theme.greenText,
                fontWeight: "bold",
              }}
            >
              지도로 돌아가기
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* 건물 정보 Bottom Sheet */}
      <BottomSheet
        //BottomSheet이 보이도록 설정
        visible={visible}
        onBackButtonPress={() => setVisible(!visible)}
        onBackdropPress={() => setVisible(!visible)}
      >
        <View style={styles.bottomNavigationView}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* 건물 이름 */}
            <Text
              style={{
                textAlign: "center",
                fontSize: 26,
                color: "black",
                fontWeight: "bold",
                marginTop: 30,
              }}
            >
              {building.title}
            </Text>
            {/* 건물 설명 */}
            <Text
              style={{
                textAlign: "center",
                margin: 25,
                fontSize: 19,
                lineHeight: 40,
              }}
            >
              {building.des1}
              {"\n"} {building.des2}
              {"\n"} {building.des3}
            </Text>
            {/* 건물 게시판 이동 버튼 */}
            <TouchableOpacity
              onPress={() => {
                setVisible(!visible);
                // 전체 게시판
                if (building.boardId == "All") {
                  navigation.navigate("AllBoard", {
                    boardId: "All",
                    boardTitle: building.title,
                    starUsers: building.starUsers,
                  });
                }
                // 건물 게시판
                else {
                  navigation.navigate("Board", {
                    boardId: building.boardId,
                    boardTitle: building.title,
                    starUsers: building.starUsers,
                  });
                }
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: theme.d_btnBgColor,
                width: 200,
                padding: 15,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: "white",
                  fontWeight: "600",
                }}
              >
                게시판으로 이동
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </BottomSheet>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 20,
  },
  bottomNavigationView: {
    backgroundColor: "#fff",
    width: "100%",
    height: 400,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  scrollView: {
    backgroundColor: "#fff",
    width: "90%",
  },
  text: {
    fontSize: 42,
  },
  modalText: {
    fontSize: 22,
    textAlign: "center",
    lineHeight: 40,
    fontWeight: "600",
    marginTop: 100,
  },
  modal: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
