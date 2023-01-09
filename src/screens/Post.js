import React, { useLayoutEffect, useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "styled-components";
import {
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import Checkbox from "expo-checkbox";
import { TimeStamp } from "../components";
import { getCurUser, DB } from "../firebase";
import {
  doc,
  deleteDoc,
  collectionGroup,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";


const Container = styled.View`
  flex: 1;
  background-color: white;
  align-items: center;
  justify-content: flex-start;
  padding: 10px 20px;
`;

const StyledText = styled.Text`
  font-size: 18px;
  background-color: white;
  color: black;
`;

const StyledInput = styled.TextInput`
  background-color: white;
  color: black;
  padding: 13px;
  font-size: 18px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 5px;
  width: 100%;
  margin-top: 20px;
`;

const StyledImg = styled.Image`
  width: ${Dimensions.get("window").width - 50}px;
  height: ${Dimensions.get("window").width - 50}px;
  border-radius: 10px;
  margin: 20px;
  margin-bottom: 100px;
`;

const HeaderText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: 40px;
  padding: 0 10px;
`;

const HeaderInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding-top: 20px;
  padding-horizontal: 10px;
`;

const Post = ({ navigation, route }) => {
  const theme = useContext(ThemeContext);

  //user 불러오기
  const curUser = getCurUser();

  const storage = getStorage();

  //삭제 함수
  const _handleDeleteBtnPress = async () => {
    Alert.alert("글 삭제", "정말로 삭제하시겠습니까?", [
      {
        text: "취소",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "삭제",
        onPress: async () => {
          // post 삭제
          // 컬렉션 그룹 - title 확인해서 삭제하기
          const q = query(
            collectionGroup(DB, "posts"),
            where("title", "==", route.params.title)
          );
          const data = await getDocs(q);
          // 여러 개 있으면 모두 삭제
          data.docs.map(async (item, index) => {
            await deleteDoc(data.docs[index].ref);
          });

          // marker 삭제
          await deleteDoc(doc(DB, "markers", `${route.params.markerId}`));

          // image 삭제
          const desertRef = ref(storage, `post/${route.params.id}/photo.jpg`);
          await deleteObject(desertRef).then(() => {
            // 화면 이동
            navigation.goBack();
          }).catch((error) => {
            Alert.alert("다시 시도해 주세요.");
          });
        },
      },
    ]);
  };

  //header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "글",
      // 삭제 버튼
      headerRight: () => {
        return (
          route.params.uid == curUser.uid && (
            <TouchableOpacity
              onPress={_handleDeleteBtnPress}
              style={{
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 8,
                backgroundColor: theme.errText,
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  color: "white",
                }}
              >
                삭제
              </Text>
            </TouchableOpacity>
          )
        );
      },
    });
  });

  return (
    <ScrollView>
      <Container>
        {/* 헤더 */}
        <HeaderText>
          <StyledText>익명의 이화인</StyledText>
          <StyledText
            style={{
              fontSize: 15,
            }}
          >
            {TimeStamp(route.params.createdAt)}
          </StyledText>
        </HeaderText>

        {/* 긴급, 기간 */}
        <HeaderInfo style={{ marginVertical: -20 }}>
          {/* 긴급 */}
          <View
            style={{
              width: "auto",
              height: "auto",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignContent: "flex-start",
            }}
          >
            <Checkbox value={route.params.isEmer} disabled={true} />
            <Text
              style={{
                marginLeft: 12,
                fontSize: 15,
                color: theme.errText,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              긴급
            </Text>
          </View>
          {/* 기간 */}
          {/* 미정일 경우 미정으로 표시 */}
          {route.params.startDate !== "" ? (
            <StyledText style={{ fontSize: 13 }}>
              {route.params.startDate} ~ {route.params.endDate}
            </StyledText>
          ) : (
            <StyledText style={{ fontSize: 13 }}>기간 미정</StyledText>
          )}
        </HeaderInfo>

        {/* 제목 */}
        <StyledInput
          label="title"
          value={route.params.title}
          editable={false}
        />

        {/* 내용 */}
        <StyledInput
          label="desc"
          value={route.params.content}
          multiline={true}
          style={{
            height: 300,
            maxHeight: 300,
            textAlignVertical: "top",
          }}
          editable={false}
        />

        {/* 이미지 */}
        <StyledImg source={{ uri: route.params.image }} />
      </Container>
    </ScrollView>
  );
};

export default Post;
