import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Text,
  Dimensions,
  SafeAreaView,
  Image,
} from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import {
  ArtAud,
  ArtBus,
  ArtCul,
  ArtEcc,
  ArtEdu,
  ArtEng,
  ArtLib,
  ArtMus,
  ArtPos,
  ArtSci,
  AudBus,
  AudCul,
  AudEcc,
  AudEdu,
  AudEng,
  AudLib,
  AudMus,
  AudPos,
  AudSci,
  BusCul,
  BusEcc,
  BusEdu,
  BusEng,
  BusLib,
  BusMus,
  BusPos,
  BusSci,
  CulEcc,
  CulEdu,
  CulEng,
  CulLib,
  CulMus,
  CulPos,
  CulSci,
  EccEdu,
  EccEng,
  EccLib,
  EccMus,
  EccPos,
  EccSci,
  EduEng,
  EduLib,
  EduMus,
  EduPos,
  EduSci,
  EngLib,
  EngMus,
  EngPos,
  EngSci,
  LibMus,
  LibPos,
  LibSci,
  MusPos,
  MusSci,
  PosSci,
} from "../../assets/images";
import { ThemeContext } from "styled-components";

//빠른 길찾기 기본 화면

const { width, height } = Dimensions.get("window");

export default function FastRoute({ navigation, route }) {
  const theme=useContext(ThemeContext);
  const { params } = route;
  const [selectedImages, setSelectedImages] = useState();
  useEffect(() => {
    switch (`${route.params.pathIndex1}` + `${route.params.pathIndex2}`) {
      case "01":
        return setSelectedImages(ArtAud);
      case "02":
        return setSelectedImages(ArtBus);
      case "03":
        return setSelectedImages(ArtCul);
      case "04":
        return setSelectedImages(ArtEcc);
      case "05":
        return setSelectedImages(ArtEdu);
      case "06":
        return setSelectedImages(ArtEng);
      case "07":
        return setSelectedImages(ArtLib);
      case "08":
        return setSelectedImages(ArtMus);
      case "09":
        return setSelectedImages(ArtPos);
      case "010":
        return setSelectedImages(ArtSci);
      case "12":
        return setSelectedImages(AudBus);
      case "13":
        return setSelectedImages(AudCul);
      case "14":
        return setSelectedImages(AudEcc);
      case "15":
        return setSelectedImages(AudEdu);
      case "16":
        return setSelectedImages(AudEng);
      case "17":
        return setSelectedImages(AudLib);
      case "18":
        return setSelectedImages(AudMus);
      case "19":
        return setSelectedImages(AudPos);
      case "110":
        return setSelectedImages(AudSci);
      case "23":
        return setSelectedImages(BusCul);
      case "24":
        return setSelectedImages(BusEcc);
      case "25":
        return setSelectedImages(BusEdu);
      case "26":
        return setSelectedImages(BusEng);
      case "27":
        return setSelectedImages(BusLib);
      case "28":
        return setSelectedImages(BustMus);
      case "29":
        return setSelectedImages(BusPos);
      case "210":
        return setSelectedImages(BusSci);
      case "34":
        return setSelectedImages(CulEcc);
      case "35":
        return setSelectedImages(CulEdu);
      case "36":
        return setSelectedImages(CulEng);
      case "37":
        return setSelectedImages(CulLib);
      case "38":
        return setSelectedImages(CulMus);
      case "39":
        return setSelectedImages(CulPos);
      case "310":
        return setSelectedImages(CulSci);
      case "45":
        return setSelectedImages(EccEdu);
      case "46":
        return setSelectedImages(EccEng);
      case "47":
        return setSelectedImages(EccLib);
      case "48":
        return setSelectedImages(EccMus);
      case "49":
        return setSelectedImages(EccPos);
      case "410":
        return setSelectedImages(EccSci);
      case "56":
        return setSelectedImages(EduEng);
      case "57":
        return setSelectedImages(EduLib);
      case "58":
        return setSelectedImages(EduMus);
      case "59":
        return setSelectedImages(EduPos);
      case "510":
        return setSelectedImages(EduSci);
      case "67":
        return setSelectedImages(EngLib);
      case "68":
        return setSelectedImages(EngMus);
      case "69":
        return setSelectedImages(EngPos);
      case "610":
        return setSelectedImages(EngSci);
      case "78":
        return setSelectedImages(LibMus);
      case "79":
        return setSelectedImages(LibPos);
      case "710":
        return setSelectedImages(LibSci);
      case "89":
        return setSelectedImages(MusPos);
      case "810":
        return setSelectedImages(MusSci);
      case "910":
        return setSelectedImages(PosSci);
    }
  }, []);

  const scrollRef = React.useRef(null);
  // const onChangeIndex = ({ index, prevIndex }) => {
  //   console.log({ index, prevIndex });
  // };

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <SwiperFlatList
          showPagination
          ref={scrollRef}
          // onChangeIndex={onChangeIndex}
        >
          <SafeAreaView style={[styles.child]}>
            <Image //imageUrls={images}
              style={styles.image}
              source={selectedImages}
              renderIndicator={() => null}
            />
          </SafeAreaView>
        </SwiperFlatList>
      </View>

      {/* <View>
        <Text
          style={{
            position: "absolute",
            alignSelf: "center",
            top: "10%",
            fontSize: "15px",
          }}
        >
          swipe하여 상세 페이지를 확인할 수 있습니다.
        </Text>
      </View> */}
      <View
        style={{
          position: "absolute",
          bottom: "8%",
          alignSelf: "center",
          backgroundColor: "#fff",
          borderRadius: 25,
        }}
      >
        {/* 지도로 돌아가기 버튼 */}
        <TouchableOpacity
            onPress={()=> navigation.navigate("Map")}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'white',
              width: 200,
            }}
            >
            <Text style={{
              fontSize: 18,
              color: theme.greenText,
              fontWeight: 'bold'
            }}>지도로 돌아가기</Text>
          </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
  },
  child: {
    height: height * 0.75,
    width,
    justifyContent: "center",
  },
  text: {
    fontSize: width * 0.1,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 500,
  },
});
